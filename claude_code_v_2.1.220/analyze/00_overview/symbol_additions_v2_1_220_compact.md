# Symbol additions — v2.1.220, theme `compact`

Staged for merge. Compaction is mostly a **core feature**, but its token-counting and window-resolution
layers sit in platform code, so the groups below route to **two** index files; each `## Module:` block
names its destination. Merge each block into the matching module section of that file, creating the
section if absent, and keep rows alphabetical by the Obfuscated column inside each section.

All `File:Line` values are `cli_inner_pretty.js` line numbers in the **2.1.220** bundle
(`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`) that were read during
this pass. Identifiers tagged `(193)` in a description refer to the baseline bundle
(`/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`) and are never used as
the File:Line value.

Source documents: [`../07_compact/README.md`](../07_compact/README.md),
[`dispatcher_and_failure_breakers.md`](../07_compact/dispatcher_and_failure_breakers.md),
[`context_accounting_and_context_command.md`](../07_compact/context_accounting_and_context_command.md),
[`precomputed_and_reactive_compaction.md`](../07_compact/precomputed_and_reactive_compaction.md), and
[`compact_conversation_pipeline.md`](../07_compact/compact_conversation_pipeline.md).

**Duplicate check performed** against the eighteen existing `symbol_additions_v2_1_220_*.md` files.
Two deliberate overlaps are noted inline: `yBc` (also touched by `51_headless_sdk`, which supplied the
`sessionDisplayExplicit` / `display: "omitted"` anchors for the same `.198` bullet) and `MHd` / `eRo`
(an artifact-live-watch symbol recorded here only because it is the decoy that caused a false delta).

> **Carryover warning for the merger.** Many rows below are **not new mechanisms** — they are 2.1.193
> mechanisms whose obfuscated ids were re-mangled. Where that is the case the description names the
> 2.1.193 identifier explicitly. Merging these rows keeps the index usable for 2.1.220 line lookups; it
> must not be read as a list of 2.1.220 introductions. The genuinely-new rows are marked **NEW**.

---

## Module: Compact — dispatcher and circuit breakers

> Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `cOu` | `RAPID_REFILL_TURN_WINDOW` (`3`; 193 `VXi`) | cli_inner_pretty.js:237115 | constant |
| `ESe` | `isReactiveCompactAllowed` (gate `tengu_reactive_compact_remote`; 193 `M7`) | cli_inner_pretty.js:236849 | function |
| `FHs` | `autoCompactDispatcher` (async generator; returns the `{kind}` union; 193 `Rxo`) | cli_inner_pretty.js:441115 | function |
| `Gds` | `makeCompactedTurnState` (resets `consecutiveFailures: 0`) | cli_inner_pretty.js:237112 | function |
| `GMd` | `COMPACT_FAILURE_BREAKER_THRESHOLD` (`3`; **carryover**, 193 `ISl` `:470357 (193)`) | cli_inner_pretty.js:441233 | constant |
| `Gny` | `computeRapidRefillCount` (193 `u8d`) | cli_inner_pretty.js:237105 | function |
| `jir` | `isCompactQuerySource` (`e === "compact"`; 193 `dat`) | cli_inner_pretty.js:236858 | function |
| `jMd` | `recordCompactionFailure` (**carryover**, 193 `CSl` `:470189 (193)`) | cli_inner_pretty.js:441054 | function |
| `KI` | `isAutoCompactEnabled` (`DISABLE_COMPACT` → `DISABLE_AUTO_COMPACT` → `autoCompactEnabled`) | cli_inner_pretty.js:236844 | function |
| `Kn_` | `computeFixedPrefixOverflow` (feeds `tengu_auto_compact_prefix_overflow`; 193 `acf`) | cli_inner_pretty.js:441068 | function |
| `Pko` | `compactConversation` (summarization driver; 193 `Aht`) | cli_inner_pretty.js:440219 | function |
| `vfo` | `evaluateRapidRefillBreaker` (`{action:"trip"\|"proceed"}`; 193 `VDn`) | cli_inner_pretty.js:237108 | function |
| `Wds` | `RAPID_REFILL_THRASH_MESSAGE` (surfaced at `:337487`, `:338715`) | cli_inner_pretty.js:237116 | constant |
| `Xn_` | `shouldAutoCompact` (**NEW shape** — lost the Opus-4.8 conjunct, gained `agentContext`; 193 `lcf`) | cli_inner_pretty.js:441103 | function |
| `Yn_` | `isColdCompactEnabled` (`CLAUDE_CODE_COLD_COMPACT`; 193 `Xxo`) | cli_inner_pretty.js:441100 | function |
| `zn_` | `isRecognisedCompactionFailure` (4-disjunct; 193 `icf`) | cli_inner_pretty.js:441051 | function |

