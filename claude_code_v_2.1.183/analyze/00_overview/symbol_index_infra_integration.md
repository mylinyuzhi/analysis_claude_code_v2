# Symbol Index — Integration Infrastructure (v2.1.156 → v2.1.183)

This index catalogs obfuscated → readable mappings for **integration infrastructure** symbols that changed between v2.1.156 and v2.1.183: LSP, Chrome/Browser, IDE, UI Components, Plugin System, Code Indexing, Shell Parser, and Slash Commands.

For other categories see:

- [`symbol_index_core_execution.md`](symbol_index_core_execution.md) — Agent Loop, Tools, LLM API, Agents, Subagent, State
- [`symbol_index_core_features.md`](symbol_index_core_features.md) — Compact, Auto Memory, Background Agents, Workflow, Agent Team / swarm
- [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) — MCP, Permissions, Sandbox, Auth, Model, Prompt, Telemetry, Remote Control

## File:Line Format

For v2.1.183, the canonical source citation is `cli_inner_pretty.js:<line>` — `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines). v2.1.156 / v2.1.88 citations are tagged as before-pictures.

## Per-feature symbol manifests

The exhaustive per-symbol tables live in the per-feature additions files (linked from [`symbol_index_core_features.md`](symbol_index_core_features.md)).

---

## Module: Agent Team — UI/relay integration

The agent-team subsystem has a small integration surface (the swarm-view pane layout, the `<agent-message>` relay envelope, the `<cross-session-message>` coordinator envelope). Those symbols (e.g. the relay-envelope wrapper `lDa` and its tag const `Nen`) are catalogued under the Agent Team module in [`symbol_index_core_features.md`](symbol_index_core_features.md) and in [`symbol_additions_v2_1_183_agent_team.md`](symbol_additions_v2_1_183_agent_team.md), since they are tightly coupled to the feature rather than to a standalone integration. No new standalone integration symbols (LSP / Chrome / IDE / Plugin) were introduced by the v2.1.178 agent-team redesign.

For the v2.1.143→v2.1.156 integration baseline, see the v2.1.156 tree's [`symbol_index_infra_integration.md`](../../../claude_code_v_2.1.156/analyze/00_overview/symbol_index_infra_integration.md).
