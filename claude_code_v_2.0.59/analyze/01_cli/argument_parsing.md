# CLI Argument Parsing

## Overview

Claude Code v2.0.59 uses a custom Commander.js-based framework for CLI argument parsing. The system supports 35+ options across multiple categories, extensive subcommand trees, and sophisticated option validation with conflict detection.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

Key components in this document:
- `Command` (pK0) - Commander.js Command class implementation
- `Option` (Oz9) - CLI option definition class
- `Argument` (gf3) - CLI argument definition class
- `commandHandler` (hu3) - Main command setup with all options
- `resolvePermissionMode` (SE9) - Permission mode resolver
- `initToolPermissionContext` (_E9) - Tool permission initializer
- `parseInteger` (custom) - Integer option validator
- `parseBoolean` (Y0) - Boolean environment variable parser

---

## Commander.js Implementation

### Command Class Architecture

```javascript
// ============================================
// Command - CLI command definition and execution
// Location: chunks.155.mjs:26-500
// ============================================

// ORIGINAL (for source lookup):
class pK0 extends hf3 {
  constructor(A) {
    super();
    this.commands = [];
    this.options = [];
    this.parent = null;
    this._allowUnknownOption = !1;
    this._allowExcessArguments = !0;
    this.registeredArguments = [];
    this._args = this.registeredArguments;
    this.args = [];
    this.rawArgs = [];
    this.processedArgs = [];
    this._scriptPath = null;
    this._name = A || "";
    this._optionValues = {};
    this._optionValueSources = {};
    this._storeOptionsAsProperties = !1;
    this._actionHandler = null;
    this._executableHandler = !1;
    this._executableFile = null;
    this._executableDir = null;
    this._defaultCommandName = null;
    this._exitCallback = null;
    this._aliases = [];
    this._combineFlagAndOptionalValue = !0;
    this._description = "";
    this._summary = "";
    this._argsDescription = void 0;
    this._enablePositionalOptions = !1;
    this._passThroughOptions = !1;
    this._lifeCycleHooks = {};
    // ...
  }
}

// READABLE (for understanding):
class Command extends EventEmitter {
  constructor(name) {
    super();

    // Command tree structure
    this.commands = [];              // Subcommands
    this.options = [];               // Registered options
    this.parent = null;              // Parent command reference

    // Parsing configuration
    this._allowUnknownOption = false;
    this._allowExcessArguments = true;

    // Arguments
    this.registeredArguments = [];   // Defined arguments
    this._args = this.registeredArguments;  // Alias
    this.args = [];                  // Parsed argument values
    this.rawArgs = [];               // Raw process.argv
    this.processedArgs = [];         // Processed argument values

    // Command metadata
    this._scriptPath = null;
    this._name = name || "";
    this._description = "";
    this._summary = "";

    // Option values storage
    this._optionValues = {};         // Parsed option values
    this._optionValueSources = {};   // Where value came from (cli, env, default)
    this._storeOptionsAsProperties = false;

    // Action handlers
    this._actionHandler = null;      // Main action function
    this._executableHandler = false; // External executable mode
    this._executableFile = null;     // Executable path
    this._executableDir = null;      // Executable directory

    // Lifecycle
    this._lifeCycleHooks = {};       // preSubcommand, preAction, postAction
    this._exitCallback = null;       // Custom exit handler
  }
}

// Mapping: pK0→Command, hf3→EventEmitter, A→name
```

### Main Command Configuration

```javascript
// ============================================
// mainCommandSetup - Claude CLI main command definition
// Location: chunks.158.mjs:3-20
// ============================================

// ORIGINAL (for source lookup):
let A = new fJ1;
A.name("claude")
  .description("Claude Code - starts an interactive session by default, use -p/--print for non-interactive output")
  .argument("[prompt]", "Your prompt", String)
  .helpOption("-h, --help", "Display help for command")
  .version(`2.0.59 (Claude Code)`, "-v, --version", "Output the version number")

// READABLE (for understanding):
const commander = new CommanderInstance();
commander.name("claude")
  .description("Claude Code - starts an interactive session by default, use -p/--print for non-interactive output")
  .argument("[prompt]", "Your prompt", String)  // Optional positional argument
  .helpOption("-h, --help", "Display help for command")
  .version(`2.0.59 (Claude Code)`, "-v, --version", "Output the version number")

// Mapping: A→commander, fJ1→CommanderInstance
```

### Option Registration

```javascript
// ============================================
// _optionEx - Core option creation and registration
// Location: chunks.155.mjs:219-231
// ============================================

// ORIGINAL (for source lookup):
_optionEx(A, Q, B, G, Z) {
  if (typeof Q === "object" && Q instanceof Oz9)
    throw Error("To add an Option object use addOption() instead of option() or requiredOption()");
  let I = this.createOption(Q, B);
  if (I.makeOptionMandatory(!!A.mandatory), typeof G === "function")
    I.default(Z).argParser(G);
  else if (G instanceof RegExp) {
    let Y = G;
    G = (J, W) => {
      let X = Y.exec(J);
      return X ? X[0] : W
    };
    I.default(Z).argParser(G)
  } else I.default(G);
  return this.addOption(I)
}

// READABLE (for understanding):
function createAndRegisterOption(config, flagSpec, description, parser, defaultValue) {
  // Prevent passing Option instance directly
  if (typeof flagSpec === "object" && flagSpec instanceof Option) {
    throw Error("To add an Option object use addOption() instead");
  }

  // Create option from flag specification
  const option = this.createOption(flagSpec, description);

  // Mark as mandatory if configured
  option.makeOptionMandatory(!!config.mandatory);

  // Configure value parsing
  if (typeof parser === "function") {
    // Custom parser function
    option.default(defaultValue).argParser(parser);
  } else if (parser instanceof RegExp) {
    // Regex-based parser
    const regex = parser;
    const regexParser = (value, previous) => {
      const match = regex.exec(value);
      return match ? match[0] : previous;
    };
    option.default(defaultValue).argParser(regexParser);
  } else {
    // Direct default value (no parser)
    option.default(parser);
  }

  return this.addOption(option);
}

// Mapping: A→config, Q→flagSpec, B→description, G→parser, Z→defaultValue,
//          I→option, Oz9→Option
```

