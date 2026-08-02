# Compact conversation pipeline — 2.1.220 current-state analysis

**Authoritative source:**
`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`.
This document analyzes `compactConversation` (`Pko`, `:440219-440435`) and the shared preservation and
restoration helpers around it. The 2.1.193 bundle and readable source are cross-checks, not substitutes
for the 2.1.220 implementation.

## Executive result

The full compact path is a transaction-like pipeline:

1. authorize and augment the request through PreCompact hooks;
2. obtain one valid text summary, retrying prompt-too-long up to three times with grouped head
   truncation;
3. clear context-dependent caches only after summary success;
4. reconstruct information that a text summary cannot safely preserve;
5. create a boundary record, summary message, metrics, and PostCompact hook output;
6. always normalize UI/SDK state in `finally`.

Full compaction intentionally returns `messagesToKeep: []`. Partial, reactive, and session-memory
compaction use the same result type with retained raw messages. Their boundary metadata is what lets
the transcript loader splice those already-recorded messages into the new logical chain.

## 1. Hook-controlled entry and error surface

### PreCompact instruction merge and block

**What it does:** Gives hooks a chance to reject compaction or add summarization instructions without
discarding the user's instructions.

**How it works:**
1. Empty input fails before any model request.
2. The pre-compact estimated token count and app state are captured.
3. UI/SDK events announce `hooks_start` and `compacting`.
4. `executePreCompactHooks` (`MEe`) receives `auto | manual` plus the caller's custom instructions.
5. `throwIfPreCompactBlocked` (`PLo`) throws a dedicated error. Manual compaction receives a visible
   warning; automatic compaction suppresses that notification.
6. `mergeHookInstructions` (`MLo`) places user instructions first, two newlines, then hook instructions.
7. The hook's display message is retained and later joined with the PostCompact display message.

**Why this approach:**
- Hooks can enforce policy before an irreversible context transition.
- Appending hook guidance preserves explicit user priority while still adding organizational policy.
- Suppressing auto notifications avoids alarming the user about a background attempt that may retry.

**Key insight:** Hook blocking is an expected control result with a recognizable error prefix, not a
generic summarization failure.

## 2. Summary acquisition

### Two-path summary request

**What it does:** Obtains a one-turn textual summary while attempting to reuse prompt-cache context.

**How it works:**
1. `streamCompactSummary` (`UMd`) first attempts a forked-agent call when
   `tengu_compact_cache_prefix` is active and `stripNonEssential` is false.
2. That fork is labeled `compact`, limited to one turn, denied all tools, excluded from transcript and
   cache writes, and given the caller's abort controller.
3. A valid non-error assistant text is accepted. Missing text or a non-abort exception records fallback
   telemetry.
4. The direct streaming fallback constructs `[messages after last compact boundary, summary request]`,
   normalizes tool-result pairing, and optionally strips queued commands plus large tool inputs/results.
5. Its tool set is either the minimal base tool or a gated deduplicated set of base, task, and MCP
   tools. The model still receives `promptTooLongIsHandled: true` and prompt caching is disabled.
6. The stream updates response-length UI and switches to responding mode at the first text block.
7. Model-policy substitution and the configured fallback chain are handled inside the loop.

**Why this approach:**
- Fork cache sharing can reuse the expensive conversation prefix without recording a synthetic agent.
- A separate direct stream is needed when the fork returns malformed/empty output or fails.
- `stripNonEssential` is a cold/emergency path: lower fidelity is accepted to get under provider size
  limits.

**Key insight:** “Cache sharing enabled” describes the first attempt, not a guarantee; the direct path
is a fully independent fallback.

### Prompt-too-long retry by grouped head removal

**What it does:** Recovers when the compaction request itself cannot fit.

**How it works:**
1. `compactConversation` recognizes summary text beginning with the provider's prompt-too-long prefix.
2. It allows at most `MAX_COMPACT_PTL_RETRIES` (`$Md = 3`).
3. `truncateHeadForCompactRetry` (`NMd`) removes a prior synthetic retry marker before regrouping.
4. If a token gap is parseable, it drops oldest complete groups until their estimate covers the gap;
   otherwise it drops 20% of groups, at least one.
