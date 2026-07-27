# Login, OAuth token lifecycle, and credential helpers (v2.1.193 → v2.1.220)

> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
> (`VERSION 2.1.220`, build `4073f595`, `build_time 2026-07-24T22:17:45Z`).
> BASELINE: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`.
> Every `cli_inner_pretty.js:<line>` is a **220** line unless tagged **(193)**.
> Conventions: [`../_CONVENTIONS.md`](../_CONVENTIONS.md). Ledger: [`README.md`](README.md).

---

## 0. The module you are reading

Almost everything in this document lives in one bundle module whose export table sits at
`cli_inner_pretty.js:154127-154262`. That table is the single most valuable artefact in this theme:
it hands you **135 readable names** for the auth surface, in a build where nothing else is named.
A sample, verbatim:

```javascript
// ORIGINAL (:154129-154149, elided):
tt(kY, {
  withOAuthRefreshLock: () => DXi,
  validateForceLoginOrg: () => jde,
  validateForceLoginMethod: () => vst,
  saveOAuthTokensIfNeeded: () => Ver,
  restoreGatewayAuth: () => AXi,
  resolveWithStallGuard: () => Jeu,
  refreshGcpCredentialsIfNeeded: () => ist,
  refreshAwsAuth: () => Q8r,
  refreshAndGetAwsCredentials: () => JQ,
  prefetchGcpCredentialsIfSafe: () => Eno,
  oauthRefreshLockOptions: () => gXi,
  isHostManagedProviderAuth: () => Yv,
  ...
```

Names that are **220-only** (`grep -c` in both bundles) are themselves evidence of new machinery:

| Export name | 220 | 193 | What it buys |
|---|---|---|---|
| `getApiKeyHelperLastFailure` (`J8r`) | 1 | **0** | §2 — the apiKeyHelper error surface |
| `isHostManagedProviderAuth` (`Yv`) | 1 | **0** | [`transport_settings.md`](transport_settings.md) |
| `getForcedLoginMethod` (`Uer`) / `validateForceLoginMethod` (`vst`) | 1 / 1 | **0 / 0** | §4 |
| `resolveWithStallGuard` (`Jeu`) | 1 | **0** | [`aws_and_provider_plumbing.md`](aws_and_provider_plumbing.md) §4 |
| `getDefaultAwsProviderChain` (`oW`) | 1 | **0** | aws doc §1 |
| `AWS_CHAIN_RESOLVE_REQUEST_TIMEOUT_MS` (`XIt`) | 1 | **0** | aws doc §3 |
| `clearAwsHelperCredentialsCache` (`kXi`) | 1 | **0** | aws doc §1 |

For contrast, `refreshAwsAuth`, `refreshAndGetAwsCredentials`, `withOAuthRefreshLock`,
`oauthRefreshLockOptions`, `waitForRotatedEnvToken` and `calculateApiKeyHelperTTL` are all **1/1** —
those mechanisms are carryover and the delta inside them has to be found by reading, not counting.

---

## 1. `.203` + `.217` — the login-expiry warning, and why 5 became 3

> `.203`: *"Added a warning when your login is about to expire, so you can re-authenticate before
> background sessions are interrupted."*
> `.217`: *"Changed the login-expiry warning to appear 3 days before expiry instead of 5."*

**Verdict: NET_NEW (both bullets land on the same function).** `run /login to renew` **220=2 / 193=0**;
`refreshTokenExpiresAt` **220=8 / 193=0**; `Your login expires in` **220=2 / 193=0**.

`refreshTokenExpiresAt` being **0** in 2.1.193 is the load-bearing measurement: the client did not even
*persist* the refresh-token expiry before this window, so no expiry warning was possible.

### The predicate

```javascript
// ============================================
// getLoginExpiryWarning - "is the stored login within the warning window?"
// Location: cli_inner_pretty.js:687497-687512
// ============================================

// ORIGINAL (for source lookup):
function $xr() {
  if (Hn() !== "firstParty" || !zb()) return null;
  let e = ms();
  if (!e || typeof e.refreshTokenExpiresAt !== "number") return null;
  let t = e.refreshTokenExpiresAt;
  if (typeof e.expiresAt === "number" && e.expiresAt > t + tff) return null;
  let r = t - Date.now();
  if (r > tff || r <= 0) return null;
  return { daysLeft: Math.ceil(r / rff) };
}
var rff = 86400000,
  tff;
var _Da = S(() => {
  Eo();
  ts();
  tff = 3 * rff;
});

// READABLE (for understanding):
function getLoginExpiryWarning() {
  if (getAPIProvider() !== "firstParty" || !isAnthropicAuthEnabled()) return null;   // 1
  const tokens = getClaudeAIOAuthTokens();
  if (!tokens || typeof tokens.refreshTokenExpiresAt !== "number") return null;      // 2
  const refreshExpiry = tokens.refreshTokenExpiresAt;
  if (typeof tokens.expiresAt === "number" && tokens.expiresAt > refreshExpiry + WARN_WINDOW_MS)
    return null;                                                                     // 3
  const remaining = refreshExpiry - Date.now();
  if (remaining > WARN_WINDOW_MS || remaining <= 0) return null;                     // 4
  return { daysLeft: Math.ceil(remaining / ONE_DAY_MS) };
}
const ONE_DAY_MS = 86_400_000;
let WARN_WINDOW_MS;                    // assigned on module init:
WARN_WINDOW_MS = 3 * ONE_DAY_MS;       // 2.1.217 changed this multiplier from 5 to 3

// Mapping: $xr→getLoginExpiryWarning, Hn→getAPIProvider, zb→isAnthropicAuthEnabled,
//          ms→getClaudeAIOAuthTokens, tff→WARN_WINDOW_MS, rff→ONE_DAY_MS
```

**How it works, and why each guard is where it is:**

1. **Provider + auth-mode gate first.** `Hn() !== "firstParty"` short-circuits Bedrock/Vertex/Foundry/
   gateway sessions, which have no `refreshTokenExpiresAt` at all; `zb()`
   (`isAnthropicAuthEnabled`, `:154398-154415`) additionally excludes API-key / `apiKeyHelper` /
   `ANTHROPIC_AUTH_TOKEN` sessions. Both are pure predicate calls, so the common non-OAuth case costs
   two boolean checks and never touches storage.
2. **Missing field is silence, not a warning.** A token minted by an older build has no
   `refreshTokenExpiresAt`; returning `null` means an upgrade does not spray warnings at users whose
   stored credential predates the field.
3. **The `expiresAt` sanity guard (`:687502`) is the subtle one.** `expiresAt` is the *access* token's
   expiry and `refreshTokenExpiresAt` the *refresh* token's. Normally the access token expires long
   before the refresh token. If the recorded access-token expiry is later than the refresh expiry
   **plus the whole warning window**, the two fields disagree so badly that one of them is wrong —
   most plausibly a server-issued long-lived access token (SSO/`setup-token`) paired with a stale
   refresh record. Rather than warn on bad data, it bails. This is a *fail-quiet* guard: the cost of
   a false warning ("your login expires in 2 days" when it does not) is a user running `/login`
   unnecessarily and possibly losing background sessions — exactly what the feature exists to prevent.
4. **`remaining <= 0` also returns null.** An already-expired refresh token is not a *warning*; it is
   handled as an error by the `Login expired · Please run /login` path (§8).
5. `Math.ceil` means the last 24 hours read "1 day", never "0 days".

**Why 5 → 3 (`.217`).** The window is a single multiplier, `tff = 3 * rff` at `:687512`, evaluated
once at module init rather than at each call — so it is a *build* constant, not remotely tunable
(contrast the subagent depth cap, which is gate-backed; see `_GROUND_TRUTH` §2). Three days is the
smallest window that still spans a weekend for a Friday-evening expiry while cutting the number of
sessions that display the banner by roughly 40 %. The trade-off is explicit in the `.203` bullet's own
rationale — the warning exists so *background sessions* are not interrupted — and a background job
that runs daily gets three chances to surface it, which is enough.

### Two surfaces, two thresholds

The warning is rendered twice, and only one of them uses the full 3-day window:

| Surface | Line | Condition | Presentation |
|---|---|---|---|
| Startup/status banner `oauthExpiryBanner` (`cmf`) | `:688292-688318` | any `daysLeft` in the window | `<oT status="warning">Your login expires in N day(s) · run /login to renew` |
| Spinner notice `oauthExpiryWarningNotice` (`Rhm`) | `:815777-815792` | **`e.daysLeft > 1` returns null** — last day only | `priority: "high"`, `timeoutMs: 15000` |

So the escalation is: days 3–2 → a passive banner; day 1 → a high-priority timed notice that
interrupts the spinner. The banner records an impression via `kD("oauth-expiry", x8b)` (`:688294`)
where `x8b` (`:688270-688272`) fires `be("oauth_expiry_warning")`.

---

## 2. `.208` — `apiKeyHelper` failures surface within 3 attempts instead of behind ~10 silent 401s

> *"Fixed `apiKeyHelper` script failures being hidden behind a generic 401 after ~10 silent retries;
> the script's own error is now shown within 3 attempts."*

**Verdict: NET_NEW, and the changelog's two numbers are both literally derivable from the bundle.**

| Anchor | 220 | 193 |
|---|---|---|
| `api_request_api_key_helper_failed` (`:534688`) | 1 | **0** |
| `getApiKeyHelperLastFailure` (`J8r`, `:154228`, `:154676-154679`) | 1 | **0** |
| `Your apiKeyHelper script is failing` (`tey`, `:228958`) | 1 | **0** |
| `apiKeyHelper` (the setting) | 50 | 47 |

### Why the failure was invisible before

```javascript
// ============================================
// runApiKeyHelperAndCache - swallows the helper's error and caches a sentinel key
// Location: cli_inner_pretty.js:154628-154651
// ============================================

// ORIGINAL (for source lookup):
async function $eu(e, t, r) {
  try {
    let n = await fHg(e);
    if (r !== Ber) return n;
    if (n !== null) ((Ude = { value: n, timestamp: Date.now() }), (fXi = null));
    return n;
  } catch (n) {
    if (r !== Ber) return " ";
    let o = n instanceof Error ? n.message : String(n);
    if (
      (console.error(wt.red(`apiKeyHelper failed: ${o}`)),
      w(`Error getting API key from apiKeyHelper: ${o}`, { level: "error" }),
      !t && Ude && Ude.value !== " ")
    )
      return ((Ude = { ...Ude, timestamp: Date.now() }), Ude.value);
    if (((fXi = o), jer())) {
      let i = sN.getInstance();
      (i.startAuthentication(), i.setError(`apiKeyHelper failed: ${o}`), i.endAuthentication(!1));
    }
    return ((Ude = { value: " ", timestamp: Date.now() }), " ");
  } finally {
    if (r === Ber) Xqe = null;
  }
}

// READABLE (for understanding):
async function runApiKeyHelperAndCache(skipTrustCheck, isForegroundLoad, generation) {
  try {
    const key = await execApiKeyHelper(skipTrustCheck);
    if (generation !== cacheGeneration) return key;          // a cache clear raced us: don't publish
    if (key !== null) { cachedKey = { value: key, timestamp: Date.now() }; lastFailure = null; }
    return key;
  } catch (err) {
    if (generation !== cacheGeneration) return SENTINEL_BAD_KEY;
    const msg = err instanceof Error ? err.message : String(err);
    console.error(red(`apiKeyHelper failed: ${msg}`));
    log(`Error getting API key from apiKeyHelper: ${msg}`, { level: "error" });
    // background refresh failed but we still hold a good key -> keep serving it, just bump its clock
    if (!isForegroundLoad && cachedKey && cachedKey.value !== SENTINEL_BAD_KEY) {
      cachedKey = { ...cachedKey, timestamp: Date.now() };
      return cachedKey.value;
    }
    lastFailure = msg;                                        // <- 2.1.208: remember WHY
    if (isApiKeyHelperTheActiveCredential()) {
      const ui = AuthStatusSingleton.getInstance();
      ui.startAuthentication(); ui.setError(`apiKeyHelper failed: ${msg}`); ui.endAuthentication(false);
    }
    cachedKey = { value: SENTINEL_BAD_KEY, timestamp: Date.now() };
    return SENTINEL_BAD_KEY;                                  // a single space
  } finally {
    if (generation === cacheGeneration) inFlight = null;
  }
}

// Mapping: $eu→runApiKeyHelperAndCache, fHg→execApiKeyHelper, Ude→cachedKey, fXi→lastFailure,
//          Ber→cacheGeneration, Xqe→inFlight, jer→isApiKeyHelperTheActiveCredential, " "→SENTINEL_BAD_KEY
```

**The `" "` sentinel is the whole bug.** When the helper fails, the cache stores a **single space** as
the API key. That is deliberate — `null` would make the credential resolver fall through to some other
source, and an empty string would trip "no key configured" paths — but the consequence is that the
client then sends a syntactically valid, semantically garbage `x-api-key` and gets a plain **401** from
the API. Nothing in the 401 says "your helper script exited 1".

The message that *is* useful is built one layer down, in `fHg` (`execApiKeyHelper`, `:154652-154672`):

```javascript
let r = await OO(t, { timeout: 600000, reject: !1 });
if (r.failed) {
  let o = r.timedOut ? "timed out" : `exited ${r.exitCode}`,
    i = r.stderr && ma(r.stderr.trim(), 500);
  throw Error(i ? `${o}: ${i}` : o);
}
let n = r.stdout?.trim();
if (!n) throw Error("did not return a value");
```

— i.e. `exited 1: aws sso session expired` or `timed out`, with stderr truncated to 500 chars. Before
`.208` that string was written to the debug log and thrown away.

### The three-part `.208` fix

**(a) Remember the failure.** `fXi` / `getApiKeyHelperLastFailure` (`J8r`, `:154676-154679`) —
`if (!aN()) return null; return fXi;` — is a null-safe accessor that only reports when an
`apiKeyHelper` is actually configured.

**(b) Stop burning the retry budget.** In the request retry loop:

```javascript
// ============================================
// apiKeyHelper 401 breaker inside the API retry loop
// Location: cli_inner_pretty.js:534687-534690 (constants :534993-534999)
// ============================================

// ORIGINAL (for source lookup):
if (b instanceof hi && b.status === 401 && Dc() && jer() && J8r() !== null) {
  if (f >= WU_) throw (pe("api_request", "api_request_api_key_helper_failed"), new U4(b, o));
  f++;
}

// READABLE (for understanding):
if (err instanceof APIError && err.status === 401
    && isFirstPartyApiSurface() && isApiKeyHelperTheActiveCredential()
    && getApiKeyHelperLastFailure() !== null) {
  if (apiKeyHelper401Count >= API_KEY_HELPER_401_LIMIT)          // API_KEY_HELPER_401_LIMIT = 2
    throw (countError("api_request", "api_request_api_key_helper_failed"), new WrappedAPIError(err, ctx));
  apiKeyHelper401Count++;
}

// Mapping: hi→APIError, Dc→isFirstPartyApiSurface, jer→isApiKeyHelperTheActiveCredential,
//          J8r→getApiKeyHelperLastFailure, f→apiKeyHelper401Count, WU_→API_KEY_HELPER_401_LIMIT (=2),
//          U4→WrappedAPIError, pe→countError
```

**Arithmetic of "within 3 attempts":** `f` starts at 0. 401 #1 → `0 >= 2` false → `f = 1`.
401 #2 → `1 >= 2` false → `f = 2`. 401 #3 → `2 >= 2` **true** → throw. Exactly three attempts.
The old behaviour is equally derivable: with no breaker, the loop ran to the generic budget
`o4_(req)` = `req.maxRetries ?? Pqs()` (`:534968-534970`), and `Pqs()` (`:534953-…`) returns
`$U_ = 10` (`:534989`) when the retry watchdog is off — **"~10 silent retries"**.

Note the **four** conjuncts guarding the breaker. Each removes a false positive:
`status === 401` (not any error), `Dc()` (this is a first-party API surface, so a 401 really is
credential-shaped), `jer()` (the `apiKeyHelper` is the credential actually in use — not merely
configured), and `J8r() !== null` (**the helper has actually failed at least once**). Without the last
one, a legitimately-expired key from a *working* helper would be short-circuited after 3 attempts
instead of being retried through the normal budget while the helper re-mints it.

**(c) Say what happened.** In the API-error → user-message mapper, **before** the generic
401/403 branch at `:228620`:

```javascript
// ORIGINAL (:228589-228591):
if (e instanceof hi && (e.status === 401 || e.status === 403) && Hn() === "firstParty" && jer()) {
  if (J8r()) return _u({ error: "invalid_request", content: tey });
}
```

with `tey` (`:228957-228958`) =
`Your apiKeyHelper script is failing · This usually means you need to re-authenticate with your provider · Run /status to see the script's error output`
(**220=1 / 193=0**). The message deliberately does *not* inline the raw stderr — it points at `/status`,
which renders the helper's own error (`:758737-758760`) alongside `apiKeyHelper is taking a while`
(`:743050`) for the slow case. Keeping multi-line shell stderr out of the inline error message is the
right call for a TUI; the trade-off is one extra command for the user.

---

## 3. `.211` — parallel sessions all logging out after wake-from-sleep

> *"Fixed parallel Claude Code sessions all logging out simultaneously after wake-from-sleep when many
> sessions share one credential store."*

**Verdict: NET_NEW — the richest single fix in this theme.**

| Anchor | 220 | 193 |
|---|---|---|
| `isCompromised` | **7** | **0** |
| `tengu_oauth_token_refresh_lock_compromised_pre_post` (`:155352`) | 1 | 0 |
| `tengu_oauth_token_refresh_lock_compromised_post_post` (`:155367`) | 1 | 0 |
| `tengu_oauth_refresh_compromised_cas_saved` / `…_cas_adopted_sibling` (`:155386`) | 1 / 1 | 0 / 0 |
| `tengu_oauth_token_refresh_lock_compromised_in_catch` (`:155394`) | 1 | 0 |
| `OAuth refresh failed while lock compromised` (`:155393`) | 1 | 0 |
| `oauth_refresh_lock_compromised` (SLO counter) | 2 | 0 |
| `tengu_oauth_token_refresh_race_recovered` | 2 | 1 |

### 3.1 The failure mode, reconstructed from the 193 code

Refreshes are serialised by a `proper-lockfile` lock on the credential directory. The 193 options:

```javascript
// ORIGINAL (:136305-136311 (193)):
function R3r(e) {
  return {
    lockfilePath: M3r.join(e, ".oauth_refresh.lock"),
    realpath: !1,
    stale: 1e4,
    onCompromised: (t) => T(`OAuth refresh lock compromised: ${t.message}`, { level: "error" }),
  };
}
```

and the 193 acquire returned **a bare release function** — no way for the caller to learn anything:

```javascript
// ORIGINAL (:136329-136332 (193)):
  return async () => {
    if (o) await o().catch((s) => (Vo(s) ? T(`OAuth refresh legacy-lock release failed: ${s}`) : ke(s)));
    await t();
  };
```

The vendored `proper-lockfile` (byte-identical in both builds, `:108508-108596`) resolves options as
`update = update == null ? stale / 2 : ...` clamped to `[1000, stale/2]` (`:108572-108573`), and
declares a lock stale when `mtime < Date.now() - stale` (`eIc`, `:108509`). With `stale: 1e4` that is a
**10-second** tolerance and a 5-second heartbeat.

Now suspend the laptop. Timers stop. On wake:

1. Session A's heartbeat is 20 minutes late. Session B (or a fresh process) sees an mtime older than
   10 s, calls the lock **stale**, and steals it.
2. A's heartbeat finally fires, finds `r.mtime.getTime() !== o.mtime.getTime()` (`:108530`) and raises
   `ECOMPROMISED` → `Q3i` → `options.onCompromised(err)` (`:108552-108555`). **In 193 that only logged.**
3. Both A and B now POST the *same* refresh token to the OAuth endpoint. The server rotates refresh
   tokens, so exactly one succeeds; the other gets `invalid_grant`.
4. The loser lands in 193's catch at `:136448-136462 (193)`, which — on `invalid_grant` — **wipes the
   shared credential on disk**:

```javascript
// ORIGINAL (:136452-136456 (193)):
m = await Ql().mutate((g) => {
  let h = g.claudeAiOauth;
  if (!h || h.refreshToken !== c) return g;
  return ((f = !0), { ...g, claudeAiOauth: { ...h, refreshToken: "", accessToken: "", expiresAt: 0 } });
});
```

The `h.refreshToken !== c` compare-and-swap looks protective, but `c` is the token the *loser* read
under its own (now-stolen) lock, and the winner's write may not have landed yet — so the guard passes
and the store is zeroed. Every session sharing that store is logged out at once. That is precisely the
bullet.

### 3.2 The fix, in four layers

**Layer 1 — widen the suspension tolerance and beat faster.**

```javascript
// ============================================
// oauthRefreshLockOptions - proper-lockfile options for the credential refresh lock
// Location: cli_inner_pretty.js:155205-155215
// ============================================

// ORIGINAL (for source lookup):
function gXi(e, t) {
  return {
    lockfilePath: SXi.join(e, ".oauth_refresh.lock"),
    realpath: !1,
    stale: 60000,
    update: 5000,
    onCompromised: (r) => {
      (w(`OAuth refresh lock compromised: ${r.message}`, { level: "error" }), t?.(r));
    },
  };
}

// READABLE (for understanding):
function oauthRefreshLockOptions(credentialDir, onCompromisedCallback) {
  return {
    lockfilePath: path.join(credentialDir, ".oauth_refresh.lock"),
    realpath: false,
    stale: 60_000,   // was 10_000 in 2.1.193 — tolerate a 60 s freeze
    update: 5_000,   // explicit heartbeat; default would now be stale/2 = 30 s
    onCompromised: (err) => {
      log(`OAuth refresh lock compromised: ${err.message}`, { level: "error" });
      onCompromisedCallback?.(err);          // 2.1.220: tell the caller
    },
  };
}

// Mapping: gXi→oauthRefreshLockOptions, SXi→path, w→log
```

`stale` went 10 s → 60 s (6×) and `update` is now **pinned at 5 s** instead of tracking `stale/2`.
The heartbeat-to-stale ratio therefore moved from 2:1 to **12:1**. That matters more than the absolute
numbers: with 2:1 a single missed heartbeat (a GC pause, a busy disk, a `credential_process` spawn) is
already half the budget; with 12:1 you must miss eleven consecutive heartbeats. Why not raise `stale`
further? Because `stale` is also how long a genuinely-crashed process wedges every sibling: 60 s is the
worst-case delay before a dead lock is reclaimed, and a minute is about the limit of what a user will
sit through before killing the process.

**Layer 2 — expose compromise, and hand the caller an abort signal.**

```javascript
// ============================================
// acquireOAuthRefreshLock - dual (new + legacy) lock with compromise reporting
// Location: cli_inner_pretty.js:155216-155245
// ============================================

// ORIGINAL (for source lookup):
async function LXi(e) {
  let t = !1,
    r = new AbortController(),
    n = () => {
      ((t = !0), r.abort());
    },
    o = await fb(e, gXi(e, n)),
    s = `${await K8r.realpath(e).catch(() => e)}.lock`,
    a = null;
  try {
    a = await fb(s, { ...gXi(e, n), lockfilePath: s });
  } catch (l) {
    if (l.code === "ELOCKED")
      throw (
        O("tengu_oauth_refresh_legacy_lock_contended", {}),
        await o().catch((c) => (ti(c) || t ? w(`OAuth refresh new-lock release failed: ${c}`) : xe(c))),
        l
      );
    if (ti(l)) w(`OAuth refresh legacy-lock acquire failed: ${l}`);
    else xe(l);
  }
  return {
    isCompromised: () => t,
    signal: r.signal,
    release: async () => { ... },
  };
}

// READABLE (for understanding):
async function acquireOAuthRefreshLock(credentialDir) {
  let compromised = false;
  const abort = new AbortController();
  const markCompromised = () => { compromised = true; abort.abort(); };   // <- 2.1.220
  const releaseNew    = await lockfile(credentialDir, oauthRefreshLockOptions(credentialDir, markCompromised));
  const legacyPath    = `${await fs.realpath(credentialDir).catch(() => credentialDir)}.lock`;
  let   releaseLegacy = null;
  try {
    releaseLegacy = await lockfile(legacyPath, { ...oauthRefreshLockOptions(credentialDir, markCompromised),
                                                 lockfilePath: legacyPath });
  } catch (e) { /* ELOCKED -> release the new lock and rethrow; otherwise warn and continue */ }
  return { isCompromised: () => compromised, signal: abort.signal, release: async () => { ... } };
}

// Mapping: LXi→acquireOAuthRefreshLock, fb→lockfile, gXi→oauthRefreshLockOptions,
//          K8r→fs/promises, ti→isExpectedLockError, t→compromised, r→abort
```

Two locks are taken — a new-format one on the directory and a legacy one on `<dir>.lock` — so a mixed
fleet of old and new binaries still interlocks. **The `AbortController` is the piece that did not exist
at all in 193**: its `signal` is threaded into the HTTP refresh at `:155360`
(`k$e(d.refreshToken, { scopes: p, clientId: d.clientId, signal: l.signal })`), so losing the lock
*cancels the in-flight token exchange* rather than letting it complete and race.

**Layer 3 — three compromise checkpoints around the network call.**
Inside `refreshOAuthTokenLocked` (`yXi`, `:155297-155430`):

| Checkpoint | Line | Action |
|---|---|---|
| **pre-POST** | `:155350-155355` | `if (l.isCompromised())` → emit `…_lock_compromised_pre_post`, `$e("oauth_token_refresh","oauth_refresh_lock_compromised")`, return `"lock_timeout"`. **Nothing is sent.** |
| **post-POST** | `:155366-155389` | the exchange already succeeded — do a CAS write (below) |
| **in-catch** | `:155392-155399` | the exchange failed *and* we had lost the lock — re-read from disk; if a sibling rotated it, report `"refreshed"`; else return `"lock_timeout"` |

The in-catch checkpoint is the actual "everyone logs out" fix, and it works by **returning early**:
control never reaches the `_st(d) && c` branch at `:155405-155419` that clears the credential on disk.
A compromised lock therefore can no longer trigger the destructive `invalid_grant` handler at all.

**Layer 4 — compare-and-swap adoption of a sibling's token.**

```javascript
// ============================================
// compromisedRefreshCasWrite - persist our new token only if nobody else already rotated it
// Location: cli_inner_pretty.js:155366-155389
// ============================================

// ORIGINAL (for source lookup):
if (l.isCompromised() && f.refreshToken && f.expiresAt) {
  O("tengu_oauth_token_refresh_lock_compromised_post_post", {});
  let m = { accessToken: f.accessToken, refreshToken: f.refreshToken, expiresAt: f.expiresAt,
            refreshTokenExpiresAt: f.refreshTokenExpiresAt, scopes: f.scopes,
            subscriptionType: f.subscriptionType, rateLimitTier: f.rateLimitTier, clientId: f.clientId },
    g = !1;
  return (
    await zs().mutate((y) => {
      let _ = y.claudeAiOauth?.refreshToken;
      if (_ && _ !== c) return ((g = !0), y);
      return { ...y, claudeAiOauth: rtu(y.claudeAiOauth, m) };
    }),
    EW(),
    O(g ? "tengu_oauth_refresh_compromised_cas_adopted_sibling" : "tengu_oauth_refresh_compromised_cas_saved", {}),
    "refreshed"
  );
}

// READABLE (for understanding):
if (lock.isCompromised() && fresh.refreshToken && fresh.expiresAt) {
  emit("tengu_oauth_token_refresh_lock_compromised_post_post");
  const ours = { ...fresh };
  let adoptedSibling = false;
  await credentialStore().mutate((stored) => {
    const onDisk = stored.claudeAiOauth?.refreshToken;
    if (onDisk && onDisk !== refreshTokenWeStartedWith) {   // someone else already rotated
      adoptedSibling = true;
      return stored;                                        // KEEP THEIRS, discard ours
    }
    return { ...stored, claudeAiOauth: mergeOAuthRecord(stored.claudeAiOauth, ours) };
  });
  clearOAuthTokenCache();
  emit(adoptedSibling ? "tengu_oauth_refresh_compromised_cas_adopted_sibling"
                      : "tengu_oauth_refresh_compromised_cas_saved");
  return "refreshed";
}

// Mapping: zs→credentialStore, rtu→mergeOAuthRecord, EW→clearOAuthTokenCache, c→refreshTokenWeStartedWith
```

**Why this is the right shape.** The compromised session has a *valid, freshly minted* token pair in
memory. Three options were available: (a) write it unconditionally — that is 193's behaviour and it
clobbers the winner; (b) discard it and re-enter the queue — correct but costs another round trip and
may itself race; (c) **CAS**: write only if the store still holds the token we started from. (c) is
strictly better than both — it is a single atomic `mutate`, it never destroys a newer credential, and
in the "we lost" case the session simply adopts the sibling's token (`EW()` clears the in-process
cache, so the very next read picks up the winner's value). The telemetry split between
`…_cas_saved` and `…_cas_adopted_sibling` exists precisely so the two arms can be measured separately
in production — the ratio tells Anthropic how often wake-from-sleep actually produces a double refresh.

Adjacent, same function, worth naming because two other bullets land on it:

- `:155363` `tengu_oauth_refresh_invalid_scope_fallback` (**220=1 / 193=0**) — if the widened
  `[...trt, ...YBr(d.scopes)]` scope request is rejected, retry with the token's *original* scopes.
  This is `.216`'s *"Claude-in-Chrome 403-looping on reconnect when the session's OAuth token lacks a
  required scope"*; it is owned by `56_chrome_ide` but the mechanism is here.
- `:155305` / `:155420` the known-dead refresh-token set `_no` (`:156130`), which feeds §8.

---

## 4. `.212` — Enterprise `forceLoginMethod` enforced beyond the terminal

> *"Changed Enterprise `forceLoginMethod` to be enforced for VS Code extension, SDK, `setup-token`,
> and `install-github-app` logins, not just the terminal."*

**Verdict: DELTA — the setting is carryover (`forceLoginMethod` 220=18 / 193=13), the enforcement
points are new.** The clean net-new anchor is `force_login_method_refused` (**220=2 / 193=0**).

### The extracted predicate

2.1.193 had no shared validator: the policy was re-implemented inline in the two places that cared
(`:354060-354066 (193)` for `claude auth login`, `:369274-369276 (193)` inside the login component).
2.1.220 factors it into two exported functions:

```javascript
// ============================================
// getForcedLoginMethod / validateForceLoginMethod - the org login-method pin
// Location: cli_inner_pretty.js:155947-155974
// ============================================

// ORIGINAL (for source lookup):
function Uer() {
  if (T7t(QWe()) && Pr("policySettings")?.forceLoginMethod === "gateway") return "gateway";
  let e = eo()?.forceLoginMethod;
  return e === "gateway" ? void 0 : e;
}
function vst(e) {
  if (Z.CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST) {
    if (Uer() !== void 0) $e("auth_force_login_org", "managed_by_host_under_method_pin");
    return { valid: !0 };
  }
  let t = Uer();
  if (t === void 0) return { valid: !0 };
  if (t === "gateway")
    return { valid: !1,
      message: "forceLoginMethod is 'gateway' in managed settings; run /login from an interactive terminal to authenticate." };
  if (e === (t === "claudeai")) return { valid: !0 };
  let r = Que("forceLoginMethod") === "policySettings" ? "managed settings" : "settings";
  return { valid: !1,
    message: t === "claudeai"
      ? `forceLoginMethod is 'claudeai' in ${r}; log in with a Claude.ai subscription account instead.`
      : `forceLoginMethod is 'console' in ${r}; log in with an Anthropic Console account instead.` };
}

// READABLE (for understanding):
function getForcedLoginMethod() {
  // 'gateway' is only honoured from *managed* settings on a gateway-capable install
  if (isGatewayCapable(getInstallInfo()) && readSettings("policySettings")?.forceLoginMethod === "gateway")
    return "gateway";
  const method = effectiveSettings()?.forceLoginMethod;
  return method === "gateway" ? undefined : method;   // a non-managed 'gateway' pin is ignored
}
function validateForceLoginMethod(attemptingClaudeAiLogin) {
  if (env.CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST) {                  // host owns the credential
    if (getForcedLoginMethod() !== undefined)
      countError("auth_force_login_org", "managed_by_host_under_method_pin");   // observe, don't block
    return { valid: true };
  }
  const pinned = getForcedLoginMethod();
  if (pinned === undefined) return { valid: true };
  if (pinned === "gateway") return { valid: false, message: "...run /login from an interactive terminal..." };
  if (attemptingClaudeAiLogin === (pinned === "claudeai")) return { valid: true };
  const where = settingSource("forceLoginMethod") === "policySettings" ? "managed settings" : "settings";
  return { valid: false, message: pinned === "claudeai" ? `...'claudeai' in ${where}...` : `...'console' in ${where}...` };
}

// Mapping: Uer→getForcedLoginMethod, vst→validateForceLoginMethod, T7t→isGatewayCapable,
//          QWe→getInstallInfo, Pr→readSettings, eo→effectiveSettings, Que→settingSource, $e→countError
```

**Three design decisions worth naming.**

1. **`gateway` is managed-settings-only.** `Uer()` returns `"gateway"` *only* from `policySettings`
   and *erases* a `"gateway"` value coming from any lower-precedence source (`e === "gateway" ? void 0 : e`).
   A `gateway` pin redirects the entire login to an operator-chosen URL, so allowing a repo-committed
   or user-level setting to assert it would be a redirection primitive. Downgrading to "no pin" rather
   than erroring keeps a mis-scoped setting from bricking login.
2. **Host-managed sessions are exempt but *counted*.** `:155953-155956` returns valid while emitting
   `managed_by_host_under_method_pin`. An org that pins `forceLoginMethod` and also ships host-managed
   credentials has a policy conflict; blocking would strand the user, so the code records the
   condition for the operator to see. Same pattern as `jde` (`validateForceLoginOrg`, `:155849-155864`)
   which has three analogous SLO counters for `ANTHROPIC_UNIX_SOCKET`.
3. **The message names the source.** `Que("forceLoginMethod") === "policySettings" ? "managed settings" : "settings"`
   — the user is told whether to argue with IT or edit their own file.

### The four new enforcement sites

| Entry point | Line | Refusal |
|---|---|---|
| `setup-token` command (`nsb`, after `tengu_setup_token_command`) | `:585189-585196` | prints the message + *"setup-token creates a long-lived Claude.ai subscription token, which this policy does not permit."*, `hu("cli_setup_token","force_login_method_refused")`, exit 1 |
| SDK / VS Code `claude_authenticate` control request | `:848455-848458` | `pe("sdk_claude_authenticate","force_login_method_refused")` then rejects the control request |
| `/install-github-app` OAuth step (`Qei`) | `:699972-699979` | sets the wizard to `state: "error"` with *"…use an API key instead."* |
| `claude auth login` gateway pin (`x_E`) | `:864331-864335` | stderr + `process.exit(1)` |

The SDK site is the important one: in 2.1.193 `claude_authenticate` (`:707726 (193)`) went straight to
`startOAuthFlow` with **no** policy check, so an Enterprise `forceLoginMethod: "console"` could be
bypassed simply by driving login through the VS Code extension or the Agent SDK instead of the
terminal. All four sites call the *same* `vst(...)` with an explicit `loginWithClaudeAi` boolean, which
is why the fix is four call sites and one function rather than four re-implementations.

`validateForceLoginOrg` (`jde`) is separately called at **eight** sites (`:584212`, `:848479`,
`:850698`, `:850754`, `:864353`, `:864406`, `:867963`) — org-UUID pinning was already broadly enforced;
it is the *method* pin that was terminal-only.

---

## 5. `.214` — feature flags going stale after the OAuth token rotates

> *"Fixed feature flags going stale in long-running sessions after the OAuth token rotates."*
> (The scoping table files this under the `.211`–`.214` range; the bullet is in the **2.1.214**
> section of `CHANGELOG.md`, line 178.)

**Verdict: NET_NEW.** `tengu_gb_eval_authed_enable` (`:156378`) **220=1 / 193=0**;
`installEvalAuthedOverride` **220=1 / 193=0**; `eval-authed` **220=3 / 193=0**.
`refreshGrowthBookAfterAuthChange` is **1/1** — the tear-down helper existed; nothing called it on a
token rotation.

### The before-picture is three lines long

```javascript
// ORIGINAL (:147414-147426 (193)) - refreshGrowthBookFeatures:
async function awn() {
  if (!mG()) return;
  try {
    let e = await wR();
    if (!e) return;
    if ((await e.refreshFeatures({ skipCache: !0 }), e !== Khe)) return;
    let t = await mxi(e);
    if (e !== Khe) return;
    if (t) (gxi(), ert.emit());
  } catch (e) { ke(eo(e)); }
}
```

The GrowthBook client is constructed **once** (`:156844-156852`) with
`apiHostRequestHeaders: o.headers` — a snapshot of the `Authorization` header at init time
(`KXi = i ? o.headers.Authorization : void 0`, `:156841`). `refreshFeatures()` reuses that client, so
after the OAuth access token rotates, every periodic refresh replays a **dead bearer token**. The
refresh silently fails or returns defaults, and the session's flags freeze at their startup values for
the rest of its life. With the refresh interval at `cIg()` = `21600000` ms = **6 hours**
(`:156726-156728`), only genuinely long-running sessions (background agents, daemons) ever hit it —
which is exactly the population the bullet names.

### The fix

```javascript
// ============================================
// refreshGrowthBookFeatures - now detects an auth rotation and re-inits the client
// Location: cli_inner_pretty.js:156733-156758
// ============================================

// ORIGINAL (for source lookup):
async function Nno() {
  if (!sie()) return;
  try {
    if (Pno) {
      let { checkAndRefreshOAuthTokenIfNeeded: r } = await Promise.resolve().then(() => (Eo(), kY));
      await r().catch((i) => {});
      let n = q8(),
        o = n.error ? void 0 : n.headers.Authorization;
      if (o !== void 0 && o !== KXi) {
        let i = xt().oauthAccount,
          s = i?.accountUuid === YXi && i?.organizationUuid === XXi;
        if (!s) L1e();
        vxe({ preserveLoggedExposures: s });
        return;
      }
    }
    let e = await lN();
    ...
  } catch (e) { xe(_n(e)); }
}

// READABLE (for understanding):
async function refreshGrowthBookFeatures() {
  if (!isGrowthBookEnabled()) return;
  try {
    if (clientWasInitializedWithAuth) {                                    // 1
      const { checkAndRefreshOAuthTokenIfNeeded } = await import(authModule);
      await checkAndRefreshOAuthTokenIfNeeded().catch(() => {});           // 2
      const hdrs = buildAuthHeaders();
      const current = hdrs.error ? undefined : hdrs.headers.Authorization;
      if (current !== undefined && current !== authHeaderAtInit) {         // 3
        const acct = readConfig().oauthAccount;
        const sameIdentity = acct?.accountUuid === accountUuidAtInit
                          && acct?.organizationUuid === orgUuidAtInit;     // 4
        if (!sameIdentity) clearModelAccessCaches();
        refreshGrowthBookAfterAuthChange({ preserveLoggedExposures: sameIdentity });   // 5
        return;
      }
    }
    const client = await initializeGrowthBook();                           // 6 unchanged slow path
    ...
  } catch (e) { report(normalize(e)); }
}

// Mapping: Nno→refreshGrowthBookFeatures, sie→isGrowthBookEnabled, Pno→clientWasInitializedWithAuth,
//          q8→buildAuthHeaders, KXi→authHeaderAtInit, YXi→accountUuidAtInit, XXi→orgUuidAtInit,
//          vxe→refreshGrowthBookAfterAuthChange, L1e→clearModelAccessCaches, lN→initializeGrowthBook
```

**Ordering is the whole design:**

1. `Pno` gates the new block to clients that were built *with* auth headers. A logged-out or
   third-party session never had a bearer token, so its flags cannot go stale this way, and it keeps
   the cheap `refreshFeatures()` path.
2. **Refresh the OAuth token *first*, then read the header.** If you read first you may compare a
   token that is about to be rotated and conclude "unchanged", then perform the refresh with a header
   that expires seconds later. `.catch(() => {})` is deliberate: a failed refresh must not abort the
   flag refresh, it just means the comparison uses the old header and the slow path runs.
3. The comparison is on the whole `Authorization` header string, not on an expiry timestamp. That
   catches every reason the credential could differ — rotation, `/login`, account switch, a change of
   credential source — with one `!==`.
4. **`sameIdentity` decides how much to throw away.** A plain rotation keeps the same account/org, so
   the *logged exposures* set is preserved and experiment-exposure telemetry is not double-counted.
   An account or org change invalidates both the exposures and the model-access caches (`L1e()`),
   because entitlements are per-org.
5. `vxe()` (`refreshGrowthBookAfterAuthChange`, `:156695-156708`) does a full `Qer()` reset —
   destroys the client, clears the feature map, the memoised gate map and `lN.cache` — and re-runs
   `initializeGrowthBook()`, which rebuilds `apiHostRequestHeaders` from the *current* credential.
   A `refreshFeatures()` could not have fixed this, because the stale header lives on the client
   instance, not on the request.

The sibling `installEvalAuthedOverride` (`Ltu`, `:156372-156399`), installed at init (`:156843`),
monkey-patches GrowthBook's `fetchRemoteEvalCall` so that — **when the gate
`tengu_gb_eval_authed_enable` is on, default `false`** — each remote evaluation first
`await Dy()` (refresh the OAuth token if needed), attaches fresh headers, and POSTs to
`${host}/api/eval-authed/${clientKey}` instead of `/api/eval`, falling back to the original call on any
non-ok response or throw. Two independent fallbacks (`if (!a.ok) … return e(t)` / `catch { … return e(t) }`)
mean the authenticated endpoint can be turned on server-side with no risk of breaking flag delivery.

---

## 6. `.206` — gateway `/login` for Anthropic-operated public endpoints

> *"Gateway: `/login` now supports Anthropic-operated public gateway endpoints."*

**Verdict: NET_NEW.** The scoping anchored `tengu_oauth_gateway_forced` (`:584098`, 220=1/193=0), which
is only the telemetry. The mechanism is a **one-line allow-list bypass of the private-network
requirement**, and the requirement itself is also new in this window.

```
Cloud gateway            220=16 / 193=12     (gateway login existed)
is not on a private network            220=1 / 193=0
Gateway login would go through proxy   220=1 / 193=0
Could not resolve the configured HTTP proxy  220=1 / 193=0
Gateway URL must use https             220=1 / 193=0
palantirfedstart                       220=1 / 193=0
claude.fedstart.com                    220=2 / 193=1   (193's single hit is a URL constant at :36581 (193))
```

`assertGatewayHostIsReachablePrivately` (`Leu`, `:153957-154012`), called from the gateway-setup step
of the login component at `:582198`, enforces that a gateway host resolves **only** to private
addresses:

```javascript
// ============================================
// assertGatewayHostIsReachablePrivately - the /login gateway pre-flight
// Location: cli_inner_pretty.js:153957-153963 (the carve-out) + :153996-154011 (the refusal)
// ============================================

// ORIGINAL (for source lookup):
async function Leu(e) {
  let t = new URL(e),
    r = t.hostname.replace(/^\[|\]$/g, ""),
    n = Yqe.isIPv4(r) || Yqe.isIPv6(r);
  if (t.protocol === "https:" && aHg.has(r)) return;
  let o = xXt();
  ...
  let s = i.find((a) => !dno(a));
  if (s !== void 0) { ... throw new Lr(`Gateway hosts must be on your organization's private network; ${r} resolves to the public (or unrecognized) address ${s}. ` + ..., "gateway login: gateway host resolves to a public address"); }
}
// with, at :154113:
aHg = new Set(["claude.fedstart.com", "claude.palantirfedstart.com"]);

// READABLE (for understanding):
async function assertGatewayHostIsReachablePrivately(gatewayUrl) {
  const url = new URL(gatewayUrl);
  const host = url.hostname.replace(/^\[|\]$/g, "");
  const hostIsLiteralIp = net.isIPv4(host) || net.isIPv6(host);

  // 2.1.206: Anthropic-operated public gateways are exempt from the private-network rule
  if (url.protocol === "https:" && ANTHROPIC_PUBLIC_GATEWAY_HOSTS.has(host)) return;

  // ... proxy must itself be private ... then resolve the host and require every address private
  const publicAddr = addresses.find((a) => !isPrivateAddress(a));
  if (publicAddr !== undefined) throw new UserFacingError(...);
}
const ANTHROPIC_PUBLIC_GATEWAY_HOSTS = new Set(["claude.fedstart.com", "claude.palantirfedstart.com"]);

// Mapping: Leu→assertGatewayHostIsReachablePrivately, aHg→ANTHROPIC_PUBLIC_GATEWAY_HOSTS,
//          dno→isPrivateAddress, xXt→getProxyUrl, Yqe→net, Lr→UserFacingError
```

**Why a private-network rule existed in the first place.** A cloud gateway terminates Claude Code's
credential: whoever controls the gateway URL sees the bearer token and every prompt. Requiring the
host to resolve to RFC1918 / CGNAT / link-local space (`dno`, `:153937-153956`, covers `10/8`,
`172.16/12`, `192.168/16`, `127/8`, `169.254/16`, `100.64/10`, `::1`, `fc00::/7`, `fe80::/10`, and
IPv4-mapped IPv6) means a typo or a hostile `.mcp.json`-style config cannot silently point login at an
attacker-controlled host on the public internet. The proxy is checked with the same predicate
(`:153977-153983`) so the requirement cannot be laundered through `HTTPS_PROXY`.

**Why the carve-out is a hostname allow-list and not a flag.** The two exempt hosts are
Anthropic-operated FedRAMP-boundary gateways; they are legitimately public. A boolean
("allow public gateways") would let any operator disable the check. A hardcoded two-entry `Set`,
additionally requiring `https:`, makes the exemption non-transferable. Note the ordering: the
carve-out is the **first** statement, before the proxy check — so a FedStart user behind a public
corporate proxy is not blocked by the "proxy must be private" rule either.

**Three more guards in the same login path, all 220-only**, worth listing because together they are
the real `.206` shape:

- `mno` (`normalizeGatewayUrl`, `:153926-153936`) — prefixes `https://`, strips a trailing slash, and
  refuses `http://` unless the host is in `sHg = new Set(["localhost","127.0.0.1","[::1]"])` (`:154112`).
- `B8r` (`probeGatewayTlsFingerprint`, `:154013-154045`) — opens a raw TLS socket and returns
  `fingerprint256`, lower-cased with colons stripped; `http:` yields the sentinel `"http-loopback"`.
- `AXi` (`restoreGatewayAuth`, `:154341-154397`) — on every start, re-probes the pinned host and
  refuses to restore if the fingerprint moved:
  `Cloud gateway ${r} TLS certificate changed since you connected — run /login to verify and reconnect.`
  A probe *failure* (`:154391`) only warns and proceeds — availability beats strictness for a check
  whose failure mode is usually a captive network.
  `gateway TLS certificate does not match the pinned fingerprint` is **220=1 / 193=0**;
  `gatewayTrust` (the on-disk pin map) is **220=3 / 193=1**.

`CLAUDE_CODE_USE_GATEWAY` deserves its own note: **220=8 / 193=2**, and both 193 hits are
*allow-list membership only* (`:192886 (193)`, `:193027 (193)`) — there was no accessor and no consumer.
2.1.220 adds the typed accessor (`:32928`) and a real handler in `AXi` (`:154342-154358`) that mints an
unpinned gateway session from `ANTHROPIC_BASE_URL` + `ANTHROPIC_AUTH_TOKEN`, decoding the JWT's `exp`
for the session expiry and warning-and-ignoring if either half is missing. See
[`aws_and_provider_plumbing.md`](aws_and_provider_plumbing.md) §8.

---

## 7. `.202` — the sign-in URL is now a single hyperlink

> *"Fixed the sign-in URL printed by `claude auth login` and `claude mcp login --no-browser` not being
> reliably clickable when it wraps over SSH — it is now emitted as a single hyperlink."*

**Verdict: DELTA, and larger than the bullet.** `assumeSupport` **220=13 / 193=3** — and in 2.1.193
both non-declaration hits pass `assumeSupport: !1` (`:393230 (193)`, `:633169 (193)`). Every
`assumeSupport: !0` in the tree is new.

### The predicate change

```javascript
// ============================================
// formatHyperlink - OSC-8 emitter, now with an assume-support escape hatch
// Location: cli_inner_pretty.js:556647-556663   (was :244513-244525 (193))
// ============================================

// ORIGINAL (2.1.193, for source lookup) - :244513-244522 (193):
function wD(e, t, n) {
  if (!(n?.supportsHyperlinks ?? WC())) {
    if (t !== void 0) {
      let c = Hl(t);
      if (c !== e && e !== `http://${c}` && e !== `https://${c}`) return `${t} (${e})`;
    }
    return e;
  }
  let l = ((n?.themeName ? LRi(n.themeName) : !1) ? Et.blue : Et.blueBright)(t ?? e);
  return `${Eta}${e}${Hta}${l}${Eta}${Hta}`;
}

