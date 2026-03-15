# CLI Modes and Activation

## Overview

Claude Code v2.1.38 supports multiple operational modes activated through CLI flags, environment variables, and runtime conditions. The main entry point (`qZz` in `chunks.190.mjs:167`) performs early flag dispatch for special modes (MCP CLI, ripgrep, Chrome), then delegates to the `main()` function (`nGz` in `chunks.189.mjs:931`), which determines the client type and calls `run()` (`aGz` in `chunks.189.mjs:999`). The `run()` function uses the Commander.js library to define all flags, validate combinations, and dispatch to the appropriate runtime path: interactive REPL, headless print mode, remote session, teleport resume, or session continue/resume.

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

**What it does:** The `cliEntry` function (`qZz`, chunks.190.mjs:167) checks `process.argv` for special flags that can bypass the heavyweight main import entirely.

**How it works:**
1. `--version` / `-v` / `-V`: Prints version string and returns immediately
2. `--mcp-cli`: If the MCP CLI feature is enabled, delegates to `mcpCliMain` and exits
3. `--ripgrep`: Delegates to the bundled ripgrep binary (used internally by tools)
4. `--claude-in-chrome-mcp`: Starts the Chrome MCP server for browser integration
5. `--chrome-native-host`: Starts the Chrome native messaging host
6. `--tmux` / `--tmux=classic`: Sets a flag for tmux-based teammate spawning
7. `--update` / `--upgrade`: Rewrites argv to the `update` subcommand

**Why this approach:** These modes are lightweight and self-contained. By dispatching them before importing the heavy `main()` module (which lazily loads `pRq` -- the entire application initialization), startup latency for utility commands is minimized. The `profileCheckpoint` calls (`q("cli_entry")`, etc.) instrument each phase for performance monitoring.

**Key insight:** The dynamic `Promise.resolve().then(() => (...))` pattern is used throughout to enable code splitting. Each special mode loads its implementation lazily, keeping the initial bundle small.

```javascript
// ============================================
// cliEntry - Top-level CLI entry with early dispatch
// Location: chunks.190.mjs:167-222
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

**What it does:** The `main()` function (`nGz`, chunks.189.mjs:931) determines the "client type" -- a classification of how Claude Code was invoked -- before any argument parsing occurs.

**How it works:**
1. Check if `process.stdout.isTTY` is false, or if `-p`/`--print`/`--init-only`/`--sdk-url` flags are present -- if so, the session is "non-interactive" (`z = true`)
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

**Why this approach:** The client type influences telemetry tagging, feature gating, and permission defaults. By determining it early (before Commander.js runs), all downstream code has access to it via `uL6(clientType)` (a global setter). SDK clients, GitHub Actions, and VS Code extensions all have different behavioral requirements (e.g., SDK mode force-enables `--print` and `stream-json`).

**Key insight:** The `--sdk-url` flag implicitly forces `--print` mode with `stream-json` I/O. This means SDK integrations never see the interactive REPL -- they communicate exclusively through structured JSON over stdin/stdout or WebSocket.

---

## The `preAction` Hook (Commander.js Global Interceptor)

### What It Is and Why It Matters

The `preAction` hook is a Commander.js lifecycle callback that runs **before the action handler of every subcommand**. It is registered immediately after Commander.js is initialized and runs for ALL commands: `mcp serve`, `mcp add`, `config`, `doctor`, `update`, and the default root command.

This placement is deliberate: it is the earliest point where the full Node.js event loop is running and Commander knows which subcommand was invoked, but before any action-level logic executes.

**What it does:** Performs the synchronous and asynchronous initialization that every invocation of Claude Code requires, regardless of subcommand. This includes settings loading, migration execution, and remote policy fetching.

**How it works (chunks.189.mjs:1012-1016):**

```javascript
// ============================================
// preActionHook - Global initialization before any subcommand runs
// Location: chunks.189.mjs:1012-1016
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

### Step-by-Step Breakdown of Each Call

**Step 1: `KDq()` - Application Initializer**

`KDq` is a lazily-evaluated thunk (defined in `chunks.175.mjs:2316` as `KA(() => {...})`). The `KA()` wrapper means it only executes once and caches the result. When called the first time, it:
- Enables safe environment variable overrides (`tXq()`)
- Initializes graceful shutdown handlers (`iO4()`)
- Sets up 1Password event logging (async, fire-and-forget via Promise chain)
- Populates OAuth tokens (`W$8()`)
- Detects JetBrains IDE presence (`zXA()`)
- Configures global mTLS certificates (`BB8()`)
- Sets up proxy agents (`OA6()`)
- Wires background Statsig refresh (`hY8()`)
- Assigns `CLAUDE_CODE_SESSION_ID` env var if in a session context
- Creates scratchpad directory if needed

The critical detail: **`KDq()` returns a Promise when called the first time** (because `KA()` wraps async work). The `if (w instanceof Promise) await w` check handles this correctly. On subsequent calls (should not normally happen), the cached value is synchronous.

**Step 2: `Rp7()` - Run Pending Migrations (chunks.89.mjs:328)**

This function checks for pending `.output` files in the migration directory (`eu1()`), executes each one via `kp7()`, and cleans up. Migrations are one-shot operations stored as `.output` extension files. The entire function is wrapped in `try/catch` blocks -- migration failures are silently swallowed to avoid breaking the startup of legitimate sessions.

**Step 3: `UGz()` - Sync Settings (chunks.189.mjs:851)**

Calls `T0q(), E0q(), C0q(), R0q()` (four settings cache synchronizers) and then `d5q().catch(() => {})` (a fifth async sync operation, with errors suppressed). This populates the in-memory settings caches from disk so that all downstream code can read settings synchronously. The async `.catch(() => {})` suppression means settings sync failures are non-fatal.

