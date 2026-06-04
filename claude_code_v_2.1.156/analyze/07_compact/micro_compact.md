# Micro-compaction (keep-recent tool-result clearing)

## Overview

Micro-compaction in v2.1.156 is a **distinct, lighter strategy** from full compaction (`AU2`/summarization). The defining contrast:

- **Full compact** calls the LLM to summarize the entire transcript into a single synthetic message. It is lossy (its quality depends on the summary), and within a session it is effectively irreversible.
- **Micro-compact (keep-recent)** never calls an LLM. It walks the message array, finds `tool_result` blocks belonging to *older* tool calls of a fixed set of "compactable" tools, and overwrites just the `.content` field of those blocks with either the constant placeholder `Gi6 = "[Old tool result content cleared]"` (`cli_inner_pretty.js:447308`) or — if the original content could be persisted to disk — a pointer string built around the `Dg_ = "<persisted-output>"` tag (`cli_inner_pretty.js:447309`). The conversational structure (tool_use/tool_result pairing, message order, thinking blocks, recent results) is left intact. Because cleared content is persisted to disk *before* clearing, the operation is **reversible**: the model can re-`Read` the persisted file, and the UI/transcript can recover the original bytes.

In this build the keep-recent micro-compactor is wired to a **server-driven reactive trigger** named `context_hint` (anthropic beta `context-hint-2026-04-09`, `cli_inner_pretty.js:98137`), gated behind the GrowthBook flag `tengu_hazel_osprey` (`X69`, `cli_inner_pretty.js:556448`). This is the post-2.1.88 evolution: instead of the client deciding to micro-compact on a *time gap* (the v2.1.88 `maybeTimeBasedMicrocompact`), v2.1.156 sends a normal request carrying a `context_hint` beta header; if the server says "this prompt is too big" (HTTP 422/424, or a streaming `invalid_request_error`), the client *reacts* by running keep-recent clearing and retrying. The telemetry event name (`tengu_time_based_microcompact`, emitted at `cli_inner_pretty.js:447293`) and the constant placeholder string are inherited verbatim from the prior time-based design, but the *trigger mechanism* is entirely new (`trigger:"context_hint"`).

### Where it plugs into the agent loop

The request loop constructs a per-request controller at `cli_inner_pretty.js:557072` (`createContextHintController`). Before each attempt it calls `controller.buildRequestParams(messages)` at `cli_inner_pretty.js:557163` to optionally attach the beta + body. On a server rejection it calls `controller.onRequestError(...)` at `cli_inner_pretty.js:557440`; on a mid-stream invalid-request it sets the fallback cause `context_hint_sse` at `cli_inner_pretty.js:557799` and runs `controller.onStreamFallback(...)` at `cli_inner_pretty.js:557868`. Either reactive path, when it actually clears something (guarded by `clearedIds.size > 0`), swaps the in-flight messages `b` and notifies the history layer via `z.onHintCleared(...)` at `cli_inner_pretty.js:557442` / `cli_inner_pretty.js:557870`.

---

## Subsystem map (cli_inner_pretty.js)

The whole keep-recent engine lives in a tight block at **447221–447312**, plus the controller that drives it at **556448–556591**, plus the request-loop wiring at **557072 / 557163 / 557440 / 557799 / 557868**, plus the persist helper at **221617** (`gwH`) and the message-history apply callback at **451442** (`onHintCleared`).

```
Lg_      447221  tokenEstimateOfToolResult(block)     — sum text tokens; image/document = Jg_(2000)
Pg_      447230  collectCompactableToolUseIds(msgs)   — walk assistant msgs, ids whose tool ∈ Xg_
q04      447238  collectClearedReadFilePaths(msgs,ids)— Read tool_uses whose id is being cleared → file_path[]
Wg_      447250  isAlreadyClearedContent(content)     — content === Gi6 OR startsWith(Dg_)
Vi6      447253  computeKeepClearSets(msgs, keepRecent)— keep last K ids, clear the rest, sum tokensSaved, list candidates
Zk$      447268  applyClearingToMessages(msgs, ids, contentById) — in-place .content rewrite (placeholder or persisted ptr)
K04      447282  applyKeepRecentMicrocompact(msgs, sig, cfg)     — gate on Ti6(20000); persist; rewrite; emit telemetry
Gi6      447308  "[Old tool result content cleared]"  — cleared placeholder
Dg_      447309  "<persisted-output>"                 — persisted-pointer tag prefix
Ti6      447310  20000                                — minimum tokensSaved to fire
Jg_      447311  2000                                 — per-image/document token charge
Xg_      447312/447329  Set([Read, ...shell, Grep, Glob, WebSearch, WebFetch, Edit, Write]) — compactable tools
```

---

### Algorithm 1: Candidate selection — `computeKeepClearSets` (`Vi6`, 447253–447267)

**What it does:** Given the full message array and `keepRecent`, it partitions all compactable tool_use IDs into a "keep" set (the most-recent N) and a "clear" set (everything older), then scans the user messages for the `tool_result` blocks matching the clear set, summing how many tokens would be freed and collecting those blocks as clearing candidates.

