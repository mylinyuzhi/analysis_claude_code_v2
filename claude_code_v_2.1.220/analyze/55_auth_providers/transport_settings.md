# Transport settings: mTLS, CA bundles, proxies, and connection pooling (v2.1.193 → v2.1.220)

> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
> (`VERSION 2.1.220`, build `4073f595`). BASELINE:
> `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`.
> Every `cli_inner_pretty.js:<line>` is a **220** line unless tagged **(193)**.
> Conventions: [`../_CONVENTIONS.md`](../_CONVENTIONS.md). Ledger: [`README.md`](README.md).

Four bullets, one subsystem. Two of them (`.212`, `.217`) are the same branch seen from two sides;
one (`.202`) is a module rewrite; one (`.214`) is a **carryover mechanism with a three-element set
change** — and calling that out is the finding, not a disappointment.

---

## 1. `.212` + `.217` — settings-sourced transport configuration under a host-managed credential

> `.212`: *"Fixed hosted (host-managed) sessions failing at startup when repository settings configured
> mTLS certs, extra CA bundles, or OAuth scopes; these transport settings are now ignored with a
> warning."*
> `.217`: *"Fixed corporate mTLS, TLS-verify, OAuth scope, and proxy settings being ignored in Claude
> Desktop sessions."*

**Verdict: both NET_NEW, and they are the same `if` statement — `.212` added it, `.217` narrowed it.**

| Anchor | 220 | 193 |
|---|---|---|
| `host-managed` | **6** | **0** |
| `CA certs: skipping settings-sourced NODE_EXTRA_CA_CERTS under host-managed provider` (`:825529`) | 1 | **0** |
| `repo-committed settings can't re-point the TLS/proxy channel` (`:267715`) | 1 | **0** |
| `this session's provider routing is managed by the host` (`:267716`) | 1 | **0** |
| `host-auth-callback marker` | 1 | **0** |
| `NODE_TLS_REJECT_UNAUTHORIZED` | **2** | **0** |
| `CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST` | 34 | 14 |
| `desktopHost` | 6 | 4 |
| `managedByHostFlag` | 4 | 4 |

`managedByHostFlag` at 4/4 says the host-managed *state* existed; `host-managed` at 6/0 and the two
warning strings at 1/0 say the *transport* policy is new.

### 1.1 The set being policed

Two hand-maintained sets and two one-line predicates carry the whole policy:

```javascript
// ============================================
// isHostManagedTransportSetting / isProxySetting - which env vars a host-managed session may not re-point
// Location: cli_inner_pretty.js:57813-57818 (predicates), :57971-57979 (the sets)
// ============================================

// ORIGINAL (for source lookup):
function N5n(e) {
  return tHh.has(e.toUpperCase());
}
function t7t(e) {
  return rHh.has(e.toUpperCase());
}
...
  tHh = new Set(["HTTP_PROXY", "HTTPS_PROXY", "NO_PROXY"]);
  rHh = new Set([
    "CLAUDE_CODE_CLIENT_CERT",
    "CLAUDE_CODE_CLIENT_KEY",
    "CLAUDE_CODE_CLIENT_KEY_PASSPHRASE",
    "NODE_EXTRA_CA_CERTS",
    "NODE_TLS_REJECT_UNAUTHORIZED",
    "CLAUDE_CODE_OAUTH_SCOPES",
  ]);

// READABLE (for understanding):
function isProxySetting(name)                { return PROXY_ENV_VARS.has(name.toUpperCase()); }
function isHostManagedTransportSetting(name) { return HOST_MANAGED_TRANSPORT_VARS.has(name.toUpperCase()); }
const PROXY_ENV_VARS = new Set(["HTTP_PROXY", "HTTPS_PROXY", "NO_PROXY"]);
const HOST_MANAGED_TRANSPORT_VARS = new Set([
  "CLAUDE_CODE_CLIENT_CERT",            // mTLS certificate      -> .212 "mTLS certs", .217 "corporate mTLS"
  "CLAUDE_CODE_CLIENT_KEY",             // mTLS private key
  "CLAUDE_CODE_CLIENT_KEY_PASSPHRASE",
  "NODE_EXTRA_CA_CERTS",                // extra CA bundle       -> .212 "extra CA bundles"
  "NODE_TLS_REJECT_UNAUTHORIZED",       // TLS verification      -> .217 "TLS-verify"
  "CLAUDE_CODE_OAUTH_SCOPES",           // OAuth scopes          -> .212/.217 "OAuth scope"
]);

// Mapping: N5n→isProxySetting, t7t→isHostManagedTransportSetting,
//          tHh→PROXY_ENV_VARS, rHh→HOST_MANAGED_TRANSPORT_VARS
```

