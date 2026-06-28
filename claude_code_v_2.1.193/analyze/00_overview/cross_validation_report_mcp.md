# Cross-Validation Report — Module 39_mcp (v2.1.193 delta)

- **Theme:** mcp (MCP login/logout CLI, headersHelper 401/403 reauth, capability-discovery/OAuth retry+backoff, get/remove name-suggestions + truncation, remote tool-call idle timeout, startup needs-auth notice) — v2.1.183 → v2.1.193
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.193/analyze/39_mcp/`
- **Docs audited:** `README.md`, `tool_call_idle_timeout.md`, `headers_helper_reauth.md`, `reliability_retries.md`, `mcp_login_logout_cli.md`, `server_name_suggestions.md`
- **Additions file:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.193/analyze/00_overview/symbol_additions_v2_1_193_mcp.md`
- **TARGET bundle (193):** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines, build `a1938d2a`)
- **Before-picture (183):** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines)
- **Earlier baseline (156):** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649,979 lines)
- **v2.1.88 named-TS reference:** `/lyz/codespace/3rd/claude-code/src/`

**Sample:** 85+ distinct `cli_inner_pretty.js:<line>` anchors re-read directly from the 193 bundle (every load-bearing decl, string, and switch-case across all 6 docs + additions file); 14 before-pictures re-read from the 183 / 156 bundles (notice/warning renders, `aOt`/`qxn`/`Qgo` predecessors, `mcp_headers_helper` config-validation context, `--no-browser` `ant` doc string); 38 grep-count diffs re-run in BOTH 183 and 156.

**Verdict (one line):** PASS WITH FIXES. Every load-bearing 193 anchor and obf→readable mapping verified at the cited line; every NET-NEW string reproduced as 0-in-183 and 0-in-156; every CARRYOVER string reproduced as present-in-183. One genuine **false delta** was caught and fixed (the `mcp_headers_helper` telemetry was claimed NET-NEW `1|0` but it is a pre-existing `tengu_feature_sad` feature_name, 193=7/183=6 — only the `reauth_retry` error_code is new), plus one mapping mislabel (`Ct→logMcpEvent` → `logFeatureSadEvent`), two readable-name runtime-`.name` notes, and three small line-cite drifts. All fixed in place.

---

## C1 — Anchor citation spot-check (193 TARGET bundle)

Each line opened at the exact cited line in the 193 bundle; declaration/string confirmed against the doc claim.

### tool_call_idle_timeout.md

| Cited line | Obf → Readable | Verified at 193 line | Result |
|---|---|---|---|
| 292213 | `_pp` → `resolveIdleTimeoutMs` | `function _pp(e){ if(!ypp.has(e?.type??""))return 0; let t=Be.CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT??hpp; …}` | PASS |
| 292208 | `gAa` → `resolveToolTimeoutMs` | `function gAa(e){ …process.env.MCP_TOOL_TIMEOUT… ??fpp; return Math.min(Math.max(r,1000),mAa);}` | PASS |
| 293311 | `hpp` = `DEFAULT_MCP_TOOL_IDLE_TIMEOUT_MS` (300000) | `hpp = 300000,` | PASS |
| 293307 | `fpp` = `DEFAULT_TOOL_TIMEOUT_MS` (1e8) | `fpp = 1e8,` | PASS |
| 293308 | `mAa` = `MAX_TOOL_TIMEOUT_MS` (2147483647) | `mAa = 2147483647,` | PASS |
| 293456 | `ypp` = `IDLE_TIMEOUT_TRANSPORTS` | `ypp = new Set(["http","sse","ws","claudeai-proxy"]);` | PASS |
| 43147 | env map `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT: () => Jpu` | exact | PASS |
| 43611 | env def `(Jpu = Fe.int())` | exact | PASS |
| 293017 | `bao` → `callToolWithWatchdog` | `async function bao({client:{…},tool:o,…,idleTimeoutMs:m,isAuthRetry:g=!1}){` | PASS |
| 293038 | idle resolve `let _ = m ?? _pp(n), S = h` | exact | PASS |
| 293069 | idle abort `…sent no response or progress for ${F}s; aborting. Set CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT…` | exact | PASS |
| 293070 | error label `"MCP tool idle timeout"` | exact | PASS |
| 293098-293099 | `onprogress:(U)=>{ if(((b.armedAt=0),(S=Date.now()),l)) …}` (idle clock reset) | exact | PASS |
| 9055 | `Fi` → `McpToolError` | `Fi = class Fi extends Error { telemetryMessage; …}` | PASS |

