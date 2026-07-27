# Symbol additions — v2.1.220 MCP (`39_mcp/`)

Produced by the `39_mcp` module pass over the `2.1.195 → 2.1.220` window.
All `File:Line` values are **`cli_inner_pretty.js` lines in the 2.1.220 bundle**
(`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`,
`build_sha 4073f595`) that were read during the pass. Line numbers are valid **only** for this build.

> **Merge target for EVERY group below: [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md)**
> (MCP is a platform-infrastructure theme per `_CONVENTIONS.md` §6). Two rows are flagged inline as
> cross-cutting with `44_telemetry` / `51_headless_sdk`; they still belong in the platform index.

> **Duplication warning:** the 2.1.220 bundle ships **two** MCP client runtime trees, `v2` at
> `~292800-297500` and `v1` (the default) at `~298300-302400`. Rows below cite the **v2** occurrence unless
> the symbol lives in the shared single-copy region (`~26xxxx`-`~28xxxx`). See
> [`../39_mcp/dual_mcp_runtime_trees.md`](../39_mcp/dual_mcp_runtime_trees.md).

---

## Module: MCP Runtime Generations

Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aTy` | MCP_TREE_ID_V1 | cli_inner_pretty.js:300019 | constant |
| `B0y` | getMcpIsListAuthErrorModule | cli_inner_pretty.js:302464 | function |
| `Cgo` | MCP_SDK_GENERATION_MEMO | cli_inner_pretty.js:262865 | variable |
| `F0y` | getMcpDirectoryReadModule | cli_inner_pretty.js:302460 | function |
| `j0y` | getMcpSkillsListModule | cli_inner_pretty.js:302472 | function |
| `M0y` | getMcpAuthModule | cli_inner_pretty.js:302444 | function |
| `N0y` | getMcpSdkErrorClassificationModule | cli_inner_pretty.js:302456 | function |
| `o9` | getMcpSdkGeneration | cli_inner_pretty.js:262846 | function |
| `O0y` | getMcpElicitationHandlerModule | cli_inner_pretty.js:302448 | function |
| `P0y` | getMcpClientModule | cli_inner_pretty.js:302428 | function |
| `U0y` | getMcpXaaIdpLoginModule | cli_inner_pretty.js:302468 | function |
| `xAy` | MCP_TREE_ID_V2 | cli_inner_pretty.js:294477 | constant |
| `$0y` | getMcpTaskWatcherModule | cli_inner_pretty.js:302452 | function |

---

## Module: MCP Auto-Backgrounding

Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bEy` | AUTO_BACKGROUND_EXCLUDED_TRANSPORTS | cli_inner_pretty.js:288986 | constant |
| `EEy` | callMcpToolWithAutoBackground | cli_inner_pretty.js:288862 | function |
| `gEy` | MCP_ERROR_CLASS_NAMES | cli_inner_pretty.js:288840 | constant |
| `G9u` | createMcpTaskDescriptor | cli_inner_pretty.js:288810 | function |
| `IEs` | getMcpTaskWatcher | cli_inner_pretty.js:288851 | function |
| `LE` | isBackgroundTasksDisabled | cli_inner_pretty.js:230330 | function |
| `nBe` | NULL_TASK_REGISTRY | cli_inner_pretty.js:284586 | object |
| `q9u` | isToolLevelError | cli_inner_pretty.js:288827 | function |
| `REs` | MCP_AUTO_BACKGROUND_MODULE | cli_inner_pretty.js:288849 | object |
| `SEy` | getMcpAutoBackgroundMs | cli_inner_pretty.js:288854 | function |
| `v9r` | linkAbortSignal | cli_inner_pretty.js:165505 | function |
| `vr` | sleep | cli_inner_pretty.js:20457 | function |
| `yEy` | DEFAULT_MCP_AUTO_BACKGROUND_MS (120000) | cli_inner_pretty.js:288970 | constant |
| `yue` | getPermissionPromptToolName | cli_inner_pretty.js:3307 | function |
| `_Ey` | MAX_MCP_AUTO_BACKGROUND_MS (2147483647) | cli_inner_pretty.js:288971 | constant |

---

