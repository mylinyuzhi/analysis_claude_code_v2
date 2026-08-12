# Transport normalization, connectivity, and bounded download recovery

The transport layer converts heterogeneous Node, SDK, proxy, cloud-provider, and HTTP/2 failures into
stable decisions. Its classification is intentionally shared by request retry, stream recovery,
startup diagnostics, updater downloads, and user-facing messages, but each consumer applies its own
policy after normalization.

## 1. Cause-chain normalization

### Bounded connection-detail extraction

**What it does:** Finds a stable transport error code without trusting arbitrary nested exception
shape or recursing indefinitely.

**How it works:**
1. `extractConnectionDetails` (`dj`) rejects non-object inputs.
2. It examines the current error and follows at most five `cause` links.
3. The first string-valued `code` is returned with the error message and an SSL classification bit.
4. The SDK message “The socket connection was closed unexpectedly” is normalized to the synthetic
   code `ConnectionClosed` when no code is exposed.
5. A self-referential cause terminates traversal.
6. If no supported shape is found, it returns `null`; callers must not infer network failure from an
   arbitrary message.

**Why this approach:**
- Node, undici, Axios, provider SDKs, and proxy agents wrap errors at different depths.
- A small fixed depth captures ordinary wrappers while bounding work on hostile or malformed cause
  graphs.
- Code-first classification is more stable than matching localized or runtime-version-specific
  prose.
- Taking the first coded cause favors the wrapper's intended classification; deeper causes may carry
  lower-level detail but can also misrepresent the operation-level failure.

**Key insight:** The function is a normalization boundary, not a generic exception flattener. Its
small output forces downstream policy to depend on an approved code taxonomy.

Evidence: `cli_inner_pretty.js:202453-202471`.

### Four-set transport taxonomy

**What it does:** Separates certificate verdicts, broader TLS errors, network unreachability, and
stale/transient connections so retry and display logic can make different decisions.

**How it works:**
1. The certificate-verdict set contains 15 deterministic trust/identity failures such as expired,
   revoked, self-signed, and hostname-mismatch certificates.
2. The broader SSL set adds handshake timeout, wrong TLS version, and bad-record-MAC errors for
   diagnosis without declaring all of them fail-fast certificate verdicts.
3. The network-down set contains refusal, DNS, route/host-down, and proxy-tunnel failures.
4. The stale/transient set contains reset, broken pipe, closed socket, timeouts, aborts, and
   `StreamSuspended`.
5. Request retry excludes certificate verdicts before accepting generic connection errors.
6. Stream recovery uses stale versus network-down membership to select cause and keep-partial policy.
7. Updater downloads reuse both network/stale sets but add download-specific stall and premature-close
   handling.

**Why this approach:**
- “SSL error” is too broad for retry policy: a handshake timeout may recover, while an expired
  certificate will not.
- Network-down and stale-socket conditions need different user messages even though both may be
  transient.
- Shared sets keep request, stream, and downloader behavior aligned.
- The trade-off is dependency on runtime code strings; unknown future codes fail conservatively until
  classified.

**Key insight:** The important split is between *diagnostic family* and *retry verdict*. The broader
SSL label is not itself a reason to fail fast.

Evidence: set initialization at `cli_inner_pretty.js:202603-202658`; request classifier at
`585337-585377`.

## 2. User-safe error projection

### Structured error formatting without leaking HTML or brittle JSON

**What it does:** Projects raw SDK/provider failures into actionable messages while retaining
structured retry and telemetry fields separately.

**How it works:**
1. `formatApiError` (`oSr`) asks the connection normalizer first.
2. Suspend, malformed Bedrock stream, timeout, and certificate codes receive precise remedies.
3. Generic SDK “Connection error.” messages are replaced using the normalized socket/DNS/route/proxy
   category.
4. Nested provider JSON messages are extracted when available.
5. HTML bodies are reduced to their `<title>` or an empty string rather than printed as a page.
6. `buildRetryErrorDetails` (`Bko`) keeps status, request ID, normalized connection, offline bit, and
   unified rate-limit claim/reset information alongside the formatted message.
7. Known authentication and request-policy messages are recognized as expected API errors rather
   than reported as novel crashes.

**Why this approach:**
- A single display string cannot support retry, telemetry, and UX decisions without fragile parsing.
- HTML error bodies commonly come from proxies and are noisy or unsafe to render verbatim.
- Code-specific certificate guidance directs corporate users toward CA configuration instead of
  repeated retries.
- Reducing detail can obscure an unusual gateway response, so debug/structured fields remain
  available separately.

