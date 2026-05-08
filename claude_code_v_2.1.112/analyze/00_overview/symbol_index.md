# Symbol Index — v2.1.88 → v2.1.112 Diff

This index maps obfuscated names to readable concepts for symbols introduced/changed between v2.1.88 (`claude-code-kim/src`) and v2.1.112 (`source/chunks.*.mjs`).

This is a **scoped** index covering only symbols cited in the per-version analyses. For the full v2.1.112 codebase symbol map, refer to a future complete index.

---

## Module: Hooks (Permission Decisions)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (no fn) | `applyHookPermissionDecision` | chunks.193.mjs:34-130 | function |
| `q.hookSpecificOutput` | `hookOutput.hookSpecificOutput` | — | param |
| `H` | `result` (mutable hook result builder) | chunks.193.mjs | param |
| `K` | `command` (the originating command string) | chunks.193.mjs | param |

### New decision tokens added v2.1.89

| Token | Behavior | Added |
|-------|----------|-------|
| `allow` | proceed with tool | pre-existing |
| `deny` | block with `blockingError` | pre-existing |
| `ask` | prompt user | pre-existing |
| `defer` | pause; re-evaluate on next `--resume` | **v2.1.89** |

---

## Module: Hooks (Other Events)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `oc` | `runPreCompactHook` | chunks.101.mjs:1562 | function |
| `Dr1` | `performCompaction` | chunks.101.mjs:1574 | function |
| `H.blockedBy` | `preCompactResult.blockedBy` | chunks.101.mjs:1568 | property |

### New PreCompact blocking added v2.1.105

PreCompact can now block compaction via:
- Exit code 2
- `{"decision":"block"}` in JSON output

---

## Module: Effort / Model

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `UI` | `EFFORT_LEVELS` (`["low","medium","high","xhigh","max"]`) | chunks.80.mjs:2835 | constant |
| `bt6` | `modelSupportsXhigh` | chunks.80.mjs:2708-2712 | function |
| `Ct6` | `modelSupportsMaxEffort` | chunks.80.mjs:2701-2706 | function |
| `wy6` | `resolveAppliedEffort` | chunks.80.mjs:2746 | function |
| `IF1` | `getDefaultEffortForModel` | chunks.80.mjs:2811-2819 | function |
| `Nh8` | `isValidEffortLevel` | chunks.80.mjs:2714-2716 | function |
| `id` | `parseEffortValue` | chunks.80.mjs:2718-2726 | function |
| `It6` | `parseSettingsEffortLevel` | chunks.80.mjs:2728-2731 | function |
| `Zj6` | `readEnvEffortLevel` | chunks.80.mjs:2741-2744 | function |
| `CF1` | `unpinAndApplyEffort` | chunks.80.mjs:2674 | function |
| `$y6` | `resolveAppliedEffortOrHigh` | chunks.80.mjs:2683 | function |
| `jy6` | `formatEffortDescription` | chunks.80.mjs:2688 | function |
| `xt6` | `coerceEffortLevel` | chunks.80.mjs:2699-2704 | function |
| `i8z` | `getEffortLevelDescription` | chunks.80.mjs:2789-2799 | function |
| `bF1` | `getEffortLevelDescriptionForUI` | chunks.80.mjs:2802-2809 | function |
| `n8z` | `readSettingsEffortLevel` | chunks.80.mjs:2733-2735 | function |
| `o5` | `resolveModelId` | utility | function |
| `$a` | `get3PModelCapabilityOverride` | utility | function |
| `c8z` | `MAX_EFFORT_BLOCKLIST` (Sonnet 3.x, Opus 3.x) | chunks.80.mjs:2836 | constant |
| `KhY` | `applyEffortChange` (slider state updater) | chunks.168.mjs:742 | function |
| `H8` | `getAppConfig` | utility | function |
| `d8` | `updateAppConfig` | utility | function |
| `Ps` | `isTurtleCarbonGate` (= `u8("tengu_turtle_carbon", true)`) | chunks.80.mjs:2541 | function |

### Subscriber-tier helpers (chunks.61.mjs)

| Obfuscated | Readable | Definition |
|------------|----------|------------|
| `MK` | `getCurrentTier` | returns `"pro"` / `"max"` / etc. or null |
| `JB` | `isProPlan` | `MK() === "pro"` |
| `ch` | `isMaxPlan` | `MK() === "max"` |

---

## Module: TUI Renderer

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `lq` | `isFullscreenMode` | chunks.65.mjs:1491-1505 | function |
| `c5` | `parseExplicitFalse` | utility | function |
| `S6` | `parseExplicitTrue` | utility | function |
| `Xa6` | `isTmuxIntegrationMode` | chunks.65.mjs | function |
| `v7` | `getUserSettings` | utility | function |
| `u8` | `getFeatureFlag` | utility | function |
| `bcY` | `tuiCommandHandler` | chunks.185.mjs:397-431 | function |
| `n$7` | `validTuiModes` (`["default","fullscreen"]`) | chunks.185.mjs:438 | constant |
| `IcY` | `tuiCommandDef` | chunks.185.mjs:445-454 | object |
| `er8` | `relaunchSession` | utility | function |
| `P7` | `saveSettings` | utility | function |
| `d` | `logEvent` | utility | function |
| `FoY` | `focusCommandDef` | chunks.189.mjs:1450-1475 | object |

---

