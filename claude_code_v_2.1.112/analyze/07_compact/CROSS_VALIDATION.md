# Cross-Validation: v2.1.112 Analysis vs `claude-code/src/services/compact/`

> **⚠️ Version-ordering correction (added later).** The original conclusion in §G of this document — *"the source-tree is NEWER than v2.1.112 binary"* — is **inverted**. The leak is dated 2026-03-31 and the v2.1.112 binary contains an API beta header `context-hint-2026-04-09` (post-leak), so the **source-tree is OLDER (≈ v2.1.88) and the v2.1.112 binary is NEWER**. Read the diff in [`VERSION_DIFF_2188_TO_21112.md`](./VERSION_DIFF_2188_TO_21112.md) for the corrected interpretation: features in §C "source has it, binary doesn't" were **removed** between v2.1.88 and v2.1.112; features in §D "binary has it, source doesn't" were **added**.

## Methodology

This document **cross-validates** the v2.1.112 analysis against the leaked upstream TypeScript source at `/Users/bytedance/codespace/myapp/claude-code/src/services/compact/` (3,960 lines across 11 files), released publicly 2026-03-31.

The source-tree corresponds approximately to **v2.1.88** (the public version contemporaneous with the leak). It contains TypeScript with `feature()` gates that the bundler DCEs based on per-build configuration. Code paths gated behind `feature('REACTIVE_COMPACT')`, `feature('CACHED_MICROCOMPACT')`, `feature('CONTEXT_COLLAPSE')`, `feature('KAIROS')`, `feature('PROACTIVE')`, `feature('EXPERIMENTAL_SKILL_SEARCH')`, `feature('PROMPT_CACHE_BREAK_DETECTION')`, `feature('COMMIT_ATTRIBUTION')` are conditionally included.

**The v2.1.112 binary is NEWER than the source-tree** (the binary references the post-leak `context-hint-2026-04-09` API beta). The comparison reveals **three categories of differences**:

1. **Validations**: things the v2.1.112 binary analysis got right and the v2.1.88 source confirms.
2. **Source has it, v2.1.112 binary doesn't** — features **removed** between v2.1.88 and v2.1.112.
3. **v2.1.112 binary has it, source doesn't** — features **added** in v2.1.112.

---

## Files Read for Cross-Validation

| File | Lines | Coverage |
|------|-------|----------|
| `autoCompact.ts` | 351 | Full read |
| `compact.ts` | 1705 | First 700 lines deep-read |
| `microCompact.ts` | 530 | Full read |
| `apiMicrocompact.ts` | 153 | Full read |
| `prompt.ts` | 374 | Full read |
| `postCompactCleanup.ts` | 77 | Full read |
| `sessionMemoryCompact.ts` | 630 | Headers/types read |
| `timeBasedMCConfig.ts` | 43 | Full read |
| `compactWarningHook.ts` | 16 | Full read |
| `compactWarningState.ts` | 18 | Full read |
| `grouping.ts` | 63 | Full read |
| `query.ts` (parent) | (selected) | Searched for compact references |

---

## Section A: Validations — Analysis Matches Source

### Constants — all match

| My analysis (obfuscated → readable) | Source (TypeScript) | Status |
|--------------------------------------|----------------------|--------|
| `uDY = 20000` (MAX_OUTPUT_RESERVATION) | `MAX_OUTPUT_TOKENS_FOR_SUMMARY = 20_000` | ✅ |
| `t_7 = 13000` (AUTOCOMPACT_BUFFER) | `AUTOCOMPACT_BUFFER_TOKENS = 13_000` | ✅ |
| `mDY = 20000` (WARNING_THRESHOLD_OFFSET) | `WARNING_THRESHOLD_BUFFER_TOKENS = 20_000` | ✅ |
| `BDY = 20000` (ERROR_THRESHOLD_OFFSET) | `ERROR_THRESHOLD_BUFFER_TOKENS = 20_000` | ✅ |
| `e_7 = 3000` (BLOCKING_LIMIT_RESERVE) | `MANUAL_COMPACT_BUFFER_TOKENS = 3_000` | ✅ (named differently — source's name is misleading; it's actually the blocking-limit buffer) |
| `wLK = 3` (CONSECUTIVE_FAILURE_LIMIT) | `MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES = 3` | ✅ |
| `qLK = 3` (PTL_RETRY_LIMIT) | `MAX_PTL_RETRIES = 3` | ✅ |
| `kx8 = 5` (POST_COMPACT_MAX_FILES) | `POST_COMPACT_MAX_FILES_TO_RESTORE = 5` | ✅ |
| `yDY = 50000` (POST_COMPACT_FILE_TOKEN_BUDGET) | `POST_COMPACT_TOKEN_BUDGET = 50_000` | ✅ |
| `LDY = 5000` (POST_COMPACT_TOKENS_PER_FILE) | `POST_COMPACT_MAX_TOKENS_PER_FILE = 5_000` | ✅ |
| `RDY = 25000` (POST_COMPACT_SKILLS_BUDGET) | `POST_COMPACT_SKILLS_TOKEN_BUDGET = 25_000` | ✅ |
| `hDY = 5000` (POST_COMPACT_TOKENS_PER_SKILL) | `POST_COMPACT_MAX_TOKENS_PER_SKILL = 5_000` | ✅ |
| `r4z = 2000` (IMAGE_TOKEN_ESTIMATE) | `IMAGE_MAX_TOKEN_SIZE = 2000` | ✅ |
| `Q6A = 5` (DEFAULT_KEEP_RECENT) | `TIME_BASED_MC_CONFIG_DEFAULTS.keepRecent = 5` | ✅ |
| `sR8 = "[Old tool result content cleared]"` | `TIME_BASED_MC_CLEARED_MESSAGE = '[Old tool result content cleared]'` | ✅ |
| `ayK = "[earlier conversation truncated for compaction retry]"` | `PTL_RETRY_MARKER = '[earlier conversation truncated for compaction retry]'` | ✅ |
| `QI6 = "Not enough messages to compact."` | `ERROR_MESSAGE_NOT_ENOUGH_MESSAGES = 'Not enough messages to compact.'` | ✅ |
| `_LK = "Conversation too long. Press esc twice..."` | `ERROR_MESSAGE_PROMPT_TOO_LONG = 'Conversation too long. Press esc twice to go up a few messages and try again.'` | ✅ |
| `at = "API Error: Request was aborted."` | `ERROR_MESSAGE_USER_ABORT = 'API Error: Request was aborted.'` | ✅ |
| `ql8 = "Compaction interrupted · ..."` | `ERROR_MESSAGE_INCOMPLETE_RESPONSE = 'Compaction interrupted · This may be due to network issues — please try again.'` | ✅ |

