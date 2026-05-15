# Symbol Additions — Unit 15 (by_version v2.1.133–v2.1.142)

This file lists new symbol mappings discovered while producing the `by_version/v2.1.133.md` through `by_version/v2.1.142.md` deobfuscation packs. It is the **non-canonical** companion to `symbol_index.md` files; symbols here are sourced from v2.1.142's `cli_inner_pretty.js`.

All entries cross-validated against the v2.1.142 bundle. Locations are `cli_inner_pretty.js:line`.

---

## Module: Fast Mode (v2.1.142)

| Obfuscated | Readable | v2.1.142 File:Line | Type |
|------------|----------|--------------------|------|
| `Cc` | `isOpus46FastModeOverride` | cli_inner_pretty.js:96905 | function |
| `Yu` | `fastModeModelLabel` | cli_inner_pretty.js:96908 | function |
| `VxH` | `fastModeModelId` | cli_inner_pretty.js:96911 | function |
| `Pi8` | `isFastModeActiveForModel` | cli_inner_pretty.js:96914 | function |
| `Uw` | `modelSupportsFastMode` | cli_inner_pretty.js:96922 | function |
| `Wi8` | `checkFastModeCooldown` | cli_inner_pretty.js:96929 | function |
| `TxH` | `fastModeStatusState` | cli_inner_pretty.js:96930 | variable |
| `dsq` | `fastModeStatusEventEmitter` | cli_inner_pretty.js:96931 | variable |
| `Xi8` | `fastModeReEnabledFlag` | cli_inner_pretty.js:96931 | variable |
| `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` | (env var) | cli_inner_pretty.js:96906 | env var |

---

## Module: Worktree Base Ref (v2.1.133)

| Obfuscated | Readable | v2.1.142 File:Line | Type |
|------------|----------|--------------------|------|
| `worktree.baseRef` | `worktreeBaseRefSetting` | cli_inner_pretty.js:50513-50518 | settings schema |
| (inline) | `branchFromRefDispatch` | cli_inner_pretty.js:522829 | inline logic |
| `m6` | `getAppConfig` | cli_inner_pretty.js:522829 (consumer) | function |

---

## Module: Sandbox Binaries (v2.1.133)

| Obfuscated | Readable | v2.1.142 File:Line | Type |
|------------|----------|--------------------|------|
| `sandbox.bwrapPath` | `sandboxBwrapPathSetting` | cli_inner_pretty.js:48374 | settings schema |
| `sandbox.socatPath` | `sandboxSocatPathSetting` | cli_inner_pretty.js:48381 | settings schema |
| `tz$` | `getBwrapPath` | cli_inner_pretty.js:198216 (used) | function |
| `MgK` | `getSocatPath` | cli_inner_pretty.js:198217 (used) | function |
| `tFK` | `validateSandboxBinaryPath` | cli_inner_pretty.js:196971-196976 | function |

---

## Module: Settings Policy (v2.1.133)

| Obfuscated | Readable | v2.1.142 File:Line | Type |
|------------|----------|--------------------|------|
| `parentSettingsBehavior` | `parentSettingsBehaviorSetting` | cli_inner_pretty.js:50659-50666 | settings schema |
| (inline at 52044) | `parentSettingsMergePredicate` | cli_inner_pretty.js:52044 | inline logic |

---

## Module: Hook Effort (v2.1.133)

| Obfuscated | Readable | v2.1.142 File:Line | Type |
|------------|----------|--------------------|------|
| `effort.level` | `hookEffortLevelField` | cli_inner_pretty.js:237710 | hook JSON schema |
| `aT` | `getActiveEffortString` | cli_inner_pretty.js:399003, 406269, 419635 | function |
| `getEffortValue` | `getEffortValue` | cli_inner_pretty.js:399003, 419635 | method |
| `CLAUDE_EFFORT` | (env var) | cli_inner_pretty.js:399003, 419635 | env var |

---

## Module: ECOMPROMISED (v2.1.133)

| Obfuscated | Readable | v2.1.142 File:Line | Type |
|------------|----------|--------------------|------|
| `gi8` | `markLockCompromisedAndRetry` | cli_inner_pretty.js:99111, 99125 | function |
| `ECOMPROMISED` | (error code) | cli_inner_pretty.js:99111-99125 | error code constant |

---

## Module: AutoMode Hard Deny (v2.1.136)

| Obfuscated | Readable | v2.1.142 File:Line | Type |
|------------|----------|--------------------|------|
| `autoMode.hard_deny` | `autoModeHardDenyRules` | cli_inner_pretty.js:50004 | settings schema |
| `eA8` | `getBuiltinAutoModePromptSection` | cli_inner_pretty.js:337724 | function |
| `wJ$` | `mergeAutoModeHardDeny` | cli_inner_pretty.js:337734 | function |
| `$z8` | `autoModeHardDenyMergePart` | cli_inner_pretty.js:337957 | function |
| `<user_hard_deny_rules_to_replace>` | (template token) | cli_inner_pretty.js:337644, 337754, 337956 | template token |