5. It always leaves one group. If the retained sequence starts with an assistant message, it prepends a
   meta user marker so the API role order stays valid.
6. Both the local message list and `forkContextMessages` are replaced, because the forked path reads
   the latter.
7. Exhaustion raises a user-actionable “press esc twice” error rather than looping indefinitely.

**Why this approach:**
- Group-level truncation avoids splitting tool-use/tool-result conversations.
- Gap-guided removal minimizes loss; 20% is a provider-independent fallback.
- The marker prevents assistant-first API rejection, and removing an earlier marker ensures each retry
  makes progress.

**Key insight:** This is a lossy emergency escape hatch for full/manual compaction. The reactive path's
suffix-preservation search is more deliberate and is analyzed separately.

```javascript
// ============================================
// truncateHeadForCompactRetry - Drop oldest API-round groups after compact itself overflows
// Location: cli_inner_pretty.js:440166-440181
// ============================================

// ORIGINAL (for source lookup):
function NMd(e, t) {
  let r = e[0]?.type === "user" && e[0].isMeta && e[0].message.content === MMd ? e.slice(1) : e,
    n = xdr(r);
  if (n.length < 2) return null;
  let o = cir(t),
    i;
  if (o !== void 0) {
    let a = 0;
    i = 0;
    for (let l of n) if (((a += ZL(l)), i++, a >= o)) break;
  } else i = Math.max(1, Math.floor(n.length * 0.2));
  if (((i = Math.min(i, n.length - 1)), i < 1)) return null;
  let s = n.slice(i).flat();
  if (s[0]?.type === "assistant") return [zr({ content: MMd, isMeta: !0 }), ...s];
  return s;
}

// READABLE (for understanding):
function truncateHeadForCompactRetry(messages, promptTooLongResponse) {
  const input = isPriorRetryMarker(messages[0]) ? messages.slice(1) : messages;
  const groups = groupMessagesByApiRound(input);
  if (groups.length < 2) return null;
  const gap = getPromptTooLongTokenGap(promptTooLongResponse);
  let dropCount = gap === undefined ? Math.max(1, Math.floor(groups.length * 0.2)) : groupsUntilGap(groups, gap);
  dropCount = Math.min(dropCount, groups.length - 1);
  if (dropCount < 1) return null;
  const retained = groups.slice(dropCount).flat();
  return retained[0]?.type === "assistant" ? [makeMetaUser(RETRY_MARKER), ...retained] : retained;
}

// Mapping: NMd→truncateHeadForCompactRetry, e→messages, t→promptTooLongResponse, r→input, n→groups, o→gap, i→dropCount, s→retained, MMd→COMPACT_PTL_RETRY_MARKER, xdr→groupMessagesByApiRound, cir→getPromptTooLongTokenGap, ZL→estimateTokens, zr→createUserMessage
```

## 3. Commit point and state invalidation

### Clear only after summary validation

**What it does:** Prevents failed summarization from destroying live state.

**How it works:**
1. Empty summary, API error message, or API-error-prefixed text throws before cache clearing.
2. Once text is valid, the read-file cache is copied and then cleared.
3. Loaded nested-memory paths and the memory selector cache are cleared.
4. Post-compact attachments are built from the saved read state and current runtime state.

**Why this approach:**
- File-read and memory caches describe what the pre-compact model already knew. Carrying them forward
  would suppress required re-injection after the summary replaces history.
- Delaying invalidation until summary success preserves retryability after model/network failure.

**Key insight:** The validated summary text is the transaction's commit point; earlier work is
preparatory, and later state is reconstructed for the new context.

## 4. Context reconstruction

### Post-compact attachment reconstruction

**What it does:** Restores structured state that a prose summary cannot reliably encode.

**How it works:**
1. `buildPostCompactAttachments` (`iwo`) concurrently restores recently read files and unretrieved
   asynchronous-agent statuses.
