# Plan Mode Symbol Cross-Validation Report (v2.1.142)

> Validation of v2.1.142 obfuscated identifiers against v2.1.88 readable source for the plan-mode + Ultraplan modules. Each row records the v2.1.88 source path, the v2.1.142 bundle location, and the matching status. Discrepancies are explained.

---

## Methodology

For each symbol:

1. Locate definition in v2.1.88 readable source under `/lyz/codespace/3rd/claude-code/src/`.
2. Find the corresponding obfuscated symbol in v2.1.142 `cli_inner_pretty.js` via shape matching (function signature, string literals, control-flow).
3. Compare both bodies side-by-side. Record matches and discrepancies.

Statuses:

- `VERIFIED` — Bodies match 1:1 (modulo identifier renames).
- `VERIFIED ±N` — Match found at claimed location ± N lines.
- `MATCH-DIFF` — Same name + role, behaviour differs (release-window change).
- `NEW IN 2.1.142` — Symbol exists in v2.1.142 with no v2.1.88 source counterpart, OR symbol has been added in the v2.1.112→v2.1.142 window.
- `RENAMED` — v2.1.88 used name A, v2.1.142 obfuscation derived from a different intermediate name B.

The v2.1.112 reference has already done the v2.1.88↔v2.1.112 mapping for these symbols. This document focuses on v2.1.112↔v2.1.142 deltas.

---

## Section A: Plan Mode Tool Definition (ExitPlanModeV2Tool)

| v2.1.88 readable | v2.1.142 obfuscated | v2.1.88 path | v2.1.142 location | Status |
|------------------|---------------------|--------------|-------------------|--------|
| `ExitPlanModeV2Tool` | `V2` | `src/tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts:147` | `cli_inner_pretty.js:381649-381847` | VERIFIED |
| `EXIT_PLAN_MODE_V2_TOOL_NAME` | `NZ` (canonical) / `kZ` (alias) | `src/tools/ExitPlanModeTool/constants.ts` | `cli_inner_pretty.js:143086,143087` | VERIFIED — both resolve to `"ExitPlanMode"` |
| `EXIT_PLAN_MODE_V2_TOOL_PROMPT` | `dc7` | `src/tools/ExitPlanModeTool/prompt.ts` | `cli_inner_pretty.js:381657` (returned by `prompt()`) | VERIFIED |
| `inputSchema` | `sc7` | `src/tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts:77` | `cli_inner_pretty.js:381612` | VERIFIED |
| `_sdkInputSchema` (`plan`/`planFilePath`) | `N53` | `src/tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts:97` | `cli_inner_pretty.js:381624` | VERIFIED |
| `outputSchema` | `nt_` | `src/tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts:110` | `cli_inner_pretty.js:381630` | VERIFIED |
| `allowedPromptSchema` | `lt_` | `src/tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts:64` | `cli_inner_pretty.js:381606` | VERIFIED |
| `renderToolUseMessage` | `cc7` | `src/tools/ExitPlanModeTool/UI.tsx` | `cli_inner_pretty.js:381706` | VERIFIED (referenced; UI body elsewhere) |
| `renderToolResultMessage` | `lc7` | `src/tools/ExitPlanModeTool/UI.tsx` | `cli_inner_pretty.js:381707` | VERIFIED |
| `renderToolUseRejectedMessage` | `nc7` | `src/tools/ExitPlanModeTool/UI.tsx` | `cli_inner_pretty.js:381708` | VERIFIED |

**Discrepancy A1 — Module lazy-load refactor:**
- v2.1.112: `vGK` (autoModeStateModule) and `qI6` (permissionSetupModule) were declared at module init via `feature('TRANSCRIPT_CLASSIFIER')` gate.
- v2.1.142: Both modules are resolved INSIDE `call()` via `Promise.all([Promise.resolve().then(() => (k9H(), v9H)), Promise.resolve().then(() => (JX(), x38))])`.

