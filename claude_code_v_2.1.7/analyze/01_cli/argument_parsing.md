# CLI Argument Parsing

## Overview

Claude Code v2.1.7 uses Commander.js for CLI argument parsing. The system supports 45+ options across 10 categories, extensive subcommand trees, and sophisticated option validation with conflict detection.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

Key components in this document:
- `CommanderCommand` (O$1) - Commander.js Command class
- `CommanderOption` (LK) - CLI option definition class
- `commandHandler` (J_7) - Main command setup with all options
- `resolvePermissionMode` (HJ9) - Permission mode resolver
- `initToolPermissionContext` (EJ9) - Tool permission initializer

---

## Commander.js Implementation

### Main Command Configuration

```javascript
// ============================================
// mainCommandSetup - Claude CLI main command definition
// Location: chunks.157.mjs:15-27
// ============================================

// ORIGINAL (for source lookup):
let Q = new O$1().configureHelp(A());
Q.name("claude")
  .description("Claude Code - starts an interactive session by default, use -p/--print for non-interactive output")
  .argument("[prompt]", "Your prompt", String)
  .helpOption("-h, --help", "Display help for command")
  .version(`2.1.7 (Claude Code)`, "-v, --version", "Output the version number")

// READABLE (for understanding):
const commander = new CommanderCommand().configureHelp(customHelpFormatter());
commander.name("claude")
  .description("Claude Code - starts an interactive session by default, use -p/--print for non-interactive output")
  .argument("[prompt]", "Your prompt", String)  // Optional positional argument
  .helpOption("-h, --help", "Display help for command")
  .version(`2.1.7 (Claude Code)`, "-v, --version", "Output the version number")

// Mapping: Q→commander, O$1→CommanderCommand, A→customHelpFormatter
```

### Custom Help Formatter

```javascript
// ============================================
// customHelpFormatter - Alphabetically sorted help output
// Location: chunks.157.mjs:6-14
// ============================================

// ORIGINAL (for source lookup):
function A() {
  let X = (I) => I.long?.replace(/^--/, "") ?? I.short?.replace(/^-/, "") ?? "";
  return Object.assign({
    sortSubcommands: !0,
    sortOptions: !0
  }, {
    compareOptions: (I, D) => X(I).localeCompare(X(D))
  })
}

// READABLE (for understanding):
function customHelpFormatter() {
  const getOptionSortKey = (option) =>
    option.long?.replace(/^--/, "") ?? option.short?.replace(/^-/, "") ?? "";

  return Object.assign({
    sortSubcommands: true,
    sortOptions: true
  }, {
    compareOptions: (a, b) => getOptionSortKey(a).localeCompare(getOptionSortKey(b))
  });
}

// Mapping: A→customHelpFormatter, X→getOptionSortKey
```

---

## Complete Option Reference

### Option Categories Overview

| Category | Count | Purpose |
|----------|-------|---------|
| Debug & Output | 6 | Debugging, logging, verbosity |
| Input/Output Mode | 7 | Print mode, formats, streaming |
| Session Management | 8 | Continue, resume, fork, teleport |
| Model & Agent | 6 | Model selection, agents, fallback |
| System Prompts | 4 | Custom prompts, append prompts |
| Tool Configuration | 4 | Tool allow/deny lists, directories |
| Permission Control | 3 | Permission modes, bypass |
| MCP Configuration | 4 | Server configs, strict mode |
| Chrome Integration | 2 | Chrome extension flags (NEW) |
| Advanced | 10+ | Budget, turns, schemas, plugins |

---

## Category 1: Debug & Output Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `-d, --debug [filter]` | string/boolean | `false` | Enable debug mode with optional filter |
| `-d2e, --debug-to-stderr` | boolean | `false` | Write debug output to stderr (hidden) |
| `--verbose` | boolean | `false` | Enable verbose output |
| `--mcp-debug` | boolean | `false` | [DEPRECATED] MCP debugging |

```javascript
// ============================================
// debugOption - Debug mode with optional filter
// Location: chunks.157.mjs:21
// ============================================

// ORIGINAL (for source lookup):
.option("-d, --debug [filter]",
  'Enable debug mode with optional category filtering (e.g., "api,hooks" or "!statsig,!file")',
  (X) => { return !0 })
.addOption(new LK("-d2e, --debug-to-stderr", "Enable debug mode (to stderr)").argParser(Boolean).hideHelp())
.option("--verbose", "Override verbose mode setting from config", () => !0)
.option("--mcp-debug", "[DEPRECATED. Use --debug instead] Enable MCP debug mode (shows MCP server errors)", () => !0)

// Usage patterns:
// claude --debug              → debug = true (all output)
// claude --debug "tool:*"     → debug = "tool:*" (filtered)
// claude --debug "!statsig"   → debug = true, excludes statsig
// claude                      → debug = undefined (disabled)
```