**Key insight:** Formatting happens *after* classification. User-friendly prose is a projection of
structured facts, never an input to the primary transport decision.

Evidence: `dj`, `oSr`, and `Bko` at `cli_inner_pretty.js:202453-202591`.

## 3. Media-request repair

### Targeted unprocessable-media removal

**What it does:** Repairs a 400 response caused by one image/document block by removing the smallest
identifiable bad input and retrying, instead of discarding every attachment.

**How it works:**
1. `parseMediaApiError` (`mxs`) first matches API paths such as
   `messages.<message>.content.<content>...image|document|pdf`.
2. If no path exists, it falls back to curated image/document error phrase families and returns only
   the media kind.
3. `getBadMediaLocation` (`Wko`) activates only for an API error with status 400.
4. When both message and content indexes are present, the request-error callback removes exactly that
   block and records a per-kind diagnostic for the eventual transcript.
5. When the API gives only a kind, it strips base64 media from one carrier message at a time, under a
   three-attempt fallback budget.
6. Each successful mutation returns a typed retry reason so request reconstruction occurs without
   ordinary delay.
7. If mutation makes no progress or the fallback budget is exhausted, normal invalid-request
   formatting takes over.

**Why this approach:**
- A request may contain many valid images and one corrupt or oversized block; global removal would
  lose useful context.
- API path parsing is precise but provider messages are not guaranteed to include a path, so a
  bounded kind-only fallback improves compatibility.
- A mutation/progress check and three-attempt cap prove termination.
- The retry is immediate because changing the body, rather than waiting, is the recovery action.

**Key insight:** Error recovery is ordered from exact location to bounded heuristic. The client uses
the least destructive repair the API response can justify.

Evidence: `MKu`, `mxs`, and `Wko` at `cli_inner_pretty.js:202951-202973`; request mutation at
`530340-530390`; final user projection at `203302-203415`.

## 4. 2.1.222 startup connectivity fix

### Proxy-aware, deadline-bounded dual-endpoint probe

**What it does:** Tests API and OAuth reachability using production-equivalent network options and
guarantees that startup cannot wait indefinitely behind an HTTPS proxy.

**How it works:**
1. `runStartupConnectivityCheck` (`DPh`) first initializes proxy authentication state.
2. It constructs the main `/api/hello` endpoint and the OAuth origin's `/v1/oauth/hello` endpoint.
3. For each URL, it calls the shared transport-option resolver, which applies proxy/no-proxy, TLS/CA,
   socket, and related fetch policy.
4. It records whether a proxy option was actually selected for that endpoint.
5. Both requests execute in parallel with the normal user agent and `AbortSignal.timeout(10000)`.
6. Response bodies are canceled promptly; only HTTP 200 is success.
7. Timeout, HTTP status, SSL hint, and general connection failures remain distinct results.
8. The first failure is returned; the UI names the proxy configuration source only when the failed
   request actually used it.

**Why this approach:**
- A separate connectivity stack can report failure even while real API requests would succeed—or
  hang on a path the real client already knows how to route.
- Parallel probes reduce startup latency while checking both token and API domains.
- A hard 10-second bound protects interactive startup from a CONNECT tunnel that never completes.
- Reporting `usedProxy` rather than merely “proxy configured” avoids blaming a proxy bypassed by
  `NO_PROXY`.

**Key insight:** The fix is policy reuse, not just a timeout. The probe and production traffic now
agree on which proxy/TLS path is authoritative.

Evidence: current `DPh` at `cli_inner_pretty.js:924878-924920` and UI at `924982-925004`. The 2.1.220
`dvm` implementation at `cli_inner_pretty.js:830351-830388` used a separate Axios call without the
shared options, explicit timeout, or `usedProxy` result.

## 5. Provider response guard

### Bedrock event-stream content-type validation

**What it does:** Rejects a successful Bedrock streaming response whose body was transformed into an
unexpected format before the binary event-stream decoder can misinterpret it.

**How it works:**
1. `createApiFetchWrapper` inspects every response's provider, URL, status, and normalized
   `content-type`.
2. The guard applies only to successful Bedrock `invoke-with-response-stream` calls.
3. A content type containing `vnd.amazon.eventstream` passes.
4. Any other present content type causes the body to be canceled and raises
   `BedrockUnexpectedContentTypeError` with the received type.
5. A dedicated environment switch can disable the guard for compatibility diagnosis.
6. The master request classifier explicitly marks this error nonretryable.

**Why this approach:**
- Corporate gateways sometimes return HTML/JSON with a successful status; feeding that into a binary
  decoder produces opaque downstream failures.
