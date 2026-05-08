# Implementation Report — Context Compaction (Module 07) — v2.1.112

## Overview

Context Compaction in Claude Code v2.1.112 is the system that lets a single conversation outlive its model's context window. When the conversation hits ~93% of the effective window, the autocompact dispatcher invokes the LLM to compress the entire history into a 2–3 KB summary, then re-injects fresh attachments (files, plan, skills, todos, MCP instructions, agent listings, system reminders) so the agent can resume without "forgetting" what it was doing.

v2.1.112 introduces a parallel, server-driven recovery path (`context-hint-2026-04-09` beta) that handles the case where the local heuristic under-counts and the API rejects the request with 422/424. That path runs a tiny in-place edit (clear thinking blocks + clear old tool results) and retries once.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features

Key functions in this document:
- `autocompactDispatcher` (`QkK`) — Top-level dispatcher (chunks.159.mjs:1379)
- `compactConversation` (`vI6`) — Full LLM compact (chunks.159.mjs:574)
- `partialCompactConversation` (`zLK`) — Partial compact (chunks.159.mjs:749)
- `shouldCompact` (`gDY`) — Threshold check (chunks.159.mjs:1365)
- `microcompactStub` (`_c`) — No-op (chunks.85.mjs:1207)
- `keepRecentMicrocompact` (`qD4`) — Server-driven MC (chunks.85.mjs:1235)
- `contextHintReject` (`d85`) — 422/424 reject handler (chunks.194.mjs:856)
- `restoreFilesPostCompact` (`Nx8`) — Post-compact file restoration (chunks.159.mjs:1057)
- `createCompactBoundaryMessage` (`p18`) — Boundary marker (chunks.166.mjs:118)
- `compactSummaryContent` (`b18`) — Summary message text (chunks.101.mjs:804)

## Sub-Documents

- [Trigger Mechanism](./trigger_mechanism.md) — Threshold math, dispatcher gates, breakers
- [Standard Compaction](./standard_compaction.md) — `vI6` 8-phase pipeline
- [Partial Compaction](./partial_compaction.md) — `zLK` `up_to`/`from` cursor variant
- [Microcompaction](./microcompaction.md) — `qD4` KEEP-RECENT MC + `_c` stub
- [Context-Hint Path](./context_hint_path.md) — 422/424 reject handler
- [State Preservation](./state_preservation.md) — Files, plans, skills, agents
- [Hooks System](./hooks_system.md) — PreCompact / PostCompact / SessionStart
- [Slash Command](./slash_command.md) — `/compact` and partial variant
- [Configuration & Telemetry](./configuration_and_telemetry.md) — Env vars, flags, events

---

## Core Pipeline at a Glance

The compact subsystem in v2.1.112 has **three independent entry points**, all funneling through `vI6` (or `zLK` for partial):

```
┌────────────────────────────────────────────────────────────────────────┐
│                  Per-turn agent loop (yy)                               │
│                  chunks.154.mjs:880-1226                                │
└──────────────┬───────────────────────────┬────────────────────────────┘
               │                           │
   microcompact (every turn)       autocompact (every turn)
   chunks.154.mjs:1006              chunks.154.mjs:1010-1022
               │                           │
               ▼                           ▼
   _c (chunks.85.mjs:1207)        QkK (chunks.159.mjs:1379)
   NO-OP - returns                 1. Gate: DISABLE_COMPACT
   {messages: q}                   2. Gate: failures ≥ 3
                                   3. Gate: shouldCompact (gDY)
                                   4. Gate: rapidRefills ≥ 3
                                   5. ────► vI6 (full compact)


┌────────────────────────────────────────────────────────────────────────┐
│                   Server-driven context_hint                            │
│                   chunks.194.mjs:856-944                                │
└────────────────────────────────────────────────────────────────────────┘
   On 422/424 + context-hint-2026-04-09 beta
       d85 → qD4 (KEEP-RECENT MC) + thinking-clear latch
       Retry the request once with reduced messages


┌────────────────────────────────────────────────────────────────────────┐
│                    Manual /compact and /compact <range>                 │
│                    chunks.167.mjs:2287-2316                             │
└────────────────────────────────────────────────────────────────────────┘
   /compact ─────────────────► vI6 (chunks.159.mjs:574)
   /compact up_to|from <msg> ► zLK (chunks.159.mjs:749, partialCompact)
```