**Step 4: `M_4()` - Fetch Remote Settings (chunks.110.mjs:1299)**

An `async function` that fetches organizational policy settings from the remote backend (`VGA()`). This call is **NOT awaited** in the preAction hook -- it is fire-and-forget. The implementation creates a deferred Promise (`D31`) that other code can await to know when remote settings have arrived. Once the fetch completes, it calls `GO()` and `zX.notifyChange("policySettings")` to notify subscribers.

**Step 5: `Dv7()` - Post-Remote-Settings Processing (chunks.72.mjs:2328)**

Another `async function`, also fire-and-forget. Calls `w$A()` (a secondary policy refresh) and then `aq9()` (applies the refreshed policy). Like `M_4`, it creates a deferred Promise (`zq1`) for code that needs to wait for this phase.

### Key Architectural Decisions

**Why fire-and-forget for remote settings?** Steps 4 and 5 are intentionally non-blocking. The remote settings fetch can take hundreds of milliseconds over the network. Most subcommands do not need remote settings for their core initialization -- they need local settings, which are already loaded by step 3. Remote settings govern enterprise policy (e.g., `disableBypassPermissionsMode`, `additionalDirectories`), which are only consulted later in the action handler when building the permission context. By the time the action handler reaches `qJq()` and `KJq()`, the remote settings fetch has usually completed.

**Why does this run for every subcommand?** The `mcp add` and `mcp serve` commands also need settings, migrations, and remote policy loaded. A shared preAction hook avoids duplicating this boilerplate in every subcommand's action handler.

**Key insight:** The checkpoint timestamps (`EK("preAction_start")` through `EK("preAction_after_settings_sync")`) feed into the startup profiling system. Engineers can diff checkpoints to identify initialization bottlenecks. The `preAction_after_init` to `preAction_after_migrations` gap measures migration overhead; `preAction_after_migrations` to `preAction_after_remote_settings` measures the time to initiate (not complete) the remote settings fetch.

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
4. Construct `initialState` (the full `AppState` object -- see `15_state_management/state_schema.md`)
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
   - `--permission-prompt-tool` - MCP tool for permission prompts (enables programmatic approval)
   - `--no-session-persistence` - Don't save transcript to disk
   - `--include-partial-messages` - Emit partial streaming chunks
   - `--resume-session-at` - Replay up to a specific message ID

### Flow

```
runHeadless(prompt, getState, setState, commands, tools, sdkMcpServers, agents, options)
```

The headless runner (`j5` from `chunks.UMq`) manages the agent loop without React/Ink, writing output directly to stdout. It supports the same tool execution pipeline but skips all interactive UI elements.

**Key insight:** The `--output-format=stream-json` mode with `--include-partial-messages` gives SDK consumers fine-grained streaming -- every `content_block_delta` event from the API is forwarded as a JSON line, enabling real-time UI updates in external applications.

---

## `--from-pr` Mode

### Activation

`--from-pr [value]` where value can be:
- `true` (no value) - Opens interactive PR picker
- A string - Either a PR number, a `#123` reference, or a full GitHub PR URL

### Flow

**What it does:** Resumes a Claude Code session that was previously linked to a pull request. This enables a workflow where a developer can start a task, create a PR, and later resume the conversation in the context of that PR.

**How it works (chunks.189.mjs:1755-1757):**
1. Parse the `--from-pr` value (chunks.189.mjs:1755-1757):
   - If `true`: Set `filterByPr = true` to show only PR-linked sessions in the picker
   - If a string: Set `filterByPr` to that string for pre-filtered search
2. The `ResumeConversation` component (`c1` from `chunks.GRq`) is rendered with `filterByPr` set
3. Session metadata includes `prNumber`, `prUrl`, and `prRepository` fields (extracted during session listing from transcript files via `h2z` in chunks.174.mjs)
4. When a session is selected, it is restored via `MQA` (the session restore function)

**Why this approach:** PR-linked sessions store the PR metadata in the transcript file's trailing bytes. The session picker reads these fields efficiently using a seek-to-end strategy (`sZ1` reads the last 4KB of the transcript), avoiding full file parsing. This makes filtering thousands of sessions by PR number fast.

**Key insight:** The `--from-pr` flag is syntactically similar to `--resume` but uses PR metadata for session discovery instead of session IDs. When combined with `--fork-session`, it creates a new session branching from the PR conversation, useful for multiple review iterations.

---

## Teammate Mode (Swarm CLI Flags)

### Activation

Teammate mode is activated when `l8()` returns true (the Agent Teams feature flag is enabled) and teammate-specific hidden flags are provided:
- `--agent-id <id>` - Teammate agent ID
- `--agent-name <name>` - Display name
- `--team-name <name>` - Team for swarm coordination
- `--agent-color <color>` - UI color
- `--plan-mode-required` - Force plan mode
- `--parent-session-id <id>` - Correlation with parent
- `--teammate-mode <mode>` - Spawn strategy: `"auto"`, `"tmux"`, or `"in-process"`
- `--agent-type <type>` - Custom agent type

### Validation and Setup

**What it does:** When Claude Code is launched as a teammate (spawned by a team leader), these flags configure it as a subordinate agent within a swarm.

**How it works (chunks.189.mjs:1071-1088):**
1. Parse teammate options via `parseTeammateOptions` (`eGz`, chunks.190.mjs:3-17)
2. Validate that `--agent-id`, `--agent-name`, and `--team-name` are ALL provided together (partial specification is an error)
3. Set dynamic team context via `mRq().setDynamicTeamContext()` with the agent's identity
4. If `--teammate-mode` is specified, override the global teammate mode setting
5. Append the `TEAMMATE_SYSTEM_PROMPT_ADDENDUM` to the system prompt (chunks.189.mjs:1163-1168)
6. If the teammate has a custom agent type, look up its definition and inject its system prompt as an `appendSystemPrompt`

