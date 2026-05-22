# Symbol Index — Core Features (v2.1.113 → v2.1.142)

This index catalogs obfuscated → readable mappings for the **core feature** symbols introduced or changed between v2.1.113 and v2.1.142. Scope: Plan Mode, Background Agents, /goal, Todo, Compact, Hooks, Skills, Thinking, Steering, CLI.

For other categories see:

- [`symbol_index_core_execution.md`](symbol_index_core_execution.md) — Agent Loop, Tools, LLM API, Agents, Subagent, State
- [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) — MCP, Permissions, Sandbox, Auth, Model, Prompt, Telemetry
- [`symbol_index_infra_integration.md`](symbol_index_infra_integration.md) — LSP, Chrome, IDE, UI, Plugin, Code Indexing, Shell Parser, Slash Commands

## File:Line Format

For v2.1.142, the canonical source citation is `cli_inner_pretty.js:<line>`. (The older multi-`chunks.NN.mjs` split is gone in this release; v2.1.142 uses a single ~611K-line bundle.) Where per-decl isolated files are useful, the `cli_unpack_pretty/decls/functions/<obfuscated>.js` path can be used instead.

---

## Module: Plan Mode

The `/plan` command, `EnterPlanMode`/`ExitPlanMode` tools, plan-file naming and persistence, plan-mode permission overlay, `ExitPlanMode` re-entry, plan-mode write floor, ultraplan integration.

### Tools

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bf` | `isPlanModeInterviewPhaseEnabled` | cli_inner_pretty.js:383640 | function |
| `dc7` | `EXIT_PLAN_MODE_V2_TOOL_PROMPT` | cli_inner_pretty.js:381657 | constant |
| `il7` | `renderEnterPlanModeToolUseMessage` | cli_inner_pretty.js:383828 | function |
| `kZ` | `EXIT_PLAN_MODE_TOOL_NAME` (legacy alias) | cli_inner_pretty.js:143086 | constant |
| `ke_` | `enterPlanModeOutputSchema` | cli_inner_pretty.js:383797 | constant (Zod schema) |
| `lc7` | `renderExitPlanModeToolResultMessage` | cli_inner_pretty.js:381707 | function |
| `ll7` | `getEnterPlanModeToolPrompt` | cli_inner_pretty.js:383806 | function |
| `lt_` | `allowedPromptSchema` | cli_inner_pretty.js:381606 | constant (Zod schema) |
| `N53` | `exitPlanMode_sdkInputSchema` | cli_inner_pretty.js:381624 | constant (Zod schema) |
| `nc7` | `renderExitPlanModeToolUseRejectedMessage` | cli_inner_pretty.js:381708 | function |
| `nt_` | `exitPlanModeOutputSchema` | cli_inner_pretty.js:381630 | constant (Zod schema) |
| `NZ` | `EXIT_PLAN_MODE_V2_TOOL_NAME` | cli_inner_pretty.js:143087 | constant |
| `ol7` | `renderEnterPlanModeToolUseRejectedMessage` | cli_inner_pretty.js:383830 | function |
| `Q38` | `EnterPlanModeTool` | cli_inner_pretty.js:383798 | object (tool) |
| `Q3H` | `ENTER_PLAN_MODE_TOOL_NAME` (= `"EnterPlanMode"`) | cli_inner_pretty.js:211429 | constant |
| `rl7` | `renderEnterPlanModeToolResultMessage` | cli_inner_pretty.js:383829 | function |
| `sc7` | `exitPlanModeInputSchema` | cli_inner_pretty.js:381612 | constant (Zod schema) |
| `V2` | `ExitPlanModeV2Tool` | cli_inner_pretty.js:381649 | object (tool) |
| `v9H` | `autoModeStateModule` (lazy ref inside `V2.call`) | cli_inner_pretty.js:381713 | module ref |
| `ve_` | `enterPlanModeInputSchema` | cli_inner_pretty.js:383796 | constant (Zod schema) |
| `x38` | `permissionSetupModule` (lazy ref inside `V2.call`) | cli_inner_pretty.js:381714 | module ref |
| `cc7` | `renderExitPlanModeToolUseMessage` | cli_inner_pretty.js:381706 | function |

### Plan File / Slug

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$y4` | `copyPlanForFork` | cli_inner_pretty.js:517700 | async function |
| `ax5` | `findFileSnapshotEntry` | cli_inner_pretty.js:517742 | function |
| `gh1` | `VERBS` | cli_inner_pretty.js:139002+ | constant (array) |
| `GTK` | `NOUNS` | cli_inner_pretty.js:139002+ | constant (array) |
| `haH` | `getPlanSlugForSession` (cache reader) | cli_inner_pretty.js:517648 | function |
| `Hy4` | `getSlugFromLog` | cli_inner_pretty.js:517671 | function |
| `HW` | `getPlan` | cli_inner_pretty.js:517662 | function |
| `k5$` | `pickRandom` | cli_inner_pretty.js:138978 | function |
| `Li$` | `generateWordSlug` (3-word slug) | cli_inner_pretty.js:138981 | function |
| `nmH` | `generateShortWordSlug` (2-word slug) | cli_inner_pretty.js:138997 | function |
| `ox5` | `recoverPlanFromMessages` | cli_inner_pretty.js:517714 | function |
| `PDH` | `getPlanSlug` (with promptSeed) | cli_inner_pretty.js:517632 | function |
| `Qh1` | `randomInt` (crypto-backed) | cli_inner_pretty.js:138975 | function |
| `RA8` | `copyPlanForResume` | cli_inner_pretty.js:517674 | async function |
| `rx5` | `MAX_SLUG_RETRIES` (= `10`) | cli_inner_pretty.js:517776 | constant |
| `SO` | `getPlansDirectory` | cli_inner_pretty.js:517791 | function |
| `Sq6` | `slugifyPrompt` | cli_inner_pretty.js:138987 | function |
| `tg6` | `setPlanSlug` | cli_inner_pretty.js:517651 | function |
| `u38` | `persistFileSnapshotIfRemote` | cli_inner_pretty.js:517750 | async function |
| `u74` | `clearAllPlanSlugs` | cli_inner_pretty.js:517654 | function |
| `v2` | `getPlanFilePath` | cli_inner_pretty.js:517657 | function |
| `ZTK` | `ADJECTIVES` | cli_inner_pretty.js:139005+ | constant (array) |

### Plan-mode State (U$ globals)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bv8` | `getNeedsAutoModeExitAttachment` | cli_inner_pretty.js:2965 | function (getter) |
| `Cv8` | `getNeedsPlanModeExitAttachment` | cli_inner_pretty.js:2955 | function (getter) |
| `HH$` | `hasExitedPlanModeInSession` | cli_inner_pretty.js:2949 | function (getter) |
| `i_H` | `getPlanSlugCache` (returns Map) | cli_inner_pretty.js:3024 | function |
| `MT` | `setNeedsAutoModeExitAttachment` | cli_inner_pretty.js:2968 | function (setter) |
| `Oo` | `handlePlanModeTransition` | cli_inner_pretty.js:2961 | function |
| `OT` | `setHasExitedPlanMode` | cli_inner_pretty.js:2952 | function (setter) |
| `qh` | `setNeedsPlanModeExitAttachment` | cli_inner_pretty.js:2958 | function (setter) |
| `U$.hasExitedPlanMode` | (state field) | cli_inner_pretty.js:2270 | flag |
| `U$.needsAutoModeExitAttachment` | (state field) | cli_inner_pretty.js:2272 | flag |
| `U$.needsPlanModeExitAttachment` | (state field) | cli_inner_pretty.js:2271 | flag |
| `U$.planSlugCache` | (state field) | cli_inner_pretty.js:2276 | Map<SessionId,string> |
| `xv8` | `handleAutoModeTransition` | cli_inner_pretty.js:2971 | function |

### Plan-mode Attachment Builder

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bs7` | `countTurnsSinceLastPlanAttachment` | cli_inner_pretty.js:397699 | function |
| `c65` | `buildPlanModeExitAttachment` | cli_inner_pretty.js:397750 | async function |
| `d65` | `buildPlanModeAttachment` | cli_inner_pretty.js:397726 | async function |
| `i65` | `buildAutoModeExitAttachment` | cli_inner_pretty.js:397799+ | async function |
| `Is7` | `PLAN_MODE` (config constants) | (referenced from `d65`) | object/constants |
| `l65` | `countAutoModeAttachmentsSinceExit` | cli_inner_pretty.js:397772 | function |
| `n65` | `buildAutoModeAttachment` | cli_inner_pretty.js:397783 | async function |
| `Q65` | `countPlanModeAttachmentsSinceExit` | cli_inner_pretty.js:397715 | function |
| `Ss7` | `AUTO_MODE` (config constants) | (parallel of `Is7`) | object/constants |
| `xs7` | `countTurnsSinceLastAutoAttachment` | cli_inner_pretty.js:397759 | function |
| `planSlugSeed` | (slash-command option key) | cli_inner_pretty.js:353293 | option key |

### Plan-mode Permission Helpers / Auto-Mode

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `dA5` | `setPermissionModeWithGuards` | cli_inner_pretty.js:422400 | function |
| `eHH` | `getAutoModeUnavailableReason` | cli_inner_pretty.js:422675 | function |
| `KG` | `isAutoModeGateEnabled` | cli_inner_pretty.js:422669 | function |
| `tHH` | `transitionPermissionMode` | cli_inner_pretty.js:422385 | function |
| `TdH` | `transitionPlanAutoMode` | cli_inner_pretty.js:422736 | function |
| `UkH` | `prepareContextForPlanMode` | cli_inner_pretty.js:422720 | function |
| `zR6` | `initialPermissionModeFromCLI` / `resolvePermissionMode` | cli_inner_pretty.js:422449 | function |

### Plan-mode `/plan` Slash Command + Re-entry (v2.1.119 fix)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Pv5` | `PlanPreviewComponent` | cli_inner_pretty.js:483777 | React component |
| `Wv5` | `planSlashCommandHandler` | cli_inner_pretty.js:483806 | async function |
| `Zv5` | `planSlashCommandDef` | cli_inner_pretty.js:483872 | command definition |

