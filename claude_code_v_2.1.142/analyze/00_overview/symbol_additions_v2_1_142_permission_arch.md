# Symbol Additions — v2.1.142 Permission Architecture Unit

> Permission-policy architecture symbols introduced/used in v2.1.142 unit 05 (architecture deep dive).
> Place: this file maps the **Permission Policy architecture** symbols for v2.1.142 unit 05.
> When the symbol_index_*.md files are produced for v2.1.142, these mappings should be merged into `symbol_index_infra_platform.md` under module "Permissions" and "Auto Mode".

These symbols are the cross-references used by the seven architecture documents in `claude_code_v_2.1.142/analyze/37_permission_policy/`:
- `architecture.md` — top-down flow diagram
- `rule_grammar.md` — per-tool grammar
- `settings_tier_hierarchy.md` — tier precedence + parentSettingsBehavior
- `mode_lifecycle.md` — state machine
- `auto_mode_classifier.md` — classifier pipeline
- `allow_deny_ask_precedence.md` — chain order
- `sandbox_integration.md` — permission ↔ sandbox handoff

---

## Module: Permissions — Core Chain

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| tD | hasPermissionsToUseTool | cli_inner_pretty.js:421879-422144 (export 421493) | function |
| UA5 | checkRulesAndCallback | cli_inner_pretty.js:421757-421814 | function |
| TL$ | findMatchingDenyRule | cli_inner_pretty.js:421590-421592 | function |
| eS6 | findMatchingAskRule | cli_inner_pretty.js:421593-421595 | function |
| g64 | findMatchingAllowRule | cli_inner_pretty.js:421584-421586 | function |
| WV6 | findExactDenyRuleByContent | cli_inner_pretty.js:421596-421598 | function |
| GnH | filterDeniedAgents | cli_inner_pretty.js:421599-421604 | function |
| GQ | getRuleByContentsForTool | cli_inner_pretty.js:421605-421607 | function |
| BDH | getRuleByContentsForToolName | cli_inner_pretty.js:421608-421626 | function |
| oiH | recheckRulesAfterHookRewrite | cli_inner_pretty.js:421627-421634 | function |
| BA5 | runPermissionRequestHookForHeadlessAgent | cli_inner_pretty.js:421635-421672 | function |
| Q64 | shouldProxyExpandRule | cli_inner_pretty.js:421587-421589 | function |
| HR6 | removePermissionRule | cli_inner_pretty.js:421815-421831 | function |
| c64 | groupPermissionUpdatesBySource | cli_inner_pretty.js:421832-421845 | function |
| $R6 | applyAddRules | cli_inner_pretty.js:421846-421849 | function |
| EX6 | applyReplaceRules | cli_inner_pretty.js:421850-421861 | function |
| U64 | mergeUpdatedInput | cli_inner_pretty.js:421862-421864 | function |
| RQ | findSafetyCheckInDecisionReason | cli_inner_pretty.js:421865-421874 | function |
| dw8 | isSafetyCheckNonApprovable | cli_inner_pretty.js:421716-421722 | function |
| d64 | isPlanModeFloorReason | cli_inner_pretty.js:421723-421729 | function |
| N5 | buildPermissionAskMessage | cli_inner_pretty.js:421519-421530 | function |
| i64 | buildDontAskRejectMessage | cli_inner_pretty.js:(near N5) | function |
| F64 | ORG_REQUIRES_APPROVAL_MESSAGE | cli_inner_pretty.js:421877 | constant |
| rrH | persistDenialState | cli_inner_pretty.js:421673-421680 | function |
| pA5 | handleDenialLimitExceeded | cli_inner_pretty.js:421681-421715 | function |
| Iq8 | createDenialTrackingState | cli_inner_pretty.js:(default state factory) | function |
| zM$ | recordSuccess | cli_inner_pretty.js:(denial tracking) | function |

---

