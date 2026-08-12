# LLM core and agent-loop architecture in Claude Code 2.1.227

This module re-derives the runtime spine that every higher-level feature uses: query lifecycle,
explicit turn state, streamed model events, tool admission and draining, recovery, Stop hooks, and
terminal-reason classification.

- [`agent_loop_runtime.md`](agent_loop_runtime.md) - the complete 2.1.227 state machine, streaming-tool
  executor, rollback boundaries, continuation rules, recovery transitions, and comparison with 2.1.220.

The 2.1.220 architecture remains recognizable, but this document does not reuse its obfuscated names.
All entry points below were re-identified in the 2.1.227 target.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:
- `queryEntrypoint` (`jfe`) - lifecycle and terminal classification wrapper.
- `queryWithObserverTap` (`ytb`) - optional observer capture around the unchanged event stream.
- `runQueryTurns` (`K6d`) - central iterative model/tool state machine.
- `StreamingToolExecutor` (`TYs`) - concurrency-aware tool scheduler and ordered result drain.
- `interleaveModelStreamWithToolDrain` (`c8d`) - generation-aware model/tool multiplexer.
- `runToolUse` (`nAt`) - individual tool validation, permission, cancellation, and execution path.
