# Compact Version Diff: v2.1.88 → v2.1.112

> **Purpose.** Anthropic's source-tree leak (2026-03-31, ≈ v2.1.88) gives us the unobfuscated TypeScript that v2.1.112's bundle was built from. This document is a **deep, side-by-side diff** of the compact subsystem between the two versions, with concrete code-level evidence.

> **⚠️ Methodology caveat (read first).** This diff was originally written off a pattern: "absent in v2.1.112 binary grep ⇒ removed since v2.1.88". A subsequent deep review found that pattern produces **false positives** in three ways:
>
> 1. **Renamed identifiers.** Helpers that survive the version transition under different names look like deletions if you only grep for the old name. (Example: 2.1.112's `bx()` reads the same `tengu_cobalt_raccoon` flag that 2.1.88 read inside `feature('REACTIVE_COMPACT')` — but with different surrounding semantics.)
> 2. **Restructured features.** A feature can be split: part stays, part goes. (Example: SessionMemory module survives in 2.1.112; only the compact-tier integration `trySessionMemoryCompaction` is gone.)
> 3. **Feature-gate ambiguity.** Code under `feature('X')` may be DCE'd in **both** the 2.1.88 public binary AND the 2.1.112 public binary. We don't have the 2.1.88 binary, only the source. So "feature-gated path absent in 2.1.112 binary" doesn't necessarily mean "lost between versions" — it may have been absent for public users in both.
>
> The sections below have been split into three confidence tiers:
> - **Tier 1 (high confidence)** — string in source, *and the algorithmic site* clearly absent or changed in 2.1.112 binary, *and* the feature was not behind a `feature()` gate (so it shipped to public users).
> - **Tier 2 (medium confidence)** — feature-gated in source, absent in 2.1.112 binary. May have been DCE'd in 2.1.88 public too — call it a *codebase change*, not a guaranteed user-visible change.
> - **Tier 3 (restructured / repurposed)** — same flag/algorithm survives, but the wiring or trigger changed.
>
> [§ 2 (removed)](#2-removed-in-v21112) and [§ 3 (added)](#3-added-in-v21112) carry these tiers. The original Tier 1 / unchanged findings are preserved; aggressive Tier 2 claims have been demoted.

---

## 0. Version Ordering — Correction to `CROSS_VALIDATION.md`

The pre-existing [`CROSS_VALIDATION.md`](./CROSS_VALIDATION.md) concluded the source-tree was **newer** than v2.1.112. **That conclusion is inverted.** Hard evidence:

| Signal | Source-tree | v2.1.112 binary |
|---|---|---|
| Telemetry comment dates in `autoCompact.ts` | `BQ 2026-03-10`, `BQ 2026-03-01` | n/a |
| Public leak date | **2026-03-31** | n/a |
| API beta header string | n/a | `context-hint-2026-04-09` (chunks.194.mjs:846) |
| `compactConversation` arity | **7 params** | **8 params** (8th: `stripNonEssential`) |
| Rapid-refill breaker code | absent | present (chunks.159.mjs:1391) |
| Cold-compact flag | absent | `tengu_cold_compact` (chunks.159.mjs:1405) |
| Window experiment flag | absent | `tengu_amber_redwood` (chunks.159.mjs:1284) |

A beta header dated **2026-04-09** cannot exist in a build that pre-dates the **2026-03-31** leak. So:

```
2.1.88 source-tree  (≤ 2026-03-31)   ─────►   2.1.112 binary  (≥ 2026-04-09)
                          OLDER                                NEWER
```

This document treats the source-tree as the **old** version and the v2.1.112 binary as the **new** version. Where the previous `CROSS_VALIDATION.md` says "source has it, binary doesn't" it should be read as "**v2.1.88 had it; v2.1.112 dropped it**".

A second caveat: the source-tree is *the codebase*, not a public build. Several of its features are gated behind Bun build-time `feature(...)` macros (`KAIROS`, `REACTIVE_COMPACT`, `CACHED_MICROCOMPACT`, `CONTEXT_COLLAPSE`, `PROACTIVE`, `EXPERIMENTAL_SKILL_SEARCH`, `COMMIT_ATTRIBUTION`, `PROMPT_CACHE_BREAK_DETECTION`). Whether they shipped in the public 2.1.88 binary depends on that build's flag matrix — the source-tree shows the *capabilities* of v2.1.88, not necessarily what users got. See [§ 5: Feature-Gated Code Paths](#5-feature-gated-code-paths) for which gates appear to have flipped.

---

## 1. Diff Map (At a Glance) — Tiered

### High-confidence changes (Tier 1)

These are **not feature-gated** in source — they are ordinary code paths whose absence/presence in the 2.1.112 binary therefore reflects a real version transition.

| Subsystem | v2.1.88 | v2.1.112 | Change |
|---|---|---|---|
| `compactConversation` signature | 7 params | 8 params (8th: `stripNonEssential`) | **added arg** |
| `getCompactUserSummaryMessage` (`b18`) signature | 4 params (`recentMessagesPreserved` 4th) | **5 params** (`hasReplCleared` 5th) | **added arg** |
| `b18`'s autonomous-mode trailer text | added when `(KAIROS\|PROACTIVE) && proactiveModule.isProactiveActive()` | **absent** | removed (or gated off) |
| `b18`'s "Your REPL VM state has been cleared..." text | **absent** | present (when 5th arg true) | **added** |
| Per-turn `microcompactMessages` body (codebase) | calls `maybeTimeBasedMicrocompact` then `cachedMicrocompactPath` (both default-off for public users) | no-op stub `_c` | scaffolding **removed**; default-user behavior unchanged |
| Per-turn proactive thinking-block clearing | `clear_thinking_20251015` via `C85`/API `context_management` | **same** — `C85` (chunks.194:741) still pushes `clear_thinking_20251015` into the request body | **unchanged** for default users |
| Per-turn proactive tool_result clearing (client-side) | `tengu_slate_heron`-gated, default off | gone | codebase change; user-impact only for cohorts with flag flipped on |
| Time-based MC trigger config (`evaluateTimeBasedTrigger`, 60-min gap) | runtime-flag (`tengu_slate_heron.enabled`), **default false** | absent (no `gapThresholdMinutes`, `tengu_slate_heron`) | **removed**, was default-off in source |
| `tengu_compact_streaming_retry` runtime flag | read in `streamCompactSummary` | **absent** | **removed** |
| `MAX_COMPACT_STREAMING_RETRIES = 2` constant | present | **absent** (single attempt only) | **removed** |
| KEEP-RECENT MC algorithm (`qD4`) | reachable from per-turn loop | reachable only from `d85` reject path | **trigger repurposed** |
| `qD4`'s `trigger` field | settable (was `"time_based"` semantics in source) | hardcoded `"context_hint"` | restructured |
| `qD4`'s `keepRecent` source | from `tengu_slate_heron.keepRecent` (default 5) | hardcoded `Q6A = 5` (chunks.194.mjs:964) | de-configured |
| Rapid-refill breaker (`a_7=3`, `jLK=3`, `okK` thrash error, `consecutiveRapidRefills`/`rapidRefillBreakerTripped`) | **absent** | present in `QkK` (chunks.159.mjs:1391-1412) | **added** |
| Cold compact (`tengu_cold_compact` flag + `pDY = 5,400,000ms` 1.5h-cold check + `stripNonEssential` 8th-param plumbing) | **absent** | present (chunks.159.mjs:1405) | **added** |
| `tengu_amber_redwood` window experiment in `Jn` | **absent** | present (chunks.159.mjs:1284) | **added** |
| `context-hint-2026-04-09` beta header + `d85`/`NJ7` reject handler + `tengu_hazel_osprey` master switch + `tengu_context_hint_reject` / `tengu_context_hint_busy_fallback` events | **absent** (date post-dates leak) | present (chunks.194.mjs) | **added** |

### Medium-confidence changes (Tier 2)

These are `feature(...)`-gated in source. Their absence in 2.1.112 binary is **codebase-level** evidence — but the same flags may have been off in 2.1.88's public build, so user-visible behavior may be unchanged.

| Subsystem | Source gate | v2.1.112 binary | Inference |
|---|---|---|---|
| Cached microcompact (`cachedMicrocompactPath`, `tengu_cached_microcompact` event, `pendingCacheEdits` API of microCompact.ts) | `feature('CACHED_MICROCOMPACT')` | function names absent, but **`cache_edits` mechanism + `cachedMCEnabled` state field survive** in chunks.85 / chunks.194 (the implementation was likely refactored, not removed wholesale) | **restructured, not removed** |
| `feature('PROACTIVE') \|\| feature('KAIROS')` autonomous-mode trailer in compact summary | `feature(...)` gated | text absent | likely DCE'd; KAIROS as a broader feature still ships (briefs, cron, dream, push) |
| KAIROS `sessionTranscriptModule.writeSessionTranscriptSegment` post-compact write | `feature('KAIROS')` | absent | likely DCE'd |
| `feature('CONTEXT_COLLAPSE')` runtime (`isContextCollapseEnabled`, `resetContextCollapse`, `marble_origami` querySource) | `feature(...)` gated | runtime absent; **persistence shims `XtY`/`MtY` survive** (chunks.191.mjs:1102/1112) | already noted in `dead_code_audit.md` |
| `feature('EXPERIMENTAL_SKILL_SEARCH')` skill-attachment stripping | `feature(...)` gated | `stripReinjectedAttachments` not in chunks.159 | likely DCE'd |
| Session-memory **compact-tier integration** (`trySessionMemoryCompaction` called from `autoCompactIfNeeded`) | not `feature()`-gated, but body returns null when SM empty | **callsite absent** in `QkK`; SessionMemory module otherwise survives (chunks.218: `tengu_session_memory`, extraction events) | **integration removed**, module retained |
| `feature('REACTIVE_COMPACT')` reactive-only-mode handlers | `feature(...)` gated; uses `tengu_cobalt_raccoon` | `reactiveCompact.*` / `isReactiveOnlyMode` / `compactViaReactive` absent — but `tengu_cobalt_raccoon` flag is **still read** by `bx()` and used in `gDY`'s gate cascade (with different semantics; see Tier 3) | **mechanism gone, flag repurposed** |

### Tier 3 — Restructured / Repurposed

| Subsystem | v2.1.88 source | v2.1.112 binary | Note |
|---|---|---|---|
| `tengu_cobalt_raccoon` flag | inside `feature('REACTIVE_COMPACT')`, suppresses autocompact for ant + reactive mode | read by `bx()` (chunks.101:1532), used in `gDY`'s `if (bx() && !Z38(K, _)) return false` gate | flag preserved; gate semantic changed from "suppress for ant" to "ant + non-env-window-source gate" |
| `qD4` KEEP-RECENT MC | algorithm body is `maybeTimeBasedMicrocompact`, triggered by 60-min gap | identical algorithm body, triggered only by 422/424 reject | algorithm preserved, trigger replaced |
| `cache_edits` insertion mechanism | `cachedMicrocompactPath` adds blocks, `markToolsSentToAPIState` lifecycle | `VJ7(...)` adds cache_edits (chunks.194.mjs:2345), `cachedMCEnabled` tracked in state | implementation refactored, capability preserved |
| `session_memory` recursion guard in `shouldAutoCompact` | `if (querySource === 'session_memory' \|\| 'compact') return false` | identical (chunks.159.mjs:1366) | unchanged — implies SessionMemory module still spawns forked agents that reach `gDY` |
| `PROMPT_CACHE_BREAK_DETECTION` `notifyCompaction`/`notifyCacheDeletion` calls | `feature(...)`-gated, multiple sites | event `tengu_prompt_cache_break` and equivalent inline notify (`nj6`) survive in chunks.85 | feature appears effectively on |

### Unchanged (validations)

| Subsystem | Status |
|---|---|
| Threshold math (window − min(maxOut, 20k) − 13k auto-compact buffer; warning −20k; error −20k; blocking −3k) | identical |
| Post-compact constants (5 files / 50k budget / 5k per file / 25k skill budget / 5k per skill) | identical |
| `MAX_PTL_RETRIES = 3` | identical |
| `MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES = 3` | identical |
| `IMAGE_MAX_TOKEN_SIZE = 2000` | identical |
| `groupMessagesByApiRound` ↔ `AR6` (chunks.101.mjs:578) | line-for-line identical |
| `truncateHeadForPTLRetry` ↔ `KLK` (chunks.159.mjs:512) | identical algorithm |
| `compactConversation` 8-phase pipeline (PreCompact hook → prompt → cache-prefix → streaming → PTL retry → restore → reminders → SessionStart hook → boundary marker → telemetry → PostCompact hook) | identical |
| `formatCompactSummary` (`d0z`) — strip `<analysis>`, replace `<summary>` with `Summary:\n` | identical |
| `mergeHookInstructions` (`r_7`) | line-for-line identical |
| `annotateBoundaryWithPreservedSegment` (`Zr1`) | identical |
| `buildPostCompactMessages` (`Yt`) — boundaryMarker → summary → keep → attachments → hookResults | identical |
| Cache-prefix sharing (`tengu_compact_cache_prefix`, `runForkedAgent`, `skipCacheWrite: true`) | identical |
| Compact prompt body (NO_TOOLS_PREAMBLE + BASE_COMPACT_PROMPT + NO_TOOLS_TRAILER) | identical |
| Skill attachment truncation (head-keep, `[... skill content truncated]` marker) | identical |
| Error message strings | identical |
| Boundary marker `compactMetadata` (trigger, preCompactTokenCount, durationMs, postCompactTokenCount, preCompactDiscoveredTools, preservedSegment) | identical |
| `tengu_compact_cache_sharing_success` / `tengu_compact_cache_sharing_fallback` telemetry | identical |

---

## 2. Removed in v2.1.112

> **Read first**: each item below is labeled with its confidence tier. Tier 1 = high-confidence removal (not feature-gated, gone wholesale). Tier 2 = feature-gated in source AND absent in binary (codebase change; user impact depends on whether the flag was on for public 2.1.88). Restructured items moved to [§ 3.B](#3b-restructured-not-removed).

### 2.1 [Tier 1 codebase / Tier 2 user-visible] Per-Turn Time-Based MC Trigger (`tengu_slate_heron`)

**v2.1.88** (`microCompact.ts:253-293, 446-530`, `timeBasedMCConfig.ts`): a runtime-flag-controlled (not feature-gated) per-turn trigger. The function `evaluateTimeBasedTrigger` checks if the gap since the last main-loop assistant message exceeds `gapThresholdMinutes` (default 60); if so, `maybeTimeBasedMicrocompact` clears all but the most-recent N (default 5) compactable tool_results before the request. Configured by GrowthBook key `tengu_slate_heron`.

**Default state**: `TIME_BASED_MC_CONFIG_DEFAULTS.enabled = false` (timeBasedMCConfig.ts:31). So unless a GB cohort flipped this on, this path was a no-op for public users.

**v2.1.112**: zero hits for `tengu_slate_heron`, `evaluateTimeBasedTrigger`, `maybeTimeBasedMicrocompact`, `gapThresholdMinutes`. Code dropped from binary. **The same `qD4` algorithm body survives** but its only caller is the new `d85` reject handler (server-driven, not gap-driven).

**User-visible impact**: NONE for default users (was off in 2.1.88 too). Real impact only for cohorts that had `tengu_slate_heron.enabled = true` — they lost the proactive 60-min gap trigger. The KEEP-RECENT MC algorithm itself still fires, just via a different (server-driven) trigger.

**Verification**:
```
$ grep -cE "tengu_slate_heron|gapThresholdMinutes|evaluateTimeBasedTrigger|maybeTimeBasedMicrocompact" chunks.*.mjs
(no matches)
```

**Why removed.** A 60-min gap is a heuristic for "cache probably cold". The new server-driven `context-hint` path replaces it with a precise signal. See [§ 3.4](#34-context-hint-2026-04-09-reject-path).

### 2.2 [Tier 1] Streaming-Retry of Compact Summary

**v2.1.88** (`compact.ts:131, 1251-1256, 1363-1373`):

```typescript
const MAX_COMPACT_STREAMING_RETRIES = 2
// ...
const retryEnabled = getFeatureValue_CACHED_MAY_BE_STALE('tengu_compact_streaming_retry', false)
const maxAttempts = retryEnabled ? MAX_COMPACT_STREAMING_RETRIES : 1
// ...
if (attempt < maxAttempts) {
  logEvent('tengu_compact_streaming_retry', ...)
  await sleep(getRetryDelay(attempt), ...)
  continue
}
```

**v2.1.112**: zero hits for `MAX_COMPACT_STREAMING_RETRIES` or `tengu_compact_streaming_retry` or `tengu_compact_streaming_retry`. Single attempt only — `vI6`'s streaming summary call has no retry loop.

**Why removed.** `tengu_compact_streaming_retry` defaulted to `false` — likely never shipped on. Code dropped as cleanup.

### 2.3 [Tier 1] Compact-summary Autonomous-Mode Trailer

**v2.1.88** (`prompt.ts:362-368`): `getCompactUserSummaryMessage` appends, when `(feature('PROACTIVE') || feature('KAIROS')) && proactiveModule?.isProactiveActive()`:

> "You are running in autonomous/proactive mode. This is NOT a first wake-up — you were already working autonomously before compaction. Continue your work loop: pick up where you left off based on the summary above. Do not greet the user or ask what to work on."

**v2.1.112** `b18` (chunks.101.mjs:804-825): the autonomous-mode text is gone. The function now has 5 params instead of 4 — the 5th is `hasReplCleared` which prepends a different message:

> "Your REPL VM state has been cleared as part of this compaction. Variables defined in REPL calls before this point are no longer accessible — redefine any you still need."

So this is **simultaneously a Tier 1 removal AND a Tier 1 addition**: autonomous-mode trailer out, REPL-cleared message in. Note: this directly **contradicts** `CROSS_VALIDATION.md § B Error 5`, which called the REPL-cleared text "fictional". It is in the v2.1.112 binary; the prior 07_compact docs were correct.

**Why.** Speculation: the REPL VM (a Bun-based JS execution environment for evaluating user-pasted code) was added in some 2.1.x version after 2.1.88; clearing its state on compact is a sensible side effect. The autonomous-mode trailer was specific to KAIROS in source — KAIROS as a *broader* feature still ships (briefs, cron, dream, etc.), but compact's KAIROS hooks specifically are gone.

### 2.4 [Tier 1 codebase / Tier 3 user-visible] Per-turn `microcompactMessages` Body

**v2.1.88 source** (`microCompact.ts:253-293`):
```typescript
export async function microcompactMessages(messages, toolUseContext, querySource) {
  // ① ALWAYS runs (just UI-state flag)
  clearCompactWarningSuppression()

  // ② RUNTIME-FLAG GATED (tengu_slate_heron.enabled), DEFAULT FALSE
  const timeBasedResult = maybeTimeBasedMicrocompact(messages, querySource)
  if (timeBasedResult) return timeBasedResult

  // ③ feature('CACHED_MICROCOMPACT') gated + ant-only checks
  if (feature('CACHED_MICROCOMPACT')) {
    const mod = await getCachedMCModule()
    if (mod.isCachedMicrocompactEnabled() &&
        mod.isModelSupportedForCacheEditing(model) &&
        isMainThreadSource(querySource)) {
      return await cachedMicrocompactPath(messages, querySource)
    }
  }
  return { messages }
}
```

**v2.1.112 binary** (chunks.85.mjs:1207-1211):
```javascript
async function _c(q, K, _) { return a04(), { messages: q } }
```

**The deep-review correction**: my earlier framing of "per-turn MC gutted" is **codebase-true but user-visible-misleading**. The actual situation:

| For who | 2.1.88 source behavior | 2.1.112 binary behavior | Δ |
|---|---|---|---|
| Default public user (no GB overrides, non-ant) | only ① runs (the "wrap" stages ② and ③ short-circuit on default-off flags) | only ① runs (`a04()` is the same as `clearCompactWarningSuppression`) | **no user-visible change** |
| User with `tengu_slate_heron.enabled = true` GB override (cohort experiment, default false) | ② fires every turn that gap > 60min | ② code path doesn't exist | **lost the time-based MC** |
| Ant user with `CACHED_MICROCOMPACT` build flag | ③ fires when cache-warm + main thread | ③ entry path doesn't exist (but `cache_edits` block insertion still exists at chunks.194.mjs:2345 — wired differently) | **entry restructured** |

So the *codebase* dropped per-turn MC scaffolding, but the *default user behavior* didn't change — both versions effectively no-op the per-turn entry for default users. The "loss" is real only for the experimental cohorts that had non-default GB / build-flag values.

Why this matters: per-turn microcompact is an important *concept* (proactive, between-turn token reduction). The concept isn't dead in 2.1.112 — it's just been **moved to two other places**:
- **API-level proactive**: `clear_thinking_20251015` strategy still sent per-request via `C85` → `context_management: { edits: [...] }` API beta. Continues to clear thinking blocks each turn.
- **Reactive on overflow**: `qD4` KEEP-RECENT MC fires from `d85` reject handler when server returns 422/424. Clears tool_results post-hoc rather than pre-emptively.

What's *genuinely* gone:
- Client-side proactive *tool_result* clearing per turn (was experimental in 2.1.88, default off)
- Client-side proactive *cache_edits* insertion per turn (was ant-only in 2.1.88)

What survives:
- API-level proactive *thinking* clearing (works for everyone)
- Reactive tool_result clearing (new in 2.1.112, server-driven)
- Cold-compact pre-API stripping (new in 2.1.112, only when cache cold ≥ 90 min)

### 2.5 [Tier 2] Session-Memory Compaction Tier (`trySessionMemoryCompaction`)

**v2.1.88** (`autoCompact.ts:287-310`, `commands/compact/compact.ts:55-83`): `autoCompactIfNeeded` calls `trySessionMemoryCompaction` BEFORE `compactConversation`. If the SM tier accepts (uses extracted session memory file as a substitute for an LLM compact call), no LLM call runs. The implementation is in `services/compact/sessionMemoryCompact.ts` (630 lines), with config defaults `minTokens=10_000`, `maxTokens=40_000`, `minTextBlockMessages=5`. Configurable via GrowthBook `tengu_sm_compact_config`.

**v2.1.112**: **the compact-tier integration is absent.** Verified by:
- 0 hits for `trySessionMemoryCompaction`, `tengu_sm_compact`, `truncateSessionMemoryForCompact`, `isSessionMemoryEmpty` across all chunks.
- `QkK`'s body (chunks.159.mjs:1379+) has no SM-substitution branch — it falls through directly from gates to `vI6`.

**However**: the broader SessionMemory module **survives** in 2.1.112:
- `tengu_session_memory` flag (chunks.218.mjs:930) controls extraction.
- `tengu_session_memory_extraction`, `tengu_session_memory_file_read` events are emitted.
- The `session_memory` querySource is recognized as a forked-agent label (chunks.218.mjs:1093-1094).
- The recursion guard `if (z === "session_memory" || z === "compact") return false` survives in `gDY` (chunks.159.mjs:1366).

So this is a **scoped removal**: SessionMemory continues to extract and persist, but it is no longer used as a substitute for compact. The most likely explanation: SM-as-compact-substitute was an experimental shortcut; the new `context-hint` server path made it redundant.

### 2.6 [Tier 2] `feature('REACTIVE_COMPACT')` Mechanics

**v2.1.88** wires reactive compact through:
- `commands/compact/compact.ts:35-37` — conditional require of `services/compact/reactiveCompact.js`
- `autoCompact.ts:189-199` — when `REACTIVE_COMPACT` AND `tengu_cobalt_raccoon`, `shouldAutoCompact` returns false
- `commands/compact/compact.ts:88-92` — `if (reactiveCompact?.isReactiveOnlyMode())` short-circuits manual `/compact` to `compactViaReactive`

**v2.1.112**: 0 hits for `reactiveCompact`, `isReactiveOnlyMode`, `compactViaReactive`, `reactiveCompactOnPromptTooLong`, `isWithheldPromptTooLong`. The reactive-compact mechanism per se is gone.

**However**: the `tengu_cobalt_raccoon` flag itself **survives** in chunks.101.mjs:1532, read by `bx()`, used in `gDY` (chunks.159.mjs:1370) as a gate condition: `if (bx() && !Z38(K, _)) return false`. The flag persists; the *consumer* changed. See [§ 3.B Tier 3 restructured](#3b-restructured-not-removed).

The functional niche (reactive recovery from server-detected overflow) is filled by the new `context-hint-2026-04-09` path with a different mechanism (HTTP 422/424 + KEEP-RECENT MC + retry), not reactive compact's "drop oldest groups + LLM call".

### 2.7 [Tier 2] `feature('CACHED_MICROCOMPACT')` Path Definitions

**v2.1.88** (`microCompact.ts:53-135, 276-399`): module-level state (`cachedMCModule`, `cachedMCState`, `pendingCacheEdits`) lazily loaded behind `feature('CACHED_MICROCOMPACT')`. The function `cachedMicrocompactPath` walks tool_use_ids, registers them in state, decides which to delete, generates `cache_edits` blocks, and queues them for the next API request. Telemetry: `tengu_cached_microcompact`.

**v2.1.112**: 0 hits for `cachedMicrocompactPath`, `tengu_cached_microcompact`, `getCachedMCModule`, `markToolsSentToAPIState`, `consumePendingCacheEdits`, `getPinnedCacheEdits`.

**However**, the underlying `cache_edits` mechanism is **alive in 2.1.112**:
- chunks.194.mjs:2345 — `Added cache_edits block with ${J.edits.length} deletion(s) to message[${X}]`
- chunks.194.mjs:2316-2317 — cache_reference deduplication
- chunks.194.mjs:2369 — `cache_reference: D.tool_use_id` (per-tool-use cache references)
- chunks.85.mjs has `cachedMCEnabled` state field tracked through cache-key hashing (lines 786, 829, 854, 898, 925, 976, 999, 1131)

So the **infrastructure is preserved**, but the per-turn ant-only cached MC entry path is gone. The cache_edits block insertion may now be tied to the context-hint reject path or another caller — without symbol resolution we can't be 100% sure who triggers `VJ7(...)` (the cache_edits inserter at chunks.194.mjs:2345). What's clear is: **cached microcompact's data path is not eliminated; only its 2.1.88-style entry-point is**.

### 2.8 [Tier 2] KAIROS sessionTranscript Writer

**v2.1.88** (`compact.ts:715-717, 1059-1063`): `feature('KAIROS')` triggers `sessionTranscriptModule?.writeSessionTranscriptSegment(messages)` after compact completes (fire-and-forget).

**v2.1.112**: 0 hits for `writeSessionTranscriptSegment`, `sessionTranscriptModule`. The KAIROS feature otherwise lives on (chunks.1, 64, 84, 98, 101, 117, 135, 139, 149, 152, 189, 209, 212, 222: `kairosActive` state field, `tengu_kairos_brief`, `tengu_kairos_cron`, `tengu_kairos_loop_dynamic`, `tengu_kairos_dream`, `tengu_kairos_push_notifications`, etc.). So **KAIROS itself is not gone — only its compact-time hook**.

### 2.9 [Tier 2] Context-Collapse Runtime

**v2.1.88** (`autoCompact.ts:179-223`, `postCompactCleanup.ts:42-50`): `feature('CONTEXT_COLLAPSE')` integrates a separate `marble_origami` ctx-agent. When `isContextCollapseEnabled()`, autocompact yields the headroom problem to collapse. `runPostCompactCleanup` calls `resetContextCollapse()` for main-thread compacts.

**v2.1.112** (per `dead_code_audit.md`): runtime is DCE'd; only the persistence shims survive — `XtY` (`recordContextCollapseCommit`, chunks.191.mjs:1102) and `MtY` (`recordContextCollapseSnapshot`, chunks.191.mjs:1112). Both are write-only; the JSONL parser recognizes the marble-origami types for forward compatibility but no caller produces them.

### 2.10 [Tier 2] `EXPERIMENTAL_SKILL_SEARCH` Stripping

**v2.1.88** (`compact.ts:211-223`): `stripReinjectedAttachments` removes `skill_discovery`/`skill_listing` attachments before the compact LLM call.

**v2.1.112**: 0 hits in `chunks.159` for `stripReinjectedAttachments`. `skill_listing` still flows through other chunks (e.g. `chunks.155.mjs:2292`), so it's a real attachment type, but the compact-time stripping appears to be DCE'd.

---

## 3. Added in v2.1.112

These features have **zero references** in the 2.1.88 source-tree but are concretely present in the binary:



### 3.1 Rapid-Refill Breaker

A second circuit breaker complementing the consecutive-failure breaker. Trips when **3 successful compactions** each fire within a **3-turn** window of each other — i.e. compaction runs, then *immediately* triggers again, three times in a row.

```javascript
// chunks.159.mjs:1391-1412 (excerpt)
let H = Y?.compacted === !0 && Y.turnCounter < a_7
        ? (Y?.consecutiveRapidRefills ?? 0) + 1
        : 0;
// ...
if (H >= jLK) return { /* ... */, rapidRefillBreakerTripped: !0 };
// ...
return { /* ... */, consecutiveRapidRefills: H };
```

Constants: `a_7 = 3` (turn-window), `jLK = 3` (refill threshold). When tripped, the agent loop yields a user-facing error (`okK`):

> "Autocompact is thrashing. Recent context is so large that compacting and re-compacting are no longer freeing room. Try `/clear` to start a fresh session, or split your work."

**Diagnostic insight.** A "compact, immediately threshold-breach, compact again" loop means a single tool result is so large that even the post-compact context starts already at-threshold. Each compact then burns ~$0.05 and several seconds for nothing. The breaker turns "silent token-burn" into a visible message asking the user to act.

### 3.2 Cold Compact (`tengu_cold_compact`, `stripNonEssential`)

A new code path for the case where the prompt cache has been **cold for ≥ 90 minutes** (`pDY = 5_400_000ms`). When that's true AND the GrowthBook flag `tengu_cold_compact` is on, the binary calls `vI6` with the new 8th argument `stripNonEssential = true`:

```javascript
// chunks.159.mjs:1405
X = FDY() && u8("tengu_cold_compact", !1);
// ... later passes X as the 8th vI6() arg
```

Inside `vI6`:

```javascript
// chunks.159.mjs:611, 680
{ ..., stripNonEssential: w }
{ ..., stripNonEssential: w, ... }
```

The `stripNonEssential` mode removes images/documents and truncates tool_result content **before** the compact LLM call so the cold-rewrite cost is minimized. The cold compact telemetry events distinguish this from the warm path.

**Why this is new.** v2.1.88 had no equivalent. The closest analog there was time-based microcompact (60-min gap → clear old tool_results). v2.1.112 generalizes: not just the tool-result trimming but also images/documents, and not just clearing-in-place but a single-pass strip-down for the rewrite.

### 3.3 Window Experiment (`tengu_amber_redwood`)

```javascript
// chunks.159.mjs:1284
let z = z0() ? u8("tengu_amber_redwood", "") : "";
```

Reads a string-typed GrowthBook flag in `Jn` (resolveWindowSource). Format is documented as int (e.g. `200000`) or unit-suffixed string (`200k` / `1m`). Lets Anthropic test alternative effective window sizes per cohort without redeploying. v2.1.88 source has no equivalent flag.

### 3.4 `context-hint-2026-04-09` Reject Path

The single biggest architectural addition. When `tengu_hazel_osprey` is on:
1. Outgoing requests carry the beta header `context-hint-2026-04-09` and the body field `context_hint: { enabled: true }`.
2. The server can preemptively respond with **422** (will-overflow) or **424** (overflowed-mid-stream) instead of letting the request fail with `prompt_too_long`.
3. Client handler `d85` / `NJ7` (chunks.194.mjs:856-887) responds:
   - Run `qD4` (KEEP-RECENT MC) — clear all but the last 5 tool_results, hardcoded `trigger: "context_hint"`.
   - Latch a "thinking-clear" once per session (the `clear_thinking_20251015` strategy).
   - Retry the request once.

Telemetry: `tengu_context_hint_reject`, `tengu_context_hint_busy_fallback`. Constants: `I85 = "context-hint-2026-04-09"` (chunks.194.mjs:846), `Q6A = 5` keep-recent (chunks.194.mjs:964).

This **subsumes** the v2.1.88 functions of:
- Time-based MC (now driven by server signal instead of 60-min gap)
- Reactive compact (now driven by 422/424 instead of `prompt_too_long` text)
- Cached MC (no longer needed — the server can edit the cache key directly via context_hint)

### 3.5 `b18` 5th Param `hasReplCleared` + REPL-VM-Cleared Message

Source's `getCompactUserSummaryMessage` has 4 params (`summary, suppressFollowUpQuestions?, transcriptPath?, recentMessagesPreserved?`). The v2.1.112 binary's `b18` has 5:

```javascript
// chunks.101.mjs:804-825 (decompiled)
function b18(q, K, _, z, Y) {
    let O = `This session is being continued from a previous conversation that ran out of context. The summary below covers the earlier portion of the conversation.

${d0z(q)}`;
    if (_) O += `\n\nIf you need specific details from before compaction (like exact code snippets...), read the full transcript at: ${_}`;
    if (z) O += `\n\nRecent messages are preserved verbatim.`;
    if (Y) O += `\n\nYour REPL VM state has been cleared as part of this compaction. Variables defined in REPL calls before this point are no longer accessible — redefine any you still need.`;
    if (K) return `${O}\nContinue the conversation...`;
    return O;
}
```

The 5th arg `Y = hasReplCleared` controls a new conditional: when true, prepend the REPL-VM-cleared message to the summary so the model knows local execution state was reset. Source has no equivalent — REPL VM (a Bun-based JS-execution sandbox for `/exec`-style commands) was likely added between 2.1.88 and 2.1.112, with this compact-side notification added at the same time.

### 3.6 `compactConversation` 8th Param `stripNonEssential`

Source had 7:
```typescript
compactConversation(messages, context, cacheSafeParams,
  suppressFollowUpQuestions, customInstructions?, isAutoCompact=false, recompactionInfo?)
```

Binary has 8:
```javascript
async function vI6(q, K, _, z, Y, A=!1, O, w=!1)
//                                       ^cold-compact bool
```

`w=!1` is the cold-compact flag. The internal pipeline branches on it for image/doc stripping and tool_result truncation depth.

### 3.7 `tengu_hazel_osprey` Master Switch

```javascript
// chunks.194.mjs:791
return u8("tengu_hazel_osprey", !1)
```

A single flag that gates the *entire* `context-hint` machinery. Off by default. Lets Anthropic dark-launch the new server-driven path one cohort at a time without affecting the existing local-compact pipeline.

---

## 3.B Restructured (Not Removed)

> **Read first**: per-turn microcompact functionality is best understood as **redistributed across three layers**, not "gutted":
>
> | Layer | 2.1.88 | 2.1.112 |
> |---|---|---|
> | UI state flag (warning suppression) | `clearCompactWarningSuppression` (microCompact.ts:259) | `a04()` (chunks.85.mjs:~1147) — same |
> | API-level proactive MC for thinking blocks | `getAPIContextManagement` (apiMicrocompact.ts) sends `clear_thinking_20251015` | `C85` (chunks.194.mjs:741) sends `clear_thinking_20251015` — same |
> | Client-side proactive MC for tool_results | `maybeTimeBasedMicrocompact` (default-off) + cached MC (ant-only) | none (replaced by reactive 422/424 handler `d85` → `qD4`) |
>
> So "per-turn MC" as a concept is alive: every turn, the API receives the `clear_thinking_20251015` strategy (when `hasThinking`). What changed is that the *client-side experimental tool_result clearing* (which was off by default for typical users) is gone, and is replaced by *server-driven recovery* on actual overflow.


Items moved here after rewrite — these are NOT removals. The corresponding flag/algorithm/string survives in the v2.1.112 binary, but its surrounding wiring or trigger has been changed.

### 3.B.1 `tengu_cobalt_raccoon` flag — gate semantics changed

**v2.1.88 source** (`autoCompact.ts:189-199`):
```typescript
if (feature('REACTIVE_COMPACT')) {
  if (getFeatureValue_CACHED_MAY_BE_STALE('tengu_cobalt_raccoon', false)) {
    return false  // suppress proactive autocompact entirely for ant + reactive mode
  }
}
```

**v2.1.112 binary** (`bx()` chunks.101.mjs:1532, used in `gDY` chunks.159.mjs:1370):
```javascript
function bx() {
    if (I7()) return !1;
    return u8("tengu_cobalt_raccoon", !1)
}
// ... in gDY (shouldAutoCompact):
if (bx() && !Z38(K, _)) return !1;
```

The flag is the *same string*, the consumer changed: 2.1.88 uses it (conditional on REACTIVE_COMPACT being on at build time) to disable autocompact entirely for ant users. 2.1.112 uses it (unconditionally — no `feature()` wrapper) combined with `!Z38(K, _)` (window-not-from-env-or-settings) to gate. Different semantics.

### 3.B.2 `qD4` KEEP-RECENT MC algorithm — trigger changed

The function body of 2.1.88's `maybeTimeBasedMicrocompact` (microCompact.ts:446-530) is **algorithmically equivalent** to v2.1.112's `qD4` (chunks.85.mjs:1235-1274):
- Both: collect compactable tool_use_ids → keep the last N → for each older id, replace tool_result content with `"[Old tool result content cleared]"` (the `sR8` constant) → emit `tengu_time_based_microcompact` event.
- Both: log "[KEEP-RECENT MC]" debug line, call notify-cache-deletion / suppress-warning side effects.

Differences:
- **Source caller**: `microcompactMessages` (per-turn). **Binary caller**: `d85`/`NJ7` reject path (only on 422/424).
- **Source `trigger` field**: dynamically set by caller. **Binary `trigger` field**: hardcoded `"context_hint"` (chunks.85.mjs:1267).
- **Source `keepRecent`**: from `tengu_slate_heron.keepRecent` GB config. **Binary `keepRecent`**: hardcoded `Q6A = 5` (chunks.194.mjs:964).
- **Source returns**: `{messages: result}`. **Binary returns**: `{messages, tokensSaved, clearedIds}` (extra fields used by reject handler).

### 3.B.3 `cache_edits` mechanism — caller changed

**v2.1.88 source** uses cache_edits via `cachedMicrocompactPath` (entry from per-turn `microcompactMessages`).

**v2.1.112 binary** uses cache_edits via `VJ7(...)` at chunks.194.mjs:2345 with logging "Added cache_edits block with N deletion(s)". The caller is in chunks.194 (the same chunk as the context-hint reject path), so the cache_edits flow is plausibly tied to context_hint or some other reactive trigger rather than the per-turn entry.

Either way, **the cache_edits API beta is alive in 2.1.112**, contradicting an earlier (deleted) framing of "cached MC removed".

### 3.B.4 `session_memory` querySource recursion guard

`gDY` (chunks.159.mjs:1366) keeps the source's `if (z === "session_memory" || z === "compact") return false` guard verbatim. Combined with the SessionMemory module surviving in chunks.218, this implies SessionMemory still spawns forked agents that hit `gDY` — just not as a compact-tier substitute.

### 3.B.5 `PROMPT_CACHE_BREAK_DETECTION` — feature gate effectively on

The feature is `feature('PROMPT_CACHE_BREAK_DETECTION')`-gated in source. The 2.1.112 binary emits `tengu_prompt_cache_break` (chunks.85.mjs:989) and has `notifyCacheDeletion` / `notifyCompaction` equivalents (`nj6`, `i04` in chunks.85). So this gate appears flipped on for the public 2.1.112 build — and likely was on for 2.1.88 public too.

---

## 4. Unchanged (Validations)

For every constant the existing `CROSS_VALIDATION.md` listed under § A, the source-tree match is genuine and indicates **no version drift**:

| Constant | Value | Identical in 2.1.88 (`autoCompact.ts`/`compact.ts`) and 2.1.112 binary |
|---|---|---|
| `MAX_OUTPUT_TOKENS_FOR_SUMMARY` / `uDY` | 20_000 | ✓ |
| `AUTOCOMPACT_BUFFER_TOKENS` / `t_7` | 13_000 | ✓ |
| `WARNING_THRESHOLD_BUFFER_TOKENS` / `mDY` | 20_000 | ✓ |
| `ERROR_THRESHOLD_BUFFER_TOKENS` / `BDY` | 20_000 | ✓ |
| `MANUAL_COMPACT_BUFFER_TOKENS` / `e_7` | 3_000 | ✓ |
| `MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES` / `wLK` | 3 | ✓ |
| `MAX_PTL_RETRIES` / `qLK` | 3 | ✓ |
| `POST_COMPACT_MAX_FILES_TO_RESTORE` / `kx8` | 5 | ✓ |
| `POST_COMPACT_TOKEN_BUDGET` / `yDY` | 50_000 | ✓ |
| `POST_COMPACT_MAX_TOKENS_PER_FILE` / `LDY` | 5_000 | ✓ |
| `POST_COMPACT_SKILLS_TOKEN_BUDGET` / `RDY` | 25_000 | ✓ |
| `POST_COMPACT_MAX_TOKENS_PER_SKILL` / `hDY` | 5_000 | ✓ |
| `IMAGE_MAX_TOKEN_SIZE` / `r4z` | 2000 | ✓ |
| `TIME_BASED_MC_CLEARED_MESSAGE` / `sR8` | `"[Old tool result content cleared]"` | ✓ (string preserved exactly) |
| `PTL_RETRY_MARKER` / `ayK` | `"[earlier conversation truncated for compaction retry]"` | ✓ |
| `Q6A` (keep-recent default) | 5 | ✓ |

### Functions That Survived Verbatim

These have line-level binary equivalents:

| Source TS | Binary obfuscated | Binary location |
|---|---|---|
| `getEffectiveContextWindowSize` | `Yn` | chunks.159.mjs:1307 |
| `getAutoCompactThreshold` | `v38` | chunks.159.mjs:1320 |
| `calculateTokenWarningState` | `UM6` | chunks.159.mjs:1334 |
| `isAutoCompactEnabled` | `z0` | chunks.159.mjs |
| `shouldAutoCompact` | `gDY` | chunks.159.mjs:1365 |
| `autoCompactIfNeeded` | `QkK` | chunks.159.mjs:1379 |
| `compactConversation` | `vI6` | chunks.159.mjs:574 |
| `partialCompactConversation` | `zLK` | chunks.159.mjs:749 |
| `truncateHeadForPTLRetry` | `KLK` | chunks.159.mjs:512 |
| `groupMessagesByApiRound` | `AR6` | chunks.101.mjs:578 |
| `mergeHookInstructions` | `r_7` | chunks.159.mjs:566 |
| `buildPostCompactMessages` | `Yt` | chunks.159.mjs:551 |
| `annotateBoundaryWithPreservedSegment` | `Zr1` | chunks.159.mjs:558 |
| `getCompactPrompt` | `fx8` | chunks.101.mjs:679 |
| `getPartialCompactPrompt` | `Q0z` | chunks.101.mjs:827 |
| `formatCompactSummary` | `d0z` | chunks.101.mjs:780 |
| `getCompactUserSummaryMessage` | `b18` | chunks.101.mjs:804 |
| `runPostCompactCleanup` | (chunks.159.mjs, multiple cleanup helpers) | chunks.159.mjs |
| `streamCompactSummary` | (inlined into `vI6`'s `ALK` helper) | chunks.159.mjs:948 |

### Algorithm-Level Equivalences

- **PTL truncation (`KLK`)**: identical to source's `truncateHeadForPTLRetry`. Both: strip own `ayK` marker → group via `AR6`/`groupMessagesByApiRound` → walk groups summing tokens until tokenGap covered, fallback to floor(20% × groups) when `tokenGap` unparseable → cap drop count at `groups.length-1` → re-prepend marker if first remaining message is `assistant`.
- **Cache-prefix sharing**: both use `tengu_compact_cache_prefix` GrowthBook (default true), both fall through to streaming on failure. The "compact_cache_sharing_success / fallback" telemetry events are present in both.
- **Boundary marker contents** (`createCompactBoundaryMessage`): trigger, preCompactTokenCount, durationMs, postCompactTokenCount, preCompactDiscoveredTools, preservedSegment metadata — identical.
- **Post-compact attachment ordering**: boundaryMarker → summaryMessages → messagesToKeep → attachments → hookResults — same in both.
- **Plan / skill / async-agent / file restoration**: ordering and budgets identical.

This means the **load-bearing core** of the compact subsystem is unchanged across the two versions. What moved is the *front* (what triggers compact) and the *back* (overflow recovery), not the *middle* (the LLM call + state restoration).

---

## 5. Feature-Gated Code Paths

The following 2.1.88-source features ride on Bun build-time `feature(...)` macros. Since we don't have the 2.1.88 *binary*, "removed" claims for these are inferences from "absent in 2.1.112 binary":

| Feature flag | 2.1.88 source presence | 2.1.112 binary presence | Inference |
|---|---|---|---|
| `KAIROS` | active in `compact.ts`, `prompt.ts`, `sessionTranscript.ts` | absent | flag flipped off OR removed |
| `PROACTIVE` | conditional with KAIROS in `prompt.ts` | absent | flag flipped off OR removed |
| `REACTIVE_COMPACT` | active in `commands/compact/compact.ts`, `autoCompact.ts` | absent | flag flipped off OR removed |
| `CACHED_MICROCOMPACT` | active in `microCompact.ts` | absent | flag flipped off OR removed |
| `CONTEXT_COLLAPSE` | active in `autoCompact.ts`, `postCompactCleanup.ts` | absent (only persistence shims) | flag flipped off, persistence kept for fwd-compat |
| `EXPERIMENTAL_SKILL_SEARCH` | `compact.ts:212-222` | unclear (skill_listing flows survive elsewhere) | likely off |
| `COMMIT_ATTRIBUTION` | `postCompactCleanup.ts:71` | unclear | likely off |
| `PROMPT_CACHE_BREAK_DETECTION` | `compact.ts:698`, `microCompact.ts:362-366`, `autoCompact.ts:302-304` | present (binary calls `i04`/`nj6` at equivalent sites) | **kept on** |

In short: the v2.1.112 binary is built with **a much smaller flag-set** than 2.1.88's full source. The "experimental" tier (KAIROS, REACTIVE_COMPACT, CACHED_MICROCOMPACT, CONTEXT_COLLAPSE) is gone; only the proven detection/protection path (`PROMPT_CACHE_BREAK_DETECTION`) survives.

---

## 6. Algorithm Diff: The Per-Turn `microcompactMessages` → `_c`

The most striking architectural change is the gutting of the per-turn microcompact entry. Side-by-side:

**v2.1.88** (`microCompact.ts:253-293`):

```typescript
export async function microcompactMessages(
  messages: Message[],
  toolUseContext?: ToolUseContext,
  querySource?: QuerySource,
): Promise<MicrocompactResult> {
  clearCompactWarningSuppression()

  // (1) Time-based: if cache cold, clear old tool_results before sending.
  const timeBasedResult = maybeTimeBasedMicrocompact(messages, querySource)
  if (timeBasedResult) return timeBasedResult

  // (2) Cached MC (ant-only): use cache_edits to delete without invalidating.
  if (feature('CACHED_MICROCOMPACT')) {
    const mod = await getCachedMCModule()
    const model = toolUseContext?.options.mainLoopModel ?? getMainLoopModel()
    if (mod.isCachedMicrocompactEnabled() &&
        mod.isModelSupportedForCacheEditing(model) &&
        isMainThreadSource(querySource)) {
      return await cachedMicrocompactPath(messages, querySource)
    }
  }

  return { messages }
}
```

**v2.1.112** (chunks.85.mjs:1207-1211):

```javascript
async function _c(q, K, _) {
    return a04(), { messages: q }
}
```

— literally just clear the warning flag and pass through.

**Practical impact.** The per-turn loop in 2.1.112 makes one fewer pass over messages and never mutates `tool_result` content preemptively. All MC now happens only after the API has already responded — either OK (no MC needed), or `prompt_too_long` (PTL retry inside `vI6`), or 422/424 (`d85` reject path → `qD4`).

This is a strict trade: more work pushed to the server, less speculative client work.

---

## 7. Algorithm Diff: `getCompactUserSummaryMessage`

**v2.1.88** (`prompt.ts:337-374`):

```typescript
export function getCompactUserSummaryMessage(
  summary,
  suppressFollowUpQuestions?,
  transcriptPath?,
  recentMessagesPreserved?,    // 4th arg — partial-compact-only signaler
): string {
  // ...
  if (suppressFollowUpQuestions) {
    let continuation = `${baseSummary}\nContinue ...`
    if ((feature('PROACTIVE') || feature('KAIROS')) &&
         proactiveModule?.isProactiveActive()) {
      continuation += `\n\nYou are running in autonomous/proactive mode...`
    }
    return continuation
  }
  return baseSummary
}
```

**v2.1.112** (`b18`, chunks.101.mjs:804): the KAIROS branch is DCE'd. The function signature in the binary has no `recentMessagesPreserved` use site (the partial-compact path inlines the "Recent messages are preserved" trailer into the boundary marker metadata instead).

Effective difference: v2.1.112's compact summary message is shorter (no autonomous-mode trailer). For non-KAIROS users this is a no-op; for the KAIROS cohort the loss of that trailer means the post-compact agent may briefly act as if it just woke up rather than continuing autonomously — KAIROS itself was likely also pulled, so this is a coherent change.

---

## 8. Algorithm Diff: `shouldAutoCompact`

**v2.1.88** (`autoCompact.ts:160-239`) gates by:
1. `querySource` recursion guards (`session_memory`, `compact`)
2. `feature('CONTEXT_COLLAPSE') && querySource === 'marble_origami'` recursion guard
3. `isAutoCompactEnabled()` (env / settings)
4. `feature('REACTIVE_COMPACT') && tengu_cobalt_raccoon` → reactive owns it
5. `feature('CONTEXT_COLLAPSE') && isContextCollapseEnabled()` → collapse owns it
6. token threshold check

**v2.1.112** (`gDY`, chunks.159.mjs:1365): gates 1, 3, 6 survive. The `feature(...)`-gated branches (2, 4, 5) are DCE'd. The legacy `bx() && !Z38(K, _)` ant-user window-source check is still there, gating ant users to env/settings-sourced windows only — this is *separate* from the source's REACTIVE_COMPACT cobalt-raccoon check (which suppressed autocompact entirely for reactive-only mode). The current `07_compact/trigger_mechanism.md` documentation of this gate is correct for the binary; the source's structure is just the more general, feature-flagged form.

---

## 9. Algorithm Diff: PTL Retry Grouping

The pre-existing `CROSS_VALIDATION.md § B Error 6` claimed a divergence: source uses "API rounds", binary uses "turn pairs". **This is wrong.**

`AR6` (chunks.101.mjs:578-590) decompiles to:

```javascript
function AR6(q) {
  let K = [], _ = [], z;
  for (let Y of q) {
    if (Y.type === "assistant" && Y.message.id !== z && _.length > 0) {
      K.push(_); _ = [Y];
    } else _.push(Y);
    if (Y.type === "assistant") z = Y.message.id;
  }
  if (_.length > 0) K.push(_);
  return K;
}
```

Compare `groupMessagesByApiRound` (grouping.ts:22-63):

```typescript
export function groupMessagesByApiRound(messages: Message[]): Message[][] {
  const groups: Message[][] = [];
  let current: Message[] = [];
  let lastAssistantId: string | undefined;
  for (const msg of messages) {
    if (msg.type === 'assistant' && msg.message.id !== lastAssistantId && current.length > 0) {
      groups.push(current); current = [msg];
    } else current.push(msg);
    if (msg.type === 'assistant') lastAssistantId = msg.message.id;
  }
  if (current.length > 0) groups.push(current);
  return groups;
}
```

— line-for-line equivalent. **Both versions group by API round-trip (assistant.message.id boundary).** The "turn pairs" framing in older drafts of the 07_compact docs was a mental-model shortcut that doesn't reflect the actual algorithm in either version. (Correction needed: `standard_compaction.md` and `edge_cases_and_failures.md`.)

---

## 10. Documentation Corrections to `CROSS_VALIDATION.md`

After the rigorous deep review, mapping `CROSS_VALIDATION.md` findings to the corrected interpretation:

| CROSS_VALIDATION § | Original framing | Corrected framing |
|---|---|---|
| § G "source is newer" verdict | "v2.1.112 binary released earlier" | **Inverted.** Binary's `context-hint-2026-04-09` post-dates the leak — binary is newer. |
| § B Error 1 (microcompactMessages) | "VERSION DIVERGENCE — binary correct" | **Confirmed.** 2.1.112's `_c` is the gutted descendant of 2.1.88's `microcompactMessages`. |
| § B Error 2 (time-based gap trigger) | "v2.1.112 binary has BOTH trigger paths" | **Wrong inference.** Per-turn 60-min gap trigger is genuinely gone in 2.1.112. |
| § B Error 3 (`trySessionMemoryCompaction`) | "missed it in binary" | **Compact-tier integration is genuinely absent.** SessionMemory module otherwise survives. |
| § B Error 4 (4th-arg name) | "originalLastUuid → suppressFollowUpQuestions" | **Confirmed correction needed in `standard_compaction.md`.** |
| § B Error 4 (8th-arg `stripNonEssential`) | "VERSION DIVERGENCE" | **Confirmed.** 8th param is a 2.1.112 addition for cold compact. |
| § B Error 5 (REPL-cleared 5th param) | "fictional" | **❌ Wrong.** The 5th param is **real** in 2.1.112 binary (chunks.101.mjs:804-825). The original `prompt_builder.md` claim was correct; CROSS_VALIDATION.md was the error. The autonomous-mode trailer DOES go away (so half of CV.md's claim was right) but the REPL-cleared message replaces it. |
| § B Error 6 (API-round vs turn-pairs) | "v2.1.112 uses turn pairs" | **Wrong.** `AR6` (chunks.101.mjs:578) decompiles line-for-line to `groupMessagesByApiRound` — both versions use API-round grouping. The "turn pairs" framing in older 07_compact drafts is what should be fixed. |
| § B Error 7 (`getAPIContextManagement`) | "binary missing options" | **Source has more options; binary may have flag-gated DCE.** Worth re-verifying in chunks.194. |
| § B Error 8 (`Z38` ant-user gate) | "different mechanism" | **Confirmed.** Same flag (`tengu_cobalt_raccoon`), different gate logic — see [§ 3.B.1](#3b1-tengu_cobalt_raccoon-flag--gate-semantics-changed). |
| § B Error 9 (`stripImagesFromMessages`) | "not cold-only" | **Confirmed.** Image stripping is a general normalization. Cold-compact adds extra truncation. |
| § C Gap 1 (session memory tier) | "missing from analysis" | **Reframe**: removed in 2.1.112, present in 2.1.88 source. SessionMemory **module** still ships; the **compact-tier** integration is gone. |
| § C Gap 2 (time-based MC config) | "missing from analysis" | **Reframe**: 60-min gap trigger and `tengu_slate_heron` are 2.1.88-only. The `qD4` algorithm and `tengu_time_based_microcompact` event survive (under different trigger). |
| § C Gap 4 (`groupMessagesByApiRound`) | "newer in source" | **Wrong.** Algorithm present in both versions verbatim. |
| § C Gap 7 (`MAX_COMPACT_STREAMING_RETRIES`) | "missing from analysis" | **Removed in 2.1.112.** Confirmed. |
| § C Gap 8 (KAIROS autonomous mode) | "missing from analysis" | **Reframe**: KAIROS as a feature lives on; only the *compact-time* hooks (autonomous-mode trailer + sessionTranscript writer) are gone. |
| § C Gap 9 (`cachedMicrocompactPath`) | "binary doesn't have it" | **Reframe**: per-turn entry path absent, but `cache_edits` infrastructure (chunks.194.mjs:2345, `cachedMCEnabled` state field in chunks.85) is alive. |
| § C Gap 10 (REACTIVE_COMPACT) | "missing from analysis" | **Reframe**: mechanism gone; flag (`tengu_cobalt_raccoon`) repurposed. The recovery niche is filled by `context-hint`. |
| § D Divergent 1-5 (rapid-refill, cold compact, amber_redwood, hazel_osprey, context-hint) | "tentative" | **All five confirmed v2.1.112 additions** — hardened claims. |

The single line in `CROSS_VALIDATION.md` § G's verdict — *"the source-tree is NEWER than v2.1.112 binary"* — is the original document's load-bearing inversion that this VERSION_DIFF document corrects.

---

## 11. Errors Self-Identified in This Document's Earlier Drafts

The first draft of this document overreached in several places. All have been corrected above; flagging the corrections explicitly so future readers know what to be careful about:

| Original (overreaching) claim | Correction |
|---|---|
| "Reactive Compact removed (`tengu_cobalt_raccoon` absent)" | The flag is **still in 2.1.112** at chunks.101.mjs:1532, read by `bx()` and used in `gDY` with new gate semantics. The reactive-compact *mechanism* is gone, but not the flag. |
| "Cached Microcompact completely removed" | The `cachedMicrocompactPath` entry is gone, but the underlying `cache_edits` block insertion (`VJ7`, `cache_reference: tool_use_id`) survives in chunks.194 and is actively logged. The mechanism is restructured, not removed. |
| "Session memory compaction tier removed (entire feature gone)" | Only the **compact-tier integration** (`trySessionMemoryCompaction`) is gone. The SessionMemory module itself ships in 2.1.112 (chunks.218.mjs has `tengu_session_memory`, extraction events, file-read events). |
| "KAIROS removed" | KAIROS as a feature is **alive and well** in 2.1.112 (briefs, cron, dream, push, `kairosActive` state). Only the **compact-time hooks** (autonomous-mode trailer in `b18` and sessionTranscript writer post-compact) appear gone. |
| Implicit framing that all `feature()`-gated paths absent in 2.1.112 binary = "removed since 2.1.88" | These same paths may have been DCE'd in the 2.1.88 *public* binary too (we don't have the 2.1.88 binary). Strictly, the absence is a *codebase-level* difference between 2.1.88 source and 2.1.112 binary — not a guaranteed user-visible loss. |
| "Per-turn microcompact gutted" → implied users lost important functionality | **Misleading.** For default public users, 2.1.88's per-turn MC was **already a no-op** (paths ② and ③ short-circuited on default-off flags). The codebase removed dead/experimental scaffolding. The *concept* of per-turn proactive MC isn't dead in 2.1.112 — it lives on as the API-level `clear_thinking_20251015` strategy (`C85`/`context_management`) which still fires every turn for default users. What's actually lost is the *experimental* 60-min-gap tool_result clearing and the ant-only cached-MC tool_result deletion. |
| Failed to investigate where `_c`'s functional equivalents went | The deeper truth: 2.1.88's per-turn MC scaffold had THREE levels — `clearWarningSuppression` (UI), `clear_thinking` (API context_management), `clear_tool_results` (client-side mutation). 2.1.112 keeps the first two for default users; only the third was removed/repurposed. |

The lesson: grep is a starting point for diff, not a final answer. Tier 1 confidence requires checking that (a) the feature is not feature-gated in source, (b) the surrounding algorithmic site in the binary clearly handles the case differently, AND (c) the runtime defaults make this code path active for default users. Tier 2 (feature-gated or default-off-runtime-flag) findings are codebase-level; user-visible only with knowledge of build-time flag state and runtime defaults.

**Critical pattern to watch**: a function being renamed to a no-op stub (`microcompactMessages` → `_c`) doesn't necessarily mean the *functionality* moved nowhere. Check if equivalent work has migrated to:
- Adjacent helper functions (here: `C85`/`getAPIContextManagement` survives for thinking-clearing)
- API-level body fields (here: `context_management` request body)
- Different call sites (here: `qD4` algorithm now called from reject handler instead of per-turn)
- Server-side strategies (here: `compact_20260112` capability advertised but not yet client-driven)

---

## 12. Design Rationale (Inferred)

A coherent narrative emerges from the diff:

**v2.1.88 was multi-strategy *in the codebase*.** The source-tree carried mechanisms for: full LLM compact, session-memory compact, per-turn time-based MC, cached MC, reactive compact, context-collapse, KAIROS hooks. Several were behind `feature()` gates that may or may not have been on for the public 2.1.88 build.

**v2.1.112 is more focused.** Confirmed (Tier 1) changes:
- The per-turn `microcompactMessages` is gutted to a no-op.
- The 60-min-gap time-based trigger is gone (was not feature-gated in source — definitely a real loss).
- Streaming retry is gone (was a runtime flag, default off — likely small user-visible impact).
- Session-memory compact-tier integration is gone (SessionMemory module survives).
- The `b18` compact-summary message gains a REPL-cleared trailer, loses the autonomous-mode trailer.
- New circuit breaker (rapid-refill) prevents thrash that older code didn't catch.
- New cold-compact path optimizes the 1.5-hour-cold-cache case.
- New `context-hint-2026-04-09` server-driven reject path (the architecturally largest addition).

Tier 2 changes (feature-gated paths absent in binary) are codebase-level — they reflect a smaller flag-set in the 2.1.112 build than what was present in source.

**Why the consolidation.** Two probable drivers:
1. **Maintenance cost.** Each independent strategy had its own thresholds, telemetry, flags, edge cases. Even if all were off for public users, each carries cognitive overhead and risk of regression.
2. **Server-side `context_hint`.** The new API beta (dated 2026-04-09, 9 days post-leak) gives the server full visibility into cache state and prompt-length budgets — strictly better than a client-side 60-min-gap heuristic for deciding when to compact. Once landed, several client-side mechanisms become redundant.

The v2.1.112 picture: simplify the client to *one* compact path + a circuit-breaker pair + "trust the server's hint and retry once" fallback. Complex client-side experiments were either promoted to the server, refactored under different names, or pruned.

---

## 13. Recommended Updates to `07_compact/*.md`

Based on this diff, these documents need touch-ups:

1. **`README.md`** — Architecture diagram already reflects the dual-track (autocompact + context-hint). Add a one-paragraph note that v2.1.88 had a third tier (session memory) and a per-turn time-based MC, both removed.
2. **`microcompaction.md`** — Frame the `_c` no-op as the *result* of removing both 2.1.88 paths (time-based, cached). Explicitly note: same `qD4` algorithm, new trigger.
3. **`standard_compaction.md`** —
   - Fix 4th-arg name: `originalLastUuid` → `suppressFollowUpQuestions`. (Already noted in the doc; verify the body matches.)
   - Replace any "turn-pair" wording in the PTL retry section with "API round" (`AR6` is API-round grouping).
4. **`prompt_builder.md`** — Keep the 5th param `hasReplCleared` (it IS in 2.1.112 binary — the original analysis was correct). Note that 2.1.88 source had a different conditional in this slot: the autonomous-mode trailer when `(KAIROS||PROACTIVE) && proactiveModule.isProactiveActive()`, replaced in 2.1.112 by the REPL-cleared message. Rationale: REPL VM was added between versions; KAIROS hook in compact was removed.
5. **`api_context_management.md`** — Note that the `clearAllThinking` and ant-only `clear_tool_uses_20250919` options exist in 2.1.88 source; the v2.1.112 binary may DCE the ant-only branch but keep `clear_thinking_20251015`.
6. **`trigger_mechanism.md`** — Clarify: `bx() && !Z38(K, _)` is a window-source-restriction gate (ant users), not the same as 2.1.88's REACTIVE_COMPACT cobalt-raccoon suppression. Different semantics, different feature flag.
7. **`cold_compact.md`** — Add a note that image stripping happens unconditionally pre-compact; cold mode adds tool_result truncation.
8. **`dead_code_audit.md`** — Update the "what was eliminated" list with this version-diff context: REACTIVE_COMPACT, CACHED_MICROCOMPACT, KAIROS, PROACTIVE, EXPERIMENTAL_SKILL_SEARCH, time-based MC trigger, session-memory compact tier, streaming retry. Note that CONTEXT_COLLAPSE persistence shims are the only halfway-shipped relic.
9. **`CROSS_VALIDATION.md`** — Either (a) prepend a "version-ordering correction" preface that points readers at this document, or (b) rewrite §G's "source is newer" verdict.

---

## 14. Appendix: Verification Commands

### Tier 1 removals (high confidence)

```bash
# 60-min gap trigger / time-based MC config: gone
grep -cE "tengu_slate_heron|gapThresholdMinutes|evaluateTimeBasedTrigger|maybeTimeBasedMicrocompact" chunks.*.mjs
# 0 matches expected

# Streaming retry: gone
grep -cE "tengu_compact_streaming_retry|MAX_COMPACT_STREAMING_RETRIES" chunks.*.mjs
# 0 matches expected

# Autonomous-mode trailer text: gone
grep -cE "autonomous/proactive|first wake-up|already working autonomously" chunks.*.mjs
# 0 matches expected
```

### Tier 1 additions (high confidence)

```bash
# context-hint API beta + reject path
grep -lE "context-hint-2026|tengu_hazel_osprey|tengu_cold_compact|tengu_amber_redwood|consecutiveRapidRefills|rapidRefillBreakerTripped" chunks.*.mjs
# Expect: chunks.154.mjs, chunks.159.mjs, chunks.194.mjs

# vI6 has 8 params (8th = stripNonEssential)
grep -n "function vI6" chunks.159.mjs
# 574: async function vI6(q, K, _, z, Y, A = !1, O, w = !1)

# b18 has 5 params (5th = hasReplCleared) — REPL-cleared message
grep -n "REPL VM state has been cleared" chunks.*.mjs
# chunks.101.mjs:~819

# qD4's trigger field is hardcoded
grep -n 'trigger: "context_hint"' chunks.85.mjs
# chunks.85.mjs:1267
```

### Tier 2 verifications (codebase-level, not necessarily user-visible)

```bash
# trySessionMemoryCompaction (compact-tier integration): absent
grep -cE "trySessionMemoryCompaction|tengu_sm_compact|truncateSessionMemoryForCompact|isSessionMemoryEmpty" chunks.*.mjs
# 0 matches

# But broader SessionMemory module: present
grep -lE "tengu_session_memory|tengu_session_memory_extraction|tengu_session_memory_file_read" chunks.*.mjs
# Expect chunks.218.mjs

# REACTIVE_COMPACT mechanics: absent
grep -cE "reactiveCompact|isReactiveOnlyMode|compactViaReactive|reactiveCompactOnPromptTooLong|isWithheldPromptTooLong" chunks.*.mjs
# 0 matches

# But cobalt_raccoon flag: present
grep -n "tengu_cobalt_raccoon" chunks.*.mjs
# chunks.101.mjs:1532

# CACHED_MICROCOMPACT named entry: absent
grep -cE "cachedMicrocompactPath|tengu_cached_microcompact|getCachedMCModule|markToolsSentToAPIState" chunks.*.mjs
# 0 matches

# But cache_edits mechanism: present
grep -nE "cache_edits block|cache_reference: " chunks.*.mjs | head -3
# chunks.194.mjs:2345 + chunks.194.mjs:2369

# KAIROS compact-time hooks: absent
grep -cE "writeSessionTranscriptSegment|sessionTranscriptModule|isProactiveActive" chunks.*.mjs
# 0 matches

# But broader KAIROS feature: alive
grep -lE "tengu_kairos_brief|tengu_kairos_cron|tengu_kairos_loop|tengu_kairos_dream|kairosActive" chunks.*.mjs | head
# chunks.1.mjs, chunks.84.mjs, chunks.149.mjs, chunks.189.mjs, chunks.222.mjs, ...
```

### Algorithm equivalences (unchanged across versions)

```bash
# AR6 is API-round grouping (NOT turn-pair)
sed -n '578,592p' chunks.101.mjs
# Decompiles to groupMessagesByApiRound from grouping.ts

# session_memory recursion guard preserved
grep -n 'session_memory.*compact\|"compact".*"session_memory"' chunks.159.mjs
# chunks.159.mjs:1366
```