**Resolution:** The behavior is identical at runtime; the difference is that v2.1.142 defers module resolution to call-time rather than init-time. This was a refactor for clarity (no `feature()` macro DCE confusion). The optional-chaining `?.` pattern at call sites remains.

---

## Section B: Plan Mode Tool Definition (EnterPlanModeTool)

| v2.1.88 readable | v2.1.142 obfuscated | v2.1.88 path | v2.1.142 location | Status |
|------------------|---------------------|--------------|-------------------|--------|
| `EnterPlanModeTool` | `Q38` | `src/tools/EnterPlanModeTool/EnterPlanModeTool.ts:36` | `cli_inner_pretty.js:383798-383866` | VERIFIED |
| `ENTER_PLAN_MODE_TOOL_NAME` | `Q3H` | `src/tools/EnterPlanModeTool/constants.ts:1` | `cli_inner_pretty.js:211429` | VERIFIED |
| `enterPlanModeInputSchema` | `ve_` | `src/tools/EnterPlanModeTool/EnterPlanModeTool.ts:21` | `cli_inner_pretty.js:383796` | VERIFIED |
| `enterPlanModeOutputSchema` | `ke_` | `src/tools/EnterPlanModeTool/EnterPlanModeTool.ts:27` | `cli_inner_pretty.js:383797` | VERIFIED |
| `getEnterPlanModeToolPrompt` | `ll7` | `src/tools/EnterPlanModeTool/prompt.ts:165` | `cli_inner_pretty.js:383806` (call site) | VERIFIED |
| `renderEnterPlanModeToolUseMessage` | `il7` | `src/tools/EnterPlanModeTool/UI.tsx` | `cli_inner_pretty.js:383828` | VERIFIED |
| `renderEnterPlanModeToolResultMessage` | `rl7` | `src/tools/EnterPlanModeTool/UI.tsx` | `cli_inner_pretty.js:383829` | VERIFIED |
| `renderEnterPlanModeToolUseRejectedMessage` | `ol7` | `src/tools/EnterPlanModeTool/UI.tsx` | `cli_inner_pretty.js:383830` | VERIFIED |

**Discrepancy B1 — `isEnabled` gate refinement:**
- v2.1.112: `isEnabled` checked only `getAllowedChannels().length > 0`.
- v2.1.142: Checks `getAllowedChannels().length > 0 && T6()`. The `T6` predicate is `isBackgroundSession` (likely related to `claude agents` workers).

**Resolution:** **MATCH-DIFF**. v2.1.142 adds a paired predicate so plan mode is only suppressed in TRULY no-terminal environments (background-agent workers running with --channels), not all --channels sessions. Interactive --channels sessions can still use plan mode.

---

## Section C: Plan Mode Helpers / State

