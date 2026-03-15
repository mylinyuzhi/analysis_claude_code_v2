# Mode Commands — `/vim`, `/fast`, `/color`

## Overview

The mode commands toggle or configure editor behavior and visual settings:

- **`/vim`**: Toggle vim keybinding mode for input editing
- **`/fast`**: Toggle fast mode (lower effort responses)
- **`/color`**: Set the session's prompt bar color

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (CLI, Thinking)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (UI Components)

Key functions in this document:
- `vimCommand` (F6z) - The `/vim` command definition
- `fastCommand` (k1z) - The `/fast` command definition
- `colorCommand` ($FY) - The `/color` command definition
- `setEditorMode` - Updates editor mode in app state
- `isFastModeEnabled` - Checks if fast mode is active

---

## `/vim` Command

### Command Definition

**What it does:** Toggles between vim and standard (readline) editing modes for the input field.

```javascript
// ============================================
// vimCommand - /vim command definition
// Location: chunks.162.mjs:1613-1623
// ============================================

// ORIGINAL (for source lookup):
F6z = {
    name: "vim",
    description: "Toggle between Vim and Normal editing modes",
    isEnabled: () => !0,
    isHidden: !1,
    supportsNonInteractive: !1,
    type: "local",
    userFacingName: () => "vim",
    load: () => Promise.resolve().then(() => ($Mq(), OMq))
}

// READABLE (for understanding):
const vimCommand = {
    name: "vim",
    description: "Toggle between Vim and Normal editing modes",
    isEnabled: () => true,
    isHidden: false,
    supportsNonInteractive: false,
    type: "local",
    userFacingName: () => "vim",
    load: () => Promise.resolve().then(() => (initializeVimModule(), vimHandlerModule))
}

// Mapping: F6z→vimCommand, $Mq→initializeVimModule, OMq→vimHandlerModule
```

**Key features:**
- **Type `local`**: Immediate execution without React UI
- **Non-interactive restriction**: Cannot be used in `--print` mode
- **Toggle behavior**: Switches between "vim" and "normal" modes

### Execution Flow

```
/vim
    │
    ▼
parseSlashCommand → { commandName: "vim", args: "" }
    │
    ▼
executeCommand → type === "local"
    │
    ▼
vimHandler(currentMode)
    │
    ├── currentMode === "vim" → setMode("normal")
    │
    └── currentMode === "normal" → setMode("vim")
    │
    ▼
Return message: "Editor mode set to [vim|normal]. ..."
```

### Vim Mode Features

When vim mode is enabled:

| Feature | Behavior |
|---------|----------|
| **INSERT mode** | Default typing mode (like standard) |
| **NORMAL mode** | Navigation and editing commands |
| **Mode toggle** | Escape key switches between modes |
| **Visual indicator** | Status line shows current mode |

**Common vim keybindings available:**

| Mode | Key | Action |
|------|-----|--------|
| NORMAL | `h/j/k/l` | Move cursor |
| NORMAL | `w/b` | Word forward/back |
| NORMAL | `0/$` | Line start/end |
| NORMAL | `dd` | Delete line |
| NORMAL | `yy` | Yank line |
| NORMAL | `p` | Paste |
| NORMAL | `i/a` | Enter INSERT mode |
| INSERT | `Escape` | Return to NORMAL mode |

### Why Vim Mode

**Design rationale:**
- Vim users have strong muscle memory
- Modal editing enables efficient text manipulation
- No cost to offer as optional feature
- Standard readline remains default for accessibility

---

## `/fast` Command

### Command Definition

**What it does:** Toggles fast mode, which uses a lower effort level for faster responses.

```javascript
// ============================================
// fastCommand - /fast command definition
// Location: chunks.163.mjs:863-882
// ============================================

// ORIGINAL (for source lookup):
k1z = {
    type: "local-jsx",
    name: "fast",
    get description() {
        return `Toggle fast mode (${Ok} only)`
    },
    isEnabled: () => Dq(),
    get isHidden() {
        return !Dq()
    },
    argumentHint: "[on|off]",
    userFacingName: () => "fast",
    get immediate() {
        return XN6()
    },
    load: () => Promise.resolve().then(() => (Xl8(), pMq))
}

// READABLE (for understanding):
const fastCommand = {
    type: "local-jsx",
    name: "fast",
    get description() {
        return `Toggle fast mode (${getEffortModeDescription()} only)`
    },
    isEnabled: () => isFastModeAvailable(),
    get isHidden() {
        return !isFastModeAvailable()
    },
    argumentHint: "[on|off]",
    userFacingName: () => "fast",
    get immediate() {
        return isCurrentlyInFastMode()
    },
    load: () => Promise.resolve().then(() => (initializeFastModule(), fastHandlerModule))
}

// Mapping: k1z→fastCommand, Dq→isFastModeAvailable, XN6→isCurrentlyInFastMode, Ok→getEffortModeDescription
```

**Key features:**
- **Dynamic visibility**: Hidden if fast mode unavailable
- **Argument hint**: Accepts `on` or `off` for explicit control
- **Immediate property**: Reflects current fast mode state
- **`local-jsx` type**: Shows mode toggle UI

### Fast Mode Behavior

**What fast mode does:**

| Setting | Normal Mode | Fast Mode |
|---------|-------------|-----------|
| Effort level | Default (medium/auto) | Low |
| Thinking budget | ~8,000+ tokens | ~1,000 tokens |
| Response speed | Standard | Faster |
| Quality trade-off | Full analysis | Quick response |

