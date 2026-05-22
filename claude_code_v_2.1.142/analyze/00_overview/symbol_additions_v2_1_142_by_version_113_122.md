# Symbol Additions — v2.1.142 by_version 2.1.113–2.1.122

> Symbol mappings:
> - [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](./symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](./symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](./symbol_index_infra_integration.md) - Integrations

Obfuscated → readable mappings discovered while analyzing changes across v2.1.113–v2.1.122. All locations are in `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` unless noted.

---

## Module: Sandbox (Network deniedDomains, dangerouslyDisableSandbox)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| e9 | sandboxConfig | cli_inner_pretty.js:196348 | variable |
| hA6 | matchesDomain | cli_inner_pretty.js:196348 | function |
| e6 | logDeny | cli_inner_pretty.js:196348 | function |
| F8 | zod | cli_inner_pretty.js:196846 | object |
| SA6 | domainPatternSchema | cli_inner_pretty.js:196846 | object |
| bV | shouldUseSandbox | cli_inner_pretty.js:419534-419543 | function |

---

## Module: Bash Permissions (Find dangerous, Exec wrappers)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| gz6 | FIND_DANGEROUS_OPERATORS | cli_inner_pretty.js:205646 | constant |
| Uh6 | EXEC_WRAPPERS | cli_inner_pretty.js:403959 | constant |
| XP$ | SHELL_WRAPPERS | cli_inner_pretty.js:403959 | constant |

---

## Module: Effort (CLAUDE_EFFORT placeholder, downgrade)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| aT | resolveEffort | cli_inner_pretty.js:399003 | function |

---

## Module: Thinking Spinner

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| oB_ | thinkingSpinnerLabel | cli_inner_pretty.js:328461-328466 | function |
| rB_ | THINKING_ALMOST_DONE_MS | cli_inner_pretty.js:328462 | constant |
| iB_ | THINKING_SOME_MORE_MS | cli_inner_pretty.js:328463 | constant |
| nB_ | THINKING_MORE_MS | cli_inner_pretty.js:328464 | constant |
| lB_ | THINKING_STILL_MS | cli_inner_pretty.js:328465 | constant |
| wy7 | thinkingProgressPercent | cli_inner_pretty.js:328456-328459 | function |

---

## Module: Fork Subagent

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ilK | FORK_SUBAGENT_TYPE | cli_inner_pretty.js:211730 | constant |
| I$_ | FORK_SUBAGENT_TELEMETRY_KEY | cli_inner_pretty.js:211795 | constant |
| D7 | AGENT_TOOL_NAME | cli_inner_pretty.js:235653 | constant |

---

## Module: Cleanup Sweep (Retention Periods)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Rr | cleanupSweepDir | cli_inner_pretty.js:555526 | function |
| vX$ | nodePath | cli_inner_pretty.js:360709 | object |
| b8 | getConfigDir | cli_inner_pretty.js:360709 | function |
| Oq | getCurrentSettings | cli_inner_pretty.js:198253, 555246 | function |
| v8 | getSettingsBySource | cli_inner_pretty.js:555234 | function |
| Cm8 | hasExplicitSettingsValue | cli_inner_pretty.js:555236 | function |
| ml5 | DEFAULT_CLEANUP_PERIOD_DAYS | cli_inner_pretty.js:555246 | constant |

---

## Module: OTEL (Command attributes, finish_reasons, at_mention)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| M1 | emitOtelLogEvent | cli_inner_pretty.js:218483 | function |
| bH | parseBoolean | cli_inner_pretty.js:131, 140500 | function |

---