---

## Category 2: Input/Output Mode Options

| Option | Type | Default | Description | Requires |
|--------|------|---------|-------------|----------|
| `-p, --print` | boolean | `false` | Non-interactive mode | - |
| `--output-format <format>` | enum | `"text"` | Output format | `--print` |
| `--input-format <format>` | enum | `"text"` | Input format | - |
| `--include-partial-messages` | boolean | `false` | Include partial stream messages | `--print`, `stream-json` |
| `--replay-user-messages` | boolean | `false` | Re-emit stdin messages in output | `stream-json` |
| `--json-schema <schema>` | string | - | Structured output schema | `--print` |
| `--enable-auth-status` | boolean | `false` | Enable auth status in SDK mode (hidden) |

**Output format values:**
- `text` - Plain text output (default)
- `json` - Complete JSON response at end
- `stream-json` - Streaming JSON chunks (NDJSON)

**Input format values:**
- `text` - Plain text input
- `stream-json` - Streaming JSON input (requires output stream-json)

```javascript
// ============================================
// ioModeOptions - Input/Output mode configuration
// Location: chunks.157.mjs:21-24
// ============================================

// ORIGINAL (for source lookup):
.option("-p, --print",
  "Print response and exit (useful for pipes). Note: The workspace trust dialog is skipped when Claude is run with the -p mode. Only use this flag in directories you trust.",
  () => !0)
.addOption(new LK("--output-format <format>",
  'Output format (only works with --print): "text" (default), "json" (single result), or "stream-json" (realtime streaming)')
  .choices(["text", "json", "stream-json"]))
.addOption(new LK("--input-format <format>",
  'Input format (only works with --print): "text" (default), or "stream-json" (realtime streaming input)')
  .choices(["text", "stream-json"]))
.option("--include-partial-messages",
  "Include partial message chunks as they arrive (only works with --print and --output-format=stream-json)",
  () => !0)
.addOption(new LK("--json-schema <schema>",
  'JSON Schema for structured output validation. Example: {"type":"object","properties":{"name":{"type":"string"}},"required":["name"]}')
  .argParser(String))
.option("--replay-user-messages",
  "Re-emit user messages from stdin back on stdout for acknowledgment (only works with --input-format=stream-json and --output-format=stream-json)",
  () => !0)
.addOption(new LK("--enable-auth-status", "Enable auth status messages in SDK mode").default(!1).hideHelp())

// Mapping: LK→CommanderOption
```

### Print Mode Validation

```javascript
// ============================================
// printModeValidation - Validate print mode option combinations
// Location: chunks.157.mjs:282-293
// ============================================

// ORIGINAL (for source lookup):
if (AA && AA !== "text" && AA !== "stream-json")
  console.error(`Error: Invalid input format "${AA}".`), process.exit(1);
if (AA === "stream-json" && f !== "stream-json")
  console.error("Error: --input-format=stream-json requires output-format=stream-json."), process.exit(1);
if (t) {
  if (AA !== "stream-json" || f !== "stream-json")
    console.error("Error: --sdk-url requires both --input-format=stream-json and --output-format=stream-json."), process.exit(1)
}
if (I.replayUserMessages) {
  if (AA !== "stream-json" || f !== "stream-json")
    console.error("Error: --replay-user-messages requires both --input-format=stream-json and --output-format=stream-json."), process.exit(1)
}
if (x) {
  if (!CA || f !== "stream-json")
    Tl("Error: --include-partial-messages requires --print and --output-format=stream-json."), process.exit(1)
}
if (I.sessionPersistence === !1 && !CA)
  Tl("Error: --no-session-persistence can only be used with --print mode."), process.exit(1);

// READABLE (for understanding):
// Input format validation
if (inputFormat && inputFormat !== "text" && inputFormat !== "stream-json") {
  console.error(`Error: Invalid input format "${inputFormat}".`);
  process.exit(1);
}

// stream-json input requires stream-json output
if (inputFormat === "stream-json" && outputFormat !== "stream-json") {
  console.error("Error: --input-format=stream-json requires output-format=stream-json.");
  process.exit(1);
}

// SDK URL requires stream-json both ways
if (sdkUrl) {
  if (inputFormat !== "stream-json" || outputFormat !== "stream-json") {
    console.error("Error: --sdk-url requires both --input-format=stream-json and --output-format=stream-json.");
    process.exit(1);
  }
}

// replay-user-messages requires stream-json both ways
if (parsedOptions.replayUserMessages) {
  if (inputFormat !== "stream-json" || outputFormat !== "stream-json") {
    console.error("Error: --replay-user-messages requires both --input-format=stream-json and --output-format=stream-json.");
    process.exit(1);
  }
}

// include-partial-messages requires print mode + stream-json output
if (includePartialMessages) {
  if (!isPrintMode || outputFormat !== "stream-json") {
    writeError("Error: --include-partial-messages requires --print and --output-format=stream-json.");
    process.exit(1);
  }
}

// no-session-persistence only works with print mode
if (parsedOptions.sessionPersistence === false && !isPrintMode) {
  writeError("Error: --no-session-persistence can only be used with --print mode.");
  process.exit(1);
}

// Mapping: AA→inputFormat, f→outputFormat, t→sdkUrl, x→includePartialMessages,
//          CA→isPrintMode, I→parsedOptions, Tl→writeError
```

