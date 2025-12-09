# Claude Code v2.0.59 - Workflow Analysis (Part 1: Main Workflow)

> **Split Documentation:**
> - **Part 1 (this file):** Lifecycle, Startup, Initialization, Mode Selection, Main Loop
> - **Part 2:** [workflow_subsystems.md](./workflow_subsystems.md) - Subsystem Workflows, Summary

> **Symbol References:**
> - [symbol_index_core.md](./symbol_index_core.md) - Core execution modules
> - [symbol_index_infra.md](./symbol_index_infra.md) - Infrastructure modules

## Application Lifecycle Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CLAUDE CODE LIFECYCLE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐     │
│  │ STARTUP │───►│INITIALIZATION│───►│MODE SELECTION│───►│  MAIN LOOP  │     │
│  │  mu3()  │    │   hu3()      │    │             │    │             │     │
│  └─────────┘    └──────────────┘    └──────┬──────┘    └──────┬──────┘     │
│                                            │                   │            │
│                                     ┌──────┴──────┐           │            │
│                                     ▼             ▼           │            │
│                              ┌───────────┐ ┌────────────┐     │            │
│                              │Interactive│ │Non-Interactive│  │            │
│                              │   VG()    │ │   Rw9()    │     │            │
│                              └─────┬─────┘ └─────┬──────┘     │            │
│                                    │             │            │            │
│                                    └──────┬──────┘            │            │
│                                           ▼                   │            │
│                                    ┌──────────────┐           │            │
│                                    │   SHUTDOWN   │◄──────────┘            │
│                                    │   Cleanup    │                        │
│                                    └──────────────┘                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Startup Timeline

```
Time (ms)  │ Phase                  │ Function        │ Description
───────────┼────────────────────────┼─────────────────┼──────────────────────────
0          │ CLI Entry              │ mu3()           │ Parse process.argv
5          │ Fast Path Check        │ -               │ --version, --mcp-cli, --ripgrep
10         │ Dynamic Import         │ tw9(), ow9      │ Load main application module
15         │ PreAction Hook         │ hu3()           │ Commander.js preAction
20         │ Config Init            │ FU9()           │ Load & merge configurations
30         │ DB Migrations          │ ju3()           │ Update database schema
50         │ Permission Setup       │ _E9()           │ Initialize tool permissions
75         │ Agent Loading          │ Kf2()           │ Load agent definitions
100        │ Initial State          │ f0              │ Build 18-field state object
150        │ MCP Connecting         │ $21()           │ Start MCP client connections
200        │ Plugin Loading         │ L39()           │ Load enabled plugins
300        │ Startup Hooks          │ wq("startup")   │ Execute startup event hooks
500        │ UI Render              │ VG()            │ Ink.js component mount
1000       │ MCP Connected          │ D1A()           │ All MCP servers connected
1500       │ Background Tasks       │ -               │ Code indexing, git status
2000       │ Ready                  │ -               │ Fully interactive
```

## Detailed Workflow Phases

### Phase 1: Startup (mu3 Function)

**Location:** `chunks.158.mjs:1438-1462`

**Purpose:** Bootstrap the application and handle special execution modes

**Flow Diagram:**
```
┌─────────────────────────┐
│  process.argv.slice(2)  │
│  Parse CLI arguments    │
└───────────┬─────────────┘
            │
    ┌───────▼────────┐
    │  Fast Paths?   │
    └───┬────────────┘
        │
        ├─── --version/-v? ──────► Print version & exit
        │
        ├─── --mcp-cli? ─────────► Execute MCP CLI mode
        │                          iz9(args) → exit
        │
        ├─── --ripgrep? ─────────► Execute ripgrep mode
        │                          ripgrepMain(args) → exit
        │
        └─── No fast path ───────► Import and call main()
                                    ↓
                            Dynamic import: tw9()
                                    ↓
                            Execute: main()/hu3()
```

**Enhanced Code with Detailed Explanation:**

```javascript
// ============================================
// mu3() - CLI Entry Point Bootstrap Function
// Location: chunks.158.mjs:1438-1462
// ============================================

/**
 * Bootstrap function that serves as the first entry point for Claude Code.
 * Implements performance optimizations through fast-path routing.
 *
 * Design Pattern: Fast-path routing - Handle simple commands without loading
 * heavy application modules (saves ~200-300ms initialization time).
 *
 * @returns {Promise<void>}
 */
async function mu3() {
  // Step 1: Extract command-line arguments
  // process.argv format: [node_path, script_path, ...args]
  // We skip the first two elements to get actual CLI arguments
  let cliArgs = process.argv.slice(2);

  // Step 2: FAST PATH - Version check
  // No imports needed, instant response
  if (cliArgs.length === 1 && (cliArgs[0] === "--version" || cliArgs[0] === "-v")) {
    M9("cli_version_fast_path");  // Analytics telemetry marker
    console.log(`${VERSION} (Claude Code)`);
    return;  // Early exit - avoids loading entire application
  }

  // Step 3: FAST PATH - MCP CLI server mode
  // Used when Claude Code acts as an MCP server for other applications
  if (bZ() && cliArgs[0] === "--mcp-cli") {
    let mcpArgs = cliArgs.slice(1);  // Remove --mcp-cli flag
    process.exit(await iz9(mcpArgs));  // Execute MCP CLI handler and exit
  }

  // Step 4: FAST PATH - Ripgrep code search mode
  // Built-in code search utility powered by ripgrep
  if (cliArgs[0] === "--ripgrep") {
    M9("cli_ripgrep_path");
    let ripgrepArgs = cliArgs.slice(1);

    // Dynamically import ripgrep module (lazy loading)
    let { ripgrepMain: ripgrepHandler } = await Promise.resolve()
      .then(() => (sz9(), az9));  // sz9() initializes, az9 is module export

    process.exitCode = ripgrepHandler(ripgrepArgs);
    return;
  }

  // Step 5: NORMAL PATH - Load main application
  // This is the most common path - load full application
  M9("cli_before_main_import");

  // Dynamic import: Lazy-load heavy dependencies
  // tw9() initializes the main module, ow9 contains exports
  let { main: mainEntryPoint } = await Promise.resolve()
    .then(() => (tw9(), ow9));

  M9("cli_after_main_import");

  // Execute the main application logic (calls hu3() internally)
  await mainEntryPoint();

  M9("cli_after_main_complete");
}
```

