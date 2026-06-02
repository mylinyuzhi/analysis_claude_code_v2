# Symbol Additions — v2.1.156 Background Agents (`bg --exec` / `! <command>` + 2.1.143–156 fixes)

These mappings cover every obfuscated identifier introduced or touched by the v2.1.156 background-agents
module: the new shell-exec background sessions (`claude --bg --exec`, the agents-view `! <command>`), the
unified background dispatcher `ol`/`ywz`, the four-state background-session classifier, the worker
retire/respawn reliability fixes inside `BgWorkerHandle` (`SF`), the subagent worktree-isolation guard and the
`--bg-pty-host` orphan watchdog, and the daemon stale-exec / binary-takeover / `/bg`-handoff lifecycle deltas.

Each row gives the v2.1.156 obfuscated identifier, the readable name (matched to the v2.1.88 TypeScript source
where a precursor exists), `file:line`, and type. Every line was verified by reading
`/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` at that location.

Cross-validated against:
- v2.1.156 bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
- v2.1.88 TypeScript: `/lyz/codespace/3rd/claude-code/src/utils/background/`, `src/utils/concurrentSessions.ts`,
  `src/hooks/useSessionBackgrounding.ts`, `src/bridge/replBridge.ts`, `src/utils/sessionState.ts`
- v2.1.142 reference module: `claude_code_v_2.1.142/analyze/36_background_agents/`

> These rows should eventually be merged into `symbol_index_core_features.md` (Background Agents — the home
> module), with the platform telemetry helpers and the dispatch gate going to `symbol_index_infra_platform.md`
> and the agents-view input parser to `symbol_index_infra_integration.md`. They live here while the v2.1.156
> module is being reviewed.

> Naming notes (single source of truth):
> - `ol` and `ywz` are referred to as both `dispatchBgSession`/`seedBgSessionState` (in `shell_exec_sessions.md`)
>   and `unifiedBgDispatch`/`dispatchWorker` (in `unified_dispatcher_ol.md`). The canonical readable names are
>   `unifiedBgDispatch` (`ol`) and `dispatchWorker` (`ywz`); the other forms are aliases.
> - `Ewz` is `resolveShellLaunch` ≡ `shellLaunchSpec`; `Xwz` is `EXEC_TEMPLATE` ≡ `execTemplate` — same symbols,
>   one canonical name each below.
> - The dossier writes some symbols with a `B` glyph (`nyB`, `gyB`) where the 2.1.156 build uses `$` (`ny$`,
>   `gy$`); the `$`/`B` glyph differs only in the obfuscator's alphabet.
> - The two 2.1.154 UI-routing fixes are pinned via these symbols: `/logout`-signs-out routes through
>   `cS4.fleetHostCall`→`fleetHostLogout`, gated by `jk`/`oy$` and the `dqq` host-command set, short-circuiting
>   bg dispatch in the FleetView submit handler (cli_inner_pretty.js:616719-616734). The `←←`-opens-agents gate
>   is `S$$` = `Ap()` (`!JgH()`/`jM6`) `&& !d6()` (cli_inner_pretty.js:461739-461741) — purely env/setting + not-
>   remote-workspace, with NO Bedrock/Vertex/Foundry or telemetry condition, which is exactly why the 2.1.154 fix
>   made `←←` work on those providers. The OLD provider-gated predicate is no longer in the bundle, so only the
>   current clean gate can be verified.

---

