# Current compaction runtime

Compaction is a transcript replacement transaction. It creates a summary under a no-tools policy,
reconstructs selected dynamic state, writes a boundary that describes what survived, and only then
allows the caller to replace the active message list. Automatic compaction adds two speculative paths
and two independent circuit breakers around that same commit protocol.

## 1. Admission and hook authority

### Manual and automatic PreCompact gate

**What it does:** Gives trusted hooks a bounded chance to add summary instructions or veto compaction
before any transcript replacement is committed.

**How it works:**
1. Manual, ordinary automatic, reactive, and precomputed paths identify their trigger as `manual` or
   `auto`.
2. They execute the `PreCompact` hook with the caller's abort signal and optional custom instructions.
3. Successful hook output is merged with caller instructions rather than replacing them.
4. A hook `blockedBy` result is converted to a typed compaction error and, unless suppressed, a
   visible warning.
5. Precomputed work stops before starting the summary request when blocked.
6. Reactive and foreground paths restore SDK/UI compaction status when a block occurs.
7. Hook output is retained in the result so the post-compact transcript can explain the intervention.

**Why this approach:**
- Hooks must run before the destructive boundary, because a veto after summary generation could still
  leak cost and a veto after installation would be too late.
- Instruction merge lets operator policy supplement a user's preservation request.
- One typed block path keeps interactive, SDK, and background callers consistent.
- The trade-off is that a slow hook delays compaction; cancellation and progress events keep the delay
  observable.

**Key insight:** `PreCompact` has proposal authority over instructions and veto authority over the
attempt, but it never mutates the active transcript itself.

Evidence: `qGo` and `KGo` at `cli_inner_pretty.js:378779-379032`; precomputed hook path at
`356624-356649`; reactive path at `357017-357134`.

## 2. Summary acquisition

### Cache-sharing first, isolated streaming fallback

**What it does:** Obtains one valid assistant summary while preferring reuse of the existing prompt
cache and falling back to a tightly constrained direct model stream.

**How it works:**
1. `requestCompactionSummary` (`sXd`) first attempts a one-turn fork with the existing cached prefix
   when cache-prefix sharing is enabled.
2. The fork is transcript-free, cache-write-free, tool-denied, and labeled `compact`.
3. A valid non-error assistant text response is accepted immediately and cache-hit metrics are
   recorded.
4. Missing text, an invalid assistant response, or a fork exception records a fallback reason without
   failing the whole compact operation.
5. The direct path normalizes messages, optionally strips media/nonessential payloads, and exposes at
   most the allowed deferred/MCP tool descriptors while denying every actual tool call.
6. It streams a summary using a model/fallback chain and reports requesting/responding progress.
7. A model-block fallback advances to the next permitted model; no response or a terminal model block
   becomes a typed compaction failure.

**Why this approach:**
- Prefix sharing reduces the dominant cost for a long conversation, but it is an optimization rather
  than a correctness dependency.
- A one-turn, no-tool fork prevents summarization from causing side effects.
- Direct streaming provides a provider-independent recovery path and early response-length feedback.
- The trade-off is duplicate request construction logic, accepted so a cache-specific failure cannot
  make compaction unavailable.

**Key insight:** The cache-sharing request and direct request are two acquisition strategies for the
same summary contract; only validated assistant text can cross the commit boundary.

Evidence: `sXd` at `cli_inner_pretty.js:379219-379426`.

### Prompt-too-long grouped-head repair

**What it does:** Makes a bounded second-order reduction when the request intended to rescue an
oversized conversation is itself rejected as too long.

**How it works:**
1. The summary response is checked for the structured prompt-too-long/API-error shape.
2. `dropConversationHeadForCompactRetry` (`nXd`) groups the transcript into conversation units rather
   than slicing arbitrary messages.
3. If the API reports token excess, it removes enough leading groups to cover the excess; otherwise
   it removes 20% of groups.
4. It always retains at least one group and refuses repair when fewer than two groups exist.
5. If the retained suffix begins with an assistant message, it prepends a meta user truncation marker
   to preserve role validity.
6. The next summary request uses the strictly smaller suffix; attempts are bounded by the caller.
7. Failure to create a smaller valid input becomes “conversation too long,” not an infinite repair
   loop.

**Why this approach:**
- Removing whole dialogue groups preserves user/assistant/tool-result relationships.
- API-provided excess gives a more precise reduction than a fixed percentage.
- A fallback percentage handles gateways that omit token details.
- The marker maintains the required first-user role while making information loss explicit to the
  summarizer.

