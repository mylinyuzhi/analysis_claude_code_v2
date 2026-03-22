# CLI Module (01_cli)

> Claude Code v2.1.76 - Command Line Interface documentation hub

## Module Overview

The CLI module handles all command-line interface functionality, from initial process entry to argument parsing, mode detection, and UI component wiring. This is the entry point layer that bridges user input to the React/Ink interactive interface.

---

## Document Index

| Document | Description | Key Symbols |
|----------|-------------|-------------|
| [entry_points.md](./entry_points.md) | CLI entry points, version check, subcommand routing | `cliEntry` (JVz), `mainEntry` (_Vz), `run` (OVz) |
| [argument_parsing.md](./argument_parsing.md) | Commander flag definitions, validation rules, flag types | Commander setup, flag parsers |
| [cli_modes.md](./cli_modes.md) | Mode activation (MCP CLI, ripgrep, Chrome, interactive) | `setupPermissionMode` (qJq) |
| [ui_linkage.md](./ui_linkage.md) | CLI flags to React/Ink component wiring | `REPL` (TUA), `AppStateProvider` (Yj), `createStateStore` (WX1) |
| [tools_integration.md](./tools_integration.md) | CLI-Tools integration, permission context building | Composite logic, `assembleSessionToolSet` |
| [compact_integration.md](./compact_integration.md) | CLI-Compact integration, auto-compact triggers | `autoCompactDispatcher` (sqq), `shouldTriggerAutoCompaction` (CmY) |
| [slash_command_integration.md](./slash_command_integration.md) | CLI-Slash Command integration, skill loading | `--disable-slash-commands`, `getSkills` |
| [hooks_cli_integration.md](./hooks_cli_integration.md) | CLI-Hooks integration, init/maintenance triggers | `--init`, `--init-only`, `--maintenance` |
| [session_management.md](./session_management.md) | CLI-Session management, resume/fork/persistence | `--resume`, `--continue`, `--fork-session`, `--name` |
| [model_selection.md](./model_selection.md) | CLI-Model selection, effort, agents | `--model`, `--effort`, `--agent`, `--betas` |
| [io_formats.md](./io_formats.md) | CLI-I/O formats, SDK mode, structured output | `--output-format`, `--json-schema` |
| [debug_telemetry.md](./debug_telemetry.md) | CLI-Debug/telemetry, verbose mode | `--debug`, `--verbose`, `--debug-file` |
| [mcp_config_cli.md](./mcp_config_cli.md) | CLI-MCP configuration, strict mode | `--mcp-config`, `--strict-mcp-config` |
| [system_reminder_integration.md](./system_reminder_integration.md) | CLI-System Reminder integration, mode-based attachments | `assembleAllAttachments` (_uY), `normalizeAttachmentForAPI` (Ui8) |

---

### Symbol Verification Summary (v2.1.76)

All major CLI symbols have been cross-validated against source code with exact function signatures:

| Symbol | Readable | Location | Signature |
|--------|----------|----------|-----------|
| JVz | cliEntry | chunks.198.mjs:1573 | `async function JVz()` - Top-level entry, version, routing |
| _Vz | mainEntry | chunks.197.mjs:1910 | `async function _Vz()` - Process setup, signal handlers, client type, calls OVz |
| OVz | run | chunks.198.mjs:3 | `async function OVz()` - Commander program setup, flag parsing, action handler |
| WX1 | createStateStore | chunks.85.mjs:1747 | `function WX1(A, q)` |
| Yj | AppStateProvider | chunks.148.mjs:2544 | Provider component |
| Ez | permissionContextReducer | chunks.53.mjs:1224 | `function Ez(A, q)` |
| _v | applyPermissionUpdates | chunks.53.mjs:1296 | `function _v(A, q)` |
| U84 | updateToolPermissionContext | chunks.172.mjs:2829 | `function U84(A, q)` |
| Xk8 | filterToolsByMode | chunks.93.mjs:1568 | `function Xk8({tools, isBuiltIn, isAsync, permissionMode})` |
| sqq | autoCompactDispatcher | chunks.147.mjs:2633 | `async function sqq(A, q, K, Y, z, _)` |
| Ui8 | normalizeAttachmentForAPI | chunks.174.mjs:3 | `function Ui8(A)` |
| k | debugLog | chunks.2.mjs:165 | `function k(A, {level} = {level: "debug"})` |
| d | trackEvent | chunks.2.mjs:275 | `function d(A, q)` |
| t6 | parseBoolean | chunks.1.mjs:4491 | `function t6(A)` |