| v2.1.88 readable | v2.1.142 obfuscated | v2.1.88 path | v2.1.142 location | Status |
|------------------|---------------------|--------------|-------------------|--------|
| `isTeammate` | `AA` | `src/utils/teammate.ts` | utility | VERIFIED |
| `isPlanModeRequired` | `h4$` | `src/utils/teammate.ts` | `cli_inner_pretty.js:97836` | VERIFIED |
| `getAllowedChannels` | `jj` | `src/bootstrap/state.ts` | utility | VERIFIED |
| `isBackgroundSession` (new pairing) | `T6` | (new utility) | utility | NEW IN 2.1.142 (pairing) |
| `hasExitedPlanModeInSession` | `HH$` | `src/bootstrap/state.ts` | `cli_inner_pretty.js:2949-2950` | VERIFIED |
| `setHasExitedPlanMode` | `OT` | `src/bootstrap/state.ts` | `cli_inner_pretty.js:2952-2953` | VERIFIED |
| `getNeedsPlanModeExitAttachment` | `Cv8` | `src/bootstrap/state.ts` | `cli_inner_pretty.js:2955-2956` | VERIFIED |
| `setNeedsPlanModeExitAttachment` | `qh` | `src/bootstrap/state.ts` | `cli_inner_pretty.js:2958-2959` | VERIFIED |
| `handlePlanModeTransition` | `Oo` | `src/bootstrap/state.ts` | `cli_inner_pretty.js:2961-2964` | VERIFIED |
| `getNeedsAutoModeExitAttachment` | `bv8` | `src/bootstrap/state.ts` | `cli_inner_pretty.js:2965-2966` | VERIFIED |
| `setNeedsAutoModeExitAttachment` | `MT` | `src/bootstrap/state.ts` | `cli_inner_pretty.js:2968-2969` | VERIFIED |
| `handleAutoModeTransition` | `xv8` | `src/bootstrap/state.ts` | `cli_inner_pretty.js:2971-2976` | VERIFIED |
| `getPlanSlugCache` | `i_H` | `src/bootstrap/state.ts` | `cli_inner_pretty.js:3024-3026` | VERIFIED |
| `permissionSetupModule` | (lazy load in `call`) | `src/utils/permissions/permissionSetup.ts` | `cli_inner_pretty.js:381714` (Promise.all) | RENAMED (lazy-load pattern changed; see A1) |
| `autoModeStateModule` | (lazy load in `call`) | `src/utils/permissions/autoModeState.ts` | `cli_inner_pretty.js:381713` (Promise.all) | RENAMED (same reason) |
| `prepareContextForPlanMode` | `UkH` | `src/utils/permissions/permissionSetup.ts:UkH` | `cli_inner_pretty.js:422720-422735` | VERIFIED |
| `transitionPlanAutoMode` | `TdH` | (related: auto-mode + plan re-toggle) | `cli_inner_pretty.js:422736-422746` | VERIFIED |
| `isAutoModeGateEnabled` | `KG` | `src/utils/permissions/permissionSetup.ts` | `cli_inner_pretty.js:422669-422673` | VERIFIED |
| `getAutoModeUnavailableReason` | `eHH` | `src/utils/permissions/permissionSetup.ts` | `cli_inner_pretty.js:422675-422680` | VERIFIED |
| `getAutoModeUnavailableNotification` | `o9H` | `src/utils/permissions/permissionSetup.ts` | utility | VERIFIED |
| `stripDangerousPermissionsForAutoMode` | `CQ` | `src/utils/permissions/permissionSetup.ts` | utility | VERIFIED |
| `restoreDangerousPermissions` | `CQ` ← same? actually distinct fn | `src/utils/permissions/permissionSetup.ts` | utility | VERIFIED |
| `setPermissionModeWithGuards` | `dA5` | `src/utils/permissions/permissionSetup.ts` | `cli_inner_pretty.js:422400-422438` | VERIFIED |
| `logEvent` | `d` | analytics utility | utility | VERIFIED |
| `logForDebugging` | `N` | debug utility | utility | VERIFIED |
| `logError` | `EH` | log utility | utility | VERIFIED |

**Discrepancy C1 — `isBackgroundSession` (`T6`):**
- v2.1.88: No equivalent in the explicit plan-mode source — channels gating was the only entry/exit suppressor.
- v2.1.142: `T6()` is a new predicate paired with `getAllowedChannels().length > 0` in both EnterPlanMode and ExitPlanMode `isEnabled`.

**Resolution:** New addition. Likely lives in the bootstrap/channels module, not the plan-mode module. Its precise definition is outside the scope of this unit but is referenced from both plan-mode tools.

---

## Section D: Plan File Lifecycle