`rHh` is a **line-for-line transcription of the two changelog bullets**: mTLS cert + key (+ passphrase),
extra CA bundles, TLS-verify, OAuth scopes. `tHh` is the fourth item `.217` names, proxy settings, kept
separate because proxy vars are also filtered elsewhere. `NODE_TLS_REJECT_UNAUTHORIZED` appearing in
the bundle for the first time (**220=2 / 193=0**) is the cleanest single proof that this set is new.

### 1.2 The branch, and how `.217` narrowed `.212`

```javascript
// ============================================
// filterEnvForSettingsSource - drops settings-sourced env vars a host-managed session must not honour
// Location: cli_inner_pretty.js:267720-267745
// ============================================

// ORIGINAL (for source lookup):
function eWu(e, t) {
  if (!e) return {};
  let r = SHe.managedByHost || (SHe.desktopHost && Jmy.has(t)),
    n = {};
  for (let [o, i] of Object.entries(e)) {
    if (ehy.has(o.toUpperCase())) continue;
    if (!r) { n[o] = i; continue; }
    if ($5n(o) && (SHe.managedByHost || !z5l(o))) {
      if (SHe.managedByHost) P_s(o, t);
      continue;
    }
    if (SHe.managedByHost && o.toUpperCase() === "ANTHROPIC_CUSTOM_HEADERS") { P_s(o, t); continue; }
    if (SHe.managedByHostFlag && (!SHe.desktopHost || Q5u.has(t)) && (N5n(o) || t7t(o))) {
      P_s(o, t, SHe.desktopHost);
      continue;
    }
    n[o] = i;
  }
  return n;
}

// READABLE (for understanding):
function filterEnvForSettingsSource(envFromSettings, source) {
  if (!envFromSettings) return {};
  const hostOwnsRouting = hostState.managedByHost || (hostState.desktopHost && DESKTOP_FILTERED_SOURCES.has(source));
  const kept = {};
  for (const [name, value] of Object.entries(envFromSettings)) {
    if (NEVER_FROM_SETTINGS.has(name.toUpperCase())) continue;               // 1 unconditional deny-list
    if (!hostOwnsRouting) { kept[name] = value; continue; }                  // 2 ordinary session: keep everything
    if (isProviderOrAuthVar(name) && (hostState.managedByHost || !isDesktopAllowedProviderVar(name))) {
      if (hostState.managedByHost) warnIgnored(name, source);                // 3 provider/auth selection
      continue;
    }
    if (hostState.managedByHost && name.toUpperCase() === "ANTHROPIC_CUSTOM_HEADERS") {
      warnIgnored(name, source); continue;                                   // 4 header injection
    }
    // 5  <- the .212 branch, with the .217 narrowing in its middle conjunct
    if (hostState.managedByHostFlag
        && (!hostState.desktopHost || REPO_COMMITTED_SOURCES.has(source))
        && (isProxySetting(name) || isHostManagedTransportSetting(name))) {
      warnIgnored(name, source, hostState.desktopHost);
      continue;
    }
    kept[name] = value;
  }
  return kept;
}
const REPO_COMMITTED_SOURCES = new Set(["projectSettings", "localSettings"]);   // Q5u, :267931

// Mapping: eWu→filterEnvForSettingsSource, SHe→hostState, P_s→warnIgnored, Q5u→REPO_COMMITTED_SOURCES,
//          $5n→isProviderOrAuthVar, z5l→isDesktopAllowedProviderVar, ehy→NEVER_FROM_SETTINGS
```

**What it does:** for each settings file that can contribute an `env` block, decides which variables a
host-managed or Desktop session is allowed to honour.

**How it works — the ordering is load-bearing.**

1. `ehy` is an unconditional deny-list applied to *every* session (`CLAUDE_CONFIG_DIR`,
   `ANTHROPIC_API_KEY`, the base-URL family, …, `:58262-58290`). It runs first because it is not a
   host-managed policy — no settings file may ever set those, hosted or not.
2. The early `if (!hostOwnsRouting)` exit means an ordinary local session pays one boolean per variable.
3. Provider/auth **selection** vars (`CLAUDE_CODE_USE_BEDROCK`, `ANTHROPIC_AUTH_TOKEN`, the
   `CLAUDE_CODE_SKIP_*_AUTH` family, …) are dropped first, because re-pointing the *provider* is
   strictly worse than re-pointing the *transport*.
4. `ANTHROPIC_CUSTOM_HEADERS` gets its own arm: it is neither a provider selector nor a transport
   setting, but it can inject an `Authorization` header, so it is treated as an auth var.