---

## Category 3: Session Management Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `-c, --continue` | boolean | `false` | Continue most recent conversation |
| `-r, --resume [value]` | string/boolean | - | Resume by session ID or name |
| `--fork-session` | boolean | `false` | Create new ID when resuming |
| `--session-id <uuid>` | string | - | Use specific session ID |
| `--no-session-persistence` | boolean | `false` | Disable session persistence (print only) |
| `--resume-session-at <message-id>` | string | - | Resume to specific message (hidden) |
| `--rewind-files <user-message-id>` | string | - | Restore files to state (NEW, hidden) |

```javascript
// ============================================
// sessionOptions - Session management option group
// Location: chunks.157.mjs:21-27
// ============================================

// ORIGINAL (for source lookup):
.option("-c, --continue", "Continue the most recent conversation in the current directory", () => !0)
.option("-r, --resume [value]",
  "Resume a conversation by session ID, or open interactive picker with optional search term",
  (X) => X || !0)
.option("--fork-session",
  "When resuming, create a new session ID instead of reusing the original (use with --resume or --continue)",
  () => !0)
.option("--no-session-persistence",
  "Disable session persistence - sessions will not be saved to disk and cannot be resumed (only works with --print)")
.addOption(new LK("--resume-session-at <message id>",
  "When resuming, only messages up to and including the assistant message with <message.id> (use with --resume in print mode)")
  .argParser(String).hideHelp())
.addOption(new LK("--rewind-files <user-message-id>",
  "Restore files to state at the specified user message and exit (requires --resume)")
  .hideHelp())
.option("--session-id <uuid>",
  "Use a specific session ID for the conversation (must be a valid UUID)")

// READABLE (for understanding):
.option("-c, --continue", "Continue the most recent conversation", () => true)
.option("-r, --resume [value]",
  "Resume by session ID or name, or open picker with optional search",
  (value) => value || true)  // Returns string if provided, true if just flag
.option("--fork-session",
  "When resuming, create new session ID (use with --resume or --continue)",
  () => true)
.option("--no-session-persistence",
  "Disable session persistence - won't save or allow resume (--print only)")
.addOption(new CommanderOption("--resume-session-at <message id>",
  "Resume to specific message (--resume in print mode)")
  .argParser(String).hideHelp())
.addOption(new CommanderOption("--rewind-files <user-message-id>",
  "Restore files to state at message and exit (requires --resume)")
  .hideHelp())
.option("--session-id <uuid>",
  "Use specific session ID (must be valid UUID)")

// Mapping: LK→CommanderOption
```

### Session ID Validation

```javascript
// ============================================
// sessionIdValidation - Validate --session-id combinations
// Location: chunks.157.mjs:77-85
// ============================================

// ORIGINAL (for source lookup):
if (j) {
  if ((I.continue || I.resume) && !I.forkSession)
    process.stderr.write(I1.red(`Error: --session-id can only be used with --continue or --resume if --fork-session is also specified.\n`)),
    process.exit(1);
  let PQ = BU(j);
  if (!PQ)
    process.stderr.write(I1.red(`Error: Invalid session ID. Must be a valid UUID.\n`)),
    process.exit(1);
  if (bJ9(PQ))
    process.stderr.write(I1.red(`Error: Session ID ${PQ} is already in use.\n`)),
    process.exit(1)
}

// Validation rules:
// 1. --session-id with --continue/--resume requires --fork-session
// 2. Session ID must be valid UUID format
// 3. Session ID must not already be in use
```

---

## Category 4: Model & Agent Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--model <model>` | string | - | Model alias or full name |
| `--fallback-model <model>` | string | - | Auto-fallback model when overloaded |
| `--agent <agent>` | string | - | Override default agent |
| `--agents <json>` | string | - | Define custom agents JSON |
| `--betas <betas...>` | string[] | `[]` | Beta headers for API requests |
| `--max-thinking-tokens <tokens>` | number | - | Extended thinking token limit (hidden) |