**Key Design Decisions:**
1. **Fast Paths First:** Handle simple commands without loading the entire application
2. **Dynamic Imports:** Only load heavy modules when needed
3. **Analytics Markers:** `M9()` calls track execution flow for telemetry

### Phase 2: Initialization (hu3 Function - PreAction Hook)

**Location:** `chunks.158.mjs:6-10`

**Purpose:** Setup configuration and database before command execution

**Flow Diagram:**
```
┌─────────────────────────────────────┐
│  Commander.js Hook: "preAction"     │
└─────────────────┬───────────────────┘
                  │
         ┌────────▼────────┐
         │  M9("preAction_ │
         │     start")     │
         └────────┬────────┘
                  │
         ┌────────▼────────┐
         │   FU9()         │
         │   Initialize    │
         │   Configuration │
         └────────┬────────┘
                  │
         ┌────────▼────────┐
         │  Wait if async  │
         │  (Promise)      │
         └────────┬────────┘
                  │
         ┌────────▼────────┐
         │  M9("preAction_ │
         │   after_init")  │
         └────────┬────────┘
                  │
         ┌────────▼────────┐
         │   ju3()         │
         │   Run           │
         │   Migrations    │
         └────────┬────────┘
                  │
         ┌────────▼────────┐
         │  M9("preAction_ │
         │  after_migrat") │
         └─────────────────┘
```

**Enhanced Code - PreAction Hook:**

```javascript
// ============================================
// PreAction Hook - Configuration & Database Setup
// Location: chunks.158.mjs:6-10
// ============================================

/**
 * PreAction hook that runs before every Commander.js command execution.
 * Ensures configuration and database are initialized and up-to-date.
 *
 * Lifecycle: This runs BEFORE the action handler, ensuring consistent
 * state across all commands (main command, mcp subcommand, etc.)
 */
commander.hook("preAction", async () => {
  M9("preAction_start");  // Telemetry marker

  // Step 1: Initialize configuration system
  // FU9() loads and merges config from multiple sources
  let configInitResult = FU9();

  // Handle async initialization (e.g., if reading from remote config)
  if (configInitResult instanceof Promise) {
    await configInitResult;
  }

  M9("preAction_after_init");

  // Step 2: Run database migrations
  // ju3() updates database schema if needed
  ju3();

  M9("preAction_after_migrations");
});
```

**What Happens in Each Step:**

**FU9() - Configuration Initialization:**

```javascript
/**
 * Loads and merges configuration from multiple sources.
 * Priority order: CLI args > Local > Project > User > Defaults
 *
 * @returns {Object|Promise<Object>} Configuration object
 */
function FU9() {
  // 1. Load user-level settings
  //    Location: ~/.config/claude/settings.json
  //    Contains: API keys, default model, preferences
  let userSettings = loadUserConfig();

  // 2. Load project-level settings (if in git repo)
  //    Location: .mcp.json in repository root
  //    Contains: MCP server configurations, project-specific tools
  let projectSettings = loadProjectConfig();

  // 3. Load local settings (directory-specific)
  //    Location: .claude/config.json in current directory
  //    Contains: Override settings for specific directory
  let localSettings = loadLocalConfig();

  // 4. Merge configurations with priority
  //    Local overrides Project overrides User overrides Defaults
  let mergedConfig = mergeConfigurations({
    defaults: getDefaultSettings(),
    user: userSettings,
    project: projectSettings,
    local: localSettings
  });

  // 5. Validate configuration schema
  //    Ensures all required fields present and types correct
  validateConfigSchema(mergedConfig);

  // 6. Setup environment variables
  //    Expand ${VAR} references in configuration
  expandEnvironmentVariables(mergedConfig);

  // 7. Apply configuration globally
  applyGlobalSettings(mergedConfig);

  return mergedConfig;
}
```

**ju3() - Database Migrations:**

```javascript
/**
 * Runs database migrations to update schema to latest version.
 * Ensures conversation history and metadata are properly structured.
 */
function ju3() {
  // 1. Get database connection
  //    SQLite database at ~/.claude/db.sqlite
  let db = getDatabaseConnection();

  // 2. Check current schema version
  let currentVersion = db.getUserVersion();

  // 3. Get available migrations
  //    Each migration is a numbered SQL script
  let availableMigrations = getMigrationScripts();

  // 4. Filter to pending migrations only
  let pendingMigrations = availableMigrations.filter(m =>
    m.version > currentVersion
  );

  // 5. Apply each migration in order
  for (let migration of pendingMigrations) {
    try {
      // Begin transaction for atomicity
      db.beginTransaction();

      // Execute migration SQL
      migration.up(db);

      // Update schema version
      db.setUserVersion(migration.version);

      // Commit transaction
      db.commitTransaction();

      console.log(`Applied migration ${migration.version}: ${migration.name}`);
    } catch (error) {
      // Rollback on error
      db.rollbackTransaction();
      throw new Error(`Migration ${migration.version} failed: ${error.message}`);
    }
  }

  // Example migrations:
  // - v1: Create conversations table
  // - v2: Add file_history_snapshots column
  // - v3: Migrate MCP server config format
  // - v4: Add git_diff_cache table
  // - v5: Add session_hooks table
}
```

### Phase 3: Command Setup (hu3 Function - Main Body)

**Location:** `chunks.158.mjs:11-596`

**Purpose:** Define CLI interface and parse arguments