## Module: Compact

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `QkK` | `autocompactDispatcher` (dual circuit-breakers) | chunks.159.mjs:1379-1428 | function |
| `gDY` | `shouldCompact` (precondition check, `Y = 0` snipTokensFreed parameter) | chunks.159.mjs:1365-1377 | function |
| `vI6` | `compactConversation` (full LLM compact) | chunks.159.mjs:574-747 | function |
| `zLK` | `partialCompactConversation` (`up_to`/`from` cursor variant) | chunks.159.mjs:749-907 | function |
| `ALK` | `streamCompactSummary` (cache-prefix + main-call) | chunks.159.mjs:948-1100 | function |
| `KLK` | `truncateHeadForPTLRetry` (drops ~20% on PTL retry) | chunks.159.mjs:512-531 | function |
| `Yt` | `buildPostCompactMessages` (boundary + summary + attachments) | chunks.159.mjs:546-548 | function |
| `Zr1` | `annotateBoundaryWithPreservedSegment` | chunks.159.mjs:550-564 | function |
| `r_7` | `mergeHookInstructions` | chunks.159.mjs:566-572 | function |
| `Jn` | `resolveWindowSource` (env > settings > experiment > model) | chunks.159.mjs:1266-1298 | function |
| `Yn` | `getEffectiveContextWindow` | chunks.159.mjs:1307-1314 | function |
| `v38` | `getAutoCompactThreshold` | chunks.159.mjs:1320-1332 | function |
| `UM6` | `computeContextThresholds` (returns isAboveAutoCompactThreshold/etc.) | chunks.159.mjs:1334-1357 | function |
| `z0` | `isAutoCompactEnabled` | chunks.159.mjs:1359-1363 | function |
| `Z38` | `isWindowFromEnvOrSettings` | chunks.159.mjs:1300-1305 | function |
| `s_7` | `parseExperimentValue` (parses tengu_amber_redwood) | chunks.159.mjs:1252-1264 | function |
| `UDY` | `notifyExperimentSourceIfApplicable` | chunks.159.mjs:1430-1441 | function |
| `FDY` | `isCacheCold` (1.5h since last activity) | chunks.159.mjs:1316-1318 | function |
| `ec8` | `preCompactBlockedThrow` | chunks.159.mjs:533-544 | function |
| `oc` | `runPreCompactHook` | chunks.101.mjs:1562 | function |
| `K36` | `runPostCompactHook` | (chunks.155.mjs vicinity) | function |
| `_c` | `microcompactStub` (no-op in 2.1.112) | chunks.85.mjs:1207-1211 | function |
| `qD4` | `keepRecentMicrocompact` (KEEP-RECENT MC, only via context_hint) | chunks.85.mjs:1235-1274 | function |
| `t4z` | `collectCompactableToolIds` | chunks.85.mjs:1198-1205 | function |
| `s4z` | `calculateToolResultTokens` | chunks.85.mjs:1188-1196 | function |
| `a04` | `clearCompactWarningSuppression` | chunks.85.mjs:1147-1149 | function |
| `SR` | `resetMicrocompactState` | chunks.85.mjs:1182-1186 | function |
| `tR8` | `applyClearedToolResults` | chunks.85.mjs:1213-1233 | function |
| `o4z` | `COMPACTABLE_TOOLS_SET` (Bash+shell+Read+Grep+Glob+WebFetch+Edit+Write) | chunks.85.mjs:1297 | constant |
| `sR8` | `TIME_BASED_MC_CLEARED_MESSAGE` (= `"[Old tool result content cleared]"`) | chunks.85.mjs:1276 | constant |
| `r4z` | `IMAGE_MAX_TOKEN_SIZE` (= 2000) | chunks.85.mjs:1278 | constant |
| `fx8` | `compactPromptBuilder` (full conversation summary prompt) | chunks.101.mjs:679-788 | function |
| `Q0z` | `partialCompactPromptBody` (`up_to` flavor) | chunks.101.mjs (same chunk) | constant |
| `d0z` | `stripAnalysisAndUnwrapSummary` | chunks.101.mjs:790-802 | function |
| `SI4` | `compactPromptSuffix` (custom-instructions tail) | chunks.101.mjs | constant |
| `cI` | `PTL_DETECTION_PREFIX` (`"API Error: prompt too long"`) | chunks.159.mjs | constant |
| `Po6` | `compactMaxOutputTokens` (cap on summary tokens) | chunks.159.mjs:970 | constant |
| `wLK` | `CONSECUTIVE_FAILURE_LIMIT` (= 3) | chunks.159.mjs:1457 | constant |
| `a_7` | `RAPID_REFILL_TURN_WINDOW` (= 3) | chunks.159.mjs:1459 | constant |
| `jLK` | `RAPID_REFILL_LIMIT` (= 3) | chunks.159.mjs:1461 | constant |
| `qLK` | `PTL_RETRY_LIMIT` (= 3) | chunks.159.mjs:1192 | constant |
| `kx8` | `POST_COMPACT_MAX_FILES_TO_RESTORE` (= 5) | chunks.159.mjs:1178 | constant |
| `yDY` | `POST_COMPACT_TOKEN_BUDGET` (= 50000) | chunks.159.mjs:1180 | constant |
| `LDY` | `POST_COMPACT_MAX_TOKENS_PER_FILE` (= 5000) | chunks.159.mjs:1182 | constant |
| `hDY` | `POST_COMPACT_MAX_TOKENS_PER_SKILL` (= 5000) | chunks.159.mjs:1184 | constant |
| `RDY` | `POST_COMPACT_SKILLS_TOKEN_BUDGET` (= 25000) | chunks.159.mjs:1186 | constant |
| `oyK` | `BOUNDARY_RECENT_MAX` (= 100) | chunks.159.mjs:1188 | constant |
| `uDY` | `MAX_OUTPUT_RESERVATION` (= 20000) | chunks.159.mjs:1443 | constant |
| `t_7` | `AUTOCOMPACT_BUFFER` (= 13000) | chunks.159.mjs:1449 | constant |
| `e_7` | `BLOCKING_BUFFER` (= 3000) | chunks.159.mjs:1455 | constant |
| `mDY` | `WARNING_OFFSET` (= 20000) | chunks.159.mjs:1451 | constant |
| `BDY` | `ERROR_OFFSET` (= 20000) | chunks.159.mjs:1453 | constant |
| `o_7` | `MIN_AUTOCOMPACT` (= 100000) | chunks.159.mjs:1445 | constant |
| `$LK` | `MAX_AUTOCOMPACT` (= 1000000) | chunks.159.mjs:1447 | constant |
| `pDY` | `COLD_CACHE_THRESHOLD_MS` (= 5400000 — 1.5 h) | chunks.159.mjs:1465 | constant |
| `Q6A` | `DEFAULT_KEEP_RECENT` (= 5) | chunks.194.mjs:964 | constant |
| `QI6` | `NO_MSGS_TO_COMPACT_MSG` (= `"Not enough messages to compact."`) | chunks.159.mjs:1190 | constant |
| `_LK` | `PTL_FAILURE_MSG` (= `"Conversation too long. Press esc twice..."`) | chunks.159.mjs:1196 | constant |
| `at` | `USER_ABORT_MSG` (= `"API Error: Request was aborted."`) | chunks.159.mjs:1198 | constant |
| `GI6` | `PRECOMPACT_BLOCKED_PREFIX` (= `"Compaction blocked by PreCompact hook"`) | chunks.159.mjs:1200 | constant |
| `ql8` | `COMPACTION_INTERRUPTED_MSG` (= `"Compaction interrupted · ..."`) | chunks.159.mjs:1202 | constant |
| `ayK` | `PTL_RETRY_MARKER` (= `"[earlier conversation truncated for compaction retry]"`) | chunks.159.mjs:1194 | constant |
| `okK` | `RAPID_REFILL_MSG` (autocompact thrash explanation) | chunks.159.mjs:1463-1484 | constant |
| `j6` | `logError` | utility | function |
| `b6` | `formatErrorDetail` | utility | function |
| `p86` | `isAbortError` | utility | function |
| `vJ` | `estimateMessageTokens` | utility (chunks.85 vicinity) | function |
| `qT` | `tokenizeMessageList` (post-compact accurate count) | utility | function |
| `sI` | `tokenCountForResponse` (post-compact planned tokens) | utility | function |
| `lc` | `getMaxOutputTokens` (model-default cap) | chunks.194.mjs:2491-2494 | function |
| `XtY` | `recordContextCollapseCommit` (write-only persistence shim, no callers) | chunks.191.mjs:1102-1110 | function |
| `MtY` | `recordContextCollapseSnapshot` (write-only persistence shim, no callers) | chunks.191.mjs:1112-1120 | function |

