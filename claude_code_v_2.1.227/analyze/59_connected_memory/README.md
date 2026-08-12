# Connected memory tools

2.1.227 exposes the connected organization/project memory service through three model tools:

- `memory_list` lists connected stores or a lexically paged document directory.
- `memory_read` returns one bounded document plus a public version token.
- `memory_write` replaces a whole document and requires `if_version` compare-and-swap intent.

This is distinct from the older file-backed auto-memory system in `31_auto_memory`. The connected
tools operate through session-bound remote store backends, can expose multiple project/grouping-root
stores, and share content across collaborators.

Documents:

- [`store_resolution_validation_and_tools.md`](store_resolution_validation_and_tools.md) - availability,
  store identities, listing, reads, path/content/secret safety, and permissions.
- [`optimistic_concurrency.md`](optimistic_concurrency.md) - public version tokens, create/update
  preconditions, conflict recovery, and the single retry for spurious backend conflicts.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:
- `validateMemorySessionAvailability` (`vEa`) - pause/trust/service gate.
- `resolveMemoryStore` (`SPr`) - public ID and write-capability resolution.
- `validateMemoryPath` (`YKt`) - bounded path and reserved-segment policy.
- `memoryListTool` (`pKp`) - store discovery and paged listing.
- `memoryReadTool` (`_Kp`) - bounded document read.
- `memoryWriteTool` (`HKp`) - guarded full replacement.
- `computePublicMemoryVersion` (`tBe`) - 12-hex content version.
- `updateMemoryDocumentCAS` (`CiS`) - backend precondition and retry logic.