```javascript
// ============================================
// modelOptions - Model and agent configuration
// Location: chunks.157.mjs:21-27
// ============================================

// ORIGINAL (for source lookup):
.option("--model <model>",
  "Model for the current session. Provide an alias for the latest model (e.g. 'sonnet' or 'opus') or a model's full name (e.g. 'claude-sonnet-4-5-20250929').")
.option("--fallback-model <model>",
  "Enable automatic fallback to specified model when default model is overloaded (only works with --print)")
.option("--agent <agent>",
  "Agent for the current session. Overrides the 'agent' setting.")
.option("--agents <json>",
  `JSON object defining custom agents (e.g. '{"reviewer": {"description": "Reviews code", "prompt": "You are a code reviewer"}}')`)
.option("--betas <betas...>",
  "Beta headers to include in API requests (API key users only)")
.addOption(new LK("--max-thinking-tokens <tokens>",
  "Maximum number of thinking tokens. (only works with --print)")
  .argParser(Number).hideHelp())

// Model alias examples: sonnet, opus, haiku
// Full model name: claude-sonnet-4-5-20250929, claude-opus-4-5-20251101
```

### Fallback Model Validation

```javascript
// ============================================
// fallbackModelValidation - Prevent same model as fallback
// Location: chunks.157.mjs:87-89
// ============================================

// ORIGINAL (for source lookup):
if (L && I.model && L === I.model)
  process.stderr.write(I1.red(`Error: Fallback model cannot be the same as the main model. Please specify a different model for --fallback-model.\n`)),
  process.exit(1);

// Mapping: L→fallbackModel, I→parsedOptions, I1→chalk
```

---

## Category 5: System Prompt Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--system-prompt <prompt>` | string | - | Override system prompt entirely |
| `--system-prompt-file <file>` | string | - | Load system prompt from file (hidden) |
| `--append-system-prompt <prompt>` | string | - | Append to default system prompt |
| `--append-system-prompt-file <file>` | string | - | Load and append from file (hidden) |

```javascript
// ============================================
// systemPromptOptions - System prompt configuration
// Location: chunks.157.mjs:21-27
// ============================================

// ORIGINAL (for source lookup):
.addOption(new LK("--system-prompt <prompt>",
  "System prompt to use for the session")
  .argParser(String))
.addOption(new LK("--system-prompt-file <file>",
  "Read system prompt from a file")
  .argParser(String).hideHelp())
.addOption(new LK("--append-system-prompt <prompt>",
  "Append a system prompt to the default system prompt")
  .argParser(String))
.addOption(new LK("--append-system-prompt-file <file>",
  "Read system prompt from a file and append to the default system prompt")
  .argParser(String).hideHelp())

// READABLE (for understanding):
// Mutual exclusion: --system-prompt and --system-prompt-file cannot be used together
// Similarly: --append-system-prompt and --append-system-prompt-file
// But: --system-prompt CAN be combined with --append-system-prompt
```

### System Prompt Loading

```javascript
// ============================================
// systemPromptLoading - Load and validate system prompts
// Location: chunks.157.mjs:89-116
// ============================================

// ORIGINAL (for source lookup):
let FA = I.systemPrompt;
if (I.systemPromptFile) {
  if (I.systemPrompt)
    process.stderr.write(I1.red(`Error: Cannot use both --system-prompt and --system-prompt-file. Please use only one.\n`)),
    process.exit(1);
  try {
    let PQ = Ny0(I.systemPromptFile);
    if (!XU1(PQ))
      process.stderr.write(I1.red(`Error: System prompt file not found: ${PQ}\n`)),
      process.exit(1);
    FA = HL9(PQ, "utf8")
  } catch (PQ) {
    process.stderr.write(I1.red(`Error reading system prompt file: ${PQ instanceof Error?PQ.message:String(PQ)}\n`)),
    process.exit(1)
  }
}

// Similar logic for append-system-prompt and append-system-prompt-file

// Mapping: FA→systemPrompt, Ny0→resolvePath, XU1→fileExists, HL9→readFileSync
```

---

## Category 6: Tool Configuration Options

| Option | Type | Default | Description | Mode |
|--------|------|---------|-------------|------|
| `--tools <tools...>` | string[] | - | Specify built-in tool set | `--print` |
| `--allowedTools <tools...>` | string[] | `[]` | Whitelist additional tools | all |
| `--disallowedTools <tools...>` | string[] | `[]` | Blacklist tools | all |
| `--add-dir <directories...>` | string[] | `[]` | Additional allowed directories |

