# Symbol additions — v2.1.220, theme `api_reliability`

Staged for merge. Routing per [`../_CONVENTIONS.md`](../_CONVENTIONS.md) §6: the request retry loop,
the streaming generator and the transport error taxonomy are all **LLM API / agent-loop** machinery, so
**most groups below belong in `symbol_index_core_execution.md`**. Four groups route elsewhere and
say so in their own `> Merge into:` line: the flag-settings cache and the MCP retryable codes go to
`symbol_index_infra_platform.md`, the installer constant to `symbol_index_core_features.md`, and the
bridge retryable codes to `symbol_index_infra_integration.md`.

All `File:Line` values are `cli_inner_pretty.js` line numbers in the **2.1.220** bundle
(`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`) that were read during
this pass. Rows tagged `(193)` in a description refer to the baseline bundle and are never used as the
File:Line value. Obfuscated ids are re-mangled between builds — never import one of these into another
tree.

Source documents: [`../57_api_reliability/README.md`](../57_api_reliability/README.md),
[`retry_policy.md`](../57_api_reliability/retry_policy.md),
[`streaming_and_watchdog.md`](../57_api_reliability/streaming_and_watchdog.md),
[`transport_errors.md`](../57_api_reliability/transport_errors.md).

---

## Module: LLM API — request retry loop

> Merge into: `symbol_index_core_execution.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$U_` | `DEFAULT_RETRIES` (`10`) | cli_inner_pretty.js:534989 | constant |
| `$lp` | `isTransientRateLimit` (429 without unified rate-limit headers) | cli_inner_pretty.js:534951 | function |
| `Blp` | `isWatchdogRetryableError` (529 or 429) | cli_inner_pretty.js:534516 | function |
| `BU_` | `REMOTE_AUTH_RETRY_DELAY_MS` (`1000`) | cli_inner_pretty.js:534995 | constant |
| `Dlp` | `FLOOR_OUTPUT_TOKENS` (`3000`) | cli_inner_pretty.js:534992 | constant |
| `Dqs` | `isServerError5xx` (5xx excluding 529) | cli_inner_pretty.js:534859 | function |
| `FU_` | `MAX_CCR_AUTH_RETRIES` (`2`) | cli_inner_pretty.js:534994 | constant |
| `FUo` | `makeRetryAbortError` | cli_inner_pretty.js:534988 | function |
| `Flp` | `MAX_RETRY_DELAY_MS` (`21600000`, 6 h) | cli_inner_pretty.js:535003 | constant |
| `GU_` | `MAX_AWS_AUTH_RETRIES` (`2`) | cli_inner_pretty.js:534998 | constant |
| `JBo` | `MAX_CONSECUTIVE_529` (`3`) | cli_inner_pretty.js:534993 | constant |
| `JU_` | `RETRYABLE_STATUS_CODES` (`{401,407,429,404,403,413}`) | cli_inner_pretty.js:535065 | constant |
| `KU_` | `RETRY_SLEEP_SLICE_MS` (`30000`) | cli_inner_pretty.js:535004 | constant |
| `NU_` | `WATCHDOG_DEFAULT_RETRIES` (`300`) | cli_inner_pretty.js:534990 | constant |
| `Nlp` | `clampWarningEmitted` (one-shot latch) | cli_inner_pretty.js:535009 | variable |
| `Plp` | `sleepUntilRetryOrWake` (30 s slices, wake channel) | cli_inner_pretty.js:534800 | function |
| `Pqs` | `getMaxRetries` (watchdog-aware budget) | cli_inner_pretty.js:534954 | function |
| `UU_` | `MAX_OAUTH_REFRESH_RETRIES` (`2`) | cli_inner_pretty.js:534996 | constant |
| `Ulp` | `readRetryAfterHeader` | cli_inner_pretty.js:534817 | function |
| `VU_` | `MAX_ACCEPTABLE_RETRY_DELAY_MS` (`60000`) | cli_inner_pretty.js:535001 | constant |
| `WUe` | `isRetryWatchdogEnabled` (`CLAUDE_CODE_RETRY_WATCHDOG`) | cli_inner_pretty.js:534513 | function |
| `WU_` | `MAX_API_KEY_HELPER_RETRIES` (`2`) | cli_inner_pretty.js:534999 | constant |
| `X9s` | `MAX_RETRIES_CLAMP` (`15`) | cli_inner_pretty.js:534991 | constant |
| `YU_` | `isStaleConnectionError` (`qie` membership) | cli_inner_pretty.js:534522 | function |
| `Z2e` | `computeRetryDelay` (exp backoff, 25 % jitter, `retry-after` floor) | cli_inner_pretty.js:534820 | function |
| `ZU_` | `refreshAwsAuthAndAllowRetry` (side-effecting) | cli_inner_pretty.js:534877 | function |
| `c4_` | `readUnifiedResetHeader` (ms until reset, capped at `Flp`) | cli_inner_pretty.js:534979 | function |
| `e4_` | `isGoogleCredentialMessage` (3 message shapes) | cli_inner_pretty.js:534883 | function |
| `jlp` | `parseMaxTokensContextLimitError` | cli_inner_pretty.js:534829 | function |
| `l4_` | `readRetryAfterMs` (seconds header × 1000) | cli_inner_pretty.js:534971 | function |
| `n4_` | `isRetryableApiError` (master classifier) | cli_inner_pretty.js:534911 | function |
| `o4_` | `resolveMaxRetriesForRequest` | cli_inner_pretty.js:534968 | function |
| `qU_` | `RETRY_BACKOFF_BASE_MS` (`500`) | cli_inner_pretty.js:535000 | constant |
| `qlp` | `isGoogleCredentialError` (Vertex / anthropic_google_cloud) | cli_inner_pretty.js:534892 | function |
| `r4_` | `invalidateCachedCredentialOnError` | cli_inner_pretty.js:534903 | function |
| `smn` | `isRemoteAuthError` (`CLAUDE_CODE_REMOTE` + 401/403) | cli_inner_pretty.js:534519 | function |
| `t4_` | `refreshGoogleAuthAndAllowRetry` | cli_inner_pretty.js:534899 | function |
| `zU_` | `WATCHDOG_BACKOFF_CAP_MS` (`300000`) | cli_inner_pretty.js:535002 | constant |

