# Symbol Additions — v2.1.193 — MCP (NEW MODULE)

> These symbols route to **[symbol_index_infra_platform.md](./symbol_index_infra_platform.md)** (the **MCP** module section is its home).
>
> Bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (VERSION `2.1.193`, build `a1938d2a`). Every line was re-derived in the live 193 bundle for this round; obfuscated names are re-mangled per build and are **never** assumed to carry across versions. Where a symbol is *carryover* (present in 183 with a different obf token), the 183 obf name is noted in the readable column for traceability.
>
> **Drift fixed vs the scout dossier** (dossier line → verified 193 line): `_pp` 292228→**292213**; `gAa` 292192→**292208**; `gao` 292213→**292222**; env map `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` 43164→**43147**; `gpp` 292162→**292155**; `ppp` 292145→**292140**; `fAa` 292135→**292133**; `f9f` (mcpGetHandler) 613315→**611549**; `a9f` (mcpRemoveHandler) 613469→**611388**; `ENDPOINT_NOT_FOUND` 293997→**293997-293999** (message on 293999); progress idle-reset 293072→**293098-293099**; needs-auth skip 292618→**292645**.

## Module: MCP — login/logout CLI (NET-NEW 2.1.186)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `L9f` | `mcpLoginHandler` | cli_inner_pretty.js:613318 | function |
| `D9f` | `mcpLogoutHandler` | cli_inner_pretty.js:613467 | function |
| `rnc` | `formatAuthUrlMessage` | cli_inner_pretty.js:613312 | function |
| `g3o` | `mcpAuthModule` (exports `{ mcpLoginHandler, mcpLogoutHandler }`) | cli_inner_pretty.js:613276 | object |
| `h3o` | `lazyLoadMcpAuthModule` (module init) | cli_inner_pretty.js:613503 | function |
| `anc` | `buildMcpCommand` (the `mcp` parent command) | cli_inner_pretty.js:613523 | function |
| (cmd) | `mcp login <name>` registration | cli_inner_pretty.js:613582 | object |
| (cmd) | `mcp logout <name>` registration | cli_inner_pretty.js:613593 | object |
| `oX` | `runOAuthFlow` (shared; consumed by login with `skipBrowserOpen`/`onWaitingForCallback`) | cli_inner_pretty.js:281953 | function |
| `Vj` | `OAuthAbort` (abort sentinel in the paste-URL flow; used `:613383`) | cli_inner_pretty.js:283086 | class |

## Module: MCP — remote tool-call idle timeout (NET-NEW 2.1.187)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Jpu` | env `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` (def `Fe.int()`) | cli_inner_pretty.js:43611 | variable |
| `Jpu` | env `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` (getter map) | cli_inner_pretty.js:43147 | function |
| `_pp` | `resolveIdleTimeoutMs` | cli_inner_pretty.js:292213 | function |
| `hpp` | `DEFAULT_MCP_TOOL_IDLE_TIMEOUT_MS` (= 300000) | cli_inner_pretty.js:293311 | constant |
| `ypp` | `IDLE_TIMEOUT_TRANSPORTS` (`Set(["http","sse","ws","claudeai-proxy"])`) | cli_inner_pretty.js:293456 | constant |
| `gAa` | `resolveToolTimeoutMs` (overall per-call ceiling) | cli_inner_pretty.js:292208 | function |
| `fpp` | `DEFAULT_TOOL_TIMEOUT_MS` (= 1e8) | cli_inner_pretty.js:293307 | constant |
| `mAa` | `MAX_TOOL_TIMEOUT_MS` (= 2147483647) | cli_inner_pretty.js:293308 | constant |
| `bao` | `callToolWithWatchdog` (idle watchdog + re-auth catch) | cli_inner_pretty.js:293017 | function |
| `Fi` | `McpToolError` (idle/transport/overall-timeout error class; used `:293052`/`:293069`/`:293080`) | cli_inner_pretty.js:9055 | class |

## Module: MCP — headersHelper re-auth on tool-call 401/403 (NET-NEW 2.1.193)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aWe` | `serverCacheKey` (used in `bao` `:293137`) | cli_inner_pretty.js:292483 | function |
| `pao` | `inFlightReauthReconnects` (Map, reconnect dedup; used `:293138`) | cli_inner_pretty.js:293460 | variable |
| `nT` | `disconnectAndClearCache` (called `:293146`) | cli_inner_pretty.js:292489 | function |
| `ID` | `connectOrGetClient` (re-runs headersHelper; called `:293146`) | cli_inner_pretty.js:293461 | function |
| `Ct` | `logMcpEvent` (`("mcp_headers_helper","reauth_retry")` `:293143`) | cli_inner_pretty.js:44851 | function |
| `vR` | `McpAuthRequiredError` (instanceof in isAuthError `:293135`) | cli_inner_pretty.js:138074 | class |
| `lWe` | `McpReauthError` (`"requires re-authorization (token expired)"` thrown `:293179`) | cli_inner_pretty.js:293424 | class |

