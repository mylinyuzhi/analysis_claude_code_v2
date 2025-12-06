# Claude Code v2.0.59 - Core Architecture Analysis

## Overview

Claude Code is a sophisticated command-line AI coding assistant built with Node.js, featuring a dual-mode architecture (interactive and non-interactive) and utilizing React/Ink.js for terminal UI rendering.

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLI Entry Point                          │
│                         (mu3 function)                          │
│                      chunks.158.mjs:1438                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ├──> Version Fast Path (--version)
                         ├──> MCP CLI Mode (--mcp-cli)
                         ├──> Ripgrep Mode (--ripgrep)
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Main Entry (hu3)                           │
│                    chunks.158.mjs:3                             │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Commander.js CLI Framework (fJ1)                         │ │
│  │  - Command definitions                                    │ │
│  │  - Option parsing                                         │ │
│  │  │  hooks: preAction → action → postAction               │ │
│  └───┬───────────────────────────────────────────────────────┘ │
└──────┼─────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│                    PreAction Hook Phase                          │
│                   chunks.158.mjs:6-10                            │
│  1. FU9() - Initialize configuration                            │
│  2. ju3() - Run migrations                                      │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│                    Action Handler Phase                          │
│                   chunks.158.mjs:17                              │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Mode Selection Logic                                       │ │
│  │                                                            │ │
│  │  if (--print || --sdk-url)  ───────► Non-Interactive Mode │ │
│  │  else  ────────────────────────────► Interactive Mode     │ │
│  └────────────┬──────────────────────┬──────────────────────┘ │
└───────────────┼──────────────────────┼────────────────────────┘
                │                      │
    ┌───────────▼───────────┐    ┌─────▼──────────────┐
    │  Interactive Mode     │    │ Non-Interactive    │
    │  (chunks.67/68.mjs)   │    │  (chunks.156.mjs)  │
    └───────────┬───────────┘    └─────┬──────────────┘
                │                      │
                ▼                      ▼
    ┌───────────────────────┐    ┌──────────────────────┐
    │   Ink.js Renderer     │    │   SDK Handler        │
    │   VG() function       │    │   Rw9() function     │
    │   React Components    │    │   Stream JSON I/O    │
    └───────────┬───────────┘    └─────┬────────────────┘
                │                      │
                └──────────┬───────────┘
                           ▼
        ┌──────────────────────────────────────────┐
        │       Core Components (Shared)           │
        │                                          │
        │  ┌────────────────────────────────────┐ │
        │  │ MCP (Model Context Protocol)       │ │
        │  │ - Client Management                │ │
        │  │ - Tool Integration                 │ │
        │  │ - Resource Access                  │ │
        │  └────────────────────────────────────┘ │
        │                                          │
        │  ┌────────────────────────────────────┐ │
        │  │ Tool Permission System             │ │
        │  │ - Permission Context (oA)          │ │
        │  │ - Allowed/Disallowed Tools         │ │
        │  │ - Bypass Mode                      │ │
        │  └────────────────────────────────────┘ │
        │                                          │
        │  ┌────────────────────────────────────┐ │
        │  │ Plugin System                      │ │
        │  │ - Marketplace Support              │ │
        │  │ - Plugin Management                │ │
        │  │ - Custom Agents                    │ │
        │  └────────────────────────────────────┘ │
        │                                          │
        │  ┌────────────────────────────────────┐ │
        │  │ Session Management                 │ │
        │  │ - Message History                  │ │
        │  │ - Resume/Continue                  │ │
        │  │ - Teleport (Remote Sessions)       │ │
        │  └────────────────────────────────────┘ │
        └──────────────────────────────────────────┘
```

## Main Components and Responsibilities

### 1. Entry Point Layer

#### `mu3()` - CLI Entry Function
**Location:** `chunks.158.mjs:1438-1462`

**Responsibilities:**
- Process command-line arguments
- Handle fast-path operations (version, mcp-cli, ripgrep)
- Route to main application logic

**Code Snippet:**
```javascript
async function mu3() {
  let A = process.argv.slice(2);

  // Fast path for version command
  if (A.length === 1 && (A[0] === "--version" || A[0] === "-v")) {
    console.log(`${VERSION} (Claude Code)`);
    return;
  }

  // Route to MCP CLI mode
  if (bZ() && A[0] === "--mcp-cli") {
    let B = A.slice(1);
    process.exit(await iz9(B));
  }

  // Route to ripgrep mode
  if (A[0] === "--ripgrep") {
    // ... ripgrep handling
  }

  // Import and call main function
  let { main: Q } = await Promise.resolve().then(() => (tw9(), ow9));
  await Q();
}
```

### 2. Main Application Layer

#### `hu3()` - Main Entry Function
**Location:** `chunks.158.mjs:3-985`

**Responsibilities:**
- Initialize Commander.js framework
- Setup CLI command structure
- Configure hooks (preAction, action, postAction)
- Parse arguments and route to appropriate handlers

**Key Command Structure:**
```javascript
async function hu3() {
  let A = new fJ1();  // Commander.js instance

  // Setup preAction hook
  A.hook("preAction", async () => {
    let Y = FU9();  // Initialize config
    if (Y instanceof Promise) await Y;
    ju3();  // Run migrations
  });

  // Define main command
  A.name("claude")
    .description("Claude Code - starts interactive session by default")
    .argument("[prompt]", "Your prompt", String)
    .option("-p, --print", "Print response and exit (non-interactive)")
    .option("--output-format <format>", "Output format: text, json, stream-json")
    // ... many more options
    .action(async (Y, J) => {
      // Action handler - main application logic
      // Mode selection happens here
    });

  // Add subcommands
  A.command("mcp").description("Configure and manage MCP servers");
  A.command("plugin").description("Manage Claude Code plugins");
  A.command("setup-token").description("Set up authentication token");

  await A.parseAsync(process.argv);
}
```

### 3. Mode Selection Logic

**Location:** `chunks.158.mjs:238-340`

The application determines execution mode based on command-line flags:

**Pseudocode:**
```
if (--print flag OR --sdk-url flag):
    mode = NON_INTERACTIVE
    if (--output-format not specified):
        outputFormat = "text"
    if (--sdk-url):
        force stream-json I/O