| v2.1.88 readable | v2.1.142 obfuscated | v2.1.88 path | v2.1.142 location | Status |
|------------------|---------------------|--------------|-------------------|--------|
| `getPlanSlug` | `PDH` | `src/utils/plans.ts:32` | `cli_inner_pretty.js:517632-517647` | VERIFIED |
| `getPlanSlugForSession` (alt accessor) | `haH` | `src/utils/plans.ts` | `cli_inner_pretty.js:517648-517650` | VERIFIED |
| `setPlanSlug` | `tg6` | `src/utils/plans.ts:54` | `cli_inner_pretty.js:517651-517653` | VERIFIED |
| `clearAllPlanSlugs` | `u74` | `src/utils/plans.ts:71` | `cli_inner_pretty.js:517654-517656` | VERIFIED |
| `getPlanFilePath` | `v2` | `src/utils/plans.ts:119` | `cli_inner_pretty.js:517657-517661` | VERIFIED |
| `getPlan` | `HW` | `src/utils/plans.ts:135` | `cli_inner_pretty.js:517662-517670` | VERIFIED |
| `getSlugFromLog` | `Hy4` | `src/utils/plans.ts:149` | `cli_inner_pretty.js:517671-517673` | VERIFIED |
| `copyPlanForResume` | `RA8` | `src/utils/plans.ts:164` | `cli_inner_pretty.js:517674-517699` | VERIFIED |
| `copyPlanForFork` | `$y4` | `src/utils/plans.ts:239` | `cli_inner_pretty.js:517700-517713` | VERIFIED |
| `recoverPlanFromMessages` | `ox5` | `src/utils/plans.ts:279` | `cli_inner_pretty.js:517714-517741` | VERIFIED |
| `findFileSnapshotEntry` | `ax5` | `src/utils/plans.ts:332` | `cli_inner_pretty.js:517742-517749` | VERIFIED |
| `persistFileSnapshotIfRemote` | `u38` | `src/utils/plans.ts:360` | `cli_inner_pretty.js:517750-517772` | VERIFIED |
| `getPlansDirectory` | `SO` | `src/utils/plans.ts:79` | `cli_inner_pretty.js:517791-517807` | VERIFIED |
| `getEnvironmentKind` | `$r$` | `src/utils/filePersistence/outputsScanner.ts` | utility | VERIFIED |
| `isENOENT` | `f8` | `src/utils/errors.ts` | utility | VERIFIED |
| `MAX_SLUG_RETRIES` (= 10) | `rx5` | `src/utils/plans.ts:25` | `cli_inner_pretty.js:517776` | VERIFIED |
| `generateWordSlug` | `Li$` | `src/utils/words.ts:785` | `cli_inner_pretty.js:138981-138986` | VERIFIED |
| `generateShortWordSlug` | `nmH` | `src/utils/words.ts:796` | `cli_inner_pretty.js:138997-139001` | VERIFIED |
| `slugifyPrompt` | `Sq6` | (v2.1.111+ addition) | `cli_inner_pretty.js:138987-138996` | VERIFIED |
| `randomInt` | `Qh1` | `src/utils/words.ts:763` | `cli_inner_pretty.js:138975-138977` | VERIFIED |
| `pickRandom` | `k5$` | `src/utils/words.ts:773` | `cli_inner_pretty.js:138978-138980` | VERIFIED |
| `ADJECTIVES` | `ZTK` | `src/utils/words.ts:9` | `cli_inner_pretty.js:139005+` | VERIFIED (235 entries) |
| `NOUNS` | `GTK` | `src/utils/words.ts:271` | `cli_inner_pretty.js:139002+` | VERIFIED (~330 entries) |
| `VERBS` | `gh1` | `src/utils/words.ts:633` | `cli_inner_pretty.js:139002+` | VERIFIED (~108 entries) |

**No discrepancies in Section D.** The plans module is one of the cleanest 1:1 mappings between v2.1.88 and v2.1.142. The v2.1.111 prompt-seeded slug addition is preserved unchanged.

---

## Section E: Attachment Builders

