# Claude Code v2.1.76 - Analysis Overview

## Directory Index (36 modules)

### Core Execution

| # | Directory | Description |
|---|-----------|-------------|
| 00 | `00_overview` | Master index, symbol indices, file index, changelog |
| 01 | `01_cli` | CLI entry point, argument parsing, `-n`/`--name` flag, auth subcommands |
| 03 | `03_llm_core` | LLM API interaction, streaming, token counting, `modelOverrides` |
| 05 | `05_tools` | Tool definitions, execution, CronCreate/Delete/List, ExitWorktree |
| 08 | `08_subagent` | Subagent/Task tool spawning and lifecycle, `isolation: worktree` |
| 15 | `15_state_management` | Conversation state, session persistence, feedback survey |
| 20 | `20_sdk` | Agent SDK for building custom agents, SDKRateLimitInfo types |

### Core Features

| # | Directory | Description |
|---|-----------|-------------|
| 04 | `04_system_reminder` | System reminder injection and formatting |
| 07 | `07_compact` | Conversation compaction, circuit breaker, PostCompact hook |
| 09 | `09_slash_command` | Slash command registry: `/color`, `/effort`, `/loop`, `/copy`, `/context` |
| 10 | `10_skill_system` | Skill system, `/claude-api` skill, `${CLAUDE_SKILL_DIR}` variable |
| 11 | `11_hooks` | Hook system: PostCompact, Elicitation, ConfigChange, HTTP hooks |
| 12 | `12_plan_mode` | Plan mode flow, `/plan` with description, EnterPlanMode/ExitPlanMode |
| 13 | `13_task_system` | Task management: TaskCreate/TaskUpdate/TaskGet/TaskList with dependencies |
| 19 | `19_think_level` | Effort levels: low/medium/high (removed max), `/effort auto` |
| 21 | `21_steering` | System prompt steering, `includeGitInstructions` setting |
| 26 | `26_background_agents` | Background agent execution, kill preserves partial results |
| 36 | `36_loop_cron` | `/loop` command and CronCreate/Delete/List scheduling tools |

### Platform Infrastructure

| # | Directory | Description |
|---|-----------|-------------|
| 06 | `06_mcp` | MCP protocol, OAuth, MCP Elicitation (v2.1.76) |
| 17 | `17_telemetry` | Telemetry collection, feedback survey, fast mode speed attribute |
| 18 | `18_sandbox` | Sandbox execution, `enableWeakerNetworkIsolation` setting |
| 23 | `23_prompt_cache` | Prompt caching strategy and management |
| 24 | `24_auth` | Authentication: `claude auth login/status/logout` subcommands |
| 25 | `25_plugin_system` | Plugin system: `git-subdir` source, `pluginTrustMessage`, `pathPattern` |

### Integration Infrastructure

| # | Directory | Description |
|---|-----------|-------------|
| 02 | `02_ui` | Terminal UI, React Compiler, `/color` command, CJK layout fix |
| 14 | `14_code_indexing` | Code indexing and search |
| 16 | `16_file_system` | File system operations and watching |
| 22 | `22_ide_integration` | IDE integration, VSCode spark icon, MCP management dialog |
| 27 | `27_lsp_integration` | LSP protocol integration, `startupTimeout`, gitignore exclusions |
| 28 | `28_browser_control` | Chrome/browser control and automation |
| 29 | `29_shell_parser` | Shell command parsing, heredoc security |

### Newer Modules

| # | Directory | Description | Introduced |
|---|-----------|-------------|------------|
| 30 | `30_agent_teams` | Multi-agent collaboration: TeamCreate, SendMessage, swarm view | v2.1.32 |
| 31 | `31_auto_memory` | Persistent memory: MEMORY.md, `autoMemoryDirectory`, timestamps | v2.1.32 |
| 32 | `32_keybindings` | Customizable keyboard shortcuts, chord sequences, hot-reload | v2.1.18 |
| 33 | `33_remote_sessions` | Remote session support: WebSocket comms, `--name` option | v2.1.27 |
| 34 | `34_fast_mode` | Fast output mode: same model, faster streaming, `/fast` toggle | v2.1.36 |
| 35 | `35_rewind` | Conversation rewind and checkpointing | v2.1.38 |
| 36 | `36_loop_cron` | `/loop` command + CronCreate/Delete/List scheduling tools | v2.1.71 |

## Version Delta Summary

- **Base version**: v2.1.38 (35 directories, 190 chunks)
- **Current version**: v2.1.76 (+8 chunk files, ~20,866 symbols)
- **New directory**: `36_loop_cron` (/loop command + Cron tools)
- **Total directories**: 36
- **Total chunks**: 198

## Key Changes from v2.1.38

| Feature | Version | Impact |
|---------|---------|--------|
| `/loop` + CronCreate/Delete/List tools | v2.1.71 | Recurring task scheduling |
| ExitWorktree tool, `/plan` description arg | v2.1.72 | Worktree workflow improvements |
| Effort simplified to low/medium/high | v2.1.72 | Removed `max` effort level |
| `modelOverrides` setting | v2.1.73 | Per-model configuration overrides |
| `autoMemoryDirectory` setting | v2.1.74 | Custom memory file location |
| ConfigChange hook | v2.1.74 | React to settings changes |
| `/color` command, session name display | v2.1.75 | UI improvements |
| 1M context Opus 4.6 | v2.1.75 | Extended context window |
| MCP Elicitation | v2.1.76 | Servers request structured input mid-task |
| PostCompact hook | v2.1.76 | Hook fires after compaction completes |
| `-n`/`--name` CLI flag | v2.1.76 | Session display naming |
| Auto-compact circuit breaker (3 attempts) | v2.1.76 | Prevents infinite compaction loops |
| HTTP hooks | v2.1.63 | POST JSON to URL, receive JSON back |
| `/copy` command | v2.1.59 | Copy conversation to clipboard |
| Auto-memory last-modified timestamps | v2.1.59 | Memory freshness tracking |
