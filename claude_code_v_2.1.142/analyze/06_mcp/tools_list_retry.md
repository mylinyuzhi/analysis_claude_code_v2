# `tools/list` Retries Once + Surfaces Tool-Fetch Errors

**Versions:** 2.1.132 (added)

## Summary

When Claude Code connects to an MCP server it immediately calls `tools/list` to discover what tools the server exposes. In v2.1.112, if that call failed for *any* transient reason (network hiccup, server cold-start race, server just-started-up-but-not-ready), the failure was silently swallowed: the server appeared "connected" in `/mcp` but with zero tools, and the failure cause was nowhere visible to the user.

v2.1.132 makes two changes:
1. **Retry once.** If the first `tools/list` throws (non-timeout), log the error and try again immediately. Many transient races resolve on the second attempt.
2. **Persist the error.** If both attempts fail, the error message is attached to the connected client state as `toolsListError`. The `/mcp` UI now distinguishes:
   - `connected · 0 tools` — the server returned an empty list (it just has no tools)
   - `connected · tools fetch failed` — the call failed; the underlying error is visible in the menu

This makes "I added an MCP server and nothing is happening" diagnosable without scanning logs.

## Files Involved

| Version | Path | Lines | What |
|---------|------|------:|------|
| v2.1.112 | `chunks.162.mjs` | 573-576 | `tools/list` call — no retry, no error capture |
| v2.1.142 | `cli_inner_pretty.js` | **414723-414731** | `tools/list` — try/catch with retry-once and `toolsListError` |
| v2.1.142 | `cli_inner_pretty.js` | 414732 | `H.toolsListError = void 0;` — clear on success |
| v2.1.142 | `cli_inner_pretty.js` | 414734-414739 | telemetry: `tengu_mcp_degraded` event for `connected_zero_tools` |
| v2.1.142 | `cli_inner_pretty.js` | 452306-452342 | `/mcp` menu — `tools fetch failed` and `no tools` states |
| v2.1.142 | `cli_inner_pretty.js` | 452398-452405 | "Issue:" section displays `toolsListError` in detail menu |
| v2.1.142 | `cli_inner_pretty.js` | 451809-451810 | `formatReconnectResult` mentions the toolsListError on Reconnect |

## v2.1.112 (the silent failure)

```javascript
// ============================================
// fetchMcpTools (v2.1.112) — single attempt, no error surfacing
// Location: chunks.162.mjs:569-595 (excerpt)
// ============================================

// ORIGINAL (for source lookup):
NS = aX(async (q) => {
    if (q.type !== "connected") return [];
    try {
        if (!q.capabilities?.tools) return [];
        let K = await q.client.request({
                method: "tools/list"
            }, bg6),
            _ = iI6(K.tools),
            z = q.config.type === "sdk" && S6(process.env.CLAUDE_AGENT_SDK_MCP_NO_PREFIX);
        return _.map((Y) => {
            // ...
        });
    } catch (q) {
        return [];   // ← silent: no error visible to user, no retry
    }
});

// READABLE (for understanding):
const fetchMcpTools = memoize(async (connectedClient) => {
    if (connectedClient.type !== "connected") return [];
    try {
        if (!connectedClient.capabilities?.tools) return [];
        const response = await connectedClient.client.request(
            { method: "tools/list" },
            mcpToolsListResponseSchema,
        );
        const tools = sanitizeMcpToolList(response.tools);
        // ... map to local tool objects ...
        return /* mapped tools */;
    } catch (error) {
        return [];  // ← BUG: tool count appears as 0; cause silently lost
    }
});

// Mapping: NS→fetchMcpTools, q→connectedClient, K→response, bg6→mcpToolsListResponseSchema,
//          iI6→sanitizeMcpToolList, _→tools
```

## v2.1.142 (retry + capture)