### Plan-mode Session Restore (v2.1.132 fix)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `mr5` | `restoreModel` | cli_inner_pretty.js:564231 | function |
| `nZ8` | `sessionRestore` | cli_inner_pretty.js:564282 | async function |
| `OI7` | `buildControlRequestEvents` | cli_inner_pretty.js:335076 | function |
| `permissionModeCliSet` | (option-bag flag) | cli_inner_pretty.js:607273 | boolean |
| `ur5` | `restoreFromTranscriptPermissionMode` | cli_inner_pretty.js:564219 | async function |

### Plan-mode Write Permission Floor (v2.1.136 fix)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `d64` | `isPlanModeFloorReason` (v2.1.136-new predicate) | cli_inner_pretty.js:421723 | function |
| `dw8` | `isAskRuleReason` | cli_inner_pretty.js:421716 | function |
| `hG$` | `generateSuggestions` | cli_inner_pretty.js:518287 | function |
| `iUH` | `checkEditableInternalPath` | cli_inner_pretty.js:518335 | function |
| `jDH` | `checkPermissionsGate` (alt) | cli_inner_pretty.js:421726 | async function |
| `RQ` | `findInDecisionReasons` | cli_inner_pretty.js:421865 | function |
| `si$` | `CLAUDE_FOLDER_PERMISSION_PATTERN` | (constant) | constant |
| `tD` | `applyHookPermissionDecision` (with auto-mode classifier fast-path) | cli_inner_pretty.js:421879 | function |
| `ti$` | `GLOBAL_CLAUDE_FOLDER_PERMISSION_PATTERN` | (constant) | constant |
| `UA5` | `checkPermissionsGate` (pre-dispatch) | cli_inner_pretty.js:421757 | async function |
| `VkH` | `checkWritePermissionForTool` | cli_inner_pretty.js:518202 | function |

### Plan-mode Ultraplan Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `a05` | `extractTeleportPlan` | cli_inner_pretty.js:475237 | function |
| `dj4` | `contentToText` | cli_inner_pretty.js:475234 | function |
| `Fj4` | `POLL_INTERVAL_MS` (= `3000`) | cli_inner_pretty.js:475261 | constant |
| `gj4` | `ExitPlanModeScanner` | cli_inner_pretty.js:475135 | class |
| `o05` | `ULTRAPLAN_TELEPORT_SENTINEL` (= `"__ULTRAPLAN_TELEPORT_LOCAL__"`) | cli_inner_pretty.js:475264 | constant |
| `Qj4` | `pollForApprovedExitPlanMode` | cli_inner_pretty.js:475178 | async function |
| `r05` | `MAX_CONSECUTIVE_FAILURES` (= `5`) | cli_inner_pretty.js:475262 | constant |
| `s05` | `extractApprovedPlan` | cli_inner_pretty.js:475245 | function |
| `sQ` | `isUltraplanAvailable` | cli_inner_pretty.js:475282 | function |
| `T$H` | `UltraplanPollError` | cli_inner_pretty.js:475269 | class |

Known new symbols (`/ultraplan` promotion — see `40_ant_promoted/10_promoted_ultraplan.md`):

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `sQ` | `isUltraplanEnabled` | cli_inner_pretty.js:475282 | function |
| `YdH` | `isCloudCodeRunnerBridgeAvailable` | cli_inner_pretty.js:272755 | function |
| `I6` | `isCurrentlyInRemoteWorkspace` | cli_inner_pretty.js:3104 | function |
| `$J4` | `ultraplanSlashCommand` | cli_inner_pretty.js:475814 | object |
| `DT5` | `ultraplanCallImpl` | cli_inner_pretty.js:~475730 | function |
| `JX8` | `getUltraplanShape` | cli_inner_pretty.js:~475790 | function |
| `pjH` | `CCR_TERMS_URL` | cli_inner_pretty.js:~475818 | constant |

Known new themes for this window:

- `/ultraplan` promoted from `feature('ULTRAPLAN')` build flag to GrowthBook runtime gate (`tengu_ultraplan_config.enabled`)
- `/plan` and `/plan open` act on existing plan when entering plan mode (v2.1.119 fix)
- Plan mode not re-applied after `ExitPlanMode` within same session (v2.1.132 fix)
- `--permission-mode` flag honored when resuming plan-mode session with `-p --continue`/`--resume` (v2.1.132)
- Plan acceptance dialog wording with `--dangerously-skip-permissions` (v2.1.118 fix)
- Plan mode blocks file writes when matching `Edit(...)` allow rule exists (v2.1.136 fix)
- Auto mode no longer overrides plan mode with "Execute immediately" (v2.1.119 fix)

---

## Module: Background Agents (claude agents)

The user-facing background sessions feature. Covers the React dashboard, dispatch UI, daemon-status formatting, attach-flow. (Daemon protocol itself is in `symbol_index_infra_platform.md`.)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_j8` | `formatExitMessage` | cli_inner_pretty.js:569095 | function |
| `disableAgentView` | `disableAgentViewSetting` | cli_inner_pretty.js:50523-50528 | settings schema |
| `CLAUDE_CODE_DISABLE_AGENT_VIEW` | (env var) | cli_inner_pretty.js:50527 | env var |
| `EQ4` | (agents dashboard React component) | cli_unpack_pretty/decls/functions/EQ4.js | React component |
| `IfH` | `setSessionTerminalTitle` | cli_inner_pretty.js:567194 | function |
| `In6` | (dashboard initial state) | cli_unpack_pretty/decls/functions/In6.js | helper |
| `jQ4` | (dispatcher recents) | cli_unpack_pretty/decls/functions/jQ4.js | helper |
| `JN4` | `agentsCommandTitle` | cli_inner_pretty.js:569095 | constant |
| `kn6` | (dashboard initial state) | cli_unpack_pretty/decls/functions/kn6.js | helper |
| `S8` | `pluralizeTask` | cli_inner_pretty.js:431077 | function |
| `vn6` | (dashboard initial state) | cli_unpack_pretty/decls/functions/vn6.js | helper |

Dashboard sibling helpers (located via `grep -l "claude agents"`, full mapping pending): `H$9`, `Lg6`, `KG$`, `O44`, `RC5`, `T$A`, `T7A`, `W7A`, `WKA`, `ao5`, `bP8`, `qm8`.

See `symbol_index_core_execution.md` Module: Agents for the CLI subcommand surface.

Known new themes:

- v2.1.139 introduction (`claude agents` Research Preview)
- v2.1.140: Completed-vs-Working state for background-shell agents
- v2.1.141: `--cwd <path>`, empty-placeholder cleanup, 5-min idle retire, onboarding text
- v2.1.142: clock-jump detection, brew-upgrade clean exit, dispatch flags, Apple Terminal color bleed

The user-facing background sessions feature. Covers the React dashboard, the on-demand daemon supervisor, dispatch flag plumbing, attach/detach handoff, and persistent state. The full v2.1.142 mapping table lives in [`symbol_additions_v2_1_142_agents.md`](symbol_additions_v2_1_142_agents.md) — the rows below are the most load-bearing entries; refer to the additions file for telemetry events and the long tail.

### Agent View & Dispatch Surface

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ao5` | `mountFleetView` | cli_inner_pretty.js:569079-569208 | function |
| `EQ4` | `FleetViewDashboard` | cli_inner_pretty.js:567084-… | function |
| `yQ4` | `mountFleetViewFromLeftArrow` | cli_inner_pretty.js:569366-569381 | function |
| `MoH` | `shouldAcceptLeftArrowToAgentView` | cli_inner_pretty.js:435227-435228 | function |
| `$1H` | `setHasUsedAgentsFleet` | cli_inner_pretty.js:435230-435233 | function |
| `fF` | `isAgentsFleetEnabled` | cli_inner_pretty.js:139882-139884 | function |
| `rmH` | `isAgentViewDisabled` | cli_inner_pretty.js:139859-139861 | function |
| `Cq6` | `consumeAgentViewRelaunchMarker` | cli_inner_pretty.js:139921-139924 | function |
| `E5$` | `AGENT_VIEW_RELAUNCH_ENV_KEY` | cli_inner_pretty.js:139925 | constant |
| `og4` | `STATE_LABELS` | cli_inner_pretty.js:569355 | constant |
| `rg4` | `STATE_BUCKET_ORDER` | cli_inner_pretty.js:569354 | constant |
| `So5` | `JOB_KIND_LABELS` | cli_inner_pretty.js:569361 | constant |
| `Go6` | `parseAgentsDispatchFlags` | cli_inner_pretty.js:65-103 | function |
| `gg4` | `coerceDispatchDefaults` | cli_inner_pretty.js:565469-565478 | function |
| `qg6` | `dispatchDefaultsToArgv` | cli_inner_pretty.js:509773-509780 | function |
| `MN4` | `setDispatchExtraArgsForSession` | cli_inner_pretty.js:509767-509769 | function |
| `OG$` | `dispatchExtraArgsState` | cli_inner_pretty.js (near 509790) | variable |

### Daemon Lifecycle

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `O89` | `runDaemonSupervisor` | cli_inner_pretty.js:609952-610186 | function |
| `f89` | `getBinaryIdentity` | cli_inner_pretty.js:609938-609947 | function |
| `tKA` | `binaryIdentityChanged` | cli_inner_pretty.js:609948-609951 | function |
| `aB` | `BgWorkerHandle` | cli_inner_pretty.js:527970-528594 | class |
| `aB.retireIfSettled` | `BgWorkerHandle.retireIfSettled` | cli_inner_pretty.js:527901-527964 | function |
| `aB.shiftGraceClocksForward` | `BgWorkerHandle.shiftGraceClocksForward` | cli_inner_pretty.js:528143-528147 | function |
| `aKA` | `STALE_BINARY_POLL_MS` (60000) | cli_inner_pretty.js:610188 | constant |
| `sKA` | `DAEMON_IDLE_GRACE_DEFAULT_MS` (5000) | cli_inner_pretty.js:610189 | constant |
| `gKA` | `BG_RETIRE_GRACE_DEFAULT_MS` (3600000) | cli_inner_pretty.js:609576 | constant |
| `Ur6` | `BG_RETIRE_TICK_MS` (60000) | cli_inner_pretty.js:609578 | constant |
| `i$9` | `BG_RETIRE_LOW_MEM_GRACE_MS` (60000) | cli_inner_pretty.js:609577 | constant |
| `BB5` | `BG_RECENT_ADOPT_GRACE_MS` (120000) | cli_inner_pretty.js:528605 | constant |
| `pB5` | `BG_EMPTY_IDLE_GRACE_MS` (300000) | cli_inner_pretty.js:528606 | constant |
| `mB5` | `BG_REATTACH_TIMEOUT_MS` (120000) | cli_inner_pretty.js:528604 | constant |