## Module: LLM API — transport error taxonomy

> Merge into: `symbol_index_core_execution.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Apo` | `isEffortUnsupportedError` (two-shape 400 detector) | cli_inner_pretty.js:228417 | function |
| `BZg` | `isRateLimitError` (429 or `rate_limit_error` in message) | cli_inner_pretty.js:227875 | function |
| `Fke` | `isOAuthTokenRevokedError` (403 + revoked message) | cli_inner_pretty.js:227868 | function |
| `GZg` | `isNetworkDownError` (`Wie` membership) | cli_inner_pretty.js:227907 | function |
| `Gcs` | `CERT_ERROR_CODES` (15 fail-fast certificate codes) | cli_inner_pretty.js:228017 | constant |
| `HN` | `unwrapConnectionDetails` (5-level `.cause` walk) | cli_inner_pretty.js:227888 | function |
| `ILu` | `extractNestedErrorMessage` | cli_inner_pretty.js:227932 | function |
| `LLu` | `classifyStreamFailureReason` | cli_inner_pretty.js:228003 | function |
| `Qlt` | `buildSSLCertHint` (`NODE_EXTRA_CA_CERTS` fix hint) | cli_inner_pretty.js:227911 | function |
| `RLu` | `inferStatusFromError` (529/429 from message shape) | cli_inner_pretty.js:227879 | function |
| `UZg` | `SSL_ERROR_CODES` (`Gcs` + 3 transient TLS codes) | cli_inner_pretty.js:228034 | constant |
| `WZg` | `formatErrorMessageStrippingHtml` | cli_inner_pretty.js:227924 | function |
| `Wie` | `NETWORK_DOWN_CODES` (10 codes; `ERR_PROXY_TUNNEL` new) | cli_inner_pretty.js:228040 | constant |
| `dSe` | `isOverloaded529` (529 or `overloaded_error` in message) | cli_inner_pretty.js:227871 | function |
| `dpo` | `classifyConnectionErrorCode` (code → telemetry token) | cli_inner_pretty.js:227885 | function |
| `jZg` | `BUN_SOCKET_CLOSED_MESSAGE` | cli_inner_pretty.js:228014 | constant |
| `jcs` | `extractHtmlTitle` (gateway error-page title) | cli_inner_pretty.js:227916 | function |
| `lir` | `formatApiErrorForDisplay` (8-way SSL switch) | cli_inner_pretty.js:227947 | function |
| `qZg` | `hasNestedErrorObject` | cli_inner_pretty.js:227929 | function |
| `qie` | `API_TRANSIENT_CODES` (7 codes; was 4 in 193) | cli_inner_pretty.js:228052 | constant |
| `D7r` | `buildApiErrorDetails` (formatted + connection + rateLimits) | cli_inner_pretty.js:227988 | function |

