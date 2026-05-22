# Symbol Index — Platform Infrastructure (v2.1.113 → v2.1.142)

This index catalogs obfuscated → readable mappings for the **platform infrastructure** symbols introduced or changed between v2.1.113 and v2.1.142. Scope: MCP Protocol, Permissions, Sandbox, Auth, Model Selection, Prompt Building, Telemetry, Shell Snapshot.

For other categories see:

- [`symbol_index_core_execution.md`](symbol_index_core_execution.md) — Agent Loop, Tools, LLM API, Agents, Subagent, State
- [`symbol_index_core_features.md`](symbol_index_core_features.md) — Plan, Background Agents, /goal, Todo, Compact, Hooks, Skills, Thinking, Steering, CLI
- [`symbol_index_infra_integration.md`](symbol_index_infra_integration.md) — LSP, Chrome, IDE, UI, Plugin, Code Indexing, Shell Parser, Slash Commands

## File:Line Format

For v2.1.142, the canonical source citation is `cli_inner_pretty.js:<line>` (the unified bundle at `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js`). Per-decl isolated files live at `cli_unpack_pretty/decls/functions/<obfuscated>.js`.

---

## Module: MCP Protocol

stdio/HTTP/SSE/WebSocket transports, OAuth flow, tool listing, resource templates, elicitation, server lifecycle.

### MCP — Configuration Schemas

Every schema carries `alwaysLoad: y.boolean().optional()` (added in v2.1.121).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Bu8` | `McpSSEServerConfigSchema` (was `Bn5`) | cli_inner_pretty.js:48904-48913 | function |
| `CR$` | `McpHTTPServerConfigSchema` (was `gn5`) | cli_inner_pretty.js:48933-48942 | function |
| `CRA` | `McpTransportEnumSchema` (was `C5O`) | cli_inner_pretty.js:48880 | function |
| `du8` | `McpClaudeAiProxyServerConfigSchema` | cli_inner_pretty.js:48954-48960 | function |
| `Fu8` | `McpWSServerConfigSchema` (was `Un5`) | cli_inner_pretty.js:48943-48951 | function |
| `gu8` | `McpSDKServerConfigSchema` (was `Qn5`) | cli_inner_pretty.js:48952 | function |
| `nq$` | `McpStdioServerConfigSchema` (was `wO1` in v2.1.112) | cli_inner_pretty.js:48881-48889 | function |
| `pu8` | `McpSSEIdeServerConfigSchema` (was `pn5`) | cli_inner_pretty.js:48914-48922 | function |
| `Qu8` | `McpToolPermissionLevelSchema` (`allow`/`ask`/`blocked`) | cli_inner_pretty.js:48953 | function |
| `Tv7` | `McpServerTransportSchemas` (map from transport type → schema factory) | cli_inner_pretty.js | object |
| `Uu8` | `McpWSIdeServerConfigSchema` (was `Fn5`) | cli_inner_pretty.js:48923-48932 | function |
| `Vh9` | `McpXaaConfigSchema` (was `mn5`) | cli_inner_pretty.js:48890 | function |
| `$wq` | `McpOAuthConfigSchema` (was `Zg7`) | cli_inner_pretty.js:48891-48903 | function |

### MCP — Per-Request Fetch Timeout

NEW in v2.1.142: per-request fetch timeout reads `MCP_TOOL_TIMEOUT`.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aHH` | `getMcpEnvelopeTimeoutMs` (was `ol8`; reads `MCP_TIMEOUT`, default 30000) | cli_inner_pretty.js:412341-412344 | function |
| `B$4` | `MCP_FETCH_TIMEOUT_MAX_MS` (= 2147483647 INT32_MAX) | cli_inner_pretty.js:414053 | constant |
| `C$4` | `MCP_FETCH_TIMEOUT_DEFAULT_MS` (= 60000) (was `GRK = 60000` hardcoded) | cli_inner_pretty.js:414062 | constant |
| `f$4` | `getMcpConnectTimeoutMs` (reads `MCP_CONNECT_TIMEOUT_MS`, default 5000) | cli_inner_pretty.js:412345-412348 | function |
| `i15` | `MCP_TOOL_TIMEOUT_DEFAULT_MS` (= 1e8) (was `EvY`) | cli_inner_pretty.js:414052 | constant |
| `OS6` | `mcpFetchWithTimeout` (was `iz7`; now calls `U$4`) | cli_inner_pretty.js:413350-413367 | function |
| `r15` | `getToolTimeoutMs` (envelope timeout; was `yvY` in v2.1.112) | cli_inner_pretty.js:413221-413224 | function |
| `U$4` | `getRequestFetchTimeoutMs` (NEW — honors `MCP_TOOL_TIMEOUT`) | cli_inner_pretty.js:413346-413349 | function |
| `__5` | `MCP_SSE_ACCEPT_HEADER` (= `"application/json, text/event-stream"`) (was `gvY`) | cli_inner_pretty.js:414063 | constant |

### MCP — Transport Byte Caps

NEW in v2.1.132/v2.1.139: bounded stdio buffer + SSE frame cap.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_$4` | `BoundedReadBuffer` (stdio buffer with overflow callback) | cli_inner_pretty.js:412074-412110 | class |
| `A$4` | `HttpBodyOverflowError` (SSE non-event-boundary error class) | cli_inner_pretty.js:412182-412189 | class |
| `aI6` | `_SSE_OVERFLOW_REASON_TAG` (= `"without an SSE event boundary"`) | cli_inner_pretty.js:412177 | constant |
| `bP$` | `BoundedStdioClientTransport` (wires BoundedReadBuffer into base transport) | cli_inner_pretty.js:412126-412134 | class |
| `CP$` | `StdoutOverflowError` (non-protocol-data error class) | cli_inner_pretty.js:412118-412124 | class |
| `E6$` | `BaseStdioReadBuffer` (legacy unbounded buffer; replaced by `_$4` for MCP clients) | cli_inner_pretty.js:32778-32793 | class |
| `ih$` | `formatJsonRpcMessage` (object → stringified line) | cli_inner_pretty.js:32797-32802 | function |
| `L15` | `MCP_SSE_FRAME_CAP_BYTES` (= 16777216, alias for SSE) | cli_inner_pretty.js:412181 | constant |
| `lR8` | `parseJsonRpcMessage` (Buffer → schema-validated JSON-RPC) | cli_inner_pretty.js:32794-32796 | function |
| `P15` | `sseBodyOverflowTransformStream` (TransformStream that counts bytes without buffering) | cli_inner_pretty.js:412136-412161 | function |
| `rI6` | `MCP_FRAME_OVERFLOW_BYTES` (= 16777216 = 16 MB) | cli_inner_pretty.js:412112 | constant |
| `RY6` | `BaseStdioClientTransport` (parent class — unchanged) | cli_inner_pretty.js | class |
| `xrH` | `wrapSseBodyOverflowGuard` (fetch wrapper applying P15) | cli_inner_pretty.js:412162-412175 | function |
| (inlined `67108864`) | `MCP_STDERR_BUFFER_BYTES` (= 64 MB stderr cap) | cli_inner_pretty.js:414316 | constant |

### MCP — tools/list Lifecycle

NEW in v2.1.132: retry once + capture error to `toolsListError`.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bSH` | `mcpToolsListResponseSchema` (zod result schema for `tools/list`) (was `bg6`) | cli_inner_pretty.js | object |
| `cI` | `getMcpServerBaseUrl` (extracts URL from server config) | cli_inner_pretty.js | function |
| `dDH` | `buildMcpBaseUrlAttrs` (extracts URL → telemetry attrs) | cli_inner_pretty.js:413269-413272 | function |
| `iI6` | `sanitizeUnicodeString` (NFKC + control-char strip) | cli_inner_pretty.js:412046-412063 | function |
| `KU` | `formatToolName` (`mcp__server__tool` joiner) | cli_inner_pretty.js | function |
| `lK` | `McpProtocolError` (SDK error class with `.code`) | cli_inner_pretty.js | class |
| `oHH` | `sanitizeMcpToolList` (unicode normalisation, was `iI6`) | cli_inner_pretty.js:412064-412072 | function |
| `WB` | `fetchMcpTools` (memoized; retries once on non-timeout failure) (was `NS`) | cli_inner_pretty.js:414718-414810 | function |
| `Z7` | `McpErrorCode` (enum with `RequestTimeout`, `MethodNotFound`, etc.) | cli_inner_pretty.js | constant |

State field added to client objects:

| Field | Where | Set by | Read by |
|-------|-------|--------|---------|
| `client.toolsListError` | client state object | `fetchMcpTools` on retry-also-fails | menu badge logic, `formatReconnectResult` |

### MCP — Connection & Reconnect

NEW in v2.1.139: reconnect re-reads `.mcp.json`; needs-auth retry once.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `B4H` | `loadAllMcpServerConfigs` (merges .mcp.json + user + project + enterprise) | cli_inner_pretty.js | function |
| `cZ6` | `findDotMcpJsonNear` (`.mcp.json` walker) | cli_inner_pretty.js:315207 | function |
| `ee` | `loadEffectiveMcpConfig` (top-level — applies enterprise allowlist + plugin-config merge) | cli_inner_pretty.js:317687-317694 | function |
| `Ey` | `ensureConnectedMcpClient` (memoized; was `OL`) | cli_inner_pretty.js | function |
| `fN` | `disconnectMcpClient` (was `WG`) | cli_inner_pretty.js:413385-413394 | function |
| `hQ` | `reconnectMcpServerInternal` (low-level reconnect with needs-auth retry) (was `_g`) | cli_inner_pretty.js:413440-413471 | function |
| `k0H` | `requireConnectedMcpClient` (throws if not connected; was `Fy6`) | cli_inner_pretty.js:413395-413399 | function |
| `NoH` | `MCP_TRANSIENT_RECONNECT_MAX_ATTEMPTS` (= 5) | cli_inner_pretty.js:451574 | constant |
| `Tj8` | `MCP_TOOL_RECONNECT_MAX_ATTEMPTS` (= 3) | cli_inner_pretty.js:451577 | constant |
| `UrH` | `mcpClientCacheKey` (cache key formatter) | cli_inner_pretty.js | function |
| `uz4` | `MCP_RECONNECT_MAX_DELAY_MS` (= 30000) | cli_inner_pretty.js:451576 | constant |
| `xz4` | `MCP_RECONNECT_INITIAL_DELAY_MS` (= 1000) | cli_inner_pretty.js:451575 | constant |
| (anonymous useCallback) | `reconnectMcpServer` (UI-level; re-reads .mcp.json) | cli_inner_pretty.js:451527-451538 | function |
| (anonymous useCallback) | `toggleMcpServer` (re-reads .mcp.json on re-enable) | cli_inner_pretty.js:451539-451558 | function |

### MCP — `/mcp` Server Detail Menu

NEW in v2.1.121/v2.1.132/v2.1.139: connected · {tools fetch failed | no tools} states, improved error copy.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `EoH` | `useReconnectMcpServer` (returns the useCallback above) | cli_inner_pretty.js:451609 | function |
| `kj8` | `formatTransportError` (extracts HTTP status / URL from failed client) | cli_inner_pretty.js:451797-451804 | function |
| `Nj8` | `formatReconnectResult` (new single-sentence copy; was `yi8`) | cli_inner_pretty.js:451806-451826 | function |
| `q2$` | `formatReconnectException` (formats thrown errors) | cli_inner_pretty.js:451827-451829 | function |
| `wEH` | `McpServerDetailMenu` (was `FP6`) | cli_inner_pretty.js:451831-452459 | function |
| (within `wEH` scope) | `usesHeadersHelper` flag (TH variable) | cli_inner_pretty.js:452267 | variable |

Status badges rendered by `Nj8`/`wEH`: `disabled` · `connected` · `connected · tools fetch failed` (v2.1.132) · `connected · no tools` (v2.1.128) · `connecting…` · `needs authentication` · `config issue` / `failed` (distinguished v2.1.141).

### MCP — `alwaysLoad`

NEW in v2.1.121: per-server `alwaysLoad` opt-out from tool-search deferral.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `cY` | `TOOL_SEARCH_TOOL_NAME` | cli_inner_pretty.js | constant |
| `D7` | `AGENT_TOOL_NAME` (= "Agent" / Task) | cli_inner_pretty.js | constant |
| `fr6` | `renderMcpConfigSection` (renderer helper) | cli_inner_pretty.js | function |
| `lN` | `partition` (array partition helper for alwaysLoad reporting) | cli_inner_pretty.js | function |
| `Of6` | `formatDeferredToolLine` | cli_inner_pretty.js:211842-211844 | function |
| `Or6` | `renderMcpServerList` (renderer helper) | cli_inner_pretty.js | function |
| `SH8` | `getToolSearchPrompt` | cli_inner_pretty.js:211845-211847 | function |
| `zm` | `isDeferredTool` (was `Pm` — short-circuit on `alwaysLoad`) | cli_inner_pretty.js:211830-211841 | function |

Tool object field:

| Field | Set at | Value source |
|-------|--------|--------------|
| `tool.alwaysLoad` | `fetchMcpTools` map (line 414769) | `server.config.alwaysLoad === true || upstreamTool._meta?.["anthropic/alwaysLoad"] === true` |

