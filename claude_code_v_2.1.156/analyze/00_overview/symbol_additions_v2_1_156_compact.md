# Symbol Additions — Compaction (v2.1.143 → v2.1.156)

> **Home index:** `symbol_index_core_features.md` (Compact module). These rows are the consolidated
> per-module symbol additions for the v2.1.143 → v2.1.156 compaction subsystem and should be folded
> into that index's `## Module: Compact` section (which currently records "no net-new symbols").

This file consolidates every obfuscated identifier discovered across the v2.1.156 compaction
subsystems — threshold/window resolution, the per-turn autocompact dispatcher and its circuit/rapid-
refill breakers, the full (whole-conversation) summarize pipeline, the NEW reactive (group-walk)
lane, the NEW server-driven `context_hint` micro-compact, session-memory / partial (`/rewind`)
compaction, the summary-prompt builders, and the PostCompact / prompt-cache-break machinery. Rows are
deduplicated by obfuscated name (most-specific description kept) and sorted by `file:line` within each
group. Every `File:Line` is `cli_inner_pretty.js`.

**Cross-validated against:**
- v2.1.156 bundle self-check: `cli_inner_pretty.js` — each location re-read in place (threshold/window
  block 423864–424130 + 424154–424155, full/partial pipeline 422983–423810, reactive lane
  270798–272546, micro-compact 447221–447312 + 556448–556578, cache-break 269579–270069, summary
  prompts 270798–271362, PostCompact/state 2353–2546 + 451282–452614).
- v2.1.88 TypeScript reference: `/lyz/codespace/3rd/claude-code/src/services/compact/` (compact.ts,
  grouping.ts, compactWarningState.ts, postCompactCleanup.ts) + `services/api/promptCacheBreakDetection.ts` —
  used to anchor the carried-over readable names (`compactConversation`, `getEffectiveContextWindowSize`,
  `calculateTokenWarningState`, `groupMessagesByApiRound`, `MAX_OUTPUT_TOKENS_FOR_SUMMARY`,
  `MIN_CACHE_MISS_TOKENS`, etc.) and to flag which symbols are genuinely NEW in v2.1.156.
- v2.1.142 reference: `claude_code_v_2.1.142/analyze/` (reactive seed `B47`→`bv7`, partial-compact
  `_H4`→`qX4`, `/rewind` MessageSelector `Hc6`→`L4q`, boundary `jM$`→`PP$`, `ed6`→`X4q`) for the
  prior-tree readable-name lineage.

---

