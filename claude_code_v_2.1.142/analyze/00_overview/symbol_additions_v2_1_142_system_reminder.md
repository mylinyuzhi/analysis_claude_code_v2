# Symbol Additions — v2.1.142 `<system-reminder>` Subsystem

This file lists obfuscated→readable symbol mappings discovered while analyzing the v2.1.142 `<system-reminder>` subsystem. Cross-cutting analysis lives in `../41_system_reminder/`.

All file:line references are to `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js`.

## Module: System Reminder — Wrap / Strip Primitives

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `h2` | `reminderWrap` (string → `<system-reminder>…</system-reminder>`) | cli_inner_pretty.js:424714-424718 | function |
| `o_` | `wrapMessagesAsReminders` (list-of-messages wrapper) | cli_inner_pretty.js:424748-424761 | function |
| `Az5` | `ensureSystemReminderWrap` (idempotent re-wrap; gated by `tengu_chair_sermon`) | cli_inner_pretty.js:423911-423923 | function |
| `mq4` | `smooshSystemReminderSiblings` (fold SR-text into adjacent tool_result; gated by `tengu_chair_sermon`) | cli_inner_pretty.js:423924-423943 | function |
| `WR6` | `smooshIntoToolResult` (fold helper; returns null on tool_reference constraint) | (referenced by `mq4` body) | function |
| `Nq4` | `stripLeadingReminders` (peel leading SR blocks) | cli_inner_pretty.js:423281-423289 | function |
| `vQ4` | `stripAllReminders` (regex-strip any SR/task-notification slice) | cli_inner_pretty.js:566114-566116 | function |
| `Wq4` | `extractSystemReminderContent` (unwrap a wholly-tagged string; compaction variant) | cli_inner_pretty.js:424719-424722 | function |
| `nD6` | `extractSystemReminderContent` (telemetry variant; returns null on no-match) | cli_inner_pretty.js:241477-241479 | function |
| `sM4` | `REMINDER_CLOSE_TAG` constant (`"</system-reminder>"`) | cli_inner_pretty.js:467574 | constant |

## Module: System Reminder — Threshold Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aO8` | `REMINDER_THRESHOLDS` (`{TURNS_SINCE_WRITE:10, TURNS_BETWEEN_REMINDERS:10}`) | cli_inner_pretty.js:398821 | object |
| `Is7` | `PLAN_REMINDER_THRESHOLDS` (`{TURNS_BETWEEN_ATTACHMENTS:5, FULL_REMINDER_EVERY_N_ATTACHMENTS:5}`) | cli_inner_pretty.js:398822 | object |
| `Ss7` | `AUTO_REMINDER_THRESHOLDS` (same shape as `Is7`) | cli_inner_pretty.js:398823 | object |
| `B65` | `MEMORY_REMINDER_THRESHOLD` (`{TURNS_BETWEEN_REMINDERS:10}`) | cli_inner_pretty.js:398825 | object |
| `m65` | `MEMDIR_SIZE_LIMITS` (`{MAX_SESSION_BYTES:61440}`) | cli_inner_pretty.js:398824 | object |

