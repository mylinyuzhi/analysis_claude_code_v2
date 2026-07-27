# Per-server timeouts, OAuth scope narrowing, and reconnect recovery

> **Type:** mixed — two narrow deltas, one confirmed carryover, three corrected mis-anchors
> · **Versions:** `.196` `.206` `.210` `.211` `.216` · **Module:** `39_mcp/`
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`.
> Every `cli_inner_pretty.js:<line>` is a **2.1.220** line I read; baseline lines tagged `(193)`.
> The MCP client exists twice in this build — see [`dual_mcp_runtime_trees.md`](./dual_mcp_runtime_trees.md).
> Citations below give the **v2** line first and its **v1** twin in parentheses; **v1 is the default arm**.

## TL;DR

| Bullet | What the changelog claims | What the code says |
|---|---|---|
| `.206` #9 | per-server `request_timeout_ms` was ignored (60 s default) | the **60 s resolver is byte-identical carryover**; the delta is that a field *named* `request_timeout_ms` now exists at all and folds into `timeout` at parse time |
| `.196` #15 | MCP OAuth asked for the AS's whole `scopes_supported` → `invalid_scope` | **true and provable**: one branch was deleted and re-gated behind an explicit `authServerMetadataUrl` |
| `.206` #11 | OAuth servers needed manual re-auth after one failed refresh | the retry loop **and** the concurrent-winner recovery are **carryover** (193=1 → 220=2 = tree twin). Real delta not isolated |
| `.216` #19 | re-authenticating revoked working credentials first | best anchor is the **new** `CLI_OWNED_BEARER_REJECTED` classification (220=6/193=0), which stops a session-credential 401 from demanding a re-login |
| `.210` #11 / `.211` #5 | plugin MCP servers torn down on re-sync / not reconnecting after an idle web wake | **unanchored.** The gate the scoping pass suggested (`tengu_mcp_dropped_tools_pool_change`) is a *different* feature — see [`errors_and_diagnostics.md`](./errors_and_diagnostics.md) §5 |
| `.210` #22 | SDK MCP servers from `initialize` waited a turn to connect | **mis-anchored.** `tengu_mcp_sdk_generation` is the v1/v2 runtime probe, not an SDK-connect fix |

Plus one **undocumented** delta: the idle-abort watchdog now applies to `stdio` servers and a per-server
`timeout` now *raises* the idle window instead of only capping it.

---

## 1. `request_timeout_ms` — a wire hint, not a user setting (`.206` #9)

`request_timeout_ms` is **220=5 / 193=0**. Its schema declaration, read verbatim at `:58766-58774`:

```javascript
(yWl = Se(() => v.number().int().positive().optional().catch(void 0)
  .describe("@internal CCR backend wire hint; folded into timeout at parse.")))
```

and the fold:

```javascript
// ============================================
// foldRequestTimeoutIntoTimeout - zod .transform() that maps request_timeout_ms onto timeout
// Location: cli_inner_pretty.js:58729-58731
// ============================================

// ORIGINAL (for source lookup):
function X5n({ request_timeout_ms: e, ...t }) {
  return { ...t, ...(t.timeout === void 0 && e !== void 0 && { timeout: Math.min(e, dHh) }) };
}

// READABLE (for understanding):
function foldRequestTimeoutIntoTimeout({ request_timeout_ms: wireHint, ...rest }) {
  return { ...rest,
    ...(rest.timeout === undefined && wireHint !== undefined
        && { timeout: Math.min(wireHint, MAX_FOLDED_TIMEOUT_MS) }) };   // dHh = 300000
}

