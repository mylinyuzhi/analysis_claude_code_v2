# Focus view and transcript folding

Focus view is a semantic projection, not a CSS visibility toggle. Before rendering, Claude Code
normalizes message variants, groups tool activity, accumulates meaningful statistics, and replaces
foldable spans with summary messages. The 2.1.225 repairs are visible in the fold planner: the current
build can emit multiple summaries for one turn, preserves the latest standalone instance of each
actionable tool, and marks only the final active bucket as live.

## Pipeline

`renderTranscript` (`KjE`, `cli_inner_pretty.js:779592-779735`) applies the transforms in this order:

1. Apply render-window slicing only when virtualization permits it.
2. Normalize raw conversation messages and attach streaming tool-use projections.
3. Collapse tool activity into grouped semantic messages with `aggregateFocusActivity` (`EWd`).
4. Apply `foldTranscriptForFocus` (`HWd`) only outside transcript mode and only when fullscreen Focus
   or the remote reply-channel projection requires it.
5. Apply the final viewport cap to the already-folded sequence.

That order prevents raw-message caps from cutting a tool call away from its result or from counting a
large folded turn as hundreds of visible rows.

### View-mode resolution and remote propagation

**What it does:** Resolves whether the current renderer should use Focus view and propagates an
interactive `/focus` change to a capable remote session.

**How it works:**
1. `isFocusViewEnabled` (`fbr`, `cli_inner_pretty.js:192033-192035`) first reads the explicit
   `viewMode` setting.
2. If the explicit value is absent, it falls back to the legacy `briefTranscript` boolean so existing
   configurations do not silently change behavior.
3. `setFocusView` (`BUp`, `cli_inner_pretty.js:495379-495451`) updates local state and, when the
   transport supports control requests, sends `apply_flag_settings` with `viewMode: "focus"` or
   `null`.
4. `invalidateFocusViewCache` (`zun`, `cli_inner_pretty.js:192037-192039`) clears the cached selector
   after a settings change.
5. The transcript renderer re-evaluates the selector and recomputes its memoized projection.

**Why this approach:**
- An explicit enum permits future presentation modes without multiplying booleans.
- The legacy fallback preserves older user and host settings.
- Capability-aware propagation lets local-only transports degrade honestly instead of claiming the
  remote view changed.
- The trade-off is temporary dual-setting complexity until the legacy flag can be retired.

**Key insight:** The 2.1.221 “Added Focus view” changelog describes product exposure, especially in
VS Code; the core Focus flag and folding machinery already existed in 2.1.220. The current build keeps
that compatibility layer rather than introducing a second VS Code-only renderer.

### Semantic activity aggregation

**What it does:** Converts streams of tool uses, results, thinking blocks, hooks, memories, and
progress attachments into compact activity summaries without losing the source messages needed for
expanded views.

**How it works:**
1. `aggregateFocusActivity` (`EWd`, `cli_inner_pretty.js:351961-352091`) creates an empty accumulator
   for a contiguous activity span.
2. For each tool use, it classifies reads, searches, lists, Bash calls, MCP calls, memory operations,
   scratchpad edits, workshop edits, agent activity, and ordinary tools.
3. It records both counts and high-value display hints such as the latest path, search pattern,
   command, or MCP progress message.
4. Tool results extend the same span when their IDs match. Failed workshop edits subtract their
   previously credited edit counts and line totals through `rollbackFailedWorkshopStats` (`bX_`,
   `cli_inner_pretty.js:351930-351950`).
5. Adjacent hook-decision attachments are de-duplicated by decision and hook event; relevant-memory
   attachments are merged and their read operations are recorded.
6. Thinking summaries are whitespace-normalized. Timestamp deltas contribute to `thoughtForMs`, with
   each interval capped at ten minutes (`Ujo = 600000`) to avoid sleep or clock gaps inflating the
   displayed duration.
7. A genuine prompt boundary flushes the accumulator. `isQueuedPromptBoundary` (`N6s`,
   `cli_inner_pretty.js:352093-352102`) recognizes normal prompts plus channel and peer origins.

**Why this approach:**
- Aggregating by semantics produces a stable summary even if tools emit different numbers of
  progress and result messages.
- Keeping source messages inside the summary enables verbose expansion without re-querying state.
- Correcting failed edit totals favors truthful summaries over monotonically increasing counters.
- The ten-minute clamp trades perfect wall-clock accounting for protection against suspend/resume
  artifacts.

**Key insight:** Focus view is driven by an event reduction algorithm. Its visible sentence is only
the final rendering of a richer accumulator that understands tool identity, errors, and turn
boundaries.

### Turn folding and preservation planner

**What it does:** Decides which messages remain verbatim, which become summary buckets, and which can
be hidden in each user turn.

**How it works:**
1. `foldTranscriptForFocus` (`HWd`, `cli_inner_pretty.js:352171-352344`) scans to a real user or queued
   prompt boundary, then finds the next boundary to define one turn.
2. It detects whether the final turn is still live. A completed assistant stop reason or final answer
   cancels the live classification even when the turn reaches the end of the array.
3. For completed turns, it scans backward for the final answer and guarantees that message remains
   visible.