```javascript
// ============================================
// fetchMcpTools (v2.1.142) — retry once + persistent error
// Location: cli_inner_pretty.js:414718-414750 (relevant prologue)
// ============================================

// ORIGINAL (for source lookup):
((WB = SW(
    async (H) => {
      if (H.type !== "connected") return [];
      try {
        if (!H.capabilities?.tools) return [];
        let $ = Date.now(),
          q;
        try {
          q = await H.client.request({ method: "tools/list" }, bSH, { timeout: aHH() });
        } catch (f) {
          if (f instanceof lK && f.code === Z7.RequestTimeout) throw f;
          (H8(H.name, `tools/list failed (${ZH(f)}); retrying once`),
            (q = await H.client.request({ method: "tools/list" }, bSH, { timeout: aHH() })));
        }
        H.toolsListError = void 0;
        let K = oHH(q.tools);
        if (K.length === 0)
          d("tengu_mcp_degraded", {
            reason: "connected_zero_tools",
            transportType: H.config.type ?? "stdio",
            ...dDH(H.config),
          });
        // ... map K to local tool objects ...

// READABLE (for understanding):
const fetchMcpTools = memoize(async (connectedClient) => {
    if (connectedClient.type !== "connected") return [];
    try {
        if (!connectedClient.capabilities?.tools) return [];

        const startedAt = Date.now();
        let response;

        // Try once. On failure (but NOT timeout), retry exactly once.
        try {
            response = await connectedClient.client.request(
                { method: "tools/list" },
                mcpToolsListResponseSchema,
                { timeout: getMcpEnvelopeTimeoutMs() },
            );
        } catch (firstAttemptError) {
            // Timeouts are NOT retried — they're definitive; the server didn't respond
            // within the protocol timeout, retrying without backoff just doubles latency.
            if (
                firstAttemptError instanceof McpProtocolError
                && firstAttemptError.code === McpErrorCode.RequestTimeout
            ) {
                throw firstAttemptError;
            }

            logMCPDebug(connectedClient.name, `tools/list failed (${errorMessage(firstAttemptError)}); retrying once`);

            // Retry — uses the same timeout, no backoff. Many transient races
            // (server warm-up, connection re-establishment) resolve immediately.
            response = await connectedClient.client.request(
                { method: "tools/list" },
                mcpToolsListResponseSchema,
                { timeout: getMcpEnvelopeTimeoutMs() },
            );
        }

        // Successful response → clear any prior error.
        connectedClient.toolsListError = undefined;

        const tools = sanitizeMcpToolList(response.tools);

        // Telemetry: distinguish "connected with zero tools" from other failure modes.
        if (tools.length === 0) {
            logTelemetry("tengu_mcp_degraded", {
                reason: "connected_zero_tools",
                transportType: connectedClient.config.type ?? "stdio",
                ...buildMcpBaseUrlAttrs(connectedClient.config),
            });
        }

        // ... continue mapping to local tool objects ...
    } catch (error) {
        // Both attempts failed (or it was a timeout): capture the error for UI display.
        connectedClient.toolsListError = errorMessage(error);
        return [];  // empty tool list — but the error is now visible in the menu
    }
});

// Mapping: WB→fetchMcpTools, SW→memoize, H→connectedClient, $→startedAt, q→response,
//          bSH→mcpToolsListResponseSchema, aHH→getMcpEnvelopeTimeoutMs,
//          f→firstAttemptError, lK→McpProtocolError, Z7→McpErrorCode,
//          H8→logMCPDebug, ZH→errorMessage, oHH→sanitizeMcpToolList, K→tools,
//          d→logTelemetry, dDH→buildMcpBaseUrlAttrs
```

