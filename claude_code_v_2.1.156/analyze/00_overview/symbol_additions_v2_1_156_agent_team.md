# Symbol Additions — Agent Team (v2.1.156)

> Consolidated obfuscated→readable symbol table for the **agent-team** subsystem
> (internally named **"swarm"**: telemetry events `swarm_*`, user-facing error text
> "agent swarms"). This is the same subsystem the v2.1.142 analysis tree documented as
> **"agent team"**. Scope is the two execution modes — **in-process** (async task in the
> leader's `claude` process, isolated by `AsyncLocalStorage`) and **cross-process panes**
> (a separate `claude` OS process in a tmux pane / iTerm2 split) — plus the shared file
> mailbox IPC, the lifecycle tools (`TeamCreate`/`TeamDelete`/`SendMessage`), and the
> leader↔teammate permission bridge.
>
> Out of scope (contrast only): the daemon/background-agent fleet (`36_background_agents/`),
> a different worker model (daemon-supervised child processes that outlive the leader).
> Agent-team teammates are leader-owned and die with the leader REPL.

## Cross-validated against

- **v2.1.156 bundle self-cross-check.** Every row's `File:Line` was read directly from
  `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
  (649,979 lines). All line numbers in this table are verified by direct Read/grep, not
  inferred from the module docs.
- **v2.1.88 readable TypeScript ground truth** under
  `/lyz/codespace/3rd/claude-code/src/utils/swarm` (plus `src/tools/TeamCreateTool/`,
  `src/tools/TeamDeleteTool/`, `src/tasks/InProcessTeammateTask/`, `src/utils/teammateMailbox.ts`,
  `src/utils/agentId.ts`). The 2.1.156 minified bodies are an almost **byte-identical**
  evolution of this named TS; the few **evolved** symbols are flagged in the Notes column.
- **v2.1.142 reference module**
  `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.142/analyze/30_agent_team/`
  (format/depth reference). The v2.1.142 tree framed teammate execution around task
  taxonomy and a coordinator process model and did **not** isolate the
  `BackendRegistry` / `InProcessBackend`-vs-`PaneBackendExecutor` executor split as a
  first-class concept; the v2.1.156 analysis (and this table) reframe around that split.

**Routing note:** home index for these symbols is
`00_overview/symbol_index_core_features.md`, **Module: Agent Team**. The full
deep-analysis prose lives in `30_agent_team/` (`execution_modes_and_backend_registry.md`,
`in_process_mode.md`, `cross_process_mode.md`, `mailbox_and_lifecycle_tools.md`). This
file is the flat symbol manifest; the four sibling docs use list-format references back
to it.

---

## 1. Gate, Teammate Mode & Snapshot

The master feature gate plus the `teammateMode` (`auto`/`tmux`/`in-process`) capture-once
snapshot that biases the execution-mode decision.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `cI` | `coordinatorModeRaw` | cli_inner_pretty.js:216440 | function |
| `Bp` | `isCoordinatorMode` | cli_inner_pretty.js:216460 | function |
| `Mk5` | `isCcrCoordinator` (always `false` — CCR variant hard-disabled) | cli_inner_pretty.js:216463 | function |
| `Bx` | `coordinatorModeModule` (export map; distinct from BackendRegistry) | cli_inner_pretty.js:216449 | object |
| `Dk5` | `getCoordinatorSystemPrompt` | cli_inner_pretty.js:216506 | function |
| `D94` | `captureTeammateModeSnapshot` (CLI override > config > "auto") | cli_inner_pretty.js:380289 | function |
| `LU6` | `clearCliTeammateModeOverride` (UI mode change) | cli_inner_pretty.js:380286 | function |
| `DSH` | `capturedMode` (frozen session mode slot) | cli_inner_pretty.js:380298 | variable |
| `PT$` | `cliTeammateModeOverride` (pending `--teammate-mode` slot) | cli_inner_pretty.js:380299 | variable |
| `XU6` | `getCliTeammateModeOverride` | cli_inner_pretty.js:380283 | function |
| `w94` | `getPreferTmuxOverIterm2` | cli_inner_pretty.js:380261 | function |
| `JSH` | `getTeammateModeFromSnapshot` (default "auto") | cli_inner_pretty.js:380293 | function |
| `kT_` | `getTeammateModeSnapshotInternal` (registry-local wrapper of `JSH`) | cli_inner_pretty.js:381073 | function |
| `Ru5` | `hasAgentTeamsFlag` (`argv.includes("--agent-teams")`) | cli_inner_pretty.js:240763 | function |
| `R7` | `isAgentTeamsEnabled` (**master gate**: env/flag AND GrowthBook `tengu_amber_flint`) | cli_inner_pretty.js:240766 | function |
| `j94` | `setPreferTmuxOverIterm2` | cli_inner_pretty.js:380257 | function |
| `LT_` | `setCliTeammateModeOverride` (`--teammate-mode` override) | cli_inner_pretty.js:380280 | function |
| `PEq` | `teammateModeEnum` (`["auto","tmux","in-process"]`) | cli_inner_pretty.js:49109 | constant |
| `PU6` | `teammateModeSnapshotModule` (export map) | cli_inner_pretty.js:380272 | object |
| `WsH` | `TEAMMATE_COMMAND_ENV_VAR` (`"CLAUDE_CODE_TEAMMATE_COMMAND"`) | cli_inner_pretty.js:336145 | constant |

---

## 2. Backend Registry (Detection & Dispatch)

The single small module that owns the entire in-process-vs-pane decision. Module map is
`R94` (export map at 380913-380929); state factory `y94`; process singleton `NS`.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `R94` | `BackendRegistry` (module export map) | cli_inner_pretty.js:380912 | object |
| `y94` | `createBackendRegistry` (mutable state factory) | cli_inner_pretty.js:380930 | function |
| `h94` | `createITermBackendInstance` (`new ITermBackendClass()`) | cli_inner_pretty.js:380960 | function |
| `BW8` | `createTmuxBackendInstance` (`new TmuxBackendClass()`) | cli_inner_pretty.js:380956 | function |
| `jLH` | `detectAndGetBackend` (tmux/iTerm2/it2/fallback detection tree) | cli_inner_pretty.js:380965 | function |
| `AeH` | `ensureBackendsRegistered` (lazy-import backend classes) | cli_inner_pretty.js:380942 | function |
| `LSH` | `getBackendByType` (explicit `"tmux"`/`"iterm2"` → backend) | cli_inner_pretty.js:381056 | function |
| `YeH` | `getCachedBackend` | cli_inner_pretty.js:381064 | function |
| `vU6` | `getCachedDetectionResult` | cli_inner_pretty.js:381067 | function |
| `S94` | `getInProcessBackend` (memoized `InProcessBackend`) | cli_inner_pretty.js:381094 | function |
| `ET_` | `getPaneBackendExecutor` (memoized `PaneBackendExecutor`) | cli_inner_pretty.js:381102 | function |
| `NU6` | `getResolvedTeammateMode` (`"in-process"`|`"tmux"`) | cli_inner_pretty.js:381091 | function |
| `NT_` | `getTeammateExecutor` (**dispatch entry point**) | cli_inner_pretty.js:381098 | function |
| `vT_` | `getTmuxInstallInstructions` (per-OS install help) | cli_inner_pretty.js:381034 | function |
| `NS` | `globalBackendRegistry` (process singleton) | cli_inner_pretty.js:381118 | variable |
| `ma` | `isInProcessEnabled` (**the in-process-vs-pane switch**) | cli_inner_pretty.js:381076 | function |
| `kU6` | `markInProcessFallback` (sticky bit: pane failed → in-process) | cli_inner_pretty.js:381070 | function |
| `VU6` | `registerITermBackend` (backend registers its class) | cli_inner_pretty.js:380953 | function |
| `GU6` | `registerTmuxBackend` (backend registers its class) | cli_inner_pretty.js:380950 | function |
| `EU6` | `resetBackendDetection` (clear all caches; test path) | cli_inner_pretty.js:381110 | function |

---

## 3. In-Process Backend & Runner

`InProcessBackend` (`K94`), the spawn/start helpers, the persistent agent loop, the
6-priority poll loop, compaction, idle notification, and the task-list auto-claim.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_94` | `createInProcessBackend` (`new K94()`) | cli_inner_pretty.js:380172 | function |
| `jT_` | `findAvailableTask` (next pending/unowned/unblocked task) | cli_inner_pretty.js:379599 | function |
| `wT_` | `formatTaskAsPrompt` (task-claim prompt builder) | cli_inner_pretty.js:379607 | function |
| `K94` | `InProcessBackend` (in-process `TeammateExecutor`) | cli_inner_pretty.js:380062 | class |
| `bW8` | `killInProcessTeammate` (force-kill via AbortController + team cleanup) | cli_inner_pretty.js:381513 | function |
| `$94` | `notifyTeamLeadIdle` (idle notification → team-lead mailbox) | cli_inner_pretty.js:379595 | function |
| `MT_` | `sendMessageToLeader` / `deliverToLeaderInbox` (`writeToMailbox("team-lead",…)`) | cli_inner_pretty.js:379592 | function |
| `uU6` | `resolveTeammatePermissionMode` (plan/default collapse; never inherit `dontAsk`) | cli_inner_pretty.js:381453 | function |
| `JT_` | `runInProcessTeammate` (the persistent agent loop) | cli_inner_pretty.js:379714 | function |
| `CW8` | `spawnInProcessTeammate` (alloc identity/taskId/teammate-ctx, register task) | cli_inner_pretty.js:381458 | function |
| `qeH` | `startInProcessTeammate` (fire-and-forget `JT_(...).catch(...)`) | cli_inner_pretty.js:380016 | function |
| `q94` | `tryClaimNextTask` (atomic auto-claim from team task list) | cli_inner_pretty.js:379617 | function |
| `DT_` | `waitForNextPromptOrShutdown` (6-priority poll loop) | cli_inner_pretty.js:379637 | function |
| `fT_` | `POLL_INTERVAL_MS` / `PERMISSION_POLL_INTERVAL_MS` (`500`) | cli_inner_pretty.js:380022 | constant |
| `b94` | `STOPPED_DISPLAY_MS` (`3000`; keep "stopped" row visible) | cli_inner_pretty.js:411687 | constant |

---

## 4. In-Process Task State, Predicates & Helper Module (`x94`)

The `in_process_teammate` task-state CRUD helpers, the AppState team-status scans, and the
fundamental type guard. Module `x94` (export map at 381573).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `RW8` | `appendTeammateMessage` (append to `task.messages`, guarded on running) | cli_inner_pretty.js:381589 | function |
| `l6H` | `findTeammateTaskByAgentId` (prefer `running` over stale terminal) | cli_inner_pretty.js:381601 | function |
| `ZSH` | `getAllInProcessTeammateTasks` (filter by `isInProcessTeammateTask`) | cli_inner_pretty.js:381610 | function |
| `e_H` | `getRunningTeammatesSorted` (running, sorted by `agentName.localeCompare`) | cli_inner_pretty.js:381613 | function |
| `qo$` | `hasActiveInProcessTeammates` (any running teammate task) | cli_inner_pretty.js:99303 | function |
| `t76` | `hasWorkingInProcessTeammates` (running AND `!isIdle`) | cli_inner_pretty.js:99307 | function |
| `weH` | `injectUserMessageToTeammate` (push to `pendingUserMessages`; poll-priority-1 source) | cli_inner_pretty.js:381595 | function |
| `LJ` | `isInProcessTeammateTask` (task-type guard: `type==="in_process_teammate"`) | cli_inner_pretty.js:238588 | function |
| `GT$` | `InProcessTeammateTask` (`Task`-interface object; `kill()` → `bW8`) | cli_inner_pretty.js:381618 | object |
| `x94` | `inProcessTeammateTaskModule` (helper export map) | cli_inner_pretty.js:381573 | object |
| `xW8` | `requestTeammateShutdown` (set `shutdownRequested`, guarded) | cli_inner_pretty.js:381583 | function |
| `e76` | `waitForTeammatesToBecomeIdle` (resolves when all busy teammates idle) | cli_inner_pretty.js:99312 | function |
| `RU6` | `removeMemberByAgentId` (remove from on-disk team file) | cli_inner_pretty.js:381285 | function |

---

## 5. AsyncLocalStorage Identity Isolation

The two independent `AsyncLocalStorage` instances — agent-id (analytics attribution) and
teammate-context (team identity) — plus the `name@team` codec and the identity predicates
that resolve correctly in both execution modes (ALS store for in-process, process-global
`UB` for cross-process panes).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `t3K` | `agentIdStore` (agent-id `AsyncLocalStorage` instance) | cli_inner_pretty.js:98995 | variable |
| `cUH` | `createTeammateContext` (tags identity with `isInProcess:true`) | cli_inner_pretty.js:99222 | function |
| `Ei` | `formatAgentId` (`name@team`) | cli_inner_pretty.js:98997 | function |
| `vT` | `getAgentId` (ALS store or global `UB`) | cli_inner_pretty.js:99264 | function |
| `ZA` | `getAgentName` | cli_inner_pretty.js:99269 | function |
| `$D` | `getCurrentAgentContext` (read agent-id ALS) | cli_inner_pretty.js:98974 | function |
| `c_` | `getTeamName` | cli_inner_pretty.js:99274 | function |
| `XZ` | `getTeammateContext` (read teammate-context ALS) | cli_inner_pretty.js:99213 | function |
| `EP` | `getTeammateColor` | cli_inner_pretty.js:99284 | function |
| `mG` | `isInProcessTeammate` (teammate ALS store present) | cli_inner_pretty.js:99216 | function |
| `FA` | `isTeammate` (am-I-a-teammate: ALS store OR static `UB` team context) | cli_inner_pretty.js:99280 | function |
| `TY$` | `parseAgentId` (split `name@team`) | cli_inner_pretty.js:99003 | function |
| `Lg` | `runWithAgentContext` (enter agent-id ALS scope) | cli_inner_pretty.js:98977 | function |
| `$o$` | `runWithTeammateContext` (enter teammate-context ALS scope) | cli_inner_pretty.js:99216 | function |
| `s76` | `teammateStore` (teammate-context `AsyncLocalStorage` instance) | cli_inner_pretty.js:99227 | variable |

> Note: `$o$` (`runWithTeammateContext`) and `mG` (`isInProcessTeammate`) are emitted on
> the same source line (99216) in the bundle (sequential declarations); `XZ`
> (`getTeammateContext`) is at 99213.

---

## 6. Pane Backend Executor & CLI/Env Builders

`PaneBackendExecutor` (`L94`) — the adapter wrapping a `PaneBackend` into the uniform
`TeammateExecutor` interface — plus the three builders that reconstruct the parent's
runtime as a relaunch command (`cd … && env … claude --agent-id …`).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `X94` | `buildTeammateCliFlags` (permission/model/settings/plugins/mode/chrome) | cli_inner_pretty.js:380309 | function |
| `WT$` | `buildTeammateEnvString` (`env KEY=VALUE …` prefix) | cli_inner_pretty.js:380336 | function |
| `P94` | `createPaneBackendExecutor` (`new L94(backend)`) | cli_inner_pretty.js:380498 | function |
| `L94` | `PaneBackendExecutor` (pane `TeammateExecutor`; owns `spawnedTeammates` map + cleanup) | cli_inner_pretty.js:380388 | class |
| `J94` | `resolveTeammateExecPath` (which `claude` binary to relaunch) | cli_inner_pretty.js:380305 | function |
| `PT_` | `TEAMMATE_ENV_PASSTHROUGH` (~35-entry env forward list — **grew from v2.1.88's ~17**) | cli_inner_pretty.js:380350 | constant |

---

## 7. Tmux Backend

`TmuxBackend` (`ZU6`) — the native, first-class pane backend. Two command routers
(`-S` socket for the user's tmux vs `-L` label for the external swarm session), a
promise-chain pane-creation mutex, the color map, and the `send-keys … Enter`
"type the command in" primitive.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ZT_` | `acquirePaneCreationLock` (promise-chain mutex; tmux) | cli_inner_pretty.js:380517 | function |
| `G94` | `awaitPaneShellInitDelay` (sleep `WT_`=200ms before send-keys) | cli_inner_pretty.js:380514 | function |
| `T94` | `getTmuxColorName` (agent-color → tmux color: purple→magenta, etc.) | cli_inner_pretty.js:380525 | function |
| `ob6` | `getUserTmuxSocket` (optional `-S <socket>` path) | cli_inner_pretty.js:336185 | function |
| `PsH` | `getSwarmSocketName` (external `-L <label>` name) | cli_inner_pretty.js:336137 | function |
| `BE` | `runTmuxInSwarmLabel` (`tmux -L <label> …`; external session) | cli_inner_pretty.js:380542 | function |
| `kS` | `runTmuxInSwarmSocket` (`tmux [-S <socket>] …`; user session — **evolved: added `-S`**) | cli_inner_pretty.js:380537 | function |
| `ZU6` | `TmuxBackend` (tmux `PaneBackend`; `type="tmux"`, `supportsHideShow=true`) | cli_inner_pretty.js:380545 | class |
| `Z94` | `paneCreationLock` (module-global promise; tmux mutex chain) | cli_inner_pretty.js:380785 | variable |
| `uu` | `TMUX_COMMAND` (`"tmux"`) | cli_inner_pretty.js:336143 | constant |
| `WT_` | `PANE_SHELL_INIT_DELAY_MS` (`200`) | cli_inner_pretty.js:380786 | constant |
| `V94` | `tmuxBackendModule` (export map; calls `registerTmuxBackend`) | cli_inner_pretty.js:380512 | object |

---

## 8. iTerm2 Backend & it2 Setup

`ITermBackend` (`TU6`) via the `it2` Python CLI, the `it2 session split` dead-session
pruning loop, and the it2 onboarding subsystem (detect package manager → install →
verify → enable Python API).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `A94` | `detectPythonPkgMgr` (uv/pipx/pip; ordered by isolation) | cli_inner_pretty.js:380183 | function |
| `VT_` | `getLeaderIt2SessionId` (from `ITERM_SESSION_ID`) | cli_inner_pretty.js:380813 | function |
| `Y94` | `installIt2` (per pkg-mgr; `cwd: homedir()` PyPI-redirect hardening) | cli_inner_pretty.js:380193 | function |
| `XT_` | `isIt2Installed` (`which it2`) | cli_inner_pretty.js:380190 | function |
| `TU6` | `ITermBackend` (iTerm2 `PaneBackend`; `type="iterm2"`, `supportsHideShow=false`) | cli_inner_pretty.js:380820 | class |
| `M94` | `markIt2SetupComplete` (persist `iterm2It2SetupComplete=true`) | cli_inner_pretty.js:380253 | function |
| `TT_` | `parseIt2SplitOutput` (session id from "Created new pane: …") | cli_inner_pretty.js:380808 | function |
| `O94` | `pythonApiInstructions` (iTerm2 → Settings → Magic → Enable Python API) | cli_inner_pretty.js:380244 | function |
| `mW8` | `runIt2` (exec the `it2` CLI) | cli_inner_pretty.js:380805 | function |
| `f94` | `verifyIt2Setup` (`it2 session list`; `needsPythonApiEnabled` branch) | cli_inner_pretty.js:380222 | function |
| `GT_` | `acquirePaneCreationLock` (promise-chain mutex; iTerm2) | cli_inner_pretty.js:380797 | function |
| `k94` | `paneCreationLock` (module-global promise; iTerm2 mutex chain) | cli_inner_pretty.js:380903 | variable |
| `n6H` | `teammateSessionIds` (tracked iTerm2 split session ids) | cli_inner_pretty.js:380901 | variable |
| `uW8` | `firstPaneUsed` (reuse the swarm window's initial pane flag) | cli_inner_pretty.js:380902 | variable |
| `N94` | `itermBackendModule` (export map; calls `registerITermBackend`) | cli_inner_pretty.js:380904 | object |

---

## 9. Environment Detection Probes

The sync/async tmux and iTerm2 probes consumed by `detectAndGetBackend` and
`isInProcessEnabled`, plus the it2 CLI availability probe.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ga` | `isInsideTmux` (async; reads captured original `TMUX`) | cli_inner_pretty.js:336178 | function |
| `MhH` | `isInsideTmuxSync` (sync variant) | cli_inner_pretty.js:336159 | function |
| `h6H` | `isInITerm2` (`TERM_PROGRAM` / `ITERM_SESSION_ID` / `env.terminal`) | cli_inner_pretty.js:336192 | function |
| `MG$` | `isIt2CliAvailable` (`it2 session list`, not `--version`) | cli_inner_pretty.js:336199 | function |
| `kXH` | `isTmuxAvailable` (`tmux -V` exit 0) | cli_inner_pretty.js:336189 | function |
| `OhH` | `isPaneBackend` (`type==="tmux"||"iterm2"`) | cli_inner_pretty.js:336134 | function |
| `GsH` | `IT2_COMMAND` (`"it2"`) | cli_inner_pretty.js:336209 | constant |

---

## 10. File Mailbox (Universal IPC)

The per-recipient JSON inbox under `~/.claude/teams/<team>/inboxes/<agent>.json`. The
single send primitive `writeToMailbox` (`aA`) backs both execution modes, the lifecycle
tools, idle/shutdown, and the permission bridge.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `HD_` | `ensureInboxDir` (`mkdir -p` of `inboxes/`) | cli_inner_pretty.js:338280 | function |
| `$D_` | `formatMessagesAsTeammateXml` (stacked `<teammate-message …>` envelopes) | cli_inner_pretty.js:338411 | function |
| `jhH` | `getInboxPath` (`<teamsDir>/<team>/inboxes/<agent>.json`) | cli_inner_pretty.js:338272 | function |
| `TG$` | `getLastSendMessageSummary` (scan transcript for last peer DM) | cli_inner_pretty.js:338654 | function |
| `JG$` | `markMessageAsReadByIndex` (flip `read` in place; idempotent; the "consume" op) | cli_inner_pretty.js:338333 | function |
| `XG$` | `markMessagesAsRead` (mark all unread read) | cli_inner_pretty.js:338367 | function |
| `h_H` | `readMailbox` (parse array; tolerate ENOENT/SyntaxError; back-fill `type`) | cli_inner_pretty.js:338286 | function |
| `whH` | `readUnreadMessages` (`readMailbox().filter(!read)`) | cli_inner_pretty.js:338301 | function |
| `aA` | `writeToMailbox` (lock → re-read → push → atomic write; **the universal send**) | cli_inner_pretty.js:338306 | function |
| `DG$` | `LOCK_OPTIONS` (`retries:{retries:10,minTimeout:5,maxTimeout:100}`) | cli_inner_pretty.js:338697 | constant |
| `tY` | `TEAM_LEAD_NAME` (`"team-lead"`) | cli_inner_pretty.js:336140 | constant |
| `OiH` | `sanitizePathComponent` (`[^a-zA-Z0-9_-]` → `-`) | cli_inner_pretty.js:237112 | function |

---

## 11. Mailbox Message Builders, Parsers & Envelope

The control-message protocol on top of the mailbox: builders write a typed object,
parsers zod-validate inbound text. Includes the XML envelope that wraps message text into
a teammate's agent-loop turn.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `PG$` | `createIdleNotification` | cli_inner_pretty.js:338422 | function |
| `jx6` | `createPermissionRequestMessage` (snake_case SDK shape) | cli_inner_pretty.js:338441 | function |
| `wx6` | `createPermissionResponseMessage` | cli_inner_pretty.js:338453 | function |
| `Dx6` | `createSandboxPermissionRequestMessage` | cli_inner_pretty.js:338482 | function |
| `Jx6` | `createSandboxPermissionResponseMessage` | cli_inner_pretty.js:338493 | function |
| `Xx6` | `createShutdownApprovedMessage` (carries `paneId`/`backendType`) | cli_inner_pretty.js:338525 | function |
| `Lx6` | `createShutdownRejectedMessage` (requires `reason`) | cli_inner_pretty.js:338535 | function |
| `VsH` | `createShutdownRequestMessage` | cli_inner_pretty.js:338516 | function |
| `wU6` | `formatAsTeammateMessage` (single-message `<teammate-message …>` envelope) | cli_inner_pretty.js:379576 | function |
| `gUH` | `generateRequestId` (`<prefix>-<ts>@<target>`) | cli_inner_pretty.js:99008 | function |
| `$X8` | `isControlMessage` (protocol-message-not-chat predicate) | cli_inner_pretty.js:338613 | function |
| `WG$` | `isIdleNotification` | cli_inner_pretty.js:338434 | function |
| `ZG$` | `isPermissionRequest` | cli_inner_pretty.js:338468 | function |
| `DhH` | `isPermissionResponse` | cli_inner_pretty.js:338475 | function |
| `NXH` | `isShutdownRequest` | cli_inner_pretty.js:338554 | function |
| `oJ8` | `sendShutdownRequestToMailbox` (high-level "ask teammate to shut down") | cli_inner_pretty.js:338544 | function |
| `_Z` | `TEAMMATE_MESSAGE_TAG` (`"teammate-message"`) | cli_inner_pretty.js:41644 | constant |

---

## 12. Lifecycle Tools, System-Prompt Addendum & Tool Set

The model-facing surface: the three tool name constants, the swarm tool set, the tool
definitions, their string-message/structured-message dispatch helpers, and the
system-prompt addendum that forces `SendMessage`.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bh_` | `handleShutdownApproval` (teammate agrees to die; in-process aborts own controller) | cli_inner_pretty.js:407290 | function |
| `Ch_` | `handleShutdownRequest` (tool-side twin of `sendShutdownRequestToMailbox`) | cli_inner_pretty.js:407279 | function |
| `H94` | `teammatePromptAddendumModule` (export map for `jU6`) | cli_inner_pretty.js:379419 | object |
| `iO4` | `SEND_MESSAGE_PROMPT` ("plain text is NOT visible … you MUST call this tool") | cli_inner_pretty.js:407200 | function |
| `RO4` | `TEAM_CREATE_PROMPT` (team workflow playbook) | cli_inner_pretty.js:406487 | function |
| `xO4` | `TEAM_DELETE_PROMPT` (fails if team still has active members) | cli_inner_pretty.js:406735 | function |
| `cf` | `SendMessage` (tool name constant) | cli_inner_pretty.js:216283 | constant |
| `Bh_` | `SendMessageTool` (tool def; rejects `to:"*"` broadcast — **evolved**) | cli_inner_pretty.js:407447 | object |
| `Ih_` | `sendTeammateMessage` (string-message leg → `writeToMailbox`) | cli_inner_pretty.js:407257 | function |
| `U57` | `SWARM_TOOL_SET` (`{TaskCreate,TaskGet,TaskList,TaskUpdate,SendMessage,Cron…}`) | cli_inner_pretty.js:216435 | constant |
| `jU6` | `TEAMMATE_SYSTEM_PROMPT_ADDENDUM` (forces `SendMessage`; **evolved: dropped broadcast line**) | cli_inner_pretty.js:379421 | constant |
| `rd` | `TeamCreate` (tool name constant) | cli_inner_pretty.js:216438 | constant |
| `Th_` | `TeamCreateTool` (tool def) | cli_inner_pretty.js:406631 | object |
| `Oo` | `TeamDelete` (tool name constant) | cli_inner_pretty.js:216439 | constant |
| `vh_` | `TeamDeleteTool` (tool def; returns `{success:false}` if members active) | cli_inner_pretty.js:406775 | object |

---

## 13. Permission Bridge (leader↔teammate)

`createTeammateCanUseTool` (`OT_`) wraps a teammate's `canUseTool`: Path A shows an
interactive dialog with a colored worker badge on the leader's terminal; Path B serializes
a `permission_request` into the leader's inbox and self-polls (500ms) for a matching
`permission_response`. Reuses the same mailbox primitives — no new transport.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `MLH` | `buildPermissionDialog` (badge-labeled dialog; Path A) | cli_inner_pretty.js:379395 | function |
| `zX8` | `createPermissionRequest` (`SwarmPermissionRequest`; `perm-<ts>-<rand>` id) | cli_inner_pretty.js:338774 | function |
| `OT_` | `createTeammateCanUseTool` (**the permission bridge** — **evolved: Path A migrated to `requestDialog`**) | cli_inner_pretty.js:379430 | function |
| `Ya7` | `getLeaderName` (leader name from team file or `"team-lead"`) | cli_inner_pretty.js:338807 | function |
| `Pa7` | `getLeaderSetToolPermissionContext` (write permissionUpdates back, `preserveMode:true`) | cli_inner_pretty.js:339023 | function |
| `KD_` | `isTeamLeader` (agentId empty or `"team-lead"`) | cli_inner_pretty.js:338797 | function |
| `XhH` | `isSwarmWorker` | cli_inner_pretty.js:338802 | function |
| `SsH` | `processMailboxPermissionResponse` (look up callback by `request_id`, resolve) | cli_inner_pretty.js:338978 | function |
| `qD_` | `generatePermissionRequestId` (`perm-<ts>-<rand>`) | cli_inner_pretty.js:338771 | function |
| `OX8` | `registerPermissionCallback` (in-memory, keyed by `request_id`) | cli_inner_pretty.js:338966 | function |
| `AX8` | `sendPermissionRequestViaMailbox` (→ leader's inbox) | cli_inner_pretty.js:338814 | function |
| `YX8` | `sendPermissionResponseViaMailbox` (leader → worker; `subtype:"success"|"error"`) | cli_inner_pretty.js:338840 | function |
| `Oa7` | `sendSandboxPermissionRequestViaMailbox` | cli_inner_pretty.js:338864 | function |
| `fX8` | `sendSandboxPermissionResponseViaMailbox` | cli_inner_pretty.js:338905 | function |
| `Ma7` | `unregisterPermissionCallback` | cli_inner_pretty.js:338969 | function |

---

## 14. Shared Utilities Referenced by Agent-Team Code

Cross-module helpers cited inline by the agent-team snippets. Listed for traceability; the
canonical home index for each remains its own module's `symbol_index_*.md` section — these
rows are duplicated here only as a reading aid for the agent-team docs.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `C4` | `createAbortController` | cli_inner_pretty.js:212215 | function |
| `T8` | `createUserMessage` | cli_inner_pretty.js:443846 | function |
| `DW` | `createTaskStateBase` | cli_inner_pretty.js:550391 | function |
| `E$` | `getSessionId` | cli_inner_pretty.js:2359 | function |
| `T6` | `getToolPermissionContext` / `getPermissionContext` | cli_inner_pretty.js:453162 | function |
| `yE` | `generateTaskId` | cli_inner_pretty.js:550384 | function |
| `n$` | `getPlatform` (macos/linux/wsl/windows) | cli_inner_pretty.js:42334 | function |
| `V$` | `growthbookFlag` (feature flag with default) | cli_inner_pretty.js:141101 | function |
| `S2` | `isTerminalTaskStatus` | cli_inner_pretty.js:550363 | function |
| `R6` | `isNonInteractiveSession` (`-p`/print mode) | cli_inner_pretty.js:2742 | function |
| `UY` | `isInBundledMode` | cli_inner_pretty.js:132249 | function |
| `kEH` | `unregisterPerfettoAgent` | cli_inner_pretty.js:275989 | function |
| `uY8` | `registerPerfettoAgent` | cli_inner_pretty.js:275984 | function |
| `p5H` | `isPerfettoTracingEnabled` | cli_inner_pretty.js:275981 | function |
| `O4` | `shellQuote` (POSIX single-quote escaping) | cli_inner_pretty.js:176255 | function |
| `WS` | `runAgent` (the shared agent generator) | cli_inner_pretty.js:396794 | function |
| `xH` | `isTruthy` (`1/true/yes/on`) | cli_inner_pretty.js:1795 | function |
| `p6H` | `SUBAGENT_REJECT_MESSAGE` | cli_inner_pretty.js:446457 | constant |
| `B0$` | `PERMISSION_DENIED_REASON_PREFIX` | cli_inner_pretty.js:446459 | constant |

---

## Notes & Caveats

- **`isInProcessTeammateTask` (`LJ`) line:** the function declaration is at
  `cli_inner_pretty.js:238588` (the scout dossier listed `238589`, which is the body line);
  238588 is correct for the symbol.
- **Co-located declarations:** `getTeammateContext` (`XZ` @99213), `runWithTeammateContext`
  (`$o$` @99216) and `isInProcessTeammate` (`mG` @99216) are sequential bundle declarations;
  `$o$` and `mG` share line 99216.
- **`ob6` / `PsH` dual role:** `ob6` (`getUserTmuxSocket` @336185) and `PsH`
  (`getSwarmSocketName` @336137) live in the tmux-detection module (`336134`+) but are the
  socket/label resolvers used by `TmuxBackend`'s two routers `kS`/`BE`.
- **Evolved symbols vs v2.1.88** (flagged in tables): `OT_`'s Path A migrated from a React
  `setToolUseConfirmQueue` to a `requestDialog` callback; `jU6` + `SendMessageTool`
  dropped `to:"*"` broadcast; `PT_` env passthrough grew ~17→~35 (added AWS/Mantle creds,
  telemetry opt-out, secure-storage dir); `kS` gained optional `-S <socket>`; `X94` gained
  `--plugin-url` and `--permission-mode auto`; `bW8`/helpers migrated raw `setAppState` →
  `taskRegistry` abstraction; the `swarm_in_process_*`/`swarm_pane_spawn` telemetry events
  are newer than v2.1.88. The in-process poll-loop priority order and the dual-ALS
  isolation model are stable since at least v2.1.83–88.
- **All rows carry a verified `cli_inner_pretty.js:<line>`.** Every line number in this
  file was confirmed by direct grep/`sed -n` against the v2.1.156 bundle during this pass,
  including the cross-module helpers in §14 (e.g. `T8` `createUserMessage` @443846, `DW`
  `createTaskStateBase` @550391, `WS` `runAgent` @396794). No symbol was left unconfirmed.
