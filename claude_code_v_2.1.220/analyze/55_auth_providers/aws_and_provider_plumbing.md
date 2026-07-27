# AWS credential resolution, provider channels, and the gateway on-ramp (v2.1.193 → v2.1.220)

> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
> (`VERSION 2.1.220`, build `4073f595`). BASELINE:
> `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`.
> Every `cli_inner_pretty.js:<line>` is a **220** line unless tagged **(193)**.
> Conventions: [`../_CONVENTIONS.md`](../_CONVENTIONS.md). Ledger: [`README.md`](README.md).
>
> **Boundary.** The model catalogue's `provider_ids`, the eight-way alias table, and the
> `anthropic_google_cloud` channel *as a model surface* belong to `47_models` — see
> [`../47_models/README.md`](../47_models/README.md) and
> [`../47_models/anthropic_google_cloud_channel.md`](../47_models/anthropic_google_cloud_channel.md).
> This document covers only the **credential** side: how AWS/GCP credentials are obtained, cached,
> timed out, refreshed and invalidated.

---

## 0. Why the AWS bullets look like carryover and are not

The `.206`–`.208` scoping pass filed six of this theme's ten bullets as CARRYOVER because every
headline literal is unchanged:

```
awsCredentialExport   220=12 / 193=12
sso_region            220= 9 / 193= 9      (all nine are vendored @aws-sdk, both builds)
credential_process    220= 7 / 193= 7
awsAuthRefresh        220=10 / 193=10
ssoRegion             220= 6 / 193= 6
CLAUDE_CODE_SKIP_BEDROCK_AUTH  220=10 / 193=10
```

That measurement is correct and it is also the wrong place to look. The real change is a **new
caching + timeout layer between Claude Code and the AWS SDK**, and it shows up in names and numbers,
not in the AWS vocabulary:

| Anchor | 220 | 193 | Meaning |
|---|---|---|---|
| `CLAUDE_CODE_SKIP_AWS_CRED_CACHE` | **10** | **0** | the kill switch for the new cache |
| `CLAUDE_CODE_AWS_CHAIN_RESOLVE_TIMEOUT_MS` | **2** | **0** | the stall-guard override |
| `getDefaultAwsProviderChain` (`oW`) | 1 | **0** | the cache itself |
| `invalidateDefaultAwsProviderChainDebounced` (`Wer`) | 1 | **0** | debounced eviction |
| `clearAwsHelperCredentialsCache` (`kXi`) | 1 | **0** | narrow eviction |
| `resolveWithStallGuard` (`Jeu`) | 1 | **0** | the 60-second guard |
| `AWS_CHAIN_RESOLVE_REQUEST_TIMEOUT_MS` (`XIt`) | 1 | **0** | 30 s STS request timeout |
| `AWS default-chain credential resolve timed out` | **1** | **0** | its error |
| `resolving default AWS provider chain` | **1** | **0** | its log line |
| `providerChainResolver` | **28** | 15 | **all 15 of 193's are inside the vendored SDK** |
| `invalidateAuth` | **6** | **0** | the setup wizard's re-auth hook |
| `api_request_aws_auth_exhausted` | **1** | **0** | the AWS 401 retry breaker |
| `getAWSProxyRequestHandler` (`RXt`) | 1 | **0** | proxy-aware handler with a timeout |

The `providerChainResolver` row is the single most informative one and §1 is about it.

---

## 1. `.207` — Bedrock re-requesting AWS SSO credentials on **every** API request

> *"Fixed Bedrock repeatedly requesting fresh AWS SSO credentials from IAM Identity Center on every
> API request."*

**Verdict: DELTA, newly anchored.** The scoping recorded this UNANCHORED/CARRYOVER on `sso_region`.
The mechanism is a new application-side provider-chain cache.

### 1.1 The before-picture: the application never supplied a resolver

Every one of 2.1.193's fifteen `providerChainResolver` occurrences is inside the **vendored** Anthropic
Bedrock / AnthropicAws SDKs (`:107935 (193)`, `:107947 (193)`, `:109746 (193)`, `:109834 (193)`,
`:127165 (193)`, and their class fields). The Claude Code side passed none. So the SDK took its
fallback path, once per signed request:

```javascript
// ORIGINAL (:107927-107937 (193)) - the SDK's default resolver:
oJu = () =>
  Promise.resolve()
    .then(() => (tet(), eet))
    .then(({ fromNodeProviderChain: e }) =>
      e({ clientConfig: { requestHandler: new fei.FetchHttpHandler({ requestInit: (t) => ({ ...t }) }) } }),
    )
    .catch((e) => { throw Error(`Failed to import '@aws-sdk/credential-providers'. ...`); });

// ORIGINAL (:107947 (193)) - called per request, inside the SigV4 signer:
else n = await (await (t.providerChainResolver ? t.providerChainResolver() : oJu()))();
```

`fromNodeProviderChain()` builds a **fresh, un-memoised** chain and `(...)()` resolves it. The chain
walks env → shared-ini profile → SSO → `credential_process` → container → IMDS. For an SSO profile
that means reading `~/.aws/sso/cache/*.json` and calling `sso:GetRoleCredentials` — a real network
round trip — **on every single message the model sends.** That is the bullet, verbatim.

### 1.2 The after-picture: one memoised, expiry-aware chain per (profile, region)

2.1.220 supplies a resolver at **eight** application call sites — Bedrock client `:100044`, Bedrock
runtime client `:100074`, the SDK client factory's Bedrock / anthropicAws / Mantle branches
`:149567`, `:149623`, `:149672`, two more client builders `:455968`, `:456363`, and the Bedrock setup
wizard `:861699`, `:861737` — all of the form `providerChainResolver: () => oW(region)`.

