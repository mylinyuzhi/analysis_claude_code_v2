# Symbol index — Platform infrastructure (v2.1.220)

**Scope:** MCP, permissions, sandbox, auth, model selection, prompt building, telemetry.

All `File:Line` values are line numbers in the **2.1.220** bundle
`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines, `build_sha 4073f595`). A line tagged `(193)` inside a description refers to
the 2.1.193 baseline and is never used as a `File:Line` value.

> ⚠ **Do not reconcile these symbols against a 2.1.193 index by name.** Identifiers are
> re-mangled between builds and ids are REUSED for unrelated declarations — the #1 analysis
> trap in this tree (`_CONVENTIONS.md` §4 trap 1). Confirmed collisions include `cOt`, `BEy`,
> `OKt`, `yBc` and `lor`. Each source `symbol_additions_*` file lists its own theme's collisions.

> ⚠ **155 obfuscated ids are named two different ways** across the four indexes, and 59 carry
> differing `File:Line` values. Before trusting a row here, check
> [`symbol_alias_conflicts.md`](symbol_alias_conflicts.md) — a mechanically generated register of
> every such disagreement. Same id, two names means at most one analyst was right.

> **Provenance.** Mechanically merged from the per-theme `symbol_additions_v2_1_220_*.md`
> files listed at the bottom, which remain the authoritative sources and additionally carry
> per-theme gate/env-var censuses and notes that are deliberately not duplicated here.
> Rows are deduplicated and sorted by the Obfuscated column within each module section.

---

## Module: API Key Helper

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$eu` | `runApiKeyHelperAndCache` — caches `" "` on failure; records `fXi`; drives the auth-status UI | cli_inner_pretty.js:154628-154651 | function |
| `_er` | `getApiKeyFromApiKeyHelper` — TTL cache + background revalidation | cli_inner_pretty.js:154617-154627 | function |
| `Ber` | `apiKeyHelperCacheGeneration` — bumped by `Ger()`; guards against publishing a stale result | cli_inner_pretty.js:155987 | variable |
| `fHg` | `execApiKeyHelper` — `OO(cmd, {timeout: 600000, reject: !1})`; throws `"timed out" \ | "exited N"` + stderr(500) | cli_inner_pretty.js:154652-154672 |
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

## Module: AWS Credentials

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_Hg` | `AWS_AUTH_REFRESH_EXEC_TIMEOUT_MS` = 180000 (3 min) | cli_inner_pretty.js:155996 | constant |
| `bHg` | `runAwsCredentialExport` — parses STS JSON; **no execution timeout in either build** | cli_inner_pretty.js:154756-154793 | function |
| `Ccg` | `AWS_AUTH_ERROR_PATTERN` — `/ExpiredToken\ | InvalidSignature\ | SignatureDoesNotMatch\ |
| `e4_` | `isGoogleAdcLoadFailure` — three message substrings incl. `invalid_grant` | cli_inner_pretty.js:534883-534891 | function |
| `Eno` | `prefetchGcpCredentialsIfSafe` — trust-gated when `gcpAuthRefresh` comes from project settings | cli_inner_pretty.js:154915-154921 | function |
| `Evh` | `normalizeEntrypoint` — **`local_agent → local-agent`** alias (the `.205` Cowork fix) | cli_inner_pretty.js:46447-46463 | function |
| `eVr` | `prefetchAwsCredentialsAndBedRockInfoIfSafe` — fire-and-forget `(JQ(), Km())` (carryover shape) | cli_inner_pretty.js:154922-154930 | function |
| `Exe` | `clearAwsCredentialsCache` — clears `JQ`, `oW` and the debounce map | cli_inner_pretty.js:154830-154832 | function |
| `Feu` | `AWS_CRED_EXPIRY_MARGIN_MS` = 30000 — the hard-validity margin in `oW`'s predicate | cli_inner_pretty.js:155998 | constant |
| `gHg` | `AWS_AUTH_REFRESH_COOLDOWN_MS` = 30000 | cli_inner_pretty.js:155992 | constant |
| `GU_` | `AWS_AUTH_RETRY_LIMIT` = 2 → `api_request_aws_auth_exhausted` (220=1/193=0) | cli_inner_pretty.js:534998 (const), :534683-534686 (use) | constant |
| `gvh` | `VALID_ENTRYPOINTS` — now carries both `"local-agent"` and `local_agent` | cli_inner_pretty.js:46487-46515 | object |
| `hHg` | `AWS_CRED_TTL_SLACK_MS` = 60000 | cli_inner_pretty.js:155991 | constant |
| `hXi` | `awsChainInvalidateTimestamps` — key → last invalidation ms | cli_inner_pretty.js:156002 (decl), :156122 (init) | variable |
| `ist` | `refreshGcpCredentialsIfNeeded` — TTL `vHg = 3600000` | cli_inner_pretty.js:156123 | variable |
| `J9s` | `isAwsAuth401ForClaudePlatform` — 401 && provider ∈ {`anthropicAws`, `mantle`} | cli_inner_pretty.js:534872-534876 | function |
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
| `qlp` | `isGcpCredentialError` — Vertex **and** `anthropicGoogleCloud` share the branch | cli_inner_pretty.js:534892-534898 | function |
| `rFc` | `stsGetCallerIdentity` — the "are the current credentials alive?" probe | cli_inner_pretty.js:118015-118018 | function |
| `SHg` | `AWS_INVALIDATE_DEBOUNCE_MS` = 10000 | cli_inner_pretty.js:156001 | constant |
| `Sst` | `clearGcpCredentialsCache` | cli_inner_pretty.js:154912-154914 | function |
| `Sxe` | `getConfiguredAwsAuthRefresh` | cli_inner_pretty.js:154584-154586 | function |
| `TXi` | `getConfiguredAwsCredentialExport` | cli_inner_pretty.js:154594-154598 | function |
| `vXi` | `SDK_OAUTH_REFRESH_ENTRYPOINTS` — `{claude-desktop, local-agent, claude-vscode}` | cli_inner_pretty.js:156085 | variable |
| `Wer` | `invalidateDefaultAwsProviderChainDebounced` — one key, at most once per 10 s | cli_inner_pretty.js:154824-154829 | function |
| `Xeu` | `credentialCacheTtl` — `remaining - 300000`, or 1 h when there is no expiry / under 6 min left | cli_inner_pretty.js:154794-154798 | function |
| `XIt` | `AWS_CHAIN_RESOLVE_REQUEST_TIMEOUT_MS` = 30000 | cli_inner_pretty.js:155999 | constant |
| `yHg` | `runAwsAuthRefreshIfStsExpired` — probe-then-refresh; **byte-equivalent to `ymd` `:135842-135877 (193)`** | cli_inner_pretty.js:154687-154722 | function |
| `YIt` | `awsAuthRefreshInFlight` — single-flight latch | cli_inner_pretty.js:155994 | variable |
| `yno` | `awsAuthRefreshLastAttemptAt` | cli_inner_pretty.js:155993 | variable |
| `ZIt` | `resetAwsAuthRefreshCooldown` | cli_inner_pretty.js:154836-154838 | function |
| `ZU_` | `handleRetryableAuthError` — recognised AWS auth error → `Exe()`, else `kXi()` + debounced `Wer()` | cli_inner_pretty.js:534877-534882 | function |

## Module: Auth Core

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aN` | `getConfiguredApiKeyHelper` — resolves the `apiKeyHelper` setting (flag settings when remote) | cli_inner_pretty.js:154571-154575 | function |
| `b8r` | `hostManagedNoCredsError` — `"${provider} credentials are managed by the desktop app, but none are available…"` | cli_inner_pretty.js:154269-154273 | function |
| `Dc` | `isFirstPartyApiSurface` — used as a conjunct in the `apiKeyHelper` 401 breaker | cli_inner_pretty.js:534687 (call site) | function |
| `Geu` | `hostManagedAwsProviderChain` — env/ini-only chain for host-managed AWS; throws `Weu` if neither is present | cli_inner_pretty.js:154275-154288 | function |
| `Hn` | `getAPIProvider` — the eight-way provider ladder (also in `47_models`) | cli_inner_pretty.js:100302-100317 | function |
| `jer` | `isApiKeyHelperTheActiveCredential` | cli_inner_pretty.js:154471-154473 | function |
| `JIt` | `isRemoteOrHostAuthContext` — `CLAUDE_CODE_REMOTE \ | \ | G$()` |
| `kY` | `AUTH_MODULE_EXPORTS` — the 135-name export table; the primary naming key for this theme | cli_inner_pretty.js:154127-154262 | object |
| `p_e` | `hostManagedAwsSdkCredentials` — `{providerChainResolver, credentials}` pair for host-managed AWS | cli_inner_pretty.js:154302-154306 | function |
| `qeu` | `readAwsEnvCredentialInputs` — `{accessKeyId, secretAccessKey, profile, configFile, credsFile}` | cli_inner_pretty.js:154289-154297 | function |
| `Weu` | `BG_UNSUPPORTED_CREDENTIAL_MSG` — "Background agents and teammates are not supported for this credential kind…" (220-only) | cli_inner_pretty.js:155980-155981 | constant |
| `Y8r` | `isFirstPartyManagedOAuthContext` — remote && no host-auth env var && entrypoint ≠ `claude-desktop-3p` | cli_inner_pretty.js:154307-154309 | function |
| `Yv` | `isHostManagedProviderAuth` — `Z.CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST` (name is 220=1/193=0) | cli_inner_pretty.js:154266-154268 | function |
| `zb` | `isAnthropicAuthEnabled` — the "is this an OAuth-capable first-party session" predicate | cli_inner_pretty.js:154398-154415 | function |

## Module: Auth UI Surfaces

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `cmf` | `oauthExpiryBanner` — "Your login expires in N day(s) · run /login to renew" | cli_inner_pretty.js:688292-688318 | function |
| `HIp` | `mcpLoginUrlBlock` — "If the browser didn't open, visit:" / "Visit this URL to authorize:" with `assumeSupport: !0` | cli_inner_pretty.js:585454-585459 | function |
| `J7e` | `ConsoleOAuthFlow` — the `/login` component; gateway forcing, pre-selected method, `tengu_oauth_gateway_forced` | cli_inner_pretty.js:584054-… | function |
| `mk` | `detectHyperlinkSupport` — terminal allow-list; returns false over plain SSH | cli_inner_pretty.js:259591-259611 | function |
| `nsb` | `setupTokenCommand` — `tengu_setup_token_command` + the `.212` `force_login_method_refused` refusal | cli_inner_pretty.js:585187-585196 | function |
| `out` | `explicitHyperlinkPreference` — config value or `FORCE_HYPERLINK` verdict; `undefined` when unknown | cli_inner_pretty.js:259584-259590 | function |
| `QN` | `formatHyperlink` — OSC-8 emitter with the new `assumeSupport` disjunct | cli_inner_pretty.js:556647-556663 | function |
| `Rhm` | `oauthExpiryWarningNotice` — spinner notice, last day only (`daysLeft > 1` returns null) | cli_inner_pretty.js:815777-815792 | object |
| `x8b` | `recordOauthExpiryWarningShown` — `be("oauth_expiry_warning")` | cli_inner_pretty.js:688270-688272 | function |
| `x_E` | `cliAuthLoginCommand` — `claude auth login`; gateway pin exit, `CLAUDE_CODE_OAUTH_REFRESH_TOKEN` path | cli_inner_pretty.js:864325-… | function |

## Module: Auto-update — streaming download

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Cj_` | `getStallTimeoutMs` (`CLAUDE_CODE_STALL_TIMEOUT_MS_FOR_TESTING` ?? `Tj_`) | cli_inner_pretty.js:540187 | function |
| `Dbr` | `MAX_DOWNLOAD_ATTEMPTS` (`3`) | cli_inner_pretty.js:540392 | constant |
| `kj_` | `downloadBinaryToFile` (streaming; 193 twin `X1p` `:352459 (193)` used `arraybuffer`) | cli_inner_pretty.js:540200 | function |
| `kup` | `isRetryableDownloadTransportError` | cli_inner_pretty.js:540193 | function |
| `Tj_` | `DOWNLOAD_STALL_TIMEOUT_MS` (`120000`) | cli_inner_pretty.js:540391 | constant |
| `xj_` | `getDownloadDeadlineMs` (`CLAUDE_CODE_DOWNLOAD_DEADLINE_MS_FOR_TESTING` ?? `xup`) | cli_inner_pretty.js:540191 | function |
| `xup` | `DOWNLOAD_DEADLINE_MS` (`600000`) | cli_inner_pretty.js:540393 | constant |

## Module: Background Agents — CLAUDE_CODE_PROCESS_WRAPPER (corporate launcher)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $Qr | resolveProcessWrapper | cli_inner_pretty.js:267508-267524 | function |
| a9 | processWrapperRecord | cli_inner_pretty.js:267556-267558 | function |
| D_s | absoluteLauncherProbeList | cli_inner_pretty.js:267546-267549 | function |
| DN | PROCESS_WRAPPER_ENV ("CLAUDE_CODE_PROCESS_WRAPPER") | cli_inner_pretty.js:267645 | constant |
| elr | processWrapperConfigError | cli_inner_pretty.js:267583-267585 | function |
| g_ | processWrapperArgv | cli_inner_pretty.js:267525-267527 | function |
| Iut | processWrapperResolutionCache | cli_inner_pretty.js:267512-267513 | variable |
| Kmy | validateProcessWrapper | cli_inner_pretty.js:267559-267582 | function |
| L_s | isExecutableFile | cli_inner_pretty.js:267538-267545 | function |
| N_s | lastPromotedProcessWrapper | cli_inner_pretty.js:267856, :267862 | variable |
| o6 | isProcessWrapperRunnable | cli_inner_pretty.js:267531-267537 | function |
| PE | processWrapperError | cli_inner_pretty.js:267528-267530 | function |
| R_s | lastRawProcessWrapperValue | cli_inner_pretty.js:267511-267513 | variable |
| Rut | LAUNCHER_FORK_EXIT_WINDOW_MS (12000) | cli_inner_pretty.js:267646 | constant |
| vMt | processWrapperRunnableError | cli_inner_pretty.js:267550-267555 | function |
| Xmy | parseProcessWrapperArgv | cli_inner_pretty.js:267586-267641 | function |

## Module: Background Agents — Settings & Env Keys

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| m7s | WORKER_ENV_DROP_LIST | cli_inner_pretty.js:554886-554893 | constant |
| Sxt | AUTH_ENV_KEYS (ANTHROPIC_BASE_URL, _CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL, ANTHROPIC_CUSTOM_HEADERS) | cli_inner_pretty.js:57882 | constant |
| — | `evict` control-request field (zod) | cli_inner_pretty.js:330157 | object |
| — | `processWrapper` settings-key allow-list entry | cli_inner_pretty.js:57988 | constant |
| — | `processWrapper` settings field (zod) | cli_inner_pretty.js:60628-60633 | object |

## Module: Fast Mode

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `a5r` | `isFastModeActiveForModel` — `Q$ && mv && xji(eo())` | cli_inner_pretty.js:109455-109460 | function |
| `d_r` | `applyFastModeToggle` — settings write + Remote Control `apply_flag_settings` + model coercion | cli_inner_pretty.js:499792-499809 | function |
| `dde` | `resetFastModeCooldown` | cli_inner_pretty.js:109513-109515 | function |
| `eBo` | `runFastModeCommand` — builds `"Fast mode ON … · $X/$Y per Mtok"`; hardcodes `"claude-opus-5"` fallback at :499818 | cli_inner_pretty.js:499810-499824 | function |
| `FIc` | `isTransientFastModeReason` — `network_error \ | unknown` (was inline in 193) | cli_inner_pretty.js:109577-109579 |
| `HIc` | `describeOrgDisabledReason` — 5-arm reason→string map | cli_inner_pretty.js:109386-109401 | function |
| `Hig` | `KNOWN_DISABLED_REASONS` — `free \ | preference \ | extra_usage_disabled \ |
| `HU` | `resolveFastModeAfterModelSwitch` — the `.208` restore/downgrade decision | cli_inner_pretty.js:109475-109482 | function |
| `i7n` | `getFastModeCooldownState` — **lazy** expiry check, re-enables on read | cli_inner_pretty.js:109498-109504 | function |
| `Iig` | `normaliseServerDisabledReason` — unknown → `"unknown"`, null → `"preference"` | cli_inner_pretty.js:109571-109573 | function |
| `IU` | `emitFastModeToggleTelemetry` — `tengu_fast_mode_toggled` with `source: "model_switch_restore" \ | "model_switch_downgrade"` and `remote: CS()`; 11 call sites | cli_inner_pretty.js:109483-109490 |
| `kig` | `describeOverageRejection` — 9-arm usage-credit reason map | cli_inner_pretty.js:109523-109545 | function |
| `kmt` | `buildFastModeSuffix` — `" · Fast mode ON/OFF"` + `announceKeptOn` | cli_inner_pretty.js:450667-450676 | function |
| `l5r` | `isSpendCapReason` — reasons that must NOT clear the user's `fastMode` setting | cli_inner_pretty.js:109546-109548 | function |
| `LIc` | `getOpus47FastModeSunsetDate` — gate `tengu_sunset_penguin_opus47`, default `"2026-07-25"`; returns `null` once passed | cli_inner_pretty.js:109491-109497 | function |
| `Lig` | `FAST_MODE_PREFETCH_INTERVAL_MS` — `30000` | cli_inner_pretty.js:109714 | constant |
| `MIc` | `enterFastModeCooldown` — emits `tengu_fast_mode_fallback_triggered` | cli_inner_pretty.js:109505-109512 | function |
| `mv` | `isFastModeEligibleModel` — catalogue capability **then** `opus-4-7 \ | \ | opus-4-8 \ |
| `NIc` | `handleOverageRejection` — `tengu_fast_mode_overage_rejected` | cli_inner_pretty.js:109549-109561 | function |
| `o7n` | `skipFastModeOrgCheck` — `CLAUDE_CODE_SKIP_FAST_MODE_ORG_CHECK` | cli_inner_pretty.js:109379-109381 | function |
| `OIc` | `disableFastModeFromServer` — clears `userSettings.fastMode` + `penguinModeOrgEnabled` | cli_inner_pretty.js:109516-109522 | function |
| `pB` | `fastModeOrgStatus` — `{status: "pending"\ | "enabled"\ | "disabled", reason?, source?}` |
| `Q$` | `isFastModeAvailable` — `ude(e) === null` | cli_inner_pretty.js:109382-109385 | function |
| `RIc` | `isFastModeToggleVisible` | cli_inner_pretty.js:109451-109454 | function |
| `Rig` | `fetchOrgFastModeStatus` — `GET /api/claude_code_penguin_mode` | cli_inner_pretty.js:109588-109595 | function |
| `Rji` | `guessFastModeStatusOffline` — seeds from cached `penguinModeOrgEnabled` | cli_inner_pretty.js:109596-109606 | function |
| `s5r` | `isServerDisabled` | cli_inner_pretty.js:109574-109576 | function |
| `sY` | `fastModeTriState` — `"cooldown" \ | "on" \ | "off"` |
| `Tji` | `setFastModeOrgStatus` — emits only on a real transition or reason change | cli_inner_pretty.js:109580-109587 | function |
| `ude` | `getFastModeUnavailableMessage` — code → string + debug log | cli_inner_pretty.js:109418-109423 | function |
| `uNd` | `buildFastModeChangeAnnouncement` — the `.218` `/config model=` notice, key `model-switch-fast-mode` (220=1/193=0) | cli_inner_pretty.js:450677-450680 | function |
| `uW` | `fastModeFlagshipLabel` — hardcoded `"Opus 5"` (193 returned `"Opus 4.8"`) | cli_inner_pretty.js:109445-109447 | function |
| `Vkt` | `fastModeAliasWithSuffix` — `"opus"` + optional `"[1m]"` | cli_inner_pretty.js:109448-109450 | function |
| `vl` | `isFastModeBuildEnabled` — firstParty + `!CLAUDE_CODE_DISABLE_FAST_MODE` | cli_inner_pretty.js:109375-109378 | function |
| `WCe` | `isFastModeInCooldown` | cli_inner_pretty.js:109562-109564 | function |
| `xig` | `describeUnavailabilityCode` — 10-arm code → user string | cli_inner_pretty.js:109424-109444 | function |
| `xji` | `isFastModeAllowedByPolicy` — `fastMode` → `fastModePerSessionOptIn` → `policySettings` → `flagSettings`; byte-equivalent to 193's `HOr` | cli_inner_pretty.js:109461-109466 | function |
| `XJt` | `fastModeCooldownState` — `{status: "active"\ | "cooldown", resetAt?, reason?}` | cli_inner_pretty.js:109701 |
| `z8` | `getFastModeUnavailableCode` — **220-only reason-code layer** (193 returned strings); takes an optional prospective model | cli_inner_pretty.js:109402-109417 | function |
| `ZFo` | `buildOpus47FastModeDeprecationNotice` — key `opus47-fast-mode-deprecation` (220=1/193=0) | cli_inner_pretty.js:499782-499791 | function |

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

