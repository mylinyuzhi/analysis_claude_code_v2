# Agent Teams Module (30_agent_team) — v2.1.112

## TL;DR — v2.1.88 → v2.1.112 in 30 Seconds

The agent-teams subsystem is **structurally and protocolically the same product** between v2.1.88 and v2.1.112. The diff is small and easy to summarize:

| Δ | Change | Where |
|---|--------|-------|
| 🔥 | **Ant-user gate bypass removed** — `USER_TYPE=ant` no longer skips the `tengu_amber_flint`/env-var checks | `z4` chunks.63.mjs:2617 |
| 🔥 | **Permission mode now inherits from leader** — teammate adopts leader's `acceptEdits`/`bypassPermissions`/`auto` (was always `default`/`plan` in v2.1.88) | `Y0z` chunks.100.mjs:1073 |
| ⚠️ | **`clearMailbox` now lock-protected** — was raceable `flag:'r+'` write; now lockfile-acquired then write | `O18` chunks.100.mjs:103 |
| ⚠️ | **SendMessage prompt's UDS_INBOX section dead-code-eliminated** — model no longer told about `uds:`/`bridge:` cross-session schemes (validators retained) | chunks.153.mjs `SVK` |

**The most user-visible change is permission inheritance** — a leader running with `acceptEdits` now spawns teammates that also start in `acceptEdits` (less re-prompting). Everything else (wire protocol, schemas, dispatch flow, runner structure, polling, hooks, telemetry, prompts apart from UDS) is bit-for-bit equivalent.

For the full breakdown including code excerpts and per-symbol mapping, see [V2188_VS_V2112_DIFF.md](./V2188_VS_V2112_DIFF.md). For methodology and validation details, see [CROSS_VALIDATION.md](./CROSS_VALIDATION.md) (against v2.1.112 binary) and [CROSS_VALIDATION_V2188.md](./CROSS_VALIDATION_V2188.md) (against v2.1.88 TypeScript source).

---

## Overview

**Agent Teams** is the multi-agent collaboration subsystem in Claude Code v2.1.112. It lets a *team lead* (the primary Claude session) spawn one or more *teammates* — independent Claude agents that share the same team workspace and communicate over a file-based mailbox protocol. Teammates can run in three execution backends:

1. **In-process** — same Node.js process; cheap, supports the same React UI surface.
2. **Split-pane** (tmux or iTerm2) — spawned as CLI subprocesses inside the host terminal.
3. **Separate window** — tmux `new-window`, also a CLI subprocess.

The system is **dual-gated**: it requires both `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` (or `--agent-teams`) AND the `tengu_amber_flint` feature flag. The gate function is `z4` (chunks.63.mjs:2617).

Each teammate runs its own long-lived agent loop (`bXY` — `inProcessAgentRunner` for in-process; CLI process for pane-based). Between work cycles it polls a **5-level priority queue**: pendingUserMessages → shutdown_request → team-lead messages → peer messages → unclaimed task auto-claim. The poll interval is **500 ms** (`yXY = 500`, chunks.155.mjs:316).

Tools that hit the mailbox: **SendMessage** (`LJY`, chunks.153.mjs:367) and **Agent** (when `name` + `team_name` are provided, `RHK` at chunks.141.mjs:456). Spawning is dispatched through `n7Y` (chunks.137.mjs:2929) which routes to `c7Y` (split-pane), `l7Y` (separate window), or `j2K` (in-process) based on terminal capability and config.

## Key Characteristics

