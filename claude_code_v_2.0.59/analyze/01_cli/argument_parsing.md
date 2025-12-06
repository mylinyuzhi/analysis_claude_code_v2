# CLI Argument Parsing

## Overview

Claude Code v2.0.59 uses **Commander.js** as its CLI framework for parsing command-line arguments and options. The main CLI setup is implemented in `chunks.158.mjs` through the `hu3()` function.

## Commander.js Setup

### Main Command Configuration

```javascript
let A = new fJ1;  // Commander instance
A.name("claude")
  .description("Claude Code - starts an interactive session by default, use -p/--print for non-interactive output")
  .argument("[prompt]", "Your prompt", String)
  .helpOption("-h, --help", "Display help for command")
```

### Core Class Structure

The CLI is built on the `pK0` class (Commander's Command class) from `chunks.155.mjs`:

```javascript
class pK0 extends hf3 {  // extends EventEmitter
  constructor(A) {
    super();
    this.commands = [];
    this.options = [];
    this.parent = null;
    this._allowUnknownOption = false;
    this._allowExcessArguments = true;
    this.registeredArguments = [];
    this._actionHandler = null;
    this._executableHandler = false;
    // ... more initialization
  }
}
```

## CLI Options

### Debug and Logging Options

**--debug [filter]**
```javascript
.option("-d, --debug [filter]",
  'Enable debug mode with optional category filtering (e.g., "api,hooks" or "!statsig,!file")',
  (Y) => true)
```

**--debug-to-stderr**
```javascript
.addOption(new BF("-d2e, --debug-to-stderr", "Enable debug mode (to stderr)")
  .argParser(Boolean)
  .hideHelp())
```

**--verbose**
```javascript
.option("--verbose", "Override verbose mode setting from config", () => true)
```

### Print Mode Options

**--print**
```javascript
.option("-p, --print",
  "Print response and exit (useful for pipes). Note: The workspace trust dialog is skipped when Claude is run with the -p mode. Only use this flag in directories you trust.",
  () => true)
```

**--output-format**
```javascript
.addOption(new BF("--output-format <format>",
  'Output format (only works with --print): "text" (default), "json" (single result), or "stream-json" (realtime streaming)')
  .choices(["text", "json", "stream-json"]))
```

**--json-schema**
```javascript
.addOption(new BF("--json-schema <schema>",
  'JSON Schema for structured output validation. Example: {"type":"object","properties":{"name":{"type":"string"}},"required":["name"]}')
  .argParser(String))
```

**--include-partial-messages**
```javascript
.option("--include-partial-messages",
  "Include partial message chunks as they arrive (only works with --print and --output-format=stream-json)",
  () => true)
```

**--input-format**
```javascript
.addOption(new BF("--input-format <format>",
  'Input format (only works with --print): "text" (default), or "stream-json" (realtime streaming input)')
  .choices(["text", "stream-json"]))
```

### Model and API Options

**--model**
```javascript
.option("--model <model>",
  "Model for the current session. Provide an alias for the latest model (e.g. 'sonnet' or 'opus') or a model's full name (e.g. 'claude-sonnet-4-5-20250929').")
```

**--fallback-model**
```javascript
.option("--fallback-model <model>",
  "Enable automatic fallback to specified model when default model is overloaded (only works with --print)")
```

**--betas**
```javascript
.option("--betas <betas...>",
  "Beta headers to include in API requests (API key users only)")
```

**--agent**
```javascript
.option("--agent <agent>",
  "Agent for the current session. Overrides the 'agent' setting.")
```

**--agents**
```javascript
.option("--agents <json>",
  `JSON object defining custom agents (e.g. '{"reviewer": {"description": "Reviews code", "prompt": "You are a code reviewer"}}')`)
```

### Session Management Options

**--continue**
```javascript
.option("-c, --continue", "Continue the most recent conversation", () => true)
```

**--resume**
```javascript
.option("-r, --resume [value]",
  "Resume a conversation by session ID, or open interactive picker with optional search term",
  (Y) => Y || true)
```

**--fork-session**
```javascript
.option("--fork-session",
  "When resuming, create a new session ID instead of reusing the original (use with --resume or --continue)",
  () => true)
```

**--session-id**
```javascript
.option("--session-id <uuid>",
  "Use a specific session ID for the conversation (must be a valid UUID)")
```

### Permission and Security Options

**--dangerously-skip-permissions**
```javascript
.option("--dangerously-skip-permissions",
  "Bypass all permission checks. Recommended only for sandboxes with no internet access.",
  () => true)
```

**--allow-dangerously-skip-permissions**
```javascript
.option("--allow-dangerously-skip-permissions",
  "Enable bypassing all permission checks as an option, without it being enabled by default. Recommended only for sandboxes with no internet access.",
  () => true)
```

**--permission-mode**
```javascript
.addOption(new BF("--permission-mode <mode>",
  "Permission mode to use for the session")
  .argParser(String)
  .choices(kR))  // kR is array of valid permission modes
```

### Tool Management Options

**--tools**
```javascript
.option("--tools <tools...>",
  'Specify the list of available tools from the built-in set. Use "" to disable all tools, "default" to use all tools, or specify tool names (e.g. "Bash,Edit,Read"). Only works with --print mode.')
```

**--allowedTools / --allowed-tools**
```javascript
.option("--allowedTools, --allowed-tools <tools...>",
  'Comma or space-separated list of tool names to allow (e.g. "Bash(git:*) Edit")')
```

**--disallowedTools / --disallowed-tools**
```javascript
.option("--disallowedTools, --disallowed-tools <tools...>",
  'Comma or space-separated list of tool names to deny (e.g. "Bash(git:*) Edit")')
```

### MCP (Model Context Protocol) Options

**--mcp-config**
```javascript
.option("--mcp-config <configs...>",
  "Load MCP servers from JSON files or strings (space-separated)")
```

**--strict-mcp-config**
```javascript
.option("--strict-mcp-config",
  "Only use MCP servers from --mcp-config, ignoring all other MCP configurations",
  () => true)
```

**--mcp-debug** (deprecated)
```javascript
.option("--mcp-debug",
  "[DEPRECATED. Use --debug instead] Enable MCP debug mode (shows MCP server errors)",
  () => true)
```

### System Prompt Options

**--system-prompt**
```javascript
.addOption(new BF("--system-prompt <prompt>",
  "System prompt to use for the session")
  .argParser(String))
```

**--system-prompt-file**
```javascript
.addOption(new BF("--system-prompt-file <file>",
  "Read system prompt from a file")
  .argParser(String)
  .hideHelp())
```

**--append-system-prompt**
```javascript
.addOption(new BF("--append-system-prompt <prompt>",
  "Append a system prompt to the default system prompt")
  .argParser(String))
```

**--append-system-prompt-file**
```javascript
.addOption(new BF("--append-system-prompt-file <file>",
  "Read system prompt from a file and append to the default system prompt")
  .argParser(String)
  .hideHelp())
```

### Advanced Options

**--max-thinking-tokens**
```javascript
.addOption(new BF("--max-thinking-tokens <tokens>",
  "Maximum number of thinking tokens. (only works with --print)")
  .argParser(Number)
  .hideHelp())
```

**--max-turns**
```javascript
.addOption(new BF("--max-turns <turns>",
  "Maximum number of agentic turns in non-interactive mode. This will early exit the conversation after the specified number of turns. (only works with --print)")
  .argParser(Number)
  .hideHelp())
```

**--max-budget-usd**
```javascript
.addOption(new BF("--max-budget-usd <amount>",
  "Maximum dollar amount to spend on API calls (only works with --print)")
  .argParser((Y) => {
    let J = Number(Y);
    if (isNaN(J) || J <= 0)
      throw Error("--max-budget-usd must be a positive number greater than 0");
    return J;
  })
  .hideHelp())
```

**--settings**
```javascript
.option("--settings <file-or-json>",
  "Path to a settings JSON file or a JSON string to load additional settings from")
```

**--add-dir**
```javascript
.option("--add-dir <directories...>",
  "Additional directories to allow tool access to")
```

**--ide**
```javascript
.option("--ide",
  "Automatically connect to IDE on startup if exactly one valid IDE is available",
  () => true)
```

**--plugin-dir**
```javascript
.option("--plugin-dir <paths...>",
  "Load plugins from directories for this session only (repeatable)")
```

**--setting-sources**
```javascript
.option("--setting-sources <sources>",
  "Comma-separated list of setting sources to load (user, project, local).")
```

## Sub-Commands

### MCP Command

```javascript
let Q = A.command("mcp")
  .description("Configure and manage MCP servers")
  .helpOption("-h, --help", "Display help for command");
```

**Sub-commands:**
- `mcp serve` - Start the Claude Code MCP server
- `mcp add <name> <commandOrUrl> [args...]` - Add an MCP server
- `mcp remove <name>` - Remove an MCP server
- `mcp list` - List configured MCP servers
- `mcp get <name>` - Get details about an MCP server
- `mcp add-json <name> <json>` - Add MCP server with JSON string
- `mcp add-from-claude-desktop` - Import MCP servers from Claude Desktop
- `mcp reset-project-choices` - Reset all project-scoped MCP server approvals

### Plugin Command

```javascript
let G = A.command("plugin")
  .description("Manage Claude Code plugins")
  .helpOption("-h, --help", "Display help for command");
```

**Sub-commands:**
- `plugin validate <path>` - Validate a plugin or marketplace manifest
- `plugin marketplace add <source>` - Add a marketplace
- `plugin marketplace list` - List all configured marketplaces
- `plugin marketplace remove <name>` - Remove a marketplace
- `plugin marketplace update [name]` - Update marketplace(s)
- `plugin install <plugin>` - Install a plugin (alias: `i`)
- `plugin uninstall <plugin>` - Uninstall a plugin (alias: `remove`, `rm`)
- `plugin enable <plugin>` - Enable a disabled plugin
- `plugin disable <plugin>` - Disable an enabled plugin

### Other Commands

**setup-token**
```javascript
A.command("setup-token")
  .description("Set up a long-lived authentication token (requires Claude subscription)")
  .helpOption("-h, --help", "Display help for command")
```

**doctor**
```javascript
A.command("doctor")
  .description("Check the health of your Claude Code auto-updater")
  .helpOption("-h, --help", "Display help for command")
```

**update**
```javascript
A.command("update")
  .description("Check for updates and install if available")
  .helpOption("-h, --help", "Display help for command")
```

**install**
```javascript
A.command("install [target]")
  .description("Install Claude Code native build. Use [target] to specify version (stable, latest, or specific version)")
  .option("--force", "Force installation even if already installed")
  .helpOption("-h, --help", "Display help for command")
```

## Option Validators

### Custom Parsers

**Number Parser (max-budget-usd)**
```javascript
.argParser((Y) => {
  let J = Number(Y);
  if (isNaN(J) || J <= 0)
    throw Error("--max-budget-usd must be a positive number greater than 0");
  return J;
})
```

**Boolean Parser**
```javascript
.argParser(Boolean)
```

**String Parser**
```javascript
.argParser(String)
```

### Choice Validators

```javascript
.choices(["text", "json", "stream-json"])  // output-format
.choices(["text", "stream-json"])          // input-format
.choices(kR)                                // permission-mode
```

## Argument Processing

### Registering Options

```javascript
addOption(A) {
  this._registerOption(A);
  let Q = A.name(),
      B = A.attributeName();

  // Handle negate options (--no-*)
  if (A.negate) {
    let Z = A.long.replace(/^--no-/, "--");
    if (!this._findOption(Z))
      this.setOptionValueWithSource(B, A.defaultValue === void 0 ? true : A.defaultValue, "default");
  } else if (A.defaultValue !== void 0) {
    this.setOptionValueWithSource(B, A.defaultValue, "default");
  }

  // Set up event handlers
  this.on("option:" + Q, (Z) => {
    let I = `error: option '${A.flags}' argument '${Z}' is invalid.`;
    G(Z, I, "cli");
  });

  return this;
}
```

### Parsing Arguments

```javascript
_prepareUserArgs(A, Q) {
  if (A !== void 0 && !Array.isArray(A))
    throw Error("first parameter to parse must be array or undefined");

  if (Q = Q || {}, A === void 0 && Q.from === void 0) {
    if (eJ.versions?.electron) Q.from = "electron";
    let G = eJ.execArgv ?? [];
    if (G.includes("-e") || G.includes("--eval") ||
        G.includes("-p") || G.includes("--print"))
      Q.from = "eval";
  }

  if (A === void 0) A = eJ.argv;
  this.rawArgs = A.slice();

  // Extract user arguments based on 'from' source
  let B;
  switch (Q.from) {
    case "node":
      this._scriptPath = A[1];
      B = A.slice(2);
      break;
    case "user":
      B = A.slice(0);
      break;
    // ... other cases
  }

  return B;
}
```

## Hidden Options

Several options are marked as `.hideHelp()` and not shown in the help output:
- `--debug-to-stderr`
- `--max-thinking-tokens`
- `--max-turns`
- `--max-budget-usd`
- `--permission-prompt-tool`
- `--system-prompt-file`
- `--append-system-prompt-file`
- `--resume-session-at`
- `--enable-auth-status`
- `--sdk-url`
- `--teleport`
- `--remote`

## Version Handling

```javascript
A.version(`2.0.59 (Claude Code)`, "-v, --version", "Output the version number")
```

Fast path for version check in `mu3()`:
```javascript
if (A.length === 1 && (A[0] === "--version" || A[0] === "-v" || A[0] === "-V")) {
  M9("cli_version_fast_path");
  console.log(`2.0.59 (Claude Code)`);
  return;
}
```

## Notes

- The CLI framework is built on Commander.js (fJ1/pK0 classes)
- Options support custom parsers, choices, and validators
- Many options are context-specific (e.g., only work with `--print` mode)
- The system validates option combinations and provides helpful error messages
- Hidden options are available for advanced users but not documented in help text
