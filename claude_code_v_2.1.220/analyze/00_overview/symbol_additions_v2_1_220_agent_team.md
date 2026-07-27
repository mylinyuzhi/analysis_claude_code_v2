# Symbol additions — v2.1.220 — agent team

Staged for merge into **`symbol_index_core_features.md`** (per [`../_CONVENTIONS.md`](../_CONVENTIONS.md)
§6: agent team → core features). Every `File:Line` below was read in
`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`; the two rows tagged
`(193)` are baseline-only and belong in a 2.1.193 index, not this one.

Source documents:
[`../30_agent_team/README.md`](../30_agent_team/README.md),
[`../30_agent_team/mailbox_transport_hardening.md`](../30_agent_team/mailbox_transport_hardening.md),
[`../30_agent_team/teammate_lifecycle_and_notifications.md`](../30_agent_team/teammate_lifecycle_and_notifications.md).

---

## Module: Agent Team — Mailbox transport

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ann | FAILURE_REASON_MAX_LENGTH | cli_inner_pretty.js:325666 | constant |
| bAo | mailboxPathModule | cli_inner_pretty.js:325696 | variable |
| cdr | MAILBOX_LOCK_OPTIONS | cli_inner_pretty.js:325697 | object |
| cxs | PROTOCOL_FRAME_PROMPT_ERROR | cli_inner_pretty.js:325676 | constant |
| ddr | createIdleNotification | cli_inner_pretty.js:325406 | function |
| exs | isIdleNotification | cli_inner_pretty.js:325418 | function |
| fdr | isShutdownRequest | cli_inner_pretty.js:325528 | function |
| fpt | markMessagesAsRead | cli_inner_pretty.js:325345 | function |
| gdr | getLastPeerDmSummary | cli_inner_pretty.js:325630 | function |
| Gid | describeEntryShape | cli_inner_pretty.js:325137 | function |
| GDy | DROP_KEY_MAX_CHARS | cli_inner_pretty.js:325663 | constant |
| H0t | getTeamsRootDir | cli_inner_pretty.js:14679 | function |
| jid | mailboxEntrySchema | cli_inner_pretty.js:325698 | object |
| KDy | schedulePruneOnce | cli_inner_pretty.js:325203 | function |
| ldr | messageIdentityKey | cli_inner_pretty.js:325342 | function |
| mnn | markMessagesAsReadByPredicate | cli_inner_pretty.js:325610 | function |
| mpt | formatTeammateMessages | cli_inner_pretty.js:325400 | function |
| qDy | reportDroppedEntryOnce | cli_inner_pretty.js:325158 | function |
| qid | partitionValidMailboxEntries | cli_inner_pretty.js:325185 | function |
| qze | readMailbox | cli_inner_pretty.js:325243 | function |
| SAo | markSingleMessageAsRead | cli_inner_pretty.js:325315 | function |
| snn | clearMailbox | cli_inner_pretty.js:325377 | function |
| udr | formatTeammateMessage | cli_inner_pretty.js:325392 | function |
| Use | isStructuredProtocolMessage | cli_inner_pretty.js:325581 | function |
| uxs | isHeadlessLeadDisplayableMessage | cli_inner_pretty.js:325607 | function |
| VDy | reportNonArrayInboxOnce | cli_inner_pretty.js:325173 | function |
| Vid | pruneInvalidMailboxEntries | cli_inner_pretty.js:325210 | function |
| Vze | IdleNotificationMessageSchema | cli_inner_pretty.js:325711 | object |
| VT | writeToMailbox | cli_inner_pretty.js:325267 | function |
| WDy | dropDedupKey | cli_inner_pretty.js:325150 | function |
| Wid | MAX_TRACKED_DROPS | cli_inner_pretty.js:325662 | constant |
| y1t | getInboxPath | cli_inner_pretty.js:325229 | function |
| YDy | ensureInboxDir | cli_inner_pretty.js:325237 | function |
| z0 | parseFrameForDisplay | cli_inner_pretty.js:325559 | function |
| zDy | flushPendingMailboxPrunes | cli_inner_pretty.js:325200 | function |
| _1t | readUnreadMessages | cli_inner_pretty.js:325262 | function |
| _Ao | inFlightPrunes | cli_inner_pretty.js:325710 | variable |
| adr | seenDrops | cli_inner_pretty.js:325709 | variable |