**Key insight:** The repair operates on semantic conversation groups and proves progress by removing
at least one entire head group on every accepted retry.

Evidence: `nXd` at `cli_inner_pretty.js:378763-378778` and retry use in `KGo` at
`378816-379032`.

## 3. Commit protocol

### Validate, reconstruct, then install

**What it does:** Prevents a failed or malformed summary from clearing the live conversation and
builds a self-contained post-compact transcript before replacement.

**How it works:**
1. The pipeline records pre-compact token count and streams progress without changing the active
   message array.
2. It rejects an API-error summary, empty text, abort, or malformed result.
3. Only after validation does it construct a compact-boundary system message and the summary message.
4. `buildPostCompactAttachments` (`Pzo`) rebuilds session-start context, eligible recent files, plan
   state, invoked skills, task status, and MCP/tool deltas.
5. File restoration excludes already-read tool paths, plan files, static instruction files, and
   duplicates; both item count and total character budget are bounded.
6. Invoked skills are independently capped and may be truncated or evicted from live skill state when
   they cannot fit.
7. The caller receives a result object containing boundary, summary, preserved messages, attachments,
   hook results, token counts, and usage; flattening occurs outside the acquisition step.
8. Success accounting and status cleanup run after the result is fully formed; failures leave the old
   transcript available.

**Why this approach:**
- The original transcript is the recovery source, so clearing it before summary validation would turn
  a transient API failure into data loss.
- Reconstructing dynamic attachments prevents a compacted session from forgetting active plan, skill,
  task, or MCP state.
- Independent caps keep reconstruction from immediately overflowing the context again.
- Returning a structured result separates calculation from installation and supports partial,
  reactive, and precomputed consumers.

**Key insight:** The summary is not the commit point. The commit-ready unit is the validated summary
plus boundary metadata and a bounded reconstruction of live session state.

Evidence: `KGo` at `cli_inner_pretty.js:378816-379032`, `Pzo` and attachment builders at
`379427-379580`.

### Preserved-segment boundary encoding

**What it does:** Records exact UUID lineage for messages intentionally retained across partial or
suffix-preserving compaction.

**How it works:**
1. The result distinguishes `summaryMessages` from `messagesToKeep`.
2. `annotatePreservedMessages` (`IKs`) collects all candidate UUIDs.
3. It filters them through the actual retained segment/order calculation.
4. When a retained segment exists, it stores head, anchor, and tail UUIDs.
5. It also stores both the filtered UUID list and the full candidate UUID list.
6. Flattening places the boundary before summary, kept messages, attachments, and hook output.

**Why this approach:**
- A count cannot prove which messages survived after resume, Remote Control hydration, or repeated
  compaction.
- Head/anchor/tail provides a compact range identity while the UUID lists support exact validation.
- Storing candidates as well as survivors makes later diagnostics able to distinguish filtering from
  loss.
- Metadata increases transcript size slightly but prevents ambiguous ancestry.

**Key insight:** The compact boundary is an integrity record for transcript lineage, not merely a
visual “conversation summarized” marker.

Evidence: `IKs`, `pnt`, and `k7s` at `cli_inner_pretty.js:378793-378815` and partial compaction at
`379033-379186`.

## 4. Automatic routing and breakers

### Threshold, fixed-prefix, and path selection

**What it does:** Decides whether automatic compaction is necessary and whether the request should use
ordinary or reactive compaction.

**How it works:**
1. `autoCompactDispatcher` (`H7s`) exits for `DISABLE_COMPACT` or an already-open failure breaker.
2. `shouldAutoCompact` (`Sib`) rejects unsupported query/session states and computes token level
   against the effective model window.
3. It separately estimates the fixed prefix—system prompt, tools, and non-message overhead.
4. If the fixed prefix alone exceeds the threshold, it emits a diagnostic because removing message
   history cannot solve the request.
5. A threshold-source resolver determines whether a custom/nonstandard window should route through
   reactive compaction.
6. Reactive routing may borrow a precomputed result; otherwise it runs the same validated compact
   transaction with recovery timeout.
7. Ordinary routing enters the foreground compaction generator and returns a typed outcome rather than
   a Boolean.

**Why this approach:**
- Token pressure can originate in removable history or an irreducible prefix; treating them alike
  causes futile compaction loops.
- Typed outcomes let the main loop distinguish not-needed, blocked, failed, and applied states.
- Reactive routing accommodates windows/gate decisions that cannot safely wait for the ordinary turn
  boundary.
