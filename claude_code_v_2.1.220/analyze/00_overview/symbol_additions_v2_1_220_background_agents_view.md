# Symbol additions — v2.1.220 background agents, part 2 (agent view, `/fork`, notifications)

Staging file for the symbols discovered while writing
[`../36_background_agents/agent_view_and_status.md`](../36_background_agents/agent_view_and_status.md),
[`../36_background_agents/fork_to_background_session.md`](../36_background_agents/fork_to_background_session.md)
and
[`../36_background_agents/bg_notifications_and_reporting.md`](../36_background_agents/bg_notifications_and_reporting.md).

**Bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines, `VERSION 2.1.220`, `build_sha 4073f595`). **Every `File:Line` below is a line I read in
this bundle** — either as a function/constant definition line or as a definition range whose first line I
read. Nothing was carried over from the 2.1.193 tree; symbols are re-mangled every build and old ids get
reused, so all names here were re-derived from string / gate / structural anchors inside 2.1.220.

Part 1 of this theme stages its symbols separately in
[`symbol_additions_v2_1_220_background_agents_daemon.md`](symbol_additions_v2_1_220_background_agents_daemon.md);
if a symbol appears in both files, part 1's row wins for the daemon/worker/store modules.

**Merge routing** — each `## Module:` heading below carries the target `symbol_index_*.md`.

---

## Module: Background Agents — Agent View & Status