### headers_helper_reauth.md

| Cited line | Obf → Readable | Verified at 193 line | Result |
|---|---|---|---|
| 293132-293180 | `bao` catch re-auth branch | full block read; matches ORIGINAL snippet | PASS |
| 293135 | `x = v===401 || _ instanceof vR || (v===403 && C)` (isAuthError) | exact | PASS |
| 293137 | `aWe(t,n)` → `serverCacheKey` (used) | `let R = aWe(t,n),` | PASS |
| 293138 | `pao.get(R)` → `inFlightReauthReconnects` (used) | exact | PASS |
| 293142 | `…re-running headersHelper and retrying once` | exact | PASS |
| 293143 | `Ct("mcp_headers_helper","reauth_retry")` | exact | PASS |
| 293146 | `nT(t,n)` then `ID(t,n)` (disconnect→reconnect) | `(await nT(t,n), ID(t,n))` | PASS |
| 293166 | `headersHelper reconnect returned '${D.type}'; falling through to needs-auth` | exact | PASS |
| 293170 | legacy `Tool call returned 401 Unauthorized - token may have expired` | exact | PASS |
| 293179 | `new lWe(t, …requires re-authorization (token expired))` | exact | PASS |
| 292483 | `aWe` → `serverCacheKey` decl | `function aWe(e,t){ return \`${e}-${gRe(t)}\`; }` | PASS |
| 292489 | `nT` → `disconnectAndClearCache` decl | `async function nT(e,t){ let n=aWe(e,t), r=ID.cache?.get?.(n); …}` | PASS |
| 293460 | `pao` → `inFlightReauthReconnects` | `pao = new Map();` | PASS |
| 293461 | `ID` → `connectOrGetClient` | `ID = xn(async (e,t,n) => {…})` | PASS |
| 44851 | `Ct` → `logFeatureSadEvent` (was `logMcpEvent`) | `function Ct(e,t,n){ V("tengu_feature_sad",{...n,feature_name:$e(e),error_code:t}); }` | **FIXED** (mislabel) |
| 138074 | `vR` → `McpAuthRequiredError` | `vR = class vR extends Error { constructor(e){ super(e ?? "Unauthorized"); } }` | PASS |
| 293424 | `lWe` → `McpReauthError` (runtime `.name="McpAuthError"`) | `lWe = class lWe extends Error { serverName; constructor(e,t){ super(t); this.name="McpAuthError"; …} }` | PASS (note added) |
| 292219 | `$1n` → `needsAuthCachePath` | `function $1n(){ return M1n.join(nr(),"mcp-needs-auth-cache.json"); }` | PASS |
| 292222 | `gao` → `readNeedsAuthCache` | `function gao(){ …$1n()… }` | PASS |
| 292230 | `oAa` → `isCachedNeedsAuth` | `async function oAa(e,t){ let r=(await gao())[e]; …}` | PASS |
| 504183 | needs-auth notice render | `\`${a} MCP ${l} not connected — run /mcp to authenticate, retry, or see details:\`` | PASS |
| 504324 | startup warning | `Run /mcp to authenticate, retry, or inspect the server.\`);` | PASS |
| 292645 | `sn(h,"Skipping connection (cached needs-auth)")` | exact | PASS |

### reliability_retries.md

