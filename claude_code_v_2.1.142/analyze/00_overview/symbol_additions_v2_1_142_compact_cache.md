# Symbol Additions — v2.1.142 Compact & Prompt Cache (Unit 11)

All symbol mappings discovered in the 07_compact and 23_prompt_cache delta analysis (v2.1.113 → v2.1.142). Symbols are bucketed by their canonical owning module so they can be merged into the appropriate central `symbol_index_*.md` file later.

Source file referenced throughout: `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` (611,353 lines).

---

## Module: Compaction (target = `symbol_index_core_features.md`)

### Reactive Compaction (v2.1.142 + v2.1.113 + v2.1.121)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Y97` | reactiveCompactDispatcher | cli_inner_pretty.js:243951-244055 | function |
| `Ej6` | runReactiveCompact | cli_inner_pretty.js:244056-244092 | function |
| `f97` | finalizeReactiveCompact | cli_inner_pretty.js:244093-244175 | function |
| `uq8` | iterateReactiveSummarize | cli_inner_pretty.js:243253-243336 | function |
| `X3_` | summarizeReactiveAttempt | cli_inner_pretty.js:243188-243241 | function |
| `B47` | seedPreservedCount | cli_inner_pretty.js:243242-243248 | function |
| `L3_` | nextStepFromGap | cli_inner_pretty.js:243249-243252 | function |
| `H4H` | isReactiveCompactEligible | cli_inner_pretty.js:243938-243944 | function |
| `DM$` | isReactiveCompactFeatureEnabled | cli_inner_pretty.js:243934-243937 | function |
| `z97` | isPTLAssistantResponse | cli_inner_pretty.js:243945-243947 | function |
| `Nj6` | isImageTooLargeAssistantResponse | cli_inner_pretty.js:243948-243950 | function |
| `m3_` | reconstructReactiveAttachments | cli_inner_pretty.js:244192-244206 | function |
| `u3_` | zeroOutUsageOnPreservedAssistant | cli_inner_pretty.js:244176-244191 | function |
| `V35` | runReactiveCompactManual | cli_inner_pretty.js:431766-431817 | function |
| `T35` | compactSlashCommand | cli_inner_pretty.js:431845-431876 | function |
| `h44` | buildCompactedDisplayText | cli_inner_pretty.js:431818-431827 | function |
| `I44` | buildCacheSafeParamsForCompact | cli_inner_pretty.js:431828-431844 | function |
| `mUH` | extractPTLTokenGap | (referenced; extracts overflow number from "Prompt is too long" message) | function |
| `S3_` | isReactiveCompactReturnableError | cli_inner_pretty.js:243872-243874 | function |
| `R3_` | unwrapAssistantErrorMessage | cli_inner_pretty.js:243875-243877 | function |
| `C3_` | resetAutoModeAck | cli_inner_pretty.js:243878-243880 | function |
| `Bn` | postCompactCleanup | cli_inner_pretty.js:243907-243920 | function |

### Compact Prompts (v2.1.139)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bq8` | compactFullPrompt | cli_inner_pretty.js:242949-243062 | function |
| `m47` | compactPartialPrompt | cli_inner_pretty.js:242856-242948 | function |
| `j3_` | compactRecentBodyConst | cli_inner_pretty.js:243108-243181 | constant |
| `u47` | compactNoToolsReminder | cli_inner_pretty.js:243182-243186 | constant |
| `Yj6` | lazyInitCompactBodies | cli_inner_pretty.js:243107 | function |
| `J3_` | stripAnalysisAndRewrapSummary | cli_inner_pretty.js:243063-243084 | function |
| `fM$` | wrapSummaryAsContinuationPrompt | cli_inner_pretty.js:243085-243105 | function |

