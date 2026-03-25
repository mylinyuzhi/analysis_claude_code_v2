# CLI Entry Points

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (CLI, Plan Mode, Hooks, Skills)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP, Auth, Permissions)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Chrome, IDE, Plugin)

Key functions in this document:
- `cliEntry` (JVz) - Top-level entry point: version check, subcommand routing, lazy main import - chunks.198.mjs:1573
- `mainEntry` (_Vz) - Main function: process setup, client type, calls run - chunks.197.mjs:1910
- `run` (OVz) - Commander setup, argument parsing, action handler - chunks.198.mjs:3
- `getEntrypoint` (aN9) - Returns `CLAUDE_CODE_ENTRYPOINT` env var - chunks.85.mjs:1821-1823
- `determineEntrypoint` (zVz) - Sets CLAUDE_CODE_ENTRYPOINT based on launch context - chunks.197.mjs:1895
- `createRenderOptions` (gEq) - Builds Ink render options with FPS metrics and flicker tracking - chunks.180.mjs:1248
- `handleStdinInput` (wVz) - Reads stdin pipe into string or returns stream for stream-json mode - chunks.197.mjs:1943
- `renderWithCallback` (Gjz) - Promise wrapper: resolves when the rendered component calls its done callback - chunks.180.mjs:1125
- `renderFullscreenComponent` (Qh) - Wraps a React component in AppStateProvider and renders fullscreen - chunks.180.mjs:1141
- `renderAndWait` (OV6) - Renders an Ink app and awaits its exit - chunks.180.mjs:1147
- `showSetupScreens` (BEq) - Orchestrates all onboarding/trust/policy dialogs before the REPL - chunks.180.mjs:1151
- `setSessionMetadata` (LF) - Sets session title, tag, agent name, PR info - chunks.174.mjs:2206
- `AppStateProvider` (Yj) - React context provider for global state store - chunks.148.mjs:2544
- `createStateStore` (WX1) - Observable state store factory (zustand-like but hand-rolled) - chunks.85.mjs:1747
- `cleanupOnExit` (HVz) - Restores terminal cursor on process exit

> **VERIFIED CORRECT MAPPINGS:** Cross-checked against source code in v2.1.76:
> - `JVz` → `cliEntry` @ chunks.198.mjs:1573 ✓
> - `_Vz` → `mainEntry` @ chunks.197.mjs:1910 ✓
> - `OVz` → `run` @ chunks.198.mjs:3 ✓
> - `aN9` → `getEntrypoint` @ chunks.85.mjs:1821 ✓
> - `zVz` → `determineEntrypoint` @ chunks.197.mjs:1895 ✓
> - `gEq` → `createRenderOptions` @ chunks.180.mjs:1248 ✓
> - `wVz` → `handleStdinInput` @ chunks.197.mjs:1943 ✓
> - `Gjz` → `renderWithCallback` @ chunks.180.mjs:1125 ✓
> - `Qh` → `renderFullscreenComponent` @ chunks.180.mjs:1141 ✓
> - `OV6` → `renderAndWait` @ chunks.180.mjs:1147 ✓
> - `BEq` → `showSetupScreens` @ chunks.180.mjs:1151 ✓
> - `LF` → `setSessionMetadata` @ chunks.174.mjs:2206 ✓
> - `Yj` → `AppStateProvider` @ chunks.148.mjs:2544 ✓
> - `WX1` → `createStateStore` @ chunks.85.mjs:1747 ✓

> **INCORRECT MAPPINGS (DO NOT USE):**
> - ~~`iGz` as `determineEntrypoint`~~ → `iGz` is actually `getVerbose` @ chunks.192.mjs:1971 (returns `A.verbose`)
> - ~~`rGz` as `createRenderOptions`~~ → `rGz` is actually `getReplBridgeEnvironmentId` @ chunks.192.mjs:1979
> - ~~`oGz` as `handleStdinInput`~~ → `oGz` is actually `getReplBridgeError` @ chunks.192.mjs:1983
> - ~~`gRq` as `showSetupScreens`~~ → `gRq` is `randomUUID` from crypto @ cli.chunks.mjs:8526
> - ~~`mGz` as `renderWithCallback`~~ → `mGz` is `sendModeChangeToTeamMembers` @ chunks.192.mjs:1670
> - ~~`K11` as `onChangeAppStateHandler`~~ → `K11` is unrelated (in chunks.10.mjs)

---

## Overview

### The Four-Phase Startup Sequence

Claude Code's startup is divided into four distinct phases, each loaded lazily to minimize time-to-first-output:

```
Phase 1: Bootstrap (cli.chunks.mjs)
  └─ calls JVz (cliEntry)

Phase 2: JVz - Early routing (chunks.198.mjs:1573)
  ├─ --version          → print & exit
  ├─ --mcp-cli          → mcpCliMain() & exit
  ├─ --ripgrep          → ripgrepMain() & exit
  ├─ --claude-in-chrome-mcp → runClaudeInChromeMcpServer() & return
  ├─ --chrome-native-host   → runChromeNativeHost() & return
  ├─ auth login|status|logout → authSubcommand() & return  [New in v2.1.76]
  └─ (default)          → startCapturingEarlyInput(), then lazy-import main

Phase 3: OVz - Environment setup (chunks.198.mjs:3)
  ├─ Telemetry markers
  ├─ Determine client type
  └─ Commander setup with action handler

Phase 4: Action Handler - Commander + REPL
  ├─ preAction: migrations, remote settings
  ├─ action handler: builds initialState (~35 fields), routes to render path
  └─ Renders TUA (REPL component) via renderFullscreenComponent
```

### Why Lazy Loading?

The `Promise.resolve().then(() => (...))` pattern used throughout `JVz` is the bundler's code-split syntax. Instead of loading all 198 chunks at startup, each subcommand path loads only what it needs. This means:

- `--ripgrep` never loads React, Ink, MCP, or any tool definitions
- `--mcp-cli` never loads the REPL or UI components
- The default REPL path still lazy-loads `main` after capturing early keyboard input

This reduces cold-start latency for single-purpose invocations (e.g., ripgrep path from within a tool execution).

---

## 1. `cliEntry` (JVz) - Top-Level Entry Point

### What it does

`cliEntry` is the true entry point called by `cli.chunks.mjs`. It performs the fastest possible checks first (version, special subcommands), then hands off to the full application. Its primary job is to make short-circuit paths (like `--version`) as cheap as possible while ensuring the heavy main module is only loaded when needed.

### How it works

```javascript
// ============================================
// cliEntry - Top-level CLI entry point with subcommand routing
// Location: chunks.198.mjs:1573-1650
// ============================================

// ORIGINAL (for source lookup):
async function JVz() {
    let A = process.argv.slice(2);
    if (A.length === 1 && (A[0] === "--version" || A[0] === "-v" || A[0] === "-V")) {
        console.log(`${VERSION} (Claude Code)`);
        return
    }
    let { profileCheckpoint: q } = await Promise.resolve().then(() => (Fl(), XiA));
    if (q("cli_entry"), process.argv[2] === "--claude-in-chrome-mcp") {
        // ...chrome-mcp path
    } else if (process.argv[2] === "--chrome-native-host") {
        // ...chrome native host path
    }
    // ... additional routing logic
    let { startCapturingEarlyInput: Y } = await Promise.resolve().then(() => (bu6(), Ey7));
    Y(), q("cli_before_main_import");
    let { main: z } = await Promise.resolve().then(() => (Ta8(), yFq));
    // ...
}

// READABLE (for understanding):
async function cliEntry() {
    let args = process.argv.slice(2);

    // Fast path: --version without loading any modules
    if (args.length === 1 && (args[0] === "--version" || args[0] === "-v" || args[0] === "-V")) {
        console.log(`${VERSION} (Claude Code)`);
        return;
    }

    // Load telemetry profiling
    let { profileCheckpoint } = await import("./telemetry");
    profileCheckpoint("cli_entry");

    // Fast paths for special subcommands
    if (process.argv[2] === "--claude-in-chrome-mcp") {
        let { runClaudeInChromeMcpServer } = await import("./chrome-mcp");
        await runClaudeInChromeMcpServer();
        return;
    }

    // ... additional routing for chrome-native-host, remote-control, tmux, etc.

    // Start capturing keyboard input early (before main loads)
    let { startCapturingEarlyInput } = await import("./input");
    startCapturingEarlyInput();

    // Lazy load and call main()
    let { main } = await import("./main");
    await main();
}

// Mapping: JVz→cliEntry, A→args, q→profileCheckpoint, Y→startCapturingEarlyInput, z→main
```
        }
    }
    if (A[0] === "--ripgrep") {
        q("cli_ripgrep_path");
        let w = A.slice(1), { ripgrepMain: H } = await Promise.resolve().then(() => (QXq(), FXq));
        process.exitCode = H(w);
        return
    }
    if (process.argv[2] === "--claude-in-chrome-mcp") {
        q("cli_claude_in_chrome_mcp_path");
        let { runClaudeInChromeMcpServer: w } = await Promise.resolve().then(() => (dXq(), pXq));
        await w();
        return
    } else if (process.argv[2] === "--chrome-native-host") {
        q("cli_chrome_native_host_path");
        let { runChromeNativeHost: w } = await Promise.resolve().then(() => (aXq(), oXq));
        await w();
        return
    }
    // [New in v2.1.76] auth subcommand dispatch
    if (A[0] === "auth" && ["login", "status", "logout"].includes(A[1])) {
        let { authSubcommand: w } = await Promise.resolve().then(() => (authChunk(), authExports));
        await w(A[1]);
        return
    }
    let K = A.includes("--tmux") || A.includes("--tmux=classic");
    if (A.length === 1 && (A[0] === "--update" || A[0] === "--upgrade"))
        process.argv = [process.argv[0], process.argv[1], "update"];
    let { startCapturingEarlyInput: Y } = await Promise.resolve().then(() => (lC1(), T77));
    Y(), q("cli_before_main_import");
    let { main: z } = await Promise.resolve().then(() => (pRq(), URq));
    q("cli_after_main_import"), await z(), q("cli_after_main_complete")
}

