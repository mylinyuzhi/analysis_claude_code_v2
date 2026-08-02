# Symbol index — Core execution (v2.1.220)

**Scope:** Agent loop, LLM API, tools, agents/subagent plumbing, state, system prompts.

All `File:Line` values are line numbers in the **2.1.220** bundle
`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines, `build_sha 4073f595`). A line tagged `(193)` inside a description refers to
the 2.1.193 baseline and is never used as a `File:Line` value.

> ⚠ **Do not reconcile these symbols against a 2.1.193 index by name.** Identifiers are
> re-mangled between builds and ids are REUSED for unrelated declarations — the #1 analysis
> trap in this tree (`_CONVENTIONS.md` §4 trap 1). Confirmed collisions include `cOt`, `BEy`,
> `OKt`, `yBc` and `lor`. Each source `symbol_additions_*` file lists its own theme's collisions.

> ⚠ **155 obfuscated ids are named two different ways** across the four indexes, and 59 carry
> differing `File:Line` values. Before trusting a row here, check
> [`symbol_alias_conflicts.md`](symbol_alias_conflicts.md) — a mechanically generated register of
> every such disagreement. Same id, two names means at most one analyst was right.

> **Provenance.** Mechanically merged from the per-theme `symbol_additions_v2_1_220_*.md`
> files listed at the bottom, which remain the authoritative sources and additionally carry
> per-theme gate/env-var censuses and notes that are deliberately not duplicated here.
> Rows are deduplicated and sorted by the Obfuscated column within each module section.

---

## Module: Agent Loop / LLM API

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bji` | `MID_CONV_CACHE_PROMOTION_OK_LATCH` | cli_inner_pretty.js:109220 | constant |
| `btp` | `makeEffortOnlySystemTurn` | cli_inner_pretty.js:508707 | function |
| `cU_` | `enforceApiSystemPlacement` | cli_inner_pretty.js:531760 | function |
| `dvi` | `setMidConvCachePromotionRejectedGlobal` | cli_inner_pretty.js:3933 | function |
| `Epo` | `errorNamesBetaHeader` | cli_inner_pretty.js:228382 | function |
| `Etp` | `stripPerTurnEffortConfigs` | cli_inner_pretty.js:508691 | function |
| `g1_` | `placeCacheBreakpoints` | cli_inner_pretty.js:511886 | function |
| `H` (inner) | `flushPendingReminders` | cli_inner_pretty.js:531516 | function |
| `I9s` | `unwrapSystemReminder` | cli_inner_pretty.js:532381 | function |
| `Jno` | `makeApiSystemMessage` | cli_inner_pretty.js:157377 | function |
| `lW` | `PER_TURN_CONTROL_BETA` | cli_inner_pretty.js:109215 | constant |
| `NN` | `normalizeMessagesForApi` | cli_inner_pretty.js:531420 | function |
| `r5r` | `MID_CONV_CACHE_PROMOTION_LATCH` | cli_inner_pretty.js:109219 | constant |
| `rus` | `isCacheControlRejection` | cli_inner_pretty.js:228393 | function |
| `Stp` | `insertPerTurnEffortStatements` | cli_inner_pretty.js:508671 | function |
| `uvi` | `isMidConvCachePromotionRejected` | cli_inner_pretty.js:3930 | function |
| `VLu` | `SYSTEM_ROLE_ERROR_RE` | cli_inner_pretty.js:229018 | constant |
| `vNr` | `resetStickyBetasAndEffortPins` | cli_inner_pretty.js:3951 | function |
| `vpo` | `isSystemRoleRejection` | cli_inner_pretty.js:228385 | function |
| `vtp` | `collectUserMessageUuids` | cli_inner_pretty.js:508704 | function |
| `vU_` | `joinUnwrappedReminderTexts` | cli_inner_pretty.js:532427 | function |
| `Ww` | `wrapInSystemReminder` | cli_inner_pretty.js:532376 | function |

