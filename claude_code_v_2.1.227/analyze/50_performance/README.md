# Performance and resource bounds in 2.1.227

- [`performance_runtime.md`](performance_runtime.md) - full current-build analysis of bounded caches,
  file-read dispatch, LSP document eviction, fork hydration, transcript compaction, delta persistence,
  render pruning, and shutdown drains.
- [`io_stall_reductions.md`](io_stall_reductions.md) - focused 2.1.227 analysis of the conversion of
  missing-file suggestions and at-mention size probes from synchronous filesystem calls to awaited
  operations.

The current-build report revalidates the resource controls inherited from 2.1.220 against the 2.1.227
bundle. It does not assume that an unchanged changelog means an unchanged implementation.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:
- `EditFileReadCache` (`WFd`) - dual-bound content cache.
- `readFileWithLineRange` (`U0e`) - size-aware file-read dispatcher.
- `createLspServerManager` (`EBd`) - 50-document LRU owner.
- `SessionProjectStorage` (`l9p`) - append and local-compaction runtime.
- `hydrateForkContext` (`c9p`) - cache plus in-flight load coalescing.
- `markAbsoluteDescendant` (`RBs`) - render-tree pruning summary.
- `registerPreExitFlush` (`rto`) - ordered async shutdown phase.
- `findSimilarFileAsync` (`Cmt`) - asynchronous directory scan for extension/name suggestions.
- `isFileWithinSizeAsync` (`Fso`) - asynchronous metadata probe used by at-mentions.
- `buildFileAttachment` (`Bkr`) - awaits the size decision before reading or summarizing a file.
