# CLI Entry Points

> Related Symbols:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - CLI Module

## Overview

The entry point for Claude Code v2.1.38 has evolved significantly from previous versions to support code splitting and lazy loading. The monolithic CLI file has been broken down into ~190 chunks, with `cli.chunks.mjs` serving as the bootstrap entry point.

### Execution Flow

1.  **Bootstrap**: `cli.chunks.mjs` imports the core runtime and calls `qZz` (CLI Wrapper).
2.  **Wrapper (`qZz`)**: Handles high-level initialization and imports the main application logic.
3.  **Main Entry (`nGz`)**: Determines the execution mode (CLI vs SDK) and environment.
4.  **Commander Setup (`aGz`)**: Defines the CLI interface, parses arguments, and triggers the main session loop.

---

## 1. Bootstrap & Wrapper

### `cliWrapper` (qZz)

**What it does:**
Acts as the immediate entry point, likely handling basic setup before loading the full application.

**How it works:**
1.  Invokes `nGz` (mainEntry) via a dynamic import or direct call structure established by the chunk loader.
2.  Manages top-level error boundaries or signal handlers (inferred).

```javascript
// ============================================
// cliWrapper - Bootstrap entry point
// Location: chunks.189.mjs:16
// ============================================

// ORIGINAL (for source lookup):
// Sy = v(() => { b7(); m6(); ... B6() })

// READABLE (for understanding):
const cliWrapper = lazyInit(() => {
    initSubsystems();
    // ... imports and setup
    mainEntry();
});

// Mapping: Sy→cliWrapper
```

---

## 2. Main Entry Point

### `mainEntry` (nGz)

**What it does:**
The primary initialization function that prepares the environment and determines the "Client Type".

**How it works:**
1.  Sets `process.title = "claude"`.
2.  Checks `process.env.CLAUDE_CODE_ENTRYPOINT` to determine if running as `sdk-cli`, `remote`, `github-action`, etc.
3.  Sets the global "Client Type" via `uL6`.
4.  Calls `lGz` to eager-load settings.
5.  Awaits `aGz` (commanderSetup) to run the CLI.

**Key Decision: Client Type Determination**
The app supports multiple modes beyond just "interactive CLI":
- `sdk-cli`: When controlled programmatically.
- `remote`: When running as a remote agent.
- `github-action`: When running in CI.

```javascript
// ============================================
// mainEntry - Core initialization logic
// Location: chunks.190.mjs:931-956
// ============================================

// ORIGINAL (for source lookup):
async function nGz() {
    EK("main_function_start"), process.env.NoDefaultCurrentDirectoryInExePath = "1", _Dq();
    // ...
    let A = process.argv.slice(2),
        q = A.includes("-p") || A.includes("--print"),
    // ...
    let H = (() => {
        if (process.env.GITHUB_ACTIONS === "true") return "github-action";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-ts") return "sdk-typescript";
        // ...
        return "cli"
    })();
    uL6(H), EK("main_client_type_determined"), lGz(), EK("main_before_run"), process.title = "claude", await aGz(), EK("main_after_run")
}

// READABLE (for understanding):
async function mainEntry() {
    telemetry.mark("main_function_start");
    process.env.NoDefaultCurrentDirectoryInExePath = "1";
    setupSignalHandlers();

    const args = process.argv.slice(2);
    const isPrintMode = args.includes("-p") || args.includes("--print");
    
    // Determine Client Type
    const clientType = (() => {
        if (process.env.GITHUB_ACTIONS === "true") return "github-action";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-ts") return "sdk-typescript";
        // ... (checks other env vars)
        return "cli";
    })();

    setGlobalClientType(clientType);
    telemetry.mark("main_client_type_determined");
    
    eagerLoadSettings(); // lGz
    
    process.title = "claude";
    await commanderSetup(); // aGz
    telemetry.mark("main_after_run");
}

// Mapping: nGz→mainEntry, aGz→commanderSetup, lGz→eagerLoadSettings, uL6→setGlobalClientType
```

---

## 3. Commander Setup & Action Handler

### `commanderSetup` (aGz)

**What it does:**
Configures the `commander` library with all supported flags and defines the async action handler that starts the session.

**How it works:**
1.  **Configuration**: Sets up `commander` with `.name("claude")`, `.description(...)`.
2.  **Flags**: Registers ~50 flags (see [argument_parsing.md](./argument_parsing.md)).
3.  **Action Handler**:
    *   Parses all options.
    *   Initializes plugins (`plugin-dir`).
    *   Checks for "Remote" mode (teleport/resume).
    *   Loads MCP configuration (`mcp-config`).
    *   **Interactive vs Headless**:
        *   If `isNonInteractive` (print mode): Calls `runHeadless` (`j5` / `UMq`).
        *   If Interactive: Initializes UI (`rGz`), runs Setup Screens (`gRq`), and starts REPL (`vK`).

**Critical Logic Branch: Interactive vs Headless**
The CLI splits behavior significantly based on the `-p` / `--print` flag.
- **Headless**: Optimized for piping, scripting, and SDK usage. Bypasses UI rendering (Ink).
- **Interactive**: Loads the full TUI, including the "Trust Dialog" and "Setup Screens".

```javascript
// ============================================
// commanderSetup - CLI configuration and action handler
// Location: chunks.190.mjs:999
// ============================================

// ORIGINAL (for source lookup):
async function aGz() {
    // ...
    let q = new UT6().configureHelp(A()).enablePositionalOptions();
    q.hook("preAction", async () => { ... });
    q.name("claude").description("Claude Code ...").option(...)
    // ...
    .action(async (w, H) => {
        // ... (Main Action Logic)
        if (z1) { // Non-interactive mode
            // ...
            let { runHeadless: j5 } = await Promise.resolve().then(() => (pMq(), UMq));
            j5(...);
            return;
        }
        // ... (Interactive mode)
        let { REPL: vK } = await Promise.resolve().then(() => (vUA(), WRq));
        await $l1(RA, wO.default.createElement(Pf1, { ... }, wO.default.createElement(vK, { ... })));
    })
}

// READABLE (for understanding):
async function commanderSetup() {
    const program = new Commander().configureHelp(...);
    
    // Define Options
    program.name("claude")
           .option("-p, --print", "Print response and exit")
           .option("--verbose", "Override verbose mode")
           // ... many more options

    // Main Action
    program.action(async (prompt, options) => {
        telemetry.mark("action_handler_start");
        
        // Load Plugins
        if (options.pluginDir) loadPlugins(options.pluginDir);

        // Check Execution Mode
        const isNonInteractive = options.print || !process.stdout.isTTY;

        // ... (MCP Loading, Settings Loading)

        // Branch 1: Headless Mode
        if (isNonInteractive) {
            const { runHeadless } = await import("./headlessModule");
            runHeadless(prompt, ...);
            return;
        }

        // Branch 2: Interactive Mode
        const { REPL } = await import("./replModule"); // WRq
        
        // Render UI
        await renderReactApp(
            React.createElement(AppProvider, {}, 
                React.createElement(REPL, { ... })
            )
        );
    });
}

// Mapping: aGz→commanderSetup, UT6→Commander, WRq→replModule, vK→REPL
```
