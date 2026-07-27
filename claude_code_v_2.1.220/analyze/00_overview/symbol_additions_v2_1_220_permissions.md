# Symbol additions — v2.1.220, theme `permissions`

Staged for merge. **Every group below belongs in `symbol_index_infra_platform.md`** (permissions is a
platform-infrastructure theme per [`../_CONVENTIONS.md`](../_CONVENTIONS.md) §6). Merge each
`## Module:` block into the matching module section of that file, creating the section if absent, and keep
rows alphabetical by the Obfuscated column inside each section.

All `File:Line` values are `cli_inner_pretty.js` line numbers in the **2.1.220** bundle
(`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`) that were read during
this pass. Rows tagged `(193)` in a description refer to the baseline bundle and are never used as the
File:Line value.

Source documents: [`../38_permissions/README.md`](../38_permissions/README.md) and its four siblings.

---

## Module: Permissions — Bash static analyzer

> Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$E` | `splitCommandSubstitutions` | cli_inner_pretty.js:512259 | function |
| `$ss` | `analyzeRedirectTarget` | cli_inner_pretty.js:210615 | function |
| `AIe` | `MAX_ANALYZABLE_COMMAND_CHARS` (`1e4`) | cli_inner_pretty.js:512643 | constant |
| `Dss` | `REDIRECT_OPERATORS` | cli_inner_pretty.js:212433 | object |
| `Evd` | `checkDangerousRemovalsInCommand` | cli_inner_pretty.js:394257 | function |
| `Fsn` | `hasTokenizerDivergence` (6 regexes) | cli_inner_pretty.js:512253 | function |
| `I0u` | `TEST_CONTAINER_NODE_TYPES` | cli_inner_pretty.js:212458 | constant |
| `L0u` | `walkTestCommandOperand` | cli_inner_pretty.js:210357 | function |
| `Lf` | `hasCommandSubstitutionSentinel` | cli_inner_pretty.js:209614 | function |
| `M0u` | `walkRedirectsInTree` | cli_inner_pretty.js:210603 | function |
| `P0u` | `auditRedirectNodeStructure` | cli_inner_pretty.js:210540 | function |
| `R0u` | `auditTestCommandByteCoverage` | cli_inner_pretty.js:210323 | function |
| `Rie` | `walkCommandNode` | cli_inner_pretty.js:209829 | function |
| `SMs` | `findUnresolvableVariableRemoval` | cli_inner_pretty.js:390781 | function |
| `Wsn` | `checkBackgroundOperator` | cli_inner_pretty.js:394424 | function |
| `_0u` | `isIgnorableGapBytes` | cli_inner_pretty.js:210282 | function |
| `_Ke` | `makeDangerousRemovalAsk` | cli_inner_pretty.js:390676 | function |
| `_Ms` | `checkSedCommand` | cli_inner_pretty.js:390642 | function |
| `aVe` | `parseShellCommandAsync` | cli_inner_pretty.js:209760 | function |
| `cuo` | `hasDockerDaemonRedirectFlag` | cli_inner_pretty.js:212834 | function |
| `emr` | `analyzeRemovalTargets` | cli_inner_pretty.js:390689 | function |
| `gYr` | `hasDangerousPathPrefix` | cli_inner_pretty.js:214148 | function |
| `hYr` | `DAEMON_REDIRECT_FLAGS` (15 entries; 8 in 193 as `oYi`) | cli_inner_pretty.js:213928 | constant |
| `nmr` | `hasCatastrophicRemovalPattern` | cli_inner_pretty.js:394710 | function |
| `ozg` | `DAEMON_REDIRECT_SHORT_CHARS` | cli_inner_pretty.js:213945 | constant |
| `pvd` | `attachAskRuleForCircuitBreaker` | cli_inner_pretty.js:394411 | function |
| `tmr` | `ARGV_TO_TARGETS` | cli_inner_pretty.js:391281 | object |
| `tvd` | `classifyReadOnlyCommand` | cli_inner_pretty.js:392117 | function |
| `vvd` | `hasBackgroundOperatorNode` | cli_inner_pretty.js:394399 | function |
| `yqy` | `isReadOnlyArgv` | cli_inner_pretty.js:391713 | function |

---

## Module: Permissions — read-only command tables

> Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Y0u` | `READ_ONLY_COMMAND_TABLE` (`rg`, `sort`, `man`, `help`, `file`, `netstat`, `ps`, …) | cli_inner_pretty.js:213966 | object |
| `cqy` | `READ_ONLY_EXACT_COMMANDS` | cli_inner_pretty.js:393272 | constant |
| `fqy` | `READ_ONLY_NULLARY_COMMANDS` (`pwd`, `whoami`, `alias`) | cli_inner_pretty.js:393287 | constant |
| `gqy` | `READ_ONLY_ARGV_SEQUENCES` | cli_inner_pretty.js:393290 | constant |
| `uqy` | `READ_ONLY_SUBCOMMAND_PREFIXES` | cli_inner_pretty.js:393273 | constant |
| `uuo` | `DOCKER_READ_ONLY_SUBCOMMANDS` (`docker logs`, `docker inspect`) | cli_inner_pretty.js:213946 | object |

