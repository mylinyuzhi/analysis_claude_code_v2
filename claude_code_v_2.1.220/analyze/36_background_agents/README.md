# 36 — Background agents (v2.1.193 → v2.1.220), part 1: daemon, workers, session store

> **Delta module.** Documents the `2.1.193 → 2.1.220` changes to the background-agent subsystem.
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
> (872,596 lines, `VERSION 2.1.220`, `build_sha 4073f595`, `build_time 2026-07-24T22:17:45Z`).
> BEFORE-PICTURE: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`
> (718,679 lines). Every bare `cli_inner_pretty.js:<line>` is a **220** line; baseline lines are
> tagged `(193)`.
> **Format reference / canonical for unchanged machinery:**
> [`../../../claude_code_v_2.1.193/analyze/36_background_agents/`](../../../claude_code_v_2.1.193/analyze/36_background_agents/README.md),
> which chains back to the 2.1.183 and 2.1.156 trees for the dispatcher seam, shell-exec sessions,
> the classifier engine and the pty-host watchdog.
> Symbols are **re-mangled every build** — no 2.1.193 obfuscated name is reused here; every name in
> these docs was re-derived by reading the 2.1.220 bundle.

---

## Scope: this is part 1 of two

`background_agents` is the densest theme in this window: **112 of the 579 changelog bullets
(~20%)** name it as primary or secondary theme. It is split across two agents.

| | Owner | Files |
|---|---|---|
| **part 1 (this module)** | daemon lifecycle, worker respawn/upgrade, roster + session store, worktrees, env inheritance | `daemon_lifecycle.md`, `worker_respawn_and_upgrade.md`, `session_store_and_worktrees.md` |
| **part 2** | the `claude agents` VIEW, `/fork` → background, notifications and result reporting | `agent_view_and_status.md`, `fork_to_background_session.md`, `bg_notifications_and_reporting.md` |

The ledger in §4 covers **every** `background_agents` row in the five scoping files
(130 rows across 20 releases; the scoping files' own per-range primary-theme totals sum to 113).
Rows owned by part 2 are marked **→ part 2** and point at the sibling file.

---

## 1. TL;DR — what actually changed

Five genuinely net-new mechanisms, three false deltas caught, and a lot of carryover.

1. **`CLAUDE_CODE_PROCESS_WRAPPER` / `processWrapper`** — a corporate launcher argv prefix applied
   to every self-spawn (daemon, workers, session relaunch). `CLAUDE_CODE_PROCESS_WRAPPER` is
   **220=13 / 193=0**, the settings key `processWrapper` is **220=16 / 193=0**. Parser, five-way
   validator, memoised accessors, four fail-closed enforcement points, three skew detectors, and a
   "launcher contract #3" self-diagnosis. → [`daemon_lifecycle.md`](./daemon_lifecycle.md) §3
2. **Build-timestamp version recency.** `-(?:dev|engine)\.(\d{8})\.t(\d{6})` (**220=1 / 193=0**,
   `:552455`) plus a five-function comparator family. Daemon handover, worker upgrade and the
   downgrade refusals all now judge recency by embedded build timestamp with channel isolation,
   not semver. → [`daemon_lifecycle.md`](./daemon_lifecycle.md) §2,
   [`worker_respawn_and_upgrade.md`](./worker_respawn_and_upgrade.md) §1
3. **Roster and session-state field preservation.** `v.looseObject` + `.catch(0)` stamps +
   `extractUnknownRosterFields` + `.in.shape` filtering. One root cause behind four bullets
   (`.195` #7, `.200` #8, `.214` #28, `.216` #14). The code names the old behaviour out loud:
   *"schema-skewed daemon stripped them"* (**220=1 / 193=0**).
   → [`session_store_and_worktrees.md`](./session_store_and_worktrees.md) §1
4. **Revival guards.** `tengu_bg_revival_guard` (**220=1 / 193=0**) gates two behaviours together:
   a respawn is abandoned if the session settled on disk during the backoff
   (`settled_on_disk`), or if a human-lineage session was killed by an external signal
   (`no_task_contract`). Both emit `tengu_bg_respawn_suppressed` (**220=2 / 193=0**).
   → [`worker_respawn_and_upgrade.md`](./worker_respawn_and_upgrade.md) §4
5. **Process-identity discipline for kills.** `lockHasProcStartIdentity` (`:664788`) plus a
   retrying, fail-closed `procStartMatchesWithRetry`. `claude daemon stop --any` now refuses to
   SIGTERM a lock holder it cannot prove is the daemon — closing a real
   kill-an-unrelated-process bug that is provable line-by-line against 2.1.193.
   → [`daemon_lifecycle.md`](./daemon_lifecycle.md) §1, §4

**Runners-up:** `tengu_bg_prewarm_burst{,_concurrency,_delay_ms}` (post-takeover upgrade wave,
all 193=0); macOS `launchctl asuser` capability probe; macOS memory pressure via
`sysctlbyname("kern.memorystatus_vm_pressure_level")`; the `evict` control-socket field that makes
`claude rm` actually delete a roster row; `releaseStaleClaudeWorktreeLocks`; and
`removeRootlessAgentWorktree`'s eighteen-gate deletion path for non-git worktree directories.

---

## 2. False deltas caught (read this before quoting a bullet)

| Changelog claim | Reality | Proof |
|---|---|---|
| `.200` #6 — *"Bg agents never restarting after a stale `daemon.lock` whose PID the OS reused"*, filed as a RICH delta on `procStart` (220=69 / 193=46) | The **three-way lock verification** (`kill(0)` + `/proc/cmdline` + `procStart`) is **carryover** — 2.1.193's `R0()` at `:501897-501907 (193)` is the same three steps. | The real fix is narrower: the writer now retries the self-probe with the cache bypassed (`:870572-870579`), `procStartMatchesWithRetry` fails **closed** (`:664786`), and `lockHasProcStartIdentity` (`:664788`) gates every signal. See [`daemon_lifecycle.md`](./daemon_lifecycle.md) §1.3. |
| `.212` #11 — *"daemon prefers PowerShell 7"* | The **preference order is carryover**: 220 `:168556-168564` and 193 `:299416-299424` are equivalent (pwsh on PATH → `%ProgramFiles%\PowerShell\7` → WindowsApps → `.dotnet\tools` → `powershell`). | The real delta is **one added last resort**: `%SYSTEMROOT%\System32\WindowsPowerShell\v1.0\powershell.exe` at 220 `:168568-168572`, where 193 returned `null` (`:299428`). Also carryover: the whole WMI spawn path (`Win32_Process` 220=4 / **193=4**, `tengu_bg_daemon_wmi_fallback` 220=2 / **193=2**). See [`daemon_lifecycle.md`](./daemon_lifecycle.md) §5.2. |
| `.200` #4 — *"Bg sessions silently stopping mid-turn after sleep/wake"* | The **sleep-detect grace shift** is carryover: `shiftGraceClocksForward` is **220=2 / 193=2**, and the sweep-tick skip at `:869756-869762` has a 193 equivalent. | The delta is `tengu_resume_interrupted_turn` (220=2 / 193=0) and the guard/max-age around `CLAUDE_CODE_RESUME_INTERRUPTED_TURN` (**220=18 / 193=8**). See [`worker_respawn_and_upgrade.md`](./worker_respawn_and_upgrade.md) §4.1. |
| `.206` #6 / `.208` #40 prewarm framing | `tengu_bg_prewarm_per_sweep` is **220=1 / 193=1** and `tengu_bg_binary_takeover` / `tengu_bg_daemon_binary_takeover` / `tengu_daemon_yield` / `tengu_bg_retire_pinned_low_mem` are all **220=N / 193=N**. | The per-sweep upgrade trickle, binary takeover, yield and low-memory pinned reaping **all pre-exist**. Only the *burst* (`tengu_bg_prewarm_burst*`, 193=0) and the two *refusals* (downgrade, channel mismatch) are new. |
| `.203` #9 — *"Bg/agent-view sessions dropping a shell-exported `ANTHROPIC_BASE_URL`"* | `ANTHROPIC_BASE_URL` is **220=47 / 193=40** — massively pre-existing. | Exactly one new comparison: `s.ANTHROPIC_BASE_URL !== i.ANTHROPIC_BASE_URL` (**220=1 / 193=0**, `:553425`), replacing 193's `else if (s.ANTHROPIC_BASE_URL)` (`:606936 (193)`). |
| `.208` #41 — scoping probe files `keptReason` / `leftWorktreeDir` as 193=0/0 ([`_scope_v206_210.md`](../00_overview/_scope_v206_210.md) line 246) | `keptReason` is **220=3 / 193=3** — the field and the "kept the worktree" return shape already existed (193 `:575654`, `:577390`, `:674782`). Only `leftWorktreeDir` is 3/**0**. | Real delta: the new sibling field, the five per-reason remedy strings (`:683251`, `:683254`, `:683257`, `:683260`, `:683262`), and the `removed: !1` return at `:681212` that carries a `keptReason` out of a *failed* delete. See [`session_store_and_worktrees.md`](./session_store_and_worktrees.md) §3.4. |
| `.212` #11 — measuring the PowerShell delta by its telemetry token | `fell_back_to_powershell_5` is **220=2 / 193=1**, because the *same* token is emitted by the pre-existing `powershell`-on-`PATH` rung (220 `:168567` / 193 `:299427`) and by the new one (`:168571`). | The count tells you nothing; the evidence is that 193 `return null`s at `:299428` where 220 opens a new `if (Mt() === "windows")` block. See [`daemon_lifecycle.md`](./daemon_lifecycle.md) §5.2. |
| `.196` watchdog (cross-theme) | `CLAUDE_ENABLE_STREAM_WATCHDOG` went **DOWN**: 220=2 / **193=4**. | 2.1.193's worker-env builder set it unconditionally (`:606918 (193)`); 2.1.220's does not. A default-on flip *removes* gating code. Corroborates `_GROUND_TRUTH_verified_anchors.md` §3. |
| `.203` #4 — *"macOS bg session open stalling on false low-memory (2.1.196 regression)"* | 2.1.193 had low-memory detection **disabled on macOS entirely** (`if (Wt() === "macos") return 0`, `:575137 (193)`). | So the `.196` intermediate state is **not observable in either bundle**. What is observable: 220 replaced it with a real `sysctlbyname` pressure read (`:552608-552622`, threshold `>= 4`). Stated as a two-point comparison, not a three-point one. |

---

## 3. Files in this module

```
36_background_agents/   (v2.1.220 — DELTA tree; part 1 of 2)
├── README.md                         ← you are here: index, TL;DR, false deltas, full ledger
├── daemon_lifecycle.md               ← lock identity & procStart discipline; build-timestamp handover;
│                                        CLAUDE_CODE_PROCESS_WRAPPER end-to-end; `daemon stop --any`
│                                        security fix; five-rung spawn ladder; macOS aqua wrap;
│                                        Windows PowerShell/WMI; bgDisabled; idle reaping; low memory
├── worker_respawn_and_upgrade.md     ← the BackgroundWorker phase machine; respawnIfIdleStale's
│                                        17 guards; downgrade & channel refusals; prewarm burst;
│                                        crash accounting + sleep interlock; revival guards;
│                                        auth rekey; adopt/claim/unverified; adopt.json handoff;
│                                        probe rescue, resume conflict, attach-after-reap
└── session_store_and_worktrees.md    ← roster looseObject + rosterExtras round trip; state.json
                                         unknown-field preservation; corruption & healed stamps;
                                         orphan pruning; evict / claude rm / kill-unconfirmed;
                                         PATH & base-URL & EXTRA_BODY inheritance; worktree locks,
                                         sweeps, non-git removal, worktreeConfig; retention sweep;
                                         §8 worktree-CREATION committed-symlink guard (`.212` #8)
```

Four files as planned; nothing was merged away.

Part 2's three files, added to this index for completeness (they carry their own per-document
bullet ledgers, so the §4 ledger only points at them):

```
├── agent_view_and_status.md          ← the four-classifier status state machine; 64-char headline
│                                        budget; sections/done-fold/compacting header; column and
│                                        status-width allocation; worded staleness clock; PR link
│                                        detection; band-dependent Ctrl+X; the `←` FSM; composer
│                                        slash-command guards; Windows stdin contention
├── fork_to_background_session.md     ← one spawner two modes (`keepParent`); live-parent protection
│                                        as a fail-closed file copy; prompt-derived fork naming;
│                                        fork lineage (roster record + env var + boundary stamp);
│                                        the five `/fork` refusals; `/subtask` inheriting the old job
└── bg_notifications_and_reporting.md ← notification edge detector; the
                                         `[SYSTEM NOTIFICATION - NOT USER INPUT]` framing; footer
                                         waiting counts and the `N done` pulse; reporting-honesty
                                         prompt rules; reply-delivery retry ladder; resurrection
                                         notices; `/tasks` 30 s retention and its parked-session
                                         exemption
```

### Reading order

1. **`daemon_lifecycle.md`** — establishes the lock, the version comparators and the launcher, all
   three of which the other two docs depend on.
2. **`worker_respawn_and_upgrade.md`** — the worker state machine that consumes them.
3. **`session_store_and_worktrees.md`** — the durable state under both, plus filesystem hygiene.
4. Part 2's three files for the view, `/fork` and notifications.

---

## 4. Per-bullet ledger

Verdict key: **NET_NEW** = anchor 220>0 / 193=0 and the mechanism is new · **DELTA** = literal
pre-exists, a narrower change is identified · **CARRYOVER** = no meaningful change in this window ·
**UNANCHORED** = no distinguishing literal found; recorded honestly rather than guessed ·
**→ part 2** = owned by the sibling module.

### 2.1.195

| # | Bullet (abridged) | Verdict | Anchor (220/193) | Where |
|---|---|---|---|---|
| 7 | Bg jobs disappearing from `claude agents` when written by a newer version | **NET_NEW** | `tengu_bg_roster_orphan_pruned` 1/0 `:330930`; `looseObject` 22/11 `:330107`; `rosterExtras` 4/0 | store §1, §2 |
| 8 | Reopening a crashed bg task shows a blank screen for up to 5 s | **NET_NEW** | `tengu_bg_respawn_probe_rescue` 1/0 `:681696` | worker §7.1 |
| 9 | Daemons running unreachable when the control socket fails to start | **DELTA** | `bgDisabled` 5/0 `:664721`; `tengu_bg_daemon_bg_disabled_skip` 1/0 `:680430`; `tengu_daemon_upgrade_respawn_unreachable` 1/0 `:871997` | daemon §6, §2.4 |
| 11 | Completed list fills vertical space; header compacts | → part 2 | `tengu_fleetview_simple` 1/0 | `agent_view_and_status.md` |

### 2.1.196

| # | Bullet (abridged) | Verdict | Anchor (220/193) | Where |
|---|---|---|---|---|
| 2 | Readable default names for sessions at start | **CARRYOVER** | 2-word generator 4/4 | → part 2 |
| 5 | Waking a bg job deleted its conversation; file now set aside | **NET_NEW** | `.orphaned-` 1/0 `:51506`; called `:554361`, `:681717` | worker §7.1 |
| 9 | Agents side panel: focus stuck, subagent types lost | → part 2 | `tengu_fleetview_stdin_contention` 1/0 | `agent_view_and_status.md` |
| 19 | Status Done / Needs-your-input flapping; clickable PR link | → part 2 | `Needs attention` 1/**1** (label is carryover) | `agent_view_and_status.md` |
| 21 | Long commands survive process stop/restart/update; Windows shell handoff | **NET_NEW** | `tengu_bg_handoff_settle` 1/0 `:869956` | store §7 |
| 22 | Workers killed by a daemon restart auto-resumed next time | **NET_NEW** | `tengu_bg_attach_wake_after_reap` 1/0 `:682964`; `reapedMidWorkAt` 6/0 | worker §7.3 |
| 27 | Agents view needs a single `←` press | → part 2 | `tengu_left_arrow_editing_guard` 1/0 | `agent_view_and_status.md` |

### 2.1.198

| # | Bullet (abridged) | Verdict | Anchor (220/193) | Where |
|---|---|---|---|---|
| 6 | Bg agents commit, push and open a draft PR instead of asking | → part 2 | `shipping is part of the task` 1/0 | `bg_notifications_and_reporting.md` |
| 16 | "no route to host" for local-network hosts in macOS bg sessions | **UNANCHORED** | `Local Network` 0/0 — a native entitlement, not JS | — |
| 18 | Bg agents showing "Reconnecting…" every ~52 s on macOS | **DELTA** | `Reconnecting` 41/**42**; `tengu_bg_pty_auth_mismatch` 1/0 `:553821` | worker §5 |
| 19 | `←` inside `claude attach <id>` exiting to the shell | → part 2 | `tengu_left_arrow_editing_guard` 1/0 | `agent_view_and_status.md` |
| 31 | `/login` opens the sign-in dialog from the agents view | **UNANCHORED** | `tengu_fleetview_empty_state_shown` 1/0 (adjacent only) | → part 2 |

### 2.1.199

| # | Bullet (abridged) | Verdict | Anchor (220/193) | Where |
|---|---|---|---|---|
| 6 | Bg daemon on Linux killing itself + every agent every ~50 s after a corrupted worker record | **NET_NEW** | `supervisorPid: v.number().catch(0)` `:330129`; `healed_stamp` 1/0 `:330263`; `tengu_bg_revival_guard` 1/0 `:553350` | store §1.6 |
| 7 | Bg agents failing to cold-start over SSH on macOS | **NET_NEW** | `tengu_bg_daemon_macos_aqua_wrap` 1/0 `:679939` | daemon §5.1 |
| 8 | `claude stop` silently undone when it raced a bg respawn | **NET_NEW** | `tengu_bg_respawn_suppressed` 2/0 `:554662` (`settled_on_disk`) | worker §4 |
| 9 | Bg job progress indicators stalling for minutes | **UNANCHORED** | `tengu_bg_prewarm_burst` 4/0 exists but is the post-takeover wave, not a progress fix | — |
| 10 | Bg sessions on memory-starved machines indicate low memory | **DELTA** | `low memory` 6/**3**; worker-crash surface `:554638` | worker §3.4 |
| 24 | Session rows show PR links as bare `#N` | **CARRYOVER** | 1/1 | → part 2 |

### 2.1.200

| # | Bullet (abridged) | Verdict | Anchor (220/193) | Where |
|---|---|---|---|---|
| 4 | Bg sessions silently stopping mid-turn after sleep/wake | **DELTA** (see §2) | `shiftGraceClocksForward` 2/**2**; `tengu_resume_interrupted_turn` 2/0 | worker §4.1; daemon §7.2 |
| 5 | Bg sessions re-running an Esc-cancelled turn after a stall respawn | **NET_NEW** (transcript layer) | `tengu_resume_stale_turn_suppressed` 1/0 `:320211` | worker §4.1 (pointer) |
| 6 | Bg agents never restarting after a stale `daemon.lock` whose PID the OS reused | **DELTA** — 3-way check is carryover (§2) | `has no procStart identity` 1/0 `:680348`; `Y0r` `:664788` | daemon §1.3 |
| 7 | Daemon handover: a reinstalled older build can no longer take over | **NET_NEW** | `-(?:dev\|engine)\.(\d{8})\.t(\d{6})` 1/0 `:552455` | daemon §2 |
| 8 | Roster: corruption disabling orphan cleanup; field preservation; socket auth tokens | **NET_NEW** | `looseObject` `:330107`/`:330127`; `schema-skewed daemon stripped them` 1/0 `:554068` | store §1 |
| 10 | Control bytes from bg output reaching the terminal | → part 2 | `sanitizeForTerminal` 1/0 | `agent_view_and_status.md` |

### 2.1.202

| # | Bullet (abridged) | Verdict | Anchor (220/193) | Where |
|---|---|---|---|---|
| 4 | `/rename` on bg sessions reverted when the job restarts | **UNANCHORED** | `renameSession` 2/1 — could not isolate the restart path | — |
| 9 | Opening a chat from `claude agents` failing "currently running as a background agent" | **CARRYOVER** | 3/3 | — |

### 2.1.203

| # | Bullet (abridged) | Verdict | Anchor (220/193) | Where |
|---|---|---|---|---|
| 4 | macOS bg session open stalling on false low-memory | **NET_NEW** (see §2 for the 3-point caveat) | `kern.memorystatus_vm_pressure_level` 1/0 `:552638` | daemon §7.3 |
| 5 | Bg sessions permanently unresponsive when the daemon session token went stale | **NET_NEW** | `tengu_bg_rv_auth_mismatch` 1/0 `:554730` | worker §5 |
| 6 | Returning to `claude agents` stopped running subagents; work now carries over | **NET_NEW** | `tengu_adopt_claim` 6/0 `:564945`; `tengu_adopt_exit_handoff` 1/0 `:565353`; `so the work carries over` 1/0 | worker §6.3 |
| 8 | Bg agents inheriting a stale `PATH` from the daemon (Windows) | **NET_NEW** | `toUpperCase() === "PATH"` 6/**3**; the block `:553408-553411` has no 193 equivalent | store §4.3 |
| 9 | Bg sessions dropping a shell-exported `ANTHROPIC_BASE_URL` | **DELTA** | `ANTHROPIC_BASE_URL !== i.ANTHROPIC_BASE_URL` 1/0 `:553425` | store §4.3 |
| 11 | Worktree-isolated subagents running shell commands in the parent checkout | cross-theme | `tengu_agent_worktree_cwd_escape_blocked` 4/0 `:314164` | `53_subagent_limits/` |
| 12 | Worktree creation rejecting nested repositories | **UNANCHORED** | `nested repositories` 0/0 | — |
| 13 | Bg agents crash-looping when their working directory was deleted | **NET_NEW** | `no_root` 2/0; `settleCwdGone` `:554674`; `tengu_bg_spawn_cwd_gone` `:554676` | worker §3.5 |
| 14 | A daemon auto-upgrade failure silently killing all running bg sessions | **NET_NEW** | `tengu_daemon_upgrade_refused_stale_binary` 2/0 `:870704`; `tengu_daemon_refuse_stale_upgrade` 1/0 `:870697` | daemon §2.3 |
| 15 | `TaskStop`/`TaskOutput` failing to find bg agents spawned by another agent | **UNANCHORED** | `TaskOutput` 28/9 — tool-layer, not isolated here | `04_tools/` |
| 16 | Agents composer discarding your message when a slash command is absent | → part 2 | `tengu_slash_command_unavailable` 2/0 | `43_slash_commands/` |
| 17 | Agent list crashing when opening a stopped session already open elsewhere | **DELTA** | `tengu_bg_respawn_resume_conflict` 2/0 `:681733` is the server-side half | worker §7.2 |
| 18 | Bg sessions showing "Needs input" after the question was answered | → part 2 | `needs input` 6/**3** | `agent_view_and_status.md` |
| 19 | Bg agent startup failures showing only "exit_with_message" | **CARRYOVER** | 1/1 | — |
| 20 | Bg sessions ignoring `effortLevel` changes when daemon-forked | **UNANCHORED** | `effortLevel` 23/19 | — |
| 21 | Attached bg sessions ignoring `CLAUDE_CODE_DISABLE_MOUSE(_CLICKS)` | cross-theme | `CLAUDE_CODE_DISABLE_MOUSE_CLICKS` 3/0 | `48_accessibility_ui/` |
| 22 | `/exit` warning about running bg agents after all completed | **UNANCHORED** | `running background agents` 0/0 | — |
| 23 | Bg sessions from a non-git dir unable to edit with a `WorktreeCreate` hook | **UNANCHORED** | `WorktreeCreate` 42/34 — the hook path is carryover; could not isolate | store §5.4 (adjacent) |
| 24 | `@` directory picker not showing registered git worktrees | → part 2 | — | `agent_view_and_status.md` |
| 25 | Bg task output on Windows replaced by an empty file after `/clear` | **UNANCHORED** | — (`CLAUDE_BG_POST_CLEAR_RESPAWN` `:554384` is adjacent) | — |
| 28 | Literal `^[[I` / `^[[O` escape codes on reattach | **CARRYOVER** | `?1004` 2/2 | — |
| 34 | Empty `claude agents` view always shows the organized sections | → part 2 | `tengu_fleetview_empty_state_shown` 1/0 | `agent_view_and_status.md` |
| 36 | Removed a redundant navigation hint from the footer | → part 2 | — | `agent_view_and_status.md` |

### 2.1.205

| # | Bullet (abridged) | Verdict | Anchor (220/193) | Where |
|---|---|---|---|---|
| 4 | Windows worktree removal deleting files outside it via NTFS junction/symlink | **NET_NEW** | `unlinked reparse point before removal` 1/0 `:224251` | store §5.4 |
| 5 | Bg agents still "failed"/"completed" after `SendMessage` resume | → part 2 | `tengu_bg_reply_outcome` 2/0 `:680878` | `bg_notifications_and_reporting.md` |
| 6 | Bg jobs flipping "needs input" → "working" with no readable text | → part 2 | `needs input` 6/3 | `agent_view_and_status.md` |
| 7 | `claude attach` erroring when a bg agent was mid-upgrade restart | **NET_NEW** | `tengu_bg_attach_wake_after_reap` 1/0 `:682964`; `reapedUnsettledAt` 6/0 | worker §7.3 |
| 8 | Session-to-PR linking missing a PR created in an over-30 K Bash call | **UNANCHORED** | 0/0/1 | → part 2 |
| 14 | Agent view rendering one line too high | → part 2 | — | `agent_view_and_status.md` |
| 18 | Bg task notifications state that no human input has occurred | → part 2 | `No human input has been received` 1/0 | `bg_notifications_and_reporting.md` |
| 19 | Agent view links PRs it edits/merges/comments on | → part 2 | `tengu_gh_pr_status_auth_state` 1/0 | `bg_notifications_and_reporting.md` |
| 20 | Agent view rows: colored state word + classifier headline | → part 2 | classifier state map `:334671` | `agent_view_and_status.md` |

### 2.1.206

| # | Bullet (abridged) | Verdict | Anchor (220/193) | Where |
|---|---|---|---|---|
| 6 | Background agents upgrade in the background right after an update | **NET_NEW** | `tengu_update_bg_respawn` 1/0 `:501971`; `tengu_bg_prewarm_burst` 4/0 `:869898` | worker §1, §2; daemon (env scrub `:501967-501970`) |
| 10 | `CLAUDE_CODE_EXTRA_BODY` ignored by `claude agents` / `--bg` workers | **NET_NEW** | key stripped from `cappedDispatch` `:554224` (193 stripped only 2 keys, `:607507 (193)`); adopt scrub `:553984` | store §4.1 |
| 16 | Keyboard ignored in the agents view after a setup prompt (Windows) | → part 2 | `tengu_fleetview_stdin_contention` 1/0 | `agent_view_and_status.md` |
| 17 | `claude rm` leaving the removed job in the daemon roster | **NET_NEW** | `evict: v.boolean().optional()` 1/0 `:330157`; handled `:679374-679377` | store §3.1 |
| 26 | Agents view status column uses full terminal width | → part 2 | `MAX_STATUS_WIDTH` 0/0 | `agent_view_and_status.md` |
| 27 | Ctrl+X permanently removes a completed session; no double rows | **NET_NEW** | `evict` protocol field + `deleteJob` `:681118` | store §3.1; part 2 for the keybinding |

### 2.1.207

| # | Bullet (abridged) | Verdict | Anchor (220/193) | Where |
|---|---|---|---|---|
| 8 | `extensions.worktreeConfig` left in `.git/config` after the last worktree | **NET_NEW** | `worktreeConfig` 4/0 `:225915` | store §5.5 |
| 11 | Plan-auto-named bg sessions not showing that name on the row | → part 2 | `rosterName` 1/0 | `agent_view_and_status.md` |
| 12 | Bg sessions that entered a worktree resuming blank after cold reopen | **UNANCHORED** | `Session is starting` 2/1 belongs to `.208` #39 | worker §7.1 (adjacent) |
| 17 | Re-pasting expands the collapsed `[Pasted text #N]` placeholder | **CARRYOVER** | 3/3 | → part 2 |
| 18 | Blocked peeks lead with the question + worded staleness clock | → part 2 | `${i.label} needs your input` 5/**4** | `agent_view_and_status.md` |

### 2.1.208

| # | Bullet (abridged) | Verdict | Anchor (220/193) | Where |
|---|---|---|---|---|
| 3 | `CLAUDE_CODE_PROCESS_WRAPPER`: corporate launcher for every self-spawn | **NET_NEW** | `CLAUDE_CODE_PROCESS_WRAPPER` 13/0 `:60632`, `:267645`; `processWrapper` 16/0 | daemon §3 |
| 7 | Replies typed to a bg agent lost when delivery fails | → part 2 | `tengu_bg_reply_outcome` 2/0 `:680878` | `bg_notifications_and_reporting.md` |
| 8 | Attach failing permanently after an update replaced the running binary | **DELTA** | `tengu_bg_attach_upgrade` gate 1/**1** (carryover); `tengu_bg_respawn_downgrade_refused` 2/0 `:553647` | worker §1 |
| 21 | Repeated "No completion record was found" collapsed into one summary | → part 2 | 6/**2** | `bg_notifications_and_reporting.md` |
| 28 | Memory leak: agent-view pasted images retained | → part 2 | 0/0 | `50_performance/` |
| 37 | Memory when resuming sessions with bg agents or forks | **UNANCHORED** | `tengu_precomputed_compact_rehydrated` 1/0 (adjacent) | `07_compact/` |
| 38 | Completed bg agents stay listed in `/tasks` until cleanup | cross-theme | `evictAfter` kill branch `:747150` | `46_todo_tasks/` |
| 39 | Attaching to a stopped agent shows its transcript immediately | **NET_NEW** | `Session is starting — showing its transcript until it appears` 1/0 | worker §7.3 |
| 40 | An older daemon no longer restarts newer-version workers | **NET_NEW** | `tengu_bg_respawn_downgrade_refused` 2/0 `:553647`; `isNewerBuild` `:553659` | worker §1.1; daemon §2.3 |
| 41 | Ctrl+X: renamed-branch worktrees, unpushed commits, name reuse | **DELTA** | `leftWorktreeDir` 3/0; `keptReason` 3/**3** (carryover); five new advice strings `:683251`-`:683262` | store §3.4 |
| 43 | `/install-github-app` and `/mcp` no longer open in bg sessions | cross-theme | `tengu_slash_command_unavailable` 2/0 | `43_slash_commands/`; → part 2 |

### 2.1.209

| # | Bullet (abridged) | Verdict | Anchor (220/193) | Where |
|---|---|---|---|---|
| 1 | `/model` and other dialogs unblocked in bg sessions (revert of `.208` #43) | cross-theme | `unavailable_in_agent_view` 2/0 `:806776` | `43_slash_commands/`; → part 2 |

### 2.1.210

| # | Bullet (abridged) | Verdict | Anchor (220/193) | Where |
|---|---|---|---|---|
| 7 | `claude attach` "job not found" / "agent is still starting" during transitions | **NET_NEW** | `tengu_bg_handoff_settle` 1/0 `:869956`; `job not found` 6/**6** | store §7; daemon §2 |
| 17 | Bg workers crash-looping when a client resets its connection | **UNANCHORED** | `ECONNRESET` 20/**15**; `Fdr` regex `:330102` includes `ECONNRESET` | worker §3 (adjacent) |
| 18 | `claude agents --effort ultracode` silently dropped | cross-theme | `"ultracode"` 83/**70** | `47_models/` |
| 19 | Pressing `←` to open the agents view dropping the task tracker | → part 2 | `tengu_left_arrow_editing_guard` 1/0 | `agent_view_and_status.md` |
| 20 | Agents dashboard retaining pasted images from abandoned drafts | → part 2 | — | `50_performance/` |
| 21 | Killed bg sessions leaving a permanent `git worktree lock` | **NET_NEW** | `tengu_worktree_stale_lock_released` 1/0 `:226097` | store §5.2 |
| 31 | Footer hint shows how many bg agents await your input | → part 2 | `tengu_fleet_nudge_state` 1/0 | `agent_view_and_status.md` |
| 32 | The session you pressed `←` from stays visibly marked | **CARRYOVER** | `keepInPlaceIds` 2/2 | → part 2 |

### 2.1.211

| # | Bullet (abridged) | Verdict | Anchor (220/193) | Where |
|---|---|---|---|---|
| 14 | Reopening a just-stopped bg session started a blank conversation, same id | **NET_NEW** | `reapedMidWorkAt` / `reapedUnsettledAt` 6/0 each; `:682953` | worker §7.3 |
| 17 | Bg jobs on gateway auth came back "Not logged in" after daemon respawn | **NET_NEW** | `tengu_bg_adopt_token_lost_respawn` 3/0 `:553850` | worker §5 |
| 18 | Jobs undeletable when git no longer recognizes their worktree | **NET_NEW** | `git no longer recognizes` 2/0 `:225854`; `oZg` `:226315` | store §5.3 |
| 22 | Session titles showing the naming model's refusal text | **CARRYOVER** | refusal regex 1/1 | — |
| 23 | User-killed bg agents auto-respawning; revived agents re-running stale prompts | **NET_NEW** | `tengu_bg_respawn_suppressed` 2/0 (`no_task_contract`, `:554668`); `tengu_bg_revival_guard` 1/0 | worker §4 |
| 27 | Bg agent result reporting — status of still-running agents, no fabrication | → part 2 | `Never fabricate or predict a pending agent's results` 2/0 | `bg_notifications_and_reporting.md` |

### 2.1.212

| # | Bullet (abridged) | Verdict | Anchor (220/193) | Where |
|---|---|---|---|---|
| 1 | `/fork` copies the conversation into a new bg session; old behaviour → `/subtask` | → part 2 | `/subtask` `:500574`; `tengu_session_fork` 2/**1** | `fork_to_background_session.md` |
| 6 | `/resume` in the agent view opens a past-session picker | → part 2 | `tengu_fleet_past_sessions` 1/0 | `agent_view_and_status.md` |
| 8 | Worktree creation following a repository-committed symlink at `.claude/worktrees` | **NET_NEW** | `git_worktree_create_symlink_rejected` 1/0 `:224562-224564`; `git_worktree_create_containment_failed` 1/0 `:224855`; `git_worktree_create_hook_ancestry_rejected` 4/0. 193 had **no** guard (`:591578`, `:591627-591628 (193)`) | store §8 |
| 11 | `/background` / `claude --bg` uv_spawn failure on Windows; prefers PowerShell 7 | **DELTA** — "prefers PS 7" is carryover (§2) | `tengu_bg_daemon_spawn_launcher_fallback` 1/0 `:679855`; new PS 5.1 last resort `:168568-168572` | daemon §5.2 |
| 14 | Ctrl+J newline in the agent-view dispatch input | → part 2 | `ctrl+j for newline` 1/0 | `agent_view_and_status.md` |
| 24 | `/fork` sessions losing live-parent protection after a write failure | → part 2 | `liveParent` 0/0; `tengu_persistence_suppressed` 2/0 | `fork_to_background_session.md` |
| 25 | Reopening a stopped bg session from the agent view failing silently | **NET_NEW** | `tengu_bg_respawn_resume_conflict` 2/0 `:681733`; `tengu_bg_respawn_probe_rescue` 1/0 `:681696` | worker §7.1, §7.2 |
| 37 | Cold-attaching a bg agent instantly shows the formatted transcript | **DELTA** | `coldAttach` 0/0; `tengu_bg_attach_wake_after_reap` 1/0 | worker §7.3 |
| 39 | `/fork` names the copy after your prompt | → part 2 | `--fork-name` `:443144` | `fork_to_background_session.md` |
| 41 | `←` footer hint pulses `N done` | → part 2 | `tengu_fleet_nudge_state` 1/0 | `agent_view_and_status.md` |
| 46 | Sandbox/MCP/managed-settings waits show "Needs input" | → part 2 | `needsInput` 6/0; label `Needs input` 2/**2** | `agent_view_and_status.md` |

### 2.1.214

| # | Bullet (abridged) | Verdict | Anchor (220/193) | Where |
|---|---|---|---|---|
| 13 | Reasoning effort added to the `subagentStatusLine` payload | cross-theme | `effort: g.effort` 1/0; `subagentStatusLine` 11/**11** | `47_models/`; → part 2 |
| 26 | Displaced bg daemon deleting its successor's control socket on shutdown | **NET_NEW** | `tengu_bg_handoff_settle` 1/0 `:869956`; `skipUnlink` on displaced close `:869925`; post-adopt guard `:869720-869733` | store §7; daemon §2 |
| 27 | Sessions parked with `←`/`/background` keeping the daemon + worker alive | **NET_NEW (gates only)** | `tengu_bg_daemon_bg_disabled_skip` 1/0; `tengu_retention_sweep` 3/0 `:665697` | daemon §7.1; store §6 |
| 28 | Completed sessions unremovable via `claude rm` once the service went idle | **NET_NEW** | `claude rm` 9/**4**; client-side eviction `:680791-680794` | store §3.3 |
| 29 | Sessions dispatched from a non-git folder undeletable from the agents view | **NET_NEW** | `git no longer recognizes` 2/0; `removeRootlessAgentWorktree` `:225653` | store §5.3, §5.4 |
| 30 | Reopening a stopped bg session failing to restore its conversation | **NET_NEW (gates only)** | `tengu_resume_unchained_transcript` 1/0; `tengu_transcript_writer_recovered` 2/0 | worker §7.1 |
| 32 | `/install-github-app` and `/mcp` blocked in agent-view sessions | cross-theme | `tengu_slash_command_unavailable` 2/0 | `43_slash_commands/` |

### 2.1.216

| # | Bullet (abridged) | Verdict | Anchor (220/193) | Where |
|---|---|---|---|---|
| 7 | Resumed bg agent sessions reverting to the default agent | **UNANCHORED** | `tengu_bg_respawn_resume_conflict` 2/0 + `tengu_bg_attach_wake_after_reap` 1/0 are adjacent, neither is the agent-identity path | — |
| 9 | Worktree sessions landing in another project's leftover worktree | **NET_NEW** | `Cannot enter worktree` 16/**14**; owner-root derivation `:225342-225371` vs `:591947-591972 (193)` | store §5 |
| 10 | Bg sessions whose worktree has no git repo being undeletable | **NET_NEW** | `could not canonicalize the path` 1/0 `:225693`; `has files but no repository to verify them against` `:226262` | store §5.4 |
| 11 | `claude daemon stop --any` terminating an unrelated process via a stale legacy lockfile | **NET_NEW** | `could not be verified as the daemon, so it was not signalled` 2/0 `:871860`; `Y0r` gate `:871795` vs 193 `:718038` | daemon §4 |
| 14 | Ctrl+X twice failing to delete; deleted sessions reappearing | **NET_NEW** | `evict` before the handle lookup `:679374`; `kill_unconfirmed` guard `:681129` | store §3.1, §3.2 |
| 30 | `/fork` confirmation to one line | → part 2 | `tengu_session_fork` 2/**1** | `fork_to_background_session.md` |
| 37 | `/mcp` and `/install-github-app` park a "needs input" request | → part 2 | `needs input` 6/**3** | `agent_view_and_status.md` |
| 40 | Cloud sessions dropping the in-flight message when the container restarts | cross-theme | `tengu_resume_interrupted_turn` 2/0 | `57_api_reliability/` |

### 2.1.217

| # | Bullet (abridged) | Verdict | Anchor (220/193) | Where |
|---|---|---|---|---|
| 5 | Bg session isolation not canonicalizing symlinked working directories | **NET_NEW** | `canonicaliz*` 14/**5**; `could not canonicalize the path` 1/0 `:225693`; triple `realpath` `:225692`/`:225711`/`:225717` | store §5.4 |
| 12 | Bg shells impossible to stop after `/background` or `←`, or on session exit | **UNANCHORED** | `tengu_bg_stdin_unreadable` 1/0 `:682705` and `tengu_bg_handoff_settle` 1/0 are adjacent; the stop path itself was not isolated | worker §7.4 (partial) |
| 14 | Transcript preview flush against the input area when attaching | → part 2 | layout, no literal | `agent_view_and_status.md` |

### 2.1.218

| # | Bullet (abridged) | Verdict | Anchor (220/193) | Where |
|---|---|---|---|---|
| 1 | `/code-review` runs as a background subagent | cross-theme | `tengu_stacked_slash_commands` 1/0 | `52_code_review/` |
| 4 | Left arrow discarding the conversation with no undo; confirm + Esc | → part 2 | `tengu_left_arrow_editing_guard` 1/0 `:559928` | `agent_view_and_status.md` |

### 2.1.219

| # | Bullet (abridged) | Verdict | Anchor (220/193) | Where |
|---|---|---|---|---|
| 17 | `claude --teleport` shows which repo your checkout points at on mismatch | cross-theme | `tengu_teleport_repo_host_unverified` 1/0 | `43_slash_commands/` |

---

## 5. Ledger summary

| Verdict | Rows |
|---|---:|
| **NET_NEW** (anchored, mechanism documented here) | 34 |
| **DELTA** (literal pre-exists, narrower change identified) | 11 |
| **CARRYOVER** (explicitly not a change in this window) | 8 |
| **UNANCHORED** (honest: no distinguishing literal found) | 13 |
| **→ part 2** or another module (cross-theme) | 65 |
| **Total rows ledgered** | **131** |

The 34th NET_NEW row is `.212` #8 (worktree-creation symlink guard), adopted from deferral **D1** in
`_xval_contradictions.md` §2b and written up in `session_store_and_worktrees.md` §8.

Of the 34 NET_NEW and 11 DELTA rows, **45 are covered in this module's three docs**. Every one of
the 27 gate names assigned to part 1 in the seed list was grepped in both bundles, and all 27 are
**220>0 / 193=0**; 24 of them have their emitter read and explained in a doc section.

---

## 6. Not covered / open questions

**Bullets I could not anchor (13).** Listed in the ledger as UNANCHORED with the probe that
failed. The most substantive gaps:

- `.199` #9 (progress indicators stalling for minutes). The scoping file's suggested anchor
  (`tengu_bg_prewarm_burst`) is the post-takeover upgrade wave and has nothing to do with
  progress reporting. The likely home is the rendezvous-heartbeat/`tengu_bg_worker_stalled` path
  (`:554789-554793`, `yq_ = 120000` at `:554835`) but I could not show a 193 difference there, so
  I left it unanchored rather than claim it.
- `.217` #12 (background shells impossible to stop). I documented
  `tengu_bg_stdin_unreadable` (worker §7.4) but the *stop* path for `local_bash` tasks
  after `/background` lives in the task registry, not the bg worker, and I did not trace it.
- `.202` #4 (`/rename` reverted on restart), `.203` #20 (`effortLevel` ignored when daemon-forked),
  `.203` #25 (Windows output replaced after `/clear`), `.216` #7 (resumed session reverts to the
  default agent). All four are "a field is not carried across respawn"; the *mechanism* is the
  `cappedDispatch` / `rosterExtras` machinery I documented in store §1 and §4, but I could not
  identify which specific field each bullet refers to, so I did not guess.
- `.210` #17 (`ECONNRESET` crash loops): `Fdr = /\bE(?:NOENT|CONNREFUSED|CONNRESET)\b|control
  socket closed/` at `:330102` is clearly relevant, but `ECONNRESET` is 220=20 / 193=15 across the
  whole bundle and I did not isolate the changed site.
- `.198` #16 (macOS Local Network entitlements) is a native-bundle change with no JS anchor —
  `Local Network`, `route to host` and `com.apple.security.network.client` are all 0/0 in both
  bundles. Correctly outside a JS-bundle analysis.

**Deliberately not covered (owned elsewhere):** the `claude agents` view (rows, status column,
footer nudges, `←` gestures, empty state, peeks, pasted-image retention), `/fork` and
`/subtask`, notifications and result-reporting prompts, and the slash-command availability
guard. All are marked → part 2 or → another module in the ledger.

**Open questions for a future pass:**

1. `Fdr` / `Ndr` / `Udr` / `Rpt` / `jdr` (`:330101-330105`) are five error-classification regexes
   on the control protocol. 193 has three (`b_t`, `X6t`, `J6t` at `:486133-486135 (193)`), so two
   are new — which bullets do `Fdr` (`ENOENT|ECONNREFUSED|ECONNRESET|control socket closed`) and
   `jdr` (`/^E[A-Z]+:/`) serve?
2. `dq_ = new Set([129, 143])` treats only SIGHUP and SIGTERM as external stops. What happens to a
   `SIGINT` (130) kill of a background worker — is that a deliberate exclusion?
3. ~~Does a claimed spare inherit the *spare's* PATH or the *dispatch's*?~~ **ANSWERED in the
   second pass — the dispatch's.** `buildClaimFrame` (`:553973-553979`) calls
   `jhp(dispatchRequest, jobDir, snapshot, rvSock, auth)` at `:553975`, i.e. the *same*
   `buildWorkerEnv` with the new PATH normalisation, and `eSE` (`:869085-869088`) ships the result
   to the idle spare as `{ cwd, env, argv, sessionId, auth }` over its claim socket
   (`tSE`/`rSE`, `:869089-869104`, 5 s deadline with an ENOENT/ECONNREFUSED retry ladder). The
   spare's boot-time environment is therefore *replaced* by a dispatch-derived one before the
   session starts, so `.203` #8's PATH fix covers claimed spares as well as cold spawns. Failure
   mode: if the claim frame cannot be delivered, `$vl` (`:869067-869084`) emits
   `tengu_bg_sendclaim_failed` and SIGTERMs the spare rather than letting it run with the wrong
   env. Written up in [`session_store_and_worktrees.md`](./session_store_and_worktrees.md) §4.5.
4. The `ps -o lstart=` dead branch in `readProcStartUncached` (`:112444-112448`, identical in 193)
   suggests a compiled-out non-Linux path. Is macOS `procStart` actually being read, or does
   `mB(pid, undefined)` fail open on every Mac? If the latter, the `.216` #11 fix is
   Linux-effective only — worth measuring.

---

## 7. Second-pass verification log (what was re-read, and what it corrected)

A second pass re-derived a sample of this module's claims from scratch in the 2.1.220 bundle
(~1,500 lines read across 24 regions, plus 5 regions in the 2.1.193 baseline) and re-ran
`grep -c` in **both** bundles for ~80 literals. Everything below was checked line-by-line, not
carried over.

**Confirmed exactly as written** (verbatim ORIGINAL match at the cited lines):
`Kmy` `:267559-267582`; the settings→env promotion `:267849-267857` and its reset `:267862`;
`rUt`/`hhp`/`mhn`/`ugt`/`iSr` `:552441-552483` with `eq_ = ["dev","engine"]` `:552486`;
`t7s`/`oq_` `:552598-552622` with `rq_ = 4` `:552630` and the sysctl name buffer `:552638`;
the lock-writer retry `:870572-870579` and the ten lock fields `:870580-870600`;
the whole `daemon.lock` I/O + identity family `:664707-664845` (`Y0r` `:664788`, `cAa`
`:664779`, `QH` `:664794`, `zAn = 2` `:664844`, `hYo = 250` `:664845`);
`daemon stop` holder classification `:871793-871807`, `:871835-871837`, `:871856-871865`;
`dwo` `:330031-330036`; `fks`/`mks` `:330106-330133` (`looseObject` + `.catch(0)`) and `evict`
`:330157`; `respawnIfIdleStale` `:553653-553717`; `doSpawnUnlessSettledOnDisk` `:554654-554673`;
`scheduleRespawn` `:554686-554703`; every worker constant `:554822-554885`; `jhp`
`:553391-553446` and `Ghp` `:553447-553451`; `cappedDispatch` `:554216-554232` and `Sxt`
`:57882`; `Vor`'s eighteen gates `:225653-225719`; `WRu` `:226047-226099`; the PowerShell ladder
`:168540-168574`. Baseline: `R0()` `:501897-501907 (193)`, `daemon stop` `:718011-718038 (193)`,
the strict roster schema `:486136-486163 (193)`, `wec`'s watchdog line `:606918 (193)` and
base-URL branch `:606936 (193)`, `cappedDispatch` `:607504-607514 (193)`, `Vfp` `:299400-299429
(193)`, the 193 lock writer `:717216-717218 (193)`.

**Corrected by the second pass:**

| Was | Now | Why |
|---|---|---|
| `keptReason` presented as 193=0 (inherited from the scoping probe) | **220=3 / 193=3, carryover** | measured in both bundles; 193 sites `:575654`, `:577390`, `:674782`. Only `leftWorktreeDir` is new. See §2. |
| eleven changelog bullets cited under the wrong release in the three docs (`.202` #14, `.215` #11, `.212`↔`.211` #11, `.203`↔`.205` #4/#7, `.207`↔`.208` #8, `.211`↔`.214` #26/#28/#29, `.211`↔`.212` #25, `.215`/`.216`↔`.216`/`.217` #5/#10/#14, `.216`↔`.217` #12, `.208` #7↔`.210` #7) | renumbered against `claude_code_v_2.1.220/CHANGELOG.md` | the window skips `.201`/`.204`/`.209`/`.213`, and the first pass drifted; the §4 ledger was already correct. ⚠ **This "now agree" claim was premature** — a later mechanical audit (every `\| .VER \| #N \|` row matched against the CHANGELOG) found **9 rows in `agent_view_and_status.md` still mis-tagged** (`.198`→`.196` ×3, `.202`→`.200`, `.208`→`.206`, `.208`→`.207`, `.214`→`.212`, `.216`→`.218`, `.218`→`.217`). All 9 are now fixed and the file re-verifies 30/30. Note the drift was **not uniform** — two rows drifted *backward*, so a bulk offset would have been wrong. |
| `.202` #4 used in §2 for the macOS low-memory bullet | `.203` #4 | `.202` #4 is the `/rename` bullet |
| §5.4 titled "twelve gates" while its own table listed eighteen | "eighteen gates" | the table matches `:225668-225717` |
| `claude rm` advice strings cited as a range `:683243-683266` | the five exact lines `:683251`, `:683254`, `:683257`, `:683260`, `:683262` | read the ternary chain |
| open question 3 (spare PATH inheritance) | **answered**: the dispatch's, via `buildClaimFrame` `:553975` → `eSE` `:869086` | see store §4.5 |
| §1.1 implied both `launchTarget` and `processWrapper` were new lock fields | `launchTarget` is carryover (`:717217 (193)`) | daemon §1.1 |

**Also re-measured and unchanged:** all 27 part-1 gate names are still 220>0 / 193=0; `.orphaned-`
is 220=1 / 193=0 (an unescaped-dot grep inflates it to 7/6 — use `grep -F`); the
`Session is starting … showing its transcript` constant is `vjb` `:678954`, 220=1 / 193=0 — but
the bundle stores the em dash as the six-character escape sequence `\u2014`, so grepping the rendered string
returns 0/0; grep for `showing its transcript` instead. Both traps cost a false "0/0 unanchored"
verdict if unnoticed.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> All symbols newly derived for this module are staged, with the target index file named per group,
> in [symbol_additions_v2_1_220_background_agents_daemon.md](../00_overview/symbol_additions_v2_1_220_background_agents_daemon.md).

Key entry points across the three docs:

- `readVerifiedDaemonLock` (QH) / `lockHasProcStartIdentity` (Y0r) - daemon identity discipline
- `parseEmbeddedBuildTimestamp` (rUt) / `isNewerBuild` (mhn) / `isOlderBuild` (hhp) - handover recency
- `validateProcessWrapper` (Kmy) / `resolveProcessWrapper` ($Qr) - the corporate launcher
- `spawnDaemonProcess` (lJo) / `macosAquaWrapPrefix` (jjb) - daemon creation
- `BackgroundWorker` (mme) - the worker handle, phase machine and respawn logic
- `respawnIfIdleStale` / `doSpawnUnlessSettledOnDisk` - in-background upgrade and revival guards
- `readRoster` (v6) / `extractUnknownRosterFields` (dwo) - roster durability
- `readJobState` (Da) / `writeJobState` (um) - the session store
- `buildWorkerEnv` (jhp) / `cappedDispatch` - environment inheritance
- `releaseStaleClaudeWorktreeLocks` (WRu) / `removeRootlessAgentWorktree` (Vor) - worktree hygiene