// READABLE (for understanding):
async function cliEntry() {
    let args = process.argv.slice(2);

    // Fast path: version check requires no dynamic imports at all
    if (args.length === 1 && (args[0] === "--version" || args[0] === "-v" || args[0] === "-V")) {
        console.log(`${VERSION} (Claude Code)`);
        return;
    }

    // Load profiling checkpoint tracker (lightweight)
    let { profileCheckpoint } = await import(profileCheckpointChunk);
    profileCheckpoint("cli_entry");

    // MCP CLI subcommand: guarded by feature flag
    if (args[0] === "--mcp-cli") {
        let { isMcpCliEnabled } = await import(mcpCliEnabledChunk);
        if (isMcpCliEnabled()) {
            let remainingArgs = args.slice(1);
            let { mcpCliMain } = await import(mcpCliMainChunk);
            process.exit(await mcpCliMain(remainingArgs));
        }
    }

    // Ripgrep path: used internally by bash tool for file search
    if (args[0] === "--ripgrep") {
        profileCheckpoint("cli_ripgrep_path");
        let ripgrepArgs = args.slice(1);
        let { ripgrepMain } = await import(ripgrepChunk);
        process.exitCode = ripgrepMain(ripgrepArgs);
        return;
    }

    // Chrome MCP server: runs embedded Chrome automation server
    if (process.argv[2] === "--claude-in-chrome-mcp") {
        profileCheckpoint("cli_claude_in_chrome_mcp_path");
        let { runClaudeInChromeMcpServer } = await import(chromeMcpChunk);
        await runClaudeInChromeMcpServer();
        return;
    } else if (process.argv[2] === "--chrome-native-host") {
        profileCheckpoint("cli_chrome_native_host_path");
        let { runChromeNativeHost } = await import(chromeNativeHostChunk);
        await runChromeNativeHost();
        return;
    }

    // [New in v2.1.76] Auth subcommand: claude auth login|status|logout
    // Routes to auth subsystem before loading Commander or the main REPL
    if (args[0] === "auth" && ["login", "status", "logout"].includes(args[1])) {
        let { authSubcommand } = await import(authChunk);
        await authSubcommand(args[1]);
        return;
    }

    // Normalize --update/--upgrade to the "update" subcommand
    if (args.length === 1 && (args[0] === "--update" || args[0] === "--upgrade"))
        process.argv = [process.argv[0], process.argv[1], "update"];

    // Capture keyboard input BEFORE the heavy main import to avoid losing keystrokes
    let { startCapturingEarlyInput } = await import(earlyInputChunk);
    startCapturingEarlyInput();

    profileCheckpoint("cli_before_main_import");
    let { main } = await import(mainChunk);  // Heavy load: all ~198 chunks
    profileCheckpoint("cli_after_main_import");
    await main();
    profileCheckpoint("cli_after_main_complete");
}

// Mapping: JVz→cliEntry, A→args, q→profileCheckpoint, K→hasTmuxFlag,
//          Y→startCapturingEarlyInput, z→main, w→various subcommand exports
```

**Step-by-step breakdown:**

1. **Version check (sync, no imports):** The very first check, before any `await`, handles `--version`/`-v`/`-V`. It reads the pre-bundled `VERSION` constant and exits. Zero dynamic imports means near-instant response.

2. **Profile checkpoint load:** The profiling module is loaded lazily here rather than at bundle top-level. This ensures that even the profiling overhead does not apply to the version check path.

3. **MCP CLI routing:** If `--mcp-cli` is the first argument AND the `isMcpCliEnabled()` feature flag returns true, the entire MCP CLI subsystem is loaded and run. This supports Claude Code acting as an MCP protocol client itself (for testing and automation). The `process.exit()` call ensures no cleanup from the main path runs.

4. **Ripgrep routing:** The `--ripgrep` flag routes to the bundled ripgrep binary wrapper. This is used by the `BashTool` internally when Claude Code invokes ripgrep for file search operations. It is not intended as a user-facing feature. `process.exitCode` is set (rather than calling `process.exit()`) to allow synchronous cleanup handlers to run.

5. **Chrome paths:** Two Chrome-related paths:
   - `--claude-in-chrome-mcp`: Runs Claude Code as an MCP server that controls Chrome via the Chrome DevTools Protocol. This is how the "Claude in Chrome" browser extension communicates.
   - `--chrome-native-host`: Runs the Chrome Native Messaging host protocol, which is the IPC bridge between Chrome extensions and native applications.

6. **Auth subcommand routing (New in v2.1.76):** `claude auth login`, `claude auth status`, and `claude auth logout` are intercepted in the early dispatch table before the heavy main module loads. This keeps auth operations lightweight and avoids loading the REPL for common credential management tasks.

7. **Update normalization:** Rewrites `process.argv` in-place before the Commander parser sees it. This is a quirky but necessary transformation: older versions used `--update` as a flag, but current versions have an `update` subcommand. The in-place rewrite is transparent to Commander.

8. **Early input capture:** `startCapturingEarlyInput()` begins buffering stdin keystrokes before the 100-400ms it takes to load the main module. Without this, fast typists would lose characters typed while the module loads.

9. **Main module lazy import:** The actual REPL/Commander setup lives in the lazily imported `main` chunk. This deferred import is the key architectural choice: the bootstrap can perform all routing decisions while keeping the initial bundle small.

### Why this approach

The function acts as a **dispatch table** executed before full application initialization. The alternatives would be:

- **Commander-first:** Parse all arguments with Commander before routing. Problem: loading Commander and registering all subcommands takes ~50-100ms, wasted for `--version`.
- **Monolithic entry:** Put everything in one file. Problem: the bundler cannot tree-shake across async chunk boundaries; the entire ~15MB bundle would load for every invocation.
- **Shell script wrapper:** Use a shell script to route before Node.js. Problem: loses Node.js error handling and makes cross-platform distribution harder.

**Key insight:** The `startCapturingEarlyInput()` call placed between the lightweight routing checks and the heavy `main` import is the most important subtle behavior in this function. It solves the "lost keystrokes during startup" problem without requiring any changes to the REPL's input handling. The captured buffer is drained into the REPL's input queue once the REPL renders.

---

## 2. `determineEntrypoint` (zVz) - Entrypoint Classification

### What it does

Sets the `CLAUDE_CODE_ENTRYPOINT` environment variable to one of several string values that classify how Claude Code is being launched. This value propagates through the entire session and affects telemetry, permission handling, and UI decisions downstream.

### How it works

```javascript
// ============================================
// determineEntrypoint - Classify launch context via env var
// Location: chunks.197.mjs:1895-1908
// ============================================

// ORIGINAL (for source lookup):
function zVz(A) {
    if (process.env.CLAUDE_CODE_ENTRYPOINT) return;
    let q = process.argv.slice(2), K = q.indexOf("mcp");
    if (K !== -1 && q[K + 1] === "serve") {
        process.env.CLAUDE_CODE_ENTRYPOINT = "mcp";
        return
    }
    if (t6(process.env.CLAUDE_CODE_ACTION)) {
        process.env.CLAUDE_CODE_ENTRYPOINT = "claude-code-github-action";
        return
    }
    process.env.CLAUDE_CODE_ENTRYPOINT = A ? "sdk-cli" : "cli"
}

// READABLE (for understanding):
function determineEntrypoint(isNonInteractive) {
    // Idempotent: if already set (by SDK wrapper, IDE plugin, etc.), respect it
    if (process.env.CLAUDE_CODE_ENTRYPOINT) return;

    let args = process.argv.slice(2);
    let mcpIndex = args.indexOf("mcp");

    // "claude mcp serve" → MCP server mode
    if (mcpIndex !== -1 && args[mcpIndex + 1] === "serve") {
        process.env.CLAUDE_CODE_ENTRYPOINT = "mcp";
        return;
    }

    // GitHub Actions environment
    if (parseBoolean(process.env.CLAUDE_CODE_ACTION)) {
        process.env.CLAUDE_CODE_ENTRYPOINT = "claude-code-github-action";
        return;
    }

    // Non-interactive (--print, --init-only, --sdk-url) → sdk-cli; else → cli
    process.env.CLAUDE_CODE_ENTRYPOINT = isNonInteractive ? "sdk-cli" : "cli";
}

// Mapping: zVz→determineEntrypoint, A→isNonInteractive, q→args, K→mcpIndex,
//          t6→parseBoolean
```

**Step-by-step breakdown:**

1. **Idempotency guard:** The first check `if (process.env.CLAUDE_CODE_ENTRYPOINT) return` is critical. It means external launchers (the VS Code extension, the Python SDK, the TypeScript SDK) can set this variable before spawning Claude Code, and `determineEntrypoint` will respect it. The VS Code extension sets `CLAUDE_CODE_ENTRYPOINT=claude-vscode`; the Python SDK sets `sdk-py`; etc.

2. **MCP serve detection:** The check `args[mcpIndex + 1] === "serve"` handles `claude mcp serve`. Note it checks the word *after* `mcp`, not just the presence of `mcp`. This correctly handles cases where `mcp` appears as a file argument in other positions.

3. **GitHub Actions detection:** `CLAUDE_CODE_ACTION` is a GitHub Actions-specific variable set by the GitHub Actions wrapper. Its presence (non-empty) indicates Claude Code is running in CI.

4. **Interactive vs non-interactive:** The `isNonInteractive` parameter is computed in `mainEntry` (_Vz) by checking for `-p`/`--print`, `--init-only`, `--sdk-url`, or `!process.stdout.isTTY`. This is the "SDK CLI" mode: the TypeScript and Python SDKs invoke Claude Code as a subprocess with `--print` or piped stdio.

**Known entrypoint values and their meanings:**

- `cli` - Interactive terminal session
- `sdk-cli` - Subprocess invocation by SDK (non-interactive)
- `mcp` - Running as MCP server (`claude mcp serve`)
- `claude-code-github-action` - GitHub Actions CI runner
- `claude-vscode` - VS Code extension (set externally)
- `sdk-typescript` - TypeScript SDK (set externally)
- `sdk-python` - Python SDK (set externally)
- `local-agent` - Local agent mode (set externally)
- `remote` - Remote session via SSH/tunnel (set externally or detected via `CLAUDE_CODE_SESSION_ACCESS_TOKEN`)

**Key insight:** Using an environment variable as the carrier (rather than a global JavaScript variable) means the entrypoint classification is visible to any child process spawned by Claude Code. When Claude Code spawns a subagent, the subagent can read `CLAUDE_CODE_ENTRYPOINT` to understand its launch context.

---

## 3. `mainEntry` (_Vz) - Full Application Startup

### What it does

`mainEntry` is the orchestration layer between the lightweight bootstrap (`cliEntry`) and the Commander-based argument parsing. It performs environment setup, telemetry initialization, client type classification, and then delegates to `OVz` (run) for Commander parsing and REPL rendering.

### How it works

```javascript
// ============================================
// mainEntry - Full startup orchestrator
// Location: chunks.197.mjs:1910-1941
// ============================================

// ORIGINAL (for source lookup):
async function _Vz() {
    Zq("main_function_start"), process.env.NoDefaultCurrentDirectoryInExePath = "1", eVq(), process.on("exit", () => {
        HVz()
    }), process.on("SIGINT", () => {
        process.exit(0)
    }), Zq("main_warning_handler_initialized");
    let A = process.argv.slice(2),
        q = A.includes("-p") || A.includes("--print"),
        K = A.includes("--init-only"),
        Y = A.some(($) => $.startsWith("--sdk-url")),
        z = q || K || Y || !process.stdout.isTTY;
    if (z) $s();
    vu1(!z), zVz(z);
    let w = (() => {
        if (t6(process.env.GITHUB_ACTIONS)) return "github-action";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-ts") return "sdk-typescript";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-py") return "sdk-python";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-cli") return "sdk-cli";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "claude-vscode") return "claude-vscode";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "local-agent") return "local-agent";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "claude-desktop") return "claude-desktop";
        let $ = process.env.CLAUDE_CODE_SESSION_ACCESS_TOKEN || process.env.CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR;
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "remote" || $) return "remote";
        return "cli"
    })();
    Nu1(w);
    let O = process.env.CLAUDE_CODE_QUESTION_PREVIEW_FORMAT;
    if (O === "markdown" || O === "html") Et6(O);
    else if (!w.startsWith("sdk-")) Et6("markdown");
    if (process.env.CLAUDE_CODE_ENVIRONMENT_KIND === "bridge") ku1("remote-control");
    Zq("main_client_type_determined"), YVz(), Zq("main_before_run"), process.title = "claude", await OVz(), Zq("main_after_run")
}

