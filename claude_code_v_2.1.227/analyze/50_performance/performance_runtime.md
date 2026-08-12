# Performance and Resource-Bound Architecture in 2.1.227

## Scope

This document describes the performance architecture that is present in the 2.1.227 bundle, not only
the two changes named by the 2.1.227 changelog. The current runtime combines bounded caches, size-aware
file reading, LSP lifecycle limits, transcript compaction, fork-context coalescing, render-tree pruning,
and ordered shutdown drains. The focused 2.1.227 sync-to-async changes remain documented in
[`io_stall_reductions.md`](./io_stall_reductions.md).

The important design theme is that no single mechanism is expected to solve all resource problems.
Claude Code uses different controls for different cost shapes:

- LRU eviction for reusable objects with temporal locality.
- Byte caps in addition to entry caps when values vary greatly in size.
- Streaming for inputs whose total size should not be resident at once.
- In-flight promise coalescing for duplicate asynchronous loads.
- Dirty/subtree flags for repeated frame rendering.
- Append-only persistence plus guarded compaction for crash tolerance.
- Bounded drains for data that matters at process exit.

## Runtime algorithms

### Mtime-validated, dual-budget edit cache

**What it does:** Reuses file contents during edit validation while bounding both the number of cached
paths and the total amount of retained text.

**How it works:**
1. `EditFileReadCache` (`WFd`, `:325469-325506`) owns an LRU cache with two limits: 1,000 entries
   (`E5_`) and 16 MiB of character content (`v5_`).
2. `readFile` first performs `statSync`. If stat fails, it removes any stale cache entry before
   propagating the filesystem error.
3. A cached entry is reusable only when its recorded `mtimeMs` equals the current file metadata.
4. On a miss or mtime change, the cache detects the encoding, reads the file, normalizes CRLF to LF,
   and stores the new content, encoding, and modification time.
5. LRU recency is updated by lookup, so frequently edited files survive while cold files are evicted.
6. Explicit `invalidate` and `clear` operations cover writes and lifecycle resets that cannot safely
   wait for an mtime mismatch.

**Why this approach:**
- Entry-only limits are unsafe because one source file can be orders of magnitude larger than another;
  byte-only limits are awkward for workloads containing many tiny files. Applying both bounds handles
  both distributions.
- Mtime validation is cheaper than rereading and comparing content on every edit, although filesystems
  with coarse timestamp resolution remain a theoretical trade-off.
- Synchronous reads remain acceptable here because this is the edit execution path, where the content
  itself is required before replacement. Optional UI diagnostics use asynchronous I/O instead, as
  described in `io_stall_reductions.md`.
- A content hash would detect same-mtime replacements more robustly, but calculating it still requires a
  read and defeats most of the cache's benefit.

**Key insight:** The effective bound is the intersection of an object-count limit and a content-size
limit. This prevents both “many tiny files” and “a few huge files” from turning a useful edit cache into
an accidental long-session memory store.

### Size-aware file-read dispatch and selected-range enforcement

**What it does:** Chooses between whole-file and streaming reads, while separately limiting total input
size and the amount of selected text returned to the model.

**How it works:**
1. `readFileWithLineRange` (`U0e`, `:209834-209858`) asynchronously stats the path and rejects
   directories with an explicit `EISDIR` shape.
2. Regular files below 10 MiB (`jc_`) take the whole-file path. If a non-truncating maximum is already
   exceeded, the function rejects before allocating the file string.
3. Larger regular files, non-regular inputs, and range-oriented reads use `streamLinesFromFile` (`Kc_`,
   `:210021-210053`) with 512 KiB chunks.
4. The stream tracks total bytes, selected bytes, current line, partial UTF-8 text, and BOM handling.
5. A 128 MiB hard cap (`zc_`) protects non-regular inputs whose metadata cannot provide a trustworthy
   size. `FileTooLargeError` (`FSr`) represents whole-input overflow.
6. A distinct `SelectedRangeTooLargeError` (`USr`) fires when requested lines exceed the caller's output
   budget, including the pathological case of one enormous line.
7. Truncating callers stop selecting at the byte budget and return `truncatedByBytes`; strict callers
   fail. Thus display/tool-result truncation and correctness-sensitive reads do not share ambiguous
   semantics.