```javascript
// ============================================
// getDefaultAwsProviderChain - per-(profile,region) memoised, expiry-aware AWS credential chain
// Location: cli_inner_pretty.js:156097-156121 (helpers :154794-154798, :154821-154835)
// ============================================

// ORIGINAL (for source lookup):
oW = jOe(async (e) => {
    let t = UOe(
      async () => {
        w(`[API:auth] resolving default AWS provider chain (region: ${e})`);
        let [{ fromNodeProviderChain: r }, n] = await Promise.all([
            Promise.resolve().then(() => (Zot(), Qot)),
            RXt({ url: `https://sts.${e}.amazonaws.com`, requestTimeoutMs: XIt }),
          ]),
          o = r({
            ignoreCache: !0,
            parentClientConfig: { region: e, requestHandler: n ?? new pXi.FetchHttpHandler({ requestTimeout: XIt }) },
            clientConfig: { requestHandler: n ?? new pXi.FetchHttpHandler({ requestTimeout: XIt }) },
          });
        return Jeu(o());
      },
      (r) => Xeu(r.expiration?.getTime()),
      (r, n) => {
        if (r.expiration === void 0) return !0;
        let o = r.expiration.getTime();
        if (o > Date.now() + Feu) return !0;
        return n >= o - Feu && o > Date.now();
      },
    );
    return () => t();
  }, Qeu);

// READABLE (for understanding):
getDefaultAwsProviderChain = memoizeByKey(async (region) => {
    const resolveCached = memoizeWithTtl(
      // (a) the expensive resolution, run at most once per TTL per key
      async () => {
        log(`[API:auth] resolving default AWS provider chain (region: ${region})`);
        const [{ fromNodeProviderChain }, proxyHandler] = await Promise.all([
          import("@aws-sdk/credential-providers"),
          getAWSProxyRequestHandler({ url: `https://sts.${region}.amazonaws.com`,
                                      requestTimeoutMs: AWS_CHAIN_RESOLVE_REQUEST_TIMEOUT_MS }),   // 30_000
        ]);
        const chain = fromNodeProviderChain({
          ignoreCache: true,                                          // we do our own caching
          parentClientConfig: { region, requestHandler: proxyHandler ?? new FetchHttpHandler({ requestTimeout: 30_000 }) },
          clientConfig:       {         requestHandler: proxyHandler ?? new FetchHttpHandler({ requestTimeout: 30_000 }) },
        });
        return resolveWithStallGuard(chain());                        // 60 s hard ceiling
      },
      // (b) soft TTL, computed from the resolved credential's own expiry
      (creds) => credentialCacheTtl(creds.expiration?.getTime()),
      // (c) hard validity predicate: evict rather than serve a credential about to expire
      (creds, cachedAt) => {
        if (creds.expiration === undefined) return true;              // static keys never expire
        const expiresAt = creds.expiration.getTime();
        if (expiresAt > Date.now() + EXPIRY_MARGIN_MS) return true;   // EXPIRY_MARGIN_MS = 30_000
        return cachedAt >= expiresAt - EXPIRY_MARGIN_MS && expiresAt > Date.now();
      },
    );
    return () => resolveCached();
  }, awsCacheKey);

function awsCacheKey(region) { return `${env.AWS_PROFILE ?? ""}\0${region}`; }   // Qeu, :154821-154823

function credentialCacheTtl(expiryEpochMs) {                                        // Xeu, :154794-154798
  const remaining = expiryEpochMs === undefined ? undefined : expiryEpochMs - Date.now();
  if (remaining === undefined || remaining <= REFRESH_AHEAD_MS + EXPIRY_SLACK_MS) return LONG_TTL_MS;
  return remaining - REFRESH_AHEAD_MS;
}
// LONG_TTL_MS = 3_600_000 (mHg :155989), REFRESH_AHEAD_MS = 300_000 (Neu :155990),
// EXPIRY_SLACK_MS = 60_000 (hHg :155991), EXPIRY_MARGIN_MS = 30_000 (Feu :155998)

