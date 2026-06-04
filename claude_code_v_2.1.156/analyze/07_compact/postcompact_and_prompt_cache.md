# PostCompact hook & prompt-cache break

## Overview

When Claude Code compacts a conversation it rewrites the **prefix** of the prompt sent to the API: the long tail of old messages is replaced by a single short summary message plus a boundary marker. Because Anthropic's server-side prompt cache keys on an **exact prefix match**, this rewrite **invalidates the cache** — the next API call reads far fewer cached tokens than the previous one. Several subsystems must be told "a compaction just happened" so they do not mistake this expected collapse for a bug, do not show stale warnings, and do flush the process-local caches that compaction invalidated.

The post-compaction tail in v2.1.156 is **three independent concerns**, deliberately decoupled — conflating them is the classic reading error:

1. **`pendingPostCompaction` one-shot flag** (`markPostCompaction` / `consumePostCompaction`) — a session-global boolean set when a compaction commits and read-and-cleared exactly once by the next `tengu_api_success` telemetry event, surfacing as the `isPostCompaction: true` field. This is **pure analytics correlation**; it lets the warehouse join the first post-compact API call back to its compaction. It controls nothing.

2. **The `PostCompact` hook event** (`executePostCompactHooks` = `zJH`) — fires *during* the compaction commit (right after the summary message is built, before the result is returned), with payload `{...createBaseHookInput, hook_event_name:"PostCompact", trigger, compact_summary}`. Its stdout is folded into a user-visible compaction message (display only — it never re-enters the model context).

3. **Prompt-cache-break suppression** (`notifyCompaction` = `_P$`) — resets the cache-break *detector's* `prevCacheReadTokens` baseline to `null` so the very next API response is exempt from break detection. A *separate* mechanism (`cacheMissAckedAtOutputTokens`) suppresses the interactive cache-miss banner, and the `compactWarningStore` (`suppressCompactWarning` = `LEH`) hides the "context left until autocompact" hint until real token counts return.

**The single most important structural finding for this version:** at each compaction commit site the bundle emits `(XxH(), KrH())` — `markPostCompaction()` then `reAppendSessionMetadata()`. `KrH` is **NOT** `notifyCompaction`; in v2.1.156 `KrH` resolves to `reAppendSessionMetadata` (`cli_inner_pretty.js:547577`). `notifyCompaction` (`_P$`, `cli_inner_pretty.js:270034`) is a **separate, gated call** placed just *before* that pair, guarded by `Jc()` (the cache-break-detection gate). A reader could mis-pair the obfuscated `KrH` with `notifyCompaction` by position; the v2.1.88 source disambiguates that the call adjacent to `markPostCompaction` is `reAppendSessionMetadata`. The ordering matches v2.1.88 exactly: `if (gate) notifyCompaction(...)` → `markPostCompaction()` → `reAppendSessionMetadata()`.

---

## The `cacheBreak:false` prompt-prefix MEMO gate

This is yet a **third** distinct "cache break" concept, different from both the server-side prompt-cache invalidation *and* the analytics break *detector*. Lines `cli_inner_pretty.js:271350-271361` define a memoization helper for prompt-prefix computation.

### What it does

`DE(name, compute)` declares a named, lazily-computed prompt segment with `cacheBreak: false` by default. `uv7` resolves a list of such segments, consulting a **process-local compute memo** (`SYH()` / `Qm8`) on a per-segment basis. This is a client-side cache for *building* the system-prompt/prefix, distinct from the server-side prompt cache and distinct from the break detector. The naming overlap is incidental; the machinery is unrelated.

### How it works

1. `DE(name, compute)` returns `{ name, compute, cacheBreak: false }` (`cli_inner_pretty.js:271350`). The default `cacheBreak:!1` means "this segment is stable — memoize it."
2. `uv7(segments)` (`cli_inner_pretty.js:271353`) walks the list. For each segment:
   - If `!cacheBreak && memo.has(name)` → return the memoized value (`cli_inner_pretty.js:271357`, **memo hit**) without recomputing.
   - Otherwise call `compute()`, store the fresh value via `Qm8(name, value)`, return it (`cli_inner_pretty.js:271358-271359`, **recompute**).
3. A segment declared with `cacheBreak:true` **bypasses** the memo unconditionally — it is recomputed every time and the fresh value is re-stored. So `cacheBreak:true` means "this segment is volatile; never trust the memo for it."

### Why this approach

Stable prefix fragments (the bulk of the system prompt) are computed once and reused, making prefix builds cheap; only the fragments that genuinely vary declare `cacheBreak:true`. The per-segment flag puts the volatility decision at the declaration site, next to the `compute` closure, rather than in a central exclusion list.

### Key insight

**Three** different "cache break" concepts coexist in this subsystem, with overlapping names but disjoint machinery:
- **(a)** this client-side memo gate (the per-segment `cacheBreak` flag),
- **(b)** the server-side prompt-cache invalidation caused by the prefix rewrite,
- **(c)** the analytics break *detector* (`checkResponseForCacheBreak` / `tengu_prompt_cache_break`).

`notifyCompaction` touches only (c). `DE`/`uv7` are only (a).

---

## Deep dive 1 — `pendingPostCompaction` flag lifecycle (one-shot)

### What it does

A single session-global boolean (`d$.pendingPostCompaction`) that carries the fact "a compaction just committed" forward exactly one API call, so the resulting `tengu_api_success` event can be tagged `isPostCompaction:true`. This is correlation, not control.

### How it works