## Module: Compact — extended-thinking inheritance

> Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `jOu` | `thinkingConfigFromBudget` (`0` → disabled, else `{type:"enabled",budgetTokens}`) | cli_inner_pretty.js:237871 | function |
| `SXr` | `resolveEffectiveThinkingConfig` (**NEW** — replaced 193's `oVn(model) ? … : {type:"disabled"}`) | cli_inner_pretty.js:237866 | function |
| `yBc` | `resolveSubagentThinkingDisplay` (**NEW**; overlaps `51_headless_sdk`; 193's `yBc` `:9245 (193)` is unrelated) | cli_inner_pretty.js:119662 | function |

## Module: Compact — precomputed and reactive compaction

> Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `BPy` | `computeReactivePreserveStep` (parsed gap → multi-group jump; otherwise one group; 193 `tKd`) | cli_inner_pretty.js:328173 | function |
| `Bxs` | `MAX_PRECOMPACT_SIDECAR_BYTES` (`8000000`; **NEW**) | cli_inner_pretty.js:328429 | constant |
| `Cnn` | `groupMessagesByApiRoundForReactiveCompact` (193 `DFt`) | cli_inner_pretty.js:327738 | function |
| `FPy` | `runReactiveSummaryAttempt` (one-turn, no-tool compact fork; 193 `eKd`) | cli_inner_pretty.js:328092 | function |
| `GPy` | `classifyPrecomputeFailure` (normalizes timeout/API-error cause; 193 `Fif`) | cli_inner_pretty.js:328441 | function |
| `Hdr` | `getPrecompactSidecarPath` (`.jsonl` → `.precompact.json`; **NEW**) | cli_inner_pretty.js:328344 | function |
| `Hnn` | `isPrecomputedCompactionEnabled` (auto + reactive + remote + setting gates; 193 `OKn`) | cli_inner_pretty.js:328456 | function |
| `Idr` | `getPrecomputeAgentKey` (`agentId ?? "main"`; 193 `_8t`) | cli_inner_pretty.js:328453 | function |
| `Inn` | `isManualCompactQuerySource` (delegates to `jir`; 193 `NKn`) | cli_inner_pretty.js:328462 | function |
| `JAo` | `recordPrecomputedCompactionDiscard` (includes **NEW** `rehydrated` dimension; 193 `BKn`) | cli_inner_pretty.js:328894 | function |
| `Jsd` | `MAX_PRECOMPUTE_CONSECUTIVE_FAILURES` (`3`; 193 `zyl`) | cli_inner_pretty.js:328922 | constant |
| `Jxs` | `messagesAfterPrecomputeBoundary` (drops progress messages; 193 `GIo`) | cli_inner_pretty.js:328889 | function |
| `KAo` | `deletePrecompactSidecar` (best-effort; **NEW**) | cli_inner_pretty.js:328383 | function |
| `KPy` | `borrowPrecomputedCompaction` (waits without deleting; 193 `jif`) | cli_inner_pretty.js:328738 | function |
| `Ksd` | `loadPrecompactSidecar` (size/JSON/version/schema validator; **NEW**) | cli_inner_pretty.js:328358 | function |
| `Kxs` | `armPrecomputedCompaction` (pending → ready/failed producer; 193 `FIo`) | cli_inner_pretty.js:328578 | function |
| `nwo` | `runReactiveCompaction` (hook/swap orchestrator; 193 `jKn`) | cli_inner_pretty.js:329022 | function |
| `owo` | `finalizeReactiveCompaction` (restore state, annotate boundary, run PostCompact hook) | cli_inner_pretty.js:329187 | function |
| `qAo` | `summarizeOldGroupsReactively` (adaptive suffix-preserving loop; 193 `ZPn`) | cli_inner_pretty.js:328177 | function |
| `QAo` | `clearPrecomputedCompaction` (abort, discard, sidecar/counter cleanup; 193 `FKn`) | cli_inner_pretty.js:328905 | function |
| `qPy` | `MAX_PRECOMPUTE_REHYDRATE_GROWTH_TOKENS` (`150000`; **NEW**) | cli_inner_pretty.js:328927 | constant |
| `qsd` | `PRECOMPACT_SIDECAR_SUFFIX` (`.precompact.json`; **NEW**) | cli_inner_pretty.js:328430 | constant |
| `qxs` | `recordPrecomputeArmGateOnce` (per-agent/reason telemetry dedupe; 193 `NIo`) | cli_inner_pretty.js:328445 | function |
| `rad` | `deleteReadyPrecomputeSidecar` (current-session guard; **NEW**) | cli_inner_pretty.js:328563 | function |
| `Rdr` | `recordManualPrecomputeConsumption` (manual-trigger telemetry; 193 `Ayt`) | cli_inner_pretty.js:328865 | function |
| `tad` | `rehydratePrecomputedCompaction` (**NEW** live-history validator and ready-state reconstruction) | cli_inner_pretty.js:328471 | function |
| `T9` | `precomputedCompactionStateByAgent` (`pending | ready | failed`; 193 `A5`) | cli_inner_pretty.js:328946 | variable |
| `Uxs` | `PRECOMPACT_SIDECAR_VERSION` (`1`; **NEW**) | cli_inner_pretty.js:328428 | constant |
| `VPy` | `persistReadyPrecomputedCompaction` (**NEW** sidecar payload builder and telemetry) | cli_inner_pretty.js:328529 | function |
| `Vxs` | `isPrecomputePersistenceEnabled` (`tengu_amber_packet && !w1()`; **NEW**) | cli_inner_pretty.js:328465 | function |
| `WPy` | `MAX_PRECOMPUTE_REHYDRATE_AGE_MS` (`604800000`, seven days; **NEW**) | cli_inner_pretty.js:328926 | constant |
| `XAo` | `serializePrecompactSidecarIO` (promise-chain write/delete ordering; **NEW**) | cli_inner_pretty.js:328468 | function |
| `Xxs` | `tryApplyPrecomputedCompaction` (borrow/consume and boundary splice; 193 `jIo`) | cli_inner_pretty.js:328794 | function |
| `YAo` | `settlePendingPrecompute` (abort-controller identity guards stale completion; 193 `$Kn`) | cli_inner_pretty.js:328726 | function |
| `Ysd` | `rehydratePrecompactResult` (payload + current retained messages; **NEW**) | cli_inner_pretty.js:328386 | function |
| `Yxs` | `consumePrecomputedCompaction` (waits then deletes entry/sidecar; 193 `UIo`) | cli_inner_pretty.js:328763 | function |
| `YPy` | `recordPrecomputeConsumption` (includes **NEW** borrowed/rehydrated dimensions; 193 `Gif`) | cli_inner_pretty.js:328843 | function |
| `zPy` | `cloneToolContextForPrecompute` (independent abort; no UI callback; 193 `Uif`) | cli_inner_pretty.js:328567 | function |
| `zsd` | `persistPrecompactSidecar` (8 MB bound + secure mode `0600`; **NEW**) | cli_inner_pretty.js:328348 | function |
| `zxs` | `shouldArmPrecomputedCompaction` (threshold and recursion/transition guards; 193 `BIo`) | cli_inner_pretty.js:328570 | function |
| `Zsd` | `getPrecomputedCompactionState` (normalizes agent key; 193 `Kyl`) | cli_inner_pretty.js:328735 | function |
| — | `tengu_precomputed_compact_persisted` (**NEW**, 220=1/193=0) | cli_inner_pretty.js:328553 | constant |
| — | `tengu_precomputed_compact_rehydrate_rejected` (**NEW**, 220=1/193=0) | cli_inner_pretty.js:328523 | constant |
| — | `tengu_precomputed_compact_rehydrated` (**NEW**, 220=1/193=0) | cli_inner_pretty.js:328512 | constant |

## Module: Compact — conversation pipeline and preservation

> Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Bn_` | `buildInvokedSkillsAttachment` (5k per skill, 25k aggregate) | cli_inner_pretty.js:440881 | function |
| `FMd` | `partialCompactConversation` (selector-driven `from | up_to`) | cli_inner_pretty.js:440436 | function |
| `Fn_` | `buildPlanFileAttachment` | cli_inner_pretty.js:440875 | function |
| `iwo` | `buildPostCompactAttachments` (files, agents, plan, skills, tool/MCP deltas, SessionStart hooks) | cli_inner_pretty.js:440830 | function |
| `MLo` | `mergeHookInstructions` (user guidance before hook guidance; 193 `Yxo`) | cli_inner_pretty.js:440212 | function |
| `NMd` | `truncateHeadForCompactRetry` (gap-guided or 20% API-round removal; 193 `ASl`) | cli_inner_pretty.js:440166 | function |
| `Nn_` | `restorePostCompactReadFiles` (five files, 5k each, 50k aggregate) | cli_inner_pretty.js:440846 | function |
| `PLo` | `throwIfPreCompactBlocked` (manual notification, typed error; 193 `FYn`) | cli_inner_pretty.js:440182 | function |
| `rks` | `buildPlanModeAttachmentAfterCompact` | cli_inner_pretty.js:440904 | function |
| `tks` | `annotateBoundaryWithPreservedMessages` (`preservedSegment` + ordered/all UUIDs; 193 `YIo`) | cli_inner_pretty.js:440199 | function |
| `UMd` | `streamCompactSummary` (cache-sharing attempt then direct model/fallback stream; 193 `wSl`) | cli_inner_pretty.js:440622 | function |
| `Un_` | `buildAsyncAgentStatusAttachmentsAfterCompact` | cli_inner_pretty.js:440924 | function |
| `xdr` | `groupMessagesByApiRoundForCompactRetry` | cli_inner_pretty.js:327721 | function |

## Module: Compact — auto-compact window resolution

> Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$ny` | `MODEL_DEFAULT_WINDOW_MODELS` (**NEW value** — 4 entries; 193 `o8d` had 2) | cli_inner_pretty.js:237103 | variable |
| `aOu` | `resolveSurfaceScopedWindow` (entrypoint × platform) | cli_inner_pretty.js:236956 | function |
| `bfo` | `getAutoCompactWindowSource` (193 `WDn`) | cli_inner_pretty.js:237011 | function |
| `Bds` | `resolveExperimentAutoCompactWindow` (demoted `amber_redwood` Opus-4.8 path; 193 `P7` was a veto) | cli_inner_pretty.js:236943 | function |
| `Fny` | `getEffectiveBlockingWindow` (193 `i8d`) | cli_inner_pretty.js:237020 | function |
| `gfo` | `readAmberRedwoodGate` (`tengu_amber_redwood2 \|\| tengu_amber_redwood3`; 193 `aFt`) | cli_inner_pretty.js:236841 | function |
| `lOu` | `isOverBlockingLimit` (**NEW shape** — lost the Opus-4.8 conjunct; 193 `WXi`) | cli_inner_pretty.js:237068 | function |
| `Mds` | `computeAutoCompactThresholdTokens` (193 `$Zr`) | cli_inner_pretty.js:236911 | function |
| `Nny` | `resolveClientDataWindow` (`rowan_thicket` + persisted cache; `replacesDefault`) | cli_inner_pretty.js:236974 | function |
| `nOu` | `MODEL_AUTO_COMPACT_WINDOWS` (**NEW** — `claude-sonnet-5`: `967000`, `500000` per surface; 193 `BXi = {}`) | cli_inner_pretty.js:237097 | object |
| `o7` | `resolveAutoCompactWindow` (six-tier `{window,configured,source}` ladder; 193 `xj`) | cli_inner_pretty.js:236986 | function |
| `Ony` | `resolveModelDefaultWindow` (reads `nOu`; inert when `!KI()`) | cli_inner_pretty.js:236969 | function |
| `oOu` | `pickPlatformOrDefault` | cli_inner_pretty.js:236952 | function |
| `sOu` | `AUTO_COMPACT_RESERVE_TOKENS` (`20000`; 193 `jXi`) | cli_inner_pretty.js:237077 | constant |
| `uFe` | `classifyContextLevel` (returns `{level: "compact"\|"blocked"\|…}`; 193 `f0e`) | cli_inner_pretty.js:237063 | function |
| `vSe` | `getEffectiveAutoCompactWindow` (window − reserve; 193 `Yte`) | cli_inner_pretty.js:237014 | function |
| `yXr` | `getAutoCompactThreshold` (193 `lFt`) | cli_inner_pretty.js:237060 | function |
| `zVe` | `hasExplicitAutoCompactWindow` (**NEW** — `source !== "auto"`; 193 `p0e` enumerated 4 names) | cli_inner_pretty.js:237008 | function |
| `_fo` | `MIN_AUTO_COMPACT_WINDOW` (`1e5`) | cli_inner_pretty.js:237078 | constant |
| `Nds` | `MAX_AUTO_COMPACT_WINDOW` (`1e6`) | cli_inner_pretty.js:237079 | constant |

## Module: Compact — `/context` breakdown

> Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aBs` | `COMPACT_BUFFER_LABEL` (`"Compact buffer"`; 193 `Zxo`) | cli_inner_pretty.js:441780 | constant |
| `cUs` | `contextSlashCommandInteractive` (`local-jsx`, `isEnabled: () => !yn()` `:452677`) | cli_inner_pretty.js:452673 | object |
| `E2b` | `normalizeMessagesForContextView` (thin wrapper over `FE`; 193 `F_f`) | cli_inner_pretty.js:674050 | function |
| `FE` | `sliceFromLastCompactBoundary` (**carryover**, 193 `yy` `:601955 (193)`) | cli_inner_pretty.js:533381 | function |
| `igr` | `collectContextData` (non-interactive `/context` entry) | cli_inner_pretty.js:452639 | function |
| `jLo` | `buildContextUsageBreakdown` (**NEW signature** — 5 params + options; 193 `GYn` took 11 positionals) | cli_inner_pretty.js:441581 | function |
| `OUo` | `findLastCompactBoundaryIndex` (reverse scan for `X0(msg)`; 193 `aXn`) | cli_inner_pretty.js:533374 | function |
| `QMu` | `COMPACT_BUFFER_TOKENS` (`13000`; 193 `PXi`) | cli_inner_pretty.js:236926 | constant |
| `sBs` | `AUTOCOMPACT_BUFFER_LABEL` (`"Autocompact buffer"`; 193 `Qxo`) | cli_inner_pretty.js:441779 | constant |
| `uUs` | `contextSlashCommandNonInteractive` (`local`, `supportsNonInteractive: !0`; `isEnabled` `:452689`) | cli_inner_pretty.js:452681 | object |
| `ZMu` | `NON_AUTOCOMPACT_BUFFER_TOKENS` (`3000`; 193 `MXi`) | cli_inner_pretty.js:236927 | constant |

## Module: Compact — auto-memory side-effect suppression (`.203`)

> Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Gst` | `setMemoryPromptVariantOverride` (the side effect `analysisOnly` suppresses) | cli_inner_pretty.js:161289 | function |
| `iou` | `buildAutoMemoryDirPrompt` (**NEW** `analysisOnly` param) | cli_inner_pretty.js:161881 | function |
| `N$e` | `getMemoryPromptVariant` (reads `Jnu`) | cli_inner_pretty.js:161292 | function |
| `XVr` | `buildAutoMemoryPrompt` (**NEW** `analysisOnly` param) | cli_inner_pretty.js:161743 | function |

## Module: Compact — request-size and resume diagnostics

> Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Bls` | `MAX_REQUEST_BYTES` (`33554432`) | cli_inner_pretty.js:222501 | constant |
| `fir` | `buildUnprocessableAttachmentMessage` | cli_inner_pretty.js:228182 | function |
| `fpo` | `buildImageTooLargeMessage` | cli_inner_pretty.js:228171 | function |
| `Qcs` | `buildRequestTooLargeAttachmentMessage` (**NEW**, 220=2/193=0; names `/compact` as the remedy) | cli_inner_pretty.js:228176 | function |
| `sUo` | `warnUnchainedResumeTranscript` (**NEW** — `tengu_resume_unchained_transcript` `:525013`) | cli_inner_pretty.js:524997 | function |
| `zW` | `PROMPT_TOO_LONG_PREFIX` (`"Prompt is too long"`; **carryover**, 193 `dF` `:237968 (193)`) | cli_inner_pretty.js:228935 | constant |

## Module: Compact — transcript-file compaction (disk GC; **not** conversation compaction)

> Merge into: `symbol_index_core_features.md`
>
> Recorded here because the gate names collide with conversation compaction and caused a mis-anchor.
> The mechanism itself belongs with `50_performance`.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| — | `tengu_transcript_compact` (**NEW**, `{bytesBefore, bytesAfter}`) | cli_inner_pretty.js:523965 | constant |
| — | `tengu_transcript_compact_failed` (**NEW**; 6 reasons, all file-level) | cli_inner_pretty.js:523812 | constant |
| `rB_` | `TRANSCRIPT_COMPACT_YIELD_FRACTION` (`0.1`; used in the backstop test at `:523963`) | cli_inner_pretty.js:527407 | constant |
| `tB_` | `TRANSCRIPT_BACKSTOP_MAX_BYTES` (`8 * tbr` assigned at `:527550`; declared `:527406`) | cli_inner_pretty.js:527550 | constant |
| `tbr` | `TRANSCRIPT_BACKSTOP_BASE_BYTES` (`20971520` = 20 MiB) | cli_inner_pretty.js:527405 | constant |

---

## Module: Model — context-window resolution

> Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ber` | `DEFAULT_CONTEXT_WINDOW` (`200000`) | cli_inner_pretty.js:150314 | constant |
| `CSi` | `setLongContext1mCreditsBlocked` | cli_inner_pretty.js:3069 | function |
| `dro` | `getSonnet46WindowOverride` (clientdata `kelp_forest_sonnet`) | cli_inner_pretty.js:150272 | function |
| `fZc` | `getDisableCompactWindowOverride` (`CLAUDE_CODE_MAX_CONTEXT_TOKENS`, only under `DISABLE_COMPACT`) | cli_inner_pretty.js:150245 | function |
| `gxe` | `LONG_CONTEXT_CLAMP` (`200000`; a constant distinct from `ber` with the same value) | cli_inner_pretty.js:150315 | constant |
| `gZc` | `getAutoCompactWindowsCache` (**NEW site** — persisted cache, first-party auth only) | cli_inner_pretty.js:150268 | function |
| `H9t` | `isLongContext1mCreditsBlocked` (session flag, unset until the first API response) | cli_inner_pretty.js:3066 | function |
| `hZc` | `getClientDataWindowTable` (`rowan_thicket` source) | cli_inner_pretty.js:150265 | function |
| `m7i` | `isLongContextClampedToBaseline` | cli_inner_pretty.js:150252 | function |
| `Mxg` | `MAX_OUTPUT_TOKENS_32K` (`32000`) | cli_inner_pretty.js:150316 | constant |
| `mZc` | `getNativeContextWindow` (the 1M ladder) | cli_inner_pretty.js:150255 | function |
| `Nxg` | `CONTEXT_WINDOW_1M` (`1e6`) | cli_inner_pretty.js:150318 | constant |
| `Oxg` | `MAX_OUTPUT_TOKENS_128K` (`128000`) | cli_inner_pretty.js:150317 | constant |
| `pro` | `computeContextUsedPercent` (clamped 0-100) | cli_inner_pretty.js:150282 | function |
| `Xv` | `getContextWindowTokens` | cli_inner_pretty.js:150239 | function |
| `yZc` | `getMaxOutputTokensMinusOne` | cli_inner_pretty.js:150311 | function |

## Module: Model — token counting

> Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_Mt` | `countTokensPrimary` (Bedrock branch + **NEW** gateway catch fallback `:442384-442385`; 193 `uGe`) | cli_inner_pretty.js:442363 | function |
| `cBs` | `countTokensByCreateProbe` (`max_tokens: 1` estimator; 193 `kSl`) | cli_inner_pretty.js:442390 | function |
| `Cy` | `hasGatewayAuth` (`Ot.gatewayAuth`; guards the new catch fallback) | cli_inner_pretty.js:3459 | function |
| `eOd` | `findCompactAnchorRecord` | cli_inner_pretty.js:442577 | function |
| `gmt` | `countToolDefinitionTokens` (`return i ?? 0` — the site that rendered 0 on Bedrock) | cli_inner_pretty.js:441315 | function |
| `Hhr` | `countTokensWithFallback` (**carryover**, 4/4) | cli_inner_pretty.js:441299 | function |
| `khr` | `getLastApiUsage` (unbounded backward scan; **carryover**, 193 `hat` `:235307 (193)`) | cli_inner_pretty.js:442517 | function |
| `qMd` | `countTokensSinceCompactAnchor` (bounded by the boundary, unlike `khr`; 193 `JXi`) | cli_inner_pretty.js:442600 | function |
| `QMd` | `stripNonCountableToolFields` (**NEW** — the `.196` Bedrock `/context` fix) | cli_inner_pretty.js:442351 | function |
| `RMd` | `countTokensForString` | cli_inner_pretty.js:442359 | function |
| `wo_` | `countTokensBedrock` (AWS `CountTokensCommand` over an InvokeModel body) | cli_inner_pretty.js:442436 | function |
| `XMd` | `COUNT_TOKENS_THINKING_MAX_TOKENS` (`2048`) | cli_inner_pretty.js:442457 | constant |
| `yBs` | `COUNT_TOKENS_THINKING_BUDGET` (`1024`) | cli_inner_pretty.js:442456 | constant |

## Module: Model — the Opus-4.8 experiment remnants

> Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `XMu` | `OPUS_4_8_ID` (`"claude-opus-4-8"`; 193 `PZr` `:234872 (193)`, where it gated a compaction veto) | cli_inner_pretty.js:236862 | constant |

---

## Module: UI — artifact live-watch reconnect (decoy, recorded to prevent a repeat)

> Merge into: `symbol_index_infra_integration.md`
>
> These rows exist only because `MHd`'s `consecutiveFailures` field inflates the compaction breaker's
> literal count from 6 to 11. Anyone diffing `consecutiveFailures` must exclude them.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `DXy` | `ARTIFACT_REWATCH_BACKOFF_DEFAULTS` (`{baseMs:1000, capMs:30000, minUptimeMs:60000, maxConsecutiveFailures:10}`) | cli_inner_pretty.js:420495 | object |
| `eRo` | `ARTIFACT_REWATCH_BACKOFF_CONFIG` (mutable copy of `DXy`, declared `:420476`) | cli_inner_pretty.js:420496 | object |
| `MHd` | `rewatchArtifactWithBackoff` (exponential backoff with ±25 % jitter, shift capped at 5) | cli_inner_pretty.js:420181 | function |
| `OHd` | `stopArtifactWatchWithReason` | cli_inner_pretty.js:420196 | function |

---

## Rows deliberately NOT added

| Symbol / literal | Why excluded |
|---|---|
| `lineage` `:846491` | genuinely 220=1/193=0 but it is a print.ts agent-swarm teardown log, not session lineage. Recorded as a mis-anchor in the module docs; adding it to the index would propagate the error. |
| `logical_parent_uuid` / `logicalParentUuid` | the *field* is carryover (193 `:699674`, `:618360`); only the two extra emitters `:841759` / `:842259` are new. Belongs to `51_headless_sdk`'s SDK-event surface, which already stages that group. |
| `originalMessages` | 220=3/193=0 but it is a positional→named argument refactor with identical values on both sides. Indexing it would invite exactly the false delta the module docs disprove. |
| `failure_breaker_open` as a *new* union member | carryover; `GMd`/`ISl` are already covered by the `GMd` row above, which states the carryover explicitly. |