### Function Behaviors

| My doc (obfuscated → readable) | Source (TypeScript) | Status |
|----|----|----|
| `QkK` (autocompactDispatcher) | `autoCompactIfNeeded` | ✅ Same gate cascade structure |
| `gDY` (shouldCompact) | `shouldAutoCompact` | ✅ Same recursion guards + `snipTokensFreed = 0` default |
| `Yn` (getEffectiveContextWindow) | `getEffectiveContextWindowSize` | ✅ Identical math |
| `v38` (getAutoCompactThreshold) | `getAutoCompactThreshold` | ✅ Identical incl. `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` |
| `UM6` (computeContextThresholds) | `calculateTokenWarningState` | ✅ Identical (returns `percentLeft`, `isAboveWarningThreshold`, etc.) |
| `z0` (isAutoCompactEnabled) | `isAutoCompactEnabled` | ✅ Identical: env > setting |
| `vI6` (compactConversation) | `compactConversation` | ✅ Same 8-phase pipeline |
| `KLK` (truncateHeadForPTLRetry) | `truncateHeadForPTLRetry` | ✅ Same logic — strips PTL_RETRY_MARKER, drops 20% on unparseable gap |
| `MJ6` (extractSummaryText) | `getAssistantMessageText` | ✅ |
| `r_7` (mergeInstructions) | `mergeHookInstructions` | ✅ Identical |
| `fx8` (compactPromptBuilder) | `getCompactPrompt` | ✅ NO_TOOLS_PREAMBLE + BASE_COMPACT_PROMPT + custom + NO_TOOLS_TRAILER |
| `d0z` (summaryPostProcessor) | `formatCompactSummary` | ✅ Identical: strip `<analysis>`, replace `<summary>` with `Summary:\n` |
| `b18` (compactSummaryContent) | `getCompactUserSummaryMessage` | ⚠️ My doc has 5 args; source has 4 — see Errors |
| `MR6` (deferred_tools_delta) | `getDeferredToolsDeltaAttachment` | ✅ |
| `PR6` (agent_listing_delta) | `getAgentListingDeltaAttachment` | ✅ |
| `WR6` (mcp_instructions_delta) | `getMcpInstructionsDeltaAttachment` | ✅ |
| `Y4` (wrapAttachment) | `createAttachmentMessage` | ✅ |
| `t8` (makeUserMessage) | `createUserMessage` | ✅ |
| `oc` (PreCompact hook) | `executePreCompactHooks` | ✅ |
| `K36` (PostCompact hook) | `executePostCompactHooks` | ✅ |
| `lR` (SessionStart hook with "compact") | `processSessionStartHooks('compact', ...)` | ✅ |
| `p18` (createCompactBoundaryMessage) | `createCompactBoundaryMessage` | ⚠️ My doc has 5 args; source has 3 — partial-compact additions are inline mutations |

### Algorithms

| Behavior | My analysis | Source | Status |
|----------|-------------|--------|--------|
| 5-gate cascade in dispatcher | ✅ Documented | ✅ Confirmed (DISABLE_COMPACT, failure breaker, shouldCompact, sessionMemoryFirst, vI6) | Mostly ✅ — see Gap below: I missed sessionMemory step |
| Consecutive-failure breaker (3) | ✅ | ✅ | ✅ |
| `cI = "Prompt is too long"` PTL detection | ✅ | ✅ `PROMPT_TOO_LONG_ERROR_MESSAGE` | ✅ |
| Three-layer defense (prompt + tools + permission) | ✅ | ✅ Source comment confirms: "with maxTurns: 1, a denied tool call means no text output → falls through to streaming fallback (2.79% on 4.6 vs 0.01% on 4.5)" | ✅ |
| `KLK` 20% drop fallback when API delta unparseable | ✅ | ✅ Identical | ✅ |
| Snip parameter `Y = 0` is vestigial | ✅ | ✅ Source has `snipTokensFreed = 0` default; only writer would be Snip impl which doesn't exist | ✅ |
| `microcompactMessages` per-turn entry | ⚠️ My doc says "no-op stub" | ❌ Source shows it has time-based + cached MC paths (gated by `feature(...)`, but not no-op) | See Errors |

