# Session-memory & /rewind partial compaction

## Overview

This document covers two related-but-distinct pieces of the compaction subsystem in **v2.1.156**, contrasted against the readable **v2.1.88** TypeScript source:

1. **Session-memory compaction** — an *experiment* present in v2.1.88 (`trySessionMemoryCompaction`, `lastSummarizedMessageId`, `calculateMessagesToKeepIndex`, `shouldUseSessionMemoryCompaction`). It avoided an LLM summarization API call by reusing a background-extracted "session-memory" markdown file as the compaction summary. **Finding: this entire subsystem has been removed by v2.1.156.** No equivalent survives — not under renamed symbols, not as a forked-agent hook, not as feature gates. This was verified exhaustively (see Cross-validation).

2. **/rewind partial compaction** — the `MessageSelector` ("Rewind") menu actions **"Summarize from here"** and **"Summarize up to here"**, distinguished by a `direction` discriminator of `"from"` vs `"up_to"`. **Finding: fully present and structurally identical to the v2.1.142-documented behavior, with symbols renamed.** The partial compactor reuses the same summarization API caller (`_X4`), the same prompt-too-long (PTL) retry slicer (`$X4`/`HX4`), and the same boundary/preserved-segment machinery (`PP$`/`xN6`) as full compaction (`_eH`).

**Where it plugs into the agent loop:** Partial compaction is *user-initiated* from the `/rewind` UI rather than triggered by the token-budget watchdog. The REPL wires `MessageSelector.onSummarize` (`rewindOnSummarize`, cli_inner_pretty.js:630874) to the core compactor `qX4` (cli_inner_pretty.js:423340). The compactor produces a `compact_boundary` system message plus a summary user message, which the REPL splices into the live history; on `--resume`, the resume-side reader (`_l5`/`S5H`, cli_inner_pretty.js:272526-272546) re-inserts the preserved (non-summarized) segment at the boundary anchor. This is the same boundary/preserved-segment persistence used by full and reactive compaction — the unification is the central finding of this document.

---

## Part A — Session-memory compaction: REMOVED in v2.1.156

### A.1 What it did (in v2.1.88)

**What it does:** `trySessionMemoryCompaction` (sessionMemoryCompact.ts:514-630) was an alternative to traditional LLM-based compaction. Instead of making an API call to summarize the conversation, it reused the **session-memory markdown file** — a file that a background forked subagent (`extractSessionMemory`, sessionMemory.ts:272-350) periodically updated with notes about the conversation.

**How it works (v2.1.88):**
1. Gate-check (`shouldUseSessionMemoryCompaction`, sessionMemoryCompact.ts:403-432) on `tengu_session_memory` AND `tengu_sm_compact` GrowthBook flags, plus `ENABLE_/DISABLE_CLAUDE_CODE_SM_COMPACT` env overrides.
2. Read `lastSummarizedMessageId` (the UUID of the last message the background extractor had already folded into the memory file) and the memory-file content.
3. Compute `calculateMessagesToKeepIndex` (sessionMemoryCompact.ts:324-397): start *after* `lastSummarizedMessageId`, expand backwards until hitting `minTokens` (10k) AND `minTextBlockMessages` (5), capped at `maxTokens` (40k), floored at the last compact boundary, then snap via `adjustIndexToPreserveAPIInvariants` (sessionMemoryCompact.ts:232-314) so `tool_use`/`tool_result` pairs and same-`message.id` thinking blocks are never split.
4. Build a `CompactionResult` whose "summary" was the **session-memory file content itself** (truncated via `truncateSessionMemoryForCompact`), with NO compaction API call (`createCompactionResultFromSessionMemory`, sessionMemoryCompact.ts:437-503).

`setLastSummarizedMessageId` (sessionMemory.ts:488-495, via `updateLastSummarizedMessageIdIfSafe`) was written only when the last assistant turn had no pending tool calls, to avoid orphaning `tool_result`s.

**Why this approach (v2.1.88 rationale):** A pre-extracted memory file lets compaction be near-instant and free — no synchronous summarization API call on the critical path. The cost is correctness risk (the file may lag the conversation) and the complexity of a background extractor plus a "safe to advance the watermark" invariant.

### A.2 What it looks like in v2.1.156: nothing

Every load-bearing identifier of this experiment is absent from `cli_inner_pretty.js`:

- `trySessionMemoryCompaction`, `shouldUseSessionMemoryCompaction`, `calculateMessagesToKeepIndex`, `adjustIndexToPreserveAPIInvariants`, `createCompactionResultFromSessionMemory` — **0 matches**.
- `lastSummarizedMessageId` / `setLastSummarizedMessageId` / `getLastSummarizedMessageId` — **0 matches** (grep for `lastSummarized`, `LastSummarized`, `summarizedMessageId` returns nothing).
- Feature gates `tengu_session_memory`, `tengu_sm_compact`, `tengu_sm_compact_config`, and all `tengu_sm_compact_*` / `tengu_session_memory_*` events — **0 matches**.
- Env overrides `ENABLE_CLAUDE_CODE_SM_COMPACT` / `DISABLE_CLAUDE_CODE_SM_COMPACT` — **0 matches**.
- The background extractor `extractSessionMemory`, `buildSessionMemoryUpdatePrompt`, `manuallyExtractSessionMemory` (the `/summary` command), `waitForSessionMemoryExtraction`, `truncateSessionMemoryForCompact` — **0 matches**.
- Config `DEFAULT_SM_COMPACT_CONFIG` (`{minTokens:10000, minTextBlockMessages:5, maxTokens:40000}`) and `DEFAULT_SESSION_MEMORY_CONFIG` — gone.

