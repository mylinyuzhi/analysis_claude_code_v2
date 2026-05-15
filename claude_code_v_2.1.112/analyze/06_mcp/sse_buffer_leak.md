# MCP SSE/HTTP — Buffer Leak Fix + Mid-Response Hang Fix

**Versions:** 2.1.97 (~50 MB/hr buffer accumulation on reconnect) · 2.1.110 (indefinite hang on mid-response drop)

## Summary

Two related defects in the SSE/HTTP MCP transports that both manifest in long-lived sessions with flaky network connectivity:

1. **2.1.97 — Buffer accumulation:** Each time an SSE or HTTP MCP server reconnected, the previous transport's pending buffers (response body chunks, the `EventSource` stream, and the in-flight pending-request map) were not released. Under typical "MCP server reconnects every 5-10 minutes" enterprise conditions, memory grew by ~50 MB/hr — observable as Claude Code RSS climbing steadily across long sessions.
2. **2.1.110 — Mid-response hang:** When the SSE/HTTP connection dropped *during* a tool call (server crashed mid-stream), the model would wait indefinitely for the response that would never arrive. The tool-call promise was never rejected; the agent loop was stuck. Even Ctrl+C wouldn't fully recover.

The 2.1.110 fix adds a **`transportErrorState`** that tracks the time of the most recent transport error per server. A 30-second watchdog inside every in-flight tool call checks whether an error occurred *during* the call and, if so, aborts the call with "transport dropped mid-call; response presumed lost." This same state also gates the buffer-leak fix: after 3 consecutive errors of the same type, the transport is explicitly closed (which drops buffer references) rather than being left dangling.

## Files Involved

| Path | Lines | What |
|------|------:|------|
| `chunks.162.mjs` | 381-384 | `transportErrorState = { lastErrorAt, consecutiveErrors }` per-server |
| `chunks.162.mjs` | 386-391 | `closeTransport` (`N`) — single-entry idempotent close |
| `chunks.162.mjs` | 392-394 | `isTerminalNetworkError` (`R`) — regex matching ECONNRESET/ETIMEDOUT/EPIPE/etc. |
| `chunks.162.mjs` | 395-432 | `j.onerror` — the error classifier+counter |
| `chunks.162.mjs` | 433-439 | `j.transport.onmessage` interposer — resets the counter on success |
| `chunks.162.mjs` | 440-446 | `j.onclose` — clears five memoization caches (forces reconnect path) |
| `chunks.162.mjs` | 545 | `transportErrorState: V` — exposed on `ConnectedMCPServer` |
| `chunks.161.mjs` | 2658, 2677 | watchdog inside `callMcpTool` (`NRK`) — aborts on mid-call drop |
| `chunks.161.mjs` | 1322-1397 | session-expired (`404 ConnectionClosed`) reconnection path |
| `chunks.161.mjs` | 1956 | error-code handling for `-32000 ConnectionClosed`, `-32001 RequestTimeout` |

## The `transportErrorState` Setup