## Module: System Reminder — Attachment Generators (each emits zero or more attachment objects)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `p65` | `collectAttachments` (parallel-Promise.all runner over all generators) | cli_inner_pretty.js:397549-397619 | function |
| `aY` | `runGeneratorWithTelemetry` (wraps each generator with `tengu_attachment_compute_duration` sampling) | cli_inner_pretty.js:397620-397642 | function |
| `Vq5` | `maybeEmitTodoReminder` (10/10 threshold) | cli_inner_pretty.js:398561-398572 | function |
| `kq5` | `maybeEmitTaskReminder` (TaskCreate/TaskUpdate variant) | cli_inner_pretty.js:398596-398606 | function |
| `Tq5` | `countTurnsSinceTodoEvents` | cli_inner_pretty.js:398538-398559 | function |
| `vq5` | `countTurnsSinceTaskEvents` | cli_inner_pretty.js:398573-398594 | function |
| `Nq5` | `emitTaskStatus` (background-agent state) | cli_inner_pretty.js:398608-398621 | function |
| `Eq5` | `emitMemoryUpdate` (pending memory-write notifications) | cli_inner_pretty.js:398623-398635 | function |
| `yq5` | `emitAsyncHookResponses` (asyncRewake hook output) | cli_inner_pretty.js:398637-398660+ | function |
| `Sq5` | `emitTokenUsageReminder` | (referenced at line 397607-397609) | function |
| `Rq5` | `emitOutputTokenUsageReminder` | (referenced at line 397611) | function |
| `Cq5` | `emitBudgetUsdReminder` | (referenced at line 397610) | function |
| `Kq5` | `emitAtMentionedFiles` | (referenced at line 397558) | function |
| `Aq5` | `emitMcpResources` | (referenced at line 397559) | function |
| `_q5` | `emitAgentMentions` | (referenced at line 397560) | function |
| `r65` | `maybeEmitDateChange` | cli_inner_pretty.js:397805-397815 | function |
| `o65` | `maybeEmitUltrathinkEffort` | cli_inner_pretty.js:397816-397819 | function |
| `a65` | `maybeEmitThinkingReminder` | cli_inner_pretty.js:397820-397830 | function |
| `AMH` | `emitDeferredToolsDelta` (MCP toolset changes) | cli_inner_pretty.js:397831-397838 | function |
| `mQH` | `emitAgentListingDelta` | cli_inner_pretty.js:397839-397874 | function |
| `BQH` | `emitMcpInstructionsDelta` | cli_inner_pretty.js:397876-397883 | function |
| `s65` | `emitCriticalSystemReminder` (experimental override) | cli_inner_pretty.js:397884-397887 | function |
| `t65` | `emitOutputStyleReminder` | cli_inner_pretty.js:397889-397894 | function |
| `e65` | `emitIdeSelection` | cli_inner_pretty.js:397895-397899 | function |
| `qq5` | `emitIdeOpenedFile` | (referenced at line 397600) | function |
| `Wq5` | `emitDiagnosticsAttachment` | (referenced at line 397602) | function |
| `Zq5` | `emitLspDiagnostics` | (referenced at line 397603) | function |
| `xq5` | `emitVerifyPlanReminder` | (referenced at line 397612) | function |
| `d65` | `maybeEmitPlanModeReminder` (cadence + plan-mode-reentry) | cli_inner_pretty.js:397726-397748 | function |
| `c65` | `maybeEmitPlanModeExitReminder` | cli_inner_pretty.js:397750-397758 | function |
| `n65` | `maybeEmitAutoModeReminder` (full/sparse/once tri-state) | cli_inner_pretty.js:397783-397797 | function |
| `i65` | `maybeEmitAutoModeExitReminder` | cli_inner_pretty.js:397799-397803 | function |
| `bs7` | `countTurnsSincePlanAttachment` (plan-mode cadence counter) | cli_inner_pretty.js:397699-397713 | function |
| `Q65` | `countPlanModeAttachments` (for full/sparse cadence) | cli_inner_pretty.js:397715-397724 | function |
| `xs7` | `countTurnsSinceAutoAttachment` | cli_inner_pretty.js:397759-397770 | function |
| `l65` | `countAutoModeAttachments` | cli_inner_pretty.js:397772-397781 | function |
| `Yq5` | `emitChangedFilesAttachment` | (referenced at line 397584) | function |
| `fq5` | `emitNestedMemoryAttachment` | (referenced at line 397585) | function |
| `Jq5` | `emitDynamicSkillAttachment` | (referenced at line 397586) | function |
| `Ty6` | `emitSkillListingAttachment` | (referenced at line 397587) | function |
| `hq5` | `emitTeammateMailbox` (agent-team) | (referenced at line 397593) | function |
| `Iq5` | `emitTeamContext` (agent-team) | (referenced at line 397593) | function |
| `F65` | `emitAgentPendingMessages` (agent-team) | cli_inner_pretty.js:397678-397686 | function |
| `sO8` | `emitQueuedCommands` | cli_inner_pretty.js:397643-397677 | function |
| `Z38` | `detectPostHookFileChange` (edited_text_file emitter) | cli_inner_pretty.js:378825+ | function |
| `Tl4` | `emitContainerRestartReminder` | cli_inner_pretty.js:575292-575298 | function |
| `iiK` | `getMemoryAgeMarker` | cli_inner_pretty.js:217456-217460 | function |
| `A36` | `computeStaleMemoryWarning` (text builder for `iiK`) | cli_inner_pretty.js:217447-217454 | function |