## Module: MCP (alwaysLoad, retry, redirectUri, output_config)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Gc9 | REDIRECT_URI_KEY | cli_inner_pretty.js:72499 | constant |
| Chq | REDIRECT_URI_KEY_ALT | cli_inner_pretty.js:75996 | constant |
| lWH | redirectUriEmptyCode | cli_inner_pretty.js:107876 | constant |
| pa | clientIdParamKey | cli_inner_pretty.js:111853 | constant |
| gu8 | sdkMcpServerSchema | cli_inner_pretty.js:48952 | object |
| ly$ | mcpResourcesTemplatesListReq | cli_inner_pretty.js:24702 | object |
| u8$ | mcpRequestBase | cli_inner_pretty.js:24702 | object |
| F8$ | mcpResourcesTemplatesListResponseSchema | cli_inner_pretty.js:208428 | object |
| aHH | mcpRequestTimeout | cli_inner_pretty.js:414961 | function |

---

## Module: PowerShell (Permissions, native shell)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $q4 | isDangerousPowerShellPermission | cli_inner_pretty.js:422162 | function |
| _q4 | findOverlyBroadPowerShellPermissions | cli_inner_pretty.js:422173 | function |

---

## Module: Plugins (prune, blockedMarketplaces, range-conflict)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| tp5 | pluginPruneHandlerImpl | cli_inner_pretty.js:533306 | function |
| Fp5 | pluginTagHandlerImpl | cli_inner_pretty.js:533305 | function |
| Af4 | PLUGIN_TAG_USAGE | cli_inner_pretty.js:460543 | constant |
| S8 | pluralize | cli_inner_pretty.js:218923 | function |
| Hd | pluralizeUnit | cli_inner_pretty.js:491565 | function |

---

## Module: Themes (custom themes, plugin themes)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| IBH | ThemeContext | cli_inner_pretty.js:146766 | object |
| HfH | useThemeContext | cli_inner_pretty.js:433546, 481438 | function |

---

## Module: Auto mode ($defaults sentinel)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| llH | AUTO_MODE_DEFAULTS_SENTINEL | cli_inner_pretty.js:338615 | constant |
| mR$ | autoModeRulesByCategory | cli_inner_pretty.js:49969 | object |
| tN | ALL_PERMISSION_MODES | cli_inner_pretty.js:50022 | constant |
| Uo | EXCLUDED_PERMISSION_MODES | cli_inner_pretty.js:50022 | constant |

---

## Module: Advisor Tool

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| lU$ | ADVISOR_TOOL_BETA_HEADER | cli_inner_pretty.js:96814 | constant |
| pJ | createBetaHeader | cli_inner_pretty.js:96814 | function |
| m6 | getMainLoopOptions | cli_inner_pretty.js:234327 | function |

---

## Module: Embedded native binaries (bfs, ugrep)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Iv6 | createCommandShadow | cli_inner_pretty.js:360521 | function |

---

## Module: Settings (prUrlTemplate, hide-cwd, persistence)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| DM | getCurrentSettings | cli_inner_pretty.js:347884 | function |
| RP | permissionModeSchema | cli_inner_pretty.js:198730 | function |
| _QH | settingsDestinationSchema | cli_inner_pretty.js:237619 | function |
| PQH | settingsDestinationSchemaAlt | cli_inner_pretty.js:240526 | function |

---

## Module: Resume (PR URL search, large-file load)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TX | getAuthCredentials | cli_inner_pretty.js:444 (referenced by /ultrareview preflight) | function |
| Z1 | httpClient | cli_inner_pretty.js:445 | object |
| bA | bearerAuthHeaders | cli_inner_pretty.js:446 | function |
| r7 | getApiConfig | cli_inner_pretty.js:445 | function |
| wlK | ultrareviewPreflightSchema | cli_inner_pretty.js:447 | function |
| ulK | ultrareviewCommandDef | cli_inner_pretty.js:474830 | object |
| u1 | apiClient | cli_inner_pretty.js:474775 | object |

---

## Module: Voice + Keybindings

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| tJ | getKeyBinding | cli_inner_pretty.js:507537 | function |
| w1 | getKeyBindingAlt | cli_inner_pretty.js:550981 | function |

---