else:
    mode = INTERACTIVE
    launch Ink.js UI
```

**Code Snippet:**
```javascript
let l = J.print;  // --print flag
let FA = J.sdkUrl ?? void 0;  // --sdk-url flag

if (FA) {
  if (!u) u = "stream-json";
  if (!p) p = "stream-json";
  if (!J.print) l = !0;
}

let OA = N6();  // Check if non-interactive mode

if (OA) {
  // Non-interactive mode execution
  Rw9($A, async () => yQ, ...);
} else {
  // Interactive mode execution
  await VG(d3.default.createElement(yG, {
    initialState: f0,
    onChangeAppState: Yu
  }, d3.default.createElement(WVA, {
    // ... props for main interactive component
  })));
}
```

### 4. Interactive Mode Components

#### Main Component: `WVA` (Main Interactive App)
**Location:** `chunks.145.mjs:3`

**Responsibilities:**
- Manage conversation state
- Render React/Ink.js UI components
- Handle user input and tool execution
- Coordinate MCP clients and plugins

**Props:**
```javascript
{
  commands: A,                    // Available commands
  debug: Q,                       // Debug mode flag
  initialPrompt: B,               // Initial user prompt
  initialTools: G,                // Tool definitions
  initialMessages: Z,             // Message history
  mcpClients: Y,                  // MCP client instances
  dynamicMcpConfig: J,            // Dynamic MCP configuration
  systemPrompt: F,                // System prompt override
  appendSystemPrompt: K,          // Additional system prompt
  mainThreadAgentDefinition: E    // Active agent definition
}
```

#### Ink.js Renderer: `VG` Function
**Purpose:** Render React components to terminal using Ink.js

**Key Features:**
- Terminal UI rendering with React paradigm
- Component tree management
- TTY interaction handling
- Focus management for interactive elements

### 5. Non-Interactive Mode Components

#### SDK Handler: `Rw9` Function
**Location:** `chunks.156.mjs:2934`

**Responsibilities:**
- Initialize sandbox if enabled
- Process input from stdin (stream-json format)
- Execute agentic turns
- Output results to stdout (stream-json format)

**Signature:**
```javascript
async function Rw9(
  A,    // Input prompt
  Q,    // Get state function
  B,    // Set state function
  G,    // Commands
  Z,    // Tools
  I,    // MCP SDK servers
  Y,    // Agent definitions
  J     // Options
)
```

**Flow:**
1. Initialize sandbox (if enabled)
2. Process input (text or stream-json)
3. Execute conversation turns
4. Handle tool calls
5. Stream results to stdout
6. Handle errors and exit codes

### 6. Core Subsystems

#### MCP (Model Context Protocol) System
**Responsibilities:**
- Manage connections to MCP servers (stdio, SSE, HTTP)
- Expose MCP tools to the agent
- Handle MCP resource access
- Configuration management (user, project, local scopes)

**Key Components:**
- Client management: `fk()` - Load MCP configurations
- Tool integration: `LC(oA)` - Load tools from permission context
- SDK servers: Separate handling for SDK-based MCP servers

#### Tool Permission System
**Responsibilities:**
- Control which tools the agent can use
- Implement permission modes (default, bypass)
- Filter tools based on allow/deny lists
- Manage additional directories for tool access

**Permission Modes:**
```javascript
SE9({
  permissionModeCli: E,              // CLI override
  dangerouslySkipPermissions: V      // Bypass all checks
})
// Returns: { mode, notification }
```

#### Plugin System
**Commands:**
- `claude plugin install <plugin>` - Install from marketplace
- `claude plugin uninstall <plugin>` - Remove plugin
- `claude plugin enable/disable <plugin>` - Toggle plugins
- `claude marketplace add/list/remove/update` - Manage marketplaces

**Features:**
- Multi-marketplace support
- Plugin validation
- Custom agent definitions
- Extension commands

#### Session Management
**Capabilities:**
- Continue most recent conversation (`--continue`)
- Resume specific session (`--resume [id]`)
- Fork sessions (`--fork-session`)
- Teleport to remote sessions (`--teleport [id]`)

**Storage:**
- Local session database
- Message history
- File history snapshots
- Session metadata

## Data Flow Between Components

### Interactive Mode Flow
```
User Input (stdin)
    │
    ▼
