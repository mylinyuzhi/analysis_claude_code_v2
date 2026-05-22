# Symbol Additions — v2.1.142 Compact Architecture (Unit 07)

All symbol mappings discovered during the v2.1.142 compaction architecture deep-dive (proactive vs reactive, model selection, prompt template, PreCompact hook, thrash guard, fork interaction, sensitive-instructions preservation). Symbols are bucketed by canonical module so they can be merged into the appropriate central `symbol_index_*.md` file.

Source file referenced throughout: `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js`.

This file complements `symbol_additions_v2_1_142_compact_cache.md` (unit 11). The two files together cover the entire v2.1.142 compact-subsystem delta; cross-references avoid duplicating mappings already in unit 11.

---

## Module: Compaction (target = `symbol_index_core_features.md`)

### Autocompact Dispatcher & Threshold Math

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Fo7` | autoCompactGenerator | cli_inner_pretty.js:408400-408445 | function |
| `o45` | shouldAutoCompactNow | cli_inner_pretty.js:408389-408399 | function |
| `cZ` | isAutoCompactEnabled | cli_inner_pretty.js:408384-408388 | function |
| `Wy6` | computeRapidRefillStreak | cli_inner_pretty.js:408349-408351 | function |
| `Zy6` | streamingCompactWrapper | cli_inner_pretty.js:408454-408481 | function |
| `vP$` | computeAutoCompactThreshold | cli_inner_pretty.js:408269-408274 | function |
| `OH4` | computePrecomputeBufferThreshold | cli_inner_pretty.js:408275-408277 | function |
| `MH4` | computeContextLevel | cli_inner_pretty.js:408278-408289 | function |
| `_NH` | computeTokenWarningState | cli_inner_pretty.js:408372-408376 | function |
| `o47` | isAboveAutoCompactThreshold | cli_inner_pretty.js:408377-408383 | function |
| `ny6` | getAutoCompactThreshold | cli_inner_pretty.js:408369-408371 | function |
| `FHH` | getEffectiveContextWindow | cli_inner_pretty.js:408339-408344 | function |
| `i45` | getEffectiveContextWindowForBlocking | cli_inner_pretty.js:408345-408348 | function |
| `di` | resolveAutoCompactWindowSource | cli_inner_pretty.js:408320-408334 | function |
| `liH` | isWindowFromEnvOrSettings | cli_inner_pretty.js:408335-408338 | function |
| `nJ` | getMaxContextTokensForModel | cli_inner_pretty.js:128600-128611 | function |
| `Kl$` | getKelpForestOverride | cli_inner_pretty.js:128612-128621 | function |
| `LI6` | parseAutoCompactWindowString | cli_inner_pretty.js:408294-408306 | function |
| `aq8` | getRedwoodAutoCompactOverride | cli_inner_pretty.js:408311-408319 | function |
| `ZI6` | getAutoCompactDispatcherConfig | cli_inner_pretty.js:408359-408368 | function |
| `r45` | getPrecomputeBufferFraction | cli_inner_pretty.js:408355-408358 | function |
| `Fq8` | isAmberRedwood2Active | cli_inner_pretty.js:408307-408310 | function |
| `a45` | computeAutoModeHintText | cli_inner_pretty.js:408446-408453 | function |
| `WI6` | isColdCompactEnabled | cli_inner_pretty.js:408352-408354 | function |
| `DH4` | MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES | cli_inner_pretty.js:408486 | constant |
| `PI6` | RAPID_REFILL_TURN_WINDOW | cli_inner_pretty.js:408487 | constant |
| `NO8` | MAX_CONSECUTIVE_RAPID_REFILLS | cli_inner_pretty.js:408488 | constant |
| `Py6` | AUTOCOMPACT_THRASHING_MESSAGE | cli_inner_pretty.js:408513 | constant |
| `YH4` | AUTOCOMPACT_BUFFER_TOKENS | cli_inner_pretty.js:408290 | constant |
| `fH4` | MANUAL_COMPACT_BUFFER_TOKENS | cli_inner_pretty.js:408291 | constant |
| `jI6` | DEFAULT_PRECOMPUTE_BUFFER_FRACTION | cli_inner_pretty.js:408292 | constant |
| `jH4` | MAX_OUTPUT_TOKENS_FOR_SUMMARY | cli_inner_pretty.js:408482 | constant |
| `XI6` | MIN_AUTO_COMPACT_WINDOW_TOKENS | cli_inner_pretty.js:408483 | constant |
| `JH4` | MAX_AUTO_COMPACT_WINDOW_TOKENS | cli_inner_pretty.js:408484 | constant |
| `B45` | POST_COMPACT_TOKEN_BUDGET | cli_inner_pretty.js:408208 | constant |
| `p45` | POST_COMPACT_MAX_TOKENS_PER_FILE | cli_inner_pretty.js:408209 | constant |
| `U45` | POST_COMPACT_MAX_TOKENS_PER_SKILL | cli_inner_pretty.js:408210 | constant |
| `F45` | POST_COMPACT_SKILLS_TOKEN_BUDGET | cli_inner_pretty.js:408211 | constant |
| `cq8` | POST_COMPACT_MAX_FILES_TO_RESTORE | cli_inner_pretty.js:408207 | constant |
| `d$6` | DEFAULT_CONTEXT_WINDOW_TOKENS | cli_inner_pretty.js:128657 | constant |
| `h_$` | COMPACT_MAX_OUTPUT_TOKENS | cli_inner_pretty.js:128658 | constant |

### Reactive Compact — Precompute, Trigger, Hand-off

(Cross-references unit 11 entries; new symbols below are unique to this analysis.)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `n47` | startPrecomputedCompact | cli_inner_pretty.js:243450-243540 | function |
| `Bq8` | mutatePrecomputeEntry | cli_inner_pretty.js:243541-243549 | function |
| `W3_` | peekPrecomputeEntry | cli_inner_pretty.js:243550-243552 | function |
| `Z3_` | borrowPrecomputeEntry | cli_inner_pretty.js:243553-243574 | function |
| `G3_` | consumePrecomputeEntry | cli_inner_pretty.js:243575-243598 | function |
| `i47` | swapWithPrecomputeIfReady | cli_inner_pretty.js:243599-243630 | function |
| `T3_` | getMessagesSinceUuid | cli_inner_pretty.js:243631-243635 | function |
| `r47` | logDiscardedPrecompute | cli_inner_pretty.js:243636-243645 | function |
| `Uq8` | abortAndDiscardPrecompute | cli_inner_pretty.js:243646-243651 | function |
| `Dj6` | isPrecomputeEnabled | cli_inner_pretty.js:243428-243432 | function |
| `jj6` | isCompactQuerySource | cli_inner_pretty.js:243433-243436 | function |
| `P3_` | createForkedAbortContext | cli_inner_pretty.js:243437-243439 | function |
| `l47` | shouldStartPrecomputedCompact | cli_inner_pretty.js:243440-243449 | function |
| `pq8` | normalizeAgentIdForPrecompute | cli_inner_pretty.js:243425-243427 | function |
| `QC` | precomputeRegistry | cli_inner_pretty.js:243652 | variable |
| `wj6` | precomputeAttemptCounter | cli_inner_pretty.js:243652 | variable |

### Compact Conversation Core

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `qrH` | compactConversation | cli_inner_pretty.js:407582-407767 | function |
| `FM8` | throwOnPreCompactHookBlock | cli_inner_pretty.js:407549-407558 | function |
| `$4H` | buildPostCompactMessages | cli_inner_pretty.js:407560-407562 | function |
| `yj6` | annotateBoundaryWithPreservedSegment | cli_inner_pretty.js:407563-407574 | function |
| `DI6` | mergeHookInstructions | cli_inner_pretty.js:407575-407581 | function |
| `KH4` | truncateMessagesForPartialPTL | cli_inner_pretty.js:407533-407548 | function |
| `hQH` | groupMessagesByApiRound | (referenced) | function |
| `mUH` | extractPTLTokenGap | (referenced) | function |
| `KV` | roughTokenCountEstimationForMessages | (referenced) | function |
| `wX` | tokenCountWithEstimation | (referenced) | function |
| `sG` | computeSnipTokensFreed | (referenced) | function |
| `bH` | isEnvTruthy | (referenced) | function |
| `Z$` | getFeatureValue | (referenced) | function |
| `A5` | getUserConfigBoolean | (referenced) | function |

### PreCompact / PostCompact Hooks

Target file: `symbol_index_core_features.md` (also in hooks section).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ug` | executePreCompactHooks | cli_inner_pretty.js:519855-519893 | function |
| `zMH` | executePostCompactHooks | cli_inner_pretty.js:519894-519912 | function |
| `Em` | processSessionStartHooks | (referenced) | function |
| `NQH` | logPermissionContextForAnts | (referenced) | function |
| `p_` | DEFAULT_HOOK_TIMEOUT_MS | (referenced) | constant |
| `M_` | hookInputBase | (referenced) | function |
| `YW` | dispatchHookEvent | (referenced) | function |

