# Slash Command System

## Overview

The slash command system is the primary mechanism through which users invoke discrete operations in Claude Code's REPL. When a user types a `/`-prefixed string (e.g., `/help`, `/compact`, `/review 42`), the system parses the input, resolves the command against a unified registry of built-in and skill-based commands, and dispatches it to the appropriate handler based on command type (`local`, `local-jsx`, or `prompt`).

The registry merges three sources of commands into a single list: built-in commands hardcoded in the binary, skill-directory commands loaded from `.claude/skills/` directories, and plugin/bundled skills from the marketplace. This design allows the slash command namespace to be extensible -- any `.md` file placed in a skills directory automatically becomes a new slash command -- while preserving a protected set of built-in commands that always take priority.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Skills, CLI)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Slash Commands, UI Components)

> Deep unified analysis: [../10_skill_system/overview.md](../10_skill_system/overview.md) — Slash commands and the skill system are the same unified abstraction.

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
- `buildSkillMetadata` (nfY) - Selects the correct metadata format based on skill type
- `buildUserFacingMetadata` (jb4) - Metadata format for user-invocable commands
- `buildForkedSkillMetadata` (evA) - Metadata format for model-invocable forked skills
- `handlePromptCommand` (Wb4) - Executes prompt-type commands by building LLM messages
- `handleForkedCommand` (cfY) - Executes fork-context prompt commands with streaming progress
- `handlePromptCommandFromTool` (Pb4) - Internal entry point for model-initiated skill invocations
- `trackSkillUsage` (xM6) - Records skill invocation in app state for usage scoring
- `getDecayedSkillScore` (bM6) - Time-decayed popularity score for skill ranking
- `isValidCommandName` (lfY) - Validates that a command name uses only safe characters
- `formatCommandDescription` (jZ1) - Formats command description with source annotation
- `setupForkedCommandContext` (mM6) - Prepares agent/state for forked skill execution
- `extractForkedCommandResult` (FM6) - Extracts final text from forked agent output
- `filterCommandSuggestions` (PgA) - Fuzzy-match filter for "/" autocomplete picker (chunks.182.mjs)
- `useCommandSuggestions` (WGq) - React hook orchestrating all autocomplete suggestion types (chunks.183.mjs)
- `handleSubmitCommand` (PE6) - REPL submit handler: immediate slash vs. deferred pipeline (chunks.185.mjs)
- `findInlineSlashToken` (pv6) - Detects `/cmd` typed mid-sentence for ghost text (chunks.182.mjs)
- `getInlineGhostSuffix` (MgA) - Returns ghost text completion for inline slash tokens (chunks.182.mjs)
- `acceptCommandSuggestion` (WgA) - Writes `/{name} ` into input on Tab press (chunks.182.mjs)
- `isSlashInput` (NF) - `A.startsWith("/")` gate (chunks.182.mjs)
- `isInArgsMode` (QDz) - Detects non-trailing space = in args mode, suppresses picker (chunks.182.mjs)

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
2. Call `loadMcpCommands()` and `loadExternalCommands()` concurrently
3. Call `getUserDefinedCommands()` to get user-defined commands (from settings/config)
4. Merge all sources: `[...bundledSkills, ...skillDirCommands, ...mcpCommands, ...pluginSkills, ...externalCommands, ...getBuiltinCommands()]`
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
1. Call `loadSkills(toolUseContext)` (`ukA`) to scan `.claude/skills/` directories for SKILL.md files
2. Call `loadPluginSkills()` (`B0A`) to load plugin-based skills from installed marketplace plugins
3. Call `getBundledSkills()` (`nHq`) to get the hardcoded bundled skills (shipped with the binary)
4. Each skill source is wrapped in `.catch()` so failure in one source does not block others
5. Return all three arrays as a named object: `{ skillDirCommands, pluginSkills, bundledSkills }`

```javascript
// ============================================
// getSkills - Parallel skill loading with error isolation
// Location: chunks.168.mjs:2118-2136
// ============================================

// ORIGINAL (for source lookup):
async function _9z(A) {
    try {
        let [q, K] = await Promise.all([ukA(A).catch((z) => {
            return K1(z instanceof Error ? z : Error("Failed to load skill directory commands")), h("Skill directory commands failed to load, continuing without them"), []
        }), B0A().catch((z) => {
            return K1(z instanceof Error ? z : Error("Failed to load plugin skills")), h("Plugin skills failed to load, continuing without them"), []
        })]), Y = nHq();
        return h(`getSkills returning: ${q.length} skill dir commands, ${K.length} plugin skills, ${Y.length} bundled skills`), {
            skillDirCommands: q, pluginSkills: K, bundledSkills: Y
        }
    } catch (q) {
        return K1(q instanceof Error ? q : Error("Unexpected error loading skills")), {
            skillDirCommands: [], pluginSkills: [], bundledSkills: []
        }
    }
}

// READABLE (for understanding):
async function getSkills(toolUseContext) {
    try {
        let [skillDirCommands, pluginSkills] = await Promise.all([
            loadSkills(toolUseContext).catch(err => { logError(err); return []; }),
            loadPluginSkills().catch(err => { logError(err); return []; })
        ]);
        let bundledSkills = getBundledSkills();
        return { skillDirCommands, pluginSkills, bundledSkills }
    } catch (err) {
        logError(err);
        return { skillDirCommands: [], pluginSkills: [], bundledSkills: [] }
    }
}

// Mapping: _9z->getSkills, ukA->loadSkills, B0A->loadPluginSkills, nHq->getBundledSkills, K1->logError
```

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
- `/statusline` - Set up custom status line UI (prompt type; launches `statusline-setup` subagent) — see [statusline.md](./statusline.md)
- `/theme` - Change UI theme
- `/upgrade` - Upgrade Claude Code

### Command Type Semantics

**`local` type:**
- Executes synchronously in the CLI process
- Returns one of four result types: `"skip"`, `"compact"`, `"microcompact"`, or `"text"` (default)
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
- Examples: `/init`, `/review`, `/statusline` (delegates to `statusline-setup` subagent via Task tool)

### formatCommandDescription (jZ1)

**What it does:** Adds a source-identifying suffix/prefix to a command's description for display in the command picker.

