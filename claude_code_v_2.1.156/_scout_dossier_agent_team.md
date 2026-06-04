# Scout Dossier — Agent Team (Swarm) for v2.1.156

> Working scratch for the `30_agent_team/` module build. Every anchor below was
> read directly from `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
> (the 2.1.156 bundle, 649,979 lines). All line numbers are **verified** by direct Read.
> Cross-validation ground truth = `/lyz/codespace/3rd/claude-code/src` (named TS, ~v2.1.83–88).
> Format/depth reference = `claude_code_v_2.1.142/analyze/30_agent_team/`.

## SCOPE (what the user asked for)
Focus **only** on the **agent team** subsystem and its **two execution modes**:
1. **in-process** — teammate runs as an async task in the SAME `claude` Node process, isolated by `AsyncLocalStorage`.
2. **cross-process** — teammate runs as a SEPARATE `claude` process inside a tmux pane or iTerm2 split (the "pane backends").

The subsystem is internally named **"swarm"** (telemetry `swarm_*`, error text "agent swarms"). 2.1.142 called it "agent team". Same thing.

> ⚠️ Do NOT re-document the daemon/background-agent fleet (`36_background_agents/`) — that is a DIFFERENT worker model (daemon-supervised child processes). Agent team = in-process + tmux/iterm2 panes, leader-owned, dies with the leader REPL.

---

## THE TWO MODES AT A GLANCE

```
                       BackendRegistry (NS / y94)  cli_inner_pretty.js:380912-381117
                                     │
              getTeammateExecutor(preferInProc, reg)  NT_  @381098
                                     │
                 isInProcessEnabled(reg)?  ma  @381076
                  ┌──────────────────┴───────────────────┐
                YES                                       NO
                  │                                       │
         getInProcessBackend  S94 @381094       getPaneBackendExecutor  ET_ @381102
                  │                                       │
         InProcessBackend  K94 @380062          PaneBackendExecutor  L94 @380388
         type="in-process"                      wraps a PaneBackend:
                  │                              ┌─ TmuxBackend   ZU6 @380545 type="tmux"
         spawn → spawnInProcessTeammate          └─ ITermBackend  TU6 @380820 type="iterm2"
                  CW8 @381458                              │
                  ↓                              spawn → createTeammatePaneInSwarmView
         startInProcessTeammate qeH @380016               + sendCommandToPane(send-keys)
                  ↓                                        + spawns a NEW `claude` process
         runInProcessTeammate JT_ @379714                 (cd … && env … claude --agent-id …)
         (agent loop + poll loop DT_ @379637)
```

Both modes share the **file mailbox** (`writeToMailbox` `aA` @338306) as the universal IPC and the **same TeamCreate/TeamDelete/SendMessage toolset**.

---

## GATE & ENABLEMENT
- `Ru5` @240763 — `hasAgentTeamsFlag`: `process.argv.includes("--agent-teams")`.
- `R7` @240766 — `isAgentTeamsEnabled`: returns false unless (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` truthy OR `--agent-teams`) AND GrowthBook gate `tengu_amber_flint` (`V$("tengu_amber_flint", !0)`). **This is THE master gate.**
- `FA` @99280 — `isTeammate` (is the current process itself a teammate). Used e.g. @240785 `R7() && FA()` → disable prompt suggestions for teammates.
- Env var name literal `"CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS"` @282209 (config passthrough list) and set @380337 (`WT$`) for spawned panes.
- Coordinator mode: `cI` @216440 gate (`CLAUDE_CODE_COORDINATOR_MODE`), `isCoordinatorMode`/`matchSessionMode` in module `Bx` @240... — **INVESTIGATE whether live or dead in 2.1.156** (2.1.142 doc says coordinator mode removed). Grep `CLAUDE_CODE_COORDINATOR_MODE`.

## TEAMMATE MODE (auto / tmux / in-process)
- Enum `PEq` @49109 = `["auto", "tmux", "in-process"]`. Used in zod control schema @51948-51952 (`.describe("How spawned teammates execute (tmux, in-process, auto)")`).
- Config key `"teammateMode"` default `"auto"` — read @380291 (`Q1("teammateMode","auto").value`), settings UI @462849-462858, @148216.
- CLI `--teammate-mode <mode>` → `setCliTeammateModeOverride` (`LT_` @380280) wired @644830; control-schema validation @646536 (`q==="auto"||"tmux"||"in-process"`).
- **teammateModeSnapshot module** `PU6` @380272: `captureTeammateModeSnapshot` (`D94` @380289), `getTeammateModeFromSnapshot` (`JSH` @380293, default "auto"), `getCliTeammateModeOverride` (`XU6` @380283), `clearCliTeammateModeOverride` (`LU6` @380286), `setCliTeammateModeOverride` (`LT_` @380280). Snapshot slots `DSH`/`PT$` @380298-380299.