**Commander.js Command Structure:**
```
claude [prompt]                      # Main command (default: interactive)
├── Options (Global)
│   ├── -d, --debug [filter]        # Debug mode with filtering
│   ├── -p, --print                 # Non-interactive mode
│   ├── --output-format <format>    # text/json/stream-json
│   ├── --input-format <format>     # text/stream-json
│   ├── --model <model>             # Model selection
│   ├── --agent <agent>             # Agent selection
│   ├── --tools <tools...>          # Tool whitelist
│   ├── --allowed-tools <tools...>  # Tool allowlist
│   ├── --disallowed-tools <tools>  # Tool denylist
│   ├── --mcp-config <configs...>   # MCP server configs
│   ├── --system-prompt <prompt>    # System prompt override
│   ├── --continue                  # Resume last conversation
│   ├── --resume [id]               # Resume specific session
│   └── ... (50+ options total)
│
├── mcp                             # MCP management
│   ├── serve                       # Start MCP server
│   ├── add <name> <command>        # Add MCP server
│   ├── remove <name>               # Remove MCP server
│   ├── list                        # List MCP servers
│   ├── get <name>                  # Get server details
│   ├── add-json <name> <json>      # Add via JSON
│   ├── add-from-claude-desktop     # Import from desktop
│   └── reset-project-choices       # Reset .mcp.json approvals
│
├── plugin                          # Plugin management
│   ├── validate <path>             # Validate manifest
│   ├── install <plugin>            # Install plugin
│   ├── uninstall <plugin>          # Uninstall plugin
│   ├── enable <plugin>             # Enable plugin
│   ├── disable <plugin>            # Disable plugin
│   └── marketplace                 # Marketplace commands
│       ├── add <source>            # Add marketplace
│       ├── list                    # List marketplaces
│       ├── remove <name>           # Remove marketplace
│       └── update [name]           # Update marketplace(s)
│
├── setup-token                     # OAuth token setup
├── doctor                          # Health check
├── update                          # Check for updates
└── install [target]                # Install native build
```

**Action Handler Workflow:**
```
┌────────────────────────────────────────────┐
│  Action Handler (main .action callback)   │
└─────────────────┬──────────────────────────┘
                  │
    ┌─────────────▼────────────────┐
    │  Extract & Validate Options  │
    │  - debug, verbose, print     │
    │  - outputFormat, inputFormat │
    │  - model, agent, tools       │
    └─────────────┬────────────────┘
                  │
    ┌─────────────▼────────────────┐
    │  Validate Flag Combinations  │
    │  - stream-json requires both │
    │    input and output          │
    │  - --tools requires --print  │
    │  - SDK URL validation        │
    └─────────────┬────────────────┘
                  │
    ┌─────────────▼────────────────┐
    │  Load MCP Configurations     │
    │  1. Parse --mcp-config       │
    │  2. Load from files          │
    │  3. Merge with existing      │
    │  4. Separate SDK vs regular  │
    └─────────────┬────────────────┘
                  │
    ┌─────────────▼────────────────┐
    │  Setup Tool Permissions      │
    │  _E9():                      │
    │  - Parse allowedTools        │
    │  - Parse disallowedTools     │
    │  - Create permission context │
    │  - Add additional dirs       │
    └─────────────┬────────────────┘
                  │
    ┌─────────────▼────────────────┐
    │  Initialize Working Directory│
    │  JW1():                      │
    │  - Verify directory exists   │
    │  - Check permissions         │
    │  - Setup session ID          │
    └─────────────┬────────────────┘
                  │
    ┌─────────────▼────────────────┐
    │  Load Commands & Agents      │
    │  - sE(): Load commands       │
    │  - Kf2(): Load agents        │
    │  - Parse --agents JSON       │
    │  - Merge all sources         │
    └─────────────┬────────────────┘
                  │
    ┌─────────────▼────────────────┐
    │  Initialize MCP Clients      │
    │  $21():                      │
    │  - Connect to servers        │
    │  - Enumerate tools           │
    │  - Enumerate resources       │
    │  - Start MCP CLI endpoint    │
    └─────────────┬────────────────┘
                  │
    ┌─────────────▼────────────────┐
    │  Initialize Plugins          │
    │  L39():                      │
    │  - Load plugin directory     │
    │  - Validate plugins          │
    │  - Load plugin commands      │
    │  - Load plugin agents        │
    └─────────────┬────────────────┘
                  │
    ┌─────────────▼────────────────┐
    │  Mode Selection              │
    │  (See Phase 4)               │
    └──────────────────────────────┘
```

**Code Snippet - MCP Configuration Loading:**
```javascript
// Parse --mcp-config options
if (C && C.length > 0) {
  let G0 = C.map(sQ => sQ.trim()).filter(sQ => sQ.length > 0);
  let yQ = {};
  let aQ = [];  // Errors array

  for (let sQ of G0) {
    let K0 = null;
    let mB = [];

    // Try parsing as JSON first
    let e2 = f7(sQ);
    if (e2) {
      // It's a JSON string
      let s8 = ZMA({
        configObject: e2,
        filePath: "command line",
        expandVars: true,
        scope: "dynamic"
      });
      if (s8.config) K0 = s8.config.mcpServers;
      else mB = s8.errors;
    } else {
      // It's a file path
      let s8 = SD0(sQ);  // Resolve path
      let K5 = BYA({
        filePath: s8,
        expandVars: true,
        scope: "dynamic"
      });
      if (K5.config) K0 = K5.config.mcpServers;
      else mB = K5.errors;
    }

    if (mB.length > 0) aQ.push(...mB);
    else if (K0) yQ = { ...yQ, ...K0 };
  }

  // Validate and merge
  if (aQ.length > 0) throw Error(`Invalid MCP configuration`);
  yA = { ...yA, ...yQ };  // Merge into dynamic config
}
```

**Code Snippet - Tool Permission Setup:**
```javascript
let {
  toolPermissionContext: oA,
  warnings: X1
} = _E9({
  allowedToolsCli: D,           // --allowed-tools
  disallowedToolsCli: H,        // --disallowed-tools
  baseToolsCli: K,              // --tools
  permissionMode: qA,           // Permission mode
  allowDangerouslySkipPermissions: F,
  addDirs: U                    // --add-dir
});

// Display any warnings
X1.forEach((G0) => {
  console.error(G0);
});

// Create final tool list with permissions applied
let TA = LC(oA);  // Load commands based on context
```

