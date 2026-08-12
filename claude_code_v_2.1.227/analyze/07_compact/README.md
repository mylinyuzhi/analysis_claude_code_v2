# Compaction and context accounting in Claude Code 2.1.227

- [`context_window_enforcement.md`](context_window_enforcement.md) - model-window resolution, native-1M
  capping, unknown-model enforcement, escape hatches, and startup warnings.
- [`compaction_runtime.md`](compaction_runtime.md) - current manual/automatic pipeline, hook boundary,
  summary acquisition, prompt-too-long repair, atomic installation, attachment reconstruction,
  precomputed/reactive paths, preservation metadata, and circuit breakers.

The mature pipeline and the post-2.1.220 window-selection changes are both re-derived from the 2.1.227
bundle. The 2.1.220 report is historical comparison only; no old obfuscated symbol is reused here.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:
- `resolveAutoCompactWindow` (`q3`) - precedence and enforcement decision.
- `buildContextCapWarning` (`R$h`) - warns when a requested 200K cap is ineffective.
- `buildUnknownModelWindowNotice` (`NYv`) - explains the assumed cap and escape hatch.
- `compactConversation` (`KGo`) - complete/manual summary-and-install transaction.
- `autoCompactDispatcher` (`H7s`) - threshold, breaker, reactive, and ordinary auto-compact routing.
- `PrecomputedCompactRegistry` (`Fqd`) - pending/ready/failed precompute ownership and sidecar I/O.