| Cited line | Obf → Readable | Verified at 193 line | Result |
|---|---|---|---|
| 292133 | `fAa` → `isSessionExpiredError` | `function fAa(e){ …404… 400 && /Server not initialized|No valid session ID|Mcp-Session-Id header is required/… }` | PASS |
| 292140 | `ppp` → `isNetworkTransientError` | `function ppp(e){ …ECONNRESET|ETIMEDOUT|EPIPE|EHOSTUNREACH|ECONNREFUSED|Body Timeout Error|terminated|SSE stream disconnected|Failed to reconnect SSE stream… }` | PASS |
| 292155 | `gpp` → `isRetryableError` | `function gpp(e){ if(R2t(e))return!1; …4xx→false; McpError protocol codes→false; else true }` | PASS |
| 292176 | `P1n` → `listWithPaginationAndRetry` | `async function P1n(e,t,n,r,o){ …for(let i=0;;i++){ …catch{ let p=mpp[i]; if(p===void 0||!gpp(d))throw d; …} } }` | PASS |
| 292205 | `rAa` → `logListPaginated` | `function rAa(e,t,n,r){ V("tengu_mcp_list_paginated",{…}); }` | PASS |
| 293455 | `mpp` = `RETRY_BACKOFFS` ([250,500,1000]) | `mpp = [250, 500, 1000];` | PASS |
| 281528 | `zap` → `isTransientFetchError` | `function zap(e){ if(mh(e))return!0; …TimeoutError… qap.has(t.code) }` | PASS |
| 281323 | `u_a` → `defaultOAuthFetch` | `function u_a(e){ return (t,n)=>{ …AbortSignal.timeout(Dap)… } }` | PASS |
| 281573 | `AOn` → `createRetryingOAuthFetch` | `function AOn(){ return async (e,t)=>{ try{return await m_a(e,t)}catch(n){ if(t?.signal?.aborted||!zap(n))throw n; return (await Nn(Vap,…), await m_a(e,t)); } }; }` | PASS |
| 281583 | `m_a` → `oauthFetchOnce` | `async function m_a(e,t){ …fetch… }` | PASS |
| 283043 | `Vap` = `OAUTH_RETRY_DELAY_MS` (500) | `Vap = 500,` | PASS |
| 293997-293999 | 404 → `ENDPOINT_NOT_FOUND` rewrite + `MCP endpoint not found at ${HIe(t)…}. Check the URL in your MCP config.` | exact | PASS |
| 511853 | second `ENDPOINT_NOT_FOUND` ref | `n === "ENDPOINT_NOT_FOUND"` | PASS |
| 145961 | `Yvn` → `isAllowlistedMcpUrl` | `function Yvn(e){ let t=jSd; if(!t)return!1; …}` | PASS |
| 145991 | `HIe` → `formatServerUrl` | `function HIe(e){ if(!("url" in e)||typeof e.url!=="string")return; …}` | PASS |
| 294050 / 294326 / 294345 / 294363 | `P1n` callers `tools/list` / `resources/list` / `resources/templates/list` / `prompts/list` | all four `await P1n(e.client, e.name, "<method>", …)` | PASS |

### mcp_login_logout_cli.md