// READABLE (for understanding):
async function mainEntry() {
    recordTelemetry("main_function_start");

    // Prevent Windows from adding CWD to PATH (security hardening)
    process.env.NoDefaultCurrentDirectoryInExePath = "1";

    // Initialize warning handlers (captures Node.js unhandledRejection etc.)
    initWarningHandlers();

    // Cleanup: restore terminal state on exit
    process.on("exit", () => { cleanupOnExit(); });

    // SIGINT: convert Ctrl+C to clean exit (allows "exit" handlers to run)
    process.on("SIGINT", () => { process.exit(0); });

    recordTelemetry("main_warning_handler_initialized");

    // Determine if we're in non-interactive mode
    let args = process.argv.slice(2);
    let hasPrint = args.includes("-p") || args.includes("--print");
    let hasInitOnly = args.includes("--init-only");
    let hasSdkUrl = args.some((a) => a.startsWith("--sdk-url"));
    let isNonInteractive = hasPrint || hasInitOnly || hasSdkUrl || !process.stdout.isTTY;

    // Non-interactive mode: suppress Ink/TTY rendering
    if (isNonInteractive) suppressTtyOutput();

    // Initialize rendering mode (interactive vs headless)
    setRenderMode(!isNonInteractive);

    // Classify the entrypoint
    determineEntrypoint(isNonInteractive);

    // Map entrypoint to client type string for telemetry and analytics
    let clientType = (() => {
        if (parseBoolean(process.env.GITHUB_ACTIONS)) return "github-action";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-ts") return "sdk-typescript";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-py") return "sdk-python";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-cli") return "sdk-cli";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "claude-vscode") return "claude-vscode";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "local-agent") return "local-agent";
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "claude-desktop") return "claude-desktop";
        let tokenOrFd = process.env.CLAUDE_CODE_SESSION_ACCESS_TOKEN
                     || process.env.CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR;
        if (process.env.CLAUDE_CODE_ENTRYPOINT === "remote" || tokenOrFd) return "remote";
        return "cli";
    })();

    setClientType(clientType);

    // Set question preview format (markdown for non-SDK clients)
    let previewFormat = process.env.CLAUDE_CODE_QUESTION_PREVIEW_FORMAT;
    if (previewFormat === "markdown" || previewFormat === "html") setQuestionPreviewFormat(previewFormat);
    else if (!clientType.startsWith("sdk-")) setQuestionPreviewFormat("markdown");

    // Handle bridge environment
    if (process.env.CLAUDE_CODE_ENVIRONMENT_KIND === "bridge") setBridgeMode("remote-control");

    recordTelemetry("main_client_type_determined");
    initGlobalState();
    recordTelemetry("main_before_run");

    process.title = "claude";  // Shows as "claude" in ps/top output

    await run();   // OVz: parse args, render REPL
    recordTelemetry("main_after_run");
}

// Mapping: _Vz→mainEntry, Zq→recordTelemetry, eVq→initWarningHandlers,
//          HVz→cleanupOnExit, A→args, q→hasPrint, K→hasInitOnly, Y→hasSdkUrl,
//          z→isNonInteractive, $s→suppressTtyOutput, vu1→setRenderMode,
//          zVz→determineEntrypoint, w→clientType, Nu1→setClientType,
//          YVz→initGlobalState, OVz→run, t6→parseBoolean, Et6→setQuestionPreviewFormat
```

**Step-by-step breakdown:**

1. **`NoDefaultCurrentDirectoryInExePath`:** This Windows-specific environment variable prevents the OS from including the current working directory in the executable search path. Without it, a malicious `node.exe` or `git.exe` in the project directory could be executed instead of the system binary.

2. **Warning handler init (`_Dq`):** Sets up Node.js `unhandledRejection` and `uncaughtException` handlers. These capture errors that escape async boundaries and route them to Claude Code's error reporting rather than crashing with a raw stack trace.

3. **SIGINT → `process.exit(0)`:** By default, Node.js converts SIGINT to an `uncaughtException`. Mapping it to `process.exit(0)` instead ensures the "exit" event fires, which triggers `cleanupOnExit` (terminal cursor restoration). Without this, Ctrl+C in the REPL would leave the terminal in a broken state.

4. **Non-interactive detection (4 conditions):**
   - `--print`/`-p`: SDK/scripting mode, outputs text then exits
   - `--init-only`: Runs setup hooks then exits, never shows UI
   - `--sdk-url`: Connects to an SDK WebSocket endpoint
   - `!process.stdout.isTTY`: stdout is piped (e.g., `claude | grep`)

5. **Client type IIFE:** The immediately-invoked function that computes `clientType` is notable for its priority ordering. `GITHUB_ACTIONS=true` takes priority over any `CLAUDE_CODE_ENTRYPOINT` value. This handles the case where the GitHub Actions wrapper sets both environment variables. The remote detection checks for either the entrypoint string or the presence of an auth token/file descriptor.

6. **`process.title = "claude"`:** Sets the process name visible in `ps aux` and Activity Monitor. This is cosmetic but useful for users debugging multiple Claude Code instances.

**Key insight:** The `isNonInteractive` computation happens before `determineEntrypoint` is called, and its result is passed as the `isNonInteractive` argument. This means `determineEntrypoint`'s decision to use `"sdk-cli"` vs `"cli"` depends on the same flag computation. The two functions are tightly coupled by design: the non-interactive detection logic exists in exactly one place.

---

## 4. `createRenderOptions` (gEq) - Ink Render Configuration

### What it does

Constructs the configuration object passed to Ink's `render()` function. Critically, it wraps the `onFrame` callback to track rendering performance metrics (FPS) and detect/report visual flickering events.

### How it works

```javascript
// ============================================
// createRenderOptions - Ink render config with FPS and flicker tracking
// Location: chunks.180.mjs:1248-1282
// ============================================

// ORIGINAL (for source lookup):
function gEq(A) {
    let q = 0,
        K = xc(A);
    if (K.stdin) d("tengu_stdin_interactive", {});
    let Y = new ja8,
        z = Ma8();
    zu1(z);
    let _ = process.env.CLAUDE_CODE_FRAME_TIMING_LOG;
    return {
        getFpsMetrics: () => Y.getMetrics(),
        stats: z,
        renderOptions: {
            ...K,
            onFrame: (w) => {
                if (Y.record(w.durationMs), z.observe("frame_duration_ms", w.durationMs), _ && w.phases) {
                    let O = JSON.stringify({
                        total: w.durationMs,
                        ...w.phases,
                        rss: process.memoryUsage.rss(),
                        cpu: process.cpuUsage()
                    }) + `\n`;
                    Wjz(_, O)
                }
                if (hH8()) return;
                for (let O of w.flickers) {
                    if (O.reason === "resize") continue;
                    let $ = Date.now();
                    if ($ - q < 1000) d("tengu_flicker", {
                        desiredHeight: O.desiredHeight,
                        actualHeight: O.availableHeight,
                        reason: O.reason
                    });
                    q = $
                }
            }
        }
    }
}

// READABLE (for understanding):
function createRenderOptions(cliOptions) {
    let lastFlickerTimestamp = 0;
    let inkOptions = resolveInkOptions(cliOptions);  // xc()

    // Track if stdin is connected (used for telemetry)
    if (inkOptions.stdin) recordTelemetry("tengu_stdin_interactive", {});

    let fpsTracker = new FpsMetricsTracker();  // ja8
    let statsCollector = createStatsCollector();  // Ma8()
    initStatsCollector(statsCollector);  // zu1()

    // Optional: detailed frame timing log for debugging
    let frameTimingLog = process.env.CLAUDE_CODE_FRAME_TIMING_LOG;

    return {
        // Exposed so AppStateRoot can query render performance
        getFpsMetrics: () => fpsTracker.getMetrics(),
        stats: statsCollector,
        renderOptions: {
            ...inkOptions,
            onFrame: (frameInfo) => {
                // Always record frame timing
                fpsTracker.record(frameInfo.durationMs);
                statsCollector.observe("frame_duration_ms", frameInfo.durationMs);

                // Optional: write detailed frame timing to log file
                if (frameTimingLog && frameInfo.phases) {
                    let logEntry = JSON.stringify({
                        total: frameInfo.durationMs,
                        ...frameInfo.phases,
                        rss: process.memoryUsage.rss(),
                        cpu: process.cpuUsage()
                    }) + "\n";
                    appendToFile(frameTimingLog, logEntry);
                }

                // If in tmux or non-TTY mode, skip flicker reporting
                if (isTmuxMode()) return;

                // Check each flicker event in this frame
                for (let flicker of frameInfo.flickers) {
                    // Resize-triggered flickers are expected and not reportable
                    if (flicker.reason === "resize") continue;

                    let now = Date.now();
                    // Rate-limit flicker reporting to once per second
                    if (now - lastFlickerTimestamp < 1000) {
                        recordTelemetry("tengu_flicker", {
                            desiredHeight: flicker.desiredHeight,
                            actualHeight: flicker.availableHeight,
                            reason: flicker.reason
                        });
                    }
                    lastFlickerTimestamp = now;
                }
            }
        }
    };
}

// Mapping: gEq→createRenderOptions, A→cliOptions, q→lastFlickerTimestamp,
//          K→inkOptions, xc→resolveInkOptions, Y→fpsTracker, ja8→FpsMetricsTracker,
//          z→statsCollector, w→frameInfo, O→flicker, $→now, hH8→isTmuxMode,
//          d→recordTelemetry, Ma8→createStatsCollector, zu1→initStatsCollector
```

**Why flicker detection matters:**

Ink renders to the terminal by emitting ANSI escape sequences to move the cursor and rewrite lines. When the terminal window is resized or the content height exceeds the available rows, Ink may be forced to render fewer rows than it wants (the "actual" height is less than the "desired" height). This manifests as visual flickering or truncated output. By instrumenting the `onFrame` callback, Claude Code can detect when this is happening in production and correlate it with user-reported rendering issues.

The 1000ms rate limit prevents telemetry flooding during rapid resize events. Resize-triggered flickers are explicitly excluded because they are expected and user-initiated.

---

## 5. `handleStdinInput` (wVz) - Stdin Mode Detection and Reading

### What it does

Determines how to handle stdin: if it is a TTY (interactive terminal), pass the initial prompt string through unchanged. If stdin is piped, read the entire pipe content and either return it as a string (for text mode) or return the raw stream (for `stream-json` mode).

### How it works

```javascript
// ============================================
// handleStdinInput - Stdin pipe reading and stream-json routing
// Location: chunks.197.mjs:1943-1956
// ============================================

// ORIGINAL (for source lookup):
async function wVz(A, q) {
    if (!process.stdin.isTTY && !process.argv.includes("mcp")) {
        if (q === "stream-json") return process.stdin;
        process.stdin.setEncoding("utf8");
        let K = "";
        return process.stdin.on("data", (Y) => {
            K += Y
        }), await new Promise((Y) => {
            process.stdin.on("end", Y)
        }), [A, K].filter(Boolean).join(`\n`)
    }
    return A
}

