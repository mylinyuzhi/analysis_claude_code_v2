# Scout Dossier — MCP (login/logout CLI, retry/backoff, OAuth, idle timeout)

**Window:** v2.1.183 → v2.1.193 (build a1938d2a, 2026-06-25)
**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines)
**Before-bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines)
**Method:** every claim cites `cli_inner_pretty.js:<line>` in the 193 bundle; obf token + 1-line readable gloss; grep-counted in 183 to classify net-new / body-change / carryover. Obf names are re-mangled per build — every symbol re-derived by line in 193.

> NOTE on the task SEED line anchors: the SEED `logout @226410` pointed at shell-parser noise (zsh `logout` builtin set) in 193 and is wrong (183-tree anchor that re-mangled). The SEEDs `env @43147`, `use @292215`, `message @293069`, `hpp default` were all correct for the idle-timeout bullet.

---

## Verdict table (bullet → 193 anchor → obf symbol → readable → 183 diff → confidence)

| # | Bullet (changelog ver) | 193 anchor(s) | Obf symbol | Readable gloss | 183 diff | Class | Conf |
|---|---|---|---|---|---|---|---|
| 1 | `claude mcp login <name>` / `logout <name>` + `--no-browser` (NEW 2.1.186) | 613584-613604 (cmd); 613318 `L9f`; 613467 `D9f`; 613312 `rnc` | `L9f`,`D9f`,`rnc`,`g3o`/`h3o` | `mcpLoginHandler`,`mcpLogoutHandler`,`formatAuthUrlMessage`, login/logout module | 183: 0 (`mcpLoginHandler`, `Authenticate with an MCP server (HTTP, SSE…)`, `Clear stored OAuth credentials…` all = 0) | NET-NEW capability | high |
| 2 | Startup notice when MCP servers need auth → `/mcp` (2.1.193) | 504176 `Jkl`; 504306 `t0l`; 292618 `uWe`; 292230 `oAa` | `Jkl`,`t0l`,`Xkl`,`oAa`,`uWe` | `McpServerIssuesNotice`,`buildStartupWarnings`,`describeIssue`,`isCachedNeedsAuth`,`connectAllMcpServers` | **carryover**: notice strings + needs-auth cache byte-identical in 183 | REFINEMENT (carryover infra) | low |
| 3 | `headersHelper` auth re-runs + reconnects on tool-call 401/403 (2.1.193) | 293133-293151 | `bao` catch; `C`=hasHeadersHelper; `x`=isAuthErr; `nT`/`ID`/`pao` | `callToolWithWatchdog` re-auth branch; `disconnectAndClearCache`/`connectOrGetClient`/`inFlightReauthReconnects` | 183: 0 (`re-running headersHelper and retrying once`, `reauth_retry` = 0) | NET-NEW capability | high |
| 4 | Capability discovery retries transient errors w/ backoff (2.1.191) | 292176 `P1n`; 293455 `mpp`; 292162 `gpp` | `P1n`,`mpp`,`gpp` | `listWithPaginationAndRetry`,`RETRY_BACKOFFS=[250,500,1000]`,`isRetryableError` | 183 `aOt` (272-line earlier form) had NO retry loop — body change | BODY CHANGE / NET-NEW | high |
| 5 | OAuth discovery + token requests retry once after transient; headless → paste-URL (2.1.191) | 281573 `AOn`; 281583 `m_a`; 281528 `zap`; 283043 `Vap`; used 282082/282177 | `AOn`,`m_a`,`zap`,`Vap` | `createRetryingOAuthFetch`,`oauthFetchOnce`,`isTransientFetchError`,`RETRY_DELAY_MS=500` | 183 `qxn` did single fetch (no retry); 193 wraps old body in new retry-once `AOn` | NET-NEW (retry) / refinement (headless plumbing carryover) | high (retry) / low (headless) |
| 6 | HTTP 404 errors show URL + point to MCP config (2.1.191) | 293997-293998 | `"ENDPOINT_NOT_FOUND"`; `HIe` | `formatServerUrl`; net-new 404 message | 183: 0 (`MCP endpoint not found at`, `ENDPOINT_NOT_FOUND`) | NET-NEW message | high |
| 7 | Remote MCP tool-call IDLE TIMEOUT; `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` (NEW 2.1.187) | 43164/43611 env; 292228 `_pp`; 293311 `hpp`; 293069 msg | `Jpu`,`_pp`,`hpp`,`ypp` | env `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT`,`resolveIdleTimeoutMs`,`DEFAULT_IDLE_TIMEOUT_MS=300000`,`IDLE_TIMEOUT_TRANSPORTS` | 183: 0 (env + all idle messages = 0). Watchdog scaffold (`armedAt`/transport-drop) is older carryover | NET-NEW capability | high |
| 8 | Misleading "MCP server disconnected" for retired tools on resume (2.1.186) | 228300 `HBt`; 471050 (`oko` skip); 389642 (classifier) | `HBt`,`oko` | `RETIRED_TOOL_NAMES`,`computeDeferredToolsDelta` | 183 `Qgo` lacked the `HBt.has(v) continue` skip; `HBt` set = 0 in 183 | FIX (net-new guard) | high |
| 9 | `mcp get`/`remove` suggest closest name on typo + truncate (2.1.186) | 610416 `t3o`; 610430 `psr`; callers 613575/613551 | `t3o`,`psr`,`fde`,`f9f`,`a9f` | `suggestClosestServerName`,`formatNotFoundWithPending`,`fuzzyClosestMatch`,`mcpGetHandler`,`mcpRemoveHandler` | 183: 0 (`No MCP server named` = 0) | NET-NEW | high |