---

## Complete Option Reference

### Option Categories Overview

| Category | Count | Purpose |
|----------|-------|---------|
| Debug & Output | 5 | Debugging, logging, verbosity |
| Input/Output Mode | 6 | Print mode, formats, streaming |
| Session Management | 6 | Continue, resume, fork, teleport |
| Model & Agent | 5 | Model selection, agents, fallback |
| System Prompts | 4 | Custom prompts, append prompts |
| Tool Configuration | 4 | Tool allow/deny lists |
| Permission Control | 3 | Permission modes, bypass |
| MCP Configuration | 3 | Server configs, strict mode |
| Advanced | 10 | Budget, turns, schemas, plugins |

### Debug & Output Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `-d, --debug [filter]` | string/boolean | `false` | Enable debug mode with optional filter |
| `--debug-to-stderr` | boolean | `false` | Write debug output to stderr (hidden) |
| `-v, --verbose` | boolean | `false` | Enable verbose output |
| `--mcp-debug` | boolean | `false` | Enable MCP debugging (deprecated) |
| `-q, --quiet` | boolean | `false` | Suppress non-essential output |

```javascript
// ============================================
// debugOption - Debug mode with optional filter
// Location: chunks.158.mjs:11
// ============================================

// ORIGINAL (for source lookup):
.option("-d, --debug [filter]",
  'Enable debug mode with optional category filtering (e.g., "api,hooks" or "!statsig,!file")',
  (Y) => true)

// READABLE (for understanding):
.option(
  "-d, --debug [filter]",
  'Enable debug mode with optional category filtering (e.g., "api,hooks" or "!statsig,!file")',
  (value) => true  // Parser returns true when flag is present
)

// Usage patterns:
// claude --debug              → debug = true (all output)
// claude --debug "tool:*"     → debug = "tool:*" (filtered)
// claude                      → debug = undefined (disabled)

// Mapping: Y→value
```

### Input/Output Mode Options

| Option | Type | Default | Description | Requires |
|--------|------|---------|-------------|----------|
| `-p, --print` | boolean | `false` | Non-interactive mode | - |
| `--output-format <format>` | enum | `"text"` | Output format | `--print` |
| `--input-format <format>` | enum | `"text"` | Input format | - |
| `--include-partial-messages` | boolean | `false` | Include partial stream messages | `--print` |
| `--replay-user-messages` | boolean | `false` | Re-emit stdin messages in output | `--print` |
| `--json-schema <schema>` | string | - | Structured output schema | `--print` |

**Output format values:**
- `text` - Plain text output (default)
- `json` - Complete JSON response at end
- `stream-json` - Streaming JSON chunks (NDJSON)

**Input format values:**
- `text` - Plain text input
- `stream-json` - Streaming JSON input (requires output stream-json)

```javascript
// ============================================
// outputFormatOption - Output format selection with validation
// Location: chunks.158.mjs:14-16
// ============================================

// ORIGINAL (for source lookup):
.addOption(new BF("--output-format <format>",
  'Output format (only works with --print): "text" (default), "json" (single result), or "stream-json" (realtime streaming)')
  .choices(["text", "json", "stream-json"]))

// READABLE (for understanding):
.addOption(new Option(
  "--output-format <format>",
  'Output format (only works with --print): "text" (default), "json" (single result), or "stream-json" (realtime streaming)'
).choices(["text", "json", "stream-json"]))

// Mapping: BF→Option
```

```javascript
// ============================================
// printModeOption - Non-interactive execution mode
// Location: chunks.158.mjs:12
// ============================================

// ORIGINAL (for source lookup):
.option("-p, --print",
  "Print response and exit (useful for pipes). Note: The workspace trust dialog is skipped when Claude is run with the -p mode. Only use this flag in directories you trust.",
  () => true)

// READABLE (for understanding):
.option(
  "-p, --print",
  "Print response and exit (useful for pipes). Note: The workspace trust dialog is skipped in -p mode. Only use in trusted directories.",
  () => true  // Parser returns true when flag is present
)

// Key behavior:
// - Skips workspace trust dialog (security consideration)
// - Enables --output-format and --input-format options
// - Enables --tools option for explicit tool selection
// - Disables interactive UI components
```

### Session Management Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `-c, --continue` | boolean | `false` | Continue most recent conversation |
| `-r, --resume [value]` | string/boolean | - | Resume by session ID or search |
| `--fork-session` | boolean | `false` | Create new ID when resuming |
| `--resume-session-at <message-id>` | string | - | Resume to specific message (hidden) |
| `--session-id <uuid>` | string | - | Use specific session ID |
| `--teleport` | boolean | `false` | Cloud session synchronization (hidden) |

```javascript
// ============================================
// sessionOptions - Session management option group
// Location: chunks.158.mjs:17-22
// ============================================

// ORIGINAL (for source lookup):
.option("-c, --continue", "Continue the most recent conversation", () => true)
.option("-r, --resume [value]",
  "Resume a conversation by session ID, or open interactive picker with optional search term",
  (Y) => Y || true)
.option("--fork-session",
  "When resuming, create a new session ID instead of reusing the original (use with --resume or --continue)",
  () => true)
.option("--session-id <uuid>",
  "Use a specific session ID for the conversation (must be a valid UUID)")

// READABLE (for understanding):
.option("-c, --continue", "Continue the most recent conversation", () => true)
.option("-r, --resume [value]",
  "Resume by session ID, or open picker with optional search",
  (value) => value || true)  // Returns string if provided, true if just flag
.option("--fork-session",
  "When resuming, create new session ID (use with --resume or --continue)",
  () => true)
.option("--session-id <uuid>",
  "Use specific session ID (must be valid UUID)")

// Mapping: Y→value
```

