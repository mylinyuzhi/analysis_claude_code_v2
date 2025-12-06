# CLI Entry Points

## Overview

Claude Code v2.0.59 has a sophisticated entry point system that handles different execution modes, including standard CLI, MCP CLI, and ripgrep integration. The main entry points are defined in `chunks.158.mjs`.

## Main Entry Function: mu3()

The `mu3()` function is the primary entry point for Claude Code, located at the end of `chunks.158.mjs`:

```javascript
async function mu3() {
  let A = process.argv.slice(2);

  // Fast path for version check
  if (A.length === 1 && (A[0] === "--version" || A[0] === "-v" || A[0] === "-V")) {
    M9("cli_version_fast_path");
    console.log(`2.0.59 (Claude Code)`);
    return;
  }

  // MCP CLI mode
  if (bZ() && A[0] === "--mcp-cli") {
    let B = A.slice(1);
    process.exit(await iz9(B));
  }

  // Ripgrep integration
  if (A[0] === "--ripgrep") {
    M9("cli_ripgrep_path");
    let B = A.slice(1),
        { ripgrepMain: G } = await Promise.resolve().then(() => (sz9(), az9));
    process.exitCode = G(B);
    return;
  }

  // Standard CLI execution
  M9("cli_before_main_import");
  let { main: Q } = await Promise.resolve().then(() => (tw9(), ow9));
  M9("cli_after_main_import");
  await Q();
  M9("cli_after_main_complete");
}
```

### Execution Modes

1. **Version Check (Fast Path)**
   - Detects `-v`, `-V`, or `--version` flags
   - Immediately prints version without loading full application
   - Telemetry event: `cli_version_fast_path`

2. **MCP CLI Mode**
   - Triggered by `--mcp-cli` flag
   - Delegates to `iz9()` function for MCP command processing
   - Exits with MCP CLI exit code

3. **Ripgrep Mode**
   - Triggered by `--ripgrep` flag
   - Loads ripgrep module dynamically
   - Executes ripgrep with remaining arguments

4. **Standard Mode**
   - Dynamically imports main module
   - Calls `main()` function to start full application

## Command Handler: hu3()

The `hu3()` function is the core command handler that sets up Commander.js and processes all CLI commands:

```javascript
async function hu3() {
  M9("run_function_start");
  let A = new fJ1;  // Commander instance
  M9("run_commander_initialized");

  // Pre-action hook
  A.hook("preAction", async () => {
    M9("preAction_start");
    let Y = FU9();
    if (Y instanceof Promise) await Y;
    M9("preAction_after_init");
    ju3();
    M9("preAction_after_migrations");
  });

  // Main command configuration
  A.name("claude")
    .description("Claude Code - starts an interactive session by default, use -p/--print for non-interactive output")
    .argument("[prompt]", "Your prompt", String)
    .helpOption("-h, --help", "Display help for command")
    // ... options configuration (see argument_parsing.md)

  // Main action handler
  .action(async (Y, J) => {
    // ... action implementation
  });

  // ... sub-commands setup

  M9("run_before_parse");
  await A.parseAsync(process.argv);
  M9("run_after_parse");
  M9("main_after_run");
  wz0();
  return A;
}
```

## Pre-Action Hook

The pre-action hook runs before any command action:

```javascript
A.hook("preAction", async () => {
  M9("preAction_start");

  // Initialize something (FU9)
  let Y = FU9();
  if (Y instanceof Promise) await Y;
  M9("preAction_after_init");

  // Run migrations (ju3)
  ju3();
  M9("preAction_after_migrations");
});
```

### Hook Execution Flow

1. Emit telemetry event: `preAction_start`
2. Execute `FU9()` - initialization function
3. Wait if initialization is async
4. Emit telemetry event: `preAction_after_init`
5. Run migrations via `ju3()`
6. Emit telemetry event: `preAction_after_migrations`

## Main Action Handler

The main action handler is complex and handles the primary Claude Code execution:

```javascript
.action(async (Y, J) => {
  M9("action_handler_start");

  // Handle "code" prompt (deprecated usage)
  if (Y === "code") {
    GA("tengu_code_prompt_ignored", {});
    console.warn(tA.yellow("Tip: You can launch Claude Code with just `claude`"));
    Y = void 0;
  }

  // Track single-word prompts
  if (Y && typeof Y === "string" && !/\s/.test(Y) && Y.length > 0) {
    GA("tengu_single_word_prompt", { length: Y.length });
  }

  // Extract options
  let {
    debug: W = false,
    debugToStderr: X = false,
    dangerouslySkipPermissions: V,
    allowDangerouslySkipPermissions: F = false,
    tools: K = [],
    allowedTools: D = [],
    disallowedTools: H = [],
    mcpConfig: C = [],
    permissionMode: E,
    addDir: U = [],
    fallbackModel: q,
    betas: w = [],
    ide: N = false,
    sessionId: R,
    includePartialMessages: T,
    pluginDir: y = []
  } = J;

  // ... rest of action implementation
})
```

### Action Flow

1. **Validation Phase**
   - Validate CLI options combinations
   - Check for conflicting options
   - Validate session ID format
   - Validate model configuration

2. **Configuration Phase**
   - Load MCP configurations
   - Setup tool permissions
   - Load plugins if specified
   - Configure system prompts

3. **Initialization Phase**
   - Initialize telemetry
   - Load commands and agents
   - Setup MCP clients
   - Configure output formats

4. **Execution Phase**
   - **Print Mode**: Non-interactive execution
   - **Interactive Mode**: Full UI with Ink

## Post-Action Hook

While not explicitly shown in the excerpts, Commander.js supports `postAction` hooks:

```javascript
A.hook("postAction", async (thisCommand, actionCommand) => {
  // Cleanup or post-processing
});
```

## Lifecycle Hooks in Commander

Commander.js supports three lifecycle hooks:

1. **preSubcommand**: Before executing a sub-command
2. **preAction**: Before executing an action
3. **postAction**: After executing an action

Implementation in Commander:

```javascript
hook(A, Q) {
  let B = ["preSubcommand", "preAction", "postAction"];
  if (!B.includes(A))
    throw Error(`Unexpected value for event passed to hook : '${A}'.
Expecting one of '${B.join("', '")}'`);

  if (this._lifeCycleHooks[A])
    this._lifeCycleHooks[A].push(Q);
  else
    this._lifeCycleHooks[A] = [Q];

  return this;
}
```

### Hook Chaining

Hooks are chained and executed in sequence:

```javascript
_chainOrCallHooks(A, Q) {
  let B = A,
      G = [];

  // Collect hooks from command and ancestors
  this._getCommandAndAncestors()
    .reverse()
    .filter((Z) => Z._lifeCycleHooks[Q] !== void 0)
    .forEach((Z) => {
      Z._lifeCycleHooks[Q].forEach((I) => {
        G.push({
          hookedCommand: Z,
          callback: I
        });
      });
    });

  // Reverse for postAction
  if (Q === "postAction") G.reverse();

  // Chain execution
  G.forEach((Z) => {
    B = this._chainOrCall(B, () => {
      return Z.callback(Z.hookedCommand, this);
    });
  });

  return B;
}
```

## Telemetry Integration

### Telemetry Events (M9 function)

The entry points emit various telemetry markers:

```javascript
M9("run_function_start")           // hu3() starts
M9("run_commander_initialized")     // Commander created
M9("preAction_start")              // Pre-action hook starts
M9("preAction_after_init")         // After initialization
M9("preAction_after_migrations")   // After migrations
M9("action_handler_start")         // Main action starts
M9("action_mcp_configs_loaded")    // MCP configs loaded
M9("action_after_input_prompt")    // Prompt processed
M9("action_tools_loaded")          // Tools loaded
M9("action_before_setup")          // Before setup
M9("action_after_setup")           // After setup
M9("action_commands_loaded")       // Commands loaded
M9("action_after_plugins_init")    // Plugins initialized
M9("action_after_hooks")           // Hooks executed
M9("run_before_parse")             // Before parsing
M9("run_after_parse")              // After parsing
M9("main_after_run")               // Main execution done
```