// READABLE (for understanding):
async function handleStdinInput(promptArg, inputFormat) {
    // Check: is stdin a pipe AND we're not in MCP server mode?
    if (!process.stdin.isTTY && !process.argv.includes("mcp")) {
        // stream-json mode: pass the raw stream to the input processor
        if (inputFormat === "stream-json") return process.stdin;

        // Text mode: buffer the entire pipe content
        process.stdin.setEncoding("utf8");
        let buffered = "";
        process.stdin.on("data", (chunk) => { buffered += chunk; });

        // Wait for stream to finish
        await new Promise((resolve) => {
            process.stdin.on("end", resolve);
        });

        // Combine explicit prompt arg with piped content, separated by newline
        // filter(Boolean) removes empty strings so we don't get a leading newline
        return [promptArg, buffered].filter(Boolean).join("\n");
    }

    // Interactive TTY: return the prompt arg as-is
    return promptArg;
}

// Mapping: wVz→handleStdinInput, A→promptArg, q→inputFormat, K→buffered,
//          Y→chunk/resolve
```

**Three distinct execution paths:**

1. **Interactive TTY:** `process.stdin.isTTY === true`. Returns `promptArg` unchanged. The REPL handles interactive input through its own Ink/readline integration.

2. **Piped text mode:** `!isTTY && inputFormat !== "stream-json"`. Reads all stdin into a string. The `filter(Boolean).join("\n")` pattern correctly handles three cases:
   - Only prompt arg: `["hello", ""].filter(Boolean)` → `["hello"]` → `"hello"`
   - Only piped input: `["", "piped"].filter(Boolean)` → `["piped"]` → `"piped"`
   - Both: `["hello", "piped"]` → `"hello\npiped"` (prompt is prepended)

3. **Piped stream-json mode:** Returns `process.stdin` directly. The stream-json input format expects NDJSON (newline-delimited JSON) where each line is a message object. Processing is handled by a separate stream parser downstream.

**Key insight:** The MCP exclusion (`!process.argv.includes("mcp")`) is necessary because `claude mcp serve` uses stdin/stdout as its protocol transport. Without this exclusion, the function would buffer all the MCP protocol messages as text and feed them as a "prompt," breaking the MCP server entirely.

---

## 6. Ink Render Engine

The three rendering primitives (`Gjz`, `Qh`, `OV6`) form a layered abstraction over Ink's React rendering system.

### `renderWithCallback` (Gjz) - Promise-Based One-Shot Render

```javascript
// ============================================
// renderWithCallback - Render a component and resolve when it calls done()
// Location: chunks.180.mjs:1125-1130
// ============================================

// ORIGINAL (for source lookup):
function Gjz(A, q) {
    return new Promise((K) => {
        let Y = (z) => void K(z);
        A.render(q(Y))
    })
}

// READABLE (for understanding):
function renderWithCallback(inkInstance, componentFactory) {
    return new Promise((resolve) => {
        // Create a "done" callback that resolves the outer promise with the result
        let done = (result) => void resolve(result);
        // Call the factory with the done callback to get the React element
        // The component is responsible for calling done() when finished
        inkInstance.render(componentFactory(done));
    });
}

// Mapping: Gjz→renderWithCallback, A→inkInstance, q→componentFactory,
//          K→resolve, Y→done, z→result
```

**Pattern explained:** This is the standard "callback-to-promise" bridge pattern. The React component receives `done` as a prop (typically called `onDone`). When the user completes the dialog (clicks Accept, presses Enter, etc.), the component calls `onDone(result)`, which triggers `resolve(result)`, completing the promise. The caller `await`s the promise to know when the dialog is dismissed.

### `renderFullscreenComponent` (Qh) - Full-Screen Dialog Wrapper

```javascript
// ============================================
// renderFullscreenComponent - Fullscreen dialog with AppStateProvider
// Location: chunks.180.mjs:1141-1145
// ============================================

// ORIGINAL (for source lookup):
function Qh(A, q, K) {
    return Gjz(A, (Y) => ph.default.createElement(Yj, {
        onChangeAppState: K?.onChangeAppState
    }, ph.default.createElement(aj, null, q(Y))))
}

// READABLE (for understanding):
function renderFullscreenComponent(inkInstance, componentFactory, options) {
    return renderWithCallback(inkInstance, (done) =>
        React.createElement(AppStateProvider, {
            onChangeAppState: options?.onChangeAppState
        },
            React.createElement(FullscreenBox, null,
                componentFactory(done)
            )
        )
    );
}

// Mapping: Qh→renderFullscreenComponent, A→inkInstance, q→componentFactory,
//          K→options, Y→done, Yj→AppStateProvider, aj→FullscreenBox,
//          ph→React, Gjz→renderWithCallback
```

**Three layers of wrapping:**

1. `AppStateProvider` (`Yj`): Provides the global state store context so the dialog can read/write app state (e.g., the onboarding dialog writes `hasCompletedOnboarding`).
2. `FullscreenBox` (`aj`): An Ink box component that occupies the full terminal height/width.
3. `componentFactory(done)`: The actual dialog component, receiving the `done` callback.

### `renderAndWait` (OV6) - Render and Block Until Exit

```javascript
// ============================================
// renderAndWait - Render a full Ink app and await its exit
// Location: chunks.180.mjs:1147-1149
// ============================================

// ORIGINAL (for source lookup):
async function OV6(A, q) {
    A.render(q), mC1(), await A.waitUntilExit(), await Vq(0)
}

// READABLE (for understanding):
async function renderAndWait(inkInstance, reactElement) {
    inkInstance.render(reactElement);   // Render the component tree
    flushRenderQueue();                 // mC1(): force synchronous first render
    await inkInstance.waitUntilExit(); // Block until unmount
    await sleep(0);                    // Vq(0): yield to event loop for cleanup
}

// Mapping: OV6→renderAndWait, A→inkInstance, q→reactElement,
//          mC1→flushRenderQueue, Vq→sleep
```

**Why `await sleep(0)` at the end?**

After `waitUntilExit()` resolves, Ink has unmounted its React tree but asynchronous cleanup effects (React `useEffect` cleanup functions) may still be queued in the microtask queue. The `await sleep(0)` yields to the event loop, giving those cleanup callbacks a chance to run before the caller proceeds. Without this, resources (file watchers, WebSocket connections) opened by React effects may not be properly closed.

**`flushRenderQueue()`:** Forces Ink to perform the first render synchronously rather than deferring to the next event loop tick. This prevents a brief flash of an empty terminal before the first frame appears.

---

## 7. Setup Screens (`showSetupScreens` / BEq)

### What it does

Orchestrates a sequential series of modal dialogs that must be completed before the main REPL renders. Each dialog is rendered fullscreen, blocks until dismissed, and may write to the user's settings file. The function returns `true` if onboarding was shown (used to determine which analytics event to fire).

### How it works

```javascript
// ============================================
// showSetupScreens - Sequential onboarding/trust dialog orchestrator
// Location: chunks.180.mjs:1151-1246
// ============================================

// ORIGINAL (for source lookup):
async function BEq(A, q, K, Y, z) {
    if (t6(!1) || process.env.IS_DEMO) return !1;
    let _ = X1(), w = !1;
    if (!_.theme || !_.hasCompletedOnboarding) {
        w = !0;
        let [, { Onboarding: O }] = await Promise.all([Jz6(), Promise.resolve().then(() => (DEq(), MEq))]);
        await Qh(A, ($) => ph.default.createElement(O, {
            onDone: () => { Zjz(), $() }
        }), { onChangeAppState: bi })
    }
    if (H0q(), q11(), dFA(), await NM1()) {
        if (await LF(A, (O) => wO.default.createElement(RN6, {
                showIfAlreadyViewed: !1,
                location: H ? "onboarding" : "policy_update_modal",
                onDone: O
            })) === "escape") return c("tengu_grove_policy_exited", {}), w3(0), !1
    }
    if (process.env.ANTHROPIC_API_KEY) {
        let $ = cT(process.env.ANTHROPIC_API_KEY);
        if (bT6($) === "new") await LF(A, (_) => wO.default.createElement(sT6, { customApiKeyTruncated: $, onDone: _ }), { onChangeAppState: K11 })
    }
    if ((q === "bypassPermissions" || K) && !f6().bypassPermissionsModeAccepted) await LF(A, ($) => wO.default.createElement(hDq, { onAccept: $ }));
    if (z && !f6().hasCompletedClaudeInChromeOnboarding) await LF(A, ($) => wO.default.createElement(xDq, { onDone: $ }));
    return H
}

// READABLE (for understanding):
async function showSetupScreens(inkInstance, permissionMode, hasDangerousPermissions, commands, hasChrome) {
    // Skip all setup in feature-flag-disabled or demo mode
    if (isSetupDisabled() || process.env.IS_DEMO) return false;

    let settings = getUserSettings();
    let didShowOnboarding = false;

    // --- Dialog 1: Onboarding (theme selection + feature tour) ---
    if (!settings.theme || !settings.hasCompletedOnboarding) {
        didShowOnboarding = true;
        let [, { Onboarding }] = await Promise.all([
            loadThemeAssets(),          // Dt()
            import(onboardingChunk)
        ]);
        await renderFullscreenComponent(inkInstance, (done) =>
            React.createElement(Onboarding, {
                onDone: () => { markOnboardingComplete(); done(); }
            }),
            { onChangeAppState: onChangeAppStateHandler }
        );
    }

    // --- Dialog 2: Trust Dialog (project directory trust) ---
    if (permissionMode !== "bypassPermissions" && !isTrustDialogSuppressed()) {
        let { TrustDialog } = await import(trustDialogChunk);
        await renderFullscreenComponent(inkInstance, (done) =>
            React.createElement(TrustDialog, { commands, onDone: done })
        );

        // After trust: run initial setup, load project settings, sync local settings
        markProjectTrusted();   // QT6()
        loadProjectSettings();  // Of1()
        syncLocalSettings();    // l$()

        // --- Dialog 2b: Validation errors dialog ---
        let { errors } = getConfigErrors();
        if (errors.length === 0) await showDiagnosticsIfNeeded(inkInstance);

        // --- Dialog 2c: gitignore configuration dialog ---
        if (await needsGitignoreConfig()) {
            let externalIncludes = getExternalIncludes();
            await renderFullscreenComponent(inkInstance, (done) =>
                React.createElement(GitignoreDialog, {
                    onDone: done,
                    isStandaloneDialog: true,
                    externalIncludes
                })
            );
        }
    }

    // --- Dialog 3: Policy/Terms Update ---
    initPolicyState();       // H0q()
    reloadEnvSettings();     // q11()
    applyFeatureFlags();     // dFA()
    if (await policyNeedsAcknowledgment()) {
        let result = await renderFullscreenComponent(inkInstance, (done) =>
            React.createElement(PolicyUpdateDialog, {
                showIfAlreadyViewed: false,
                location: didShowOnboarding ? "onboarding" : "policy_update_modal",
                onDone: done
            })
        );
        if (result === "escape") {
            // User pressed Escape to reject policy → exit
            recordTelemetry("tengu_grove_policy_exited", {});
            exitProcess(0);
            return false;
        }
    }

    // --- Dialog 4: Custom API Key info dialog ---
    if (process.env.ANTHROPIC_API_KEY) {
        let truncated = truncateApiKey(process.env.ANTHROPIC_API_KEY);
        if (detectApiKeyType(truncated) === "new") {
            await renderFullscreenComponent(inkInstance, (done) =>
                React.createElement(CustomApiKeyDialog, {
                    customApiKeyTruncated: truncated,
                    onDone: done
                }),
                { onChangeAppState: onChangeAppStateHandler }
            );
        }
    }

    // --- Dialog 5: Bypass Permissions Mode acceptance ---
    if ((permissionMode === "bypassPermissions" || hasDangerousPermissions)
        && !settings.bypassPermissionsModeAccepted) {
        await renderFullscreenComponent(inkInstance, (done) =>
            React.createElement(BypassPermissionsDialog, { onAccept: done })
        );
    }

    // --- Dialog 6: Claude-in-Chrome onboarding ---
    if (hasChrome && !settings.hasCompletedClaudeInChromeOnboarding) {
        await renderFullscreenComponent(inkInstance, (done) =>
            React.createElement(ChromeOnboarding, { onDone: done })
        );
    }

    return didShowOnboarding;
}