## Module: LLM API — context-overflow and media-size messages

> Merge into: `symbol_index_core_execution.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$7r` | `isPromptTooLongError` | cli_inner_pretty.js:228130 | function |
| `Bls` | `MAX_REQUEST_BYTES` (`33554432`, 32 MiB) | cli_inner_pretty.js:222501 | constant |
| `Jcs` | `buildInvalidPdfMessage` | cli_inner_pretty.js:228166 | function |
| `KW` | `isApiErrorText` (six prefixes; was two in 193) | cli_inner_pretty.js:228062 | function |
| `M7r` | `parsePromptTooLongTokens` | cli_inner_pretty.js:228078 | function |
| `Qcs` | `buildRequestTooLargeMessage` (accumulated-media text) | cli_inner_pretty.js:228176 | function |
| `RE` | `API_ERROR_PREFIX` (`"API Error"`) | cli_inner_pretty.js:228930 | constant |
| `ULu` | `buildSingleExchangeTooLongMessage` | cli_inner_pretty.js:228089 | function |
| `VZg` | `SINGLE_EXCHANGE_DOMINANCE_RATIO` (`0.8`) | cli_inner_pretty.js:228936 | constant |
| `Wcs` | `STATUS_PAGE_URL` (`https://status.claude.com`) | cli_inner_pretty.js:228959 | constant |
| `Xcs` | `buildPasswordProtectedPdfMessage` | cli_inner_pretty.js:228161 | function |
| `Ycs` | `buildPdfTooLargeMessage` | cli_inner_pretty.js:228155 | function |
| `ZNe` | `isPromptTooLongApiMessage` | cli_inner_pretty.js:228072 | function |
| `cir` | `computeOverflowTokenGap` | cli_inner_pretty.js:228082 | function |
| `fir` | `buildMediaRemovedMessage` | cli_inner_pretty.js:228182 | function |
| `fpo` | `buildImageTooLargeMessage` | cli_inner_pretty.js:228171 | function |
| `hIu` | `MAX_PDF_PAGES` (`100`) | cli_inner_pretty.js:222503 | constant |
| `hpo` | `isRequestTooLargeMessage` | cli_inner_pretty.js:228127 | function |
| `jLu` | `mediaKindsForRequestTooLarge` | cli_inner_pretty.js:228107 | function |
| `mlp` | `parseMediaKindsFromErrorDetails` | cli_inner_pretty.js:531352 | function |
| `mpo` | `locateOversizeMediaFrom400` | cli_inner_pretty.js:228123 | function |
| `nU_` | `buildMediaStripMessageMap` | cli_inner_pretty.js:531341 | function |
| `ppo` | `buildProviderStatusHint` | cli_inner_pretty.js:228144 | function |
| `rey` | `TRANSIENT_RATE_LIMIT_MESSAGE` | cli_inner_pretty.js:228963 | constant |
| `t7r` | `MAX_PDF_BYTES` (`20971520`) | cli_inner_pretty.js:222502 | constant |
| `zW` | `PROMPT_TOO_LONG_PREFIX` | cli_inner_pretty.js:228935 | constant |
| `zZg` | `isRequestTooLargeDetail` | cli_inner_pretty.js:228104 | function |
| `zcs` | `locateOversizeMediaBlock` (messages[i].content[j] regex) | cli_inner_pretty.js:228113 | function |
| `$Lu` | `AWS_CREDS_EXPIRED_PREFIX` | cli_inner_pretty.js:228931 | constant |
| `NLu` | `AWS_AUTH_FAILED_PREFIX` | cli_inner_pretty.js:228932 | constant |
| `FLu` | `GCLOUD_CREDS_EXPIRED_PREFIX` | cli_inner_pretty.js:228933 | constant |
| `BLu` | `GCLOUD_AUTH_FAILED_PREFIX` | cli_inner_pretty.js:228934 | constant |
| `P7r` | `REPEATED_529_MESSAGE` | cli_inner_pretty.js:228960 | constant |