---

## Bullet 1 — `claude mcp login/logout` CLI + `--no-browser` (NEW 2.1.186)

**Anchors.** Command wiring at `cli_inner_pretty.js:613584-613604`:
- `.command("login <name>")` `.description("Authenticate with an MCP server (HTTP, SSE, or claude.ai connector)")` with `.option("--no-browser", "Print the authorization URL instead of opening a browser (for SSH/headless sessions — paste the redirect URL back when prompted)")` → handler `mcpLoginHandler` (`L9f`), 613318.
- `.command("logout <name>")` `.description("Clear stored OAuth credentials for an MCP server")` → handler `mcpLogoutHandler` (`D9f`), 613467.
- Module: `g3o` exports `{ mcpLogoutHandler: ()=>D9f, mcpLoginHandler: ()=>L9f }` (613277), lazy-init `h3o` (613503).

**`mcpLoginHandler` (`L9f`, 613318)** dispatches on transport kind (`Z9(e,n)`):
- `claudeai-proxy`: builds claude.ai authorize link (`pRe`), opens browser unless `--no-browser`, prints `rnc(t.browser, url)` message.
- `unsupported-transport` / `anthropic-hosted` / oauth sub-cases (`static_auth_header`, `first_party_auth`, `first_party_design_auth`) each emit a tailored message.
- generic `oauth`: runs `oX(...)` flow with `skipBrowserOpen: !t.browser`; the `--no-browser` / non-TTY path opens a `readline` interface prompting `"Or paste the redirect URL here: "` (613377). If stdin isn't a TTY it aborts with: *"stdin isn't a terminal … Re-run in an interactive terminal — e.g. `ssh -t` — and paste the redirect URL when prompted."* (613437).
- success: `Authenticated with "X". Its tools are now available in Claude Code.` (or "…but it's currently disabled. Enable it in /mcp…").

**`rnc` (613312)** = the no-browser message helper: returns `If the browser didn't open, visit:` vs `Visit this URL to authorize:` depending on the browser flag.

**`mcpLogoutHandler` (`D9f`, 613467)**: clears stored OAuth creds (`dbe`), special-cases claude.ai connectors ("its credentials live on claude.ai, not this machine"), prints `Signed out of "X". Run \`mcp login X\` to authenticate again.`

**183 diff.** Net-new. In 183: `mcpLoginHandler`=0, command descriptions=0. The only `--no-browser` in 183 is inside the unrelated `ant` CLI long-string doc (654434) — not an MCP command. The `mcp` parent command (613525) gained `login`/`logout` between the existing `serve/remove/list/get/add-json/add-from-claude-desktop/reset-project-choices` subcommands.

**Confidence:** high. Net-new CLI surface, full handler bodies present.

---

## Bullet 2 — Startup notice when MCP servers need authentication (2.1.193) — MOSTLY CARRYOVER

**Honest finding: the user-visible pieces are CARRYOVER, not a 193 string delta.**