### Model & Agent Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--model <model>` | string | - | Model alias or full name |
| `--fallback-model <model>` | string | - | Auto-fallback model when overloaded |
| `--agent <agent>` | string | - | Override default agent |
| `--agents <json>` | string | - | Define custom agents JSON |
| `--max-thinking-tokens <tokens>` | number | - | Extended thinking token limit (hidden) |

```javascript
// ============================================
// modelOptions - Model and agent configuration
// Location: chunks.158.mjs:24-30
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
.addOption(new BF("--max-thinking-tokens <tokens>",
  "Maximum number of thinking tokens. (only works with --print)")
  .argParser(Number)
  .hideHelp())

// READABLE (for understanding):
.option("--model <model>",
  "Model alias (sonnet, opus, haiku) or full name (claude-sonnet-4-5-20250929)")
.option("--fallback-model <model>",
  "Auto-fallback model when overloaded (only with --print)")
.option("--agent <agent>",
  "Agent override for current session")
.option("--agents <json>",
  'Custom agents JSON: {"name": {"description": "...", "prompt": "..."}}')
.addOption(new Option("--max-thinking-tokens <tokens>",
  "Max thinking tokens (only with --print)")
  .argParser(Number)
  .hideHelp())  // Hidden option

// Mapping: BF→Option
```

### System Prompt Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--system-prompt <prompt>` | string | - | Override system prompt entirely |
| `--system-prompt-file <file>` | string | - | Load system prompt from file (hidden) |
| `--append-system-prompt <prompt>` | string | - | Append to default system prompt |
| `--append-system-prompt-file <file>` | string | - | Load and append from file (hidden) |

```javascript
// ============================================
// systemPromptOptions - System prompt configuration
// Location: chunks.158.mjs:32-40
// ============================================

// ORIGINAL (for source lookup):
.addOption(new BF("--system-prompt <prompt>",
  "System prompt to use for the session")
  .argParser(String))
.addOption(new BF("--system-prompt-file <file>",
  "Read system prompt from a file")
  .argParser(String)
  .hideHelp())
.addOption(new BF("--append-system-prompt <prompt>",
  "Append a system prompt to the default system prompt")
  .argParser(String))
.addOption(new BF("--append-system-prompt-file <file>",
  "Read system prompt from a file and append to the default system prompt")
  .argParser(String)
  .hideHelp())

// READABLE (for understanding):
// Mutual exclusion: --system-prompt and --system-prompt-file cannot be used together
.addOption(new Option("--system-prompt <prompt>", "Override system prompt")
  .argParser(String))
.addOption(new Option("--system-prompt-file <file>", "Load system prompt from file")
  .argParser(String)
  .hideHelp())
// Can be combined with either of the above
.addOption(new Option("--append-system-prompt <prompt>", "Append to default prompt")
  .argParser(String))
.addOption(new Option("--append-system-prompt-file <file>", "Load and append from file")
  .argParser(String)
  .hideHelp())

// Mapping: BF→Option
```

### Tool Configuration Options

| Option | Type | Default | Description | Mode |
|--------|------|---------|-------------|------|
| `--tools <tools...>` | string[] | - | Specify built-in tool set | `--print` |
| `--allowedTools <tools...>` | string[] | `[]` | Whitelist additional tools | all |
| `--disallowedTools <tools...>` | string[] | `[]` | Blacklist tools | all |
| `--json-schema <schema>` | string | - | Structured output schema | `--print` |

```javascript
// ============================================
// toolOptions - Tool filtering configuration
// Location: chunks.158.mjs:42-48
// ============================================

// ORIGINAL (for source lookup):
.option("--tools <tools...>",
  'Specify the list of available tools from the built-in set. Use "" to disable all tools, "default" to use all tools, or specify tool names (e.g. "Bash,Edit,Read"). Only works with --print mode.')
.option("--allowedTools, --allowed-tools <tools...>",
  'Comma or space-separated list of tool names to allow (e.g. "Bash(git:*) Edit")')
.option("--disallowedTools, --disallowed-tools <tools...>",
  'Comma or space-separated list of tool names to deny (e.g. "Bash(git:*) Edit")')
.addOption(new BF("--json-schema <schema>",
  'JSON Schema for structured output validation. Example: {"type":"object","properties":{"name":{"type":"string"}},"required":["name"]}')
  .argParser(String))

// READABLE (for understanding):
.option("--tools <tools...>",
  'Built-in tools: "" (none), "default" (all), or names like "Bash,Edit,Read" (--print only)')
.option("--allowedTools, --allowed-tools <tools...>",
  'Whitelist tools: "Bash(git:*) Edit" (supports patterns)')
.option("--disallowedTools, --disallowed-tools <tools...>",
  'Blacklist tools: "Bash(git:*) Edit" (supports patterns)')
.addOption(new Option("--json-schema <schema>",
  'JSON Schema for structured output: {"type":"object",...}')
  .argParser(String))

// Mapping: BF→Option
```

### Permission Control Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--permission-mode <mode>` | enum | - | Permission enforcement level |
| `--dangerously-skip-permissions` | boolean | `false` | Bypass all permissions |
| `--allow-dangerously-skip-permissions` | boolean | `false` | Enable skip permissions flag |

**Permission mode values:**
- `default` - Normal permission prompting
- `plan` - Plan mode restrictions
- `bypassPermissions` - Skip all permission checks (requires allow flag)

