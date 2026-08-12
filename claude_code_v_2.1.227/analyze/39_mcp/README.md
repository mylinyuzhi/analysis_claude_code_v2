# MCP architecture in Claude Code 2.1.227

The MCP subsystem is a policy-governed runtime rather than a thin protocol client. It merges server
configuration from several trust scopes, validates and filters it, starts connections asynchronously,
discovers tools/prompts/resources, projects tools through Claude Code's permission engine, and keeps
the model's view synchronized as servers connect or disappear.

- [`mcp_runtime_configuration_auth_and_discovery.md`](mcp_runtime_configuration_auth_and_discovery.md) -
  configuration precedence, dual runtimes, connection/discovery state, deferred tools, OAuth,
  roots, call execution, diagnostics, and the 2.1.221-2.1.227 hardening assessment.

The 2.1.220 report remains useful historical context, but this directory re-derives the current
architecture from the 2.1.227 bundle. In particular, it does not transfer obfuscated identifiers from
the older build.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:
- `selectMcpSdkGeneration` (`w4`) - latches the v1/v2 runtime arm.
- `getMcpClientModule` (`P4_`) - generation-aware client-module accessor with a tree-ID tripwire.
- `parseMcpConfig` (`_Hr`) - validates, expands, and classifies server configuration.
- `createMcpStartupCoordinator` (`nNh`) - separates required/eager and deferrable startup work.
- `connectToMcpServer` (`WNo`) - policy-checked transition from cached/pending state to live client.
- `projectMcpTools` (`V3s`) - validates schemas and converts MCP tools to Claude Code tools.
- `computeDeferredToolDelta` (`rJs`) - announces changes in the deferred MCP tool pool.
- `McpOAuthProviderV1` (`vwr`) and `McpOAuthProviderV2` (`Ywr`) - token storage, refresh, and recovery.
- `callMcpTool` (`wBo`) - hard timeout, idle watchdog, progress, and transport-loss handling.
- `callMcpToolWithAutoBackground` (`qB_`) - promotes a safe long-running call to an `mcp_task`.
