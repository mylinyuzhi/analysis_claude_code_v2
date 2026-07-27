# Symbol additions — v2.1.220 Remote Control

Staging file for the symbols discovered while writing
[`../54_remote_control/README.md`](../54_remote_control/README.md),
[`../54_remote_control/transport_and_session_lifecycle.md`](../54_remote_control/transport_and_session_lifecycle.md),
[`../54_remote_control/security_and_enablement.md`](../54_remote_control/security_and_enablement.md)
and
[`../54_remote_control/client_surfaces.md`](../54_remote_control/client_surfaces.md).

**Bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines, `VERSION 2.1.220`, `build_sha 4073f595`). **Every `File:Line` below is a line I read in
this bundle.** Nothing was carried over from the 2.1.193 tree; symbols are re-mangled every build and
old ids get reused, so every name here was re-derived from a string literal, telemetry gate, endpoint
path or structural anchor inside 2.1.220.

Rows tagged **(dead)** are declarations that exist in the shipped binary but sit behind a `null`
sentinel and can never execute — see `../54_remote_control/client_surfaces.md` §1. They are recorded so
that a future reader who greps them does not mistake presence for liveness.

**Merge routing** — each `## Module:` heading below carries the target `symbol_index_*.md`.

---

## Module: Remote Control — Transport (CCRClient + SSE)

> **Merge into:** `symbol_index_infra_integration.md` (Remote Control is an external-client integration,
> sibling to Chrome/IDE)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `A$s` | `classifyTaskStatusBatch` (edge-vs-level metric attribution) | cli_inner_pretty.js:415578-415585 | function |
| `A7y` | `MAX_SERVER_HEARTBEAT_MS` (300000) | cli_inner_pretty.js:416215 | constant |
| `aln` | `SSE_POST_RETRY_ATTEMPTS` (10) | cli_inner_pretty.js:416387 | constant |
| `D7y` | `SSE_RECONNECT_BASE_MS` (1000) | cli_inner_pretty.js:416383 | constant |
| `E7y` | `DEFAULT_HEARTBEAT_INTERVAL_MS` (20000) | cli_inner_pretty.js:416213 | constant |
| `iln` | `CCRClient` (worker-side Remote Control client) | cli_inner_pretty.js:415586 | class |
| `k7y` | `PRE_EXIT_INTERNAL_FLUSH_MS` (3000) | cli_inner_pretty.js:416223 | constant |
| `Lkd` | `REMOTE_CONTROL_SESSION_CONFIG_DEFAULTS` (14 fields) | cli_inner_pretty.js:415327-415342 | object |
| `lln` | `SSETransport` (inbound frame stream) | cli_inner_pretty.js:416401 | class |
| `M7y` | `SSE_PERMANENT_STATUSES` (`new Set([401,403,404])`) |  cli_inner_pretty.js:416400 | constant |
| `Nkd` | `isRetriableWorkerRegisterFailure` | cli_inner_pretty.js:415575-415577 | function |
| `O7y` | `SSE_POST_BACKOFF_BASE_MS` (500) | cli_inner_pretty.js:416388 | constant |
| `Okd` | `MAX_EPHEMERAL_STREAM_EVENT_BYTES` (61440) | cli_inner_pretty.js:416217 | constant |
| `oln` | `EventUploadQueue` (batching queue, backpressure, drop breaker) | cli_inner_pretty.js:415372 | class |
| `P7y` | `SSE_RECONNECT_CAP_MS` (30000) | cli_inner_pretty.js:416384 | constant |
| `rmt` | `RemoteControlClientError` (`reason`, `httpStatus`) | cli_inner_pretty.js:416219 | class |
| `S7y` | `REMOTE_CONTROL_SESSION_CONFIG_SCHEMA` (clamping zod) | cli_inner_pretty.js:415343-415368 | function |
| `tmt` | `isPermanentClientStatus` (400/413/422) | cli_inner_pretty.js:415566-415568 | function |
| `Ukd` | `SSE_LIVENESS_TIMEOUT_MS` (45000) | cli_inner_pretty.js:416385 | constant |
| `v$s` | `MAX_PRESERVED_EVENT_IDS` (1536) | cli_inner_pretty.js:416218 | constant |
| `v7y` | `MIN_SERVER_HEARTBEAT_MS` (10000) | cli_inner_pretty.js:416214 | constant |
| `w7y` | `STREAM_EVENT_COALESCE_MS` (100) | cli_inner_pretty.js:416216 | constant |
| `x7y` | `WORKER_STATE_PREFETCH_BUDGET_MS` (10000) | cli_inner_pretty.js:416222 | constant |
| `$7y` | `SSE_POST_BACKOFF_CAP_MS` (8000) | cli_inner_pretty.js:416389 | constant |
| `$kd` | `errorNameOf` (error → code/name) | cli_inner_pretty.js:415569-415574 | function |

