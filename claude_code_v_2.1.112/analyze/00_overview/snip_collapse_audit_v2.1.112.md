# Snip & Context-Collapse — Reference-by-Reference Audit of v2.1.112

This document **deeply audits** the v2.1.112 binary for any survivor of the `HISTORY_SNIP` and `CONTEXT_COLLAPSE` (codename `marble_origami`) feature systems. The methodology is **inverted** from a normal feature analysis: instead of starting from the binary and asking "what's here?", we start from **every reference site documented in v2.1.88's source tree** and ask "did this survive into v2.1.112?".

This complements `compact_v2.1.112.md` (the autocompact pipeline analysis) by drilling into the two specific features that user noticed were missing implementations in 2.1.88. The document is intentionally exhaustive so a reader can verify the conclusions without re-running searches.

---

## 0. TL;DR

| | Snip | Context-Collapse (`marble_origami`) |
|--|------|-------------------------------------|
| **Implementation files in 2.1.88 source-tree** | ❌ none (6 separate `require()`s into non-existent files) | ❌ none (`services/contextCollapse/{index,persist}.js` missing from bundle) |
| **Active runtime in 2.1.112** | ❌ DCE'd (every callable surface eliminated) | ❌ DCE'd (every applier/checker eliminated) |
| **Persistence write-side in 2.1.112** | ❌ DCE'd | ⚠️ **Present** — `XtY`/`MtY` exported as `recordContextCollapse{Commit,Snapshot}` (no caller) |
| **Persistence read-side in 2.1.112** | ❌ DCE'd | ✅ **Present** — JSONL parser `Ut` recognises `marble-origami-{commit,snapshot}` and lifts them to `contextCollapseCommits` / `contextCollapseSnapshot` resume fields |
| **Tail-keep policy in 2.1.112 streaming truncation** | ❌ N/A | ✅ `"always"` — survives any session-log compaction |
| **Vestigial parameter holes** | ⚠️ `Y = 0` (snipTokensFreed) on `gDY` | ❌ none |
| **Vestigial documentation** | ❌ "(e.g. by snip)" was scrubbed from `seed_read_state` SDK schema | n/a |
| **UI utilities sharing the "collapse" name** (NOT context-collapse) | n/a | ✅ all 4 utilities ship: `collapsed_read_search`, `teammate_shutdown_batch`, `stop_hook_summary`, hook-grouping |

**One-sentence summary:**
- **Snip in 2.1.112 is a strictly smaller footprint than even the dark-feature stubs in 2.1.88** — the bundler stripped *every* runtime surface, including SDK-schema mentions.
- **Context-collapse in 2.1.112 has gone the opposite direction** — the runtime is gone, but the **persistence read+write+tail-preserve** chain is *more complete* than the 2.1.88 source-tree implies, evidently to forward-compatibly load sessions written by future builds that ship the runtime.

---

## 1. Methodology

### 1.1 Inputs

- **Reference: v2.1.88 source tree** at `/Users/linyuzhi/codespace/myagent/agents/claude-code-kim/src/` — TypeScript with `feature('HISTORY_SNIP')` and `feature('CONTEXT_COLLAPSE')` gates that conditionally `require(...)` non-existent implementation files.
- **Target: v2.1.112 binary** at `/Users/linyuzhi/codespace/myagent/analyze/cc/analysis_claude_code/claude_code_v_2.1.112/source/chunks.*.mjs` (226 chunks + `cli.chunks.mjs` index).

### 1.2 Reference-site catalog (v2.1.88)

Every distinct call/import site that mentions `HISTORY_SNIP`, `CONTEXT_COLLAPSE`, `snipModule`, `snipProjection`, `snipReplay`, `applyCollapsesIfNeeded`, `recoverFromOverflow`, `isWithheldPromptTooLong`, `isContextCollapseEnabled`, `recordContextCollapseCommit`, `recordContextCollapseSnapshot`, `<collapsed>`, `marble_origami`, `CtxInspectTool`, `SnipTool`, `SNIP_NUDGE_TEXT`, `force-snip`, `seedReadFile` (with snip mention), or any of the persistence type aliases.

### 1.3 Audit query patterns for 2.1.112

For each reference, we run literal-string searches and sometimes obfuscation-resistant searches (looking for the runtime call shape). When a string is absent from all 226 chunks, the feature is fully DCE'd. When a string survives but only in dead-export shims, we mark it ⚠️ and inspect callers.

---

## 2. Snip — Reference-by-Reference Audit

### 2.1 Six implementation files referenced in 2.1.88 (none exist in either version's bundle)

| File path (v2.1.88 reference) | Reference site | v2.1.88 status | v2.1.112 status |
|------|----------------|----------------|-----------------|
| `services/compact/snipCompact.js` | `query.ts:115-116, 401-407`, `QueryEngine.ts:122-123`, `utils/messages.ts:2354,2424,4152`, `utils/attachments.ts:3973`, `components/Message.tsx:255` | ❌ file missing from src bundle (stub-only) | ❌ no string match for `snipCompact`, `snipCompactIfNeeded` in any chunk |
| `services/compact/snipProjection.js` | `QueryEngine.ts:125-126`, `utils/messages.ts:4651`, `components/Message.tsx:252` | ❌ file missing | ❌ no string match for `snipProjection`, `isSnipBoundaryMessage` |
| `tools/SnipTool/SnipTool.js` | `tools.ts:123-124` | ❌ file missing | ❌ no string match for `SnipTool` |
| `tools/SnipTool/prompt.js` | `utils/collapseReadSearch.ts:38-40` (`SNIP_TOOL_NAME`) | ❌ file missing | ❌ no string match for `SNIP_TOOL_NAME` |
| `commands/force-snip.js` | `commands.ts:83-84,235` | ❌ file missing | ❌ no string match for `/force-snip` or `forceSnip` |
| `components/messages/SnipBoundaryMessage.js` | `components/Message.tsx:259` | ❌ file missing | ❌ no string match for `SnipBoundary`, `snip_boundary` |