---

## Module: Permissions — rule matching and glob semantics

> Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$fe` | `collectPathRules` | cli_inner_pretty.js:513346 | function |
| `B0` | `findMatchingPathRule` | cli_inner_pretty.js:528512 | function |
| `Bfe` | `getAskRules` | cli_inner_pretty.js:513240 | function |
| `Cze` | `evaluateHookIfCondition` | cli_inner_pretty.js:528537 | function |
| `E2_` | `IGNORE_REUSE_BUDGET` (`1e4` tests before rebuild) | cli_inner_pretty.js:528889 | constant |
| `Gfn` | `resolvePatternRoot` | cli_inner_pretty.js:528453 | function |
| `N_r` | `flattenRules` | cli_inner_pretty.js:513228 | function |
| `WB` | `findMatchingDenyRule` (accepts a precomputed array) | cli_inner_pretty.js:513293 | function |
| `b2_` | `patternRootBase` | cli_inner_pretty.js:528366 | function |
| `gap` | `sanitizePattern` (slash collapse + BOM/sigil escape) | cli_inner_pretty.js:528448 | function |
| `hap` | `splitPatternRoot` | cli_inner_pretty.js:528426 | function |
| `mM` | `getDenyRules` | cli_inner_pretty.js:513237 | function |
| `nve` | `filterDeniedTools` (hoists `mM(t)` out of the filter) | cli_inner_pretty.js:425004 | function |
| `r9s` | `MATCHER_CACHE` (`WeakMap<rulesArray, Map<key, byRoot>>`) | cli_inner_pretty.js:529043 | variable |
| `s9s` | `buildPathRuleMatchers` (LRU 16, deny/ask only) | cli_inner_pretty.js:528463 | function |
| `sG` | `findSafetyCheckReason` | cli_inner_pretty.js:513689 | function |
| `v2t` | `posixRelative` | cli_inner_pretty.js:528077 | function |
| `yap` | `normalizeDirGlobForIgnoreEngine` | cli_inner_pretty.js:528456 | function |

---

## Module: Permissions — settings scopes and rule storage

> Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ekh` | `makeCanonicalGitRootLookup` | cli_inner_pretty.js:55537 | function |
| `UQ` | `settingsScopeRelativePath` | cli_inner_pretty.js:62361 | function |
| `WQg` | `UNCOMPILABLE_PATTERN_SITES` (4 pre-redacted site names) | cli_inner_pretty.js:224133 | object |
| `YWe` | `resolveLocalSettingsDirectory` | cli_inner_pretty.js:62295 | function |
| `_Ih` | `realHomeDir` (memoised; throws if unavailable) | cli_inner_pretty.js:62657 | function |
| `gIh` | `statRepoRootOwnership` | cli_inner_pretty.js:62647 | function |
| `gu` | `canonicalGitRootLookup` | cli_inner_pretty.js:56190 | variable |
| `hRu` | `probeIgnorePatternCompileError` | cli_inner_pretty.js:224126 | function |
| `qQg` | `reportUncompilablePattern` (memoised by `site\0pattern`) | cli_inner_pretty.js:224139 | function |
| `rZg` | `copyLocalSettingsIntoWorktree` | cli_inner_pretty.js:224974 | function |
| `w7t` | `legacyLocalSettingsPath` | cli_inner_pretty.js:62369 | function |
| `y3r` | `settingsScopeDirectory` | cli_inner_pretty.js:62282 | function |
| `yIh` | `isRootOwnedByCurrentUser` (POSIX-only) | cli_inner_pretty.js:62311 | function |

