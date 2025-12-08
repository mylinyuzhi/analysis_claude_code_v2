# CLI Entry Points

## Overview

Claude Code v2.0.59 implements a sophisticated multi-mode CLI entry system that handles different execution contexts including standard CLI, MCP server mode, ripgrep integration, and SDK connections. The entry points are designed with performance optimization (fast paths) and modular code loading (dynamic imports).

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

Key functions in this document:
- `mainEntry` (mu3) - Primary CLI entry point with mode detection
- `commandHandler` (hu3) - Main Commander.js command setup and action handlers
- `initializeConfig` (FU9) - Pre-action configuration initialization
- `runMigrations` (ju3) - Database migration execution
- `renderInteractive` (VG) - Interactive UI rendering with Ink
- `runNonInteractive` (Rw9) - Print mode execution for pipes/automation
- `MainInteractiveApp` (WVA) - Primary React component for interactive mode
- `reportInitTelemetry` (gu3) - Initialization telemetry reporting
- `cleanupCursor` (uu3) - Terminal cursor cleanup on exit

---

## CLI Execution Flow

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            process.argv                                      │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          mu3() - mainEntry                                   │
│  ┌────────────┬─────────────┬─────────────┬─────────────────────────────┐   │
│  │  Version   │   MCP CLI   │   Ripgrep   │         Standard            │   │
│  │  Fast Path │    Mode     │    Mode     │           Mode              │   │
│  │ -v/--ver   │  --mcp-cli  │  --ripgrep  │     (default)               │   │
│  └─────┬──────┴──────┬──────┴──────┬──────┴─────────────┬───────────────┘   │
│        │             │             │                    │                    │
│        ▼             ▼             ▼                    ▼                    │
│   console.log    iz9(args)    ripgrepMain()     Dynamic Import              │
│   + return       + exit       + return          main module                  │
└─────────────────────────────────────────────────────────┬───────────────────┘
                                                          │
                                                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          hu3() - commandHandler                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                      Pre-Action Hook                                  │   │
│  │  FU9() → initializeConfig                                            │   │
│  │  ju3() → runMigrations                                               │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                  │                                           │
│                                  ▼                                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                     Option Extraction & Validation                    │   │
│  │  - Debug mode, print mode, session management                        │   │
│  │  - Permission mode, tool configuration                               │   │
│  │  - MCP server config, system prompts                                 │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                  │                                           │
│              ┌───────────────────┴───────────────────┐                      │
│              │                                       │                      │
│              ▼                                       ▼                      │
│     ┌─────────────────┐                    ┌─────────────────┐              │
│     │   Print Mode    │                    │ Interactive Mode│              │
│     │     (--print)   │                    │    (default)    │              │
│     └────────┬────────┘                    └────────┬────────┘              │
│              │                                      │                       │
│              ▼                                      ▼                       │
│         Rw9()                              ┌────────────────────┐           │
│      runNonInteractive                     │  Session Handling  │           │
│              │                             │  --continue        │           │
│              ▼                             │  --resume          │           │
│        Process input                       │  --teleport        │           │
│        Execute once                        │  --remote          │           │
│        Output result                       │  Fresh session     │           │
│        Exit                                └────────┬───────────┘           │
│                                                     │                       │
│                                                     ▼                       │
│                                                VG(WVA)                      │
│                                          renderInteractive                  │
│                                          (MainInteractiveApp)               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Primary Entry Point: mainEntry()

### Function Overview