## Module: Permissions — Rule Loader (cross-tier)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| mNH | getAllowRulesFromAllSources | cli_inner_pretty.js:(walks SETTING_SOURCES + cliArg/command/session) | function |
| r9H | getDenyRulesFromAllSources | cli_inner_pretty.js:(walks SETTING_SOURCES + cliArg/command/session) | function |
| BNH | getAskRulesFromAllSources | cli_inner_pretty.js:(walks SETTING_SOURCES + cliArg/command/session) | function |
| tS6 | matchesPermissionRule | cli_inner_pretty.js:(per-rule match dispatcher) | function |
| Qz | applyPermissionUpdateToContext | cli_inner_pretty.js:(near 181048, setMode handling) | function |
| Dk | applyMultiplePermissionUpdates | cli_inner_pretty.js:(used by EX6) | function |
| OR | EDITABLE_SETTING_SOURCES | cli_inner_pretty.js:(`localSettings`, `projectSettings`, `userSettings`) | constant |
| xJ | ALL_SETTING_SOURCES | cli_inner_pretty.js:(`userSettings`, `projectSettings`, `localSettings`, `flagSettings`, `policySettings`) | constant |
| AC | persistPermissionUpdates | cli_inner_pretty.js:(within BA5) | function |
| su8 | getToolNameForPermissionCheck | cli_inner_pretty.js:(MCP-aware tool name resolver) | function |

---

## Module: Permissions — Mode Resolution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| zR6 | initialPermissionModeFromCLI | cli_inner_pretty.js:422449-422468 | function |
| rgK | resolvePermissionModeFromSources | cli_inner_pretty.js:198981-199046 | function |
| Rv | normalizePermissionMode | cli_inner_pretty.js:48473-48475 | function |
| $t1 | isAutoCircuitBreakerOpen | cli_inner_pretty.js:(circuit-breaker check) | function |
| aW | isSubprocessEnvScrubEnabled | cli_inner_pretty.js:197361-197364 | function |
| Oq | getAdminSettings | cli_inner_pretty.js:(returns admin tier or null) | function |
| ON | globalAutoModeController | cli_inner_pretty.js:(module-level singleton) | variable |
| eJH | permissionUpdateCallback | cli_inner_pretty.js:580705-580724 | function |
| pe | restoreDangerousPermissions | cli_inner_pretty.js:(undo strip on auto exit) | function |
| Uo | EXTERNAL_PERMISSION_MODES | cli_inner_pretty.js:48447 | constant |
| QMq | INTERNAL_PERMISSION_MODES | cli_inner_pretty.js:48448 | constant |
| tN | PERMISSION_MODES | cli_inner_pretty.js:48449 | constant |
| bu8 | PERMISSION_DECISION_REASON_TYPES | cli_inner_pretty.js:48450-48462 | constant |
| dMq | PERMISSION_MODE_CONFIG | cli_inner_pretty.js:(yR$ lookup table) | object |
| yR$ | getPermissionModeConfig | cli_inner_pretty.js:48467-48469 | function |
| jc | getExternalPermissionMode | cli_inner_pretty.js:48470-48472 | function |
| zAH | permissionModeTitle | cli_inner_pretty.js:48476-48478 | function |
| iMq | permissionModeShortTitle | cli_inner_pretty.js:48479 | function |

---

## Module: Permissions — Auto Mode Settings Merge

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| WAH | loadAutoModeRulesFromSettings | cli_inner_pretty.js:52576-52603 | function |
| dI9 | autoModeSettingsSchema | cli_inner_pretty.js:52652-52660 | function |
| WS7 | mergeAutoModeWithDefaults | cli_inner_pretty.js:(prompt-build path) | function |
| wJ$ | expandDefaultsList | cli_inner_pretty.js:337707-337719 | function |
| eA8 | extractDefaultRules | cli_inner_pretty.js:(parses `<user_*_rules_to_replace>`) | function |
| Kz8 | getBuiltInClassifierRules | cli_inner_pretty.js:(returns built-in allow/soft_deny/hard_deny/environment) | function |
| llH | DEFAULTS_SENTINEL | cli_inner_pretty.js:338615 | constant |
| Cm8 | hasKeyInProjectSettings | cli_inner_pretty.js:52604-52621 | function |
| Rm8 | useAutoModeDuringPlan | cli_inner_pretty.js:52568-52575 | function |
| srH | hasAutoModeOptInAnySource | cli_inner_pretty.js:(reads skipAutoPermissionPrompt) | function |
| KG | isAutoModeGateEnabled | cli_inner_pretty.js:(live gate check) | function |
| RJ$ | verifyAutoModeGateAccess | cli_inner_pretty.js:422622+ | function |

---