---

## Module: Permissions — auto mode availability

> Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Cae` | `getAutoModeUnavailableReason` | cli_inner_pretty.js:529701 | function |
| `CCe` | `getAutoModeConfig` (+ untrusted-source detector) | cli_inner_pretty.js:63551 | function |
| `Eer` | `isAutoModeAvailableOnProvider` (tautology in 220; read the env var in 193 as `ont`) | cli_inner_pretty.js:150416 | function |
| `H3r` | `AUTO_MODE_TRUSTED_SOURCES` (`userSettings`, `flagSettings`, `policySettings`) | cli_inner_pretty.js:63681 | constant |
| `KMi` | `isAutoModeOptInAccepted` (vestigial `return !0`) | cli_inner_pretty.js:63537 | function |
| `R2_` | `DEFAULT_AUTO_MODE_ENABLED_STATE` (`"enabled"`) | cli_inner_pretty.js:529775 | constant |
| `Sap` | `NO_CACHED_AUTO_MODE_CONFIG` (Symbol sentinel) | cli_inner_pretty.js:529821 | constant |
| `Vfn` | `verifyAutoModeGateAccess` | cli_inner_pretty.js:529614 | function |
| `XMi` | `isClassifyAllShellEnabled` | cli_inner_pretty.js:63591 | function |
| `YMi` | `isAutoModeAllowedDuringPlan` | cli_inner_pretty.js:63540 | function |
| `_9s` | `getCachedAutoModeEnabledState` | cli_inner_pretty.js:529720 | function |
| `cWi` | `getMeadowLanternClientData` | cli_inner_pretty.js:536977 | function |
| `fcp` | `getClientDataCacheSlot` | cli_inner_pretty.js:536969 | function |
| `gk` | `isAutoModeEnterable` | cli_inner_pretty.js:529695 | function |
| `gro` | `isThirdPartyProviderWithAutoMode` | cli_inner_pretty.js:150420 | function |
| `h9s` | `coerceAutoModeEnabledState` | cli_inner_pretty.js:529708 | function |
| `iW` | `isAnthropicManagedCloudProvider` (`anthropicAws` \| `anthropicGoogleCloud`) | cli_inner_pretty.js:100346 | function |
| `m9s` | `isAutoModeDisabledBySettings` | cli_inner_pretty.js:529691 | function |
| `oqe` | `modelSupportsAutoMode` | cli_inner_pretty.js:150427 | function |
| `ume` | `formatAutoModeUnavailableReason` (4 reasons; `provider` unreachable) | cli_inner_pretty.js:529596 | function |
| `y9s` | `getAutoModeEnabledStateWithSource` | cli_inner_pretty.js:529715 | function |
| `ynt` | `projectSettingsPathEqualsUserSettingsPath` | cli_inner_pretty.js:63137 | function |
| `zfn` | `stripBypassPermissionsAvailability` | cli_inner_pretty.js:529725 | function |

---

## Module: Permissions — auto mode onboarding and setup wizard

> Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `B4f` | `shouldRenderAutoModeEnvOnboarding` | cli_inner_pretty.js:736579 | function |
| `B7r` | `reportRepoVisibilityLookupFailure` | cli_inner_pretty.js:229626 | function |
| `F4f` | `ONBOARDING_INPUT_DEBOUNCE_MS` (`500`) | cli_inner_pretty.js:736681 | constant |
| `GIb` | `WIZARD_STEP_DEBOUNCE_MS` (`250`) | cli_inner_pretty.js:660172 | constant |
| `GxS` | `MIN_STARTUPS_BEFORE_ONBOARDING` (`5`) | cli_inner_pretty.js:736680 | constant |
| `Ipo` | `isRepoVisibilityLookupEnabled` | cli_inner_pretty.js:229601 | function |
| `KxS` | `markAutoModeEnvSetupDismissed` | cli_inner_pretty.js:736561 | function |
| `Lpo` | `lookupRepoVisibilityCached` | cli_inner_pretty.js:229618 | function |
| `Tey` | `fetchRepoVisibilityFromGitHub` | cli_inner_pretty.js:229629 | function |
| `VxS` | `clearAutoModeEnvSetupRecord` | cli_inner_pretty.js:736555 | function |
| `WxS` | `alreadyOptedIntoAuto` | cli_inner_pretty.js:736575 | function |
| `aXa` | `shouldShowAutoModeEnvOnboarding` | cli_inner_pretty.js:736564 | function |
| `gAn` | `buildAutoModeConfigFromWizard` | cli_inner_pretty.js:659852 | function |
| `hus` | `resolveUnknownRepoVisibility` | cli_inner_pretty.js:229609 | function |
| `jxS` | `ONBOARDING_SNOOZE_MS` (`604800000` = 7 days) | cli_inner_pretty.js:736679 | constant |
| `lXa` | `AutoModeEnvOnboardingPrompt` | cli_inner_pretty.js:736591 | function |
| `mDo` | `isAutoModeSetupSkillEnabled` | cli_inner_pretty.js:444855 | function |
| `qIb` | `AUTO_MODE_WIZARD_STEPS` (`posture`, `scope`, `depth`) | cli_inner_pretty.js:660223 | constant |
| `qJp` | `AUTO_MODE_WIZARD_DEPTH_QUESTION` | cli_inner_pretty.js:660213 | object |
| `qxS` | `markAutoModeEnvOnboardingShown` | cli_inner_pretty.js:736552 | function |
| `sPy` | `AUTO_MODE_SETUP_SKILL_IDS` (`new Set(["auto-mode-setup"])`) | cli_inner_pretty.js:326372 | constant |
| `zxS` | `snoozeAutoModeEnvSetup` | cli_inner_pretty.js:736558 | function |

---

## Module: Permissions — `claude auto-mode` CLI

> Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Om` | `dedupeAutoModeSectionLabels` | cli_inner_pretty.js:865420 | function |
| `LOm` | `warnOtherAutoModeScopesRemain` | cli_inner_pretty.js:865434 | function |
| `OOm` | `describeAutoModeSections` | cli_inner_pretty.js:865414 | function |
| `ROm` | `stripAutoModeAnsi` | cli_inner_pretty.js:865425 | function |
| `_vl` | `isPlainObject` | cli_inner_pretty.js:865431 | function |
| `yvl` | `pluralizeCount` | cli_inner_pretty.js:865428 | function |