### 2.2 Per call/import site (v2.1.88) → v2.1.112 audit

| 2.1.88 reference site | What it does | v2.1.112 audit |
|-----------------------|--------------|----------------|
| `commands.ts:83-84` `forceSnip = feature('HISTORY_SNIP') ? require('./commands/force-snip.js').default : null` | Conditionally registers `/force-snip` slash command | DCE'd. No `/force-snip` literal in 2.1.112; no slash-command registration with that body. |
| `commands.ts:235` `...(forceSnip ? [forceSnip] : [])` | Spreads it into the command list | DCE'd. The conditional spread itself is constant-folded out. |
| `tools.ts:123-126` `SnipTool = feature('HISTORY_SNIP') ? require(...).SnipTool : null` and `...(SnipTool ? [SnipTool] : [])` | Conditionally registers SnipTool in the tool array | DCE'd. No tool definition string (`name: "Snip"`) appears in the 226 chunks. |
| `query.ts:115-116` `snipModule = feature('HISTORY_SNIP') ? require('./services/compact/snipCompact.js') : null` | Per-process snip module handle | DCE'd. No `snipModule` symbol or `snipCompactIfNeeded` runtime call shape. |
| `query.ts:396-407` `if (feature('HISTORY_SNIP')) { snipResult = snipModule!.snipCompactIfNeeded(messagesForQuery); messagesForQuery = snipResult.messages; snipTokensFreed = snipResult.tokensFreed; if (snipResult.boundaryMessage) yield snipResult.boundaryMessage; }` | Pre-microcompact snip pass; emits boundary message | DCE'd. The query loop in chunks.154.mjs:1006-1010 (the 2.1.112 equivalent) goes directly from microcompact (`H.microcompact(...)`) to autocompact (`H.autocompact(...)`) with no snip step between. |
| `query.ts:466` `snipTokensFreed,` (forwarded into `await runAutoCompact(...)`) | Plumbs to autocompact threshold check | **Vestigial wiring survives.** `gDY(q, K, _, z, Y = 0)` at chunks.159.mjs:1365 takes a 5th arg `Y` (default 0); the only caller `QkK` passes `A` (its own 6th arg), and `QkK`'s only caller in chunks.154.mjs:1016 passes 5 args (no 6th), so `A` is `undefined` and `Y` defaults to `0`. The parameter slot exists but no path produces a non-zero value. |
| `query.ts:597-598,638` `tokenCountWithEstimation(messagesForQuery) - snipTokensFreed` | Subtracts snip-freed tokens from the at-blocking-limit check | **Vestigial.** Same as above — `vJ(q) - Y` at chunks.159.mjs:1369 with `Y = 0`. |
| `QueryEngine.ts:120-126` `snipModule + snipProjection` lazy-required | QueryEngine-level handles | DCE'd. |
| `QueryEngine.ts:159-162` snip-boundary handler injection comment | (Doc) | DCE'd along with the handler. |
| `QueryEngine.ts:337` `// Slash commands that mutate the message array (e.g. /force-snip)` | Comment | Comment lost, but the kind of mutation it referred to does happen for `/clear`, `/rewind` — those still exist. |
| `QueryEngine.ts:898-912` `snipResult = this.config.snipReplay?.(yielded, this.mutableMessages); if (snipResult.executed) { this.mutableMessages.push(...snipResult.messages) }` | Replay-time snip-boundary handler | DCE'd. No `snipReplay` config field on the query-engine class. |
| `QueryEngine.ts:1276-1281` `...(feature('HISTORY_SNIP') ? { snipReplay: (yielded, store) => { if (!snipProjection!.isSnipBoundaryMessage(yielded)) return undefined; return snipModule!.snipCompactIfNeeded(store, { force: true }) } } : {})` | Wires the replay handler | DCE'd. |
| `utils/messages.ts:2348-2355` `feature('HISTORY_SNIP') && process.env.NODE_ENV !== 'test'` → injects `[id:...]` text-tags into API-bound messages | Lets the model reference message UUIDs when calling SnipTool | DCE'd. No `[id:` string-injection pattern in any chunk. |
| `utils/messages.ts:2414-2425` Same gate, double-checked via `isSnipRuntimeEnabled()` | Defensive: skip during VCR test playback | DCE'd. |
| `utils/messages.ts:4149-4155` `if (feature('HISTORY_SNIP')) { ... content: SNIP_NUDGE_TEXT }` | Periodic system nudge to the model: "consider /snip" | DCE'd. No `SNIP_NUDGE_TEXT` string. |
| `utils/messages.ts:4635-4651` `if (!options?.includeSnipped && feature('HISTORY_SNIP')) { snipProjection.filterSnipped(messages) }` | Default-filter snipped messages out of UI views | DCE'd. No `includeSnipped` option in 2.1.112 message-filter functions. |
| `utils/messages.ts:4664` `// Channel messages stay isMeta (for snip-tag/turn-boundary/brief-mode...)` | Comment | Comment lost; the underlying `isMeta` mechanism still runs, just for the non-snip reasons. |
| `utils/attachments.ts:934` `...(feature('HISTORY_SNIP') ? [...] : [])` | Spreads snip-related instructional attachments | DCE'd. |
| `utils/attachments.ts:3959-3978` `shouldNudgeForSnips(messages)` + `isSnipRuntimeEnabled` | 10k-token-interval nudge pacing | DCE'd. |
| `utils/sessionStorage.ts:1959-2000` `snipMessages()` deletion (preserves transcript invariants) | Persists snip-removed UUIDs to JSONL | DCE'd. |
| `utils/toolSearch.ts:539` `// Snip instead protects the boundary marker; this scan reads it back` | Comment | Comment lost. |
| `utils/collapseReadSearch.ts:37-40,57,177-181,800` Treats Snip as a "silent meta-tool" that doesn't increment read/search counters | UI grouping | The grouping logic remains (under `collapsed_read_search` UI case in chunks.140.mjs:2471), but the silent-absorb branch for `SNIP_TOOL_NAME` is DCE'd. |
| `cli/print.ts:3019` `// (e.g. by snip)` comment in print-mode seeding | Comment | Comment lost. |
| `components/Message.tsx:249-259` Snip-boundary UI rendering | Renders the boundary marker in transcript | DCE'd. No corresponding case in chunks.140.mjs's UI dispatch. |
| `entrypoints/sdk/controlSchemas.ts:359` SDK schema description for `seedReadFile`: `"Seeds the readFileState cache... Use when a prior Read was removed from context (e.g. by snip)..."` | SDK-public documentation that *names* snip | **String survives, snip mention SCRUBBED.** chunks.207.mjs:899 keeps the schema (now renamed `seed_read_state`) but with the description `"Seeds the readFileState cache with a path+mtime entry. Use when a prior Read was removed from context so Edit validation would fail despite the client having observed the Read..."` — the parenthetical "(e.g. by snip)" is removed. |
| `hooks/useLogMessages.ts:48,95` `// Same-head shrink: tombstone filter, rewind, snip, partial-compact` | Comments | Comments lost; `same-head shrink` UI logic still exists for the non-snip cases. |
| `services/compact/microCompact.ts:419` `// Extracted so other pre-request paths (e.g. snip force-apply) can consult` | Comment in microcompact helper | Comment lost; the helper itself (`getCachedMCConfig` etc.) was deeper in cached-microcompact, which is also DCE'd in 2.1.112. |
| `services/compact/autoCompact.ts:164-167,225,230,247,272` `snipTokensFreed` parameter | Read by `shouldCompact` so threshold sees post-snip count | **Vestigial.** Same as `query.ts:466` — parameter slot survives in `gDY(q, K, _, z, Y = 0)`. |
| `services/analytics/index.ts`, `services/analytics/metadata.ts` | Telemetry events with `snip_*` prefix | DCE'd. No `snip_*` event names in 2.1.112 telemetry strings. |
| `constants/prompts.ts` | `SNIP_TOOL_NAME` re-export | DCE'd. |