// Mapping: oW→getDefaultAwsProviderChain, jOe→memoizeByKey, UOe→memoizeWithTtl, Qeu→awsCacheKey,
//          Xeu→credentialCacheTtl, RXt→getAWSProxyRequestHandler, Jeu→resolveWithStallGuard,
//          XIt→AWS_CHAIN_RESOLVE_REQUEST_TIMEOUT_MS, Feu→EXPIRY_MARGIN_MS
```

**What it does:** turns "resolve the AWS credential chain" from a per-request network operation into a
per-(profile, region) cached value with stale-while-revalidate semantics and a hard expiry floor.

**How it works:**

1. **Two nested memoisers.** `jOe` (`:51039-…`) keys on `awsCacheKey(region)` and caches the *resolver
   factory*; `UOe` (`:50964-51015`) caches the *resolved credential*. Splitting them matters because
   the AWS SDK wants a function it can call repeatedly, while the cache wants a value with a lifetime.
2. **The cache key includes `AWS_PROFILE`.** `` `${AWS_PROFILE ?? ""}\0${region}` `` — a NUL separator
   so a profile literally named `us-east-1` cannot collide with a region. Without the profile in the
   key, switching `AWS_PROFILE` mid-session would silently keep signing with the previous identity.
3. **`ignoreCache: true` is deliberate, not contradictory.** It disables the *SDK's* internal
   memoisation so the SDK never hands back a credential Claude Code's cache did not mint. There is
   exactly one cache, and it is the one whose invalidation hooks Claude Code controls.
4. **Soft TTL = "expiry minus five minutes".** `credentialCacheTtl` returns `remaining - 300_000`, so
   `UOe` marks the entry stale five minutes before the credential actually dies. At that point
   (`:50989-51003`) `UOe` **returns the still-valid cached value immediately and refreshes in the
   background** — the request never blocks on an SSO round trip. This is the specific behaviour the
   bullet is about.
5. **Two special cases collapse to a 1-hour TTL.** No `expiration` (static IAM user keys from
   `~/.aws/credentials`) → nothing to refresh ahead of, so cache for an hour. Expiry already within
   `300_000 + 60_000 = 6 minutes` → the refresh-ahead window would be under a minute, which would put
   the process on a refresh treadmill; use the long TTL and let layer (c) handle correctness.
6. **Layer (c) is the safety net that makes (5) safe.** `UOe` calls the validity predicate *before*
   serving any cached entry (`:50971-50974`) and hard-deletes on `false`. The predicate says: no
   expiry → valid; more than 30 s of life left → valid; otherwise valid only if it was cached inside
   its own last-30-s window **and** has not actually expired. So a nearly-dead credential is served at
   most for the tail it was minted with, and never past `expiresAt`. 30 s is chosen to exceed the
   worst-case in-flight request duration for a signed Bedrock call.
7. **Bounded network cost even on the miss path.** The STS request handler is built with
   `requestTimeout: 30_000`, and the whole chain resolution is wrapped in `resolveWithStallGuard`
   (§4) at 60 s.

**Why this approach.** Three alternatives are visible in the code's shape and were rejected:
*(a)* rely on the AWS SDK's own memoisation — rejected explicitly by `ignoreCache: true`, because the
SDK's cache has no eviction hook Claude Code can call when it detects a 401 or when settings change;
*(b)* a fixed TTL — would either be too long (serving expired credentials) or too short (the SSO
round trip returns); deriving the TTL from `expiration` makes it self-tuning per credential type;
*(c)* resolve once at startup — breaks SSO sessions that outlive their token. The chosen design costs
one extra module (`UOe` + `jOe`) and buys: zero per-request cost in steady state, zero blocking on
refresh, and precise invalidation.

**Failure modes and their escape hatches.** All eight call sites are wrapped in
`!Z.CLAUDE_CODE_SKIP_AWS_CRED_CACHE &&` (`CLAUDE_CODE_SKIP_AWS_CRED_CACHE` **220=10 / 193=0**) — with
that variable set the whole cache is bypassed and the SDK reverts to 193 behaviour. That is a shipped
admission that a new credential cache is the kind of thing that needs a one-line rollback.

### 1.3 Three eviction paths, deliberately different in scope

| Function | Line | Clears | Used by |
|---|---|---|---|
| `clearAwsCredentialsCache` (`Exe`) | `:154830-154832` | `JQ.cache`, `oW.cache`, **and** the debounce map | a real AWS auth error (`:534879`), settings `env` change (`:568717`), `/login` AWS refresh (`:584368`), proxy change (`:692454`) |
| `clearAwsHelperCredentialsCache` (`kXi`) | `:154833-154835` | `JQ.cache` only (the helper-sourced credentials) | `:534880`, paired with a debounced chain invalidation |
| `invalidateDefaultAwsProviderChainDebounced` (`Wer`) | `:154824-154829` | one `oW` key, at most once per 10 s | `:534880`, setup wizard `:861706`, `:861749` |

```javascript
// ORIGINAL (:154824-154829):
function Wer(e) {
  let t = Qeu(e), r = Date.now();
  if (r - (hXi.get(t) ?? 0) < SHg) return !1;      // SHg = 1e4
  return (hXi.set(t, r), oW.cache.delete(t), !0);
}
```

**Why debounce eviction at all?** The trigger is `ZU_` (`:534877-534882`), which runs on *every*
retryable auth error in the request loop:

```javascript
// ORIGINAL (:534877-534882):
function ZU_(e, t) {
  if (!Wlp(e, t)) return !1;
  if (WXn(e) || J9s(e, t) || (e instanceof hi && qXn(e.headers?.get("x-amzn-errortype") ?? void 0, e.message))) Exe();
  else (kXi(), Wer(mGn()));
  return !0;
}
```

A burst of parallel subagent requests all failing on the same expired credential would otherwise evict
and re-resolve the chain N times concurrently. The 10-second window collapses the burst into one
resolution. Note also the branch: a *recognised* AWS auth error (expired token / bad signature, matched
by `Ccg` at `:118032-118033` — `/ExpiredToken|InvalidSignature|SignatureDoesNotMatch|UnrecognizedClient|InvalidClientTokenId|security token.*(invalid|expired)|signature we calculated does not match/i`)
clears **everything**; anything else does the cheap, debounced, single-key eviction. Correctness for the
known case, cost control for the unknown one.

---

## 2. `.208` — SSO profiles whose `sso_region` differs from the Bedrock region

> *"Fixed Bedrock auth failing with `Session token not found or invalid` for AWS SSO profiles whose
> `sso_region` differs from the Bedrock region (2.1.207 regression)."*

**Verdict: DELTA that cannot be isolated by a 193↔220 diff — the regression was introduced *and* fixed
inside this window. But the fixed shape is legible and I can name the exact line that carries it.**

Two facts first, both measured:

1. The error text is **vendored and unchanged**: `The SSO session token associated with profile=${o} was not found or is invalid.`
   at `:82272-82275` in 220 and `:77776-77779 (193)` — byte-identical `@aws-sdk/token-providers`.
   `sso_region` is 9/9 and every hit is inside the vendored SDK. There is **no Claude Code literal**
   for this bullet; a string-first approach cannot find it.
2. The bullet explicitly says *"(2.1.207 regression)"* — i.e. the cause is §1's new
   `getDefaultAwsProviderChain`, which did not exist in 2.1.193.

### Where the region can leak, in the vendored SDK

```javascript
// ORIGINAL (:83893-83901, inside GNi = the SSO credential resolver):
E =
  i ||
  new y(
    Object.assign({}, s ?? {}, {
      logger: s?.logger ?? a?.logger,
      region: s?.region ?? n,
      userAgentAppId: s?.userAgentAppId ?? a?.userAgentAppId,
    }),
  ),
```

with `s = clientConfig`, `a = parentClientConfig`, `n = ssoRegion` (read from the profile /
`sso-session` block at `:83981`, and cross-checked for conflicts at `:83972-83978`). So:

> **`SSOClient.region = clientConfig.region ?? profile.sso_region`.**

If the caller puts the *Bedrock* region into `clientConfig`, the SSO `GetRoleCredentials` call is sent
to `portal.sso.<bedrock-region>.amazonaws.com`, where the cached SSO session token — issued against
`sso_region` — is unknown. The SDK reports it as *"not found or is invalid"*. That is exactly the
reported symptom, and it explains why it only affected profiles where the two regions differ.

### The fixed shape in 2.1.220

Look again at `oW`'s two config objects (`:156105-156109`):

```javascript
parentClientConfig: { region: e, requestHandler: n ?? new pXi.FetchHttpHandler({ requestTimeout: XIt }) },
clientConfig:       {            requestHandler: n ?? new pXi.FetchHttpHandler({ requestTimeout: XIt }) },
```

The asymmetry is the fix and it is deliberate: the Bedrock region goes into **`parentClientConfig`
only**. Reading `:83896-83900`, `parentClientConfig` contributes only `logger` and `userAgentAppId` to
the `SSOClient` — it can never override the region — while `clientConfig` would. Both objects still get
the proxy-aware request handler, because the transport must be identical for both; only the region is
withheld.

`parentClientConfig.region` still does useful work elsewhere in the chain: `fromNodeProviderChain`'s
`fromIni` assume-role branch uses it as the STS region, which is what the
`https://sts.${e}.amazonaws.com` handler (`:156103`) is built for.