The diagram makes one critical thing obvious: **`_c` (the per-turn microcompact stub) is a no-op**. The actual local message-editing microcompact (`qD4`) only runs on the **error-recovery** path, after the API has refused a request with 422/424 (overflow). This is a behavior change from v2.1.88, where `microcompactMessages()` was supposed to fire pro-actively on every turn (for ant users) via the cached-MC path that never shipped.

---

## Compact Lifecycle (8 Phases)

Both autocompact and `/compact` go through the same `vI6` (`compactConversation`). It executes the following 8 phases in strict order:

### Phase 1: Pre-compact (PreCompact hook + permission switch)

```javascript
// chunks.159.mjs:579-595 (semantic excerpt)
j = vJ(q);                                            // Pre-compact token count
let X = K.getAppState();
_R6(X.toolPermissionContext, "summary");              // Permission switch
K.onCompactProgress?.({type: "hooks_start", hookType: "pre_compact"});
K.setSDKStatus?.("compacting");

let M = await oc({                                    // PreCompact hook
    trigger: A ? "auto" : "manual",
    customInstructions: Y ?? null
}, K.abortController.signal);
ec8(M, K, {suppressNotification: A});                 // Throw if blocked
Y = r_7(Y, M.newCustomInstructions);                  // Merge instructions
let P = M.userDisplayMessage;
```

If the PreCompact hook returns `{decision: "block"}`, `ec8` throws a `BeError` whose message starts with `GI6 = "Compaction blocked by PreCompact hook"`. The dispatcher (`QkK`) catches this prefix and **silently skips without bumping `consecutiveFailures`** — this is intentional, because a user-policy block is not a system failure.

### Phase 2: Build the summary request (`fx8`)

```javascript
let W = !w && u8("tengu_compact_cache_prefix", !0),   // Cache-prefix flag
    D = fx8(Y),                                       // Build prompt
    Z = t8({content: D});                             // Wrap in user message
```

`fx8(customInstructions)` builds the compact prompt — full text in [prompt_builder.md](./prompt_builder.md). It begins with a **CRITICAL: TEXT ONLY** directive, includes a 9-section structured summary template, and appends `customInstructions` plus the `SI4` global trailing reminder.

### Phase 3: LLM call with three retry layers

#### 3a. Cache-prefix optimization (`tengu_compact_cache_prefix`)

If `W = true`, **before** the standard compact call, `ALK` runs a separate inner call through `rP({skipCacheWrite: true, skipTranscript: true})`:

```javascript
// chunks.159.mjs:962-994 (excerpt)
if (w) try {
    let f = await rP({
            promptMessages: [K],            // Just the summary request
            cacheSafeParams: A,             // Reuses upstream cached prefix
            canUseTool: Or1(),              // Stub permission - rejects all tool use
            skipCacheWrite: !0,             // Don't pollute upstream cache
            skipTranscript: !0,
            // ...
        });
    if (validResponse) {
        d("tengu_compact_cache_sharing_success", {cacheHitRate, ...});
        return f;
    }
    d("tengu_compact_cache_sharing_fallback", {reason: "no_text_response", ...});
}
```

This piggy-backs on the existing prompt-cache prefix, saving cache-creation tokens by issuing the compact summary as a normal "fork" against the same cached input. See [cache_prefix_compact.md](./cache_prefix_compact.md).

#### 3b. Standard compact call (`eb6`)

If 3a is disabled or fell back, fire the standard streaming API call:

```javascript
// chunks.159.mjs:1008-1031 (semantic excerpt)
Z = eb6({
    messages: K0(W, O ? [] : z.options.tools),
    systemPrompt: sK(["You are a helpful AI assistant tasked with summarizing conversations."]),
    thinkingConfig: {type: "disabled"},
    tools: O ? [] : X,                              // X = [Kz] (summary stub) or full tools
    options: {
        model: z.options.mainLoopModel,
        maxOutputTokensOverride: Math.min(Po6, lc(z.options.mainLoopModel)),
        querySource: "compact",
        enablePromptCaching: !1
    }
})[Symbol.asyncIterator]();
```

`Or1()` (chunks.159.mjs:937) is the permission stub `Kz` uses — it **denies all tool use** with `"Tool use is not allowed during compaction"`.

#### 3c. PTL truncation retry (`KLK`)

If the response starts with `cI = "Prompt is too long"`, drop ~20% of head messages and retry. Maximum 3 retries (`qLK`):

```javascript
// chunks.159.mjs:608-621
let G = q, k = 0;
for (;;) {
  v = await ALK({messages: G, ...});
  V = MJ6(v);
  if (!V?.startsWith(cI)) break;
  k++;
  let $6 = k <= qLK ? KLK(G, v) : null;
  if (!$6) {
    d("tengu_compact_failed", {reason: "prompt_too_long", ptlAttempts: k});
    throw Error(_LK);  // "Conversation too long. Press esc twice..."
  }
  d("tengu_compact_ptl_retry", {attempt: k, droppedMessages: G.length - $6.length});
  G = $6;
}
```

`KLK` reads either `Rh8(error)` (an explicit byte-count delta from the API error) or defaults to `Math.floor(messages.length * 0.2)`. If the truncated message starts with assistant content, an `ayK` meta-message is inserted as `messages[0]` to mark the truncation: `"[earlier conversation truncated for compaction retry]"`.

### Phase 4: Post-compact reconstruction

```javascript
// chunks.159.mjs:638-652 (excerpt)
let N = pe6(K.readFileState);                    // Snapshot file state
K.readFileState.clear();                         // Clear it
K.loadedNestedMemoryPaths?.clear();              // Clear loaded memory
sj6(K.memorySelector);                           // Reset memory selector

let [R, h] = await Promise.all([
  Nx8(N, K, kx8 /* =5 */),                       // Restore last 5 files
  hx8(K),                                        // Re-attach task statuses
]);
let C = [...R, ...h];

if (Ex8Result = Ex8(K.agentId)) C.push(Ex8Result);    // Plan attachment
if (Lx8Result = await Lx8(K))   C.push(Lx8Result);    // Async-agent attachment
if (yx8Result = yx8(K.agentId)) C.push(yx8Result);    // Skill attachment
```

The `kx8 = 5`, `yDY = 50000`, `LDY = 5000`, `RDY = 25000`, `hDY = 5000` constants exactly mirror v2.1.88's `POST_COMPACT_*` constants. Files are sorted by access timestamp, internal/temp files filtered, and the per-file truncation is applied before the aggregate budget gate.

See [state_preservation.md](./state_preservation.md) for collector deep-dives.

### Phase 5: System reminders re-injected

```javascript
// chunks.159.mjs:653-664 (excerpt)
for (let r of MR6(K.options.tools, K.options.mainLoopModel, [], {callSite: "compact_full"}))
  C.push(Y4(r));                                 // deferred_tools_delta
for (let r of PR6(K, []))
  C.push(Y4(r));                                 // agent_listing_delta
for (let r of WR6(K.options.mcpClients, K.options.tools, K.options.mainLoopModel, []))
  C.push(Y4(r));                                 // mcp_instructions_delta
```

These are the same "system reminder" deltas that fire during normal turns — they tell the model what tools, agents, and MCP servers are currently available. After compact they fire as if it were a fresh session (`isInitial: true`).

### Phase 6: SessionStart hook fires under "compact" source

```javascript
K.onCompactProgress?.({type: "hooks_start", hookType: "session_start"});
let S = await lR("compact", {model: K.options.mainLoopModel});
```