The only `session_memory` string hits are unrelated infrastructure: gRPC's `"grpc-node.max_session_memory"` channel option (cli_inner_pretty.js:300098, and its read/apply at 312556/312558) and a dropped attachment-type token `"current_session_memory"` in the `normalizeAttachmentForAPI` filter list (cli_inner_pretty.js:445792-445808), where it is matched by `.includes(H.type)` and normalized to `[]` (handled-but-dropped) — NOT an OTel metric. That is, the only `session_memory` string hits are the gRPC `max_session_memory` channel option (3 lines) and the dropped `current_session_memory` attachment-type token — all plumbing, none a session-memory feature. `xZ` is a generic fork runner with several consumers (compaction callers `_X4` forkLabel `compact` and `uc5` forkLabel `reactive-compact`, PLUS the distinct team-memory extractor `extractMemories` at 448293 forkLabel `extract_memories`, and others). None is a session-memory-COMPACTION consumer; the `extract_memories` feature is a separate v2.1.156 team-memory system, not the removed session-memory compaction experiment.

**Why removed (inference):** v2.1.88 marked the file `EXPERIMENT: Session memory compaction` (sessionMemoryCompact.ts:1-3) and gated it behind two dormant GrowthBook flags. The experiment was apparently not promoted; by v2.1.156 the codebase consolidated on a single summarization path (`_X4`) shared by reactive/auto/manual/partial compaction. This is consistent with the broader v2.1.156 refactor where **reactive compaction** (`xA8`/`uc5`, with token-gap-guided group stepping `bv7`/`mc5`) is the sophisticated auto-compaction mechanism — it occupies the cost niche session-memory-compaction targeted, but with a real API summarization call rather than a pre-extracted file. The trade-off was made in favor of correctness (always-fresh summary) and code-surface reduction over the latency/cost savings of a cached memory file.

---

## Part B — /rewind partial compaction (the surviving, active feature)

### B.1 The MessageSelector menu (`L4q`) and the summarize predicate (`X4q`)

**What it does:** `L4q` (cli_inner_pretty.js:572790) is the Rewind menu React component, exported as `MessageSelector` (cli_inner_pretty.js:572785). It builds its action list in the inner `r(JH)` helper (cli_inner_pretty.js:572832-572854):

- `{ value: "summarize", label: "Summarize from here", onChange: g }` (cli_inner_pretty.js:572849) — `g` sets the **forward** context-input state `Q`.
- `{ value: "summarize_up_to", label: "Summarize up to here", onChange: c }` (cli_inner_pretty.js:572850) — `c` sets the **backward** context-input state `l`.

The predicate `X4q(H)` (cli_inner_pretty.js:572787-572789) returns true for either summarize action. It is used both to dispatch (cli_inner_pretty.js:572896) and to suppress the code-diff preview while summarizing (cli_inner_pretty.js:573032, 573171).

```javascript
// ============================================
// isSummarizeAction - Predicate matching either summarize menu value
// Location: cli_inner_pretty.js:572787-572789
// ============================================

// ORIGINAL (for source lookup):
function X4q(H) {
  return H === "summarize" || H === "summarize_up_to";
}

// READABLE (for understanding):
function isSummarizeAction(menuValue) {
  return menuValue === "summarize" || menuValue === "summarize_up_to";
}

// Mapping: X4q->isSummarizeAction, H->menuValue. v2.1.142 equivalent was ed6.
```

### B.2 Direction discrimination in the handler (`$H`)

**What it does:** In the MessageSelector action handler `$H(JH)` (cli_inner_pretty.js:572886), when `X4q(JH)` is true (cli_inner_pretty.js:572896), the handler maps the menu value to a `direction` discriminator and reads the per-direction context input.

**How it works:** The menu value `"summarize_up_to"` maps to direction `"up_to"`; everything else maps to `"from"` (cli_inner_pretty.js:572899). Crucially, **each direction reads its OWN optional user-context input** (`l` = backwardContext for up_to, `Q` = forwardContext for from), because the menu hosts two separate input fields (cli_inner_pretty.js:572900). The selected message `E`, the context text `vH`, and the direction `WH` are passed to the `onSummarize` callback `_` (cli_inner_pretty.js:572901).

**Why this approach:** Threading a single `direction` string (rather than two separate callbacks) keeps the bridge to the core compactor flat — `onSummarize(message, context, direction)` is one signature for both UX paths, and the compactor itself branches internally. The dual input fields exist because the user's "additional instructions" mean different things forward vs backward (e.g., "keep the API design notes" vs "focus on the bug we just fixed").

**Key insight:** The description text under each option is `BZz` (cli_inner_pretty.js:573144-573157). The `"summarize_up_to"` case (cli_inner_pretty.js:573148-573149) reads, in effect: *"Preceding messages will be summarized. This and subsequent messages will remain unchanged — you will stay at the end of the conversation."* This is deliberate UX: `up_to` does NOT move the cursor; the user keeps forward progress. The `"summarize"` (from) case (cli_inner_pretty.js:573147) reads: *"Messages after this point will be summarized."* — i.e., a rewind-and-retry.

```javascript
// ============================================
// handleRewindAction (summarize branch) - Maps menu value to direction, reads per-direction context, calls onSummarize
// Location: cli_inner_pretty.js:572896-572910
// ============================================

// ORIGINAL (for source lookup):
if (X4q(JH)) {
  ($(), b(!0), R(JH), O(void 0));
  try {
    let WH = JH === "summarize_up_to" ? "up_to" : "from",
      vH = (WH === "up_to" ? l : Q).trim() || void 0;
    (await _(E, vH, WH), b(!1), R(null), S(void 0), z());
  } catch (WH) {
    if (!(WH instanceof PzH)) hH(WH);
    (b(!1), R(null), S(void 0), O(`Failed to summarize:\n${WH}`));
  }
  return;
}

// READABLE (for understanding):
if (isSummarizeAction(actionValue)) {
  onPreRestore(); setBusy(true); setSummarizeKind(actionValue); setError(undefined);
  try {
    const direction = actionValue === "summarize_up_to" ? "up_to" : "from";
    // each direction reads its OWN optional context input: backwardContext (l) vs forwardContext (Q)
    const contextText = (direction === "up_to" ? backwardContext : forwardContext).trim() || undefined;
    await onSummarize(selectedMessage, contextText, direction);
    setBusy(false); setSummarizeKind(null); setSelectedMessage(undefined); onClose();
  } catch (e) {
    if (!(e instanceof PreCompactBlockedError)) reportError(e);
    setBusy(false); setSummarizeKind(null); setSelectedMessage(undefined);
    setError(`Failed to summarize:\n${e}`);
  }
  return;
}

// Mapping: $H->handleRewindAction, JH->actionValue, WH->direction, vH->contextText, l->backwardContext, Q->forwardContext, _->onSummarize, E->selectedMessage, $->onPreRestore, b->setBusy, R->setSummarizeKind, S->setSelectedMessage, O->setError, z->onClose, PzH->PreCompactBlockedError, hH->reportError
```

