# Symbol Additions — v2.1.142 Unit 07 (37_permission_policy)

**Scope:** New or changed symbols in `claude_code_v_2.1.142/analyze/37_permission_policy/`.

All `File:Line` refer to `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` unless noted.

---

## Module: Auto Mode — Rule Loading and Defaults

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `wJ$` | `expandDefaultsList` | cli_inner_pretty.js:337707-337719 | function |
| `Kz8` | `getBuiltInClassifierRules` | cli_inner_pretty.js:337720-337727 | function |
| `WS7` | `mergeAutoModeWithDefaults` | cli_inner_pretty.js:337728-337736 | function |
| `eA8` | `extractDefaultRules` | cli_inner_pretty.js:337738-337748 | function |
| `Hz8` | `getAutoModeStateDir` | cli_inner_pretty.js:337758-337760 | function |
| `$z8` | `formatMergedRulesForPrompt` | cli_inner_pretty.js:337968 | function |
| `ZS7` | `buildClassifierSystemPrompt` | cli_inner_pretty.js:337750-337756 | function |
| `WAH` | `loadAutoModeRulesFromSettings` | cli_inner_pretty.js:52576-52603 | function |
| `dI9` | `autoModeSettingsSchema` | cli_inner_pretty.js:52652-52660 | object |
| `Rm8` | `useAutoModeDuringPlan` | cli_inner_pretty.js:52568-52575 | function |
| `Cm8` | `hasSettingsKey` | cli_inner_pretty.js:52604-52621 | function |
| `MKA` | `countAutoModeRules` | cli_inner_pretty.js:605742-605763 | function |
| `R08` | `formatCustomRulesSection` | cli_inner_pretty.js:605075-605107 | function |
| `S08` | `hasNonDefaultRules` | cli_inner_pretty.js:605072-605074 | function |
| `$KA` | `classifierCritiqueSystemPrompt` | cli_inner_pretty.js:605109-605126 | constant |
| `llH` | `defaultsTokenString` | cli_inner_pretty.js:338615 | constant |
| `AT6` | `classifierPromptTemplate` | cli_inner_pretty.js:338657 | variable |
| `PS7` | `classifierBuildOutput` | cli_inner_pretty.js:338657 | variable |
| `CF_` | `hardDenyStageOnePromptSuffix` | cli_inner_pretty.js:338623 | constant |
| `bF_` | `hardDenyStageTwoPromptSuffix` | cli_inner_pretty.js:338625 | constant |
| `RF_` | `stageOnePromptSuffix` | cli_inner_pretty.js:338621 | constant |
| `VF_` | `classifierResultSchema` | cli_inner_pretty.js:338658 | object |

---

## Module: Permission Mode Resolution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `zR6` | `resolvePermissionMode` | cli_inner_pretty.js:422449-422468 | function |
| `rgK` | `resolveModeFromSources` | cli_inner_pretty.js:198981-199046 | function |
| `agK` | `resolveModel` | cli_inner_pretty.js:199052-199063 | function |
| `ogK` | `resolveFallbackModel` | cli_inner_pretty.js:199047-199051 | function |
| `eJH` | `applyPermissionUpdate` | cli_inner_pretty.js:580705-580724 | function |
| `$QK` | `getPermissionUpdateCallback` | cli_inner_pretty.js:199110-199112 | function |
| `HQK` | `setPermissionUpdateCallback` | cli_inner_pretty.js:199107-199109 | function |
| `qQK` | `clearPermissionUpdateCallback` | cli_inner_pretty.js:199113-199115 | function |
| `Hz6` | `permissionCallbackStorage` | cli_inner_pretty.js:199117 | variable |
| `Dk` | `applyPermissionUpdatesToContext` | cli_inner_pretty.js | function |

---

## Module: Path Rule Matching

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `yL` | `matchPathRule` | cli_inner_pretty.js:518097-518123 | function |
| `MP` | `posixifyPath` | cli_inner_pretty.js:42851-42860 | function |
| `sLH` | `windowsifyPath` | cli_inner_pretty.js:42861-42880 | function |
| `eq` | `normalizePath` | cli_inner_pretty.js:43374 | function |
| `$Q6` | `posixRelative` | cli_inner_pretty.js:517836-517843 | function |
| `_BK` | `windowsRelative` | cli_inner_pretty.js:517844-517847 | function |
| `Oy4` | `getRulesByDirectory` | cli_inner_pretty.js | function |
| `Hm8` | `validatePermissionRule` | cli_inner_pretty.js:50222-50313 | function |
| `wy4` | `findFirstAllowingRule` | cli_inner_pretty.js:518128-518140 | function |
| `My4` | `resolveSymlinkRule` | cli_inner_pretty.js:518124-518127 | function |
| `VkH` | `fileEditPermissionCheck` | cli_inner_pretty.js:518202-518286 | function |
| `Ky4` | `ignoreLibrary` | cli_inner_pretty.js | variable |
| `x$H` | `pathSeparator` | cli_inner_pretty.js | constant |