### Compact Boundary, Cleanup, Telemetry

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `jM$` | createCompactBoundaryMessage | (referenced) | function |
| `De` | extractDiscoveredToolNames | (referenced) | function |
| `xL` | isCompactBoundaryMessage | (referenced) | function |
| `fA` | getTranscriptPath | (referenced) | function |
| `WL` | isReplActive | (referenced) | function |
| `m5$` | hasReplContextForAgent | (referenced) | function |
| `fM$` | wrapSummaryAsContinuationPrompt | cli_inner_pretty.js:243085-243105 | function |
| `Bn` | postCompactCleanup | cli_inner_pretty.js:243907-243920 | function |
| `RH` | clearCompactFailureCounter | (referenced) | function |
| `J8` | recordCompactFailureCategory | (referenced) | function |
| `uH` | recordCompactFailure | (referenced) | function |
| `zOH` | logCompactDurationSpan | (referenced) | function |
| `tu` | startsWithApiErrorPrefix | (referenced) | function |
| `_0H` | isPromptTooLongAssistantMessage | (referenced) | function |
| `fe$` | isMediaSizeError | (referenced) | function |

### Compact Telemetry Events (referenced)

| Event Name | Where Emitted | Notes |
|------------|---------------|-------|
| `tengu_compact` | qrH:407692 | Final success event with rich metrics |
| `tengu_compact_failed` | qrH:407628, 407648, 407654 | reason ∈ {prompt_too_long, no_summary, api_error, no_streaming_response} |
| `tengu_compact_ptl_retry` | qrH:407637 | One per PTL truncation cycle |
| `tengu_compact_cache_sharing_success` | zH4:407997 | Fork path returned a usable summary |
| `tengu_compact_cache_sharing_fallback` | zH4:408014, 408017 | Forking failed, streaming path engaged |
| `tengu_auto_compact_circuit_breaker` | Fo7:408442 | Circuit breaker trip notification |
| `tengu_reactive_compact_triggered` | Y97:243964 | (see unit 11) |
| `tengu_reactive_compact_attempt` | uq8:243288 | (see unit 11) |
| `tengu_reactive_compact_succeeded` | f97:244146 | (see unit 11) |
| `tengu_reactive_compact_failed` | Ej6:244065 | (see unit 11) |
| `tengu_precomputed_compact_started` | n47:243467 | Precompute begun in background |
| `tengu_precomputed_compact_ready` | n47:243512 | Precompute settled OK, queued for use |
| `tengu_precomputed_compact_failed` | n47:243497 | Precompute settled with failure |
| `tengu_precomputed_compact_discarded` | r47:243637 | Precompute settled but discarded |
| `tengu_precompute_borrow_boundary_miss` | i47:243614 | Borrow had no usable boundary |
| `tengu_context_hint_reject` | gh4:524622 | Server returned context_hint rejection |
| `tengu_context_hint_busy_fallback` | yW8:524631 | context_hint server busy → fallback |