## Module: LLM API — streaming and watchdogs

> Merge into: `symbol_index_core_execution.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `As` | `armEventWatchdog` (warn + abort timers) | cli_inner_pretty.js:510152 | function |
| `a7i` | `getStreamIdleTimeoutMs` (`max(env, 300000)`) | cli_inner_pretty.js:149792 | function |
| `c1_` | `ADVISOR_STALL_GRACE_CAP_MS` (`90000`) | cli_inner_pretty.js:512026 | constant |
| `fi` | `clearWatchdogTimers` | cli_inner_pretty.js:510126 | function |
| `fs` | `buildServerFallbackEvent` | cli_inner_pretty.js:510508 | function |
| `iZc` | `isBedrockByteWatchdogEnabled` | cli_inner_pretty.js:149946 | function |
| `ji` | `buildAbortedPartialMessage` (stamps `isAbortedMidStream`) | cli_inner_pretty.js:510491 | function |
| `kxg` | `attachByteWatchdog` (ReadableStream wrapper, suspend detect) | cli_inner_pretty.js:149809 | function |
| `l7i` | `getByteStreamIdleTimeoutMs` (provider-aware, gate-tunable) | cli_inner_pretty.js:149795 | function |
| `nZc` | `isByteWatchdogEnabled` (gate default `!0`) | cli_inner_pretty.js:149938 | function |
| `oZc` | `isWatchdogEligibleProvider` | cli_inner_pretty.js:149943 | function |
| `rZc` | `BedrockUnexpectedContentTypeError` | cli_inner_pretty.js:150097 | class |
| `tZc` | `StreamSuspendedError` | cli_inner_pretty.js:150088 | class |
| `vs` | `armStallIndicator` (advisor grace window) | cli_inner_pretty.js:510132 | function |
| `xqs` | `STALL_INDICATOR_DELAY_MS` (`20000`) | cli_inner_pretty.js:512025 | constant |

## Module: LLM API — silent refusal-fallback continuation (`convolute_arcades`)

> Merge into: `symbol_index_core_execution.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `S2c` | `isConvoluteArcadesEnabledInline` (duplicate accessor) | cli_inner_pretty.js:121084 | function |
| `_2c` | `HDR_IS_REFUSAL_FALLBACK` (`x-is-refusal-fallback`) | cli_inner_pretty.js:121245 | constant |
| `b2c` | `HDR_FALLBACK_LATCHED_BY` | cli_inner_pretty.js:121246 | constant |
| `e6i` | `HDR_FALLBACK_FROM_MODEL` | cli_inner_pretty.js:121247 | constant |
| `hit` | `isConvoluteArcadesEnabled` (reads `Jx()[idg]`) | cli_inner_pretty.js:121073 | function |
| `idg` | `CONVOLUTE_ARCADES_FLAG_KEY` (`"convolute_arcades"`) | cli_inner_pretty.js:121244 | constant |
| `n6i` | `HDR_ORIGINAL_REQUEST_ID` | cli_inner_pretty.js:121250 | constant |
| `non` | `sweepInFlightToolsForFallback` (silent / visible lanes) | cli_inner_pretty.js:331733 | function |
| `r6i` | `HDR_FALLBACK_TRIGGER` | cli_inner_pretty.js:121249 | constant |
| `t6i` | `HDR_FALLBACK_CATEGORY` | cli_inner_pretty.js:121248 | constant |

## Module: LLM API — HTTP/2 teardown recovery