```javascript
// ============================================
// mainEntry - Primary CLI entry point with mode detection
// Location: chunks.158.mjs:1438-1462
// ============================================

// ORIGINAL (for source lookup):
async function mu3() {
  let A = process.argv.slice(2);
  if (A.length === 1 && (A[0] === "--version" || A[0] === "-v" || A[0] === "-V")) {
    M9("cli_version_fast_path"), console.log(`${VERSION} (Claude Code)`);
    return
  }
  if (bZ() && A[0] === "--mcp-cli") {
    let B = A.slice(1);
    process.exit(await iz9(B))
  }
  if (A[0] === "--ripgrep") {
    M9("cli_ripgrep_path");
    let B = A.slice(1), { ripgrepMain: G } = await Promise.resolve().then(() => (sz9(), az9));
    process.exitCode = G(B);
    return
  }
  M9("cli_before_main_import");
  let { main: Q } = await Promise.resolve().then(() => (tw9(), ow9));
  M9("cli_after_main_import"), await Q(), M9("cli_after_main_complete")
}

// READABLE (for understanding):
async function mainEntry() {
  const args = process.argv.slice(2);

  // Fast path: Version check without loading full application
  if (args.length === 1 && (args[0] === "--version" || args[0] === "-v" || args[0] === "-V")) {
    emitTelemetry("cli_version_fast_path");
    console.log(`${VERSION} (Claude Code)`);
    return;
  }

  // MCP CLI mode: Delegate to MCP command handler
  if (isMcpEnabled() && args[0] === "--mcp-cli") {
    const mcpArgs = args.slice(1);
    process.exit(await mcpCliHandler(mcpArgs));
  }

  // Ripgrep mode: Execute embedded ripgrep binary
  if (args[0] === "--ripgrep") {
    emitTelemetry("cli_ripgrep_path");
    const rgArgs = args.slice(1);
    const { ripgrepMain } = await import("./ripgrep-module");
    process.exitCode = ripgrepMain(rgArgs);
    return;
  }

  // Standard mode: Load and execute main command handler
  emitTelemetry("cli_before_main_import");
  const { main } = await import("./main-module");
  emitTelemetry("cli_after_main_import");
  await main();  // This calls hu3() - commandHandler
  emitTelemetry("cli_after_main_complete");
}

// Mapping: mu3→mainEntry, A→args, M9→emitTelemetry, bZ→isMcpEnabled,
//          iz9→mcpCliHandler, sz9/az9→ripgrepModule, tw9/ow9→mainModule
```

### Execution Modes Deep Analysis

#### 1. Version Fast Path

**What it does:** Outputs version string immediately without loading the full application.

**How it works:**
1. Check if exactly one argument matches version flags
2. Emit telemetry marker for tracking
3. Output version string to stdout
4. Return immediately (no process.exit needed)

**Why this approach:**
- **Performance:** Avoids loading ~100KB+ of JavaScript modules
- **User experience:** Sub-100ms response for `claude --version`
- **Telemetry:** Can still track usage pattern without full init

**Trade-offs made:**
| Aspect | Decision | Rationale |
|--------|----------|-----------|
| Version source | Inline constant | Faster than package.json read |
| Duplication | Version string in two places | Acceptable for speed benefit |
| Electron support | Check both -v and -V | Commander.js convention |

**Key insight:** The triple flag check (`--version`, `-v`, `-V`) handles both standard Unix conventions and Commander.js defaults.

#### 2. MCP CLI Mode

**What it does:** Provides a command-line interface to interact with MCP servers from running Claude Code sessions.

**How it works:**
1. Check if MCP is enabled via `bZ()` (isMcpEnabled)
2. Verify first argument is `--mcp-cli`
3. Pass remaining arguments to `iz9()` (mcpCliHandler)
4. Exit with handler's return code

**Why this approach:**
- **Separation of concerns:** MCP CLI is a distinct feature from main CLI
- **Conditional loading:** Only loads MCP code when needed
- **Clean exit:** Uses process.exit for proper shell integration

**Entry condition:** The `bZ()` check ensures MCP mode is only available when configured. This prevents confusing errors when MCP isn't set up.

#### 3. Ripgrep Mode

**What it does:** Provides embedded ripgrep functionality for fast file searching.

**How it works:**
1. Detect `--ripgrep` as first argument
2. Dynamically import ripgrep module
3. Pass remaining arguments to ripgrep
4. Set exit code based on ripgrep result

**Why this approach:**
- **Dynamic import:** Ripgrep module is heavy; only load when needed
- **Code splitting:** `Promise.resolve().then()` pattern enables webpack chunking
- **Exit code passthrough:** Allows shell scripts to check ripgrep success/failure

**Module loading pattern:**
```javascript
// This pattern enables code splitting in bundlers
await Promise.resolve().then(() => (initModule(), moduleExports));
```

#### 4. Standard Mode

**What it does:** Loads the full application and executes the main command handler.

**How it works:**
1. Emit pre-import telemetry
2. Dynamically import main module
3. Emit post-import telemetry (measures import time)
4. Call main() which invokes `hu3()` (commandHandler)
5. Emit completion telemetry