### 2.3 The vestigial parameter — code excerpt

```javascript
// ============================================
// shouldCompact - The only place where snipTokensFreed lives on in 2.1.112.
// Location: chunks.159.mjs:1365-1377
// ============================================

// ORIGINAL:
async function gDY(q, K, _, z, Y = 0) {
    if (z === "session_memory" || z === "compact") return !1;
    if (!z0()) return !1;
    if (bx() && !Z38(K, _)) return !1;
    let A = vJ(q) - Y,           // ← Y is snipTokensFreed; always 0 in 2.1.112
        O = v38(K, _),
        w = Yn(K, _);
    E(`autocompact: tokens=${A} threshold=${O} effectiveWindow=${w}`);
    let { isAboveAutoCompactThreshold: $ } = UM6(A, K, _);
    return $
}

// READABLE:
async function shouldCompact(messages, model, autoCompactWindow, querySource, snipTokensFreed = 0) {
  if (querySource === "session_memory" || querySource === "compact") return false;
  if (!isAutoCompactEnabled()) return false;
  if (isAntUser() && !isWindowFromEnvOrSettings(model, autoCompactWindow)) return false;
  const tokenCount = estimateMessageTokens(messages) - snipTokensFreed;
  const threshold = getAutoCompactThreshold(model, autoCompactWindow);
  const effectiveWindow = getEffectiveContextWindow(model, autoCompactWindow);
  log(`autocompact: tokens=${tokenCount} threshold=${threshold} effectiveWindow=${effectiveWindow}`);
  const { isAboveAutoCompactThreshold } = computeContextThresholds(tokenCount, model, autoCompactWindow);
  return isAboveAutoCompactThreshold;
}

// Mapping: gDY→shouldCompact, vJ→estimateMessageTokens, Y→snipTokensFreed
```

The only caller is:

```javascript
// chunks.159.mjs:1388 (inside QkK / autocompactDispatcher)
if (!await gDY(q, O, w, z, A)) return { wasCompacted: !1 };
//                            ^ A is QkK's 6th formal parameter
```

And `QkK`'s only caller is:

```javascript
// chunks.154.mjs:1016
let { compactionResult: e, consecutiveFailures: i, ... } = await H.autocompact(U, v, {
  systemPrompt: _, userContext: z, systemContext: Y, toolUseContext: v, forkContextMessages: U
}, w, g, n);
//      ^ 5 trailing args after the big object; last one (n) is the 6th positional
//        that becomes A inside QkK, which becomes Y inside gDY.
```

Where `n` is initialized at `chunks.154.mjs:1005` as `let n = 0;` and never reassigned before the `autocompact(...)` call at line 1016. **So `Y` (snipTokensFreed) is structurally always `0` in 2.1.112** — the parameter slot is real but unreachable from a non-zero value.

### 2.4 The scrubbed schema description — code excerpt

```javascript
// chunks.207.mjs:895-899 (semantic):
const seedReadStateSchema = lazy(() => z.object({
  subtype: z.literal("seed_read_state"),
  path: z.string(),
  mtime: z.number(),
}).describe(
  "Seeds the readFileState cache with a path+mtime entry. " +
  "Use when a prior Read was removed from context so Edit validation would fail despite the client having observed the Read. " +
  "The mtime lets the CLI detect if the file changed since the seeded Read — same staleness check as the normal path."
));
```