```javascript
// ============================================
// transportErrorState - per-server error tracking with N-strikes-and-close policy
// Location: chunks.162.mjs:376-446
// ============================================

// ORIGINAL (for source lookup, the relevant block):
let D = Date.now(),               // connectionStartTime
    Z = !1,                       // hadErrors flag (for close-time logging)
    G = j.onerror,                // pre-existing SDK error handler
    f = j.onclose,                // pre-existing SDK close handler
    v = 3,                        // MAX_CONSECUTIVE_ERRORS
    V = {                         // ← transportErrorState
        lastErrorAt: 0,
        consecutiveErrors: 0
    },
    k = !1,                       // closing flag (idempotent close gate)
    N = (m) => {                  // closeTransport
        if (k) return;
        k = !0, i8(q, `Closing transport (${m})`), j.close().catch((S) => {
            i8(q, `Error during close: ${b6(S)}`)
        })
    },
    R = (m) => {                  // isTerminalNetworkError
        return m.includes("ECONNRESET") || m.includes("ETIMEDOUT") || m.includes("EPIPE") ||
               m.includes("EHOSTUNREACH") || m.includes("ECONNREFUSED") ||
               m.includes("Body Timeout Error") || m.includes("terminated") ||
               m.includes("SSE stream disconnected") ||
               m.includes("Failed to reconnect SSE stream")
    };

// On every transport error:
if (j.onerror = (m) => {
    let transportType = K.type || "stdio";
    // ... type-specific logging ...
    if (transportType === "sse" || transportType === "http" || transportType === "claudeai-proxy") {
        if (m.message.includes("Maximum reconnection attempts")) {
            if (closeTransport("SSE reconnection exhausted"), G) G(m);
            return
        }
        if (isTerminalNetworkError(m.message)) {
            V.consecutiveErrors++;
            V.lastErrorAt = Date.now();   // ← timestamp for the mid-call watchdog
            logMCPDebug(q, `Terminal connection error ${V.consecutiveErrors}/${v}`);
            if (V.consecutiveErrors >= v) {
                V.consecutiveErrors = 0;
                closeTransport("max consecutive terminal errors");   // ← BUFFER-LEAK FIX
            }
        } else {
            V.consecutiveErrors = 0;     // ← non-terminal error resets the counter
        }
    }
    if (G) G(m)
}, j.transport) {
    let prevOnMessage = j.transport.onmessage;
    j.transport.onmessage = (S, F) => {
        if (V.lastErrorAt !== 0) V.lastErrorAt = 0, V.consecutiveErrors = 0;
        //                                          ^^^ ← every successful message resets the state
        prevOnMessage?.(S, F)
    }
}

// READABLE (for understanding):
const connectionStartTime = Date.now();
let hadErrors = false;
const prevOnError = client.onerror;
const prevOnClose = client.onclose;
const MAX_CONSECUTIVE_ERRORS = 3;

const transportErrorState = {
    lastErrorAt: 0,
    consecutiveErrors: 0,
};

let isClosing = false;
const closeTransport = (reason) => {
    if (isClosing) return;                              // idempotent
    isClosing = true;
    logMCPDebug(serverName, `Closing transport (${reason})`);
    client.close().catch((err) => {
        logMCPDebug(serverName, `Error during close: ${errorMessage(err)}`);
    });
};

const isTerminalNetworkError = (msg) => {
    return [
        "ECONNRESET", "ETIMEDOUT", "EPIPE", "EHOSTUNREACH", "ECONNREFUSED",
        "Body Timeout Error", "terminated",
        "SSE stream disconnected", "Failed to reconnect SSE stream"
    ].some((token) => msg.includes(token));
};

client.onerror = (error) => {
    const transportType = config.type || "stdio";
    // ... type-specific logging ...

    if (transportType === "sse" || transportType === "http" || transportType === "claudeai-proxy") {
        if (error.message.includes("Maximum reconnection attempts")) {
            closeTransport("SSE reconnection exhausted");
            prevOnError?.(error);
            return;
        }
        if (isTerminalNetworkError(error.message)) {
            transportErrorState.consecutiveErrors++;
            transportErrorState.lastErrorAt = Date.now();
            logMCPDebug(serverName,
                `Terminal connection error ${transportErrorState.consecutiveErrors}/${MAX_CONSECUTIVE_ERRORS}`);
            if (transportErrorState.consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
                transportErrorState.consecutiveErrors = 0;
                closeTransport("max consecutive terminal errors");   // ← BUFFER-LEAK FIX
            }
        } else {
            transportErrorState.consecutiveErrors = 0;
        }
    }
    prevOnError?.(error);
};

if (client.transport) {
    const prevOnMessage = client.transport.onmessage;
    client.transport.onmessage = (msg, extra) => {
        // SUCCESS: reset the error state, regardless of prior accumulation
        if (transportErrorState.lastErrorAt !== 0) {
            transportErrorState.lastErrorAt = 0;
            transportErrorState.consecutiveErrors = 0;
        }
        prevOnMessage?.(msg, extra);
    };
}

// Mapping: V→transportErrorState, k→isClosing, N→closeTransport, R→isTerminalNetworkError,
//          v→MAX_CONSECUTIVE_ERRORS, j→client, G→prevOnError, f→prevOnClose,
//          D→connectionStartTime, Z→hadErrors, q→serverName, K→config, m→error/msg,
//          i8→logMCPDebug
```