This is the same SessionStart hook that runs when a fresh session begins — `lR("compact", ...)` lets it know the trigger is post-compact rather than fresh-start. Hook outputs are appended to the attachment list.

### Phase 7: Boundary marker + telemetry

```javascript
// chunks.159.mjs:670-708 (excerpt)
let F = Math.round(performance.now() - J);
let U = p18(A ? "auto" : "manual", j ?? 0, q.at(-1)?.uuid);  // Boundary marker
let g = rc(q);                                                // Pre-compact discovered tools
if (g.size > 0) U.compactMetadata.preCompactDiscoveredTools = [...g].sort();

let l = [t8({
    content: b18(V, z, c, void 0, n),
    isCompactSummary: !0,
    isVisibleInTranscriptOnly: !0,                            // ← NOT sent to API after this
})];
let z6 = sI([v]);                                             // Planned post-compact tokens
let A6 = qT([U, ...l, ...C, ...S]);                           // True post-compact tokens
U.compactMetadata.postTokens = A6;
U.compactMetadata.durationMs = F;

d("tengu_compact", {
    preCompactTokenCount: j,
    postCompactTokenCount: z6,
    truePostCompactTokenCount: A6,
    autoCompactThreshold: O?.autoCompactThreshold ?? -1,
    willRetriggerNextTurn: O !== void 0 && A6 >= O.autoCompactThreshold,
    isAutoCompact: A,
    queryChainId: K.queryTracking?.chainId ?? "",
    isRecompactionInChain: O?.isRecompactionInChain ?? !1,
    turnsSincePreviousCompact: O?.turnsSincePreviousCompact ?? -1,
    previousCompactTurnId: O?.previousCompactTurnId ?? "",
    compactionInputTokens: e?.input_tokens,
    compactionOutputTokens: e?.output_tokens,
    compactionCacheReadTokens: e?.cache_read_input_tokens ?? 0,
    compactionCacheCreationTokens: e?.cache_creation_input_tokens ?? 0,
    promptCacheSharingEnabled: W,
    // ...
});
```

The **`willRetriggerNextTurn`** field is the post-compact health check — when true, the next turn will trip autocompact again, which is what the rapid-refill breaker counts.

### Phase 8: PostCompact hook + return

```javascript
let O6 = await K36({trigger: A ? "auto" : "manual", compactSummary: V}, K.abortController.signal);
let J6 = [P, O6.userDisplayMessage].filter(Boolean).join("\n");
return {
    boundaryMarker: U,
    summaryMessages: l,
    attachments: C,
    hookResults: S,
    userDisplayMessage: J6 || void 0,
    preCompactTokenCount: j,
    postCompactTokenCount: z6,
    truePostCompactTokenCount: A6,
    compactionUsage: e
};
```

---

## Two Circuit Breakers (`QkK` Gates 2 and 4)

The autocompact pipeline has **two independent circuit breakers**, both with threshold 3:

| Breaker | Constant | Trips when | User-facing? |
|---------|----------|------------|--------------|
| Consecutive-failure | `wLK = 3` | LLM call failed (non-PreCompact, non-abort) 3× in a row | No — silent skip. Logs "circuit breaker tripped" |
| Rapid-refill | `jLK = 3` within `a_7 = 3` turn window | Compaction succeeded but next compaction fired within ≤2 turns of the previous, 3× in a row | Yes — yields `okK` "thrashing" error |

The rapid-refill breaker exists because successful compaction that *immediately* triggers another compaction means a single tool result (or a single user message) is so large that the post-compact context starts already-near-threshold — compacting the same content N times in a row achieves nothing but burns input tokens. The error message:

```
Autocompact is thrashing: the context refilled to the limit within 3 turns of the previous compact, 3 times in a row. A file being read or a tool output is likely too large for the context window. Try reading in smaller chunks, or use /clear to start fresh.
```

See [edge_cases_and_failures.md](./edge_cases_and_failures.md) for the breaker code and reset semantics.

---

## State Anchoring — The "Magic" of Claude Code Compact