**Honest limitation.** I have not read the 2.1.207 build, so I cannot show the deleted `region:` key.
What I can show is (i) the SDK line that makes `clientConfig.region` override `sso_region`, (ii) that
2.1.220 pointedly omits `region` from `clientConfig` while including it in `parentClientConfig`, and
(iii) that this asymmetry has no other purpose. That is a reconstruction, and it is labelled as one.

---

## 3. `.206` — the multi-minute Bedrock startup hang with `awsCredentialExport`

> *"Bedrock: fixed a multi-minute startup hang when using an `awsCredentialExport` helper on networks
> with restricted egress."*

**Verdict: CARRYOVER at the helper; NOT ISOLATED. I can rule out the obvious explanation and bound
where the fix must live.**

**Ruling out "they added a timeout to the helper".** The helper runner is byte-equivalent across the
two builds:

```javascript
// ORIGINAL (:154773 in 220) — runAwsCredentialExport (bHg):
let t = await OO(e, { reject: !1 });

// ORIGINAL (:135928 (193)) — the same call in bmd:
let t = await jk(e, { reject: !1 });
```

**Neither has a timeout.** Compare the siblings, which do: `awsAuthRefresh` uses
`bXi.exec(e, { timeout: _Hg, signal: t, windowsHide: !0 })` with `_Hg = 180000` (3 min, `:154729`,
`:155996`) and prints *"AWS auth refresh timed out after 3 minutes"*; `apiKeyHelper` uses
`OO(t, { timeout: 600000, reject: !1 })` (`:154668`). `awsCredentialExport` is the only one of the
three credential helpers with no execution ceiling, in **both** builds. So the fix is not there.

**Ruling out "the prefetch became non-blocking".** `prefetchAwsCredentialsAndBedRockInfoIfSafe`
(`eVr`, `:154922-154930`) already fire-and-forgets: `(JQ(), Km());` — no `await`. Its three startup
call sites (`:828954-828956`, for Bedrock / anthropicAws / Mantle) likewise do not await. Same shape
in 193.

**What *is* new around it, and therefore where the fix must be.** With an `awsCredentialExport` helper
configured, `refreshAndGetAwsCredentials` (`JQ`, `:156086-156095`) is the credential source:

```javascript
// ORIGINAL (:156086-156095):
JQ = UOe(
  async () => {
    let e = performance.now();
    w("[API:auth] AWS credential resolve start");
    let t = await yHg(),          // awsAuthRefresh, if configured
      r = await bHg();            // awsCredentialExport, if configured
    if (t) (await nFc(), oW.cache.clear());
    return (w(`[API:auth] AWS credential resolve done in ${Math.round(performance.now() - e)}ms`), r);
  },
  (e) => Xeu(e?.expiration),
);
```

and its **result decides whether the default chain runs at all** (`:100037-100044`):

```javascript
let o = await JQ();
if (o) n.credentials = { accessKeyId: o.accessKeyId, secretAccessKey: o.secretAccessKey, sessionToken: o.sessionToken };
else if (!Z.CLAUDE_CODE_SKIP_AWS_CRED_CACHE) n.credentials = async (i) => (await oW(t))(i);
```

If the export helper returns nothing (it logs and returns `null` on any failure, `:154787-154792`),
control falls through to `oW` — i.e. to `fromNodeProviderChain`, whose IMDS step dials
`169.254.169.254` and whose SSO step dials `portal.sso.<region>.amazonaws.com`. On a restricted-egress
network those connections do not refuse, they **black-hole**, and the AWS SDK's default retry policy
turns each into minutes. In 2.1.193 that fallback path was un-timed and un-cached, so it ran per
request; in 2.1.220 it is bounded by `XIt = 30_000` per STS request (`:155999`) and by
`resolveWithStallGuard`'s 60 s ceiling (§4), and its result is cached.

So the honest statement is: **the `.206`, `.207` #21 and `.208` #46 bullets all land on one subsystem
that was introduced and repaired entirely between the two bundles I can read.** The end state is fully
documented above; attributing individual lines to individual bullets would require the `.206`/`.207`
builds, which are not in the tree. `19` other bullets in this window are anchorable to a single line;
these three are not, and saying so is more useful than guessing.

---

## 4. `.207` — the Windows 60-second stall guard for a stuck `credential_process`

> *"Fixed an indefinite hang on Windows when AWS credential resolution stalls (e.g. a stuck
> `credential_process`): the 60-second stall guard now fires instead of waiting forever."*

**Verdict: NET_NEW.** (Note: the task brief attributes this to `.214`; it is
`CHANGELOG.md:395`, inside the **2.1.207** section which spans lines 373-399.)

`resolveWithStallGuard` **220=1 / 193=0**; `AWS default-chain credential resolve timed out` **220=1 / 193=0**;
`CLAUDE_CODE_AWS_CHAIN_RESOLVE_TIMEOUT_MS` **220=2 / 193=0**.

```javascript
// ============================================
// resolveWithStallGuard - bound the AWS default-chain resolution, defaulting to 60 s
// Location: cli_inner_pretty.js:154799-154820
// ============================================

// ORIGINAL (for source lookup):
async function Jeu(e, t = Z.CLAUDE_CODE_AWS_CHAIN_RESOLVE_TIMEOUT_MS ?? 60000) {
  let r;
  try {
    return await Promise.race([
      e,
      new Promise((n, o) => {
        r = setTimeout(
          (i) =>
            i(
              Object.assign(Error("AWS default-chain credential resolve timed out"), {
                name: "CredentialsProviderError",
              }),
            ),
          t,
          o,
        );
      }),
    ]);
  } finally {
    (clearTimeout(r), e.catch(() => {}));
  }
}

// READABLE (for understanding):
async function resolveWithStallGuard(pending, timeoutMs = env.CLAUDE_CODE_AWS_CHAIN_RESOLVE_TIMEOUT_MS ?? 60_000) {
  let timer;
  try {
    return await Promise.race([
      pending,
      new Promise((_resolve, reject) => {
        timer = setTimeout(
          (rej) => rej(Object.assign(Error("AWS default-chain credential resolve timed out"),
                                     { name: "CredentialsProviderError" })),
          timeoutMs,
          reject,                         // passed as setTimeout's extra arg, not captured by closure
        );
      }),
    ]);
  } finally {
    clearTimeout(timer);
    pending.catch(() => {});              // the loser may still reject later — pre-attach a sink
  }
}

// Mapping: Jeu→resolveWithStallGuard, e→pending, t→timeoutMs, r→timer
```

