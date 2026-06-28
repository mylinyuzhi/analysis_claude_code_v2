# MCP reliability refinements: capability-discovery retry, OAuth retry-once, 404→URL

> **Type:** NET-NEW retry layers + body-change · **Version:** 2.1.191 · **Module:** `39_mcp/`
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (VERSION `2.1.193`, build `a1938d2a`). Every `cli_inner_pretty.js:<line>` is a **193** line unless tagged `(183)`.

## TL;DR

v2.1.191 hardens the three flakiest MCP code paths against transient failures:

1. **Capability discovery** (`tools/list`, `prompts/list`, `resources/list`, `resources/templates/list`) is wrapped in a retry-with-backoff loop (`250/500/1000` ms, max 3) gated by a retryable-error classifier that **excludes** 4xx/protocol errors.
2. **OAuth discovery + token fetches** retry **once** after a transient network/timeout error (500 ms delay), via a fetch wrapper around the (now extracted) single-fetch body.
3. **HTTP 404 on connect** rewrites the error to `ENDPOINT_NOT_FOUND` and shows the **server URL** + "Check the URL in your MCP config." instead of a bare 404.

All three are net-new in 193 (`grep -c "ENDPOINT_NOT_FOUND"` = `0` in 183; the discovery retry loop, `mpp` backoff, and `gpp` classifier have no 183 counterpart in the list path; the OAuth retry wrapper is a new function around the old single-fetch body).

> **Drift fixed vs the scout dossier:** the classifiers drifted a few lines — live 193 has `gpp` (`isRetryableError`) at **`:292155`** (dossier said `:292162`), `ppp` (`isNetworkTransientError`) at **`:292140`** (dossier `:292145`), `fAa` (`isSessionExpiredError`) at **`:292133`** (dossier `:292135`); the `ENDPOINT_NOT_FOUND` rewrite is at **`:293997-293999`** (the message string is on `:293999`). Re-verified by reading the bodies.

---

## 1. Capability discovery retry-with-backoff — `listWithPaginationAndRetry` (`P1n`)

**What it does.** Performs a paginated MCP list request (`method` = `tools/list` etc.) and, on a *transient* failure, retries up to 3 times with `250/500/1000` ms backoff before re-throwing. Non-transient errors (4xx, protocol errors) throw immediately.

**How it works.**

```javascript
// ============================================
// listWithPaginationAndRetry - paginated list + retry-with-backoff (NEW retry loop)
// Location: cli_inner_pretty.js:292176-292204
// ============================================

// ORIGINAL (for source lookup):
async function P1n(e, t, n, r, o) {
  let s = !1;
  for (let i = 0; ; i++) {
    let a = [], l, c = 0, u = !1;
    try {
      do {
        let d = await e.request({ method: n, ...(l && { params: { cursor: l } }) }, r, { timeout: e8() });
        c++;
        let p = o(d);
        if (p) a.push(...p);
        if (((l = d.nextCursor), l && c >= nAa)) { u = !0; break; }
      } while (l);
      if (u) sn(t, `${n} still returning nextCursor after ${nAa} pages; stopping`);
      if (c > 1) rAa(n, c, a.length, u ? "capped" : "complete");
      return a;
    } catch (d) {
      if (c > 0 && !s) ((s = !0), rAa(n, c, a.length, "error"));
      let p = mpp[i];
      if (p === void 0 || !gpp(d)) throw d;
      (sn(t, `${n} failed (${Ae(d)}); retrying in ${p}ms`), await Nn(p));
    }
  }
}

// READABLE (for understanding):
async function listWithPaginationAndRetry(client, serverName, method, schema, mapItems) {
  let loggedError = false;
  for (let attempt = 0; ; attempt++) {                       // ← the NEW retry loop wraps the (carryover) pagination
    let items = [], cursor, pageCount = 0, capped = false;
    try {
      do {                                                   // pagination (existed in 183 as aOt)
        let page = await client.request({ method, ...(cursor && { params: { cursor } }) }, schema, { timeout: listTimeout() });
        pageCount++;
        let mapped = mapItems(page);
        if (mapped) items.push(...mapped);
        if (((cursor = page.nextCursor), cursor && pageCount >= MAX_PAGINATION_PAGES)) { capped = true; break; }
      } while (cursor);
      if (capped) sn(serverName, `${method} still returning nextCursor after ${MAX_PAGINATION_PAGES} pages; stopping`);
      if (pageCount > 1) logListPaginated(method, pageCount, items.length, capped ? "capped" : "complete");
      return items;
    } catch (err) {
      if (pageCount > 0 && !loggedError) { loggedError = true; logListPaginated(method, pageCount, items.length, "error"); }
      let backoffMs = RETRY_BACKOFFS[attempt];               // mpp = [250, 500, 1000]
      if (backoffMs === undefined || !isRetryableError(err)) throw err;  // exhausted (4th attempt) OR non-transient → give up
      sn(serverName, `${method} failed (${formatErr(err)}); retrying in ${backoffMs}ms`);
      await sleep(backoffMs);
    }
  }
}

// Mapping: P1n→listWithPaginationAndRetry, e→client, t→serverName, n→method, r→schema, o→mapItems,
//   mpp→RETRY_BACKOFFS, gpp→isRetryableError, rAa→logListPaginated, nAa→MAX_PAGINATION_PAGES, Nn→sleep, e8→listTimeout
```

