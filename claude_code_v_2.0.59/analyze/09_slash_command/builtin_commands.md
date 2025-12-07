# Built-in Slash Commands

## Overview

Claude Code v2.0.59 provides 40+ built-in slash commands for configuration, debugging, context visualization, and more. This document catalogs all built-in commands with their types, implementations, and usage.

> Symbol mappings: [symbol_index.md](../00_overview/symbol_index.md)

---

## Command Registry Architecture

### getAllBuiltinCommands (KE9)

All built-in commands are registered through a centralized function:

```javascript
// ============================================
// getAllBuiltinCommands - Registry of all built-in commands
// Location: chunks.152.mjs:2265
// ============================================

// ORIGINAL (for source lookup):
KE9 = s1(() => [
  KV9,    // add-dir
  mH9,    // model
  LV9,    // clear
  OV9,    // compact
  rV9,    // config
  QF9,    // context
  GF9,    // cost
  EF9,    // doctor
  hI1,    // help
  aD9,    // ide
  kF9,    // init
  gF9,    // memory
  mF9,    // permissions
  NK9,    // plan
  jK9,    // pr-comments
  MF9,    // ...more
  rC9,    // release-notes
  tC9,    // rename
  IE9,    // resume
  EC9,    // status
  yK9,    // tasks
  bK9,    // todos
  hK9,    // usage
  iK9,    // vim
  sK9,    // review
  XE9,    // mcp
  xC9,    // feedback
  ...!N_() ? [FO2, d49()] : [],  // Conditional commands
  oK9,    // ...
  ...[]
]);

// READABLE (for understanding):
const getAllBuiltinCommands = memoize(() => [
  addDirCommand,
  modelCommand,
  clearCommand,
  compactCommand,
  configCommand,
  contextCommand,
  costCommand,
  doctorCommand,
  helpCommand,
  ideCommand,
  initCommand,
  memoryCommand,
  permissionsCommand,
  planCommand,
  prCommentsCommand,
  // ... more commands
  ...(!isHeadlessMode() ? [debugCommands] : []),
  // ... remaining commands
]);

// Mapping: KE9→getAllBuiltinCommands, s1→memoize
```

### getBuiltinCommandNames (Ny)

Derived set for O(1) lookup of built-in command names:

```javascript
// Location: chunks.152.mjs:2265
Ny = s1(() => new Set(KE9().map((A) => A.name)));

// READABLE:
const getBuiltinCommandNames = memoize(() =>
  new Set(getAllBuiltinCommands().map(cmd => cmd.name))
);
```

---

## Command Type Reference

| Type | Description | Example |
|------|-------------|---------|
| `local-jsx` | Interactive React/Ink UI component | `/help`, `/config` |
| `local` | Synchronous text output | `/cost`, `/clear` |
| `prompt` | LLM invocation with custom prompt | `/init`, `/pr-comments` |

---

## All Built-in Commands

### Configuration Commands

#### /config

**Type:** `local-jsx`

**Aliases:** `theme`

**Description:** Open configuration panel

**Definition:**
```javascript
// ============================================
// configCommand - Open config panel
// Location: chunks.148.mjs:309-326
// ============================================

// ORIGINAL (for source lookup):
ky3 = {
  aliases: ["theme"],
  type: "local-jsx",
  name: "config",
  description: "Open config panel",
  isEnabled: () => !0,
  isHidden: !1,
  async call(A, Q) {
    return rV0.createElement(zVA, {
      onClose: A,
      context: Q,
      defaultTab: "Config"
    })
  },
  userFacingName() {
    return "config"
  }
};

// READABLE (for understanding):
const configCommand = {
  aliases: ["theme"],
  type: "local-jsx",
  name: "config",
  description: "Open config panel",
  isEnabled: () => true,
  isHidden: false,
  async call(onComplete, context) {
    return React.createElement(ConfigPanel, {
      onClose: onComplete,
      context: context,
      defaultTab: "Config"
    });
  },
  userFacingName() {
    return "config";
  }
};
```

**Features:**
- Interactive configuration UI
- Multiple tabs: Config, Usage
- Model selection, permissions, MCP servers
- Theme settings, environment variables

---

#### /permissions

**Type:** `local-jsx`

**Description:** Show and manage tool permissions

**Features:**
- View current permissions
- Modify permission levels
- Manage allowed/disallowed tools

---

