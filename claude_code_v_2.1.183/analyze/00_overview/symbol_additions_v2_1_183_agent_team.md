# Symbol Additions — Agent Team (v2.1.183, the v2.1.178 implicit-team REDESIGN)

> Consolidated obfuscated→readable symbol table for the **agent-team** subsystem
> (internally named **"swarm"**: telemetry events `swarm_*`, gate `tengu_amber_flint`,
> user-facing error text "agent swarms") **as it exists in v2.1.183**. This is the
> delta-tree manifest: it records the v2.1.183 obfuscated names and, in the Description
> column, the v2.1.156 obfuscated alias (e.g. "v2.1.156 `R7`") so every rename is
> traceable. The v2.1.156 names DO NOT apply in v2.1.183 — the bundle was re-mangled
> (confirmed example: `R7`@240766 → `Sl`@293832; see [`_asset_anchors.md`](../_asset_anchors.md)
> "Confirmed re-mangling examples"). **Every line was re-derived by reading the
> declaration in the v2.1.183 bundle.**
>
> **Headline of this version (v2.1.178 redesign landing in v2.1.183):** `TeamCreate` and
> `TeamDelete` are **removed** (grep=0); the team is now an **implicit, session-scoped
> object** created once at CLI startup by `initializeSessionTeam` (`j3f`), named
> deterministically `session-<sessionId[:8]>`; teammate spawning moved entirely onto the
> **Agent tool** (`name` parameter routes into the spawn path; `team_name` is
> "Deprecated; ignored"). Two bug-fixes: the tmux spawn uses `respawn-pane -k -- <cmd>`
> instead of `send-keys` (slow-rc-init + keystroke-leak fix), and teammate background
> tasks survive the teammate finishing a turn (keepalive `YR`/`Lye` wired into the
> task-notification builder `G4e`).
>
> Out of scope (contrast only): the daemon/background-agent fleet
> (`36_background_agents/`). Agent-team teammates are leader-owned and die with the
> leader REPL.

## Home index

These rows fold into:
- **`00_overview/symbol_index_core_features.md`, "## Module: Agent Team"** — the
  feature-level symbols (gate, implicit team, spawn routing, SendMessage delta,
  lifecycle-tool removal, coordinator mode, background-survival fix). This is the primary
  home.
- **`00_overview/symbol_index_core_execution.md`** — for the subagent/tool-execution
  symbols that the Agent tool and the task-notification path share (the Agent tool def
  `f3n`/`vs`, the schema builders `CDp`/`IDp`/`zao`, the task-notification builder `G4e`,
  the keepalive primitives `Lye`/`YR`/`tWe`/`Fut`, the `TaskStop` tool `edt`/`uP`, the
  prompt queue `o_`/`_f`). Those rows are duplicated here only as a reading aid for the
  agent-team docs; their canonical home is the execution index.

The full deep-analysis prose lives in `30_agent_team/` —
[`README.md`](../30_agent_team/README.md),
[`implicit_team_and_agent_tool_spawn.md`](../30_agent_team/implicit_team_and_agent_tool_spawn.md),
[`spawn_backends_and_tmux_fix.md`](../30_agent_team/spawn_backends_and_tmux_fix.md),
[`mailbox_lifecycle_and_sendmessage_delta.md`](../30_agent_team/mailbox_lifecycle_and_sendmessage_delta.md),
[`coordinator_and_background_survival.md`](../30_agent_team/coordinator_and_background_survival.md).
This file is the flat symbol manifest; the five module docs use list-format references
back to it.

## Cross-validated against

- **v2.1.183 bundle self-cross-check.** Every row's `File:Line` was read directly from
  `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`
  (699,346 lines) during this pass — not inferred from the module docs. A 50-line sample
  (the gate `Sl`/`yqd`, `j3f`/`xic`/`F3f`, `Gbe`/`tr`, the `np`/`B8`/`Gke`/`_lt`/`LY`
  constants, `a3n`/`Slt`, the SendMessage `p$p`/`o$p`/`r$p`/`rza`/`LLa`/`Lhe`/`iF`/`Gtt`,
  the coordinator `oI`/`z9`/`bvd`/`_vd`/`yvd`/`uP`/`edt`/`zk`/`VAe`/`DCe`, the
  background-survival `G4e`/`Lye`/`YR`/`tWe`/`Fut`/`ect`/`od`/`tC`/`zGe`/`_f`/`If`/`Ls`,
  and the spawn dispatch `cqa`/`HDp`/`sqa`/`SDp`/`EDp`/`rWe`/`Aje`/`eLe`/`Wdo`/`_F`/`Ndo`)
  was re-read line-for-line; all matched.
