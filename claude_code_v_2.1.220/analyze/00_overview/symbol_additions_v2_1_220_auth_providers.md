# Symbol additions from `55_auth_providers/` (v2.1.220) — staged for merge

Format per [`../_CONVENTIONS.md`](../_CONVENTIONS.md) §6:
`| Obfuscated | Readable | File:Line | Type |`, sorted alphabetically by obfuscated name inside each
module section.

**Every line number below was read in the 2.1.220 bundle**
(`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`, 872,596 lines,
build `4073f595`). File column is `cli_inner_pretty.js` throughout; only the line range is given.

⚠ **Symbol ids are re-mangled between builds and old ids get reused.** None of these names may be
carried into another tree. The stable anchor is always the string literal / gate / env var noted in the
Readable column.

**Provenance note.** Most readable names in the `Auth Core`, `AWS Credentials` and `OAuth Lifecycle`
groups are not inferred — they are the bundle's own, taken from the auth module's export table at
`cli_inner_pretty.js:154127-154262` (`tt(kY, { … })`) and the mTLS / proxy export tables at
`:65115-65124` and `:86255-86280`. Where a name is inferred rather than read, the Readable column says
so with a `—` gloss.

---

## Merge routing

| Group below | Merge into |
|---|---|
| `## Module: Auth Core` | `symbol_index_infra_platform.md` (Auth) |
| `## Module: OAuth Lifecycle` | `symbol_index_infra_platform.md` (Auth) |
| `## Module: API Key Helper` | `symbol_index_infra_platform.md` (Auth) |
| `## Module: AWS Credentials` | `symbol_index_infra_platform.md` (Auth) |
| `## Module: Gateway Auth` | `symbol_index_infra_platform.md` (Auth) |
| `## Module: Transport / mTLS / Proxy` | `symbol_index_infra_platform.md` (Auth) |
| `## Module: Host-Managed Settings` | `symbol_index_infra_platform.md` (Permissions ↔ Auth boundary; keep with Auth) |
| `## Module: Feature Gates (auth-coupled)` | `symbol_index_infra_platform.md` (Telemetry) |
| `## Module: Auth UI Surfaces` | `symbol_index_infra_integration.md` (UI Components) |

---

