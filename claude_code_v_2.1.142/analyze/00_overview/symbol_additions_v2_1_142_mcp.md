# Symbol Additions — v2.1.142 MCP Changes (v2.1.113 → v2.1.142)

Symbols discovered or relevant while analyzing MCP-related changelog entries between v2.1.112 and v2.1.142. All v2.1.142 line numbers refer to the unified bundle `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js`. Symbols are listed by module/topic; when the same symbol existed in v2.1.112 with a different obfuscated letter, the older mapping is noted.

The v2.1.142 obfuscator picked different letter sequences than v2.1.112 (different bundle layout, different obfuscation seed), so most three-letter names are renamed even when the underlying function is unchanged. Where the function's behavior changed, the entry below explains how.

Source-of-truth references:
- v2.1.142 bundle: `cli_inner_pretty.js` (~600K lines)
- v2.1.142 per-decl: `cli_unpack_pretty/unknown/<id>.js`
- v2.1.112 reference: `claude_code_v_2.1.112/analyze/00_overview/symbol_additions_unit_14.md`
- v2.1.88 TypeScript reference: `/lyz/codespace/3rd/claude-code/src/services/mcp/`

---

## Module: MCP — Configuration Schemas (cli_inner_pretty.js:48880-48962)

Every schema now carries `alwaysLoad: y.boolean().optional()` (added in v2.1.121).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `nq$` | `McpStdioServerConfigSchema` (was `wO1` in v2.1.112) | cli_inner_pretty.js:48881-48889 | function |
| `$wq` | `McpOAuthConfigSchema` (was `Zg7`) | cli_inner_pretty.js:48891-48903 | function |
| `Vh9` | `McpXaaConfigSchema` (was `mn5`) | cli_inner_pretty.js:48890 | function |
| `Bu8` | `McpSSEServerConfigSchema` (was `Bn5`) | cli_inner_pretty.js:48904-48913 | function |
| `pu8` | `McpSSEIdeServerConfigSchema` (was `pn5`) | cli_inner_pretty.js:48914-48922 | function |
| `Uu8` | `McpWSIdeServerConfigSchema` (was `Fn5`) | cli_inner_pretty.js:48923-48932 | function |
| `CR$` | `McpHTTPServerConfigSchema` (was `gn5`) | cli_inner_pretty.js:48933-48942 | function |
| `Fu8` | `McpWSServerConfigSchema` (was `Un5`) | cli_inner_pretty.js:48943-48951 | function |
| `gu8` | `McpSDKServerConfigSchema` (was `Qn5`) | cli_inner_pretty.js:48952 | function |
| `Qu8` | `McpToolPermissionLevelSchema` (`allow`/`ask`/`blocked`) | cli_inner_pretty.js:48953 | function |
| `du8` | `McpClaudeAiProxyServerConfigSchema` | cli_inner_pretty.js:48954-48960 | function |
| `CRA` | `McpTransportEnumSchema` (was `C5O`) | cli_inner_pretty.js:48880 | function |
| `Tv7` | `McpServerTransportSchemas` (map from transport type → schema factory) | cli_inner_pretty.js | object |

---

## Module: MCP — Per-Request Fetch Timeout (cli_inner_pretty.js:413200-413400)