5. **The transport branch** — the subject of both bullets.

**Why the branch exists at all (`.212`).** A host-managed session (`CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST`,
or a host-auth-callback marker) receives its credential from a parent process — the desktop app, a
Cowork VM, a hosted runner. That parent has already established the TLS channel and the credential is
scoped to *that* channel. If a repository's `.claude/settings.json` then sets `CLAUDE_CODE_CLIENT_CERT`
or `NODE_EXTRA_CA_CERTS`, the child re-points its TLS stack at a trust anchor the host never agreed to
— and the observed symptom was not a security event but a **startup failure**, because the host's
credential does not validate against the repo's CA. Ignoring-with-a-warning is the right resolution:
throwing would strand the session, and honouring would let a repo redirect a host-issued credential.

**Why `.217` had to narrow it.** As shipped in `.212` the guard read
`if (SHe.managedByHostFlag && (isProxySetting(o) || isHostManagedTransportSetting(o)))`. Claude Desktop
sets `CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST`, so **every** Desktop session started ignoring these six
transport vars *from every source* — including the user's own `~/.claude/settings.json` and the
organisation's managed settings. For an enterprise whose corporate mTLS cert and proxy live in managed
settings, that is a regression: Claude Desktop suddenly could not reach the network at all. `.217`
inserts `(!SHe.desktopHost || Q5u.has(t))`, so on a Desktop host the suppression applies **only** to
`projectSettings` / `localSettings` — the two repo-committed sources. User and managed settings are
honoured again.

The resulting policy is a small matrix worth stating explicitly:

| Session kind | `projectSettings` / `localSettings` | `userSettings` / `policySettings` |
|---|---|---|
| ordinary local | honoured | honoured |
| host-managed, not Desktop (`managedByHost` && !`desktopHost`) | ignored + warned | ignored + warned |
| **Claude Desktop** (`desktopHost`) | **ignored + warned** | **honoured** |

The trust reasoning is exactly right: a repo you `git clone` is untrusted input; your own settings and
your admin's settings are not.

**The warning tells you which case you are in.**