The "Magic" of Claude Code's compaction is not just summarization — it's **State Anchoring**. By explicitly re-injecting the plan file, active subagent tasks, recently-read files, invoked skills, and current tool/agent/MCP listings after every compaction, the agent never "forgets" what it was doing, even if the detailed conversation history of how it got there is compressed into a 1–2 paragraph summary.

The architecture is:

```
[boundary marker]                            ← system message, type=compact_boundary
[summary user message (isVisibleInTranscriptOnly: true)]   ← LLM-produced 2-3KB summary
[attachment: file content]   × up to 5
[attachment: task_status]    × N
[attachment: invoked_skills] × 1 (if any)
[attachment: plan_file_reference] × 1 (if plan mode)
[attachment: plan_mode]      × 1 (if plan mode)
[attachment: deferred_tools_delta] × 0..1
[attachment: agent_listing_delta]  × 0..1
[attachment: mcp_instructions_delta] × 0..1
[hook result message] × N (from SessionStart)
```

The "summary user message" carries `isVisibleInTranscriptOnly: true` — it shows up in the JSONL transcript but is **not sent to the API** in subsequent turns. The model's understanding of the past comes through the *next* user-message that gets sent (which is the post-compact attachments + the summary, as serialized into `b18`-formatted text by the message-builder pipeline).

---

## Code Excerpt: `vI6` (compactConversation) Top-Level