Ink.js Input Handler
    │
    ▼
WVA Component State Update
    │
    ▼
Tool Execution / API Call
    │
    ▼
State Update (onChangeAppState)
    │
    ▼
Ink.js Re-render
    │
    ▼
Terminal Output (stdout)
```

### Non-Interactive Mode Flow
```
stdin (stream-json)
    │
    ▼
Rw9 Handler
    │
    ▼
Parse JSON events
    │
    ▼
Execute agentic turn
    │
    ├──> Tool calls
    │    └──> Tool results
    │
    ├──> API calls
    │    └──> Claude responses
    │
    ▼
Stream JSON to stdout
```

## Key Entry Functions Deep Dive

### `mu3()` - CLI Entry
**Purpose:** Bootstrap the application

**Key Decision Points:**
1. Check for fast-path commands (version, mcp-cli, ripgrep)
2. Dynamically import main function
3. Execute main application logic

**Enhanced Code:**

```javascript
// ============================================
// mu3() - CLI Entry Point
// Location: chunks.158.mjs:1438-1462
// ============================================

/**
 * Main CLI entry point that bootstraps the Claude Code application.
 * Implements fast-path optimizations for common commands to avoid
 * loading the entire application unnecessarily.
 *
 * @returns {Promise<void>}
 */
async function mu3() {
  // Step 1: Extract command-line arguments (skip node executable and script path)
  let cliArgs = process.argv.slice(2);

  // Step 2: Fast path - Version check (no imports needed)
  if (cliArgs.length === 1 && (cliArgs[0] === "--version" || cliArgs[0] === "-v")) {
    M9("cli_version_fast_path");  // Analytics telemetry
    console.log(`${VERSION} (Claude Code)`);
    return;  // Early exit - saves ~200ms of initialization
  }

  // Step 3: Fast path - MCP CLI mode (server mode)
  if (bZ() && cliArgs[0] === "--mcp-cli") {
    let mcpArgs = cliArgs.slice(1);
    process.exit(await iz9(mcpArgs));  // Execute MCP CLI handler and exit
  }

  // Step 4: Fast path - Ripgrep mode (code search utility)
  if (cliArgs[0] === "--ripgrep") {
    M9("cli_ripgrep_path");
    let ripgrepArgs = cliArgs.slice(1);

    // Dynamically import ripgrep module (only when needed)
    let { ripgrepMain: ripgrepHandler } = await Promise.resolve()
      .then(() => (sz9(), az9));

    process.exitCode = ripgrepHandler(ripgrepArgs);
    return;
  }

  // Step 5: Normal execution - Load main application module
  M9("cli_before_main_import");

  // Dynamic import: Only load heavy dependencies when necessary
  let { main: mainEntryPoint } = await Promise.resolve()
    .then(() => (tw9(), ow9));

  M9("cli_after_main_import");

  // Execute the main application logic
  await mainEntryPoint();  // This calls hu3() internally

  M9("cli_after_main_complete");
}
```

### `hu3()` - Main Entry
**Purpose:** Setup and execute the CLI application

**Execution Phases:**

1. **Initialization Phase**
   - Create Commander.js instance
   - Register preAction hook
   - Define command structure

2. **PreAction Phase** (hooks)
   - `FU9()` - Initialize configuration
   - `ju3()` - Run database migrations

3. **Action Phase**
   - Parse all CLI options
   - Load MCP configurations
   - Setup tool permissions
   - Initialize MCP clients
   - Load plugins

4. **Execution Phase**
   - Select mode (interactive vs non-interactive)
   - Launch appropriate handler

**Enhanced Code - PreAction Hook:**

```javascript
// ============================================
// hu3() - Main Entry Function (PreAction Hook)
// Location: chunks.158.mjs:3-10
// ============================================

/**
 * Main entry function that sets up the Commander.js CLI framework.
 * The preAction hook ensures configuration and database are ready
 * before any command executes.
 */