```javascript
// ============================================
// toolOptions - Tool filtering configuration
// Location: chunks.157.mjs:21-27
// ============================================

// ORIGINAL (for source lookup):
.option("--tools <tools...>",
  'Specify the list of available tools from the built-in set. Use "" to disable all tools, "default" to use all tools, or specify tool names (e.g. "Bash,Edit,Read").')
.option("--allowedTools, --allowed-tools <tools...>",
  'Comma or space-separated list of tool names to allow (e.g. "Bash(git:*) Edit")')
.option("--disallowedTools, --disallowed-tools <tools...>",
  'Comma or space-separated list of tool names to deny (e.g. "Bash(git:*) Edit")')
.option("--add-dir <directories...>",
  "Additional directories to allow tool access to")

// Tool pattern examples:
// - "Bash" - Allow/deny all Bash tool usage
// - "Bash(git:*)" - Allow/deny Bash for git commands only
// - "Bash(npm *)" - Allow/deny Bash for npm commands
// - "mcp__server__*" - Wildcard for MCP server tools
// - "Task(AgentName)" - Allow/deny specific agent
```

---

## Category 7: Permission Control Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--dangerously-skip-permissions` | boolean | `false` | Bypass all permission checks |
| `--allow-dangerously-skip-permissions` | boolean | `false` | Enable bypass as an option |
| `--permission-mode <mode>` | enum | - | Permission mode selection |

**Permission mode values:** (from `NP` constant)
- `default` - Standard permission handling
- `bypassPermissions` - Skip all permission prompts
- `plan` - Planning mode with limited permissions

```javascript
// ============================================
// permissionOptions - Permission control configuration
// Location: chunks.157.mjs:21-27
// ============================================

// ORIGINAL (for source lookup):
.option("--dangerously-skip-permissions",
  "Bypass all permission checks. Recommended only for sandboxes with no internet access.",
  () => !0)
.option("--allow-dangerously-skip-permissions",
  "Enable bypassing all permission checks as an option, without it being enabled by default. Recommended only for sandboxes with no internet access.",
  () => !0)
.addOption(new LK("--permission-mode <mode>",
  "Permission mode to use for the session")
  .argParser(String).choices(NP))

// Mapping: NP→permissionModeChoices
```

### Permission Mode Resolution

```javascript
// ============================================
// resolvePermissionMode - Determine effective permission mode
// Location: chunks.157.mjs:151-155
// ============================================

// ORIGINAL (for source lookup):
let {
  mode: mA,
  notification: G1
} = HJ9({
  permissionModeCli: $,
  dangerouslySkipPermissions: K
});
Bf0(mA === "bypassPermissions");

// READABLE (for understanding):
const { mode, notification } = resolvePermissionMode({
  permissionModeCli: permissionModeArg,
  dangerouslySkipPermissions: dangerouslySkipPermissionsFlag
});
setBypassMode(mode === "bypassPermissions");

// Returns:
// - mode: "default" | "bypassPermissions" | "plan"
// - notification: Warning message to display (if any)

// Mapping: HJ9→resolvePermissionMode, mA→mode, G1→notification,
//          $→permissionModeArg, K→dangerouslySkipPermissionsFlag, Bf0→setBypassMode
```

---

## Category 8: MCP Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--mcp-config <configs...>` | string[] | `[]` | Load MCP servers from JSON files or strings |
| `--strict-mcp-config` | boolean | `false` | Only use MCP servers from --mcp-config |
| `--permission-prompt-tool <tool>` | string | - | MCP tool for permission prompts (hidden) |

```javascript
// ============================================
// mcpOptions - MCP server configuration
// Location: chunks.157.mjs:21-27
// ============================================

// ORIGINAL (for source lookup):
.option("--mcp-config <configs...>",
  "Load MCP servers from JSON files or strings (space-separated)")
.option("--strict-mcp-config",
  "Only use MCP servers from --mcp-config, ignoring all other MCP configurations",
  () => !0)
.addOption(new LK("--permission-prompt-tool <tool>",
  "MCP tool to use for permission prompts (only works with --print)")
  .argParser(String).hideHelp())

// MCP config can be:
// 1. Path to JSON file: --mcp-config ./mcp-servers.json
// 2. Inline JSON: --mcp-config '{"mcpServers": {"server1": {...}}}'
// 3. Multiple configs: --mcp-config file1.json file2.json
```

### MCP Config Loading Algorithm