#### /model

**Type:** `local-jsx`

**Description:** Select and switch AI models

**Features:**
- List available models
- Switch between models
- Show model capabilities

---

### Context Commands

#### /context

**Type:** `local-jsx`

**Description:** Visualize current context usage as a colored grid

**Definition:**
```javascript
// ============================================
// contextCommand - Visualize context usage
// Location: chunks.148.mjs:656-694
// ============================================

// ORIGINAL (for source lookup):
by3 = {
  name: "context",
  description: "Visualize current context usage as a colored grid",
  isEnabled: () => !0,
  isHidden: !1,
  type: "local-jsx",
  userFacingName() {
    return this.name
  },
  async call(A, {
    messages: Q,
    getAppState: B,
    options: {
      mainLoopModel: G,
      tools: Z,
      isNonInteractiveSession: I
    }
  }) {
    // ... renders context visualization grid
  }
};

// READABLE (for understanding):
const contextCommand = {
  name: "context",
  description: "Visualize current context usage as a colored grid",
  isEnabled: () => true,
  isHidden: false,
  type: "local-jsx",
  userFacingName() {
    return this.name;
  },
  async call(onComplete, {
    messages,
    getAppState,
    options: { mainLoopModel, tools, isNonInteractiveSession }
  }) {
    // Renders colored grid showing token usage
  }
};
```

**Features:**
- Visual grid representation of token usage
- Color-coded blocks for different message types
- Shows percentage of context used
- Supports non-interactive mode (text output)

---

#### /cost

**Type:** `local`

**Description:** Show the total cost and duration of the current session

**Definition:**
```javascript
// ============================================
// costCommand - Show session cost
// Location: chunks.148.mjs:705-732
// ============================================

// ORIGINAL (for source lookup):
hy3 = {
  type: "local",
  name: "cost",
  description: "Show the total cost and duration of the current session",
  isEnabled: () => !0,
  get isHidden() {
    return BB()  // Hidden for subscription users
  },
  supportsNonInteractive: !0,
  async call() {
    if (BB()) {
      // Subscription user message
      let A;
      if (ik.isUsingOverage)
        A = "You are currently using your overages...";
      else
        A = "You are currently using your subscription...";
      return { type: "text", value: A };
    }
    return {
      // API cost calculation
      type: "text",
      value: formatCostOutput()
    }
  }
};

// READABLE (for understanding):
const costCommand = {
  type: "local",
  name: "cost",
  description: "Show the total cost and duration of the current session",
  isEnabled: () => true,
  get isHidden() {
    return isSubscriptionUser();  // Hidden for Pro/Max users
  },
  supportsNonInteractive: true,
  async call() {
    if (isSubscriptionUser()) {
      // Show subscription message instead of cost
      if (subscriptionState.isUsingOverage) {
        return { type: "text", value: "Using overages..." };
      }
      return { type: "text", value: "Using subscription..." };
    }
    // Show actual API cost
    return { type: "text", value: formatCostOutput() };
  }
};
```

**Features:**
- Shows API costs (for API key users)
- Session duration
- Token usage statistics
- Hidden for subscription users

---

#### /usage

**Type:** `local-jsx`

**Description:** Show usage limits and rate limit information

**Features:**
- Visual usage bars for rate limits
- Time windows: session, weekly
- Reset time countdowns
- Interactive refresh (press 'r')

---

### Session Commands

#### /clear

**Type:** `local`

**Aliases:** `reset`, `new`

**Description:** Clear conversation history and free up context

**Definition:**
```javascript
// ============================================
// clearCommand - Clear conversation history
// Location: chunks.147.mjs:2273-2290
// ============================================

// ORIGINAL (for source lookup):
Ny3 = {
  type: "local",
  name: "clear",
  description: "Clear conversation history and free up context",
  aliases: ["reset", "new"],
  isEnabled: () => !0,
  isHidden: !1,
  supportsNonInteractive: !1,
  async call(A, Q) {
    return await qy3(Q), {
      type: "text",
      value: ""
    }
  },
  userFacingName() {
    return "clear"
  }
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
    await clearConversation(context);
    return { type: "text", value: "" };
  },
  userFacingName() {
    return "clear";
  }
};
```

**Features:**
- Clears all conversation messages
- Resets context to initial state
- Keeps configuration settings
- Cannot be undone

---

#### /compact

**Type:** `local`