### Analytics Events (GA function)

```javascript
GA("tengu_code_prompt_ignored", {})
GA("tengu_single_word_prompt", { length: Y.length })
GA("tengu_mcp_start", {})
GA("tengu_init", { /* detailed params */ })
// ... many more
```

## Initialization Function: gu3()

Reports initialization telemetry:

```javascript
async function gu3({
  hasInitialPrompt: A,
  hasStdin: Q,
  verbose: B,
  debug: G,
  debugToStderr: Z,
  print: I,
  outputFormat: Y,
  inputFormat: J,
  numAllowedTools: W,
  numDisallowedTools: X,
  mcpClientCount: V,
  worktree: F,
  skipWebFetchPreflight: K,
  githubActionInputs: D,
  dangerouslySkipPermissionsPassed: H,
  modeIsBypass: C,
  allowDangerouslySkipPermissionsPassed: E,
  systemPromptFlag: U,
  appendSystemPromptFlag: q
}) {
  try {
    let w = await uCB();
    GA("tengu_init", {
      entrypoint: "claude",
      hasInitialPrompt: A,
      hasStdin: Q,
      verbose: B,
      debug: G,
      debugToStderr: Z,
      print: I,
      outputFormat: Y,
      inputFormat: J,
      numAllowedTools: W,
      numDisallowedTools: X,
      mcpClientCount: V,
      worktree: F,
      skipWebFetchPreflight: K,
      ...D && { githubActionInputs: D },
      dangerouslySkipPermissionsPassed: H,
      modeIsBypass: C,
      allowDangerouslySkipPermissionsPassed: E,
      ...U && { systemPromptFlag: U },
      ...q && { appendSystemPromptFlag: q },
      ...w && { rh: w }
    });
  } catch (w) {
    AA(w instanceof Error ? w : Error(String(w)));
  }
}
```

## Cleanup Function: uu3()

Cleanup cursor state on exit:

```javascript
function uu3() {
  (process.stderr.isTTY ? process.stderr :
   process.stdout.isTTY ? process.stdout : void 0)
    ?.write(`\x1B[?25h${Iu1}`);  // Show cursor + reset
}
```

## Module Loading Pattern

The entry points use dynamic imports for code splitting:

```javascript
// Dynamic import of main module
let { main: Q } = await Promise.resolve().then(() => (tw9(), ow9));

// Dynamic import of ripgrep
let { ripgrepMain: G } = await Promise.resolve().then(() => (sz9(), az9));
```

This pattern:
- Reduces initial load time
- Enables fast paths (version check)
- Loads heavy modules only when needed

## Error Handling

The main action handler includes comprehensive error handling:

```javascript
try {
  // Main execution
  await VG(d3.default.createElement(yG, {
    initialState: f0,
    onChangeAppState: Yu
  }, d3.default.createElement(WVA, {
    // ... component props
  })), C0);
} catch (G0) {
  AA(G0 instanceof Error ? G0 : Error(String(G0)));
  process.exit(1);
}
```

## Command Parsing

The async parsing flow:

```javascript
async parseAsync(A, Q) {
  let B = this._prepareUserArgs(A, Q);
  return await this._parseCommand([], B), this;
}
```

This delegates to `_parseCommand()` which:
1. Parses options
2. Extracts operands and unknown options
3. Dispatches to sub-commands or main action
4. Executes lifecycle hooks

## Summary

The entry point system provides:

1. **Multiple execution modes**: CLI, MCP, ripgrep
2. **Fast paths**: Version check without full load
3. **Lifecycle hooks**: Pre/post action processing
4. **Comprehensive telemetry**: Track every phase
5. **Dynamic loading**: Code splitting for performance
6. **Error handling**: Graceful error management
7. **Flexible configuration**: Options, sub-commands, validators