### Variable name mapping confirmations

These mappings I made are validated by source name/behavior matches:

- `mainLoopModel` → `K.options.mainLoopModel` ✓
- `autoCompactWindow` → `K.getAppState().autoCompactWindow` ✓
- `tracking.consecutiveFailures` → `tracking.consecutiveFailures` ✓ (same field name)
- `recompactionInfo` → `RecompactionInfo` type ✓
- `cacheSafeParams` → `CacheSafeParams` type ✓
- `groupMessagesByApiRound` (source) → groups into API-round, NOT turn-pairs (correction below)

---

## Section B: Apparent Errors — Most Are Version Divergence

> **Important**: The "errors" below are differences between my v2.1.112 binary analysis and the upstream source-tree. After binary verification (Section G), most of these turned out to be **genuine version divergence** rather than mistakes — my binary analysis was accurate for v2.1.112 as shipped, but the source-tree reflects a newer codebase. Errors that ARE real (vs version divergence) are marked with ⚠️ REAL ERROR.



### Error 1 (VERSION DIVERGENCE — analysis correct for binary): `microcompactMessages` is NOT a "no-op stub" in source-tree

**My claim** (`microcompaction.md`): "the per-turn entry `_c` is a no-op stub" — `_c(q, K, _) { return a04(), { messages: q } }`

**Binary verification (chunks.85.mjs:1207-1211)**: ✅ My analysis is **CORRECT**. The v2.1.112 binary's `_c` function genuinely is `async function _c(q, K, _) { return a04(), { messages: q } }` — a true no-op.

**Source-tree reality** (`microCompact.ts:253-293`): `microcompactMessages` has time-based MC + cached MC paths.

**Verdict**: This is **VERSION DIVERGENCE**, not an analysis error:
- The source-tree's `microcompactMessages` has the time-based and cached MC paths.
- The v2.1.112 binary's `_c` collapsed all those paths to a no-op (likely because `tengu_slate_heron.enabled = false` AND `feature('CACHED_MICROCOMPACT')` = false at build time).
- The `qD4` function (chunks.85.mjs:1235-1274) which the source-tree's `maybeTimeBasedMicrocompact` would call still exists in the binary — but it's only called from `d85` (context-hint reject), not from per-turn `_c`. The trigger field is hardcoded to `"context_hint"`.

**Architectural change in v2.1.112**: The KEEP-RECENT MC algorithm was **repurposed**: same code, different trigger. The source's gap-based trigger (60-min idle) was replaced by the context-hint reject trigger in the binary.

**No correction needed**: My binary analysis is accurate.

### Error 2: The `time-based MC` trigger is the GAP-since-last-assistant, not the context-hint reject

**My claim** (`microcompaction.md`): "`qD4` (KEEP-RECENT MC) is reachable from exactly one site: the `context_hint` reject handler `d85`"

**Source reality** (`microCompact.ts:411-530`): The KEEP-RECENT MC logic lives in `maybeTimeBasedMicrocompact`. Trigger is `(now - lastAssistantTimestamp) > config.gapThresholdMinutes` where `gapThresholdMinutes = 60` by default. It runs **per-turn from `microcompactMessages`** when the gap is exceeded.

**Verdict**: My analysis correctly observed that v2.1.112 binary's `qD4` is called from `d85` (context_hint reject path). But I claimed this was the ONLY trigger ever. The source shows time-based gap-trigger is the original trigger (and likely also exists in v2.1.112 binary's `chunks.85.mjs`, just not where I looked).

**Likely truth**: v2.1.112 binary has BOTH trigger paths:
- Time-based (gap > 60min) via per-turn `microcompactMessages`
- Reactive (422/424 reject) via `d85`

I missed the time-based path because I focused on the `_c` stub and the new context-hint handler.

**Correction needed**: `microcompaction.md` should add the time-based trigger and `tengu_slate_heron` GrowthBook config.

### Error 3: I missed the `trySessionMemoryCompaction` call in the autocompact path

**My claim** (`trigger_mechanism.md`): The autocompact dispatcher's gate cascade has 5 gates → goes directly to `vI6`.

**Source reality** (`autoCompact.ts:288-310`): After all gates pass, the dispatcher calls:
```typescript
const sessionMemoryResult = await trySessionMemoryCompaction(
  messages, toolUseContext.agentId, recompactionInfo.autoCompactThreshold,
)
if (sessionMemoryResult) {
  // ... return early with sessionMemoryResult
}
// otherwise fall through to compactConversation
```

This is the **Tier 2 session memory compaction** that v2.1.76 docs documented! My v2.1.112 analysis claims there are only TWO tracks (autocompact + context-hint) — but actually there are THREE tracks (session memory + autocompact + context-hint).

**Verdict**: This is a major architectural gap. The source's `trySessionMemoryCompaction` may be DCE'd in v2.1.112 if the session-memory feature isn't enabled. But the architectural pattern is missing from my analysis.

**Correction needed**: Add a `session_memory_compaction.md` document or update `implementation.md` and `trigger_mechanism.md` to mention the session memory path.

### Error 4 (PARTIALLY REAL): `compactConversation` parameter naming

**My claim** (`standard_compaction.md`):
```javascript
async function vI6(q, K, _, z, Y, A = false, O, w = false)
//                                                       ^ stripNonEssential
```
8 params, where `z` = `originalLastUuid` and `w` = `stripNonEssential` (cold-compact mode).