```javascript
// ============================================
// mcpConfigLoading - Parse and merge MCP configurations
// Location: chunks.157.mjs:157-207
// ============================================

// ORIGINAL (for source lookup):
let J1 = {};
if (z && z.length > 0) {
  let PQ = z.map((Y6) => Y6.trim()).filter((Y6) => Y6.length > 0),
    z2 = {},
    w4 = [];
  for (let Y6 of PQ) {
    let eB = null,
      L4 = [],
      L5 = c5(Y6);  // Try parse as JSON
    if (L5) {
      let B8 = efA({ configObject: L5, filePath: "command line", expandVars: !0, scope: "dynamic" });
      if (B8.config) eB = B8.config.mcpServers;
      else L4 = B8.errors
    } else {
      let B8 = Ny0(Y6),  // Resolve as file path
        F6 = dEA({ filePath: B8, expandVars: !0, scope: "dynamic" });
      if (F6.config) eB = F6.config.mcpServers;
      else L4 = F6.errors
    }
    if (L4.length > 0) w4.push(...L4);
    else if (eB) z2 = { ...z2, ...eB }
  }
  if (w4.length > 0) {
    let Y6 = w4.map((eB) => `${eB.path?eB.path+": ":""}${eB.message}`).join(`\n`);
    throw Error(`Invalid MCP configuration:\n${Y6}`)
  }
  if (Object.keys(z2).length > 0) {
    let Y6 = I1A(z2, (eB) => ({ ...eB, scope: "dynamic" }));
    J1 = { ...J1, ...Y6 }
  }
}

// Algorithm:
// 1. Filter and trim config entries
// 2. For each entry: try JSON parse, else treat as file path
// 3. Validate and extract mcpServers
// 4. Collect all errors for batch reporting
// 5. Merge servers with scope: "dynamic"
// 6. Throw if any errors occurred

// Mapping: J1→dynamicMcpConfig, z→mcpConfigArgs, c5→tryParseJSON,
//          efA→validateMcpConfig, Ny0→resolvePath, dEA→loadMcpConfigFile,
//          I1A→mapValues
```

---

## Category 9: Chrome Integration Options (NEW in 2.0.72)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--chrome` | boolean | - | Enable Claude in Chrome integration |
| `--no-chrome` | boolean | - | Disable Claude in Chrome integration |

```javascript
// ============================================
// chromeOptions - Chrome extension integration
// Location: chunks.157.mjs:21-27
// ============================================

// ORIGINAL (for source lookup):
.option("--chrome", "Enable Claude in Chrome integration")
.option("--no-chrome", "Disable Claude in Chrome integration")

// Chrome integration provides:
// - Browser page access via MCP tools
// - Tab management and navigation
// - Screenshot capture
// - Page content extraction
```

---

## Category 10: Advanced Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--max-turns <turns>` | number | - | Maximum agentic turns (print only, hidden) |
| `--max-budget-usd <amount>` | number | - | Maximum dollar spend (print only) |
| `--settings <file-or-json>` | string | - | Load additional settings |
| `--ide` | boolean | `false` | Auto-connect to IDE if available |
| `--plugin-dir <paths...>` | string[] | `[]` | Load plugins from directories (NEW) |
| `--disable-slash-commands` | boolean | `false` | Disable all skills |
| `--setting-sources <sources>` | string | - | Comma-separated setting sources (NEW) |

```javascript
// ============================================
// advancedOptions - Advanced configuration
// Location: chunks.157.mjs:21-27
// ============================================

// ORIGINAL (for source lookup):
.addOption(new LK("--max-turns <turns>",
  "Maximum number of agentic turns in non-interactive mode. This will early exit the conversation after the specified number of turns. (only works with --print)")
  .argParser(Number).hideHelp())
.addOption(new LK("--max-budget-usd <amount>",
  "Maximum dollar amount to spend on API calls (only works with --print)")
  .argParser((X) => {
    let I = Number(X);
    if (isNaN(I) || I <= 0) throw Error("--max-budget-usd must be a positive number greater than 0");
    return I
  }))
.option("--settings <file-or-json>",
  "Path to a settings JSON file or a JSON string to load additional settings from")
.option("--ide",
  "Automatically connect to IDE on startup if exactly one valid IDE is available",
  () => !0)
.option("--plugin-dir <paths...>",
  "Load plugins from directories for this session only (repeatable)")
.option("--disable-slash-commands",
  "Disable all skills",
  () => !0)
.option("--setting-sources <sources>",
  "Comma-separated list of setting sources to load (user, project, local).")

// Setting sources: user, project, local
// Example: --setting-sources "user,project"
```

---

## Hidden Options

| Option | Type | Description |
|--------|------|-------------|
| `--sdk-url <url>` | string | WebSocket endpoint for SDK I/O streaming |
| `--teleport [session]` | string/boolean | Resume teleport session |
| `--remote <description>` | string | Create remote session with description |
| `--loopy [interval]` | boolean/number | Enable autonomous agent mode |

```javascript
// ============================================
// hiddenOptions - Internal and experimental options
// Location: chunks.157.mjs:792
// ============================================

// ORIGINAL (for source lookup):
Q.addOption(new LK("--sdk-url <url>",
  "Use remote WebSocket endpoint for SDK I/O streaming (only with -p and stream-json format)")
  .hideHelp())
Q.addOption(new LK("--teleport [session]",
  "Resume a teleport session, optionally specify session ID")
  .hideHelp())
Q.addOption(new LK("--remote <description>",
  "Create a remote session with the given description")
  .hideHelp())
```

---

