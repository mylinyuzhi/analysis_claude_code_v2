# Agent Team runtime and deltas — v2.1.220

Module owner: the **team / leader / teammate layer** — the mailbox transport between a lead and its
teammates, the teammate lifecycle state machine, and the leader-facing notification and command
surfaces.

**Not this module** (link, do not duplicate):

| Concern | Owner |
|---|---|
| `claude agents`, the background daemon, worktrees, agent-view rows | [`../36_background_agents/`](../36_background_agents/README.md) |
| Spawn depth, concurrency/session caps, `Task` delegation limits, the removed `/agents` wizard | [`../53_subagent_limits/`](../53_subagent_limits/README.md) |
| The `SendMessage` **pin guard** (`.199` misrouting on name reuse) | [`../04_tools/web_and_misc_tools_deltas.md`](../04_tools/web_and_misc_tools_deltas.md) |
| Team **memory** sync (`tengu_team_mem_*`) | `31_auto_memory` (see §4 — it is a mis-anchor for our `.207` bullet) |
| Retry/backoff policy that the teammate wake interrupts | [`../57_api_reliability/`](../57_api_reliability/) |

Documents:

1. **[`team_orchestration_runtime.md`](team_orchestration_runtime.md)** — the current 2.1.220 control
   plane: implicit startup teams, team/task identity, transactional teammate reservation, backend
   selection, the persistent in-process state machine, autonomous task claiming, and session-owned
   cleanup. It also establishes exactly where the older readable `TeamCreate`/`TeamDelete` lifecycle
   does not describe 2.1.220.
2. **[`mailbox_transport_hardening.md`](mailbox_transport_hardening.md)** — the wire format, the file
   layout, the `.207` crash loop derived end-to-end, and the ~90 lines of net-new validation, pruning,
   deduplicated telemetry and write-side refusal that fixed it. Also the undocumented
   `{msgV, msg_id}` message envelope.
3. **[`teammate_lifecycle_and_notifications.md`](teammate_lifecycle_and_notifications.md)** — the
   turn-failure classifier, the eviction hold, the retry-wake chain, the one-property fix for duplicate
   idle notifications, the `/model` `/fast` agent-view notice, the NFKC colon guard on agent names, the
   `SendMessage` tool-result truncation, and the undocumented headless teardown park.

The first document describes the complete current runtime. The latter two prove the 2.1.193 → 2.1.220
deltas and defensive fixes within that runtime.

---

## 1. Per-bullet ledger

Verdict vocabulary: **IMPLEMENTED** (net-new code, anchored) · **DELTA** (mature machinery, one
narrow change, anchored) · **CARRYOVER** (headline literal already in 2.1.193) · **UNANCHORED**
(no literal, constant or gate found).

| # | Changelog bullet | Ver | Verdict | Anchor (220 / 193) | Doc section |
|---|---|---|---|---|---|
| 1 | *a teammate that dies on an API error now reports "failed" to the lead* | .198 | **IMPLEMENTED** | `apiErrorIsTransient` **6/0**; `failed idle notification` **2/0**; `HKf` `:759398`; `BMs` `:530513` | lifecycle §1 |
| 2 | *…and messaging a stuck teammate wakes it to retry immediately* | .198 | **IMPLEMENTED** | `retryWake` **6/0** (`:396079`); `subscribeRetryWake` **9/0** (`:534801`) | lifecycle §2 |
| 3 | *typing `/model` or `/fast` while viewing a subagent silently opening the lead's model picker — a notice now explains* | .199 | **IMPLEMENTED** | `tengu_agent_view_leader_command_notice` **1/0** (`:753903`); `agent-view-command-notice` **1/0**; `qWf` `:748982` | lifecycle §4 |
| 4 | *crash loop … malformed teammate mailbox message … repeated errors every second until the mailbox file was manually deleted* | .207 | **IMPLEMENTED** | `dropped schema-invalid inbox entry` **1/0** (`:325163`); `refused mailbox write` **4/0**; `pruneInvalidMailboxEntries` **1/0** (`:325210`) | mailbox §1–2 |
| 5 | *a stopping teammate could send the leader duplicate idle notifications when team initialization re-ran within a session* | .212 | **DELTA** (one property) | `teammate-idle-notification` **1/0** (`:759395`). Trap: `Skipping duplicate idle notification` **1/1**; `function-hook-` **1/1** | lifecycle §3 |
| 6a | *`SendMessage` bodies no longer duplicated into … tool results* | .212 | **DELTA** | `content: oa(t, 50)` `:418067` vs `content: t` `:441879 (193)`; `oa` `:160403` | lifecycle §6.1 |
| 6b | *…no longer duplicated into replayed history…* | .212 | **UNANCHORED** | replay cap `uAo=50` **1/1** (193 `gWn=50`); `vid`≡`EVa`; `nF_` stub ≡ 193 `Wuf` stub | lifecycle §6.2 |
| 7 | *agent markdown files reject agent names containing `:`, reserved for plugin namespacing* | .218 | **IMPLEMENTED** | `reserved for plugin namespacing` **2/0** (`:269872`, `:269957`) — **ledger says 3/1, re-measured 2/0** | lifecycle §5 |