// Mapping: X5n→foldRequestTimeoutIntoTimeout, dHh→MAX_FOLDED_TIMEOUT_MS (300000, :58768)
```

**How it works:** the field is *stripped* by destructuring (so it never reaches the transport code) and
re-emitted as `timeout` only when the config did **not** already carry an explicit `timeout`. It is
clamped at `dHh = 300000` (5 min) — a much tighter cap than `timeout`'s own Int32 ceiling.
Attached to the `sse` (`:58815`) and `http` (`:58856`) schemas via `.transform(X5n)` (`:58824`), and
declared on the SDK/control-protocol side at `:835404` / `:835421`.

**Why fold instead of adding a second timeout:** the client already has three per-call clocks (hard
timeout, per-request HTTP timeout, idle timeout, §2). A fourth, differently-named knob arriving from a
backend would have to be threaded through all three resolvers. Folding it into the one field those
resolvers already read means **zero** changes downstream — which is exactly why the field can be
`@internal`: the backend speaks its own name, the client normalises at the boundary.

**Why `timeout` wins:** precedence is *most explicit wins*. A user-written `timeout` in `.mcp.json` is a
deliberate choice; `request_timeout_ms` is a hint from the hosting backend. Reversing the order would let
a backend silently override a user's config.

**Failure modes:** `.catch(void 0)` means a non-numeric or negative value becomes `undefined` and the
whole entry still parses — it degrades to the default rather than being rejected as `invalid_config`
(contrast the strict handling in [`errors_and_diagnostics.md`](./errors_and_diagnostics.md) §1).

### The 60-second default is carryover — proof

```
220: getMcpRequestTimeoutMs (Nvs, :293353-293358)   default CKu = 60000  (:294488)
193: hAa                       (:292436-292440 (193)) default lAa = 60000 (:293320 (193))
```

Both bodies are the same three statements: `parseInt(MCP_TOOL_TIMEOUT)`, then
`(cfg.timeout >= 1000 ? cfg.timeout : undefined) ?? (env > 0 ? env : undefined)`, then
`Math.min(Math.max(n, 60000), INT32_MAX)` — note the 60 s is a **floor**, so a per-server `timeout` can
only *raise* the per-HTTP-request deadline. The wrapper is also unchanged in shape: `Ten` (`:293357`,
193 `R1n` `:292442 (193)`) only arms the timer for **non-GET** requests
(`if ((o?.method ?? "GET").toUpperCase() === "GET") return e(n, o);`, `:293359`) — because a GET on a
Streamable-HTTP/SSE endpoint *is* the long-lived event stream and must never be aborted at 60 s. The
abort uses `new DOMException("The operation timed out.", "TimeoutError")` (`:293369`) on an `unref`'d
timer, and that exact DOMException is what the auto-background path classifies as a *tool-level* error
(`:288828`).

**So the honest reading of `.206` #9:** the literal claim is correct — a config key called
`request_timeout_ms` was previously dropped on the floor by the zod schema (unknown keys) and therefore
"ignored", and every such server fell back to the 60 s default. The *mechanism* the bullet seems to
describe (per-server timeout honouring) already worked, via `timeout`.

### New sub-second dead probe

```javascript
// ORIGINAL (:292940-292947):
function Dvs(e, t) {
  if (Cvs.has(e)) return;
  (Cvs.add(e), O("tengu_dead_probe_mcp_subsec_timeout", { site: e === "hard" ? Ee("hard") : e === "idle" ? Ee("idle") : Ee("request"), timeout_value: Tf(t) }));
}
```

`tengu_dead_probe_mcp_subsec_timeout` is **220=2 / 193=0** (once per tree). All three resolvers call it
when a config sets `timeout < 1000` — `"hard"` (`:292953`), `"idle"` (`:292962`), `"request"` (`:293355`)
— and a `Set` (`Cvs`) makes it fire at most once per site per process. This is a *deprecation probe*: the
"values below 1000 ms are ignored" rule is documented (`:835354`) but Anthropic is measuring whether
anyone actually depends on it before changing it. `EAy()` (`:292948`) clears the set, so tests can re-arm it.

---

## 2. UNDOCUMENTED: `stdio` servers now get an idle deadline, and `timeout` raises it

No changelog bullet covers this. Compare the two resolvers:

```javascript
// ============================================
// getMcpToolIdleTimeoutMs - silence deadline per tool call (0 = disabled)
// Location: cli_inner_pretty.js:292957-292965  (v1 twin l7u :298499-298507)
// ============================================