async function hu3() {
  // Step 1: Create Commander.js instance for CLI framework
  let commander = new fJ1();  // fJ1 = Commander class

  M9("run_commander_initialized");  // Telemetry marker

  // Step 2: Register preAction hook (runs before every command)
  commander.hook("preAction", async () => {
    M9("preAction_start");

    // Initialize configuration system (user/project/local settings)
    let configInitResult = FU9();

    // Handle async initialization if needed
    if (configInitResult instanceof Promise) {
      await configInitResult;
    }

    M9("preAction_after_init");

    // Run database migrations to ensure schema is up-to-date
    ju3();

    M9("preAction_after_migrations");
  });

  // Step 3: Define main command structure
  commander
    .name("claude")
    .description("Claude Code - starts an interactive session by default, use -p/--print for non-interactive output")
    .argument("[prompt]", "Your prompt", String)
    .helpOption("-h, --help", "Display help for command")

    // Debug options
    .option("-d, --debug [filter]", 'Enable debug mode with optional category filtering')
    .option("--verbose", "Override verbose mode setting from config")

    // Mode selection
    .option("-p, --print", "Print response and exit (non-interactive mode)")
    .addOption(new BF("--output-format <format>", 'Output format: "text", "json", or "stream-json"')
      .choices(["text", "json", "stream-json"]))
    .addOption(new BF("--input-format <format>", 'Input format: "text" or "stream-json"')
      .choices(["text", "stream-json"]))

    // Model and agent selection
    .option("--model <model>", "Model for the current session")
    .option("--agent <agent>", "Agent for the current session")

    // Tool configuration
    .option("--tools <tools...>", "Specify available tools (only with --print)")
    .option("--allowed-tools <tools...>", "Comma/space-separated allowed tools")
    .option("--disallowed-tools <tools...>", "Comma/space-separated denied tools")

    // MCP configuration
    .option("--mcp-config <configs...>", "Load MCP servers from JSON files or strings")
    .option("--strict-mcp-config", "Only use MCP servers from --mcp-config")

    // Session management
    .option("-c, --continue", "Continue the most recent conversation")
    .option("-r, --resume [value]", "Resume a conversation by session ID")
    .option("--fork-session", "Create new session ID when resuming")

    // System prompts
    .addOption(new BF("--system-prompt <prompt>", "System prompt override"))
    .addOption(new BF("--append-system-prompt <prompt>", "Append to default system prompt"))

    // Action handler (main command logic)
    .action(async (userPrompt, options) => {
      M9("action_handler_start");

      // Main command execution logic happens here
      // (See mode selection code below)

      // ... (continues in action handler section)
    });

  // Step 4: Add subcommands
  let mcpCommand = commander.command("mcp")
    .description("Configure and manage MCP servers");

  // MCP subcommands defined here...

  // Step 5: Parse and execute command-line arguments
  await commander.parseAsync(process.argv);
}
```

**Enhanced Code - Mode Selection Logic:**

```javascript
// ============================================
// Mode Selection Logic (inside action handler)
// Location: chunks.158.mjs:238-340
// ============================================

/**
 * Determines whether to run in interactive or non-interactive mode
 * based on CLI flags and environment.
 *
 * @param {string} userPrompt - Initial user prompt
 * @param {Object} options - Parsed CLI options
 */