---

## DOC 1 — execution_modes_and_backend_registry.md  (THE CORE)

### BackendRegistry — module `R94` @380912, factory `y94` @380930
Registry state shape (`y94` @380930): `{cachedBackend, cachedDetectionResult, backendsRegistered, cachedInProcessBackend, cachedPaneBackendExecutor, inProcessFallbackActive, TmuxBackendClass, ITermBackendClass}`. Global singleton `NS` @381118 (= `y94()` @381129).

Exports map (`X$(R94,{…})` @380913-380929):
- `resetBackendDetection` `EU6` @381110
- `registerTmuxBackend` `GU6` @380950 / `registerITermBackend` `VU6` @380953
- `markInProcessFallback` `kU6` @381070
- `isInProcessEnabled` `ma` @381076  ← **decision fn**
- `globalBackendRegistry` `NS`
- `getTeammateExecutor` `NT_` @381098  ← **dispatch fn**
- `getResolvedTeammateMode` `NU6` @381091 (`ma()?"in-process":"tmux"`)
- `getInProcessBackend` `S94` @381094 (memoized `_94()`=`new K94()`)
- `getCachedDetectionResult` `vU6` @381067 / `getCachedBackend` `YeH` @381064
- `getBackendByType` `LSH` @381056
- `ensureBackendsRegistered` `AeH` @380942 (lazy-imports TmuxBackend module `V94`/`v94`, ITermBackend module `N94`/`E94`)
- `detectAndGetBackend` `jLH` @380965  ← **detection fn**
- `createBackendRegistry` `y94`

### Detection algorithm `detectAndGetBackend` `jLH` @380965-381033
1. `ensureBackendsRegistered`. If cached detection → return it.
2. `$ = await Ga()` (insideTmux async), `q = h6H()` (inITerm2 sync).
3. **insideTmux** → select TmuxBackend (`BW8` @380956 `new TmuxBackendClass()`), `isNative:true`. emit `swarm_backend_detect`.
4. **inITerm2** → if `preferTmuxOverIterm2` (`w94` @380261) skip iTerm2; else check it2 CLI (`MG$`): available → ITermBackend (`h94` @380960), `isNative:true`. Else tmux fallback (`kXH` available) → TmuxBackend `isNative:false, needsIt2Setup`. Else THROW "iTerm2 detected but it2 CLI not installed…".
5. **neither** → tmux available (`kXH`) → TmuxBackend `isNative:false` (external session). Else THROW `vT_()` install-tmux help (@381034, per-OS: macos brew / linux apt-dnf / windows WSL).

### isInProcessEnabled `ma` @381076-381090  ← **the in-process-vs-cross-process switch**
```
if (R6()) return true                       // R6 = isNonInteractiveSession → ALWAYS in-process
let mode = JSH()                            // getTeammateModeFromSnapshot (kT_ @381073 wraps it)
if (mode === "in-process") return true
if (mode === "tmux") return false
// mode === "auto":
if (reg.inProcessFallbackActive) return true   // a pane backend already failed → fall back
return !insideTmux(MhH) && !inITerm2(h6H)       // auto → in-process UNLESS in a pane env
```
- `R6` = isNonInteractiveSession. `MhH` = isInsideTmuxSync, `h6H` = isInITerm2(sync). `kT_` @381073 = `JSH()`.

### Dispatch `getTeammateExecutor` `NT_` @381098
```
async NT_(preferInProcess=false, reg=NS):
  if (preferInProcess && ma(reg)) return getInProcessBackend(reg)   // S94
  return getPaneBackendExecutor(reg)                                // ET_
ET_ @381102: memoize cachedPaneBackendExecutor = createPaneBackendExecutor(detectAndGetBackend().backend)  // P94(backend) = new L94(backend)
```

### TeammateExecutor interface (both K94 and L94 implement)
`type`, `setContext(ctx)`, `isAvailable()`, `spawn(opts)→{success,agentId,taskId?,error?,paneId?}`, `sendMessage(agentId,{text,from,color,timestamp})`, `terminate(agentId,reason)`, `kill(agentId)`, `isActive(agentId)`.