## Module: System Reminder — Normalisation / Dispatch

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `CI6` | `normalizeAttachmentForAPI` (main dispatcher; team carve-out + switch) | cli_inner_pretty.js:424960-425332 | function |
| `Tq4` | `PER_TOOL_RENDERERS` (registry of per-tool result renderers) | (lookup map; populated at tool-registration sites) | object |
| `Wz5` | `makeApiSystemMessage` (`type:"api_system"` mid-conv role:"system") | cli_inner_pretty.js:424723-424729 | function |
| `Zz5` | `extractAllSystemReminderText` (compaction-time helper that unwraps a list of messages) | cli_inner_pretty.js:424731-424746 | function |
| `Gz5` | `getPlanModeInstructions` (full/sparse/subagent selector) | cli_inner_pretty.js:424762-424766 | function |
| `Vz5` | `getPlanModeFullInstructions` | cli_inner_pretty.js:424773-424859 | function |
| `Nz5` | `getPlanModeSparseInstructions` | cli_inner_pretty.js:424918-424926 | function |
| `Ez5` | `getPlanModeSubagentInstructions` | cli_inner_pretty.js:424927-424935 | function |
| `kz5` | `getPlanModeIterativeInstructions` (the `bf()` workflow variant) | cli_inner_pretty.js:424867-424916 | function |
| `Gq4` | `getPlanModeEndingInstructions` | cli_inner_pretty.js:424767-424772 | function |
| `yz5` | `getAutoModeInstructions` (full/sparse/once selector) | cli_inner_pretty.js:424936-424940 | function |
| `hz5` | `getAutoModeFullInstructions` | cli_inner_pretty.js:424941-424946 | function |
| `Iz5` | `getAutoModeSparseInstructions` | cli_inner_pretty.js:424947-424950 | function |
| `Sz5` | `getAutoModeOnceInstructions` | cli_inner_pretty.js:424951-424958 | function |
| `Cz5` | `MEMORY_UPDATE_SOURCE_LABELS` (map of source names → label strings) | (referenced at line 425293) | object |
| `Tz5` | `PLAN_PHASE4_SECTION` (phase-4 section template) | (referenced at line 424853) | constant |
| `EO8` | `prependCachedContextReminder` (CLAUDE.md / context injection at session start) | cli_inner_pretty.js:524243-524262 | function |
| `to7` | `joinContextEntries` (helper for `EO8`) | cli_inner_pretty.js:524236-524241 | function |

## Module: System Reminder — Inline Reminder Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `KVK` | `WASTED_READ_REMINDER` (string constant) | cli_inner_pretty.js:141545 | constant |
| `nI1` | `FILE_UNCHANGED_NOTICE` (longer version of wasted-read notice) | cli_inner_pretty.js:141543-141544 | constant |
| `gH9` | `SHUTDOWN_TEAM_PROMPT` (non-interactive agent-team shutdown) | cli_inner_pretty.js:604170-604182 | constant |
| `oj4` | `REMOTE_PLAN_LIGHT_PROMPT` (single-agent remote planning) | cli_inner_pretty.js:475352-475371 | module |
| `aj4` | `REMOTE_PLAN_DIAGRAM_PROMPT` (single-agent with mermaid) | cli_inner_pretty.js:475373-475395 | module |
| `sj4` | `REMOTE_PLAN_ULTRA_PROMPT` (multi-agent ultra planning) | cli_inner_pretty.js:475397-475427 | module |
| `t05` | (CommonJS export for `oj4`) | cli_inner_pretty.js:475352 | module |
| `e05` | (CommonJS export for `aj4`) | cli_inner_pretty.js:475373 | module |
| `HT5` | (CommonJS export for `sj4`) | cli_inner_pretty.js:475397 | module |