## Module: Compact — Threshold & Window Resolution

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `Jv$` | `getCompactThreshold` | cli_inner_pretty.js:423864-423868 | function | `effectiveWindow − 13000` (`AUTOCOMPACT_BUFFER_TOKENS`); `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` (`testPctOverride`) lowers it via `floor(eff*pct/100)` capped by base. The 'compact' band boundary. v2.1.88 `getAutoCompactThreshold`. |
| `YX4` | `getPrecomputeThreshold` | cli_inner_pretty.js:423870-423872 | function | `min(eff − round(eff*precomputeBufferFraction[0.2]), autocompactThreshold)` — earlier speculative-precompute trigger / proactive-work gate. NEW in v2.1.156. |
| `fX4` | `classifyTokenLevel` | cli_inner_pretty.js:423873-423884 | function | Banded classifier returning `{level: ok\|warn\|compact\|blocked, pctLeft}`; `warn=threshold−20000`, `blocked=blockingBase−3000`; `ok` omits `pctLeft`. Refactor replacing v2.1.88's four booleans (`calculateTokenWarningState`). |
| `zX4` | `AUTOCOMPACT_BUFFER_TOKENS` | cli_inner_pretty.js:423885 | constant | `13000` — buffer subtracted from the effective window for the autocompact threshold. |
| `AX4` | `MANUAL_COMPACT_BUFFER_TOKENS` | cli_inner_pretty.js:423886 | constant | `3000` — buffer subtracted from the blocking base for the hard blocking limit. |
| `qc6` | `DEFAULT_PRECOMPUTE_BUFFER_FRACTION` | cli_inner_pretty.js:423887 | constant | `0.2` — default precompute buffer fraction (`tengu_amber_rokovoko` override). NEW vs v2.1.88. |
| `Ac6` | `parseWindowString` | cli_inner_pretty.js:423889 | function | Parses `'auto'`/`Nm`/`Nk`/`N` window strings, `[100,1000]`-as-thousands shorthand, clamps to `[zc6=1e5 .. jX4=1e6]`, else `undefined`. |
| `Pc` | `isRedwood3Enabled` | cli_inner_pretty.js:423902-423905 | function | GrowthBook `tengu_amber_redwood3` reactive-mode gate; `false` when non-interactive (`R6`). Part of `eb_`'s local-mode gate. |
| `wX4` | `getExperimentWindowForModel` | cli_inner_pretty.js:423906-423914 | function | Opus-4.8-only autocompact window override via `tengu_amber_redwood2` (parsed by `Ac6`); requires enabled + interactive. Source `'experiment'` in `Xl`. |
| `Xl` | `resolveAutoCompactWindow` | cli_inner_pretty.js:423915-423930 | function | 4-source window resolver (env > settings > experiment > default table `ob_` = `'auto'`); returns `{window, configured, source}`. |
| `EH$` | `isWindowConfiguredByEnvOrSettings` | cli_inner_pretty.js:423931-423934 | function | True iff `Xl().source` is `'env'` or `'settings'` (user explicitly configured); used in `eb_`'s local-mode gate. |
| `ab_` | `getAutoCompactWindowSource` | cli_inner_pretty.js:423935-423937 | function | Returns just the `.source` field (`env`/`settings`/`experiment`/`auto`) from `Xl` — the `thresholdSource` that gates reactive routing in `DX4`. |
| `_qH` | `getEffectiveWindow` | cli_inner_pretty.js:423938-423943 | function | `resolvedWindow − min(maxOutputTokens, MX4=20000)`; only passes the settings window when autocompact is enabled. v2.1.88 `getEffectiveContextWindowSize`. |
| `sb_` | `getEffectiveContextWindowSizeRaw` | cli_inner_pretty.js:423944 | function | Effective window using the raw model cap `Ov` (ignores env/settings/experiment); used as the blocking-limit base. |
| `tb_` | `getPrecomputeBufferFraction` | cli_inner_pretty.js:423954 | function | `tengu_amber_rokovoko` numeric override for the precompute fraction, validated `[0,1)`, default `qc6=0.2`. |
| `jc6` | `getThresholdOverrides` | cli_inner_pretty.js:423958 | function | Reads `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` + `CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE`; returns `{enabled, precomputeBufferFraction, testPctOverride, testBlockingOverride}`. |
| `DU6` | `getAutoCompactThreshold` | cli_inner_pretty.js:423968-423970 | function | `Jv$(_qH(model,settings), jc6())` — public autocompact threshold stamped into `recompactionInfo` for telemetry. v2.1.88 `getAutoCompactThreshold`. |
| `WRH` | `classifyTokenLevelForWindow` | cli_inner_pretty.js:423971-423975 | function | Public wrapper: `fX4(tokens, _qH(model, enabled?settings:undefined), jc6(), sb_(model))` — uses the raw-cap blocking base. |
| `tv7` | `isAbovePrecomputeOrCompact` | cli_inner_pretty.js:423976 | function | True if `tokens >= (precompute threshold when not redwood3/configured, else autocompact threshold)`. |
| `MX4` | `MAX_OUTPUT_TOKENS_FOR_SUMMARY` | cli_inner_pretty.js:424124 | constant | `20000` — summary output reserve subtracted from the window to get the effective window. v2.1.88 same. |
| `zc6` | `WINDOW_MIN` | cli_inner_pretty.js:424125 | constant | `1e5` (100k) — lower clamp/floor for parsed/env/configured windows. |
| `jX4` | `WINDOW_MAX` | cli_inner_pretty.js:424126 | constant | `1e6` (1M) — upper clamp/ceiling for parsed/env/configured windows. |
| `ob_` | `AUTO_WINDOW_TABLE` | cli_inner_pretty.js:424154 | object | Per-model auto-window override table; initialized to empty `{}` so `'auto'` always falls back to the model hard cap. |
| `DZ` | `has1mContextSuffix` | cli_inner_pretty.js:130132 | function | Regex `/\[1m\]/i` model-id detection (unless `CLAUDE_CODE_DISABLE_1M_CONTEXT`). |
| `Ov` | `getContextWindowForModel` | cli_inner_pretty.js:130165 | function | Model hard-cap context window; `MAX_CONTEXT_TOKENS` only honored when `DISABLE_COMPACT` truthy; 1M for `[1m]`/Opus-4.7–4.8 first-party. |
| `P36` | `MODEL_CONTEXT_WINDOW_DEFAULT` | cli_inner_pretty.js:130223 | constant | `200000` — default model context window. |
| `NO$` | `COMPACT_MAX_OUTPUT_TOKENS` | cli_inner_pretty.js:130224 | constant | `20000` — cap on summary output tokens (min'd with model max). Also `MAX_COMPACT_OUTPUT_TOKENS`. |
| `xH` | `isEnvTruthy` | cli_inner_pretty.js:1795-1800 | function | Env truthiness check (`1`/`true`/`yes`/`on`). v2.1.88 same. |
| `R6` | `isNonInteractive` | cli_inner_pretty.js:2742 | function | Returns `!isInteractive`; gates redwood2/redwood3 experiments to interactive sessions only. |
| `t$` | `logFeatureSad` | cli_inner_pretty.js:41596-41598 | function | Emits `tengu_feature_sad{feature_name,error_code,...}`; used by the rapid-refill breaker with `('compact_auto','compact_auto_rapid_refill_breaker')`. |
| `N` | `logForDebugging` | cli_inner_pretty.js:10156+ | function | Debug/warn logger. v2.1.88 same. |
| `Q1` | `getConfigValue` | cli_inner_pretty.js:148182+ | function | Layered config reader used by `isAutoCompactEnabled` to read the `autoCompactEnabled` setting. |
| `n$H` | `validateEnvInt` | cli_inner_pretty.js:220968 | function | Validates an env int with default/upper bounds; returns `{effective, status: valid\|invalid\|capped}` (absent → default is `valid`). |
| `gE4` | `PERCENT_USED_UI_GATE` | cli_inner_pretty.js:467444 | constant | `80` — percent-used threshold; the 'Autocompact is disabled' nudge shows only between 50% and 80%. |
| `go_` | `autocompactDisabledNudge` | cli_inner_pretty.js:467432 | function | Pushes an info banner titled 'Autocompact is disabled' when autocompact is off and `50% <= percentage < gE4(80)`. |
| `E5H` | `getMaxOutputTokensForModel` | cli_inner_pretty.js:558279 | function | Model output-token default/upper clamped by `CLAUDE_CODE_MAX_OUTPUT_TOKENS`. |

## Module: Compact — Autocompact Dispatcher & Breakers

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `Pc5` | (see Cache group) | — | — | (cross-ref) |
| `fc6` | `computeRapidRefillStreak` | cli_inner_pretty.js:423948-423950 | function | Rapid-refill counter: `+1` if prev turn compacted and `turnCounter < Yc6(3)`, else resets to `0`. NEW in v2.1.156 (no v2.1.88 equivalent). |
| `Mc6` | `isColdCompact` | cli_inner_pretty.js:423951-423953 | function | Returns `isEnvTruthy(CLAUDE_CODE_COLD_COMPACT)`; plumbed into local compaction `_eH` as the cold-compact flag. NEW in v2.1.156. |
| `J0` | `isAutoCompactEnabled` | cli_inner_pretty.js:423983-423987 | function | False if `DISABLE_COMPACT` / `DISABLE_AUTO_COMPACT` truthy, else the `autoCompactEnabled` config (default true). Matches v2.1.88. |
| `_JH` | `isNotRemote` | cli_inner_pretty.js:423988-423990 | function | Returns `!isEnvTruthy(CLAUDE_CODE_REMOTE)` — "are we local"; gates the proactive-autocompact suppression branch in `eb_` (reactive gated off remote). NEW gate in v2.1.156. |
| `eb_` | `shouldAutoCompact` | cli_inner_pretty.js:423991-424001 | function | Pre-flight loop predicate: false for querySource `'compact'`, disabled compaction, or remote-non-overridden; else true when token level is `'compact'`/`'blocked'`. Suppresses proactive when local & not redwood3 & not configured. |
| `DX4` | `autoCompactGenerator` | cli_inner_pretty.js:424002-424093 | function | Async-generator per-turn autocompact dispatcher with circuit breaker (`_c6=3` failures) + rapid-refill breaker (`Y08=3`); v2.1.156 reactive-routing fork routes to `lA8` when `thresholdSource!=='auto'`, else full `_eH`. Yields events via `Xv$`; returns result + `routedThroughReactive`. v2.1.88 `autoCompactIfNeeded`. |
| `Hx_` | `computeAutoModeHintText` | cli_inner_pretty.js:424095-424102 | function | Spinner hint 'Compacting at auto window (N tokens) · /autocompact to configure' when the window came from an experiment below the model default; else null. NEW in v2.1.156. |
| `Xv$` | `pumpCompactEvents` | cli_inner_pretty.js:424103-424123 | function | Generator adapter: runs an async compaction fn while forwarding `onCompactEvent`/notify callbacks as yielded events through an `ad()` queue, then yields the final return value. |
| `_c6` | `MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES` | cli_inner_pretty.js:424128 | constant | `3` — circuit-breaker trip threshold for both proactive and reactive paths. Same value/intent as v2.1.88. |
| `Yc6` | `RAPID_REFILL_TURN_WINDOW` | cli_inner_pretty.js:424129 | constant | `3` — a refill counts as 'rapid' if `turnCounter < 3` since the prior compact. NEW in v2.1.156. |
| `Y08` | `MAX_CONSECUTIVE_RAPID_REFILLS` | cli_inner_pretty.js:424130 | constant | `3` — the rapid-refill ('thrash') breaker trips after 3 consecutive rapid refills. NEW in v2.1.156. |
| `Oc6` | `THRASHING_USER_MESSAGE` | cli_inner_pretty.js:424155 | constant | User-facing 'Autocompact is thrashing…' message shown when the rapid-refill breaker trips. NEW in v2.1.156. |
| `d` | `logEvent` | cli_inner_pretty.js:3374+ | function | Telemetry sink for `tengu_auto_compact_circuit_breaker`, `tengu_auto_compact_routed_reactive`, `tengu_auto_compact_rapid_refill_breaker`, `tengu_post_autocompact_turn`, `tengu_auto_compact_succeeded`. |

## Module: Compact — Full (Whole-Conversation) Pipeline

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `wN6` | `stripMediaToPlaceholders` | cli_inner_pretty.js:422983-423007 | function | Replaces image/document blocks (incl. nested in tool_result) with `[image]`/`[document]` text markers before summarization; also used for the `media_too_large` stripped retry. |
| `db_` | `stripQueuedOnlyAttachments` | cli_inner_pretty.js:423011 | function | `stripNonEssential` helper: drops attachment messages except `queued_command`. Part of the NEW v2.1.156 `stripNonEssential` lane. |
| `cb_` | `truncateToolPayloads` | cli_inner_pretty.js:423040 | function | `stripNonEssential` helper: truncates tool_use inputs and tool_result content to `oJ4=100` chars and drops cache-control blocks (`wv$`). |
| `$X4` | `sliceForPromptTooLong` | cli_inner_pretty.js:423077-423092 | function | PTL recovery: groups by API round (`riH`), drops oldest groups to cover the token gap (or 20% fallback), prepends synthetic meta marker `aJ4` when the first kept msg is assistant; returns null when nothing droppable. Shared by `_eH` and `qX4`. |
| `A08` | `throwIfBlockedByPreCompactHook` | cli_inner_pretty.js:423093 | function | If a PreCompact hook returned `blockedBy`, logs warning + optional notification (suppressed for auto) and throws `PzH('Compaction blocked by PreCompact hook: …')`. |
| `h5H` | `assembleCompactedMessages` | cli_inner_pretty.js:423104-423106 | function | `[boundaryMarker, ...summaryMessages, ...messagesToKeep, ...attachments, ...hookResults]` — the suffix-preserving final array. |
| `xN6` | `annotateBoundaryWithPreservedSegment` | cli_inner_pretty.js:423110-423121 | function | Augments the boundary marker with `preservedSegment{headUuid,anchorUuid,tailUuid}` + `preservedMessages` — metadata for resume rehydration of the kept newest groups. |
| `$c6` | `mergeHookInstructions` | cli_inner_pretty.js:423123 | function | Merges user `customInstructions` (first) with PreCompact-hook instructions (appended, blank-line separated); empty → `undefined`. |
| `_eH` | `compactConversationFull` | cli_inner_pretty.js:423130+ | function | The full/proactive (whole-conversation) compaction pipeline: one summary of all messages, `messagesToKeep:[]`, front-dropping PTL retry (`$X4`) capped at `HX4=3`; receives `recompactionInfo`, coldCompact flag, spinnerHint. v2.1.88 `compactConversation`. |
| `qX4` | `partialCompact` | cli_inner_pretty.js:423340-423509 | function | Direction-aware partial compactor (`'from'`/`'up_to'`) for `/rewind summarize`; slices around `selectedIndex`, builds the direction prompt (`Cv7`), runs shared API call (`_X4`) with PTL retry, emits boundary + summary + keep. v2.1.142 `_H4`. |
| `KX4` | `addErrorNotificationIfNeeded` | cli_inner_pretty.js:423510 | function | Shows 'Error compacting conversation' notification unless the error is abort (`GC`), not-enough-messages (`kH$`), or PreCompact-block (`KeH`). |
| `DN6` | `createCompactCanUseTool` | cli_inner_pretty.js:423532 | function | Returns a `CanUseTool` that DENIES every tool ('Tool use is not allowed during compaction') so the summarizer can only emit text. |
| `_X4` | `runCompactionSummarization` | cli_inner_pretty.js:423539 | function | The summarize-LLM call: cache-sharing forked-agent fast path (`runForkedAgent`) with streaming fallback; denies all tools, thinking disabled, `maxOutputTokens=min(20000, model max)`. NO streaming-retry (removed vs v2.1.88). Shared by full (`_eH`) + partial (`qX4`). |
| `xZ` | `runForkedAgent` | cli_inner_pretty.js:423562 | function | Forked single-turn agent reusing the main thread's cache prefix; the cache-sharing summarize path. |
| `rA8` | `createPostCompactFileAttachments` | cli_inner_pretty.js:423684 | function | Re-injects up to `iA8=5` most-recent read files within a `pb_=50000`-token budget (`Ub_=5000`/file), skipping plan/memory files and dedup stubs. |
| `oA8` | `createPlanAttachmentIfNeeded` | cli_inner_pretty.js:423711 | function | Plan-file reference attachment when a plan exists. |
| `aA8` | `createSkillAttachmentIfNeeded` | cli_inner_pretty.js:423717 | function | Re-injects invoked-skill content (`Qb_=25000` budget, `Fb_=5000`/skill, head-truncated via `ib_` + `sJ4` marker). |
| `sA8` | `createPlanModeAttachmentIfNeeded` | cli_inner_pretty.js:423732 | function | `plan_mode` attachment when in plan mode so the model stays in plan mode post-compact. |
| `tA8` | `createAsyncAgentAttachmentsIfNeeded` | cli_inner_pretty.js:423746 | function | `task_status` attachments for running / finished-unretrieved local agents. |
| `iiH` | `logPermissionContextForAnts` | cli_inner_pretty.js:270731 | function | No-op stub in this build; called with `(toolPermissionContext,'summary')`. |
| `kH$` | `ERROR_MESSAGE_NOT_ENOUGH_MESSAGES` | cli_inner_pretty.js:423805 | constant | `'Not enough messages to compact.'` |
| `HX4` | `MAX_PTL_RETRIES` | cli_inner_pretty.js:423806 | constant | `3` — max prompt-too-long head-truncation retries in the full/partial compaction loop. |
| `aJ4` | `TRUNCATION_RETRY_MARKER` | cli_inner_pretty.js:423807 | constant | `'[earlier conversation truncated for compaction retry]'` — synthetic meta user message prepended by `$X4` and stripped on the next retry iteration. |
| `z08` | `CONVERSATION_TOO_LONG_MSG` | cli_inner_pretty.js:423808 | constant | User-facing error when PTL retries are exhausted: 'Conversation too long. Press esc twice to go up a few messages and try again.' |
| `GC` | `ERROR_MESSAGE_USER_ABORT` | cli_inner_pretty.js:423809 | constant | `'API Error: Request was aborted.'` Matches v2.1.88; early-returns / suppresses notifications. |
| `KeH` | `ERROR_MESSAGE_PRECOMPACT_BLOCKED` | cli_inner_pretty.js:423810 | constant | `'Compaction blocked by PreCompact hook'` — prefix of the `PzH` thrown by `A08`; suppressed in `KX4`. NEW in v2.1.156. |
| `NH$` | `ERROR_MESSAGE_INCOMPLETE_RESPONSE` | cli_inner_pretty.js:423811 | constant | 'Compaction interrupted · This may be due to network issues — please try again.' Thrown by `_X4` streaming fallback (no streaming-retry in v2.1.156). |
| `PzH` | `PreCompactBlockedError` | cli_inner_pretty.js:423862 | class | Error subclass thrown by `A08` when a PreCompact hook blocks compaction. NEW in v2.1.156. |
| `iA8` | `POST_COMPACT_MAX_FILES_TO_RESTORE` | cli_inner_pretty.js:423799 | constant | `5`. |
| `pb_` | `POST_COMPACT_TOKEN_BUDGET` | cli_inner_pretty.js:423800 | constant | `50000`. |
| `Ub_` | `POST_COMPACT_MAX_TOKENS_PER_FILE` | cli_inner_pretty.js:423801 | constant | `5000`. |
| `Fb_` | `POST_COMPACT_MAX_TOKENS_PER_SKILL` | cli_inner_pretty.js:423802 | constant | `5000`. |
| `Qb_` | `POST_COMPACT_SKILLS_TOKEN_BUDGET` | cli_inner_pretty.js:423803 | constant | `25000`. |
| `oJ4` | `STRIP_TOOL_PAYLOAD_CHAR_LIMIT` | cli_inner_pretty.js:423804 | constant | `100` — char cap for tool inputs/results under `stripNonEssential` (`cb_`). |
| `VK` | `createAttachmentMessage` | cli_inner_pretty.js:413715 | function | Wraps an attachment payload into an attachment message for post-compact re-injection. |
| `T8` | `createUserMessage` | cli_inner_pretty.js:443846 | function | Builds a user message; used for the summary-request and the summary user-message. |
| `PP$` | `createCompactBoundaryMessage` | cli_inner_pretty.js:445985-445997 | function | Builds the `system/compact_boundary` marker with `compactMetadata{trigger, preTokens, postTokens, preCompactDiscoveredTools, …}` + `logicalParentUuid` relink anchor. v2.1.142 `jM$`. |
| `PJ` | `isCompactBoundaryMessage` | cli_inner_pretty.js:446011-446013 | function | True for `system/compact_boundary` messages. |
| `nf` | `sliceFromLastCompactBoundary` | cli_inner_pretty.js:446021-446024 | function | Returns messages from the last compact boundary onward (the active context window), or the whole array if none. |
| `qU` | `getAssistantMessageText` | cli_inner_pretty.js:444999 | function | Joins all text blocks of an assistant message, trimmed; null if none. |

## Module: Compact — Reactive (Group-Walk) Lane

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `uc5` | `runReactiveCompactSummarize` | cli_inner_pretty.js:271156-271219 | function | Reactive-lane single summarize attempt (always forked, forkLabel `'reactive-compact'`, maxTurns 1, `maxOutputTokens min(NO$=20000, model)`); builds prompt via `bA8`, extracts via `CA8`, wraps via `jP$` (suppress=true); classifies into `ok`/`prompt_too_long`(tokenGap via `ucH`)/`media_too_large`/`error`/`aborted`. |
| `bv7` | `seedPreservedCount` | cli_inner_pretty.js:271220-271226 | function | Greedy backward token-accumulation: counts trailing group token-sums needed to cover a gap, with a halving safety floor `max(1, floor(window/2))`; falls back to half the groups when the gap can't be covered. Identical to v2.1.142 `B47`. |
| `mc5` | `reactiveCompactStepSelector` | cli_inner_pretty.js:271227-271230 | function | PTL-retry step sizer: `{mode:'gap_guided', step:bv7(...)}` when a tokenGap was parsed, else `{mode:'gap_unparseable', step:1}`. Consumed by `xA8` @271314. |
| `xA8` | `iterateReactiveGroupWalk` | cli_inner_pretty.js:271231-271323 | function | Core group-walk: filters progress, groups by API round (`riH`), optionally seeds `groupsPreserved` from `initialTokenGap`, then loops summarizing oldest groups / preserving newest, widening the preserve window on PTL via `mc5`. v2.1.156 carries `forkAssistantMessageCount` out of the walk. |
| `lA8` | `runReactiveCompact` | cli_inner_pretty.js:272213-272331 | function | Reactive-lane orchestrator: gates (272228), fires `tengu_reactive_compact_triggered`, picks precomputed (`sv7`) vs live summarize, runs PreCompact hook, emits compact_progress/sdk_status events, returns `{result, hookBlocked}`. Target of reactive routing + 413 recovery. Reactive compaction existed in v2.1.88 as a feature(REACTIVE_COMPACT)-gated, ant-only module (DCE'd from external builds); the dispatcher-level reactive ROUTING fork is what is NEW in v2.1.156. |
| `bN6` | `reactiveCompactSummarizeAndFinalize` | cli_inner_pretty.js:272332-272375 | function | Runs the group-walk (`xA8`) with `{customInstructions, initialTokenGap}`; on failure fires `tengu_reactive_compact_failed`; on success delegates to `nA8` to finalize. |
| `nA8` | `finalizeReactiveCompact` | cli_inner_pretty.js:272376-272464 | function | Post-walk finalize: clears readFileState/memory, builds boundary marker (`PP$`/`xN6`), restores attachments, runs PostCompact + SessionStart hooks, computes postTokens via `h5H`/`sT`, fires `tengu_reactive_compact_succeeded`. |
| `_l5` | `resolvePreservedSegment` | cli_inner_pretty.js:272526-272534 | function | On resume, resolves a boundary's `preservedMessages` uuids back to live message objects and the `anchorUuid`. |
| `S5H` | `reinsertPreservedSegmentAtAnchor` | cli_inner_pretty.js:272535-272546 | function | On resume, removes preserved messages from their loaded positions and re-pushes them at the boundary whose uuid matches `anchorUuid`. |
| `sv7` | `precomputeReactiveCompact` | cli_inner_pretty.js:451742 | function | Speculative precompute of a reactive compact result during the PTL wait; produces the `{outcome, swap, emittedEarlyCompactStart}` consumed by `lA8`'s precomputed fast-path. |
| `S1H` | `isPromptTooLongError` | cli_inner_pretty.js:186330-186335 | function | True if a message is an `isApiErrorMessage` whose first text block starts with `Rd` ('Prompt is too long'); the PTL detector used by `ucH` (distinct from `lN`'s `EZ` check). |
| `kP6` | `parsePTLNumbers` | cli_inner_pretty.js:186336-186339 | function | Regex `/prompt is too long[^0-9]*(\d+) tokens > (\d+)/i` → `{actualTokens, limitTokens}`; backing parser for `ucH`. |
| `ucH` | `extractPTLTokenGap` | cli_inner_pretty.js:186340-186346 | function | Returns `actualTokens − limitTokens` (the overflow) from a PTL error message if positive, else undefined; source of `initialTokenGap`. Depends on `S1H` to confirm the message is a PTL error. |
| `lN` | `startsWithApiErrorPrefix` | cli_inner_pretty.js:186327 | function | True if a string starts with the API-error prefix `EZ='API Error'` (or the 'Please run /login · API Error' login-required variant). Distinct from `S1H`. |
| `EZ` | `API_ERROR_PREFIX` | cli_inner_pretty.js:186901 | constant | `'API Error'` — prefix tested by `lN`. |
| `Rd` | `PROMPT_TOO_LONG_PREFIX` | cli_inner_pretty.js:186902 | constant | `'Prompt is too long'` — sentinel the full-compact loop checks (`!I?.startsWith(Rd)`) and `S1H` tests. |
| `V$` | `getFeatureValue` | cli_inner_pretty.js:423153 | function | GrowthBook feature read; `'tengu_compact_cache_prefix'` defaults true (the cache-prefix gate). Call site @423153. |

## Module: Compact — Micro-Compact (context_hint)

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `k76` | `CONTEXT_HINT_BETA` | cli_inner_pretty.js:98137 | constant | anthropic beta object `KX('context_hint','context-hint-2026-04-09')` — header negotiating server-driven tool-result clearing. NEW in v2.1.156. |
| `gwH` | `writeToolResultToDisk` | cli_inner_pretty.js:221617-221633 | function | Persists tool_result content to the session tool-results dir (writeExclusive); returns `{filepath, originalSize, isJson, preview, hasMore}` or `{error}`. Refuses non-text array content. |
| `AnH` | `PERSISTED_OUTPUT_OPEN_TAG` | cli_inner_pretty.js:221913 | constant | `'<persisted-output>'` open tag used to build the pointer string in `vLz`. |
| `$06` | `PERSISTED_OUTPUT_CLOSE_TAG` | cli_inner_pretty.js:221914 | constant | `'</persisted-output>'` closing tag. |
| `Lg_` | `tokenEstimateOfToolResult` | cli_inner_pretty.js:447221-447229 | function | Estimates a tool_result's tokens: string/text via the token estimator; image/document charged `Jg_=2000` each. |
| `Pg_` | `collectCompactableToolUseIds` | cli_inner_pretty.js:447230-447237 | function | Walks assistant messages; returns ids of tool_use blocks whose name ∈ `Xg_`, in chronological encounter order. |
| `q04` | `collectClearedReadFilePaths` | cli_inner_pretty.js:447238-447249 | function | For cleared Read tool_uses, extracts `input.file_path` so the caller can evict them from readFileState (forces fresh re-read after clearing). No v2.1.88 analog. |
| `Wg_` | `isAlreadyClearedContent` | cli_inner_pretty.js:447250-447252 | function | True if content `=== Gi6` placeholder OR `startsWith Dg_` (`'<persisted-output>'`). The idempotency predicate preventing re-clearing/double-counting. |
| `Vi6` | `computeKeepClearSets` | cli_inner_pretty.js:447253-447267 | function | Pure candidate selection: partitions compactable tool_use IDs into keep(last N)/clear(rest), scans user tool_result blocks; returns `{clearSet, keepSet, tokensSaved, candidates}`. Descendant of the v2.1.88 inline `maybeTimeBasedMicrocompact` body. |
| `Zk$` | `applyClearingToMessages` | cli_inner_pretty.js:447268-447281 | function | In-place `.content` substitution for targeted tool_result blocks (persisted pointer or `Gi6` placeholder) with maximal structural sharing + apply-side idempotency. |
| `K04` | `applyKeepRecentMicrocompact` | cli_inner_pretty.js:447282-447307 | function | Orchestrator: gates on `Ti6=20000`, persists candidate content via `config.persist`, applies `Zk$`, emits `tengu_time_based_microcompact{trigger:'context_hint'}`, returns `{messages, tokensSaved, clearedIds, clearedContent}`. |
| `Gi6` | `CLEARED_PLACEHOLDER` | cli_inner_pretty.js:447308 | constant | `'[Old tool result content cleared]'` — fixed replacement when content is not/cannot be persisted. |
| `Dg_` | `PERSISTED_OUTPUT_TAG` | cli_inner_pretty.js:447309 | constant | `'<persisted-output>'` — prefix marking a tool_result spilled to disk; used by `Wg_` to detect already-cleared blocks. |
| `Ti6` | `MIN_TOKENS_SAVED_TO_FIRE` | cli_inner_pretty.js:447310 | constant | `20000` — minimum reclaimable tokens before micro-compact fires (447284) and before the context_hint beta is advertised (556547). NEW in v2.1.156. |
| `Jg_` | `IMAGE_MAX_TOKEN_SIZE` | cli_inner_pretty.js:447311 | constant | `2000` — per-image/document token charge in `Lg_`. |
| `Xg_` | `COMPACTABLE_TOOLS` | cli_inner_pretty.js:447312,447329 | constant | `Set([Read, ...shell, Grep, Glob, WebSearch, WebFetch, Edit, Write])` — only these tools' results are clearable. Declared 447312, assigned `new Set([HK,...iT,s1,S_,ux,WX,l7,B9])` @447329. |
| `X69` | `isContextHintEnabled` | cli_inner_pretty.js:556448-556450 | function | Reads GrowthBook flag `tengu_hazel_osprey` (default false) — master switch for the context_hint micro-compact path. Readable name inferred from behavior. |
| `L69` | `getContextHintFloor` | cli_inner_pretty.js:556451-556453 | function | Reads `tengu_hazel_osprey_floor` (default `VLz=75000`) — sent as `target_tokens_saved` in the request body when > 0. |
| `P69` | `isContextHintRejectError` | cli_inner_pretty.js:556454-556456 | function | HTTP status 422 or 424 → the server's 'prompt too big / apply context hint' rejection that triggers micro-compact + retry. |
| `W69` | `isStreamingInvalidRequestError` | cli_inner_pretty.js:556457-556461 | function | Streaming error with no HTTP status whose `error.type==='invalid_request_error'` → SSE-time context-hint trigger (fallback cause `'context_hint_sse'`, set @557799). |
| `Z69` | `isConflict409` | cli_inner_pretty.js:556462-556464 | function | HTTP 409 → busy fallback (give up the hint for this attempt). |
| `G69` | `isUnknownBeta400` | cli_inner_pretty.js:556465-556470 | function | HTTP 400 with message containing 'Unexpected value' and 'anthropic-beta' → server doesn't support the beta; abandon hint, return messages unchanged. |
| `V69` | `logContextHintReject` | cli_inner_pretty.js:556475-556484 | function | Emits `tengu_context_hint_reject {requestId, preCompactTokenEstimate, postCompactTokenEstimate, tokensSaved, mcApplied, mcTokensSaved}`. |
| `KS8` | `logContextHintBusyFallback` | cli_inner_pretty.js:556485-556487 | function | Emits `tengu_context_hint_busy_fallback {requestId, status}` for 400/409/529 give-up paths (529 via injected `H.is529Error`). |
| `VLz` | `DEFAULT_CONTEXT_HINT_FLOOR` | cli_inner_pretty.js:556488 | constant | `75000` — default `target_tokens_saved` floor advertised to the server. |
| `vLz` | `persistToolResult` | cli_inner_pretty.js:556496-556502 | function | The persist callback passed to `K04`: writes via `gwH`, returns `'<persisted-output>Tool result saved to: <path>\n\nUse Read to view</persisted-output>'` pointer, or null on failure (caller falls back to `Gi6`). |
| `y69` | `applyHintEdits` | cli_inner_pretty.js:556503-556519 | function | Runs `K04` over messages, measures pre/post token estimates; returns `{messages, clearedIds, clearedContent, mcApplied, mcTokensSaved, preCompactTokenEstimate, postCompactTokenEstimate}`. |
| `tKq` | `handleHintReject` | cli_inner_pretty.js:556520-556534 | function | Calls `y69`, fires `SH('compact_hint_reject')` + `tengu_context_hint_reject` (`V69`); returns `{messages, clearedIds, clearedContent}`. |
| `kLz` | `createContextHintController` | cli_inner_pretty.js:556535-556577 | function | Stateful per-request controller driving the reactive context_hint micro-compact: buildRequestParams/onRequestError/classifyStreamError/onStreamFallback/strip. Advertises beta when `Vi6>=Ti6`, runs micro-compact + retry on 422/424/SSE-invalid-request. NEW in v2.1.156; constructed in loop @557072. |
| `k69` | `KEEP_RECENT` | cli_inner_pretty.js:556578 | constant | `5` — number of most-recent compactable tool results to keep. Matches v2.1.88 `TIME_BASED_MC_CONFIG_DEFAULTS.keepRecent`. |
| `LEH` | `suppressCompactWarning` | cli_inner_pretty.js:271340-271342 | function | Sets the global 'compact warning suppressed' flag (`wP$`) after a successful micro-compact/compaction to hide the 'context left until autocompact' hint until real token counts return. v2.1.88 same. |
| `Jv7` | `notifyCacheDeletion` | cli_inner_pretty.js:270029-270033 | function | Sets `cacheDeletionsPending=true` (cowork: `Jc()` && signal) so a cached-microcompact `cache_edits` deletion's expected cache-read drop is not flagged. v2.1.88 `notifyCacheDeletion`. |

## Module: Compact — Session-Memory / Partial (/rewind)

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `X4q` | `isSummarizeAction` | cli_inner_pretty.js:572787-572789 | function | Predicate: true for menu value `'summarize'` or `'summarize_up_to'`. v2.1.142 `ed6`. |
| `L4q` | `MessageSelector` | cli_inner_pretty.js:572790-573143 | function | The `/rewind` menu React component (exported `MessageSelector`); hosts the summarize-from/up_to actions. v2.1.142 `Hc6`. |
| `$H` | `handleRewindAction` | cli_inner_pretty.js:572886-572938 | function | MessageSelector inner action handler; maps menu value to direction (`'up_to'` vs `'from'`), reads per-direction context input, calls `onSummarize`. v2.1.142 `qH`. |
| `BZz` | `summarizeOptionDescription` | cli_inner_pretty.js:573144-573157 | function | Returns status text per action; the `'summarize_up_to'` case explains the cursor stays at the end. v2.1.142 `lF5`. |
| `wq$` | `selectableUserMessagesFilter` | cli_inner_pretty.js:573398-573416 | function | Filters to user messages eligible for rewind selection (excludes tool_result-first, meta, compact-summary, transcript-only, tagged-context). Exported `selectableUserMessagesFilter`. |
| `P4q` | `messagesAfterAreOnlySynthetic` | cli_inner_pretty.js:573417-573437 | function | True if every message after a given index is synthetic/meta/non-substantive. Exported `messagesAfterAreOnlySynthetic`. |
| `onSummarize (inline)` | `rewindOnSummarize` | cli_inner_pretty.js:630874-630942 | function | REPL callback wired to `MessageSelector.onSummarize`; builds context, calls `qX4`, splices result by direction into chat history, re-primes input for `'from'`. |

## Module: Compact — Summary Prompts & Token Counting

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `IA8` | `findSummaryAssistantMessage` | cli_inner_pretty.js:270798-270804 | function | `findLast` assistant text message containing `<summary>`, else `findLast` any non-error assistant text message. |
| `CA8` | `extractSummaryText` | cli_inner_pretty.js:270805-270811 | function | Returns the trimmed text of the first text block of `IA8`'s result, or null. Used by the reactive path @271204. |
| `riH` | `groupMessagesByApiRound` | cli_inner_pretty.js:270812-270823 | function | Groups messages into assistant-turn-delimited API-round groups (boundary fires on a new assistant `message.id`); used by `$X4` and reactive `xA8`. Matches v2.1.88 grouping.ts exactly. |
| `Cv7` | `buildPartialCompactPrompt` | cli_inner_pretty.js:270824-270916 | function | Direction dispatcher for partial/range compact: `up_to` → inline continuation template @270835 (Work Completed / Context for Continuing Work); `from` → `bc5`. Appends user instructions + `Iv7`. v2.1.88 `getPartialCompactPrompt`. Called by `qX4` @423373. |
| `bA8` | `buildFullCompactPrompt` | cli_inner_pretty.js:270917-270930 | function | Builds the full/BASE 'TEXT ONLY' 9-section conversation-summary prompt (sections 8/9 = Current Work / Optional Next Step) used by full (`_eH` @423154) and reactive (`uc5` @271157); appends `customInstructions` + `Iv7`. v2.1.88 `getCompactPrompt` + `BASE_COMPACT_PROMPT`. |
| `xc5` | `formatCompactSummary` | cli_inner_pretty.js:271031-271052 | function | Strips the `<analysis>` block, unwraps `<summary>…</summary>` into a 'Summary:' header, collapses blank-line runs. v2.1.88 `formatCompactSummary`. |
| `jP$` | `buildCompactSummarySeed` | cli_inner_pretty.js:271053-271073 | function | Builds the `isCompactSummary` replacement user message: continuation header + formatted summary + conditional transcript / preserved-verbatim (4th arg, NEW) / REPL-cleared (5th arg, NEW) / auto-continue (suppressFollowUpQuestions) trailers. v2.1.88 `getCompactUserSummaryMessage`. |
| `MN6` | `initCompactPromptModule` | cli_inner_pretty.js:271075-271155 | function | Lazy module-init (`T(()=>…)`) assigning `bc5` and `Iv7` on first use. |
| `bc5` | `PARTIAL_COMPACT_FROM_PROMPT` | cli_inner_pretty.js:271076-271149 | constant | The `'from'`-direction body: summarize only the RECENT portion, earlier messages kept intact. v2.1.88 `PARTIAL_COMPACT_PROMPT`. |
| `Iv7` | `NO_TOOLS_TRAILER` | cli_inner_pretty.js:271150-271154 | constant | Trailing reminder appended to every compact prompt forbidding tool calls + repeating the two-block rule. v2.1.88 `NO_TOOLS_TRAILER`. |
| `i$H` | `getTokenUsage` | cli_inner_pretty.js:221033 | function | Extracts `message.usage` from a real (non-synthetic) assistant message; excludes sentinel model CT and no-cost text sentinels. |
| `Mo` | `sumUsageTokens` | cli_inner_pretty.js:221047 | function | `input + cache_creation + cache_read + output` token sum for a usage object. |
| `jo` | `tokenCountFromLastAPIResponse` | cli_inner_pretty.js:221050 | function | Returns `Mo(usage)` of the last assistant message with usage; used for `postCompactTokenCount` (the compact API call's total usage). |
| `jJ` | `tokenCountWithEstimation` | cli_inner_pretty.js:221106 | function | `preCompactTokenCount`: authoritative API usage of the last real-usage round (`Mo`) + rough char-estimate (`sT`) of the tail after it (scans from the last compact boundary). |
| `sT` | `roughTokenCountEstimationForMessages` | cli_inner_pretty.js:425283-425287 | function | Char-based rough token estimate over a message array (~4 chars/token, per-message via `Sx_`); used in PTL gap accounting, per-group sizing, and `truePostCompactTokenCount`. |

## Module: Compact — PostCompact, Cache-Break & State

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `XxH` | `markPostCompaction` | cli_inner_pretty.js:2540-2542 (export 2061) | function | Sets `STATE.pendingPostCompaction=true` at every compaction commit (one-shot arm). v2.1.88 same. |
| `vu8` | `consumePostCompaction` | cli_inner_pretty.js:2543-2546 (export 2204) | function | Read-and-clear of `pendingPostCompaction`; returns true exactly once after a compaction. Sole consumer is `tengu_api_success` @452614. v2.1.88 same. |
| `d$.pendingPostCompaction` | `STATE.pendingPostCompaction` | cli_inner_pretty.js:2353,2541,2544 | variable | Session-global boolean carrying 'compaction just committed' forward one API call (init 2353 / set 2541 / consume 2544). v2.1.88 same. |
| `cacheMissAckedAtOutputTokens` | `cacheMissAckedAtOutputTokens` | cli_inner_pretty.js:241529,272189-272191,527097 | variable | App-state field set by `Uo` to the current output-token count after a main-thread compact; suppresses the interactive cache-miss banner until new output. Distinct from `pendingPostCompaction` and the break detector. |
| `GA8` | `getTrackingKey` | cli_inner_pretty.js:269624-269628 | function | Maps querySource to a cache-break tracking key; `'compact' → 'repl_main_thread'`. v2.1.88 same. |
| `Yv7` | `isClaudeDesktopEntrypoint` | cli_inner_pretty.js:269579-269581 | function | Returns `process.env.CLAUDE_CODE_ENTRYPOINT === 'claude-desktop'` (the isDesktop condition, emitted @269998). Called by the `Jc` gate. |
| `Jc` | `isPromptCacheBreakDetectionEnabled` | cli_inner_pretty.js:269582-269585 | function | Gate: if `CLAUDE_CODE_IS_COWORK` return true, else `Yv7()` (Cowork OR claude-desktop). No env var. Guards `_P$` calls @272395/423475. |
| `Ov7` | `getCacheBreakStatePath` | cli_inner_pretty.js:269589-269591 | function | Returns `cache-break-state-<sessionId>.json` path under the temp dir. NEW in v2.1.156. |
| `Jc5` | `loadCacheBreakState` | cli_inner_pretty.js:269592-269604 | function | Hydrates `HU` from the on-disk cache-break-state file once per session. NEW in v2.1.156. |
| `DEH` | `persistCacheBreakState` | cli_inner_pretty.js:269605-269620 | function | Serializes `HU` to `cache-break-state-<sessionId>.json`. Called by `notifyCompaction` @270037. NEW in v2.1.156. |
| `wv7` | `checkResponseForCacheBreak` | cli_inner_pretty.js:269885-270028 | function | Phase-2 detector: compares cacheReadTokens to prev; flags a break when drop > 5% and `>= Pc5` (bare compare `D<Pc5` @269905), attributes cause, emits `tengu_prompt_cache_break`. v2.1.88 same. |
| `Jv7` (cache) | `notifyCacheDeletion` | cli_inner_pretty.js:270029-270033 | function | (cross-ref to Micro-compact group) Sets `cacheDeletionsPending=true` so a cache_edits deletion's expected cache-read drop is not flagged. |
| `_P$` | `notifyCompaction` | cli_inner_pretty.js:270034-270038 | function | Resets the cache-break baseline `prevCacheReadTokens=null` (+ persists via `DEH`) so the next API response (collapsed cache reads from the rewritten prefix) is exempt from `tengu_prompt_cache_break`. Gated by `Jc()`. v2.1.88 (no persistence). |
| `HU` | `previousStateBySource` | cli_inner_pretty.js:270048,270069 | object | `Map<key, PreviousState>` of cache-break snapshots, capped at `Xc5=10`. v2.1.88 same. |
| `Xc5` | `MAX_TRACKED_SOURCES` | cli_inner_pretty.js:270052 | constant | `10` — cap on tracked sources to bound memory. v2.1.88 same. |
| `Pc5` | `MIN_CACHE_MISS_TOKENS` | cli_inner_pretty.js:270054 | constant | `2000` — minimum absolute cache-read drop (`D=prev−current`) to flag a break (bare compare `D<Pc5` @269905). v2.1.88 same. |
| `Wc5` | `CACHE_TTL_5MIN_MS` | cli_inner_pretty.js:270055 | constant | `300000` — 5-minute TTL threshold for break attribution. v2.1.88 same. |
| `sk6` | `CACHE_TTL_1HOUR_MS` | cli_inner_pretty.js:270056 | constant | `3600000` — 1-hour TTL threshold. v2.1.88 same. |
| `Uo` | `runPostCompactCleanup` | cli_inner_pretty.js:272181-272194 | function | Main-thread-gated reset of getUserContext/memory/system-prompt/classifier caches + cache-miss banner ack (`cacheMissAckedAtOutputTokens` @272188-272191). v2.1.88 `runPostCompactCleanup` (no banner ack). |
| `rkH` | `isMainThreadQuerySource` | cli_inner_pretty.js:272182 (call) | function | True for undefined / `repl_main_thread*` / sdk; gates main-thread-only cleanup so in-process subagent compaction doesn't clobber shared module state. |
| `xv7` | `clearCompactWarningSuppression` | cli_inner_pretty.js:271343-271345 | function | Resets `compactWarningStore` false at the start of a new compact attempt (451282). v2.1.88 same. |
| `wP$` | `compactWarningStore` | cli_inner_pretty.js:271346,271348 | variable | Boolean store (`tG(!1)`) tracking whether the autocompact warning is suppressed; subscribed via `useCompactWarningSuppression` (574857). v2.1.88 same. |
| `DE` | `memoSegment` | cli_inner_pretty.js:271350-271352 | function | Declares a named lazily-computed prompt segment with `cacheBreak:false` (memoizable). The flag controls whether `resolvePromptSegments` trusts the client-side memo. |
| `uv7` | `resolvePromptSegments` | cli_inner_pretty.js:271353-271362 | function | Resolves the segment list; serves from the prefix memo unless `segment.cacheBreak` is true (then recompute + re-store via `Qm8`). |
| `SYH` | `getPrefixMemo` | cli_inner_pretty.js:271354 (call) | function | Returns the client-side prompt-prefix compute memo consulted by `resolvePromptSegments` (distinct from the server prompt cache). |
| `Qm8` | `setPrefixMemo` | cli_inner_pretty.js:271359 (call) | function | Stores a computed prompt-prefix segment value into the memo. |
| `L8H` | `clearSystemPromptSectionsAndBetaLatches` | cli_inner_pretty.js:271363-271365 | function | Calls `clearSystemPromptSectionState` (`gm8`) + `clearBetaHeaderLatches` (`sm8`); invalidated by the new compacted prefix. |
| `t$` (PostCompact) | `logFeatureSad` | cli_inner_pretty.js:41596-41598 | function | (cross-ref to Dispatcher group) `tengu_feature_sad`. |
| `SH` | `logFeatureOk` | cli_inner_pretty.js:41590 | function | Fires `tengu_feature_ok{feature_name}`; called with the `compact_auto`/`compact_manual` (and `compact_hint_reject`) label on success. NEW in v2.1.156 compact path. |
| `uH` | `logFeatureBad` | cli_inner_pretty.js:41593 | function | Fires `tengu_feature_bad{feature_name, error_code}`; called on each compaction failure branch. NEW in v2.1.156 compact path. |
| `Wc` | `executePreCompactHooks` | cli_inner_pretty.js:551557 | function | Fires the PreCompact hook event; returns `{newCustomInstructions, userDisplayMessage, blockedBy?}`. |
| `zJH` | `executePostCompactHooks` | cli_inner_pretty.js:551596-551614 | function | Runs PostCompact hook commands with `{trigger, compact_summary}`; folds stdout into `userDisplayMessage` (display only). v2.1.88 hooks.ts:4034. |
| `w5` | `createBaseHookInput` | cli_inner_pretty.js:552312-552328 | function | Builds the common hook payload envelope `{session_id, transcript_path, cwd, permission_mode, agent_id, agent_type, effort?}`. v2.1.88 same. |
| `Q2` | `executeHooksOutsideREPL` | cli_inner_pretty.js:554046 | function | Runs matching hook commands out-of-band with abort signal + timeout. v2.1.88 same. |
| `KrH` | `reAppendSessionMetadata` | cli_inner_pretty.js:547577-547579 (export 545971) | function | Re-appends session metadata (`p1().reAppendSessionMetadata()`) so a custom title/tag stays within the 16KB `--resume` tail window after compaction. The second element of the `(XxH(), KrH())` tuple. |
| `n$q` | `shouldShowModelMismatchCacheMiss` | cli_inner_pretty.js:523924-523928 | function | Cache-miss banner gate: returns false (suppress) when `outputTokens === cacheMissAckedAtOutputTokens` (nothing generated since the post-compact ack). |
| `Vo7` | `compactProgressReducer` | cli_inner_pretty.js:335632-335649 | function | Maps `compact_progress` events to spinner labels; `hooks_start/post_compact → 'Running PostCompact hooks…'` (335640). |
| `xP$` | `openTracingSpan` | cli_inner_pretty.js:276662 | function | Starts an OTEL span (no-op unless `F5H()` telemetry enabled); used for `'claude_code.compaction'` with `spanType + attrs{trigger, message_count}`. NEW in v2.1.156. |
| `mY8` | `setSpanAttributes` | cli_inner_pretty.js:276353 | function | Sets attributes on a span (no-op stub in this build); receives pre/post_compact_tokens + success in the finally block. |
| `EEH` | `setSpanError` | cli_inner_pretty.js:276356 | function | Sets span status to ERROR with optional message; called when compaction throws. |
| `iwH` | `emitCompactionMetric` | cli_inner_pretty.js:222566 | function | Emits the `'compaction'` OTLP metric (`j1`) with `trigger/success/duration_ms/pre_tokens/post_tokens/error` in the finally block. NEW in v2.1.156. |

---

## Fold-in note

These rows are the per-module symbol additions for the v2.1.143 → v2.1.156 compaction subsystem.
They should be folded into `00_overview/symbol_index_core_features.md` under `## Module: Compact`
(currently `593` records "no net-new symbols specific to this index"). On merge:

- Replace the "no net-new symbols" placeholder with the eight sub-area tables above (or distribute
  by sub-area heading), keeping the existing per-module table format.
- Several symbols already live in sibling indexes — `Ov`/`DZ`/`P36`/`NO$`/`E5H` (Model) and the
  cache-break helpers (`wv7`/`HU`/`Pc5`/`Wc5`/`sk6`/`Xc5`/`_P$`/`Jv7`) overlap
  `symbol_index_infra_platform.md` (Prompt-cache). Cross-link rather than duplicate; the Compact
  module owns the autocompact/threshold/reactive/micro-compact/summary-prompt rows.
- New-in-v2.1.156 callouts to preserve when merging: reactive lane (`lA8`/`bN6`/`nA8`/`xA8`/`uc5`/
  `sv7`/`xN6`/`_l5`/`S5H`), micro-compact `context_hint` (`kLz`/`K04`/`Vi6`/`y69`/`tKq`/`X69`/`L69`/
  `k76`/`Ti6` …), rapid-refill breaker (`fc6`/`Yc6`/`Y08`/`Oc6`), precompute threshold (`YX4`/`qc6`/
  `tb_`), cold-compact (`Mc6`), cache-break disk persistence (`Ov7`/`Jc5`/`DEH`), and the OTEL
  span/metric emission (`xP$`/`mY8`/`EEH`/`iwH`).