**State preservation collectors (post-compact restoration):**

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Nx8` | `restoreFilesPostCompact` (last 5 files, 50k aggregate cap) | chunks.159.mjs:1057-1079 | function |
| `hx8` | `loadTaskStatusAttachments` (local-agent task statuses) | chunks.159.mjs:1125-1139 | function |
| `Ex8` | `collectPlanAttachment` (plan file content reference) | chunks.159.mjs:1081-1090 | function |
| `Lx8` | `collectAsyncAgentAttachment` (plan-mode reminder when active) | chunks.159.mjs:1112-1123 | function |
| `yx8` | `collectInvokedSkillsAttachment` (skills sorted by recency) | chunks.159.mjs:1092-1110 | function |
| `IDY` | `truncateContent` (per-skill truncation helper) | chunks.159.mjs (referenced) | function |
| `bDY` | `extractPathsFromKeptMessages` (used by Nx8 for partial compact dedup) | chunks.159.mjs (referenced) | function |
| `xDY` | `isInternalFile` (filters internal/temp paths in Nx8) | chunks.159.mjs (referenced) | function |
| `p97` | `readFileWithLimits` (post-compact file reader with cap) | chunks.159.mjs (referenced) | function |
| `g81` | `getInvokedSkillsMap` | chunks.159.mjs (referenced) | function |
| `lP` | `readPlanFileContent` | chunks.159.mjs (referenced) | function |
| `eW` | `getPlanFilePath` | chunks.159.mjs (referenced) | function |
| `$A` | `getTaskOutputPath` (used in hx8) | chunks.159.mjs (referenced) | function |
| `MR6` | `buildDeferredToolsReminder` (deferred_tools_delta) | chunks.155.mjs:1738-1748 | function |
| `PR6` | `buildAgentListingReminder` (agent_listing_delta) | chunks.155.mjs:1750-1785 | function |
| `WR6` | `buildMcpInstructionsReminder` (mcp_instructions_delta) | chunks.155.mjs:1787-1803 | function |
| `Y4` | `wrapAttachment` (envelope: type:"attachment" + uuid + timestamp) | chunks.155.mjs:2497-2504 | function |
| `pe6` | `preserveReadFileState` (Map → Object snapshot) | chunks.86.mjs:1531-1533 | function |
| `sj6` | `resetMemorySelector` | chunks.86.mjs:2631-2634 | function |

**Boundary marker, summary, telemetry helpers:**

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `p18` | `createCompactBoundaryMessage` (system + subtype:"compact_boundary" + compactMetadata) | chunks.166.mjs:118-137 | function |
| `b18` | `compactSummaryContent` (composes the post-compact user message) | chunks.101.mjs:804-820 | function |
| `rc` | `collectPreCompactDiscoveredTools` (carries discovered tools across compacts) | chunks.159.mjs:2310-2333 | function |
| `aK6` | `emitOpenTelemetryCompactEvent` (always-fire `compaction` event in `finally`) | chunks.87.mjs:1531-1546 | function |
| `aI` | `extractApiUsage` (input/output/cache token counts) | utility | function |
| `GD6` | `setPendingPostCompactionFlag` | chunks.1.mjs:2549-2551 | function |
| `DR6` | `reAppendSessionMetadata` | chunks.191.mjs:1715-1717 | function |
| `Ne6` | `clearReplCacheReadTokens` (REPL state clear post-compact) | chunks.85.mjs:1055-1059 | function |
| `nj6` | `notifyCacheDeletion` (UI flag for "cache will be invalidated") | chunks.85.mjs:1143-1145 | function |
| `i04` | `notifyCacheDeletionForAntUser` (per-cache-hash registry tracking) | chunks.85.mjs:1049-1053 | function |
| `bs` | `clearLastCompactWarningSuppression` | chunks.159.mjs (referenced) | function |
| `_F` | `onCompactSucceeded` (records success in app state) | chunks.159.mjs (referenced) | function |

**LLM call infrastructure for compact:**

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Or1` | `permissionStubForCompactAgent` (rejects all tool use during compaction) | chunks.159.mjs:937-946 | function |
| `Kz` | `summaryStubTool` (the only tool exposed during compact) | chunks.159.mjs (referenced) | constant |
| `eb6` | `apiCall` (the underlying streaming API call) | chunks.159.mjs (referenced) | function |
| `rP` | `cachePrefixCall` (the inner `skipCacheWrite:true` fork call) | chunks.159.mjs (referenced) | function |
| `MJ6` | `extractSummaryText` (filters text content from assistant message) | chunks.165.mjs:2034-2039 | function |
| `_R6` | `switchPermissionContext` (no-op in v2.1.112) | chunks.100.mjs:2172-2174 | function |
| `t8` | `makeUserMessage` (wraps content in user-message envelope) | chunks.159.mjs (referenced) | function |
| `H2` | `filterRelevantMessages` (drops progress, etc.) | chunks.159.mjs (referenced) | function |
| `SDY` | `stripImagesAndDocs` (cold-compact stripping) | chunks.159.mjs (referenced) | function |
| `CDY` | `truncateContents` (cold-compact tool input/result truncation) | chunks.159.mjs (referenced) | function |
| `Gx8` | `ensureMessageAlternation` | chunks.159.mjs (referenced) | function |
| `Ar1` | `stripUnusedTools` | chunks.159.mjs (referenced) | function |
| `K0` | `prepareMessages` | chunks.159.mjs (referenced) | function |
| `sK` | `buildSystemPrompt` | chunks.159.mjs (referenced) | function |
| `Rh8` | `extractApiTokenDelta` (used by KLK to compute drop-count from API error) | chunks.159.mjs (referenced) | function |
| `AR6` | `groupIntoTurnPairs` (used by KLK) | chunks.159.mjs (referenced) | function |
| `fM` | `findLastAssistantMessage` (used by ALK after cache-prefix call) | chunks.159.mjs (referenced) | function |
| `fp` | `isApiErrorString` (detect API errors in summary text) | chunks.159.mjs (referenced) | function |
| `S6` | `parseExplicitTrue` (env var boolean parser) | chunks.1.mjs (referenced) | function |
| `bx` | `isAntUser` (= `tengu_cobalt_raccoon` experiment) | chunks.101.mjs:1530-1533 | function |
| `iI` | `isReplBeingUsed` | chunks.159.mjs (referenced) | function |
| `JJ` | `isReplBeingUsed` (alt) / context check | chunks.159.mjs (referenced) | function |
| `bY` | `currentTranscriptPath` | chunks.159.mjs (referenced) | function |
| `Oa6` | `getReplContexts` | chunks.159.mjs (referenced) | function |
| `qx8` / `Kx8` | `collectCompactStats` (per-message stats collector for telemetry) | chunks.159.mjs (referenced) | function |
| `YLK` | `showCompactErrorToUser` (manual compact error display) | chunks.159.mjs (referenced) | function |