**Why this approach:**
- **Deferred loading:** Full application only loads when actually needed
- **Measurable startup:** Telemetry brackets enable performance monitoring
- **Clean separation:** Entry point vs. application logic separated

---

## Command Handler: commandHandler()

### Function Overview

The `hu3()` function is the heart of the CLI, responsible for:
1. Setting up Commander.js with all options
2. Registering lifecycle hooks
3. Validating option combinations
4. Branching to print or interactive mode

### Pre-Action Hook

```javascript
// ============================================
// preActionHook - Pre-execution initialization
// Location: chunks.158.mjs:6-10
// ============================================

// ORIGINAL (for source lookup):
A.hook("preAction", async () => {
  M9("preAction_start");
  let Y = FU9();
  if (Y instanceof Promise) await Y;
  M9("preAction_after_init"), ju3(), M9("preAction_after_migrations")
})

// READABLE (for understanding):
commander.hook("preAction", async () => {
  emitTelemetry("preAction_start");

  // Initialize configuration (may be async)
  const initResult = initializeConfig();
  if (initResult instanceof Promise) {
    await initResult;
  }
  emitTelemetry("preAction_after_init");

  // Run any pending database migrations
  runMigrations();
  emitTelemetry("preAction_after_migrations");
});

// Mapping: A→commander, M9→emitTelemetry, FU9→initializeConfig, ju3→runMigrations
```

**Why pre-action hook:**
- Runs before ANY command (main or subcommands)
- Ensures config is loaded and migrations run first
- Separates initialization from command logic

### Main Action Handler Phases

The action handler executes in distinct phases:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Action Handler Phases                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Phase 1: OPTION EXTRACTION                                                  │
│  ├── Extract debug, print, permissions flags                                │
│  ├── Extract session management options                                     │
│  ├── Extract model and agent settings                                       │
│  └── Extract tool and MCP configurations                                    │
│                                                                              │
│  Phase 2: VALIDATION                                                         │
│  ├── Check for conflicting options (--session-id + --continue)             │
│  ├── Validate session ID format (UUID)                                      │
│  ├── Validate model configuration                                           │
│  └── Validate format combinations                                           │
│                                                                              │
│  Phase 3: CONFIGURATION LOADING                                              │
│  ├── Load system prompts (--system-prompt, --append-system-prompt)         │
│  ├── Parse MCP configurations (--mcp-config)                               │
│  ├── Resolve permission mode                                                │
│  └── Initialize tool permission context                                     │
│                                                                              │
│  Phase 4: MCP INITIALIZATION                                                 │
│  ├── Load MCP server configurations                                         │
│  ├── Separate SDK vs non-SDK servers                                       │
│  └── Initialize MCP clients                                                 │
│                                                                              │
│  Phase 5: INPUT PROCESSING                                                   │
│  ├── Read prompt from argument or stdin                                     │
│  ├── Process based on input format                                          │
│  └── Prepare tool list with JSON schema support                            │
│                                                                              │
│  Phase 6: MODE BRANCHING                                                     │
│  ├── Print Mode: runNonInteractive(Rw9)                                     │
│  └── Interactive Mode: Session handling → renderInteractive(VG)            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Phase 1: Option Extraction

```javascript
// ============================================
// optionExtraction - Extract CLI options from parsed args
// Location: chunks.158.mjs:22-44
// ============================================

// ORIGINAL (for source lookup):
let {
  debug: W = !1,
  debugToStderr: X = !1,
  dangerouslySkipPermissions: V,
  allowDangerouslySkipPermissions: F = !1,
  tools: K = [],
  allowedTools: D = [],
  disallowedTools: H = [],
  mcpConfig: C = [],
  permissionMode: E,
  addDir: U = [],
  fallbackModel: q,
  betas: w = [],
  ide: N = !1,
  sessionId: R,
  includePartialMessages: T,
  pluginDir: y = []
} = J, v = J.agents, x = J.agent;

// READABLE (for understanding):
const {
  debug = false,
  debugToStderr = false,
  dangerouslySkipPermissions,
  allowDangerouslySkipPermissions = false,
  tools = [],
  allowedTools = [],
  disallowedTools = [],
  mcpConfig = [],
  permissionMode,
  addDir = [],
  fallbackModel,
  betas = [],
  ide = false,
  sessionId,
  includePartialMessages,
  pluginDir = []
} = parsedOptions;

const agentsJson = parsedOptions.agents;
const agentOverride = parsedOptions.agent;

// Mapping: W→debug, X→debugToStderr, V→dangerouslySkipPermissions,
//          F→allowDangerouslySkipPermissions, K→tools, D→allowedTools,
//          H→disallowedTools, C→mcpConfig, E→permissionMode, U→addDir,
//          q→fallbackModel, w→betas, N→ide, R→sessionId,
//          T→includePartialMessages, y→pluginDir, v→agentsJson, x→agentOverride
```