```javascript
// ============================================
// parseTeammateOptions - Validate and extract teammate CLI flags
// Location: chunks.190.mjs:3-17
// ============================================

// ORIGINAL (for source lookup):
function eGz(A) {
    if (typeof A !== "object" || A === null) return {};
    let q = A, K = q.teammateMode;
    return {
        agentId: typeof q.agentId === "string" ? q.agentId : void 0,
        agentName: typeof q.agentName === "string" ? q.agentName : void 0,
        teamName: typeof q.teamName === "string" ? q.teamName : void 0,
        agentColor: typeof q.agentColor === "string" ? q.agentColor : void 0,
        planModeRequired: typeof q.planModeRequired === "boolean" ? q.planModeRequired : void 0,
        parentSessionId: typeof q.parentSessionId === "string" ? q.parentSessionId : void 0,
        teammateMode: K === "auto" || K === "tmux" || K === "in-process" ? K : void 0,
        agentType: typeof q.agentType === "string" ? q.agentType : void 0
    }
}

// READABLE (for understanding):
function parseTeammateOptions(opts) {
    if (typeof opts !== "object" || opts === null) return {};
    let teammateMode = opts.teammateMode;
    return {
        agentId: typeof opts.agentId === "string" ? opts.agentId : undefined,
        agentName: typeof opts.agentName === "string" ? opts.agentName : undefined,
        teamName: typeof opts.teamName === "string" ? opts.teamName : undefined,
        agentColor: typeof opts.agentColor === "string" ? opts.agentColor : undefined,
        planModeRequired: typeof opts.planModeRequired === "boolean" ? opts.planModeRequired : undefined,
        parentSessionId: typeof opts.parentSessionId === "string" ? opts.parentSessionId : undefined,
        teammateMode: teammateMode === "auto" || teammateMode === "tmux" || teammateMode === "in-process"
            ? teammateMode : undefined,
        agentType: typeof opts.agentType === "string" ? opts.agentType : undefined
    };
}

// Mapping: eGz->parseTeammateOptions, A->opts, q->opts, K->teammateMode
```

**Why this approach:** All teammate flags are hidden from `--help` output (`.hideHelp()`) because they are internal implementation details. The team leader process spawns teammates by constructing the CLI command with these flags programmatically. The strict validation (all-or-nothing for identity fields) prevents partially configured teammates from joining a swarm.

---

## SDK / External Mode (`--sdk-url`)

### Activation

`--sdk-url <url>` provides a WebSocket URL for remote SDK I/O streaming.

### Behavioral Differences

**What it does:** Transforms Claude Code into a WebSocket-connected agent that receives instructions from and sends results to an external SDK host.

**How it works (chunks.189.mjs:1089-1096):**
1. Force `inputFormat` and `outputFormat` to `"stream-json"` if not already set
2. Force `verbose` to true if not explicitly set
3. Force `print` mode (headless) if not explicitly set
4. Validate that both `--input-format=stream-json` and `--output-format=stream-json` are active

**Why this approach:** The `--sdk-url` flag is designed for programmatic integration (TypeScript SDK, Python SDK, VS Code extension). By forcing `stream-json` I/O, it ensures bidirectional structured communication. The verbose override enables debug logging that SDK consumers can capture for diagnostics.

**Key insight:** The SDK URL pattern enables "remote brain" architectures where the UI and the agent loop run in different processes or machines. The `CLAUDE_CODE_ENTRYPOINT` is set to `"sdk-cli"` for this mode, which affects telemetry tagging and feature gating (e.g., certain interactive-only features are disabled).

---

## `--remote` Mode

### Activation

`--remote [description]` where description is optional text describing the task.

### Flow

**What it does:** Creates a remote session on claude.ai that can be viewed and interacted with from a web browser, while the actual agent execution runs locally.

**How it works (chunks.189.mjs:1769-1828):**
1. Call `Jv7()` to validate authentication
2. Check organization policy: `p0("allow_remote_sessions")` -- abort if disabled
3. Check feature flag `tengu_remote_backend`:
   - If disabled: require a description, create session, print URL, exit
   - If enabled: create session, authenticate, establish WebSocket connection, launch REPL with `remoteSessionConfig`
4. Session creation via `ui4(root, prompt, abortSignal, projectId)` returns `{id, title}`
5. Authentication via `PN()` returns `{accessToken, orgUUID}`
6. WebSocket config created via `x0q(sessionId, accessToken, orgUUID, hasPrompt)`
7. The REPL launches with a limited command set (`yOq(commands)` filters to remote-compatible commands), no MCP tools (tools are empty `[]`), and the `remoteSessionConfig` property

**Why this approach:** Remote sessions serve two purposes: (1) allowing web-based monitoring of local agent activity, and (2) enabling "fire and forget" tasks where the developer starts a task and monitors it from claude.ai. The remote session URL format `https://claude.ai/code/{sessionId}?m=0` enables immediate browser access.

**Key insight:** The remote mode fundamentally changes the REPL's I/O model. Instead of tools being loaded locally, the tool execution still happens locally, but the conversation transcript is synchronized to the remote session. The `remoteSessionUrl` is stored in `AppState` so the UI can display it.

---

## Session Management Modes

### `--continue` / `-c`

Continues the most recent conversation in the current directory. Calls `yt(undefined, undefined)` to find the latest session, then restores it via `MQA()`.