### Corrected Mappings

| Symbol | Incorrect Mapping | Correct Mapping |
|--------|-------------------|-----------------|
| oGz | ~~streamJsonInputHandler~~ | getReplBridgeError (chunks.192.mjs:1983) - returns `A.replBridgeError` |
| KPA | ~~validateMcpServers~~ | OpenTelemetry trace object (chunks.16.mjs:2445) - `var KPA = oXA()` |

### Verified Source Snippets

**cliEntry (JVz) - Entry Point:**
```javascript
// chunks.198.mjs:1573-1578
async function JVz() {
    let A = process.argv.slice(2);
    if (A.length === 1 && (A[0] === "--version" || A[0] === "-v" || A[0] === "-V")) {
        console.log(`${VERSION} (Claude Code)`);
        return;
    }
    // ... early dispatch for --mcp-cli, --ripgrep, etc.
}
```

**createStateStore (WX1) - State Store Factory:**
```javascript
// chunks.85.mjs:1747-1766
function WX1(A, q) {
    let K = A, Y = new Set;
    return {
        getState: () => K,
        setState: (z) => {
            let _ = K, w = z(_);
            if (Object.is(w, _)) return;
            K = w, q?.({newState: w, oldState: _});
            for (let $ of Y) $();
        },
        subscribe: (z) => { return Y.add(z), () => Y.delete(z); }
    };
}
```

**permissionContextReducer (Ez) - Permission Updates:**
```javascript
// chunks.53.mjs:1224-1294
function Ez(A, q) {
    switch (q.type) {
        case "setMode":
            return {...A, mode: q.mode};
        case "addRules":
            // Add allow/deny/ask rules to destination
        case "replaceRules":
            // Replace all rules for destination
        case "addDirectories":
            // Add working directories
        // ...
    }
}
```

**filterToolsByMode (Xk8) - Tool Filtering:**
```javascript
// chunks.93.mjs:1568-1588
function Xk8({tools: A, isBuiltIn: q, isAsync: K = !1, permissionMode: Y}) {
    return A.filter((z) => {
        if (z.name.startsWith("mcp__")) return !0;
        if (matchesTool(z, PLAN_ALLOWED_TOOLS) && Y === "plan") return !0;
        if (EXCLUDED_TOOLS.has(z.name)) return !1;
        if (!q && NON_BUILTIN_EXCLUDED.has(z.name)) return !1;
        if (K && !ASYNC_ALLOWED_TOOLS.has(z.name)) {
            // Exception for team mode background agents
        }
        return !0;
    });
}
```

---

## Quick Reference

### Entry Point Flow

```
cliEntry (JVz)                    chunks.198.mjs:1573
    │
    ├─► Version check (-v/--version)
    │
    ├─► Special subcommand routing
    │    ├─► --claude-in-chrome-mcp
    │    ├─► --chrome-native-host
    │    ├─► remote-control/bridge
    │    └─► tmux worktree fast path
    │
    └─► mainEntry (_Vz)            chunks.197.mjs:1910
            │
            ├─► Process setup & signal handlers
            │
            ├─► Client type determination (IIFE pattern)
            │
            └─► run (OVz)               chunks.198.mjs:3
                    │
                    ├─► Commander.js program definition
                    │
                    ├─► Flag parsing & validation
                    │
                    ├─► Permission context building
                    │
                    └─► REPL rendering / headless execution
```

