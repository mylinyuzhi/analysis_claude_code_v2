# Symbol Index — Platform Infrastructure (v2.1.156 → v2.1.183)

This index catalogs obfuscated → readable mappings for **platform infrastructure** symbols that changed between v2.1.156 and v2.1.183: MCP, Permissions, Sandbox, Auth, Model resolution/selection, Prompt building, Telemetry, and Remote Control.

For other categories see:

- [`symbol_index_core_execution.md`](symbol_index_core_execution.md) — Agent Loop, Tools, LLM API, Agents, Subagent, State
- [`symbol_index_core_features.md`](symbol_index_core_features.md) — Compact, Auto Memory, Background Agents, Workflow, Agent Team / swarm
- [`symbol_index_infra_integration.md`](symbol_index_infra_integration.md) — LSP, Chrome, IDE, UI, Plugin, Code Indexing, Shell Parser, Slash Commands

## File:Line Format

For v2.1.183, the canonical source citation is `cli_inner_pretty.js:<line>` — `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines). v2.1.156 / v2.1.88 citations are tagged as before-pictures.

## Per-feature symbol manifests

The exhaustive per-symbol tables live in the per-feature additions files (linked from [`symbol_index_core_features.md`](symbol_index_core_features.md)).

---

## Module: Agent Team — Backend Registry & Permission Bridge (platform-side)

The in-process-vs-pane execution-mode split and the permission bridge are platform infrastructure the agent-team feature depends on. The abstraction is **carried over unchanged** from v2.1.156 (only the tmux spawn mechanic changed — see [`symbol_index_core_features.md`](symbol_index_core_features.md), `a3n`). The exhaustive table is in [`symbol_additions_v2_1_183_agent_team.md`](symbol_additions_v2_1_183_agent_team.md) section 5.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `rWe` | `isInProcessEnabled` (in-process vs pane decision; v2.1.156 `ma`) | cli_inner_pretty.js:422425 | function |
| `Aje` | `getTeammateMode` (mode snapshot; `Hxe ?? "in-process"`) | cli_inner_pretty.js:293813 | function |
| `eLe` | `detectBackend` (tmux-inside / iTerm2 detection; emits `swarm_backend_detect`; v2.1.156 `jLH`) | cli_inner_pretty.js:422314 | function |
| `Wdo` | `markInProcessFallback` (sticky pane-failure fallback bit) | cli_inner_pretty.js:422419 | function |
| `_F` | `backendRegistry` (BackendRegistry singleton; v2.1.156 `NS`) | cli_inner_pretty.js:422467 | variable |
| `Ndo` | `TmuxBackend` (`type="tmux"`; pane create/respawn/kill; v2.1.156 `ZU6`) | cli_inner_pretty.js:421879 | class |
| `eDp` | `createTeammateCanUseTool` (permission bridge; ask→dialog-or-mailbox; v2.1.156 `OT_`) | cli_inner_pretty.js:420713 | function |

## Module: Remote Control (coordinator cross-session peers)

Coordinator mode's cross-session peers use the Remote Control transport (`uds:` same-machine, `bridge:` cross-machine). The socket-address parsing/validation symbols are catalogued under the Agent Team module in [`symbol_index_core_features.md`](symbol_index_core_features.md) (`LLa`, `Lhe`). For the v2.1.143→v2.1.156 platform baseline, see the v2.1.156 tree's [`symbol_index_infra_platform.md`](../../../claude_code_v_2.1.156/analyze/00_overview/symbol_index_infra_platform.md).