2. It adds the plan file reference, a plan-mode reminder, and invoked-skill content when applicable.
3. It emits deltas for deferred tool schemas, agent listings, MCP instructions, and other runtime
   listings against the retained messages.
4. It announces a SessionStart `compact` phase and appends hook-result messages.
5. Read-file restoration excludes the current plan file, protected memory roots, already-retained read
   tool results, and over-budget files. It caps restoration at five files, 5,000 tokens per file, and
   50,000 tokens total.
6. Invoked skills are capped at 5,000 tokens each and 25,000 total; non-body skill content may be
   truncated in the registry when it exceeds the budget.

**Why this approach:**
- Structured attachments are authoritative and machine-readable; asking a summary model to reproduce
  them would introduce omission and hallucination.
- Parallel independent restoration reduces user-visible compact latency.
- Layered per-item and aggregate budgets prevent reconstruction from immediately retriggering compact.

**Key insight:** Compaction replaces conversational history, not runtime capability state. The
attachment builder explicitly re-materializes that state.

```javascript
// ============================================
// buildPostCompactAttachments - Reconstruct files, plan, skills, agents, tools, MCP, and hooks
// Location: cli_inner_pretty.js:440830-440844
// ============================================

// ORIGINAL (for source lookup):
async function iwo(e, t, r, n, o, i = !1) {
  let [s, a] = await Promise.all([Nn_(e, t, Hn_, r, i), Un_(t)]),
    l = t.agentId,
    c = Fn_(l),
    u = await rks(t, o),
    d = Bn_(l, r),
    p = [
      ...jpr(t.options.tools, t.options.mainLoopModel, r, { callSite: n }),
      ...lcn(t, r),
      ...$Lo(t.options.mcpClients, t.options.tools, t.options.mainLoopModel, r),
      ...NLo(t, r),
    ].map((m) => Va(m));
  t.onCompactEvent?.({ type: "compact_progress", event: { type: "hooks_start", hookType: "session_start" } });
  let f = await HBe("compact", { model: t.options.mainLoopModel });
  return { attachments: [...s, ...a, ...(c ? [c] : []), ...(u ? [u] : []), ...(d ? [d] : []), ...p], hookResults: f };
}

// READABLE (for understanding):
async function buildPostCompactAttachments(readFileState, context, retainedMessages, callSite, originalMessages, includeProtectedMemory = false) {
  const [files, asyncAgents] = await Promise.all([
    restoreReadFiles(readFileState, context, POST_COMPACT_MAX_FILES, retainedMessages, includeProtectedMemory),
    buildAsyncAgentStatusAttachments(context),
  ]);
  const planFile = buildPlanFileAttachment(context.agentId);
  const planMode = await buildPlanModeAttachment(context, originalMessages);
  const skills = buildInvokedSkillsAttachment(context.agentId, retainedMessages);
  const deltas = buildRuntimeDeltaAttachments(context, retainedMessages, callSite).map(createAttachmentMessage);
  context.onCompactEvent?.({ type: "compact_progress", event: { type: "hooks_start", hookType: "session_start" } });
  const hookResults = await processSessionStartHooks("compact", { model: context.options.mainLoopModel });
  return { attachments: [...files, ...asyncAgents, ...optional(planFile, planMode, skills), ...deltas], hookResults };
}

// Mapping: iwo→buildPostCompactAttachments, e→readFileState, t→context, r→retainedMessages, n→callSite, o→originalMessages, i→includeProtectedMemory, Nn_→restoreReadFiles, Un_→buildAsyncAgentStatusAttachments, Fn_→buildPlanFileAttachment, rks→buildPlanModeAttachment, Bn_→buildInvokedSkillsAttachment, HBe→processSessionStartHooks, Va→createAttachmentMessage
```

## 5. Boundary and retained-message semantics

### Preserved-message annotation

**What it does:** Records how retained original messages must be reconnected after a compact boundary.