---

## Module: Feedback Survey OTel (v2.1.136)

| Obfuscated | Readable | v2.1.142 File:Line | Type |
|------------|----------|--------------------|------|
| `CLAUDE_CODE_ENABLE_FEEDBACK_SURVEY_FOR_OTEL` | (env var) | cli_inner_pretty.js:136668 | env var |

---

## Module: `claude agents` / Agent View (v2.1.139)

| Obfuscated | Readable | v2.1.142 File:Line | Type |
|------------|----------|--------------------|------|
| `S8` | `pluralizeTask` | cli_inner_pretty.js:431077 | function |
| `IfH` | `setSessionTerminalTitle` | cli_inner_pretty.js:567194 | function |
| `JN4` | `agentsCommandTitle` | cli_inner_pretty.js:569095 | string constant |
| `_j8` | `formatExitMessage` | cli_inner_pretty.js:569095 | function |
| `disableAgentView` | `disableAgentViewSetting` | cli_inner_pretty.js:50523-50528 | settings schema |
| `CLAUDE_CODE_DISABLE_AGENT_VIEW` | (env var) | cli_inner_pretty.js:50527 | env var |

---

## Module: /goal (v2.1.139)

| Obfuscated | Readable | v2.1.142 File:Line | Type |
|------------|----------|--------------------|------|
| (inline) | `goalStopHookActivationReason` | cli_inner_pretty.js:486759 | string template |
| `ov5` | `goalUntrustedWorkspaceError` | cli_inner_pretty.js:486760 | string constant |
| (inline) | `goalHooksDisabledError` | cli_inner_pretty.js:486762 | string constant |
| `JmH` | `isGoalUsageHint` | cli_inner_pretty.js:574080 | function |

---

## Module: Hook args[] + continueOnBlock + CLAUDE_PROJECT_DIR (v2.1.139)

| Obfuscated | Readable | v2.1.142 File:Line | Type |
|------------|----------|--------------------|------|
| (inline) | `hookExecFormSchema` | cli_inner_pretty.js:48371 | schema |
| (inline) | `hookArgsField` | cli_inner_pretty.js:48885 | schema |
| (inline) | `hookContinueOnBlockField` | cli_inner_pretty.js:48783-48788 | schema |
| `R9` | `getProjectDir` | cli_inner_pretty.js:228571, 414308 | function |
| `CLAUDE_PROJECT_DIR` | (env var) | cli_inner_pretty.js:228571, 414308 | env var |

---

## Module: API Headers — Subagent Tracing (v2.1.139)

| Obfuscated | Readable | v2.1.142 File:Line | Type |
|------------|----------|--------------------|------|
| (inline) | `subagentTracingHeaders` | cli_inner_pretty.js:128061-128062 | header injection |
| `x-claude-code-agent-id` | (HTTP header) | cli_inner_pretty.js:128061 | HTTP header |
| `x-claude-code-parent-agent-id` | (HTTP header) | cli_inner_pretty.js:128062 | HTTP header |

---

## Module: Settings Hot-Reload (v2.1.140)

| Obfuscated | Readable | v2.1.142 File:Line | Type |
|------------|----------|--------------------|------|
| (where.exe spawn) | `findExeWindowsPath` | cli_inner_pretty.js:42778 | function |

---

## Module: Plugin Marketplaces (v2.1.140)

| Obfuscated | Readable | v2.1.142 File:Line | Type |
|------------|----------|--------------------|------|
| `extraKnownMarketplaces` | `extraKnownMarketplacesSetting` | cli_inner_pretty.js:50625 | settings schema |
| `sE` | `pathPosix` | cli_inner_pretty.js:228733 | module alias |
| (path) | `knownMarketplacesJsonPath` | cli_inner_pretty.js:228733 | path helper |

---

## Module: Hook terminalSequence (v2.1.141)

| Obfuscated | Readable | v2.1.142 File:Line | Type |
|------------|----------|--------------------|------|
| (inline at 238108) | `terminalSequenceHookField` | cli_inner_pretty.js:238108 | schema |
| `Lm6` | `parseAndValidateTerminalSequence` | cli_inner_pretty.js:520642 | function |
| `Pm6` | `applyTerminalSequence` | cli_inner_pretty.js:522072 | function |

---

## Module: ANTHROPIC_WORKSPACE_ID (v2.1.141)

| Obfuscated | Readable | v2.1.142 File:Line | Type |
|------------|----------|--------------------|------|
| `wO` | `readEnvVar` | cli_inner_pretty.js:4167 | function |
| `LWH` | `readEnvVarOptional` | cli_inner_pretty.js:99805 | function |
| `ANTHROPIC_WORKSPACE_ID` | (env var) | cli_inner_pretty.js:4167, 91330, 99805 | env var |

---

## Module: Plugin Prefer HTTPS (v2.1.141)

