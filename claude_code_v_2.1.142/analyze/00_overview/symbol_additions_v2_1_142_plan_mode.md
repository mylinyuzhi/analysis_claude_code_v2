# Symbol Additions — v2.1.142 Plan Mode

This file lists symbols discovered while producing the `12_plan_mode/` deobfuscation pack for v2.1.142. It is the **per-unit** companion to the canonical `symbol_index_*.md` files (the canonical files are not modified per unit policy).

All entries cross-validated against the v2.1.88 unobfuscated source at `/lyz/codespace/3rd/claude-code/src/` and against the v2.1.112 mappings in `claude_code_v_2.1.112/analyze/00_overview/symbol_additions_unit_01.md`. Each symbol has BOTH a v2.1.142 bundle location AND a v2.1.88 source file:line reference.

Note: v2.1.142 obfuscated identifiers DIFFER from v2.1.112 identifiers. The bundler regenerates names per release. The "Prior obfuscated name" column shows the v2.1.112 identifier for the same readable function, where known.

---

## Module: Plan Mode — Tools

| Obfuscated (v2.1.142) | Readable | v2.1.142 File:Line | Prior (v2.1.112) | v2.1.88 Source | Type |
|------------------------|----------|--------------------|-------------------|----------------|------|
| `Q38` | `EnterPlanModeTool` | cli_inner_pretty.js:383798 | `o58` | `tools/EnterPlanModeTool/EnterPlanModeTool.ts:36` | tool object |
| `Q3H` | `ENTER_PLAN_MODE_TOOL_NAME` | cli_inner_pretty.js:211429 | `d56` | `tools/EnterPlanModeTool/constants.ts:1` | constant `"EnterPlanMode"` |
| `ve_` | `enterPlanModeInputSchema` | cli_inner_pretty.js:383796 | `RjY` | `tools/EnterPlanModeTool/EnterPlanModeTool.ts:21` | Zod schema (lazy) |
| `ke_` | `enterPlanModeOutputSchema` | cli_inner_pretty.js:383797 | `SjY` | `tools/EnterPlanModeTool/EnterPlanModeTool.ts:27` | Zod schema (lazy) |
| `ll7` | `getEnterPlanModeToolPrompt` | cli_inner_pretty.js:383806 (call) | `$vK` | `tools/EnterPlanModeTool/prompt.ts:165` | function (dispatcher) |
| `bf` | `isPlanModeInterviewPhaseEnabled` | cli_inner_pretty.js:383640 | `Sj` | `utils/planModeV2.ts:50` | function |
| `il7` | `renderEnterPlanModeToolUseMessage` | cli_inner_pretty.js:383828 | `HvK` | `tools/EnterPlanModeTool/UI.tsx` | function |
| `rl7` | `renderEnterPlanModeToolResultMessage` | cli_inner_pretty.js:383829 | `JvK` | `tools/EnterPlanModeTool/UI.tsx` | function |
| `ol7` | `renderEnterPlanModeToolUseRejectedMessage` | cli_inner_pretty.js:383830 | `XvK` | `tools/EnterPlanModeTool/UI.tsx` | function |
| `V2` | `ExitPlanModeV2Tool` | cli_inner_pretty.js:381649 | `zZ` | `tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts:147` | tool object |
| `NZ` | `EXIT_PLAN_MODE_V2_TOOL_NAME` | cli_inner_pretty.js:143087 | `dP` | `tools/ExitPlanModeTool/constants.ts:2` | constant `"ExitPlanMode"` |
| `kZ` | `EXIT_PLAN_MODE_TOOL_NAME` (legacy alias) | cli_inner_pretty.js:143086 | `Fk` | `tools/ExitPlanModeTool/constants.ts:1` | constant `"ExitPlanMode"` |
| `dc7` | `EXIT_PLAN_MODE_V2_TOOL_PROMPT` | cli_inner_pretty.js:381657 | `PGK` | `tools/ExitPlanModeTool/prompt.ts:6` | string |
| `lt_` | `allowedPromptSchema` | cli_inner_pretty.js:381606 | `n$Y` | `tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts:64` | Zod schema |
| `sc7` | `exitPlanModeInputSchema` | cli_inner_pretty.js:381612 | `TGK` | `tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts:77` | Zod schema (lazy) |
| `N53` | `exitPlanMode_sdkInputSchema` | cli_inner_pretty.js:381624 | `Vs2` | `tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts:97` | Zod schema (lazy, SDK-facing) |
| `nt_` | `exitPlanModeOutputSchema` | cli_inner_pretty.js:381630 | `i$Y` | `tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts:110` | Zod schema (lazy) |
| `v9H` | `autoModeStateModule` (lazy) | cli_inner_pretty.js:381713 | `vGK` | `tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts:51` | module ref (call-time lazy load) |
| `x38` | `permissionSetupModule` (lazy) | cli_inner_pretty.js:381714 | `qI6` | `tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts:54` | module ref (call-time lazy load) |
| `cc7` | `renderExitPlanModeToolUseMessage` | cli_inner_pretty.js:381706 | `WGK` | `tools/ExitPlanModeTool/UI.tsx` | function |
| `lc7` | `renderExitPlanModeToolResultMessage` | cli_inner_pretty.js:381707 | `DGK` | `tools/ExitPlanModeTool/UI.tsx` | function |
| `nc7` | `renderExitPlanModeToolUseRejectedMessage` | cli_inner_pretty.js:381708 | `ZGK` | `tools/ExitPlanModeTool/UI.tsx` | function |