**How it works (step by step):**
1. `q = Pg_(H)` — collect, *in encounter order*, the `id` of every `tool_use` block in assistant messages whose `name` is in the compactable set `Xg_` (`447254`). Order matters: this list is chronological, so "recent" = end of the array.
2. `K = Math.max(1, $)` — floor `keepRecent` at 1 (`447255`). This guards two degenerate cases: `slice(-0)` returns the *entire* array (paradoxically keeping everything), and `keepRecent=0` would clear *all* results, leaving the model with zero working context.
3. `_ = new Set(q.slice(-K))` — the keep set is the last K IDs (`447256`).
4. `z = new Set(q.filter(f => !_.has(f)))` — the clear set is everything not kept (`447257`).
5. If `z.size === 0`, the for-loop is skipped and `tokensSaved` stays 0 (`447260`) — nothing older than the keep window exists.
6. Otherwise, walk every **user** message's content (`447261–447265`). For each `tool_result` block whose `tool_use_id ∈ clearSet` **and** that is **not already cleared** (`!Wg_(O.content)`), add `Lg_(O)` to the running token total `A` and push the block into candidates `Y`. The `!Wg_` guard (`447264`) is the **idempotency check**: a block already showing the placeholder or a persisted pointer contributes 0 and is not re-counted, so repeated micro-compact passes do not double-count or thrash.
7. Returns `{ clearSet, keepSet, tokensSaved, candidates }` (`447266`).

**Why this approach:** Computing the keep/clear split from *tool_use* IDs (assistant side) but applying it to *tool_result* blocks (user side) is the key structural choice. Tool calls and their results live in different messages; keying on the stable `tool_use_id` lets the engine pair them without caring about message boundaries or interleaving. Using `Set` for membership keeps the second-pass scan O(blocks). The "encounter order then `slice(-K)`" idiom is a cheap recency proxy that avoids timestamps entirely.

**Key insight:** This function is *pure analysis* — it mutates nothing and makes no I/O. That is deliberate: it is called twice, once in the controller's `buildRequestParams` at `cli_inner_pretty.js:556547` just to test `tokensSaved >= Ti6` for the *decision* to advertise the hint, and again inside `K04` at `447283` to actually do the work. Separating "would it help?" from "do it" lets the controller advertise the `context_hint` beta to the server *only* when a worthwhile clearing is available locally.

```javascript
// ============================================
// computeKeepClearSets - Partition compactable tool_use IDs into keep(last N)/clear(rest) and tally reclaimable tokens
// Location: cli_inner_pretty.js:447253-447267
// ============================================

// ORIGINAL (for source lookup):
function Vi6(H, $) {
  let q = Pg_(H),
    K = Math.max(1, $),
    _ = new Set(q.slice(-K)),
    z = new Set(q.filter((f) => !_.has(f))),
    A = 0,
    Y = [];
  if (z.size > 0)
    for (let f of H) {
      if (f.type !== "user" || !Array.isArray(f.message.content)) continue;
      for (let O of f.message.content)
        if (O.type === "tool_result" && z.has(O.tool_use_id) && !Wg_(O.content)) ((A += Lg_(O)), Y.push(O));
    }
  return { clearSet: z, keepSet: _, tokensSaved: A, candidates: Y };
}

// READABLE (for understanding):
function computeKeepClearSets(messages, keepRecent) {
  const compactableIds = collectCompactableToolUseIds(messages);
  const keepCount = Math.max(1, keepRecent); // floor at 1: slice(-0)=keep all; 0=clear all
  const keepSet  = new Set(compactableIds.slice(-keepCount));
  const clearSet = new Set(compactableIds.filter(id => !keepSet.has(id)));
  let tokensSaved = 0;
  const candidates = [];
  if (clearSet.size > 0)
    for (const msg of messages) {
      if (msg.type !== 'user' || !Array.isArray(msg.message.content)) continue;
      for (const block of msg.message.content)
        if (block.type === 'tool_result' && clearSet.has(block.tool_use_id) && !isAlreadyClearedContent(block.content)) {
          tokensSaved += tokenEstimateOfToolResult(block);
          candidates.push(block);
        }
    }
  return { clearSet, keepSet, tokensSaved, candidates };
}

// Mapping: Vi6->computeKeepClearSets, H->messages, $->keepRecent, q->compactableIds, Pg_->collectCompactableToolUseIds, K->keepCount, _->keepSet, z->clearSet, A->tokensSaved, Y->candidates, f/O->msg/block, Wg_->isAlreadyClearedContent, Lg_->tokenEstimateOfToolResult
```

---

### Algorithm 2: In-place substitution — `applyClearingToMessages` (`Zk$`, 447268–447281)

**What it does:** Produces a new message array where every targeted `tool_result` block has its `.content` replaced by the per-ID replacement string, preserving all other structure with structural sharing.

**How it works:**
1. Fast path: if the clear-ID set `$` is empty, return a shallow copy `[...H]` (`447269`) — no work.
2. `H.map` over messages; non-user or non-array-content messages pass through by identity (`447271`) — no new object allocated.
3. For a user message, map its content blocks (`447273`): a `tool_result` whose `tool_use_id` is *not* in the clear set is returned by identity (`447274`).
4. For a targeted block, look up the replacement `Y = q?.get(A.tool_use_id) ?? Gi6` (`447275`) — the per-ID map `q` (from `K04`) holds either a persisted-output pointer or, if persistence failed, falls back to the constant placeholder `Gi6`.
5. **Idempotency on apply:** if `A.content === Y` already, return the block unchanged (`447276`) — avoids spurious object churn and avoids marking the message as touched.
6. Otherwise set the touched flag `_ = !0` and return `{ ...A, content: Y }` (`447277`) — a shallow clone with only `.content` swapped.
7. Only if some block was touched does the message get a new wrapper object `{ ...K, message: { ...K.message, content: z } }` (`447279`); otherwise the original message is returned by identity.