**What it does:** converts an unbounded credential resolution into one that rejects after 60 seconds
with an error the AWS SDK already understands.

**How it works, and the four details that matter:**

1. **`name: "CredentialsProviderError"`.** This is not cosmetic. The AWS SDK's chain machinery
   discriminates on `error.name`; a `CredentialsProviderError` is a recognised "this provider could not
   supply credentials" signal, so the timeout surfaces through the same path as any other credential
   failure — the caller sees a normal credential error, not a stray `Error: timed out` that no handler
   is written for.
2. **`e.catch(() => {})` in `finally` (`:154818`).** Without it, when the timer wins the race and the
   underlying resolution *later* rejects, Node emits an unhandled promise rejection — which, in a
   process that installs a strict rejection handler, would be a crash. This one clause is the
   difference between a graceful timeout and a delayed abort.
3. **`clearTimeout` in `finally`, not after the race.** If `pending` wins, the 60-second timer would
   otherwise keep the event loop alive; `clearTimeout` on every exit path keeps startup-time
   resolutions from delaying process exit.
4. **`setTimeout(fn, ms, reject)`** passes `reject` as an argument rather than closing over it. This
   is a micro-optimisation that also avoids retaining the promise executor's scope for a minute.

**Why 60 seconds, and why it is env-overridable.** The guard has to be longer than a legitimate slow
resolution — an interactive `credential_process` that prompts for an MFA code, or an SSO refresh over
a VPN, can genuinely take 20–40 s. 60 s is above that and below the "user assumes it is hung" line.
It is the *only* AWS constant in this module exposed as an env var
(`CLAUDE_CODE_AWS_CHAIN_RESOLVE_TIMEOUT_MS`, accessor registered alongside the other typed env reads),
which is the tell that Anthropic expected enterprise `credential_process` scripts to sometimes need more.

**Why Windows specifically.** The guard is platform-independent, but the failure it prevents is not:
on POSIX a hung child process is usually reaped or killed by the SDK's own handling, whereas a Windows
`credential_process` that opens a hidden console and waits on input never returns and is not killed by
anything in the chain. The one call site — `:156110`, `return Jeu(o());` inside `oW` — is the resolution
of `fromNodeProviderChain`, which is precisely the code path that spawns `credential_process`.

Its companion, `AWS_CHAIN_RESOLVE_REQUEST_TIMEOUT_MS` (`XIt = 30000`, `:155999`), bounds each individual
HTTP request rather than the whole chain, and is applied three ways at `:156103-156108` (the STS
handler and both `FetchHttpHandler` fallbacks) plus once in the Bedrock setup wizard (`:580981-580983`).
Two layers: 30 s per request, 60 s for everything. The ratio allows exactly one retry of one request
inside the outer budget.

---

## 5. `.198` — `awsAuthRefresh` running automatically on STS expiry

> *"Fixed Claude Platform on AWS and Mantle sessions dead-ending with `Please run /login` when the STS
> token expires — `awsAuthRefresh` now runs automatically."*

**Verdict: CARRYOVER — and I can close the question `_GROUND_TRUTH` left open.**

`_GROUND_TRUTH` records `awsAuthRefresh` 220=10 / 193=10 and says *"the refresh helper exists in 193;
only the auto-invocation point can be a delta, and I could not isolate it."* I read both invocation
points. **They are byte-equivalent.**

```javascript
// ============================================
// runAwsAuthRefreshIfStsExpired - the auto-invocation point, IDENTICAL in both builds
// Location: cli_inner_pretty.js:154687-154722   (was :135842-135877 (193))
// ============================================

// ORIGINAL (2.1.220, :154699-154721):
  if (YIt) return YIt;
  try {
    return (
      w("Fetching AWS caller identity for AWS auth refresh command"),
      await rFc(),
      w("Fetched AWS caller identity, skipping AWS auth refresh command"),
      !1
    );
  } catch {
    if (YIt) return YIt;
    if (yno !== null && Date.now() - yno < gHg) return !1;
    return (
      (YIt = (async () => {
        try { return await Q8r(e); } finally { if (t === mXi) yno = Date.now(); YIt = null; }
      })()),
      YIt
    );
  }

// ORIGINAL (2.1.193, :135854-135876) — same structure, different mangled names:
  if (v2e) return v2e;
  try {
    return (T("Fetching AWS caller identity for AWS auth refresh command"), await OYs(),
            T("Fetched AWS caller identity, skipping AWS auth refresh command"), !1);
  } catch {
    if (v2e) return v2e;
    if (CAn !== null && Date.now() - CAn < hmd) return !1;
    return ((v2e = (async () => { try { return await kAn(e); } finally { if (t === k3r) CAn = Date.now(); v2e = null; } })()), v2e);
  }

// READABLE (for understanding):
async function runAwsAuthRefreshIfStsExpired() {
  const cmd = getConfiguredAwsAuthRefresh();
  const generation = cooldownGeneration;
  if (!cmd) return false;
  if (isAwsAuthRefreshFromProjectSettings() && !isWorkspaceTrusted() && !isNonInteractive()) { /* refuse + telemetry */ }
  if (inFlightRefresh) return inFlightRefresh;                 // single-flight
  try {
    log("Fetching AWS caller identity for AWS auth refresh command");
    await stsGetCallerIdentity();                              // probe: are current creds still good?
    log("Fetched AWS caller identity, skipping AWS auth refresh command");
    return false;                                              // still valid -> do nothing
  } catch {
    if (inFlightRefresh) return inFlightRefresh;
    if (lastAttemptAt !== null && Date.now() - lastAttemptAt < REFRESH_COOLDOWN_MS) return false;  // 30 s
    inFlightRefresh = (async () => {
      try { return await refreshAwsAuth(cmd); }
      finally { if (generation === cooldownGeneration) lastAttemptAt = Date.now(); inFlightRefresh = null; }
    })();
    return inFlightRefresh;
  }
}
// REFRESH_COOLDOWN_MS = gHg = 30_000 (:155992); generation counter mXi reset by resetAwsAuthRefreshCooldown (ZIt, :154836)

// Mapping: yHg→runAwsAuthRefreshIfStsExpired, rFc→stsGetCallerIdentity, Q8r→refreshAwsAuth,
//          YIt→inFlightRefresh, yno→lastAttemptAt, mXi→cooldownGeneration, gHg→REFRESH_COOLDOWN_MS
```