**Source reality** (`compact.ts:387-395`):
```typescript
export async function compactConversation(
  messages, context, cacheSafeParams,
  suppressFollowUpQuestions: boolean,    // ← my doc called this "originalLastUuid"
  customInstructions?: string,
  isAutoCompact: boolean = false,
  recompactionInfo?: RecompactionInfo,
)
```
Only 7 params in source.

**Binary verification (chunks.159.mjs:574)**: `async function vI6(q, K, _, z, Y, A = !1, O, w = !1)` — confirmed **8 params**. The 8th `w` exists in v2.1.112 binary.

**Verdict**:
1. ⚠️ **REAL ERROR** for the 4th arg name. My doc says "originalLastUuid". Source says "suppressFollowUpQuestions". Looking at how it's used in `getCompactUserSummaryMessage` (`b18`), it controls whether to add the "Continue without acknowledging" trailer. The binary call `vI6(..., !0, ...)` passing `true` makes sense for autocompact wanting the model to silently continue. **Fix needed in `standard_compaction.md`.**

2. **VERSION DIVERGENCE** for the 8th arg `stripNonEssential`. v2.1.112 binary really does have it (cold-compact mode), but the source-tree doesn't yet. My analysis is correct for the binary.

**Correction needed**: `standard_compaction.md` needs only the 4th arg name correction. The cold-compact 8th param documentation stays.

### Error 5: `b18` / `getCompactUserSummaryMessage` parameter list — *the original CV.md claim is the error*

> **Correction (deep-review pass)**: The original verdict below ("My v2.1.112 analysis added a fictional 5th parameter") is **wrong**. The 5th parameter and the "REPL VM state has been cleared" text **do exist in the v2.1.112 binary** (chunks.101.mjs:804-825, verified by direct decompile). The original `prompt_builder.md` claim was correct; this CV.md error was the actual mistake.

**Original (incorrect) claim above**: 5 params `b18(q, K, _, z, Y)` where `Y = hasReplCleared` adds the "Your REPL VM state has been cleared..." message.

**Source reality**: 4 params `getCompactUserSummaryMessage(summary, suppressFollowUpQuestions?, transcriptPath?, recentMessagesPreserved?)`. There's NO `hasReplCleared` parameter and NO REPL-clearing message.

Instead, the source has **a different conditional**: when `feature('PROACTIVE') || feature('KAIROS')` AND `proactiveModule?.isProactiveActive()`, it appends:
> "You are running in autonomous/proactive mode. This is NOT a first wake-up — you were already working autonomously before compaction. Continue your work loop..."

**Corrected verdict**: This is a **version diff**, not an analysis error.
- v2.1.88 source: 4 params, autonomous-mode trailer when KAIROS/PROACTIVE active
- v2.1.112 binary: 5 params, REPL-VM-cleared trailer when 5th arg true; autonomous-mode trailer removed (KAIROS feature retained elsewhere but not in compact)

The change happened between the two versions:
- The autonomous-mode trailer (KAIROS-gated) was removed from `b18`
- A 5th parameter `hasReplCleared` was added with a new conditional: when true, prepend "Your REPL VM state has been cleared as part of this compaction. Variables defined in REPL calls before this point are no longer accessible — redefine any you still need."

The REPL VM (a Bun-based JS execution sandbox) was likely added between v2.1.88 and v2.1.112; the compact-side notification was added at the same time.

**No correction needed in `prompt_builder.md` for this** — the existing 5-param documentation is accurate. The version-diff context (what 2.1.88 had instead) should be added there for clarity.

**Verification**:
```bash
grep -n "REPL VM state has been cleared" chunks.101.mjs
# chunks.101.mjs:~819
```

### Error 6: `KLK` / `truncateHeadForPTLRetry` — both versions use API-round grouping

> **Correction (deep-review pass)**: This is a documentation-terminology error in the original `07_compact` drafts, not a version difference. **Both v2.1.88 and v2.1.112 use API-round grouping** — the `AR6` function in 2.1.112 binary (chunks.101.mjs:578) decompiles line-for-line to source's `groupMessagesByApiRound`. Wording in `standard_compaction.md` and `edge_cases_and_failures.md` has now been fixed.

**Original (pre-correction) claim**: `KLK` groups into "turn pairs" via `AR6`.

**Source reality**: `truncateHeadForPTLRetry` uses `groupMessagesByApiRound` (`grouping.ts`). This groups by **API round-trip** (boundaries fire at change of `assistant.message.id`). NOT user/assistant turn pairs.

The source comment explains the rationale:
> Replaces the prior human-turn grouping (boundaries only at real user prompts) with finer-grained API-round grouping, allowing reactive compact to operate on single-prompt agentic sessions (SDK/CCR/eval callers) where the entire workload is one human turn.

**Binary verification**: `AR6` in chunks.101.mjs:578-590 is line-for-line equivalent to source `groupMessagesByApiRound`. So the algorithmic mechanism is **identical between versions** — the documentation framing was just inaccurate.

**Status (post-fix)**: `standard_compaction.md` and `edge_cases_and_failures.md` updated to use "API round" terminology correctly.

### Error 7: `getAPIContextManagement` (`C85`) capabilities

**My claim** (`api_context_management.md`): Only `clear_thinking_20251015` with `keep: "all"`. Drops `clear_tool_uses_20250919` from v2.1.88.

