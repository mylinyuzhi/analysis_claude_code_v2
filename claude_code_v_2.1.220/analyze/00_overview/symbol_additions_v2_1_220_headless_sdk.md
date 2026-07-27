# Symbol additions — v2.1.220 headless mode / print mode / SDK (`51_headless_sdk/`)

Produced by the `51_headless_sdk` module pass over the `2.1.195 → 2.1.220` window.
All `File:Line` values are **`cli_inner_pretty.js` lines in the 2.1.220 bundle**
(`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`,
`build_sha 4073f595`) that were read during the pass. Line numbers are valid **only** for this build.

> **Merge target for EVERY group below: [`symbol_index_core_features.md`](symbol_index_core_features.md)**
> (CLI / headless is a core-feature theme per `_CONVENTIONS.md` §6). Two groups are cross-cutting and
> flagged inline: the model-precedence chain touches `47_models`, and `prefixScheduledPromptBanner`
> touches `40_system_prompt`. They still belong in the core-features index so that the headless surface
> reads as one unit.

> **Identifier-collision warning.** `yBc` in this table is the 2.1.220 subagent thinking-display
> normalizer at `:119662`. A **different** `yBc` exists in 2.1.193 at `:9245 (193)` (a vendored helper
> aliased to `s7e`). `00_overview/_false_delta_ledger.md` currently cites the 193 count as evidence of
> carryover; see `51_headless_sdk/README.md` → *Corrections to shared tree documents* #1.

> **Dead-code warning.** `tengu_remote_subagent_frame_nested` (`:757401`) is inside a block guarded by
> `if (ut !== null)` where `ut` is assigned `null` on the preceding line. It is unreachable in this
> build and is deliberately **not** listed as an implementation symbol below.

---