### Key CLI Flags

| Flag | Purpose | Documentation |
|------|---------|---------------|
| `-p, --print` | Non-interactive mode | [cli_modes.md](./cli_modes.md) |
| `-n, --name <name>` | Name the session | [session_management.md](./session_management.md) |
| `--allowed-tools` | Tool whitelist | [tools_integration.md](./tools_integration.md) |
| `--disallowed-tools` | Tool blacklist | [tools_integration.md](./tools_integration.md) |
| `--dangerously-skip-permissions` | Bypass permissions | [cli_modes.md](./cli_modes.md) |
| `--disable-slash-commands` | Disable skills | [slash_command_integration.md](./slash_command_integration.md) |
| `--plugin-dir` | Load plugins | [slash_command_integration.md](./slash_command_integration.md) |
| `--resume` | Resume session | [session_management.md](./session_management.md) |
| `--continue` | Continue last session | [session_management.md](./session_management.md) |
| `--fork-session` | New session on resume | [session_management.md](./session_management.md) |
| `--worktree` | Activate git worktree isolation | [argument_parsing.md](./argument_parsing.md) |
| `--model` | Session model | [model_selection.md](./model_selection.md) |
| `--effort` | Effort level (low/medium/high) | [model_selection.md](./model_selection.md) |
| `--agent` | Agent override | [model_selection.md](./model_selection.md) |
| `--output-format` | Output format | [io_formats.md](./io_formats.md) |
| `--json-schema` | Structured output | [io_formats.md](./io_formats.md) |
| `--debug` | Debug mode | [debug_telemetry.md](./debug_telemetry.md) |
| `--verbose` | Verbose mode | [debug_telemetry.md](./debug_telemetry.md) |
| `--mcp-config` | MCP servers | [mcp_config_cli.md](./mcp_config_cli.md) |
| `--init` | Run Setup hooks | [hooks_cli_integration.md](./hooks_cli_integration.md) |
| `--init-only` | Run hooks and exit | [hooks_cli_integration.md](./hooks_cli_integration.md) |
| `--maintenance` | Maintenance hooks | [hooks_cli_integration.md](./hooks_cli_integration.md) |

### New in v2.1.76

| Feature | Flags / Commands | Documentation |
|---------|-----------------|---------------|
| Session naming | `-n, --name <name>` | [session_management.md](./session_management.md) |
| Git worktree support | `--worktree` with `sparsePaths` | [argument_parsing.md](./argument_parsing.md) |
| ExitWorktree tool | Paired with EnterWorktree | [argument_parsing.md](./argument_parsing.md) |
| Auth subcommands | `claude auth login/status/logout` | [entry_points.md](./entry_points.md) |
| Effort simplified | low/medium/high (max removed) | [cli_modes.md](./cli_modes.md) |
| `/effort auto` | Reset effort to auto | [cli_modes.md](./cli_modes.md) |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - State Management, Agent Loop
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - CLI, Compact, Skills, Hooks
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Permissions, Auth, MCP
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Chrome, IDE, Plugin

Key symbols in this module:
- `cliEntry` (JVz) - Top-level entry point at chunks.198.mjs:1573
- `mainEntry` (_Vz) - Main initialization at chunks.197.mjs:1910
- `run` (OVz) - Commander.js setup and action handler at chunks.198.mjs:3
- `getEntrypoint` (aN9) - Returns CLAUDE_CODE_ENTRYPOINT env var
- `permissionContextReducer` (Ez) - Permission context reducer at chunks.53.mjs:1224
- `updateToolPermissionContext` (U84) - Settings merge at chunks.172.mjs:2829
- `filterToolsByMode` (Xk8) - Tool filtering function at chunks.93.mjs:1568
- `assembleAllAttachments` (_uY) - Attachment orchestrator at chunks.147.mjs:3
- `normalizeAttachmentForAPI` (Ui8) - Attachment normalizer at chunks.174.mjs:3
- `isAutoCompactEnabled` (Xh) - Auto-compact check at chunks.147.mjs:2614
- `shouldTriggerAutoCompaction` (CmY) - Trigger condition check at chunks.147.mjs:2620