## Module: MCP Timeouts

Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AAy` | STDIO_IDLE_TIMEOUT_MS (1800000) | cli_inner_pretty.js:294473 | constant |
| `CKu` | DEFAULT_MCP_REQUEST_TIMEOUT_MS (60000) | cli_inner_pretty.js:294488 | constant |
| `dHh` | MAX_FOLDED_REQUEST_TIMEOUT_MS (300000) | cli_inner_pretty.js:58768 | constant |
| `Dvs` | reportSubSecondTimeout | cli_inner_pretty.js:292940 | function |
| `EAy` | resetSubSecondTimeoutProbe | cli_inner_pretty.js:292948 | function |
| `l7u` | getMcpToolIdleTimeoutMs (v1 twin) | cli_inner_pretty.js:298499 | function |
| `MKu` | getMcpToolIdleTimeoutMs | cli_inner_pretty.js:292957 | function |
| `MN` | getMcpConnectTimeoutMs | cli_inner_pretty.js:285811 | function |
| `Nvs` | getMcpRequestTimeoutMs | cli_inner_pretty.js:293353 | function |
| `PKu` | MAX_MCP_TIMEOUT_MS (2147483647) | cli_inner_pretty.js:294468 | constant |
| `Pvs` | getMcpToolTimeoutMs | cli_inner_pretty.js:292951 | function |
| `Ten` | withRequestTimeout | cli_inner_pretty.js:293357 | function |
| `vAy` | REMOTE_IDLE_TIMEOUT_MS (300000) | cli_inner_pretty.js:294472 | constant |
| `wAy` | IDLE_EXEMPT_TRANSPORTS | cli_inner_pretty.js:294628 | constant |
| `X5n` | foldRequestTimeoutIntoTimeout | cli_inner_pretty.js:58729 | function |
| `yWl` | REQUEST_TIMEOUT_MS_SCHEMA | cli_inner_pretty.js:58766 | function |
| `_Ay` | DEFAULT_MCP_TOOL_TIMEOUT_MS (1e8) | cli_inner_pretty.js:294467 | constant |

---

## Module: MCP OAuth

Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `E9u` | pickCuratedScope | cli_inner_pretty.js:288174 | function |
| `mEs` | readMcpOAuthClientConfig | cli_inner_pretty.js:288169 | function |
| `RAy` | MCP_AUTH_ERROR_SEVERITY | cli_inner_pretty.js:294630 | object |
| `v9u` | ensureOfflineAccessScope | cli_inner_pretty.js:288180 | function |
| `wKu` | classifyMcpAuthFailure | cli_inner_pretty.js:293071 | function |
| `XSy` | clearMcpOAuthClientSecret | cli_inner_pretty.js:288161 | function |
| `YSy` | storeMcpOAuthClientSecret | cli_inner_pretty.js:288150 | function |

---

## Module: MCP Config Validation and Diagnostics

Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `avp` | formatMcpListRow | cli_inner_pretty.js:567503 | function |
| `bSp` | SELF_DESCRIBING_ERROR_CODES | cli_inner_pretty.js:563887 | constant |
| `ESp` | formatMcpFailureDetail | cli_inner_pretty.js:563845 | function |
| `f9` | sanitizeForPrompt | cli_inner_pretty.js:284228 | function |
| `gEe` | sanitizeAndTruncate | cli_inner_pretty.js:284239 | function |
| `hvp` | PENDING_APPROVAL_STATUS | cli_inner_pretty.js:567837 | constant |
| `Ilr` | validateMcpServersObject | cli_inner_pretty.js:282575 | function |
| `iX_` | mcpListHandler | cli_inner_pretty.js:567539 | function |
| `K8u` | redactSecrets | cli_inner_pretty.js:284244 | function |
| `Kee` | isUnconfiguredFailure | cli_inner_pretty.js:284263 | function |
| `KMt` | setMcpServerEnabled | cli_inner_pretty.js:282790 | function |
| `L_o` | formatFailedMcpServer | cli_inner_pretty.js:284255 | function |
| `ltf` | buildMcpStatusLine | cli_inner_pretty.js:665978 | function |
| `m$_` | formatDroppedTool | cli_inner_pretty.js:514667 | function |
| `MHe` | connectToServer | cli_inner_pretty.js:294652 | function |
| `MZr` | POLICY_BLOCK_MESSAGE_MANAGED | cli_inner_pretty.js:284284 | constant |
| `NLo` | buildDroppedToolsAttachment | cli_inner_pretty.js:517023 | function |
| `Nw` | isMcpServerDisabled | cli_inner_pretty.js:282781 | function |
| `OHe` | connectToServer (v1 twin) | cli_inner_pretty.js:300194 | function |
| `OZr` | buildFailedMcpServersAttachment | cli_inner_pretty.js:284266 | function |
| `pvp` | checkMcpServerHealth | cli_inner_pretty.js:567357 | function |
| `q8u` | PROMPT_TEXT_MAX_CHARS (200) | cli_inner_pretty.js:284281 | constant |
| `qlr` | isPolicyBlockedError | cli_inner_pretty.js:284260 | function |
| `Rlr` | readMcpConfigFile | cli_inner_pretty.js:282682 | function |
| `R_o` | SANITIZER_PRECUT_CHARS (2000) | cli_inner_pretty.js:284283 | constant |
| `sD` | MAX_ANNOUNCED_MCP_ENTRIES (30) | cli_inner_pretty.js:442072 | constant |
| `SSp` | humanizeErrorCode | cli_inner_pretty.js:563841 | function |
| `sX_` | mcpGetHandler | cli_inner_pretty.js:567580 | function |
| `tAr` | buildInitEvent *(shared with `51_headless_sdk`)* | cli_inner_pretty.js:593588 | function |
| `tX_` | formatToolsListError | cli_inner_pretty.js:567346 | function |
| `tYu` | isDropInvalidToolSchemasEnabled | cli_inner_pretty.js:293415 | function |
| `V8u` | TERMINAL_TEXT_MAX_CHARS (500) | cli_inner_pretty.js:284282 | constant |
| `VYr` | isFailedMcpSurfacingEnabled *(gate `tengu_surface_failed_mcp_servers`, default off)* | cli_inner_pretty.js:217470 | function |
| `wSs` | POLICY_BLOCK_MESSAGE_CONNECTORS | cli_inner_pretty.js:284285 | constant |
| `x_y` | POLICY_BLOCK_MESSAGES | cli_inner_pretty.js:284290 | constant |
| `Xyy` | collectWhitespaceIssues | cli_inner_pretty.js:282555 | function |
| `Yar` | isUnconfiguredServer | cli_inner_pretty.js:266811 | function |
| `y_o` | coerceToArray | cli_inner_pretty.js:282778 | function |

---

## Module: MCP Roots

Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `adt` | getAdditionalWorkingDirectories | cli_inner_pretty.js:284573 | function |
| `BAy` | STAGING_ROOT_PLUGINS | cli_inner_pretty.js:294641 | constant |
| `Clr` | getClientCapabilities | cli_inner_pretty.js:281497 | function |
| `eYu` | isSchemaNormalizeEnabledFor | cli_inner_pretty.js:293412 | function |
| `nYu` | shouldIncludeStagingRoot | cli_inner_pretty.js:293435 | function |
| `orr` | ensurePluginToolStagingDir | cli_inner_pretty.js:166520 | function |
| `O_o` | updateAdditionalWorkingDirsSnapshot | cli_inner_pretty.js:284576 | function |
| `rYu` | getRootsListResponse | cli_inner_pretty.js:293418 | function |
| `UAy` | notifyMcpRootsListChanged | cli_inner_pretty.js:293444 | function |
| `Ubo` | CONNECTED_MCP_CLIENTS | cli_inner_pretty.js:294642 | variable |
| `xSs` | ADDITIONAL_WORKING_DIRS_SNAPSHOT | cli_inner_pretty.js:284582 | variable |

---

## Module: MCP Managed Policy

Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AMt` | expandSettingsEnvBlock | cli_inner_pretty.js:267780 | function |
| `Byy` | SCHEME_POSITION_DELIMITERS | cli_inner_pretty.js:282870 | constant |
| `c_o` | parseUrlLoose | cli_inner_pretty.js:281418 | function |
| `Fyy` | AUTHORITY_POSITION_DELIMITERS | cli_inner_pretty.js:282870 | constant |
| `g7` | expandEnvPlaceholders | cli_inner_pretty.js:267981 | function |
| `g_o` | expandWithProcessEnv | cli_inner_pretty.js:281834 | function |
| `Gyy` | valueContainsDotSegment | cli_inner_pretty.js:281912 | function |
| `iWu` | valueInjectsWildcard | cli_inner_pretty.js:267971 | function |
| `jyy` | DOT_SEGMENT_RE | cli_inner_pretty.js:282871 | constant |
| `j_s` | PLACEHOLDER_REGEX_SOURCE | cli_inner_pretty.js:268008 | constant |
| `n7t` | isSettingsSourcedEnvVarAllowed | cli_inner_pretty.js:57846 | function |
| `n8u` | expandPolicyUrlPattern | cli_inner_pretty.js:281925 | function |
| `nHh` | SETTINGS_ENV_ALLOWLIST | cli_inner_pretty.js:57993 | constant |
| `NQr` | getFrozenStartupEnv | cli_inner_pretty.js:267771 | function |
| `Nyy` | classifyVarPositions | cli_inner_pretty.js:281870 | function |
| `Oyy` | buildPolicyExpansionEnvWithFallback | cli_inner_pretty.js:281842 | function |
| `r8u` | expandPolicyString | cli_inner_pretty.js:281855 | function |
| `sSs` | neutralizeValue | cli_inner_pretty.js:281863 | function |
| `t8u` | buildPolicyExpansionEnv | cli_inner_pretty.js:281837 | function |
| `tdt` | isMcpServerDenied | cli_inner_pretty.js:282089 | function |
| `Uyy` | valueBreaksItsPosition | cli_inner_pretty.js:281904 | function |
| `Vyy` | getAllowlistSettingsSource | cli_inner_pretty.js:282082 | function |
| `ZFe` | isMcpServerAllowed | cli_inner_pretty.js:282116 | function |
| `zMt` | ADMIN_WILDCARD_SENTINEL | cli_inner_pretty.js:282869 | constant |
| `zyy` | getDenylistSettingsSource | cli_inner_pretty.js:282086 | function |
| `$yy` | NEUTRAL_VALUE_TOKEN ("zzenvsubzz") | cli_inner_pretty.js:282816 | constant |