**Why this approach:**
- Always reading the whole file is simpler but creates peak-memory and latency spikes for large files.
  Always streaming adds overhead to the common small-file case.
- Separating total-input and selected-output limits matters: a small requested range can safely come
  from a large regular file, while a single huge line can violate the output budget even when the file
  itself is allowed.
- Returning a truncation flag is appropriate for presentation paths; throwing is appropriate when a
  caller could otherwise mistake incomplete content for the complete file.
- The non-regular hard cap prevents pipes and device-like inputs from becoming unbounded streams, at the
  cost of refusing unusually large special-file content.

**Key insight:** The dispatcher optimizes the normal case without weakening worst-case bounds. File size,
selected size, and output semantics are treated as three independent decisions.

### LSP open-document LRU lifecycle

**What it does:** Limits the number of documents kept open across language servers while preserving the
protocol-level close notification for evicted files.

**How it works:**
1. `createLspServerManager` (`EBd`, `:321641-321829`) maintains server instances, extension routing,
   document versions, and an insertion-ordered map of open document URI to owning server.
2. Touching a URI deletes and reinserts it, making map order encode least-to-most-recent use.
3. After a touch, the eviction loop removes oldest entries until the map holds at most 50 documents
   (`l3_`, `:321831`).
4. If the owning server is still running, eviction sends `textDocument/didClose` for the removed URI.
5. Notification failure is logged and reported, but it does not restore the local entry or stop other
   LSP work.
6. A later access can reopen the evicted document with the then-current content and version state.

**Why this approach:**
- An unbounded open-document set makes memory proportional to every file touched during a long session,
  even when most files will never be queried again.
- LRU is a good fit because editing and navigation exhibit strong temporal locality; FIFO would evict a
  frequently used file merely because it was opened early.
- Sending `didClose` preserves server-side lifecycle semantics. Silently dropping the local reference
  would leave the language server retaining the very state the limit is meant to release.
- Close is best-effort because a failed or stopping LSP must not make the entire manager unusable.

**Key insight:** Eviction is a distributed lifecycle operation, not just a JavaScript `Map.delete`.
Memory is actually released only when both Claude Code and the language server agree that the document
is closed.

### Fork-context cache with in-flight request coalescing

**What it does:** Avoids repeatedly reconstructing the same parent transcript prefix when agents or
forked sessions request shared ancestry.

**How it works:**
1. `hydrateForkContext` (`c9p`, `:539013-539020`) checks the completed-value cache by the parent's last
   UUID. A hit is deleted and reinserted to refresh LRU order.
2. If no completed value exists, it checks `forkContextHydrationsInFlight`. Concurrent callers for the
   same UUID receive the same promise instead of starting duplicate transcript loads.
3. `loadForkContextPrefix` (`ltS`, `:539022-539046`) loads the parent session, locates the referenced
   message, walks its ancestry, removes sidechain markers, and materializes a clean prefix.
4. It accounts for the serialized byte length of every retained message and inserts the result into the
   completed cache.
5. Oldest entries are evicted until the cache is within both four entries (`stS`) and 16 MiB (`atS`). At
   least the newly loaded entry is retained even if it alone exceeds the byte budget.
6. A `finally` handler removes the in-flight promise on success or failure so a transient failure does
   not poison all future requests.

**Why this approach:**
- A normal memo cache removes repeated sequential work but does not stop a burst of simultaneous callers
  from launching the same expensive load. The second in-flight map closes that gap.
- Byte accounting is necessary because transcript prefixes vary dramatically in size; the four-entry
  cap alone would not provide a meaningful memory bound.
- Retaining one oversize result avoids a load/evict/load loop for a currently required prefix. This is a
  deliberate soft byte bound rather than an absolute allocation ceiling.
- Keys use the last UUID rather than only the session ID because different forks of one session may need
  different ancestry cut points.

**Key insight:** There are two caches with different time domains: promises deduplicate work while a load
is running, and values deduplicate work after it completes.

### Append-only transcript with guarded local compaction

**What it does:** Keeps session persistence cheap and crash-tolerant during normal operation, then removes
superseded records without losing live ancestry, file history, or concurrently appended data.

**How it works:**
1. `SessionProjectStorage` (`l9p`, `:537988-539933`) queues append operations; ordinary messages and
   metadata are written as JSONL rather than rewriting the transcript.
