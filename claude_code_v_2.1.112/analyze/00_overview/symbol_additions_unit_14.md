# Symbol Additions — Unit 14 (MCP Protocol Changes v2.1.88 → v2.1.112)

Symbols discovered while analyzing MCP-related changelog entries between v2.1.88 and v2.1.112. The changes span MCP `_meta` annotations, the OAuth refresh fix, the `headersHelper` menu adaptation, the `MCP_CONNECTION_NONBLOCKING` env var, the SSE/HTTP buffer-leak fix, and the large-output persistence prompt.

Source of truth for v2.1.88 names:
- `/lyz/codespace/3rd/claude-code/src/services/mcp/types.ts` (config schemas — `authServerMetadataUrl`, `headersHelper` already present)
- `/lyz/codespace/3rd/claude-code/src/services/mcp/auth.ts` (`McpOAuthAuthorizationServerMetadataProvider`)
- `/lyz/codespace/3rd/claude-code/src/services/mcp/headersHelper.ts` (`getMcpHeadersFromHelper`)
- `/lyz/codespace/3rd/claude-code/src/services/mcp/client.ts` (SSE/HTTP transport memoization + reconnection)

---

## Module: MCP — Configuration Schemas (chunks.18.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Zg7` | `McpOAuthConfigSchema` (zod object: clientId / callbackPort / authServerMetadataUrl / scopes / xaa) | chunks.18.mjs:1940-1948 | function |
| `mn5` | `McpXaaConfigSchema` (zod boolean) | chunks.18.mjs:1940 | function |
| `Bn5` | `McpSSEServerConfigSchema` (type/url/headers/headersHelper/oauth) | chunks.18.mjs:1948-1954 | function |
| `Fn5` | `McpHTTPServerConfigSchema` | chunks.18.mjs:1954-1960 | function |
| `wO1` | `McpStdioServerConfigSchema` (type/command/args/env) | chunks.18.mjs:1935-1939 | function |
| `OO1` | `ConfigScopeSchema` (`local`/`user`/`project`/`dynamic`/`enterprise`/`claudeai`/`managed`) | chunks.18.mjs:1935 | function |
| `C5O` | `TransportSchema` (`stdio`/`sse`/`sse-ide`/`http`/`ws`/`sdk`) | chunks.18.mjs:1935 | function |

---

## Module: MCP — `_meta["anthropic/maxResultSizeChars"]` adapter (chunks.162.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (anonymous map fn) | `adaptMcpToolWithMetaOverride` (per-tool meta annotation reader) | chunks.162.mjs:578-617 | function |
| `Vg1` | `MCP_MAX_RESULT_HARD_CEILING` (= 500000) | chunks.83.mjs:1412 | constant |
| `M98` | `MCP_DESCRIPTION_MAX_CHARS` (= 1536, used for prompt truncation) | chunks.83.mjs (constant) | constant |
| `Zz7` | `defaultMcpToolBase` (object literal — base tool shape MCP tools inherit) | chunks.162.mjs (object) | object |
| `iI6` | `extractMcpToolList` (also: unicode sanitiser used on tool names) | chunks.161.mjs:583-592 | function |
| `cvY` | `mcpToAutoClassifierInput` | chunks.162.mjs | function |
| `tC` | `formatToolName` (`mcp__server__tool` joiner) | chunks.83.mjs | function |
| `bg6` | `mcpToolsListRequestSchema` (zod result schema for `tools/list`) | chunks.162.mjs:574 | object |

---

