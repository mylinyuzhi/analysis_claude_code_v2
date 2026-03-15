# CLI Modes and Activation

## Overview

Claude Code v2.1.76 supports multiple operational modes activated through CLI flags, environment variables, and runtime conditions. The main entry point (`qZz` in `chunks.198.mjs:167`) performs early flag dispatch for special modes (MCP CLI, ripgrep, Chrome), then delegates to the `main()` function (`nGz` in `chunks.197.mjs:931`), which determines the client type and calls `run()` (`aGz` in `chunks.197.mjs:999`). The `run()` function uses the Commander.js library to define all flags, validate combinations, and dispatch to the appropriate runtime path: interactive REPL, headless print mode, remote session, teleport resume, or session continue/resume.

**Changes in v2.1.76:**
- Effort levels simplified to `low`, `medium`, `high` (the `max` level was removed)
- `/effort auto` command added to reset effort level back to automatic default
- `/color` command added for session prompt-bar color customization

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `cliEntry` (qZz) - Top-level CLI entry point with early dispatch
- `main` (nGz) - Main function: determines client type, initializes settings
- `run` (aGz) - Commander.js setup, argument parsing, mode dispatch
- `determineEntrypoint` (iGz) - Sets CLAUDE_CODE_ENTRYPOINT env var
- `parseTeammateOptions` (eGz) - Validates and extracts teammate CLI options
- `handleStdinInput` (oGz) - Reads piped stdin for non-interactive mode
- `setupPermissionMode` (qJq) - Resolves permission mode from flags/config/org policy
- `buildToolPermissionContext` (KJq) - Constructs tool permission context from all sources
- `loadTools` (tD) - Loads and filters tools based on permission mode
- `fetchRemoteSettings` (M_4) - Async fetch of org policy settings
- `postRemoteSettings` (Dv7) - Post-processing after remote settings arrive
- `runMigrations` (Rp7) - Applies pending database/config migrations
- `syncSettings` (UGz) - Synchronizes local settings caches

---

## Early Dispatch Modes

### Architecture of Entry

The CLI entry follows a two-phase design: fast early dispatch for utility modes that do not need the full application stack, then full initialization for the main REPL or headless modes.

**What it does:** The `cliEntry` function (`qZz`, chunks.198.mjs:167) checks `process.argv` for special flags that can bypass the heavyweight main import entirely.

**How it works:**
1. `--version` / `-v` / `-V`: Prints version string and returns immediately
2. `--mcp-cli`: If the MCP CLI feature is enabled, delegates to `mcpCliMain` and exits
3. `--ripgrep`: Delegates to the bundled ripgrep binary (used internally by tools)
4. `--claude-in-chrome-mcp`: Starts the Chrome MCP server for browser integration
5. `--chrome-native-host`: Starts the Chrome native messaging host
6. `--tmux` / `--tmux=classic`: Sets a flag for tmux-based teammate spawning
7. `--update` / `--upgrade`: Rewrites argv to the `update` subcommand
8. `auth login|status|logout`: Dispatches to auth subcommand handler (v2.1.41+)

**Why this approach:** These modes are lightweight and self-contained. By dispatching them before importing the heavy `main()` module, startup latency for utility commands is minimized.

**Key insight:** The dynamic `Promise.resolve().then(() => (...))` pattern is used throughout to enable code splitting. Each special mode loads its implementation lazily, keeping the initial bundle small.

