# CLI Module (01_cli)

> Claude Code v2.1.76 - Command Line Interface documentation hub

## Module Overview

The CLI module handles all command-line interface functionality, from initial process entry to argument parsing, mode detection, and UI component wiring. This is the entry point layer that bridges user input to the React/Ink interactive interface.

---

## Document Index

| Document | Description | Key Symbols |
|----------|-------------|-------------|
| [entry_points.md](./entry_points.md) | CLI entry points, version check, subcommand routing | `cliEntry` (qZz), `mainEntry` (nGz), `determineEntrypoint` (iGz) |
| [argument_parsing.md](./argument_parsing.md) | Commander flag definitions, validation rules, flag types | `commanderSetup` (aGz), flag parsers |
| [cli_modes.md](./cli_modes.md) | Mode activation (MCP CLI, ripgrep, Chrome, interactive) | `run` (aGz), `setupPermissionMode` (qJq) |
| [ui_linkage.md](./ui_linkage.md) | CLI flags to React/Ink component wiring | `REPL` (TUA), `AppStateProvider` (u_) |
| [tools_integration.md](./tools_integration.md) | CLI-Tools integration, permission context building | `buildToolPermissionContext` (KJq), `assembleSessionToolSet` (YP6) |
| [compact_integration.md](./compact_integration.md) | CLI-Compact integration, auto-compact triggers | `autoCompactDispatcher` (fs4), `shouldAutoCompact` (amY) |
| [slash_command_integration.md](./slash_command_integration.md) | CLI-Slash Command integration, skill loading | `--disable-slash-commands`, `getSkills` |
| [hooks_cli_integration.md](./hooks_cli_integration.md) | CLI-Hooks integration, init/maintenance triggers | `--init`, `--init-only`, `--maintenance` |
| [session_management.md](./session_management.md) | CLI-Session management, resume/fork/persistence | `--resume`, `--continue`, `--fork-session`, `--name` |
| [model_selection.md](./model_selection.md) | CLI-Model selection, effort, agents | `--model`, `--effort`, `--agent`, `--betas` |
| [io_formats.md](./io_formats.md) | CLI-I/O formats, SDK mode, structured output | `--output-format`, `--json-schema` |
| [debug_telemetry.md](./debug_telemetry.md) | CLI-Debug/telemetry, verbose mode | `--debug`, `--verbose`, `--debug-file` |
| [mcp_config_cli.md](./mcp_config_cli.md) | CLI-MCP configuration, strict mode | `--mcp-config`, `--strict-mcp-config` |
| [system_reminder_integration.md](./system_reminder_integration.md) | CLI-System Reminder integration, mode-based attachments | `assembleAttachments` (phY), `normalizeAttachmentForAPI` (K2z) |

---

## Quick Reference

### Entry Point Flow

```
cliEntry (qZz)                     chunks.198.mjs:167
    │
    ├─► Version check
    │
    ├─► determineEntrypoint (iGz)  sets CLAUDE_CODE_ENTRYPOINT env var
    │
    └─► mainEntry (nGz)            chunks.197.mjs:931
            │
            ├─► Client type detection
            │
            ├─► Settings loading
            │
            └─► run (aGz)          chunks.197.mjs:999
                    │
                    ├─► Commander setup
                    │
                    ├─► Argument parsing
                    │
                    ├─► Permission context building
                    │
                    └─► REPL rendering
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
- `cliEntry` (qZz) - Top-level entry point
- `mainEntry` (nGz) - Main function after entry dispatch
- `run` (aGz) - Commander setup and mode dispatch
- `buildToolPermissionContext` (KJq) - Tool permission context builder
- `assembleSessionToolSet` (YP6) - Session tool set assembly
- `autoCompactDispatcher` (fs4) - Auto-compact orchestrator

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
│  │  cliEntry (qZz) → mainEntry (nGz) → run (aGz)                       │    │
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

## Source Code Locations

| Component | Source File | Key Functions |
|-----------|-------------|---------------|
| Entry points | `chunks.198.mjs` | `cliEntry`, `determineEntrypoint` |
| Main function | `chunks.197.mjs` | `mainEntry`, `run`, `commanderSetup` |
| Permission context | `chunks.172.mjs` | `buildToolPermissionContext` |
| Tool assembly | `chunks.141.mjs` | `assembleSessionToolSet`, `getDefaultTools` |
| Auto-compact | `chunks.147.mjs` | `autoCompactDispatcher`, `shouldAutoCompact` |
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
