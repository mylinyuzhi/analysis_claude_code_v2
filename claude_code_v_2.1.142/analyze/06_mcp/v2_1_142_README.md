# 06_mcp — MCP Subsystem Changes (v2.1.113 → v2.1.142)

This module documents every material change to the Model Context Protocol (MCP) subsystem between **v2.1.112** (baseline at `../../../claude_code_v_2.1.112/analyze/06_mcp/`) and **v2.1.142** (current). The MCP surface evolved across nine fronts during this window — most of them are stability fixes for OAuth, transport, and operational lifecycle issues that only manifest after running with many remote servers for a few weeks.

## Quick map by changelog entry

| Version | Entry (paraphrased) | Document |
|--------:|---------------------|----------|
| 2.1.142 | `MCP_TOOL_TIMEOUT` did not raise per-request HTTP/SSE timeout (capped at 60 s) | [mcp_tool_timeout.md](./mcp_tool_timeout.md) |
| 2.1.141 | Many remote-OAuth/headersHelper polish fixes (`headersHelper` reconnect copy, `claudeai-proxy` 401 retry, transient 4xx, etc.) | [oauth_refresh_fixes.md](./oauth_refresh_fixes.md), [headers_helper_reconnect.md](./headers_helper_reconnect.md) |
| 2.1.139 | stdio servers receive `CLAUDE_PROJECT_DIR`; `/mcp` Reconnect re-reads `.mcp.json`; HTTP/SSE 16 MB SSE-frame cap | [claude_project_dir_env.md](./claude_project_dir_env.md), [reconnect_dot_mcp_json.md](./reconnect_dot_mcp_json.md), [sse_frame_cap.md](./sse_frame_cap.md) |
| 2.1.136 | (claude.ai connector token-rotation 401 retry, surfaced as `tengu_mcp_claudeai_proxy_401`) | [oauth_refresh_fixes.md](./oauth_refresh_fixes.md) |
| 2.1.132 | stdio non-protocol stdout → bounded memory; `tools/list` retry once | [sse_frame_cap.md](./sse_frame_cap.md), [tools_list_retry.md](./tools_list_retry.md) |
| 2.1.128 | `workspace` reserved server name; reconnect doesn't flood with tool-name lists | [reserved_workspace_name.md](./reserved_workspace_name.md) |
| 2.1.121 | `alwaysLoad` per-server config (skip tool-search deferral) | [always_load.md](./always_load.md) |
| 2.1.118 | OAuth refresh fixes (`expires_in` missing, refresh lock, step-up, keychain race) | [oauth_refresh_fixes.md](./oauth_refresh_fixes.md) |
| 2.1.117 | Faster MCP startup with concurrent connect (already partly in v2.1.112 — see overview note below) | (no new doc; see `nonblocking_connection.md` in v2.1.112 baseline) |

## What baseline carried forward unchanged

The v2.1.112 documents that are still accurate at v2.1.142 — keep reading them for context:

- `max_result_size_chars.md` — `_meta["anthropic/maxResultSizeChars"]` (still the per-tool override; v2.1.142 just adds a tool retry path described in `tools_list_retry.md`)
- `oauth_refresh_fix.md` — `oauth.authServerMetadataUrl` honored first on refresh (ADFS fix from 2.1.105). Still present in v2.1.142 at `chunks.*.mjs:411342-411368`.
- `headers_helper.md` — the `getMcpHeadersFromHelper` script-execution path is unchanged in v2.1.142 (still at `cli_inner_pretty.js:412394-412449`). Only the `/mcp` *reconnect copy* changed — covered in `headers_helper_reconnect.md`.
- `nonblocking_connection.md` — `MCP_CONNECTION_NONBLOCKING` and 5 s deadline both still active.
- `large_output_truncation.md` — persisted-output recipes unchanged.
- `sse_buffer_leak.md` — accumulation bug fix carried forward; v2.1.139 then added a *hard cap* (16 MB) on top — see `sse_frame_cap.md`.

## Cross-cutting themes

### Theme 1: "Reconnect" became a first-class lifecycle event

In v2.1.112, `Reconnect` from `/mcp` re-used the cached config struct that was loaded at session start. Two v2.1.139 changes made `Reconnect` re-read configuration from disk:

```
Reconnect (v2.1.112)                  Reconnect (v2.1.142)
─────────                            ─────────
1. lookup client in state            1. lookup client in state
2. use client.config (in-memory)     2. ← reload .mcp.json from disk
3. dispose + connect                 3. fallback to client.config
                                     4. dispose + connect
                                     5. on needs-auth → clear cache + retry once
```

That last step ("retry once") is also new: when a fresh `Reconnect` returns `needs-auth`, the `needs-auth` server cache is cleared and the connect is attempted again. The motivation is that a user editing `.mcp.json` to fix bad credentials should see the change *now*, not after restart.

### Theme 2: OAuth refresh became defensive

