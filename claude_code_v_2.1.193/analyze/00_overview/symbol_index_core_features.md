# Symbol Index — Core Features (v2.1.183 → v2.1.193)

This index catalogs obfuscated → readable mappings for the **core feature** symbols that changed between v2.1.183 and v2.1.193 (published sub-versions 2.1.185 / .186 / .187 / .190 / .191 / .193). Scope for this delta tree: **Permissions / Auto-mode**, **Plan Mode**, **Background Agents**, **Compact**, **Auto Memory**, **Workflow / StructuredOutput**, **Agent Team**, and **Skills**. Plan Mode is included as current-state coverage because the local tool pair is mostly carryover but the 2.1.193 analysis tree needs a central route for its prompts, reminders, UI, and permission-mode symbols.

For other categories see:

- [`symbol_index_core_execution.md`](symbol_index_core_execution.md) — Agent Loop, Tools, LLM API, Agents, Subagent, State (and the Agent named-spawn enforcement)
- [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) — MCP, Permissions (sandbox/model/denial-store), Sandbox, Model, Prompt, Telemetry
- [`symbol_index_infra_integration.md`](symbol_index_infra_integration.md) — Slash Commands, Plugins, Hooks, UI surfaces

## File:Line Format

For v2.1.193 the canonical source citation is `cli_inner_pretty.js:<line>` — the single pretty-printed bundle at `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines; VERSION `2.1.193`, build `a1938d2a`, BUILD_TIME `2026-06-25T18:18:11Z`). Lines tagged `(183)` / `(156)` are explicitly before-pictures. **Obfuscated names are re-mangled every build** — a 183 token never carries into 193.

## Per-module symbol manifests

This delta tree keeps the full per-symbol mapping tables in the **per-module additions files**. This index is the routing layer; the curated tables below carry only the most load-bearing anchors. Consult the additions file for the exhaustive, line-by-line, before/after table:

- [`symbol_additions_v2_1_193_background_agents.md`](symbol_additions_v2_1_193_background_agents.md) — Background Agents (idle bg-shell reaping, subagent-depth tracking, stop lifecycle, backgrounding/panel fixes)
- [`symbol_additions_v2_1_193_compact.md`](symbol_additions_v2_1_193_compact.md) — Compact (`Ego`→`Rxo` discriminated-union dispatcher refactor + carryover engine)
- [`symbol_additions_v2_1_193_auto_memory.md`](symbol_additions_v2_1_193_auto_memory.md) — Auto Memory (`tengu_billiard_aviary` removal, MEMORY.md compact reminder, dream carryover)
- [`symbol_additions_v2_1_193_workflow.md`](symbol_additions_v2_1_193_workflow.md) — Workflow / StructuredOutput (success guard + 5-attempt retry cap, `/workflows` status filter)
- [`symbol_additions_v2_1_193_agent_team.md`](symbol_additions_v2_1_193_agent_team.md) — Agent Team (`teammateMode:"iterm2"`, `--effort` inheritance, stop attribution)
- [`symbol_additions_v2_1_193_skills.md`](symbol_additions_v2_1_193_skills.md) — Skills (frontmatter case-tolerance, malformed-YAML handling, `/plugin` Installed Skills section)

> The **Auto-mode** rows below (`classifyAllShell`, denial-kind taxonomy, worker-permission forwarding) are borrowed from [`symbol_additions_v2_1_193_permissions.md`](symbol_additions_v2_1_193_permissions.md); that file's manifest bullet lives in [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) (its Sandbox/Model/denial-store rows), and its named-spawn rows route to [`symbol_index_core_execution.md`](symbol_index_core_execution.md).

> The **Plan Mode** rows below are current-state/carryover anchors rather than a 193 delta manifest. Deep-dive home: [`../05_plan_mode/README.md`](../05_plan_mode/README.md). The v2.1.183 before-picture is [`../../../claude_code_v_2.1.183/analyze/04_tools/reconstructed_source/tools/PlanModeTools.ts`](../../../claude_code_v_2.1.183/analyze/04_tools/reconstructed_source/tools/PlanModeTools.ts).

> The **Todo / Tasks** rows below are current-state/carryover anchors rather than a 193 delta manifest. Deep-dive home: [`../46_todo_tasks/README.md`](../46_todo_tasks/README.md). The v2.1.183 before-picture is [`../../../claude_code_v_2.1.183/analyze/04_tools/reconstructed_source/tools/TaskTools.ts`](../../../claude_code_v_2.1.183/analyze/04_tools/reconstructed_source/tools/TaskTools.ts) and [`../../../claude_code_v_2.1.183/analyze/04_tools/reconstructed_source/tools/TodoWriteTool.ts`](../../../claude_code_v_2.1.183/analyze/04_tools/reconstructed_source/tools/TodoWriteTool.ts).

---

## Module: Todo / Tasks — V1 TodoWrite + V2 file-backed task list

Current 2.1.193 task-tracking implementation: `TodoWrite` is the legacy app-state checklist enabled only when V2 task tools are disabled; `TaskCreate`/`TaskGet`/`TaskUpdate`/`TaskList` are the V2 file-backed task-list CRUD tools; reminder attachments nudge stale task management; `TaskCreated` / `TaskCompleted` hooks can block creation/completion; the UI task panel watches the file store. Mostly carryover from v2.1.183, indexed here because the task-tracking surface crosses tools, reminders, hooks, agent-team ownership, persistent state, and UI. Deep-dive home: [`../46_todo_tasks/README.md`](../46_todo_tasks/README.md).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AVa` | `RECENT_COMPLETED_TASK_TTL_MS` (=30000; recent-completion visibility window) | cli_inner_pretty.js:365279 | constant |
| `aUp` | `TaskListV2TaskItem` (renders one task row with icon, owner, blockers, activity) | cli_inner_pretty.js:365188 | function |
| `BR` | `TODO_WRITE_TOOL_NAME` (`"TodoWrite"`) | cli_inner_pretty.js:229407 | constant |
| `Boc` | `mapTodoItemsForTaskSummary` (V1 app-state todos to task-summary items) | cli_inner_pretty.js:620030 | function |
| `Buf` | `countTaskReminderTurns` (TaskCreate/TaskUpdate + `task_reminder` backward scan) | cli_inner_pretty.js:474335 | function |
| `But` | `todoListSchema` (`TodoWrite` array schema) | cli_inner_pretty.js:308595 | function |
| `CVa` | `TaskListV2ExternalStore` (watcher/polling store for V2 task panel snapshots) | cli_inner_pretty.js:365294 | class |
| `DJt` | `restoreSessionStateFromTranscript` (restores goal/file history and V1 todos on resume) | cli_inner_pretty.js:641573 | function |
| `Fuf` | `buildTaskReminderAttachments` (V2 stale-task reminder generator) | cli_inner_pretty.js:474368 | function |
| `Foc` | `mapTaskV2ItemsForTaskSummary` (V2 durable tasks to task-summary items) | cli_inner_pretty.js:620040 | function |
| `GIa` | `createTask` (locked next-id allocation + per-task JSON write) | cli_inner_pretty.js:308374 | function |
| `GQf` | `extractLastTodoWriteTodos` (finds latest `TodoWrite` input in transcript) | cli_inner_pretty.js:641542 | function |
| `gQf` | `toggleTodosPanel` (toggles `expandedView` between `"tasks"` and `"none"`) | cli_inner_pretty.js:639717 | function |
| `Gyp` | `todoWriteOutputSchema` (`oldTodos`, `newTodos`) | cli_inner_pretty.js:308813 | function |
| `h9t` | `executeTaskCreatedHooks` (`TaskCreated` hook input builder) | cli_inner_pretty.js:588674 | function |
| `HWt` | `useTasksV2Snapshot` (gated `useSyncExternalStore` bridge for task panel state) | cli_inner_pretty.js:365367 | function |
| `hWn` | `TaskListV2` (expanded/standalone task panel renderer and truncation algorithm) | cli_inner_pretty.js:365045 | function |
| `Ine` | `getTask` (schema-validated task JSON read) | cli_inner_pretty.js:308391 | function |
| `IVa` | `useVisibleTasksV2` (collapses task panel when V2 task snapshot is unavailable) | cli_inner_pretty.js:365372 | function |
| `Jcl` | `TaskListTool` (read-only compact task scheduler view) | cli_inner_pretty.js:438299 | object |
| `j6n` | `TaskOutputTool` (read-only background-task output retrieval; legacy aliases) | cli_inner_pretty.js:435497 | object |
| `jcl` | `TaskGetTool` (read-only full-detail task lookup) | cli_inner_pretty.js:437888 | object |
| `kco` | `blockTask` (writes both sides of `blocks` / `blockedBy`) | cli_inner_pretty.js:308465 | function |
| `Lcl` | `coerceTaskCreateInput` (unwraps aliases / task wrapper) | cli_inner_pretty.js:437657 | function |
| `M8t` | `taskSummaryItemsKey` (stable change key for status-summary items) | cli_inner_pretty.js:464299 | function |
| `Nbe` | `updateTask` (locked patch write) | cli_inner_pretty.js:308414 | function |
| `Ncl` | `TaskCreateTool` (single-task create + hook rollback) | cli_inner_pretty.js:437790 | object |
| `n6t` | `TODO_REMINDER_CONFIG` (`TURNS_SINCE_WRITE:10`, `TURNS_BETWEEN_REMINDERS:10`) | cli_inner_pretty.js:474653 | constant |
| `Nuf` | `buildTodoReminderAttachments` (V1 stale-TodoWrite reminder generator) | cli_inner_pretty.js:474313 | function |
| `Ouf` | `countTodoReminderTurns` (`TodoWrite` + `todo_reminder` backward scan) | cli_inner_pretty.js:474288 | function |
| `PWe` | `taskStatusSchema` (`pending` / `in_progress` / `completed`) | cli_inner_pretty.js:308579 | function |
| `Qj` | `listTasks` (schema-validates and numerically sorts task files) | cli_inner_pretty.js:308453 | function |
| `qcl` | `TaskUpdateTool` (field/status/owner/dependency update hub) | cli_inner_pretty.js:438067 | object |
| `R9e` | `executeTaskCompletedHooks` (`TaskCompleted` hook input builder) | cli_inner_pretty.js:588686 | function |
| `Rht` | `TaskStopTool` (background-task stop; passes `killedBy:"parent"`) | cli_inner_pretty.js:431902 | object |
| `SD` | `TASK_STOP_TOOL_NAME` (`"TaskStop"`) | cli_inner_pretty.js:228816 | constant |
| `tLe` | `TodoWriteTool` (legacy per-session checklist replacement) | cli_inner_pretty.js:308815 | object |
| `vF` | `getTaskListId` (env / teammate / team / session list-id resolver) | cli_inner_pretty.js:308332 | function |
| `yBn` | `deleteTask` (delete file + high-watermark + dependency cleanup) | cli_inner_pretty.js:308426 | function |
| `z_l` | `setTaskSummaryState` (publishes derived task/status summary metadata) | cli_inner_pretty.js:464308 | function |
| `ZH` | `isTodoV2Enabled` (V2 task-tools gate via `CLAUDE_CODE_ENABLE_TASKS`) | cli_inner_pretty.js:308309 | function |