// Mapping: gRq→showSetupScreens, A→inkInstance, q→permissionMode,
//          K→hasDangerousPermissions, Y→commands, z→hasChrome,
//          J6→isSetupDisabled, f6→getUserSettings, H→didShowOnboarding,
//          LF→renderFullscreenComponent, K11→onChangeAppStateHandler,
//          QRq→markOnboardingComplete, QT6→markProjectTrusted, Of1→loadProjectSettings,
//          l$→syncLocalSettings, Jc→getConfigErrors, Wp7→needsGitignoreConfig,
//          su1→getExternalIncludes, H0q→initPolicyState, q11→reloadEnvSettings,
//          dFA→applyFeatureFlags, NM1→policyNeedsAcknowledgment,
//          w3→exitProcess, c→recordTelemetry
```

### The Seven Dialog Types (in sequential order)

**Dialog 1: Onboarding** (`Onboarding` component)
- Trigger: `!settings.theme || !settings.hasCompletedOnboarding`
- Purpose: Theme selection (dark/light), feature tour, initial preferences
- Side effect: Sets `hasCompletedOnboarding: true` and chosen `theme` in settings
- Location check: Only shown once per user account (settings are global)

**Dialog 2: Trust Dialog** (`TrustDialog` component)
- Trigger: `permissionMode !== "bypassPermissions" && !isTrustDialogSuppressed()`
- Purpose: Asks the user whether to trust the current project directory. Explains what trust means (allowing Claude to run commands in this directory).
- Side effects: Calls `markProjectTrusted()`, `loadProjectSettings()`, `syncLocalSettings()` after acceptance. These are important: project-level settings (`.claude/settings.json`) are only loaded after trust is granted.
- `CLAUBBIT` env var: Internal flag to suppress trust dialog (used in CI environments)

**Dialog 2b: Diagnostics** (inline, no separate component)
- Trigger: After trust dialog, if config validation passes (`errors.length === 0`)
- Purpose: Show any first-run diagnostic issues

**Dialog 2c: Gitignore Configuration** (`GitignoreDialog` / `OV6`)
- Trigger: After trust dialog, if `needsGitignoreConfig()` returns true
- Purpose: Asks user if they want to add `.claude/` to `.gitignore`

**Dialog 3: Policy/Terms Update** (`PolicyUpdateDialog` / `RN6`)
- Trigger: `policyNeedsAcknowledgment()` - shown when Anthropic updates Terms of Service
- Exit behavior: If user presses Escape (result `=== "escape"`), records telemetry and calls `exitProcess(0)`. This is the only dialog that can abort the entire startup sequence.
- Location prop: `"onboarding"` if shown alongside onboarding, `"policy_update_modal"` otherwise. Affects analytics attribution.

**Dialog 4: Custom API Key Info** (`CustomApiKeyDialog` / `sT6`)
- Trigger: `process.env.ANTHROPIC_API_KEY` is set AND detected as a "new" key type
- Purpose: Informs users using a custom API key about billing implications and rate limits
- Only shown once per new key (key type detection uses truncated key as identifier)

**Dialog 5: Bypass Permissions Mode Acceptance** (`BypassPermissionsDialog` / `hDq`)
- Trigger: `permissionMode === "bypassPermissions"` OR dangerous permissions flag AND `!settings.bypassPermissionsModeAccepted`
- Purpose: Requires explicit acceptance of risks before running in `--dangerously-skip-permissions` mode
- Only shown once (acceptance stored in settings)

**Dialog 6: Claude-in-Chrome Onboarding** (`ChromeOnboarding` / `xDq`)
- Trigger: `hasChrome && !settings.hasCompletedClaudeInChromeOnboarding`
- Purpose: Chrome browser extension setup walkthrough
- Only shown once (completion stored in settings)

**Critical design choice:** The dialogs are sequential and each `await renderFullscreenComponent(...)` blocks until the dialog is dismissed. This ensures the user has completed each step before the next appears. The alternative (parallel rendering) would be confusing and could create race conditions in settings writes.

---

## 8. State Store Architecture

### `createStateStore` (Gf6) - Observable Store Factory

```javascript
// ============================================
// createStateStore - Minimal observable state store (zustand-like)
// Location: chunks.151.mjs:398-420
// ============================================

// ORIGINAL (for source lookup):
function Gf6(A, q) {
    let K = A, Y = new Set;
    return {
        getState: () => K,
        setState: (z) => {
            let w = K, H = z(w);
            if (Object.is(H, w)) return;
            K = H, q?.({ newState: H, oldState: w });
            for (let $ of Y) $()
        },
        subscribe: (z) => { return Y.add(z), () => Y.delete(z) }
    }
}

// READABLE (for understanding):
function createStateStore(initialState, onChangeCallback) {
    let currentState = initialState;
    let subscribers = new Set();

    return {
        // Read current state (synchronous, no proxy, no cloning)
        getState: () => currentState,

        // Write state via updater function (like React's setState(fn))
        setState: (updater) => {
            let prevState = currentState;
            let nextState = updater(prevState);

            // Bail out if state is reference-equal (no change)
            if (Object.is(nextState, prevState)) return;

            // Commit new state
            currentState = nextState;

            // Notify external observer (onChangeAppStateHandler)
            onChangeCallback?.({ newState: nextState, oldState: prevState });

            // Notify all React subscribers (triggers re-render)
            for (let notify of subscribers) notify();
        },

        // Subscribe for re-render notifications (returns unsubscribe fn)
        subscribe: (notify) => {
            subscribers.add(notify);
            return () => subscribers.delete(notify);
        }
    };
}

// Mapping: WX1→createStateStore, A→initialState, q→onChangeCallback,
//          K→currentState, Y→subscribers, z→updater, w→prevState,
//          H→nextState, $→notify
```

**Architecture analysis:**

The store is a hand-rolled implementation of the [zustand](https://github.com/pmndrs/zustand) pattern. It has three operations:

1. `getState()` - O(1) state access. No proxy, no Immutable.js, no structural sharing. Just a direct reference. React components that use `useSyncExternalStore` pass `getState` as the snapshot function.

2. `setState(updater)` - The updater pattern (`fn(prevState) => nextState`) is essential for concurrent React. Unlike `setState(newValue)`, the functional form prevents stale closure bugs when multiple state updates queue up.

3. `subscribe(notify)` - Returns an unsubscribe function (the closure `() => subscribers.delete(notify)`). This is the React `useSyncExternalStore` subscription API.

**The `Object.is(nextState, prevState)` bail-out:** This is the same reference equality check React uses internally. If a component calls `setState(s => s)` (returns the same object), nothing happens. This prevents spurious re-renders when code defensively "resets" state to its current value.

**The dual notification system:** After updating state, the store notifies two things:
1. `onChangeCallback` (the `K11` / `onChangeAppStateHandler` function) - synchronizes state changes to persistent settings
2. All `subscribers` - triggers React re-renders via `useSyncExternalStore`

### `AppStateProvider` (Yj) - React Context Binding

```javascript
// ============================================
// AppStateProvider - React context provider for global state store
// Location: chunks.148.mjs:2544-2583
// ============================================

// ORIGINAL (for source lookup):
function Yj(A) {
    let q = A6(13), { children: K, initialState: Y, onChangeAppState: z } = A;
    if (wD.useContext(rKq)) throw Error("AppStateProvider can not be nested within another AppStateProvider");
    let w;
    if (q[0] !== Y || q[1] !== z) w = () => WX1(Y ?? z16(), z), q[0] = Y, q[1] = z, q[2] = w;
    else w = q[2];
    let [O] = wD.useState(w), $;
    if (q[3] !== O) $ = () => {
        let { toolPermissionContext: X } = O.getState();
        if (X.isBypassPermissionsModeAvailable && bd()) k("Disabling bypass permissions mode on mount (remote settings loaded before mount)"), O.setState(_BY)
    }, q[3] = O, q[4] = $;
    else $ = q[4];
    let _;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) _ = [], q[5] = _;
    else _ = q[5];
    eD.useEffect(O, _);
    /* ... context providers ... */
}

// READABLE (for understanding):
function AppStateProvider({ children, initialState, onChangeAppState }) {
    // Singleton guard: prevent nested providers which would create independent stores
    if (React.useContext(AppStateProviderContext)) {
        throw new Error("AppStateProvider can not be nested within another AppStateProvider");
    }

    // Memoized store factory: only recreates store if initialState or callback changes
    let createStore = React.useMemo(
        () => () => createStateStore(initialState ?? getDefaultInitialState(), onChangeAppState),
        [initialState, onChangeAppState]
    );

    // useState with factory: store is created exactly once per component mount
    let [store] = React.useState(createStore);

    // On mount: check if bypass-permissions mode should be disabled
    // (Remote settings may have loaded before the component mounted)
    React.useEffect(() => {
        let { toolPermissionContext } = store.getState();
        if (toolPermissionContext.isBypassPermissionsModeAvailable && isRemoteSettingsLoaded()) {
            log("Disabling bypass permissions mode on mount (remote settings loaded before mount)");
            store.setState(disableBypassPermissionsMode);
        }
    }, []);  // Empty deps: run once on mount

    // Provide store via context
    return React.createElement(
        AppStateProviderContext.Provider, { value: true },
        React.createElement(StoreContext.Provider, { value: store },
            React.createElement(SyncStateToGlobal, null, children)
        )
    );
}

// Mapping: Yj→AppStateProvider, WX1→createStateStore, z16→getDefaultInitialState,
//          rKq→AppStateProviderContext, O→store, bd→isRemoteSettingsLoaded,
//          _BY→disableBypassPermissionsMode, k→log
```

**The `useState(factory)` pattern for stable store creation:**

`React.useState(() => createStore())` only calls the factory function on the first render. On subsequent re-renders (caused by the store's `subscribe` notifications), `useState` returns the same `store` reference. This ensures there is exactly one store instance per `AppStateProvider` mount.

If `React.useState(createStore())` (without the function wrapper) were used instead, a new store would be created on every render, which would discard all state on every re-render.

### `onChangeAppStateHandler` (K11) - State-to-Settings Synchronizer

```javascript
// ============================================
// onChangeAppStateHandler - Sync state changes to persistent settings
// Location: chunks.176.mjs:581-640
// ============================================