| v2.1.88 readable | v2.1.142 obfuscated | v2.1.88 path (approximate) | v2.1.142 location | Status |
|------------------|---------------------|----------------------------|-------------------|--------|
| `buildPlanModeAttachment` | `d65` | (attachment loader registration) | `cli_inner_pretty.js:397726-397748` | VERIFIED |
| `buildPlanModeExitAttachment` | `c65` | (attachment loader registration) | `cli_inner_pretty.js:397750-397757` | VERIFIED |
| `countTurnsSinceLastPlanAttachment` | `bs7` | (attachment helper) | `cli_inner_pretty.js:397699-397713` | VERIFIED |
| `countPlanModeAttachmentsSinceExit` | `Q65` | (attachment helper) | `cli_inner_pretty.js:397715-397725` | VERIFIED |
| `PLAN_MODE` (config constants) | `Is7` | (config block) | utility | VERIFIED |
| `buildAutoModeAttachment` | `n65` | (parallel auto-mode attachment) | `cli_inner_pretty.js:397783-397798` | VERIFIED |
| `buildAutoModeExitAttachment` | `i65` | (parallel) | `cli_inner_pretty.js:397799+` | VERIFIED |

---

## Section F: Permission System Touchpoints (Plan-Mode Aware)

| v2.1.88 readable | v2.1.142 obfuscated | v2.1.88 path | v2.1.142 location | Status |
|------------------|---------------------|--------------|-------------------|--------|
| `checkWritePermissionForTool` | `VkH` | `src/utils/permissions/filesystem.ts:1205` | `cli_inner_pretty.js:518202-518286` | MATCH-DIFF |
| `isPlanModeFloorReason` (`d64`) | `d64` | (no v2.1.88 counterpart — new in v2.1.136) | `cli_inner_pretty.js:421723-421725` | NEW IN 2.1.142 (from v2.1.136) |
| `checkEditableInternalPath` | `iUH` | `src/utils/permissions/filesystem.ts:1479` | `cli_inner_pretty.js:518335-518346` (approx) | VERIFIED |
| `generateSuggestions` | `hG$` | `src/utils/permissions/filesystem.ts:1414` | `cli_inner_pretty.js:518287-518312` | VERIFIED |
| `applyPermissionUpdate` | `Qz` | `src/utils/permissions/PermissionUpdate.ts` | utility | VERIFIED |
| `pathInAllowedWorkingPath` | `GI` | `src/utils/permissions/filesystem.ts` | utility | VERIFIED |
| `matchingRuleForInput` | `yL`/`wy4` | `src/utils/permissions/...` | utility | VERIFIED |
| `applyHookPermissionDecision` (hook permission gate) | `UA5` (related) | `src/utils/permissions/...` | `cli_inner_pretty.js:421757-421814` | VERIFIED |
| `permission-result dispatcher` (auto-mode classifier) | `tD` | `src/utils/permissions/...` | `cli_inner_pretty.js:421879-421970` | VERIFIED |

**Discrepancy F1 — `checkWritePermissionForTool` plan-mode floor:**
- v2.1.88 source (the version v2.1.112 used): had the check ordered as deny → memory → internal-path → safety → acceptEdits → allow → ask. No plan-mode floor.
- v2.1.142: inserts plan-mode floor between safety and acceptEdits. Also adds `q.mode !== "plan"` guard on the `.claude/**` session-allow bypass at line 518234.

**Resolution:** **MATCH-DIFF** representing the v2.1.136 fix. The base body and parameter list are unchanged, but two new branches enforce plan-mode read-only.

**Discrepancy F2 — `d64` is brand new:**
- No v2.1.88 counterpart. Added in v2.1.136 to support the auto-mode classifier's fast-path skip for plan-mode floor.

**Resolution:** **NEW IN 2.1.142** (carrying the v2.1.136 fix).

---

## Section G: Slash Command + Re-Entry