The notice strings and needs-auth caching are byte-identical in 183:
- `McpServerIssuesNotice` (`Jkl`, 504176) renders `${n} MCP ${server(s)} not connected — run /mcp to authenticate, retry, or see details:` (504183) — present identically at 183:493517.
- `buildStartupWarnings` (`t0l`, 504306) emits `- MCP server 'X': … Run /mcp to authenticate, retry, or inspect the server.` (504324) — identical at 183:493676.
- `describeIssue` (`Xkl`, 504166) maps `type==="needs-auth"` → `"needs authentication"` — identical at 183.
- needs-auth cache `mcp-needs-auth-cache.json` (`oAa`/`gao`, 292220-292230) and `isCachedNeedsAuth` skip-at-connect (`uWe`, 292618: `"Skipping connection (cached needs-auth)"`) — all 193:1 / 183:1.
- telemetry `tengu_mcp_server_needs_auth`, `discoveryAuthFailure`, `tengu_mcp_tool_call_auth_error` — all 193 == 183.

**What is actually new in 193 that surfaces auth-needed** is bullet 3 (the `headersHelper` 401/403 path, which marks servers `needs-auth` so the existing notice fires after a live 401/403). I could not isolate a net-new *startup-notice string or component* for this bullet. Treat the changelog line as a UX-level re-announcement riding on carryover infrastructure (the `Jkl`/`t0l` notice + needs-auth cache existed in 183).

**Confidence:** low for net-new-ness; high that the visible notice machinery is carryover.

---

## Bullet 3 — `headersHelper` re-auth + reconnect on tool-call 401/403 (2.1.193) — NET-NEW

**Anchor.** Inside the tool-call wrapper `callToolWithWatchdog` (`bao`) catch block, `cli_inner_pretty.js:293131-293172`:

```
let v = _ instanceof ai ? void 0 : "code" in _ ? _.code : void 0,
    C = (n.type === "http" || n.type === "sse" || n.type === "ws") && !!n.headersHelper,   // hasHeadersHelper
    x = v === 401 || _ instanceof vR || (v === 403 && C);                                    // isAuthError
if (C && !g) {                                                                                // g = already-an-auth-retry
  let R = aWe(t, n), P = pao.get(R), O = P !== void 0 && _ instanceof ai && _.code === pi.ConnectionClosed;
  if (x || O) {
    sn(t, `Tool '${o}' returned ${v ?? 401}; re-running headersHelper and retrying once`);
    Ct("mcp_headers_helper", "reauth_retry");
    if (!P) { P = (async () => (await nT(t, n), ID(t, n)))(); pao.set(R, P); ... }            // disconnect + reconnect
    let D = await P;
    if (D.type === "connected")
      return bao({ ... , isAuthRetry: !0 });                                                  // re-run the tool once
    sn(t, `headersHelper reconnect returned '${D.type}'; falling through to needs-auth`);
  }
}
```

**How it works.**
1. `headersHelper` is a literal config field on http/sse/ws transports that produces dynamic auth headers (the SDK re-invokes it per request). On a tool-call 401 (or 403 when a headersHelper exists), `x` is set.
2. Guard `C && !g`: only attempt when a headersHelper exists and we're not already in a re-auth retry (prevents infinite loop).
3. `nT(t,n)` disconnects + clears the connection cache; `ID(t,n)` reconnects (which re-runs `headersHelper`, picking up rotated creds). The in-flight reconnect is deduped per server via the `pao` map keyed by `aWe(t,n)` so concurrent tool calls share one reconnect.
4. On reconnect success, the tool is re-called once with `isAuthRetry: true`.
5. If still unauthorized, falls through to `tengu_mcp_tool_call_auth_error` + `MCP server "X" requires re-authorization (token expired)` (293168-293178) and marks the server needs-auth.

**183 diff.** Net-new. `re-running headersHelper and retrying once` and the `mcp_headers_helper`/`reauth_retry` telemetry pair = **0 in 183**. The `headersHelper` field itself is older (183:18 occurrences) but the 401/403 *re-run + reconnect* branch is new (193:21 field uses; +1 telemetry). The legacy `Tool call returned 401 Unauthorized - token may have expired` line is carryover (193:1/183:1) — the new code sits *before* it.

**Confidence:** high.

---

## Bullet 4 — Capability discovery retries transient errors with backoff (2.1.191) — NET-NEW BODY CHANGE

