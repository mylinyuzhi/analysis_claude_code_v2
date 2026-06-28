# `headersHelper` re-auth + reconnect on tool-call 401/403; startup needs-auth notice

> **Type:** NET-NEW capability (re-auth branch) + CARRYOVER (startup notice) · **Version:** 2.1.193 · **Module:** `39_mcp/`
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (VERSION `2.1.193`, build `a1938d2a`). Every `cli_inner_pretty.js:<line>` is a **193** line unless tagged `(183)`.

## TL;DR

v2.1.193 teaches the MCP tool-call wrapper to **self-heal an expired auth token**: when a tool call to an `http`/`sse`/`ws` server that has a `headersHelper` returns **401** (or **403** when a `headersHelper` exists), the wrapper disconnects, reconnects (which re-runs `headersHelper` to pick up rotated credentials), and retries the tool call **once**. Concurrent calls to the same server share one reconnect via an in-flight map. If still unauthorized, it falls through to the existing "requires re-authorization" error and marks the server `needs-auth`, which the (carryover) startup notice surfaces as "run /mcp to authenticate". The re-auth branch is net-new (`grep -c "re-running headersHelper and retrying once"` = `0` in 183; the `reauth_retry` error_code = `0` in 183 — note the `mcp_headers_helper` feature_name itself is **pre-existing**, used since ≤183 for headersHelper config-validation errors via the generic `tengu_feature_sad` logger, so only the new `reauth_retry` value is the 193 delta).

---

## 1. The re-auth branch inside `callToolWithWatchdog` (`bao`)

**What it does.** In the tool-call `catch` block, detects an auth failure on a `headersHelper`-backed transport and, exactly once, tears down + rebuilds the connection (re-running `headersHelper`) and re-invokes the tool. This is the same wrapper that hosts the idle watchdog ([`tool_call_idle_timeout.md`](./tool_call_idle_timeout.md)).

**How it works (step-by-step).**

```javascript
// ============================================
// callToolWithWatchdog (catch) - headersHelper re-auth + reconnect + retry-once
// Location: cli_inner_pretty.js:293132-293180
// ============================================

// ORIGINAL (for source lookup):
let v = _ instanceof ai ? void 0 : "code" in _ ? _.code : void 0,
  C = (n.type === "http" || n.type === "sse" || n.type === "ws") && !!n.headersHelper,
  x = v === 401 || _ instanceof vR || (v === 403 && C);
if (C && !g) {
  let R = aWe(t, n), P = pao.get(R),
    O = P !== void 0 && _ instanceof ai && _.code === pi.ConnectionClosed;
  if (x || O) {
    if ((sn(t, `Tool '${o}' returned ${v ?? 401}; re-running headersHelper and retrying once`),
        Ct("mcp_headers_helper", "reauth_retry"), !P))
      ((P = (async () => (await nT(t, n), ID(t, n)))()),
        pao.set(R, P), P.finally(() => pao.delete(R)).catch(() => {}));
    let D = await P;
    if (D.type === "connected")
      return bao({ client: D, tool: o, args: s, meta: i, signal: a, onProgress: l,
        hasResultSizeAnnotation: c, imageLimits: u, toolExecution: d, taskRegistry: p,
        toolUseId: f, idleTimeoutMs: m, isAuthRetry: !0 });
    sn(t, `headersHelper reconnect returned '${D.type}'; falling through to needs-auth`);
  }
}
if (x) {
  sn(t, "Tool call returned 401 Unauthorized - token may have expired");
  let R = Wce(n);
  throw (V("tengu_mcp_tool_call_auth_error", { errorCode: String(v ?? 401), transportType: $e(n.type ?? "stdio"), ...R,
      ...(AIe(t, n) && { mcpServerName: mc(t), mcpToolName: mc(o) }) }),
    new lWe(t, `MCP server "${t}" requires re-authorization (token expired)`));
}

// READABLE (for understanding):
let errCode = err instanceof McpError ? undefined : "code" in err ? err.code : undefined;
let hasHeadersHelper = (config.type === "http" || config.type === "sse" || config.type === "ws") && !!config.headersHelper;
let isAuthError = errCode === 401 || err instanceof McpAuthRequiredError || (errCode === 403 && hasHeadersHelper);
if (hasHeadersHelper && !isAuthRetry) {                       // !isAuthRetry guards against infinite re-auth loops
  let cacheKey = serverCacheKey(serverName, config);
  let inflight = inFlightReauthReconnects.get(cacheKey);      // share one reconnect across concurrent calls
  let reconnectInProgress = inflight !== undefined && err instanceof McpError && err.code === RpcCode.ConnectionClosed;
  if (isAuthError || reconnectInProgress) {
    sn(serverName, `Tool '${tool}' returned ${errCode ?? 401}; re-running headersHelper and retrying once`);
    logFeatureSadEvent("mcp_headers_helper", "reauth_retry");   // emits tengu_feature_sad{feature_name, error_code}
    if (!inflight) {                                          // first concurrent caller starts the reconnect
      inflight = (async () => (await disconnectAndClearCache(serverName, config), connectOrGetClient(serverName, config)))();
      inFlightReauthReconnects.set(cacheKey, inflight);
      inflight.finally(() => inFlightReauthReconnects.delete(cacheKey)).catch(() => {});
    }
    let reconnected = await inflight;
    if (reconnected.type === "connected")
      return callToolWithWatchdog({ client: reconnected, tool, args, meta, signal, onProgress, hasResultSizeAnnotation,
        imageLimits, toolExecution, taskRegistry, toolUseId, idleTimeoutMs, isAuthRetry: true });  // retry ONCE
    sn(serverName, `headersHelper reconnect returned '${reconnected.type}'; falling through to needs-auth`);
  }
}
if (isAuthError) {                                            // unrecoverable: surface "requires re-authorization"
  sn(serverName, "Tool call returned 401 Unauthorized - token may have expired");
  let extra = authErrorTelemetryFields(config);
  throw (V("tengu_mcp_tool_call_auth_error", { errorCode: String(errCode ?? 401), transportType: config.type ?? "stdio", ...extra,
      ...(shouldNameServer(serverName, config) && { mcpServerName: redact(serverName), mcpToolName: redact(tool) }) }),
    new McpReauthError(serverName, `MCP server "${serverName}" requires re-authorization (token expired)`));
}

// Mapping: bao→callToolWithWatchdog, _→err, v→errCode, C→hasHeadersHelper, x→isAuthError, g→isAuthRetry,
//   aWe→serverCacheKey, pao→inFlightReauthReconnects, nT→disconnectAndClearCache, ID→connectOrGetClient,
//   Ct→logFeatureSadEvent (tengu_feature_sad), vR→McpAuthRequiredError, ai→McpError, pi→RpcCode, lWe→McpReauthError, Wce→authErrorTelemetryFields
```