## Module: System Reminder — UI / Filter Predicates

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `w8` | `makeUserMessage` (factory carrying `isMeta` flag) | cli_inner_pretty.js:423394-423429 | function |
| `oq4` | `shouldKeepInTranscript` (per-surface keep-predicate; `isMeta` + channel-origin carve-out) | cli_inner_pretty.js:425556-425564 | function |
| `s9H` | `isChannelOrigin` (agent-team channel carve-out predicate) | cli_inner_pretty.js:425552-425555 | function |
| `vi` | `makeLocalCommandCaveat` (sticky meta caveat used by `/model`, `/clear`, etc.) | cli_inner_pretty.js:423437-423442 | function |
| `br` | `buildReadablePreview` (strip + collapse for activity logs) | cli_inner_pretty.js:566117-566122 | function |
| `zy6` | `getUserPromptForBridge` (strips leading SR for `/remote-control` summary) | cli_inner_pretty.js:390867-390869 | function |
| `lq4` | `getCollapsedReadSearchPreviewText` (UI preview text generator that strips reminders) | cli_inner_pretty.js:467486-467528 | function |

## Module: System Reminder — Telemetry

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `rf_` | `formatMessagesForTelemetry` (split contextParts vs systemReminders) | cli_inner_pretty.js:241480-241514 | function |
| `_47` | `hashMessage` | cli_inner_pretty.js:241473-241476 | function |
| `if_` | `hashSystemPrompt` (telemetry span hash) | cli_inner_pretty.js:241470-241472 | function |
| `Y47` | `setNewContextOnSpan` (writes `new_context` span attribute) | cli_inner_pretty.js:241515-241520 | function |
| `f47` | `setSystemPromptAndToolsOnSpan` (also tracks reminders count) | cli_inner_pretty.js:241521-241614 | function |