---

## Module: Sandbox Auto-Allow

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `v64` | `sandboxAutoAllowAstAware` | cli_inner_pretty.js:420551-420579 | function |
| `WA5` | `sandboxAutoAllowSingleLine` | cli_inner_pretty.js:420580-420632 | function |
| `VA5` | `sandboxAutoAllowRuleCheck` | cli_inner_pretty.js:420644-420673 | function |
| `V64` | `permissionRouter` | cli_inner_pretty.js:420542-420550 | function |
| `bV` | `isSupportedSandboxCommand` | cli_inner_pretty.js | function |
| `kdH` | `isSafeEnvVar` | cli_inner_pretty.js:420274-420276 | function |
| `$W$` | `safeEnvVarSet` | cli_inner_pretty.js:421198 | constant |
| `Bz6` | `dangerousEnvVarPredicate` | cli_inner_pretty.js:205232-205235 | function |
| `lz6` | `mostDangerousEnvVarPredicate` | cli_inner_pretty.js:205236-205238 | function |
| `cz6` | `integerEvalEnvVarSet` | cli_inner_pretty.js:205755-205786 | constant |
| `Fe1` | `pathLikeEnvVarSet` | cli_inner_pretty.js:205740-205754 | constant |
| `kA5` | `noPipelineSeparators` | cli_inner_pretty.js:420684-420693 | function |
| `NA5` | `cdSafePathCheck` | cli_inner_pretty.js:420694-420706 | function |
| `EA5` | `cdCompoundCheck` | cli_inner_pretty.js:420707 | function |
| `TA5` | `stripEnvVarPrefixes` | cli_inner_pretty.js:420633-420643 | function |

---

## Module: Bash Classifier — Static Checks

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `WdK` | `bashWrapperStripper` / `bashAstStaticCheck` | cli_inner_pretty.js:205239-205473 | function |
| `LdK` | `isDangerousCommandHead` | cli_inner_pretty.js:205223-205225 | function |
| `JdK` | `evalClassBuiltins` | cli_inner_pretty.js:205696-205714 | constant |
| `jdK` | `zshBuiltinsBypass` | cli_inner_pretty.js:205627-205645 | constant |
| `XdK` | `argRunningWrappers` | cli_inner_pretty.js:205715-205727 | constant |
| `N64` | `transparentWrappersSet` | cli_inner_pretty.js:421159-421195 | constant |
| `gz6` | `dangerousFindFlags` | cli_inner_pretty.js:205646 | constant |
| `Qz6` | `safeFindPredicates` | cli_inner_pretty.js:205647-205694 | constant |
| `dz6` | `newerTimeRegex` | cli_inner_pretty.js:205695 | constant |
| `pe1` | `bashStaticCheckOperandMap` | cli_inner_pretty.js:205728-205736 | object |
| `gUH` | `bashIntComparators` | cli_inner_pretty.js:205737 | constant |
| `f0H` | `numericLiteralRegex` | cli_inner_pretty.js:205738 | constant |
| `Ue1` | `commandsWithPositionalNames` | cli_inner_pretty.js:205739 | constant |
| `qdK` | `readBuiltinFlags` | cli_inner_pretty.js:205787 | constant |
| `pz6` | `procEnvironRegex` | cli_inner_pretty.js:205787 | constant |
| `Ee$` | `newlineHashRegex` | cli_inner_pretty.js:205787 | constant |
| `xZ` | `isRuntimeDetermined` | cli_inner_pretty.js | function |
| `_dK` | `unanalyzableNodeTypes` | cli_inner_pretty.js:205218 | constant |
| `KdK` | `topLevelNodeTypes` | cli_inner_pretty.js:205515-205519 | constant |
| `kz6` | `shellKeywords` | cli_inner_pretty.js | constant |

---