## Module: Headless Process IO (stdout drain, stdin guard)

Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Bzt` | handleStreamGoneErrors | cli_inner_pretty.js:20520 | function |
| `dCi` | registerProcessIOErrorHandlers | cli_inner_pretty.js:20530 | function |
| `dIl` | writeIfWritable | cli_inner_pretty.js:20538 | function |
| `f9m` | STDOUT_ASSUMED_BYTES_PER_SEC | cli_inner_pretty.js:20646 | constant |
| `fCi` | iterateStreamUntilClose | cli_inner_pretty.js:20612 | function |
| `fIl` | stdoutBytesQueued | cli_inner_pretty.js:20641 | variable |
| `fWe` | markStdoutDrainExternallyClocked | cli_inner_pretty.js:20561 | function |
| `g9m` | waitForStdoutQueueEmpty | cli_inner_pretty.js:20581 | function |
| `gIl` | queuedStdoutBytes | cli_inner_pretty.js:20572 | function |
| `h9m` | _resetStdoutErrorLatchForTesting | cli_inner_pretty.js:20575 | function |
| `hIl` | stdoutExternalClockPromise | cli_inner_pretty.js:20564 | function |
| `Js` | writeToStdout | cli_inner_pretty.js:20542 | function |
| `jzt` | drainStdoutBeforeExit | cli_inner_pretty.js:20552 | function |
| `K0t` | PROCESS_IO_MODULE | cli_inner_pretty.js:20501 | object |
| `lCi` | stdoutEndPromise | cli_inner_pretty.js:20640 | variable |
| `m9m` | STDOUT_MAX_DRAIN_MS | cli_inner_pretty.js:20647 | constant |
| `mIl` | stdoutBytesFlushed | cli_inner_pretty.js:20642 | variable |
| `MUn` | onStdoutQueueDrained | cli_inner_pretty.js:20643 | variable |
| `Oa` | withTimeout | cli_inner_pretty.js:20483 | function |
| `OUn` | getStdoutDrainBudgetMs | cli_inner_pretty.js:20578 | function |
| `p9m` | externalClockGrace | cli_inner_pretty.js:20569 | function |
| `PBr` | peekForStdinData | cli_inner_pretty.js:20597 | function |
| `pCi` | stdoutErrorLatched | cli_inner_pretty.js:20648 | variable |
| `pIl` | everWroteToStdout | cli_inner_pretty.js:20639 | variable |
| `u9m` | STDIN_UNUSABLE_CODES | cli_inner_pretty.js:20652 | constant |
| `uIl` | STREAM_GONE_CODES | cli_inner_pretty.js:20652 | constant |
| `Uzt` | isStdinUnusableError | cli_inner_pretty.js:20516 | function |
| `vr` | delay | cli_inner_pretty.js:20457 | function |
| `y9m` | exitWithError | cli_inner_pretty.js:20594 | function |

---

## Module: Headless Exit Path

Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `eVs` | exitProcessHard | cli_inner_pretty.js:522156 | function |
| `GF_` | FORCED_EXIT_WATCHDOG_SLACK_MS | cli_inner_pretty.js:522406 | constant |
| `Oip` | reportStartupFailureAndExit | cli_inner_pretty.js:522195 | function |
| `Pip` | STARTUP_FAILURE_REPORT_DELAY_MS | cli_inner_pretty.js:522398 | constant |
| `Q8s` | armForcedExitWatchdog | cli_inner_pretty.js:522210 | function |
| `T_l` | fatalStreamInputError | cli_inner_pretty.js:840578 | function |
| `Uip` | finalDrainAndExit | cli_inner_pretty.js:522373 | function |
| `zUe` | forcedExitTimer | cli_inner_pretty.js:522402 | variable |

---

## Module: Headless stream-json Output

Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Cm` | installStreamJsonStdoutGuard | cli_inner_pretty.js:841083 | function |
| `AMe` | stdoutGuardPendingBuffer | cli_inner_pretty.js:841132 | variable |
| `F_l` | resetTextOutputAccumulator | cli_inner_pretty.js:843326 | function |
| `k_l` | stdoutGuardInstalled | cli_inner_pretty.js:841131 | variable |
| `MCm` | STDOUT_GUARD_PREFIX | cli_inner_pretty.js:841130 | constant |
| `OCm` | isParseableJsonLine | cli_inner_pretty.js:841075 | function |
| `Qwt` | originalStdoutWrite | cli_inner_pretty.js:841133 | variable |
| `Txm` | feedTextOutputAccumulator | cli_inner_pretty.js:843302 | function |
| `vpE` | INCOMPLETE_RESPONSE_NOTICE | cli_inner_pretty.js:843329 | constant |
| `wxm` | makeTextOutputAccumulator | cli_inner_pretty.js:843299 | function |
| `c1r` | writeStreamJsonFatalResult | cli_inner_pretty.js:849670 | function |
| `Ogi` | notifyRunFailedSummary | cli_inner_pretty.js:849666 | function |

---

## Module: Headless stream-json Input

Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `dEm` | getInputPrompt | cli_inner_pretty.js:828110 | function |
| `JOn` | StdinControlTransport | cli_inner_pretty.js:839898 | class |
| `LiE` | getStreamJsonStdinIterator | cli_inner_pretty.js:828098 | function |
| `SU` | stripBom | cli_inner_pretty.js:57355 | function |
| `uEm` | MAX_PIPED_STDIN_BYTES | cli_inner_pretty.js:828148 | constant |
| `duf` | readBgStdin | cli_inner_pretty.js:682687 | function |

---

## Module: SDK init Event

Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `B6o` | recordInitEmitTiming | cli_inner_pretty.js:593628 | function |
| `CEm` | getSkippedMcpServers | cli_inner_pretty.js:828312 | function |
| `eAr` | buildAmbientInitFields | cli_inner_pretty.js:593569 | function |
| `lCb` | SDK_CAPABILITIES_ENGINE | cli_inner_pretty.js:653849 | constant |
| `Msa` | CAPABILITY_MSG_LIFECYCLE_V1 | cli_inner_pretty.js:593635 | constant |
| `Psa` | CAPABILITY_INTERRUPT_RECEIPT_V1 | cli_inner_pretty.js:593634 | constant |
| `tAr` | buildInitEvent | cli_inner_pretty.js:593588 | function |
| `TEm` | recordSkippedMcpServers | cli_inner_pretty.js:828309 | function |
| `uDp` | SDK_CAPABILITIES_QUERY | cli_inner_pretty.js:593652 | constant |
| `Ulb` | CAPABILITY_INTERRUPT_CANCEL_QUEUED_V1 | cli_inner_pretty.js:593636 | constant |
| `wEm` | SKIPPED_MCP_SERVERS | cli_inner_pretty.js:828315 | variable |
| `zuE` | SDK_INIT_MESSAGE_SCHEMA | cli_inner_pretty.js:836907 | object |