## Module: Plan Mode — tools, reminders, permission restore, UI

Current 2.1.193 Plan Mode implementation: `EnterPlanMode` enters the `"plan"` permission mode, cadenced `plan_mode` attachments enforce read-only planning and plan-file writes only, and `ExitPlanMode` restores `prePlanMode` after approval. Mostly carryover from 2.1.183, indexed here because it crosses tools, attachments, compact, permission context, teammate approval, and UI. Deep-dive home: [`../05_plan_mode/README.md`](../05_plan_mode/README.md).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `A4t` | `transitionPlanAutoMode` (reconcile auto-mode state while still in plan mode) | cli_inner_pretty.js:598796 | function |
| `AQf` | `buildExitPlanModeOptions` (approval/rejection/context-clear/Ultraplan option list) | cli_inner_pretty.js:640541 | function |
| `C7` | `ENTER_PLAN_MODE_TOOL_NAME` (`"EnterPlanMode"`) | cli_inner_pretty.js:229308 | constant |
| `Ex` | `EXIT_PLAN_MODE_TOOL_NAME` (`"ExitPlanMode"`; prompt/reference alias) | cli_inner_pretty.js:153113 | constant |
| `Fk_` | `exitPlanModeSdkInputSchema` (extends input with injected `plan`, `planFilePath`) | cli_inner_pretty.js:381508 | function |
| `GQl` | `renderExitPlanModeProtocolFooter` (end turn with AskUserQuestion or ExitPlanMode) | cli_inner_pretty.js:601218 | function |
| `HEl` | `buildPlanModeExitAttachment` | cli_inner_pretty.js:473445 | function |
| `KKn` | `buildPlanModeAttachmentForCompact` (full plan reminder after compaction) | cli_inner_pretty.js:470052 | function |
| `Kza` | `EXIT_PLAN_MODE_V2_TOOL_PROMPT` | cli_inner_pretty.js:380558 | constant |
| `Pko` | `countHumanTurnsSinceLastPlanAttachment` | cli_inner_pretty.js:473394 | function |
| `Pmt` | `prepareContextForPlanMode` (stashes `prePlanMode`, handles auto-on-plan entry) | cli_inner_pretty.js:598786 | function |
| `Qpc` | `EnterPlanModePermissionRequest` UI dialog | cli_inner_pretty.js:646536 | function |
| `Rko` | `PLAN_MODE_ATTACHMENT_CONFIG` (`TURNS_BETWEEN_ATTACHMENTS:5`, `FULL_REMINDER_EVERY_N_ATTACHMENTS:5`) | cli_inner_pretty.js:474654 | constant |
| `Tar` | `mapExitPlanModeChoiceToPermissionResult` (UI option to permission result) | cli_inner_pretty.js:640586 | function |
| `TTt` | `hasExitedPlanModeInSession` | cli_inner_pretty.js:3402 | function |
| `UD` | `ExitPlanModeTool` (approval, teammate leader request, plan-file read, prePlanMode restore) | cli_inner_pretty.js:381532 | object |
| `Z5n` | `EnterPlanModeTool` (deferred, read-only, agent-context blocked, sets mode to `plan`) | cli_inner_pretty.js:381889 | object |
| `a5f` | `renderSparsePlanModeAttachment` | cli_inner_pretty.js:601311 | function |
| `bse` | `setNeedsPlanModeExitAttachment` | cli_inner_pretty.js:3411 | function |
| `cUl` | `remotePlanModeReminderWithDiagram` (Ultraplan diagram-aware prompt) | cli_inner_pretty.js:537576 | variable |
| `eme` | `handlePlanModeTransition` (toggles plan-mode exit attachment flag on mode crossings) | cli_inner_pretty.js:3414 | function |
| `fdc` | `ExitPlanModePermissionRequest` UI dialog/editor | cli_inner_pretty.js:640625 | function |
| `fuf` | `countPlanModeAttachmentsSinceLastExit` | cli_inner_pretty.js:473410 | function |
| `gGp` | `exitPlanModeOutputSchema` (`plan`, `isAgent`, `filePath`, `planWasEdited`, approval fields) | cli_inner_pretty.js:381511 | function |
| `hGp` | `getWhatHappensInPlanMode` prompt fragment | cli_inner_pretty.js:381733 | function |
| `i5f` | `renderFullPlanModeAttachment` (read-only preamble + five-phase workflow) | cli_inner_pretty.js:601224 | function |
| `jQl` | `PLAN_MODE_READ_ONLY_PREAMBLE` | cli_inner_pretty.js:602488 | constant |
| `kz` | `setHasExitedPlanMode` | cli_inner_pretty.js:3405 | function |
| `l5f` | `renderSubagentPlanModeAttachment` | cli_inner_pretty.js:601316 | function |
| `lUl` | `remotePlanModeReminderLight` (Ultraplan lightweight remote prompt) | cli_inner_pretty.js:537540 | variable |
| `mGp` | `allowedPromptSchema` (`{ tool:"Bash", prompt }`) | cli_inner_pretty.js:381493 | function |
| `muf` | `buildPlanModeAttachments` (full/sparse/reentry attachment generator) | cli_inner_pretty.js:473421 | function |
| `o5f` | `renderPlanModeAttachment` (dispatches full/sparse/subagent reminders) | cli_inner_pretty.js:601213 | function |
| `pKa` | `exitPlanModeInputSchema` (`allowedPrompts` plus passthrough) | cli_inner_pretty.js:381500 | function |
| `qEo` | `PLAN_REJECTED_FEEDBACK_PREFIX` | cli_inner_pretty.js:602456 | constant |
| `qfr` | `needsPlanModeExitAttachment` | cli_inner_pretty.js:3408 | function |
| `s5f` | `FINAL_PLAN_PHASE_PROMPT` | cli_inner_pretty.js:602480 | constant |
| `uD` | `EXIT_PLAN_MODE_V2_TOOL_NAME` (`"ExitPlanMode"`; tool-object name) | cli_inner_pretty.js:153114 | constant |
| `uUl` | `remotePlanModeReminderMultiAgent` (Ultraplan multi-agent prompt) | cli_inner_pretty.js:537612 | variable |
| `yGp` | `getEnterPlanModeToolPrompt` | cli_inner_pretty.js:381748 | function |