### B.3 The onSummarize bridge (`rewindOnSummarize`)

**What it does:** The callback wired into `L4q.onSummarize` is `async (Z$, $8, G8 = "from") => {...}` (cli_inner_pretty.js:630874), where `Z$`=selectedMessage, `$8`=userContext, `G8`=direction. It locates the selected message in the live history, assembles a compaction context, invokes the core compactor, then splices the result into the chat by direction.

**How it works:**
1. Find the message index in the *live* filtered history (`Mq = nf(V1)`, `Eq = Mq.indexOf(Z$)`, cli_inner_pretty.js:630875-630876). `nf` slices from the last compact boundary (cli_inner_pretty.js:446021-446024). If `Eq === -1`, it warns *"That message is no longer in the active context. Choose a more recent message."* and bails (cli_inner_pretty.js:630877-630883).
2. Build a fresh `toolUseContext` (`fK = jG(...)`), resolve tools, system prompt, user context (CLAUDE.md), and system context (git status) (cli_inner_pretty.js:630884-630900).
3. Call `qX4(Mq, Eq, fK, {systemPrompt, userContext, systemContext, toolUseContext, forkContextMessages: Mq}, $8, G8, ...)` (cli_inner_pretty.js:630901-630916) — `$8` is the customInstructions/userContext, `G8` is the direction.
4. **Splice the result by direction** (cli_inner_pretty.js:630918): the summary always lands where the summarized portion was — at the FRONT for `up_to` (summary replaces the head), at the BACK for `from` (summary replaces the tail). Final assembled list is `Rf = [boundaryMarker, ...FJ, ...attachments, ...hookResults]` (cli_inner_pretty.js:630919).
5. **History rewrite differs by direction** (cli_inner_pretty.js:630920-630925): for interactive `"from"`, it splices `Rf` in at the selected message's uuid; for `"up_to"` (or non-interactive) it replaces the ENTIRE history. For `"from"` it then re-primes the input box with the selected user message's text (cli_inner_pretty.js:630930-630934), because "from" is conceptually a rewind-and-retry. For "up_to" the cursor stays at the end.

**Why this approach:** "Replace whole history" is correct for `up_to` because the summary becomes the new conversational *prefix* — there is no meaningful position to splice at; the whole list is `[summary, ...keptTail]`. "Splice at selected uuid" is correct for `from` because the user is rewinding to that message: everything before it is kept verbatim, and the summary plus a re-primed prompt let them retry from that point.

```javascript
// ============================================
// rewindOnSummarize (directional splice) - Splice partial-compaction result into chat history by direction
// Location: cli_inner_pretty.js:630917-630925
// ============================================

// ORIGINAL (for source lookup):
DM = $1.messagesToKeep,
  FJ = G8 === "up_to" ? [...$1.summaryMessages, ...DM] : [...DM, ...$1.summaryMessages],
  Rf = [$1.boundaryMarker, ...FJ, ...$1.attachments, ...$1.hookResults];
if (AK() && G8 === "from")
  E9((rX) => {
    let oF = rX.findIndex((G2H) => G2H.uuid === Z$.uuid);
    return [...rX.slice(0, oF === -1 ? 0 : oF), ...Rf];
  });
else E9(Rf);

// READABLE (for understanding):
const keep = partialResult.messagesToKeep;
// up_to: summary FIRST then kept tail; from: kept head FIRST then summary
const body = direction === "up_to" ? [...partialResult.summaryMessages, ...keep] : [...keep, ...partialResult.summaryMessages];
const finalMessages = [partialResult.boundaryMarker, ...body, ...partialResult.attachments, ...partialResult.hookResults];
if (isInteractive() && direction === "from")
  setMessages(prev => {                         // from: splice in at selected uuid (rewind point)
    const idx = prev.findIndex(m => m.uuid === selectedMessage.uuid);
    return [...prev.slice(0, idx === -1 ? 0 : idx), ...finalMessages];
  });
else setMessages(finalMessages);                // up_to / non-interactive: replace whole history

// Mapping: $1->partialResult, DM->keep, FJ->body, Rf->finalMessages, G8->direction, Z$->selectedMessage, E9->setMessages, AK->isInteractive, oF->idx. v2.1.142 names: W1/t5/NM/_T/d4/lq/j8/j$.
```

### B.4 The core partial compactor (`qX4`)

`qX4(H, $, q, K, _, z = "from", A, Y)` (cli_inner_pretty.js:423340) — `H`=messages, `$`=selectedIndex, `q`=context, `K`=cacheSafeParams, `_`=userContext, `z`=direction, `A`=errorSink, `Y`=onResponseLength.

#### Direction-aware partial-compaction slice (`qX4`)

**What it does:** Splits the conversation into a *to-summarize* set and a *to-keep* set around the selected message index, with the partition flipping based on the `up_to`/`from` discriminator, then runs the shared LLM summarization pipeline only on the to-summarize set (`up_to`) or the full conversation (`from`).