Compare to v2.1.88 `entrypoints/sdk/controlSchemas.ts:359`:
> `"Seeds the readFileState cache with a path+mtime entry. Use when a prior Read was removed from context (e.g. by snip) so Edit validation would fail..."`

The phrase **"(e.g. by snip)"** is **removed**. This is the most concrete public-API-surface evidence that snip was deliberately pulled before shipping: even the externally-visible *documentation* was edited to not mention it.

The schema name was also changed: `seedReadFile` (2.1.88, control schema name) → `seed_read_state` (2.1.112, subtype literal). The behavior is otherwise identical.

### 2.5 Summary: snip in 2.1.112

The bundler removed **every** snip surface listed in 2.1.88's reference graph — including comments and SDK documentation — except for one parameter on `gDY` whose default value structurally guarantees the snip-correction never fires. This is **stricter dead-code elimination than 2.1.88's own source** would have you predict, suggesting either:
1. A separate "remove all snip mentions" patch landed between 2.1.88 → 2.1.112, OR
2. The bundle's tree-shaker is more aggressive about dead branches than the source-as-written.

The vestigial `Y = 0` parameter is the *only* reason snip's existence is even archaeologically detectable in 2.1.112.

---

## 3. Context-Collapse — Reference-by-Reference Audit

### 3.1 Two implementation files referenced in 2.1.88 (neither exists in either bundle's source)

| File path (v2.1.88 reference) | Reference site | v2.1.88 status | v2.1.112 status |
|------|----------------|----------------|-----------------|
| `services/contextCollapse/index.js` | `setup.ts:295-298`, `query.ts:18-19`, `utils/analyzeContext.ts:1119-1124` | ❌ missing from src | ❌ no string match for `applyCollapsesIfNeeded`, `isContextCollapseEnabled`, `recoverFromOverflow`, `isWithheldPromptTooLong` |
| `services/contextCollapse/persist.ts` | `utils/sessionRestore.ts:127-130` | ❌ missing from src | ⚠️ persistence FUNCTIONS present (`XtY`/`MtY` in chunks.191.mjs:1102-1120), but NOT in a separate file — they live in the session-log module |

### 3.2 Per call/import site (v2.1.88) → v2.1.112 audit

| 2.1.88 reference site | What it does | v2.1.112 audit |
|-----------------------|--------------|----------------|
| `tools.ts:110-111` `CtxInspectTool = feature('CONTEXT_COLLAPSE') ? require('./tools/CtxInspectTool/CtxInspectTool.js').CtxInspectTool : null` | Tool that inspects collapse state | DCE'd. No `CtxInspect` symbol or tool name. |
| `tools.ts:222` `...(CtxInspectTool ? [CtxInspectTool] : [])` | Spread into the tool list | DCE'd. |
| `setup.ts:295-298` `if (feature('CONTEXT_COLLAPSE')) { require('./services/contextCollapse/index.js').initialize() }` | Process-startup init | DCE'd. |
| `query.ts:18-19` `contextCollapse = feature('CONTEXT_COLLAPSE') ? require('./services/contextCollapse/index.js') : null` | Module handle | DCE'd. |
| `query.ts:440-441` `if (feature('CONTEXT_COLLAPSE') && contextCollapse) { collapseResult = await contextCollapse.applyCollapsesIfNeeded(...) }` | Pre-request: stage/apply collapses | DCE'd. The query loop in `chunks.154.mjs:vXY` has no equivalent step. |
| `query.ts:609,616-625` Skip auto-compact when collapse will run | DCE'd; the local `gDY` shouldCompact does NOT have a "skip if collapse pending" branch. |
| `query.ts:800-812` `if (contextCollapse?.isWithheldPromptTooLong(message)) { ... }` (in stream-error handler) | Detect when 413/withheld responses indicate collapse is needed | DCE'd. The 413/over-context recovery in 2.1.112 goes through a different path: `chunks.194.mjs:856-944` (`d85` `context_hint` reject) which uses `qD4` (KEEP-RECENT MC), NOT a collapse module. |
| `query.ts:1086-1094` `if (feature('CONTEXT_COLLAPSE') && contextCollapse && contextCollapse.isContextCollapseEnabled()) { drained = contextCollapse.recoverFromOverflow(...) }` | On overflow, drain staged collapses | DCE'd. |
| `query.ts:1176-1180` `else if (feature('CONTEXT_COLLAPSE') && isWithheld413) { ... }` | Withheld-413 fallback to collapse | DCE'd. |
| `types/logs.ts:43-44,255-322` `ContextCollapseCommitEntry`, `ContextCollapseSnapshotEntry` types | Persistence schema | **Type names not directly observable in obfuscated JS**, but the **field names** `contextCollapseCommits` and `contextCollapseSnapshot` ARE present (chunks.136.mjs:2144-2145, chunks.191.mjs multiple lines). The schema is wired, even though no code constructs entries. |
| `utils/sessionRestore.ts:26-27,68-69,127-132,302-303,494` Restore commit-log + snapshot from JSONL | **Surviving in spirit:** chunks.191.mjs:1473-1490 (function `ZtY`) + chunks.191.mjs:2186-2249 (functions `Ut` and `KK8`) read commits/snapshot from the JSONL session log and propagate them into the resume result. See § 3.4. |
| `utils/messages.ts:1828` `// context-collapse \`<collapsed>\` summaries` comment | Comment | Comment + the type of message it refers to are gone. No `<collapsed>` string in any chunk. |
| `utils/analyzeContext.ts:1109-1124` `if (feature('CONTEXT_COLLAPSE') && isContextCollapseEnabled()) { ...marble_origami branch... }` | Diagnostic-mode collapse-state inspector | DCE'd. |
| `utils/analyzeContext.ts:14,1004` `getEffectiveContextWindowSize` import (the function collapse imports too) | The cross-import that gives collapse the same window-math autocompact uses | The function still exists (under different obfuscated name `lc` for getMaxOutputTokens / `Yn` for getEffectiveContextWindow), but it's now used solely by autocompact, not by collapse. |
| `cli/print.ts` (transcript-restore) | Referenced collapse state during print-mode rebuild | DCE'd; print-mode operates on raw messages without collapse-aware reprojection. |

