# Scout Dossier — Agent Team (the v2.1.178 implicit-team REDESIGN), v2.1.156 → v2.1.183

> Feature: **Agent Team / "swarm"** subsystem. Target bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines). Baseline docs diffed against: `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/30_agent_team/`.
>
> **Every obfuscated name below was re-derived in v2.1.183 by reading the declaration at the cited line.** The v2.1.156 obfuscated names (`R7`, `aA`, `jhH`, `rd`, `Oo`, …) DO NOT apply in v2.1.183 — they are re-mangled.

---

## 1. Executive summary

The headline change is real and confirmed at the source: **TeamCreate and TeamDelete are gone** (`grep -c` = 0 in v2.1.183; they were tools `rd`/`Oo` with defs `Th_`/`vh_` in v2.1.156). They are replaced by an **implicit, session-scoped team created at startup** by `initializeSessionTeam` (`j3f` @682765), gated on `Sl() && !xr() && !a.agentId` at the CLI bootstrap (@693472). The team name is now derived deterministically as `session-<sessionId[:8]>` (`sessionTeamName` `xic` @682752), and a team file + `teamContext` (leader = sole member `team-lead`) is written once at boot.

Teammate spawning moved entirely onto the **Agent tool**: when agent-swarms are enabled and the model passes a non-empty `name`, the Agent tool's `call` routes into the teammate spawn path (`cqa`→`HDp` @423041) instead of the ordinary subagent path. The routing predicate changed from v2.1.156's "team name resolved from the `team_name` parameter" (`if (G && z)`) to v2.1.183's "the session's implicit `teamContext` exists" (`if (_ && s && !L)`, where `_ = Sl() ? A.teamContext`). The `team_name` parameter is still in the schema but is documented **"Deprecated; ignored. The session has a single implicit team."** (@423458).

The **BackendRegistry / in-process-vs-pane split is fully carried over** (registry singleton `_F` @422467, `isInProcessEnabled` `rWe` @422425, `getTeammateMode` `Aje` @293813, detection `eLe` @422314, sticky fallback `Wdo` @422419). The **file mailbox is unchanged in structure** (`writeToMailbox` `$A` @365950 is byte-for-byte the same algorithm as `aA`), but the teams directory is `Gbe()` = `<configDir>/teams` (@735) — there is **no `.claude/teams` literal** anymore (it is assembled via `tr()` + `"teams"`).

Two v2.1.183 bug-fixes are located: (1) the **tmux spawn no longer types the command via `send-keys`** — it now creates the pane running a benign holding process `cat` (`Gke` @362642) and **`respawn-pane -k -- <cmd>`** replaces it with the real command directly (`a3n` @421874), which structurally fixes both the slow-rc-init race and the keystroke-leak. (2) the **background-task survival fix** surfaces in the task-notification machinery: a teammate task only "comes to rest" (and is eligible for eviction) when it has **no live background children**, enforced by the `keepaliveReasons`/`YR` keepalive system and a new explanatory `<note>` in `G4e` (@445826+).

Coordinator mode is **still live** (`isCoordinatorMode` `z9`/`oI` @221874, `getCoordinatorSystemPrompt` `bvd` @221940) and was substantially expanded (cross-session peers via `bridge:`/`uds:` addresses, a `StopAgent`-style worker-stop tool `uP`). The teammate system-prompt addendum (`TEAMMATE_SYSTEM_PROMPT_ADDENDUM` `Rdo` @420705) is verbatim-unchanged.

---

## 2. Verified anchor table