---

## Module: Permissions — classifier adjudication

> Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$i_` | `runClassifierRequestWithStall` | cli_inner_pretty.js:444339 | function |
| `Bi_` | `latchClassifierBetaDrop` (unreachable: `zJt` is null) | cli_inner_pretty.js:444413 | function |
| `DOd` | `callClassifierWithRetries` | cli_inner_pretty.js:444429 | function |
| `Fi_` | `retryOptionsWithoutClassifierBeta` (always returns null in 220) | cli_inner_pretty.js:444409 | function |
| `HBs` | `sendClassifierRequest` | cli_inner_pretty.js:444401 | function |
| `J1_` | `isLocalDisplayOnlyClassifier` (vestigial `return !1`) | cli_inner_pretty.js:513162 | function |
| `LBs` | `classifyClassifierParseFailure` | cli_inner_pretty.js:444456 | function |
| `OOd` | `formatClassifierFailureReason` | cli_inner_pretty.js:444676 | function |
| `Pi_` | `parseSeverityFromText` | cli_inner_pretty.js:443977 | function |
| `Qqs` | `isClassifierAdjudicatingMode` | cli_inner_pretty.js:513122 | function |
| `RBs` | `parseBlockVerdict` | cli_inner_pretty.js:443965 | function |
| `ROd` | `classifierExtraBetas` | cli_inner_pretty.js:444392 | function |
| `SBs` | `serializeClassifierMetaLine` | cli_inner_pretty.js:442610 | function |
| `Sji` | `AUTO_MODE_CLASSIFIER_BETA` (`auto-mode-classifier-2026-07-16`) | cli_inner_pretty.js:109221 | constant |
| `To_` | `classifierSerializerByKey` | cli_inner_pretty.js:442669 | variable |
| `Xqs` | `denyBecausePromptsUnavailable` | cli_inner_pretty.js:513421 | function |
| `eDo` | `isClassifierQueueEnabled` | cli_inner_pretty.js:442623 | function |
| `gnn` | `isClassifierAdjudicating` | cli_inner_pretty.js:325872 | function |
| `kBs` | `parseSeverityVerdict` | cli_inner_pretty.js:443973 | function |
| `nOd` | `resolveClassifierQueueSetting` | cli_inner_pretty.js:442626 | function |
| `oOd` | `runClassifierQueued` | cli_inner_pretty.js:442631 | function |
| `pcn` | `classifierPendingByKey` | cli_inner_pretty.js:442669 | variable |
| `qi_` | `classifyClassifierErrorKind` | cli_inner_pretty.js:444707 | function |
| `tfn` | `preferCircuitBreakerReason` | cli_inner_pretty.js:513274 | function |
| `uFt` | `reportClassifierOutcome` | cli_inner_pretty.js:444679 | function |
| `zJt` | `UNASSIGNED_BETA_SLOT` (declared `null`, never assigned) | cli_inner_pretty.js:109181 | variable |

---

## Module: Permissions — classifier rule taxonomy

> Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `HNy` | `EXTRA_RULE_IDS` (empty array) | cli_inner_pretty.js:345235 | constant |
| `Xon` | `canonicalizeClassifierCategory` | cli_inner_pretty.js:345238 | function |
| `kNy` | `CLASSIFIER_RULE_IDS` (66 ids) | cli_inner_pretty.js:345167 | constant |
| `l0o` | `KNOWN_RULE_IDS` (`Set([...kNy, ...HNy])`) | cli_inner_pretty.js:345236 | constant |
| `xNy` | `USER_RULE_REPLACEMENT_MARKERS` (4 `*_to_replace` sentinels) | cli_inner_pretty.js:345161 | constant |

---

## Module: Permissions — classifier git-status context

> Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Co_` | `isGitStatusContextEnabled` | cli_inner_pretty.js:442672 | function |
| `Do_` | `summarizeGitStatusPorcelain` | cli_inner_pretty.js:442703 | function |
| `Ho_` | `getGitStatusTruncationLimit` | cli_inner_pretty.js:442690 | function |
| `Lo_` | `matchDangerPatternTruncated` (`1e4` truncate-then-match) | cli_inner_pretty.js:442699 | function |
| `cOd` | `resolveGitStatusUploads` | cli_inner_pretty.js:442684 | function |
| `lOd` | `resolveGitStatusType` | cli_inner_pretty.js:442675 | function |
| `uOd` | `resolveGitStatusLimit` | cli_inner_pretty.js:442693 | function |
| `xo_` | `areGitStatusUploadsEnabled` | cli_inner_pretty.js:442681 | function |

