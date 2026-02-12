# Slash Command System

## Overview

The slash command system is the primary mechanism through which users invoke discrete operations in Claude Code's REPL. When a user types a `/`-prefixed string (e.g., `/help`, `/compact`, `/review 42`), the system parses the input, resolves the command against a unified registry of built-in and skill-based commands, and dispatches it to the appropriate handler based on command type (`local`, `local-jsx`, or `prompt`).

The registry merges three sources of commands into a single list: built-in commands hardcoded in the binary, skill-directory commands loaded from `.claude/skills/` directories, and plugin/bundled skills from the marketplace. This design allows the slash command namespace to be extensible -- any `.md` file placed in a skills directory automatically becomes a new slash command -- while preserving a protected set of built-in commands that always take priority.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Skills, CLI)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Slash Commands)

Key functions in this document:
- `parseSlashCommand` (Db4) - Parses `/command args` syntax from raw input string
- `handleSlashInput` (Mb4) - Top-level dispatcher: routes parsed slash commands to execution
- `executeCommand` (ifY) - Switch-based executor for local/local-jsx/prompt command types
- `isCommandAvailable` (Sd) - Checks if a command name matches any registered command
- `findCommand` (zI) - Resolves a command name to its definition object (with alias support)
- `getAllCommands` (cZ) - Memoized loader that merges all command sources into a unified list
- `getBuiltinCommands` (QBA) - Returns the hardcoded array of all built-in command definitions
- `getSkills` (_9z) - Loads skill-dir, plugin, and bundled skill commands in parallel
- `BUILTIN_COMMAND_SET` (pBA) - Set of built-in command objects used for filtering
- `getSkillToolCommands` (hv) - Filters commands eligible for the Skill tool (model-invocable)
- `getSlashCommandSkills` (aO6) - Filters commands eligible for the slash command picker UI
- `formatCommandName` (VQ1) - Formats a command into XML metadata for the conversation
- `handlePromptCommand` (Wb4) - Executes prompt-type commands by building LLM messages
- `handleForkedCommand` (cfY) - Executes fork-context prompt commands with streaming progress

---

## Slash Command Parsing

### parseSlashCommand (Db4)

**What it does:** Extracts the command name, arguments, and MCP flag from a raw user input string that starts with `/`.

**How it works:**
1. Trim the input and verify it starts with `/`
2. Remove the leading `/` and split on spaces
3. If there is no token after `/`, return null (empty command)
4. The first token becomes `commandName`
5. If the second token is literally `"(MCP)"`, mark `isMcp: true` and shift the argument start index
6. Everything after the command name (and optional MCP marker) is joined as the `args` string

```javascript
// ============================================
// parseSlashCommand - Parse /command args from user input
// Location: chunks.130.mjs:1344-1358
// ============================================

// ORIGINAL (for source lookup):
function Db4(A) {
    let q = A.trim();
    if (!q.startsWith("/")) return null;
    let Y = q.slice(1).split(" ");
    if (!Y[0]) return null;
    let z = Y[0], w = !1, H = 1;
    if (Y.length > 1 && Y[1] === "(MCP)") z = z + " (MCP)", w = !0, H = 2;
    let $ = Y.slice(H).join(" ");
    return { commandName: z, args: $, isMcp: w }
}

// READABLE (for understanding):
function parseSlashCommand(input) {
    let trimmed = input.trim();
    if (!trimmed.startsWith("/")) return null;
    let tokens = trimmed.slice(1).split(" ");
    if (!tokens[0]) return null;
    let commandName = tokens[0], isMcp = false, argsStartIndex = 1;
    if (tokens.length > 1 && tokens[1] === "(MCP)") {
        commandName = commandName + " (MCP)";
        isMcp = true;
        argsStartIndex = 2;
    }
    let args = tokens.slice(argsStartIndex).join(" ");
    return { commandName, args, isMcp }
}

// Mapping: Db4->parseSlashCommand, A->input, q->trimmed, Y->tokens, z->commandName, w->isMcp, H->argsStartIndex, $->args
```