| Readable name | v2.1.183 obf | v2.1.183 line | v2.1.156 obf | One-line evidence (read at the cited line) |
|---|---|---|---|---|
| `isAgentSwarmsEnabled` / `isAgentTeamsEnabled` | `Sl` | 293832 | `R7` | `if (!st(process.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS) && !yqd()) return !1; if (!ct("tengu_amber_flint", !0)) return !1; return !0;` |
| `hasAgentTeamsCliFlag` | `yqd` | 293828 | `Ru5` | `return process.argv.includes("--agent-teams");` |
| `getTeamsDir` | `Gbe` | 735 | `RxH` | `return ker.join(tr(), "teams");` |
| `getInboxPath` | `v4e` | 365920 | `jhH` | `…_Bn.join(Gbe(), r, "inboxes"), i = _Bn.join(s, \`${o}.json\`)` |
| `ensureInboxDir` | `Kyp` | 365927 | `HD_` | `r = _Bn.join(Gbe(), n, "inboxes"); await ci().mkdir(r)` |
| `readMailbox` | `Fhe` | ~365933 | `h_H` | back-fills `s.type = "message"`; ENOENT→`[]`; SyntaxError tolerated |
| `writeToMailbox` | `$A` | 365950 | `aA` | pre-create `[]` (wx) → lock `iUt` → re-read `Fhe` → push `{...,type:"message",read:!1}` → atomicWrite |
| `LOCK_OPTIONS` | `iUt` | (used 365964) | `DG$` | spread into `$h(r,{lockfilePath,...iUt})` |
| `TEAM_LEAD_NAME` | `np` | 362636 | `tY` | `var np = "team-lead"` |
| `TEAMMATE_SYSTEM_PROMPT_ADDENDUM` | `Rdo` | 420705 | `jU6` | verbatim "# Agent Teammate Communication … you MUST use the SendMessage tool." |
| `createTeammateCanUseTool` (permission bridge) | `eDp` | 420713 | `OT_` | `return async (o,s,i,a,l,c)=>{ let u = c ?? await Kut(...); if (u.behavior!=="ask") return u; …}` |
| Agent tool name const | `vs` | (used 423515) | — | tool def `f3n = pi({ name: vs, … description(){return "Launch a new agent"} })` |
| Agent tool def | `f3n` | 423515 | (v2.1.156 def near 398354) | `pi({ … get inputSchema(){return zao()} … async call({…,name:s,team_name,mode:i,…}){…} })` |
| Agent input schema (merged) | `IDp` | 423446 | — | adds `name` (regex `pDa`, refine ≠ `LY`), `team_name` (deprecated/ignored), `mode` (`zts`) |
| Agent base input schema | `CDp` | 423432 | — | `{description,prompt,subagent_type,model,run_in_background}` |
| Reserved teammate name "main" | `LY` | 362512 | — | `var LY = "main"`; schema refine: `"main" is reserved — SendMessage routes it to the main conversation` |
| teammate-spawn entry (Agent→) | `cqa`→`HDp` | 423053 / 423041 | `aA4`→`…` | `cqa(e,t){return HDp(e,t)}`; `HDp` dispatches in-process/pane |
| spawn dispatcher (pane vs inproc) | `HDp` | 423041 | — | `if (rWe()) return sqa(...); … if (e.use_splitpane!==!1) return SDp(...); return EDp(...)` |
| in-process spawn | `sqa` | 422925 | `CW8` | sets `teamContext` lazily; member `np` if no `leadAgentId` yet |
| pane (cross-process) spawn | `SDp` | 422644 | (PaneBackendExecutor `L94`) | builds `cd … && env … --agent-id …`; throws if no `teamContext.teamName` |
| third spawn path (no splitpane) | `EDp` | 422762 | — | same "session team not initialized" guard |
| `initializeSessionTeam` (IMPLICIT TEAM) | `j3f` | 682765 | (n/a — was TeamCreate `Th_`) | writes team file + returns `teamContext{teamName, leadAgentId, teammates:{[r]:team-lead}}` |
| `sessionTeamName` | `xic` | 682752 | — | `` return `${B3f}-${e.slice(0,8)}` `` (`B3f="session"`) |
| inherited-team-name resolver | `F3f` | 682756 | — | reads `CLAUDE_INTERNAL_ASSISTANT_TEAM_NAME` once, then deletes the env var |
| `formatAgentId` | `bQ` | 103172 | `Ei` | `name@team` |
| team file path | `gte` | 362812 | `pa` | `<teamsDir>/<team>/team.json`-ish |
| read team file | `gj` / `Nhe` | 362815 / 362824 | `gZ` | reads/parses team config |
| `isInProcessEnabled` | `rWe` | 422425 | `ma` | `if (xr()) return !0; … "in-process"→!0; "tmux"→!1; else fallback/auto detect` |
| `getTeammateMode` (snapshot) | `Aje` | 293813 | (`NU6`/`teammateMode`) | returns `Hxe ?? UOt` (`UOt = "in-process"`) |
| backend detection | `eLe` | 422314 | `jLH` | tmux-inside → tmux backend; iTerm2 → iterm backend; emits `swarm_backend_detect` |
| mark in-process fallback | `Wdo` | 422419 | (sticky bit) | `e.inProcessFallbackActive = !0` |
| BackendRegistry singleton | `_F` | 422467 | `NS` | `_F = J5a()` |
| TmuxBackend class | `Ndo` | 421879 | `ZU6` | `type = "tmux"; createTeammatePaneInSwarmView; sendCommandToPane; killPane …` |
| ITermBackend method block | (class @422150+) | 422175 | `TU6` | `[ITermBackend] createTeammatePaneInSwarmView…` |
| tmux send-command primitive | `a3n` | 421874 | (`send-keys` path @380567) | `respawn-pane -k -t <pane> -- <cmd>` (NOT send-keys) |
| tmux holding command const | `Gke` | 362642 | — | `var Gke = "cat"` |
| `tmux` binary const | `B8` | 362640 | `uu` | `var B8 = "tmux"` |
| teammate cmd env override | `_lt` | 362643 | — | `"CLAUDE_CODE_TEAMMATE_COMMAND"` |
| in-process runner entry | `qut` | 421374 | (`startInProcessTeammate` `qeH`) | fire-and-forget `sDp(e).catch(...)` |
| in-process agent loop | `sDp` | 421006 | `runInProcessTeammate` `JT_` | per-turn `AbortController V`; idle notification on turn end |
| in-process poll interval | `ZLp` | 421380 | `fT_`=500 | `var ZLp = 500` |
| idle-notification deliver | `C5a` | (called 421269) | `$94` | `await C5a(agentName,color,team,{idleReason,summary})` |
| SendMessage tool name const | `zh` | 221450 | `cf` | `var zh = "SendMessage"` |
| SendMessage tool def | `p$p` | 434568 | `Bh_` | `pi({ name: zh, isEnabled(){return Sl()}, validateInput, call …})` |
| SendMessage input schema | `o$p` | 434558 | `Sh_` | `{to, summary?(max 200), message: string | (shutdown_request|shutdown_response|plan_approval_response)}` |
| SendMessage description const | `nza` | 434314 | — | `"Send a message to another agent"` |
| SendMessage prompt builder | `rza` | 434286 | `iO4` | compact markdown; `to` table incl. `"main" → main conversation (background subagents only)` |
| isCoordinatorMode | `z9` / `oI` | 221874 / 221870 | (`oI`/coordinator) | `oI(){ if(!st(env.CLAUDE_CODE_COORDINATOR_MODE)) return !1; …}` |
| getCoordinatorSystemPrompt | `bvd` | 221940 | (round-6 reintro) | "You are Claude Code, an AI assistant that orchestrates … coordinator." |
| coordinator mode-switch | `yvd` (matchSessionMode) | 221898 | — | emits `tengu_coordinator_mode_switched` |
| task-notification builder (bg-survival note) | `G4e` | 445826 | — | `<note>A task-notification fires each time this agent comes to rest with no live background children of its own…</note>` |
| keepaliveReasons getter | `Lye` | 445750 | (`hRH` @435417) | `return e.keepaliveReasons ?? new Set()` |
| completed-but-kept-alive predicate | `YR` | 445754 | — | `return e.status === "completed" && Lye(e).size > 0` |
| background-task owner | `ownerAgentId` (field) | 371559 / 445897 | `ownerAgentId` | `s.ownerAgentId === e` owner predicate for reaping notifications |