## Module: Feature flags — performance gates

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `hgi` | `isCcrDeltaRehydrateEnabled` (gate `tengu_ccr_delta_rehydrate`, 220=1/193=1) | cli_inner_pretty.js:840674 | function |
| `kCm` | `isTranscriptLocalGcEnabled` (gate `tengu_transcript_local_gc`, **default false**) | cli_inner_pretty.js:840677 | function |
| `Srh` | `CLAUDE_CODE_TRANSCRIPT_LOCAL_GC` (env accessor) | cli_inner_pretty.js:30992 | variable |

## Module: Gateway Auth

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aHg` | `ANTHROPIC_PUBLIC_GATEWAY_HOSTS` — `{claude.fedstart.com, claude.palantirfedstart.com}`; the `.206` carve-out | cli_inner_pretty.js:154113 | variable |
| `AXi` | `restoreGatewayAuth` — env on-ramp, TLS-pin re-verify, expiry check | cli_inner_pretty.js:154341-154397 | function |
| `B8r` | `probeGatewayTlsFingerprint` — raw TLS connect → lower-cased `fingerprint256`; `"http-loopback"` for `http:` | cli_inner_pretty.js:154013-154045 | function |
| `dno` | `isPrivateAddress` — RFC1918 + CGNAT + loopback + link-local + `fc00::/7` + `fe80::/10` + IPv4-mapped | cli_inner_pretty.js:153937-153956 | function |
| `hno` | `GATEWAY_TLS_PIN_MISMATCH_MSG` — "gateway TLS certificate does not match the pinned fingerprint" (220=1/193=0) | cli_inner_pretty.js:154100 | constant |
| `jde` | `validateForceLoginOrg` — org-UUID pin with three `ANTHROPIC_UNIX_SOCKET` SLO counters | cli_inner_pretty.js:155849-155946 | function |
| `Knb` | `LOGIN_TLS_TRUST_FAILURE_CODES` — 6-code set local to the login/gateway wizard module (220-only) | cli_inner_pretty.js:582524-582530 | variable |
| `Leu` | `assertGatewayHostIsReachablePrivately` — the `/login` gateway pre-flight (host + proxy must be private) | cli_inner_pretty.js:153957-154012 | function |
| `mno` | `normalizeGatewayUrl` — adds `https://`, strips a trailing `/`, refuses off-loopback `http:` | cli_inner_pretty.js:153926-153936 | function |
| `NEl` | `isBlockedGatewayAddress` — link-local always blocked; loopback blocked unless `CLAUDE_GATEWAY_ALLOW_LOOPBACK`; `fd00:ec2::254` always blocked | cli_inner_pretty.js:860525-… | function |
| `sHg` | `GATEWAY_LOOPBACK_HOSTS` — `{localhost, 127.0.0.1, [::1]}` | cli_inner_pretty.js:154112 | variable |
| `Uer` | `getForcedLoginMethod` — `gateway` honoured only from `policySettings` | cli_inner_pretty.js:155947-155951 | function |
| `vst` | `validateForceLoginMethod` — the shared validator behind the four `.212` enforcement sites | cli_inner_pretty.js:155952-155974 | function |
| `Xyi` | `gatewayLoopbackAllowed` — `CLAUDE_GATEWAY_ALLOW_LOOPBACK` (first consumer in 220) | cli_inner_pretty.js:860522-860524 | function |

## Module: Host-Managed Settings

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `eWu` | `filterEnvForSettingsSource` — the five-arm per-variable filter; arm 5 is the `.212`/`.217` branch | cli_inner_pretty.js:267720-267745 | function |
| `Ext` | `hostAuthEnvVarToSuppress` — the `CLAUDE_CODE_HOST_AUTH_ENV_VAR`-named variable, unless it is already listed | cli_inner_pretty.js:57841-57845 | function |
| `F5n` | `buildHostManagedSuppressionList` — the env vars a host-managed session must not inherit | cli_inner_pretty.js:57822-57840 | function |
| `J5u` | `computeHostState` — `{managedByHost, managedByHostFlag, desktopHost, hostOrchestrated}` | cli_inner_pretty.js:267685-267695 | function |
| `Kye` | `AUTH_TOKEN_ENV_VARS` — 7 credential-bearing env vars | cli_inner_pretty.js:57883-57891 | variable |
| `l9` | `reapplySettingsDerivedEnv` — re-derives `process.env`, then the two-phase agent rebuild around the async cert load | cli_inner_pretty.js:267867-267887 | function |
| `lSm` | `applyExtraCaCerts` — sets `NODE_EXTRA_CA_CERTS` from config only when the process env has none | cli_inner_pretty.js:825519-825525 | function |
| `MPi` | `AWS_STATIC_CRED_ENV_VARS` — `{AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN}` | cli_inner_pretty.js:57930 | variable |
| `N5n` | `isProxySetting` — membership in `tHh` | cli_inner_pretty.js:57813-57815 | function |
| `n7t` | `isSettingsAllowedEnvVar` — `nHh.has(name) \ | \ | (oHh.has(name) && truthy(value))` |
| `OPi` | `AWS_AND_GCP_CRED_ENV_VARS` — `MPi` + profile/config/creds files + `GOOGLE_APPLICATION_CREDENTIALS` + `GOOGLE_CLOUD_PROJECT` | cli_inner_pretty.js:57931-57938 | variable |
| `P_s` | `warnIgnoredHostManagedEnv` — warn-once, two message variants (Desktop vs generic) | cli_inner_pretty.js:267710-267719 | function |
| `Q5u` | `REPO_COMMITTED_SOURCES` — `{projectSettings, localSettings}`; the `.217` narrowing set | cli_inner_pretty.js:267931 | variable |
| `r7t` | `isHostOrchestratedEnv` — unix socket ‖ managed-by-host ‖ host-auth env var | cli_inner_pretty.js:57819-57821 | function |
| `rHh` | `HOST_MANAGED_TRANSPORT_VARS` — the six-variable set that is a transcription of the `.212`/`.217` bullets | cli_inner_pretty.js:57972-57979 | variable |
| `SHe` | `hostState` — the module-level record built by `J5u` | cli_inner_pretty.js:267865 (reset), :267888 (decl) | variable |
| `SoE` | `resolveExtraCaCertsFromConfig` — the config fallback, suppressed under a host-managed provider | cli_inner_pretty.js:825526-825544 | function |
| `t7t` | `isHostManagedTransportSetting` — membership in `rHh` | cli_inner_pretty.js:57816-57818 | function |
| `tHh` | `PROXY_ENV_VARS` — `{HTTP_PROXY, HTTPS_PROXY, NO_PROXY}` | cli_inner_pretty.js:57971 | variable |
| `zye` | `PROVIDER_SELECTION_ENV_VARS` — 14 names incl. all three `ANTHROPIC_GOOGLE_CLOUD_*` | cli_inner_pretty.js:57853-57868 | variable |

## Module: MCP Auto-Backgrounding

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_Ey` | MAX_MCP_AUTO_BACKGROUND_MS (2147483647) | cli_inner_pretty.js:288971 | constant |
| `bEy` | AUTO_BACKGROUND_EXCLUDED_TRANSPORTS | cli_inner_pretty.js:288986 | constant |
| `EEy` | callMcpToolWithAutoBackground | cli_inner_pretty.js:288862 | function |
| `G9u` | createMcpTaskDescriptor | cli_inner_pretty.js:288810 | function |
| `gEy` | MCP_ERROR_CLASS_NAMES | cli_inner_pretty.js:288840 | constant |
| `IEs` | getMcpTaskWatcher | cli_inner_pretty.js:288851 | function |
| `LE` | isBackgroundTasksDisabled | cli_inner_pretty.js:230330 | function |
| `nBe` | NULL_TASK_REGISTRY | cli_inner_pretty.js:284586 | object |
| `q9u` | isToolLevelError | cli_inner_pretty.js:288827 | function |
| `REs` | MCP_AUTO_BACKGROUND_MODULE | cli_inner_pretty.js:288849 | object |
| `SEy` | getMcpAutoBackgroundMs | cli_inner_pretty.js:288854 | function |
| `v9r` | linkAbortSignal | cli_inner_pretty.js:165505 | function |
| `vr` | sleep | cli_inner_pretty.js:20457 | function |
| `yEy` | DEFAULT_MCP_AUTO_BACKGROUND_MS (120000) | cli_inner_pretty.js:288970 | constant |
| `yue` | getPermissionPromptToolName | cli_inner_pretty.js:3307 | function |

## Module: MCP Config Validation and Diagnostics

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `avp` | formatMcpListRow | cli_inner_pretty.js:567503 | function |
| `bSp` | SELF_DESCRIBING_ERROR_CODES | cli_inner_pretty.js:563887 | constant |
| `ESp` | formatMcpFailureDetail | cli_inner_pretty.js:563845 | function |
| `f9` | sanitizeForPrompt | cli_inner_pretty.js:284228 | function |
| `gEe` | sanitizeAndTruncate | cli_inner_pretty.js:284239 | function |
| `hvp` | PENDING_APPROVAL_STATUS | cli_inner_pretty.js:567837 | constant |
| `Ilr` | validateMcpServersObject | cli_inner_pretty.js:282575 | function |
| `iX_` | mcpListHandler | cli_inner_pretty.js:567539 | function |
| `K8u` | redactSecrets | cli_inner_pretty.js:284244 | function |
| `Kee` | isUnconfiguredFailure | cli_inner_pretty.js:284263 | function |
| `KMt` | setMcpServerEnabled | cli_inner_pretty.js:282790 | function |
| `L_o` | formatFailedMcpServer | cli_inner_pretty.js:284255 | function |
| `ltf` | buildMcpStatusLine | cli_inner_pretty.js:665978 | function |
| `m$_` | formatDroppedTool | cli_inner_pretty.js:514667 | function |
| `MHe` | connectToServer | cli_inner_pretty.js:294652 | function |
| `MZr` | POLICY_BLOCK_MESSAGE_MANAGED | cli_inner_pretty.js:284284 | constant |
| `NLo` | buildDroppedToolsAttachment | cli_inner_pretty.js:517023 | function |
| `Nw` | isMcpServerDisabled | cli_inner_pretty.js:282781 | function |
| `OHe` | connectToServer (v1 twin) | cli_inner_pretty.js:300194 | function |
| `OZr` | buildFailedMcpServersAttachment | cli_inner_pretty.js:284266 | function |
| `pvp` | checkMcpServerHealth | cli_inner_pretty.js:567357 | function |
| `q8u` | PROMPT_TEXT_MAX_CHARS (200) | cli_inner_pretty.js:284281 | constant |
| `qlr` | isPolicyBlockedError | cli_inner_pretty.js:284260 | function |
| `R_o` | SANITIZER_PRECUT_CHARS (2000) | cli_inner_pretty.js:284283 | constant |
| `Rlr` | readMcpConfigFile | cli_inner_pretty.js:282682 | function |
| `sD` | MAX_ANNOUNCED_MCP_ENTRIES (30) | cli_inner_pretty.js:442072 | constant |
| `SSp` | humanizeErrorCode | cli_inner_pretty.js:563841 | function |
| `sX_` | mcpGetHandler | cli_inner_pretty.js:567580 | function |
| `tAr` | buildInitEvent *(shared with `51_headless_sdk`)* | cli_inner_pretty.js:593588 | function |
| `tX_` | formatToolsListError | cli_inner_pretty.js:567346 | function |
| `tYu` | isDropInvalidToolSchemasEnabled | cli_inner_pretty.js:293415 | function |
| `V8u` | TERMINAL_TEXT_MAX_CHARS (500) | cli_inner_pretty.js:284282 | constant |
| `VYr` | isFailedMcpSurfacingEnabled *(gate `tengu_surface_failed_mcp_servers`, default off)* | cli_inner_pretty.js:217470 | function |
| `wSs` | POLICY_BLOCK_MESSAGE_CONNECTORS | cli_inner_pretty.js:284285 | constant |
| `x_y` | POLICY_BLOCK_MESSAGES | cli_inner_pretty.js:284290 | constant |
| `Xyy` | collectWhitespaceIssues | cli_inner_pretty.js:282555 | function |
| `y_o` | coerceToArray | cli_inner_pretty.js:282778 | function |
| `Yar` | isUnconfiguredServer | cli_inner_pretty.js:266811 | function |

## Module: MCP Managed Policy

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$yy` | NEUTRAL_VALUE_TOKEN ("zzenvsubzz") | cli_inner_pretty.js:282816 | constant |
| `AMt` | expandSettingsEnvBlock | cli_inner_pretty.js:267780 | function |
| `Byy` | SCHEME_POSITION_DELIMITERS | cli_inner_pretty.js:282870 | constant |
| `c_o` | parseUrlLoose | cli_inner_pretty.js:281418 | function |
| `Fyy` | AUTHORITY_POSITION_DELIMITERS | cli_inner_pretty.js:282870 | constant |
| `g7` | expandEnvPlaceholders | cli_inner_pretty.js:267981 | function |
| `g_o` | expandWithProcessEnv | cli_inner_pretty.js:281834 | function |
| `Gyy` | valueContainsDotSegment | cli_inner_pretty.js:281912 | function |
| `iWu` | valueInjectsWildcard | cli_inner_pretty.js:267971 | function |
| `j_s` | PLACEHOLDER_REGEX_SOURCE | cli_inner_pretty.js:268008 | constant |
| `jyy` | DOT_SEGMENT_RE | cli_inner_pretty.js:282871 | constant |
| `n7t` | isSettingsSourcedEnvVarAllowed | cli_inner_pretty.js:57846 | function |
| `n8u` | expandPolicyUrlPattern | cli_inner_pretty.js:281925 | function |
| `nHh` | SETTINGS_ENV_ALLOWLIST | cli_inner_pretty.js:57993 | constant |
| `NQr` | getFrozenStartupEnv | cli_inner_pretty.js:267771 | function |
| `Nyy` | classifyVarPositions | cli_inner_pretty.js:281870 | function |
| `Oyy` | buildPolicyExpansionEnvWithFallback | cli_inner_pretty.js:281842 | function |
| `r8u` | expandPolicyString | cli_inner_pretty.js:281855 | function |
| `sSs` | neutralizeValue | cli_inner_pretty.js:281863 | function |
| `t8u` | buildPolicyExpansionEnv | cli_inner_pretty.js:281837 | function |
| `tdt` | isMcpServerDenied | cli_inner_pretty.js:282089 | function |
| `Uyy` | valueBreaksItsPosition | cli_inner_pretty.js:281904 | function |
| `Vyy` | getAllowlistSettingsSource | cli_inner_pretty.js:282082 | function |
| `ZFe` | isMcpServerAllowed | cli_inner_pretty.js:282116 | function |
| `zMt` | ADMIN_WILDCARD_SENTINEL | cli_inner_pretty.js:282869 | constant |
| `zyy` | getDenylistSettingsSource | cli_inner_pretty.js:282086 | function |

## Module: MCP OAuth

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `E9u` | pickCuratedScope | cli_inner_pretty.js:288174 | function |
| `mEs` | readMcpOAuthClientConfig | cli_inner_pretty.js:288169 | function |
| `RAy` | MCP_AUTH_ERROR_SEVERITY | cli_inner_pretty.js:294630 | object |
| `v9u` | ensureOfflineAccessScope | cli_inner_pretty.js:288180 | function |
| `wKu` | classifyMcpAuthFailure | cli_inner_pretty.js:293071 | function |
| `XSy` | clearMcpOAuthClientSecret | cli_inner_pretty.js:288161 | function |
| `YSy` | storeMcpOAuthClientSecret | cli_inner_pretty.js:288150 | function |

## Module: MCP Reserved Names and Permission Floor

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AEy` | HOST_SURFACE_SERVERS | cli_inner_pretty.js:289043 | constant |
| `Bde` | isStdioServerConfig | cli_inner_pretty.js:151671 | function |
| `dWn` | RESERVED_WORKSPACE_SERVER_NAME | cli_inner_pretty.js:60372 | constant |
| `El` | normalizeMcpServerName | cli_inner_pretty.js:60201 | function |
| `fkg` | CLAUDE_BROWSER_SERVER_NAME | cli_inner_pretty.js:151629 | constant |
| `gkg` | HOST_SURFACE_NAME_SET | cli_inner_pretty.js:151634 | variable |
| `J_e` | isComputerUseServerName | cli_inner_pretty.js:151422 | function |
| `K9u` | PREVIEW_SERVERS | cli_inner_pretty.js:289042 | constant |
| `Ler` | isHostSurfaceServerName | cli_inner_pretty.js:151605 | function |
| `nze` | resolveMcpPermissionMode | cli_inner_pretty.js:289015 | function |
| `pkg` | CLAUDE_PREVIEW_SERVER_NAME | cli_inner_pretty.js:151628 | constant |
| `UIt` | isReservedMcpServerName | cli_inner_pretty.js:151668 | function |
| `xY` | isClaudeInChromeServerName | cli_inner_pretty.js:151636 | function |
| `Y9u` | parseMcpPermissionModeOverride | cli_inner_pretty.js:289032 | function |

## Module: MCP Roots

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `adt` | getAdditionalWorkingDirectories | cli_inner_pretty.js:284573 | function |
| `BAy` | STAGING_ROOT_PLUGINS | cli_inner_pretty.js:294641 | constant |
| `Clr` | getClientCapabilities | cli_inner_pretty.js:281497 | function |
| `eYu` | isSchemaNormalizeEnabledFor | cli_inner_pretty.js:293412 | function |
| `nYu` | shouldIncludeStagingRoot | cli_inner_pretty.js:293435 | function |
| `O_o` | updateAdditionalWorkingDirsSnapshot | cli_inner_pretty.js:284576 | function |
| `orr` | ensurePluginToolStagingDir | cli_inner_pretty.js:166520 | function |
| `rYu` | getRootsListResponse | cli_inner_pretty.js:293418 | function |
| `UAy` | notifyMcpRootsListChanged | cli_inner_pretty.js:293444 | function |
| `Ubo` | CONNECTED_MCP_CLIENTS | cli_inner_pretty.js:294642 | variable |
| `xSs` | ADDITIONAL_WORKING_DIRS_SNAPSHOT | cli_inner_pretty.js:284582 | variable |

## Module: MCP Runtime Generations

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$0y` | getMcpTaskWatcherModule | cli_inner_pretty.js:302452 | function |
| `aTy` | MCP_TREE_ID_V1 | cli_inner_pretty.js:300019 | constant |
| `B0y` | getMcpIsListAuthErrorModule | cli_inner_pretty.js:302464 | function |
| `Cgo` | MCP_SDK_GENERATION_MEMO | cli_inner_pretty.js:262865 | variable |
| `F0y` | getMcpDirectoryReadModule | cli_inner_pretty.js:302460 | function |
| `j0y` | getMcpSkillsListModule | cli_inner_pretty.js:302472 | function |
| `M0y` | getMcpAuthModule | cli_inner_pretty.js:302444 | function |
| `N0y` | getMcpSdkErrorClassificationModule | cli_inner_pretty.js:302456 | function |
| `O0y` | getMcpElicitationHandlerModule | cli_inner_pretty.js:302448 | function |
| `o9` | getMcpSdkGeneration | cli_inner_pretty.js:262846 | function |
| `P0y` | getMcpClientModule | cli_inner_pretty.js:302428 | function |
| `U0y` | getMcpXaaIdpLoginModule | cli_inner_pretty.js:302468 | function |
| `xAy` | MCP_TREE_ID_V2 | cli_inner_pretty.js:294477 | constant |