NEW in v2.1.142: per-request fetch timeout reads `MCP_TOOL_TIMEOUT`.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `r15` | `getToolTimeoutMs` (envelope timeout; was `yvY` in v2.1.112) | cli_inner_pretty.js:413221-413224 | function |
| `U$4` | `getRequestFetchTimeoutMs` (NEW — honors `MCP_TOOL_TIMEOUT`) | cli_inner_pretty.js:413346-413349 | function |
| `OS6` | `mcpFetchWithTimeout` (was `iz7`; now calls `U$4`) | cli_inner_pretty.js:413350-413367 | function |
| `i15` | `MCP_TOOL_TIMEOUT_DEFAULT_MS` (= 1e8) (was `EvY`) | cli_inner_pretty.js:414052 | constant |
| `C$4` | `MCP_FETCH_TIMEOUT_DEFAULT_MS` (= 60000) (was `GRK = 60000` hardcoded) | cli_inner_pretty.js:414062 | constant |
| `B$4` | `MCP_FETCH_TIMEOUT_MAX_MS` (= 2147483647 INT32_MAX) | cli_inner_pretty.js:414053 | constant |
| `__5` | `MCP_SSE_ACCEPT_HEADER` (= `"application/json, text/event-stream"`) (was `gvY`) | cli_inner_pretty.js:414063 | constant |
| `aHH` | `getMcpEnvelopeTimeoutMs` (was `ol8`; reads `MCP_TIMEOUT`, default 30000) | cli_inner_pretty.js:412341-412344 | function |
| `f$4` | `getMcpConnectTimeoutMs` (reads `MCP_CONNECT_TIMEOUT_MS`, default 5000) | cli_inner_pretty.js:412345-412348 | function |

---

## Module: MCP — Transport Byte Caps (cli_inner_pretty.js:412040-412200)

NEW in v2.1.132/v2.1.139: bounded stdio buffer + SSE frame cap.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `rI6` | `MCP_FRAME_OVERFLOW_BYTES` (= 16777216 = 16 MB) | cli_inner_pretty.js:412112 | constant |
| `L15` | `MCP_SSE_FRAME_CAP_BYTES` (= 16777216, alias for SSE) | cli_inner_pretty.js:412181 | constant |
| `_$4` | `BoundedReadBuffer` (stdio buffer with overflow callback) | cli_inner_pretty.js:412074-412110 | class |
| `CP$` | `StdoutOverflowError` (non-protocol-data error class) | cli_inner_pretty.js:412118-412124 | class |
| `bP$` | `BoundedStdioClientTransport` (wires BoundedReadBuffer into base transport) | cli_inner_pretty.js:412126-412134 | class |
| `RY6` | `BaseStdioClientTransport` (parent class — unchanged) | cli_inner_pretty.js | class |
| `P15` | `sseBodyOverflowTransformStream` (TransformStream that counts bytes without buffering) | cli_inner_pretty.js:412136-412161 | function |
| `xrH` | `wrapSseBodyOverflowGuard` (fetch wrapper applying P15) | cli_inner_pretty.js:412162-412175 | function |
| `A$4` | `HttpBodyOverflowError` (SSE non-event-boundary error class) | cli_inner_pretty.js:412182-412189 | class |
| `aI6` | `_SSE_OVERFLOW_REASON_TAG` (= `"without an SSE event boundary"`) | cli_inner_pretty.js:412177 | constant |
| `E6$` | `BaseStdioReadBuffer` (legacy unbounded buffer; replaced by `_$4` for MCP clients) | cli_inner_pretty.js:32778-32793 | class |
| `lR8` | `parseJsonRpcMessage` (Buffer → schema-validated JSON-RPC) | cli_inner_pretty.js:32794-32796 | function |
| `ih$` | `formatJsonRpcMessage` (object → stringified line) | cli_inner_pretty.js:32797-32802 | function |
| (inlined `67108864`) | `MCP_STDERR_BUFFER_BYTES` (= 64 MB stderr cap) | cli_inner_pretty.js:414316 | constant |

---

## Module: MCP — tools/list Lifecycle (cli_inner_pretty.js:414700-414810)

NEW in v2.1.132: retry once + capture error to `toolsListError`.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `WB` | `fetchMcpTools` (memoized; retries once on non-timeout failure) (was `NS`) | cli_inner_pretty.js:414718-414810 | function |
| `bSH` | `mcpToolsListResponseSchema` (zod result schema for `tools/list`) (was `bg6`) | cli_inner_pretty.js | object |
| `lK` | `McpProtocolError` (SDK error class with `.code`) | cli_inner_pretty.js | class |
| `Z7` | `McpErrorCode` (enum with `RequestTimeout`, `MethodNotFound`, etc.) | cli_inner_pretty.js | constant |
| `oHH` | `sanitizeMcpToolList` (unicode normalisation, was `iI6`) | cli_inner_pretty.js:412064-412072 | function |
| `iI6` | `sanitizeUnicodeString` (NFKC + control-char strip) | cli_inner_pretty.js:412046-412063 | function |
| `KU` | `formatToolName` (`mcp__server__tool` joiner) | cli_inner_pretty.js | function |
| `dDH` | `buildMcpBaseUrlAttrs` (extracts URL → telemetry attrs) | cli_inner_pretty.js:413269-413272 | function |
| `cI` | `getMcpServerBaseUrl` (extracts URL from server config) | cli_inner_pretty.js | function |