> Merge into: `symbol_index_core_execution.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Dip` | `allowUncaughtRecovery` (rate limiter) | cli_inner_pretty.js:522185 | function |
| `J8s` | `recoveredUncaughtReportCount` | cli_inner_pretty.js:522397 | variable |
| `Lip` | `MAX_RECOVERED_UNCAUGHT_REPORTS` (`10`) | cli_inner_pretty.js:522396 | constant |
| `VOg` | `NGHTTP2_STREAM_CLOSE_RE` | cli_inner_pretty.js:165101 | constant |
| `aau` | `isRecoverableHttp2TeardownError` | cli_inner_pretty.js:165073 | function |
| `sau` | `stackHasFrame` (internal-frame matcher) | cli_inner_pretty.js:165088 | variable |
| `z8s` | `recordRecoveredUncaughtMessage` | cli_inner_pretty.js:522206 | function |

## Module: Model selection — flag-settings cache

> Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Jx` | `getClientDataFlags` (per-account server-pushed cache) | cli_inner_pretty.js:536953 | function |
| `q2s` | `setClientDataAvailabilityProbe` | cli_inner_pretty.js:536963 | function |
| `W2s` | `setClientDataAccountKeyFn` | cli_inner_pretty.js:536950 | function |

## Module: Performance — installer/updater download retry

> Merge into: `symbol_index_core_features.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Dbr` | `MAX_DOWNLOAD_ATTEMPTS` (`3`) | cli_inner_pretty.js:540392 | constant |

## Module: MCP — transport retryable codes

> Merge into: `symbol_index_infra_platform.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Lyy` | `CLAUDEAI_MCP_RETRYABLE_CODES` (7 codes) | cli_inner_pretty.js:281623 | constant |
| `pSs` | `MCP_RETRYABLE_CODES_AND_STATUSES` | cli_inner_pretty.js:283135 | constant |
| `vZr` | `MCP_RETRYABLE_CODES` (11 codes; was 8 in 193) | cli_inner_pretty.js:283121 | constant |

## Module: Remote control — bridge retryable codes

> Merge into: `symbol_index_infra_integration.md`

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_W_` | `BRIDGE_RETRYABLE_CODES` (8 codes; was 5 in 193) | cli_inner_pretty.js:547506 | constant |
| `Y2t` | `BridgeHeadlessPermanentError` | cli_inner_pretty.js:547517 | class |

---

## Telemetry events introduced or newly relevant in this theme

Not symbol rows (they are string literals, not identifiers), but recorded here so a future pass does
not re-derive them. All are `220 > 0`; the 193 column is the baseline count.

| Event | 220 | 193 | Line | Meaning |
|---|---|---|---|---|
| `tengu_convolute_arcades_retry` | 1 | 0 | :338267 | silent refusal-fallback retry decision |
| `tengu_convolute_arcades_retry_outcome` | 2 | 0 | :338460, :338518 | `merged` / `no_text` / `error` |
| `tengu_convolute_arcades_tools` | 1 | 0 | :331736 | in-flight tool calls discarded by the silent retry |
| `tengu_effort_unsupported_retry` | 1 | 0 | :509942 | model rejected `output_config.effort`; latched off |
| `tengu_watchdog_skip_nonstreaming_fallback` | 1 | 0 | :511183 | gate (default `!0`): no non-streaming fallback after a watchdog abort |
| `tengu_advisor_tool_error` | 1 | 0 | :510688 | error code inside a returned `advisor_tool_result` |
| `uncaught_exception_recovered` | 1 | 0 | :522524 | HTTP/2 teardown absorbed, process kept alive |
| `tengu_api_retry_after_too_long` | 1 | 1 | :534738 | **carryover** — delay > 60 s and watchdog off |
| `tengu_event_watchdog_default_on` | **0** | **1** | — (`:595164 (193)`) | **deleted** — the `.196` default flip |
| `tengu_disable_keepalive_on_econnreset` | **0** | **1** | — (`:602837 (193)`) | **deleted** — the `.214` gate removal |
| `tengu_streaming_partial_finalized` | 1 | 1 | :511262 | carryover event, but gained 2 new `cause` values |
| `tengu_max_tokens_context_overflow_adjustment` | 1 | 1 | :534723 | carryover event; the surrounding arithmetic changed |