### 2.1.88 ground truth
`src/utils/swarm/backends/registry.ts` (isInProcessEnabled @351, getResolvedTeammateMode @396, getInProcessBackend @404, markInProcessFallback @326, getBackendByType @295, getCachedBackend @308, getCachedDetectionResult @317, registerTmuxBackend @85, registerITermBackend @93, resetBackendDetection @457). `detection.ts` (isInsideTmuxSync @36, getLeaderPaneId @66, isInITerm2 @90, IT2_COMMAND @109). `teammateModeSnapshot.ts` (all 5 fns). `types.ts` (isPaneBackend @309). `PaneBackendExecutor.ts` (createPaneBackendExecutor @350).

---

## DOC 2 — in_process_mode.md

### InProcessBackend class `K94` @380062-380171  (factory `_94` @380172)
- `type="in-process"`, `context=null`, `setContext`.
- `isAvailable()` → always `true` @380068.
- `spawn(H)` @380071: requires context; calls `CW8` (spawnInProcessTeammate) → on success fires `qeH` (startInProcessTeammate) with full identity/context; returns `{success,agentId,taskId,abortController,error}`.
- `sendMessage(H,$)` @380122: parse agentId (`TY$`), `aA(agentName,{text,from,color,timestamp},teamName)` (mailbox write).
- `terminate(H,$)` @380134: build `createShutdownRequestMessage` (`VsH` @338516), `aA` shutdown to mailbox, `requestTeammateShutdown` (`xW8`).
- `kill(H)` @380151: `killInProcessTeammate` (`bW8` @381513).
- `isActive(H)` @380160: task.status==="running" && !aborted.

### spawnInProcessTeammate `CW8` @381458-381512
- `O = Ei(name,teamName)` (formatAgentId, @98997), `M = yE("in_process_teammate")` (new taskId).
- `j = C4()` (AbortController), `w = E$()` (parentSessionId), build identity `D`, teammate context `J = cUH({…})`.
- if `p5H()` → `uY8(O,name,w)` (register agent-id mapping).
- Build task state `L`: `{type:"in_process_teammate", status:"running", identity, prompt, model, abortController, awaitingPlanApproval:false, spinnerVerb, permissionMode: uU6(T6($).mode, planModeRequired), isIdle:false, shutdownRequested:false, pendingUserMessages:[], messages:[], …}`.
- `f.register(L)` (taskRegistry), emit `swarm_in_process_spawn`. Returns `{success,agentId,taskId,abortController,teammateContext}`.

### startInProcessTeammate `qeH` @380016 — fire-and-forget `JT_(H).catch(...)`.

### runInProcessTeammate `JT_` @379714-380015 — THE agent loop
- Destructures config (identity, taskId, prompt, agentDefinition, teammateContext, toolUseContext, abortController, model, systemPrompt, systemPromptMode, allowedTools, allowPermissionPrompts, standalone).
- Builds agent context `Z` (agentId/parentAgentId/parentSessionId/agentName/teamName/agentColor/agentType:"teammate"/invocationKind:"spawn").
- System prompt assembly @379749: if mode `replace`→use given; else base tools prompt + **`jU6`** (teammate addendum) + custom agent `getSystemPrompt()` + `append` extra. Logs `tengu_agent_memory_loaded` if `z.memory`.
- agentDefinition `G` @379764: `whenToUse:"In-process teammate: <name>"`, `tools: z?.tools ? aq([...z.tools, cf,rd,Oo,SL,nd,Y0,rT]) : ["*"]` (SendMessage/TeamCreate/TeamDelete/Task* always injected), `permissionMode:"default"`.
- Initial prompt wrapped via `wU6("team-lead", prompt, undefined, description)` (XML `<teammate_id=…>` envelope, `wU6` @379576, tag `_Z`).
- **Main while-loop** @379782 `while(!aborted && !done)`:
  - Compaction check @379790: if `jJ(V,…) > DU6(model, autoCompactWindow)` → `_eH(...)` compact, catch PreCompact-hook-blocked (`KeH`).
  - Runs the agent generator `WS({agentDefinition:HH, promptMessages, toolUseContext, canUseTool: OT_(...), isAsync:true, isTeammate:true, model, allowedTools, …})` @379836 inside `$o$(teammateContext, …)` (ALS) and `Lg(Z, …)` (agent-id ALS).
  - Updates task state per stream event (progress, messages, inProgressToolUseIDs).
  - On idle → `$94(agentName,color,teamName,{idleReason, summary:TG$(V)})` (notifyTeamLeadIdle @379595) unless duplicate.
  - Waits for next via `DT_` (poll loop) → handles `shutdown_request` / `new_message` / `aborted`.