```javascript
// ============================================
// cliEntry - Top-level CLI entry with early dispatch
// Location: chunks.198.mjs:167-222
// ============================================

// ORIGINAL (for source lookup):
async function qZz() {
    let A = process.argv.slice(2);
    if (A.length === 1 && (A[0] === "--version" || A[0] === "-v" || A[0] === "-V")) {
        console.log(`${...VERSION} (Claude Code)`);
        return
    }
    let { profileCheckpoint: q } = await Promise.resolve().then(() => (Fl(), XiA));
    if (q("cli_entry"), A[0] === "--mcp-cli") { /* ... */ }
    if (A[0] === "--ripgrep") { /* ... */ }
    // ...
    let { main: z } = await Promise.resolve().then(() => (pRq(), URq));
    q("cli_after_main_import"), await z(), q("cli_after_main_complete")
}

// READABLE (for understanding):
async function cliEntry() {
    let args = process.argv.slice(2);
    if (args.length === 1 && (args[0] === "--version" || args[0] === "-v")) {
        console.log(`${VERSION} (Claude Code)`);
        return;
    }
    let { profileCheckpoint } = await lazyImport(profilingModule);
    profileCheckpoint("cli_entry");

    // Early dispatch for special modes (no full app init needed)
    if (args[0] === "--mcp-cli") { /* lazy import mcpCliMain, exit */ }
    if (args[0] === "--ripgrep") { /* lazy import ripgrepMain, exit */ }
    if (args[2] === "--claude-in-chrome-mcp") { /* lazy import, run Chrome MCP */ }
    if (args[2] === "--chrome-native-host") { /* lazy import, run native host */ }

    // Full application path
    let { main } = await lazyImport(mainModule);
    profileCheckpoint("cli_after_main_import");
    await main();
    profileCheckpoint("cli_after_main_complete");
}

// Mapping: qZz->cliEntry, A->args, q->profileCheckpoint, z->main
```

---

## Client Type Determination

### How the Entrypoint Is Classified

**What it does:** The `main()` function (`nGz`, chunks.197.mjs:931) determines the "client type" — a classification of how Claude Code was invoked — before any argument parsing occurs.

**How it works:**
1. Check if `process.stdout.isTTY` is false, or if `-p`/`--print`/`--init-only`/`--sdk-url` flags are present — if so, the session is "non-interactive" (`z = true`)
2. For non-interactive sessions, suppress interactive warnings via `yr()` (disable TTY-specific output)
3. Set `CLAUDE_CODE_ENTRYPOINT` env var via `iGz()`:
   - `"mcp"` if the subcommand is `mcp serve`
   - `"claude-code-github-action"` if `CLAUDE_CODE_ACTION` env var is set
   - `"sdk-cli"` if the session is non-interactive
   - `"cli"` otherwise
4. Determine `clientType` from environment variables:
   - `GITHUB_ACTIONS=true` -> `"github-action"`
   - `CLAUDE_CODE_ENTRYPOINT=sdk-ts` -> `"sdk-typescript"`
   - `CLAUDE_CODE_ENTRYPOINT=sdk-py` -> `"sdk-python"`
   - `CLAUDE_CODE_ENTRYPOINT=sdk-cli` -> `"sdk-cli"`
   - `CLAUDE_CODE_ENTRYPOINT=claude-vscode` -> `"claude-vscode"`
   - `CLAUDE_CODE_ENTRYPOINT=local-agent` -> `"local-agent"`
   - `CLAUDE_CODE_SESSION_ACCESS_TOKEN` or `CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR` present -> `"remote"`
   - Default: `"cli"`

**Why this approach:** The client type influences telemetry tagging, feature gating, and permission defaults. By determining it early, all downstream code has access to it via `uL6(clientType)` (a global setter).

**Key insight:** The `--sdk-url` flag implicitly forces `--print` mode with `stream-json` I/O. This means SDK integrations never see the interactive REPL — they communicate exclusively through structured JSON over stdin/stdout or WebSocket.

---

## The `preAction` Hook (Commander.js Global Interceptor)

### What It Is and Why It Matters

The `preAction` hook is a Commander.js lifecycle callback that runs **before the action handler of every subcommand**. It is registered immediately after Commander.js is initialized and runs for ALL commands: `mcp serve`, `mcp add`, `config`, `doctor`, `update`, and the default root command.

**What it does:** Performs the synchronous and asynchronous initialization that every invocation of Claude Code requires, regardless of subcommand. This includes settings loading, migration execution, and remote policy fetching.

**How it works (chunks.197.mjs:1012-1016):**