**Source reality** (`apiMicrocompact.ts:64-153`):
1. `clear_thinking_20251015` has TWO `keep` modes:
   - `keep: "all"` (default — preserves all thinking)
   - `keep: { type: "thinking_turns", value: 1 }` (when `clearAllThinking=true`, e.g. >1h idle)
2. `clear_tool_uses_20250919` is **STILL in the source** but gated by `process.env.USER_TYPE === 'ant'` AND env vars `USE_API_CLEAR_TOOL_RESULTS` / `USE_API_CLEAR_TOOL_USES`.
3. Two TOOLS lists: `TOOLS_CLEARABLE_RESULTS` (Bash + Read + Grep + Glob + WebFetch + WebSearch) for `clear_tool_inputs` mode, and `TOOLS_CLEARABLE_USES` (FileEdit + FileWrite + NotebookEdit) for `exclude_tools` mode.
4. Param `isRedactThinkingActive` skips `clear_thinking_20251015` when redacted thinking is active.

**Verdict**: My analysis was correct that v2.1.112 binary likely doesn't expose `clear_tool_uses_20250919` to non-ant users. But I missed:
- The `clearAllThinking` parameter and the thinking_turns:1 mode
- The `isRedactThinkingActive` parameter
- The two distinct ant-only env-gated tool strategies (results vs uses)

**Correction needed**: `api_context_management.md` should expand the strategy descriptor description.

### Error 8: `Z38` (`isWindowFromEnvOrSettings`) — ant-user gate IS in `shouldAutoCompact` but with different mechanism

**My claim** (`trigger_mechanism.md`): `gDY` has `if (bx() && !Z38(K, _)) return false;` — for ant users, only env/settings windows allowed.

**Source reality**: `shouldAutoCompact` does NOT have an `isAntUser` check on window source. Instead it has:
```typescript
if (feature('REACTIVE_COMPACT')) {
  if (getFeatureValue_CACHED_MAY_BE_STALE('tengu_cobalt_raccoon', false)) {
    return false;  // suppress proactive autocompact for reactive-only mode
  }
}

if (feature('CONTEXT_COLLAPSE')) {
  const { isContextCollapseEnabled } = require('../contextCollapse/index.js');
  if (isContextCollapseEnabled()) {
    return false;  // collapse owns the headroom
  }
}
```

The ant-user check (`tengu_cobalt_raccoon`) is for **reactive-compact suppression**, NOT for window-source restriction.

**Verdict**: My v2.1.112 binary observation that `gDY` checks `bx() && !Z38(K, _)` may be correct for that specific binary. But the source-tree has different logic — it suppresses autocompact for ant users in reactive-only mode, not window-source restriction. Either:
- v2.1.112 binary changed the semantics of this gate
- OR my reverse-engineering misread the binary

**Correction needed**: `trigger_mechanism.md` Section 2 needs to acknowledge this divergence between binary and source.

### Error 9: I missed `stripImagesFromMessages` and `stripReinjectedAttachments`

**My claim**: `SDY` strips images/documents in cold-compact mode.

**Source reality**: There are TWO related functions:
1. `stripImagesFromMessages` (always callable, replaces `image`/`document` blocks with `[image]`/`[document]` text — including nested in `tool_result.content`).
2. `stripReinjectedAttachments` (gated by `feature('EXPERIMENTAL_SKILL_SEARCH')`, removes `skill_discovery`/`skill_listing` attachments).

These are NOT cold-compact-specific. They're called as part of compact pipeline normalization.

**Verdict**: My analysis tied SDY/CDY exclusively to cold-compact. Source shows stripping is more nuanced — image stripping is a general normalization, not cold-only.

**Correction needed**: `standard_compaction.md` and `cold_compact.md` should clarify that image stripping happens before the LLM call (always), not just in cold-compact mode.

### Error 10: Hook output format details

**My claim** (`hooks_system.md`): PreCompact hook outputs: `newCustomInstructions: A.length > 0 ? A.join("\\n") : void 0`

**Source reality**: `executePreCompactHooks` (and `executePostCompactHooks`) live in `utils/hooks.js`, not directly in `compact/`. The output format I documented was inferred from binary observation. I don't have direct source for these here.

**Verdict**: My analysis is likely correct in spirit but the exact formatting (single `\n` vs `\n\n`) may differ. Cannot verify from this source.

**Correction needed**: Mark the join-character as inferred, not source-validated.

---

## Section C: Source Has It, My Analysis Missed It

### Gap 1: Session Memory Compaction Tier

The biggest gap. Source has:
- `sessionMemoryCompact.ts` (630 lines)
- `trySessionMemoryCompaction` called from `autoCompactIfNeeded` BEFORE `compactConversation`
- `SessionMemoryCompactConfig` with `minTokens=10_000`, `maxTokens=40_000`, `minTextBlockMessages=5`
- GrowthBook config `tengu_session_memory_compact_config_v1`
- Uses session memory file (`getSessionMemoryPath`) instead of LLM call

This is **Tier 2 of v2.1.76's three-tier architecture** that I noted in README.md but didn't carry through into the rest of the documentation. v2.1.112 binary may or may not ship this — needs binary re-verification.

### Gap 2: Time-Based Microcompact Configuration

Source has `tengu_slate_heron` GrowthBook flag controlling `TimeBasedMCConfig`:
```typescript
{ enabled: false, gapThresholdMinutes: 60, keepRecent: 5 }
```

My `microcompaction.md` mentioned `Q6A = 5` but didn't connect it to a configurable GrowthBook value with a 60-min gap trigger.

