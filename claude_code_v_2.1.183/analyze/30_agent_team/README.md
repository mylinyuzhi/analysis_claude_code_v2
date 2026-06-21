# 30 — Agent Team (v2.1.183): the v2.1.178 implicit-team REDESIGN

> Delta module: `30_agent_team/` documents the **v2.1.156 → v2.1.183** change to the agent-team ("swarm") subsystem.
> Target bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines).
> Every citation below is `cli_inner_pretty.js:<line>` in the **v2.1.183** bundle unless explicitly tagged as a v2.1.156 or v2.1.88 before-picture.
> Subsystem internal name is still **"swarm"** (telemetry events `swarm_*`, gate `tengu_amber_flint`); the directory name `30_agent_team` is kept for continuity with the v2.1.156 baseline tree.

---

## The headline: agent teams stopped being something the model *creates*

The v2.1.178 changelog line — "agent teams redesign" — lands as a structural rewrite of *who owns a team and when it exists*. In v2.1.156 a team was a model-driven object: the model called the **`TeamCreate`** tool to materialise a team file + leader membership, spawned named teammates against that team's `team_name`, and called **`TeamDelete`** to tear it down. In v2.1.183 those two tools are **gone** (`grep -c "TeamCreate"` = 0, `grep -c "TeamDelete"` = 0 across the whole bundle; the asset dir ships no `TeamCreate.md`/`TeamDelete.md`), and the team is instead an **implicit, session-scoped object created once at CLI startup** before the model gets a turn.

The result is a much smaller model-facing surface. There is exactly **one team per session**, named deterministically `session-<sessionId[:8]>`, with a single member (the leader, `team-lead`) at boot. The model never names a team, never creates one, never deletes one. Spawning a teammate is now folded entirely onto the **Agent tool**: passing a non-empty `name` to `Agent` (when swarms are enabled) routes into the teammate-spawn path; everything else stays an ordinary subagent. The old `team_name` parameter survives in the schema but is documented `"Deprecated; ignored. The session has a single implicit team."` (`cli_inner_pretty.js:423458`).

This README is an **index only**. The deep, dual-version, step-by-step analysis of each delta lives in the per-topic files listed under "Files in this module" below. What this README does is (1) frame the redesign, (2) give the before/after contrast table, and (3) state precisely which v2.1.156 mechanics carry over **unchanged** so they are linked rather than re-derived.

---

## Before → after contrast (the whole redesign on one screen)

| Dimension | v2.1.156 (baseline) | v2.1.183 (this tree) | Evidence |
|---|---|---|---|
| **Team creation** | Model calls `TeamCreate` tool; that writes the team file + leader membership and emits `tengu_team_created` | **Implicit** team written once at CLI startup by `initializeSessionTeam` (`j3f`); no model action; `tengu_team_created` gone | `j3f` @682765; bootstrap gate @693472; `grep tengu_team_created`=0 |
| **Team deletion** | Model calls `TeamDelete` (refuses while teammates active); emits `tengu_team_deleted` | **No delete tool.** Team lives and dies with the session | `grep TeamDelete`=0; `grep tengu_team_deleted`=0 |
| **Team name** | Model-supplied via `TeamCreate`'s `team_name` argument | Deterministic `session-<sessionId[:8]>` from `sessionTeamName` (`xic`) | `xic` @682752 (`` `${B3f}-${e.slice(0,8)}` ``, `B3f="session"`) |
| **Teammate spawn surface** | `team_name` parameter on Agent (resolved via `oN_`), routing `if (G && z)` | Agent tool `name` parameter only; routing `if (_ && s && !L)` where `_ = Sl() ? A.teamContext` | call routing @423573; before-picture @398406 (v2.1.156) |
| **`team_name` Agent param** | Load-bearing — selected the team to spawn into | **Deprecated; ignored.** Still in schema for back-compat | schema @423458 |
| **tmux teammate spawn** | `sendCommandToPane` *types* `cd … && env … claude --agent-id …` via `send-keys` + `Enter` | Pane created running holding process `cat` (`Gke`); `respawn-pane -k -- <cmd>` replaces it (`a3n`) | `a3n` @421874; `Gke="cat"` @362642; before-picture @380566 (v2.1.156) |
| **`SendMessage` recipients** | bare teammate name; `to:"*"` already rejected; `@` rejected | adds `"main"` (route to main conversation, background subagents only) **and** cross-session `uds:`/`bridge:` socket addresses | prompt `rza` @434286; validateInput @434611 |
| **Reserved name** | none | `"main"` (`LY`) reserved — Agent `name` schema refines it out | `LY="main"` @362512; refine @423456 |
| **Background tasks of a teammate** | keepalive infra existed but teammate finishing a turn could tear down its bg children | a teammate "comes to rest" (eviction-eligible) only with **no live background children**; new `<note>` explains it | `YR`/`Lye` @445753/445750; `<note>` @445887 |
| **Coordinator mode** | re-introduced (round-6 finding), single-machine | expanded: cross-session peers (`uds:`/`bridge:`), worker-stop tool (`uP`=`TaskStop`), `<cross-session-message>` envelope | `bvd` @221940; peers block @221969 |
| **File mailbox** | `<teamsDir>/<team>/inboxes/<agent>.json`, lock→re-read→push→atomicWrite | **unchanged** (byte-for-byte algorithm); teams root is `Gbe()`=`tr()+"teams"` | `$A` @365950; `Gbe` @735 |
| **System-prompt addendum** | "you MUST use the SendMessage tool" | **unchanged** (verbatim) | `Rdo` @420705 |
| **Master gate** | `R7`: opt-in env/flag AND `tengu_amber_flint` | **unchanged** semantics; re-mangled to `Sl` | `Sl` @293831 |