**Anchor.** `listWithPaginationAndRetry` (`P1n`, `cli_inner_pretty.js:292176`), called for every capability list:
- 294050 `P1n(e.client, e.name, "tools/list", ECt, p=>p.tools)`
- 294326 `"resources/list"`, 294345 `"resources/templates/list"`, 294363 `"prompts/list"`

```
async function P1n(e, t, n, r, o) {            // client, serverName, method, schema, mapper
  let s = !1;
  for (let i = 0; ; i++) {                       // <-- RETRY LOOP (new)
    ... do { request({method:n, cursor}) ... } while (cursor) ...  // pagination (was 183 aOt)
    return a;
    } catch (d) {
      ...
      let p = mpp[i];                             // mpp = [250, 500, 1000]  (RETRY_BACKOFFS)
      if (p === void 0 || !gpp(d)) throw d;       // exhausted or non-retryable -> throw
      sn(t, `${n} failed (${Ae(d)}); retrying in ${p}ms`); await Nn(p);
    }
  }
}
```

- `RETRY_BACKOFFS` `mpp = [250, 500, 1000]` (293455): up to 3 retries (250/500/1000 ms), then throw.
- `isRetryableError` `gpp` (292162): returns **false** for 4xx (`code>=400 && code<500`), `RequestTimeout`, `MethodNotFound`, `InvalidRequest`, `InvalidParams`; otherwise true → only transient/5xx/network errors are retried.
- Related helpers: `ppp` (292145) network-transient string check (ECONNRESET/ETIMEDOUT/EPIPE/…); `fAa` (292135) session-expired (404/400) reconnect check; `rAa` (292208) telemetry `tengu_mcp_list_paginated`.

**183 diff.** Body change. The 183 equivalent `aOt` (283328) had **no retry loop** — a single `try { do…while } catch { throw }`. The pagination + `tengu_mcp_list_paginated` telemetry existed (193:1/183:1), but the `for(;;)` retry wrapper + `mpp` backoff + `gpp` classifier are net-new. `gpp` has no 183 counterpart in the list path.

**Confidence:** high.

---

## Bullet 5 — OAuth discovery + token retry once; headless → paste-URL (2.1.191)

**Retry-once — NET-NEW.** Anchor `createRetryingOAuthFetch` (`AOn`, `cli_inner_pretty.js:281573`):

```
function AOn() {
  return async (e, t) => {
    try { return await m_a(e, t); }              // m_a = single fetch w/ timeout (old body)
    catch (n) {
      if (t?.signal?.aborted || !zap(n)) throw n; // zap = isTransientFetchError
      return (await Nn(Vap, ...), await m_a(e, t)); // Vap = 500ms, retry ONCE
    }
  };
}
```

`AOn()` is passed as `fetchFn` for both OAuth steps: initial auth (`hY` @282082) and code-exchange (`hY` @282177). `_On` (`u_a`, 281323) is the non-retrying default used for plain discovery probes. `zap` (281528) treats timeouts + a network-error code set (`qap`) as transient; `Vap = 500` (283043).