```javascript
// ORIGINAL (:267710-267719):
function P_s(e, t, r = !1) {
  if ($_s.has(e)) return;
  ($_s.add(e),
    w(
      r
        ? `Ignoring ${e} from ${t} — repo-committed settings can't re-point the TLS/proxy channel of a session whose credential comes from the host. Set it in ~/.claude/settings.json or managed settings instead.`
        : `Ignoring ${e} from ${t} — this session's provider routing is managed by the host (CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST or a host-auth-callback marker), so settings-sourced provider/auth configuration does not apply.`,
      { level: "warn" },
    ));
}
```

The Desktop variant **names the fix** ("Set it in `~/.claude/settings.json` or managed settings
instead") because on Desktop there is a working alternative; the generic variant does not, because in
a fully host-managed session there is not. `$_s` is a warn-once `Set` keyed on the variable name, so a
repo with six offending vars logs six lines, not six per settings file per reload.

### 1.3 Two more enforcement points for the same set

The env filter runs when settings are read. Two other places apply the same predicates:

**(a) CA-cert fallback** (`:825526-825544`) — the `NODE_EXTRA_CA_CERTS` value can also come from
`~/.claude.json`'s `env` block, bypassing the settings pipeline, so the reader re-checks:

```javascript
// ORIGINAL (:825528-825531, inside SoE = resolveExtraCaCertsFromConfig):
if (Z.CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST && !G$() && t7t("NODE_EXTRA_CA_CERTS")) {
  w("CA certs: skipping settings-sourced NODE_EXTRA_CA_CERTS under host-managed provider");
  return;
}
```

Note the guard is only consulted when the *process* env does not already carry the variable —
`lSm()` (`:825519-825525`) starts with `if (Z.NODE_EXTRA_CA_CERTS) return;`. So a CA bundle exported by
the host itself is honoured; only the settings-sourced fallback is suppressed. That distinction is the
difference between "the host configured a corporate CA" (fine) and "the repo did" (not fine).

**(b) Warm-spare claim** (`:552268-552271`) — when a pre-warmed process is claimed for a new session
it inherits the previous session's `process.env`, so the four predicates are used to *delete* rather
than filter:

```javascript
// ORIGINAL (:552268-552271):
if ((Nbi(), Ind(), Cye({ warm_spare_claimed: 1 }), Yt(e.env.CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST))) {
  for (let o of Object.keys(process.env))
    if ($5n(o) || o === "ANTHROPIC_CUSTOM_HEADERS" || N5n(o) || t7t(o)) delete process.env[o];
}
```

followed unconditionally by deleting `ANTHROPIC_AUTH_TOKEN` / `ANTHROPIC_API_KEY` /
`CLAUDE_CODE_OAUTH_TOKEN` and then `Object.assign(process.env, e.env)` with the claiming session's env,
`pot()` (clear the proxy-agent cache) and `T6e()` (rebuild the global agents). Without this a warm
spare could carry one session's client certificate into another's requests — the same class of leak
the settings filter prevents, but through process reuse instead of configuration.

---

## 2. `.202` — transient mTLS handshake failures during in-place certificate rotation

> *"Fixed transient mTLS handshake failures when settings were re-applied during an in-place client
> certificate rotation."*

**Verdict: NET_NEW — the mTLS module was rewritten around a content-aware, asynchronous reload.**
The scoping filed this UNANCHORED on `mTLS` / `clientCert` / `secureContext`. The anchors are the
module's **export table**, which does not exist in 2.1.193:

| Export | 220 | 193 |
|---|---|---|
| `loadMTLSClientMaterial` (`P7t`) | **2** | **0** |
| `getMTLSConfig` (`R8`) | 1 | **0** |
| `getMTLSAgent` (`aOi`) | 1 | **0** |
| `getLoadedMTLSPaths` (`sOi`) | 1 | **0** |
| `getWebSocketTLSOptions` (`WK`) / `getTLSFetchOptions` (`Pxt`) | 1 / 1 | **0 / 0** |
| `clearMTLSCache` (`BWn`) | **2** | **0** |
| `configureGlobalMTLS` (`lOi`) | 3 | 2 |
| `CLAUDE_CODE_CLIENT_CERT` | 13 | 8 |

(`Cleared mTLS configuration cache` and `mTLS: Creating HTTPS agent with custom certificates` are both
1/1 — the *behaviour* strings survived the rewrite, which is why a string-first probe finds nothing.)

### 2.1 The 2.1.193 shape, and why it breaks under rotation

```javascript
// ORIGINAL (:59448-59475 (193)) - the whole module:
_2 = xn(() => {
  let e = {};
  if (process.env.CLAUDE_CODE_CLIENT_CERT)
    try {
      ((e.cert = Gt().readFileSync(process.env.CLAUDE_CODE_CLIENT_CERT, { encoding: "utf8" })),
        T("mTLS: Loaded client certificate from CLAUDE_CODE_CLIENT_CERT"));
    } catch (t) { T(`mTLS: Failed to load client certificate: ${t}`, { level: "error" }); }
  if (process.env.CLAUDE_CODE_CLIENT_KEY)
    try {
      ((e.key = Gt().readFileSync(process.env.CLAUDE_CODE_CLIENT_KEY, { encoding: "utf8" })),
        T("mTLS: Loaded client key from CLAUDE_CODE_CLIENT_KEY"));
    } catch (t) { T(`mTLS: Failed to load client key: ${t}`, { level: "error" }); }
  ...
});
GCr = xn(() => { ... return (T("mTLS: Creating HTTPS agent with custom certificates"), new i_s.Agent(n)); });
function a_s() { (_2.cache.clear?.(), GCr.cache.clear?.(), T("Cleared mTLS configuration cache")); }
```

Three properties, each a step in the failure:

1. **The read is synchronous and on the request path.** `_2` is memoised (`xn`), so the `readFileSync`
   happens on first use — which, after a cache clear, is *inside* the next outgoing request.
2. **The module remembers a value, never a provenance.** There is no record of *which file* produced
   the cached `cert`, so nothing can compare "what is configured now" with "what is loaded".
3. **`a_s()` clears unconditionally.** Any settings re-apply nukes both caches.

Rotation is not atomic on most deployments: a config-management tool writes `client.crt`, then
`client.key`, or truncates and rewrites in place. Sequence: settings re-apply → `a_s()` clears →
next request → `readFileSync` lands in the ~10 ms window where the key file is truncated or
half-written → the `catch` logs and the field is simply **absent** → the agent is built with a cert and
no key (or neither) → the TLS handshake fails. The next request re-reads, the file is now complete, and
it works. *Transient mTLS handshake failures.*

### 2.2 The 2.1.220 shape

```javascript
// ============================================
// loadMTLSClientMaterial - async, content-aware reload of the client cert/key
// Location: cli_inner_pretty.js:65187-65197 (with getMTLSConfig :65198-65214, getMTLSAgent :65144-65154)
// ============================================