### Gap 3: `evaluateTimeBasedTrigger` extracted helper

Source `microCompact.ts:422-444` exports `evaluateTimeBasedTrigger` as a standalone helper for "other pre-request paths (e.g. snip force-apply) [to] consult the same predicate". This is a code-organization detail my analysis didn't capture.

### Gap 4: `groupMessagesByApiRound`

`grouping.ts` is a NEW file in source (extracted from compact.ts to break a cycle, comment notes "CC-1180"). My analysis used "turn pairs" terminology; source uses "API round" boundaries.

### Gap 5: Full `runPostCompactCleanup` behavior

Source's `postCompactCleanup.ts` shows extensive cleanup that my analysis only briefly mentioned:
- `resetMicrocompactState()` — clear cached MC state
- `feature('CONTEXT_COLLAPSE')` → `resetContextCollapse()` (main thread only)
- `getUserContext.cache.clear()` — for InstructionsLoaded hook trigger
- `resetGetMemoryFilesCache('compact')` — clear claudemd cache
- `clearSystemPromptSections()` — system prompt cache
- `clearClassifierApprovals()` — permission classifier
- `clearSpeculativeChecks()` — Bash speculative permissions
- `clearBetaTracingState()` — telemetry beta tracing
- `feature('COMMIT_ATTRIBUTION')` → `sweepFileContentCache()`
- `clearSessionMessagesCache()` — session JSONL cache

Subagent compacts skip the main-thread-only resets. I missed all this.

### Gap 6: `compactWarningStore`, `suppressCompactWarning`, `useCompactWarningSuppression`

Source has a React-friendly state container for the "context low" UI banner suppression. My analysis only mentioned `a04` (`clearCompactWarningSuppression`) as a no-op side effect. The full picture:
- `compactWarningStore = createStore<boolean>(false)` (React store)
- `suppressCompactWarning()` — sets to true after successful compact (so banner disappears)
- `clearCompactWarningSuppression()` — sets to false at start of new compact attempt
- `useCompactWarningSuppression()` — React hook for components to subscribe

The hook is in a separate file (`compactWarningHook.ts`) explicitly so React doesn't get pulled into the print-mode startup path.

### Gap 7: `MAX_COMPACT_STREAMING_RETRIES = 2`

Source has this constant in compact.ts:131. My analysis didn't capture this — it's the streaming retry count for the main compact LLM call (separate from PTL retry).

### Gap 8: KAIROS / PROACTIVE feature for autonomous mode

When `feature('PROACTIVE') || feature('KAIROS')` is enabled AND `proactiveModule?.isProactiveActive()`, the post-compact summary message gets an additional continuation directive about autonomous mode. My analysis missed this entirely.

### Gap 9: `cachedMicrocompactPath` (cache_edits API beta)

Source has full implementation behind `feature('CACHED_MICROCOMPACT')`:
- `pendingCacheEdits` / `consumePendingCacheEdits` / `pinCacheEdits` mechanism
- `tengu_cached_microcompact` telemetry
- `markToolsSentToAPIState()` lifecycle
- `getPinnedCacheEdits()` for re-sending pinned edits

My analysis claimed this was "removed in v2.1.112 — no callsites". Source confirms it's there but feature-gated. The v2.1.112 binary may DCE it for non-ant users.

### Gap 10: REACTIVE_COMPACT and CONTEXT_COLLAPSE extensive integration

Source `autoCompact.ts:179-223` has TWO additional gates inside `shouldAutoCompact`:
- `feature('CONTEXT_COLLAPSE') && querySource === 'marble_origami'` → return false (recursion guard for ctx-agent)
- `feature('REACTIVE_COMPACT') && tengu_cobalt_raccoon` → return false (reactive-only mode)
- `feature('CONTEXT_COLLAPSE') && isContextCollapseEnabled()` → return false (collapse owns the headroom)

My v2.1.112 docs mentioned only the basic `bx() && !Z38(...)` ant-user gate. The actual gating is much more intricate.

### Gap 11: External `query.ts` integration

Source `query.ts` (parent file, not in `compact/`) shows:
- `reactiveCompact` is `feature('REACTIVE_COMPACT') ? require('./services/compact/reactiveCompact.js') : null`
- `contextCollapse` is `feature('CONTEXT_COLLAPSE') ? require('./services/contextCollapse/index.js') : null`
- `isWithheldMaxOutputTokens` and `reactiveCompact?.isWithheldPromptTooLong` are used to detect API rejections
- `collapseOwnsIt` flag is checked before fallback paths fire

The `reactiveCompact.ts` file doesn't exist in this source bundle (similar to `snipCompact.ts`'s missing-file pattern in v2.1.88).

---

## Section D: My v2.1.112 Binary Analysis Has Features Not in Source

These are likely **v2.1.112-binary-specific** additions that are either:
- Newer than this source snapshot
- Or added in a divergent branch

### Divergent 1: Rapid-Refill Breaker

My v2.1.112 binary analysis extensively documented:
- `jLK = 3` — rapid-refill breaker count
- `a_7 = 3` — rapid-refill turn window
- `consecutiveRapidRefills` tracking field
- `rapidRefillBreakerTripped` return field
- `okK` thrash error message

**Source has none of these.** The `AutoCompactTrackingState` type only has `consecutiveFailures`, not `consecutiveRapidRefills`. The tracking object my analysis described doesn't exist in source.