### Loopy Mode (Autonomous Agent) Deep Analysis

**What it does:** Enables an autonomous agent mode where Claude continuously operates on tasks without waiting for user input.

**How it works:**

```javascript
// ============================================
// loopyMode - Autonomous agent configuration
// Location: chunks.157.mjs:55-58
// ============================================

// ORIGINAL (for source lookup):
let p = I.loopy,
  GA = void 0,
  WA = GA ? /^\d+$/.test(GA) ? Number(GA) : a1(GA) : void 0,
  MA = p ?? WA,
  TA = MA !== void 0 && MA !== !1,
  bA = TA ? typeof MA === "number" ? MA : 0 : void 0;

if (TA) {
  process.env.CLAUDE_CODE_LOOPY_MODE = "true",
  l("tengu_loopy_mode_started", {
    interval_ms: bA
  });
}

// READABLE (for understanding):
const loopyArg = parsedOptions.loopy;
const envLoopy = undefined; // Can also be set via env
const envLoopyMs = envLoopy
  ? /^\d+$/.test(envLoopy)
    ? Number(envLoopy)
    : parseTime(envLoopy)
  : undefined;

const loopyValue = loopyArg ?? envLoopyMs;
const loopyEnabled = loopyValue !== undefined && loopyValue !== false;
const loopyIntervalMs = loopyEnabled
  ? typeof loopyValue === "number"
    ? loopyValue
    : 0  // Default: no interval
  : undefined;

if (loopyEnabled) {
  // Set environment flag for other parts of code
  process.env.CLAUDE_CODE_LOOPY_MODE = "true";

  // Track telemetry
  trackEvent("tengu_loopy_mode_started", {
    interval_ms: loopyIntervalMs
  });
}

// Mapping: p→loopyArg, GA→envLoopy, WA→envLoopyMs, MA→loopyValue,
//          TA→loopyEnabled, bA→loopyIntervalMs, a1→parseTime
```

**Loopy mode characteristics:**
1. **Environment flag:** Sets `CLAUDE_CODE_LOOPY_MODE=true`
2. **Interval support:** Can specify tick interval in milliseconds
3. **[Tick] prompts:** When idle, receives periodic tick prompts to continue working
4. **Autonomous execution:** Claude owns tasks end-to-end without user intervention

**Usage:**
```bash
# Enable loopy mode (default interval)
claude --loopy --print "Complete this project"

# Enable with specific interval (5 seconds)
claude --loopy 5000 --print "Monitor and respond to changes"
```

---

### SDK URL Streaming Mode Deep Analysis

**What it does:** Enables bidirectional streaming communication via WebSocket for SDK integration.

**How it works:**

```javascript
// ============================================
// sdkUrlMode - SDK WebSocket streaming setup
// Location: chunks.157.mjs:68-74
// ============================================

// ORIGINAL (for source lookup):
let t = I.sdkUrl ?? void 0;
if (t) {
  if (!AA) AA = "stream-json";    // Auto-set input format
  if (!f) f = "stream-json";       // Auto-set output format
  if (I.verbose === void 0) n = !0; // Auto-enable verbose
  if (!I.print) y = !0              // Auto-enable print mode
}

// READABLE (for understanding):
const sdkUrl = parsedOptions.sdkUrl ?? undefined;

if (sdkUrl) {
  // Auto-configure for SDK streaming mode
  if (!inputFormat) inputFormat = "stream-json";
  if (!outputFormat) outputFormat = "stream-json";
  if (parsedOptions.verbose === undefined) verbose = true;
  if (!parsedOptions.print) isPrintMode = true;
}

// Mapping: t→sdkUrl, AA→inputFormat, f→outputFormat, n→verbose, y→isPrintMode
```

**SDK URL transport creation (chunks.156.mjs:78):**

```javascript
// ORIGINAL:
return Q.sdkUrl ? new Fy0(Q.sdkUrl, B, Q.replayUserMessages) : new wmA(B, Q.replayUserMessages)

// READABLE:
return options.sdkUrl
  ? new WebSocketTransport(options.sdkUrl, streamHandler, options.replayUserMessages)
  : new StdioTransport(streamHandler, options.replayUserMessages);
```

**Key behaviors:**
1. **Auto-configuration:** Automatically sets `stream-json` for both input and output
2. **Verbose by default:** Enables verbose mode for SDK debugging
3. **Print mode required:** Forces non-interactive mode
4. **Validation:** Requires both input and output formats to be `stream-json`
5. **Replay support:** Can replay user messages back for acknowledgment

**Usage:**
```bash
# Connect to WebSocket SDK endpoint
claude --sdk-url wss://api.example.com/claude --print "Hello"

# With explicit replay
claude --sdk-url wss://api.example.com/claude --replay-user-messages --print "Task"
```

---

## Configuration Merge Order