### Worktree Recognition (v2.1.142)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `DE6` | `enterExistingWorktree` | cli_inner_pretty.js:523107-523141 | function |
| `NP8` | `gitWorktreeListPorcelain` | cli_inner_pretty.js:523088-523106 | function |
| `CiH` | `cleanupWorktreeOrPreserveExisting` | cli_inner_pretty.js:523155-523197 | function |
| `eJ$` | `createAgentWorktree` | cli_inner_pretty.js:523198-… | function |

### Dispatch / Spare / Capability Forwarding

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `jN4` | `claimSpareOrColdDispatch` | cli_inner_pretty.js:509877-509921 | function |
| `yP8` | `coldDispatchFromTemplate` | cli_inner_pretty.js:509781-509834 | function |
| `RN4` | `flagsWithoutPositional` | cli_inner_pretty.js:511207-511225 | function |
| `_b5` | `BG_FLAGS_BOOLEAN` | cli_inner_pretty.js:511327-511332 | constant |
| `Pg6` | `BG_FLAGS_WITH_ARGUMENT` | cli_inner_pretty.js:511283-511326 | constant |
| `vJ` | `getAttacherCaps` | cli_inner_pretty.js:2686-2688 | function |
| `aV8` | `setAttacherCaps` | cli_inner_pretty.js:2689-2691 | function |
| `xy` | `resolvePreferredEditor` | cli_inner_pretty.js:445808-445810 | function |
| `AL8` | `isClaudeInChromeEnabled` | cli_inner_pretty.js:493305-493314 | function |
| `HG8` | `jobMatchesCwd` | cli_inner_pretty.js:565822-565825 | function |
| `e0$` | `spawnOriginDir` | cli_inner_pretty.js:566055-566059 | function |

See [`symbol_additions_v2_1_142_agents.md`](symbol_additions_v2_1_142_agents.md) for the full table (telemetry events, persistence schema, subagent-type matcher, completed-vs-working classifier).

See `symbol_index_core_execution.md` Module: Agents for the CLI subcommand surface.

Known new themes:

- v2.1.139 introduction (`claude agents` Research Preview — promoted from the ant-only `agentsPlatform` subcommand of v2.1.88)
- v2.1.140: Completed-vs-Working state for background-shell agents; subagent_type slug normalization
- v2.1.141: `--cwd <path>`, empty-placeholder cleanup, 5-min idle retire, onboarding text
- v2.1.142: clock-jump detection (`shiftGraceClocksForward`), brew-upgrade clean exit (`tKA`), pre-existing worktree recognition (`DE6`), dispatch flags (`--add-dir`/`--settings`/`--mcp-config`/`--plugin-dir`/`--strict-mcp-config`/`--permission-mode`/`--model`/`--effort`/`--dangerously-skip-permissions`), `$EDITOR` forwarding via `attacher-caps`, Chrome shim isolation, `--dangerously-skip-permissions` survives retire/wake (via `RN4` + `_b5`)

---

---

## Module: /goal Command

The session-scoped Stop-hook-as-loop. Live elapsed/turns/tokens overlay (`active_goal` event type).

### Goal command + registration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `BR5` | `goalCommand` (interactive local-jsx variant) | cli_inner_pretty.js:507850-507857 | object |
| `Gk4` | `nonInteractiveGoalModule` | cli_inner_pretty.js:507813-507843 | module |
| `Hx5` | `goalDefault` (= `BR5`; the default export) | cli_inner_pretty.js:514106 | reference |
| `mR5` | `goalNonInteractiveCall` (`pR5.call` body) | cli_inner_pretty.js:507815-507839 | function |
| `Ng6` | `goalNonInteractive` (alias reference for non-interactive registration) | cli_inner_pretty.js:514107 | reference |
| `pR5` | `goalNonInteractive` (non-interactive local variant) | cli_inner_pretty.js:507858-507869 | object |
| `T6A` | `/goal` slash command definition (`name: "goal"`) | (decl file) | object |
| `uR5` | `interactiveGoalCall` (`BR5.call` body) | cli_inner_pretty.js:507789-507806 | function |
| `UR5` | `goalDefaultExport` (= `goalCommand`) | cli_inner_pretty.js:507870 | object |
| `Vk4` | `goalCommandExports` | cli_inner_pretty.js:507845-507871 | module |
| `WE4` | `goalCommandModuleRef` | cli_inner_pretty.js:514105 | module reference |
| `Wk4` | `interactiveGoalModule` | cli_inner_pretty.js:507787-507811 | module |
| `Xx4` | (goal-command helper) | cli_unpack_pretty/decls/functions/Xx4.js | function |

### Goal core (xaH module)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aP4` | `formatHookReason` | cli_inner_pretty.js:486703-486705 | function |
| `av5` | `GOAL_HOOKS_GATE_MSG` / `goalHooksDisabledError` | cli_inner_pretty.js:486761-486762 | constant |
| `baH` | `clearGoal` | cli_inner_pretty.js:486734-486745 | function |
| `CaH` | `registerGoal` | cli_inner_pretty.js:486719-486732 | function |
| `FX8` | `STOP_HOOK_GOAL_PROMPT` (priming meta-message factory) / `goalStopHookActivationReason` | cli_inner_pretty.js:486758-486759 | function |
| `gX8` | `getStopHookPrompts` | cli_inner_pretty.js:486706-486713 | function |
| `oP4` | `getLastGoalAttachment` | cli_inner_pretty.js:486693-486702 | function |
| `ov5` | `GOAL_TRUST_GATE_MSG` / `goalUntrustedWorkspaceError` (`"/goal is only available in trusted workspaces..."`) | cli_inner_pretty.js:486760 | constant |
| `RaH` | `MAX_GOAL_CONDITION_CHARS` (= `4000`) | cli_inner_pretty.js:486756 | constant |
| `rP4` | `cryptoModule` (the `require("crypto")` import) | cli_inner_pretty.js:486771 | module |
| `rv5` | `GOAL_CLEAR_KEYWORDS` (Set) | cli_inner_pretty.js:486771 | constant |
| `sP4` | `goalStatusAttachment` | cli_inner_pretty.js:486747-486753 | function |
| `UX8` | `isClearKeyword` | cli_inner_pretty.js:486690-486692 | function |
| `xaH` | `goalCoreModule` (the `xaH = T(() => { ... })` block) | cli_inner_pretty.js:486763-486772 | module |
| `Xp6` | `goalGateCheck` | cli_inner_pretty.js:486714-486718 | function |

### Goal hook-disable detection

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `I6` | `isHeadlessMode` (also `isMainProcess` alias) | (mode module) | function |
| `km` | `isAllHooksDisabled` | cli_inner_pretty.js:240936-240938 | function |
| `Oq` | `mergedSettings` / `getCurrentSettings` | cli_inner_pretty.js:198253, 555246 | function |
| `rw` | `isAllowManagedHooksOnly` | cli_inner_pretty.js:240930-240935 | function |
| `T6` | `isTrustedWorkspace` | (settings module) | function |
| `_5` | `isTrustBypassContext` | (settings module) | function |
| `v8` | `getSettingsBySource` (per-tier getter) | cli_inner_pretty.js:555234 | function |

### Goal resume

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_X$` | `registerSessionHookDirect` (underlying hook-registry add) | (hooks module) | function |
| `Cr5` | `restoreGoalFromTranscript` | cli_inner_pretty.js:564153-564164 | function |
| `Eg4` | `findGoalToRestore` | cli_inner_pretty.js:564144-564152 | function |
| `Kn6` | `goalResumeModule` | cli_inner_pretty.js:564142-564170 | module |
| `nX` | `currentTokenCount` | (telemetry module) | function |
| `v$` | `getSessionId` / `getCurrentSessionId` | cli_inner_pretty.js:361228, 430418 | function |

### Goal UI

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bR5` | `incrementHelper` (= `H + 1`) | cli_inner_pretty.js:507743-507745 | function |
| `FF6` | `useMemoCacheGoal` (React memo-cache helper for LabeledField) | cli_inner_pretty.js:507770 | reference |
| `fJ` | `ReactReference` (React module reference) | cli_inner_pretty.js:507770 | reference |
| `Lk4` | `goalOverlayPanelModule` | cli_inner_pretty.js:507771-507785 | module |
| `UF6` | `LabeledField` ("Label: value" row) | cli_inner_pretty.js:507749-507768 | React function |
| `xR5` | `activeGoalSelector` | cli_inner_pretty.js:507746-507748 | function |
| `Xk4` | `GoalOverlayPanel` (rendered for /goal dialog) | cli_unpack_pretty/decls/functions/Xk4.js | React component |

### Goal status badge

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `dg5` | `setAtSelector` (= `H.activeGoal?.setAt`) | cli_inner_pretty.js:544508-544510 | function |
| `Fg5` | `BADGE_DOT_INTERVAL_FRAC` (= `0.18`) | cli_inner_pretty.js:544515 | constant |
| `gg5` | `tickHelperModulo` (= `(H + 1) % V28`) | cli_inner_pretty.js:544502-544504 | function |
| `kR$` | `ICON_PAUSE` (= `"⏸"` U+23F8) | cli_inner_pretty.js:48416 | constant |
| `Qg5` | `tickHelperIncr` (= `H + 1`) | cli_inner_pretty.js:544505-544507 | function |
| `Ug5` | `BADGE_PULSE_PERIOD_MS` (= `4000`) | cli_inner_pretty.js:544514 | constant |
| `V28` | `BADGE_DOTS` (= `20`) | cli_inner_pretty.js:544513 | constant |
| `vR$` | `ICON_PULSE` (= `"◎"` U+25CE) | cli_inner_pretty.js:48414 | constant |