**183 diff (retry).** Net-new. In 183 the OAuth flow used `qxn()` (273095) which did a **single** fetch (its body == 193's `m_a`). 193 refactored the single-fetch body out to `m_a` and wrapped it in the new `AOn` that retries once on transient. The non-retry default was `Fxn`/`EQi` in 183 (= `_On`/`u_a` in 193). So the retry-once is a genuine new wrapper, not a rename.

Token-*refresh* retry (`Token refresh failed, retrying in ${u}ms (attempt o/3)`, 282957, exponential `1000*2^(o-1)`) is **carryover** (193:1/183:1) — a separate, older mechanism; do not double-count it under this bullet.

**Headless → paste-URL — REFINEMENT (carryover plumbing).** The `skipBrowserOpen` flag (`oX` @282012 `new NGe(...,o?.skipBrowserOpen)`; headless branch `if (h) G(); else <local callback server>` @282093) is carryover: `skipBrowserOpen` 193:14 / 183:13 (the +1 is the new CLI `mcp login` path). The genuinely-new "paste the redirect URL" prompts (193:3 / 183:0) are all in the new CLI `mcpLoginHandler` (613377/613422/613437), i.e. bullet 1 — not the interactive flow. I could not isolate a net-new auto-headless decision in the interactive `/mcp` path.

**Confidence:** high (retry-once); low (headless skip is carryover plumbing).

---

## Bullet 6 — HTTP 404 errors show URL + point to MCP config (2.1.191) — NET-NEW

**Anchor.** Connect-failure handler, `cli_inner_pretty.js:293997-293998`:

```
if (t.type === "http" && p === "404" && i?.sessionId === void 0 && !Yvn(t.url))
  ((p = "ENDPOINT_NOT_FOUND"),
   (c = `MCP endpoint not found at ${HIe(t) ?? "(unparseable url)"}. Check the URL in your MCP config.`));
```

When an http transport gets a 404 on initial connect (no session yet, not an allow-listed url via `Yvn`), the error code is rewritten to `ENDPOINT_NOT_FOUND` and the message shows the server URL (`HIe(t)` = formatServerUrl) plus "Check the URL in your MCP config."

**183 diff.** Net-new. `MCP endpoint not found at` = 0 in 183; `ENDPOINT_NOT_FOUND` = 0 in 183 (193:2). Previously a bare 404 surfaced without the URL/config hint.

**Confidence:** high.

---

## Bullet 7 — Remote MCP tool-call IDLE TIMEOUT + `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` (NEW 2.1.187) — NET-NEW

**Env var.** `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` exported at 43164 (`()=>Jpu`), defined `Jpu = Fe.int()` (43611) — int-typed env getter on the env proxy `Be`.

**Resolver.** `resolveIdleTimeoutMs` (`_pp`, `cli_inner_pretty.js:292228`):

```
function _pp(e) {
  if (!ypp.has(e?.type ?? "")) return 0;          // ypp = Set(["http","sse","ws","claudeai-proxy"]) -> remote only
  let t = Be.CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT ?? hpp;   // hpp = 300000 (5 min default)
  if (t <= 0) return 0;                            // 0 disables idle timeout
  return Math.min(Math.max(t, 1000), gAa(e));      // clamp [1s, overall tool timeout]
}
```

- `hpp = 300000` (293311) → **default idle timeout = 5 minutes (300000 ms)**.
- `ypp` (293456) = `Set(["http","sse","ws","claudeai-proxy"])` → only **remote** transports get idle timeout; stdio does not.
- `gAa` (292192) = resolveToolTimeoutMs (`MCP_TOOL_TIMEOUT` env / `fpp=1e8` default, clamp [1000, `mAa=2147483647`]). Idle timeout is capped by the overall tool timeout.

**Abort behaviour.** In the watchdog `setInterval` (293044-293085) the idle branch fires when `Date.now() - S > _` (no response/progress since last activity `S`):
```
Tool 'X' aborting: no response or progress notification for ${F}s (idle timeout ${_/1000}s)
... new Fi(`MCP server "T" tool "o" sent no response or progress for ${F}s; aborting.
          Set CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT (ms) higher or to 0 if this tool is expected to run silently for longer.`, "MCP tool idle timeout")
```
Progress notifications reset `S` (`onprogress: U => { b.armedAt = 0; S = Date.now(); … }`, 293072), so a server that streams progress never trips the idle timeout.

**183 diff.** Net-new. `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT`=0 in 183; idle messages (`sent no response or progress for`, `MCP tool idle timeout`, `Set CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT (ms) higher`) all = 0 in 183. The surrounding *watchdog scaffold* is older carryover — `activeCallWatchdogs` 193:5/183:5, `transport dropped mid-call` 193:1/183:1 (transport-drop abort predates 187) — but the **idle-timeout layer** (`_pp`/`hpp`/`ypp`/env) is the 187 addition. `armedAt` 193:7/183:5 (2 net-new uses tied to the idle reset).

**Upgrade gotcha.** Behaviour change on upgrade: remote MCP tool calls that previously *hung indefinitely* (well, blocked up to the 1e8-ms tool timeout) now **abort after 5 min of silence by default**. A legitimately-silent long-running remote tool will start failing unless the user sets `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT=0` (disable) or a higher ms value. Stdio servers are unaffected.

**Confidence:** high.

---

## Bullet 8 — Misleading "MCP server disconnected" for retired tools on resume (2.1.186) — FIX, NET-NEW GUARD

**Anchor.** Retired-tools set + skip in the deferred-tools delta producer.
- `RETIRED_TOOL_NAMES` `HBt = new Set(["Frame", "FrameRead", "TeamCreate", "TeamDelete", "SuggestBackgroundPR"])` (228300).
- `computeDeferredToolsDelta` (`oko`, `cli_inner_pretty.js:471037`), the announced-set rebuild (471048-471053):

```
for (let v of S.attachment.addedNames) {
  if (HBt.has(v)) continue;                 // <-- NEW: never count retired tools as "announced"
  if ((o.add(v), !H.has(v))) s.add(v);
}
...
for (let S of o) { if (d.has(S)) continue; if (!p.has(S)) h.push(S); }   // h = removedNames -> "MCP server disconnected"
```

- Second use: tool-not-found classifier (389642) treats `HBt.has(n.name)` as `"expected-absent"` instead of `"unknown"`.

**Why this fixes it.** When resuming an older session, prior `deferred_tools_delta` attachments may list now-retired built-ins (Frame/Team*/SuggestBackgroundPR) in their `addedNames`. Without the skip, those names enter the "previously announced" set `o`, then — being absent from the current tool pool `p` — get pushed into `removedNames` (`h`), which renders as *"The following deferred tools are no longer available (their MCP server disconnected)…"* (601625). The `HBt.has(v) continue` keeps retired tools out of `o`, so they never appear as removed → no misleading disconnect notice.

**183 diff.** Net-new. The 183 producer `Qgo` (462347) had `for (let T of b.attachment.addedNames) if ((o.add(T), !S.has(T))) s.add(T);` — **no skip**. `HBt`'s value (`SuggestBackgroundPR`, `TeamCreate","TeamDelete`) = **0 in 183**. The "disconnected" render strings themselves are byte-identical (carryover) — the fix is purely the new guard, not a wording change.

**Confidence:** high.

---

## Bullet 9 — `mcp get`/`remove` suggest closest name + truncate (2.1.186) — NET-NEW

**Anchor.** `suggestClosestServerName` (`t3o`, `cli_inner_pretty.js:610416`):

```
function t3o(e, t) {                                  // name, configuredNames
  let n = [...t].sort(),
      r = fde(e, n.map(a=>({name:a})), { maxEditDistance: 2 });   // fuzzy closest match
  if (r) return `No MCP server named "${e}". Did you mean "${r}"? Run \`claude mcp list\` to see all.`;
  if (n.length === 0) return `No MCP server named "${e}". Run \`claude mcp add\` to add one.`;
  let o = 8, s = n.slice(0, o).join(", "),
      i = n.length > o ? ` (and ${n.length - o} more — run \`claude mcp list\` to see all)` : "";
  return `No MCP server named "${e}". Configured servers: ${s}${i}`;
}
```

- `fde` = fuzzyClosestMatch (Levenshtein, `maxEditDistance: 2`).
- Truncation: lists at most **8** server names, then "(and N more — run `claude mcp list` to see all)".
- `psr` (610430) wraps `t3o` with a pending-`.mcp.json`-approval note.
- Used by `mcpGetHandler` (`f9f`, 613315→ `psr(t, f, r.size>0)`) and `mcpRemoveHandler` (`a9f`, 613469→ `t3o(t, es(p))`).

**183 diff.** Net-new. `No MCP server named` = 0 in 183 (193:7). `Did you mean "` is generic and present elsewhere (193:3/183:2) but the MCP-specific helper `t3o`/`psr` and the truncate-at-8 logic are new for get/remove.