// ORIGINAL (2.1.220, for source lookup) - :556647-556660:
function QN(e, t, r) {
  let n = t === void 0 ? void 0 : xi(t),
    o = n === void 0 || n === e || e === `http://${n}` || e === `https://${n}`;
  if (
    !(
      (o && (r?.assumeSupport ?? !1) && process.stdout.isTTY === !0 && (out() ?? !0)) ||
      (r?.supportsHyperlinks ?? mk())
    )
  ) {
    if (t !== void 0 && !o) return `${t} (${e})`;
    return e;
  }
  let u = ((r?.themeName ? npo(r.themeName) : !1) ? wt.blue : wt.blueBright)(t ?? e);
  return `${ygp}${e}${_gp}${u}${ygp}${_gp}`;
}

// READABLE (for understanding):
function formatHyperlink(url, label, opts) {
  const labelHost   = label === undefined ? undefined : hostOf(label);
  const labelIsSafe = labelHost === undefined || labelHost === url
                   || url === `http://${labelHost}` || url === `https://${labelHost}`;
  const emit =
       (labelIsSafe && (opts?.assumeSupport ?? false)
                    && process.stdout.isTTY === true
                    && (explicitHyperlinkPreference() ?? true))     // undefined => assume YES
    || (opts?.supportsHyperlinks ?? detectHyperlinkSupport());
  if (!emit) return (label !== undefined && !labelIsSafe) ? `${label} (${url})` : url;
  const text = (opts?.themeName && isDarkTheme(opts.themeName) ? blue : blueBright)(label ?? url);
  return `${OSC8}${url}${BEL}${text}${OSC8}${BEL}`;
}
const OSC8 = "\x1B]8;;", BEL = "\x07";