## Module: Bash Rule Matching

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `uNH` | `bashRuleMatcher` | cli_inner_pretty.js:420533-420541 | function |
| `gw8` | `bashExactRuleMatch` | cli_inner_pretty.js:421081-421094 | function |
| `h64` | `bashPrefixRuleMatch` | cli_inner_pretty.js:421095-421128 | function |
| `nS6` | `matchRulesAgainstCommand` | cli_inner_pretty.js | function |
| `oS6` | `parseRuleContent` | cli_inner_pretty.js | function |
| `Be$` | `parseRuleContentExact` | cli_inner_pretty.js:207228-207232 | function |
| `mNH` | `getAlwaysAllowRules` | cli_inner_pretty.js:421514-421518 | function |
| `r9H` | `getAlwaysDenyRules` | cli_inner_pretty.js:421565-421569 | function |
| `BNH` | `getAlwaysAskRules` | cli_inner_pretty.js:421570-421574 | function |
| `GQ` | `getRulesForTool` | cli_inner_pretty.js:421605-421607 | function |
| `BDH` | `getRulesForToolName` | cli_inner_pretty.js:421608-421626 | function |
| `N5` | `buildPermissionMessage` | cli_inner_pretty.js:421519-421564 | function |
| `Qw8` | `permissionScopeOrder` | cli_inner_pretty.js | constant |
| `tS6` | `genericToolRuleMatch` | cli_inner_pretty.js:421575-421583 | function |
| `Q64` | `proxyExpansionEligible` | cli_inner_pretty.js:421587-421589 | function |
| `g64` | `findGenericAllowRule` | cli_inner_pretty.js:421584-421586 | function |
| `TL$` | `findGenericDenyRule` | cli_inner_pretty.js:421590-421592 | function |
| `eS6` | `findGenericAskRule` | cli_inner_pretty.js:421593-421595 | function |
| `WV6` | `findExactDenyRule` | cli_inner_pretty.js:421596-421598 | function |
| `GnH` | `filterAgentsByDenyRule` | cli_inner_pretty.js:421599-421604 | function |

---

## Module: Suggestion Builders

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `rDH` | `buildBashSuggestion` | cli_inner_pretty.js:420235-420247 | function |
| `MA5` | `parseHeredocPrefix` | cli_inner_pretty.js:420249-420266 | function |
| `y64` | `appendPrefixWildcardSuggestion` | cli_inner_pretty.js:420268-420270 | function |
| `pe$` | `suggestExactRule` | cli_inner_pretty.js:207234-207237 | function |
| `uY$` | `suggestPrefixRule` | cli_inner_pretty.js:207239-207247 | function |
| `Fw8` | `findGenericPrefix` | cli_inner_pretty.js | function |
| `e_` | `firstLine` | cli_inner_pretty.js | function |
| `arH` | `formatSource` | cli_inner_pretty.js:421511-421513 | function |
| `ZMq` | `formatSourceImpl` | cli_inner_pretty.js | function |

---

## Module: Skill Permission Match (v2.1.121, v2.1.139, v2.1.129)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `SnH.checkPermissions` | `checkSkillPermissions` | cli_inner_pretty.js:353604-353658 | function |
| `SnH.validateInput` | `validateSkillInvocation` | cli_inner_pretty.js:353543-353603 | function |
| `oT5` | `getSkillOverrideAuthority` | cli_inner_pretty.js:476885-476892 | function |
| `aT5` | `getSkillOverrideLocalUser` | cli_inner_pretty.js:476894-476895 | function |
| `st` | `resolveSkillOverride` | cli_inner_pretty.js:513849 | function |
| `fX` | `skillToolName` | cli_inner_pretty.js:211564 | constant |
| `Xy` | `findSkillByName` | cli_inner_pretty.js | function |
| `Am7` | `isUserInvocation` | cli_inner_pretty.js | function |
| `yV6` | `loadSkills` | cli_inner_pretty.js | function |
| `Q7H` | `filterSkillsByAgent` | cli_inner_pretty.js | function |
| `Np` | `getSessionSkillAllowlist` | cli_inner_pretty.js | function |

---

## Module: Dangerous Path Safety

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `IX6` | `dangerousPathCheck` | cli_inner_pretty.js:274835-274851 | function |
| `nUH` | `isCriticalPath` | cli_inner_pretty.js:207091-207105 | function |
| `tM7` | `detectShellRmTarget` | cli_inner_pretty.js:274852-274879 | function |
| `tP_` | `tP_pathPermissionCheck` | cli_inner_pretty.js:274936-274996 | function |
| `Hw7` | `Hw7_pathCheckWithRmGuard` | cli_inner_pretty.js:274997 | function |
| `hX6` | `buildDangerousResult` | cli_inner_pretty.js:274828-274834 | function |
| `vdH` | `positionalArgParsers` | cli_inner_pretty.js | object |
| `Gk` | `normalizeQuoting` | cli_inner_pretty.js | function |
| `ce1` | `criticalRootChildRegex` | cli_inner_pretty.js | constant |
| `le1` | `additionalCriticalPathRegex` | cli_inner_pretty.js | constant |
| `oz6` | `osPathHelper` | cli_inner_pretty.js | variable |
| `oP_` | `rmCommandRegex` | cli_inner_pretty.js | constant |
| `rP_` | `rmTargetRegex` | cli_inner_pretty.js | constant |
| `sP_` | `pathPermissionPredicates` | cli_inner_pretty.js | object |
| `OVH` | `commandModeMap` | cli_inner_pretty.js | object |
| `aP_` | `commandModeVerbMap` | cli_inner_pretty.js | object |