### Undocumented changes found in this layer (no bullet claims them)

| Change | Anchor (220 / 193) | Doc section |
|---|---|---|
| `{msgV: 1, msg_id: <uuid>}` envelope on every mailbox entry **and** every UDS peer message | `msg_id` **10/0** (`t1t` `:319764`) | mailbox §3 |
| `failureReason` newline-collapsed and truncated to 200 chars | `FAILURE_REASON_MAX_LENGTH` **1/0** (`ann = 200`, `:325666`) | mailbox §4 |
| Eviction hold for transient failures (`evictAfter: undefined`) | `hold_evict` **1/0** (`:396707`); `tengu_teammate_transient_turn_failure` **1/0** | lifecycle §1.2 |
| Headless team-teardown park with a 10 s deadline | `CLAUDE_CODE_TEAM_TEARDOWN_PARK_TIMEOUT_MS` **2/0**; `tengu_headless_team_teardown_park_timeout` **1/0** (`:846516`) | lifecycle §7 |
| `--teammate-mode` **no longer forwarded** to spawned pane teammates | `` t.push(`--teammate-mode ${l}`) `` present `:428508 (193)`, absent from `Zvd` `:397199-397221` | lifecycle §0 |
| Teammate spawn env gained the `anthropic_google_cloud` family and a host-managed scrub set | `R8y` `:397061-397080`; scrub `:397038-397044` | lifecycle §0 |

### Carryover confirmed (do not write these up as deltas)