The **probe-then-refresh** design — call `sts:GetCallerIdentity` and treat *any* throw as "credentials
are dead, run the helper" — is present in 2.1.193 with identical log strings, identical single-flight
latch, identical 30-second cooldown and identical generation counter. So the `.198` bullet describes a
mechanism that already shipped.

**What is genuinely new in the same neighbourhood**, and is the better story for `.198`'s
*"dead-ending with Please run /login"* half:

```javascript
// ORIGINAL (:534683-534686) — the AWS auth retry breaker, 220-only:
if (J9s(b, o.model) || WXn(b)) {
  if (u >= GU_) throw (pe("api_request", "api_request_aws_auth_exhausted"), new U4(b, o));
  u++;
}
// with (:534872-534876):
function J9s(e, t) {
  if (!(e instanceof hi) || e.status !== 401) return !1;
  let r = ny(t);
  return r === "anthropicAws" || r === "mantle";
}
// and GU_ = 2 (:534998)
```

`api_request_aws_auth_exhausted` is **220=1 / 193=0**, and `J9s` names **exactly the two providers in
the bullet** — `anthropicAws` and `mantle`. Read together with `ZU_` (§1.3), the shape is: a 401 on
Claude-Platform-on-AWS or Mantle is now classified as *refreshable* (so the retry loop clears the AWS
credential caches and re-signs) up to two attempts, after which it fails with a dedicated SLO counter
instead of falling into the generic `Please run /login`. And the error mapper's AWS branch
(`:228620-228636`) now names the configured refresh command:

> `… · run /login and select "Claude Platform on AWS · refresh credentials", or run \`<awsAuthRefresh>\` in another terminal · API Error: …`

So: **the auto-refresh is carryover; the 401-is-refreshable classification for `anthropicAws`/`mantle`,
its 2-attempt breaker, and the remediation text are the delta.** That is a narrower and, I think,
truer reading of the bullet than "the helper now runs automatically".

---

## 6. `.205` — Cowork VM-mode local-agent sessions failing "Not logged in"

> *"Fixed Cowork VM-mode local-agent sessions failing to start with `Not logged in · Please run /login`
> on CLI 2.1.203+."*

**Verdict: DELTA — newly anchored. The scoping filed this UNANCHORED on `Not logged in` (4/4).**

The message really is carryover (`uir = "Not logged in \xB7 Please run /login"`, `:228940`, and the same
string at `:237973 (193)`). The fix is an **entrypoint-name alias**:

```javascript
// ============================================
// normalizeEntrypoint - accept the underscore spelling of the local-agent entrypoint
// Location: cli_inner_pretty.js:46447-46463
// ============================================

// ORIGINAL (for source lookup):
function Evh(e) {
  if (Z.CLAUDE_CODE_ENTRYPOINT) {
    if (Z.CLAUDE_CODE_ENTRYPOINT === "local_agent") Z.set("CLAUDE_CODE_ENTRYPOINT", "local-agent");
    if (Z.CLAUDE_CODE_ENTRYPOINT === "cli" && e) Z.set("CLAUDE_CODE_ENTRYPOINT", "sdk-cli");
    return;
  }
  ...
}

// READABLE (for understanding):
function normalizeEntrypoint(isSdkInvocation) {
  if (env.CLAUDE_CODE_ENTRYPOINT) {
    if (env.CLAUDE_CODE_ENTRYPOINT === "local_agent")            // 2.1.205: underscore -> hyphen
      env.set("CLAUDE_CODE_ENTRYPOINT", "local-agent");
    if (env.CLAUDE_CODE_ENTRYPOINT === "cli" && isSdkInvocation)
      env.set("CLAUDE_CODE_ENTRYPOINT", "sdk-cli");
    return;
  }
  // ... otherwise derive: `mcp serve` -> "mcp", CLAUDE_CODE_ACTION -> "claude-code-github-action", else cli/sdk-cli
}

// Mapping: Evh→normalizeEntrypoint, Z→typed env accessor
```

**Evidence this is the fix:**

- `grep -n 'local_agent'` in 2.1.193 returns **no** entrypoint-related hit — no normaliser, and the
  valid-entrypoint table at `:44071 (193)` contains only `"local-agent"`. The underscore spelling was
  simply an unrecognised entrypoint.
- In 2.1.220 the same table (`gvh`, `:46487-46515`) contains **both** `"local-agent": !0` and
  `local_agent: !0` (`:46497-46498`) — belt and braces: the alias is normalised *and* the raw form is
  accepted, so any code path that reads the env before `Evh` runs still validates.
- The auth surface tests the hyphen form in at least five places that decide whether a session is
  considered logged in through the host rather than through its own credential store:
  `SDK_OAUTH_REFRESH_ENTRYPOINTS` (`vXi = new Set(["claude-desktop", "local-agent", "claude-vscode"])`,
  `:156085`), `:152018`, `:162107` (`e === "local-agent" || e?.startsWith("claude-coworker")`),
  `:164911`, `:166689`, `:166916`, `:269050`, `:529477`, `:829569`. With the underscore spelling every
  one of those returns the wrong answer, and the session concludes it has no credential —
  *"Not logged in · Please run /login"*.
- The bullet's *"on CLI 2.1.203+"* fits: `local-agent` gained new auth-path significance in that
  range, so the pre-existing spelling mismatch only became fatal then.

`local-agent` occurrences went 17 → 21 and `remote_cowork` 7 → 12, consistent with the Cowork surface
growing in this window.