`CCRClient` methods (all on `iln`, cited by their own definition line):

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `iln.closeExceptInternalEvents` | phase-1 shutdown (keeps the internal-event queue alive) | cli_inner_pretty.js:416184-416192 | function |
| `iln.handleEpochMismatch` | 409 → diagnostic → `onEpochMismatch()` (default `process.exit(1)`) | cli_inner_pretty.js:415932-415939 | function |
| `iln.initialize` | reads `CLAUDE_CODE_WORKER_EPOCH`, registers, starts the heartbeat | cli_inner_pretty.js:415751-415817 | function |
| `iln.paginatedGet` | cursor pagination with `after_event_id` anchor fallback | cli_inner_pretty.js:416055-416109 | function |
| `iln.registerShutdownCleanup` | phase-2 pre-exit flush, 3 s budget | cli_inner_pretty.js:416193-416202 | function |
| `iln.request` | shared request path; `{ timeout, parseBody }` options | cli_inner_pretty.js:415828 | function |
| `iln.sendHeartbeat` | closed-guard + server-driven interval adoption | cli_inner_pretty.js:415955-415981 | function |
| `iln.startHeartbeat` | refuses to arm on a closed client | cli_inner_pretty.js:415940-415951 | function |
| `lln.handleConnectionError` | header-refreshing exponential reconnect | cli_inner_pretty.js:416610-416631 | function |
| `lln.handleSSEFrame` | envelope-vs-payload vetting + veto | cli_inner_pretty.js:416571-416609 | function |
| `lln.onLivenessTimeout` | 45 s silence watchdog | cli_inner_pretty.js:416632-416640 | function |

---

## Module: Remote Control — Session state & wire schemas

> **Merge into:** `symbol_index_infra_integration.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Bkm` | `isStaleArchivedEndSession` (`epoch>1 && reason==="archived"`) — carryover | cli_inner_pretty.js:844945-844947 | function |
| `bkd` | `respondToBridgeControlRequest` (bridge control-request responder) | cli_inner_pretty.js:414723 | function |
| `H7y` | `foldBlockedPostTurnSummaryToNeedInput` | cli_inner_pretty.js:416204-416208 | function |
| `I7y` | `hasStatusCategory` | cli_inner_pretty.js:416209-416211 | function |
| `jkd` | `parseWorkSecret` (base64url, `version: 1`, `session_ingress_token`) | cli_inner_pretty.js:416727-416739 | function |
| `LIo` | `sessionIdSuffixMatches` (last `_`-segment, ≥4 chars) | cli_inner_pretty.js:416740-416745 | function |
| `mdE` | `BackgroundTasksChangedSchema` (REPLACE-semantics level event) | cli_inner_pretty.js:837667-837683 | function |
| `Ukm` | `isRespawnedWorker` (`epoch > 1`) | cli_inner_pretty.js:844948-844950 | function |
| `cln` | `buildSessionUrl` (`${base}/v1/code/sessions/${id}`) | cli_inner_pretty.js:416746-416748 | function |
| `F7y` | `stripStreamSuffixFromUrl` | cli_inner_pretty.js:416378-416382 | function |

> **`mdE` detail:** `subtype: v.literal("background_tasks_changed")` at `:837671`, the `tasks` array
> shape at `:837673`, and the design-rationale `.describe()` (edge-vs-level, per-process reset) at
> `:837681`.

---

## Module: Remote Control — Enablement, provider gating, blockers