async function actionHandler(userPrompt, options) {
  // Extract relevant options
  let {
    print: printMode,           // --print flag
    sdkUrl: sdkUrlEndpoint,     // --sdk-url flag
    verbose: verboseFlag,
    outputFormat,
    inputFormat
  } = options;

  // Determine if non-interactive mode
  let isNonInteractive = printMode || Boolean(sdkUrlEndpoint);

  // SDK URL forces specific configuration
  if (sdkUrlEndpoint) {
    // SDK mode requires stream-json for both input and output
    if (!inputFormat) inputFormat = "stream-json";
    if (!outputFormat) outputFormat = "stream-json";
    if (verboseFlag === undefined) verboseFlag = true;
    if (!printMode) printMode = true;  // Force print mode
  }

  // Load MCP configurations
  let mcpServers = await loadMcpConfigurations(options.mcpConfig);

  // Setup tool permissions
  let {
    toolPermissionContext: permissions,
    warnings: permissionWarnings
  } = _E9({
    allowedToolsCli: options.allowedTools || [],
    disallowedToolsCli: options.disallowedTools || [],
    baseToolsCli: options.tools || [],
    permissionMode: permissionMode,
    allowDangerouslySkipPermissions: options.allowDangerouslySkipPermissions,
    addDirs: options.addDir || []
  });

  // Display permission warnings
  permissionWarnings.forEach(warning => console.error(warning));

  // Load available tools based on permissions
  let availableTools = LC(permissions);  // LC = Load Commands

  // Initialize MCP clients
  let mcpClients = await initializeMcpClients(mcpServers);

  // Load plugins
  await initializePlugins(options.pluginDir || []);

  // === MODE BRANCHING ===

  if (isNonInteractive) {
    // ========================================
    // NON-INTERACTIVE MODE (--print or --sdk-url)
    // ========================================

    // Disable TTY mode for JSON output
    if (outputFormat === "stream-json" || outputFormat === "json") {
      Dz0(true);  // Disable TTY
    }

    // Setup binary stdout
    BD0();

    // Filter commands to those supporting non-interactive mode
    let supportedCommands = commands.filter(cmd =>
      (cmd.type === "prompt" && !cmd.disableNonInteractive) ||
      (cmd.type === "local" && cmd.supportsNonInteractive)
    );

    // Build application state
    let appState = getInitialState();
    appState.mcp.clients = mcpClients.clients;
    appState.mcp.commands = mcpClients.commands;
    appState.mcp.tools = mcpClients.tools;
    appState.toolPermissionContext = permissions;

    // Grant all permissions if bypass mode
    if (permissions.mode === "bypassPermissions" || options.allowDangerouslySkipPermissions) {
      yE9(permissions);  // Grant all
    }

    // Execute non-interactive handler
    Rw9(
      userPrompt,                     // Input prompt/stream
      async () => appState,           // State getter
      (updater) => { /* setState */ }, // State setter
      supportedCommands,              // Available commands
      availableTools,                 // Available tools
      sdkMcpServers,                  // SDK MCP servers
      activeAgents,                   // Agent definitions
      {
        continue: options.continue,
        resume: options.resume,
        verbose: verboseFlag,
        outputFormat: outputFormat,
        jsonSchema: options.jsonSchema,
        maxThinkingTokens: options.maxThinkingTokens,
        maxTurns: options.maxTurns,
        maxBudgetUsd: options.maxBudgetUsd,
        systemPrompt: options.systemPrompt,
        appendSystemPrompt: options.appendSystemPrompt,
        userSpecifiedModel: options.model,
        fallbackModel: options.fallbackModel,
        sdkBetas: options.betas,
        sdkUrl: sdkUrlEndpoint,
        replayUserMessages: options.replayUserMessages,
        includePartialMessages: options.includePartialMessages,
        forkSession: options.forkSession,
        resumeSessionAt: options.resumeSessionAt,
        enableAuthStatus: options.enableAuthStatus
      }
    );

    return;  // Exit after non-interactive execution
  }

  // ========================================
  // INTERACTIVE MODE (default)
  // ========================================

  // Build initial state for interactive UI
  let initialState = {
    settings: getUserSettings(),
    backgroundTasks: {},
    verbose: verboseFlag ?? defaultVerbose(),
    mainLoopModel: getDefaultModel(),
    mainLoopModelForSession: null,
    showExpandedTodos: getSetting("showExpandedTodos"),
    toolPermissionContext: permissions,
    agentDefinitions: agentDefs,
    mcp: {
      clients: [],  // Will be populated
      tools: [],
      commands: [],
      resources: {}
    },
    plugins: {
      enabled: [],
      disabled: [],
      commands: [],
      agents: [],
      errors: [],
      installationStatus: { marketplaces: [], plugins: [] }
    },
    statusLineText: undefined,
    notifications: {
      current: null,
      queue: permissionNotification ? [permissionNotification] : []
    },
    elicitation: { queue: [] },
    todos: { [sessionId]: initializeTodos(sessionId) },
    fileHistory: { snapshots: [], trackedFiles: new Set() },
    thinkingEnabled: isThinkingEnabled(),
    feedbackSurvey: { timeLastShown: null, submitCountAtLastAppearance: null },
    sessionHooks: {},
    promptSuggestion: { text: null, shownAt: 0 },
    queuedCommands: [],
    gitDiff: { stats: null, hunks: new Map(), lastUpdated: 0, version: 0 }
  };

  // Handle session resumption
  if (options.continue) {
    // Load most recent conversation
    let lastConversation = await loadLastSession();

    if (!lastConversation) {
      console.error("No conversation found to continue");
      process.exit(1);
    }

    // Reuse session ID unless forking
    if (!options.forkSession && lastConversation.sessionId) {
      setActiveSession(lastConversation.sessionId);
      await updateSessionMetadata();
    }

    // Render UI with loaded session
    await VG(  // VG = Ink.js render function
      React.createElement(AppStateProvider, {
        initialState: initialState,
        onChangeAppState: handleStateChange
      },
      React.createElement(MainInteractiveApp, {
        debug: options.debug,
        initialPrompt: userPrompt,
        commands: [...commands, ...mcpClients.commands],
        initialTools: mcpClients.tools,
        initialMessages: lastConversation.messages,
        initialFileHistorySnapshots: lastConversation.fileHistorySnapshots,
        mcpClients: mcpClients.clients,
        dynamicMcpConfig: dynamicMcpConfig,
        mcpCliEndpoint: mcpCliEndpoint,
        autoConnectIdeFlag: options.ide,
        strictMcpConfig: options.strictMcpConfig,
        appendSystemPrompt: options.appendSystemPrompt,
        mainThreadAgentDefinition: selectedAgent
      })),
      renderOptions
    );
  } else {
    // New session - run startup hooks
    let startupMessages = await runHooks("startup");

    // Render UI for new session
    await VG(
      React.createElement(AppStateProvider, {
        initialState: initialState,
        onChangeAppState: handleStateChange
      },
      React.createElement(MainInteractiveApp, {
        debug: options.debug,
        commands: [...commands, ...mcpClients.commands],
        initialPrompt: userPrompt,
        initialTools: mcpClients.tools,
        initialMessages: startupMessages,
        mcpClients: mcpClients.clients,
        dynamicMcpConfig: dynamicMcpConfig,
        autoConnectIdeFlag: options.ide,
        strictMcpConfig: options.strictMcpConfig,
        systemPrompt: options.systemPrompt,
        appendSystemPrompt: options.appendSystemPrompt,
        mcpCliEndpoint: mcpCliEndpoint,
        mainThreadAgentDefinition: selectedAgent
      })),
      renderOptions
    );
  }
}
```

## Mode Selection Decision Tree

```
                    ┌─────────────────┐
                    │  Parse CLI Args │
                    └────────┬────────┘
                             │
                ┌────────────▼────────────┐
                │  --print or --sdk-url?  │
                └────┬──────────────┬─────┘
                     │YES           │NO
                     │              │
            ┌────────▼────────┐    │
            │ Non-Interactive │    │
            │                 │    │
            │ ┌─────────────┐ │    │
            │ │ Output      │ │    │
            │ │ Format?     │ │    │
            │ └──┬──────────┘ │    │
            │    │             │    │
            │ ┌──▼────────┐   │    │
            │ │ text      │   │    │
            │ │ json      │   │    │
            │ │stream-json│   │    │
            │ └───────────┘   │    │
            │                 │    │
            │ Execute Rw9()   │    │
            └─────────────────┘    │
                                   │
                          ┌────────▼─────────┐
                          │   Interactive    │
                          │                  │
                          │ ┌──────────────┐ │
                          │ │ Continue?    │ │
                          │ │ Resume?      │ │
                          │ │ Teleport?    │ │
                          │ └──┬───────────┘ │
                          │    │              │
                          │    ▼              │
                          │ Load Session     │
                          │    │              │
                          │    ▼              │
                          │ Render VG()      │
                          │ (Ink.js UI)      │
                          └──────────────────┘