---

## What CARRIES OVER UNCHANGED (link the v2.1.156 baseline — do NOT re-derive)

The redesign is surgical. A large fraction of the v2.1.156 subsystem is byte-for-byte the same algorithm with only re-mangled obfuscated names. To avoid re-deriving proven material, this tree **links** the v2.1.156 baseline for the following and only documents the *deltas* in the per-topic files.

### Master gate — UNCHANGED (only re-mangled `R7` → `Sl`)

`isAgentSwarmsEnabled` (obfuscated: `Sl`, `cli_inner_pretty.js:293831`) is semantically identical to v2.1.156's `R7`: it returns false unless an opt-in is present (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` env via `st()`, **or** `--agent-teams` CLI flag via `hasAgentTeamsCliFlag` `yqd` @293828) **and** the GrowthBook gate `tengu_amber_flint` is on (`ct("tengu_amber_flint", !0)`). Read at @293828-293836; identical structure to baseline. See baseline `execution_modes_and_backend_registry.md` §1.

### File mailbox protocol — UNCHANGED (structure + algorithm)

`writeToMailbox` (obfuscated: `$A`, `cli_inner_pretty.js:365950`) is the same pre-create-`[]` (`wx`) → lock (`iUt`) → re-read (`Fhe`) → push `{...,type:"message",read:!1}` → `atomicWrite` algorithm as v2.1.156's `aA`. `readMailbox` (`Fhe`) keeps the ENOENT→`[]` + SyntaxError-tolerant + `type:"message"` back-fill behaviour; `getInboxPath` (`v4e` @365916) and `ensureInboxDir` (`Kyp` @365924) keep the `<teamsDir>/<team>/inboxes/<agent>.json` shape. The **only** structural note: the teams root is `getTeamsDir` (`Gbe` @735) = `ker.join(tr(), "teams")` — there is no `.claude/teams` *literal* in the bundle anymore; it is assembled from the config dir `tr()` + `"teams"`. See baseline `mailbox_and_lifecycle_tools.md` §1 for the full mailbox deep-dive.

### Teammate system-prompt addendum — UNCHANGED (verbatim)

`TEAMMATE_SYSTEM_PROMPT_ADDENDUM` (obfuscated: `Rdo`, `cli_inner_pretty.js:420705`) is verbatim identical to v2.1.156's `jU6`: the "# Agent Teammate Communication … Just writing a response in text is not visible to others on your team - you MUST use the SendMessage tool." block. See baseline `mailbox_and_lifecycle_tools.md` §5.

### BackendRegistry two-mode split — UNCHANGED abstraction (only the tmux spawn mechanic changed)