**How it works:**
1. Compute selected index `$` (passed in from the menu's `indexOf`).
2. Slice (cli_inner_pretty.js:423346-423350):
   - `"up_to"`: summarize `w = H.slice(0, $)` (the head, before the selected message); keep `D = H.slice($)` (the tail, including the selected message and everything after). The kept tail is additionally filtered to drop progress markers, compact boundaries (`PJ`), and prior compact-summary user messages — those would be redundant once a new summary precedes them.
   - `"from"`: summarize `w = H.slice($)` (the tail, from the selected message onward); keep `D = H.slice(0, $)` (the head, before it), filtered only for progress markers.
3. If `w` is empty, throw a direction-specific *"Nothing to summarize before/after the selected message."* error.
4. Choose the summarizer input `G` (cli_inner_pretty.js:423376-423377):
   - `"up_to"`: only the head `w` is sent (the tail is excluded — no point summarizing what you keep verbatim), with `cacheSafeParams.forkContextMessages = w`.
   - `"from"`: the **entire** conversation `H` is sent, so the summarizer sees the kept head as context for summarizing the tail. This matches the v2.1.142-documented baseline.
5. Build the prompt via `Cv7(L, z)` (cli_inner_pretty.js:423373) — direction-aware (see B.5).
6. Loop calling `_X4` (the shared compaction API caller); on the PTL sentinel `Rd`, slice with `$X4` up to `HX4 = 3` times.
7. Compute the directional anchor uuid (cli_inner_pretty.js:423459) and build the boundary `PP$` wrapped by `xN6` with the preserved segment (see B.6).

**Why this approach:** A single function with a direction flag is used instead of two functions because >90% of the logic (summarize call, PTL retry, boundary creation, attachments, hooks) is identical; only the slice points, the keep-filter, the summarizer-input scope, the prompt body, and the anchor uuid differ. The `up_to` path excludes the kept tail from the summarizer input as a token-economy optimization (no point paying to summarize text you keep verbatim), whereas `from` feeds the whole conversation so the model has the context that precedes the to-be-summarized tail.

**Key insight:** The asymmetry in the *keep* filter (`up_to` drops boundaries + old compact-summaries from the kept tail; `from` only drops progress markers) is the one subtle directional difference beyond the slice points. It exists because the `up_to` summary becomes a new prefix that *supersedes* any earlier compaction artifacts in the tail, so they must be stripped to avoid stacking redundant summaries.

```javascript
// ============================================
// partialCompact (directional slice + summarizer input) - Split around selected index per up_to/from
// Location: cli_inner_pretty.js:423340-423377
// ============================================

// ORIGINAL (for source lookup):
async function qX4(H, $, q, K, _, z = "from", A, Y) {
  // ...
    let w = z === "up_to" ? H.slice(0, $) : H.slice($),
      D =
        z === "up_to"
          ? H.slice($).filter((zH) => zH.type !== "progress" && !PJ(zH) && !(zH.type === "user" && zH.isCompactSummary))
          : H.slice(0, $).filter((zH) => zH.type !== "progress");
    if (w.length === 0)
      throw Error(z === "up_to" ? "Nothing to summarize before the selected message." : "Nothing to summarize after the selected message.");
    // ...
    let P = Cv7(L, z),
      Z = T8({ content: P }),
      W = { preCompactTokenCount: J, direction: z, messagesSummarized: w.length },
      G = z === "up_to" ? w : H,
      V = z === "up_to" ? { ...K, forkContextMessages: w } : K,

// READABLE (for understanding):
async function partialCompact(messages, selectedIndex, context, cacheSafeParams, userContext, direction = "from", errorSink, onResponseLength) {
  // ...
    const toSummarize = direction === "up_to" ? messages.slice(0, selectedIndex) : messages.slice(selectedIndex);
    const toKeep =
      direction === "up_to"
        ? messages.slice(selectedIndex).filter(m => m.type !== "progress" && !isCompactBoundary(m) && !(m.type === "user" && m.isCompactSummary))
        : messages.slice(0, selectedIndex).filter(m => m.type !== "progress");
    if (toSummarize.length === 0)
      throw Error(direction === "up_to" ? "Nothing to summarize before the selected message." : "Nothing to summarize after the selected message.");
    // ...
    const prompt = buildPartialSummaryPrompt(mergedInstructions, direction);   // Cv7
    const summaryRequest = makeUserMessage({ content: prompt });
    const eventBase = { preCompactTokenCount, direction, messagesSummarized: toSummarize.length };
    const summarizerInput = direction === "up_to" ? toSummarize : messages;      // up_to: only head; from: whole convo
    let csp = direction === "up_to" ? { ...cacheSafeParams, forkContextMessages: toSummarize } : cacheSafeParams;

// Mapping: qX4->partialCompact, H->messages, $->selectedIndex, q->context, K->cacheSafeParams, _->userContext, z->direction, w->toSummarize, D->toKeep, PJ->isCompactBoundary, Cv7->buildPartialSummaryPrompt, G->summarizerInput, V->csp. v2.1.142 name was _H4.
```

### B.5 The direction-aware prompt (`Cv7`)

**What it does:** `Cv7(H, $)` (cli_inner_pretty.js:270824) builds the partial-compaction summarization prompt, with two distinct bodies keyed on direction.

**How it works:**
- `"up_to"` (cli_inner_pretty.js:270835): *"...This summary will be placed at the start of a continuing session; newer messages that build on this context will follow after your summary..."* — i.e., it tells the model the summary is a **prefix**.
- `"from"` (cli_inner_pretty.js:270909, body `bc5` at cli_inner_pretty.js:271074-271149): *"...summary of the RECENT portion... The earlier messages are being kept intact and do NOT need to be summarized..."* — i.e., it tells the model the kept head is the prefix and to summarize only the recent tail.

Both append optional user `Additional Instructions` (cli_inner_pretty.js:270910-270914) and a tool-rejection reminder `Iv7` (cli_inner_pretty.js:271150-271154). The user's `customInstructions` (the `userContext` arg `_`) is merged with any PreCompact-hook `newCustomInstructions` (cli_inner_pretty.js:423364-423369) before being threaded into `Cv7`'s "Additional Instructions" slot.

**Why this approach:** The model's summarization quality depends on knowing *where the summary will sit*. For `up_to`, the summary is the new opening of the conversation, so it must be self-contained and forward-looking. For `from`, the model is told the earlier context is intact, so it can reference it instead of re-stating it, producing a tighter, retry-oriented summary. Splitting the prompt by direction is the lowest-cost way to communicate this placement intent.

**Key insight:** This is the prompt-level counterpart to the slice-level asymmetry in B.4 — the *placement* of the summary (prefix vs suffix) is encoded three times in agreement: in the prompt text (`Cv7`), in the in-memory splice order (`rewindOnSummarize`), and in the on-disk boundary anchor (B.6). All three derive from the same `direction` flag.

### B.6 Boundary + directional anchor (`qX4` tail), and resume reinsertion (`_l5`/`S5H`)

#### Preserved-segment anchor reinsertion (`PP$`/`xN6` write, `_l5`/`S5H` read)

**What it does:** Records which messages were kept (not summarized) and where they belong relative to the compact boundary, so that on session resume the kept head/tail is spliced back at the correct position instead of being lost or duplicated.

**How it works (write side, in `qX4`):**
- Compute the anchor uuid directionally (cli_inner_pretty.js:423459): for `"up_to"` the anchor is the last non-progress message *before* `$` (`H.slice(0,$).findLast(...)`); for `"from"` it is the last kept message (`D.at(-1)`).
- Create the boundary marker `r = PP$("manual", J ?? 0, c, _, w.length)` (cli_inner_pretty.js:423460) — the `compact_boundary` system message with `compactMetadata`.
- Wrap it with the preserved segment via `xN6(r, DH, D, H)` (cli_inner_pretty.js:423485), attaching `preservedSegment{headUuid, anchorUuid, tailUuid}` and `preservedMessages{anchorUuid, uuids, allUuids}`.
- The summary message carries `summarizeMetadata: {messagesSummarized, userContext, direction}` (cli_inner_pretty.js:423471) when there are kept messages.
- The boundary's return-uuid `DH` is also directional (cli_inner_pretty.js:423481): for `"up_to"` it is the summary's uuid (so resume re-anchors on the summary), for `"from"` it is the boundary uuid.

**How it works (read side, on `--resume`):** `S5H` (cli_inner_pretty.js:272535) detects a compact boundary (`PJ`), reads its preserved segment via `_l5` (cli_inner_pretty.js:272526-272534), removes the preserved messages from their loaded positions, and re-pushes them at the boundary whose `uuid === anchorUuid` (cli_inner_pretty.js:272541, 272544).

**Why this approach:** Storing uuids (not positions) survives the reordering and pruning that happen during transcript load. Splitting `headUuid`/`tailUuid` lets the loader's tail-to-head walk know the span boundaries. Choosing the anchor directionally is what encodes "summary-then-tail" (`up_to`) vs "head-then-summary" (`from`) durably.

**Key insight:** This is the persistence counterpart to the in-memory splice in `rewindOnSummarize` (B.3): the in-memory ordering (summary-first for `up_to`) and the on-disk anchor must agree, or a resume would silently reorder the conversation. Both are derived from the same `direction` flag in `qX4`. This is what makes the UX promise "you stay at the end of the conversation" durable across a resume.

```javascript
// ============================================
// partialCompact (boundary + directional anchor) - Choose anchor uuid by direction, attach preserved segment
// Location: cli_inner_pretty.js:423459-423485
// ============================================

// ORIGINAL (for source lookup):
let c = z === "up_to" ? H.slice(0, $).findLast((zH) => zH.type !== "progress")?.uuid : D.at(-1)?.uuid,
      r = PP$("manual", J ?? 0, c, _, w.length),
      a = P8H(H);
    // ...
    let DH = z === "up_to" ? (HH.at(-1)?.uuid ?? r.uuid) : r.uuid;
    return (SH("compact_partial"), { boundaryMarker: xN6(r, DH, D, H), summaryMessages: HH, messagesToKeep: D, /* ... */ });

// READABLE (for understanding):
const anchorUuid = direction === "up_to"
      ? messages.slice(0, selectedIndex).findLast(m => m.type !== "progress")?.uuid   // last msg BEFORE the cut
      : toKeep.at(-1)?.uuid;                                                          // last KEPT msg
    const boundary = createCompactBoundary("manual", preCompactTokenCount ?? 0, anchorUuid, userContext, toSummarize.length);  // PP$
    const discoveredTools = collectDiscoveredTools(messages);  // P8H
    // ...
    const returnUuid = direction === "up_to" ? (summaryMessages.at(-1)?.uuid ?? boundary.uuid) : boundary.uuid;
    return { boundaryMarker: annotateBoundaryWithPreservedSegment(boundary, returnUuid, toKeep, messages), summaryMessages, messagesToKeep: toKeep, /* ... */ };

// Mapping: c->anchorUuid, r->boundary, PP$->createCompactBoundary, P8H->collectDiscoveredTools, HH->summaryMessages, DH->returnUuid, xN6->annotateBoundaryWithPreservedSegment, D->toKeep
```

### B.7 The summarization call + PTL retry loop

`qX4` calls `_X4` (the shared compaction API caller) in a `for(;;)` loop (cli_inner_pretty.js:423381-423412). If the response text starts with the prompt-too-long sentinel `Rd`, it slices the input via `$X4(G, v)` (the shared retry slicer) up to `HX4 = 3` times (cli_inner_pretty.js:423397, 423806), dropping roughly the earliest 20% of message groups (or a token-gap-guided amount) and logging `tengu_compact_ptl_retry` with `path: "partial"` (cli_inner_pretty.js:423404-423409). On exhaustion it throws with `z08` (*"Conversation too long. Press esc twice…"*) and logs `tengu_partial_compact_failed` `reason: "prompt_too_long"` (cli_inner_pretty.js:423400-423402). On success, telemetry `tengu_partial_compact` (cli_inner_pretty.js:423445-423458) carries `direction`, `trigger: "message_selector"`, `messagesKept`, `messagesSummarized`, and compaction token usage.

#### Shared prompt-too-long retry slicer (`$X4` + `HX4`)

**What it does:** When the summarization request itself exceeds the model context window, drops the earliest portion of the conversation being summarized and retries, up to 3 attempts — shared **identically** by full compaction (`_eH`) and partial compaction (`qX4`).

**How it works:**
1. Strip any prior `[earlier conversation truncated…]` meta marker (`aJ4`) from the front, so retries don't stack markers.
2. Group messages into assistant-turn groups via `riH`.
3. If a parseable token gap exists (`ucH` on the response), drop groups from the front until their cumulative token estimate (`sT`) meets the gap; otherwise drop the first ~20% of groups (`Math.floor(K.length * 0.2)`).
4. Clamp the drop count to `length - 1` (always keep at least one group).
5. Flatten remaining groups; if the new first message is an assistant message, prepend a synthetic `[earlier conversation truncated for compaction retry]` user-meta marker so the API doesn't start mid-turn.

**Why this approach:** Token-gap-guided dropping (when the API reports how far over the limit it was) converges faster than blind fixed-fraction dropping, but the 20% fallback guarantees forward progress when no gap is reported. Capping at `HX4 = 3` retries bounds worst-case latency; beyond that the user is told to manually go back a few messages (`z08`).

**Key insight:** `qX4` reuses the exact same slicer and retry cap as the full compactor `_eH` (both call `$X4` with the `C/S <= HX4` guard at cli_inner_pretty.js:423178 and 423397), so partial compaction inherits all of full compaction's robustness for free — a strong signal the two paths were intentionally unified, and the conceptual successor to the removed session-memory path's bespoke index math.

```javascript
// ============================================
// sliceForPromptTooLong - Drop earliest assistant-turn groups when the summarize request overflows context
// Location: cli_inner_pretty.js:423077-423092
// ============================================

// ORIGINAL (for source lookup):
function $X4(H, $) {
  let q = H[0]?.type === "user" && H[0].isMeta && H[0].message.content === aJ4 ? H.slice(1) : H,
    K = riH(q);
  if (K.length < 2) return null;
  let _ = ucH($), z;
  if (_ !== void 0) {
    let Y = 0; z = 0;
    for (let f of K) if (((Y += sT(f)), z++, Y >= _)) break;
  } else z = Math.max(1, Math.floor(K.length * 0.2));
  if (((z = Math.min(z, K.length - 1)), z < 1)) return null;
  let A = K.slice(z).flat();
  if (A[0]?.type === "assistant") return [T8({ content: aJ4, isMeta: !0 }), ...A];
  return A;
}

// READABLE (for understanding):
function sliceForPromptTooLong(messages, apiResponse) {
  // strip prior truncation marker so we don't stack them
  const base = (messages[0]?.type === "user" && messages[0].isMeta && messages[0].message.content === TRUNCATION_MARKER) ? messages.slice(1) : messages;
  const groups = groupByAssistantTurn(base);             // riH
  if (groups.length < 2) return null;
  const tokenGap = parseTokenGap(apiResponse);           // ucH
  let dropGroups;
  if (tokenGap !== undefined) {                          // gap-guided: drop until cumulative tokens >= gap
    let acc = 0; dropGroups = 0;
    for (const g of groups) { acc += estimateTokens(g); dropGroups++; if (acc >= tokenGap) break; }
  } else dropGroups = Math.max(1, Math.floor(groups.length * 0.2));  // fallback: drop first 20%
  dropGroups = Math.min(dropGroups, groups.length - 1);  // always keep >=1 group
  if (dropGroups < 1) return null;
  const remaining = groups.slice(dropGroups).flat();
  if (remaining[0]?.type === "assistant")               // don't start mid-turn
    return [makeUserMessage({ content: TRUNCATION_MARKER, isMeta: true }), ...remaining];
  return remaining;
}

// Mapping: $X4->sliceForPromptTooLong, H->messages, $->apiResponse, aJ4->TRUNCATION_MARKER ('[earlier conversation truncated for compaction retry]'), riH->groupByAssistantTurn, ucH->parseTokenGap, sT->estimateTokens, HX4->MAX_PTL_RETRIES(=3)
```

---

## Worked examples

### up_to

Timeline `M0 M1 M2 [M3] M4 M5`, user selects M3, chooses "Summarize up to here":
- `$` = index of M3. `w = H.slice(0,$)` = `[M0,M1,M2]` (summarized). `D = H.slice($)` filtered = `[M3,M4,M5]` (kept verbatim).
- Summarizer sees only `[M0,M1,M2]` with the `up_to` prompt ("summary goes at the start").
- Result body = `[summary, M3, M4, M5]`; history fully replaced. Cursor stays at M5. Boundary anchor = M2's uuid; on resume the kept tail re-attaches after the summary.

### from

Same timeline, "Summarize from here" at M3:
- `w = H.slice($)` = `[M3,M4,M5]` (summarized). `D = H.slice(0,$)` = `[M0,M1,M2]` (kept).
- Summarizer sees the FULL `[M0..M5]` with the `from` prompt ("summarize the recent portion, earlier kept intact").
- Result body = `[M0, M1, M2, summary]`; spliced in at M3's uuid (interactive). Input box re-primed with M3's text. This is rewind-and-retry.

---

## Cross-validation against v2.1.88

### Matched (v2.1.88 readable concepts still present in the v2.1.156 partial path)

- **Turn-boundary invariant.** The "preserve `tool_use`/`tool_result` pairs and same-`message.id` thinking blocks" invariant from v2.1.88 `adjustIndexToPreserveAPIInvariants` (sessionMemoryCompact.ts:232-314) survives in spirit: `qX4`'s kept-set filtering plus the `riH` assistant-turn grouping (used by `$X4`) preserve turn boundaries, and the PTL slicer refuses to start a slice on an assistant message (prepends the `aJ4` marker, cli_inner_pretty.js:423090). Same goal, different code.
- **Boundary / preserved-segment pattern.** v2.1.88 `annotateBoundaryWithPreservedSegment` maps to v2.1.156 `xN6` (cli_inner_pretty.js:423110-423122), and the `createCompactBoundaryMessage` shape (trigger, preTokens, anchor) maps to `PP$` (cli_inner_pretty.js:445985-445997).
- **Summary message shape.** `createUserMessage{isCompactSummary, isVisibleInTranscriptOnly}` from v2.1.88 (sessionMemoryCompact.ts:477-481) matches `T8({content, isCompactSummary:true, isVisibleInTranscriptOnly:true})` in `qX4` (cli_inner_pretty.js:423469-423472) and `uc5` (cli_inner_pretty.js:271217).

### Removed (no v2.1.156 survivor)

The entire session-memory compaction experiment is gone (Part A). Removed identifiers, all **0 matches** in `cli_inner_pretty.js`:
- `trySessionMemoryCompaction`, `shouldUseSessionMemoryCompaction`, `calculateMessagesToKeepIndex`, `adjustIndexToPreserveAPIInvariants`, `createCompactionResultFromSessionMemory`.
- State: `lastSummarizedMessageId` / `getLastSummarizedMessageId` / `setLastSummarizedMessageId`.
- Extractor: `extractSessionMemory`, `shouldExtractMemory`, `manuallyExtractSessionMemory` (`/summary`), `initSessionMemory`, `buildSessionMemoryUpdatePrompt`, `waitForSessionMemoryExtraction`, `truncateSessionMemoryForCompact`, `isSessionMemoryEmpty`.
- Config: `DEFAULT_SM_COMPACT_CONFIG {minTokens:10000, minTextBlockMessages:5, maxTokens:40000}`, `DEFAULT_SESSION_MEMORY_CONFIG`.
- Gates: `tengu_session_memory`, `tengu_sm_compact`, `tengu_sm_compact_config` / `tengu_sm_config`.
- Env: `ENABLE_CLAUDE_CODE_SM_COMPACT` / `DISABLE_CLAUDE_CODE_SM_COMPACT`.
- Telemetry: `tengu_sm_compact_*` (`_no_session_memory`, `_empty_template`, `_summarized_id_not_found`, `_resumed_session`, `_threshold_exceeded`, `_error`, `_flag_check`), `tengu_session_memory_*` (`_extraction`, `_manual_extraction`, `_init`, `_gate_disabled`, `_file_read`).

### Diverged

- **The "uc5/xA8 feeds the partial path" hint is INACCURATE for v2.1.156.** `uc5` (cli_inner_pretty.js:271156) is the REACTIVE/auto-compaction summarization call (forkLabel `reactive-compact`), and `xA8` (cli_inner_pretty.js:271231) is the reactive group-step loop — its stepping helper `mc5` begins at 271227, which `xA8` consumes at 271314 (`mc5(L.tokenGap, M, w)`). Neither takes a `direction` parameter. The actual partial path is `qX4 -> _X4` (API) with `Cv7(prompt, direction)`. `customInstructions` in the partial path flow as the `userContext` arg `_` into `Cv7`'s "Additional Instructions" (cli_inner_pretty.js:270910-270914), merged with PreCompact-hook `newCustomInstructions` at cli_inner_pretty.js:423364-423369. Confirmed directly rather than trusting the hint.

### Post-2.1.88 (no v2.1.88 counterpart)

- **Reactive token-gap-guided compaction** (`bv7`/`mc5`/`xA8`, `tengu_reactive_compact_attempt`) — entirely post-2.1.88. This is the sophisticated auto-compaction path that occupies the niche session-memory-compaction targeted.
- **Shared PTL machinery unification.** `$X4` (slicer) + `HX4 = 3` (cap) + `aJ4` truncation marker + `z08` user message are now shared verbatim between full compaction `_eH` and partial `qX4` (both at the `C/S <= HX4` guard, cli_inner_pretty.js:423178 and 423397). This unification is post-2.1.88.
- **Richer preserved-segment.** `xN6` now writes BOTH `preservedSegment{headUuid,anchorUuid,tailUuid}` AND `preservedMessages{anchorUuid,uuids,allUuids}`; the resume reader is split into `_l5` + `S5H` with anchor-matched reinsertion. v2.1.88's `annotateBoundaryWithPreservedSegment` existed, but the dual-field + resume-splicer form here is the evolved shape.
- **`_X4` cache-prefix sharing fast path** (`tengu_compact_cache_sharing_success`/`_fallback`, cli_inner_pretty.js:423560-423609) — post-2.1.88.
- **The `up_to` direction.** v2.1.88 `sessionMemoryCompact.ts` has no `/rewind` partial-compaction UI at all; per the v2.1.142 doc, `up_to` was added in v2.1.141, after the v2.1.88 baseline. So the `up_to` vs `from` discriminator is wholly post-2.1.88 relative to the provided cross-validation source.
- **`qX4` signature growth.** The single direction-aware partial compactor (was `_H4` in v2.1.112/142) now accepts 8 params `(H,$,q,K,_,z,A,Y)` with an explicit `errorSink` (`A`, via `KX4`) and `onResponseLength` (`Y`) channel the v2.1.88 tree did not surface.
- **Renames from v2.1.142:** `_H4`→`qX4`, `ed6`→`X4q`, `Hc6`→`L4q`, `lF5`→`BZz`, `jM$`→`PP$`, `qH`(handler)→`$H`.

### Not confirmable

No renamed survivor of session-memory compaction could be found. Searched `session_memory` / `SessionMemory` / `sessionMemory` / `SM_COMPACT` / `sm_compact` / `lastSummarized` / `summarizedMessageId` — only unrelated gRPC `max_session_memory` and a dropped attachment-type token `current_session_memory` in the `normalizeAttachmentForAPI` filter list (cli_inner_pretty.js:445792-445808), where it is matched by `.includes(H.type)` and normalized to `[]` (handled-but-dropped) — NOT an OTel metric — hits appeared. The subsystem is **removed, not merely renamed**.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compact lives here
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Loop integration
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Telemetry / model context window
> - [symbol_additions_v2_1_156_compact.md](../00_overview/symbol_additions_v2_1_156_compact.md) - This module's new symbols

Key functions in this document:

- `isSummarizeAction` (`X4q`) — cli_inner_pretty.js:572787-572789 — predicate returning true for menu value `summarize` or `summarize_up_to`; v2.1.142: `ed6`.
- `MessageSelector` (`L4q`) — cli_inner_pretty.js:572790-573143 — the `/rewind` menu React component hosting the summarize-from/up_to actions; v2.1.142: `Hc6`.
- `handleRewindAction` (`$H`, inner) — cli_inner_pretty.js:572886-572938 — maps menu value to direction (`up_to` vs `from`), reads per-direction context input, calls `onSummarize`; v2.1.142: `qH`.
- `summarizeOptionDescription` (`BZz`) — cli_inner_pretty.js:573144-573157 — per-action status text; the `summarize_up_to` case explains the cursor stays at the end; v2.1.142: `lF5`.
- `selectableUserMessagesFilter` (`wq$`) — cli_inner_pretty.js:573398-573416 — filters user messages eligible for rewind selection.
- `messagesAfterAreOnlySynthetic` (`P4q`) — cli_inner_pretty.js:573417-573437 — true if every message after an index is synthetic/meta/non-substantive.
- `partialCompact` (`qX4`) — cli_inner_pretty.js:423340-423509 — direction-aware partial compactor for `/rewind` summarize; v2.1.142: `_H4`.
- `rewindOnSummarize` (`onSummarize`, inline) — cli_inner_pretty.js:630874-630942 — REPL callback wired to `MessageSelector.onSummarize`; builds context, calls `qX4`, splices result by direction, re-primes input for `from`.
- `buildPartialSummaryPrompt` (`Cv7`) — cli_inner_pretty.js:270824-270916 — direction-keyed partial-compaction prompt builder.
- `PARTIAL_FROM_SUMMARY_PROMPT` (`bc5`) — cli_inner_pretty.js:271074-271149 — the `from`-direction prompt body (summarize only the recent portion).
- `NO_TOOLS_REMINDER` (`Iv7`) — cli_inner_pretty.js:271150-271154 — trailing reminder forbidding tool calls in the partial-summary prompt.
- `buildFullSummaryPrompt` (`bA8`) — cli_inner_pretty.js:270917 — full-conversation summarization prompt used by full compaction (`_eH`) and reactive compact (`uc5`).
- `runCompactionSummarization` (`_X4`) — cli_inner_pretty.js:423539 — shared compaction summarization API caller (cache-prefix path + streaming fallback); used by both `_eH` and `qX4`.
- `sliceForPromptTooLong` (`$X4`) — cli_inner_pretty.js:423077-423092 — PTL retry slicer; drops earliest assistant-turn groups; shared by `_eH` and `qX4`.
- `MAX_PTL_RETRIES` (`HX4`) — cli_inner_pretty.js:423806 — max prompt-too-long retry attempts = 3, used by both compaction paths.
- `TRUNCATION_RETRY_MARKER` (`aJ4`) — cli_inner_pretty.js:423807 — `[earlier conversation truncated for compaction retry]` synthetic user-meta marker text.
- `CONVERSATION_TOO_LONG_MSG` (`z08`) — cli_inner_pretty.js:423808 — user-facing error when PTL retries are exhausted.
- `runCompaction` (`_eH`) — cli_inner_pretty.js:423130 — full compaction entry point (auto/manual); shares `_X4`, `$X4`/`HX4`, `bA8` with partial compaction.
- `createCompactBoundaryMessage` (`PP$`) — cli_inner_pretty.js:445985-445997 — creates the `compact_boundary` system message with `compactMetadata`; v2.1.142: `jM$`.
- `annotateBoundaryWithPreservedSegment` (`xN6`) — cli_inner_pretty.js:423110-423122 — attaches `preservedSegment` and `preservedMessages` to a boundary marker.
- `isCompactBoundaryMessage` (`PJ`) — cli_inner_pretty.js:446011-446013 — true for system/compact_boundary messages.
- `sliceFromLastCompactBoundary` (`nf`) — cli_inner_pretty.js:446021-446024 — returns messages from the last compact boundary onward (active context window).
- `resolvePreservedSegment` (`_l5`) — cli_inner_pretty.js:272526-272534 — on resume, resolves a boundary's preserved-message uuids back to live objects + anchorUuid.
- `reinsertPreservedSegmentAtAnchor` (`S5H`) — cli_inner_pretty.js:272535-272546 — on resume, removes preserved messages and re-pushes them at the anchor-matched boundary.
- `groupByAssistantTurn` (`riH`) — cli_inner_pretty.js:270812-270823 — groups messages into assistant-turn-delimited groups (by `message.id`); used by the PTL slicer and reactive-compact stepping.
- `runReactiveCompactSummarization` (`uc5`) — cli_inner_pretty.js:271156-271219 — reactive (auto) compaction summarization call; NOT the partial path. The brief's "uc5 partial path" hint was approximate — the partial path's API call is `_X4`.
- `reactiveCompactGroupStepLoop` (`xA8`) — cli_inner_pretty.js:271231-271323 — reactive-compaction loop with token-gap-guided step sizing (`bv7`/`mc5`, helper `mc5` at 271227-271230, consumed at 271314). Separate from partial compaction.