// ORIGINAL (for source lookup):
function MKu(e) {
  let t = e?.type ?? "stdio";
  if (wAy.has(t)) return 0;
  let r = Z.CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT ?? (t === "stdio" ? AAy : vAy);
  if (r <= 0) return 0;
  if (e?.timeout !== void 0 && e.timeout < 1000) Dvs("idle", e.timeout);
  let n = e?.timeout !== void 0 && e.timeout >= 1000 ? e.timeout : 0;
  return Math.min(Math.max(r, n, 1000), Pvs(e));
}

// READABLE (for understanding):
function getMcpToolIdleTimeoutMs(serverConfig) {
  let transport = serverConfig?.type ?? "stdio";
  if (IDLE_EXEMPT_TRANSPORTS.has(transport)) return 0;                  // sse-ide, ws-ide, sdk
  let idle = env.CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT
           ?? (transport === "stdio" ? STDIO_IDLE_MS : REMOTE_IDLE_MS); // 1_800_000 : 300_000
  if (idle <= 0) return 0;
  if (serverConfig?.timeout !== undefined && serverConfig.timeout < 1000) reportSubSecondTimeout("idle", serverConfig.timeout);
  let perServerFloor = serverConfig?.timeout !== undefined && serverConfig.timeout >= 1000 ? serverConfig.timeout : 0;
  return Math.min(Math.max(idle, perServerFloor, 1000), getMcpToolTimeoutMs(serverConfig));
}

// Mapping: MKu→getMcpToolIdleTimeoutMs, wAy→IDLE_EXEMPT_TRANSPORTS (:294628), AAy→STDIO_IDLE_MS (1800000, :294473),
//          vAy→REMOTE_IDLE_MS (300000, :294472), Pvs→getMcpToolTimeoutMs (:292951), Dvs→reportSubSecondTimeout
```

| | 2.1.193 (`_pp`, `:292213 (193)`) | 2.1.220 (`MKu`, `:292957`) |
|---|---|---|
| transport rule | **allow-list** `Set(["http","sse","ws","claudeai-proxy"])` — `stdio` → `0` | **deny-list** `wAy = Set(["sse-ide","ws-ide","sdk"])` — `stdio` **is watched** |
| default | one value, `300000` | `stdio` → **`1800000`**, remote → `300000` |
| per-server `timeout` | ceiling only: `min(max(idle,1000), toolTimeout)` | ceiling **and floor**: `min(max(idle, timeout, 1000), toolTimeout)` |
| sub-second config | silently ignored | ignored **and reported** (`tengu_dead_probe_mcp_subsec_timeout`) |

**Why invert the transport test:** an allow-list breaks silently every time a new transport is added — a
`claudeai-proxy` or a future transport that is not in the set gets *no* idle protection and can hang
forever. The deny-list fails the other way: a new transport is watched by default and only the two IDE
transports plus in-process `sdk` servers (which cannot go "silent" in the network sense) are exempt.
This is the safer default for a watchdog.

**Why 30 minutes for `stdio`:** a local subprocess going quiet is far more often *legitimate work* (a
compiler, a test suite, an indexer) than a lost network response, and there is no packet to lose. Six
times the remote window keeps the protection while making false positives rare. The old behaviour —
`stdio` gets no watchdog at all — meant a wedged local server hung the session until the user pressed Esc.

**Why the per-server `timeout` became a floor:** the abort message says it outright (`:294181`, v1 twin
`:299723`):

> `MCP server "<s>" tool "<t>" sent no response or progress for <N>s; aborting. If this server is
> configured in your MCP settings, set a per-server "timeout" (ms) to allow longer silent runs for just
> this server; otherwise set CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT (ms) globally (0 disables).`

In 2.1.193 that sentence did not exist — the message only offered the global env var. Making `timeout`
raise the idle window gives per-server granularity **without a new config key**: a user who says "this
server may take an hour" gets both a longer hard limit and a longer silence tolerance from one number.
The clamp order matters — `Math.max(idle, perServerFloor, 1000)` then `Math.min(…, hardTimeout)` — so the
idle window can never exceed the hard timeout, which would make it unreachable.

**Documentation drift worth flagging:** the `timeout` field's own description
(`:835354`, byte-identical to 193 `:698303 (193)`) still says only *"Hard wall-clock limit per call;
progress notifications do not extend it"*. It never mentions the idle interaction added here.

---

## 3. OAuth scope narrowing (`.196` #15) — one deleted branch

```javascript
// ============================================
// getCuratedMetadataScope - which scope string to request from the authorization server
// Location: cli_inner_pretty.js:287457-287463 (v2)  ·  helper E9u :288174-288178
// ============================================