The in-process-vs-pane executor split is fully carried over: registry singleton `_F` (@422467), `isInProcessEnabled` (`rWe` @422425), `getTeammateMode` snapshot (`Aje` @293813), backend detection (`eLe` @422314), the sticky pane-failure fallback bit (`Wdo` @422419), the tmux/iTerm2 backends, the in-process AsyncLocalStorage runner (`sDp` @421006), and the 500 ms in-process poll (`ZLp` @421380). The *abstraction* is unchanged; the only delta inside this area is the tmux spawn mechanic (`send-keys` → `respawn-pane`), documented in this tree's `spawn_backends_and_tmux_fix.md`. See baseline `execution_modes_and_backend_registry.md`, `in_process_mode.md`, `cross_process_mode.md`.

### Permission bridge — UNCHANGED design

`createTeammateCanUseTool` (obfuscated: `eDp`, `cli_inner_pretty.js:420713`) keeps the same "if the underlying `canUseTool` returns `behavior !== "ask"` short-circuit; otherwise raise an interactive dialog on the leader's terminal, OR (no dialog) serialize a `permission_request` to the mailbox and self-poll for `permission_response`" design. Read at @420713-420726. See baseline `mailbox_and_lifecycle_tools.md` §6.

### Control-message protocol — UNCHANGED type set

The `isControlMessage` type set (permission_request/response, sandbox_*, shutdown_request/approved/rejected, team_permission_update, mode_set_request, plan_approval_*) and its builders/parsers are present and structurally the same (exported around @365900). See baseline `mailbox_and_lifecycle_tools.md` §3. **Caveat (medium):** the *model-facing* SendMessage `message` union was trimmed to `{shutdown_request | shutdown_response | plan_approval_response}` (schema `r$p` @434539), but `team_permission_update`/`mode_set_request` are still in the *internal* control-message set — so this is a model-surface tightening, not a protocol removal. Carried as an open question in `mailbox_lifecycle_and_sendmessage_delta.md`.

---

## What is NEW / CHANGED (documented in this tree's per-topic files)

### 1. Implicit, session-scoped team at startup (`initializeSessionTeam`)

The team is no longer created by a tool. At CLI bootstrap the gate `if (Sl() && !xr() && !a.agentId)` (`cli_inner_pretty.js:693472`) lazily imports and calls `initializeSessionTeam` (obfuscated: `j3f`, @682765), which writes the team file (members = leader only) and returns the in-memory `teamContext`:

```javascript
// ============================================
// initializeSessionTeam - Materialise the implicit session team at CLI startup
// Location: cli_inner_pretty.js:682765-682820
// ============================================

// ORIGINAL (for source lookup):
async function j3f(e) {
  let t = e?.existingTeamName || F3f(),
    n = t ?? xic(xt()),
    r = bQ(np, n),
    o = gte(n);
  if (!(t ? await Nhe(n) : null)) {
    let l = { name: n, createdAt: Date.now(), leadAgentId: r, leadSessionId: xt(),
      members: [{ agentId: r, name: np, agentType: np, joinedAt: Date.now(),
        tmuxPaneId: "leader", cwd: Ar(), subscriptions: [], backendType: "in-process" }] };
    await pBn(n, l).catch((c) => dBn(n, c));
  }
  Dla(n);
  let i = xt();
  if (n !== i) await Iic.rename(WG(i), WG(n)).catch(() => {});
  (await NXr(n), oso(n));
  let a = iy[0];
  return { teamContext: { teamName: n, teamFilePath: o, leadAgentId: r,
      teammates: { [r]: { name: np, agentType: np, color: a, tmuxSessionName: "in-process",
        tmuxPaneId: "leader", cwd: Ar(), spawnedAt: Date.now() } } },
    teammateColors: { assignments: new Map([[r, a]]), index: 1 } };
}

// READABLE (for understanding):
async function initializeSessionTeam(opts) {
  // 1. Resolve the team name: an explicit name (spawned teammate inheriting a parent),
  //    or a one-shot inherited env name, else derive session-<sessionId[:8]>.
  let inheritedOrExplicit = opts?.existingTeamName || resolveInheritedTeamName(); // F3f
  let teamName = inheritedOrExplicit ?? sessionTeamName(getSessionId());          // xic(xt())
  let leadAgentId = formatAgentId(TEAM_LEAD_NAME, teamName);                      // "team-lead@<team>"
  let teamFilePath = getTeamFilePath(teamName);                                   // gte

  // 2. If the team file doesn't already exist, write it with the leader as the sole member.
  if (!(inheritedOrExplicit ? await readTeamFile(teamName) : null)) {            // Nhe
    let teamFile = { name: teamName, createdAt: Date.now(), leadAgentId, leadSessionId: getSessionId(),
      members: [{ agentId: leadAgentId, name: TEAM_LEAD_NAME, agentType: TEAM_LEAD_NAME,
        joinedAt: Date.now(), tmuxPaneId: "leader", cwd: getCwd(), subscriptions: [],
        backendType: "in-process" }] };
    await writeTeamFile(teamName, teamFile).catch((err) => logTeamWriteFailure(teamName, err));
  }
  // 3. Side-effects: register the team as active, rename any session-keyed tasks dir to the team name,
  //    ensure the team's tasks dir exists, record the team for orphan-cleanup tracking.
  registerTeamForSession(teamName);                                               // Dla (sets active-team var, emits change)
  let sessionId = getSessionId();
  if (teamName !== sessionId) await fsp.rename(teamTasksDir(sessionId), teamTasksDir(teamName)).catch(() => {}); // WG = <configDir>/tasks/<team>
  await ensureTeamTasksDir(teamName);                                             // NXr (mkdir of teamTasksDir)
  recordTeamCreated(teamName);                                                    // oso (adds to cleanup set)

  // 4. Build the in-memory teamContext: leader is the only teammate, colour index = 1.
  let leaderColor = COLOR_PALETTE[0];
  return { teamContext: { teamName, teamFilePath, leadAgentId,
      teammates: { [leadAgentId]: { name: TEAM_LEAD_NAME, agentType: TEAM_LEAD_NAME, color: leaderColor,
        tmuxSessionName: "in-process", tmuxPaneId: "leader", cwd: getCwd(), spawnedAt: Date.now() } } },
    teammateColors: { assignments: new Map([[leadAgentId, leaderColor]]), index: 1 } };
}

// Mapping: j3f→initializeSessionTeam, F3f→resolveInheritedTeamName, xic→sessionTeamName,
//   xt→getSessionId, bQ→formatAgentId, np→TEAM_LEAD_NAME, gte→getTeamFilePath, Nhe→readTeamFile,
//   pBn→writeTeamFile, dBn→logTeamWriteFailure, Dla→registerTeamForSession, WG→teamTasksDir,
//   NXr→ensureTeamTasksDir (mkdir of <configDir>/tasks/<team>), oso→recordTeamCreated,
//   iy→COLOR_PALETTE, Ar→getCwd, Iic→fs/promises
```

**What it does:** writes the session's single team file (leader-only roster) and returns the leader's `teamContext` for the app state. **How it works:** name resolution (explicit/inherited → `session-<id[:8]>`) → write-if-absent → register/rename/snapshot → build a one-member `teamContext`. **Why this approach:** moving creation to startup means the model never has to "set up" a team before delegating, the team name is deterministic (so the mailbox path is predictable and reproducible across resumes), and every spawn path can assume the team already exists — they all throw `"Internal error: session team not initialized. This should have happened at startup when agent swarms are enabled."` if `teamContext.teamName` is missing (`SDp` @422659, `EDp` @422777, `sqa` @422939). **Key insight:** the team is now an *invariant* of an enabled session rather than a *thing the model assembles*; this is what let `TeamCreate`/`TeamDelete` be deleted outright.

`sessionTeamName` (obfuscated: `xic`, @682752) and the one-shot inherited-name resolver `resolveInheritedTeamName` (obfuscated: `F3f`, @682756, which reads `CLAUDE_INTERNAL_ASSISTANT_TEAM_NAME` exactly once then `delete`s the env var) are covered in depth in `implicit_team_and_agent_tool_spawn.md`.

### 2. Agent tool is the teammate spawner (routing rewrite)