## Module: Permissions — Classifier (jJ$ family)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| jJ$ | classifyYoloAction | cli_inner_pretty.js:338324 | function |
| zT6 | formatActionForClassifier | cli_inner_pretty.js:(formats tool+input for classifier) | function |
| qT6 | runClassifierRequest | cli_inner_pretty.js:(actual API call) | function |
| MS7 | extractUsageFromClassifierResult | cli_inner_pretty.js:(usage extraction) | function |
| $T6 | extractRequestIdFromClassifierResult | cli_inner_pretty.js:(req-id extraction) | function |
| HT6 | logClassifierStage | cli_inner_pretty.js:(stage logging) | function |
| aeH | recordClassifierTokens | cli_inner_pretty.js:(token accounting) | function |
| fS7 | parseStageDecision | cli_inner_pretty.js:(parse shouldBlock from classifier text) | function |
| OS7 | extractClassifierReason | cli_inner_pretty.js:(parse reason from classifier text) | function |
| qz8 | buildClassifierFailureReason | cli_inner_pretty.js:(failure-mode reason builder) | function |
| qS7 | CLASSIFIER_REQUEST_TIMEOUT_MS | cli_inner_pretty.js:337522 (30s) | constant |
| CF_ | stage1SystemPromptSuffix | cli_inner_pretty.js:338623 | constant |
| bF_ | stage2SystemPromptSuffix | cli_inner_pretty.js:338625 | constant |
| RF_ | fastModeSystemPromptSuffix | cli_inner_pretty.js:338621 | constant |
| VF_ | classifyResultSchema | cli_inner_pretty.js:338658 | function |
| ZF_ | EMPTY_TOOL_INPUT_PLACEHOLDER | cli_inner_pretty.js:338614 | constant |
| DJ$ | CLASSIFY_RESULT_TOOL_NAME | cli_inner_pretty.js:338617 | constant |
| vF_ | classifyResultJsonSchema | cli_inner_pretty.js:338659+ | object |
| kF_ | classifierToolDefinition | cli_inner_pretty.js:(tool def for the classifier API) | object |
| hF_ | classifierStageResultUnionSchema | cli_inner_pretty.js:(union schema) | function |
| JS7 | SANDBOX_NETWORK_CLASSIFIER_TOOL_NAME | cli_inner_pretty.js:338627 | constant |
| YT6 | IRON_GATE_REFRESH_MS | cli_inner_pretty.js:338628 (30min) | constant |
| xT | getFeatureValueCached | cli_inner_pretty.js:(`tengu_iron_gate_closed` cache) | function |
| tA8 | CLASSIFIER_MAX_RETRIES | cli_inner_pretty.js:(retry count) | constant |
| uA5 | autoModeAllowlistedTools | cli_inner_pretty.js:(isAutoModeAllowlistedTool exporter) | object |
| mA5 | autoModeStateModule | cli_inner_pretty.js:(`isAutoModeActive`/`setAutoModeActive`) | object |

---

## Module: Permissions — Hooks Layer

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| b9H | executePermissionRequestHooks | cli_inner_pretty.js:(hook driver) | function |
| jDH | runHookOnUpdatedInput | cli_inner_pretty.js:(invoke checkPermissions on rewritten input) | function |
| Lm6 | validateTerminalSequence | cli_inner_pretty.js:(OSC allowlist for hook output) | function |
| Z$ | getFeatureValue | cli_inner_pretty.js:(feature flag lookup) | function |
| applyHookPermissionDecision | (inline) | cli_inner_pretty.js:520600-520760 | function |

---