### Phase 4: Mode Selection and Execution

**Location:** `chunks.158.mjs:238-595`

**Decision Logic:**

**Pseudocode:**
```
determine_mode(options):
    // SDK URL forces non-interactive
    if options.sdkUrl:
        force options.print = true
        force options.inputFormat = "stream-json"
        force options.outputFormat = "stream-json"
        return NON_INTERACTIVE

    // --print flag
    if options.print:
        return NON_INTERACTIVE

    // Default to interactive
    return INTERACTIVE
```

**Code Snippet:**
```javascript
let l = J.print;  // --print flag
let FA = J.sdkUrl ?? void 0;  // --sdk-url

// SDK URL implies print mode with stream-json
if (FA) {
  if (!u) u = "stream-json";
  if (!p) p = "stream-json";
  if (J.verbose === void 0) e = true;
  if (!J.print) l = true;
}

let OA = N6();  // Returns true if non-interactive

if (OA) {
  // NON-INTERACTIVE MODE
  // ... (see Phase 5a)
} else {
  // INTERACTIVE MODE
  // ... (see Phase 5b)
}
```

### Phase 5a: Non-Interactive Mode Execution

**Location:** `chunks.158.mjs:294-340`

**Purpose:** Execute in pipeline/SDK mode with JSON I/O

**Workflow:**
```
┌─────────────────────────────────────┐
│  Non-Interactive Mode Entry Point   │
└─────────────────┬───────────────────┘
                  │
    ┌─────────────▼────────────────┐
    │  Setup Output Format         │
    │  if stream-json or json:     │
    │    Dz0(true)  # Disable TTY  │
    │    BD0()      # Setup streams│
    └─────────────┬────────────────┘
                  │
    ┌─────────────▼────────────────┐
    │  Filter Commands & Tools     │
    │  - Remove disabled in non-   │
    │    interactive mode          │
    │  - Keep only supported tools │
    └─────────────┬────────────────┘
                  │
    ┌─────────────▼────────────────┐
    │  Setup Permissions           │
    │  if bypass mode or --allow:  │
    │    yE9(oA)  # Grant all      │
    └─────────────┬────────────────┘
                  │
    ┌─────────────▼────────────────┐
    │  Execute Rw9() Handler       │
    │  (See details below)         │
    └─────────────┬────────────────┘
                  │
                  ▼
                Exit
```

**Code Snippet:**
```javascript
if (OA) {  // Non-interactive mode
  if (p === "stream-json" || p === "json")
    Dz0(!0);  // Disable TTY mode

  BD0();  // Setup binary stdout

  // Filter commands - only those that support non-interactive
  let G0 = w1.filter(aQ =>
    aQ.type === "prompt" && !aQ.disableNonInteractive ||
    aQ.type === "local" && aQ.supportsNonInteractive
  );

  // Build state object
  let yQ = wp();  // Get initial state
  yQ = {
    ...yQ,
    mcp: {
      ...yQ.mcp,
      clients: _1,   // MCP clients
      commands: W1,  // MCP commands
      tools: zQ      // MCP tools
    },
    toolPermissionContext: oA
  };

  // Grant all permissions if bypass mode
  if (oA.mode === "bypassPermissions" || F)
    yE9(oA);

  // Execute non-interactive handler
  Rw9($A,                    // Input prompt/stream
      async () => yQ,        // Get state function
      (aQ) => { ... },       // Set state function
      G0,                    // Commands
      TA,                    // Tools
      MA,                    // SDK MCP servers
      v1.activeAgents,       // Agents
      {
        continue: J.continue,
        resume: J.resume,
        verbose: e,
        outputFormat: p,
        jsonSchema: rA,
        permissionPromptToolName: J.permissionPromptTool,
        allowedTools: D,
        maxThinkingTokens: J.maxThinkingTokens,
        maxTurns: J.maxTurns,
        maxBudgetUsd: J.maxBudgetUsd,
        systemPrompt: mA,
        appendSystemPrompt: wA,
        userSpecifiedModel: iA,
        fallbackModel: J1,
        sdkBetas: w.length > 0 ? w : void 0,
        teleport: zA,
        sdkUrl: FA,
        replayUserMessages: J.replayUserMessages,
        includePartialMessages: T,
        forkSession: J.forkSession || !1,
        resumeSessionAt: J.resumeSessionAt || void 0,
        enableAuthStatus: J.enableAuthStatus
      });

  return;  // Exit after completion
}
```

**Rw9() Handler Internals:**

**Location:** `chunks.156.mjs:2934`

**Flow:**
```
┌──────────────────────────────┐
│  Rw9() Entry Point           │
└──────────────┬───────────────┘
               │
    ┌──────────▼──────────┐
    │  Initialize Sandbox │
    │  if enabled:        │
    │    await nQ.init()  │
    └──────────┬──────────┘
               │
    ┌──────────▼──────────┐
    │  Process Input      │
    │  - Parse stream     │
    │  - Load session     │
    │  - Build messages   │
    └──────────┬──────────┘
               │
    ┌──────────▼──────────────────┐
    │  Main Agentic Loop          │
    │  while (not done):          │
    │    ├─► Call Claude API      │
    │    ├─► Process tool_use     │
    │    ├─► Execute tools        │
    │    ├─► Stream results       │
    │    └─► Check turn limit     │
    └──────────┬──────────────────┘
               │
    ┌──────────▼──────────┐
    │  Output Results     │
    │  - Stream events    │
    │  - Final summary    │
    └──────────┬──────────┘
               │
    ┌──────────▼──────────┐
    │  Cleanup & Exit     │
    │  - Close MCP        │
    │  - Save session     │
    └─────────────────────┘
```