| Cited line | Obf → Readable | Verified at 193 line | Result |
|---|---|---|---|
| 613276 | `g3o` → `mcpAuthModule` | `var g3o = {}; gt(g3o, { mcpLogoutHandler: () => D9f, mcpLoginHandler: () => L9f });` | PASS |
| 613312 | `rnc` → `formatAuthUrlMessage` | `function rnc(e,t){ return \`${e ? "If the browser didn't open, visit:" : "Visit this URL to authorize:"}…\`; }` | PASS |
| 613318 | `L9f` → `mcpLoginHandler` | `async function L9f(e,t){ await Jh("tengu_mcp_login",{}); let n=await snc(e,"cli_mcp_login"), …}` | PASS |
| 613467 | `D9f` → `mcpLogoutHandler` | `async function D9f(e){ await Jh("tengu_mcp_logout",{}); let t=await snc(e,"cli_mcp_logout"), n=Z9(e,t); …}` | PASS |
| 613503 | `h3o` → `lazyLoadMcpAuthModule` | `var h3o = E(()=>{ ln(); It(); hne(); …})` | PASS |
| 613523 | `anc` → `buildMcpCommand` | `function anc(e){ let t=e …}` | PASS |
| 613544 / 613570 | `remove <name>` / `get <name>` registrations | `.command("remove <name>")` / `.command("get <name>")` | PASS |
| 613582 / 613583 / 613585 | `login <name>` reg / desc `Authenticate with an MCP server…` / `--no-browser` option | exact | PASS |
| 613593 / 613594 | `logout <name>` reg / desc `Clear stored OAuth credentials for an MCP server` | exact | PASS |
| 613323 / 613347 / 613352 / 613354 | login switch `claudeai-proxy` / `unsupported-transport` / `anthropic-hosted` / `oauth` | all four `case "…":` at cited offsets | PASS |
| 613457-613458 | login success msg `Authenticated with "X"…` (both disabled/enabled variants) | exact | **FIXED** (was `:613452`) |
| 613472 / 613480 / 613485 / 613491 | logout switch cases | exact | PASS |
| 281953 | `oX` → `runOAuthFlow` | `async function oX(e,t,n,r,o){ if(t.oauth?.xaa){…} }` | PASS |
| 283086 | `Vj` → `OAuthAbort` (runtime `.name="AuthenticationCancelledError"`) | `Vj = class Vj extends Error { constructor(){ super("Authentication was cancelled"); this.name="AuthenticationCancelledError"; …} }` | PASS (note added) |

### server_name_suggestions.md

| Cited line | Obf → Readable | Verified at 193 line | Result |
|---|---|---|---|
| 610416 | `t3o` → `suggestClosestServerName` | `function t3o(e,t){ …fde(…,{maxEditDistance:2}); if(r)return \`…Did you mean…\`; if(n.length===0)…; let o=8; …}` | PASS |
| 610430 | `psr` → `formatNotFoundWithPending` | `function psr(e,t,n){ if(n&&t.length===0)return …awaiting approval…; return t3o(e,t)+(n?…:""); }` | PASS |
| 382122 | `fde` → `fuzzyClosestMatch` | `function fde(e,t,{maxEditDistance:n=1}={}){ let r=t.flatMap((i)=>[i.name,...(i.aliases??[])]), …}` | PASS |
| 611388 | `a9f` → `mcpRemoveHandler` | `async function a9f(e,t,n){ let r=Uj(t), …}` | PASS |
| 611414 | remove not-found `tg(t3o(t, es(p)))` | `(await zu("cli_mcp_remove","cli_mcp_remove_not_found"), tg(t3o(t, es(p))…))` | PASS |
| 611549 | `f9f` → `mcpGetHandler` | `async function f9f(e,t){ (await Jh("tengu_mcp_get",{name:t}), …) …}` | PASS |
| 611561 | get not-found `return tg(psr(t, f, r.size > 0));` | exact | **FIXED** (was `:611560`) |
| 228300 | `HBt` → `RETIRED_TOOL_NAMES` | `HBt = new Set(["Frame","FrameRead","TeamCreate","TeamDelete","SuggestBackgroundPR"]);` | PASS |
| 471037 | `oko` → `computeDeferredToolsDelta` | `function oko(e,t,n,r){ …}` | PASS |
| 471050 | retired skip `if (HBt.has(v)) continue;` (inside addedNames loop) | exact | PASS |
| 601626 | render `The following deferred tools are no longer available (their MCP server disconnected). Do not search for them …` | exact | PASS |
| 389642 | second use `HBt.has(n.name) || … ? "expected-absent" : "unknown"` | exact | PASS |

---

## C2 — False-delta hunt (183 + 156 grep evidence)

Every NET-NEW / CARRYOVER claim re-checked against BOTH 183 and 156. `grep -c` run in each bundle.

### Idle timeout (NET-NEW, 2.1.187) — all CONFIRMED