### Phase 2: Validation Logic

```javascript
// ============================================
// sessionIdValidation - Validate --session-id option
// Location: chunks.158.mjs:59-67
// ============================================

// ORIGINAL (for source lookup):
if (R) {
  if (J.continue || J.resume)
    process.stderr.write(tA.red(`Error: --session-id cannot be used with --continue or --resume.\n`)),
    process.exit(1);
  let G0 = nE(R);
  if (!G0)
    process.stderr.write(tA.red(`Error: Invalid session ID. Must be a valid UUID.\n`)),
    process.exit(1);
  if (aE9(G0))
    process.stderr.write(tA.red(`Error: Session ID ${G0} is already in use.\n`)),
    process.exit(1)
}

// READABLE (for understanding):
if (sessionId) {
  // Conflict check: session-id is mutually exclusive with continue/resume
  if (parsedOptions.continue || parsedOptions.resume) {
    process.stderr.write(chalk.red(`Error: --session-id cannot be used with --continue or --resume.\n`));
    process.exit(1);
  }

  // Format validation: must be valid UUID
  const validatedId = validateUUID(sessionId);
  if (!validatedId) {
    process.stderr.write(chalk.red(`Error: Invalid session ID. Must be a valid UUID.\n`));
    process.exit(1);
  }

  // Uniqueness check: cannot reuse existing session ID
  if (sessionIdInUse(validatedId)) {
    process.stderr.write(chalk.red(`Error: Session ID ${validatedId} is already in use.\n`));
    process.exit(1);
  }
}

// Mapping: R→sessionId, J→parsedOptions, tA→chalk, nE→validateUUID, aE9→sessionIdInUse
```

**Validation Strategy:**
| Validation | Condition | Error Message |
|------------|-----------|---------------|
| Session ID conflict | --session-id with --continue/--resume | Cannot use together |
| Session ID format | Not valid UUID | Must be valid UUID |
| Session ID uniqueness | Already in use | Session ID in use |
| Fallback model | Same as main model | Cannot be same model |
| Input format | stream-json without output stream-json | Requires matching output |
| Tools option | Used without --print | Only with --print mode |

### Phase 3: System Prompt Loading

```javascript
// ============================================
// systemPromptLoading - Load and validate system prompts
// Location: chunks.158.mjs:71-98
// ============================================

// ORIGINAL (for source lookup):
let mA = J.systemPrompt;
if (J.systemPromptFile) {
  if (J.systemPrompt)
    process.stderr.write(tA.red(`Error: Cannot use both --system-prompt and --system-prompt-file.\n`)),
    process.exit(1);
  try {
    let G0 = SD0(J.systemPromptFile);
    if (!YW1(G0))
      process.stderr.write(tA.red(`Error: System prompt file not found: ${G0}\n`)),
      process.exit(1);
    mA = nw9(G0, "utf8")
  } catch (G0) {
    process.stderr.write(tA.red(`Error reading system prompt file: ${G0 instanceof Error?G0.message:String(G0)}\n`)),
    process.exit(1)
  }
}

// READABLE (for understanding):
let systemPrompt = parsedOptions.systemPrompt;

if (parsedOptions.systemPromptFile) {
  // Mutual exclusion: cannot use both flag and file
  if (parsedOptions.systemPrompt) {
    process.stderr.write(chalk.red(`Error: Cannot use both --system-prompt and --system-prompt-file.\n`));
    process.exit(1);
  }

  try {
    const resolvedPath = resolvePath(parsedOptions.systemPromptFile);

    // File existence check
    if (!fileExists(resolvedPath)) {
      process.stderr.write(chalk.red(`Error: System prompt file not found: ${resolvedPath}\n`));
      process.exit(1);
    }

    // Read file content
    systemPrompt = readFileSync(resolvedPath, "utf8");
  } catch (error) {
    process.stderr.write(chalk.red(`Error reading system prompt file: ${error instanceof Error ? error.message : String(error)}\n`));
    process.exit(1);
  }
}

// Mapping: mA→systemPrompt, J→parsedOptions, tA→chalk, SD0→resolvePath,
//          YW1→fileExists, nw9→readFileSync
```