**The four callers** (every capability list goes through it):
- `tools/list` (`:294050`), `resources/list` (`:294326`), `resources/templates/list` (`:294345`), `prompts/list` (`:294363`).

**The backoff schedule.** `RETRY_BACKOFFS` (`mpp`, `cli_inner_pretty.js:293455`) `= [250, 500, 1000]`. The loop reads `RETRY_BACKOFFS[attempt]`; `attempt 0/1/2` give `250/500/1000`, `attempt 3` gives `undefined` → throw. So it is at most **3 retries** then surface the error.

**Why an unbounded `for(;;)` with an array, not a counter.** Reading the bound off `RETRY_BACKOFFS[attempt]` and `throw`ing on `undefined` makes "how many retries" and "how long between them" the *same* single source of truth — to change the policy you edit one array, and there is no off-by-one risk between a max-count constant and a delay table. It is the same pattern the workflow/agent retry layers use in this build.

**The retryable-error gate — `isRetryableError` (`gpp`, `cli_inner_pretty.js:292155`):**

```javascript
// ============================================
// isRetryableError - only transient/5xx/network errors are retried
// Location: cli_inner_pretty.js:292155-292175
// ============================================

// ORIGINAL (for source lookup):
function gpp(e) {
  if (R2t(e)) return !1;
  if (e instanceof DOMException && e.name === "TimeoutError") return !1;
  if (e instanceof Error && !(e instanceof ai) && "code" in e && typeof e.code === "number" && e.code >= 400 && e.code < 500) return !1;
  if (e instanceof ai)
    return (e.code !== pi.RequestTimeout && e.code !== pi.MethodNotFound && e.code !== pi.InvalidRequest && e.code !== pi.InvalidParams);
  return !0;
}

// READABLE (for understanding):
function isRetryableError(err) {
  if (isAbortError(err)) return false;                       // R2t — a user/abort cancellation: never retry
  if (err instanceof DOMException && err.name === "TimeoutError") return false; // an AbortSignal.timeout fired — caller's budget, don't retry
  if (err instanceof Error && !(err instanceof McpError) && "code" in err && typeof err.code === "number"
      && err.code >= 400 && err.code < 500) return false;    // any HTTP 4xx → client error, retry won't help
  if (err instanceof McpError)                               // JSON-RPC protocol error: retry only if NOT a "your request is wrong" code
    return err.code !== RpcCode.RequestTimeout && err.code !== RpcCode.MethodNotFound
        && err.code !== RpcCode.InvalidRequest && err.code !== RpcCode.InvalidParams;
  return true;                                               // everything else (5xx, network, unknown) → transient, retry
}

// Mapping: gpp→isRetryableError, R2t→isAbortError, ai→McpError, pi→RpcCode
```

**Key insight — the classifier is a deny-list of "won't-help" errors, default-retry.** Rather than enumerate the (open-ended) set of transient failures, it enumerates the *small, closed* set of errors where a retry is provably useless — abort, caller-timeout, any 4xx, and the four "malformed request" JSON-RPC codes — and retries everything else. This is the safe default: a genuinely transient error never accidentally falls through to "throw", at the cost of occasionally retrying a permanent-but-mis-coded 5xx three times (cheap).

**Supporting predicates** (used elsewhere in the tool-call/connect paths, not the list retry directly):
- `isNetworkTransientError` (`ppp`, `cli_inner_pretty.js:292140`) — string-matches `ECONNRESET`/`ETIMEDOUT`/`EPIPE`/`EHOSTUNREACH`/`ECONNREFUSED`/`Body Timeout Error`/`terminated`/`SSE stream disconnected`/`Failed to reconnect SSE stream`, plus `AbortError`.
- `isSessionExpiredError` (`fAa`, `cli_inner_pretty.js:292133`) — a 404 (non-SSE-stream) or a 400 with `Server not initialized`/`No valid session ID`/`Mcp-Session-Id header is required` → session expired, reconnect.