## Module: MCP Timeouts

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_Ay` | DEFAULT_MCP_TOOL_TIMEOUT_MS (1e8) | cli_inner_pretty.js:294467 | constant |
| `AAy` | STDIO_IDLE_TIMEOUT_MS (1800000) | cli_inner_pretty.js:294473 | constant |
| `CKu` | DEFAULT_MCP_REQUEST_TIMEOUT_MS (60000) | cli_inner_pretty.js:294488 | constant |
| `dHh` | MAX_FOLDED_REQUEST_TIMEOUT_MS (300000) | cli_inner_pretty.js:58768 | constant |
| `Dvs` | reportSubSecondTimeout | cli_inner_pretty.js:292940 | function |
| `EAy` | resetSubSecondTimeoutProbe | cli_inner_pretty.js:292948 | function |
| `l7u` | getMcpToolIdleTimeoutMs (v1 twin) | cli_inner_pretty.js:298499 | function |
| `MKu` | getMcpToolIdleTimeoutMs | cli_inner_pretty.js:292957 | function |
| `MN` | getMcpConnectTimeoutMs | cli_inner_pretty.js:285811 | function |
| `Nvs` | getMcpRequestTimeoutMs | cli_inner_pretty.js:293353 | function |
| `PKu` | MAX_MCP_TIMEOUT_MS (2147483647) | cli_inner_pretty.js:294468 | constant |
| `Pvs` | getMcpToolTimeoutMs | cli_inner_pretty.js:292951 | function |
| `Ten` | withRequestTimeout | cli_inner_pretty.js:293357 | function |
| `vAy` | REMOTE_IDLE_TIMEOUT_MS (300000) | cli_inner_pretty.js:294472 | constant |
| `wAy` | IDLE_EXEMPT_TRANSPORTS | cli_inner_pretty.js:294628 | constant |
| `X5n` | foldRequestTimeoutIntoTimeout | cli_inner_pretty.js:58729 | function |
| `yWl` | REQUEST_TIMEOUT_MS_SCHEMA | cli_inner_pretty.js:58766 | function |

## Module: MCP — result size and stderr

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `b5u` | `MCP_IMAGE_TOKEN_ESTIMATE` (`1600`) | cli_inner_pretty.js:266654 | constant |
| `Dmy` | `DEFAULT_MCP_OUTPUT_TOKEN_LIMIT` (`25000`) | cli_inner_pretty.js:266655 | constant |
| `gMt` | `estimateMcpResultTokens` | cli_inner_pretty.js:266575 | function |
| `HQr` | `mcpResultExceedsTokenLimit` | cli_inner_pretty.js:266629 | function |
| `Lmy` | `MCP_RESULT_PRECHECK_RATIO` (`0.5`) | cli_inner_pretty.js:266653 | constant |
| `MFe` | `stripMetaFromTextBlocks` | cli_inner_pretty.js:266551 | function |
| `Mmy` | `truncateMcpContentBlocks` (now calls `ma`; 193 twin `KKd` used raw `.slice` `:244811 (193)`) | cli_inner_pretty.js:266595 | function |
| `OFe` | `truncateMcpResultIfOversized` | cli_inner_pretty.js:266649 | function |
| `Omy` | `applyMcpResultTruncation` | cli_inner_pretty.js:266639 | function |
| `Pmy` | `buildMcpTruncationNotice` | cli_inner_pretty.js:266588 | function |
| `R9e` | `getMcpOutputCharBudget` (`tyo() * 4`) | cli_inner_pretty.js:266585 | function |
| `tyo` | `getMcpOutputTokenLimit` (`MAX_MCP_OUTPUT_TOKENS` → gate `tengu_velvet_ibis.mcp_tool` → `Dmy`) | cli_inner_pretty.js:266544 | function |

## Module: MCP — transport retryable codes

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Lyy` | `CLAUDEAI_MCP_RETRYABLE_CODES` (7 codes) | cli_inner_pretty.js:281623 | constant |
| `pSs` | `MCP_RETRYABLE_CODES_AND_STATUSES` | cli_inner_pretty.js:283135 | constant |
| `vZr` | `MCP_RETRYABLE_CODES` (11 codes; was 8 in 193) | cli_inner_pretty.js:283121 | constant |

## Module: Model Capabilities

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$xg` | `provider1MSupport` — `native_1m_3p`; the `gateway` arm requires bedrock **and** vertex **and** foundry | cli_inner_pretty.js:150210-150222 | function |
| `_7n` | `isMythosAvailable` — first-party + official base URL + enabled server row | cli_inner_pretty.js:110534-110537 | function |
| `ait` | `defaultEffortForModel` — `ww(lo(e))?.default_effort ?? "high"` | cli_inner_pretty.js:119625-119627 | function |
| `Aws` | `advisorRankForModel` — `ww(lo(vi(e)))?.advisor_rank` | cli_inner_pretty.js:308413-308415 | function |
| `Ede` | `getEnvDeclaredCapability` — 3P-only per-model capability declaration; inert when `rm()`; memoised on `"<id>:<cap>"` | cli_inner_pretty.js:118826-118844 | function |
| `eqe` | `supportsMaxEffort` — 4-layer predicate (`max_effort`) | cli_inner_pretty.js:119376-119398 | function |
| `eug` | `MODEL_CAPABILITY_ENV_PAIRS` — 5 rows of `{modelEnvVar, capabilitiesEnvVar}`; `_SUPPORTED_CAPABILITIES` 220=15/193=15 | cli_inner_pretty.js:118804-118825 | constant |
| `F6e` | `isFableModelId` — `e.includes("claude-fable-5")` | cli_inner_pretty.js:110515-110517 | function |
| `I_e` | `supportsXhighEffort` — 4-layer predicate (`xhigh_effort`) | cli_inner_pretty.js:119393-119413 | function |
| `IP` | `isNative1MModel` — `context.native_1m` + provider check; contains the dead id `claude-mythos-preview` | cli_inner_pretty.js:150201-150209 | function |
| `KFc` | `isMythosFamilyId` — `e.startsWith("claude-mythos-")` | cli_inner_pretty.js:118789-118791 | function |
| `M$` | `modelHasCapability` — **tri-state**: `true` \ | `undefined`, never `false`; `undefined` is what makes the hardcoded deny-lists load-bearing | cli_inner_pretty.js:14517-14522 |
| `O6e` | `is1MContextDisabled` — `CLAUDE_CODE_DISABLE_1M_CONTEXT` | cli_inner_pretty.js:150194-150196 | function |
| `oQt` | `isMythos5ModelId` — `e.includes("claude-mythos-5")` | cli_inner_pretty.js:110518-110520 | function |
| `Q8` | `supports1MBeta` — `context.supports_1m_beta` \ | provider default | cli_inner_pretty.js:150232-150238 |
| `Qkt` | `isFableAvailable` — requires a **server-provided non-disabled** Fable row in `additional_model_options` | cli_inner_pretty.js:110521-110533 | function |
| `RQt` | `rejectsDisabledThinking` — `rejects_disabled_thinking` capability | cli_inner_pretty.js:119691-119709 | function |
| `Ser` | `supportsMidConversationSystem` — deny-list then `M$(r,"mid_conv_system") \ | \ | r === "claude-mythos-5"`; **Sonnet 5 passes** (the `.201` revert) |
| `SWi` | `supportsThinking` — `Ede(e,"thinking")` then `!lo(e).includes("claude-3-")` | cli_inner_pretty.js:119685-119689 | function |
| `Uot` | `isLegacy200kOnlyModel` — the shared 5-id legacy exclusion list | cli_inner_pretty.js:150223-150231 | function |
| `v5r` | `isMythos5Canonical` — `Qs(lo(e)) === "claude-mythos-5"` | cli_inner_pretty.js:150546-150548 (decl at 110546-110548) | function |
| `W1e` | `needsFable5Mitigations` — `M$(e,"fable_5_mitigations") \ | \ | e === "claude-mythos-5"` |
| `wws` | `advisorRankForModelGated` — drops Fable when `!Qkt()` and Mythos when `!_7n()`; the `.210` server-side path | cli_inner_pretty.js:308417-308424 | function |
| `xT` | `isFableSelection` — canonical id or `ANTHROPIC_DEFAULT_FABLE_MODEL` match | cli_inner_pretty.js:110543-110545 | function |
| `z8m` | `externalCapabilityResolver` — declared and called (`:14521`) but **never assigned**; an unused extension seam | cli_inner_pretty.js:14530 | variable |
| `Zcg` | `needsFullSystemPrompt` — inverted-polarity `lean_prompt` probe (returns `!1` when the capability is present) | cli_inner_pretty.js:118727-118742 | function |
| `ZXn` | `usesOpus5PromptBundle` — `M$(lo(e),"opus_5_prompt_bundle") === !0 && !Ke(Qcg,!1)` | cli_inner_pretty.js:118701-118704 | function |

## Module: Model Catalogue

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Ti` | `resolvePricingTier` — `entry.pricing` token → cost record via `yQ().pricing_tiers` | cli_inner_pretty.js:14511-14516 | function |
| `B8m` | `providerIdsSchema` — 8-provider zod object, `.loose()` | cli_inner_pretty.js:14535-14548 | object |
| `csc` | `CATALOG_MODEL_IDS` — 17-id sync list; `Oig()` throws if a catalogue id is missing from it | cli_inner_pretty.js:86580-86598 | constant |
| `Ekl` | `pricingTierSchema` — `{input, output, cache_write_5m, cache_write_1h, cache_read, web_search}` | cli_inner_pretty.js:14549-14560 | object |
| `G8m` | `modelCatalogueSchema` — top-level schema (`schema_version`, `pricing_tiers`, `models`, `aliases`, `defaults`, `best`, `latest_per_family`, `alias_migration`) | cli_inner_pretty.js:14630-14643 | object |
| `iRc` | `resolveBestFamily` — reads `yQ().best`, honours it only if the family is in `m7n` and `.available()`; else `"opus"` | cli_inner_pretty.js:110496-110500 | function |
| `j8m` | `aliasEntrySchema` — `{default, per_provider?}` | cli_inner_pretty.js:14627-14629 | object |
| `m1e` | `MODEL_ALIASES` — `["sonnet","opus","haiku","fable","best","sonnet[1m]","opus[1m]","fable[1m]","opusplan"]` | cli_inner_pretty.js:86599 | constant |
| `m7n` | `BEST_FAMILY_REGISTRY` — `{ fable: { available, defaultModel, builtinDefault } }`, one entry | cli_inner_pretty.js:111372 | object |
| `MFr` | `catalogueIdForProviderId` — reverse lookup via `V8m` | cli_inner_pretty.js:14505-14507 | function |
| `Oig` | `buildCatalogueCostTable` — catalogue → `{id: ModelCosts}`; throws `"model catalog id missing from CATALOG_MODEL_IDS"` | cli_inner_pretty.js:109742-109755 | function |
| `PFr` | `getModelCatalogue` (alias of `yQ`) — memoised `safeParse` | cli_inner_pretty.js:14653-14656 | function |
| `q8m` | `catalogueByIdIndex` — memoised `id → entry` map | cli_inner_pretty.js:14658-14662 | function |
| `qlE` | `ALIAS_MIGRATION_MAP` — `{}`; **not** wired to `yQ().alias_migration`, so `rTm` is inert | cli_inner_pretty.js:833757 | constant |
| `Rjr` | `FAMILY_ALIASES` — `["sonnet","opus","haiku","fable"]` | cli_inner_pretty.js:86600 | constant |
| `rTm` | `migrateModelAlias` — emits `tengu_alias_migration`; unreachable in 2.1.220 (empty map) | cli_inner_pretty.js:833732-833744 | function |
| `Se` | `memoiseNullary` — `() => (t ??= e())` | cli_inner_pretty.js:14498-14501 | function |
| `Skl` | `BAKED_MODEL_CATALOGUE` — the declarative catalogue; doc-comment under key `"//"` at :14009 | cli_inner_pretty.js:14008-14496 | object |
| `sRc` | `resolveBestModel` — `m7n[best].defaultModel()` with the `Fji` re-entrancy latch | cli_inner_pretty.js:110501-110514 | function |
| `U8m` | `modelEntrySchema` — includes 6 fields no entry populates (`slogan`, `fallback_chain`, `picker`, `deprecation`, `min_cli_version`) | cli_inner_pretty.js:14561-14626 | object |
| `V8m` | `providerIdToCatalogueIdIndex` — throws `"model catalog: provider id collision across distinct entries"` | cli_inner_pretty.js:14663-14674 | function |
| `vkl` | `resolveAliasForProvider` — `aliases[alias].per_provider[provider] ?? aliases[alias].default` | cli_inner_pretty.js:14523-14529 | function |
| `W2n` | `stripTrailingZeroSuffix` — `replace(/-0$/, "")` | cli_inner_pretty.js:14502-14504 | function |
| `W8m` | `EMPTY_CATALOGUE` — `schema_version: 0` fail-soft fallback | cli_inner_pretty.js:14644-14652 | constant |
| `ww` | `getCatalogueEntry` — `id → entry` accessor | cli_inner_pretty.js:14508-14510 | function |
| `yQ` | `getModelCatalogue` — memoised validated catalogue accessor | cli_inner_pretty.js:14657 | function |

## Module: Model Picker UI

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$l_` | `bootstrapResponseSchema` — `org_model_default` at `:450610-450615`; the server row transform at `:450567-450582` **lost** 193's `Requires usage credits` append (`:350736-350738 (193)`) | cli_inner_pretty.js:450558-450640 | object |
| `$Qt` | `insertFableRowAfterFamilyBlock` — the `.206` #14 anchor-recovery fix; 193's `yat` at `:236104-236123 (193)` used the *default* family instead of the *actual* anchor family | cli_inner_pretty.js:120665-120701 | function |
| `$Wi` | `resolveRowValueForSelection` | cli_inner_pretty.js:120561-120566 | function |
| `_5r` | `pricingSuffixForModel` — gated by `uGr()` (first-party pricing only) | cli_inner_pretty.js:111178-111184 | function |
| `AJn` | `buildSonnet5Row` | cli_inner_pretty.js:120055-120065 | function |
| `Aug` | `orgAttributionSuffix` — `" · Set by your organization"` / `" · Org default"` | cli_inner_pretty.js:119999-120002 | function |
| `dit` | `substituteUnavailableRows` — entitlement-driven row substitution pass | cli_inner_pretty.js:120590-120603 | function |
| `DWi` | `buildOpusRowMinimal` | cli_inner_pretty.js:120244-120247 | function |
| `e2c` | `substituteRowValue` — what a row becomes after entitlement filtering | cli_inner_pretty.js:120570-120589 | function |
| `EJn` | `buildDefaultRow` — `"Default (recommended)"` + attribution + pricing | cli_inner_pretty.js:120006-120018 | function |
| `Goe` | `buildPricingSuffix` — per-row `{pricingSuffix, promoListPrice}`; the `.206` fix | cli_inner_pretty.js:120048-120054 | function |
| `Gug` | `disableFableRowsWithoutCredits` — `" — requires usage credits"` + `Fable (disabled)` | cli_inner_pretty.js:120656-120664 | function |
| `HWi` | `buildFableRow` | cli_inner_pretty.js:120093-120102 | function |
| `JIc` | `MODEL_RETIREMENT_TABLE` — camelCase `retirementDates` per provider; the one per-model dataset the catalogue rewrite did **not** absorb (cf. the empty `deprecation` schema slot at `:14616-14622`) | cli_inner_pretty.js:110053-110134 | object |
| `jug` | `assembleRawPickerRows` — custom option, gateway discovery, server rows, `availableModels` | cli_inner_pretty.js:120494-120559 | function |
| `KBc` | `orgDefaultSuffix` — `" · Org default"` (220=2/193=0) | cli_inner_pretty.js:120003-120005 | function |
| `kWi` | `REQUIRES_USAGE_CREDITS_SUFFIX` — `" · Requires usage credits"` (220=1/**193=2** inline appends) | cli_inner_pretty.js:120715 | constant |
| `Mcn` | `persistModelAsDefault` — `yi("userSettings", {model})` | cli_inner_pretty.js:450890-450892 | function |
| `nqe` | `decorateRowsWithModelMeta` — adds `resolvedModel`, `promoListPrice`, effort flags | cli_inner_pretty.js:120604-120639 | function |
| `NQt` | `isFableRowValue` | cli_inner_pretty.js:120649-120651 | function |
| `OQt` | `rowsReferToSameModel` | cli_inner_pretty.js:120641-120648 | function |
| `Oug` | `ensureFamilyRowPresent` | cli_inner_pretty.js:120288-120293 | function |
| `OWi` | `buildPickerOptionsWithTelemetry` — `model_picker_options` with `dropped`/`duplicates`/reason sets (220=4/193=0) | cli_inner_pretty.js:120435-120453 | function |
| `Pcn` | `applyModelSwitch` — calls `IU` + `kmt` + `X2s` | cli_inner_pretty.js:450878-450889 | function |
| `pit` | `buildPickerOptions` — dedupe → org suffix → Fable credit gate → error overrides → disabled-last | cli_inner_pretty.js:120456-120493 | function |
| `PWi` | `buildOpus1MRow` | cli_inner_pretty.js:120263-120275 | function |
| `qWf` | `buildLeaderCommandNotice` — `"/model changes the team lead's model, not this teammate's"` | cli_inner_pretty.js:748982-748998 | function |
| `Tug` | `normaliseFableCreditSuffix` — **strip-then-re-append**, the idempotent `.219` #9 fix | cli_inner_pretty.js:120087-120092 | function |
| `UBc` | `buildOpus5With1MRow` — `label: "Opus (1M context)"` set at source | cli_inner_pretty.js:120200-120210 | function |
| `Uug` | `recordDroppedRow` — `entitlement_denied` / `allowlist_filtered` | cli_inner_pretty.js:120432-120435 | function |
| `VBc` | `isFableIdPattern` — the dated/versioned/`[1m]` Fable regex | cli_inner_pretty.js:120652-120655 | function |
| `vde` | `pickerBuildStats` — `{dropped, duplicates, dropReasons, disabledReasons}` | cli_inner_pretty.js:120718 | variable |
| `wJn` | `familyOfModelValue` — `fable \ | opus \ | sonnet \ |
| `wug` | `sonnet5PromoPricing` — `"$2/$10 per Mtok · promo through <date>"`, `promoListPrice: "$3/$15"` | cli_inner_pretty.js:120043-120047 | function |
| `X2s` | `buildModelSwitchOverrideNotice` — `"Your organization's default (X) applies on restart"` | cli_inner_pretty.js:450893-450929 | function |
| `XBc` | `buildOpus5Row` | cli_inner_pretty.js:120147-120157 | function |
| `Xep` | `buildLatestModelsPromptSection` — consumes `yQ().latest_per_family` for the claude-api skill | cli_inner_pretty.js:508104-508110 | function |
| `xmt` | `fetchBootstrapData` — writes `orgModelDefaultCache` / `modelAccessCache` / `additionalModelOptionsCache` | cli_inner_pretty.js:450414-450499 | function |
| `xWi` | `ensureAliasRowsPresent` | cli_inner_pretty.js:120282-120287 | function |
| `YBc` | `fableCreditSuffixIfNeeded` | cli_inner_pretty.js:120084-120086 | function |
| `ZBc` | `noModelRestrictionsActive` | cli_inner_pretty.js:120567-120569 | function |

## Module: Model Pricing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$ig` | `cacheWriteCost` — splits 1h vs 5m ephemeral cache writes | cli_inner_pretty.js:109756-109762 | function |
| `a7n` | `FAST_MODE_COSTS_TIER_10_50` — `{10, 50, 12.5, 20, 1, 0.01}`; the changelog's "$10/$50" | cli_inner_pretty.js:109843-109850 | constant |
| `BIc` | `formatDollars` — `$N` for integers, `$N.NN` otherwise | cli_inner_pretty.js:109803-109806 | function |
| `Dig` | `COSTS_TIER_5_25` — `{5, 25, 6.25, 10, 0.5, 0.01}` | cli_inner_pretty.js:109827-109834 | constant |
| `Dji` | `resolveModelCosts` — **fast-mode cost substitution** on `usage.speed === "fast"`; disproves ground-truth §6.5 | cli_inner_pretty.js:109772-109784 | function |
| `Fot` | `MODEL_COSTS` — `{fable: a7n, mythos: a7n, ...Oig()}`; the spread wins | cli_inner_pretty.js:109853 | constant |
| `GIc` | `tierToModelCosts` — throws `"model catalog entry has incomplete pricing"` | cli_inner_pretty.js:109726-109738 | function |
| `jIc` | `formatCataloguePriceForModel` | cli_inner_pretty.js:109720-109725 | function |
| `Kkt` | `costForTokenUsage` — forwards `speed` into `Dji` | cli_inner_pretty.js:109792-109802 | function |
| `l7n` | `DEFAULT_MODEL_COSTS` — alias of `Dig` | cli_inner_pretty.js:109851 | constant |
| `Lji` | `computeCostFromUsage` — the per-turn dollar accumulator | cli_inner_pretty.js:109763-109771 | function |
| `M6e` | `formatPricePerMtok` — `"$X/$Y per Mtok"` | cli_inner_pretty.js:109807-109809 | function |
| `Mig` | `isKnownCatalogueId` — `Pig.has(e)` | cli_inner_pretty.js:109739-109741 | function |
| `Nig` | `reportUnknownModelCost` — `tengu_unknown_model_cost` | cli_inner_pretty.js:109785-109787 | function |
| `Pig` | `CATALOG_MODEL_ID_SET` — `new Set(csc)` | cli_inner_pretty.js:109852 | constant |
| `Roe` | `costForApiUsage` | cli_inner_pretty.js:109788-109791 | function |
| `UIc` | `FAST_MODE_COSTS_OPUS_46_47` — `{30, 150, 37.5, 60, 3, 0.01}` (6× base) | cli_inner_pretty.js:109835-109842 | constant |
| `WIc` | `formatModelPriceFromCosts` — `Fot[lo(e)]` → `M6e` | cli_inner_pretty.js:109810-109815 | function |
| `zkt` | `costsForFastModeDisplay` — display-side twin of `Dji` | cli_inner_pretty.js:109715-109719 | function |