**Slash command `/compact`:**

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aIK` | `compactCommandRegistration` | chunks.167.mjs:2343-2354 | function |
| `MLY` | `compactCommandDescriptor` (slash-command descriptor object) | chunks.167.mjs:2343 | constant |
| `Un8` | (alias of MLY) | chunks.167.mjs | constant |
| `JLY` | `compactCommandHandler` (parses arg, calls vI6 or XLY) | chunks.167.mjs:2287-2316 | function |
| `XLY` | `reactiveCompactPath` (Ant-only experimental compact path) | chunks.167.mjs (referenced) | function |
| `iIK` | `loadCacheSafeParams` (builds cacheSafeParams for vI6) | chunks.167.mjs (referenced) | function |
| `nIK` | `formatCompactDisplayText` (formats userDisplayMessage for UI) | chunks.167.mjs (referenced) | function |
| `oIK` | `loadCompactCommandModule` | chunks.167.mjs (referenced) | function |
| `rIK` | `compactCommandModule` (the lazy-loaded handler module export) | chunks.167.mjs (referenced) | constant |

**Microcompact via context_hint reject path (chunks.194.mjs):**

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `d85` | `contextHintReject` (clears thinking + qD4) | chunks.194.mjs:856-887 | function |
| `NJ7` | `contextHintApplyAndRetry` | chunks.194.mjs:889-904 | function |
| `d6A` | `buildContextHintMiddleware` (beta header, error classifier, fallback) | chunks.194.mjs:906-1000 | function |
| `C85` | `getAPIContextManagement` (only `clear_thinking_20251015` in 2.1.112) | chunks.194.mjs:741-752 | function |
| `g85` | `emitContextHintRejectTelemetry` | chunks.194.mjs:820-830 | function |
| `Va8` | `emitContextHintBusyFallbackTelemetry` | chunks.194.mjs:832-836 | function |
| `kJ7` | `emitThinkingClearLatchedTelemetry` | chunks.194.mjs:838-844 | function |
| `x85` | `isContextHintEnabled` (= `tengu_hazel_osprey`) | chunks.194.mjs:790-792 | function |
| `Op6` / `wp6` | `getThinkingClearLatch` / `setThinkingClearLatch` | (per-session latch) | function |
| `u85` | `is422or424Error` (context-hint reject signal) | chunks.194.mjs:794-796 | function |
| `m85` | `isInvalidRequestStreamError` | chunks.194.mjs:798-802 | function |
| `B85` | `is409Error` | chunks.194.mjs:804-806 | function |
| `p85` | `isUnknownBetaError` (400 + "Unexpected value" + "anthropic-beta") | chunks.194.mjs:808-813 | function |
| `F85` | `getRequestId` | chunks.194.mjs:815-818 | function |
| `I85` | `CONTEXT_HINT_BETA_HEADER` (= `"context-hint-2026-04-09"`) | chunks.194.mjs:846 | constant |
| `R85` | `DEFAULT_API_MAX_INPUT_TOKENS` (= 180000) | chunks.194.mjs:754 | constant |
| `S85` | `DEFAULT_API_TARGET_INPUT_TOKENS` (= 40000) | chunks.194.mjs:756 | constant |
| `Q85` | `EMPTY_CLEARED_IDS_SET` | chunks.194.mjs (vicinity 854) | constant |

---

## Module: Prompt Cache

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `o85` | `is1HourCacheEligible` | chunks.194.mjs:1034-1043 | function |
| `pq` | `getProvider` | utility | function |
| `i7` | `isSubscriber` | utility | function |
| `Zk` | `rateLimitState` | utility | object |
| `i81` | `getCachedAllowlist` | utility | function |
| `r81` | `cacheAllowlist` | utility | function |

---

## Module: MCP

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (anonymous) | `adaptMcpToolWithMetaOverride` | chunks.162.mjs:578-617 | function |
| `Vg1` | `MCP_MAX_RESULT_HARD_CEILING` (= 500000) | chunks.83.mjs | constant |
| `tC` | `formatToolName` | utility | function |
| `Zz7` | `defaultMcpToolBase` | chunks.162.mjs | object |
| `M98` | `MCP_DESCRIPTION_MAX_CHARS` (= 1536) | constant | constant |
| `iI6` | `extractMcpToolList` | utility | function |
| `bg6` | (MCP tool fetch helper) | utility | function |
| `cvY` | `mcpToAutoClassifierInput` | chunks.162.mjs | function |

---

## Module: Push Notification + Monitor Tools

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ic` | `PUSH_NOTIFICATION_TOOL_NAME` (= "PushNotification") | chunks.101.mjs:1261 | constant |
| `cI4` | `pushNotificationDescription` | chunks.101.mjs:1263 | constant |
| `lI4` | `pushNotificationPrompt` | chunks.101.mjs:1265-1271 | constant |
| `e56` | `isPushNotificationEnabled` | chunks.101.mjs:1257-1259 | function |
| `wr1` | `getPushNotificationGuidance` | chunks.101.mjs:1278-1282 | function |
| `KF` | `isAmberSentinelGated` | chunks.101.mjs:1284-1286 | function |
| `_0` | `MONITOR_TOOL_NAME` (= "Monitor") | chunks.101.mjs:1288 | constant |
| `$r1` | `monitorToolDescription` | chunks.101.mjs:1290-1334 | constant |
| `q36` | `initMonitorTool` | chunks.101.mjs:1273-1276 | function |
| `I18` | `isAmberSentinelEnabled` (gate for push notifs) | utility | function |
| `H8` | `getAppConfig` | utility | function |