**Why this approach:**
- The MCP special-case (`(MCP)` as a second token) allows MCP server commands to be namespaced without conflicting with regular commands. This is a pragmatic choice for disambiguation since MCP commands may share names with built-in commands.
- Returning `null` for empty input or non-`/` input allows callers to cleanly branch between slash command handling and regular prompt submission.

**Key insight:** The parser is intentionally simple -- it does not validate the command name or check if it exists. Validation happens downstream in `handleSlashInput`, which allows the parser to be a pure string operation with no side effects or async dependencies.

---

## Command Registry Architecture

### getAllCommands (cZ) - The Unified Command List

**What it does:** Builds a single merged list of all available commands from multiple sources, with a defined priority order.

**How it works:**
1. Call `getSkills(toolUseContext)` to load skill-dir, plugin, and bundled skills in parallel
2. Call `YK1()` and `O9z()` concurrently to load MCP and other external commands
3. Call `iF4()` to get user-defined commands (from settings/config)
4. Merge all sources: `[...bundledSkills, ...skillDirCommands, ...mcpCommands, ...pluginSkills, ...externalCommands, ...builtinCommands]`
5. Filter to only enabled commands (`D.isEnabled()`)
6. If user-defined commands exist, splice them before the first built-in command in the list (giving them higher display priority without overriding built-ins)

```javascript
// ============================================
// getAllCommands - Merge all command sources into unified list
// Location: chunks.168.mjs:2292-2306
// ============================================

// ORIGINAL (for source lookup):
cZ = KA(async (A) => {
    let [{ skillDirCommands: q, pluginSkills: K, bundledSkills: Y }, z, w] = await Promise.all([
        _9z(A), YK1(), O9z()
    ]),
    H = iF4(),
    $ = [...Y, ...q, ...z, ...K, ...w, ...QBA()].filter((D) => D.isEnabled());
    if (H.length === 0) return $;
    let O = new Set($.map((D) => D.name)),
        _ = H.filter((D) => !O.has(D.name) && D.isEnabled());
    if (_.length === 0) return $;
    let J = new Set(QBA().map((D) => D.name)),
        X = $.findIndex((D) => J.has(D.name));
    if (X === -1) return [...$, ..._];
    return [...$.slice(0, X), ..._, ...$.slice(X)]
});

// READABLE (for understanding):
getAllCommands = memoized(async (toolUseContext) => {
    let [{ skillDirCommands, pluginSkills, bundledSkills }, mcpCommands, externalCommands] =
        await Promise.all([getSkills(toolUseContext), loadMcpCommands(), loadExternalCommands()]);
    let userDefinedCommands = getUserDefinedCommands();
    let allEnabled = [...bundledSkills, ...skillDirCommands, ...mcpCommands, ...pluginSkills,
                       ...externalCommands, ...getBuiltinCommands()].filter(cmd => cmd.isEnabled());
    if (userDefinedCommands.length === 0) return allEnabled;
    let existingNames = new Set(allEnabled.map(cmd => cmd.name));
    let newUserCommands = userDefinedCommands.filter(cmd => !existingNames.has(cmd.name) && cmd.isEnabled());
    if (newUserCommands.length === 0) return allEnabled;
    let builtinNames = new Set(getBuiltinCommands().map(cmd => cmd.name));
    let firstBuiltinIndex = allEnabled.findIndex(cmd => builtinNames.has(cmd.name));
    if (firstBuiltinIndex === -1) return [...allEnabled, ...newUserCommands];
    return [...allEnabled.slice(0, firstBuiltinIndex), ...newUserCommands, ...allEnabled.slice(firstBuiltinIndex)]
});

// Mapping: cZ->getAllCommands, KA->memoized, _9z->getSkills, YK1->loadMcpCommands, O9z->loadExternalCommands, iF4->getUserDefinedCommands, QBA->getBuiltinCommands
```

**Why this approach:**
- **Memoization via `KA`**: Loading skills from disk is expensive (file system reads for `.claude/skills/` directories, plugin manifests). Memoizing ensures this cost is paid once per session rather than on every command invocation.
- **Priority ordering**: Skills and plugins appear before built-ins in the merged list. This means that if a user has a skill named `commit`, it will be found first by `findCommand`. However, the `BUILTIN_COMMAND_SET` (pBA) prevents built-in commands from being displaced -- the filtering logic at the REPL level ensures built-in commands are never removed.
- **User-defined command insertion**: These are spliced before built-ins but after skills. This gives user-defined commands discoverability in the command picker without overriding either skills or built-ins.