---

## Module: Subagent Text Forwarding

Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `iKe` | toWireFrames | cli_inner_pretty.js:341013 | function |
| `tdd` | getSubagentFrameWriter | cli_inner_pretty.js:340754 | function |
| `yBc` | normalizeSubagentThinkingDisplay | cli_inner_pretty.js:119662 | function |
| `Yon` | buildAgentProgressFrame | cli_inner_pretty.js:530801 | function |
| `Zth` | ENV_CLAUDE_CODE_FORWARD_SUBAGENT_TEXT | cli_inner_pretty.js:31043 | variable |

---

## Module: SDK Control Requests

Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bi` | runTrackedControlHandler | cli_inner_pretty.js:847437 | function |
| `bs` | startKeepAlivePump | cli_inner_pretty.js:847193 | function |
| `edE` | SDK_CONTROL_REQUEST_PROGRESS_SCHEMA | cli_inner_pretty.js:837264 | object |
| `I0m` | SDK_SET_PERMISSION_MODE_SCHEMA | cli_inner_pretty.js:838607 | object |
| `It` | syncSdkMcpClients | cli_inner_pretty.js:845949 | function |
| `J` | emitControlRequestProgress | cli_inner_pretty.js:847205 | function |
| `ke` | handleRegisterRepoRoot | cli_inner_pretty.js:847216 | function |
| `ks` | inFlightControlAborts | cli_inner_pretty.js:847191 | variable |
| `L0m` | SDK_SET_MAX_THINKING_TOKENS_SCHEMA | cli_inner_pretty.js:838635 | object |
| `Ma` | runDetachedControlHandler | cli_inner_pretty.js:847446 | function |
| `mr` | respondError | cli_inner_pretty.js:847188 | function |
| `pfE` | handleInitializeControlRequest | cli_inner_pretty.js:849395 | function |
| `Pn` | respondSuccess | cli_inner_pretty.js:847182 | function |
| `R0m` | SDK_SET_MODEL_SCHEMA | cli_inner_pretty.js:838616 | object |

---

## Module: set_cwd Control Request

Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aef` | replaceIfUnsafePath | cli_inner_pretty.js:663601 | function |
| `Hxm` | shouldHoldResultForRunningTasks | cli_inner_pretty.js:843370 | function |
| `Ixm` | shouldMarkIdleWhileWaiting | cli_inner_pretty.js:843373 | function |
| `kxm` | isSessionBusyForCwdChange | cli_inner_pretty.js:843367 | function |
| `qLb` | handleSetCwdControlRequest | cli_inner_pretty.js:663604 | function |
| `QKo` | UNSAFE_PATH_CHARS_RE | cli_inner_pretty.js:663724 | variable |

`QKo` is the invisible/non-printing-character detector used by both the `set_cwd` unsafe-path refusal
(`:663626`) and `replaceIfUnsafePath`:
`/[\p{Cc}\p{Cf}\p{Zl}\p{Zp}\p{Default_Ignorable_Code_Point}⠀]|(?! )\p{Zs}/u` — control,
format, line/paragraph separators, default-ignorables, braille blank, and every space separator
except U+0020.

---