## The `j.onclose` — Cache Eviction (Buffer Reference Release)

```javascript
// ============================================
// Connection-close cleanup — clears all memoization caches to release buffer refs
// Location: chunks.162.mjs:440-446
// ============================================

// ORIGINAL (for source lookup):
j.onclose = () => {
    let m = Date.now() - D,
        S = K.type ?? "unknown";
    i8(q, `${S.toUpperCase()} connection closed after ${Math.floor(m/1000)}s (${Z?"with errors":"cleanly"})`);
    let F = D98(q, K);
    if (NS.cache.delete(q), Es.cache.delete(q), HP6.cache.delete(q), JP6.cache.delete(q), OL.cache.delete(F), i8(q, "Cleared connection cache for reconnection"), f) f()
};

// READABLE (for understanding):
client.onclose = () => {
    const uptimeMs = Date.now() - connectionStartTime;
    const transportType = config.type ?? "unknown";
    logMCPDebug(serverName, `${transportType.toUpperCase()} connection closed after ${Math.floor(uptimeMs/1000)}s (${hadErrors ? "with errors" : "cleanly"})`);

    const cacheKey = computeServerCacheKey(serverName, config);

    // FIVE CACHES (memoized per-server) — all must release their references:
    listToolsCache.cache.delete(serverName);         // NS  - tools list
    listResourcesCache.cache.delete(serverName);     // Es  - resource list
    listResourceTemplatesCache.cache.delete(serverName); // HP6 - resource template list
    listPromptsCache.cache.delete(serverName);       // JP6 - prompt list
    getClientCache.cache.delete(cacheKey);           // OL  - the client itself

    logMCPDebug(serverName, "Cleared connection cache for reconnection");
    prevOnClose?.();
};

// Mapping: D→connectionStartTime, K→config, q→serverName, F→cacheKey,
//          NS→listToolsCache, Es→listResourcesCache, HP6→listResourceTemplatesCache,
//          JP6→listPromptsCache, OL→getClientCache, D98→computeServerCacheKey
```

**Why five caches and not one:** Each MCP capability surface (tools, resources, resource templates, prompts) is memoized independently because they have different staleness profiles (tools change rarely, resources can be added per-session, etc.). Forgetting any of them would leak references back to the closed transport's response buffers — which is exactly the pre-2.1.97 bug. All five caches now key on `serverName` (or `cacheKey` for the client itself), so all five `cache.delete(...)` calls are required for full release.

## The Mid-Response Watchdog (2.1.110)

The 30-second-interval watchdog inside every in-flight tool call:

```javascript
// ============================================
// Mid-call watchdog — aborts the tool call if a transport error happened during it
// Location: chunks.161.mjs:2675-2706
// ============================================

// ORIGINAL (for source lookup, focused):
let X = setInterval(() => {
    let N = Math.floor((Date.now() - J) / 1000);
    if (i8(K, `Tool '${Y}' still running (${N}s elapsed)`),
        z && z.lastErrorAt > J && Date.now() - z.lastErrorAt > 90000)
        i8(K, `Tool '${Y}' aborting: transport error ${Math.floor((Date.now()-z.lastErrorAt)/1000)}s ago, response presumed lost`),
        M(new XV(`MCP server "${K}" transport dropped mid-call; response for tool "${Y}" was lost`, "MCP transport lost mid-call"))
}, 30000);

// READABLE (for understanding):
//   J = toolStartTime
//   Y = toolName
//   K = serverName
//   z = transportErrorState (from the ConnectedMCPServer)
//   M = the abort function (rejects the call's outer promise)
const watchdog = setInterval(() => {
    const elapsedSec = Math.floor((Date.now() - toolStartTime) / 1000);
    logMCPDebug(serverName, `Tool '${toolName}' still running (${elapsedSec}s elapsed)`);

    // Three conditions for "transport dropped mid-call":
    // 1. We have a transportErrorState (z != null)
    // 2. The most recent error happened AFTER the tool started (z.lastErrorAt > J)
    // 3. It's been >90 seconds since that error (Date.now() - z.lastErrorAt > 90000)
    //    — meaning the connection hasn't recovered with a follow-up successful message
    if (transportErrorState &&
        transportErrorState.lastErrorAt > toolStartTime &&
        Date.now() - transportErrorState.lastErrorAt > 90_000) {
        logMCPDebug(serverName,
            `Tool '${toolName}' aborting: transport error ${Math.floor((Date.now() - transportErrorState.lastErrorAt)/1000)}s ago, response presumed lost`);
        abortToolCall(new McpToolCallError(
            `MCP server "${serverName}" transport dropped mid-call; response for tool "${toolName}" was lost`,
            "MCP transport lost mid-call"
        ));
    }
}, 30_000);

// Mapping: X→watchdog, J→toolStartTime, Y→toolName, K→serverName, z→transportErrorState,
//          M→abortToolCall, XV→McpToolCallError, i8→logMCPDebug
```

