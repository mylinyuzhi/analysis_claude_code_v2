# Tool architecture in Claude Code 2.1.227

This module re-analyzes the common tool contract, alias lookup, input validation, deferred loading,
ToolSearch policy, execution scheduling, and the guarded `EndConversation` path. Feature-specific tools
remain documented in their owning modules.

- [`tool_registry_deferred_loading_and_execution.md`](tool_registry_deferred_loading_and_execution.md) -
  registry and aliases, deferred-tool selection, ToolSearch ranking and enablement, execution boundaries,
  and 2.1.220-to-2.1.227 changes.

Related specialized analyses:

- [`../30_agent_team/`](../30_agent_team/README.md) - `ListAgents` and `SendMessage`.
- [`../49_sandbox/`](../49_sandbox/README.md) - sandboxed shell credential handling.
- [`../50_performance/`](../50_performance/README.md) - file suggestion and attachment I/O.
- [`../58_persistent_goals/`](../58_persistent_goals/README.md) - `ProposeGoal`.
- [`../59_connected_memory/`](../59_connected_memory/README.md) - connected-memory tools.
- [`../60_self_hosted_runner/`](../60_self_hosted_runner/README.md) - self-hosted operator tools.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:
- `findToolByNameOrAlias` (`yu`) - cached canonical-name and alias lookup.
- `decorateToolDefinition` (`Ri`) - supplies common default tool behavior.
- `isDeferredTool` (`zse`) - deferred-loading policy.
- `ToolSearchTool` (`SHn`) - read-only schema discovery surface.
- `searchDeferredTools` (`j7d`) - direct selection and ranked keyword matching.
- `isToolSearchEnabled` (`wHn`) - model/provider/mode enablement decision.
- `isEndConversationToolEnabled` (`Rti`) - model, flag, build, and entrypoint gate.
