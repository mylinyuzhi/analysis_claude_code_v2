# 54 — Remote Control deltas (v2.1.193 → v2.1.220)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). Baseline `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`,
always tagged `(193)`.

Remote Control ("RC", internally **CCR** — *Claude Code Remote*, and **the bridge**) is the subsystem
that lets a phone, `claude.ai/code`, the VS Code extension or the desktop app drive a CLI session that
is running somewhere else. This window carries **23 changelog bullets** touching it, spread over ten
releases (`.195 .196 .199 .202 .203 .205 .206 .207 .208 .211 .212 .214 .217 .218 .219`) — the third
largest theme in the tree.

The window has one shape and it is not "new features". Of the 23 bullets, **two** add a surface
(the provisioning checklist, the fast-mode announcement); the other 21 are repairs to a transport and a
gating chain that both already existed in 2.1.193. The interesting deltas are therefore *narrow* —
three-line guards, one new callback argument, one predicate swapped for a five-condition one — and the
most valuable thing this document does is separate them from the 41-line functions they live inside.

Three findings are worth leading with:

1. **The heartbeat leak (`.218`) is a four-line fix that exploits an existing re-arm guard.** The
   pending `setTimeout` was rearming itself forever after the client had been closed, because the
   loop's own "should I rearm?" test read a field that nothing on the close path cleared. See
   [`transport_and_session_lifecycle.md`](transport_and_session_lifecycle.md) §2.
2. **Three of the six new `tengu_remote_*` gates are unreachable in the shipped binary**, and two of
   them sit behind a *module-level* `null` sentinel (`cqt`), not the local one the tree's ground truth
   already documented. The whole "remote reply channel" feature is dark. See
   [`client_surfaces.md`](client_surfaces.md) §1.
3. **`tengu_frame_publish_context`, the anchor the scoping pass recorded for two bullets, is not a
   Remote Control gate at all** — it lives in the Artifact publishing module and controls whether a
   `publish_context` field rides the artifact-publish request. "Frame" is a homonym here. See
   [`client_surfaces.md`](client_surfaces.md) §1.3.

---

## Document map

| Document | Covers |
|---|---|
| [`transport_and_session_lifecycle.md`](transport_and_session_lifecycle.md) | `CCRClient` (`iln`), the worker-epoch replacement model, the **heartbeat deep dive**, the SSE transport's reconnect/liveness timers, the three event uploaders, `background_tasks_changed`, split shutdown, mid-turn crash recovery |
| [`security_and_enablement.md`](security_and_enablement.md) | The `api.anthropic.com` base-URL restriction, the five-way blocker-attribution chain, `/remote-control` when logged out, the "session ready" push explicit-enable guard, pending-permission replay to late joiners, `claude rc` home-directory trust |
| [`client_surfaces.md`](client_surfaces.md) | Dead/unreachable gates, the remote `/model` picker, fast-mode re-sync over the wire, the provisioning checklist, mobile/web command dispatch, and the bullets that stay unanchored |

Boundaries: the background-agent daemon/launcher/roster is
[`../36_background_agents/`](../36_background_agents/); auth-provider detection is
[`../55_auth_providers/`](../55_auth_providers/); IDE/Chrome hosts are
[`../56_chrome_ide/`](../56_chrome_ide/). This module owns the RC transport and its client surfaces and
links out rather than duplicating.

---

## Per-bullet ledger