**How it works:**
1. The boundary starts with compact trigger, pre-compact token count, and the last old UUID.
2. `annotateBoundaryWithPreservedMessages` (`tks`) records every retained message UUID in `allUuids`.
3. `sFt(retained, original)` derives the subset that is actually transcript-addressable; those UUIDs
   become `uuids`.
4. If the on-disk subset is non-empty, the compatibility `preservedSegment` stores head, anchor, and
   tail UUIDs.
5. The anchor is the record that should logically precede the first retained message: normally the
   summary message for suffix preservation, or the boundary for the applicable prefix-preserving
   partial path.
6. Loaders prefer the ordered `preservedMessages` representation while retaining compatibility with
   `preservedSegment`.

**Why this approach:**
- Retained messages keep their original UUIDs and parent links and may be deduplicated during
  transcript recording; explicit relink metadata reconstructs the intended logical sequence.
- `allUuids` preserves in-memory-only messages while `uuids` remains safe for disk reconstruction.
- Keeping the older three-point segment supports older consumers.

**Key insight:** `preservedSegment` is not the retained data. It is a chain-repair instruction for data
already present elsewhere.

```javascript
// ============================================
// annotateBoundaryWithPreservedMessages - Encode retained-message chain repair metadata
// Location: cli_inner_pretty.js:440199-440210
// ============================================

// ORIGINAL (for source lookup):
function tks(e, t, r, n = r) {
  let o = r.map((s) => s.uuid),
    i = sFt([...r], n).map((s) => s.uuid);
  if (o.length === 0) return e;
  return {
    ...e,
    compactMetadata: {
      ...e.compactMetadata,
      ...(i.length > 0 && { preservedSegment: { headUuid: i[0], anchorUuid: t, tailUuid: i.at(-1) } }),
      preservedMessages: { anchorUuid: t, uuids: i, allUuids: o },
    },
  };
}

// READABLE (for understanding):
function annotateBoundaryWithPreservedMessages(boundary, anchorUuid, retainedMessages, originalMessages = retainedMessages) {
  const allUuids = retainedMessages.map(message => message.uuid);
  const transcriptUuids = filterTranscriptRecordable(retainedMessages, originalMessages).map(message => message.uuid);
  if (allUuids.length === 0) return boundary;
  return {
    ...boundary,
    compactMetadata: {
      ...boundary.compactMetadata,
      ...(transcriptUuids.length > 0 && { preservedSegment: { headUuid: transcriptUuids[0], anchorUuid, tailUuid: transcriptUuids.at(-1) } }),
      preservedMessages: { anchorUuid, uuids: transcriptUuids, allUuids },
    },
  };
}

// Mapping: tks→annotateBoundaryWithPreservedMessages, e→boundary, t→anchorUuid, r→retainedMessages, n→originalMessages, o→allUuids, i→transcriptUuids, sFt→filterTranscriptRecordable
```

### Result shapes by compaction path

| Path | Summary scope | `messagesToKeep` | Boundary anchor |
|---|---|---|---|
| full `compactConversation` (`Pko`) | all supplied messages, subject only to emergency PTL head loss | empty | none required |
| partial `partialCompactConversation` (`FMd`) `from` | selected suffix | untouched prefix | boundary |
| partial `FMd` `up_to` | selected prefix | untouched suffix | last summary message |
| reactive `finalizeReactiveCompaction` (`owo`) | old group prefix | recent group suffix, plus post-precompute messages | last summary message |
| session-memory compact | subsystem-selected history | subsystem-selected suffix | last summary message |

`buildPostCompactMessages` (`Yze`) returns boundary, summary, retained messages, attachments, and hook
results. `buildCompactionEmittedMessages` (`WHs`) deliberately omits retained raw messages when emitting
the compact result through the query loop, because those messages are already present and should not
be re-emitted as newly created transcript records.