---

## 3. Confirmed deltas

### 3.1 TeamCreate / TeamDelete tools REMOVED

**v2.1.183 evidence:** `grep -c "TeamCreate"` = 0, `grep -c "TeamDelete"` = 0 over the whole bundle. The assets dir has **no** `assets/tools/TeamCreate.md` / `TeamDelete.md` (only `Agent.md`, `SendMessage.md`, `Task*.md`).

**Before (v2.1.156):** baseline `mailbox_and_lifecycle_tools.md` §4.1/§4.2 documents `TeamCreate` (name const `rd` @216438, def `Th_` @406631, schema `Gh_`, prompt `RO4`) and `TeamDelete` (name const `Oo` @216439, def `vh_` @406775). In v2.1.156's bundle both grep > 0. `TeamCreate.call` wrote the team file + task dir + leader membership and emitted `tengu_team_created`; `TeamDelete.call` refused while teammates active and emitted `tengu_team_deleted`.

**Corroboration:** `grep "tengu_team_created"` / `tengu_team_deleted` = 0 in v2.1.183 (both present in v2.1.156). Confidence: **high**.

### 3.2 Implicit, session-scoped team created at STARTUP (`initializeSessionTeam` `j3f`)

**v2.1.183 evidence (CLI bootstrap @693472):**
```js
if (Sl() && !xr() && !a.agentId)
  try {
    let { initializeSessionTeam: Jn } = await Promise.resolve().then(() => (Lic(), kic));
    c = await Jn();
  } catch (Jn) { De(Jn); }
```
`initializeSessionTeam` (`j3f` @682765):
```js
async function j3f(e) {
  let t = e?.existingTeamName || F3f(),
      n = t ?? xic(xt()),            // session-<sessionId[:8]>
      r = bQ(np, n),                 // team-lead@<team>
      o = gte(n);
  if (!(t ? await Nhe(n) : null)) {
    let l = { name:n, createdAt:Date.now(), leadAgentId:r, leadSessionId:xt(),
              members:[{ agentId:r, name:np, agentType:np, joinedAt:Date.now(),
                         tmuxPaneId:"leader", cwd:Ar(), subscriptions:[], backendType:"in-process" }] };
    await pBn(n, l).catch((c) => dBn(n, c));   // write team file
  }
  …
  return { teamContext:{ teamName:n, teamFilePath:o, leadAgentId:r,
                         teammates:{ [r]:{ name:np, agentType:np, color:a, tmuxSessionName:"in-process",
                                           tmuxPaneId:"leader", cwd:Ar(), spawnedAt:Date.now() } } },
           teammateColors:{ assignments:new Map([[r,a]]), index:1 } };
}
```
`sessionTeamName` (`xic` @682752): `` return `${B3f}-${e.slice(0,8)}` `` with `B3f = "session"`. The spawn paths (`SDp`/`EDp`/`sqa`) now throw `"Internal error: session team not initialized. This should have happened at startup when agent swarms are enabled."` (@422659, 422777, 422939) if `teamContext.teamName` is missing — proving the team is expected to exist before any spawn.