// Mapping: wD (193)/QN (220)→formatHyperlink, xi→hostOf, out→explicitHyperlinkPreference,
//          mk→detectHyperlinkSupport, ygp→OSC8, _gp→BEL
```

**How the new disjunct works, term by term:**

1. `labelIsSafe` (`o`) — the hyperlink is only *assumed* when the visible text is absent or is the URL's
   own host. This preserves the anti-spoofing property: a hyperlink whose label says one thing and
   whose target says another is never emitted on a guess, only when support is positively detected.
2. `assumeSupport` — opt-in per call site.
3. `process.stdout.isTTY === true` — never emit escape sequences into a pipe or file.
4. `out() ?? !0` — `out()` (`explicitHyperlinkPreference`, `:259584-259590`) returns the **explicit**
   preference only: a `hyperlinks` value from the resolved config, or, if `FORCE_HYPERLINK` is present
   in the environment, the `supports-hyperlinks` verdict. Otherwise it returns `undefined`. The
   `?? !0` therefore reads: *"unless the user or the environment has said no, assume yes."*

Contrast the negative path, `mk()` (`detectHyperlinkSupport`, `:259591-259611`): it enumerates known
terminals (`ghostty`, `Hyper`, `kitty`, `alacritty`, `iTerm.app`, `iTerm2`, JediTerm, Windows Terminal,
tmux ≥ 3.4, `TERM` containing `kitty`) and otherwise returns `false`. **Over SSH none of those
variables survive** — `TERM_PROGRAM` and `LC_TERMINAL` are not forwarded by default — so `mk()` says
"no", the URL is printed raw, and the terminal hard-wraps it at the column boundary. Most terminals'
URL auto-detection then only linkifies the first physical line, which is exactly the reported symptom.
Emitting OSC-8 makes the whole URL one click target regardless of wrapping; the cost when the terminal
does *not* support OSC-8 is a few invisible bytes, which is why "assume yes" is the correct default
here and "detect" remains the default everywhere else.

### The three call sites

| Command | 2.1.193 | 2.1.220 |
|---|---|---|
| `claude auth login` browser fallback | `wD(h)` — no options → detect (`:354127 (193)`) | `QN(g, void 0, { assumeSupport: !0 })` `:864399` |
| `claude mcp login [--no-browser]` (`HIp`) | `wD(t)` — detect (`:613316 (193)`) | `QN(t, void 0, { assumeSupport: !0 })` `:585456` |
| `claude mcp xaa login` | **raw `${s}`** — not even a hyperlink attempt (`:609914 (193)`) | `QN(i, void 0, { assumeSupport: !0 })` `:556755` |

The interactive `/login` component got the same treatment at `:584278`, and eight UI `<Lo>` link
components (`:646371`, `:674700`, `:700140`, `:703868`, `:703943`, `:704350`, `:751684`) flipped from
the 193 default of `assumeSupport: !1` to `!0`. So the bullet names two commands; the change is a
tree-wide policy flip on "URLs the user is expected to click".

---

## 8. `.206` — an expired login failing every model with a misleading model error

> *"Fixed an expired login failing every model with a misleading `There's an issue with the selected
> model` error instead of prompting to run `/login`."*

**Verdict: the message is CARRYOVER; the fix is a new fail-fast throw upstream.**

`_GROUND_TRUTH` and the `.206`–`.210` scoping both record `There's an issue with the selected model`
as **220=1 / 193=1** and stop there. I read both sites and can add two things.