---

## Module: Dangerously-Skip Path Bypass

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bY$` | `pathSafetyCheck` | cli_inner_pretty.js:517958-517989 | function |
| `hw8` | `isSettingsFile` | cli_inner_pretty.js:517853-517862 | function |
| `$u5` | `isSettingsOrUserCustomization` | cli_inner_pretty.js:517863-517869 | function |
| `_u5` | `isSensitivePath` | cli_inner_pretty.js:517915-517941 | function |
| `Yy4` | `hasSuspiciousWindowsPattern` | cli_inner_pretty.js:517942-517957 | function |
| `qQ6` | `isWSL` | cli_inner_pretty.js:517907-517909 | function |
| `KQ6` | `isTrustedNetworkPath` | cli_inner_pretty.js:517910-517914 | function |
| `pd` | `isUNCPath` | cli_inner_pretty.js | function |
| `sl` | `isUNCStrict` | cli_inner_pretty.js | function |
| `tx5` | `protectedDirectoriesList` | cli_inner_pretty.js | constant |
| `sx5` | `protectedFilesList` | cli_inner_pretty.js | constant |
| `mc_` | `teamSkillDiscoveryPaths` | cli_inner_pretty.js:352143 | constant |
| `Va1` | `vsCodeIdeaExcludes` | cli_inner_pretty.js:195302 | constant |
| `bA6` | `dotEnvVariants` | cli_inner_pretty.js:197669-197678 | constant |
| `St$` | `getSandboxRipgrepExcludes` | cli_inner_pretty.js:195125-195127 | function |
| `xa1` | `buildSandboxExcludeGlobs` | cli_inner_pretty.js:195855-195863 | function |
| `Hu5` | `getManagedSettingsList` | cli_inner_pretty.js:517848-517852 | function |
| `_y4` | `isInPlanDirectory` | cli_inner_pretty.js:517870-517876 | function |
| `qu5` | `isInScratchpadJs` | cli_inner_pretty.js:517877-517880 | function |
| `Ku5` | `isInWorktree` | cli_inner_pretty.js:517881-517885 | function |
| `pl` | `getAllWorkingDirs` | cli_inner_pretty.js:517991-517993 | function |
| `GI` | `isInAllowedDirectories` | cli_inner_pretty.js:517994-517998 | function |
| `ah` | `isDescendantOf` | cli_inner_pretty.js:517999-518009 | function |
| `y2` | `caseFoldedSegment` | cli_inner_pretty.js | function |
| `ex5` | `skillPathFromContext` | cli_inner_pretty.js:517812-517835 | function |

---

## Module: Multi-Tier Settings Merge

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Gm8` | `isParentMergeEnabled` | cli_inner_pretty.js:52043-52045 | function |
| `Tm8` | `applyParentSlice` | cli_inner_pretty.js:52046-52088 | function |
| `MDq` | `mergeAdminAndParentTiers` | cli_inner_pretty.js:52104-52131 | function |
| `uI9` | `collectAllTiers` | cli_inner_pretty.js:52132-52137 | function |
| `wDq` | `getEffectiveSettings` | cli_inner_pretty.js:52138-52148 | function |
| `Vm8` | `loadParentSettings` | cli_inner_pretty.js:52149 | function |
| `HC$` | `detectAdminTier` | cli_inner_pretty.js:52095-52103 | function |
| `aR$` | `pickKeys` | cli_inner_pretty.js | function |
| `eR$` | `cachedLoadParentSettings` | cli_inner_pretty.js:52037-52042 | function |
| `is6` | `cacheGetParentSettings` | cli_inner_pretty.js | function |
| `rs6` | `cacheSetParentSettings` | cli_inner_pretty.js | function |
| `os6` | `cacheGetEffectiveSettings` | cli_inner_pretty.js | function |
| `as6` | `cacheSetEffectiveSettings` | cli_inner_pretty.js | function |
| `ix` | `hasSkipDangerousPrompt` | cli_inner_pretty.js:52541-52548 | function |
| `QI9` | `hasIsolatePeerMachines` | cli_inner_pretty.js:52549-52551 | function |
| `jR` | `hasAutoModeOptIn` | cli_inner_pretty.js:52552-52567 | function |
| `MK$` | `getPluginSettingsKey` | cli_inner_pretty.js:52536-52540 | function |
| `ODq` | `cachedGetEffectiveSettings` | cli_inner_pretty.js:52089-52094 | function |

