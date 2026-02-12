# Claude Code v2.1.38 - Analysis Overview

## Directory Index (35 modules)

### Core Execution

| # | Directory | Description |
|---|-----------|-------------|
| 00 | `00_overview` | Master index, symbol indices, file index, changelog |
| 01 | `01_cli` | CLI entry point, argument parsing, `--from-pr` flag |
| 03 | `03_llm_core` | LLM API interaction, streaming, token counting |
| 05 | `05_tools` | Tool definitions, execution, PDF page ranges |
| 08 | `08_subagent` | Subagent/Task tool spawning and lifecycle |
| 15 | `15_state_management` | Conversation state, session persistence, PR linking |
| 20 | `20_sdk` | Agent SDK for building custom agents |

### Core Features

| # | Directory | Description |
|---|-----------|-------------|
| 04 | `04_system_reminder` | System reminder injection and formatting |
| 07 | `07_compact` | Conversation compaction, "Summarize from here" |
| 09 | `09_slash_command` | Slash command registry and execution |
| 10 | `10_skill_system` | Skill system, skill definitions, invocation, verifier skills |
| 11 | `11_hooks` | Hook system, lifecycle events, setup hook, event catalog |
| 12 | `12_plan_mode` | Plan mode flow, EnterPlanMode/ExitPlanMode |
| 13 | `13_task_system` | Task management: TaskCreate/TaskUpdate/TaskGet/TaskList with dependencies, ownership, status workflow (renamed from todo_list) |
| 19 | `19_think_level` | Thinking mode configuration and levels |
| 21 | `21_steering` | System prompt steering, tool usage guidance |
| 26 | `26_background_agents` | Background agent execution and management |

### Platform Infrastructure

| # | Directory | Description |
|---|-----------|-------------|
| 06 | `06_mcp` | MCP protocol, OAuth client credentials |
| 17 | `17_telemetry` | Telemetry collection and reporting |
| 18 | `18_sandbox` | Sandbox execution, `.claude/skills` blocking |
| 23 | `23_prompt_cache` | Prompt caching strategy and management |
| 24 | `24_auth` | Authentication and authorization |
| 25 | `25_plugin_system` | Plugin system, marketplace improvements, hook extraction |

### Integration Infrastructure

| # | Directory | Description |
|---|-----------|-------------|
| 02 | `02_ui` | Terminal UI, React Compiler |
| 14 | `14_code_indexing` | Code indexing and search |
| 16 | `16_file_system` | File system operations and watching |
| 22 | `22_ide_integration` | IDE integration, PR review status indicator |
| 27 | `27_lsp_integration` | LSP protocol integration |
| 28 | `28_browser_control` | Chrome/browser control and automation |
| 29 | `29_shell_parser` | Shell command parsing, heredoc security |

### New in v2.1.38

| # | Directory | Description | Introduced |
|---|-----------|-------------|------------|
| 30 | `30_agent_teams` | Multi-agent collaboration: TeamCreate, SendMessage, swarm view | v2.1.32 |
| 31 | `31_auto_memory` | Persistent memory: MEMORY.md, topic files, memory frontmatter | v2.1.32 |
| 32 | `32_keybindings` | Customizable keyboard shortcuts, chord sequences, hot-reload | v2.1.18 |
| 33 | `33_remote_sessions` | Remote session support: WebSocket comms, session hydration | v2.1.27 |
| 34 | `34_fast_mode` | Fast output mode: same model, faster streaming, `/fast` toggle | v2.1.36 |

## Version Delta Summary

- **Base version**: v2.1.7 (30 directories)
- **Current version**: v2.1.38 (+33 chunk files, +2,589 symbols)
- **Renamed**: `13_todo_list` → `13_task_system` (TodoWrite replaced by TaskCreate/TaskUpdate/TaskGet/TaskList)
- **New directories**: 5 (30-34)
- **Total directories**: 35