## Module: Permissions / Auto-mode — classifier + denial-kind taxonomy

The auto-mode shell-trust classifier setting, the auto-mode allow-layer builder (which skips suspended allow rules), the NET-NEW-but-dark 5-way denial-kind taxonomy, the approval-reason map, and the carryover background-subagent worker-permission forwarding. The platform-side suspend gate (`$Cr`/`sTo`/`r9e`) lives under **Module: Permissions** in [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md). Exhaustive home: [`symbol_additions_v2_1_193_permissions.md`](symbol_additions_v2_1_193_permissions.md).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `classifyAllShell` | `autoMode.classifier.classifyAllShell` (zod field; NET-NEW 2.1.193) | cli_inner_pretty.js:55814 | object |
| `dQl` | `isAutoMode` (`"auto"` or active plan-auto) | cli_inner_pretty.js:597459 | function |
| `NEe` | `buildAutoModeAllowLayers` (skips suspended allow rules) | cli_inner_pretty.js:597462 | function |
| `yjo` | suspended-allow-rule display collector | cli_inner_pretty.js:598268 | function |
| `XKa` | `classifyToolDenialKind` (5-way denial taxonomy; NET-NEW) | cli_inner_pretty.js:382614 | function |
| `USe` | `isToolDenialKindEnabled` (`return !1`; dark-launch gate) | cli_inner_pretty.js:382624 | function |
| `toolDenialKind` | per-message denial-kind field (NET-NEW, inert; 7 sites) | cli_inner_pretty.js:445167 | object |
| `aSo` | `AUTOMODE_PARSE_FAIL_PREFIX` | cli_inner_pretty.js:382627 | constant |
| `qGp` | classifier-input renderer (consumes `toolDenialKind`) | cli_inner_pretty.js:383163 | function |
| `dQa` | `setAutoModeApprovalReason` (approvals map; carryover, 183 `PNa`) | cli_inner_pretty.js:395284 | function |
| `pQa` | `getAutoModeApprovalReason` (carryover) | cli_inner_pretty.js:395293 | function |
| `rdc` | `forwardWorkerPermissionRequest` (CARRYOVER; sets `pendingWorkerRequest`) | cli_inner_pretty.js:640151 | function |
| `M8n` | `buildWorkerPermissionRequest` (CARRYOVER; `workerName`/`workerColor`) | cli_inner_pretty.js:426557 | function |
| `pendingWorkerRequest` | worker-permission state field (CARRYOVER; 7 hits both) | cli_inner_pretty.js:303749 | object |