## Module: MCP — OAuth refresh and discovery (chunks.160.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `discoveryState` (method) | `McpOAuthProvider.discoveryState` (config-first lookup as of 2.1.105) | chunks.160.mjs:2502-2527 | function |
| `refreshAuthorization` (method) | `McpOAuthProvider.refreshAuthorization` (lockfile-guarded) | chunks.160.mjs:2528-2577 | function |
| `_doRefresh` (method) | `McpOAuthProvider._doRefresh` (metadata fallback chain) | chunks.160.mjs:2578-2654 | function |
| `ml8` | `fetchAuthServerMetadata` (RFC 8414 fetcher honoring config URL) | chunks.160.mjs:1779, 2000, 2507, 2602 | function |
| `bj6` | `discoverAuthorizationServerMetadata` (RFC 8414 cold discovery) | chunks.160.mjs:2598 | function |
| `eg1` | `sdkRefreshAuthorization` (wraps `@modelcontextprotocol/sdk` refresh) | chunks.160.mjs:2613 | function |
| `Sz7` | `MAX_LOCK_RETRIES` (= small int controlling refresh lockfile retries) | chunks.160.mjs:2537 | constant |
| `IX` | `getServerKey` (`serverName+url` keychain key) | chunks.160.mjs:2480, 2518 | function |
| `t3` | `getSecureStorage` (token+discovery state on disk) | chunks.160.mjs:2517, 2557 | function |
| `RK6` | `InvalidGrantError` (SDK class — invalidates refresh token on catch) | chunks.160.mjs:2624 | class |
| `ul8` | `getScopesFromMetadata` (extracts scopes from cached AS metadata) | chunks.160.mjs:2408 | function |

---

## Module: MCP — `headersHelper` (chunks.161.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `oGY` | `getMcpHeadersFromHelper` (dynamic header script runner) | chunks.161.mjs:817-847 | function |
| `cl8` | `getMcpServerHeaders` (static + dynamic merge) | chunks.161.mjs:848+ | function |
| `rGY` | `isMcpServerFromProjectOrLocalSettings` (trust-gate predicate) | chunks.161.mjs (helper) | function |
| `I7` | `getIsNonInteractiveSession` (skip-trust-check gate) | utility | function |
| `EA` | `checkHasTrustDialogAccepted` (workspace trust check) | utility | function |
| `M7` | `execFileNoThrowWithCwd` (shells out, captures stdout/code) | chunks.161.mjs:827 | function |
| `n8` | `jsonParse` (slowOperations.jsonParse) | utility | function |
| `i8` | `logMCPDebug` | chunks.161.mjs:826, 842 | function |
| `yz` | `logMCPError` | chunks.161.mjs:844 | function |
| `Kh` | `logAntError` (privacy-safe error reporter) | chunks.161.mjs:822 | function |

---

## Module: MCP — Connection Manager & Nonblocking (chunks.217.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `EH5` | `createMcpConnector` (top-level connect entry; gates on `MCP_CONNECTION_NONBLOCKING`) | chunks.217.mjs:1427-1445 | function |
| `yH5` | `connectMcpBatch` (registers pending clients, kicks off connects, returns per-name promises) | chunks.217.mjs:1447-1475 | function |
| `NH5` | `awaitOrSkipMcpConnections` (5 s deadline `OR` fully-async fire-and-forget) | chunks.217.mjs:1513-1534 | function |
| `OJA` | `connectClaudeaiPlusPlugins` (lazy-dedup of plugin-vs-claudeai connectors) | chunks.217.mjs:1536-1584 | function |
| `AJA` | `retryFailedRemoteMcp` (backoff retries for failed http/sse/claudeai-proxy) | chunks.217.mjs:1477-1511 | function |
| `XP6` | `iterateAllMcpServers` (multiplex stdio/sse/http connects) | chunks.217.mjs:2233+ (also chunks.161.mjs:1471) | function |
| `VRK` | `awaitWithDeadline` (Promise.race vs setTimeout, returns count not-settled) | chunks.161.mjs:2220-2231 | function |
| `ze8` | `MCP_CONNECTION_DEADLINE_MS` (= 5000) | chunks.217.mjs:1586 | constant |
| `zJA` | `MCP_REMOTE_RETRY_BACKOFFS` (= `[500, 1500, 4000]`) | chunks.217.mjs:1601 | constant |
| `YJA` | `MCP_REMOTE_RETRY_TYPES` (= `Set(["http","sse","claudeai-proxy"])`) | chunks.217.mjs:1601 | constant |
| `S6` | `parseBoolean` (env-var → boolean) | chunks.217.mjs:1432, chunks.220.mjs:1604 | function |
| `WG` | `disposeMcpConnection` (cleanup + cache evict) | chunks.161.mjs:2112-2119 | function |
| `OL` | `getMcpClientCached` (memoized connect — `cache.delete(key)` is the eviction hook) | chunks.161.mjs (memoize) | function |
| `Fy6` | `requireConnectedMcpClient` (throws if not `connected`) | chunks.161.mjs:2121-2126 | function |