### Fork Pointer Hydration (cross-reference to unit 11)

Target file: `symbol_index_infra_integration.md` (slash commands).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `CT4` | hydrateForkPointer | cli_inner_pretty.js:499834-499897 | function |
| `RT4` | hydrateForkAndAppendMetadata | cli_inner_pretty.js:499820-499823 | function |
| `lh5` | loadParentSessionForFork | cli_inner_pretty.js:499820 | function |
| `ih5` | resolveSessionTitleFromHistory | cli_inner_pretty.js:499824-499833 | function |
| `iK4` | branchCommandWriter (writes pointer) | cli_inner_pretty.js:428076-428184 | function |
| `dh5` | FORK_HYDRATED_MESSAGE_TYPES | cli_inner_pretty.js:499905 | constant |
| `bZ$` | nodeCryptoForFork | cli_inner_pretty.js:499898 | variable |
| `BL8` | nodePathForFork | cli_inner_pretty.js:499898 | variable |

### Sensitive Instructions Preservation (cross-reference to unit 11)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bq8` | compactFullPrompt (includes sensitive-instructions clause at item 1, last bullet + item 6) | cli_inner_pretty.js:242949-243062 | function |
| `m47` | compactPartialPrompt (includes sensitive-instructions clause) | cli_inner_pretty.js:242856-242948 | function |
| `j3_` | compactRecentBodyConst (PARTIAL_COMPACT_PROMPT body, includes sensitive-instructions clause) | cli_inner_pretty.js:243108-243181 | constant |

### Environment & Configuration

Target file: `symbol_index_core_features.md` (also in CLI section).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `DISABLE_COMPACT` | env var | cli_inner_pretty.js:128601, 408385, 408401, 440777 | env |
| `DISABLE_AUTO_COMPACT` | env var | cli_inner_pretty.js:408386 | env |
| `CLAUDE_CODE_MAX_CONTEXT_TOKENS` | env var | cli_inner_pretty.js:128601-128603 | env |
| `CLAUDE_CODE_AUTO_COMPACT_WINDOW` | env var | cli_inner_pretty.js:408323 | env |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | env var | cli_inner_pretty.js:408360 | env |
| `CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE` | env var | cli_inner_pretty.js:408361 | env |
| `CLAUDE_CODE_COLD_COMPACT` | env var | cli_inner_pretty.js:408353 | env |
| `autoCompactEnabled` | user-config key | cli_inner_pretty.js:50952, 408387, 435674 | config |
| `autoCompactWindow` | user-config key | cli_inner_pretty.js:50732, 392297, 408404 | config |