---

## Module: Plan Mode — Plan File / Slug

| Obfuscated (v2.1.142) | Readable | v2.1.142 File:Line | Prior (v2.1.112) | v2.1.88 Source | Type |
|------------------------|----------|--------------------|-------------------|----------------|------|
| `PDH` | `getPlanSlug` | cli_inner_pretty.js:517632 | `g56` | `utils/plans.ts:32` | function (with promptSeed) |
| `haH` | `getPlanSlugForSession` (cache reader) | cli_inner_pretty.js:517648 | `pb8` | `utils/plans.ts` (cache helper) | function |
| `tg6` | `setPlanSlug` | cli_inner_pretty.js:517651 | `jn1` | `utils/plans.ts:54` | function |
| `u74` | `clearAllPlanSlugs` | cli_inner_pretty.js:517654 | `PR4` | `utils/plans.ts:71` | function |
| `v2` | `getPlanFilePath` | cli_inner_pretty.js:517657 | `eW` | `utils/plans.ts:119` | function |
| `HW` | `getPlan` | cli_inner_pretty.js:517662 | `lP` | `utils/plans.ts:135` | function |
| `Hy4` | `getSlugFromLog` | cli_inner_pretty.js:517671 | `WR4` | `utils/plans.ts:149` | function |
| `RA8` | `copyPlanForResume` | cli_inner_pretty.js:517674 | `Fb8` | `utils/plans.ts:164` | async function |
| `$y4` | `copyPlanForFork` | cli_inner_pretty.js:517700 | `DR4` | `utils/plans.ts:239` | async function |
| `ox5` | `recoverPlanFromMessages` | cli_inner_pretty.js:517714 | `rJz` | `utils/plans.ts:279` | function |
| `ax5` | `findFileSnapshotEntry` | cli_inner_pretty.js:517742 | `oJz` | `utils/plans.ts:332` | function |
| `u38` | `persistFileSnapshotIfRemote` | cli_inner_pretty.js:517750 | `gb8` | `utils/plans.ts:360` | async function |
| `SO` | `getPlansDirectory` | cli_inner_pretty.js:517791 | `aO` | `utils/plans.ts:79` | function (memoized via `L8`) |
| `rx5` | `MAX_SLUG_RETRIES` | cli_inner_pretty.js:517776 | `iJz` | `utils/plans.ts:25` | constant `10` |
| `Li$` | `generateWordSlug` | cli_inner_pretty.js:138981 | `Bb8` | `utils/words.ts:785` | function (3-word slug) |
| `nmH` | `generateShortWordSlug` | cli_inner_pretty.js:138997 | `Zh6` | `utils/words.ts:796` | function (2-word slug) |
| `Sq6` | `slugifyPrompt` | cli_inner_pretty.js:138987 | `MR4` | (v2.1.111+ addition) | function |
| `Qh1` | `randomInt` | cli_inner_pretty.js:138975 | `UJz` | `utils/words.ts:763` | function (crypto-backed) |
| `k5$` | `pickRandom` | cli_inner_pretty.js:138978 | `R88` | `utils/words.ts:773` | function |
| `ZTK` | `ADJECTIVES` | cli_inner_pretty.js:139005+ | `JR4` | `utils/words.ts:9` | constant (array of 235) |
| `GTK` | `NOUNS` | cli_inner_pretty.js:139002+ | `XR4` | `utils/words.ts:271` | constant (array ~330) |
| `gh1` | `VERBS` | cli_inner_pretty.js:139002+ | `gJz` | `utils/words.ts:633` | constant (array of 108) |

