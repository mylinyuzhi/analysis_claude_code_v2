# Full-compaction pipeline (compactConversation)

## Overview

`compactConversation` (`_eH` @ `cli_inner_pretty.js:423130`) is the v2.1.156 obfuscation of `compactConversation` from v2.1.88 `/lyz/codespace/3rd/claude-code/src/services/compact/compact.ts:387`. It is the **proactive / full lane** of Claude Code's three-lane compaction architecture. Its defining property is that it **replaces the WHOLE conversation with a single `<summary>` message** — it returns `messagesToKeep: []`, so nothing of the prior turns survives except what the summary captures and what gets re-injected as attachments.

The three lanes, and where this document sits among them:

- **Full / proactive (this document):** `compactConversation` (`_eH`). Replaces the entire conversation with one `<summary>`. Entered by the manual `/compact` command or by the auto-compaction generator (`autoCompactIfNeeded`) when the conversation crosses the auto-compact threshold.
- **Reactive / partial:** `runReactiveCompact` (`lA8`) → group-walk `iterateReactiveGroupWalk` (`xA8` @ `cli_inner_pretty.js:271231`) + `summarizeReactiveAttempt` (`uc5` @ `cli_inner_pretty.js:271156`). Triggered when a *normal* turn hits prompt-too-long (413). It peels conversation **groups from the tail** (via API-round grouping `riH`) and summarizes only the **older prefix**, preserving the recent suffix verbatim. It is *partial* and *recoverable*. Contrasted in detail below, and documented fully in `reactive_compaction.md`.
- **Micro-compact:** truncates individual oversized tool-result blocks in place and never calls the LLM. Out of scope here.

Where it plugs into the agent loop: the full lane is invoked **before** the next API request (proactively), either because the user typed `/compact` or because the auto-compact dispatcher detected the conversation is near the model window. It runs to completion synchronously, produces a `CompactionResult`, and the loop reassembles the conversation as `[boundaryMarker, ...summaryMessages, ...attachments, ...hookResults]` (since `messagesToKeep` is empty). The model then continues as if it "remembers" the prior session through the single summary user-message.

### The `_eH` signature

`_eH(H, $, q, K, _, z=!1, A, Y=!1, f, O, M)` maps to:

- `H` = `messages`
- `$` = `context` (the `ToolUseContext`)
- `q` = `cacheSafeParams`
- `K` = `suppressFollowUpQuestions`
- `_` = `customInstructions`
- `z` = `isAutoCompact` (default `false`)
- `A` = `recompactionInfo`
- `Y` = `stripNonEssential` (default `false` — **NEW** vs v2.1.88)
- `f` = `hintText` (**NEW** vs v2.1.88)
- `O` = `addNotification` sink
- `M` = `onResponseLength` setter

---

## The ordered phase list (the full-compact pipeline)

Each phase below is keyed to the bundle line range. This is a linear `try`/`catch`/`finally` with a single embedded retry loop (Phase 7).

### Phase 0 — Trigger discriminator & OTEL span open (`cli_inner_pretty.js:423131-423139`)

`j = z ? "compact_auto" : "compact_manual"` is the *telemetry feature label* consumed by `logFeatureBad` (`uH`) / `logFeatureOk` (`SH`) — i.e. the `tengu_feature_bad` / `tengu_feature_ok` events. Separately, `trigger: z?"auto":"manual"` is the *attribute* embedded inside the events and the span. `X = performance.now()` starts the wall-clock for duration metrics. `L = xP$("claude_code.compaction", {spanType:"compaction", attrs:{trigger, message_count:H.length}})` (`cli_inner_pretty.js:423136`) opens the OTEL compaction span via `openTracingSpan` (`xP$` @ `cli_inner_pretty.js:276662`) — a no-op unless telemetry is enabled (gated by `F5H()`). The span is finalized in the `finally` block (Phase 16).

### Phase 1 — Guard: not enough messages (`cli_inner_pretty.js:423141`)

`if (H.length === 0) throw (uH(j, "compact_not_enough_messages"), Error(kH$))`. `kH$` (`ERROR_MESSAGE_NOT_ENOUGH_MESSAGES`) = `"Not enough messages to compact."`. The throw is wrapped in a comma-operator so the feature-bad telemetry (`uH`) fires *before* the `Error` is constructed and thrown.

### Phase 2 — Pre-compact token count (`cli_inner_pretty.js:423142`)

`D = jJ(H)` (`tokenCountWithEstimation` @ `cli_inner_pretty.js:221106`). This computes the canonical **`preCompactTokenCount`** — the size of the conversation as the next API call would see it. See the algorithm deep-dive below. This number is propagated into every event and into the boundary marker.

### Phase 3 — pre_compact hook event + SDK status (`cli_inner_pretty.js:423143-423146`)

`iiH(T6($), "summary")` (`logPermissionContextForAnts` @ `cli_inner_pretty.js:270731`) — a **no-op stub** in this build (wired in but compiled out, consistent with telemetry gating). Then two SDK events are emitted via the unified `context.onCompactEvent?.(...)` dispatcher: `compact_progress / hooks_start / pre_compact`, and `sdk_status:"compacting"`.

### Phase 4 — Run PreCompact hooks + merge custom instructions (`cli_inner_pretty.js:423147-423149`)

`Z = await Wc({trigger, customInstructions:_??null}, signal)` — `executePreCompactHooks` (`Wc` @ `cli_inner_pretty.js:551557`) fires the `PreCompact` hook event (`hook_event_name:"PreCompact"`), collects subprocess outputs, and returns `{newCustomInstructions, userDisplayMessage, blockedBy?}`. Three things follow:

- **PreCompact-block early-exit:** `A08(Z, O, {suppressNotification:z})` — `throwIfBlockedByPreCompactHook` (`A08` @ `cli_inner_pretty.js:423093`). If *any* hook BLOCKED (`Z.blockedBy` set), it logs a warning, optionally surfaces a notification (suppressed for auto-compact), and throws `new PzH("${KeH}: …")` where `KeH` (`ERROR_MESSAGE_PRECOMPACT_BLOCKED`) = `"Compaction blocked by PreCompact hook"`. `PzH` is a dedicated `Error` subclass (`PreCompactBlockedError` @ `cli_inner_pretty.js:423862`).
- **Instruction merge:** `_ = $c6(_, Z.newCustomInstructions)` — `mergeHookInstructions` (`$c6` @ `cli_inner_pretty.js:423123`): user instructions first, hook instructions appended (blank-line separated); empty → `undefined`.
- **Display capture:** `W = Z.userDisplayMessage` — saved for the final combined display message (Phase 14).

### Phase 5 — stream/responseLength reset + compact_start (`cli_inner_pretty.js:423150-423152`)

`stream_mode:"requesting"`; then `M?.({type:"response_length", op:"reset"})` — the **onResponseLength reset** that zeroes the streamed-char counter the UI shows; then `compact_progress / compact_start / hintText:f`. The `hintText` field is **NEW in v2.1.156** and lets the UI show *why* the compaction happened.

### Phase 6 — cache-prefix gate + build summary request (`cli_inner_pretty.js:423153-423160`)

- `G = !Y && V$("tengu_compact_cache_prefix", !0)` (`cli_inner_pretty.js:423153`) — **the cache-prefix gate**. Default `true`; force-disabled when `Y` (`stripNonEssential`) is set. This drives the forked-agent path that piggybacks on the main thread's prompt cache. `G` is logged as `promptCacheSharingEnabled`.
- `V = bA8(_)` — `getCompactPrompt` (`bA8` @ `cli_inner_pretty.js:270917`): the large "create a detailed summary…" instruction block, beginning with a hard "Respond with TEXT ONLY. Do NOT call any tools" preamble, appending `Additional Instructions:\n${_}` when merged instructions exist (`cli_inner_pretty.js:423024`), and ending with the `Iv7` (`NO_TOOLS_REMINDER`).
- `v = T8({content:V})` — `createUserMessage` (`T8` @ `cli_inner_pretty.js:443846`): the summary-request message.
- `E=H, S=q, C=0` — working copies of messages, cacheSafeParams, and the PTL-attempt counter.

### Phase 7 — PTL retry loop calling `streamCompactSummary` (`cli_inner_pretty.js:423161-423197`)

An infinite `for(;;)` loop:

1. `h = await _X4({messages:E, summaryRequest:v, …, stripNonEssential:Y, onResponseLength:M})` — `streamCompactSummary` (`_X4` @ `cli_inner_pretty.js:423539`), the summarize LLM call (deep-dive below).
2. `I = qU(h)` — `getAssistantMessageText` (`qU` @ `cli_inner_pretty.js:444999`) joins the text blocks.
3. `if (!I?.startsWith(Rd)) break` — `Rd` (`PROMPT_TOO_LONG_ERROR_MESSAGE` @ `cli_inner_pretty.js:186902`) = `"Prompt is too long"`. If the summary text does NOT start with the PTL error string, we have a candidate summary → exit the loop.
4. Otherwise `C++` and `YH = C<=HX4 ? $X4(E,h) : null` where `HX4` (`MAX_PTL_RETRIES`) = `3`. `$X4` (`truncateHeadForPTLRetry` @ `cli_inner_pretty.js:423077`) drops the oldest API-round groups (see algorithm below).
5. If `$X4` returns `null` (can't drop more / retries exhausted): fire `tengu_compact_failed{reason:"prompt_too_long", ptlAttempts:C}`, `uH(j,"compact_prompt_too_long")`, and throw `Error(z08)` (`ERROR_MESSAGE_PROMPT_TOO_LONG`) = `"Conversation too long. Press esc twice…"`.
6. Else log `tengu_compact_ptl_retry{attempt, droppedMessages, remainingMessages}`, set `E=YH`, and thread the truncated set into `S={...S, forkContextMessages:YH}` so BOTH the streaming path (`E`) AND the forked path (`S.forkContextMessages`) see the truncated set.

### Phase 8 — Validate summary (`cli_inner_pretty.js:423198-423215`)

- `if (!I)` → `tengu_compact_failed{reason:"no_summary"}`, `uH(j,"compact_no_summary")`, throw "Failed to generate conversation summary…".
- `else if (lN(I))` → `startsWithApiErrorPrefix` (`lN` @ `cli_inner_pretty.js:186327`) detects an **API-error-prefixed** string (tests the `EZ`=`"API Error"` prefix); logs `tengu_compact_failed{reason:"api_error", errorPrefix}`, `uH(j,"compact_api_error")`, throws the error text.

> Precision note: `lN` tests the `EZ` (`"API Error"`) prefix, distinct from the PTL check. The prompt-too-long detection used in Phase 7 is `!I?.startsWith(Rd)` (and, for stored API-error messages, the `S1H` helper @ `cli_inner_pretty.js:186330` which does `.startsWith(Rd)`). `Rd`=`"Prompt is too long"` is a separate constant defined at `cli_inner_pretty.js:186902`.

### Phase 9 — Clear caches & memory (`cli_inner_pretty.js:423216-423219`)

`b = rJ$($.readFileState)` snapshots the read-file cache (`cacheToObject`), then `$.readFileState.clear()`, clears `loadedNestedMemoryPaths`, and `$kH($.memorySelector)` (@ `cli_inner_pretty.js:184399`) resets memory selection. Note: `sentSkillNames` is intentionally **NOT** reset (see the v2.1.88 comment at `compact.ts:922`).

### Phase 10 — Rebuild post-compact attachments (`cli_inner_pretty.js:423220-423230`)

`[B,R] = await Promise.all([rA8(b,$,iA8), tA8($)])`:

- `rA8` — `createPostCompactFileAttachments` (`rA8` @ `cli_inner_pretty.js:423684`) re-injects recently-read files: up to `iA8` (`POST_COMPACT_MAX_FILES_TO_RESTORE`) = 5 files, within `pb_` (`POST_COMPACT_TOKEN_BUDGET`) = 50000 tokens, `Ub_` (`POST_COMPACT_MAX_TOKENS_PER_FILE`) = 5000 per file.
- `tA8` — `createAsyncAgentAttachmentsIfNeeded` (`tA8` @ `cli_inner_pretty.js:423746`) produces task-status attachments for running/finished-unretrieved local agents.

Then attachments are appended (each wrapped with `VK` = `createAttachmentMessage`): plan-file (`oA8`), plan-mode (`sA8`), invoked-skills (`aA8`, with `Qb_` (`POST_COMPACT_SKILLS_TOKEN_BUDGET`) = 25000, `Fb_` (`POST_COMPACT_MAX_TOKENS_PER_SKILL`) = 5000 per skill, head-truncation via `ib_` + `sJ4` marker), and three delta-attachment streams — deferred tools (`y5H`, callSite `"compact_full"`), agent listing (`ZEH`), MCP instructions (`GEH`).

### Phase 11 — SessionStart hooks (`cli_inner_pretty.js:423231-423232`)

`session_start` hooks_start event, then `l = await $U("compact", {model})` runs the SessionStart hooks, producing hook messages.

### Phase 12 — Build boundary marker + summary message (`cli_inner_pretty.js:423233-423242`)

- `r = PP$(z?"auto":"manual", D??0, H.at(-1)?.uuid)` — `createCompactBoundaryMessage` (`PP$` @ `cli_inner_pretty.js:445985`): a `system / compact_boundary` message carrying `compactMetadata{trigger, preTokens, …}` and a `logicalParentUuid` pointing at the last pre-compact message (the relink anchor).
- `a = P8H(H)` — discovered-tool names; if non-empty, stored sorted on `r.compactMetadata.preCompactDiscoveredTools`.
- `o = iA()` (transcript path), `$H = yZ() && MJ$(…)` (REPL-state flag).
- `HH = [T8({content: jP$(I, K, o, void 0, $H), isCompactSummary:!0, isVisibleInTranscriptOnly:!0})]` — `getCompactUserSummaryMessage` (`jP$` @ `cli_inner_pretty.js:271053`). See the summary-extraction deep-dive below.
- `e = jo([h])` — `tokenCountFromLastAPIResponse` (`jo` @ `cli_inner_pretty.js:221050`): the compaction API call's total usage, kept under the field name `postCompactTokenCount` for continuity.
- `DH = sT([r, ...HH, ...x, ...l])` = `truePostCompactTokenCount` — the rough estimate of the ACTUAL resulting context size. Stored on `r.compactMetadata.postTokens`; `J=DH` for the `finally` block.

### Phase 13 — tengu_compact telemetry (`cli_inner_pretty.js:423243-423283`)

Emits `tengu_compact` with: pre/post/true-post token counts, `autoCompactThreshold`, `willRetriggerNextTurn` (= `A!==void 0 && DH>=A.autoCompactThreshold`), `isAutoCompact:z`, query-chain tracking, recompaction-chain fields (`isRecompactionInChain`, `turnsSincePreviousCompact`, `previousCompactTurnId`), the full compaction usage breakdown (`zH=i$H(h)`), `promptCacheSharingEnabled:G`, and a deferred `analyzeContext` spread (`VA8(TA8(H))`, wrapped in try/catch). Then `if(Jc()) _P$(querySource,agentId)` resets the prompt-cache-break baseline (`notifyCompaction`); `rkH(querySource)` → `XxH()/KrH()` cleanup.

### Phase 14 — PostCompact hooks + combined display (`cli_inner_pretty.js:423285-423288`)

`post_compact` hooks_start event; `fH = await zJH({trigger, compactSummary:I}, signal)` — `executePostCompactHooks` (`zJH` @ `cli_inner_pretty.js:551596`) runs the PostCompact hooks; `qH = [W, fH.userDisplayMessage].filter(Boolean).join("\n")` combines the pre- and post-hook display text.

### Phase 15 — Return CompactionResult (`cli_inner_pretty.js:423289-423303`)

`SH(j)` fires `tengu_feature_ok`, then returns:

```
{ boundaryMarker:r, summaryMessages:HH, messagesToKeep:[], attachments:x,
  hookResults:l, userDisplayMessage:qH||void 0, preCompactTokenCount:D,
  postCompactTokenCount:e, truePostCompactTokenCount:DH, compactionUsage:zH }
```

**`messagesToKeep:[]` is the defining property of the FULL lane** — nothing is preserved; the whole conversation is replaced by `[boundaryMarker, ...summaryMessages, ...attachments, ...hookResults]`.

### Phase 16 — catch / finally (`cli_inner_pretty.js:423304-423338`)

- **`catch`:** `w = error.message`; if NOT auto-compact, `KX4(P,O)` — `addErrorNotificationIfNeeded` (`KX4` @ `cli_inner_pretty.js:423510`) shows an error notification *unless* the error is an abort (`GC`), not-enough-messages (`kH$`), or PreCompact-block (`KeH`). Then rethrows.
- **`finally`:** resets stream_mode/responseLength, fires `compact_end`, emits the compaction metric via `iwH` (`emitCompactionMetric` @ `cli_inner_pretty.js:222566`, the OTLP gauge `j1("compaction",…)`), and if the OTEL span `L` exists: `mY8(L,{pre_compact_tokens, post_compact_tokens, success})` (`setSpanAttributes` — a no-op stub in this build) sets attributes, `EEH(L,w)` (`setSpanError`) records the error on failure, then `L.end()`. Finally emits `sdk_status:null, metadata:{compactResult}`.

---

## Deep dives

### PTL (prompt-too-long) retry loop — head truncation

**What it does:** When the **compaction request itself** exceeds the model context window, this drops the oldest conversation groups and re-summarizes, rather than leaving the user stuck with an un-compactable conversation.

**How it works** (`cli_inner_pretty.js:423161-423197` loop + `423077-423092` for `$X4`):

1. Call `streamCompactSummary` (`_X4`) to summarize; read its text via `getAssistantMessageText` (`qU`).
2. If the text does NOT start with `Rd` (`"Prompt is too long"`), it is a real summary → `break`.
3. Else increment `C`; if `C <= HX4` (=3) call `truncateHeadForPTLRetry` (`$X4`), else `null`.
4. `$X4`:
   - Strip a *prior* synthetic marker `aJ4` from `messages[0]` if present (so a marker from a previous retry doesn't pollute regrouping).
   - Group via `riH` (`groupMessagesByApiRound`, by assistant message id). If `< 2` groups → return `null`.
   - Parse the token gap from the error via `ucH` (`getPromptTooLongTokenGap`, the `"X tokens > Y tokens"` regex via `kP6`).
   - If the gap is known: accumulate `sT(group)` (`roughTokenCountEstimationForMessages`) tokens, dropping groups until the gap is covered. Otherwise fall back to dropping `max(1, floor(groups.length * 0.2))` (20%).
   - Clamp `dropCount` to `groups.length - 1`; if `< 1` → return `null`.
   - `slice(dropCount).flat()`; if the first kept message is an `assistant`, prepend `T8({content:aJ4, isMeta:true})` so the API never sees an assistant-first sequence.
5. If `null` → `tengu_compact_failed{prompt_too_long}` + throw `z08`.
6. Else log `tengu_compact_ptl_retry`, set `E=truncated` AND `S.forkContextMessages=truncated`.

**Why this approach:** Truncating the **HEAD** (oldest) is the dumb-but-safe fallback. The proactive lane summarizes everything anyway, so losing the oldest context is the least-bad option versus a hard failure. The proper tail-peeling retry lives in the reactive lane (`xA8`); the v2.1.88 comments describe this head-truncation path as the "last-resort escape hatch" that was *not* migrated to the reactive algorithm. Threading the truncated set through BOTH `E` and `S.forkContextMessages` is required because the cache-sharing fork reads `forkContextMessages`, **not** the `messages` param.

**Key insight:** The synthetic marker `aJ4` is BOTH prepended (to avoid an assistant-first API payload) AND detected-and-stripped on the *next* iteration. Otherwise the marker would become its own group-0, and the 20% fallback would stall — it would "drop" only the marker, re-add it, and make zero net progress on retry 2+.

```javascript
// ============================================
// truncateHeadForPTLRetry - PTL recovery: drop the oldest API-round groups (gap-guided or 20% fallback) and re-prepend a meta marker if the slice begins with an assistant turn
// Location: cli_inner_pretty.js:423077-423092
// ============================================

// ORIGINAL (for source lookup):
function $X4(H, $) {
  let q = H[0]?.type === "user" && H[0].isMeta && H[0].message.content === aJ4 ? H.slice(1) : H,
    K = riH(q);
  if (K.length < 2) return null;
  let _ = ucH($),
    z;
  if (_ !== void 0) {
    let Y = 0;
    z = 0;
    for (let f of K) if (((Y += sT(f)), z++, Y >= _)) break;
  } else z = Math.max(1, Math.floor(K.length * 0.2));
  if (((z = Math.min(z, K.length - 1)), z < 1)) return null;
  let A = K.slice(z).flat();
  if (A[0]?.type === "assistant") return [T8({ content: aJ4, isMeta: !0 }), ...A];
  return A;
}

// READABLE (for understanding):
function truncateHeadForPTLRetry(messages, ptlResponse) {
  // Strip our own synthetic marker from a prior retry before regrouping,
  // otherwise it becomes its own group-0 and stalls the 20% fallback.
  let input =
    messages[0]?.type === "user" && messages[0].isMeta && messages[0].message.content === PTL_RETRY_MARKER
      ? messages.slice(1)
      : messages;
  let groups = groupMessagesByApiRound(input);
  if (groups.length < 2) return null; // can't split a single round into "drop old / keep rest"
  let tokenGap = getPromptTooLongTokenGap(ptlResponse), // "X tokens > Y tokens" => X - Y
    dropCount;
  if (tokenGap !== undefined) {
    let acc = 0;
    dropCount = 0;
    for (let g of groups) {
      acc += roughTokenCountEstimationForMessages(g);
      dropCount++;
      if (acc >= tokenGap) break; // dropped enough oldest groups to cover the overflow
    }
  } else dropCount = Math.max(1, Math.floor(groups.length * 0.2)); // gap unparseable -> drop 20%
  dropCount = Math.min(dropCount, groups.length - 1); // never drop ALL groups
  if (dropCount < 1) return null;
  let sliced = groups.slice(dropCount).flat();
  // Avoid an assistant-first API payload: prepend a synthetic meta user message.
  if (sliced[0]?.type === "assistant") return [createUserMessage({ content: PTL_RETRY_MARKER, isMeta: true }), ...sliced];
  return sliced;
}

// Mapping: $X4->truncateHeadForPTLRetry, H->messages, $->ptlResponse, aJ4->PTL_RETRY_MARKER, riH->groupMessagesByApiRound, ucH->getPromptTooLongTokenGap, sT->roughTokenCountEstimationForMessages, T8->createUserMessage, K->groups, z->dropCount, A->sliced
```

### Cache-prefix gate + forked-agent cache sharing (`tengu_compact_cache_prefix`)

**What it does:** Lets the summarization LLM call reuse the MAIN conversation's already-warm prompt cache (system prompt + tools + message prefix) instead of paying full cache-creation cost for the compaction call.

**How it works:**

1. `G`/`f` = `!stripNonEssential && getFeatureValue("tengu_compact_cache_prefix", true)`. Read once in `_eH` (`cli_inner_pretty.js:423153`) and re-read identically inside `_X4`.
2. If enabled, `_X4` calls `runForkedAgent` (`xZ`) with the same `cacheSafeParams` the main thread used, `forkLabel:"compact"`, `maxTurns:1`, `skipCacheWrite:true`, `skipTranscript:true`, and `canUseTool: DN6()` — a `CanUseTool` that DENIES every tool ("Tool use is not allowed during compaction"). The fork relies on `cacheSafeParams` identity for the cache key.
3. On a valid text response (not API-error, not PTL) it logs `tengu_compact_cache_sharing_success` (with `cacheHitRate = cache_read/(cache_read+cache_creation+input)` and the **NEW** `forkAssistantMessageCount`) and returns `IA8(V.messages) ?? v` — `findSummaryAssistantMessage` prefers an assistant message whose text contains `<summary>`.
4. On no-text / error / abort it logs `tengu_compact_cache_sharing_fallback{reason}` and drops to the streaming path (which CAN set `maxOutputTokensOverride` since it does not share the cache).

**Why this approach:** Experiment data cited in the v2.1.88 comment showed the non-sharing path is ~98% cache miss and costs a meaningful slice of fleet `cache_creation`, concentrated in ephemeral environments. Sharing the prefix turns most of that into `cache_read`. The GrowthBook flag is kept purely as a kill-switch.

**Key insight:** `stripNonEssential` **force-disables** the gate (`G = !Y && …`). Once you have rewritten the messages (image-stripping, tool-input truncation) the cache key no longer matches the main thread, so cache sharing would be a pure miss anyway — better to skip straight to the streaming path.

**Caveat (cache-key risk):** the fork is *intended* to reuse the main thread's warm prefix, but v2.1.156's compact fork now passes `maxOutputTokens: Math.min(COMPACT_MAX_OUTPUT_TOKENS, getMaxOutputTokensForModel(mainLoopModel))` (`cli_inner_pretty.js:423569`) — a setting v2.1.88 *deliberately omitted* (`compact.ts:1178-1200`) because clamping `maxOutputTokens` can clamp `budget_tokens` and shift the thinking config, which mismatches the shared prompt-cache key. So the "shares the main-thread cache cleanly" assumption should be treated as *aspirational*: this addition may silently degrade the fork to a cache miss. The cross-validation "Diverged (e)" item below tracks this.

### `tokenCountWithEstimation` (`jJ`) — authoritative-prefix + estimated-tail

**What it does:** Computes `preCompactTokenCount` — the size of the conversation as the next API call would see it (`cli_inner_pretty.js:221106`).

**How it works:**

1. Walk messages from the end to find the last `assistant` message with real `usage` (`i$H` / `getTokenUsage`, which excludes synthetic / no-cost messages and a sentinel model `CT`).
2. From that message, walk further back over all messages sharing the same API message id (`d_7`) so the whole multi-message API round is treated as one boundary.
3. Return `Mo(usage)` (`sumUsageTokens` = `input + cache_creation + cache_read + output`) for the cached prefix PLUS `sT(messages after that group)` — a rough char-based estimate (~4 chars/token) for the tail not yet sent to the API.
4. If no assistant-with-usage exists, return `sT(whole array)` (pure estimate).

**Why this approach:** Mixing the API's exact prefix count with a cheap estimate of the un-sent tail gives a number that closely tracks both what `shouldAutoCompact` checks and what the API's own `input_tokens` will report — without re-tokenizing the entire history.

**Key insight:** It anchors on the LAST real `usage` and rewinds across same-id messages so a streamed multi-block round isn't double-counted; only the genuinely-new tail gets the rough estimate.

### Summary extraction (`xc5` / `jP$` / `IA8`)

**What it does:** Pulls the model's `<summary>` out of its `<analysis>` + `<summary>` response and wraps it into the replacement user message (`cli_inner_pretty.js:271031`, `271053`, `270798`).

**How it works:**

1. `findSummaryAssistantMessage` (`IA8`) prefers an assistant message whose text contains `"<summary>"` (falling back to the last non-error assistant text), so a stray earlier assistant turn can't win.
2. `getCompactSummaryText` (`CA8`) trims that text.
3. `extractSummaryBlock` (`xc5`) deletes the `<analysis>…</analysis>` block, rewrites `<summary>…</summary>` to `"Summary:\n…"`, and collapses multiple blank lines.
4. `getCompactUserSummaryMessage` (`jP$`) prepends `"This session is being continued from a previous conversation…"`, appends a transcript-path hint, an optional `"Recent messages are preserved verbatim."` note (4th arg), an optional REPL-VM-cleared notice (5th arg `$H`), and — when `suppressFollowUpQuestions` (`K`) — a `"Continue… do not acknowledge the summary"` directive.
5. Wrapped via `createUserMessage` (`T8`) with `isCompactSummary:true`, `isVisibleInTranscriptOnly:true`.

**Why this approach:** The model is told to emit `<analysis>` (private reasoning) then `<summary>` (the durable artifact). Only the summary survives; the analysis is scaffolding that would waste post-compact tokens.

**Key insight:** `isVisibleInTranscriptOnly:true` means the summary user-message is shown in the transcript view but is *also* the actual API payload that replaces the whole prior conversation — the model continues as if it "remembers" the session via this one message.

---

## Load-bearing code snippets

```javascript
// ============================================
// compactConversation - Full/proactive lane: header (telemetry, span, guards, hooks) + the PTL retry loop driving streamCompactSummary
// Location: cli_inner_pretty.js:423130-423197
// ============================================

// ORIGINAL (for source lookup):
async function _eH(H, $, q, K, _, z = !1, A, Y = !1, f, O, M) {
  let j = z ? "compact_auto" : "compact_manual", w, D, J, X = performance.now(),
    L = xP$("claude_code.compaction", { spanType: "compaction", attrs: { trigger: z ? "auto" : "manual", message_count: H.length } });
  try {
    if (H.length === 0) throw (uH(j, "compact_not_enough_messages"), Error(kH$));
    D = jJ(H);
    let P = $.getAppState();
    (iiH(T6($), "summary"), $.onCompactEvent?.({ type: "compact_progress", event: { type: "hooks_start", hookType: "pre_compact" } }), $.onCompactEvent?.({ type: "sdk_status", status: "compacting" }));
    let Z = await Wc({ trigger: z ? "auto" : "manual", customInstructions: _ ?? null }, $.abortController.signal);
    (A08(Z, O, { suppressNotification: z }), (_ = $c6(_, Z.newCustomInstructions)));
    let W = Z.userDisplayMessage;
    ($.onCompactEvent?.({ type: "stream_mode", mode: "requesting" }), M?.({ type: "response_length", op: "reset" }), $.onCompactEvent?.({ type: "compact_progress", event: { type: "compact_start", hintText: f } }));
    let G = !Y && V$("tengu_compact_cache_prefix", !0), V = bA8(_), v = T8({ content: V }), E = H, S = q, h, I, C = 0;
    for (;;) {
      if (((h = await _X4({ messages: E, summaryRequest: v, appState: P, context: $, preCompactTokenCount: D, cacheSafeParams: S, stripNonEssential: Y, onResponseLength: M })), (I = qU(h)), !I?.startsWith(Rd))) break;
      C++;
      let YH = C <= HX4 ? $X4(E, h) : null;
      if (!YH) throw (d("tengu_compact_failed", { reason: "prompt_too_long", preCompactTokenCount: D, promptCacheSharingEnabled: G, ptlAttempts: C }), uH(j, "compact_prompt_too_long"), Error(z08));
      (d("tengu_compact_ptl_retry", { attempt: C, droppedMessages: E.length - YH.length, remainingMessages: YH.length }), (E = YH), (S = { ...S, forkContextMessages: YH }));
    }

// READABLE (for understanding):
async function compactConversation(messages, context, cacheSafeParams, suppressFollowUpQuestions, customInstructions, isAutoCompact = false, recompactionInfo, stripNonEssential = false, hintText, addNotification, onResponseLength) {
  let featureLabel = isAutoCompact ? "compact_auto" : "compact_manual";
  let errMsg, preTokens, truePostTokens;
  let startMs = performance.now();
  let span = openTracingSpan("claude_code.compaction", { spanType: "compaction", attrs: { trigger: isAutoCompact ? "auto" : "manual", message_count: messages.length } });
  try {
    if (messages.length === 0) { logFeatureBad(featureLabel, "compact_not_enough_messages"); throw Error(ERROR_NOT_ENOUGH_MESSAGES); }
    preTokens = tokenCountWithEstimation(messages);
    let appState = context.getAppState();
    logPermissionContextForAnts(getToolPermissionContext(context), "summary"); // no-op stub in this build
    context.onCompactEvent?.({ type: "compact_progress", event: { type: "hooks_start", hookType: "pre_compact" } });
    context.onCompactEvent?.({ type: "sdk_status", status: "compacting" });
    let preHook = await executePreCompactHooks({ trigger: isAutoCompact ? "auto" : "manual", customInstructions: customInstructions ?? null }, context.abortController.signal);
    throwIfBlockedByPreCompactHook(preHook, addNotification, { suppressNotification: isAutoCompact }); // throws PreCompactBlockedError if any hook blocked
    customInstructions = mergeHookInstructions(customInstructions, preHook.newCustomInstructions);
    let preHookDisplay = preHook.userDisplayMessage;
    context.onCompactEvent?.({ type: "stream_mode", mode: "requesting" });
    onResponseLength?.({ type: "response_length", op: "reset" }); // zero the streamed-char counter the UI shows
    context.onCompactEvent?.({ type: "compact_progress", event: { type: "compact_start", hintText } }); // hintText NEW in v2.1.156
    let cacheSharingEnabled = !stripNonEssential && getFeatureValue("tengu_compact_cache_prefix", true); // cache-prefix gate; off when stripNonEssential
    let summaryRequest = createUserMessage({ content: getCompactPrompt(customInstructions) });
    let workingMessages = messages, workingCacheParams = cacheSafeParams, summaryResponse, summaryText, ptlAttempts = 0;
    for (;;) {
      summaryResponse = await streamCompactSummary({ messages: workingMessages, summaryRequest, appState, context, preCompactTokenCount: preTokens, cacheSafeParams: workingCacheParams, stripNonEssential, onResponseLength });
      summaryText = getAssistantMessageText(summaryResponse);
      if (!summaryText?.startsWith(PROMPT_TOO_LONG_ERROR_MESSAGE)) break; // real summary -> exit loop
      ptlAttempts++;
      let truncated = ptlAttempts <= MAX_PTL_RETRIES ? truncateHeadForPTLRetry(workingMessages, summaryResponse) : null;
      if (!truncated) { logEvent("tengu_compact_failed", { reason: "prompt_too_long", preCompactTokenCount: preTokens, promptCacheSharingEnabled: cacheSharingEnabled, ptlAttempts }); logFeatureBad(featureLabel, "compact_prompt_too_long"); throw Error(ERROR_PROMPT_TOO_LONG); }
      logEvent("tengu_compact_ptl_retry", { attempt: ptlAttempts, droppedMessages: workingMessages.length - truncated.length, remainingMessages: truncated.length });
      workingMessages = truncated;
      workingCacheParams = { ...workingCacheParams, forkContextMessages: truncated }; // BOTH streaming (workingMessages) and fork (forkContextMessages) see the truncation
    }

// Mapping: _eH->compactConversation, H->messages, $->context, q->cacheSafeParams, K->suppressFollowUpQuestions, _->customInstructions, z->isAutoCompact, A->recompactionInfo, Y->stripNonEssential, f->hintText, O->addNotification, M->onResponseLength, j->featureLabel, D->preTokens, J->truePostTokens, X->startMs, L->span, xP$->openTracingSpan, jJ->tokenCountWithEstimation, iiH->logPermissionContextForAnts, T6->getToolPermissionContext, Wc->executePreCompactHooks, A08->throwIfBlockedByPreCompactHook, $c6->mergeHookInstructions, V$->getFeatureValue, bA8->getCompactPrompt, T8->createUserMessage, _X4->streamCompactSummary, qU->getAssistantMessageText, Rd->PROMPT_TOO_LONG_ERROR_MESSAGE, HX4->MAX_PTL_RETRIES, $X4->truncateHeadForPTLRetry, z08->ERROR_PROMPT_TOO_LONG, kH$->ERROR_NOT_ENOUGH_MESSAGES, uH->logFeatureBad, d->logEvent
```

```javascript
// ============================================
// streamCompactSummary - The summarize LLM call: cache-sharing forked-agent fast path with streaming fallback; denies all tools, thinking disabled
// Location: cli_inner_pretty.js:423539-423682
// ============================================

// ORIGINAL (for source lookup):
async function _X4({ messages: H, summaryRequest: $, appState: q, context: K, preCompactTokenCount: _, cacheSafeParams: z, stripNonEssential: A = !1, onResponseLength: Y }) {
  let f = !A && V$("tengu_compact_cache_prefix", !0),
    O = wj4() ? setInterval((M) => { (jj4(), M?.({ type: "sdk_status", status: "compacting" })); }, 30000, K.onCompactEvent) : void 0;
  try {
    if (f) try {
        let V = await xZ({ promptMessages: [$], cacheSafeParams: z, canUseTool: DN6(), querySource: "compact", forkLabel: "compact", maxTurns: 1, maxOutputTokens: Math.min(NO$, E5H(K.options.mainLoopModel)), skipCacheWrite: !0, skipTranscript: !0, overrides: { abortController: K.abortController } }),
          v = _V(V.messages), E = CA8(V.messages), S = H6(V.messages, (h) => h.type === "assistant" && !h.isApiErrorMessage);
        if (v && E && !v.isApiErrorMessage) { if (!E.startsWith(Rd)) d("tengu_compact_cache_sharing_success", { /* cacheHitRate, forkAssistantMessageCount */ }); return IA8(V.messages) ?? v; }
        if (K.abortController.signal.aborted) throw Error(GC);
        (N(/* ... */), d("tengu_compact_cache_sharing_fallback", { reason: "no_text_response" /* ... */ }));
      } catch (V) { if (K.abortController.signal.aborted || yn(V, GC)) throw Error(GC); (hH(V), d("tengu_compact_cache_sharing_fallback", { reason: "error", preCompactTokenCount: _ })); }
    /* ... streaming fallback: build tools, wN6/db_/cb_ strip, neH stream, return last assistant ... */
  } finally { clearInterval(O); }
}

// READABLE (for understanding):
async function streamCompactSummary({ messages, summaryRequest, appState, context, preCompactTokenCount, cacheSafeParams, stripNonEssential = false, onResponseLength }) {
  let cacheSharingEnabled = !stripNonEssential && getFeatureValue("tengu_compact_cache_prefix", true);
  // 30s keep-alive so remote-session WebSockets don't idle-timeout during a long compaction call
  let keepAlive = isSessionActivityTrackingActive() ? setInterval((statusSetter) => { sendSessionActivitySignal(); statusSetter?.({ type: "sdk_status", status: "compacting" }); }, 30000, context.onCompactEvent) : undefined;
  try {
    if (cacheSharingEnabled) try {
        // FAST PATH: fork reusing the main thread's warm prompt cache; deny all tools; cap output tokens
        let fork = await runForkedAgent({ promptMessages: [summaryRequest], cacheSafeParams, canUseTool: createCompactCanUseTool(), querySource: "compact", forkLabel: "compact", maxTurns: 1, maxOutputTokens: Math.min(COMPACT_MAX_OUTPUT_TOKENS, getMaxOutputTokensForModel(context.options.mainLoopModel)), skipCacheWrite: true, skipTranscript: true, overrides: { abortController: context.abortController } });
        let lastAssistant = getLastAssistantMessage(fork.messages), text = getCompactSummaryText(fork.messages), forkAssistantCount = countAssistantMessages(fork.messages);
        if (lastAssistant && text && !lastAssistant.isApiErrorMessage) { if (!text.startsWith(PROMPT_TOO_LONG_ERROR_MESSAGE)) logEvent("tengu_compact_cache_sharing_success", { /* cacheHitRate, forkAssistantMessageCount: NEW in v2.1.156 */ }); return findSummaryAssistantMessage(fork.messages) ?? lastAssistant; }
        if (context.abortController.signal.aborted) throw Error(ERROR_USER_ABORT);
        logEvent("tengu_compact_cache_sharing_fallback", { reason: "no_text_response" });
      } catch (e) { if (context.abortController.signal.aborted || hasExactErrorMessage(e, ERROR_USER_ABORT)) throw Error(ERROR_USER_ABORT); logError(e); logEvent("tengu_compact_cache_sharing_fallback", { reason: "error", preCompactTokenCount }); }
    // STREAMING FALLBACK (elided): build [FileReadTool (+ToolSearchTool +mcp if enabled)]; messages [...getMessagesAfterCompactBoundary(messages), summaryRequest];
    //   if stripNonEssential: stripQueuedOnlyAttachments -> stripImagesFromMessages -> truncateToolPayloads(100 chars);
    //   queryModelWithStreaming with systemPrompt "You are a helpful AI assistant tasked with summarizing conversations.", thinking disabled,
    //   enablePromptCaching=false, promptTooLongIsHandled=true, maxOutputTokensOverride=min(COMPACT_MAX_OUTPUT_TOKENS, model max);
    //   on first text content_block_start -> stream_mode "responding"; on each text_delta -> onResponseLength add; return last assistant (findSummaryAssistantMessage ?? last) or throw ERROR_INCOMPLETE_RESPONSE.
  } finally { clearInterval(keepAlive); }
}

// Mapping: _X4->streamCompactSummary, f->cacheSharingEnabled, O->keepAlive, wj4->isSessionActivityTrackingActive, jj4->sendSessionActivitySignal, xZ->runForkedAgent, DN6->createCompactCanUseTool, NO$->COMPACT_MAX_OUTPUT_TOKENS, E5H->getMaxOutputTokensForModel, _V->getLastAssistantMessage, CA8->getCompactSummaryText, H6->countAssistantMessages, IA8->findSummaryAssistantMessage, Rd->PROMPT_TOO_LONG_ERROR_MESSAGE, GC->ERROR_USER_ABORT, yn->hasExactErrorMessage, hH->logError, d->logEvent, wN6->stripImagesFromMessages, db_->stripQueuedOnlyAttachments, cb_->truncateToolPayloads
```

```javascript
// ============================================
// getCompactPrompt - Builds the full-conversation summary-request prompt; appends merged custom instructions (already including PreCompact-hook output)
// Location: cli_inner_pretty.js:270917-271030
// ============================================

// ORIGINAL (for source lookup):
function bA8(H) {
  let $ = `CRITICAL: Respond with TEXT ONLY. Do NOT call any tools.\n...\nYour task is to create a detailed summary of the conversation so far...`;
  if (H && H.trim() !== "") $ += `\n\nAdditional Instructions:\n${H}`;
  return (($ += Iv7), $);
}

// READABLE (for understanding):
function getCompactPrompt(customInstructions) {
  // COMPACT_SUMMARY_INSTRUCTIONS: "CRITICAL: Respond with TEXT ONLY..." + the 9-section <analysis>/<summary> spec
  let prompt = COMPACT_SUMMARY_INSTRUCTIONS;
  if (customInstructions && customInstructions.trim() !== "") prompt += `\n\nAdditional Instructions:\n${customInstructions}`;
  prompt += NO_TOOLS_REMINDER; // Iv7
  return prompt;
}

// Mapping: bA8->getCompactPrompt, H->customInstructions, Iv7->NO_TOOLS_REMINDER. Note: in _eH the merge ($c6/mergeHookInstructions) runs BEFORE this call, so customInstructions already contains PreCompact-hook output.
```

```javascript
// ============================================
// executePreCompactHooks - Fire the PreCompact hook event, collect instructions + per-hook display lines + block decision
// Location: cli_inner_pretty.js:551557-551595
// ============================================

// ORIGINAL (for source lookup):
async function Wc(H, $, q = q_) {
  let K = { ...w5(void 0), hook_event_name: "PreCompact", trigger: H.trigger, custom_instructions: H.customInstructions },
    _ = await Q2({ hookInput: K, matchQuery: H.trigger, signal: $, timeoutMs: q });
  if (_.length === 0) return {};
  let z = _.filter((f) => f.succeeded && !f.blocked && f.output.trim().length > 0).map((f) => f.output.trim()), A = [];
  for (let f of _) if (f.succeeded && !f.blocked) { if (f.output.trim()) A.push(`PreCompact [${f.command}] completed successfully: ${f.output.trim()}`); else A.push(`PreCompact [${f.command}] completed successfully`); } else if (f.output.trim()) A.push(`PreCompact [${f.command}] failed: ${f.output.trim()}`); else A.push(`PreCompact [${f.command}] failed`);
  let Y = _.filter((f) => f.blocked);
  return { newCustomInstructions: z.length > 0 ? z.join(`\n\n`) : void 0, userDisplayMessage: A.length > 0 ? A.join(`\n`) : void 0, ...(Y.length > 0 && { blockedBy: Y.map((f) => { let O = f.output.trim(); return `[${f.command}]${O ? `: ${O}` : ""}`; }).join(`\n`) }) };
}

// READABLE (for understanding):
async function executePreCompactHooks(args, signal, timeoutMs = DEFAULT_HOOK_TIMEOUT) {
  let hookInput = { ...baseHookInput(undefined), hook_event_name: "PreCompact", trigger: args.trigger, custom_instructions: args.customInstructions };
  let results = await runHooks({ hookInput, matchQuery: args.trigger, signal, timeoutMs });
  if (results.length === 0) return {};
  let instructions = results.filter((r) => r.succeeded && !r.blocked && r.output.trim().length > 0).map((r) => r.output.trim());
  let displayLines = results.map((r) => /* "PreCompact [cmd] completed successfully: <out>" / "... failed: <out>" */);
  let blocked = results.filter((r) => r.blocked);
  return {
    newCustomInstructions: instructions.length ? instructions.join("\n\n") : undefined,
    userDisplayMessage: displayLines.length ? displayLines.join("\n") : undefined,
    ...(blocked.length && { blockedBy: blocked.map((r) => `[${r.command}]${r.output.trim() ? `: ${r.output.trim()}` : ""}`).join("\n") }),
  };
}

// Mapping: Wc->executePreCompactHooks, w5->baseHookInput, Q2->runHooks, q_->DEFAULT_HOOK_TIMEOUT, z->instructions, A->displayLines, Y->blocked. The parallel zJH->executePostCompactHooks (cli_inner_pretty.js:551596) uses hook_event_name "PostCompact" + compact_summary.
```

---

## Key contrast: FULL (`_eH`) vs REACTIVE (`xA8`/`uc5`) vs MICRO

| Property | Full (`_eH`) | Reactive (`xA8` + `uc5`) | Micro |
|---|---|---|---|
| Trigger | manual `/compact` or auto-threshold | a normal turn hit prompt-too-long (413) | size-based, in-loop |
| Scope | WHOLE conversation → 1 summary | OLDEST groups only; preserve recent suffix | individual large tool-results |
| `messagesToKeep` | `[]` (replace everything) | preserved tail (`messagesToPreserve.flat()`) | n/a |
| LLM call | yes (`_X4`) | yes (`uc5`) | no |
| Retry strategy | `$X4` HEAD-truncation, ≤ `HX4`=3 | group-by-group TAIL-peel via `riH`/`bv7`, gap-guided widening | n/a |
| Failure unblock | drop oldest 20%/gap → re-summarize whole remainder | preserve MORE groups each attempt → smaller summarize input | n/a |

The reactive path's `summarizeReactiveAttempt` (`uc5` @ `cli_inner_pretty.js:271156`) is the single-attempt summarizer (always forked, `forkLabel:"reactive-compact"`), and `iterateReactiveGroupWalk` (`xA8` @ `cli_inner_pretty.js:271231`) is the orchestrator that grows the preserved-group count on each prompt-too-long, seeded by `initialTokenGap` via `bv7`/`mc5`. The contrast in retry direction is the load-bearing distinction: the full path truncates the **HEAD** (and re-summarizes the whole remainder), while the reactive path widens the **preserved tail** (and shrinks the summarize input). See `reactive_compaction.md` for the full reactive treatment.

---

## Manual vs auto discriminator — effects

`z` (`isAutoCompact`) flips THREE things:

1. **Telemetry label** `j` (`"compact_auto"` vs `"compact_manual"`) → feeds every `uH`/`SH` feature event and the `iwH`/span `trigger` attribute.
2. **Boundary marker trigger** — `PP$(z?"auto":"manual", …)` persists into `compactMetadata.trigger`.
3. **Error-notification suppression** — in the `catch`, `if(!z) KX4(P,O)`: auto-compact failures are **silent** (they retry next turn; a toast would be confusing), whereas manual failures surface the "Error compacting conversation" notification.

Auto-compact additionally passes `A` (`recompactionInfo`) so `tengu_compact` can disambiguate same-chain compaction loops from cross-agent compactions and compute `willRetriggerNextTurn`.

---

## Cross-validation against v2.1.88

Compared against `/lyz/codespace/3rd/claude-code/src/services/compact/compact.ts`.

### Matched (1:1 structural correspondence)

The overall phase order matches v2.1.88 `compactConversation` (`compact.ts:387`): empty guard → `tokenCountWithEstimation` → pre_compact hooks → `mergeHookInstructions` → cache-prefix-gate read → `getCompactPrompt` + `createUserMessage` → PTL retry loop calling `streamCompactSummary` → summary validation (`no_summary`/`api_error`) → `readFileState` snapshot + clear → parallel post-compact file/agent attachments → plan / plan-mode / skill attachments → tool/agent/MCP delta attachments → session_start hooks → `createCompactBoundaryMessage` + `preCompactDiscoveredTools` → `getCompactUserSummaryMessage` → `tengu_compact` event → post_compact hooks → `CompactionResult` with `messagesToKeep:[]` (assembled order matches `compact.ts:328-334`).

Also matched: the PTL algorithm (`$X4` ≡ `truncateHeadForPTLRetry`, `MAX_PTL_RETRIES=3`, `PTL_RETRY_MARKER`, group-by-API-round, token-gap-or-20% drop, assistant-first guard); the cache-sharing forked path (`runForkedAgent`, `skipCacheWrite`, `createCompactCanUseTool` deny-all, `tengu_compact_cache_sharing_success`/`fallback`); the constants (`POST_COMPACT_MAX_FILES_TO_RESTORE=5`, `TOKEN_BUDGET=50000`, `PER_FILE=5000`, `PER_SKILL=5000`, `SKILLS_BUDGET=25000`); the error constants (`ERROR_MESSAGE_USER_ABORT="API Error: Request was aborted."` (`GC`), `NOT_ENOUGH_MESSAGES` (`kH$`), `PROMPT_TOO_LONG` (`z08`), `INCOMPLETE_RESPONSE` (`NH$`)); and the manual-vs-auto error-notification suppression (`KX4` only when `!isAutoCompact`).

### Diverged

- **(a) Strip pipeline.** v2.1.88 `streamCompactSummary` ALWAYS applied `stripImagesFromMessages` + `stripReinjectedAttachments` unconditionally. v2.1.156 makes the strip pipeline **conditional and escalated**: the new `stripNonEssential` lane additionally runs `stripQueuedOnlyAttachments` (`db_`, drop non-queued attachments) and `truncateToolPayloads` (`cb_`, truncate tool_use inputs AND tool_result content to `oJ4`=100 chars, dropping cache-control blocks). This is a new, more-aggressive token-reduction mode that force-disables the cache-prefix gate (`G = !Y && …`).
- **(b) Event bus.** v2.1.88 used discrete context callbacks (`onCompactProgress`, `setSDKStatus`, `setStreamMode`, `setResponseLength`). v2.1.156 funnels everything through a single `context.onCompactEvent?.({type:…})` dispatcher (sub-types `compact_progress`/`sdk_status`/`stream_mode`), plus a separate `onResponseLength` (`M`) setter passed as a parameter.
- **(c) Streaming retry removed.** v2.1.88 `streamCompactSummary` had a `tengu_compact_streaming_retry` loop (`MAX_COMPACT_STREAMING_RETRIES`, sleep + retry, gated by `tengu_compact_streaming_retry`). v2.1.156 `_X4` has NO streaming retry — a single streaming pass, then throws `NH$` (`ERROR_MESSAGE_INCOMPLETE_RESPONSE`). The retry concept moved entirely to the reactive lane.
- **(d) Summary-message notices.** `jP$` (`getCompactUserSummaryMessage`) gained the REPL-VM-cleared notice (5th arg `$H`) — genuinely NEW in v2.1.156. The "recent messages preserved verbatim" 4th arg (`recentMessagesPreserved`) ALREADY existed in v2.1.88 (`prompt.ts:337-342`, emits `"Recent messages are preserved verbatim."` at ~`355`) — so only the 5th arg is new.
- **(e) `maxOutputTokens` on the compact fork.** v2.1.156 ADDED `maxOutputTokens: Math.min(COMPACT_MAX_OUTPUT_TOKENS=NO$, getMaxOutputTokensForModel(mainLoopModel))` to the compact fork call (`cli_inner_pretty.js:423569`), REVERSING v2.1.88's explicit DO-NOT-set decision (`compact.ts:1178-1200`, whose comment warns this clamps `budget_tokens` and invalidates the shared prompt cache via a thinking-config mismatch). The v2.1.156 fork still claims to piggyback on the main-thread cache, so this may reintroduce exactly the cache-key mismatch that comment warned about.

### Post-2.1.88 (new, no counterpart in the v2.1.88 compact.ts)

- The OTEL `claude_code.compaction` span (`xP$`/`mY8`/`EEH`) and the `iwH("compaction")` OTLP metric.
- The `hintText` parameter and `compact_start.hintText`.
- The `SH`/`uH` feature-health telemetry (`tengu_feature_ok`/`bad` with the `compact_auto`|`compact_manual` label).
- The PreCompact-block semantics: `A08` (`throwIfBlockedByPreCompactHook`) + `PzH` (`PreCompactBlockedError`) + `KeH` constant + the `blockedBy` field in `Wc`. v2.1.88 `executePreCompactHooks` returned only `{newCustomInstructions, userDisplayMessage}` with no block/abort semantics, and `addErrorNotificationIfNeeded` (`KX4`) did not special-case a block message.
- `forkAssistantMessageCount` + richer cache-sharing-fallback telemetry (`lb_`).
- `skipTranscript:true` on the compact fork call (`cli_inner_pretty.js:423571`) is NEW in v2.1.156 — v2.1.88's compact fork (`compact.ts:1195`) passed ONLY `skipCacheWrite:true` (`skipTranscript` was a defined-but-unused `forkedAgent` option).
- The entire reactive lane (`uc5`/`xA8`/`bv7`/`mc5`) plus `/compact` session-memory + reactive-only routing.

**Build note:** a couple of helpers are no-op stubs in this build — `iiH` (`logPermissionContextForAnts` @ `cli_inner_pretty.js:270731`) and `mY8` (`setSpanAttributes` @ `cli_inner_pretty.js:276353`). They are wired into the pipeline but compiled out, consistent with telemetry being gated by `F5H()` / feature flags.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compact lives here
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Loop integration
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Telemetry / model context window
> - [symbol_additions_v2_1_156_compact.md](../00_overview/symbol_additions_v2_1_156_compact.md) - This module’s new symbols

Key functions in this document:

- `compactConversation` (`_eH`) — cli_inner_pretty.js:423130 — full/proactive compaction entry; replaces the whole conversation with one summary, returns `messagesToKeep:[]`.
- `partialCompactConversation` (`qX4`) — cli_inner_pretty.js:423340 — selector-driven partial compaction (`from`/`up_to`); keeps one half, summarizes the other.
- `streamCompactSummary` (`_X4`) — cli_inner_pretty.js:423539 — the summarize LLM call: cache-sharing forked fast path + streaming fallback; deny-all tools, thinking disabled.
- `truncateHeadForPTLRetry` (`$X4`) — cli_inner_pretty.js:423077 — PTL recovery: drop oldest API-round groups (gap or 20%), prepend `aJ4` marker if first kept msg is assistant; null when undroppable.
- `mergeHookInstructions` (`$c6`) — cli_inner_pretty.js:423123 — user instructions first + PreCompact-hook instructions appended (blank-line separated); empty→undefined.
- `throwIfBlockedByPreCompactHook` (`A08`) — cli_inner_pretty.js:423093 — throws `PzH` when a PreCompact hook returned `blockedBy`; optional notification (suppressed for auto).
- `executePreCompactHooks` (`Wc`) — cli_inner_pretty.js:551557 — fires the PreCompact hook event; returns `{newCustomInstructions, userDisplayMessage, blockedBy?}`.
- `executePostCompactHooks` (`zJH`) — cli_inner_pretty.js:551596 — fires the PostCompact hook event with `compact_summary`; returns `{userDisplayMessage}`.
- `getCompactPrompt` (`bA8`) — cli_inner_pretty.js:270917 — TEXT-ONLY summary-request prompt + 9-section `<analysis>`/`<summary>` spec; appends `Additional Instructions:` + `Iv7`.
- `getPartialCompactPrompt` (`Cv7`) — cli_inner_pretty.js:270824 — direction-specific (`up_to`/`from`) partial-compaction prompt.
- `getCompactUserSummaryMessage` (`jP$`) — cli_inner_pretty.js:271053 — wraps the extracted summary into the post-compact user message with transcript hint + optional preserved-verbatim/REPL-cleared notices + continue directive.
- `extractSummaryBlock` (`xc5`) — cli_inner_pretty.js:271031 — strips `<analysis>`, rewrites `<summary>…</summary>` to `Summary:\n…`, collapses blanks.
- `tokenCountWithEstimation` (`jJ`) — cli_inner_pretty.js:221106 — `preCompactTokenCount`: authoritative usage of the last real-usage round (`Mo`) + rough estimate (`sT`) of the tail.
- `tokenCountFromLastAPIResponse` (`jo`) — cli_inner_pretty.js:221050 — `Mo(usage)` of the last assistant message with usage; the `postCompactTokenCount`.
- `roughTokenCountEstimationForMessages` (`sT`) — cli_inner_pretty.js:425283 — char-based (~4 chars/token) estimate over a message array; used in PTL gap accounting and `truePostCompactTokenCount`.
- `sumUsageTokens` (`Mo`) — cli_inner_pretty.js:221047 — `input + cache_creation + cache_read + output` for a usage object.
- `getTokenUsage` (`i$H`) — cli_inner_pretty.js:221033 — extracts `message.usage` from a real (non-synthetic) assistant message; excludes sentinel model `CT`.
- `getAssistantMessageText` (`qU`) — cli_inner_pretty.js:444999 — joins all text blocks of an assistant message, trimmed; null if none.
- `getCompactSummaryText` (`CA8`) — cli_inner_pretty.js:270805 — trimmed text of the preferred summary assistant message (via `IA8`).
- `findSummaryAssistantMessage` (`IA8`) — cli_inner_pretty.js:270798 — prefers the last non-error assistant message whose text contains `<summary>`, else last non-error assistant.
- `groupMessagesByApiRound` (`riH`) — cli_inner_pretty.js:270812 — groups messages into API rounds keyed by assistant message id; used by `$X4` and reactive `xA8`.
- `getPromptTooLongTokenGap` (`ucH`) — cli_inner_pretty.js:186340 — parses `X tokens > Y tokens` (via `kP6`) and returns `X-Y` if positive.
- `startsWithApiErrorPrefix` (`lN`) — cli_inner_pretty.js:186327 — true if a string starts with the `EZ`=`"API Error"` prefix (or login-required variant). Distinct from `S1H` which tests the `Rd` PTL prefix.
- `createCompactBoundaryMessage` (`PP$`) — cli_inner_pretty.js:445985 — builds the `system/compact_boundary` marker with `compactMetadata` + `logicalParentUuid` relink anchor.
- `isCompactBoundaryMessage` (`PJ`) — cli_inner_pretty.js:446011 — true if message is `system/compact_boundary`.
- `getMessagesAfterCompactBoundary` (`nf`) — cli_inner_pretty.js:446021 — slices from the last compact boundary onward (or whole array if none).
- `createUserMessage` (`T8`) — cli_inner_pretty.js:443846 — builds a user message; used for the summary-request and the summary user-message.
- `createAttachmentMessage` (`VK`) — cli_inner_pretty.js:413715 — wraps an attachment payload into an attachment message for post-compact re-injection.
- `stripImagesFromMessages` (`wN6`) — cli_inner_pretty.js:422983 — replaces image/document blocks (incl. nested in tool_result) with `[image]`/`[document]` markers before summarization.
- `stripQueuedOnlyAttachments` (`db_`) — cli_inner_pretty.js:423011 — stripNonEssential helper: drops attachment messages except `queued_command`.
- `truncateToolPayloads` (`cb_`) — cli_inner_pretty.js:423040 — stripNonEssential helper: truncates tool_use inputs and tool_result content to `oJ4`=100 chars and drops cache-control blocks.
- `createCompactCanUseTool` (`DN6`) — cli_inner_pretty.js:423532 — returns a CanUseTool that DENIES every tool ("Tool use is not allowed during compaction").
- `runForkedAgent` (`xZ`) — cli_inner_pretty.js:423562 (call site) — forked single-turn agent reusing the main thread's cache prefix; the cache-sharing summarize path.
- `createPostCompactFileAttachments` (`rA8`) — cli_inner_pretty.js:423684 — re-injects up to `iA8`=5 most-recent read files within `pb_`=50000 token budget (`Ub_`=5000 per file).
- `createSkillAttachmentIfNeeded` (`aA8`) — cli_inner_pretty.js:423717 — re-injects invoked-skill content (`Qb_`=25000 budget, `Fb_`=5000 per skill, head-truncated via `ib_`+`sJ4`).
- `createPlanAttachmentIfNeeded` (`oA8`) — cli_inner_pretty.js:423711 — plan-file reference attachment if a plan exists.
- `createPlanModeAttachmentIfNeeded` (`sA8`) — cli_inner_pretty.js:423732 — `plan_mode` attachment so the model stays in plan mode post-compact.
- `createAsyncAgentAttachmentsIfNeeded` (`tA8`) — cli_inner_pretty.js:423746 — `task_status` attachments for running/finished-unretrieved local agents.
- `openTracingSpan` (`xP$`) — cli_inner_pretty.js:276662 — starts the OTEL `claude_code.compaction` span (no-op unless `F5H()` telemetry enabled).
- `setSpanAttributes` (`mY8`) — cli_inner_pretty.js:276353 — sets span attributes (no-op stub in this build); receives pre/post tokens + success.
- `setSpanError` (`EEH`) — cli_inner_pretty.js:276356 — sets span status to ERROR with optional message on throw.
- `emitCompactionMetric` (`iwH`) — cli_inner_pretty.js:222566 — emits the `compaction` OTLP gauge (`j1`) with trigger/success/duration/pre/post tokens/error in `finally`.
- `logFeatureOk` (`SH`) — cli_inner_pretty.js:41590 — fires `tengu_feature_ok{feature_name}` with the `compact_auto`/`compact_manual` label on success.
- `logFeatureBad` (`uH`) — cli_inner_pretty.js:41593 — fires `tengu_feature_bad{feature_name, error_code}` on each failure branch.
- `addErrorNotificationIfNeeded` (`KX4`) — cli_inner_pretty.js:423510 — shows "Error compacting conversation" unless abort (`GC`), not-enough-messages (`kH$`), or PreCompact-block (`KeH`).
- `logPermissionContextForAnts` (`iiH`) — cli_inner_pretty.js:270731 — no-op stub in this build; called with `(toolPermissionContext, "summary")`.
- `getFeatureValue` (`V$`) — cli_inner_pretty.js:423153 (call site) — GrowthBook feature read; `tengu_compact_cache_prefix` defaults true (the cache-prefix gate).
- `reactiveCompactSummarizeOnce` (`uc5`) — cli_inner_pretty.js:271156 — reactive-lane single summarize attempt (always forked, `forkLabel:"reactive-compact"`).
- `reactiveCompactOnPromptTooLong` (`xA8`) — cli_inner_pretty.js:271231 — reactive-lane orchestrator: peels tail groups, widens preserved count on each PTL, seeded by `initialTokenGap`.
- `groupsToDropForTokenGap` (`bv7`) — cli_inner_pretty.js:271220 — counts trailing group token-sums needed to cover a gap; half-the-groups fallback.

Key constants:

- `MAX_PTL_RETRIES` (`HX4`) — cli_inner_pretty.js:423806 — =3.
- `PROMPT_TOO_LONG_ERROR_MESSAGE` (`Rd`) — cli_inner_pretty.js:186902 — `"Prompt is too long"`. The PTL-detection sentinel prefix.
- `ERROR_MESSAGE_NOT_ENOUGH_MESSAGES` (`kH$`) — cli_inner_pretty.js:423805 — `"Not enough messages to compact."`.
- `ERROR_MESSAGE_PROMPT_TOO_LONG` (`z08`) — cli_inner_pretty.js:423808 — `"Conversation too long. Press esc twice to go up a few messages and try again."`.
- `ERROR_MESSAGE_USER_ABORT` (`GC`) — cli_inner_pretty.js:423809 — `"API Error: Request was aborted."`.
- `ERROR_MESSAGE_PRECOMPACT_BLOCKED` (`KeH`) — cli_inner_pretty.js:423810 — `"Compaction blocked by PreCompact hook"`.
- `ERROR_MESSAGE_INCOMPLETE_RESPONSE` (`NH$`) — cli_inner_pretty.js:423811 — `"Compaction interrupted · This may be due to network issues — please try again."`.
- `PTL_RETRY_MARKER` (`aJ4`) — cli_inner_pretty.js:423807 — `"[earlier conversation truncated for compaction retry]"`.
- `COMPACT_MAX_OUTPUT_TOKENS` (`NO$`) — cli_inner_pretty.js:130224 — =20000 (min with model max).
- `POST_COMPACT_MAX_FILES_TO_RESTORE` (`iA8`) — cli_inner_pretty.js:423799 — =5.
- `POST_COMPACT_TOKEN_BUDGET` (`pb_`) — cli_inner_pretty.js:423800 — =50000.
- `POST_COMPACT_MAX_TOKENS_PER_FILE` (`Ub_`) — cli_inner_pretty.js:423801 — =5000.
- `POST_COMPACT_MAX_TOKENS_PER_SKILL` (`Fb_`) — cli_inner_pretty.js:423802 — =5000.
- `POST_COMPACT_SKILLS_TOKEN_BUDGET` (`Qb_`) — cli_inner_pretty.js:423803 — =25000.
- `STRIP_TOOL_PAYLOAD_CHAR_LIMIT` (`oJ4`) — cli_inner_pretty.js:423804 — =100.

Key class:

- `PreCompactBlockedError` (`PzH`) — cli_inner_pretty.js:423862 — Error subclass thrown by `A08` when a PreCompact hook blocks compaction.