## Module: Model Selection

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$1e` | `getAdditionalModelOptions` — validated `additionalModelOptionsCache` rows | cli_inner_pretty.js:154474-154484 | function |
| `$Fc` | `isOpus48` | cli_inner_pretty.js:118668 | function |
| `A5r` | `getDefaultOpusModelWithSuffix` — walks `i4i` for the first permitted Opus | cli_inner_pretty.js:110549-110556 | function |
| `A7n` | `describeDefaultModelRow` — renders `" · Org default"` / `" · Set by your organization"` | cli_inner_pretty.js:111164-111176 | function |
| `aRc` | `applyContextSuffix` — appends `[1m]` when the source carried it | cli_inner_pretty.js:110557-110560 | function |
| `aW` | `MID_CONVERSATION_SYSTEM_BETA` | cli_inner_pretty.js:109214 | constant |
| `B6e` | `getHaikuDefault` | cli_inner_pretty.js:110640-110644 | function |
| `b7n` | `resolveFamilyAliasFromCatalogue` — `vkl(alias, Yig[provider])` then map through `f_e` | cli_inner_pretty.js:110607-110612 | function |
| `C5r` | `noFallbackTripwire` — throws the `CLAUDE_CODE_NO_MODEL_FALLBACK` unreachable-branch error | cli_inner_pretty.js:111088-111095 | function |
| `cRc` | `resolveBaselineSetting` — provider-shaped baseline (mantle / bedrock+vertex / else sonnet) | cli_inner_pretty.js:110770-110783 | function |
| `CT` | `getSonnetDefault` | cli_inner_pretty.js:110632-110635 | function |
| `E7n` | `resolveEnforcedAvailableModel` — `availableModels` + `modelOverrides` enforcement (not dissected) | cli_inner_pretty.js:110784-110936 | function |
| `Ede` | `getCustomModelCapabilityOverride` | cli_inner_pretty.js:118826 | variable |
| `EE` | `getOpusDefault` — `ANTHROPIC_DEFAULT_OPUS_MODEL` else `N6e()` | cli_inner_pretty.js:110621-110625 | function |
| `eug` | `CUSTOM_MODEL_ENV_VAR_PAIRS` | cli_inner_pretty.js:118800 | constant |
| `f5r` | `newestPermittedModelInFamily` — reverse scan of `Ul` | cli_inner_pretty.js:110162-110168 | function |
| `fde` | `canAppend1MSuffix` | cli_inner_pretty.js:110937-110941 | function |
| `h7n` | `sonnetDefaultFromConfigs` — `b7n("sonnet", …) ?? e.sonnet46` | cli_inner_pretty.js:110637-110639 | function |
| `hro` | `modelPrefersTemperature` | cli_inner_pretty.js:150398 | function |
| `iQt` | `resolveModelWithAttribution` — the 4-level ladder; `attribution ∈ {"org","enforced","entitlement","tier"}` | cli_inner_pretty.js:110736-110751 | function |
| `j6e` | `findNonFableFallbackModel` — returns `null` under `CLAUDE_CODE_NO_MODEL_FALLBACK` | cli_inner_pretty.js:111099-111107 | function |
| `jji` | `maybeSeedSonnetDefault` — ignores probe-written env defaults | cli_inner_pretty.js:110561-110573 | function |
| `KA` | `getResolvedDefaultModel` — `vi(Z$())` | cli_inner_pretty.js:111082-111084 | function |
| `KO` | `is1MContextOffered` | cli_inner_pretty.js:111186-111190 | function |
| `l0t` | `setResolvedOrgDefault` — writes `Ot.resolvedOrgDefault` (220=3/193=0) | cli_inner_pretty.js:110057-110059 (decl 3057-3059) | function |
| `lo` | `normaliseToCatalogueId` — override reverse-map, inference-profile resolution, then `YO` | cli_inner_pretty.js:111141-111148 | function |
| `lRc` | `validateOrgDefaultModel` — enforced+entitlement check, `null` if unusable | cli_inner_pretty.js:110728-110732 | function |
| `M$` | `modelHasCapability` | cli_inner_pretty.js:14517 | function |
| `mb` | `getModelDisplayName` — `ww(t).display_name` (+ `" (1M context)"`); returns `undefined` on Foundry | cli_inner_pretty.js:111291-111299 | function |
| `mro` | `isSonnet5` | cli_inner_pretty.js:150395 | function |
| `N6e` | `opusDefaultFromConfigs` — `b7n("opus", …) ?? e.opus5` | cli_inner_pretty.js:110626-110628 | function |
| `Nji` | `getOrgModelDefaultCache` — strict shape validation, org-UUID binding, control-char scrub | cli_inner_pretty.js:154491-154507 | function |
| `nm` | `getModelLabel` — server/gateway row label, then `Poe`, then the raw id | cli_inner_pretty.js:111217-111225 | function |
| `Oi` | `getSessionModelResolved` | cli_inner_pretty.js:110491-110495 | function |
| `Ooe` | `canonicalIdWithout1M` — `Qs(lo(e))` | cli_inner_pretty.js:111155-111157 | function |
| `Poe` | `catalogueDisplayNameWithSuffix` — uses `context.supports_1m_suffix` | cli_inner_pretty.js:111211-111216 | function |
| `S7n` | `stepDownToEntitledFamily` — opus→sonnet→haiku walk under entitlement | cli_inner_pretty.js:110752-110769 | function |
| `Ser` | `supportsMidConversationSystem` | cli_inner_pretty.js:150505 | variable |
| `U6e` | `getValidatedOrgDefaultModel` | cli_inner_pretty.js:110723-110727 | function |
| `VCe` | `isModelFallbackForbidden` — `CLAUDE_CODE_NO_MODEL_FALLBACK` (220=6/193=0) | cli_inner_pretty.js:111085-111087 | function |
| `vi` | `resolveModelAlias` — the alias switch incl. `"best"` → `sRc()` | cli_inner_pretty.js:111232-111253 | function |
| `Vji` | `haikuDefaultFromConfigs` | cli_inner_pretty.js:110645-110647 | function |
| `vkl` | `resolveAliasForProvider` | cli_inner_pretty.js:14523 | function |
| `w5r` | `getFableDefault` | cli_inner_pretty.js:110613-110616 | function |
| `w_e` | `experimentalBetasDisabled` | cli_inner_pretty.js:109341 | function |
| `Wji` | `fableDefaultFromConfigs` | cli_inner_pretty.js:110617-110620 | function |
| `wSi` | `getResolvedOrgDefault` — reads `Ot.resolvedOrgDefault`; `undefined` = unresolved, `null` = none | cli_inner_pretty.js:3054-3056 | function |
| `x5r` | `buildAvailabilityFallbackChain` — collapses to `[primary]` under the no-fallback env var | cli_inner_pretty.js:111096-111099 | function |
| `Y8` | `force1MSuffix` — idempotent `[1m]` append | cli_inner_pretty.js:110720-110722 | function |
| `Ykt` | `isLegacyModelRemapEnabled` — `!CLAUDE_CODE_DISABLE_LEGACY_MODEL_REMAP` | cli_inner_pretty.js:111255-111257 | function |
| `YO` | `canonicaliseModelId` — reverse index, regional `us.anthropic.` retry, then a 17-branch substring ladder | cli_inner_pretty.js:111109-111140 | function |
| `Z$` | `getSessionModelSetting` — `iQt().setting` | cli_inner_pretty.js:110733-110735 | function |
| `ZJt` | `getModelAccessEntitlements` — validated `modelAccessCache` rows | cli_inner_pretty.js:154485-154490 | function |

## Module: Model Selection (Explore inheritance, effort gating)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Wu` | EXPLORE_MODEL_CEILING (`"opus"`) | cli_inner_pretty.js:269283 | constant |
| `bY` | isUltracodeXhighSession (concurrency-cap exemption) | cli_inner_pretty.js:119417-119419 | function |
| `DYa` | EXPLORE_MODEL_CEILING (`"opus"`) | cli_inner_pretty.js:384831 (193) | constant |
| `Fno` | containsAnySubstring (case-insensitive) | cli_inner_pretty.js:156886-156890 | function |
| `Hn` | getProviderChannel (`firstParty`/`bedrock`/…/`anthropicGoogleCloud`) | cli_inner_pretty.js:100302-100312 | function |
| `khy` | shouldCapExploreAtOpus (firstParty AND model off the ladder) | cli_inner_pretty.js:269272-269276 | function |
| `M0` | isWorkflowsEnabled | cli_inner_pretty.js:119317-119323 | function |
| `M9e` | resolveExploreAgentModel | cli_inner_pretty.js:269267-269271 | function |
| `MWu` | MODEL_LADDER (`["haiku","sonnet","opus"]`) | cli_inner_pretty.js:269307 | constant |
| `RWp` | shouldCapExploreAtOpus | cli_inner_pretty.js:384820-384824 (193) | function |
| `RYa` | MODEL_LADDER | cli_inner_pretty.js:384855 (193) | constant |
| `Uoe` | resolveEffortLevel | cli_inner_pretty.js:119540-119551 | function |
| `WSe` | resolveExploreAgentModel (gated on `tengu_quartz_heron`) | cli_inner_pretty.js:384815-384819 (193) | function |

## Module: Model selection — flag-settings cache

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Jx` | `getClientDataFlags` (per-account server-pushed cache) | cli_inner_pretty.js:536953 | function |
| `q2s` | `setClientDataAvailabilityProbe` | cli_inner_pretty.js:536963 | function |
| `W2s` | `setClientDataAccountKeyFn` | cli_inner_pretty.js:536950 | function |

## Module: Model — context-window resolution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ber` | `DEFAULT_CONTEXT_WINDOW` (`200000`) | cli_inner_pretty.js:150314 | constant |
| `CSi` | `setLongContext1mCreditsBlocked` | cli_inner_pretty.js:3069 | function |
| `dro` | `getSonnet46WindowOverride` (clientdata `kelp_forest_sonnet`) | cli_inner_pretty.js:150272 | function |
| `fZc` | `getDisableCompactWindowOverride` (`CLAUDE_CODE_MAX_CONTEXT_TOKENS`, only under `DISABLE_COMPACT`) | cli_inner_pretty.js:150245 | function |
| `gxe` | `LONG_CONTEXT_CLAMP` (`200000`; a constant distinct from `ber` with the same value) | cli_inner_pretty.js:150315 | constant |
| `gZc` | `getAutoCompactWindowsCache` (**NEW site** — persisted cache, first-party auth only) | cli_inner_pretty.js:150268 | function |
| `H9t` | `isLongContext1mCreditsBlocked` (session flag, unset until the first API response) | cli_inner_pretty.js:3066 | function |
| `hZc` | `getClientDataWindowTable` (`rowan_thicket` source) | cli_inner_pretty.js:150265 | function |
| `m7i` | `isLongContextClampedToBaseline` | cli_inner_pretty.js:150252 | function |
| `Mxg` | `MAX_OUTPUT_TOKENS_32K` (`32000`) | cli_inner_pretty.js:150316 | constant |
| `mZc` | `getNativeContextWindow` (the 1M ladder) | cli_inner_pretty.js:150255 | function |
| `Nxg` | `CONTEXT_WINDOW_1M` (`1e6`) | cli_inner_pretty.js:150318 | constant |
| `Oxg` | `MAX_OUTPUT_TOKENS_128K` (`128000`) | cli_inner_pretty.js:150317 | constant |
| `pro` | `computeContextUsedPercent` (clamped 0-100) | cli_inner_pretty.js:150282 | function |
| `Xv` | `getContextWindowTokens` | cli_inner_pretty.js:150239 | function |
| `yZc` | `getMaxOutputTokensMinusOne` | cli_inner_pretty.js:150311 | function |

## Module: Model — the Opus-4.8 experiment remnants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `XMu` | `OPUS_4_8_ID` (`"claude-opus-4-8"`; 193 `PZr` `:234872 (193)`, where it gated a compaction veto) | cli_inner_pretty.js:236862 | constant |

## Module: Model — token counting

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_Mt` | `countTokensPrimary` (Bedrock branch + **NEW** gateway catch fallback `:442384-442385`; 193 `uGe`) | cli_inner_pretty.js:442363 | function |
| `cBs` | `countTokensByCreateProbe` (`max_tokens: 1` estimator; 193 `kSl`) | cli_inner_pretty.js:442390 | function |
| `Cy` | `hasGatewayAuth` (`Ot.gatewayAuth`; guards the new catch fallback) | cli_inner_pretty.js:3459 | function |
| `eOd` | `findCompactAnchorRecord` | cli_inner_pretty.js:442577 | function |
| `gmt` | `countToolDefinitionTokens` (`return i ?? 0` — the site that rendered 0 on Bedrock) | cli_inner_pretty.js:441315 | function |
| `Hhr` | `countTokensWithFallback` (**carryover**, 4/4) | cli_inner_pretty.js:441299 | function |
| `khr` | `getLastApiUsage` (unbounded backward scan; **carryover**, 193 `hat` `:235307 (193)`) | cli_inner_pretty.js:442517 | function |
| `QMd` | `stripNonCountableToolFields` (**NEW** — the `.196` Bedrock `/context` fix) | cli_inner_pretty.js:442351 | function |
| `qMd` | `countTokensSinceCompactAnchor` (bounded by the boundary, unlike `khr`; 193 `JXi`) | cli_inner_pretty.js:442600 | function |
| `RMd` | `countTokensForString` | cli_inner_pretty.js:442359 | function |
| `wo_` | `countTokensBedrock` (AWS `CountTokensCommand` over an InvokeModel body) | cli_inner_pretty.js:442436 | function |
| `XMd` | `COUNT_TOKENS_THINKING_MAX_TOKENS` (`2048`) | cli_inner_pretty.js:442457 | constant |
| `yBs` | `COUNT_TOKENS_THINKING_BUDGET` (`1024`) | cli_inner_pretty.js:442456 | constant |

## Module: OAuth Lifecycle

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$xr` | `getLoginExpiryWarning` — returns `{daysLeft}` inside the warning window, else null | cli_inner_pretty.js:687497-687506 | function |
| `_no` | `KNOWN_DEAD_REFRESH_TOKENS` — process-local set, populated on `invalid_grant` | cli_inner_pretty.js:156130 | variable |
| `ast` | `isOAuthRefreshKnownDead` — `refreshToken === "" \ | \ | _no.has(refreshToken)`; also reads the store directly |
| `DXi` | `withOAuthRefreshLock` — lock + read, exposes `{lockedTokens, lockAttempts, isCompromised}`; retry cap `LHg = 5` | cli_inner_pretty.js:155246-155278 | function |
| `Dy` | `checkAndRefreshOAuthTokenIfNeeded` — boolean wrapper over `vno` | cli_inner_pretty.js:155279-155281 | function |
| `EB` | `getClaudeAIOAuthTokensAsync` | cli_inner_pretty.js:156164 (assignment), :154223 (export) | variable |
| `eey` | `LOGIN_EXPIRED_MESSAGE` — `"Login expired · Please run /login"` (220=1/193=0) | cli_inner_pretty.js:228953 | constant |
| `EW` | `clearOAuthTokenCache` | cli_inner_pretty.js:155056 | function |
| `gXi` | `oauthRefreshLockOptions` — `stale: 60000`, `update: 5000`, `onCompromised` forwards to the caller | cli_inner_pretty.js:155205-155215 | function |
| `LHg` | `OAUTH_LOCK_MAX_ATTEMPTS` = 5 | cli_inner_pretty.js:156018 | constant |
| `LXi` | `acquireOAuthRefreshLock` — dual (new + legacy) lock returning `{isCompromised, signal, release}` | cli_inner_pretty.js:155216-155245 | function |
| `ms` | `getClaudeAIOAuthTokens` (sync) | cli_inner_pretty.js:156010 (decl), :154224 (export) | variable |
| `rff` | `ONE_DAY_MS` = 86400000 | cli_inner_pretty.js:687507 | constant |
| `rtu` | `mergeOAuthRecord` — preserves `refreshTokenExpiresAt` / `subscriptionType` / `rateLimitTier` across a partial update | cli_inner_pretty.js:154993-155004 | function |
| `tff` | `LOGIN_EXPIRY_WARN_WINDOW_MS` = `3 * rff` — **the `.217` 5→3 day constant** | cli_inner_pretty.js:687508 (decl), :687512 (assignment) | constant |
| `Ver` | `saveOAuthTokensIfNeeded` — persists + emits `tengu_oauth_tokens_saved` / `_save_failed` | cli_inner_pretty.js:155005-… (read :155005-155029) | function |
| `vno` | `checkAndRefreshOAuthTokenIfNeededWithOutcome` — dedupes the depth-0 non-forced call via `j8r` | cli_inner_pretty.js:155282-155293 | function |
| `WQt` | `OAuthRefreshDeadError` — `"OAuth refresh token is no longer valid; run /login to re-authenticate"` | cli_inner_pretty.js:121405-121410 | class |
| `yXi` | `refreshOAuthTokenLocked` — the full refresh state machine; three `isCompromised()` checkpoints + CAS write | cli_inner_pretty.js:155297-155430 | function |

## Module: Permissions - decision telemetry

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `cIy` | `mapPromptSourceToTelemetrySource` | cli_inner_pretty.js:315664-315678 | function |
| `Dtd` | `mapClassifierDecisionReason` | cli_inner_pretty.js:315813-315815 | function |
| `DTs` | `pickPermissionResultTelemetryFields` | cli_inner_pretty.js:315816-315820 | function |
| `dur` | `buildToolDecisionBaseAttrs` | cli_inner_pretty.js:315679-315686 | function |
| `G4r` | `CAN_USE_TOOL_INVALID_RESULT_DECISION_REASON` | cli_inner_pretty.js:58381 | object |
| `i7t` | `CAN_USE_TOOL_ABORTED_REASON` (`"tool permission request aborted"`) | cli_inner_pretty.js:58356 | constant |
| `ITs` | `isCodeEditTool` | cli_inner_pretty.js:315650-315652 | function |
| `jPi` | `DECISION_REASON_TYPES` (11 members) | cli_inner_pretty.js:58364-58376 | constant |
| `LTs` | `mapDecisionReasonToInternalReasonAttr` | cli_inner_pretty.js:315761-315763 | function |
| `Mtd` | `mapDecisionReasonToInternalReason` | cli_inner_pretty.js:315764-315812 | function |
| `pIy` | `recordToolDecisionDenied` | cli_inner_pretty.js:315724-315735 | function |
| `Ptd` | `recordToolDecision` | cli_inner_pretty.js:315736-315760 | function |
| `q5n` | `PERMISSION_STREAM_CLOSED_REASON` | cli_inner_pretty.js:58353 | constant |
| `RTs` | `buildCodeEditDecisionAttrs` | cli_inner_pretty.js:315653-315663 | function |
| `s7t` | `CAN_USE_TOOL_ABORTED_DECISION_REASON` (`{type:"other", reason: i7t}`) | cli_inner_pretty.js:58383 | object |
| `V5n` | `CAN_USE_TOOL_INVALID_RESULT_REASON` | cli_inner_pretty.js:58354 | constant |
| `VPi` | `PERMISSION_STREAM_CLOSED_DECISION_REASON` | cli_inner_pretty.js:58380 | object |
| `XJy` | `mapDecisionReasonToTelemetrySource` | cli_inner_pretty.js:425294-425320 | function |
| `YJy` | `mapRuleSourceToTelemetrySource` | cli_inner_pretty.js:425283-425293 | function |
| `z5n` | `CAN_USE_TOOL_REQUEST_FAILED_REASON` | cli_inner_pretty.js:58355 | constant |
| `zPi` | `CAN_USE_TOOL_REQUEST_FAILED_DECISION_REASON` | cli_inner_pretty.js:58382 | object |

## Module: Permissions — Bash static analyzer

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$E` | `splitCommandSubstitutions` | cli_inner_pretty.js:512259 | function |
| `$ss` | `analyzeRedirectTarget` | cli_inner_pretty.js:210615 | function |
| `_0u` | `isIgnorableGapBytes` | cli_inner_pretty.js:210282 | function |
| `_Ke` | `makeDangerousRemovalAsk` | cli_inner_pretty.js:390676 | function |
| `_Ms` | `checkSedCommand` | cli_inner_pretty.js:390642 | function |
| `AIe` | `MAX_ANALYZABLE_COMMAND_CHARS` (`1e4`) | cli_inner_pretty.js:512643 | constant |
| `aVe` | `parseShellCommandAsync` | cli_inner_pretty.js:209760 | function |
| `cuo` | `hasDockerDaemonRedirectFlag` | cli_inner_pretty.js:212834 | function |
| `Dss` | `REDIRECT_OPERATORS` | cli_inner_pretty.js:212433 | object |
| `emr` | `analyzeRemovalTargets` | cli_inner_pretty.js:390689 | function |
| `Evd` | `checkDangerousRemovalsInCommand` | cli_inner_pretty.js:394257 | function |
| `Fsn` | `hasTokenizerDivergence` (6 regexes) | cli_inner_pretty.js:512253 | function |
| `gYr` | `hasDangerousPathPrefix` | cli_inner_pretty.js:214148 | function |
| `hYr` | `DAEMON_REDIRECT_FLAGS` (15 entries; 8 in 193 as `oYi`) | cli_inner_pretty.js:213928 | constant |
| `I0u` | `TEST_CONTAINER_NODE_TYPES` | cli_inner_pretty.js:212458 | constant |
| `L0u` | `walkTestCommandOperand` | cli_inner_pretty.js:210357 | function |
| `Lf` | `hasCommandSubstitutionSentinel` | cli_inner_pretty.js:209614 | function |
| `M0u` | `walkRedirectsInTree` | cli_inner_pretty.js:210603 | function |
| `nmr` | `hasCatastrophicRemovalPattern` | cli_inner_pretty.js:394710 | function |
| `ozg` | `DAEMON_REDIRECT_SHORT_CHARS` | cli_inner_pretty.js:213945 | constant |
| `P0u` | `auditRedirectNodeStructure` | cli_inner_pretty.js:210540 | function |
| `pvd` | `attachAskRuleForCircuitBreaker` | cli_inner_pretty.js:394411 | function |
| `R0u` | `auditTestCommandByteCoverage` | cli_inner_pretty.js:210323 | function |
| `Rie` | `walkCommandNode` | cli_inner_pretty.js:209829 | function |
| `SMs` | `findUnresolvableVariableRemoval` | cli_inner_pretty.js:390781 | function |
| `tmr` | `ARGV_TO_TARGETS` | cli_inner_pretty.js:391281 | object |
| `tvd` | `classifyReadOnlyCommand` | cli_inner_pretty.js:392117 | function |
| `vvd` | `hasBackgroundOperatorNode` | cli_inner_pretty.js:394399 | function |
| `Wsn` | `checkBackgroundOperator` | cli_inner_pretty.js:394424 | function |
| `yqy` | `isReadOnlyArgv` | cli_inner_pretty.js:391713 | function |

## Module: Permissions — PowerShell command prologue (NOT a permission check)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `M$g` | `commandMustStartWithDeclaration` | cli_inner_pretty.js:169486 | function |
| `O$g` | `POWERSHELL_ENV_OVERRIDES` (`PYTHONIOENCODING`, `NO_COLOR`) | cli_inner_pretty.js:169575 | object |
| `P$g` | `POWERSHELL_UTF8_PROLOGUE` | cli_inner_pretty.js:169565 | constant |

## Module: Permissions — `claude auto-mode` CLI

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Om` | `dedupeAutoModeSectionLabels` | cli_inner_pretty.js:865420 | function |
| `_vl` | `isPlainObject` | cli_inner_pretty.js:865431 | function |
| `LOm` | `warnOtherAutoModeScopesRemain` | cli_inner_pretty.js:865434 | function |
| `OOm` | `describeAutoModeSections` | cli_inner_pretty.js:865414 | function |
| `ROm` | `stripAutoModeAnsi` | cli_inner_pretty.js:865425 | function |
| `yvl` | `pluralizeCount` | cli_inner_pretty.js:865428 | function |