**183 diff (BODY CHANGE / NET-NEW).** The 183 list path (`aOt`, 183 `:283328`) was a single `try { do…while } catch { throw }` — **no retry loop**. The pagination + `tengu_mcp_list_paginated` telemetry existed (193:1 / 183:1), but the `for(;;)` retry wrapper, `mpp` backoff, and `gpp` classifier are net-new. `gpp` has no 183 counterpart in the list path.

---

## 2. OAuth discovery + token retry-once — `createRetryingOAuthFetch` (`AOn`)

**What it does.** Wraps the OAuth HTTP fetch so that a single transient network/timeout failure is retried **once** after 500 ms, before propagating. Used as the `fetchFn` for both OAuth steps (initial authorize + code-exchange).

```javascript
// ============================================
// createRetryingOAuthFetch - retry the OAuth fetch ONCE on transient failure
// Location: cli_inner_pretty.js:281573-281582
// ============================================

// ORIGINAL (for source lookup):
function AOn() {
  return async (e, t) => {
    try { return await m_a(e, t); }
    catch (n) {
      if (t?.signal?.aborted || !zap(n)) throw n;
      return (await Nn(Vap, t?.signal ?? void 0), await m_a(e, t));
    }
  };
}

// READABLE (for understanding):
function createRetryingOAuthFetch() {
  return async (url, init) => {
    try { return await oauthFetchOnce(url, init); }          // the single-fetch body (was the whole impl in 183)
    catch (err) {
      if (init?.signal?.aborted || !isTransientFetchError(err)) throw err;  // aborted OR non-transient → propagate
      await sleep(OAUTH_RETRY_DELAY_MS, init?.signal ?? undefined);          // Vap = 500ms
      return await oauthFetchOnce(url, init);                                // retry exactly once
    }
  };
}

// Mapping: AOn→createRetryingOAuthFetch, m_a→oauthFetchOnce, zap→isTransientFetchError, Vap→OAUTH_RETRY_DELAY_MS (500), Nn→sleep
```

**The transient classifier — `isTransientFetchError` (`zap`, `cli_inner_pretty.js:281528`):** treats a network-error code in the `qap` set, plus `TimeoutError`, plus `mh(e)` (an abort/transient predicate) as transient.

**Why retry *once*, not the backoff loop.** OAuth fetches are interactive-latency-sensitive (a human is waiting at a browser/redirect) and idempotent for the discovery/exchange steps. A single 500 ms retry papers over the common one-off DNS/connection blip without adding multi-second latency to a flow a person is watching. The capability-discovery path (section 1) tolerates a longer backoff because it runs at startup/connect, not under a human's gaze.

**183 diff (NET-NEW retry).** In 183 the OAuth flow used `qxn()` (183 `:273095`) which did a **single** fetch — its body is byte-equivalent to 193's `oauthFetchOnce` (`m_a`). 193 *extracts* that single-fetch body into `m_a` and *wraps* it in the new `createRetryingOAuthFetch` (`AOn`). So the retry-once is a genuine new wrapper around the old body, not a rename. The non-retrying default fetch is `defaultOAuthFetch` (`u_a`, `cli_inner_pretty.js:281323`), used for plain discovery probes. Note: a **separate, older** token-*refresh* retry (`Token refresh failed, retrying in ${u}ms (attempt o/3)`, exponential `1000*2^(o-1)`) is **CARRYOVER** (193:1 / 183:1) — do not double-count it here.

**Headless → paste-URL half = carryover plumbing.** The `skipBrowserOpen` flag that the interactive OAuth flow consumes is older (`skipBrowserOpen` 193:14 / 183:13). The genuinely-new "paste the redirect URL" prompts (193:3 / 183:0) all live in the **CLI** `mcpLoginHandler` — see [`mcp_login_logout_cli.md`](./mcp_login_logout_cli.md) §4, not the interactive `/mcp` path.

---

## 3. HTTP 404 on connect → `ENDPOINT_NOT_FOUND` with the URL

**What it does.** When an `http` transport gets a 404 on its *initial* connect (no session yet, URL not allow-listed), the connect-failure handler rewrites the error code to `ENDPOINT_NOT_FOUND` and replaces the message with one that shows the server URL and points at the MCP config.

```javascript
// ============================================
// connect-failure 404 rewrite - show URL + "Check the URL in your MCP config."
// Location: cli_inner_pretty.js:293997-293999
// ============================================

// ORIGINAL (for source lookup):
if (t.type === "http" && p === "404" && i?.sessionId === void 0 && !Yvn(t.url))
  ((p = "ENDPOINT_NOT_FOUND"),
    (c = `MCP endpoint not found at ${HIe(t) ?? "(unparseable url)"}. Check the URL in your MCP config.`));

// READABLE (for understanding):
if (config.type === "http" && errorCode === "404" && initState?.sessionId === undefined && !isAllowlistedMcpUrl(config.url)) {
  errorCode = "ENDPOINT_NOT_FOUND";                          // distinct code so telemetry/handlers can branch
  errorMessage = `MCP endpoint not found at ${formatServerUrl(config) ?? "(unparseable url)"}. Check the URL in your MCP config.`;
}

// Mapping: t→config, p→errorCode, c→errorMessage, i→initState, Yvn→isAllowlistedMcpUrl, HIe→formatServerUrl
```