> **Merge into:** `symbol_index_core_features.md` (background agents)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Pn` | `classifyRowLane` | cli_inner_pretty.js:801986-801992 | function |
| `a7S` | `COMPACT_HEADER_ROWS` (2) | cli_inner_pretty.js:808501 | constant |
| `cfi` | `FleetActionUnconfirmedError` | cli_inner_pretty.js:808679-808684 | class |
| `Dpi` | `FULL_HEADER_ROWS` (4) | cli_inner_pretty.js:808500 | constant |
| `E5e` | `rowAgeText` (passes `nextAt` only for self-driving rows) | cli_inner_pretty.js:807247 | function |
| `GKS` | `ROWS_PER_NEEDS_ROW` (3) | cli_inner_pretty.js:802084 | constant |
| `HMr` | `prLinks` (filters out non-PR hrefs) | cli_inner_pretty.js:802774-802776 | function |
| `Hum` | `summarizeFan` (todo ratio preferred over agent ratio) | cli_inner_pretty.js:802069 | function |
| `kcl` | `mostRecentTerminalTimestamp` | cli_inner_pretty.js:801993-801999 | function |
| `kMr` | `resolveStateWord` (`Done`/`Failed`/`Stopped`/`Working`/`Needs input`/`Idle`) | cli_inner_pretty.js:803153-803160 | function |
| `kum` | `buildSimpleRows` (the `simple:*` band layout) | cli_inner_pretty.js:802011-802067 | function |
| `lO` | `sanitizeForTerminal` | cli_inner_pretty.js:803333 | function |
| `n7S` | `allocateFleetColumns` (age / label / artifact / flex detail) | cli_inner_pretty.js:802788-802794 | function |
| `nfi` | `classifyRowGroupByState` (live process first, LLM tempo last) | cli_inner_pretty.js:802918-802936 | function |
| `o7S` | `FLEET_SECTION_DESCRIPTIONS` | cli_inner_pretty.js:808672-808677 | object |
| `p7S` | `buildRowActions` (band-scoped key table) | cli_inner_pretty.js:803022-803123 | function |
| `qdm` | `fleetTerminalTitle` (`N awaiting input · claude agents`) | cli_inner_pretty.js:802909-802910 | function |
| `qKS` | `DONE_FOLD_MIN_HIDDEN` (2) | cli_inner_pretty.js:802086 | constant |
| `QYS` | `MIN_AGE_COL` (3) | cli_inner_pretty.js:808484 | constant |
| `r7S` | `prBadgeWidth` | cli_inner_pretty.js:802777-802787 | function |
| `r8t` | `rowLabel` (`session you came from` / `current session`) | cli_inner_pretty.js:802682-802705 | function |
| `rfi` | `resolveDoneCapAndHeader` (compacting header) | cli_inner_pretty.js:802912-802917 | function |
| `Rwt` | `FLEET_STATE_LABELS` (carryover map, byte-identical to 193) | cli_inner_pretty.js:808671 | object |
| `s7S` | `CHROME_ROWS` (8) | cli_inner_pretty.js:808499 | constant |
| `sfi` | `sessionAgeText` (`in 5m` countdown or frozen elapsed) | cli_inner_pretty.js:802677-802681 | function |
| `t7S` | `elapsedSince` | cli_inner_pretty.js:802672-802676 | function |
| `tdl` | `isPlaceholderDetail` | cli_inner_pretty.js:803330-803332 | function |
| `UKS` | `DONE_FOLD_MAX_AGE_MS` (172,800,000 = 48 h) | cli_inner_pretty.js:802082 | constant |
| `v5e` | `resolveStatusText` (needs > fan > detail, `clamp(24,72,0.55×cols)`) | cli_inner_pretty.js:807249-807260 | function |
| `Vdm` | `MIN_DONE_ROWS` (3) | cli_inner_pretty.js:808496 | constant |
| `VKS` | `EMPTY_STATE_ROWS` (4) | cli_inner_pretty.js:802087 | constant |
| `WKS` | `ROWS_PER_LIVE_ROW` (2) | cli_inner_pretty.js:802085 | constant |
| `Xdm` | `rowColorForState` (colour/dim projection of `resolveStateWord`) | cli_inner_pretty.js:803161-803164 | function |
| `YKS` | `computeDoneCap` | cli_inner_pretty.js:802008 | function |
| `Zdm` | `renderPrBadge` (`✗ 2/7` / `5/7` / `✓` + review word) | cli_inner_pretty.js:803190-803213 | function |
| `zKS` | `DONE_FOLD_ROWS` (1) | cli_inner_pretty.js:802088 | constant |

## Module: Background Agents — Roster row-state predicates

> **Merge into:** `symbol_index_core_features.md` (background agents)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `dm` | `isTerminalRow` (`isTerminalState(state) && tempo !== "active"`) | cli_inner_pretty.js:330978-330980 | function |
| `FEe` | `isSelfDriving` (routine / selfWake / `session_cron`) | cli_inner_pretty.js:331003-331005 | function |
| `FH` | `NEEDS_FIRST_PROMPT` (`send a prompt to start`) | cli_inner_pretty.js:331045 | constant |
| `JBe` | `isOneShotExecJob` (`template === "exec"`, no respawn flags) | cli_inner_pretty.js:330981-330983 | function |
| `Kdr` | `IDLE_DETAIL_PLACEHOLDER` (`(idle — send a prompt to start)`) | cli_inner_pretty.js:331238 | constant |
| `oD` | `outcomeOf` (`done`→success, `failed`→failure, `stopped`→stopped) | cli_inner_pretty.js:330969-330974 | function |
| `Wdr` | `TRANSIENT_STATES` (`starting`/`resuming`/`adopted`/`crashed`) | cli_inner_pretty.js:331238 | constant |
| `Ydr` | `isBlockedRespawnableJob` (`state === "blocked" && !isOneShotExecJob`) | cli_inner_pretty.js:330984-330986 | function |
| `zB` | `isTerminalState` | cli_inner_pretty.js:330975-330977 | function |

## Module: Background Agents — Status Classifier

> **Merge into:** `symbol_index_core_features.md` (background agents)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_Hs` | `heuristicClassifyTail` (last non-empty line → `working`) | cli_inner_pretty.js:334403-334412 | function |
| `acd` | `classifyTailShape` (independent telemetry bucket) | cli_inner_pretty.js:334269-334281 | function |
| `hA` | `DETAIL_MAX_CHARS` (800) | cli_inner_pretty.js:334461 | constant |
| `icd` | `CLASSIFIER_TAIL_MAX` (2000) | cli_inner_pretty.js:334462 | constant |
| `kHs` | `runClassifier` (preclassify → heuristic → 2-attempt LLM) | cli_inner_pretty.js:335956-336042 | function |
| `lcd` | `preclassifyTail` (17 deterministic branches, skips the LLM) | cli_inner_pretty.js:334282-334401 | function |
| `wOy` | `CLASSIFIER_STATE_DESCRIPTIONS` | cli_inner_pretty.js:334671-334679 | object |
| `WOy` | `WAIT_KIND_PRIORITY` (`sandbox`…`dialog`, first-match order) | cli_inner_pretty.js:334738 | constant |
| `xfe` | `waitRegistry` (six slots, emits on text change only) | cli_inner_pretty.js:334739-334760 | object |

