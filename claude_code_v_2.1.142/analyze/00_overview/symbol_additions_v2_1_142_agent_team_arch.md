# Symbol Additions — v2.1.142 Agent Team Architecture (Unit 06)

> Agent-team architecture symbols discovered in the v2.1.142 unit-06 deep dive.
> Place: this file maps the **Agent Team / Background Agent Coordinator** subsystem additions.
> When the symbol_index_*.md files are produced for v2.1.142, these mappings should be merged into:
> - `symbol_index_core_features.md` under "Agent Team" / "Background Agents" / "Hooks" / "Skills"
> - `symbol_index_infra_platform.md` under "Permissions" / "MCP" / "Daemon Lifecycle"

Cross-validated against:
- v2.1.142 bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js`
- v2.1.142 per-decl: `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/`
- v2.1.88 TypeScript: `/lyz/codespace/3rd/claude-code/src/coordinator/`, `/lyz/codespace/3rd/claude-code/src/services/`
- v2.1.112 reference module: `claude_code_v_2.1.112/analyze/30_agent_team/`
- v2.1.142 unit 08 worktree: `agent-a316534377fef3850/claude_code_v_2.1.142/analyze/30_agent_team/`

---

## Module: Daemon Supervisor & Worker Pool (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `O89` | `daemonSupervisorMain` (the long-lived supervisor loop; runs the 60s tick, brew-upgrade probe, idle exit) | cli_inner_pretty.js:609938+ | function |
| `f89` | `getBinaryFingerprint` (`realpath + stat.mtimeMs` of daemon executable) | cli_inner_pretty.js:609938-609946 | function |
| `tKA` | `binaryFingerprintChanged` (returns `true` if target moved or mtime changed; mtime check skipped under macOS App Translocation) | cli_inner_pretty.js:609948-609951 | function |
| `o$9` | `bgWorkerManager` (factory: builds the worker-pool manager state machine, returns `{handles, dispatch, leaseCount, liveHandleCount, ...}`) | cli_inner_pretty.js:609180+ | function |
| `aB.spawn` | `spawnBgWorker` (cold-path worker spawn, called when no spare matches) | cli_inner_pretty.js (referenced) | function |
| `aB.claim` | `claimBgWorker` (PTY-host claim primitive; spare claims and cold spawns both end here) | cli_inner_pretty.js (referenced) | function |
| `aB.adopt` | `adoptBgWorker` (re-adopt a worker from a previous daemon's roster on supervisor startup) | cli_inner_pretty.js (referenced) | function |
| `Fr6` | `wireBgWorkerLifecycle` (attach status-change listeners to a freshly-claimed worker) | cli_inner_pretty.js (referenced from 609286+) | function |
| `_G$` | `getLowMemThreshold` (settings-driven memory pressure threshold; below it, dispatch is gated and grace shortens) | cli_inner_pretty.js (referenced from 609412) | function |
| `Ur6` | `DAEMON_TICK_MS` (60,000) | cli_inner_pretty.js:609578 | constant |
| `gKA` | `DEFAULT_GRACE_MS` (3,600,000 = 1 hour) | cli_inner_pretty.js:609576 | constant |
| `i$9` | `LOW_MEM_GRACE_MS` (60,000 = 1 minute when memory-pressed) | cli_inner_pretty.js:609577 | constant |
| `pB5` | `EMPTY_IDLE_GRACE_MS` (300,000 = 5 minutes; v2.1.141 retire-on-idle for empty REPLs) | cli_inner_pretty.js:528606 | constant |
| `BB5` | `RECENT_ADOPT_GRACE_MS` (120,000 = 2 minutes) | cli_inner_pretty.js:528605 | constant |
| `sKA` | `IDLE_EXIT_GRACE_MS` (5,000; how long the supervisor waits idle before exiting) | cli_inner_pretty.js:610198 | constant |
| `aKA` | `STALE_CHECK_INTERVAL_MS` (60,000; how often the supervisor pinged the workers) | cli_inner_pretty.js:610197 | constant |

---

## Module: Background-Worker PTY Host (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `shiftGraceClocksForward` | `shiftGraceClocksForward` (PTY-host method: add wall-clock-jump delta to `lastInputAt` and `adoptedAt`; v2.1.142) | cli_inner_pretty.js:528143-528147 | method |
| `retireIfSettled` | `retireIfSettled` (PTY-host method: apply retire-on-idle policy; v2.1.141 added empty-idle-grace branch) | cli_inner_pretty.js:527901-527966 | method |
| `noteActivity` | `noteActivity` (PTY-host method: stamp `lastInputAt = Date.now()`) | cli_inner_pretty.js:528140-528142 | method |
| `write` | `writeKeystrokes` (PTY-host method: stamp `lastInputAt` and forward to pty) | cli_inner_pretty.js:528137-528139 | method |
| `lastInputAt` | `lastInputAt` (PTY-host field: when user last typed; gates `recent-input` retire reason) | cli_inner_pretty.js:527815 | field |
| `adoptedAt` | `adoptedAt` (PTY-host field: when daemon adopted this worker; gates `recent-adopt`) | cli_inner_pretty.js (set in constructor) | field |
| `deleteJobDirOnSettle` | `deleteJobDirOnSettle` (PTY-host field: empty-idle workers wipe their job dir on retire) | cli_inner_pretty.js:527939+ | field |

---

## Module: Pre-Warm Spare (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `b$9` | `spareWorkerModule` (J$-registered with `spawnSpare`, `runBgSpare`, `reapOrphanSpares`, `claimSpare`) | cli_inner_pretty.js:608265 | object |
| `vKA` | `runBgSpare` (entry point of a spare process: listen on claim socket, exec into worker when claimed) | cli_inner_pretty.js:608266-608326 | function |
| `br6` | `spawnSpareWorker` (daemon-side fork: PTY host + spare claimant, `detached:true, unref()`-d) | cli_inner_pretty.js:608328-608376 | function |
| `xr6` | `claimSpareWorker` (turn a live spare into an adopted real worker; sends claim frame over UDS) | cli_inner_pretty.js:608391-608439 | function |
| `ur6` | `reapOrphanSpares` (sweep `*.pty.sock` files for any not in the live roster; SIGTERM via the socket) | cli_inner_pretty.js:608441-608478 | function |
| `Cr6` | `bgSpareEntryRunner` (the actual loop running `vKA`, called inside the spare process) | cli_inner_pretty.js (referenced, dynamic import) | function |
| `kKA` | `cleanSpareEnv` (build the env for a spare: set bg session kind, clear unsafe vars, mac OAuth purge) | cli_inner_pretty.js:608380-608388 | function |
| `hKA` | `currentInvocation` (return `[bun, claude]` or `[claude]` argv prefix for re-spawning) | cli_inner_pretty.js:608476-608478 | function |
| `g_4` | `buildPtySocketPath` (`{daemonDir}/{seed}.pty.sock`) | cli_inner_pretty.js (referenced from 608331) | function |
| `Q_4` | `buildClaimSocketPath` (`{daemonDir}/{seed}.claim.sock`) | cli_inner_pretty.js (referenced from 608331) | function |
| `by` | `buildPtySocketRemoveMarker` (`{ptySock}.err` file path) | cli_inner_pretty.js (referenced from 608367) | function |
| `NKA` | `buildSpareClaimFrame` (compose `{cwd, env, argv, sessionId}` for the claim message) | cli_inner_pretty.js:608417-608420 | function |
| `EKA` | `sendClaimFrameWithRetry` (5s budget, exponential backoff against ENOENT/ECONNREFUSED) | cli_inner_pretty.js:608422-608437 | function |
| `S$9` | `SPARE_CLAIM_RETRY_DELAYS` (`[50, 100, 150, 200, 250, 300, 400, 500, 500, 500]`) | cli_inner_pretty.js:608485 | constant |

---

## Module: Telemetry Events (Agent Team / Daemon)

| Event Name | Source | Trigger | Notes |
|-----------|--------|---------|-------|
| `tengu_daemon_start` | `O89` (supervisor) | Supervisor finished bootstrap | Carries `worker_kinds`, `worker_count`, `origin` |
| `tengu_daemon_idle_exit` | `O89` (idle-exit closure `x`) | No clients + no workers for `sKA = 5s` | Carries `grace_ms`, `cfg_workers` |
| `tengu_daemon_self_restart_on_upgrade` | `O89` after `C()` returns true | Binary fingerprint changed | v2.1.142 — gated `brew upgrade` cleanup |
| `tengu_daemon_lease` | `o$9` lease open/close hooks | Control connection opened/closed | Carries `op`, `label` |
| `tengu_daemon_yield` | `O89` `h()` callback | Transient daemon yielded to a service/foreground daemon | |
| `tengu_daemon_yield_takeover` | `O89` startup | Transient yield acked; took the lock | |
| `tengu_daemon_peer_uid_reject` | `x$9` | Foreign-UID connect attempt rejected | |
| `tengu_daemon_worker_crash` | `o$9` worker exit handler | Worker exited with non-zero | |
| `tengu_daemon_worker_permanent_exit` | `o$9` worker exit handler | Worker exit too many times in a row | |
| `tengu_daemon_install` | `O89` service install path | Service-mode daemon installed | |
| `tengu_bg_retired` | PTY-host `retireIfSettled` | Worker hit retire criteria | Carries `short`, `rvSent`, `settledForMs`, `state` |
| `tengu_bg_spare_spawn` | `o$9` refill closure `D` | Spawned a new spare | |
| `tengu_bg_spare_claim` | `o$9` dispatch `j` | Claimed an existing spare | Carries `age_ms` |
| `tengu_bg_spare_claim_fail` | `o$9` dispatch `j` | Spare claim attempt failed | Carries `reason` |
| `tengu_bg_orphan_reap` | `aB.adopt` startup | Roster-less workers reaped | Carries `reaped` |
| `tengu_bg_adopt` | `aB.adopt` | Workers adopted from previous daemon | Carries `adopted`, `dead` |
| `tengu_bg_dispatch_low_mem` | `o$9` dispatch `j` | Memory-pressure dispatch deferred | Carries `free_mb`, `handles` |
| `tengu_bg_dispatch_sigkill_escalate` | `o$9` dispatch `j` | Existing handle wouldn't stop on SIGTERM | |
| `tengu_bg_daemon_zombie_restart` | `o$9` zombie handling | Worker was a zombie; restarted | |
| `tengu_bg_daemon_install` | Daemon install command | User installed daemon as a service | |
| `tengu_bg_sendclaim_failed` | `xr6` | Claim frame send failed; killed the spare | Carries `errno`, `error` |

---

## Module: Mailbox Protocol (v2.1.142 names; cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `w77` | `mailboxModule` (the J$-registered protocol export object) | cli_inner_pretty.js:239086 | object |
| `cA` | `writeToMailbox` (locked append) | cli_inner_pretty.js:239157-239196 | function |
| `o7H` | `readMailbox` (full read with ENOENT-as-empty) | cli_inner_pretty.js:239146-239155 | function |
| `FTH` | `readUnreadMessages` (filter to `!read`) | cli_inner_pretty.js:239141-239145 | function |
| `mO$` | `markMessageAsReadByIndex` (flip one record's `read` bit under lock) | cli_inner_pretty.js:239197+ | function |
| `BO$` | `markMessagesAsRead` (mark all current as read) | cli_inner_pretty.js (referenced from `w77`) | function |
| `vD6` | `markMessagesAsReadByPredicate` (mark all matching by callback) | cli_inner_pretty.js:239491-239510 | function |
| `pO$` | `clearMailbox` (wipe an inbox file) | cli_inner_pretty.js (referenced from `w77`) | function |
| `UTH` | `getInboxPath` (`~/.claude/{team}/inboxes/{agent}.json`) | cli_inner_pretty.js:239131-239139 | function |
| `Lf_` | `ensureInboxDirectory` (`mkdir -p` for `inboxes/`) | cli_inner_pretty.js:239141-239145 | function |
| `c68` | `isStructuredProtocolMessage` (enumerates the 10 wire types) | cli_inner_pretty.js:239470-239489 | function |
| `FO$` | `isIdleNotification` (separate from c68) | cli_inner_pretty.js:239291+ | function |
| `F68` | `isTaskAssignment` (separate from c68) | cli_inner_pretty.js (referenced from `w77`) | function |
| `g68` | `isTeamPermissionUpdate` | cli_inner_pretty.js (referenced from `w77`) | function |
| `d68` | `isModeSetRequest` (parser; uses M77 schema) | cli_inner_pretty.js:239465-239468 | function |
| `Q68` | `createModeSetRequestMessage` | cli_inner_pretty.js:239460-239463 | function |
| `sOH` | `isShutdownRequest` | cli_inner_pretty.js (referenced from `w77`) | function |
| `bI` | `isShutdownApproved` | cli_inner_pretty.js (referenced from `w77`) | function |
| `U68` | `isShutdownRejected` | cli_inner_pretty.js (referenced from `w77`) | function |
| `p68` | `sendShutdownRequestToMailbox` | cli_inner_pretty.js:239401-239460 | function |
| `dO$` | `getLastPeerDmSummary` (TUI helper: most-recent non-lead DM) | cli_inner_pretty.js:239511+ | function |
| `Pf_` | `formatTeammateMessages` (XML wrapping for prompt injection) | cli_inner_pretty.js:239268-239290 | function |
| `OQH` | `createShutdownRequestMessage` | cli_inner_pretty.js (referenced from `w77`) | function |
| `TD6` | `createShutdownApprovedMessage` | cli_inner_pretty.js (referenced from `w77`) | function |
| `VD6` | `createShutdownRejectedMessage` | cli_inner_pretty.js (referenced from `w77`) | function |
| `ZD6` | `createSandboxPermissionRequestMessage` | cli_inner_pretty.js (referenced from `w77`) | function |
| `GD6` | `createSandboxPermissionResponseMessage` | cli_inner_pretty.js (referenced from `w77`) | function |
| `PD6` | `createPermissionRequestMessage` | cli_inner_pretty.js (referenced from `w77`) | function |
| `WD6` | `createPermissionResponseMessage` | cli_inner_pretty.js (referenced from `w77`) | function |
| `UO$` | `createIdleNotification` | cli_inner_pretty.js (referenced from `w77`) | function |
| `Y77` | `ShutdownRequestMessageSchema` | cli_inner_pretty.js (referenced from `w77`) | object |
| `O77` | `ShutdownRejectedMessageSchema` | cli_inner_pretty.js (referenced from `w77`) | object |
| `f77` | `ShutdownApprovedMessageSchema` | cli_inner_pretty.js (referenced from `w77`) | object |
| `z77` | `PlanApprovalResponseMessageSchema` | cli_inner_pretty.js (referenced from `w77`) | object |
| `A77` | `PlanApprovalRequestMessageSchema` | cli_inner_pretty.js (referenced from `w77`) | object |
| `M77` | `ModeSetRequestMessageSchema` | cli_inner_pretty.js (referenced from `w77`) | object |
| `az` | `LEAD_NAME` (`"team-lead"` constant; was `Mz` in v2.1.112) | cli_inner_pretty.js:239080 | constant |
| `pC` | `SWARM_SESSION` (`"claude-swarm"` tmux session name; was `Ny` in v2.1.112) | cli_inner_pretty.js:239081 | constant |
| `mZ` | `SendMessageToolName` (`"SendMessage"`) | cli_inner_pretty.js:211565 | constant |
| `IW` | `TeammateMessageXmlTag` (`"teammate-message"`) | cli_inner_pretty.js:41088 | constant |
| `fQH` | `TEAMMATE_COMMAND_ENV` (`"CLAUDE_CODE_TEAMMATE_COMMAND"`) | cli_inner_pretty.js:239084 | constant |
| `zQH` | `SWARM_VIEW_NAME` (`"swarm-view"`) | cli_inner_pretty.js:239082 | constant |
| `LD6` | `CLAUDE_HIDDEN_NAME` (`"claude-hidden"`) | cli_inner_pretty.js:239083 | constant |
| `UC` | `TMUX_BACKEND_NAME` (`"tmux"`) | cli_inner_pretty.js:239082 | constant |
| `ui7` | `parseMailboxAddress` (parses `uds:` / `bridge:` / `/`-prefixed-uds / other) | cli_inner_pretty.js:386620-386626 | function |

---

## Module: SendMessage Tool (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `SH5` | `SendMessageTool` (the Claude-facing tool definition for `SendMessage`) | cli_inner_pretty.js:386848+ | object |
| `Qi7` | `SendMessageModule` (J$-registered exports) | cli_inner_pretty.js:386846 | object |
| `uiH` | `dispatchTeammateMessage` (the call handler) | cli_inner_pretty.js:386626+ | function |
| `ZH5` | `validateSendMessageInput` (the `validateInput` body; rejects `to: "*"`, validates schemes) | cli_inner_pretty.js:386453+ | function |
| `mZ` | `SendMessageToolName` (`"SendMessage"` constant) | cli_inner_pretty.js:211565 | constant |

---

## Module: Permission-Mode Inheritance (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `CD6` | `inheritPermissionModeForTeammate` (plan/dontAsk → default; plan-required → plan; everything else inherits) | cli_inner_pretty.js:240330-240334 | function |
| `rgK` | `resolvePermissionMode` (composes CLI/env/settings/frontmatter into final mode with notification) | cli_inner_pretty.js:198981-199046 | function |
| `zR6` | `wrapResolvePermissionMode` (adds CLAUDE_CODE_SUBPROCESS_ENV_SCRUB hardening) | cli_inner_pretty.js:422449-422466 | function |
| `Rv` | `normalizePermissionMode` (validates mode string, mapping aliases) | cli_inner_pretty.js (referenced from rgK) | function |
| `aW` | `hasEnvScrubbing` (CLAUDE_CODE_SUBPROCESS_ENV_SCRUB gate) | cli_inner_pretty.js (referenced from zR6) | function |
| `$t1` | `isAutoModeCircuitBreakerOpen` (auto-mode kill switch) | cli_inner_pretty.js:198977-198980 | function |
| `Oq` | `getEffectiveSettings` (cache of the merged settings tree) | cli_inner_pretty.js (referenced from zR6) | function |
| `agK` | `resolveModel` (parallel resolver for the model field) | cli_inner_pretty.js:199052-199063 | function |
| `ogK` | `resolveFallbackModel` (parallel resolver for fallbackModel) | cli_inner_pretty.js:199047-199051 | function |
| `sgK` | `resolveSystemPrompt` (parallel resolver for systemPrompt overrides) | cli_inner_pretty.js:199064-199076 | function |

---

## Module: Worktree Isolation (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `DE6` | `enterExistingWorktreeForSession` (v2.1.105 path: attach to existing worktree via `--path`) | cli_inner_pretty.js:523107-523145 | function |
| `eJ$` | `createOrAttachWorktreeForSession` (top-level entry: create OR hook-based dispatch) | cli_inner_pretty.js:523392+ | function |
| `yQ6` | `cleanupStaleAgentWorktrees` (v2.1.142 untracked-file detection in stale sweep) | cli_inner_pretty.js:523310-523355 | function |
| `FkH` | `exitWorktreeAndKeep` (`action: "keep"`) | cli_inner_pretty.js:523146-523158 | function |
| `CiH` | `exitWorktreeAndRemove` (`action: "remove"`, gated by `enteredExisting`) | cli_inner_pretty.js:523159-523200 | function |
| `qn7` | `EnterWorktreeTool` (the tool definition body) | cli_inner_pretty.js:384003-384062 | object |
| `kFH` | `EnterWorktreeName` (`"EnterWorktree"`) | cli_inner_pretty.js:211570 | constant |
| `Ee_` | `EnterWorktreeInputSchema` (Zod schema with `.refine` for name-vs-path mutex) | cli_inner_pretty.js (referenced from qn7) | function |
| `ye_` | `EnterWorktreeOutputSchema` | cli_inner_pretty.js (referenced from qn7) | function |
| `_n7` | `ExitWorktreePromptBody` (the long-form tool prompt) | cli_inner_pretty.js:384062+ | function |
| `NP8` | `listWorktrees` (parse `git worktree list --porcelain`) | cli_inner_pretty.js (referenced from DE6) | function |
| `oz` | `getCurrentSessionWorktreeContext` (read the session-state slot) | cli_inner_pretty.js (referenced from many sites) | function |
| `$JH` | `setSessionWorktreeContext` (write the session-state slot) | cli_inner_pretty.js (referenced from many sites) | function |
| `xRH` | `isSubagentWithCwdOverride` (predicate gating EnterWorktree refusal in subagents) | cli_inner_pretty.js (referenced from 384018) | function |
| `BY` | `findGitRoot` | cli_inner_pretty.js (referenced) | function |
| `I$` | `currentWorkingDirectory` | cli_inner_pretty.js (referenced) | function |
| `du5` | `STALE_WORKTREE_NAME_REGEX_LIST` | cli_inner_pretty.js (referenced from yQ6) | constant |
| `nwH` | `removeAgentWorktree` (the actual git worktree remove + dir cleanup) | cli_inner_pretty.js (referenced from yQ6) | function |
| `cu5` | `isHeadSquashMergedInto` (check HEAD has been squash-merged into a remote) | cli_inner_pretty.js (referenced from yQ6) | function |
| `jh4` | `findSquashMergedRevision` (read the squash-merge marker file from worktree metadata) | cli_inner_pretty.js (referenced from yQ6) | function |
| `lu5` | `resolveOriginDefaultBranch` (origin/HEAD with origin/main fallback) | cli_inner_pretty.js:523295+ | function |

---

## Module: Tool / MCP / Skill / Hook Inheritance (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `QM6` | `agentMcpSpecsToScopedConfigs` (extract frontmatter `mcpServers` into a `{name: config}` dict; gates by source) | cli_inner_pretty.js:231939-231960 | function |
| `htH` | `mergeAgentMcpConfigs` (merge into session MCP pool; session wins on conflict; strictMcpConfig short-circuits) | cli_inner_pretty.js:585945-585952 | function |
| `te` | `applyMcpAllowDenyRules` (filter `{allowed, blocked}` per managed allowlists) | cli_inner_pretty.js (referenced) | function |
| `KQ` | `isManagedNoMcp` (hard managed-policy block on dynamic MCP) | cli_inner_pretty.js (referenced) | function |
| `DX` | `isPolicyEnforced` (managed-feature gate: `mcp`, `hooks`, `skills`, …) | cli_inner_pretty.js (referenced) | function |
| `B7H` | `isPluginSourced` (agent.source === "plugin"; used for strict-plugin-only gating) | cli_inner_pretty.js (referenced) | function |
| `c85` | `findSkillByName` (3-tier subagent skill resolver: exact, plugin-qualified, suffix-match) | cli_inner_pretty.js:393461-393472 | function |
| `gL$` | `skillExists` (predicate against available skill array) | cli_inner_pretty.js (referenced from c85) | function |
| `u7` | `extractPluginPrefix` (split agentType on ":", return the prefix) | cli_inner_pretty.js (referenced from c85) | function |
| `d85` | `buildAgentSystemPromptWithSkills` (build subagent system prompt, loading frontmatter skills) | cli_inner_pretty.js:393451-393460 | function |
| `HX$` | `processSkillsForPrompt` (parse `:skill` references in prompt text and inline) | cli_inner_pretty.js (referenced from d85) | function |
| `eo7` | `registerHooksFromSource` (register hooks against a registry from a source's hooks map) | cli_inner_pretty.js (referenced) | function |
| `gv8` | `setSessionSkillAllowlist` (write the slot) | cli_inner_pretty.js:3095-3097 | function |
| `Np` | `getSessionSkillAllowlist` (read the slot) | cli_inner_pretty.js:3092-3094 | function |
| `vp` | `setMainThreadAgentType` (write `mainThreadAgentType`) | cli_inner_pretty.js:3079-3082 | function |
| `kp` | `getMainThreadAgentHooks` (read `mainThreadAgentHooks` slot) | cli_inner_pretty.js:3084-3087 | function |
| `dv$` | `setMainThreadAgentHooks` (write `mainThreadAgentHooks` slot) | cli_inner_pretty.js:3088-3091 | function |
| `mainThreadAgentType` | `mainThreadAgentType` (app-state field, set when `--agent` resolves) | cli_inner_pretty.js:2282 | field |
| `mainThreadAgentHooks` | `mainThreadAgentHooks` (app-state field for `--agent` hook injection) | cli_inner_pretty.js:2283 | field |
| `Si6` | `findAgentByType` (look up agent definition by `agentType`) | cli_inner_pretty.js:583135-583144 | function |

---

## Module: Spawn Path (v2.1.142, paralleling v2.1.112's `n7Y`/`j2K`/`c7Y`/`l7Y`)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `LF_` | `spawnTeammateDispatcher` (v2.1.142 — `n7Y` in v2.1.112) | cli_inner_pretty.js:337398-337408 | function |
| `tI7` | `spawnTeammateAlias` (re-export of `LF_`) | cli_inner_pretty.js:337409-337411 | function |
| `JF_` | `spawnSplitPaneTeammate` (was `c7Y` in v2.1.112) | cli_inner_pretty.js:337020-337129 | function |
| `XF_` | `spawnTmuxTeammate` (was `l7Y` in v2.1.112) | cli_inner_pretty.js:337131-337277 | function |
| `rI7` | `spawnInProcessTeammate` (was `j2K` in v2.1.112) | cli_inner_pretty.js:337279-337397 | function |
| `t68` | `spawnInProcessHelper` (was `cI8` in v2.1.112) | cli_inner_pretty.js:240335-240395 | function |
| `Ji` | `isInProcessExecutorEnabled` (was `bF()` in v2.1.112) | cli_inner_pretty.js:397176-397190 | function |
| `T6` | `isNonInteractiveSession` (gates Ji to true unconditionally for batch/SDK) | cli_inner_pretty.js (referenced from Ji) | function |
| `i06` | `enableInProcessFallback` (was `h77` in v2.1.112) | cli_inner_pretty.js:397173-397175 | function |
| `ywH` | `probePaneBackend` (was `v96` in v2.1.112) | cli_inner_pretty.js:397065+ | function |
| `QvH` | `getTeammateMode` (was `UX6` in v2.1.112) | cli_inner_pretty.js (referenced from LF_) | function |
| `k65` | `getTeammateModeAlias` (re-exports QvH) | cli_inner_pretty.js:397171-397173 | function |
| `cTH` | `isInsideTmux` (env-based detection) | cli_inner_pretty.js (referenced from Ji) | function |
| `Ke` | `isInsideITerm2` (env-based detection) | cli_inner_pretty.js (referenced from Ji) | function |
| `In` | `deriveAgentId` (was `op` in v2.1.112; agent ID = sanitized hash of name+team) | cli_inner_pretty.js:239067+ | function |
| `xI` | `genTaskId` (`xI("in_process_teammate")`) | cli_inner_pretty.js:518757+ | function |
| `IxH` | `registerInProcessTask` (was `M2K` in v2.1.112) | cli_inner_pretty.js:97768+ | function |

---

## Module: Bg-Worker Environment & Isolation (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (inline at 527744) | `setBgWorkerIsolation` (`if (H.isolation === "worktree") env.CLAUDE_BG_ISOLATION = "worktree";`) | cli_inner_pretty.js:527744 | inline |
| (env var) | `CLAUDE_BG_ISOLATION` (`"worktree"` when set; consumed by worker startup) | runtime | env var |
| (env var) | `CLAUDE_BG_BACKEND` (`"daemon"` when daemon-dispatched) | runtime | env var |
| (env var) | `CLAUDE_BG_SOURCE` (dispatch.source: `spare`, `shell`, `agent`, etc.) | runtime | env var |
| (env var) | `CLAUDE_JOB_DIR` (per-worker job directory) | runtime | env var |
| (env var) | `CLAUDE_BG_RENDEZVOUS_SOCK` (UDS path for control channel) | runtime | env var |
| (env var) | `CLAUDE_CODE_SESSION_KIND` (`"bg"` for bg workers; `"interactive"` else) | runtime | env var |
| (env var) | `CLAUDE_CODE_SESSION_NAME` | runtime | env var |
| (env var) | `CLAUDE_ENABLE_STREAM_WATCHDOG` (`"1"`; always set for bg workers) | runtime | env var |

---

## Module: Settings Keys Relevant to Architecture

| Key | Type | Notes |
|-----|------|------|
| `channelsEnabled` | boolean | Managed-org opt-in for MCP-pushed channel notifications |
| `allowedChannelPlugins` | array | Allowlist replacing Anthropic default channel-plugin allowlist |
| `permissions.disableBypassPermissionsMode` | "disable" | Org policy: forbid `--dangerously-skip-permissions` |
| `permissions.defaultMode` | enum | Session-default permission mode |
| `experimental.strictPluginOnlyCustomization` | boolean | Forbid frontmatter MCP/hooks for non-plugin agents |
| `teammateMode` | "auto" / "in-process" / "tmux" | Default teammate spawn backend |
| `worktree.baseRef` | "fresh" / "head" | Where new worktrees branch from |
| `daemonColdStart` | "transient" / "service" / "off" | Daemon cold-start policy |

---

## Cross-References

For details on **how** these symbols compose, see:
- [coordinator_process_model.md](../30_agent_team/coordinator_process_model.md) — daemon loop, 60s tick, clock-jump, brew-upgrade
- [mailbox_protocol.md](../30_agent_team/mailbox_protocol.md) — File IPC envelope, lock semantics, message types
- [team_mailbox_v_personal.md](../30_agent_team/team_mailbox_v_personal.md) — Per-recipient files, broadcast removal, channels, bridge
- [permission_inheritance.md](../30_agent_team/permission_inheritance.md) — `CD6`/`rgK` and dispatch-defaults persistence
- [worktree_isolation.md](../30_agent_team/worktree_isolation.md) — `DE6`/`yQ6` and `--add-dir` inheritance
- [tool_inheritance.md](../30_agent_team/tool_inheritance.md) — `QM6`/`htH`/`c85` and frontmatter MCP/skills/hooks