(Note: the actual catch arm that sets `toolsListError` is not at the very end of `fetchMcpTools` in v2.1.142 — there's a wrapping layer (`UrH` cache lifecycle around the call) that captures the error before the outer catch. The behavior is the same; the path is just a bit indirected for cache-coherency reasons.)

## UI surfacing

```javascript
// ============================================
// /mcp menu status row - distinguishes 'tools fetch failed' from 'no tools'
// Location: cli_inner_pretty.js:452306-452342
// ============================================

// ORIGINAL (for source lookup, relevant block — JSX):
H.client.type === "disabled"
  ? V6.default.createElement(k, null, jq("inactive", z)(sH.radioOff), " disabled")
  : H.client.type === "connected"
    ? H.client.toolsListError
      ? V6.default.createElement(
          k,
          null,
          V6.default.createElement(Rq, { status: "warning", withSpace: !0 }),
          "connected \xB7 tools fetch failed",
        )
      : H.client.capabilities?.tools && $ === 0
        ? V6.default.createElement(
            k,
            null,
            V6.default.createElement(Rq, { status: "warning", withSpace: !0 }),
            "connected \xB7 no tools",
          )
        : V6.default.createElement(
            k,
            null,
            V6.default.createElement(Rq, { status: "success", withSpace: !0 }),
            "connected",
          )
  : /* ... pending / needs-auth / failed ... */

// READABLE (for understanding):
const statusBadge = (() => {
    if (server.client.type === "disabled") {
        return <Text>{makeIcon("inactive")} disabled</Text>;
    }
    if (server.client.type === "connected") {
        // PRIORITY 1: tools fetch failed → warning + "tools fetch failed"
        if (server.client.toolsListError) {
            return (
                <Text>
                    <StatusIcon status="warning" withSpace />
                    connected · tools fetch failed
                </Text>
            );
        }
        // PRIORITY 2: connected but server advertises tools yet returned an empty list
        // (this is the "tengu_mcp_degraded { connected_zero_tools }" case telemetry-wise)
        if (server.client.capabilities?.tools && toolsCount === 0) {
            return (
                <Text>
                    <StatusIcon status="warning" withSpace />
                    connected · no tools
                </Text>
            );
        }
        // PRIORITY 3: healthy
        return (
            <Text>
                <StatusIcon status="success" withSpace />
                connected
            </Text>
        );
    }
    // pending / needs-auth / failed cases continue below...
})();

// Mapping: H→server, $→toolsCount, k→Text, Rq→StatusIcon, jq→makeIcon, sH→iconSet,
//          z→theme
```

The detail menu also shows the error inline:

```javascript
// ============================================
// McpServerDetailMenu.IssueRow - inline error display for toolsListError
// Location: cli_inner_pretty.js:452398-452405
// ============================================

// ORIGINAL (for source lookup):
H.client.type === "connected" &&
  H.client.toolsListError &&
  V6.default.createElement(
    p,
    { flexDirection: "column" },
    V6.default.createElement(k, { bold: !0 }, "Issue: "),
    V6.default.createElement(k, { dimColor: !0 }, H.client.toolsListError),
  ),

// READABLE (for understanding):
{server.client.type === "connected" && server.client.toolsListError && (
    <Box flexDirection="column">
        <Text bold>Issue: </Text>
        <Text dimColor>{server.client.toolsListError}</Text>
    </Box>
)}

// Mapping: H→server, p→Box, k→Text, V6.default→React (Ink renderer)
```

## Reconnect-result message extends to tools-list errors

```javascript
// ============================================
// formatReconnectResult - distinguishes toolsListError from clean reconnect
// Location: cli_inner_pretty.js:451808-451811
// ============================================

// ORIGINAL (for source lookup):
case "connected":
  if (H.client.toolsListError)
    return { message: `Reconnected to ${$}, but fetching tools failed: ${H.client.toolsListError}`, success: !1 };
  return { message: `Reconnected to ${$}.`, success: !0 };

// READABLE (for understanding):
case "connected":
    if (reconnectedClient.client.toolsListError) {
        return {
            message: `Reconnected to ${serverName}, but fetching tools failed: ${reconnectedClient.client.toolsListError}`,
            success: false,
        };
    }
    return { message: `Reconnected to ${serverName}.`, success: true };

// Mapping: H→reconnectedClient, $→serverName
```

So when the user picks `Reconnect` on a server with `toolsListError`, the result message itself contains the underlying error — no need to navigate back to the detail view.

## Why This Approach

### Why retry exactly once (not twice, not exponential)

Most `tools/list` failures are transient at session-start: a server cold-starts, finishes its own initialization a few hundred ms after MCP's `initialize` succeeds, and then `tools/list` works. A single retry catches this race. More retries would mask harder failures (e.g. the server's `tools/list` handler genuinely panics — we want that visible, not retried away).

Exponential backoff is also rejected:
- `tools/list` is on the *startup critical path* — every retry delays session-ready.
- A single immediate retry adds at most ~one RTT.
- Servers that fail twice in immediate succession are unlikely to recover within a few seconds.