2. Local compaction is gated by `CLAUDE_CODE_TRANSCRIPT_LOCAL_GC` or a default-off feature flag through
   `isTranscriptLocalGcEnabled` (`mFh`, `:935431-935433`).
3. `performCompactTranscript` (`l9p.performCompactTranscript`, `:538434-538701`) skips files below 5 MiB,
   snapshots samples from the beginning, middle, and end, and refuses a snapshot whose captured end is
   not newline-aligned.
4. A streaming scan classifies entries: transcript ancestry, always-retained accumulators, last-wins
   metadata, file-history snapshots/deltas, and compaction preservation boundaries.
5. It marks live ancestors and associated file-history records, writes retained lines to a temporary
   file, and re-emits the winning metadata at the boundary.
6. Before replacement it rechecks inode, size, and sampled bytes. If the source changed unexpectedly,
   compaction aborts instead of installing a stale snapshot.
7. Bytes appended after the initial stat are copied only through the last complete newline, the temporary
   file is synced, and replacement uses the safe rename helper.
8. A poor compaction ratio raises the next backstop threshold; successful replacement re-appends current
   session metadata and reports before/after byte counts.

**Why this approach:**
- Append-only JSONL makes each turn cheap and leaves useful partial data after crashes. Periodic full
  rewrites alone would increase write amplification and corruption risk.
- Compaction cannot simply keep the newest N lines: parent UUID chains and file-history attachments make
  liveness graph-shaped rather than positional.
- Sampling plus inode/size checks is cheaper than hashing a large transcript multiple times. It is not a
  formal transaction, but it detects the important concurrent-writer races at much lower I/O cost.
- The feature remains gate-controlled because local GC trades implementation complexity and an extra
  rewrite for disk savings; append-only behavior is the conservative default.

**Key insight:** This is mark-and-copy compaction with optimistic concurrency validation. The clever part
is preserving semantic reachability while allowing complete lines appended during the compaction window
to survive.

### Delta-based file-history persistence

**What it does:** Records changed file checkpoints as small delta entries tied to a snapshot message,
instead of repeatedly serializing the complete file-history state.

**How it works:**
1. `insertFileHistoryDelta` (`JWs`, `:539060-539068`) builds a `file-history-delta` record containing the
   triggering message, snapshot message, tracked path, backup reference, and timestamp.
2. `SessionProjectStorage.insertFileHistoryDelta` appends the entry through the same serialized write
   queue as transcript records.
3. During reads, snapshot state is reconstructed by applying the ordered deltas associated with the
   relevant message chain.
4. During local transcript compaction, delta line indexes are grouped by message ID and retained whenever
   their owning preserved message is live.
5. Superseded backup cleanup is separate from transcript append, so metadata durability does not depend
   on deleting old filesystem content in the same critical section.

**Why this approach:**
- Rewriting a growing snapshot after every edit produces quadratic cumulative I/O over a long session.
  Appending a delta makes each edit proportional to the new change description.
- The trade-off is read amplification: restoring state requires replay. Periodic snapshots and transcript
  compaction cap that cost.
- Sharing the transcript queue preserves ordering between messages and their file-history records; a
  separate writer would require cross-file transaction logic.
- Separating backup deletion keeps a failed cleanup from making the durable history update fail.

**Key insight:** The optimization moves work from every write to occasional replay/compaction. That is the
right direction for an interactive system where writes happen on the latency-sensitive path.

### Absolute-descendant render-tree pruning

**What it does:** Avoids scanning entire terminal render subtrees when no absolutely positioned node can
affect blitting or cached-layout invalidation.

**How it works:**
1. When an absolute node is inserted, `markAbsoluteDescendant` (`RBs`, `:267443-267446`) propagates a
   `hasAbsoluteDescendant` bit up its ancestor chain and stops once it reaches an already-marked node.
2. Render-time checks such as `hasAbsolutePositionChanged` (`ex_`, `:273573-273588`) immediately return
   when the bit is absent.
3. `blitEscapingAbsoluteRects` (`nx_`, `:273635-273661`) likewise returns before allocating its traversal
   stack for subtrees without absolute descendants.
4. For marked subtrees, traversal descends only through nodes whose own bit says an absolute descendant
   exists, while processing absolute children directly.