## Module: Background Agents — memory-pressure idle bg-shell reaping

NET-NEW (2.1.193) reaper that kills idle background shells under memory pressure, gated by `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP` and bypassed while the main loop is busy / agent tasks are active. Exhaustive home: [`symbol_additions_v2_1_193_background_agents.md`](symbol_additions_v2_1_193_background_agents.md) ("memory-pressure idle bg-shell reaping").

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Mgl` | `registerBgShellPressureReaper` | cli_inner_pretty.js:454354 | function |
| `Ldu` | env `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP` (`Fe.bool()`) | cli_inner_pretty.js:43175 | function |
| `eof` | `BG_SHELL_IDLE_REAP_MS` (=1800000) | cli_inner_pretty.js:454610 | constant |
| `VI` | `getLastInteractionTime` | cli_inner_pretty.js:2784 | function |
| `umr` | `isMainLoopBusy` | cli_inner_pretty.js:3647 | function |
| `e8e` | `hasActiveAgentTasks` | cli_inner_pretty.js:587048 | function |
| `R4f` | `ACTIVE_AGENT_TASK_TYPES` (Set) | cli_inner_pretty.js:587093 | constant |
| `o8t` | `notifyAndFinalizeShellTask` | cli_inner_pretty.js:454302 | function |
| `BSe` | `killLocalShellTask` | cli_inner_pretty.js:382320 | function |
| `xPe` | `launchBackgroundLocalBash` | cli_inner_pretty.js:454369 | function |
| `Kzn` | `backgroundRunningShellTask` | cli_inner_pretty.js:454527 | function |

## Module: Background Agents — subagent depth tracking

The 5-level nested-subagent depth cap as it stands in 193 (carryover constant/getter, re-mangled) plus the NET-NEW typed `SubagentLaunchError` thrown at the cap with a `tengu_feature_bad("subagent_launch","subagent_depth_cap")` emit. Exhaustive home: [`symbol_additions_v2_1_193_background_agents.md`](symbol_additions_v2_1_193_background_agents.md) ("subagent depth tracking").

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `FBt` | `SUBAGENT_DEPTH_LIMIT` (=5; carryover of 183 `v1i`) | cli_inner_pretty.js:229871 | constant |
| `K3` | `getAgentDepth` (carryover of 183 `Gz`) | cli_inner_pretty.js:103808 | function |
| `Kl` | `isLocalAgentTask` (carryover of 183 `od`; shared with Agent Team stop path) | cli_inner_pretty.js:453726 | function |
| `RPe` | `SubagentLaunchError` (Error subclass thrown by depth cap) | cli_inner_pretty.js:430357 | class |

## Module: Background Agents — stop lifecycle + backgrounding/panel fixes

NET-NEW (2.1.191) agent stop lifecycle (user-stop marker persisted to disk, `AgentStoppedError` on resume) and the backgrounding/panel carry-over bookkeeping fixes (2.1.193/2.1.191). Exhaustive home: [`symbol_additions_v2_1_193_background_agents.md`](symbol_additions_v2_1_193_background_agents.md) ("agent stop lifecycle", "backgrounding & panel fixes").

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Kr` | `currentBgCwdOverride` (refreshed bg cwd consumed by classifier state writes) | cli_inner_pretty.js:193511 | function |
| `Mde` | `markAgentStoppedByUser` (also drives Agent Team user-source stop) | cli_inner_pretty.js:431808 | function |
| `CXp` | `persistStopMarker` | cli_inner_pretty.js:431816 | function |
| `Hre` | `readAgentDiskState` | cli_inner_pretty.js:581895 | function |
| `Tde` | `writeAgentDiskState` | cli_inner_pretty.js:581867 | function |
| `t7l` | `agentStateMetaPath` (builds `<agentId>.meta.json`) | cli_inner_pretty.js:581864 | function |
| `Vht` | `AgentStoppedError` (thrown on resume of a stopped agent) | cli_inner_pretty.js:441779 | class |
| `dSc` | `mapAgentPanelChildRows` (panel child rows; 193 maps `frame` children, 183 `JJl` filtered them) | cli_inner_pretty.js:674897 | function |
| `Eim` | `measureChildArtifactWidth` (artifact-width fallback for frame-only child lists) | cli_inner_pretty.js:674539 | function |
| `oUo` | `countAbandonedBgTasks` | cli_inner_pretty.js:578073 | function |
| `fze` | `computeCarryOverMap` | cli_inner_pretty.js:578006 | function |
| `k3i` | `refreshBgJobCwdAfterCd` (bg-only `cwd`/`originCwd` metadata refresh after `/cd`) | cli_inner_pretty.js:193514 / call 484488 | function |
| `Lgl` | `registerCompletedResumedAgent` | cli_inner_pretty.js:454100 | function |
| `JKl` | `readJobDir` | cli_inner_pretty.js:577927 | function |
| `QKl` | `linkAdoptedAgentTranscript` | cli_inner_pretty.js:577951 | function |
| `R3i` | `refreshBgJobResumePointers` (bg-only `resumeSessionId`/`linkScanPath` refresh after conversation reset) | cli_inner_pretty.js:193529 / call 485419 | function |