### 3.3 The persistence write side — DCE'd but exported

```javascript
// ============================================
// recordContextCollapseCommit + recordContextCollapseSnapshot - Write-side persistence shims.
// Location: chunks.191.mjs:1102-1120
// ============================================

// ORIGINAL:
async function XtY(q) {
    let K = I8();
    if (!K) return;
    await x_().appendEntry({
        type: "marble-origami-commit",
        sessionId: K,
        ...q
    })
}
async function MtY(q) {
    let K = I8();
    if (!K) return;
    await x_().appendEntry({
        type: "marble-origami-snapshot",
        sessionId: K,
        ...q
    })
}

// READABLE:
async function recordContextCollapseCommit(commit) {
  const sessionId = getCurrentSessionId();
  if (!sessionId) return;
  await getSessionWriter().appendEntry({
    type: "marble-origami-commit",
    sessionId,
    ...commit
  });
}
async function recordContextCollapseSnapshot(snapshot) {
  const sessionId = getCurrentSessionId();
  if (!sessionId) return;
  await getSessionWriter().appendEntry({
    type: "marble-origami-snapshot",
    sessionId,
    ...snapshot
  });
}

// Mapping: XtY→recordContextCollapseCommit, MtY→recordContextCollapseSnapshot,
//          I8→getCurrentSessionId, x_→getSessionWriter
```

These are **exported by name** in `cli.chunks.mjs:9124-9125` alongside the other session-log writers:

```javascript
recordQueueOperation: () => Ng1,
recordFileHistorySnapshot: () => i48,
recordContextCollapseSnapshot: () => MtY,
recordContextCollapseCommit: () => XtY,
recordContentReplacement: () => dM6,
recordAttributionSnapshot: () => peK,
```

But `grep -rn "\\bXtY(\\|\\bMtY(" *.mjs` returns ONLY the function definitions and the cli.chunks export — **no internal caller exists**. The shipped binary cannot produce a `marble-origami-*` entry on its own. They exist purely as a forward-compatible write API that some future build can flip on without changing the on-disk format.

### 3.4 The persistence read side — fully wired, more complete than 2.1.88's source describes