**Description:** Clear conversation history but keep a summary in context

**Argument Hint:** `<optional custom summarization instructions>`

**Definition:**
```javascript
// ============================================
// compactCommand - Compact conversation with summary
// Location: chunks.147.mjs:2307-2357
// ============================================

// ORIGINAL (for source lookup):
Ly3 = {
  type: "local",
  name: "compact",
  description: "Clear conversation history but keep a summary in context. Optional: /compact [instructions for summarization]",
  isEnabled: () => !Y0(process.env.DISABLE_COMPACT),
  isHidden: !1,
  supportsNonInteractive: !0,
  argumentHint: "<optional custom summarization instructions>",
  async call(A, Q) {
    let { abortController: B, messages: G } = Q;
    if (G.length === 0) throw Error("No messages to compact");
    let Z = A.trim();
    try {
      if (!Z) {
        // Auto-compact without custom instructions
        let V = await f91(G, Q.agentId);
        if (V) {
          DK.cache.clear?.(), gV.cache.clear?.();
          return {
            type: "compact",
            compactionResult: V,
            displayText: tA.dim("Compacted...")
          }
        }
      }
      // Compact with custom instructions
      let Y = (await Si(G, void 0, Q)).messages,
        J = await j91(Y, Q, !1, Z);
      DK.cache.clear?.(), gV.cache.clear?.();
      return {
        type: "compact",
        compactionResult: J,
        displayText: tA.dim("Compacted...")
      }
    } catch (I) {
      if (B.signal.aborted) throw Error("Compaction canceled.");
      throw Error(`Error during compaction: ${I}`)
    }
  }
};

// READABLE (for understanding):
const compactCommand = {
  type: "local",
  name: "compact",
  description: "Clear conversation history but keep a summary in context",
  isEnabled: () => !parseBoolean(process.env.DISABLE_COMPACT),
  isHidden: false,
  supportsNonInteractive: true,
  argumentHint: "<optional custom summarization instructions>",
  async call(args, context) {
    const { abortController, messages } = context;
    if (messages.length === 0) {
      throw Error("No messages to compact");
    }

    const customInstructions = args.trim();

    try {
      if (!customInstructions) {
        // Try fast auto-compaction first
        const result = await tryFastCompaction(messages, context.agentId);
        if (result) {
          clearCaches();
          return { type: "compact", compactionResult: result };
        }
      }

      // Full compaction with optional custom instructions
      const processedMessages = (await processMessages(messages, undefined, context)).messages;
      const result = await performCompaction(processedMessages, context, false, customInstructions);
      clearCaches();
      return { type: "compact", compactionResult: result };
    } catch (error) {
      if (abortController.signal.aborted) {
        throw Error("Compaction canceled.");
      }
      throw Error(`Error during compaction: ${error}`);
    }
  }
};
```

**Features:**
- Summarizes conversation to reduce tokens
- Preserves important context
- Supports custom summarization instructions
- Runs PreCompact hooks
- Clears caches after compaction

---

#### /resume

**Type:** `local-jsx`

**Description:** Resume a previous conversation

**Features:**
- List recent sessions
- Select session to resume
- Load conversation history

---

### IDE Integration Commands

#### /ide

**Type:** `local-jsx`

**Description:** Select and connect to an IDE

**Features:**
- Lists available IDEs (VS Code, Cursor, JetBrains, Zed)
- Shows workspace folders for each IDE
- Auto-connect option
- Connection status display

---

### Memory Commands

#### /memory

**Type:** `local-jsx`

**Description:** Edit Claude memory files

**Definition:**
```javascript
// ============================================
// memoryCommand - Edit memory files
// Location: chunks.148.mjs:1478-1493
// ============================================

// ORIGINAL (for source lookup):
ny3 = {
  type: "local-jsx",
  name: "memory",
  description: "Edit Claude memory files",
  isEnabled: () => !0,
  isHidden: !1,
  async call(A) {
    return JN.createElement(ay3, {
      onDone: A
    })
  },
  userFacingName() {
    return this.name
  }
};

// READABLE (for understanding):
const memoryCommand = {
  type: "local-jsx",
  name: "memory",
  description: "Edit Claude memory files",
  isEnabled: () => true,
  isHidden: false,
  async call(onComplete) {
    return React.createElement(MemoryEditor, {
      onDone: onComplete
    });
  },
  userFacingName() {
    return this.name;
  }
};
```