- **File-Based IPC** — Each agent has an inbox JSON file at `{claudeDir}/{sanitizedTeamName}/inboxes/{sanitizedAgentName}.json`. All writes go through `proper-lockfile` (`Jj`) with retry settings shared across the codebase.
- **5-Level Priority Polling** — `CXY` (chunks.154.mjs:2462) inspects in-memory `pendingUserMessages` first, scans all messages for shutdown_request (priority bypass), then prefers team-lead sender, then any unread, finally falls back to claiming an unowned task.
- **Three Spawn Backends** — `n7Y` chooses between `j2K` (in-process), `c7Y` (split-pane), and `l7Y` (tmux window). The in-process check is `bF()` (chunks.155.mjs:1104), which prefers in-process unless inside iTerm2 or tmux when no override forces it.
- **Auto Task Claim** — When the mailbox is empty, `HNK` (chunks.154.mjs:2443) calls `RXY` to find the lowest-id pending task with all `blockedBy` resolved, then claims it via `HR4` and feeds `SXY` ("Complete task #N…") back into the runner as a synthetic user message.
- **Permission Sync over Mailbox** — A teammate that needs leader approval calls `aI8` (chunks.100.mjs:1377) which writes a `permission_request` to the leader's inbox; the leader responds via `sI8` with a `permission_response`.
- **Idle Notifications** — When the agent loop quiesces, the runner calls `jNK` → `hXY` → `F_` to write an `idle_notification` to the leader's inbox. Reasons: `available`, `interrupted`, or `failed`.
- **Plan-Mode Integration** — Teammates spawned with `plan_mode_required:true` enter plan mode; `awaitingPlanApproval` blocks them in the runner. Approvals/rejections come back through SendMessage as `plan_approval_response`.
- **Per-Teammate AsyncLocalStorage** — `eQ(Z, ...)` (chunks.63.mjs:2632) wraps each turn so any nested telemetry/log call sees the current `agentId`/`teamName`/`isTeamLead` context.
- **Hook Integration** — `TeammateIdle` and `TaskCompleted` hooks fire from the runner. Hooks can preventContinuation.
- **Auto-Compaction Inside Teammate** — Each teammate's nested loop runs its own threshold check and calls `vI6` (the standard compactor) when it crosses the autocompact window. PreCompact-blocked compactions are caught and logged.

## Module Structure

| Document | Purpose |
|----------|---------|
| [implementation.md](./implementation.md) | High-level architecture, full lifecycle, in-process runner skeleton |
| [spawn_mechanism.md](./spawn_mechanism.md) | `n7Y` dispatch, `j2K` in-process, `c7Y` split-pane, `l7Y` tmux-window |
| [mailbox_protocol.md](./mailbox_protocol.md) | File layout, locking semantics, message envelope, message-type registry |
| [polling_priorities.md](./polling_priorities.md) | The 5-level priority loop in `CXY`, shutdown bypass, task auto-claim |
| [in_process_runner.md](./in_process_runner.md) | The `bXY` long-lived loop, abort wiring, embedded compaction, AsyncLocalStorage scope |
| [permission_sync.md](./permission_sync.md) | Worker→leader permission round-trip via mailbox (`aI8`/`sI8`) |
| [plan_mode_integration.md](./plan_mode_integration.md) | `plan_mode_required` propagation, `awaitingPlanApproval` gate, plan_approval messages |
| [tui_integration.md](./tui_integration.md) | Team status renderer, agent tab, spinner verbs, color assignment |
| [hooks_and_telemetry.md](./hooks_and_telemetry.md) | `TeammateIdle`/`TaskCompleted` hooks; `tengu_team_*` events |
| [configuration_schema.md](./configuration_schema.md) | Team config, members registry, env vars, feature flags, CLI flags |
| [edge_cases_and_failures.md](./edge_cases_and_failures.md) | Lock contention, ENOENT, runtime aborts, fallback chains, shutdown approval |
| [CROSS_VALIDATION.md](./CROSS_VALIDATION.md) | Symbol-by-symbol audit of the analysis vs the v2.1.112 source — validations, errors, gaps |
| [CROSS_VALIDATION_V2188.md](./CROSS_VALIDATION_V2188.md) | Cross-validation against the v2.1.88 unobfuscated TypeScript source at `claude-code/src/` — confirms protocol-level invariants and surfaces v2.1.112 behavior changes |
| [V2188_VS_V2112_DIFF.md](./V2188_VS_V2112_DIFF.md) | High-level summary of v2.1.88 → v2.1.112 differences: 3 behavior changes, 1 prompt change (UDS_INBOX DCE), cosmetic obfuscation renames; everything else identical |