## Module: MCP — capability-discovery retry + OAuth retry-once + 404 (2.1.191)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `P1n` | `listWithPaginationAndRetry` (183 predecessor `aOt`, no retry) | cli_inner_pretty.js:292176 | function |
| `mpp` | `RETRY_BACKOFFS` (= [250, 500, 1000]) | cli_inner_pretty.js:293455 | constant |
| `gpp` | `isRetryableError` | cli_inner_pretty.js:292155 | function |
| `ppp` | `isNetworkTransientError` | cli_inner_pretty.js:292140 | function |
| `fAa` | `isSessionExpiredError` | cli_inner_pretty.js:292133 | function |
| `rAa` | `logListPaginated` (`tengu_mcp_list_paginated`) | cli_inner_pretty.js:292205 | function |
| `AOn` | `createRetryingOAuthFetch` (183 single-fetch `qxn`) | cli_inner_pretty.js:281573 | function |
| `m_a` | `oauthFetchOnce` (the single-fetch body) | cli_inner_pretty.js:281583 | function |
| `zap` | `isTransientFetchError` | cli_inner_pretty.js:281528 | function |
| `Vap` | `OAUTH_RETRY_DELAY_MS` (= 500) | cli_inner_pretty.js:283043 | constant |
| `u_a` | `defaultOAuthFetch` (non-retry default) | cli_inner_pretty.js:281323 | function |
| `HIe` | `formatServerUrl` | cli_inner_pretty.js:145991 | function |
| `Yvn` | `isAllowlistedMcpUrl` | cli_inner_pretty.js:145961 | function |
| (str) | `"ENDPOINT_NOT_FOUND"` code + message rewrite | cli_inner_pretty.js:293997 | constant |

## Module: MCP — get/remove name suggestions (NET-NEW 2.1.186)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `t3o` | `suggestClosestServerName` (fuzzy + truncate-at-8) | cli_inner_pretty.js:610416 | function |
| `psr` | `formatNotFoundWithPending` | cli_inner_pretty.js:610430 | function |
| `fde` | `fuzzyClosestMatch` (Levenshtein; t3o calls it with maxEditDistance 2 `:610418`) | cli_inner_pretty.js:382122 | function |
| `f9f` | `mcpGetHandler` | cli_inner_pretty.js:611549 | function |
| `a9f` | `mcpRemoveHandler` | cli_inner_pretty.js:611388 | function |
| (cmd) | `mcp get <name>` registration | cli_inner_pretty.js:613570 | object |
| (cmd) | `mcp remove <name>` registration | cli_inner_pretty.js:613544 | object |

## Module: MCP — retired-tool "disconnected" notice fix (FIX 2.1.186)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `HBt` | `RETIRED_TOOL_NAMES` (`Set(["Frame","FrameRead","TeamCreate","TeamDelete","SuggestBackgroundPR"])`) | cli_inner_pretty.js:228300 | constant |
| `oko` | `computeDeferredToolsDelta` (retired skip :471050; 183 predecessor `Qgo` :462359) | cli_inner_pretty.js:471037 | function |

## Module: MCP — needs-auth cache + startup notice (CARRYOVER infra)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$1n` | `needsAuthCachePath` (`mcp-needs-auth-cache.json`) | cli_inner_pretty.js:292219 | function |
| `gao` | `readNeedsAuthCache` | cli_inner_pretty.js:292222 | function |
| `oAa` | `isCachedNeedsAuth` | cli_inner_pretty.js:292230 | function |
| (str) | `McpServerIssuesNotice` render (`"… not connected — run /mcp to authenticate, retry, or see details:"`; 183 :493517) | cli_inner_pretty.js:504183 | constant |
| (str) | `buildStartupWarnings` per-server (`"Run /mcp to authenticate, retry, or inspect the server."`; 183 :493676) | cli_inner_pretty.js:504324 | constant |
| (str) | deferred-tools "no longer available (their MCP server disconnected)" render (carryover) | cli_inner_pretty.js:601626 | constant |