## Module: System Reminder — Side Question

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$D8` | `runSideQuestion` (lightweight forked agent for `/ask`) | cli_inner_pretty.js:427848-427903 | function |
| `Hf5` | `extractSideQuestionResponse` (post-processing of side-q output) | cli_inner_pretty.js:427904+ | function |
| `vq4` | `wrapQueuedCommandContent` (envelope for queued-command attachments) | (referenced at line 425099) | function |
| `cR6` | `recordSideQuestionInHistory` | cli_inner_pretty.js:427845-427847 | function |
| `jW$` | `SIDE_QUESTION_HISTORY_STATE` (module-level mutable state) | (referenced at lines 427839-427846) | object |
| `tY5` | `SIDE_QUESTION_MAX_HISTORY` (cap on stored side-Q history) | (referenced at line 427846) | constant |

## Module: System Reminder — Compaction Hooks

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `jM$` | `makeCompactBoundary` (`type:"system",subtype:"compact_boundary"`) | cli_inner_pretty.js:425507-425519 | function |
| `xL` | `isCompactBoundary` (predicate for compact-boundary messages) | cli_inner_pretty.js:425534-425536 | function |
| `bz5` | `findLastCompactBoundary` | cli_inner_pretty.js:425537-425543 | function |
| `X3` | `sliceFromLastCompactBoundary` | cli_inner_pretty.js:425544-425547 | function |

## Module: System Reminder — Brief-Mode Reminder (inline)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `P7H` | `BRIEF_TOOL_NAME` (`"Brief"` constant; referenced by toggle reminder) | (referenced at line 497349-497350) | constant |
| `sy5` | `briefModeSlashCommand` (`/brief` command implementation with SR text) | cli_inner_pretty.js:497327-497358 | function |
| `ay5` | (alias of `sy5`) | cli_inner_pretty.js:497359 | function |
| `oy5` | `getBriefModeConfig` | cli_inner_pretty.js:497330+ | function |
| `X38` | `isBriefModeAvailable` (feature-flag predicate) | cli_inner_pretty.js:497336 | function |
| `_o` | `setBriefModeState` (`flagSettings.isBriefOnly` writer) | cli_inner_pretty.js:497342 | function |

## Module: System Reminder — Mid-Conversation System Fallback

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `NQK` | `isMidConvSystemRejectError` (predicate matching the server error) | (referenced at line 525537) | function |
| (telemetry event) | `tengu_mid_conv_system_fallback_retry` | cli_inner_pretty.js:525545 | event |

## Module: System Reminder — Cache-Aware Reminders

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `WT$` | `getCachedContextEntries` (cached prefix region builder) | (used by `EO8` at line 524243) | function |
| `xV` | `getProjectStateForContext` (CLAUDE.md / git / env entries) | (referenced at line 524265) | function |

## Module: System Reminder — Empty-File / Short-File Strings (Read tool)

These are inline string constants in `mapToolResultToToolResultBlockParam` of the Read tool. No top-level symbol — they appear as literals.

| Obfuscated literal | Readable | File:Line | Type |
|--------------------|----------|-----------|------|
| (literal) | `<system-reminder>Warning: the file exists but the contents are empty.</system-reminder>` | cli_inner_pretty.js:407427 | string |
| (literal) | `<system-reminder>Warning: the file exists but is shorter than the provided offset…</system-reminder>` | cli_inner_pretty.js:407428 | string |

## Module: System Reminder — System Prompt Clauses

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_m5` | `generalSystemSection` (includes the "tool results may include <sr>" clause) | cli_inner_pretty.js:523570-523581 | function |
| `tu5` | `thinkingReminderSystemSection` | cli_inner_pretty.js:523538-523541 | function |
| `eu5` | `hooksSystemSection` (mentions `<user-prompt-submit-hook>` parity with SR) | cli_inner_pretty.js:523543-523544 | function |
| `IO$` | `isThinkingSupportedForModel` (gate for the thinking-reminder section) | (referenced at line 523539) | function |

## Cross-version notes (v2.1.88 → v2.1.142)

- **New in v2.1.142**: `Az5`/`ensureSystemReminderWrap`, `mq4`/`smooshSystemReminderSiblings`, four-state `deferred_tools_delta`, `verify_plan_reminder`, `critical_system_reminder`, `memory_update`, `mcp_instructions_delta`, `auto_mode_exit`, agent-team types (`team_context`, `teammate_mailbox`, `agent_pending_messages`), `task_reminder` (TaskCreate/TaskUpdate variant), `<task-notification>` in `stripAllReminders`.
- **Unchanged**: `h2`/`reminderWrap`, `o_`/`wrapMessagesAsReminders`, `Nq4`/`stripLeadingReminders`, `Wq4`/`extractSystemReminderContent`, all empty/short/wasted-file reminder strings, side-question wrapper, CLAUDE.md context block, container-restart reminder, GitHub rate-limit reminder, system-prompt SR clause.
- **Renamed/relocated**: Per-attachment-type renderers moved from a single `normalizeAttachmentForAPI` switch in 2.1.88 to a hybrid (team-feature carve-out → `Tq4` registry lookup → switch) in 2.1.142.

## Confidence

All mappings above are derived from grep + body-comparison against v2.1.88 source. See `41_system_reminder/cross_validation.md` for confidence ratings per symbol. No low-confidence entries; 11 medium-confidence (v2.1.142-new with no 2.1.88 reference).