## Module: Auth Core

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aN` | `getConfiguredApiKeyHelper` — resolves the `apiKeyHelper` setting (flag settings when remote) | cli_inner_pretty.js:154571-154575 | function |
| `b8r` | `hostManagedNoCredsError` — `"${provider} credentials are managed by the desktop app, but none are available…"` | cli_inner_pretty.js:154269-154273 | function |
| `Dc` | `isFirstPartyApiSurface` — used as a conjunct in the `apiKeyHelper` 401 breaker | cli_inner_pretty.js:534687 (call site) | function |
| `Geu` | `hostManagedAwsProviderChain` — env/ini-only chain for host-managed AWS; throws `Weu` if neither is present | cli_inner_pretty.js:154275-154288 | function |
| `Hn` | `getAPIProvider` — the eight-way provider ladder (also in `47_models`) | cli_inner_pretty.js:100302-100317 | function |
| `jer` | `isApiKeyHelperTheActiveCredential` | cli_inner_pretty.js:154471-154473 | function |
| `JIt` | `isRemoteOrHostAuthContext` — `CLAUDE_CODE_REMOTE \|\| G$()` | cli_inner_pretty.js:154263-154265 | function |
| `kY` | `AUTH_MODULE_EXPORTS` — the 135-name export table; the primary naming key for this theme | cli_inner_pretty.js:154127-154262 | object |
| `p_e` | `hostManagedAwsSdkCredentials` — `{providerChainResolver, credentials}` pair for host-managed AWS | cli_inner_pretty.js:154302-154306 | function |
| `qeu` | `readAwsEnvCredentialInputs` — `{accessKeyId, secretAccessKey, profile, configFile, credsFile}` | cli_inner_pretty.js:154289-154297 | function |
| `Weu` | `BG_UNSUPPORTED_CREDENTIAL_MSG` — "Background agents and teammates are not supported for this credential kind…" (220-only) | cli_inner_pretty.js:155980-155981 | constant |
| `Y8r` | `isFirstPartyManagedOAuthContext` — remote && no host-auth env var && entrypoint ≠ `claude-desktop-3p` | cli_inner_pretty.js:154307-154309 | function |
| `Yv` | `isHostManagedProviderAuth` — `Z.CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST` (name is 220=1/193=0) | cli_inner_pretty.js:154266-154268 | function |
| `zb` | `isAnthropicAuthEnabled` — the "is this an OAuth-capable first-party session" predicate | cli_inner_pretty.js:154398-154415 | function |

---

## Module: OAuth Lifecycle

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$xr` | `getLoginExpiryWarning` — returns `{daysLeft}` inside the warning window, else null | cli_inner_pretty.js:687497-687506 | function |
| `_no` | `KNOWN_DEAD_REFRESH_TOKENS` — process-local set, populated on `invalid_grant` | cli_inner_pretty.js:156130 | variable |
| `ast` | `isOAuthRefreshKnownDead` — `refreshToken === "" \|\| _no.has(refreshToken)`; also reads the store directly | cli_inner_pretty.js:155039-155053 | function |
| `DXi` | `withOAuthRefreshLock` — lock + read, exposes `{lockedTokens, lockAttempts, isCompromised}`; retry cap `LHg = 5` | cli_inner_pretty.js:155246-155278 | function |
| `Dy` | `checkAndRefreshOAuthTokenIfNeeded` — boolean wrapper over `vno` | cli_inner_pretty.js:155279-155281 | function |
| `eey` | `LOGIN_EXPIRED_MESSAGE` — `"Login expired · Please run /login"` (220=1/193=0) | cli_inner_pretty.js:228953 | constant |
| `EW` | `clearOAuthTokenCache` | cli_inner_pretty.js:155056 | function |
| `gXi` | `oauthRefreshLockOptions` — `stale: 60000`, `update: 5000`, `onCompromised` forwards to the caller | cli_inner_pretty.js:155205-155215 | function |
| `LHg` | `OAUTH_LOCK_MAX_ATTEMPTS` = 5 | cli_inner_pretty.js:156018 | constant |
| `LXi` | `acquireOAuthRefreshLock` — dual (new + legacy) lock returning `{isCompromised, signal, release}` | cli_inner_pretty.js:155216-155245 | function |
| `ms` | `getClaudeAIOAuthTokens` (sync) | cli_inner_pretty.js:156010 (decl), :154224 (export) | variable |
| `EB` | `getClaudeAIOAuthTokensAsync` | cli_inner_pretty.js:156164 (assignment), :154223 (export) | variable |
| `rff` | `ONE_DAY_MS` = 86400000 | cli_inner_pretty.js:687507 | constant |
| `rtu` | `mergeOAuthRecord` — preserves `refreshTokenExpiresAt` / `subscriptionType` / `rateLimitTier` across a partial update | cli_inner_pretty.js:154993-155004 | function |
| `tff` | `LOGIN_EXPIRY_WARN_WINDOW_MS` = `3 * rff` — **the `.217` 5→3 day constant** | cli_inner_pretty.js:687508 (decl), :687512 (assignment) | constant |
| `Ver` | `saveOAuthTokensIfNeeded` — persists + emits `tengu_oauth_tokens_saved` / `_save_failed` | cli_inner_pretty.js:155005-… (read :155005-155029) | function |
| `vno` | `checkAndRefreshOAuthTokenIfNeededWithOutcome` — dedupes the depth-0 non-forced call via `j8r` | cli_inner_pretty.js:155282-155293 | function |
| `WQt` | `OAuthRefreshDeadError` — `"OAuth refresh token is no longer valid; run /login to re-authenticate"` | cli_inner_pretty.js:121405-121410 | class |
| `yXi` | `refreshOAuthTokenLocked` — the full refresh state machine; three `isCompromised()` checkpoints + CAS write | cli_inner_pretty.js:155297-155430 | function |

Gates first seen here (all 220-only unless noted; add to the gate register, not the symbol table):
`tengu_oauth_token_refresh_lock_compromised_pre_post` `:155352`,
`tengu_oauth_token_refresh_lock_compromised_post_post` `:155367`,
`tengu_oauth_refresh_compromised_cas_saved` / `tengu_oauth_refresh_compromised_cas_adopted_sibling` `:155386`,
`tengu_oauth_token_refresh_lock_compromised_in_catch` `:155394`,
`tengu_oauth_refresh_invalid_scope_fallback` `:155363`,
`tengu_oauth_gateway_forced` `:584098`.