---

## Module: Slack MCP Renderer (v2.1.94)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `FhK` | `makeSlackedToolRenderer` | chunks.161.mjs:777-797 | function |
| `iGY` | `parseSlackChannel` | chunks.161.mjs:760-772 | function |
| `lGY` | `SLACK_CHANNEL_NAME_RE` (validate channel name shape) | chunks.161.mjs | regex |
| `Vf` | `terminalSupportsHyperlinks` | utility | function |
| `qc` | `renderHyperlink` | utility | function |
| `u` | `Box` (Ink layout component) | utility | component |
| `v5` | `Text` (Ink text component) | utility | component |
| `I6` | `stringify` (JSON.stringify wrapper) | utility | function |
| `$98` | (React import alias) | utility | namespace |

---

## Module: CA Cert Store (v2.1.101)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Mr5` | `resolveCaStores` | chunks.19.mjs:2150-2167 | function |
| `NU7` | `DEFAULT_STORES` (= `["bundled","system"]`) | chunks.19.mjs:2182 | constant |
| `EU7` | `clearCaCacheStore` | chunks.19.mjs:2169-2171 | function |
| `xD6` | `hasCliFlag` | utility | function |
| `E` | `log` | utility | function |
| `Im` | `caCacheModule` | chunks.19.mjs | object |

---

## Module: Perforce (v2.1.98)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `mY1` | `isPerforceMode` | chunks.16.mjs:3070-3073 | function |
| `gf6` | `isPerforceProtected` | chunks.16.mjs:3075-3077 | function |
| `Ff6` | `PERFORCE_READ_ONLY_ERROR` | chunks.16.mjs:3320 | constant |
| `S16` | `writeFileWithEol` | chunks.16.mjs:3079-3089 | function |

---

## Module: Slash Commands (added v2.1.88 → v2.1.112)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `qQK` | `registeredPowerupCommand` | chunks.180.mjs:1396-1403 | object |
| `KQK` | `powerupCommandDef` (lazy init) | chunks.180.mjs | function |
| `eUK` | `initPowerupLessons` | chunks.180.mjs | function |
| `tUK` | `powerupLessonComponent` | chunks.180.mjs | component |
| `Xg` | `powerupLessonsArray` | chunks.180.mjs:961 | array |
| `LaY` | `recapCommandDef` | chunks.189.mjs:2782-2792 | object |
| `haY` | `recapCommandExport` | chunks.189.mjs:2791 | object |
| `yaY` | `recapCommandHandler` | chunks.189.mjs | function |
| `jsY` | `teamOnboardingCommandDef` | chunks.190.mjs:195-210 | object |
| `ulK` | `ultrareviewCommandDef` | chunks.183.mjs:2170 | object |
| `wW6` | `isUltrareviewEnabled` | chunks.183.mjs | function |
| `bcY` | `tuiCommandHandler` | chunks.185.mjs:397-431 | function |
| `IcY` | `tuiCommandDef` | chunks.185.mjs:445-454 | object |
| `FoY` | `focusCommandDef` | chunks.189.mjs:1450-1475 | object |

---