5. Node removal calls the invalidation walk so cached layout and ancestor state are recomputed when the
   structural assumption changes.
6. Normal dirty-node rendering remains independent; the flag specializes only the extra absolute-layout
   work.

**Why this approach:**
- Terminal rendering repeats once per frame, so even a linear “usually finds nothing” tree walk becomes
  material in large transcripts.
- A propagated summary bit converts the common negative query to O(1) at the subtree root.
- Maintaining the bit adds mutation-time work and invalidation complexity. That trade favors rendering
  because structural mutations occur much less frequently than frames.
- A global list of absolute nodes could avoid tree traversal but would make clipping, ancestry, and node
  removal bookkeeping more complex.

**Key insight:** The optimization caches a negative structural fact. “This subtree cannot contain the
thing you seek” is more valuable on a hot render path than making the positive case marginally faster.

### Ordered pre-exit flush and byte-scaled stdout drain

**What it does:** Gives buffered durable events and stdout a bounded opportunity to complete before the
process closes, without permitting shutdown to hang indefinitely.

**How it works:**
1. The pre-exit registry (`rto`/`nto`, `:4796-4802`) is distinct from the ordinary cleanup registry.
2. Subsystems register async durability work there. For example, Remote Control first preserves its
   internal-event uploader, flushes it under a timeout, and only then closes it (`:521233-521243`).
3. Registry drain snapshots and clears callbacks before awaiting them in parallel. Repeated drains are
   therefore idempotent for already-consumed registrations.
4. `StdoutDrainState` (`zVi`, `:15130-15183`) counts queued and callback-confirmed bytes and tracks stream
   closure/errors.
5. `drainStdoutBeforeExit` (`icr`, `:15197-15205`) ends non-TTY stdout once, waits for both end and byte
   confirmation, and races that work against a timeout.
6. `getStdoutDrainBudgetMs` (`Sro`, `:15212-15214`) scales the budget at approximately 256 KiB/s, with a
   caller-provided floor and a 30-second ceiling.
7. Broken/closed streams reduce outstanding bytes to zero, preventing a pipe failure from deadlocking
   exit.

**Why this approach:**
- Synchronous process `exit` handlers cannot await network or stream completion. The work must run in an
  earlier asynchronous shutdown phase.
- A shared registry centralizes ordering and allows one shutdown coordinator instead of many competing
  signal handlers.
- A fixed short timeout truncates large valid outputs; an unbounded wait can hang forever on a reader
  that stopped consuming. Scaling by outstanding bytes with a hard ceiling balances both risks.
- Parallel callback drain reduces shutdown latency, though callbacks must not rely on ordering relative
  to one another.

**Key insight:** Reliability work at exit is also performance policy. The runtime spends time in
proportion to known pending data, but never grants a stalled transport unlimited control over process
termination.

## Cross-version assessment

The major 2.1.220 resource controls are still present in 2.1.227: the dual-bound edit cache, 50-document
LSP LRU, streaming range reader, fork-context coalescing, delta file history, render subtree pruning, and
phased exit drains. The 2.1.227 changelog change is narrower: optional missing-file suggestions and
at-mention metadata probes were moved off synchronous filesystem calls. That change fits the existing
architecture rather than replacing it: mandatory edit reads remain direct, large reads remain streamed,
and optional interactive enrichment yields the event loop.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions and classes in this document:
- `EditFileReadCache` (`WFd`) - mtime-validated, entry- and size-bounded content cache.
- `readFileWithLineRange` (`U0e`) - small-file/streaming read dispatcher.
- `streamLinesFromFile` (`Kc_`) - chunked range reader with independent budgets.
- `createLspServerManager` (`EBd`) - owns document recency and protocol closes.
- `hydrateForkContext` (`c9p`) - completed and in-flight fork-prefix cache entry point.
- `SessionProjectStorage` (`l9p`) - append queue and transcript compactor.
- `insertFileHistoryDelta` (`JWs`) - durable delta writer.
- `markAbsoluteDescendant` (`RBs`) - render subtree summary propagation.
- `blitEscapingAbsoluteRects` (`nx_`) - pruned absolute-layout traversal.
- `registerPreExitFlush` (`rto`) - async durability registry.
- `drainStdoutBeforeExit` (`icr`) - bounded stdout completion.