### `--resume [value]` / `-r`

Resumes by session ID or opens an interactive session picker:
- UUID string: Direct resume by session ID
- Non-UUID string: Search sessions by text, then show picker
- `true` (no value): Show interactive picker

### `--fork-session`

When combined with `--resume` or `--continue`, creates a new session ID instead of reusing the original. This enables branching conversations.

### `--teleport [session]`

Resumes a teleport session (remote-originated session that was pushed to local):
- No value: Show interactive teleport task picker
- Session ID string: Direct resume, validates the session against the local git repository

---

## Permission Mode Resolution Deep Dive

### The `setupPermissionMode` (`qJq`) Decision Algorithm

**What it does:** Resolves the effective permission mode from multiple competing sources -- CLI flags, organizational policy, and system feature gates -- applying a strict priority order and silently skipping invalid combinations.

**How it works (chunks.172.mjs:2175-2217):**

```javascript
// ============================================
// setupPermissionMode - Resolve permission mode with priority and guards
// Location: chunks.172.mjs:2175-2217
// ============================================

// ORIGINAL (for source lookup):
function qJq({ permissionModeCli: A, dangerouslySkipPermissions: q, ...K }) {
    let Y = C8() || {},
        z = i2("tengu_disable_bypass_permissions_mode"),
        w = Y.permissions?.disableBypassPermissionsMode === "disable",
        H = z || w,
        $ = [],
        O;
    if (q) $.push("bypassPermissions");
    if (A) $.push(jC(A));
    if (Y.permissions?.defaultMode) $.push(Y.permissions.defaultMode);
    let _;
    for (let J of $) {
        if (J === "bypassPermissions" && H) {
            if (z) O = "Bypass permissions mode was disabled by your organization policy";
            else O = "Bypass permissions mode was disabled by settings";
            continue
        }
        if (J === "delegate" && !l8()) { continue }
        _ = { mode: J, notification: O };
        break
    }
    if (!_) _ = { mode: "default", notification: O };
    return _
}

// READABLE (for understanding):
function setupPermissionMode({ permissionModeCli, dangerouslySkipPermissions, ...rest }) {
    let orgSettings = getOrgSettings() || {},
        isBypassDisabledByGate = statsigCheck("tengu_disable_bypass_permissions_mode"),
        isBypassDisabledByOrg = orgSettings.permissions?.disableBypassPermissionsMode === "disable",
        isBypassDisabled = isBypassDisabledByGate || isBypassDisabledByOrg,
        priorityList = [],
        notificationMessage;

    // Build priority list from highest to lowest precedence
    if (dangerouslySkipPermissions) priorityList.push("bypassPermissions");
    if (permissionModeCli) priorityList.push(normalizeMode(permissionModeCli));
    if (orgSettings.permissions?.defaultMode) priorityList.push(orgSettings.permissions.defaultMode);

    // Walk priority list, skip invalid entries
    let result;
    for (let candidate of priorityList) {
        if (candidate === "bypassPermissions" && isBypassDisabled) {
            // Record why bypass was blocked (for user notification)
            notificationMessage = isBypassDisabledByGate
                ? "Bypass permissions mode was disabled by your organization policy"
                : "Bypass permissions mode was disabled by settings";
            continue; // Skip this candidate, try next
        }
        if (candidate === "delegate" && !isAgentSwarmEnabled()) {
            continue; // Delegate requires feature flag
        }
        result = { mode: candidate, notification: notificationMessage };
        break; // First valid candidate wins
    }

    // Fallback: if nothing valid, use default
    if (!result) result = { mode: "default", notification: notificationMessage };
    return result;
}

// Mapping: qJq->setupPermissionMode, A->permissionModeCli, q->dangerouslySkipPermissions,
//          Y->orgSettings, z->isBypassDisabledByGate, w->isBypassDisabledByOrg,
//          H->isBypassDisabled, $->priorityList, O->notificationMessage, _->result,
//          J->candidate, C8->getOrgSettings, i2->statsigCheck, jC->normalizeMode,
//          l8->isAgentSwarmEnabled
```

### Priority Order (Highest to Lowest)

```
1. --dangerously-skip-permissions flag  →  "bypassPermissions"
2. --permission-mode <mode> CLI flag    →  any valid mode (normalized via jC)
3. org settings permissions.defaultMode →  whatever the org configured
4. (implicit fallback)                  →  "default"
```

### Guards and Blocking Conditions

**bypassPermissions guard:**
- Blocked by Statsig feature gate `tengu_disable_bypass_permissions_mode` (server-side kill switch)
- Blocked by org policy: `permissions.disableBypassPermissionsMode === "disable"`
- When blocked: a `notificationMessage` is set (shown to user as a warning), the candidate is skipped, and the algorithm continues to the next priority level
- If `--dangerously-skip-permissions` is the only entry and it's blocked, the fallback `"default"` mode is used

**delegate guard:**
- Blocked when `l8()` returns false (Agent Swarms feature flag disabled)
- No notification message for this case -- it silently falls through
- This prevents `--permission-mode delegate` from activating in single-agent deployments

### Critical Behavior: `notificationMessage` Persistence

The `notificationMessage` (`O` in the original) is only set when `bypassPermissions` is blocked. It persists across loop iterations. This means: if bypass is blocked AND the org default mode is also `"delegate"` (but swarms are disabled), the final returned `{ mode: "default", notification: "...bypass disabled..." }` still carries the bypass-blocked message. This enables the UI to inform the user about the blocked permission even when a fallback mode is successfully resolved.

**Why this approach:** The priority-list-with-guards pattern cleanly separates the "what was requested" from "what is allowed." It avoids complex nested if-else logic, is easily extensible (new guards can be added per mode), and produces a consistent output shape `{ mode, notification }` regardless of which combination of flags and policy applies.