## Module: Settings Schema

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aNz` | `MANAGED_SETTINGS_ENV_ALLOWLIST` | chunks.116.mjs:297 | constant |
| `BR6` | `MANAGED_ENV_VAR_LIST` | chunks.116.mjs:298 | constant |
| `g7Y` | `REMOTE_TASK_ENV_PASSTHROUGH` | chunks.137.mjs:2388 | constant |

### New schema fields added in this window

| Field | Version | Type |
|-------|---------|------|
| `forceRemoteSettingsRefresh` | v2.1.92 | boolean |
| `disableSkillShellExecution` | v2.1.91 | boolean |
| `tui` | v2.1.110 | enum: `default|fullscreen` |
| `autoScrollEnabled` | v2.1.110 | boolean |
| `effortLevel: xhigh` | v2.1.111 | enum extension |
| `viewMode` | v2.1.97 | enum: `default|verbose|focus` |
| `showThinkingSummaries` | v2.1.89 | boolean |
| `feedbackSurveyRate` | v2.1.92 | number |
| `spinnerTipsEnabled` | v2.1.97 | boolean |

---

## Module: Plugin Manifest Schema

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (in schema) | `monitors` field | chunks.18.mjs:2251 | property |
| `gA6` | `pathSchema` | utility | function |
| `wi5` | `MonitorEntrySchema` (name/command/description/when) | chunks.18.mjs | function |
| `XO1` | `MonitorArraySchema` (with name uniqueness refinement) | chunks.18.mjs | function |
| `$i5` | `PluginManifestMonitorsKey` (the `monitors` field shape) | chunks.18.mjs | function |
| `ji5` | `PluginManifestLspServersKey` | chunks.18.mjs | function |
| `Ng7` | `npmPackageNameSchema` (path-traversal-safe) | chunks.18.mjs | function |
| `IQ6` | `PluginManifestSchema` (top-level plugin manifest) | chunks.18.mjs | function |
| `xQ6` | `MarketplaceSourceSchema` (URL/git discriminated union) | chunks.18.mjs | function |
| `_G6` | `lspServerConfigSchema` | chunks.18.mjs | function |

## Module: EnterWorktree (v2.1.105)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `WvK` | `getEnterWorktreeEffectivePath` (= `path ?? name ?? ""`) | chunks.151.mjs:390045 | function |
| `DvK` | `renderEnterWorktreeResult` | chunks.151.mjs:390052 | function |
| `bjY` | `EnterWorktreeOutputSchema` | chunks.151.mjs | function |
| `ZvK` | `enterWorktreeRegistration` (lazy init) | chunks.151.mjs | function |
| `a58` | `createWorktree` | utility | function |
| `g56` | `generateWorktreeName` | utility | function |

---

## Module: Effort Slider (v2.1.111)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `H6`/`q6` | `onEffortChange` (slider callback) | chunks.168.mjs:740-744 | function |
| `KhY` | `applyEffortChange` | chunks.168.mjs | function |
| `eA7` | `getDefaultEffortForCurrentModel` | chunks.168.mjs | function |

---

## Module: Agent Teams (Multi-agent collaboration)

### Feature Gate

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `z4` | `isAgentTeamsEnabled` | chunks.63.mjs:2617 | function |
| `cN_` | `agentTeamsCliFlag` | chunks.63.mjs:2613 | function |
| `eQ` | `runWithTeammateContext` | chunks.63.mjs:2632 | function |
| `uB` | `getCurrentTeammateContext` | chunks.63.mjs:2628 | function |
| `nN_` | `isSubagent` | chunks.63.mjs:2636 | function |
| `r74` | `getSubagentName` | chunks.63.mjs:2640 | function |

### Spawning (chunks.137.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `n7Y` | `spawnTeammateDispatcher` | chunks.137.mjs:2929 | function |
| `P2K` | `spawnTeammateLegacyAlias` | chunks.137.mjs:2941 | function |
| `c7Y` | `spawnSplitPaneTeammate` | chunks.137.mjs:2534 | function |
| `l7Y` | `spawnTmuxTeammate` (**unreachable** — only path through `n7Y` requires `use_splitpane: false`, which no caller passes) | chunks.137.mjs:2653 | function (dead) |
| `j2K` | `spawnInProcessTeammate` | chunks.137.mjs:2803 | function |
| `M2K` | `registerInProcessTask` | chunks.137.mjs:2757 | function |
| `d7Y` | `pickUniqueTeammateName` | chunks.137.mjs:2525 | function |
| `S77` | `sanitizeAgentName` | chunks.155.mjs:1165 | function |
| `UX6` | `getTeammateMode` | chunks.137.mjs:1738 | function |
| `gX6` | `setTeammateModeOverride` | chunks.137.mjs:1735 | variable |
| `HK8` | `buildTeammateEnv` | chunks.137.mjs:2374 | function |
| `J2K` | `resolveClaudeBinPath` | chunks.137.mjs:2449 | function |
| `X2K` | `buildExtraCliArgs` | chunks.137.mjs:2454 | function |
| `_2K` | `buildExtraCliArgsWithTeammateMode` (**dead code** — no callers; near-duplicate of `X2K` with `--teammate-mode` arg) | chunks.137.mjs:2350 | function (dead) |
| `A5` | `shellEscape` | chunks.137.mjs:1710 | function |
| `T96` | `sanitizeForTmuxName` | chunks.155.mjs:1161 | function |
| `Y2K` | `assignSwarmPaneId` | chunks.137.mjs:2402 | function |
| `A2K` | `ensureSwarmView` | chunks.137.mjs:2406 | function |
| `O2K` | `sendKeysToPane` | chunks.137.mjs:2410 | function |
| `Q7Y` | `ensureTmuxSession` | chunks.137.mjs:2442 | function |
| `z2K` | `isInsideTmux` | chunks.137.mjs:2395 | function |
| `y77` | `persistTeammateRecord` | chunks.137.mjs:2517 | function |
| `E77` | `wrapWithTeamConfigUpdate` | chunks.137.mjs:2476 | function |
| `R77` | `invalidatePaneBackendCache` | chunks.155.mjs:1141 | function |
| `v96` | `paneBackendProbe` | chunks.155.mjs:1002 | function |
| `h77` | `enableInProcessFallback` | chunks.155.mjs:1096 | function |
| `bF` | `inProcessExecutorCheck` | chunks.155.mjs:1104 | function |
| `FXY` | `getTeammateBackendMode` | chunks.155.mjs:1100 | function |
| `d37` | `resolveBackendType` | chunks.155.mjs:1119 | function |
| `LNK` | `getInProcessBackend` | chunks.155.mjs:1123 | function |
| `gXY` | `pickBackendExecutor` | chunks.155.mjs:1128 | function |
| `UXY` | `cachePaneBackendExecutor` | chunks.155.mjs:1133 | function |

### Mailbox (chunks.99.mjs / chunks.100.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `eH6` | `getInboxPath` | chunks.99.mjs:1934 | function |
| `dWz` | `ensureInboxDirectory` | chunks.99.mjs:1943 | function |
| `ts` | `readMailbox` | chunks.99.mjs:1952 | function |
| `qJ6` | `readUnreadMessages` | chunks.99.mjs:1965 | function |
| `_18` | `parseAgentName` | chunks.99.mjs:1902 | function |
| `ph6` | `composeMessageId` | chunks.99.mjs:1911 | function |
| `gh6` | `defaultSwarmName` | chunks.99.mjs:1916 | function |
| `F_` | `writeToMailbox` | chunks.100.mjs:3 | function |
| `Y18` | `markMessageAsReadByIndex` | chunks.100.mjs:38 | function |
| `A18` | `markMessagesAsRead` | chunks.100.mjs:73 | function |
| `O18` | `clearInbox` | chunks.100.mjs:103 | function |
| `cWz` | `formatTeammateXmlBlocks` | chunks.100.mjs:122 | function |
| `w18` | `buildIdleNotification` | chunks.100.mjs:134 | function |
| `$18` | `parseIdleNotification` | chunks.100.mjs:147 | function |
| `Ti1` | `buildPermissionRequest` | chunks.100.mjs:155 | function |
| `Vi1` | `buildPermissionResponse` | chunks.100.mjs:168 | function |
| `j18` | `parsePermissionRequest` | chunks.100.mjs:186 | function |
| `KJ6` | `parsePermissionResponse` | chunks.100.mjs:194 | function |
| `ki1` | `buildSandboxPermissionRequest` | chunks.100.mjs:202 | function |
| `Ni1` | `buildSandboxPermissionResponse` | chunks.100.mjs:216 | function |
| `cWz` | `formatTeammateMessages` (XML formatter) | chunks.100.mjs:122 | function |
| `dh6` | `buildShutdownRequest` (`Yb4` schema) | chunks.100.mjs:242 | function |
| `Ei1` | `buildShutdownApproved` (`Ab4` schema) | chunks.100.mjs:252 | function |
| `yi1` | `buildShutdownRejected` (`Ob4` schema) | chunks.100.mjs:263 | function |
| `RI8` | `dispatchShutdownRequest` (non-tool path) | chunks.100.mjs:273 | function |
| `i56` | `parseShutdownRequest` | chunks.100.mjs:293 | function |
| `_J6` | `parsePlanApprovalRequest` (uses `_b4` — was wrongly attributed to sandbox) | chunks.100.mjs:301 | function |
| `Qk` | `parseShutdownApproved` (uses `Ab4` — was wrongly attributed to sandbox) | chunks.100.mjs:309 | function |
| `SI8` | `parseShutdownRejected` (uses `Ob4`) | chunks.100.mjs:317 | function |
| `ch6` | `parsePlanApprovalResponse` (uses `zb4`) | chunks.100.mjs:325 | function |
| `hI8` | `parseSandboxPermissionRequest` | chunks.100.mjs:226 | function |
| `H18` | `parseSandboxPermissionResponse` | chunks.100.mjs:234 | function |
| `Yb4` | `shutdownRequestSchema` | chunks.100.mjs:464 | object |
| `Ab4` | `shutdownApprovedSchema` | chunks.100.mjs:470 | object |
| `Ob4` | `shutdownRejectedSchema` | chunks.100.mjs:477 | object |

### Additional message types (newly mapped from v2.1.88 cross-validation)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (inline parser) | `isTeamPermissionUpdate` (`team_permission_update` envelope: addRules broadcast) | chunks.100.mjs (referenced) | function |
| (inline parser) | `isTaskAssignment` (`task_assignment` envelope) | chunks.100.mjs (referenced) | function |
| (inline parser) | `isModeSetRequest` (`mode_set_request`, uses `ModeSetRequestMessageSchema`) | chunks.100.mjs (referenced) | function |
| (inline) | `createModeSetRequestMessage` | chunks.100.mjs (referenced) | function |
| (inline) | `markMessagesAsReadByPredicate` (selective mark-as-read with predicate) | chunks.100.mjs (referenced) | function |
| `J18` | `getLastPeerDmSummary` (extracts last peer DM summary for idle notification) | chunks.100.mjs (referenced) | function |
| (inline) | `isStructuredProtocolMessage` (10-type-discriminator) | chunks.100.mjs (referenced) | function |

### In-Process Runner (chunks.155.mjs / chunks.154.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bXY` | `inProcessAgentRunner` | chunks.155.mjs:3 | function |
| `Jg8` | `startInProcessAgentExecution` | chunks.155.mjs:309 | function |
| `yXY` | `pollIntervalMs` (`= 500`) | chunks.155.mjs:316 | constant |
| `JNK` | `InProcessBackend` | chunks.155.mjs:350 | class |
| `N97` | `TmuxBackend` | chunks.155.mjs:639 | class |
| `y97` | `ITermBackend` | chunks.155.mjs:870 | class |
| `TNK` | `registerTmuxBackend` | chunks.155.mjs:832 | function |
| `NNK` | `registerITermBackend` | chunks.155.mjs:955 | function |
| `WNK` | `wrapPaneBackendExecutor` | chunks.155.mjs (referenced) | function |
| `XNK` | `makeInProcessBackend` | chunks.155.mjs (referenced) | function |
| `oF` | `getTeamConfigPath` | chunks.155.mjs:1173 | function |
| `uM` | `readTeamConfigSync` | chunks.155.mjs:1177 | function |
| `$J6` | `readTeamConfigAsync` | chunks.155.mjs:1187 | function |
| `lM6` | `writeTeamConfig` | chunks.155.mjs:1197 | function |
| `LXY` | `buildCanUseToolForTeammate` | chunks.154.mjs:2203 | function |
| `k97` | `wrapMessageForTeammate` | chunks.154.mjs:2386 | function |
| `sF` | `mutateInProcessTeammateTask` | chunks.154.mjs:2394 | function |
| `hXY` | `dispatchToLeader` | chunks.154.mjs:2410 | function |
| `jNK` | `sendIdleNotification` | chunks.154.mjs:2419 | function |
| `RXY` | `findClaimableTask` | chunks.154.mjs:2424 | function |
| `SXY` | `formatTaskPrompt` | chunks.154.mjs:2433 | function |
| `HNK` | `claimUnclaimedTask` | chunks.154.mjs:2443 | function |
| `CXY` | `pollForNextMessage` | chunks.154.mjs:2462 | function |