## Module: Agent Loop — turn orchestration and streaming tools

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Hs` | `handleTerminalStopHooks` (terminal tool/MCP path; hook blocks cannot reinvoke) | cli_inner_pretty.js:336319 | function |
| `Aud` | `logFabricatedTurnCandidates` | cli_inner_pretty.js:337108 | function |
| `BHs` | `isFailureTerminalReason` | cli_inner_pretty.js:336833 | function |
| `Cud` | `isWithheldMaxOutputTokens` | cli_inner_pretty.js:337249 | function |
| `dld` | `getToolEndTurnSource` (`toolEndsTurn` / MCP `claude/endTurn`; errors excluded) | cli_inner_pretty.js:331717 | function |
| `dTo` | `shouldCancelCommandLifecycle` | cli_inner_pretty.js:336864 | function |
| `e$y` | `finalizeToolEndedTurn` | cli_inner_pretty.js:337178 | function |
| `gld` | `interleaveModelStreamWithToolDrain` | cli_inner_pretty.js:332081 | function |
| `iud` | `QUERY_TERMINAL_REASONS` (SDK terminal-reason enum source) | cli_inner_pretty.js:336867-336887 | constant |
| `Kir` | `applyToolContextLayers` | cli_inner_pretty.js:237877 | function |
| `Kse` | `queryEntrypoint` | cli_inner_pretty.js:337283 | function |
| `kud` | `findCurrentTurnStartIndex` | cli_inner_pretty.js:339319 | function |
| `nud` | `productionDeps` | cli_inner_pretty.js:336815 | function |
| `o$y` | `queryWithObserverTap` | cli_inner_pretty.js:337298 | function |
| `oon` | `runToolUse` | cli_inner_pretty.js:425379 | function |
| `Q1y` | `yieldMissingToolResults` | cli_inner_pretty.js:337148 | function |
| `qpt` | `isAbortTerminalReason` | cli_inner_pretty.js:336830 | function |
| `r$y` | `canResumeIncompleteThinking` | cli_inner_pretty.js:337252 | function |
| `rwo` | `isAssistantRequestTooLargeMessage` | cli_inner_pretty.js:329009 | function |
| `sud` | `failureReasonMetric` | cli_inner_pretty.js:336861 | function |
| `t$y` | `MAX_OUTPUT_TOKENS_RECOVERY_LIMIT` (`3`) | cli_inner_pretty.js:339330 | constant |
| `wg` | `queryCheckpoint` | cli_inner_pretty.js:332107 | function |
| `Wks` | `StreamingToolExecutor` | cli_inner_pretty.js:331761 | class |
| `xud` | `runQueryTurns` | cli_inner_pretty.js:337348 | function |
| `Ycd` | `handleStopHooks` | cli_inner_pretty.js:336419 | function |
| `Z1y` | `findLatestUserUuidAfterLastAssistant` | cli_inner_pretty.js:337174 | function |
| `Zcd` | `createTurnAccumulator` | cli_inner_pretty.js:336776 | function |
| `zr` | `createUserMessage` | cli_inner_pretty.js:530718 | function |

## Module: Agent Tool

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$` (local) | chargeSessionBudget — abort → budget → session count → increment | cli_inner_pretty.js:398378-398401 | function |
| `bSe` | FORK_AGENT_TYPE (`"fork"`) | cli_inner_pretty.js:231877 | constant |
| `Cj` | LEGACY_AGENT_TOOL_NAME (`"Task"`) | cli_inner_pretty.js:162359 | constant |
| `Cty` | buildWorkerPromptToolProse (branches on `hee() > 1`) | cli_inner_pretty.js:231517-231529 | function |
| `D` (local) | checkConcurrencyCeiling — returns a refusal, does not throw | cli_inner_pretty.js:398402-398414 | function |
| `dte` | resolveAgentTools (passes `agentDepth` to the filter at `:345532`) | cli_inner_pretty.js:345528 | function |
| `G8y` | AGENT_TOOL_BASE_SCHEMA (description/prompt/subagent_type/model/run_in_background) | cli_inner_pretty.js:398193-398211 | object |
| `Lcn` | resolveRequestedSubagentMode (privilege-monotonic; removed in 220) | cli_inner_pretty.js:54240-54244 (193) | function |
| `MNy` | filterToolsForAgent (drops the Agent tool at the depth cap) | cli_inner_pretty.js:345484-345499 | function |
| `oG` | runAgent (builds the child's tools + system prompt) | cli_inner_pretty.js:344277-344315 | function |
| `qo` | AGENT_TOOL_NAME (`"Agent"`) | cli_inner_pretty.js:162358 | constant |
| `qTo` | shouldRunForkedSkillInBackground (`background ?? true`) | cli_inner_pretty.js:342396-342399 | function |
| `RPe` | AgentPreconditionError | cli_inner_pretty.js:430357-430362 (193) | class |
| `Tty` | buildWorkerToolInventory (splices `Agent` in only when `hee() > 1`) | cli_inner_pretty.js:231486-231516 | function |
| `U` (local) | acquireConcurrencySlot — re-check, teardown worktree on refusal, take slot | cli_inner_pretty.js:398415-398419 | function |
| `VTo` | launchForkedSkillAgent (depth/spawn caps at `:342427`-`:342442`, degrade-to-inline) | cli_inner_pretty.js:342400 | function |
| `W8y` | AGENT_TOOL_FULL_SCHEMA (adds name/team_name/mode/isolation/cwd; `mode` deprecation text at `:398229`) | cli_inner_pretty.js:398212 | object |
| `wIe` | AgentRefusalError (`AgentPreconditionError` name) | cli_inner_pretty.js:398187-398192 | class |
| `yRo` | canFanOutViaAgentTool (prompt-level depth predicate) | cli_inner_pretty.js:423574-423579 | function |

## Module: Agent Tool — runtime and terminal results

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aNt` | `AgentTypeError` (denied, missing, or ambiguous agent type) | cli_inner_pretty.js:398175 | class |
| `Apd` | `recoverSyncAgentError` (eligible partial result or rethrow) | cli_inner_pretty.js:345905 | function |
| `hIe` | `runAsyncAgentLifecycle` (watchdog, task state, completion/kill/failure notification) | cli_inner_pretty.js:345920 | function |
| `Kus` | `buildForkedAgentMessages` (parent assistant + placeholder results + child directive) | cli_inner_pretty.js:231841 | function |
| `m0o` | `AgentApiErrorTerminationError` (terminal API-error discriminator) | cli_inner_pretty.js:346382 | class |
| `q8y` | `COMPLETED_AGENT_RESULT_SCHEMA` | cli_inner_pretty.js:398253 | object |
| `QMs` | `RemoteAgentPreconditionError` | cli_inner_pretty.js:398181 | class |
| `tin` | `classifySubagentHandoff` (auto-mode post-run safety review) | cli_inner_pretty.js:345816 | function |
| `V8y` | `AGENT_TOOL_OUTPUT_SCHEMA` (`completed | async_launched | remote_launched`) | cli_inner_pretty.js:398261 | object |
| `Wko` | `AgentTool` (preflight, route selection, execution, and result mapping) | cli_inner_pretty.js:398293 | object |
| `XIs` | `finalizeAgentTool` (sanitized final text, usage, tool stats, telemetry) | cli_inner_pretty.js:345677 | function |
| `ZMs` | `getAgentToolInputSchema` (surface-dependent omissions) | cli_inner_pretty.js:398249 | object |

## Module: Built-in Agents & Prompts

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `BFe` | GENERAL_PURPOSE_AGENT descriptor | cli_inner_pretty.js:269328-269336 | object |
| `FFe` | EXPLORE_AGENT descriptor (`model: "inherit"`, Agent tool disallowed) | cli_inner_pretty.js:269296-269306 | object |
| `gde` | EXPLORE_AGENT descriptor (`model: "haiku"`) | cli_inner_pretty.js:384844-384854 (193) | object |
| `Hhy` | getGeneralPurposeAgentSystemPrompt (re-delegation line at `:269324`) | cli_inner_pretty.js:269309-269325 | function |
| `zqp` | getGeneralPurposeAgentSystemPrompt (no re-delegation line) | cli_inner_pretty.js:396327-396342 (193) | function |

## Module: Core execution — bounded file reads and truncation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$xy` | `FILE_STATE_CACHE_MAX_BYTES` (`26214400`) | cli_inner_pretty.js:309832 | constant |
| `_Il` | `flattenString` (`Buffer.from(s,"utf16le").toString("utf16le")` — breaks V8 SlicedString) | cli_inner_pretty.js:20687 | function |
| `atn` | `fileStateCacheToObject` | cli_inner_pretty.js:309808 | function |
| `Bws` | `readCachedFileContent` | cli_inner_pretty.js:310485 | function |
| `Bye` | `readTextFileBoundedAsync` | cli_inner_pretty.js:50067 | function |
| `ej` | `readTextFileBoundedSync` | cli_inner_pretty.js:50064 | function |
| `eky` | `EDIT_CACHE_MAX_ENTRIES` (`1000`) | cli_inner_pretty.js:310489 | constant |
| `F4l` | `assertReadableRegularFile` (EISDIR / ERR_NOT_REGULAR_FILE / ERR_FILE_TOO_LARGE) | cli_inner_pretty.js:49998 | function |
| `gEo` | `mergeFileStateCaches` (newest-timestamp wins) | cli_inner_pretty.js:309822 | function |
| `GHe` | `cloneFileStateCache` (dump/load copy, `stripSeededFromContext`) | cli_inner_pretty.js:309814 | function |
| `Iir` | `FileTooLargeError` | cli_inner_pretty.js:235355 | class |
| `Kry` | `sliceLinesFromLoadedFile` (whole-file path; throws `Rir` at :235185) | cli_inner_pretty.js:235139 | function |
| `lFe` | `readFileWithLineRange` (gained the `maxSelectedBytes` option) | cli_inner_pretty.js:235119 | function |
| `m8` | `truncateEnd` (surrogate-safe, flattening) | cli_inner_pretty.js:20681 | function |
| `ma` | `truncateStart` (surrogate-safe, flattening; 65 call sites; 193 twin `ZI` `:10187 (193)`, 14) | cli_inner_pretty.js:20675 | function |
| `Nxy` | `FILE_STATE_CONTENT_RETENTION_LIMIT` (`4096`) | cli_inner_pretty.js:309833 | constant |
| `OWe` | `readTextFileBounded` | cli_inner_pretty.js:50045 | function |
| `OZu` | `EditFileReadCache` (LRU; 193 twin `B8a` FIFO `:375738 (193)`) | cli_inner_pretty.js:310451 | class |
| `p6` | `createFileStateCache` | cli_inner_pretty.js:309805 | function |
| `Qry` | `streamLinesFromFile` (`createReadStream`, `highWaterMark: 524288`) | cli_inner_pretty.js:235315 | function |
| `Rir` | `SelectedRangeTooLargeError` (the `.208` long-single-line error) | cli_inner_pretty.js:235367 | class |
| `rky` | `editFileReadCacheSingleton` | cli_inner_pretty.js:310496 | variable |
| `S9` | `FILE_STATE_CACHE_MAX_ENTRIES` (`5000`) | cli_inner_pretty.js:309831 | constant |
| `SZu` | `ReadFileStateCache` (`Buffer.byteLength` sizing; carryover from `:233652 (193)`) | cli_inner_pretty.js:309753 | class |
| `tky` | `EDIT_CACHE_MAX_CHARS` (`16777216`) | cli_inner_pretty.js:310490 | constant |
| `TSs` | `BYTES_PER_TOKEN_READ_BUDGET` (`128`) | cli_inner_pretty.js:284307 | constant |
| `Vry` | `WHOLE_FILE_READ_THRESHOLD` (`10485760`) | cli_inner_pretty.js:235348 | constant |
| `zry` | `NON_REGULAR_FILE_HARD_CAP` (`134217728`) | cli_inner_pretty.js:235349 | constant |

## Module: Core execution — message normalization (eliminations, not deltas)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `eOd` | `findLastUsageAnchor` (**carryover**) | cli_inner_pretty.js:442577 | function |
| `Jtp` | `stripThinkingFromOtherModels` | cli_inner_pretty.js:533684 | function |
| `m1_` | `buildRequestMessages` (193 twin `LGf` `:594226 (193)`) | cli_inner_pretty.js:509336 | function |
| `n0o` | `estimateAssistantMessageChars` | cli_inner_pretty.js:442563 | function |
| `NN` | `normalizeMessagesForWire` (193 twin `Dx` `:600274 (193)`; 220 added a 4th options param) | cli_inner_pretty.js:531420 | function |
| `U9s` | `stripCrossModelThinking` (**carryover**, byte-equivalent to `YSo` `:602157 (193)`) | cli_inner_pretty.js:533670 | function |
| `Y0` | `estimateConversationTokens` (usage-anchored; **carryover**) | cli_inner_pretty.js:442572 | function |
| `Ztp` | `dropOrphanedToolResults` (193 twin `jJl` `:602202 (193)`) | cli_inner_pretty.js:533713 | function |

## Module: Core execution — process stdout lifecycle

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Bzt` | `handleStreamGoneErrors` (export name at :20509) | cli_inner_pretty.js:20520 | function |
| `dCi` | `registerProcessIOErrorHandlers` | cli_inner_pretty.js:20530 | function |
| `dIl` | `writeIfWritable` | cli_inner_pretty.js:20538 | function |
| `f9m` | `ASSUMED_PIPE_THROUGHPUT_BPS` (`262144`) | cli_inner_pretty.js:20646 | constant |
| `fIl` | `bytesWrittenToStdout` | cli_inner_pretty.js:20641 | variable |
| `fWe` | `markStdoutDrainExternallyClocked` (export name at :20507) | cli_inner_pretty.js:20561 | function |
| `gIl` | `getPendingStdoutBytes` | cli_inner_pretty.js:20572 | function |
| `Js` | `writeToStdout` (maintains `bytesWritten` / `bytesFlushed`) | cli_inner_pretty.js:20542 | function |
| `jzt` | `drainStdoutBeforeExit` (`{ scaleBudgetToQueue }`; export name at :20513) | cli_inner_pretty.js:20552 | function |
| `m9m` | `DRAIN_BUDGET_CEILING_MS` (`30000`) | cli_inner_pretty.js:20647 | constant |
| `mIl` | `bytesFlushedToStdout` | cli_inner_pretty.js:20642 | variable |
| `OUn` | `getStdoutDrainBudgetMs` (`clamp(pending/262144·1000, 2000, 30000)`) | cli_inner_pretty.js:20578 | function |
| `p9m` | `awaitExternalDrainClock` | cli_inner_pretty.js:20569 | function |
| `pCi` | `stdoutErrorLatched` | cli_inner_pretty.js:20648 | variable |
| `pIl` | `anythingWasWrittenToStdout` | cli_inner_pretty.js:20639 | variable |
| `Uzt` | `isStdinUnusableError` | cli_inner_pretty.js:20516 | function |

## Module: Core execution — tool pool assembly

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `G7` | `assembleToolPool` (193 twin `AJ` `:444188 (193)`) | cli_inner_pretty.js:425008 | function |
| `nve` | `filterToolsByDenyRules` (holds the `.208` hoist `let r = mM(t);`) | cli_inner_pretty.js:425004 | function |

## Module: LLM API — HTTP/2 teardown recovery

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aau` | `isRecoverableHttp2TeardownError` | cli_inner_pretty.js:165073 | function |
| `Dip` | `allowUncaughtRecovery` (rate limiter) | cli_inner_pretty.js:522185 | function |
| `J8s` | `recoveredUncaughtReportCount` | cli_inner_pretty.js:522397 | variable |
| `Lip` | `MAX_RECOVERED_UNCAUGHT_REPORTS` (`10`) | cli_inner_pretty.js:522396 | constant |
| `sau` | `stackHasFrame` (internal-frame matcher) | cli_inner_pretty.js:165088 | variable |
| `VOg` | `NGHTTP2_STREAM_CLOSE_RE` | cli_inner_pretty.js:165101 | constant |
| `z8s` | `recordRecoveredUncaughtMessage` | cli_inner_pretty.js:522206 | function |

## Module: LLM API — context-overflow and media-size messages

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$7r` | `isPromptTooLongError` | cli_inner_pretty.js:228130 | function |
| `$Lu` | `AWS_CREDS_EXPIRED_PREFIX` | cli_inner_pretty.js:228931 | constant |
| `Bls` | `MAX_REQUEST_BYTES` (`33554432`, 32 MiB) | cli_inner_pretty.js:222501 | constant |
| `BLu` | `GCLOUD_AUTH_FAILED_PREFIX` | cli_inner_pretty.js:228934 | constant |
| `cir` | `computeOverflowTokenGap` | cli_inner_pretty.js:228082 | function |
| `fir` | `buildMediaRemovedMessage` | cli_inner_pretty.js:228182 | function |
| `FLu` | `GCLOUD_CREDS_EXPIRED_PREFIX` | cli_inner_pretty.js:228933 | constant |
| `fpo` | `buildImageTooLargeMessage` | cli_inner_pretty.js:228171 | function |
| `hIu` | `MAX_PDF_PAGES` (`100`) | cli_inner_pretty.js:222503 | constant |
| `hpo` | `isRequestTooLargeMessage` | cli_inner_pretty.js:228127 | function |
| `Jcs` | `buildInvalidPdfMessage` | cli_inner_pretty.js:228166 | function |
| `jLu` | `mediaKindsForRequestTooLarge` | cli_inner_pretty.js:228107 | function |
| `KW` | `isApiErrorText` (six prefixes; was two in 193) | cli_inner_pretty.js:228062 | function |
| `M7r` | `parsePromptTooLongTokens` | cli_inner_pretty.js:228078 | function |
| `mlp` | `parseMediaKindsFromErrorDetails` | cli_inner_pretty.js:531352 | function |
| `mpo` | `locateOversizeMediaFrom400` | cli_inner_pretty.js:228123 | function |
| `NLu` | `AWS_AUTH_FAILED_PREFIX` | cli_inner_pretty.js:228932 | constant |
| `nU_` | `buildMediaStripMessageMap` | cli_inner_pretty.js:531341 | function |
| `P7r` | `REPEATED_529_MESSAGE` | cli_inner_pretty.js:228960 | constant |
| `ppo` | `buildProviderStatusHint` | cli_inner_pretty.js:228144 | function |
| `Qcs` | `buildRequestTooLargeMessage` (accumulated-media text) | cli_inner_pretty.js:228176 | function |
| `RE` | `API_ERROR_PREFIX` (`"API Error"`) | cli_inner_pretty.js:228930 | constant |
| `rey` | `TRANSIENT_RATE_LIMIT_MESSAGE` | cli_inner_pretty.js:228963 | constant |
| `t7r` | `MAX_PDF_BYTES` (`20971520`) | cli_inner_pretty.js:222502 | constant |
| `ULu` | `buildSingleExchangeTooLongMessage` | cli_inner_pretty.js:228089 | function |
| `VZg` | `SINGLE_EXCHANGE_DOMINANCE_RATIO` (`0.8`) | cli_inner_pretty.js:228936 | constant |
| `Wcs` | `STATUS_PAGE_URL` (`https://status.claude.com`) | cli_inner_pretty.js:228959 | constant |
| `Xcs` | `buildPasswordProtectedPdfMessage` | cli_inner_pretty.js:228161 | function |
| `Ycs` | `buildPdfTooLargeMessage` | cli_inner_pretty.js:228155 | function |
| `zcs` | `locateOversizeMediaBlock` (messages[i].content[j] regex) | cli_inner_pretty.js:228113 | function |
| `ZNe` | `isPromptTooLongApiMessage` | cli_inner_pretty.js:228072 | function |
| `zW` | `PROMPT_TOO_LONG_PREFIX` | cli_inner_pretty.js:228935 | constant |
| `zZg` | `isRequestTooLargeDetail` | cli_inner_pretty.js:228104 | function |

## Module: LLM API — request retry loop

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$lp` | `isTransientRateLimit` (429 without unified rate-limit headers) | cli_inner_pretty.js:534951 | function |
| `$U_` | `DEFAULT_RETRIES` (`10`) | cli_inner_pretty.js:534989 | constant |
| `Blp` | `isWatchdogRetryableError` (529 or 429) | cli_inner_pretty.js:534516 | function |
| `BU_` | `REMOTE_AUTH_RETRY_DELAY_MS` (`1000`) | cli_inner_pretty.js:534995 | constant |
| `c4_` | `readUnifiedResetHeader` (ms until reset, capped at `Flp`) | cli_inner_pretty.js:534979 | function |
| `Dlp` | `FLOOR_OUTPUT_TOKENS` (`3000`) | cli_inner_pretty.js:534992 | constant |
| `Dqs` | `isServerError5xx` (5xx excluding 529) | cli_inner_pretty.js:534859 | function |
| `e4_` | `isGoogleCredentialMessage` (3 message shapes) | cli_inner_pretty.js:534883 | function |
| `Flp` | `MAX_RETRY_DELAY_MS` (`21600000`, 6 h) | cli_inner_pretty.js:535003 | constant |
| `FU_` | `MAX_CCR_AUTH_RETRIES` (`2`) | cli_inner_pretty.js:534994 | constant |
| `FUo` | `makeRetryAbortError` | cli_inner_pretty.js:534988 | function |
| `GU_` | `MAX_AWS_AUTH_RETRIES` (`2`) | cli_inner_pretty.js:534998 | constant |
| `JBo` | `MAX_CONSECUTIVE_529` (`3`) | cli_inner_pretty.js:534993 | constant |
| `jlp` | `parseMaxTokensContextLimitError` | cli_inner_pretty.js:534829 | function |
| `JU_` | `RETRYABLE_STATUS_CODES` (`{401,407,429,404,403,413}`) | cli_inner_pretty.js:535065 | constant |
| `KU_` | `RETRY_SLEEP_SLICE_MS` (`30000`) | cli_inner_pretty.js:535004 | constant |
| `l4_` | `readRetryAfterMs` (seconds header × 1000) | cli_inner_pretty.js:534971 | function |
| `n4_` | `isRetryableApiError` (master classifier) | cli_inner_pretty.js:534911 | function |
| `Nlp` | `clampWarningEmitted` (one-shot latch) | cli_inner_pretty.js:535009 | variable |
| `NU_` | `WATCHDOG_DEFAULT_RETRIES` (`300`) | cli_inner_pretty.js:534990 | constant |
| `o4_` | `resolveMaxRetriesForRequest` | cli_inner_pretty.js:534968 | function |
| `Plp` | `sleepUntilRetryOrWake` (30 s slices, wake channel) | cli_inner_pretty.js:534800 | function |
| `Pqs` | `getMaxRetries` (watchdog-aware budget) | cli_inner_pretty.js:534954 | function |
| `qlp` | `isGoogleCredentialError` (Vertex / anthropic_google_cloud) | cli_inner_pretty.js:534892 | function |
| `qU_` | `RETRY_BACKOFF_BASE_MS` (`500`) | cli_inner_pretty.js:535000 | constant |
| `r4_` | `invalidateCachedCredentialOnError` | cli_inner_pretty.js:534903 | function |
| `smn` | `isRemoteAuthError` (`CLAUDE_CODE_REMOTE` + 401/403) | cli_inner_pretty.js:534519 | function |
| `t4_` | `refreshGoogleAuthAndAllowRetry` | cli_inner_pretty.js:534899 | function |
| `Ulp` | `readRetryAfterHeader` | cli_inner_pretty.js:534817 | function |
| `UU_` | `MAX_OAUTH_REFRESH_RETRIES` (`2`) | cli_inner_pretty.js:534996 | constant |
| `VU_` | `MAX_ACCEPTABLE_RETRY_DELAY_MS` (`60000`) | cli_inner_pretty.js:535001 | constant |
| `WU_` | `MAX_API_KEY_HELPER_RETRIES` (`2`) | cli_inner_pretty.js:534999 | constant |
| `WUe` | `isRetryWatchdogEnabled` (`CLAUDE_CODE_RETRY_WATCHDOG`) | cli_inner_pretty.js:534513 | function |
| `X9s` | `MAX_RETRIES_CLAMP` (`15`) | cli_inner_pretty.js:534991 | constant |
| `YU_` | `isStaleConnectionError` (`qie` membership) | cli_inner_pretty.js:534522 | function |
| `Z2e` | `computeRetryDelay` (exp backoff, 25 % jitter, `retry-after` floor) | cli_inner_pretty.js:534820 | function |
| `ZU_` | `refreshAwsAuthAndAllowRetry` (side-effecting) | cli_inner_pretty.js:534877 | function |
| `zU_` | `WATCHDOG_BACKOFF_CAP_MS` (`300000`) | cli_inner_pretty.js:535002 | constant |

## Module: LLM API — silent refusal-fallback continuation (`convolute_arcades`)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_2c` | `HDR_IS_REFUSAL_FALLBACK` (`x-is-refusal-fallback`) | cli_inner_pretty.js:121245 | constant |
| `b2c` | `HDR_FALLBACK_LATCHED_BY` | cli_inner_pretty.js:121246 | constant |
| `e6i` | `HDR_FALLBACK_FROM_MODEL` | cli_inner_pretty.js:121247 | constant |
| `hit` | `isConvoluteArcadesEnabled` (reads `Jx()[idg]`) | cli_inner_pretty.js:121073 | function |
| `idg` | `CONVOLUTE_ARCADES_FLAG_KEY` (`"convolute_arcades"`) | cli_inner_pretty.js:121244 | constant |
| `n6i` | `HDR_ORIGINAL_REQUEST_ID` | cli_inner_pretty.js:121250 | constant |
| `non` | `sweepInFlightToolsForFallback` (silent / visible lanes) | cli_inner_pretty.js:331733 | function |
| `r6i` | `HDR_FALLBACK_TRIGGER` | cli_inner_pretty.js:121249 | constant |
| `S2c` | `isConvoluteArcadesEnabledInline` (duplicate accessor) | cli_inner_pretty.js:121084 | function |
| `t6i` | `HDR_FALLBACK_CATEGORY` | cli_inner_pretty.js:121248 | constant |

## Module: LLM API — streaming and watchdogs

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `a7i` | `getStreamIdleTimeoutMs` (`max(env, 300000)`) | cli_inner_pretty.js:149792 | function |
| `As` | `armEventWatchdog` (warn + abort timers) | cli_inner_pretty.js:510152 | function |
| `c1_` | `ADVISOR_STALL_GRACE_CAP_MS` (`90000`) | cli_inner_pretty.js:512026 | constant |
| `fi` | `clearWatchdogTimers` | cli_inner_pretty.js:510126 | function |
| `fs` | `buildServerFallbackEvent` | cli_inner_pretty.js:510508 | function |
| `iZc` | `isBedrockByteWatchdogEnabled` | cli_inner_pretty.js:149946 | function |
| `ji` | `buildAbortedPartialMessage` (stamps `isAbortedMidStream`) | cli_inner_pretty.js:510491 | function |
| `kxg` | `attachByteWatchdog` (ReadableStream wrapper, suspend detect) | cli_inner_pretty.js:149809 | function |
| `l7i` | `getByteStreamIdleTimeoutMs` (provider-aware, gate-tunable) | cli_inner_pretty.js:149795 | function |
| `nZc` | `isByteWatchdogEnabled` (gate default `!0`) | cli_inner_pretty.js:149938 | function |
| `oZc` | `isWatchdogEligibleProvider` | cli_inner_pretty.js:149943 | function |
| `rZc` | `BedrockUnexpectedContentTypeError` | cli_inner_pretty.js:150097 | class |
| `tZc` | `StreamSuspendedError` | cli_inner_pretty.js:150088 | class |
| `vs` | `armStallIndicator` (advisor grace window) | cli_inner_pretty.js:510132 | function |
| `xqs` | `STALL_INDICATOR_DELAY_MS` (`20000`) | cli_inner_pretty.js:512025 | constant |

## Module: LLM API — transport error taxonomy

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Apo` | `isEffortUnsupportedError` (two-shape 400 detector) | cli_inner_pretty.js:228417 | function |
| `BZg` | `isRateLimitError` (429 or `rate_limit_error` in message) | cli_inner_pretty.js:227875 | function |
| `D7r` | `buildApiErrorDetails` (formatted + connection + rateLimits) | cli_inner_pretty.js:227988 | function |
| `dpo` | `classifyConnectionErrorCode` (code → telemetry token) | cli_inner_pretty.js:227885 | function |
| `dSe` | `isOverloaded529` (529 or `overloaded_error` in message) | cli_inner_pretty.js:227871 | function |
| `Fke` | `isOAuthTokenRevokedError` (403 + revoked message) | cli_inner_pretty.js:227868 | function |
| `Gcs` | `CERT_ERROR_CODES` (15 fail-fast certificate codes) | cli_inner_pretty.js:228017 | constant |
| `GZg` | `isNetworkDownError` (`Wie` membership) | cli_inner_pretty.js:227907 | function |
| `HN` | `unwrapConnectionDetails` (5-level `.cause` walk) | cli_inner_pretty.js:227888 | function |
| `ILu` | `extractNestedErrorMessage` | cli_inner_pretty.js:227932 | function |
| `jcs` | `extractHtmlTitle` (gateway error-page title) | cli_inner_pretty.js:227916 | function |
| `jZg` | `BUN_SOCKET_CLOSED_MESSAGE` | cli_inner_pretty.js:228014 | constant |
| `lir` | `formatApiErrorForDisplay` (8-way SSL switch) | cli_inner_pretty.js:227947 | function |
| `LLu` | `classifyStreamFailureReason` | cli_inner_pretty.js:228003 | function |
| `qie` | `API_TRANSIENT_CODES` (7 codes; was 4 in 193) | cli_inner_pretty.js:228052 | constant |
| `Qlt` | `buildSSLCertHint` (`NODE_EXTRA_CA_CERTS` fix hint) | cli_inner_pretty.js:227911 | function |
| `qZg` | `hasNestedErrorObject` | cli_inner_pretty.js:227929 | function |
| `RLu` | `inferStatusFromError` (529/429 from message shape) | cli_inner_pretty.js:227879 | function |
| `UZg` | `SSL_ERROR_CODES` (`Gcs` + 3 transient TLS codes) | cli_inner_pretty.js:228034 | constant |
| `Wie` | `NETWORK_DOWN_CODES` (10 codes; `ERR_PROXY_TUNNEL` new) | cli_inner_pretty.js:228040 | constant |
| `WZg` | `formatErrorMessageStrippingHtml` | cli_inner_pretty.js:227924 | function |

## Module: Session state — cost reset and side questions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Att | resetCostState | cli_inner_pretty.js:3114-3126 | function |
| DSi | registerSessionCostSaver | cli_inner_pretty.js:3108-3110 | function |
| eLb | btwCommandCall | cli_inner_pretty.js:661737-661748 | function |
| GEi | getLoopEnded | cli_inner_pretty.js:3623-3625 | function |
| ml | systemMessage | cli_inner_pretty.js:533218-533230 | function |
| pNr | setLoopEnded | cli_inner_pretty.js:3626-3628 | function |
| PSi | flushSessionCostToDisk | cli_inner_pretty.js:3111-3113 | function |
| W3t | getSideQuestionHistory | cli_inner_pretty.js:652811 | function |
| yn | isNonInteractive | cli_inner_pretty.js:3286-3288 | function |

## Module: State — file history and checkpoints

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `A1` | `isFileCheckpointingEnabled` | cli_inner_pretty.js:308954 | function |
| `bxy` | `deleteEvictedBackupFiles` (mark-and-sweep unlink; called at :308915) | cli_inner_pretty.js:308937 | function |
| `dCt` | `MAX_SNAPSHOTS` (`100`; 193 twin `a9a = 100` `:371076 (193)` — carryover) | cli_inner_pretty.js:24774 | constant |
| `dZu` | `debugDumpFileHistoryState` (no-op unless `Ixy`) | cli_inner_pretty.js:309642 | function |
| `Hxy` | `notifySnapshotContentChanges` (193 twin `z2p` `:371040 (193)`) | cli_inner_pretty.js:309602 | function |
| `Ldt` | `resolveBackupPath` (two validations before joining `file-history/<sessionId>/<name>`) | cli_inner_pretty.js:309258 | function |
| `Txy` | `BACKUP_FILENAME_RE` (`/^[0-9a-f]{16}@v\d+$/`) | cli_inner_pretty.js:309674 | constant |
| `UHe` | `reduceFileHistoryState` (`"track"` now writes a delta; 193 twin `gDe` `:370591 (193)`) | cli_inner_pretty.js:308856 | function |
| `Xcr` | `readFileNoFollow` (`O_NONBLOCK | O_NOFOLLOW`, null on any error) | cli_inner_pretty.js:309628 |

## Module: State — session transcript store

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_B_` | `FORK_CONTEXT_CACHE_MAX_ENTRIES` (`4`; 193 twin `Mjf = 4` `:585522 (193)` — carryover) | cli_inner_pretty.js:527423 | constant |
| `Asp` | `flushSessionStorageAtExit` (logs the degraded-writer warning at :523307) | cli_inner_pretty.js:523299 | function |
| `AVs` | `MAX_TRANSCRIPT_READ_BYTES` (`52428800`; export name at :522990) | cli_inner_pretty.js:527411 | constant |
| `bB_` | `FORK_CONTEXT_CACHE_MAX_BYTES` (`16777216`) | cli_inner_pretty.js:527424 | constant |
| `Csp` | `hydrateForkContext` (cache + in-flight coalescing; 193 twin `$jf` `:582742 (193)`) | cli_inner_pretty.js:524292 | function |
| `EB_` | `loadForkContextPrefix` (byte accounting + dual-criterion eviction) | cli_inner_pretty.js:524300 | function |
| `eCi` | `serializeEntry` (`JSON.stringify(e) + "\n"`; the fork-cache byte estimator) | cli_inner_pretty.js:19819 | function |
| `EVs` | `setTranscriptLocalGcEnabled` (export name at :522854; single caller :849846) | cli_inner_pretty.js:523003 | function |
| `fEo` | `recordFileHistorySnapshot` (193 twin `LWt` `:582774 (193)`) | cli_inner_pretty.js:524334 | function |
| `fRe` | `forkPrefixCache` (`Map<parentLastUuid, {slice, bytes}>`) | cli_inner_pretty.js:527595 | variable |
| `Hws` | `recordFileHistoryDelta` (writes `type: "file-history-delta"`) | cli_inner_pretty.js:524337 | function |
| `lxt` | `extractFieldFromLastEntryOfTypeStrict` (export name at :51300) | cli_inner_pretty.js:51379 | function |
| `nB_` | `TRANSCRIPT_GC_RETENTION_CLASS` (4-class table; `boundary-cleared` 220=7/193=0) | cli_inner_pretty.js:527551 | object |
| `oB_` | `getTranscriptGcRetentionClass` (fail-open default `"accumulate"`) | cli_inner_pretty.js:523006 | function |
| `psp` | `ENTRY_APPEND_POLICY` (export name at :522995) | cli_inner_pretty.js:527516 | object |
| `Q2o` | `forkPrefixInFlight` (promise-dedup map) | cli_inner_pretty.js:527595 | variable |
| `Rd` | `getSessionStorage` (lazily constructs `wsp`, registers the exit hooks at :523315) | cli_inner_pretty.js:523313 | function |
| `Tsp` | `OBSERVER_REF_TAIL_SCAN_BYTES` (`1048576`) | cli_inner_pretty.js:527422 | constant |
| `wsp` | `SessionStorage` (holds `planReAppendSessionMetadata` :523596, `normalizeLastPrompt` :523586) | cli_inner_pretty.js:523360 | class |
| `xVs` | `reAppendSessionMetadataAtExit` (`process.on("exit")`, registered :523315) | cli_inner_pretty.js:523292 | function |

## Module: Subagent Orchestration Limits

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_ty` | DEFAULT_MAX_WEB_SEARCHES_PER_SESSION (`200`) | cli_inner_pretty.js:231413 | constant |
| `DI` | getAgentDepth (main session → 0, else `depth ?? 0`) | cli_inner_pretty.js:111428-111431 | function |
| `Dus` | memoisedDepthFromGate (one-shot cache of the gate value) | cli_inner_pretty.js:230908 | variable |
| `FBt` | SUBAGENT_DEPTH_LIMIT (`5`) — 2.1.193 hardcoded default | cli_inner_pretty.js:229871 (193) | constant |
| `gPu` | getMaxConcurrentSubagents (`env ?? 20`) | cli_inner_pretty.js:231399-231401 | function |
| `gty` | DEFAULT_MAX_CONCURRENT_SUBAGENTS (`20`) | cli_inner_pretty.js:231411 | constant |
| `hee` | getMaxSubagentSpawnDepth (env → gate → const) | cli_inner_pretty.js:230896-230905 | function |
| `Jch` | ENV_MAX_SUBAGENTS_PER_SESSION accessor (`int{min:1,digitsOnly}`) | cli_inner_pretty.js:32640 | variable |
| `nBe` | nullTaskRegistry (all counters return 0 — caps inert) | cli_inner_pretty.js:284586-284620 | object |
| `Q7r` | getMaxSubagentsPerSession (`env ?? 200`) | cli_inner_pretty.js:231402-231404 | function |
| `Qch` | ENV_MAX_SUBAGENT_SPAWN_DEPTH accessor | cli_inner_pretty.js:32641 | variable |
| `sty` | SPAWN_DEPTH_GATE (`"tengu_hazel_trellis"`) | cli_inner_pretty.js:230907 | constant |
| `Xch` | ENV_MAX_CONCURRENT_SUBAGENTS accessor | cli_inner_pretty.js:32639 | variable |
| `yPu` | getMaxWebSearchesPerSession (`env ?? 200`) | cli_inner_pretty.js:231405-231407 | function |
| `yty` | DEFAULT_MAX_SUBAGENTS_PER_SESSION (`200`) | cli_inner_pretty.js:231412 | constant |
| `Zch` | ENV_MAX_WEB_SEARCHES_PER_SESSION accessor | cli_inner_pretty.js:32642 | variable |
| `ZDu` | DEFAULT_SPAWN_DEPTH (`3`) | cli_inner_pretty.js:230906 | constant |

## Module: Subagent Output Sanitisation (indirect prompt injection)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_pd` | sanitizeSubagentContentBlocks (maps the scrubber, prepends one marker) | cli_inner_pretty.js:345346-345361 | function |
| `bpd` | scrubInstructionShapedText (flag / neutralize / neutralize-silent) | cli_inner_pretty.js:345363-345376 | function |
| `d0o` | escapeAngleBracket (`"<"` → `"<\\"`) | cli_inner_pretty.js:345390 | function |
| `DNy` | INJECTION_MARKER_PREFIX (`"[harness: subagent output matched instruction-shaped pattern(s): "`) | cli_inner_pretty.js:345393 | constant |
| `INy` | MODEL_LAYER_TAG_PREFIX (`"antml:"`) | cli_inner_pretty.js:345389 | constant |
| `jNy` | buildApiErrorPartialRecovery (sanitised `cutoffNote`) | cli_inner_pretty.js:345891-345903 | function |
| `Kpr` | lastAssistantTextSanitized | cli_inner_pretty.js:345877-345890 | function |
| `LNy` | INJECTION_PATTERNS (10 rules: 4 escalation-pattern, 5 control-tag, 1 turn-marker) | cli_inner_pretty.js:345398-345460 | object |
| `RNy` | HARNESS_ENVELOPE_TAGS (5 tag names composed into one regex) | cli_inner_pretty.js:345397 | object |
| `Spd` | reportSubagentOutputFindings (`tengu_subagent_output_flagged`) | cli_inner_pretty.js:345378-345388 | function |
| `spd` | shouldSlimSubagentTools (gate `tengu_shale_finch`, carryover) | cli_inner_pretty.js:345462-345465 | function |
| `ypd` | buildInjectionMarker | cli_inner_pretty.js:345331-345333 | function |
| `zpr` | sanitizeSubagentText (`{sanitized, findings}`, optional marker) | cli_inner_pretty.js:345334-345345 | function |

## Module: System Prompts

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aO_` | `buildInteractiveAgentPreamble` | cli_inner_pretty.js:507542 | function |
| `cO_` | `buildSystemSection` | cli_inner_pretty.js:507555 | function |
| `Jep` | `usesMidConvSystemFraming` | cli_inner_pretty.js:508116 | variable |
| `Kep` | `AGENT_TOOL_RESTRAINT_LINES` | cli_inner_pretty.js:508111 | constant |
| `lO_` | `MID_CONV_SYSTEM_FRAMING` | cli_inner_pretty.js:508026 | constant |
| `lpd` | `SUBAGENT_ROLE_SENTENCE` | cli_inner_pretty.js:508044 | constant |
| `Qep` | `selectOutOfBandFramingSentence` | cli_inner_pretty.js:507549 | function |
| `Xep` | `buildLatestModelIdsSentence` | cli_inner_pretty.js:508104 | variable |
| `zon` | `buildSubagentPromptTail` | cli_inner_pretty.js:507925 | function |

## Module: Task Registry / Session State

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `BH` | isObserverAgent (`local_agent` with `isObserver === true`) | cli_inner_pretty.js:341639-341641 | function |
| `kcn` | clearConversation (the only spawn/web-search budget reset) | cli_inner_pretty.js:449427-449438 | function |
| `pr` | countWhere (used to count surviving agent tasks on `/clear`) | cli_inner_pretty.js:24548-24552 | function |
| `qw` | isLiveBackgroundedTask (`running`/`pending` and not foreground) | cli_inner_pretty.js:341660-341664 | function |
| `zEe` | isAgentOrWorkflowTask (`local_agent` non-observer, or `local_workflow`) | cli_inner_pretty.js:341656-341659 | function |

## Module: Core execution — structured output tool

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aPu` | STRUCTURED_OUTPUT_TOOL_CACHE (schema-identity keyed) | cli_inner_pretty.js:231147 | variable |
| `dty` | STRUCTURED_OUTPUT_SCHEMA_NODE_CAP (= `1e5`) | cli_inner_pretty.js:231148 | constant |
| `Eg` | STRUCTURED_OUTPUT_TOOL_NAME | cli_inner_pretty.js:231145 | constant |
| `fty` | compileStructuredOutputToolUncached | cli_inner_pretty.js:231103 | function |
| `pty` | STRUCTURED_OUTPUT_SCHEMA_DEPTH_CAP (= `1e4`) | cli_inner_pretty.js:231149 | constant |
| `uPu` | schemaExceedsSizeBudget | cli_inner_pretty.js:231097-231102 | function |
| `wir` | compileStructuredOutputTool (memoised) | cli_inner_pretty.js:231091-231096 | function |

## Module: Tools (WebSearch budget)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `wwd` | shouldUseWebSearchCcrProxy | cli_inner_pretty.js:403456-403460 | function |

## Module: Tools — AskUserQuestion auto-continue

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TCe | defaultAskUserQuestionTimeout | cli_inner_pretty.js:63549 | function |
| vNd | ASK_USER_QUESTION_TIMEOUTS | cli_inner_pretty.js:452190 | constant |

---

## Source documents

- [`symbol_additions_v2_1_220_llm_core.md`](symbol_additions_v2_1_220_llm_core.md)
- [`symbol_additions_v2_1_220_api_reliability.md`](symbol_additions_v2_1_220_api_reliability.md)
- [`symbol_additions_v2_1_220_headless_sdk.md`](symbol_additions_v2_1_220_headless_sdk.md)
- [`symbol_additions_v2_1_220_performance.md`](symbol_additions_v2_1_220_performance.md)
- [`symbol_additions_v2_1_220_slash_cli.md`](symbol_additions_v2_1_220_slash_cli.md)
- [`symbol_additions_v2_1_220_subagent_limits.md`](symbol_additions_v2_1_220_subagent_limits.md)
- [`symbol_additions_v2_1_220_system_prompt.md`](symbol_additions_v2_1_220_system_prompt.md)