---

## 7. The provider channel inventory, from the credential side

`getAPIProvider` (`Hn`, `:100302-100317`) resolves eight channels. `47_models` documents the enum and
the catalogue mapping; here is the **credential** column, which that document does not cover:

| Channel | Credential source | Pre-flight | Host-managed override | Refresh classifier |
|---|---|---|---|---|
| `firstParty` | OAuth (`claudeAiOauth`) / `ANTHROPIC_API_KEY` / `apiKeyHelper` / `ANTHROPIC_AUTH_TOKEN` | — | — | `refreshOAuthTokenLocked` ([login doc](login_and_credentials.md) §3) |
| `bedrock` | `JQ()` → `awsAuthRefresh` + `awsCredentialExport`, else `oW(region)` | `eVr()` `:828954` | `p_e("Bedrock")` `:100035` | `ZU_` / `J9s` (§1.3, §5) |
| `anthropicAws` | same AWS stack | `eVr()` `:828955` | `p_e("Anthropic-on-AWS")` `:149614` | `J9s` → 401 refreshable |
| `mantle` | same AWS stack | `eVr()` `:828956` | `p_e("Mantle")` `:149671` | `J9s` → 401 refreshable |
| `vertex` | Google ADC | `Eno()` `:828957` | `Yv()` suppresses | `qlp` `:534892-534898` |
| `anthropicGoogleCloud` | Google ADC (**shares Vertex's `Eno()`**) | `Eno()` `:828958` | `Yv()` suppresses | `qlp` (same branch) |
| `foundry` | `ANTHROPIC_FOUNDRY_API_KEY` / `_AUTH_TOKEN` | — | — | — |
| `gateway` | `enterpriseGateway` record + TLS pin, or `CLAUDE_CODE_USE_GATEWAY` env triple | `AXi()` `:827757` | — | — |

Three credential-side observations that are *not* in `47_models`:

**(a) The host-managed AWS chain is a separate implementation.** `hostManagedAwsProviderChain`
(`Geu`, `:154275-154288`) and `hostManagedAwsSdkCredentials` (`p_e`, `:154302-154306`) build a chain
from only `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY`/`AWS_SESSION_TOKEN` or an explicit
`AWS_CONFIG_FILE`/`AWS_SHARED_CREDENTIALS_FILE` (`qeu`, `:154289-154297`) — never the default chain,
never IMDS, never SSO. If neither is present it throws `hostManagedNoCredsError` (`b8r`,
`:154269-154273`):
`"${provider} credentials are managed by the desktop app, but none are available. …"`
(`host-managed provider credentials unavailable — restart desktop app`, **220=1 / 193=0**).
The design point: a desktop-hosted session must not silently fall back to whatever ambient AWS
identity happens to exist on the machine.

**(b) `Weu` (`:155980-155981`, 220-only) is the background-agent carve-out**:
*"Background agents and teammates are not supported for this credential kind. Run this from the main
session, or switch the desktop app to a profile-based or API-key credential. …"* — thrown by `Geu`
(`:154286`) when a host-managed session with no exportable credential tries to spawn a background
worker. A background worker is a separate process; it cannot ask the desktop app for a credential over
the parent's IPC channel, so the failure is made explicit rather than deferred to a confusing 401.

**(c) The GCP channel reuses Vertex's pre-flight verbatim.** `:828957-828958` are consecutive lines
calling the *same* `Eno()` (`prefetchGcpCredentialsIfSafe`, `:154915-154921`), and the refresh
classifier `qlp` (`:534892-534898`) treats Vertex and Google Cloud identically. The credential story
for the "new" eighth provider is therefore almost free — it is Application Default Credentials pointed
at `claude.googleapis.com` instead of `*-aiplatform.googleapis.com`. `Eno` itself is guarded:
`if (!qer()) return;` (no `gcpAuthRefresh` configured → nothing to do) and
`if (Z8r()) { if (!Jd() && !yn()) return; }` (a **project-settings-sourced** helper is not executed
before workspace trust) — the same trust gate `awsAuthRefresh`, `awsCredentialExport` and
`apiKeyHelper` all carry.

---

## 8. The gateway on-ramp: two new env vars and a TLS pin

The `gateway` channel short-circuits `getAPIProvider` before every env var (`:100303`), so its
credential path is worth stating explicitly.

### `CLAUDE_CODE_USE_GATEWAY` — 220=8 / 193=2, and 193's two are dead

Both 2.1.193 occurrences (`:192886 (193)`, `:193027 (193)`) are *membership in allow-lists*. There is
no accessor and no consumer: the name was reserved, not implemented. 2.1.220 adds the typed accessor
(`:32928`) and a real handler:

```javascript
// ORIGINAL (:154342-154359, inside restoreGatewayAuth):
if (Z.CLAUDE_CODE_USE_GATEWAY) {
  let e = Z.ANTHROPIC_BASE_URL,
    t = Z.ANTHROPIC_AUTH_TOKEN;
  if (e && t) {
    let r;
    try { r = mno(e); } catch (o) { throw Error(`CLAUDE_CODE_USE_GATEWAY is set but ANTHROPIC_BASE_URL is invalid: ${le(o)}`); }
    let n = fGr(t);
    U5e({ url: r, jwt: t, expiresAt: n !== null ? n * 1000 : Number.MAX_SAFE_INTEGER, unpinned: !0 });
    return;
  }
  w("CLAUDE_CODE_USE_GATEWAY is set but ANTHROPIC_BASE_URL or ANTHROPIC_AUTH_TOKEN is missing; ignoring", { level: "warn" });
}
```

Three decisions in nine lines:

1. **It is a three-variable contract.** `CLAUDE_CODE_USE_GATEWAY` alone does nothing; without both
   `ANTHROPIC_BASE_URL` and `ANTHROPIC_AUTH_TOKEN` it warns and falls through to the normal
   `enterpriseGateway` restore. Warn-and-continue rather than throw, because a half-configured CI
   environment should still be able to authenticate the ordinary way.
2. **An invalid URL *throws*.** `mno` (`normalizeGatewayUrl`) refuses plain `http://` off-loopback;
   here the failure is fatal rather than ignored, because a malformed gateway URL with a valid token
   present means the operator intended gateway routing and getting it wrong would send the token
   somewhere unintended.
3. **`unpinned: !0`.** This session deliberately skips the TLS-fingerprint pin that an interactive
   `/login`-established gateway carries. The rationale is legible: an env-configured gateway is set by
   the operator of the environment (a CI runner, a container), who already controls the trust store;
   there is no first-connection ceremony in which to record a pin. The cost is that
   `restoreGatewayAuth`'s fingerprint-change check
   (`Cloud gateway ${r} TLS certificate changed since you connected — run /login to verify and reconnect.`,
   `:154383`) does not protect this path. This is exactly the sort of trade-off a reader should notice:
   the convenient on-ramp is the less-protected one.
4. The JWT's `exp` claim becomes the session expiry, defaulting to `Number.MAX_SAFE_INTEGER` when the
   token is not a decodable JWT — i.e. an opaque gateway token never expires client-side and the
   gateway itself must reject it.

The `/status` and Remote Control surfaces name the variable when explaining why a session is not
first-party (`:535662`):
`CLAUDE_CODE_USE_GATEWAY is set (the gateway on-ramp also requires ANTHROPIC_BASE_URL and ANTHROPIC_AUTH_TOKEN), so this session is routed through a cloud gateway — …`

### `CLAUDE_GATEWAY_ALLOW_LOOPBACK` — 220=2 / 193=1, and the consumer is new

The accessor existed in 193 (`:43833 (193)`); the **consumer** does not. In 220 it is read by
`Xyi` (`:860522-860524`) and used inside an address classifier (`NEl`, `:860525-…`):

```javascript
// ORIGINAL (:860522-860542, elided):
function Xyi() { return Yt(process.env.CLAUDE_GATEWAY_ALLOW_LOOPBACK); }
function NEl(e) {
  let t; try { t = Qyi.parse(e.replace(/^\[|\]$/g, "")); } catch { return !1; }
  if (t.kind() === "ipv6") {
    let o = t;
    if (o.isIPv4MappedAddress()) t = o.toIPv4Address();
    else {
      let i = o.range();
      if (i === "linkLocal") return !0;
      if (i === "loopback" || i === "unspecified") return !Xyi();
      if (o.toNormalizedString() === "fd00:ec2:0:0:0:0:0:254") return !0;
      return !1;
    }
  }
  ...
}
```

`return !Xyi()` is the whole point: a loopback address is normally treated as blocked, and the env var
flips it. `fd00:ec2::254` is hard-coded as always-blocked because it is the **EC2 IMDS IPv6 endpoint** —
the same SSRF target as `169.254.169.254`, which the link-local branch above already covers. The
variable exists so a developer can point a gateway at `localhost` without disabling the SSRF guard for
metadata endpoints.

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
- `getDefaultAwsProviderChain` (`oW`, `:156097-156121`) — the per-(profile, region) credential cache
- `awsCacheKey` (`Qeu`, `:154821-154823`) / `credentialCacheTtl` (`Xeu`, `:154794-154798`)
- `memoizeWithTtl` (`UOe`, `:50964-51015`) / `memoizeByKey` (`jOe`, `:51039-…`)
- `resolveWithStallGuard` (`Jeu`, `:154799-154820`) with `CLAUDE_CODE_AWS_CHAIN_RESOLVE_TIMEOUT_MS` (default 60000)
- `AWS_CHAIN_RESOLVE_REQUEST_TIMEOUT_MS` (`XIt = 30000`, `:155999`)
- `getAWSProxyRequestHandler` (`RXt`, `:86525-86534`) / `getAWSClientProxyConfig` (`IXt`, `:86519-86524`)
- `invalidateDefaultAwsProviderChainDebounced` (`Wer`, `:154824-154829`) with `AWS_INVALIDATE_DEBOUNCE_MS` (`SHg = 1e4`, `:156001`)
- `clearAwsCredentialsCache` (`Exe`, `:154830-154832`) / `clearAwsHelperCredentialsCache` (`kXi`, `:154833-154835`)
- `refreshAndGetAwsCredentials` (`JQ`, `:156086-156095`)
- `runAwsAuthRefreshIfStsExpired` (`yHg`, `:154687-154722`) — carryover; cooldown `gHg = 30000` (`:155992`)
- `refreshAwsAuth` (`Q8r`, `:154723-154755`) — exec timeout `_Hg = 180000` (`:155996`)
- `runAwsCredentialExport` (`bHg`, `:154756-154793`) — **no timeout, both builds**
- `prefetchAwsCredentialsAndBedRockInfoIfSafe` (`eVr`, `:154922-154930`)
- `stsGetCallerIdentity` (`rFc`, `:118015-118018`) / `clearAwsSdkIniCache` (`nFc`, `:118019-118027`)
- `AWS_AUTH_ERROR_PATTERN` (`Ccg`, `:118032-118033`)
- `isAwsAuth401ForClaudePlatform` (`J9s`, `:534872-534876`) + `AWS_AUTH_RETRY_LIMIT` (`GU_ = 2`, `:534998`)
- `handleRetryableAuthError` (`ZU_`, `:534877-534882`)
- `hostManagedAwsProviderChain` (`Geu`, `:154275-154288`) / `hostManagedAwsSdkCredentials` (`p_e`, `:154302-154306`)
- `hostManagedNoCredsError` (`b8r`, `:154269-154273`) / `BG_UNSUPPORTED_CREDENTIAL_MSG` (`Weu`, `:155980-155981`)
- `prefetchGcpCredentialsIfSafe` (`Eno`, `:154915-154921`) / `refreshGcpCredentialsIfNeeded` (`ist`, `:156123`)
- `isGcpCredentialError` (`qlp`, `:534892-534898`)
- `normalizeEntrypoint` (`Evh`, `:46447-46463`) + the entrypoint table (`gvh`, `:46487-46515`)
- `SDK_OAUTH_REFRESH_ENTRYPOINTS` (`vXi`, `:156085`)
- `restoreGatewayAuth` gateway-env branch (`:154342-154359`)
- `gatewayLoopbackAllowed` (`Xyi`, `:860522-860524`) / `isBlockedGatewayAddress` (`NEl`, `:860525-…`)
- vendored SSO region resolution `region: s?.region ?? n` (`GNi`, `:83898`)