**Before (v2.1.156):** no startup team. The team only existed after the model called `TeamCreate`, which is what wrote the team file and set `teamContext`. The team name came from the model's `team_name` argument. Confidence: **high**.

### 3.3 Agent-tool teammate-spawn routing changed: `team_name` param → implicit `teamContext`

**v2.1.183 evidence (Agent `call`, @423547-423591):**
```js
let _ = Sl() ? A.teamContext : void 0,
    b = !!c.teammateContext;
if ((b || !!l1e()) && s) throw new oWe("Teammates cannot spawn other teammates …");
…
let L = x && I;                         // L = is-fork
if (_ && s && !L) {                     // swarm on + name given + not a fork  ⇒ TEAMMATE
  …
  let ye = await cqa({ name:s, prompt:e, description:n, use_splitpane:!0,
                       plan_mode_required: i === "plan",
                       model: m ?? (de ? zhe(de,c.options.mainLoopModel) : void 0),
                       agent_type:t, invokingRequestId:d?.requestId }, c),
      me = { status:"teammate_spawned", prompt:e, ...ye.data };
  return (Le("subagent_launch"), { data: me });
}
```
The schema (`IDp` @423446):
```js
name: H.string().regex(pDa,{…}).refine((t)=>t!==LY,{message:`"main" is reserved — SendMessage routes it to the main conversation`}).optional()
       .describe("Name for the spawned agent. Makes it addressable via SendMessage({to: name}) while running."),
team_name: H.string().optional().describe("Deprecated; ignored. The session has a single implicit team."),
mode: zts().optional().describe('Permission mode for spawned teammate (e.g., "plan" to require plan approval).'),
```

