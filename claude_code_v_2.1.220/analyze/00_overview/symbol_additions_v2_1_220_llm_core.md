# Symbol additions — v2.1.220, theme `llm_core`

Staged for merge into `symbol_index_core_execution.md` and `symbol_index_core_features.md`. The main
group belongs to agent-loop and tool-execution flow; the smaller group names compaction and hook
helpers that the loop calls. All `File:Line` values are from the 2.1.220 bundle and were read during
this pass.

Source documents: [`../03_llm_core/README.md`](../03_llm_core/README.md),
[`../03_llm_core/agent_loop_state_machine.md`](../03_llm_core/agent_loop_state_machine.md),
[`../03_llm_core/streaming_tool_execution.md`](../03_llm_core/streaming_tool_execution.md), and
[`../03_llm_core/recovery_and_termination.md`](../03_llm_core/recovery_and_termination.md).

`runQueryTurns` (`xud`, `:337348`), `sweepInFlightToolsForFallback` (`non`, `:331733`),
`makeCompactedTurnState` (`Gds`, `:237112`), `resolveToolByNameOrAlias` (`Ic`, `:224038`), and
`logEvent` (`O`, `:4083`) were already mapped. This pass reuses those readable names; it does not
create duplicate rows. The `xud` row is moved from the core-features index to core execution because
the implementation is the central agent loop, not a model-switch feature.

No identifier below appears in `symbol_alias_conflicts.md` as of this pass.

---

## Module: Agent Loop — turn orchestration and streaming tools

> Merge into: `symbol_index_core_execution.md`

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
| `Ycd` | `handleStopHooks` | cli_inner_pretty.js:336419 | function |
| `Z1y` | `findLatestUserUuidAfterLastAssistant` | cli_inner_pretty.js:337174 | function |
| `Zcd` | `createTurnAccumulator` | cli_inner_pretty.js:336776 | function |
| `zr` | `createUserMessage` | cli_inner_pretty.js:530718 | function |

---

## Module: Compact and hook helpers used by the query loop

> Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `H9` | `tokenCountFromLastAPIResponse` | cli_inner_pretty.js:442493 | function |
| `qHs` | `finalContextTokensFromLastResponse` | cli_inner_pretty.js:442503 | function |
| `w7r` | `addTotalTokensReminderUsage` | cli_inner_pretty.js:226342 | function |
| `WHs` | `buildCompactionEmittedMessages` (excludes retained raw messages) | cli_inner_pretty.js:440196 | function |
| `wue` | `readNumericEnvOrDefault` | cli_inner_pretty.js:14698 | function |
| `YNe` | `getTotalTokensReminderMode` | cli_inner_pretty.js:226378 | function |
| `Yze` | `buildPostCompactMessages` | cli_inner_pretty.js:440193 | function |

---

## Cross-version anchors checked for this architecture pass

These are literals rather than symbol rows. Counts are target 2.1.220 / baseline 2.1.193; the status
column prevents stable architecture from being confused with narrow release deltas.

| Literal | 220 | 193 | Status | Interpretation |
|---|---:|---:|---|---|
| `tool_drain_tick` | 2 | 2 | Carryover | model/tool multiplexing is stable in the comparison window |
| `tengu_orphaned_messages_tombstoned` | 1 | 1 | Carryover | fallback rollback is stable |
| `tengu_query_before_attachments` | 1 | 1 | Carryover | post-tool attachment phase is stable |
| `tengu_query_after_attachments` | 1 | 1 | Carryover | post-attachment commit phase is stable |
| `Streaming fallback - tool execution discarded` | 2 | 2 | Carryover | synthetic rollback result is stable |
| `tengu_malformed_tool_use_response` | 1 | 1 | Carryover | malformed tool-use retry itself is stable |
| `malformed_tool_use_exhausted` | 3 | 0 | 2.1.220 delta | repeated malformed responses now have a typed failure terminal |
| `query_thinking_only_response` | 3 | 3 | Carryover | thinking-only nudge is stable |
| `resumeIncompleteThinking` | 8 | 0 | 2.1.220 delta | signed-thinking continuation is new in the window |
| `CLAUDE_CODE_STOP_HOOK_BLOCK_CAP` | 3 | 2 | Carryover | same default-eight cap; count changed with helper/parser refactoring |
| `claude/endTurn` | 2 | 2 | Carryover | tool/MCP end-turn protocol and detector are stable |
| `tengu_auto_compact_rapid_refill_breaker` | 2 | 2 | Carryover | proactive/reactive breaker integration is stable |

The net-new `tengu_convolute_arcades_*` fallback-continuation events are intentionally not re-analysed
here; their delta evidence remains in
[`symbol_additions_v2_1_220_api_reliability.md`](symbol_additions_v2_1_220_api_reliability.md).