## Module: Permissions — auto mode availability

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_9s` | `getCachedAutoModeEnabledState` | cli_inner_pretty.js:529720 | function |
| `Cae` | `getAutoModeUnavailableReason` | cli_inner_pretty.js:529701 | function |
| `CCe` | `getAutoModeConfig` (+ untrusted-source detector) | cli_inner_pretty.js:63551 | function |
| `cWi` | `getMeadowLanternClientData` | cli_inner_pretty.js:536977 | function |
| `Eer` | `isAutoModeAvailableOnProvider` (tautology in 220; read the env var in 193 as `ont`) | cli_inner_pretty.js:150416 | function |
| `fcp` | `getClientDataCacheSlot` | cli_inner_pretty.js:536969 | function |
| `gk` | `isAutoModeEnterable` | cli_inner_pretty.js:529695 | function |
| `gro` | `isThirdPartyProviderWithAutoMode` | cli_inner_pretty.js:150420 | function |
| `H3r` | `AUTO_MODE_TRUSTED_SOURCES` (`userSettings`, `flagSettings`, `policySettings`) | cli_inner_pretty.js:63681 | constant |
| `h9s` | `coerceAutoModeEnabledState` | cli_inner_pretty.js:529708 | function |
| `iW` | `isAnthropicManagedCloudProvider` (`anthropicAws` \ | `anthropicGoogleCloud`) | cli_inner_pretty.js:100346 |
| `KMi` | `isAutoModeOptInAccepted` (vestigial `return !0`) | cli_inner_pretty.js:63537 | function |
| `m9s` | `isAutoModeDisabledBySettings` | cli_inner_pretty.js:529691 | function |
| `oqe` | `modelSupportsAutoMode` | cli_inner_pretty.js:150427 | function |
| `R2_` | `DEFAULT_AUTO_MODE_ENABLED_STATE` (`"enabled"`) | cli_inner_pretty.js:529775 | constant |
| `Sap` | `NO_CACHED_AUTO_MODE_CONFIG` (Symbol sentinel) | cli_inner_pretty.js:529821 | constant |
| `ume` | `formatAutoModeUnavailableReason` (4 reasons; `provider` unreachable) | cli_inner_pretty.js:529596 | function |
| `Vfn` | `verifyAutoModeGateAccess` | cli_inner_pretty.js:529614 | function |
| `XMi` | `isClassifyAllShellEnabled` | cli_inner_pretty.js:63591 | function |
| `y9s` | `getAutoModeEnabledStateWithSource` | cli_inner_pretty.js:529715 | function |
| `YMi` | `isAutoModeAllowedDuringPlan` | cli_inner_pretty.js:63540 | function |
| `ynt` | `projectSettingsPathEqualsUserSettingsPath` | cli_inner_pretty.js:63137 | function |
| `zfn` | `stripBypassPermissionsAvailability` | cli_inner_pretty.js:529725 | function |

## Module: Permissions — auto mode onboarding and setup wizard

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aXa` | `shouldShowAutoModeEnvOnboarding` | cli_inner_pretty.js:736564 | function |
| `B4f` | `shouldRenderAutoModeEnvOnboarding` | cli_inner_pretty.js:736579 | function |
| `B7r` | `reportRepoVisibilityLookupFailure` | cli_inner_pretty.js:229626 | function |
| `F4f` | `ONBOARDING_INPUT_DEBOUNCE_MS` (`500`) | cli_inner_pretty.js:736681 | constant |
| `gAn` | `buildAutoModeConfigFromWizard` | cli_inner_pretty.js:659852 | function |
| `GIb` | `WIZARD_STEP_DEBOUNCE_MS` (`250`) | cli_inner_pretty.js:660172 | constant |
| `GxS` | `MIN_STARTUPS_BEFORE_ONBOARDING` (`5`) | cli_inner_pretty.js:736680 | constant |
| `hus` | `resolveUnknownRepoVisibility` | cli_inner_pretty.js:229609 | function |
| `Ipo` | `isRepoVisibilityLookupEnabled` | cli_inner_pretty.js:229601 | function |
| `jxS` | `ONBOARDING_SNOOZE_MS` (`604800000` = 7 days) | cli_inner_pretty.js:736679 | constant |
| `KxS` | `markAutoModeEnvSetupDismissed` | cli_inner_pretty.js:736561 | function |
| `Lpo` | `lookupRepoVisibilityCached` | cli_inner_pretty.js:229618 | function |
| `lXa` | `AutoModeEnvOnboardingPrompt` | cli_inner_pretty.js:736591 | function |
| `mDo` | `isAutoModeSetupSkillEnabled` | cli_inner_pretty.js:444855 | function |
| `qIb` | `AUTO_MODE_WIZARD_STEPS` (`posture`, `scope`, `depth`) | cli_inner_pretty.js:660223 | constant |
| `qJp` | `AUTO_MODE_WIZARD_DEPTH_QUESTION` | cli_inner_pretty.js:660213 | object |
| `qxS` | `markAutoModeEnvOnboardingShown` | cli_inner_pretty.js:736552 | function |
| `sPy` | `AUTO_MODE_SETUP_SKILL_IDS` (`new Set(["auto-mode-setup"])`) | cli_inner_pretty.js:326372 | constant |
| `Tey` | `fetchRepoVisibilityFromGitHub` | cli_inner_pretty.js:229629 | function |
| `VxS` | `clearAutoModeEnvSetupRecord` | cli_inner_pretty.js:736555 | function |
| `WxS` | `alreadyOptedIntoAuto` | cli_inner_pretty.js:736575 | function |
| `zxS` | `snoozeAutoModeEnvSetup` | cli_inner_pretty.js:736558 | function |

## Module: Permissions — classifier adjudication

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$i_` | `runClassifierRequestWithStall` | cli_inner_pretty.js:444339 | function |
| `Bi_` | `latchClassifierBetaDrop` (unreachable: `zJt` is null) | cli_inner_pretty.js:444413 | function |
| `DOd` | `callClassifierWithRetries` | cli_inner_pretty.js:444429 | function |
| `eDo` | `isClassifierQueueEnabled` | cli_inner_pretty.js:442623 | function |
| `Fi_` | `retryOptionsWithoutClassifierBeta` (always returns null in 220) | cli_inner_pretty.js:444409 | function |
| `gnn` | `isClassifierAdjudicating` | cli_inner_pretty.js:325872 | function |
| `HBs` | `sendClassifierRequest` | cli_inner_pretty.js:444401 | function |
| `J1_` | `isLocalDisplayOnlyClassifier` (vestigial `return !1`) | cli_inner_pretty.js:513162 | function |
| `kBs` | `parseSeverityVerdict` | cli_inner_pretty.js:443973 | function |
| `LBs` | `classifyClassifierParseFailure` | cli_inner_pretty.js:444456 | function |
| `nOd` | `resolveClassifierQueueSetting` | cli_inner_pretty.js:442626 | function |
| `oOd` | `runClassifierQueued` | cli_inner_pretty.js:442631 | function |
| `OOd` | `formatClassifierFailureReason` | cli_inner_pretty.js:444676 | function |
| `pcn` | `classifierPendingByKey` | cli_inner_pretty.js:442669 | variable |
| `Pi_` | `parseSeverityFromText` | cli_inner_pretty.js:443977 | function |
| `qi_` | `classifyClassifierErrorKind` | cli_inner_pretty.js:444707 | function |
| `Qqs` | `isClassifierAdjudicatingMode` | cli_inner_pretty.js:513122 | function |
| `RBs` | `parseBlockVerdict` | cli_inner_pretty.js:443965 | function |
| `ROd` | `classifierExtraBetas` | cli_inner_pretty.js:444392 | function |
| `SBs` | `serializeClassifierMetaLine` | cli_inner_pretty.js:442610 | function |
| `Sji` | `AUTO_MODE_CLASSIFIER_BETA` (`auto-mode-classifier-2026-07-16`) | cli_inner_pretty.js:109221 | constant |
| `tfn` | `preferCircuitBreakerReason` | cli_inner_pretty.js:513274 | function |
| `To_` | `classifierSerializerByKey` | cli_inner_pretty.js:442669 | variable |
| `uFt` | `reportClassifierOutcome` | cli_inner_pretty.js:444679 | function |
| `Xqs` | `denyBecausePromptsUnavailable` | cli_inner_pretty.js:513421 | function |
| `zJt` | `UNASSIGNED_BETA_SLOT` (declared `null`, never assigned) | cli_inner_pretty.js:109181 | variable |

## Module: Permissions — classifier git-status context

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Co_` | `isGitStatusContextEnabled` | cli_inner_pretty.js:442672 | function |
| `cOd` | `resolveGitStatusUploads` | cli_inner_pretty.js:442684 | function |
| `Do_` | `summarizeGitStatusPorcelain` | cli_inner_pretty.js:442703 | function |
| `Ho_` | `getGitStatusTruncationLimit` | cli_inner_pretty.js:442690 | function |
| `Lo_` | `matchDangerPatternTruncated` (`1e4` truncate-then-match) | cli_inner_pretty.js:442699 | function |
| `lOd` | `resolveGitStatusType` | cli_inner_pretty.js:442675 | function |
| `uOd` | `resolveGitStatusLimit` | cli_inner_pretty.js:442693 | function |
| `xo_` | `areGitStatusUploadsEnabled` | cli_inner_pretty.js:442681 | function |

## Module: Permissions — classifier rule taxonomy

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `HNy` | `EXTRA_RULE_IDS` (empty array) | cli_inner_pretty.js:345235 | constant |
| `kNy` | `CLASSIFIER_RULE_IDS` (66 ids) | cli_inner_pretty.js:345167 | constant |
| `l0o` | `KNOWN_RULE_IDS` (`Set([...kNy, ...HNy])`) | cli_inner_pretty.js:345236 | constant |
| `xNy` | `USER_RULE_REPLACEMENT_MARKERS` (4 `*_to_replace` sentinels) | cli_inner_pretty.js:345161 | constant |
| `Xon` | `canonicalizeClassifierCategory` | cli_inner_pretty.js:345238 | function |

## Module: Permissions — hooks bridge

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bft` | `evaluateRulesAndSafetyChecks` (called after a hook decision at `:400910`) | cli_inner_pretty.js:513506 | function |
| `gan` | `applyHookDecisionToPermissionPipeline` (sets `hookAskFloor` at `:400917`) | cli_inner_pretty.js:400894 | function |
| `t$_` | `resolvePermissionAfterAsk` (reads `hookAskFloor` at `:513734`) | cli_inner_pretty.js:513711 | function |

## Module: Permissions — modes and UI descriptors

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `BK` | `resolvePermissionMode` | cli_inner_pretty.js:58326 | function |
| `dWl` | `PERMISSION_MODE_DESCRIPTORS` (`default` → `title: "Manual"`) | cli_inner_pretty.js:58495 | object |
| `fL` | `normalizeManualModeAlias` | cli_inner_pretty.js:58323 | function |
| `pWl` | `permissionModeSchema` (`preprocess(fL, enum)`) | cli_inner_pretty.js:58492 | variable |
| `r3r` | `externalPermissionModeSchema` | cli_inner_pretty.js:58493 | variable |
| `Sht` | `isSuspiciousWindowsPath` | cli_inner_pretty.js:528296 | function |
| `uWl` | `PERMISSION_MODE_RANK` | cli_inner_pretty.js:58494 | constant |
| `X4r` | `PAUSE_GLYPH` (`"⏸"`) | cli_inner_pretty.js:58419 | constant |
| `ylt` | `checkWritePathSafety` | cli_inner_pretty.js:528312 | function |

## Module: Permissions — read-only command tables

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `cqy` | `READ_ONLY_EXACT_COMMANDS` | cli_inner_pretty.js:393272 | constant |
| `fqy` | `READ_ONLY_NULLARY_COMMANDS` (`pwd`, `whoami`, `alias`) | cli_inner_pretty.js:393287 | constant |
| `gqy` | `READ_ONLY_ARGV_SEQUENCES` | cli_inner_pretty.js:393290 | constant |
| `uqy` | `READ_ONLY_SUBCOMMAND_PREFIXES` | cli_inner_pretty.js:393273 | constant |
| `uuo` | `DOCKER_READ_ONLY_SUBCOMMANDS` (`docker logs`, `docker inspect`) | cli_inner_pretty.js:213946 | object |
| `Y0u` | `READ_ONLY_COMMAND_TABLE` (`rg`, `sort`, `man`, `help`, `file`, `netstat`, `ps`, …) | cli_inner_pretty.js:213966 | object |

## Module: Permissions — remote-control nudge (NOT an ordering fix)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `f5a` | `resolveRemoteControlPermissionNudgeConfig` | cli_inner_pretty.js:720478 | function |
| `Pni` | `RC_PERMISSION_NUDGE_DEFAULTS` (`{afterPromptCount:5, probability:0, maxImpressions:3}` — probability 0, so off by default) | cli_inner_pretty.js:720628 | constant |

## Module: Permissions — rule matching and glob semantics

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$fe` | `collectPathRules` | cli_inner_pretty.js:513346 | function |
| `B0` | `findMatchingPathRule` | cli_inner_pretty.js:528512 | function |
| `b2_` | `patternRootBase` | cli_inner_pretty.js:528366 | function |
| `Bfe` | `getAskRules` | cli_inner_pretty.js:513240 | function |
| `Cze` | `evaluateHookIfCondition` | cli_inner_pretty.js:528537 | function |
| `E2_` | `IGNORE_REUSE_BUDGET` (`1e4` tests before rebuild) | cli_inner_pretty.js:528889 | constant |
| `gap` | `sanitizePattern` (slash collapse + BOM/sigil escape) | cli_inner_pretty.js:528448 | function |
| `Gfn` | `resolvePatternRoot` | cli_inner_pretty.js:528453 | function |
| `hap` | `splitPatternRoot` | cli_inner_pretty.js:528426 | function |
| `mM` | `getDenyRules` | cli_inner_pretty.js:513237 | function |
| `N_r` | `flattenRules` | cli_inner_pretty.js:513228 | function |
| `nve` | `filterDeniedTools` (hoists `mM(t)` out of the filter) | cli_inner_pretty.js:425004 | function |
| `r9s` | `MATCHER_CACHE` (`WeakMap<rulesArray, Map<key, byRoot>>`) | cli_inner_pretty.js:529043 | variable |
| `s9s` | `buildPathRuleMatchers` (LRU 16, deny/ask only) | cli_inner_pretty.js:528463 | function |
| `sG` | `findSafetyCheckReason` | cli_inner_pretty.js:513689 | function |
| `v2t` | `posixRelative` | cli_inner_pretty.js:528077 | function |
| `WB` | `findMatchingDenyRule` (accepts a precomputed array) | cli_inner_pretty.js:513293 | function |
| `yap` | `normalizeDirGlobForIgnoreEngine` | cli_inner_pretty.js:528456 | function |

## Module: Permissions — rule matching cost

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Bfe` | `getAskRules` (export `getAskRuleForTool: () => PIe` at :513088) | cli_inner_pretty.js:513240 | function |
| `fg` | `parsePermissionRule` (`Tool(arg)` splitter) | cli_inner_pretty.js:60333 | function |
| `mM` | `getDenyRules` | cli_inner_pretty.js:513237 | function |
| `N_r` | `collectRulesFromSources` (parse + allocate per rule) | cli_inner_pretty.js:513228 | function |
| `nfn` | `PERMISSION_RULE_SOURCES` (10 sources; base five are `V$` at :57678) | cli_inner_pretty.js:514067 | constant |
| `ofn` | `matchesToolRule` | cli_inner_pretty.js:513243 | function |
| `SMi` | `matchToolNameGlob` (**still** builds a fresh `RegExp` per call — the un-taken optimisation) | cli_inner_pretty.js:60306 | function |
| `WB` | `getDenyRuleForTool` (gained the 3rd `precomputedDenyRules` param; export at :513085) | cli_inner_pretty.js:513293 | function |
| `wKe` | `isEndConversationTool` (the `.214` carve-out guarding `WB`) | cli_inner_pretty.js:513105 | function |

## Module: Permissions — settings scopes and rule storage

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_Ih` | `realHomeDir` (memoised; throws if unavailable) | cli_inner_pretty.js:62657 | function |
| `Ekh` | `makeCanonicalGitRootLookup` | cli_inner_pretty.js:55537 | function |
| `gIh` | `statRepoRootOwnership` | cli_inner_pretty.js:62647 | function |
| `gu` | `canonicalGitRootLookup` | cli_inner_pretty.js:56190 | variable |
| `hRu` | `probeIgnorePatternCompileError` | cli_inner_pretty.js:224126 | function |
| `qQg` | `reportUncompilablePattern` (memoised by `site\0pattern`) | cli_inner_pretty.js:224139 | function |
| `rZg` | `copyLocalSettingsIntoWorktree` | cli_inner_pretty.js:224974 | function |
| `UQ` | `settingsScopeRelativePath` | cli_inner_pretty.js:62361 | function |
| `w7t` | `legacyLocalSettingsPath` | cli_inner_pretty.js:62369 | function |
| `WQg` | `UNCOMPILABLE_PATTERN_SITES` (4 pre-redacted site names) | cli_inner_pretty.js:224133 | object |
| `y3r` | `settingsScopeDirectory` | cli_inner_pretty.js:62282 | function |
| `yIh` | `isRootOwnedByCurrentUser` (POSIX-only) | cli_inner_pretty.js:62311 | function |
| `YWe` | `resolveLocalSettingsDirectory` | cli_inner_pretty.js:62295 | function |

## Module: Permissions — the `.200` "Manual" display rename

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| BK | resolvePermissionMode | cli_inner_pretty.js:58326-58329 | function |
| dWl | permissionModeDisplayTable | cli_inner_pretty.js:58495-58544 | object |
| e1e | permissionModeSymbol | cli_inner_pretty.js:58481-58483 | function |
| fL | normalizePermissionModeAlias | cli_inner_pretty.js:58323-58325 | function |
| FO | permissionModeColor | cli_inner_pretty.js:58484-58486 | function |
| pWl | permissionModeEnumPreprocessed | cli_inner_pretty.js:58492 | variable |
| QOe | PERMISSION_MODE_MANUAL_ALIAS | cli_inner_pretty.js:58339 | constant |
| r3r | permissionModeEnumPreprocessedAlt | cli_inner_pretty.js:58493 | variable |
| uWl | PERMISSION_MODE_RANK | cli_inner_pretty.js:58494 | object |
| Yye | PERMISSION_MODES | cli_inner_pretty.js:58362 | constant |

## Module: Prompt commands — `/commit-push-pr` allowed tools

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Akh | SAFE_REMOTE_NAME_RE | cli_inner_pretty.js:56201 | constant |
| Cl_ | commitPushPrAllowedTools | cli_inner_pretty.js:449740-449742 | function |
| g5n | getGitPushShellPatterns | cli_inner_pretty.js:55590-55595 | function |
| J$d | toToolPatterns | cli_inner_pretty.js:449862 | function |
| K$d | buildCommitPushPrPrompt | cli_inner_pretty.js:449743-449860 | function |
| Tkh | resolveDefaultPushRemote | cli_inner_pretty.js:55575-55589 | function |
| Tl_ | COMMIT_PUSH_PR_EXTRA_TOOLS | cli_inner_pretty.js:449885 | constant |
| wkh | gitConfigGet | cli_inner_pretty.js:55569-55574 | function |
| X$d | COMMIT_PUSH_PR_BASE_PATTERNS | cli_inner_pretty.js:449876-449884 | constant |
| xl_ | commitPushPrCommandDescriptor | cli_inner_pretty.js:449887-449910 | object |
| z$d | COMMIT_PUSH_PR_STATIC_TOOLS | cli_inner_pretty.js:449886 | constant |

