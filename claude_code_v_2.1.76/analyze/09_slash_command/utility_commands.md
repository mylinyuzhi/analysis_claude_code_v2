# Utility Commands — `/copy`, `/context`, `/add-dir`, `/reload-plugins`, `/feedback`

## Overview

The utility commands provide helpful functionality for common tasks:

- **`/copy`**: Copy content to clipboard
- **`/context`**: Visualize context window usage
- **`/add-dir`**: Add a working directory
- **`/reload-plugins`**: Reload plugins without restart
- **`/feedback`**: Submit feedback (alias: `/bug`)

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (CLI, Compact)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Slash Commands)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform (Telemetry)

Key functions in this document:
- `copyCommand` (qpY) - The `/copy` command definition
- `contextCommand` (XYq) - The `/context` command definition
- `addDirCommand` (cBY) - The `/add-dir` command definition
- `reloadPluginsCommand` (YAz) - The `/reload-plugins` command definition
- `feedbackCommand` (YgY) - The `/feedback` command definition

---

## `/copy` Command

### Command Definition

**What it does:** Copies Claude's last response or a specific code block to the system clipboard.

```javascript
// ============================================
// copyCommand - /copy command definition
// Location: chunks.150.mjs:2964-2975
// ============================================

// ORIGINAL (for source lookup):
qpY = {
    type: "local-jsx",
    name: "copy",
    description: "Copy Claude's last response or a code block to clipboard",
    isEnabled: () => !0,
    isHidden: !1,
    load: () => Promise.resolve().then(() => (A9q(), e3q)),
    userFacingName() {
        return "copy"
    }
}

// READABLE (for understanding):
const copyCommand = {
    type: "local-jsx",
    name: "copy",
    description: "Copy Claude's last response or a code block to clipboard",
    isEnabled: () => true,
    isHidden: false,
    load: () => Promise.resolve().then(() => (initializeCopyModule(), copyHandlerModule)),
    userFacingName() {
        return "copy"
    }
}

// Mapping: qpY→copyCommand, A9q→initializeCopyModule, e3q→copyHandlerModule
```

**Key features:**
- **Type `local-jsx`**: Shows interactive content selector UI
- **Multiple sources**: Last response, specific code block, or selected text
- **Cross-platform**: Works on macOS, Linux, Windows

### Execution Flow

```
/copy
    │
    ▼
parseSlashCommand → { commandName: "copy", args: "" }
    │
    ▼
executeCommand → type === "local-jsx"
    │
    ▼
Show copy source selector
    │
    ├── "Last Response" → Copy entire last assistant message
    │
    ├── "Code Block" → Show code block picker
    │   │
    │   └── Select block → Copy code
    │
    └── Cancel → No action
    │
    ▼
Write to clipboard → Show confirmation
```

### Clipboard Integration

**How clipboard access works:**

| Platform | Method |
|----------|--------|
| macOS | `pbcopy` command |
| Linux | `xclip` or `xsel` |
| Windows | `clip` command |

```javascript
async function copyToClipboard(text) {
    const platform = process.platform;
    if (platform === "darwin") {
        await spawn("pbcopy", [], { input: text });
    } else if (platform === "linux") {
        await spawn("xclip", ["-selection", "clipboard"], { input: text });
    } else if (platform === "win32") {
        await spawn("clip", [], { input: text });
    }
}
```

---

## `/context` Command

### Command Definition

**What it does:** Visualizes the current context window usage, helping users understand how much context is being used and what's consuming it.

```javascript
// ============================================
// contextCommand - /context command definition
// Location: chunks.152.mjs:1299-1326
// ============================================

// ORIGINAL (for source lookup):
XYq = {
    name: "context",
    description: "Visualize current context usage as a colored grid",
    isEnabled: () => !q7(),
    isHidden: !1,
    type: "local-jsx",
    load: () => Promise.resolve().then(() => (JYq(), jYq)),
    userFacingName() {
        return this.name
    }
}

// READABLE (for understanding):
const contextCommand = {
    name: "context",
    description: "Visualize current context usage as a colored grid",
    isEnabled: () => !isNonInteractiveMode(),
    isHidden: false,
    type: "local-jsx",
    load: () => Promise.resolve().then(() => (initializeContextModule(), contextHandlerModule)),
    userFacingName() {
        return this.name
    }
}

// Mapping: XYq→contextCommand, q7→isNonInteractiveMode, JYq→initializeContextModule, jYq→contextHandlerModule
```

**Key features:**
- **Type `local-jsx`**: Renders an interactive visual grid
- **Non-interactive disabled**: Requires terminal UI
- **Visual representation**: Color-coded grid shows usage distribution

### Context Breakdown

The command shows context usage in categories:

| Category | Description | Color |
|----------|-------------|-------|
| System Prompt | Base system instructions | Blue |
| Conversation | User/assistant messages | Green |
| Tool Results | Output from tools | Yellow |
| Files | Read file contents | Magenta |
| Available | Remaining capacity | Gray |