---

## Integration Points

### With Tools Module (05_tools/)

- **Permission Context** - CLI flags flow into `ToolPermissionContext`
- **Tool Filtering** - `assembleSessionToolSet` merges defaults with MCP tools
- **Delegate Mode** - CLI triggers delegate mode for subagents

See: [tools_integration.md](./tools_integration.md)

### With Compact Module (07_compact/)

- **Auto-Compact Triggers** - CLI state determines when compaction runs
- **Environment Variables** - `DISABLE_COMPACT`, `DISABLE_AUTO_COMPACT`
- **Token Thresholds** - Model-specific threshold configuration

See: [compact_integration.md](./compact_integration.md)

### With Skill System (10_skill_system/)

- **Slash Commands** - CLI controls command availability
- **Plugin Loading** - `--plugin-dir` loads external skills
- **Disable Gate** - `--disable-slash-commands` blocks all commands

See: [slash_command_integration.md](./slash_command_integration.md)

### With Hooks Module (11_hooks/)

- **Init Triggers** - `--init` runs Setup hooks with "init" trigger
- **Init-Only Mode** - `--init-only` runs hooks and exits
- **Maintenance Mode** - `--maintenance` runs maintenance hooks

See: [hooks_cli_integration.md](./hooks_cli_integration.md)

### With Session Management

- **Resume/Continue** - Session persistence and resumption
- **Fork Session** - Create new session from existing
- **PR Integration** - Resume from PR-linked sessions
- **Session Naming** - `-n, --name` flag for named sessions (v2.1.76)

See: [session_management.md](./session_management.md)

### With Model Selection

- **Model Override** - `--model` sets session model
- **Effort Control** - `--effort` controls thinking budget (low/medium/high)
- **Agent Selection** - `--agent` overrides agent type

See: [model_selection.md](./model_selection.md)

### With I/O Formats (SDK Mode)

- **Output Format** - text, json, stream-json
- **Structured Output** - JSON Schema validation
- **Partial Messages** - Real-time streaming chunks

See: [io_formats.md](./io_formats.md)

### With MCP Configuration

- **MCP Servers** - Load servers from JSON
- **Strict Mode** - Ignore other MCP configs
- **Permission Prompts** - MCP-based permission handling

See: [mcp_config_cli.md](./mcp_config_cli.md)

### With Debug/Telemetry

- **Debug Mode** - Category-based filtering
- **Verbose Mode** - Override config settings
- **File Logging** - Write debug to file

See: [debug_telemetry.md](./debug_telemetry.md)

### With System Reminder (04_system_reminder/)

- **Attachment Producers** - CLI flags affect context building
- **Plan Mode** - CLI activates plan mode features
- **Team Mode** - CLI enables team context injection
- **Token Usage** - Session state drives token tracking