---

## Module: Plan Mode — State (chunks.1 session flags / U$ globals)

| Obfuscated (v2.1.142) | Readable | v2.1.142 File:Line | Prior (v2.1.112) | v2.1.88 Source | Type |
|------------------------|----------|--------------------|-------------------|----------------|------|
| `HH$` | `hasExitedPlanModeInSession` | cli_inner_pretty.js:2949 | `_p6` | `bootstrap/state.ts` | function (getter) |
| `OT` | `setHasExitedPlanMode` | cli_inner_pretty.js:2952 | `iL` | `bootstrap/state.ts` | function (setter) |
| `Cv8` | `getNeedsPlanModeExitAttachment` | cli_inner_pretty.js:2955 | `x81` | `bootstrap/state.ts` | function (getter) |
| `qh` | `setNeedsPlanModeExitAttachment` | cli_inner_pretty.js:2958 | `Km` | `bootstrap/state.ts` | function (setter) |
| `Oo` | `handlePlanModeTransition` | cli_inner_pretty.js:2961 | `bi` | `bootstrap/state.ts` | function (transition hook) |
| `bv8` | `getNeedsAutoModeExitAttachment` | cli_inner_pretty.js:2965 | `u81` | `bootstrap/state.ts` | function (getter) |
| `MT` | `setNeedsAutoModeExitAttachment` | cli_inner_pretty.js:2968 | `sG` | `bootstrap/state.ts` | function (setter) |
| `xv8` | `handleAutoModeTransition` | cli_inner_pretty.js:2971 | `m81` | `bootstrap/state.ts` | function (transition hook) |
| `i_H` | `getPlanSlugCache` | cli_inner_pretty.js:3024 | (parallel of) `h86` | `bootstrap/state.ts` | function (returns Map) |
| `U$.hasExitedPlanMode` | (state field) | cli_inner_pretty.js:2270 | `B8.hasExitedPlanMode` | `bootstrap/state.ts` | flag |
| `U$.needsPlanModeExitAttachment` | (state field) | cli_inner_pretty.js:2271 | `B8.needsPlanModeExitAttachment` | `bootstrap/state.ts` | flag |
| `U$.needsAutoModeExitAttachment` | (state field) | cli_inner_pretty.js:2272 | `B8.needsAutoModeExitAttachment` | `bootstrap/state.ts` | flag |
| `U$.planSlugCache` | (state field) | cli_inner_pretty.js:2276 | `B8.planSlugCache` | `bootstrap/state.ts` | Map<SessionId, string> |
| `v$` | `getSessionId` | utility | `I8` | `bootstrap/state.ts` | function |

---

## Module: Plan Mode — Attachment Builder