## Architecture: Three-Backend, One-Mailbox

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          User (CLI/IDE)                                    │
└──────────────────────────────────────┬─────────────────────────────────────┘
                                        │
                            Agent tool / SpawnTeammate
                                        │
                                        ▼
                       ┌────────────────────────────────┐
                       │  Team Lead (primary Claude)     │
                       │  agentId = leadAgentId          │
                       │  inbox at .../team-lead.json    │
                       └────┬──────┬──────┬──────────────┘
                            │      │      │
                            │      │      │  spawn dispatcher: n7Y
                            │      │      │   ├─ bF()  → j2K (in-process)
                            │      │      │   ├─ split → c7Y (tmux pane)
                            │      │      │   └─ else  → l7Y (tmux window)
                            │      │      │
                  ┌─────────▼──┐ ┌─▼─────┐ ┌─▼──────────┐
                  │ Teammate A │ │ T. B  │ │ T. C        │
                  │ in-process │ │ pane  │ │ tmux window │
                  └─────┬──────┘ └─┬─────┘ └─┬───────────┘
                        │          │          │
                        └──────────┴──────────┘
                                   │
              ┌────────────────────────────────────────┐
              │  ~/.claude/{sanitizedTeam}/inboxes/    │
              │      team-lead.json                    │
              │      teammate-a.json                   │
              │      teammate-b.json                   │
              │  ~/.claude/{sanitizedTeam}/tasks.json  │
              │  ~/.claude/{sanitizedTeam}/config.json │
              └────────────────────────────────────────┘
```

## Spawn Routing Decision Tree

```
n7Y  (spawnTeammateDispatcher) chunks.137.mjs:2929
  │
  ├─ bF() == true  ? ─────────► j2K (spawnInProcessTeammate)
  │   ├─ Same Node.js process
  │   ├─ AbortController-driven lifecycle
  │   ├─ Polled by CXY (in-memory + mailbox)
  │   └─ Uses Jg8(...) → bXY(...) to start the loop
  │
  ├─ try v96() (pane backend probe)
  │   └─ catch  → if mode=="auto", fall back to j2K (in-process fallback)
  │
  ├─ q.use_splitpane !== false ? ──► c7Y (spawnSplitPaneTeammate)
  │   ├─ tmux "split-window -h" / iTerm2 split
  │   ├─ CLI subprocess: cd $cwd && env $env claude --agent-id .. --team-name ..
  │   └─ Communicates via mailbox only
  │
  └─ else  ────────────────────────► l7Y (spawnTmuxTeammate)
      ├─ tmux "new-window -t claude-swarm"
      ├─ CLI subprocess (same arg shape)
      └─ Communicates via mailbox only
```

## Message Polling Priority (In-Process Runner)

```
CXY poll loop (chunks.154.mjs:2462), 500 ms idle interval:
  │
  [1] task.pendingUserMessages   (in-memory queue from AppState — highest priority)
  │
  [2] shutdown_request            (scan whole mailbox; bypasses ordering)
  │   └─ uses i56() to detect; calls Y18() to mark single index read
  │
  [3] team-lead messages          (unread with from === Mz "team-lead")
  │
  [4] any other unread message    (peers / broadcasts; first found)
  │
  [5] HNK() → RXY() → HR4()       (find unowned task with deps satisfied,
                                    claim it, generate "Complete task #N…" prompt)
```

Empty result returns `{type: "aborted"}` only when the abort signal trips.

## Tool Surface

| Tool (display) | Symbol | File:Line | Purpose |
|----------------|--------|-----------|---------|
| `SendMessage` | `LJY` | chunks.153.mjs:367 | Send plain text, `shutdown_request`/`shutdown_approved`/`shutdown_rejected`, `plan_approval_response`. Recipient may be a teammate name or `"*"` for broadcast (string messages only). |
| `Agent` (teammate mode) | `RHK` | chunks.141.mjs:456 | When `name` + `team_name` are provided, dispatches into `P2K`→`n7Y` to spawn a teammate (always with `use_splitpane: true` — the only call site of `n7Y`). Without those it spawns a stateless subagent. |
| `TeamCreate` | `wJY` | chunks.152.mjs:2439 | Creates `~/.claude/teams/{team}/config.json` and seeds the team task list. Emits `tengu_team_created` with `teammate_count: 1` (just the lead). |
| `TeamDelete` (`Cc`) | `jJY` | chunks.152.mjs:2609 | Disbands a team — only succeeds when no active members remain (the lead must `requestShutdown` teammates first). Removes `~/.claude/teams/{team}/`, clears color registry, emits `tengu_team_deleted`. |

## Spawn Backends

| Backend | Symbol | Process | Mailbox | UI | Reachable in v2.1.112? |
|---------|--------|---------|---------|-----|------------------------|
| In-process | `j2K` → `cI8` → `Jg8` → `bXY` | Same Node.js | Yes (also in-memory `pendingUserMessages`) | Embedded React TUI; agent tab | ✅ via `bF()`==true |
| Tmux split-pane | `c7Y` → `tmux split-window` | CLI subprocess | Yes only | Visible pane | ✅ via Agent tool (default) |
| iTerm2 split | `c7Y` (with iTerm2 backend) | CLI subprocess | Yes only | iTerm2 native split | ✅ via Agent tool (when iTerm2 detected) |
| Tmux new-window | `l7Y` → `tmux new-window -t claude-swarm` | CLI subprocess | Yes only | Tmux window list | ❌ **unreachable** (only path needs `use_splitpane: false`; the only caller hardcodes `true`) |

`bF()` (chunks.155.mjs:1104) returns `true` (→ in-process) when the session is non-interactive, when the user explicitly set `teammateMode: "in-process"`, when a previous pane probe failed (`inProcessFallbackActive`), or when in auto mode AND the host is neither tmux nor iTerm2. **For interactive sessions inside tmux or iTerm2, the default is still pane mode.**

## Key Algorithms

### 1. Spawn Dispatch (n7Y)

```
n7Y(input, ctx):
  if bF(): return j2K(input, ctx)              # in-process
  try await v96()                                # pane backend probe
  catch e:
    if UX6() != "auto": throw                   # config forces pane
    return j2K(input, ctx)                      # automatic fallback
  if input.use_splitpane !== false:
    return c7Y(input, ctx)                      # split pane
  return l7Y(input, ctx)                        # separate window