**Input Processing (stream-json):**
```javascript
// Read from stdin
const inputStream = process.stdin;

// Parse JSON events
for await (const line of inputStream) {
  const event = JSON.parse(line);

  switch (event.type) {
    case "user_message":
      messages.push({
        role: "user",
        content: event.content
      });
      break;

    case "tool_result":
      messages.push({
        role: "user",
        content: [{
          type: "tool_result",
          tool_use_id: event.tool_use_id,
          content: event.content
        }]
      });
      break;
  }
}
```

**Output Streaming (stream-json):**
```javascript
// Stream events to stdout
function streamEvent(event) {
  process.stdout.write(JSON.stringify(event) + '\n');
}

// Example events:
streamEvent({
  type: "text",
  text: "Hello, I'll help you with that."
});

streamEvent({
  type: "tool_use",
  id: "toolu_123",
  name: "Read",
  input: { file_path: "/path/to/file" }
});

streamEvent({
  type: "thinking",
  thinking: "I need to analyze the file contents..."
});
```

### Phase 5b: Interactive Mode Execution

**Location:** `chunks.158.mjs:341-595`

**Purpose:** Launch full terminal UI with React/Ink.js

**Session Loading Workflow:**
```
┌────────────────────────────────────┐
│  Interactive Mode Entry Point      │
└─────────────────┬──────────────────┘
                  │
    ┌─────────────▼────────────────┐
    │  Check Session Flags         │
    │  --continue?                 │
    │  --resume [id]?              │
    │  --teleport [id]?            │
    │  --remote <desc>?            │
    └─────────────┬────────────────┘
                  │
         ┌────────┴────────┐
         │                 │
    ┌────▼─────┐     ┌────▼──────┐
    │ Continue │     │  New      │
    │ Session  │     │  Session  │
    └────┬─────┘     └────┬──────┘
         │                │
         │    ┌───────────▼──────────────┐
         │    │  Run Startup Hooks       │
         │    │  wq("startup"):          │
         │    │  - Plugin hooks          │
         │    │  - Custom init scripts   │
         │    └───────────┬──────────────┘
         │                │
         └────────┬───────┘
                  │
    ┌─────────────▼────────────────┐
    │  Build Initial State         │
    │  f0 = {                      │
    │    settings,                 │
    │    backgroundTasks,          │
    │    verbose,                  │
    │    toolPermissionContext,    │
    │    agentDefinitions,         │
    │    mcp,                      │
    │    plugins,                  │
    │    todos,                    │
    │    fileHistory,              │
    │    ...                       │
    │  }                           │
    └─────────────┬────────────────┘
                  │
    ┌─────────────▼────────────────┐
    │  Render Ink.js UI            │
    │  VG(                         │
    │    <yG initialState={f0}     │
    │         onChangeAppState={Yu}│
    │    >                         │
    │      <WVA ... />             │
    │    </yG>                     │
    │  )                           │
    └──────────────────────────────┘
```

**Code Snippet - Continue Session:**
```javascript
if (J.continue) {
  try {
    GA("tengu_continue", {});

    // Load most recent conversation
    let G0 = await ki(void 0, void 0);
    if (!G0) {
      console.error("No conversation found to continue");
      process.exit(1);
    }

    // Reuse session ID unless forking
    if (!J.forkSession) {
      if (G0.sessionId)
        zR(G0.sessionId);  // Set active session
      await Fx();          // Update metadata
    }

    // Render UI with loaded messages
    await VG(
      d3.default.createElement(yG, {
        initialState: f0,
        onChangeAppState: Yu
      },
      d3.default.createElement(WVA, {
        debug: W || X,
        initialPrompt: $A,
        commands: [...w1, ...W1],
        initialTools: zQ,
        initialMessages: G0.messages,          // Load history
        initialFileHistorySnapshots: G0.fileHistorySnapshots,
        mcpClients: _1,
        dynamicMcpConfig: yA,
        mcpCliEndpoint: O1,
        autoConnectIdeFlag: N,
        strictMcpConfig: k,
        appendSystemPrompt: wA,
        mainThreadAgentDefinition: g0
      })),
      C0  // Render options
    );
  } catch (G0) {
    AA(G0 instanceof Error ? G0 : Error(String(G0)));
    process.exit(1);
  }
}
```

**Code Snippet - New Session:**
```javascript
// No session flags, start fresh
let G0 = await wq("startup");  // Run startup hooks
M9("action_after_hooks");

await VG(
  d3.default.createElement(yG, {
    initialState: f0,
    onChangeAppState: Yu
  },
  d3.default.createElement(WVA, {
    debug: W || X,
    commands: [...w1, ...W1],
    initialPrompt: $A,              // User's initial prompt
    initialTools: zQ,
    initialMessages: G0,            // Empty or hook results
    mcpClients: _1,
    dynamicMcpConfig: yA,
    autoConnectIdeFlag: N,
    strictMcpConfig: k,
    systemPrompt: mA,
    appendSystemPrompt: wA,
    mcpCliEndpoint: O1,
    mainThreadAgentDefinition: g0
  })),
  C0
);
```

**Initial State Structure:**
```javascript
let f0 = {
  settings: $T(),                   // User settings
  backgroundTasks: {},              // Async task tracking
  verbose: e ?? N1().verbose,       // Verbose mode
  mainLoopModel: UkA(),             // Default model
  mainLoopModelForSession: null,    // Session-specific model
  showExpandedTodos: N1().showExpandedTodos,
  toolPermissionContext: oA,        // Permission settings
  agentDefinitions: v1,             // Available agents

  mcp: {
    clients: [],                    // Will be populated
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
    installationStatus: {
      marketplaces: [],
      plugins: []
    }
  },

  statusLineText: void 0,           // Bottom status line

  notifications: {
    current: null,
    queue: KA ? [{                  // Permission mode notification
      key: "permission-mode-notification",
      text: KA,
      priority: "high"
    }] : []
  },

  elicitation: {
    queue: []                       // User input prompts
  },

  todos: {
    [k0]: Nh(k0)                    // Todo list for session
  },

  fileHistory: {
    snapshots: [],                  // File change tracking
    trackedFiles: new Set()
  },

  thinkingEnabled: VrA(),           // Extended thinking

  feedbackSurvey: {
    timeLastShown: null,
    submitCountAtLastAppearance: null
  },

  sessionHooks: {},                 // Custom hooks

  promptSuggestion: {
    text: null,
    shownAt: 0
  },

  queuedCommands: [],               // Pending commands

  gitDiff: {
    stats: null,
    hunks: new Map(),
    lastUpdated: 0,
    version: 0
  }
};
```