### Visual Grid Example

```
Context Usage: 78% (124,000 / 160,000 tokens)

[System Prompt    ][Conversation            ][Tool Results  ][Files    ][Available     ]
   ████ 12%           ████████████ 45%        ████ 15%        ██ 8%      ████ 20%

Breakdown:
  System Prompt:   19,200 tokens (12%)
  Conversation:    55,800 tokens (35%)
  Tool Results:    18,600 tokens (12%)
  Files:           12,800 tokens (8%)
  Available:       32,000 tokens (20%)

Suggestions:
  • Run /compact to free up context
  • Consider using line-range reads for large files
```

### Actionable Suggestions

Based on usage patterns, `/context` provides suggestions:

| Condition | Suggestion |
|-----------|------------|
| >80% full | "Run `/compact` to free up context" |
| Large files read | "Consider using line-range reads" |
| Large tool outputs | "Tool outputs consuming significant context" |
| Near limit | "Context nearly exhausted, consider compacting" |

---

## `/add-dir` Command

### Command Definition

**What it does:** Adds a new working directory to the current session, enabling Claude to work with files in that directory.

```javascript
// ============================================
// addDirCommand - /add-dir command definition
// Location: chunks.149.mjs:1818-1830
// ============================================

// ORIGINAL (for source lookup):
cBY = {
    type: "local-jsx",
    name: "add-dir",
    description: "Add a new working directory",
    argumentHint: "<path>",
    isEnabled: () => !0,
    isHidden: !1,
    load: () => Promise.resolve().then(() => (k5q(), V5q)),
    userFacingName() {
        return "add-dir"
    }
}

// READABLE (for understanding):
const addDirCommand = {
    type: "local-jsx",
    name: "add-dir",
    description: "Add a new working directory",
    argumentHint: "<path>",
    isEnabled: () => true,
    isHidden: false,
    load: () => Promise.resolve().then(() => (initializeAddDirModule(), addDirHandlerModule)),
    userFacingName() {
        return "add-dir"
    }
}

// Mapping: cBY→addDirCommand, k5q→initializeAddDirModule, V5q→addDirHandlerModule
```

**Key features:**
- **Argument hint**: Expects a directory path
- **Path validation**: Checks directory exists and is accessible
- **Multiple directories**: Supports adding multiple working directories

### Execution Flow

```
/add-dir /path/to/project
    │
    ▼
parseSlashCommand → { commandName: "add-dir", args: "/path/to/project" }
    │
    ▼
executeCommand → type === "local-jsx"
    │
    ▼
addDirHandler(args)
    │
    ├── Expand path (resolve ~, relative paths)
    │
    ├── Validate directory exists
    │
    ├── Check permissions
    │
    ├── Add to working directories list
    │
    └── Show confirmation with path
```

### Working Directory Management

After adding a directory:

1. Directory appears in the working directories list
2. Files can be read/written using relative paths from that directory
3. Git operations apply to repositories in that directory
4. Glob/Grep searches include the new directory

---

## `/reload-plugins` Command

### Command Definition

**What it does:** Reloads all installed plugins and skills without restarting Claude Code.

```javascript
// ============================================
// reloadPluginsCommand - /reload-plugins command definition
// Location: chunks.165.mjs:670-682
// ============================================

// ORIGINAL (for source lookup):
YAz = {
    type: "local",
    name: "reload-plugins",
    description: "Activate pending plugin changes in the current session",
    isEnabled: () => !0,
    isHidden: !1,
    supportsNonInteractive: !1,
    load: () => Promise.resolve().then(() => (BXq(), mXq)),
    userFacingName() {
        return "reload-plugins"
    }
}

// READABLE (for understanding):
const reloadPluginsCommand = {
    type: "local",
    name: "reload-plugins",
    description: "Activate pending plugin changes in the current session",
    isEnabled: () => true,
    isHidden: false,
    supportsNonInteractive: false,
    load: () => Promise.resolve().then(() => (initializeReloadPluginsModule(), reloadPluginsHandlerModule)),
    userFacingName() {
        return "reload-plugins"
    }
}

// Mapping: YAz→reloadPluginsCommand, BXq→initializeReloadPluginsModule, mXq→reloadPluginsHandlerModule
```

**Key features:**
- **Type `local`**: Immediate execution
- **Hot reload**: No session restart required
- **Plugin development**: Useful during plugin development cycle

### Execution Flow

```
/reload-plugins
    │
    ▼
parseSlashCommand → { commandName: "reload-plugins", args: "" }
    │
    ▼
executeCommand → type === "local"
    │
    ▼
reloadPluginsHandler()
    │
    ├── Invalidate memoized command cache
    │
    ├── Re-scan plugin directories
    │
    ├── Re-scan skill directories
    │
    ├── Merge with built-in commands
    │
    └── Return count of loaded commands
```

### What Gets Reloaded