```

`UX6()` reads `teammateMode` from team config; values are `"auto" | "in-process" | "tmux"`.

### 2. Mailbox Write (F_)

```javascript
F_(recipient, message, teamName):
  await dWz(teamName)                           # ensure {team}/inboxes/
  let path = eH6(recipient, teamName)           # {team}/inboxes/{recipient}.json
  let lock = path + ".lock"
  await Qh6(path, "[]", {flag: "wx"})           # create-if-missing
  catch e where !EEXIST: log and return
  let release = await Jj(path, {lockfilePath: lock, ...z18})  # proper-lockfile
  try {
    let msgs = await ts(recipient, teamName)    # read
    msgs.push({...message, read: false})
    await Qh6(path, JSON.stringify(msgs, null, 2))
  } finally release()
```

The `{flag: "wx"}` exclusive-create plus subsequent lock acquire avoids the read-modify-write race even across N spawning teammates concurrently writing to the leader's inbox.

### 3. Poll Cycle (CXY)

```
CXY(identity, abort, taskId, getAppState, setAppState, parentSessionId):
  poll = 0
  while !abort.signal.aborted:
    let task = getAppState().tasks[taskId]
    if task.pendingUserMessages.length > 0:
      pop oldest → return {type: "new_message", from: "user"}
    if poll > 0: await l7(500)                  # yXY = 500
    poll++
    if abort.signal.aborted: return {type: "aborted"}
    let msgs = await ts(name, team)
    # Pass 1: shutdown_request scan
    for m in msgs where !read:
      if i56(m.text):                            # parses shutdown_request
        await Y18(name, team, idx)
        return {type: "shutdown_request", request: parsed, originalMessage: m.text}
    # Pass 2: prefer team-lead sender
    let i = msgs.findIndex(m => !read && m.from == Mz)
    # Pass 3: any unread
    if i == -1: i = msgs.findIndex(m => !read)
    if i != -1:
      await Y18(name, team, i)
      return {type: "new_message", from: m.from, ...}
    # Pass 4: try task claim
    let prompt = await HNK(parentSessionId, name)
    if prompt: return {type: "new_message", from: "task-list", message: prompt}
  return {type: "aborted"}
```

The two-pass scan (shutdown first, then ordered preference) is what gives the leader the ability to interrupt a teammate even if dozens of peer messages are queued in front of it.

### 4. Task Auto-Claim (HNK)

```
HNK(parentSessionId, agentName):
  tasks = await Qf(parentSessionId)             # read tasks.json
  candidate = RXY(tasks)                         # first pending, unowned, deps clear
  if !candidate: return undefined
  res = await HR4(parentSessionId, candidate.id, agentName)
  if !res.success: return undefined              # raced; another teammate got it
  await ns(parentSessionId, candidate.id, {status: "in_progress"})
  return SXY(candidate)                          # "Complete task #N: subject\n\ndescription"