```javascript
// ============================================
// permissionOptions - Permission enforcement configuration
// Location: chunks.158.mjs:50-56
// ============================================

// ORIGINAL (for source lookup):
.addOption(new BF("--permission-mode <mode>",
  "Permission mode to use for the session")
  .argParser(String)
  .choices(kR))
.option("--dangerously-skip-permissions",
  "Bypass all permission checks. Recommended only for sandboxes with no internet access.",
  () => true)
.option("--allow-dangerously-skip-permissions",
  "Enable bypassing all permission checks as an option, without it being enabled by default. Recommended only for sandboxes with no internet access.",
  () => true)

// READABLE (for understanding):
.addOption(new Option("--permission-mode <mode>", "Permission mode for session")
  .argParser(String)
  .choices(PERMISSION_MODES))  // kR = array of valid modes
.option("--dangerously-skip-permissions",
  "Bypass all permission checks (sandbox only!)",
  () => true)
.option("--allow-dangerously-skip-permissions",
  "Enable permission bypass as an available option",
  () => true)

// Mapping: BF→Option, kR→PERMISSION_MODES
```

### MCP Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--mcp-config <configs...>` | string[] | - | Load MCP server configs |
| `--strict-mcp-config` | boolean | `false` | Only use specified MCP servers |
| `--mcp-debug` | boolean | `false` | Enable MCP debugging (deprecated) |

```javascript
// ============================================
// mcpOptions - MCP server configuration
// Location: chunks.158.mjs:58-64
// ============================================

// ORIGINAL (for source lookup):
.option("--mcp-config <configs...>",
  "Load MCP servers from JSON files or strings (space-separated)")
.option("--strict-mcp-config",
  "Only use MCP servers from --mcp-config, ignoring all other MCP configurations",
  () => true)
.option("--mcp-debug",
  "[DEPRECATED. Use --debug instead] Enable MCP debug mode (shows MCP server errors)",
  () => true)

// READABLE (for understanding):
.option("--mcp-config <configs...>",
  "MCP servers from JSON files or strings (space-separated)")
.option("--strict-mcp-config",
  "Only use --mcp-config servers, ignore all other MCP configs",
  () => true)
.option("--mcp-debug",
  "[DEPRECATED] Use --debug instead",
  () => true)
```

### Advanced Options

| Option | Type | Default | Description | Hidden |
|--------|------|---------|-------------|--------|
| `--max-turns <turns>` | number | - | Maximum agentic turns | Yes |
| `--max-budget-usd <amount>` | number | - | Maximum cost budget in USD | Yes |
| `--plugin-dir <paths...>` | string[] | - | Plugin directories | No |
| `--ide` | boolean | `false` | Auto-connect to IDE | No |
| `--add-dir <paths...>` | string[] | - | Additional working directories | No |
| `--betas <betas...>` | string[] | - | Beta feature headers | No |
| `--settings <file-or-json>` | string | - | Load settings from file/JSON | No |
| `--setting-sources <sources>` | string | - | Setting sources to load | No |
| `--skip-web-fetch-preflight` | boolean | `false` | Skip WebFetch permission checks | Yes |
| `--remote` | boolean | `false` | Remote execution mode | Yes |

```javascript
// ============================================
// advancedOptions - Advanced configuration options
// Location: chunks.158.mjs:66-90
// ============================================

// ORIGINAL (for source lookup):
.addOption(new BF("--max-turns <turns>",
  "Maximum number of agentic turns in non-interactive mode. This will early exit the conversation after the specified number of turns. (only works with --print)")
  .argParser(Number)
  .hideHelp())
.addOption(new BF("--max-budget-usd <amount>",
  "Maximum dollar amount to spend on API calls (only works with --print)")
  .argParser((Y) => {
    let J = Number(Y);
    if (isNaN(J) || J <= 0)
      throw Error("--max-budget-usd must be a positive number greater than 0");
    return J;
  })
  .hideHelp())
.option("--settings <file-or-json>",
  "Path to a settings JSON file or a JSON string to load additional settings from")
.option("--add-dir <directories...>",
  "Additional directories to allow tool access to")
.option("--ide",
  "Automatically connect to IDE on startup if exactly one valid IDE is available",
  () => true)
.option("--plugin-dir <paths...>",
  "Load plugins from directories for this session only (repeatable)")
.option("--betas <betas...>",
  "Beta headers to include in API requests (API key users only)")

// READABLE (for understanding):
.addOption(new Option("--max-turns <turns>",
  "Max agentic turns in print mode, early exit after N turns")
  .argParser(Number)
  .hideHelp())
.addOption(new Option("--max-budget-usd <amount>",
  "Max API cost in USD (print mode only)")
  .argParser((value) => {
    const parsed = Number(value);
    if (isNaN(parsed) || parsed <= 0) {
      throw Error("--max-budget-usd must be a positive number > 0");
    }
    return parsed;
  })
  .hideHelp())
.option("--settings <file-or-json>", "Settings JSON file path or JSON string")
.option("--add-dir <directories...>", "Additional tool access directories")
.option("--ide", "Auto-connect to IDE if exactly one available", () => true)
.option("--plugin-dir <paths...>", "Session-only plugin directories")
.option("--betas <betas...>", "Beta headers for API requests (API key users)")

// Mapping: BF→Option, Y→value, J→parsed
```

---

## Option Validation

### Validation Strategy Deep Analysis

**What it does:** Validates CLI option combinations before execution, catching conflicts and invalid configurations early.

**How it works:**
1. Extract all options from parsed command
2. Check mutual exclusions (e.g., --session-id + --continue)
3. Validate format requirements (e.g., stream-json input needs stream-json output)
4. Validate mode requirements (e.g., --tools only with --print)
5. Validate data formats (e.g., UUID format for session IDs)

**Why this approach:**
- **Fail fast:** Errors shown before any work done
- **Clear messages:** Specific error for each validation
- **Exit codes:** Proper shell integration with exit(1)

