# Symbol Index — Platform Infrastructure (v2.1.183 → v2.1.193)

This index catalogs obfuscated → readable mappings for the **platform infrastructure** symbols that changed between v2.1.183 and v2.1.193 (published sub-versions 2.1.185 / .186 / .187 / .190 / .191 / .193): **MCP**, **Permissions**, **Sandbox**, **Model** resolution/entitlement, **Prompt** building, and **Telemetry / OTEL**.

For other categories see:

- [`symbol_index_core_execution.md`](symbol_index_core_execution.md) — Agent Loop, Tools, LLM API, Agents, Subagent, State (and the Agent named-spawn enforcement)
- [`symbol_index_core_features.md`](symbol_index_core_features.md) — Auto-mode, Background Agents, Compact, Auto Memory, Workflow, Agent Team, Skills
- [`symbol_index_infra_integration.md`](symbol_index_infra_integration.md) — Slash Commands, Plugins, Hooks, UI surfaces

## File:Line Format

For v2.1.193 the canonical source citation is `cli_inner_pretty.js:<line>` — the single pretty-printed bundle at `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines; VERSION `2.1.193`, build `a1938d2a`, BUILD_TIME `2026-06-25T18:18:11Z`). Lines tagged `(183)` / `(156)` are explicitly before-pictures. **Obfuscated names are re-mangled every build** — a 183 token never carries into 193 (e.g. `$Cr`=isSubagent in 183 but `$Cr`=isClassifyAllShellEnabled in 193).

## Per-module symbol manifests

This delta tree keeps the full per-symbol mapping tables in the **per-module additions files**. This index is the routing layer; the curated tables below carry only the most load-bearing anchors. Consult the additions file for the exhaustive, line-by-line, before/after table:

- [`symbol_additions_v2_1_193_mcp.md`](symbol_additions_v2_1_193_mcp.md) — MCP (login/logout CLI, idle-timeout watchdog, headersHelper re-auth, capability/OAuth retries, get/remove suggestions, retired-tool notice)
- [`symbol_additions_v2_1_193_telemetry.md`](symbol_additions_v2_1_193_telemetry.md) — Telemetry/OTEL (`assistant_response` event + env-schema plumbing)
- [`symbol_additions_v2_1_193_system_prompt.md`](symbol_additions_v2_1_193_system_prompt.md) — Prompt (env-block agent-proxy line, model-switch reminders, memory-prompt dedup)
- [`symbol_additions_v2_1_193_permissions.md`](symbol_additions_v2_1_193_permissions.md) — **platform rows only** (shell-allow-rule suspend gate, sandbox.credentials, `ko` controller, denial store, org-model entitlement). Its Auto-mode rows route to [`symbol_index_core_features.md`](symbol_index_core_features.md); its Agent named-spawn rows route to [`symbol_index_core_execution.md`](symbol_index_core_execution.md).

---

## Module: Permissions — Auto-mode shell-allow-rule suspension (platform gate)

The platform-side trust gate that suspends `allow` rules for shell tools when auto-mode's `classifyAllShell` classifier is engaged. The `classifyAllShell` schema field and the `dQl`/`NEe`/`yjo` auto-mode wiring are catalogued under **Module: Permissions / Auto-mode** in [`symbol_index_core_features.md`](symbol_index_core_features.md); only the suspend predicate + dangerous-prefix gate live here. Exhaustive home: [`symbol_additions_v2_1_193_permissions.md`](symbol_additions_v2_1_193_permissions.md) ("classifyAllShell").

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Cr` | `isClassifyAllShellEnabled` (OR across settings sources; 183 `$Cr` was `isSubagent`) | cli_inner_pretty.js:58758 | function |
| `sTo` | `shouldSuspendAllShellAllowRules` (wrapper → `$Cr`) | cli_inner_pretty.js:416260 | function |
| `r9e` | `isShellAllowRuleSuspended` (NET-NEW bypass line `:416264` prepended to a 183 `WGe`-equivalent body) | cli_inner_pretty.js:416263 | function |
| `mqt` | `isDangerousBashAllowRule` (dangerous-prefix; carryover) | cli_inner_pretty.js:416162 | function |
| `hqt` | `isDangerousPowerShellAllowRule` (carryover) | cli_inner_pretty.js:416208 | function |
| `oTo` | `resolvesToAgentTool` (carryover) | cli_inner_pretty.js:416257 | function |
| `Orl` | `shellRuleSuspendCache` (per-rule memo; carryover) | cli_inner_pretty.js:416271 | variable |
| `$rl` | `dangerousInterpreterPrefixList` (carryover) | cli_inner_pretty.js:416116 | constant |
| `Uys` | `SETTINGS_SOURCES` (`["userSettings","localSettings","flagSettings","policySettings"]`) | cli_inner_pretty.js:58827 | constant |