```javascript
// ============================================
// preActionHook - Global initialization before any subcommand runs
// Location: chunks.197.mjs:1012-1016
// ============================================

// ORIGINAL (for source lookup):
q.hook("preAction", async () => {
    EK("preAction_start");
    let w = KDq();
    if (w instanceof Promise) await w;
    EK("preAction_after_init"), Rp7(), UGz(),
    EK("preAction_after_migrations"), M_4(), Dv7(),
    EK("preAction_after_remote_settings"),
    EK("preAction_after_settings_sync")
})

// READABLE (for understanding):
commanderProgram.hook("preAction", async () => {
    profileCheckpoint("preAction_start");

    // 1. Run initialization (may be a lazy Promise - await if so)
    let initResult = appInitializer();
    if (initResult instanceof Promise) await initResult;
    profileCheckpoint("preAction_after_init");

    // 2. Apply pending migrations (sync)
    runMigrations();

    // 3. Sync local settings caches (sync)
    syncSettings();
    profileCheckpoint("preAction_after_migrations");

    // 4. Fetch remote/org policy settings (async, fire-and-forget)
    fetchRemoteSettings();

    // 5. Post-remote-settings processing (async, fire-and-forget)
    postRemoteSettings();
    profileCheckpoint("preAction_after_remote_settings");
    profileCheckpoint("preAction_after_settings_sync");
})

// Mapping: q->commanderProgram, w->initResult, KDq->appInitializer,
//          Rp7->runMigrations, UGz->syncSettings,
//          M_4->fetchRemoteSettings, Dv7->postRemoteSettings, EK->profileCheckpoint
```

**Why fire-and-forget for remote settings?** Steps 4 and 5 are intentionally non-blocking. The remote settings fetch can take hundreds of milliseconds over the network. Most subcommands do not need remote settings for their core initialization.

---

## Interactive REPL Mode (Default)

### Activation

The interactive REPL is the default mode when:
- No `-p`/`--print` flag is present
- `process.stdout.isTTY` is true
- No `--sdk-url` or `--init-only` flags

### Flow

1. Render setup screens (auth, permissions, workspace trust) via `showSetupScreens` (`gRq`)
2. Initialize MCP servers, load commands and agents
3. Run `SessionStart` hooks
4. Construct `initialState` (the full `AppState` object — see `15_state_management/state_schema.md`)
5. Mount the React/Ink-based REPL component (`vK`) inside `AppStateProvider` (`Pf1`)

The REPL component receives:
- `commands` - All slash commands (built-in + MCP-provided)
- `initialTools` - MCP tools loaded at startup
- `mcpClients` - Active MCP server connections
- `mainThreadAgentDefinition` - The agent definition if `--agent` was specified
- `dynamicMcpConfig` - MCP configs from `--mcp-config` flag
- `systemPrompt` / `appendSystemPrompt` - Custom prompt overrides

---

## Print / Headless Mode (`--print` / `-p`)

### Activation

Triggered by `-p` or `--print` flag, or implicitly by:
- Piped stdin (`!process.stdout.isTTY`)
- `--sdk-url` flag
- `--init-only` flag

### Behavioral Differences

1. **No interactive UI**: All output goes to stdout in the specified format
2. **Output formats**: `text` (default), `json` (single response), `stream-json` (real-time streaming)
3. **Input formats**: `text` (default), `stream-json` (structured input)
4. **Additional options available only in print mode**:
   - `--max-turns` - Limit agent turns for budget control
   - `--max-budget-usd` - Dollar cap on API spending
   - `--max-thinking-tokens` - Cap on thinking token budget
   - `--json-schema` - Structured output validation
   - `--permission-prompt-tool` - MCP tool for permission prompts
   - `--no-session-persistence` - Don't save transcript to disk
   - `--include-partial-messages` - Emit partial streaming chunks
   - `--resume-session-at` - Replay up to a specific message ID

### Flow

```
runHeadless(prompt, getState, setState, commands, tools, sdkMcpServers, agents, options)
```

The headless runner manages the agent loop without React/Ink, writing output directly to stdout.

---

## Effort Level System (Updated in v2.1.76)

### Simplified Effort Levels

**What changed:** In v2.1.76, the effort level system was simplified. The `max` level was removed entirely. The valid effort levels are now:

| Level | Symbol | Thinking Budget | Use Case |
|-------|--------|-----------------|----------|
| `low` | ○ | Minimal (4K tokens) | Quick tasks, simple queries |
| `medium` | ◐ | Standard (16K tokens) | Balanced performance |
| `high` | ● | Extended (32K tokens) | Complex reasoning |

**Why max was removed:**
- The `max` level required special-case gating (print-mode only, API key only)
- `high` now provides the maximum available effort in all contexts
- Simplifies the user mental model: three intuitive levels instead of four with hidden restrictions

### `/effort auto` — Reset Mode (New in v2.1.76)

The `/effort auto` slash command resets the effort level back to automatic mode (Claude chooses based on task complexity). This is distinct from an explicit level choice — it defers the decision to the model's judgment.

