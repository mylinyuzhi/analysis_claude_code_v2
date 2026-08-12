# Agent-team orchestration and cross-session messaging in Claude Code 2.1.227

This module independently re-derives the current implicit-team lifecycle, transactional teammate
spawn, in-process execution, mailbox transport, cleanup ownership, reachable-agent discovery, and
cross-session `SendMessage` policy. The 2.1.220 report is used only for comparison.

Detailed documents:

- [`list_agents_addressability.md`](list_agents_addressability.md) - roster aggregation and model-visible
  address formats.
- [`cross_session_messaging_policy_and_pins.md`](cross_session_messaging_policy_and_pins.md) - remote
  recipient resolution, confirmed-identity pins, inbound policy merging, and the bounded hold queue.
- [`team_runtime_and_mailbox.md`](team_runtime_and_mailbox.md) - implicit session team, locked roster,
  transactional pane/in-process spawn, persistent runner loop, task pickup, schema-repaired mailbox,
  retry wake, idle lifecycle, and session-owned cleanup.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:
- `listAllReachableAgents` (`aya`) - aggregates session transports.
- `buildListAgentsContext` (`lya`) - loads task/team state.
- `formatReachableAgentsForModel` (`lJb`) - reconciles names and renders addressable rows.
- `listAgentsTool` (`ufS`) - read-only, concurrency-safe model tool.
- `resolveSendMessageRecipient` (`NRn`) - resolves local and remote session identities.
- `gateInboundPeerMessage` (`BJp`) - accepts, holds, or refuses inbound peer messages.