1. **Init** (`cli_inner_pretty.js:2353`): the session state object `d$` is constructed with `pendingPostCompaction: !1`.
2. **Set** (`markPostCompaction` = `XxH`, `cli_inner_pretty.js:2540-2542`): the body is literally `d$.pendingPostCompaction = !0`. Called at every compaction commit site: reactive/auto compact (`272396`), the unified compact path (`423284`), and partial/manual compact (`423476`).
3. **Consume** (`consumePostCompaction` = `vu8`, `cli_inner_pretty.js:2543-2546`): reads the current value into a local, sets the field back to `!1`, returns the captured value — classic read-and-clear. This is the **only** place the flag is cleared.
4. **The single consumer** (`cli_inner_pretty.js:452614`): inside the `tengu_api_success` emitter, `x = vu8()`. The captured value is then spread conditionally into the event at `cli_inner_pretty.js:452667`: `...(x && { isPostCompaction: x })`. Because consume clears the flag, only the **first** API success after a compaction carries `isPostCompaction:true`; every subsequent call omits the field.

### Edge cases

- If a compaction commits but no API call follows (session ends, user aborts), the flag simply stays set and is reset at the next session init / is never consumed — harmless; it is just a missed telemetry tag.
- Two compactions before one API call collapse into a single `isPostCompaction` tag (the set is idempotent).
- Because the field lives on `d$` (the **base** session state, not an overlay used for cross-thread reads), all reads/writes hit the one shared object — there is no per-agent isolation for this flag. **In-process subagents share it.**

### Why this approach

A one-shot consume-on-read is the minimal way to attribute exactly one downstream event to an upstream state transition without threading an `isPostCompaction` parameter through the entire compaction → query → API-call stack (which crosses many module boundaries and async hops). The alternative — passing the flag from `compactConversation` all the way into `logApiSuccess` — would require touching every intermediate signature. The flag is a deliberate, tiny piece of "ambient" state pulled by the telemetry layer at the last moment.

### Key insight

`consumePostCompaction` is **not** the mechanism that suppresses the cache-miss dialog (a common misreading). Its sole consumer is analytics (`isPostCompaction`). Dialog/warning suppression is handled by two entirely separate mechanisms (`cacheMissAckedAtOutputTokens` and `compactWarningStore`) described below. The flag's value is *correlation, not control flow*.

```javascript
// ============================================
// markPostCompaction / consumePostCompaction - one-shot post-compact telemetry flag
// Location: cli_inner_pretty.js:2540-2546
// ============================================

// ORIGINAL (for source lookup):
function XxH() {
  d$.pendingPostCompaction = !0;
}
function vu8() {
  let H = d$.pendingPostCompaction;
  return ((d$.pendingPostCompaction = !1), H);
}

// READABLE (for understanding):
function markPostCompaction() {
  STATE.pendingPostCompaction = true;       // arm at every compaction commit
}
function consumePostCompaction() {
  const was = STATE.pendingPostCompaction;
  STATE.pendingPostCompaction = false;       // read-and-clear: only fires once
  return was;                                // true exactly once after a compaction, then false
}

// Mapping: XxH->markPostCompaction, vu8->consumePostCompaction, d$->STATE, H->was, !0->true, !1->false
```

```javascript
// ============================================
// consumePostCompaction sole consumer - tags first post-compact tengu_api_success
// Location: cli_inner_pretty.js:452614,452667
// ============================================

// ORIGINAL (for source lookup):
let R = R6(),
    x = vu8(),
    /* ... */
  (d("tengu_api_success", {
    /* ... */
    ...(x && { isPostCompaction: x }),
    /* ... */

// READABLE (for understanding):
const isPostCompaction = consumePostCompaction();           // read-and-clear once
logEvent("tengu_api_success", {
  /* ... */
  ...(isPostCompaction && { isPostCompaction }),            // present only on the first call after a compaction
});

// Mapping: x->isPostCompaction, vu8->consumePostCompaction, d->logEvent. Only call site of vu8 besides the export at 2204.
```

---

## Deep dive 2 — the PostCompact HOOK event

### What it does

`executePostCompactHooks` (`zJH`, `cli_inner_pretty.js:551596-551614`) runs any user/plugin-registered `PostCompact` hook commands, passing them the compaction trigger and the summary text, and collects their stdout into a user-facing message.

### How it works

1. **Payload build** (`cli_inner_pretty.js:551597`): `K = { ...w5(void 0), hook_event_name:"PostCompact", trigger: H.trigger, compact_summary: H.compactSummary }`. `w5` (= `createBaseHookInput`, `cli_inner_pretty.js:552312`) supplies the common envelope: `session_id`, `transcript_path`, `cwd`, `permission_mode`, `agent_id`, `agent_type`, and an optional `effort`. The full payload is therefore `{session_id, transcript_path, cwd, permission_mode, agent_id, agent_type, effort?, hook_event_name:"PostCompact", trigger:"auto"|"manual", compact_summary:<string>}`.
2. **Execution** (`cli_inner_pretty.js:551598`): `Q2({ hookInput, matchQuery: H.trigger, signal, timeoutMs })`. `Q2` (= `executeHooksOutsideREPL`, `cli_inner_pretty.js:554046`) runs matching hook commands **out-of-band** with the abort signal and a default timeout `q_`. `matchQuery` is the trigger string, so a hook's `matcher` pattern can target `"auto"` vs `"manual"` compactions.
3. **No-op short-circuit** (`cli_inner_pretty.js:551599`): if no hooks matched (`results.length === 0`) return `{}`.
4. **Result folding** (`cli_inner_pretty.js:551601-551606`): each hook result becomes a line `PostCompact [<command>] completed successfully[: <output>]` or `PostCompact [<command>] failed[: <output>]`, joined with newlines into `userDisplayMessage`.

### When it fires in the pipeline

At every compaction commit site, **immediately before** `zJH` is awaited, the code emits a progress event: `onCompactEvent?.({ type:"compact_progress", event:{ type:"hooks_start", hookType:"post_compact" } })` (reactive `272406`, auto `423285`, manual/partial `423478`). That event drives the spinner UI: the reducer `Vo7` (`cli_inner_pretty.js:335632`) maps `hookType === "post_compact"` to the spinner label **"Running PostCompact hooks…"** (`cli_inner_pretty.js:335640`). The firing order at commit is:

1. `notifyCompaction` (if the `Jc()` gate is on) — reset cache baseline (`272395` / `423283` / `423475`).
2. `markPostCompaction()` + `reAppendSessionMetadata()` (`272396` / `423284` / `423476-423477`).
3. emit `hooks_start/post_compact` → UI shows "Running PostCompact hooks…" (`272406` / `423285` / `423478`).
4. `await zJH({ trigger, compactSummary })` → run the hooks (`272407` / `423286` / `423479`).
5. assemble boundary marker + summary messages + hook results + attachments into the compaction result.

So PostCompact fires **inside the synchronous commit window** of compaction — after the summary text exists (it needs `compact_summary`) but before the compacted message set is returned to the agent loop. Its output is **advisory** (display only); unlike PreCompact it has no documented ability to block or mutate the compaction.

### Registration

`PostCompact` is a first-class hook event registered in every hook registry table: the SDK schema enum (`49274`), the settings-merge `hooks` Set (`53562`), the plugin hook bucket map (`270492`, `270597`), and the canonical event list (`336623`). It sits right after `PreCompact` in every list.

### Why this approach

Running the hook out-of-band (`executeHooksOutsideREPL`) with an abort signal and timeout means a slow or hanging user hook cannot wedge the REPL render loop; the spinner keeps the user informed. Folding output into a display message (rather than back into the model context) keeps PostCompact a pure side-effect/notification mechanism — the model never sees hook output, avoiding accidental context pollution right after we worked to *shrink* context.

### Key insight

PostCompact is the symmetric bookend to PreCompact, but with **inverted power**: PreCompact can influence *what* gets compacted; PostCompact only *observes* that compaction finished and can run cleanup side effects (re-index, notify external systems). The trigger string doubles as the `matchQuery`, so a hook can register only for auto-compacts (the unattended path) without firing on manual `/compact`.

```javascript
// ============================================
// executePostCompactHooks - runs PostCompact hooks, folds stdout into a display message
// Location: cli_inner_pretty.js:551596-551614
// ============================================

// ORIGINAL (for source lookup):
async function zJH(H, $, q = q_) {
  let K = { ...w5(void 0), hook_event_name: "PostCompact", trigger: H.trigger, compact_summary: H.compactSummary },
    _ = await Q2({ hookInput: K, matchQuery: H.trigger, signal: $, timeoutMs: q });
  if (_.length === 0) return {};
  let z = [];
  for (let A of _)
    if (A.succeeded)
      if (A.output.trim()) z.push(`PostCompact [${A.command}] completed successfully: ${A.output.trim()}`);
      else z.push(`PostCompact [${A.command}] completed successfully`);
    else if (A.output.trim()) z.push(`PostCompact [${A.command}] failed: ${A.output.trim()}`);
    else z.push(`PostCompact [${A.command}] failed`);
  return { userDisplayMessage: z.length > 0 ? z.join("\n") : void 0 };
}

// READABLE (for understanding):
async function executePostCompactHooks(compactData, signal, timeoutMs = TOOL_HOOK_EXECUTION_TIMEOUT_MS) {
  const hookInput = {
    ...createBaseHookInput(undefined),            // session_id, transcript_path, cwd, permission_mode, agent_id, agent_type, effort?
    hook_event_name: "PostCompact",
    trigger: compactData.trigger,                 // "auto" | "manual" — doubles as matchQuery
    compact_summary: compactData.compactSummary,  // the just-built summary text
  };
  const results = await executeHooksOutsideREPL({ hookInput, matchQuery: compactData.trigger, signal, timeoutMs });
  if (results.length === 0) return {};            // no matching hooks: nothing to display
  const lines = [];
  for (const r of results)
    if (r.succeeded)
      lines.push(r.output.trim() ? `PostCompact [${r.command}] completed successfully: ${r.output.trim()}` : `PostCompact [${r.command}] completed successfully`);
    else
      lines.push(r.output.trim() ? `PostCompact [${r.command}] failed: ${r.output.trim()}` : `PostCompact [${r.command}] failed`);
  return { userDisplayMessage: lines.length > 0 ? lines.join("\n") : undefined };  // display-only, never re-enters model context
}

// Mapping: zJH->executePostCompactHooks, H->compactData, $->signal, q->timeoutMs, q_->TOOL_HOOK_EXECUTION_TIMEOUT_MS,
//          w5->createBaseHookInput, Q2->executeHooksOutsideREPL, _->results, z->lines, A->r. Near-verbatim match to v2.1.88 hooks.ts:4034.
```

---

## Deep dive 3 — the prompt-cache BREAK and `notifyCompaction`

### What it does

Compaction rewrites the prompt prefix → the server-side prompt cache is invalidated → the next response's `cache_read_input_tokens` collapses. `notifyCompaction` (`_P$`, `cli_inner_pretty.js:270034`) tells the **cache-break detector** "expect this drop, don't flag it."

### How it works