Version column is the **CHANGELOG.md heading the bullet sits under**, not the scoping file's grouping
(the scoping files roll `.213`'s absence forward and are one release off for four rows).

| # | Bullet (abridged) | Ver | Verdict | Anchor (2.1.220) | 220/193 | Section |
|---|---|---|---|---|---|---|
| 1 | Improved Remote session startup with a provisioning checklist | .195 | **NET_NEW** | `hasStructuredSteps` `:757231`; `Cloud container provisioning failed` `:757264` | 5/0; 1/0 | [client](client_surfaces.md) §4 |
| 2 | Mid-turn crash recovery — sessions auto-resume on the next worker | .196 | **NET_NEW** (owned by `36_`) | `tengu_resume_interrupted_turn` `:320161`; `CLAUDE_CODE_RESUME_INTERRUPTED_TURN_MAX_AGE_MS` `:320146` | 2/0; 6/0 | [transport](transport_and_session_lifecycle.md) §5 |
| 3 | RC disabled when `ANTHROPIC_BASE_URL` points at a non-Anthropic host | .196 | **NET_NEW** | `isBridgeFirstParty` (`DVe`) `:535447`; `does not point at api.anthropic.com` `:535671` | 1/0; 1/0 | [security](security_and_enablement.md) §1 |
| 4 | Remote sessions flapping Working/Idle when a bg agent completes | .199 | **UNANCHORED** | `tengu_bg_result_seen` `:802466` is the *agent-view* render probe, not a flap fix | 1/0 | [client](client_surfaces.md) §6.1 |
| 5 | RC commands into an interactive session failing "Unknown command" | .202 | **CARRYOVER at the literal; DELTA in the dispatcher** | `Unknown command` `:343373` | 3/3 | [client](client_surfaces.md) §3 |
| 6 | Images/files sent without a caption silently dropped | .202 | **UNANCHORED** | all 95 `caption` hits are HTML-parser / skill-payload noise | 95/52 | [client](client_surfaces.md) §6.2 |
| 7 | `/remote-control` sessions showing the wrong permission mode | .202 | **DELTA** | `permissionMode: AP(...)` in the `system/init` builder `:738009` | init frame 1/0 | [security](security_and_enablement.md) §5 |
| 8 | [VSCode] Settings toggle "Enable Remote Control for all sessions" | .203 | **CARRYOVER (CLI side); extension-side otherwise** | `:452049` literal | 1/1 | [client](client_surfaces.md) §5 |
| 9 | Bg tasks stale "Running"; full task state on membership change | .205 | **NET_NEW** | `background_tasks_changed` `:837671`, doc `:837681`, emits `:738593`/`:848974`/`:568652` | 11/0 | [transport](transport_and_session_lifecycle.md) §4 |
| 10 | `/remote-control` showing "Unknown command" when logged out | .206 | **NET_NEW** | `isRemoteControlCommandEnabled` (`oP_`) `:503352-503366` vs 193 `isEnabled: Jw` `:563258 (193)` | 5-cond/1-cond | [security](security_and_enablement.md) §3 |
| 11 | RC task status lost when the connection recovered | .207 | **NET_NEW** | `tengu_remote_active_goal_adopted` `:757214`, `:757334`, `:757958` | 3/0 | [transport](transport_and_session_lifecycle.md) §4.2 |
| 12 | Desktop-hosted RC sessions not showing bg agents/workflow | .207 | **NET_NEW, but its recorded anchor is DEAD** | real: `background_tasks_changed` at the SDK host `:848974`; recorded: `tengu_remote_subagent_frame_nested` `:757401` is unreachable | 11/0; dead | [client](client_surfaces.md) §1.2 |
| 13 | RC clients on a terminal-hosted session not seeing bg agents | .208 | **NET_NEW, recorded anchor is a FALSE ANCHOR** | real: `background_tasks_changed` at the TUI host `:738593`; recorded `tengu_frame_publish_context` `:381716` is the Artifact publisher | 11/0 | [client](client_surfaces.md) §1.3 |
| 14 | [VSCode] RC banner now describes what it does | .211 | **UNANCHORED** (extension, not this bundle) | `Remote Control lets` 0/0 | — | [client](client_surfaces.md) §5 |
| 15 | Workflow agent grid empty for clients joining mid-run | .212 | **UNANCHORED**; recorded anchors dead/false | same two anchors as #12/#13 | — | [client](client_surfaces.md) §1 |
| 16 | Permission prompts on remote sessions could proceed before the local dialog | .214 | **UNANCHORED** (recorded anchor is a growth upsell) | `tengu_rc_permission_nudge` `:720487`/`:816818` | 2/0 | [security](security_and_enablement.md) §4.3 |
| 17 | RC "session ready" push firing where RC was not explicitly enabled | .214 | **NET_NEW** | `tengu_kairos_ready_nudge` `:720546`; guard `CLf` `:720555-720565`; `replBridgeExplicit` read `:738041` | gate 1/0 | [security](security_and_enablement.md) §4.1 |
| 18 | `claude rc` home-directory trust error | .214 | **NET_NEW** | `home-directory trust is never saved` `:546768` | 1/0 | [security](security_and_enablement.md) §6 |
| 19 | RC not showing a pending permission prompt to late-joining viewers | .217 | **NET_NEW** | `pending_permission_requests`/`pending_user_dialog_requests` on the bridge `initialize` response `:414765-414784` | 12/9 (3 new sites) | [security](security_and_enablement.md) §4.2 |
| 20 | Announcement when fast mode changes via `/config model=` or RC | .218 | **NET_NEW** (primary `47_models`) | `remote: CS()` on `tengu_fast_mode_toggled` `:499814`, `:695246`; `remote: !0` `:757329` | `remote_wire_adopt` 1/0 | [client](client_surfaces.md) §2 |
| 21 | Remote sessions sending heartbeats after their worker was replaced | .218 | **NET_NEW (4 lines) inside carryover machinery** | `closed` guards `:415941`, `:415956-415959`; `heartbeat_interval_seconds` `:415972` | interval literal 24/24; new guards 0→2 | [transport](transport_and_session_lifecycle.md) §2 |
| 22 | RC clients keeping a stale fast-mode status after switch/reconnect | .219 | **NET_NEW** | `remote_wire_adopt` `:757329` over `init` **and** `result` frames `:757316-757330`; `fast_mode_disabled_reason` `:838271` | 1/0; 18/0 | [client](client_surfaces.md) §2 |
| 23 | "RC is only available via api.anthropic.com" now names the setting | .219 | **NET_NEW** | `H4_` five-way branch `:535656-535673`; `mbr`/`ecp`/`tcp` `:535810-535812` | base string 3/3, branch 0→5 | [security](security_and_enablement.md) §2 |

**Roll-up:** 12 NET_NEW · 2 DELTA · 2 CARRYOVER · 6 UNANCHORED · 1 shared with `47_models`.
Three bullets (#12, #13, #15) had anchors recorded in the scoping pass that this module **disproves**;
one (#16) was already disproved by `38_permissions` and is re-confirmed here.

---

## False deltas caught in this module

| Claim | Reality | Evidence |
|---|---|---|
| `CLAUDE_CODE_REMOTE_SEND_KEEPALIVES` is a new env var (it is in `_raw_asset_diff_193_to_220.md`'s NEW list, line 574) | **Carryover.** | 220=3 (`:32098`, `:318942`, `:318976`) / **193=3** (`:43126 (193)`, `:444347 (193)`, `:444381 (193)`) — read all six |
| `heartbeat_interval_ms: 20000` is the `.218` fix | Carryover config. The literal is **220=24 / 193=24**, byte-identical (`:415334` vs `:562674 (193)`) | the delta is two `this.closed` guards, not the interval |
| SSE reconnect / "Reconnecting…" timing changed (`.198`/`.199`) | **Carryover.** Liveness timeout `Ukd = 45000` `:416385` vs `q$f = 45000` `:560085 (193)`; backoff `D7y = 1000` → `P7y = 30000` `:416383-416384` | `Reconnecting` 41/42 — the count went *down* |
| `tengu_frame_publish_context` anchors two RC bullets | It is in the **Artifact publisher** (`publishArtifact`, `MAX_ARTIFACT_BYTES`, `artifactViewerUrl`), consumed at `:381809` and `:382719` to attach `publish_context` to a publish request | module export table `:381645-381687` |
| `tengu_remote_subagent_frame_nested` shows the desktop bg-agent fix shipped | **Dead code** — `let ut = null; if (ut !== null)` at `:757390-757391` | already in `_raw_asset_diff`; re-verified |
| `tengu_remote_reply_channel_init` / `_frame` are shipped features | **Dead code** — every reader is guarded by `cqt !== null`, and `cqt = null` at `:757708` is the only assignment (8 total occurrences in the bundle) | new finding, see [`client_surfaces.md`](client_surfaces.md) §1.1 |
| `Enable Remote Control for all sessions` is a `.203` CLI addition | 220=1 / **193=1** at `:452049`; the toggle lives in the VS Code extension | already in the ledger; re-confirmed |
| `Unknown command` proves the `.202`/`.206` fixes | 220=3 / **193=3**, all three sites structurally identical | the `.206` delta is the command's `isEnabled`, not the message |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this module are staged in
> [symbol_additions_v2_1_220_remote_control.md](../00_overview/symbol_additions_v2_1_220_remote_control.md).

Key entry points for this module:
- `CCRClient` (`iln`, `:415586`) - the worker-side Remote Control client: heartbeat, event upload, epoch
- `SSETransport` (`lln`, `:416401`; body through `:416725`) - inbound frame stream with liveness + reconnect
- `isBridgeFirstParty` (`DVe`, `:535447`) - the `.196` base-URL restriction
- `buildRemoteControlProviderBlocker` (`H4_`, `:535656`) - the `.219` five-way attribution chain
- `isRemoteControlCommandEnabled` (`oP_`, `:503352`) - the `.206` logged-out carve-out
- `useRemoteSession` frame handler (`:757194-757500`) - the client-side surface, including all three dead gates