### Partial Compact + Rewind (v2.1.141 + v2.1.133)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_H4` | partialCompact | cli_inner_pretty.js:407768-407934 | function |
| `AH4` | partialCompactErrorNotice | cli_inner_pretty.js:407935-407951 | function |
| `Mj6` | denyToolUseDuringCompact | cli_inner_pretty.js:407952-407958 | function |
| `zH4` | summarizeCallWithCachePrefix | cli_inner_pretty.js:407959-408150 | function |
| `Hc6` | messageSelector | cli_inner_pretty.js:539845-540197 | function |
| `ed6` | isSummarizeAction | cli_inner_pretty.js:539842-539844 | function |
| `lF5` | summarizeOptionDescription | cli_inner_pretty.js:540199-540212 | function |
| `iF5` | renderRestoreOptionDiffStats | cli_inner_pretty.js:540241+ | function |
| `nF5` | renderRestoreOptionStatus | cli_inner_pretty.js:540213-540240 | function |
| `Gb` | USER_ABORT_PATTERN | cli_inner_pretty.js:408217 | constant |
| `ErH` | NO_MESSAGES_PATTERN | cli_inner_pretty.js:408213 | constant |
| `$rH` | PRECOMPACT_BLOCKED_PREFIX | cli_inner_pretty.js:408218 | constant |
| `tF` | PROMPT_TOO_LONG_PREFIX | cli_inner_pretty.js:200302 | constant |
| `UM8` | PTL_EXHAUSTED_USER_MESSAGE | (referenced; "Conversation too long. Press esc twice…") | constant |
| `qH4` | PARTIAL_PTL_RETRY_LIMIT | (referenced) | constant |
| `KH4` | truncateMessagesForPartialPTL | (referenced) | function |
| `jM$` | makeCompactBoundaryMarker | (referenced) | function |
| `yj6` | linkBoundaryToSummary | (referenced) | function |
| `kf$` | snapshotReadFileState | (referenced) | function |

### Subagent Resume Persistence (v2.1.132)

Target file: `symbol_index_core_execution.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `uiH` | runResumedSubagent | cli_inner_pretty.js:386626-386713 | function |
| `Vb` | runSubagentInner | cli_inner_pretty.js:393098-393433 | function |
| `cJ6` | stripIncompleteToolPairs | cli_inner_pretty.js:393435-393451 | function |
| `Me` | persistSubagentTranscript | (referenced; appends to JSONL) | function |
| `miH` | loadSubagentTranscript | (referenced) | function |
| `vE6` | loadSubagentMetadata | (referenced) | function |
| `Vy6` | recordForkContextRef | (referenced) | function |
| `tJ$` | persistSubagentMetadata | (referenced) | function |
| `IA8` | loadJSONLLines | (referenced) | function |
| `HJ$` | stripDeadForkEntries | (referenced) | function |
| `ej$` | fixupOrphanToolUseIds | (referenced) | function |
| `ArK` | mergeContentReplacements | (referenced) | function |
| `slH` | runStreamingSubagentLoop | cli_inner_pretty.js:339762-339950+ | function |
| `CM$` | subagentProgressSummary | cli_inner_pretty.js:271869-271941 | function |
| `AP_` | AGENT_SUMMARY_INTERVAL_MS | cli_inner_pretty.js:271942 | constant |
| `zP_` | buildSubagentSummaryPrompt | (referenced; builds summary prompt with last-summary context) | function |
| `lO7` | publishSubagentSummary | (referenced; stores summary in parent's summary store) | function |

### /branch and /fork (v2.1.116 + v2.1.118)

Target file: `symbol_index_infra_integration.md` (slash commands)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `iK4` | branchCommandWriter | cli_inner_pretty.js:428076-428184 | function |
| `rK4` | branchAndResume | cli_inner_pretty.js:428201-428244 | function |
| `Kf5` | branchSlashCommand | cli_inner_pretty.js:428245-428247 | function |
| `nK4` | deriveFirstPromptForBranch | cli_inner_pretty.js:428069-428075 | function |
| `qf5` | uniquifyBranchTitle | cli_inner_pretty.js:428185-428200 | function |
| `$k5` | branchCommandConfig | cli_inner_pretty.js:486868-486876 | object |
| `qW4` | branchCommandExport | cli_inner_pretty.js:486876 | variable |
| `oR6` | branchCommandModuleInit | cli_inner_pretty.js:428249-428264 | function |
| `lR6` | spawnForkFromDirective | cli_inner_pretty.js:427943-428022 | function |
| `gK4` | deriveForkName | cli_inner_pretty.js:428036-428048 | function |
| `$f5` | rebuildParentSystemPrompt | cli_inner_pretty.js:428023-428034 | function |
| `Tb5` | forkSlashCommand | cli_inner_pretty.js:511636-511642 | function |
| `Vb5` | forkSlashCommandConfig | cli_inner_pretty.js:511650-511660 | object |
| `QK4` | spawnForkExports | cli_inner_pretty.js:427941-427942 | object |
| `dK4` | nodeCryptoForBranch | cli_inner_pretty.js:428258 | variable |
| `iR6` | nodeEventsForBranch | cli_inner_pretty.js:428259 | variable |
| `KD8` | nodeFsForBranch | cli_inner_pretty.js:428260 | variable |
| `_D8` | nodeFsPromisesForBranch | cli_inner_pretty.js:428261 | variable |
| `cK4` | nodeReadlineForBranch | cli_inner_pretty.js:428262 | variable |
| `lK4` | nodeStreamPromisesForBranch | cli_inner_pretty.js:428263 | variable |

---

## Module: Prompt Cache (target = `symbol_index_infra_platform.md`)

### TTL Decision and Application

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ivH` | isCacheTtl1Hour | cli_inner_pretty.js:524779-524794 | function |
| `nv8` | getCached1hAllowlist | (referenced; reads sentinel) | function |
| `iv8` | setCached1hAllowlist | (referenced; writes sentinel) | function |
| `Xi` | makeCacheControl | cli_inner_pretty.js:524776-524778 | function |
| `$I4` | normalizeCacheControlTtl | cli_inner_pretty.js:526567-526570 | function |
| `oh4` | isPromptCachingEnabled | cli_inner_pretty.js:524760-524774 | function |
| `_T6` | getMainLoopCacheTtl | cli_inner_pretty.js:337699 | function |

