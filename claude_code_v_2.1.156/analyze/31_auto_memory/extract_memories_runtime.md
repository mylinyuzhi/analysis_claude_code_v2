# Extract-Memories Runtime — Per-Turn Background Memory Extraction (v2.1.156)

## 1. What it does / where it sits

Auto-memory in Claude Code 2.1.156 has **three writers**. This document is the canonical reference for the **second** one — the *per-turn background extraction subagent*, the "fallback" writer that fires after every qualifying turn:

1. **Main-agent inline writes** — the main loop's own Edit/Write into the memory directory, driven by the "Memory" section of its system prompt. This is the *explicit* path: when the user says "remember X", the main agent can save it directly. (See [memdir_core.md](./memdir_core.md) for the system-prompt section.)
2. **Per-turn extraction subagent — THIS DOC.** When the main agent *doesn't* write a memory but the turn still produced durable signal, the stop-hook forks a sandboxed subagent that re-reads the most recent ~N messages and writes/updates topic files. It is the safety net that catches everything the user didn't explicitly ask to be saved.
3. **Auto-dream cross-session reorganizer** — a periodic background pass that *consolidates* the whole memory directory across sessions (merge duplicates, delete contradicted facts, prune the index). It runs roughly once a day, gated by a filesystem lock. See [auto_dream_runtime.md](./auto_dream_runtime.md).

The extraction subagent is **fire-and-forget from the stop-hook** — the main loop does not await it. It forks a fresh agent that shares the parent's prompt cache, runs under a strict tool allow-list (`createAutoMemCanUseTool`, shared with auto-dream), reads the conversation that just happened, and writes Markdown memory files. The only thing the user sees is a late-arriving "Saved N memories" pill in the transcript.

**Contrast with the other two writers:**