### Validation Rules Table

| Rule | Options | Condition | Error |
|------|---------|-----------|-------|
| Session ID conflict | --session-id, --continue/--resume | Used together | Cannot use together |
| Session ID format | --session-id | Not valid UUID | Must be valid UUID |
| Session ID uniqueness | --session-id | Already in use | Already in use |
| Input format match | --input-format=stream-json | No matching output | Requires stream-json output |
| Tools mode | --tools | Without --print | Only with --print |
| Model conflict | --fallback-model | Same as --model | Cannot be same |
| System prompt conflict | --system-prompt, --system-prompt-file | Both provided | Cannot use both |

### Validation Implementation

```javascript
// ============================================
// validateOptions - Complete option validation logic
// Location: chunks.158.mjs:59-105
// ============================================

// ORIGINAL (for source lookup):
// Session ID validation
if (R) {
  if (J.continue || J.resume)
    process.stderr.write(tA.red(`Error: --session-id cannot be used with --continue or --resume.\n`)), process.exit(1);
  let G0 = nE(R);
  if (!G0) process.stderr.write(tA.red(`Error: Invalid session ID. Must be a valid UUID.\n`)), process.exit(1);
  if (aE9(G0)) process.stderr.write(tA.red(`Error: Session ID ${G0} is already in use.\n`)), process.exit(1)
}

// Model validation
if (q) {
  if (J.model && q === J.model)
    process.stderr.write(tA.red(`Error: --fallback-model cannot be the same as --model.\n`)), process.exit(1)
}

// Input format validation
if (J.inputFormat === "stream-json" && J.outputFormat !== "stream-json")
  process.stderr.write(tA.red(`Error: --input-format stream-json requires --output-format stream-json.\n`)), process.exit(1);

// Tools option validation
if (K.length > 0 && !OA)
  process.stderr.write(tA.red(`Error: --tools can only be used with --print mode.\n`)), process.exit(1);

// READABLE (for understanding):
// === Session ID Validation ===
if (sessionId) {
  // Mutual exclusion check
  if (parsedOptions.continue || parsedOptions.resume) {
    process.stderr.write(chalk.red(`Error: --session-id cannot be used with --continue or --resume.\n`));
    process.exit(1);
  }

  // UUID format validation
  const validatedId = validateUUID(sessionId);
  if (!validatedId) {
    process.stderr.write(chalk.red(`Error: Invalid session ID. Must be a valid UUID.\n`));
    process.exit(1);
  }

  // Uniqueness check
  if (sessionIdInUse(validatedId)) {
    process.stderr.write(chalk.red(`Error: Session ID ${validatedId} is already in use.\n`));
    process.exit(1);
  }
}

// === Model Validation ===
if (fallbackModel) {
  if (parsedOptions.model && fallbackModel === parsedOptions.model) {
    process.stderr.write(chalk.red(`Error: --fallback-model cannot be the same as --model.\n`));
    process.exit(1);
  }
}

// === Input Format Validation ===
if (parsedOptions.inputFormat === "stream-json" && parsedOptions.outputFormat !== "stream-json") {
  process.stderr.write(chalk.red(`Error: --input-format stream-json requires --output-format stream-json.\n`));
  process.exit(1);
}

// === Tools Mode Validation ===
if (tools.length > 0 && !isPrintMode) {
  process.stderr.write(chalk.red(`Error: --tools can only be used with --print mode.\n`));
  process.exit(1);
}

// Mapping: R→sessionId, J→parsedOptions, tA→chalk, nE→validateUUID, aE9→sessionIdInUse,
//          q→fallbackModel, K→tools, OA→isPrintMode
```

---

## Configuration Merge Order

### Priority Hierarchy

Configuration values are merged in a specific priority order (highest to lowest):

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Configuration Merge Priority                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. CLI FLAGS (highest priority)                                            │
│     --model, --tools, --permission-mode, etc.                               │
│     Source: process.argv parsing                                            │
│                                                                              │
│  2. ENVIRONMENT VARIABLES                                                    │
│     ANTHROPIC_MODEL, CLAUDE_CODE_*, etc.                                    │
│     Source: process.env                                                      │
│                                                                              │
│  3. LOCAL PROJECT SETTINGS                                                   │
│     .claude/settings.local.json (gitignored)                                │
│     Source: Project-specific overrides                                       │
│                                                                              │
│  4. PROJECT SETTINGS                                                         │
│     .claude/settings.json (shared)                                          │
│     Source: Project-specific configuration                                   │
│                                                                              │
│  5. USER SETTINGS                                                            │
│     ~/.config/claude/settings.json                                          │
│     Source: User-wide defaults                                              │
│                                                                              │
│  6. BUILT-IN DEFAULTS (lowest priority)                                     │
│     Hardcoded in source code                                                │
│     Source: Default behavior                                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Merge Algorithm Pseudocode

```
FUNCTION mergeConfiguration(cliOptions, envVars):
  // Start with built-in defaults
  config = BUILTIN_DEFAULTS

  // Layer 1: User settings
  userSettings = loadFile(USER_SETTINGS_PATH)
  config = deepMerge(config, userSettings)

  // Layer 2: Project settings
  projectSettings = loadFile(PROJECT_SETTINGS_PATH)
  config = deepMerge(config, projectSettings)

  // Layer 3: Local project settings
  localSettings = loadFile(LOCAL_SETTINGS_PATH)
  config = deepMerge(config, localSettings)

  // Layer 4: Environment variables
  FOR envVar IN KNOWN_ENV_VARS:
    IF envVars[envVar] IS defined:
      config[mapping[envVar]] = parseEnvValue(envVars[envVar])

  // Layer 5: CLI options (highest priority)
  FOR option IN cliOptions:
    IF option.value IS defined:
      config[option.name] = option.value

  RETURN config
```