Pre-v2.1.118, the OAuth refresh would:
- Default `expires_in` to 3600 when the server omitted it (forcing hourly re-auth even when the access token was valid for much longer)
- Continue without the cross-process lock if it couldn't be acquired (race-prone)
- Loop forever on step-up if the server returned `insufficient_scope` for a scope the token already had

Post-v2.1.118, all three are corrected. The `_pendingStepUpScope` field on the OAuth provider tracks an active step-up attempt; the refresh path explicitly returns `void` when the lock cannot be acquired; missing `expires_in` is stored as `undefined` (meaning "no known expiration"). See [oauth_refresh_fixes.md](./oauth_refresh_fixes.md).

### Theme 3: Bounded memory at the transport edge

Three v2.1.132/v2.1.139 changes added explicit byte caps:

- 16 MB SSE frame cap (HTTP/SSE response bodies)
- 16 MB stdout cap without a JSON-RPC newline boundary (stdio servers)
- 64 MB stderr accumulation cap (stdio servers — used for diagnostic dump on failure)

When any cap is exceeded, the transport closes the server with a `StdoutOverflowError` or `HttpBodyOverflowError` and surfaces "non-protocol data" guidance in `/mcp`. This is described in [sse_frame_cap.md](./sse_frame_cap.md).

### Theme 4: Per-server config opt-ins

Two new boolean fields on every MCP server config:
- `alwaysLoad` (v2.1.121) — skip tool-search deferral, always show tools at session start
- `workspace` is a reserved server name (v2.1.128) — config with `name === "workspace"` is rejected

These are described in [always_load.md](./always_load.md) and [reserved_workspace_name.md](./reserved_workspace_name.md).

## Document Layout

| File | Versions |
|------|---------:|
| [mcp_tool_timeout.md](./mcp_tool_timeout.md) | 2.1.142 |
| [always_load.md](./always_load.md) | 2.1.121 |
| [claude_project_dir_env.md](./claude_project_dir_env.md) | 2.1.139 |
| [reconnect_dot_mcp_json.md](./reconnect_dot_mcp_json.md) | 2.1.139 |
| [oauth_refresh_fixes.md](./oauth_refresh_fixes.md) | 2.1.118, 2.1.121, 2.1.128, 2.1.136 |
| [headers_helper_reconnect.md](./headers_helper_reconnect.md) | 2.1.118, 2.1.121 |
| [reserved_workspace_name.md](./reserved_workspace_name.md) | 2.1.128 |
| [sse_frame_cap.md](./sse_frame_cap.md) | 2.1.132, 2.1.139 |
| [tools_list_retry.md](./tools_list_retry.md) | 2.1.132 |

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_mcp.md](../00_overview/symbol_additions_v2_1_142_mcp.md) — all v2.1.142 MCP additions
> - v2.1.112 reference: [symbol_additions_unit_14.md](../../../claude_code_v_2.1.112/analyze/00_overview/symbol_additions_unit_14.md)

Key new symbols in v2.1.142:
- `getRequestFetchTimeoutMs` (`U$4`, cli_inner_pretty.js:413346-413349) — honors `MCP_TOOL_TIMEOUT` for per-request fetch
- `getToolTimeoutMs` (`r15`, cli_inner_pretty.js:413221-413224) — already-existing tool timeout (unchanged)
- `MCP_FETCH_TIMEOUT_DEFAULT_MS` (`C$4`, = 60000) — the 60-second floor
- `MCP_FETCH_TIMEOUT_MAX_MS` (`B$4`, = 2147483647) — INT32_MAX hard ceiling
- `MCP_FRAME_OVERFLOW_BYTES` (`rI6`, = 16777216) — 16 MB cap for stdio/SSE
- `MCP_STDERR_BUFFER_BYTES` (= 67108864, inlined at cli_inner_pretty.js:414316) — 64 MB stderr cap
- `StdoutOverflowError` (`CP$`, cli_inner_pretty.js:412118-412124)
- `HttpBodyOverflowError` (`A$4`, cli_inner_pretty.js:412182-412189)
- `wrapSseBodyOverflowGuard` (`xrH`, cli_inner_pretty.js:412162-412175)
- `RESERVED_MCP_SERVER_NAME` (`sq$`, = `"workspace"`, cli_inner_pretty.js:50145)
- `markStepUpPendingFromInsufficientScope` (`QI6`, cli_inner_pretty.js:412912-412925)
- `reconnectMcpServer` (`hQ`, cli_inner_pretty.js:413440-413471)
- `reloadAndReconnectMcpServer` (anonymous useCallback at cli_inner_pretty.js:451527-451538) — picks up `.mcp.json` edits

## Verification

- v2.1.112 reference: `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.112/source/chunks.160.mjs`, `chunks.161.mjs`, `chunks.162.mjs`, `chunks.175.mjs`, `chunks.18.mjs`
- v2.1.88 TypeScript: `/lyz/codespace/3rd/claude-code/src/services/mcp/` (unchanged surface area)
- v2.1.142 bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js`
- v2.1.142 changelog: `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.142/CHANGELOG.md`
