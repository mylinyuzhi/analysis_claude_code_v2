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
- `parseSlashCommand` (uc4) - Parses `/command args` syntax from raw input string (chunks.133.mjs:820)
- `handleSlashInput` (DvY) - Top-level dispatcher: routes parsed slash commands to execution (chunks.133.mjs:1120)
- `executeCommand` (XvY) - Switch-based executor for local/local-jsx/prompt command types (chunks.133.mjs:1247)
- `isCommandAvailable` (rY6) - Checks if a command name matches any registered command (chunks.168.mjs:1854)
- `findCommand` (kf6) - Resolves a command name to its definition object (with alias support) (chunks.168.mjs:1858)
- `getAllSkills` (I0) - Memoized loader that merges all command sources into a unified list (chunks.168.mjs:2013)
- `getBuiltinCommands` (Ci8) - Returns the hardcoded array of all built-in command definitions (chunks.168.mjs:2012)
- `getSkills` (_9z) - Loads skill-dir, plugin, and bundled skill commands in parallel (chunks.171.mjs:799)
- `getSlashCommandSkills` (vp6) - Filters commands eligible for the slash command picker UI (chunks.168.mjs:2031)
- `buildSkillMetadata` (nfY) - Selects the correct metadata format based on skill type (chunks.131.mjs:1813)
- `trackSkillUsage` (ON1) - Records skill invocation in session state for usage scoring (chunks.133.mjs:884)
- `computeSkillScore` (ux8) - Time-decayed popularity score for skill ranking, 7-day half-life (chunks.133.mjs:900)
- `isValidCommandName` (sc4) - Validates that a command name uses only safe characters (chunks.133.mjs:1116)
- `buildUserPrompt` (PvY) - Builds user-facing prompt display based on invocability (chunks.133.mjs:1420)
- `formatCommandInvocation` (xc6) - Formats `/name args` string for display (chunks.133.mjs:1406)
- `buildForkedCommandConfig` (DN1) - Prepares isolated execution context for forked commands (chunks.148.mjs:1951)
- `extractResultFromEvents` (XN1) - Extracts result text from forked command events (chunks.148.mjs:1971)
- `filterAllowedTools` (Kh) - Filters tool whitelist for skill execution (chunks.173.mjs:509)
- `getAgentContext` (Tf6) - Gets current agent context store (chunks.133.mjs:837)
- `filterCommandSuggestions` (PgA) - Fuzzy-match filter for "/" autocomplete picker

---

## Built-In Command Registry (v2.1.76)

The following commands are registered as built-in commands in v2.1.76, via `getBuiltinCommands` (QBA). This expands the v2.1.38 set with several new additions.

### New Commands in v2.1.76

| Command | Type | Description | Documentation |
|---------|------|-------------|---------------|
| `/color` | `local-jsx` | Set session prompt bar color | [mode_commands.md](./mode_commands.md) |
| `/effort` | `local-jsx` | Set thinking effort level | [effort_command.md](./effort_command.md) |
| `/loop` | `local-jsx` | Create a recurring scheduled execution | [loop_command.md](./loop_command.md) |
| `/copy` | `local-jsx` | Copy last assistant response to clipboard | [utility_commands.md](./utility_commands.md) |
| `/context` | `local-jsx` | Show context window usage visualization | [utility_commands.md](./utility_commands.md) |
| `/reload-plugins` | `local` | Reload all installed plugins | [utility_commands.md](./utility_commands.md) |

### Complete Built-In Command Reference

The full set of built-in commands in v2.1.76, organized by category:

#### Session Management Commands

| Command | Type | Purpose | Documentation |
|---------|------|---------|---------------|
| `/help` | `local-jsx` | Show command help and keybindings | [help_command.md](./help_command.md) |
| `/clear` | `local` | Clear conversation history | [clear_command.md](./clear_command.md) |
| `/compact` | `local` | Compact conversation with summary | [clear_command.md](./clear_command.md) |
| `/resume` | `local-jsx` | Resume a previous session | [resume_and_rename.md](./resume_and_rename.md) |
| `/rename` | `local` | Rename the current session | [resume_and_rename.md](./resume_and_rename.md) |
| `/login` | `local-jsx` | Log in or switch accounts | [session_commands.md](./session_commands.md) |
| `/logout` | `local-jsx` | Log out of current account | [session_commands.md](./session_commands.md) |
| `/init` | `prompt` | Initialize CLAUDE.md for a project | [session_commands.md](./session_commands.md) |

#### Mode & Settings Commands

| Command | Type | Purpose | Documentation |
|---------|------|---------|---------------|
| `/vim` | `local` | Toggle vim keybinding mode | [mode_commands.md](./mode_commands.md) |
| `/fast` | `local-jsx` | Toggle fast mode (lower effort) | [mode_commands.md](./mode_commands.md) |
| `/effort` | `local-jsx` | Set effort level (low/medium/high/auto) | [effort_command.md](./effort_command.md) |
| `/color` | `local-jsx` | Set session prompt bar color | [mode_commands.md](./mode_commands.md) |

#### Code Review Commands

| Command | Type | Purpose | Documentation |
|---------|------|---------|---------------|
| `/review` | `prompt` | Code review via gh CLI | [review.md](./review.md) |
| `/pr-comments` | `prompt` | Fetch and analyze PR comments | [review.md](./review.md) |
| `/security-review` | `prompt` | Security-focused code review | [review.md](./review.md) |

#### Utility Commands

| Command | Type | Purpose | Documentation |
|---------|------|---------|---------------|
| `/copy` | `local-jsx` | Copy last response to clipboard | [utility_commands.md](./utility_commands.md) |
| `/context` | `local-jsx` | Context usage visualization | [utility_commands.md](./utility_commands.md) |
| `/add-dir` | `local-jsx` | Add a working directory | [utility_commands.md](./utility_commands.md) |
| `/reload-plugins` | `local` | Reload plugins without restart | [utility_commands.md](./utility_commands.md) |
| `/feedback` | `local-jsx` | Submit feedback (alias: `/bug`) | [utility_commands.md](./utility_commands.md) |
| `/statusline` | `prompt` | Configure custom status line | [statusline.md](./statusline.md) |
| `/loop` | `local-jsx` | Create recurring task | [loop_command.md](./loop_command.md) |

---

## Command Documentation Index

For detailed analysis of specific commands, see:

- [clear_command.md](./clear_command.md) — `/clear` and `/compact` commands
- [help_command.md](./help_command.md) — `/help` command
- [loop_command.md](./loop_command.md) — `/loop` command for recurring tasks
- [effort_command.md](./effort_command.md) — `/effort` command for thinking control
- [mode_commands.md](./mode_commands.md) — `/vim`, `/fast`, `/color` mode toggles
- [session_commands.md](./session_commands.md) — `/login`, `/logout`, `/init` session commands
- [utility_commands.md](./utility_commands.md) — `/copy`, `/context`, `/add-dir`, `/reload-plugins`, `/feedback`
- [resume_and_rename.md](./resume_and_rename.md) — `/resume` and `/rename` commands
- [review.md](./review.md) — `/review`, `/pr-comments`, `/security-review` commands
- [statusline.md](./statusline.md) — `/statusline` command
- [forked_execution.md](./forked_execution.md) — **NEW** Forked command execution deep dive
- [system_reminder_integration.md](./system_reminder_integration.md) — **NEW** Skill listing injection analysis

---

## Slash Command Parsing

### parseSlashCommand (uc4)

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
// Location: chunks.133.mjs:820-835
// ============================================

// ORIGINAL (for source lookup):
function uc4(A) {
    let q = A.trim();
    if (!q.startsWith("/")) return null;
    let Y = q.slice(1).split(" ");
    if (!Y[0]) return null;
    let z = Y[0], _ = !1, w = 1;
    if (Y.length > 1 && Y[1] === "(MCP)") z = z + " (MCP)", _ = !0, w = 2;
    let O = Y.slice(w).join(" ");
    return { commandName: z, args: O, isMcp: _ }
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

// Mapping: uc4→parseSlashCommand, A→input, q→trimmed, Y→tokens, z→commandName, _→isMcp, w→argsStartIndex, O→args
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

### handleSlashInput (DvY) — Top-Level Dispatcher

**What it does:** The entry point for all slash command processing. Parses the input, validates the command exists, and dispatches to `executeCommand`.

**Location:** chunks.133.mjs:1120-1200

**How it works:**
1. `parseSlashCommand(input)` → `{ commandName, args, isMcp }`
2. If parse fails, emit telemetry and show usage error
3. `isCommandAvailable(commandName, commands)` → guards against unknown commands
4. If command not found but looks like valid skill name, treat as regular prompt
5. `executeCommand(commandName, args, toolUseContext, ...)` → dispatch

```javascript
// ============================================
// handleSlashInput - Top-level slash command dispatcher
// Location: chunks.133.mjs:1120-1200
// ============================================

// ORIGINAL (for source lookup):
async function DvY(A, q, K, Y, z, _, w, O, $) {
    let H = uc4(A);
    if (!H) {
        d("tengu_input_slash_missing", {});
        let h = "Commands are in the form `/command [args]`";
        return {
            messages: [Ah(), ...Y, p1({ content: HE({ inputString: h, precedingInputBlocks: q }) })],
            shouldQuery: !1,
            resultText: h
        }
    }
    let { commandName: j, args: J, isMcp: M } = H, D = M ? "mcp" : !Qg().has(j) ? "custom" : j;
    if (!rY6(j, z.options.commands)) {
        // ... fallback to regular prompt for unrecognized commands
    }
    let { messages: X, shouldQuery: P, ... } = await XvY(j, J, _, z, q, K, O, $, w);
    // ... process result
}

// READABLE (for understanding):
async function handleSlashInput(input, precedingBlocks, conversationMessages, contextMessages,
                                 toolUseContext, setJSXOutput, inputUUID, sessionMemoryType, agentId) {
    let parsed = parseSlashCommand(input);
    if (!parsed) {
        trackEvent("tengu_input_slash_missing", {});
        return {
            messages: [...contextMessages, createUserMessage({ content: "Commands are in the form `/command [args]`" })],
            shouldQuery: false,
            resultText: "Commands are in the form `/command [args]`"
        };
    }
    let { commandName, args, isMcp } = parsed;
    if (!isCommandAvailable(commandName, toolUseContext.options.commands)) {
        // Handle unknown command - may fall through to regular prompt
    }
    let result = await executeCommand(commandName, args, toolUseContext, ...);
    return result;
}

// Mapping: DvY→handleSlashInput, A→input, q→precedingBlocks, uc4→parseSlashCommand, rY6→isCommandAvailable, XvY→executeCommand
```

**Why this approach:**
- Early validation prevents unnecessary work for invalid input
- Graceful fallback allows mistyped commands to become regular prompts
- Single entry point simplifies the REPL's input handling logic

### executeCommand (XvY) — Type Router

**What it does:** Routes execution based on command `type` field.

**Location:** chunks.133.mjs:1247-1400

**How it works:**
- `type === "local"` → runs synchronously, wraps output in `<local-command-stdout>` XML tags
- `type === "local-jsx"` → runs interactive React component via `setJSXOutput`
- `type === "prompt"` → calls `handlePromptCommand` (ec4) or `handleForkedCommand` (MvY) based on `context` field

```javascript
// ============================================
// executeCommand - Type router for slash commands
// Location: chunks.133.mjs:1247-1400
// ============================================

// ORIGINAL (for source lookup):
async function XvY(A, q, K, Y, z, _, w, O, $) {
    let H = kf6(A, Y.options.commands);
    if (H.type === "prompt" && H.userInvocable !== !1) ON1(A);
    if (H.userInvocable === !1) return { messages: [...], shouldQuery: !1, command: H };
    try {
        switch (H.type) {
            case "local-jsx":
                return new Promise((j) => { /* JSX component handling */ });
            case "local": {
                let X = await (await H.load()).call(q, Y);
                return { messages: [...], shouldQuery: !1, command: H, resultText: X.value };
            }
            case "prompt":
                if (H.context === "fork") return await MvY(H, q, Y, z, K, O ?? tJ);
                return await ec4(H, q, Y, z, _, $);
        }
    } catch (j) { /* error handling */ }
}

// READABLE (for understanding):
async function executeCommand(commandName, args, toolUseContext, context, precedingBlocks,
                              conversationMessages, setJSXOutput, sessionMemoryType, inputUUID) {
    let command = findCommand(commandName, toolUseContext.options.commands);
    if (command.type === "prompt" && command.userInvocable !== false) trackSkillUsage(commandName);
    if (command.userInvocable === false) return { messages: [...], shouldQuery: false, command };

    try {
        switch (command.type) {
            case "local-jsx":
                return new Promise((resolve) => { /* Load and render JSX component */ });
            case "local": {
                let result = await (await command.load()).call(args, toolUseContext);
                return { messages: [...], shouldQuery: false, command, resultText: result.value };
            }
            case "prompt":
                if (command.context === "fork") return await handleForkedCommand(command, args, ...);
                return await handlePromptCommand(command, args, ...);
        }
    } catch (error) { /* error handling */ }
}

// Mapping: XvY→executeCommand, A→commandName, q→args, kf6→findCommand, ON1→trackSkillUsage, MvY→handleForkedCommand, ec4→handlePromptCommand
```

**Key insight:** The switch statement cleanly separates three execution modes. Local commands complete synchronously, JSX commands return a Promise that resolves when the UI interaction completes, and prompt commands inject content into the conversation.

### Command Types

| `type` | Execution | Example Commands |
|--------|-----------|-----------------|
| `local` | Sync shell function, output returned as text | `/rename`, `/copy`, `/reload-plugins` |
| `local-jsx` | React component rendered in terminal | `/resume`, `/effort`, `/vim`, `/loop` |
| `prompt` | Prompt injected into LLM conversation | `/review`, `/security-review` |

### Fork vs. Inline for Prompt Commands

For `prompt`-type commands, the `context` field on the command definition determines execution path:

- **No `context` (inline)**: `handlePromptCommand` (ec4) — runs in main agent loop
- **`context: "fork"`**: `handleForkedCommand` (MvY) — spawns dedicated sub-agent with isolated state

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
4. Sort by score, then by `computeSkillScore` (ux8) for tiebreaking
5. Return top N suggestions

**Decay scoring:** Skills that were recently used score higher. The decay formula weights recent usage more heavily than old usage, so frequently-used commands appear at the top of the picker.

---

## Deep Algorithm Analysis

### Skill Usage Scoring — computeSkillScore (ux8)

**What it does:** Calculates a time-decayed popularity score for ranking skills in autocomplete suggestions.

**Location:** chunks.133.mjs:900-905

```javascript
// ============================================
// computeSkillScore - Time-decayed skill popularity scoring
// Location: chunks.133.mjs:900-905
// ============================================

// ORIGINAL (for source lookup):
function ux8(A) {
    let K = X1().skillUsage?.[A];
    if (!K) return 0;
    let Y = (Date.now() - K.lastUsedAt) / 86400000,
        z = Math.pow(0.5, Y / 7);
    return K.usageCount * Math.max(z, 0.1)
}

// READABLE (for understanding):
function computeSkillScore(skillName) {
    let usage = getSkillUsageState().skillUsage?.[skillName];
    if (!usage) return 0;

    let daysSinceLastUse = (Date.now() - usage.lastUsedAt) / 86400000;  // ms per day
    let decayFactor = Math.pow(0.5, daysSinceLastUse / 7);  // 7-day half-life

    return usage.usageCount * Math.max(decayFactor, 0.1);  // minimum 10% of raw count
}

// Mapping: ux8→computeSkillScore, A→skillName, K→usage, Y→daysSinceLastUse, z→decayFactor, X1→getSkillUsageState
```

**How it works:**
1. **Retrieve usage data**: Look up `skillUsage[skillName]` from global state
2. **Calculate days elapsed**: `(Date.now() - lastUsedAt) / 86400000`
3. **Apply half-life decay**: `Math.pow(0.5, days / 7)` — score halves every 7 days
4. **Floor the decay**: `Math.max(decayFactor, 0.1)` — never drop below 10% of raw count
5. **Scale by usage count**: `usageCount * decayFactor`

**Why this approach:**
- **7-day half-life**: Skills used recently get exponentially higher scores. A skill used today has full weight; after 7 days, 50%; after 14 days, 25%; after 21 days, 12.5% (then floors at 10%).
- **Usage count multiplier**: A skill used 10 times scores higher than one used once, even with similar recency.
- **10% floor**: Prevents older-but-useful skills from disappearing entirely. A frequently-used skill remains discoverable.

**Decay curve visualization:**

```
Score Retention Over Time
─────────────────────────────────────────────────
Day 0:  ████████████████████████████████████ 100%
Day 7:  ████████████████████               50%
Day 14: ██████████                         25%
Day 21: █████                              12.5% → floors at 10%
Day 28+: ████                              10% (minimum)
```

**Key insight:** The algorithm balances recency and frequency. A skill used once yesterday (`count=1, decay=1.0`) scores 1.0, while a skill used 20 times two weeks ago (`count=20, decay=0.25`) scores 5.0. Frequency dominates for heavily-used skills; recency matters more for occasional use.

---

### Command Priority Algorithm — getAllSkills (I0)

**What it does:** Merges all command sources into a single unified list with defined priority ordering.

**Location:** chunks.168.mjs:2013-2028

```javascript
// ============================================
// getAllSkills - Unified command list with priority ordering
// Location: chunks.168.mjs:2013-2028
// ============================================

// ORIGINAL (for source lookup):
I0 = e1(async (A) => {
    let [{
        skillDirCommands: q,
        pluginSkills: K,
        bundledSkills: Y,
        builtinPluginSkills: z
    }, _, w] = await Promise.all([z5z(A), w96(), kZq ? kZq(A) : Promise.resolve([])]),
    O = k94(),
    $ = [...Y, ...z, ...q, ...w, ..._, ...K, ...Ci8()].filter((D) => D.isEnabled());
    if (O.length === 0) return $;
    let H = new Set($.map((D) => D.name)),
        j = O.filter((D) => !H.has(D.name) && D.isEnabled());
    if (j.length === 0) return $;
    let J = new Set(Ci8().map((D) => D.name)),
        M = $.findIndex((D) => J.has(D.name));
    if (M === -1) return [...$, ...j];
    return [...$.slice(0, M), ...j, ...$.slice(M)]
});

// READABLE (for understanding):
getAllSkills = memoized(async (toolUseContext) => {
    // Load all sources in parallel
    let [{
        skillDirCommands,     // .claude/skills/ directories
        pluginSkills,         // Plugin-provided skills
        bundledSkills,        // Bundled skills (built-in prompts)
        builtinPluginSkills   // Built-in plugin skills
    }, mcpCommands, externalCommands] = await Promise.all([
        getSkills(toolUseContext),
        loadMcpCommands(),
        loadExternalCommands()
    ]);

    let userDefinedCommands = getUserDefinedCommands();

    // Merge in priority order
    let allEnabled = [
        ...bundledSkills,
        ...builtinPluginSkills,
        ...skillDirCommands,
        ...externalCommands,
        ...mcpCommands,
        ...pluginSkills,
        ...getBuiltinCommands()  // Ci8()
    ].filter(cmd => cmd.isEnabled());

    // Handle user-defined commands (insert before first builtin)
    if (userDefinedCommands.length === 0) return allEnabled;

    let existingNames = new Set(allEnabled.map(cmd => cmd.name));
    let newUserCommands = userDefinedCommands.filter(
        cmd => !existingNames.has(cmd.name) && cmd.isEnabled()
    );
    if (newUserCommands.length === 0) return allEnabled;

    let builtinNames = new Set(getBuiltinCommands().map(cmd => cmd.name));
    let firstBuiltinIndex = allEnabled.findIndex(cmd => builtinNames.has(cmd.name));

    if (firstBuiltinIndex === -1) return [...allEnabled, ...newUserCommands];
    return [...allEnabled.slice(0, firstBuiltinIndex), ...newUserCommands, ...allEnabled.slice(firstBuiltinIndex)];
});

// Mapping: I0→getAllSkills, e1→memoized, A→toolUseContext, Ci8→getBuiltinCommands, k94→getUserDefinedCommands
```

**Why this approach:**
- **Parallel loading**: `Promise.all()` loads all sources concurrently for minimum latency.
- **Memoization**: `e1` wraps the function to cache results; subsequent calls return cached list.
- **Priority ordering**: The spread operator `[...bundled, ...skillDir, ...]` establishes search order.
- **User-defined insertion**: Spliced before built-ins but after skills/plugins for discoverability.

**Priority order (highest to lowest):**

| Priority | Source | Location | Example |
|----------|--------|----------|---------|
| 1 | Bundled skills | Built into binary | `/init`, `/review` |
| 2 | Builtin plugin skills | Built-in plugins | Chrome skill |
| 3 | Skill directory commands | `.claude/skills/` | Custom project skills |
| 4 | External commands | External systems | MCP-discovered |
| 5 | MCP commands | MCP servers | Server-provided tools |
| 6 | Plugin skills | Installed plugins | Marketplace skills |
| 7 | User-defined commands | Settings/config | Custom shortcuts |
| 8 | Built-in commands | Hardcoded in binary | `/help`, `/clear` |

**Key insight:** The order matters for `findCommand()`. If a user creates a skill named `help`, it will be found before the built-in `/help`. This allows extensibility while preserving a fallback to built-ins.

---

### Skill Usage Tracking — trackSkillUsage (ON1)

**What it does:** Records skill invocation in session state for later scoring.

**Location:** chunks.133.mjs:884-897

```javascript
// ============================================
// trackSkillUsage - Record skill invocation for popularity scoring
// Location: chunks.133.mjs:884-897
// ============================================

// ORIGINAL (for source lookup):
function ON1(A) {
    let K = X1().skillUsage?.[A],
        Y = Date.now(),
        z = (K?.usageCount ?? 0) + 1;
    if (!K || K.usageCount !== z || K.lastUsedAt !== Y) d1((_) => ({
        ..._,
        skillUsage: {
            ..._.skillUsage,
            [A]: {
                usageCount: z,
                lastUsedAt: Y
            }
        }
    }))
}

// READABLE (for understanding):
function trackSkillUsage(skillName) {
    let currentUsage = getSkillUsageState().skillUsage?.[skillName];
    let now = Date.now();
    let newCount = (currentUsage?.usageCount ?? 0) + 1;

    // Only update if values would change (optimization)
    if (!currentUsage ||
        currentUsage.usageCount !== newCount ||
        currentUsage.lastUsedAt !== now) {

        setState((prev) => ({
            ...prev,
            skillUsage: {
                ...prev.skillUsage,
                [skillName]: {
                    usageCount: newCount,
                    lastUsedAt: now
                }
            }
        }));
    }
}

// Mapping: ON1→trackSkillUsage, A→skillName, K→currentUsage, Y→now, z→newCount, d1→setState, X1→getSkillUsageState
```

**How it works:**
1. **Get current usage**: Look up existing `skillUsage[skillName]` from global state
2. **Increment count**: `newCount = (current?.usageCount ?? 0) + 1`
3. **Set timestamp**: `lastUsedAt = Date.now()` (milliseconds since epoch)
4. **Conditional update**: Only call `setState` if values would actually change (prevents redundant renders)

**Why this approach:**
- **Immutable update**: Uses spread operator to create new state object
- **Optimization guard**: Skips `setState` if nothing changed
- **Per-session persistence**: Usage data lives in global state, persists for session duration
- **Cross-command sharing**: All skill invocations update the same usage map

---

### Command Name Validation — isValidCommandName (sc4)

**What it does:** Validates that a command name contains only safe characters.

**Location:** chunks.133.mjs:1116-1118

```javascript
// ============================================
// isValidCommandName - Validate command name characters
// Location: chunks.133.mjs:1116-1118
// ============================================

// ORIGINAL (for source lookup):
function sc4(A) {
    return !/[^a-zA-Z0-9:\-_]/.test(A)
}

// READABLE (for understanding):
function isValidCommandName(name) {
    // Regex matches any character NOT in the allowed set
    // If test returns true, there's an invalid character → return false
    // If test returns false, all characters are valid → return true
    return !/[^a-zA-Z0-9:\-_]/.test(name);
}

// Mapping: sc4→isValidCommandName, A→name
```

**Allowed characters:**
- Letters: `a-z`, `A-Z`
- Numbers: `0-9`
- Colon: `:`
- Hyphen: `-`
- Underscore: `_`

**Why this validation:**
- Prevents command injection through malicious names
- Ensures compatibility with filesystem and URL constraints
- Keeps command names human-readable

**Key insight:** The regex uses a negated character class `[^...]` which matches any character NOT in the allowed set. If `.test()` returns `true`, there's an invalid character. The `!` inverts this: valid names return `true`.

---

### User Prompt Building — buildUserPrompt (PvY)

**What it does:** Constructs the user-facing display for a command invocation, determining format based on whether the command is user-invocable.

**Location:** chunks.133.mjs:1420-1424

```javascript
// ============================================
// buildUserPrompt - Build user-facing command display
// Location: chunks.133.mjs:1420-1424
// ============================================

// ORIGINAL (for source lookup):
function PvY(A, q) {
    if (A.userInvocable !== !1) return oc4(A.name, q);
    if (A.loadedFrom === "skills" || A.loadedFrom === "plugin")
        return tc4(A.name, A.progressMessage);
    return oc4(A.name, q)
}

// READABLE (for understanding):
function buildUserPrompt(command, args) {
    // User-invocable commands show /name args format
    if (command.userInvocable !== false) {
        return formatUserInvocablePrompt(command.name, args);
    }
    // LLM-invoked skills from skills/plugin directories show Skill(name) format
    if (command.loadedFrom === "skills" || command.loadedFrom === "plugin") {
        return formatModelInvokedPrompt(command.name, command.progressMessage);
    }
    // Fallback to standard format
    return formatUserInvocablePrompt(command.name, args);
}

// Mapping: PvY→buildUserPrompt, A→command, q→args, oc4→formatUserInvocablePrompt, tc4→formatModelInvokedPrompt
```

**Display format decision matrix:**

| `userInvocable` | `loadedFrom` | Output Format |
|-----------------|--------------|---------------|
| `true` (default) | Any | `/name args` |
| `false` | `"skills"` | `Skill(name)` with progress message |
| `false` | `"plugin"` | `Skill(name)` with progress message |
| `false` | Other | `/name args` |

**Why this distinction:**
- User-invocable commands should show the `/name` syntax for discoverability
- LLM-only skills (like internal helpers) show `Skill(name)` to indicate they were invoked by the model
- The `progressMessage` field provides context during skill loading

**Key insight:** The `userInvocable !== false` check uses `!==` rather than `=== true` because the default is `true` (undefined/null treated as invocable). This allows skill authors to explicitly opt-out of user invocation without requiring explicit opt-in.

---

## Command Resolution Flow

```
User types "/commit"
        │
        ▼
parseSlashCommand (uc4)
        │
        ▼
{ commandName: "commit", args: "", isMcp: false }
        │
        ▼
handleSlashInput (DvY)
        │
        ▼
isCommandAvailable (rY6) → checks if command exists
        │
        ├─── Not found ──→ Check if valid skill name → Fall through as regular prompt
        │
        └─── Found ──────→ continue
                │
                ▼
        findCommand (kf6)
                │
                ├─── Search bundled skills ────────→ No match
                │
                ├─── Search skill-dir commands ────→ Found: .claude/skills/commit.md
                │
                ▼
        Return command object { type: "prompt", getPromptForCommand, ... }
                │
                ▼
        executeCommand (XvY)
                │
                ├─── type === "local" ─────→ Run sync, return output in <local-command-stdout>
                │
                ├─── type === "local-jsx" ─→ Render React component via setJSXOutput
                │
                └─── type === "prompt" ────→ Build LLM messages
                            │
                            ├── context: undefined → handlePromptCommand (ec4, inline)
                            │
                            └── context: "fork" ──→ handleForkedCommand (MvY, sub-agent)
```

**Symbol Quick Reference:**
- `uc4` → `parseSlashCommand` (chunks.133.mjs:820)
- `DvY` → `handleSlashInput` (chunks.133.mjs:1120)
- `XvY` → `executeCommand` (chunks.133.mjs:1247)
- `kf6` → `findCommand` (chunks.168.mjs:1858)
- `rY6` → `isCommandAvailable` (chunks.168.mjs:1854)
- `ec4` → `handlePromptCommand` (chunks.133.mjs:1433)
- `MvY` → `handleForkedCommand` (chunks.133.mjs:1025)

---

## Deep Analysis: Forked Command Execution

### handleForkedCommand (MvY) — Isolated Sub-Agent Execution

**What it does:** Executes a prompt-type command in an isolated sub-agent context, displaying real-time progress while preventing the command's tool calls from affecting the main conversation state.

**Location:** chunks.133.mjs:1025-1114

**How it works:**
1. **Generate agent ID**: `bI()` creates a unique agent identifier for the forked execution
2. **Build forked config**: `DN1()` prepares skill content, modified app state, base agent definition, and prompt messages
3. **Progress tracking**: Creates a progress emitter function that pushes updates to a display array
4. **UI update callback**: `W()` function updates the JSX display with current progress messages
5. **Agent loop iteration**: `for await (let event of qh({...}))` streams events from the sub-agent
6. **Result extraction**: `XN1()` extracts the final result text from the accumulated events

```javascript
// ============================================
// handleForkedCommand - Isolated sub-agent execution for prompt commands
// Location: chunks.133.mjs:1025-1114
// ============================================

// ORIGINAL (for source lookup):
async function MvY(A, q, K, Y, z, _) {
    let w = bI();
    d("tengu_slash_command_forked", { command_name: A.name });
    let { skillContent: O, modifiedGetAppState: $, baseAgent: H, promptMessages: j } = await DN1(A, q, K);
    k(`Executing forked slash command /${A.name} with agent ${H.agentType}`);
    let J = [], M = [], D = `forked-command-${A.name}`, X = 0,
        P = (f) => ({ type: "progress", data: { message: f, type: "agent_progress", prompt: O, agentId: w }, ... }),
        W = () => { z({ jsx: ff6(M, { tools: K.options.tools, verbose: !1 }), ... }); };
    W();
    try {
        for await (let f of qh({ agentDefinition: H, promptMessages: j, toolUseContext: {...}, ... })) {
            J.push(f);
            // Update progress display for each event
            if (f.type === "assistant") M.push(P(f)), W();
            if (f.type === "user") M.push(P(N)), W();
        }
    } finally { z(null); }
    let Z = XN1(J, "Command completed");
    return { messages: [...], shouldQuery: !1, command: A, resultText: Z };
}

// READABLE (for understanding):
async function handleForkedCommand(command, args, toolUseContext, precedingBlocks, setJSXOutput, canUseTool) {
    let agentId = generateAgentId();
    trackEvent("tengu_slash_command_forked", { command_name: command.name });

    // Prepare isolated execution context
    let { skillContent, modifiedGetAppState, baseAgent, promptMessages } =
        await buildForkedCommandConfig(command, args, toolUseContext);

    let allEvents = [];
    let progressMessages = [];
    let progressId = `forked-command-${command.name}`;
    let progressIndex = 0;

    // Progress emitter creates displayable progress items
    let emitProgress = (message) => ({
        type: "progress",
        data: { message, type: "agent_progress", prompt: skillContent, agentId },
        toolUseID: `${progressId}-${++progressIndex}`,
        ...
    });

    // Update UI with current progress
    let updateDisplay = () => {
        setJSXOutput({
            jsx: renderForkedProgress(progressMessages, { tools: toolUseContext.options.tools }),
            showSpinner: true
        });
    };

    updateDisplay();  // Show initial empty state

    try {
        // Stream events from sub-agent execution
        for await (let event of runAgentLoop({
            agentDefinition: baseAgent,
            promptMessages,
            toolUseContext: { ...toolUseContext, getAppState: modifiedGetAppState },
            canUseTool,
            querySource: "agent:custom",
            model: command.model
        })) {
            allEvents.push(event);
            // Update progress display for assistant/user messages
            if (event.type === "assistant") progressMessages.push(emitProgress(event)), updateDisplay();
            if (event.type === "user") progressMessages.push(emitProgress(event)), updateDisplay();
        }
    } finally {
        setJSXOutput(null);  // Clear progress display
    }

    let resultText = extractResultFromEvents(allEvents, "Command completed");
    return {
        messages: [createUserMessage(...), createAssistantMessage(`<local-command-stdout>${resultText}</local-command-stdout>`)],
        shouldQuery: false,
        command,
        resultText
    };
}

// Mapping: MvY→handleForkedCommand, A→command, q→args, K→toolUseContext, Y→precedingBlocks,
//          z→setJSXOutput, _→canUseTool, w→agentId, DN1→buildForkedCommandConfig, qh→runAgentLoop,
//          XN1→extractResultFromEvents, ff6→renderForkedProgress
```

**Why this approach:**
- **State isolation**: The `modifiedGetAppState` ensures tool executions don't pollute main conversation state
- **Progress visibility**: Users see real-time progress updates instead of a frozen UI
- **Error containment**: Failures in the forked agent don't crash the main REPL
- **Context separation**: The forked agent has its own message history and tool permissions

**Key insight:** Forked commands are essentially mini-agent sessions within the main session. They're useful for tasks that need isolated execution (like `/review` which may make many git/GitHub API calls) without cluttering the main conversation context.

---

### handlePromptCommand (ec4) — Inline Prompt Execution

**What it does:** Executes a prompt-type command inline, injecting the command's prompt content directly into the main conversation.

**Location:** chunks.133.mjs:1433-1465

**How it works:**
1. **Get prompt content**: `command.getPromptForCommand(args, context)` returns the prompt messages
2. **Register hooks**: If command has hooks, register them via `gc4()`
3. **Track invocation**: `Uw6()` records the skill invocation for the invoked_skills attachment
4. **Build user message**: `PvY()` creates the user-facing prompt display
5. **Process allowed tools**: `Kh()` filters the tool whitelist
6. **Create system context**: `T01()` generates system prompt additions based on prompt text

```javascript
// ============================================
// handlePromptCommand - Inline prompt command execution
// Location: chunks.133.mjs:1433-1465
// ============================================

// ORIGINAL (for source lookup):
async function ec4(A, q, K, Y = [], z = [], _) {
    let w = await A.getPromptForCommand(q, K);
    if (A.hooks) {
        let X = R1();
        gc4(K.setAppState, X, A.hooks, A.name, A.type === "prompt" ? A.skillRoot : void 0)
    }
    let O = A.source ? `${A.source}:${A.name}` : A.name,
        $ = w.filter((X) => X.type === "text").map((X) => X.text).join("\n\n");
    Uw6(A.name, O, $, Tf6()?.agentId ?? null);
    let H = PvY(A, q), j = Kh(A.allowedTools ?? []), J = z.length > 0 || Y.length > 0 ? [...z, ...Y, ...w] : w,
        M = await T01(Vf6(w.filter((X) => X.type === "text").map((X) => X.text).join(" "), K, null, [], K.messages, "repl_main_thread"));
    return {
        messages: [p1({ content: H, uuid: _ }), p1({ content: J, isMeta: !0 }), ...M, f4({ type: "command_permissions", allowedTools: j, model: A.model })],
        shouldQuery: !0,
        allowedTools: j,
        model: A.model,
        command: A
    }
}

// READABLE (for understanding):
async function handlePromptCommand(command, args, toolUseContext, precedingBlocks = [], additionalMessages = [], inputUUID) {
    // Get the prompt content for this command
    let promptMessages = await command.getPromptForCommand(args, toolUseContext);

    // Register skill hooks if defined
    if (command.hooks) {
        let hookContext = createHookContext();
        registerSkillHooks(toolUseContext.setAppState, hookContext, command.hooks, command.name,
                           command.type === "prompt" ? command.skillRoot : undefined);
    }

    // Track invocation for invoked_skills attachment
    let skillKey = command.source ? `${command.source}:${command.name}` : command.name;
    let promptText = promptMessages.filter((m) => m.type === "text").map((m) => m.text).join("\n\n");
    registerInvokedSkill(command.name, skillKey, promptText, getCurrentAgentId()?.agentId ?? null);

    // Build display messages
    let userPrompt = buildUserPrompt(command, args);
    let allowedTools = filterAllowedTools(command.allowedTools ?? []);

    // Merge additional messages if present
    let finalMessages = additionalMessages.length > 0 || precedingBlocks.length > 0
        ? [...additionalMessages, ...precedingBlocks, ...promptMessages]
        : promptMessages;

    // Generate system context based on prompt
    let systemAdditions = await generateSystemContext(
        extractTextFromMessages(promptMessages), toolUseContext, ...
    );

    return {
        messages: [
            createUserMessage({ content: userPrompt, uuid: inputUUID }),
            createMetaMessage({ content: finalMessages }),  // isMeta: true, not shown to user
            ...systemAdditions,
            createPermissionDirective({ type: "command_permissions", allowedTools, model: command.model })
        ],
        shouldQuery: true,  // Trigger LLM query
        allowedTools,
        model: command.model,
        command
    };
}

// Mapping: ec4→handlePromptCommand, A→command, q→args, K→toolUseContext, Y→precedingBlocks, z→additionalMessages,
//          _→inputUUID, w→promptMessages, PvY→buildUserPrompt, Kh→filterAllowedTools, Uw6→registerInvokedSkill,
//          gc4→registerSkillHooks, T01→generateSystemContext
```

**Why this approach:**
- **Hook integration**: Commands can define hooks that run at specific lifecycle events
- **Invocation tracking**: Records which skills were used, enabling the `invoked_skills` system reminder
- **Tool scoping**: `allowedTools` lets commands restrict which tools the LLM can use
- **Model override**: Commands can specify a different model for their execution

**Key insight:** Unlike forked commands, inline prompt commands merge directly into the main conversation. This makes them suitable for commands that enhance the current context (like `/init` which sets up project context) rather than isolated operations.

---

## Integration Points

### System Reminder Integration

The skill system integrates with the system reminder mechanism to provide LLM context about available skills:

| Function | Purpose | Location |
|----------|---------|----------|
| `generateSkillListingAttachment` (guY) | Creates skill_listing attachment | chunks.147.mjs |
| `getInvokedSkillsAttachment` (Tqq) | Creates invoked_skills attachment | chunks.147.mjs |
| `formatSkillListing` (fV8) | Budget-aware skill list formatting | chunks.90.mjs |
| `sentSkillNames` (nT6) | Set tracking sent skill names for deduplication | chunks.147.mjs |

**Skill Listing Flow:**
```
Turn N begins
    │
    ▼
getAllSkillsForTool(NR) → filter visible skills
    │
    ▼
generateSkillListingAttachment(guY)
    ├── Filter new skills via nT6 Set
    ├── Track isInitial flag
    └── formatSkillListing(fV8) → budget-aware text
    │
    ▼
System Reminder Message
```

**Budget Calculation:**
- `charBudget = min(16000, contextWindowTokens * 4 * 0.02)`
- ~2% of context window for skill listings

### Skill Tool Integration

The `Skill` tool allows the LLM to invoke skills programmatically:

| Property | Description |
|----------|-------------|
| `userInvocable` | If `true`, skill appears in slash command picker |
| `disableModelInvocation` | If `true`, skill hidden from Skill tool suggestions |
| `whenToUse` | Hint text for when LLM should invoke |

**Filtering logic:**
- **Slash command picker**: Shows `type === "prompt"` AND `source !== "builtin"` AND (`hasUserSpecifiedDescription` OR `whenToUse`)
- **Skill tool suggestions**: Shows `type === "prompt"` AND `!disableModelInvocation` AND `source !== "builtin"`

### Hook Integration

The `registerSkillHooks` function (gc4) registers hooks defined in skill frontmatter:

```javascript
// ============================================
// registerSkillHooks - Register hooks from skill frontmatter
// Location: chunks.51.mjs:1361
// ============================================

// READABLE (for understanding):
function registerSkillHooks(setAppState, hookContext, hooks, skillName, skillRoot) {
    let hookCount = 0;
    for (let eventName of HOOK_EVENT_NAMES) {  // PreToolUse, PostToolUse, Notification, etc.
        let hooksForEvent = hooks[eventName];
        if (!hooksForEvent) continue;

        for (let hookGroup of hooksForEvent) {
            for (let hook of hookGroup.hooks) {
                // One-shot hooks auto-remove after firing
                let cleanup = hook.once ? () => {
                    removeSessionHook(setAppState, hookContext, eventName, hook);
                } : undefined;

                addSkillHook(setAppState, hookContext, eventName, hookGroup.matcher || "", hook, cleanup, skillRoot);
                hookCount++;
            }
        }
    }
    if (hookCount > 0) {
        log(`Registered ${hookCount} hooks from skill '${skillName}'`);
    }
}
```

**Hook Registration Flow:**
1. Parse hooks from skill frontmatter
2. For each hook event type (PreToolUse, PostToolUse, etc.)
3. Register with `addSkillHook`
4. Track one-shot hooks for auto-removal

### Compaction Integration

Invoked skills are preserved through context compaction via the `invoked_skills` attachment:

```javascript
// ============================================
// getInvokedSkillsAttachment - Build invoked_skills attachment for compaction
// Location: chunks.147.mjs:1896
// ============================================

// READABLE (for understanding):
function getInvokedSkillsAttachment(agentId) {
    let invokedSkills = getInvokedSkillsForAgent(agentId);  // St6
    if (invokedSkills.size === 0) return null;

    let skillsArray = Array.from(invokedSkills.values())
        .sort((a, b) => b.invokedAt - a.invokedAt)  // Most recent first
        .map((skill) => ({
            name: skill.skillName,
            path: skill.skillPath,
            content: skill.content
        }));

    return createAttachment({
        type: "invoked_skills",
        skills: skillsArray
    });
}
```

**Why preserve invoked skills:**
- Skills inject behavioral instructions
- After compaction, LLM should continue following those instructions
- `invoked_skills` attachment re-injects skill content with "Continue to follow these guidelines"

### Unified Command Object Abstraction

Both slash commands and skills use the same `CommandObject` interface:

```typescript
interface CommandObject {
  type: "local" | "local-jsx" | "prompt"
  name: string
  userFacingName: () => string
  description: string
  isEnabled: () => boolean
  isHidden: boolean
  userInvocable?: boolean
  disableModelInvocation?: boolean
  // prompt-type specific fields
  getPromptForCommand?: (args, context) => Promise<Message[]>
  allowedTools?: string[]
  model?: string
  hooks?: HookDefinitions
  context?: "fork"  // for isolated sub-agent execution
}
```

**Entry Point Convergence:**
```
User types "/name" → handleSlashInput → executeCommand → handlePromptCommand
                                                    ↘
LLM calls Skill tool → handlePromptCommandFromTool → handlePromptCommand
```

Both paths converge on `handlePromptCommand` (ec4), ensuring consistent execution regardless of invocation source.

---

## Deep Algorithm: Command Resolution Pipeline

### Step-by-Step Resolution Trace

**What it does:** Traces the complete flow from user typing `/command` to execution dispatch.

**How it works:**

```
User types "/review 42"
        │
        ▼
[1] parseSlashCommand (uc4)
    • Extract: { commandName: "review", args: "42", isMcp: false }
    • Fast string operations, no async
        │
        ▼
[2] handleSlashInput (DvY)
    • Check if commandName in Qg() builtin set
    • Route to "mcp" | "custom" | <builtin-name> for telemetry
        │
        ▼
[3] isCommandAvailable (rY6)
    • Quick existence check in command registry
    │
    ├─── NOT FOUND ──→ Check if valid skill name format
    │                  │
    │                  ├─── Valid name, looks like file path → Fall through as prompt
    │                  │
    │                  └─── Invalid chars → Return "Unknown skill" error
    │
    └─── FOUND ───────→ continue
        │
        ▼
[4] findCommand (kf6) → findCommandBase (G66)
    • Search priority: bundled → skillDir → mcp → plugin → builtin
    • Return first match with alias support
        │
        ▼
[5] executeCommand (XvY)
    • Switch on command.type
    │
    ├─── type === "local" ──────────────────────→
    │    • Load command handler
    │    • Execute synchronously
    │    • Wrap output in <local-command-stdout>
    │
    ├─── type === "local-jsx" ─────────────────→
    │    • Load JSX component
    │    • Render via setJSXOutput
    │    • Return Promise, resolve on completion
    │
    └─── type === "prompt" ─────────────────────→
         │
         ├─── context === "fork" ───→ handleForkedCommand (MvY)
         │    • Isolated sub-agent
         │    • Progress streaming
         │
         └─── no context ────────────→ handlePromptCommand (ec4)
              • Inline execution
              • Merge into main conversation
```

**Why this approach:**
- **Layered validation**: Each step adds verification before committing resources
- **Early exit for errors**: Invalid commands fail fast without async work
- **Separation of concerns**: Parsing → validation → resolution → dispatch

**Key insight:** The pipeline uses a "waterfall" pattern where each stage can short-circuit. The `isCommandAvailable` check is intentionally lightweight—it's just a map lookup—while the heavier `findCommand` with priority ordering only runs after confirmation.

---

## Deep Algorithm: System Reminder Injection

### Skill Listing Delta Update Mechanism

**What it does:** Injects available skills into the system prompt on each turn, using delta updates to minimize token usage.

**Location:** chunks.147.mjs:700-721

**How it works:**

```javascript
// ============================================
// generateSkillListingAttachment - Delta skill listing injection
// Location: chunks.147.mjs:700-721
// ============================================

// ORIGINAL (for source lookup):
async function guY(A) {
    if (!A.options.tools.some((O) => z3(O, oH))) return [];
    let q = qY(),
        K = await NR(q);
    if (bE1) {
        bE1 = !1;
        for (let O of K) nT6.add(O.name);
        return []
    }
    let Y = K.filter((O) => !nT6.has(O.name));
    if (Y.length === 0) return [];
    let z = nT6.size === 0;
    for (let O of Y) nT6.add(O.name);
    k(`Sending ${Y.length} skills via attachment (${z?"initial":"dynamic"}, ${nT6.size} total sent)`);
    let _ = uM(A.options.mainLoopModel, Zj());
    return [{
        type: "skill_listing",
        content: fV8(Y, _),
        skillCount: Y.length,
        isInitial: z
    }]
}

// READABLE (for understanding):
async function generateSkillListingAttachment(toolUseContext) {
    // Check if Skill tool is available
    if (!toolUseContext.options.tools.some((t) => isSkillTool(t))) return [];

    let sessionContext = getSessionContext();
    let allSkills = await getAllSkillsForTool(sessionContext);

    // bE1 flag: force initial load (e.g., after /compact)
    if (forceInitialLoad) {
        forceInitialLoad = false;
        for (let skill of allSkills) sentSkillNames.add(skill.name);
        return [];  // Skip this turn, will send full list next time
    }

    // Delta: only new skills not yet sent
    let newSkills = allSkills.filter((s) => !sentSkillNames.has(s.name));
    if (newSkills.length === 0) return [];

    // Track if this is the initial listing
    let isInitial = sentSkillNames.size === 0;

    // Mark all new skills as sent
    for (let skill of newSkills) sentSkillNames.add(skill.name);

    log(`Sending ${newSkills.length} skills via attachment (${isInitial ? "initial" : "dynamic"}, ${sentSkillNames.size} total sent)`);

    // Calculate character budget
    let charBudget = calculateCharBudget(toolUseContext.options.mainLoopModel, getContextTokens());

    return [{
        type: "skill_listing",
        content: formatSkillListing(newSkills, charBudget),
        skillCount: newSkills.length,
        isInitial
    }];
}

// Mapping: guY→generateSkillListingAttachment, nT6→sentSkillNames, NR→getAllSkillsForTool,
//          bE1→forceInitialLoad, fV8→formatSkillListing, uM→calculateCharBudget
```

**The `sentSkillNames` (nT6) Set lifecycle:**

| Event | Set State | Result |
|-------|-----------|--------|
| Session start | Empty | `isInitial: true`, send all skills |
| Turn 2+ | Contains previous skills | `isInitial: false`, delta only |
| After `/compact` | Unchanged, but `bE1=true` | Skip one turn, reset next turn |
| New skill installed | Set lacks new skill | Delta includes new skill |

**Why delta updates:**
- **Token efficiency**: Sending 50 skills every turn wastes ~3000 tokens
- **Delta approach**: Only new skills after first turn (~100-500 tokens)
- **Set deduplication**: O(1) lookup for "already sent" check

**Budget-aware formatting:**

```javascript
// ============================================
// formatSkillListing - Budget-aware skill list formatting
// Location: chunks.90.mjs:2654-2687
// ============================================

// Budget calculation constants
const BUDGET_RATIO = 0.02;      // 2% of context window
const TOKENS_PER_CHAR = 4;      // Approximate ratio
const MAX_FALLBACK_CHARS = 16000;
const MIN_DESCRIPTION_CHARS = 20;

function calculateCharBudget(model, contextTokens) {
    // Allow override via env var
    if (process.env.SLASH_COMMAND_TOOL_CHAR_BUDGET) {
        return Number(process.env.SLASH_COMMAND_TOOL_CHAR_BUDGET);
    }
    if (contextTokens) {
        return Math.floor(contextTokens * TOKENS_PER_CHAR * BUDGET_RATIO);
    }
    return MAX_FALLBACK_CHARS;  // ~16000 chars = ~4000 tokens
}

// Mapping: BUDGET_RATIO→r94, TOKENS_PER_CHAR→o94, MAX_FALLBACK_CHARS→a94, MIN_DESCRIPTION_CHARS→WB9
```

**Tiered truncation strategy:**

1. **Full format**: `- name: description - whenToUse` (if fits budget)
2. **Prioritize bundled**: Bundled skills always show full format
3. **Truncate descriptions**: Non-bundled skills get truncated descriptions
4. **Name-only fallback**: If severely constrained, show only names

---

## Cross-Component Integration Matrix

| Component | Integration Point | Key Function | Data Flow |
|-----------|------------------|--------------|-----------|
| 04_system_reminder | Skill listing injection | `guY` (generateSkillListingAttachment) | skills → system prompt |
| 10_skill_system | Unified command abstraction | `I0` (getAllSkills) | All sources → merged list |
| 11_hooks | Skill hook registration | `gc4` (registerSkillHooks) | skill.hooks → session hooks |
| 07_compact | Invoked skills preservation | `Tqq` (getInvokedSkillsAttachment) | invoked skills → compaction |
| 01_cli | REPL input handling | `DvY` (handleSlashInput) | user input → command dispatch |
| 02_ui | Autocomplete rendering | `PgA` (filterCommandSuggestions) | "/" → filtered suggestions |
| 18_sandbox | Forked isolation | `DN1` (buildForkedCommandConfig) | command → isolated context |

**Bidirectional data flow:**

```
User Input                    System Output
     │                              ▲
     ▼                              │
handleSlashInput ──────────► Skill tool execution
     │                              │
     │    ┌─────────────────────────┤
     │    │                         │
     ▼    ▼                         ▼
trackSkillUsage ◄─────► Usage State ◄─────► computeSkillScore
     │                              │
     ▼                              ▼
skillUsage state            Autocomplete ranking
                                    │
                                    ▼
                         generateSkillListingAttachment
                                    │
                                    ▼
                            System Reminder
```
