# `MCP_TOOL_TIMEOUT` Now Raises the Per-Request Fetch Timeout

**Versions:** 2.1.142 (fix)

## Summary

`MCP_TOOL_TIMEOUT` was always honored at the **JSON-RPC envelope** layer (`Client.request({ method: ... }, schema, { timeout: MCP_TOOL_TIMEOUT })`), which is what the SDK's `Protocol` class uses to time out a tool-call message round-trip. But for **HTTP/SSE** servers the call also passes through a `fetch()` invocation, and the per-`fetch` `AbortController` was wired up with a **hardcoded 60-second timeout** (`GRK = 60000` in v2.1.112). Setting `MCP_TOOL_TIMEOUT=600000` (10 minutes) would raise the envelope timeout to 10 minutes, but the underlying `fetch` would still abort after 60 seconds — so any HTTP/SSE tool call that took longer than a minute failed regardless of the env-var.

v2.1.142 introduces a new function (`getRequestFetchTimeoutMs`, `U$4`) that reads `MCP_TOOL_TIMEOUT` and applies it to the `fetch` AbortController too, clamped to the 60 s floor (so smaller values cannot accidentally make the fetch *shorter* than the SDK's own protocol timeout retries).

## Files Involved

| Version | Path | Lines | What |
|---------|------|------:|------|
| v2.1.112 | `chunks.161.mjs` | 1967-1970 | `getToolTimeoutMs` (env → 1e8 default) — used by `Client.request` envelope |
| v2.1.112 | `chunks.161.mjs` | 2065-2087 | SSE/HTTP fetch wrapper — **hardcoded** `GRK = 60000` AbortController timeout |
| v2.1.112 | `chunks.161.mjs` | 2884 | `GRK = 60000` — the literal hardcode |
| v2.1.142 | `cli_inner_pretty.js` | 413221-413224 | `getToolTimeoutMs` (`r15`) — envelope, unchanged |
| v2.1.142 | `cli_inner_pretty.js` | **413346-413349** | **NEW** `getRequestFetchTimeoutMs` (`U$4`) — honors `MCP_TOOL_TIMEOUT` |
| v2.1.142 | `cli_inner_pretty.js` | 413350-413367 | SSE/HTTP fetch wrapper (`OS6`) — now calls `getRequestFetchTimeoutMs()` |
| v2.1.142 | `cli_inner_pretty.js` | 414062 | `MCP_FETCH_TIMEOUT_DEFAULT_MS` (`C$4` = 60000) |
| v2.1.142 | `cli_inner_pretty.js` | 414053 | `MCP_FETCH_TIMEOUT_MAX_MS` (`B$4` = 2147483647) |
| v2.1.142 | `cli_inner_pretty.js` | 414052 | `MCP_TOOL_TIMEOUT_DEFAULT_MS` (`i15` = 1e8) |

## The two timeouts and how they layer

```
User process
   │
   ▼
Client.request({method:"tools/call",…}, schema, {timeout: getToolTimeoutMs()})
                                                  └────────────┐
                                                  envelope timeout
                                                  reads MCP_TOOL_TIMEOUT, default 1e8 ms
   │
   ▼ (SDK calls transport)
Transport.send(req) ────────────► fetch(url, {signal: AbortController.signal})
                                                  └────────────┐
                                                  fetch timeout
                                                  v2.1.112: hardcoded 60 000 ms
                                                  v2.1.142: max(MCP_TOOL_TIMEOUT, 60 000)
```

Pre-fix, the fetch timeout was the *true* limit for HTTP/SSE servers — the envelope timeout was ineffectual past 60 seconds because the fetch had already aborted.

## The v2.1.112 Code (the bug)

```javascript
// ============================================
// mcpFetchWithTimeout (v2.1.112) — hardcoded 60 s
// Location: chunks.161.mjs:2065-2087
// ============================================

// ORIGINAL (for source lookup):
function iz7(q) {
    return async (K, _) => {
        if ((_?.method ?? "GET").toUpperCase() === "GET") return q(K, _);
        let Y = new Headers(_?.headers);
        if (!Y.has("accept")) Y.set("accept", gvY);
        let A = new AbortController,
            O = setTimeout(($) => $.abort(new DOMException("The operation timed out.", "TimeoutError")), GRK, A);
        O.unref?.();
        let w = _?.signal;
        if (w?.aborted) A.abort(w.reason);
        else w?.addEventListener("abort", () => A.abort(w.reason), { once: !0 });
        try {
            return await q(K, { ..._, headers: Y, signal: A.signal })
        } finally {
            clearTimeout(O)
        }
    }
}

// READABLE (for understanding):
function mcpFetchWithTimeout(innerFetch) {
    return async (url, init) => {
        if ((init?.method ?? "GET").toUpperCase() === "GET") return innerFetch(url, init);

        const headers = new Headers(init?.headers);
        if (!headers.has("accept")) headers.set("accept", MCP_SSE_ACCEPT_HEADER);

        // BUG: GRK is a constant 60_000 — no env-var support.
        const abortController = new AbortController();
        const timer = setTimeout(
            (ac) => ac.abort(new DOMException("The operation timed out.", "TimeoutError")),
            MCP_FETCH_TIMEOUT_HARDCODED,   // ← was 60000, NOT MCP_TOOL_TIMEOUT
            abortController,
        );
        timer.unref?.();

        // ...wire user signal to local abort controller...
        const userSignal = init?.signal;
        if (userSignal?.aborted) abortController.abort(userSignal.reason);
        else userSignal?.addEventListener("abort", () => abortController.abort(userSignal.reason), { once: true });

        try {
            return await innerFetch(url, { ...init, headers, signal: abortController.signal });
        } finally {
            clearTimeout(timer);
        }
    };
}

// Mapping: iz7→mcpFetchWithTimeout, GRK→MCP_FETCH_TIMEOUT_HARDCODED, q→innerFetch,
//          K→url, _→init, A→abortController, O→timer, w→userSignal,
//          gvY→MCP_SSE_ACCEPT_HEADER ("application/json, text/event-stream")
```

## The v2.1.142 Code (the fix)

```javascript
// ============================================
// getRequestFetchTimeoutMs - honors MCP_TOOL_TIMEOUT for per-request fetch
// Location: cli_inner_pretty.js:413346-413349
// ============================================

// ORIGINAL (for source lookup):
function U$4() {
  let H = parseInt(process.env.MCP_TOOL_TIMEOUT || "", 10);
  return H > 0 ? Math.min(Math.max(H, C$4), B$4) : C$4;
}

// READABLE (for understanding):
function getRequestFetchTimeoutMs() {
    const envValue = parseInt(process.env.MCP_TOOL_TIMEOUT || "", 10);
    if (envValue > 0) {
        // Clamp to [60 s, INT32_MAX]. Floor protects servers that need TCP keep-alive
        // probes within a minute; ceiling avoids setTimeout 32-bit overflow.
        return Math.min(Math.max(envValue, MCP_FETCH_TIMEOUT_DEFAULT_MS), MCP_FETCH_TIMEOUT_MAX_MS);
    }
    return MCP_FETCH_TIMEOUT_DEFAULT_MS;   // 60_000 ms
}

// Mapping: U$4→getRequestFetchTimeoutMs, H→envValue,
//          C$4→MCP_FETCH_TIMEOUT_DEFAULT_MS (=60000),
//          B$4→MCP_FETCH_TIMEOUT_MAX_MS (=2147483647)
```

```javascript
// ============================================
// mcpFetchWithTimeout (v2.1.142) — calls getRequestFetchTimeoutMs()
// Location: cli_inner_pretty.js:413350-413367
// ============================================

// ORIGINAL (for source lookup):
function OS6(H) {
  return async ($, q) => {
    if ((q?.method ?? "GET").toUpperCase() === "GET") return H($, q);
    let _ = new Headers(q?.headers);
    if (!_.has("accept")) _.set("accept", __5);
    let A = new AbortController(),
      z = setTimeout((f) => f.abort(new DOMException("The operation timed out.", "TimeoutError")), U$4(), A);
    z.unref?.();
    let Y = q?.signal;
    if (Y?.aborted) A.abort(Y.reason);
    else Y?.addEventListener("abort", () => A.abort(Y.reason), { once: !0 });
    try {
      return await H($, { ...q, headers: _, signal: A.signal });
    } finally {
      clearTimeout(z);
    }
  };
}

// READABLE (for understanding):
function mcpFetchWithTimeout(innerFetch) {
    return async (url, init) => {
        if ((init?.method ?? "GET").toUpperCase() === "GET") return innerFetch(url, init);

        const headers = new Headers(init?.headers);
        if (!headers.has("accept")) headers.set("accept", MCP_SSE_ACCEPT_HEADER);

        const abortController = new AbortController();
        const timer = setTimeout(
            (ac) => ac.abort(new DOMException("The operation timed out.", "TimeoutError")),
            getRequestFetchTimeoutMs(),     // ← NEW: env-var-driven
            abortController,
        );
        timer.unref?.();

        const userSignal = init?.signal;
        if (userSignal?.aborted) abortController.abort(userSignal.reason);
        else userSignal?.addEventListener("abort", () => abortController.abort(userSignal.reason), { once: true });

        try {
            return await innerFetch(url, { ...init, headers, signal: abortController.signal });
        } finally {
            clearTimeout(timer);
        }
    };
}

// Mapping: OS6→mcpFetchWithTimeout, H→innerFetch, $→url, q→init,
//          __5→MCP_SSE_ACCEPT_HEADER, A→abortController, z→timer, Y→userSignal,
//          U$4→getRequestFetchTimeoutMs
```

## Why This Approach

### Why two timeouts and not one

The MCP SDK runs its own request/response correlator inside the `Protocol` class. That class times out the *logical request* (e.g. "I sent tool/call with id=42 and never heard id=42 back, timeout"). It uses `getToolTimeoutMs` (`r15`) which defaults to **1e8 ms ≈ 27.7 hours**. That's effectively "no timeout" for the JSON-RPC envelope.

The `fetch` timeout is a different layer. It exists because HTTP connections need TCP keep-alive within a few minutes, and SSE streams need read-timeouts shorter than load-balancer disconnect timeouts. A 60 s default protects against "server hung the response and our keep-alive packets are getting black-holed." But for a *long-running tool call* (e.g. `run_terraform_plan`, `migrate_database`), 60 s is too short.

Before v2.1.142, the only way to get a tool call past 60 seconds on an HTTP/SSE server was to *not* use HTTP/SSE — switch to stdio, where there's no fetch layer. That's a poor workaround.

### Why clamp to `[60 000, INT32_MAX]`

- **Floor (60 000):** if you set `MCP_TOOL_TIMEOUT=1000`, you probably want the *envelope* timeout to be 1 s for testing, not the *fetch* timeout. A 1 s fetch timeout would race the underlying TCP handshake and cause spurious aborts. The 60 s floor preserves transport robustness regardless of the user's tool-level setting.
- **Ceiling (INT32_MAX, 2 147 483 647 ms ≈ 24.8 days):** Node's `setTimeout` silently degrades past INT32_MAX — values are converted to 1 ms, which would *shorten* the timeout to ~0. Clamping at INT32_MAX keeps the timer correct.

### Why not just remove the fetch timeout entirely

A stuck SSE stream is a real failure mode: the TCP connection is "open" from the kernel's perspective (no FIN, no RST), but the server-side process is dead or partitioned. Without a read timeout, the MCP client would wait forever for the next SSE event, even though no event will ever come. The fetch timeout is the safety net. The fix is to make the safety net *configurable*, not to remove it.

### What the user observed before the fix

```
$ MCP_TOOL_TIMEOUT=300000 claude
> Run the long_running_tool on the http server
[60 seconds pass]
Error: The operation timed out.
```

After the fix:

```
$ MCP_TOOL_TIMEOUT=300000 claude
> Run the long_running_tool on the http server
[300 seconds pass]
{result: ...}
```

### Trade-off

The envelope timeout `getToolTimeoutMs` still uses `MCP_TOOL_TIMEOUT` directly with no clamping (line 413222-413224). So setting `MCP_TOOL_TIMEOUT=10` will make the envelope time out in 10 ms, while the fetch will (correctly) run for 60 s. The user would see an envelope timeout (`RequestTimeout`) before the fetch returns — confusing but recoverable. The decision is "treat the env var as a *ceiling* on the envelope, a *floor-clamped* value on the fetch." Asymmetric but justifiable: small envelope timeouts are useful for debugging "did this hang or did it not start?"; small fetch timeouts are dangerous.

**Key insight:** Two timeouts at different layers were silently independent — the user-facing env var only controlled the higher layer (`Protocol.request`), and the lower layer (`fetch`) had a different policy. The fix uses the same env var to drive both, with appropriate clamping so the layers don't fight each other.

## Related Symbols

See [`symbol_additions_v2_1_142_mcp.md`](../00_overview/symbol_additions_v2_1_142_mcp.md) section "Module: MCP — Per-Request Fetch Timeout".

Key new entities:
- `getRequestFetchTimeoutMs` (`U$4`, cli_inner_pretty.js:413346-413349) — env-var-driven fetch timeout
- `MCP_FETCH_TIMEOUT_DEFAULT_MS` (`C$4`, = 60000)
- `MCP_FETCH_TIMEOUT_MAX_MS` (`B$4`, = 2147483647)
- `MCP_TOOL_TIMEOUT_DEFAULT_MS` (`i15`, = 100000000)

Unchanged from v2.1.112:
- `getToolTimeoutMs` (`r15` in v2.1.142, `yvY` in v2.1.112) — envelope timeout
- `MCP_SSE_ACCEPT_HEADER` (`__5` in v2.1.142, `gvY` in v2.1.112)
- `mcpFetchWithTimeout` (`OS6` in v2.1.142, `iz7` in v2.1.112) — structurally identical, just calls the new function