## Module: Permissions — Managed Settings / Tier Merge

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| MDq | mergeManagedPolicyTiers | cli_inner_pretty.js:52104-52131 | function |
| Tm8 | applyParentRestrictiveOnlyFilter | cli_inner_pretty.js:52046-52088 | function |
| Gm8 | shouldMergeParentChain | cli_inner_pretty.js:52043-52045 | function |
| ODq | getCachedPolicySettings | cli_inner_pretty.js:52089-52094 | function |
| HC$ | identifyPolicySource | cli_inner_pretty.js:52095-52103 | function |
| uI9 | collectPolicyTierList | cli_inner_pretty.js:52132-52137 | function |
| wDq | resolvePolicySettings | cli_inner_pretty.js:52138-52148 | function |
| Vm8 | getSettingsForTier | cli_inner_pretty.js:52149+ | function |
| WPH | getAllPolicyTierSettings | cli_inner_pretty.js:52338-52340 | function |
| aR$ | pickKeys | cli_inner_pretty.js:(generic key picker) | function |
| YK$ | loadHelperTier | cli_inner_pretty.js:(MDq dependency) | function |
| YDq | loadRemoteTier | cli_inner_pretty.js:(MDq dependency) | function |
| AK$ | loadOsPolicyTier | cli_inner_pretty.js:(MDq dependency) | function |
| fK$ | loadParentChainTier | cli_inner_pretty.js:(MDq dependency) | function |
| Oc | mergeSettingsObjects | cli_inner_pretty.js:(union/last-wins merge) | function |
| os6 | getMemoizedPolicySettings | cli_inner_pretty.js:(memoization cache) | function |
| as6 | setMemoizedPolicySettings | cli_inner_pretty.js:(memoization setter) | function |
| _K$ | iterateEnabledSettingSources | cli_inner_pretty.js:(iterates over enabled tiers) | function |
| PAH | getSettingsFilePath | cli_inner_pretty.js:(path for each tier) | function |
| zK$ | logSettingsFileError | cli_inner_pretty.js:(per-tier error logger) | function |
| B6 | writeSettingsToTier | cli_inner_pretty.js:(persist update) | function |
| v8 | getSettingsForTierCached | cli_inner_pretty.js:(cached read) | function |
| seH | getAllowedSettingSources | cli_inner_pretty.js:2153 | function |
| TMq | parseSettingSourcesFlag | cli_inner_pretty.js:(parses comma-separated CLI flag) | function |
| Vv8 | setEnabledSettingSources | cli_inner_pretty.js:(stores parsed list) | function |
| yM | invalidateSettingsCache | cli_inner_pretty.js:(triggers reload after --setting-sources) | function |
| ot4 | applySettingSourcesFlag | cli_inner_pretty.js:597740+ | function |
| zr6 | eagerLoadSettings | cli_inner_pretty.js:597748-597757 | function |

---

## Module: Permissions — Rule Grammar Parsing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| vUH | parsePermissionRule | cli_inner_pretty.js:(reads `Tool(content)` into struct) | function |
| eu8 | countUnescapedChars | cli_inner_pretty.js:50210-50214 | function |
| vwq | isCharEscaped | cli_inner_pretty.js:50204-50209 | function |
| AI9 | hasEmptyParenInRule | cli_inner_pretty.js:50215-50221 | function |
| Hm8 | validatePermissionRuleSyntax | cli_inner_pretty.js:50222+ | function |
| permissionRuleValueFromString | (2.1.88 TS) | 3rd/claude-code/src/utils/permissions/permissionRuleParser.ts | function |
| permissionRuleValueToString | (2.1.88 TS) | 3rd/claude-code/src/utils/permissions/permissionRuleParser.ts | function |
| escapeRuleContent | (2.1.88 TS) | 3rd/claude-code/src/utils/permissions/permissionRuleParser.ts | function |
| unescapeRuleContent | (2.1.88 TS) | 3rd/claude-code/src/utils/permissions/permissionRuleParser.ts | function |
| mcpInfoFromString | (2.1.88 TS) | 3rd/claude-code/src/services/mcp/mcpStringUtils.ts | function |
| normalizeLegacyToolName | (2.1.88 TS) | 3rd/claude-code/src/utils/permissions/permissionRuleParser.ts | function |
| LEGACY_TOOL_NAME_ALIASES | (2.1.88 TS) | 3rd/claude-code/src/utils/permissions/permissionRuleParser.ts | constant |

---

## Module: Permissions — Path Rule Matching (Edit/Write/Read)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| yL | matchPathRule | cli_inner_pretty.js:518097-518123 | function |
| MP | posixifyWindowsPath | cli_inner_pretty.js:(`C:\foo` → `/c/foo`) | function |
| eq | tildeExpand | cli_inner_pretty.js:(`~/x` → home/x) | function |
| Oy4 | groupPathRulesByCwd | cli_inner_pretty.js:(rules grouped by base directory) | function |
| Ky4 | getIgnoreLibrary | cli_inner_pretty.js:(import wrapper) | function |
| $Q6 | relativizePathForRule | cli_inner_pretty.js:(make rule-relative path) | function |
| x$H | PATH_SEP | cli_inner_pretty.js:(path separator) | constant |
| bY$ | pathSafetyCheck | cli_inner_pretty.js:517958-517989 | function |
| Yy4 | hasSuspiciousWindowsPattern | cli_inner_pretty.js:(reserved names, UNC, ...) | function |
| hw8 | isSettingsFile | cli_inner_pretty.js:(only matches settings.json variants) | function |
| $u5 | isSettingsOrUserCustomization | cli_inner_pretty.js:(settings + .claude/commands/agents/skills) | function |
| _u5 | isCredentialOrSecretFile | cli_inner_pretty.js:(`.env`, `~/.ssh`, `~/.aws`, ...) | function |
| uN | expandParentDirectories | cli_inner_pretty.js:(`/a/b/c` → [`/a/b/c`, `/a/b`, `/a`]) | function |
| I$ | getCurrentWorkingDirectory | cli_inner_pretty.js:(cwd resolver) | function |
| C$ | getProjectRoot | cli_inner_pretty.js:(project root resolver) | function |
| Sd | getProjectRootCanonical | cli_inner_pretty.js:(canonical project root) | function |
| $6 | getInitialCwd | cli_inner_pretty.js:(initial cwd) | function |
| bN | getAdditionalDirectoriesUnion | cli_inner_pretty.js:(union across tiers) | function |