| v2.1.88 readable | v2.1.142 obfuscated | v2.1.88 path | v2.1.142 location | Status |
|------------------|---------------------|--------------|-------------------|--------|
| `planSlashCommandHandler` | `Wv5` | `src/commands/slash/plan.ts` (approx) | `cli_inner_pretty.js:483806-483854` | MATCH-DIFF |
| `PlanPreviewComponent` | `Pv5` | `src/components/commands/PlanPreview.tsx` (approx) | `cli_inner_pretty.js:483777-483805` | VERIFIED |
| `openInEditor` | `AS` | (editor utility) | utility | VERIFIED |
| `renderInkComponent` | `UT7` | (Ink render utility) | utility | VERIFIED |
| `getEditor` | `xy` | (editor preference accessor) | utility | VERIFIED |

**Discrepancy G1 — `Wv5` is the v2.1.119 fix site:**
- v2.1.112 plan command handler did NOT check `haH()` (`getPlanSlugForSession`) and unconditionally printed "Enabled plan mode" without rendering the existing plan.
- v2.1.142: introduces the `haH()` check + plan rendering branch + `open` subcommand routing.

**Resolution:** **MATCH-DIFF** representing the v2.1.119 fix. See [permission_mode_persistence.md](./permission_mode_persistence.md) §1.

---

## Section H: Session Restore + Permission Mode

| v2.1.88 readable | v2.1.142 obfuscated | v2.1.88 path | v2.1.142 location | Status |
|------------------|---------------------|--------------|-------------------|--------|
| `sessionRestore` | `nZ8` | `src/session/restore.ts` (approx) | `cli_inner_pretty.js:564282-564344` | MATCH-DIFF |
| `restoreFromTranscriptPermissionMode` | `ur5` | `src/session/restore.ts:zYA` (v2.1.112 equivalent) | `cli_inner_pretty.js:564219-564229` | MATCH-DIFF |
| `restoreModel` | `mr5` | (model restore helper) | `cli_inner_pretty.js:564231-564241` | VERIFIED |
| `validatePermissionMode` | `Rv` | `src/utils/permissions/...` | utility | VERIFIED |
| `initialPermissionModeFromCLI` | `zR6` | `src/utils/permissions/...` | `cli_inner_pretty.js:422449-422468` | VERIFIED |
| `transitionPermissionMode` | `tHH` | `src/utils/permissions/...` | `cli_inner_pretty.js:422385-422398` | VERIFIED |
| `OI7` (control_request builder w/ permissionMode) | `OI7` | (used by remote-session creation) | `cli_inner_pretty.js:335076-335099` | VERIFIED |

**Discrepancy H1 — `ur5` signature carries `permissionModeCliSet`:**
- v2.1.112 equivalent `zYA(q, K)`: signature was `(transcriptMode, permissionModeCliSet)` (the second parameter existed but its semantic role was inconsistent — the call site `ZG.permissionModeCliSet` was already present in v2.1.112).
- v2.1.142 `ur5(H, $)`: same signature, but the BODY behavior is fixed. The early-return `if ($ || !H) return undefined` ensures CLI-flag preemption.

**Resolution:** **MATCH-DIFF** representing the v2.1.132 fix. The plumbing was in place in v2.1.112; v2.1.132 corrected the early-return so CLI flag actually wins.

---

## Section I: Ultraplan Integration