### Subagent Summary (related — claude_code.summary events)

Target file: `symbol_index_core_execution.md`.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `CM$` | subagentProgressSummary | cli_inner_pretty.js:271869-271941 | function |
| `AP_` | AGENT_SUMMARY_INTERVAL_MS | cli_inner_pretty.js:271942 | constant |
| `zP_` | buildSubagentSummaryPrompt | (referenced) | function |
| `lO7` | publishSubagentSummary | (referenced) | function |

### Compact Warning Hook (compactWarningHook)

Target file: `symbol_index_core_features.md`.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (referenced) | `useCompactWarningSuppression` (React hook) | n/a — present in 2.1.88 TS source `/lyz/codespace/3rd/claude-code/src/services/compact/compactWarningHook.ts` | function |
| (state module) | `compactWarningStore` / `clearCompactWarningSuppression` / `suppressCompactWarning` | n/a | object |

The compactWarningHook is a thin React subscription to the global suppression state — used by the status-line warning ("/compact recommended") that auto-hides for the rest of the turn once micro-compaction has freed enough headroom. In the v2.1.142 bundle the React subscriber is bundled with the status-line rendering; the suppression logic lives in `clearCompactWarningSuppression()` and `suppressCompactWarning()` called from `microcompactMessages`.

---

## Module: Model Selection (target = `symbol_index_infra_platform.md`)

### Compaction-Specific Model Helpers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `k7` | normalizeModelId | (referenced) | function |
| `e7H` | getMaxOutputTokensForModel | (referenced) | function |
| `IYH` | getModelOutputTokenLimits | cli_inner_pretty.js:128629-128653 | function |
| `dMK` | maxOutputTokensMinusOne | cli_inner_pretty.js:128654-128656 | function |
| `Tw` | getSdkBetas | (referenced) | function |
| `EU` | longContextBetaRegistry | (referenced; `pJ("long_context", "context-1m-2025-08-07")`) | object |
| `Yi8` | contextHintBetaRegistry | cli_inner_pretty.js:96816 | object |

### Haiku / Fast Model Routing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `tc8` | HAIKU_3_5_MODEL_FAMILY | cli_inner_pretty.js:90553-90561 | object |
| `ec8` | HAIKU_4_5_MODEL_FAMILY | cli_inner_pretty.js:90563-90569 | object |
| `lv` | resolvePlanModeHaikuFast | cli_inner_pretty.js:97388 | function |

---

## Module: Session & Fork (target = `symbol_index_core_execution.md`)

### forkedFrom Pointer

| Field | Description |
|-------|-------------|
| `forkedFrom.sessionId` | UUID of the parent session that owns the original message |
| `forkedFrom.messageUuid` | UUID of the original message — used as foreign key during hydration |

The pointer is set in:
- `iK4` (cli_inner_pretty.js:428134) — `/branch` writer path
- `CT4` (cli_inner_pretty.js:499879) — `/fork` background-agent path

### resumePersistedCount

Field threaded through `Vb` (subagent loop) at cli_inner_pretty.js:393125 — value comes from `uiH` (cli_inner_pretty.js:386697) and tracks how many messages of the parent transcript are already on disk so a PTL-driven retry can write only the new tail (not re-append the entire prior conversation).

Both `forkedFrom` and `resumePersistedCount` are already mapped in `symbol_additions_v2_1_142_compact_cache.md`; the entries here document the *fields* (not the host functions) so cross-file lookups resolve in one hop.

---

## Cross-References

- `symbol_additions_v2_1_142_compact_cache.md` — Unit 11 (compact + prompt cache delta)
- `symbol_index_core_features.md` — Compact module home
- `symbol_index_core_execution.md` — Subagent + state shape
- `symbol_index_infra_platform.md` — Model registry + beta headers
- `symbol_index_infra_integration.md` — `/branch`, `/fork`, `/rewind`, `/compact` slash commands

---

**Status**: Core-execution-scoped rows (Agent Loop, Subagent, State, cross-cutting LLM API) consolidated into symbol_index_core_execution.md as of v2.1.142 deobfuscation work. Compact / hooks / prompt-cache / model-selection rows remain pending consolidation into their respective indexes (core_features, infra_platform, infra_integration).
