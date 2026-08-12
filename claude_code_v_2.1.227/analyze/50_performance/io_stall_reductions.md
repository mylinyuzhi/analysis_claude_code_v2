# Event-loop stall reductions in suggestions and at-mention size checks

## Version result

The 2.1.227 performance bullet is directly visible as two small but important sync-to-async deltas:

- 2.1.220 `findSimilarFile` (`Krt`, `:52167-52178 (220)`) calls `readdirSync`; 2.1.227
  `findSimilarFileAsync` (`Cmt`, `:48690-48703`) awaits `readdir`.
- 2.1.220 `isFileWithinSize` (`qGn`, `:52565-52571 (220)`) calls `statSync`; 2.1.227
  `isFileWithinSizeAsync` (`Fso`, `:49091-49097`) awaits `stat`.
- The at-mention call site changed from `!qGn(...)` at `:517662 (220)` to
  `!(await Fso(...))` at `:593307 (227)`.

This is stronger than a string anchor: the corresponding source operations and their awaited call sites
are both visible in the two bundles.

### Asynchronous Missing-file Suggestions

**What it does:** Searches the missing path's parent directory for a file with the same basename and a
different extension, without blocking all terminal rendering, input, streaming, and background events.

**How it works:**
1. `findSimilarFileAsync` (`Cmt`, `:48690-48703`) splits the requested path into parent directory and
   basename-without-extension.
2. It awaits the filesystem provider's `readdir`, obtaining directory entries asynchronously.
3. It filters for the first entry whose basename matches but whose full path differs from the requested
   path, then returns only the candidate name.
4. Expected not-found errors produce no suggestion; unexpected errors are logged and also degrade to no
   suggestion rather than replacing the original tool error.
5. Callers such as `findAttachmentSuggestion` (`moS`, `:552739-552752`) await this fallback only after
   cheaper/current-directory recovery attempts fail.

**Why this approach:**
- A suggestion is optional diagnostic enrichment. Blocking the JavaScript event loop to compute it gives
  low-priority UX work authority to stall model streaming and keystrokes.
- Asynchronous `readdir` moves the wait to the runtime's filesystem pool while preserving the simple
  single-directory algorithm and identical suggestion semantics.
- Returning the first match is cheaper than ranking every extension and maintains baseline behavior, but
  directory enumeration can still be expensive on huge directories; the difference is that it no longer
  monopolizes the event loop.
- The caller awaits the result because the suggestion belongs in the same error message. Fire-and-forget
  would be faster but could not enrich the current response.

**Key insight:** The optimization does not reduce the amount of filesystem work. It changes who waits:
only the requesting async task pauses, while the process continues servicing interactive and streaming
work.

### Asynchronous At-mention Size Probe

**What it does:** Checks whether an @-mentioned file is below the configured inline-content limit without
performing synchronous metadata I/O on the input-processing path.

**How it works:**
1. `isFileWithinSizeAsync` (`Fso`, `:49091-49097`) awaits `fs.promises.stat` and compares `size` against
   the provided threshold (default 256 KiB).
2. Any stat failure returns false. The caller treats unreadable/missing files like non-inlineable files and
   lets later error handling determine the precise reason.
3. `buildFileAttachment` (`Bkr`, `:593302-593363`) awaits the predicate only for `at-mention` mode.
4. When the file is over the inline threshold and is not a PDF candidate, a second awaited stat records
   the exact size for telemetry and the attachment is omitted.
5. PDF mentions branch into a parallel page-count/stat probe because large PDFs can be represented as a
   reference attachment instead of raw text.

**Why this approach:**
- At-mention expansion is triggered directly by user input and can touch network mounts, FUSE filesystems,
  or cold disks. A supposedly cheap `statSync` has unbounded wall time from the event loop's perspective.
- The false-on-error predicate keeps the hot path simple and safe; detailed errors remain the responsibility
  of the later read/attachment layer.
- The extra stat for telemetry on the oversize branch duplicates metadata work. The code favors clear
  separation between a reusable Boolean guard and diagnostic detail; caching the stat result would save a
  syscall but complicate the helper contract.
- Awaiting preserves ordering: the attachment set is complete before the request is assembled.

**Key insight:** Metadata calls are not inherently non-blocking merely because they read no file content.
On interactive paths, replacing one synchronous `stat` can remove stalls disproportionate to the code
change.

### Failure Semantics Preservation

**What it does:** Keeps suggestions and size checks best-effort so the async conversion cannot turn a
recoverable missing-file condition into a new top-level failure.

**How it works:**
1. Both helpers catch filesystem exceptions inside the helper boundary.
2. The suggestion helper logs unexpected errors and returns `undefined`; the size helper returns `false`.
3. Callers continue with their original error or “too large” flow instead of surfacing the helper failure.
4. No retry loop is introduced, so a slow or failing mount incurs one asynchronous wait per decision.

**Why this approach:**
- Diagnostic enrichment must never be more fatal than the operation it is explaining.
- Preserving baseline return shapes minimizes regression risk in a hot UI/tool path.
- Suppressing the exact stat error can reduce diagnostic specificity, but the subsequent read/validation
  path still reports user-facing access failures where they matter.

**Key insight:** Async conversion is safest when it changes scheduling, not observable decision semantics.
The target preserves the old success/failure contract while removing event-loop ownership of the I/O wait.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `findSimilarFileAsync` (`Cmt`) - non-blocking same-basename suggestion.
- `isFileWithinSizeAsync` (`Fso`) - non-blocking size predicate.
- `findAttachmentSuggestion` (`moS`) - ordered fallback composition.
- `buildFileAttachment` (`Bkr`) - async attachment decision path.