**Confidence:** high.

---

## Symbol glossary (193 obf → readable)

CLI login/logout (module `g3o`/`h3o`):
- `L9f` → `mcpLoginHandler` (613318)
- `D9f` → `mcpLogoutHandler` (613467)
- `rnc` → `formatAuthUrlMessage` (613312)

Idle timeout:
- `Jpu` → env `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` (43611, `Fe.int()`)
- `_pp` → `resolveIdleTimeoutMs` (292228)
- `hpp` → `DEFAULT_MCP_TOOL_IDLE_TIMEOUT_MS = 300000` (293311)
- `gAa` → `resolveToolTimeoutMs` (292192); `fpp`=`DEFAULT_TOOL_TIMEOUT=1e8` (293307); `mAa`=`MAX_TIMEOUT=2147483647` (293308)
- `ypp` → `IDLE_TIMEOUT_TRANSPORTS = {"http","sse","ws","claudeai-proxy"}` (293456)
- `bao` → `callToolWithWatchdog` (the tool-call wrapper; idle watchdog @293044, catch @293125)

headersHelper 401/403:
- `Ct("mcp_headers_helper","reauth_retry")` telemetry (293143)
- `nT` → `disconnectAndClearCache`; `ID` → `connectOrGetClient`; `pao` → `inFlightReauthReconnects` map; `aWe` → `serverCacheKey`