---

## Module: Rule Parse Utilities

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `jO` | `parseRule` | cli_inner_pretty.js:50106-50117 | function |
| `wz` | `formatRule` | cli_inner_pretty.js:50119-50122 | function |
| `$I9` | `escapeRuleContent` | cli_inner_pretty.js:50100-50102 | function |
| `qI9` | `unescapeRuleContent` | cli_inner_pretty.js:50103-50105 | function |
| `KI9` | `findFirstUnescaped` | cli_inner_pretty.js:50124-50133 | function |
| `_I9` | `findLastUnescaped` | cli_inner_pretty.js:50134-50143 | function |
| `vwq` | `isBackslashEscaped` | cli_inner_pretty.js:50204-50209 | function |
| `eu8` | `countUnescaped` | cli_inner_pretty.js:50210-50214 | function |
| `AI9` | `hasEmptyParens` | cli_inner_pretty.js:50215-50221 | function |
| `Th` | `parseMcpToolName` | cli_inner_pretty.js:50054-50060 | function |
| `lx` | `formatMcpServerPrefix` | cli_inner_pretty.js:50061-50063 | function |
| `KU` | `formatMcpTool` | cli_inner_pretty.js:50064-50066 | function |
| `su8` | `getCanonicalToolName` | cli_inner_pretty.js:50067-50069 | function |
| `BR$` | `stripMcpPrefix` | cli_inner_pretty.js:50070-50073 | function |
| `pR$` | `extractMcpToolDescription` | cli_inner_pretty.js:50074-50080 | function |
| `TT` | `getToolAlias` | cli_inner_pretty.js:50082-50084 | function |
| `Lwq` | `getAliasReverse` | cli_inner_pretty.js:50085-50088 | function |
| `FR$` | `permissionConfig` | cli_inner_pretty.js:50170-50202 | object |
| `Zwq` | `isFilePatternTool` | cli_inner_pretty.js:50159-50161 | function |
| `Gwq` | `isBashPrefixTool` | cli_inner_pretty.js:50162-50164 | function |
| `Twq` | `getCustomValidation` | cli_inner_pretty.js:50165-50167 | function |
| `tu8` | `toolNameAliases` | cli_inner_pretty.js:50149-50156 | object |
| `gR$` | `permissionRuleZodSchema` | cli_inner_pretty.js:50322-50333 | object |

---

## Module: Settings Schema Keys

| Settings Key | Section | Version | Description |
|---|---|---|---|
| `parentSettingsBehavior` | admin-tier only | v2.1.133 | `"first-wins" \| "merge"` |
| `autoMode.hard_deny` | autoMode object | v2.1.136 | Unconditional-block rules |
| `skillOverrides` | top-level | v2.1.129 | `{ [skillName]: "on" \| "name-only" \| "user-invocable-only" \| "off" }` |
| `sandbox.autoAllowBashIfSandboxed` | sandbox object | (pre-v2.1.142, used by v2.1.139 AST path) | Bool |
| `sandbox.network.allowManagedDomainsOnly` | sandbox.network | (pre-v2.1.142, wired in v2.1.126) | Bool |
| `sandbox.filesystem.allowManagedReadPathsOnly` | sandbox.filesystem | (pre-v2.1.142, wired in v2.1.126) | Bool |

Settings string literal: `"$defaults"` (in `autoMode.{allow,soft_deny,hard_deny,environment}` arrays).

---

## Module: Permission Decision Reasons

These are `decisionReason.type` discriminants used in permission decisions (constants are inline string literals, not symbols):

| Value | Where set | Meaning |
|---|---|---|
| `"rule"` | Many places | A `permissions.{allow,deny,ask}` rule matched |
| `"mode"` | Plan/auto/bypass paths | Decision driven by current mode |
| `"safetyCheck"` | `bY$`, `iUH` | Path was dangerous; safety check triggered |
| `"workingDir"` | `VkH` | Path was outside allowed working directories |
| `"other"` | Catchall | Custom reason in `.reason` field |
| `"classifier"` | Auto-mode | Auto-mode classifier blocked |
| `"hook"` | Hook path | A hook returned a decision |
| `"subcommandResults"` | Compound bash | Multiple parts of a compound need approval |
| `"permissionPromptTool"` | SDK | SDK's permissionPromptTool returned |
| `"sandboxOverride"` | Sandbox | Sandbox-related override |
| `"asyncAgent"` | Background agents | Async agent reason |

