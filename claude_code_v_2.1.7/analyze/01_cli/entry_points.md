# CLI Entry Points

## Overview

Claude Code v2.1.7 implements a sophisticated multi-mode CLI entry system that handles different execution contexts including standard CLI, MCP server mode, ripgrep integration, Chrome extension integration, and SDK connections. The entry points are designed with performance optimization (fast paths) and modular code loading (dynamic imports).

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `mainEntry` (D_7) - Primary CLI entry point with mode detection
- `commandHandler` (J_7) - Main Commander.js command setup and action handlers
- `reportInitTelemetry` (X_7) - Initialization telemetry reporting
- `cleanupCursor` (I_7) - Terminal cursor cleanup on exit
- `mcpCliHandler` (nX9) - MCP CLI mode handler
- `claudeInChromeMcp` (oX9) - Chrome MCP server startup
- `chromeNativeHostMain` (AI9) - Chrome native host main entry
- `MainInteractiveApp` (v$A) - Primary React component for interactive mode
- `runNonInteractive` (hw9) - Print mode execution for pipes/automation

---

## CLI Execution Flow

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            process.argv                                      │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          D_7() - mainEntry                                   │
│  ┌──────────┬───────────┬───────────┬─────────────┬─────────────┬────────┐  │
│  │ Version  │  MCP CLI  │  Ripgrep  │ Chrome MCP  │Chrome Native│Standard│  │
│  │ FastPath │   Mode    │   Mode    │   Server    │    Host     │  Mode  │  │
│  │-v/--ver  │--mcp-cli  │--ripgrep  │--claude-in- │--chrome-    │(default│  │
│  │          │           │           │chrome-mcp   │native-host  │        │  │
│  └────┬─────┴─────┬─────┴─────┬─────┴──────┬──────┴──────┬──────┴───┬────┘  │
│       │           │           │            │             │          │       │
│       ▼           ▼           ▼            ▼             ▼          ▼       │
│  console.log  nX9(args)  ripgrepMain()  oX9()        AI9()   Dynamic Import │
│  + return     + exit     + return       + return     + return  main module  │
└─────────────────────────────────────────────────────────────────┬───────────┘
                                                                  │
                                                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          J_7() - commandHandler                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                      Pre-Action Hook                                  │   │
│  │  zI9() → initializeConfig                                            │   │
│  │  K12() → runMigrations                                               │   │
│  │  sR7() → runConfigMigrations                                         │   │
│  │  zL2() → loadRemoteSettings                                          │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                  │                                           │
│                                  ▼                                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                     Option Extraction & Validation                    │   │
│  │  - Debug mode, print mode, session management                        │   │
│  │  - Permission mode, tool configuration                               │   │
│  │  - MCP server config, system prompts                                 │   │
│  │  - Chrome integration flags                                          │   │
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
│         hw9()                              ┌────────────────────┐           │
│      runNonInteractive                     │  Session Handling  │           │
│              │                             │  --continue        │           │
│              ▼                             │  --resume          │           │
│        Process input                       │  --teleport        │           │
│        Execute once                        │  --remote          │           │
│        Output result                       │  Fresh session     │           │
│        Exit                                └────────┬───────────┘           │
│                                                     │                       │
│                                                     ▼                       │
│                                                Y5(v$A)                      │
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
// Location: chunks.157.mjs:1860-1891
// ============================================

// ORIGINAL (for source lookup):
async function D_7() {
  let A = process.argv.slice(2);
  if (A.length === 1 && (A[0] === "--version" || A[0] === "-v" || A[0] === "-V")) {
    x9("cli_version_fast_path"), console.log(`${{ISSUES_EXPLAINER:"...",VERSION:"2.1.7",...}.VERSION} (Claude Code)`);
    return
  }
  if (A[0] === "--mcp-cli" && jJ()) {
    let B = A.slice(1);
    process.exit(await nX9(B))
  }
  if (A[0] === "--ripgrep") {
    x9("cli_ripgrep_path");
    let B = A.slice(1),
      { ripgrepMain: G } = await Promise.resolve().then(() => (ZI9(), GI9));
    process.exitCode = G(B);
    return
  }
  if (process.argv[2] === "--claude-in-chrome-mcp") {
    x9("cli_claude_in_chrome_mcp_path"), await oX9();
    return
  } else if (process.argv[2] === "--chrome-native-host") {
    x9("cli_chrome_native_host_path"), await AI9();
    return
  }
  x9("cli_before_main_import");
  let { main: Q } = await Promise.resolve().then(() => (UL9(), CL9));
  x9("cli_after_main_import"), await Q(), x9("cli_after_main_complete")
}

// READABLE (for understanding):
async function mainEntry() {
  const args = process.argv.slice(2);

  // Mode 1: Version Fast Path - immediate response without loading full app
  if (args.length === 1 && (args[0] === "--version" || args[0] === "-v" || args[0] === "-V")) {
    emitTelemetry("cli_version_fast_path");
    console.log(`${VERSION} (Claude Code)`);
    return;
  }

  // Mode 2: MCP CLI Mode - delegate to MCP command handler
  if (args[0] === "--mcp-cli" && isMcpEnabled()) {
    const mcpArgs = args.slice(1);
    process.exit(await mcpCliHandler(mcpArgs));
  }

  // Mode 3: Ripgrep Mode - execute embedded ripgrep binary
  if (args[0] === "--ripgrep") {
    emitTelemetry("cli_ripgrep_path");
    const rgArgs = args.slice(1);
    const { ripgrepMain } = await import("./ripgrep-module");
    process.exitCode = ripgrepMain(rgArgs);
    return;
  }

  // Mode 4: Chrome MCP Server Mode - start MCP server for Chrome extension
  if (process.argv[2] === "--claude-in-chrome-mcp") {
    emitTelemetry("cli_claude_in_chrome_mcp_path");
    await claudeInChromeMcp();
    return;
  }

  // Mode 5: Chrome Native Host Mode - native messaging host for Chrome
  if (process.argv[2] === "--chrome-native-host") {
    emitTelemetry("cli_chrome_native_host_path");
    await chromeNativeHostMain();
    return;
  }

  // Mode 6: Standard Mode - load and execute main command handler
  emitTelemetry("cli_before_main_import");
  const { main } = await import("./main-module");
  emitTelemetry("cli_after_main_import");
  await main();  // This calls J_7() - commandHandler
  emitTelemetry("cli_after_main_complete");
}

// Mapping: D_7→mainEntry, A→args, x9→emitTelemetry, jJ→isMcpEnabled,
//          nX9→mcpCliHandler, ZI9/GI9→ripgrepModule, oX9→claudeInChromeMcp,
//          AI9→chromeNativeHostMain, UL9/CL9→mainModule
```

### Execution Modes Deep Analysis

#### Mode 1: Version Fast Path

**What it does:** Outputs version string immediately without loading the full application.

**How it works:**
1. Check if exactly one argument matches version flags (`--version`, `-v`, `-V`)
2. Emit telemetry marker for tracking
3. Output version string to stdout
4. Return immediately (no process.exit needed)

**Why this approach:**
- **Performance:** Avoids loading ~100KB+ of JavaScript modules
- **User experience:** Sub-100ms response for `claude --version`
- **Telemetry:** Can still track usage pattern without full init

**Key insight:** The triple flag check (`--version`, `-v`, `-V`) handles both standard Unix conventions and Commander.js defaults.

#### Mode 2: MCP CLI Mode

**What it does:** Provides a command-line interface to interact with MCP servers from running Claude Code sessions.

**How it works:**
1. Check if MCP is enabled via `jJ()` (isMcpEnabled)
2. Verify first argument is `--mcp-cli`
3. Pass remaining arguments to `nX9()` (mcpCliHandler)
4. Exit with handler's return code

**Why this approach:**
- **Separation of concerns:** MCP CLI is a distinct feature from main CLI
- **Conditional loading:** Only loads MCP code when needed
- **Clean exit:** Uses process.exit for proper shell integration

#### Mode 3: Ripgrep Mode

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

#### Mode 4: Chrome MCP Server Mode (NEW in 2.0.72)

**What it does:** Starts an MCP server that communicates with the Claude Chrome extension.

**How it works:**
1. Detect `--claude-in-chrome-mcp` argument
2. Emit telemetry marker
3. Call `oX9()` (claudeInChromeMcp) to start server
4. Server listens on Unix domain socket for extension connections

**Why this approach:**
- **Dedicated mode:** Chrome integration needs persistent server process
- **Socket communication:** Uses Unix domain socket for secure local IPC
- **MCP protocol:** Leverages existing MCP infrastructure

```javascript
// ============================================
// claudeInChromeMcp - Chrome MCP server startup
// Location: chunks.157.mjs:1599-1616
// ============================================

// ORIGINAL (for source lookup):
async function oX9() {
  let A = new rX9,
    Q = {
      serverName: "Claude in Chrome",
      logger: A,
      socketPath: sfA(),
      clientTypeId: "claude-code",
      onAuthenticationError: () => {
        A.warn("Authentication error occurred...")
      },
      onToolCallDisconnected: () => {
        return `Browser extension is not connected...`
      }
    },
    B = PT0(Q),
    G = new kuA;
  k("[Claude in Chrome] Starting MCP server"), await B.connect(G), k("[Claude in Chrome] MCP server started")
}

// READABLE (for understanding):
async function claudeInChromeMcp() {
  const logger = new ChromeLogger();
  const config = {
    serverName: "Claude in Chrome",
    logger: logger,
    socketPath: getChromeMcpSocketPath(),
    clientTypeId: "claude-code",
    onAuthenticationError: () => {
      logger.warn("Authentication error occurred...");
    },
    onToolCallDisconnected: () => {
      return `Browser extension is not connected...`;
    }
  };
  const mcpServer = createMcpServer(config);
  const transport = new StdioTransport();
  debug("[Claude in Chrome] Starting MCP server");
  await mcpServer.connect(transport);
  debug("[Claude in Chrome] MCP server started");
}

// Mapping: oX9→claudeInChromeMcp, rX9→ChromeLogger, sfA→getChromeMcpSocketPath,
//          PT0→createMcpServer, kuA→StdioTransport, k→debug
```

#### Mode 5: Chrome Native Host Mode (NEW in 2.0.72)

**What it does:** Runs as a Chrome Native Messaging host for browser extension communication.

**How it works:**
1. Detect `--chrome-native-host` argument
2. Emit telemetry marker
3. Call `AI9()` (chromeNativeHostMain)
4. Start socket server and message reader
5. Handle native messaging protocol (length-prefixed JSON)

```javascript
// ============================================
// chromeNativeHostMain - Chrome native host entry
// Location: chunks.157.mjs:1666-1677
// ============================================

// ORIGINAL (for source lookup):
async function AI9() {
  FW("Initializing...");
  let A = new QI9,  // ChromeNativeHostServer
    Q = new BI9;    // NativeMessageReader
  await A.start();
  while (!0) {
    let B = await Q.read();
    if (B === null) break;
    await A.handleMessage(B)
  }
  await A.stop()
}

// READABLE (for understanding):
async function chromeNativeHostMain() {
  logNativeHost("Initializing...");
  const server = new ChromeNativeHostServer();
  const reader = new NativeMessageReader();

  await server.start();

  // Main message loop - read until stdin closes
  while (true) {
    const message = await reader.read();
    if (message === null) break;
    await server.handleMessage(message);
  }

  await server.stop();
}

// Mapping: AI9→chromeNativeHostMain, FW→logNativeHost,
//          QI9→ChromeNativeHostServer, BI9→NativeMessageReader
```

#### Mode 6: Standard Mode

**What it does:** Loads the full application and executes the main command handler.

**How it works:**
1. Emit pre-import telemetry
2. Dynamically import main module
3. Emit post-import telemetry (measures import time)
4. Call main() which invokes `J_7()` (commandHandler)
5. Emit completion telemetry

---

## Command Handler: commandHandler()

### Function Overview

The `J_7()` function is the heart of the CLI, responsible for:
1. Setting up Commander.js with all options
2. Registering lifecycle hooks
3. Validating option combinations
4. Branching to print or interactive mode

### Pre-Action Hook

```javascript
// ============================================
// preActionHook - Pre-execution initialization
// Location: chunks.157.mjs:16-20
// ============================================

// ORIGINAL (for source lookup):
Q.hook("preAction", async () => {
  x9("preAction_start");
  let X = zI9();
  if (X instanceof Promise) await X;
  x9("preAction_after_init"), K12(), sR7(), x9("preAction_after_migrations"), zL2(), x9("preAction_after_remote_settings")
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
  runConfigMigrations();
  emitTelemetry("preAction_after_migrations");

  // Load remote settings
  loadRemoteSettings();
  emitTelemetry("preAction_after_remote_settings");
});

// Mapping: Q→commander, x9→emitTelemetry, zI9→initializeConfig,
//          K12→runMigrations, sR7→runConfigMigrations, zL2→loadRemoteSettings
```

### initializeConfig (zI9) Deep Analysis

**What it does:** Performs comprehensive application initialization including config loading, network setup, and environment preparation.

**How it works:**

```javascript
// ============================================
// initializeConfig - Main initialization function
// Location: chunks.149.mjs:2065-2105
// ============================================

// ORIGINAL (for source lookup):
zI9 = W0(() => {
  let A = Date.now();
  OB("info", "init_started"), x9("init_function_start");
  try {
    nOA();                           // Enable configs
    x9("init_configs_enabled");

    KI9();                           // Apply safe environment variables
    x9("init_safe_env_vars_applied");

    HC.initialize();                 // Initialize settings detector
    x9("init_settings_detector_initialized");

    k$1.initialize();                // Initialize skill detector
    x9("init_skill_detector_initialized");

    LZ2();                           // Setup graceful shutdown
    x9("init_after_graceful_shutdown");

    IKB();                           // Initialize 1P event logging
    x9("init_after_1p_event_logging");

    jEQ();                           // Populate OAuth
    x9("init_after_oauth_populate");

    if (iH0()) FL2();                // Remote settings check
    x9("init_after_remote_settings_check");

    B2B();                           // Additional setup
    btQ();                           // Configure global mTLS
    mtQ();                           // Configure global agents/proxy
    x9("init_network_configured");

    F7Q();                           // Final setup
    C6(Sy2);                         // Register cleanup

    if (jJ()) {                      // If MCP enabled
      process.env.CLAUDE_CODE_SESSION_ID = q0();  // Set session ID
      AX9();                         // MCP initialization
    }

    if (K$A()) YX9();                // Create scratchpad if needed

    x9("init_function_end")
  } catch (Q) {
    if (Q instanceof Hq) return VI9({ error: Q });
    else throw Q
  }
});

// READABLE (for understanding):
initializeConfig = memoize(() => {
  const startTime = Date.now();
  logStructured("info", "init_started");
  emitTelemetry("init_function_start");

  try {
    // Phase 1: Configuration Loading
    enableConfigs();                          // Load all config files
    emitTelemetry("init_configs_enabled");

    // Phase 2: Environment Setup
    applySafeEnvVars();                       // Apply safe defaults
    emitTelemetry("init_safe_env_vars_applied");

    // Phase 3: Detector Initialization
    SettingsDetector.initialize();            // Watch for settings changes
    emitTelemetry("init_settings_detector_initialized");

    SkillDetector.initialize();               // Watch for skill files
    emitTelemetry("init_skill_detector_initialized");

    // Phase 4: Lifecycle Setup
    setupGracefulShutdown();                  // Handle SIGTERM, SIGINT
    emitTelemetry("init_after_graceful_shutdown");

    // Phase 5: Analytics & Auth
    initializeEventLogging();                 // First-party telemetry
    emitTelemetry("init_after_1p_event_logging");

    populateOAuth();                          // Load OAuth tokens
    emitTelemetry("init_after_oauth_populate");

    // Phase 6: Remote Settings
    if (shouldLoadRemoteSettings()) {
      loadRemoteSettingsNow();
    }
    emitTelemetry("init_after_remote_settings_check");

    // Phase 7: Network Configuration
    additionalSetup();
    configureMTLS();                          // Configure mTLS certificates
    configureGlobalAgents();                  // Configure HTTP proxy
    emitTelemetry("init_network_configured");

    // Phase 8: Final Setup
    finalSetup();
    registerCleanupHandler(cleanupHandler);

    // Phase 9: MCP Setup (if enabled)
    if (isMcpEnabled()) {
      process.env.CLAUDE_CODE_SESSION_ID = generateSessionId();
      initializeMcp();
    }

    // Phase 10: Scratchpad (if enabled)
    if (shouldCreateScratchpad()) {
      createScratchpad();
    }

    logStructured("info", "init_completed", {
      duration_ms: Date.now() - startTime
    });
    emitTelemetry("init_function_end");
  } catch (error) {
    if (error instanceof ConfigError) {
      return handleConfigError({ error });
    }
    throw error;
  }
});

// Mapping: W0→memoize, OB→logStructured, x9→emitTelemetry, nOA→enableConfigs,
//          KI9→applySafeEnvVars, HC→SettingsDetector, k$1→SkillDetector,
//          LZ2→setupGracefulShutdown, IKB→initializeEventLogging,
//          jEQ→populateOAuth, iH0→shouldLoadRemoteSettings, FL2→loadRemoteSettingsNow,
//          btQ→configureMTLS, mtQ→configureGlobalAgents, jJ→isMcpEnabled,
//          q0→generateSessionId, AX9→initializeMcp, K$A→shouldCreateScratchpad,
//          YX9→createScratchpad, Hq→ConfigError
```

**Initialization phases summary:**

| Phase | Function | Purpose |
|-------|----------|---------|
| 1 | enableConfigs | Load settings.json files |
| 2 | applySafeEnvVars | Set safe environment defaults |
| 3 | Detectors | Watch for config/skill changes |
| 4 | Lifecycle | Setup shutdown handlers |
| 5 | Auth | Initialize telemetry and OAuth |
| 6 | Remote | Load remote settings if enabled |
| 7 | Network | Configure mTLS and proxy |
| 8 | Final | Register cleanup handlers |
| 9 | MCP | Initialize MCP if enabled |
| 10 | Scratchpad | Create working directory |

### Main Action Handler Phases

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Action Handler Phases                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Phase 1: OPTION EXTRACTION                                                  │
│  ├── Extract debug, print, permissions flags                                │
│  ├── Extract session management options                                     │
│  ├── Extract model and agent settings                                       │
│  ├── Extract tool and MCP configurations                                    │
│  └── Extract Chrome integration flags (NEW)                                 │
│                                                                              │
│  Phase 2: VALIDATION                                                         │
│  ├── Check for conflicting options (--session-id + --continue)             │
│  ├── Validate session ID format (UUID)                                      │
│  ├── Validate model configuration (--fallback-model != --model)            │
│  ├── Validate format combinations (stream-json requirements)               │
│  └── Validate enterprise MCP restrictions                                   │
│                                                                              │
│  Phase 3: CONFIGURATION LOADING                                              │
│  ├── Load system prompts (--system-prompt, --append-system-prompt)         │
│  ├── Parse MCP configurations (--mcp-config)                               │
│  ├── Resolve permission mode                                                │
│  ├── Initialize tool permission context                                     │
│  └── Setup Chrome integration if enabled                                    │
│                                                                              │
│  Phase 4: MCP INITIALIZATION                                                 │
│  ├── Load MCP server configurations                                         │
│  ├── Separate SDK vs non-SDK servers                                       │
│  ├── Initialize MCP clients                                                 │
│  └── Start MCP CLI endpoint if needed                                      │
│                                                                              │
│  Phase 5: INPUT PROCESSING                                                   │
│  ├── Read prompt from argument or stdin                                     │
│  ├── Process based on input format                                          │
│  ├── Prepare tool list                                                      │
│  └── Add JSON schema tool if configured                                     │
│                                                                              │
│  Phase 6: MODE BRANCHING                                                     │
│  ├── Print Mode: runNonInteractive(hw9)                                     │
│  └── Interactive Mode: Session handling → renderInteractive                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Phase 1: Option Extraction

```javascript
// ============================================
// optionExtraction - Extract CLI options from parsed args
// Location: chunks.157.mjs:32-48
// ============================================

// ORIGINAL (for source lookup):
let {
  debug: D = !1,
  debugToStderr: W = !1,
  dangerouslySkipPermissions: K,
  allowDangerouslySkipPermissions: V = !1,
  tools: F = [],
  allowedTools: H = [],
  disallowedTools: E = [],
  mcpConfig: z = [],
  permissionMode: $,
  addDir: O = [],
  fallbackModel: L,
  betas: M = [],
  ide: _ = !1,
  sessionId: j,
  includePartialMessages: x,
  pluginDir: b = []
} = I, S = I.agents, u = I.agent;

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

// Mapping: D→debug, W→debugToStderr, K→dangerouslySkipPermissions,
//          V→allowDangerouslySkipPermissions, F→tools, H→allowedTools,
//          E→disallowedTools, z→mcpConfig, $→permissionMode, O→addDir,
//          L→fallbackModel, M→betas, _→ide, j→sessionId,
//          x→includePartialMessages, b→pluginDir, S→agentsJson, u→agentOverride
```

### Phase 2: Session ID Validation

```javascript
// ============================================
// sessionIdValidation - Validate --session-id option
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

// READABLE (for understanding):
if (sessionId) {
  // Conflict check: session-id with continue/resume requires fork-session
  if ((parsedOptions.continue || parsedOptions.resume) && !parsedOptions.forkSession) {
    process.stderr.write(chalk.red(`Error: --session-id can only be used with --continue or --resume if --fork-session is also specified.\n`));
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

// Mapping: j→sessionId, I→parsedOptions, I1→chalk, BU→validateUUID, bJ9→sessionIdInUse
```

### Phase 3: Chrome Integration Setup (NEW in 2.0.72)

```javascript
// ============================================
// chromeIntegrationSetup - Setup Claude in Chrome integration
// Location: chunks.157.mjs:208-244
// ============================================

// ORIGINAL (for source lookup):
let A1 = az1(I.chrome) && qB(),
  n1 = !A1 && I$A();
if (A1) {
  let PQ = $Q();
  try {
    l("tengu_claude_in_chrome_setup", { platform: PQ });
    let { mcpConfig: z2, allowedTools: w4, systemPrompt: Y6 } = oz1();
    if (J1 = { ...J1, ...z2 }, H.push(...w4), Y6) xA = xA ? `${Y6}\n\n${xA}` : Y6
  } catch (z2) {
    l("tengu_claude_in_chrome_setup_failed", { platform: PQ }), k(`[Claude in Chrome] Error: ${z2}`),
    e(z2 instanceof Error ? z2 : Error(String(z2))), console.error("Error: Failed to run with Claude in Chrome."), process.exit(1)
  }
} else if (n1) try {
  let { mcpConfig: PQ } = oz1();
  J1 = { ...J1, ...PQ }, xA = xA ? `${xA}\n\n${xT0}` : xT0
} catch (PQ) {
  k(`[Claude in Chrome] Error (auto-enable): ${PQ}`)
}

// READABLE (for understanding):
const chromeExplicitlyEnabled = parseBoolean(parsedOptions.chrome) && isChromePlatformSupported();
const chromeAutoEnabled = !chromeExplicitlyEnabled && shouldAutoEnableChrome();

if (chromeExplicitlyEnabled) {
  const platform = getPlatform();
  try {
    trackEvent("tengu_claude_in_chrome_setup", { platform });
    const { mcpConfig, allowedTools, systemPrompt } = getChromeIntegrationConfig();

    // Merge Chrome MCP config
    dynamicMcpConfig = { ...dynamicMcpConfig, ...mcpConfig };

    // Add Chrome-allowed tools
    allowedToolsList.push(...allowedTools);

    // Prepend Chrome system prompt
    if (systemPrompt) {
      appendSystemPrompt = appendSystemPrompt
        ? `${systemPrompt}\n\n${appendSystemPrompt}`
        : systemPrompt;
    }
  } catch (error) {
    trackEvent("tengu_claude_in_chrome_setup_failed", { platform });
    debug(`[Claude in Chrome] Error: ${error}`);
    logError(error instanceof Error ? error : Error(String(error)));
    console.error("Error: Failed to run with Claude in Chrome.");
    process.exit(1);
  }
} else if (chromeAutoEnabled) {
  try {
    const { mcpConfig } = getChromeIntegrationConfig();
    dynamicMcpConfig = { ...dynamicMcpConfig, ...mcpConfig };
    appendSystemPrompt = appendSystemPrompt
      ? `${appendSystemPrompt}\n\n${CHROME_AUTO_PROMPT}`
      : CHROME_AUTO_PROMPT;
  } catch (error) {
    debug(`[Claude in Chrome] Error (auto-enable): ${error}`);
  }
}

// Mapping: A1→chromeExplicitlyEnabled, n1→chromeAutoEnabled, az1→parseBoolean,
//          qB→isChromePlatformSupported, I$A→shouldAutoEnableChrome, $Q→getPlatform,
//          oz1→getChromeIntegrationConfig, J1→dynamicMcpConfig, H→allowedToolsList,
//          xA→appendSystemPrompt, xT0→CHROME_AUTO_PROMPT
```

### Phase 6: Mode Branching

```javascript
// ============================================
// modeBranching - Branch to print or interactive mode
// Location: chunks.157.mjs:406-454
// ============================================

// ORIGINAL (for source lookup):
if (CA) {
  // Print mode (non-interactive)
  if (f === "stream-json" || f === "json") Of0(!0);
  L8A(), IS0();
  let PQ = jA ? [] : Y0.filter((w4) => w4.type === "prompt" && !w4.disableNonInteractive || w4.type === "local" && w4.supportsNonInteractive),
    z2 = HzA();
  // ... setup appState for non-interactive
  hw9($A, async () => z2, /* ... */);
  return
}
// Interactive mode
let tB = Z_7(!1);
// ... setup for interactive
await Y5(K3.default.createElement(b5, { /* ... */ }), tB)

// READABLE (for understanding):
if (isPrintMode) {
  // === PRINT MODE (Non-Interactive) ===

  // Enable JSON output formatting if requested
  if (outputFormat === "stream-json" || outputFormat === "json") {
    setJsonOutputMode(true);
  }
  disableInteractivePrompts();
  disableTTYOutput();

  // Filter commands compatible with non-interactive mode
  const compatibleCommands = disableSlashCommands ? [] : allCommands.filter(cmd =>
    (cmd.type === "prompt" && !cmd.disableNonInteractive) ||
    (cmd.type === "local" && cmd.supportsNonInteractive)
  );

  // Initialize minimal app state
  const appState = getDefaultAppState();

  // Execute non-interactive handler
  runNonInteractive(
    stdinPrompt,
    () => appState,
    updateStateCallback,
    compatibleCommands,
    tools,
    sdkMcpServers,
    activeAgents,
    {
      continue: parsedOptions.continue,
      resume: parsedOptions.resume,
      verbose,
      outputFormat,
      jsonSchema,
      // ... more options
    }
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

// Mapping: CA→isPrintMode, f→outputFormat, Of0→setJsonOutputMode, L8A→disableInteractivePrompts,
//          IS0→disableTTYOutput, jA→disableSlashCommands, Y0→allCommands,
//          HzA→getDefaultAppState, hw9→runNonInteractive, $A→stdinPrompt,
//          Z_7→createRenderOptions, Y5→renderInteractive, b5→AppStateProvider,
//          v$A→MainInteractiveApp
```

---

## Session Management

### Session Handling Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Session Handling Decision                            │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────┬─────────────┐
        │                             │                         │             │
        ▼                             ▼                         ▼             ▼
┌───────────────┐     ┌───────────────────┐     ┌───────────────┐     ┌───────────────┐
│  --continue   │     │ --resume [value]  │     │  --teleport   │     │ Fresh Session │
│               │     │                   │     │  --remote     │     │   (default)   │
└───────┬───────┘     └─────────┬─────────┘     └───────┬───────┘     └───────┬───────┘
        │                       │                       │                     │
        ▼                       ▼                       ▼                     ▼
   Load most              Search/select              Cloud session        Generate new
   recent session         by ID or NAME             sync/create          session ID
        │                       │                       │                     │
        ▼                       ▼                       ▼                     ▼
   Restore messages       Restore messages        Sync messages         Empty history
   Restore file state     Restore file state      from remote           Run startup hooks
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

### Session Persistence Format

**What it does:** Sessions are persisted to disk for resume/continue functionality.

**Session data structure:**

```javascript
// ============================================
// sessionDataFormat - Session persistence structure
// Location: chunks.120.mjs:2608-2643
// ============================================

// Session object returned by loadMostRecentSession (Zt):
{
  messages: [
    // Array of user/assistant messages
    {
      type: "user" | "assistant",
      message: {
        role: "user" | "assistant",
        content: [/* content blocks */]
      },
      uuid: "unique-id",
      timestamp: "2024-01-01T00:00:00.000Z",
      requestId?: "api-request-id"  // Assistant only
    }
  ],

  fileHistorySnapshots: {
    // Map of message UUID → file state at that point
    "message-uuid-1": {
      "/path/to/file1.ts": {
        content: "file content at this point",
        timestamp: 1704067200000
      }
    }
  },

  attributionSnapshots: {
    // Attribution data for tracking file changes
    "message-uuid-1": {
      files: ["/path/to/file1.ts"],
      linesChanged: 50
    }
  },

  sessionId: "uuid-session-id"
}
```

**Session file location:** `~/.claude/sessions/<session-id>.jsonl`

**JSONL format:** Each line is a JSON object representing a message or event.

```javascript
// ============================================
// loadMostRecentSession - Load and restore session
// Location: chunks.120.mjs:2608-2643
// ============================================

// ORIGINAL (for source lookup):
async function Zt(A, Q) {
  try {
    let B = null, G = null, Z;
    if (A === void 0) B = await xu2(0);  // Load most recent
    else if (Q) {
      // Load from specific JSONL file
      G = [];
      for (let J of await Fg(Q)) {
        if (J.type === "assistant" || J.type === "user") {
          let X = el5(J);
          if (X) G.push(X)
        }
        Z = J.session_id
      }
    } else if (typeof A === "string") B = await Gq0(A), Z = A;  // Load by ID
    else B = A;
    if (!B && !G) return null;
    if (B) {
      if (Gj(B)) B = await Vx(B);  // Expand if needed
      if (!Z) Z = xX(B);            // Extract session ID
      if (w71(B), Z) W71(B, lz(Z)); // Update paths
      EW1(B), G = B.messages
    }
    G = dbA(G);                     // Normalize messages
    let Y = await WU("resume", Z);  // Execute resume hooks
    return G.push(...Y), {
      messages: G,
      fileHistorySnapshots: B?.fileHistorySnapshots,
      attributionSnapshots: B?.attributionSnapshots,
      sessionId: Z
    }
  } catch (B) {
    throw e(B), B
  }
}

// READABLE (for understanding):
async function loadMostRecentSession(sessionIdOrData, jsonlFilePath) {
  try {
    let sessionData = null;
    let messages = null;
    let sessionId;

    if (sessionIdOrData === undefined) {
      // Load most recent session from index
      sessionData = await loadRecentSessionByIndex(0);
    } else if (jsonlFilePath) {
      // Load from specific JSONL file (replay mode)
      messages = [];
      for (const line of await parseJsonlFile(jsonlFilePath)) {
        if (line.type === "assistant" || line.type === "user") {
          const converted = convertToMessage(line);
          if (converted) messages.push(converted);
        }
        sessionId = line.session_id;
      }
    } else if (typeof sessionIdOrData === "string") {
      // Load by session ID
      sessionData = await loadSessionById(sessionIdOrData);
      sessionId = sessionIdOrData;
    } else {
      // Use provided session data directly
      sessionData = sessionIdOrData;
    }

    if (!sessionData && !messages) return null;

    if (sessionData) {
      // Expand compressed session if needed
      if (isCompressed(sessionData)) {
        sessionData = await decompressSession(sessionData);
      }

      // Extract session ID if not set
      if (!sessionId) sessionId = extractSessionId(sessionData);

      // Update file paths for current workspace
      validateSessionData(sessionData);
      if (sessionId) updateSessionPaths(sessionData, formatSessionPath(sessionId));

      // Process session data
      processSessionData(sessionData);
      messages = sessionData.messages;
    }

    // Normalize messages
    messages = normalizeMessages(messages);

    // Execute resume hooks (may add messages)
    const hookMessages = await executeHooks("resume", sessionId);

    return {
      messages: [...messages, ...hookMessages],
      fileHistorySnapshots: sessionData?.fileHistorySnapshots,
      attributionSnapshots: sessionData?.attributionSnapshots,
      sessionId: sessionId
    };
  } catch (error) {
    logError(error);
    throw error;
  }
}

// Mapping: Zt→loadMostRecentSession, xu2→loadRecentSessionByIndex, Fg→parseJsonlFile,
//          el5→convertToMessage, Gq0→loadSessionById, Gj→isCompressed, Vx→decompressSession,
//          xX→extractSessionId, w71→validateSessionData, W71→updateSessionPaths,
//          lz→formatSessionPath, EW1→processSessionData, dbA→normalizeMessages,
//          WU→executeHooks, e→logError
```

**File history snapshot purpose:**
- Enables `--rewind-files` to restore file state at any message
- Tracks file content for diff/undo operations
- Supports file attribution for tracking changes

---

### Named Session Support (NEW in 2.0.64)

```javascript
// ============================================
// namedSessionResume - Resume session by name
// Location: chunks.157.mjs:624-634
// ============================================

// ORIGINAL (for source lookup):
if (I.resume && typeof I.resume === "string" && !w4) {
  let eB = I.resume.trim();
  if (eB) {
    let L4 = await Q$A(eB, { exact: !0 });
    if (L4.length === 1) w4 = xX(L4[0]) ?? null;
    else Y6 = eB
  }
}

// READABLE (for understanding):
// If --resume is a string that's not a valid UUID, try to find by name
if (parsedOptions.resume && typeof parsedOptions.resume === "string" && !validatedSessionId) {
  const searchTerm = parsedOptions.resume.trim();
  if (searchTerm) {
    const matchingSessions = await searchSessionsByName(searchTerm, { exact: true });
    if (matchingSessions.length === 1) {
      // Found exactly one match - use its session ID
      validatedSessionId = extractSessionId(matchingSessions[0]) ?? null;
    } else {
      // Multiple or no matches - use as search query for picker
      initialSearchQuery = searchTerm;
    }
  }
}

// Mapping: I→parsedOptions, w4→validatedSessionId, Q$A→searchSessionsByName,
//          xX→extractSessionId, Y6→initialSearchQuery
```

### Continue Session Logic

```javascript
// ============================================
// continueSession - Load and continue most recent conversation
// Location: chunks.157.mjs:585-619
// ============================================

// ORIGINAL (for source lookup):
if (I.continue) try {
  l("tengu_continue", {}), XE1();
  let PQ = await Zt(void 0, void 0);
  if (!PQ) console.error("No conversation found to continue"), process.exit(1);
  if (!I.forkSession) {
    if (PQ.sessionId) pw(lz(PQ.sessionId)), await wj(), NOA(PQ.sessionId)
  }
  let z2 = $G,
    { waitUntilExit: w4 } = await Y5(K3.default.createElement(b5, {
      initialState: z2,
      onChangeAppState: dp
    }, K3.default.createElement(v$A, {
      debug: D || W,
      commands: [...Y0, ...s0],
      initialMessages: PQ.messages,
      initialFileHistorySnapshots: PQ.fileHistorySnapshots,
      // ...
    })), tB);
  await w4(), await w3(0)
} catch (PQ) {
  e(PQ instanceof Error ? PQ : Error(String(PQ))), process.exit(1)
}

// READABLE (for understanding):
if (parsedOptions.continue) {
  try {
    // Track usage
    trackEvent("tengu_continue", {});
    markSessionRestored();

    // Load most recent conversation
    const lastSession = await loadMostRecentSession(undefined, undefined);
    if (!lastSession) {
      console.error("No conversation found to continue");
      process.exit(1);
    }

    // Session ID handling: keep original unless forking
    if (!parsedOptions.forkSession) {
      if (lastSession.sessionId) {
        setSessionIdPath(formatSessionPath(lastSession.sessionId));
        await syncSessionState();
        markSessionActive(lastSession.sessionId);
      }
    }

    // Render with restored state
    const appState = initialAppState;
    const { waitUntilExit } = await renderInteractive(
      React.createElement(AppStateProvider, {
        initialState: appState,
        onChangeAppState: stateUpdateCallback
      },
        React.createElement(MainInteractiveApp, {
          debug: debugEnabled,
          commands: [...localCommands, ...mcpCommands],
          initialMessages: lastSession.messages,
          initialFileHistorySnapshots: lastSession.fileHistorySnapshots,
          // ...
        })
      ),
      renderOptions
    );

    await waitUntilExit();
    await gracefulExit(0);
  } catch (error) {
    logError(error instanceof Error ? error : Error(String(error)));
    process.exit(1);
  }
}

// Mapping: I→parsedOptions, l→trackEvent, XE1→markSessionRestored, Zt→loadMostRecentSession,
//          pw→setSessionIdPath, lz→formatSessionPath, wj→syncSessionState, NOA→markSessionActive,
//          $G→initialAppState, dp→stateUpdateCallback, Y5→renderInteractive, b5→AppStateProvider,
//          v$A→MainInteractiveApp, Y0→localCommands, s0→mcpCommands, w3→gracefulExit, e→logError
```

---

## Telemetry Integration

### Telemetry Event Timeline

```
D_7() START
  │
  ├── cli_version_fast_path (version flag detected)
  │   └── RETURN
  │
  ├── cli_ripgrep_path (ripgrep mode)
  │   └── RETURN
  │
  ├── cli_claude_in_chrome_mcp_path (Chrome MCP mode)
  │   └── RETURN
  │
  ├── cli_chrome_native_host_path (Chrome native host)
  │   └── RETURN
  │
  ├── cli_before_main_import
  ├── cli_after_main_import
  │
  └── J_7() START
      ├── run_function_start
      ├── run_commander_initialized
      │
      └── preAction hook
          ├── preAction_start
          ├── preAction_after_init
          ├── preAction_after_migrations
          └── preAction_after_remote_settings
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
// Location: chunks.157.mjs:1155-1212
// ============================================

// ORIGINAL (for source lookup):
async function X_7({
  hasInitialPrompt: A,
  hasStdin: Q,
  verbose: B,
  debug: G,
  debugToStderr: Z,
  print: Y,
  outputFormat: J,
  inputFormat: X,
  numAllowedTools: I,
  numDisallowedTools: D,
  mcpClientCount: W,
  worktreeEnabled: K,
  skipWebFetchPreflight: V,
  githubActionInputs: F,
  dangerouslySkipPermissionsPassed: H,
  modeIsBypass: E,
  allowDangerouslySkipPermissionsPassed: z,
  systemPromptFlag: $,
  appendSystemPromptFlag: O
}) {
  try {
    let L = await pBB();
    l("tengu_init", {
      entrypoint: "claude",
      hasInitialPrompt: A,
      hasStdin: Q,
      verbose: B,
      // ... all params
      ...L && { rh: L }
    })
  } catch (L) {
    e(L instanceof Error ? L : Error(String(L)))
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
  worktreeEnabled,
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
      worktree: worktreeEnabled,
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

// Mapping: X_7→reportInitTelemetry, l→trackEvent, pBB→getRemoteHash, e→logError
```

---

## Terminal Cleanup

```javascript
// ============================================
// cleanupCursor - Reset terminal cursor state on exit
// Location: chunks.157.mjs:1214-1216
// ============================================

// ORIGINAL (for source lookup):
function I_7() {
  (process.stderr.isTTY ? process.stderr : process.stdout.isTTY ? process.stdout : void 0)
    ?.write(TP)
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
  // Additional reset sequences for color/style
  ttyStream?.write(TERMINAL_RESET_SEQUENCE);
}

// Mapping: I_7→cleanupCursor, TP→TERMINAL_RESET_SEQUENCE
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
let { main: Q } = await Promise.resolve().then(() => (UL9(), CL9));

// Example: Loading ripgrep
let { ripgrepMain: G } = await Promise.resolve().then(() => (ZI9(), GI9));
```

**Why this pattern:**
1. **Webpack chunking:** `Promise.resolve().then()` creates a split point
2. **Init function:** `UL9()` runs side effects before export access
3. **Named exports:** Destructuring gets specific exports efficiently

**Benefits:**
- Fast startup (version check doesn't load full app)
- Memory efficient (unused modules never loaded)
- Measurable (telemetry can bracket import time)

---

## Error Handling Strategy

### Error Propagation Pattern

```javascript
// All errors caught and logged via e() (logError)
try {
  // ... operation
} catch (error) {
  e(error instanceof Error ? error : Error(String(error)));
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
| Fast paths | Version, ripgrep, Chrome modes | Sub-100ms startup for common ops |
| Code splitting | Dynamic imports with bundler hints | Minimal memory for simple tasks |
| Chrome integration | MCP server + native host modes | Browser extension support |
| Lifecycle hooks | Commander.js preAction/postAction | Clean initialization sequence |
| Mode branching | Print vs Interactive | Support both automation and humans |
| Session management | Continue/Resume/Teleport/Named | Workflow continuity |
| Error handling | Centralized logging + exit codes | Shell script integration |
| Telemetry | Granular event tracking | Performance monitoring |

### Version Changes from 2.0.59

| Feature | 2.0.59 | 2.1.7 |
|---------|--------|-------|
| Execution modes | 4 (version, MCP CLI, ripgrep, standard) | 6 (+ Chrome MCP, Chrome native host) |
| Chrome integration | Not available | Full support |
| Named sessions | Not available | Resume by name |
| Chrome flags | Not available | --chrome, --no-chrome |
| Plugin directory | Not available | --plugin-dir |