// ORIGINAL (for source lookup):
getCuratedMetadataScope() {
  let e = E9u(this._metadata);
  if (e !== void 0) return e;
  if (this.serverConfig.oauth?.authServerMetadataUrl && Array.isArray(this._metadata?.scopes_supported))
    return this._metadata.scopes_supported.join(" ");
  return;
}
function E9u(e) {
  if (!e) return;
  if ("scope" in e && typeof e.scope === "string") return e.scope;
  if ("default_scope" in e && typeof e.default_scope === "string") return e.default_scope;
  return;
}

// READABLE (for understanding):
getCuratedMetadataScope() {
  let curated = pickCuratedScope(this._metadata);               // AS-declared `scope` / `default_scope`
  if (curated !== undefined) return curated;
  // full catalogue ONLY when the operator explicitly pointed us at this AS's metadata
  if (this.serverConfig.oauth?.authServerMetadataUrl && Array.isArray(this._metadata?.scopes_supported))
    return this._metadata.scopes_supported.join(" ");
  return undefined;                                            // -> SDK falls back to the client's own scope
}

// Mapping: E9u→pickCuratedScope, _metadata→authorizationServerMetadata
```

The 2.1.193 equivalent is a **single function with three branches** (`HOn`, `:283018-283024 (193)`):

```javascript
function HOn(e) {
  if (!e) return;
  if ("scope" in e && typeof e.scope === "string") return e.scope;
  if ("default_scope" in e && typeof e.default_scope === "string") return e.default_scope;
  if (e.scopes_supported && Array.isArray(e.scopes_supported)) return e.scopes_supported.join(" ");   // ← removed
  return;
}
```

**The delta, exactly:** the third branch was cut out of the helper and re-planted in the class method
behind `this.serverConfig.oauth?.authServerMetadataUrl`. `scopes_supported` is **220=13 / 193=6**; the
counts rise because of the tree duplication and the vendored SDK, so the *count* proves nothing — the
**shape** does.

**Why this fixes GitLab self-hosted:** RFC 8414's `scopes_supported` is a *catalogue of everything this AS
can ever issue*, not a menu you may request. GitLab's list includes scopes a Claude Code client is not
approved for, so echoing the whole list back in the authorization request yields `invalid_scope` and the
flow dies before the user sees a consent screen. Preferring `scope` / `default_scope` (which *are*
"what to ask for") and otherwise asking for nothing — letting the SDK use the client's own registered
scope from Dynamic Client Registration — is the correct reading of the spec.

**Why keep the catalogue path at all:** `authServerMetadataUrl` is an explicit escape hatch — declared in
the `oauth` sub-schema at `:58791` with a `.url().startsWith("https://", …)` guard at `:58793-58794`. An
operator who hand-points the client at a private AS is asserting "I know what this AS wants"; for those,
requesting everything advertised is the old, occasionally-necessary behaviour. Default-narrow,
opt-in-wide.

**`offline_access` is separate and unchanged** (`v9u`, `:288180-288183`; 193 `Qap`, `:283026-283030 (193)`):
it appends `offline_access` **only if the AS advertises it** in `scopes_supported` and it is not already
present. Same code both builds — do not fold it into the scope-narrowing story.

---

## 4. Single-failed-refresh recovery (`.206` #11) — CARRYOVER, and I could not find the delta

The refresh path in 2.1.220 is genuinely robust, and *all of it is old*:

1. **Transient retry, 3 attempts, exponential backoff** (`_doRefresh`, `:288005-288118`):
   `let a = s instanceof Error && /timeout|timed out|etimedout|econnreset/i.test(s.message)`, plus three
   error classes (`:288106`); on a transient failure it sleeps `1000 * Math.pow(2, o - 1)` (`:288114`,
   i.e. 1 s then 2 s) and retries. Only `!c || o >= 3` gives up with
   `transient_retries_exhausted` / `request_failed` (`:288110`).
2. **Concurrent-winner recovery before destroying anything** (`readConcurrentRefreshWinner`,
   `:287988-288004`): on `invalid_grant` it re-reads the on-disk credential store and, if another process
   has landed an access token with **more than 300 s of life left** (`r == null || r > 300`, `:287992`),
   returns those tokens instead of clearing. Same guard on the DCR `invalid_client` /
   `unauthorized_client` path (`:288080-288087`), which additionally compares `clientId` to detect a
   concurrent re-registration and bails out with `concurrent_reregister` rather than clobbering it.
3. Only then `invalidateCredentials("tokens")` (`:288071`) or `("all")` (`:288095`).

**Evidence that this is carryover, not the `.206` fix:**

| Anchor | 220 | 193 | Reading |
|---|---|---|---|
| `Token refresh failed, retrying in` | 2 | **1** | tree twin — one per arm |
| `Another process landed fresh tokens` | 2 | **1** | tree twin |
| `readConcurrentRefreshWinner` | 6 | **3** | tree twin (2 arms × 3 uses) |
| `concurrent_winner` | 4 | **2** | tree twin |
| `transient_retries_exhausted` | 2 | **1** | tree twin |
| `invalidateCredentials` | 14 | **8** | 2 SDK sites (single) + 6 per arm — carryover |
| `tengu_mcp_oauth_refresh_failure` | 2 (`:288008`, `:298055`) | **1** | tree twin |

Every literal is exactly `2 × 193` (or `2 × (193 − shared)`). **Verdict: the machinery the bullet
describes predates the window.** What I tried and failed to anchor: `reauthRequired` (0/0),
`refresh lock` (18/12 — grows only with the twin), `Released refresh lock` (2/1), `sawAuthChallenge`
(10/4 — the +2 is §5's classifier, not the refresh path), `markStepUpPending` (6/3),
`_lastServedRefreshToken` (14/7). Record `.206` #11 as **CARRYOVER / unanchored**.

---

## 5. `CLI_OWNED_BEARER_REJECTED` — a 401 that must not demand a re-login (`.216` #19)

`CLI_OWNED_BEARER_REJECTED` is **220=6 / 193=0** — the only genuinely new member of the auth-failure
taxonomy in this window.

```javascript
// ============================================
// classifyMcpAuthFailure - turns a connect failure into one of four labelled auth outcomes
// Location: cli_inner_pretty.js:293071-293107 (v2)
// ============================================

