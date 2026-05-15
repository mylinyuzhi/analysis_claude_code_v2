# Symbol Additions — v2.1.142 by_version 2.1.123–2.1.132

New (or re-confirmed) symbol mappings discovered while writing per-version analyses for v2.1.123 through v2.1.132. To be merged into the appropriate `symbol_index_*.md` file (Platform infrastructure for most of these — Auth/Permissions/Model/Telemetry/MCP — and Core features for `EnterWorktree` / Plan mode / Skills).

---

## Module: Auth (v2.1.123, v2.1.126, v2.1.129)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| RT | hasFirstPartyBetaAccess | cli_inner_pretty.js:128828-128830 | function |
| c$6 | isFirstPartyOrAwsOrFoundry | cli_inner_pretty.js:128824-128827 | function |
| aMK | filterBetasFor3p | cli_inner_pretty.js:128855-128858 | function |
| oMK | STABLE_BETAS | cli_inner_pretty.js:128925 | constant (Set) |
| Zh4 | hasLoggedStrippedTools | cli_inner_pretty.js:524143 | variable |
| xm5 | logStrippedToolFields | cli_inner_pretty.js:524142-524145 | function |
| op | OAUTH_SCOPE_USER_INFERENCE | cli_inner_pretty.js:40247 | constant |
| vU | hasClaudeAiScope | cli_inner_pretty.js:318244 | function |

---

## Module: LLM API / Beta header building (v2.1.123, v2.1.126)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| l$6 | buildBetaListForRequest | cli_inner_pretty.js:128888-128916 | function |
| Vu | buildBetaListNonBedrock | cli_inner_pretty.js:128917-128921 | function |
| n$6 | buildBetaListBedrockOnly | cli_inner_pretty.js:128922-128924 | function |
| Yl$ | clearBetaListCaches | cli_inner_pretty.js:128852-128854 | function |
| Al$ | isMidConversationSystemModel | cli_inner_pretty.js:128875-128887 | function |
| KWH | BETA_PROMPT_CACHING_2024_07_31 | (declared in adjacent betas block) | constant |
| PxH | BETA_INTERLEAVED_THINKING | (declared in adjacent betas block) | constant |
| EU | BETA_EXTENDED_OUTPUT_FORMAT | (declared in adjacent betas block) | constant |
| _WH | BETA_API_CONTEXT_MANAGEMENT | (declared in adjacent betas block) | constant |
| wa | BETA_TOOL_FORMAT | (declared in adjacent betas block) | constant |
| T4$ | BETA_VERTEX_TOOL_FORMAT | (declared in adjacent betas block) | constant |
| ZxH | BETA_FIRST_PARTY_EFFORT | (declared in adjacent betas block) | constant |
| LxH | BETA_FINE_GRAINED_TOOL_STREAMING | (declared in adjacent betas block) | constant |
| WxH | BETA_EFFORT_HEADER | (declared in adjacent betas block) | constant |
| V4$ | BETA_FOUNDRY_TOOL_FORMAT | (declared in adjacent betas block) | constant |
| cU$ | BETA_TASK_BUDGET | (declared near nm5) | constant |
| lM8 | buildToolSchemaForRequest | cli_inner_pretty.js:524086-524141 | function |
| ivH | isOneHourCacheEnabled | cli_inner_pretty.js:524779-524793 | function |
| Xi | buildCacheControlBlock | cli_inner_pretty.js:524776-524777 | function |

---

## Module: Permissions / Sandbox (v2.1.126)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `allowManagedDomainsOnly` (key) | (settings key — kept as-is) | cli_inner_pretty.js:48265, 52075 | settings field |
| `allowManagedReadPathsOnly` (key) | (settings key — kept as-is) | cli_inner_pretty.js:48334 | settings field |
| `dangerouslySkipPermissions` (key) | dangerouslySkipPermissions | cli_inner_pretty.js:198984 | option |
| zR6 | resolvePermissionMode | cli_inner_pretty.js:422449 | function |