| String | 193 | 183 | 156 | doc claim | verdict |
|---|---|---|---|---|---|
| `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` | 3 | 0 | 0 | NET-NEW | ✅ confirmed |
| `sent no response or progress for` | 1 | 0 | 0 | NET-NEW | ✅ |
| `MCP tool idle timeout` | 1 | 0 | 0 | NET-NEW | ✅ |
| `Set CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT (ms) higher` | 1 | 0 | 0 | NET-NEW | ✅ |
| `transport dropped mid-call` | 1 | 1 | 1 | carryover scaffold | ✅ |
| `activeCallWatchdogs` | 5 | 5 | 5 | carryover scaffold | ✅ |
| `armedAt` | 7 | 5 | 5 | 183:5→193:7 (+2 idle reset) | ✅ |

### headersHelper re-auth (NET-NEW, 2.1.193) — one FALSE DELTA fixed

| String | 193 | 183 | 156 | original doc claim | verdict |
|---|---|---|---|---|---|
| `re-running headersHelper and retrying once` | 1 | 0 | 0 | NET-NEW | ✅ |
| `headersHelper reconnect returned` | 1 | 0 | 0 | NET-NEW | ✅ |
| `reauth_retry` (error_code) | 1 | 0 | 0 | — | ✅ (the real new token) |
| **`mcp_headers_helper`** | **7** | **6** | **6** | "telemetry … 1 \| 0 … NET-NEW" | ❌ **FALSE DELTA → FIXED** |
| `headersHelper` (field uses) | 21 | 18 | 18 | carryover field +3 | ✅ |
| `Tool call returned 401 Unauthorized - token may have expired` | 1 | 1 | 1 | CARRYOVER | ✅ |
| `requires re-authorization (token expired)` | 1 | 1 | 1 | CARRYOVER | ✅ |
| `to authenticate, retry, or see details` (notice) | 1 | 1 | 0 | CARRYOVER (vs 183) | ✅ (183-era add; correctly labelled carryover) |
| `Run /mcp to authenticate, retry, or inspect the server` | 1 | 1 | 0 | CARRYOVER (vs 183) | ✅ |
| `Skipping connection (cached needs-auth)` | 1 | 1 | 1 | CARRYOVER | ✅ |

**The false delta:** the evidence table row `| mcp_headers_helper / reauth_retry telemetry | 1 | 0 | NET-NEW |` reads as if `grep -c mcp_headers_helper` were `1|0`. It is actually `7|6`: `mcp_headers_helper` is a **pre-existing** `tengu_feature_sad` feature_name used since ≤183 (and ≤156) for headersHelper config-validation errors (`missing_trust`, `exec_failed`, `parse_failed`, `non_object`, `non_string_value`, plus one bare). Only the `reauth_retry` **error_code** value is the 193 delta (`reauth_retry` 193=1/183=0/156=0). Fixed: the row now greps `reauth_retry` (1|0) and a separate row documents `mcp_headers_helper` as 7|6 CARRYOVER; the TL;DR, the `Ct` symbol entry, the Related-Symbols line, and the README telemetry line were corrected to say the same.

### Reliability retries (2.1.191) — all CONFIRMED