| Obfuscated (v2.1.142) | Readable | v2.1.142 File:Line | Prior (v2.1.112) | v2.1.88 Source | Type |
|------------------------|----------|--------------------|-------------------|----------------|------|
| `d65` | `buildPlanModeAttachment` | cli_inner_pretty.js:397726 | `HMY` | `services/attachments/planModeAttachment.ts` (approx) | async function |
| `c65` | `buildPlanModeExitAttachment` | cli_inner_pretty.js:397750 | (paired) | (attachment helper) | async function |
| `bs7` | `countTurnsSinceLastPlanAttachment` | cli_inner_pretty.js:397699 | `$MY` | (attachment helper) | function |
| `Q65` | `countPlanModeAttachmentsSinceExit` | cli_inner_pretty.js:397715 | `jMY` | (attachment helper) | function |
| `Is7` | `PLAN_MODE` (config constants) | utility (referenced from `d65`) | `bNK` | (config block) | object/constants |
| `n65` | `buildAutoModeAttachment` | cli_inner_pretty.js:397783 | (parallel) | (attachment helper) | async function |
| `i65` | `buildAutoModeExitAttachment` | cli_inner_pretty.js:397799+ | (parallel) | (attachment helper) | async function |
| `Ss7` | `AUTO_MODE` (config constants) | utility | (parallel of) `bNK` | (config block) | object/constants |
| `xs7` | `countTurnsSinceLastAutoAttachment` | cli_inner_pretty.js:397759 | (parallel) | (attachment helper) | function |
| `l65` | `countAutoModeAttachmentsSinceExit` | cli_inner_pretty.js:397772 | (parallel) | (attachment helper) | function |
| `planSlugSeed` | (slash-command option key) | cli_inner_pretty.js:353293 | (same) | `commands/slash/runner.ts` (approximate) | option key |

---

## Module: Plan Mode — Permission Helpers / Auto-Mode

| Obfuscated (v2.1.142) | Readable | v2.1.142 File:Line | Prior (v2.1.112) | v2.1.88 Source | Type |
|------------------------|----------|--------------------|-------------------|----------------|------|
| `UkH` | `prepareContextForPlanMode` | cli_inner_pretty.js:422720 | `zI6` | `utils/permissions/permissionSetup.ts` | function |
| `TdH` | `transitionPlanAutoMode` | cli_inner_pretty.js:422736 | (related) | `utils/permissions/permissionSetup.ts` | function |
| `KG` | `isAutoModeGateEnabled` | cli_inner_pretty.js:422669 | (same letters in v2.1.112) | `utils/permissions/permissionSetup.ts` | function |
| `eHH` | `getAutoModeUnavailableReason` | cli_inner_pretty.js:422675 | (parallel) | `utils/permissions/permissionSetup.ts` | function |
| `o9H` | `getAutoModeUnavailableNotification` | utility | (parallel) | `utils/permissions/permissionSetup.ts` | function |
| `CQ` | `stripDangerousPermissionsForAutoMode` | utility | (parallel) | `utils/permissions/permissionSetup.ts` | function |
| `bb` | `promoteToAutoModeContext` | utility | (parallel) | `utils/permissions/permissionSetup.ts` | function |
| `dA5` | `setPermissionModeWithGuards` | cli_inner_pretty.js:422400 | (parallel) | `utils/permissions/permissionSetup.ts` | function |
| `tHH` | `transitionPermissionMode` | cli_inner_pretty.js:422385 | (parallel) | `utils/permissions/permissionSetup.ts` | function |
| `Qz` | `applyPermissionUpdate` | utility | `EY` | `utils/permissions/PermissionUpdate.ts` | function |
| `Rv` | `validatePermissionMode` | utility | (parallel) | `utils/permissions/...` | function |
| `zR6` | `initialPermissionModeFromCLI` | cli_inner_pretty.js:422449 | (parallel) | `utils/permissions/permissionSetup.ts` | function |
| `jR6` | `shouldPlanUseAutoMode` | utility | (parallel) | `utils/permissions/permissionSetup.ts` | function |
| `ON` | `autoModeStateModule` (top-level lazy ref) | utility | (parallel) | `utils/permissions/autoModeState.ts` | module ref |
| `vC` | `recordModeTransition` | utility | (parallel) | analytics utility | function |

