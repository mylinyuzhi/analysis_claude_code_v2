# Slash Command System

## Overview

The slash command system is the primary mechanism through which users invoke discrete operations in Claude Code's REPL. When a user types a `/`-prefixed string (e.g., `/help`, `/compact`, `/review 42`), the system parses the input, resolves the command against a unified registry of built-in and skill-based commands, and dispatches it to the appropriate handler based on command type (`local`, `local-jsx`, or `prompt`).

The registry merges three sources of commands into a single list: built-in commands hardcoded in the binary, skill-directory commands loaded from `.claude/skills/` directories, and plugin/bundled skills from the marketplace. This design allows the slash command namespace to be extensible — any `.md` file placed in a skills directory automatically becomes a new slash command — while preserving a protected set of built-in commands that always take priority.

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
- `filterCommandSuggestions` (PgA) - Fuzzy-match filter for "/" autocomplete picker
- `useCommandSuggestions` (WGq) - React hook orchestrating all autocomplete suggestion types
- `handleSubmitCommand` (PE6) - REPL submit handler: immediate slash vs. deferred pipeline
- `findInlineSlashToken` (pv6) - Detects `/cmd` typed mid-sentence for ghost text
- `getInlineGhostSuffix` (MgA) - Returns ghost text completion for inline slash tokens
- `acceptCommandSuggestion` (WgA) - Writes `/{name} ` into input on Tab press
- `isSlashInput` (NF) - `A.startsWith("/")` gate
- `isInArgsMode` (QDz) - Detects non-trailing space = in args mode, suppresses picker

---

## Built-In Command Registry (v2.1.76)

The following commands are registered as built-in commands in v2.1.76, via `getBuiltinCommands` (QBA). This expands the v2.1.38 set with several new additions.

### New Commands in v2.1.76

| Command | Type | Description |
|---------|------|-------------|
| `/color` | `local-jsx` | Toggle ANSI color output on/off |
| `/effort` | `local-jsx` | Set thinking effort level (low/medium/high) |
| `/loop` | `local-jsx` | Create a recurring scheduled execution (see [loop_command.md](./loop_command.md)) |
| `/copy` | `local` | Copy last assistant response to clipboard |
| `/context` | `local-jsx` | Show context window usage with actionable suggestions |
| `/reload-plugins` | `local` | Reload all installed plugins without restarting |

### Complete Built-In Command Reference

The full set of built-in commands in v2.1.76:

| Command | Type | Purpose |
|---------|------|---------|
| `/help` | `local-jsx` | Show command help and keybindings |
| `/clear` | `local` | Clear conversation history |
| `/compact` | `local-jsx` | Compact conversation with summary |
| `/resume` | `local-jsx` | Resume a previous session |
| `/rename` | `local` | Rename the current session |
| `/review` | `prompt` | Code review via gh CLI |
| `/pr-comments` | `prompt` | Fetch and analyze PR comments |
| `/security-review` | `prompt` | Security-focused code review |
| `/statusline` | `prompt` | Configure custom status line |
| `/vim` | `local-jsx` | Toggle vim keybinding mode |
| `/fast` | `local-jsx` | Toggle fast mode (lower effort) |
| `/effort` | `local-jsx` | Set effort level (low/medium/high) — **v2.1.76** |
| `/color` | `local-jsx` | Toggle color output — **v2.1.76** |
| `/loop` | `local-jsx` | Create recurring task — **v2.1.76** |
| `/copy` | `local` | Copy last response to clipboard — **v2.1.76** |
| `/context` | `local-jsx` | Context usage with suggestions — **v2.1.76** |
| `/reload-plugins` | `local` | Reload plugins without restart — **v2.1.76** |
| `/add-dir` | `local` | Add a directory to context |
| `/bug` | `prompt` | Open a bug report |
| `/init` | `local-jsx` | Initialize CLAUDE.md for a project |
| `/logout` | `local-jsx` | Log out of current account |
| `/login` | `local-jsx` | Log in or switch accounts |

### /context Command — Actionable Suggestions (v2.1.76)

The `/context` command in v2.1.76 shows not just raw token counts but actionable suggestions based on usage patterns:

- If conversation is >80% full: suggests running `/compact`
- If many large files have been read: suggests using line-range read
- If tool outputs are large: suggests enabling output truncation
- Shows breakdown: system prompt tokens, conversation tokens, tool result tokens

This replaces the static display from earlier versions with an interactive panel that guides the user toward context management actions.

### /reload-plugins Command (v2.1.76)

**What it does:** Re-scans and re-loads all marketplace plugins and skill directories without requiring a Claude Code restart.

**How it works:**
1. Invalidates the memoized `getAllCommands` (cZ) cache
2. Re-runs `getSkills` (_9z) to pick up new/changed skills
3. Re-runs `loadPluginSkills` (B0A) to pick up new/changed plugins
4. Updates the REPL command registry
5. Shows confirmation with count of loaded commands