---

## Module: Permissions — modes and UI descriptors

> Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `BK` | `resolvePermissionMode` | cli_inner_pretty.js:58326 | function |
| `Sht` | `isSuspiciousWindowsPath` | cli_inner_pretty.js:528296 | function |
| `X4r` | `PAUSE_GLYPH` (`"⏸"`) | cli_inner_pretty.js:58419 | constant |
| `dWl` | `PERMISSION_MODE_DESCRIPTORS` (`default` → `title: "Manual"`) | cli_inner_pretty.js:58495 | object |
| `fL` | `normalizeManualModeAlias` | cli_inner_pretty.js:58323 | function |
| `pWl` | `permissionModeSchema` (`preprocess(fL, enum)`) | cli_inner_pretty.js:58492 | variable |
| `r3r` | `externalPermissionModeSchema` | cli_inner_pretty.js:58493 | variable |
| `uWl` | `PERMISSION_MODE_RANK` | cli_inner_pretty.js:58494 | constant |
| `ylt` | `checkWritePathSafety` | cli_inner_pretty.js:528312 | function |

---

## Module: Permissions — hooks bridge

> Merge into: `symbol_index_infra_platform.md`

The `hookAskFloor` flag has no dedicated symbol; it is a property threaded through the permission context.
The two functions that create and consume it:

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bft` | `evaluateRulesAndSafetyChecks` (called after a hook decision at `:400910`) | cli_inner_pretty.js:513506 | function |
| `gan` | `applyHookDecisionToPermissionPipeline` (sets `hookAskFloor` at `:400917`) | cli_inner_pretty.js:400894 | function |
| `t$_` | `resolvePermissionAfterAsk` (reads `hookAskFloor` at `:513734`) | cli_inner_pretty.js:513711 | function |

---

## Module: Permissions — remote-control nudge (NOT an ordering fix)

> Merge into: `symbol_index_infra_platform.md`

Recorded so nobody re-uses `tengu_rc_permission_nudge` as the anchor for `.214`'s prompt-ordering bullet.
It is a growth upsell keyed off the permission-prompt count.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Pni` | `RC_PERMISSION_NUDGE_DEFAULTS` (`{afterPromptCount:5, probability:0, maxImpressions:3}` — probability 0, so off by default) | cli_inner_pretty.js:720628 | constant |
| `f5a` | `resolveRemoteControlPermissionNudgeConfig` | cli_inner_pretty.js:720478 | function |