The Agent tool's `call` now routes to the teammate path when the session has an implicit `teamContext` **and** the model passed a `name` **and** this isn't a fork: `_ = Sl() ? A.teamContext : void 0; … if (_ && s && !L)` (`cli_inner_pretty.js:423548-423573`), which calls the spawn entry `cqa` → `HDp` (the in-process/pane dispatcher). This replaces v2.1.156's `team_name`-parameter routing `let G = oN_({team_name: A}, L); if (G && z)` (before-picture @398406). The schema (`IDp` @423446, surfaced to the model via `zao` @423478 = `IDp().omit({cwd})`) adds `name` (regex `pDa`, refined ≠ `"main"`), the deprecated/ignored `team_name`, and `mode` (`zts`), plus nested-teammate / background guards. Full deep-dive in `implicit_team_and_agent_tool_spawn.md`.

### 3. tmux spawn fix: `send-keys` → `respawn-pane -k -- <cmd>` (no keystroke typing)

v2.1.156 launched a cross-process teammate by *typing* the command into the pane's interactive shell (`send-keys -t <pane> <cmd> Enter`, before-picture @380567), which raced shell-rc initialisation and could capture stray keystrokes. v2.1.183 creates the pane running a benign holding process `cat` (`Gke` @362642) and replaces it directly: `respawn-pane -k -t <pane> -- <cmd>` (`a3n` @421874). This structurally fixes both bugs (the slow-rc-init race and the keystroke leak). Deep-dive + dual-version `sendCommandToPane`/`a3n` snippet in `spawn_backends_and_tmux_fix.md`.

### 4. SendMessage: `"main"` recipient + cross-session `uds:`/`bridge:` addressing

`SendMessage`'s prompt (`rza` @434286) is rewritten as terse markdown with a `to`-table that adds `"main"` ("the main conversation (background subagents only)"), and `validateInput` (@434611) keeps the broadcast (`to:"*"`) and `@` rejections while **adding** socket-address validation for `uds:`/`bridge:` cross-session targets. The lifecycle-tool removal (`TeamCreate`/`TeamDelete`) and this delta are in `mailbox_lifecycle_and_sendmessage_delta.md`.

### 5. Coordinator mode expansion + background-task survival fix

Coordinator mode (`isCoordinatorMode` `oI` @221871 / exported wrapper `z9` @221892, `getCoordinatorSystemPrompt` `bvd` @221940) gained cross-session peer machinery (`uds:`/`bridge:` addresses, `<cross-session-message from="...">` envelope) and a worker-stop tool (`uP` = `TaskStop`). The background-task survival fix surfaces in the task-notification builder `G4e` (@445827) and the keepalive predicates `YR`/`Lye` (@445753/445750): a teammate task only "comes to rest" (and is eviction-eligible) with no live background children. Both in `coordinator_and_background_survival.md`. **Caveat (carried from the dossier):** the *exact one-line* code diff of the bg-survival behaviour fix could not be isolated with certainty — the keepalive infra pre-exists; the strongest fingerprints are the new `<note>` text and the owner-alive gate in `G4e`.

---

## Files in this module

```
30_agent_team/   (v2.1.183 — DELTA tree)
├── README.md                                    ← you are here (index + REDESIGN framing + contrast table + carryover links)
│
├── implicit_team_and_agent_tool_spawn.md        ← THE CENTERPIECE. initializeSessionTeam (j3f) at startup
│                                                   (session-<id[:8]> naming via xic, F3f inherited-name, leader-only
│                                                   roster, the @693472 bootstrap gate), and the Agent-tool routing
│                                                   rewrite (_ = Sl() ? A.teamContext + if (_ && s && !L) → cqa/HDp),
│                                                   the deprecated-but-accepted team_name param, the name/mode schema,
│                                                   the "main" reserved name (LY), and the nested-teammate / background
│                                                   guards. Includes the v2.1.156 before-picture (team_name routing + TeamCreate).
│
├── spawn_backends_and_tmux_fix.md               ← the carried-over BackendRegistry two-mode split (brief, linking the
│                                                   v2.1.156 baseline) PLUS the v2.1.183 tmux fix in depth: send-keys →
│                                                   respawn-pane -k -- <cmd> with the cat holding process (Gke), why this
│                                                   fixes slow-rc-init + keystroke-leak. Dual-version sendCommandToPane/a3n
│                                                   vs the v2.1.156 send-keys path.
│
├── mailbox_lifecycle_and_sendmessage_delta.md   ← short delta doc: mailbox UNCHANGED (link baseline), the removal of the
│                                                   TeamCreate/TeamDelete lifecycle tools, and the SendMessage delta
│                                                   (prompt rewrite, "main" recipient, uds:/bridge: cross-session addressing,
│                                                   model-facing message-union trim with the open-question caveat).
│
└── coordinator_and_background_survival.md        ← coordinator-mode expansion (cross-session peers, worker-stop tool uP,
                                                    the bvd prompt) and the background-task survival fix (keepalive YR/Lye,
                                                    the new <note>), with the open-question caveat on the exact fix line.
```