---

## Module: MCP Reserved Names and Permission Floor

Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AEy` | HOST_SURFACE_SERVERS | cli_inner_pretty.js:289043 | constant |
| `Bde` | isStdioServerConfig | cli_inner_pretty.js:151671 | function |
| `dWn` | RESERVED_WORKSPACE_SERVER_NAME | cli_inner_pretty.js:60372 | constant |
| `El` | normalizeMcpServerName | cli_inner_pretty.js:60201 | function |
| `fkg` | CLAUDE_BROWSER_SERVER_NAME | cli_inner_pretty.js:151629 | constant |
| `gkg` | HOST_SURFACE_NAME_SET | cli_inner_pretty.js:151634 | variable |
| `J_e` | isComputerUseServerName | cli_inner_pretty.js:151422 | function |
| `K9u` | PREVIEW_SERVERS | cli_inner_pretty.js:289042 | constant |
| `Ler` | isHostSurfaceServerName | cli_inner_pretty.js:151605 | function |
| `nze` | resolveMcpPermissionMode | cli_inner_pretty.js:289015 | function |
| `pkg` | CLAUDE_PREVIEW_SERVER_NAME | cli_inner_pretty.js:151628 | constant |
| `UIt` | isReservedMcpServerName | cli_inner_pretty.js:151668 | function |
| `xY` | isClaudeInChromeServerName | cli_inner_pretty.js:151636 | function |
| `Y9u` | parseMcpPermissionModeOverride | cli_inner_pretty.js:289032 | function |

---

## New env vars and gates discovered (for the env/gate indexes)

| Name | Kind | File:Line | Notes |
|------|------|-----------|-------|
| `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS` | env var | cli_inner_pretty.js:32120 | accessor map; read `:288858`; settings-env allowlist `:58167`; 220=3/193=0 |
| `MCP_SDK_GENERATION` | env var | cli_inner_pretty.js:31998 | accessor map; read `:262849`; `v1`/`v2` only; 220=3/193=0 |
| `tengu_mcp_auto_background` | gate | cli_inner_pretty.js:288860 | default `true` |
| `tengu_mcp_tool_auto_backgrounded` | event | cli_inner_pretty.js:288896 | fired once per promotion |
| `tengu_brindle_causeway` | gate | cli_inner_pretty.js:262853 | default `false` → v1 runtime tree |
| `tengu_mcp_sdk_generation` | event | cli_inner_pretty.js:262859 | `{generation, source}`; source ∈ env/growthbook/default |
| `tengu_surface_failed_mcp_servers` | gate | cli_inner_pretty.js:217470 | default **false** — gates the model-facing failed-server list |
| `tengu_mcp_drop_invalid_tool_schemas` | gate | cli_inner_pretty.js:293416 | drops API-invalid tool schemas |
| `tengu_mcp_normalize_root_combinators` | gate | cli_inner_pretty.js:293413 | schema normalisation |
| `tengu_mcp_dropped_tools_pool_change` | event | cli_inner_pretty.js:514689 | `{addedCount, priorAnnouncedCount, messagesLength}` |
| `tengu_mcp_proxy_needs_approval_retry` | gate + event | cli_inner_pretty.js:293996 / :294026 | claude.ai-proxy retroactive approval; one retry |
| `tengu_dead_probe_mcp_subsec_timeout` | event | cli_inner_pretty.js:292943 | `{site: hard\|idle\|request, timeout_value}` |
| `tengu_mcp_oauth_refresh_failure` / `_success` | event | cli_inner_pretty.js:288008 | carryover (2× = one per runtime tree) |
| `tengu_deferred_tools_pool_change` | event | cli_inner_pretty.js:442007 | now carries `needsAuthChanged/Count`, `failedChanged/Count` |
| `tengu_mcp_server_config_invalid` | event | cli_inner_pretty.js:294674 | `{transportType, field, source}` |
| `tengu_builtin_mcp_toggle` | event | cli_inner_pretty.js:282809 | `{serverName, enabled}` |