**Before (v2.1.156)** (Agent `call` @398384-398396):
```js
if (A && !R7()) throw Error("Agent Teams is not yet available on your plan.");
let G = oN_({ team_name: A }, L);     // team resolved FROM the team_name parameter A
if (FA() && G && z) throw …nested…;
if (G && z) {                          // resolved-team-name + name  ⇒ TEAMMATE
  let fH = await aA4({ name:z, prompt:H, description:q, team_name:G, use_splitpane:!0, … }, M);
  return { data:{ status:"teammate_spawned", prompt:H, ...fH.data } };
}
```
So the v2.1.156 routing key was the **`team_name` parameter** (resolved via `oN_`), which the model had to pass (and which corresponded to a team set up by `TeamCreate`); v2.1.183 routing key is the **session's implicit `teamContext`** and `team_name` is ignored. Confidence: **high**.

### 3.4 tmux teammate spawn no longer uses `send-keys` (slow-rc-init + keystroke-leak fix)

**v2.1.183 evidence:** the pane is created running a holding process and the command is injected by replacing the pane's process, not by typing:
```js
// TmuxBackend.createTeammatePaneWithLeader (@422036): split-window … -- Gke   (Gke="cat")
i = await kj(["split-window","-d","-t",n,"-h","-l","70%","-P","-F","#{pane_id}","--",Gke]);
// a3n (@421874): inject the real command into that pane
async function a3n(e, t, n) {
  await Fn(B8,[...e,"set-option","-p","-t",t,"remain-on-exit","failed"]);
  let r = await Fn(B8,[...e,"respawn-pane","-k","-t",t,"--",n]);   // respawn = exec, no shell typing
  if (r.code !== 0) throw new sF(`Failed to send command to pane ${t}: ${r.stderr}`);
}
```
`Gke = "cat"` (@362642). `sendCommandToPane` (@421900) control-char-checks the command (`Slt`) then calls `a3n`.

**Before (v2.1.156):** `TmuxBackend.sendCommandToPane` (@380566-380567):
```js
async sendCommandToPane(H, $, q = !1) {
  let _ = await (q ? BE : kS)(["send-keys", "-t", H, $, "Enter"]);   // types the command into the pane's shell
  …
}
```
i.e. v2.1.156 launched the teammate by *typing* `cd … && env … claude --agent-id …` into the pane's interactive shell and pressing Enter — exactly the path vulnerable to (a) the shell's rc-file still initializing (the typed line races shell readiness) and (b) keystrokes typed during spawn landing in the same shell line. v2.1.183's `respawn-pane … -- <cmd>` executes the command as the pane's process directly (no interactive shell line), eliminating both. Confidence: **high** (mechanism is structurally the fix; the changelog wording matches exactly).

### 3.5 Background tasks survive a teammate finishing its turn (keepalive + new `<note>`)