## Module: Provider Resolution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Zh` | `toLegacyModelConfig` — snake_case `provider_ids` → camelCase config; `gateway ?? first_party` | cli_inner_pretty.js:100171-100185 | function |
| `_bc` | `ALL_FIRST_PARTY_MODEL_IDS` | cli_inner_pretty.js:100265 | constant |
| `Cu_` | `findBedrockUpgradeCandidates` — skips env defaults the probe itself wrote via `Qfe` | cli_inner_pretty.js:455754-… | function |
| `d7n` | `reverseModelOverride` — id → override key using an explicit `overridesMap` | cli_inner_pretty.js:100206-100210 (decl 110206-110210) | function |
| `dj` | `hasFirstPartyCapabilities` — `firstParty \ | ClaudePlatform \ | foundry \ |
| `f_e` | `FIRST_PARTY_ID_TO_LEGACY_KEY` — reverse of `Ul` | cli_inner_pretty.js:100266 | constant |
| `FZh` | `providerSignsWithAwsCredentials` — exhaustive switch; `anthropicGoogleCloud` on the **false** side | cli_inner_pretty.js:100288-100301 | function |
| `Hn` | `getAPIProvider` — 8-way enum, `gateway` short-circuits first, `anthropicGoogleCloud` added in this window | cli_inner_pretty.js:100302-100317 | function |
| `Hot` | `reverseModelOverrideFromConfig` — same as `d7n` but reads `eo().modelOverrides` | cli_inner_pretty.js:100449-100460 | function |
| `i4i` | `OPUS_PREFERENCE_ORDER` — `["opus5","opus48","opus47","opus46","opus45"]` (193: no `opus5`) | cli_inner_pretty.js:100264 | constant |
| `iW` | `isClaudePlatformProvider` — `anthropicAws \ | anthropicGoogleCloud`; 220-only category | cli_inner_pretty.js:100346-100348 |
| `Km` | `getModelConfigsForCurrentProvider` — provider-projected `Ul` | cli_inner_pretty.js:100468-100472 | function |
| `mkt` | `getSecondaryProvider` — `bedrock + CLAUDE_CODE_USE_MANTLE → "mantle"` | cli_inner_pretty.js:100324-100327 | function |
| `ny` | `getProviderForModel` — per-model provider with the mantle/`anthropic.` fallback | cli_inner_pretty.js:100331-100342 | function |
| `NZh` | `buildLegacyModelConfigs` — derives `Ul` from the catalogue; throws `"model catalog missing entry for CATALOG_ID_TO_KEY id"` | cli_inner_pretty.js:100186-100198 | function |
| `OZh` | `CATALOG_ID_TO_KEY` — 16 rows; `"claude-opus-5": "opus5"` at :100233; **no `claude-mythos-5` row** | cli_inner_pretty.js:100218-100235 | constant |
| `pGr` | `projectConfigsForProvider` — provider column of `Ul` with 3P fallback | cli_inner_pretty.js:100405-100414 | function |
| `pJt` | `THIRD_PARTY_PROVIDER_ENV_VARS` — 220-only; `anthropicGoogleCloud → CLAUDE_CODE_USE_ANTHROPIC_GOOGLE_CLOUD` | cli_inner_pretty.js:100393-100400 | object |
| `Qfe` | `envDefaultWasWrittenByProbe` — compares `ANTHROPIC_DEFAULT_*_MODEL` against `CLAUDE_CODE_3P_PROBE_WROTE_*_DEFAULT` (220=6/193=0) | cli_inner_pretty.js:455727-455731 | function |
| `QK` | `assertNamedConfigHasAll3P` — throws `"named model config export has null 3P provider id"` | cli_inner_pretty.js:100199-100207 | function |
| `qlp` | `isGoogleCredentialAuthError` — Vertex-equivalent 401 handling for Claude Platform on Google Cloud | cli_inner_pretty.js:534892-534899 | function |
| `QQ` | `legacyConfigForProviderId` — linear scan over `Ul` | cli_inner_pretty.js:100208-100213 | function |
| `rm` | `usesFirstPartyModelIds` — `firstParty \ | ClaudePlatform \ | gateway` |
| `run` | `recordProbeWrittenEnvDefault` — sets `CLAUDE_CODE_3P_PROBE_WROTE_{SONNET,OPUS}_DEFAULT` | cli_inner_pretty.js:455721-455724 | function |
| `s4i` | `LEGACY_MODEL_KEYS` — `Object.keys(Ul)` | cli_inner_pretty.js:100465 | constant |
| `Ul` | `MODEL_CONFIGS` — derived camelCase table (193's `Kc`) | cli_inner_pretty.js:100236 | constant |
| `ybc` | `MYTHOS5_LEGACY_CONFIG` — hand-written, all 8 provider ids populated; **contradicts** the catalogue's all-null entry | cli_inner_pretty.js:100253-100263 | object |
| `Yig` | `PROVIDER_KEY_TO_CATALOG_KEY` — camelCase → snake_case bridge for alias lookup | cli_inner_pretty.js:111373-111382 | object |
| `ZK` | `THIRD_PARTY_PROVIDER_LABELS` — 7 rows; `"Claude Platform on Google Cloud"` at :100389 | cli_inner_pretty.js:100384-100392 | object |

## Module: Remote Control — Enablement, provider gating, blockers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bk` | `isBridgeEnabled` | cli_inner_pretty.js:535467-535471 | function |
| `C7r` | `getBridgeEntitlementBlocker` (`not_signed_in` / `api_key_auth` / `no_profile_scope` / `not_in_rollout`) | cli_inner_pretty.js:535454-535460 | function |
| `cmn` | `getRemoteControlPolicyVerdict` (`allow_remote_control` → allowed/denied/unavailable) | cli_inner_pretty.js:535726-535732 | function |
| `dGr` | `isActualFirstPartyAnthropicBaseUrl` | cli_inner_pretty.js:100362-100366 | function |
| `DNt` | `isCcrV2SessionCrudEnabled` (220-only export) | cli_inner_pretty.js:535428 | function |
| `DVe` | `isBridgeFirstParty` (**the `.196` fix**) | cli_inner_pretty.js:535447-535450 | function |
| `dzs` | `isPolicyLimitsCacheLoaded` | cli_inner_pretty.js:535733-535736 | function |
| `ecp` | `UNSET_IT_HINT` (singular remediation suffix) | cli_inner_pretty.js:535811 | constant |
| `gbr` | `isClaudeAiSubscriber` | cli_inner_pretty.js:535682-535688 | function |
| `H4_` | `buildRemoteControlProviderBlocker` (**the `.219` five-way branch**) | cli_inner_pretty.js:535656-535673 | function |
| `hkt` | `shouldPropagateTraceparent` (a `Yd` consumer, for contrast with `DVe`) | cli_inner_pretty.js:100375-100377 | function |
| `I4_` | `_resetDiagnosticPolicyKickForTesting` | cli_inner_pretty.js:535703-535705 | function |
| `KUo` | `hasProfileScope` | cli_inner_pretty.js:535689-535695 | function |
| `mbr` | `RC_FIRST_PARTY_ONLY` (`"Remote Control is only available when using Claude via api.anthropic.com."`) | cli_inner_pretty.js:535810 | constant |
| `ncp` | `kickPolicyLimitsLoad` (cold-await with timeout) | cli_inner_pretty.js:535706-535725 | function |
| `NDt` | `hasBridgeEntitlement` (`DVe() && gbr() && Ke("tengu_ccr_bridge", !1)`) | cli_inner_pretty.js:535451-535453 | function |
| `pJt` | `THIRD_PARTY_PROVIDER_ENV_VARS` (6 entries) | cli_inner_pretty.js:100393-100400 | object |
| `Qdo` | `describeAuthPrecedenceBlocker` (carryover auth-half precedent) | cli_inner_pretty.js:535639-535655 | function |
| `qUo` | `isRemoteControlForceEnabled` (hard override, always `!1`) | cli_inner_pretty.js:535461-535463 | function |
| `S1e` | `hostIsFirstParty` (`["api.anthropic.com"].includes(host)`) | cli_inner_pretty.js:100367-100373 | function |
| `T4_` | `getBridgeAuthDebugInfo` (`/doctor` auth-state dump) | cli_inner_pretty.js:535519 | function |
| `tcp` | `UNSET_THEM_HINT` (plural remediation suffix) | cli_inner_pretty.js:535812 | constant |
| `uzs` | `getOAuthAccount` | cli_inner_pretty.js:535696-535702 | function |
| `VUo` | `getBridgeDisabledReason` (13-rung eligibility ladder) | cli_inner_pretty.js:535477-535518 | function |
| `YBt` | `isRemoteControlHardDisabled` (managed `disableRemoteControl`) | cli_inner_pretty.js:535464-535466 | function |
| `Yd` | `assumeOrCheckFirstPartyBaseUrl` (honours `_CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL`) | cli_inner_pretty.js:100358-100361 | function |
| `ZK` | `PROVIDER_DISPLAY_NAMES` (7 entries incl. `anthropicGoogleCloud`) | cli_inner_pretty.js:100384-100392 | object |
| `zUo` | `hasClaudeAiInferenceScope` | cli_inner_pretty.js:535675-535681 | function |

## Module: Sandbox — UI and facade

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `cKr` | `SandboxViolationStore` | cli_inner_pretty.js:195128 | class |
| `Dco` | `resolvePathPatternForSandbox` | cli_inner_pretty.js:204659-204661 | function |
| `jTu` | `resolveSandboxFilesystemPathAt` | cli_inner_pretty.js:204662-204665 | function |
| `NPf` | `handleSandboxInstallCommand` — `/sandbox install`; `sandbox_windows_install` outcomes | cli_inner_pretty.js:724557-… | function |
| `Oo` | `SandboxManager` — the facade; named in the `Ess` export table (:204615-204642) at :204637 | cli_inner_pretty.js:204637 | object |
| `UTu` | `resolvePathPatternForSandboxAt` | cli_inner_pretty.js:204654-204658 | function |

## Module: Sandbox — Windows (srt-win) backend

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aNe` | `getWindowsSandboxUserStatus` — `srt-win user status` → provisioning report | cli_inner_pretty.js:194881-194897 | function |
| `aSu` | `getWindowsSandboxCaCert` — `{pem, thumb}` from the status report | cli_inner_pretty.js:194898-194902 | function |
| `bnr` | `runSrtWin` — spawn helper (text) | cli_inner_pretty.js:194791-194800 | function |
| `cSu` | `grantWindowsSandboxAcls` — `acl grant --holder-pid --sandbox-user-sid`, paths on stdin | cli_inner_pretty.js:194975-194985 | function |
| `CWg` | `buildWindowsFileAclPlan` — all four lists empty when `disabled` (:195469) | cli_inner_pretty.js:195467-195474 | function |
| `F8e` | `resolveSrtWinPath` — explicit `windows.srtWin.path` or the packaged binary | cli_inner_pretty.js:194781-194790 | function |
| `glo` | `installWindowsSandbox` — `srt-win install`; exit taxonomy 0/10/12/13/14 | cli_inner_pretty.js:194903-194930 | function |
| `gos` | `restoreWindowsSandboxDenies` — `acl restore --json`; returns `paths` ∪ `parents` | cli_inner_pretty.js:194958-194974 | function |
| `hos` | `resolveExistingPathsForAcl` — **drops non-existent paths** (:194937) | cli_inner_pretty.js:194931-194942 | function |
| `hSu` | `wfpEgressVerifiedOnce` — declared `!1`; the once-per-process latch is at :195300-195307 | cli_inner_pretty.js:195873 | variable |
| `iSu` | `runSrtWinJsonLenient` — spawn helper returning `{ok, json, stderr}` | cli_inner_pretty.js:194810-194819 | function |
| `kWg` | `windowsFileAccessSetUnchanged` | cli_inner_pretty.js:195500-195502 | function |
| `LLt` | `getWindowsWfpStatus` — `wfp status`; can report `state: "cannot-read"` | cli_inner_pretty.js:194820-194831 | function |
| `lSu` | `stampWindowsSandboxDenyAcls` — `acl stamp`; exit 2 = partial (:194954) | cli_inner_pretty.js:194943-194957 | function |
| `mWg` | `buildWindowsGitConfigEnv` — `GIT_CONFIG_KEY_n` incl. `safe.directory` and schannel CA | cli_inner_pretty.js:195000-195024 | function |
| `oSu` | `runSrtWinJson` — spawn helper that parses stdout as JSON or throws | cli_inner_pretty.js:194801-194809 | function |
| `Slo` | `appliedWindowsFileAccessSet` — written once at :195341 | cli_inner_pretty.js:195341 | variable |
| `sSu` | `verifyWindowsWfpEgress` — empirical egress probe; exit 3 = fence inactive | cli_inner_pretty.js:194832-194880 | function |
| `uKr` | `sameStringSet` — order-insensitive comparison | cli_inner_pretty.js:195485-195489 | function |
| `uSu` | `buildWindowsSandboxArgv` — `CreateProcessW` budget `> 30000` at :195044 | cli_inner_pretty.js:195025-195050 | function |
| `wSu` | `snapshotWindowsFileAccessSet` — **the one new `filesystem.disabled` site** (:195477) | cli_inner_pretty.js:195475-195484 | function |
| `Xat` | `appliedSandboxUserSid` — recorded at :195332, used by the rollback at :195343 | cli_inner_pretty.js:195332 | variable |
| `xWg` | `fileAccessSetsEqual` | cli_inner_pretty.js:195490-195499 | function |
| `yos` | `revokeWindowsSandboxGrants` — `acl revoke --json` | cli_inner_pretty.js:194986-194999 | function |

## Module: Sandbox — command exclusion and policy gates

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$co` | `SandboxUnavailableForShellError` | cli_inner_pretty.js:205691-205696 | class |
| `crp` | `matchesCommandPattern` — `prefix` / `exact` / `wildcard` | cli_inner_pretty.js:512808-512817 | function |
| `dss` | `SandboxBridgeUnavailableError` | cli_inner_pretty.js:205685-205690 | class |
| `H4` | `shouldRunUnderSandbox` — `I1_` short-circuit at :512824 is the `.214` bypass surface | cli_inner_pretty.js:512818-512826 | function |
| `I1_` | `matchesAnyStatementExclusion` — permissive: splits statements, reads merged settings | cli_inner_pretty.js:512771-512801 | function |
| `Nco` | `SandboxPolicyRefusalError` | cli_inner_pretty.js:205703-205708 | class |
| `nDd` | `matchesTrustedWholeCommandExclusion` — trusted scopes only, no metacharacters, whole command | cli_inner_pretty.js:512802-512807 | function |
| `Pco` | `SandboxInitFailedError` | cli_inner_pretty.js:205679-205684 | class |
| `pss` | `SandboxCommandTooLongError` | cli_inner_pretty.js:205697-205702 | class |
| `QLd` | `POWERSHELL_POLICY_REFUSAL_MESSAGE` — rewritten in `.214`; names the compound-command rule | cli_inner_pretty.js:430929-430930 | constant |
| `R1_` | `SHELL_METACHARS` = `/[;\ | &\`$(){}<>#\n\r]/` | cli_inner_pretty.js:512840 |
| `WRo` | `powerShellCommandWillBeSandboxed` — `H4` with `shellType: "powershell"` (220=2 / 193=0) | cli_inner_pretty.js:430760-430762 | function |
| `ZLd` | `shouldRefusePowerShellUnderMandatorySandbox` — the `.214` gate; called at :431116 and :431194 | cli_inner_pretty.js:430750-430759 | function |

## Module: Sandbox — credential masking runtime

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_bu` | `buildMaskedEnvSubstitutions` — `decode: "jwt"`, `maskClaims`; **fails open** with a loud warning | cli_inner_pretty.js:193395-193454 | function |
| `Alo` | `denyModeCredentialPaths` — the `deny` file paths that become `denyRead` | cli_inner_pretty.js:195422-195425 | function |
| `DLt` | `sentinelRegistry` — the `Jns` instance | cli_inner_pretty.js:195903 | variable |
| `Elo` | `maskedFileStore` — backing store for masked file binds | cli_inner_pretty.js:195904 | variable |
| `hbu` | `buildMaskedFileBinds` — three `[credential-mask]` skip paths; **fails closed** via `degradeToDenyPaths` | cli_inner_pretty.js:193292-193384 | function |
| `Jns` | `SentinelRegistry` — `register` / `registerWithSentinel` / `bySentinel` | cli_inner_pretty.js:192887-… | class |
| `NVg` | `maskCredentialWarningWrapper` | cli_inner_pretty.js:205402-205412 | function |
| `Sos` | `collectCredentialProtections` → `{denyReadPaths, unsetEnvVars, setEnvVars, maskedFileBinds, maskedFileStoreDir}` | cli_inner_pretty.js:195404-195421 | function |
| `XTu` | `maskCredentialWarningGate` | cli_inner_pretty.js:205413-205416 | function |
| `YTu` | `getMaskCredentialWarning` — mask-without-TLS warning (220=1 / 193=0) | cli_inner_pretty.js:205392-205401 | function |

## Module: Sandbox — deny-path containment and post-command scrubs

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bss` | `refreshSandboxConfigFromSettings` | cli_inner_pretty.js:205566-205571 | function |
| `DVg` | `reconcileLateSymlinkedDenyPaths` — `.210`'s fix; runs per command from :205487 | cli_inner_pretty.js:205249-205281 | function |
| `e0u` | `initializeSandbox` — `kE.initialize` :205549, settings watcher :205550-205554 | cli_inner_pretty.js:205534-205565 | function |
| `GTu` | `stagingDirCandidates` | cli_inner_pretty.js:204777-204783 | function |
| `hss` | `addSandboxAllowWriteDirectory` | cli_inner_pretty.js:205219 | function |
| `IVg` | `resolveDenyPathKeepingBoth` — returns `[resolved, literal]` | cli_inner_pretty.js:204750-204773 | function |
| `Lco` | `parentIsNotSymlink` — `O_DIRECTORY\ | O_NOFOLLOW`, `ELOOP`/`ENOTDIR` → skip | cli_inner_pretty.js:204787-204799 |
| `lk` | `resolveDenyPathThroughSymlink` — 8-hop dangling fallback; populates `llt`/`XKr` | cli_inner_pretty.js:204726-204749 | function |
| `llt` | `nonSymlinkDenyPaths` — the input to `.210`'s reconcile pass | cli_inner_pretty.js:205711 | variable |
| `lss` | `createStagingDir` (`mode: 448` = `0o700`) | cli_inner_pretty.js:204784-204786 | function |
| `LVg` | `scrubReplacedSymlinkedDenyPaths` (carryover, 1/1) | cli_inner_pretty.js:205231-205248 | function |
| `mss` | `ensureAtomicWriteStagingDirs` — `O_NOFOLLOW` + `(dev, ino)` identity record | cli_inner_pretty.js:204800-204846 | function |
| `QTu` | `ensureSandboxInitialized` — `(mss(), DVg())` at :205487 | cli_inner_pretty.js:205471-205489 | function |
| `qVg` | `teardownSandboxSettingsWatcher` | cli_inner_pretty.js:205572-… | function |
| `RVg` | `scrubPlantedBareRepoFiles` — recursion guard `t !== "HEAD" && t !== ".git"` (carryover) | cli_inner_pretty.js:205223-205230 | function |
| `s3l` | `recordStagingDirIdentity` — stores `(dev, ino, fd)` | cli_inner_pretty.js:51904-51912 | function |
| `To` | `dedupe` (`[...new Set(e)]`) | cli_inner_pretty.js:24553-24555 | function |
| `Vnr` | `absentDenyPaths` — populated when `lstat` threw at collection time | cli_inner_pretty.js:205711 | variable |
| `WTu` | `detectWorktreeGitCommonDir` | cli_inner_pretty.js:205282 | function |
| `XKr` | `symlinkedDenyPaths` — `{literal, resolved}` records | cli_inner_pretty.js:205711 | variable |

## Module: Sandbox — exec wrapping and error translation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `fHy` | `WORKTREES_PATH_SEGMENT` (`/worktrees/`) | cli_inner_pretty.js:313244 | constant |
| `hHy` | `isWorktreeMetadataPath` | cli_inner_pretty.js:313208-313210 | function |
| `jVg` | `translateWindowsArgvTooLong` — emits `windows_argv_too_long`; the `10,000 characters` decoy at :205495 | cli_inner_pretty.js:205490-205499 | function |
| `mHy` | `WORKTREE_METADATA_SUFFIXES` (`/config.worktree`, `.lock`, `/commondir`) | cli_inner_pretty.js:313245 | constant |
| `Ned` | `buildE2BIGDiagnostic` — measures argv and env separately, attributes deny paths to worktrees | cli_inner_pretty.js:313211-313239 | function |
| `pl` | `formatBytes` | cli_inner_pretty.js:33132-33139 | function |
| `pr` | `countWhere` | cli_inner_pretty.js:24548-24552 | function |
| `Sss` | `addToExcludedCommands` | cli_inner_pretty.js:205590 | function |
| `WVg` | `buildSandboxArgvAndEnv` — unconditional `unsetEnv` for `deny` vars at :205531 | cli_inner_pretty.js:205517-205533 | function |
| `ZTu` | `translateLinuxBridgeDeath` (carryover, 3/3) | cli_inner_pretty.js:205500-205507 | function |