### Phase 4: MCP Configuration Loading

```javascript
// ============================================
// mcpConfigLoading - Parse and merge MCP configurations
// Location: chunks.158.mjs:108-157
// ============================================

// ORIGINAL (for source lookup):
let yA = {};
if (C && C.length > 0) {
  let G0 = C.map((sQ) => sQ.trim()).filter((sQ) => sQ.length > 0),
    yQ = {},
    aQ = [];
  for (let sQ of G0) {
    let K0 = null, mB = [], e2 = f7(sQ);
    if (e2) {
      let s8 = ZMA({ configObject: e2, filePath: "command line", expandVars: !0, scope: "dynamic" });
      if (s8.config) K0 = s8.config.mcpServers;
      else mB = s8.errors
    } else {
      let s8 = SD0(sQ),
        K5 = BYA({ filePath: s8, expandVars: !0, scope: "dynamic" });
      if (K5.config) K0 = K5.config.mcpServers;
      else mB = K5.errors
    }
    if (mB.length > 0) aQ.push(...mB);
    else if (K0) yQ = { ...yQ, ...K0 }
  }
  if (aQ.length > 0) {
    let sQ = aQ.map((K0) => `${K0.path?K0.path+": ":""}${K0.message}`).join(`\n`);
    throw Error(`Invalid MCP configuration:\n${sQ}`)
  }
  if (Object.keys(yQ).length > 0) {
    let sQ = ns(yQ, (K0) => ({ ...K0, scope: "dynamic" }));
    yA = { ...yA, ...sQ }
  }
}

// READABLE (for understanding):
let dynamicMcpConfig = {};

if (mcpConfigArgs && mcpConfigArgs.length > 0) {
  // Filter empty entries
  const configEntries = mcpConfigArgs
    .map(entry => entry.trim())
    .filter(entry => entry.length > 0);

  let mergedServers = {};
  let allErrors = [];

  for (const entry of configEntries) {
    let servers = null;
    let errors = [];

    // Try parsing as JSON first
    const jsonParsed = tryParseJSON(entry);
    if (jsonParsed) {
      // Direct JSON object provided
      const result = validateMcpConfig({
        configObject: jsonParsed,
        filePath: "command line",
        expandVars: true,
        scope: "dynamic"
      });
      if (result.config) servers = result.config.mcpServers;
      else errors = result.errors;
    } else {
      // Treat as file path
      const resolvedPath = resolvePath(entry);
      const result = loadMcpConfigFile({
        filePath: resolvedPath,
        expandVars: true,
        scope: "dynamic"
      });
      if (result.config) servers = result.config.mcpServers;
      else errors = result.errors;
    }

    if (errors.length > 0) {
      allErrors.push(...errors);
    } else if (servers) {
      mergedServers = { ...mergedServers, ...servers };
    }
  }

  // Throw if any config had errors
  if (allErrors.length > 0) {
    const errorMessage = allErrors
      .map(err => `${err.path ? err.path + ": " : ""}${err.message}`)
      .join("\n");
    throw Error(`Invalid MCP configuration:\n${errorMessage}`);
  }

  // Mark all servers as dynamic scope
  if (Object.keys(mergedServers).length > 0) {
    const scopedServers = mapValues(mergedServers, server => ({
      ...server,
      scope: "dynamic"
    }));
    dynamicMcpConfig = { ...dynamicMcpConfig, ...scopedServers };
  }
}

// Mapping: yA→dynamicMcpConfig, C→mcpConfigArgs, f7→tryParseJSON,
//          ZMA→validateMcpConfig, SD0→resolvePath, BYA→loadMcpConfigFile,
//          ns→mapValues
```

**MCP Config Loading Algorithm:**

**What it does:** Parses MCP server configurations from CLI args, supporting both JSON strings and file paths.

**How it works:**
1. Filter and trim config entries
2. For each entry:
   - Try parsing as JSON (inline config)
   - If JSON fails, treat as file path
   - Validate and extract mcpServers
3. Collect all errors for batch reporting
4. Merge servers with `scope: "dynamic"` marker
5. Throw if any errors occurred