```javascript
// ============================================
// buildCompactionResultArrays - Separate installed context from newly emitted compact records
// Location: cli_inner_pretty.js:440193-440197
// ============================================

// ORIGINAL (for source lookup):
function Yze(e) {
  return [e.boundaryMarker, ...e.summaryMessages, ...e.messagesToKeep, ...e.attachments, ...e.hookResults];
}
function WHs(e) {
  return [e.boundaryMarker, ...e.summaryMessages, ...e.attachments, ...e.hookResults];
}

// READABLE (for understanding):
function buildPostCompactMessages(result) {
  return [result.boundaryMarker, ...result.summaryMessages, ...result.messagesToKeep, ...result.attachments, ...result.hookResults];
}
function buildCompactionEmittedMessages(result) {
  return [result.boundaryMarker, ...result.summaryMessages, ...result.attachments, ...result.hookResults];
}

// Mapping: Yze→buildPostCompactMessages, WHs→buildCompactionEmittedMessages, e→result
```

## 6. Completion, metrics, and cleanup

### Successful installation bookkeeping

**What it does:** Makes the new context observable and resets subsystems whose baselines depended on
the old one.

**How it works:**
1. It creates one transcript-only compact summary and estimates the complete resulting payload.
2. It records discovered deferred tools on the boundary so schema filtering remains correct.
3. It reports both the summary API usage and the estimated installed context; these are distinct
   quantities.
4. It resets prompt-cache-break detection when enabled, marks post-compaction state, clears applicable
   session state, and optionally writes a reduced pre-compact transcript segment.
5. It runs PostCompact hooks and joins their user message with the PreCompact hook message.
6. `finally` always restores request UI mode, clears response length, sends compact-end, closes metrics
   span state, and clears SDK compact status.

**Why this approach:**
- Cleanup in `finally` prevents a failed/aborted compact from leaving the UI permanently “compacting.”
- Separate API-usage and installed-context measurements diagnose both cost and immediate recompact
  risk.
- Full cleanup occurs only after a valid result; automatic failure remains retryable and quiet.

**Key insight:** `postCompactTokenCount` is legacy naming for the summary call's token total, while
`truePostCompactTokenCount` estimates the replacement context. Treating them as the same metric gives
incorrect re-compaction conclusions.

## 7. Cross-validation

### 2.1.193

`compactConversation` is `Aht` at `:469385-469594 (193)`. The hook ordering, three PTL retries,
summary validation, cache clearing, attachment families, boundary/summary construction, metrics, and
finally cleanup all have direct structural twins in 2.1.220. Likewise, 193's boundary annotator at
`:469366-469376 (193)` already contains both `preservedSegment` and `preservedMessages` with
`allUuids`. These are current 2.1.220 mechanisms, **not 2.1.220 introductions**.

Material 2.1.220 refinements in this pipeline include:

- options consolidated into the final `Pko` argument rather than eleven positionals;
- API-error wrapping with a redacted causal label instead of throwing summary text directly;
- consolidated `buildPostCompactAttachments` (`iwo`) and centralized post-compact cleanup;
- explicit model-fallback-disabled error handling in `UMd`;
- the extended-thinking change already documented in
  [dispatcher_and_failure_breakers.md](dispatcher_and_failure_breakers.md).

### Readable source

`src/services/compact/compact.ts` exposes the same semantic names and comments for
`compactConversation`, `truncateHeadForPTLRetry`, `buildPostCompactMessages`, preserved-message
annotation, state invalidation, and restoration budgets. It strongly corroborates the readable names
used here. Where that tree differs in signature or helper factoring, the bundled 2.1.220 behavior and
locations above remain authoritative.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `compactConversation` (`Pko`) - full-compaction transaction
- `streamCompactSummary` (`UMd`) - cache-sharing attempt and streaming fallback
- `truncateHeadForCompactRetry` (`NMd`) - grouped emergency retry
- `buildPostCompactAttachments` (`iwo`) - runtime-state reconstruction
- `annotateBoundaryWithPreservedMessages` (`tks`) - transcript chain metadata
- `partialCompactConversation` (`FMd`) - selector-driven prefix/suffix compaction
- `buildPostCompactMessages` (`Yze`) - installed context ordering
- `buildCompactionEmittedMessages` (`WHs`) - newly emitted record ordering