## Module: Live Model Switch (cross-cutting with `47_models`)

Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `cud` | modelChangedSince | cli_inner_pretty.js:336901 | function |
| `fxm` | formatUnrecognizedModelError | cli_inner_pretty.js:843115 | function |
| `lud` | resolveRoundTripModel | cli_inner_pretty.js:336898 | function |
| `O_l` | suggestNearestModelId | cli_inner_pretty.js:843110 | function |
| `pxm` | classifyModelRequest | cli_inner_pretty.js:843087 | function |
| `xud` | runQueryTurns | cli_inner_pretty.js:337348 | function |
| `ypE` | classifyUnrecognizedModelShape | cli_inner_pretty.js:843101 | function |

---

## Module: Scheduled-Task Prompt Banner (cross-cutting with `40_system_prompt`)

Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `dZg` | SCHEDULED_TASK_HEADER | cli_inner_pretty.js:226513 | constant |
| `Hcs` | prefixScheduledPromptBanner | cli_inner_pretty.js:226508 | function |
| `x7r` | AUTOMATED_EVENT_BANNER | cli_inner_pretty.js:226516 | constant |
| `Zdo` | SCHEDULED_PROMPT_BANNER | cli_inner_pretty.js:226522 | constant |

---

## Feature gates and telemetry events introduced or used in this theme

Merge into: `symbol_index_core_features.md` (as `constant` rows under the relevant module section).

| Event / gate | 220 | 193 | File:Line | Note |
|---|---|---|---|---|
| `tengu_sdk_control_request_progress` | 1 | 0 | cli_inner_pretty.js:847206 | `{ status }` — `started` \| `api_retry` |
| `tengu_sdk_control_cancel_request` | 1 | 0 | cli_inner_pretty.js:849005 | `{ in_flight }` |
| `tengu_set_model_unrecognized` | 1 | 0 | cli_inner_pretty.js:847598 | `{ shape, had_suggestion, surface }` |
| `tengu_live_model_switch` | 2 | 0 | cli_inner_pretty.js:337608 | `{ from_model, to_model, query_source, entrypoint, queryChainId, queryDepth }` |
| `tengu_bg_stdin_unreadable` | 1 | 0 | cli_inner_pretty.js:682705 | `{ error_code }` |
| `tengu_sdk_stall` | — | — | cli_inner_pretty.js:840240 | `{ session_age_ms, session_state, last_message_type, pending_control_requests }` |
| `tengu_sdk_schema_violation` | — | — | cli_inner_pretty.js:840254 | sampled outbound-frame schema check |
| `tengu_sdk_result` | — | — | cli_inner_pretty.js:846787 | `{ subtype, is_error, num_turns, duration_ms, saw_retry, saw_compact, … }` |
| `tengu_sdk_init_handshake` | — | — | cli_inner_pretty.js:849466 | `{ uptime_ms, mcp_client_count, mcp_pending_count, mcpNonBlocking, session_mirror }` |
| `tengu_sdk_session_crash` | — | — | cli_inner_pretty.js:847003 | outer print-loop crash handler |
| `tengu_shutdown_signal` | — | — | cli_inner_pretty.js:522454 | `{ signal, uptime_s, ppid_changed, stdin_at_eof, stdin_destroyed, is_tty }` |
| `tengu_remote_subagent_frame_nested` | 1 | 0 | cli_inner_pretty.js:757401 | **DEAD CODE** — inside `if (ut !== null)` with `ut = null` on `:757390`. Never fires in this build. |

Rows with `—` in the count columns were read in 2.1.220 but not counted against 2.1.193; do not present
them as net-new without running `grep -c` on both bundles first.

---

## Cross-references

- Producing side of `mcp_server_errors`: [`../39_mcp/errors_and_diagnostics.md`](../39_mcp/errors_and_diagnostics.md)
  and [`symbol_additions_v2_1_220_mcp.md`](symbol_additions_v2_1_220_mcp.md).
- `executeDirectoryAddedHooks` (`a2t`, `:518817`), called from `register_repo_root` at `:847256`:
  owned by `41_hooks`.
- Spawn-depth cap that makes depth-2 forwarding reachable (`hee`, `ZDu = 3`, `tengu_hazel_trellis`):
  [`symbol_additions_v2_1_220_subagent_limits.md`](symbol_additions_v2_1_220_subagent_limits.md).