## Module: Sandbox — filesystem plan and Linux (bubblewrap) backend

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ASu` | `mergeDenyReadPaths` | cli_inner_pretty.js:195426-195428 | function |
| `AWg` | `isSandboxRuntimeInitialized` (`Hl !== undefined`) | cli_inner_pretty.js:195379-195381 | function |
| `Hbu` | `firstSymlinkAncestorInAllowedRoots` — the anti-replacement primitive | cli_inner_pretty.js:193595-193611 | function |
| `Hl` | `sandboxRuntimeConfig` — the installed runtime config; cleared on any init failure | cli_inner_pretty.js:195858 | variable |
| `ilo` | `containsSimpleGlobMetachar` (`* ?` only — the Windows variant) | cli_inner_pretty.js:193000-193002 | function |
| `j5g` | `isGlobPatternForPlatform` — `ilo` on Windows, `OW` elsewhere | cli_inner_pretty.js:193003-193005 | function |
| `J5g` | `MAX_SYMLINK_HOPS` = `40` (matches Linux `MAXSYMLINKS`) | cli_inner_pretty.js:194136 | constant |
| `kH` | `getSandboxPlatform` — constant-folded to `"linux"` in this build | cli_inner_pretty.js:192732-192742 | function |
| `LSu` | `buildSandboxArgv` — skips the FS block when `filesystem.disabled` (:195572) | cli_inner_pretty.js:195570-… | function |
| `NWg` | `updateSandboxConfig` — Windows ACL-stamp warning at :195716-195721 | cli_inner_pretty.js:195714-195727 | function |
| `OW` | `containsGlobMetachar` (`* ? [ ]`) | cli_inner_pretty.js:192997-192999 | function |
| `oWg` | `buildBwrapArgv` — new deny-loop steps at :193916-193925 | cli_inner_pretty.js:193881-193961 | function |
| `Q5g` | `resolveDenyPathThroughSymlinks` — bounded partial realpath; `null` = fail closed (220-only) | cli_inner_pretty.js:193612-193638 | function |
| `RLt` | `expandGlobToPaths` | cli_inner_pretty.js:193170 | function |
| `TWg` | `getSandboxFsWriteConfig` — `{allowOnly:["/"]}` early-out at :195452 | cli_inner_pretty.js:195450-195466 | function |
| `ubu` | `stripWindowsExtendedPathPrefix` (`\\?\`, `\\?\UNC\`) | cli_inner_pretty.js:193006-193010 | function |
| `vSu` | `checkSandboxDependencies` — per-platform error/warning collection | cli_inner_pretty.js:195382-195403 | function |
| `vWg` | `initializeSandboxRuntime` — Windows provisioning/CA/ACL sequence at :195289-195346 | cli_inner_pretty.js:195267-195373 | function |
| `wWg` | `getSandboxFsReadConfig` — `{denyOnly:[]}` early-out at :195430 | cli_inner_pretty.js:195429-195449 | function |
| `WWg` | `getLinuxGlobPatternWarnings` — **not** the seccomp gate (scoping-file correction) | cli_inner_pretty.js:195844-195853 | function |
| `xie` | `stripTrailingGlobstar` | cli_inner_pretty.js:193011-193013 | function |
| `Z5g` | `hasFileAncestor` | cli_inner_pretty.js:193639-193654 | function |
| `ZU` | `normalizeSandboxPath` | cli_inner_pretty.js:193048 | function |

## Module: Sandbox — network policy and host classification

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_Wg` | `makeBodySubstitutionProvider` | cli_inner_pretty.js:195215-195218 | function |
| `eKr` | `isWellFormedHost` | cli_inner_pretty.js:192040 | function |
| `EWg` | `startSandboxProxies` — plaintext mutators gated at :195252 / :195254 | cli_inner_pretty.js:195242-195258 | function |
| `fss` | `isDomainAllowedForMask` — `injectHosts` reachability; refusal at :204719 | cli_inner_pretty.js:204711-204721 | function |
| `FTu` | `collectSandboxDomains` — merges `sandbox.network.*Domains` with `WebFetch(domain:…)` rules | cli_inner_pretty.js:204699-204710 | function |
| `gSu` | `shouldAllowNetworkConnection` — `strictAllowlist` enforcement at :195200 | cli_inner_pretty.js:195194-195208 | function |
| `HVg` | `addSessionAllowedHost` — session-only grant; consumed at :204868 | cli_inner_pretty.js:204722-204725 | function |
| `Kat` | `matchesDomainPattern` — wildcard host matcher | cli_inner_pretty.js:195171-195180 | function |
| `LMr` | `conversationWatermark` — `{ messageCount, lastMessageUuid }` | cli_inner_pretty.js:809572-809577 | function |
| `Mco` | `sessionAllowedHosts` | cli_inner_pretty.js:205710 | variable |
| `nVe` | `isManagedDomainsOnly` | cli_inner_pretty.js:204696-204698 | function |
| `o8t` | `SandboxHostVerdictCache` (`getOrClassify`, 220=4 / 193=0) | cli_inner_pretty.js:809578-809611 | class |
| `Phr` | `classifySandboxNetworkHost` — fail-closed on `unavailable` :444747 (carryover) | cli_inner_pretty.js:444741-444750 | function |
| `rke` | `unbracketIpv6Literal` | cli_inner_pretty.js:192028-192030 | function |
| `SWg` | `shouldTerminateTLSForHost` — `tlsTerminate.excludeDomains` | cli_inner_pretty.js:195225-195241 | function |
| `u7t` | `permissionModeToNetworkDisposition` — `auto→classify`, `dontAsk→deny`, else `ask` | cli_inner_pretty.js:58472-58477 | function |
| `Vns` | `canonicalizeHostForMatching` — unbracket IPv6, WHATWG-normalise via `new URL`, drop trailing dot; `undefined` on parse failure | cli_inner_pretty.js:192047-192056 | function |
| `yWg` | `makeHeaderMutator` | cli_inner_pretty.js:195209-195214 | function |