### Environment Variable Mapping

| Environment Variable | Maps To | Type |
|---------------------|---------|------|
| `ANTHROPIC_MODEL` | model | string |
| `ANTHROPIC_API_KEY` | apiKey | string |
| `CLAUDE_CODE_DEBUG` | debug | boolean |
| `CLAUDE_CODE_PERMISSION_MODE` | permissionMode | enum |
| `DISABLE_COMPACT` | compactionDisabled | boolean |
| `CLAUDE_CODE_SKIP_OOBE` | skipOobe | boolean |
| `CLAUDE_CODE_ENTRY_POINT` | entryPoint | string |

---

## Custom Option Parsers

### Integer Parser

```javascript
// ============================================
// parseInteger - Integer option validator
// Location: chunks.158.mjs (inline)
// ============================================

// ORIGINAL (for source lookup):
.argParser(Number)  // Simple Number conversion

// Or with validation:
.argParser((Y) => {
  let J = parseInt(Y, 10);
  if (isNaN(J)) throw Error(`Invalid integer: ${Y}`);
  return J
})

// READABLE (for understanding):
function parseInteger(value) {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw Error(`Invalid integer: ${value}`);
  }
  return parsed;
}

// Mapping: Y→value, J→parsed
```

### Boolean Parser (Environment Variables)

```javascript
// ============================================
// parseBoolean - Boolean environment variable parser
// Location: chunks.1.mjs:890-895
// ============================================

// ORIGINAL (for source lookup):
function Y0(A) {
  if (typeof A === "boolean") return A;
  if (typeof A === "string") {
    let Q = A.toLowerCase().trim();
    return Q === "true" || Q === "1" || Q === "yes"
  }
  return !!A
}

// READABLE (for understanding):
function parseBoolean(value) {
  // Already boolean - return as-is
  if (typeof value === "boolean") {
    return value;
  }

  // String parsing (environment variables)
  if (typeof value === "string") {
    const normalized = value.toLowerCase().trim();
    return normalized === "true" || normalized === "1" || normalized === "yes";
  }

  // Fallback to JavaScript truthiness
  return !!value;
}

// Mapping: Y0→parseBoolean, A→value, Q→normalized
```

**Why this approach:**
- Handles actual boolean values (from programmatic use)
- Parses environment variable strings (case-insensitive)
- Supports multiple truthy string formats (true, 1, yes)
- Fallback to JavaScript truthiness for edge cases

### Budget Parser (with validation)

```javascript
// ============================================
// parseBudget - Budget option with positive number validation
// Location: chunks.158.mjs:76-82
// ============================================

// ORIGINAL (for source lookup):
.argParser((Y) => {
  let J = Number(Y);
  if (isNaN(J) || J <= 0)
    throw Error("--max-budget-usd must be a positive number greater than 0");
  return J;
})

// READABLE (for understanding):
function parseBudget(value) {
  const parsed = Number(value);

  // Validate: must be a positive number
  if (isNaN(parsed) || parsed <= 0) {
    throw Error("--max-budget-usd must be a positive number greater than 0");
  }

  return parsed;
}

// Mapping: Y→value, J→parsed
```

---

## Subcommands

### Subcommand Architecture

```
claude
├── mcp                    # MCP server management
│   ├── serve              # Start MCP server
│   ├── add                # Add MCP server
│   ├── remove             # Remove MCP server
│   ├── list               # List configured servers
│   ├── get                # Get server details
│   ├── add-json           # Add with JSON config
│   ├── add-from-claude-desktop  # Import from Claude Desktop
│   └── reset-project-choices    # Reset project scope
│
├── plugin                 # Plugin management
│   ├── validate           # Validate plugin manifest
│   ├── install (i)        # Install plugin
│   ├── uninstall (remove, rm)  # Uninstall plugin
│   ├── enable             # Enable plugin
│   ├── disable            # Disable plugin
│   └── marketplace        # Marketplace management
│       ├── add            # Add marketplace
│       ├── list           # List marketplaces
│       ├── remove (rm)    # Remove marketplace
│       └── update         # Update marketplace(s)
│
├── setup-token            # Configure authentication
├── doctor                 # Check auto-updater health
├── update                 # Check for and install updates
└── install                # Install native build
```

### MCP Subcommand Implementation

```javascript
// ============================================
// mcpSubcommand - MCP server management commands
// Location: chunks.158.mjs:597-700
// ============================================

// ORIGINAL (for source lookup):
let Q = A.command("mcp")
  .description("Configure and manage MCP servers")
  .helpOption("-h, --help", "Display help for command");

Q.command("serve")
  .description("Start the Claude Code MCP server")
  .option("--max-idle-time-seconds <seconds>", "Max idle time", Number)
  .option("--mcp-server-name <name>", "Server name")
  .action(async (B) => {
    M9("mcp_serve_start");
    let { serveMain: G } = await Promise.resolve().then(() => (Bw9(), Dw9));
    await G(B)
  });

Q.command("add <name> <commandOrUrl> [args...]")
  .description("Add an MCP server")
  .option("-s, --scope <scope>", "Scope: user, project, local")
  .option("-e, --env <env...>", "Environment variables")
  .option("-t, --transport <transport>", "Transport: stdio, sse")
  .action(async (B, G, Z, I) => { /* ... */ });

// READABLE (for understanding):
const mcpCommand = commander.command("mcp")
  .description("Configure and manage MCP servers")
  .helpOption("-h, --help", "Display help for command");

mcpCommand.command("serve")
  .description("Start the Claude Code MCP server")
  .option("--max-idle-time-seconds <seconds>", "Max idle time", Number)
  .option("--mcp-server-name <name>", "Server name")
  .action(async (options) => {
    emitTelemetry("mcp_serve_start");
    const { serveMain } = await import("./mcp-serve-module");
    await serveMain(options);
  });

mcpCommand.command("add <name> <commandOrUrl> [args...]")
  .description("Add an MCP server")
  .option("-s, --scope <scope>", "Scope: user, project, local")
  .option("-e, --env <env...>", "Environment variables")
  .option("-t, --transport <transport>", "Transport: stdio, sse")
  .action(async (name, commandOrUrl, args, options) => { /* ... */ });

// Mapping: A→commander, Q→mcpCommand, B→options/name, G→commandOrUrl/serveMain,
//          Z→args, I→options, M9→emitTelemetry, Bw9/Dw9→mcpServeModule
```