**First, the branch ordering was already correct in 193**, so "the 401 branch was after the 404 branch"
is *not* the explanation. In 2.1.220 the 401/403 handler is at `:228620` and the 404 model handler at
`:228668`; in 2.1.193 they are at `:237671` and `:237689` — same relative order, 401 first. Anyone
looking for an ordering swap will not find one.

**Second, the actual delta is a new error class thrown before the request is ever made.**

| Anchor | 220 | 193 |
|---|---|---|
| `Login expired` (`eey`, `:228953`) | **1** | **0** |
| `OAuth session expired and could not be refreshed` (`:228604`) | **1** | **0** |
| `OAuthRefreshDeadError` class (`WQt`, `:121405-121410`) | 3 | 2 |
| `isOAuthRefreshKnownDead` (`ast`, `:155039-…`) | 1 | 1 (carryover predicate) |

```javascript
// ORIGINAL (:121405-121410) - the class:
WQt = class WQt extends Error {
  constructor() {
    super("OAuth refresh token is no longer valid; run /login to re-authenticate");
    this.name = "OAuthRefreshDeadError";
  }
};

// ORIGINAL (:149714) - thrown inside the first-party client factory:
if (!b && !m && !Uqe(p).value && ast()) throw new WQt();

// ORIGINAL (:228601-228605) - mapped to a user message:
if (e instanceof WQt)
  return _u({
    error: "authentication_failed",
    content: yn() ? "Failed to authenticate: OAuth session expired and could not be refreshed" : eey,
  });
// eey = "Login expired \xB7 Please run /login"   (:228953)
```

