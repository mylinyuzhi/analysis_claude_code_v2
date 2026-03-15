# `/help` Command — Command Discovery and Keybindings

## Overview

The `/help` command displays an interactive panel showing all available commands, their descriptions, and keyboard shortcuts. It serves as the primary discovery mechanism for users to learn about available functionality.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (CLI, Skills)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Slash Commands, UI Components)

Key functions in this document:
- `helpCommand` (NdY) - The `/help` command definition object
- `getAllCommands` (cZ) - Returns all available commands for display
- `filterCommandSuggestions` (PgA) - Fuzzy filter used in help search

---

## Command Definition

### helpCommand (NdY)

**What it does:** Defines the `/help` slash command that shows available commands and keybindings.

```javascript
// ============================================
// helpCommand - /help command definition
// Location: chunks.153.mjs:1457-1468
// ============================================

// ORIGINAL (for source lookup):
NdY = {
    type: "local-jsx",
    name: "help",
    description: "Show help and available commands",
    isEnabled: () => !0,
    isHidden: !1,
    load: () => Promise.resolve().then(() => (kzq(), Vzq)),
    userFacingName() {
        return "help"
    }
}

// READABLE (for understanding):
const helpCommand = {
    type: "local-jsx",
    name: "help",
    description: "Show help and available commands",
    isEnabled: () => true,
    isHidden: false,
    load: () => Promise.resolve().then(() => (initializeHelpModule(), helpHandlerModule)),
    userFacingName() {
        return "help"
    }
}

// Mapping: NdY→helpCommand, kzq→initializeHelpModule, Vzq→helpHandlerModule
```

**Why `local-jsx` type:**
- Requires interactive React UI for scrolling and searching
- Cannot be used in non-interactive mode (no `supportsNonInteractive` flag)
- Dynamically loads command list from registry

---

## How It Works

### Execution Flow

```
/help
    │
    ▼
parseSlashCommand → { commandName: "help", args: "" }
    │
    ▼
executeCommand (ifY) → type === "local-jsx"
    │
    ▼
load() → helpHandlerModule
    │
    ▼
Render HelpPanel React component
    │
    ├── getAllCommands() → Fetch all available commands
    │
    ├── Group commands by category
    │
    ├── Display with descriptions
    │
    └── Show keybindings section
```

### Help Panel UI Structure

The help panel displays:

```
┌─────────────────────────────────────────────────────────────┐
│ Help                                                         │
├─────────────────────────────────────────────────────────────┤
│ Available Commands                                           │
│                                                             │
│ Session Management                                          │
│   /clear    Clear conversation history                      │
│   /compact  Compact conversation with summary               │
│   /resume   Resume a previous session                       │
│   /rename   Rename the current session                      │
│                                                             │
│ Mode & Settings                                             │
│   /vim      Toggle vim editing mode                         │
│   /fast     Toggle fast mode                                │
│   /effort   Set thinking effort level                       │
│   /color    Set session prompt bar color                    │
│                                                             │
│ Code Review                                                 │
│   /review   Review code changes                             │
│   /pr-comments  Fetch and analyze PR comments              │
│                                                             │
│ ... (more categories)                                       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Keyboard Shortcuts                                          │
│                                                             │
│ Ctrl+C        Cancel current operation                      │
│ Ctrl+D        Exit Claude Code                             │
│ Ctrl+L        Clear screen                                  │
│ Tab           Accept suggestion                             │
│ Shift+Tab     Previous suggestion                           │
│ ↑/↓           Navigate history                              │
│ Escape        Cancel/close dialog                           │
│ ... (more shortcuts)                                        │
│                                                             │
│ Press Escape to close                                       │
└─────────────────────────────────────────────────────────────┘
```

### Command Grouping

Commands are grouped into categories for easier navigation:

| Category | Commands |
|----------|----------|
| Session Management | `/clear`, `/compact`, `/resume`, `/rename`, `/login`, `/logout`, `/init` |
| Mode & Settings | `/vim`, `/fast`, `/effort`, `/color` |
| Code Review | `/review`, `/pr-comments`, `/security-review` |
| Utility | `/copy`, `/context`, `/add-dir`, `/reload-plugins`, `/feedback` |
| Scheduled Tasks | `/loop` |

**Why grouping:**
- Reduces cognitive load for users scanning for commands
- Logical organization matches mental model of "what do I want to do?"
- Alphabetical sorting within groups maintains predictability

---

## Keybinding Display Integration

### Where Keybindings Come From

Keybindings are defined in the keybinding system (see keybindings configuration). The help panel reads from:

```javascript
// Pseudocode for keybinding retrieval
function getKeybindingsForHelp() {
    const keybindings = getKeybindingConfig();
    return keybindings.map(kb => ({
        key: kb.key,
        action: kb.action,
        description: kb.description
    }));
}
```

### Keybinding Categories

| Category | Examples |
|----------|----------|
| Navigation | `↑/↓` history, `Ctrl+U/D` page up/down |
| Editing | `Ctrl+A/E` line start/end, `Ctrl+W` delete word |
| Control | `Ctrl+C` cancel, `Ctrl+D` exit, `Escape` close |
| Suggestions | `Tab` accept, `Shift+Tab` previous |

---

## Integration with Command Registry

### getAllCommands Integration

The help panel uses `getAllCommands` (cZ) to fetch the complete command list:

```javascript
// ============================================
// getAllCommands - Fetch all commands for help display
// Location: chunks.168.mjs:2292-2306
// ============================================

// READABLE (for understanding):
async function getCommandsForHelp(toolUseContext) {
    const allCommands = await getAllCommands(toolUseContext);
    return allCommands
        .filter(cmd => !cmd.isHidden)  // Don't show hidden commands
        .sort((a, b) => a.name.localeCompare(b.name));
}
```

**Filtering:**
- Hidden commands (`isHidden: true`) are excluded
- Disabled commands (`isEnabled: false`) are shown but grayed out
- Command aliases are shown with reference to primary name

### Dynamic Command List

Since the command registry is dynamic (skills can be added/removed), the help panel always shows the current state:

- User installs a new skill → appears in `/help` immediately
- Plugin is disabled → shown as disabled in `/help`
- Custom skill directory commands → included in listing

---

## User Experience

### Keyboard Navigation

Within the help panel:

| Key | Action |
|-----|--------|
| `↑/↓` | Scroll through commands |
| `Page Up/Down` | Scroll by page |
| `/` | Focus search (if implemented) |
| `Escape` | Close help panel |
| `Enter` | Execute selected command (if implemented) |

### Search Functionality

Some versions include a search filter:

```
/help sea
    │
    ▼
Shows only commands matching "sea":
  /search      Search codebase
  /seasonal    Seasonal features
```

The search uses the same fuzzy-matching algorithm as `filterCommandSuggestions` (PgA).

---

## Design Rationale

### Why `local-jsx` Instead of `prompt`

**Design decision:** Help is a UI component, not an LLM prompt.

**Reasons:**
1. **Deterministic output**: Users expect the same command list every time
2. **No LLM cost**: Displaying help shouldn't consume API quota
3. **Interactive navigation**: Users can scroll and search within the panel
4. **Immediate feedback**: No delay waiting for LLM response

### Why Not a Separate Tool

**Design decision:** Help is accessed via slash command, not as a standalone tool.

**Reasons:**
1. **User-initiated**: Help is for user discovery, not agent use
2. **Consistent interface**: Fits the `/` command pattern users already know
3. **No API exposure**: Tools are exposed to the LLM; help is UI-only

---

## Comparison with Similar Commands

| Command | Purpose | Type |
|---------|---------|------|
| `/help` | Interactive command/keybinding reference | `local-jsx` |
| `/config` | Configuration settings | `local-jsx` |
| `/doctor` | System diagnostics | `local` |

**When to use:**
- New users learning available commands
- Experienced users checking keybindings
- Discovering newly installed skill commands