- **v2.1.156 bundle before-picture.**
  `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
  (649,979 lines) for the rename evidence and the removed symbols (`TeamCreate` `rd`/`Th_`,
  `TeamDelete` `Oo`/`vh_`, `tengu_team_created`/`_deleted`), plus the v2.1.156 routing
  (`oN_`/`aA4`), the `send-keys` spawn (`sendCommandToPane`@380566), and the old
  notification builder (`c5H`@435474). The v2.1.156 obfuscated alias for each carried-over
  symbol is given in the Description column.
- **v2.1.88 readable TypeScript ground truth** under
  `/lyz/codespace/3rd/claude-code/src/utils/swarm` (the in-process/pane executor split,
  the mailbox, the AsyncLocalStorage isolation) — the architecture below `HDp` is the
  same evolved shape as that named TS; only the tmux spawn mechanic and the team-creation
  ownership changed in v2.1.178/183.
- **v2.1.156 baseline analysis** under
  `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/30_agent_team/`
  and its symbol manifest `symbol_additions_v2_1_156_agent_team.md` (the carryover
  reference; this file documents only what changed and links the rest).

**Confidence note (carried from the dossier honestly):** the implicit-team bootstrap, the
spawn-routing rewrite, the tmux fix, the TeamCreate/TeamDelete removal, the `"main"`
recipient, the `Lhe` socket gate, and the `G4e` `<note>`/routing-`agentId` survival fix
are **high** confidence (read directly). The `F3f` env-var *setter* (who writes
`CLAUDE_INTERNAL_ASSISTANT_TEAM_NAME`) is **medium**. The `EDp` non-splitpane body was read
only at its guard head. The guard refactor (`teammateContext`/`l1e` vs v2.1.156
`FA`/`mG`) is the same invariant re-wired, not a new capability. The dossier's suspected
SendMessage "union trim" and coordinator "new cross-session peers" were **disproved** by
re-reading the v2.1.156 bundle (no trim; peers pre-existed) — see the module docs.

---

## 1. Gate & CLI Flag (master feature gate)

The master gate plus the `--agent-teams` flag check. Byte-identical semantics to v2.1.156,
only re-mangled.

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `Sl` | `isAgentSwarmsEnabled` / `isAgentTeamsEnabled` | cli_inner_pretty.js:293831 | function | **Master gate**: `(CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS env OR --agent-teams flag) AND GrowthBook tengu_amber_flint`. Declaration `function Sl() {` at 293831 (`_asset_anchors.md` cites the body line 293832). v2.1.156 `R7`@240766. Unchanged semantics. |
| `yqd` | `hasAgentTeamsCliFlag` | cli_inner_pretty.js:293828 | function | `process.argv.includes("--agent-teams")`. v2.1.156 `Ru5`@240763. |

---

## 2. Implicit Session Team (NEW — replaces TeamCreate)

The startup-created session team. This whole group is **new in v2.1.178/183**: in v2.1.156
the team was created by the `TeamCreate` tool, not at boot. `initializeSessionTeam` (`j3f`)
runs once at the CLI bootstrap gate (`Sl() && !xr() && !a.agentId`, @693472) and seeds
`teamContext` into app state.

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `j3f` | `initializeSessionTeam` | cli_inner_pretty.js:682765 | function | Writes the implicit session team file (leader-only roster) at startup; returns seed `teamContext` + `teammateColors`. NEW — replaces v2.1.156 `TeamCreate.call` (`Th_`@406631). |
| `xic` | `sessionTeamName` | cli_inner_pretty.js:682752 | function | `` `${B3f}-${sessionId.slice(0,8)}` `` ⇒ `session-<id[:8]>`. NEW (no v2.1.156 equivalent — name was model-supplied). |
| `B3f` | `TEAM_NAME_PREFIX` | cli_inner_pretty.js:682817 | constant | `"session"` — the deterministic team-name prefix. NEW. |
| `F3f` | `readInheritedTeamName` | cli_inner_pretty.js:682755 | function | One-shot read **and delete** of `CLAUDE_INTERNAL_ASSISTANT_TEAM_NAME` (parent→child handoff, cached at module scope). NEW. Setter is **medium** confidence (likely the pane CLI builder). |
| `U3f` | `resetInheritedTeamNameForTesting` | cli_inner_pretty.js:682764 | function | `setCachedInheritedName(undefined)` — test reset of the `F3f` cache. NEW. |
| `ZKt` | `getCachedInheritedTeamName` | cli_inner_pretty.js:3558 | function | Module-level cache getter read by `F3f` (`=== undefined` ⇒ not yet read; used @682756). |
| `e7t` | `setCachedInheritedTeamName` | cli_inner_pretty.js:3561 | function | Module-level cache setter for `F3f` (used @682758). |
| `gte` | `getTeamFilePath` | cli_inner_pretty.js:362812 | function | `<teamsDir>/<team>/config.json`-ish team-file path. v2.1.156 `pa`. |
| `Nhe` | `readTeamFile` | cli_inner_pretty.js:362824 | function | Reads/parses the on-disk team config; used by `j3f` (inherited-name re-read) and SendMessage roster suggestion. v2.1.156 `gZ`. |
| `bQ` | `formatAgentId` | cli_inner_pretty.js:103172 | function | `` `${name}@${team}` ``. v2.1.156 `Ei`@98997. |

---

## 3. Teams Directory & File Mailbox (UNCHANGED algorithm, re-mangled)

The per-recipient JSON inbox under `<teamsDir>/<team>/inboxes/<agent>.json`. The send
primitive `writeToMailbox` (`$A`) is byte-for-byte the same lock→re-read→push→atomicWrite
as v2.1.156 `aA`; only the teams-root assembly note matters (`Gbe()` = `tr()+"teams"`, no
`.claude/teams` literal). Carryover — link the v2.1.156 baseline `mailbox_and_lifecycle_tools.md`.

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `Gbe` | `getTeamsDir` | cli_inner_pretty.js:735 | function | `ker.join(tr(), "teams")` — no `.claude/teams` string literal. v2.1.156 `RxH`@3531. |
| `tr` | `getConfigDir` | cli_inner_pretty.js:825 | function | `(CLAUDE_CONFIG_DIR ?? ~/.claude).normalize("NFC")`. v2.1.156 `l8`. |
| `$A` | `writeToMailbox` | cli_inner_pretty.js:365950 | function | **Universal send**: ensureDir → pre-create `[]` (wx, swallow EEXIST) → lock → re-read → push `{...,type:"message",read:!1}` → atomicWrite → release. Byte-identical to v2.1.156 `aA`@338306. |
| `v4e` | `getInboxPath` | cli_inner_pretty.js:365916 | function | `<teamsDir>/<team>/inboxes/<agent>.json`. v2.1.156 `jhH`@338272. |
| `Kyp` | `ensureInboxDir` | cli_inner_pretty.js:365924 | function | `mkdir -p` of `inboxes/`. v2.1.156 `HD_`@338280. |
| `Fhe` | `readMailbox` | cli_inner_pretty.js:365930 | function | Parse array; ENOENT→`[]`; SyntaxError-tolerant; back-fill `type:"message"`. v2.1.156 `h_H`@338286. |
| `iUt` | `LOCK_OPTIONS` | cli_inner_pretty.js:365965 (used) | constant | proper-lockfile retry/backoff opts spread into `$h(r,{lockfilePath,...iUt})`. v2.1.156 `DG$`@338697. |
| `np` | `TEAM_LEAD_NAME` | cli_inner_pretty.js:362636 | constant | `"team-lead"` — the leader's agent name / sole initial member. v2.1.156 `tY`@336140. |
| `iF` | `isProtocolFrame` | cli_inner_pretty.js:366256 | function | 10-type teammate-protocol-frame predicate (permission/sandbox/shutdown/mode/plan + lifecycle). Unchanged type set. v2.1.156 `$X8`@338613. |
| `Llt` | `createShutdownRequest` | cli_inner_pretty.js:366162 | function | Shutdown-request control-frame builder. Carryover. |
| `wso` | `createShutdownApproved` | cli_inner_pretty.js:366171 | function | Shutdown-approved control-frame builder. Carryover. |
| `Cso` | `createShutdownRejected` | cli_inner_pretty.js:366181 | function | Shutdown-rejected control-frame builder. Carryover. |

---

## 4. Agent Tool — Teammate-Spawn Surface (routing rewrite)

The Agent tool is now the teammate spawner. The routing predicate changed from v2.1.156's
`team_name`-parameter resolution to the implicit `teamContext`; the schema gained the
`"main"` `name` refinement and the deprecated `team_name`.

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `vs` | `AGENT_TOOL_NAME` | cli_inner_pretty.js:149939 | constant | `"Agent"` — Agent tool name const; used as `name: vs` in the def and `${vs}` in coordinator prompt. |
| `f3n` | `agentTool` | cli_inner_pretty.js:423505 | object | The Agent tool def (`pi({ name: vs, … get inputSchema(){return zao()} … async call(...) })`); `call` teammate routing at :423548-423591. v2.1.156 def near 398354. |
| `CDp` | `baseAgentSchema` | cli_inner_pretty.js:423431 | function | Memoized base input schema `{description, prompt, subagent_type, model, run_in_background}`. NEW name; base predates redesign. |
| `IDp` | `buildAgentInputSchema` | cli_inner_pretty.js:423446 | function | Merges teammate fields (`name`, `team_name`, `mode`) onto `CDp`. The `name` refinement ≠ `"main"` and the `team_name` "Deprecated; ignored" description are NEW. |
| `zao` | `servedAgentInputSchema` | cli_inner_pretty.js:423478 | function | Model-facing wrapper = `IDp().omit({cwd:true})` (further omits `run_in_background` in restricted contexts). |
| `pDa` | `AGENT_NAME_RE` | cli_inner_pretty.js:362645 (init) | constant | `/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/` — teammate-name regex (letter/digit start, ≤64 chars). NEW. |
| `LY` | `RESERVED_MAIN_NAME` | cli_inner_pretty.js:362512 | constant | `"main"` — reserved teammate name; refined out of the `name` schema; routed to the main conversation by SendMessage. NEW. |
| `zts` | `permissionModeEnum` | cli_inner_pretty.js:53866 | function | `cl.enum(wM)` permission-mode enum for the `mode` param (`["acceptEdits","auto","bypassPermissions","default","dontAsk","plan"]`). `mode` is NOT new (v2.1.156 destructured `mode:Y`); only its description changed. |
| `em` | `isTeammate` | cli_inner_pretty.js:103466 | function | "Is this session a teammate" (`Pk()` OR in-process `$q.agentId && $q.teamName`); hides `name`/`mode` in the Agent description and drives GUARD 1. |
| `l1e` | `getInProcessTeammateContext` | cli_inner_pretty.js:103447 | function | Returns the in-process teammate context (`$q`); used in the nested-teammate guard. |

---

## 5. Spawn Dispatcher & Leaf Spawners (implicit-team precondition)

`cqa`→`HDp` dispatches in-process vs pane; the three leaf spawners read
`teamContext.teamName` from app state (no `team_name` argument) and throw "session team
not initialized" if it is missing — the proof the team is a startup precondition.

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `cqa` | `spawnTeammate` | cli_inner_pretty.js:423053 | function | One-line pass-through to `HDp`; the symbol the Agent `call` invokes. NEW name. v2.1.156 entry `aA4`@398160. |
| `HDp` | `handleTeammateSpawn` | cli_inner_pretty.js:423041 | function | Dispatcher: `rWe()` ⇒ `sqa` (in-process); else `eLe()` probe (auto-fallback to in-process via `Wdo`); then `use_splitpane!==!1` ⇒ `SDp` else `EDp`. NEW. |
| `sqa` | `spawnInProcess` | cli_inner_pretty.js:422925 | function | In-process leaf spawner; lazily sets `teamContext`; throws "session team not initialized" if `teamContext.teamName` missing (@422939). v2.1.156 `CW8`. |
| `SDp` | `spawnSplitPane` | cli_inner_pretty.js:422644 | function | Split-pane (swarm-view) leaf spawner; assembles `cd … && env … claude --agent-id … --team-name <team>`; injects via `rqa`→`sendCommandToPane`→`a3n`; throws "session team not initialized" (@422659). |
| `EDp` | `spawnNonSplitPane` | cli_inner_pretty.js:422762 | function | `use_splitpane===!1` pane spawner (single pane, no swarm view); same team-name guard (@422777). Body read only at guard head (open question). |
| `rWe` | `isInProcessEnabled` | cli_inner_pretty.js:422425 | function | The in-process-vs-pane switch: `xr()` ⇒ in-process; explicit mode short-circuit; else auto-detect + sticky fallback. v2.1.156 `ma`@381076. |
| `Aje` | `getTeammateMode` | cli_inner_pretty.js:293813 | function | Snapshot mode (`Hxe ?? UOt`, `UOt="in-process"`). v2.1.156 `NU6`/`JSH` family. |
| `eLe` | `detectAndGetBackend` | cli_inner_pretty.js:422314 | function | tmux-inside ⇒ tmux backend; iTerm2 ⇒ iterm backend; emits `swarm_backend_detect`. v2.1.156 `jLH`@380965. |
| `Wdo` | `markInProcessFallbackActive` | cli_inner_pretty.js:422419 | function | Sticky bit `e.inProcessFallbackActive = !0` (pane failed → stay in-process). v2.1.156 `kU6`@381070. |
| `_F` | `globalBackendRegistry` | cli_inner_pretty.js:422467 | variable | BackendRegistry process singleton (`_F = J5a()`). v2.1.156 `NS`@381118. |
| `Vdo` | `getCurrentBackend` | cli_inner_pretty.js:422480 | function | `(await eLe()).backend` resolver. NEW name; carryover behavior. |
| `rqa` | `injectCommandIntoPane` | cli_inner_pretty.js:422493 | function | Spawn-side delegate onto `backend.sendCommandToPane(paneId, command, !insideTmux)`. v2.1.156 pane-spawn delegate family. |
| `sDp` | `runInProcessTeammate` | cli_inner_pretty.js:421006 | function | The in-process persistent agent loop; per-turn `AbortController`; idle notification on turn end; clears only per-turn `currentWorkAbortController` (not children) at @421247. **v2.1.183 idle update @421263 now sets `evictAfter: Date.now() + zGe`** (arms the +30s eviction timer on turn-end), whereas v2.1.156 `JT_` idle update @379909 set `{isIdle:!0, onIdleCallbacks:[]}` with **no** `evictAfter`. v2.1.156 `JT_`@379714. |
| `qut` | `startInProcessTeammate` | cli_inner_pretty.js:421374 | function | Fire-and-forget `sDp(e).catch(...)`. v2.1.156 `qeH`@380016. |
| `ZLp` | `POLL_INTERVAL_MS` | cli_inner_pretty.js:421380 | constant | `500` — in-process mailbox poll interval. v2.1.156 `fT_`@380022. |

---

## 6. tmux Spawn Fix — send-keys → respawn-pane (NEW mechanic)

The cross-process tmux backend no longer types the command via `send-keys`; it creates the
pane running `cat` and replaces it with `respawn-pane -k -- <cmd>`. This is the
slow-rc-init + keystroke-leak structural fix. The 200ms shell-init delay was deleted.

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `a3n` | `sendCommandViaRespawn` | cli_inner_pretty.js:421874 | function | Arms `remain-on-exit failed`, then `respawn-pane -k -t <pane> -- <cmd>` (exec, no shell typing). **NEW** — replaces v2.1.156 `send-keys … Enter` (`sendCommandToPane`@380566). |
| `Slt` | `assertNoControlChars` | cli_inner_pretty.js:362755 | function | Rejects commands containing any Unicode control char (`\p{Cc}`) before sending to a terminal; precise `U+XXXX` error. **NEW** defense-in-depth (regex `fDa`@362775). |
| `fDa` | `CONTROL_CHAR_RE` | cli_inner_pretty.js:362775 | constant | `/\p{Cc}/u` — Unicode "Control" category. NEW. |
| `Gke` | `PANE_HOLD_COMMAND` | cli_inner_pretty.js:362642 | constant | `"cat"` — the benign quiescent placeholder each teammate pane runs until `respawn-pane`. NEW. |
| `B8` | `TMUX_COMMAND` | cli_inner_pretty.js:362640 | constant | `"tmux"`. v2.1.156 `uu`@336143. |
| `_lt` | `TEAMMATE_COMMAND_ENV` | cli_inner_pretty.js:362643 | constant | `"CLAUDE_CODE_TEAMMATE_COMMAND"` — exec-path override. v2.1.156 `WsH`@336145. |
| `N8` | `SWARM_SESSION_NAME` | cli_inner_pretty.js:362641 (init) | constant | `"claude-swarm"` — external standalone swarm session name. Carryover. |
| `ylt` | `SWARM_WINDOW_NAME` | cli_inner_pretty.js:362641 (init) | constant | `"swarm-view"`. Carryover. |
| `Qoo` | `HIDDEN_SESSION_NAME` | cli_inner_pretty.js:362641 | constant | `"claude-hidden"` — hidePane break-pane target. Carryover. |
| `Ndo` | `TmuxBackend` | cli_inner_pretty.js:421879 | class | tmux `PaneBackend`; `createTeammatePaneWithLeader`/`External`/`createExternalSwarmSession` all use `split-window/new-window/new-session -d … -- cat`; `sendCommandToPane`@421900 = `Slt` guard + `a3n`. v2.1.156 `ZU6`@380545. |
| `kj` | `runTmuxInSwarmSocket` | cli_inner_pretty.js:421866 | function | `tmux [-S <socket>] …` (user session). v2.1.156 `kS`@380537. |
| `yF` | `runTmuxInSwarmLabel` | cli_inner_pretty.js:421871 | function | `tmux -L <label> …` (external swarm session). v2.1.156 `BE`@380542. |
| `Fn` | `runTmux` | cli_inner_pretty.js:421874 (called) | function | Low-level tmux exec used by `a3n` (`Fn(B8, [...])`). Carryover. |
| `sF` | `SwarmPaneError` | cli_inner_pretty.js:421878 (thrown) | class | Typed error thrown by `a3n`/`Slt` on pane-command failure. Carryover. |

---

## 7. SendMessage Tool — "main" recipient + cross-session socket addressing (delta)

`SendMessage` gained the `"main"` recipient (route to the main conversation, background
subagents only) and `validateInput` gained `uds:`/`bridge:` socket-address validation. The
model-facing `message` union is **unchanged** (3 types, both versions); only the
`request_id` regex tightened.

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `zh` | `SEND_MESSAGE_NAME` | cli_inner_pretty.js:221450 | constant | `"SendMessage"`. v2.1.156 `cf`@216283. |
| `p$p` | `sendMessageTool` | cli_inner_pretty.js:434568 | object | Tool def (`pi({ name: zh, isEnabled(){return Sl()}, validateInput, call … })`). v2.1.156 `Bh_`@407447. |
| `o$p` | `sendMessageInputSchema` | cli_inner_pretty.js:434558 | function | `{to, summary?(max 200), message: string | r$p}`. v2.1.156 `Sh_`. |
| `r$p` | `sendMessageMessageUnion` | cli_inner_pretty.js:434542 | function | 3-type discriminated union (`shutdown_request | shutdown_response | plan_approval_response`). UNCHANGED set vs v2.1.156 `hh_`@407421; the `request_id` regex `lza` is the only schema delta. |
| `lza` | `REQUEST_ID_RE` | cli_inner_pretty.js:434539 | constant | `/^[^\n\r]{1,200}$/` — bounds the echoed `request_id` to one line ≤200 chars. NEW (v2.1.156 `request_id` was a bare string). |
| `rza` | `buildSendMessagePrompt` | cli_inner_pretty.js:434286 | function | Compact-markdown prompt; the ONLY change vs v2.1.156 `iO4`@407201 is the new `"main"` recipient-table row. |
| `nza` | `SEND_MESSAGE_DESCRIPTION` | cli_inner_pretty.js:434314 | constant | `"Send a message to another agent"`. NEW const split-out. |
| `i$p` | `sendTeammateMessage` | cli_inner_pretty.js:434357 | function | String-message leg → `writeToMailbox`; adds a v2.1.183 roster-suggestion (`Agent({name:'<x>'})`) when recipient not in `teamContext.teammates`. v2.1.156 `Ih_`@407257. |
| `cza` | `resolveAgentName` | cli_inner_pretty.js:434343 | function | Resolves the caller-task's agent name (for the `origin`/relay envelope). NEW. |
| `lDa` | `wrapRelayMessage` | cli_inner_pretty.js:362507 | function | Wraps peer plain text in `<agent-message from="…">…</agent-message>` before queueing to "main". NEW. |
| `Nen` | `AGENT_MESSAGE_TAG` | cli_inner_pretty.js:45675 | constant | `"agent-message"` — the relay-envelope tag. NEW. |
| `LLa` | `parseSocketAddress` | cli_inner_pretty.js:359974 | function | `uds:`/`bridge:`/leading-`/`/`\\.\pipe\` scheme parser. The `\\.\pipe\` (Windows named-pipe) branch is NEW vs v2.1.156 `lO4`@407013. |
| `Lhe` | `isLocalSocketAddress` | cli_inner_pretty.js:359981 | function | NEW local-socket-address format gate (only bites on a `//`-prefixed string that is not a well-formed `\\.\pipe\<name>`); rejection steers the model to `ListAgents`. grep "is not a local socket address" = 0 in v2.1.156. |
| `Gtt` | `LIST_AGENTS_TOOL` | cli_inner_pretty.js:221577 | constant | `"ListAgents"` — the tool-name string cited in the socket-address rejection and the coordinator prompt. (Dossier tentatively read this as an "address-list constant"; it is the tool name.) |
| `o_` | `enqueuePrompt` | cli_inner_pretty.js:234005 | function | `ug.enqueue` — the main conversation's prompt queue; `"main"` routing enqueues here with `priority:"next", isMeta:true, skipSlashCommands:true`. Carryover (execution index). |
| `Ls` | `getMainAgentId` | cli_inner_pretty.js:2664 | function | Main conversation agent id; `"main"` queue target and the notification fallback target. |

---

## 8. REMOVED in v2.1.183 (TeamCreate / TeamDelete — for traceability)

These symbols **do not exist** in the v2.1.183 bundle (grep=0). They are listed with their
**v2.1.156** lines so the removal is traceable. The team lifecycle is now owned by the CLI
bootstrap (`j3f`, §2), not the model.

| v2.1.156 Obfuscated | Readable | v2.1.156 File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `rd` | `TeamCreate` (name const) | cli_inner_pretty.js:216438 (v2.1.156) | constant | **REMOVED in v2.1.183** (grep=0). Was the team-create tool-name const. |
| `Th_` | `TeamCreateTool` (def) | cli_inner_pretty.js:406631 (v2.1.156) | object | **REMOVED**. Wrote team file + task dir + leader membership; emitted `tengu_team_created` (also grep=0 in v2.1.183). |
| `Oo` | `TeamDelete` (name const) | cli_inner_pretty.js:216439 (v2.1.156) | constant | **REMOVED in v2.1.183** (grep=0). |
| `vh_` | `TeamDeleteTool` (def) | cli_inner_pretty.js:406775 (v2.1.156) | object | **REMOVED**. Refused while teammates active; emitted `tengu_team_deleted` (grep=0 in v2.1.183). |
| `RO4` | `TEAM_CREATE_PROMPT` | cli_inner_pretty.js:406487 (v2.1.156) | function | **REMOVED** (the only place `.claude/teams/...` literals lived). |
| `xO4` | `TEAM_DELETE_PROMPT` | cli_inner_pretty.js:406735 (v2.1.156) | function | **REMOVED**. |
| `oN_` | `resolveTeamName` | cli_inner_pretty.js:398190 (v2.1.156) | function | **REMOVED** routing pivot (`team_name || teamContext.teamName`, param-first). v2.1.183 reads `Sl() ? appState.teamContext` directly. |
| `aA4` | `spawnTeammate` (v2.1.156 entry) | cli_inner_pretty.js:398160 (v2.1.156) | function | Superseded by `cqa`→`HDp` (§5); v2.1.156 was handed an explicit `team_name: resolvedTeam`. |

---

## 9. Coordinator Mode (live in v2.1.156; prompt/filter deltas in v2.1.183)

Coordinator mode (`CLAUDE_CODE_COORDINATOR_MODE`) reshapes the loop into an orchestrator.
The gate, the cross-session-peer prompt block, and the worker-stop tool **pre-existed**
(dossier §3.8 corrected). The genuine deltas are prompt-text refinements and two new
worker-tool filters in `_vd`.

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `oI` | `isCoordinatorModeRaw` | cli_inner_pretty.js:221871 | function | Raw gate: `CLAUDE_CODE_COORDINATOR_MODE` truthy AND not (interactive-local non-remote). v2.1.156 `cI`@216440. Unchanged. |
| `z9` | `isCoordinatorMode` | cli_inner_pretty.js:221892 | function | Public wrapper `return oI()`. v2.1.156 `Bp`@216460. Unchanged. |
| `VI` | `isInteractiveTerminal` | cli_inner_pretty.js:3154 | function | `Ot.isInteractive` — coordinator interactive-local-veto input. |
| `_a` | `isRemoteWorkspace` | cli_inner_pretty.js:3638 | function | `Ot.caps.workspace === "remote"` — veto input. |
| `yvd` | `matchSessionMode` | cli_inner_pretty.js:221898 | function | Resumed-session mode reconcile (flip env var, re-evaluate the full gate, roll back if vetoed); emits `tengu_coordinator_mode_switched`. v2.1.156 `jk5`. Unchanged. |
| `bvd` | `getCoordinatorSystemPrompt` | cli_inner_pretty.js:221940 | function | Orchestrator system prompt. Deltas: approval-passthrough bullet (@222076), rewritten Concurrency paragraph (@222026), extended example (@222166-222175). v2.1.156 `Dk5`@216506. |
| `_vd` | `getCoordinatorUserContext` | cli_inner_pretty.js:221916 | function | Builds `workerToolsContext`. NEW filters: always drop `Workflow`; drop `Artifact` unless `DCe()`; scratchpad wording softened. v2.1.156 `wk5`. |
| `zk` | `WORKFLOW_TOOL` | cli_inner_pretty.js:221550 | constant | `"Workflow"` — dropped from the worker-tool list by `_vd`. |
| `VAe` | `ARTIFACT_TOOL` | cli_inner_pretty.js:221750 | constant | `"Artifact"` — dropped from the worker-tool list unless `DCe()`. |
| `DCe` | `isArtifactEnabled` | cli_inner_pretty.js:221839 | function | First-party/online/non-local-agent gate consulted by the `_vd` Artifact filter (head read; body not fully). |
| `gvd` | `COORDINATOR_HIDDEN_TOOLS` | cli_inner_pretty.js:222194 | constant | Pre-existing worker-tool denylist `new Set([zh, Em])` (used in `_vd` @221916). Carryover. |
| `uP` | `TASK_STOP_NAME` | cli_inner_pretty.js:220834 | constant | `"TaskStop"` — the coordinator's "Stop a running worker" tool (NOT a "StopAgent"; reused generic task stopper). v2.1.156 `nT`. |
| `edt` | `taskStopTool` | cli_inner_pretty.js:424867 | object | The `TaskStop` def (`pi({ name: uP, aliases:["KillShell","KillBash"], shell_id deprecated alias … })`). Carryover. |
| `a3t` | `stopTask` | cli_inner_pretty.js:424764 | function | Stop primitive used by `edt.call`. Carryover. |

---

## 10. Background-Task Survival Fix (keepalive wired into the notification builder)

The version's headline teammate bug-fix ("background tasks started by a teammate killed
when the teammate finishes a turn"). The keepalive primitives pre-exist; the isolatable
delta is in the task-notification builder `G4e` (owner-alive gate + routing `agentId` +
keepalive release + new `<note>`).

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `G4e` | `enqueueAgentNotification` | cli_inner_pretty.js:445827 | function | Task-notification builder. **Delta**: new `ownerAgentId` param, owner-alive gate `g`, `removeKeepaliveReason` release, routing `agentId: ownerAlive ? toAgentId(owner) : mainAgentId()`, and the new `<note>` (grep=0 in v2.1.156). v2.1.156 `c5H`@435474. |
| `Lye` | `keepaliveReasons` | cli_inner_pretty.js:445750 | function | `task.keepaliveReasons ?? new Set()`. v2.1.156 `hRH`@435417. Unchanged. |
| `YR` | `isCompletedButParked` | cli_inner_pretty.js:445753 | function | `status === "completed" && keepaliveReasons(task).size > 0` — a completed-but-kept-alive ("parked") task. Parallels v2.1.156's inline `"parked"` test (@435426). |
| `tWe` | `addKeepaliveReason` | cli_inner_pretty.js:445772 | function | Register `agent:<childId>` pin on the owner (idempotent, local-agent only). v2.1.156 `yW8`. Unchanged. |
| `Fut` | `removeKeepaliveReason` | cli_inner_pretty.js:445779 | function | Release a pin; if it was the last and the task is terminal+unpinned, schedule `evictAfter = now + zGe`. v2.1.156 `hW8`. Unchanged. |
| `ect` | `hasChildAgents` | cli_inner_pretty.js:445794 | function | Scans an agent's reasons for any `agent:` prefix — the literal "live background children" condition the `<note>` references. NEW name. |
| `QBn` | `gcStaleChildReasons` | cli_inner_pretty.js:445801 | function | Garbage-collects stale `agent:` reasons whose child already notified. Carryover. |
| `od` | `isLocalAgent` | cli_inner_pretty.js:445761 | function | Local-agent guard used by the keepalive helpers and the owner-alive gate. |
| `tC` | `isTerminalStatus` | cli_inner_pretty.js:575418 | function | `"completed"|"failed"|"killed"` — eviction precondition. v2.1.156 `S2`. |
| `xr` | `isHeadless` / `isNonInteractive` | cli_inner_pretty.js:3151 | function | `!Ot.isInteractive`. Vetoes the parked-owner branch in headless runs; also the bootstrap-gate `!xr()` and `rWe` non-interactive short-circuit. v2.1.156 `R6`@2742 family. |
| `zGe` | `EVICT_DELAY_MS` | cli_inner_pretty.js:439188 | constant | `30000` — eviction grace after the last keepalive reason drops. |
| `_f` | `enqueuePendingNotification` | cli_inner_pretty.js:234006 | function | `ug.enqueuePendingNotification` — the queue `G4e` routes the notification into. |
| `If` | `toAgentId` | cli_inner_pretty.js:2037 | function | Identity brand-cast; routes a notification **to the still-alive owner agent**. |

---

## Notes & Caveats

- **All v2.1.183 rows carry a verified `cli_inner_pretty.js:<line>`** read against
  `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` during
  this pass. The §8 "REMOVED" rows carry **v2.1.156** lines (the symbols are absent from
  v2.1.183 — that absence is the point).
- **Re-mangling is total.** Per `_asset_anchors.md`, no v2.1.156 obfuscated name survives
  in v2.1.183 (`R7`→`Sl`, `Ru5`→`yqd`, `aA`→`$A`, `jhH`→`v4e`, `tY`→`np`, `uu`→`B8`,
  `Ei`→`bQ`, `JT_`→`sDp`, `fT_`→`ZLp`, `ma`→`rWe`, `jLH`→`eLe`, `NS`→`_F`, …). The
  Description column gives the v2.1.156 alias for each carried-over symbol.
- **Declaration-line vs body-line.** A few cites point at the *declaration* line of a
  memoized/`pi(...)` symbol: `f3n` at 423505 (`(f3n = pi({`, with `name: vs` at 423512),
  `CDp` at 423431 (`(CDp = we(() =>`), `IDp` at 423446, `zao` at 423478, `r$p` at 434542
  (the `H.discriminatedUnion(...)` body), `F3f` at **682755** (function header; body
  `if (ZKt()...)` at 682756; `ZKt`/`e7t` are themselves declared at 3558/3561 and *used* at
  682756/682758). `B3f`/`iUt` lines are marked "(used)"/"(init)" where the symbol is
  referenced at that line rather than declared there.
- **`vs` (Agent name const) is at 149939**, not in the Agent-def block — the
  implicit-team module doc's inline "`vs` const at 423515" was a slip; the canonical
  location used here and in the README is **149939**.
- **Open questions carried (medium / unverified-edge):** the `F3f` env-var setter
  (`CLAUDE_INTERNAL_ASSISTANT_TEAM_NAME`); the `EDp` non-splitpane body (read at guard head
  only); the `_vd` `Workflow` filter's inlined `|| !1` flag (read as "always drop"); the
  `G4e` `<age>`/`<note>` tag-const literals (`bM`) not fully resolved. See the module docs'
  "Confidence & open questions" sections.
- **RESOLVED (high confidence) in the fix pass:** whether the in-process turn-end (`sDp`
  idle path) also changed vs v2.1.156 `JT_` beyond the `G4e` notification delta. It **did**:
  the v2.1.183 `sDp` idle update @421263 now sets `evictAfter: Date.now() + zGe` (`zGe=30000`
  @439188) whereas v2.1.156 `JT_` @379909 set only `{isIdle:!0, onIdleCallbacks:[]}`. The
  turn-end thus *arms* eviction and the `G4e` notification-routing + keepalive *gate* it —
  both are parts of the same survival fix. See
  `coordinator_and_background_survival.md` §3.6 #1.
- **Disproved dossier suspicions (now negative deltas):** the SendMessage model-facing
  `message` union was **not** trimmed (3 types in both versions; `team_permission_update`/
  `mode_set_request` were never model-submittable); the coordinator cross-session-peer
  block, `uds:`/`bridge:` addressing, `<cross-session-message>` envelope, and worker-stop
  tool reference **pre-existed verbatim** in v2.1.156. Both corrections are documented in
  the module docs with before-picture lines.

---

## Reconstruction-pass additions (readable-source restoration)

> These rows are the **additional** symbols surfaced by reconstructing the *whole*
> agent-team ("swarm") machine into readable TypeScript under
> [`30_agent_team/reconstructed_source/`](../30_agent_team/reconstructed_source/),
> organized the way the genuine v2.1.88 named-TS source tree organizes it. The
> sections above (§1–§10) are the **delta** manifest — only what *changed* in the
> v2.1.178→183 redesign. This section adds the carryover/supporting symbols that the
> full reconstruction had to name and anchor (identity helpers, the in-memory
> `Mailbox` class, the complete control-frame protocol, backend detection/registry,
> pane-backend internals, the leader permission bridge, the SendMessage handlers,
> and the spawn-side helpers). **Every row below carries a
> `cli_inner_pretty.js:<line>` re-read against
> `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`
> during this pass** (the same bundle as §1–§10). None of these obfuscated names
> appear anywhere in §1–§10 above (they are net-new to this file).
>
> **Index home:** these fold into
> [`00_overview/symbol_index_core_features.md`](symbol_index_core_features.md)
> **"## Module: Agent Team"** (same home as the delta rows). A handful are shared
> infra/tool-name constants whose canonical home is the execution/platform indexes;
> they are reproduced here only as a reading aid for the reconstructed source and
> are marked in their sub-table intro.
>
> **Verification:** ~170 of these rows were re-read line-for-line against the live
> v2.1.183 bundle in this pass (all matched at the cited line) EXCEPT the two
> permission-text constants `Wte`/`Mjt`, whose reconstructed anchors were off by a
> few lines — the corrected declaration lines (590316 / 590318) are used in the
> table below and the discrepancy is noted.

### R1. Identity & Context

Agent-id formatting/parsing and the AsyncLocalStorage-based teammate-context isolation (`utils/agentId.ts`, `utils/agentContext.ts`, `utils/teammate.ts`).

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `tUo` | `parseAgentIdString` | cli_inner_pretty.js:2040 | function | Parse an `name@team` agent-id string back into components. |
| `NCr` | `encodeAgentIdComponent` | cli_inner_pretty.js:103175 | function | URI-encode one agent-id component (name or team) for safe `@`-joining. |
| `fwt` | `parseAgentId` | cli_inner_pretty.js:103178 | function | Parse a formatted agent id into `{name, team}`. |
| `TYe` | `generateRequestId` | cli_inner_pretty.js:103183 | function | Random request-id generator (identity helper; distinct from the bridge's `HTp`). |
| `Pk` | `getTeammateContext` | cli_inner_pretty.js:103394 | function | Read the current in-process teammate context from the AsyncLocalStorage (`GCr`). |
| `Kun` | `runWithTeammateContext` | cli_inner_pretty.js:103397 | function | Run a callback inside a teammate-context ALS scope. |
| `UN` | `isInProcessTeammate` | cli_inner_pretty.js:103400 | function | Predicate: is this an in-process (not pane) teammate session. |
| `Yun` | `createTeammateContext` | cli_inner_pretty.js:103403 | function | Construct a teammate context object from spawn params. |
| `GCr` | `teammateContextStorage` | cli_inner_pretty.js:103408 | variable | `AsyncLocalStorage` instance holding the per-teammate context (isolation primitive). |
| `VD` | `getAgentId` | cli_inner_pretty.js:103450 | function | Return the current agent id (`main` for the leader, `name@team` for a teammate). |
| `Wz` | `createDeferred` | cli_inner_pretty.js:103580 | function | Create a `{promise, resolve, reject}` deferred (used by pane-creation locks / runner). |

### R2. Coordinator Tool-Name Refs

Tool-name constants and availability predicates the coordinator consults to build the worker-tool list. These live OUTSIDE the swarm tree; reproduced here because the reconstructed `coordinatorMode.ts` references them.

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `ns` | `BASH_TOOL_NAME` | cli_inner_pretty.js:145275 | constant | `"Bash"` — tool-name const referenced by the coordinator worker-tool list. |
| `Pw` | `isWorkflowAvailable` | cli_inner_pretty.js:148784 | function | Predicate consulted by the coordinator to decide whether the Workflow tool is offered. |
| `c9` | `LEGACY_AGENT_TOOL_NAME` | cli_inner_pretty.js:149940 | constant | `"Task"` — the legacy alias name for the Agent tool (declared beside `vs="Agent"`). |
| `$Ai` | `ONE_SHOT_BUILTIN_AGENT_TYPES` | cli_inner_pretty.js:149943 | constant | `new Set(["Explore","Plan"])` — built-in one-shot agent types the spawn path treats specially. |
| `Fa` | `FILE_EDIT_TOOL_NAME` | cli_inner_pretty.js:152083 | constant | `"Edit"` — worker-eligible tool-name const used by the coordinator filter. |
| `Ws` | `FILE_READ_TOOL_NAME` | cli_inner_pretty.js:152217 | constant | `"Read"` — worker-eligible tool-name const used by the coordinator filter. |
| `Xs` | `POWERSHELL_TOOL_NAME` | cli_inner_pretty.js:221424 | constant | `"PowerShell"` — tool-name const referenced by the coordinator worker-tool list. |
| `JO` | `isPowerShellAvailable` | cli_inner_pretty.js:221425 | function | Predicate: is PowerShell available (simple-build worker-tool gate). |
| `Su` | `isBashAvailable` | cli_inner_pretty.js:221433 | function | Predicate: is Bash available (simple-build worker-tool gate). |
| `Em` | `STRUCTURED_OUTPUT_TOOL_NAME` | cli_inner_pretty.js:221489 | constant | `"StructuredOutput"` — member of the coordinator hidden-tools denylist `gvd`. |
| `UPt` | `WORKER_TOOL_SET` | cli_inner_pretty.js:221822 | constant | The full-build worker-eligible tool set (`UPt = mvd("external")`). |

### R3. Coordinator

Coordinator-mode gate helpers beyond the already-listed `oI`/`z9`/`yvd`/`bvd`/`_vd`.

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `Avd` | `isScratchpadEnabled` | cli_inner_pretty.js:221888 | function | Coordinator scratchpad-feature gate (consulted in `_vd`). |
| `hvd` | `isCcrCoordinator` | cli_inner_pretty.js:221895 | function | CCR (Claude-Code-Runner) coordinator variant predicate. |
| `x1i` | `scratchpadGateConfig` | cli_inner_pretty.js:574217 | object | Scratchpad gate config object (`var x1i = {}`) backing `isScratchpadEnabled`. |

### R4. Coordinator Infra Refs

Generic telemetry/env/coercion primitives the coordinator borrows (shared infra, not swarm-specific).

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `st` | `parseBoolean` | cli_inner_pretty.js:163 | function | Parse an env-var string as a boolean (coordinator env helper). |
| `Ne` | `redactTelemetryValue` | cli_inner_pretty.js:140 | function | Redact a value before telemetry emission (coordinator telemetry helper). |
| `G` | `emitTelemetry` | cli_inner_pretty.js:3810 | function | Emit a telemetry event (shared telemetry primitive used by the coordinator). |
| `Le` | `incrementCounterMetric` | cli_inner_pretty.js:44569 | function | Increment a named counter metric (shared metrics primitive). |
| `n0` | `coerceBoolean` | cli_inner_pretty.js:292819 | function | Zod-coercing boolean parser (`H.boolean()`-based) used for env/option flags. |

### R5. Teammate-Mode Snapshot

The startup mode-snapshot module (`utils/swarm/backends/teammateModeSnapshot.ts`) — captures `auto|tmux|in-process` ONCE so runtime config edits can't change it mid-session. v2.1.183 default flipped to `in-process`.

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `hqd` | `setCliTeammateModeOverride` | cli_inner_pretty.js:293797 | function | Record the `--teammate-mode` CLI override BEFORE the snapshot is captured. |
| `QYr` | `getCliTeammateModeOverride` | cli_inner_pretty.js:293800 | function | Read the recorded CLI teammate-mode override. |
| `ZYr` | `clearCliTeammateModeOverride` | cli_inner_pretty.js:293803 | function | Clear the CLI teammate-mode override. |
| `eXr` | `hasTeammateModeSnapshot` | cli_inner_pretty.js:293806 | function | Predicate: has the teammate-mode snapshot been captured yet. |
| `ALn` | `captureTeammateModeSnapshot` | cli_inner_pretty.js:293809 | function | Capture the teammate-mode snapshot once at startup (`Ec("teammateMode", UOt)`). |
| `UOt` | `DEFAULT_TEAMMATE_MODE` | cli_inner_pretty.js:293818 | constant | `"in-process"` — the v2.1.183 DEFAULT teammate mode (v2.1.88 default was `"auto"`). |
| `Hxe` | `initialTeammateMode` | cli_inner_pretty.js:293819 | variable | Module var: the captured initial teammate mode (null until captured). |
| `FOt` | `cliTeammateModeOverride` | cli_inner_pretty.js:293820 | variable | Module var: the CLI teammate-mode override (null until set). |

### R6. In-Memory Mailbox

The in-process `Mailbox` class (`utils/mailbox.ts`).

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `kJr` | `Mailbox` | cli_inner_pretty.js:301895 | class | In-memory `Mailbox` class (send/poll/receive/notify/subscribe) — the in-process mailbox. |

### R7. Backend Detection & Naming

tmux/iTerm2 detection, socket/session naming, and name sanitization (`utils/swarm/backends/detection.ts`, `utils/swarm/constants.ts`).

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `VFt` | `getSwarmSocketName` | cli_inner_pretty.js:362633 | function | Compute the per-user swarm tmux socket name. |
| `iBn` | `isInsideTmuxSync` | cli_inner_pretty.js:362694 | function | Synchronous `$TMUX`-presence check. |
| `kgp` | `listUserTmuxSessions` | cli_inner_pretty.js:362697 | function | List the user's existing tmux sessions (async). |
| `mte` | `isInsideTmux` | cli_inner_pretty.js:362713 | function | Async inside-tmux check. |
| `aBn` | `getLeaderPaneId` | cli_inner_pretty.js:362717 | function | Resolve the leader's tmux pane id. |
| `lBn` | `getUserTmuxSocket` | cli_inner_pretty.js:362720 | function | Resolve the user's tmux socket path. |
| `Wke` | `isTmuxAvailable` | cli_inner_pretty.js:362724 | function | Async tmux-binary availability check. |
| `oce` | `isInITerm2` | cli_inner_pretty.js:362727 | function | Predicate: running inside iTerm2. |
| `YFt` | `isIt2CliAvailable` | cli_inner_pretty.js:362734 | function | Async `it2` (iTerm2 CLI) availability check. |
| `Lgp` | `resetDetectionCache` | cli_inner_pretty.js:362737 | function | Reset the cached backend-detection results (test/refresh). |
| `zFt` | `cachedTmuxDetection` | cli_inner_pretty.js:362742 | variable | Module var: cached tmux-detection result (null until probed). |
| `KFt` | `cachedIt2Detection` | cli_inner_pretty.js:362743 | variable | Module var: cached it2-detection result (null until probed). |
| `cBn` | `IT2_COMMAND` | cli_inner_pretty.js:362744 | constant | `"it2"` — the iTerm2 CLI command name. |
| `mDa` | `hasControlChars` | cli_inner_pretty.js:362752 | function | Predicate: does a string contain Unicode control chars (the `Slt` guard's test). |
| `XFt` | `isPaneBackendType` | cli_inner_pretty.js:362764 | function | Predicate: is a value a valid pane-backend type (`"tmux"|"iterm"`). |
| `uBn` | `sanitizeName` | cli_inner_pretty.js:362803 | function | Slugify/sanitize a name for tmux (allowed chars only). |
| `tso` | `sanitizeAgentName` | cli_inner_pretty.js:362806 | function | Sanitize a teammate agent name (delegates to `uBn`). |

### R8. Team-File I/O

On-disk team-config read/write helpers (`utils/swarm/teammateInit.ts` / team helpers).

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `QFt` | `getTeamDir` | cli_inner_pretty.js:362809 | function | `<teamsDir>/<team>` directory path. |
| `gj` | `readTeamFileSync` | cli_inner_pretty.js:362815 | function | Synchronous read+parse of the on-disk team config file. |
| `dBn` | `handleTeamWriteError` | cli_inner_pretty.js:362833 | function | Handle a team-file write error (EEXIST/race tolerant). |
| `ZFt` | `writeTeamFileSync` | cli_inner_pretty.js:362837 | function | Synchronous write of the team config file. |
| `pBn` | `writeTeamFile` | cli_inner_pretty.js:362885 | function | Async write of the team config file (lock + atomicWrite). |

### R9. File Mailbox Helpers

File-backed inbox read/mark/clear/format helpers complementing the already-listed `$A`/`v4e`/`Fhe`/`Kyp` (`utils/mailbox.ts`).

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `T4e` | `readUnreadMessages` | cli_inner_pretty.js:365945 | function | Read only the unread messages from a file inbox. |
| `aUt` | `markSingleMessageAsRead` | cli_inner_pretty.js:365977 | function | Mark a single inbox message as read (lock + re-read + rewrite). |
| `Ilt` | `messageKey` | cli_inner_pretty.js:366004 | function | Compute a stable de-dupe key for an inbox message. |
| `w4e` | `markMessagesAsRead` | cli_inner_pretty.js:366007 | function | Mark a batch of inbox messages as read. |
| `lUt` | `clearInbox` | cli_inner_pretty.js:366039 | function | Clear (truncate) an inbox file. |
| `xlt` | `formatAsTeammateXml` | cli_inner_pretty.js:366054 | function | Render one teammate message as the `<...>` XML the leader sees. |
| `klt` | `formatMessagesAsTeammateXml` | cli_inner_pretty.js:366062 | function | Render a list of teammate messages as XML. |

### R10. Control-Message Protocol

The full teammate control-frame surface — builders, type-predicates, and Zod schemas for the 10-type protocol (`utils/teammateMailbox.ts` / `utils/teammateControlMessages.ts`). The already-listed `iF`/`Llt`/`wso`/`Cso` are the tip; this is the rest.

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `cUt` | `createIdleNotification` | cli_inner_pretty.js:366068 | function | Build an idle-notification control frame. |
| `Sso` | `isIdleNotification` | cli_inner_pretty.js:366080 | function | Predicate: is a frame an idle notification. |
| `Eso` | `createPermissionRequestMessage` | cli_inner_pretty.js:366087 | function | Build a permission-request control frame. |
| `Hso` | `createPermissionResponseMessage` | cli_inner_pretty.js:366099 | function | Build a permission-response control frame. |
| `uUt` | `isPermissionRequest` | cli_inner_pretty.js:366114 | function | Predicate: is a frame a permission request. |
| `I4e` | `isPermissionResponse` | cli_inner_pretty.js:366121 | function | Predicate: is a frame a permission response. |
| `vso` | `createSandboxPermissionRequestMessage` | cli_inner_pretty.js:366128 | function | Build a sandbox-permission-request control frame. |
| `Tso` | `createSandboxPermissionResponseMessage` | cli_inner_pretty.js:366139 | function | Build a sandbox-permission-response control frame. |
| `bBn` | `isSandboxPermissionRequest` | cli_inner_pretty.js:366148 | function | Predicate: is a frame a sandbox-permission request. |
| `dUt` | `isSandboxPermissionResponse` | cli_inner_pretty.js:366155 | function | Predicate: is a frame a sandbox-permission response. |
| `Yyp` | `sendShutdownRequestToMailbox` | cli_inner_pretty.js:366190 | function | Send a shutdown-request control frame to a teammate's mailbox. |
| `Dlt` | `isShutdownRequest` | cli_inner_pretty.js:366200 | function | Predicate: is a frame a shutdown request. |
| `AUt` | `isPlanApprovalRequest` | cli_inner_pretty.js:366207 | function | Predicate: is a frame a plan-approval request. |
| `jhe` | `isShutdownApproved` | cli_inner_pretty.js:366214 | function | Predicate: is a frame a shutdown-approved. |
| `Plt` | `isPlanApprovalResponse` | cli_inner_pretty.js:366221 | function | Predicate: is a frame a plan-approval response. |
| `EBn` | `isTaskAssignment` | cli_inner_pretty.js:366228 | function | Predicate: is a frame a task assignment. |
| `jT` | `parseFrameForDisplay` | cli_inner_pretty.js:366231 | function | Parse a protocol frame into a display string. |
| `xso` | `isTeamPermissionUpdate` | cli_inner_pretty.js:366238 | function | Predicate: is a frame a team-permission-update. |
| `Xyp` | `createModeSetRequestMessage` | cli_inner_pretty.js:366246 | function | Build a mode-set-request control frame. |
| `Mlt` | `isModeSetRequest` | cli_inner_pretty.js:366249 | function | Predicate: is a frame a mode-set request. |
| `hUt` | `planApprovalResumeText` | cli_inner_pretty.js:366277 | function | Build the resume text shown after a plan approval. |
| `kso` | `isHeadlessLeadDisplayableMessage` | cli_inner_pretty.js:366282 | function | Predicate: is a frame displayable to the headless lead. |
| `gUt` | `PROTOCOL_FRAME_PROMPT_ERROR` | cli_inner_pretty.js:366345 | constant | Error-text constant returned when a protocol frame is submitted as a prompt. |
| `C4e` | `IdleNotificationMessageSchema` | cli_inner_pretty.js:366364 | constant | Zod schema: idle-notification message. |
| `pUt` | `PlanApprovalRequestMessageSchema` | cli_inner_pretty.js:366376 | constant | Zod schema: plan-approval-request message. |
| `fUt` | `PlanApprovalResponseMessageSchema` | cli_inner_pretty.js:366386 | constant | Zod schema: plan-approval-response message. |
| `mUt` | `ShutdownRequestMessageSchema` | cli_inner_pretty.js:366396 | constant | Zod schema: shutdown-request message. |
| `Uhe` | `ShutdownApprovedMessageSchema` | cli_inner_pretty.js:366405 | constant | Zod schema: shutdown-approved message. |
| `SBn` | `ShutdownRejectedMessageSchema` | cli_inner_pretty.js:366415 | constant | Zod schema: shutdown-rejected message. |
| `ODa` | `TaskAssignmentMessageSchema` | cli_inner_pretty.js:366424 | constant | Zod schema: task-assignment message. |
| `Iso` | `TaskCompletedMessageSchema` | cli_inner_pretty.js:366434 | constant | Zod schema: task-completed message. |
| `x4e` | `TeammateTerminatedMessageSchema` | cli_inner_pretty.js:366443 | constant | Zod schema: teammate-terminated message. |
| `NDa` | `ModeSetRequestMessageSchema` | cli_inner_pretty.js:366444 | constant | Zod schema: mode-set-request message. |
| `Jyp` | `parseJsonPermissionUpdates` | cli_inner_pretty.js:366469 | function | Parse JSON permission-update payloads from a frame. |
| `wBn` | `registerPermissionCallback` | cli_inner_pretty.js:366480 | function | Register a per-request permission callback (leader side). |
| `FDa` | `unregisterPermissionCallback` | cli_inner_pretty.js:366483 | function | Unregister a permission callback. |
| `UDa` | `hasPermissionCallback` | cli_inner_pretty.js:366486 | function | Predicate: is a permission callback registered for a request. |
| `jDa` | `clearPermissionCallbacks` | cli_inner_pretty.js:366489 | function | Clear all permission callbacks. |
| `Nlt` | `resolvePermissionCallback` | cli_inner_pretty.js:366492 | function | Resolve (invoke) the permission callback for a request id. |

### R11. Leader Permission Bridge

The worker→leader permission round-trip (`utils/swarm/leaderPermissionBridge.ts`, `permissionSync.ts`) plus the shared denied-message text constants.

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `HTp` | `generateRequestId` | cli_inner_pretty.js:387638 | function | Generate a permission-bridge request id. |
| `TUn` | `buildPermissionRequest` | cli_inner_pretty.js:387641 | function | Build a permission-request payload for the leader. |
| `WBa` | `getLeaderName` | cli_inner_pretty.js:387673 | function | Resolve the leader's display name. |
| `wUn` | `publishPermissionRequestToLeader` | cli_inner_pretty.js:387680 | function | Publish a worker's permission request up to the leader. |
| `CUn` | `sendPermissionResponseToWorker` | cli_inner_pretty.js:387706 | function | Send the leader's permission decision back down to the worker. |
| `Wte` | `PERMISSION_DENIED_MESSAGE` | cli_inner_pretty.js:590316 | constant | Permission-denied message text constant (decl @590316; the cited 590318 is off by ~2 lines — see manifest note). |
| `Mjt` | `USER_DENIED_PREFIX` | cli_inner_pretty.js:590318 | constant | User-denied prefix text constant (decl @590318; the cited 590322 is the `$ao` plan-rejection literal — see manifest note). |

### R12. Teammate Prompt & Tool-Gate

The teammate system-prompt addendum and the teammate-scoped `canUseTool` factory (`utils/swarm/teammatePromptAddendum.ts`).

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `Rdo` | `TEAMMATE_SYSTEM_PROMPT_ADDENDUM` | cli_inner_pretty.js:420704 | constant | The teammate system-prompt addendum string appended for spawned teammates. |
| `eDp` | `createTeammateCanUseTool` | cli_inner_pretty.js:420713 | function | Build a teammate-scoped `canUseTool` (routes permission through the leader bridge). |

### R13. In-Process Runner & Spawn Env

In-process runner registry + resume + inherited-env construction (`utils/swarm/inProcessRunner.ts`, `spawnTeammate.ts`).

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `Qjt` | `buildInheritedEnvVars` | cli_inner_pretty.js:421655 | function | Build the inherited env-var map passed to a spawned teammate. |
| `aDp` | `TEAMMATE_ENV_VARS` | cli_inner_pretty.js:421665 | variable | Module var: the set of env-var names a teammate inherits. |
| `lqa` | `registerInProcessTask` | cli_inner_pretty.js:422881 | function | Register an in-process teammate task in the registry. |
| `Z6a` | `getInProcessTeammateMeta` | cli_inner_pretty.js:433934 | function | Read an in-process teammate's metadata. |
| `eza` | `resumeInProcessTeammate` | cli_inner_pretty.js:433938 | function | Resume an in-process teammate from a resumable agent id. |
| `dLe` | `resumeAgentBackground` | cli_inner_pretty.js:434052 | function | Resume a background agent (shared resume path). |

### R14. Pane Backend Internals

tmux/iTerm2 `PaneBackend` internals — pane-creation locks, color mapping, split-output parsing (`utils/swarm/backends/TmuxBackend.ts`, `ITermBackend.ts`).

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `q5a` | `decoratePaneCreateError` | cli_inner_pretty.js:421839 | function | Decorate a pane-creation error with diagnostics. |
| `lDp` | `tmuxPaneCreationLock` | cli_inner_pretty.js:421846 | function | tmux pane-creation lock (serializes split-window calls; with module promise `W5a`). |
| `V5a` | `getTmuxColorName` | cli_inner_pretty.js:421854 | function | Map a teammate index to a tmux pane-border color name (color domain = its keys). |
| `cDp` | `itermPaneCreationLock` | cli_inner_pretty.js:422137 | function | iTerm2 pane-creation lock (with module promise `K5a`). |
| `Zjt` | `runIt2` | cli_inner_pretty.js:422145 | function | Run an `it2` (iTerm2 CLI) command. |
| `uDp` | `parseSplitOutput` | cli_inner_pretty.js:422148 | function | Parse `tmux split-window -P` output into a pane id. |
| `dDp` | `getLeaderSessionId` | cli_inner_pretty.js:422153 | function | Resolve the leader's session id (pane backend). |
| `Udo` | `ITermBackend` | cli_inner_pretty.js:422160 | class | iTerm2 `PaneBackend` class. |
| `yye` | `teammateSessionIds` | cli_inner_pretty.js:422248 | variable | Module var: set of known teammate session ids. |
| `l3n` | `firstPaneUsed` | cli_inner_pretty.js:422249 | variable | Module var: whether the first (leader) pane has been used. |

### R15. Backend Registry

The backend registry/state, register/lookup/factory helpers, and mode/executor resolution (`utils/swarm/backends/registry.ts`).

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `J5a` | `createBackendRegistry` | cli_inner_pretty.js:422279 | function | Create the backend-registry state object (`BackendRegistryState`). |
| `u3n` | `ensureBackendsRegistered` | cli_inner_pretty.js:422291 | function | Ensure both tmux and iTerm2 backends are registered in the registry. |
| `Fdo` | `registerTmuxBackend` | cli_inner_pretty.js:422299 | function | Register the tmux backend in the registry. |
| `jdo` | `registerITermBackend` | cli_inner_pretty.js:422302 | function | Register the iTerm2 backend in the registry. |
| `c3n` | `createTmuxBackend` | cli_inner_pretty.js:422305 | function | Factory: create a tmux backend instance. |
| `Q5a` | `createITermBackend` | cli_inner_pretty.js:422309 | function | Factory: create an iTerm2 backend instance. |
| `pDp` | `getTmuxInstallInstructions` | cli_inner_pretty.js:422383 | function | Return the tmux install-instructions string (shown when tmux missing). |
| `e3t` | `getBackendByType` | cli_inner_pretty.js:422405 | function | Look up a registered backend by type. |
| `fDp` | `getCachedBackend` | cli_inner_pretty.js:422413 | function | Get the cached/current backend. |
| `Gdo` | `getCachedDetectionResult` | cli_inner_pretty.js:422416 | function | Get the cached backend-detection result. |
| `mDp` | `getTeammateMode` | cli_inner_pretty.js:422422 | function | Resolve the configured teammate mode (registry view). |
| `ADp` | `getResolvedTeammateMode` | cli_inner_pretty.js:422440 | function | Resolve the effective teammate mode after auto-detection. |
| `Z5a` | `getInProcessBackend` | cli_inner_pretty.js:422443 | function | Get the in-process backend singleton. |
| `gDp` | `getTeammateExecutor` | cli_inner_pretty.js:422447 | function | Resolve the teammate executor (in-process vs pane). |
| `hDp` | `getPaneBackendExecutor` | cli_inner_pretty.js:422451 | function | Resolve the pane-backend executor for the current backend. |
| `qdo` | `resetBackendDetection` | cli_inner_pretty.js:422459 | function | Reset backend detection (clears caches in the registry). |

### R16. Spawn-Side Helpers

Spawn-path helpers feeding the leaf spawners `SDp`/`EDp`/`sqa` (`utils/swarm/spawnTeammate.ts`).

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `tqa` | `createTeammatePaneInSwarmView` | cli_inner_pretty.js:422487 | function | Spawn-side: create a teammate pane inside the swarm-view (delegate). |
| `nqa` | `enablePaneBorderStatus` | cli_inner_pretty.js:422490 | function | Spawn-side: enable the pane-border status line. |
| `Ydo` | `resolveTeammateModel` | cli_inner_pretty.js:422517 | function | Resolve the model a spawned teammate should run with. |
| `yDp` | `hasTmuxSession` | cli_inner_pretty.js:422533 | function | Predicate: does a given tmux session exist. |
| `_Dp` | `ensureExternalSwarmSession` | cli_inner_pretty.js:422536 | function | Ensure the external standalone swarm tmux session exists. |
| `iqa` | `resolveTeammateExecPath` | cli_inner_pretty.js:422546 | function | Resolve the teammate exec path (honors `CLAUDE_CODE_TEAMMATE_COMMAND`). |
| `aqa` | `buildInheritedCliFlags` | cli_inner_pretty.js:422550 | function | Build the inherited CLI flags forwarded to a spawned teammate. |
| `Xdo` | `reserveTeammateIdentity` | cli_inner_pretty.js:422572 | function | Reserve a unique teammate identity (name@team) before spawn. |
| `Jdo` | `updateMemberBackend` | cli_inner_pretty.js:422625 | function | Update a member's backend assignment in the team file. |
| `bDp` | `dedupeTeammateName` | cli_inner_pretty.js:422632 | function | De-duplicate a requested teammate name against existing members. |

### R17. Agent Tool Surface

Agent-tool description/output-schema/spawnability helpers complementing the already-listed `f3n`/`CDp`/`IDp`/`zao` (`tools/AgentTool/`).

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `Aqa` | `buildAgentToolDescription` | cli_inner_pretty.js:423136 | function | Build the Agent-tool description string (hides `name`/`mode` for teammates). |
| `xDp` | `agentOutputSchema` | cli_inner_pretty.js:423482 | constant | The Agent tool's output schema (memoized `we(() => ...)`). |
| `_ye` | `isTeammateSpawnableAgent` | cli_inner_pretty.js:472402 | function | Predicate: is an agent type spawnable as a teammate. |

### R18. SendMessage Handlers

SendMessage control-message handlers and helpers complementing the already-listed `p$p`/`o$p`/`r$p`/`i$p`/`rza` (`tools/SendMessageTool/`).

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `s$p` | `findTeammateColor` | cli_inner_pretty.js:434337 | function | Pick a stable display color for a teammate. |
| `p4n` | `getSenderName` | cli_inner_pretty.js:434353 | function | Resolve the sender's display name for a relayed message. |
| `a$p` | `handleShutdownRequest` | cli_inner_pretty.js:434391 | function | SendMessage handler: shutdown-request. |
| `l$p` | `handleShutdownApproval` | cli_inner_pretty.js:434402 | function | SendMessage handler: shutdown-approval. |
| `c$p` | `handleShutdownRejection` | cli_inner_pretty.js:434455 | function | SendMessage handler: shutdown-rejection. |
| `u$p` | `handlePlanApproval` | cli_inner_pretty.js:434464 | function | SendMessage handler: plan-approval. |
| `d$p` | `handlePlanRejection` | cli_inner_pretty.js:434490 | function | SendMessage handler: plan-rejection. |
| `d4n` | `inFlightTeammateResumes` | cli_inner_pretty.js:434540 | variable | Module var: in-flight teammate-resume `Map` (dedupes concurrent resumes). |

### R19. Task Notification

Task-notification queue helpers complementing the already-listed `G4e`/`Lye`/`YR` (`tasks/agentNotification.ts`).

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `gWe` | `queuePendingMessage` | cli_inner_pretty.js:445814 | function | Queue a pending message for delivery (notification path). |
| `lj` | `generateTaskId` | cli_inner_pretty.js:575439 | function | Generate a task id. |