### Phase 6: Interactive Mode - Main Loop (WVA Component)

**Location:** `chunks.145.mjs:3-100`

**Component Architecture:**

```
WVA (Main Interactive Component)
├── State Management
│   ├── Conversation messages
│   ├── Tool execution state
│   ├── MCP client connections
│   ├── Plugin state
│   └── UI state (prompts, spinners, etc.)
│
├── React Hooks
│   ├── useState - Local state
│   ├── useCallback - Optimized callbacks
│   ├── useEffect - Side effects
│   ├── useMemo - Memoized values
│   └── Custom hooks (40+ custom hooks)
│
├── Sub-Components
│   ├── Message List (conversation display)
│   ├── Input Box (user prompt)
│   ├── Tool Output (tool execution results)
│   ├── Spinner (loading state)
│   ├── Notifications (alerts/warnings)
│   ├── Status Line (bottom info)
│   └── Modal Dialogs (confirmations)
│
└── Event Handlers
    ├── onUserInput - Process user messages
    ├── onToolExecute - Execute tools
    ├── onMcpCall - MCP interactions
    ├── onStateChange - Propagate to parent
    └── onError - Error handling
```

**Enhanced Code - Main Interactive Component:**

```javascript
// ============================================
// WVA (MainInteractiveApp) - Main UI Component
// Location: chunks.145.mjs:3-102
// ============================================

/**
 * Main React component for interactive mode.
 * Manages conversation state, tool execution, and terminal UI rendering.
 *
 * Architecture: This is a stateful React component that orchestrates
 * the entire interactive session - from user input to API calls to
 * tool execution and UI updates.
 *
 * @param {Object} props - Component props
 * @param {Array} props.commands - Available commands
 * @param {boolean} props.debug - Debug mode flag
 * @param {string} props.initialPrompt - Initial user prompt
 * @param {Array} props.initialTools - Tool definitions
 * @param {Array} props.initialMessages - Message history
 * @param {Array} props.initialFileHistorySnapshots - File snapshots
 * @param {Array} props.mcpClients - MCP client instances
 * @param {Object} props.dynamicMcpConfig - Dynamic MCP configuration
 * @param {Object} props.mcpCliEndpoint - MCP CLI endpoint server
 * @param {boolean} props.autoConnectIdeFlag - Auto-connect IDE
 * @param {boolean} props.strictMcpConfig - Strict MCP config mode
 * @param {string} props.systemPrompt - System prompt override
 * @param {string} props.appendSystemPrompt - Additional system prompt
 * @param {Function} props.onBeforeQuery - Pre-query callback
 * @param {Function} props.onTurnComplete - Turn completion callback
 * @param {boolean} props.disabled - Disable input
 * @param {Object} props.mainThreadAgentDefinition - Active agent
 */
function MainInteractiveApp({
  commands,
  debug,
  initialPrompt,
  initialTools,
  initialMessages,
  initialFileHistorySnapshots,
  mcpClients,
  dynamicMcpConfig,
  mcpCliEndpoint,
  autoConnectIdeFlag,
  strictMcpConfig = false,
  systemPrompt,
  appendSystemPrompt,
  onBeforeQuery,
  onTurnComplete,
  disabled = false,
  mainThreadAgentDefinition
}) {
  // ========================================
  // STATE MANAGEMENT
  // ========================================

  // Access global app state (from AppStateProvider)
  let [appState, setAppState] = useAppState();
  let {
    toolPermissionContext,
    verbose,
    mcp,
    plugins,
    agentDefinitions
  } = appState;

  // Navigation context for file paths
  let navigationContext = useNavigationContext();

  // Load available tools based on permissions
  let builtInTools = React.useMemo(
    () => loadCommandsFromPermissions(toolPermissionContext),
    [toolPermissionContext]
  );

  // ========================================
  // MCP STATE
  // ========================================

  // Dynamic MCP configuration state
  let [dynamicMcpConfigState, setDynamicMcpConfig] = React.useState(dynamicMcpConfig);

  let updateDynamicMcpConfig = React.useCallback((newConfig) => {
    setDynamicMcpConfig(newConfig);
  }, []);

  // Merge MCP clients: initial + runtime
  let mergedMcpClients = mergeMcpClients(mcpClients, mcp.clients);

  // ========================================
  // UI STATE
  // ========================================

  // Current UI mode
  let [uiMode, setUiMode] = React.useState("prompt");
  // Modes: "prompt" | "responding" | "tool-permission" | "elicitation"

  // Turn counter (for tracking conversation progress)
  let [turnNumber, setTurnNumber] = React.useState(1);

  // Spinner visibility
  let [showSpinner, setShowSpinner] = React.useState(false);

  // IDE integration state
  let [selectedIde, setSelectedIde] = React.useState(undefined);
  let [ideToInstallExtension, setIdeToInstallExtension] = React.useState(null);
  let [ideInstallationStatus, setIdeInstallationStatus] = React.useState(null);

  // ========================================
  // CONVERSATION STATE
  // ========================================

  // Conversation messages
  let [messages, setMessages] = React.useState(initialMessages ?? []);

  // Current user input
  let [currentInput, setCurrentInput] = React.useState("");

  // Input mode (INSERT | VISUAL)
  let [inputMode, setInputMode] = React.useState("INSERT");

  // Response state
  let [isResponding, setIsResponding] = React.useState(false);

  // ========================================
  // TOOL EXECUTION STATE
  // ========================================

  // Pending tool approvals
  let [pendingToolApproval, setPendingToolApproval] = React.useState(null);

  // Tool execution results
  let [toolResults, setToolResults] = React.useState([]);

  // Active tool executions
  let [activeTools, setActiveTools] = React.useState([]);

  // ========================================
  // HOOKS & SIDE EFFECTS
  // ========================================

  // Initialize IDE connection
  useIdeInitialization({
    ideSelection: selectedIde,
    mcpClients: mergedMcpClients,
    ideInstallationStatus: ideInstallationStatus
  });

  // Watch for MCP resource changes
  useMcpResourceWatcher({ mcpClients: mergedMcpClients });

  // Monitor background tasks
  useBackgroundTaskMonitor();

  // File history tracking
  useFileHistoryTracking();

  // Git diff tracking
  useGitDiffTracking();

  // Auto-updater notifications
  useAutoUpdater();

  // ========================================
  // COMPUTED VALUES
  // ========================================

  // Merge all available tools
  let allAvailableTools = React.useMemo(() => {
    return [...builtInTools, ...initialTools];
  }, [builtInTools, initialTools]);

  // Resolve tools for current agent
  let toolsForAgent = React.useMemo(() => {
    if (!mainThreadAgentDefinition) return allAvailableTools;

    let { resolvedTools } = resolveAgentTools(
      mainThreadAgentDefinition,
      allAvailableTools,
      false
    );

    return resolvedTools;
  }, [mainThreadAgentDefinition, allAvailableTools]);

  // Merge all available commands
  let mergedCommands = mergeCommandLists(
    commands,
    plugins.commands,
    mcp.commands
  );

  // ========================================
  // EVENT HANDLERS
  // ========================================

  /**
   * Handle user message submission
   */
  let handleUserMessage = React.useCallback(async (userMessage) => {
    // Add user message to conversation
    setMessages(prev => [...prev, {
      role: "user",
      content: userMessage
    }]);

    // Set responding state
    setIsResponding(true);
    setUiMode("responding");
    setShowSpinner(true);

    // Call Claude API
    await executeAgenticTurn({
      messages: [...messages, { role: "user", content: userMessage }],
      tools: toolsForAgent,
      systemPrompt: systemPrompt,
      appendSystemPrompt: appendSystemPrompt,
      onContentBlock: handleContentBlock,
      onComplete: handleTurnComplete
    });
  }, [messages, toolsForAgent, systemPrompt, appendSystemPrompt]);

  /**
   * Handle content blocks from API response
   */
  let handleContentBlock = React.useCallback(async (block) => {
    if (block.type === "text") {
      // Display text content
      appendToLastAssistantMessage(block.text);
    } else if (block.type === "tool_use") {
      // Handle tool execution
      await handleToolExecution(block);
    } else if (block.type === "thinking") {
      // Display thinking block
      setThinkingContent(block.thinking);
    }
  }, []);

  /**
   * Handle tool execution with permission checking
   */
  let handleToolExecution = React.useCallback(async (toolUse) => {
    let { id, name, input } = toolUse;

    // Check if tool is allowed
    let isAllowed = checkToolPermission(
      name,
      input,
      toolPermissionContext
    );

    if (!isAllowed) {
      // Show permission prompt
      setUiMode("tool-permission");
      setPendingToolApproval({ id, name, input });
      return;
    }

    // Execute tool
    setActiveTools(prev => [...prev, { id, name }]);

    try {
      let result = await executeTool(name, input, {
        navigationContext,
        verbose,
        appState
      });

      // Add tool result to conversation
      setMessages(prev => [...prev, {
        role: "user",
        content: [{
          type: "tool_result",
          tool_use_id: id,
          content: result
        }]
      }]);

      // Remove from active tools
      setActiveTools(prev => prev.filter(t => t.id !== id));

      // Continue agentic turn
      continueAgenticTurn();
    } catch (error) {
      // Handle tool error
      handleToolError(id, name, error);
    }
  }, [toolPermissionContext, navigationContext, verbose, appState]);

  /**
   * Handle turn completion
   */
  let handleTurnComplete = React.useCallback(() => {
    setIsResponding(false);
    setUiMode("prompt");
    setShowSpinner(false);
    setTurnNumber(prev => prev + 1);

    // Callback to parent
    onTurnComplete?.();
  }, [onTurnComplete]);

  // ========================================
  // RENDER
  // ========================================

  return React.createElement(
    Box,
    { flexDirection: "column", height: "100%" },

    // Message list (conversation history)
    React.createElement(MessageList, {
      messages: messages,
      isResponding: isResponding,
      showSpinner: showSpinner
    }),

    // Tool outputs
    activeTools.length > 0 && React.createElement(ToolOutputList, {
      activeTools: activeTools
    }),

    // Input box (only show when in prompt mode)
    uiMode === "prompt" && React.createElement(InputBox, {
      value: currentInput,
      onChange: setCurrentInput,
      onSubmit: handleUserMessage,
      mode: inputMode,
      disabled: disabled
    }),

    // Permission prompt (modal)
    uiMode === "tool-permission" && React.createElement(PermissionPrompt, {
      tool: pendingToolApproval,
      onApprove: () => {
        // Grant permission and execute
        grantToolPermission(pendingToolApproval.name, toolPermissionContext);
        handleToolExecution(pendingToolApproval);
        setPendingToolApproval(null);
        setUiMode("responding");
      },
      onDeny: () => {
        // Deny and add error result
        addToolErrorResult(pendingToolApproval.id, "Permission denied");
        setPendingToolApproval(null);
        setUiMode("prompt");
      }
    }),

    // Status line (bottom)
    React.createElement(StatusLine, {
      mode: uiMode,
      turnNumber: turnNumber,
      ideStatus: selectedIde
    })
  );
}
```