> **Merge into:** `symbol_index_infra_platform.md` (provider selection / auth adjacency)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bk` | `isBridgeEnabled` | cli_inner_pretty.js:535467-535471 | function |
| `C7r` | `getBridgeEntitlementBlocker` (`not_signed_in` / `api_key_auth` / `no_profile_scope` / `not_in_rollout`) | cli_inner_pretty.js:535454-535460 | function |
| `cmn` | `getRemoteControlPolicyVerdict` (`allow_remote_control` → allowed/denied/unavailable) | cli_inner_pretty.js:535726-535732 | function |
| `dGr` | `isActualFirstPartyAnthropicBaseUrl` | cli_inner_pretty.js:100362-100366 | function |
| `DNt` | `isCcrV2SessionCrudEnabled` (220-only export) | cli_inner_pretty.js:535428 | function |
| `DVe` | `isBridgeFirstParty` (**the `.196` fix**) | cli_inner_pretty.js:535447-535450 | function |
| `dzs` | `isPolicyLimitsCacheLoaded` | cli_inner_pretty.js:535733-535736 | function |
| `ecp` | `UNSET_IT_HINT` (singular remediation suffix) | cli_inner_pretty.js:535811 | constant |
| `gbr` | `isClaudeAiSubscriber` | cli_inner_pretty.js:535682-535688 | function |
| `H4_` | `buildRemoteControlProviderBlocker` (**the `.219` five-way branch**) | cli_inner_pretty.js:535656-535673 | function |
| `hkt` | `shouldPropagateTraceparent` (a `Yd` consumer, for contrast with `DVe`) | cli_inner_pretty.js:100375-100377 | function |
| `I4_` | `_resetDiagnosticPolicyKickForTesting` | cli_inner_pretty.js:535703-535705 | function |
| `KUo` | `hasProfileScope` | cli_inner_pretty.js:535689-535695 | function |
| `mbr` | `RC_FIRST_PARTY_ONLY` (`"Remote Control is only available when using Claude via api.anthropic.com."`) | cli_inner_pretty.js:535810 | constant |
| `NDt` | `hasBridgeEntitlement` (`DVe() && gbr() && Ke("tengu_ccr_bridge", !1)`) | cli_inner_pretty.js:535451-535453 | function |
| `ncp` | `kickPolicyLimitsLoad` (cold-await with timeout) | cli_inner_pretty.js:535706-535725 | function |
| `pJt` | `THIRD_PARTY_PROVIDER_ENV_VARS` (6 entries) | cli_inner_pretty.js:100393-100400 | object |
| `Qdo` | `describeAuthPrecedenceBlocker` (carryover auth-half precedent) | cli_inner_pretty.js:535639-535655 | function |
| `qUo` | `isRemoteControlForceEnabled` (hard override, always `!1`) | cli_inner_pretty.js:535461-535463 | function |
| `S1e` | `hostIsFirstParty` (`["api.anthropic.com"].includes(host)`) | cli_inner_pretty.js:100367-100373 | function |
| `T4_` | `getBridgeAuthDebugInfo` (`/doctor` auth-state dump) | cli_inner_pretty.js:535519 | function |
| `tcp` | `UNSET_THEM_HINT` (plural remediation suffix) | cli_inner_pretty.js:535812 | constant |
| `uzs` | `getOAuthAccount` | cli_inner_pretty.js:535696-535702 | function |
| `VUo` | `getBridgeDisabledReason` (13-rung eligibility ladder) | cli_inner_pretty.js:535477-535518 | function |
| `Yd` | `assumeOrCheckFirstPartyBaseUrl` (honours `_CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL`) | cli_inner_pretty.js:100358-100361 | function |
| `YBt` | `isRemoteControlHardDisabled` (managed `disableRemoteControl`) | cli_inner_pretty.js:535464-535466 | function |
| `ZK` | `PROVIDER_DISPLAY_NAMES` (7 entries incl. `anthropicGoogleCloud`) | cli_inner_pretty.js:100384-100392 | object |
| `zUo` | `hasClaudeAiInferenceScope` | cli_inner_pretty.js:535675-535681 | function |

---

## Module: Remote Control — Slash command & CLI entrypoint

> **Merge into:** `symbol_index_infra_integration.md` (slash commands)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `FBt` | `BRIDGE_LOGIN_HINT` (`"/login"`) | cli_inner_pretty.js:498071 | constant |
| `i_r` | `BRIDGE_LOGIN_ERROR` (used by the `claude rc` entrypoint at `:546777`) | cli_inner_pretty.js:498069 | constant |
| `iP_` | `REMOTE_CONTROL_COMMAND` (`name: "remote-control"`, `aliases: ["rc"]`) | cli_inner_pretty.js:503373-503388 | object |
| `NBt` | `BRIDGE_LOGIN_INSTRUCTION` | cli_inner_pretty.js:498066-498067 | constant |
| `oP_` | `isRemoteControlCommandEnabled` (**the `.206` logged-out carve-out**) | cli_inner_pretty.js:503352-503366 | function |
| `xve` | `REMOTE_CONTROL_DISCONNECTED_MSG` | cli_inner_pretty.js:498070 | constant |

---

## Module: Remote Control — Nudges and upsells (growth surface, NOT correctness)

> **Merge into:** `symbol_index_infra_integration.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_5a` | `recordRemoteControlPermissionNudgeShown` | cli_inner_pretty.js:720540-720543 | function |
| `_Lf` | `resolveRemoteControlLongTurnNudgeConfig` (90 s default, 5…3600 clamp, 07:00–21:00 window) | cli_inner_pretty.js:720442-720468 | function |
| `ALf` | `canShowRemoteControlLongTurnNudge` | cli_inner_pretty.js:720515-720523 | function |
| `bLf` | `isWithinNudgeDayWindow` | cli_inner_pretty.js:720469-720473 | function |
| `CLf` | `canShowRemoteControlReadyPush` (**the `.214` explicit-enable guard**) | cli_inner_pretty.js:720555-720565 | function |
| `ELf` | `recordRemoteControlUpsellShown` | cli_inner_pretty.js:720500-720502 | function |
| `f5a` | `resolveRemoteControlPermissionNudgeConfig` (upsell, NOT an ordering fix) | cli_inner_pretty.js:720478-720494 | function |
| `m5a` | `shouldShowRemoteControlUpsell` | cli_inner_pretty.js:720495-720499 | function |
| `SLf` | `bumpGlobalCounter` (monotonic, never decreases) | cli_inner_pretty.js:720474-720477 | function |
| `TLf` | `resolveRemoteControlReadyPushConfig` (`tengu_kairos_ready_nudge`) | cli_inner_pretty.js:720544-720554 | function |
| `umS` | `hasEverUsedRemoteControl` | cli_inner_pretty.js:720503-720505 | function |
| `wLf` | `recordRemoteControlLongTurnNudgeShown` | cli_inner_pretty.js:720524-720535 | function |
| `xLf` | `recordRemoteControlReadyPushShown` | cli_inner_pretty.js:720566 | function |
| `y5a` | `canShowRemoteControlPermissionNudge` | cli_inner_pretty.js:720536-720539 | function |

---

## Module: Remote Control — Client surfaces (`useRemoteSession`, bootstrap checklist, model picker)

> **Merge into:** `symbol_index_infra_integration.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `cqt` | `replyChannelAdapter` — **(dead)** module-level `null` sentinel; darkens the whole reply channel | cli_inner_pretty.js:757708 | variable |
| `edm` | `emitBackgroundResultSeen` (agent-view latency probe, NOT a Working/Idle flap fix) | cli_inner_pretty.js:802458-802475 | function |
| `F$S` | `applyBootstrapStepTransition` (started/completed/failed/skipped table) | cli_inner_pretty.js:755331-755365 | function |
| `hkf` | `remoteModelPickerLoader` (`list_models` control request; `tengu_remote_model_picker`) | cli_inner_pretty.js:715334 | function |
| `K9f` | `MAX_BOOTSTRAP_STEPS` (32) | cli_inner_pretty.js:755409 | constant |
| `M$S` | `DEFAULT_BOOTSTRAP_STEPS` (`["provision","clone","setup_script","start_cc"]`) | cli_inner_pretty.js:755416 | constant |
| `N$S` | `isLiveBootstrapFrame` (±60 s of now **and** ≥ sessionStart − 5 s) | cli_inner_pretty.js:755274-755279 | function |
| `O$S` | `BOOTSTRAP_LIVE_WINDOW_MS` (60000) | cli_inner_pretty.js:755412 | constant |
| `P$S` | `BOOTSTRAP_STALE_CUTOFF_MS` (300000) | cli_inner_pretty.js:755410 | constant |
| `pui` | `seedRemoteBootstrapState` | cli_inner_pretty.js:755280-755292 | function |
| `Wr` | `markReplyChannelActive` — **(dead)**, all three call sites are behind `cqt !== null` | cli_inner_pretty.js:757201-757210 | function |
| `X9f` | `foldRemoteBootstrapFrame` (session_mode, expected_steps replacement, detail attach) | cli_inner_pretty.js:755293-755330 | function |
| `Y9f` | `isStaleBootstrapFrame` (>5 min old) | cli_inner_pretty.js:755268-755273 | function |
| `yrl` | `finalizeBootstrapChecklist` (`start_cc` completed ⇒ sweep pending→skipped) | cli_inner_pretty.js:755366 | function |
| `z9f` | `sanitizeStepLabel` (strip CR/LF, 512-char cap) | cli_inner_pretty.js:755261-755267 | function |
| `$$S` | `BOOTSTRAP_SESSION_START_SLACK_MS` (5000) | cli_inner_pretty.js:755413 | constant |

