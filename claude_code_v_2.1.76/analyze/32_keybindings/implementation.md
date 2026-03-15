# Keybindings Implementation

## Overview

Claude Code v2.1.38 introduces a customizable keybinding system that supports multi-key "chords", hot-reloading from a configuration file, and context-sensitive actions. Users can define their own shortcuts in `keybindings.json` to override or extend the default CLI behavior.

## Key Components

### 1. Keybinding Configuration

- **File**: `keybindings.json`
- **Loading**: `loadKeybindings` (`YS1`) reads the file and parses the JSON schema.
- **Hot-Reloading**: `watchKeybindingsFile` (`Lq7`) uses `chokidar` to monitor the configuration file and re-initialize the system without restarting the CLI.

### 2. Event Handling

- **KeybindingSetup** (`dX`): A React component that wraps the UI, providing the keybinding context and managing the "chord" state.
- **KeybindingHandler** (`x6Y`): The core logic that receives raw keyboard events and matches them against the registered bindings.

### 3. Chord Management

The system supports multi-step sequences like `Ctrl+K, Ctrl+C`. 
- **Timeout**: Hardcoded to 1000ms (`C6Y`). If the second key isn't pressed within 1 second, the chord is cancelled.
- **State**: Tracked via `pendingChord` in the `KeybindingSetup` component.

## Key Decisions & Algorithms

### [Algorithm] Key Matching with Chords

**How it works**:
1. When a key is pressed, the handler calls `matchKeybinding` (`tK6`).
2. It checks the current "active contexts" (e.g., "Global", "ModelPicker").
3. If no chord is pending:
   - It checks if the key matches a single-key shortcut.
   - It checks if the key *starts* a chord sequence. If so, it enters `chord_started` mode and sets a 1s timer.
4. If a chord *is* pending:
   - It checks if the new key completes the sequence (`match`).
   - If not, it cancels the chord (`chord_cancelled`).

**Why this approach**:
This VS Code-style chord system allows for a vast expansion of available keyboard real estate without relying on complex modifiers (like `Ctrl+Alt+Shift+...`).

### [Decision] Hot-Reloading for Improved UX

**Why this approach**:
CLI users often want to tweak their shortcuts while working. By using a file watcher, Claude Code allows users to edit `keybindings.json` and see the changes reflected immediately in the active terminal session.

## Code Snippets

// ============================================
// handleKeyEvent - Core event dispatcher for keybindings
// Location: chunks.110.mjs:988-1041
// ============================================

// ORIGINAL (for source lookup):
function x6Y(A) {
    let { bindings: K, pendingChordRef: Y, setPendingChord: z, ... } = A;
    return D8((_, J, X) => {
        let contexts = [...active, "Global"];
        let isChordActive = Y.current !== null;
        let match = tK6(_, J, contexts, K, Y.current);
        
        switch (match.type) {
            case "chord_started":
                z(match.pending);
                X.stopImmediatePropagation();
                break;
            case "match":
                z(null);
                if (isChordActive) {
                    executeHandler(match.action);
                    X.stopImmediatePropagation();
                }
                break;
            case "chord_cancelled":
                z(null);
                break;
        }
    }), null;
}

// READABLE (for understanding):
function KeybindingHandler(props) {
    const { bindings, pendingChordRef, setPendingChord } = props;

    // Hook into low-level input events
    useKeyboardInput((char, key, event) => {
        const contexts = [...getActiveContexts(), "Global"];
        const wasWaitingForChord = pendingChordRef.current !== null;
        
        // Attempt to match the input against the registry
        const result = matchKeybinding(char, key, contexts, bindings, pendingChordRef.current);
        
        switch (result.type) {
            case "chord_started":
                // First key of a chord sequence detected
                setPendingChord(result.pending);
                event.stopImmediatePropagation();
                break;
            case "match":
                // Valid shortcut (single or completed chord)
                setPendingChord(null);
                executeAction(result.action);
                event.stopImmediatePropagation();
                break;
            case "chord_cancelled":
                // Invalid sequence follow-up
                setPendingChord(null);
                break;
        }
    });

    return null;
}

// Mapping: x6Y→KeybindingHandler, tK6→matchKeybinding, z→setPendingChord, Y→pendingChordRef

## Related Symbols

- `KeybindingSetup` (`dX`) - Provider component.
- `loadKeybindings` (`YS1`) - File loader.
- `watchKeybindingsFile` (`Lq7`) - File watcher.
- `CHORD_TIMEOUT_MS` (`C6Y`) - 1000ms.

## Location References

- `chunks.110.mjs:931` - `KeybindingSetup` component.
- `chunks.110.mjs:988` - `handleKeyEvent` implementation.
- `chunks.54.mjs:1700` - `loadKeybindings` implementation.
- `chunks.54.mjs:1752` - `watchKeybindingsFile` implementation.