**Key insight:** The return value's `notification` field propagates all the way to the UI layer, where it can be displayed as a warning banner. The separation of "mode resolution" from "mode enforcement" means the permission mode decision is made once at startup, in one function, rather than scattered across multiple guard checks.

### Available Permission Modes

From the Commander.js `choices` definition (constant `ox`):
- `"default"` - Standard permission prompting
- `"plan"` - Plan mode (read-only planning phase)
- `"acceptEdits"` - Auto-accept file edits without prompting
- `"dontAsk"` - Never ask for permission (local files only)
- `"bypassPermissions"` - Skip all permission checks (requires `--dangerously-skip-permissions`)
- `"delegate"` - Delegate permission decisions to parent agent (swarms only)

---

## Tool Permission Context Construction

### The `buildToolPermissionContext` (`KJq`) Function

**What it does:** Constructs the `toolPermissionContext` object -- the central, immutable permissions configuration that governs all tool execution for the entire session. This object is passed to every tool invocation and is the single source of truth for what is allowed, what is denied, and what requires approval.

**How it works (chunks.172.mjs:2252-2311):**

```javascript
// ============================================
// buildToolPermissionContext - Construct session-wide tool permission rules
// Location: chunks.172.mjs:2252-2311
// ============================================

// ORIGINAL (for source lookup):
function KJq({ allowedToolsCli: A, disallowedToolsCli: q, baseToolsCli: K, permissionMode: Y, allowDangerouslySkipPermissions: z, addDirs: w }) {
    let H = hd(A),
        $ = hd(q);
    if (K && K.length > 0) {
        let Z = Szz(K), N = new Set(Z),
            k = rRA().filter((y) => !N.has(y));
        $ = [...$, ...k]
    }
    let O = [], _ = new Map, J = process.env.PWD;
    if (J && J !== y8() && hzz({ originalCwd: y8(), processPwd: J }))
        _.set(J, { path: J, source: "session" });
    let X = i2("tengu_disable_bypass_permissions_mode"),
        D = C8() || {},
        j = D.permissions?.disableBypassPermissionsMode === "disable",
        M = (Y === "bypassPermissions" || z) && !X && !j,
        P = Q76(),
        G = AJq({ mode: Y, additionalWorkingDirectories: _, alwaysAllowRules: { cliArg: H },
                  alwaysDenyRules: { cliArg: $ }, alwaysAskRules: {}, isBypassPermissionsModeAvailable: M }, P),
        f = [...D.permissions?.additionalDirectories || [], ...w];
    for (let Z of f) {
        let N = cG1(Z, G);
        if (N.resultType === "success") G = a2(G, { type: "addDirectories", directories: [N.absolutePath], destination: "cliArg" });
        else if (N.resultType !== "alreadyInWorkingDirectory" && N.resultType !== "pathNotFound") O.push(lG1(N))
    }
    return { toolPermissionContext: G, warnings: O, dangerousPermissions: W }
}

// READABLE (for understanding):
function buildToolPermissionContext({ allowedToolsCli, disallowedToolsCli, baseToolsCli,
                                      permissionMode, allowDangerouslySkipPermissions, addDirs }) {
    // 1. Parse tool lists from CLI args (handles comma/space separation, parenthetical args)
    let alwaysAllow = parseToolList(allowedToolsCli);
    let alwaysDeny = parseToolList(disallowedToolsCli);

    // 2. --tools flag: "base tool set" implies denying everything NOT in that set
    if (baseToolsCli && baseToolsCli.length > 0) {
        let expandedBase = expandToolNames(baseToolsCli);         // e.g. "Bash" -> ["Bash", "Bash(*)"]
        let baseSet = new Set(expandedBase);
        let allTools = getAllToolNames();                          // full registry of known tools
        let impliedDenied = allTools.filter(tool => !baseSet.has(tool));
        alwaysDeny = [...alwaysDeny, ...impliedDenied];           // deny everything outside the base
    }

    // 3. Handle symlinked CWD: process.env.PWD may differ from process.cwd() on symlinked paths
    let warnings = [];
    let additionalWorkingDirectories = new Map();
    let processPwd = process.env.PWD;
    if (processPwd && processPwd !== getCwd() && isSymlinkedPath({ originalCwd: getCwd(), processPwd })) {
        // Add the symlinked path as an allowed working directory
        additionalWorkingDirectories.set(processPwd, { path: processPwd, source: "session" });
    }

    // 4. Check if bypass permissions mode is actually available for runtime use
    let isBypassGateDisabled = statsigCheck("tengu_disable_bypass_permissions_mode");
    let orgSettings = getOrgSettings() || {};
    let isBypassOrgDisabled = orgSettings.permissions?.disableBypassPermissionsMode === "disable";
    let isBypassAvailable = (permissionMode === "bypassPermissions" || allowDangerouslySkipPermissions)
                             && !isBypassGateDisabled && !isBypassOrgDisabled;

    // 5. Build the core context object
    let globalSettings = getGlobalSettings();
    let toolPermissionContext = buildPermissionContextObject({
        mode: permissionMode,
        additionalWorkingDirectories,
        alwaysAllowRules: { cliArg: alwaysAllow },
        alwaysDenyRules: { cliArg: alwaysDeny },
        alwaysAskRules: {},
        isBypassPermissionsModeAvailable: isBypassAvailable
    }, globalSettings);

    // 6. Add directories from org settings + --add-dir flag
    let directoriesFromAllSources = [...orgSettings.permissions?.additionalDirectories || [], ...addDirs];
    for (let dir of directoriesFromAllSources) {
        let validation = validateDirectory(dir, toolPermissionContext);
        if (validation.resultType === "success") {
            toolPermissionContext = applyPermissionAction(toolPermissionContext, {
                type: "addDirectories", directories: [validation.absolutePath], destination: "cliArg"
            });
        } else if (validation.resultType !== "alreadyInWorkingDirectory"
                && validation.resultType !== "pathNotFound") {
            warnings.push(formatDirectoryWarning(validation));
        }
    }

    return { toolPermissionContext, warnings, dangerousPermissions };
}

// Mapping: KJq->buildToolPermissionContext, A->allowedToolsCli, q->disallowedToolsCli,
//          K->baseToolsCli, Y->permissionMode, z->allowDangerouslySkipPermissions, w->addDirs,
//          H->alwaysAllow, $->alwaysDeny, O->warnings, _->additionalWorkingDirectories,
//          J->processPwd, X->isBypassGateDisabled, D->orgSettings, j->isBypassOrgDisabled,
//          M->isBypassAvailable, P->globalSettings, G->toolPermissionContext,
//          f->directoriesFromAllSources, hd->parseToolList, Szz->expandToolNames,
//          rRA->getAllToolNames, y8->getCwd, hzz->isSymlinkedPath, i2->statsigCheck,
//          C8->getOrgSettings, Q76->getGlobalSettings, AJq->buildPermissionContextObject,
//          a2->applyPermissionAction, cG1->validateDirectory, lG1->formatDirectoryWarning
```