| Subject | 220 | 193 | Note |
|---|---|---|---|
| `teammateMode` (setting, enum, default, CLI flag, iTerm2 diagnostics) | 17 | 17 | same 4 members, same `"in-process"` default, byte-identical description |
| `Skipping duplicate idle notification` | 1 | 1 | the guard is old; the `.212` fix is elsewhere |
| `function-hook-` / replace-by-id hook machinery | 1 | 1 | `BCu` ≡ `KQa` |
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` | 4 | 4 | the feature flag itself did not move |
| `PROTOCOL_FRAME_PROMPT_ERROR` (`cxs`, `:325676`) | 1 | 1 | *"Teammate prompt must not be a mailbox protocol frame…"* |
| `messageIdentityKey`, `markMessagesAsReadByPredicate`, `getLastPeerDmSummary`, `isHeadlessLeadDisplayableMessage`, `TeammateTerminatedMessageSchema`, `TaskCompletedMessageSchema` | 1 each | 1 each | the untouched half of the mailbox module |
| `**/.claude/mailbox/` ignore entry | 1 | 1 | and it names a directory the code never writes to |
| Turn-replay cap of 50 messages on resume | 1 | 1 | `uAo` ≡ `gWn` |
| `teammate_mailbox` attachment generator | stub | stub | both builds ship `return []` |
| Teammate evict delay 30 000 ms | `Yse` `:341922` | `Rde` `:446879 (193)` | value unchanged; only the *conditionality* is new |

---

## 2. The shape of the delta

`teammate` is **220=426 / 193=385** and `mailbox` is **220=48 / 193=19**. Read together those two
numbers are the whole story: the *team* surface barely grew, while the *mailbox* surface grew 2.5×.
Almost every agent-team change in this 25-release window is **defensive hardening of the message
transport and the failure-attribution path**, not new capability. There is no new team command, no new
role, no new protocol frame type: `isStructuredProtocolMessage` (`Use`, `:325581-325601`) enumerates the
same ten frame types as 2.1.193.

Three cross-cutting patterns, each visible in more than one bullet:

1. **Validate at both ends of the wire.** `.207` added `safeParse` on read *and* on write. This is
   belt-and-braces on purpose: the read side protects a *current* build from a *legacy or foreign*
   writer (another `claude` process, possibly an older version, sharing `~/.claude/teams/`), and the
   write side stops the current build from minting new poison.
2. **Attribute failures instead of hiding them.** `.198`'s classifier, the `"failed"` idle reason, the
   `failureReason` field, `tengu_teammate_transient_turn_failure` and the `hold_evict` telemetry field
   all exist so the leader — and Anthropic's fleet telemetry — can tell a teammate that *finished* from
   one that *gave up*. In 2.1.193 both reported `"available"`.
3. **Make registration idempotent rather than adding cleanup.** `.212`'s duplicate-notification fix and
   `.207`'s single-flight prune map are the same instinct applied to different problems: given a caller
   that may fire N times, make the Nth call a no-op instead of trying to guarantee it fires once.

---

## 3. Method notes for anyone re-checking this module

- **Two teammate backends, one protocol.** A bullet that says "teammate" may live in `H8y`
  (`:396406`, in-process — the default) or in the `[TeammateInit]` cluster (`:759343+`, tmux/iTerm2
  panes). `.198`'s failure report is in the *pane* path; `.212`'s duplicate notification is *also* in
  the pane path; the eviction hold is *only* in the in-process path. Grepping one and concluding is how
  you get half a bullet.
- **The `.207` fix has no `tengu_*` gate.** It reports through `reportError` + `TelemetrySafeError`
  (`Lr`, `:19800`). Searching the 324-new-gate list for it returns nothing, which is not evidence of
  absence.
- **`idleReason: "failed"` is 2/1, and the ternary at `:396719` is invisible to that grep.** Literal
  counting under-reports this bullet by one site. Always read the surrounding expression.
- **Team memory is a different subsystem.** `tengu_team_mem_*` is **220=18 / 193=23** — it *shrank*.
  Four of its gates are new (`_conflict_recovered`, `_foreign_partition_recovered`,
  `_push_delete_deferred`, `_conflict_notice_delivered`) but none is reachable from `readMailbox`,
  `writeToMailbox` or the poll loop.

---

## 4. Corrections to the scoping data

Recorded here so the cross-validation pass can reconcile them.

| Source | Claim | Measured in both bundles | Consequence |
|---|---|---|---|
| [`_scope_v206_210.md`](../00_overview/_scope_v206_210.md) row 10 | `.207` mailbox crash loop → anchor `tengu_team_mem_conflict_recovered` (`:435325`) | the gate is real and 1/0, but `:435325` is inside **team-memory sync**, not the mailbox | the correct anchors are the mailbox quarantine cluster `:325137-325228`; see mailbox §5 |
| [`_scope_v215_220.md`](../00_overview/_scope_v215_220.md) row 33 and [`_false_delta_ledger.md`](../00_overview/_false_delta_ledger.md) `agent_team` row | `reserved for plugin namespacing` **220=3 / 193=1** | **220=2 / 193=0** (`:269872`, `:269957`) | the `.218` bullet is a *cleaner* net-new than recorded; the 193 hit was probably the unrelated `Marketplace name "skills-dir" is reserved for plugins…` at `:54952 (193)` |
| [`_scope_v211_214.md`](../00_overview/_scope_v211_214.md) row 26 | `.212` duplicate idle notifications → "220 adds hold-evict + `failureReason`" | hold-evict and `failureReason` are real, but they belong to the **in-process** runner and to `.198` | the `.212` bullet's own fix is `id: "teammate-idle-notification"` (`:759395`), a single property; see lifecycle §3 |
| [`_scope_v211_214.md`](../00_overview/_scope_v211_214.md) row 38 | `.212` `SendMessage` duplication → "dedup point not pinned to a literal" | half of it *is* pinnable: `content: oa(t, 50)` `:418067` vs `content: t` `:441879 (193)` | tool-result half **DELTA**; replayed-history half remains **UNANCHORED** |

---

## 5. Not covered, and why

- **Team-memory sync (`tengu_team_mem_*`).** Four net-new gates exist (`:434886`, `:435325`, `:435528`,
  `:436615`) and the subsystem is large (`:434700-436640`). It is a *shared store* feature, not the
  team control plane, it maps to no agent-team changelog bullet in this window, and `31_auto_memory` is
  the natural owner. Only the mis-anchor is recorded (§4).
- **The five *removed* team gates.** `tengu_team_discovery`, `tengu_team_mem_entries_capped`,
  `tengu_team_mem_secret_skipped`, `tengu_team_mem_sync_pull`, `tengu_team_mem_sync_push` are all
  **220=0 / 193>0** — they sit in the raw asset diff's **GONE (42)** section (lines 443-447), not the
  NEW section. `tengu_team_discovery` in particular was a *gate* (`if (!it("tengu_team_discovery",
  !1)) return;` `:363643 (193)`) guarding a whole discovery path, so its disappearance means the
  feature was either promoted to unconditional or deleted. Net for team memory: **5 gates out, 4 in**
  (`_conflict_recovered`, `_conflict_notice_delivered`, `_foreign_partition_recovered`,
  `_push_delete_deferred`) — a rationalisation, not an expansion. Tracing what happened to the
  discovery path belongs with whoever owns team memory; it is recorded here so it is not lost.
- **The 9 new `SendMessage` sites** beyond the tool-result truncation. Most are roster-pinning and
  peer-addressing, already documented by `04_tools`; auditing them site-by-site was out of budget.
- **The `SendMessage` peer/bridge path** (`:418660-418760`, `NIo` resume map, `agent-evicted` arm). It
  overlaps heavily with `36_background_agents`' resume machinery and was left to that module; only its
  two `retryWake?.emit()` calls are cited here.
- **`isolatePeerMachines`** (`:61505-61511`) — the cross-machine `SendMessage` gate. Present in both
  builds' settings schema; no bullet in this window; not measured further.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> All symbols discovered by this module are staged in
> [`symbol_additions_v2_1_220_agent_team.md`](../00_overview/symbol_additions_v2_1_220_agent_team.md)
> for merge into `symbol_index_core_features.md`.

Key entry points for this module:
- `readMailbox` (`qze`, `:325243`) - validating inbox read
- `writeToMailbox` (`VT`, `:325267`) - validating inbox write, returns `msg_id`
- `partitionValidMailboxEntries` (`qid`, `:325185`) - the `.207` fix's core
- `pruneInvalidMailboxEntries` (`Vid`, `:325210`) - background repair
- `newMessageEnvelope` (`t1t`, `:319764`) - `{msgV, msg_id}`
- `classifyTurnApiFailure` (`BMs`, `:530513`) - the `.198` classifier
- `notifyLeaderOfFailedTurn` (`HKf`, `:759398`) - pane-teammate failure report
- `wakeRunningTeammate` (`OMs`, `:396079`) / `sleepUntilRetryOrWake` (`Plp`, `:534800`) - the wake chain
- `initializeTeammateSession` (`inl`, `:759343`) - the `.212` fix site
- `buildLeaderCommandNotice` (`qWf`, `:748982`) - the `.199` notice
- `parseAgentMarkdownFile` (`JWu`, `:269945`) - the `.218` NFKC colon guard