| String | 193 | 183 | 156 | doc claim | verdict |
|---|---|---|---|---|---|
| `ENDPOINT_NOT_FOUND` | 2 | 0 | 0 | NET-NEW | ✅ |
| `MCP endpoint not found at` | 1 | 0 | 0 | NET-NEW | ✅ |
| `Token refresh failed, retrying in` | 1 | 1 | 1 | CARRYOVER (don't count) | ✅ |
| `skipBrowserOpen` | 14 | 13 | 13 | carryover +1 (CLI login) | ✅ |
| `tengu_mcp_list_paginated` | 1 | 1 | 1 | carryover (telemetry) | ✅ |

183 predecessor `aOt` confirmed at 183 `:283324` (doc said `:283328`; **fixed**): `async function aOt(e,t,n,r,o)` with a single `try { do…while } catch(c){ throw c; }` — `grep 'for ('` over its body = 0, so genuinely no retry loop. OAuth predecessor `qxn` confirmed at 183 `:273095` (`function qxn(){ return async (e,t)=>{ …single fetch… } }`) — byte-equivalent body to 193's `m_a`; `AOn` is the new wrapper (wired at 193 `fetchFn: AOn()` sites 282082/282177/282873 and `r ?? AOn()` 281606). ✅

### login/logout CLI (NET-NEW, 2.1.186) — all CONFIRMED

| String | 193 | 183 | 156 | doc claim | verdict |
|---|---|---|---|---|---|
| `Authenticate with an MCP server` | 1 | 0 | 0 | NET-NEW | ✅ |
| `Clear stored OAuth credentials for an MCP server` | 1 | 0 | 0 | NET-NEW | ✅ |
| `mcpLoginHandler` | 2 | 0 | 0 | NET-NEW (`:613277`,`:613589`) | ✅ |
| `tengu_mcp_login` | 1 | 0 | 0 | NET-NEW | ✅ |
| `tengu_mcp_logout` | 1 | 0 | 0 | NET-NEW | ✅ |
| `Or paste the redirect URL here` | 1 | 0 | 0 | NET-NEW (paste flow) | ✅ |
| `--no-browser` | (mcp:1) | 1 | 1 | the only 183 hit is the unrelated `ant` CLI doc string | ✅ (183 hit at `:654434` = `# Anthropic CLI (\`ant\`)…`) |

Carryover sanity: `tengu_mcp_get` 193=1/183=1, `tengu_mcp_delete` (the remove handler's event) 193=2/183=2 — both CARRYOVER, NOT claimed net-new by the login doc's evidence table (the README "events touched" list was clarified to flag which are new vs carryover).

### get/remove suggestions + retired-tool fix (2.1.186) — all CONFIRMED

| String | 193 | 183 | 156 | doc claim | verdict |
|---|---|---|---|---|---|
| `No MCP server named` | 7 | 0 | 0 | NET-NEW | ✅ |
| `SuggestBackgroundPR` | 1 | 0 | 0 | NET-NEW (retired set) | ✅ |
| `TeamCreate` | 1 | 0 | 0 | NET-NEW (retired set; only in `HBt`) | ✅ |
| `Did you mean "` | 3 | 2 | — | generic helper pre-exists, MCP wrapper new | ✅ |
| `their MCP server disconnected` | 1 | 1 | 1 | CARRYOVER (render unchanged) | ✅ |

183 predecessor `Qgo` confirmed at 183 `:462359`: `for (let T of b.attachment.addedNames) if ((o.add(T), !S.has(T))) s.add(T);` — **no `HBt.has` skip**, byte-matching the doc's stated before-picture. The 193 producer `oko` adds `if (HBt.has(v)) continue;` at `:471050`. ✅

---

## C3 — Obf→readable mapping audit

All 193 mappings confirmed by reading the decl body. Notable runtime-name nuances now annotated in the additions file:

- `Ct` is a **generic** `tengu_feature_sad` logger (`{feature_name, error_code}`), not MCP-specific — renamed `logMcpEvent` → `logFeatureSadEvent` everywhere it appeared (2 docs only; no other file referenced it).
- `lWe` (readable `McpReauthError`) sets `this.name = "McpAuthError"` at runtime — note added.
- `Vj` (readable `OAuthAbort`) is runtime `AuthenticationCancelledError` (msg "Authentication was cancelled") — note added.
- `vR` (readable `McpAuthRequiredError`) extends Error with `super(e ?? "Unauthorized")` — role-appropriate, left as-is.
- Every "Drift fixed vs the scout dossier" line in the additions file (`_pp` 292213, `gAa` 292208, `gao` 292222, env map 43147, `gpp` 292155, `ppp` 292140, `fAa` 292133, `f9f` 611549, `a9f` 611388, `ENDPOINT_NOT_FOUND` 293997-293999, progress reset 293098-293099, needs-auth skip 292645) re-verified correct at the stated 193 lines.

---

## C4 — Defects fixed in place

| # | File | What was wrong | Fix |
|---|---|---|---|
| D1 | `headers_helper_reauth.md` (evidence table, TL;DR, Related Symbols) + `symbol_additions_…_mcp.md` (`Ct` entry) + `README.md` (telemetry line) | **FALSE DELTA**: `mcp_headers_helper` telemetry presented as NET-NEW `1\|0`; it is a pre-existing `tengu_feature_sad` feature_name (193=7/183=6/156=6). | Reworded to grep `reauth_retry` (1\|0 NET-NEW); added a `mcp_headers_helper` 7\|6 CARRYOVER row; clarified TL;DR/README/`Ct` entry that only the `reauth_retry` error_code is the 193 delta. |
| D2 | `headers_helper_reauth.md` (READABLE code, Mapping, Related Symbols) + `symbol_additions_…_mcp.md` | **MISLABEL**: `Ct → logMcpEvent` — `Ct(e,t,n)` emits generic `tengu_feature_sad`, not an MCP event. | Renamed to `logFeatureSadEvent` with `tengu_feature_sad{feature_name,error_code}` note; updated mapping comment + Related Symbols. |
| D3 | `symbol_additions_…_mcp.md` (`lWe` row) | Readable `McpReauthError` did not note the runtime class name. | Added `(runtime .name = "McpAuthError")`. |
| D4 | `symbol_additions_…_mcp.md` (`Vj` row) | Readable `OAuthAbort` did not note the runtime class name. | Added `(runtime .name = "AuthenticationCancelledError", msg "Authentication was cancelled")`. |
| D5 | `reliability_retries.md` (§1 prose + evidence table) | 183 predecessor `aOt` cited at `:283328` (inside body); decl is `:283324`. | Corrected both to `:283324`; added "catch just rethrows, no `for(;;)`" detail. |
| D6 | `server_name_suggestions.md` (callers list) | `mcpGetHandler` not-found `psr(...)` call cited `:611560`; actual call line is `:611561`. | Corrected to `:611561`. |
| D7 | `mcp_login_logout_cli.md` (§2 success message) | OAuth-success message cited `:613452`; actual messages at `:613457-613458`. | Corrected to `:613457-613458`. |

No forbidden obf→readable mapping tables were introduced into module docs; all `## Related Symbols` sections remain list-format; English-only and dual-version snippet format preserved.

---

## C5 — Verdict

**PASS WITH FIXES.** Confidence **HIGH**.

- All 6 module docs + the additions file are anchor-accurate against the live 193 bundle: every cited decl, string, switch-case, and constant was confirmed at the exact line (or corrected by ≤5 lines where it drifted).
- The NET-NEW vs CARRYOVER ledger is sound after one genuine false delta was caught and corrected (`mcp_headers_helper`), proving the value of the dual-bundle grep step: a per-file read would have accepted the `1|0` row, but `grep -c` in 183 **and** 156 exposed the 6 pre-existing config-validation uses.
- The two heaviest deltas (idle watchdog Δ1, re-auth catch Δ2) both live in `bao`/`callToolWithWatchdog` exactly as documented; the carryover spine (needs-auth cache, startup notice, legacy 401 surfacing, transport-drop watchdog) is byte-identical in 183 as claimed.

**Residuals (honest):**
- The notice strings (`to authenticate, retry, or see details`, `Run /mcp to authenticate, retry, or inspect the server`) are 183 carryover but are **absent in 156** (added between 156 and 183). The docs correctly call them "carryover" relative to the 193 window; no action needed, noted here for completeness.
- `lWe`/`Vj` readable names are role-based aliases that differ from their runtime `.name` ("McpAuthError"/"AuthenticationCancelledError"); kept the descriptive names for cross-doc consistency and annotated the runtime names rather than renaming.
- `fde`→`fuzzyClosestMatch` is characterized as "Levenshtein"; the body is an edit-distance matcher over name+aliases with a default `maxEditDistance` of 1 (t3o passes 2) — consistent with the doc, not independently re-derived to the algorithm level.