- *vs. main-agent inline writes* — the extraction subagent runs in a **separate forked agent** with a **separate prompt** ("you are now acting as the memory extraction subagent") and a **sandboxed tool list**. The two are mutually exclusive per turn: if the main agent already wrote a memory, the extractor detects it (`hasMemoryWritesSince`), skips, and advances its cursor (§4).
- *vs. auto-dream* — extraction is **per-turn, single-session, append/update-oriented**; auto-dream is **periodic, cross-session, reorganization-oriented**. Extraction has no filesystem lock (it can't race itself — it coalesces, §3). Both fork sandboxed agents and both reuse the *same* `createAutoMemCanUseTool` validator and the *same* `createMemorySavedMessage` system message — extraction uses verb "Saved", auto-dream patches it to "Improved".

## 2. The trigger + gate

The stop-hook fires both background writers right after a turn finishes:

```javascript
// ============================================
// Stop-hook background-writer call sites - extraction (gated) + auto-dream
// Location: cli_inner_pretty.js:450696-450700
// ============================================

// ORIGINAL (for source lookup):
if (!l9()) {
  if (!k4(process.env.CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION)) FX7(M, f?.lastResult);
  if (!z.agentId && S88()) Ac_.executeExtractMemories(M, z.appendSystemMessage);
  if (!z.agentId) U04(M, z.appendSystemMessage);
}

// READABLE (for understanding):
if (!isInBriefMode()) {
  if (!parseBoolean(process.env.CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION)) {
    runPromptSuggestionHarvest(turnContext, lastResult?.lastResult);
  }
  // Fire-and-forget memory extraction, MAIN agent only, gated on isExtractModeActive
  if (!toolUseContext.agentId && isExtractModeActive()) {
    extractMemoriesModule.executeExtractMemories(turnContext, toolUseContext.appendSystemMessage);
  }
  // Fire-and-forget auto-dream check, MAIN agent only (its own gates are internal)
  if (!toolUseContext.agentId) {
    runAutoDreamCheck(turnContext, toolUseContext.appendSystemMessage);
  }
}

// Mapping: l9->isInBriefMode, k4->parseBoolean, FX7->runPromptSuggestionHarvest,
//          z->toolUseContext, S88->isExtractModeActive, Ac_->extractMemoriesModule (re-export of lT8),
//          M->turnContext, U04->runAutoDreamCheck
```

Two preconditions guard the extraction call: `!z.agentId` (main agent only) and `S88()` (`isExtractModeActive`).

### 2.1 `isExtractModeActive` (`S88`) — the master gate

```javascript
// ============================================
// isExtractModeActive - The per-turn gate that lets the stop-hook fire extraction
// Location: cli_inner_pretty.js:142131-142134
// ============================================

// ORIGINAL (for source lookup):
function S88() {
  if (!V$("tengu_passport_quail", !1)) return !1;
  return !R6() || V$("tengu_slate_thimble", !1);
}

// READABLE (for understanding):
function isExtractModeActive() {
  // Master feature flag — extraction is OFF by default (gated rollout).
  if (!getFeatureValue("tengu_passport_quail", false)) return false;
  // Once the master flag is on: interactive sessions run; non-interactive
  // (-p / SDK / bg) sessions run only if the override flag is also on.
  return !isNonInteractive() || getFeatureValue("tengu_slate_thimble", false);
}

// Mapping: S88->isExtractModeActive, V$->getFeatureValue (cached Growthbook reader),
//          R6->isNonInteractive
```

**What it does:** Resolves, per-turn, whether the per-turn extractor may fire at all.

**How it works:**
1. `tengu_passport_quail` is the master rollout flag. Default `false`, so extraction is dark for users not in the experiment cohort — `S88()` short-circuits to `false` and the stop-hook never calls `executeExtractMemories`.
2. If the master flag is on, the *mode* check: `!isNonInteractive()` means the feature runs in interactive REPL by default. A non-interactive session (`-p`, SDK, background) is excluded **unless** the second flag `tengu_slate_thimble` opts it back in.

**Why this approach (gate at the call site, not only inside the module):** The same gate logic *also* lives inside `executeExtractMemoriesImpl` (§3) as a `tengu_passport_quail` check — so there is belt-and-braces gating. Putting `S88()` at the *call site* avoids even constructing the call when the feature is off — a cheap two-flag read protects the whole subsystem with zero allocation. Note that `S88()` and the module-internal gate are *not* redundant: the module-internal check covers callers that don't go through the stop-hook (e.g. the drain path in `-p` mode), and the call-site check additionally enforces the interactive/non-interactive mode policy.

**Why a separate `tengu_slate_thimble` override for non-interactive mode:** Interactive sessions get the extractor's "Saved N memories" pill in the transcript — harmless, visible feedback. A `-p` invocation prints a single response and exits; running a background LLM call on every `-p` turn would surprise scripts and burn tokens silently. So non-interactive callers are excluded by default and must explicitly opt in. (The drain path in §3 exists precisely so that an *opted-in* `-p` call finishes its extraction before process exit.)

### 2.2 Why extraction is gated off in subagents (`!agentId`)

Both stop-hook writers require `!z.agentId`. **The extractor must never run inside a subagent**, for two reasons:

1. **Recursion / duplication.** The extractor *itself* is a forked subagent. If extraction were allowed inside subagents, the forked extraction agent would, on *its* turn end, fire another extraction — an infinite fan-out of memory-writing forks.
2. **Wrong corpus.** A Task/Agent subagent works on a delegated sub-problem; its transcript is not the user's main conversation. Extracting "durable user memories" from a subagent's narrow tool-loop would save irrelevant or misleading facts. Only the main agent's transcript carries the signal worth persisting.

The `!agentId` guard is enforced in *three* places: the stop-hook call site (above), the module-internal `executeExtractMemoriesImpl` (`f.toolUseContext.agentId` check, §3), and structurally by the fork using `skipTranscript: true` so the extractor never even appears as a turn that could re-trigger.

## 3. Module + closure architecture

The whole subsystem is one module object, re-exported for the stop-hook, wrapping a closure factory.

```javascript
// ============================================
// extractMemoriesModule - The auto-memory extraction module exports
// Location: cli_inner_pretty.js:448082-448088
// ============================================

// ORIGINAL (for source lookup):
var lT8 = {};
X$(lT8, {
  initExtractMemories: () => Bg_,
  executeExtractMemories: () => pg_,
  drainPendingExtraction: () => Ug_,
  createAutoMemCanUseTool: () => cT8,
});
// ... re-exported for the stop-hook at cli_inner_pretty.js:450998:
// ((Ac_ = (Nk$(), Z6(lT8))), ...)

// READABLE (for understanding):
const extractMemoriesModule = {};
exportNamed(extractMemoriesModule, {
  initExtractMemories: () => initExtractMemories,        // Bg_ — closure factory, call once at startup
  executeExtractMemories: () => executeExtractMemories,  // pg_ — invoked per-turn by the stop-hook
  drainPendingExtraction: () => drainPendingExtraction,  // Ug_ — invoked before graceful shutdown (-p mode)
  createAutoMemCanUseTool: () => createAutoMemCanUseTool, // cT8 — strict tool-allow-list factory (shared w/ auto-dream)
});
// Ac_ = lazy-required namespace wrapper around lT8 (the stop-hook's handle)

// Mapping: lT8->extractMemoriesModule, X$->exportNamed, Z6->lazyRequireNamespace,
//          Bg_->initExtractMemories, pg_->executeExtractMemories,
//          Ug_->drainPendingExtraction, cT8->createAutoMemCanUseTool, Ac_->stop-hook handle for lT8
```

The export shape matches the 2.1.88 TypeScript module verbatim (`src/services/extractMemories/extractMemories.ts:296,598,611` for the three lifecycle functions, `:171` for the shared validator). The obfuscator renamed and merged the module into the giant bundle; the public surface is identical.

### 3.1 The closure factory — `initExtractMemories` (`Bg_`)

`initExtractMemories` is called **once at startup**. It opens a closure that captures all mutable state, defines the inner `runExtraction` / `executeExtractMemoriesImpl`, and assigns the two module-level handles (`y04` extractor, `h04` drainer) that the public `pg_`/`Ug_` forward to.

```javascript
// ============================================
// initExtractMemories - Closure factory; captures all mutable extraction state
// Location: cli_inner_pretty.js:448255-448378
// ============================================

// ORIGINAL (for source lookup, state head only):
function Bg_() {
  let H = new Set(),     // inFlightExtractions
    $,                   // lastMemoryMessageUuid (cursor)
    q = !1,              // hasLoggedGateFailure (one-shot)
    K = !1,              // inProgress
    _ = 0,              // turnsSinceLastExtraction
    z;                   // pendingContext (coalesce slot)
  async function A({ context: f, appendSystemMessage: O, isTrailingRun: M }) { /* runExtraction — §4 */ }
  async function Y(f, O) { /* executeExtractMemoriesImpl — below */ }
  ((y04 = async (f, O) => { let M = Y(f, O); H.add(M); try { await M; } finally { H.delete(M); } }),
   (h04 = async (f = 60000) => {
      if (H.size === 0) return;
      await Promise.race([Promise.all(H).catch(() => {}), new Promise((O) => setTimeout(O, f).unref())]);
   }));
}

// READABLE (for understanding):
function initExtractMemories() {
  const inFlightExtractions = new Set();   // H — promises still in flight (for drain)
  let lastMemoryMessageUuid;               // $ — cursor; extractions only look past this UUID
  let hasLoggedGateFailure = false;        // q — one-shot ant-only gate-disabled log
  let inProgress = false;                  // K — true while runExtraction runs (coalesce flag)
  let turnsSinceLastExtraction = 0;        // _ — throttle counter, reset after each run
  let pendingContext;                      // z — single trailing-run slot (overwritten on coalesce)

  async function runExtraction({ context, appendSystemMessage, isTrailingRun }) { /* §4 */ }
  async function executeExtractMemoriesImpl(replHookContext, appendSystemMessage) { /* below */ }

  extractor = async (ctx, append) => {                  // y04
    const p = executeExtractMemoriesImpl(ctx, append);
    inFlightExtractions.add(p);
    try { await p; } finally { inFlightExtractions.delete(p); }
  };
  drainer = async (timeoutMs = 60_000) => {             // h04
    if (inFlightExtractions.size === 0) return;
    await Promise.race([
      Promise.all(inFlightExtractions).catch(() => {}),
      new Promise(resolve => setTimeout(resolve, timeoutMs).unref()),  // .unref() so timer doesn't block exit
    ]);
  };
}

// Mapping: Bg_->initExtractMemories, H->inFlightExtractions, $->lastMemoryMessageUuid,
//          q->hasLoggedGateFailure, K->inProgress, _->turnsSinceLastExtraction, z->pendingContext,
//          A->runExtraction, Y->executeExtractMemoriesImpl, y04->extractor, h04->drainer
```

The captured state, by role:

- `inFlightExtractions` (`H`, Set) — every promise the extractor handed out that hasn't settled; lets `drainPendingExtraction` await them.
- `lastMemoryMessageUuid` (`$`) — **the cursor.** Each run only considers messages added *after* this UUID. Advanced on success and on the two content-based skips (§4).
- `hasLoggedGateFailure` (`q`) — one-shot flag so the ant-only `tengu_extract_memories_gate_disabled` telemetry fires at most once per process.
- `inProgress` (`K`) — true while `runExtraction` executes; this is the coalescing flag.
- `turnsSinceLastExtraction` (`_`) — throttle counter; incremented on each eligible (non-trailing) turn, reset to 0 when a run starts.
- `pendingContext` (`z`) — the *single* trailing-run slot. A turn arriving while extraction is in-flight overwrites it (§3.3).

**Why closure-scope rather than module-level state?** The 2.1.88 source comment (`extractMemories.ts:11-13`) is explicit: closure-scoping lets tests call `initExtractMemories()` in `beforeEach` to get a fresh cursor/throttle without resetting a global. It also makes the cursor un-leakable to other subsystems — only the two closures (`runExtraction`, `executeExtractMemoriesImpl`) can touch it.

### 3.2 Public entry — `executeExtractMemories` (`pg_`) + `drainPendingExtraction` (`Ug_`)

```javascript
// ============================================
// executeExtractMemories / drainPendingExtraction - Public API (no-op until init)
// Location: cli_inner_pretty.js:448380-448390
// ============================================

// ORIGINAL (for source lookup):
async function pg_(H, $) { await y04?.(H, $); }
async function Ug_(H) { await h04(H); }
var N04, T04, V04 = 3, y04 = null, h04 = async () => {};

// READABLE (for understanding):
async function executeExtractMemories(replHookContext, appendSystemMessage) {
  await extractor?.(replHookContext, appendSystemMessage);   // no-op until initExtractMemories() ran
}
async function drainPendingExtraction(timeoutMs) {
  await drainer(timeoutMs);
}
let pathMod, teamMem, MIN_USER_PROSE_TOKENS = 3, extractor = null, drainer = async () => {};

// Mapping: pg_->executeExtractMemories, Ug_->drainPendingExtraction,
//          y04->extractor, h04->drainer, V04->MIN_USER_PROSE_TOKENS,
//          N04->pathMod (basename), T04->teamMem (teamMemPaths)
```

The public functions are thin null-safe forwarders. Before `initExtractMemories()` runs, `extractor` is `null` and `drainer` is a no-op `async () => {}`, so the stop-hook calling `executeExtractMemories` early is harmless.

`drainPendingExtraction` exists for **`-p` / print mode**. Interactive REPL never needs it — the next user turn will re-fire and the fire-and-forget extraction finishes whenever. But `-p` exits after one query; without draining, the in-flight extraction (mid-LLM-call) would be killed by graceful shutdown's failsafe. The print path calls `drainPendingExtraction` *after* the response is flushed but *before* `gracefulShutdownSync`, with a **60-second** ceiling. The `Promise.race` against `setTimeout(...).unref()` is the key: `.unref()` lets the timer act purely as a ceiling — if all extractions settle early, the process exits immediately; the timer never *keeps* the process alive.

### 3.3 The coalescing design — `executeExtractMemoriesImpl` (inner `Y`)

```javascript
// ============================================
// executeExtractMemoriesImpl - Gate + coalesce into a single trailing slot
// Location: cli_inner_pretty.js:448353-448365
// ============================================

// ORIGINAL (for source lookup):
async function Y(f, O) {
  if (f.toolUseContext.agentId) return;
  if (!V$("tengu_passport_quail", !1)) return;
  if (!M1()) return;
  if (d6()) return;
  if (K) {
    (N("[extractMemories] extraction in progress — stashing for trailing run"),
      d("tengu_extract_memories_coalesced", {}),
      (z = { context: f, appendSystemMessage: O }));
    return;
  }
  await A({ context: f, appendSystemMessage: O });
}

// READABLE (for understanding):
async function executeExtractMemoriesImpl(replHookContext, appendSystemMessage) {
  if (replHookContext.toolUseContext.agentId) return;             // never inside a subagent
  if (!getFeatureValue("tengu_passport_quail", false)) return;    // master flag (also at call site)
  if (!isAutoMemoryEnabled()) return;                             // M1 — parent auto-memory gate
  if (isRemoteWorkspace()) return;                                // d6 — remote bridge owns its memory
  // Coalescing: if a run is already in flight, stash this context as the trailing run.
  // Overwrites any prior stash — only the newest context matters (it has the most messages).
  if (inProgress) {
    debugLog("[extractMemories] extraction in progress — stashing for trailing run");
    logEvent("tengu_extract_memories_coalesced", {});
    pendingContext = { context: replHookContext, appendSystemMessage };
    return;
  }
  await runExtraction({ context: replHookContext, appendSystemMessage });
}

// Mapping: Y->executeExtractMemoriesImpl, K->inProgress, z->pendingContext, A->runExtraction,
//          M1->isAutoMemoryEnabled, d6->isRemoteWorkspace
```

**What it does:** Re-checks the gates (defense in depth vs. the call-site `S88`), then either starts a run or coalesces into the trailing slot.

**How coalescing works:**
1. `isAutoMemoryEnabled` (`M1`) is the *parent* gate shared by all three writers — if auto-memory is off entirely, nothing extracts. `isRemoteWorkspace` (`d6`) excludes remote bridge contexts, which run their own memory protocol.
2. If `inProgress` is `false`, call `runExtraction` directly and await it.
3. If `inProgress` is `true`, **do not queue** — overwrite the single `pendingContext` slot with the *latest* context, emit `tengu_extract_memories_coalesced`, and return. When the in-flight run reaches its `finally`, it picks up `pendingContext` and runs exactly one trailing extraction (§4).

**Why a single overwriting slot instead of a queue:** This is a classic *single-flight + tail-call* pattern. Users can fire several turns in quick succession (type, hit enter, type again before the background extraction finished). If each turn enqueued its own extraction, you'd get N concurrent forked agents racing to write the same files — duplicate writes, wasted tokens, and possible `user-1.md`/`user-2.md` collisions. Coalescing caps concurrency at **2**: the one in flight, plus a single trailing run that covers *everything accumulated during the in-flight window*. Crucially, the latest context is the right one to keep — it has the most messages, and the trailing run computes its `newMessageCount` relative to the cursor the first run already advanced (so it only picks up the genuinely new tail, not the whole history).

## 4. runExtraction (`A`) — the skip ladder

`runExtraction` (inner `A`, cli_inner_pretty.js:448262-448351) is the heart. It runs a three-rung **skip ladder** before forking, in this exact order:

```javascript
// ============================================
// runExtraction (skip ladder) - Mutual-exclusion, prose, and throttle gates
// Location: cli_inner_pretty.js:448262-448287
// ============================================

// ORIGINAL (for source lookup):
async function A({ context: f, appendSystemMessage: O, isTrailingRun: M }) {
  let { messages: j } = f, w = TA(), D = Ig_(j, $);
  if (Cg_(j, $)) {                                          // [1] main-agent already wrote
    N("[extractMemories] skipping — conversation already wrote to memory files");
    let W = j.at(-1); if (W?.uuid) $ = W.uuid;              // ADVANCE cursor
    d("tengu_extract_memories_skipped_direct_write", { message_count: D });
    return;
  }
  if (!bg_(j, $)) {                                         // [2] no user prose
    N("[extractMemories] skipping — no user prose since last extraction");
    let W = j.at(-1); if (W?.uuid) $ = W.uuid;              // ADVANCE cursor
    d("tengu_extract_memories_skipped_no_prose", { message_count: D });
    return;
  }
  let J = T04.isTeamMemoryEnabled(), X = V$("tengu_bramble_lintel", null) ?? 1, L = cT8(w), P = sp(f);
  if (!M) { if ((_++, _ < X)) return; }                    // [3] throttle (NO cursor advance)
  ((_ = 0), (K = !0));
  // ... fork (§5) ...
}

// READABLE (for understanding):
async function runExtraction({ context, appendSystemMessage, isTrailingRun }) {
  const { messages } = context;
  const memoryDir = getAutoMemPath();
  const newMessageCount = countModelVisibleMessagesSince(messages, lastMemoryMessageUuid);

  // [1] Mutual exclusion: main agent already wrote a memory this range -> skip + advance cursor
  if (hasMemoryWritesSince(messages, lastMemoryMessageUuid)) {
    const last = messages.at(-1); if (last?.uuid) lastMemoryMessageUuid = last.uuid;
    logEvent("tengu_extract_memories_skipped_direct_write", { message_count: newMessageCount });
    return;
  }
  // [2] No substantive user prose since the cursor -> nothing to extract -> skip + advance cursor
  if (!hasUserProseSince(messages, lastMemoryMessageUuid)) {
    const last = messages.at(-1); if (last?.uuid) lastMemoryMessageUuid = last.uuid;
    logEvent("tengu_extract_memories_skipped_no_prose", { message_count: newMessageCount });
    return;
  }
  // [3] Throttle: run only every N eligible turns (tengu_bramble_lintel, default 1). NO cursor advance.
  const teamMemoryEnabled = teamMem.isTeamMemoryEnabled();
  const throttle = getFeatureValue("tengu_bramble_lintel", null) ?? 1;
  const canUseTool = createAutoMemCanUseTool(memoryDir);
  const cacheSafeParams = createCacheSafeParams(context);
  if (!isTrailingRun) {
    turnsSinceLastExtraction++;
    if (turnsSinceLastExtraction < throttle) return;
  }
  turnsSinceLastExtraction = 0;
  inProgress = true;
  // ... fork (§5) ...
}

// Mapping: A->runExtraction, j->messages, w->memoryDir, D->newMessageCount, $->lastMemoryMessageUuid,
//          Cg_->hasMemoryWritesSince, bg_->hasUserProseSince, Ig_->countModelVisibleMessagesSince,
//          T04->teamMem, cT8->createAutoMemCanUseTool, sp->createCacheSafeParams, _->turnsSinceLastExtraction,
//          K->inProgress, TA->getAutoMemPath, V$->getFeatureValue, M->isTrailingRun
```

The three rungs in order:

**Rung 1 — `hasMemoryWritesSince` (`Cg_`, cli_inner_pretty.js:448106).** Scans assistant messages after the cursor for any Edit/Write tool-use whose `file_path` is an auto-memory path (`getWrittenFilePath` `E04`@448233 extracts the path, `isAutoMemPath` `ng`@142185 tests it). If the **main agent** already wrote a memory this turn, the forked extraction is redundant — it would re-read the same conversation and likely write the same file. On a hit: emit `tengu_extract_memories_skipped_direct_write {message_count}` and **advance the cursor**.

**Rung 2 — `!hasUserProseSince` (`bg_`, cli_inner_pretty.js:448133).** A turn that added no *substantive user prose* has nothing to extract. "Prose" is `isUserProseMessage` (`k04`@448126): a non-meta `user` message whose text contains at least `MIN_USER_PROSE_TOKENS` (`V04`=3, cli_inner_pretty.js:448388) whitespace-separated tokens. This filters out single-word confirmations like `y` or `ok`. On a miss (no prose): emit `tengu_extract_memories_skipped_no_prose {message_count}` and **advance the cursor**.

**Rung 3 — throttle.** `turnsSinceLastExtraction` is incremented (only for non-trailing runs) and compared to `tengu_bramble_lintel` (default `1` — i.e. every eligible turn). If below the threshold, return **without advancing the cursor**.

### 4.1 Why the cursor advances on rungs 1-2 but NOT on the throttle skip

This asymmetry is the subtle, load-bearing decision in the ladder.

- **Rungs 1-2 advance the cursor because the messages are *handled*.** "Main agent already wrote" means those messages produced a memory — by the main agent, deliberately. "No user prose" means those messages contain nothing extractable. In both cases there is *nothing left for a future extraction to do* with that range. Advancing the cursor past them is correct and prevents the next run from re-examining settled ground (and, for rung 1, prevents the forked agent from later "updating" the memory the main agent just wrote — the mutual-exclusion contract).

- **The throttle skip does NOT advance because the messages are *deferred, not handled*.** Throttling says "I'm not extracting *right now* to save tokens" — but those messages still contain durable signal that *should* be extracted eventually. If the throttle skip advanced the cursor, the deferred messages would be permanently lost: the next eligible run would start from a cursor *past* them and never see them. So the throttle leaves the cursor put; on the next eligible turn `newMessageCount` includes the deferred range, and the eventual fork extracts everything since the last *successful* run.

**Key insight:** The cursor encodes "what has been *accounted for*", not "what has been *seen*". Content-based skips account for their range (handled or empty); the throttle merely postpones, so it must not advance. Getting this backwards would either drop memories (throttle advances) or re-extract handled ranges forever (rungs 1-2 don't advance).

## 5. The fork + success path

When all three rungs pass, `runExtraction` forks the sandboxed agent and processes the result.

```javascript
// ============================================
// runExtraction (fork + success) - Fork the sandboxed agent, emit telemetry, notify UI
// Location: cli_inner_pretty.js:448288-448352
// ============================================

// ORIGINAL (for source lookup, condensed):
let Z = Date.now();
try {
  let W = FV$(await UV$(w, C4().signal)),                  // existing-memory manifest
    G = Z04(D, W, J),                                       // extraction prompt
    V = await xZ({ promptMessages: [T8({ content: G })], cacheSafeParams: P, canUseTool: L,
                   querySource: "extract_memories", forkLabel: "extract_memories",
                   skipTranscript: !0, maxTurns: 5, skipCacheWrite: D$$() }),
    v = j.at(-1);
  if (v?.uuid) $ = v.uuid;                                  // advance cursor on success
  let E = mg_(V.messages),                                  // written paths (unique)
    S = H6(V.messages, (B) => B.type === "assistant"),      // turn count
    C = E.filter((B) => N04.basename(B) !== OX),            // drop MEMORY.md
    b = H6(C, T04.isTeamMemPath);
  d("tengu_extract_memories_extraction", { input_tokens: V.totalUsage.input_tokens, /* ...cache... */
     message_count: D, turn_count: S, files_written: E.length, memories_saved: C.length,
     team_memories_saved: b, duration_ms: Date.now() - Z });
  if (C.length > 0) { let B = CT8(C); ((B.teamCount = b), O?.(B)); }   // notify UI
  SH("memory_extract");
} catch (W) {
  (d("tengu_extract_memories_error", { duration_ms: Date.now() - Z }), uH("memory_extract", "agent_error"));
} finally {
  K = !1;
  let W = z; if (((z = void 0), W && X <= 1))
    await A({ context: W.context, appendSystemMessage: W.appendSystemMessage, isTrailingRun: !0 });  // trailing run
}

// READABLE (for understanding):
const startTime = Date.now();
try {
  const existingMemories = formatMemoryManifest(await scanMemoryFiles(memoryDir, createAbortController().signal));
  const userPrompt = buildExtractionPrompt(newMessageCount, existingMemories, teamMemoryEnabled);
  const result = await runForkedAgent({
    promptMessages: [createUserMessage({ content: userPrompt })],
    cacheSafeParams, canUseTool,
    querySource: "extract_memories", forkLabel: "extract_memories",
    skipTranscript: true,          // don't pollute the main transcript with the subagent's chatter
    maxTurns: 5,                    // hard cap — well-behaved runs finish in 2-4 turns
    skipCacheWrite: shouldSkipCacheWrite(),
  });
  const last = messages.at(-1); if (last?.uuid) lastMemoryMessageUuid = last.uuid;   // advance on success
  const writtenPaths = extractWrittenPaths(result.messages);
  const turnCount = count(result.messages, m => m.type === "assistant");
  const memoryPaths = writtenPaths.filter(p => pathMod.basename(p) !== ENTRYPOINT_NAME);  // drop MEMORY.md
  const teamCount = count(memoryPaths, teamMem.isTeamMemPath);
  logEvent("tengu_extract_memories_extraction", {
    input_tokens: result.totalUsage.input_tokens, output_tokens: result.totalUsage.output_tokens,
    cache_read_input_tokens: result.totalUsage.cache_read_input_tokens,
    cache_creation_input_tokens: result.totalUsage.cache_creation_input_tokens,
    message_count: newMessageCount, turn_count: turnCount,
    files_written: writtenPaths.length, memories_saved: memoryPaths.length,
    team_memories_saved: teamCount, duration_ms: Date.now() - startTime,
  });
  if (memoryPaths.length > 0) {
    const msg = createMemorySavedMessage(memoryPaths);   // CT8 — UI renders "Saved N memories"
    msg.teamCount = teamCount;
    appendSystemMessage?.(msg);
  }
  recordSuccess("memory_extract");
} catch (error) {
  logEvent("tengu_extract_memories_error", { duration_ms: Date.now() - startTime });
  recordFailureMetric("memory_extract", "agent_error");
} finally {
  inProgress = false;
  const trailing = pendingContext; pendingContext = undefined;
  if (trailing && throttle <= 1) {
    await runExtraction({ context: trailing.context, appendSystemMessage: trailing.appendSystemMessage, isTrailingRun: true });
  }
}

// Mapping: xZ->runForkedAgent, UV$->scanMemoryFiles, FV$->formatMemoryManifest, Z04->buildExtractionPrompt,
//          T8->createUserMessage, sp->createCacheSafeParams, mg_->extractWrittenPaths, E04->getWrittenFilePath,
//          N04.basename->path.basename, OX->ENTRYPOINT_NAME ("MEMORY.md"), CT8->createMemorySavedMessage,
//          D$$->shouldSkipCacheWrite, SH->recordSuccess, uH->recordFailureMetric, X->throttle
```

**How the success path works, step by step:**

1. **Build the manifest.** `scanMemoryFiles` + `formatMemoryManifest` produce a Markdown listing of files already on disk (with frontmatter). This is injected into the prompt *before* the agent's first tool call, so it never spends a turn on `ls` and knows whether to update vs. create. (Placed *after* the throttle gate so skipped turns don't pay the scan cost.)
2. **Build the prompt** via `buildExtractionPrompt` (`Z04`, §7).
3. **Fork** via `runForkedAgent` with: the shared `canUseTool` sandbox (`createAutoMemCanUseTool`, §6), `cacheSafeParams` so the fork shares the parent's prompt cache, `skipTranscript: true`, `maxTurns: 5`, `forkLabel: "extract_memories"`.
4. **Advance the cursor** to the last message (only on success — see error path below).
5. **Collect written paths** via `extractWrittenPaths` (`mg_`@448242 → `getWrittenFilePath` `E04`@448233), uniqued.
6. **Drop `MEMORY.md`** from the *memories-saved* count: `memoryPaths = writtenPaths.filter(p => basename(p) !== ENTRYPOINT_NAME)`. The index file is mechanical bookkeeping — the user-visible "memory" is the topic file. `files_written` still counts everything (including the index touch); `memories_saved` counts only topic files.
7. **Emit `tengu_extract_memories_extraction`** with input/output/cache token counts, `message_count`, `turn_count`, `files_written`, `memories_saved`, `team_memories_saved`, and `duration_ms` (cli_inner_pretty.js:448320).
8. **Notify the UI** — if any topic memories were saved, build a `memory_saved` system message via `createMemorySavedMessage` (`CT8`@445955), patch its `teamCount`, and `appendSystemMessage` it. The UI renders this as "Saved N memories" (see §5.1).
9. **Error path:** a throw emits `tengu_extract_memories_error {duration_ms}` (cli_inner_pretty.js:448343) and records a failure metric — **without advancing the cursor**, so the next extraction reconsiders the same range (trading double-work on the next turn against silently dropping memories on a transient error).
10. **Trailing run:** in `finally`, clear `inProgress`, take `pendingContext`, and if a context was stashed *and* `throttle <= 1`, run exactly one trailing extraction with `isTrailingRun: true`. (Gating on `throttle <= 1` means a higher throttle suppresses the trailing run — otherwise the trailing run would defeat throttling.)

### 5.1 The save message — `createMemorySavedMessage` (`CT8`)

```javascript
// ============================================
// createMemorySavedMessage - The system message that drives the "Saved N memories" pill
// Location: cli_inner_pretty.js:445955-445963
// ============================================

// ORIGINAL (for source lookup):
function CT8(H) {
  return {
    type: "system", subtype: "memory_saved", writtenPaths: H,
    timestamp: new Date().toISOString(), uuid: Wk.randomUUID(), isMeta: !1,
  };
}

// READABLE (for understanding):
function createMemorySavedMessage(writtenPaths) {
  return {
    type: "system", subtype: "memory_saved", writtenPaths,
    timestamp: new Date().toISOString(), uuid: crypto.randomUUID(), isMeta: false,
  };
}

// Mapping: CT8->createMemorySavedMessage, Wk->crypto, H->writtenPaths
```

The extractor's entire contract with the UI is *one* call: `appendSystemMessage(createMemorySavedMessage(memoryPaths))` (with `teamCount` patched on). The renderer maps `subtype: "memory_saved"` to the `MemoryUpdateNotification` component, which shows "Saved N memories" plus a collapsible file list. This is the *same* message factory auto-dream reuses (it patches `verb: "Improved"` instead of the default "Saved") — see [auto_dream_runtime.md](./auto_dream_runtime.md).

## 6. The tool sandbox — `createAutoMemCanUseTool` (`cT8`)

This is the security chokepoint for **both** background writers. The extraction subagent and the auto-dream subagent fork with the *same* `canUseTool` returned by `createAutoMemCanUseTool(memoryDir)`. **This document is its canonical home;** [auto_dream_runtime.md](./auto_dream_runtime.md) references it back here.

```javascript
// ============================================
// createAutoMemCanUseTool - Strict tool allow-list for the forked memory agents
// Location: cli_inner_pretty.js:448200-448231
// ============================================

// ORIGINAL (for source lookup):
function cT8(H) {
  return async ($, q) => {
    if (XR()) return dT8($, "Memory is toggled off. Run /toggle-memory to re-enable automemory.");
    if ($.name === oO) return { behavior: "allow", updatedInput: q };
    if ($.name === HK || $.name === s1 || $.name === S_) return { behavior: "allow", updatedInput: q };
    if ($.name === gq || $.name === BK) {
      let _ = $.inputSchema.safeParse(q);
      if (_.success) {
        if ($.isReadOnly(_.data)) return { behavior: "allow", updatedInput: q };
        let Y = _.data.command;
        if (typeof Y === "string") {
          if ($.name === gq ? await ug_(Y) : xg_(Y)) return { behavior: "allow", updatedInput: q };
        }
      }
      let z = $.name === gq;
      return dT8($, `Only read-only shell commands and ${z ? "rm" : "Remove-Item"} with all paths inside ${H} are permitted in this context (...)`);
    }
    if (($.name === l7 || $.name === B9) && "file_path" in q) {
      if ($.name === l7 && _D())
        return dT8($, `${l7} is not permitted in tiny memory mode — memories are immutable, so delete via ${K1() ? "Bash rm" : "PowerShell Remove-Item"} and rewrite via ${B9}.`);
      let _ = q.file_path;
      if (typeof _ === "string" && _.endsWith(".md") && bM$(_)) return { behavior: "allow", updatedInput: q };
    }
    let K = K1() ? gq : BK;
    return dT8($, `only ${HK}, ${s1}, ${S_}, read-only ${K}, and ${l7}/${B9} within ${H} are allowed`);
  };
}

// READABLE (for understanding):
function createAutoMemCanUseTool(memoryDir) {
  return async (tool, input) => {
    // [1] /toggle-memory off -> deny everything immediately
    if (isMemoryToggledOff()) {
      return denyAutoMemTool(tool, "Memory is toggled off. Run /toggle-memory to re-enable automemory.");
    }
    // [2] REPL -> allow (REPL re-invokes this validator for each inner primitive)
    if (tool.name === REPL_TOOL_NAME) return { behavior: "allow", updatedInput: input };
    // [3] Read/Grep/Glob -> allow unrestricted (inherently read-only)
    if (tool.name === ReadToolName || tool.name === GrepToolName || tool.name === GlobToolName) {
      return { behavior: "allow", updatedInput: input };
    }
    // [4] Bash/PowerShell
    if (tool.name === BashToolName || tool.name === PowerShellToolName) {
      const parsed = tool.inputSchema.safeParse(input);
      if (parsed.success) {
        if (tool.isReadOnly(parsed.data)) return { behavior: "allow", updatedInput: input };  // [4a] read-only cmds
        const cmd = parsed.data.command;
        if (typeof cmd === "string") {                                                          // [4b] rm/.md delete
          const okDelete = tool.name === BashToolName ? await validatePosixMemoryRm(cmd) : validatePowerShellRemoveItem(cmd);
          if (okDelete) return { behavior: "allow", updatedInput: input };
        }
      }
      const isPosixTool = tool.name === BashToolName;
      return denyAutoMemTool(tool, `Only read-only shell commands and ${isPosixTool ? "rm" : "Remove-Item"} with all paths inside ${memoryDir} are permitted in this context (...)`);
    }
    // [5] Edit/Write
    if ((tool.name === EditToolName || tool.name === WriteToolName) && "file_path" in input) {
      if (tool.name === EditToolName && isTinyMemoryEnabled()) {                                 // tiny: deny Edit
        return denyAutoMemTool(tool, `${EditToolName} is not permitted in tiny memory mode — memories are immutable, so delete via ${isPosixOS() ? "Bash rm" : "PowerShell Remove-Item"} and rewrite via ${WriteToolName}.`);
      }
      const fp = input.file_path;
      if (typeof fp === "string" && fp.endsWith(".md") && isAutoMemPathExceptEntrypoint(fp)) {   // inside memoryDir, not MEMORY.md
        return { behavior: "allow", updatedInput: input };
      }
    }
    // [6] default deny
    const shellName = isPosixOS() ? BashToolName : PowerShellToolName;
    return denyAutoMemTool(tool, `only ${ReadToolName}, ${GrepToolName}, ${GlobToolName}, read-only ${shellName}, and ${EditToolName}/${WriteToolName} within ${memoryDir} are allowed`);
  };
}

// Mapping: cT8->createAutoMemCanUseTool, XR->isMemoryToggledOff, dT8->denyAutoMemTool,
//          oO->REPL_TOOL_NAME, HK->ReadToolName, s1->GrepToolName, S_->GlobToolName,
//          gq->BashToolName, BK->PowerShellToolName, l7->EditToolName, B9->WriteToolName,
//          ug_->validatePosixMemoryRm, xg_->validatePowerShellRemoveItem,
//          bM$->isAutoMemPathExceptEntrypoint, _D->isTinyMemoryEnabled, K1->isPosixOS
```

**The rule ladder in precedence order:**

1. **Toggle short-circuit (`isMemoryToggledOff` `XR`@2799, reads `d$.memoryToggledOff`).** If the user ran `/toggle-memory off` this session, **deny everything** before any other check. This is the cheapest, highest-priority rule: a single boolean read disables the whole sandbox.
2. **REPL → allow.** When REPL mode is on (ant-default), the primitive tools (Read/Bash/Edit/Write) are hidden and the agent calls REPL instead. REPL's VM re-invokes *this same* `canUseTool` for each inner primitive, so the gating below still applies to the real operations. Allowing REPL here (rather than giving the fork a different tool list) keeps the tool list identical to the parent — essential for prompt-cache sharing (tools are part of the cache key).
3. **Read/Grep/Glob → allow unrestricted.** All inherently read-only; the agent needs them to inspect existing memories and the conversation.
4. **Bash/PowerShell** — narrow gate: (a) if `tool.isReadOnly(parsed)` (ls/find/cat/stat/wc/head/tail and the PowerShell equivalents) → allow; (b) else if the command is a *validated* `rm`/`Remove-Item` of `*.md` files inside `memoryDir` (via the bespoke validators, §6.1) → allow; (c) else **deny**.
5. **Edit/Write** — (a) **tiny-mode denies Edit** (`isTinyMemoryEnabled` `_D`@142142): tiny memories are immutable single-fact files, so the agent must delete-and-recreate rather than edit in place; (b) otherwise allow Edit/Write only if `file_path` ends in `.md` **and** `isAutoMemPathExceptEntrypoint` (`bM$`@142188) — i.e. the path normalizes to inside `memoryDir` and is not a reserved/entrypoint name. (The `.endsWith(".md")` check is at the call site; `bM$` itself just does the directory-membership-minus-entrypoint test.)
6. **Default → deny.** Anything not matched above (MCP tools, Agent/Task, write-capable shell, paths outside `memoryDir`) is denied with a message naming the allowed set.

Every deny routes through `denyAutoMemTool` (`dT8`@448145), which debug-logs and emits `tengu_auto_mem_tool_denied {tool_name}` (the name sanitized for analytics):

```javascript
// ============================================
// denyAutoMemTool - Deny factory: logs + emits tengu_auto_mem_tool_denied
// Location: cli_inner_pretty.js:448145-448150
// ============================================

// ORIGINAL (for source lookup):
function dT8(H, $) {
  return (N(`[autoMem] denied ${H.name}: ${$}`), d("tengu_auto_mem_tool_denied", { tool_name: p7(H.name) }),
    { behavior: "deny", message: $, decisionReason: { type: "other", reason: $ } });
}

// READABLE (for understanding):
function denyAutoMemTool(tool, reason) {
  debugLog(`[autoMem] denied ${tool.name}: ${reason}`);
  logEvent("tengu_auto_mem_tool_denied", { tool_name: sanitizeToolNameForAnalytics(tool.name) });
  return { behavior: "deny", message: reason, decisionReason: { type: "other", reason } };
}

// Mapping: dT8->denyAutoMemTool, p7->sanitizeToolNameForAnalytics, N->debugLog, d->logEvent
```

### 6.1 The two shell-delete validators

A delete needs a *bespoke parser* rather than a blanket "allow rm in memoryDir" — because shell is hostile. A blanket allow would let `rm -rf /`, `rm $HOME/*.md`, `rm a.md > /etc/passwd`, glob expansion, command substitution, or path traversal through the model's command string. The validators reduce the attack surface to exactly one safe shape: *delete one or more absolute `.md` files inside `memoryDir`, with no flags that recurse, no redirects, no env-vars, no shell metacharacters.*

```javascript
// ============================================
// validatePosixMemoryRm - Allow only `rm <safe-flags> /abs/path.md ...` inside memoryDir
// Location: cli_inner_pretty.js:448169-448198
// ============================================

// ORIGINAL (for source lookup):
async function ug_(H) {
  let $ = await wlH(H);
  if ($.kind !== "simple") return !1;
  if ($.commands.length !== 1) return !1;
  let q = $.commands[0];
  if (!q) return !1;
  if (q.argv[0] !== "rm") return !1;
  if (q.redirects.length > 0) return !1;
  if (q.envVars.length > 0) return !1;
  let K = 0, _ = !1;
  for (let z = 1; z < q.argv.length; z++) {
    let A = q.argv[z];
    if (A === void 0) continue;
    if (!_) {
      if (A === "--") { _ = !0; continue; }
      if (A.startsWith("-")) { if (A === "--recursive" || /^-[a-zA-Z]*[rR]/.test(A)) return !1; continue; }
    }
    if (/[*?[]/.test(A)) return !1;
    if (!A.startsWith("/") || !A.endsWith(".md")) return !1;
    if (!ng(A)) return !1;
    K++;
  }
  return K > 0;
}

// READABLE (for understanding):
async function validatePosixMemoryRm(command) {
  const parsed = await parseShellCommand(command);          // the canonical shell AST parser
  if (parsed.kind !== "simple") return false;               // no pipelines/&&/||/subshells
  if (parsed.commands.length !== 1) return false;           // exactly one command
  const cmd = parsed.commands[0];
  if (!cmd || cmd.argv[0] !== "rm") return false;           // must be `rm`
  if (cmd.redirects.length > 0) return false;               // no `> file`, `>>`, etc.
  if (cmd.envVars.length > 0) return false;                 // no `FOO=bar rm ...`
  let matched = 0, afterDoubleDash = false;
  for (let i = 1; i < cmd.argv.length; i++) {
    const arg = cmd.argv[i];
    if (arg === undefined) continue;
    if (!afterDoubleDash) {
      if (arg === "--") { afterDoubleDash = true; continue; }
      if (arg.startsWith("-")) {
        if (arg === "--recursive" || /^-[a-zA-Z]*[rR]/.test(arg)) return false;   // NO recursive
        continue;                                                                  // other flags (e.g. -f) tolerated
      }
    }
    if (/[*?[]/.test(arg)) return false;                    // no glob chars in a path arg
    if (!arg.startsWith("/") || !arg.endsWith(".md")) return false;   // absolute .md only
    if (!isAutoMemPath(arg)) return false;                  // inside memoryDir only
    matched++;
  }
  return matched > 0;                                        // at least one valid target
}

// Mapping: ug_->validatePosixMemoryRm, wlH->parseShellCommand (canonical AST), ng->isAutoMemPath
```

The POSIX validator leans on the canonical shell AST parser (`parseShellCommand` `wlH`) to *structurally* reject anything that isn't a single simple `rm` — pipelines, `&&`/`||`, subshells, redirects, and env-var prefixes are all rejected by AST shape before any path is even looked at. Then per-argument: reject `--recursive`/`-r`/`-R` (delete must not recurse into directories), reject glob metacharacters, require an absolute path ending in `.md`, and require `isAutoMemPath` (inside `memoryDir`). At least one valid target must be present.

```javascript
// ============================================
// validatePowerShellRemoveItem - Allow only Remove-Item (+aliases) of .md inside memoryDir
// Location: cli_inner_pretty.js:448152-448167
// ============================================

// ORIGINAL (for source lookup):
function xg_(H) {
  let $ = H.trim().match(/"[^"]*"|'[^']*'|\S+/g) ?? [];
  if ($.length < 2) return !1;
  if (!/^(remove-item|ri|del|erase|rd|rm|rmdir)$/i.test($[0])) return !1;
  let q = 0;
  for (let K = 1; K < $.length; K++) {
    let _ = $[K];
    if (/^-(?:Literal)?Path$/i.test(_)) continue;
    if (_.startsWith("-")) return !1;
    let z = (_.startsWith('"') && _.endsWith('"')) || (_.startsWith("'") && _.endsWith("'")) ? _.slice(1, -1) : _;
    if (/[*?[\]$`(){}|;&<>"',]/.test(z)) return !1;
    if (!z.endsWith(".md")) return !1;
    if (!ng(z)) return !1;
    q++;
  }
  return q > 0;
}