## Module: Permissions — Denial store & approve-persists overlay (platform store)

The recent-denials ring buffer and the Recently-denied overlay whose "approved" close branch now persists the grant. The 5-way denial-kind taxonomy (`XKa`/`USe`/`toolDenialKind`) and the approval-reason map (`dQa`/`pQa`) are auto-mode surface and live under **Module: Permissions / Auto-mode** in [`symbol_index_core_features.md`](symbol_index_core_features.md). Exhaustive home: [`symbol_additions_v2_1_193_permissions.md`](symbol_additions_v2_1_193_permissions.md) ("denial-reason surfacing", "Recently-denied overlay").

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `r4l` | `RecentDenialsProvider` (ring buffer `VLf=20`; carryover) | cli_inner_pretty.js:546166 | function |
| `oSt` | `useRecentDenials` (`getDenials`/`recordDenial`/`removeDenial`; carryover) | cli_inner_pretty.js:546192 | function |
| `VLf` | `RECENT_DENIALS_RING_SIZE` (=20; carryover) | cli_inner_pretty.js:546199 | constant |
| `H4l` | `PermissionsOverlay` (`{getDenials, removeDenial}=oSt()`) | cli_inner_pretty.js:547100 | function |
| `f4l` | `RecentDeniedTab` (toggles approved/retry sets; per-row `reason` spread is NET-NEW `:546589`) | cli_inner_pretty.js:546479 | function |
| `wt` | `onPermissionsOverlayClose` (approved branch NET-NEW persists the grant; distinct local from the workflow `wt`@423705 in core_features) | cli_inner_pretty.js:547334 | function |

## Module: Sandbox — `sandbox.credentials` (deny-read files + secret-env masking)

NET-NEW `sandbox.credentials` config: per-source path-resolved deny-read file list + secret-env masking folded into the filesystem deny-read policy. Exhaustive home: [`symbol_additions_v2_1_193_permissions.md`](symbol_additions_v2_1_193_permissions.md) ("Sandbox — sandbox.credentials").

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `kwr` | `credentialFileEntry` schema (`{path, mode:"deny"}`) | cli_inner_pretty.js:54048 | function |
| `Rwr` | `secretEnvEntry` schema (`{name:/^[A-Za-z_]\w*$/, mode:"deny"}`) | cli_inner_pretty.js:54058 | function |
| `IEu` | `sandboxCredentials` schema (`{files?, envVars?}`) | cli_inner_pretty.js:54069 | function |
| `Lwr` | `sandboxRootSchema` (wires `credentials: IEu()`) | cli_inner_pretty.js:54079 | function |
| `Rqi` | `resolveCredentialProtection` (`{denyReadPaths, unsetEnvVars, setEnvVars}`) | cli_inner_pretty.js:211660 | function |
| `Yjd` | `buildSandboxFsDenyRead` (folds `denyReadPaths` into `filesystem.denyRead`) | cli_inner_pretty.js:211677 | function |
| `FRn` | `secretInjectionRegistry` (staged `mode:"mask"` sentinel registry) | cli_inner_pretty.js:212031 | variable |
| `Ya` | `sandboxConfig` (resolved sandbox config object) | cli_inner_pretty.js:211677 | variable |
| `jT` | `SETTINGS_SOURCES` (credential merge-iteration source list) | cli_inner_pretty.js:219471 | constant |

## Module: Sandbox — `ko` controller + session-allowed-hosts