**Key insight:** The command namespace has implicit priority: bundled skills > skill-dir commands > MCP commands > plugin skills > external commands > user-defined > built-in commands. But built-in commands are always present (they cannot be disabled or overridden by same-name skills) because the REPL separately checks `pBA`.

### getSkills (_9z) - Parallel Skill Loading

**What it does:** Loads the three categories of skill-based commands concurrently with graceful error isolation.

**How it works:**
1. Call `ukA(toolUseContext)` to scan `.claude/skills/` directories for SKILL.md files
2. Call `B0A()` to load plugin-based skills from installed marketplace plugins
3. Call `nHq()` to get the hardcoded bundled skills (shipped with the binary)
4. Each call is wrapped in `.catch()` so failure in one source does not block others
5. Return all three arrays as a named object

**Why this approach:** Each skill source has different failure modes (filesystem errors, network issues for plugins, etc.). The `.catch()` isolation pattern ensures that a corrupt skills directory does not prevent plugin skills from loading. This is critical for a CLI tool where the user's filesystem state is unpredictable.

---

## Built-in Commands

### Complete Built-in Command List

The `getBuiltinCommands` (QBA) function returns a static array of command definition objects. Each built-in command has:
- `name`: The canonical command name
- `type`: One of `"local"`, `"local-jsx"`, or `"prompt"`
- `description`: Human-readable help text
- `isEnabled()`: Whether the command is currently available
- `aliases`: Optional array of alternative names
- `load()`: Lazy loader that returns the command's implementation

The `BUILTIN_COMMAND_SET` (pBA) contains 17 "essential" commands that receive special treatment -- they survive command filtering and cannot be removed from the active command list:

| Command | Type | Description | Aliases | Source |
|---------|------|-------------|---------|--------|
| `/clear` | local | Clear conversation history and free up context | reset, new | chunks.152.mjs:1498 |
| `/compact` | local | Summarize and compact conversation history | -- | chunks.152.mjs:1741 |
| `/config` | local-jsx | Open config panel | settings | chunks.154.mjs:1540 |
| `/cost` | local | Show session cost and duration | -- | chunks.154.mjs:2256 |
| `/doctor` | local-jsx | Diagnose installation and settings | -- | chunks.155.mjs:434 |
| `/fast` | local-jsx | Toggle fast mode (Opus only) | -- | chunks.163.mjs:861 |
| `/help` | local-jsx | Show help and available commands | -- | chunks.155.mjs:1287 |
| `/init` | prompt | Create a CLAUDE.md for the codebase | -- | chunks.155.mjs:1765 |
| `/login` | local-jsx | Sign in with Anthropic account | -- | chunks.155.mjs:1895 |
| `/logout` | local-jsx | Sign out from Anthropic account | -- | chunks.155.mjs:1913 |
| `/memory` | local-jsx | Edit Claude memory files | -- | chunks.155.mjs:804 |
| `/permissions` | local-jsx | Manage tool permission rules | allowed-tools | chunks.163.mjs:466 |
| `/resume` | local-jsx | Resume a previous conversation | continue | chunks.161.mjs:2560 |
| `/review` | prompt | Review a pull request | -- | chunks.161.mjs:2580 |
| `/status` | local-jsx | Show version, model, account info | -- | chunks.161.mjs:2987 |
| `/terminal-setup` | local-jsx | Install Shift+Enter key binding | -- | chunks.155.mjs:831 |
| `/vim` | local | Toggle Vim/Normal editing modes | -- | chunks.162.mjs:1988 |

Additional built-in commands (in QBA but not in the essential pBA set) include:
- `/add-dir` - Add a new working directory
- `/bug` - Report a bug
- `/color` - Set UI color
- `/context` - Show context token usage
- `/debug` - Show debug information
- `/keybindings` - Edit keybinding configuration
- `/mcp` - Manage MCP servers
- `/model` - Switch models
- `/plan` - Manage plans
- `/pr-comments` - View PR comments
- `/theme` - Change UI theme
- `/upgrade` - Upgrade Claude Code