**Verdict**: Either rapid-refill was added to v2.1.112 binary after this source snapshot, OR my analysis hallucinated. To verify, would need to re-grep the v2.1.112 binary for `okK`, `consecutiveRapidRefills`, and `rapidRefillBreakerTripped` to confirm they actually exist.

If they do exist, this is a **genuine v2.1.112 addition** that the source-tree doesn't reflect — possibly because the source-tree is older than v2.1.112, or because the rapid-refill feature was reverted.

### Divergent 2: Cold Compact (`stripNonEssential`)

My doc has `tengu_cold_compact` flag, `pDY = 5_400_000ms`, `FDY()` cold-cache detection, `stripNonEssential` parameter, `SDY`/`CDY` strip functions.

**Source has none of these.** No "cold compact", no 1.5-hour threshold, no `isCacheCold`-equivalent.

**Verdict**: Possibly v2.1.112-specific. The closest source analog is `time-based microcompact` with a 60-min gap trigger (not 90-min). The cold-compact concept may have been a different mechanism (whole-pipeline strip-down vs targeted MC).

### Divergent 3: `tengu_amber_redwood` window experiment

My doc has the `tengu_amber_redwood` GrowthBook experiment for window resizing in `Jn`. Source has no reference to this flag.

**Verdict**: Possibly v2.1.112-specific or for a different feature (could be in a different file). Worth re-checking.

### Divergent 4: `tengu_hazel_osprey` for context-hint

My doc has this as the master flag for `context-hint-2026-04-09` reject path. Source has no `hazel_osprey` reference.

**Verdict**: The closest source analog is `feature('REACTIVE_COMPACT')` — both gate similar overflow-recovery behavior. Possibly the binary's `tengu_hazel_osprey` is a runtime gate that was added on top of `feature('REACTIVE_COMPACT')` in v2.1.112.

### Divergent 5: `context-hint-2026-04-09` beta header

My doc has full implementation in `chunks.194.mjs`. Source has no string match for `context-hint`.

**Verdict**: Either truly v2.1.112-specific (added between this source and v2.1.112), OR it's in a parent path I didn't search (e.g., `services/api/`). The mechanism described — 422/424 reject + retry — is functionally similar to `reactiveCompact.isWithheldPromptTooLong` referenced in source.

---

## Section E: Recommended Documentation Updates

Based on this cross-validation, the following updates are needed in the v2.1.112 docs:

### Priority 1 (Errors that mislead readers)

1. **`microcompaction.md`** — Replace the "no-op stub" framing with "two gates off → no-op". Add the time-based gap trigger and `tengu_slate_heron` config.

2. **`standard_compaction.md`** — Change `vI6`'s 4th arg from "originalLastUuid" to "suppressFollowUpQuestions". Note that `stripNonEssential` 8th param may be v2.1.112-specific.

3. **`prompt_builder.md`** — ~~Remove the fictional REPL-cleared 5th parameter on `b18`~~. **Update**: this recommendation was wrong; the 5th param IS real in v2.1.112 binary. The doc should retain it. Optional: add a version-diff note that v2.1.88 source had a different 4th-conditional message in this slot (KAIROS/PROACTIVE autonomous-mode trailer, removed in v2.1.112).

4. **`api_context_management.md`** — Expand `C85` description to include `clearAllThinking`, `isRedactThinkingActive`, and the (ant-only env-gated) `clear_tool_uses_20250919` strategies.

### Priority 2 (Architecture gaps)

5. **`README.md`** — Add session memory compaction as a third tier (currently only autocompact + context-hint).

6. **`implementation.md`** — Insert session memory compaction step between `shouldAutoCompact` gate and `compactConversation` call.

7. **`trigger_mechanism.md`** — Acknowledge the multi-flag gating divergence between binary and source.

8. **`state_preservation.md`** — Add the `runPostCompactCleanup` extensive cache-clearing details.

### Priority 3 (Validations to highlight)

9. Add a **CROSS_VALIDATION.md** (this document) listing all confirmed mappings as a confidence indicator.

10. **`dead_code_audit.md`** — Add note that REACTIVE_COMPACT (the source's reactive-compact feature with similar semantics to my analysis's `tengu_hazel_osprey` context-hint path) follows the same pattern as Snip and CONTEXT_COLLAPSE: gated behind a feature flag whose runtime file may or may not be in the bundle.

---

## Section F: Confidence Levels by Document