| Obfuscated | Readable | v2.1.142 File:Line | Type |
|------------|----------|--------------------|------|
| `CLAUDE_CODE_PLUGIN_PREFER_HTTPS` | (env var) | cli_inner_pretty.js:228651, 229761 | env var |
| `bH` | `parseExplicitTrue` | cli_inner_pretty.js:228651, 229761 | function |

---

## Module: MCP Remote Timeout (v2.1.142)

| Obfuscated | Readable | v2.1.142 File:Line | Type |
|------------|----------|--------------------|------|
| `r15` | `getRemoteMcpToolTimeout` | cli_inner_pretty.js:413221-413223 | function |
| `i15` | `MCP_REMOTE_TIMEOUT_DEFAULT` | cli_inner_pretty.js:413223 | constant |
| `B$4` | `MCP_REMOTE_TIMEOUT_MAX` | cli_inner_pretty.js:413223 | constant |
| `MCP_TOOL_TIMEOUT` | (env var) | cli_inner_pretty.js:413222 | env var |

---

## Module: Root SKILL.md Plugin (v2.1.142)

| Obfuscated | Readable | v2.1.142 File:Line | Type |
|------------|----------|--------------------|------|
| `H_` | `fileExists` | cli_inner_pretty.js:230212 | function |
| (inline) | `detectRootSkillMd` | cli_inner_pretty.js:230212 | inline logic |

---

## Module: Prompt/Agent Hook Type Errors (v2.1.142)

| Obfuscated | Readable | v2.1.142 File:Line | Type |
|------------|----------|--------------------|------|
| `Ey4` | `executePromptTypeHook` | cli_inner_pretty.js:521495 | function |
| `hy4` | `executeAgentTypeHook` | cli_inner_pretty.js:521518 | function |
| (error msg) | `promptHookUnsupportedEvents` | cli_inner_pretty.js:521484 | error template |
| (error msg) | `agentHookUnsupportedEvents` | cli_inner_pretty.js:521507 | error template |
| `jW8` | `internalAgentIdPrefix` | cli_inner_pretty.js:521486, 521509 | constant |

---

## Module: MCP Needs Auth Cache (v2.1.141)

| Obfuscated | Readable | v2.1.142 File:Line | Type |
|------------|----------|--------------------|------|
| `Nw8` | `getMcpNeedsAuthCachePath` | cli_inner_pretty.js:413226 | function |
| `wS6` | `loadMcpNeedsAuthCache` | cli_inner_pretty.js:413228 | function |
| `prH` | `mcpNeedsAuthCacheState` | cli_inner_pretty.js:413229 | variable |
| `e15` | `isMcpNeedsAuthRecent` | cli_inner_pretty.js:413236 | function |
| `s15` | `MCP_NEEDS_AUTH_TTL_DEFAULT` | cli_inner_pretty.js:413240 | constant |
| `t15` | `MCP_NEEDS_AUTH_TTL_PROXY` | cli_inner_pretty.js:413240 | constant |
| `H_5` | `recordMcpNeedsAuth` | cli_inner_pretty.js:413243 | function |
| `p$4` | `clearMcpNeedsAuth` | cli_inner_pretty.js:413254 | function |
| `vw8` | `mcpNeedsAuthWriteChain` | cli_inner_pretty.js:413244 | variable |
| `kw8` | `pathModule` | cli_inner_pretty.js:413226 | module alias |

---

## Module: Various Auth Constants

| Obfuscated | Readable | v2.1.142 File:Line | Type |
|------------|----------|--------------------|------|
| `forceRemoteSettingsRefresh` | `forceRemoteSettingsRefreshSetting` | cli_inner_pretty.js:50673 | settings schema |
| `forceLoginMethod` | `forceLoginMethodSetting` | cli_inner_pretty.js:50655 | settings schema |
| `forceLoginOrgUUID` | `forceLoginOrgUUIDSetting` | cli_inner_pretty.js:50667 | settings schema |
| `disableAllHooks` | `disableAllHooksSetting` | cli_inner_pretty.js:50522 | settings schema |
| `disableRemoteControl` | `disableRemoteControlSetting` | cli_inner_pretty.js:50529 | settings schema |
| `allowManagedHooksOnly` | `allowManagedHooksOnlySetting` | cli_inner_pretty.js:50547 | settings schema |

---

## Notes

- All readable names follow the analysis_claude_code_v2 convention (camelCase function/variable, PascalCase class/type, ALL_CAPS constants).
- Where the original is already a meaningful name (`disableAllHooks`, `extraKnownMarketplaces`), the "Readable" column uses the suffixed `Setting`/`Field` form for the *schema* and the unsuffixed form for the actual setting key.
- Inline expressions without distinct function bindings are noted as `(inline)` in the obfuscated column.
- This file is the unit-15 contribution; per CLAUDE.md, it is **not** merged into the canonical `00_overview/symbol_index_*.md` files automatically.