**v2.1.183 evidence:** the task-notification builder `G4e` (@445826) gates re-invocation on the owner still being alive and adds an explicit explanation:
```js
let m = f ? o.get(f) : void 0,
    g = (od(m) && YR(m) && !xr()) || (od(m) && m.status === "running");   // owner alive/parked?
…
`<note>A task-notification fires each time this agent comes to rest with no live background children of its own. The user can send it another message and resume it, so the same task-id may notify more than once.</note>`
```
`YR` (@445754): `status === "completed" && Lye(e).size > 0` — a *completed* task is kept alive ("parked") while it still has keepalive reasons (live children). `keepaliveReasons` are added/removed by `Lye`-keyed helpers (@445780+, predicate `s.ownerAgentId === e` @445897). The in-process runner (`sDp` @421006) ends a turn by setting the task `isIdle:!0` and clearing only the *per-turn* `currentWorkAbortController` (@421247), not the children.

**Before (v2.1.156):** the `keepaliveReasons` field and `parked` status existed (`hRH` @435417, `status==="completed" && hRH(H).size>0 → "parked"` @435426), but there is **no** "no live background children" note and the notification path did not carry the new owner-alive gate / explanatory framing. The changelog ("Fixed background tasks started by a teammate being killed when the teammate finishes a turn") indicates the *behavioral* bug was that a teammate finishing its turn tore down its background children; the fix wires the children's keepalive into the teammate's rest/eviction decision. Confidence: **medium** (the keepalive infrastructure is shared and pre-existing; the precise one-line behavior fix is hard to isolate from the surrounding refactor — flagged in Open Questions).

### 3.6 SendMessage prompt rewritten; `message` union trimmed; `"main"` recipient added; cross-session `bridge:`/`uds:` addressing

**v2.1.183 evidence:** `rza` (@434286) is a terse markdown prompt with a recipient table:
```
| `to` | |
| `"researcher"` | Teammate by name |
| `"main"`       | The main conversation (background subagents only) |
```
`validateInput` (@434611) keeps the broadcast rejection (`to:"*"` → "broadcast (to: \"*\") is no longer supported — send a message per recipient") and the `@` rejection ("there is only one team per session"), and **adds** new socket-address validation:
```js
let n = LLa(e.to);
if ((n.scheme === "bridge" || n.scheme === "uds") && n.target.trim().length === 0) return …"address target must not be empty"…;
if (!Lhe(n.target) || !Lhe(e.to)) return …`'${e.to}' is not a local socket address. Use an address from ${Gtt}.`…;
```
The schema's model-facing `message` union (`r$p` @434539) is only `{shutdown_request | shutdown_response | plan_approval_response}` — `team_permission_update` / `mode_set_request` are no longer model-facing union members.