| Document | Cross-validation confidence | Recommended action |
|----------|------------------------------|---------------------|
| `README.md` | 80% — architecture is right, missing tier 2 | Update for session memory tier |
| `implementation.md` | 75% — overall correct, missing intermediate steps | Add session memory step |
| `trigger_mechanism.md` | 90% — math correct, gate cascade has divergence | Note ant-user gate differs in source |
| `standard_compaction.md` | 70% — phases right, parameter names wrong | Fix arg names, verify `stripNonEssential` |
| `partial_compaction.md` | 85% — accurately matches `Q0z`/`PARTIAL_COMPACT_PROMPT` | Minor refinements |
| `microcompaction.md` | 50% — misses time-based path entirely | Major rewrite needed |
| `prompt_builder.md` | 80% — prompt text correct, missing modes | Add proactive mode, remove REPL claim |
| `context_hint_path.md` | 60% — describes a real mechanism but source uses REACTIVE_COMPACT instead | Verify v2.1.112 binary still has this |
| `api_context_management.md` | 65% — captures the simplest case, misses ant strategies | Expand for full options |
| `state_preservation.md` | 90% — collectors documented well | Add postCompactCleanup details |
| `hooks_system.md` | 85% — hook semantics correct | Verify hook output format |
| `slash_command.md` | 80% — handler structure correct | Match source signatures |
| `cold_compact.md` | 40% — may not exist in source-tree form | Verify v2.1.112 binary independently |
| `cache_prefix_compact.md` | 90% — `tengu_compact_cache_prefix` confirmed | Minor refinements |
| `edge_cases_and_failures.md` | 75% — most failure modes covered | Add API-round grouping clarification |
| `configuration_and_telemetry.md` | 85% — most events correct | Add `tengu_session_memory_*`, `tengu_cached_microcompact`, `tengu_time_based_microcompact` (already there) |
| `query_pipeline_integration.md` | 80% — loop integration correct | Verify rapid-refill yielding logic in binary |
| `dead_code_audit.md` | 75% — concept right, list of "dead" features is accurate for binary but source still has them gated | Add REACTIVE_COMPACT to dead-feature list |

---

## Section G: Confirmed Version Divergence — Binary vs Source

After direct binary verification, both code trees genuinely have different feature sets:

**v2.1.112 binary CONFIRMED to have (verified by `grep` in `chunks.*.mjs`):**

| Feature | Binary location | Source-tree status |
|---------|------------------|---------------------|
| Rapid-refill breaker (`a_7=3`, `jLK=3`, `consecutiveRapidRefills`, `rapidRefillBreakerTripped`) | chunks.159.mjs:1391-1412, 1459-1461, 1484 | ❌ Not in source |
| `okK` thrash error message | chunks.159.mjs:1484 | ❌ Not in source |
| Cold compact (`tengu_cold_compact`, `FDY` cache cold check) | chunks.159.mjs:1405 | ❌ Not in source |
| `tengu_amber_redwood` window experiment | chunks.159.mjs:1284 | ❌ Not in source |
| `tengu_hazel_osprey` context-hint master switch | chunks.194.mjs:791 | ❌ Not in source |
| `context-hint-2026-04-09` beta header | chunks.194.mjs:846 (`I85`) | ❌ Not in source |
| `vI6` 8-parameter signature with `w = !1` | chunks.159.mjs:574 (verified) | ❌ Source has 7 params |

**Source-tree CONFIRMED to have (verified by `grep` in source):**

| Feature | Source-tree location | v2.1.112 binary status |
|---------|------------------------|--------------------------|
| Session memory compaction tier (`trySessionMemoryCompaction`) | sessionMemoryCompact.ts | ❌ No `trySessionMemoryCompaction` ref in chunks.159.mjs |
| `tengu_sm_compact` GrowthBook flag | (referenced in source) | ❌ No `tengu_sm_compact` in binary |
| Time-based microcompact (`tengu_slate_heron`) | timeBasedMCConfig.ts | ❌ No `tengu_slate_heron` in binary |
| `groupMessagesByApiRound` (extracted file) | grouping.ts | (Likely inlined in `KLK` in binary) |
| `compactWarningStore` React store | compactWarningState.ts | (Likely no React store in binary, just state setter) |
| `cachedMicrocompactPath` | microCompact.ts | ❌ Likely DCE'd (no `cache_edits` strings in binary search) |
| `KAIROS`/`PROACTIVE` autonomous-mode message | prompt.ts:362 | ❌ Likely no autonomous-mode message in binary |

**Source has `tengu_session_memory` flag** (chunks.218.mjs:930) — Session Memory feature exists in v2.1.112 binary but the **session-memory-COMPACTION tier** does NOT — it was added after v2.1.112.

**Verdict**: The source-tree is **NEWER** than v2.1.112 binary. The source includes post-v2.1.112 changes (session memory compaction, time-based microcompact, prompt cache break detection refactor, grouping extraction). The v2.1.112 binary has features the source doesn't yet have (rapid-refill breaker, cold compact, context-hint beta) — these were either added to v2.1.112 and later refactored OR added in a parallel branch.

**Implication**: My v2.1.112 analysis is **accurate for the v2.1.112 binary as actually shipped**. The discrepancies with this source-tree reflect genuine version divergence, not analysis errors. The CROSS_VALIDATION corrections in Section B (errors) primarily concern things the source-tree shows differently because it's a newer/divergent codebase, NOT things my binary analysis got wrong.

---

## Section H: Validation Strength Summary

- **High confidence** (validated by source): threshold math, gate cascade structure, prompt content (NO_TOOLS_PREAMBLE, BASE_COMPACT_PROMPT, formatCompactSummary), error messages, post-compact constants, KEEP-RECENT MC algorithm, microcompact tools list, three-layer no-tools defense
- **Medium confidence** (probable but not directly validated): function names mapped via behavior, hook output format, telemetry field names
- **Low confidence** (likely v2.1.112-specific or my binary read may be wrong): rapid-refill breaker, cold-compact `stripNonEssential`, `context-hint-2026-04-09` beta header, `tengu_hazel_osprey`, `tengu_amber_redwood` flags

The cross-validation strongly suggests my analysis got the **load-bearing architecture** right — threshold math, retry layers, post-compact restoration, hook semantics, prompt construction. The errors are concentrated in:
- Specific argument names
- Features that may have been added in v2.1.112 (and the source doesn't reflect them yet)
- Granular details about state management that I couldn't see in the binary