- On exit: mark task completed/failed/killed, emit `swarm_in_process_run` (or `compact_blocked_by_hook` / `agent_loop_failed`).

### Poll loop `DT_` @379637-379713 — PRIORITY ORDER (THE 6-priority order)
`POLL_INTERVAL_MS` = `fT_` @380022 = **500**. While !aborted:
1. **`pendingUserMessages`** (in-app direct messages injected by leader) — highest. Pop first, return `{type:"new_message", from:"user"}`.
2. **`shutdownRequested` flag** (+ standalone `A`) → `{type:"aborted"}`.
3. sleep 500ms (`g8(500)`), re-check abort.
4. if standalone (`A`) `continue` (standalone teammates skip mailbox).
5. **Mailbox shutdown request** — scan unread (`h_H` readUnreadMessages @338286), `NXH` (isShutdownRequest @338554) detects → prioritized over N unread → `{type:"shutdown_request"}`, markRead (`JG$` @338333).
6. **Mailbox message from team-lead (`tY`="team-lead" @336140)** preferentially, else any unread → `{type:"new_message", from, color, summary}`, markRead.
7. **Task-list auto-claim** `q94` @379617 (`checkTaskListForClaim`): `jT_` @379599 finds next pending unblocked unowned task, `gD7` claims it, returns `wT_` @379607 prompt ("Complete all open tasks. Start with task #…").

### AsyncLocalStorage identity isolation
- `$D` @98974 = getCurrentAgentContext, `Lg` @98977 = runWithAgentContext (ALS `t3K` @98995).
- `$o$` @99216 = runWithTeammateContext (ALS `s76` @99227).
- `Ei` @98997 = formatAgentId (`name@team`), `TY$` @99003 = parseAgentId.
- `FA` @99280 = isTeammate.

### killInProcessTeammate `bW8` @381513-381555: aborts task abortController, sets status "killed", removes from teamContext.teammates, `RU6` cleanup, emit `swarm_in_process_kill`.
### InProcessTeammateTask helpers module `x94` @381573: `requestTeammateShutdown` `xW8`, `injectUserMessageToTeammate` `weH`, `getRunningTeammatesSorted` `e_H` (+ more: appendTeammateMessage, findTeammateTaskByAgentId, getAllInProcessTeammateTasks).
### AppState predicates @99304-99326: `hasRunningInProcessTeammate` etc. (`$.type === "in_process_teammate" && $.status === "running"`). `238589` = isInProcessTeammateTask type guard.

### 2.1.88 ground truth
`src/utils/swarm/inProcessRunner.ts`: `runInProcessTeammate` @883, `startInProcessTeammate` @1544, poll loop @697 (`POLL_INTERVAL_MS=500` @697, `PERMISSION_POLL_INTERVAL_MS=500` @114), comment @681 "Polls the teammate's mailbox every 500ms". `src/utils/swarm/spawnInProcess.ts` (spawn + kill). `src/tasks/InProcessTeammateTask/InProcessTeammateTask.tsx` (requestTeammateShutdown @35, appendTeammateMessage @51, injectUserMessageToTeammate @68, findTeammateTaskByAgentId @92, getAllInProcessTeammateTasks @113, getRunningTeammatesSorted @123). `src/utils/swarm/backends/InProcessBackend.ts` (InProcessBackend @38, createInProcessBackend @337).

---

## DOC 3 — cross_process_mode.md  (tmux + iTerm2 panes)