// ORIGINAL (for source lookup):
P7t = loe(async () => {
    let e = Z.CLAUDE_CODE_CLIENT_CERT,
      t = Z.CLAUDE_CODE_CLIENT_KEY,
      [r, n] = await Promise.all([
        e ? mql(e, "client certificate from CLAUDE_CODE_CLIENT_CERT") : null,
        t ? mql(t, "client key from CLAUDE_CODE_CLIENT_KEY") : null,
      ]),
      o = wnt?.path !== r?.path || wnt?.content !== r?.content || Tnt?.path !== n?.path || Tnt?.content !== n?.content;
    if (((wnt = r), (Tnt = n), o)) BWn();
    return o;
  });

// READABLE (for understanding):
loadMTLSClientMaterial = serialize(async () => {                 // `loe` = one-at-a-time queue
  const certPath = env.CLAUDE_CODE_CLIENT_CERT;
  const keyPath  = env.CLAUDE_CODE_CLIENT_KEY;
  const [cert, key] = await Promise.all([                        // async: never on the request path
    certPath ? readPemAsync(certPath, "client certificate from CLAUDE_CODE_CLIENT_CERT") : null,
    keyPath  ? readPemAsync(keyPath,  "client key from CLAUDE_CODE_CLIENT_KEY")          : null,
  ]);
  const changed =
       loadedCert?.path    !== cert?.path || loadedCert?.content !== cert?.content
    || loadedKey?.path     !== key?.path  || loadedKey?.content  !== key?.content;
  loadedCert = cert; loadedKey = key;                            // swap both together
  if (changed) clearMTLSCache();                                 // only then invalidate the agent
  return changed;
});

// Mapping: P7t→loadMTLSClientMaterial, loe→serialize, mql→readPemAsync,
//          wnt→loadedCert (a {path, content} record), Tnt→loadedKey, BWn→clearMTLSCache
```

**The four changes that fix rotation:**

1. **Provenance is stored.** `wnt` / `Tnt` are `{ path, content }` records, not bare strings
   (`fql`/`mql`, `:65125-65140`). `getLoadedMTLSPaths` (`sOi`, `:65141-65143`) exposes them, which is
   what makes step 3 below possible.
2. **The reload is asynchronous and pre-emptive.** `P7t()` is awaited inside
   `Promise.all([R7t(), P7t(), _Rl(), XMl()])` at startup (`:827757`) and fired again on every settings
   re-apply (`:267882`) and after remote managed settings load (`:827874`). The file read no longer
   happens under a request.
3. **Invalidation is conditional on *content*, not on "settings changed".** `if (... o) BWn();` — a
   settings re-apply that does not actually change the certificate bytes leaves the cached
   `https.Agent` alive, so live keep-alive connections are not torn down for nothing.
4. **`loe` serialises.** `loe` (`:48948-48954`) chains every invocation onto a single promise:

   ```javascript
   function loe(e) {
     let t = Promise.resolve();
     return (...r) => { let n = t.then(() => e(...r)); return ((t = n.catch(() => {})), n); };
   }
   ```

   Two concurrent settings re-applies therefore cannot interleave their reads and leave `wnt` from one
   load paired with `Tnt` from another — a mismatched cert/key pair is exactly the handshake failure
   being fixed. Note `t = n.catch(() => {})`: a failed load does not poison the chain.

### 2.3 The re-apply path, and the guard that keeps the old material alive

```javascript
// ============================================
// reapplySettingsDerivedEnv - re-derive process.env from settings and rebuild the network stack
// Location: cli_inner_pretty.js:267867-267887
// ============================================

// ORIGINAL (for source lookup):
function l9() {
  (NQr(), J5u(), (olr = {}));
  let e = Z.NODE_EXTRA_CA_CERTS,
    t = Z.CLAUDE_CODE_CLIENT_CERT,
    r = Z.CLAUDE_CODE_CLIENT_KEY;
  (nWu(xt().env), Object.assign(process.env, rlr(xt().env, "globalConfig")));
  for (let a of wT()) Object.assign(process.env, rlr(Pr(a)?.env, a));
  (Oio(olr), oWu());
  let n = Z.NODE_EXTRA_CA_CERTS !== e || Z.CLAUDE_CODE_CLIENT_CERT !== t || Z.CLAUDE_CODE_CLIENT_KEY !== r;
  D3r();
  let { certPath: o, keyPath: i } = sOi(),
    s = (Z.CLAUDE_CODE_CLIENT_CERT !== o || Z.CLAUDE_CODE_CLIENT_KEY !== i) && (o !== void 0 || i !== void 0);
  if (!s) BWn();
  (pot(),
    T6e(),
    Promise.all([R7t(), P7t()])
      .then(([a, l]) => {
        if (n || s || a || l) (pot(), T6e());
      })
      .catch(xe));
}