See: [system_reminder_integration.md](./system_reminder_integration.md)

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CLI MODULE ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        Entry Points                                  │    │
│  │  cliEntry (JVz) → mainEntry (_Vz) → run (OVz)                       │    │
│  │  Two-phase design: early dispatch for utility modes                 │    │
│  │  entry_points.md                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     Argument Parsing                                 │    │
│  │  Commander.js setup, flag definitions, validation                   │    │
│  │  argument_parsing.md                                                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                       CLI Modes                                      │    │
│  │  Interactive, Print, MCP CLI, Chrome, Teleport                      │    │
│  │  cli_modes.md                                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│          ┌─────────────────────────┼─────────────────────────┐              │
│          │                         │                         │              │
│          ▼                         ▼                         ▼              │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │ Tools           │    │ Compact         │    │ Slash Commands  │         │
│  │ Integration     │    │ Integration     │    │ Integration     │         │
│  │ tools_          │    │ compact_        │    │ slash_command_  │         │
│  │ integration.md  │    │ integration.md  │    │ integration.md  │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│                                    │                                         │
│          ┌─────────────────────────┼─────────────────────────┐              │
│          │                         │                         │              │
│          ▼                         ▼                         ▼              │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │ Hooks CLI       │    │ Session         │    │ Model           │         │
│  │ Integration     │    │ Management      │    │ Selection       │         │
│  │ hooks_cli_      │    │ session_        │    │ model_          │         │
│  │ integration.md  │    │ management.md   │    │ selection.md    │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│                                    │                                         │
│          ┌─────────────────────────┼─────────────────────────┐              │
│          │                         │                         │              │
│          ▼                         ▼                         ▼              │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │ I/O Formats     │    │ Debug/Telemetry │    │ MCP Config      │         │
│  │ io_formats.md   │    │ debug_          │    │ mcp_config_     │         │
│  │                 │    │ telemetry.md    │    │ cli.md          │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│                                    │                                         │
│          ┌─────────────────────────┼─────────────────────────┐              │
│          │                         │                         │              │
│          ▼                         ▼                         ▼              │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │ System          │    │                 │    │                 │         │
│  │ Reminder        │    │                 │    │                 │         │
│  │ Integration     │    │                 │    │                 │         │
│  │ system_         │    │                 │    │                 │         │
│  │ reminder_       │    │                 │    │                 │         │
│  │ integration.md  │    │                 │    │                 │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                       UI Linkage                                     │    │
│  │  CLI flags → React/Ink components (REPL, AppStateProvider)          │    │
│  │  ui_linkage.md                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Cross-Module Flow Diagrams