// ORIGINAL (for source lookup):
async function wKu({ name: e, serverRef: t, transportType: r, error: n, statusCode: o,
                     sawAuthChallenge: i, hasUserAuthHeader: s, cliOwnedBearer: a, useFirstPartyAuth: l }) {
  if (!(n instanceof JI || (n instanceof nWe && i) || o === 401 || o === 403)) return;
  if (s) { ... errorCode: "AUTH_HEADER_REJECTED", ... }
  if (a)
    return kvs({ name: e, serverRef: t, transportType: r, errorCode: "CLI_OWNED_BEARER_REJECTED",
      message: `Server rejected the session credential (HTTP ${o ?? 401}). It will be retried when the session credential is refreshed.` });
  if (l) return LAy(e, t, r, o);
  return $Ku(e, t, r, n, n instanceof JI || o === 401);
}

// READABLE (for understanding):
async function classifyMcpAuthFailure({ name, serverRef, transportType, error, statusCode,
                                        sawAuthChallenge, hasUserAuthHeader, cliOwnedBearer, useFirstPartyAuth }) {
  if (!(isUnauthorizedError(error) || (isTransportError(error) && sawAuthChallenge)
        || statusCode === 401 || statusCode === 403)) return;                 // not an auth problem at all
  if (hasUserAuthHeader) return failed("AUTH_HEADER_REJECTED", …);            // user's own header -> no OAuth fallback
  if (cliOwnedBearer) return failed("CLI_OWNED_BEARER_REJECTED",              // CLI-managed session token
      `Server rejected the session credential (HTTP ${statusCode ?? 401}). It will be retried when the session credential is refreshed.`);
  if (useFirstPartyAuth) return firstPartyAuthRejected(name, serverRef, transportType, statusCode);
  return needsOAuthAuthorization(name, serverRef, transportType, error, isUnauthorizedError(error) || statusCode === 401);
}