## Module: Compact — refactored dispatcher (discriminated-union return)

Behavior-preserving refactor: the auto-compact dispatcher's flat `{wasCompacted}` return becomes a `{kind}` discriminated union (183 `Ego`→193 `Rxo`), with `CSl`/`VDn`/`VZr` helper extractions and a constant-folded thrash message. Engine semantics (thresholds, circuit-breaker caps, 1M-credits clamp) are carryover. Exhaustive home: [`symbol_additions_v2_1_193_compact.md`](symbol_additions_v2_1_193_compact.md).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Rxo` | `autoCompactDispatcher` (async generator returning `{kind}` union; 183 `Ego` flat `{wasCompacted}`) | cli_inner_pretty.js:470250 | function |
| `CSl` | `compactFailedResult` ("failed" factory; `tengu_auto_compact_circuit_breaker` at `>=3`) | cli_inner_pretty.js:470189 | function |
| `VDn` | `rapidRefillBreaker` (`{action:"trip"\|"proceed", consecutiveRapidRefills}`) | cli_inner_pretty.js:235130 | function |
| `u8d` | `rapidRefillCount` (bare count; 183 `Igo`) | cli_inner_pretty.js:235127 | function |
| `lcf` | `autocompactNeeded` (gate; 183 `Xjp`) | cli_inner_pretty.js:470238 | function |
| `acf` | `prefixOverflowProbe` (emits `tengu_auto_compact_prefix_overflow`; 183 `Yjp`) | cli_inner_pretty.js:470203 | function |
| `WDn` | `resolveThresholdSource` (6-source window/threshold resolver; 183 `ywn`) | cli_inner_pretty.js:235039 | function |
| `VZr` | `makeCompactedState` (success-state factory) | cli_inner_pretty.js:235134 | function |
| `wSl` | `streamCompactSummary` (summarize loop honoring `--fallback-model`; 183 `del`) | cli_inner_pretty.js:469797 | function |
| `Xxo` | `isColdCompact` (`CLAUDE_CODE_COLD_COMPACT` env reader) | cli_inner_pretty.js:470235 | function |
| `BIo` | `shouldRunPostCompactBookkeeping` (takes pre-derived `autocompactRan`; 183 `PAo`) | cli_inner_pretty.js:466460 | function |
| `wYe` | `getLongContext1mCreditsBlocked` (1M-credits clamp-flag getter) | cli_inner_pretty.js:2875 | function |
| `ISl` | `FAILURE_BREAKER_MAX` (`3`; 183 `jgo`) | cli_inner_pretty.js:470357 | constant |
| `qZr` | `THRASH_MESSAGE` (constant-folded; 183 template literal `wgo`) | cli_inner_pretty.js:235138 | constant |