---

## Module: Permissions — Skill Tool Rule Match (v2.1.121, v2.1.139)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| SnH | SkillToolHandler | cli_inner_pretty.js:353604+ (class with checkPermissions) | class |
| yV6 | resolveAvailableSkills | cli_inner_pretty.js:(skill registry) | function |
| Xy | normalizeSkillName | cli_inner_pretty.js:(strip / prefix) | function |

---

## Module: Permissions — Bash Classifier (uses N64, WdK, etc.)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| WdK | bashWrapperStripper | cli_inner_pretty.js:205239-205313 | function |
| XdK | additionalWrapperStripper | cli_inner_pretty.js:205715-205727 | function |
| LdK | isDangerousCommand | cli_inner_pretty.js:205223-205225 | function |
| N64 | safeAutoAllowWrappers | cli_inner_pretty.js:421159-421195 | constant |
| GA5 | shellWrappers | cli_inner_pretty.js:(sh/bash/zsh/...) | constant |
| ZA5 | processControlWrappers | cli_inner_pretty.js:(nice/nohup/...) | constant |
| Sq | BASH_TOOL_NAME | cli_inner_pretty.js:(`"Bash"` constant) | constant |
| EK | (legacy alias placeholder) | cli_inner_pretty.js:(used in tD inner) | constant |
| D7 | AGENT_TOOL_NAME | cli_inner_pretty.js:(`"Agent"` constant) | constant |
| T4 | (alias for D7 in some contexts) | cli_inner_pretty.js:(string `"Agent"`) | constant |
| N98 | safeEnvVarAllowlist | cli_inner_pretty.js:(37-entry safe env var set) | constant |
| LMH | stripWrapperPrefixesAndExtract | cli_inner_pretty.js:(used in v64) | function |
| xZ | isRuntimeDetermined | cli_inner_pretty.js:(args like `$(cmd)`) | function |
| gz6 | findDangerousFlags | cli_inner_pretty.js:(`-exec`, `-delete`, etc.) | constant |
| Qz6 | findSafeFlagsTakingOneArg | cli_inner_pretty.js:(`-name`, `-type`, etc.) | constant |
| dz6 | findNewerTimeRegex | cli_inner_pretty.js:(`+N`/`-N` time-spec regex) | constant |

---