### Why timeouts are not retried

The retry catch arm explicitly re-throws timeouts:

```javascript
if (firstAttemptError instanceof McpProtocolError && firstAttemptError.code === McpErrorCode.RequestTimeout) {
    throw firstAttemptError;
}
```

A timeout means the server received the request but didn't respond within `MCP_TIMEOUT` (default 30 s). Retrying immediately doubles the wait without changing the probability of success — the server is either dead-slow (retry won't help) or hung (retry won't help). Surfacing the timeout immediately lets the user act.

### Why keep both `toolsListError` and the empty array

`toolsListError` is the *cause*; the empty array is the *consequence*. Some code paths only care about "how many tools?" (e.g. counting for the `/mcp` summary table) — those paths read the array length. Other code paths care about "why are there zero?" (e.g. the menu badge logic) — those read the field. Storing both lets each consumer use the right view.

### Why telemetry distinguishes "no tools" from "fetch failed"

The event `tengu_mcp_degraded { reason: "connected_zero_tools" }` only fires for the success-with-empty-list case (line 414734-414739). Failures (caught at line 414727) emit a different event tree (the MCP connection/error events at line 410898+ and 413283+). This separation lets the team triage:
- "connected_zero_tools" rate is the "user added a server that doesn't expose tools" rate — likely a configuration issue worth surfacing in docs.
- The failure events isolate transport/server-side bugs.

### Edge case: server advertises `capabilities.tools` but returns empty list

The `connected · no tools` badge only fires when `capabilities?.tools && toolsCount === 0`. If a server doesn't advertise the `tools` capability at all (e.g. a resource-only server), the badge falls through to `connected` with no warning. That's intentional: resource servers legitimately have no tools.

### Edge case: server returns 0 tools, retry returns 5

The retry result *replaces* the first attempt's result. If the first attempt returned `{tools: []}` (success but empty) and the retry returned 5 tools, that wouldn't happen via the current logic — the success path doesn't retry. Only *exceptions* trigger retry. If a server is in a state where it sometimes returns success-with-zero and sometimes returns 5 tools, the user sees whichever the first attempt got. (This is fine; that server has a bug to fix on its end.)

### Trade-off: retry doubles request count on first session

For a session with 10 MCP servers where each `tools/list` fails on the first attempt, the worst-case adds 10 retries (each at most a few hundred ms). That can add ~1-2 seconds to startup. Worth it for the much-improved diagnosability when retries actually fail. The retry also means servers that briefly hang on first contact get a second chance, improving success rate.

### Key insight

The pattern is "silent failure becomes visible failure with a remedy." The previous code returned `[]` and that was that — the user had no way to know whether the server had 0 tools or whether the call had failed. With `toolsListError` populated and surfaced in the UI, the user can see the exact error message ("Connection error: ENOTFOUND", "Schema validation failed: tools[3].inputSchema.type must be 'object'", etc.) and act on it.

## Related Symbols

See [`symbol_additions_v2_1_142_mcp.md`](../00_overview/symbol_additions_v2_1_142_mcp.md) section "Module: MCP — tools/list Lifecycle".

Key entities:
- `fetchMcpTools` (`WB`, cli_inner_pretty.js:414718-414810+) — memoized; now retry-once
- `toolsListError` (string field on connected client state, populated only via `fetchMcpTools`)
- `McpProtocolError` (`lK`) — SDK class with `.code` (used for timeout discrimination)
- `McpErrorCode.RequestTimeout` (`Z7.RequestTimeout`)
- `getMcpEnvelopeTimeoutMs` (`aHH`, cli_inner_pretty.js:412341-412344) — 30 s default
- `sanitizeMcpToolList` (`oHH`, cli_inner_pretty.js:412064-412072) — unicode normalisation pass
- `buildMcpBaseUrlAttrs` (`dDH`, cli_inner_pretty.js:413269-413272) — extracts URL for telemetry
- `tengu_mcp_degraded` (telemetry event name) — emitted with `reason: "connected_zero_tools"`
- `formatReconnectResult` (`Nj8`, cli_inner_pretty.js:451806-451826) — surfaces `toolsListError` in Reconnect result