// READABLE (for understanding):
function reapplySettingsDerivedEnv() {
  resetEnvOverlays();
  const prevCa   = env.NODE_EXTRA_CA_CERTS,
        prevCert = env.CLAUDE_CODE_CLIENT_CERT,
        prevKey  = env.CLAUDE_CODE_CLIENT_KEY;

  applyEnv(readConfig().env);                                       // ~/.claude.json
  Object.assign(process.env, filterEnvForSource(readConfig().env, "globalConfig"));
  for (const source of settingsSources())                           // user, project, local, policy, flag
    Object.assign(process.env, filterEnvForSource(readSettings(source)?.env, source));
  applyColorOverrides(); resetEnvDerivedCaches();

  const pathsChanged = env.NODE_EXTRA_CA_CERTS      !== prevCa
                    || env.CLAUDE_CODE_CLIENT_CERT  !== prevCert
                    || env.CLAUDE_CODE_CLIENT_KEY   !== prevKey;
  refreshCertStore();

  const { certPath: loadedCertPath, keyPath: loadedKeyPath } = getLoadedMTLSPaths();
  const pointsElsewhere = (env.CLAUDE_CODE_CLIENT_CERT !== loadedCertPath
                        || env.CLAUDE_CODE_CLIENT_KEY  !== loadedKeyPath)
                       && (loadedCertPath !== undefined || loadedKeyPath !== undefined);

  if (!pointsElsewhere) clearMTLSCache();       // same files -> safe to drop the derived agent now
  clearProxyCache(); configureGlobalAgents();   // rebuild immediately with what we already hold
  Promise.all([loadExtraCaCerts(), loadMTLSClientMaterial()])
    .then(([caChanged, mtlsChanged]) => {
      if (pathsChanged || pointsElsewhere || caChanged || mtlsChanged) { clearProxyCache(); configureGlobalAgents(); }
    })
    .catch(report);
}

// Mapping: l9→reapplySettingsDerivedEnv, rlr→filterEnvForSource (the §1 filter), sOi→getLoadedMTLSPaths,
//          BWn→clearMTLSCache, pot→clearProxyCache, T6e→configureGlobalAgents,
//          R7t→loadExtraCaCerts, P7t→loadMTLSClientMaterial, D3r→refreshCertStore
```

**The `if (!s) BWn();` line is the fix, and it reads backwards until you see it.**

- `s` (`pointsElsewhere`) is true when the *configured* cert/key paths differ from the paths currently
  **loaded in memory**, and something is loaded.
- If `s` is **false** — the settings still point at the same files — the in-memory material is
  authoritative, so the derived `https.Agent` can be dropped immediately and rebuilt from it. No file
  read is involved, so no rotation window exists.
- If `s` is **true** — the settings now point at *different* files — the cache is **deliberately not
  cleared**. The old, complete, working certificate keeps serving requests until the asynchronous
  `P7t()` has finished reading the new one and swapped both fields atomically. Only then does the
  `.then` arm rebuild the agents.

That is the inversion of 2.1.193's `a_s()`, which cleared unconditionally and forced a synchronous
re-read on the next request. 2.1.220 **never has a moment with no certificate**: either the old one is
still installed, or the new one has already been fully read.

Two further details: `T6e()` (`configureGlobalAgents`, `:86493-86518`) is called **twice** — once
immediately so the session is not left with a stale proxy interceptor while the async load runs, and
once after, guarded by a four-way `changed` disjunction so the second rebuild is skipped in the common
no-op case. And `aOi()` (`getMTLSAgent`, `:65144-65154`) is *not* memoised by a cache wrapper; it
compares `D7t.config === e && D7t.ca === t` by **identity** and rebuilds when either object is new.
Since `R8` is a `Vr(...)` memo, a cleared memo yields a fresh object identity, which is what signals
"rebuild the agent" — a cheaper and less error-prone invalidation than a second explicit cache.

The identical pattern appears at `:827874-827875`, after remote managed settings arrive:
`let [t, r] = await Promise.all([R7t(), P7t()]); if (t || r) (pot(), T6e());`.

---

## 3. `.214` — keep-alive pooling disabled after a stale-connection error

> *"Changed keep-alive connection pooling to disable after a stale-connection error, so retries open a
> fresh socket."*

**Verdict: ⚠ CARRYOVER at the mechanism level. The delta is three strings added to one `Set`.**

This is the trap in this document. Every part of the described behaviour already exists in 2.1.193:

| Anchor | 220 | 193 |
|---|---|---|
| `Stale connection` (`:534549`) | **1** | **1** |
| `disabling keep-alive for retry` | **1** | **1** |
| `disableKeepAlive` (the exported name) | 3 | 3 |
| `_resetKeepAliveForTesting` | 1 | 1 |
| `keepalive: !1` in the fetch-options builder | 1 (`:86471`) | 1 (`:81932 (193)`) |

The 2.1.193 fetch-options builder is byte-equivalent in the relevant clause:
`r = { ...(kRr && { keepalive: !1 }), ...(n && { timeout: !1 }) };` (`:81932 (193)`) versus
`n = { ...(BFi && { keepalive: !1 }), ...(r && { timeout: !1 }) };` (`:86471`). **A reader who greps the
bullet's own words will conclude this shipped in `.214` and be wrong.**

### 3.1 The mechanism (carryover), for completeness

```javascript
// ============================================
// The stale-connection keep-alive latch (mechanism is CARRYOVER; the classifier set is the delta)
// Location: cli_inner_pretty.js:534522-534526, :534548-534549, :86281-86286, :86468-86471
// ============================================