// Mapping: wKu→classifyMcpAuthFailure, kvs→buildFailedClient, LAy→firstPartyAuthRejected,
//          $Ku→needsOAuthAuthorization
```

### Decision: four outcomes, ordered most-specific-first

**What it does:** converts "the server said 401/403" into a *labelled* terminal state whose label decides
what the user is told and whether credentials are touched.

**How it works — the ordering is the design:**
1. **Is this even an auth failure?** The guard accepts an explicit unauthorized error, a 401/403 status,
   *or* a generic transport error **when an auth challenge was seen earlier on this connection**
   (`sawAuthChallenge`, set at `:287394` when any response is 401/403). That third disjunct catches
   servers that close the connection instead of answering the challenge.
2. **`hasUserAuthHeader` first.** If the user pinned `headers.Authorization`, the client must *not* start
   an OAuth flow — that would silently replace the credential the user chose. The message says so:
   *"OAuth fallback is disabled when headers.Authorization is set."*
3. **`cliOwnedBearer` second — the new arm.** This is a token the CLI itself manages (the session
   credential). A 401 here means "our token aged out", not "the user must authorize this server", so the
   outcome is *informational*: **no credential is invalidated and no re-login is demanded**, and the text
   promises an automatic retry after the session credential refreshes. This is precisely the failure mode
   `.216` #19 describes — a re-authenticate that throws away a working credential — and the fix is to
   classify the case instead of falling through to the generic needs-auth path.
4. **`useFirstPartyAuth` third**, with a 403-vs-401 split (`:293063-293068`): 403 is read as *"your token
   is missing a scope this server needs"* and points at `/login`; 401 is read as *"your login was
   rejected"*. Distinguishing them matters because re-running `/login` fixes the second and usually not
   the first.
5. **Generic OAuth needs-auth last** — the only branch that leads to an authorization flow.

**Why label rather than just log:** the label is consumed three ways — `RAy` (`:294630-294634`) maps the
three "rejected" codes to a `severity` (`bad` / `bad` / `sad`) and a `featureErrorCode` for health
metering; `bSp` (`:563887-563894`) lists them as *already human-readable* so the HTTP-status formatter
leaves them alone (see [`errors_and_diagnostics.md`](./errors_and_diagnostics.md) §3); and the `/mcp`
status renderer turns them into a row. One classification, three consumers.

**Key insight:** the two carryover codes (`AUTH_HEADER_REJECTED` 220=5/193=3,
`FIRST_PARTY_AUTH_REJECTED` 220=5/193=3) show the *pattern* existed; the delta is that the CLI's own
bearer got its own arm. Before, a session-token 401 landed in the generic branch and told the user to
authorize a server they had already authorized.

**Honesty note:** `_scope_v215_220.md` row `.216` #19 proposes `tengu_mcp_proxy_needs_approval_retry`
(`:293996`) as the anchor. That gate is the claude.ai-proxy **tool-approval** retry (§6), which has
nothing to do with credentials. I am recording `CLI_OWNED_BEARER_REJECTED` as the better anchor and the
proxy gate as a separate, undocumented feature.

---

## 6. Bonus: the claude.ai-proxy retroactive approval retry

`tengu_mcp_proxy_needs_approval_retry` is **220=6 / 193=0** (three sites per tree: `:293996`, `:294016`,
`:294026`; v1 twins `:299538`, `:299558`, `:299568`).

**What it does:** lets a claude.ai-proxy MCP server *reject* a tool call with JSON-RPC error `-32003`
carrying `{tool_name, args_sha256}`, and the client responds by showing the user an approval card and
replaying the same call once.

**How it works:**
1. The error must be a `ys` (MCP error) with `code === aBe` (`-32003`), an object `data` containing
   `args_sha256`, an available `canUseTool` bundle (`y`), a parent message (`m`), and **`!E`** — a
   one-shot latch so a server cannot loop the user (`:294008-294016`).
2. It is also registered as an *expected* error on the OTel span
   (`isExpectedError`, `:293986-293996`), so a needs-approval rejection does not pollute the RPC error
   rate.
3. On acceptance it builds `{behavior: "ask", suppressAlwaysAllowRule: !0, message: "The <tool> connector
   requires approval for this call.", decisionReason: {…}}` (`:294028-294033`).
   `suppressAlwaysAllowRule: true` is the important flag: the user may approve **this** call but cannot
   create a persistent always-allow rule from it.
4. Health metering distinguishes the outcomes: `be("mcp_ccr_needs_approval")` on a successful retry
   (`:294001`), `pe(..., "retry_failed")` when the replay itself fails (`:294005`).

**Why `args_sha256`:** the server pins the *exact arguments* it is approving. The retry must present the
same digest, so the approval cannot be harvested and reused for a different payload. That is what makes a
"retroactive" approval safe: approval is bound to a hash, not to a tool name.

**Key insight:** this inverts the usual permission direction. Normally the client decides whether a tool
call needs approval before sending it; here a *remote* server can demand approval after the fact, and the
client is built to satisfy that demand exactly once, without granting a durable rule.

---

## 7. Plugin MCP teardown and idle-wake reconnect — honestly unanchored

`.210` #11 ("plugin-provided MCP servers torn down when MCP servers are re-synced") and `.211` #5
("plugin MCP servers not reconnecting after an idle web session woke") could not be anchored.

What exists and is *adjacent* but not the fix:
- `clearServerCache` (`fcr`, `:293450-293459`) tears down one server's memoised connect result and five
  caches (`MHe`, `uze`, `hOt`, `gcr`, `ycr`) — the plumbing a re-sync would use, but its literals are
  carryover.
- `discardMemoizedConnectResult` (`GAy`) and `ensureConnectedClient` (`Fvs`) are exported (`:292826`,
  `:292814`); `ensureConnected` is 220=19 / 193=15, i.e. count drift with no distinguishing literal.
- `nYu` (`:293435-293443`) gates staging-root exposure on `e.pluginSource` and `BAy = Set(["documents"])`
  (`:294641`) — plugin-aware, but about roots, not reconnection.

Probes that returned nothing in either build: `reconnectPlugin`, `pluginMcp`, `idleWake`, `onWake`,
`resumeFromIdle`. Verdict: **UNANCHORED**; both bullets are plausibly server/daemon-side or expressed
purely as control-flow with no literal.

Similarly, `.210` #22 ("SDK MCP servers from an `initialize` control request waiting a turn to connect")
was scoped against `tengu_mcp_sdk_generation` (`:262859`). That event is the **v1/v2 runtime arm probe**
(see [`dual_mcp_runtime_trees.md`](./dual_mcp_runtime_trees.md)) and carries `{generation, source}` — it
cannot be the SDK-connect fix. Recorded as **mis-anchored / unanchored**.

---

## Cross-links

- [`dual_mcp_runtime_trees.md`](./dual_mcp_runtime_trees.md) — why the OAuth literals are all 2×.
- [`errors_and_diagnostics.md`](./errors_and_diagnostics.md) — how the error codes produced here are rendered.
- 2.1.193 predecessors:
  [`../../../claude_code_v_2.1.193/analyze/39_mcp/tool_call_idle_timeout.md`](../../../claude_code_v_2.1.193/analyze/39_mcp/tool_call_idle_timeout.md)
  (the resolver this §2 rewrites) and
  [`../../../claude_code_v_2.1.193/analyze/39_mcp/headers_helper_reauth.md`](../../../claude_code_v_2.1.193/analyze/39_mcp/headers_helper_reauth.md)
  (the 401/403 re-auth branch this §5 classifies).
- [`README.md`](./README.md) — per-bullet ledger.

## Related Symbols

> Symbol mappings:
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (**MCP** home)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - [../00_overview/symbol_additions_v2_1_220_mcp.md](../00_overview/symbol_additions_v2_1_220_mcp.md) - this window's MCP additions

Key functions/constants in this document:

- `foldRequestTimeoutIntoTimeout` (`X5n`, `cli_inner_pretty.js:58729`) - `request_timeout_ms` → `timeout`, capped at 300 000.
- `REQUEST_TIMEOUT_MS_SCHEMA` (`yWl`, `cli_inner_pretty.js:58766`) - `@internal CCR backend wire hint`.
- `MAX_FOLDED_TIMEOUT_MS` (`dHh`, `cli_inner_pretty.js:58768`) - `300000`.
- `getMcpRequestTimeoutMs` (`Nvs`, `cli_inner_pretty.js:293353`) - per-HTTP-request deadline, 60 s floor.
- `withRequestTimeout` (`Ten`, `cli_inner_pretty.js:293359`) - non-GET-only abort wrapper.
- `DEFAULT_MCP_REQUEST_TIMEOUT_MS` (`CKu`, `cli_inner_pretty.js:294488`) - `60000`.
- `getMcpToolTimeoutMs` (`Pvs`, `cli_inner_pretty.js:292951`) - hard per-call ceiling.
- `getMcpToolIdleTimeoutMs` (`MKu`, `cli_inner_pretty.js:292957`; v1 twin `l7u` `:298499`) - silence deadline.
- `IDLE_EXEMPT_TRANSPORTS` (`wAy`, `cli_inner_pretty.js:294628`) - `Set(["sse-ide","ws-ide","sdk"])`.
- `STDIO_IDLE_MS` (`AAy`, `cli_inner_pretty.js:294473`) - `1800000` (new).
- `REMOTE_IDLE_MS` (`vAy`, `cli_inner_pretty.js:294472`) - `300000`.
- `reportSubSecondTimeout` (`Dvs`, `cli_inner_pretty.js:292940`) - `tengu_dead_probe_mcp_subsec_timeout`.
- `getCuratedMetadataScope` (`cli_inner_pretty.js:287457`) - narrowed OAuth scope selection.
- `pickCuratedScope` (`E9u`, `cli_inner_pretty.js:288174`) - `scope` / `default_scope` only.
- `ensureOfflineAccessScope` (`v9u`, `cli_inner_pretty.js:288180`) - carryover `offline_access` append.
- `readConcurrentRefreshWinner` (`cli_inner_pretty.js:287988`) - carryover cross-process token rescue.
- `refreshMcpOAuthTokens` (`_doRefresh`, `cli_inner_pretty.js:288005`) - carryover 3-attempt refresh.
- `classifyMcpAuthFailure` (`wKu`, `cli_inner_pretty.js:293071`) - four-outcome 401/403 taxonomy.
- `MCP_AUTH_ERROR_SEVERITY` (`RAy`, `cli_inner_pretty.js:294630`) - errorCode → `{severity, featureErrorCode}`.
- `getMcpConnectTimeoutMs` (`MN`, `cli_inner_pretty.js:285811`) - `MCP_TIMEOUT` or 30 000.