### Goal thin-client dispatch + events

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `fx5` | `isThinClientDispatchable` | cli_inner_pretty.js:513895-513897 | function |
| `JmH` | `isGoalUsageHint` | cli_inner_pretty.js:574080 | function |
| `NE4` | `getRemoteControlSlashCommandList` (filters via `fx5`) | cli_inner_pretty.js:513898-513900 | function |
| `Yx5` | `getCommandRequirements` (returns `{ workspace, ink }`) | cli_inner_pretty.js:513884-513894 | function |
| `tengu_goal_achieved` | (telemetry event) | cli_inner_pretty.js:391761 | event |
| `tengu_goal_restored_on_resume` | (telemetry event) | cli_inner_pretty.js:564163 | event |
| `tengu_stop_hook_added` | (telemetry event, via: "goal") | cli_inner_pretty.js:486729 | event |
| `tengu_stop_hook_removed` | (telemetry event, via: "goal") | cli_inner_pretty.js:486743 | event |
| `thinClientDispatch: "post-text"` | (value on goalNonInteractive) | cli_inner_pretty.js:507862 | string literal |

Promoted dual-export symbols (see `40_ant_promoted/10_promoted_goal.md`):

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `BR5` | `goalInteractiveCommand` | cli_inner_pretty.js:507850 | object |
| `pR5` | `goalNonInteractiveCommand` | cli_inner_pretty.js:507858 | object |
| `UR5` | `goalCommandDefaultExport` | cli_inner_pretty.js:507870 | variable |
| `T6` | `isNonInteractive` | cli_inner_pretty.js:2677 | function |
| `uR5` | `interactiveGoalCall` | cli_inner_pretty.js:507787 | function |

Known new themes:

- v2.1.139 introduction (`/goal <condition>`, interactive/`-p`/Remote Control coverage)
- v2.1.140: clear error when `disableAllHooks`/`allowManagedHooksOnly` is set
- Overlay shows elapsed/turns/tokens
- Dual-export pattern: `local-jsx` (REPL) + `local` non-interactive (SDK/RC)

---

## Module: Todo

TodoWrite tool + TaskList tool. (Note: the v2.1.112 baseline had these — this section captures only deltas.)

*(No new symbol additions in v2.1.113–v2.1.142 beyond v2.1.112 baseline; symbols continue to live in `symbol_index_core_execution.md` Module: Tools.)*

Known new themes for this window:

- `TaskList` returning tasks in arbitrary filesystem order instead of sorted by ID (v2.1.119 fix)

---

## Module: Compact

Autocompact dispatcher, microcompact stub, context-collapse persistence, summarize-up-to-here, prompt cache interaction.

*(No new symbols specific to this index beyond what is recorded in `symbol_index_core_execution.md` and `symbol_index_infra_platform.md` for prompt-cache helpers.)*

Cross-references (compact-adjacent symbols documented elsewhere):

- `Xi` (`buildCacheControlBlock`) — see `symbol_index_infra_platform.md` (LLM API)
- `ivH` (`isOneHourCacheEnabled`) — see `symbol_index_infra_platform.md` (LLM API)

Known new themes for this window:

- Compaction prompt asks model to preserve sensitive user instructions (v2.1.139)
- "Summarize up to here" added to Rewind menu (v2.1.141)
- Reactive compaction: first summarize attempt seeds from original request's overflow size (v2.1.142)
- Esc during conversation compaction no longer shows spurious "Error compacting" (v2.1.133)
- `/model` in one session silently changing autocompact threshold in others (v2.1.141 fix)
- Skills invoked before auto-compaction being re-executed against next user message (v2.1.119 fix)
- Cache-miss warning after `/clear` or compaction (v2.1.129 fix)
- Compacting resumed long-context session "Extra usage required" (v2.1.113 fix)

Autocompact dispatcher, microcompact stub, context-collapse persistence, summarize-up-to-here, prompt cache interaction.

Full delta mappings live in [`symbol_additions_v2_1_142_compact_arch.md`](symbol_additions_v2_1_142_compact_arch.md) (autocompact pipeline, prompts, hooks) and [`symbol_additions_v2_1_142_compact_cache.md`](symbol_additions_v2_1_142_compact_cache.md) (reactive compact, partial compact, telemetry). The canonical functions/constants for cross-doc lookup are summarized below.

### Autocompact (proactive lane)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Fo7` | autoCompactGenerator | cli_inner_pretty.js:408400-408445 | function |
| `qrH` | compactConversation | cli_inner_pretty.js:407582-407767 | function |
| `o45` | shouldAutoCompactNow | cli_inner_pretty.js:408389-408399 | function |
| `cZ` | isAutoCompactEnabled | cli_inner_pretty.js:408384-408388 | function |
| `Wy6` | computeRapidRefillStreak | cli_inner_pretty.js:408349-408351 | function |
| `vP$` | computeAutoCompactThreshold | cli_inner_pretty.js:408269-408274 | function |
| `MH4` | computeContextLevel | cli_inner_pretty.js:408278-408289 | function |
| `o47` | isAboveAutoCompactThreshold | cli_inner_pretty.js:408377-408383 | function |
| `FHH` | getEffectiveContextWindow | cli_inner_pretty.js:408339-408344 | function |
| `di` | resolveAutoCompactWindowSource | cli_inner_pretty.js:408320-408334 | function |
| `Bn` | postCompactCleanup | cli_inner_pretty.js:243907-243920 | function |
| `DH4` | MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES (=3) | cli_inner_pretty.js:408486 | constant |
| `PI6` | RAPID_REFILL_TURN_WINDOW (=3) | cli_inner_pretty.js:408487 | constant |
| `NO8` | MAX_CONSECUTIVE_RAPID_REFILLS (=3) | cli_inner_pretty.js:408488 | constant |
| `Py6` | AUTOCOMPACT_THRASHING_MESSAGE | cli_inner_pretty.js:408513 | constant |
| `YH4` | AUTOCOMPACT_BUFFER_TOKENS | cli_inner_pretty.js:408290 | constant |

### Reactive compact (1M-context overflow lane, v2.1.113+)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Y97` | reactiveCompactDispatcher | cli_inner_pretty.js:243951-244055 | function |
| `Ej6` | runReactiveCompact | cli_inner_pretty.js:244056-244092 | function |
| `f97` | finalizeReactiveCompact | cli_inner_pretty.js:244093-244175 | function |
| `uq8` | iterateReactiveSummarize | cli_inner_pretty.js:243253-243336 | function |
| `X3_` | summarizeReactiveAttempt | cli_inner_pretty.js:243188-243241 | function |
| `B47` | seedPreservedCount | cli_inner_pretty.js:243242-243248 | function |
| `L3_` | nextStepFromGap | cli_inner_pretty.js:243249-243252 | function |
| `H4H` | isReactiveCompactEligible | cli_inner_pretty.js:243938-243944 | function |
| `mUH` | extractPTLTokenGap | cli_inner_pretty.js (referenced) | function |
| `n47` | startPrecomputedCompact | cli_inner_pretty.js:243450-243540 | function |
| `i47` | swapWithPrecomputeIfReady | cli_inner_pretty.js:243599-243630 | function |

### Compact prompts (v2.1.139 sensitive-instructions clause)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bq8` | compactFullPrompt | cli_inner_pretty.js:242949-243062 | function |
| `m47` | compactPartialPrompt | cli_inner_pretty.js:242856-242948 | function |
| `j3_` | compactRecentBodyConst | cli_inner_pretty.js:243108-243181 | constant |
| `u47` | compactNoToolsReminder | cli_inner_pretty.js:243182-243186 | constant |
| `Yj6` | lazyInitCompactBodies | cli_inner_pretty.js:243107 | function |
| `J3_` | stripAnalysisAndRewrapSummary | cli_inner_pretty.js:243063-243084 | function |
| `fM$` | wrapSummaryAsContinuationPrompt | cli_inner_pretty.js:243085-243105 | function |

### Partial compact + /rewind (v2.1.141 "Summarize up to here", v2.1.133 silent abort)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_H4` | partialCompact | cli_inner_pretty.js:407768-407934 | function |
| `AH4` | partialCompactErrorNotice | cli_inner_pretty.js:407935-407951 | function |
| `Gb` | USER_ABORT_PATTERN | cli_inner_pretty.js:408217 | constant |
| `ErH` | NO_MESSAGES_PATTERN | cli_inner_pretty.js:408213 | constant |
| `$rH` | PRECOMPACT_BLOCKED_PREFIX | cli_inner_pretty.js:408218 | constant |
| `tF` | PROMPT_TOO_LONG_PREFIX | cli_inner_pretty.js:200302 | constant |

### Hooks (PreCompact blocking added v2.1.105)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ug` | executePreCompactHooks | cli_inner_pretty.js:519855-519893 | function |
| `zMH` | executePostCompactHooks | cli_inner_pretty.js:519894-519912 | function |
| `FM8` | throwOnPreCompactHookBlock | cli_inner_pretty.js:407549-407558 | function |

Known new themes for this window:

- Compaction prompt asks model to preserve sensitive user instructions (v2.1.139)
- "Summarize up to here" added to Rewind menu (v2.1.141)
- Reactive compaction: first summarize attempt seeds from original request's overflow size (v2.1.142)
- Esc during conversation compaction no longer shows spurious "Error compacting" (v2.1.133)
- `/model` in one session silently changing autocompact threshold in others (v2.1.141 fix)
- Skills invoked before auto-compaction being re-executed against next user message (v2.1.119 fix)
- Cache-miss warning after `/clear` or compaction (v2.1.129 fix)
- Compacting resumed long-context session "Extra usage required" (v2.1.113 fix)

---

---

## Module: Hooks

Hook event dispatch (PreToolUse, PostToolUse, PreCompact, PostCompact, UserPromptSubmit, SessionStart, Setup, SubagentStart/Stop, Stop, ConfigChange, PermissionRequest, PermissionDenied), hook-config schema, hook execution surface.