**Before (v2.1.156):** baseline §4.3 — prompt `iO4` was prose; `to:"*"` already rejected; the broadcast/`@` rules existed. There was **no** `bridge:`/`uds:` cross-session addressing and no `"main"` recipient. Confidence: **high** for the additions; **medium** that the union trim is a real removal vs. just a different surface (the control-message *type set* `isControlMessage` still lists `team_permission_update`/`mode_set_request` for the protocol — they're just not model-submittable).

### 3.7 Agent tool gained nested-teammate / background guards & "main" reserved name

**v2.1.183 evidence (Agent `call` @423548-423564):**
- `if ((b || !!l1e()) && s) throw "Teammates cannot spawn other teammates — the team roster is flat."` (`b = !!c.teammateContext`).
- `if (b && o === !0) throw "In-process teammates cannot spawn background agents."` and a second variant for `P.background===!0` (@423655).
- `em()` (@103466) — "is this session a teammate" — used in the Agent description to hide `name`/`mode` ("teammates cannot spawn teammates").
- `LY = "main"` (@362512) reserved; the Agent `name` schema refines it out.

**Before (v2.1.156):** the nested-teammate guard existed (`if (FA() && G && z) throw …`) and the in-process-background guard existed, but they keyed off `FA()`/`mG()` + the resolved `team_name`. The `"main"` reserved name + `LY` did not exist (that is the new SendMessage "main conversation" routing for background subagents). Confidence: **high** for `"main"`; **medium** for the guard refactor (same intent, re-expressed against `teammateContext`).

### 3.8 Coordinator mode expanded (cross-session peers, worker-stop tool)

**v2.1.183 evidence:** `bvd` (@221940) lists tools `${vs}` (Agent/Spawn), `${zh}` (SendMessage/continue), **`${uP}` (Stop a running worker)**, and a whole **cross-session peers** section: `uds:` for same-machine, `bridge:` for cross-machine Remote Control; "Incoming peer messages arrive as user-role messages wrapped in `<cross-session-message from="...">`". `oI`/`z9` (@221870/221874) is the gate (`CLAUDE_CODE_COORDINATOR_MODE`).

**Before (v2.1.156):** coordinator mode was a re-introduction (round-6 finding) but did not include the cross-session `bridge:`/`uds:` peer machinery or the explicit worker-stop tool in its prompt. Confidence: **medium** (coordinator prompt text should be diffed line-by-line in the writing phase).

---

## 4. Unchanged carryover (link to v2.1.156, do NOT re-document)

- **File mailbox algorithm** — `writeToMailbox` (`$A` @365950) is the same pre-create→lock→re-read→push→atomicWrite as v2.1.156 `aA`; `readMailbox` (`Fhe`) same back-fill/ENOENT/SyntaxError handling; `getInboxPath`/`ensureInboxDir` same `<teamsDir>/<team>/inboxes/<agent>.json` shape. The *only* structural note: the teams root is `Gbe()` = `tr()+"teams"` (config dir), with no `.claude/teams` literal. Link baseline `mailbox_and_lifecycle_tools.md` §1.
- **TEAMMATE_SYSTEM_PROMPT_ADDENDUM** — `Rdo` @420705 is verbatim identical to v2.1.156 `jU6`. Link baseline §5.
- **BackendRegistry two-mode split** — registry singleton `_F`, `isInProcessEnabled` (`rWe`), backend detection (`eLe`), tmux/iTerm2 backends, in-process AsyncLocalStorage runner (`sDp`), 500 ms poll (`ZLp`). The *abstraction* is unchanged; only the `send-keys`→`respawn-pane` spawn mechanic changed (§3.4). Link baseline `execution_modes_and_backend_registry.md`, `in_process_mode.md`, `cross_process_mode.md`.
- **Permission bridge** — `createTeammateCanUseTool` (`eDp` @420713) same "ask → interactive dialog OR mailbox permission_request/response poll" design. Link baseline §6.
- **Master gate semantics** — `Sl` @293832 is byte-identical to v2.1.156 `R7`: `(env CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS || --agent-teams) && growthbook("tengu_amber_flint", true)`. Only the obf name changed. Link baseline §4 gate box.
- **Shutdown / idle / permission control-message types** — the `isControlMessage` type set (permission_request/response, sandbox_*, shutdown_request/approved, team_permission_update, mode_set_request, plan_approval_*) and their builders/parsers (`createShutdownRequestMessage` etc., exported around @365900) are present and structurally the same. Link baseline §3.
- **`tengu_coordinator_mode_switched`** event and `getCoordinatorSystemPrompt` existence (the *fact* that coordinator mode is live) — carryover from the v2.1.156 round-6 re-introduction; only the prompt content expanded (§3.8).

---

## 5. Open questions / low-confidence items

1. **Exact code line of the bg-task survival fix (§3.5).** The keepalive (`keepaliveReasons`/`YR`/`Lye`) infra pre-exists v2.1.156. The behavioral fix is most likely a small change in how a teammate's turn-end (`sDp` idle path @421252-421269) or task eviction (`evictAfter`/`zGe`) consults child keepalive before tearing down — but I could not isolate the one-line diff vs v2.1.156 with certainty. The new `<note>` text and the owner-alive gate `g` in `G4e` (@445826) are the strongest fingerprints; the writer should diff `sDp`/`G4e`/the eviction reducer (@439118+) against v2.1.156 `JT_` + its notification path.
2. **`mode` param schema `zts`** (@423448) — I did not read its declaration; it is the permission-mode enum for spawned teammates (`"plan"` etc.). Confirm whether `mode` is new in the Agent schema vs v2.1.156 (v2.1.156 Agent `call` already destructured `mode: Y`, so it likely pre-exists).
3. **`EDp` (third spawn path, @422762)** — `HDp` dispatches `sqa` (in-process) / `SDp` (splitpane) / `EDp` (`use_splitpane === !1`). I read `SDp` and `sqa` fully but only the guard head of `EDp`. Confirm what a non-splitpane pane spawn does (likely a single-pane/non-swarm-view variant).
4. **`team_name` telemetry vs param.** `team_name` appears in many telemetry-shape sites (@144082, 144327, 576924); these are *event fields*, not the Agent tool param. Writer should not conflate them.
5. **SendMessage `message` union trim (§3.6).** Need to confirm whether `team_permission_update`/`mode_set_request` were ever in the v2.1.156 *model-facing* SendMessage union or only in the internal control-message set; if the latter, the "trim" is not a real delta.
6. **`F3f`/`CLAUDE_INTERNAL_ASSISTANT_TEAM_NAME`** (@682756) — an internal env var that lets a spawned teammate inherit a parent team name (one-shot, deleted after read). Worth a sentence in the implicit-team doc; confirm who sets it (likely the pane CLI builder `--team-name`).

---

## 6. Proposed docs (for the writing phase)

Target module dir: `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.183/analyze/30_agent_team/`

| Filename | Purpose |
|---|---|
| `README.md` | Index + the v2.1.178 REDESIGN framing: TeamCreate/TeamDelete removed, implicit session team, Agent-tool-as-spawner. State up-front which v2.1.156 docs carry over unchanged (mailbox, addendum, backend registry, permission bridge) and link them rather than re-deriving. |
| `implicit_team_and_agent_tool_spawn.md` | **The centerpiece.** `initializeSessionTeam` (`j3f`) at startup (`session-<id[:8]>` naming, team-file write, leader-only roster), the CLI bootstrap gate (@693472), and the Agent-tool routing rewrite (`_ = Sl() ? A.teamContext` + `if (_ && s && !L)` → `cqa`/`HDp`), the deprecated-but-accepted `team_name` param, `name`/`mode` schema, `"main"` reserved name, nested-teammate/background guards. Include the v2.1.156 before-picture (`team_name`-param routing + TeamCreate). |
| `spawn_backends_and_tmux_fix.md` | The carried-over BackendRegistry two-mode split (brief, linking baseline) PLUS the v2.1.183 tmux fix in depth: `send-keys`→`respawn-pane -k -- <cmd>` with the `cat` holding process (`Gke`), why this fixes slow-rc-init + keystroke-leak. Dual-version snippet of `sendCommandToPane`/`a3n` vs v2.1.156. |
| `mailbox_lifecycle_and_sendmessage_delta.md` | Short delta doc: mailbox unchanged (link baseline), SendMessage prompt rewrite + `bridge:`/`uds:` cross-session addressing + `"main"` recipient + schema union, and the removal of the TeamCreate/TeamDelete lifecycle tools. |
| `coordinator_and_background_survival.md` | Coordinator-mode expansion (cross-session peers, worker-stop tool `uP`, `bvd` prompt) and the background-task survival fix (keepalive `YR`/`Lye`, the new `<note>`), with the open-question caveat about the exact fix line. |

---

*Dossier generated by re-reading every cited declaration in v2.1.183 `cli_inner_pretty.js`; v2.1.156 obfuscated names taken from baseline docs and re-verified in the v2.1.156 bundle where cited.*