---

## Module: Constants for Specific Patterns

| Obfuscated | Readable | Value | Notes |
|---|---|---|---|
| `llH` | `defaultsTokenString` | `"$defaults"` | The sentinel string |
| `JS7` | `sandboxClassifierName` | `"SandboxNetworkAccess"` | Classifier ID |
| `DJ$` | `classifyResultToolName` | `"classify_result"` | Classifier tool name |
| `YT6` | `classifierUnavailableCacheTtlMs` | `1800000` (30 min) | Circuit breaker timeout |
| `NY$` | `cmdSubPlaceholder` | `"__CMDSUB_OUTPUT__"` | Tree-sitter placeholder for $(cmd) |
| `lj` | `trackedVarPlaceholder` | `"__TRACKED_VAR__"` | Tree-sitter placeholder for $VAR |
| `nf` | (various) | (string used in agent UI) | n/a |

---

## Module: Per-Tool checkPermissions Entries

Added while writing [`tools_interaction.md`](../37_permission_policy/tools_interaction.md). Each line is the `checkPermissions: async ...` definition inside a tool's module-level object.

| Obfuscated | Readable | File:Line | Tool |
|---|---|---|---|
| `Sq.checkPermissions` | `bashCheckPermissions` | cli_inner_pretty.js:419531 | Bash |
| `EK.checkPermissions` | `powerShellCheckPermissions` | cli_inner_pretty.js:405825 | PowerShell |
| `G7.checkPermissions` | `editCheckPermissions` | cli_inner_pretty.js:415491 | Edit |
| `o4.checkPermissions` | `writeCheckPermissions` | cli_inner_pretty.js:360020 | Write |
| `VP.checkPermissions` | `notebookEditCheckPermissions` | cli_inner_pretty.js:361796 | NotebookEdit |
| `Bq.checkPermissions` | `readCheckPermissions` | cli_inner_pretty.js:407268 | Read |
| `v9.checkPermissions` | `grepCheckPermissions` | cli_inner_pretty.js:339085 | Grep |
| `fX.checkPermissions` | `skillCheckPermissions` | cli_inner_pretty.js:353604 | Skill |
| `D7.checkPermissions` | `agentCheckPermissions` | cli_inner_pretty.js:351977 | Agent |
| `FD.checkPermissions` | `webFetchCheckPermissions` | cli_inner_pretty.js:377370 | WebFetch |
| `VI.checkPermissions` | `webSearchCheckPermissions` | cli_inner_pretty.js:381296 | WebSearch |
| `NZ.checkPermissions` | `exitPlanModeCheckPermissions` | cli_inner_pretty.js:381702 | ExitPlanMode |
| `Gz.checkPermissions` | `askUserQuestionCheckPermissions` | cli_inner_pretty.js:382131 | AskUserQuestion |
| `HV.checkPermissions` | `todoWriteCheckPermissions` | cli_inner_pretty.js:272197 | TodoWrite |
| `J0.checkPermissions` | `structuredOutputCheckPermissions` | cli_inner_pretty.js:207613 | StructuredOutput |
| `l3H.checkPermissions` | `waitForMcpServersCheckPermissions` | cli_inner_pretty.js:271591 | WaitForMcpServers |
| `nf.checkPermissions` | `scheduleWakeupCheckPermissions` | cli_inner_pretty.js:380652 | ScheduleWakeup |
| `mZ.checkPermissions` | `sendMessageCheckPermissions` | cli_inner_pretty.js:382997 | SendMessage |
| `m3.checkPermissions` | `replCheckPermissions` | cli_inner_pretty.js:380416 | REPL |
| `clH.checkPermissions` | `lspCheckPermissions` | cli_inner_pretty.js:387082 | LSP |
| `hL.checkPermissions` | `monitorCheckPermissions` | cli_inner_pretty.js:385746 | Monitor |
| `XL$` | `bashClassifierUmbrella` | cli_inner_pretty.js:420831 | Bash classifier orchestrator |

---

## Module: UI / Bridge Components