---

## Module: MCP — Transport Layer (chunks.161.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (class) | `WebSocketMcpTransport` (Bun/Node — handles `onclose` cleanup) | chunks.161.mjs:480-560 | class |
| (class) | `InProcessSdkTransport` (`sendMcpMessage` wrapper) | chunks.161.mjs:868-889 | class |
| (class) | `IdeMcpTransport` (peer-aware, propagates close to peer) | chunks.161.mjs:1818-1840 | class |
| `iz7` | `withAcceptHeaderAndTimeout` (wraps fetch with `Accept: */*` and abort timer) | chunks.161.mjs:2065-2088 | function |
| `pvY` | `withClaudeaiBearerAuth` (auto-refresh on 401) | chunks.161.mjs:2022-2054 | function |
| `nz7` | `markServerNeedsAuth` | chunks.161.mjs:2011-2020 | function |
| `MRK` | `isLocalMcpServer` (stdio or sdk transport) | chunks.161.mjs:2100-2102 | function |
| `sz7` | `getStdioConnectionBatchSize` (env `MCP_SERVER_CONNECTION_BATCH_SIZE`, default 3) | chunks.161.mjs:2090-2093 | function |
| `UvY` | `getRemoteConnectionBatchSize` (env `MCP_REMOTE_SERVER_CONNECTION_BATCH_SIZE`, default 20) | chunks.161.mjs:2095-2098 | function |
| `ol8` | `getMcpRequestTimeout` (env `MCP_TIMEOUT`, default 30 000) | chunks.161.mjs:2060-2063 | function |
| `GRK` | `MCP_HTTP_HEAD_TIMEOUT_MS` (per-method timeout for non-GET) | chunks.161.mjs:2071 | constant |
| `oz7` | `McpSessionRecoveryError` (session expired → reconnect-once flag) | chunks.162.mjs:692 | class |
| `XV` | `McpToolCallError` (wraps non-Error throws from tool calls) | chunks.162.mjs:706-709 | class |

---

## Module: MCP — Persisted Tool Output (chunks.86.mjs / chunks.87.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_L6` | `persistToolResultToDisk` (writes oversized result to `tool-results/<id>.txt`/`.json`) | chunks.86.mjs:2772-2803 | function |
| `lK6` | `buildPersistedOutputMessage` (wraps preview in `<persisted-output>` block) | chunks.86.mjs:2805-2815 | function |
| `IZ4` | `truncateToolResultIfOversized` (gate that invokes persist for results > threshold) | chunks.86.mjs:2834-2861 | function |
| `zL6` | `formatToolResultForApi` (top-level: map → persist if oversized) | chunks.86.mjs:2817-2820 | function |
| `bZ4` | `formatToolResultForApiWithCeiling` (variant honoring `persistenceThresholdCeiling`) | chunks.86.mjs:2822-2824 | function |
| `JS8` | `resolvePersistThreshold` (per-tool threshold vs. global) | chunks.86.mjs:2819 | function |
| `se6` | `splitPreviewWithLineBreak` (smart preview cut at newline ≥ 50%) | chunks.86.mjs:2863-2875 | function |
| `ae6` | `getToolResultPath` (`tool-results/<toolUseId>.{json,txt}`) | chunks.86.mjs:2759-2762 | function |
| `cK6` | `getToolResultsDir` (`projects/<sanitized-cwd>/tool-results`) | chunks.86.mjs:2755-2757 | function |
| `tj6` | `mkdirToolResults` (`mkdir -p`) | chunks.86.mjs:2764-2770 | function |
| `mP4` | `DEFAULT_PERSIST_THRESHOLD_CHARS` (= 400000) | chunks.83.mjs:1416 | constant |
| `BP4` | `INLINE_FALLBACK_THRESHOLD_CHARS` (= 200000) | chunks.83.mjs:1418 | constant |
| `et6` | `BYTES_PER_TOKEN_DIVISOR` (= 4 — char-to-token estimate) | chunks.83.mjs:1414 | constant |
| `uP4` | `BASH_RESULT_THRESHOLD_CHARS` (= 50000) | chunks.83.mjs:1410 | constant |
| `pP4` | `GREP_RESULT_THRESHOLD_CHARS` (= 1e4) | chunks.83.mjs:1422 | constant |
| `KL6` | `PERSIST_PREVIEW_CHARS` (= 2000) | chunks.87.mjs:250 | constant |
| `CZ4` | `PERSIST_OPEN_TAG` (= `"<persisted-output>"`) | chunks.87.mjs:242 | constant |
| `e5z` | `PERSIST_CLOSE_TAG` (= `"</persisted-output>"`) | chunks.87.mjs:244 | constant |
| `JQ1` | `PERSIST_DIR_NAME` (= `"tool-results"`) | chunks.87.mjs:240 | constant |