The sandbox controller singleton and the per-session allowed-hosts set that `_Wd` merges in (WebFetch domain approvals survive a config refresh). Exhaustive home: [`symbol_additions_v2_1_193_permissions.md`](symbol_additions_v2_1_193_permissions.md) ("Sandbox — ko controller").

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ko` | `sandboxController` (singleton API surface) | cli_inner_pretty.js:219848 | object |
| `_Wd` | `addSessionAllowedHost` (`BLn.add` + `hJr()`) | cli_inner_pretty.js:219238 | function |
| `BLn` | `sessionAllowedHosts` (per-session Set; merged `:219287`, cleared `:219748`) | cli_inner_pretty.js:219833 | variable |
| `hJr` | `refreshSandboxConfig` (controller `refreshConfig`) | cli_inner_pretty.js:219862 | function |
| `kWd` | `sandboxControllerReset` (controller `reset`; clears `BLn`) | cli_inner_pretty.js:219864 | function |
| `Wb` | `WEBFETCH` tool name (`"WebFetch"`; domain-rule check in merge) | cli_inner_pretty.js:218789 | constant |

## Module: Model — org-entitlement restrictions

NET-NEW org model-entitlement gate: restricted models are hidden from the picker, `/model` denies them with `denied_by_entitlement`, and the effective model is silently downgraded opus→sonnet→haiku. Exhaustive home: [`symbol_additions_v2_1_193_permissions.md`](symbol_additions_v2_1_193_permissions.md) ("Model — org entitlement restrictions").

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `d7u` | `buildRestrictedModelSet` (`if(!entitled) add`) | cli_inner_pretty.js:102809 | function |
| `u7u` | `normalizeModelName` | cli_inner_pretty.js:102806 | function |
| `NFe` | `isModelRestrictedByEntitlements` (alias-resolving; size-0 fast-path) | cli_inner_pretty.js:102814 | function |
| `Uge` | `getOrgRestrictedModelSet` (empty unless firstParty/gateway) | cli_inner_pretty.js:102820 | function |
| `Ia` | `isModelAvailable` (picker filter; NET-NEW `NFe` clause `:102880`) | cli_inner_pretty.js:102873 | function |
| `tzt` | `switchModel` (`/model` denial + `denied_by_entitlement`) | cli_inner_pretty.js:487243 | function |
| `u_n` | `resolveRestrictedModelFallback` (opus→sonnet→haiku downgrade) | cli_inner_pretty.js:103212 | function |
| `aw` | `getEffectiveModel` (`u_n(r) ?? r`; covers `ANTHROPIC_MODEL`/env) | cli_inner_pretty.js:103207 | function |
| `rre` | `formatModelRestrictedWarning` ("Using X instead"; **CARRYOVER**, 183 `:362631`) | cli_inner_pretty.js:374023 | function |
| `Qft` | `sanitizeModelNameForDisplay` (used by `rre`) | cli_inner_pretty.js:374018 | function |

## Module: MCP — Auth CLI (`claude mcp login/logout`, get/remove)

NET-NEW (2.1.186) `mcp login`/`mcp logout` paste-URL OAuth subcommands plus the `mcp get`/`mcp remove` fuzzy name-suggestion handlers. Exhaustive home: [`symbol_additions_v2_1_193_mcp.md`](symbol_additions_v2_1_193_mcp.md) ("login/logout CLI", "get/remove name suggestions").

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `L9f` | `mcpLoginHandler` | cli_inner_pretty.js:613318 | function |
| `D9f` | `mcpLogoutHandler` | cli_inner_pretty.js:613467 | function |
| `rnc` | `formatAuthUrlMessage` | cli_inner_pretty.js:613312 | function |
| `g3o` | `mcpAuthModule` (exports `{mcpLoginHandler, mcpLogoutHandler}`) | cli_inner_pretty.js:613276 | object |
| `anc` | `buildMcpCommand` (the `mcp` parent command) | cli_inner_pretty.js:613523 | function |
| `oX` | `runOAuthFlow` (shared; `skipBrowserOpen`/`onWaitingForCallback`) | cli_inner_pretty.js:281953 | function |
| `Vj` | `OAuthAbort` (`AuthenticationCancelledError` abort sentinel) | cli_inner_pretty.js:283086 | class |
| `t3o` | `suggestClosestServerName` (fuzzy + truncate-at-8) | cli_inner_pretty.js:610416 | function |
| `fde` | `fuzzyClosestMatch` (Levenshtein, maxEditDistance 2) | cli_inner_pretty.js:382122 | function |
| `f9f` | `mcpGetHandler` | cli_inner_pretty.js:611549 | function |
| `a9f` | `mcpRemoveHandler` | cli_inner_pretty.js:611388 | function |

## Module: MCP — tool-call idle timeout + headersHelper re-auth

NET-NEW (2.1.187) per-tool-call idle watchdog (`CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT`) and the NET-NEW (2.1.193) headersHelper re-auth-on-401/403 reconnect path. Exhaustive home: [`symbol_additions_v2_1_193_mcp.md`](symbol_additions_v2_1_193_mcp.md) ("remote tool-call idle timeout", "headersHelper re-auth").

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Jpu` | env `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` (`Fe.int()`) | cli_inner_pretty.js:43611 | variable |
| `_pp` | `resolveIdleTimeoutMs` | cli_inner_pretty.js:292213 | function |
| `hpp` | `DEFAULT_MCP_TOOL_IDLE_TIMEOUT_MS` (=300000) | cli_inner_pretty.js:293311 | constant |
| `ypp` | `IDLE_TIMEOUT_TRANSPORTS` (`Set(["http","sse","ws","claudeai-proxy"])`) | cli_inner_pretty.js:293456 | constant |
| `gAa` | `resolveToolTimeoutMs` (overall per-call ceiling) | cli_inner_pretty.js:292208 | function |
| `bao` | `callToolWithWatchdog` (idle watchdog + re-auth catch) | cli_inner_pretty.js:293017 | function |
| `Fi` | `McpToolError` / `DualError` (idle/transport/overall-timeout error class; shared base also thrown by workflow's `qVd` — catalogued here) | cli_inner_pretty.js:9055 | class |
| `lWe` | `McpReauthError` (`.name="McpAuthError"`; "requires re-authorization") | cli_inner_pretty.js:293424 | class |
| `vR` | `McpAuthRequiredError` (instanceof in isAuthError) | cli_inner_pretty.js:138074 | class |
| `ID` | `connectOrGetClient` (re-runs headersHelper) | cli_inner_pretty.js:293461 | function |
| `nT` | `disconnectAndClearCache` | cli_inner_pretty.js:292489 | function |
| `pao` | `inFlightReauthReconnects` (reconnect-dedup Map) | cli_inner_pretty.js:293460 | variable |
| `Ct` | `logFeatureSadEvent` (generic `tengu_feature_sad`; `("mcp_headers_helper","reauth_retry")`, only the error_code is net-new) | cli_inner_pretty.js:44851 | function |

## Module: MCP — capability/OAuth retries + retired-tool notice

NET-NEW (2.1.191) capability-discovery pagination retry + OAuth retry-once + 404 `ENDPOINT_NOT_FOUND` rewrite, and the retired-tool "disconnected" notice fix (2.1.186). Exhaustive home: [`symbol_additions_v2_1_193_mcp.md`](symbol_additions_v2_1_193_mcp.md) ("capability-discovery retry", "retired-tool notice", "needs-auth cache").

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `P1n` | `listWithPaginationAndRetry` (183 predecessor `aOt`, no retry) | cli_inner_pretty.js:292176 | function |
| `mpp` | `RETRY_BACKOFFS` (=[250, 500, 1000]) | cli_inner_pretty.js:293455 | constant |
| `gpp` | `isRetryableError` | cli_inner_pretty.js:292155 | function |
| `fAa` | `isSessionExpiredError` | cli_inner_pretty.js:292133 | function |
| `AOn` | `createRetryingOAuthFetch` (183 single-fetch `qxn`) | cli_inner_pretty.js:281573 | function |
| `Vap` | `OAUTH_RETRY_DELAY_MS` (=500) | cli_inner_pretty.js:283043 | constant |
| `HIe` | `formatServerUrl` | cli_inner_pretty.js:145991 | function |
| `HBt` | `RETIRED_TOOL_NAMES` (`Set(["Frame","FrameRead","TeamCreate","TeamDelete","SuggestBackgroundPR"])`) | cli_inner_pretty.js:228300 | constant |
| `oko` | `computeDeferredToolsDelta` (retired-tool skip; 183 predecessor `Qgo`) | cli_inner_pretty.js:471037 | function |
| `$1n` | `needsAuthCachePath` (`mcp-needs-auth-cache.json`; carryover) | cli_inner_pretty.js:292219 | function |

> The four MCP-resource directory-tool surface symbols (`iX`/`_ne`/`dlp`/`plp`/`D_a`, the NET-NEW `ReadMcpResourceDirTool`) have their **protocol** home here but are tabled under **Module: Tools — tool-surface delta** in [`symbol_index_core_execution.md`](symbol_index_core_execution.md), since the tool *surface* delta is owned by `04_tools/`.

## Module: Telemetry — `assistant_response` OTEL log event

NET-NEW (2.1.193) `claude_code.assistant_response` OTEL log event emitted alongside `api_request`, gated behind the new `OTEL_LOG_ASSISTANT_RESPONSES` tri-bool (whose redaction inheritance differs from `OTEL_LOG_USER_PROMPTS`). Exhaustive home: [`symbol_additions_v2_1_193_telemetry.md`](symbol_additions_v2_1_193_telemetry.md).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `cSl` | `recordApiRequestTelemetry` (emits `api_request` then NEW `assistant_response`) | cli_inner_pretty.js:468542 | function |
| `dGi` | `isAssistantResponseLoggingEnabled` (NET-NEW response-redaction gate) | cli_inner_pretty.js:195211 | function |
| `FZc` | `OTEL_LOG_ASSISTANT_RESPONSES` value (NET-NEW; `Fe.triBool()`) | cli_inner_pretty.js:36363 | variable |
| `BZc` | `OTEL_LOG_USER_PROMPTS` value (carryover; `Fe.bool()`) | cli_inner_pretty.js:36362 | variable |
| `Jc` | `logOTelEvent` (carryover OTEL sink) | cli_inner_pretty.js:195214 | function |
| `GNd` | `isUserPromptLoggingEnabled` (carryover) | cli_inner_pretty.js:195205 | function |
| `V1t` | `redactIfDisabled` (carryover) | cli_inner_pretty.js:195208 | function |
| `CD` | `truncateForTelemetry` (carryover; 60×1024-byte cap `xcp`) | cli_inner_pretty.js:285861 | function |
| `NHr` | `otelEnvGetterNamespace` (lazy getter map; `OTEL_LOG_ASSISTANT_RESPONSES:()=>FZc`) | cli_inner_pretty.js:36256 | object |
| `Be` | `managedEnvProxy` (`$cs(Qmu, qXe)`; per-access parses `process.env[key]`) | cli_inner_pretty.js:43996 | object |
| `QJc` | `triBoolParser` (memoized zod schema; first applied to an OTEL_* var this window) | cli_inner_pretty.js:36076 | variable |

## Module: Prompt — env-block agent-proxy line + model-switch reminders

NET-NEW (Remote/proxy-only) env-block agent-proxy diagnostic line + on-disk README, the Remote model-switch "now running as" replay reminder, and the memory-prompt dedup (`_gi` subsection removed). The two model-switch-replay symbols also touch the agent-execution path; their canonical home for this round is the Prompt module. Exhaustive home: [`symbol_additions_v2_1_193_system_prompt.md`](symbol_additions_v2_1_193_system_prompt.md).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `W3f` | `computeEnvInfo` (env-block builder; gained `l = Nwn()` proxy slot; carryover of 183 `L_f`) | cli_inner_pretty.js:592845 | function |
| `C3o` | `buildAgentProxyEnvLine` ("Outbound HTTPS goes through a pre-configured agent proxy…") | cli_inner_pretty.js:616578 | function |
| `Nwn` | `getAgentProxyEnvLine` (returns `Bki`; read by `computeEnvInfo`) | cli_inner_pretty.js:151176 | function |
| `h$t` | `setAgentProxyEnvLine` (push setter) | cli_inner_pretty.js:151173 | function |
| `Bki` | `agentProxyEnvLine` (module var; `undefined` for non-proxy sessions) | cli_inner_pretty.js:151179 | variable |
| `Z8f` | `buildAgentProxyReadme` (on-disk `# Claude Code agent proxy` troubleshooting README) | cli_inner_pretty.js:616595 | function |
| `le` | `handleModelSwitchReplay` (Remote branch pushes the NET-NEW "now running as" reminder) | cli_inner_pretty.js:705779 | function |
| `XQl` | `buildModelSwitchReminders` (generic `/model`-replay; CARRYOVER) | cli_inner_pretty.js:599667 | function |
| `dPe` | `renderSlashCommandReplay` (carryover) | cli_inner_pretty.js:599662 | function |
| `p0i` | `whenToAccessMemories` (memory fragment array; now flows straight into `A$t`) | cli_inner_pretty.js:152255 | variable |
| `A$t` | `beforeRecommendingFromMemory` (`## Before recommending from memory` array; carryover) | cli_inner_pretty.js:152262 | variable |
| `Kwn` | `memoryStalenessGuidance` (the drift/trust bullet surviving the removed `_gi` subsection) | cli_inner_pretty.js:152092 | variable |

---

For the v2.1.156→v2.1.183 platform baseline, see the v2.1.183 tree's [`symbol_index_infra_platform.md`](../../../claude_code_v_2.1.183/analyze/00_overview/symbol_index_infra_platform.md).
