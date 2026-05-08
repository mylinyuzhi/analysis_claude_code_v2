# Standard Compaction (`vI6`) — The Full LLM Compact Pipeline

## Overview

`vI6` (also known as `compactConversation`) is the heart of compaction in Claude Code v2.1.112. Both autocompact (`QkK`) and `/compact` go through it. It implements an 8-phase pipeline that includes a PreCompact hook, prompt construction, three-layer LLM call retry, post-compact state restoration, system reminder re-injection, SessionStart hook, boundary marker creation, telemetry emission, and a PostCompact hook.

It is the most important function in the compact subsystem — every other path either reduces to it (auto/manual) or runs alongside it (server-driven `context_hint`).

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Compact module
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Telemetry, API

Key functions in this document:
- `compactConversation` (`vI6`) — chunks.159.mjs:574 — Main pipeline
- `innerCompactCall` (`ALK`) — chunks.159.mjs:948 — LLM call wrapper
- `extractSummaryText` (`MJ6`) — chunks.165.mjs:2034
- `truncateHeadForPTLRetry` (`KLK`) — chunks.159.mjs:512
- `permissionStubForCompactAgent` (`Or1`) — chunks.159.mjs:937
- `mergeInstructions` (`r_7`) — chunks.159.mjs:566
- `apiCall` (`eb6`) — chunks.159.mjs (referenced)
- `cachePrefixCall` (`rP`) — referenced
- `summaryStubTool` (`Kz`) — wraps `Or1()` permission

---

## 1. The Function Signature

```javascript
async function vI6(
  q,            // messages — array of conversation messages to compact
  K,            // sessionContext — has appState, abortController, options, callbacks
  _,            // deps — cacheSafeParams (forkContextMessages, systemPrompt, userContext, ...)
  z,            // suppressFollowUpQuestions — when true, summary gets "Continue without acknowledging" trailer
  Y,            // customInstructions — user-provided text or null
  A = false,    // isAuto — true for autocompact, false for /compact
  O,            // recompactionInfo — set by autocompact dispatcher; undefined for /compact
  w = false     // stripNonEssential — cold-cache mode (no images, no tools, no docs)
)
```

> **Note on parameter naming**: Earlier drafts of this analysis labeled the 4th argument as `originalLastUuid`. Cross-validation against the source-tree (`compact.ts:387-395`) shows the correct name is `suppressFollowUpQuestions`. It's a boolean that controls whether the post-compact summary message includes the "Continue from where you left off without asking..." trailer (`getCompactUserSummaryMessage`'s 2nd arg). Autocompact passes `true` (silently continue); manual `/compact` passes `false` (let the model respond conversationally).

The function returns:

```typescript
{
  boundaryMarker: SystemMessage,            // The compact_boundary marker
  summaryMessages: [UserMessage],           // [the summary user message, isVisibleInTranscriptOnly: true]
  attachments: AttachmentMessage[],         // restored files, tasks, plans, skills, system reminders
  hookResults: AttachmentMessage[],         // SessionStart hook outputs
  userDisplayMessage?: string,              // PreCompact + PostCompact hook user-facing messages
  preCompactTokenCount: number,             // tokens before compaction
  postCompactTokenCount: number,            // planned (LLM response token count)
  truePostCompactTokenCount: number,        // actual after attaching everything
  compactionUsage: ApiUsage                 // input/output/cache token counts from the API call
}
```

---

## 2. Phase 1: Pre-Compact Setup + PreCompact Hook

```javascript
// chunks.159.mjs:579-595
let $, j, H, J = performance.now();
try {
    if (q.length === 0) throw Error(QI6);              // QI6 = "Not enough messages to compact."
    j = vJ(q);                                          // estimateMessageTokens
    let X = K.getAppState();
    _R6(X.toolPermissionContext, "summary"),            // Switch permission context to "summary"
    K.onCompactProgress?.({type:"hooks_start", hookType:"pre_compact"}),
    K.setSDKStatus?.("compacting");

    let M = await oc({                                  // PreCompact hook
        trigger: A ? "auto" : "manual",
        customInstructions: Y ?? null
    }, K.abortController.signal);
    ec8(M, K, {suppressNotification: A}),               // Throws GI6-prefixed error if blocked
    Y = r_7(Y, M.newCustomInstructions);                // Merge user + hook instructions
    let P = M.userDisplayMessage;
```

### `_R6(toolPermissionContext, "summary")` — Permission Switch

`_R6` ostensibly switches the agent's permission mode to `"summary"`. In the shipped binary this function is **a no-op** (chunks.100.mjs:2172-2174):

```javascript
async function _R6(q, K) {
    return
}
```

The actual permission restriction is applied by the LLM call configuration (`tools: [Kz]` and `Or1()` — see Phase 3b below), not by this function. The call site is preserved for forward compatibility — earlier versions may have done meaningful permission-context switching here.

### `oc()` — PreCompact Hook