4. In `keepAllText` mode, it also retains every error result, the tool invocation that produced it,
   and final assistant text. This mode supports reply-channel projections where hiding text would
   change meaning.
5. It scans backward by tool name and preserves the latest invocation/result pair for tools marked
   `briefStandalone`. Earlier instances can still be summarized. This is the mechanism that keeps a
   pending question, current todo surface, or other actionable standalone UI from disappearing.
6. Remaining tool activity is folded into one or more summary buckets. A preserved final/error text
   boundary flushes the current bucket so activity on either side retains the right ordering.
7. Summary messages have hook metadata cleared to prevent hooks from appearing twice, receive a
   stable `brief-` UUID, and carry a hidden-message count on the duration marker.
8. Only the final summary bucket of an actually live turn receives `isLiveBriefTurn`.
9. Preserved and summary items are sorted by their original positions before being emitted.

**Why this approach:**
- Backward selection naturally chooses the most recent actionable state, which is generally the one
  users can still act on.
- Multiple summary buckets preserve temporal order around visible answers and errors; one summary per
  turn cannot express “activity, visible question, more activity.”
- Stable synthetic UUIDs reduce remount churn, while clearing duplicated hook metadata prevents
  double counting.
- The planner is more complex than filtering by message type, but filtering cannot represent tool
  call/result pairing or preserve only the latest stateful surface.

**Key insight:** The 2.1.225 fix is chiefly a partitioning change. The old 2.1.220 planner captured
active assistant text into a single pending-text summary; 2.1.227 builds ordered summary buckets and
explicitly preserves standalone actionable nodes, which is why todos and questions survive folding.

### Live thinking and completed-turn re-collapse

**What it does:** Renders a live Focus summary differently from a completed summary so an active turn
shows current progress but settles into a compact historical line afterward.

**How it works:**
1. `FocusSummaryRow` (`U8a`, `cli_inner_pretty.js:732193-732490`) reads
   `isLiveBriefTurn` from the summary selected by the fold planner.
2. A live summary prefers the latest operational display hint and suppresses the stale
   `latestThinkingSummary` text.
3. While active in fullscreen, it derives the most recent thinking timestamp and renders an updating
   duration.
4. Once the turn completes, `isLiveBriefTurn` is absent. The label changes from “Thinking” to
   “Thought,” duration becomes a stable bold value, and a bounded thinking summary may replace the
   operational hint.
5. The next fold pass can collapse the settled answer/tool details according to completed-turn rules.

**Why this approach:**
- Live text should describe what is happening now; a cached thinking summary can lag the actual tool.
- Historical rows benefit from deterministic height and stable wording.
- Reusing the same summary data structure avoids a separate live-only component, at the cost of one
  explicit lifecycle marker.

**Key insight:** “Re-collapse when their turn completes” is not a timer-driven UI trick. Completion
changes the fold plan, removes the live marker, and therefore selects the stable historical rendering
branch on the next projection.

### Projection before viewport limiting

**What it does:** Ensures semantic folding and streaming reconciliation happen before the final
visible-window calculation.

**How it works:**
1. The renderer builds `collapsedBase` from normalized, filtered messages and streaming tool uses.
2. It computes lookup state from the pre-window messages so tool results remain resolvable.
3. Focus folding transforms `collapsedBase` into a shorter semantic sequence.
4. Only then does the renderer apply `renderRange` or the terminal-row cap.
5. Transcript mode bypasses Focus folding and can expose the original expanded semantic sequence.

**Why this approach:**
- Capping before folding can split tool invocation/result pairs and can hide a final answer merely
  because verbose activity consumed the raw-message budget.
- Folding first lowers render work and gives viewport logic units that correspond to visible rows.
- The trade-off is that aggregation still scans messages outside the final visible window, although
  earlier normalization and virtualization limit the input when safe.

**Key insight:** Focus view is part of data preparation, not presentation decoration. Its position in
the pipeline is what makes both tool pairing and viewport behavior predictable.

## 2.1.220 comparison

The baseline `HDd` fold planner (`2.1.220:432218-432397`) already grouped turns, retained final
answers, and emitted compact summaries. In 2.1.227, `HWd` removes the single `pendingText` strategy,
introduces ordered summary buckets, tracks the final live bucket explicitly, and recognizes peer
messages as prompt boundaries. The accumulator also understands later workshop activity and rolls
back failed edits. These are local evolutions of the existing projection architecture, not a rewrite
of transcript rendering.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `isFocusViewEnabled` (`fbr`) - resolves explicit and legacy Focus settings.
- `setFocusView` (`BUp`) - changes view mode and propagates it to a compatible remote transport.
- `aggregateFocusActivity` (`EWd`) - reduces activity spans into semantic summary data.
- `isQueuedPromptBoundary` (`N6s`) - recognizes local, channel, and peer prompt boundaries.
- `foldTranscriptForFocus` (`HWd`) - partitions turns into preserved nodes and summary buckets.
- `createFocusSummary` (`AWd`) - initializes a summary message from its prompt boundary.
- `FocusSummaryRow` (`U8a`) - renders live and completed summary states.
- `renderTranscript` (`KjE`) - composes normal, transcript, and Focus projections.