```javascript
// ============================================
// compactConversation - Full LLM-based compact pipeline (8 phases)
// Location: chunks.159.mjs:574-747
// ============================================

// ORIGINAL (for source lookup):
async function vI6(q, K, _, z, Y, A = !1, O, w = !1) {
    let $, j, H, J = performance.now();
    try {
        if (q.length === 0) throw Error(QI6);
        j = vJ(q);
        let X = K.getAppState();
        _R6(X.toolPermissionContext, "summary"), K.onCompactProgress?.({type:"hooks_start",hookType:"pre_compact"}), K.setSDKStatus?.("compacting");
        let M = await oc({trigger:A?"auto":"manual",customInstructions:Y??null}, K.abortController.signal);
        ec8(M, K, {suppressNotification:A}), Y = r_7(Y, M.newCustomInstructions);
        // ... PHASES 2-8 ...
        return {boundaryMarker:U, summaryMessages:l, attachments:C, hookResults:S, userDisplayMessage:J6||void 0,
                preCompactTokenCount:j, postCompactTokenCount:z6, truePostCompactTokenCount:A6, compactionUsage:e};
    } catch (X) { if ($=X instanceof Error?X.message:"compaction failed", !A) YLK(X,K); throw X }
    finally { /* always: clear streamMode, fire compact_end progress, log telemetry */ }
}

// READABLE (for understanding):
async function compactConversation(messages, sessionContext, deps, originalLastUuid, customInstructions, isAuto = false, recompactionInfo, stripNonEssential = false) {
  let errorMessage, preCompactTokenCount, postCompactTokenCount, startTime = performance.now();
  try {
    if (messages.length === 0) throw Error(NO_MESSAGES_TO_COMPACT_MSG);
    preCompactTokenCount = estimateMessageTokens(messages);
    const appState = sessionContext.getAppState();

    switchPermissionContext(appState.toolPermissionContext, "summary");
    sessionContext.onCompactProgress?.({type:"hooks_start", hookType:"pre_compact"});
    sessionContext.setSDKStatus?.("compacting");

    // PHASE 1: PreCompact hook
    const hookResult = await preCompactHook({trigger: isAuto ? "auto" : "manual", customInstructions: customInstructions ?? null}, sessionContext.abortController.signal);
    throwIfPreCompactBlocked(hookResult, sessionContext, {suppressNotification: isAuto});
    customInstructions = mergeInstructions(customInstructions, hookResult.newCustomInstructions);
    const preHookDisplayMessage = hookResult.userDisplayMessage;

    // PHASE 2: Build prompt
    sessionContext.setStreamMode?.("requesting");
    sessionContext.resetResponseLength?.();
    sessionContext.onCompactProgress?.({type:"compact_start"});

    const cachePrefixEnabled = !stripNonEssential && featureGate("tengu_compact_cache_prefix", true);
    const summaryPrompt = compactPromptBuilder(customInstructions);
    const summaryRequest = makeUserMessage({content: summaryPrompt});

    // PHASE 3: LLM call with PTL retry loop (3a/3b/3c bundled in ALK)
    let messagesForCompact = messages;
    let cacheSafeParams = deps;
    let lastResponse, summaryText, ptlAttempts = 0;
    while (true) {
      lastResponse = await innerCompactCall({
        messages: messagesForCompact, summaryRequest, appState,
        context: sessionContext, preCompactTokenCount, cacheSafeParams, stripNonEssential
      });
      summaryText = extractSummaryText(lastResponse);
      if (!summaryText?.startsWith(PTL_PREFIX)) break;

      ptlAttempts++;
      const truncated = ptlAttempts <= PTL_RETRY_LIMIT ? truncateHeadForPTLRetry(messagesForCompact, lastResponse) : null;
      if (!truncated) {
        emit("tengu_compact_failed", {reason:"prompt_too_long", preCompactTokenCount, promptCacheSharingEnabled:cachePrefixEnabled, ptlAttempts});
        throw Error(PTL_FAILURE_MSG);
      }
      emit("tengu_compact_ptl_retry", {attempt:ptlAttempts, droppedMessages:messagesForCompact.length-truncated.length, remainingMessages:truncated.length});
      messagesForCompact = truncated;
      cacheSafeParams = {...cacheSafeParams, forkContextMessages: truncated};
    }

    if (!summaryText) { /* throw */ }
    if (isAPIErrorMessage(summaryText)) { /* throw */ }

    // PHASE 4: Post-compact reconstruction
    const preservedReadFiles = preserveReadFileState(sessionContext.readFileState);
    sessionContext.readFileState.clear();
    sessionContext.loadedNestedMemoryPaths?.clear();
    resetMemorySelector(sessionContext.memorySelector);

    const [restoredFiles, taskStatuses] = await Promise.all([
      restoreFilesPostCompact(preservedReadFiles, sessionContext, MAX_FILES_TO_RESTORE),
      loadTaskStatusAttachments(sessionContext),
    ]);
    let attachments = [...restoredFiles, ...taskStatuses];

    // Plan, async-agent, skills
    const plan = collectPlanAttachment(sessionContext.agentId);     if (plan) attachments.push(plan);
    const async = await collectAsyncAgentAttachment(sessionContext); if (async) attachments.push(async);
    const skills = collectInvokedSkillsAttachment(sessionContext.agentId); if (skills) attachments.push(skills);

    // PHASE 5: System reminders
    for (const r of buildDeferredToolsReminder(sessionContext.options.tools, sessionContext.options.mainLoopModel, [], {callSite:"compact_full"}))
      attachments.push(wrapAttachment(r));
    for (const r of buildAgentListingReminder(sessionContext, []))
      attachments.push(wrapAttachment(r));
    for (const r of buildMcpInstructionsReminder(sessionContext.options.mcpClients, sessionContext.options.tools, sessionContext.options.mainLoopModel, []))
      attachments.push(wrapAttachment(r));

    // PHASE 6: SessionStart hook
    sessionContext.onCompactProgress?.({type:"hooks_start", hookType:"session_start"});
    const sessionStartResults = await sessionStartHook("compact", {model: sessionContext.options.mainLoopModel});

    // PHASE 7: Boundary marker + telemetry
    const durationMs = Math.round(performance.now() - startTime);
    const boundaryMarker = createCompactBoundaryMessage(isAuto ? "auto" : "manual", preCompactTokenCount ?? 0, messages.at(-1)?.uuid);
    const discoveredTools = collectPreCompactDiscoveredTools(messages);
    if (discoveredTools.size > 0) boundaryMarker.compactMetadata.preCompactDiscoveredTools = [...discoveredTools].sort();

    const transcriptPath = currentTranscriptPath();
    const replContexts = isReplActive() && getReplContexts(sessionContext.getAppState().replContexts, sessionContext.agentId);
    const summaryMessages = [makeUserMessage({
      content: compactSummaryContent(summaryText, originalLastUuid, transcriptPath, undefined, replContexts),
      isCompactSummary: true,
      isVisibleInTranscriptOnly: true,
    })];
    const plannedPostTokens = sumApiResponseTokens([lastResponse]);
    const truePostTokens = exactTokenCount([boundaryMarker, ...summaryMessages, ...attachments, ...sessionStartResults]);
    boundaryMarker.compactMetadata.postTokens = truePostTokens;
    boundaryMarker.compactMetadata.durationMs = durationMs;
    postCompactTokenCount = truePostTokens;

    const apiUsage = extractApiUsage(lastResponse);
    const querySource = recompactionInfo?.querySource ?? sessionContext.options.querySource ?? "unknown";
    emit("tengu_compact", {
      preCompactTokenCount, stripNonEssential, postCompactTokenCount: plannedPostTokens, truePostCompactTokenCount: truePostTokens,
      autoCompactThreshold: recompactionInfo?.autoCompactThreshold ?? -1,
      willRetriggerNextTurn: recompactionInfo !== undefined && truePostTokens >= recompactionInfo.autoCompactThreshold,
      isAutoCompact: isAuto, querySource, queryChainId: sessionContext.queryTracking?.chainId ?? "", queryDepth: sessionContext.queryTracking?.depth ?? -1,
      isRecompactionInChain: recompactionInfo?.isRecompactionInChain ?? false,
      turnsSincePreviousCompact: recompactionInfo?.turnsSincePreviousCompact ?? -1,
      previousCompactTurnId: recompactionInfo?.previousCompactTurnId ?? "",
      compactionInputTokens: apiUsage?.input_tokens, compactionOutputTokens: apiUsage?.output_tokens,
      compactionCacheReadTokens: apiUsage?.cache_read_input_tokens ?? 0,
      compactionCacheCreationTokens: apiUsage?.cache_creation_input_tokens ?? 0,
      promptCacheSharingEnabled: cachePrefixEnabled,
      // ... custom stats from collectCompactStats
    });
    if (isReplBeingUsed()) clearReplVMState(sessionContext.options.querySource ?? "compact", sessionContext.agentId);

    // PHASE 8: PostCompact hook
    setPendingPostCompactionFlag();
    reAppendSessionMetadata();
    sessionContext.onCompactProgress?.({type:"hooks_start", hookType:"post_compact"});
    const postHookResult = await postCompactHook({trigger: isAuto ? "auto" : "manual", compactSummary: summaryText}, sessionContext.abortController.signal);
    const userDisplayMessage = [preHookDisplayMessage, postHookResult.userDisplayMessage].filter(Boolean).join("\n");

    return {
      boundaryMarker, summaryMessages, attachments, hookResults: sessionStartResults,
      userDisplayMessage: userDisplayMessage || undefined,
      preCompactTokenCount, postCompactTokenCount: plannedPostTokens,
      truePostCompactTokenCount: truePostTokens, compactionUsage: apiUsage
    };
  } catch (err) {
    if (errorMessage = err instanceof Error ? err.message : "compaction failed", !isAuto) showCompactErrorToUser(err, sessionContext);
    throw err;
  } finally {
    sessionContext.setStreamMode?.("requesting"); sessionContext.resetResponseLength?.();
    sessionContext.onCompactProgress?.({type:"compact_end"});
    emitTelemetryCompactionEvent({trigger: isAuto?"auto":"manual", success: !errorMessage, durationMs: performance.now()-startTime, preTokens: preCompactTokenCount, postTokens: postCompactTokenCount, error: errorMessage});
    sessionContext.setSDKStatus?.(null, {compactResult: errorMessage?"failed":"success", ...errorMessage&&{compactError: errorMessage}});
  }
}

// Mapping: vI6→compactConversation, q→messages, K→sessionContext, _→deps, z→originalLastUuid,
//          Y→customInstructions, A→isAuto, O→recompactionInfo, w→stripNonEssential,
//          oc→preCompactHook, ec8→throwIfPreCompactBlocked, r_7→mergeInstructions,
//          fx8→compactPromptBuilder, ALK→innerCompactCall, MJ6→extractSummaryText,
//          KLK→truncateHeadForPTLRetry, pe6→preserveReadFileState, sj6→resetMemorySelector,
//          Nx8→restoreFilesPostCompact, hx8→loadTaskStatusAttachments, kx8→MAX_FILES_TO_RESTORE,
//          Ex8→collectPlanAttachment, Lx8→collectAsyncAgentAttachment, yx8→collectInvokedSkillsAttachment,
//          MR6→buildDeferredToolsReminder, PR6→buildAgentListingReminder, WR6→buildMcpInstructionsReminder,
//          Y4→wrapAttachment, lR→sessionStartHook, p18→createCompactBoundaryMessage,
//          rc→collectPreCompactDiscoveredTools, b18→compactSummaryContent, sI→sumApiResponseTokens,
//          qT→exactTokenCount, aI→extractApiUsage, K36→postCompactHook, GD6→setPendingPostCompactionFlag,
//          DR6→reAppendSessionMetadata, aK6→emitTelemetryCompactionEvent
```