**Key State Variables:**

```javascript
function WVA({ commands, initialPrompt, ... }) {
  // Conversation state
  const [messages, setMessages] = useState([]);
  const [isResponding, setIsResponding] = useState(false);

  // Tool execution
  const [pendingTools, setPendingTools] = useState([]);
  const [toolResults, setToolResults] = useState([]);

  // MCP state
  const [mcpClients, setMcpClients] = useState(Y);  // From props
  const [mcpTools, setMcpTools] = useState([]);

  // UI state
  const [showSpinner, setShowSpinner] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [mode, setMode] = useState("prompt");  // prompt | responding | tool-permission

  // Input state
  const [currentInput, setCurrentInput] = useState(initialPrompt || "");
  const [inputMode, setInputMode] = useState("INSERT");

  // ... 50+ more state variables
}
```

**Main Loop Workflow:**

```
User Input Event
      │
      ▼
┌─────────────────────────┐
│  onUserInput Handler    │
│  1. Validate input      │
│  2. Add user message    │
│  3. Set responding mode │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  Call Claude API        │
│  - Build request        │
│  - Stream response      │
│  - Parse events         │
└──────────┬──────────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌─────────┐  ┌─────────────┐
│  Text   │  │  Tool Use   │
│  Block  │  │  Block      │
└────┬────┘  └──────┬──────┘
     │              │
     │    ┌─────────▼──────────┐
     │    │  Check Permissions │
     │    │  if (not allowed): │
     │    │    show prompt     │
     │    └─────────┬──────────┘
     │              │
     │    ┌─────────▼──────────┐
     │    │  Execute Tool      │
     │    │  - Call tool impl  │
     │    │  - Capture output  │
     │    │  - Handle errors   │
     │    └─────────┬──────────┘
     │              │
     │    ┌─────────▼──────────┐
     │    │  Add Tool Result   │
     │    │  to messages       │
     │    └─────────┬──────────┘
     │              │
     │              ▼
     │    ┌─────────────────┐
     │    │  Continue Loop  │
     │    │  (another API   │
     │    │   call)         │
     │    └─────────────────┘
     │
     ▼
┌─────────────────────────┐
│  Display Response       │
│  - Update UI            │
│  - Set mode to prompt   │
│  - Ready for next input │
└─────────────────────────┘
```