```javascript
// ============================================
// formatCommandDescription - Annotate description with source
// Location: chunks.168.mjs:2161-2170
// ============================================

// ORIGINAL (for source lookup):
function jZ1(A) {
    if (A.type !== "prompt") return A.description;
    if (A.source === "plugin") {
        let q = A.pluginInfo?.pluginManifest.name;
        if (q) return `(${q}) ${A.description}`;
        return `${A.description} (plugin)`
    }
    if (A.source === "builtin" || A.source === "mcp") return A.description;
    if (A.source === "bundled") return `${A.description} (bundled)`;
    return `${A.description} (${vi(A.source)})`
}

// READABLE (for understanding):
function formatCommandDescription(command) {
    if (command.type !== "prompt") return command.description;
    if (command.source === "plugin") {
        let pluginName = command.pluginInfo?.pluginManifest.name;
        if (pluginName) return `(${pluginName}) ${command.description}`;
        return `${command.description} (plugin)`;
    }
    if (command.source === "builtin" || command.source === "mcp") return command.description;
    if (command.source === "bundled") return `${command.description} (bundled)`;
    return `${command.description} (${toTitleCase(command.source)})`;
}

// Mapping: jZ1->formatCommandDescription, A->command, vi->toTitleCase
```

**Key insight:** The source annotation system lets users understand in the command picker where each command comes from. Plugin commands get priority treatment (shown as "(PluginName) description"), while bundled skills get a "(bundled)" suffix. Built-in and MCP commands show raw descriptions with no suffix because their source is implicit from context.

---

## Dispatch Flow

### handleSlashInput (Mb4) - Top-Level Dispatcher

**What it does:** The main entry point that processes user slash command input, resolving it to either an error message, a regular prompt, or a command execution.

**How it works (complete flow):**

```javascript
// ============================================
// handleSlashInput - Main slash command dispatch
// Location: chunks.130.mjs:1506-1624
// ============================================

// ORIGINAL (for source lookup):
async function Mb4(A, q, K, Y, z, w, H, $, O, _) {
    let J = Db4(A);
    if (!J) {
        c("tengu_input_slash_missing", {});
        let m = "Commands are in the form `/command [args]`";
        return { messages: [wP(), ...Y, c6({ content: pZ({ inputString: m, precedingInputBlocks: q }) })], shouldQuery: !1, resultText: m }
    }
    let { commandName: X, args: D, isMcp: j } = J,
        M = j ? "mcp" : !Cd().has(X) ? "custom" : X;
    if (!Sd(X, z.options.commands)) {
        let m = b1().existsSync(`/${X}`);
        if (lfY(X) && !m) {
            c("tengu_input_slash_invalid", { input: X });
            let b = `Unknown skill: ${X}`;
            return { messages: [wP(), ...Y, c6({ content: pZ({ inputString: b, precedingInputBlocks: q }) })], shouldQuery: !1, resultText: b }
        }
        return c("tengu_input_prompt", {}), ...{ messages: [c6({ content: pZ({ inputString: A, precedingInputBlocks: q }), uuid: $ }), ...Y], shouldQuery: !0 }
    }
    w(!0), u8("slash-commands");
    let { messages: P, shouldQuery: W, ... } = await ifY(X, D, H, z, q, K, O, _);
    // ... telemetry & return
}

// READABLE (for understanding):
async function handleSlashInput(
    rawInput, precedingBlocks, setJSX, existingMessages, toolUseContext,
    setLoading, commandOptions, inputUUID, canUseTool, thinkingConfig
) {
    // 1. Parse the slash command
    let parsed = parseSlashCommand(rawInput);
    if (!parsed) {
        telemetry("tengu_input_slash_missing", {});
        let errorMsg = "Commands are in the form `/command [args]`";
        return { messages: [systemMessage(), ...existingMessages, userMessage(errorMsg)], shouldQuery: false, resultText: errorMsg };
    }

    let { commandName, args, isMcp } = parsed;
    // Track command category for telemetry
    let telemetryInput = isMcp ? "mcp" : !builtinCommandNames().has(commandName) ? "custom" : commandName;

    // 2. Check if command exists
    if (!isCommandAvailable(commandName, toolUseContext.options.commands)) {
        // Check if the "command name" is actually a filesystem path (e.g., /usr/bin/foo)
        let isActualFilePath = fs.existsSync(`/${commandName}`);

        if (isValidCommandName(commandName) && !isActualFilePath) {
            // Looks like a command name but isn't registered → error
            telemetry("tengu_input_slash_invalid", { input: commandName });
            let errorMsg = `Unknown skill: ${commandName}`;
            return { messages: [...], shouldQuery: false, resultText: errorMsg };
        }

        // Looks like a file path or has invalid chars → treat as regular prompt
        telemetry("tengu_input_prompt", {});
        return { messages: [userMessage(rawInput, inputUUID), ...existingMessages], shouldQuery: true };
    }

    // 3. Execute the command
    setLoading(true);
    trackUISection("slash-commands");
    let result = await executeCommand(commandName, args, setJSX, toolUseContext, ...);

    // 4. Emit telemetry with plugin info if applicable
    if (result.command.type === "prompt" && result.command.pluginInfo) {
        let { pluginManifest, repository } = result.command.pluginInfo;
        // Only record official repository data, third-party repos get "third-party" label
        telemetry("tengu_input_command", { input: telemetryInput, plugin_repository: ..., plugin_name: ... });
    }

    return { messages: result.messages, shouldQuery: result.shouldQuery, ... };
}

// Mapping: Mb4->handleSlashInput, Db4->parseSlashCommand, Sd->isCommandAvailable, lfY->isValidCommandName, ifY->executeCommand, b1->fs, c->telemetry, u8->trackUISection
```

**Key decisions:**

1. **File path detection:** The check `b1().existsSync('/' + commandName)` handles the case where a user types something like `/usr/bin/python` -- this starts with `/` and looks like a slash command, but is actually a file path. Without this check, it would be incorrectly classified as an "unknown skill" error.

2. **`isValidCommandName` filter:** The `lfY(X)` check (`/[^a-zA-Z0-9:\-_]/.test(A)` inverted) ensures that inputs with special characters (like spaces, dots, slashes) are treated as regular prompts. This allows partial URL paths like `/api/v1/users` to fall through as prompts.

3. **Telemetry privacy:** Plugin repository tracking only emits the full repository URL for official/known repositories (tracked in `NT` Set). Third-party plugins are anonymized as `"third-party"`.

### isValidCommandName (lfY)

**What it does:** Tests whether a string is a valid slash command name (vs. a file path or arbitrary text).

```javascript
// ============================================
// isValidCommandName - Test for safe command name characters
// Location: chunks.130.mjs:1502-1504
// ============================================

// ORIGINAL (for source lookup):
function lfY(A) {
    return !/[^a-zA-Z0-9:\-_]/.test(A)
}

// READABLE (for understanding):
function isValidCommandName(name) {
    return !/[^a-zA-Z0-9:\-_]/.test(name)
    // Equivalent: only letters, digits, colon, hyphen, underscore are allowed
}

// Mapping: lfY->isValidCommandName, A->name
```

**Why this approach:** The colon `:` in the allowed set is intentional -- it supports namespaced skill names (e.g., `namespace:skill-name`) for plugin-scoped skills that live in subdirectories. The hyphen `-` and underscore `_` support conventional kebab-case and snake_case naming.