---

## Module: API Key Helper

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$eu` | `runApiKeyHelperAndCache` — caches `" "` on failure; records `fXi`; drives the auth-status UI | cli_inner_pretty.js:154628-154651 | function |
| `_er` | `getApiKeyFromApiKeyHelper` — TTL cache + background revalidation | cli_inner_pretty.js:154617-154627 | function |
| `Ber` | `apiKeyHelperCacheGeneration` — bumped by `Ger()`; guards against publishing a stale result | cli_inner_pretty.js:155987 | variable |
| `fHg` | `execApiKeyHelper` — `OO(cmd, {timeout: 600000, reject: !1})`; throws `"timed out" \| "exited N"` + stderr(500) | cli_inner_pretty.js:154652-154672 | function |
| `fXi` | `apiKeyHelperLastFailure` — the remembered error string | cli_inner_pretty.js:155988 | variable |
| `Ger` | `clearApiKeyHelperCache` | cli_inner_pretty.js:154680-154682 | function |
| `J8r` | `getApiKeyHelperLastFailure` — null unless a helper is configured (name 220=1/193=0) | cli_inner_pretty.js:154676-154679 | function |
| `Sno` | `getApiKeyHelperElapsedMs` — drives the "apiKeyHelper is taking a while" spinner row | cli_inner_pretty.js:154613-154616 | function |
| `tey` | `API_KEY_HELPER_FAILING_MESSAGE` — "Your apiKeyHelper script is failing · … · Run /status to see the script's error output" (220=1/193=0) | cli_inner_pretty.js:228957-228958 | constant |
| `Ude` | `apiKeyHelperCachedKey` — `{value, timestamp}`; `" "` is the failure sentinel | cli_inner_pretty.js:155985 | variable |
| `uHg` | `API_KEY_HELPER_DEFAULT_TTL_MS` = 300000 | cli_inner_pretty.js:155979 | constant |
| `V8r` | `getApiKeyFromApiKeyHelperCached` | cli_inner_pretty.js:154673-154675 | function |
| `WU_` | `API_KEY_HELPER_401_LIMIT` = 2 → surfaces on the 3rd 401 | cli_inner_pretty.js:534999 | constant |
| `Xqe` | `apiKeyHelperInFlight` — `{promise, startedAt}` | cli_inner_pretty.js:155986 | variable |
| `xXi` | `prefetchApiKeyFromApiKeyHelperIfSafe` | cli_inner_pretty.js:154683-154686 | function |
| `Yeu` | `calculateApiKeyHelperTTL` — `CLAUDE_CODE_API_KEY_HELPER_TTL_MS ?? uHg` | cli_inner_pretty.js:154605-154612 | function |

---

## Module: AWS Credentials

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bHg` | `runAwsCredentialExport` — parses STS JSON; **no execution timeout in either build** | cli_inner_pretty.js:154756-154793 | function |
| `Ccg` | `AWS_AUTH_ERROR_PATTERN` — `/ExpiredToken\|InvalidSignature\|SignatureDoesNotMatch\|UnrecognizedClient\|InvalidClientTokenId\|security token.*(invalid\|expired)\|signature we calculated does not match/i` | cli_inner_pretty.js:118032-118033 | constant |
| `eVr` | `prefetchAwsCredentialsAndBedRockInfoIfSafe` — fire-and-forget `(JQ(), Km())` (carryover shape) | cli_inner_pretty.js:154922-154930 | function |
| `Exe` | `clearAwsCredentialsCache` — clears `JQ`, `oW` and the debounce map | cli_inner_pretty.js:154830-154832 | function |
| `Feu` | `AWS_CRED_EXPIRY_MARGIN_MS` = 30000 — the hard-validity margin in `oW`'s predicate | cli_inner_pretty.js:155998 | constant |
| `gHg` | `AWS_AUTH_REFRESH_COOLDOWN_MS` = 30000 | cli_inner_pretty.js:155992 | constant |
| `hHg` | `AWS_CRED_TTL_SLACK_MS` = 60000 | cli_inner_pretty.js:155991 | constant |
| `hXi` | `awsChainInvalidateTimestamps` — key → last invalidation ms | cli_inner_pretty.js:156002 (decl), :156122 (init) | variable |
| `_Hg` | `AWS_AUTH_REFRESH_EXEC_TIMEOUT_MS` = 180000 (3 min) | cli_inner_pretty.js:155996 | constant |
| `Jeu` | `resolveWithStallGuard` — `Promise.race` with `CLAUDE_CODE_AWS_CHAIN_RESOLVE_TIMEOUT_MS ?? 60000`; rejects as `CredentialsProviderError` | cli_inner_pretty.js:154799-154820 | function |
| `JQ` | `refreshAndGetAwsCredentials` — TTL-cached `awsAuthRefresh` + `awsCredentialExport` pipeline | cli_inner_pretty.js:156086-156095 | variable |
| `kXi` | `clearAwsHelperCredentialsCache` — clears only `JQ.cache` | cli_inner_pretty.js:154833-154835 | function |
| `mHg` | `AWS_CRED_LONG_TTL_MS` = 3600000 — used for no-expiry and near-expiry credentials | cli_inner_pretty.js:155989 | constant |
| `mXi` | `awsAuthRefreshCooldownGeneration` — reset by `ZIt()` | cli_inner_pretty.js:155995 | variable |
| `Neu` | `AWS_CRED_REFRESH_AHEAD_MS` = 300000 | cli_inner_pretty.js:155990 | constant |
| `nFc` | `clearAwsSdkIniCache` — `fromIni({ignoreCache: true})()` to drop the SDK's own memo | cli_inner_pretty.js:118019-118027 | function |
| `oW` | `getDefaultAwsProviderChain` — per-`(AWS_PROFILE, region)` memoised, expiry-aware chain with stale-while-revalidate | cli_inner_pretty.js:156000 (decl), :156097-156121 (assignment) | variable |
| `Q8r` | `refreshAwsAuth` — runs the `awsAuthRefresh` command with a 3-minute timeout and an abort signal | cli_inner_pretty.js:154723-154755 | function |
| `Qeu` | `awsCacheKey` — `` `${AWS_PROFILE ?? ""}\0${region}` `` | cli_inner_pretty.js:154821-154823 | function |
| `rFc` | `stsGetCallerIdentity` — the "are the current credentials alive?" probe | cli_inner_pretty.js:118015-118018 | function |
| `SHg` | `AWS_INVALIDATE_DEBOUNCE_MS` = 10000 | cli_inner_pretty.js:156001 | constant |
| `Sxe` | `getConfiguredAwsAuthRefresh` | cli_inner_pretty.js:154584-154586 | function |
| `TXi` | `getConfiguredAwsCredentialExport` | cli_inner_pretty.js:154594-154598 | function |
| `Wer` | `invalidateDefaultAwsProviderChainDebounced` — one key, at most once per 10 s | cli_inner_pretty.js:154824-154829 | function |
| `Xeu` | `credentialCacheTtl` — `remaining - 300000`, or 1 h when there is no expiry / under 6 min left | cli_inner_pretty.js:154794-154798 | function |
| `XIt` | `AWS_CHAIN_RESOLVE_REQUEST_TIMEOUT_MS` = 30000 | cli_inner_pretty.js:155999 | constant |
| `yHg` | `runAwsAuthRefreshIfStsExpired` — probe-then-refresh; **byte-equivalent to `ymd` `:135842-135877 (193)`** | cli_inner_pretty.js:154687-154722 | function |
| `YIt` | `awsAuthRefreshInFlight` — single-flight latch | cli_inner_pretty.js:155994 | variable |
| `yno` | `awsAuthRefreshLastAttemptAt` | cli_inner_pretty.js:155993 | variable |
| `ZIt` | `resetAwsAuthRefreshCooldown` | cli_inner_pretty.js:154836-154838 | function |
| `ZU_` | `handleRetryableAuthError` — recognised AWS auth error → `Exe()`, else `kXi()` + debounced `Wer()` | cli_inner_pretty.js:534877-534882 | function |
| `J9s` | `isAwsAuth401ForClaudePlatform` — 401 && provider ∈ {`anthropicAws`, `mantle`} | cli_inner_pretty.js:534872-534876 | function |
| `GU_` | `AWS_AUTH_RETRY_LIMIT` = 2 → `api_request_aws_auth_exhausted` (220=1/193=0) | cli_inner_pretty.js:534998 (const), :534683-534686 (use) | constant |
| `qlp` | `isGcpCredentialError` — Vertex **and** `anthropicGoogleCloud` share the branch | cli_inner_pretty.js:534892-534898 | function |
| `e4_` | `isGoogleAdcLoadFailure` — three message substrings incl. `invalid_grant` | cli_inner_pretty.js:534883-534891 | function |
| `Eno` | `prefetchGcpCredentialsIfSafe` — trust-gated when `gcpAuthRefresh` comes from project settings | cli_inner_pretty.js:154915-154921 | function |
| `Sst` | `clearGcpCredentialsCache` | cli_inner_pretty.js:154912-154914 | function |
| `ist` | `refreshGcpCredentialsIfNeeded` — TTL `vHg = 3600000` | cli_inner_pretty.js:156123 | variable |
| `Evh` | `normalizeEntrypoint` — **`local_agent → local-agent`** alias (the `.205` Cowork fix) | cli_inner_pretty.js:46447-46463 | function |
| `gvh` | `VALID_ENTRYPOINTS` — now carries both `"local-agent"` and `local_agent` | cli_inner_pretty.js:46487-46515 | object |
| `vXi` | `SDK_OAUTH_REFRESH_ENTRYPOINTS` — `{claude-desktop, local-agent, claude-vscode}` | cli_inner_pretty.js:156085 | variable |