1. **The detector** is the module at `cli_inner_pretty.js:269582-270100`. It keeps a per-tracking-key `Map` `HU` of `PreviousState` snapshots (capped at `Xc5` = 10). The key is computed by `getTrackingKey` (`GA8`, `cli_inner_pretty.js:269624`): `querySource === "compact"` maps to `"repl_main_thread"` (compaction shares the main thread's server cache), tracked agent prefixes use `agentId || querySource`, everything else is untracked (`null`).
2. **Detection** (`checkResponseForCacheBreak` = `wv7`, `cli_inner_pretty.js:269885`): on each API response it compares `cacheReadTokens` against the stored `prevCacheReadTokens`. A break is declared when `cacheReadTokens < prevCacheReadTokens * 0.95` **and** the absolute drop `D = prev − current` `>= Pc5` (constant = 2000, bare comparison `D < Pc5` at `cli_inner_pretty.js:269905`; constant defined at `cli_inner_pretty.js:270054`). It then attributes the break from `pendingChanges` (system prompt / tools / model / betas / TTL etc.), emits `tengu_prompt_cache_break` (`cli_inner_pretty.js:269954`), and clears `pendingChanges`.
3. **`notifyCompaction`** (`_P$`, `cli_inner_pretty.js:270034`): `let q = $ ?? GA8(H); let K = q ? HU.get(q) : void 0; if (K) (K.prevCacheReadTokens = null, DEH());` — it sets the stored baseline to `null`. On the next `checkResponseForCacheBreak`, the early guard `if (O === null) return` (`cli_inner_pretty.js:269896`, where `O` is the prev baseline) fires, so the post-compact response is **exempt** — no break is flagged, but the new `cacheReadTokens` is recorded as the fresh baseline (`cli_inner_pretty.js:269893`) for subsequent calls.
4. **The gate `Jc()`** (`cli_inner_pretty.js:269582-269585`): `if (CLAUDE_CODE_IS_COWORK) return true; return Yv7();`. There is **no `PROMPT_CACHE_BREAK_DETECTION` env var**. Cache-break detection runs only under **Cowork** (`CLAUDE_CODE_IS_COWORK`) **or the claude-desktop entrypoint** — `Yv7()` (`cli_inner_pretty.js:269579-269581`) returns `process.env.CLAUDE_CODE_ENTRYPOINT === "claude-desktop"` (the `isDesktop` condition, also emitted as the `isDesktop` telemetry field at `269998`). Both `notifyCompaction` calls in compact paths are guarded by `Jc()` (reactive `272395`: `($kH(...), Jc())`; manual `423475`: `if (Jc())`). The auto path at `423283` calls `_P$` unconditionally inside an already-`Jc()`-gated branch.

### Sibling: `notifyCacheDeletion` (`Jv7`, `cli_inner_pretty.js:270029`)

Sets `K.cacheDeletionsPending = !0`. Consumed in `checkResponseForCacheBreak` at `cli_inner_pretty.js:269898`: a pending deletion means the cache-read drop is from a cached-microcompact `cache_edits` deletion, logged as an "expected drop" (`269900`) and not flagged. Distinct from compaction's full-baseline reset.

### Why this approach (baseline reset vs. a "skip-next" boolean)

`notifyCompaction` resets `prevCacheReadTokens = null` rather than setting a `suppressNextBreak` boolean. Reusing the already-existing "first call has no baseline" code path (`if (O === null) return`) means **zero new branches** in the hot detection function — the post-compact call is treated exactly like the session's first call, which it effectively is (a fresh prefix). A boolean would add a branch and risk *leaking* suppression if the next call never arrives. Resetting to `null` is **self-healing**: whatever the next read is becomes the new truth.

### Key insight

There are **three** distinct "don't alarm me" mechanisms post-compact, and they are independent **on purpose**:

- `notifyCompaction` (`_P$`) → silences the **background analytics** break detector (`tengu_prompt_cache_break`).
- `cacheMissAckedAtOutputTokens` (set in cleanup `Uo` at `272188-272191`) → silences the **interactive cache-miss banner**. The gate `n$q` (`cli_inner_pretty.js:523924`) returns `false` (suppress) when `outputTokens === cacheMissAckedAtOutputTokens`, i.e. nothing new has been generated since the ack.
- `suppressCompactWarning` (`LEH`, `cli_inner_pretty.js:271340`) → hides the "context left until autocompact" hint via the `wP$` store until the next API response yields real token counts; cleared by `clearCompactWarningSuppression` (`xv7`, `cli_inner_pretty.js:271343`) at the start of the next compact attempt (`451282`).

Conflating these is the classic error; only the first is "the cache break," and `consumePostCompaction` touches none of them.

```javascript
// ============================================
// notifyCompaction - reset cache-break baseline (NOT KrH / reAppendSessionMetadata)
// Location: cli_inner_pretty.js:270034-270038
// ============================================

// ORIGINAL (for source lookup):
function _P$(H, $) {
  let q = $ ?? GA8(H),
    K = q ? HU.get(q) : void 0;
  if (K) ((K.prevCacheReadTokens = null), DEH());
}

// READABLE (for understanding):
function notifyCompaction(querySource, agentId) {
  const key = agentId ?? getTrackingKey(querySource);          // "compact" -> "repl_main_thread"
  const state = key ? previousStateBySource.get(key) : undefined;
  if (state) {
    state.prevCacheReadTokens = null;   // exempt next response: re-enters the "no baseline yet" path
    persistCacheBreakState();           // DEH: NEW in v2.1.156 - flush to cache-break-state-<sid>.json
  }
}

// Mapping: _P$->notifyCompaction, H->querySource, $->agentId, GA8->getTrackingKey, HU->previousStateBySource,
//          K->state, DEH->persistCacheBreakState. NOTE: in v2.1.88 the body was just state.prevCacheReadTokens=null with no persistence.
```

```javascript
// ============================================
// compaction commit tail (reactive path) - notifyCompaction; markPostCompaction; reAppendSessionMetadata
// Location: cli_inner_pretty.js:272395-272396
// ============================================

// ORIGINAL (for source lookup):
if (($kH(j.memorySelector), Jc())) _P$(z ?? "compact", j.agentId);
  if (w) (XxH(), KrH());

// READABLE (for understanding):
if ((resetMemorySelector(ctx.memorySelector), cacheBreakDetectionEnabled()))   // Jc = Cowork OR claude-desktop entrypoint
  notifyCompaction(querySource ?? "compact", ctx.agentId);                      // reset cache-break baseline
if (isMainThread) {                                                            // w = isMainThreadQuerySource(querySource)
  markPostCompaction();                                                        // XxH: arm the one-shot telemetry flag
  reAppendSessionMetadata();                                                   // KrH: NOT notifyCompaction! re-stamps session metadata
}

// Mapping: Jc->cacheBreakDetectionEnabled (Cowork OR claude-desktop, NOT a feature env var), _P$->notifyCompaction,
//          z->querySource, j->ctx, w (=rkH(z))->isMainThread, XxH->markPostCompaction, KrH->reAppendSessionMetadata.
//          KEY: KrH is reAppendSessionMetadata (547577), NOT notifyCompaction.
```

```javascript
// ============================================
// KrH definition - proves it is reAppendSessionMetadata, not notifyCompaction
// Location: cli_inner_pretty.js:547577-547579
// ============================================

// ORIGINAL (for source lookup):
function KrH() {
  p1().reAppendSessionMetadata();
}

// READABLE (for understanding):
function reAppendSessionMetadata() {
  getSessionStore().reAppendSessionMetadata();   // keep title/tag inside the 16KB --resume tail window after compaction
}

// Mapping: KrH->reAppendSessionMetadata, p1->getSessionStore. Exported as reAppendSessionMetadata:()=>KrH at 545971.
```

---

## Deep dive 4 — post-compact cleanup (`runPostCompactCleanup` = `Uo`)

### What it does

`Uo` (`cli_inner_pretty.js:272181`) frees the module-level caches and tracking state that compaction invalidated and, for main-thread compacts, acks the cache-miss banner.

### How it works

1. `K = rkH(H)` (`cli_inner_pretty.js:272182`): `rkH` is `isMainThreadQuerySource` — true for `undefined`, `repl_main_thread*`, and `sdk`. This guards main-thread-only resets so a subagent compaction does not clobber the main thread's shared module state.
2. Always: `FA8(q, "post_compact_cleanup", H)` (`cli_inner_pretty.js:272183`) — telemetry/marker.
3. **Main-thread only** (`if (K)`, `cli_inner_pretty.js:272184`): `Nj.cache.clear?.()` (clear the `getUserContext` memo — so an armed InstructionsLoaded hook can re-fire), `aJ$("compact")` (`resetGetMemoryFilesCache`), `L8H()` (`clearSystemPromptSectionsAndBetaLatches` → `gm8()` + `sm8()`, `271363`), `cA8()`, `lv7()`, and `Qv7(...)` (`clearClassifierApprovals` via `HJH`).
4. `if (K) $l5.resetAutonomousLoopDelivered()` (`cli_inner_pretty.js:272185`).
5. **Cache-miss banner ack** (`cli_inner_pretty.js:272186-272191`): if main-thread and a `setState` fn exists, set `cacheMissAckedAtOutputTokens = UD()` (current cumulative output tokens) so the banner stays hidden until new output is produced.
6. `IN6()` (`cli_inner_pretty.js:272193`) — final reset.

### Why this approach

The main-thread gate is critical because v2.1.156 runs subagents **in the same process** sharing module-level singletons (the v2.1.88 comment explicitly notes this: "Subagents (`agent:*`) run in the same process and share module-level state … resetting those when a SUBAGENT compacts would corrupt the MAIN thread's state"). The cleanup deliberately does **not** reset invoked-skill content (so skill text survives across compactions for re-injection) and does **not** call `resetSentSkillNames` — re-injecting the ~4K-token skill listing would be pure `cache_creation` waste.

### Key insight

Cleanup is a **cache-coherence** operation, not a memory-pressure one: the compacted prompt has a new system-prompt section set, new memory-file context, and a new prefix, so every memo keyed on the old prefix must be dropped or the next prompt build silently serves stale fragments.

```javascript
// ============================================
// runPostCompactCleanup - main-thread-gated cache reset + cache-miss banner ack
// Location: cli_inner_pretty.js:272181-272193
// ============================================

// ORIGINAL (for source lookup):
function Uo(H, $, q) {
  let K = rkH(H);
  if ((FA8(q, "post_compact_cleanup", H), K))
    (Nj.cache.clear?.(), aJ$("compact"), L8H(), cA8(), lv7(), Qv7($ ? HJH($) : void 0));
  if (K) $l5.resetAutonomousLoopDelivered();
  if (K && $) {
    let _ = UD();
    $((z) => {
      if (z.cacheMissAckedAtOutputTokens === _) return z;
      return { ...z, cacheMissAckedAtOutputTokens: _ };
    });
  }
  IN6();
}

// READABLE (for understanding):
function runPostCompactCleanup(querySource, setAppState, agentId) {
  const isMainThread = isMainThreadQuerySource(querySource);   // rkH: undefined / repl_main_thread* / sdk
  logCleanupMarker(agentId, "post_compact_cleanup", querySource);
  if (isMainThread) {                                          // subagents share singletons; only main thread may reset
    getUserContext.cache.clear?.();                            // re-arm InstructionsLoaded hook
    resetGetMemoryFilesCache("compact");
    clearSystemPromptSectionsAndBetaLatches();                 // L8H = gm8 (sections) + sm8 (beta latches)
    /* cA8, lv7 extra resets */
    clearClassifierApprovals(setAppState ? wrapClassifierApprovals(setAppState) : undefined);
    resetAutonomousLoopDelivered();
    const outTokens = getTotalOutputTokens();                  // UD
    setAppState?.(s => s.cacheMissAckedAtOutputTokens === outTokens ? s : { ...s, cacheMissAckedAtOutputTokens: outTokens });
  }
  finalReset();                                                // IN6
}

// Mapping: Uo->runPostCompactCleanup, H->querySource, $->setAppState, q->agentId, rkH->isMainThreadQuerySource,
//          Nj.cache->getUserContext.cache, aJ$->resetGetMemoryFilesCache, L8H->clearSystemPromptSectionsAndBetaLatches
//          (gm8=clearSystemPromptSectionState, sm8=clearBetaHeaderLatches), Qv7/HJH->clearClassifierApprovals,
//          UD->getTotalOutputTokens, IN6->finalReset.
```

```javascript
// ============================================
// prompt-prefix memo gate - cacheBreak:false memoizes, cacheBreak:true forces recompute
// Location: cli_inner_pretty.js:271350-271361
// ============================================

// ORIGINAL (for source lookup):
function DE(H, $) {
  return { name: H, compute: $, cacheBreak: !1 };
}
async function uv7(H) {
  let $ = SYH();
  return Promise.all(
    H.map(async (q) => {
      if (!q.cacheBreak && $.has(q.name)) return $.get(q.name) ?? null;
      let K = await q.compute();
      return (Qm8(q.name, K), K);
    }),
  );
}

// READABLE (for understanding):
function memoSegment(name, compute) {
  return { name, compute, cacheBreak: false };   // default: stable, memoizable
}
async function resolvePromptSegments(segments) {
  const memo = getPrefixMemo();                  // process-local compute cache (NOT the server prompt cache)
  return Promise.all(segments.map(async (seg) => {
    if (!seg.cacheBreak && memo.has(seg.name)) return memo.get(seg.name) ?? null;  // memo hit
    const value = await seg.compute();                                             // cacheBreak:true bypasses memo -> recompute
    setPrefixMemo(seg.name, value);
    return value;
  }));
}

// Mapping: DE->memoSegment, uv7->resolvePromptSegments, SYH->getPrefixMemo, Qm8->setPrefixMemo,
//          H->segments/name, $->compute/memo, q->seg, K->value, cacheBreak:!1->cacheBreak:false.
//          cacheBreak:true forces recompute (bypass memo).
```

---

## End-to-end ordering at a compaction commit (reactive path, `cli_inner_pretty.js:272380-272442`)

1. Clear per-turn read-file state and nested-memory paths (`272393-272394`).
2. `if ((..., Jc())) _P$(z ?? "compact", j.agentId)` — **notifyCompaction**: reset cache-break baseline (`272395`).
3. `if (w) (XxH(), KrH())` — **markPostCompaction** + **reAppendSessionMetadata** (`w = rkH(z)`, main-thread guard) (`272396`).
4. Build boundary marker `L`, attach pre-compact discovered tools, compute attachments `W` (`272397-272405`).
5. Emit `hooks_start/post_compact` → "Running PostCompact hooks…" (`272406`).
6. `await zJH({ trigger:A, compactSummary:$.summaryText }, signal)` — **PostCompact hook** (`272407`).
7. Compute `E = sT(h5H(v))` post-compact token count; store `V.compactMetadata.postTokens = E` (`272418-272419`).
8. Emit `tengu_reactive_compact_succeeded` with `preCompactTokens: D` and `postCompactTokens: E` (`272441-272442`).

Note that `runPostCompactCleanup`/`Uo` and `suppressCompactWarning`/`LEH` run slightly later, in the **caller** (the autocompact dispatcher around `272323-272326`): `Uo(q, setAppState, agentId)` then `if (rkH(q)) LEH()`.

### `postCompactTokens` telemetry

At `cli_inner_pretty.js:272442` the `tengu_reactive_compact_succeeded` event carries `postCompactTokens: E` alongside `preCompactTokens: D` (`272441`). `E` is the serialized token count of the freshly compacted message set `v` (`E = sT(h5H(v))`, `272418`), the same value stamped onto `compactMetadata.postTokens` (`272419`). The manual/partial path uses the parallel field `postCompactTokenCount` on the result object (`423299`, `423492`) and `post_compact_tokens` in its own event (`423325`). The reactive-compact event field `postCompactTokens` (`cli_inner_pretty.js:272442`) and the `tengu_reactive_compact_succeeded` event are new in v2.1.156. The result-object fields `postCompactTokenCount` and `truePostCompactTokenCount` BOTH already existed in v2.1.88 (`query.ts:473-474`, `compact.ts:307-308`) and both persist into v2.1.156 (e.g. `423299-423300`); they are distinct metrics (call-total usage vs true post-compact estimate), NOT a rename of one another.

---

## Cross-validation against v2.1.88

### Matched (carried forward, names map cleanly)

- **The one-shot flag is byte-for-byte semantically identical.** v2.1.88 `bootstrap/state.ts:771-781` has `markPostCompaction() => STATE.pendingPostCompaction = true` and `consumePostCompaction() { const was = ...; STATE.pendingPostCompaction = false; return was }`, exactly mirrored by `XxH`/`vu8` at `cli_inner_pretty.js:2540-2546`. The v2.1.88 doc comment ("The next API success event will include `isPostCompaction=true`, then the flag auto-resets") is realized in the bundle at `452614`/`452667`. State init `pendingPostCompaction: !1` at `2353` matches `bootstrap/state.ts:256`/`422`.
- **The PostCompact hook is a near-verbatim port.** v2.1.88 `hooks.ts:4034` `executePostCompactHooks` builds `{...createBaseHookInput(undefined), hook_event_name:"PostCompact", trigger, compact_summary}`; the success/failure message strings are identical to `zJH` (`551596`).
- **`notifyCompaction`'s behavior matches exactly.** v2.1.88 `promptCacheBreakDetection.ts:689` sets `state.prevCacheReadTokens = null`; `_P$` does the same. The detector thresholds (5% / 2000-token floor `Pc5`) and the `getTrackingKey` `"compact" → "repl_main_thread"` rule are unchanged. `notifyCacheDeletion` (`Jv7`), `checkResponseForCacheBreak` (`wv7`), `getTrackingKey` (`GA8`), and the constants `MIN_CACHE_MISS_TOKENS = 2000` (`Pc5`), `CACHE_TTL_5MIN_MS = 300000` (`Wc5`), `CACHE_TTL_1HOUR_MS = 3600000` (`sk6`), `MAX_TRACKED_SOURCES = 10` (`Xc5`) all carry forward.
- **`suppressCompactWarning` / `compactWarningStore` semantics match `compactWarningState.ts` exactly** (`LEH`/`xv7`/`wP$`).

### Diverged

- **The compaction commit ORDER.** v2.1.88 source (`compact.ts:698-711`, `autoCompact.ts:302-305`, `commands/compact/compact.ts`) shows `notifyCompaction` (gated) → `markPostCompaction` → `reAppendSessionMetadata` as three separate statements. v2.1.156 collapses the last two into the tuple `(XxH(), KrH())` and keeps `notifyCompaction` (`_P$`) as a separately `Jc()`-gated statement just above. **Critically, `KrH` (the second tuple element) is `reAppendSessionMetadata`, NOT `notifyCompaction`** — a reader could mis-pair the obfuscated `KrH` with `notifyCompaction` by position; the v2.1.88 source disambiguates that the call adjacent to `markPostCompaction` is `reAppendSessionMetadata`.
- **The gate condition.** v2.1.88 used a plain `feature('PROMPT_CACHE_BREAK_DETECTION')` flag. v2.1.156's `Jc()` (`269582`) is "**Cowork OR claude-desktop entrypoint**" — `if (CLAUDE_CODE_IS_COWORK) return true; return Yv7()`, where `Yv7` checks `CLAUDE_CODE_ENTRYPOINT === "claude-desktop"`. There is no `PROMPT_CACHE_BREAK_DETECTION` env var in this build.

### Post-2.1.88 (newer than the readable v2.1.88 build)

1. **On-disk persistence of cache-break tracking state**: `getCacheBreakStatePath` (`Ov7`, `269589`) → `cache-break-state-<sessionId>.json`, `loadCacheBreakState` (`Jc5`, `269592`), `persistCacheBreakState` (`DEH`, `269605`). `notifyCompaction` now also calls `DEH()` to flush the reset baseline to disk (`270037`); v2.1.88's `notifyCompaction` was a pure in-memory `state.prevCacheReadTokens = null` with no persistence.
2. **New cache-break attribution dimensions** in `tengu_prompt_cache_break`: `messagesHistoryChanged` + `firstChangedMessageIndex` (a top-level payload field at `269968`), computed from a new `messageHashes` array (`269772`/`269794`/`269838-269840`); `cacheDiagnosis` + `cacheDiagnosisChanged` (`269721`/`269835`/`269939`); block-level diffing `prevBlockCount`/`newBlockCount`/`changedBlockIndices`/`changedBlockLengthDeltas` (`269846-269848`/`269972-269975`); and environment tags `isCowork` + `isDesktop` (`269997-269998`). Note: `prevMessageCount` lives in the `pendingChanges` change struct (`269840`) and inside the change-reason string (`269944`) but is **not** emitted as a standalone top-level key in the payload (`269964-270001`). v2.1.88 had none of these (its set was system/tools/model/fastMode/cacheControl/globalCacheStrategy/betas/autoMode/overage/cachedMC/effort/extraBody).
3. **The `Jc()` gate** now force-enables detection when `CLAUDE_CODE_IS_COWORK` is set (`269583`), and persistence is keyed on cowork mode via `fv7()` (`269587`/`269606`); v2.1.88 had a plain feature flag.
4. **Overage line text** changed from "overage state changed (TTL latched, no flip)" (v2.1.88) to "overage state changed (TTL flip expected)" (`269938`).
5. **The `cachedMCEnabled`/`cachedMCChanged` pair** from v2.1.88 was replaced/renamed by the `cacheDiagnosis` pair in v2.1.156.
6. **`postCompactTokens` reactive-compact telemetry is new**: The reactive-compact event field `postCompactTokens` (`cli_inner_pretty.js:272442`) and the `tengu_reactive_compact_succeeded` event are new in v2.1.156. The result-object fields `postCompactTokenCount` and `truePostCompactTokenCount` BOTH already existed in v2.1.88 (`query.ts:473-474`, `compact.ts:307-308`) and both persist into v2.1.156 (e.g. `423299-423300`); they are distinct metrics (call-total usage vs true post-compact estimate), NOT a rename of one another.
7. **Cache-miss banner suppression via `cacheMissAckedAtOutputTokens`** (`Uo` at `272188-272191`, gate `n$q` at `523924`) was not present in v2.1.88's `postCompactCleanup.ts` (which only cleared caches); it is a newer interactive-suppression mechanism layered on top, and importantly is **NOT** driven by `consumePostCompaction`.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compact lives here
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Loop integration
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Telemetry / model context window
> - [symbol_additions_v2_1_156_compact.md](../00_overview/symbol_additions_v2_1_156_compact.md) - This module’s new symbols

Key functions in this document:

- `markPostCompaction` (`XxH`) — cli_inner_pretty.js:2540-2542 — sets `STATE.pendingPostCompaction = true` at every compaction commit; one-shot arm.
- `consumePostCompaction` (`vu8`) — cli_inner_pretty.js:2543-2546 — read-and-clear of `pendingPostCompaction`; true exactly once after a compaction; sole consumer is `tengu_api_success` at 452614.
- `STATE.pendingPostCompaction` (`d$.pendingPostCompaction`) — cli_inner_pretty.js:2353 (init), 2541 (set), 2544 (consume) — session-global boolean carrying "compaction just committed" forward one API call.
- `notifyCompaction` (`_P$`) — cli_inner_pretty.js:270034-270038 — resets cache-break baseline `prevCacheReadTokens=null` (+ persists via DEH) so the next response is exempt from `tengu_prompt_cache_break`; gated by `Jc()`.
- `notifyCacheDeletion` (`Jv7`) — cli_inner_pretty.js:270029-270033 — sets `cacheDeletionsPending=true` so a cached-microcompact `cache_edits` deletion's expected drop is not flagged.
- `checkResponseForCacheBreak` (`wv7`) — cli_inner_pretty.js:269885-270028 — phase-2 detector: flags break when drop > 5% and `>= Pc5` (2000); attributes cause; emits `tengu_prompt_cache_break`.
- `getTrackingKey` (`GA8`) — cli_inner_pretty.js:269624-269628 — maps querySource to tracking key; `"compact" → "repl_main_thread"`.
- `previousStateBySource` (`HU`) — cli_inner_pretty.js:270048,270069 — `Map<key,PreviousState>` of cache-break snapshots, capped at `Xc5`=10.
- `isPromptCacheBreakDetectionEnabled` (`Jc`) — cli_inner_pretty.js:269582-269585 — gate; `if (CLAUDE_CODE_IS_COWORK) return true; return Yv7()` (Cowork OR claude-desktop entrypoint). Guards `_P$` at 272395/423475.
- `isClaudeDesktopEntrypoint` (`Yv7`) — cli_inner_pretty.js:269579-269581 — `CLAUDE_CODE_ENTRYPOINT === "claude-desktop"`; the `isDesktop` condition (telemetry field at 269998).
- `getCacheBreakStatePath` (`Ov7`) — cli_inner_pretty.js:269589-269591 — NEW v2.1.156: returns `cache-break-state-<sessionId>.json` path under temp dir.
- `loadCacheBreakState` (`Jc5`) — cli_inner_pretty.js:269592-269604 — NEW v2.1.156: hydrates `HU` from the on-disk file once per session.
- `persistCacheBreakState` (`DEH`) — cli_inner_pretty.js:269605-269620 — NEW v2.1.156: serializes `HU` to `cache-break-state-<sessionId>.json`.
- `memoSegment` / `makeCacheableSection` (`DE`) — cli_inner_pretty.js:271350-271352 — declares a named lazily-computed prompt segment with `cacheBreak:false` (memoizable).
- `resolvePromptSegments` (`uv7`) — cli_inner_pretty.js:271353-271362 — resolves a segment list from the prefix memo unless `segment.cacheBreak` is true (then recompute and re-store).
- `getPrefixMemo` (`SYH`) — cli_inner_pretty.js:271354 (call) — returns the client-side prompt-prefix memo store.
- `setPrefixMemo` (`Qm8`) — cli_inner_pretty.js:271359 (call) — stores a computed prompt-prefix segment value into the memo.
- `executePostCompactHooks` (`zJH`) — cli_inner_pretty.js:551596-551614 — runs PostCompact hook commands with `{trigger, compact_summary}`; folds stdout into `userDisplayMessage`.
- `createBaseHookInput` (`w5`) — cli_inner_pretty.js:552312-552328 — builds the common hook envelope `{session_id, transcript_path, cwd, permission_mode, agent_id, agent_type, effort?}`.
- `executeHooksOutsideREPL` (`Q2`) — cli_inner_pretty.js:554046 — runs matching hook commands out-of-band with abort signal + timeout.
- `compactProgressReducer` (`Vo7`) — cli_inner_pretty.js:335632-335649 — maps `hooks_start/post_compact` to the spinner label "Running PostCompact hooks…" (335640).
- `runPostCompactCleanup` (`Uo`) — cli_inner_pretty.js:272181-272194 — main-thread-gated reset of getUserContext/memory/system-prompt/classifier caches + cache-miss banner ack.
- `clearSystemPromptSectionsAndBetaLatches` (`L8H`) — cli_inner_pretty.js:271363-271365 — calls `clearSystemPromptSectionState` (gm8) + `clearBetaHeaderLatches` (sm8).
- `isMainThreadQuerySource` (`rkH`) — cli_inner_pretty.js:272182 (call) — true for undefined / repl_main_thread* / sdk; gates main-thread-only cleanup.
- `suppressCompactWarning` (`LEH`) — cli_inner_pretty.js:271340-271342 — sets `compactWarningStore` true after a successful compaction to hide the autocompact hint.
- `clearCompactWarningSuppression` (`xv7`) — cli_inner_pretty.js:271343-271345 — resets `compactWarningStore` false at the start of a new compact attempt (451282).
- `compactWarningStore` (`wP$`) — cli_inner_pretty.js:271346,271348 — boolean store tracking whether the autocompact warning is suppressed.
- `reAppendSessionMetadata` (`KrH`) — cli_inner_pretty.js:547577-547579 (export 545971) — re-appends session metadata after compaction; called right after `markPostCompaction`. NOT `notifyCompaction`.
- `shouldShowModelMismatchCacheMiss` (`n$q`) — cli_inner_pretty.js:523924-523928 — cache-miss banner gate; returns false (suppress) when `outputTokens === cacheMissAckedAtOutputTokens`.
- `cacheMissAckedAtOutputTokens` — cli_inner_pretty.js:241529 (init=-1), 272189-272191 (set), 527097 (read) — app-state field set by `Uo` to suppress the interactive cache-miss banner until new output. Distinct from `pendingPostCompaction` and the break detector.

Key constants:

- `MIN_CACHE_MISS_TOKENS` (`Pc5`) — cli_inner_pretty.js:270054 — =2000; minimum absolute cache-read drop to flag a break.
- `CACHE_TTL_5MIN_MS` (`Wc5`) — cli_inner_pretty.js:270055 — =300000; 5-minute TTL threshold for break attribution.
- `CACHE_TTL_1HOUR_MS` (`sk6`) — cli_inner_pretty.js:270056 — =3600000; 1-hour TTL threshold.
- `MAX_TRACKED_SOURCES` (`Xc5`) — cli_inner_pretty.js:270052 — =10; cap on tracked sources to bound memory.