### Beta Headers and Provider Detection

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `EU` | longContextBeta | cli_inner_pretty.js:96801 | constant |
| `AWH` | extendedCacheTtlBeta | cli_inner_pretty.js:96810 | constant |
| `ZxH` | promptCachingScopeBeta | cli_inner_pretty.js:96809 | constant |
| `Yi8` | contextHintBeta | cli_inner_pretty.js:96816 | constant |
| `_qH` | cacheDiagnosisBeta | cli_inner_pretty.js:96815 | constant |
| `RT` | isFirstPartyEligible | cli_inner_pretty.js:128828-128830 | function |
| `c$6` | isFirstPartyOrEnterpriseDirectProvider | cli_inner_pretty.js:128824-128826 | function |
| `vq` | getProvider | (referenced; returns "firstParty"/"bedrock"/"vertex"/"foundry"/...) | function |
| `qq` | isSubscriberWithBenefits | (referenced) | function |
| `bZ` | subscriberState | (referenced; .isUsingOverage) | variable |
| `pJ` | makeBetaHeaderToken | (referenced; constructs `{ name, header }` pairs) | function |
| `Vu` | getProviderBetaHeaders | (referenced) | function |
| `XP` | mapBetasToHeaderStrings | cli_inner_pretty.js:96764-96766 | function |
| `Di8` | resolveBetaHeader | cli_inner_pretty.js:96761-96763 | function |
| `Tw` | getWindowSource | (referenced) | function |
| `nJ` | computeContextWindow | (referenced) | function |
| `k7` | stripModelSuffix | (referenced) | function |
| `aq8` | getReactiveCompactOptOut | (referenced) | function |
| `Kl$` | getContextWindowForModel | (referenced; returns 1M-override config) | function |

### Cache Breakpoint Application

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `YB5` | applyCacheBreakpoints | cli_inner_pretty.js:526228-526317 | function |
| `fB5` | buildSystemPromptCacheBlocks | cli_inner_pretty.js:526318-526326 | function |
| `rm5` | applyCacheControlToUserMessage | cli_inner_pretty.js:524867-524883 | function |
| `om5` | applyCacheControlToAssistantMessage | cli_inner_pretty.js:524884-524904 | function |
| `xQ6` | extractCacheScopedTextBlocks | (referenced; pre-processes system prompt with scope marks) | function |
| `BQ6` | injectCacheEditsBlock | (referenced) | function |
| `hnK` | logCacheEditsInjection | (referenced) | function |
| `zB5` | isToolResultBlock | (referenced) | function |
| `S0H` | mergeCacheControlBlocks | (referenced) | function |
| `DnK` | shouldSkipCacheControl | (referenced) | function |