## Module: Hook Duration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| c_H | getMetricsRecorder | cli_inner_pretty.js:388085, 521369 | function |
| mE6 | HOOK_SLOW_THRESHOLD_MS | cli_inner_pretty.js:388130 | constant |
| n77 | onHookCaptured | cli_inner_pretty.js:530763 | function |
| mD6 | maybeRecordHookSetup | cli_inner_pretty.js:530763 | function |
| Z8 | recordTelemetry | cli_inner_pretty.js:530763 | function |
| I6 | isRemoteWorkspace (= `U$.caps.workspace === "remote"`; declared at cli_inner_pretty.js:3104; usage site at 530763) | cli_inner_pretty.js:3104-3106 | function |

---

## Module: Subprocess env (AI_AGENT)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| CT8 | formatAgentIdentifier | cli_inner_pretty.js:135, 361227 | function |

---

## Module: Slash Commands

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| UU_ | REMOTE_AGENT_COMMAND_NAMES | cli_inner_pretty.js:335940 | constant |

---

## Module: Renderer (scrollback, scroll codes)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Tf | csiBuilderAlt | cli_inner_pretty.js:221405 | object |
| vf | csiBuilder | cli_inner_pretty.js:221719 | object |
| tM | csiPrefixAlt | cli_inner_pretty.js:221405 | constant |
| eM | csiPrefix | cli_inner_pretty.js:221719 | constant |

---

## Module: ANSI / Box drawing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| jq | colorize | cli_inner_pretty.js:174378 | function |
| I4 | newline | cli_inner_pretty.js:174378 | constant |
| Y$ | textStyle | cli_inner_pretty.js:174506 | object |
| jz$ | scrollSensitivityValue | cli_inner_pretty.js:174506 | constant |
| $C | settingsPathFormatter | cli_inner_pretty.js:174506 | function |

---

## Module: /resume loader

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $6 | getCurrentDirectory | cli_inner_pretty.js:516845 | function |

---

## Module: Bedrock service tier

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Bedrock service tier header constant | "X-Amzn-Bedrock-Service-Tier" | cli_inner_pretty.js:89274 | constant |

---

## Module: Plugins — themes-dir / skills-dir sentinels

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (skills-dir sentinel string) | SKILLS_DIR_SOURCE_SENTINEL | cli_inner_pretty.js:49647 | constant |

---

## Notes

1. Many of the obfuscated symbols above are 2-3 character forms (e.g. `bH`, `M1`, `Oq`) that recur in many places — the location given is one representative use; other uses follow the same semantics.
2. The Bedrock service tier header is defined multiple times as part of separate action specs (chunks 88786-89343) — each AWS API method needs to know about the header explicitly.
3. The `output_config` flow (v2.1.122 §9) is the most-impactful per-user fix in this window: it touches `5740, 6663-6668, 525270-525326`. Three separate filter points work together to ensure the field doesn't reach a model that rejects it.

---

## Cross-references with existing symbol indices

Verified existing mappings used in by_version files (already documented in symbol_index_*.md):
- `aR$` (assertObjectShape) — used at 52074 for `deniedDomains` extraction
- `H8` (getAppConfig) — used widely, includes `agentPushNotifEnabled` / `unpinOpus47LaunchEffort` checks
- `lq` (isFullscreenMode) — referenced across `/focus`, `/usage`, scroll snap fixes
- `o5` (resolveModelId) — used in effort downgrades and model checks
- `MA` (registerSkill) — used by `/less-permission-prompts`
- `d` (logEvent) — used in many telemetry call sites
- `P7` (saveSettings) — used by `/tui` and other persistence paths
- `er8` (relaunchSession) — used by `/tui` and provider setup wizards
- `bH` (parseBoolean) — used widely for env var parsing (DISABLE_UPDATES, CLAUDE_CODE_*, etc.)

These are reused in v2.1.113-122 paths without semantic changes.

---

**Status**: Consolidated into symbol_index_core_features.md as of v2.1.142 deobfuscation work. (Core-feature portions — effort, hook duration, thinking spinner — routed to core_features; remaining sandbox/MCP/auth/plugins/themes portions are routed to the sibling indexes.)