## How the Two Halves Cooperate

**Path A — Server crashes mid-tool-call:**
1. Tool call starts at `t0`. Watchdog begins polling every 30s.
2. SSE/HTTP connection drops at `t0 + 10s`. `j.onerror` fires; `transportErrorState.lastErrorAt = t0 + 10s; consecutiveErrors = 1`.
3. Underlying SDK tries to reconnect; let's say it reconnects, but the originally-pending tool call is dropped (no response will arrive).
4. The tool call is still pending. At `t0 + 30s`, the watchdog runs the first check: `lastErrorAt = t0 + 10s > t0`, but `Date.now() - lastErrorAt = 20s < 90s` → don't abort yet.
5. At `t0 + 100s` (the 4th watchdog tick), `Date.now() - lastErrorAt = 90s ≥ 90s` → abort with "transport dropped mid-call." The model receives an error and can retry.

**Path B — Transient flakiness:**
1. Server returns a tool result at `t0 + 100ms`.
2. A 503 transient error happens at `t0 + 2s`. `transportErrorState.consecutiveErrors = 1; lastErrorAt = t0 + 2s`.
3. Next message succeeds at `t0 + 3s` (e.g. tool list refresh). `transport.onmessage` interposer resets `lastErrorAt = 0; consecutiveErrors = 0`.
4. The next call starts fresh — no false-positive abort.

**Path C — Persistent failure (the buffer-leak case):**
1. Server is unreachable (network partition).
2. SSE keeps trying to reconnect; each attempt fails. `consecutiveErrors` accumulates: 1, 2, 3.
3. On the 3rd consecutive error, `consecutiveErrors >= 3` → `closeTransport("max consecutive terminal errors")`.
4. `client.close()` runs → `j.onclose` fires → all five caches are evicted → response buffers and pending request map are dereferenced → garbage collector reclaims memory.
5. The next tool call hitting this server gets a fresh connect (or `failed` state if connect itself fails).

## Why This Approach