// ORIGINAL (for source lookup):
function K11({ newState: A, oldState: q }) {
    if (A.mainLoopModel !== q.mainLoopModel && A.mainLoopModel === null)
        Z7("userSettings", { model: void 0 }), CG(null);
    if (A.mainLoopModel !== q.mainLoopModel && A.mainLoopModel !== null)
        Z7("userSettings", { model: A.mainLoopModel }), CG(A.mainLoopModel);
    /* ... more comparisons ... */
}

// READABLE (for understanding):
function onChangeAppStateHandler({ newState, oldState }) {
    // Model changed to null → clear model from persistent settings
    if (newState.mainLoopModel !== oldState.mainLoopModel && newState.mainLoopModel === null) {
        updateSettings("userSettings", { model: undefined });
        setGlobalModel(null);
    }

    // Model changed to a value → persist new model to settings
    if (newState.mainLoopModel !== oldState.mainLoopModel && newState.mainLoopModel !== null) {
        updateSettings("userSettings", { model: newState.mainLoopModel });
        setGlobalModel(newState.mainLoopModel);
    }

    // Expanded view changed → sync showExpandedTodos and showSpinnerTree flags
    if (newState.expandedView !== oldState.expandedView) {
        let showTasks = newState.expandedView === "tasks";
        let showTeammates = newState.expandedView === "teammates";
        if (getUserSettings().showExpandedTodos !== showTasks
            || getUserSettings().showSpinnerTree !== showTeammates) {
            updateUserSettings((s) => ({ ...s, showExpandedTodos: showTasks, showSpinnerTree: showTeammates }));
        }
    }

    // Todos changed → persist each todo item
    if (oldState !== null && newState.todos !== oldState.todos) {
        for (let sessionId in newState.todos) {
            persistTodo(newState.todos[sessionId], sessionId);
        }
    }

    // Verbose mode changed → persist to settings
    if (newState.verbose !== oldState.verbose && getUserSettings().verbose !== newState.verbose) {
        let verbose = newState.verbose;
        updateUserSettings((s) => ({ ...s, verbose }));
    }

    // Feedback survey state changed → persist last shown time
    if (newState.feedbackSurvey.timeLastShown !== oldState.feedbackSurvey.timeLastShown
        && newState.feedbackSurvey.timeLastShown !== null) {
        let time = newState.feedbackSurvey.timeLastShown;
        updateUserSettings((s) => ({ ...s, feedbackSurveyState: { lastShownTime: time } }));
    }

    // MCP state changed → refresh MCP client connections
    if (isMultiClientEnabled() && newState.mcp !== oldState.mcp) {
        updateMcpClients(newState.mcp.clients, newState.mcp.tools, newState.mcp.resources);
        if (isBaseMode()) refreshBaseConnections();
    }

    // Queued commands changed → update command queue indicator
    if (newState.queuedCommands !== oldState.queuedCommands) {
        setQueuedCommandCount(newState.queuedCommands.length);
    }

    // Settings object changed → re-apply settings
    if (newState.settings !== oldState.settings) {
        try {
            reloadSettings();      // i86()
            reapplySettings();     // n86()
            if (newState.settings.env !== oldState.settings.env) reloadEnvSettings();
        } catch (err) {
            reportError(err instanceof Error ? err : Error(`Failed to apply settings changes: ${err}`));
        }
    }
}

// Mapping: K11→onChangeAppStateHandler, A→newState, q→oldState,
//          Z7→updateSettings, CG→setGlobalModel, jA→updateUserSettings,
//          $K1→persistTodo, O$→isMultiClientEnabled, CJq→updateMcpClients,
//          bc→isBaseMode, _f1→refreshBaseConnections, XR6→setQueuedCommandCount,
//          i86→reloadSettings, n86→reapplySettings, q11→reloadEnvSettings, K1→reportError
```

**Design pattern analysis:**

`K11` is a **projection function**: given the old and new state snapshots, it computes which persistent side effects need to happen. This is called synchronously inside `setState`, creating a tight coupling between in-memory state and disk state.

Each comparison follows the pattern: `if (newState.X !== oldState.X && condition)`. The reference inequality check (`!==`) on state slices works correctly because `setState` uses immutable update patterns (spread operators), so any change to `todos` produces a new object reference, while an unchanged `todos` keeps the same reference.

**Why not use `useEffect` for persistence?**

`useEffect` runs after the render cycle, creating a window where state and disk are out of sync. If the process is killed between a state update and the next render, settings would be lost. By running persistence synchronously in `setState`, settings are written before the React render even begins.

---

## 9. CLI to UI Linkage

How specific command-line flags result in specific React component trees:

### Flag → Permission Mode → Dialog Suppression

```
--dangerously-skip-permissions
  └─ permissionMode = "bypassPermissions"
       ├─ Trust Dialog: SKIPPED (bypassPermissions mode)
       └─ BypassPermissionsDialog: SHOWN (if not already accepted)

--permission-mode=default (no flag)
  └─ permissionMode = "default"
       ├─ Trust Dialog: SHOWN
       └─ BypassPermissionsDialog: SKIPPED

-p / --print (non-interactive)
  └─ isNonInteractive = true
       ├─ yr() called: Ink output suppressed
       ├─ bL6(false): render mode = headless
       └─ All dialogs: SKIPPED (showSetupScreens not called in non-interactive path)
```

### Flag → Session Routing → REPL Props

```
--continue
  └─ Loads latest session messages from disk
       └─ TUA(REPL) rendered with initialMessages = [restored messages]

--resume [id]
  ├─ With session ID: Load specific session → TUA with initialMessages
  └─ Without session ID: Render ResumeConversation picker component

--from-pr [pr]
  └─ Load session linked to PR → TUA with initialMessages or ResumeConversation

--teleport [session]
  ├─ Session found: TUA with initialMessages
  └─ No session: TeleportPicker component

--remote [description]
  └─ TUA with remoteSessionConfig = { ... }

(default, no flag)
  └─ TUA with initialMessages = [] or hook-generated messages
```

### Flag → REPL Props Object

The `l9` (REPL props) object is assembled from flags before `TUA` is rendered:

```javascript
// REPL Props Construction (simplified from action handler)
const replProps = {
    debug: hasDebugFlag || hasVerboseFlag,          // --debug, --verbose
    commands: [...builtinCommands, ...slashCommands], // slash command registry
    initialTools: loadedTools,                        // --tools filter
    mcpClients: connectedMcpClients,                 // --mcp-config
    autoConnectIdeFlag: ideFlag,                     // --ide
    mainThreadAgentDefinition: agentDef,             // --agent
    disableSlashCommands: disableFlag,               // --disable-slash-commands
    dynamicMcpConfig: mcpConfig,                     // runtime MCP config
    mcpCliEndpoint: cliEndpoint,                     // --mcp-cli-endpoint
    strictMcpConfig: strictFlag,                     // --strict-mcp
    systemPrompt: systemPromptText,                  // --system-prompt / --system-prompt-file
    appendSystemPrompt: appendPromptText,            // --append-system-prompt
    taskListId: taskListId                           // --task-list-id
};
```

### Flag → Client Type → Telemetry Tag

```
GITHUB_ACTIONS=true              → clientType = "github-action"
CLAUDE_CODE_ENTRYPOINT=sdk-ts    → clientType = "sdk-typescript"
CLAUDE_CODE_ENTRYPOINT=sdk-py    → clientType = "sdk-python"
-p or !isTTY                     → clientType = "sdk-cli"
CLAUDE_CODE_ENTRYPOINT=claude-vscode → clientType = "claude-vscode"
CLAUDE_CODE_ENTRYPOINT=local-agent   → clientType = "local-agent"
CLAUDE_CODE_SESSION_ACCESS_TOKEN set → clientType = "remote"
(default)                        → clientType = "cli"
```

---

## 10. `initialState` Construction

The REPL's `initialState` (the `Gz` object) contains approximately 35+ fields built in the Commander action handler. These are passed to `AppStateProvider` as the `initialState` prop, which passes them to `createStateStore`.

### Complete Field List

**Session configuration:**
- `settings` - Merged settings from `l4()`: user + project + local settings combined
- `mainLoopModel` - `E7`: the resolved model identifier (from `--model`, settings, or default)
- `mainLoopModelForSession` - `null` initially; set to the negotiated model after first LLM call
- `fastMode` - `_7A(V4)`: boolean, from `--fast` flag or session storage

**Agent and tool configuration:**
- `agent` - `bA?.agentType`: agent type string if `--agent` specified
- `agentDefinitions` - `L6`: array of available agent definitions
- `initialTools` - tool definitions filtered by `--tools` flag
- `mainThreadAgentDefinition` - the main agent's full definition object

**UI and view state:**
- `verbose` - boolean from `--verbose` flag or settings
- `expandedView` - `"teammates" | "tasks" | "none"`: which expanded panel to show
- `showTeammateMessagePreview` - `false` in teams mode, `true` otherwise
- `selectedIPAgentIndex` - `-1`: which in-process agent is focused (teams mode)
- `viewSelectionMode` - `"none"`: whether view is being interactively selected

**MCP and plugin state:**
- `mcp` - `{ clients: [], tools: [], commands: [], resources: {} }`: MCP connection state
- `plugins` - `{ enabled, disabled, commands, agents, errors, installationStatus, needsRefresh }`: plugin registry

**Permissions:**
- `toolPermissionContext` - `C3`: resolved permission context (includes bypassPermissions flag, trusted dirs, etc.)

**Message and conversation state:**
- `initialMessage` - piped stdin text (if any) from `handleStdinInput`
- `tasks` - `{}`: empty task map, populated during session
- `todos` - `{ [sessionId]: loadedTodos }`: loaded from disk for current session
- `fileHistory` - `{ snapshots: [], trackedFiles: new Set() }`: file operation tracking

**Collaboration and remote:**
- `teamContext` - `PDq?.()`: team configuration if in agent teams mode
- `remoteSessionUrl` - `undefined` initially; set for remote sessions
- `attribution` - `Zw6()`: session attribution metadata for analytics

**Notifications and UI queues:**
- `notifications` - `{ current: null, queue: W$ }`: notification display queue
- `elicitation` - `{ queue: [] }`: queue for LLM elicitation requests (permission prompts)
- `queuedCommands` - `[]`: slash commands queued during processing
- `workerSandboxPermissions` - `{ queue: [], selectedIndex: 0 }`: sandbox approval queue
- `pendingWorkerRequest` - `null`: active worker request awaiting approval
- `pendingSandboxRequest` - `null`: active sandbox request awaiting approval

**Feature states:**
- `thinkingEnabled` - `fw6()`: whether extended thinking is active
- `promptSuggestionEnabled` - `Wf6()`: whether prompt suggestions are shown
- `speculation` - `Y91`: speculation/prefill configuration
- `speculationSessionTimeSavedMs` - `0`: accumulated time saved by speculation
- `promptCoaching` - `{ tip: null, shownAt: 0 }`: coaching tip display state
- `promptSuggestion` - `{ text, promptId, shownAt, acceptedAt, generationRequestId }`: active suggestion
- `effortValue` - `uK1(H.effort) ?? qPA()`: reasoning effort level (from `--effort` or default)

**Session hooks and inbox:**
- `sessionHooks` - `{}`: registered session-scoped hook handlers
- `inbox` - `{ messages: [] }`: inter-agent message inbox (teams mode)

**Git and PR integration:**
- `gitDiff` - `{ stats, perFileStats, hunks, lastUpdated }`: current diff stats
- `prStatus` - `{ number, url, reviewState, lastUpdated }`: PR status if on a PR branch

**Auth:**
- `authVersion` - `0`: incremented when auth credentials change, triggers re-validation

**Status:**
- `statusLineText` - `undefined`: optional status bar override text

---

## 11. Session Routing Matrix

The Commander action handler routes to one of five render paths based on CLI flags:

### Path 1: `--continue` (Latest Session Restore)

```
Trigger: args.includes("--continue") || args.includes("-c")
Action:
  1. Load latest session ID for current directory from session store
  2. Load messages array from session file
  3. Load fileHistory snapshots from session file
  4. Build initialState with loaded messages
  5. Render TUA (REPL) with:
     - initialMessages = [restored message array]
     - initialFileHistorySnapshots = [restored snapshots]
     - No picker UI shown