```

## Component Responsibilities Summary

| Component | Location | Primary Function | Key Technologies |
|-----------|----------|------------------|------------------|
| `mu3()` | chunks.158.mjs | CLI bootstrap | Node.js process |
| `hu3()` | chunks.158.mjs | Main setup & routing | Commander.js |
| `WVA` | chunks.145.mjs | Interactive UI | React, Ink.js |
| `Rw9()` | chunks.156.mjs | Non-interactive handler | Stream JSON I/O |
| MCP System | Various | External integrations | MCP protocol |
| Tool Permissions | Various | Security & access control | Permission contexts |
| Plugin System | Various | Extensibility | Marketplace, validation |
| Session Manager | Various | State persistence | Database, file system |

## Enhanced Code - React State Provider

```javascript
// ============================================
// yG (AppStateProvider) - React State Provider
// Location: chunks.70.mjs:2399-2438
// ============================================

/**
 * React Context provider that manages global application state.
 * Uses React hooks to provide state and state updater to all child components.
 *
 * @param {Object} props
 * @param {ReactNode} props.children - Child components
 * @param {Object} props.initialState - Initial application state
 * @param {Function} props.onChangeAppState - Callback when state changes
 */
function AppStateProvider({
  children,
  initialState,
  onChangeAppState
}) {
  // Prevent nested providers (would cause state conflicts)
  let isAlreadyInitialized = React.useContext(AppStateProviderFlag);
  if (isAlreadyInitialized) {
    throw Error("AppStateProvider can not be nested within another AppStateProvider");
  }

  // State management: current state + previous state for diffing
  let [stateHistory, setStateHistory] = React.useState({
    currentState: initialState ?? getDefaultState(),
    previousState: null
  });

  // State updater with change notification
  let updateState = React.useCallback((stateUpdaterFn) => {
    setStateHistory(({ currentState: oldState }) => {
      // Apply state update function
      let newState = stateUpdaterFn(oldState);

      let newHistory = {
        currentState: newState,
        previousState: oldState
      };

      // Notify parent of state change
      onChangeAppState?.({
        newState: newHistory.currentState,
        oldState: newHistory.previousState
      });

      return newHistory;
    });
  }, [onChangeAppState]);

  // Memoized context value [state, updater]
  let contextValue = React.useMemo(() => {
    let value = [stateHistory.currentState, updateState];
    value.__IS_INITIALIZED__ = true;  // Marker for initialization check
    return value;
  }, [stateHistory.currentState, updateState]);

  // Listen for settings changes from config files
  watchSettingsChanges(React.useCallback((source, newSettings) => {
    console.log(`Settings changed from ${source}, updating AppState`);

    let updatedPermissions = recalculatePermissions();

    updateState((state) => ({
      ...state,
      settings: newSettings,
      toolPermissionContext: mergePermissions(state.toolPermissionContext, updatedPermissions)
    }));
  }, [updateState]));

  // Render provider with nested flag to prevent nesting
  return React.createElement(
    AppStateProviderFlag.Provider,
    { value: true },
    React.createElement(
      AppStateContext.Provider,
      { value: contextValue },
      children
    )
  );
}