---

## Module: Plan Mode — Slash Command + Re-Entry (v2.1.119 fix)

| Obfuscated (v2.1.142) | Readable | v2.1.142 File:Line | Prior (v2.1.112) | v2.1.88 Source | Type |
|------------------------|----------|--------------------|-------------------|----------------|------|
| `Wv5` | `planSlashCommandHandler` | cli_inner_pretty.js:483806 | (renamed) | `commands/slash/plan.ts` (approx) | async function |
| `Pv5` | `PlanPreviewComponent` | cli_inner_pretty.js:483777 | (renamed) | `components/commands/PlanPreview.tsx` (approx) | React component |
| `Zv5` | `planSlashCommandDef` | cli_inner_pretty.js:483872 | (renamed) | `commands/slash/plan.ts` (def) | command definition |
| `AS` | `openInEditor` | utility | (parallel) | (editor utility) | async function |
| `UT7` | `renderInkComponent` | utility | (parallel) | (Ink render utility) | async function |
| `xy` | `getEditor` | utility | (parallel) | (editor pref accessor) | function |
| `cD` | `getEditorDisplayName` | utility | (parallel) | (editor pref accessor) | function |
| `Gf` | `getRemoteControlBridge` | utility | (parallel) | (bridge accessor) | function |

---

## Module: Plan Mode — Session Restore + Permission Mode (v2.1.132 fix)

| Obfuscated (v2.1.142) | Readable | v2.1.142 File:Line | Prior (v2.1.112) | v2.1.88 Source | Type |
|------------------------|----------|--------------------|-------------------|----------------|------|
| `nZ8` | `sessionRestore` | cli_inner_pretty.js:564282 | (parallel) | `session/restore.ts` (approx) | async function |
| `ur5` | `restoreFromTranscriptPermissionMode` | cli_inner_pretty.js:564219 | `zYA` | `session/restore.ts` (parallel) | async function |
| `mr5` | `restoreModel` | cli_inner_pretty.js:564231 | (parallel) | `session/restore.ts` (parallel) | function |
| `permissionModeCliSet` | (option-bag flag) | cli_inner_pretty.js:607273 (call site) | (same key in v2.1.112) | (option-bag) | boolean |
| `OI7` | `buildControlRequestEvents` | cli_inner_pretty.js:335076 | (parallel) | `remote/sessions.ts` (approx) | function |

---

## Module: Plan Mode — Write Permission Floor (v2.1.136 fix)

| Obfuscated (v2.1.142) | Readable | v2.1.142 File:Line | Prior (v2.1.112) | v2.1.88 Source | Type |
|------------------------|----------|--------------------|-------------------|----------------|------|
| `VkH` | `checkWritePermissionForTool` | cli_inner_pretty.js:518202 | (parallel) | `utils/permissions/filesystem.ts:1205` | function |
| `d64` | `isPlanModeFloorReason` | cli_inner_pretty.js:421723 | (NOT PRESENT) | (no v2.1.88 counterpart — v2.1.136-new) | function (predicate) |
| `iUH` | `checkEditableInternalPath` | cli_inner_pretty.js:518335 | (parallel) | `utils/permissions/filesystem.ts:1479` | function |
| `hG$` | `generateSuggestions` | cli_inner_pretty.js:518287 | (parallel) | `utils/permissions/filesystem.ts:1414` | function |
| `GI` | `pathInAllowedWorkingPath` | utility | (parallel) | `utils/permissions/filesystem.ts` | function |
| `yL` | `matchingRuleForInput` | utility | (parallel) | `utils/permissions/...` | function |
| `wy4` | `matchingRuleForInput` (alt) | utility | (parallel) | `utils/permissions/...` | function |
| `bY$` | `checkPathSafetyForAutoEdit` | utility | (parallel) | `utils/permissions/filesystem.ts` | function |
| `tD` | `applyHookPermissionDecision` (dispatcher with auto-mode classifier fast-path) | cli_inner_pretty.js:421879 | (parallel) | `utils/permissions/...` | function |
| `UA5` | `checkPermissionsGate` (pre-dispatch) | cli_inner_pretty.js:421757 | (parallel) | `utils/permissions/...` | async function |
| `jDH` | `checkPermissionsGate` (alt) | cli_inner_pretty.js:421726 | (parallel) | `utils/permissions/...` | async function |
| `dw8` | `isAskRuleReason` | cli_inner_pretty.js:421716 | (parallel) | (decision-reason helper) | function |
| `RQ` | `findInDecisionReasons` | cli_inner_pretty.js:421865 | (parallel) | (decision-reason helper) | function |
| `si$` | `CLAUDE_FOLDER_PERMISSION_PATTERN` | constant | (parallel) | `utils/permissions/...` | constant |
| `ti$` | `GLOBAL_CLAUDE_FOLDER_PERMISSION_PATTERN` | constant | (parallel) | `utils/permissions/...` | constant |