---

## Module: Gateway Auth

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aHg` | `ANTHROPIC_PUBLIC_GATEWAY_HOSTS` — `{claude.fedstart.com, claude.palantirfedstart.com}`; the `.206` carve-out | cli_inner_pretty.js:154113 | variable |
| `AXi` | `restoreGatewayAuth` — env on-ramp, TLS-pin re-verify, expiry check | cli_inner_pretty.js:154341-154397 | function |
| `B8r` | `probeGatewayTlsFingerprint` — raw TLS connect → lower-cased `fingerprint256`; `"http-loopback"` for `http:` | cli_inner_pretty.js:154013-154045 | function |
| `dno` | `isPrivateAddress` — RFC1918 + CGNAT + loopback + link-local + `fc00::/7` + `fe80::/10` + IPv4-mapped | cli_inner_pretty.js:153937-153956 | function |
| `hno` | `GATEWAY_TLS_PIN_MISMATCH_MSG` — "gateway TLS certificate does not match the pinned fingerprint" (220=1/193=0) | cli_inner_pretty.js:154100 | constant |
| `Knb` | `LOGIN_TLS_TRUST_FAILURE_CODES` — 6-code set local to the login/gateway wizard module (220-only) | cli_inner_pretty.js:582524-582530 | variable |
| `Leu` | `assertGatewayHostIsReachablePrivately` — the `/login` gateway pre-flight (host + proxy must be private) | cli_inner_pretty.js:153957-154012 | function |
| `mno` | `normalizeGatewayUrl` — adds `https://`, strips a trailing `/`, refuses off-loopback `http:` | cli_inner_pretty.js:153926-153936 | function |
| `NEl` | `isBlockedGatewayAddress` — link-local always blocked; loopback blocked unless `CLAUDE_GATEWAY_ALLOW_LOOPBACK`; `fd00:ec2::254` always blocked | cli_inner_pretty.js:860525-… | function |
| `sHg` | `GATEWAY_LOOPBACK_HOSTS` — `{localhost, 127.0.0.1, [::1]}` | cli_inner_pretty.js:154112 | variable |
| `Uer` | `getForcedLoginMethod` — `gateway` honoured only from `policySettings` | cli_inner_pretty.js:155947-155951 | function |
| `Xyi` | `gatewayLoopbackAllowed` — `CLAUDE_GATEWAY_ALLOW_LOOPBACK` (first consumer in 220) | cli_inner_pretty.js:860522-860524 | function |
| `jde` | `validateForceLoginOrg` — org-UUID pin with three `ANTHROPIC_UNIX_SOCKET` SLO counters | cli_inner_pretty.js:155849-155946 | function |
| `vst` | `validateForceLoginMethod` — the shared validator behind the four `.212` enforcement sites | cli_inner_pretty.js:155952-155974 | function |