### Plugin Subcommand Implementation

```javascript
// ============================================
// pluginSubcommand - Plugin management commands
// Location: chunks.158.mjs:750-850
// ============================================

// ORIGINAL (for source lookup):
let G = A.command("plugin")
  .description("Manage Claude Code plugins")
  .helpOption("-h, --help", "Display help for command");

G.command("validate <path>")
  .description("Validate a plugin or marketplace manifest")
  .action(async (Z) => {
    let { validatePlugin: I } = await Promise.resolve().then(() => (jw9(), Pw9));
    await I(Z)
  });

G.command("install <plugin>")
  .alias("i")
  .description("Install a plugin")
  .option("-f, --force", "Force reinstall")
  .action(async (Z, I) => {
    let { installPlugin: Y } = await Promise.resolve().then(() => (jw9(), Pw9));
    await Y(Z, I)
  });

// READABLE (for understanding):
const pluginCommand = commander.command("plugin")
  .description("Manage Claude Code plugins")
  .helpOption("-h, --help", "Display help for command");

pluginCommand.command("validate <path>")
  .description("Validate a plugin or marketplace manifest")
  .action(async (path) => {
    const { validatePlugin } = await import("./plugin-module");
    await validatePlugin(path);
  });

pluginCommand.command("install <plugin>")
  .alias("i")  // Short alias: claude plugin i <plugin>
  .description("Install a plugin")
  .option("-f, --force", "Force reinstall")
  .action(async (plugin, options) => {
    const { installPlugin } = await import("./plugin-module");
    await installPlugin(plugin, options);
  });

// Mapping: A→commander, G→pluginCommand, Z→path/plugin, I→options/validatePlugin,
//          Y→installPlugin, jw9/Pw9→pluginModule
```

### System Commands

```javascript
// ============================================
// systemCommands - System management commands
// Location: chunks.158.mjs:900-950
// ============================================

// ORIGINAL (for source lookup):
A.command("setup-token")
  .description("Set up a long-lived authentication token (requires Claude subscription)")
  .helpOption("-h, --help", "Display help for command")
  .action(async () => {
    let { setupToken: Q } = await Promise.resolve().then(() => (tu3(), nu3));
    await Q()
  });

A.command("doctor")
  .description("Check the health of your Claude Code auto-updater")
  .helpOption("-h, --help", "Display help for command")
  .action(async () => {
    let { doctorMain: Q } = await Promise.resolve().then(() => (cu3(), ru3));
    await Q()
  });

A.command("update")
  .description("Check for updates and install if available")
  .helpOption("-h, --help", "Display help for command")
  .action(async () => {
    let { updateMain: Q } = await Promise.resolve().then(() => (eu3(), au3));
    await Q()
  });

A.command("install [target]")
  .description("Install Claude Code native build. Use [target] to specify version")
  .option("--force", "Force installation even if already installed")
  .helpOption("-h, --help", "Display help for command")
  .action(async (Q, B) => {
    let { installMain: G } = await Promise.resolve().then(() => (su3(), iu3));
    await G(Q, B)
  });

// READABLE (for understanding):
commander.command("setup-token")
  .description("Set up long-lived auth token (requires subscription)")
  .action(async () => {
    const { setupToken } = await import("./setup-token-module");
    await setupToken();
  });

commander.command("doctor")
  .description("Check auto-updater health")
  .action(async () => {
    const { doctorMain } = await import("./doctor-module");
    await doctorMain();
  });

commander.command("update")
  .description("Check for updates and install")
  .action(async () => {
    const { updateMain } = await import("./update-module");
    await updateMain();
  });

commander.command("install [target]")
  .description("Install native build (stable, latest, or version)")
  .option("--force", "Force install if already installed")
  .action(async (target, options) => {
    const { installMain } = await import("./install-module");
    await installMain(target, options);
  });

// Mapping: A→commander, Q→target/moduleExport, B→options
```

---

## Tool Filtering Algorithm

### Tool Filter Resolution

```javascript
// ============================================
// resolveToolFilters - Combine tool allow/deny lists
// Location: chunks.158.mjs:180-220
// ============================================

// READABLE pseudocode:
FUNCTION resolveToolFilters(toolsOption, allowedTools, disallowedTools):
  // Base tool set
  IF toolsOption IS defined:
    // Explicit tool list (--tools flag, print mode only)
    IF toolsOption === "":
      baseTools = []  // No tools
    ELSE IF toolsOption === "default":
      baseTools = getAllAvailableTools()
    ELSE:
      baseTools = lookupBuiltinTools(toolsOption)
  ELSE:
    // All available tools
    baseTools = getAllAvailableTools()

  // Apply whitelist (additive)
  IF allowedTools.length > 0:
    FOR tool IN allowedTools:
      IF tool NOT IN baseTools:
        baseTools.push(resolveToolPattern(tool))

  // Apply blacklist (subtractive, final filter)
  IF disallowedTools.length > 0:
    baseTools = baseTools.filter(tool =>
      NOT matchesAnyPattern(tool, disallowedTools)
    )

  RETURN unique(baseTools)
```

**Filter precedence:**
1. `--tools` sets the base set (print mode only)
2. `--allowedTools` adds to the set (inclusive OR)
3. `--disallowedTools` removes from final set (exclusive)