---

## Module: MCP (v2.1.128, v2.1.129)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `workspace` (reserved name) | RESERVED_MCP_NAME_WORKSPACE | cli_inner_pretty.js (server-name registry) | constant |
| `deniedMcpServers` (key) | deniedMcpServers (settings) | cli_inner_pretty.js (settings schema) | settings field |
| `channelsEnabled` (key) | channelsEnabled (org policy) | cli_inner_pretty.js:50839-50851 | settings field |
| `skillOverrides` (key) | skillOverrides (settings) | cli_inner_pretty.js:50479, 476886-476895 | settings field |

---

## Module: Model selection (v2.1.126, v2.1.128, v2.1.129)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (anon, takes process.env) | isGatewayModelDiscoveryEnabled | cli_inner_pretty.js:433813 | function |
| vq | getProvider | cli_inner_pretty.js (referenced throughout) | function |
| k7 | getModelId | cli_inner_pretty.js (referenced throughout) | function |
| qq | isFirstPartyProvider | cli_inner_pretty.js (referenced throughout) | function |
| pY | isOAuthAuthenticated | cli_inner_pretty.js (referenced throughout) | function |

---

## Module: Channels feature (v2.1.128)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (anon at 394916) | isChannelsBlockedByOrgPolicy | cli_inner_pretty.js:394916-394938 | function |
| `--channels` (CLI flag) | channelsFlag | cli_inner_pretty.js:468650 | CLI option |
| lv$ | isDevelopmentChannelsEnabled | cli_inner_pretty.js:468650 | function |

---

## Module: Plugins (v2.1.128, v2.1.129)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Yo | getInlinePluginUrls | cli_inner_pretty.js:336845, 336963 | function |
| kv8 | fetchAndExtractPluginZips | cli_inner_pretty.js:605932 | function |
| (option) | `--plugin-url <url>` | cli_inner_pretty.js:606265-606266 | CLI option |
| (reader) | readPluginMonitors / readPluginThemes | cli_inner_pretty.js:229966, 230072 | inline helpers |

---

## Module: Renderer / Terminal (v2.1.129, v2.1.132)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (anon) | shouldForceSyncOutput | cli_inner_pretty.js:150074 | function |
| (anon) | shouldUseDefaultRenderer (disables alt-screen) | cli_inner_pretty.js:146489 | function |
| (anon) | enterAlternateScreenAction | cli_inner_pretty.js:166000 | function |
| (anon at 573972) | tuiFullscreenBannerCopy | cli_inner_pretty.js:573972 | constant string |

---

## Module: EnterWorktree (v2.1.128)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| kFH | TOOL_NAME_ENTER_WORKTREE | cli_inner_pretty.js:211570 | constant |
| (block at 384018) | enterWorktreeSubagentGuardError | cli_inner_pretty.js:384018 | string template |
| (block at 384065) | exitWorktreePromptBody | cli_inner_pretty.js:384065-384093 | string template |

---

## Module: ExitPlanMode (v2.1.132)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| kZ | TOOL_NAME_EXIT_PLAN_MODE | cli_inner_pretty.js:143086 | constant |
| NZ | TOOL_NAME_EXIT_PLAN_MODE_ALIAS | cli_inner_pretty.js:143087 | constant |
| (template at 277313) | permissionModeMismatchOnResumeMsg | cli_inner_pretty.js:277313 | string template |
| (template at 345236) | revisePlanPromptMessage | cli_inner_pretty.js:345236 | string template |

---

## Module: Signal handling (v2.1.132)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (entry at 44287) | SIGINT_DESCRIPTOR | cli_inner_pretty.js:44287 | object |
| qPH | TRAPPED_SIGNALS | cli_inner_pretty.js:44527 | array (constant) |
| O9 | gracefulShutdownSync | cli_inner_pretty.js:234461 | function |
| RK | gracefulShutdown | cli_inner_pretty.js:234462 | function |
| (handler at 234674) | sigintProcessHandler | cli_inner_pretty.js:234674 | function |
| #H (private field) | DEFAULT_SHUTDOWN_SIGNAL | cli_inner_pretty.js:44614 | constant |