---

## Module: Permissions — PowerShell command prologue (NOT a permission check)

> Merge into: `symbol_index_infra_platform.md`

Recorded so nobody re-uses `:169565` as the anchor for `.214`'s PowerShell 5.1 permission bullet. It is
the encoding fix from `.214` #22/#23/#25.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `M$g` | `commandMustStartWithDeclaration` | cli_inner_pretty.js:169486 | function |
| `O$g` | `POWERSHELL_ENV_OVERRIDES` (`PYTHONIOENCODING`, `NO_COLOR`) | cli_inner_pretty.js:169575 | object |
| `P$g` | `POWERSHELL_UTF8_PROLOGUE` | cli_inner_pretty.js:169565 | constant |

---

## Telemetry events and gates discovered (for `symbol_index_infra_platform.md`'s telemetry section)

| Event / gate | File:Line | 220 / 193 |
|---|---|---|
| `tengu_auto_mode_beta_latch` | cli_inner_pretty.js:444423 | 1 / 0 — **unreachable**, see `classifier_adjudication.md` §6 |
| `tengu_auto_mode_classifier_queue` | cli_inner_pretty.js:442629 | 1 / 0 |
| `tengu_auto_mode_env_onboarding_accept` | cli_inner_pretty.js:736613 | 2 / 0 |
| `tengu_auto_mode_env_onboarding_dismiss` | cli_inner_pretty.js:736622 | 2 / 0 |
| `tengu_auto_mode_env_onboarding_later` | cli_inner_pretty.js:736618 | 2 / 0 |
| `tengu_auto_mode_env_onboarding_shown` | cli_inner_pretty.js:736553 | 2 / 0 |
| `tengu_auto_mode_repo_visibility_lookup_failed` | cli_inner_pretty.js:229627 | 1 / 0 |
| `tengu_auto_mode_setup_wizard_answers` | cli_inner_pretty.js:660036 | 2 / 0 |
| `tengu_auto_mode_setup_wizard_resolved` | cli_inner_pretty.js:659937 | 2 / 0 |
| `tengu_auto_mode_setup_wizard_shown` | cli_inner_pretty.js:659921 | 1 / 0 |
| `tengu_settings_auto_mode_rules_untrusted_source_ignored` | cli_inner_pretty.js:63563 | 1 / 0 |
| `tengu_uncompilable_ignore_pattern` | cli_inner_pretty.js:224144 | 1 / 0 |
| `tengu_bash_dangerous_rm_too_complex` | cli_inner_pretty.js:394285 | 2 / 1 |
| `tengu_auto_mode_fallback_to_ask` | cli_inner_pretty.js:513756 | 6 / 5 — reasons: `safety_check`, `ask_rule`, `plan_mode_floor`, `org_ask_ceiling`, `requires_user_interaction` (:513765), `workflow_usage_consent` (:513770), `mode_changed_while_queued` (:513878, **1 / 0**), `transcript_too_long` (:513968) |
| `tengu_destructive_command_warning` | cli_inner_pretty.js:768343, :770318 | **2 / 2 — CARRYOVER**, default `!1` |
| `tengu_settings_auto_mode_untrusted_source_ignored` | cli_inner_pretty.js:118959 | **1 / 1 — CARRYOVER** (the `defaultMode` filter, not the rules filter) |
| `tengu_rc_permission_nudge` | cli_inner_pretty.js:720487 | 2 / 0 — upsell gate, NOT an ordering fix |
| `gated_grants_backstop_declined` (health reason) | cli_inner_pretty.js:831181 | 1 / 0 — the only trust-dialog delta found |

