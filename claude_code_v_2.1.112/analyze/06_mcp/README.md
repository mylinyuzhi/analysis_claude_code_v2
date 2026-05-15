# 06_mcp — MCP Protocol Changes (v2.1.88 → v2.1.112)

This module collects all material changes to the Model Context Protocol (MCP) subsystem between **v2.1.88** (TypeScript sources at `claude-code-kim/src/services/mcp/`) and **v2.1.112** (obfuscated `chunks.*.mjs`). The MCP surface in this window evolved on six fronts:

1. **Per-tool result-size override** (2.1.91, fixed 2.1.98) — `_meta["anthropic/maxResultSizeChars"]` lets a server advertise a generous (up to 500 000 char) cap for individual tools like DB schema dumps.
2. **OAuth refresh-after-restart fix** (2.1.105) — for IdPs like ADFS that publish their metadata at a config-pinned URL, the refresh path now consults `oauth.authServerMetadataUrl` *first*, bypassing a stale on-disk cache.
3. **`headersHelper` menu adaptation** (2.1.110) — the `/mcp` server detail menu suppresses `Authenticate`/`Re-authenticate` actions for servers configured with `headersHelper`, since those servers don't use OAuth at all.
4. **Non-blocking connect for `-p` mode** (2.1.89) — `MCP_CONNECTION_NONBLOCKING=true` lets a headless `claude -p` skip the MCP-connect wait entirely; bounded waits of 5 s replace unbounded blocking elsewhere.
5. **SSE/HTTP buffer-leak + mid-response-drop fixes** (2.1.97, 2.1.110) — accumulating SSE buffers (~50 MB/hr) and indefinitely-hanging tool calls when the server connection dropped mid-response.
6. **Large-output truncation prompt** (2.1.105) — when a tool result is too big and gets persisted to disk, the model-facing message now includes format-specific recipes (`jq` for JSON, computed Read chunks for text).

## Document Layout

| File | Topic | Versions |
|------|-------|---------:|
| [max_result_size_chars.md](./max_result_size_chars.md) | `_meta["anthropic/maxResultSizeChars"]` 500K hard-ceiling override | 2.1.91, 2.1.98 |
| [oauth_refresh_fix.md](./oauth_refresh_fix.md) | `oauth.authServerMetadataUrl` consulted first on refresh (ADFS fix) | 2.1.105 |
| [headers_helper.md](./headers_helper.md) | `headersHelper` MCP config + menu adaptation in `/mcp` | already in 2.1.88; menu fix in 2.1.110 |
| [nonblocking_connection.md](./nonblocking_connection.md) | `MCP_CONNECTION_NONBLOCKING=true` + bounded 5 s `--mcp-config` waits | 2.1.89, related 2.1.105 |
| [large_output_truncation.md](./large_output_truncation.md) | Format-specific recipes in the persisted-output system message | 2.1.105 |
| [sse_buffer_leak.md](./sse_buffer_leak.md) | ~50 MB/hr buffer accumulation + mid-response drop hangs | 2.1.97, 2.1.110 |

## Related Symbols

> Symbol mappings:
> - [symbol_index.md](../00_overview/symbol_index.md) — main symbol index (split into multiple files in newer revisions)
> - [symbol_additions_unit_14.md](../00_overview/symbol_additions_unit_14.md) — symbols newly mapped while writing this module

Key entities in this module:
- `adaptMcpToolWithMetaOverride` (anonymous map fn at chunks.162.mjs:578-617) — reads `_meta["anthropic/maxResultSizeChars"]` per tool
- `MCP_MAX_RESULT_HARD_CEILING` (`Vg1`, = 500000) — the maximum any MCP tool can request
- `McpOAuthProvider.discoveryState` (chunks.160.mjs:2502-2527) — config-first lookup (was cache-first in v2.1.88)
- `getMcpHeadersFromHelper` (`oGY`, chunks.161.mjs:817-847) — dynamic header script runner
- `awaitOrSkipMcpConnections` (`NH5`, chunks.217.mjs:1513-1534) — 5 s deadline or full async
- `MCP_CONNECTION_DEADLINE_MS` (`ze8`, = 5000)
- `buildPersistedOutputMessage` (`lK6`, chunks.86.mjs:2805-2815) — `<persisted-output>` block formatter
- `McpServerDetailMenu` (`FP6`, chunks.175.mjs:2054+) — the `/mcp` server menu, gated on `headersHelper`

## Cross-cutting Architecture Notes

### MCP Result Pipeline (2.1.112)

```
MCP server returns tool result
        │
        ▼
adaptMcpToolWithMetaOverride          ← per-tool _meta gate (2.1.91)
        │  (sets maxResultSizeChars + persistenceThresholdCeiling)
        ▼
formatToolResultForApi (zL6)
        │
        ▼
truncateToolResultIfOversized (IZ4)
        │
        ├─ size ≤ threshold → return inline
        └─ size > threshold → persistToolResultToDisk (_L6)
                                     │
                                     ▼
                            buildPersistedOutputMessage (lK6)
                            → "<persisted-output>…</persisted-output>"
                              with first 2 KB preview + filepath
                              + format-specific recipes (2.1.105)
```

### MCP Connection Lifecycle (2.1.112)

```
Session start (createMcpConnector / EH5)
        │
        ▼
parseBoolean(process.env.MCP_CONNECTION_NONBLOCKING)
        │
        ├─ true   → fire-and-forget all connects (returns immediately)
        └─ false  → connectMcpBatch + awaitOrSkipMcpConnections (NH5)
                            │
                            ▼
                    Promise.race vs setTimeout(5000ms)
                            │
                            ├─ all settled  → return
                            └─ deadline hit → log "not ready after 5000ms;
                                              background connection continues"
                                              and proceed anyway
```

### MCP OAuth Refresh (2.1.112, post-2.1.105 fix)

```
refreshAuthorization(refreshToken)  ← acquire lockfile-based exclusion
        │
        ▼
_doRefresh
        │
        ▼
discoveryState()
        │
        ├─ config has oauth.authServerMetadataUrl?
        │   YES → fetch metadata at that URL (FIRST PRIORITY — 2.1.105 fix)
        │   NO  → consult cached on-disk discoveryState
        ▼
sdkRefreshAuthorization(metadata, refreshToken)
```

## Verification

All cross-references against v2.1.88 source verified at:
- `/lyz/codespace/3rd/claude-code/src/services/mcp/types.ts` (config schemas including `authServerMetadataUrl` at 47-53, `headersHelper` at 63/94)
- `/lyz/codespace/3rd/claude-code/src/services/mcp/auth.ts` (lines 2037-2088 for old cache-first `discoveryState`)
- `/lyz/codespace/3rd/claude-code/src/services/mcp/headersHelper.ts` (`getMcpHeadersFromHelper`)

All v2.1.112 line numbers refer to the obfuscated `chunks.*.mjs` files at `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.112/source/`.