**Net-new in 2.1.220** (220>0 / 193=0): `Gid`, `WDy`, `qDy`, `VDy`, `qid`, `Vid`, `KDy`, `zDy`, `Wid`,
`GDy`, `_Ao`, `adr`, `ann`. Everything else in this table is carryover under a re-mangled name.

---

## Module: Agent Team — Message envelope

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| bLy | MESSAGE_WIRE_VERSION | cli_inner_pretty.js:319767 | constant |
| SLy | newMessageId | cli_inner_pretty.js:319761 | function |
| t1t | newMessageEnvelope | cli_inner_pretty.js:319764 | function |
| W0s | sendToUdsSocket | cli_inner_pretty.js:319863 | function |
| q0s | sendControlToUdsSocket | cli_inner_pretty.js:319881 | function |

All five are net-new as a group; `msg_id` is **220=10 / 193=0**.

---

## Module: Agent Team — Teammate lifecycle

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| BMs | classifyTurnApiFailure | cli_inner_pretty.js:530513 | function |
| C8y | findNextClaimableTask | cli_inner_pretty.js:396250 | function |
| DTo | anyOtherTeammateBusy | cli_inner_pretty.js:341674 | function |
| EKe | findTaskByAgentId | cli_inner_pretty.js:395949 | function |
| GMs | buildTeammateSpawnEnv | cli_inner_pretty.js:397036 | function |
| H8y | runInProcessTeammate | cli_inner_pretty.js:396406 | function |
| HKf | notifyLeaderOfFailedTurn | cli_inner_pretty.js:759398 | function |
| inl | initializeTeammateSession | cli_inner_pretty.js:759343 | function |
| Is | createEmitter | cli_inner_pretty.js:1968 | function |
| ite | extractAssistantText | cli_inner_pretty.js:532102 | function |
| k8y | waitForNextTeammateInput | cli_inner_pretty.js:396353 | function |
| kKf | initTeamContextFromSession | cli_inner_pretty.js:759309 | function |
| Kvd | claimNextOpenTask | cli_inner_pretty.js:396268 | function |
| NMs | TEAMMATE_SYSTEM_PROMPT_ADDENDUM | cli_inner_pretty.js:396113 | constant |
| olp | getTurnFailureReason | cli_inner_pretty.js:530510 | function |
| OMs | wakeRunningTeammate | cli_inner_pretty.js:396079 | function |
| Plp | sleepUntilRetryOrWake | cli_inner_pretty.js:534800 | function |
| qMs | warnTeammateModelNotAllowlisted | cli_inner_pretty.js:397181 | function |
| RKf | useTeammateInitialization | cli_inner_pretty.js:759430 | function |
| rve | updateTeammateTask | cli_inner_pretty.js:396240 | function |
| R8y | TEAMMATE_FORWARDED_ENV_VARS | cli_inner_pretty.js:397061 | constant |
| tdr | setMemberActive | cli_inner_pretty.js:324563 | function |
| T8y | sendToLeadMailbox | cli_inner_pretty.js:396243 | function |
| x8y | buildTaskClaimPrompt | cli_inner_pretty.js:396258 | function |
| xkm | getTeamTeardownParkTimeoutMs | cli_inner_pretty.js:844847 | function |
| xpr | hasLiveBackgroundWorkForAgent | cli_inner_pretty.js:341451 | function |
| Yse | TEAMMATE_EVICT_DELAY_MS | cli_inner_pretty.js:341922 | constant |
| Yvd | drainMailbox | cli_inner_pretty.js:396288 | function |
| Z2e | computeRetryDelay | cli_inner_pretty.js:534820 | function |
| zCe | makeAgentId | cli_inner_pretty.js:111476 | function |
| zMs | reserveTeammateIdentity | cli_inner_pretty.js:397222 | function |
| zvd | sendIdleNotificationToLead | cli_inner_pretty.js:396246 | function |
| Zvd | buildTeammateSpawnFlags | cli_inner_pretty.js:397199 | function |
| _mt | USER_INTERRUPT_TEXTS | cli_inner_pretty.js:534126 | constant |
| _u | makeApiErrorMessage | cli_inner_pretty.js:530704 | function |
| KU_ | RETRY_SLEEP_CHUNK_MS | cli_inner_pretty.js:535004 | constant |
| qU_ | RETRY_BASE_DELAY_MS | cli_inner_pretty.js:535000 | constant |