### Removed in 2.1.220 (present in 2.1.193) — the opt-in dialog family

Record these as deletions; they are the strongest evidence for `.207`.

| Event | 220 | 193 |
|---|---|---|
| `tengu_auto_mode_opt_in_dialog_shown` | **0** | 2 |
| `tengu_auto_mode_opt_in_dialog_accept` | **0** | 2 |
| `tengu_auto_mode_opt_in_dialog_accept_default` | **0** | 2 |
| `tengu_auto_mode_opt_in_dialog_decline` | **0** | 3 |
| `tengu_auto_mode_opt_in_dialog_decline_dont_ask` | **0** | 2 |

---

## Env vars discovered

| Env var | File:Line | 220 / 193 |
|---|---|---|
| `CLAUDE_CODE_AUTO_MODE_CLASSIFIER_QUEUE` | cli_inner_pretty.js:442627 | 1 / 0 |
| `CLAUDE_CODE_AUTO_MODE_GIT_STATUS` | cli_inner_pretty.js:442676 | 1 / 0 |
| `CLAUDE_CODE_AUTO_MODE_GIT_STATUS_LIMIT` | cli_inner_pretty.js:442694 | 1 / 0 |
| `CLAUDE_CODE_AUTO_MODE_GIT_STATUS_UPLOADS` | cli_inner_pretty.js:442685 | 1 / 0 |
| `CLAUDE_CODE_AUTO_MODE_REPO_VISIBILITY` | cli_inner_pretty.js:229602 | 1 / 0 |
| `CLAUDE_CODE_RC_PERMISSION_NUDGE` | cli_inner_pretty.js:720480 | 1 / 0 |
| `CLAUDE_CODE_ENABLE_AUTO_MODE` | cli_inner_pretty.js:58030 (allow-list), :529606 / :529652 (dead strings) | 3 / 3 — the predicate that read it is gone |
| `CLAUDE_CODE_AUTO_MODE_MODEL` | cli_inner_pretty.js:32698 (accessor `idh` at :32776) | 1 / 1 — CARRYOVER |