### CLI → Tools → Permission Context Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                  CLI → TOOLS → PERMISSION CONTEXT FLOW                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Layer                          Tools Layer              Permission      │
│  ──────────                         ───────────              ──────────      │
│                                                                              │
│  ┌───────────────┐                 ┌───────────────┐        ┌──────────────┐│
│  │ CLI Flags     │                 │ getDefaultTools│       │ Permission   ││
│  │               │                 │               │        │ Context      ││
│  │ --allowed-    │ ──────────────► │ (tD)          │ ────► │ {            ││
│  │   tools       │                 │               │        │   mode,      ││
│  │ --disallowed- │                 └───────┬───────┘        │   allowRules,││
│  │   tools       │                         │                │   denyRules, ││
│  │ --permission- │                         ▼                │   askRules   ││
│  │   mode        │                 ┌───────────────┐        │ }            ││
│  │               │                 │ filterToolsBy │        └──────────────┘│
│  └───────────────┘                 │ Mode (Xk8)    │               │        │
│                                    │               │               │        │
│                                    │ • Mode filter │               │        │
│                                    │ • Async filter│               │        │
│                                    │ • Exclusion   │               │        │
│                                    └───────┬───────┘               │        │
│                                            │                       │        │
│                                            ▼                       ▼        │
│                                    ┌───────────────┐        ┌──────────────┐│
│                                    │ Session Tool  │ ◄────  │ Permission   ││
│                                    │ Set           │        │ Rules Apply  ││
│                                    │               │        │              ││
│                                    │ [Tool, ...]   │        │ Ez reducer   ││
│                                    └───────────────┘        └──────────────┘│
│                                                                              │
│  Data Flow:                                                                  │
│  1. CLI flags parsed → permission updates generated                         │
│  2. Updates applied via Ez reducer → permission context built               │
│  3. Default tools loaded → filtered by mode/rules                           │
│  4. Final tool set available for session                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### CLI → Compact → Token Management Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                  CLI → COMPACT → TOKEN MANAGEMENT FLOW                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Layer                          Compact Layer           Token Layer     │
│  ──────────                         ─────────────           ──────────      │
│                                                                              │
│  ┌───────────────┐                 ┌───────────────┐        ┌──────────────┐│
│  │ CLI Flags     │                 │ shouldTrigger │        │ Token Count  ││
│  │               │                 │ AutoCompact   │        │              ││
│  │ --print       │                 │ (CmY)         │ ◄────  │ eW(messages) ││
│  │ (non-interact)│                 │               │        │              ││
│  │               │                 │ Check:        │        │ Current: N   ││
│  │ Env vars:     │                 │ • isAbove     │        │ Threshold: M ││
│  │ DISABLE_COMPACT                 │   Threshold?  │        └──────────────┘│
│  │ DISABLE_AUTO_ │                 │ • Circuit     │               │        │
│  │   COMPACT     │                 │   breaker?    │               │        │
│  └───────────────┘                 └───────┬───────┘               │        │
│         │                                  │                       │        │
│         │                                  ▼                       │        │
│         │                          ┌───────────────┐        ┌──────────────┐│
│         │                          │ autoCompact   │ ────► │ Threshold    ││
│         │                          │ Dispatcher    │        │ Calculation  ││
│         │                          │ (sqq)         │        │              ││
│         │                          │               │        │ oc6(model)   ││
│         │                          │ Path:         │        │              ││
│         │                          │ • SessionMem  │        │ OF(model)    ││
│         │                          │ • Standard    │        │              ││
│         │                          └───────┬───────┘        └──────────────┘│
│         │                                  │                               │
│         └─────────────────────────────────►│                               │
│                                            ▼                               │
│                                    ┌───────────────┐                        │
│                                    │ Compaction    │                        │
│                                    │ Result        │                        │
│                                    │               │                        │
│                                    │ {             │                        │
│                                    │   wasCompacted│                        │
│                                    │   result?,    │                        │
│                                    │   failures?   │                        │
│                                    │ }             │                        │
│                                    └───────────────┘                        │
│                                                                              │
│  Trigger Conditions:                                                         │
│  • isAutoCompactEnabled() = true                                            │
│  • tokenCount >= getAutoCompactThreshold(model)                             │
│  • consecutiveFailures < 3 (circuit breaker)                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### CLI → System Reminder → Attachment Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                  CLI → SYSTEM REMINDER → ATTACHMENT FLOW                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Layer                        Reminder Layer         Attachment Layer   │
│  ──────────                       ──────────────         ────────────────   │
│                                                                              │
│  ┌───────────────┐               ┌───────────────┐      ┌──────────────────┐│
│  │ CLI Flags     │               │ Producer      │      │ Normalized       ││
│  │               │               │ Selection     │      │ Messages         ││
│  │ --plan        │ ────────────► │               │ ───► │                  ││
│  │ --dangerously-│               │ Priority:     │      │ normalizeAttach- ││
│  │   skip-perm   │               │ 1. Mode ctrl  │      │ mentForAPI (Ui8) ││
│  │ --team-name   │               │ 2. Critical   │      │                  ││
│  │ --agent-id    │               │ 3. Team       │      │ Output:          ││
│  │               │               │ 4. Status     │      │ [{content,       ││
│  └───────────────┘               │ 5. Memory     │      │   isMeta: true}] ││
│                                  └───────┬───────┘      └──────────────────┘│
│                                          │                        ▲        │
│                                          ▼                        │        │
│                                  ┌───────────────┐                 │        │
│                                  │ Individual    │                 │        │
│                                  │ Producers     │                 │        │
│                                  │               │                 │        │
│                                  │ • planMode    │─────────────────┘        │
│                                  │ • autoMode    │                          │
│                                  │ • teamContext │                          │
│                                  │ • tokenUsage  │                          │
│                                  │ • budgetUsd   │                          │
│                                  └───────────────┘                          │
│                                                                              │
│  Mode-Based Attachment Selection:                                            │
│  • plan mode → producePlanModeAttachment()                                  │
│  • auto mode → produceAutoModeAttachment()                                  │
│  • team mode → produceTeamContextAttachment() + mailbox                     │
│  • default → standard reminders only                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### CLI → Hooks → Lifecycle Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CLI → HOOKS → LIFECYCLE FLOW                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLI Layer                          Hooks Layer             Lifecycle        │
│  ──────────                         ───────────             ─────────        │
│                                                                              │
│  ┌───────────────┐                 ┌───────────────┐      ┌───────────────┐ │
│  │ CLI Flags     │                 │ Hook Manager  │      │ Hook Types    │ │
│  │               │                 │               │      │               │ │
│  │ --init        │ ──────────────► │ runHooks()    │ ───► │ PreToolUse    │ │
│  │               │                 │               │      │ PostToolUse   │ │
│  │ --init-only   │                 │ Triggers:     │      │ SessionStart  │ │
│  │ (exit after)  │                 │ • init        │      │ PreCompact    │ │
│  │               │                 │ • maintenance │      │ PostCompact   │ │
│  │ --maintenance │                 │ • session     │      │ Stop          │ │
│  │               │                 │ • tool        │      │ Notification  │ │
│  └───────────────┘                 └───────┬───────┘      └───────────────┘ │
│                                            │                               │
│          ┌─────────────────────────────────┼─────────────────────┐         │
│          │                                 │                     │         │
│          ▼                                 ▼                     ▼         │
│  ┌───────────────┐                 ┌───────────────┐    ┌───────────────┐  │
│  │ Session Start │                 │ Tool Use      │    │ Compaction    │  │
│  │               │                 │               │    │               │  │
│  │ SessionStart  │                 │ PreToolUse    │    │ PreCompact    │  │
│  │ hooks run     │                 │ ↓             │    │ ↓             │  │
│  │               │                 │ Tool executes │    │ Compact runs  │  │
│  │ Can configure │                 │ ↓             │    │ ↓             │  │
│  │ permissions   │                 │ PostToolUse   │    │ PostCompact   │  │
│  └───────────────┘                 └───────────────┘    └───────────────┘  │
│                                                                              │
│  Hook Execution Pattern (Async Generator):                                  │
│  1. Hook triggered by CLI flag or event                                     │
│  2. runHooks() loads hook definitions from settings                         │
│  3. Async generator yields each hook result                                 │
│  4. Results processed (block/approve/modify)                                │
│  5. Flow continues or stops based on hook response                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Source Code Locations