### Schema (v2.1.139 args, v2.1.118 mcp_tool, v2.1.139 continueOnBlock, v2.1.141 terminalSequence, v2.1.121 updatedToolOutput)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$` (inside `Th9`) | `PromptHookSchema` (now with `continueOnBlock`) | cli_inner_pretty.js:48772-48791 | constant |
| `_` (inside `Th9`) | `AgentHookSchema` | cli_inner_pretty.js:48827-48842 | constant |
| `eMq` | `discriminatedHookSchema` (union of all 5 hook types) | cli_inner_pretty.js:48858-48867 | constant |
| `H` (inside `Th9`) | `BashCommandHookSchema` | cli_inner_pretty.js:48729-48771 | constant |
| `hookArgsField` | (`args: string[]` exec-form schema) | cli_inner_pretty.js:48885 | schema field |
| `hookContinueOnBlockField` | (`continueOnBlock` schema field) | cli_inner_pretty.js:48783-48788 | schema field |
| `hookExecFormSchema` | (exec-form schema) | cli_inner_pretty.js:48371 | schema |
| `Hwq` | `hookMatcherEntrySchema` | cli_inner_pretty.js:48868-48873 | constant |
| `K` (inside `Th9`) | `HttpHookSchema` | cli_inner_pretty.js:48807-48826 | constant |
| `lq$` | `hookIfSchema` (filter condition) | cli_inner_pretty.js:48850-48857 | function |
| `Lu5` | `hookSyncResponseSchema` (with `terminalSequence`) | cli_inner_pretty.js:519022-519116 | constant |
| `MR` | `hookConfigSchema` (partialRecord by event name) | cli_inner_pretty.js:48874 | constant |
| `q` (inside `Th9`) | `McpToolHookSchema` (new in v2.1.118) | cli_inner_pretty.js:48792-48806 | constant |
| `terminalSequenceHookField` | (terminalSequence response field schema) | cli_inner_pretty.js:238108 | schema field |
| `Th9` | `buildHookTypeSchemas` (returns object of all hook-type schemas) | cli_inner_pretty.js:48728-48844 | function |
| `VsH` | `hookResponseUnionSchema` (union of sync + async response) | cli_inner_pretty.js:519117-519121 | constant |
| `Xu5` | `permissionDecisionEnum` (`["allow","deny","ask","defer"]`) | cli_inner_pretty.js:519020-519021 | constant |

### Envelope Builder

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `M_` | `createHookBaseInput` (now adds `effort: { level }` when supported) | cli_inner_pretty.js:520506-520520 | function |

### Event Dispatchers (snake_case envelope builders)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$M$` | `sessionStartHook` | cli_inner_pretty.js:520032-520043 | function |
| `FL$` | `postToolBatchHook` | cli_inner_pretty.js:520215-520221 | function |
| `kL$` | `permissionDeniedHook` | cli_inner_pretty.js:520224+ | function |
| `qM$` | `setupHook` | cli_inner_pretty.js:520044-520054 | function |
| `QL$` | `subagentStartHook` | cli_inner_pretty.js:520056 | function |
| `QNH` | `sessionEndHook` | cli_inner_pretty.js:520057-520072 | function |
| `YL$` | `postToolUseFailureHook` (NEW v2.1.119: `duration_ms`) | cli_inner_pretty.js:520197-520213 | function |
| `zL$` | `postToolUseHook` (NEW v2.1.119: `duration_ms` parameter) | cli_inner_pretty.js:520183-520195 | function |

### Streaming Driver (`aP`)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ah4` | `isInternalCallbackHook` | cli_inner_pretty.js:521082-521084 | function |
| `aP` | `dispatchHookOutputStream` (NEW v2.1.142 validation: prompt/agent + no toolUseContext) | cli_inner_pretty.js:521329-522181 | function |
| `bu5` | `buildToolPermissionRulePredicate` | cli_inner_pretty.js:521060-521080 | function |
| `Cu5` | `matchesHookMatcher` (regex/exact matcher) | cli_inner_pretty.js:521040-521058 | function |
| `LQ6` | `countPluginHooksByOrigin` | cli_inner_pretty.js:521098-521106 | function |
| `pu5` | `serializeHookDefinitionsForTelemetry` | cli_inner_pretty.js:521392 (ref) | function |
| `PQ6` | `getMatchedHookEntries` (now de-dups `mcp_tool` and `command.args`) | cli_inner_pretty.js:521151-521304 | function |
| `RG$` | `buildHookDeduplicationKey` | cli_inner_pretty.js:521086-521088 | function |
| `tI` | `hasHookForEvent` (NEW v2.1.117: reads `kp()` early) | cli_inner_pretty.js:521135-521146 | function |
| `uu5` | `getMatchedHooks` (NEW v2.1.117: reads `kp()` for main-thread agent hooks) | cli_inner_pretty.js:521108-521126 | function |
| `xu5` | `pluginIdHasMarketplaceSuffix` | cli_inner_pretty.js:521090-521096 | function |
| `zh4` | `countHooksByType` | cli_inner_pretty.js:521128-521134 | function |

### Output Parsing / Validation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_h4` | `parseHTTPHookResponse` (empty-body → empty JSON object handling) | cli_inner_pretty.js:520602-520618 | function |
| `CG$` | `truncateOrPersistHookOutput` | cli_inner_pretty.js:520557-520580 | function |
| `Kh4` | `parseHookJSONOutput` (Zod validation + structured error) | cli_inner_pretty.js:520521-520554 | function |
| `m$H` | `isAsyncHookResponse` | cli_inner_pretty.js:520948, 522244 (uses) | function |
| `TW8` | `applyHookJSONOutput` (NEW v2.1.141: routes `terminalSequence`; NEW v2.1.121: `updatedToolOutput`) | cli_inner_pretty.js:520620-520795 | function |
| `VW8` | `parseHookStdoutPayload` (JSON-detect + fall back to plaintext) | cli_inner_pretty.js:520582-520600 | function |
| `ZS` | `isPlainObject` | (utility) | function |

### Per-type Executors

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Bu5` | `callbackHook` | cli_inner_pretty.js:521440 (call) | function |
| `Ey4` | `promptHook` / `executePromptTypeHook` (NEW v2.1.139: `continueOnBlock`; NEW v2.1.142: unsupported-event error) | cli_inner_pretty.js:519166-519335, 521495 | function |
| `Gu5` | `truncateTranscriptForPromptHook` (Stop hooks get truncated history) | cli_inner_pretty.js:519351-519377 | function |
| `hu5` | `interpolateMCPHookInput` (NEW v2.1.118: `${path}` substitution) | cli_inner_pretty.js:519789-519814 | function |
| `hy4` | `agentHook` / `executeAgentTypeHook` (NEW v2.1.142: unsupported-event error) | cli_inner_pretty.js:519378-519573, 521518 | function |
| `JQ6` | `httpHook` | cli_inner_pretty.js:521517 (call) | function |
| `mu5` | `functionHook` | cli_inner_pretty.js:521470 (call) | function |
| `vW8` | `bashCommandHook` (NEW v2.1.139: `args` exec form, `detached: true`, `CLAUDE_EFFORT`) | cli_inner_pretty.js:520794-522029 | function |
| `Wu5` | `countTokensInLastAssistantMessage` (transcript truncation helper) | cli_inner_pretty.js:519336-519345 | function |
| `XQ6` | `mcpToolHook` (NEW v2.1.118) | cli_inner_pretty.js:519815-519849 | function |
| `Zu5` | `countTokensInMessages` (heuristic) | cli_inner_pretty.js:519346-519350 | function |
| `agentHookUnsupportedEvents` | (error template, v2.1.142) | cli_inner_pretty.js:521507 | error template |
| `promptHookUnsupportedEvents` | (error template, v2.1.142) | cli_inner_pretty.js:521484 | error template |

### Terminal Sequence (NEW v2.1.141)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aM4` | `popTerminalEmitter` | cli_inner_pretty.js:467443-467446 | function |
| `BT` | `BEL_BYTE` (`\x07`) | (utility) | constant |
| `DZ5` | `terminalAllowlist` (`new Set([0, 1, 2, 9, 99, 777])`) | cli_inner_pretty.js:467456 | constant |
| `EZ` | `encodeOSC` (`ESC ] ... ST/BEL`) | (utility) | function |
| `F2$` | `terminalEmitterStack` (LIFO stack of emit callbacks) | cli_inner_pretty.js:467457 | variable |
| `JZ5` | `decodeOSCPayload` (escape unescape) | (utility) | function |
| `jZ5` | `MAX_TERMINAL_SEQUENCE_LENGTH` (= `4096`) | cli_inner_pretty.js:467451 | constant |
| `Lm6` | `validateTerminalSequence` / `parseAndValidateTerminalSequence` (allowlist parse + re-serialize) | cli_inner_pretty.js:467431-467435, 520642 | function |
| `oM4` | `pushTerminalEmitter` | cli_inner_pretty.js:467436-467442 | function |
| `pj` | `formatOSCBody` (`<ps>;<payload>`) | (utility) | function |
| `Pm6` | `emitTerminalSequence` / `applyTerminalSequence` (push to topmost emitter) | cli_inner_pretty.js:467447-467449, 522072 | function |
| `XZ5` | `parseEscapeTokens` (OSC/BEL byte-level parser with allowlist filter) | cli_inner_pretty.js:467390-467430 | function |
| `ZW8` | `dispatchTerminalSequence` (side-channel emitter for YW/callback paths) | cli_inner_pretty.js:522183-522192 | function |

### Main-Thread Agent Hooks (NEW v2.1.117)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `B7H` | `isAdminTrustedSource` | (utility) | function |
| `dv$` | `setMainThreadAgentHooks` | cli_inner_pretty.js:3087-3091 | function |
| `DX` | `isFeatureLocked` (admin policy gate) | (utility) | function |
| `jv` | `getAsyncLocalStorageEntry` | (utility) | function |
| `Kh` | `getMainThreadAgentType` | cli_inner_pretty.js:3075-3078 | function |
| `kp` | `getMainThreadAgentHooks` | cli_inner_pretty.js:3083-3086 | function |
| `pJH` | `applyMainThreadAgent` (admin-trust-gated installer) | cli_inner_pretty.js:564134-564137 | function |
| `SyH` | `resolveAgentSetting` (calls `pJH` on `--agent` resolution) | cli_inner_pretty.js:564206-564220 | function |
| `vp` | `setMainThreadAgentType` | cli_inner_pretty.js:3079-3082 | function |