Added while writing [`permission_dialog_ui.md`](../37_permission_policy/permission_dialog_ui.md) and [`canUseTool_flow.md`](../37_permission_policy/canUseTool_flow.md).

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `epH` | `shouldShowAlwaysAllow` (gate for "Yes, always" variants) | cli_inner_pretty.js:180941-180943 | function |
| `yz$` | `isAllowManagedRulesOnly` (consulted by `epH`) | cli_inner_pretty.js | function |
| `PD6` | `buildPermissionRequest` (SDK permission_request envelope) | cli_inner_pretty.js:239298-239309 | function |
| `ZD6` | `buildSandboxPermissionRequest` (sandbox permission_request envelope) | cli_inner_pretty.js:239339-239362 | function |
| `lR6` | `dispatchToolWithPermissionCheck` (`canUseTool ?? tD` fallback) | cli_inner_pretty.js:511639 | function |
| `kL$` | `runPermissionDeniedHooks` (PermissionDenied async-generator hook chain — only for auto-mode denials) | cli_inner_pretty.js:520217 (def); 388207 (call) | function |
| `oiH` | `recheckRulesAfterHookRewrite` (v2.1.110 deny re-check after hook updatedInput) | cli_inner_pretty.js:421627-421634 | function |
| `f64` | `isPlanModeFloorDecision` (predicate for plan-mode floor reason) | cli_inner_pretty.js:421723 | function |
| `bV` | `isSupportedSandboxCommand` | cli_inner_pretty.js | function |

---

## Module: SDK Bridge & permissionPromptToolName

| Symbol | Meaning | File:Line |
|---|---|---|
| `Options.canUseTool` | SDK callback for per-call permission decisions | cli_inner_pretty.js:498752, 498760 |
| `Options.permissionPromptToolName` | Alternative SDK option — tool name handling permission prompts | cli_inner_pretty.js:498375, 501129-501215 |
| Mutual exclusion error | "canUseTool callback cannot be used with permissionPromptToolName..." | cli_inner_pretty.js:498428 |
| `can_use_tool` request subtype | Control protocol request type for SDK callback | cli_inner_pretty.js:498918-498922 |
| `permissionPromptTool` result case | Translates SDK tool result into PermissionDecision | cli_inner_pretty.js:387733-387737, 575203, 575322 |
| `decisionClassification` discriminant | `"user_temporary" | "user_permanent" | "user_reject"` | cli_inner_pretty.js:387735 |
| `permission_mode_changed` analytics | Emitted on Shift+Tab mode cycle | cli_inner_pretty.js:218459 |

---

## Module: Permission Dialog UI (v2.1.88 references)

Most of the dialog code is in `src/components/permissions/` (v2.1.88 TypeScript source) and `src/hooks/useCanUseTool.tsx`. v2.1.142 bundle mirrors this structure.

| TS source | Purpose |
|---|---|
| `src/components/permissions/PermissionDialog.tsx` | Outer shell (border + title + Select) |
| `src/components/permissions/PermissionRequest.tsx` | `permissionComponentForTool` dispatcher |
| `src/components/permissions/PermissionRequestTitle.tsx` | Title + subtitle + workerBadge |
| `src/components/permissions/PermissionExplanation.tsx` | `?` toggle explainer panel |
| `src/components/permissions/BashPermissionRequest/BashPermissionRequest.tsx` | Bash-specific options + shimmer |
| `src/components/permissions/BashPermissionRequest/bashToolUseOptions.tsx` | `BashToolUseOption` choices |
| `src/components/permissions/FileEditPermissionRequest/` | Edit with diff preview |
| `src/components/permissions/FilesystemPermissionRequest/` | Read/Glob/Grep dialog |
| `src/components/permissions/SkillPermissionRequest/` | Skill with `(name *)` prefix variant |
| `src/components/permissions/WebFetchPermissionRequest/` | WebFetch with domain highlight |
| `src/components/permissions/ExitPlanModePermissionRequest/` | Plan summary review |
| `src/components/permissions/AskUserQuestionPermissionRequest/` | User question prompt |
| `src/components/permissions/FallbackPermissionRequest.tsx` | Catch-all (MCP / plugin tools) |
| `src/components/permissions/WorkerBadge.tsx` | Background-agent indicator |
| `src/components/permissions/PermissionDecisionDebugInfo.tsx` | Debug info toggle (`?`) |
| `src/hooks/useCanUseTool.tsx` | The hook that pushes onto confirm queue |
| `src/hooks/toolPermission/handlers/coordinatorHandler.ts` | Coordinator pre-handler |
| `src/hooks/toolPermission/handlers/swarmWorkerHandler.ts` | Swarm worker pre-handler |
| `src/hooks/toolPermission/handlers/interactiveHandler.ts` | Interactive prompt handler |
| `src/hooks/toolPermission/PermissionContext.ts` | Permission context + queue ops + `createResolveOnce` |
| `src/hooks/toolPermission/permissionLogging.ts` | Decision logging |
| `src/tools/BashTool/bashPermissions.ts` | `peekSpeculativeClassifierCheck` / `consumeSpeculativeClassifierCheck` |
| `src/utils/permissions/permissions.ts` | `hasPermissionsToUseTool` (TS form of `tD`) |