State field:
| Field | Where | Set by | Read by |
|-------|-------|--------|---------|
| `client.toolsListError` | client state object | `fetchMcpTools` on retry-also-fails | menu badge logic, `formatReconnectResult` |

---

## Module: MCP — Connection & Reconnect (cli_inner_pretty.js:413437-413530, 451527-451559)

NEW in v2.1.139: reconnect re-reads `.mcp.json`; needs-auth retry once.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `hQ` | `reconnectMcpServerInternal` (low-level reconnect with needs-auth retry) (was `_g`) | cli_inner_pretty.js:413440-413471 | function |
| `fN` | `disconnectMcpClient` (was `WG`) | cli_inner_pretty.js:413385-413394 | function |
| `Ey` | `ensureConnectedMcpClient` (memoized; was `OL`) | cli_inner_pretty.js | function |
| `UrH` | `mcpClientCacheKey` (cache key formatter) | cli_inner_pretty.js | function |
| `k0H` | `requireConnectedMcpClient` (throws if not connected; was `Fy6`) | cli_inner_pretty.js:413395-413399 | function |
| `B4H` | `loadAllMcpServerConfigs` (merges .mcp.json + user + project + enterprise) | cli_inner_pretty.js | function |
| `ee` | `loadEffectiveMcpConfig` (top-level — applies enterprise allowlist + plugin-config merge) | cli_inner_pretty.js:317687-317694 | function |
| `cZ6` | `findDotMcpJsonNear` (`.mcp.json` walker) | cli_inner_pretty.js:315207 | function |
| (anonymous useCallback) | `reconnectMcpServer` (UI-level; re-reads .mcp.json) | cli_inner_pretty.js:451527-451538 | function |
| (anonymous useCallback) | `toggleMcpServer` (re-reads .mcp.json on re-enable) | cli_inner_pretty.js:451539-451558 | function |
| `Tj8` | `MCP_TOOL_RECONNECT_MAX_ATTEMPTS` (= 3) | cli_inner_pretty.js:451577 | constant |
| `NoH` | `MCP_TRANSIENT_RECONNECT_MAX_ATTEMPTS` (= 5) | cli_inner_pretty.js:451574 | constant |
| `xz4` | `MCP_RECONNECT_INITIAL_DELAY_MS` (= 1000) | cli_inner_pretty.js:451575 | constant |
| `uz4` | `MCP_RECONNECT_MAX_DELAY_MS` (= 30000) | cli_inner_pretty.js:451576 | constant |

---

## Module: MCP — `/mcp` Server Detail Menu (cli_inner_pretty.js:451797-452459)