**Features:**
- View CLAUDE.md files in context
- Edit memory files (user, project, local)
- Token counts for each file
- Memory hierarchy visualization

---

#### /init

**Type:** `prompt`

**Description:** Initialize Claude Code configuration for current project

**Features:**
- Creates `.claude/` directory
- Generates initial `settings.json`
- Interactive setup wizard
- LLM-assisted configuration

---

### Diagnostics Commands

#### /doctor

**Type:** `local-jsx`

**Description:** Run diagnostics and show system health

**Features:**
- System health checks
- Configuration validation
- MCP server diagnostics
- Environment variable validation
- Large file warnings
- Agent description size checks

---

### Help Commands

#### /help

**Type:** `local-jsx`

**Description:** Show help and available commands

**Features:**
- Lists all available commands
- Shows command descriptions
- Displays command aliases
- Multiple tabs: general, commands, custom-commands

---

### Task Management Commands

#### /tasks

**Type:** `local-jsx`

**Aliases:** `bashes`

**Description:** View and manage background tasks

**Features:**
- List running background tasks
- View task output
- Manage task lifecycle

---

#### /todos

**Type:** `local-jsx`

**Description:** View and manage todo list

**Features:**
- Display current todos
- Mark todos as complete
- Add/remove todo items

---

### GitHub Integration Commands

#### /pr-comments

**Type:** `prompt`

**Description:** Review pull request comments

**Features:**
- Fetch PR comments from GitHub
- LLM analysis of comments
- Suggested responses

---

#### /review

**Type:** `prompt`

**Description:** Review code changes

**Features:**
- Analyze code diff
- LLM-powered code review
- Suggestions and improvements

---

### MCP Commands

#### /mcp

**Type:** `local-jsx`

**Description:** MCP server management

**Features:**
- List configured MCP servers
- Server status and health
- Reconnect servers
- View server tools

---

### Feedback Commands

#### /feedback

**Type:** `local-jsx`

**Aliases:** `bug`

**Description:** Submit feedback about Claude Code

**Definition:**
```javascript
// ============================================
// feedbackCommand - Submit feedback
// Location: chunks.147.mjs:2209-2216
// ============================================

// ORIGINAL (for source lookup):
wy3 = {
  aliases: ["bug"],
  type: "local-jsx",
  name: "feedback",
  description: "Submit feedback about Claude Code",
  argumentHint: "[report]",
  isEnabled: () => !(
    Y0(process.env.CLAUDE_CODE_USE_BEDROCK) ||
    Y0(process.env.CLAUDE_CODE_USE_VERTEX) ||
    Y0(process.env.CLAUDE_CODE_USE_FOUNDRY) ||
    process.env.DISABLE_FEEDBACK_COMMAND ||
    process.env.DISABLE_BUG_COMMAND ||
    process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC
  ),
  // ...
};

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
    process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC
  ),
  // Disabled for Bedrock/Vertex/Foundry users
};
```

**Features:**
- Opens feedback form
- Sends feedback to Anthropic
- Can include session context
- Disabled for enterprise deployments

---

### Directory Commands

#### /add-dir

**Type:** `local-jsx`

**Argument Hint:** `<path>`

**Description:** Add a new working directory

**Features:**
- Add additional working directory
- Path validation
- Multi-directory support

---

### Other Commands

#### /release-notes

**Type:** `local`

**Description:** View release notes

**Definition:**
```javascript
// ============================================
// releaseNotesCommand - View release notes
// Location: chunks.149.mjs:1527-1555
// ============================================

// ORIGINAL (for source lookup):
{
  description: "View release notes",
  isEnabled: () => !0,
  isHidden: !1,
  name: "release-notes",
  userFacingName() {
    return "release-notes"
  },
  type: "local",
  supportsNonInteractive: !0,
  async call() {
    let A = [];
    try {
      let B = new Promise((G, Z) => {
        setTimeout(() => Z(Error("Timeout")), 500)  // 500ms timeout
      });
      await Promise.race([eW0(), B]), A = AX0(SQA())
    } catch {}
    if (A.length > 0) return {
      type: "text",
      value: vK9(A)
    }
    // ...
  }
};

// READABLE (for understanding):
const releaseNotesCommand = {
  description: "View release notes",
  isEnabled: () => true,
  isHidden: false,
  name: "release-notes",
  type: "local",
  supportsNonInteractive: true,
  async call() {
    let notes = [];
    try {
      // Race with 500ms timeout
      const timeout = new Promise((_, reject) => {
        setTimeout(() => reject(Error("Timeout")), 500);
      });
      await Promise.race([fetchReleaseNotes(), timeout]);
      notes = parseReleaseNotes(getReleaseNotesCache());
    } catch {}
    if (notes.length > 0) {
      return { type: "text", value: formatReleaseNotes(notes) };
    }
    // ...
  }
};
```