## Module: Auto Memory — billiard_aviary removal + carryover engine

The headline change is the **removal** of the `tengu_billiard_aviary` immutable-memory / `tiny_memory` experiment; the recall/dream engine and the MEMORY.md 200-line/25KB compact-reminder are carryover (re-mangled). Exhaustive home: [`symbol_additions_v2_1_193_auto_memory.md`](symbol_additions_v2_1_193_auto_memory.md). The 183-only removed symbols (`aH`/`XXu`/`Hgi`/`FOa`…) are tabled there as the before-picture.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `v$t` | `truncateMemoryIndexForPrompt` (caps `MEMORY.md` at 200 lines / 25KB; 183 `Zkt`) | cli_inner_pretty.js:152573 | function |
| `UH` | `MEMORY_INDEX_FILENAME` (`"MEMORY.md"`; 183 `$w`) | cli_inner_pretty.js:151952 | constant |
| `RY` | `MEMORY_INDEX_LINE_LIMIT` (`200`; 183 `tie`) | cli_inner_pretty.js:151953 | constant |
| `Kae` | `MEMORY_INDEX_BYTE_LIMIT` (`25000`; 183 `HTe`) | cli_inner_pretty.js:151954 | constant |
| `$_l` | `buildConsolidationPrompt` (single dream prompt builder; body == 183 `PQa`) | cli_inner_pretty.js:463735 | function |
| `Daf` | `getDreamThrottleConfig` (`tengu_onyx_plover` minHours/minSessions) | cli_inner_pretty.js:463818 | function |
| `G_l` | `initAutoDream` (installs the `executeAutoDream` closure) | cli_inner_pretty.js:463837 | function |
| `j_l` | `executeAutoDream` (dream firing closure; `aH()` immutable branch removed) | cli_inner_pretty.js:463839 | function |
| `qae` | `parseMemoryStoresEnv` (`CLAUDE_MEMORY_STORES` JSON parse/validate) | cli_inner_pretty.js:151593 | function |