**Why this approach:**
- **Flexibility:** Supports both inline JSON and file references
- **Validation first:** All configs validated before any are used
- **Clear errors:** All errors reported together, not fail-fast
- **Scope tracking:** Dynamic configs marked for differentiation from static

### Phase 5: Mode Branching

```javascript
// ============================================
// modeBranching - Branch to print or interactive mode
// Location: chunks.158.mjs:294-340
// ============================================

// ORIGINAL (for source lookup):
if (OA) {
  // Print mode (non-interactive)
  if (p === "stream-json" || p === "json") Dz0(!0);
  BD0();
  let G0 = w1.filter((aQ) => aQ.type === "prompt" && !aQ.disableNonInteractive || aQ.type === "local" && aQ.supportsNonInteractive),
    yQ = wp();
  // ... setup appState for non-interactive
  Rw9($A, async () => yQ, /* ... */);
  return
}
// Interactive mode
let C0 = bu3(!1);
// ... setup for interactive
await VG(d3.default.createElement(yG, { /* ... */ }), C0)

// READABLE (for understanding):
if (isPrintMode) {
  // === PRINT MODE (Non-Interactive) ===

  // Enable JSON output formatting
  if (outputFormat === "stream-json" || outputFormat === "json") {
    setJsonOutputMode(true);
  }
  disableInteractiveFeatures();

  // Filter commands compatible with non-interactive mode
  const compatibleCommands = allCommands.filter(cmd =>
    (cmd.type === "prompt" && !cmd.disableNonInteractive) ||
    (cmd.type === "local" && cmd.supportsNonInteractive)
  );

  // Initialize minimal app state
  const appState = getDefaultAppState();

  // Execute non-interactive handler
  runNonInteractive(
    stdinPrompt,
    () => appState,
    compatibleCommands,
    tools,
    /* ... */
  );
  return;
}

// === INTERACTIVE MODE (Default) ===

const renderOptions = createRenderOptions(false);

// Setup interactive UI and enter main loop
await renderInteractive(
  React.createElement(AppStateProvider, {
    initialState: appState,
    onChangeAppState: stateUpdateCallback
  },
    React.createElement(MainInteractiveApp, {
      debug: debugMode,
      commands: [...localCommands, ...mcpCommands],
      initialPrompt: stdinPrompt,
      // ...
    })
  ),
  renderOptions
);

// Mapping: OA→isPrintMode, p→outputFormat, Dz0→setJsonOutputMode, BD0→disableInteractiveFeatures,
//          w1→allCommands, wp→getDefaultAppState, Rw9→runNonInteractive, $A→stdinPrompt,
//          bu3→createRenderOptions, VG→renderInteractive, yG→AppStateProvider,
//          WVA→MainInteractiveApp, Yu→stateUpdateCallback
```

---

## Session Management

### Session Handling Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Session Handling Decision                            │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┬─────────────────┐
        │                         │                         │                 │
        ▼                         ▼                         ▼                 ▼
┌───────────────┐     ┌───────────────────┐     ┌───────────────┐     ┌───────────────┐
│  --continue   │     │ --resume [value]  │     │  --teleport   │     │ Fresh Session │
│               │     │                   │     │  --remote     │     │   (default)   │
└───────┬───────┘     └─────────┬─────────┘     └───────┬───────┘     └───────┬───────┘
        │                       │                       │                     │
        ▼                       ▼                       ▼                     ▼
   Load most              Search/select              Cloud session        Generate new
   recent session         by ID or query            sync/create          session ID
        │                       │                       │                     │
        ▼                       ▼                       ▼                     ▼
   Restore messages       Restore messages        Sync messages         Empty history
   Restore file state     Restore file state      from remote           Run hooks
        │                       │                       │                     │
        └───────────────────────┼───────────────────────┘                     │
                                │                                             │
                        ┌───────┴───────┐                                     │
                        │ --fork-session│                                     │
                        │    check      │                                     │
                        └───────┬───────┘                                     │
                                │                                             │
                    ┌───────────┴───────────┐                                 │
                    ▼                       ▼                                 │
             New session ID          Keep original ID                        │
                    │                       │                                 │
                    └───────────────────────┴─────────────────────────────────┘
                                            │
                                            ▼
                                    MainInteractiveApp