---

## Module: Plan Mode — Ultraplan Integration (renamed only)

| Obfuscated (v2.1.142) | Readable | v2.1.142 File:Line | Prior (v2.1.112) | v2.1.88 Source | Type |
|------------------------|----------|--------------------|-------------------|----------------|------|
| `gj4` | `ExitPlanModeScanner` | cli_inner_pretty.js:475135 | `PlK` | `utils/ultraplan/ExitPlanModeScanner.ts` (approx) | class |
| `Qj4` | `pollForApprovedExitPlanMode` | cli_inner_pretty.js:475178 | `WlK` | `utils/ultraplan/pollForApprovedExitPlanMode.ts` (approx) | async function |
| `s05` | `extractApprovedPlan` | cli_inner_pretty.js:475245 | `rQY` | `utils/ultraplan/extractApprovedPlan.ts` (approx) | function |
| `a05` | `extractTeleportPlan` | cli_inner_pretty.js:475237 | `iQY` | `utils/ultraplan/extractTeleportPlan.ts` (approx) | function |
| `dj4` | `contentToText` | cli_inner_pretty.js:475234 | `DlK` | `utils/ultraplan/contentToText.ts` (approx) | function |
| `T$H` | `UltraplanPollError` | cli_inner_pretty.js:475269 | `_66` | `utils/ultraplan/errors.ts` (approx) | class |
| `sQ` | `isUltraplanAvailable` | cli_inner_pretty.js:475282 | `hn` | `utils/ultraplan/config.ts` (approx) | function |
| `o05` | `ULTRAPLAN_TELEPORT_SENTINEL` | cli_inner_pretty.js:475264 | `nQY` | (constant) | constant `"__ULTRAPLAN_TELEPORT_LOCAL__"` |
| `Fj4` | `POLL_INTERVAL_MS` | cli_inner_pretty.js:475261 | `MlK` | (constant) | constant `3000` |
| `r05` | `MAX_CONSECUTIVE_FAILURES` | cli_inner_pretty.js:475262 | `lQY` | (constant) | constant `5` |
| `VwH` | `pollRemoteSessionEvents` | utility | (parallel) | `utils/ultraplan/pollRemoteSessionEvents.ts` (approx) | async function |
| `qdH` | `isRetryableNetworkError` | utility | (parallel) | utility | function |
| `a8` | `sleep` | utility | (parallel) | utility | function |

---

## v2.1.142-Only Additions (Net New vs v2.1.112)

These symbols/behaviors exist in v2.1.142 but **not** in v2.1.112:

| Symbol | What it is | Where | Driving Changelog |
|--------|------------|-------|-------------------|
| `T6` (`isBackgroundSession`) pairing in `Q38.isEnabled` and `V2.isEnabled` | New predicate that pairs with `getAllowedChannels().length > 0` so plan mode is only suppressed in actual background-worker contexts | cli_inner_pretty.js:381670, 383819 | (silent in changelog; related to `claude agents` flag additions) |
| `d64` (`isPlanModeFloorReason`) | Decision-reason classifier: returns true when `decisionReason.type === "mode" && mode === "plan"` | cli_inner_pretty.js:421723 | v2.1.136 |
| `VkH` plan-mode floor branch | New return-ask inserted between safety checks and acceptEdits/allow-rule consultation | cli_inner_pretty.js:518269-518274 | v2.1.136 |
| `VkH` `.claude/**` gate addition | New `q.mode !== "plan"` guard on the `.claude/**` session-allow bypass | cli_inner_pretty.js:518234 | v2.1.136 |
| Plan-mode-floor analytics in `tD` | New `plan_mode_floor` reason in `tengu_auto_mode_fallback_to_ask` analytics | cli_inner_pretty.js:421918 | v2.1.136 |
| `ur5` CLI-flag preemption | `if (permissionModeCliSet) return undefined` early-return so CLI flag wins | cli_inner_pretty.js:564220 | v2.1.132 |
| `Wv5` plan-rendering branch | `/plan` command now checks `haH()` for existing plan and renders if present; supports `open` subcommand | cli_inner_pretty.js:483806-483854 | v2.1.119 |
| Deferred-tool resume warning text update | "pass `--permission-mode ${X}` to match" actionable hint added | cli_inner_pretty.js:277313 | v2.1.132 |
| Module lazy-load via Promise.all in `V2.call` | Refactor: `v9H`/`x38` resolved inside `call()` body via `Promise.all` instead of top-level feature() gate | cli_inner_pretty.js:381713-381714 | (refactor, no behavior change) |

---

## Symbol Lookup Quick Reference

If reading the analysis docs and you encounter an unfamiliar obfuscated name in the plan-mode docs, search this table first. For non-plan-mode symbols, check the canonical `symbol_index_*.md` files.

### Notes on Renaming Convention (v2.1.112 → v2.1.142)

- The bundler regenerates identifier names between releases. **None of the v2.1.112 plan-mode obfuscated names (`o58`, `zZ`, `g56`, `HMY`, etc.) are present in v2.1.142.**
- New names are typically 2-4 character mixed-case strings with `$`, `_`, or numbers (`Q38`, `V2`, `PDH`, `d65`, etc.).
- When searching for a known function, prefer string-literal matching (`"EnterPlanMode tool cannot be used in agent contexts"`) over identifier matching.
- Multi-letter symbols ending in a single character often have logical grouping: the `_c7` suffix (e.g. `dc7`, `lt_`, `sc7`, `nc7`, `cc7`, `lc7`) appears in the ExitPlanModeV2Tool cluster.

### Single-letter parameter mappings

Parameter names inside `call`/`mapToolResultToToolResultBlockParam` (`H`, `$`, `q`, `K`, `_`, `A`, `z`, `Y`, `f`, `O`, `M`, `w`, `D`, `j`, `J`, `X`, `L`, `P`, `Z`, `W`, `G`, `V`) are remapped to semantic parameter names per-function. See the code snippet mapping comments in the module docs for per-function pairings.

---

## Validation

To verify the obfuscated names in this table:

```bash
# Verify EnterPlanMode tool name
grep -n "Q3H = \"EnterPlanMode\"" /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js
# Expected: hit around 211429

# Verify ExitPlanMode tool name
grep -n "kZ = \"ExitPlanMode\"" /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js
grep -n "NZ = \"ExitPlanMode\"" /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js
# Expected: hits around 143086, 143087

# Verify getPlanSlug
grep -n "function PDH" /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js
# Expected: hit at 517632

# Verify plan-mode floor
grep -n "Cannot write to.*while in plan mode" /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js
# Expected: hit at 518272

# Verify d64
grep -n "function d64" /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js
# Expected: hit at 421723

# Verify slug functions
grep -n "function Sq6\|function Li\\\$\|function nmH" /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js
# Expected: hits at 138987, 138981, 138997
```

All cited symbols have been verified present in the v2.1.142 bundle.