```

`HR4` writes the new owner under the same proper-lockfile lock as the read, so two teammates can never both claim the same task.

### 5. Idle Notification

```
On poll-loop entry (after each turn):
  setAppState(taskId, t => {...t, isIdle: true, fire onIdleCallbacks})
  if !wasAlreadyIdle:
    await jNK(agentName, color, teamName, {
      idleReason: interrupted ? "interrupted" : "available",
      summary: J18(messages)              # last assistant text trimmed
    })
```

`jNK` builds the JSON via `w18` and writes it to the leader's inbox via `hXY → F_`.

## Key Constants

| Constant | Value | Purpose | File:Line |
|----------|-------|---------|-----------|
| `yXY` | 500 | Poll interval (ms) | chunks.155.mjs:316 |
| `Mz` | `"team-lead"` | Reserved leader sender id | chunks.99.mjs:1920 |
| `Ny` | `"claude-swarm"` | Default tmux session name | chunks.99.mjs:1922 |
| `Fh6` | `"swarm-view"` | Default swarm-view tmux window | chunks.99.mjs:1924 |
| `mD` | `"tmux"` | Tmux command name | chunks.99.mjs:1926 |
| `Gi1` | `"claude-hidden"` | Hidden control pane name | chunks.99.mjs:1928 |
| `Uh6` | `"CLAUDE_CODE_TEAMMATE_COMMAND"` | Env var carrying the teammate launch command | chunks.99.mjs:1930 |
| `oX` | `"teammate-message"` (xml-tag name) | Tag wrapping incoming messages — emits `<teammate-message teammate_id="…">…</teammate-message>` | chunks.16.mjs:584 |
| `z18` | proper-lockfile config | `{retries: 10, minTimeout: 5ms, maxTimeout: 100ms}` | chunks.100.mjs:443 |

## Environment Variables & CLI Flags

| Variable / Flag | Effect |
|-----------------|--------|
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` | First-half of feature gate (`z4`) |
| `--agent-teams` | Alternative gate (sets `cN_()` true) |
| `--agent-id <id>` | Identify a teammate process at startup |
| `--agent-name <name>` | Sanitized name (used in inbox path) |
| `--team-name <team>` | Bind the process to a team |
| `--agent-color <hex>` | Color used in TUI tags |
| `--parent-session-id <id>` | Link to leader's session (tasks.json shared) |
| `--plan-mode-required` | Spawn already in plan mode |
| `--agent-type <type>` | Match a defined agent in `~/.claude/agents/` |
| `--teammate-mode <auto\|in-process\|tmux\|in-process-only>` | Force a backend |
| `--model <model>` | Pin the teammate's model |

## Feature Flags

| Flag | Effect |
|------|--------|
| `tengu_amber_flint` | Master switch (second half of `z4` gate) |

> **v2.1.112 change:** Pre-v2.1.112, ant users (`USER_TYPE === 'ant'`) bypassed both gate halves. v2.1.112's `z4()` removed that bypass — Anthropic-internal users now require both env-var/CLI-flag AND `tengu_amber_flint` like everyone else. Verified by reading v2.1.88 source (`utils/agentSwarmsEnabled.ts:24-44`) vs v2.1.112 binary (`chunks.63.mjs:2617-2621`).

## Telemetry Events

| Event | Where Fired | Payload |
|-------|-------------|---------|
| `tengu_team_created` | TeamCreate handler (chunks.152.mjs:2544) | team_name, teammate_count, lead_agent_type, teammate_mode |
| `tengu_team_deleted` | TeamCreate cleanup (chunks.152.mjs:2659) | team_name |
| `tengu_teammate_mode_changed` | Mode toggle (chunks.169.mjs:675) | from_mode, to_mode |
| `tengu_teammate_default_model_changed` | Default-model setting (chunks.169.mjs:1069) | new_model |
| `tengu_team_mem_sync_pull` / `_push` | Team memory sync (chunks.163.mjs) | path, entries |
| `tengu_team_mem_entries_capped` | Memory cap reached (chunks.163.mjs:973) | dropped |
| `tengu_team_mem_file_read/edit/write` | Team memory operations (chunks.163.mjs:1781-1791) | path, op |
| `tengu_agent_memory_loaded` | Agent definition memory loaded (chunks.155.mjs:46) | scope, source |

## Related Symbols

> Symbol mappings: see [symbol_index.md](../00_overview/symbol_index.md) — the v2.1.112 scoped diff index. New agent-team symbols added by this module are listed in the *Module: Agent Teams* section there.

Key functions in this module:

**Feature gate:**
- `isAgentTeamsEnabled` (`z4`) — chunks.63.mjs:2617 — Dual gate (env + flag) — was `E7` in v2.1.76
- `agentTeamsCliFlag` (`cN_`) — chunks.63.mjs:2613 — Reads `--agent-teams` CLI flag

**Spawning (chunks.137.mjs):**
- `spawnTeammateDispatcher` (`n7Y`) — chunks.137.mjs:2929 — Mode router — was `pNY` in v2.1.76
- `spawnSplitPaneTeammate` (`c7Y`) — chunks.137.mjs:2534 — Split-pane spawning — was `BNY`
- `spawnTmuxTeammate` (`l7Y`) — chunks.137.mjs:2653 — Separate tmux window — was `gNY`
- `spawnInProcessTeammate` (`j2K`) — chunks.137.mjs:2803 — In-process spawning — was `FNY`
- `spawnTeammateLegacyAlias` (`P2K`) — chunks.137.mjs:2941 — Trampoline that just calls `n7Y`
- `pickUniqueTeammateName` (`d7Y`) — chunks.137.mjs:2525 — Append `-2`, `-3`… on collision
- `registerInProcessTask` (`M2K`) — chunks.137.mjs:2757 — Build task registry entry for an in-process teammate
- `inProcessExecutorCheck` (`bF`) — chunks.155.mjs:1104 — Was `Rb` in v2.1.76

**Mailbox (chunks.99.mjs / chunks.100.mjs):**
- `getInboxPath` (`eH6`) — chunks.99.mjs:1934 — `{team}/inboxes/{agent}.json`
- `ensureInboxDirectory` (`dWz`) — chunks.99.mjs:1943
- `readMailbox` (`ts`) — chunks.99.mjs:1952
- `readUnreadMessages` (`qJ6`) — chunks.99.mjs:1965
- `writeToMailbox` (`F_`) — chunks.100.mjs:3 — was `x3` in v2.1.76
- `markMessageAsReadByIndex` (`Y18`) — chunks.100.mjs:38 — was `Vc6`
- `markMessagesAsRead` (`A18`) — chunks.100.mjs:73 — was `kc6`
- `clearInbox` (`O18`) — chunks.100.mjs:103
- `formatTeammateXmlBlocks` (`cWz`) — chunks.100.mjs:122
- `parseAgentName` (`_18`) — chunks.99.mjs:1902 — split `agent@team`
- `composeMessageId` (`ph6`) — chunks.99.mjs:1911 — `${type}-${ts}@${session}`

**Message envelopes (chunks.100.mjs):**
- `buildIdleNotification` (`w18`) — chunks.100.mjs:134
- `parseIdleNotification` (`$18`) — chunks.100.mjs:147
- `buildPermissionRequest` (`Ti1`) — chunks.100.mjs:155
- `buildPermissionResponse` (`Vi1`) — chunks.100.mjs:168
- `parsePermissionRequest` (`j18`) — chunks.100.mjs:186
- `parsePermissionResponse` (`KJ6`) — chunks.100.mjs:194
- `buildShutdownRequest` (`dh6`) — chunks.100.mjs:242
- `parseShutdownRequest` (`i56`) — chunks.100.mjs:293

**In-process runner (chunks.155.mjs):**
- `inProcessAgentRunner` (`bXY`) — chunks.155.mjs:3 — was `XNY` in v2.1.76
- `startInProcessAgentExecution` (`Jg8`) — chunks.155.mjs:309 — fire-and-forget wrapper
- `pollIntervalMs` (`yXY`) — chunks.155.mjs:316 — `500`
- `mutateInProcessTeammateTask` (`sF`) — chunks.154.mjs:2394 — typed `setAppState` helper
- `wrapMessageForTeammate` (`k97`) — chunks.154.mjs:2386 — `<teammate ...>...</teammate>` XML
- `buildCanUseToolForTeammate` (`LXY`) — chunks.154.mjs:2203
- `pollForNextMessage` (`CXY`) — chunks.154.mjs:2462 — was `DNY` in v2.1.76
- `findClaimableTask` (`RXY`) — chunks.154.mjs:2424
- `formatTaskPrompt` (`SXY`) — chunks.154.mjs:2433
- `claimUnclaimedTask` (`HNK`) — chunks.154.mjs:2443 — was `Ji4` in v2.1.76
- `dispatchToLeader` (`hXY`) — chunks.154.mjs:2410
- `sendIdleNotification` (`jNK`) — chunks.154.mjs:2419