```

### Continue Session Logic

```javascript
// ============================================
// continueSession - Load and continue most recent conversation
// Location: chunks.158.mjs:416-442
// ============================================

// ORIGINAL (for source lookup):
if (Tu3(), J.continue) try {
  GA("tengu_continue", {});
  let G0 = await ki(void 0, void 0);
  if (!G0) console.error("No conversation found to continue"), process.exit(1);
  if (!J.forkSession) {
    if (G0.sessionId) zR(G0.sessionId), await Fx()
  }
  await VG(d3.default.createElement(yG, {
    initialState: f0,
    onChangeAppState: Yu
  }, d3.default.createElement(WVA, {
    debug: W || X,
    initialPrompt: $A,
    commands: [...w1, ...W1],
    initialMessages: G0.messages,
    initialFileHistorySnapshots: G0.fileHistorySnapshots,
    // ...
  })), C0)
} catch (G0) {
  AA(G0 instanceof Error ? G0 : Error(String(G0))), process.exit(1)
}

// READABLE (for understanding):
if (setupTerminalCursor(), parsedOptions.continue) {
  try {
    // Track usage
    trackEvent("tengu_continue", {});

    // Load most recent conversation
    const lastSession = await loadMostRecentSession(undefined, undefined);
    if (!lastSession) {
      console.error("No conversation found to continue");
      process.exit(1);
    }

    // Session ID handling: keep or fork
    if (!parsedOptions.forkSession) {
      if (lastSession.sessionId) {
        setSessionId(lastSession.sessionId);
        await syncSessionState();
      }
    }

    // Render with restored state
    await renderInteractive(
      React.createElement(AppStateProvider, {
        initialState: appState,
        onChangeAppState: stateUpdateCallback
      },
        React.createElement(MainInteractiveApp, {
          debug: debugEnabled,
          initialPrompt: stdinPrompt,
          commands: [...localCommands, ...mcpCommands],
          initialMessages: lastSession.messages,
          initialFileHistorySnapshots: lastSession.fileHistorySnapshots,
          // ...
        })
      ),
      renderOptions
    );
  } catch (error) {
    logError(error instanceof Error ? error : Error(String(error)));
    process.exit(1);
  }
}

// Mapping: Tu3→setupTerminalCursor, J→parsedOptions, GA→trackEvent, ki→loadMostRecentSession,
//          zR→setSessionId, Fx→syncSessionState, VG→renderInteractive, yG→AppStateProvider,
//          f0→appState, Yu→stateUpdateCallback, WVA→MainInteractiveApp, W/X→debugEnabled,
//          $A→stdinPrompt, w1→localCommands, W1→mcpCommands, AA→logError
```

---

## Telemetry Integration

### Telemetry Event Timeline

```
mu3() START
  │
  ├── cli_version_fast_path (version flag detected)
  │   └── RETURN
  │
  ├── cli_ripgrep_path (ripgrep mode)
  │   └── RETURN
  │
  ├── cli_before_main_import
  ├── cli_after_main_import
  │
  └── hu3() START
      ├── run_function_start
      ├── run_commander_initialized
      │
      └── preAction hook
          ├── preAction_start
          ├── preAction_after_init
          └── preAction_after_migrations
          │
          └── action handler
              ├── action_handler_start
              ├── action_mcp_configs_loaded
              ├── action_after_input_prompt
              ├── action_tools_loaded
              ├── action_before_setup
              ├── action_after_setup
              ├── action_commands_loaded
              ├── action_after_plugins_init
              ├── action_after_hooks
              │
              └── run_before_parse
              └── run_after_parse
              └── main_after_run
              └── cli_after_main_complete
```

### reportInitTelemetry Function

```javascript
// ============================================
// reportInitTelemetry - Report initialization telemetry
// Location: chunks.158.mjs:987-1044
// ============================================

// ORIGINAL (for source lookup):
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
      // ... all params
    })
  } catch (w) {
    AA(w instanceof Error ? w : Error(String(w)))
  }
}

