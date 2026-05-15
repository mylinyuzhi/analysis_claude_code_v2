# Symbol Additions — v2.1.142 Agents & Background Subsystem (Unit 08)

These mappings cover the v2.1.142 changes to the `claude agents` (agent view) entry point, the on-demand daemon's lifecycle, background-worker dispatch flag plumbing, subagent_type normalization, and supporting telemetry. Each row gives the v2.1.142 obfuscated identifier, the readable name (matched to v2.1.88 TypeScript source where possible), file:line, and type.

Cross-validated against:
- v2.1.142 bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js`
- v2.1.142 per-decl: `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/`
- v2.1.88 TypeScript: `/lyz/codespace/3rd/claude-code/src/coordinator/`, `/lyz/codespace/3rd/claude-code/src/services/`
- v2.1.112 reference module: `claude_code_v_2.1.112/analyze/30_agent_team/`

> These rows should eventually be merged into `symbol_index_core_execution.md` (agent dispatch), `symbol_index_core_features.md` (background agents/agent view, subagent matcher), and `symbol_index_infra_platform.md` (daemon lifecycle, clock-jump detector). They live here while Unit 08 is being reviewed.

---

## Module: `claude agents` Subcommand & Dispatch Flag Plumbing (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Go6` | `parseAgentsDispatchFlags` (pre-Commander positional scan for `agents` + `--cwd`/`--settings`/`--add-dir`/`--plugin-dir`/`--mcp-config`/`--strict-mcp-config`) | cli_inner_pretty.js:65-103 | function |
| `yV$` | `resolveDispatchExtraArgs` (run `path.resolve` over the raw flag values, leaving inline JSON-strings untouched) | cli_inner_pretty.js:104-113 | function |
| `hV$` | `serializeDispatchExtraArgs` (flatten the typed-extra-args object back into a `argv` array for the spawned worker) | cli_inner_pretty.js:114-122 | function |
| `gg4` | `coerceDispatchDefaults` (validate `--permission-mode`/`--model`/`--effort` and drop values that the env hasn't opted into yet) | cli_inner_pretty.js:565469-565478 | function |
| `Qg4` | `renderDispatchDefaultsChips` (React component showing the three defaults as colored chips next to the dispatch input) | cli_inner_pretty.js:565479-565503 | function |
| `qg6` | `dispatchDefaultsToArgv` (turn validated defaults into a `--model X --effort Y --permission-mode Z` argv tail) | cli_inner_pretty.js:509773-509780 | function |
| `MN4` | `setDispatchExtraArgsForSession` (module-level setter — stash flag set in `OG$` global for later dispatch calls) | cli_inner_pretty.js:509767-509769 | function |
| `wN4` | `getDispatchExtraArgs` | cli_inner_pretty.js:509770-509772 | function |
| `OG$` | `dispatchExtraArgsState` (module-level mutable array) | cli_inner_pretty.js (referenced near 509790) | variable |
| `ao5` | `mountFleetView` (the agents-view loop: render UI, attach to selected job, repeat) | cli_inner_pretty.js:569079-569208 | function |
| `EQ4` | `FleetViewDashboard` (the React component for the agent-view list, search box, status filters) | cli_inner_pretty.js:567084-… | function |
| `og4` | `STATE_LABELS` (`{review:"Ready for review", blocked:"Needs input", working:"Working", done:"Completed"}`) | cli_inner_pretty.js:569355 | constant |
| `rg4` | `STATE_BUCKET_ORDER` (`["review","blocked","working","done"]`) | cli_inner_pretty.js:569354 | constant |
| `So5` | `JOB_KIND_LABELS` (`{agent:"background", repo, skill, routine}`) | cli_inner_pretty.js:569361 | constant |
| `Pn6` | `AUTO_RELAUNCH_MARKER_ENV` (`"CLAUDE_AGENTS_AUTO_RELAUNCHED_AT"`) | cli_inner_pretty.js:569223 | constant |
| `tZ8` | `RELAUNCH_GRACE_MS` (3,600,000 ms = 1 h) | cli_inner_pretty.js:569221 | constant |
| `OQ4` | `STALE_AGENT_THRESHOLD_MS` (21,600,000 ms = 6 h) | cli_inner_pretty.js:569222 | constant |
| `Xn6` | `CONTROL_CHAR_STRIP_REGEX` | cli_inner_pretty.js:569353 | constant |
| `JN4` | `STORE_OPEN_AGENT_VIEW_FLAG` | cli_inner_pretty.js (called from `mountFleetView`, line 569095) | function |
| `_j8` | `formatTuiHistoryLabel` | cli_inner_pretty.js (called from `mountFleetView`, line 569095) | function |
| `yQ4` | `mountFleetViewFromLeftArrow` (the `←←` shortcut: tear down the foreground REPL, mount agent view) | cli_inner_pretty.js:569366-569381 | function |

---

## Module: Agent View Gate & Onboarding Flag (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `fF` | `isAgentsFleetEnabled` (= `!isAgentViewDisabled()`) | cli_inner_pretty.js:139882-139884 | function |
| `rmH` | `isAgentViewDisabled` (env var `CLAUDE_CODE_DISABLE_AGENT_VIEW` or managed-settings `disableAgentView`) | cli_inner_pretty.js:139859-139861 | function |
| `y5$` | `ensureFleetGateHydrated` (load settings before reading the gate flags) | cli_inner_pretty.js:139885-139891 | function |
| `wZH` | `fleetGateRejected` (write a stderr message and `process.exit(1)`) | cli_inner_pretty.js:139916-139920 | function |
| `Cq6` | `consumeAgentViewRelaunchMarker` (read & delete `CLAUDE_CODE_AGENT_VIEW_RELAUNCH` env var) | cli_inner_pretty.js:139921-139924 | function |
| `E5$` | `AGENT_VIEW_RELAUNCH_ENV_KEY` (`"CLAUDE_CODE_AGENT_VIEW_RELAUNCH"`) | cli_inner_pretty.js:139925 | constant |
| `MoH` | `shouldAcceptLeftArrowToAgentView` (predicate gating `←←` shortcut on `hasUsedAgentsFleet` or experimental flag) | cli_inner_pretty.js:435227-435228 | function |
| `$1H` | `setHasUsedAgentsFleet` (sticky flag set the first time the user opens agent view) | cli_inner_pretty.js:435230-435233 | function |

---

## Module: `--bg` Flag Preservation (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `nC5` | `BG_FLAG_NAMES` (`["--bg","--background"]`) | cli_inner_pretty.js:511281 | constant |
| `Pg6` | `BG_FLAGS_WITH_ARGUMENT` (set of `--model`, `--agent`, `--effort`, `--add-dir`, …) | cli_inner_pretty.js:511283-511326 | constant |
| `_b5` | `BG_FLAGS_BOOLEAN` (`{"--dangerously-skip-permissions","--allow-dangerously-skip-permissions","--strict-mcp-config","--dangerously-allow-browser-network-access"}`) | cli_inner_pretty.js:511327-511332 | constant |
| `$b5` | `stripResumeFlags` (used to build the prompt-mode flag array for child workers, removing `--resume`/`-c`/`--session-id`) | cli_inner_pretty.js:511141-511161 | function |
| `qb5` | `stripSessionIdAfterSeparator` (preserve everything after `--`, but drop `--session-id`) | cli_inner_pretty.js:511162-511178 | function |
| `Kb5` | `gateBgFlagDisclaimers` (return error if bg-with-bypassPermissions/auto isn't opted in interactively) | cli_inner_pretty.js:511179-511194 | function |
| `Ab5` | `findPositionalPrompt` (skip `--*` and their values, return first bare token) | cli_inner_pretty.js:511195-511206 | function |
| `RN4` | `flagsWithoutPositional` (preserves boolean flags in `_b5`, keeps value flags in `Pg6`, drops positional tokens — used by retire/wake to restore `--dangerously-skip-permissions`) | cli_inner_pretty.js:511207-511225 | function |
| `zb5` | `captureClaudeEnvOverrides` (capture `CLAUDE_CONFIG_DIR`/AWS/GCP env for spawned bg worker) | cli_inner_pretty.js:511226-511242 | function |

---

## Module: Pre-existing Worktree Recognition (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `DE6` | `enterExistingWorktree` (recognize registered worktrees of the parent repo, set `enteredExisting:true`) | cli_inner_pretty.js:523107-523141 | function |
| `NP8` | `gitWorktreeListPorcelain` (parse `git worktree list --porcelain`) | cli_inner_pretty.js:523088-523106 | function |
| `FkH` | `keepWorktreeAtSessionEnd` (preserve linked worktree if user opted in) | cli_inner_pretty.js:523142-523154 | function |
| `CiH` | `cleanupWorktreeOrPreserveExisting` (on session end: skip cleanup when `enteredExisting`) | cli_inner_pretty.js:523155-523197 | function |
| `eJ$` | `createAgentWorktree` (`existed` branch resumes a previous matching worktree instead of failing) | cli_inner_pretty.js:523198-… | function |
| `jO$` | `currentWorktreeContextState` | cli_inner_pretty.js (used in 234443, 234446) | variable |
| `$JH` | `setCurrentWorktreeContext` | cli_inner_pretty.js (called from `DE6`/`FkH`/`CiH`) | function |
| `oz` | `getCurrentWorktreeContext` | cli_inner_pretty.js (used in 523143, 523156) | function |

---

## Module: Daemon Lifecycle (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `O89` | `runDaemonSupervisor` (the top-level daemon entry — installs upgrade poll, retire timer, worker adopter) | cli_inner_pretty.js:609952-610186 | function |
| `f89` | `getBinaryIdentity` (`realpath(binary)` + `mtimeMs` — used to detect `brew upgrade`) | cli_inner_pretty.js:609938-609947 | function |
| `tKA` | `binaryIdentityChanged` (compare realpath+mtime to spot upgrade-in-place) | cli_inner_pretty.js:609948-609951 | function |
| `aKA` | `STALE_BINARY_POLL_MS` (60,000 ms) | cli_inner_pretty.js:610188 | constant |
| `sKA` | `DAEMON_IDLE_GRACE_DEFAULT_MS` (5,000 ms) | cli_inner_pretty.js:610189 | constant |
| `gKA` | `BG_RETIRE_GRACE_DEFAULT_MS` (3,600,000 ms = 1 h) | cli_inner_pretty.js:609576 | constant |
| `Ur6` | `BG_RETIRE_TICK_MS` (60,000 ms — the daemon's retire-loop interval) | cli_inner_pretty.js:609578 | constant |
| `i$9` | `BG_RETIRE_LOW_MEM_GRACE_MS` (60,000 ms — used when system is under memory pressure) | cli_inner_pretty.js:609577 | constant |
| `BB5` | `BG_RECENT_ADOPT_GRACE_MS` (120,000 ms — don't retire just-adopted workers) | cli_inner_pretty.js:528605 | constant |
| `pB5` | `BG_EMPTY_IDLE_GRACE_MS` (300,000 ms = **5 minutes**, v2.1.141 auto-retire) | cli_inner_pretty.js:528606 | constant |
| `mB5` | `BG_REATTACH_TIMEOUT_MS` (120,000 ms) | cli_inner_pretty.js:528604 | constant |
| `aB` | `BgWorkerHandle` (class — wraps a single worker process; tracks `lastInputAt`, `adoptedAt`, `retiring`/`retired` phase) | cli_inner_pretty.js:527970-528594 | class |
| `aB.spawn` | `BgWorkerHandle.spawn` (factory — cold-start a new worker) | cli_inner_pretty.js:528010-528014 | function |
| `aB.claim` | `BgWorkerHandle.claim` (factory — adopt a pre-warmed spare) | cli_inner_pretty.js:528015-528044 | function |
| `aB.adopt` | `BgWorkerHandle.adopt` (factory — re-attach to a worker that survived a supervisor restart) | cli_inner_pretty.js:528052-… | function |
| `aB.retireIfSettled` | `BgWorkerHandle.retireIfSettled` (returns `{retired,reason}` after applying all the grace-window predicates) | cli_inner_pretty.js:527901-527964 | function |
| `aB.shiftGraceClocksForward` | `BgWorkerHandle.shiftGraceClocksForward` (v2.1.142 — bump `lastInputAt`/`adoptedAt` by Δ when wall-clock jumped) | cli_inner_pretty.js:528143-528147 | function |
| `tengu_daemon_self_restart_on_upgrade` | telemetry event fired when `tKA` reports a stale binary | cli_inner_pretty.js:610170 | event-name |
| `tengu_bg_respawn_stale` | telemetry event fired when an idle worker is retired-then-respawned for the new binary | cli_inner_pretty.js:527897 | event-name |
| `tengu_bg_retired` | telemetry event fired for each retired worker | cli_inner_pretty.js:527914, 527939, 527956 | event-name |
| `tengu_bg_dispatch_low_mem` | telemetry — daemon retired settled workers because `freemem() < threshold` | cli_inner_pretty.js:609260 | event-name |
| `tengu_daemon_idle_exit` | telemetry — daemon exited after `sKA` ms with no clients | cli_inner_pretty.js:610118 | event-name |
| `tengu_daemon_yield_takeover` | telemetry — a service daemon displaced a transient one | cli_inner_pretty.js:609982 | event-name |
| `tengu_bg_spare_claim` | telemetry — a dispatch successfully claimed a pre-warmed spare | cli_inner_pretty.js:609289 | event-name |
| `tengu_bg_spare_claim_fail` | telemetry — a spare-claim failed, falling back to a cold dispatch | cli_inner_pretty.js:509882, 609304 | event-name |
| `tengu_event_loop_stall` | telemetry — event-loop stall detector (includes `likely_sleep: K`) | cli_inner_pretty.js:598383 | event-name |
| `B6A` | `startEventLoopStallDetector` (200 ms tick, threshold 500 ms, hint sleep when > 5 s) | cli_inner_pretty.js:598366-598399 | function |
| `RT$` | `EVENT_LOOP_STALL_INTERVAL_MS` (200) | cli_inner_pretty.js:598400 | constant |
| `ue4` | `EVENT_LOOP_STALL_THRESHOLD_MS` (500) | cli_inner_pretty.js:598401 | constant |
| `x6A` | `EVENT_LOOP_SLEEP_HINT_MS` (5000 — > 5 s means `[likely sleep/wake]`) | cli_inner_pretty.js:598402 | constant |

---

## Module: Pre-warmed Worker (Spare) Fallback (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `jN4` | `claimSpareOrColdDispatch` (v2.1.141 — claim a pre-warmed spare; on failure, fall back to a fresh cold dispatch with `yP8`) | cli_inner_pretty.js:509877-509921 | function |
| `JN4` | `discardPendingSpare` | cli_inner_pretty.js:509922-509926 | function |
| `xr6` | `wrapSpareAsHandle` (factory adapter from pending-spare descriptor to `BgWorkerHandle`) | cli_inner_pretty.js (called from 609285) | function |
| `Fr6` | `installHandleListeners` (subscribe lease/state callbacks to a fresh handle) | cli_inner_pretty.js (called from 609286, 609367) | function |
| `l1H` | `pendingSpareDescriptor` (module-level — the single warmed worker, set by `tengu_bg_spare_enable` poll) | cli_inner_pretty.js (mutated near 509879, 509923) | variable |
| `c1H` | `SPARE_BG_AGENT_TEMPLATE` (the synthetic agent template used for warming) | cli_inner_pretty.js (referenced near 509855, 509894) | constant |
| `yP8` | `coldDispatchFromTemplate` (the fresh-spawn fallback path) | cli_inner_pretty.js:509781-509834 | function |
| `tengu_bg_spare_enable` | feature flag controlling whether the daemon pre-warms a spare | cli_inner_pretty.js:609280 | flag-name |

---

## Module: Background-Worker Dispatch (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `I$H` | `spawnBgSession` (top-level `--bg`/agent-view dispatch entry) | cli_inner_pretty.js:510492-510507 | function |
| `iC5` | `assembleBgSessionDispatch` (build the `DispatchFrame` — flags, cwd, worktree, session-id, env) | cli_inner_pretty.js:510508-… | function |
| `Jg6` | `preSeedReplBgJob` (write empty job-state to disk before the worker writes its own) | cli_inner_pretty.js:510464-510491 | function |
| `bP8` | `formatBgHints` | cli_inner_pretty.js (export) | function |
| `IN4` | `bgVerbExtraArgsNote` | cli_inner_pretty.js (export) | function |
| `Hb5` | `rmHandler` (`claude bg rm <id>`) | cli_inner_pretty.js:511077-… | function |
| `tC5` | `respawnHandler` | cli_inner_pretty.js (export) | function |
| `eC5` | `stopHandler` | cli_inner_pretty.js (export) | function |
| `sC5` | `attachHandler` | cli_inner_pretty.js (export) | function |
| `aC5` | `logsHandler` | cli_inner_pretty.js (export) | function |
| `rC5` | `handleBgFlag` | cli_inner_pretty.js (export) | function |
| `SN4` | `parseResumeTarget` | cli_inner_pretty.js (export) | function |
| `S$H` | `extractFlagValue` (find `--<flag>` then its argument in an `argv` array) | cli_inner_pretty.js (used in `iC5`) | function |
| `fg6` | `recordBgDispatchFallback` (telemetry for the ack-timeout/short-alive recovery paths) | cli_inner_pretty.js:510408-510428 | function |

---

## Module: Attached-Session Capability Forwarding (Chrome Shim Isolation, Editor) (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `vJ` | `getAttacherCaps` (read the forwarded attacher capability blob — non-null only while attached) | cli_inner_pretty.js:2686-2688 | function |
| `aV8` | `setAttacherCaps` (called when an `attacher-caps` rv-message arrives) | cli_inner_pretty.js:2689-2691 | function |
| `q.type === "attacher-caps"` | rv-protocol message that the attaching client uses to forward terminal capabilities (hyperlinks, color level, editor, browser, etc.) | cli_inner_pretty.js:390693-390696 | protocol-tag |
| `xy` | `resolvePreferredEditor` (`attacherCaps?.editor ?? envDefaultEditor`) | cli_inner_pretty.js:445808-445810 | function |
| `dj5` | `envDefaultEditor` (memoized lookup of `$VISUAL`/`$EDITOR` and fallback search) | cli_inner_pretty.js:445829-445833 | function |
| `Lj8` | `openInEditorAsync` (the `v` shortcut handler — spawns the editor, fires-and-forgets) | cli_inner_pretty.js:445773-445806 | function |
| `Ox6` | `getEditorDisplayName` (the human-readable label shown in dialogs) | cli_inner_pretty.js:445811-445816 | function |
| `Uj5` | `GUI_EDITORS` (`["code","cursor","windsurf","codium","subl","atom","gedit","notepad++","notepad"]`) | cli_inner_pretty.js:445826 | constant |
| `Fj5` | `TERMINAL_EDITOR_REGEX` (`/\b(vi|vim|nvim|nano|emacs|pico|micro|helix|hx)\b/`) | cli_inner_pretty.js:445827 | constant |
| `gj5` | `EDITORS_NEEDING_G_FLAG` (vscode-likes that need `-g file:line`) | cli_inner_pretty.js:445828 | constant |
| `AL8` | `isClaudeInChromeEnabled` (returns false in non-TTY workers via `T6()` check — keeps Chrome shim out of unattached bg sessions) | cli_inner_pretty.js:493305-493314 | function |
| `daH` | `isClaudeInChromeAutoEnableEligible` (only when interactive) | cli_inner_pretty.js:493315-493322 | function |
| `T6` | `isNonInteractive` | cli_inner_pretty.js:2677-2679 | function |
| `Xv` | `isInteractive` | cli_inner_pretty.js:2680-2682 | function |
| `oV8` | `setIsInteractive` | cli_inner_pretty.js:2683-2685 | function |

---

## Module: Subagent_Type Matching (v2.1.140 case/separator insensitive) (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Zu7` | `normalizeAgentTypeSlug` (`H.normalize("NFKC").toLowerCase().replace(/[\p{White_Space}\p{Pd}_]+/gu,"")`) | cli_inner_pretty.js:351139-351143 | function |
| `Y5H` | `truncateForErrorLabel` | cli_inner_pretty.js (called from 351374) | function |
| `WV6` | `findDenyingPermissionRule` (for the deny-rule error message) | cli_inner_pretty.js (called from 351397) | function |
| `tengu_subagent_type_miss` | telemetry — Agent tool was called with an `subagent_type` that didn't match any registered agent | cli_inner_pretty.js:351379, 351407 | event-name |
| `tengu_subagent_type_normalized` | telemetry — a `subagent_type` was matched after normalization (e.g. `"Code Reviewer"` → `code-reviewer`) | cli_inner_pretty.js:351394 | event-name |
| `subagent_launch:subagent_type_not_found` | error-bucket | cli_inner_pretty.js:351408 | uH-key |
| `subagent_launch:subagent_type_ambiguous` | error-bucket | cli_inner_pretty.js:351384 | uH-key |
| `subagent_launch:subagent_type_denied` | error-bucket | cli_inner_pretty.js:351400 | uH-key |

---

## Module: Job-State Classification (v2.1.141 "Completed" vs "Working") (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `byH` | `classifyJobState` (project the saved `state`/`tempo`/in-flight tasks/background shells onto one of `working`/`blocked`/`review`/`done`) | cli_inner_pretty.js (used near 568578, 567725) | function |
| `e0$` | `spawnOriginDir` (collapse `<repo>/.claude/worktrees/X/...` back to `<repo>`) | cli_inner_pretty.js:566055-566059 | function |
| `En6` | `enclosingRepoOrSpawnOrigin` (use `BY(spawnOrigin) ?? spawnOrigin`) | cli_inner_pretty.js:566060-566063 | function |
| `HG8` | `jobMatchesCwd` (the v2.1.141 `--cwd <path>` filter — directory-contains check on spawn origin) | cli_inner_pretty.js:565822-565825 | function |
| `Qj` | `isJobSettled` (the predicate `retireIfSettled` uses to confirm a job is in a terminal state) | cli_inner_pretty.js (called from 527948) | function |
| `cT` | `isJobTerminalState` | cli_inner_pretty.js (called from 180835) | function |
| `OG8` | `isJobLongLivedRoutine` (routine/cron/loop — should never auto-retire) | cli_inner_pretty.js:566150-566152 | function |
| `HT$` | `isLoopJob` (intent or first-prompt starts with `/loop`) | cli_inner_pretty.js:566146-566149 | function |
| `Cn6` | `colorForPrStatus` (mapping pr-status → colour) | cli_inner_pretty.js (used in 566049) | function |
| `NQ4` | `iconForJobState` | cli_inner_pretty.js:566153-566158 | function |
| `tempo:"active"` | enum value | cli_inner_pretty.js:180767 | enum |
| `tempo:"idle"` | enum value | cli_inner_pretty.js:180757 | enum |
| `tempo:"blocked"` | enum value | cli_inner_pretty.js:180753 | enum |

---

## Module: Background-Agent Persistent State Schema (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aKH` | `seedJobStateRecord` (canonical empty/initial state record written when dispatching) | cli_inner_pretty.js (called from 510550, 509795, 509897) | function |
| `gz` | `writeJobStateAtomic` (lock-protected JSON write into `~/.claude/bg-sessions/<short>/state.json`) | cli_inner_pretty.js (used everywhere bg-state is written) | function |
| `o7` | `readJobState` | cli_inner_pretty.js (used at 527907, 510546, 569100) | function |
| `oW` | `deleteJobStateAtomic` (used after a stale-short conflict) | cli_inner_pretty.js (called near 509810) | function |
| `k9` | `jobStateDir` (resolve `<configDir>/bg-sessions/<short>`) | cli_inner_pretty.js (used everywhere) | function |
| `pb8` | `WORKTREE_FIELD_NAME` (`"worktree"`) | cli_inner_pretty.js:41083 | constant |
| `Ub8` | `WORKTREE_PATH_FIELD_NAME` (`"worktreePath"`) | cli_inner_pretty.js:41084 | constant |
| `Fb8` | `WORKTREE_BRANCH_FIELD_NAME` (`"worktreeBranch"`) | cli_inner_pretty.js:41085 | constant |
| `bj` | `bgSupervisorNoun` (`"daemon"` when service install enabled, else `"background service"`) | cli_inner_pretty.js:139907-139909 | function |
| `OKH` | `bgSupervisorNounCap` | cli_inner_pretty.js:139910-139912 | function |

---

## Notes on Pseudonym Reuse

- The `qq` symbol used in `AL8` and elsewhere (`isOAuthAccountConnected`) is *not* the `qqH/qqK` cluster from the prompt schemas. It's `function qq()` from `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/decls/functions/qq.js` — it tests `Cj()` (config has OAuth account) plus `vU(scopes)` (account scope flags). Chrome activation in `AL8` requires both `qq()` (Pro/Max-tier auth) and `isInteractive`.
- The on-demand daemon's `retireIfSettled` is dispatched from the daemon supervisor's `setInterval(…, Ur6=60000)` (cli_inner_pretty.js:609402-609419). The same callback is the one that calls `shiftGraceClocksForward` whenever the actual elapsed wall-clock between ticks exceeds the configured interval by more than `Ur6` — the v2.1.142 sleep/wake fix.
- The agent-view dispatcher (`mountFleetView` / `ao5`) builds a `dispatchExtraArgs` array from the parsed flags. That array is then stashed by `setDispatchExtraArgsForSession` (`MN4`) in module global `OG$`. When the user types a task into the dispatch input, `coldDispatchFromTemplate` (`yP8`) and `claimSpareOrColdDispatch` (`jN4`) prefix every spawn with `[...OG$, …]`. This is how `--add-dir`, `--settings`, `--mcp-config`, `--plugin-dir`, `--strict-mcp-config` propagate into every dispatched session.
