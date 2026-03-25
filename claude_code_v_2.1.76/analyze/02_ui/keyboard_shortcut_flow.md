# Keyboard Shortcut Flow (Claude Code 2.1.76)

> Deep analysis of keyboard input handling, chord sequences, and keybinding customization.
>
> **Symbol Validation Status**: ✅ VERIFIED - All symbols cross-validated against source code.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - CLI, Keybindings

Key functions in this document:
- `parseKeystroke` - Parse keybinding string
- `KeybindingSetup` - Keybinding initialization at chunks.110.mjs
- `cycleMode` (hf1) - Permission mode cycling at chunks.183.mjs

---

## Overview

Claude Code's keyboard handling uses Ink's `useInput` hook combined with a custom keybinding system that supports:

1. **Single key bindings** - e.g., `Escape`, `Enter`, `Tab`
2. **Modified keys** - e.g., `Ctrl+C`, `Shift+Tab`
3. **Chord sequences** - e.g., `Ctrl+K D` (Ctrl+K followed by D)

---

## Keyboard Input Pipeline

### Input Processing Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    KEYBOARD INPUT PIPELINE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User presses key(s)                                                        │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Terminal (stdin)                                                     │    │
│  │ ───────────────────────────────────────────────────────────────    │    │
│  │ • Raw keypress events                                                │    │
│  │ • Escape sequences for special keys                                  │    │
│  │ • UTF-8 input for text                                               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Ink useInput hook                                                    │    │
│  │ ───────────────────────────────────────────────────────────────    │    │
│  │ Normalizes events to:                                                │    │
│  │ • input: string (character or sequence)                             │    │
│  │ • key: { name, ctrl, meta, shift, ... }                             │    │
│  │ • meta: { escape, ... }                                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ handleKeyEvent (sessionOrchestrator)                                 │    │
│  │ ───────────────────────────────────────────────────────────────    │    │
│  │ 1. Check chord state                                                 │    │
│  │ 2. Match against keybindings                                         │    │
│  │ 3. Execute action or start chord                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│         │                                                                    │
│         ├──────────────────────────────────────────────────────────────┐    │
│         │                                                              │    │
│         ▼ (Single key)                                                 ▼    │
│  ┌───────────────────────┐                               ┌───────────────────┐│
│  │ Execute Action        │                               │ Start Chord      ││
│  │                       │                               │                  ││
│  │ • Submit message      │                               │ Set chord state  ││
│  │ • Cancel stream       │                               │ Wait for next    ││
│  │ • Cycle mode          │                               │ key (timeout: 1s)││
│  │ • Toggle view         │                               │                  ││
│  └───────────────────────┘                               └───────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Chord Detection Algorithm

### Chord State Machine

```javascript
// ============================================
// Chord Detection State Machine
// Location: chunks.110.mjs (keybindings UI)
// ============================================

// READABLE (for understanding):
const ChordStateMachine = {
    // States
    IDLE: 'idle',
    CHORD_STARTED: 'chord_started',

    // State data
    state: {
        current: 'idle',
        prefix: null,
        timeout: null
    },

    // Timeout duration
    CHORD_TIMEOUT_MS: 1000,

    // Transition: IDLE → CHORD_STARTED
    startChord(prefix) {
        this.state.current = 'chord_started';
        this.state.prefix = prefix;

        // Auto-cancel after timeout
        this.state.timeout = setTimeout(() => {
            this.cancelChord();
        }, this.CHORD_TIMEOUT_MS);
    },

    // Transition: CHORD_STARTED → IDLE
    cancelChord() {
        this.state.current = 'idle';
        this.state.prefix = null;
        if (this.state.timeout) {
            clearTimeout(this.state.timeout);
            this.state.timeout = null;
        }
    },

    // Complete chord with second key
    completeChord(secondKey) {
        const fullChord = `${this.state.prefix} ${secondKey}`;
        this.cancelChord();
        return fullChord;
    }
};
```

### Key Event Handler