NEW in v2.1.121/v2.1.132/v2.1.139: connected · {tools fetch failed | no tools} states, improved error copy.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Nj8` | `formatReconnectResult` (new single-sentence copy; was `yi8`) | cli_inner_pretty.js:451806-451826 | function |
| `kj8` | `formatTransportError` (extracts HTTP status / URL from failed client) | cli_inner_pretty.js:451797-451804 | function |
| `q2$` | `formatReconnectException` (formats thrown errors) | cli_inner_pretty.js:451827-451829 | function |
| `wEH` | `McpServerDetailMenu` (was `FP6`) | cli_inner_pretty.js:451831-452459 | function |
| (within `wEH` scope) | `usesHeadersHelper` flag (TH variable) | cli_inner_pretty.js:452267 | variable |
| `EoH` | `useReconnectMcpServer` (returns the useCallback above) | cli_inner_pretty.js:451609 | function |

Status badges (rendered text):
- `disabled` — server disabled
- `connected` — healthy
- `connected · tools fetch failed` (NEW v2.1.132) — `toolsListError` set
- `connected · no tools` (NEW v2.1.128) — capabilities advertised tools but server returned empty
- `connecting…` — pending
- `needs authentication` — `needs-auth`
- `config issue` or `failed` — failed (config-issue distinguished v2.1.141)

---

## Module: MCP — `alwaysLoad` (cli_inner_pretty.js:211830-211841, 414769)

NEW in v2.1.121: per-server `alwaysLoad` opt-out from tool-search deferral.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `zm` | `isDeferredTool` (was `Pm` — short-circuit on `alwaysLoad`) | cli_inner_pretty.js:211830-211841 | function |
| `Of6` | `formatDeferredToolLine` | cli_inner_pretty.js:211842-211844 | function |
| `SH8` | `getToolSearchPrompt` | cli_inner_pretty.js:211845-211847 | function |
| `cY` | `TOOL_SEARCH_TOOL_NAME` | cli_inner_pretty.js | constant |
| `D7` | `AGENT_TOOL_NAME` (= "Agent" / Task) | cli_inner_pretty.js | constant |
| `lN` | `partition` (array partition helper for alwaysLoad reporting) | cli_inner_pretty.js | function |
| `fr6` | `renderMcpConfigSection` (renderer helper) | cli_inner_pretty.js | function |
| `Or6` | `renderMcpServerList` (renderer helper) | cli_inner_pretty.js | function |

Tool object field:
| Field | Set at | Value source |
|-------|--------|--------------|
| `tool.alwaysLoad` | `fetchMcpTools` map (line 414769) | `server.config.alwaysLoad === true \|\| upstreamTool._meta?.["anthropic/alwaysLoad"] === true` |

---

## Module: MCP — Reserved Names (cli_inner_pretty.js:50145, 317442-317749)

NEW in v2.1.128: `workspace` is reserved.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `sq$` | `RESERVED_MCP_SERVER_NAME` (= `"workspace"`) | cli_inner_pretty.js:50145 | constant |
| `UR$` | `WORKSPACE_BASH_TOOL_NAME` (= `mcp__workspace__bash`) | cli_inner_pretty.js:50157 | constant |
| `Pwq` | `WORKSPACE_WEB_FETCH_TOOL_NAME` (= `mcp__workspace__web_fetch`) | cli_inner_pretty.js:50157 | constant |
| `tu8` | `WORKSPACE_TOOL_NAME_RENAMES` (object — internal tool name remapping) | cli_inner_pretty.js:50149-50156 | object |
| `zwH` | `addMcpServer` (rejects reserved name; was `qC6`) | cli_inner_pretty.js:317442-317535 | function |
| `tD$` | `parseMcpConfig` (skips reserved-name entries; was `eC6` or similar) | cli_inner_pretty.js:317695-317763 | function |
| `eD$` | `parseMcpConfigFile` (reads file, calls `tD$`) | cli_inner_pretty.js:317765-317796 | function |
| `Iv7` | `isExplicitlyBlocked` (enterprise denylist check) | cli_inner_pretty.js | function |
| `AlH` | `isAllowedByEnterprisePolicy` | cli_inner_pretty.js | function |
| `Qk` | `isMcpServerDisabled` (config-level disabled check) | cli_inner_pretty.js | function |
| `uTH` | `isReservedChromeForClaudeName` (pre-existing) | cli_inner_pretty.js | function |
| `AZH` | `isReservedComputerUseName` (pre-existing) | cli_inner_pretty.js | function |
| `KQ` | `isEnterpriseMcpExclusive` (enterprise-config-takes-over check) | cli_inner_pretty.js | function |
| `sD$` | `readDotMcpJson` (reads project-scope `.mcp.json` content) | cli_inner_pretty.js | function |
| `R9` | `getProjectDir` (returns the canonical project root for the session) | cli_inner_pretty.js | function |

---

## Module: MCP — OAuth Refresh Defense (cli_inner_pretty.js:410912-411530)

NEW in v2.1.118: missing-expires_in fix, step-up tracking, lock-or-skip, keychain race fix.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `kNH` | `McpOAuthProvider` (class implementing SDK's `OAuthClientProvider`) | cli_inner_pretty.js:410926-411530 | class |
| `markStepUpPending` (method) | `McpOAuthProvider.markStepUpPending` (NEW) | cli_inner_pretty.js:410974-410976 | function |
| `tokens` (method) | `McpOAuthProvider.tokens` (NEW: omits refresh_token while step-up pending) | cli_inner_pretty.js:411032-411103 | function |
| `saveTokens` (method) | `McpOAuthProvider.saveTokens` (NEW: honors null `expires_in`) | cli_inner_pretty.js:411104-411131 | function |
| `refreshAuthorization` (method) | `McpOAuthProvider.refreshAuthorization` (NEW: skip on ELOCKED exhaustion, kU() recheck) | cli_inner_pretty.js:411369-411433 | function |
| `_doRefresh` (method) | `McpOAuthProvider._doRefresh` (NEW: kU() in invalid_grant arm) | cli_inner_pretty.js:411434-411529 | function |
| `discoveryState` (method) | `McpOAuthProvider.discoveryState` (config-first per 2.1.105) | cli_inner_pretty.js:411342-411368 | function |
| `saveDiscoveryState` (method) | `McpOAuthProvider.saveDiscoveryState` | cli_inner_pretty.js:411316-411341 | function |
| `xaaRefresh` (method) | `McpOAuthProvider.xaaRefresh` (silent jwt-bearer exchange) | cli_inner_pretty.js:411135-411213 | function |
| `redirectToAuthorization` (method) | `McpOAuthProvider.redirectToAuthorization` (NEW: persists step-up scope) | cli_inner_pretty.js:411214-411314 | function |
| `QI6` | `wrapInsufficientScopeDetector` (HTTP 403 + WWW-Authenticate parser) | cli_inner_pretty.js:412912-412925 | function |
| `kU` | `invalidateCredentialStorageCache` (in-memory cache flush) | cli_inner_pretty.js:91522-91524 | function |
| `o9` | `getSecureMcpOAuthStorage` (mutable token storage; was `t3`) | cli_inner_pretty.js | function |
| `PX` | `getMcpServerKey` (`serverName+url` keychain key; was `IX`) | cli_inner_pretty.js | function |
| `x3H` | `InvalidGrantError` (SDK class; was `RK6`) | cli_inner_pretty.js | class |
| `Et` | `OAuthSDKBaseError` | cli_inner_pretty.js:209110 | class |
| `OFH` / `MFH` | other SDK transient error classes (used in `_doRefresh` retry-condition test) | cli_inner_pretty.js | class |
| `Ff` | `acquireFileLock` (lockfile library wrapper) | cli_inner_pretty.js | function |
| `Yw8` | `createAuthFetch` (factory for fetchFn used in refresh) | cli_inner_pretty.js | function |
| `IY6` | `sdkRefreshAuthorization` (SDK's refresh helper; was `eg1`) | cli_inner_pretty.js | function |
| `fw8` | `fetchAuthServerMetadata` (RFC 8414 fetcher honoring config URL; was `ml8`) | cli_inner_pretty.js | function |
| `L0H` | `discoverAuthorizationServerMetadata` (cold RFC 8414; was `bj6`) | cli_inner_pretty.js | function |
| `zw8` | `getScopesFromMetadata` (was `ul8`) | cli_inner_pretty.js:411584-411590 | function |
| `Y15` | `ensureOfflineAccessScope` | cli_inner_pretty.js:411591-411595 | function |
| `q15` | `OAUTH_REFRESH_LOCK_STALE_MS` (= 30000) | cli_inner_pretty.js:411602 | constant |
| `UI6` | `MAX_LOCK_RETRIES` (= 5; was `Sz7`) | cli_inner_pretty.js:411603 | constant |
| `_15` | `OAUTH_PARAM_FILTER_KEYS` (= `["state","nonce","code_challenge","code_verifier","code"]`) | cli_inner_pretty.js:411639 | constant |
| `A15` | `TRANSIENT_REFRESH_ERROR_CODES` (Set with `invalid_refresh_token`, `expired_refresh_token`, `token_expired`) | cli_inner_pretty.js:411640 | constant |
| `yQ` | `AuthenticationCancelledError` | cli_inner_pretty.js:411641-411646 | class |
| `o35`, `lP$`, etc. | various small helpers used in OAuth tests/predicates | cli_inner_pretty.js | function |

Field/state additions on `McpOAuthProvider`:
| Field | Purpose | Set by |
|-------|---------|--------|
| `_pendingStepUpScope` | NEW — tracks an active step-up auth attempt | `markStepUpPending` |
| `_metadata` | cached AS metadata | `_doRefresh`, `discoveryState` consumers |
| `_refreshInProgress` | dedup promise for concurrent refresh attempts | `tokens`, `xaaRefresh` |
| `_lastUpscopingHeader` | (on transport) prevents step-up loop on idempotent 403 | SSE/HTTP transport handler |

---

## Module: MCP — claude.ai Proxy Connector (cli_inner_pretty.js:413288-413344, 413225-413268)

NEW in v2.1.136: 401 retry on worker session token rotation.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `q_5` | `wrapClaudeAiProxyFetch` (401 retry after token-refresh check) | cli_inner_pretty.js:413307-413344 | function |
| `$_5` | `wrapClaudeAiCallbackFetch` (callback URL bearer injection) | cli_inner_pretty.js:413297-413306 | function |
| `wY` | `waitForClaudeAiAuthReady` | cli_inner_pretty.js | function |
| `xq` | `getClaudeAiOAuthToken` | cli_inner_pretty.js | function |
| `fu` | `refreshClaudeAiToken` (returns boolean: did the token change?) | cli_inner_pretty.js | function |
| `mL` | `getMcpAccessToken` (raw access token getter for Authorization header) | cli_inner_pretty.js | function |
| `fS6` | `reportNeedsAuth` (sets `needs-auth` state on a client + emits telemetry) | cli_inner_pretty.js:413288-413296 | function |
| `H_5` | `recordNeedsAuthCacheEntry` (writes mcp-needs-auth-cache.json) | cli_inner_pretty.js:413243-413253 | function |
| `p$4` | `clearNeedsAuthCache` (removes server from needs-auth cache after success) | cli_inner_pretty.js:413254-413262 | function |
| `Nw8` | `getMcpNeedsAuthCachePath` (`<cache_dir>/mcp-needs-auth-cache.json`) | cli_inner_pretty.js:413225-413227 | function |
| `wS6` | `readMcpNeedsAuthCache` (singleton-promise reader) | cli_inner_pretty.js:413228-413235 | function |
| `e15` | `isCachedNeedsAuth` (TTL-checked cache lookup) | cli_inner_pretty.js:413236-413242 | function |
| `Dw8` | `clearMcpNeedsAuthCacheFile` (full file removal) | cli_inner_pretty.js:413263-413268 | function |
| `s15` | `MCP_NEEDS_AUTH_CACHE_TTL_MS` (= 900000 = 15 min) | cli_inner_pretty.js:414057 | constant |
| `t15` | `MCP_NEEDS_AUTH_CACHE_TTL_CLAUDEAI_MS` (= 14400000 = 4 h) | cli_inner_pretty.js:414058 | constant |
| `gI6` | `scheduleServerEventStreamReconnect` | cli_inner_pretty.js | function |
| `KG6` | `subscribeToClaudeAiServerEvents` | cli_inner_pretty.js | function |

---

## Module: MCP — stdio Environment Injection (cli_inner_pretty.js:414304-414322)

NEW in v2.1.139: `CLAUDE_PROJECT_DIR` injected into stdio servers.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (inline at line 414308) | `injectClaudeProjectDirToStdioMcpEnv` (logic, no separate function) | cli_inner_pretty.js:414308 | inlined |
| `R9` | `getProjectDir` (defined elsewhere in bundle; canonical session root) | cli_inner_pretty.js | function |
| `XI` | `getDefaultStdioEnv` (env factory for stdio spawn) | cli_inner_pretty.js | function |
| `SY6` | `getSandboxedEnv` (env factory when sandboxed) | cli_inner_pretty.js | function |
| `lt$` | `getSandboxedShellEnv` (additional vars for sandboxed shell) | cli_inner_pretty.js | function |
| `pA6` | `isSandboxedEnvironment` (predicate) | cli_inner_pretty.js | function |
| `W4` | `shellQuote` (quotes args for `CLAUDE_CODE_SHELL_PREFIX`) | cli_inner_pretty.js | function |
| `bP$` | `BoundedStdioClientTransport` (see Transport Byte Caps module) | cli_inner_pretty.js:412126-412134 | class |

---

## Module: MCP — Telemetry Events

Telemetry events newly fired or modified:

| Event name | Fired by | When |
|------------|----------|------|
| `tengu_mcp_degraded` | `fetchMcpTools` | `reason: "connected_zero_tools"` — tools/list returned empty array |
| `tengu_mcp_oauth_refresh_success` | `_doRefresh` | refresh succeeded |
| `tengu_mcp_oauth_refresh_failure` | `_doRefresh` | various `reason:` codes (`metadata_discovery_failed`, `no_client_info`, `no_tokens_returned`, `invalid_grant`, `transient_retries_exhausted`, `request_failed`) |
| `tengu_mcp_oauth_flow_error` | OAuth flow orchestrator | flow-level failure |
| `tengu_mcp_claudeai_proxy_401` | `wrapClaudeAiProxyFetch` | 401 from claude.ai proxy; reports `tokenChanged: boolean, proxyErrorCode?: string` |
| `tengu_mcp_server_needs_auth` | `reportNeedsAuth` | server transitions to `needs-auth` state |
| `tengu_mcp_elicitation_shown` / `tengu_mcp_elicitation_response` | elicitation flow | unchanged |
| `tengu_mcp_headersHelper_missing_trust` | `getMcpHeadersFromHelper` | trust dialog not accepted yet |
| `mcp_server_connection` | per-server connect attempt | reports duration, status, scope, transport type |
| `mcp_reconnect` / `mcp_connect` | reconnect/connect paths | reports success/failure |

---

## Cross-version Symbol Mapping (high-confidence renames)

For symbols whose semantic role is unchanged but the obfuscation letters differ between v2.1.112 and v2.1.142:

| Role | v2.1.112 (chunks.*.mjs) | v2.1.142 (cli_inner_pretty.js) |
|------|--------------------------|--------------------------------|
| logMCPDebug | `i8` | `H8` |
| logMCPError | `yz` | `$5` |
| errorMessage (formatter) | `b6` | `ZH` |
| jsonParse (slowOperations) | `n8` | `x$` |
| logTelemetry | `d` | `d` (unchanged letter) |
| logAntError | `Kh` | `vx` |
| execFileNoThrowWithCwd | `M7` | `O6` |
| sleep (async) | `l7` | `a8` |
| memoize (request dedup helper) | `aX` | `SW` |
| getProjectDir | (varies) | `R9` |
| `BoundedReadBuffer.append` arg | `H` | `H` (matching field name) |

This rename pattern is the same across the entire bundle — the obfuscator letter pool is regenerated per release.

---

## Files referenced (full paths)

- v2.1.142 source bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js`
- v2.1.142 changelog: `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.142/CHANGELOG.md`
- v2.1.112 source: `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.112/source/chunks.*.mjs`
- v2.1.88 TypeScript source: `/lyz/codespace/3rd/claude-code/src/services/mcp/`
- v2.1.112 MCP analysis: `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.112/analyze/06_mcp/`
- v2.1.142 MCP analysis: `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.142/analyze/06_mcp/`
- v2.1.112 symbol baseline: `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.112/analyze/00_overview/symbol_additions_unit_14.md`

---

> **Note:** All MCP symbols above have been consolidated into [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) under the `Module: MCP Protocol` section. This file is retained as the per-unit working notes for the MCP analysis pass; the canonical lookup is the platform index.