`oc` (chunks.192.mjs:2406-2443) executes any user-registered PreCompact hooks. The hook input includes `hook_event_name: "PreCompact"` and the trigger ("auto" or "manual"). Hook output may contain:
- `newCustomInstructions` — appended to user instructions (joined with `\n`)
- `userDisplayMessage` — shown to user (combined with PostCompact's display message at the end)
- `blockedBy` — non-empty array means at least one hook returned `decision: "block"`

### `ec8()` — Throw if Blocked

```javascript
function ec8(q, K, _) {
    if (!q.blockedBy) return;
    if (E(`Compaction blocked by PreCompact hook: ${q.blockedBy}`, {level: "warn"}),
        !_?.suppressNotification)
        K.addNotification?.({
            key: "compaction-blocked-by-hook",
            text: "compaction blocked by PreCompact hook",
            priority: "immediate",
            color: "warning"
        });
    throw new be(`${GI6}: ${q.blockedBy}`)
}
```

`GI6 = "Compaction blocked by PreCompact hook"` — the dispatcher (`QkK`) catches errors whose message starts with `GI6` and returns `{wasCompacted: false}` **without** incrementing `consecutiveFailures`. So PreCompact-blocked is a no-op, not a failure.

When `suppressNotification: false` (manual `/compact`), the user sees a notification. When `suppressNotification: true` (autocompact), the user just continues without seeing the block — autocompact is a background optimization and shouldn't surface user-policy blocks as notifications.

### `r_7()` — Merge Custom Instructions

```javascript
function r_7(q, K) {
    if (!K) return q || void 0;
    if (!q) return K;
    return `${q}\n\n${K}`
}
```

User instructions come first, hook-injected instructions append with double newline.

---

## 3. Phase 2: Build the Summary Request

```javascript
// chunks.159.mjs:597-606
K.setStreamMode?.("requesting"), K.resetResponseLength?.(),
K.onCompactProgress?.({type: "compact_start"});
let W = !w && u8("tengu_compact_cache_prefix", !0),    // Cache-prefix flag
    D = fx8(Y),                                         // Build prompt
    Z = t8({content: D}),                               // Wrap as user message
    G = q,                                              // Initial messages for retry loop
    f = _,                                              // Initial cacheSafeParams
    v, V, k = 0;
```

`fx8(customInstructions)` is the prompt builder. See [prompt_builder.md](./prompt_builder.md) for the full prompt text. The key constraints baked into the prompt:

- "CRITICAL: Respond with TEXT ONLY. Do NOT call any tools."
- 9-section structured summary template (`Primary Request and Intent`, `Key Technical Concepts`, `Files and Code Sections`, `Errors and fixes`, `Problem Solving`, `All user messages`, `Pending Tasks`, `Current Work`, `Optional Next Step`)
- Trailing `SI4` global reminder

The cache-prefix flag (`W = tengu_compact_cache_prefix && !stripNonEssential`) controls whether the cache-prefix optimization (Phase 3a) runs.

---

## 4. Phase 3: The Three-Layer LLM Call

This phase has three sub-stages:

| Sub-Phase | When | Mechanism | Output |
|-----------|------|-----------|--------|
| 3a. Cache-prefix call | `tengu_compact_cache_prefix` enabled | Inner `rP({skipCacheWrite: true})` against cached prefix | If valid response, return immediately; else fall through |
| 3b. Standard streaming call | Always | `eb6({...})` async iterator | Drives the assistant turn through `H` |
| 3c. PTL truncation retry | Response starts with `cI = "Prompt is too long"` | Drop ~20% of head via `KLK`, retry up to 3 times | Either succeed or throw `_LK` |

### Outer Loop

```javascript
// chunks.159.mjs:608-621
for (;;) {
    if (v = await ALK({                              // Inner: 3a + 3b
            messages: G,
            summaryRequest: Z,
            appState: X,
            context: K,
            preCompactTokenCount: j,
            cacheSafeParams: f,
            stripNonEssential: w
        }), V = MJ6(v), !V?.startsWith(cI)) break;   // Success: not PTL
    k++;
    let $6 = k <= qLK ? KLK(G, v) : null;            // PTL: try truncation up to 3 times
    if (!$6) throw d("tengu_compact_failed", {
        reason: "prompt_too_long",
        preCompactTokenCount: j,
        promptCacheSharingEnabled: W,
        ptlAttempts: k
    }), Error(_LK);                                  // _LK = "Conversation too long..."
    d("tengu_compact_ptl_retry", {
        attempt: k,
        droppedMessages: G.length - $6.length,
        remainingMessages: $6.length
    }), G = $6, f = {...f, forkContextMessages: $6}
}
if (!V) throw E(`Compact failed: no summary text in response. Response: ${I6(v)}`,
                {level: "error"}),
                d("tengu_compact_failed", {reason: "no_summary", ...}),
                Error("Failed to generate conversation summary - response did not contain valid text content");
else if (fp(V)) throw d("tengu_compact_failed", {reason: "api_error", ...}),
                       Error(V);
```

### `ALK` — The Inner Call (Phases 3a + 3b)

```javascript
// ============================================
// innerCompactCall - Wraps the cache-prefix optimization + standard streaming call
// Location: chunks.159.mjs:948-1055
// ============================================

// ORIGINAL (excerpt — full body in research notes):
async function ALK({messages: q, summaryRequest: K, appState: _, context: z,
                    preCompactTokenCount: Y, cacheSafeParams: A, stripNonEssential: O = !1}) {
    let w = !O && u8("tengu_compact_cache_prefix", !0),
        $ = AkK() ? setInterval((j) => {
            YkK(), j?.("compacting")
        }, 30000, z.setSDKStatus) : void 0;
    try {
        // PHASE 3a: Cache-prefix attempt
        if (w) try {
            let f = await rP({
                    promptMessages: [K],
                    cacheSafeParams: A,
                    canUseTool: Or1(),
                    querySource: "compact",
                    forkLabel: "compact",
                    maxTurns: 1,
                    maxOutputTokens: Math.min(Po6, lc(z.options.mainLoopModel)),
                    skipCacheWrite: !0,
                    skipTranscript: !0,
                    overrides: {abortController: z.abortController}
                }),
                v = fM(f.messages),
                V = v ? MJ6(v) : null;
            if (v && V && !v.isApiErrorMessage) {
                if (!V.startsWith(cI)) d("tengu_compact_cache_sharing_success", {
                    preCompactTokenCount: Y,
                    outputTokens: f.totalUsage.output_tokens,
                    cacheReadInputTokens: f.totalUsage.cache_read_input_tokens,
                    cacheCreationInputTokens: f.totalUsage.cache_creation_input_tokens,
                    cacheHitRate: f.totalUsage.cache_read_input_tokens > 0 ?
                        f.totalUsage.cache_read_input_tokens /
                        (f.totalUsage.cache_read_input_tokens +
                         f.totalUsage.cache_creation_input_tokens +
                         f.totalUsage.input_tokens) : 0
                });
                return v;                    // ← early return on success
            }
            E(`Compact cache sharing: no text in response, falling back. Response: ${I6(v)}`,
              {level: "warn"}),
              d("tengu_compact_cache_sharing_fallback", {reason: "no_text_response", preCompactTokenCount: Y})
        } catch (f) {
            j6(f), d("tengu_compact_cache_sharing_fallback", {reason: "error", preCompactTokenCount: Y})
        }

        // PHASE 3b: Standard streaming call
        let j = !1, H;
        z.resetResponseLength?.();
        let X = !O && await l38(z.options.mainLoopModel, z.options.tools,
                                  async () => _.toolPermissionContext,
                                  z.options.agentDefinitions.activeAgents, "compact")
                ? j2([Kz, r58, ...z.options.tools.filter((f) => f.isMcp)], "name")
                : [Kz],
            M = [...H2(q), K],
            P = Ar1(Gx8(O ? SDY(M) : M)),
            W = O ? CDY(P) : P,
            Z = eb6({
                messages: K0(W, O ? [] : z.options.tools),
                systemPrompt: sK(["You are a helpful AI assistant tasked with summarizing conversations."]),
                thinkingConfig: {type: "disabled"},
                tools: O ? [] : X,
                signal: z.abortController.signal,
                options: {
                    async getToolPermissionContext() { return z.getAppState().toolPermissionContext },
                    model: z.options.mainLoopModel,
                    toolChoice: void 0,
                    isNonInteractiveSession: z.options.isNonInteractiveSession,
                    hasAppendSystemPrompt: !!z.options.appendSystemPrompt,
                    maxOutputTokensOverride: Math.min(Po6, lc(z.options.mainLoopModel)),
                    querySource: "compact",
                    agents: z.options.agentDefinitions.activeAgents,
                    mcpTools: [],
                    effortValue: _.effortValue,
                    enablePromptCaching: !1
                }
            })[Symbol.asyncIterator](),
            G = await Z.next();
        while (!G.done) {
            let f = G.value;
            if (!j && f.type === "stream_event" && f.event.type === "content_block_start"
                && f.event.content_block.type === "text") j = !0, z.setStreamMode?.("responding");
            if (f.type === "stream_event" && f.event.type === "content_block_delta"
                && f.event.delta.type === "text_delta") {
                let v = f.event.delta.text.length;
                z.addResponseLength?.(v)
            }
            if (f.type === "assistant") H = f;
            G = await Z.next()
        }
        if (H) return H;
        throw E(`Compact streaming failed. hasStartedStreaming=${j}`, {level: "error"}),
              d("tengu_compact_failed", {reason: "no_streaming_response",
                                        preCompactTokenCount: Y, hasStartedStreaming: j,
                                        promptCacheSharingEnabled: w}),
              Error(ql8)                                  // "Compaction interrupted · ..."
    } finally {
        clearInterval($)
    }
}

// Mapping (selective):
// ALK→innerCompactCall, q→messages, K→summaryRequest, _→appState, z→context,
// Y→preCompactTokenCount, A→cacheSafeParams, O→stripNonEssential,
// rP→cachePrefixCall, Or1→permissionStubForCompactAgent, Kz→summaryStubTool,
// l38→shouldExposeRichTools, j2→dedupBy, H2→filterRelevantMessages,
// SDY→stripImagesAndDocs, Gx8→ensureAlternation, Ar1→stripUnusedTools,
// CDY→truncateContents, eb6→apiCall, K0→prepareMessages, sK→buildSystemPrompt,
// MJ6→extractSummaryText, fM→findLastAssistantMessage, fp→isApiErrorString,
// Po6→MAX_COMPACT_OUTPUT_TOKENS, lc→getMaxOutputTokens, ql8→COMPACT_INTERRUPT_MSG
```

### `Or1()` — Tool-Use Reject Stub

```javascript
// ============================================
// permissionStubForCompactAgent - Rejects all tool use during compaction
// Location: chunks.159.mjs:937-946
// ============================================

// ORIGINAL:
function Or1() {
    return async () => ({
        behavior: "deny",
        message: "Tool use is not allowed during compaction",
        decisionReason: {
            type: "other",
            reason: "compaction agent should only produce text summary"
        }
    })
}

// READABLE:
function permissionStubForCompactAgent() {
  return async () => ({
    behavior: "deny",
    message: "Tool use is not allowed during compaction",
    decisionReason: { type: "other", reason: "compaction agent should only produce text summary" }
  });
}
// Mapping: Or1→permissionStubForCompactAgent
```

This is the canPermissionUse callback wired into the compact LLM call. If the model tries to invoke a tool during compaction (despite the prompt telling it not to), the call is rejected with a clear message that the compaction agent should produce text only. Combined with `tools: [Kz]` (only the summary stub) and `thinkingConfig: {type: "disabled"}`, this is **a three-layer defense** against the model deviating from text-only output:

1. **Prompt-level**: "CRITICAL: Respond with TEXT ONLY..." (`fx8`)
2. **API-level**: Only the summary stub tool is offered
3. **Permission-level**: Even the stub tool denies invocation

This three-layer design was added over the v2.1.x line to handle a class of regressions where the compact agent would attempt to re-run searches or read files instead of summarizing.

### `Kz` — The Summary Stub Tool

`Kz` is a tool definition whose only purpose is to occupy the `tools` slot in the API call. The model may attempt to "call" it — which `Or1()` rejects — but since it's the only option in `tools: [Kz]`, the model gets no real tool surface. Combined with `thinkingConfig: {type: "disabled"}`, this forces the model into pure text mode.

### Why disable prompt caching here?

```javascript
enablePromptCaching: !1
```

The compact call's prompt is **a one-shot summarization request that won't repeat in the same form**. Caching the system+request pair would never see a hit and would waste cache-creation tokens. The cache-prefix optimization (Phase 3a) handles cache-related savings differently — it shares the *upstream* cached prefix without writing.

### `KLK` — PTL Truncation

```javascript
// ============================================
// truncateHeadForPTLRetry - Drop head messages on prompt-too-long retry
// Location: chunks.159.mjs:512-531
// ============================================

// ORIGINAL:
function KLK(q, K) {
    let _ = q[0]?.type === "user" && q[0].isMeta && q[0].message.content === ayK ? q.slice(1) : q,
        z = AR6(_);
    if (z.length < 2) return null;
    let Y = Rh8(K),
        A;
    if (Y !== void 0) {
        let w = 0;
        A = 0;
        for (let $ of z)
            if (w += qT($), A++, w >= Y) break
    } else A = Math.max(1, Math.floor(z.length * 0.2));
    if (A = Math.min(A, z.length - 1), A < 1) return null;
    let O = z.slice(A).flat();
    if (O[0]?.type === "assistant") return [t8({
        content: ayK,
        isMeta: !0
    }), ...O];
    return O
}

// READABLE:
function truncateHeadForPTLRetry(messages, errorResponse) {
  // Strip the previously-inserted truncation marker if present
  const stripped = messages[0]?.type === "user" && messages[0].isMeta && messages[0].message.content === PTL_RETRY_MARKER
    ? messages.slice(1) : messages;

  // Group by API round-trip (boundary fires when assistant.message.id changes)
  const groups = groupMessagesByApiRound(stripped);
  if (groups.length < 2) return null;

  // Try to use API-provided byte-count delta; otherwise drop ~20%
  const apiDelta = extractApiTokenDelta(errorResponse);
  let groupsToDrop;
  if (apiDelta !== undefined) {
    let runningTokens = 0;
    groupsToDrop = 0;
    for (const group of groups) {
      runningTokens += exactTokenCount(group);
      groupsToDrop++;
      if (runningTokens >= apiDelta) break;
    }
  } else {
    groupsToDrop = Math.max(1, Math.floor(groups.length * 0.2));
  }

  // Don't drop everything — keep at least one group to summarize
  groupsToDrop = Math.min(groupsToDrop, groups.length - 1);
  if (groupsToDrop < 1) return null;

  // Reconstitute remaining messages
  const remaining = groups.slice(groupsToDrop).flat();

  // If remaining starts with assistant (orphan tool_use after group drop), inject a marker as msg[0]
  // — the API contract requires first message to be role=user.
  if (remaining[0]?.type === "assistant") {
    return [makeUserMessage({content: PTL_RETRY_MARKER, isMeta: true}), ...remaining];
  }
  return remaining;
}

// Mapping: KLK→truncateHeadForPTLRetry, q→messages, K→errorResponse,
//          ayK→PTL_RETRY_MARKER ("[earlier conversation truncated for compaction retry]"),
//          AR6→groupMessagesByApiRound, Rh8→extractApiTokenDelta, qT→exactTokenCount,
//          t8→makeUserMessage
```

**Grouping clarification**: `AR6` (chunks.101.mjs:578) is **not** turn-pair grouping — it's API-round grouping. A boundary fires when a new assistant message has a different `message.id` from the prior one. Source-tree: `groupMessagesByApiRound` in `services/compact/grouping.ts`. Both versions group identically:

```javascript
function groupMessagesByApiRound(messages) {
  const groups = [];
  let current = [];
  let lastAssistantId;
  for (const msg of messages) {
    if (msg.type === "assistant" && msg.message.id !== lastAssistantId && current.length > 0) {
      groups.push(current); current = [msg];
    } else {
      current.push(msg);
    }
    if (msg.type === "assistant") lastAssistantId = msg.message.id;
  }
  if (current.length > 0) groups.push(current);
  return groups;
}
```

The source's `grouping.ts` comment captures the reasoning: API-round grouping is finer than human-turn-pair grouping. Reactive compact and PTL retry need to operate inside single agentic-session turns where one human prompt may span many assistant rounds (SDK, CCR, eval contexts). Boundary-on-assistant-id is the correct granularity for the API's "every tool_use must be resolved before next assistant" contract.

**Key insight**: `KLK` may use the API's own error feedback (`Rh8(errorResponse)`) to compute exactly how many tokens to drop, rather than blindly dropping 20%. If the API reports "you went over by 5,000 tokens", `KLK` can drop just enough API-round groups to free those 5,000 tokens. The 20% fallback is for cases where the API doesn't include a delta in its error (some Vertex/Bedrock error formats lack the byte-count detail).

The `ayK` marker (`"[earlier conversation truncated for compaction retry]"`) is critical: dropping group 0 leaves an `assistant`-first sequence which the API rejects (first message must be `role=user`). Inserting `ayK` as a synthetic user message restores valid alternation. The fork's own `ensureToolResultPairing` (claude.ts:1136 in source) handles any orphaned `tool_result` blocks created by the drop.

---

## 5. Phase 4: Post-Compact Reconstruction

```javascript
// chunks.159.mjs:638-652
let N = pe6(K.readFileState);                   // Snapshot read file state
K.readFileState.clear();                         // Clear it
K.loadedNestedMemoryPaths?.clear();              // Clear loaded memory paths
sj6(K.memorySelector);                           // Reset memory selector

let [R, h] = await Promise.all([
    Nx8(N, K, kx8),                              // Restore last 5 files (LDY=5k each, yDY=50k aggregate)
    hx8(K)                                       // Re-attach task statuses
]);
let C = [...R, ...h];

let x = Ex8(K.agentId);                          // Plan attachment (if plan file exists)
if (x) C.push(x);
let B = await Lx8(K);                            // Async-agent / plan-mode reminder
if (B) C.push(B);
let m = yx8(K.agentId);                          // Invoked skills (RDY=25k aggregate, hDY=5k each)
if (m) C.push(m);
```

Key invariants:

- **`pe6` snapshots before clearing** so we can restore.
- **`Nx8` filters out internal files** via `xDY` and **already-restored files** (this matters when `zLK` partial compact passes a list of recent kept files in `bDY(z)`).
- **Files are sorted by `timestamp` descending**, then sliced to the top `kx8 = 5`. Each file is read fresh (not cached) with `maxTokens: LDY = 5_000`.
- **Aggregate budget `yDY = 50_000`** — when the running total exceeds this, additional files are dropped.

See [state_preservation.md](./state_preservation.md) for detailed walk-throughs of each collector.

---

## 6. Phase 5: System Reminders

```javascript
// chunks.159.mjs:653-664
for (let $6 of MR6(K.options.tools, K.options.mainLoopModel, [], {callSite: "compact_full"}))
    C.push(Y4($6));                              // deferred_tools_delta
for (let $6 of PR6(K, []))
    C.push(Y4($6));                              // agent_listing_delta
for (let $6 of WR6(K.options.mcpClients, K.options.tools, K.options.mainLoopModel, []))
    C.push(Y4($6));                              // mcp_instructions_delta
```

These are the same delta builders that fire during normal turns to communicate added/removed tools, agents, and MCP servers. Critically, they're called with an **empty previous-messages list `[]`** (and `[]` for the third arg of `MR6`/`WR6` and `PR6`), which means they emit "isInitial: true" deltas — the post-compact prompt looks to the model like a fresh session with the current full set of tools/agents/MCP servers visible.

---

## 7. Phase 6: SessionStart Hook

```javascript
// chunks.159.mjs:665-668
K.onCompactProgress?.({type:"hooks_start", hookType:"session_start"});
let S = await lR("compact", {model: K.options.mainLoopModel});
```

`lR("compact", ...)` invokes the SessionStart hook with source `"compact"`. The hook's outputs join the attachment list. This lets users wire init logic that runs both at fresh session start AND at post-compact restart — useful for things like "always re-load the project context" or "always re-print recent task list".

See [hooks_system.md](./hooks_system.md) for hook implementation details.

---

## 8. Phase 7: Boundary Marker + Telemetry

```javascript
// chunks.159.mjs:670-708
let F = Math.round(performance.now() - J);
let U = p18(A ? "auto" : "manual", j ?? 0, q.at(-1)?.uuid);    // Boundary marker
let g = rc(q);                                                  // Pre-compact discovered tools
if (g.size > 0) U.compactMetadata.preCompactDiscoveredTools = [...g].sort();

let c = bY(),                                                   // current transcript path
    n = JJ() && Oa6(K.getAppState().replContexts, K.agentId),   // REPL state cleared flag
    l = [t8({                                                    // The summary user message
        content: b18(V, z, c, void 0, n),                       // Compose summary text
        isCompactSummary: !0,
        isVisibleInTranscriptOnly: !0                            // Doesn't go to API
    })];
let z6 = sI([v]);                                                // planned post-compact tokens (from API response)
let A6 = qT([U, ...l, ...C, ...S]);                              // true post-compact tokens
U.compactMetadata.postTokens = A6;
U.compactMetadata.durationMs = F;
H = A6;

let e = aI(v);                                                   // API usage stats
let i = O?.querySource ?? K.options.querySource ?? "unknown";

d("tengu_compact", {
    preCompactTokenCount: j,
    stripNonEssential: w,
    postCompactTokenCount: z6,
    truePostCompactTokenCount: A6,
    autoCompactThreshold: O?.autoCompactThreshold ?? -1,
    willRetriggerNextTurn: O !== void 0 && A6 >= O.autoCompactThreshold,
    isAutoCompact: A,
    querySource: i,
    queryChainId: K.queryTracking?.chainId ?? "",
    queryDepth: K.queryTracking?.depth ?? -1,
    isRecompactionInChain: O?.isRecompactionInChain ?? !1,
    turnsSincePreviousCompact: O?.turnsSincePreviousCompact ?? -1,
    previousCompactTurnId: O?.previousCompactTurnId ?? "",
    compactionInputTokens: e?.input_tokens,
    compactionOutputTokens: e?.output_tokens,
    compactionCacheReadTokens: e?.cache_read_input_tokens ?? 0,
    compactionCacheCreationTokens: e?.cache_creation_input_tokens ?? 0,
    compactionTotalTokens: e ? e.input_tokens + (e.cache_creation_input_tokens ?? 0) +
                              (e.cache_read_input_tokens ?? 0) + e.output_tokens : 0,
    promptCacheSharingEnabled: W,
    ...(() => { try { return Kx8(qx8(q)) } catch (e) { return j6(e), {} } })()
});

if (iI()) Ne6(K.options.querySource ?? "compact", K.agentId);    // REPL clear if active
GD6(), DR6();                                                     // Set pendingPostCompaction + reAppend metadata
```

### Boundary Marker (`p18`)

```javascript
function p18(q, K, _, z, Y) {
    return {
        type: "system",
        subtype: "compact_boundary",
        content: "Conversation compacted",
        isMeta: !1,
        timestamp: new Date().toISOString(),
        uuid: ZG(),
        level: "info",
        compactMetadata: {
            trigger: q,                  // "auto" or "manual"
            preTokens: K,
            userContext: z,              // Custom user context (only for partial)
            messagesSummarized: Y        // Count of summarized messages (only for partial)
        },
        ..._ && { logicalParentUuid: _ }
    }
}
```

The boundary marker is a system message that survives in the transcript indefinitely. It records the compact *event* — when, what trigger, what pre/post token counts, what duration. When the JSONL transcript is later replayed (e.g. for debugging), the boundary tells the parser "above this line is the summary; below this line is the live conversation".

### Summary Message Composition (`b18`)

```javascript
function b18(q, K, _, z, Y) {
    let O = `This session is being continued from a previous conversation that ran out of context. The summary below covers the earlier portion of the conversation.

${d0z(q)}`;
    if (_) O += `\n\nIf you need specific details from before compaction (like exact code snippets, error messages, or content you generated), read the full transcript at: ${_}`;
    if (z) O += `\n\nRecent messages are preserved verbatim.`;
    if (Y) O += `\n\nYour REPL VM state has been cleared as part of this compaction. Variables defined in REPL calls before this point are no longer accessible — redefine any you still need.`;
    if (K) return `${O}\nContinue the conversation from where it left off without asking the user any further questions. Resume directly — do not acknowledge the summary, do not recap what was happening, do not preface with "I'll continue" or similar. Pick up the last task as if the break never happened.`;
    return O
}
```

Five compositional flags:
- `q` (summary text): always included; `d0z()` strips `<analysis>` tags and normalizes whitespace
- `K` (boolean: include "Continue" instruction): true for full compact (`vI6`), false for partial (`zLK`)
- `_` (transcript path): if non-null, includes recovery instructions
- `z` (recent-preserved flag): true for partial compact ("Recent messages are preserved verbatim")
- `Y` (REPL cleared flag): true if the agent has REPL context that was wiped

The **"Continue without recap"** instruction is the most important. Without it, models have a strong tendency to start with "I see you were working on X. Let me continue by…" which wastes a turn and breaks the user's flow. The directive forces the model to act as if no compact happened.

### `rc` — Pre-Compact Discovered Tools

```javascript
function rc(q) {
    let K = new Set, _ = 0;
    for (let z of q) {
        // Carry forward from previous boundary
        if (z.type === "system" && z.subtype === "compact_boundary") {
            let A = z.compactMetadata?.preCompactDiscoveredTools;
            if (A) { for (let O of A) K.add(O); _ += A.length }
            continue
        }
        // Find tool discovery messages in user content
        if (z.type !== "user") continue;
        let Y = z.message?.content;
        if (!Array.isArray(Y)) continue;
        for (let A of Y)
            if (wZY(A))
                for (let O of A.content)
                    if (OZY(O)) K.add(O.tool_name)
    }
    if (K.size > 0) E(`Dynamic tool loading: found ${K.size} discovered tools in message history`
                      + (_ > 0 ? ` (${_} carried from compact boundary)` : ""));
    return K
}
```

Tools that the agent discovered dynamically (e.g. via `Skill` invocation) are carried across compacts via the boundary marker's `preCompactDiscoveredTools` field. Without this, the model would lose track of skills it had loaded mid-session.

### `qT` — True Post-Compact Token Count

```javascript
function qT(q) {
    let K = 0;
    for (let _ of q) K += ZZY(_);
    return K
}
function ZZY(q) {
    if ((q.type === "assistant" || q.type === "user") && q.message?.content) return gy6(q.message?.content);
    if (q.type === "attachment" && q.attachment) {
        let K = Xz7(q.attachment), _ = 0;
        for (let z of K) _ += gy6(z.message.content);
        return _
    }
    return 0
}
```

Computes the *actual* token count by serializing every message, attachment, and hook result. This is the value that determines `willRetriggerNextTurn` — the rapid-refill counter.

---

## 9. Phase 8: PostCompact Hook + Return

```javascript
// chunks.159.mjs:710-726
K.onCompactProgress?.({type:"hooks_start", hookType: "post_compact"});
let O6 = await K36({
    trigger: A ? "auto" : "manual",
    compactSummary: V
}, K.abortController.signal);
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
}
```

The `K36` PostCompact hook runs after everything else is set up. Unlike PreCompact, it cannot block — it's purely informational. Its only output is a `userDisplayMessage` that joins with PreCompact's display message and is shown to the user above the next prompt.

---

## 10. The `finally` Block

```javascript
} catch (X) {
    if ($ = X instanceof Error ? X.message : "compaction failed", !A) YLK(X, K);
    throw X
} finally {
    K.setStreamMode?.("requesting"),
    K.resetResponseLength?.(),
    K.onCompactProgress?.({type:"compact_end"}),
    aK6({
        trigger: A ? "auto" : "manual",
        success: !$,
        durationMs: performance.now() - J,
        preTokens: j,
        postTokens: H,
        error: $
    }),
    K.setSDKStatus?.(null, {
        compactResult: $ ? "failed" : "success",
        ...$ && {compactError: $}
    })
}
```

Always-run cleanup:
1. Clear the streaming mode (so the UI stops spinning)
2. Reset response length tracker
3. Emit `compact_end` progress event
4. Emit telemetry compaction event (`aK6`) with success/failure + timings
5. Set SDK status to `null` with `compactResult: "success" | "failed"` (and optional `compactError`)

The `aK6` event is in **OpenTelemetry trace format** (separate from the `tengu_*` event format used inside the `try` block). It's used by external observability tools, while `tengu_compact` events go to internal Anthropic telemetry.

---

## 11. Telemetry Events Fired by `vI6`

| Event | Phase | When | Key fields |
|-------|-------|------|------------|
| `tengu_compact_cache_sharing_success` | 3a | Cache-prefix call returned valid summary | `preCompactTokenCount`, `cacheHitRate`, `outputTokens`, `cacheReadInputTokens`, `cacheCreationInputTokens` |
| `tengu_compact_cache_sharing_fallback` | 3a | Cache-prefix call failed | `preCompactTokenCount`, `reason` ("no_text_response" or "error") |
| `tengu_compact_failed` | 3b/3c | Streaming or PTL exhausted | `preCompactTokenCount`, `reason` ("prompt_too_long" / "no_summary" / "api_error" / "no_streaming_response"), `promptCacheSharingEnabled`, `ptlAttempts`, `hasStartedStreaming` |
| `tengu_compact_ptl_retry` | 3c | PTL retry attempt | `attempt`, `droppedMessages`, `remainingMessages` |
| `tengu_compact` | 7 | Successful completion | (full set above) |
| `aK6` (OpenTelemetry) | finally | Always | `trigger`, `success`, `duration_ms`, `pre_tokens`, `post_tokens`, `error` |

See [configuration_and_telemetry.md](./configuration_and_telemetry.md) for the full event reference.

---

## 12. Integration Points

### Called by:

- `QkK` (autocompactDispatcher) — chunks.159.mjs:1407 (`vI6(q, K, _, !0, void 0, !0, J, X)`)
- `JLY` (slash command handler) — chunks.167.mjs:2305 (`vI6(O, K, await iIK(K, O), !1, Y, !1)`)

### Calls:

- `oc` — PreCompact hook (chunks.192.mjs:2406)
- `ec8` — Throw if hook blocked
- `r_7` — Merge instructions
- `fx8` — Build prompt (chunks.101.mjs:679)
- `t8` — Make user message (referenced)
- `ALK` — Inner LLM call wrapper
- `MJ6` — Extract summary text from response
- `KLK` — Truncate head for PTL retry
- `pe6` — Snapshot read file state
- `sj6` — Reset memory selector
- `Nx8` — Restore files (chunks.159.mjs:1057)
- `hx8` — Load task statuses (chunks.159.mjs:1125)
- `Ex8`, `Lx8`, `yx8` — Plan, async-agent, skills attachments
- `MR6`, `PR6`, `WR6` — System reminder builders (chunks.155.mjs:1738+)
- `Y4` — Wrap attachment in message envelope (chunks.155.mjs:2497)
- `lR` — SessionStart hook (chunks.101.mjs:1729)
- `p18` — Boundary marker (chunks.166.mjs:118)
- `b18` — Summary text composition (chunks.101.mjs:804)
- `rc` — Pre-compact discovered tools (chunks.159.mjs:2310)
- `sI`, `qT`, `aI` — Token counters / API usage extractor
- `K36` — PostCompact hook (chunks.192.mjs:2445)
- `aK6` — OpenTelemetry compact event (chunks.87.mjs:1531)

---

## 13. Why Three Retry Layers?

### Failure Mode A: Cold Cache → Expensive cache_creation
**Mitigation: Cache-prefix sharing (3a)**

When a session is mid-stream and the prompt cache is warm, the entire pre-compact prompt is already cached upstream. Sending a new "summary" request would normally invalidate the cache. By using `rP({skipCacheWrite: true})`, the compact call **reads** from the cache without writing — the upstream cache still services subsequent turns at cache-hit prices.

### Failure Mode B: Even the Compact Prompt is Too Long
**Mitigation: PTL truncation retry (3c)**

A user with `CLAUDE_CODE_AUTO_COMPACT_WINDOW=1000000` running on a 200K-token model can have a 1M-token prompt that's "valid" by the local heuristic but rejected by the API. `KLK` drops ~20% of head and retries up to 3 times. Each retry tracks the dropped count for telemetry.

### Failure Mode C: Network Blip / Rate Limit / Model Quota
**Mitigation: Standard error handling**

Caught at the `try`/`catch` level. Increments `consecutiveFailures`. If 3, the breaker disables future autocompact for this session.

User-abort errors (`at = "API Error: Request was aborted."`) are not counted as failures — `p86(M, at)` filter excludes them.

---

## 14. Key Insight

The full compact pipeline trades **conversation history** for **state continuity**. The 8 phases work together to ensure that even though the agent loses verbatim message history, it doesn't lose:

- **What files it was working with** (Phase 4: `Nx8` restores last 5)
- **What plan it was following** (Phase 4: `Ex8` re-attaches plan file)
- **What skills it had invoked** (Phase 4: `yx8` re-attaches recently invoked)
- **What sub-agent tasks were running** (Phase 4: `hx8` re-attaches task statuses)
- **What tools/agents/MCP servers exist** (Phase 5: deltas with `isInitial: true`)
- **What tools it had dynamically discovered** (Phase 7: `preCompactDiscoveredTools` carried in boundary)
- **What the user instructed** (Phase 8: `userDisplayMessage` from hooks)
- **What state existed at session start** (Phase 6: SessionStart hook re-runs)

The summary itself is just the bridge between these state restorations and the agent's ongoing reasoning.