## Module: Permissions — Sandbox Network Interop

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| KY$ | buildSandboxConfig | cli_inner_pretty.js:198104-198218 | function |
| EUH | getAllowManagedDomainsOnly | cli_inner_pretty.js:198101-198103 | function |
| pFK | networkPermissionFilter | cli_inner_pretty.js:196344-196358 | function |
| hA6 | matchesHostPattern | cli_inner_pretty.js:196333-196343 | function |
| NUK | canonicalizeHost | cli_inner_pretty.js:(IDN/lowercase) | function |
| nz$ | isValidHost | cli_inner_pretty.js:(host validator) | function |
| Fa1 | getMitmSocketPathForHost | cli_inner_pretty.js:196359-196364 | function |
| FD | WEB_FETCH_TOOL_NAME | cli_inner_pretty.js:(`"WebFetch"` constant) | constant |
| G7 | EDIT_TOOL_NAME | cli_inner_pretty.js:(`"Edit"` constant) | constant |
| Bq | READ_TOOL_NAME | cli_inner_pretty.js:(`"Read"` constant) | constant |
| iM | sandboxRuntimeAdapter | cli_inner_pretty.js:(`wrapWithSandbox`/`initialize`/`updateConfig`) | object |
| n6 | sandboxModuleObject | cli_inner_pretty.js:198248+ (`isSandboxingEnabled`/`isAutoAllowBashIfSandboxedEnabled`) | object |
| bV | shouldSandboxThisCommand | cli_inner_pretty.js:421425-421432 | function |
| v64 | sandboxAutoAllowAstAware | cli_inner_pretty.js:420551-420579 | function |
| WA5 | autoAllowSingleCmdChecker | cli_inner_pretty.js:420580-420632 | function |
| VA5 | staticRuleCheck | cli_inner_pretty.js:420644-420673 | function |
| IX6 | checkRmTargets | cli_inner_pretty.js:274835-274851 | function |
| nUH | isCriticalPath | cli_inner_pretty.js:207091-207105 | function |
| TFK | checkSandboxDependencies | cli_inner_pretty.js:195527-195539 | function |
| qY$ | bareRepoPlantList | cli_inner_pretty.js:(missing-but-mac-eligible repo files) | variable |
| Rs1 | scrubBareRepoPlants | cli_inner_pretty.js:198220-198228 | function |
| Cs1 | resolveProjectRoot | cli_inner_pretty.js:(used by Qs1) | function |
| Qs1 | initializeSandboxIfPossible | cli_inner_pretty.js:198353-198382 | function |
| ds1 | refreshSandboxFromSettings | cli_inner_pretty.js:198383-198388 | function |
| dA6 | settingsSubscriptionHandle | cli_inner_pretty.js:(subscribe handle) | variable |
| AY$ | sandboxConfigCache | cli_inner_pretty.js:(`.cache.clear` method) | object |
| W3H | sandboxInitPromise | cli_inner_pretty.js:(memoize init) | variable |
| NUH | resolvedProjectRoot | cli_inner_pretty.js:(post-Cs1 cache) | variable |
| JI | settingsChangeEmitter | cli_inner_pretty.js:(`.subscribe`) | object |
| JO | normalizeAllowPathRule | cli_inner_pretty.js:(used in KY$ for managed settings paths) | function |
| rt$ | resolveTierRelativePath | cli_inner_pretty.js:(tier path to abs) | function |
| kUH | normalizeSandboxFsPath | cli_inner_pretty.js:(sandbox FS path normalize) | function |
| wC | getInitialCwdRelative | cli_inner_pretty.js:(workCwd marker) | function |
| pq$ | getManagedSettingsDir | cli_inner_pretty.js:48231-48233 | function |
| Iv | wslManagedSettingsRoot | cli_inner_pretty.js:(WSL managed settings root) | constant |
| sGH | filesystem-stat module | cli_inner_pretty.js:(fs.statSync, fs.lstatSync) | object |

---

## Module: Permissions — UI Prompt Rendering

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (UI components for permission prompts live in src/ui — too many to enumerate individually) |
| `recheckPermission` | (inline method on open-prompt entries) | cli_inner_pretty.js:580714-580720 | function |
| `jt` | promptEventBus | cli_inner_pretty.js:(`.emit`) | object |
| `i9` | recheckQueueRef | cli_inner_pretty.js:(useRef) | variable |

---