**Pattern support:**
- `Bash` - Exact tool name match
- `Bash(git:*)` - Tool with command pattern
- `*` - All tools (in allowed/disallowed)

---

## Permission Mode Resolution

### Permission Mode Algorithm

```javascript
// ============================================
// resolvePermissionMode - Determine effective permission mode
// Location: chunks.158.mjs:245-280 (via SE9)
// ============================================

// READABLE pseudocode:
FUNCTION resolvePermissionMode(cliOption, envVar, settings, dangerouslySkip, allowDangerouslySkip):
  // Highest priority: dangerous skip (requires allow flag)
  IF dangerouslySkip:
    IF NOT allowDangerouslySkip:
      ERROR("--dangerously-skip-permissions requires --allow-dangerously-skip-permissions")
    RETURN "bypassPermissions"

  // CLI option override
  IF cliOption IS defined:
    IF cliOption NOT IN ["default", "plan", "bypassPermissions"]:
      ERROR("Invalid permission mode")
    RETURN cliOption

  // Environment variable
  IF envVar IS defined:
    RETURN parsePermissionMode(envVar)

  // Settings file
  IF settings.permissionMode IS defined:
    RETURN settings.permissionMode

  // Default
  RETURN "default"
```

**Permission mode behaviors:**

| Mode | Tool Prompts | File Write Prompts | Bash Prompts |
|------|-------------|-------------------|--------------|
| `default` | Yes | Yes | Yes |
| `plan` | Limited | Read-only | Blocked |
| `bypassPermissions` | No | No | No |

---

## Feature Interaction Matrix

### Option Interactions

| Option A | Option B | Interaction | Behavior |
|----------|----------|-------------|----------|
| `--continue` | `--fork-session` | Combine | Load history, new session ID |
| `--resume` | `--fork-session` | Combine | Load history, new session ID |
| `--continue` | `--session-id` | Conflict | Error |
| `--resume` | `--session-id` | Conflict | Error |
| `--system-prompt` | `--system-prompt-file` | Conflict | Error |
| `--system-prompt` | `--append-system-prompt` | Combine | Override + append |
| `--system-prompt-file` | `--append-system-prompt` | Combine | File + append |
| `--model` | `--fallback-model` | Combine | Primary + fallback |
| `--model` | `--fallback-model` (same) | Conflict | Error |
| `--mcp-config` | `--strict-mcp-config` | Combine | Only CLI configs |
| `--print` | `--output-format` | Require | Format only with print |
| `--print` | `--tools` | Require | Tool list only with print |
| `--input-format=stream-json` | `--output-format` | Require | Must be stream-json |

### Mode Restrictions

| Option | Interactive Mode | Print Mode |
|--------|-----------------|------------|
| `--tools` | Error | Allowed |
| `--json-schema` | Ignored | Allowed |
| `--output-format` | Ignored | Required |
| `--input-format` | Ignored | Optional |
| `--include-partial-messages` | Ignored | Optional |
| `--replay-user-messages` | Ignored | Optional |
| `--max-turns` | Ignored | Optional |
| `--max-budget-usd` | Ignored | Optional |
| `--fallback-model` | Ignored | Optional |

---

## Hidden Options Reference

Options hidden from `--help` but available for advanced users:

| Option | Purpose | Use Case |
|--------|---------|----------|
| `--debug-to-stderr` | Debug output to stderr | Separating debug from output |
| `--max-thinking-tokens` | Extended thinking limit | Control reasoning depth |
| `--max-turns` | Agentic turn limit | Automation safety |
| `--max-budget-usd` | Cost limit | Budget control |
| `--system-prompt-file` | Load prompt from file | Long prompts |
| `--append-system-prompt-file` | Load append from file | Long prompts |
| `--resume-session-at` | Resume at message | Precise replay |
| `--teleport` | Cloud sync | Multi-device |
| `--remote` | Remote execution | Distributed |
| `--skip-web-fetch-preflight` | Skip WebFetch perms | Automation |

---

## Error Messages Reference

### Validation Errors

| Code | Message | Cause | Resolution |
|------|---------|-------|------------|
| V001 | "Cannot use with --continue or --resume" | Session ID conflict | Use one approach |
| V002 | "Must be a valid UUID" | Invalid session ID format | Use valid UUID |
| V003 | "Session ID is already in use" | Duplicate session | Use new ID |
| V004 | "Cannot be same as --model" | Model conflict | Use different fallback |
| V005 | "Requires --output-format stream-json" | Format mismatch | Match formats |
| V006 | "Only valid with --print mode" | Mode restriction | Add --print |
| V007 | "Cannot use both" | Prompt source conflict | Use one source |
| V008 | "Invalid permission mode" | Bad mode value | Use valid mode |

### Parse Errors

| Code | Message | Cause | Resolution |
|------|---------|-------|------------|
| P001 | "Invalid output format" | Bad format value | Use text/json/stream-json |
| P002 | "Invalid integer" | Bad number | Use valid integer |
| P003 | "must be a positive number" | Budget <= 0 | Use positive number |
| P004 | "Invalid MCP configuration" | Bad MCP config | Fix config JSON/file |

---

## Summary

The CLI argument parsing system provides:

| Feature | Implementation | Benefit |
|---------|----------------|---------|
| 35+ options | Categorized by function | Comprehensive control |
| Subcommand tree | Nested command structure | Organized functionality |
| Validation | Early conflict detection | Clear error messages |
| Config merge | 6-layer priority | Flexible configuration |
| Custom parsers | Integer, boolean, budget | Type-safe values |
| Mode restrictions | Print vs Interactive | Appropriate features |
| Feature interactions | Matrix-based rules | Predictable behavior |
| Hidden options | Advanced users | Power user support |
