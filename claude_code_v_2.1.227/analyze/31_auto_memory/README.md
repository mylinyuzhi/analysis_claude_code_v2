# Auto-memory architecture in Claude Code 2.1.227

Auto-memory combines prompt-time recall, bounded post-turn extraction, asynchronous cross-session
consolidation (“Dream”), write-time integrity checks, and a session pause membrane.

- [`auto_memory_runtime.md`](auto_memory_runtime.md) - enablement and path resolution, prompt loading,
  extraction scheduling, tool confinement, Dream locking, pause enforcement, and write integrity.

Connected project/team stores are analyzed separately in
[`../59_connected_memory/`](../59_connected_memory/README.md); this module explains how their indexes
are selected and injected into the broader memory prompt.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:
- `isAutoMemoryEnabled` (`Jh`) - process/session/model/settings enablement ladder.
- `getAutoMemoryDirectory` (`ym`) - normalized cached memory root.
- `buildMemorySystemPrompt` (`sIn`) - chooses personal, team, connected-store, and lean prompt forms.
- `initExtractMemories` (`$Ys`) - incremental extraction scheduler.
- `createAutoMemoryToolPolicy` (`H4o`) - forked-agent permission membrane.
- `initAutoDream` (`q8d`) - cross-session consolidation scheduler.
- `tryAcquireDreamLock` (`tZ_`) - PID-plus-mtime lease acquisition.
- `stampMemoryFrontmatter` (`DBo`) - provenance/timestamp rewrite with a surgical fallback.
- `buildMemoryIndexSizeNotice` (`gGo`) - warning/error decision at 80%/100% of the load cap.