### MCP — Reserved Names

NEW in v2.1.128: `workspace` is reserved.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AlH` | `isAllowedByEnterprisePolicy` | cli_inner_pretty.js | function |
| `AZH` | `isReservedComputerUseName` (pre-existing) | cli_inner_pretty.js | function |
| `eD$` | `parseMcpConfigFile` (reads file, calls `tD$`) | cli_inner_pretty.js:317765-317796 | function |
| `Iv7` | `isExplicitlyBlocked` (enterprise denylist check) | cli_inner_pretty.js | function |
| `KQ` | `isEnterpriseMcpExclusive` (enterprise-config-takes-over check) | cli_inner_pretty.js | function |
| `Pwq` | `WORKSPACE_WEB_FETCH_TOOL_NAME` (= `mcp__workspace__web_fetch`) | cli_inner_pretty.js:50157 | constant |
| `Qk` | `isMcpServerDisabled` (config-level disabled check) | cli_inner_pretty.js | function |
| `R9` | `getProjectDir` (returns the canonical project root for the session) | cli_inner_pretty.js | function |
| `sD$` | `readDotMcpJson` (reads project-scope `.mcp.json` content) | cli_inner_pretty.js | function |
| `sq$` | `RESERVED_MCP_SERVER_NAME` (= `"workspace"`) | cli_inner_pretty.js:50145 | constant |
| `tD$` | `parseMcpConfig` (skips reserved-name entries; was `eC6` or similar) | cli_inner_pretty.js:317695-317763 | function |
| `tu8` | `WORKSPACE_TOOL_NAME_RENAMES` (object — internal tool name remapping) | cli_inner_pretty.js:50149-50156 | object |
| `UR$` | `WORKSPACE_BASH_TOOL_NAME` (= `mcp__workspace__bash`) | cli_inner_pretty.js:50157 | constant |
| `uTH` | `isReservedChromeForClaudeName` (pre-existing) | cli_inner_pretty.js | function |
| `zwH` | `addMcpServer` (rejects reserved name; was `qC6`) | cli_inner_pretty.js:317442-317535 | function |

### MCP — OAuth Refresh Defense

NEW in v2.1.118: missing-expires_in fix, step-up tracking, lock-or-skip, keychain race fix.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_15` | `OAUTH_PARAM_FILTER_KEYS` (= `["state","nonce","code_challenge","code_verifier","code"]`) | cli_inner_pretty.js:411639 | constant |
| `A15` | `TRANSIENT_REFRESH_ERROR_CODES` (Set with `invalid_refresh_token`, `expired_refresh_token`, `token_expired`) | cli_inner_pretty.js:411640 | constant |
| `Et` | `OAuthSDKBaseError` | cli_inner_pretty.js:209110 | class |
| `Ff` | `acquireFileLock` (lockfile library wrapper) | cli_inner_pretty.js | function |
| `fw8` | `fetchAuthServerMetadata` (RFC 8414 fetcher honoring config URL; was `ml8`) | cli_inner_pretty.js | function |
| `IY6` | `sdkRefreshAuthorization` (SDK's refresh helper; was `eg1`) | cli_inner_pretty.js | function |
| `kNH` | `McpOAuthProvider` (class implementing SDK's `OAuthClientProvider`) | cli_inner_pretty.js:410926-411530 | class |
| `kU` | `invalidateCredentialStorageCache` (in-memory cache flush) | cli_inner_pretty.js:91522-91524 | function |
| `L0H` | `discoverAuthorizationServerMetadata` (cold RFC 8414; was `bj6`) | cli_inner_pretty.js | function |
| `o9` | `getSecureMcpOAuthStorage` (mutable token storage; was `t3`) | cli_inner_pretty.js | function |
| `OFH` / `MFH` | other SDK transient error classes (used in `_doRefresh` retry-condition test) | cli_inner_pretty.js | class |
| `PX` | `getMcpServerKey` (`serverName+url` keychain key; was `IX`) | cli_inner_pretty.js | function |
| `q15` | `OAUTH_REFRESH_LOCK_STALE_MS` (= 30000) | cli_inner_pretty.js:411602 | constant |
| `QI6` | `wrapInsufficientScopeDetector` (HTTP 403 + WWW-Authenticate parser) | cli_inner_pretty.js:412912-412925 | function |
| `UI6` | `MAX_LOCK_RETRIES` (= 5; was `Sz7`) | cli_inner_pretty.js:411603 | constant |
| `x3H` | `InvalidGrantError` (SDK class; was `RK6`) | cli_inner_pretty.js | class |
| `Y15` | `ensureOfflineAccessScope` | cli_inner_pretty.js:411591-411595 | function |
| `yQ` | `AuthenticationCancelledError` | cli_inner_pretty.js:411641-411646 | class |
| `Yw8` | `createAuthFetch` (factory for fetchFn used in refresh) | cli_inner_pretty.js | function |
| `zw8` | `getScopesFromMetadata` (was `ul8`) | cli_inner_pretty.js:411584-411590 | function |
| (method) | `McpOAuthProvider._doRefresh` (NEW: kU() in invalid_grant arm) | cli_inner_pretty.js:411434-411529 | function |
| (method) | `McpOAuthProvider.discoveryState` (config-first per 2.1.105) | cli_inner_pretty.js:411342-411368 | function |
| (method) | `McpOAuthProvider.markStepUpPending` (NEW) | cli_inner_pretty.js:410974-410976 | function |
| (method) | `McpOAuthProvider.redirectToAuthorization` (NEW: persists step-up scope) | cli_inner_pretty.js:411214-411314 | function |
| (method) | `McpOAuthProvider.refreshAuthorization` (NEW: skip on ELOCKED exhaustion, kU() recheck) | cli_inner_pretty.js:411369-411433 | function |
| (method) | `McpOAuthProvider.saveDiscoveryState` | cli_inner_pretty.js:411316-411341 | function |
| (method) | `McpOAuthProvider.saveTokens` (NEW: honors null `expires_in`) | cli_inner_pretty.js:411104-411131 | function |
| (method) | `McpOAuthProvider.tokens` (NEW: omits refresh_token while step-up pending) | cli_inner_pretty.js:411032-411103 | function |
| (method) | `McpOAuthProvider.xaaRefresh` (silent jwt-bearer exchange) | cli_inner_pretty.js:411135-411213 | function |

Field/state additions on `McpOAuthProvider`:

| Field | Purpose | Set by |
|-------|---------|--------|
| `_lastUpscopingHeader` | (on transport) prevents step-up loop on idempotent 403 | SSE/HTTP transport handler |
| `_metadata` | cached AS metadata | `_doRefresh`, `discoveryState` consumers |
| `_pendingStepUpScope` | NEW — tracks an active step-up auth attempt | `markStepUpPending` |
| `_refreshInProgress` | dedup promise for concurrent refresh attempts | `tokens`, `xaaRefresh` |

### MCP — claude.ai Proxy Connector

NEW in v2.1.136: 401 retry on worker session token rotation.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$_5` | `wrapClaudeAiCallbackFetch` (callback URL bearer injection) | cli_inner_pretty.js:413297-413306 | function |
| `Dw8` | `clearMcpNeedsAuthCacheFile` (full file removal) | cli_inner_pretty.js:413263-413268 | function |
| `e15` | `isCachedNeedsAuth` (TTL-checked cache lookup) | cli_inner_pretty.js:413236-413242 | function |
| `fS6` | `reportNeedsAuth` (sets `needs-auth` state on a client + emits telemetry) | cli_inner_pretty.js:413288-413296 | function |
| `fu` | `refreshClaudeAiToken` (returns boolean: did the token change?) | cli_inner_pretty.js | function |
| `gI6` | `scheduleServerEventStreamReconnect` | cli_inner_pretty.js | function |
| `H_5` | `recordNeedsAuthCacheEntry` (writes mcp-needs-auth-cache.json) | cli_inner_pretty.js:413243-413253 | function |
| `KG6` | `subscribeToClaudeAiServerEvents` | cli_inner_pretty.js | function |
| `mL` | `getMcpAccessToken` (raw access token getter for Authorization header) | cli_inner_pretty.js | function |
| `Nw8` | `getMcpNeedsAuthCachePath` (`<cache_dir>/mcp-needs-auth-cache.json`) | cli_inner_pretty.js:413225-413227 | function |
| `p$4` | `clearNeedsAuthCache` (removes server from needs-auth cache after success) | cli_inner_pretty.js:413254-413262 | function |
| `q_5` | `wrapClaudeAiProxyFetch` (401 retry after token-refresh check) | cli_inner_pretty.js:413307-413344 | function |
| `s15` | `MCP_NEEDS_AUTH_CACHE_TTL_MS` (= 900000 = 15 min) | cli_inner_pretty.js:414057 | constant |
| `t15` | `MCP_NEEDS_AUTH_CACHE_TTL_CLAUDEAI_MS` (= 14400000 = 4 h) | cli_inner_pretty.js:414058 | constant |
| `wS6` | `readMcpNeedsAuthCache` (singleton-promise reader) | cli_inner_pretty.js:413228-413235 | function |
| `wY` | `waitForClaudeAiAuthReady` | cli_inner_pretty.js | function |
| `xq` | `getClaudeAiOAuthToken` | cli_inner_pretty.js | function |

### MCP — stdio Environment Injection

NEW in v2.1.139: `CLAUDE_PROJECT_DIR` injected into stdio servers.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bP$` | `BoundedStdioClientTransport` (see Transport Byte Caps section) | cli_inner_pretty.js:412126-412134 | class |
| `lt$` | `getSandboxedShellEnv` (additional vars for sandboxed shell) | cli_inner_pretty.js | function |
| `pA6` | `isSandboxedEnvironment` (predicate) | cli_inner_pretty.js | function |
| `SY6` | `getSandboxedEnv` (env factory when sandboxed) | cli_inner_pretty.js | function |
| `W4` | `shellQuote` (quotes args for `CLAUDE_CODE_SHELL_PREFIX`) | cli_inner_pretty.js | function |
| `XI` | `getDefaultStdioEnv` (env factory for stdio spawn) | cli_inner_pretty.js | function |
| (inline at line 414308) | `injectClaudeProjectDirToStdioMcpEnv` (logic, no separate function) | cli_inner_pretty.js:414308 | inlined |

### MCP — Telemetry Events

Telemetry events newly fired or modified:

| Event name | Fired by | When |
|------------|----------|------|
| `mcp_connect` | per-server connect attempt | reports duration, status, scope, transport type |
| `mcp_reconnect` | reconnect path | reports success/failure |
| `mcp_server_connection` | per-server connect attempt | reports duration, status, scope, transport type |
| `tengu_mcp_claudeai_proxy_401` | `wrapClaudeAiProxyFetch` | 401 from claude.ai proxy; reports `tokenChanged: boolean, proxyErrorCode?: string` |
| `tengu_mcp_degraded` | `fetchMcpTools` | `reason: "connected_zero_tools"` — tools/list returned empty array |
| `tengu_mcp_elicitation_response` | elicitation flow | unchanged |
| `tengu_mcp_elicitation_shown` | elicitation flow | unchanged |
| `tengu_mcp_headersHelper_missing_trust` | `getMcpHeadersFromHelper` | trust dialog not accepted yet |
| `tengu_mcp_oauth_flow_error` | OAuth flow orchestrator | flow-level failure |
| `tengu_mcp_oauth_refresh_failure` | `_doRefresh` | various `reason:` codes (`metadata_discovery_failed`, `no_client_info`, `no_tokens_returned`, `invalid_grant`, `transient_retries_exhausted`, `request_failed`) |
| `tengu_mcp_oauth_refresh_success` | `_doRefresh` | refresh succeeded |
| `tengu_mcp_server_needs_auth` | `reportNeedsAuth` | server transitions to `needs-auth` state |

### MCP — Cross-version Renames

For symbols whose semantic role is unchanged but the obfuscation letters differ between v2.1.112 and v2.1.142:

| Role | v2.1.112 | v2.1.142 |
|------|----------|----------|
| `BoundedReadBuffer.append` arg | `H` | `H` (matching field name) |
| errorMessage formatter | `b6` | `ZH` |
| execFileNoThrowWithCwd | `M7` | `O6` |
| getProjectDir | (varies) | `R9` |
| jsonParse (slowOperations) | `n8` | `x$` |
| logAntError | `Kh` | `vx` |
| logMCPDebug | `i8` | `H8` |
| logMCPError | `yz` | `$5` |
| logTelemetry | `d` | `d` (unchanged letter) |
| memoize (request dedup helper) | `aX` | `SW` |
| sleep (async) | `l7` | `a8` |

Known new themes for this window:

- `MCP_TOOL_TIMEOUT` raises per-request fetch timeout for remote HTTP/SSE servers (v2.1.142 fix — was capped at 60s)
- 16 MB SSE frame cap (v2.1.139 — prevents unbounded memory on streamed non-protocol data)
- Reserved `workspace` server name (v2.1.128)
- `alwaysLoad` server config option to skip tool-search deferral (v2.1.121)
- Reconnecting MCP servers don't flood with full tool-name lists (v2.1.128 — re-announce summarized by server prefix)
- `${var%pattern}` POSIX parameter expansion mis-flagged as missing env vars (v2.1.141 fix)
- HTTP/SSE servers returning 403 → "needs auth" not "failed" (v2.1.141 fix)
- Remote servers continue over POST when server-events stream fails (v2.1.141 fix)
- OAuth refresh tokens lost on concurrent refresh (v2.1.136 fix)
- macOS keychain race on concurrent refresh (v2.1.118 fix)
- OAuth multi-server refresh proceeding without cross-process lock (v2.1.118 fix)
- `expires_in`-less token requiring hourly re-auth (v2.1.118 fix)
- Step-up auth `insufficient_scope` re-consent (v2.1.118 fix)
- `redirectUri` for `mcp_authenticate` (v2.1.121)
- `headersHelper` config: OAuth Authenticate/Re-authenticate menu visibility (v2.1.118)
- stdio servers receive `CLAUDE_PROJECT_DIR` in env (v2.1.139)
- Plugin configs reference `${CLAUDE_PROJECT_DIR}` in commands (v2.1.139)
- stdio servers writing non-protocol to stdout causing 10GB+ RSS (v2.1.132 fix)
- `tools/list` failures retry once + show "tools fetch failed" (v2.1.132)
- claude.ai connectors: dedupe by upstream URL (v2.1.121)
- claude.ai connectors hidden by manually-added server (v2.1.122 messaging fix)
- claude.ai connectors silent disappearance on transient auth error (v2.1.121 fix)
- Remote MCP connectors: 401 on token rotation (v2.1.141 fix)
- Plugin MCP servers with unset config variables: clear "config issue" message (v2.1.141)
- `--from-pr` MCP scope fixes
- `mcp_authenticate` Microsoft 365 duplicate `prompt` parameter (v2.1.121 fix)

---

## Module: Permissions

Permission rule schema, allow/deny rule matching, `auto`/`bypass`/`acceptEdits` modes, dangerous-path checker, `permissions.deny`-vs-hook precedence, `disableBypassPermissionsMode`, classifier denial messages.

### Permissions — Core Chain

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$R6` | `applyAddRules` | cli_inner_pretty.js:421846-421849 | function |
| `BA5` | `runPermissionRequestHookForHeadlessAgent` | cli_inner_pretty.js:421635-421672 | function |
| `BDH` | `getRuleByContentsForToolName` | cli_inner_pretty.js:421608-421626 | function |
| `c64` | `groupPermissionUpdatesBySource` | cli_inner_pretty.js:421832-421845 | function |
| `d64` | `isPlanModeFloorReason` | cli_inner_pretty.js:421723-421729 | function |
| `dw8` | `isSafetyCheckNonApprovable` | cli_inner_pretty.js:421716-421722 | function |
| `EX6` | `applyReplaceRules` | cli_inner_pretty.js:421850-421861 | function |
| `eS6` | `findMatchingAskRule` (also `findGenericAskRule`) | cli_inner_pretty.js:421593-421595 | function |
| `F64` | `ORG_REQUIRES_APPROVAL_MESSAGE` | cli_inner_pretty.js:421877 | constant |
| `g64` | `findMatchingAllowRule` (also `findGenericAllowRule`) | cli_inner_pretty.js:421584-421586 | function |
| `GnH` | `filterDeniedAgents` (also `filterAgentsByDenyRule`) | cli_inner_pretty.js:421599-421604 | function |
| `GQ` | `getRuleByContentsForTool` (also `getRulesForTool`) | cli_inner_pretty.js:421605-421607 | function |
| `HR6` | `removePermissionRule` | cli_inner_pretty.js:421815-421831 | function |
| `i64` | `buildDontAskRejectMessage` | cli_inner_pretty.js (near N5) | function |
| `Iq8` | `createDenialTrackingState` (default state factory) | cli_inner_pretty.js | function |
| `N5` | `buildPermissionAskMessage` (also `buildPermissionMessage`) | cli_inner_pretty.js:421519-421564 | function |
| `oiH` | `recheckRulesAfterHookRewrite` | cli_inner_pretty.js:421627-421634 | function |
| `pA5` | `handleDenialLimitExceeded` | cli_inner_pretty.js:421681-421715 | function |
| `Q64` | `shouldProxyExpandRule` (also `proxyExpansionEligible`) | cli_inner_pretty.js:421587-421589 | function |
| `RQ` | `findSafetyCheckInDecisionReason` | cli_inner_pretty.js:421865-421874 | function |
| `rrH` | `persistDenialState` | cli_inner_pretty.js:421673-421680 | function |
| `tD` | `hasPermissionsToUseTool` | cli_inner_pretty.js:421879-422144 (export 421493) | function |
| `TL$` | `findMatchingDenyRule` (also `findGenericDenyRule`) | cli_inner_pretty.js:421590-421592 | function |
| `tS6` | `matchesPermissionRule` (also `genericToolRuleMatch`) | cli_inner_pretty.js:421575-421583 | function |
| `U64` | `mergeUpdatedInput` | cli_inner_pretty.js:421862-421864 | function |
| `UA5` | `checkRulesAndCallback` | cli_inner_pretty.js:421757-421814 | function |
| `WV6` | `findExactDenyRuleByContent` (also `findExactDenyRule`) | cli_inner_pretty.js:421596-421598 | function |
| `zM$` | `recordSuccess` (denial tracking) | cli_inner_pretty.js | function |

### Permissions — Rule Loader (cross-tier)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AC` | `persistPermissionUpdates` (within BA5) | cli_inner_pretty.js | function |
| `BNH` | `getAskRulesFromAllSources` (also `getAlwaysAskRules`) | cli_inner_pretty.js:421570-421574 | function |
| `Dk` | `applyMultiplePermissionUpdates` (also `applyPermissionUpdatesToContext`) | cli_inner_pretty.js | function |
| `mNH` | `getAllowRulesFromAllSources` (also `getAlwaysAllowRules`) | cli_inner_pretty.js:421514-421518 | function |
| `OR` | `EDITABLE_SETTING_SOURCES` (`localSettings`, `projectSettings`, `userSettings`) | cli_inner_pretty.js | constant |
| `Qz` | `applyPermissionUpdateToContext` (near 181048, setMode handling) | cli_inner_pretty.js | function |
| `r9H` | `getDenyRulesFromAllSources` (also `getAlwaysDenyRules`) | cli_inner_pretty.js:421565-421569 | function |
| `su8` | `getToolNameForPermissionCheck` (MCP-aware tool name resolver, also `getCanonicalToolName`) | cli_inner_pretty.js:50067-50069 | function |
| `xJ` | `ALL_SETTING_SOURCES` (`userSettings`, `projectSettings`, `localSettings`, `flagSettings`, `policySettings`) | cli_inner_pretty.js | constant |

### Permissions — Mode Resolution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$QK` | `getPermissionUpdateCallback` | cli_inner_pretty.js:199110-199112 | function |
| `$t1` | `isAutoCircuitBreakerOpen` (circuit-breaker check) | cli_inner_pretty.js | function |
| `agK` | `resolveModel` | cli_inner_pretty.js:199052-199063 | function |
| `aW` | `isSubprocessEnvScrubEnabled` | cli_inner_pretty.js:197361-197364 | function |
| `bu8` | `PERMISSION_DECISION_REASON_TYPES` | cli_inner_pretty.js:48450-48462 | constant |
| `dMq` | `PERMISSION_MODE_CONFIG` (`yR$` lookup table) | cli_inner_pretty.js | object |
| `eJH` | `applyPermissionUpdate` (a.k.a. `permissionUpdateCallback`; v2.1.141 honors `preserveMode`) | cli_inner_pretty.js:580705-580724 | function |
| `HQK` | `setPermissionUpdateCallback` | cli_inner_pretty.js:199107-199109 | function |
| `Hz6` | `permissionCallbackStorage` | cli_inner_pretty.js:199117 | variable |
| `iMq` | `permissionModeShortTitle` | cli_inner_pretty.js:48479 | function |
| `jc` | `getExternalPermissionMode` | cli_inner_pretty.js:48470-48472 | function |
| `ogK` | `resolveFallbackModel` | cli_inner_pretty.js:199047-199051 | function |
| `ON` | `globalAutoModeController` (module-level singleton) | cli_inner_pretty.js | variable |
| `Oq` | `getAdminSettings` (returns admin tier or null) | cli_inner_pretty.js | function |
| `pe` | `restoreDangerousPermissions` (undo strip on auto exit) | cli_inner_pretty.js | function |
| `qQK` | `clearPermissionUpdateCallback` | cli_inner_pretty.js:199113-199115 | function |
| `QMq` | `INTERNAL_PERMISSION_MODES` | cli_inner_pretty.js:48448 | constant |
| `rgK` | `resolvePermissionModeFromSources` (also `resolveModeFromSources`) | cli_inner_pretty.js:198981-199046 | function |
| `Rv` | `normalizePermissionMode` | cli_inner_pretty.js:48473-48475 | function |
| `tN` | `PERMISSION_MODES` | cli_inner_pretty.js:48449 | constant |
| `Uo` | `EXTERNAL_PERMISSION_MODES` | cli_inner_pretty.js:48447 | constant |
| `yR$` | `getPermissionModeConfig` | cli_inner_pretty.js:48467-48469 | function |
| `zAH` | `permissionModeTitle` | cli_inner_pretty.js:48476-48478 | function |
| `zR6` | `initialPermissionModeFromCLI` (also `resolvePermissionMode`) | cli_inner_pretty.js:422449-422468 | function |

### Permissions — Auto Mode Settings & Defaults

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$KA` | `classifierCritiqueSystemPrompt` | cli_inner_pretty.js:605109-605126 | constant |
| `$z8` | `formatMergedRulesForPrompt` | cli_inner_pretty.js:337968 | function |
| `AT6` | `classifierPromptTemplate` | cli_inner_pretty.js:338657 | variable |
| `bF_` | `hardDenyStageTwoPromptSuffix` (also `stage2SystemPromptSuffix`) | cli_inner_pretty.js:338625 | constant |
| `CF_` | `hardDenyStageOnePromptSuffix` (also `stage1SystemPromptSuffix`) | cli_inner_pretty.js:338623 | constant |
| `Cm8` | `hasSettingsKey` (also `hasKeyInProjectSettings`) | cli_inner_pretty.js:52604-52621 | function |
| `dI9` | `autoModeSettingsSchema` | cli_inner_pretty.js:52652-52660 | object |
| `eA8` | `extractDefaultRules` | cli_inner_pretty.js:337738-337748 | function |
| `Hz8` | `getAutoModeStateDir` | cli_inner_pretty.js:337758-337760 | function |
| `KG` | `isAutoModeGateEnabled` (live gate check) | cli_inner_pretty.js | function |
| `Kz8` | `getBuiltInClassifierRules` | cli_inner_pretty.js:337720-337727 | function |
| `llH` | `defaultsTokenString` (a.k.a. `DEFAULTS_SENTINEL`, `"$defaults"`) | cli_inner_pretty.js:338615 | constant |
| `MKA` | `countAutoModeRules` | cli_inner_pretty.js:605742-605763 | function |
| `PS7` | `classifierBuildOutput` | cli_inner_pretty.js:338657 | variable |
| `R08` | `formatCustomRulesSection` | cli_inner_pretty.js:605075-605107 | function |
| `RF_` | `stageOnePromptSuffix` (also `fastModeSystemPromptSuffix`) | cli_inner_pretty.js:338621 | constant |
| `RJ$` | `verifyAutoModeGateAccess` | cli_inner_pretty.js:422622+ | function |
| `Rm8` | `useAutoModeDuringPlan` | cli_inner_pretty.js:52568-52575 | function |
| `S08` | `hasNonDefaultRules` | cli_inner_pretty.js:605072-605074 | function |
| `srH` | `hasAutoModeOptInAnySource` (reads `skipAutoPermissionPrompt`) | cli_inner_pretty.js | function |
| `VF_` | `classifierResultSchema` (also `classifyResultSchema`) | cli_inner_pretty.js:338658 | object |
| `WAH` | `loadAutoModeRulesFromSettings` | cli_inner_pretty.js:52576-52603 | function |
| `wJ$` | `expandDefaultsList` | cli_inner_pretty.js:337707-337719 | function |
| `WS7` | `mergeAutoModeWithDefaults` | cli_inner_pretty.js:337728-337736 | function |
| `ZS7` | `buildClassifierSystemPrompt` | cli_inner_pretty.js:337750-337756 | function |

### Permissions — Classifier (`jJ$` family)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$T6` | `extractRequestIdFromClassifierResult` (req-id extraction) | cli_inner_pretty.js | function |
| `aeH` | `recordClassifierTokens` (token accounting) | cli_inner_pretty.js | function |
| `DJ$` | `CLASSIFY_RESULT_TOOL_NAME` (= `"classify_result"`) | cli_inner_pretty.js:338617 | constant |
| `fS7` | `parseStageDecision` (parse `shouldBlock` from classifier text) | cli_inner_pretty.js | function |
| `hF_` | `classifierStageResultUnionSchema` (union schema) | cli_inner_pretty.js | function |
| `HT6` | `logClassifierStage` (stage logging) | cli_inner_pretty.js | function |
| `jJ$` | `classifyYoloAction` | cli_inner_pretty.js:338324 | function |
| `JS7` | `SANDBOX_NETWORK_CLASSIFIER_TOOL_NAME` (= `"SandboxNetworkAccess"`) | cli_inner_pretty.js:338627 | constant |
| `kF_` | `classifierToolDefinition` (tool def for the classifier API) | cli_inner_pretty.js | object |
| `mA5` | `autoModeStateModule` (`isAutoModeActive`/`setAutoModeActive`) | cli_inner_pretty.js | object |
| `MS7` | `extractUsageFromClassifierResult` (usage extraction) | cli_inner_pretty.js | function |
| `OS7` | `extractClassifierReason` (parse reason from classifier text) | cli_inner_pretty.js | function |
| `qS7` | `CLASSIFIER_REQUEST_TIMEOUT_MS` (= 30 s) | cli_inner_pretty.js:337522 | constant |
| `qT6` | `runClassifierRequest` (actual API call) | cli_inner_pretty.js | function |
| `qz8` | `buildClassifierFailureReason` (failure-mode reason builder) | cli_inner_pretty.js | function |
| `tA8` | `CLASSIFIER_MAX_RETRIES` (retry count) | cli_inner_pretty.js | constant |
| `uA5` | `autoModeAllowlistedTools` (`isAutoModeAllowlistedTool` exporter) | cli_inner_pretty.js | object |
| `vF_` | `classifyResultJsonSchema` | cli_inner_pretty.js:338659+ | object |
| `xT` | `getFeatureValueCached` (`tengu_iron_gate_closed` cache) | cli_inner_pretty.js | function |
| `YT6` | `IRON_GATE_REFRESH_MS` (= 30 min, a.k.a. `classifierUnavailableCacheTtlMs`) | cli_inner_pretty.js:338628 | constant |
| `ZF_` | `EMPTY_TOOL_INPUT_PLACEHOLDER` | cli_inner_pretty.js:338614 | constant |
| `zT6` | `formatActionForClassifier` (formats tool+input for classifier) | cli_inner_pretty.js | function |

### Permissions — Hooks Layer

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `b9H` | `executePermissionRequestHooks` (hook driver) | cli_inner_pretty.js | function |
| `jDH` | `runHookOnUpdatedInput` (invoke checkPermissions on rewritten input) | cli_inner_pretty.js | function |
| `Lm6` | `validateTerminalSequence` (OSC allowlist for hook output) | cli_inner_pretty.js | function |
| `Z$` | `getFeatureValue` (feature flag lookup) | cli_inner_pretty.js | function |
| `applyHookPermissionDecision` (inline) | applyHookPermissionDecision | cli_inner_pretty.js:520600-520760 | function |

### Permissions — Managed Settings / Tier Merge

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_K$` | `iterateEnabledSettingSources` | cli_inner_pretty.js | function |
| `AK$` | `loadOsPolicyTier` (`MDq` dependency) | cli_inner_pretty.js | function |
| `aR$` | `pickKeys` (generic key picker) | cli_inner_pretty.js | function |
| `as6` | `cacheSetEffectiveSettings` (a.k.a. `setMemoizedPolicySettings`) | cli_inner_pretty.js | function |
| `B6` | `writeSettingsToTier` | cli_inner_pretty.js | function |
| `eR$` | `cachedLoadParentSettings` | cli_inner_pretty.js:52037-52042 | function |
| `fK$` | `loadParentChainTier` (`MDq` dependency) | cli_inner_pretty.js | function |
| `Gm8` | `isParentMergeEnabled` (also `shouldMergeParentChain`) | cli_inner_pretty.js:52043-52045 | function |
| `HC$` | `detectAdminTier` (also `identifyPolicySource`) | cli_inner_pretty.js:52095-52103 | function |
| `is6` | `cacheGetParentSettings` | cli_inner_pretty.js | function |
| `MDq` | `mergeAdminAndParentTiers` (also `mergeManagedPolicy`/`mergeManagedPolicyTiers`) | cli_inner_pretty.js:52104-52131 | function |
| `MK$` | `getPluginSettingsKey` | cli_inner_pretty.js:52536-52540 | function |
| `Oc` | `mergeSettingsObjects` (union/last-wins merge) | cli_inner_pretty.js | function |
| `ODq` | `cachedGetEffectiveSettings` (also `getCachedPolicySettings`) | cli_inner_pretty.js:52089-52094 | function |
| `os6` | `cacheGetEffectiveSettings` (also `getMemoizedPolicySettings`) | cli_inner_pretty.js | function |
| `ot4` | `applySettingSourcesFlag` | cli_inner_pretty.js:597740+ | function |
| `PAH` | `getSettingsFilePath` (path for each tier) | cli_inner_pretty.js | function |
| `rs6` | `cacheSetParentSettings` | cli_inner_pretty.js | function |
| `seH` | `getAllowedSettingSources` | cli_inner_pretty.js:2153 | function |
| `Tm8` | `applyParentSlice` (also `applyParentRestrictiveOnlyFilter`/`policyTierProjection`; v2.1.126 honors `allowManagedDomainsOnly`/`allowManagedReadPathsOnly`) | cli_inner_pretty.js:52046-52088 | function |
| `TMq` | `parseSettingSourcesFlag` | cli_inner_pretty.js | function |
| `uI9` | `collectAllTiers` (also `collectPolicyTierList`) | cli_inner_pretty.js:52132-52137 | function |
| `v8` | `getSettingsForTierCached` (cached read) | cli_inner_pretty.js | function |
| `Vm8` | `loadParentSettings` (also `getSettingsForTier`) | cli_inner_pretty.js:52149 | function |
| `Vv8` | `setEnabledSettingSources` | cli_inner_pretty.js | function |
| `wDq` | `getEffectiveSettings` (also `resolvePolicySettings`) | cli_inner_pretty.js:52138-52148 | function |
| `WPH` | `getAllPolicyTierSettings` | cli_inner_pretty.js:52338-52340 | function |
| `YDq` | `loadRemoteTier` (`MDq` dependency) | cli_inner_pretty.js | function |
| `YK$` | `loadHelperTier` (`MDq` dependency) | cli_inner_pretty.js | function |
| `yM` | `invalidateSettingsCache` (triggers reload after `--setting-sources`) | cli_inner_pretty.js | function |
| `zK$` | `logSettingsFileError` (per-tier error logger) | cli_inner_pretty.js | function |
| `zr6` | `eagerLoadSettings` | cli_inner_pretty.js:597748-597757 | function |

### Permissions — Rule Grammar Parsing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$I9` | `escapeRuleContent` | cli_inner_pretty.js:50100-50102 | function |
| `AI9` | `hasEmptyParens` (also `hasEmptyParenInRule`) | cli_inner_pretty.js:50215-50221 | function |
| `Be$` | `parseRuleContentExact` | cli_inner_pretty.js:207228-207232 | function |
| `BR$` | `stripMcpPrefix` | cli_inner_pretty.js:50070-50073 | function |
| `eu8` | `countUnescaped` (also `countUnescapedChars`) | cli_inner_pretty.js:50210-50214 | function |
| `FR$` | `permissionConfig` | cli_inner_pretty.js:50170-50202 | object |
| `gR$` | `permissionRuleZodSchema` | cli_inner_pretty.js:50322-50333 | object |
| `Gwq` | `isBashPrefixTool` | cli_inner_pretty.js:50162-50164 | function |
| `Hm8` | `validatePermissionRule` (also `validatePermissionRuleSyntax`) | cli_inner_pretty.js:50222-50313 | function |
| `jO` | `parseRule` | cli_inner_pretty.js:50106-50117 | function |
| `KI9` | `findFirstUnescaped` | cli_inner_pretty.js:50124-50133 | function |
| `KU` | `formatMcpTool` (also `formatToolName`) | cli_inner_pretty.js:50064-50066 | function |
| `Lwq` | `getAliasReverse` | cli_inner_pretty.js:50085-50088 | function |
| `lx` | `formatMcpServerPrefix` | cli_inner_pretty.js:50061-50063 | function |
| `nS6` | `matchRulesAgainstCommand` | cli_inner_pretty.js | function |
| `oS6` | `parseRuleContent` | cli_inner_pretty.js | function |
| `pR$` | `extractMcpToolDescription` | cli_inner_pretty.js:50074-50080 | function |
| `qI9` | `unescapeRuleContent` | cli_inner_pretty.js:50103-50105 | function |
| `Qw8` | `permissionScopeOrder` | cli_inner_pretty.js | constant |
| `su8` | `getCanonicalToolName` | cli_inner_pretty.js:50067-50069 | function |
| `Th` | `parseMcpToolName` | cli_inner_pretty.js:50054-50060 | function |
| `TT` | `getToolAlias` | cli_inner_pretty.js:50082-50084 | function |
| `tu8` | `toolNameAliases` | cli_inner_pretty.js:50149-50156 | object |
| `Twq` | `getCustomValidation` | cli_inner_pretty.js:50165-50167 | function |
| `vUH` | `parsePermissionRule` (reads `Tool(content)` into struct; used by `KY$`) | cli_inner_pretty.js | function |
| `vwq` | `isBackslashEscaped` (also `isCharEscaped`) | cli_inner_pretty.js:50204-50209 | function |
| `wz` | `formatRule` | cli_inner_pretty.js:50119-50122 | function |
| `Zwq` | `isFilePatternTool` | cli_inner_pretty.js:50159-50161 | function |
| `_I9` | `findLastUnescaped` | cli_inner_pretty.js:50134-50143 | function |

2.1.88 TS baseline references (unobfuscated): `permissionRuleValueFromString`, `permissionRuleValueToString`, `escapeRuleContent`, `unescapeRuleContent`, `mcpInfoFromString`, `normalizeLegacyToolName`, `LEGACY_TOOL_NAME_ALIASES` — all in `3rd/claude-code/src/utils/permissions/permissionRuleParser.ts` and `3rd/claude-code/src/services/mcp/mcpStringUtils.ts`.

### Permissions — Path Rule Matching (Edit/Write/Read)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$6` | `getInitialCwd` (initial cwd) | cli_inner_pretty.js | function |
| `$Q6` | `posixRelative` (also `relativizePathForRule`) | cli_inner_pretty.js:517836-517843 | function |
| `_BK` | `windowsRelative` | cli_inner_pretty.js:517844-517847 | function |
| `bN` | `getAdditionalDirectoriesUnion` (union across tiers) | cli_inner_pretty.js | function |
| `C$` | `getProjectRoot` (project root resolver) | cli_inner_pretty.js | function |
| `eq` | `normalizePath` (also `tildeExpand`) | cli_inner_pretty.js:43374 | function |
| `I$` | `getCurrentWorkingDirectory` (cwd resolver) | cli_inner_pretty.js | function |
| `Ky4` | `ignoreLibrary` (also `getIgnoreLibrary` import wrapper) | cli_inner_pretty.js | variable |
| `MP` | `posixifyPath` (also `posixifyWindowsPath`/`posixPathToWindowsPath` memoised) | cli_inner_pretty.js:42851-42860 | function |
| `My4` | `resolveSymlinkRule` | cli_inner_pretty.js:518124-518127 | function |
| `Oy4` | `getRulesByDirectory` (also `groupPathRulesByCwd`) | cli_inner_pretty.js | function |
| `Sd` | `getProjectRootCanonical` (canonical project root) | cli_inner_pretty.js | function |
| `sLH` | `windowsifyPath` (also `windowsPathToPosix` memoised) | cli_inner_pretty.js:42861-42880 | function |
| `uN` | `expandParentDirectories` (`/a/b/c` → `[/a/b/c, /a/b, /a]`) | cli_inner_pretty.js | function |
| `VkH` | `fileEditPermissionCheck` (v2.1.136 plan-mode block before settings-allow) | cli_inner_pretty.js:518202-518286 | function |
| `wy4` | `findFirstAllowingRule` | cli_inner_pretty.js:518128-518140 | function |
| `x$H` | `pathSeparator` (a.k.a. `PATH_SEP`) | cli_inner_pretty.js | constant |
| `yL` | `matchPathRule` (v2.1.133 restores `/**` when prefix empty/slash-only) | cli_inner_pretty.js:518097-518123 | function |

### Permissions — Skill Tool Rule Match (v2.1.121, v2.1.139)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aT5` | `getSkillOverrideLocalUser` | cli_inner_pretty.js:476894-476895 | function |
| `Am7` | `isUserInvocation` | cli_inner_pretty.js | function |
| `fX` | `skillToolName` | cli_inner_pretty.js:211564 | constant |
| `Np` | `getSessionSkillAllowlist` | cli_inner_pretty.js | function |
| `oT5` | `getSkillOverrideAuthority` | cli_inner_pretty.js:476885-476892 | function |
| `Q7H` | `filterSkillsByAgent` | cli_inner_pretty.js | function |
| `SnH` | `SkillToolHandler` (class) | cli_inner_pretty.js:353604+ | class |
| `SnH.checkPermissions` | `checkSkillPermissions` (v2.1.139 wildcard prefix-match fix) | cli_inner_pretty.js:353604-353658 | function |
| `SnH.validateInput` | `validateSkillInvocation` | cli_inner_pretty.js:353543-353603 | function |
| `st` | `resolveSkillOverride` | cli_inner_pretty.js:513849 | function |
| `Xy` | `findSkillByName` (also `normalizeSkillName`) | cli_inner_pretty.js | function |
| `yV6` | `loadSkills` (also `resolveAvailableSkills`) | cli_inner_pretty.js | function |

### Permissions — Bash Classifier / Static Checks

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `D7` | `AGENT_TOOL_NAME` (= `"Agent"`) | cli_inner_pretty.js | constant |
| `dz6` | `newerTimeRegex` (also `findNewerTimeRegex`; `+N`/`-N` time-spec) | cli_inner_pretty.js:205695 | constant |
| `Ee$` | `newlineHashRegex` | cli_inner_pretty.js:205787 | constant |
| `EK` | (legacy alias placeholder used in `tD` inner) | cli_inner_pretty.js | constant |
| `f0H` | `numericLiteralRegex` | cli_inner_pretty.js:205738 | constant |
| `GA5` | `shellWrappers` (sh/bash/zsh/...) | cli_inner_pretty.js | constant |
| `gUH` | `bashIntComparators` | cli_inner_pretty.js:205737 | constant |
| `gz6` | `dangerousFindFlags` (also `findDangerousFlags`; `-exec`, `-delete`, etc.) | cli_inner_pretty.js:205646 | constant |
| `JdK` | `evalClassBuiltins` | cli_inner_pretty.js:205696-205714 | constant |
| `jdK` | `zshBuiltinsBypass` | cli_inner_pretty.js:205627-205645 | constant |
| `KdK` | `topLevelNodeTypes` | cli_inner_pretty.js:205515-205519 | constant |
| `kz6` | `shellKeywords` | cli_inner_pretty.js | constant |
| `LdK` | `isDangerousCommandHead` (also `isDangerousCommand`) | cli_inner_pretty.js:205223-205225 | function |
| `lj` | `trackedVarPlaceholder` (= `"__TRACKED_VAR__"`; tree-sitter placeholder for `$VAR`) | cli_inner_pretty.js | constant |
| `LMH` | `stripWrapperPrefixesAndExtract` (used in `v64`) | cli_inner_pretty.js | function |
| `N64` | `transparentWrappersSet` (also `safeAutoAllowWrappers`) | cli_inner_pretty.js:421159-421195 | constant |
| `N98` | `safeEnvVarAllowlist` (37-entry safe env var set) | cli_inner_pretty.js | constant |
| `NY$` | `cmdSubPlaceholder` (= `"__CMDSUB_OUTPUT__"`; tree-sitter placeholder for `$(cmd)`) | cli_inner_pretty.js | constant |
| `pe1` | `bashStaticCheckOperandMap` | cli_inner_pretty.js:205728-205736 | object |
| `pz6` | `procEnvironRegex` | cli_inner_pretty.js:205787 | constant |
| `qdK` | `readBuiltinFlags` | cli_inner_pretty.js:205787 | constant |
| `Qz6` | `safeFindPredicates` (also `findSafeFlagsTakingOneArg`; `-name`, `-type`, etc.) | cli_inner_pretty.js:205647-205694 | constant |
| `Sq` | `BASH_TOOL_NAME` (= `"Bash"`) | cli_inner_pretty.js | constant |
| `T4` | (alias for `D7` in some contexts) | cli_inner_pretty.js | constant |
| `Ue1` | `commandsWithPositionalNames` | cli_inner_pretty.js:205739 | constant |
| `WdK` | `bashWrapperStripper` / `bashAstStaticCheck` (v2.1.113 find-flag check) | cli_inner_pretty.js:205239-205473 | function |
| `XdK` | `argRunningWrappers` (also `additionalWrapperStripper`) | cli_inner_pretty.js:205715-205727 | constant |
| `xZ` | `isRuntimeDetermined` (args like `$(cmd)`) | cli_inner_pretty.js | function |
| `_dK` | `unanalyzableNodeTypes` | cli_inner_pretty.js:205218 | constant |
| `ZA5` | `processControlWrappers` (nice/nohup/...) | cli_inner_pretty.js | constant |

### Permissions — Suggestion Builders

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `arH` | `formatSource` | cli_inner_pretty.js:421511-421513 | function |
| `e_` | `firstLine` | cli_inner_pretty.js | function |
| `Fw8` | `findGenericPrefix` | cli_inner_pretty.js | function |
| `MA5` | `parseHeredocPrefix` | cli_inner_pretty.js:420249-420266 | function |
| `pe$` | `suggestExactRule` | cli_inner_pretty.js:207234-207237 | function |
| `rDH` | `buildBashSuggestion` | cli_inner_pretty.js:420235-420247 | function |
| `uY$` | `suggestPrefixRule` | cli_inner_pretty.js:207239-207247 | function |
| `y64` | `appendPrefixWildcardSuggestion` | cli_inner_pretty.js:420268-420270 | function |
| `ZMq` | `formatSourceImpl` | cli_inner_pretty.js | function |

### Permissions — Dangerous Path Safety

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aP_` | `commandModeVerbMap` | cli_inner_pretty.js | object |
| `ce1` | `criticalRootChildRegex` (also `CRITICAL_WIN_DRIVE_ROOT_REGEX`) | cli_inner_pretty.js:207183 | constant |
| `Gk` | `normalizeQuoting` (also `expandTilde`) | cli_inner_pretty.js:207030-207033 | function |
| `hX6` | `buildDangerousResult` (also `askForApproval`) | cli_inner_pretty.js:274828-274834 | function |
| `Hw7` | `Hw7_pathCheckWithRmGuard` | cli_inner_pretty.js:274997 | function |
| `IX6` | `dangerousPathCheck` (also `checkRmTargets`) | cli_inner_pretty.js:274835-274851 | function |
| `le1` | `additionalCriticalPathRegex` (also `CRITICAL_WIN_TOP_LEVEL_REGEX`) | cli_inner_pretty.js:207183 | constant |
| `nUH` | `isCriticalPath` | cli_inner_pretty.js:207091-207105 | function |
| `oP_` | `rmCommandRegex` (also `RM_RMDIR_COMMAND_REGEX`) | cli_inner_pretty.js:275265 | constant |
| `OVH` | `commandModeMap` | cli_inner_pretty.js | object |
| `oz6` | `osPathHelper` | cli_inner_pretty.js | variable |
| `rP_` | `rmTargetRegex` (also `DOLLAR_PREFIX_PATH_REGEX`) | cli_inner_pretty.js:275264 | constant |
| `sP_` | `pathPermissionPredicates` | cli_inner_pretty.js | object |
| `tM7` | `detectShellRmTarget` | cli_inner_pretty.js:274852-274879 | function |
| `tP_` | `tP_pathPermissionCheck` | cli_inner_pretty.js:274936-274996 | function |
| `vdH` | `positionalArgParsers` (also `COMMAND_ARG_EXTRACTORS`) | cli_inner_pretty.js:275266-275533 | object |

### Permissions — Dangerously-Skip Path Bypass

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_u5` | `isSensitivePath` (a.k.a. `isCredentialOrSecretFile`; v2.1.121/v2.1.126 expand `.claude/` carve-out) | cli_inner_pretty.js:517915-517941 | function |
| `_y4` | `isInPlanDirectory` | cli_inner_pretty.js:517870-517876 | function |
| `ah` | `isDescendantOf` | cli_inner_pretty.js:517999-518009 | function |
| `bA6` | `dotEnvVariants` | cli_inner_pretty.js:197669-197678 | constant |
| `bY$` | `pathSafetyCheck` | cli_inner_pretty.js:517958-517989 | function |
| `ex5` | `skillPathFromContext` | cli_inner_pretty.js:517812-517835 | function |
| `GI` | `isInAllowedDirectories` | cli_inner_pretty.js:517994-517998 | function |
| `Hu5` | `getManagedSettingsList` | cli_inner_pretty.js:517848-517852 | function |
| `hw8` | `isSettingsFile` | cli_inner_pretty.js:517853-517862 | function |
| `KQ6` | `isTrustedNetworkPath` | cli_inner_pretty.js:517910-517914 | function |
| `Ku5` | `isInWorktree` | cli_inner_pretty.js:517881-517885 | function |
| `mc_` | `teamSkillDiscoveryPaths` | cli_inner_pretty.js:352143 | constant |
| `pd` | `isUNCPath` | cli_inner_pretty.js | function |
| `pl` | `getAllWorkingDirs` | cli_inner_pretty.js:517991-517993 | function |
| `qQ6` | `isWSL` | cli_inner_pretty.js:517907-517909 | function |
| `qu5` | `isInScratchpadJs` | cli_inner_pretty.js:517877-517880 | function |
| `sl` | `isUNCStrict` | cli_inner_pretty.js | function |
| `St$` | `getSandboxRipgrepExcludes` | cli_inner_pretty.js:195125-195127 | function |
| `sx5` | `protectedFilesList` | cli_inner_pretty.js | constant |
| `tx5` | `protectedDirectoriesList` | cli_inner_pretty.js | constant |
| `Va1` | `vsCodeIdeaExcludes` | cli_inner_pretty.js:195302 | constant |
| `xa1` | `buildSandboxExcludeGlobs` | cli_inner_pretty.js:195855-195863 | function |
| `Yy4` | `hasSuspiciousWindowsPattern` | cli_inner_pretty.js:517942-517957 | function |
| `y2` | `caseFoldedSegment` | cli_inner_pretty.js | function |
| `$u5` | `isSettingsOrUserCustomization` | cli_inner_pretty.js:517863-517869 | function |

### Permissions — Multi-Tier Settings Merge (top-level helpers)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ix` | `hasSkipDangerousPrompt` | cli_inner_pretty.js:52541-52548 | function |
| `jR` | `hasAutoModeOptIn` | cli_inner_pretty.js:52552-52567 | function |
| `QI9` | `hasIsolatePeerMachines` | cli_inner_pretty.js:52549-52551 | function |

### Permissions — UI Prompt Rendering

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `i9` | `recheckQueueRef` (useRef) | cli_inner_pretty.js | variable |
| `jt` | `promptEventBus` (`.emit`) | cli_inner_pretty.js | object |
| `recheckPermission` (inline method) | recheckPermission | cli_inner_pretty.js:580714-580720 | function |

### Permissions — Settings Schema (top-level keys)

| Key | File:Line | Notes |
|-----|-----------|-------|
| `additionalDirectories` | cli_inner_pretty.js:50349 | top-level |
| `allowManagedHooksOnly` | cli_inner_pretty.js:50547 | top-level |
| `allowManagedMcpServersOnly` | cli_inner_pretty.js (near hooks key) | top-level |
| `allowManagedPermissionRulesOnly` | cli_inner_pretty.js (near hooks key) | top-level |
| `autoMode.allow` | cli_inner_pretty.js:49995+ | autoMode object |
| `autoMode.deny` | cli_inner_pretty.js (legacy alias) | autoMode object |
| `autoMode.environment` | cli_inner_pretty.js (facts list) | autoMode object |
| `autoMode.hard_deny` | cli_inner_pretty.js:50004-50008 | v2.1.136 — unconditional-block rules |
| `autoMode.soft_deny` | cli_inner_pretty.js:49998+ | autoMode object |
| `cleanupPeriodDays` | cli_inner_pretty.js:50403-50410 | top-level |
| `parentSettingsBehavior` | cli_inner_pretty.js:50659-50666 | admin-tier only, v2.1.133 (`"first-wins"` \| `"merge"`) |
| `permissions.defaultMode` | cli_inner_pretty.js (within permissions schema) | top-level |
| `permissions.disableBypassPermissionsMode` | cli_inner_pretty.js (within permissions schema) | top-level |
| `sandbox.autoAllowBashIfSandboxed` | cli_inner_pretty.js:48351 | sandbox object — pre-v2.1.142, used by v2.1.139 AST path |
| `sandbox.bwrapPath` | cli_inner_pretty.js:48374-48380 | v2.1.133 |
| `sandbox.filesystem.allowManagedReadPathsOnly` | cli_inner_pretty.js:48334-48337 | pre-v2.1.142, wired in v2.1.126 |
| `sandbox.network.allowManagedDomainsOnly` | cli_inner_pretty.js:48265-48269 | pre-v2.1.142, wired in v2.1.126 |
| `sandbox.network.deniedDomains` | cli_inner_pretty.js:48259-48263 | v2.1.113 |
| `sandbox.socatPath` | cli_inner_pretty.js:48381-48388 | v2.1.133 |
| `sandbox.tlsTerminate` | cli_inner_pretty.js:48298-48303 | top-level |
| `skillOverrides` | top-level | v2.1.129 — `{ [skillName]: "on" \| "name-only" \| "user-invocable-only" \| "off" }` |
| `skipAutoPermissionPrompt` | cli_inner_pretty.js:49982 | top-level |
| `useAutoModeDuringPlan` | cli_inner_pretty.js (checked in `Rm8`) | top-level |
| `wslInheritsWindowsSettings` | cli_inner_pretty.js:50427-50429 | top-level |

### Permissions — Decision Reasons

`decisionReason.type` discriminants used in permission decisions (string-literal constants):

| Value | Where set | Meaning |
|-------|-----------|---------|
| `"asyncAgent"` | Background agents | Async agent reason |
| `"classifier"` | Auto-mode | Auto-mode classifier blocked |
| `"hook"` | Hook path | A hook returned a decision |
| `"mode"` | Plan/auto/bypass paths | Decision driven by current mode |
| `"other"` | Catchall | Custom reason in `.reason` field |
| `"permissionPromptTool"` | SDK | SDK's permissionPromptTool returned |
| `"rule"` | Many places | A `permissions.{allow,deny,ask}` rule matched |
| `"safetyCheck"` | `bY$`, `iUH` | Path was dangerous; safety check triggered |
| `"sandboxOverride"` | Sandbox | Sandbox-related override |
| `"subcommandResults"` | Compound bash | Multiple parts of a compound need approval |
| `"workingDir"` | `VkH` | Path was outside allowed working directories |

Known new themes for this window:

- `Skill(name *)` wildcard prefix match (v2.1.139)
- `Edit`/`Write` allow rules scoped to drive root (C:\) or POSIX / no longer always prompt (v2.1.133 fix)
- Mapped network drives via `--add-dir`/`additionalDirectories` (v2.1.133 fix)
- Plan mode honors `Edit(...)` allow rules instead of bypassing block (v2.1.136 fix)
- Permission mode autodismiss on tool-permission prompt when new setting permits (v2.1.141 fix)
- `--dangerously-skip-permissions` no longer prompts for `.claude/skills/`, `.claude/agents/`, `.claude/commands/` (v2.1.121)
- `--dangerously-skip-permissions` bypass for `.claude/`, `.git/`, `.vscode/`, shell config (v2.1.126 — catastrophic removal still prompts)
- Bash `dangerouslyDisableSandbox` permission prompt fix (v2.1.113)
- Auto mode classifier explains `permissions.ask` rule trigger (v2.1.141)
- Auto mode opt-in "Don't ask again" (v2.1.118)
- Auto mode `$defaults` aliases for allow/soft_deny/environment (v2.1.118)
- Auto mode classifier error includes hint (v2.1.128)
- Auto mode `hard_deny` for unconditional blocks (v2.1.136)
- Auto mode permission dialog explains `permissions.ask` (v2.1.141)
- `permission-mode` flag respect during plan-mode resume (v2.1.132)
- "Always allow" rules for built-in tools in remote sessions surviving worker restarts (v2.1.121 fix)
- `denied-mcp-servers` patterns with `*://` scheme wildcard matching mixed-case hostnames (v2.1.129 fix)
- "Allowed by PermissionRequest hook" repeating once per tool call (v2.1.141 fix)
- Switching permission mode while permission prompt is open auto-dismisses (v2.1.141)
- `cd <current-directory> && git ...` no longer prompts (v2.1.113)
- macOS `/private/{etc,var,tmp,home}` treated as dangerous removal targets (v2.1.113)
- Bash deny rules match `env`/`sudo`/`watch`/`ionice`/`setsid` wrappers (v2.1.113)
- `Bash(find:*)` no longer auto-approves `find -exec`/`-delete` (v2.1.113)
- `autoAllowBashIfSandboxed` honors shell expansions (`$VAR`, `$(cmd)`) (v2.1.139 fix)

---

## Module: Sandbox

Bubblewrap/socat (Linux/WSL), darwin app-sandbox, PID-namespace isolation, allowed/denied domains, dangerous-path safety net.

### Sandbox — Schema

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `hu8` | `sandboxSchemaPathModule` | cli_inner_pretty.js:48254 | variable |
| `Lh9` | `SandboxFilesystemConfigSchema` | cli_inner_pretty.js:48307-48340 | function |
| `Xh9` | `SandboxNetworkConfigSchema` | cli_inner_pretty.js:48253-48306 | function |
| `yMq` | `SandboxSettingsSchema` | cli_inner_pretty.js:48341-48390 | function |

### Sandbox — Bwrap/Socat Path Resolution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `eX` | `getOSPolicyConfigDir` | cli_inner_pretty.js:48221-48230 | function |
| `Fx` | `whichExecutable` (executable-aware which) | cli_inner_pretty.js | function |
| `MgK` | `getSocatPath` | cli_inner_pretty.js:197243-197247 | function |
| `pq$` | `getManagedSettingsDir` | cli_inner_pretty.js:48231-48233 | function |
| `q7H` | `whichBinary` (plain which) | cli_inner_pretty.js | function |
| `Qt$` | `resolveBubblewrap` | cli_inner_pretty.js:197248-197252 | function |
| `tz$` | `getBwrapPath` | cli_inner_pretty.js:197238-197242 | function |
| `Uq$` | `isWSL` (sandbox-scope helper) | cli_inner_pretty.js:48235-48243 | function |
| `ZFK` | `isExecutable` | cli_inner_pretty.js:195520-195526 | function |

### Sandbox — Dangerous-Path Safety (rm/rmdir)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aw` | `strippedPositionalArgs` | cli_inner_pretty.js:274880-274888 | function |
| `bV` | `shouldSandboxThisCommand` (a.k.a. `isSupportedSandboxCommand`) | cli_inner_pretty.js:421425-421432 | function |
| `EA5` | `cdCompoundCheck` | cli_inner_pretty.js:420707 | function |
| `kA5` | `noPipelineSeparators` | cli_inner_pretty.js:420684-420693 | function |
| `kdH` | `isSafeEnvVar` (also `isSafeEnvVarName`) | cli_inner_pretty.js:420274-420276 | function |
| `NA5` | `cdSafePathCheck` | cli_inner_pretty.js:420694-420706 | function |
| `RA5` | `isCommandExcludedFromSandbox` | cli_inner_pretty.js:421383-421424 | function |
| `TA5` | `stripEnvVarPrefixes` (also `stripSafeEnvPrefix`) | cli_inner_pretty.js:420633-420643 | function |
| `V64` | `permissionRouter` | cli_inner_pretty.js:420542-420550 | function |
| `v64` | `sandboxAutoAllowAstAware` (v2.1.116 dangerous-path safety + v2.1.139 AST-aware) | cli_inner_pretty.js:420551-420579 | function |
| `vA5` | `filterCdPrefixes` | cli_inner_pretty.js:420674-420683 | function |
| `WA5` | `sandboxAutoAllowSingleLine` (also `autoAllowSingleCmdChecker`) | cli_inner_pretty.js:420580-420632 | function |
| `VA5` | `sandboxAutoAllowRuleCheck` (also `staticRuleCheck`) | cli_inner_pretty.js:420644-420673 | function |
| `yX6` | `createFlagAwareArgExtractor` | cli_inner_pretty.js:274889-274904 | function |
| `$W$` | `safeEnvVarSet` | cli_inner_pretty.js:421198 | constant |
| `Bz6` | `dangerousEnvVarPredicate` | cli_inner_pretty.js:205232-205235 | function |
| `cz6` | `integerEvalEnvVarSet` | cli_inner_pretty.js:205755-205786 | constant |
| `Fe1` | `pathLikeEnvVarSet` | cli_inner_pretty.js:205740-205754 | constant |
| `lz6` | `mostDangerousEnvVarPredicate` | cli_inner_pretty.js:205236-205238 | function |

### Sandbox — Bash Rule Matching (sandbox interop)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `gw8` | `bashExactRuleMatch` | cli_inner_pretty.js:421081-421094 | function |
| `h64` | `bashPrefixRuleMatch` | cli_inner_pretty.js:421095-421128 | function |
| `Qw8` | `permissionScopeOrder` | cli_inner_pretty.js | constant |
| `uNH` | `bashRuleMatcher` | cli_inner_pretty.js:420533-420541 | function |

### Sandbox — Network Filter

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `da1` | `initializeSandboxNetwork` | cli_inner_pretty.js:196407-196483 | function |
| `e9` | `sandboxConfig` (module-level cache) | cli_inner_pretty.js | variable |
| `EUH` | `getAllowManagedDomainsOnly` | cli_inner_pretty.js:198101-198103 | function |
| `Fa1` | `getMitmSocketPathForHost` | cli_inner_pretty.js:196359-196364 | function |
| `FD` | `WEB_FETCH_TOOL_NAME` (= `"WebFetch"`) | cli_inner_pretty.js | constant |
| `ga1` | `startHttpProxyServer` | cli_inner_pretty.js:196365-196389 | function |
| `G7` | `EDIT_TOOL_NAME` (= `"Edit"`) | cli_inner_pretty.js | constant |
| `hA6` | `matchesHostPattern` | cli_inner_pretty.js:196333-196343 | function |
| `ia1` | `getNetworkPermissionConfig` | cli_inner_pretty.js:196505-196510 | function |
| `KY$` | `buildSandboxConfig` | cli_inner_pretty.js:198104-198218 | function |
| `nz$` | `isValidHost` | cli_inner_pretty.js | function |
| `NUK` | `canonicalizeHost` (IDN/lowercase) | cli_inner_pretty.js | function |
| `OA6` | `resolveParentProxyConfig` | cli_inner_pretty.js | function |
| `pFK` | `networkPermissionFilter` | cli_inner_pretty.js:196344-196358 | function |
| `Qa1` | `startSocksProxyServer` | cli_inner_pretty.js:196390-196406 | function |
| `rUK` | `makeMitmTlsTerminator` | cli_inner_pretty.js | function |
| `ta1` | `applySandboxToCommand` | cli_inner_pretty.js:196566-196641 | function |

### Sandbox — Linux bwrap Wrapper

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ba1` | `buildBwrapMountArgs` | cli_inner_pretty.js:195631-195743 | function |
| `Ca1` | `buildBridgedShellCommand` | cli_inner_pretty.js:195612-195630 | function |
| `ha1` | `hasFileAncestor` | cli_inner_pretty.js:195421-195436 | function |
| `Ia1` | `firstNonExistentPath` | cli_inner_pretty.js:195437-195447 | function |
| `It$` | `isPathOutsideExpected` (symlink check helper) | cli_inner_pretty.js | function |
| `jI` | `resolvePathPrefix` | cli_inner_pretty.js | function |
| `K7H` | `normalizeAllowPath` | cli_inner_pretty.js | function |
| `Lk` | `isGlobPattern` | cli_inner_pretty.js | function |
| `Ra1` | `buildSeccompArgvPrefix` | cli_inner_pretty.js:195604-195611 | function |
| `Sa1` | `enumerateDangerousFiles` | cli_inner_pretty.js:195448-195519 | function |
| `TFK` | `checkSandboxDependencies` | cli_inner_pretty.js:195527-195539 | function |
| `VFK` | `spawnNetworkBridges` | cli_inner_pretty.js:195540-195602 | function |
| `vFK` | `linuxBwrapWrapper` | cli_inner_pretty.js:195744-195831 | function |
| `w3H` | `escapeForRegex` | cli_inner_pretty.js | function |
| `ya1` | `findSymlinkAncestor` | cli_inner_pretty.js:195404-195420 | function |

### Sandbox — Apply-Seccomp Helper

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bgK` | `getSeccompConfig` (builds `{applyPath, argv0}`) | cli_inner_pretty.js | function |
| `Ea1` | `findSeccompBinaryImpl` | cli_inner_pretty.js:195373-195388 | function |
| `gA6` | `seccompBundledFd` (file descriptor for bundled binary) | cli_inner_pretty.js | variable |
| `ka1` | `listGlobalInstallDirs` | cli_inner_pretty.js | function |
| `Na1` | `listBundleSearchPaths` | cli_inner_pretty.js:195356-195366 | function |
| `RgK` | `isBundledSeccompAvailable` | cli_inner_pretty.js | function |
| `sa1` | `getSeccompConfigRuntime` | cli_inner_pretty.js:196541-196543 | function |
| `TA6` | `seccompBinaryCache` | cli_inner_pretty.js:195394 | variable |
| `vA6` | `findSeccompBinary` | cli_inner_pretty.js:195367-195372 | function |
| `VA6` | `seccompResolvedArch` | cli_inner_pretty.js:195395 | variable |
| `XFK` | `detectArchitecture` | cli_inner_pretty.js:195335-195355 | function |

### Sandbox — Subprocess Env Scrub

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `A7H` | `isScrubSandboxAvailable` | cli_inner_pretty.js:197370-197373 | function |
| `BA6` | `enforceScriptCaps` (script-caps enforcer) | cli_inner_pretty.js | function |
| `ct$` | `cachedBwrapAvail` (module-level cache) | cli_inner_pretty.js | variable |
| `dt$` | `cachedScrubFlag` (module-level cache) | cli_inner_pretty.js | variable |
| `JgK` | `SAFE_PATH_PREFIXES` (path-filter prefixes) | cli_inner_pretty.js | constant |
| `mA6` | `assertScrubSandboxAvailable` | cli_inner_pretty.js:197374-197439 | function |
| `ou` | `sandboxContext` (module-level cache) | cli_inner_pretty.js | variable |
| `UA6` | `scrubSandboxConfig` (scrub sandbox state) | cli_inner_pretty.js | function |
| `Vs1` | `registerEgressGatewayEnvFn` (also `registerUpstreamProxyEnvFn`) | cli_inner_pretty.js | function |
| `Ws1` | `shouldUseMcpAllowlistEnv` (note: shares the same readable as `pA6`) | cli_inner_pretty.js:197365-197369 | function |
| `XgK` | `parseScriptCapsConfig` | cli_inner_pretty.js | function |
| `Z3H` | `SUBPROCESS_SCRUB_LIST` (25-var scrub list) | cli_inner_pretty.js | constant |

### Sandbox — macOS Sandbox Profile

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aa1` | `getMandatoryDenySearchDepth` | cli_inner_pretty.js:196535-196537 | function |
| `cFK` | `getIgnoreViolations` | cli_inner_pretty.js:196523-196525 | function |
| `dFK` | `getAllowMachLookup` | cli_inner_pretty.js:196520-196522 | function |
| `gFK` | `getAllowUnixSockets` | cli_inner_pretty.js:196511-196513 | function |
| `lFK` | `getEnableWeakerNestedSandbox` | cli_inner_pretty.js:196526-196528 | function |
| `oa1` | `getRipgrepConfig` | cli_inner_pretty.js:196532-196534 | function |
| `pa1` | `buildMacOSSandboxProfile` | cli_inner_pretty.js:195952-196183 | function |
| `pt$` | `macSandboxLogMonitor` | cli_inner_pretty.js | variable |
| `QFK` | `getAllowLocalBinding` | cli_inner_pretty.js:196517-196519 | function |
| `ra1` | `getEnableWeakerNetworkIsolation` | cli_inner_pretty.js:196529-196531 | function |
| `RFK` | `startMacOSSandboxLogMonitor` | cli_inner_pretty.js | function |
| `SFK` | `applyMacOSSandbox` (macOS sandbox-exec) | cli_inner_pretty.js | function |
| `uFK` | `getAllowGitConfig` | cli_inner_pretty.js:196538-196540 | function |
| `Ut$` | `macSandboxViolationsAggregator` (violations cache) | cli_inner_pretty.js | variable |
| `w0` | `shellEscapeSandboxString` (sandbox-profile escaper) | cli_inner_pretty.js | function |
| `xFK` | `getAllowAllUnixSockets` | cli_inner_pretty.js:196514-196516 | function |

### Sandbox — `autoAllowBashIfSandboxed` Module (`n6.*`)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `n6.areSandboxSettingsLockedByPolicy` | `areSandboxSettingsLockedByPolicy` | cli_inner_pretty.js | function |
| `n6.areUnsandboxedCommandsAllowed` | `areUnsandboxedCommandsAllowed` (`allowUnsandboxedCommands` gate) | cli_inner_pretty.js | function |
| `n6.checkDependencies` | `checkSandboxDependencies` (wraps `TFK`) | cli_inner_pretty.js | function |
| `n6.getFsWriteConfig` | `getFilesystemWriteConfig` | cli_inner_pretty.js:207035-207043 | function |
| `n6.isAutoAllowBashIfSandboxedEnabled` | `isAutoAllowBashIfSandboxedEnabled` | cli_inner_pretty.js:198251-198254 | function |
| `n6.isPlatformInEnabledList` | `isPlatformInEnabledList` | cli_inner_pretty.js:198262-198266 | function |
| `n6.isSandboxingEnabled` | `isSandboxingEnabled` | cli_inner_pretty.js:198248 | function |
| `n6.isSupportedPlatform` | `isSandboxSupportedPlatform` (platform gate) | cli_inner_pretty.js | function |
| `n6.setSandboxSettings` | `setSandboxSettings` (state mutator) | cli_inner_pretty.js | function |

### Sandbox — Init / State

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AY$` | `sandboxConfigCache` (`.cache.clear` method) | cli_inner_pretty.js | object |
| `Cs1` | `resolveProjectRoot` (used by `Qs1`) | cli_inner_pretty.js | function |
| `dA6` | `settingsSubscriptionHandle` | cli_inner_pretty.js | variable |
| `ds1` | `refreshSandboxFromSettings` | cli_inner_pretty.js:198383-198388 | function |
| `Iv` | `wslManagedSettingsRoot` (WSL managed settings root) | cli_inner_pretty.js | constant |
| `iM` | `sandboxRuntimeAdapter` (`wrapWithSandbox`/`initialize`/`updateConfig`) | cli_inner_pretty.js | object |
| `JI` | `settingsChangeEmitter` (`.subscribe`) | cli_inner_pretty.js | object |
| `JO` | `normalizeAllowPathRule` (used in `KY$` for managed settings paths) | cli_inner_pretty.js | function |
| `kUH` | `normalizeSandboxFsPath` (sandbox FS path normalize) | cli_inner_pretty.js | function |
| `n6` | `sandboxModuleObject` | cli_inner_pretty.js:198248+ | object |
| `NUH` | `resolvedProjectRoot` (post-`Cs1` cache) | cli_inner_pretty.js | variable |
| `qY$` | `bareRepoPlantList` (missing-but-mac-eligible repo files) | cli_inner_pretty.js | variable |
| `Qs1` | `initializeSandboxIfPossible` | cli_inner_pretty.js:198353-198382 | function |
| `Rs1` | `scrubBareRepoPlants` | cli_inner_pretty.js:198220-198228 | function |
| `rt$` | `resolveTierRelativePath` (tier path to abs) | cli_inner_pretty.js | function |
| `sGH` | `filesystemStatModule` (`fs.statSync`, `fs.lstatSync`) | cli_inner_pretty.js | object |
| `W3H` | `sandboxInitPromise` (memoize init) | cli_inner_pretty.js | variable |
| `wC` | `getInitialCwdRelative` (workCwd marker) | cli_inner_pretty.js | function |

Known new themes for this window:

- `sandbox.network.deniedDomains` (v2.1.113)
- `sandbox.bwrapPath`/`sandbox.socatPath` managed settings (v2.1.133)
- Dangerous-path check no longer bypassed by sandbox auto-allow for `rm`/`rmdir` (v2.1.116)
- `allowManagedDomainsOnly`/`allowManagedReadPathsOnly` ignored on higher-priority source lacking `sandbox` block (v2.1.126 security fix)
- `parentSettingsBehavior` admin key (`first-wins` / `merge`) for SDK `managedSettings` policy merge (v2.1.133)

---

## Module: Auth

OAuth login/logout/refresh, `apiKeyHelper`, `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_API_KEY`, Bedrock SigV4, Vertex Workload Identity Federation, credentials.json layout.

*(Most auth-specific symbols overlap with the MCP OAuth Refresh Defense section above. See `MCP — OAuth Refresh Defense` for `kNH` (`McpOAuthProvider`), `kU` (`invalidateCredentialStorageCache`), `o9` (`getSecureMcpOAuthStorage`), `PX` (`getMcpServerKey`), etc.)*

Known new themes for this window:

- `ANTHROPIC_WORKSPACE_ID` for Workload Identity Federation (v2.1.141)
- Vertex AI X.509-based WIF (mTLS ADC) (v2.1.121)
- Bedrock `awsCredentialExport` always runs (v2.1.141)
- Bedrock `ANTHROPIC_BEDROCK_SERVICE_TIER` env var (v2.1.122 — sent as `X-Amzn-Bedrock-Service-Tier`)
- Bedrock 400 on `output_config.effort` for non-effort models (v2.1.122 fix)
- Bedrock IP ARN + Opus 4.7 + thinking disabled 400 (v2.1.117 fix)
- Bedrock IP ARN doesn't surface `output_config.effort` (v2.1.122 fix)
- Vertex AI count_tokens 400 with proxy gateways (v2.1.122 fix)
- Vertex/Bedrock `output_config: Extra inputs are not permitted` 400 (v2.1.122 fix)
- Remote MCP/OAuth refresh wiping shared credentials (v2.1.133 fix)
- Token refresh race on wake-from-sleep (v2.1.129)
- Credential save crash on Linux/Windows corrupting `~/.claude/.credentials.json` (v2.1.118 fix)
- `claude auth login` OAuth code paste fallback (v2.1.126)
- `CLAUDE_CODE_OAUTH_TOKEN` env var clears on `/login` (v2.1.118 fix)
- Token rotation race in Remote Control (v2.1.141 fix)
- 401 retry loop on `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1` (v2.1.123 fix)
- Remote managed settings 401 retry with force-refreshed token (v2.1.140 fix)
- "OAuth not allowed for organization" → guidance vs login screen (v2.1.126)
- 401 mid-session reactive refresh on plain CLI OAuth (v2.1.117 fix)
- "Please run /login" race with concurrent credential write (v2.1.126/136 fixes)
- `forceRemoteSettingsRefresh` + expired creds deadlock on `claude auth` (v2.1.139 fix)
- Desktop/3P provider sessions inheriting `apiKeyHelper`/`ANTHROPIC_AUTH_TOKEN` from host managed-settings (v2.1.141 fix)
- Mantle endpoint `x-api-key` header (v2.1.131 fix)

---

## Module: Model Selection

Model alias resolution, `/model` picker, default-model resolution (`opus` alias, `getDefaultEffortForModel`), 3P-provider model overrides, gateway `/v1/models` discovery.

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new themes for this window:

- Fast Mode default Opus 4.6 → 4.7 (v2.1.142, override env: `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE=1`)
- Default effort for Pro/Max on Opus 4.6 & Sonnet 4.6 is `high` (was `medium`) (v2.1.117)
- `/model` picker collapses duplicate Opus 4.7 entries (v2.1.128)
- `/model` picker shows source pin in startup header (v2.1.117)
- `/model` picker lists gateway models from `/v1/models` (v2.1.126) — later opt-in (v2.1.129) via `CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY=1`
- `ANTHROPIC_DEFAULT_OPUS_MODEL`/`SONNET_MODEL` overrides reflected in "Default" row (v2.1.139 fix)
- `ANTHROPIC_DEFAULT_*_MODEL_NAME`/`_DESCRIPTION` honored with custom `ANTHROPIC_BASE_URL` (v2.1.118)
- `--model` flag for `claude agents` dispatch (v2.1.142)
- Background side-queries Haiku fallback on Bedrock/Vertex/Foundry when no `ANTHROPIC_SMALL_FAST_MODEL` override (v2.1.141 fix)
- Custom base URL gateway not auto-naming background jobs (v2.1.141 fix)
- `set_model` redundant requests injecting duplicate `/model` breadcrumbs (v2.1.142 fix)
- `/model` in one session changing autocompact threshold in others (v2.1.141 fix)
- Subagents running different model from main agent flagging file reads with malware warning (v2.1.117 fix)
- Stale `/model claude-sonnet-4-20250514` suggestion in Usage Policy refusal removed (v2.1.142)

---

## Module: Prompt Building

System-prompt composition, tool-section ordering, environment description block, CLAUDE.md injection, output-style overlay.

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new themes for this window:

- Plugin SKILL.md at root surfaces as skill (v2.1.142)
- Prompt suggestions disabled with output style (v2.1.141 fix)
- Compaction prompt asks to preserve sensitive user instructions (v2.1.139)
- `/context` "providing plugin" name for plugin-sourced skills (v2.1.139)
- `/context` dumping rendered ASCII grid into conversation (v2.1.129 fix — was wasting 1.6k tokens/call)
- `/context all` per-skill token estimates account for tokenizer (v2.1.139)

---

## Module: Telemetry

OpenTelemetry spans, metrics, log events, attribute taxonomy, sampling rules, OTLP endpoint configuration.

*(Most telemetry symbols appear in the MCP and Shell Snapshot sections; see also `d` (`logEvent`), `RH` (`recordSpanSuccess`), `J8` (`recordSpanFailure`), `EH` (`logError`) listed under Shell Snapshot — Telemetry / Spans.)*

Known new themes for this window:

- Subprocesses no longer inherit `OTEL_*` env vars (v2.1.128)
- `stop_reason`, `gen_ai.response.finish_reasons`, `user_system_prompt` (gated by `OTEL_LOG_USER_PROMPTS`) (v2.1.121)
- `invocation_trigger` attribute on `claude_code.skill_activated` (v2.1.126)
- `claude_code.skill_activated` fires for user-typed slash commands (v2.1.126)
- `claude_code.at_mention` log event (v2.1.122)
- `claude_code.pull_request.count` counts MCP-tool-created PRs/MRs (v2.1.129)
- `claude_code.active_time.total` not emitted in `--print` mode (v2.1.139 fix)
- `tool_result` / `tool_decision` include `tool_use_id`; `tool_result` includes `tool_input_size_bytes` (v2.1.119)
- `user_prompt` event includes `command_name` / `command_source` (v2.1.117)
- `cost.usage`, `token.usage`, `api_request`, `api_error` include `effort` attribute (v2.1.117)
- Custom/MCP command names redacted unless `OTEL_LOG_TOOL_DETAILS=1` (v2.1.117)
- Numeric attributes on `api_request`/`api_error` emitted as numbers, not strings (v2.1.122)
- Subagent API headers `x-claude-code-agent-id`/`parent-agent-id` + OTel span attributes (v2.1.139)
- Early OTel spans dropped in SDK/headless with beta tracing (v2.1.141 fix)
- `DISABLE_TELEMETRY`/`CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` suppression (v2.1.120 fix)
- `CLAUDE_CODE_ENABLE_FEEDBACK_SURVEY_FOR_OTEL` (v2.1.136)
- Host-managed deployments no longer auto-disable analytics on Bedrock/Vertex/Foundry (v2.1.126)
- Early analytics events dropped before logger initialization (v2.1.141 fix)
- `forceRemoteSettingsRefresh` policy interactions (v2.1.140 fixes)

---

## Module: Shell Snapshot

Shell-environment capture for the `Bash` tool (`~/.claude/shell-snapshots/snapshot-{shell}-{ts}-{rand}.sh`), shell provider, command assembly (eval wrap, NUL substitution), embedded ripgrep/find/grep integrations, subprocess env scrub, retention cleanup sweep, plugin bin discovery.

### Shell Snapshot — Snapshot Creation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ai_` | `createFindGrepShellIntegration` (v2.1.142: passes `denyPatterns` for grep wrapper) | cli_inner_pretty.js:360516-360530 | function |
| `cY8` | `require("fs/promises")` (module ref) | cli_inner_pretty.js:360815 | variable |
| `fi_` | `getClaudeCodeSnapshotContent` | cli_inner_pretty.js:360597-360660 | function |
| `hv6` | `SNAPSHOT_CREATION_TIMEOUT` | cli_inner_pretty.js:360694 | constant |
| `ip7` | `createAndSaveSnapshot` | cli_inner_pretty.js:360697-360798 | function |
| `Iv6` | `createArgv0ShellFunction` (v2.1.142: 4th param `denyPatterns`; baked install path replaces `command -v claude`) | cli_inner_pretty.js:360476-360508 | function |
| `Ki_` | `createRipgrepShellIntegration` | cli_inner_pretty.js:360509-360515 | function |
| `lY8` | `require("os")` (module ref) | cli_inner_pretty.js:360815 | variable |
| `ne` | `getInstallBinDir` (returns `~/.local/bin`; baked into argv0 functions) | cli_inner_pretty.js:313906-313909 | function |
| `np7` | `require("child_process")` (module ref) | cli_inner_pretty.js:360815 | variable |
| `Oi_` | `getSnapshotScript` | cli_inner_pretty.js:360661-360688 | function |
| `Rv6` | `CLAUDE_CODE_EXECPATH_ENV` | cli_inner_pretty.js:360695 | constant |
| `Sv6` | `getConfigFile` | cli_inner_pretty.js:360534-360537 | function |
| `vX$` | `require("path")` (module ref) | cli_inner_pretty.js:360815 | variable |
| `Yi_` | `getUserSnapshotContent` | cli_inner_pretty.js:360538-360596 | function |
| `yv6` | `LITERAL_BACKSLASH` | cli_inner_pretty.js:360693 | constant |
| `zi_` | `createBigQueryShellIntegration` | cli_inner_pretty.js:360531-360533 | function |
| `_i_` | `VCS_DIRECTORIES_TO_EXCLUDE` | cli_inner_pretty.js:360816 | constant |

### Shell Snapshot — Shell Provider

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$U7` | `createBashShellProvider` (v2.1.142: adds OTEL span recording; one-shot `missingTelemetryFired` flag) | cli_inner_pretty.js:360867-360939 | function |
| `ep7` | `require("fs/promises")` (provider scope) | cli_inner_pretty.js:360952 | variable |
| `HU7` | `require("path")` (provider scope) | cli_inner_pretty.js:360952 | variable |
| `kX$` | `require("path/posix")` | cli_inner_pretty.js:360952 | variable |

### Shell Snapshot — Command Assembly

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ap7` | `isPipeSafe` | cli_inner_pretty.js:360848-360852 | function |
| `bv6` | `hasHeredoc` | cli_inner_pretty.js:360827-360830 | function |
| `Cv6` | `(empty placeholder fn)` | cli_inner_pretty.js:360826 | function |
| `Di_` | `NUL_REDIRECT_REGEX` | cli_inner_pretty.js:360858 | constant |
| `ji_` | `disableExtglobCommand` | cli_inner_pretty.js:360860-360866 | function |
| `lp7` | `evalWrapPipeSafe` | cli_inner_pretty.js:360470-360472 | function |
| `Mi_` | `hasMultilineQuoted` | cli_inner_pretty.js:360831-360835 | function |
| `nY8` | `applyShellPrefix` | cli_inner_pretty.js:360818-360825 | function |
| `op7` | `evalWrap` | cli_inner_pretty.js:360836-360844 | function |
| `qi_` | `singleQuoteWrap` | cli_inner_pretty.js:360473-360475 | function |
| `sp7` | `substituteNulRedirect` | cli_inner_pretty.js:360853-360855 | function |
| `wi_` | `hasExplicitStdinRedirect` | cli_inner_pretty.js:360845-360847 | function |

### Shell Snapshot — Bash Executor

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `tY8` | `exec` (top-level shell executor) | cli_inner_pretty.js:518960 | function |
| `Vi_` | `buildStdioConfig` (referenced 361234) | cli_inner_pretty.js | function |

### Shell Snapshot — Search Tools

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Y$` | `getRipgrepConfig` (memoised) | cli_inner_pretty.js:197969-197983 | function |
| `aGH` | `ripgrepCommand` | cli_inner_pretty.js:197760-197763 | function |
| `dM` | `hasEmbeddedSearchTools` (v2.1.142: `EMBEDDED_SEARCH_TOOLS=1` gate removed; always true on non-SDK) | cli_inner_pretty.js:141600-141604 | function |
| `EgK` | `getRipgrepStatus` | cli_inner_pretty.js:197928-197930 | function |
| `FA6` | `findExecutable` | cli_inner_pretty.js:197971 (referenced) | function |
| `hgK` | `clearRipgrepCache` | cli_inner_pretty.js:197932-197934 | function |
| `JY` | `isInBundledMode` | cli_inner_pretty.js:197974 (referenced) | function |
| `vgK` | `spawnRipgrep` | cli_inner_pretty.js:197767-197813 | function |

### Shell Snapshot — Subprocess Env

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bH` | `parseExplicitTrue` | cli_inner_pretty.js:1769-1774 | function |
| `c$` | `getPlatform` | cli_inner_pretty.js | function |
| `DgK` | `buildProxyEnv` | cli_inner_pretty.js | function |
| `E4` | `parseExplicitFalse` | cli_inner_pretty.js:1775-1780 | function |
| `lt$` | `getUpstreamProxyEnv` (also `egressGatewayEnv`) | cli_inner_pretty.js:197528-197530 | function |
| `PgK` | `upstreamProxyEnvFn` | cli_inner_pretty.js:197526 | variable |
| `Ts1` | `GHA_SUBPROCESS_SCRUB` (v2.1.142: removed 4 OTEL header keys) | cli_inner_pretty.js:197681-197703 | constant |
| `Vs1` | `registerUpstreamProxyEnvFn` | cli_inner_pretty.js:197525-197527 | function |
| `W4` | `shellQuote` | cli_inner_pretty.js:173384 | function |
| `XI` | `subprocessEnv` (v2.1.142: always strips `OTEL_*`; new background-session env keys scrubbed) | cli_inner_pretty.js:197531-197566 | function |

### Shell Snapshot — Plugin Bin Discovery

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bM6` | `getPluginBinPaths` | cli_inner_pretty.js:230997-231006 | function |
| `lY` | `getEnabledPlugins` | cli_inner_pretty.js | function |
| `pq` | `require("path")` (plugin scope) | cli_inner_pretty.js | variable |

### Shell Snapshot — Session Env Hooks

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ZK7` | `getSessionEnvironment` | cli_inner_pretty.js:236437 | function |

### Shell Snapshot — Retention Cleanup (v2.1.117 → v2.1.142)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aB4` | `runRetentionCleanup` | cli_inner_pretty.js:555633-555657 | function |
| `al5` | `cleanupShellSnapshots` (NEW v2.1.117) | cli_inner_pretty.js:555525-555527 | function |
| `Bl5` | `shouldRunCleanup` | cli_inner_pretty.js:555226-555244 | function |
| `b8` | `getClaudeConfigHomeDir` | cli_inner_pretty.js | function |
| `c$H` | `removeIfEmpty` | cli_inner_pretty.js:555301-555305 | function |
| `cl5` | `cleanupFileHistory` | cli_inner_pretty.js:555476-555478 | function |
| `dl5` | `cleanupPlans` | cli_inner_pretty.js:555446-555449 | function |
| `el5` | `cleanupDebug` | cli_inner_pretty.js:555608-555629 | function |
| `Fl5` | `cleanupTranscripts` | cli_inner_pretty.js:555306-555399 | function |
| `gl5` | `cleanupHfiAuth` | cli_inner_pretty.js:555422-555433 | function |
| `Hn5` | `cleanupFeedbackBundles` | cli_inner_pretty.js:555630-555632 | function |
| `il5` | `cleanupUsageData` | cli_inner_pretty.js:555485-555494 | function |
| `l$H` | `getRetentionCutoff` | cli_inner_pretty.js:555245-555251 | function |
| `ll5` | `cleanupSessionEnv` | cli_inner_pretty.js:555479-555481 | function |
| `ml5` | `DEFAULT_CLEANUP_DAYS` | cli_inner_pretty.js:555659 | constant |
| `nl5` | `cleanupTasks` (NEW v2.1.117) | cli_inner_pretty.js:555482-555484 | function |
| `oB4` | `cleanupDatedJsonl` | cli_inner_pretty.js:555259-555275 | function |
| `ol5` | `cleanupDumpPrompts` | cli_inner_pretty.js:555522-555524 | function |
| `Ql5` | `cleanupMcpNeedsAuth` | cli_inner_pretty.js:555434-555445 | function |
| `rl5` | `cleanupTmpTranscripts` | cli_inner_pretty.js:555495-555521 | function |
| `Rr` | `cleanupByExtension` | cli_inner_pretty.js:555400-555421 | function |
| `sl5` | `cleanupJobsAndDaemon` | cli_inner_pretty.js:555528-555604 | function |
| `tl5` | `cleanupBackups` (NEW v2.1.117) | cli_inner_pretty.js:555605-555607 | function |
| `TZ8` | `cleanupClaudeSubdir` | cli_inner_pretty.js:555450-555475 | function |
| `Ul5` | `cleanupErrorLogs` | cli_inner_pretty.js:555276-555296 | function |
| `Xd` | `cleanupByMtime` | cli_inner_pretty.js:555297-555300 | function |
| `XA` | `require("path")` (cleanup scope) | cli_inner_pretty.js:555683 | variable |

### Shell Snapshot — Spawn Env Injection (Bash Tool)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$QH` | `invalidateSessionEnvCache` | cli_inner_pretty.js | function |
| `CT8` | `getAiAgentTag` | cli_inner_pretty.js:361227 (use) | function |
| `KD` | `setCwd` | cli_inner_pretty.js | function |
| `r77` | `onCwdChangedForHooks` | cli_inner_pretty.js | function |
| `v$` | `getCurrentSessionId` | cli_inner_pretty.js:361228 (use) | function |
| `xRH` | `isCwdChangeSuppressed` | cli_inner_pretty.js | function |
| `YU7` | `require("child_process")` (exec scope) | cli_inner_pretty.js | variable |

Bash-tool spawn env adds (v2.1.132/v2.1.120): `CLAUDE_CODE_SESSION_ID` and `AI_AGENT`.

### Shell Snapshot — Telemetry / Spans

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `CK` | `registerCleanup` | cli_inner_pretty.js | function |
| `d` | `logEvent` (`tengu_*` metrics) | cli_inner_pretty.js | function |
| `EH` | `logError` | cli_inner_pretty.js | function |
| `H_` | `pathExists` | cli_inner_pretty.js | function |
| `J8` | `recordSpanFailure` (OTEL) | cli_inner_pretty.js:360876,360892 | function |
| `N` | `logForDebugging` | cli_inner_pretty.js | function |
| `RH` | `recordSpanSuccess` (OTEL) | cli_inner_pretty.js:360873 | function |
| `tX` | `execa` | cli_inner_pretty.js | function |

Known new themes for this window:

- v2.1.117: retention cleanup sweeps added for `~/.claude/shell-snapshots/`, `~/.claude/tasks/`, `~/.claude/backups/`
- v2.1.120: spawn env adds `AI_AGENT` (set to `claude`)
- v2.1.121: `EMBEDDED_SEARCH_TOOLS=1` env var gate removed; embedded ripgrep/find/grep always available on non-SDK builds
- v2.1.132: spawn env adds `CLAUDE_CODE_SESSION_ID`
- v2.1.142: `Iv6` (`createArgv0ShellFunction`) gets 4th param `denyPatterns`; baked install path (`~/.local/bin`) replaces `command -v claude` fallback

---

## See Also

- [`changelog_analysis.md`](changelog_analysis.md) — long-form narrative
- [`changelog_to_code_map.md`](changelog_to_code_map.md) — per-bullet pointers
- [`file_index.md`](file_index.md) — extracted-file inventory
- The v2.1.112 baseline lives at `../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index.md`
