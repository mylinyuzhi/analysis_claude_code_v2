# Request retry policy and bounded recovery

The request retry generator runs around client construction and request creation. It is intentionally
separate from the stream loop: once content has been observed, replay safety depends on stream state
and is decided in `streamMessages`, not by this pre-stream retry machine.

## 1. Retry budget and watchdog mode

### Watchdog-aware maximum retry resolution

**What it does:** Resolves a normal bounded retry count while allowing supervised environments to
opt into a much longer recoverability window.

**How it works:**
1. `isRetryWatchdogEnabled` (`E8e`) parses `CLAUDE_CODE_RETRY_WATCHDOG` as a Boolean.
2. An explicit `CLAUDE_CODE_MAX_RETRIES` is accepted only when it is finite and nonnegative.
3. Without retry-watchdog mode, explicit values above 15 are clamped to 15 and warned once.
4. With watchdog mode, the explicit value is not clamped.
5. If no explicit value is valid, normal mode defaults to 10 retries and watchdog mode to 300.
6. A per-call `maxRetries` option overrides the environment/default resolver.
7. Retry count controls request creation attempts; stream-level retry budgets remain separate.

**Why this approach:**
- Ten retries cover normal transient failures without trapping an interactive user for hours.
- A supervised/background worker benefits from a long recovery horizon because no user may be
  present to restart it.
- The clamp protects accidental extreme configuration while retaining an explicit escape hatch.
- Keeping stream retries separate prevents 300 request retries from also authorizing 300 replays of
  partially observed output.

**Key insight:** `CLAUDE_CODE_RETRY_WATCHDOG` changes more than a number: later branches also relax
give-up and background-overload decisions, so it represents a supervision policy.

Evidence: `i_a`, `khS`, and constants at `cli_inner_pretty.js:585378-585430`.

## 2. Classifier precedence

### Fail-fast certificate and malformed-provider responses

**What it does:** Prevents retries for errors that are deterministic until configuration or the
intermediary changes.

**How it works:**
1. The connection cause chain is normalized to a stable code.
2. Connection errors whose code belongs to the 15-member certificate-verdict set are explicitly
   nonretryable.
3. `BedrockUnexpectedContentType` is also explicitly nonretryable.
4. A server `x-should-retry:false` header overrides ordinary 5xx defaults.
5. Billing errors and selected invalid request families remain outside retry.
6. Only after these exclusions do generic connection errors and 408/409/429/5xx statuses become
   retry candidates.

**Why this approach:**
- Certificate expiration, hostname mismatch, revocation, and self-signed-chain verdicts do not heal
  through backoff.
- A transformed Bedrock binary stream will fail identically until the gateway is fixed.
- Honoring an explicit server no-retry signal avoids amplifying known failures.
- The trade-off is conservative fail-fast behavior for a certificate issue that an external agent
  might repair seconds later; the client prefers immediate, actionable diagnosis.

**Key insight:** The ordering is load-bearing. Generic connection errors are retryable, so the
certificate and Bedrock exclusions must be checked first.

Evidence: `isRetryableApiError` (`ChS`) at `cli_inner_pretty.js:585337-585377`; sets at
`202603-202658`.

### Retryable HTTP, subscriber 429, and server hints

**What it does:** Accepts transient status classes while distinguishing ordinary throttling from
usage-credit enforcement.

**How it works:**
1. 408, 409, 401-recovery cases, and server errors at or above 500 are retryable by default.
2. A 429 is rejected when it explicitly says usage credits are required, except selected fetch/org
   state failures that may recover.
3. `x-should-retry:true` authorizes retry subject to provider/account policy.
4. A transient subscriber 429 is identified by the absence of usage-limit headers rather than by
   matching user-facing prose.
5. Retry-watchdog mode treats model-not-found/rate-limit families as persistently recoverable.
6. A nonretryable status may still trigger a configured fallback model through a distinct fallback
   exception; fallback is not counted as retrying the same model.

**Why this approach:**
- HTTP status alone cannot distinguish temporary gateway throttling from an account cap requiring
  user action.
- Header-based classification is more stable and machine-readable than error strings.
- Separating fallback from retry allows the caller to rebuild model-dependent request parameters.

**Key insight:** A 429 can mean “wait” or “change billing state.” The classifier uses rate-limit and
usage-credit metadata to avoid retrying the latter as if it were congestion.

Evidence: `ChS` and `Ynf` at `cli_inner_pretty.js:585337-585394`.

## 3. Credential/provider recovery

### Refresh-on-classified-auth-failure

**What it does:** Rebuilds the API client and refreshes the correct credential source without
allowing unchanged credentials to loop indefinitely.

**How it works:**
1. The client is reconstructed on first use, auth errors, proxy-auth 407, provider credential errors,
   and stale pooled connections.
2. OAuth, host-managed bearer, Bedrock/Mantle, Vertex/Google, and WIF credentials each use their own
   recovery branch.
3. OAuth refresh compares the token used by the failed client with current stored state.
4. A refreshed/different token resets its exhaustion counter; an unchanged token increments it.
5. Host callback failures and unchanged returned bearer values have an independent two-attempt cap.
6. AWS, CCR remote auth, and API-key-helper recovery each have independent small caps.
7. After the source-specific repair, the client factory is called again so headers, transport, and
   credential objects are rebuilt together.

**Why this approach:**
- Provider credentials have different refresh APIs and cache invalidation semantics.
- Reusing the old client after token change can retain stale headers or connection agents.
- Per-source caps stop one broken provider callback from consuming the full 10/300 network retry
  budget.
- Comparing failed/current token values prevents a transient 401 from replacing a newer token with
  stale state.

**Key insight:** Retry authority is scoped by credential source. The generic loop coordinates
reconstruction, but each provider owns how its credential is refreshed or invalidated.