---

## Algorithm Deep-Dive: Why Three Retry Layers?

The compact LLM call is unusual because it operates on a *very long* input prompt. Three classes of failure are common, and each has a dedicated mitigation:

### Failure A: Cold cache → expensive cache_creation
**Mitigation: Cache-prefix sharing (3a)**

When a session is mid-stream and the prompt cache is warm, the entire pre-compact prompt is already cached upstream. Sending a new "summary" request would normally invalidate the cache. By using `rP({skipCacheWrite: true})`, the compact call **reads** from the cache without writing — the upstream cache still services subsequent turns at cache-hit prices.

This optimization is gated by `tengu_compact_cache_prefix` (default true) and **disabled** when stripping non-essential content (cold compact, see [cold_compact.md](./cold_compact.md)).

### Failure B: Even the compact prompt is too long
**Mitigation: PTL truncation retry (3c)**

A 200K-token conversation that triggers compact contains the full 200K prompt sent to the compact agent. The compact agent's max-output is bounded by `Math.min(Po6, lc(model))`, so the agent itself has room. But if the user has run with `CLAUDE_CODE_AUTO_COMPACT_WINDOW=1000000` and the model only supports 200K, the compact request will return `"Prompt is too long"`.

`KLK` drops ~20% of message head and retries up to 3 times. Each retry tracks the dropped count for telemetry (`tengu_compact_ptl_retry`).

### Failure C: Network blip, rate limit, model quota
**Mitigation: Standard error handling**

Caught at the `try`/`catch` level in `vI6`. Increments `consecutiveFailures`. If the count hits 3, the consecutive-failure breaker disables future autocompact for this session until a successful call resets it.

User-abort errors (`at = "API Error: Request was aborted."`) are **not** counted as failures — `p86(M, at)` filter excludes them.

---

## Key Insight

The "Magic" of Claude Code's compaction is not just summarization, but **State Anchoring**. By explicitly re-injecting the plan file, active subagent tasks, recently-read files, and invoked skills after every compaction, the agent never "forgets" what it was doing, even if the detailed conversation history of how it got there is compressed into a 1–2 paragraph summary.

The companion insight in v2.1.112 is **Latched Server-Side Recovery**. The new `context-hint-2026-04-09` beta makes the API itself a participant in overflow recovery — when the local heuristic under-counts, the server returns 422/424 with enough info for the client to surgically clear thinking blocks (one-shot, latched per session) and old tool results, then retry the same request once. This is a deliberate hedge: local heuristics are fast but imperfect; the server can be slower but authoritative.