/**
 * Hook to access application state from any component.
 * Must be called within <AppStateProvider> tree.
 *
 * @returns {[Object, Function]} Tuple of [state, setState]
 */
function useAppState() {
  let contextValue = React.useContext(AppStateContext);

  // Ensure hook is called within provider
  if (!contextValue.__IS_INITIALIZED__) {
    throw ReferenceError("useAppState cannot be called outside of an <AppStateProvider />");
  }

  return contextValue;
}
```

## Enhanced Code - Non-Interactive Handler (Rw9)

```javascript
// ============================================
// Rw9() - Non-Interactive Mode Handler
// Location: chunks.156.mjs:2934-3015
// ============================================

/**
 * Executes Claude Code in non-interactive mode (--print or --sdk-url).
 * Handles stream-json I/O, agentic turns, and tool execution.
 *
 * @param {string|ReadableStream} inputPromptOrStream - User input
 * @param {Function} getState - Function to retrieve current state
 * @param {Function} setState - Function to update state
 * @param {Array} commands - Available commands
 * @param {Array} tools - Available tools
 * @param {Object} sdkMcpServers - SDK MCP server configurations
 * @param {Array} agentDefinitions - Agent definitions
 * @param {Object} options - Execution options
 */
async function nonInteractiveHandler(
  inputPromptOrStream,
  getState,
  setState,
  commands,
  tools,
  sdkMcpServers,
  agentDefinitions,
  options
) {
  // Step 1: Initialize sandbox if enabled
  if (await shouldEnableSandbox()) {
    await setupSandbox();
  }

  if (isSandboxingEnabled()) {
    try {
      await initializeSandbox();
    } catch (error) {
      process.stderr.write(`\n❌ Sandbox Error: ${error.message}\n`);
      exitWithCode(1, "other");
      return;
    }
  }

  // Step 2: Validate options
  if (options.resumeSessionAt && !options.resume) {
    process.stderr.write(`Error: --resume-session-at requires --resume\n`);
    exitWithCode(1);
    return;
  }

  // Step 3: Load application state
  let appState = await getState();

  // Step 4: Load or create session
  let sessionMessages = await loadOrCreateSession(setState, {
    continue: options.continue,
    teleport: options.teleport,
    resume: options.resume,
    resumeSessionAt: options.resumeSessionAt,
    forkSession: options.forkSession
  });

  // Check if resume is a valid session ID or file path
  let isResumeWithId = typeof options.resume === "string" &&
    (isValidUUID(options.resume) || options.resume.endsWith(".jsonl"));

  let isSdkMode = Boolean(options.sdkUrl);

  // Step 5: Validate input
  if (!inputPromptOrStream && !isResumeWithId && !isSdkMode) {
    process.stderr.write(
      `Error: Input must be provided either through stdin or as a prompt argument when using --print\n`
    );
    exitWithCode(1);
    return;
  }

  // Step 6: Validate output format requirements
  if (options.outputFormat === "stream-json" && !options.verbose) {
    process.stderr.write(
      `Error: When using --print, --output-format=stream-json requires --verbose\n`
    );
    exitWithCode(1);
    return;
  }

  // Step 7: Merge MCP tools with built-in tools
  let allTools = isEnterpriseMode()
    ? tools  // Enterprise: only built-in tools
    : [...tools, ...appState.mcp.tools];  // Include MCP tools

  // Step 8: Setup input/output streams
  let ioStream = createIOStream(inputPromptOrStream, options);

  // Step 9: Setup permission prompt tool if specified
  let permissionPromptTool = options.sdkUrl
    ? "stdio"
    : options.permissionPromptToolName;

  let permissionHandler = createPermissionHandler(
    permissionPromptTool,
    ioStream,
    appState.mcp.tools
  );

  // Step 10: Filter out permission prompt tool from available tools
  if (options.permissionPromptToolName) {
    allTools = allTools.filter(tool =>
      tool.name !== options.permissionPromptToolName
    );
  }

  // Step 11: Execute agentic conversation loop
  let allEvents = [];

  for await (let event of executeAgenticConversation(
    ioStream,
    appState.mcp.clients,
    [...commands, ...appState.mcp.commands],  // Merge commands
    allTools,
    sessionMessages,
    permissionHandler,
    sdkMcpServers,
    getState,
    setState,
    agentDefinitions,
    options
  )) {
    // Stream events in real-time if verbose mode
    if (options.outputFormat === "stream-json" && options.verbose) {
      ioStream.write(event);
    }

    // Collect events for final output (skip internal control events)
    if (event.type !== "control_response" &&
        event.type !== "control_request" &&
        event.type !== "control_cancel_request" &&
        event.type !== "stream_event" &&
        event.type !== "keep_alive") {
      allEvents.push(event);
    }
  }

  // Step 12: Extract final result
  let finalResult = extractFinalResult(allEvents);

  // Step 13: Format and output results based on output format
  switch (options.outputFormat) {
    case "json":
      if (!finalResult || finalResult.type !== "result") {
        throw Error("No messages returned");
      }

      if (options.verbose) {
        // Verbose: output all events
        writeOutput(JSON.stringify(allEvents) + '\n');
      } else {
        // Non-verbose: output only final result
        writeOutput(JSON.stringify(finalResult) + '\n');
      }
      break;

    case "stream-json":
      // Already streamed in real-time above
      break;

    default:  // "text" format
      if (!finalResult || finalResult.type !== "result") {
        throw Error("No messages returned");
      }

      // Output based on result subtype
      switch (finalResult.subtype) {
        case "success":
          // Output text, ensure trailing newline
          let text = finalResult.result;
          writeOutput(text.endsWith('\n') ? text : text + '\n');
          break;

        case "error_during_execution":
          writeOutput("Execution error\n");
          break;

        case "error_max_turns":
          writeOutput(`Error: Reached max turns (${options.maxTurns})\n`);
          break;

        case "error_max_budget_usd":
          writeOutput(`Error: Exceeded USD budget (${options.maxBudgetUsd})\n`);
          break;

        case "error_max_structured_output_retries":
          writeOutput("Error: Failed to provide valid structured output after maximum retries\n");
          break;
      }
  }

  // Step 14: Exit with appropriate code
  let exitCode = (finalResult?.type === "result" && finalResult?.is_error) ? 1 : 0;
  exitWithCode(exitCode);
}
```

## Obfuscated Function Names (Identified)

| Obfuscated | Likely Meaning | Evidence |
|------------|----------------|----------|
| `mu3` | Main entry point | First function called from CLI |
| `hu3` | Main app setup | Initializes Commander.js |
| `VG` | Ink.js render | Used with React.createElement |
| `Rw9` | SDK runner/handler | Handles non-interactive mode |
| `WVA` | Main interactive component | React component with full props |
| `yG` | AppStateProvider | React context provider for global state |
| `FU9` | Config initialization | Called in preAction hook |
| `ju3` | Run migrations | Called after init |
| `fJ1` | Commander.js instance | New commander instance |
| `LC` | Load commands/tools | Returns tool array |
| `oA` | Permission context | Tool permission object |
| `OQ` | useAppState hook | React hook to access app state |

## Configuration Scopes

Claude Code uses a three-tier configuration system:

1. **User Scope** - `~/.config/claude/settings.json`
2. **Project Scope** - `.mcp.json` in project root
3. **Local Scope** - `.claude/config.json` in current directory

Priority: Local > Project > User

## Summary

Claude Code v2.0.59 implements a sophisticated dual-mode architecture that seamlessly switches between interactive (terminal UI) and non-interactive (pipeline/SDK) modes. The architecture is built on:

- **Commander.js** for CLI framework and argument parsing
- **React/Ink.js** for terminal UI rendering in interactive mode
- **Stream JSON** for pipeline-compatible non-interactive mode
- **MCP protocol** for extensible tool and resource integration
- **Plugin system** for marketplace-based extensibility

The design emphasizes modularity, security (permission system), and developer experience (multiple operational modes).

## Code Readability Enhancements Summary

This documentation has been enhanced with de-obfuscated, readable code for the following key components:

### 1. Entry Point Functions
- **mu3()**: CLI bootstrap with fast-path optimizations
  - Location: chunks.158.mjs:1438-1462
  - Handles version, MCP CLI, and ripgrep modes
  - Implements dynamic imports for performance

### 2. Main Application Setup
- **hu3()**: Commander.js setup and command routing
  - Location: chunks.158.mjs:3-596
  - PreAction hook for config and migrations
  - Mode selection logic (interactive vs non-interactive)

### 3. State Management
- **AppStateProvider (yG)**: React Context provider
  - Location: chunks.70.mjs:2399-2438
  - Global state management with history tracking
  - Settings change watchers

### 4. Non-Interactive Handler
- **Rw9()**: SDK/print mode handler
  - Location: chunks.156.mjs:2934-3015
  - Sandbox initialization
  - Stream JSON I/O processing
  - Agentic conversation loop

### 5. Interactive UI Component
- **MainInteractiveApp (WVA)**: Main React component
  - Location: chunks.145.mjs:3-102
  - State management for conversation, tools, MCP
  - Event handlers for user input and tool execution
  - Ink.js rendering integration

### Key De-obfuscation Patterns Applied:
1. **Parameter Renaming**: Single-letter params (A, Q, B) → descriptive names (inputPrompt, getState, setState)
2. **Inline Comments**: Added step-by-step explanations
3. **JSDoc Annotations**: Added @param and @returns documentation
4. **Source Locations**: Marked with chunk file and line numbers
5. **Logic Explanation**: Clarified conditional branches and state transitions

All enhanced code sections are formatted for maximum readability and include contextual information about the original obfuscated code.