**Permission sync (chunks.100.mjs):**
- `getTeamLeaderName` (`bb4`) — chunks.100.mjs:1369
- `sendPermissionRequest` (`aI8`) — chunks.100.mjs:1377
- `sendPermissionResponse` (`sI8`) — chunks.100.mjs:1401

**In-process spawn (chunks.100.mjs):**
- `spawnInProcessHelper` (`cI8`) — chunks.100.mjs:1079
- `updateTaskWithResult` (`W18`) — chunks.100.mjs:1152

**Backend registry (chunks.155.mjs):**
- `TmuxBackend` (class `N97`) — chunks.155.mjs:639
- `ITermBackend` (class `y97`) — chunks.155.mjs:870
- `InProcessBackend` (class `JNK`) — chunks.155.mjs:350
- `getInProcessBackend` (`LNK`) — chunks.155.mjs:1123
- `pickBackendExecutor` (`gXY`) — chunks.155.mjs:1128
- `cachePaneBackendExecutor` (`UXY`) — chunks.155.mjs:1133
- `resolveBackendType` (`d37`) — chunks.155.mjs:1119
- `inProcessFallbackToggle` (`h77`) — chunks.137.mjs (referenced)

**Tools:**
- `SendMessageTool` (`LJY`) — chunks.153.mjs:367
- `AgentTool` (`RHK`) — chunks.141.mjs:456
- `TeamCreateTool` (`wJY`) — chunks.152.mjs:2439

**Identity / context:**
- `getCurrentTeammateContext` (`uB`) — chunks.63.mjs:2628
- `runWithTeammateContext` (`eQ`) — chunks.63.mjs:2632
- `isSubagent` (`nN_`) — chunks.63.mjs:2636
- `getSubagentName` (`r74`) — chunks.63.mjs:2640

**Constants (chunks.99.mjs):**
- `LEAD_NAME` (`Mz`) — `"team-lead"`
- `SWARM_SESSION` (`Ny`) — `"claude-swarm"`
- `SWARM_VIEW_WINDOW` (`Fh6`) — `"swarm-view"`
- `TMUX` (`mD`) — `"tmux"`
- `HIDDEN_PANE` (`Gi1`) — `"claude-hidden"`
- `TEAMMATE_COMMAND_ENV` (`Uh6`) — `"CLAUDE_CODE_TEAMMATE_COMMAND"`

## Integration Points

### Agent Loop Integration

The teammate's nested loop sits inside the standard agent loop (`_u`). `bXY` provides:
- A custom `agentDefinition` whose tools include `tW`/`lp`/`Cc`/`YT`/`Sc`/`xD`/`gk` (SendMessage, TeamCreate, etc.).
- A wrapper `canUseTool = LXY(identity, ...)` that intercepts permission prompts and routes them through `aI8` when the user can't be prompted directly.
- An `eQ(Z, ...)` AsyncLocalStorage scope so `uB()` resolves to the teammate's identity record everywhere downstream.
- Embedded auto-compaction: each turn checks `vJ(messages) > v38(model, autoCompactWindow)` and calls `vI6` if exceeded. PreCompact-blocked errors (matching `GI6`) are caught and the loop continues uncompacted.

### Compaction Integration

Each teammate runs its own copy of the autocompact pipeline (see [07_compact](../07_compact/)). The trigger is based on the teammate's local `autoCompactWindow`, not the leader's. If `vI6` returns successfully, the teammate replaces its `messages` array with the compacted prefix and continues with the new user prompt appended.

### Hooks Integration

Two hook events are specific to teammates:
- **TeammateIdle** (handler `W38`, chunks.192.mjs:2814) — fires when the runner reports idle. Hook input includes `teammate_name`, `team_name`. A return with `preventContinuation: true` stops further polling on the next cycle.
- **TaskCompleted** (handler `CM6`, chunks.192.mjs:2848) — fires when a task transitions to completed. Includes `task_id`, `task_subject`, `task_description`, `teammate_name`, `team_name`.

### Tool Integration

- **SendMessage** routes plain strings through `vJY` (single recipient) or `TJY` (broadcast), structured messages through dedicated handlers (`VJY` shutdown_request, `kJY`/`NJY` shutdown_response, `EJY`/`yJY` plan_approval).
- **Agent (teammate mode)** is detected when `name + team_name` are passed; the tool calls `P2K` (which is `n7Y`).
- **TeamCreate** writes `~/.claude/teams/{team}/config.json` and seeds `tasks.json`; emits `tengu_team_created`.