### Permission Sync (chunks.100.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bb4` | `getTeamLeaderName` | chunks.100.mjs:1369 | function |
| `aI8` | `sendPermissionRequest` | chunks.100.mjs:1377 | function |
| `sI8` | `sendPermissionResponse` | chunks.100.mjs:1401 | function |
| `Ib4` | `makeSandboxRequestId` | chunks.100.mjs:1423 | function |
| `xb4` | `sendSandboxPermissionRequest` | chunks.100.mjs:1427 | function |
| `tI8` | `sendSandboxPermissionResponse` | chunks.100.mjs:1455 | function |
| `Y0z` | `derivePermissionMode` | chunks.100.mjs:1073 | function |
| `cI8` | `spawnInProcessHelper` | chunks.100.mjs:1079 | function |
| `W18` | `updateTaskWithResult` (kill path) | chunks.100.mjs:1152 | function |

### Tools

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `LJY` | `SendMessageTool` | chunks.153.mjs:367 | object |
| `tW` | `SEND_MESSAGE_TOOL_NAME` (`"SendMessage"`) | chunks.153.mjs (referenced) | constant |
| `jJY` | `TeamDeleteTool` (third user-facing team tool, distinct from TeamCreate; emits `tengu_team_deleted`) | chunks.152.mjs:2609 | object |
| `Cc` | `TEAM_DELETE_TOOL_NAME` (`"TeamDelete"`) | chunks.98.mjs:1491 | constant |
| `vJY` | `sendMessageToOne` | chunks.153.mjs:96 | function |
| `TJY` | `broadcastMessage` | chunks.153.mjs:125 | function |
| `VJY` | `sendShutdownRequest` | chunks.153.mjs:169 | function |
| `kJY` | `approveShutdown` | chunks.153.mjs:194 | function |
| `NJY` | `rejectShutdown` | chunks.153.mjs:250 | function |
| `EJY` | `approveTeammatePlan` | chunks.153.mjs:272 | function |
| `yJY` | `rejectTeammatePlan` | chunks.153.mjs:298 | function |
| `_b4` | `planApprovalRequestSchema` | chunks.100.mjs:451 | object |
| `zb4` | `planApprovalResponseSchema` | chunks.100.mjs:458 | object |
| `RHK` | `AgentTool` | chunks.141.mjs:456 | object |
| `T4` | `AGENT_TOOL_NAME` (`"Agent"`) | chunks.141.mjs (referenced) | constant |
| `wJY` | `TeamCreateTool` | chunks.152.mjs:2439 | object |
| `lp` | `TEAM_CREATE_TOOL_NAME` (`"TeamCreate"`) | chunks.152.mjs (referenced) | constant |

### TUI Helpers (chunks.183.mjs / chunks.100.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$u6` | `formatTeammateStatusVerb` | chunks.183.mjs:2733 | function |
| `ju6` | `allTeammatesAreInProcess` | chunks.183.mjs:2740 | function |
| `_nK` | `AgentStatusComponent` | chunks.183.mjs:2756 | function |
| `AJ6` | `getSpinnerVerbs` | chunks.100.mjs:624 | function |
| `LJ` | `pickRandomSpinnerVerb` | chunks.100.mjs:621 | function |
| `Si1` | `DEFAULT_SPINNER_VERBS` | chunks.100.mjs:633 | constant |
| `nh6` | `IDLE_VERBS` | chunks.100.mjs (referenced) | constant |