### Cache Miss Acknowledgment (v2.1.129)

Target file: `symbol_index_infra_platform.md` (or `symbol_index_core_features.md` for the UI handler)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ky5` | confirmAckCacheMiss | cli_inner_pretty.js:495708-495710 | function |
| `ZZ$` | confirmModelOrEffortSwitch | cli_inner_pretty.js:495631-495707 | function |
| `nX` | totalOutputTokens | cli_inner_pretty.js:2436-2438 | function |
| `meH` | totalInputTokens | cli_inner_pretty.js:2433-2435 | function |
| `BeH` | totalCacheReadInputTokens | cli_inner_pretty.js:2439-2441 | function |
| `peH` | totalCacheCreationInputTokens | cli_inner_pretty.js:2442-2444 | function |
| `MY$` | willEffortChangeAffectCache | (referenced; called from /model dialog handler) | function |
| `dG4` | canonicalizeModelName | (referenced) | function |
| `zy5` | modelPickerDialog | cli_inner_pretty.js:495832-495902 | function |

### Per-Session Cache State

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `cacheMissAckedAtOutputTokens` | (default `-1` at startup) | cli_inner_pretty.js:278784 + 607227 | variable (state field) |
| `cacheBreakerPhrase` | (state field referenced by Bn etc.) | (multiple sites; state field) | variable (state field) |

### Telemetry / OTel PR Counter (v2.1.139 cross-link)

Target file: `symbol_index_infra_platform.md` (telemetry)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `IXH` | getPRCounter | cli_inner_pretty.js:2629-2631 | function |
| `eH4` | mcpPRToolHook | cli_inner_pretty.js:411883-411891 | function |
| `j15` | PR_TOOL_NAME_REGEX | cli_inner_pretty.js:411891 | constant |
| `hK8` | linkSessionToPRRef | (referenced) | function |
| `RK8` | bashGitPostHook | cli_inner_pretty.js:271742-271776 | function |
| `yK8` | extractPRFromOutput | (referenced) | function |
| `$P_` | extractPRNumberOnly | (referenced) | function |
| `gO7` | gitCommitRegex | (referenced) | constant |
| `QO7` | gitPRPatternList | (referenced) | constant |

---

## Module: Compaction Telemetry Events (no specific file; bucketed under platform)

These appear as `d("event_name", { ... })` calls and are referenced across the docs.

| Event | Fired by | Notable fields |
|-------|----------|----------------|
| `tengu_reactive_compact_triggered` | `Y97` | `effort_level`, `querySource`, `precomputed` |
| `tengu_reactive_compact_attempt` | `uq8` | `attempt`, `groupsToSummarize`, `groupsToPreserve`, `messagesToSummarize`, `strippedMedia`, `stepMode` ("seeded"/"gap_guided"/"gap_unparseable"), `stepSize`, `tokenGap` |
| `tengu_reactive_compact_succeeded` | `f97` | `attempts`, `groupsPreserved`, `totalGroups`, `preCompactTokens`, `postCompactTokens`, `restoredAttachmentCount`, `cacheHitRate`, `precomputed*` fields |
| `tengu_reactive_compact_failed` | `Ej6` | `reason` ("error"/"exhausted"/"media_unstrippable"/"aborted"), `attempts`, `totalGroups`, `durationMs` |
| `tengu_partial_compact` | `_H4` | `direction`, `messagesKept`, `messagesSummarized`, `trigger` ("message_selector") |
| `tengu_partial_compact_failed` | `_H4` | `reason`, `direction`, `messagesSummarized` |
| `tengu_compact_ptl_retry` | `_H4` and full compact | `attempt`, `droppedMessages`, `remainingMessages`, `path` ("partial"/"full") |
| `tengu_compact_failed` | full compact pipeline | `reason`, `preCompactTokenCount`, `promptCacheSharingEnabled`, `ptlAttempts` |
| `tengu_compact_cache_sharing_success` | full compact (cache prefix path) | `preCompactTokenCount`, `outputTokens`, `cacheReadInputTokens`, `cacheCreationInputTokens`, `cacheHitRate` |
| `tengu_compact_cache_sharing_fallback` | full compact (cache prefix path) | `reason` ("no_text_response"/"error"), `preCompactTokenCount` |
| `tengu_auto_compact_rapid_refill_breaker` | autocompact dispatcher | `consecutiveRapidRefills`, `turnsSincePreviousCompact`, `queryChainId`, `queryDepth`, `reactive` |
| `tengu_conversation_forked` | `/branch` (`rK4`) | `message_count`, `has_custom_title` |
| `tengu_agent_summary_skipped` | `CM$` | `reason` ("unchanged") |
| `tengu_fork_agent_query` | `JV` finalizer | `forkLabel`, `querySource`, `durationMs`, `messageCount`, full usage breakdown |
| `tengu_api_cache_breakpoints` | `YB5` | `markerCount`, `forkPointPinned`, `skipCacheWrite` |
| `tengu_prompt_cache_diagnosis_received` | server-feedback path | `tokensMissed`, `reason` |
| `tengu_precomputed_compact_started` | precompute path (1M context) | `querySource`, `model` |

---

## Cross-Cutting Glue

Used by multiple modules above.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `JV` | runForkedQuery | cli_inner_pretty.js:242702-242802 | function |
| `D3_` | forkedAgentTelemetry | cli_inner_pretty.js:242803-242821 | function |
| `gC` | streamMainQuery | (referenced; top-level streaming wrapper) | function |
| `D$` | buildRequestParams | (referenced; closes over `s` betas array; called inside `uEH`/`Sg`) | function |
| `Sg` | sideQueryRequestBuild | cli_inner_pretty.js:526468-526566 | function |
| `uEH` | streamingApiCall | cli_inner_pretty.js:524905-524916 | function |
| `NiH` | streamingApiCallGenerator | cli_inner_pretty.js:524917-524921 | function |
| `MB5` | clampMaxTokens | cli_inner_pretty.js:526376-526382 | function |
| `e7H` | getMaxOutputTokensForModel | cli_inner_pretty.js:526383-526387 | function |
| `Z$` | readExperiment | (referenced; experiment lookup helper) | function |
| `bH` | parseBool | (referenced; env var parser) | function |
| `c$6` | isFirstPartyOrEnterpriseDirectProvider | cli_inner_pretty.js:128824-128826 | function |
| `pJ` | makeBetaHeaderToken | (referenced; declares betas at module init) | function |

---

## Notes for Symbol Index Integration

1. **Module assignment:**
   - All `tengu_reactive_*` and `tengu_partial_compact_*` symbols → `symbol_index_core_features.md` under Compact section
   - All `ivH`/`Xi`/`$I4`/`YB5`/`fB5`/`AWH`/`EU` → `symbol_index_infra_platform.md` under Prompt Cache / API client section
   - `Hc6`/`ed6`/`lF5` → `symbol_index_infra_integration.md` under UI Components (MessageSelector lives in UI)
   - `branchCommandWriter`/`branchAndResume`/`/branch` slash command symbols → `symbol_index_infra_integration.md` under Slash Commands
   - `IXH`/`eH4`/`j15` (PR counter telemetry) → `symbol_index_infra_platform.md` under Telemetry

2. **Cross-module symbols:** `Bn` (postCompactCleanup) is owned by Compact but writes to the cache-miss-acked state field. Document once in `symbol_index_core_features.md` with a note about the cross-module behavior.

3. **Some symbols were already mapped in earlier units.** Check the existing v2.1.142 symbol indexes (e.g., `agent-a57dde6d5aa976063/claude_code_v_2.1.142/analyze/00_overview/symbol_index_*.md`) before adding to avoid duplicates. Most likely already present:
   - `JV` (forked query)
   - `gC` (stream query)
   - `RT` (first-party check)
   - `Bn` (post-compact cleanup) — may already be in a previous unit
   - `nX`/`meH`/`BeH`/`peH` (token counters)
   - `EU` (long_context beta) — may be in core_execution

4. **Verification:** every symbol listed has been confirmed by `grep` against `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` during the analysis.

---

**Status**: Core-execution-scoped rows (Subagent resume persistence, runForkedQuery, streaming API call, token-count accessors) consolidated into symbol_index_core_execution.md as of v2.1.142 deobfuscation work. Compact / prompt-cache / slash-command rows remain pending consolidation into their respective indexes.