---

## Module: Telemetry (v2.1.126, v2.1.129)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| M1 | emitOtelEvent | cli_inner_pretty.js:218525 | function |
| (string lit) | "skill_activated" | cli_inner_pretty.js:218525 | event name |
| (string lit) | "user-slash" / "claude-proactive" / "nested-skill" | cli_inner_pretty.js:352732, 352942, 353688 | invocation_trigger values |
| (string lit) | "claude_code.pull_request.count" | (metric path) | metric name |
| (string lit) | "claude_code.at_mention" | (introduced in 2.1.122; mentioned for completeness) | event name |

---

## Module: Bash tool / Subprocesses (v2.1.128, v2.1.132)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| v$ | getCurrentSessionId | cli_inner_pretty.js:361228, 430418 | function |
| nY8 | wrapWithShellPrefix | cli_inner_pretty.js:360918, 414305-414306, 520861 | function |
| W4 | shellEscapeArgs | cli_inner_pretty.js:414306, 336836 | function |
| CLAUDE_CODE_SESSION_ID | CLAUDE_CODE_SESSION_ID | cli_inner_pretty.js:528634 | env var name |

---

## Module: Image handling (v2.1.126)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (string at 200083) | imageDimensionLimitErrorMsg | cli_inner_pretty.js:200083-200084 | string |
| (string at 199843) | imageTooLargeErrorMsg | cli_inner_pretty.js:199843-199844 | string |

---

## Module: Stream idle (v2.1.126)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (Error subclass at 128477) | StreamIdleError | cli_inner_pretty.js:128477 | class |
| (string at 525818) | streamIdleNoChunksMsg | cli_inner_pretty.js:525818 | string |
| (string at 525891) | streamIdlePartialResponseMsg | cli_inner_pretty.js:525891-525892 | string |

---

## Module: Surrogate sanitation (v2.1.132)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ee1 | LONE_SURROGATE_REGEX | cli_inner_pretty.js:204136 | constant (RegExp) |

---

## Notes on integration

When merging into the canonical `symbol_index_*.md` files, route as follows:

| Category | Target file |
|----------|-------------|
| Auth, beta-header builder, LLM API tool-schema strip, prompt-cache | `symbol_index_infra_platform.md` (Auth section, LLM API section, Prompt section) |
| Permissions / Sandbox merge fields | `symbol_index_infra_platform.md` (Permissions / Sandbox section) |
| MCP `workspace` reservation, `deniedMcpServers`, `channelsEnabled` | `symbol_index_infra_platform.md` (MCP section) |
| Telemetry: `skill_activated`, `pull_request.count` | `symbol_index_infra_platform.md` (Telemetry section) |
| Model selection: gateway discovery, provider helpers | `symbol_index_infra_platform.md` (Model section) |
| `EnterWorktree`/`ExitPlanMode` tool name constants | `symbol_index_core_execution.md` (Tools section) |
| Plugins (`--plugin-url`, `experimental` namespace) | `symbol_index_infra_integration.md` (Plugin section) |
| Renderer / Terminal env gates (`CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN`, etc.) | `symbol_index_infra_integration.md` (UI section) |
| Signal handling | `symbol_index_infra_platform.md` (new Signals subsection — fits with CLI) |
| Bash tool / shell prefix | `symbol_index_core_execution.md` (Tools section, Bash subsection) |

The "Obfuscated" column uses identifiers from the 2.1.142 build (`cli_inner_pretty.js`). Where an identifier appears multiple times for the same symbol across builds (e.g. `RT` for `hasFirstPartyBetaAccess` is the 2.1.142 name; older builds used different letters), only the 2.1.142 name is listed — this file documents *what was discovered in 2.1.142's 2.1.123–2.1.132 source*, not the cross-version drift.