### The `--tools` Flag vs. `--allowed-tools` vs. `--disallowed-tools`

These three flags interact in non-obvious ways. Understanding the difference is critical:

**`--allowed-tools <list>` (`allowedToolsCli`):**
- Adds rules to the `alwaysAllowRules.cliArg` bucket
- Does NOT remove other tools from availability
- Example: `--allowed-tools "Bash(git:*)"` → git-prefixed Bash commands never ask for permission, but all other tools still work normally (just may require approval)

**`--disallowed-tools <list>` (`disallowedToolsCli`):**
- Adds rules to the `alwaysDenyRules.cliArg` bucket
- Blocks specific tools entirely, regardless of permission mode
- Example: `--disallowed-tools "Bash Edit"` → Bash and Edit are completely unavailable

**`--tools <list>` (`baseToolsCli`):**
- Defines the **complete allowed tool set** -- everything NOT in this list goes into `alwaysDenyRules`
- `--tools ""` → empty allowed set → all tools denied (no tools available)
- `--tools default` → all tools available (equivalent to not specifying the flag)
- `--tools "Bash Edit Read"` → only Bash, Edit, and Read available; all others denied
- The implementation uses `expandToolNames(baseToolsCli)` to normalize names (e.g., handles aliases), then `getAllToolNames()` to enumerate the full registry, then set-differences to find the implied denials

**Combination behavior:** If both `--tools` and `--disallowed-tools` are specified, the `--tools` implied denials are appended to the existing `alwaysDeny` list (union of both). `--allowed-tools` can coexist with `--tools` to grant always-allow status within the permitted subset.

### Symlinked CWD Detection

The check `process.env.PWD !== process.cwd()` (`processPwd !== y8()`) detects when the user launched Claude Code from inside a symlinked directory. In this scenario:
- `process.cwd()` returns the resolved (real) path after following symlinks
- `process.env.PWD` retains the unresolved (symlinked) path as the shell sees it

The `isSymlinkedPath` check (`hzz`) verifies this is genuinely a symlink scenario (not just a different drive letter or normalization difference). When confirmed, the symlinked path is added to `additionalWorkingDirectories`, allowing tools to access files through both the symlinked and real paths. Without this, Bash and file tools would reject operations on the symlinked path because it's "outside the working directory."

### `isBypassPermissionsModeAvailable` - Runtime Switching Support

The `isBypassAvailable` flag (`M` in the original) is stored inside the `toolPermissionContext` even when the current permission mode is not `bypassPermissions`. This serves a specific purpose: it allows runtime switching to bypass mode without rebuilding the entire context. If a user has `--allow-dangerously-skip-permissions` (note: different from `--dangerously-skip-permissions`), bypass mode is available as an option but not currently active. The context carries this capability, and the permission mode can be changed to `bypassPermissions` mid-session without a restart.

**Why this approach:** Immutable context construction at startup with a stored "capability" flag enables safe, auditable permission escalation. The flag's dual check (gate AND org policy) at construction time ensures that even if an attacker somehow triggers a mode switch at runtime, the pre-computed availability check prevents bypass from activating if it was blocked at startup.

**Key insight:** The entire `toolPermissionContext` object is immutable after construction -- changes go through `applyPermissionAction` (`a2`) which returns a new context object. This functional update pattern means the permission state is always traceable and can be audited at any point by inspecting the context.

---

## MCP Config Loading in the Action Handler

### Parsing `--mcp-config` Values

For each value in the `--mcp-config <configs...>` array (chunks.189.mjs:1179-1230), the action handler applies a two-phase parse:

**Phase 1: Inline JSON string**
1. Call `j9(value)` -- attempt to parse as JSON
2. If `j9` returns a non-null result (valid JSON), pass to `Ug1({ configObject, filePath: "command line", expandVars: true, scope: "dynamic" })`
3. Extract `config.mcpServers` from the validated result
4. Any validation errors are collected in `errors[]`

**Phase 2: File path**
1. If `j9` returns null (not JSON), treat `value` as a file path
2. Call `UE6(value)` to resolve the absolute path
3. Call `YG1({ filePath, expandVars: true, scope: "dynamic" })` to load and parse the file
4. Extract `config.mcpServers`