### PaneBackendExecutor class `L94` @380388-380497  (factory `P94` @380498)
- ctor: stores `backend` (a PaneBackend), `type=backend.type`, `spawnedTeammates = Map<agentId,{paneId,insideTmux}>`, `cleanupRegistered=false`.
- `spawn(H)` @380403 — **THE cross-process spawn**:
  1. `agentId = Ei(name,team)`. Assign color (`teammateColors.assign`).
  2. `{paneId, isFirstTeammate} = await backend.createTeammatePaneInSwarmView(name, color)`.
  3. if first & insideTmux → `backend.enablePaneBorderStatus()`.
  4. Build CLI: execPath `J94` @380305 (`resolveTeammateExecPath`), agent flags `f` (`--agent-id --agent-name --team-name --agent-color --parent-session-id [--plan-mode-required]`), extra flags `X94` @380309 (`--permission-mode/--model/--settings/--plugin-dir/--plugin-url/--teammate-mode/--chrome`), env `WT$` @380336.
  5. **Full command** @380433: `` `cd ${cwd} && env ${env} ${execPath} ${flags}` ``.
  6. `backend.sendCommandToPane(paneId, command, !insideTmux)` → **types the command into the pane** = launches a NEW `claude` process.
  7. Register cleanup (kill panes on exit). Write initial prompt to mailbox (`aA`).
  - Returns `{success, agentId, paneId}`.
- `sendMessage` @380462: mailbox `aA` (same as in-process).
- `terminate` @380470: mailbox shutdown_request `aA`.
- `kill` @380482: `backend.killPane(paneId, !insideTmux)`, remove from map.
- `isActive` @380492: present in spawnedTeammates map.

### CLI/env builders
- `resolveTeammateExecPath` `J94` @380305: env `WsH` override / `process.execPath` (if `UY()`) / `process.argv[1]`.
- `buildTeammateCliFlags` `X94` @380309: permissionMode→`--dangerously-skip-permissions`/`--permission-mode {acceptEdits|auto}`; model from `CLAUDE_CODE_SUBAGENT_MODEL` or `ik()`; `--settings`, `--plugin-dir`*, `--plugin-url`*, `--teammate-mode <JSH()>`, `--chrome`/`--no-chrome`.
- `buildTeammateEnvString` `WT$` @380336: `["CLAUDECODE=1","CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1", …PT_ passthrough…, CLAUDE_SECURESTORAGE_CONFIG_DIR]`. Passthrough list `PT_` @380350 (bedrock/vertex/foundry/mantle/proxy/CA-certs/telemetry-opt-out env vars, ~35 entries).

### TmuxBackend class `ZU6` @380545-380819  (type="tmux", displayName="tmux", supportsHideShow=true)
- `isAvailable()` @380551 → `kXH` (tmux on PATH). `isRunningInside()` → `Ga()`.
- `createTeammatePaneInSwarmView` @380557: serialize via `ZT_` @380517 (promise chain lock `Z94`), `new-window`/`split-window` with `-P -F "#{pane_id}"`. Internal/external session handling (`firstPaneUsedForExternal`).
- tmux cmd helpers: `kS` @380537 (`tmux -S <socket> …`, `ob6` socket), `BE` @380542 (`tmux -L <label> …`, `PsH` label).
- `sendCommandToPane` uses `send-keys -t <pane> <cmd> Enter` (@380567 `["send-keys","-t",H,$,"Enter"]`).
- color map `T94` @380525 (red/blue/green/yellow/purple→magenta/orange→colour208/pink→colour205/cyan).
- killPane, enablePaneBorderStatus, hide/show. Module `V94` @380512 exports `{TmuxBackend: ZU6}`.

### ITermBackend class `TU6` @380820+  (type="iterm2", displayName="iTerm2")
- Uses the `it2` Python CLI. Module `N94`/`E94` @380904 registers it (`VU6(TU6)` @380910).

### it2 setup helpers @380183-380263
- `A94` @380183 detectPythonPkgMgr (uvx/pipx/pip/pip3), `XT_` @380190 isIt2Installed, `Y94` @380193 installIt2, `f94` @380222 verifyIt2Setup, `O94` @380244 pythonApiInstructions, `M94` @380253 markIt2SetupComplete, `j94` @380257 setPreferTmuxOverIterm2, `w94` @380261 getPreferTmuxOverIterm2.

### 2.1.88 ground truth
`backends/PaneBackendExecutor.ts` (PaneBackendExecutor @39, createPaneBackendExecutor @350), `backends/TmuxBackend.ts` (TmuxBackend @104), `backends/ITermBackend.ts` (ITermBackend @79), `backends/it2Setup.ts`, `backends/detection.ts`, `swarm/spawnUtils.ts`, `swarm/teammateLayoutManager.ts`, `swarm/It2SetupPrompt.tsx`.

---

## DOC 4 — mailbox_and_lifecycle_tools.md