> **Note:** the per-topic files listed above are authored alongside this README in the same writing round. If a file is not yet present in this directory, its content is fully specified by the anchors in this README and the scout dossier (`../_scout_dossier_agent_team.md`).

## Suggested reading order

1. **`implicit_team_and_agent_tool_spawn.md`** — read first. The whole redesign hinges on "the team exists at startup, the Agent tool spawns into it." Everything else (mailbox path, spawn guards, SendMessage `"main"` routing) assumes you understand the implicit `teamContext`.
2. **`spawn_backends_and_tmux_fix.md`** — second. Once you know a spawn is requested, this is *how* the teammate process/async-task is actually created, including the v2.1.183 tmux keystroke fix.
3. **`mailbox_lifecycle_and_sendmessage_delta.md`** — third. The IPC the spawned teammate uses to talk back, plus what the model can/can't say with `SendMessage` now, and what tools disappeared.
4. **`coordinator_and_background_survival.md`** — last. Coordinator mode is an orthogonal orchestration layer on top, and the background-survival fix is a subtle lifecycle correction best read after you understand spawning and the task system.

For unchanged mechanics (mailbox internals, both execution-mode runtimes, the permission bridge, the master gate), read the **v2.1.156 baseline** linked in "What carries over unchanged" above — this tree deliberately does not re-derive them.

## Cross-tree links (v2.1.156 baseline — unchanged carryover)

- Master gate, BackendRegistry split, executor interface: [`../../../claude_code_v_2.1.156/analyze/30_agent_team/execution_modes_and_backend_registry.md`](../../../claude_code_v_2.1.156/analyze/30_agent_team/execution_modes_and_backend_registry.md)
- In-process runtime (`AsyncLocalStorage` isolation, poll loop): [`../../../claude_code_v_2.1.156/analyze/30_agent_team/in_process_mode.md`](../../../claude_code_v_2.1.156/analyze/30_agent_team/in_process_mode.md)
- Cross-process runtime (pane backends, CLI/env builders): [`../../../claude_code_v_2.1.156/analyze/30_agent_team/cross_process_mode.md`](../../../claude_code_v_2.1.156/analyze/30_agent_team/cross_process_mode.md)
- File mailbox, control-message protocol, permission bridge, system-prompt addendum: [`../../../claude_code_v_2.1.156/analyze/30_agent_team/mailbox_and_lifecycle_tools.md`](../../../claude_code_v_2.1.156/analyze/30_agent_team/mailbox_and_lifecycle_tools.md)
- v2.1.88 named-TypeScript ground truth + coordinator-mode live/dead check: [`../../../claude_code_v_2.1.156/analyze/30_agent_team/cross_validation.md`](../../../claude_code_v_2.1.156/analyze/30_agent_team/cross_validation.md)

---

## Related Symbols

> Symbol mappings live ONLY in the central index files and the per-feature additions file (this doc uses **list format**, never a mapping table):
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (Agent Loop, Tools, State)
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (**Agent Team / Swarm** lives here)
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (Permissions)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations
> - [../00_overview/symbol_additions_v2_1_183_agent_team.md](../00_overview/symbol_additions_v2_1_183_agent_team.md) — the granular v2.1.183 additions for this module

Key functions/constants referenced by this index (detail lives in the per-topic docs):