### Hooks (chunks.192.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `W38` | `runTeammateIdleHook` (event: `TeammateIdle`) | chunks.192.mjs:2814 | function |
| `e58` | `runTaskCreatedHook` (event: `TaskCreated`) | chunks.192.mjs:2829 | function |
| `CM6` | `runTaskCompletedHook` (event: `TaskCompleted`) | chunks.192.mjs:2848 | function |

### Constants (chunks.99.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Mz` | `LEAD_NAME` (`"team-lead"`) | chunks.99.mjs:1920 | constant |
| `Ny` | `SWARM_SESSION` (`"claude-swarm"`) | chunks.99.mjs:1922 | constant |
| `Fh6` | `SWARM_VIEW_WINDOW` (`"swarm-view"`) | chunks.99.mjs:1924 | constant |
| `mD` | `TMUX` (`"tmux"`) | chunks.99.mjs:1926 | constant |
| `Gi1` | `HIDDEN_PANE` (`"claude-hidden"`) | chunks.99.mjs:1928 | constant |
| `Uh6` | `TEAMMATE_COMMAND_ENV` (`"CLAUDE_CODE_TEAMMATE_COMMAND"`) | chunks.99.mjs:1930 | constant |
| `oX` | `TEAMMATE_MESSAGE_TAG` (`"teammate-message"`) | chunks.16.mjs:584 | constant |
| `z18` | `LOCK_RETRY_OPTS` (`{retries: {retries: 10, minTimeout: 5, maxTimeout: 100}}`) | chunks.100.mjs:443 | constant |

### Telemetry Events (string literals)

| Event | File:Line | When fired |
|-------|-----------|------------|
| `tengu_team_created` | chunks.152.mjs:2544 | TeamCreate success (`teammate_count: 1` always — only the lead) |
| `tengu_team_deleted` | chunks.152.mjs:2659 | TeamDelete tool (`Cc` / `jJY`) success |
| `tengu_teammate_mode_changed` | chunks.169.mjs:675 | teammateMode toggle |
| `tengu_teammate_default_model_changed` | chunks.169.mjs:1069 | model setting changed |
| `tengu_team_mem_sync_started` | chunks.163.mjs:1614 | Team memory sync begins |
| `tengu_team_mem_sync_pull` | chunks.163.mjs:1388 | Team memory pulled |
| `tengu_team_mem_sync_push` | chunks.163.mjs:1415 | Team memory pushed |
| `tengu_team_mem_push_suppressed` | chunks.163.mjs:1511 | Team memory push skipped |
| `tengu_team_mem_secret_skipped` | chunks.163.mjs:1192 | Secret detected & skipped |
| `tengu_team_mem_entries_capped` | chunks.163.mjs:973 | Memory cap reached |
| `tengu_team_mem_accessed` | chunks.163.mjs:1776 | Generic team-memory file touch |
| `tengu_team_mem_file_read/edit/write` | chunks.163.mjs:1781/1786/1791 | Per-file ops |
| `tengu_agent_memory_loaded` | chunks.155.mjs:46 | Custom agent memory in runner |

### v2.1.76 → v2.1.112 Symbol Renames (Agent Teams)

| Concept | v2.1.76 | v2.1.112 |
|---------|---------|----------|
| Feature gate | `E7` | `z4` |
| Spawn dispatcher | `pNY` | `n7Y` |
| In-process spawn | `FNY` | `j2K` |
| Split-pane spawn | `BNY` | `c7Y` |
| Tmux window spawn | `gNY` | `l7Y` |
| In-process check | `Rb` | `bF` |
| Runner | `XNY` | `bXY` |
| Poll loop | `DNY` | `CXY` |
| Task claim | `Ji4` | `HNK` |
| Mailbox write | `x3` | `F_` |
| Mailbox read | `wl` | `ts` |
| Mark read | `kc6` | `A18` |
| Mark single read | `Vc6` | `Y18` |
| SendMessage tool | `OxY` | `LJY` |
| Status renderer | `gZ1` | (consolidated; see `_nK`) |

---

## v2.1.88 → v2.1.112 Equivalents

For 2.1.88 source code in TypeScript:

| Concept | v2.1.88 file | v2.1.112 chunk |
|---------|--------------|----------------|
| Hook permission decisions | `src/utils/hooks.ts:553-572` | `chunks.193.mjs:34-130` |
| Effort levels | `src/utils/effort.ts:13-18` | `chunks.80.mjs:2835` |
| max effort gate | `src/utils/effort.ts:51-65` | `chunks.80.mjs:2701-2706` |
| Fullscreen detection | `src/utils/fullscreen.ts` | `chunks.65.mjs:1491-1505` |
| `/release-notes` | `src/commands/release-notes/release-notes.ts` | (interactive picker chunk) |
| Status line CA bundle | `src/upstreamproxy/upstreamproxy.ts:32` | `chunks.19.mjs:2150-2167` |
| Settings keys | `src/types/settings.ts` (likely) | `chunks.19.mjs` |
| awaySummary (precursor `/recap`) | `src/services/awaySummary.ts` | `chunks.189.mjs:2782-2792` |
| `/ultraplan` | `src/commands/ultraplan.tsx` | (cloud invocation chunk) |
| `/buddy` (companion) | `src/buddy/companion.ts` | `chunks.180.mjs`, `chunks.220.mjs` |
| Bash perm rules | `src/tools/BashTool/` | `chunks.83.mjs`, `chunks.149.mjs` |
| MCP `_meta` annotation | (n/a — added v2.1.91) | `chunks.162.mjs:578-617` |

---

## Notes on Obfuscation

The obfuscation pattern in v2.1.112 follows these conventions:
- **Lowercase 1-3 letter names** (`q`, `K`, `_`, `z`) — local variables, parameters
- **Mixed-case 2-3 letter** (`q6`, `H6`, `Y0`) — module-level vars, anonymous helpers
- **Suffix-letter patterns** (`zX1`, `iI6`) — auto-generated names from rollup/esbuild
- **Acronyms** (`UI`, `MCP`, `MO5`) — usually preserved/derived from source

Function names typically deobfuscate via:
1. **Usage context** — what arguments does it take, what does it return
2. **String literals** — error messages and log strings often retain original wording
3. **Comparison with v2.1.88 source** — patch-by-patch matching
4. **Cross-references** — same name appears in multiple chunks → check all callers

For names not in this index, refer to the v2.1.76 analyses' `symbol_index_*.md` (which cover the broader codebase context that hasn't changed).