## Module: Background Agents — Fork & Lineage

> **Merge into:** `symbol_index_core_features.md` (background agents)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `gGt` | `spawnBackgroundSessionFromConversation` (nine `keepParent` branches) | cli_inner_pretty.js:683672-683856 | function |
| `gnd` | `packResumeSourceAlive` (`sessionId\|boundaryAt\|parentSessionId`) | cli_inner_pretty.js:319489-319491 | function |
| `HJe` | `buildSpawnSeedFromMessages` (backwards scan, breaks early) | cli_inner_pretty.js:683968-683999 | function |
| `hrn` | `parseResumeSourceAlive` (tolerates the legacy 1-field form) | cli_inner_pretty.js:319492-319497 | function |
| `Ipa` | `normalizeForkNameForConfirmation` (splits on `⑂`, rejoins with `·`) | cli_inner_pretty.js:643595-643603 | function |
| `kJo` | `FORK_COORDINATOR_REFUSAL` (`… Use /branch instead.`) | cli_inner_pretty.js:684209 | constant |
| `NO` | `FORK_GLYPH` (`U+2442` OCR FORK) | cli_inner_pretty.js:58422 | constant |
| `Pvo` | `resolveForkLineageFromEnv` (validates then returns 4 roster fields) | cli_inner_pretty.js:319498-319508 | function |
| `RMr` | `rebuildTaskRegistryPostFork` (parent early-return + `> boundaryAt`) | cli_inner_pretty.js:809097-809113 | function |
| `U7S` | `rebuildBackgroundTaskRegistry` | cli_inner_pretty.js:809118 | function |
| `W7S` | `buildBatchedAgentResurrectionNotice` (the `.208 #21` collapse) | cli_inner_pretty.js:809383-809400 | function |
| `xpe` | `ENTER_WORKTREE_TOOL_NAME` (named in the fork's appended prompt) | cli_inner_pretty.js:230895 | constant |

## Module: Background Agents — Session confirmation line

> **Merge into:** `symbol_index_core_features.md` (background agents)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `EEb` | `SESSION_WAITING` (`session waiting`, the downgrade form) | cli_inner_pretty.js:643646 | constant |
| `l6p` | `MIN_NAME_COLUMNS` (20) | cli_inner_pretty.js:643649 | constant |
| `Lpa` | `shortenSessionConfirmationLine` (downgrade → drop id → floor name) | cli_inner_pretty.js:643622-643640 | function |
| `nEn` | `CONFIRMATION_SEPARATOR` (`" · "`) | cli_inner_pretty.js:643647 | constant |
| `Nwr` | `SESSION_WAITING_FOR_PROMPT` | cli_inner_pretty.js:643645 | constant |
| `rEn` | `SESSION_RUNNING` | cli_inner_pretty.js:643644 | constant |
| `Rpa` | `parseSessionConfirmationLine` (inverse of the formatter) | cli_inner_pretty.js:643604-643621 | function |
| `uVo` | `formatSessionConfirmationLine` (`state · name · id · chips`) | cli_inner_pretty.js:643641-643643 | function |

## Module: Background Agents — Notifications & Result Reporting

> **Merge into:** `symbol_index_core_features.md` (background agents)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Dum` | `useBackgroundAgentNotifications` (sends always, counts once) | cli_inner_pretty.js:802130-802141 | function |
| `edm` | `emitResultSeenTelemetry` (`list_open` vs `render`) | cli_inner_pretty.js:802458-802476 | function |
| `Hrm` | `markNotifiedOnce` (FIFO-evicting 200-entry `(sessionId, kind)` map) | cli_inner_pretty.js:771957-771965 | function |
| `hYS` | `hadConcurrentJob` (interval overlap for the `overlap` dimension) | cli_inner_pretty.js:802482-802492 | function |
| `iAe` | `showNotification` (hook first, terminal channel second) | cli_inner_pretty.js:576783-576820 | function |
| `jGe` | `classifyNotificationBand` (`active` / `blocked` / `completed`) | cli_inner_pretty.js:802903-802908 | function |
| `JKS` | `diffNotificationBands` (six-guard edge detector) | cli_inner_pretty.js:802100-802129 | function |
| `Jll` | `consumeNotificationTiming` (one-shot `ms_since_notification`) | cli_inner_pretty.js:771966-771970 | function |
| `Lum` | `IDLE_SEED` (`"idle-seed"` sentinel band) | cli_inner_pretty.js:802145 | constant |
| `pQ_` | `sniffTerminalNotifChannel` (`TERM_PROGRAM` → bell / native) | cli_inner_pretty.js:576821-576834 | function |
| `v6S` | `NOTIFIED_CAP` (200) | cli_inner_pretty.js:771971 | constant |
| `XKS` | `ASK_MAX` (120 — notification-body truncation of `needs`) | cli_inner_pretty.js:802144 | constant |
| `Zum` | `setResultSeenEntryChannel` (also resets the first-open snapshot) | cli_inner_pretty.js:802455-802457 | function |

## Module: Background Agents — Notification framing / injected-message prefixes

> **Merge into:** `symbol_index_core_features.md` (background agents)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `dZg` | `SCHEDULED_TASK_HEADER` (`[SCHEDULED TASK - AUTOMATED FIRING …]`) | cli_inner_pretty.js:226513 | constant |
| `Hcs` | `applyScheduledTaskPrefix` (yields to the stronger framing) | cli_inner_pretty.js:226508-226511 | function |
| `Hy` | `TASK_NOTIFICATION_TAG` (`"task-notification"`) | cli_inner_pretty.js:24717 | constant |
| `kcs` | `applySystemNotificationPrefix` (idempotent) | cli_inner_pretty.js:226504-226507 | function |
| `kNt` | `frameMidTurnMessage` (routes `task-notification` / `scheduled-trigger`) | cli_inner_pretty.js:533914-533918 | function |
| `x7r` | `SYSTEM_NOTIFICATION_PREFIX` (4 lines; the 4th is the `.205` delta) | cli_inner_pretty.js:226516-226521 | constant |
| `Zdo` | `SCHEDULED_TASK_PREFIX` | cli_inner_pretty.js:226522 | constant |

## Module: Background Agents — Shipping-policy prompt fragments

> **Merge into:** `symbol_index_core_features.md` (background agents)

Declared empty at `:224091-224095`, assigned inside the lazy initialiser `fRu` at `:224096-224110`.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ciw` | `WORKFLOW_SHIPPING_POLICY` (supersedes the Background Session policy) | cli_inner_pretty.js:224105-224109 | constant |
| `dRu` | `SHIP_DRAFT_PR` (`gh pr create --draft` without asking) | cli_inner_pretty.js:224097-224098 | constant |
| `fRu` | `initShippingPolicyStrings` (lazy initialiser) | cli_inner_pretty.js:224096-224110 | function |
| `pRu` | `SUBAGENT_SHIP_CARVE_OUT` | cli_inner_pretty.js:224099-224101 | constant |
| `Tiw` | `FEATURE_BRANCH_SHIPPING_POLICY` | cli_inner_pretty.js:224102-224104 | constant |
| `uRu` | `SHIP_PROHIBITIONS` (`Never push to main/master, force-push, or merge.`) | cli_inner_pretty.js:224091 | constant |

## Module: Background Agents — Footer nudge and waiting counts

> **Merge into:** `symbol_index_core_features.md` (background agents)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bMS` | `NUDGE_ATTRIBUTION_MS` (120,000 — `←` counts as acted-on) | cli_inner_pretty.js:750000 | constant |
| `EGe` | `renderAgentsFooterHint` (`← N agents` / `← N done` / `← for agents`) | cli_inner_pretty.js:750023-750153 | function |
| `EMS` | `NUDGE_SWEEP_MS` (10,000) | cli_inner_pretty.js:750002 | constant |
| `J6f` | `isFinishedRow` (self-driving success exempted) | cli_inner_pretty.js:749879-749881 | function |
| `Q6f` | `FleetNudgeStore` (`useSyncExternalStore` source) | cli_inner_pretty.js:749882-749984 | class |
| `SMS` | `NUDGE_IGNORED_AFTER_MS` (1,800,000 = 30 min) | cli_inner_pretty.js:750001 | constant |
| `vMS` | `isAwaitingUserInput` (footer needs-input predicate) | cli_inner_pretty.js:749876-749878 | function |
| `xci` | `FOOTER_PULSE_MS` (2,500) | cli_inner_pretty.js:750158 | constant |

## Module: Background Agents — Reply delivery and respawn row state

> **Merge into:** `symbol_index_core_features.md` (background agents)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Bcf` | `jobPresentInDaemon` | cli_inner_pretty.js:680844-680847 | function |
| `LTn` | `writeQueuedPrompt` (stamps `queuedPrompt` on the roster record) | cli_inner_pretty.js:681612-681617 | function |
| `lxr` | `applyReplyOptimistically` (clears `needs`/`block`/`output`) | cli_inner_pretty.js:680848-680860 | function |
| `Mcf` | `REPLY_QUEUED_SUFFIX` | cli_inner_pretty.js:681298 | constant |
| `Ocf` | `wasReplyQueued` (idempotent by content) | cli_inner_pretty.js:680867-680874 | function |
| `RTn` | `deliverReplyToBackgroundJob` (five-stage ladder, 10→60 attempts) | cli_inner_pretty.js:680875-680964 | function |
| `Ucf` | `daemonUnreachableText` | cli_inner_pretty.js:680861-680863 | function |
| `vIa` | `OTHER_TERMINAL_ERROR` | cli_inner_pretty.js:681297 | constant |
| `vSt` | `NOT_RUNNING_ERROR` | cli_inner_pretty.js:681296 | constant |
| `Z3e` | `deleteJob` (`{force:true}` from the agent view's `Ctrl+X`) | cli_inner_pretty.js:681118 | function |

## Module: Todo / Tasks — tracker retention

> **Merge into:** `symbol_index_core_features.md` (todo/tasks)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$6a` | `isAgentOrTeammateTask` | cli_inner_pretty.js:725784-725787 | function |
| `BQe` | `enterTranscriptView` (`retain: true, evictAfter: undefined`) | cli_inner_pretty.js:725793-725810 | function |
| `eFs` | `resolveTaskEvictAfter` (`retain` and `park` exemptions) | cli_inner_pretty.js:432598-432602 | function |
| `F6a` | `dismissTask` (`evictAfter: 0`; refuses while running) | cli_inner_pretty.js:725822-725835 | function |
| `Hpr` | `KILLED_EVICT_MS` (3,000) | cli_inner_pretty.js:341921 | constant |
| `ice` | `exitTranscriptView` (re-stamps the deadline from now) | cli_inner_pretty.js:725811-725821 | function |
| `N6a` | `releaseTaskRetention` | cli_inner_pretty.js:725789-725792 | function |
| `O6a` | `isLocalAgentTask` | cli_inner_pretty.js:725781-725783 | function |
| `oOf` | `TRANSCRIPT_VIEW_EVICT_MS` (30,000) | cli_inner_pretty.js:725836 | constant |
| `Yse` | `COMPLETED_EVICT_MS` (30,000) | cli_inner_pretty.js:341922 | constant |

## Module: Hooks — Notification event

> **Merge into:** `symbol_index_core_features.md` (hooks)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `h9` | `fireNotificationHook` (`notification_type` doubles as `matchQuery`) | cli_inner_pretty.js:518948-518952 | function |

## Module: Slash Commands — `/fork` and `/subtask`

> **Merge into:** `symbol_index_infra_integration.md` (slash commands)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `A_f` | `forkCommandModule` (the `{ call: () => forkCommandCall }` export) | cli_inner_pretty.js:695432 | variable |
| `KYb` | `forkCommandCall` (five-guard refusal ladder) | cli_inner_pretty.js:695530-695550 | function |
| `Lpn` | `spawnForkSubagent` (2.1.193's `/fork` spawner, now `/subtask`'s) | cli_inner_pretty.js:500337 | function |
| `mJd` | `FORK_COMMAND_DESCRIPTOR` (`argumentHint: "[prompt]"`) | cli_inner_pretty.js:500537-500543 | object |
| `NL_` | `subtaskCommandCall` (byte-equivalent to 193's `/fork` handler) | cli_inner_pretty.js:500547-500562 | function |
| `v_f` | `ForkProgressComponent` (runs the spawn once, prints the line) | cli_inner_pretty.js:695448 | function |

## Module: UI — left-arrow gesture, agent-view chrome, screen reader

> **Merge into:** `symbol_index_infra_integration.md` (UI components)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Fyp` | `applyLeftArrowGesture` (only writer of the gesture timestamps) | cli_inner_pretty.js:559664-559683 | function |
| `GV_` | `ATTACH_CONFIRM_MIN_MS` (150) | cli_inner_pretty.js:559686 | constant |
| `Jfo` | `markAttachQuietPending` (sets the `asr` pending flag) | cli_inner_pretty.js:239744-239746 | function |
| `kL` | `isScreenReaderModeEnabled` (makes the status budget `Infinity`) | cli_inner_pretty.js:156221-156223 | function |
| `LXr` | `isInAttachQuietWindow` — **stubbed `return !1`**, branch is dead | cli_inner_pretty.js:239750-239752 | function |
| `Nyp` | `classifyLeftArrowGesture` (fire / arm / absorb / reject) | cli_inner_pretty.js:559650-559663 | function |
| `Oyp` | `LEFT_ARROW_REPEAT_MS` (1,000) | cli_inner_pretty.js:559685 | constant |
| `Qfo` | `drainAttachQuietWindow` (returns on its first iteration) | cli_inner_pretty.js:239753-239759 | function |
| `qWf` | `getLeaderScopedCommandNotice` (`/model` and `/fast` only) | cli_inner_pretty.js:748982-748998 | function |
| `Rps` | `setAttachQuietStamp` (0 clears; honours the pending flag) | cli_inner_pretty.js:239736-239743 | function |
| `UXs` | `ARM_BANNER_MS` (3,000) | cli_inner_pretty.js:559684 | constant |
| `Vke` | `getAttachQuietStamp` (still feeds `freshEnough` despite the dead window) | cli_inner_pretty.js:239747-239749 | function |

## Module: Integrations — GitHub PR status for agent rows

> **Merge into:** `symbol_index_infra_integration.md` (Chrome/IDE/external integrations)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_Iy` | `resolvePrStatusViaGhCli` (`gh pr view --json …`) | cli_inner_pretty.js:316063-316078 | function |
| `AIy` | `resolvePrStatusDirect` (ETag cache, same-origin manual redirects) | cli_inner_pretty.js:316083-316164 | function |
| `Btd` | `reportPrAuthState` (edge-triggered `tengu_gh_pr_status_auth_state`) | cli_inner_pretty.js:316079-316082 | function |
| `Ktd` | `resolvePrStatusForBranch` (gate picks REST vs `gh`) | cli_inner_pretty.js:316054-316059 | function |
| `mur` | `prAuthHintText` (`gh auth login for PR status`) | cli_inner_pretty.js:316035-316042 | function |
| `rvo` | `prHealth` (`merged`/`inactive`/`error`/`warning`/…) | cli_inner_pretty.js:316241-316248 | function |

---

## Feature gates and telemetry events referenced (not symbols — for the gate index)

All counts are `220=N / 193=M`, both measured with `grep -c` in the two bundles.

| Gate / event | 220 | 193 | Read at | Meaning |
|---|---|---|---|---|
| `tengu_agent_view_leader_command_notice` | 1 | 0 | `:753903` | `/model`/`/fast` scope notice shown |
| `tengu_bg_agent_notification` | 2 | 0 | `:802140` | one per de-duplicated `(session, kind)` |
| `tengu_bg_reply_outcome` | 2 | 0 | `:680878` | `ok`/`sad`/`bad` + `error_code` |
| `tengu_bg_result_seen` | 1 | 0 | `:802466` | `list_open` vs `render`, `seen_latency_ms` |
| `tengu_fleet_past_sessions` | 1 | 0 | `:157288` | `/resume` past-session picker in the view |
| `tengu_fleetview_earlier_loaded` | 1 | 0 | `:804655` | count of past sessions found |
| `tengu_fleetview_earlier_open` | 1 | 0 | `:805974` | `{ms_since_mount, via}` |
| `tengu_fleetview_empty_state_shown` | 1 | 0 | `:806152` | `{skeleton, has_origin}` |
| `tengu_fleetview_simple` | 1 | 0 | `:804433` | the `simple:*` layout gate (default `false`) |
| `tengu_fleetview_stdin_contention` | 1 | 0 | `:804439` | `readable` listener count > 1, sampled once |
| `tengu_left_arrow_editing_guard` | 1 | 0 | `:559928` | default `true`; arms the `Press ← again` confirm |
| `fleet_needs_input_nudge` | 2 | 0 | `:749921`, `:749971` | success within 2 min / `ignored` after 30 min |
| `agent_needs_input` (notification type) | 2 | 0 | `:802112` | hook matcher value; message built `:802111` |
| `agent_completed` (notification type) | 3 | 1 | `:802120` | hook matcher value; message built `:802119`. The single 193 hit is not this site |