**When to use fast mode:**
- Simple, straightforward tasks
- Quick questions that don't require deep analysis
- When response speed is prioritized over thoroughness

### Execution Flow

```
/fast [on|off]
    │
    ▼
parseSlashCommand → { commandName: "fast", args: "on"|"off"|"" }
    │
    ▼
executeCommand → type === "local-jsx"
    │
    ▼
fastHandler(args)
    │
    ├── args === "on" → enableFastMode()
    │
    ├── args === "off" → disableFastMode()
    │
    └── args === "" → toggleFastMode()
    │
    ▼
Update app state: { fastMode: true|false }
    │
    ▼
Update effort level → "low" if fast, else restore previous
```

### Integration with Effort System

Fast mode is a convenience wrapper around the effort system:

```
/fast on  ≡  /effort low
/fast off ≡  /effort auto (or previous setting)
```

**Why both exist:**
- `/fast` is a simple toggle for quick access
- `/effort` provides fine-grained control (low/medium/high/auto)
- Fast mode remembers previous effort for restoration

See [effort_command.md](./effort_command.md) for detailed effort system documentation.

---

## `/color` Command

### Command Definition

**What it does:** Sets the color of the session's prompt bar for visual identification.

```javascript
// ============================================
// colorCommand - /color command definition
// Location: chunks.150.mjs:1385-1398
// ============================================

// ORIGINAL (for source lookup):
$FY = {
    type: "local-jsx",
    name: "color",
    description: "Set the prompt bar color for this session",
    isEnabled: () => !0,
    isHidden: !1,
    immediate: !0,
    argumentHint: "<color|default>",
    load: () => Promise.resolve().then(() => (E3q(), k3q)),
    userFacingName() {
        return "color"
    }
}

// READABLE (for understanding):
const colorCommand = {
    type: "local-jsx",
    name: "color",
    description: "Set the prompt bar color for this session",
    isEnabled: () => true,
    isHidden: false,
    immediate: true,
    argumentHint: "<color|default>",
    load: () => Promise.resolve().then(() => (initializeColorModule(), colorHandlerModule)),
    userFacingName() {
        return "color"
    }
}

// Mapping: $FY→colorCommand, E3q→initializeColorModule, k3q→colorHandlerModule
```

**Key features:**
- **Immediate property**: Shows current color state
- **Argument hint**: Indicates color names accepted
- **Reset support**: "default" resets to default color

### Available Colors

Based on source code analysis:

```javascript
// Reset keywords (reset to default)
const RESET_KEYWORDS = ["default", "reset", "none", "gray", "grey"];

// Available colors
const AVAILABLE_COLORS = ["red", "green", "blue", "yellow", "magenta", "cyan", "white"];
```

### Teammate Color Restrictions

**Important:** In swarm/teammate sessions, color is assigned by the team leader:

```javascript
async function colorCommandHandler(onDone, setAppState, args) {
    // Check if this is a swarm teammate session
    if (isSwarmTeammate()) {
        return onDone(
            "Cannot set color: This session is a swarm teammate. Teammate colors are assigned by the team leader.",
            { display: "system" }
        );
    }
    // ... rest of handler
}
```

**Why this restriction:** In swarm mode, each teammate has a unique color for visual identification. The team leader assigns colors to avoid conflicts.

### Execution Flow

```
/color blue
    │
    ▼
parseSlashCommand → { commandName: "color", args: "blue" }
    │
    ▼
executeCommand → type === "local-jsx"
    │
    ▼
colorCommandHandler(onDone, setAppState, "blue")
    │
    ├── isSwarmTeammate() → Error if true
    │
    ├── args empty → Show available colors
    │
    ├── args === "default"|"reset"|... → Reset to default
    │
    ├── args not in AVAILABLE_COLORS → Error with list
    │
    └── Valid color → Apply
        │
        ├── Persist color to storage
        │
        ├── Update app state
        │
        └── onDone("Session color set to: blue")
```

### Color Persistence

Colors are persisted across sessions:

```javascript
// Persist to session storage
await persistSessionColor(sessionId, color, organizationId);

// Update app state
setAppState(prev => ({
    ...prev,
    standaloneAgentContext: {
        ...prev.standaloneAgentContext,
        color: color
    }
}));
```

---

## Comparison Table

| Command | Type | Interactive | Persistence | Swarm Restriction |
|---------|------|-------------|-------------|-------------------|
| `/vim` | `local` | No | Session | None |
| `/fast` | `local-jsx` | Yes | Session | None |
| `/color` | `local-jsx` | Yes | Cross-session | Teammate mode |

**Design rationale:**
- `/vim` is `local` because it's a simple toggle without UI needs
- `/fast` is `local-jsx` to show current state visually
- `/color` is `local-jsx` for color picker UI and teammate restriction display

---

## Status Line Integration

All three commands affect the status line display:

### Vim Mode Indicator

```
[INSERT] ← When in vim INSERT mode
[NORMAL] ← When in vim NORMAL mode
(no indicator when vim mode is off)
```

### Fast Mode Indicator

```
[⚡ fast] ← When fast mode is enabled
```

### Color Indicator

The entire prompt bar uses the configured color:

```
▶ (blue prompt bar) Type your message...
▶ (red prompt bar) Type your message...
```

This visual differentiation helps users identify different sessions when running multiple Claude Code instances.