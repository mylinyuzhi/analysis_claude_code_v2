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
- `setupPermissionMode` (qJq) - Resolves permission mode from flags/config
- `loadTools` (tD) - Loads and filters tools based on permission mode

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

**How it works:**
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

## Permission Mode Resolution

### The `qJq` Decision Function

The permission mode is resolved from multiple sources with the following priority:

1. `--permission-mode <mode>` CLI flag (explicit choice)
2. `--dangerously-skip-permissions` flag -> `"bypassPermissions"`
3. Default from settings/config

The resolved mode feeds into `KJq()` which builds the `toolPermissionContext` -- the central permissions configuration that governs which tools can run without user approval.

### Available Permission Modes

From the Commander.js `choices` definition: `ox` contains the valid modes, which include at minimum `"default"`, `"plan"`, `"bypassPermissions"`, `"dontAsk"`, `"acceptEdits"`, and `"delegate"`.

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