### Persistence Integration

- **Inbox file** — JSON array of `{from, text, timestamp, color?, summary?, read}` records, lock-protected by `proper-lockfile` against a sibling `.lock` file.
- **Tasks file** — JSON array of `{id, subject, description, status, owner, blockedBy[], …}` shared across teammates of one team. Modified through `Qf`/`ns`/`HR4` (read/update/claim). Lock semantics are the same.
- **Team config** — `~/.claude/teams/{team}/config.json`. Members registry, `teammateMode`, `teammateDefaultModel`. Read with `oF`/`uM`/`$J6`, write with `lM6`.

## Design Insights

### File-Based IPC, Not Socket-Based

The original design uses POSIX advisory locks via `proper-lockfile` instead of Unix domain sockets, named pipes, or shared memory. The advantages:
- No daemon to spawn or supervise; every backend (in-process, tmux pane, tmux window, iTerm2) is a peer.
- Crash-resilient: leftover messages survive a crashed leader; rejoining recovers exactly.
- Cross-process and cross-session by construction; one team can be inspected with `cat`/`jq` for debugging.

The trade-off is a 500ms minimum dispatch latency in the worst case (one full poll-tick), and the need for the lock-then-RMW pattern in every writer.

### 5-Level Priority Queue, Not FIFO

A naive FIFO would block shutdown requests behind any unread peer messages — fatal for a leader trying to recover from a stuck teammate. The 5-level priority queue solves this:
1. Local in-memory `pendingUserMessages` for the user typing into the leader's TUI (lowest latency, no lock).
2. **Shutdown** is scanned across the *entire* unread set, bypassing arrival order.
3. **Lead** is preferred over peers, so the team has a clear coordinator.
4. Peers / broadcasts are FIFO within their bucket.
5. **Auto task-claim** runs only when the inbox is empty — a "background" workload mode.

### In-Process by Default, Pane When Asked

In v2.1.76 the default was tmux/iTerm2 split panes. v2.1.112's `bF()` flips the default to in-process (line 1105 returns `true` for non-interactive sessions, line 1114 returns `true` when neither tmux nor iTerm2 is detected). Pane mode is now opt-in via `--teammate-mode tmux` or via team config `teammateMode: "tmux"`. The result: most teammates spawn instantly, in the same process, without a tmux dependency.

### AsyncLocalStorage for Identity, Not Globals

`eQ(Z, fn)` (which is `i74.run(...)` from `node:async_hooks`) wraps every teammate turn so any nested code can call `uB()` and receive the right `agentId`/`teamName`/`isTeamLead`. This avoids the alternative of plumbing identity through every call site. The teammate context survives across `await` boundaries, including LLM streaming.

### Embedded Compaction, Not Bridged

Each teammate manages its own context window and runs its own `vI6` calls. The leader cannot "compact a teammate's history"; teammates self-compact on threshold crossings. Trade-off: a heavy teammate might thrash on its own; benefit: the leader doesn't share its context with teammates and is not slowed down by their summaries.

### What's Gone or Unreachable

- **`l7Y` (separate tmux window spawn)** — Defined but unreachable from the public tool surface. The only call site of its dispatcher (`n7Y` via `P2K` from the `Agent` tool at chunks.141.mjs:514) hardcodes `use_splitpane: true`, and `n7Y`'s `if (use_splitpane !== false) return c7Y` always wins. The `l7Y` branch is dead code in v2.1.112.
- **`_2K` (CLI-arg builder with --teammate-mode)** — Defined at chunks.137.mjs:2350 but has no callers. It is a near-duplicate of `X2K` (chunks.137.mjs:2454) that adds `--teammate-mode` to the args. Likely vestigial from an older spawn flow.
- **`microcompactMessages` per-turn for teammates** — Was supposed to be triggered every turn for teammates in v2.1.88 (cached-MC path). Like the broader cached-MC pipeline, it never shipped — see [07_compact/dead_code_audit.md](../07_compact/dead_code_audit.md).
- **Pane-default flip claim** — Earlier drafts framed v2.1.112 as "in-process by default". The accurate framing: in-process is the **fallback** for non-interactive sessions and plain shells. Inside tmux or iTerm2 (the common interactive case) pane mode remains the default.