### Aggregation State (delta from v2.1.112)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `B` (in `aP`) | `perPluginByteCounts` | cli_inner_pretty.js:522032 | variable |
| `C` (in `aP`) | `byteCounts` (`{additionalContextChars, systemMessageChars, ...}`) | cli_inner_pretty.js:522030 | variable |
| `h` (in `aP`) | `outcomeCounts` (`{success, blocking, non_blocking_error, cancelled}`) | cli_inner_pretty.js:522029 | variable |
| `R` (in `aP`) | `hookToPluginId` | cli_inner_pretty.js:522031 | variable |
| `S` (in `aP`) | `yieldSequence` (yield counter) | cli_inner_pretty.js:522049 | variable |
| `x` (in `aP`) | `aggregatedPermissionBehavior` (deny > defer > ask > allow > passthrough) | cli_inner_pretty.js:522080-522110 | variable |

### Stream Yield Routing (delta)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `G38` | `postToolUseAggregator` (NEW v2.1.121: translates `updatedMCPToolOutput` → `updatedToolOutput`) | cli_inner_pretty.js:378950-379015 | function |
| `jW8` | `AGENT_HOOK_ID_PREFIX` / `internalAgentIdPrefix` (= `"hook-agent-"`) | cli_inner_pretty.js:519573, 521486, 521509 | constant |
| `k0` | `isMcpTool` | (predicate) | function |
| `Z38` | `generatePostToolUseFollowupMessage` | cli_inner_pretty.js:388433 (call) | function |

### Hook Effort / CLAUDE_EFFORT

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aT` | `resolveEffort` / `resolveEffortForApi` / `getActiveEffortString` (used to build `CLAUDE_EFFORT` env var) | cli_inner_pretty.js:198908-198911, 399003, 406269, 419635 | function |
| `CLAUDE_EFFORT` | (env var, injected for Bash + hooks + slash command bodies) | cli_inner_pretty.js:399003, 419635 | env var |
| `effort.level` | `hookEffortLevelField` | cli_inner_pretty.js:237710 | hook JSON schema field |

### Hook Duration (v2.1.119 `duration_ms`)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `c_H` | `getMetricsRecorder` | cli_inner_pretty.js:388085, 521369 | function |
| `mD6` | `maybeRecordHookSetup` | cli_inner_pretty.js:530763 | function |
| `mE6` | `HOOK_SLOW_THRESHOLD_MS` | cli_inner_pretty.js:388130 | constant |
| `n77` | `onHookCaptured` | cli_inner_pretty.js:530763 | function |
| `Z8` | `recordTelemetry` | cli_inner_pretty.js:530763 | function |

### MCP CLAUDE_PROJECT_DIR (NEW v2.1.139)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bP$` | `MCPStdioTransport` (constructor; env now includes CLAUDE_PROJECT_DIR) | cli_inner_pretty.js:414308 | class |
| `CLAUDE_PROJECT_DIR` | (env var) | cli_inner_pretty.js:228571, 414308 | env var |
| `R9` | `getProjectDir` (cwd of project root) | cli_inner_pretty.js:228571, 414308 | function |

### Hook Settings (managed/disabled flags)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `allowManagedHooksOnly` | `allowManagedHooksOnlySetting` | cli_inner_pretty.js:50547 | settings schema |
| `disableAllHooks` | `disableAllHooksSetting` | cli_inner_pretty.js:50522 | settings schema |

Known new themes for this window:

- `type: "mcp_tool"` hooks (v2.1.118)
- `duration_ms` in PostToolUse / PostToolUseFailure (v2.1.119)
- `hookSpecificOutput.updatedToolOutput` for non-MCP tools (v2.1.121)
- `effort.level` JSON field + `$CLAUDE_EFFORT` env var (v2.1.133)
- `args: string[]` exec form (v2.1.139)
- `continueOnBlock` config for PostToolUse (v2.1.139)
- `terminalSequence` field for desktop notifications / window titles / bells (v2.1.141)
- Hook misconfiguration error for prompt/agent hooks on SessionStart/Setup/SubagentStart (v2.1.142)
- Status-line stdin includes `effort.level` and `thinking.enabled` (v2.1.119)
- `PermissionRequest` `updatedInput` re-check against deny rules (v2.1.110, also revisited in v2.1.113)
- Hooks now run without terminal access (v2.1.139 — prevents prompt corruption)
- Agent-type hooks: messages-required error for non-Stop/SubagentStop events (v2.1.118)
- `transcript_path` post-EnterWorktree cwd switch (v2.1.141 fix)
- ConfigChange spurious hook firing from symlinked settings (v2.1.140 fix)

---

## Module: Skills

Skill registry, frontmatter parsing, `${CLAUDE_EFFORT}` interpolation, model-invocation gating, skill-tool dispatch, plugin-skill bridging.

### Regex-Safe Argument Substitution (v2.1.139)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `iH8` | `parseArgumentNames` | cli_inner_pretty.js:217467-217473 | function |
| `rH8` | `escapeShellBang` | cli_inner_pretty.js:217510-217514 | function |
| `riK` | `formatProgressiveArgumentHint` | cli_inner_pretty.js:217474-217478 | function |
| `uFH` | `substituteArgsInPrompt` | cli_inner_pretty.js:217479-217509 | function |
| `Vx` | `escapeRegex` | cli_inner_pretty.js:9491-9493 | function |
| `z36` | `parseArgumentString` | cli_inner_pretty.js:217462-217466 | function |

### Plugin Manifest — skills field inheritance (v2.1.136 + v2.1.142)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `H2` | `SKILLS_DIR_SENTINEL` (= `"skills-dir"`) | cli_inner_pretty.js:218312 | constant |
| `H_` | `fileExists` (used in root SKILL.md detection) | cli_inner_pretty.js:230212 | function |
| `kg` | `validatePluginComponentPaths` | cli_inner_pretty.js:229997-230032 | function |
| `nX5` | `scanSkillsPaths` (skills directory walker - accepts root SKILL.md) | cli_inner_pretty.js:457453-457486 | function |
| `r__` | `manifestPathsCoverDefaultFolder` | cli_inner_pretty.js:230034-230048 | function |
| `U88` | `loadPluginFromDir` | cli_inner_pretty.js:230049-… | function |
| `V36` | `recordAdvisoryMarketplaceTransition` | (utility) | function |
| `VjH` | `formatPluginErrorMessage` | cli_inner_pretty.js:457508-457548+ | function |
| `WTH` | `resolvePluginPathRelative` | cli_inner_pretty.js:229990-229995 | function |
| `Yn` | `INLINE_MARKETPLACE_SENTINEL` (= `"inline"`) | cli_inner_pretty.js:218311 | constant |

### skillOverrides Setting (v2.1.129)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aT5` | `resolveProjectSkillOverride` | cli_inner_pretty.js:476894-476896 | function |
| `iP8` | `isSkillHiddenFromUser` | cli_inner_pretty.js:513855-513857 | function |
| `kB6` | `SKILL_OVERRIDE_VALUES` (= `["on", "name-only", "user-invocable-only", "off"]`) | cli_inner_pretty.js:477208 | constant |
| `oT5` | `resolveSkillOverrideLock` | cli_inner_pretty.js:476885-476893 | function |
| `rT5` | `SKILL_OVERRIDE_STYLES` | cli_inner_pretty.js:477209-477214 | object |
| `skillOverrides` | (settings key) | cli_inner_pretty.js:50479, 476886-476895 | settings field |
| `sT5` | `SkillRow` | cli_inner_pretty.js:477137-477182 | React component |
| `st` | `getSkillOverride` | cli_inner_pretty.js:513847-513849 | function |
| `tT5` | `renderSkillsDialog` (React render wrapper) | cli_inner_pretty.js:477218-… | function |
| `uJ4` | `SkillsDialog` | cli_inner_pretty.js:476909-477136 | React component |
| `VE4` | `isSkillModelInvocationDisabled` | cli_inner_pretty.js:513851-513853 | function |
| `xJ4` | `formatSkillSource` | cli_inner_pretty.js:476897-476908 | function |

### ${CLAUDE_EFFORT} placeholder (v2.1.120)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$I6` | `formatCommand` (returns a `prompt`-type command object with `getPromptForCommand`) | cli_inner_pretty.js:406196-406299 | function |

### claude_code.skill_activated OTel event (v2.1.126)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `M1` | `emitOtelLogEvent` (general emitter, also `emitOtelEvent`) | cli_inner_pretty.js:218483, 218525 | function |
| `N7H` | `formatSkillSourceMetadataForOtel` | cli_inner_pretty.js:218534-218541 | function |
| `Qf$` | `emitSkillActivatedOtel` | cli_inner_pretty.js:218520-218533 | function |
| `rE` | `isOfficialMarketplace` | cli_inner_pretty.js:218301-218303 | function |
| `XY` | `isToolDetailLoggingEnabled` (reads `OTEL_LOG_TOOL_DETAILS=1`) | (otel module) | function |

### Subagent skill discovery (v2.1.133)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ax5` | `getSkillsFromAllSources` | cli_inner_pretty.js:513752-513791 | function |
| `D9H` | `applyFallbackDeduplication` (drops same-suffix `fallback: true` skills) | cli_inner_pretty.js:513829-513842 | function |
| `Dh6` | `loadPluginSkills` (iterates plugin manifests) | (plugin-loader module) | function |
| `Eg6` | `getLocalJsxCommands` (`/agents`, `/effort`, `/goal`, etc.) | cli_inner_pretty.js:514163-514267 | function |
| `gZ` | `getModelFacingCommands` (filters via `XG$`) | cli_inner_pretty.js:514286-514288 | function |
| `GrK` | `getBuiltinPluginSkills` | (builtin plugin module) | function |
| `GTH` | `getSkillToolListing` | cli_inner_pretty.js:514289-514311 | function |
| `HG` | `getCommandsForContext` (the consumer) | cli_inner_pretty.js:513810-513822 | function |
| `kb` | `getLocalJsxCommandNames` (set of names+aliases) | cli_inner_pretty.js:514268 | function |
| `kE4` | `isDispatchable` | cli_inner_pretty.js:513881-513883 | function |
| `KI6` | `loadSkillDirCommands` (walks `~/.claude/skills/` and project skills) | (skill-loader module) | function |
| `LG$` | `isLocallyDispatchable` | cli_inner_pretty.js:513871-513875 | function |
| `TE4` | `getAllCommands` (memoised orchestrator) | cli_inner_pretty.js:514269-514285 | function |
| `XG$` | `shouldListSkillForModel` (filter predicate) | cli_inner_pretty.js:513858-513870 | function |
| `zG4` | `getBundledSkills` | (bundled module) | function |