---

## Changes vs v2.1.112 Symbol Index

**Newly tracked** (introduced or expanded scope in this window):
- All entries above

**Changed semantics** (existing symbol, new behavior):
- `yL` (`matchPathRule`): v2.1.133 restores `/**` when prefix is empty/slash-only
- `VkH` (`fileEditPermissionCheck`): v2.1.136 plan-mode block before settings-allow lookup
- `SnH.checkPermissions` (`checkSkillPermissions`): v2.1.139 fixes wildcard prefix-match
- `v64` (`sandboxAutoAllowAstAware`): v2.1.116 dangerous-path safety + v2.1.139 AST-aware
- `WdK` (`bashAstStaticCheck`): v2.1.113 find-flag check (line 205409-205423)
- `Tm8` (`applyParentSlice`): v2.1.126 honors `allowManagedDomainsOnly`/`allowManagedReadPathsOnly`
- `_u5` (`isSensitivePath`): v2.1.121 + v2.1.126 expand `.claude/` subdirectory carve-out under bypass
- `eJH` (`applyPermissionUpdate`): v2.1.141 honors `preserveMode` option
- `N5` (`buildPermissionMessage`): v2.1.141 explains which rule caused the prompt

---

## Module-to-Doc Mapping

| Doc | Primary symbols |
|---|---|
| `skill_wildcard_match.md` | `SnH.checkPermissions`, `oT5`, `aT5`, `fX`, `Xy`, `Am7` |
| `auto_mode_hard_deny.md` | `WAH`, `dI9`, `MKA`, `R08`, `S08`, `N5`, `$KA`, `CF_`, `bF_` |
| `permission_mode_persistence.md` | `zR6`, `rgK`, `eJH`, `$QK`, `VkH`, `Dk` |
| `drive_root_match.md` | `yL`, `MP`, `$Q6`, `Oy4`, `Hm8`, `Ky4`, `wy4` |
| `auto_mode_defaults_token.md` | `wJ$`, `WS7`, `Kz8`, `eA8`, `llH`, `AT6`, `ZS7`, `$z8`, `R08`, `S08` |
| `dangerous_skip_path_expansion.md` | `bY$`, `hw8`, `$u5`, `_u5`, `Yy4`, `tx5`, `sx5`, `St$`, `Va1`, `bA6`, `Hu5` |
| `sandbox_auto_allow_safety.md` | `v64`, `WA5`, `VA5`, `IX6`, `nUH`, `bV`, `LdK`, `vdH`, `ce1`, `le1` |
| `find_exec_delete_block.md` | `gz6`, `Qz6`, `dz6`, `xZ`, `WdK` (find-specific section) |
| `bash_wrapper_deny.md` | `WdK`, `N64`, `JdK`, `jdK`, `XdK`, `LdK`, `bV`, `$W$`, `MA5`, `Fw8`, `uNH` |
| `localSettings_suggestion.md` | `pe$`, `uY$`, `rDH`, `MA5`, `Fw8`, `e_`, `Dk` |
| `parent_settings_behavior.md` | `Gm8`, `Tm8`, `MDq`, `uI9`, `wDq`, `aR$` |
| `auto_allow_shell_expansion.md` | `v64`, `WA5`, `VA5`, `kdH`, `$W$`, `Bz6`, `lz6`, `LMH`, `IX6`, `bV` |

---

## Notes

1. **Line numbers** refer to the v2.1.142 build at `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js`. Future builds may shift these.
2. **Cross-version**: when a symbol existed pre-v2.1.142 (e.g., `WdK`), its prior locations are documented in `claude_code_v_2.1.112/analyze/00_overview/symbol_index_infra_platform.md`.
3. **Some readable names are aspirational**: the actual binding (e.g., `function WdK(H)`) doesn't have a JS-level name; the readable name is the analysis author's choice based on function behavior.
4. **Compound symbols**: `SnH.checkPermissions` refers to a method on the `SnH` object/variable; the `.checkPermissions` is the *property* name (an unobfuscated public surface).

---

> **Note:** All Permissions symbols above have been consolidated into [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) under the `Module: Permissions` section. This file is retained as the per-unit working notes for the permission-policy analysis pass; the canonical lookup is the platform index.