**Why this approach:** Maximal structural sharing. React's render memoization and downstream equality checks benefit from unchanged messages keeping their identity, so the UI does not re-render untouched history. Replacing only `.content` (not the whole block) keeps `type`, `tool_use_id`, `is_error` etc. intact so the API still sees a well-formed `tool_result` paired with its `tool_use`.

**Key insight:** The replacement is a *value*, not a deletion. The block stays in the array, so tool_use/tool_result pairing is never broken — this is why micro-compact needs no pairing-repair pass (contrast the full-compact summarizer fork, which must regroup and re-pair). The content is reduced to a few tokens (`"[Old tool result content cleared]"` ≈ 8 tokens (33 chars / 4, per the build's roughTokenCountEstimation), or a one-line file pointer) rather than removed.

```javascript
// ============================================
// applyClearingToMessages - Replace only the .content of targeted tool_result blocks, with maximal structural sharing
// Location: cli_inner_pretty.js:447268-447281
// ============================================

// ORIGINAL (for source lookup):
function Zk$(H, $, q) {
  if ($.size === 0) return [...H];
  return H.map((K) => {
    if (K.type !== "user" || !Array.isArray(K.message.content)) return K;
    let _ = !1,
      z = K.message.content.map((A) => {
        if (A.type !== "tool_result" || !$.has(A.tool_use_id)) return A;
        let Y = q?.get(A.tool_use_id) ?? Gi6;
        if (A.content === Y) return A;
        return ((_ = !0), { ...A, content: Y });
      });
    return _ ? { ...K, message: { ...K.message, content: z } } : K;
  });
}

// READABLE (for understanding):
function applyClearingToMessages(messages, clearIds, contentById) {
  if (clearIds.size === 0) return [...messages];
  return messages.map(msg => {
    if (msg.type !== 'user' || !Array.isArray(msg.message.content)) return msg;
    let touched = false;
    const newContent = msg.message.content.map(block => {
      if (block.type !== 'tool_result' || !clearIds.has(block.tool_use_id)) return block;
      const replacement = contentById?.get(block.tool_use_id) ?? CLEARED_PLACEHOLDER; // Gi6
      if (block.content === replacement) return block; // apply-side idempotency
      touched = true;
      return { ...block, content: replacement };
    });
    return touched ? { ...msg, message: { ...msg.message, content: newContent } } : msg;
  });
}

// Mapping: Zk$->applyClearingToMessages, H->messages, $->clearIds, q->contentById, K->msg, A->block, _->touched, z->newContent, Y->replacement, Gi6->CLEARED_PLACEHOLDER
```

---

### Algorithm 3: The orchestrator — `applyKeepRecentMicrocompact` (`K04`, 447282–447307)

**What it does:** The single entry point that decides whether to micro-compact, persists the content it is about to clear (for reversibility), applies the clearing, emits telemetry, and returns the new messages plus the cleared-ID/content maps for the history-apply callback. (The function body and return end at `447306`; the closing brace is on `447307`.)

**How it works:**
1. `{keepSet, tokensSaved, candidates} = Vi6(H, q.keepRecent)` (`447283`).
2. **The gate:** `if (_ < Ti6) return null` — if it would save fewer than **20000** tokens, do nothing and return null (`447284`). This is the central economic decision (see Decision 4).
3. Build `A = new Set(candidate tool_use_ids)` and an empty replacement map `Y` (`447285–447286`).
4. **Persist-then-map loop (`447287–447290`):** for each candidate, call `M = await q.persist?.(O.content, O.tool_use_id)`. The persist callback (`vLz`, `cli_inner_pretty.js:556496`) writes the content to the session's tool-results dir and returns a human-readable pointer string `"<persisted-output>Tool result saved to: {filepath}\n\nUse Read to view</persisted-output>"`. If persist returns null (non-text content, write failure, or no persist callback) the map entry falls back to `Gi6` (`447289`). So each cleared block becomes *either* a "go re-Read this file" pointer *or* the bare cleared placeholder.
5. `f = Zk$(H, A, Y)` — apply the clearing (`447291`).
6. **Telemetry + side effects (`447292–447305`):** emit `tengu_time_based_microcompact` with `{toolsCleared, toolsKept, keepRecent, tokensSaved, trigger:"context_hint"}`; call `SH("compact_micro_keep_recent")` (a success/usage counter); `N(...)` debug log `[KEEP-RECENT MC] context_hint trigger, cleared N tool results (~T tokens), kept last K`; `LEH()` sets the global "compact warning suppressed" flag (`cli_inner_pretty.js:271340`); and if `Jc() && $` (cowork mode AND an abort signal present) call `Jv7($)` to mark cache deletions pending (`cli_inner_pretty.js:270029`).
7. Return `{messages: f, tokensSaved: _, clearedIds: A, clearedContent: Y}` (`447306`).

**Key insight:** Persistence happens *before* clearing and the resulting pointer is what gets written into the block. So the "compaction" doubles as a "spill to disk": the model is told exactly where to find the full output if it needs it. This is the mechanism that makes micro-compact *reversible without an LLM* — there is no information loss, only relocation.

```javascript
// ============================================
// applyKeepRecentMicrocompact - Gate on 20k-token floor, persist candidates, apply clearing, emit telemetry
// Location: cli_inner_pretty.js:447282-447307
// ============================================

// ORIGINAL (for source lookup):
async function K04(H, $, q) {
  let { keepSet: K, tokensSaved: _, candidates: z } = Vi6(H, q.keepRecent);
  if (_ < Ti6) return null;
  let A = new Set(z.map((O) => O.tool_use_id)),
    Y = new Map();
  for (let O of z) {
    let M = O.content ? await q.persist?.(O.content, O.tool_use_id) : null;
    Y.set(O.tool_use_id, M ?? Gi6);
  }
  let f = Zk$(H, A, Y);
  if (
    (d("tengu_time_based_microcompact", {
      toolsCleared: A.size,
      toolsKept: K.size,
      keepRecent: q.keepRecent,
      tokensSaved: _,
      trigger: "context_hint",
    }),
    SH("compact_micro_keep_recent"),
    N(`[KEEP-RECENT MC] context_hint trigger, cleared ${A.size} tool results (~${_} tokens), kept last ${K.size}`),
    LEH(),
    Jc() && $)
  )
    Jv7($);
  return { messages: f, tokensSaved: _, clearedIds: A, clearedContent: Y };
}

// READABLE (for understanding):
async function applyKeepRecentMicrocompact(messages, signal, config) {
  const { keepSet, tokensSaved, candidates } = computeKeepClearSets(messages, config.keepRecent);
  if (tokensSaved < MIN_TOKENS_SAVED) return null; // Ti6 = 20000
  const clearedIds = new Set(candidates.map(b => b.tool_use_id));
  const clearedContent = new Map();
  for (const block of candidates) {
    // persist-before-clear: write full content to disk, get a recoverable pointer
    const pointer = block.content ? await config.persist?.(block.content, block.tool_use_id) : null;
    clearedContent.set(block.tool_use_id, pointer ?? CLEARED_PLACEHOLDER); // ptr or '[Old tool result content cleared]'
  }
  const result = applyClearingToMessages(messages, clearedIds, clearedContent);
  logEvent('tengu_time_based_microcompact', {
    toolsCleared: clearedIds.size, toolsKept: keepSet.size,
    keepRecent: config.keepRecent, tokensSaved, trigger: 'context_hint',
  });
  incrementCounter('compact_micro_keep_recent');
  logDebug(`[KEEP-RECENT MC] context_hint trigger, cleared ${clearedIds.size} tool results (~${tokensSaved} tokens), kept last ${keepSet.size}`);
  suppressCompactWarning();
  if (isCoworkMode() && signal) markCacheDeletionsPending(signal);
  return { messages: result, tokensSaved, clearedIds, clearedContent };
}

// Mapping: K04->applyKeepRecentMicrocompact, H->messages, $->signal, q->config, Vi6->computeKeepClearSets, _->tokensSaved, z->candidates, K->keepSet, A->clearedIds, Y->clearedContent, M->pointer, f->result, Ti6->MIN_TOKENS_SAVED, d->logEvent, SH->incrementCounter, N->logDebug, LEH->suppressCompactWarning, Jc->isCoworkMode, Jv7->markCacheDeletionsPending, Gi6->CLEARED_PLACEHOLDER
```

---

### Decision 4: The 20000-token floor (`Ti6`) — why a minimum-savings gate?

**What it does:** Micro-compact refuses to run unless it would free at least 20000 tokens (`cli_inner_pretty.js:447310`).

**How it works:** Checked in two places — `K04` at `447284` (`if (_ < Ti6) return null`) and the controller's `buildRequestParams` at `cli_inner_pretty.js:556547` (`Vi6(z, k69).tokensSaved >= Ti6`) which decides whether to *advertise* the `context_hint` beta to the server at all.

**Why this approach / trade-offs:**
- Clearing tool results is not free: it invalidates the server-side prompt cache for the affected prefix (every cleared block changes the prompt bytes), forcing a cache re-write on the next turn. A tiny saving (say 500 tokens) would trade an expensive cache miss for a negligible context reduction — net negative.
- The 20000 floor ensures the saving dwarfs the re-write cost, so micro-compact only triggers when there is a genuinely large block of stale tool output to reclaim.
- This is contrasted below with the time-based predecessor, which had **no minimum-savings gate**; the 20000 floor is a v2.1.156 addition that makes the operation strictly worthwhile.

**Key insight:** The double-check (controller pre-test + `K04` re-test) is not redundant. The controller test gates whether to even *send* the `context_hint` beta header (avoiding a useless server round-trip), while the `K04` test is the authoritative gate at apply time. Because both use the same `Vi6`, they always agree.

---

### Decision 5: The `context_hint` reactive controller — `createContextHintController` (`kLz`, 556535–556577)

**What it does:** A stateful per-request controller that (a) decides whether to attach the `context_hint` beta to the outgoing request, and (b) on specific server rejections, runs keep-recent micro-compact and signals a retry.

**How it works:**
- `kLz(H)` returns null immediately unless first-party betas are enabled and the querySource starts with `repl_main_thread` (`cli_inner_pretty.js:556536–556537`) — main thread only, no subagents.
- `active = X69()` reads the GrowthBook flag `tengu_hazel_osprey` (`cli_inner_pretty.js:556448`). Internal state: `q` (done/stripped), `K` (hint was sent this attempt), `_` (stream error classified).
- **`buildRequestParams(z)`** (`556542–556553`): returns null if inactive or already done. Otherwise tests `Vi6(z, k69).tokensSaved >= Ti6`. If true, returns `{beta: k76, body:{context_hint:{enabled:true, target_tokens_saved: L69()}}}`. Note `enabled:true` is set unconditionally whenever the gate passes; only `target_tokens_saved` is conditionally spread (and only when the floor `Y > 0`). `k69 = 5` is keepRecent (`cli_inner_pretty.js:556578`); `L69()` reads `tengu_hazel_osprey_floor` defaulting to `VLz = 75000` (`cli_inner_pretty.js:556488`). The body+beta are then merged into the request at `cli_inner_pretty.js:557163`.
- **`onRequestError(z, A)`** (`556554–556562`): if a hint was sent and not done, classify the error:
  - `P69` (HTTP 422 or 424, `cli_inner_pretty.js:556454`) → the canonical "prompt too big / context hint" rejection → set done, call `tKq(...)` which runs the actual micro-compact and returns retry messages.
  - `G69` (HTTP 400 with "Unexpected value … anthropic-beta", `cli_inner_pretty.js:556465`) → server does not know the beta → set done, log `tengu_context_hint_busy_fallback` with status 400, return messages unchanged (gives up the hint gracefully).
  - `Z69` (HTTP 409, `cli_inner_pretty.js:556462`) and the overloaded case dispatched via the injected `H.is529Error(z)` predicate → set done, log busy-fallback, return null (let normal retry handle it).
- **`classifyStreamError` / `onStreamFallback`** (`556563–556572`): `W69` detects a streaming `invalid_request_error` with no HTTP status (`cli_inner_pretty.js:556457`). When that fires mid-stream, the loop sets fallback cause `context_hint_sse` (`cli_inner_pretty.js:557799`) and `onStreamFallback` runs `tKq` to micro-compact then retry non-streaming (`cli_inner_pretty.js:557868–557871`).
- **`strip()`** (`556573–556575`) marks done.

**The apply path `tKq` → `y69` (`556503–556533`):** `y69` measures pre-tokens, runs `K04(H, $, {keepRecent: k69, persist: vLz})`, measures post-tokens, and returns a record with `clearedIds`/`clearedContent` plus `mcApplied`/`mcTokensSaved`. `tKq` wraps that, fires `SH("compact_hint_reject")` and the `tengu_context_hint_reject` telemetry (`cli_inner_pretty.js:556475`, carrying `requestId, preCompactTokenEstimate, postCompactTokenEstimate, tokensSaved, mcApplied, mcTokensSaved`), and returns `{messages, clearedIds, clearedContent}`.

**Why this approach:** The time-based predecessor guessed locally (a time gap) when the server cache had likely expired. v2.1.156 lets the *server* decide — it knows the true prompt size and its own limits — and only does local clearing work when the server actually rejects. This is strictly more accurate (no false positives from over-eager local heuristics) and only pays the clearing/cache-miss cost when truly necessary. The beta header `context_hint` is the negotiation channel: client says "I support clearing," server says "then please clear" via a 422/424.

**Key insight:** The retry messages and the persisted history are updated through *two different paths*. The retry loop swaps the in-flight `b = C6.messages` (`cli_inner_pretty.js:557442`, `557870`) so the *next attempt* sends the shrunk prompt. Separately — and only when `clearedIds.size > 0` — `z.onHintCleared(clearedIds, clearedContent)` (`cli_inner_pretty.js:451442–451446`) re-applies `Zk$` to the *persisted conversation history* `U`, pushes a `hint_clears` history event, AND drops the cleared Read files from `readFileState` via `q04` (so a future `Read` of those paths re-reads from disk rather than serving a stale cached snapshot). This keeps the displayed/saved transcript consistent with what was sent.

```javascript
// ============================================
// contextHintController.buildRequestParams - Decide whether to advertise the context_hint beta on this request
// Location: cli_inner_pretty.js:556542-556553
// ============================================

// ORIGINAL (for source lookup):
return {
    active: $,
    buildRequestParams(z) {
      if (((K = !1), !$ || q)) return null;
      K = !0;
      let A = Vi6(z, k69).tokensSaved >= Ti6,
        Y = L69();
      return {
        beta: k76,
        body: A ? { context_hint: { enabled: !0, ...(Y > 0 && { target_tokens_saved: Y }) } } : null,
      };
    },

// READABLE (for understanding):
return {
  active: isActive, // tengu_hazel_osprey
  buildRequestParams(messages) {
    hintSentThisAttempt = false;
    if (!isActive || done) return null;
    hintSentThisAttempt = true;
    // enabled:true is NOT floor-gated; only target_tokens_saved is conditional
    const wouldSaveEnough = computeKeepClearSets(messages, KEEP_RECENT /*=5*/).tokensSaved >= MIN_TOKENS_SAVED /*20000*/;
    const floor = getHintFloor(); // tengu_hazel_osprey_floor, default 75000
    return {
      beta: CONTEXT_HINT_BETA, // 'context-hint-2026-04-09'
      body: wouldSaveEnough
        ? { context_hint: { enabled: true, ...(floor > 0 && { target_tokens_saved: floor }) } }
        : null,
    };
  },

// Mapping: $->isActive, q->done, K->hintSentThisAttempt, z->messages, Vi6->computeKeepClearSets, k69->KEEP_RECENT(5), Ti6->MIN_TOKENS_SAVED(20000), A->wouldSaveEnough, Y/L69->floor/getHintFloor, k76->CONTEXT_HINT_BETA
```

```javascript
// ============================================
// persistToolResult - Spill tool_result content to disk and build the <persisted-output> recovery pointer
// Location: cli_inner_pretty.js:556496-556502
// ============================================

// ORIGINAL (for source lookup):
async function vLz(H, $) {
  let q = await gwH(H, $);
  if (cwH(q)) return null;
  return `${AnH}Tool result saved to: ${q.filepath}

Use ${HK} to view${$06}`;
}

// READABLE (for understanding):
async function persistToolResult(content, toolUseId) {
  const persisted = await writeToolResultToDisk(content, toolUseId); // gwH
  if (isPersistError(persisted)) return null; // null → caller falls back to '[Old tool result content cleared]'
  return `<persisted-output>Tool result saved to: ${persisted.filepath}

Use Read to view</persisted-output>`;
}

// Mapping: vLz->persistToolResult, H->content, $->toolUseId, gwH->writeToolResultToDisk, cwH->isPersistError, AnH->'<persisted-output>', HK->'Read', $06->'</persisted-output>'
```

```javascript
// ============================================
// onHintCleared - Re-apply clearing to persisted history + evict cleared Read files from readFileState
// Location: cli_inner_pretty.js:451442-451446
// ============================================

// ORIGINAL (for source lookup):
onHintCleared: (I$, $$) => {
  q$.push({ type: "hint_clears", ids: [...I$], contentById: Object.fromEntries($$) });
  for (let v$ of q04(U, I$)) G.readFileState.delete(LK(v$));
  U = Zk$(U, I$, $$);
},

// READABLE (for understanding):
onHintCleared: (clearedIds, clearedContent) => {
  pendingEvents.push({ type: 'hint_clears', ids: [...clearedIds], contentById: Object.fromEntries(clearedContent) });
  for (const filePath of collectClearedReadFilePaths(history, clearedIds))
    ctx.readFileState.delete(normalizePath(filePath)); // force fresh re-read later
  history = applyClearingToMessages(history, clearedIds, clearedContent);
},

// Mapping: I$->clearedIds, $$->clearedContent, q$->pendingEvents, q04->collectClearedReadFilePaths, U->history, LK->normalizePath, Zk$->applyClearingToMessages, G.readFileState->ctx.readFileState
```

---

### Decision 6: The `microcompact_boundary` message subtype — rendered nowhere (394644)

**What it does (or does not):** In v2.1.156 the only reference to `microcompact_boundary` is in the message renderer at **`cli_inner_pretty.js:394644`**: `if (q.subtype === "microcompact_boundary") return null;`. The subtype is recognized but **renders to nothing** — no visible UI banner, unlike `compact_boundary` (`cli_inner_pretty.js:394637`, which renders "Context compacted") or `read_divider` (`cli_inner_pretty.js:394645`).

**Why it is a no-op now:** Keep-recent micro-compact in v2.1.156 does **not create** a boundary message. There is no `subtype:"microcompact_boundary"` *construction* site anywhere in the v2.1.156 bundle — only the render-skip. The keep-recent path communicates exclusively via telemetry (`tengu_time_based_microcompact`) and the suppress-warning flag (`LEH`). The render branch survives only to gracefully ignore any such message that a resumed/legacy session might carry.

**Key insight:** Micro-compact is designed to be *silent and seamless* from the user's perspective — there is no "context was compacted" banner, because (unlike full compact) nothing was summarized or lost; old tool noise was merely relocated to disk. The render-skip at `394644` is the explicit guarantee of that silence even when an old session carries a boundary marker.

---

## How this relates to the API-native / cached / time-based variants

There are conceptually three micro-compact mechanisms in the lineage, all clearing the *same* compactable tool set with the *same* placeholder string but differing in **who decides** and **where the edit lands**:

1. **API-native (`context-management` strategy):** ships a server-side clearing strategy in the request body (`clear_tool_uses_20250919`) with `trigger.input_tokens` and `clear_at_least.input_tokens`; the *server* clears tool results during inference. Pure server-side, no local message mutation. The `context_hint` beta in v2.1.156 is the spiritual successor — but instead of the client *configuring* a strategy, the server *requests* clearing via a 422/424, and the client does the clearing locally and retries.

2. **Cached MC:** uses the cache-editing API to *delete* tool results without invalidating the cached prefix; does NOT mutate local content, queues `cache_edits` for the API layer; count-based thresholds from GrowthBook; logs `tengu_cached_microcompact`.

3. **Time-based / keep-recent → context_hint (analyzed here):** the time-based predecessor fired on a *time gap* (a long pause since the last assistant turn implied the server cache had expired, so it shrank the prompt before the inevitable re-write). v2.1.156 keeps the same clearing machinery (`Vi6`/`Zk$`/`K04`) and the same `tengu_time_based_microcompact` event name but swaps the trigger to the server-driven `context_hint` reject, adds the `Ti6 = 20000` minimum-savings floor, and adds disk persistence (`q.persist`/`vLz`) so the placeholder can be a recoverable `<persisted-output>` pointer rather than always the bare cleared message.

---

## Cross-validation against v2.1.88

> **Note on v2.1.88 source references:** The v2.1.88 readable TypeScript source **is** available, at `/lyz/codespace/3rd/claude-code/src/services/compact/` (plus `src/utils/messages.ts` and `src/components/Message.tsx`). Every `src/*.ts:line` reference below was **confirmed against that checkout**; every `cli_inner_pretty.js:<line>` citation was verified against the v2.1.156 bundle (`/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`).

**MATCHED (verbatim or near-verbatim against the v2.1.88 readable source):** The clearing-engine internals map 1:1.
- `Vi6` corresponds to the inline body of the time-based micro-compactor (v2.1.88 `microCompact.ts:456-505`): identical `Math.max(1, keepRecent)` floor with the same documented rationale (`slice(-0)`=keep-all, `0`=clear-all), identical `keepSet = slice(-K)` / `clearSet = filter` logic, identical "skip already-cleared" guard.
- `Pg_` corresponds to `collectCompactableToolIds` (v2.1.88 `microCompact.ts:226-241`).
- `Lg_` corresponds to `calculateToolResultTokens` (v2.1.88 `microCompact.ts:138-157`), same image/document = 2000 charge.
- `Gi6` string `'[Old tool result content cleared]'` matches the prior `TIME_BASED_MC_CLEARED_MESSAGE` / `TOOL_RESULT_CLEARED_MESSAGE` constant.
- `Dg_` / `AnH` / `$06` `'<persisted-output>'` tags match the prior `PERSISTED_OUTPUT_TAG` / closing tag.
- `k69 = 5` (keepRecent) matches the prior `TIME_BASED_MC_CONFIG_DEFAULTS.keepRecent`.
- The `Xg_` compactable-tools membership (Read, shell, Grep, Glob, WebSearch, WebFetch, Edit, Write, `cli_inner_pretty.js:447329`) matches the prior `COMPACTABLE_TOOLS`.
- The suppress-compact-warning side-effect (`LEH`, `cli_inner_pretty.js:271340`) matches the prior `suppressCompactWarning`.
- The `microcompact_boundary` render-null matches the prior `Message.tsx` behavior (identical: render nothing).

**DIVERGED — the TRIGGER.** The time-based design was built around a time-gap predicate (`evaluateTimeBasedTrigger`, `gapThresholdMinutes`) and around the cache-editing path; v2.1.156's keep-recent path is instead driven by the reactive `context_hint` controller (no time-gap math survives in the `K04` call chain). The time-based code also did its own inline `message.map` clearing and created no per-ID content map; v2.1.156 factors clearing into a standalone `Zk$` that consumes a `contentById` map populated from disk-persist results — a structural refactor.

**POST-2.1.88 — no v2.1.88 analog (all verified in the v2.1.156 bundle):**
- The entire `context_hint` subsystem: the beta `k76 = KX('context_hint','context-hint-2026-04-09')` (`cli_inner_pretty.js:98137`), the controller `kLz` (`cli_inner_pretty.js:556535`), flags `X69`/`L69` (`cli_inner_pretty.js:556448`/`556451`), error classifiers `P69`/`W69`/`Z69`/`G69` (`cli_inner_pretty.js:556454`/`556457`/`556462`/`556465`), telemetry `V69`/`KS8` (`cli_inner_pretty.js:556475`/`556485`), apply path `y69`/`tKq` (`cli_inner_pretty.js:556503`/`556520`), and the `context_hint_sse` streaming-fallback cause (`cli_inner_pretty.js:557799`).
- The `Ti6 = 20000` minimum-savings floor (`cli_inner_pretty.js:447310`, `447284`, `556547`) — the time-based version had no floor (it fired on any non-zero `tokensSaved`).
- Disk persistence on clear: `vLz` (`cli_inner_pretty.js:556496`) and the `q.persist` callback parameter on `K04`, replacing the cleared content with a recoverable `<persisted-output>` pointer rather than always the bare placeholder. `Wg_` (`cli_inner_pretty.js:447250`) was correspondingly extended to recognize BOTH the placeholder AND a `Dg_` prefix as "already cleared."
- History reconciliation `onHintCleared` (`cli_inner_pretty.js:451442`) plus `q04` (`collectClearedReadFilePaths`, `cli_inner_pretty.js:447238`) Read-cache eviction — no v2.1.88 analog.
- The `microcompact_boundary` **construction** site is gone (only the render-skip at `cli_inner_pretty.js:394644` survives).

**STABLE constants:** the `Gi6` placeholder text, `Ti6`'s placeholder usage, `k69 = 5` keepRecent, and `Jg_ = 2000` (`cli_inner_pretty.js:447311`) image/document token charge all match the time-based design.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compact lives here
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Loop integration
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Telemetry / model context window
> - [symbol_additions_v2_1_156_compact.md](../00_overview/symbol_additions_v2_1_156_compact.md) - This module’s new symbols

Key functions in this document:
- `tokenEstimateOfToolResult` (`Lg_`) — cli_inner_pretty.js:447221 — sums tool_result text tokens; image/document charged Jg_=2000 each
- `collectCompactableToolUseIds` (`Pg_`) — cli_inner_pretty.js:447230 — walks assistant messages, returns tool_use ids whose name ∈ Xg_, in chronological order
- `collectClearedReadFilePaths` (`q04`) — cli_inner_pretty.js:447238 — for cleared Read tool_uses, returns input.file_path[] so caller can evict them from readFileState
- `isAlreadyClearedContent` (`Wg_`) — cli_inner_pretty.js:447250 — true if content === Gi6 placeholder OR startsWith Dg_ '<persisted-output>'; the idempotency predicate
- `computeKeepClearSets` (`Vi6`) — cli_inner_pretty.js:447253 — pure candidate selection: keep last N / clear rest, returns {clearSet, keepSet, tokensSaved, candidates}
- `applyClearingToMessages` (`Zk$`) — cli_inner_pretty.js:447268 — in-place .content substitution with maximal structural sharing and apply-side idempotency
- `applyKeepRecentMicrocompact` (`K04`) — cli_inner_pretty.js:447282 — orchestrator: gates on Ti6, persists candidates, applies Zk$, emits telemetry
- `createContextHintController` (`kLz`) — cli_inner_pretty.js:556535 — per-request controller: buildRequestParams / onRequestError / classifyStreamError / onStreamFallback / strip
- `applyHintEdits` (`y69`) — cli_inner_pretty.js:556503 — runs K04, measures pre/post token estimates, returns cleared maps + mcApplied/mcTokensSaved
- `handleHintReject` (`tKq`) — cli_inner_pretty.js:556520 — calls y69, fires compact_hint_reject + tengu_context_hint_reject telemetry
- `persistToolResult` (`vLz`) — cli_inner_pretty.js:556496 — persist callback: writes content via gwH, returns the <persisted-output> pointer or null on failure
- `writeToolResultToDisk` (`gwH`) — cli_inner_pretty.js:221617 — persists tool_result content to the session tool-results dir; refuses non-text array content
- `isContextHintEnabled` (`X69`) — cli_inner_pretty.js:556448 — reads GrowthBook flag tengu_hazel_osprey (master switch)
- `getContextHintFloor` (`L69`) — cli_inner_pretty.js:556451 — reads tengu_hazel_osprey_floor (default VLz=75000), sent as target_tokens_saved when > 0
- `isContextHintRejectError` (`P69`) — cli_inner_pretty.js:556454 — HTTP 422/424 → run micro-compact + retry
- `isStreamingInvalidRequestError` (`W69`) — cli_inner_pretty.js:556457 — streaming invalid_request_error with no HTTP status → context_hint_sse fallback
- `isConflict409` (`Z69`) — cli_inner_pretty.js:556462 — HTTP 409 → busy fallback (give up hint this attempt)
- `isUnknownBeta400` (`G69`) — cli_inner_pretty.js:556465 — HTTP 400 'Unexpected value … anthropic-beta' → abandon hint, return messages unchanged
- `logContextHintReject` (`V69`) — cli_inner_pretty.js:556475 — emits tengu_context_hint_reject with pre/post token estimates and mcApplied/mcTokensSaved
- `logContextHintBusyFallback` (`KS8`) — cli_inner_pretty.js:556485 — emits tengu_context_hint_busy_fallback {requestId, status} for 400/409/529 paths
- `suppressCompactWarning` (`LEH`) — cli_inner_pretty.js:271340 — sets the global compact-warning-suppressed flag after a successful micro-compact
- `markCacheDeletionsPending` (`Jv7`) — cli_inner_pretty.js:270029 — in cowork mode, marks cache deletions pending for the abort signal

Key constants in this document:
- `CLEARED_PLACEHOLDER` (`Gi6`) — cli_inner_pretty.js:447308 — '[Old tool result content cleared]', the fixed replacement when content is not/cannot be persisted
- `PERSISTED_OUTPUT_TAG` (`Dg_`) — cli_inner_pretty.js:447309 — '<persisted-output>' prefix marking a tool_result spilled to disk
- `MIN_TOKENS_SAVED_TO_FIRE` (`Ti6`) — cli_inner_pretty.js:447310 — 20000, minimum reclaimable tokens before micro-compact fires / beta is advertised (NEW in v2.1.156)
- `IMAGE_MAX_TOKEN_SIZE` (`Jg_`) — cli_inner_pretty.js:447311 — 2000, per-image/document token charge in Lg_
- `COMPACTABLE_TOOLS` (`Xg_`) — cli_inner_pretty.js:447312,447329 — Set([Read, ...shell, Grep, Glob, WebSearch, WebFetch, Edit, Write])
- `DEFAULT_CONTEXT_HINT_FLOOR` (`VLz`) — cli_inner_pretty.js:556488 — 75000, default target_tokens_saved floor advertised to the server
- `KEEP_RECENT` (`k69`) — cli_inner_pretty.js:556578 — 5, number of most-recent compactable tool results to keep
- `CONTEXT_HINT_BETA` (`k76`) — cli_inner_pretty.js:98137 — KX('context_hint','context-hint-2026-04-09'), the negotiation header (NEW in v2.1.156)
- `PERSISTED_OUTPUT_OPEN_TAG` (`AnH`) — cli_inner_pretty.js:221913 — '<persisted-output>' open tag used to build the pointer string in vLz
- `PERSISTED_OUTPUT_CLOSE_TAG` (`$06`) — cli_inner_pretty.js:221914 — '</persisted-output>' closing tag