### Type-to-Filter in /skills (v2.1.121)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AG` | `useFilterInputController` | (hook) | function |
| `DN` | `FilterTextInput` (rendered inside SkillsDialog) | (utility component) | React function |

### Skill(name *) wildcard (v2.1.139)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `fX` | `SKILL_TOOL_NAME` (alias - same constant referenced via different name) | (constants module) | constant |
| `GQ` | `getToolRules` (allow/deny lookup) | (permission module) | function |
| `SnH` | `SKILL_TOOL_NAME` (= `"Skill"`) | (constants module) | constant |
| `Xy` | `findCommand` (resolves a name in the available commands map) | (utility) | function |
| `yV6` | `getMcpAndStaticCommands` (loads MCP prompts + static commands) | cli_inner_pretty.js:353356-353361 | function |

### Skill misc

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ks4` | `/claude-api` skill prompt string | cli_inner_pretty.js:593195 | constant (string) |

Known new themes:

- `/claude-api` skill added (v2.1.142)
- `${CLAUDE_EFFORT}` in skill content (v2.1.120)
- `skillOverrides` setting honored: `off` / `user-invocable-only` / `name-only` (v2.1.129)
- Plugin root SKILL.md (no `skills/` subdir) surfaces as skill (v2.1.142)
- `Skill(name *)` wildcard prefix match (v2.1.139)
- Subagents discover project/user/plugin skills via Skill tool (v2.1.133 fix)
- Skill argument names with regex metacharacters (v2.1.139 fix)

---

## Module: Thinking

Extended thinking, thinking-summary toggle, thinking spinner (rotating, amber warmup), thinking-block redaction handling, effort level resolution.

### Effort Level Resolution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$0H` | `coerceToEffortLevel` (typeof check, defaults to "high") | cli_inner_pretty.js:198924-198927 | function |
| `$e$` | `getDefaultEffortForModel` (opus-4-7 → "xhigh", else "high") | cli_inner_pretty.js:198951-198954 | function |
| `aA6` | `XHIGH_MODELS_LABEL` ("Opus 4.7 only") | cli_inner_pretty.js:198956 | constant |
| `CP` | `modelSupportsEffort` (effort-parameter capability gate) | cli_inner_pretty.js:198795-198811 | function |
| `cgK` | `MAX_MODELS_LABEL` ("Opus 4.6/4.7, Sonnet 4.6") | cli_inner_pretty.js:198957 | constant |
| `CZ` | `resolveEffortForApiIfSupported` (returns undefined when model doesn't support effort) | cli_inner_pretty.js:198912-198914 | function |
| `DC` | `parseEffortInput` (low/medium/high/xhigh/max + numeric) | cli_inner_pretty.js:198851-198859 | function |
| `EL8` | `executeEffort` (`auto`/`unset` → `clearEffortLevel`, otherwise applyEffortLevel) | cli_inner_pretty.js:496770-496775 | function |
| `Ey5` | `applyEffortLevel` (typed-arg dispatch) | cli_inner_pretty.js:496721-496749 | function |
| `fY$` | `modelSupportsMaxEffort` (blocklist-driven max gate) | cli_inner_pretty.js:198812-198828 | function |
| `G3H` | `parseEffortLevelStrict` (low/medium/high/xhigh only — string source) | cli_inner_pretty.js:198860-198863 | function |
| `H0H` | `isValidEffortLevel` (low/medium/high/xhigh/max) | cli_inner_pretty.js:198848-198850 | function |
| `He$` | `isOpus47LaunchDefaultActive` (model is opus-4-7 AND !unpinOpus47LaunchEffort) | cli_inner_pretty.js:198871-198873 | function |
| `Ht1` | `getEffortDescription` (level → human description) | cli_inner_pretty.js:198928-198941 | function |
| `hy5` | `ShowCurrentEffortFC` (read-only `/effort current` renderer) | cli_inner_pretty.js:496776-496785 | component |
| `IUH` | `readEnvEffortLevel` (`CLAUDE_CODE_EFFORT_LEVEL`, "auto"/"unset" → null) | cli_inner_pretty.js:198867-198870 | function |
| `kL8` | `EFFORT_HELP_TEXT` (`/effort` help string referencing xhigh) | cli_inner_pretty.js:497171-497185 | constant |
| `MY$` | `effortApplyWouldChange` (whether commit changes resolved effort) | cli_inner_pretty.js:198885-198894 | function |
| `NL8` | `showCurrentEffort` (`/effort current`/`status`) | cli_inner_pretty.js:496750-496756 | function |
| `ngK` | `resolveSettingsEffortLevel` (cli.effort → settings.effortLevel) | cli_inner_pretty.js:198972-198976 | function |
| `Ny5` | `parseEffortArg` (auto/unset → `{value:void 0}`, valid level → `{value}`) | cli_inner_pretty.js:496706-496710 | function |
| `OY$` | `modelSupportsXhigh` (Opus 4.7-only xhigh gate) | cli_inner_pretty.js:198829-198847 | function |
| `sA6` | `resolveEffortFromCli` (CLI `--effort` arg path; latches unpin when set) | cli_inner_pretty.js:198904-198907 | function |
| `sF` | `EFFORT_LEVELS` (`["low","medium","high","xhigh","max"]`) | cli_inner_pretty.js:198970 | constant |
| `SUH` | `formatEffortStatusBarSuffix` (" with high effort" / " with xhigh effort") | cli_inner_pretty.js:198915-198920 | function |
| `Sy5` | `EffortApplyAndCloseFC` (typed-arg path; renders cache-miss confirmation) | cli_inner_pretty.js:496797-496846 | component |
| `T04` | `dispatchEffortToRemoteSession` (sends apply_flag_settings via control transport) | cli_inner_pretty.js:496711-496720 | function |
| `tA6` | `getEffortDescriptionWithBurnHint` (appends "burns fastest" on Pro/Opus 4.6) | cli_inner_pretty.js:198942-198950 | function |
| `tengu_effort_command` | (telemetry event for `/effort` use) | cli_inner_pretty.js:496730, 496761 | constant |
| `VU6` | `commitEffortAndNotify` (run EL8, update AppState, call onDone) | cli_inner_pretty.js:496786-496796 | function |
| `wY$` | `persistEffortAndUnpinOpus47` (saves `effortLevel` + sets unpinOpus47LaunchEffort) | cli_inner_pretty.js:198895-198903 | function |
| `Z3H` | `resolveAppliedEffort` (env→opus47-default→state→default with downgrade) | cli_inner_pretty.js:198874-198884 | function |
| `unpinOpus47LaunchEffort` | (App-config flag — latches once user makes first effort choice) | cli_inner_pretty.js:198871-198873, 198901-198902 | variable |
| `yy5` | `clearEffortLevel` (`/effort auto` — persists + emits "set to auto") | cli_inner_pretty.js:496757-496769 | function |

### Effort Slider UI

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `By5` | `ShimmerLevelLabel` (xhigh shimmer animation) | cli_inner_pretty.js:496901-496926 | component |
| `Fy5` | `nextEffortIndex` (clamp at last position) | cli_inner_pretty.js:497121-497123 | function |
| `gy5` | `prevEffortIndex` (clamp at 0) | cli_inner_pretty.js:497124-497126 | function |
| `my5` | `RainbowAnimatedLevelLabel` (max-level cycling rainbow) | cli_inner_pretty.js:496880-496900 | component |
| `py5` | `EffortSliderComponent` (interactive 5-position slider with env-override awareness) | cli_inner_pretty.js:496927-497117 | component |
| `Uy5` | `sliderLabelSpacer` (returns whitespace pad by index) | cli_inner_pretty.js:497118-497120 | function |
| `vZ$` | `EffortLevelLabel` (per-level styled label for slider) | cli_inner_pretty.js:496853-496879 | component |
| `x1H` | `SLIDER_LEVELS` (5-position config with color styling) | cli_inner_pretty.js:496703 | constant |
| `Z04` | `DEFAULT_SLIDER_INDEX` (= `3`, xhigh) | cli_inner_pretty.js:496935-496948 (init) | constant |

### Spinner + Thinking Hints (v2.1.116 / v2.1.141)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `BB_` | `SPINNER_LONG_RESPONSE_TOKENS` (= `16000`, threshold for revealing time) | cli_inner_pretty.js:328724 | constant |
| `cB_` | `THINKING_WARM_FULL_MS` (= `20_000` — full amber) | cli_inner_pretty.js:328734 | constant |
| `dB_` | `SPINNER_SHIMMER_PERIOD_S` (= `2`) | cli_inner_pretty.js:328732 | constant |
| `Dy7` | `THINKING_LABEL_WIDTH` (precomputed width of `"thinking"`) | cli_inner_pretty.js:328757 | constant |
| `FB_` | `STALL_TELEMETRY_THRESHOLDS_MS` (`[10000, 45000, 300000]`) | cli_inner_pretty.js:328758 | constant |
| `gB_` | `SPINNER_DIM_RGB` (`{r:153,g:153,b:153}`) | cli_inner_pretty.js:328759 | constant |
| `iB_` | `THINKING_SOME_MORE_MS` (= `30_000`) | cli_inner_pretty.js:328737 | constant |
| `Jy7` | `SPINNER_SHIMMER_DELAY_MS` (= `3000`, before the dim↔bright oscillation starts) | cli_inner_pretty.js:328731 | constant |
| `lB_` | `STILL_THINKING_MS` (= `10_000`) | cli_inner_pretty.js:328735 | constant |
| `nB_` | `THINKING_MORE_MS` (= `20_000`) | cli_inner_pretty.js:328736 | constant |
| `nG6` | `useStallDetector` (tracks `timeSinceLastToken`, eases `stalledIntensity` 0→1 over 10s past idle threshold) | cli_inner_pretty.js:328245-328274 | function |
| `oB_` | `getThinkingHintForElapsed` / `thinkingSpinnerLabel` (returns "thinking" / "still thinking" / "thinking more" / "thinking some more" / "almost done thinking") | cli_inner_pretty.js:328461-328467 | function |
| `Py7` | `SpinnerComponent` (renders glimmer + thinking-status + tokens) | cli_inner_pretty.js:328468-328694 | component |
| `QB_` | `SPINNER_BRIGHT_RGB` (`{r:185,g:185,b:185}`) | cli_inner_pretty.js:328760 | constant |
| `rB_` | `ALMOST_DONE_THINKING_MS` / `THINKING_ALMOST_DONE_MS` (= `45_000`) | cli_inner_pretty.js:328738 | constant |
| `tengu_spinner_stall_cleared` | (telemetry event when tokens resume) | cli_inner_pretty.js:328506 | constant |
| `tengu_spinner_stalled_ui` | (telemetry event for crossing a stall threshold) | cli_inner_pretty.js:328520 | constant |
| `wy7` | `computeCompactingPercent` / `thinkingProgressPercent` (asymptote at 95%, `1 - exp(-elapsed/90s)`) | cli_inner_pretty.js:328456-328459 | function |
| `Xy7` | `THINKING_WARM_START_MS` (= `10_000` — start fading spinner to amber) | cli_inner_pretty.js:328733 | constant |

### Status Line + Hook Effort Plumbing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `lm5` | `applyOutputConfigEffort` (sets `output_config.effort` if `modelSupportsEffort`) | cli_inner_pretty.js:524795-524803 | function |
| `mU5` (or surrounding `cU$` builder) | `buildStatusLinePayload` (assembles JSON for status line / `/feedback` redaction) | cli_inner_pretty.js:535631-535672 | function |
| `WxH` | `EFFORT_BETA_HEADER` (anthropic-beta value enabling `output_config.effort`) | cli_inner_pretty.js:524801-524802 (referenced) | constant |

### Bedrock ARN Effort Resolution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `abH` | `loadBedrockInferenceProfileBackingModel` (async GetInferenceProfileCommand, caches result) | cli_inner_pretty.js:90502-90523 | function |
| `av8` | `getInferenceProfileBackingModel` (read from in-memory cache) | cli_inner_pretty.js:3172-3174 | function |
| `k7` | `resolveModelCanonicalId` / `getModelId` (model id with ARN→backing-model resolution) | cli_inner_pretty.js:97419-97427 | function |
| `Nj` | `stripModelVersionSuffixToCanonicalId` (matches claude-opus-4-7 / etc.) | cli_inner_pretty.js:97401-97418 | function |
| `sv8` | `setInferenceProfileBackingModel` (write to cache, called by abH after async lookup) | cli_inner_pretty.js:3175-3177 | function |
| `U$.inferenceProfileBackingModels` | (Cache map: ARN → backing model id) | cli_inner_pretty.js:2300 | variable |

### Stream Idle Byte-Watchdog (v2.1.139)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$l$` | `StreamIdleTimeoutError` (carries `idleMs`/`bytesReceived`/`ttfbMs`/`bodyReadPending`/`cfRay`) | cli_inner_pretty.js:128470-128485 | class |
| `cli_byte_watchdog_fired` | (structured warn event for fired watchdog) | cli_inner_pretty.js:128341 | constant |
| `cli_streaming_idle_warning` | (structured warn event for soft-idle) | cli_inner_pretty.js:525384 | constant |
| `tengu_byte_watchdog_fired_late` | (telemetry event for sleep/wake re-arms) | cli_inner_pretty.js:128349 | constant |
| `TV1` | `wrapStreamWithByteWatchdog` (re-armable byte watchdog with sleep/suspend rescue) | cli_inner_pretty.js:128281-128392 | function |
| `U$6` | `getStreamIdleTimeoutMs` (`max(env CLAUDE_STREAM_IDLE_TIMEOUT_MS, 300000)`) | cli_inner_pretty.js:128278-128280 | function |
| `vV1` | `fetchWithByteWatchdog` (fetch wrapper that wraps SSE body) | cli_inner_pretty.js:128398-128428 | function |
| `VV1` | `isByteWatchdogEnabled` (feature flag `tengu_stream_watchdog_default_on`) | cli_inner_pretty.js:128393-128397 | function |

### Fast Mode (v2.1.142)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Cc` | `isOpus46FastModeOverride` | cli_inner_pretty.js:96905 | function |
| `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` | (env var) | cli_inner_pretty.js:96906 | env var |
| `dsq` | `fastModeStatusEventEmitter` | cli_inner_pretty.js:96931 | variable |
| `Pi8` | `isFastModeActiveForModel` | cli_inner_pretty.js:96914 | function |
| `TxH` | `fastModeStatusState` | cli_inner_pretty.js:96930 | variable |
| `Uw` | `modelSupportsFastMode` | cli_inner_pretty.js:96922 | function |
| `VxH` | `fastModeModelId` | cli_inner_pretty.js:96911 | function |
| `Wi8` | `checkFastModeCooldown` | cli_inner_pretty.js:96929 | function |
| `Xi8` | `fastModeReEnabledFlag` | cli_inner_pretty.js:96931 | variable |
| `Yu` | `fastModeModelLabel` | cli_inner_pretty.js:96908 | function |

Known new themes for this window:

- Thinking spinner inline-progressive ("still thinking", "thinking more", "almost done") (v2.1.116)
- 10-sec amber warmup spinner (v2.1.141)
- Redacted thinking block after tool call: API 400 fix (v2.1.136)
- Opus 4.7 + Bedrock IP ARN + thinking disabled: 400 fix (v2.1.117)
- Alt+T (thinking toggle) on macOS terminals without Option-as-Meta (v2.1.132 fix)
- `thinking.enabled` in status-line stdin (v2.1.119)

---

## Module: Steering

Background/foreground task scheduling, `/loop`, `/schedule`, `/babysit-prs`, recurring routines, cron, `RemoteTrigger`.

*(No new symbols specific to this index beyond what is recorded in `symbol_index_infra_integration.md` Slash Commands — `/routines`, `/loop`, `/schedule` and friends are routed there.)*

Known new themes for this window:

- `/routines` slash command (v2.1.142)
- `/loop` Esc cancels pending wakeups (v2.1.113)
- `/loop` no longer schedules redundant wakeups for tasks that notify on completion (v2.1.140 fix)
- One-shot scheduled tasks countdown vs. recurring (v2.1.113 fix)

---

## Module: CLI

CLI argparser, subcommand router, top-level flags, environment-variable parsing.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ANTHROPIC_WORKSPACE_ID` | (env var) | cli_inner_pretty.js:4167, 91330, 99805 | env var |
| `CLAUDE_CODE_SESSION_ID` | (env var name) | cli_inner_pretty.js:528634 | env var |
| `LWH` | `readEnvVarOptional` | cli_inner_pretty.js:99805 | function |
| `wO` | `readEnvVar` | cli_inner_pretty.js:4167 | function |

Promoted-feature CLI symbols (see `40_ant_promoted/`):

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_9` | `isFastModeEnabled` | cli_inner_pretty.js:96854 | function |
| `Yu` | `getFastModeModelDisplay` | cli_inner_pretty.js:96908 | function |
| `Cc` | `isOpus46FastModeOverride` | cli_inner_pretty.js:96905 | function |
| `Da` | `getFastModeUnavailableReason` | cli_inner_pretty.js:96881 | function |
| `Uw` | `isFastModeSupportedByModel` | cli_inner_pretty.js:96922 | function |
| `Ev5` | `fastInteractiveCommand` | cli_inner_pretty.js:484225 | object |
| `KP4` | `fastNonInteractiveCommand` | cli_inner_pretty.js:484242 | object |
| `IaH` | `isImmediateModelCommandEnabled` | cli_inner_pretty.js:483882 | function |
| `V1H` | `isUltrareviewEnabled` | cli_inner_pretty.js:474757 | function |
| `JaH` | `getReviewBughunterConfig` | cli_inner_pretty.js:474742 | function |
| `fJ4` | `ultrareviewSlashCommand` | cli_inner_pretty.js:476334 | object |
| `rqA` | `ultrareviewCliHandler` | cli_inner_pretty.js:604787 | function |
| `aqA` | `pollUntilReviewComplete` | cli_inner_pretty.js:604868 | function |
| `oqA` | `extractRemoteError` | cli_inner_pretty.js:604858 | function |
| `Or` | `getDurationNote` | cli_inner_pretty.js:474749 | function |
| `CEH` | `getCostNote` | cli_inner_pretty.js:474745 | function |
| `RC5` | `detectInvocationKind` | cli_inner_pretty.js:509150 | function |
| `rmH` | `isAgentViewDisabled` | cli_inner_pretty.js:139859 | function |
| `KG$` | `ensureDaemonRunningWithInstallOffer` | cli_inner_pretty.js:509189 | function |
| `bP8` | `backgroundedJobHelpFooter` | cli_inner_pretty.js:510749 | function |

Known new themes for this window:

- New `claude agents` flags (v2.1.142): `--add-dir`, `--settings`, `--mcp-config`, `--plugin-dir`, `--permission-mode`, `--model`, `--effort`, `--dangerously-skip-permissions`
- `--from-pr` supports GitLab/Bitbucket/GitHub Enterprise (v2.1.119)
- `--plugin-url <url>` (v2.1.129)
- `claude ultrareview [target]` non-interactive (v2.1.120)
- `claude plugin details <name>` / `claude plugin tag` / `claude plugin prune` (v2.1.118/121/139)
- `claude project purge [path]` (v2.1.126)
- `CLAUDE_CODE_FORCE_SYNC_OUTPUT=1`, `CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE`, `CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY=1` (v2.1.129)
- `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE=1` (v2.1.142)
- `ANTHROPIC_WORKSPACE_ID` (v2.1.141)
- `ANTHROPIC_BEDROCK_SERVICE_TIER` (v2.1.122)
- `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN=1` (v2.1.132)
- `CLAUDE_CODE_SESSION_ID` (v2.1.132)
- `DISABLE_UPDATES` (v2.1.118)

---

## See Also

- [`changelog_analysis.md`](changelog_analysis.md) — long-form narrative
- [`changelog_to_code_map.md`](changelog_to_code_map.md) — per-bullet pointers
- [`file_index.md`](file_index.md) — extracted-file inventory
- The v2.1.112 baseline lives at `../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index.md`