## Module: Background Agents — bg --exec / ! command + 2.1.143–156 fixes

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `a04` | `parseClassifierJson` (strip code fence, slice first `{`…last `}`, JSON.parse, zod-validate) | cli_inner_pretty.js:449308-449321 | function |
| `a69` | `tccDisclaimRespawn` (macOS responsibility-disclaim self re-exec, once, via `posix_spawn` SETEXEC + `responsibility_spawnattrs_setdisclaim`) | cli_inner_pretty.js:559016-559057 | function |
| `Ah8` | `deriveBackgroundSeed` (derive intent/name/detail seed from the transcript for the `/bg` handoff) | cli_inner_pretty.js:542733-542762 | function |
| `Ap` | `isAgentsFleetEnabled` (`!JgH()`; exported in module `b88` as `isAgentsFleetEnabled` at 142239; first factor of the `←←` gate `S$$`) | cli_inner_pretty.js:142249-142251 | function |
| `al` | `extractFlagValue` (generic `--flag=value` / `--flag value` argv reader, stops at `--`) | cli_inner_pretty.js:541547-541556 | function |
| `Bd_` | `createClassifierJobState` (per-session classifier scratch state: prevState, latestAsk, accumulatedOutputs, …) | cli_inner_pretty.js:449816-449834 | function |
| `BL$` | `setActiveWorktreeSession` / `clearForegroundWorktree` (sets/clears the module-global `mL$` worktree-session record) | cli_inner_pretty.js (called at 542723) | function |
| `Bn8` | `emitFeatureBadAsync` (awaited `tengu_feature_bad` flush — used on the one-shot CLI exec path) | cli_inner_pretty.js:41602-41604 | function |
| `Bpz` | `EMPTY_PIN_SET` (`new Set()` passed to bypass the pinned guard during low-mem escalation) | cli_inner_pretty.js:648202, 648221 | constant |
| `Bwz` | `bgDispatchGate` (block bypass/auto bg dispatch unless previously opted in; parses pre-`--` argv) | cli_inner_pretty.js:542514-542529 | function |
| `By$` | `isLowMemory` (free-memory under threshold; always false on macOS) | cli_inner_pretty.js:540459-540462 | function |
| `C6$` | `respawnJob` (explicit-respawn path; exec branch re-runs the command with zero flags) | cli_inner_pretty.js:541152-541261 | function |
| `Ce4` | `buildTemplateFromAgent` (agent-def → `{name,description,initialPrompt,color}` template adapter) | cli_inner_pretty.js:540913-540915 | function |
| `ci6` | `summarizeToolCallsDeterministic` (cheap frequency-sorted top-5 tool-name tally for classifier context) | cli_inner_pretty.js:450322-450334 | function |
| `cS4` | `logoutCommand` (`/logout` slash-command def: `type:"local-jsx"`, `name:"logout"`, `isEnabled` gated by `DISABLE_LOGOUT_COMMAND`; carries `fleetHostCall`→`fleetHostLogout` at 475339-475342 — the marker the FleetView submit handler keys off to sign out instead of bg-dispatching `/logout`) | cli_inner_pretty.js:475334-475344 | object |
| `Dd_` | `MARKER_FAILED` (`/(?:^|\n)\s*failed\s*[:—–-]\s*(.{3,200}?)(?=\n|$)/gi`) | cli_inner_pretty.js:449563 | constant |
| `d6` | `isRemoteWorkspace` (`d$.caps.workspace === "remote"`; second factor of the `←←` gate `S$$` — agents view suppressed in a remote workspace) | cli_inner_pretty.js:3190-3192 | function |
| `dd_` | `findLatestRealUserAsk` (last non-meta string user turn → classifier `latestAsk`) | cli_inner_pretty.js:449875-449880 | function |
| `dqq` | `fleetHostCommands` (memoized `ay$().filter(H => H.fleetHostCall !== void 0)` — slash commands that run on the FleetView host (logout/exit/relaunch) instead of being bg-dispatched; consumed by the submit handler at 616724) | cli_inner_pretty.js:545926 | function |
| `Ed_` | `RX_VERDICT` (tail "VERDICT: PASS|FAIL" → done) | cli_inner_pretty.js:449580 | constant |
| `ee4` | `BG_FLAG_ALIASES` (`["--bg","--background"]` stripped before re-parse) | cli_inner_pretty.js:542622 | variable |
| `EF` | `ensureDaemonRunning` (ensure a daemon is reachable; stale-exec fallback to transient) | cli_inner_pretty.js:540124-540208 | function |
| `esH` | `worktreeIsolationGuard` (path-block predicate run before writes; 2.1.156 `$.agentId` subagent branch) | cli_inner_pretty.js:346660-346684 | function |
| `Eu6` | `resolveBgIsolation` (env `CLAUDE_BG_ISOLATION` then `settings.worktree.bgIsolation`; `"none"` opts out) | cli_inner_pretty.js:346655-346659 | function |
| `evH` | `terminalStateToOutcome` (done→success / failed→failure / stopped→stopped / else null) | cli_inner_pretty.js:184274-184278 | function |
| `Ewz` | `resolveShellLaunch` (≡ `shellLaunchSpec`; pick `$SHELL -c` / `COMSPEC /d /s /c` / `/bin/sh -c`) | cli_inner_pretty.js:541727-541736 | function |
| `f6` | `getOriginalCwd` (launch-time original cwd, ignores AsyncLocalStorage override) | cli_inner_pretty.js:2386-2388 | function |
| `fCH` | `waitDaemonReachable` (poll `ping` op until reachable or timeout) | cli_inner_pretty.js:540078-540085 | function |
| `fd_` | `STATE_DEFINITIONS` (long-form working/blocked/done/failed defs; reconciler allow-list) | cli_inner_pretty.js:449552-449560 | object |
| `fleetHostLogout` | `fleetHostLogout` (host-side sign-out routine invoked by `cS4.fleetHostCall`; lazy-imported from module `bC6`/`vD8` — the concrete impl line was not opened due to import indirection, cite as the call site) | cli_inner_pretty.js:475340 (lazy import) | function |
| `Fe4` | `claimSpareOrColdDispatch` (claim a pre-warmed spare worker, else cold dispatch) | cli_inner_pretty.js:541102-541146 | function |
| `fwz` | `currentLaunchTarget` (the launcher's own exec path / prefix arg) | cli_inner_pretty.js:540216-540219 | function |
| `Gd_` | `RX_AGENTS_STATUS` (tail "N agents in flight" / "Loop active" → working/idle) | cli_inner_pretty.js:449571 | constant |
| `GPz` | `POST_ADOPT_GRACE_MS` (120000) | cli_inner_pretty.js:560836 | constant |
| `gwz` | `BackgroundForkPrompt` (React component: confirm `/bg`, call `zh8`, emit fork telemetry, banner) | cli_inner_pretty.js:542763-542829 | function |
| `gy$` | `shellExecGate` (kill-switch for shell-exec bang command; returns `true` in 2.1.156) | cli_inner_pretty.js:541028-541030 | function |
| `Hc_` | `EXCLUDED_TOOLS` (`Set([df, rP, MJ])` — tools omitted from the classifier tool tally) | cli_inner_pretty.js:450512 | constant |
| `hd_` | `RX_STOPPING_HERE` (tail "Stopping here" / "Parked the branch" → blocked) | cli_inner_pretty.js:449583 | constant |
| `hwz` | `bgFlagExecHandler` (`claude --bg --exec` CLI handler; `--exec`/`--exec=` parse, `--name` compose, dispatch) | cli_inner_pretty.js:541956-542006 | function |
| `i04` | `fastPathClassify` (regex fast-path battery; tagged branch or null; code-fence aware) | cli_inner_pretty.js:449166-449285 | function |
| `IV6` | `CLAUDE_AGENT_DEF` (built-in catch-all `claude` agent; `getSystemPrompt` teaches narrate/restate/`result:`/`needs input:`/`failed:`) | cli_inner_pretty.js:236184-236210 | object |
| `iy8` | `lowMemThresholdBytes` (`tengu_bg_low_mem_mb` ×1 GiB; 0 on macOS) | cli_inner_pretty.js:540455-540458 | function |
| `j$$` | `addGoalStopHook` (`/goal`: register session Stop hook + stamp `activeGoal`) | cli_inner_pretty.js:447943-447957 | function |
| `Jd_` | `MARKER_NEEDS_INPUT` (`/(?:^|\n)\s*needs input\s*[:—–-]\s*(.{3,200}?)(?=\n|$)/gi`) | cli_inner_pretty.js:449564 | constant |
| `jd_` | `isTerminalState` (`Md_.has(state)` predicate; classifier-side) | cli_inner_pretty.js:449075-449077 | function |
| `JgH` | `isAgentViewDisabled` (`jM6() !== null`; `jM6` at 142224-142228 returns a disable-reason only when `CLAUDE_CODE_DISABLE_AGENT_VIEW` env is truthy or the `disableAgentView` setting is true — the sole kill-switches for the agents view, no provider/telemetry gating) | cli_inner_pretty.js:142221-142228 | function |
| `jPz` | `runPtyHost` (`claude --bg-pty-host` entry; `Bun.Terminal` + REPL child + orphan watchdog) | cli_inner_pretty.js:559067-559275 | function |
| `JT4` | `classifyState` (classifier dispatcher: fast-path → heuristic → LLM; emits `tengu_bg_classify`) | cli_inner_pretty.js:450335-450419 | function |
| `jwz` | `daemonLabelForArgs` ("claude agents" / "claude --bg" / "claude" `--spawned-by` label) | cli_inner_pretty.js:540332-540337 | function |
| `kd` | `interpolateMentions` (substitute `@file`/`@image` mention placeholders into intent/exec text, right-to-left) | cli_inner_pretty.js:177847-177856 | function |
| `kd_` | `RX_PUSHED_COMMITTED` (tail "Pushed to" / "Committed as" / "Opened PR" → done) | cli_inner_pretty.js:449577 | constant |
| `KPH` | `isInsideCodeFence` (fenced-region detector voiding markers inside ``` blocks) | cli_inner_pretty.js:449087-449113 | function |
| `kqq` | `idlePlaceholderDetail` (`"(idle — send a prompt to start)"`) | cli_inner_pretty.js:542585, 542623 | constant |
| `L04` | `goalSentinelMessage` (emit a `goal_status` sentinel attachment) | cli_inner_pretty.js:447971-447977 | function |
| `Ld_` | `MARKER_IM_BLOCKED` (`/\bI'?m blocked\s*[:—–-]\s*(.{3,200}?)(?=\n|$)/gi`) | cli_inner_pretty.js:449566 | constant |
| `Le4` | `realpathMtimeMs` (resolve realpath then mtimeMs; null on ENOENT) | cli_inner_pretty.js:540209-540215 | function |
| `LL5` | `rebuildPinnedFromMarkers` (fallback: scan per-dir `pinned` marker files, persist `pins.json`) | cli_inner_pretty.js:184023-184047 | function |
| `m9H` | `getWorktreeCreateHook` (true when a `WorktreeCreate` hook is configured) | cli_inner_pretty.js:143815-143822 | function |
| `Md_` | `TERMINAL_STATES` (`Set(["done","failed","stopped"])`) | cli_inner_pretty.js:449562 | constant |
| `mn8` | `emitFeatureOkAsync` (awaited `tengu_feature_ok` flush — CLI exec path) | cli_inner_pretty.js:41599 | function |
| `mpz` | `NORMAL_RETIRE_GRACE_MS` (3600000) | cli_inner_pretty.js:648199 | constant |
| `Mwz` | `takeoverStaleDaemon` (gated SIGKILL of a stale transient daemon; emits `tengu_bg_daemon_binary_takeover`) | cli_inner_pretty.js:540233-540291 | function |
| `mwz` | `stripSessionIdArgs` (drop user `--session-id` from prompt-mode argv tail; pass post-`--` through verbatim) | cli_inner_pretty.js:542497-542513 | function |
| `n1H` | `ENTER_WORKTREE_TOOL_NAME` (`"EnterWorktree"`, named in the isolation-guard block message) | cli_inner_pretty.js:216098 | constant |
| `n04` | `closingTailShape` (classify the closing shape — empty/code-fence/result-line/trailing-q/… — for telemetry) | cli_inner_pretty.js:449153 | function |
| `Nd_` | `RX_READY_FOR` (tail "Ready for review / to merge / ship" → done) | cli_inner_pretty.js:449579 | constant |
| `nJ` | `recordJobExitCause` (write the `exit-cause` marker file in `CLAUDE_JOB_DIR`) | cli_inner_pretty.js:9546-9551 | function |
| `Nqq` | `seedBgState` (standalone bg seed-state writer for the non-`ywz` seed path) | cli_inner_pretty.js:541737-541768 | function |
| `nS$` | `SessionStateTracker` (session state + goal snapshot class; `hasTerminalGoalSnapshot`, goal-clear-on-running) | cli_inner_pretty.js:623957-623995 | class |
| `Nv` | `isTerminalState` (worker-side: `terminalStateToOutcome(state) !== null`) | cli_inner_pretty.js:184280-184282 | function |
| `Nwz` | `VALUED_FLAGS` (set of value-bearing flags `extractFlagValue` skips the value of) | cli_inner_pretty.js (referenced in `al`, 541547-541556) | variable |
| `ny$` | `formatBgHints` ("backgrounded · <short>" banner with attach/logs/stop hints) | cli_inner_pretty.js:542079-542089 | function |
| `o04` | `buildClassifierUserMsg` (assembles `Current state / Tool calls / User's ask / tail` user message) | cli_inner_pretty.js:449295-449307 | function |
| `Od_` | `OUTPUT_FIELDS` (`{ result: "…" }` allow-list for `output.*` keys) | cli_inner_pretty.js:449561 | object |
| `ol` | `unifiedBgDispatch` (≡ `dispatchBgSession`; single bg-dispatch seam: gate, identity, delegate to `ywz`) | cli_inner_pretty.js:541769-541788 | function |
| `OPz` | `ensureAppBundleExec` (materialize `ClaudeCode.app` exec + Info.plist for stable macOS TCC identity) | cli_inner_pretty.js:558989-559015 | function |
| `oy$` | `isCommandAvailable` (command-availability predicate: true when `H.availability` unset, else checks each availability tag — claude-ai/console/… — against current account caps; used in the `fleetHostCall` gate at 616725 alongside `jk()`) | cli_inner_pretty.js:545303 | function |
| `Owz` | `isDaemonStaleVsClient` (transient-origin + (version-gt OR mtime-newer) staleness comparator) | cli_inner_pretty.js:540220-540232 | function |
| `Pd_` | `scanExplicitMarkers` (find last `failed:`/`needs input:`/`blocked:` marker outside code fences) | cli_inner_pretty.js:449139-449152 | function |
| `pe4` | `fleetDispatchExec` (agents-view shell-exec dispatch; pre-seed `Xwz` state, then `ol(..,"fleet",..)`) | cli_inner_pretty.js:541031-541059 | function |
| `pn8` | `emitFeatureSadAsync` (awaited `tengu_feature_sad` flush) | cli_inner_pretty.js:41605-41607 | function |
| `pwz` | `RESPAWN_BOOLEAN_FLAGS` (boolean keep-set for respawn replay: `--dangerously-skip-permissions`, `--reply-on-resume`, …) | cli_inner_pretty.js:542669 | variable |
| `Qi6` | `heuristicLastLine` (last-non-empty-line "working" fallback classifier) | cli_inner_pretty.js:449286-449294 | function |
| `qKH` | `claudeAgentTemplate` (`Ce4(IV6)` built-in catch-all template; placeholder in exec parse result) | cli_inner_pretty.js:541290 | variable |
| `Qw$` | `loadPinnedSet` (read `pins.json` into a Set each tick; ENOENT → `rebuildPinnedFromMarkers`) | cli_inner_pretty.js:184012-184022 | function |
| `q5q` | `parseFleetDispatchInput` (agents-view input parser; leading `!` → shell-exec intent) | cli_inner_pretty.js:614290-614318 | function |
| `r04` | `classifierPrompt` (the full four-state working/blocked/done/failed classifier system prompt) | cli_inner_pretty.js:449361-449539 | variable |
| `Rf9` | `findGoalToRestore` (walk transcript for last non-sentinel `goal_status` to restore on resume) | cli_inner_pretty.js:598861 | function |
| `SF` | `BgWorkerHandle` (worker-handle class, renamed from v2.1.142 `aB`; phase machine + retire/respawn) | cli_inner_pretty.js:559938 | class |
| `SH` | `emitFeatureOk` (sync fire-and-forget `tengu_feature_ok` — agents-view path) | cli_inner_pretty.js:41590-41592 | function |
| `S$$` | `isLeftArrowAgentsViewEnabled` (the `←←` agents-view gate: `Ap() && !d6()` = `isAgentsFleetEnabled() && !isRemoteWorkspace()`; NO provider/telemetry condition — the post-2.1.154 clean gate; wired into the left-arrow handler memo at 629873/629876 and the footer-hint predicate at 583226) | cli_inner_pretty.js:461739-461741 | function |
| `Swz` | `dispatchFailureLabel` (dispatch-failure reason → human label: "not running" / "timed out" / …) | cli_inner_pretty.js:542063-542078 | function |
| `sY` | `getActiveWorktreeSession` (returns the active bg worktree-session record `mL$`) | cli_inner_pretty.js:239369-239371 | function |
| `sZ` | `truncateWithEllipsis` (surrogate-safe one-line truncator, cap `iL`=800) | cli_inner_pretty.js:449078-449083 | function |
| `t$` | `emitFeatureSad` (sync `tengu_feature_sad` — agents-view path; benign races) | cli_inner_pretty.js:41596-41598 | function |
| `T_$` | `gitRootIsNonCanonical` (`findGitRoot(p) !== null && findCanonicalGitRoot(p) !== findGitRoot(p)` — true when a path is in a repo but its git-root differs from the canonical/main-repo root, i.e. a worktree that resolves back to the main repo; used by `esH` to skip the isolation guard) | cli_inner_pretty.js:46920-46923 | function |
| `Td_` | `RX_WILL_CHECK_BACK` (tail "I'll check back/re-check (not your…)" → working/idle) | cli_inner_pretty.js:449573 | constant |
| `Tqq` | `sendDispatch` (daemon dispatch send + nonce; shell→`my$`, else→`EF({forceTransient})`) | cli_inner_pretty.js:541571-541600 | function |
| `TPz` | `EMPTY_IDLE_GRACE_MS` (300000) | cli_inner_pretty.js:560837 | constant |
| `uH` | `emitFeatureBad` (sync `tengu_feature_bad` — agents-view path) | cli_inner_pretty.js:41593-41595 | function |
| `ujH` | `isExecSession` (`template === "exec" && respawnFlags.length === 0`; on-disk record predicate) | cli_inner_pretty.js:184286-184288 | function |
| `Uwz` | `firstPositionalAsIntent` (derive intent from last non-flag positional that isn't the resume id) | cli_inner_pretty.js:542530-542541 | function |
| `uwz` | `stripLaunchFlags` (drop resume/fork/session-id flags for resume-mode `flagArgs`) | cli_inner_pretty.js:542476-542496 | function |
| `Vd_` | `RX_CANT_PROCEED` (tail "I can't/cannot proceed/continue" → blocked) | cli_inner_pretty.js:449575 | constant |
| `vd_` | `RX_GIVING_UP` (tail "Giving up" / "not actionable" → failed) | cli_inner_pretty.js:449576 | constant |
| `Ve4` | `bridgedRetireGraceMs` (`tengu_bg_retire_grace_bridged_min` ×60000; default 480 min) | cli_inner_pretty.js:540463-540465 | function |
| `VPz` | `isLegalPhaseTransition` (phase-transition guard, renamed from v2.1.142 `UB5`; logic unchanged) | cli_inner_pretty.js:559923-559937 | function |
| `Vzq` | `LOW_MEM_GRACE_MS` (60000) | cli_inner_pretty.js:648200 | constant |
| `vzq` | `TICK_INTERVAL_MS` (60000 — supervisor tick cadence) | cli_inner_pretty.js:648201 | constant |
| `w$$` | `clearGoalStopHook` (`/goal clear`: remove Stop hook + clear `activeGoal`) | cli_inner_pretty.js:447958-447969 | function |
| `Wd_` | `RX_FORWARD_INTENT` (active-verb opener of last sentence with negative look-aheads → working) | cli_inner_pretty.js:449567 (body 449568) | constant |
| `We4` | `isServiceDaemonInstalled` (true if a service unit is registered, not transient) | cli_inner_pretty.js:540328-540331 | function |
| `wh$` | `failPtyHost` (log + `process.exit(1)` for the pty-host) | cli_inner_pretty.js:559345-559348 | function |
| `x6$` | `idleNeedsHint` (`"send a prompt to start"`) | cli_inner_pretty.js:542584 | constant |
| `Xd_` | `MARKER_BLOCKED` (`/(?:^|\n)\s*blocked\s*[:—–-]\s*(.{3,200}?)(?=\n|$)/gi`) | cli_inner_pretty.js:449565 | constant |
| `Xwz` | `EXEC_TEMPLATE` (≡ `execTemplate`; `{ name: "exec", description: "" }` shell-session marker) | cli_inner_pretty.js:541292 | object |
| `y1` | `findGitRoot` (cached walk-up-for-`.git` git-root finder; exported as `findGitRoot`; non-null ⇒ path inside a git repo. Assigned `y1 = oq1()` at 47419; underlying body `BNq` at 47382) | cli_inner_pretty.js:47419 (def 47382) | function |
| `yd_` | `RX_PLEASE_DO_X` (tail "Please start/run/provide/export `ENV_VAR`" → blocked) | cli_inner_pretty.js:449581 | constant |
| `yk$` | `reconcileClassifierResult` (validate/fill `{state,detail,tempo,needs,output}` against prior state) | cli_inner_pretty.js:449325-449339 | function |
| `yq9` | `formatPhase` (phase → log string, renamed from v2.1.142 `FI4`) | cli_inner_pretty.js:559920-559922 | function |
| `Ywz` | `nudgeDaemonUntilConverged` (`nudge`-loop; invokes binary-takeover before declaring "up") | cli_inner_pretty.js:540086-540123 | function |
| `ywz` | `dispatchWorker` (≡ `seedBgSessionState`; parse argv → launch mode → seed state → send → rescue) | cli_inner_pretty.js:541789-541955 | function |
| `z04` | `generateToolUseSummary` (LLM "git-commit-subject" tool-call → ≤30-char progress label) | cli_inner_pretty.js:447331-447382 | function |
| `Zd_` | `RX_PASSIVE_WAIT` (temporal/conditional clause meaning "not the agent's own next step") | cli_inner_pretty.js:449569 (body 449570) | constant |
| `Zg_` | `TOOL_SUMMARY_PROMPT` (label-writing system prompt for `generateToolUseSummary`) | cli_inner_pretty.js:447393-447402 | variable |
| `zh8` | `backgroundCurrentSession` (resume the live session in a bg worker via `--resume --fork-session`; worktree handoff) | cli_inner_pretty.js:542680-542731 | function |
| `zH9` | `collectRespawnFlags` (keep-list flag collector for respawn replay: value-bearing `hqq` + boolean `pwz`) | cli_inner_pretty.js:542542-542560 | function |
| `Zyz` | `restoreGoalFromTranscript` (resume-time goal recovery; re-stamp `activeGoal` if not met/failed) | cli_inner_pretty.js:598870 | function |
| `_H9` | `extractResumeSessionId` (pull the resume target session id from `--resume`/`-r` argv) | cli_inner_pretty.js:542463-542475 | function |
| `_J` | `isSettledState` (`isTerminalState(state) && tempo !== "active"`) | cli_inner_pretty.js:184283-184285 | function |
| `$q9` | `writePtyLog` (append a timestamped line to the pty-host log) | cli_inner_pretty.js:559334-559343 | function |

---

## Telemetry events (event-name reference, not symbol mappings)

These are the `tengu_*` / `cli_*` / `fleet_*` events emitted by this module. The emit sites are cited in the
module docs; this list is for cross-referencing event names, not for symbol lookup.

- `cli_bg_dispatch_exec` — CLI `--exec` ok/bad (`mn8`/`Bn8`) — cli_inner_pretty.js:541982/541976
- `fleet_view_dispatch_exec` — agents-view `!` bad/sad/ok (`uH`@541043 / `t$`@541049 / `SH`@541058) — cli_inner_pretty.js:541043/541049/541058
- `tengu_bg_classify` — classifier path/branch/closingShape/stateChanged — cli_inner_pretty.js:450398
- `tengu_bg_dispatch_rescued` — ack-timeout/enoconn/estarting dispatch rescue — cli_inner_pretty.js (in `ywz`, ~541912)
- `tengu_bg_respawn_stale` — upgrade-respawn — cli_inner_pretty.js:560058
- `tengu_bg_retired` — per-retire (`state`/`settledForMs`/`bridged`) — cli_inner_pretty.js:560076/560101/560126
- `tengu_bg_retire_pinned_low_mem` — low-mem pinned-shed last resort — cli_inner_pretty.js:648014
- `tengu_bg_phase_illegal` — refused phase transition — cli_inner_pretty.js:560009
- `tengu_bg_daemon_service_stale_exec` — service exec deleted; transient fallback — cli_inner_pretty.js:540130
- `tengu_bg_daemon_binary_takeover` — client SIGKILL of stale transient daemon — cli_inner_pretty.js:540288
- `tengu_bg_binary_takeover` — feature gate (default true) for takeover — cli_inner_pretty.js:540247
- `tengu_background` / `tengu_background_fork` / `tengu_background_spawn_failed` — `/bg` handoff — cli_inner_pretty.js:542723/542800/542722
- `tengu_daemon_yield_takeover` / `tengu_daemon_self_restart_on_upgrade` — pre-existing daemon self-restart paths — cli_inner_pretty.js:648590/648783
- `ptyhost_orphan_watchdog` — pty-host orphan-watchdog `exit-cause` marker (via `nJ`) — cli_inner_pretty.js:559229
</content>