---

## Module: Transport / mTLS / Proxy

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aOi` | `getMTLSAgent` — identity-compares `{config, ca}` and rebuilds the `https.Agent` on change | cli_inner_pretty.js:65144-65154 | function |
| `BFi` | `keepAliveDisabled` — process-wide one-way latch | cli_inner_pretty.js:86541 | variable |
| `BWn` | `clearMTLSCache` | cli_inner_pretty.js:65167-65169 | function |
| `D7t` | `mtlsAgentCache` — `{config, ca, agent}` | cli_inner_pretty.js:65179 | variable |
| `fql` | `readPemSync` — returns `{path, content}` or null | cli_inner_pretty.js:65125-65132 | function |
| `gql` | `MTLS_MODULE_EXPORTS` — 8-name export table (6 names 220-only) | cli_inner_pretty.js:65115-65124 | object |
| `Ih` | `getProxyFetchOptions` — emits `keepalive: false` when `BFi`; unix-socket, proxy and TLS branches | cli_inner_pretty.js:86468-86492 | function |
| `jGh` | `_resetKeepAliveForTesting` | cli_inner_pretty.js:86284-86286 | function |
| `loe` | `serialize` — chain-all-calls-onto-one-promise wrapper (used by `P7t`) | cli_inner_pretty.js:48948-48954 | function |
| `lOi` | `configureGlobalMTLS` — now exported by name; single call site `:827784` | cli_inner_pretty.js:65170-65173 | function |
| `mql` | `readPemAsync` | cli_inner_pretty.js:65133-65140 | function |
| `P7t` | `loadMTLSClientMaterial` — async, compares **path and content**, returns `changed`, clears the cache | cli_inner_pretty.js:65187-65197 | variable |
| `pot` | `clearProxyCache` | cli_inner_pretty.js:86535-86537 | function |
| `Pxt` | `getTLSFetchOptions` | cli_inner_pretty.js:65161-65166 | function |
| `qie` | `STALE_CONNECTION_CODES` — 7 codes; `ETIMEDOUT`/`ECONNABORTED`/`ERR_SOCKET_CLOSED` added in `.214` | cli_inner_pretty.js:228052-228060 | variable |
| `R8` | `getMTLSConfig` — memoised `{cert, key, passphrase}` keyed on the configured paths | cli_inner_pretty.js:65198-65214 | variable |
| `RXt` | `getAWSProxyRequestHandler` — proxy-aware `NodeHttpHandler` with an optional `requestTimeout` | cli_inner_pretty.js:86525-86534 | function |
| `sOi` | `getLoadedMTLSPaths` — `{certPath, keyPath}` currently in memory; the input to the rotation guard | cli_inner_pretty.js:65141-65143 | function |
| `T6e` | `configureGlobalAgents` — rebuilds the axios interceptor and the undici global dispatcher | cli_inner_pretty.js:86493-86518 | function |
| `Tnt` | `loadedMtlsKey` — `{path, content}` | cli_inner_pretty.js:65176 | variable |
| `UFi` | `disableKeepAlive` | cli_inner_pretty.js:86281-86283 | function |
| `Wie` | `UNREACHABLE_CODES` — gained `ERR_PROXY_TUNNEL` (220=4/193=0) | cli_inner_pretty.js:228040-228051 | variable |
| `WK` | `getWebSocketTLSOptions` | cli_inner_pretty.js:65155-65160 | function |
| `wnt` | `loadedMtlsCert` — `{path, content}` | cli_inner_pretty.js:65175 | variable |
| `YU_` | `isStaleConnectionError` — `ConnectionError` whose errno code ∈ `qie` | cli_inner_pretty.js:534522-534526 | function |
| `Gcs` | `TLS_CERT_ERROR_CODES` — 16-code trust/validity set | cli_inner_pretty.js:228017-228033 | variable |
| `UZg` | `TLS_ERROR_CODES_EXTENDED` — `Gcs` + handshake-timeout + two SSL protocol codes | cli_inner_pretty.js:228034-228039 | variable |

---

## Module: Host-Managed Settings

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `eWu` | `filterEnvForSettingsSource` — the five-arm per-variable filter; arm 5 is the `.212`/`.217` branch | cli_inner_pretty.js:267720-267745 | function |
| `F5n` | `buildHostManagedSuppressionList` — the env vars a host-managed session must not inherit | cli_inner_pretty.js:57822-57840 | function |
| `Ext` | `hostAuthEnvVarToSuppress` — the `CLAUDE_CODE_HOST_AUTH_ENV_VAR`-named variable, unless it is already listed | cli_inner_pretty.js:57841-57845 | function |
| `J5u` | `computeHostState` — `{managedByHost, managedByHostFlag, desktopHost, hostOrchestrated}` | cli_inner_pretty.js:267685-267695 | function |
| `Kye` | `AUTH_TOKEN_ENV_VARS` — 7 credential-bearing env vars | cli_inner_pretty.js:57883-57891 | variable |
| `l9` | `reapplySettingsDerivedEnv` — re-derives `process.env`, then the two-phase agent rebuild around the async cert load | cli_inner_pretty.js:267867-267887 | function |
| `lSm` | `applyExtraCaCerts` — sets `NODE_EXTRA_CA_CERTS` from config only when the process env has none | cli_inner_pretty.js:825519-825525 | function |
| `MPi` | `AWS_STATIC_CRED_ENV_VARS` — `{AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN}` | cli_inner_pretty.js:57930 | variable |
| `N5n` | `isProxySetting` — membership in `tHh` | cli_inner_pretty.js:57813-57815 | function |
| `n7t` | `isSettingsAllowedEnvVar` — `nHh.has(name) \|\| (oHh.has(name) && truthy(value))` | cli_inner_pretty.js:57846-57849 | function |
| `OPi` | `AWS_AND_GCP_CRED_ENV_VARS` — `MPi` + profile/config/creds files + `GOOGLE_APPLICATION_CREDENTIALS` + `GOOGLE_CLOUD_PROJECT` | cli_inner_pretty.js:57931-57938 | variable |
| `P_s` | `warnIgnoredHostManagedEnv` — warn-once, two message variants (Desktop vs generic) | cli_inner_pretty.js:267710-267719 | function |
| `Q5u` | `REPO_COMMITTED_SOURCES` — `{projectSettings, localSettings}`; the `.217` narrowing set | cli_inner_pretty.js:267931 | variable |
| `r7t` | `isHostOrchestratedEnv` — unix socket ‖ managed-by-host ‖ host-auth env var | cli_inner_pretty.js:57819-57821 | function |
| `rHh` | `HOST_MANAGED_TRANSPORT_VARS` — the six-variable set that is a transcription of the `.212`/`.217` bullets | cli_inner_pretty.js:57972-57979 | variable |
| `SHe` | `hostState` — the module-level record built by `J5u` | cli_inner_pretty.js:267865 (reset), :267888 (decl) | variable |
| `t7t` | `isHostManagedTransportSetting` — membership in `rHh` | cli_inner_pretty.js:57816-57818 | function |
| `tHh` | `PROXY_ENV_VARS` — `{HTTP_PROXY, HTTPS_PROXY, NO_PROXY}` | cli_inner_pretty.js:57971 | variable |
| `SoE` | `resolveExtraCaCertsFromConfig` — the config fallback, suppressed under a host-managed provider | cli_inner_pretty.js:825526-825544 | function |
| `zye` | `PROVIDER_SELECTION_ENV_VARS` — 14 names incl. all three `ANTHROPIC_GOOGLE_CLOUD_*` | cli_inner_pretty.js:57853-57868 | variable |

---

## Module: Feature Gates (auth-coupled)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `cIg` | `GROWTHBOOK_REFRESH_INTERVAL_MS` — returns 21600000 (6 h) | cli_inner_pretty.js:156726-156728 | function |
| `iRt` | `GROWTHBOOK_MODULE_EXPORTS` — 25-name export table | cli_inner_pretty.js:156340-156371 | object |
| `KXi` | `growthBookAuthHeaderAtInit` — the snapshot compared against on each refresh | cli_inner_pretty.js:156791 (decl), :156841 (assignment) | variable |
| `Ltu` | `installEvalAuthedOverride` — monkey-patches `fetchRemoteEvalCall` to `/api/eval-authed/<key>` behind `tengu_gb_eval_authed_enable` | cli_inner_pretty.js:156372-156399 | function |
| `Nno` | `refreshGrowthBookFeatures` — **the `.214` auth-rotation detection**; 193's `awn` `:147414-147426 (193)` has none of it | cli_inner_pretty.js:156733-156758 | function |
| `Pno` | `growthBookClientWasInitializedWithAuth` | cli_inner_pretty.js:156790 (decl), :156841 (assignment) | variable |
| `Qer` | `resetGrowthBook` — destroys the client and clears every derived map | cli_inner_pretty.js:156709-156725 | function |
| `vxe` | `refreshGrowthBookAfterAuthChange` — full reset + re-init (name is 1/1; the *caller* is the delta) | cli_inner_pretty.js:156695-156708 | function |
| `XXi` | `growthBookOrgUuidAtInit` | cli_inner_pretty.js:156793 | variable |
| `YXi` | `growthBookAccountUuidAtInit` | cli_inner_pretty.js:156792 | variable |

---

## Module: Auth UI Surfaces

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `cmf` | `oauthExpiryBanner` — "Your login expires in N day(s) · run /login to renew" | cli_inner_pretty.js:688292-688318 | function |
| `J7e` | `ConsoleOAuthFlow` — the `/login` component; gateway forcing, pre-selected method, `tengu_oauth_gateway_forced` | cli_inner_pretty.js:584054-… | function |
| `nsb` | `setupTokenCommand` — `tengu_setup_token_command` + the `.212` `force_login_method_refused` refusal | cli_inner_pretty.js:585187-585196 | function |
| `QN` | `formatHyperlink` — OSC-8 emitter with the new `assumeSupport` disjunct | cli_inner_pretty.js:556647-556663 | function |
| `mk` | `detectHyperlinkSupport` — terminal allow-list; returns false over plain SSH | cli_inner_pretty.js:259591-259611 | function |
| `out` | `explicitHyperlinkPreference` — config value or `FORCE_HYPERLINK` verdict; `undefined` when unknown | cli_inner_pretty.js:259584-259590 | function |
| `Rhm` | `oauthExpiryWarningNotice` — spinner notice, last day only (`daysLeft > 1` returns null) | cli_inner_pretty.js:815777-815792 | object |
| `x8b` | `recordOauthExpiryWarningShown` — `be("oauth_expiry_warning")` | cli_inner_pretty.js:688270-688272 | function |
| `x_E` | `cliAuthLoginCommand` — `claude auth login`; gateway pin exit, `CLAUDE_CODE_OAUTH_REFRESH_TOKEN` path | cli_inner_pretty.js:864325-… | function |
| `HIp` | `mcpLoginUrlBlock` — "If the browser didn't open, visit:" / "Visit this URL to authorize:" with `assumeSupport: !0` | cli_inner_pretty.js:585454-585459 | function |

---

## Corrections to earlier registers

| Register | Row | Correction |
|---|---|---|
| `_false_delta_ledger.md` §2 `auth_providers` | `api_request_api_key_helper_failed` — `WU_ = 2 at :534999` | Confirmed. Add the third member of the chain: the user-facing message `tey` at `:228957-228958` (220=1/193=0) and its dispatch at `:228589-228591`. |
| `_false_delta_ledger.md` §1 (`.198` `awsAuthRefresh` 10/10) | *"only the auto-invocation point can be a delta, and I could not isolate it"* | **Closed:** the auto-invocation point is byte-equivalent (`:154687-154722` vs `:135842-135877 (193)`). The delta is `J9s` + `GU_` + `api_request_aws_auth_exhausted`. |
| `_false_delta_ledger.md` §1 (`.206` `awsCredentialExport` 12/12) | *"timeout/caching constant changes"* | Half right. There is no timeout on the helper in **either** build; the new constants (`XIt`, the `Jeu` default, `Feu`, `SHg`, `mHg`/`Neu`/`hHg`) all bound the **default provider chain**, not the helper. |
| `_scope_v206_210.md` roll-up | *"`auth_providers` … 10 bullets, 6 CARRYOVER, 0 DELTA"* | On the evidence here: 2 CARRYOVER (`.206` #7's message, `.208` #17), 2 DELTA-newly-anchored (`.207` #16, `.206` #7's real fix), 2 NOT-ISOLABLE (`.206` #24, `.208` #46), plus `.207` #21 and `.208` #16 NET_NEW. |
| `_scope_v211_214.md` row 34 | *"Feature flags going stale … 2.1.211"* | The bullet is `CHANGELOG.md:178`, inside **2.1.214**. |
| `_MODULE_TASK_BRIEF` assignment text | *".214 the Windows 60-second stall guard"* / *".203/.219 login-expiry 5→3"* / *".211 feature flags stale"* | `.207` (`CHANGELOG.md:395`), `.217` (`CHANGELOG.md:90`), `.214` (`CHANGELOG.md:178`) respectively. |