```javascript
// ============================================
// handleKeyEvent - Main key event handler
// Location: chunks.196.mjs (sessionOrchestrator)
// ============================================

// READABLE (for understanding):
function handleKeyEvent(event, chordState, setChordState, keybindings) {
    const { key, input } = event;

    // Format key for matching
    const keyString = formatKeyEvent(event);  // e.g., "Ctrl+K", "Escape"

    // Case 1: Chord in progress
    if (chordState.inProgress) {
        // Complete the chord
        const fullChord = `${chordState.prefix} ${keyString}`;

        // Look up action
        const action = keybindings[fullChord];
        if (action) {
            executeAction(action);
        } else {
            // Unknown chord, beep or ignore
            process.stdout.write('\x07');
        }

        // Reset chord state
        setChordState({ inProgress: false, prefix: null });
        return;
    }

    // Case 2: Check if this starts a chord
    const chordStarters = Object.keys(keybindings)
        .filter(k => k.includes(' '))
        .map(k => k.split(' ')[0]);

    if (chordStarters.includes(keyString)) {
        // Start chord timeout
        setChordState({ inProgress: true, prefix: keyString });

        // Auto-cancel after 1 second
        setTimeout(() => {
            setChordState({ inProgress: false, prefix: null });
        }, 1000);
        return;
    }

    // Case 3: Single key binding
    const action = keybindings[keyString];
    if (action) {
        executeAction(action);
    }
}

// Helper: Format key event to string
function formatKeyEvent(event) {
    const parts = [];

    if (event.key.ctrl) parts.push('Ctrl');
    if (event.key.meta) parts.push('Meta');
    if (event.key.shift && event.key.name !== 'shift') parts.push('Shift');

    const keyName = event.key.name || event.input;
    if (keyName && !['ctrl', 'meta', 'shift'].includes(keyName.toLowerCase())) {
        parts.push(keyName.toUpperCase());
    }

    return parts.join('+');
}
```

---

## Default Keybindings

### Global Keybindings

| Key | Action | Description |
|-----|--------|-------------|
| `Enter` | `submit` | Submit current input |
| `Shift+Enter` | `newline` | Insert newline in input |
| `Escape` | `cancel` | Cancel current operation |
| `Escape Escape` | `messageSelector` | Open message selector |
| `Ctrl+C` | `forceCancel` | Force cancel stream |
| `Ctrl+R` | `messageSelector` | Open message selector |
| `Ctrl+E` | `toggleTranscript` | Toggle transcript view |
| `Ctrl+F` | `agentFilter` | Open agent filter panel |
| `Shift+Tab` | `cycleMode` | Cycle permission mode |
| `Tab` | `autocomplete` | Accept autocomplete suggestion |
| `Up` | `historyUp` | Previous history item / cursor up |
| `Down` | `historyDown` | Next history item / cursor down |

### Chord Sequences

| Chord | Action | Description |
|-------|--------|-------------|
| `Ctrl+K D` | `deleteLine` | Delete current input line |
| `Ctrl+K K` | `clearInput` | Clear all input |
| `Ctrl+K ?` | `showHelp` | Show keybinding help |

### Context-Specific Keybindings

| Context | Key | Action |
|---------|-----|--------|
| `input` | `Tab` | Autocomplete |
| `input` | `Up` | History previous |
| `input` | `Down` | History next |
| `dialog` | `Y/n/a/d` | Yes/No/Always/Deny |
| `streaming` | `Ctrl+C` | Cancel stream |
| `messageSelector` | `Up/Down` | Navigate messages |
| `messageSelector` | `Enter` | Select message |
| `messageSelector` | `Escape` | Close selector |

---

## Permission Mode Cycling

### Shift+Tab Handler

```javascript
// ============================================
// cycleMode (hf1) - Permission mode cycling
// Location: chunks.183.mjs
// ============================================

// READABLE (for understanding):
function cycleMode(currentState) {
    const MODE_ORDER = ['default', 'accept', 'plan'];
    const currentIndex = MODE_ORDER.indexOf(currentState.toolPermissionContext.mode);
    const nextIndex = (currentIndex + 1) % MODE_ORDER.length;
    const nextMode = MODE_ORDER[nextIndex];

    // Update state
    return {
        ...currentState,
        toolPermissionContext: {
            ...currentState.toolPermissionContext,
            mode: nextMode
        }
    };
}

// Mode descriptions
const MODE_CONFIGS = {
    default: {
        name: 'default',
        icon: '○',
        color: 'gray',
        description: 'Tools require permission'
    },
    accept: {
        name: 'accept',
        icon: '●',
        color: 'green',
        description: 'Tools auto-approved'
    },
    plan: {
        name: 'plan',
        icon: '◐',
        color: 'cyan',
        description: 'Plan mode - no edits'
    }
};
```