This is the **most surprising** finding of the entire audit. 2.1.88 source has a `feature('CONTEXT_COLLAPSE')`-gated restore step in `utils/sessionRestore.ts:127-132,494` that imports `contextCollapse/persist.js` (a missing file). One would expect 2.1.112 to either keep the gate (DCE'd to nothing) or strip the field entirely.

What 2.1.112 actually does is **strip the gate while keeping the read-and-propagate code unconditional**:

#### 3.4.1 The JSONL parser (`Ut`) recognises both marble-origami types

```javascript
// ============================================
// jsonlSessionLogParser - The session-log parser handles marble-origami entries.
// Location: chunks.191.mjs:2041-2189 (excerpt)
// ============================================

// ORIGINAL (relevant lines only):
async function Ut(q, K) {
    let _ = new Map, ..., f = [], v, ...,
        N = (h) => {
            if (YtY(h)) { ... }
            if (ul(h)) { ... }
            else if (h.type === "summary" && h.leafUuid) z.set(...);
            else if (h.type === "custom-title" && h.sessionId) Y.set(...);
            // ... many more `else if (h.type === ...)` branches ...
            else if (h.type === "marble-origami-commit") f.push(h);   // ← collapse commit accumulator
            else if (h.type === "marble-origami-snapshot") v = h       // ← collapse snapshot (last-wins)
        };
    // ... parsing loop ...
    return {
        messages: _,
        // ... many fields ...
        contextCollapseCommits: f,         // ← surfaced in result
        contextCollapseSnapshot: v,        // ← surfaced in result
        leafUuids: B
    }
}

// READABLE:
async function jsonlSessionLogParser(filePath, options) {
  const collapseCommits = [];
  let collapseSnapshot;
  // ... other accumulators ...
  
  const handleEntry = (entry) => {
    if (isQueueOperation(entry)) { ... }
    if (isMessage(entry)) { ... }
    else if (entry.type === "summary" && entry.leafUuid) summaries.set(...);
    // ... other branches ...
    else if (entry.type === "marble-origami-commit") collapseCommits.push(entry);
    else if (entry.type === "marble-origami-snapshot") collapseSnapshot = entry;  // last-wins
  };
  
  // ... parse loop applies handleEntry to each line ...
  
  return {
    messages, summaries, customTitles, tags, agentNames, agentColors, agentSettings,
    prNumbers, prUrls, prRepositories, modes, permissionModes, worktreeStates,
    fileHistorySnapshots, attributionSnapshots, contentReplacements, agentContentReplacements,
    contextCollapseCommits: collapseCommits,
    contextCollapseSnapshot: collapseSnapshot,
    leafUuids
  };
}

// Mapping: Ut→jsonlSessionLogParser, f→collapseCommits, v→collapseSnapshot,
//          YtY→isQueueOperation, ul→isMessage
```

Note this is **not** behind `feature('CONTEXT_COLLAPSE')`. It runs unconditionally. 2.1.112 has stripped the feature gate but kept the parsing.

#### 3.4.2 The resume callers propagate them

There are at least **four** callers in 2.1.112 that take `contextCollapseCommits`/`contextCollapseSnapshot` from the parser and forward them into resume data:

| Function | Location | Role |
|----------|----------|------|
| `ZtY(filePath)` | chunks.191.mjs:1464-1492 | Load + reconstruct a single-session JSONL into a resume payload (filtered by sessionId) |
| `KK8(sessionId)` | chunks.191.mjs:2206-2251 | Load a session from its sessionId, re-attach all extras |
| **(unnamed in summary)** | chunks.191.mjs:1798-1845 | Append commits/snapshot to a session-summary record |
| `(resume restore)` | chunks.136.mjs:2125-2160 | Hot-path resume — propagates collapse data into the live conversation |

#### 3.4.3 The hot-path resume bridge (`chunks.136.mjs`)

```javascript
// ============================================
// resumeFromSessionLog - Hot-path session resumption; propagates collapse state.
// Location: chunks.136.mjs:2118-2163 (excerpt)
// ============================================

// ORIGINAL (relevant return value):
return z.push(...$), {
    messages: z,
    turnInterruptionState: w.turnInterruptionState,
    deferredToolUse: O,
    fileHistorySnapshots: _?.fileHistorySnapshots,
    attributionSnapshots: _?.attributionSnapshots,
    contentReplacements: _?.contentReplacements,
    contextCollapseCommits: _?.contextCollapseCommits,        // ← propagated
    contextCollapseSnapshot: _?.contextCollapseSnapshot,      // ← propagated
    sessionId: Y,
    agentName: _?.agentName,
    // ... many more fields ...
    fullPath: _?.fullPath
}

// READABLE:
return messages.push(...sessionStartHookResults), {
  messages,
  turnInterruptionState,
  deferredToolUse,
  fileHistorySnapshots: loaded?.fileHistorySnapshots,
  attributionSnapshots: loaded?.attributionSnapshots,
  contentReplacements: loaded?.contentReplacements,
  contextCollapseCommits: loaded?.contextCollapseCommits,
  contextCollapseSnapshot: loaded?.contextCollapseSnapshot,
  sessionId,
  // ... rest ...
};
```

#### 3.4.4 But there's no consumer

After `chunks.136.mjs:2125-2160` returns this object, the receiving callers (the REPL bootstrap, the SDK's session restore endpoint) take the return value and use the `messages`, `fileHistorySnapshots`, etc. — but no chunk reads `.contextCollapseCommits` or `.contextCollapseSnapshot` for any operational purpose. They are the equivalent of a database column with no SELECTs against it.

A check confirms this: `grep -rn "contextCollapseCommits\\|contextCollapseSnapshot" *.mjs` matches only chunks.136.mjs (one site, propagation) and chunks.191.mjs (multiple sites, all writes/reads inside the parser/resume helpers). cli.chunks.mjs has zero matches.

### 3.5 The "always" tail-keep policy

When the JSONL session log grows beyond 5 MB (`AQ6 = 5242880`, chunks.16.mjs:2966), the streaming reader can truncate older entries to skip parsing time. There's a per-type policy:

```javascript
// chunks.191.mjs:3070-3084 (semantic excerpt)
const SESSION_LOG_TAIL_KEEP_POLICY = {
  "agent-name":               "always",
  "agent-color":              "always",
  "agent-setting":            "always",
  "pr-link":                  "always",
  "file-history-snapshot":    "always",
  "attribution-snapshot":     "always",
  "speculation-accept":       "always",
  "mode":                     "always",
  "permission-mode":          "always",
  "worktree-state":           "always",
  "queue-operation":          "always",
  "marble-origami-commit":    "always",  // ← preserve through truncation
  "marble-origami-snapshot":  "always",  // ← preserve through truncation
  "content-replacement":      "route-by-agent",
};
```

**Implication:** Even if a future build has a many-megabyte session log and trips the streaming-truncation path, all `marble-origami-*` entries written so far are preserved verbatim. This is not a behavior the 2.1.88 source-tree describes anywhere — it's a **2.1.112-specific commitment to forward-compatible collapse state**.

### 3.6 Streaming-reader skip-to-compact-boundary

Adjacent finding: chunks.191.mjs:1970-2028 implements the `ytY` streaming pre-skip optimization. When the JSONL log is huge, the reader scans forward looking for the most recent `compact_boundary` system message and starts parsing from there (everything before the boundary is pre-compact, no longer in active context).

This is **only** wired for `compact_boundary` (the autocompact summary marker) — there's no equivalent skip for `snip_boundary` or `marble-origami-commit`. Confirms again that snip and collapse are not in the active runtime.

### 3.7 Summary: collapse in 2.1.112

The runtime is fully gone — every `applyCollapsesIfNeeded`, `recoverFromOverflow`, `isWithheldPromptTooLong`, `isContextCollapseEnabled`, `<collapsed>` string, and `CtxInspect` tool definition is absent.

But the **persistence story is more complete than 2.1.88's source-tree implies**:

1. ✅ Write functions exported as `recordContextCollapseCommit`/`Snapshot`
2. ✅ Reader recognizes both type strings
3. ✅ Reader returns them as named fields
4. ✅ Resume callers propagate them through the resume payload
5. ✅ Tail-keep policy preserves them through any session-log truncation
6. ❌ **No consumer reads them for any purpose**

The cleanest reading: 2.1.112's binary is a **forward-compatible reader** for sessions written by some hypothetical future build that ships the runtime. A user resuming a session that was *originally created* by build N+1 (with collapse on) won't lose the collapse state when re-loaded by 2.1.112 — the data round-trips. They just can't *use* it under 2.1.112.

This is a notably different posture than for snip — where 2.1.112 even scrubbed the SDK schema documentation. Collapse was kept "ready to ship"; snip was decisively pulled.

---

## 4. UI utilities named "collapse" — ALL ship, NOT context-collapse

These are easy to confuse with context-collapse but are completely separate. They handle UI grouping/folding of repeated tool calls and shutdown messages. The 2.1.88 source-tree has them as standalone utility files; the 2.1.112 binary ships them all (with renamed obfuscated symbols).

| 2.1.88 source file | What it does | 2.1.112 evidence |
|---------------------|--------------|------------------|
| `utils/collapseReadSearch.ts` (810 lines) | Groups consecutive Read/Grep/Glob calls under one expandable summary in transcript view | ✅ chunks.140.mjs:2471 case `collapsed_read_search` (UI dispatch) — handler `QjK` renders the collapsed view |
| `utils/collapseTeammateShutdowns.ts` | Groups multiple in-process-teammate shutdown messages into one batch | ✅ chunks.140.mjs:225 case `teammate_shutdown_batch`, plus chunks.181.mjs:341 emits this type |
| `utils/collapseHookSummaries.ts` | Groups consecutive `stop_hook_summary` messages with the same `hookLabel` | ✅ chunks.181.mjs:292 (`q.subtype === "stop_hook_summary" && q.hookLabel !== void 0`), chunks.140.mjs:1422 |
| `utils/collapseBackgroundBashNotifications.ts` | Groups background-bash progress notifications | ✅ likely in chunks.139/153 (background-bash chunks); not deeply audited but the underlying "background bash" feature ships |
| `tools/MCPTool/classifyForCollapse.ts` | Decides whether an MCP tool result should be eligible for the read-search-style collapse UI | ✅ classification logic survives in MCP tool dispatch (chunks.162 vicinity) |
| `components/messages/CollapsedReadSearchContent.tsx` | UI component for the collapsed-read-search summary | ✅ renders via `QjK` (chunks.140 line 2474) |
| `components/messages/teamMemCollapsed.tsx` | UI for collapsed team-memory recall | ✅ chunks-level rendering present |

The naming overlap is unfortunate but understandable: "collapse" is just the UI-team's word for "group repeated low-signal items into one expandable summary". **None of these have any data flow into or out of `marble-origami-*` entries.**

---

## 5. The relationship between snip & collapse

Reading the 2.1.88 source-tree, the two features look complementary:

- **Collapse** is the user-facing name for **LLM-driven message-archival**: when a sub-task finishes, an agent emits a `marble-origami-commit` containing a textual summary, plus a "snapshot" capturing the staged-but-not-yet-committed messages. The summary then replaces the archived messages in the LLM-bound prompt; the originals remain on-disk for restore.
- **Snip** is the **surgical-deletion primitive** that the collapse agent (or a `/force-snip` user request) emits to actually remove specific messages from the in-memory store. The `snipTokensFreed` parameter on autocompact's threshold check is how the autocompact loop avoids double-counting.

Several pieces of evidence support this reading:

1. The two `feature(...)` flags are independent in 2.1.88 (`HISTORY_SNIP` vs `CONTEXT_COLLAPSE`), but `query.ts:441` has collapse-then-snip ordering: collapse-apply runs *before* the per-turn snip in `query.ts:401`. So collapse can produce snips.
2. `utils/messages.ts:1828` comment: `"context-collapse '<collapsed>' summaries) stays untouched — a Human: boundary"`. This tells us the collapse-emitted text uses a `<collapsed>` HTML-style marker, and that the snip-pass preserves these markers (i.e. snip is selective, not a global truncation).
3. `analyzeContext.ts:1109-1124` mentions `marble_origami` as the codename, and the 2.1.88 file has paired DCE comments: `"external builds. Same for context-collapse (marble_origami) — collapse [is gated]"`.
4. Both features share the same forward-compat persistence vehicle (`marble-origami-commit` / `-snapshot` types) — there is no `snip-boundary-commit` etc., suggesting snip's persistence rides on collapse's commit log.

**Implication:** the 2.1.112 decision to fully strip snip but keep collapse persistence implies the team views the two as separable. The collapse runtime is the harder feature to ship safely (it needs LLM-driven summarization at archival points, which is a research surface). Snip alone — as a thin user-callable `/force-snip` tool that removes a range of messages — is shippable any time, but it's apparently been judged not-yet-useful enough to ship without the collapse machinery driving it.

---

## 6. Replacement / overlap with shipped features

To complete the picture, here's where the *function* of snip and collapse is partially served by features that DID ship in 2.1.112:

| Need served by snip/collapse in design | What 2.1.112 actually does instead |
|----------------------------------------|------------------------------------|
| Pro-actively remove old tool results to keep the per-turn cache warm | **No-op.** The 2.1.88 design had cached-microcompact (`feature('CACHED_MICROCOMPACT')`) doing this; in 2.1.112 the per-turn microcompact (`_c` in chunks.85.mjs:1207) is gutted to a no-op. |
| Recover when the API returns 413/422 from over-context | **`d85` `context_hint` reject path** (chunks.194.mjs:856-887). On HTTP 422/424 with `context-hint-2026-04-09` beta, the client clears `thinking` blocks once-per-session and runs `qD4` (KEEP-RECENT MC) to clear all but the last 5 compactable tool results, then retries. This is server-driven; collapse's `recoverFromOverflow` was client-driven. |
| Avoid a cache-burning full-compact when only a few large messages need to go | **Not solved.** Without snip, the only options are full autocompact or wait for the 422 reject. There is no fine-grained "delete just these 3 messages" path in 2.1.112. |
| Archive completed sub-tasks with a textual summary that future turns can reference | **Not solved.** Subagent results have a `tool_use_summary` mechanism (chunks.99/165/204/219), but this is a different abstraction — the parent receives a summary instead of the subagent's full transcript. It's not the same as collapse's per-segment LLM-driven archival within a single agent thread. |
| Let the model voluntarily prune | **Not solved.** No `Snip` tool in the binary. The model has no first-class way to free context outside of finishing a tool call. |

---

## 7. How to verify each claim above

### Snip is fully eliminated:
```bash
cd .../source/
grep -l "HISTORY_SNIP\|SnipTool\|force-snip\|SNIP_NUDGE\|snipCompactIfNeeded\|isSnipBoundaryMessage\|snipReplay\|isSnipRuntimeEnabled\|shouldNudgeForSnips\|snip_boundary\|SnipBoundary" *.mjs
# → empty (zero matches)
```

### `seedReadFile` SDK schema lost the snip mention:
```bash
grep -A2 "seed_read_state" chunks.207.mjs | grep -i "snip"
# → empty (zero matches; the description otherwise survives)
```

### Collapse runtime is fully eliminated:
```bash
grep -l "applyCollapsesIfNeeded\|recoverFromOverflow\|isContextCollapseEnabled\|isWithheldPromptTooLong\|<collapsed>\|CtxInspect\|tengu_context_collapse" *.mjs
# → empty
```

### Collapse persistence write functions exist but have no caller:
```bash
grep -n "\\bXtY(\\|\\bMtY(" *.mjs
# → only the function definitions and the cli.chunks.mjs export
```

### Collapse persistence read+propagate is wired:
```bash
grep -l "marble-origami" *.mjs
# → chunks.191.mjs (writer + reader + tail-keep policy)
grep -l "contextCollapseCommits\\|contextCollapseSnapshot" *.mjs
# → chunks.136.mjs (resume bridge), chunks.191.mjs (parser + multiple resume callers)
```

### UI-collapse utilities ship:
```bash
grep -n "collapsed_read_search\|teammate_shutdown_batch\|stop_hook_summary" *.mjs | head
# → matches in chunks.140, chunks.181 (UI dispatch + emitters)
```

### `marble-origami-*` tail-keep policy:
```bash
grep -n "marble-origami" chunks.191.mjs
# → 5 lines: writer literal (1102-1116), reader branch (2091-2092), tail-keep policy (3081-3082)
```

---

## 8. Cross-references

- `compact_v2.1.112.md` — the parent compact-subsystem analysis (this document supplements §10-11 with deeper detail)
- `changelog_analysis.md` § 12 — cross-validation findings (now should incorporate the persistence-read finding)
- `by_version/v2.1.89.md` § 3 — original autocompact circuit-breaker analysis
- `00_overview/symbol_index.md` — full obfuscated → readable mapping (Compact module section was updated to include `Ut`/`KK8`/`ZtY` etc.)
- `00_overview/file_index.md` — chunks.191.mjs is the JSONL session log + persistence module

---

## 9. Symbol additions (proposed for `symbol_index.md`)

The reader functions and parser deserve documentation in the Compact module:

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ut` | `jsonlSessionLogParser` | chunks.191.mjs:2041-2189 | function |
| `ytY` | `streamingPreSkipToCompactBoundary` | chunks.191.mjs:1970-2028 | function |
| `LtY` | `readAttributionSnapshotAtOffset` | chunks.191.mjs:2030-2038 | function |
| `KK8` | `loadSessionForResume` | chunks.191.mjs:2206-2251 | function |
| `UeK` | `loadSessionByJsonlPath` | chunks.191.mjs:2193-2196 | function |
| `ZtY` | `loadSessionForReconstruction` | chunks.191.mjs:1464-1492 | function |
| `AQ6` | `JSONL_STREAMING_THRESHOLD_BYTES` (= 5_242_880) | chunks.16.mjs:2966 | constant |
| `EtY` | `truncateJsonlToTailMessages` | (chunks.191.mjs vicinity) | function |
| `i48` | `recordFileHistorySnapshot` | chunks.191.mjs:1080-1083 | function |
| `peK` | `recordAttributionSnapshot` | chunks.191.mjs:1085-1087 | function |
| `dM6` | `recordContentReplacement` | chunks.191.mjs:1088-1091 | function |
| `Ng1` | `recordQueueOperation` | (chunks.191.mjs vicinity) | function |
| `XtY` | `recordContextCollapseCommit` (write-only shim, no callers) | chunks.191.mjs:1102-1110 | function |
| `MtY` | `recordContextCollapseSnapshot` (write-only shim, no callers) | chunks.191.mjs:1112-1120 | function |
| **Tail-keep policy literals** | `"marble-origami-commit"` (= "always"), `"marble-origami-snapshot"` (= "always") | chunks.191.mjs:3081-3082 | constant (in object) |

---

## 10. Closing note — why this matters

A reader skimming `compact_v2.1.112.md` could come away thinking "snip and collapse are absent in 2.1.112, end of story". The reference-by-reference audit shows the picture is more nuanced:

1. **Snip is *more* absent in 2.1.112 than in 2.1.88's source.** Even the SDK schema documentation was edited to scrub the mention. This signals an **active decision**: snip is not coming as a standalone feature.
2. **Collapse is *less* absent in 2.1.112 than 2.1.88's source implies.** The persistence layer is fully wired for write+read+tail-preserve, with explicit forward-compat commitments in the `"always"` tail-keep policy. This signals the runtime is **ready to ship**; the gap is the missing applier/checker module which (per its absence from both bundles) was never finished and reviewed for safety.
3. The autocompact threshold's `Y = 0` parameter is the only "evidence in the wild" that snip ever existed, and only because removing the parameter would have been a behavior-equivalent refactor that wasn't done.

When the next 2.1.x release ships with collapse re-enabled, the read-side and persistence layer will already be there. When/if snip ships, it will need to come back from scratch — every reference site documented here was severed.