**Why a separate `transportErrorState` (not just using the SDK's own error events):**
The underlying `@modelcontextprotocol/sdk` doesn't currently expose a "connection dropped" event in a way the client can hook (the SDK has reconnection logic that abstracts drops). Tracking the timestamp of *any* terminal-error message in Claude Code lets the watchdog reason about "did the connection have issues during my call?" without depending on SDK internals. The explicit `transportErrorState` is **part of the `ConnectedMCPServer` type** (exposed at chunks.162.mjs:545), so every call site can consult it.

**Why a 3-strike threshold (not 1):**
A single transient `ECONNRESET` is normal on a flaky network. The SDK retries internally and recovers. Closing on the first error would cause excessive reconnect churn. Three consecutive errors with *no successful message in between* is strong evidence of persistent failure — at that point a clean restart (close-and-reconnect) is faster than the SDK's internal retry loop.

**Why 30-second polling and 90-second threshold (not 5s/30s):**
- Tool calls legitimately take minutes (long-running DB query, large file fetch). A 5-second poll would log frequently for no reason.
- The 90-second threshold gives the SDK time to *reconnect and replay* the request if the protocol supports it (HTTP/SSE retry-after, session-expired 404 recovery at line 1322). Most genuine drops manifest as a stable error in the first ~60 seconds; if 90 seconds pass with the connection in error state, recovery has demonstrably failed.

**Why log "still running" every 30s anyway:**
Long-running tool calls are common; without periodic progress logs, the user has no signal whether the call is making progress, hung, or just slow. The "Tool 'X' still running (Ns elapsed)" line provides reassurance and gives a timestamp anchor for debugging.

**Why reset the counter on `transport.onmessage` (not `onerror`):**
The reset point is the *first* successful message after an error window. This is the canonical "the connection healed" signal. Resetting in `onerror` (e.g. "this error wasn't terminal, so reset") doesn't work because non-terminal errors are rare; most flakiness manifests as terminal errors followed by a successful retry.

**Why five separate `cache.delete` calls (not a single `clearAllCaches(serverName)`):**
The caches are owned by different modules (tools, resources, resource templates, prompts, connection itself). A centralized clearer would create a tight coupling. The five-line inline cleanup is uglier code but easier to refactor — each cache's invalidation logic stays in the file that owns the cache.

**Why "Body Timeout Error" and "terminated" in the terminal-error regex:**
These are `undici` (Node 18+'s HTTP client) specific error messages, raised when the streaming response body is interrupted mid-read. Without including them, the buffer-leak fix wouldn't trigger for HTTP transport drops — which is precisely the case the 2.1.97 fix targets.

**Edge case: stdio MCP server with SyntaxError:**
At chunks.162.mjs:397-400: a stdio server that emits non-JSON debug output is logged but not counted toward `consecutiveErrors`. The stdio transport's connection lives in a child-process pipe; it doesn't have the buffer-leak failure mode (Node releases pipe buffers normally). The terminal-error counting is gated on `transportType === "sse" || "http" || "claudeai-proxy"`.

**Edge case: claudeai-proxy 401:**
Handled separately via `nz7` (`markServerNeedsAuth`) at chunks.161.mjs:2011. A 401 doesn't count toward `consecutiveErrors` — it's a credential issue, not a buffer leak.

**Key insight:** This is **defensive coupling between two layers**: the transport-error monitor at chunks.162.mjs:381+ and the in-call watchdog at chunks.161.mjs:2675+. Neither half alone solves either problem:
- Without the monitor's `transportErrorState`, the watchdog has nothing to consult.
- Without the watchdog, mid-call drops still hang the model (the monitor closes the transport, but the model's pending request is still in `Promise.race`).
- Without the close on consecutive errors, the buffers still leak.

The fix is to track error state *outside* the SDK and to inject a periodic watchdog *inside* every tool call. Both are required, and they communicate through a tiny shared object (`transportErrorState`) exposed on the `ConnectedMCPServer` shape.

## Related Symbols

See [`symbol_additions_unit_14.md`](../00_overview/symbol_additions_unit_14.md) section "Module: MCP — Transport Layer".

Key entities:
- `transportErrorState` (per-server `V` object with `lastErrorAt` + `consecutiveErrors`, chunks.162.mjs:381)
- `closeTransport` (`N`, chunks.162.mjs:386-391) - idempotent close primitive
- `isTerminalNetworkError` (`R`, chunks.162.mjs:392-394) - regex matcher
- `McpToolCallError` (`XV`) - wraps the "transport dropped mid-call" message
- `markServerNeedsAuth` (`nz7`) - the 401 path
- `getMcpRequestTimeout` (`ol8`) - default 30 000 ms (still respected)
- `requireConnectedMcpClient` (`Fy6`) - guard at tool-call entry
- The five caches: `listToolsCache` (`NS`), `listResourcesCache` (`Es`), `listResourceTemplatesCache` (`HP6`), `listPromptsCache` (`JP6`), `getClientCache` (`OL`)