### Mode Indicator Rendering

```javascript
// ============================================
// ModeIndicator - Footer mode display
// Location: chunks.196.mjs (sessionOrchestrator footer)
// ============================================

// READABLE (for understanding):
const ModeIndicator = ({ mode }) => {
    const config = MODE_CONFIGS[mode] || MODE_CONFIGS.default;

    return (
        <Box>
            <Text color={config.color}>
                {config.icon} {config.name}
            </Text>
            <Text dimColor> Shift+Tab to cycle</Text>
        </Box>
    );
};
```

---

## Keybinding Configuration

### Configuration File

Keybindings are loaded from `~/.claude/keybindings.json`:

```json
{
  "keybindings": {
    "Ctrl+K D": "deleteLine",
    "Ctrl+K K": "clearInput",
    "Escape Escape": "messageSelector"
  },
  "contexts": {
    "input": {
      "Tab": "autocomplete",
      "Up": "historyPrevious"
    },
    "dialog": {
      "Y": "approve",
      "n": "deny",
      "a": "approveAlways"
    }
  }
}
```

### Hot-Reload Support

```javascript
// ============================================
// Keybinding Hot-Reload
// Location: chunks.110.mjs
// ============================================

// READABLE (for understanding):
function setupKeybindingWatcher(onChange) {
    const keybindingPath = path.join(getClaudeDir(), 'keybindings.json');

    // Watch for file changes
    const watcher = fs.watch(keybindingPath, (eventType) => {
        if (eventType === 'change') {
            try {
                const newKeybindings = JSON.parse(fs.readFileSync(keybindingPath, 'utf8'));
                onChange(newKeybindings);
                console.log('Keybindings reloaded');
            } catch (error) {
                console.error('Failed to load keybindings:', error.message);
            }
        }
    });

    return () => watcher.close();
}
```

---

## Accessibility Considerations

### Screen Reader Support

```javascript
// ============================================
// Screen Reader Announcements
// ============================================

// READABLE (for understanding):
function announceForScreenReader(message) {
    // Set terminal title (read by some screen readers)
    process.stdout.write(`\x1b]0;${message}\x07`);

    // Write to stderr for terminal screen readers
    process.stderr.write(`${message}\n`);
}

// Usage
function handleModeChange(newMode) {
    const description = MODE_CONFIGS[newMode].description;
    announceForScreenReader(`Permission mode: ${description}`);
}
```

### Focus Indicators

The UI provides visual focus indicators for:

1. **Input field** - Cursor blink
2. **Dialog buttons** - Highlighted text
3. **Message list** - Selected message border
4. **Autocomplete** - Dropdown highlight

---

## Key Insights

### Design Decisions

1. **Chord timeout (1s)**: Short enough to feel responsive, long enough for user to press second key
2. **Single modifier at start**: Chords start with `Ctrl+K` only, preventing accidental triggers
3. **Mode cycling**: Shift+Tab is intuitive for "go backwards through options"
4. **Context-specific**: Same key does different things based on current UI state

### Performance Considerations

- Keybindings are loaded once and cached
- Chord state is minimal (just prefix string)
- No debouncing needed (keyboard events are already discrete)

---

## Source References

| Component | File | Key Functions |
|-----------|------|---------------|
| Keybinding Setup | chunks.110.mjs | `parseKeystroke`, `KeybindingSetup` |
| Mode Cycling | chunks.183.mjs | `cycleMode` (hf1) |
| Input Handling | chunks.196.mjs | `sessionOrchestrator` (ot8) |
| UI Components | chunks.161.mjs | `MessageList` (veY) |

---

**Last Updated**: 2026-03-25
**Version**: Claude Code 2.1.76
**Status**: Complete - Keyboard shortcut flow documented