### File mailbox (universal IPC for BOTH modes)
- `aA` @338306 = writeToMailbox (inbox file under team dir). `h_H` @338286 = readUnreadMessages. `JG$` @338333 = markMessageAsReadByIndex.
- Message helpers: `VsH` @338516 = createShutdownRequestMessage, `NXH` @338554 = isShutdownRequest. (Also permission request/response `DhH`/`SsH` used by bridge.)
- `tY` @336140 = "team-lead" constant. XML envelope `wU6` @379576 (tag `_Z`, `teammate_id`/`color`/`summary` attrs).
- 2.1.88: `src/utils/teammateMailbox.ts` (getInboxPath @56, readMailbox @84, readUnreadMessages @115, writeToMailbox @134, markMessageAsReadByIndex @201, createShutdownRequestMessage @772, isShutdownRequest @868, sendShutdownRequestToMailbox @831, createIdleNotification @410, isIdleNotification @435, createPermissionRequestMessage @488, …). `src/utils/teamDiscovery.ts`, `src/utils/teammate.ts`.

### Lifecycle tools (tool name constants)
- `cf` @216283 = "SendMessage", `rd` @216438 = "TeamCreate", `Oo` @216439 = "TeamDelete".
- Tool defs: TeamCreate `name: rd` @406632, TeamDelete `name: Oo` @406776, SendMessage `name: cf` @407448. (Read these bodies for inputSchema + isEnabled gates.)
- Tool sets: `U57` @216435 = `{SL,nd,Y0,rT,cf,rP,dI,bJ$}` (Task*/SendMessage/Cron* — the bg/team set).
- 2.1.88: `src/tools/TeamCreateTool/` (TeamCreateTool.ts, UI.tsx, constants.ts, prompt.ts), `src/tools/TeamDeleteTool/`, SendMessage tool.

### Teammate system-prompt addendum `jU6` @379421 (module `H94`, export `TEAMMATE_SYSTEM_PROMPT_ADDENDUM`)
Full text = "# Agent Teammate Communication … use the SendMessage tool with `to: "<name>"` … Just writing a response in text is not visible … The user interacts primarily with the team lead." (verbatim @379422-379428).

### Permission bridge `OT_` @379430 (wraps canUseTool for teammates)
- If `requestDialog` available → show dialog with `workerBadge` (teammate name+color). Else enqueue a worker permission request (`zX8`/`OX8`/`AX8`) AND poll mailbox @379534 (interval `fT_`=500) for a permission RESPONSE (`DhH` parse, `request_id` match) → `SsH` resolve approved/rejected. This is the leader↔teammate permission sync.
- 2.1.88: `src/utils/swarm/leaderPermissionBridge.ts`, `src/utils/swarm/permissionSync.ts`.

---

## DOC 5 — cross_validation.md  (+ 00_overview/cross_validation_report_agent_team.md)
- Map EVERY symbol above to its 2.1.88 named-TS counterpart; note byte-identical vs evolved.
- Delta vs 2.1.142 `30_agent_team/`: 2.1.142 framed modes as {in-process teammate, subagent, bg agent, remote, daemon-helper}. 2.1.156 doc reframes around the **BackendRegistry executor split** (in-process vs pane). Confirm whether 2.1.142 already had the tmux/iterm2 PaneBackend split or whether it's newer — check 2.1.142 docs + symbol_additions.
- Investigate coordinator mode live/dead in 2.1.156 (`cI` @216440).

---

## CONVENTIONS REMINDER (from CLAUDE.md — MANDATORY)
- Module docs use **list-format** symbol refs (`` `readableName` (`XY2`) – desc ``), NEVER mapping tables. Tables ONLY in `00_overview/symbol_index_*.md` and `symbol_additions_*`.
- Code snippets: ONE `====` header block (ReadableName + desc + `Location: cli_inner_pretty.js:line`), then `// ORIGINAL (for source lookup):`, then `// READABLE (for understanding):`, then `// Mapping: …`.
- English only. Every claim cited to `cli_inner_pretty.js:<line>`. Cross-tree links to 2.1.142 use `../../../claude_code_v_2.1.142/...`; to 2.1.88 reference the path `/lyz/codespace/3rd/claude-code/src/...`.
- New symbols → `00_overview/symbol_index_core_features.md` (Module: Agent Team) AND a new `symbol_additions_v2_1_156_agent_team.md`.
- This is a CONTINUATION/delta module (the 2.1.142 tree has `30_agent_team`); the 2.1.156 tree did not until now. Frame accordingly.