**How it works.** Four conditions must all hold: `http` transport, raw `404`, **no session id yet** (so it's a connect, not a mid-session expiry — that case is handled by `isSessionExpiredError`), and the URL is **not** allow-listed (`isAllowlistedMcpUrl`, `Yvn`, `:145961` — known Anthropic-hosted URLs where a 404 means something else). Only then is the message rewritten via `formatServerUrl` (`HIe`, `:145991`).

**Why surface the URL.** A bare "404" on connect is almost always a typo'd URL in `.mcp.json` (wrong path, trailing slash, http vs https). The previous bare-404 surfacing gave the user nothing to act on; showing the exact URL the client tried plus "Check the URL in your MCP config" turns a dead-end into a one-glance fix. The distinct `ENDPOINT_NOT_FOUND` code (also referenced at `:511853`) lets downstream handlers/telemetry distinguish "wrong URL" from generic connect failures.

**183 diff (NET-NEW).** `MCP endpoint not found at` = 0 in 183; `ENDPOINT_NOT_FOUND` = 0 in 183 (193:2). Previously a bare 404 surfaced without the URL/config hint.

---

## Evidence — NET-NEW / BODY-CHANGE (183 grep-diff)

| Path | 193 | 183 | verdict |
|---|---|---|---|
| discovery retry loop (`mpp` `[250,500,1000]`, `gpp`) | present (`:292155`,`:293455`) | absent (`aOt` single-try, 183 `:283328`) | BODY-CHANGE / NET-NEW |
| OAuth retry-once wrapper `AOn` around `m_a` | present (`:281573`) | `qxn` single fetch (183 `:273095`) | NET-NEW (retry) |
| `ENDPOINT_NOT_FOUND` / `MCP endpoint not found at` | 2 / 1 | 0 / 0 | NET-NEW |
| token-refresh retry `Token refresh failed, retrying in` | 1 | 1 | CARRYOVER (don't count) |
| `skipBrowserOpen` plumbing | 14 | 13 | CARRYOVER (+1 = the new CLI login path) |

---

## Cross-links

- Sibling 193 docs: [`mcp_login_logout_cli.md`](./mcp_login_logout_cli.md) (the OAuth flow `oX` that consumes `createRetryingOAuthFetch`; the headless paste-URL prompts), [`headers_helper_reauth.md`](./headers_helper_reauth.md) (tool-call 401/403 re-auth — a different reliability layer at call time), [`tool_call_idle_timeout.md`](./tool_call_idle_timeout.md), [`README.md`](./README.md).

## Related Symbols

> Symbol mappings live in the central index files (this doc uses **list format**, never a mapping table):
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (**MCP** home module)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations
> - [../00_overview/symbol_additions_v2_1_193_mcp.md](../00_overview/symbol_additions_v2_1_193_mcp.md) — the granular v2.1.193 MCP additions

Key functions/constants in this document:

- `listWithPaginationAndRetry` (`P1n`, `cli_inner_pretty.js:292176`) — paginated list + retry-with-backoff; 183 predecessor `aOt` (no retry).
- `RETRY_BACKOFFS` (`mpp`, `cli_inner_pretty.js:293455`) — `[250, 500, 1000]`.
- `isRetryableError` (`gpp`, `cli_inner_pretty.js:292155`) — deny-list classifier (no 4xx / protocol errors).
- `isNetworkTransientError` (`ppp`, `cli_inner_pretty.js:292140`) / `isSessionExpiredError` (`fAa`, `cli_inner_pretty.js:292133`) — supporting predicates.
- `logListPaginated` (`rAa`, `cli_inner_pretty.js:292205`) — `tengu_mcp_list_paginated` telemetry (carryover).
- `createRetryingOAuthFetch` (`AOn`, `cli_inner_pretty.js:281573`) — OAuth fetch retry-once; wraps `oauthFetchOnce` (`m_a`, `:281583`).
- `isTransientFetchError` (`zap`, `cli_inner_pretty.js:281528`) / `OAUTH_RETRY_DELAY_MS` (`Vap`=`500`, `:283043`) / `defaultOAuthFetch` (`u_a`, `:281323`).
- 404 rewrite: `ENDPOINT_NOT_FOUND` (`cli_inner_pretty.js:293997-293999`); `formatServerUrl` (`HIe`, `:145991`); `isAllowlistedMcpUrl` (`Yvn`, `:145961`).