// ORIGINAL (for source lookup):
function YU_(e) {
  if (!(e instanceof IO)) return !1;
  let t = HN(e);
  return t !== null && qie.has(t.code);
}
...
        let b = YU_(a);
        if (b) (w("Stale connection — disabling keep-alive for retry"), UFi());
        if (
          i === null ||
          (a instanceof hi && a.status === 401) ||
          (a instanceof hi && a.status === 407 && tkt()) ||
          Fke(a) ||
          Wlp(a, o.model) ||
          qlp(a) ||
          b
        ) { ... rebuild the client ... }
...
function UFi() { BFi = !0; }
function jGh() { BFi = !1; }
...
  n = { ...(BFi && { keepalive: !1 }), ...(r && { timeout: !1 }) };

// READABLE (for understanding):
function isStaleConnectionError(err) {
  if (!(err instanceof ConnectionError)) return false;
  const info = extractErrnoInfo(err);
  return info !== null && STALE_CONNECTION_CODES.has(info.code);
}
// ...inside the per-attempt loop of the streaming request generator:
const staleConnection = isStaleConnectionError(previousError);
if (staleConnection) { log("Stale connection — disabling keep-alive for retry"); disableKeepAlive(); }
if (clientIsUnset || previousWas401 || previousWasProxyAuth || oauthRevoked
    || awsAuthRetryable || gcpAuthRetryable || staleConnection) {
  /* rebuild the API client so it picks up the new fetch options */
}
function disableKeepAlive()          { keepAliveDisabled = true; }   // process-wide latch
function _resetKeepAliveForTesting() { keepAliveDisabled = false; }
// and in getProxyFetchOptions():
const base = { ...(keepAliveDisabled && { keepalive: false }), ...(forceIdleTimeout && { timeout: false }) };

// Mapping: YU_→isStaleConnectionError, IO→ConnectionError, HN→extractErrnoInfo, qie→STALE_CONNECTION_CODES,
//          UFi→disableKeepAlive, BFi→keepAliveDisabled, jGh→_resetKeepAliveForTesting, Ih→getProxyFetchOptions
```

Worth understanding even though it is old code, because the two halves are separated by ~450 000 lines
and neither works without the other: `UFi()` only flips a module-level boolean. The reason a *retry*
gets a fresh socket is that `staleConnection` is also a disjunct in the **client-rebuild** condition at
`:534550-534557`, so the next attempt constructs a new client, which calls `Ih()`
(`getProxyFetchOptions`, `:86468-86492`), which now emits `keepalive: false`. Flipping the latch
without rebuilding the client would change nothing — the already-constructed client holds its own
fetch options.

Two design notes on the latch itself: it is **process-wide and one-way** (only `_resetKeepAliveForTesting`
clears it), so a single stale-connection event permanently disables pooling for the rest of the
session. That is a blunt instrument — the cost is a TCP+TLS handshake on every subsequent request —
and it is chosen because the condition it defends against (a middlebox silently dropping idle
connections) is a property of the network path, not of one request: if it happened once it will happen
again, and correctness beats latency.

### 3.2 The actual `.214` delta

```javascript
// ORIGINAL (:228052-228060) — 2.1.220:
(qie = new Set([
  "ECONNRESET",
  "EPIPE",
  "ConnectionClosed",
  "ETIMEDOUT",
  "ECONNABORTED",
  "ERR_SOCKET_CLOSED",
  "StreamSuspended",
]));