1. **`headersHelper` is a config field** on `http`/`sse`/`ws` transports that produces dynamic auth headers; the SDK invokes it per request. `hasHeadersHelper` (`C`) is true only when one is configured.
2. **Auth-error detection** — `isAuthError` (`x`) fires on a 401, an `McpAuthRequiredError`, or a 403 *when a headersHelper exists* (a 403 without a headersHelper is treated as a genuine permission denial, not a stale token).
3. **Guard `hasHeadersHelper && !isAuthRetry`** — only attempt a re-auth when there is a headersHelper to re-run, and not if we are *already inside* an auth retry (`isAuthRetry` is set `true` on the recursive call). This is the loop breaker: at most one re-auth attempt per original call.
4. **In-flight dedup** — `inFlightReauthReconnects` (`pao`) is a map keyed by `serverCacheKey(serverName, config)` (`aWe`). The first concurrent tool call to hit a 401 starts the reconnect promise and stores it; other concurrent calls to the same server `await` the *same* promise instead of each tearing down the connection. `reconnectInProgress` also catches calls that failed with `ConnectionClosed` *because* a reconnect is already underway. The promise self-evicts via `.finally(() => map.delete(cacheKey))`.
5. **Disconnect + reconnect** — `disconnectAndClearCache(serverName, config)` (`nT`) drops the connection and clears its cache; `connectOrGetClient(serverName, config)` (`ID`) reconnects, which **re-runs `headersHelper`** and so picks up rotated credentials.
6. **Retry once** — on `reconnected.type === "connected"`, the tool is re-called with `isAuthRetry: true` (so step 3 won't re-enter).
7. **Fall-through** — if reconnect didn't connect, or the retry still 401s, control reaches the (carryover) auth-error block: logs `tengu_mcp_tool_call_auth_error` and throws `McpReauthError` (`lWe`) `MCP server "X" requires re-authorization (token expired)`, which marks the server `needs-auth`.

**Why disconnect+reconnect rather than just re-call `headersHelper`.** A stale token usually means the cached *connection* (and any session it holds) is also dead. Re-running `headersHelper` in isolation would attach fresh headers to a possibly-dead session. Tearing the connection down and rebuilding it guarantees the new credentials are used on a fresh session — the same primitive the connect path already provides, reused here.

**Why dedup the reconnect.** Without the `inFlightReauthReconnects` map, N concurrent tool calls all hitting the expired token would each disconnect+reconnect, thrashing the server and racing each other's sessions. Sharing one reconnect promise per server makes the re-auth a single, serialized event no matter how many tool calls trip it at once.

**Key insight.** The whole self-heal is "one extra `catch` branch that, guarded against recursion and deduped per server, performs the *existing* disconnect/reconnect and re-invokes *itself* once." It sits **before** the legacy 401 surfacing (`"Tool call returned 401 Unauthorized - token may have expired"`, `:293170`), so an expired-but-rotatable token now recovers transparently, and only a *genuinely* unrecoverable auth failure reaches the user-facing "requires re-authorization" error.

---

## 2. Fall-through → `needs-auth` → the startup notice (CARRYOVER infra)

**What it does.** When the re-auth fails, the server is marked `needs-auth`. On the *next* startup, the existing notice tells the user that servers need authentication and points them at `/mcp`. **This notice machinery is carryover, not a 193 delta** — it is the surface the new re-auth branch *feeds*, not a new component.

**Honest carryover evidence.** The notice strings and the needs-auth cache are byte-identical in 183:
- The notice render `${a} MCP ${l} not connected — run /mcp to authenticate, retry, or see details:` is at `:504183` in 193 and **identically at 183 `:493517`** (1 occurrence each; verify with the ASCII-safe substring `to authenticate, retry, or see details` — a literal em-dash grep falsely misses it).
- The per-server startup warning `Run /mcp to authenticate, retry, or inspect the server.` is at `:504324` in 193 and **identically at 183 `:493676`**.
- The needs-auth cache file `mcp-needs-auth-cache.json` (path `$1n` `:292219`; reader `readNeedsAuthCache` `gao` `:292222`; `isCachedNeedsAuth` `oAa` `:292230`) and the connect-time skip `"Skipping connection (cached needs-auth)"` (`:292645`) are all 193:1 / 183:1.

**What is actually new for "surfaces auth-needed" in 193** is precisely §1: a *live* tool-call 401/403 now marks the server `needs-auth` after a failed re-auth, so the (unchanged) notice can fire on the next start. There is **no net-new startup-notice string or component** — treat the changelog's "startup notice when servers need auth" line as a UX re-announcement riding on carryover infrastructure.

**Drift note vs the scout dossier:** the dossier glossary listed `readNeedsAuthCache` at `:292213` — that line is actually `resolveIdleTimeoutMs`; the cache reader `gao` is at **`:292222`** (the path helper `$1n` is `:292219`). Re-verified by reading the bodies.

---

## Evidence — NET-NEW vs CARRYOVER (183 grep-diff)

| String / symbol | 193 | 183 | verdict |
|---|---|---|---|
| `re-running headersHelper and retrying once` | 1 (`:293142`) | 0 | NET-NEW |
| `reauth_retry` error_code (on `tengu_feature_sad`/`mcp_headers_helper`) | 1 (`:293143`) | 0 | NET-NEW |
| `mcp_headers_helper` feature_name (whole) | 7 | 6 | CARRYOVER (pre-existing config-validation logs; +1 = the new reauth_retry call) |
| `headersHelper reconnect returned` | 1 (`:293166`) | 0 | NET-NEW |
| `headersHelper` field uses | 21 | 18 | carryover field, +3 re-auth uses |
| `Tool call returned 401 Unauthorized - token may have expired` | 1 (`:293170`) | 1 | CARRYOVER (re-auth sits *before* it) |
| `requires re-authorization (token expired)` | 1 (`:293179`) | 1 | CARRYOVER |
| notice `not connected — run /mcp to authenticate, retry, or see details` | 1 (`:504183`) | 1 (`493517`) | CARRYOVER |
| `Skipping connection (cached needs-auth)` | 1 (`:292645`) | 1 | CARRYOVER |

---

## Cross-links

- Sibling 193 docs: [`tool_call_idle_timeout.md`](./tool_call_idle_timeout.md) (the **same** `callToolWithWatchdog` wrapper — the idle watchdog is the `try`, this re-auth is the `catch`), [`mcp_login_logout_cli.md`](./mcp_login_logout_cli.md) (explicit `mcp login` is the manual counterpart to this automatic re-auth), [`reliability_retries.md`](./reliability_retries.md) (OAuth retry-once), [`README.md`](./README.md).

## Related Symbols

> Symbol mappings live in the central index files (this doc uses **list format**, never a mapping table):
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (**MCP** home module)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations
> - [../00_overview/symbol_additions_v2_1_193_mcp.md](../00_overview/symbol_additions_v2_1_193_mcp.md) — the granular v2.1.193 MCP additions

Key functions in this document:

- `callToolWithWatchdog` (`bao`, `cli_inner_pretty.js:293017`) — tool-call wrapper; re-auth branch `:293132-293180`.
- `serverCacheKey` (`aWe`) / `inFlightReauthReconnects` (`pao`) — per-server reconnect dedup map.
- `disconnectAndClearCache` (`nT`) / `connectOrGetClient` (`ID`) — the reconnect primitives (carryover) that re-run `headersHelper`.
- `logFeatureSadEvent` (`Ct`, `cli_inner_pretty.js:44851`) — generic `tengu_feature_sad` logger; called `("mcp_headers_helper","reauth_retry")` (`:293143`). The `mcp_headers_helper` feature_name pre-existed (≤183); only the `reauth_retry` error_code is the 193 delta.
- `McpReauthError` (`lWe`) — thrown `MCP server "X" requires re-authorization (token expired)` (`:293179`).
- needs-auth (carryover): `needsAuthCachePath` (`$1n`, `:292219`), `readNeedsAuthCache` (`gao`, `:292222`), `isCachedNeedsAuth` (`oAa`, `:292230`), notice render `:504183`, startup warning `:504324`.