**Key insight:** This function is the gateway between "unknown slash command" errors and "treat as regular prompt" fallback. If a user types `/hello world` (space in name) or `/usr/local/bin` (slashes in name), the invalid characters cause the input to be treated as a regular prompt, not a command error. Only clean identifiers like `/foo` or `/my-skill` produce error messages.

---

## Command Execution

### executeCommand (ifY) - The Core Switch

**What it does:** Resolves a command by name, checks invocability, and dispatches to the correct handler based on command type.

```javascript
// ============================================
// executeCommand - Type-based command dispatcher
// Location: chunks.130.mjs:1627-1795
// ============================================

// ORIGINAL (for source lookup):
async function ifY(A, q, K, Y, z, w, H, $) {
    let O = zI(A, Y.options.commands);
    if (O.type === "prompt" && O.userInvocable !== !1) xM6(A);
    if (O.userInvocable === !1) return {
        messages: [c6({ content: pZ({ inputString: `/${A}`, precedingInputBlocks: z }) }),
                   c6({ content: `This skill can only be invoked by Claude, not directly by users. Ask Claude to use the "${A}" skill for you.` })],
        shouldQuery: !1, command: O
    };
    try {
        switch (O.type) {
            case "local-jsx": return new Promise(...);
            case "local": { ... }
            case "prompt":
                try {
                    if (O.context === "fork") return await cfY(O, q, Y, z, K, $ ?? uX);
                    return await Wb4(O, q, Y, z, w)
                } catch (_) { ... }
        }
    } catch (_) { ... }
}

// READABLE (for understanding):
async function executeCommand(commandName, args, setJSX, toolUseContext, precedingBlocks, messageHistory, inputUUID, canUseTool) {
    let command = findCommand(commandName, toolUseContext.options.commands);

    // Track usage only for user-invocable prompt commands
    if (command.type === "prompt" && command.userInvocable !== false) {
        trackSkillUsage(commandName);  // xM6: increments usage count + timestamp
    }

    // Block user from invoking model-only skills
    if (command.userInvocable === false) {
        return {
            messages: [userMessage(`/${commandName}`), assistantMessage(`This skill can only be invoked by Claude...`)],
            shouldQuery: false,
            command
        };
    }

    switch (command.type) {
        case "local-jsx":
            // JSX commands return a Promise that resolves when onDone() is called
            return new Promise(resolve => {
                let onDone = (text, options) => {
                    if (options?.display === "skip") {
                        resolve({ messages: [], shouldQuery: false, command, nextInput: options.nextInput });
                        return;
                    }
                    let metaMessages = (options?.metaMessages ?? []).map(m => systemMessage(m, { isMeta: true }));
                    resolve({
                        messages: options?.display === "system"
                            ? [systemMessage(formatCommandName(command, args)), systemMessage(`<local-command-stdout>${text}</local-command-stdout>`), ...metaMessages]
                            : [userMessage(formatCommandName(command, args)), text ? userMessage(`<local-command-stdout>${text}</local-command-stdout>`) : userMessage(`<local-command-stdout>[Done]</local-command-stdout>`), ...metaMessages],
                        shouldQuery: options?.shouldQuery ?? false,
                        command,
                        nextInput: options?.nextInput,
                        submitNextInput: options?.submitNextInput
                    });
                };
                // Load and render the JSX component
                command.load().then(impl => impl.call(onDone, toolUseContext, args)).then(jsx => {
                    if (toolUseContext.options.isNonInteractiveSession) {
                        resolve({ messages: [], shouldQuery: false, command });
                        return;
                    }
                    setJSX({ jsx, shouldHidePromptInput: true, showSpinner: false, isLocalJSXCommand: true });
                });
            });

        case "local": {
            let inputMsg = userMessage(formatCommandName(command, args));
            try {
                let systemMsg = systemMessage();
                let result = await (await command.load()).call(args, toolUseContext);
                if (result.type === "skip") return { messages: [], shouldQuery: false, command };
                if (result.type === "compact") {
                    // Compact: replace message history
                    let displayMsgs = [systemMsg, inputMsg, ...result.displayText
                        ? [userMessage(`<local-command-stdout>${result.displayText}</local-command-stdout>`)] : []];
                    let compactionResult = { ...result.compactionResult, messagesToKeep: [...result.compactionResult.messagesToKeep ?? [], ...displayMsgs] };
                    return { messages: buildCompactedMessages(compactionResult), shouldQuery: false, command };
                }
                if (result.type === "microcompact") {
                    let msgs = [systemMsg, inputMsg];
                    if (result.microcompactResult.compactionInfo?.boundaryMessage) msgs.push(result.microcompactResult.compactionInfo.boundaryMessage);
                    return { messages: msgs, shouldQuery: false, command };
                }
                // Default "text" result
                return { messages: [inputMsg, userMessage(`<local-command-stdout>${result.value}</local-command-stdout>`)], shouldQuery: false, command };
            } catch (err) {
                logError(err);
                return { messages: [inputMsg, userMessage(`<local-command-stderr>${String(err)}</local-command-stderr>`)], shouldQuery: false, command };
            }
        }

        case "prompt":
            try {
                if (command.context === "fork") return await handleForkedCommand(command, args, toolUseContext, precedingBlocks, setJSX, canUseTool ?? defaultCanUseTool);
                return await handlePromptCommand(command, args, toolUseContext, precedingBlocks, messageHistory);
            } catch (err) {
                if (err instanceof UserAbortError) return { messages: [userMessage(formatCommandName(command, args)), userMessage(ABORT_MESSAGE)], shouldQuery: false, command };
                return { messages: [userMessage(formatCommandName(command, args)), userMessage(`<local-command-stderr>${String(err)}</local-command-stderr>`)], shouldQuery: false, command };
            }
    }

    // ReferenceError from findCommand propagates if command.type is unrecognized
    if (err instanceof ReferenceError) return { messages: [userMessage(err.message)], shouldQuery: false, command };
    throw err;
}

// Mapping: ifY->executeCommand, zI->findCommand, xM6->trackSkillUsage, cfY->handleForkedCommand, Wb4->handlePromptCommand, VQ1->formatCommandName, dz->UserAbortError, cx->ReferenceError, qt->buildCompactedMessages
```

**Return type semantics for `local` commands:**

| Return Type | Meaning | Side Effect |
|-------------|---------|-------------|
| `{ type: "skip" }` | Command ran but no output to show | Returns empty messages array |
| `{ type: "text", value: "..." }` | Standard text output | Wraps in `<local-command-stdout>` |
| `{ type: "compact", compactionResult, displayText }` | Command triggered compaction | Replaces entire message history via `qt()` |
| `{ type: "microcompact", microcompactResult }` | Command triggered micro-compaction | Inserts boundary marker |