```

### Path 2: `--resume [id]` (Session Picker or Direct Resume)

```
Trigger: args.includes("--resume") || args.includes("-r")
Sub-case A: Session ID provided
  1. Load specific session by ID
  2. If found: render TUA with initialMessages
  3. If not found: render TUA with empty messages (silently ignored)

Sub-case B: No session ID provided
  1. Render ResumeConversation picker component
  2. User selects a session from the list
  3. Load selected session → render TUA
```

### Path 3: `--from-pr [pr]` (PR-Linked Session)

```
Trigger: args.includes("--from-pr")
Action:
  1. Query session store for sessions linked to the specified PR
  2. If exactly one session: restore and render TUA
  3. If multiple sessions: render ResumeConversation picker filtered by PR
  4. If no sessions: render TUA with empty messages
```

### Path 4: `--teleport [session]` / `--remote` (Remote Sessions)

```
Trigger: args.includes("--teleport") || args.includes("--remote")

--teleport with session ID:
  1. Fetch remote session config from teleport service
  2. If session found: render TUA with remoteSessionConfig
  3. If not found: render TeleportPicker component

--teleport without session ID:
  1. Render TeleportPicker component directly

--remote [description]:
  1. Create new remote session with description
  2. Get remote session URL and config
  3. Render TUA with remoteSessionConfig = { url, authToken, ... }
```

### Path 5: Default (New Interactive Session)

```
Trigger: No session flags
Action:
  1. Run showSetupScreens (gRq) - show onboarding/trust/policy dialogs
  2. Check for hook-generated initial messages (SessionStart hook)
  3. If --init or --init-only: run Setup hooks, then either continue or exit
  4. Render TUA with:
     - initialMessages = [] or hook-generated messages
     - initialState.initialMessage = piped stdin (if any)
     - All REPL props from CLI flags
```

---

## 12. Startup Timing Phases

All telemetry markers (`EK()` / `recordTelemetry()`) fired during startup, in chronological order:

### Phase A: `cliEntry` (JVz) - Subcommand Routing

| Marker | Meaning |
|--------|---------|
| `cli_entry` | `JVz` started; basic args parsed |
| `cli_ripgrep_path` | Routing to ripgrep handler |
| `cli_claude_in_chrome_mcp_path` | Routing to Chrome MCP server |
| `cli_chrome_native_host_path` | Routing to Chrome native host |
| `cli_before_main_import` | About to lazy-load the main chunk |
| `cli_after_main_import` | Main chunk loaded, `main()` about to run |
| `cli_after_main_complete` | `main()` returned |

### Phase B: `main` (OVz) - Environment Setup

| Marker | Meaning |
|--------|---------|
| `main_function_start` | `OVz` entered |
| `main_warning_handler_initialized` | `unhandledRejection` handlers set up |
| `main_client_type_determined` | `clientType` computed, passed to analytics |
| `main_before_run` | Global state initialized, about to call Commander |
| `main_after_run` | Commander setup (`aGz`) returned |

### Phase C: `commanderSetup` (aGz) - Argument Parsing

| Marker | Meaning |
|--------|---------|
| `run_function_start` | `aGz` entered |
| `run_commander_initialized` | Commander instance created, subcommands registered |
| `preAction_start` | Commander `preAction` hook fired (before action handler) |
| `preAction_after_init` | Initial configuration loaded |
| `preAction_after_migrations` | Settings migrations applied |
| `preAction_after_remote_settings` | Remote settings fetched and merged |

### Phase D: Action Handler - REPL Initialization

| Marker | Meaning |
|--------|---------|
| `action_handler_start` | Action handler entered; args fully parsed |
| `action_after_input_prompt` | stdin read; initial prompt determined |
| `action_tools_loaded` | Tool definitions loaded and filtered |
| `action_before_setup` | About to call `showSetupScreens` |
| `action_after_setup` | All setup dialogs completed |
| `action_commands_loaded` | Slash commands registered |
| `action_mcp_configs_loaded` | MCP server configurations loaded |
| `action_after_hooks` | SessionStart hooks fired |

### Timing Implications

The time between markers reveals startup bottlenecks:

- `cli_before_main_import` → `cli_after_main_import`: Dynamic import time (~100-400ms on cold start, ~10ms with V8 bytecode cache)
- `preAction_after_migrations` → `preAction_after_remote_settings`: Network RTT for remote settings fetch (~50-200ms, skipped if cached)
- `action_tools_loaded` → `action_before_setup`: Tool initialization time
- `action_before_setup` → `action_after_setup`: Dialog display time (can be seconds if user is reading)

The markers allow the profiling system (loaded as the very first dynamic import in `qZz`) to attribute startup latency to specific phases. This data is reported in telemetry and used to prioritize optimization efforts.

---

## 13. `cleanupOnExit` (tGz) and `noopCliOptionsPostProcess` (LUA)

### `cleanupOnExit` (tGz)

```javascript
// ============================================
// cleanupOnExit - Restore terminal cursor on process exit
// Location: chunks.197.mjs:2144-2147
// ============================================

// ORIGINAL (for source lookup):
function tGz() {
    (process.stderr.isTTY ? process.stderr : process.stdout.isTTY ? process.stdout : void 0)?.write(PS)
}

// READABLE (for understanding):
function cleanupOnExit() {
    // Find the first TTY output stream available
    let ttyStream = process.stderr.isTTY
        ? process.stderr
        : process.stdout.isTTY
            ? process.stdout
            : undefined;

    // Write the "show cursor" ANSI escape sequence
    ttyStream?.write(SHOW_CURSOR_SEQUENCE);  // PS constant
}