## Module: Permissions — Settings Schema (Top-Level Keys)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (top-level schema key) | parentSettingsBehavior | cli_inner_pretty.js:50659-50666 | schema |
| (top-level schema key) | autoMode.allow | cli_inner_pretty.js:49995+ | schema |
| (top-level schema key) | autoMode.soft_deny | cli_inner_pretty.js:49998+ | schema |
| (top-level schema key) | autoMode.hard_deny | cli_inner_pretty.js:50004-50008 | schema |
| (top-level schema key) | autoMode.deny | cli_inner_pretty.js:(legacy alias) | schema |
| (top-level schema key) | autoMode.environment | cli_inner_pretty.js:(facts list) | schema |
| (top-level schema key) | skipAutoPermissionPrompt | cli_inner_pretty.js:49982 | schema |
| (top-level schema key) | useAutoModeDuringPlan | cli_inner_pretty.js:(checked in Rm8) | schema |
| (top-level schema key) | allowManagedHooksOnly | cli_inner_pretty.js:50547 | schema |
| (top-level schema key) | allowManagedMcpServersOnly | cli_inner_pretty.js:(near hooks key) | schema |
| (top-level schema key) | allowManagedPermissionRulesOnly | cli_inner_pretty.js:(near hooks key) | schema |
| (top-level schema key) | wslInheritsWindowsSettings | cli_inner_pretty.js:50427-50429 | schema |
| (top-level schema key) | cleanupPeriodDays | cli_inner_pretty.js:50403-50410 | schema |
| (top-level schema key) | additionalDirectories | cli_inner_pretty.js:50349 | schema |
| (top-level schema key) | permissions.defaultMode | cli_inner_pretty.js:(within permissions schema) | schema |
| (top-level schema key) | permissions.disableBypassPermissionsMode | cli_inner_pretty.js:(within permissions schema) | schema |
| (top-level schema key) | sandbox.bwrapPath | cli_inner_pretty.js:48374-48380 | schema |
| (top-level schema key) | sandbox.socatPath | cli_inner_pretty.js:48381-48388 | schema |
| (top-level schema key) | sandbox.network.deniedDomains | cli_inner_pretty.js:48259-48263 | schema |
| (top-level schema key) | sandbox.network.allowManagedDomainsOnly | cli_inner_pretty.js:48265-48269 | schema |
| (top-level schema key) | sandbox.filesystem.allowManagedReadPathsOnly | cli_inner_pretty.js:48334-48337 | schema |
| (top-level schema key) | sandbox.autoAllowBashIfSandboxed | cli_inner_pretty.js:48351 | schema |
| (top-level schema key) | sandbox.tlsTerminate | cli_inner_pretty.js:48298-48303 | schema |

---

## Notes on Naming

- **Cross-version names:** Many symbols overlap with [`symbol_additions_v2_1_142_sandbox.md`](./symbol_additions_v2_1_142_sandbox.md) (sandbox unit) — entries listed there with the same readable name should be considered authoritative. This file repeats them only for cross-document reference convenience; the sandbox file owns the definition for sandbox-specific symbols.
- **2.1.88 TypeScript baseline references:** The 2.1.88 source at `/lyz/codespace/3rd/claude-code/src/` is unobfuscated. Where the bundle's obfuscated name is unclear, we reference the TS file directly (`permissionRuleValueFromString`, `mcpInfoFromString`, etc.) — these are 1:1 with the bundle's equivalents.
- **`vUH` parser**: Used by the sandbox config builder (`KY$`) to extract domains from `WebFetch(domain:...)` rules. The same parser is used by the permission chain.
- **`v8` cached settings reader**: Used widely — every tier read goes through it. Has memoization that invalidates on file change.
- **No mapping table in module docs**: Per CLAUDE.md convention, module docs only reference symbol_index files. Mapping tables live here in `symbol_additions_*.md` or in the four `symbol_index_*.md` files.

---

## Cross-Document Index

Symbols above are referenced from:

| Document | Primary symbol focus |
|---|---|
| `architecture.md` | Core chain: `tD`, `UA5`, `TL$`, `eS6`, `g64`, `oiH`, `BA5`, `applyHookPermissionDecision` |
| `rule_grammar.md` | Parsers: `vUH`, `eu8`, `vwq`, `Hm8`, `WdK`, `N64`, `gz6`, `Qz6`, `yL` |
| `settings_tier_hierarchy.md` | Mergers: `MDq`, `Tm8`, `Gm8`, `uI9`, `wDq`, `Vm8`, `WPH`, `ot4`, `TMq` |
| `mode_lifecycle.md` | State: `zR6`, `rgK`, `Rv`, `eJH`, `tN`, `Uo`, `pe`, `aW` |
| `auto_mode_classifier.md` | Classifier: `jJ$`, `zT6`, `qT6`, `CF_`, `bF_`, `VF_`, `wJ$`, `WAH`, `dI9`, `pA5`, `uA5`, `xT` |
| `allow_deny_ask_precedence.md` | Order: `UA5` walk, `RQ`, `dw8`, `d64`, `F64`, source order |
| `sandbox_integration.md` | Sandbox interop: `KY$`, `pFK`, `EUH`, `iM`, `n6`, `v64`, `IX6`, `nUH`, plus from sandbox unit |

---

> **Note:** All Permissions architecture symbols above have been consolidated into [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) under the `Module: Permissions` (and overlapping `Module: Sandbox`) sections. This file is retained as the per-unit working notes for the architecture deep-dive pass; the canonical lookup is the platform index.