Evidence: `retryApiRequest` (`Uti`) at `cli_inner_pretty.js:584948-585067`.

## 4. Stale transport recovery

### Fresh connection after pooled-socket failure

**What it does:** Prevents a retry from returning to a pooled keep-alive connection already proven
stale.

**How it works:**
1. A prior error is considered stale only when it is an SDK connection error whose normalized code
   belongs to the transient/stale set.
2. Before reconstructing the next client, the loop logs the stale condition.
3. It invokes the transport-level keep-alive disable latch.
4. Client reconstruction then obtains fresh transport options.
5. The retry still passes through ordinary delay and exhaustion policy.

**Why this approach:**
- Backoff alone is ineffective if the pool repeatedly hands out the same dead connection.
- Globally disabling keep-alive is more expensive than replacing one socket, but the SDK/agent layer
  may not expose reliable per-socket eviction.
- Applying the latch only after classified stale errors preserves pooling during healthy operation.

**Key insight:** A connection retry must change the failed resource. Retrying identical work on the
same stale pooled socket is not recovery.

Evidence: `bhS` and `Uti` at `cli_inner_pretty.js:584943-584978`.

## 5. Monotonic context-overflow repair

### Strictly shrinking `max_tokens` adjustment

**What it does:** Retries a request rejected because input plus requested output exceeds context, but
terminates if the computed correction cannot make progress.

**How it works:**
1. The retry classifier recognizes the exact 400 context-limit message and extracts input,
   requested output, and context limit.
2. It reserves 1,000 tokens and computes `contextLimit - inputTokens - 1000`, floored at zero.
3. Values below the 3,000 output-token floor are refused.
4. If a previous override exists and the new candidate is greater than or equal to it, the loop
   throws “adjustment made no progress.”
5. Otherwise it records the smaller override, emits telemetry, and retries without sleeping.
6. The adjusted override lives in retry-local request state and is applied by the next request
   build.

**Why this approach:**
- This is a deterministic request-shape correction, so exponential backoff adds no value.
- Reserving 1,000 tokens absorbs estimation/protocol overhead.
- The monotonic guard proves termination even when a gateway repeatedly reports inconsistent limits.
- A 3,000-token floor avoids producing an unusably tiny response merely to satisfy the API.

**Key insight:** The progress check is the termination proof. Without strict decrease, a parsed
context error can become an infinite no-delay retry loop.

Evidence: `eof` and the `Uti` correction branch at `cli_inner_pretty.js:585123-585143`,
`585247-585267`.

## 6. Delay computation and interruption

### Server-aware exponential backoff

**What it does:** Computes a jittered retry delay while respecting `Retry-After` and bounded
persistent-watchdog behavior.

**How it works:**
1. Base delay is 500 ms multiplied by `2^(attempt-1)` and capped at 32 seconds by default.
2. Positive jitter up to 25% prevents synchronized clients from retrying together.
3. Numeric `Retry-After` is converted to milliseconds and becomes a lower bound, not a replacement
   for client backoff.
4. Normal mode refuses a computed delay above 60 seconds and reports
   `tengu_api_retry_after_too_long`.
5. Retry-watchdog mode uses a separate persistent attempt counter and allows bounded delays up to six
   hours for eligible 429/overload cases.
6. Unified rate-limit reset timestamps may supply a more precise bounded wait.
7. Retry status includes error, attempt, maximum, deadline, and remaining delay.

**Why this approach:**
- Exponential backoff limits load; jitter prevents thundering herds.
- Treating server delay as a minimum honors explicit throttling even when local backoff is smaller.
- Interactive mode avoids appearing hung for minutes; supervised mode values eventual recovery.
- A finite six-hour cap prevents malformed headers from creating unbounded timers.

**Key insight:** Normal and watchdog delays optimize different things: responsiveness versus
survivability. They share classification but not the same give-up horizon.

Evidence: `Vqe`, `LhS`, `DhS`, and `Uti` at `cli_inner_pretty.js:585145-585209`,
`585230-585245`, `585395-585430`.

### Wakeable retry sleep

**What it does:** Lets state changes or user activity interrupt a long retry delay without conflating
that wake-up with request cancellation.

**How it works:**
1. Without a wake subscription, delay delegates to the normal abort-aware sleep.
2. With a subscription, the function creates a private `AbortController`.
3. The retry-wake callback records `woke=true` and aborts only the private sleep.
4. The outer request abort signal also aborts the sleep, but is checked afterward and throws the
   request abort error.
5. A retry wake returns `true`; the request loop can resume early.
6. The subscription and abort listener are removed in `finally`.
7. Persistent watchdog waits are split into bounded chunks so retry status and wake checks remain
   responsive.

**Why this approach:**
- Waking a timer is not the same as canceling the turn; separate controllers preserve that semantic
  distinction.
- Listener cleanup prevents hundreds of long-watchdog retries from accumulating callbacks.
- Chunking exposes updated countdown state and avoids one opaque multi-hour wait.

**Key insight:** The function returns the reason the sleep ended. That one bit prevents an early
wake from being misreported as user cancellation.

Evidence: `sleepUntilRetryOrWake` (`Wnf`) at `cli_inner_pretty.js:585210-585228` and its persistent
wait caller at `585173-585203`.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `retryApiRequest` (`Uti`) — complete request retry and recovery generator.
- `isRetryWatchdogEnabled` (`E8e`) — supervision policy switch.
- `isRetryableApiError` (`ChS`) — master retry classifier.
- `resolveMaxApiRetries` (`i_a`) — environment/default retry budget.
- `sleepUntilRetryOrWake` (`Wnf`) — interruptible retry delay.
- `computeRetryDelay` (`Vqe`) — jittered exponential/Retry-After delay.