- `isAgentSwarmsEnabled` (obfuscated: `Sl`, `cli_inner_pretty.js:293831`) — master gate; opt-in env/flag **AND** GrowthBook `tengu_amber_flint`. Unchanged semantics vs v2.1.156 `R7`.
- `hasAgentTeamsCliFlag` (obfuscated: `yqd`, `cli_inner_pretty.js:293828`) — `process.argv.includes("--agent-teams")`.
- `initializeSessionTeam` (obfuscated: `j3f`, `cli_inner_pretty.js:682765`) — writes the implicit session team at startup and returns the leader's `teamContext`.
- `sessionTeamName` (obfuscated: `xic`, `cli_inner_pretty.js:682752`) — `` `session-${sessionId.slice(0,8)}` ``.
- `resolveInheritedTeamName` (obfuscated: `F3f`, `cli_inner_pretty.js:682756`) — one-shot read+delete of `CLAUDE_INTERNAL_ASSISTANT_TEAM_NAME`.
- `formatAgentId` (obfuscated: `bQ`, `cli_inner_pretty.js:103172`) — `` `${name}@${team}` ``.
- `TEAM_LEAD_NAME` (obfuscated: `np`, `cli_inner_pretty.js:362636`) — `"team-lead"`.
- `RESERVED_MAIN_NAME` (obfuscated: `LY`, `cli_inner_pretty.js:362512`) — `"main"`, reserved teammate name routed to the main conversation.
- Agent tool name const (obfuscated: `vs`, `cli_inner_pretty.js:149939`) — `"Agent"`; tool def `f3n` @423505.
- Agent merged input schema (obfuscated: `IDp`, `cli_inner_pretty.js:423446`) / base schema (obfuscated: `CDp`, `cli_inner_pretty.js:423432`) / model-facing wrapper (obfuscated: `zao`, `cli_inner_pretty.js:423478`).
- teammate-spawn entry (obfuscated: `cqa`→`HDp`, `cli_inner_pretty.js:423053`/`423041`) — dispatches in-process (`sqa`) / splitpane (`SDp`) / new-window (`EDp`).
- `isInProcessEnabled` (obfuscated: `rWe`, `cli_inner_pretty.js:422425`) / `getTeammateMode` snapshot (obfuscated: `Aje`, `cli_inner_pretty.js:293813`) / backend detection (obfuscated: `eLe`, `cli_inner_pretty.js:422314`) / BackendRegistry singleton (obfuscated: `_F`, `cli_inner_pretty.js:422467`). Unchanged abstraction vs baseline.
- tmux send-command primitive (obfuscated: `a3n`, `cli_inner_pretty.js:421874`) — `respawn-pane -k -t <pane> -- <cmd>`.
- tmux holding-process const (obfuscated: `Gke`, `cli_inner_pretty.js:362642`) — `"cat"`; tmux binary const (obfuscated: `B8`, `cli_inner_pretty.js:362640`) — `"tmux"`.
- `writeToMailbox` (obfuscated: `$A`, `cli_inner_pretty.js:365950`) — universal file-mailbox send; unchanged algorithm vs v2.1.156 `aA`.
- `getTeamsDir` (obfuscated: `Gbe`, `cli_inner_pretty.js:735`) — `ker.join(tr(), "teams")`.
- `TEAMMATE_SYSTEM_PROMPT_ADDENDUM` (obfuscated: `Rdo`, `cli_inner_pretty.js:420705`) — verbatim-unchanged "you MUST use the SendMessage tool".
- `createTeammateCanUseTool` (permission bridge) (obfuscated: `eDp`, `cli_inner_pretty.js:420713`) — unchanged ask→dialog-or-mailbox design.
- SendMessage name const (obfuscated: `zh`, `cli_inner_pretty.js:221450`) / tool def (obfuscated: `p$p`, `cli_inner_pretty.js:434568`) / prompt builder (obfuscated: `rza`, `cli_inner_pretty.js:434286`).
- `isCoordinatorMode` (raw gate, obfuscated: `oI`, `cli_inner_pretty.js:221871`) / exported wrapper (obfuscated: `z9`, `cli_inner_pretty.js:221892`, `return oI()`) / `getCoordinatorSystemPrompt` (obfuscated: `bvd`, `cli_inner_pretty.js:221940`).
- worker-stop tool name const (obfuscated: `uP`, `cli_inner_pretty.js:220834`) — `"TaskStop"`.
- task-notification builder with bg-survival note (obfuscated: `G4e`, `cli_inner_pretty.js:445827`) / keepalive getter (obfuscated: `Lye`, `cli_inner_pretty.js:445750`) / completed-but-kept-alive predicate (obfuscated: `YR`, `cli_inner_pretty.js:445753`).