**Net-new in 2.1.220** (220>0 / 193=0): `BMs`, `olp`, `HKf`, `OMs`, `Plp`, `xkm`, `_mt` (as this
membership), plus the `retryWake` / `subscribeRetryWake` fields.

---

## Module: Agent Team — Leader-facing UI and validation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $hy | explainAgentFrontmatterError | cli_inner_pretty.js:269867 | function |
| BCu | addSessionHook | cli_inner_pretty.js:215741 | function |
| FCu | addSessionFunctionHook | cli_inner_pretty.js:215736 | function |
| JWu | parseAgentMarkdownFile | cli_inner_pretty.js:269945 | function |
| lfn | getInputRouting | cli_inner_pretty.js:514598 | function |
| NYe | getViewedTeammateTask | cli_inner_pretty.js:514595 | function |
| oa | truncate | cli_inner_pretty.js:160403 | function |
| qWf | buildLeaderCommandNotice | cli_inner_pretty.js:748982 | function |
| Tas | removeSessionHook | cli_inner_pretty.js:215762 | function |
| tWl | TEAMMATE_MODE_VALUES | cli_inner_pretty.js:58389 | constant |
| orn | TEAMMATE_MODE_DEFAULT | cli_inner_pretty.js:318739 | constant |
| uAo | TRANSCRIPT_REPLAY_CAP | cli_inner_pretty.js:324398 | constant |
| vid | appendOrReplaceByUuid | cli_inner_pretty.js:324394 | function |
| upt | appendCappedMessage | cli_inner_pretty.js:324386 | function |
| XWu | parseJsonAgentDefinition | cli_inner_pretty.js:269885 | function |

**Net-new in 2.1.220**: `qWf` only. `tWl`/`orn`/`uAo`/`vid`/`upt`/`BCu`/`FCu`/`Tas` are all carryover
under re-mangled names (see the carryover table in
[`../30_agent_team/README.md`](../30_agent_team/README.md) §1).

---

## Module: Agent Team — Shared helpers used by this module

Recorded because the agent-team docs cite them; they are owned by other themes and should be merged
only if the target index does not already carry them.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ie | jsonStringify | cli_inner_pretty.js:19815 | function |
| Ut | jsonParse | cli_inner_pretty.js:19851 | variable |
| Lr | TelemetrySafeError | cli_inner_pretty.js:19800 | class |
| xe | reportError | cli_inner_pretty.js:24955 | function |
| gp | collapseNewlines | cli_inner_pretty.js:20753 | function |
| pr | countWhere | cli_inner_pretty.js:24548 | function |
| fb | acquireFileLock | cli_inner_pretty.js:108725 | function |

---

## Feature gates / telemetry events added by this module

| Event | 220 | 193 | File:Line | Notes |
|---|---|---|---|---|
| `tengu_teammate_transient_turn_failure` | 1 | 0 | cli_inner_pretty.js:396707 | fields `error_kind`, `hold_evict` |
| `tengu_agent_view_leader_command_notice` | 1 | 0 | cli_inner_pretty.js:753903 | empty payload |
| `tengu_headless_team_teardown_park_timeout` | 1 | 0 | cli_inner_pretty.js:846516 | field `prompt_injected` |

## Environment variables added by this module

| Env var | 220 | 193 | Accessor | Read site | Default |
|---|---|---|---|---|---|
| `CLAUDE_CODE_TEAM_TEARDOWN_PARK_TIMEOUT_MS` | 2 | 0 | cli_inner_pretty.js:32054 | cli_inner_pretty.js:844848 | `1e4` |

## Baseline-only symbols (2.1.193 — do NOT add to the 2.1.220 index)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| KQa | addSessionHook (193) | cli_inner_pretty.js:397131 (193) | function |
| zQa | addSessionFunctionHook (193) | cli_inner_pretty.js:397126 (193) | function |