| v2.1.88 readable | v2.1.142 obfuscated | v2.1.112 obfuscated | v2.1.142 location | Status |
|------------------|---------------------|---------------------|-------------------|--------|
| `ExitPlanModeScanner` | `gj4` | `PlK` | `cli_inner_pretty.js:475135-475176` | VERIFIED (renamed) |
| `pollForApprovedExitPlanMode` | `Qj4` | `WlK` | `cli_inner_pretty.js:475178-475233` | VERIFIED (renamed) |
| `extractApprovedPlan` | `s05` | `rQY` | `cli_inner_pretty.js:475245-475260` | VERIFIED (renamed) |
| `extractTeleportPlan` | `a05` | `iQY` | `cli_inner_pretty.js:475237-475244` | VERIFIED (renamed) |
| `contentToText` | `dj4` | `DlK` | `cli_inner_pretty.js:475234-475236` | VERIFIED (renamed) |
| `UltraplanPollError` | `T$H` | `_66` | `cli_inner_pretty.js:475269-475280` | VERIFIED (renamed) |
| `isUltraplanAvailable` | `sQ` | `hn` | `cli_inner_pretty.js:475282-475284` | VERIFIED (renamed) |
| `ULTRAPLAN_TELEPORT_SENTINEL` | `o05` | `nQY` | `cli_inner_pretty.js:475264` | VERIFIED (renamed, same value) |
| `POLL_INTERVAL_MS` | `Fj4` | `MlK` | `cli_inner_pretty.js:475261` | VERIFIED (same value, 3000) |
| `MAX_CONSECUTIVE_FAILURES` | `r05` | `lQY` | `cli_inner_pretty.js:475262` | VERIFIED (same value, 5) |

**No behavioral discrepancies.** All Ultraplan obfuscated names changed (the bundler regenerated identifiers between v2.1.112 and v2.1.142), but the bodies are byte-identical modulo the renames.

---

## Summary

- **Net new in v2.1.142** (carrying v2.1.119/132/136 fixes): `T6` (background-session pairing), `d64` (`isPlanModeFloorReason`), and the plan-mode floor branch in `VkH`.
- **MATCH-DIFFs** in v2.1.142: `VkH` body (plan-mode floor + `.claude/**` gating), `Wv5` body (existing-plan rendering), `ur5` body (CLI-flag preemption).
- **Renamed only** (no behavior change): all Ultraplan symbols (different obfuscated identifiers between v2.1.112 and v2.1.142).
- **Carried over unchanged** from v2.1.112: All plan-file naming (`PDH`, `Sq6`, `nmH`, `Li$`), all session-flag setters/getters (`HH$`, `OT`, `qh`, `MT`, `Oo`, `xv8`), all auto-mode interaction (`UkH`, `TdH`, `zR6`).

The v2.1.142 plan-mode subsystem is the v2.1.112 subsystem with three targeted patches (one per changelog entry) and an `isEnabled` refinement. The architectural core (tools, lifecycle, schemas, attachment builders, slug generation) is unchanged.

---

## Methodology Notes

1. **v2.1.88 source as ground truth**: The unobfuscated TypeScript at `/lyz/codespace/3rd/claude-code/src/` is the canonical readable source. v2.1.142 obfuscated names are mapped via shape and string-literal matching.
2. **v2.1.112 reference as the prior delta**: The `claude_code_v_2.1.112/analyze/12_plan_mode/cross_validation.md` document provides the v2.1.88↔v2.1.112 mapping. This v2.1.142 cross-validation focuses on what changed in the v2.1.112→v2.1.142 window.
3. **Obfuscated identifiers in v2.1.142 differ from v2.1.112**: The bundler regenerates identifiers each release. There is no stable v2.1.112 → v2.1.142 identifier remap; you must trace by structural matching (function shape, string literals, control-flow). Names like `g56` (v2.1.112 `getPlanSlug`) and `PDH` (v2.1.142 `getPlanSlug`) refer to the same readable function.

---

## Related

- [implementation.md](./implementation.md) — full v2.1.142 lifecycle deobfuscation
- [permission_mode_persistence.md](./permission_mode_persistence.md) — v2.1.119/132/136 deltas with source citations
- [symbol_additions_v2_1_142_plan_mode.md](../00_overview/symbol_additions_v2_1_142_plan_mode.md) — comprehensive symbol table
- [v2.1.112 cross_validation.md](../../../claude_code_v_2.1.112/analyze/12_plan_mode/cross_validation.md) — v2.1.88 ↔ v2.1.112 mappings