---

## Module: MCP — `/mcp` Menu (chunks.175.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `yi8` | `formatReconnectResult` (now headersHelper-aware for `needs-auth`) | chunks.175.mjs:2028-2047 | function |
| `FP6` | `McpServerDetailMenu` (React component — suppresses OAuth-only actions when `headersHelper`) | chunks.175.mjs:2054+ | component |
| `$_8` | `formatReconnectError` | chunks.175.mjs:2049-2052 | function |

---

## Cross-version notes (v2.1.88 → v2.1.112)

- **`McpOAuthConfigSchema` gained `scopes: y.string().min(1).optional()`** in 2.1.112 (chunks.18.mjs:1946) — v2.1.88 only had `clientId`, `callbackPort`, `authServerMetadataUrl`, `xaa`. The new `scopes` field is consumed at refresh time alongside `authServerMetadataUrl` (chunks.160.mjs:2408 `ul8`).
- **`discoveryState()` ordering reversed** between 2.1.88 and 2.1.112: v2.1.88 (`auth.ts:2037-2087`) checked the cached discovery state first and only fell back to `authServerMetadataUrl`; v2.1.112 (chunks.160.mjs:2502-2527) checks the config URL **first**. This is the 2.1.105 ADFS-refresh fix.
- **`MCP_CONNECTION_NONBLOCKING` env var is new in 2.1.89**. v2.1.88 had no skip-wait knob; the new `NH5` (chunks.217.mjs:1513-1534) branches on this env, either fully detaching the connection promise or applying a 5 000 ms deadline (`ze8`).
- **`headersHelper`-aware menu suppression** at chunks.175.mjs:2403 (`else if (!q.config.headersHelper)`) is new in 2.1.110. v2.1.88's UI listed `Authenticate` / `Re-authenticate` for any non-`claudeai-proxy` server regardless of whether it used OAuth or `headersHelper`.
- **Hard ceiling `Vg1 = 500000`** is new in 2.1.91 as the upper bound for `_meta["anthropic/maxResultSizeChars"]`. v2.1.88 had no per-tool override pathway.

---

## Where these symbols are referenced in this unit

- `06_mcp/README.md` — module overview
- `06_mcp/max_result_size_chars.md` — `_meta["anthropic/maxResultSizeChars"]` deep dive (`Vg1`, `Zz7`, `Math.min(O, Vg1)`)
- `06_mcp/oauth_refresh_fix.md` — `discoveryState`/`_doRefresh` re-ordering (`ml8`, `bj6`)
- `06_mcp/headers_helper.md` — `getMcpHeadersFromHelper` and menu adaptation
- `06_mcp/nonblocking_connection.md` — `MCP_CONNECTION_NONBLOCKING`, `NH5`, `ze8`
- `06_mcp/large_output_truncation.md` — `lK6`, `_L6`, `IZ4`, `mP4`
- `06_mcp/sse_buffer_leak.md` — transport reconnection and pending-request rejection