| Source | Behavior |
|--------|----------|
| Marketplace plugins | Re-scanned from installation directory |
| Skill directories | Re-loaded from `.claude/skills/` |
| Bundled skills | Re-loaded (typically unchanged) |
| Built-in commands | Always present, not reloaded |

### Use Cases

**Plugin development workflow:**
1. Make changes to plugin code
2. Run `/reload-plugins`
3. Test changes immediately
4. Iterate without restart delays

**Installing new plugins:**
1. Install plugin from marketplace
2. Run `/reload-plugins`
3. New plugin commands available immediately

---

## `/feedback` Command (alias `/bug`)

### Command Definition

**What it does:** Opens a feedback dialog to submit bug reports or feature requests about Claude Code.

```javascript
// ============================================
// feedbackCommand - /feedback command definition
// Location: chunks.149.mjs:2463-2478
// ============================================

// ORIGINAL (for source lookup):
YgY = {
    aliases: ["bug"],
    type: "local-jsx",
    name: "feedback",
    description: "Submit feedback about Claude Code",
    argumentHint: "[report]",
    isEnabled: () => !(t6(process.env.CLAUDE_CODE_USE_BEDROCK)
        || t6(process.env.CLAUDE_CODE_USE_VERTEX)
        || t6(process.env.CLAUDE_CODE_USE_FOUNDRY)
        || process.env.DISABLE_FEEDBACK_COMMAND
        || process.env.DISABLE_BUG_COMMAND
        || process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC
        || !1
        || !qD("allow_product_feedback")),
    isHidden: !1,
    load: () => Promise.resolve().then(() => (U5q(), Q5q)),
    userFacingName() {
        return "feedback"
    }
}

// READABLE (for understanding):
const feedbackCommand = {
    aliases: ["bug"],
    type: "local-jsx",
    name: "feedback",
    description: "Submit feedback about Claude Code",
    argumentHint: "[report]",
    isEnabled: () => !(
        parseBoolean(process.env.CLAUDE_CODE_USE_BEDROCK) ||
        parseBoolean(process.env.CLAUDE_CODE_USE_VERTEX) ||
        parseBoolean(process.env.CLAUDE_CODE_USE_FOUNDRY) ||
        process.env.DISABLE_FEEDBACK_COMMAND ||
        process.env.DISABLE_BUG_COMMAND ||
        process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC ||
        !hasPermission("allow_product_feedback")
    ),
    isHidden: false,
    load: () => Promise.resolve().then(() => (initializeFeedbackModule(), feedbackHandlerModule)),
    userFacingName() {
        return "feedback"
    }
}

// Mapping: YgY→feedbackCommand, t6→parseBoolean, qD→hasPermission, U5q→initializeFeedbackModule, Q5q→feedbackHandlerModule
```

**Key features:**
- **Alias `/bug`**: Alternative name for convenience
- **Multiple disable conditions**: Various env vars can disable
- **Permission check**: Respects `allow_product_feedback` permission

### Disable Conditions

The command is disabled when:

| Condition | Reason |
|-----------|--------|
| `CLAUDE_CODE_USE_BEDROCK` | Using Bedrock backend |
| `CLAUDE_CODE_USE_VERTEX` | Using Vertex backend |
| `CLAUDE_CODE_USE_FOUNDRY` | Using Foundry backend |
| `DISABLE_FEEDBACK_COMMAND` | Explicitly disabled |
| `DISABLE_BUG_COMMAND` | Alternative disable flag |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | Network restrictions |
| `!allow_product_feedback` | Permission not granted |

**Why these restrictions:** Alternative backends (Bedrock, Vertex) have different telemetry systems, and enterprise deployments may want to disable feedback submission.

### Execution Flow

```
/feedback [report text]
    │
    ▼
parseSlashCommand → { commandName: "feedback", args: "report text" }
    │
    ▼
executeCommand → type === "local-jsx"
    │
    ▼
feedbackHandler(args)
    │
    ├── Check all disable conditions
    │
    ├── Show feedback form UI
    │   │
    │   ├── Pre-fill with args if provided
    │   │
    │   ├── Category selection (bug/feature/question)
    │   │
    │   └── Description text area
    │
    └── Submit to feedback endpoint
```

### Feedback Categories

| Category | Description |
|----------|-------------|
| Bug | Something isn't working correctly |
| Feature | Request a new capability |
| Question | Ask about functionality |

---

## Comparison Table

| Command | Type | Non-Interactive | Env Control |
|---------|------|-----------------|-------------|
| `/copy` | `local-jsx` | No | None |
| `/context` | `local-jsx` | No | None |
| `/add-dir` | `local-jsx` | No | None |
| `/reload-plugins` | `local` | No | None |
| `/feedback` | `local-jsx` | No | Multiple env vars |

**Design rationale:**
- Most utility commands are `local-jsx` for interactive UI
- `/reload-plugins` is `local` since it just returns a status message
- `/feedback` has the most complex enable/disable logic due to privacy concerns