Settings are loaded and merged in this priority order (highest priority last):

| Priority | Source | Description |
|----------|--------|-------------|
| 1 (lowest) | Built-in defaults | Hardcoded defaults |
| 2 | User settings | ~/.claude/settings.json |
| 3 | Project settings | .claude/settings.json |
| 4 | Local settings | .claude/settings.local.json |
| 5 | Environment variables | ANTHROPIC_*, CLAUDE_* |
| 6 (highest) | CLI flags | Command line arguments |

---

## Subcommands

### mcp Subcommand

```javascript
// ============================================
// mcpSubcommand - MCP server management
// Location: chunks.157.mjs:793-956
// ============================================

// ORIGINAL (for source lookup):
let B = Q.command("mcp")
  .description("Configure and manage MCP servers")
  .helpOption("-h, --help", "Display help for command")
  .configureHelp(A())
  .enablePositionalOptions();

// Subcommands:
// - mcp serve          Start the Claude Code MCP server
// - mcp list           List configured MCP servers
// - mcp get <name>     Get details about an MCP server
// - mcp add-json       Add an MCP server with JSON string
// - mcp add-from-claude-desktop  Import from Claude Desktop
// - mcp remove <name>  Remove an MCP server
// - mcp reset-project-choices  Reset .mcp.json approvals
```

### plugin Subcommand

```javascript
// ============================================
// pluginSubcommand - Plugin management
// Location: chunks.157.mjs:961-1096
// ============================================

// ORIGINAL (for source lookup):
let Z = Q.command("plugin")
  .description("Manage Claude Code plugins")
  .helpOption("-h, --help", "Display help for command")
  .configureHelp(A());

// Subcommands:
// - plugin validate <path>    Validate a plugin manifest
// - plugin install <plugin>   Install from marketplace
// - plugin uninstall <plugin> Remove an installed plugin
// - plugin enable <plugin>    Enable a disabled plugin
// - plugin disable <plugin>   Disable an enabled plugin
// - plugin update <plugin>    Update to latest version

// Nested: plugin marketplace
// - marketplace add <source>    Add a marketplace
// - marketplace list            List all marketplaces
// - marketplace remove <name>   Remove a marketplace
// - marketplace update [name]   Update marketplace(s)
```

### Other Subcommands

```javascript
// ============================================
// otherSubcommands - Utility commands
// Location: chunks.157.mjs:1097-1152
// ============================================

// setup-token: Set up long-lived OAuth token
Q.command("setup-token")
  .description("Set up a long-lived authentication token (requires Claude subscription)")
  .action(async () => { /* ... */ });

// doctor: Health check
Q.command("doctor")
  .description("Check the health of your Claude Code auto-updater")
  .action(async () => { /* ... */ });

// update: Version check
Q.command("update")
  .description("Check for updates and install if available")
  .action(mw9);

// install: Native build installation
Q.command("install [target]")
  .description("Install Claude Code native build. Use [target] to specify version (stable, latest, or specific version)")
  .option("--force", "Force installation even if already installed")
  .action(async (X, I) => { /* ... */ });
```

---

## Version Differences from 2.0.59

### New Options in 2.1.7

| Option | Added Version | Category |
|--------|---------------|----------|
| `--chrome` | 2.0.72 | Chrome Integration |
| `--no-chrome` | 2.0.72 | Chrome Integration |
| `--plugin-dir` | 2.1.0 | Advanced |
| `--setting-sources` | 2.1.x | Advanced |
| `--rewind-files` | 2.1.x | Session Management |
| `--enable-auth-status` | 2.1.x | Input/Output |

### Modified Behavior

| Option | Change | Version |
|--------|--------|---------|
| `--resume` | Now supports named sessions | 2.0.64 |
| `--mcp-debug` | Marked deprecated | 2.0.x |
| `--session-id` | Now requires --fork-session with --continue/--resume | 2.1.x |

---

## Error Messages Reference

| Condition | Error Message |
|-----------|---------------|
| Invalid input format | `Error: Invalid input format "${format}".` |
| stream-json input without output | `Error: --input-format=stream-json requires output-format=stream-json.` |
| SDK URL format mismatch | `Error: --sdk-url requires both --input-format=stream-json and --output-format=stream-json.` |
| Session ID conflict | `Error: --session-id can only be used with --continue or --resume if --fork-session is also specified.` |
| Invalid UUID | `Error: Invalid session ID. Must be a valid UUID.` |
| Session ID in use | `Error: Session ID ${id} is already in use.` |
| Same fallback model | `Error: Fallback model cannot be the same as the main model.` |
| System prompt conflict | `Error: Cannot use both --system-prompt and --system-prompt-file.` |
| Enterprise MCP restriction | `You cannot use --strict-mcp-config when an enterprise MCP config is present` |
