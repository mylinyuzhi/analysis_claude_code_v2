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