- Checking after fetch but before consumption preserves the actual response metadata.
- Retrying unchanged transformed content wastes the retry budget, so the error is fail-fast.
- An escape hatch supports unusual compatible intermediaries, at the cost of losing early validation.

**Key insight:** HTTP success is not protocol success. Provider-specific framing is part of the
response contract and must be validated before parsing.

Evidence: `cli_inner_pretty.js:612340-612364` and `585349-585370`.

## 6. Process-level HTTP/2 survival

### Stack-verified GOAWAY recovery circuit

**What it does:** Keeps the process alive for narrowly recognized Node HTTP/2 teardown exceptions,
without broadly swallowing unrelated uncaught exceptions.

**How it works:**
1. `isRecoverableHttp2Teardown` (`D0u`) checks one of three exact Node error codes.
2. For `ERR_HTTP2_STREAM_ERROR`, it requires an `NGHTTP2_*` message and an
   `emitStreamErrorNT (node:http2:` frame.
3. For `ERR_HTTP2_GOAWAY_SESSION`, it requires the exact “New streams cannot be created…” message and
   a `streamRejectedByGoawaySession` Node frame.
4. For `ERR_HTTP2_SESSION_ERROR`, it requires a numeric session-error message and the Node `goaway`
   frame.
5. The global uncaught-exception handler additionally requires the exception to be classified as a
   host/runtime error and consumes a bounded recovery budget.
6. Accepted exceptions are logged/reported under a limited recovered-report count, schedule the
   startup/mount watchdog, and return without process shutdown.
7. All other uncaught exceptions continue through normal supervised or circuit-breaker shutdown.

**Why this approach:**
- GOAWAY teardown races can escape promise boundaries inside Node and would otherwise terminate a
  healthy session.
- Matching only the code is too broad; user code can construct the same code or a different failure
  can share it.
- Stack verification couples recovery to known Node internals, deliberately preferring false
  negatives after runtime changes over swallowing unknown corruption.
- The budget prevents a tight transport failure loop from making the process immortal.

**Key insight:** Recovery requires three independent proofs: known code/message shape, known Node
internal frame, and remaining process-level budget.

Evidence: `D0u` at `cli_inner_pretty.js:127548-127580` and uncaught handling at `536463-536487`.

## 7. Binary updater reliability

### Stall-, drop-, and checksum-aware download retry

**What it does:** Retries recoverable update-download corruption or transport interruption while
never promoting a partial or checksum-invalid binary.

**How it works:**
1. Each attempt creates a fresh abort controller with an inactivity timer and a total deadline.
2. Incoming chunks refresh the stall timer and feed a SHA-256 transform before reaching the file.
3. Successful pipeline completion is followed by digest comparison; only a match permits executable
   permissions and success.
4. On failure, response streams are destroyed, the file handle is closed, and the partial output is
   removed.
5. Total-deadline expiry fails immediately; stall, checksum mismatch, classified connection drop,
   and `ERR_STREAM_PREMATURE_CLOSE` are retryable within the fixed attempt count.
6. Retry state separately records whether checksum corruption and connection drop occurred for
   telemetry/reporting.
7. Repeated drops produce a network/proxy-specific error; all other terminal errors retain attempt
   metadata.

**Why this approach:**
- A total deadline and a refreshable stall deadline protect against different failures: slow silence
  versus endless low-rate transfer.
- Hashing while streaming avoids a second full-file read.
- Removing partial output before retry ensures later promotion cannot observe an earlier fragment.
- Retrying checksum mismatch assumes transient corruption; bounded attempts prevent a bad repository
  artifact from looping forever.

**Key insight:** The updater treats successful I/O as provisional. Integrity verification, not
pipeline completion, is the commit point.

Evidence: `pEf` and `downloadBinaryWithRetry` (`VDS`) at `cli_inner_pretty.js:623329-623407`.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `extractConnectionDetails` (`dj`) — bounded error cause-chain and code normalization.
- `formatApiError` (`oSr`) — structured transport/API facts to user-facing text.
- `buildRetryErrorDetails` (`Bko`) — retry and telemetry detail projection.
- `parseMediaApiError` (`mxs`) — exact-path-first image/document error classifier.
- `getBadMediaLocation` (`Wko`) — 400-only unprocessable-media recovery trigger.
- `runStartupConnectivityCheck` (`DPh`) — parallel proxy-aware startup probe.
- `isRecoverableHttp2Teardown` (`D0u`) — narrow Node HTTP/2 exception classifier.
- `downloadBinaryWithRetry` (`VDS`) — integrity-gated update download state machine.