// READABLE (for understanding):
function validatePowerShellRemoveItem(command) {
  const tokens = command.trim().match(/"[^"]*"|'[^']*'|\S+/g) ?? [];   // quote-aware tokenizer
  if (tokens.length < 2) return false;
  if (!/^(remove-item|ri|del|erase|rd|rm|rmdir)$/i.test(tokens[0])) return false;   // cmdlet or alias
  let matched = 0;
  for (let i = 1; i < tokens.length; i++) {
    const tok = tokens[i];
    if (/^-(?:Literal)?Path$/i.test(tok)) continue;        // -Path / -LiteralPath flag — skip
    if (tok.startsWith("-")) return false;                 // any OTHER flag (e.g. -Recurse) -> reject
    const unq = isQuoted(tok) ? tok.slice(1, -1) : tok;
    if (/[*?[\]$`(){}|;&<>"',]/.test(unq)) return false;   // no metachars / wildcards / injection
    if (!unq.endsWith(".md")) return false;                // .md only
    if (!isAutoMemPath(unq)) return false;                 // inside memoryDir only
    matched++;
  }
  return matched > 0;
}

// Mapping: xg_->validatePowerShellRemoveItem, ng->isAutoMemPath
```

PowerShell has no canonical AST parser available here, so it hand-rolls a quote-aware tokenizer. It accepts `Remove-Item` and its aliases (`ri`, `del`, `erase`, `rd`, `rm`, `rmdir`), permits only the `-Path`/`-LiteralPath` flags (any other flag — notably `-Recurse` — rejects the whole command), unquotes each path, rejects shell/PowerShell metacharacters and wildcards (`* ? [ ] $ \` ( ) { } | ; & < > " ' ,`), and requires `.md` inside `memoryDir`.

**Why a delete needs a bespoke parser instead of a blanket allow:** Delete is the *only* destructive operation the sandbox permits, and the agent's command string is model-generated — it must be treated as untrusted. A blanket "allow `rm` in memoryDir" check on a substring would be trivially bypassed: `rm -rf ~ # .md` (comment), `rm a.md; rm -rf /` (chaining), `rm $(echo /etc/passwd)` (substitution), `rm *.md` then symlink games, or a redirect `rm x.md > /important`. The two validators close all of these by (POSIX) parsing to an AST and rejecting any non-simple shape, or (PowerShell) tokenizing quote-aware and rejecting every metacharacter and every flag except the path flags. The whitelist is *positive*: the command must match the one safe shape exactly, or it is denied. This is the right posture for a security boundary — deny by default, allow one narrow proven-safe form.

## 7. The extraction prompt — `buildExtractionPrompt` (`Z04`)

```javascript
// ============================================
// buildExtractionPrompt - The user prompt sent to the forked extraction subagent
// Location: cli_inner_pretty.js:448027-448071
// ============================================

// ORIGINAL (for source lookup):
function Z04(H, $, q) {
  let K = K1(), _ = K ? gq : BK,
    z = K ? "ls/find/cat/stat/wc/head/tail and similar" : "Get-ChildItem/Get-Content/Select-Object -First/-Last and similar",
    A = K ? "rm" : "Remove-Item",
    Y = _D(),
    f = Y ? `Check this list before writing — if the fact is already covered, skip it; if a memory has gone stale, ${A} it and write a fresh single-fact memory in its place. Never edit memories in-place.`
          : "Check this list before writing — update an existing file rather than creating a duplicate.",
    O = $.length > 0 ? `\n\n## Existing memory files\n\n${$}\n\n${f}` : "",
    M = q ? "scope guidance, " : "",
    j = Y ? `Available tools: ${HK}, ${s1}, ${S_}, read-only ${_} (${z}), ${B9} for paths inside the memory directory only, and ${_} ${A} with paths inside the memory directory only. ${l7} is not permitted — memories are immutable, so delete-and-recreate replaces in-place edits. All other tools — MCP, Agent, write-capable ${_}, etc — will be denied.`
          : `Available tools: ${HK}, ${s1}, ${S_}, read-only ${_} (${z}), and ${l7}/${B9} for paths inside the memory directory only, and ${_} ${A} with paths inside the memory directory only. All other tools — MCP, Agent, write-capable ${_}, etc — will be denied.`,
    w = Y ? `You have a limited turn budget. Issue all ${B9} and ${A} calls in parallel in a single turn — there is no read-then-edit dance, since memories are immutable.`
          : `You have a limited turn budget. ${l7} requires a prior ${HK} of the same file, so the efficient strategy is: turn 1 — issue all ${HK} calls in parallel for every file you might update; turn 2 — issue all ${B9}/${l7} calls in parallel. Do not interleave reads and writes across multiple turns.`;
  return [
    `You are now acting as the memory extraction subagent. Analyze the most recent ~${H} messages above and use them to update your persistent memory systems.`,
    "", j, "", w, "",
    `You MUST only use content from the last ~${H} messages to update your persistent memories. Do not waste any turns attempting to investigate or verify that content further — no grepping source files, no reading code to confirm a pattern exists, no git commands.` + O,
    "", "If nothing is worth saving, output only 'Nothing to save.' Do not explain why.",
    "", "If the user explicitly asks you to remember something, save it immediately as whichever type fits best. If they ask you to forget something, find and remove the relevant entry.",
    "", `Apply the memory types, ${M}what-not-to-save criteria, and frontmatter format from the Memory section of your system prompt — it is already in your context above.`,
  ].join("\n");
}

// READABLE (for understanding):
function buildExtractionPrompt(newMessageCount, existingMemories, teamMemoryEnabled) {
  const isPosix = isPosixOS();
  const shell = isPosix ? BashToolName : PowerShellToolName;
  const readOnlyExamples = isPosix ? "ls/find/cat/stat/wc/head/tail and similar"
                                   : "Get-ChildItem/Get-Content/Select-Object -First/-Last and similar";
  const deleteCmd = isPosix ? "rm" : "Remove-Item";
  const isTiny = isTinyMemoryEnabled();
  const checkLine = isTiny
    ? `Check this list before writing — if the fact is already covered, skip it; if a memory has gone stale, ${deleteCmd} it and write a fresh single-fact memory in its place. Never edit memories in-place.`
    : "Check this list before writing — update an existing file rather than creating a duplicate.";
  const manifestBlock = existingMemories.length > 0 ? `\n\n## Existing memory files\n\n${existingMemories}\n\n${checkLine}` : "";
  const scopeGuidance = teamMemoryEnabled ? "scope guidance, " : "";
  const toolsLine = isTiny ? /* tiny: Write only, no Edit, rm/Remove-Item allowed */ ... : /* full: Edit/Write both */ ...;
  const turnStrategy = isTiny
    ? `You have a limited turn budget. Issue all ${WriteToolName} and ${deleteCmd} calls in parallel in a single turn — there is no read-then-edit dance, since memories are immutable.`
    : `You have a limited turn budget. ${EditToolName} requires a prior ${ReadToolName} of the same file, so the efficient strategy is: turn 1 — issue all ${ReadToolName} calls in parallel for every file you might update; turn 2 — issue all ${WriteToolName}/${EditToolName} calls in parallel. Do not interleave reads and writes across multiple turns.`;
  return [ /* opener, toolsLine, turnStrategy, scope-restriction line + manifestBlock, "Nothing to save.", explicit remember/forget, "Apply the memory types, ${scopeGuidance}..." ].join("\n");
}

// Mapping: Z04->buildExtractionPrompt, K1->isPosixOS, gq->BashToolName, BK->PowerShellToolName,
//          _D->isTinyMemoryEnabled, HK->ReadToolName, s1->GrepToolName, S_->GlobToolName,
//          l7->EditToolName, B9->WriteToolName; H->newMessageCount, $->existingMemories, q->teamMemoryEnabled
```

The prompt has **three orthogonal branches**, each a single conditional:

1. **OS branch (`isPosixOS` `K1`@216267).** Names POSIX tools (`Bash`, `rm`, "ls/find/cat/...") on macOS/Linux, or Windows tools (`PowerShell`, `Remove-Item`, "Get-ChildItem/Get-Content/...") otherwise. This keeps the agent issuing commands the `canUseTool` validators (§6.1) will actually accept.
2. **Tiny vs. full branch (`isTinyMemoryEnabled` `_D`@142142).** *Full:* Edit is available; the prompt teaches the read-then-edit dance — "turn 1 — issue all Read calls in parallel for every file you might update; turn 2 — issue all Write/Edit calls in parallel." *Tiny:* no Edit ("memories are immutable, so delete-and-recreate replaces in-place edits"); all writes/deletes go in *one* parallel turn because there is no read-edit dependency. This mirrors the sandbox: tiny-mode `canUseTool` denies Edit (§6, rung 5a), so the prompt must not instruct the agent to use it.
3. **Team vs. auto-only branch (`teamMemoryEnabled`).** Inserts `"scope guidance, "` into the final "Apply the memory types, ... what-not-to-save criteria" line so the agent knows the system prompt carries team-specific routing.

**Load-bearing verbatim lines** (cli_inner_pretty.js:448056-448069):
- *"You are now acting as the memory extraction subagent. Analyze the most recent ~${newMessageCount} messages above and use them to update your persistent memory systems."* — the role pivot; tells the forked agent it is no longer Claude Code answering the user.
- *"You MUST only use content from the last ~${newMessageCount} messages ... no grepping source files, no reading code to confirm a pattern exists, no git commands."* — a hard scope restriction that keeps the extraction cheap and on-topic (no rabbit-holes).
- *"If nothing is worth saving, output only 'Nothing to save.' Do not explain why."* — the no-op escape; most turns save nothing, and this prevents the agent from wasting tokens narrating non-decisions.
- *"If the user explicitly asks you to remember something, save it immediately ... If they ask you to forget something, find and remove the relevant entry."* — explicit remember/forget handling.
- *"Apply the memory types, ${scopeGuidance}what-not-to-save criteria, and frontmatter format from the Memory section of your system prompt — it is already in your context above."* — defers the full taxonomy to the system prompt (shared via the cache), keeping this user prompt small.

**The "Existing memory files" manifest (`existingMemories`)** is the directory listing built in §5 (step 1). Embedding it *before* the first tool call means the agent never spends a turn on `ls` and has the "do I update or create?" context up front — directly supporting the limited turn budget.

**Why this is one builder with three booleans** rather than several builders: see §9 — 2.1.88 had two separate builders (`buildExtractAutoOnlyPrompt` `prompts.ts:50`, `buildExtractCombinedPrompt` `prompts.ts:101`). 2.1.156 collapsed them into `Z04` because, once the save procedure moved out of the prompt (next note), the only remaining team-vs-auto difference is the single inserted `"scope guidance, "` phrase.

**The 2.1.156 prompt is leaner than 2.1.88's — the in-prompt "How to save" instructions were removed.** This is the most behaviorally significant change to the extraction prompt, and it is easy to miss because the obfuscated `Z04` *looks* like a faithful transliteration. In 2.1.88 the third parameter to *both* extraction-prompt builders was `skipIndex` (a boolean), and each builder emitted a multi-line `howToSave` block **inside the extraction prompt itself** — verbatim *"Saving a memory is a two-step process: **Step 1** — write the memory to its own file … **Step 2** — add a pointer to that file in `MEMORY.md` …"* (`prompts.ts:55-92` auto-only, `:114-152` combined), with `skipIndex=true` collapsing it to the one-step form. In 2.1.156's `Z04` (the full source is in the code block above) there is **no `howToSave` block and no `skipIndex` parameter** — the third parameter `q` is repurposed to `teamMemoryEnabled`, and the prompt ends by *delegating* the entire save procedure to the system prompt: *"Apply the memory types, …what-not-to-save criteria, and frontmatter format from the Memory section of your system prompt — it is already in your context above."* (cli_inner_pretty.js:448069).

The `skipIndex` / `tengu_moth_copse` mechanism did **not** disappear from the product — it moved. It now lives once, centrally, in the memdir builder `buildMemoryLines` (`eM6`), which the dispatcher reads via `V$("tengu_moth_copse", !1)` (cli_inner_pretty.js:145059, plus 220461 / 413403; see [memdir_core.md](./memdir_core.md) §5). So the **single source of truth for "how to save"** is the system prompt's Memory section, and the forked extractor — which already has that system prompt in its context — no longer restates it. The trade-off: the 2.1.156 extraction prompt is cheaper (fewer tokens per fork) and cannot drift out of sync with the canonical save instructions, at the cost that the extraction prompt is no longer self-contained when read in isolation.

**Verbatim assembled prompt (POSIX, full/non-tiny, no team, with an existing-memory manifest).** This is what the forked extractor actually receives for the most common configuration (`isPosixOS`=true, `isTinyMemoryEnabled`=false, `teamMemoryEnabled`=false), with `${newMessageCount}` shown as `N`:

```text
You are now acting as the memory extraction subagent. Analyze the most recent ~N messages above and use them to update your persistent memory systems.

Available tools: Read, Grep, Glob, read-only Bash (ls/find/cat/stat/wc/head/tail and similar), and Edit/Write for paths inside the memory directory only, and Bash rm with paths inside the memory directory only. All other tools — MCP, Agent, write-capable Bash, etc — will be denied.

You have a limited turn budget. Edit requires a prior Read of the same file, so the efficient strategy is: turn 1 — issue all Read calls in parallel for every file you might update; turn 2 — issue all Write/Edit calls in parallel. Do not interleave reads and writes across multiple turns.

You MUST only use content from the last ~N messages to update your persistent memories. Do not waste any turns attempting to investigate or verify that content further — no grepping source files, no reading code to confirm a pattern exists, no git commands.

## Existing memory files

<directory listing of memoryDir>

Check this list before writing — update an existing file rather than creating a duplicate.

If nothing is worth saving, output only 'Nothing to save.' Do not explain why.

If the user explicitly asks you to remember something, save it immediately as whichever type fits best. If they ask you to forget something, find and remove the relevant entry.

Apply the memory types, what-not-to-save criteria, and frontmatter format from the Memory section of your system prompt — it is already in your context above.
```

In **tiny** mode the tools line drops `Edit` ("`Edit` is not permitted — memories are immutable, so delete-and-recreate replaces in-place edits"), the turn-budget line becomes "Issue all `Write` and `rm` calls in parallel in a single turn — there is no read-then-edit dance," and the manifest's check line becomes "if a memory has gone stale, `rm` it and write a fresh single-fact memory in its place." In **team** mode the final line gains `"scope guidance, "` (→ "Apply the memory types, scope guidance, what-not-to-save criteria, …"). On **Windows**, `Bash`→`PowerShell`, `rm`→`Remove-Item`, and the read-only examples become `Get-ChildItem/Get-Content/Select-Object`. Note that even here — across all branches — the prompt never re-teaches the frontmatter/two-step save format; that always defers to the system prompt.

## 8. Cursor helpers

The cursor (`lastMemoryMessageUuid`) is what makes "messages since last extraction" robust against compaction. Two helpers read it.

```javascript
// ============================================
// isModelVisibleMessage / countModelVisibleMessagesSince - Cursor-relative count with compaction fallback
// Location: cli_inner_pretty.js:448089-448105
// ============================================

// ORIGINAL (for source lookup):
function Ci6(H) { return H.type === "user" || H.type === "assistant"; }
function Ig_(H, $) {
  if ($ === null || $ === void 0) return H6(H, Ci6);
  let q = !1, K = 0;
  for (let _ of H) {
    if (!q) { if (_.uuid === $) q = !0; continue; }
    if (Ci6(_)) K++;
  }
  if (!q) return H6(H, Ci6);    // cursor not found (compacted away) -> count ALL
  return K;
}

// READABLE (for understanding):
function isModelVisibleMessage(message) {
  return message.type === "user" || message.type === "assistant";  // excludes progress/system/attachment
}
function countModelVisibleMessagesSince(messages, sinceUuid) {
  if (sinceUuid === null || sinceUuid === undefined) return count(messages, isModelVisibleMessage);
  let foundStart = false, n = 0;
  for (const message of messages) {
    if (!foundStart) { if (message.uuid === sinceUuid) foundStart = true; continue; }
    if (isModelVisibleMessage(message)) n++;
  }
  // Fallback: if the cursor UUID was removed by /compact, count ALL model-visible
  // rather than returning 0 (which would permanently disable extraction this session).
  if (!foundStart) return count(messages, isModelVisibleMessage);
  return n;
}

// Mapping: Ci6->isModelVisibleMessage, Ig_->countModelVisibleMessagesSince, H6->count, $->sinceUuid
```

**What `countModelVisibleMessagesSince` does:** Counts user/assistant messages *after* the cursor — this is the `~N messages` figure injected into the prompt and reported in telemetry as `message_count`. "Model-visible" excludes progress/system/attachment messages, which the model never sees and shouldn't be counted as "new content".

**Why the compaction fallback (count ALL when the cursor isn't found):** `/compact` can delete the message the cursor points at. A naive scan would then never set `foundStart`, fall through the loop, and return `0` — which the skip ladder would read as "no new content", **permanently disabling extraction for the rest of the session**. The fallback treats "cursor lost" as "I don't know how far back, so consider everything," which is the safe direction: at worst the extractor re-examines already-handled messages (idempotent, since it checks the existing-memory manifest before writing), versus silently dropping every future memory. The same fallback pattern guards `hasUserProseSince` (`bg_`@448133, which uses `messages.some(isUserProseMessage)` when the cursor isn't found).

## 9. Cross-validation vs 2.1.88

The 2.1.88 readable TypeScript (`src/services/extractMemories/extractMemories.ts` and `prompts.ts`) is the ground truth. The 2.1.156 runtime is a faithful transliteration with three deliberate extensions. The delta table below maps 2.1.88 symbols to the 2.1.156 obfuscated forms (this is a *behavior/version delta* table, allowed in module docs — it is not a symbol-mapping reference table).

| 2.1.88 (TS, file:line) | 2.1.156 (obf @ line) | Status |
|---|---|---|
| `executeExtractMemories` (`extractMemories.ts:598`) | `pg_` (448380) | Preserved |
| `drainPendingExtraction` (`extractMemories.ts:611`) | `Ug_` (448383) — 60s race + `.unref()` | Preserved |
| `initExtractMemories` (`extractMemories.ts:296`) | `Bg_` (448255) — same closure state | Preserved |
| `runExtraction` (inner, `extractMemories.ts:329`) | `A` (448262) — skip ladder + fork | Preserved |
| `executeExtractMemoriesImpl` (`extractMemories.ts:527`) | `Y` (448353) — gate + coalesce | Preserved |
| `countModelVisibleMessagesSince` (`extractMemories.ts:82`) | `Ig_` (448092) — incl. compaction fallback | Preserved |
| `hasMemoryWritesSince` (`extractMemories.ts:121`) | `Cg_` (448106) | Preserved |
| `extractWrittenPaths` / `getWrittenFilePath` (`:251`/`:232`) | `mg_` (448242) / `E04` (448233) | Preserved |
| `denyAutoMemTool` (`extractMemories.ts:154`) | `dT8` (448145) | Preserved |
| `createAutoMemCanUseTool` (`extractMemories.ts:171`) | `cT8` (448200) | **Renamed + extended** (see below) |
| — (no session toggle in 2.1.88) | toggle short-circuit `isMemoryToggledOff` (448202) | **New** |
| — (no tiny mode in 2.1.88) | tiny-mode `Edit` deny (448221) | **New** |
| 2.1.88 canUseTool: `rm is not permitted` | `rm`/`Remove-Item` `.md` allow-list `ug_`/`xg_` (448169/448152) | **New** |
| `buildExtractAutoOnlyPrompt` (`prompts.ts:50`) + `buildExtractCombinedPrompt` (`prompts.ts:101`), each taking a `skipIndex` 3rd param + an inline two-step `howToSave` block | single `Z04` (448027); 3rd param repurposed `skipIndex`→`teamMemoryEnabled`; inline `howToSave` **removed**, save procedure delegated to the system prompt | **Merged + simplified** (2→1) |
| `tengu_extract_memories_extraction` / `_error` / `_coalesced` / `_skipped_*` / `tengu_auto_mem_tool_denied` | same event names (448320/448343/448360/448270/448277/448148) | Preserved |

**Notable points:**

- **Two prompt builders merged into one (`Z04`) — and the prompt got leaner.** 2.1.88's `buildExtractAutoOnlyPrompt` and `buildExtractCombinedPrompt` (`prompts.ts:50,101`) share an `opener()`, differ in a per-type `<scope>` section, **and each emit a multi-line two-step `howToSave` block** (`prompts.ts:55-92` / `:114-152`) gated by a `skipIndex` 3rd parameter. 2.1.156 folds them into a single `Z04` with the 3rd parameter repurposed from `skipIndex` to a `teamMemoryEnabled` boolean that inserts `"scope guidance, "` — and it **drops the inline `howToSave` entirely**, replacing it with a one-line delegation to "the Memory section of your system prompt" (cli_inner_pretty.js:448069). The `skipIndex` / `tengu_moth_copse` mechanism is not gone — it moved to the memdir builder `eM6` (read via `V$("tengu_moth_copse", !1)` at cli_inner_pretty.js:145059), so save instructions live in exactly one place. The verbatim opener and no-op lines survive ("You are now acting as the memory extraction subagent...", "If nothing is worth saving, output only 'Nothing to save.'"); see §7 for the full assembled prompt and the per-branch differences.
- **The `canUseTool` ladder is preserved and extended.** 2.1.88's `createAutoMemCanUseTool` (`extractMemories.ts:171-222`) already allowed REPL → Read/Grep/Glob → read-only Bash → Edit/Write-in-memoryDir → default deny, and explicitly stated *"`rm` is not permitted"*. 2.1.156 adds three rungs: (1) the `/toggle-memory` short-circuit (no session toggle existed in 2.1.88), (2) the tiny-mode Edit deny (no tiny memory in 2.1.88), and (3) the validated `rm`/`Remove-Item` `.md` allow-list (2.1.88 had *no* delete path). The path predicate also shifted from `isAutoMemPath` to `isAutoMemPathExceptEntrypoint` (`bM$`) — see [memdir_core.md](./memdir_core.md) for that semantic carve-out.
- **Telemetry preserved.** All six event names match 2.1.88 verbatim, including the `tengu_extract_memories_extraction` payload shape (token/cache/files/memories/team counts + `duration_ms`).
- **Coalescing, cursor, and drain are 1:1.** The single-flight `pendingContext` slot, the `lastMemoryMessageUuid` cursor with compaction fallback, and the `drainPendingExtraction` 60s race with `.unref()` are transliterated unchanged from 2.1.88 (`extractMemories.ts:557-566,82-110,579-586`).

For the full v2.1.142 → v2.1.156 rename map (module `b85`→`lT8`, factory `M$5`→`Bg_`, validator `DO8`→`cT8`), see [cross_validation.md](./cross_validation.md) and the [2.1.142 reference doc](../../../claude_code_v_2.1.142/analyze/31_auto_memory/extract_memories_runtime.md).

## 10. Related Symbols

> Symbol mappings live ONLY in the overview indexes (this module doc uses list format, no mapping table):
> - [symbol_additions_v2_1_156_auto_memory.md](../00_overview/symbol_additions_v2_1_156_auto_memory.md) — this version's auto-memory additions
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Compact / Hooks / Skills / **Auto Memory**
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Telemetry / Model / Prompt
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — UI / integrations

**Module + lifecycle:**
- `extractMemoriesModule` (`lT8`) — module object; re-exported as `Ac_` for the stop-hook (cli_inner_pretty.js:448082, 450998)
- `initExtractMemories` (`Bg_`) — closure factory; captures cursor/throttle/coalesce state (cli_inner_pretty.js:448255-448378)
- `executeExtractMemories` (`pg_`) — public per-turn entry; forwards to `extractor` (cli_inner_pretty.js:448380)
- `drainPendingExtraction` (`Ug_`) — 60s drain for `-p` mode; `Promise.race` + `.unref()` (cli_inner_pretty.js:448383)
- `executeExtractMemoriesImpl` (inner `Y`) — gate + coalesce (cli_inner_pretty.js:448353)
- `runExtraction` (inner `A`) — skip ladder + fork + success/error/trailing (cli_inner_pretty.js:448262)

**Gate:**
- `isExtractModeActive` (`S88`) — `tengu_passport_quail` AND (interactive OR `tengu_slate_thimble`) (cli_inner_pretty.js:142131)
- `isAutoMemoryEnabled` (`M1`) — parent auto-memory gate (cli_inner_pretty.js:142111)
- `isNonInteractive` (`R6`), `isRemoteWorkspace` (`d6`) — mode exclusions

**Cursor / content helpers:**
- `isModelVisibleMessage` (`Ci6`) — user/assistant filter (cli_inner_pretty.js:448089)
- `countModelVisibleMessagesSince` (`Ig_`) — cursor count, compaction fallback (cli_inner_pretty.js:448092)
- `hasMemoryWritesSince` (`Cg_`) — main-agent mutual-exclusion detector (cli_inner_pretty.js:448106)
- `isUserProseMessage` (`k04`) — ≥3-token non-meta user msg (cli_inner_pretty.js:448126)
- `hasUserProseSince` (`bg_`) — prose-since-cursor detector (cli_inner_pretty.js:448133)
- `MIN_USER_PROSE_TOKENS` (`V04`) = 3 (cli_inner_pretty.js:448388)
- `getWrittenFilePath` (`E04`) (cli_inner_pretty.js:448233), `extractWrittenPaths` (`mg_`) (cli_inner_pretty.js:448242)

**Tool sandbox (shared with auto-dream):**
- `createAutoMemCanUseTool` (`cT8`) — strict tool allow-list factory (cli_inner_pretty.js:448200)
- `denyAutoMemTool` (`dT8`) — deny + `tengu_auto_mem_tool_denied` (cli_inner_pretty.js:448145)
- `validatePosixMemoryRm` (`ug_`) — AST-parsed `rm` of `.md` inside memoryDir (cli_inner_pretty.js:448169)
- `validatePowerShellRemoveItem` (`xg_`) — tokenized `Remove-Item` allow-list (cli_inner_pretty.js:448152)
- `isMemoryToggledOff` (`XR`) (cli_inner_pretty.js:2799), `isAutoMemPathExceptEntrypoint` (`bM$`) (cli_inner_pretty.js:142188), `isAutoMemPath` (`ng`) (cli_inner_pretty.js:142185), `isTinyMemoryEnabled` (`_D`) (cli_inner_pretty.js:142142), `isPosixOS` (`K1`) (cli_inner_pretty.js:216267)

**Prompt + save message:**
- `buildExtractionPrompt` (`Z04`) — 3-branch (OS / tiny / team) extraction prompt (cli_inner_pretty.js:448027)
- `createMemorySavedMessage` (`CT8`) — `memory_saved` system message ("Saved N memories") (cli_inner_pretty.js:445955)

**Tool-name constants:** `ReadToolName` (`HK`@145385), `GrepToolName` (`s1`@212063), `GlobToolName` (`S_`@212034), `BashToolName` (`gq`@206792), `PowerShellToolName` (`BK`@212069), `EditToolName` (`l7`@145252), `WriteToolName` (`B9`@212289), `REPL_TOOL_NAME` (`oO`@212084), `ENTRYPOINT_NAME` (`OX` = "MEMORY.md").

## Cross-references

- [memdir_core.md](./memdir_core.md) — memory directory layout, the system-prompt "Memory" section, `isAutoMemPathExceptEntrypoint` (`bM$`) semantics, enablement/paths
- [auto_dream_runtime.md](./auto_dream_runtime.md) — the third writer; reuses `createAutoMemCanUseTool` (`cT8`) and `createMemorySavedMessage` (`CT8`) documented here
- [cross_validation.md](./cross_validation.md) — full 2.1.88 ↔ 2.1.156 and 2.1.142 → 2.1.156 mapping tables
- [README.md](./README.md) — auto-memory subsystem overview (3 writers, 3 dream surfaces)
- [2.1.142 extract_memories_runtime.md](../../../claude_code_v_2.1.142/analyze/31_auto_memory/extract_memories_runtime.md) — prior-version analysis (names `b85`/`M$5`/`DO8`)