`ast()` (`isOAuthRefreshKnownDead`) is true when the stored refresh token is `""` or is a member of the
process-local dead set `_no` (`:156130`), which is populated at `:155406` when a refresh returns
`invalid_grant`. So: once any refresh has definitively failed, **the client is never constructed
again** — `buildAnthropicClient` throws `OAuthRefreshDeadError`, which maps to
`Login expired · Please run /login` (or a print-mode variant). Previously the client *was* built with
a dead credential, the request 401'd, and — because the 401 arrived on a per-model request — the user
experienced it as "every model is broken", which is the phrasing the bullet uses.

The guard's three preconditions (`!b` no API key, `!m` no OAuth token object, `!Uqe(p).value` no
caller-supplied `Authorization` header) ensure the throw only fires when the dead refresh token really
is the *only* credential; any other working credential wins.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this module are staged in
> [symbol_additions_v2_1_220_auth_providers.md](../00_overview/symbol_additions_v2_1_220_auth_providers.md).

Key functions and data in this document:
- auth-module export table (`kY`, `:154127-154262`) — 135 readable names for the auth surface
- `getLoginExpiryWarning` (`$xr`, `:687497-687506`) with `WARN_WINDOW_MS` (`tff = 3 * rff`, `:687512`)
- `oauthExpiryBanner` (`cmf`, `:688292-688318`) / `oauthExpiryWarningNotice` (`Rhm`, `:815777-815792`)
- `runApiKeyHelperAndCache` (`$eu`, `:154628-154651`) / `execApiKeyHelper` (`fHg`, `:154652-154672`)
- `getApiKeyHelperLastFailure` (`J8r`, `:154676-154679`) / `getApiKeyFromApiKeyHelper` (`_er`, `:154617-154627`)
- `API_KEY_HELPER_401_LIMIT` (`WU_ = 2`, `:534999`) and its breaker (`:534687-534690`)
- `apiKeyHelperFailingMessage` (`tey`, `:228957-228958`)
- `oauthRefreshLockOptions` (`gXi`, `:155205-155215`) / `acquireOAuthRefreshLock` (`LXi`, `:155216-155245`)
- `refreshOAuthTokenLocked` (`yXi`, `:155297-155430`) — the three compromise checkpoints + CAS write
- `withOAuthRefreshLock` (`DXi`, `:155246-155278`) / `saveOAuthTokensIfNeeded` (`Ver`, `:155005-…`)
- `mergeOAuthRecord` (`rtu`, `:154993-155004`) / `clearOAuthTokenCache` (`EW`, `:155056`)
- `getForcedLoginMethod` (`Uer`, `:155947-155951`) / `validateForceLoginMethod` (`vst`, `:155952-155974`)
- `validateForceLoginOrg` (`jde`, `:155849-155946`)
- `refreshGrowthBookFeatures` (`Nno`, `:156733-156758`) / `refreshGrowthBookAfterAuthChange` (`vxe`, `:156695-156708`)
- `installEvalAuthedOverride` (`Ltu`, `:156372-156399`) — gate `tengu_gb_eval_authed_enable` (`:156378`)
- `assertGatewayHostIsReachablePrivately` (`Leu`, `:153957-154012`) / `isPrivateAddress` (`dno`, `:153937-153956`)
- `ANTHROPIC_PUBLIC_GATEWAY_HOSTS` (`aHg`, `:154113`) / `GATEWAY_LOOPBACK_HOSTS` (`sHg`, `:154112`)
- `normalizeGatewayUrl` (`mno`, `:153926-153936`) / `probeGatewayTlsFingerprint` (`B8r`, `:154013-154045`)
- `restoreGatewayAuth` (`AXi`, `:154341-154397`)
- `formatHyperlink` (`QN`, `:556647-556663`) / `explicitHyperlinkPreference` (`out`, `:259584-259590`) /
  `detectHyperlinkSupport` (`mk`, `:259591-259611`)
- `OAuthRefreshDeadError` (`WQt`, `:121405-121410`) / `isOAuthRefreshKnownDead` (`ast`, `:155039-…`)
- `LOGIN_EXPIRED_MESSAGE` (`eey`, `:228953`)