## Module: Workflow — StructuredOutput success guard + retry cap + status filter

NET-NEW (2.1.187) StructuredOutput success guard + `requiresStructuredOutput` inline enforcement (replaces the 183 Stop-hook `zKn`), the `agent({schema})` 5-failure retry cap (2.1.186), and the `/workflows` detail `f` status filter (2.1.186). Exhaustive home: [`symbol_additions_v2_1_193_workflow.md`](symbol_additions_v2_1_193_workflow.md). The shared `Fi` (`DualError`) thrown by `qVd` on schema mismatch is catalogued under **Module: MCP** in [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ep` | `STRUCTURED_OUTPUT_TOOL` (`"StructuredOutput"`; 183 `Em`) | cli_inner_pretty.js:229498 | constant |
| `$Qr` | `STRUCTURED_OUTPUT_BASE_TOOL` (`endsTurn:true`, read-only, `maxResultSizeChars:1e5`) | cli_inner_pretty.js:229509 | object |
| `qVd` | `schemaToolFactory` (Ajv `allErrors:true`; overrides `inputJSONSchema`; throws `Fi` on mismatch) | cli_inner_pretty.js:229472 | function |
| `wt` | `workflowAgentRunner` (`async function wt(tt,nt,Rt,$t)`; hosts success guard + retry cap; distinct local from the platform `wt`@547334) | cli_inner_pretty.js:423705 | function |
| `m4` | `subagentQueryGenerator` (gains `requiresStructuredOutput: W` param) | cli_inner_pretty.js:398565 | function |
| `requiresStructuredOutput` | force-StructuredOutput query option (NET-NEW; 0 in 183, 8 in 193) | cli_inner_pretty.js:398601 | variable |
| `NYp` | `DEFAULT_SO_RETRIES` (`5`; schema-failure cap) | cli_inner_pretty.js:424307 | constant |
| `kol` | `STALL_RETRY_CAP` (`5`; separate outer stall-retry cap — do NOT conflate with `NYp`) | cli_inner_pretty.js:424306 | constant |
| `vbl` | `messagePrepGenerator` (per-turn; injects the gated SO nudge) | cli_inner_pretty.js:465576 | function |
| `Ibl` | `structuredOutputSucceeded` (latest SO `tool_use` has `is_error !== true`?) | cli_inner_pretty.js:601998 | function |
| `Hbl` | `ENFORCE_SENTINEL` (`"[structured-output-enforce]"`; nudge dedup marker; 0 in 183) | cli_inner_pretty.js:465901 | constant |
| `eYt` | `workflowDetailFilterOrder` (`["all","running","queued","failed","done","skipped","interrupted"]`; 0 in 183) | cli_inner_pretty.js:543272 | constant |
| `XOo` | `STATUS_LABELS` (`done→"Completed"`, `interrupted→"Stopped"`) | cli_inner_pretty.js:543273 | object |
| `pe` | `cycleStatusFilter` (advance filter, skipping empty statuses; resets scroll/selection) | cli_inner_pretty.js:543007 | function |

## Module: Agent Team — teammateMode iterm2 + effort inheritance + stop attribution

NET-NEW (2.1.186) `teammateMode:"iterm2"` explicit pin + iTerm2 backend, `--effort` inheritance into pane-spawned teammates, and the NET-NEW+FIX (2.1.187) stop-notification attribution ("finished"/"was stopped by Claude|user", was 183 "came to rest"). Exhaustive home: [`symbol_additions_v2_1_193_agent_team.md`](symbol_additions_v2_1_193_agent_team.md). `Mde`/`Kl` are shared with Background Agents (tabled above).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `uhs` | `EXEC_MODE_ENUM` (`["auto","tmux","iterm2","in-process"]`; 183 `Its` lacked `"iterm2"`) | cli_inner_pretty.js:54136 | constant |
| `kPe` | `detectAndGetBackend` (gains explicit `iterm2` branch) | cli_inner_pretty.js:429186 | function |
| `zRe` | `getTeammateModeFromSnapshot` (default `$jt="in-process"`) | cli_inner_pretty.js:302915 | function |
| `$jt` | `DEFAULT_TEAMMATE_MODE` (`"in-process"`) | cli_inner_pretty.js:302920 | constant |
| `R8` | `isInsideITerm2` (`TERM_PROGRAM==="iTerm.app"` / `ITERM_SESSION_ID`) | cli_inner_pretty.js:363523 | function |
| `Rft` | `isIt2CliReachable` (`command -v it2`, then `it2 session list`) | cli_inner_pretty.js:363533 | function |
| `rvo` | `ITermBackend` (class; `type="iterm2"`, `displayName="iTerm2"`) | cli_inner_pretty.js:429024 | class |
| `svo` | `createITermBackend` | cli_inner_pretty.js:429181 | function |
| `iXp` | `emitPaneFallbackHint` (auto-mode pane-open failure → in-process) | cli_inner_pretty.js:429964 | function |
| `pil` | `buildInheritedCliFlags` (leader/pane variant; also pushes `--teammate-mode`; 183 `F5a`) | cli_inner_pretty.js:428485 | function |
| `Mil` | `buildInheritedSubagentCliFlags` (subagent-pane variant; no `--teammate-mode`) | cli_inner_pretty.js:429445 | function |
| `PIe` | `isLaunchEffortUnpinned` (`unpinOpus47/48LaunchEffort && unpinFable5LaunchEffort`) | cli_inner_pretty.js:149794 | function |
| `Eqe` | `enqueueAgentNotification` (`killedBy` param; "finished"/"was stopped by…"; 183 "came to rest") | cli_inner_pretty.js:453792 | function |
| `kht` | `stopTask` (`killedBy="user"` default; cascades to children) | cli_inner_pretty.js:431759 | function |
| `GSe` | `killAndNotifyTask` (`GSe(e,t,n="user")`; propagates `killedBy`) | cli_inner_pretty.js:453871 | function |
| `LEo` | `teammateIdleBanner` (idleReason → "finished"; 183 `Hao` "came to rest") | cli_inner_pretty.js:390965 | function |

## Module: Skills — frontmatter pipeline + `/plugin` Installed-tab

NET-NEW (2.1.186) skill-frontmatter multi-case key tolerance, malformed-`SKILL.md` YAML now loading the body with empty metadata + surfacing a `parseError`, and a "Skills" section in the `/plugin` Installed tab. The frontmatter parser/schema/shadow-validator is shared by skills, slash-commands, agents and output-styles; its primary home for this delta is here. `OAf` also touches the plugin-UI surface tracked in [`symbol_index_infra_integration.md`](symbol_index_infra_integration.md). Exhaustive home: [`symbol_additions_v2_1_193_skills.md`](symbol_additions_v2_1_193_skills.md).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Gm` | `parseMarkdownFrontmatter` (now returns `parseError`; 183 `CA` did not) | cli_inner_pretty.js:149511 | function |
| `eye` | `FRONTMATTER_REGEX` (`/^---\s*\n([\s\S]*?)---\s*\n?/`) | cli_inner_pretty.js:149612 | constant |
| `Zhe` | `parseYaml` (`Bun.YAML.parse`) | cli_inner_pretty.js:149467 | function |
| `XEd` | `quoteSpecialYaml` (retry-pass pre-processor) | cli_inner_pretty.js:149477 | function |
| `KEd` | `normalizeFrontmatterKey` (`replace(/[-_]/g,"").toLowerCase()`) | cli_inner_pretty.js:149400 | function |
| `zEd` | `CANONICAL_FRONTMATTER_KEYS` | cli_inner_pretty.js:149406 | constant |
| `tVr` | `skillFrontmatterSchema` (`GEd().extend(...)`) | cli_inner_pretty.js:149302 | object |
| `qEd` | `frontmatterShadowSchemasByKind` ({skill,agent,output-style}; `.strict()`) | cli_inner_pretty.js:149393 | object |
| `ije` | `shadowValidateFrontmatter` (telemetry-only `.strict()` check) | cli_inner_pretty.js:149238 | function |
| `UCo` | `parseSkillFrontmatterFields` (manual camelCase/kebab reader) | cli_inner_pretty.js:451524 | function |
| `aje` | `parseFallbackFlag` | cli_inner_pretty.js:149592 | function |
| `uyt` | `loadSkillsFromDir` (consumes `parseError` → `skill_load_yaml_failed`) | cli_inner_pretty.js:451677 | function |
| `OAf` | `pluginScopeSectionLabel` (adds `case "skills": return "Skills"`; 183 `GYp`) | cli_inner_pretty.js:519209 | function |

---

For the v2.1.156→v2.1.183 core-features baseline, see the v2.1.183 tree's [`symbol_index_core_features.md`](../../../claude_code_v_2.1.183/analyze/00_overview/symbol_index_core_features.md).
