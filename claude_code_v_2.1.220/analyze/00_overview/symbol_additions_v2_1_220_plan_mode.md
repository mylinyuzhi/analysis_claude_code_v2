# Symbol additions — v2.1.220, theme `plan_mode`

Staged for merge. **Every group below belongs in `symbol_index_core_features.md`** (plan mode is a
core-feature theme per [`../_CONVENTIONS.md`](../_CONVENTIONS.md) §6). Merge each `## Module:` block
into the matching module section of that file, creating the section if absent, and keep rows
alphabetical by the Obfuscated column inside each section.

All `File:Line` values are `cli_inner_pretty.js` line numbers in the **2.1.220** bundle
(`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`) that were read during
this pass. Line numbers tagged `(193)` inside a description refer to the baseline bundle and are never
used as the File:Line value.

⚠ **Identifier-reuse warning for merge-time cross-checks.** Three of the symbols below exist in
2.1.193 with completely unrelated meanings. Do not reconcile against a 2.1.193 index by name:

- `cOt` — 2.1.220: `isReadOnlyBrowserCall`. 2.1.193: a CommonJS module wrapper, `:161316 (193)`.
- `BEy` — 2.1.220: `browserBatchNeedsPermission`. 2.1.193: a bundler alias, `:264361 (193)`.
- `OKt` — 2.1.220: `BROWSER_AUTO_ALLOW_TOOL_NAMES`. 2.1.193: `getRemoteControlPolicyVerdict`, `:603963 (193)`.

Source documents: [`../05_plan_mode/README.md`](../05_plan_mode/README.md),
[`../05_plan_mode/readonly_auto_allow_198_199.md`](../05_plan_mode/readonly_auto_allow_198_199.md),
[`../05_plan_mode/bash_bypass_and_classifier_212_218.md`](../05_plan_mode/bash_bypass_and_classifier_212_218.md).

---

## Module: Plan Mode — mode predicates and auto-mode activation

> Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$N` | `setAutoModeActive` (writes `vfe.active`) | cli_inner_pretty.js:325866 | function |
| `A9` | `isAutoModeActive` (reads `vfe.active`) | cli_inner_pretty.js:325869 | function |
| `Bcn` | `transitionPlanAutoMode` | cli_inner_pretty.js:529762 | function |
| `Dte` | `stripDangerousPermissionsForAutoMode` | cli_inner_pretty.js:529287 | function |
| `Kfn` | `activatePlanAutoMode` (**220-only extraction**; export literal `:529177`) | cli_inner_pretty.js:529742 | function |
| `Prp` | `decisionReasonIsPlanMode` (`{type:"mode", mode:"plan"}`) | cli_inner_pretty.js:513484 | function |
| `Qqs` | `isAutoOrPlanAutoMode` (classifier-block entry test) | cli_inner_pretty.js:513122 | function |
| `Vfn` | `verifyAutoModeGateAccess` (born-in-plan branch at `:529638`) | cli_inner_pretty.js:529614 | function |
| `YMi` | `resolveUseAutoModeDuringPlan` (4-layer settings, carryover 11/11) | cli_inner_pretty.js:63540 | function |
| `bdr` | `prepareContextForPlanMode` (transition path; calls `Kfn` at `:529754`) | cli_inner_pretty.js:529746 | function |
| `gRe` | `restoreDangerousPermissions` | cli_inner_pretty.js:529301 | function |
| `gnn` | `isAutoModePermissionSurface` (`auto` OR `plan`+auto; **220=1/193=0**) | cli_inner_pretty.js:325872 | function |
| `tcr` | `isPlanMode` (`ctx.mode === "plan"`; **220=5/193=0**) | cli_inner_pretty.js:289037 | function |
| `vfe` | `autoModeState` (module-global; declared `:325908`, initialised `:325910` from `Yid()` `:325856`) | cli_inner_pretty.js:325908 | variable |
| `xUo` | `shouldPlanUseAutoMode` (`gk() && YMi()`) | cli_inner_pretty.js:529739 | function |

---

## Module: Plan Mode — browser read-only classification

> Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Es` | `getClaudeInChromePermissionOverrides` (read-only allow `:289356`, plan passthrough `:289440`) | cli_inner_pretty.js:289344 | function |
| `B1_` | `STRICT_READ_ONLY_BROWSER_TOOL_NAMES` (`vrp` × 4 prefixes) | cli_inner_pretty.js:513038 | constant |
| `BEy` | `browserBatchNeedsPermission` (`some()`, fails closed) | cli_inner_pretty.js:289288 | function |
| `COl` | `BROWSER_SELECTION_TOOL_NAMES` (carryover of `TJo` `:12547 (193)`) | cli_inner_pretty.js:34686 | constant |
| `DEs` | `tabsContextIsReadOnly` (`!input.createIfEmpty`) | cli_inner_pretty.js:288988 | function |
| `FEy` | `firstPromptWorthyBatchAction` | cli_inner_pretty.js:289271 | function |
| `M1_` | `LENIENT_READ_ONLY_BROWSER_TOOL_NAMES` (`yrp` × 4 prefixes + preview tab verbs) | cli_inner_pretty.js:513008 | constant |
| `M_r` | `BROWSER_TOOL_NAME_PREFIXES` (4 spellings) | cli_inner_pretty.js:512997 | constant |
| `O1_` | `LENIENT_READ_ONLY_COMPUTER_ACTIONS` (18 actions) | cli_inner_pretty.js:513018 | constant |
| `OKt` | `BROWSER_AUTO_ALLOW_TOOL_NAMES` (9 names; **carryover** of `Kvt` `:12536 (193)`) | cli_inner_pretty.js:34675 | constant |
| `U1_` | `STRICT_READ_ONLY_COMPUTER_ACTIONS` (5 actions) | cli_inner_pretty.js:513039 | constant |
| `UEy` | `buildChromePermissionPromptTitle` | cli_inner_pretty.js:289295 | function |
| `Vqs` | `isLenientReadOnlyComputerAction` (`O1_` ∧ `!save_to_disk`) | cli_inner_pretty.js:512876 | function |
| `X9u` | `COMPUTER_ACTION_DESCRIPTIONS` (18 phrases) | cli_inner_pretty.js:289107 | object |
| `Arp` | `isStrictReadOnlyComputerAction` (`U1_` ∧ `Vqs`) | cli_inner_pretty.js:512905 | function |
| `_rp` | `ARGUMENT_DEPENDENT_BROWSER_TOOLS_QUALIFIED` (`len` × 4 prefixes) | cli_inner_pretty.js:513012 | constant |
| `brp` | `QUALIFIED_COMPUTER_TOOL_NAMES` | cli_inner_pretty.js:513016 | constant |
| `cOt` | `isReadOnlyBrowserCall` | cli_inner_pretty.js:288994 | function |
| `len` | `ARGUMENT_DEPENDENT_BROWSER_TOOLS` (3 names → predicate) | cli_inner_pretty.js:289002 | constant |
| `n2o` | `isStrictlyReadOnlyBrowserTool` (plan-mode floor exemption) | cli_inner_pretty.js:512911 | function |
| `r2o` | `isBrowserToolName` (prefix test over `M_r`) | cli_inner_pretty.js:512870 | function |
| `t2o` | `PREVIEW_BROWSER_PREFIXES` (**220=2/193=0**) | cli_inner_pretty.js:512996 | constant |
| `uOt` | `isPlainObject` | cli_inner_pretty.js:289053 | function |
| `uen` | `describeBrowserAction` | cli_inner_pretty.js:289069 | function |
| `vEy` | `UNCONDITIONALLY_READ_ONLY_BROWSER_TOOLS` (5 names) | cli_inner_pretty.js:289007 | constant |
| `wEy` | `BROWSER_TOOL_DESCRIPTIONS` (14 phrases; each **220=1/193=0**) | cli_inner_pretty.js:289091 | object |
| `xEy` | `describeBrowserBatchActions` (skips read-only sub-actions) | cli_inner_pretty.js:289056 | function |
| `z9u` | `bufferReadIsReadOnly` (`!input.clear`) | cli_inner_pretty.js:288991 | function |
| `zqs` | `isAutoModeAllowlistedTool` (lenient predicate; `rWf` `:597321 (193)`) | cli_inner_pretty.js:512892 | function |

---

## Module: Plan Mode — permission-pipeline guards

> Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Dqy` | `isAcceptEditsAutoAllowedCommand` | cli_inner_pretty.js:393483 | function |
| `Erp` | `matchBatchSubActionPredicate` | cli_inner_pretty.js:512884 | function |
| `H4` | `isSandboxableBashInput` | cli_inner_pretty.js:512818 | function |
| `Lqy` | `ACCEPT_EDITS_FILE_COMMANDS` (`mkdir touch rm rmdir mv cp sed`) | cli_inner_pretty.js:393515 | constant |
| `P1_` | `AUTO_MODE_SAFE_TOOLS` (~23 built-ins; no Bash) | cli_inner_pretty.js:512965 | constant |
| `Pqy` | `bashAcceptEditsModeAllow` | cli_inner_pretty.js:393486 | function |
| `Wqy` | `sandboxedBashAutoAllowPrefix` (plan guard `:393924`) | cli_inner_pretty.js:393923 | function |
| `Y1_` | `modeStillEligibleForAutoDecision` (post-queue revalidation) | cli_inner_pretty.js:513125 | function |
| `bft` | `checkRuleBasedPermissions` (plan guard `:513525`) | cli_inner_pretty.js:513506 | function |
| `cM` | `hasPermissionsToUseTool` | cli_inner_pretty.js:513703 | variable |
| `cvd` | `sandboxedBashAutoAllowAst` (plan guard `:393890`) | cli_inner_pretty.js:393889 | function |
| `o$_` | `checkToolPermissions` (plan floor `:513586-513594`; guard `:513574`) | cli_inner_pretty.js:513554 | function |
| `oNt` | `hasPermissionsToUseToolWithSink` | cli_inner_pretty.js:513707 | variable |
| `ovd` | `bashModeSpecificCheck` | cli_inner_pretty.js:393494 | function |
| `pvd` | `relaxCircuitBreakerAskForBash` (`gnn`-gated) | cli_inner_pretty.js:394411 | function |
| `q1_` | `FAST_PATH_EXEMPT_TOOLS` | cli_inner_pretty.js:513041 | constant |
| `sG` | `findSafetyCheckReason` | cli_inner_pretty.js:513689 | function |
| `t$_` | `autoModeAdjudication` (holds `$` `:513776`, `H` `:513751`, `A` `:513745`) | cli_inner_pretty.js:513711 | variable |
| `wrp` | `isFastPathExemptTool` | cli_inner_pretty.js:512923 | function |

---

## Module: Plan Mode — approval dialog and exit

> Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Kze` | `scheduleFileSnapshot` (plan + workshop doc) | cli_inner_pretty.js:527927 | function |
| `Lnl` | `logPlanReviewStep` (`tengu_plan_review_step`, **220=1/193=0**) | cli_inner_pretty.js:761410 | function |
| `Mnl` | `markPublishedPlanStale` | cli_inner_pretty.js:761667 | function |
| `S6` | `ExitPlanModeV2Tool` | cli_inner_pretty.js:325968 | object |
| `VB` | `getPlanFilePath` | cli_inner_pretty.js:527750 | function |
| `YYf` | `nameSessionFromPlan` (first 1,000 chars → session name) | cli_inner_pretty.js:761072 | function |
| `Zui` | `onPlanReviewChoice` (`proceed` / `review-artifact` / `skip`) | cli_inner_pretty.js:761422 | function |
| `e7f` | `buildPlanApprovalAnswer` (consolidated; `Tar` `:640586 (193)` had 4 call sites) | cli_inner_pretty.js:761160 | function |
| `gpt` | `ensurePlansDirectory` | cli_inner_pretty.js:527741 | function |
| `gqt` | `setPlanPublishStatus` | cli_inner_pretty.js:761257 | function |
| `hN` | `EXIT_PLAN_MODE_TOOL_NAME` (`"ExitPlanMode"`) | cli_inner_pretty.js:162389 | constant |
| `v4` | `readPlanFile` | cli_inner_pretty.js:527779 | function |
| `znl` | `PlanApprovalDialog` | cli_inner_pretty.js:761198 | function |

> Deliberately **not** staged: `Cid` (`:326066`) and `hnn` (`:326152`) were observed in the
> `ExitPlanMode` call path but not traced far enough to name confidently.

---

## Telemetry gates and settings keys touched by this theme

Not symbol-index rows; recorded here so the merge does not lose them.

| Name | Kind | File:Line | 220 / 193 |
|---|---|---|---|
| `tengu_plan_exit_dialog_shown` | telemetry event | cli_inner_pretty.js:761290 | 1 / **0** |
| `tengu_plan_review_step` | telemetry event | cli_inner_pretty.js:761415 | 1 / **0** |
| `tengu_auto_mode_classifier_queue` | feature gate | cli_inner_pretty.js:442629 | 1 / **0** |
| `mode_changed_while_queued` | `tengu_auto_mode_fallback_to_ask` reason | cli_inner_pretty.js:513878 | 1 / **0** |
| `plan_mode_floor` | `tengu_auto_mode_fallback_to_ask` reason | cli_inner_pretty.js:513757 | 1 / **1** (carryover) |
| `Cannot call ${name} while in plan mode.` | user-facing string | cli_inner_pretty.js:513592 | 1 / **0** |
| `useAutoModeDuringPlan` | settings key | cli_inner_pretty.js:60121 (zod), :63540 (resolver), :451661 (`/config` row) | 11 / **11** (carryover) |
| `review-artifact` | plan-review choice value | cli_inner_pretty.js:761426 | 3 / **0** |