- The trade-off is multiple estimators; explicit telemetry compares their sources and gaps.

**Key insight:** Auto-compaction first asks whether history removal can help. Crossing a token threshold
does not automatically imply compaction is a viable repair.

Evidence: `Sib`, `_ib`, and `H7s` at `cli_inner_pretty.js:379670-379826`.

### Consecutive-failure and rapid-refill circuits

**What it does:** Stops automatic compaction from repeatedly spending tokens when failures persist or
when a successful compact refills too quickly.

**How it works:**
1. Every terminal failure increments a session-local consecutive-failure count.
2. At the configured limit, later dispatcher calls return `failure_breaker_open` without another API
   request.
3. A successful installation clears or replaces failure state.
4. Independently, the dispatcher compares the turn distance since prior successful compaction.
5. Repeated refills within a small turn window increment a rapid-refill counter.
6. Crossing its limit returns `rapid_refill_breaker_tripped` and emits separate telemetry.
7. Manual compaction remains available because both circuits govern automatic retries, not user
   authority.

**Why this approach:**
- Consecutive failures indicate infrastructure/model incompatibility; rapid refills indicate that
  compaction succeeds but does not create enough headroom.
- One breaker cannot diagnose both conditions.
- Session-local latching avoids permanent configuration changes and resets naturally with a new
  session.
- The cost is refusing later auto-recovery after an external condition improves; manual action remains
  the escape path.

**Key insight:** The two breakers guard different resources: failure breaker limits wasted attempts,
while rapid-refill breaker limits a successful-but-unproductive cycle.

Evidence: `aXd` and `H7s` at `cli_inner_pretty.js:379656-379826`; main-loop result updates at
`367480-367550` and `368730-368890`.

## 5. Speculative compaction

### Pending/ready/failed precompute state machine

**What it does:** Generates a compact result before the hard threshold and makes its ownership,
persistence, borrowing, and failure limits explicit.

**How it works:**
1. `PrecomputedCompactRegistry` (`Fqd`) stores one entry per main/subagent key plus attempt and
   consecutive-failure counters.
2. Admission rejects duplicate work, ineligible query sources, early single-prompt SDK sessions, and
   agents whose failure cap is open.
3. Arming snapshots the last message UUID, token estimate, model/window source, session sidecar ID,
   and a private abort controller.
4. The asynchronous worker runs `PreCompact`, builds a compact result, and settles only if the registry
   still contains the same pending controller—an identity-based stale-result guard.
5. Success transitions to `ready`; counted errors transition to `failed`; blocks/aborts remove or
   settle the entry without consuming the same failure policy.
6. Main-session ready state may be serialized through a promise-ordered, versioned sidecar path and
   rehydrated once per session under age/growth validation.
7. A threshold consumer may borrow another pending entry or consume its own; abort while waiting leaves
   the producer entry intact.
8. Consumption removes the registry entry and classifies ready, failed, gone, boundary-miss, or
   turn-aborted before deciding whether to fall back to reactive work.

**Why this approach:**
- Speculation hides summary latency but risks installing stale work; last-UUID and controller identity
  make ownership verifiable.
- Promise-serialized sidecar I/O avoids reordered writes without blocking the turn.
- Borrowing saves duplicate model calls, while non-destructive abort preserves useful in-flight work.
- The design trades memory and state complexity for lower user-visible compaction latency.

**Key insight:** Precomputed compaction is a cache of a *transaction candidate*, not a cached text
summary. It is usable only while its message boundary and ownership identity remain valid.

Evidence: `Fqd` and registry helpers at `cli_inner_pretty.js:356391-356910`; reactive consumption at
`357017-357181`.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `compactConversation` (`KGo`) - complete summary and reconstruction transaction.
- `partialCompactConversation` (`oXd`) - direction/anchor-aware partial compaction.
- `requestCompactionSummary` (`sXd`) - cache-sharing and direct streaming acquisition.
- `dropConversationHeadForCompactRetry` (`nXd`) - semantic grouped-head repair.
- `buildPostCompactAttachments` (`Pzo`) - bounded dynamic-state reconstruction.
- `annotatePreservedMessages` (`IKs`) - exact compact-boundary lineage metadata.
- `autoCompactDispatcher` (`H7s`) - threshold, path, and breaker decision generator.
- `PrecomputedCompactRegistry` (`Fqd`) - speculative ownership, settlement, and sidecar serialization.