// Mapping: tGz→cleanupOnExit, PS→SHOW_CURSOR_SEQUENCE
```

**Why stderr first?** Ink renders to stdout by default. If stdout is piped (`claude | grep`), `stdout.isTTY` is false, but `stderr.isTTY` may still be true (stderr is typically not piped). Using stderr as the fallback ensures the cursor is restored even when stdout is redirected.

**`PS` constant:** This is likely the ANSI escape `\x1b[?25h` (SGR sequence to show the cursor). Ink hides the cursor during rendering to prevent flickering. If the process crashes or is killed mid-render, the cursor remains hidden. This cleanup ensures the cursor is always restored.

### `noopCliOptionsPostProcess` (LUA)

```javascript
// ============================================
// noopCliOptionsPostProcess - Placeholder hook (intentional no-op)
// Location: chunks.197.mjs:2142
// ============================================

// ORIGINAL (for source lookup):
function LUA(A) {}

// READABLE (for understanding):
function noopCliOptionsPostProcess(options) {
    // Intentionally empty. Used as a default/placeholder where
    // a CLI options post-processing hook is expected but not implemented.
}

// Mapping: LUA→noopCliOptionsPostProcess, A→options
```

This function is a named no-op that exists as a default hook in the CLI options pipeline. The pattern of having a named no-op rather than `null` or `undefined` allows the calling code to call the hook unconditionally without null checks, while supporting future implementation without changing call sites.

---

## 14. `AppStateRoot` (Pf1) - Root Component with Memo Cache

```javascript
// ============================================
// AppStateRoot - React root component with manual memo cache
// Location: chunks.176.mjs:643-660
// ============================================

// ORIGINAL (for source lookup):
function Pf1(A) {
    let q = e(6), { getFpsMetrics: K, initialState: Y, children: z } = A, w;
    if (q[0] !== z || q[1] !== Y) w = wQA.default.createElement(u_, { initialState: Y, onChangeAppState: K11 }, z), q[0] = z, q[1] = Y, q[2] = w;
    else w = q[2];
    let H;
    if (q[3] !== K || q[4] !== w) H = wQA.default.createElement(BDq, { getFpsMetrics: K }, w), q[3] = K, q[4] = w, q[5] = H;
    else H = q[5];
    return H
}

// READABLE (for understanding):
function AppStateRoot({ getFpsMetrics, initialState, children }) {
    // React compiler memo cache: 6 slots
    // [0]=prev children, [1]=prev initialState, [2]=prev AppStateProvider element
    // [3]=prev getFpsMetrics, [4]=prev inner element, [5]=prev FpsWrapper element
    let cache = useCompilerCache(6);

    // Inner: AppStateProvider wrapping children
    let stateProviderElement;
    if (cache[0] !== children || cache[1] !== initialState) {
        stateProviderElement = React.createElement(AppStateProvider, {
            initialState,
            onChangeAppState: onChangeAppStateHandler  // K11: hardcoded here
        }, children);
        cache[0] = children;
        cache[1] = initialState;
        cache[2] = stateProviderElement;
    } else {
        stateProviderElement = cache[2];
    }

    // Outer: FPS metrics wrapper
    let fpsWrapperElement;
    if (cache[3] !== getFpsMetrics || cache[4] !== stateProviderElement) {
        fpsWrapperElement = React.createElement(FpsMetricsWrapper, {
            getFpsMetrics
        }, stateProviderElement);
        cache[3] = getFpsMetrics;
        cache[4] = stateProviderElement;
        cache[5] = fpsWrapperElement;
    } else {
        fpsWrapperElement = cache[5];
    }

    return fpsWrapperElement;
}

// Mapping: Pf1→AppStateRoot, q→cache, e→useCompilerCache, K→getFpsMetrics,
//          Y→initialState, z→children, w→stateProviderElement,
//          Yj→AppStateProvider, K11→onChangeAppStateHandler,
//          H→fpsWrapperElement, BDq→FpsMetricsWrapper
```

**Manual memo cache pattern:** The `e(6)` call allocates a 6-slot array from React's internal compiler cache. The subsequent `if (cache[N] !== value)` checks are the React compiler's output for `useMemo`. This is equivalent to:

```javascript
let stateProviderElement = useMemo(
    () => React.createElement(AppStateProvider, { initialState, onChangeAppState: K11 }, children),
    [children, initialState]
);
```

The compiler inlines this to avoid the closure allocation overhead of `useMemo`. This matters because `AppStateRoot` is the root of the REPL's React tree and re-renders on every state change; the memoization ensures the `AppStateProvider` element is only recreated when its inputs actually change.

**`onChangeAppStateHandler` is hardcoded:** Unlike the `initialState` which is passed as a prop, the `onChangeAppState` callback is hardcoded to `K11` in `AppStateRoot`. This is a deliberate coupling: the callback is a module-level singleton and there is no scenario where a different callback would be used for the main REPL render.

---

## Mode Detection Algorithm Deep-Dive

### Interactive vs Headless Mode Detection

The CLI determines execution mode through a series of checks. This section documents the complete decision tree.

```javascript
// ============================================
// Mode Detection - Complete Decision Tree
// Location: chunks.198.mjs (action handler) + chunks.1.mjs (helpers)
// ============================================

// Step 1: Determine if stdin is a TTY
// In chunks.1.mjs:
function isInteractive() {
    return process.stdin.isTTY && process.stdout.isTTY;
}

function isNonInteractive() {
    return !isInteractive();
}

// Step 2: SDK mode auto-detection (in action handler)
let sdkUrl = options.sdkUrl ?? undefined;

if (sdkUrl) {
    // SDK mode overrides other settings
    if (!inputFormat) inputFormat = "stream-json";
    if (!outputFormat) outputFormat = "stream-json";
    if (options.verbose === undefined) verbose = true;
    if (!options.print) print = true;  // SDK implies print mode
}

// Step 3: Print mode detection
let isNonInteractiveMode = isNonInteractive() || print || outputFormat !== undefined;

// Step 4: Final mode determination
if (isNonInteractiveMode) {
    // Headless execution - no REPL
    await runHeadless(options);
} else {
    // Interactive REPL
    let { createRoot } = await import("ink");
    let root = await createRoot(renderOptions);
    await showSetupScreens(root, permissionMode);
    // ... render REPL ...
}
```

### Mode Detection Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MODE DETECTION DECISION TREE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Process Start                                                               │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Check TTY Status                                                       │  │
│  │                                                                        │  │
│  │ process.stdin.isTTY && process.stdout.isTTY                            │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│         │                                                                    │
│         ├─────────────────── false ───────────────────┐                     │
│         │                                              │                     │
│         ▼                                              ▼                     │
│  ┌─────────────────┐                         ┌─────────────────────┐        │
│  │ Interactive TTY │                         │ Non-TTY (pipe/     │        │
│  │                 │                         │ redirect/CI)        │        │
│  └────────┬────────┘                         └──────────┬──────────┘        │
│           │                                             │                     │
│           │                                             │                     │
│           ▼                                             ▼                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Check CLI Flags                                                      │    │
│  │                                                                      │    │
│  │ Priority order:                                                      │    │
│  │ 1. --sdk-url → SDK mode (stream-json I/O, verbose)                  │    │
│  │ 2. --print → Print mode (headless, text output)                     │    │
│  │ 3. --output-format → Print mode (headless, specified format)        │    │
│  │ 4. -p (same as --print)                                              │    │
│  │ 5. stdin is pipe → Print mode with stdin as prompt                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│           │                                                                 │
│           ├──────────────────── Any flag set ────────────────────┐         │
│           │                                                       │         │
│           ▼                                                       ▼         │
│  ┌─────────────────────┐                             ┌─────────────────────┐ │
│  │ Interactive REPL    │                             │ Headless Execution  │ │
│  │                     │                             │                     │ │
│  │ • Ink/React UI      │                             │ • No terminal UI    │ │
│  │ • Real-time stream  │                             │ • Print to stdout   │ │
│  │ • Permission dialog │                             │ • Exit on complete  │ │
│  │ • Session history   │                             │ • No history        │ │
│  └─────────────────────┘                             └─────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### SDK Mode Configuration Matrix

```javascript
// ============================================
// SDK Mode Auto-Configuration
// Location: chunks.198.mjs action handler
// ============================================

const SDK_MODE_CONFIG = {
    trigger: "--sdk-url <url>",

    autoConfig: {
        inputFormat: "stream-json",     // Stream input parsing
        outputFormat: "stream-json",    // Stream output format
        verbose: true,                  // Enable verbose logging
        print: true,                    // Headless mode
        includePartialMessages: true    // Real-time message chunks
    },

    communication: {
        input: "stdin (stream-json)",
        output: "stdout (stream-json)",
        stderr: "debug logs (if --debug)"
    },

    messageTypes: {
        input: ["user_message", "cancel", "interrupt"],
        output: ["assistant_message", "tool_use", "tool_result", "error", "metadata"]
    }
};
```

### Headless vs Interactive Comparison

| Feature | Interactive (REPL) | Headless (Print/SDK) |
|---------|-------------------|---------------------|
| Terminal UI | Ink/React components | None |
| Input method | PromptInput component | stdin/file/argument |
| Output method | Ink render to terminal | stdout (text/json/stream) |
| Permission dialogs | Interactive prompts | Auto-deny or fail |
| Streaming display | Real-time UI updates | Chunked output |
| Session history | Saved to ~/.claude | None (unless --resume) |
| Setup screens | Trust/policy dialogs | Skipped |
| Abort handling | Escape/Ctrl+C | SIGINT handler |

### Permission Mode Initialization

```javascript
// ============================================
// Permission Context Building
// Location: chunks.198.mjs (action handler) → chunks.172.mjs (U84)
// ============================================

async function buildPermissionContext(options) {
    let {
        allowedToolsCli = [],
        disallowedToolsCli = [],
        baseToolsCli = [],
        permissionMode,
        allowDangerouslySkipPermissions,
        addDirs = []
    } = options;

    // Step 1: Start with default permission context
    let context = {
        mode: "default",
        allowRules: [],
        denyRules: [],
        askRules: [],
        workingDirectories: []
    };

    // Step 2: Apply --dangerously-skip-permissions
    if (allowDangerouslySkipPermissions || dangerouslySkipPermissions) {
        context.mode = "accept";
        // Note: --dangerously-skip-permissions skips ALL permission checks
        // Including trust dialog, tool permissions, etc.
    }

    // Step 3: Apply --permission-mode
    if (permissionMode) {
        context.mode = permissionMode;
        // Valid modes: "accept", "plan", "auto", "dontAsk"
    }

    // Step 4: Parse tool rules from --allowed-tools and --disallowed-tools
    for (const pattern of allowedToolsCli) {
        const rule = parseToolPattern(pattern);
        context.allowRules.push(rule);
    }

    for (const pattern of disallowedToolsCli) {
        const rule = parseToolPattern(pattern);
        context.denyRules.push(rule);
    }

    // Step 5: Add working directories
    context.workingDirectories = addDirs.length > 0
        ? addDirs
        : [process.cwd()];

    return { toolPermissionContext: context, warnings: [] };
}

// Tool pattern parsing:
// "Bash" → { tool: "Bash", args: null }
// "Bash(git:*)" → { tool: "Bash", args: { pattern: "git:*" } }
// "Read" → { tool: "Read", args: null }
// "*" → { tool: "*", args: null }  // All tools
```

### Mode Transition During Session

```javascript
// ============================================
// Permission Mode Cycling (Shift+Tab in UI)
// Location: chunks.183.mjs (cycleMode)
// ============================================

function cycleMode(currentMode) {
    const MODE_CYCLE = ["default", "accept", "plan"];

    const currentIndex = MODE_CYCLE.indexOf(currentMode);
    const nextIndex = (currentIndex + 1) % MODE_CYCLE.length;

    return MODE_CYCLE[nextIndex];
}

// Mode effects on tool availability:
const MODE_TOOL_FILTERS = {
    "default": {
        // All tools available
        // Permission prompts for non-whitelisted tools
        description: "Tools require permission"
    },
    "accept": {
        // All tools available
        // Auto-approve safe tools (Read, Grep, Glob, etc.)
        // Still prompt for Bash, Write, Edit
        description: "Tools auto-approved"
    },
    "plan": {
        // Only read-only tools available
        // Blocked: Write, Edit, Bash, TaskCreate, TaskUpdate
        // Allowed: Read, Grep, Glob, TaskGet, TaskList
        description: "Plan mode - no edits"
    }
};
```

---

## Session Initialization Sequence

### Complete Initialization Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SESSION INITIALIZATION SEQUENCE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  run (OVz) action handler                                                    │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 1. preAction Hook                                                      │  │
│  │                                                                        │  │
│  │    initializeMdm()           → MDM policy check                       │  │
│  │    runInitializers()         → Core setup                             │  │
│  │    initializeErrorLogSink()  → Error capture                          │  │
│  │    registerInlinePlugins()   → --plugin-dir handling                  │  │
│  │    runMigrations()           → Settings migrations                    │  │
│  │    syncSettings()            → Project settings sync                  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 2. Flag Processing                                                     │  │
│  │                                                                        │  │
│  │    Extract options from Commander.opts()                              │  │
│  │    Validate flag combinations (--resume + --fork-session)             │  │
│  │    Resolve model aliases (--model sonnet → claude-sonnet-4-6)         │  │
│  │    Parse tool patterns (--allowed-tools)                              │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 3. Permission Context Building                                         │  │
│  │                                                                        │  │
│  │    buildPermissionContext({                                           │  │
│  │        allowedToolsCli,                                                │  │
│  │        disallowedToolsCli,                                             │  │
│  │        permissionMode,                                                 │  │
│  │        allowDangerouslySkipPermissions                                │  │
│  │    })                                                                  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 4. MCP Client Connection (if --mcp-config)                             │  │
│  │                                                                        │  │
│  │    loadMcpConfig(configPath)                                          │  │
│  │    connectToMcpServers(servers)                                       │  │
│  │    discoverMcpTools()                                                  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 5. Session State Creation                                              │  │
│  │                                                                        │  │
│  │    buildInitialState({                                                 │  │
│  │        toolPermissionContext,                                          │  │
│  │        options: { mainLoopModel, tools, mcpClients },                 │  │
│  │        resumeSessionId,                                                │  │
│  │        sessionName                                                     │  │
│  │    })                                                                  │  │
│  │                                                                        │  │
│  │    createStateStore(initialState)                                      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 6. Ink Render Setup                                                    │  │
│  │                                                                        │  │
│  │    createRenderOptions({                                               │  │
│  │        fps: 60,                                                        │  │
│  │        experimental: { suspense: true }                                │  │
│  │    })                                                                  │  │
│  │                                                                        │  │
│  │    root = createRoot(options)                                          │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 7. Setup Screens (interactive mode only)                               │  │
│  │                                                                        │  │
│  │    showSetupScreens(root, permissionMode):                             │  │
│  │    - Trust dialog (if new directory)                                   │  │
│  │    - Policy acceptance (if enterprise)                                 │  │
│  │    - IDE onboarding (if --ide)                                         │  │
│  │    - Cost warning (if budget set)                                      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│         │                                                                    │
│         ▼                                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 8. REPL Render                                                         │  │
│  │                                                                        │  │
│  │    root.render(                                                        │  │
│  │        <AppStateProvider initialState={initialState}>                  │  │
│  │            <sessionOrchestrator {...props} />                          │  │
│  │        </AppStateProvider>                                             │  │
│  │    )                                                                   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

**Last Updated**: 2026-03-25
**Version**: Claude Code 2.1.76
**Status**: Complete - Enhanced with mode detection algorithm deep-dive