// READABLE (for understanding):
async function reportInitTelemetry({
  hasInitialPrompt,
  hasStdin,
  verbose,
  debug,
  debugToStderr,
  print,
  outputFormat,
  inputFormat,
  numAllowedTools,
  numDisallowedTools,
  mcpClientCount,
  worktree,
  skipWebFetchPreflight,
  githubActionInputs,
  dangerouslySkipPermissionsPassed,
  modeIsBypass,
  allowDangerouslySkipPermissionsPassed,
  systemPromptFlag,
  appendSystemPromptFlag
}) {
  try {
    const remoteHash = await getRemoteHash();

    trackEvent("tengu_init", {
      entrypoint: "claude",
      hasInitialPrompt,
      hasStdin,
      verbose,
      debug,
      debugToStderr,
      print,
      outputFormat,
      inputFormat,
      numAllowedTools,
      numDisallowedTools,
      mcpClientCount,
      worktree,
      skipWebFetchPreflight,
      ...(githubActionInputs && { githubActionInputs }),
      dangerouslySkipPermissionsPassed,
      modeIsBypass,
      allowDangerouslySkipPermissionsPassed,
      ...(systemPromptFlag && { systemPromptFlag }),
      ...(appendSystemPromptFlag && { appendSystemPromptFlag }),
      ...(remoteHash && { rh: remoteHash })
    });
  } catch (error) {
    logError(error instanceof Error ? error : Error(String(error)));
  }
}

// Mapping: gu3→reportInitTelemetry, GA→trackEvent, uCB→getRemoteHash, AA→logError
```

---

## Terminal Cleanup

```javascript
// ============================================
// cleanupCursor - Reset terminal cursor state on exit
// Location: chunks.158.mjs:1046-1048
// ============================================

// ORIGINAL (for source lookup):
function uu3() {
  (process.stderr.isTTY ? process.stderr : process.stdout.isTTY ? process.stdout : void 0)
    ?.write(`\x1B[?25h${Iu1}`)
}

// READABLE (for understanding):
function cleanupCursor() {
  // Select appropriate output stream (prefer stderr, fallback to stdout)
  const ttyStream = process.stderr.isTTY
    ? process.stderr
    : process.stdout.isTTY
      ? process.stdout
      : undefined;

  // Write ANSI escape sequences:
  // \x1B[?25h = Show cursor
  // Iu1 = Additional reset sequence (likely color reset)
  ttyStream?.write(`\x1B[?25h${TERMINAL_RESET_SEQUENCE}`);
}

// Mapping: uu3→cleanupCursor, Iu1→TERMINAL_RESET_SEQUENCE
```

**Why this approach:**
- **TTY detection:** Only writes escape codes to actual terminal
- **Stream preference:** stderr preferred (doesn't pollute stdout)
- **Graceful handling:** Uses optional chaining for non-TTY environments

---

## Module Loading Pattern

### Dynamic Import Strategy

```javascript
// Pattern used for code splitting
await Promise.resolve().then(() => (initFunction(), moduleExports));

// Example: Loading main module
let { main: Q } = await Promise.resolve().then(() => (tw9(), ow9));

// Example: Loading ripgrep
let { ripgrepMain: G } = await Promise.resolve().then(() => (sz9(), az9));
```

**Why this pattern:**
1. **Webpack chunking:** `Promise.resolve().then()` creates a split point
2. **Init function:** `tw9()` runs side effects before export access
3. **Named exports:** Destructuring gets specific exports efficiently

**Benefits:**
- Fast startup (version check doesn't load full app)
- Memory efficient (unused modules never loaded)
- Measurable (telemetry can bracket import time)

---

## Error Handling Strategy

### Error Propagation Pattern

```javascript
// All errors caught and logged via AA (logError)
try {
  // ... operation
} catch (error) {
  AA(error instanceof Error ? error : Error(String(error)));
  process.exit(1);
}
```

**Why this approach:**
- **Type normalization:** Converts any thrown value to Error
- **Centralized logging:** All errors go through single logging function
- **Clean exit:** Ensures proper exit code for shell scripts

---

## Summary

The CLI entry point system provides:

| Feature | Implementation | Benefit |
|---------|----------------|---------|
| Fast paths | Version, ripgrep, MCP modes | Sub-100ms startup for common ops |
| Code splitting | Dynamic imports with bundler hints | Minimal memory for simple tasks |
| Lifecycle hooks | Commander.js preAction/postAction | Clean initialization sequence |
| Mode branching | Print vs Interactive | Support both automation and humans |
| Session management | Continue/Resume/Teleport | Workflow continuity |
| Error handling | Centralized logging + exit codes | Shell script integration |
| Telemetry | Granular event tracking | Performance monitoring |