**Code Snippet - Tool Execution:**
```javascript
// When tool_use content block is received
if (contentBlock.type === "tool_use") {
  const tool = {
    id: contentBlock.id,
    name: contentBlock.name,
    input: contentBlock.input
  };

  // Check permissions
  const allowed = checkToolPermission(
    tool.name,
    toolPermissionContext
  );

  if (!allowed) {
    // Show permission prompt
    setMode("tool-permission");
    setPendingToolApproval(tool);
    return;
  }

  // Execute tool
  const result = await executeTool(tool);

  // Add result to conversation
  addMessage({
    role: "user",
    content: [{
      type: "tool_result",
      tool_use_id: tool.id,
      content: result
    }]
  });

  // Continue conversation
  continueAgenticTurn();
}
```

### Phase 7: Ink.js Rendering

**How Ink.js Works:**

```
React Component Tree
      │
      ▼
Ink.js Reconciler
      │
      ├─► Create Yoga nodes (layout engine)
      ├─► Calculate layout (flexbox)
      ├─► Generate ANSI escape sequences
      └─► Write to stdout
```

**Render Function (VG):**

```javascript
// Simplified Ink.js render flow
async function VG(element, options) {
  // 1. Create container
  const container = createContainer();

  // 2. Setup output streams
  container.stdout = options.stdout || process.stdout;
  container.stdin = options.stdin || process.stdin;

  // 3. Render React element
  updateContainer(element, container);

  // 4. Start render loop
  const renderLoop = () => {
    // Calculate layout
    container.yogaNode.calculateLayout();

    // Generate output
    const output = renderToTerminal(container);

    // Write to terminal
    container.stdout.write(output);
  };

  // 5. Return unmount function
  return {
    unmount: () => {
      // Cleanup
      container.yogaNode.free();
      // Restore terminal state
    }
  };
}
```

**React to Terminal Rendering:**

```
<Box flexDirection="column">           ┌──────────────────┐
  <Text color="blue">                  │ esc[34mHello     │
    Hello                              │ esc[0m           │
  </Text>                              ├──────────────────┤
  <Box border="single">                │ ┌──────────────┐ │
    <Text>Content</Text>               │ │ Content      │ │
  </Box>                               │ └──────────────┘ │
</Box>                                 └──────────────────┘
```

### Phase 8: Shutdown

**Cleanup Operations:**

```
Exit Signal/Command
      │
      ▼
┌──────────────────────────┐
│  Trigger Shutdown        │
│  - User quit             │
│  - Error exit            │
│  - Process signal        │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Ink.js Cleanup          │
│  - Unmount components    │
│  - Free Yoga nodes       │
│  - Restore cursor        │
│  - Reset raw mode        │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  MCP Cleanup             │
│  - Close all clients     │
│  - Stop MCP endpoint     │
│  - Save session state    │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Save Session            │
│  - Write message history │
│  - Save file snapshots   │
│  - Update metadata       │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Plugin Cleanup          │
│  - Call plugin hooks     │
│  - Save plugin state     │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Analytics Flush         │
│  - Send pending events   │
│  - Wait for completion   │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Process Exit            │
│  - Set exit code         │
│  - Terminate process     │
└──────────────────────────┘
```

**Code Snippet:**
```javascript
// Cleanup on unmount
componentWillUnmount() {
  // Restore cursor
  if (this.props.stdout.isTTY) {
    this.props.stdout.write(XM.cursorShow);
  }

  // Clear timers
  if (this.incompleteEscapeTimer) {
    clearTimeout(this.incompleteEscapeTimer);
  }

  // Restore raw mode
  if (this.isRawModeSupported()) {
    this.handleSetRawMode(false);
  }
}

// Global cleanup handlers
PG(async () => {
  // Stop MCP CLI endpoint
  await O1?.stop();

  // Emit exit event
  k6("info", "exited");
});
```

---


---

> **Continue to Part 2:** [workflow_subsystems.md](./workflow_subsystems.md) for Subsystem Workflows, Summary, and Error Handling.