| Component | Source File | Key Functions |
|-----------|-------------|---------------|
| Entry points | `chunks.198.mjs` | `cliEntry` (JVz), `run` (OVz) |
| Permission context | `chunks.53.mjs`, `chunks.172.mjs` | `permissionContextReducer` (Ez), `updateToolPermissionContext` (U84) |
| Tool filtering | `chunks.93.mjs` | `filterToolsByMode` (Xk8) |
| Auto-compact | `chunks.147.mjs` | `autoCompactDispatcher` (sqq), `assembleAllAttachments` (_uY) |
| Attachments | `chunks.147.mjs`, `chunks.174.mjs` | `assembleAllAttachments` (_uY), `normalizeAttachmentForAPI` (Ui8) |
| Skill loading | `chunks.168.mjs` | `getSkills`, skill directory discovery |
| REPL component | `chunks.196.mjs` | `REPL`, command filtering |

---

## Cross-References

- **State Management** (15_state_management/) - AppStateProvider, state store
- **Tools** (05_tools/) - Tool definitions, permission rules
- **Compact** (07_compact/) - Compaction implementation details
- **Skill System** (10_skill_system/) - Skill discovery, loading, execution
- **MCP** (06_mcp/) - MCP server integration
- **Permissions** (symbol_index_infra_platform.md) - Permission mode handling