**Why this is useful:** During plugin development, users can install a new plugin and immediately test it without restarting. In v2.1.38, this required a full restart.

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

// Mapping: Db4→parseSlashCommand, A→input, q→trimmed, Y→tokens, z→commandName, w→isMcp, H→argsStartIndex, $→args
```

**Why this approach:**
- The MCP special-case (`(MCP)` as a second token) allows MCP server commands to be namespaced without conflicting with regular commands.
- Returning `null` for empty input or non-`/` input allows callers to cleanly branch between slash command handling and regular prompt submission.

**Key insight:** The parser is intentionally simple — it does not validate the command name or check if it exists. Validation happens downstream in `handleSlashInput`, which allows the parser to be a pure string operation with no side effects or async dependencies.

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
6. If user-defined commands exist, splice them before the first built-in command in the list

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

// Mapping: cZ→getAllCommands, KA→memoized, _9z→getSkills, YK1→loadMcpCommands, O9z→loadExternalCommands, iF4→getUserDefinedCommands, QBA→getBuiltinCommands
```

**Why this approach:**
- **Memoization via `KA`**: Loading skills from disk is expensive. Memoizing ensures this cost is paid once per session rather than on every command invocation.
- **Priority ordering**: Skills and plugins appear before built-ins. If a user has a skill named `commit`, it will be found first by `findCommand`.
- **User-defined command insertion**: Spliced before built-ins but after skills, giving discoverability without overriding either.

**Key insight:** The command namespace has implicit priority: bundled skills > skill-dir commands > MCP commands > plugin skills > external commands > user-defined > built-in commands. But built-in commands are always present because the REPL separately checks `pBA`.

---

## Command Execution Pipeline

### handleSlashInput (Mb4) — Top-Level Dispatcher

**What it does:** The entry point for all slash command processing. Parses the input, validates the command exists, sets loading state, and dispatches to `executeCommand`.

**How it works:**
1. `parseSlashCommand(input)` → `{ commandName, args, isMcp }`
2. `isCommandAvailable(commandName, commands)` → guards against unknown commands
3. `setLoading(true)` → triggers spinner in REPL UI
4. `trackUISection("slash-commands")` → telemetry
5. `executeCommand(commandName, args, setJSX, toolUseContext, ...)` → dispatch

### executeCommand (ifY) — Type Router

**What it does:** Routes execution based on command `type` field.

**How it works:**
- `type === "local"` → runs synchronously, wraps output in XML tags
- `type === "local-jsx"` → runs interactive React component via `setJSXOutput`
- `type === "prompt"` → calls `handlePromptCommand` (Wb4) or `handleForkedCommand` (cfY) based on `context` field

### Command Types

| `type` | Execution | Example Commands |
|--------|-----------|-----------------|
| `local` | Sync shell function, output returned as text | `/rename`, `/copy`, `/reload-plugins` |
| `local-jsx` | React component rendered in terminal | `/resume`, `/effort`, `/vim`, `/loop` |
| `prompt` | Prompt injected into LLM conversation | `/review`, `/security-review` |

### Fork vs. Inline for Prompt Commands

For `prompt`-type commands, the `context` field on the command definition determines execution path:

- **No `context` (inline)**: `handlePromptCommand` (Wb4) — runs in main agent loop
- **`context: "fork"`**: `handleForkedCommand` (cfY) — spawns dedicated sub-agent with isolated state

The forked path shows a streaming progress display and isolates the command execution from the main conversation context.

---

## Autocomplete System

### useCommandSuggestions (WGq)

**What it does:** A React hook that orchestrates all types of input suggestions — slash command completions, `@`-mention file completions, and inline ghost text — into a unified suggestion state.

**How it works:**
1. Watches the current input value
2. If input starts with `/`: calls `filterCommandSuggestions` (PgA) → fuzzy-match against command registry
3. If input starts with `@`: calls file suggestion system
4. If input contains `/cmd` mid-sentence: calls `findInlineSlashToken` (pv6) → `getInlineGhostSuffix` (MgA)

### filterCommandSuggestions (PgA)

**What it does:** Fuzzy-matches the partial command name against all available commands and returns a ranked list.

**Algorithm:**
1. Extract partial name from input (after `/`)
2. Score each command: exact prefix match → highest; fuzzy contains match → lower
3. Filter to commands where `isEnabled()` and not `isHidden`
4. Sort by score, then by `getDecayedSkillScore` (bM6) for tiebreaking
5. Return top N suggestions

**Decay scoring:** Skills that were recently used score higher. The decay formula weights recent usage more heavily than old usage, so frequently-used commands appear at the top of the picker.