Capability-discovery retry:
- `P1n` → `listWithPaginationAndRetry` (292176; was `aOt` in 183)
- `mpp` → `RETRY_BACKOFFS = [250,500,1000]` (293455)
- `gpp` → `isRetryableError` (292162); `ppp` → `isNetworkTransientError` (292145); `fAa` → `isSessionExpiredError` (292135)
- `rAa` → telemetry `tengu_mcp_list_paginated` (292208)

OAuth retry-once:
- `AOn` → `createRetryingOAuthFetch` (281573; 183 had `qxn` single-fetch)
- `m_a` → `oauthFetchOnce` (281583); `_On`/`u_a` → non-retry default fetch (281501/281323)
- `zap` → `isTransientFetchError` (281528); `Vap` → `OAUTH_RETRY_DELAY_MS=500` (283043)

404 / not-found:
- `ENDPOINT_NOT_FOUND` code + message (293997); `HIe` → `formatServerUrl`; `Yvn` → url allow-list check

Retired-tools fix:
- `HBt` → `RETIRED_TOOL_NAMES` (228300)
- `oko` → `computeDeferredToolsDelta` (471037; was `Qgo` in 183)
- `IJ`/`eX` → `extractDiscoveredToolsFromHistory`

get/remove suggestions:
- `t3o` → `suggestClosestServerName` (610416); `psr` → `formatNotFoundWithPending` (610430); `fde` → `fuzzyClosestMatch`
- `f9f` → `mcpGetHandler` (613315); `a9f` → `mcpRemoveHandler` (613469)

Startup notice (carryover):
- `Jkl` → `McpServerIssuesNotice` (504176); `t0l` → `buildStartupWarnings` (504306); `Xkl` → `describeMcpIssue` (504166)
- `oAa` → `isCachedNeedsAuth` (292230); `gao` → `readNeedsAuthCache` (292213); `uWe` → `connectAllMcpServers` (292618); `D1n` → `markClientNeedsAuth` (292123)

---

## Proposed module docs (new dir `39_mcp/`)

1. `39_mcp/mcp_login_logout_cli.md` — `claude mcp login/logout <name>`, `--no-browser`, transport-kind dispatch, SSH/headless paste-URL flow (`L9f`/`D9f`/`rnc`). [rich]
2. `39_mcp/tool_call_idle_timeout.md` — idle watchdog, `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT`, `_pp`/`hpp=300000`/`ypp`, progress-resets-idle, vs the older transport-drop watchdog; upgrade gotcha. [rich]
3. `39_mcp/reliability_retries.md` — capability-discovery retry (`P1n`+`mpp`+`gpp`), OAuth retry-once (`AOn`/`zap`/`Vap`), token-refresh retry (carryover), 404 `ENDPOINT_NOT_FOUND` message. [rich]
4. `39_mcp/headers_helper_reauth.md` — `headersHelper` re-run + reconnect on 401/403, `pao` dedup, needs-auth fall-through, relation to startup notice. [moderate]
5. `39_mcp/server_name_suggestions.md` — `t3o`/`psr`/`fde` fuzzy suggest + truncate for get/remove. [moderate]
6. Fold the retired-tools fix (`HBt`/`oko`) into the existing deferred-tools / dynamic-tool-loading doc (it's a cross-cutting tool-pool concern, not MCP-only). [moderate]

Symbol-index additions go to `00_overview/symbol_index_infra_platform.md` (MCP module section).

## Depth assessment
**Rich.** 7 of 9 bullets are genuine net-new source-level deltas with full bodies (login/logout CLI, idle timeout, headersHelper re-auth, discovery retry, OAuth retry-once, 404 message, retired-tools guard, name suggestions). Two are carryover/refinement and are flagged honestly: the **startup notice** (bullet 2) is carryover strings + needs-auth cache (no net-new anchor), and the **OAuth headless-skip** half of bullet 5 is carryover `skipBrowserOpen` plumbing. Real algorithmic depth: the retry classifiers (`gpp`/`zap`), the idle-vs-transport-drop watchdog state machine, and the announced-set diff (`oko`) with the `HBt` guard.