## Module: Sandbox — settings resolution and trusted scopes

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_ss` | `isSupportedPlatform` | cli_inner_pretty.js:205342 | function |
| `Bco` | `isSandboxingEnabled` | cli_inner_pretty.js:205357 | function |
| `Bxe` | `isHostedAgentRunner` — paired with `GP()` for the scrubbed cloud-runner mode | cli_inner_pretty.js:166698 | function |
| `clt` | `getSandboxGrowthbookConfig` (memoised, `filesystemPolicy`) | cli_inner_pretty.js:205709 | variable |
| `dlt` | `isSandboxEnabledInSettings` | cli_inner_pretty.js:205316 | function |
| `EIh` | `filterParentManagedSettingsRestrictiveOnly` — sandbox branch :62405-62434; new lines :62415 / :62422 / :62430 | cli_inner_pretty.js:62382-62436 | function |
| `GP` | `isSubprocessEnvScrubMode` (`CLAUDE_CODE_SUBPROCESS_ENV_SCRUB`) | cli_inner_pretty.js:166682-166685 | function |
| `GQ` | `getManagedSettingsTiers` | cli_inner_pretty.js:63159-63161 | function |
| `IMi` | `loadManagedSettingsTiers` — 3 admin tiers + parent slice :62481, clamps :62472-62479 | cli_inner_pretty.js:62455-62484 | function |
| `JTu` | `areSandboxSettingsLockedByPolicy` — does **not** consider `filesystem.disabled` / `strictAllowlist` | cli_inner_pretty.js:205437-205449 | function |
| `kco` | `SANDBOX_USER_NAME` = `"ClaudeCodeSandbox"` (220=1 / 193=0) | cli_inner_pretty.js:204092 | constant |
| `KTu` | `passesCheapSandboxGates` | cli_inner_pretty.js:205363 | function |
| `kVg` | `anySourceForcesSandboxEnabled` — resolves the gate's `relaxedIfForced` | cli_inner_pretty.js:204687-204695 | function |
| `MVg` | `areUnsandboxedCommandsAllowed` | cli_inner_pretty.js:205331 | function |
| `OVg` | `areUnsandboxedCommandsForbiddenByPolicy` | cli_inner_pretty.js:205335 | function |
| `pg` | `isSettingsSourceActive` (`wT().includes(source)`) | cli_inner_pretty.js:57672-57674 | function |
| `PVg` | `isAutoAllowBashIfSandboxedEnabled` — `?? !0`, independent of `filesystem.disabled` | cli_inner_pretty.js:205327-205330 | function |
| `QLt` | `resolveSettingsRelativePath` — resolves a credential path against its settings-file root | cli_inner_pretty.js:204666-204668 | function |
| `SIh` | `parentTierMergesUnderAdmin` (`parentSettingsBehavior === "merge"`) | cli_inner_pretty.js:62379-62381 | function |
| `ult` | `getEffectiveFilesystemPolicy` — `"strict"\ | "relaxed"`; Windows veto :204680, settings edge :204681 | cli_inner_pretty.js:204678-204686 |
| `V$` | `SETTINGS_SOURCES` — `["userSettings","projectSettings","localSettings","flagSettings","policySettings"]` | cli_inner_pretty.js:57678 | constant |
| `vIh` | `resolveManagedSettingsTier` | cli_inner_pretty.js:62485 | function |
| `VTu` | `isAutoAllowSupported` | cli_inner_pretty.js:205324 | function |
| `xVg` | `resolveFilesystemDisabledSetting` — managed-first, managed pin :204673, then trusted scopes | cli_inner_pretty.js:204669-204677 | function |
| `YLt` | `getTrustedSettingsSources` — managed ∪ `flagSettings` ∪ active `userSettings`; 5 call sites | cli_inner_pretty.js:204062-204064 | function |
| `yss` | `isSandboxRequired` | cli_inner_pretty.js:205338 | function |
| `ZKr` | `isPlatformInEnabledList` | cli_inner_pretty.js:205346 | function |
| `znr` | `buildEffectiveSandboxConfig` — `strictAllowlist` OR-agg :205177, FS spread :205200, creds :205150-205168 | cli_inner_pretty.js:204847-205218 | function |

## Module: Sandbox — settings schemas

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `B0h` | `sandboxCredentialsSchema` (`files`, `envVars`, `allowPlaintextInject`) | cli_inner_pretty.js:49780-49804 | object |
| `F0h` | `sandboxFilesystemSchema` (incl. `disabled` at :49729) | cli_inner_pretty.js:49698-49743 | object |
| `JUr` | `sandboxSettingsSchema` (root `sandbox` object) | cli_inner_pretty.js:49805-49865 | object |
| `LLi` | `credentialEnvVarSchema` — `mode: v.enum(["deny","mask"])` :49765, `injectHosts` :49770 | cli_inner_pretty.js:49755-49778 | object |
| `N0h` | `sandboxNetworkSchema` — `strictAllowlist` field at :49648-49656 | cli_inner_pretty.js:49638-49696 | object |
| `RLi` | `credentialFileSchema` — still `mode: v.literal("deny")` at :49752 | cli_inner_pretty.js:49744-49754 | object |

## Module: Sandbox — worktree path containment (shared with `53_subagent_limits`)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aed` | `isDeviceNamespacePath` — normalises `/./` and `//` before testing | cli_inner_pretty.js:312556-312559 | function |
| `aTs` | `GIT_TREE_REDIRECT_ENV_VARS` (6 names incl. `GIT_WORK_TREE` at :312758) | cli_inner_pretty.js:312756-312763 | constant |
| `cas` | `isPathWritableUnderSandbox` — in-process write gate; unaffected by `filesystem.disabled` | cli_inner_pretty.js:214068-214078 | function |
| `Dky` | `GIT_TREE_REDIRECT_FLAGS` (`--git-dir`, `--work-tree`) | cli_inner_pretty.js:312765 | constant |
| `fBe` | `isUnresolvablePath` (`canonical === null && !skipped`) | cli_inner_pretty.js:307773 | function |
| `ied` | `worktreeCwdEscapeRefusal` — `network-shaped` :312391, unresolvable :312389 | cli_inner_pretty.js:312384-312396 | function |
| `led` | `isUnsafePathShape` — firmlinks, `/Volumes`, cygwin, `//server/share`, `~` | cli_inner_pretty.js:312560-312568 | function |
| `Lky` | `GIT_VALUE_FLAGS` (`--namespace`, `--attr-source`, `--shallow-file`) | cli_inner_pretty.js:312764 | constant |
| `lTs` | `GIT_BINARY_NAME_RE` | cli_inner_pretty.js:312777 | constant |
| `Mky` | `DEV_FD_PATH_RE` (`/dev/(fd\ | stdin\ | stdout\ |
| `Pky` | `PROC_SELF_PATH_RE` (`/proc/(self\ | thread-self\ | \d+)/`) |
| `rMd` | `buildSandboxPromptSection` — model-facing sandbox description | cli_inner_pretty.js:437150-437220 | function |
| `sed` | `classifyCwdVsWorktree` | cli_inner_pretty.js:312400-312408 | function |
| `Uky` | `isGitRedirectEnvVar` — also `GIT_CONFIG*`, `HOME`, `CDPATH`, `XDG_CONFIG_HOME` | cli_inner_pretty.js:312569-312572 | function |
| `Yky` | `isGitRedirectConfigKey` (`core.worktree`, `core.bare`, `include.*`, `includeif.*`) | cli_inner_pretty.js:312738-312740 | function |

## Module: Settings / Env Plumbing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `n7t` | isSettingsEnvVarAllowed | cli_inner_pretty.js:57846-57849 | function |
| `nHh` | SETTINGS_ENV_ALLOWLIST (contains the two session caps at `:58164`, `:58166`) | cli_inner_pretty.js:57993-58175 | constant |
| `oHh` | SETTINGS_ENV_OPT_OUT_ONLY (telemetry kill switches) | cli_inner_pretty.js:58176-58181 | constant |

## Module: Settings — bounded loading

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `fa_` | `MAX_AUTO_MODE_SECTION_BYTES` (`Xye / 4`) | cli_inner_pretty.js:447658 | constant |
| `MWe` | `isNotRegularFileError` | cli_inner_pretty.js:50020 | function |
| `Wwm` | `loadSettingsFromFlag` (the `--settings` handler; error text at :833488) | cli_inner_pretty.js:833468 | function |
| `Xye` | `MAX_SETTINGS_FILE_BYTES` (`2097152`; 7 call sites) | cli_inner_pretty.js:62620 | constant |

## Module: Settings/config plumbing touched by this theme

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $4_ | isGlobalConfigKey | cli_inner_pretty.js:535945-535947 | function |
| _Qo | isInvisibleAttachment | cli_inner_pretty.js:687119-687124 | function |
| ANn | setLoadedSettings | cli_inner_pretty.js:1864-1866 | function |
| icp | PROJECT_CONFIG_KEYS | cli_inner_pretty.js:537154 | constant |
| oUs | buildHeadlessConfigRowInputs | cli_inner_pretty.js:452347-452386 | function |
| SI | getLoadedSettings | cli_inner_pretty.js:1861-1863 | function |
| t4o | GLOBAL_CONFIG_KEYS | cli_inner_pretty.js:537104-537153 | constant |
| xt | getConfig | cli_inner_pretty.js:536338-536343 | function |

## Module: Telemetry - Cloud gateway metering and managed settings

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `BMm` | `priceUsageCents` | cli_inner_pretty.js:862658-862663 | function |
| `cyE` | `isCatchAllPolicyMatch` | cli_inner_pretty.js:860947-860949 | function |
| `dyE` | `mergePolicyCliSettings` | cli_inner_pretty.js:860969-860978 | function |
| `e_E` | `newSseUsageAccumulator` | cli_inner_pretty.js:862760-862762 | function |
| `fMm` | `stripUndefinedKeys` | cli_inner_pretty.js:860987-860990 | function |
| `GMm` | `addContentBlockDeltaChars` | cli_inner_pretty.js:862803-862806 | function |
| `H7y` | `remapBlockedPostTurnSummary` | cli_inner_pretty.js:416204-416208 | function |
| `hyE` | `buildManagedTelemetryEnv` | cli_inner_pretty.js:861003-861023 | function |
| `J1n` | `isPlainObject` | cli_inner_pretty.js:860944-860946 | function |
| `jMm` | `consumeSseUsageFrame` | cli_inner_pretty.js:862763-862802 | function |
| `JyE` | `makeUsageSniffer` | cli_inner_pretty.js:862724-862759 | function |
| `lyE` | `extractAvailableModels` | cli_inner_pretty.js:860920-860923 | function |
| `mMm` | `mergeArrayFieldsDeduped` | cli_inner_pretty.js:860991-861002 | function |
| `o_i` | `selectPolicyForIdentity` | cli_inner_pretty.js:861024-861034 | function |
| `pMm` | `buildManagedSettingsPolicies` | cli_inner_pretty.js:860924-860943 | function |
| `qMm` | `CHARS_PER_TOKEN_ESTIMATE` (4) | cli_inner_pretty.js:862862 | constant |
| `r_E` | `parseNonStreamingUsage` | cli_inner_pretty.js:862834-862849 | function |
| `rvl` | `findSseFieldSpan` | cli_inner_pretty.js:862807-862828 | function |
| `t_E` | `finalizeSseUsage` | cli_inner_pretty.js:862829-862833 | function |
| `UMm` | `SSE_BUFFER_LIMIT_BYTES` (8388608) | cli_inner_pretty.js:862860 | constant |
| `uyE` | `mergeCatchAllPolicyIntoOthers` | cli_inner_pretty.js:860950-860968 | function |
| `VMm` | `mergeUsageFields` | cli_inner_pretty.js:862850-862859 | function |
| `vTt` | `isPriceableModelId` | cli_inner_pretty.js:862664-862669 | function |
| `WMm` | `meterUpstreamResponse` | cli_inner_pretty.js:862689-862723 | function |
| `XyE` | `normalizeUsageForPricing` | cli_inner_pretty.js:862670-862683 | function |
| `ZyE` | `SSE_ENVELOPE_ALLOWANCE` (80) | cli_inner_pretty.js:862863 | constant |

## Module: Telemetry - GrowthBook feature flags

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$no` | `getFeatureValueWithSource` | cli_inner_pretty.js:156651-156666 | function |
| `$tu` | `persistFeatureFlagsToDisk` | cli_inner_pretty.js:156563-156575 | function |
| `abe` | `getFeatureValue_CACHED_WITH_REFRESH` | cli_inner_pretty.js:156670-156672 | function |
| `aIg` | `clearGrowthBookConfigOverrides` (stub) | cli_inner_pretty.js:156478-156480 | function |
| `AW` | `checkGate_CACHED_OR_BLOCKING` | cli_inner_pretty.js:156684-156694 | function |
| `Btu` | `startFlagRefreshTimer` | cli_inner_pretty.js:156759-156773 | function |
| `cIg` | `getFlagRefreshIntervalMs` (21600000) | cli_inner_pretty.js:156726-156728 | function |
| `Dno` | `pendingExposures` | cli_inner_pretty.js:156832 | variable |
| `Dtu` | `recoverExperimentAssignmentFromDisk` | cli_inner_pretty.js:156400-156411 | function |
| `eJi` | `checkSecurityRestrictionGate` | cli_inner_pretty.js:156673-156683 | function |
| `Ftu` | `getFeatureValueAsync` | cli_inner_pretty.js:156633-156647 | function |
| `Gde` | `livePayloadValues` | cli_inner_pretty.js:156831 | variable |
| `GXi` | `warnedMalformedExperiments` | cli_inner_pretty.js:156786 | variable |
| `hVr` | `getAllGrowthBookFeatures` | cli_inner_pretty.js:156462-156465 | function |
| `iIg` | `getGrowthBookConfigOverrides` (returns `{}`) | cli_inner_pretty.js:156472-156474 | function |
| `Jer` | `getConfigFeatureOverrides` (**stub, returns undefined**) | cli_inner_pretty.js:156459-156461 | function |
| `jXi` | `warnedNonObjectFeatures` | cli_inner_pretty.js:156785 | variable |
| `Ke` | `getFeatureValue_CACHED_MAY_BE_STALE` | cli_inner_pretty.js:156667-156669 | function |
| `KXi` | `initialAuthHeader` | cli_inner_pretty.js:156791 | variable |
| `L1e` | `clearMemoizedIdentityState` | cli_inner_pretty.js:106755-106757 | function |
| `lIg` | `isDiskCacheAllowedWithTelemetryOff` | cli_inner_pretty.js:156579-156581 | function |
| `Lno` | `nonDefaultFeatureKeys` | cli_inner_pretty.js:156831 | variable |
| `Ltu` | `installAuthedRemoteEvalHook` | cli_inner_pretty.js:156372-156399 | function |
| `Mno` | `recordExposure` | cli_inner_pretty.js:156481-156496 | function |
| `Mtu` | `flushRecoveredExposures` | cli_inner_pretty.js:156497-156503 | function |
| `mVr` | `getEnvFeatureOverrides` (**unreachable body, returns null**) | cli_inner_pretty.js:156432-156443 | function |
| `Nno` | `refreshFeatureFlagsPeriodically` | cli_inner_pretty.js:156733-156758 | function |
| `oIg` | `isExperimentFeature` | cli_inner_pretty.js:156454-156458 | function |
| `Ono` | `getFeatureValue_DEPRECATED` | cli_inner_pretty.js:156648-156650 | function |
| `Otu` | `processRemoteEvalPayload` | cli_inner_pretty.js:156504-156562 | function |
| `P_e` | `getDynamicConfig_BLOCKS_ON_INIT` | cli_inner_pretty.js:156778-156780 | function |
| `Pno` | `wasInitializedWithAuth` | cli_inner_pretty.js:156790 | variable |
| `PP` | `getDynamicConfig_CACHED_MAY_BE_STALE` | cli_inner_pretty.js:156781-156783 | function |
| `Qer` | `teardownGrowthBook` | cli_inner_pretty.js:156709-156725 | function |
| `QXi` | `getNonDefaultFeatureKeys` | cli_inner_pretty.js:156469-156471 | function |
| `R$e` | `activeGrowthBookClient` | cli_inner_pretty.js:156784 | variable |
| `sie` | `isGrowthBookEnabled` | cli_inner_pretty.js:156576-156578 | function |
| `tJi` | `stopFlagRefreshTimer` | cli_inner_pretty.js:156774-156777 | function |
| `Tst` | `experimentAssignments` | cli_inner_pretty.js:156831 | variable |
| `u7i` | `getClientDataAtis` | cli_inner_pretty.js:156729-156732 | function |
| `vxe` | `reinitializeGrowthBook` | cli_inner_pretty.js:156695-156708 | function |
| `WXi` | `warnedValueLessEntries` | cli_inner_pretty.js:156787 | variable |
| `X1e` | `hasLivePayload` | cli_inner_pretty.js:156466-156468 | function |
| `XXi` | `initialOrgUuid` | cli_inner_pretty.js:156793 | variable |
| `YXi` | `initialAccountUuid` | cli_inner_pretty.js:156792 | variable |
| `zXi` | `coalesceNullFeatureValue` | cli_inner_pretty.js:156630-156632 | function |

## Module: Telemetry - OTLP exporters and metrics

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$H_` | `appendTotalSuffix` (vendored) | cli_inner_pretty.js:494068-494071 | function |
| `_Fo` | `wrapAgentToBufferBodyAndSetContentLength` | cli_inner_pretty.js:494959-495001 | function |
| `Att` | `resetCostState` | cli_inner_pretty.js:3114-3126 | function |
| `aYd` | `isTelemetryEnabled` | cli_inner_pretty.js:494720-494722 | function |
| `BSi` | `getSessionCounter` | cli_inner_pretty.js:3202-3204 | function |
| `cFo` | `escapePrometheusValue` (vendored) | cli_inner_pretty.js:494056-494058 | function |
| `cYd` | `parseOtlpHeadersEnv` | cli_inner_pretty.js:494902-494911 | function |
| `EFo` | `buildOtlpExporterOptions` | cli_inner_pretty.js:494912-494943 | function |
| `FH_` | `prometheusTypeForDataPoint` (vendored) | cli_inner_pretty.js:494077-494089 | function |
| `FSi` | `setMeterAndCounters` | cli_inner_pretty.js:3178-3198 | function |
| `GSi` | `getActiveTimeCounter` | cli_inner_pretty.js:3223-3225 | function |
| `iI_` | `flushTelemetry` | cli_inner_pretty.js:494885-494900 | function |
| `J$r` | `getCodeEditToolDecisionCounter` | cli_inner_pretty.js:3220-3222 | function |
| `JKd` | `buildOtlpHttpAgentFactory` | cli_inner_pretty.js:495002-495028 | function |
| `jSi` | `getCostCounter` | cli_inner_pretty.js:3214-3216 | function |
| `kiE` | `initializeTelemetryAndCounters` | cli_inner_pretty.js:827904-827922 | function |
| `lYd` | `isBigQueryMetricsEligible` | cli_inner_pretty.js:494727-494732 | function |
| `nI_` | `buildBigQueryMetricReader` | cli_inner_pretty.js:494723-494726 | function |
| `oI_` | `initializeTelemetry` | cli_inner_pretty.js:494733-494884 | function |
| `Q$r` | `getLoggerProvider` | cli_inner_pretty.js:3226-3228 | function |
| `R9t` | `getTokenCounter` | cli_inner_pretty.js:3217-3219 | function |
| `rI_` | `getOtlpTraceExporters` | cli_inner_pretty.js:494688-494718 | function |
| `rYd` | `TRACES_EXPORT_INTERVAL_MS_DEFAULT` (5000) | cli_inner_pretty.js:495039 | constant |
| `sI_` | `isLoopbackEndpoint` | cli_inner_pretty.js:494944-494952 | function |
| `sYd` | `getOtlpLogExporters` | cli_inner_pretty.js:494654-494687 | function |
| `tI_` | `getOtlpMetricReaders` | cli_inner_pretty.js:494600-494653 | function |
| `tYd` | `LOGS_EXPORT_INTERVAL_MS_DEFAULT` (5000) | cli_inner_pretty.js:495038 | constant |
| `Xhl` | `initializeTelemetryOnce` | cli_inner_pretty.js:827891-827903 | function |
| `XKd` | `toBuffer` (OTLP chunk normaliser) | cli_inner_pretty.js:494953-494958 | function |
| `z5s` | `sanitizePrometheusName` (vendored) | cli_inner_pretty.js:494065-494067 | function |
| `ZH_` | `METRIC_EXPORT_INTERVAL_MS_DEFAULT` (60000) | cli_inner_pretty.js:495037 | constant |

## Module: Telemetry - OTel event emission and attributes

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_g` | `isOtelToolDetailsLoggingEnabled` | cli_inner_pretty.js:151970-151972 | function |
| `aat` | `exitSpanScope` | cli_inner_pretty.js:168035-168038 | function |
| `Ac` | `emitOtelLogEvent` | cli_inner_pretty.js:167354-167372 | function |
| `Bio` | `storedInteractionContext` | cli_inner_pretty.js:167332 | variable |
| `D5r` | `buildWorkflowOtelAttributes` | cli_inner_pretty.js:111459-111462 | function |
| `elu` | `ClaudeCodeContextManager` | cli_inner_pretty.js:167293-167321 | class |
| `fe` | `attrString` | cli_inner_pretty.js:141-143 | function |
| `FY` | `getCurrentOtelContext` | cli_inner_pretty.js:168023-168025 | function |
| `G1g` | `parseOtelResourceAttributes` | cli_inner_pretty.js:167253-167270 | function |
| `Got` | `buildSubagentOtelAttributes` | cli_inner_pretty.js:111449-111458 | function |
| `hie` | `isEnhancedTelemetryOrBetaTracingEnabled` | cli_inner_pretty.js:168004-168006 | function |
| `HW` | `getTracer` | cli_inner_pretty.js:168020-168022 | function |
| `j1g` | `OTEL_METRICS_INCLUDE_DEFAULTS` | cli_inner_pretty.js:167246-167252 | object |
| `K1g` | `isUserPromptLoggingEnabled` | cli_inner_pretty.js:167337-167339 | function |
| `Kro` | `buildToolSourceAttribute` | cli_inner_pretty.js:152007-152010 | function |
| `KRt` | `setSpanErrorStatus` | cli_inner_pretty.js:168013-168015 | function |
| `les` | `setStoredInteractionContext` | cli_inner_pretty.js:167322-167324 | function |
| `mde` | `isSubagentContext` | cli_inner_pretty.js:111442-111444 | function |
| `nZ` | `buildWorkflowAnalyticsContext` | cli_inner_pretty.js:111463-111466 | function |
| `olu` | `isOtelAssistantResponseLoggingEnabled` | cli_inner_pretty.js:167343-167345 | function |
| `P9r` | `redactIfDisabled` | cli_inner_pretty.js:167340-167342 | function |
| `qP` | `isBetaTracingEnabled` | cli_inner_pretty.js:167433-167436 | function |
| `qRt` | `getTelemetryAttributes` | cli_inner_pretty.js:167170-167209 | function |
| `r$g` | `startInteractionSpan` | cli_inner_pretty.js:168042-168072 | function |
| `Rlu` | `setToolCallIdAttributes` | cli_inner_pretty.js:168016-168019 | function |
| `S8e` | `otelContextManager` | cli_inner_pretty.js:167335 | variable |
| `sat` | `enterSpanScope` | cli_inner_pretty.js:168030-168033 | function |
| `tlu` | `getStoredInteractionContext` | cli_inner_pretty.js:167325-167327 | function |
| `Uio` | `getActiveOrStoredContext` | cli_inner_pretty.js:167328-167331 | function |
| `urr` | `getActiveScopedSpan` | cli_inner_pretty.js:168026-168029 | function |
| `Vio` | `runWithInteractionSpan` | cli_inner_pretty.js:168073-168082 | function |
| `W$e` | `endInteractionSpan` | cli_inner_pretty.js:168083-168093 | function |
| `X1g` | `resolveLogRecordTraceContext` | cli_inner_pretty.js:167346-167353 | function |
| `Y1g` | `w3cTraceContextPropagator` | cli_inner_pretty.js:167425 | variable |
| `yes` | `isEnhancedTelemetryBetaEnabled` | cli_inner_pretty.js:167998-168003 | function |
| `yn` | `isNonInteractive` | cli_inner_pretty.js:3286-3288 | function |
| `YRt` | `buildSpanAttributes` | cli_inner_pretty.js:168039-168041 | function |
| `z1g` | `eventSequence` | cli_inner_pretty.js:167412 | variable |
| `zro` | `isSdkHostServer` | cli_inner_pretty.js:151999-152001 | function |

## Module: Telemetry - content truncation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Dud` | `isRawApiBodyLoggingEnabled` | cli_inner_pretty.js:339435-339437 | function |
| `hTo` | `emitApiRequestBodyEvent` | cli_inner_pretty.js:339477-339481 | function |
| `Lud` | `resolveRawApiBodyMode` | cli_inner_pretty.js:339430-339434 | function |
| `Mud` | `redactThinkingBlocks` | cli_inner_pretty.js:339462-339468 | function |
| `Oud` | `emitApiResponseBodyEvent` | cli_inner_pretty.js:339482-339488 | function |
| `Pud` | `emitRawApiBodyEvent` | cli_inner_pretty.js:339446-339461 | function |
| `q1g` | `TELEMETRY_CONTENT_LIMIT_BYTES` | cli_inner_pretty.js:167289 | constant |
| `V1g` | `resolveOtelContentMaxLength` | cli_inner_pretty.js:167272-167279 | function |
| `WP` | `truncateTelemetryContent` | cli_inner_pretty.js:167280-167288 | function |

## Module: Telemetry - cost and usage metering

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$ig` | `computeCacheWriteCostUsd` | cli_inner_pretty.js:109756-109762 | function |
| `a7n` | `FAST_RATES_10_50` | cli_inner_pretty.js:109843-109850 | object |
| `Dig` | `STANDARD_OPUS_RATES` (5 / 25) | cli_inner_pretty.js:109827-109834 | object |
| `Dji` | `resolveModelCosts` | cli_inner_pretty.js:109772-109784 | function |
| `Fot` | `MODEL_COSTS` | cli_inner_pretty.js:109853 | object |
| `GIc` | `catalogPricingToModelCosts` | cli_inner_pretty.js:109723-109738 | function |
| `jIc` | `formatCatalogPriceLabel` | cli_inner_pretty.js:109718-109722 | function |
| `Kkt` | `priceUsageFromCounters` | cli_inner_pretty.js:109792-109802 | function |
| `l7n` | `UNKNOWN_MODEL_COSTS` (aliases `Dig`) | cli_inner_pretty.js:109851 | variable |
| `Lji` | `computeCostUsd` | cli_inner_pretty.js:109763-109771 | function |
| `M6e` | `formatPricePerMtok` | cli_inner_pretty.js:109807-109809 | function |
| `Mig` | `isCatalogModelId` | cli_inner_pretty.js:109739-109741 | function |
| `Nig` | `reportUnknownModelCost` | cli_inner_pretty.js:109785-109787 | function |
| `Oig` | `buildBakedCostMap` | cli_inner_pretty.js:109742-109755 | function |
| `Roe` | `priceUsage` | cli_inner_pretty.js:109788-109791 | function |
| `UIc` | `FAST_RATES_30_150` | cli_inner_pretty.js:109835-109842 | object |
| `WIc` | `formatModelPriceLabel` | cli_inner_pretty.js:109810-109815 | function |
| `zkt` | `getFastModeDisplayCosts` | cli_inner_pretty.js:109713-109717 | function |

## Module: Telemetry - env-var schema

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Fd` | `parseLenientInteger` | cli_inner_pretty.js:4441-4444 | function |
| `G0l` | `DIGIT_GROUP_REGEX` | cli_inner_pretty.js:4454 | constant |
| `GYm` | `OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT` schema | cli_inner_pretty.js:24528 | variable |
| `jYm` | `OTEL_LOGRECORD_ATTRIBUTE_VALUE_LENGTH_LIMIT` schema | cli_inner_pretty.js:24527 | variable |
| `pUm` | `SCIENTIFIC_NOTATION_REGEX` | cli_inner_pretty.js:4453 | constant |
| `u8` | `parseGroupedInteger` | cli_inner_pretty.js:4445-4450 | function |
| `UYm` | `OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT` schema | cli_inner_pretty.js:24526 | variable |
| `W0l` | `DIGIT_SEPARATOR_REGEX` | cli_inner_pretty.js:4455 | constant |
| `WYm` | `CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH` schema (`int`, `min:1`, `digitsOnly`) | cli_inner_pretty.js:24529 | variable |
| `XIl` | `makeIntEnvSchema` | cli_inner_pretty.js:24101-24116 | function |
| `xYm` | `OTEL_EXPORTER_OTLP_ENDPOINT` schema | cli_inner_pretty.js:24512 | variable |

## Module: Telemetry helpers used by the caps

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$e` | logFeatureSad (`tengu_feature_sad`) — soft degrade | cli_inner_pretty.js:47876-47878 | function |
| `be` | logFeatureOk (`tengu_feature_ok`) | cli_inner_pretty.js:47870-47872 | function |
| `Ke` | getFeatureValue (alias of `getFeatureValue_CACHED_MAY_BE_STALE`) | cli_inner_pretty.js:156667-156669 | function |
| `pe` | logFeatureBad (`tengu_feature_bad`) — hard refusal | cli_inner_pretty.js:47873-47875 | function |

## Module: Telemetry — workflow provenance attributes

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ac | emitOtelLogEvent | cli_inner_pretty.js:167354-… | function |
| D5r | buildWorkflowOtelAttrs | cli_inner_pretty.js:111459-111462 | function |
| mde | isSubagentContext | cli_inner_pretty.js:111442-111444 | function |
| nZ | buildWorkflowEventFields | cli_inner_pretty.js:111463-111466 | function |
| Plu | startToolSpan | cli_inner_pretty.js:168193-168222 | function |
| Vpr | emitTaskProgressFrame | cli_inner_pretty.js:345314-345327 | function |

## Module: Transport / mTLS / Proxy

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aOi` | `getMTLSAgent` — identity-compares `{config, ca}` and rebuilds the `https.Agent` on change | cli_inner_pretty.js:65144-65154 | function |
| `BFi` | `keepAliveDisabled` — process-wide one-way latch | cli_inner_pretty.js:86541 | variable |
| `BWn` | `clearMTLSCache` | cli_inner_pretty.js:65167-65169 | function |
| `D7t` | `mtlsAgentCache` — `{config, ca, agent}` | cli_inner_pretty.js:65179 | variable |
| `fql` | `readPemSync` — returns `{path, content}` or null | cli_inner_pretty.js:65125-65132 | function |
| `Gcs` | `TLS_CERT_ERROR_CODES` — 16-code trust/validity set | cli_inner_pretty.js:228017-228033 | variable |
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
| `UZg` | `TLS_ERROR_CODES_EXTENDED` — `Gcs` + handshake-timeout + two SSL protocol codes | cli_inner_pretty.js:228034-228039 | variable |
| `Wie` | `UNREACHABLE_CODES` — gained `ERR_PROXY_TUNNEL` (220=4/193=0) | cli_inner_pretty.js:228040-228051 | variable |
| `WK` | `getWebSocketTLSOptions` | cli_inner_pretty.js:65155-65160 | function |
| `wnt` | `loadedMtlsCert` — `{path, content}` | cli_inner_pretty.js:65175 | variable |
| `YU_` | `isStaleConnectionError` — `ConnectionError` whose errno code ∈ `qie` | cli_inner_pretty.js:534522-534526 | function |

## Module: Worktree Isolation Containment

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$ky` | COMMAND_PREFIX_BUILTINS (`command`,`builtin`,`time`,`noglob`,`nocorrect`) | cli_inner_pretty.js:312769 | constant |
| `_8e` | preSpawnShellFailure (synthesised `code:1` shell result carrying the refusal) | cli_inner_pretty.js:166241-166252 | function |
| `aTs` | GIT_REDIRECT_ENV_VARS (`GIT_DIR`,`GIT_WORK_TREE`,`GIT_COMMON_DIR`,`GIT_OBJECT_DIRECTORY`,`GIT_INDEX_FILE`,`GIT_SHALLOW_FILE`) | cli_inner_pretty.js:312756-312763 | constant |
| `bBe` | spawnShellCommand (hosts the four worktree-escape refusals, `:314161`-`:314222`) | cli_inner_pretty.js:314125 | function |
| `Dky` | GIT_WORKTREE_FLAGS (`--git-dir`, `--work-tree`) | cli_inner_pretty.js:312765 | constant |
| `fed` | analyzeGitRedirectOutsideWorktree (fail-closed on non-simple commands, `:312428`) | cli_inner_pretty.js:312423 | function |
| `Gcr` | worktreeFileEditGuard (canonical verdict + unresolvable/network cases) | cli_inner_pretty.js:307807-307816 | function |
| `hed` | findGitArgvIndex | cli_inner_pretty.js:312599-312604 | function |
| `Hmt` | worktreeFileEditGuard (raw `startsWith` prefix test) | cli_inner_pretty.js:377318-377331 (193) | function |
| `ied` | worktreeEscapeMessage (three refusal shapes) | cli_inner_pretty.js:312384-312396 | function |
| `kGn` | getEffectiveCwd (ALS store cwd, else process cwd) | cli_inner_pretty.js:49881-49883 | function |
| `led` | isNetworkOrDeviceShapedPath | cli_inner_pretty.js:312560-312568 | function |
| `Lky` | GIT_PATH_FLAGS (`--namespace`, `--attr-source`, `--shallow-file`) | cli_inner_pretty.js:312764 | constant |
| `Oky` | CHDIR_BUILTINS (`cd`,`pushd`,`popd`,`chdir`) | cli_inner_pretty.js:312768 | constant |
| `PLi` | recoverShellCwd | cli_inner_pretty.js:49876-49880 | function |
| `PWe` | runWithCwdOverride | cli_inner_pretty.js:49870-49872 | function |
| `qky` | describeUnverifiableIndirection (xargs/parallel, find -execdir, interpreter) | cli_inner_pretty.js:312573-312589 | function |
| `sed` | classifyWorktreeEscape (`{dir, worktree, roots, escaped}`) | cli_inner_pretty.js:312400-312408 | function |
| `Uky` | isGitRedirectingEnvVar (adds `GIT_CONFIG*`, `HOME`, `CDPATH`, `XDG_CONFIG_HOME`) | cli_inner_pretty.js:312569-312572 | function |
| `Urt` | hasCwdOverrideContext (ALS store present?) | cli_inner_pretty.js:49873-49875 | function |
| `xGn` | runWithCwd (ALS `run`) | cli_inner_pretty.js:49867-49869 | function |
| `ytn` | didCwdEscapeWorktree | cli_inner_pretty.js:312397-312399 | function |

---

## Source documents

- [`symbol_additions_v2_1_220_api_reliability.md`](symbol_additions_v2_1_220_api_reliability.md)
- [`symbol_additions_v2_1_220_auth_providers.md`](symbol_additions_v2_1_220_auth_providers.md)
- [`symbol_additions_v2_1_220_background_agents_daemon.md`](symbol_additions_v2_1_220_background_agents_daemon.md)
- [`symbol_additions_v2_1_220_compact.md`](symbol_additions_v2_1_220_compact.md)
- [`symbol_additions_v2_1_220_mcp.md`](symbol_additions_v2_1_220_mcp.md)
- [`symbol_additions_v2_1_220_models.md`](symbol_additions_v2_1_220_models.md)
- [`symbol_additions_v2_1_220_performance.md`](symbol_additions_v2_1_220_performance.md)
- [`symbol_additions_v2_1_220_permissions.md`](symbol_additions_v2_1_220_permissions.md)
- [`symbol_additions_v2_1_220_remote_control.md`](symbol_additions_v2_1_220_remote_control.md)
- [`symbol_additions_v2_1_220_sandbox.md`](symbol_additions_v2_1_220_sandbox.md)
- [`symbol_additions_v2_1_220_slash_cli.md`](symbol_additions_v2_1_220_slash_cli.md)
- [`symbol_additions_v2_1_220_subagent_limits.md`](symbol_additions_v2_1_220_subagent_limits.md)
- [`symbol_additions_v2_1_220_system_prompt.md`](symbol_additions_v2_1_220_system_prompt.md)
- [`symbol_additions_v2_1_220_telemetry.md`](symbol_additions_v2_1_220_telemetry.md)
- [`symbol_additions_v2_1_220_workflow.md`](symbol_additions_v2_1_220_workflow.md)