**How it works:**
1. User types `/effort auto` in the REPL
2. The effort override is cleared from session state
3. Claude uses adaptive reasoning budget based on each query's complexity
4. The prompt bar indicator returns to the default state

**Why auto mode matters:** Users who set `--effort high` for one complex task may not want it to persist throughout the session. `/effort auto` provides a clean way to revert without restarting.

### `/color` Command — New in v2.1.76

The `/color` command allows users to set a custom color for the session's prompt bar. This is primarily useful in multi-session or agent-teams setups where visual identification of different sessions is needed.

---

## Permission Modes

### Permission Mode Flow

```
CLI flags → setupPermissionMode (qJq) → buildToolPermissionContext (KJq) → ToolPermissionContext
```

**Permission modes available:**
- `default` - Normal operation, tool permission prompts
- `acceptEdits` - Automatically accept file edits without prompting
- `plan` - Plan mode: no tool execution, only planning
- `bypassPermissions` - Skip all permission checks (dangerous)

### Bypass Permissions Guard

The bypass mode has multiple safety gates that must all pass:
1. Feature flag `tengu_disable_bypass_permissions_mode` must be false
2. Org policy `disableBypassPermissionsMode` must not be `"disable"`
3. User must provide `--dangerously-skip-permissions` or `--permission-mode bypassPermissions`

**Why multiple gates:** Enterprise security requires admin-controlled disable even when users pass the flag.

---

## MCP CLI Mode

### Activation

Activated when `--mcp-cli` flag is present in `process.argv[2]`.

### Behavior

1. Checks if MCP CLI feature is enabled (Statsig feature flag)
2. If enabled: dynamically imports `mcpCliMain` and calls it
3. If disabled: falls through to normal CLI processing

This mode allows IDE extensions and editor plugins to communicate with Claude Code using the MCP protocol over stdio without starting the full REPL.

---

## Remote/Teleport Modes

### `--remote` Mode

Creates a new remote session over an SSH-tunneled WebSocket connection. The optional description becomes the session label visible in remote session listings.

### `--teleport` Mode

Resumes a remote-hosted session. The session token is typically a URL or opaque identifier obtained from the remote Claude service. This allows "teleporting" a session from one machine to another while preserving context.

---

## Mode Decision Tree

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CLI MODE DECISION FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  process.argv                                                                │
│  │                                                                          │
│  ├─► --version → print version, exit                                        │
│  │                                                                          │
│  ├─► --mcp-cli → mcpCliMain(), exit                                         │
│  │                                                                          │
│  ├─► --ripgrep → ripgrepMain(), exit                                        │
│  │                                                                          │
│  ├─► auth login/status/logout → authMain(), exit (v2.1.41+)                │
│  │                                                                          │
│  └─► main()                                                                 │
│      │                                                                      │
│      ├─► Determine client type                                               │
│      │                                                                      │
│      └─► run() [Commander.js]                                               │
│          │                                                                  │
│          ├─► --sdk-url → force print + stream-json                          │
│          │                                                                  │
│          ├─► --print / stdin not TTY → headless mode                        │
│          │   │                                                               │
│          │   └─► runHeadless(...)                                           │
│          │                                                                  │
│          ├─► --teleport → resume teleport session                           │
│          │                                                                  │
│          ├─► --remote → create remote session                               │
│          │                                                                  │
│          ├─► --resume / --continue → load transcript                        │
│          │                                                                  │
│          └─► interactive REPL                                               │
│              │                                                              │
│              └─► showSetupScreens() → renderREPL()                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Integration Points Summary

| Integration Point | Location | Description |
|-------------------|----------|-------------|
| CLI entry | `chunks.198.mjs:167` | `cliEntry` with early dispatch |
| Main function | `chunks.197.mjs:931` | `mainEntry`, client type detection |
| Commander setup | `chunks.197.mjs:999` | `run`, all flag definitions |
| Permission mode | `chunks.197.mjs:1254` | `setupPermissionMode` |
| Permission context | `chunks.172.mjs:2252` | `buildToolPermissionContext` |
| REPL rendering | `chunks.197.mjs:1702` | `<REPL>` component mount |
| Headless runner | `chunks.UMq` | `runHeadless` function |
| Effort validation | `chunks.197.mjs:1023` | Validates low/medium/high only |
