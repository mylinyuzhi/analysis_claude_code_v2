# Built-in Slash Commands

## Overview

Claude Code v2.1.7 provides 50+ built-in slash commands for configuration, debugging, context management, and more. This document catalogs built-in commands with their types, implementations, and usage.

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

---

## Quick Navigation

- [Command Registry Architecture](#command-registry-architecture)
- [Command Type Reference](#command-type-reference)
- [Configuration Commands](#configuration-commands)
- [Context Management Commands](#context-management-commands)
- [Session Commands](#session-commands)
- [Development Commands](#development-commands)
- [MCP Commands](#mcp-commands)

---

## Command Registry Architecture

### getAllBuiltinCommands (nY9)

All built-in commands are registered through a memoized function:

```javascript
// ============================================
// getAllBuiltinCommands - Registry of all built-in commands
// Location: chunks.146.mjs:2447
// ============================================

// ORIGINAL (for source lookup):
nY9 = W0(() => [
  O09,   // add-dir
  TG9,   // model
  M09,   // clear
  zZ9,   // compact
  WQ9,   // clear
  KQ9,   // color
  $Q9,   // compact
  WB9,   // config
  zB9,   // context
  $B9,   // context
  UB9,   // copy
  dB9,   // cost
  ez1,   // doctor
  v79,   // feedback
  F29,   // help
  w29,   // ide
  O29,   // init
  j29,   // login
  I99,   // logout
  K99,   // mcp
  H49,   // memory
  Z29,   // permissions
  w39,   // plan
  lZ9,   // plugin
  sZ9,   // pr-comments
  ZY9,   // release-notes
  SG9,   // rename
  R39,   // resume
  v39,   // review
  b39,   // status
  Y59,   // tasks
  W59,   // todos
  mY9,   // usage
  V59,   // vim
  // ... more commands
  ...!Yk() ? [UL2, aj2()] : [],  // Conditional debug commands
  // ...
]);

// READABLE (for understanding):
const getAllBuiltinCommands = memoize(() => [
  addDirCommand,
  modelCommand,
  clearCommand,
  compactCommand,
  colorCommand,
  configCommand,
  contextCommand,
  copyCommand,
  costCommand,
  doctorCommand,
  feedbackCommand,
  helpCommand,
  ideCommand,
  initCommand,
  loginCommand,
  logoutCommand,
  mcpCommand,
  memoryCommand,
  permissionsCommand,
  planCommand,
  pluginCommand,
  prCommentsCommand,
  releaseNotesCommand,
  renameCommand,
  resumeCommand,
  reviewCommand,
  statusCommand,
  tasksCommand,
  todosCommand,
  usageCommand,
  vimCommand,
  // ... conditional commands
]);

// Mapping: nY9→getAllBuiltinCommands, W0→memoize
```

### getBuiltinCommandNames (xs)

Derived set for O(1) lookup of built-in command names:

```javascript
// Location: chunks.146.mjs:2447
xs = W0(() => new Set(nY9().map((A) => A.name)));

// READABLE:
const getBuiltinCommandNames = memoize(() =>
  new Set(getAllBuiltinCommands().map(cmd => cmd.name))
);
```

---

## Command Type Reference

| Type | Description | Example |
|------|-------------|---------|
| `local-jsx` | Interactive React/Ink UI component | `/help`, `/config`, `/model` |
| `local` | Synchronous text output | `/cost`, `/clear`, `/compact` |
| `prompt` | LLM invocation with custom prompt | `/init`, `/review` |

---

## Configuration Commands

### /config

**Type:** `local-jsx`

**Aliases:** `theme`

**Location:** chunks.137.mjs:1751

**Description:** Open configuration panel

```javascript
// ORIGINAL (for source lookup):
WB9 = {
  aliases: ["theme"],
  type: "local-jsx",
  name: "config",
  description: "Open config panel",
  isEnabled: () => !0,
  isHidden: !1,
  async call(A, Q) {
    return React.createElement(ConfigPanel, {
      onClose: A,
      context: Q,
      defaultTab: "Config"
    })
  },
  userFacingName() { return "config" }
};
```

**Features:**
- Interactive configuration UI
- Multiple tabs: Config, Usage
- Model selection, permissions, MCP servers

---

### /model

**Type:** `local-jsx`

**Location:** chunks.145.mjs:2226

**Description:** Set the AI model for Claude Code

**Arguments:** `[model]` (optional)

```javascript
// ============================================
// modelCommand - Model selection command
// Location: chunks.145.mjs:2226
// ============================================

// ORIGINAL (for source lookup):
TG9 = {
  type: "local-jsx",
  name: "model",
  description: "Set the AI model",
  aliases: [],
  isEnabled: () => !0,
  isHidden: !1,
  argumentHint: "[model]",
  call(A, Q, B) {
    let G = B.trim();
    if (G === "show") return showCurrentModel(Q);
    if (G) return setModelDirect(G, A, Q);
    return React.createElement(ModelSelector, { onComplete: A, context: Q });
  },
  userFacingName() { return "model" }
};
```

**Features:**
- Interactive model selection menu (no argument)
- Direct model setting via `/model <name>`
- Show current model info via `/model show`
- Model aliases: `opus` → `claude-opus-4-5-20251101`, `sonnet` → `claude-sonnet-4-5-20251101`, `haiku` → `claude-haiku-3-5-20250115`

#### Model Switching & Thought Signatures

When switching between models (especially Opus ↔ Sonnet), Claude Code must handle extended thinking signature compatibility.

**The Problem:**
- Opus 4.5 produces extended thinking blocks with signatures
- Sonnet may not support or may misinterpret these signatures
- Switching models mid-conversation can cause context corruption

**The Solution:**
```
┌──────────────────────────────────────────────────────────────────┐
│                    MODEL SWITCH FLOW                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  User: /model sonnet                                              │
│        │                                                          │
│        ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ 1. Detect if switching from Opus → non-Opus                  │ │
│  │ 2. Check for trailing thinking blocks in history             │ │
│  │ 3. Filter incompatible thinking signatures                   │ │
│  └─────────────────────────────────────────────────────────────┘ │
│        │                                                          │
│        ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ filterTrailingThinkingBlocks()                               │ │
│  │ - Remove trailing thinking content from last assistant msg   │ │
│  │ - Preserve conversation context                              │ │
│  │ - Update API context management                              │ │
│  └─────────────────────────────────────────────────────────────┘ │
│        │                                                          │
│        ▼                                                          │
│  Model switch complete with clean context                         │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

**Key insight:** The model switching logic ensures context compatibility by cleaning up model-specific artifacts before switching, preventing API errors and context corruption.

---

### /permissions

**Type:** `local-jsx`

**Location:** chunks.143.mjs:1539

**Description:** Show and manage tool permissions

---

## Context Management Commands

### /clear

**Type:** `local`

**Aliases:** `reset`, `new`

**Location:** chunks.136.mjs:1953-1970

**Description:** Clear conversation history and free up context

```javascript
// ============================================
// clearCommand - Clear conversation history
// Location: chunks.136.mjs:1953-1970 (Ln 402539)
// ============================================

// ORIGINAL (for source lookup):
VY7 = {
  type: "local",
  name: "clear",
  description: "Clear conversation history and free up context",
  aliases: ["reset", "new"],
  isEnabled: () => !0,
  isHidden: !1,
  supportsNonInteractive: !1,
  async call(A, Q) {
    return T9("clear"), await IE1(Q), {
      type: "text",
      value: ""
    }
  },
  userFacingName() { return "clear" }
};

// READABLE (for understanding):
const clearCommand = {
  type: "local",
  name: "clear",
  description: "Clear conversation history and free up context",
  aliases: ["reset", "new"],
  isEnabled: () => true,
  isHidden: false,
  supportsNonInteractive: false,
  async call(args, context) {
    telemetry("clear");
    await clearConversation(context);
    return { type: "text", value: "" };
  },
  userFacingName() { return "clear"; }
};

// Mapping: VY7→clearCommand, T9→telemetry, IE1→clearConversation
```

---

### /compact

**Type:** `local`

**Location:** chunks.136.mjs:2097-2150

**Description:** Clear conversation history but keep a summary in context

**Arguments:** `<optional custom summarization instructions>`

```javascript
// ============================================
// compactCommand - Compact with summary
// Location: chunks.136.mjs:2097-2150 (Ln 402681)
// ============================================

// ORIGINAL (for source lookup):
EY7 = {
  type: "local",
  name: "compact",
  description: "Clear conversation history but keep a summary in context. Optional: /compact [instructions for summarization]",
  isEnabled: () => !a1(process.env.DISABLE_COMPACT),
  isHidden: !1,
  supportsNonInteractive: !0,
  argumentHint: "<optional custom summarization instructions>",
  async call(A, Q) {
    T9("compact");
    let { abortController: B, messages: G } = Q;
    if (G.length === 0) throw Error("No messages to compact");
    // ... compaction logic
  },
  userFacingName() { return "compact" }
};

// READABLE (for understanding):
const compactCommand = {
  type: "local",
  name: "compact",
  description: "Clear conversation history but keep a summary in context",
  isEnabled: () => !parseBoolean(process.env.DISABLE_COMPACT),
  argumentHint: "<optional custom summarization instructions>",
  async call(args, context) {
    telemetry("compact");
    const { abortController, messages } = context;

    if (messages.length === 0) {
      throw Error("No messages to compact");
    }

    const customInstructions = args.trim();

    // Try fast compaction first (if no custom instructions)
    if (!customInstructions) {
      const fastResult = await tryFastCompact(messages, context.agentId);
      if (fastResult) {
        clearCaches();
        return { type: "compact", compactionResult: fastResult };
      }
    }

    // Fall back to full compaction with LLM
    const filtered = await filterMessages(messages, context);
    const result = await compactMessages(filtered, context, customInstructions);
    clearCaches();

    return { type: "compact", compactionResult: result };
  },
  userFacingName() { return "compact"; }
};

// Mapping: EY7→compactCommand, sF1→tryFastCompact, cF1→compactMessages
```

**Features:**
- Custom summarization instructions
- Fast compaction path (no LLM) when possible
- Full LLM-based compaction as fallback

---

### /context

**Type:** `local-jsx`

**Location:** chunks.137.mjs:2155

**Description:** See the context sent to Claude

---

### /memory

**Type:** `local-jsx`

**Location:** chunks.138.mjs:79

**Description:** Edit CLAUDE.md project memory

```javascript
// ============================================
// memoryCommand - Edit project memory
// Location: chunks.138.mjs:79
// ============================================

// ORIGINAL (for source lookup):
H49 = {
  type: "local-jsx",
  name: "memory",
  description: "Edit CLAUDE.md project memory",
  aliases: ["claude.md"],
  isEnabled: () => !0,
  isHidden: !1,
  async call(A, Q) {
    return React.createElement(MemoryEditor, {
      onComplete: A,
      context: Q,
      memoryPath: await getClaudeMdPath(Q.cwd)
    });
  },
  userFacingName() { return "memory" }
};
```

**Features:**
- Interactive editor for CLAUDE.md
- Auto-creates if not exists
- Shows current memory content
- Validates markdown format

**Memory Hierarchy:**
| Level | Path | Priority |
|-------|------|----------|
| Managed | `{managed}/.claude/CLAUDE.md` | Highest |
| User | `~/.claude/CLAUDE.md` | Medium |
| Project | `.claude/CLAUDE.md` or `CLAUDE.md` | Lowest |

---

### /add-dir

**Type:** `local-jsx`

**Location:** chunks.135.mjs:3596

**Description:** Add a directory to the project context

---

## Session Commands

### /help

**Type:** `local-jsx`

**Location:** chunks.138.mjs:327

**Description:** Show help and available commands

```javascript
// ============================================
// helpCommand - Show help and available commands
// Location: chunks.138.mjs:327
// ============================================

// ORIGINAL (for source lookup):
F29 = {
  type: "local-jsx",
  name: "help",
  description: "Show help and available commands",
  aliases: ["?"],
  isEnabled: () => !0,
  isHidden: !1,
  async call(A, Q) {
    let B = await Aj(Q.options);  // Get all commands
    return React.createElement(HelpPanel, {
      commands: B.filter(G => !G.isHidden),
      onComplete: A,
      context: Q
    });
  },
  userFacingName() { return "help" }
};
```

**Features:**
- Lists all available slash commands with descriptions
- Filters hidden commands from display
- Shows command aliases
- Groups by category (built-in, custom, plugins)

---

### /cost

**Type:** `local-jsx`

**Location:** chunks.137.mjs:2231

**Description:** Show token usage and cost statistics

---

### /status

**Type:** `local-jsx`

**Location:** chunks.142.mjs:3116

**Description:** Show system status and information

```javascript
// ============================================
// statusCommand - Show system status
// Location: chunks.142.mjs:3116
// ============================================

// ORIGINAL (for source lookup):
b39 = {
  type: "local-jsx",
  name: "status",
  description: "Show status",
  aliases: ["info"],
  isEnabled: () => !0,
  isHidden: !1,
  async call(A, Q) {
    return React.createElement(StatusPanel, {
      onComplete: A,
      context: Q,
      sessionInfo: await getSessionInfo(Q),
      systemInfo: await getSystemInfo()
    });
  },
  userFacingName() { return "status" }
};
```

**Information Displayed:**
- Current session ID
- Working directory
- Current model
- Authentication status
- MCP servers connected
- Plugin status
- Memory/context usage

---

### /todos

**Type:** `local-jsx`

**Location:** chunks.143.mjs:798

**Description:** Show current todo list

---

### /tasks

**Type:** `local-jsx`

**Location:** chunks.146.mjs (Y59)

**Description:** Show background tasks

---

### /resume

**Type:** `local-jsx`

**Location:** chunks.142.mjs:2850

**Description:** Resume a previous conversation

---

### /vim

**Type:** `local-jsx`

**Location:** chunks.143.mjs:1155

**Description:** Toggle vim mode for input

---

## Development Commands

### /init

**Type:** `prompt`

**Location:** chunks.138.mjs:727

**Description:** Initialize CLAUDE.md file for the project

---

### /review

**Type:** `prompt`

**Location:** chunks.142.mjs:2932

**Description:** Code review for current changes

---

### /plan

**Type:** `local-jsx`

**Location:** chunks.143.mjs:1597

**Description:** Toggle plan mode for implementation planning

---

### /doctor

**Type:** `local-jsx`

**Location:** chunks.137.mjs:3332

**Description:** Check system health and diagnose issues

```javascript
// ============================================
// doctorCommand - System health check
// Location: chunks.137.mjs:3332
// ============================================

// Key health checks performed:
// 1. Authentication status
// 2. API connectivity
// 3. MCP server health
// 4. Permission configuration
// 5. Plugin status
// 6. LSP server connectivity
```

**Features:**
- Validates authentication tokens
- Tests API connectivity
- Checks MCP server connections
- Verifies file permissions
- Diagnoses common issues with actionable fixes

**Usage:**
```
/doctor          # Run all health checks
/doctor auth     # Check only authentication
/doctor mcp      # Check only MCP servers
```

---

### /ide

**Type:** `local-jsx`

**Location:** chunks.138.mjs:635

**Description:** IDE integration settings

---

## MCP Commands

### /mcp

**Type:** `local-jsx`

**Location:** chunks.140.mjs:2947

**Description:** MCP server management

**Features:**
- List connected MCP servers
- Show available tools
- Server configuration

---

## Authentication Commands

### /login

**Type:** `local-jsx`

**Location:** chunks.146.mjs (j29)

**Description:** Log in to Claude Code

---

### /logout

**Type:** `local`

**Location:** chunks.107.mjs:1569

**Description:** Log out from Claude Code

---

## Plugin Commands

### /plugin

**Type:** `local-jsx`

**Location:** chunks.146.mjs (lZ9)

**Description:** Manage plugins

See: [25_plugin/slash_command.md](../25_plugin/slash_command.md)

---

## Command Object Interface

All built-in commands implement this interface:

```typescript
interface BuiltinCommand {
  name: string;                    // Command name (e.g., "help")
  type: "local" | "local-jsx" | "prompt";
  description: string;             // Help text
  aliases?: string[];              // Alternative names
  argumentHint?: string;           // Argument description
  isEnabled: () => boolean;        // Dynamic enable/disable
  isHidden: boolean;               // Hide from help
  supportsNonInteractive?: boolean; // Works in --print mode
  userFacingName: () => string;    // Display name

  // Type-specific call signatures:
  // local:     call(args, context) => Promise<Result>
  // local-jsx: call(onComplete, context, args) => Promise<JSXElement>
  // prompt:    getPromptForCommand(args, context) => Promise<Content[]>
}
```

---

## Related Modules

- [parsing.md](./parsing.md) - Command parsing
- [execution.md](./execution.md) - Command execution flow
- [custom_commands.md](./custom_commands.md) - User-defined SKILL.md commands