// ORIGINAL (:237172 (193)) — 2.1.193:
(Sce = new Set(["ECONNRESET", "EPIPE", "ConnectionClosed", "StreamSuspended"]));
```

**Three new codes: `ETIMEDOUT`, `ECONNABORTED`, `ERR_SOCKET_CLOSED`.** `ERR_SOCKET_CLOSED` is
**220=4 / 193=0** across the whole bundle — a genuinely new piece of vocabulary, and the strongest
evidence that this set is what changed.

Why these three, and why they were missing:

- **`ECONNRESET` / `EPIPE`** (already present) are what you get when the peer sends an RST or closes
  while you are writing — the *loud* stale-connection signals.
- **`ETIMEDOUT`** is the *quiet* one: a middlebox that drops the flow without an RST leaves the socket
  open until the OS keep-alive or the request timeout fires. This is the dominant failure mode behind
  corporate NAT/firewall idle timeouts, and it was previously classified as a generic network error —
  the request retried on the *same* dead pooled socket and timed out again.
- **`ECONNABORTED`** is the local-stack analogue (the OS aborted the connection).
- **`ERR_SOCKET_CLOSED`** is Node's own code for writing to a socket the runtime already destroyed —
  the signature of reusing a pooled connection that Node has torn down.

The sibling "unreachable" set gained one member too: `Wie` (`:228040-228051`) adds `ERR_PROXY_TUNNEL`
(**220=4 / 193=0**) to 193's list (`:237160-237171 (193)`), which distinguishes "the proxy could not
establish a CONNECT tunnel" from "the origin is down" — a different remediation. Both sets feed the
user-visible message at `:228696-228700`:
`API Error: Connection to the API was lost (${code}). This is usually temporary — try again.`

**Lesson for the ledger.** The bullet is phrased as a behaviour change ("Changed keep-alive connection
pooling to disable…") and is really a *classifier widening*. The correct summary is: *the fresh-socket
retry existed since at least 2.1.193; `.214` made three more error codes trigger it.* Anyone writing
this up as an introduction would be reproducing the false-delta defect `_CONVENTIONS.md` §4.7 warns about.

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
- `HOST_MANAGED_TRANSPORT_VARS` (`rHh`, `:57972-57979`) / `PROXY_ENV_VARS` (`tHh`, `:57971`)
- `isHostManagedTransportSetting` (`t7t`, `:57816-57818`) / `isProxySetting` (`N5n`, `:57813-57815`)
- `filterEnvForSettingsSource` (`eWu`, `:267720-267745`) / `warnIgnoredHostManagedEnv` (`P_s`, `:267710-267719`)
- `REPO_COMMITTED_SOURCES` (`Q5u`, `:267931`) / host-state builder (`J5u`, `:267685-267695`)
- `buildHostManagedSuppressionList` (`F5n`, `:57822-57840`) and its inputs
  `zye` (`:57853-57868`), `Kye` (`:57883-57891`), `MPi` (`:57930`), `OPi` (`:57931-57938`)
- `resolveExtraCaCertsFromConfig` (`SoE`, `:825526-825544`) / `applyExtraCaCerts` (`lSm`, `:825519-825525`)
- warm-spare env scrub (`f3o`, `:552264-552287`)
- mTLS module export table (`gql`, `:65114-65124`)
- `loadMTLSClientMaterial` (`P7t`, `:65187-65197`) / `getMTLSConfig` (`R8`, `:65198-65214`)
- `getMTLSAgent` (`aOi`, `:65144-65154`) / `getLoadedMTLSPaths` (`sOi`, `:65141-65143`)
- `clearMTLSCache` (`BWn`, `:65167-65169`) / `configureGlobalMTLS` (`lOi`, `:65170-65173`)
- `readPemSync` (`fql`, `:65125-65132`) / `readPemAsync` (`mql`, `:65133-65140`)
- `serialize` (`loe`, `:48948-48954`)
- `reapplySettingsDerivedEnv` (`l9`, `:267867-267887`)
- `configureGlobalAgents` (`T6e`, `:86493-86518`) / `clearProxyCache` (`pot`, `:86535-86537`)
- `getProxyFetchOptions` (`Ih`, `:86468-86492`)
- `disableKeepAlive` (`UFi`, `:86281-86283`) / `keepAliveDisabled` (`BFi`, `:86541`) /
  `_resetKeepAliveForTesting` (`jGh`, `:86284-86286`)
- `isStaleConnectionError` (`YU_`, `:534522-534526`) and its trigger (`:534548-534557`)
- `STALE_CONNECTION_CODES` (`qie`, `:228052-228060`) / `UNREACHABLE_CODES` (`Wie`, `:228040-228051`)
- TLS error-code sets `Gcs` (`:228017-228033`) / `UZg` (`:228034-228039`)