Both phases tag the resulting MCP server configs with `scope: "dynamic"` -- this distinguishes them from statically configured servers (user settings, project settings, enterprise config) and is used later to filter servers when enterprise restrictions apply.

**Error handling:** All errors from all configs are collected before any are applied. If any config fails, the entire startup aborts with a combined error message listing all failures.

**Reserved name check:** After merging all `mcpServers` objects, `Object.keys(mergedServers).some(KG1)` checks for reserved MCP server names. `KG1` is the reserved-name predicate -- certain names (like the Chrome MCP server name, `qy`) cannot be used by user-provided configs. This prevents user configs from overriding built-in MCP integrations.

### Enterprise MCP Guard (`pg1()`)

The function `pg1()` checks whether an enterprise MCP configuration is present. When it returns true:

1. **`--strict-mcp-config` is blocked**: The flag cannot coexist with enterprise config because enterprise config IS authoritative -- `--strict-mcp-config` would be redundant at best, conflicting at worst. The process exits with an error.

2. **Dynamic MCP configs are blocked**: The condition `x1 && !hn4(x1)` checks whether any dynamic configs (from `--mcp-config`) were provided AND whether those configs contain anything beyond what enterprise config already includes. If yes, the process exits. This ensures enterprise deployments cannot be augmented with unauthorized MCP servers.

**Why this architecture:** Enterprise organizations need guaranteed control over which external tools Claude Code connects to. By rejecting dynamic configs outright when enterprise config is present, the system enforces a "trust but do not extend" model -- users run exactly what the enterprise configured, no more.

### Chrome Integration (`chunks.189.mjs:1231-1267`)

The Chrome MCP server integration has three activation paths:

**Path 1: Explicit `--chrome` flag AND subscription check**
- `UN6(H.chrome)` -- confirms the `--chrome` flag was explicitly set (not `--no-chrome`)
- `i8()` -- checks user is a claude.ai subscriber (Chrome integration is subscription-only)
- If both true: call `HBA()` which returns `{ mcpConfig, allowedTools, systemPrompt }`
- The `mcpConfig` is merged into the dynamic config map
- The `allowedTools` are added to the allowed tools list
- The `systemPrompt` is prepended to any existing system prompt (Chrome context instructions)

**Path 2: Auto-detect via `cZ1()` (no explicit flag)**
- `H1 = !R1 && cZ1()` -- only runs if `--chrome` path did NOT run
- `cZ1()` probes for the Chrome extension (checks for the Chrome native messaging host, socket files, or extension registry)
- If auto-detected: extracts only `mcpConfig` from `HBA()` and a Chrome-awareness system prompt addendum (`zBA`)
- Does NOT require subscription check (auto-detection is conservative -- just enables the MCP connection)
- Errors are suppressed (`catch (TA) { h(...) }`) -- Chrome auto-detection failure is non-fatal

**Path 3: `--no-chrome` flag**
- Sets `H.chrome` to false, `UN6(false)` returns false
- Both paths above are skipped entirely

**Key insight:** The two-path design separates "user explicitly requested Chrome integration" from "auto-detect Chrome if available." Explicit `--chrome` with a failed setup causes a hard exit (`process.exit(1)`); auto-detected Chrome failing is a soft warning. This protects users who depend on Chrome integration from silent failures while not breaking users who happen to have Chrome installed but don't need the integration.

---

## Complete Action Handler Sequence

### Ordered Execution Map

The full action handler for the root command (`chunks.189.mjs:1027-1947`) executes in this strict order:

```
1.  Destructure all options from Commander's parsed result (H object)
    - debug, dangerouslySkipPermissions, tools, allowedTools, disallowedTools,
      mcpConfig, permissionMode, addDir, fallbackModel, betas, ide, sessionId,
      includePartialMessages, pluginDir, agents, agent, outputFormat, inputFormat,
      verbose, print, init, initOnly, maintenance, disableSlashCommands, etc.

2.  Load plugins if --plugin-dir was specified
    - lL6(pluginDirs)  -- register plugin directories
    - Sv()             -- activate loaded plugins

3.  Check SDK URL conditions
    - Force inputFormat/outputFormat to "stream-json" if --sdk-url
    - Force verbose=true if --sdk-url and verbose not set
    - Force print=true if --sdk-url and print not set

4.  Validate --session-id UUID format and availability
    - Must be valid UUID format
    - Cannot reuse existing session ID without --fork-session

5.  Handle --file downloads
    - Requires session access token (CLAUDE_CODE_SESSION_ACCESS_TOKEN)
    - Downloads file resources and stages them for the session

6.  Validate model/effort combinations
    - "max" effort only in non-interactive mode
    - "max" effort not available for claude.ai subscribers
    - --fallback-model cannot equal --model

7.  Handle --system-prompt / --system-prompt-file (mutual exclusion)
    - If --system-prompt-file: read file contents into systemPrompt
    - Both flags together → error

8.  Handle --append-system-prompt + teammate addendum
    - If --append-system-prompt-file: read file
    - If teammate mode: append TEAMMATE_SYSTEM_PROMPT_ADDENDUM
    - If custom agent type has a prompt: append it

9.  Resolve permission mode via qJq (setupPermissionMode)
    - Priority: dangerously-skip-permissions > --permission-mode > org default > "default"
    - Applies bypassPermissions guard and delegate guard
    - Returns { mode, notification }

10. Parse --mcp-config values (JSON strings or file paths)
    - Two-phase: try JSON parse, fall back to file path
    - Collect all mcpServers with scope: "dynamic"
    - Reserved name check (KG1)
    - Fail-fast if any config has errors

11. Handle Chrome integration
    - Path A: --chrome + subscription → full Chrome MCP + system prompt
    - Path B: auto-detect via cZ1() → Chrome MCP only, soft failure
    - Path C: --no-chrome → skip entirely

12. Enterprise MCP validation (pg1())
    - Reject --strict-mcp-config if enterprise config present
    - Reject dynamic MCP configs if enterprise config present

13. Build toolPermissionContext via KJq (buildToolPermissionContext)
    - Parse --allowed-tools, --disallowed-tools, --tools
    - Handle symlinked CWD
    - Check isBypassPermissionsModeAvailable
    - Add directories from org settings + --add-dir
    - Print any warnings to stderr

14. Start MCP loading (async, may be deferred)
    - If --strict-mcp-config: resolve empty servers immediately
    - If piped stdin: use stdin MCP config (um())
    - Otherwise: load from all config sources (zG1())
    - Note: q6 is a Promise, not yet awaited

15. Validate stream-json consistency
    - --input-format=stream-json requires --output-format=stream-json
    - --sdk-url requires both
    - --replay-user-messages requires both
    - --include-partial-messages requires --print + stream-json output
    - --no-session-persistence requires --print

16. Read stdin via oGz if piped
    - oGz(prompt, inputFormat) → returns effective prompt string
    - For stream-json input: parses the first user message from stdin stream
    - For text input: reads all of stdin as the prompt

17. Load tools: tD(toolPermissionContext) → filteredTools[]
    - Gets all registered tools
    - Filters by permission mode (e.g., plan mode hides write tools)
    - Applies disallowed tool rules

18. Parse --json-schema for structured output
    - Only active in non-interactive mode (ip7 check)
    - Parses JSON schema string via _A()
    - Validates schema and creates a StructuredOutputTool (k_6)
    - Appends to tools array if valid

19. Run setup()
    - Executes Setup hooks (external processes defined in .claude/hooks)
    - Executes SessionStart hooks
    - Initializes background services

20. Resolve model
    - If --model "default": use ML() (default model from settings)
    - Otherwise: use specified model string directly

21. Load commands and agents
    - cZ(currentProfile) → commands (slash commands)
    - TB1(currentProfile) → agents (agent definitions)

22. Parse --agents JSON if provided
    - Merges custom agent definitions from the flag with loaded agents

23. Resolve agent type from --agent flag or settings
    - Finds matching agent in activeAgents
    - Sets agent type in global state

24. Create renderOptions if interactive
    - rGz() → options for Ink/React rendering (terminal size, color depth, etc.)

25. Run showSetupScreens() if interactive
    - Auth screen if not logged in
    - Workspace trust dialog if directory not trusted
    - Permission mode notification if bypassed permission was blocked

26. Initialize MCP servers
    - await q6 (the MCP loading Promise from step 14)
    - Connect to each configured MCP server
    - Load MCP-provided tools and commands

27. Start background services
    - Code indexer, file watcher, metrics tracker

28. Branch: headless vs. interactive
    - If print mode: runHeadless(prompt, ...) → streams output to stdout, exits
    - If interactive: mount React REPL component, enter event loop
```

**Why this ordering matters:**

The sequence is carefully designed around two constraints:
1. **Dependency ordering** -- each step may depend on results from previous steps (e.g., permission mode must be resolved before tools are loaded; tools must be loaded before structured output schema is applied)
2. **Async parallelism** -- step 14 (MCP loading) is deliberately started as a background Promise while steps 15-25 run synchronously. By the time step 26 awaits the MCP Promise, it has typically already completed. This hides network latency behind CPU-bound initialization work.

**Key insight:** The `q6` deferred MCP loading Promise is the most important performance optimization in the startup sequence. MCP server connections can take 200-500ms each. By initiating all connections at step 14 and not awaiting until step 26, the startup appears faster even though the total wall-clock time is similar. The setup hooks (step 19) and command/agent loading (steps 21-23) run in parallel with the MCP connection establishment.

---

## Argument Parsing and Validation Flow

### Key Validations (in order of execution)

1. **Mutual exclusion**: `--system-prompt` and `--system-prompt-file` cannot both be specified
2. **Mutual exclusion**: `--append-system-prompt` and `--append-system-prompt-file` cannot both be specified
3. **Session ID format**: `--session-id` must be a valid UUID; cannot be reused with `--continue`/`--resume` unless `--fork-session` is also specified
4. **Effort level**: `"max"` effort is only available in non-interactive mode and not for Claude.ai subscribers
5. **Fallback model**: `--fallback-model` cannot be the same as `--model`
6. **Stream-JSON consistency**: `--input-format=stream-json` requires `--output-format=stream-json`
7. **SDK-URL requirements**: `--sdk-url` requires both formats to be `stream-json`
8. **Partial messages**: `--include-partial-messages` requires `--print` and `--output-format=stream-json`
9. **Session persistence**: `--no-session-persistence` requires `--print` mode
10. **Enterprise MCP**: When enterprise MCP config is present, `--strict-mcp-config` and dynamic MCP configs are blocked

### Startup Sequence (Timed Phases)

Each phase is instrumented with `EK("phase_name")` for performance profiling:

```
main_function_start
  -> main_warning_handler_initialized
  -> main_client_type_determined
  -> main_before_run
    -> run_function_start
      -> run_commander_initialized
      -> preAction_start
        -> preAction_after_init
        -> preAction_after_migrations
        -> preAction_after_remote_settings
      -> action_handler_start
        -> action_after_input_prompt
        -> action_tools_loaded
        -> action_before_setup
        -> action_after_setup
        -> action_commands_loaded
        -> action_mcp_configs_loaded
        -> action_after_hooks
  -> main_after_run
```