---

## Module: Artifacts — one symbol recorded here only to prevent a mis-attribution

> **Merge into:** `symbol_index_infra_integration.md` (Artifacts / frame runtime)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `wbd` | `isFramePublishContextEnabled` (`tengu_frame_publish_context`) — **Artifact publishing, NOT Remote Control** | cli_inner_pretty.js:381715-381717 | function |

---

## New telemetry gates and wire fields seen in this module

All confirmed `220>0 / 193=0` unless noted. Gate names are stable across builds; obfuscated ids are not.

| Name | Kind | 2.1.220 line(s) | Live? |
|---|---|---|---|
| `tengu_remote_active_goal_adopted` | gate | :757214, :757334, :757958 | yes |
| `tengu_remote_bootstrap_cycle_hidden` | gate | :757247 | yes |
| `tengu_remote_model_picker` | gate | :715357, :715363 | yes |
| `tengu_remote_reply_channel_init` | gate | :757204, :757208 | **NO (dead)** |
| `tengu_remote_reply_channel_frame` | gate | :757388 | **NO (dead)** |
| `tengu_remote_subagent_frame_nested` | gate | :757401 | **NO (dead)** |
| `tengu_kairos_ready_nudge` | gate | :720546 | yes |
| `tengu_ide_rc_auto_enable` | gate | :838512, :849528 | yes (IDE host) |
| `tengu_rc_permission_nudge` / `_shown` | gate | :720487 / :816818 | yes (upsell) |
| `tengu_rc_long_turn_nudge` / `_shown` | gate | :720452 / :816745 | yes (upsell) |
| `cli_heartbeat_interval_updated` | log event | :415976 | yes |
| `cli_sse_workflow_launch_event_type_mismatch` | log event | :416597 | yes |
| `cli_sse_worker_control_request_dropped` | log event | :416600 | yes |
| `ccr_worker_state_publish` | metric | :415631, :415636 | yes |
| `ccr_task_status_publish` | metric | :415658, :415691 | yes |
| `remote_bootstrap` | metric | :757076, :757090, :757253 | yes |
| `tips_rc_permission_nudge_show` | metric | :720542 | yes |
| `tips_rc_long_turn_show` | metric | :720534 | yes |
| `heartbeat_interval_seconds` | wire field (response) | :415972 | yes |
| `background_tasks_changed` | wire subtype | :837671 (schema), :568652 / :738593 / :848974 (emit) | yes |
| `fast_mode_disabled_reason` | wire field | :838271 (schema), :593626 / :849530 (produce) | yes |
| `remote_control_auto_enable` | wire field | :838496 | yes |
| `remote_control_auto_on_by_default` | wire field | :838502 | yes |
| `ide_rc_auto_enable_gate` | wire field | :838508 | yes |
| `remote_wire_adopt` | enum tag | :757329 | yes |
| `CLAUDE_CODE_RC_PERMISSION_NUDGE` | env var | :720480 | yes |
| `CLAUDE_CODE_FORCE_RC_LONG_TURN_NUDGE` | env var | :720443 | yes |
| `CLAUDE_CODE_REMOTE_SEND_KEEPALIVES` | env var | :32098, :318942, :318976 | **CARRYOVER — 220=3 / 193=3**, despite the raw asset diff listing it as new |