**Features:**
- Fetches release notes
- 500ms timeout for responsiveness
- Cached results
- Supports non-interactive mode

---

#### /vim

**Type:** `local`

**Description:** Toggle vim mode

**Features:**
- Enable/disable vim keybindings
- Vim mode indicators
- Modal editing support

---

#### /plan

**Type:** `prompt`

**Description:** Create a plan for complex tasks

**Features:**
- LLM-assisted planning
- Step-by-step task breakdown
- Plan file generation

---

#### /status

**Type:** `local-jsx`

**Description:** Show current session status

**Features:**
- Display session info
- Model in use
- Context usage
- Configuration state

---

## Command Property Reference

### Standard Properties

```typescript
interface Command {
  // Required
  name: string;                    // Internal command name
  type: "local" | "local-jsx" | "prompt";
  description: string;             // User-visible description

  // Optional
  aliases?: string[];              // Alternative names
  argumentHint?: string;           // Usage hint for args
  isEnabled: () => boolean;        // Dynamic enable/disable
  isHidden?: boolean | (() => boolean);  // Hide from /help
  supportsNonInteractive?: boolean; // Works in headless mode

  // Required methods
  call: (...) => Promise<...>;     // Execution handler
  userFacingName: () => string;    // Display name
}
```

### Type-Specific Call Signatures

**local-jsx:**
```typescript
async call(
  onComplete: (output: string, options?: DisplayOptions) => void,
  context: ToolUseContext,
  args: string
): Promise<JSX.Element>
```

**local:**
```typescript
async call(
  args: string,
  context: ToolUseContext
): Promise<CommandResult>
```

**prompt:**
```typescript
// Uses getPromptForCommand() instead of call()
async getPromptForCommand(
  args: string,
  context: ToolUseContext
): Promise<ContentBlock[]>
```

---

## isEnabled Patterns

Commands use various conditions to determine availability:

### Always Enabled
```javascript
isEnabled: () => true
```

### Environment Variable Control
```javascript
isEnabled: () => !parseBoolean(process.env.DISABLE_COMPACT)
```

### Subscription-Based
```javascript
isEnabled: () => isSubscriptionUser()
```

### Platform-Specific
```javascript
isEnabled: () => !isHeadlessMode()
```

### Feature Flag
```javascript
isEnabled: () => hasFeatureFlag("experimental_feature")
```

---

## isHidden Patterns

Commands can be hidden from `/help`:

### Static Hidden
```javascript
isHidden: true
```

### Dynamic Hidden
```javascript
get isHidden() {
  return isSubscriptionUser();  // Hide /cost for subscribers
}
```

### Conditional
```javascript
isHidden: () => !isDebugMode()
```

---

## Command Aliases

| Command | Aliases |
|---------|---------|
| `/config` | `/theme` |
| `/clear` | `/reset`, `/new` |
| `/feedback` | `/bug` |
| `/tasks` | `/bashes` |

---

## Command Categories Summary

| Category | Commands | Count |
|----------|----------|-------|
| Configuration | config, permissions, model | 3 |
| Context | context, cost, usage | 3 |
| Session | clear, compact, resume | 3 |
| IDE | ide | 1 |
| Memory | memory, init | 2 |
| Diagnostics | doctor | 1 |
| Help | help | 1 |
| Tasks | tasks, todos | 2 |
| GitHub | pr-comments, review | 2 |
| MCP | mcp | 1 |
| Feedback | feedback | 1 |
| Directory | add-dir | 1 |
| Other | release-notes, vim, plan, status, ... | 5+ |

---

## See Also

- [Command Parsing](./parsing.md) - How commands are parsed
- [Command Execution](./execution.md) - How commands execute
- [Custom Commands](./custom_commands.md) - Custom command loading
- [Streaming and Errors](./streaming_errors.md) - Error handling