### Command Type Semantics

**`local` type:**
- Executes synchronously in the CLI process
- Returns a simple text result or a compaction result
- Does not render JSX UI components
- Examples: `/clear`, `/compact`, `/cost`, `/vim`

**`local-jsx` type:**
- Renders a React/Ink JSX component for interactive UI
- Can take over the full screen (hides prompt input)
- Has an `onDone` callback to return results when the user dismisses the UI
- Examples: `/help`, `/config`, `/doctor`, `/permissions`

**`prompt` type:**
- Generates messages that are injected into the LLM conversation
- The LLM then processes these messages and produces a response
- Supports `progressMessage` for loading indicators
- Can optionally fork a new agent context (`context: "fork"`)
- Examples: `/init`, `/review`

---

## Dispatch Flow

### User Input to Execution: Step by Step

```
User types "/compact some instructions" and presses Enter
  |
  v
[1] onSubmit callback (chunks.188.mjs:686-724)
  - Check: input starts with "/" AND not in autocompletion mode
  - Parse: split into commandName="compact", args="some instructions"
  - Lookup: find command in registered commands list (RA)
  - Check: is command "immediate" (local/local-jsx) AND from keybinding?
    - YES: execute immediately without going through message pipeline
    - NO: continue to standard pipeline
  |
  v
[2] processEvent / handleSlashInput (Mb4) (chunks.130.mjs:1506-1624)
  - Call parseSlashCommand(Db4) to extract commandName, args, isMcp
  - If parsing fails: return error message "Commands are in the form /command [args]"
  - Check if commandName is in the available commands list (Sd)
  - If not found AND looks like a valid name: return "Unknown skill: {name}"
  - If not found AND looks like a file path: treat as regular prompt
  - If found: call executeCommand(ifY)
  |
  v
[3] executeCommand (ifY) (chunks.130.mjs:1627-1795)
  - Resolve command object via findCommand(zI)
  - Check userInvocable flag: some skills are model-only
  - Switch on command.type:
    |
    +-- "local-jsx": call command.load(), render JSX component
    |   - Component gets onDone callback to signal completion
    |   - Result messages formatted as <local-command-stdout>
    |
    +-- "local": call command.load(), execute function
    |   - Handle special return types: "compact", "microcompact", "skip", "text"
    |   - Wrap output in <local-command-stdout> message
    |
    +-- "prompt": either fork or inline
        - If context === "fork": call handleForkedCommand(cfY)
          - Spawns a separate agent loop with streaming progress
        - Else: call handlePromptCommand(Wb4)
          - Builds metadata + prompt messages for LLM
          - Returns messages array with shouldQuery: true
```

### Immediate vs Deferred Execution

**What it does:** The REPL has two paths for slash command execution -- "immediate" execution for simple commands, and "deferred" execution that goes through the full message pipeline.

**How it works:**
1. In the `onSubmit` handler, after parsing the slash command, the system checks `command.immediate || options.fromKeybinding`
2. If immediate AND the command type is `local-jsx`:
   - Execute the command directly from the REPL without adding messages to the conversation
   - The command's JSX is rendered immediately
   - The result is shown as a toast notification if the display mode is not "skip"
3. Otherwise:
   - The input goes through the normal message pipeline
   - Messages are created via `handleSlashInput` (Mb4)
   - The conversation history records the command invocation

**Why this approach:** Immediate execution avoids polluting the conversation history with commands that are purely interactive (like `/help` or `/config`). When a user presses a keybinding that triggers `/fast`, they don't want that to appear as a conversation turn -- they want instant feedback. The deferred path is used for commands like `/init` or `/review` that need the LLM to process their results.

**Key insight:** The `immediate` flag on command definitions and the `fromKeybinding` flag on invocation options work together to determine the execution path. This dual-check ensures that even non-immediate commands can be executed immediately when triggered by a keybinding, providing a seamless UX for keyboard-driven workflows.

---

## Skill-Based Slash Commands

### How Skills Become Slash Commands

Skills are markdown files (SKILL.md) placed in `.claude/skills/` directories (project-local or user-global). When the command registry is built:

1. `ukA(toolUseContext)` scans `{cwd}/.claude/skills/` and `~/.claude/skills/` for SKILL.md files
2. Each SKILL.md is parsed into a command definition of type `"prompt"`
3. The skill's directory name becomes the command name (e.g., `.claude/skills/commit/SKILL.md` becomes `/commit`)
4. Skills can specify `whenToUse`, `description`, `disableModelInvocation`, and other metadata

### Skill Commands vs Built-in Commands

| Aspect | Built-in Commands | Skill Commands |
|--------|------------------|----------------|
| Source | Hardcoded in binary | `.claude/skills/` directories, plugins |
| Type | local, local-jsx, or prompt | Always prompt (generates LLM messages) |
| Priority | Always available | Can shadow non-essential built-ins |
| Removal | Cannot be removed | Removed by deleting the SKILL.md |
| Model access | Varies by type | Always has model access (unless `disableModelInvocation`) |
| Lazy loading | `load()` returns module | `getPromptForCommand()` returns messages |

### The Skill Tool Connection

The Skill tool (`d0A` description in chunks.88.mjs) is the mechanism by which the LLM can invoke slash commands. When the model recognizes that a user's request matches a skill, it calls the Skill tool with `skill: "name"` and optional `args`. This triggers the same `executeCommand` (ifY) flow as a user typing `/name`.

The connection works through two filtered views of the command registry:

1. **`getSkillToolCommands` (hv)**: Returns commands eligible for the Skill tool. Filters to: `type === "prompt"`, not `disableModelInvocation`, `source !== "builtin"`, and loaded from `bundled`, `commands_DEPRECATED`, or has `whenToUse`/`hasUserSpecifiedDescription`.

2. **`getSlashCommandSkills` (aO6)**: Returns commands eligible for the slash command picker UI. Filters to: `type === "prompt"`, `source !== "builtin"`, has description, and loaded from `skills`, `plugin`, `bundled`, or `disableModelInvocation`.

The important distinction: built-in CLI commands (`/help`, `/clear`, etc.) are explicitly excluded from the Skill tool. The Skill tool description even states: "Do not use this tool for built-in CLI commands (like /help, /clear, etc.)". This prevents the model from trying to invoke commands that require interactive UI rendering.

### The handleForkedCommand Flow

**What it does:** For commands with `context: "fork"`, a separate agent loop is spawned to handle the command. This allows long-running skill commands (like code review) to show streaming progress.

**How it works:**
1. Load the skill content and build prompt messages via `mM6`
2. Create a progress rendering function that updates the JSX display
3. Iterate over the agent loop's output stream (`dR` generator)
4. For each stream event, update the progress display
5. When complete, return the final messages

**Why this approach:** Forked execution prevents long-running skills from blocking the main conversation. The streaming progress display keeps the user informed about what's happening. This is particularly important for commands like `/review` that may take several seconds to complete.

---

## Command Name Resolution

### isCommandAvailable (Sd) and findCommand (zI)

**What they do:** Check whether a command name exists and retrieve the full command definition, supporting both canonical names and aliases.

```javascript
// ============================================
// isCommandAvailable - Check if command name matches any registered command
// Location: chunks.168.mjs:2151-2153
// ============================================

// ORIGINAL (for source lookup):
function Sd(A, q) {
    return q.some((K) => K.name === A || K.userFacingName() === A || K.aliases?.includes(A))
}

// READABLE (for understanding):
function isCommandAvailable(commandName, commands) {
    return commands.some(cmd =>
        cmd.name === commandName ||
        cmd.userFacingName() === commandName ||
        cmd.aliases?.includes(commandName)
    );
}

// Mapping: Sd->isCommandAvailable, A->commandName, q->commands, K->cmd
```

**Key insight:** There are three ways a command can match: by its internal `name` property, by its `userFacingName()` method (which may differ from `name`), or by any of its `aliases`. This three-way matching allows commands like `/clear` to also be invoked as `/reset` or `/new` (its aliases), and for commands whose internal name differs from their display name.

The `findCommand` (zI) function uses the same matching logic but throws a `ReferenceError` with a helpful message listing all available commands if no match is found. This provides good error feedback when a user mistypes a command name.