**Exception hierarchy:**
- `dz` (UserAbortError): User pressed Ctrl+C → return abort message
- `cx` (ReferenceError from `findCommand`): Unknown command → return error message
- Other errors: Re-thrown to propagate to outer error boundary

**Non-interactive session handling:** For `local-jsx` commands in headless/non-interactive sessions (`isNonInteractiveSession === true`), the JSX component is skipped entirely and empty messages are returned. This allows slash commands to be called programmatically without requiring a TTY.

---

## Prompt Command Execution

### handlePromptCommand (Wb4)

**What it does:** Executes a `prompt`-type slash command by building the message array that will be sent to the LLM, including hook registration, metadata injection, and permission configuration.

**How it works:**
1. Call `command.getPromptForCommand(args, toolUseContext)` to get the skill prompt text
2. If the command has hooks, register them in the current session via `registerSkillHooks`
3. Build the metadata string using `buildSkillMetadata(command, args)` (nfY)
4. Compute thinking token estimate via `JJ6()` (analyzed from skill content)
5. Build the message array:
   - Message 1: The metadata message (command name + args as XML)
   - Message 2: The skill prompt content (marked `isMeta: true` so it's hidden in compaction)
   - Messages 3+: Any thinking token allocation attachments
   - Message N: A `command_permissions` attachment with allowed tools and model override
6. Return `{ messages, shouldQuery: true, allowedTools, maxThinkingTokens, model, command }`

```javascript
// ============================================
// handlePromptCommand - Build LLM message array for prompt-type commands
// Location: chunks.130.mjs:1826-1865
// ============================================

// ORIGINAL (for source lookup):
async function Wb4(A, q, K, Y = [], z = []) {
    let w = await A.getPromptForCommand(q, K);
    if (A.hooks) {
        let j = U6();
        IM6(K.setAppState, j, A.hooks, A.name, A.type === "prompt" ? A.skillRoot : void 0)
    }
    let H = nfY(A, q);
    let $ = (H.match(/<command-message>/g) || []).length;
    let O = hd(A.allowedTools ?? []),
        _ = z.length > 0 || Y.length > 0 ? [...z, ...Y, ...w] : w,
        J = void 0,
        X = await JJ6(oP1(w.filter((j) => j.type === "text").map((j) => j.text).join(" "), K, null, [], K.messages, "repl_main_thread")),
        D = [c6({ content: H }), c6({ content: _, isMeta: !0 }), ...X, kq({ type: "command_permissions", allowedTools: O, model: A.model })];
    return { messages: D, shouldQuery: !0, allowedTools: O, maxThinkingTokens: J, model: A.model, command: A }
}

// READABLE (for understanding):
async function handlePromptCommand(command, args, toolUseContext, precedingBlocks = [], existingMessages = []) {
    // 1. Get the skill prompt content (with arg substitution already applied)
    let promptContent = await command.getPromptForCommand(args, toolUseContext);

    // 2. Register any hooks defined in the skill's frontmatter
    if (command.hooks) {
        let sessionId = getSessionId();  // U6()
        registerSkillHooks(toolUseContext.setAppState, sessionId, command.hooks, command.name, command.skillRoot);
    }

    // 3. Build XML metadata string (command name, args, source metadata)
    let metadataString = buildSkillMetadata(command, args);  // nfY

    // 4. Compute tool-whitelist from skill's allowed-tools
    let allowedTools = expandToolList(command.allowedTools ?? []);  // hd()

    // 5. Combine prompt with any preceding context
    let fullPromptContent = (existingMessages.length > 0 || precedingBlocks.length > 0)
        ? [...precedingBlocks, ...existingMessages, ...promptContent]
        : promptContent;

    // 6. Compute thinking token allocation based on prompt content
    let thinkingTokenAttachments = await computeThinkingAllocation(
        buildPromptString(promptContent.filter(p => p.type === "text").map(p => p.text).join(" "), toolUseContext, ...)
    );

    // 7. Build final message array
    let messages = [
        userMessage({ content: metadataString }),                    // Command identity
        userMessage({ content: fullPromptContent, isMeta: true }),   // Skill prompt (hidden from compaction)
        ...thinkingTokenAttachments,                                  // Thinking budget
        attachmentMessage({ type: "command_permissions", allowedTools, model: command.model })  // Permissions
    ];

    return { messages, shouldQuery: true, allowedTools, maxThinkingTokens: undefined, model: command.model, command };
}

// Mapping: Wb4->handlePromptCommand, nfY->buildSkillMetadata, U6->getSessionId, IM6->registerSkillHooks, hd->expandToolList, JJ6->computeThinkingAllocation, oP1->buildPromptString, kq->attachmentMessage
```

**Key insights:**

1. **`isMeta: true` flag**: The skill prompt content is tagged as metadata so that the compaction system does not include it in the summary. This prevents skill prompts from cluttering the summarized history. Only the command invocation metadata (name + args) is preserved across compaction boundaries.

2. **Hook registration at execution time**: Hooks defined in a skill's frontmatter are registered when the skill executes, not when it loads. This means hook behavior is scoped to a single invocation -- running `/commit` twice registers the hooks twice (or replaces them if they conflict).

3. **`command_permissions` attachment**: The allowed-tools list from the skill's frontmatter is injected as an attachment message. This restricts the LLM's tool access during skill execution to only the tools listed in `allowed-tools:` -- the main agent loop checks this attachment before allowing tool use.

4. **Thinking token computation**: `JJ6` analyzes the combined prompt text to compute an appropriate thinking budget allocation. This is important for complex skills that may generate long reasoning chains.

### buildSkillMetadata (nfY) - Three Metadata Variants

**What it does:** Selects between three different metadata string formats depending on whether the command is user-invocable and where it was loaded from.

```javascript
// ============================================
// buildSkillMetadata - Select correct metadata format for command
// Location: chunks.130.mjs:1813-1816
// ============================================

// ORIGINAL (for source lookup):
function nfY(A, q) {
    if (A.userInvocable !== !1) return jb4(A.userFacingName(), q);
    if (A.loadedFrom === "skills" || A.loadedFrom === "plugin") return evA(A.userFacingName(), A.progressMessage);
    return jb4(A.userFacingName(), q)
}

// READABLE (for understanding):
function buildSkillMetadata(command, args) {
    if (command.userInvocable !== false) {
        // User-invocable commands: show command name and args
        return buildUserFacingMetadata(command.userFacingName(), args);
    }
    if (command.loadedFrom === "skills" || command.loadedFrom === "plugin") {
        // Model-only skills from disk/plugins: use forked skill format (no args visible)
        return buildForkedSkillMetadata(command.userFacingName(), command.progressMessage);
    }
    // Fallback: use user-facing format
    return buildUserFacingMetadata(command.userFacingName(), args);
}

// Mapping: nfY->buildSkillMetadata, jb4->buildUserFacingMetadata, evA->buildForkedSkillMetadata
```

**The two metadata format functions:**

```javascript
// ============================================
// buildUserFacingMetadata - Standard command metadata
// Location: chunks.130.mjs:1808-1811
// ============================================

// ORIGINAL (for source lookup):
function jb4(A, q) {
    return [`<${pP}>${A}</${pP}>`, `<${SG}>/${A}</${SG}>`, q ? `<command-args>${q}</command-args>` : null].filter(Boolean).join("\n")
}
// Produces: <command-message>commit</command-message>\n<command-name>/commit</command-name>\n<command-args>fix auth bug</command-args>

// READABLE:
function buildUserFacingMetadata(name, args) {
    return [`<command-message>${name}</command-message>`,
            `<command-name>/${name}</command-name>`,
            args ? `<command-args>${args}</command-args>` : null].filter(Boolean).join("\n")
}

// ============================================
// buildForkedSkillMetadata - Model-only skill metadata
// Location: chunks.130.mjs:1803-1806
// ============================================

// ORIGINAL (for source lookup):
function evA(A, q = "loading") {
    return [`<${pP}>${A}</${pP}>`, `<${SG}>${A}</${SG}>`, "<skill-format>true</skill-format>"].join("\n")
}
// Produces: <command-message>verify</command-message>\n<command-name>verify</command-name>\n<skill-format>true</skill-format>

// READABLE:
function buildForkedSkillMetadata(name, progressMessage = "loading") {
    return [`<command-message>${name}</command-message>`,
            `<command-name>${name}</command-name>`,   // Note: no leading slash!
            `<skill-format>true</skill-format>`].join("\n")
}
```

**Why two formats?**
- User-invocable commands get a `/name` prefix in `<command-name>` (e.g., `<command-name>/commit</command-name>`) to signal this was user-initiated
- Model-only skills (e.g., invoked via the Skill tool) get no `/` prefix and include `<skill-format>true</skill-format>` to distinguish them in conversation history
- The `<command-message>` tag is parsed by the compaction system to preserve command invocations in summaries

### formatCommandName (VQ1)

**What it does:** Generates the XML metadata string specifically for the conversation user message when a command is invoked.

```javascript
// ============================================
// formatCommandName - Build full XML command header
// Location: chunks.130.mjs:1797-1801
// ============================================

// ORIGINAL (for source lookup):
function VQ1(A, q) {
    return `<${SG}>/${A.userFacingName()}</${SG}>
            <${pP}>${A.userFacingName()}</${pP}>
            <command-args>${q}</command-args>`
}

// READABLE (for understanding):
function formatCommandName(command, args) {
    return `<command-name>/${command.userFacingName()}</command-name>
            <command-message>${command.userFacingName()}</command-message>
            <command-args>${args}</command-args>`
}

// Mapping: VQ1->formatCommandName, SG->COMMAND_NAME_TAG, pP->COMMAND_MESSAGE_TAG
```

**Key insight:** `VQ1` is used in the `executeCommand` (ifY) flow specifically for the user-visible message in conversation history (the first message shown to the user when they invoke a command). This is distinct from `nfY` (which is used in `handlePromptCommand` for the LLM-internal metadata). Both produce similar XML but serve different roles in the message pipeline.

---

## Skill Usage Scoring

### trackSkillUsage (xM6) and getDecayedSkillScore (bM6)

**What they do:** Track how often each skill is used and compute a time-decayed popularity score for ranking skills in the command picker.

```javascript
// ============================================
// trackSkillUsage - Record skill invocation in app state
// Location: chunks.130.mjs:1383-1397
// ============================================

// ORIGINAL (for source lookup):
function xM6(A) {
    let K = f6().skillUsage?.[A],
        Y = Date.now(),
        z = (K?.usageCount ?? 0) + 1;
    if (!K || K.usageCount !== z || K.lastUsedAt !== Y) jA((w) => ({
        ...w, skillUsage: { ...w.skillUsage, [A]: { usageCount: z, lastUsedAt: Y } }
    }))
}

// READABLE (for understanding):
function trackSkillUsage(skillName) {
    let existing = getAppState().skillUsage?.[skillName];
    let now = Date.now();
    let newCount = (existing?.usageCount ?? 0) + 1;
    // Only update state if something changed (avoid unnecessary re-renders)
    if (!existing || existing.usageCount !== newCount || existing.lastUsedAt !== now) {
        setAppState(state => ({
            ...state,
            skillUsage: { ...state.skillUsage, [skillName]: { usageCount: newCount, lastUsedAt: now } }
        }));
    }
}

// Mapping: xM6->trackSkillUsage, f6->getAppState, jA->setAppState
```

```javascript
// ============================================
// getDecayedSkillScore - Time-decayed usage score for ranking
// Location: chunks.130.mjs:1399-1405
// ============================================

// ORIGINAL (for source lookup):
function bM6(A) {
    let K = f6().skillUsage?.[A];
    if (!K) return 0;
    let Y = (Date.now() - K.lastUsedAt) / 86400000,
        z = Math.pow(0.5, Y / 7);
    return K.usageCount * Math.max(z, 0.1)
}

// READABLE (for understanding):
function getDecayedSkillScore(skillName) {
    let usage = getAppState().skillUsage?.[skillName];
    if (!usage) return 0;
    let daysSinceLastUse = (Date.now() - usage.lastUsedAt) / 86400000;  // ms → days
    let decayFactor = Math.pow(0.5, daysSinceLastUse / 7);              // Half-life: 7 days
    return usage.usageCount * Math.max(decayFactor, 0.1);               // Floor at 10%
}

// Mapping: bM6->getDecayedSkillScore, f6->getAppState
```

**How the decay algorithm works:**

```
Score = usageCount × max(0.5^(daysSinceLastUse / 7), 0.1)

Example timeline:
  Day 0  (just used):   Score = usageCount × 1.0   (100%)
  Day 7  (1 week ago):  Score = usageCount × 0.5   (50%)
  Day 14 (2 weeks ago): Score = usageCount × 0.25  (25%)
  Day 30 (1 month ago): Score = usageCount × ~0.1  (10%)
  Day 60 (2 months ago):Score = usageCount × 0.1   (10%, floored)
```

**Why this design:**
- **Half-life of 7 days**: Skill relevance decays weekly. A skill used daily for a month still matters more than one used once. A skill used 6 months ago has minimal weight.
- **Floor at 0.1 (10%)**: Skills never completely disappear from ranking -- they just fade to a low baseline. This prevents the ranking from becoming completely recency-biased.
- **`usageCount` as multiplier**: Frequently-used skills maintain high scores even after some time gap. This rewards habits (e.g., if you use `/commit` every day, it stays at the top even after a few days without use).
- **Persisted in `appState.skillUsage`**: Usage data persists across sessions (written to app state which is serialized to disk), allowing long-term usage patterns to influence ranking.

---

## Model-Invoked Skill API

### handlePromptCommandFromTool (Pb4)

**What it does:** An internal entry point for when the LLM invokes a skill via the Skill tool. Validates that the command exists, is a prompt type, and delegates to `handlePromptCommand`.

```javascript
// ============================================
// handlePromptCommandFromTool - Internal API for model-initiated skills
// Location: chunks.130.mjs:1819-1824
// ============================================

// ORIGINAL (for source lookup):
async function Pb4(A, q, K, Y, z = []) {
    if (!Sd(A, K)) throw new cx(`Unknown command: ${A}`);
    let w = zI(A, K);
    if (w.type !== "prompt") throw Error(`Unexpected ${w.type} command. Expected 'prompt' command. Use /${A} directly in the main conversation.`);
    return Wb4(w, q, Y, [], z)
}

// READABLE (for understanding):
async function handlePromptCommandFromTool(commandName, args, commands, toolUseContext, existingMessages = []) {
    if (!isCommandAvailable(commandName, commands)) {
        throw new ReferenceError(`Unknown command: ${commandName}`);
    }
    let command = findCommand(commandName, commands);
    if (command.type !== "prompt") {
        throw Error(`Unexpected ${command.type} command. Expected 'prompt' command. Use /${commandName} directly in the main conversation.`);
    }
    return handlePromptCommand(command, args, toolUseContext, [], existingMessages);
}

// Mapping: Pb4->handlePromptCommandFromTool, Sd->isCommandAvailable, zI->findCommand, Wb4->handlePromptCommand, cx->ReferenceError
```

**Why this exists:** The Skill tool invocation path needs a different entry point than the user REPL path because:
1. The Skill tool only supports `prompt`-type commands (not `local` or `local-jsx`)
2. The Skill tool gets its commands list from `getSkillToolCommands(hv)`, which is a filtered subset
3. Error messages need to surface as tool errors, not as user-visible REPL messages

---

## Filtered Command Views

### getSkillToolCommands (hv) and getSlashCommandSkills (aO6)

**What they do:** Provide two filtered views of the command registry for different consumers: the Skill tool (LLM invocation) and the slash command picker UI.

```javascript
// ============================================
// getSkillToolCommands - Commands eligible for model invocation via Skill tool
// Location: chunks.168.mjs:2307-2309
// ============================================

// ORIGINAL (for source lookup):
hv = KA(async (A) => {
    return (await cZ(A)).filter((K) =>
        K.type === "prompt" &&
        !K.disableModelInvocation &&
        K.source !== "builtin" &&
        (K.loadedFrom === "bundled" || K.loadedFrom === "commands_DEPRECATED" ||
         K.hasUserSpecifiedDescription || K.whenToUse))
})

// READABLE (for understanding):
getSkillToolCommands = memoized(async (toolUseContext) => {
    return (await getAllCommands(toolUseContext)).filter(cmd =>
        cmd.type === "prompt" &&                    // Only prompt-type (not local/local-jsx)
        !cmd.disableModelInvocation &&              // Not explicitly blocked from model use
        cmd.source !== "builtin" &&                 // Not a built-in CLI command
        (cmd.loadedFrom === "bundled" ||            // Built-in bundled skills always eligible
         cmd.loadedFrom === "commands_DEPRECATED" || // Legacy .claude/commands/ skills
         cmd.hasUserSpecifiedDescription ||          // Skills with explicit description
         cmd.whenToUse)                             // Skills with whenToUse guidance
    );
});

// ============================================
// getSlashCommandSkills - Commands shown in the slash command picker UI
// Location: chunks.168.mjs:2309-2315
// ============================================

// ORIGINAL (for source lookup):
aO6 = KA(async (A) => {
    try {
        return (await cZ(A)).filter((K) =>
            K.type === "prompt" &&
            K.source !== "builtin" &&
            (K.hasUserSpecifiedDescription || K.whenToUse) &&
            (K.loadedFrom === "skills" || K.loadedFrom === "plugin" ||
             K.loadedFrom === "bundled" || K.disableModelInvocation))
    } catch (q) { return [] }
})

// READABLE (for understanding):
getSlashCommandSkills = memoized(async (toolUseContext) => {
    try {
        return (await getAllCommands(toolUseContext)).filter(cmd =>
            cmd.type === "prompt" &&                // Only prompt-type
            cmd.source !== "builtin" &&             // Not built-in CLI commands
            (cmd.hasUserSpecifiedDescription || cmd.whenToUse) &&  // Has description for display
            (cmd.loadedFrom === "skills" ||         // User-created skills
             cmd.loadedFrom === "plugin" ||         // Plugin skills
             cmd.loadedFrom === "bundled" ||        // Bundled skills
             cmd.disableModelInvocation)            // Model-blocked skills (user-only)
        );
    } catch (err) { return []; }
});
```

**Filter comparison:**

| Condition | getSkillToolCommands (hv) | getSlashCommandSkills (aO6) |
|-----------|--------------------------|------------------------------|
| type === "prompt" | ✓ | ✓ |
| source !== "builtin" | ✓ | ✓ |
| !disableModelInvocation | ✓ Required | ✗ Not required |
| hasUserSpecifiedDescription OR whenToUse | Optional | ✓ Required |
| loadedFrom filter | bundled, commands_DEPRECATED, or has description | skills, plugin, bundled, or disableModelInvocation |

**Key insights:**
- `getSkillToolCommands` is more permissive: it includes legacy commands and bundled skills regardless of whether they have descriptions. This ensures backward compatibility -- old `.claude/commands/` skills can still be invoked by the model.
- `getSlashCommandSkills` requires a description or `whenToUse` field for display in the UI picker. This prevents skills without descriptions from cluttering the autocomplete list.
- Both exclude `source === "builtin"` -- the LLM's Skill tool description explicitly says "Do not use this tool for built-in CLI commands".
- `disableModelInvocation: true` skills appear in the UI picker but NOT in the Skill tool list -- they're user-only, visible to humans in autocomplete, but blocked from LLM invocation.

---

## Forked Command Execution

### handleForkedCommand (cfY)

**What it does:** For commands with `context: "fork"`, a separate agent loop is spawned to handle the command. This allows long-running skill commands (like code review) to show streaming progress.

**How it works:**
1. Call `setupForkedCommandContext(mM6)` to get skill content, agent definition, and modified app state
2. Create a progress rendering function that updates the JSX display as messages arrive
3. Iterate over the agent loop's output stream (`dR` generator), collecting messages
4. For each assistant/user message, update the progress display with current streaming state
5. When complete, call `extractForkedCommandResult(FM6)` to get the final text
6. Return messages wrapped in `<local-command-stdout>` tags

```javascript
// ============================================
// setupForkedCommandContext - Prepare agent for forked skill execution
// Location: chunks.149.mjs:2562-2580
// ============================================

// ORIGINAL (for source lookup):
async function mM6(A, q, K) {
    let z = (await A.getPromptForCommand(q, K)).map((X) => X.type === "text" ? X.text : "").join("\n"),
        w = hd(A.allowedTools ?? []),
        H = gdY(K.getAppState, w),
        $ = A.agent ?? "general-purpose",
        O = K.options.agentDefinitions.activeAgents,
        _ = O.find((X) => X.agentType === $) ?? O.find((X) => X.agentType === "general-purpose") ?? O[0];
    if (!_) throw Error("No agent available for forked execution");
    let J = [c6({ content: z })];
    return { skillContent: z, modifiedGetAppState: H, baseAgent: _, promptMessages: J }
}

// READABLE (for understanding):
async function setupForkedCommandContext(command, args, toolUseContext) {
    // 1. Get fully-processed skill prompt text
    let skillText = (await command.getPromptForCommand(args, toolUseContext))
        .map(p => p.type === "text" ? p.text : "").join("\n");

    // 2. Expand tool whitelist and create a modified getAppState that enforces it
    let allowedTools = expandToolList(command.allowedTools ?? []);
    let restrictedGetAppState = createRestrictedAppState(toolUseContext.getAppState, allowedTools);

    // 3. Find the agent definition for this skill (default: "general-purpose")
    let agentType = command.agent ?? "general-purpose";
    let agents = toolUseContext.options.agentDefinitions.activeAgents;
    let baseAgent = agents.find(a => a.agentType === agentType)
                 ?? agents.find(a => a.agentType === "general-purpose")
                 ?? agents[0];
    if (!baseAgent) throw Error("No agent available for forked execution");

    return {
        skillContent: skillText,
        modifiedGetAppState: restrictedGetAppState,
        baseAgent,
        promptMessages: [userMessage({ content: skillText })]
    };
}

// Mapping: mM6->setupForkedCommandContext, hd->expandToolList, gdY->createRestrictedAppState, A.agent->agentType
```

**Why this approach:** Forked execution prevents long-running skills from blocking the main conversation. The streaming progress display keeps the user informed about what's happening. This is particularly important for commands like `/review` that may take several seconds to complete.

**Key difference from inline execution:**

| Aspect | Inline (`Wb4`) | Forked (`cfY`) |
|--------|----------------|----------------|
| Agent loop | Reuses main loop | Spawns dedicated sub-agent |
| Progress display | None (blocks until done) | Streaming JSX progress |
| Message history | Injected into main history | Isolated, result returned as `local-command-stdout` |
| Tool access | Restricted via attachment | Restricted via `modifiedGetAppState` |
| Telemetry | `tengu_input_command` | `tengu_slash_command_forked` |

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

```javascript
// ============================================
// findCommand - Resolve command name to definition (throws if not found)
// Location: chunks.168.mjs:2155-2158
// ============================================

// ORIGINAL (for source lookup):
function zI(A, q) {
    let K = q.find((Y) => Y.name === A || Y.userFacingName() === A || Y.aliases?.includes(A));
    if (!K) throw ReferenceError(`Command ${A} not found. Available commands: ${q.map((Y) => { let z = Y.userFacingName(); return Y.aliases ? `${z} (aliases: ${Y.aliases.join(", ")})` : z }).sort((Y, z) => Y.localeCompare(z)).join(", ")}`);
    return K
}

// READABLE (for understanding):
function findCommand(commandName, commands) {
    let command = commands.find(cmd =>
        cmd.name === commandName ||
        cmd.userFacingName() === commandName ||
        cmd.aliases?.includes(commandName)
    );
    if (!command) {
        let availableNames = commands.map(cmd => {
            let name = cmd.userFacingName();
            return cmd.aliases ? `${name} (aliases: ${cmd.aliases.join(", ")})` : name;
        }).sort((a, b) => a.localeCompare(b)).join(", ");
        throw new ReferenceError(`Command ${commandName} not found. Available commands: ${availableNames}`);
    }
    return command;
}

// Mapping: zI->findCommand, A->commandName, q->commands
```

**Key insight:** There are three ways a command can match:
1. By `name` property (canonical internal name)
2. By `userFacingName()` (display name, which can differ)
3. By any entry in `aliases` array

The `findCommand` error message includes an alphabetically sorted list of all available command names with their aliases. This provides good developer feedback when a user mistypes a command name.

---

## UI Linkage: The Slash Command Picker

### How "/" Triggers the Autocomplete Picker

When a user types `/` in the REPL input, a two-layer system handles autocomplete suggestions:

**Layer 1: Input Gate** — `isSlashInput` (NF, chunks.182.mjs:1930) checks `input.startsWith("/")`. `isInArgsMode` (QDz) detects a non-trailing space (meaning the user is now typing arguments, not the command name) and suppresses the picker.

**Layer 2: Suggestion Engine** — `filterCommandSuggestions` (PgA, chunks.182.mjs:1971) generates ranked suggestions:

```
Input "/" (empty query):
  1. Top 5 recently-used skills by decayed score (bM6)  ← frecency
  2. User settings skills (alphabetical)
  3. Project settings skills (alphabetical)
  4. Policy/managed skills (alphabetical)
  5. Built-in commands (alphabetical)

Input "/com" (partial query):
  Fuse.js fuzzy search with weighted keys:
    - commandName (weight: 3) — exact name match
    - partKey (weight: 2)     — hyphen-split name parts
    - aliasKey (weight: 2)    — aliases
    - descriptionKey (weight: 0.5) — description text
  Then re-sorted: exact > alias > prefix > fuzzy > frecency tiebreak
```

**The `disableSlashCommands` gate** (prop on `TUA` REPL component, chunks.188.mjs:22) sets `enabledCommands = []` when true, completely disabling both autocomplete and command resolution. Used in embedded/SDK contexts.

### Immediate vs. Deferred Execution

The REPL submit handler (PE6, chunks.185.mjs:3105) has two paths for slash commands:

```
User submits "/help"
         │
         ▼
PE6: Check if command.immediate === true AND type === "local-jsx"
         │
   ┌─────┴─────┐
  YES          NO
   │            │
   ▼            ▼
Execute JSX   handleSlashInput(Mb4)
immediately   (normal message pipeline:
(no chat      adds conversation turn,
 history)     goes to handlePromptCommand)
```

**Why this matters:** `/help`, `/config`, `/fast`, `/permissions` are `immediate: true`. They render JSX panels without creating a conversation turn. Non-immediate commands like `/init`, `/review`, and user skills produce visible conversation history entries.

### Inline Ghost Text (Mid-Sentence `/cmd`)

For `/command` typed **inside** a longer prompt, `findInlineSlashToken` (pv6, chunks.182.mjs:1896) detects the pattern with a lookbehind regex:

```javascript
/(?<=\s)\/([a-zA-Z0-9_:-]*)$/  // matches /command preceded by whitespace, at cursor
```

`getInlineGhostSuffix` (MgA) returns the completion suffix as ghost text (e.g., "please run /com**mit**"). Tab accepts via `acceptCommandSuggestion` (WgA) which replaces the partial token with `/${fullName} `.

### Remote Session: slash_commands in system:init

For remote sessions (SSH/server contexts), the available slash command names are transmitted in the `system:init` event (chunks.179.mjs:189):

```javascript
let skills = await getSlashCommandSkills(getCwd());   // aO6()
emit({ type: "system", subtype: "init",
       slash_commands: skills.map(cmd => cmd.name),   // array of skill names
       // ...
})
```

The remote client receives this and can display the command list in its own UI. The receiving side (chunks.185.mjs:1457) logs: `Init received with ${slash_commands.length} slash commands`.

---

## User Input to Execution: Complete Flow

```
User types "/compact some instructions" and presses Enter
  │
  ▼
[1] onSubmit callback (chunks.188.mjs:686-724)
  - Check: input starts with "/" AND not in autocompletion mode
  - Parse: split into commandName="compact", args="some instructions"
  - Lookup: find command in registered commands list (RA)
  - Check: is command "immediate" (local/local-jsx) AND from keybinding?
    - YES: execute immediately without going through message pipeline
    - NO: continue to standard pipeline
  │
  ▼
[2] handleSlashInput (Mb4) (chunks.130.mjs:1506-1624)
  - Call parseSlashCommand(Db4) to extract commandName, args, isMcp
  - If parsing fails: return error message "Commands are in the form /command [args]"
  - Check if commandName is in the available commands list (Sd)
  - If not found AND looks like a valid name: return "Unknown skill: {name}"
  - If not found AND looks like a file path: treat as regular prompt
  - If found: call executeCommand(ifY)
  │
  ▼
[3] executeCommand (ifY) (chunks.130.mjs:1627-1795)
  - Resolve command object via findCommand(zI)
  - Track usage via trackSkillUsage(xM6) if user-invocable prompt
  - Check userInvocable flag: block model-only skills
  - Switch on command.type:
    │
    +-- "local-jsx": call command.load(), render JSX component
    │   - Component gets onDone callback to signal completion
    │   - Result messages formatted as <local-command-stdout>
    │   - Skip entirely in non-interactive sessions
    │
    +-- "local": call command.load(), execute function
    │   - Handle special return types: "compact", "microcompact", "skip", "text"
    │   - Wrap output in <local-command-stdout> or <local-command-stderr>
    │
    +-- "prompt": either fork or inline
        - If context === "fork": call handleForkedCommand(cfY)
          - Spawns a separate agent loop with streaming progress
        - Else: call handlePromptCommand(Wb4)
          - Registers hooks (if any)
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

1. `loadSkills(toolUseContext)` (`ukA`) scans multiple skill directories for SKILL.md files
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

The Skill tool description is what enables the LLM to invoke slash commands. When the model recognizes that a user's request matches a skill, it calls the Skill tool with `skill: "name"` and optional `args`. This triggers the same `handlePromptCommandFromTool` (Pb4) flow.

The connection works through two filtered views of the command registry:

1. **`getSkillToolCommands` (hv)**: Returns commands eligible for the Skill tool. Filters to: `type === "prompt"`, not `disableModelInvocation`, `source !== "builtin"`, and loaded from `bundled`, `commands_DEPRECATED`, or has `whenToUse`/`hasUserSpecifiedDescription`.

2. **`getSlashCommandSkills` (aO6)**: Returns commands eligible for the slash command picker UI. Filters to: `type === "prompt"`, `source !== "builtin"`, has description, and loaded from `skills`, `plugin`, `bundled`, or `disableModelInvocation`.

The important distinction: built-in CLI commands (`/help`, `/clear`, etc.) are explicitly excluded from the Skill tool. The Skill tool description even states: "Do not use this tool for built-in CLI commands (like /help, /clear, etc.)". This prevents the model from trying to invoke commands that require interactive UI rendering.

---

## Deep Dives

### `/review` — PR Code Review via Inline LLM + Bash Tool

> Full analysis: [review.md](./review.md)

`/review` is the canonical example of the **marketplace placeholder** pattern. It uses the `bZ1()` factory that creates `prompt`-type builtin commands that:
- Run **inline in the main agent loop** (no forked context, no subagent)
- Contain a `getPromptWhileMarketplaceIsPrivate` fallback to ship functionality before the marketplace plugin is ready
- Use `${qq.name}` (= `"Bash"`) in the prompt text to tell the LLM which tool to invoke
- Have **no `allowedTools` restriction** — all tool uses go through normal permission checking

Key symbols: `NN6` (command definition), `bZ1` (factory), `HuA` (lazy init), `qq` (Bash tool)

Three commands use this pattern: `/review` (code-review plugin), `/pr-comments` (pr-comments plugin), `/security-review` (security-review plugin). The `/security-review` command is significantly more advanced: it uses YAML frontmatter with `allowed-tools:`, executes shell commands at prompt-generation time via `Ma()` (processTemplateExpressions), and instructs the LLM to spawn parallel sub-tasks via the Task tool.

---

### `/resume` and `/rename` — Session Lifecycle Management

> Full analysis: [resume_and_rename.md](./resume_and_rename.md)

`/resume` is the most complex built-in slash command. It provides:
- **Direct lookup** by session UUID or exact title (via args)
- **Interactive picker** with multi-mode state machine (list/search/rename/preview)
- **Tag-based tab navigation**, branch/worktree filter toggles, all-projects view
- **Agentic AI search** (sends session metadata to Claude LLM for semantic ranking)
- **Cross-project resume** detection (copies `cd && claude --resume` to clipboard)
- **Inline rename** via Ctrl+R inside the picker (same `saveCustomTitle` as `/rename`)

`/rename` is a `local`-type command that persists a custom title to the JSONL log via an event-sourced `{ type: "custom-title" }` append, optionally updating the terminal window title.

Key symbols: `l8z` (handler), `c8z` (interactive UI), `WN6` (picker), `Q91` (saveCustomTitle), `yAz` (rename handler)
