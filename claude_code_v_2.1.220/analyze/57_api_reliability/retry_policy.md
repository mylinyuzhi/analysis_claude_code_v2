# The request retry policy: budget, classification, and the two silent retries

> TARGET: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js` (872,596 lines).
> BASELINE: `…/2.1.193/extract/cli_inner_pretty.js`, always tagged **(193)**.
> Every bare `:<line>` below is a **2.1.220** line I read.

The whole retry machine lives in one module, `cli_inner_pretty.js:534500-535070`, and it did **not**
get rewritten in this window. Five surgical changes landed inside it:

| # | Change | Release | Proof literal | 220 / 193 |
|---|---|---|---|---|
| 1 | Retry **budget** becomes watchdog-aware: 10 → 300 and the clamp of 15 is lifted | `.199` | numeric constants `$U_/NU_/X9s` `:534989-534991` | see §1 |
| 2 | Transient 429s become retryable for subscribers via a **header-absence** predicate | `.199` | `$lp` `:534951-534953` | 1 / 0 |
| 3 | SSL **certificate** errors fail fast instead of consuming the budget | `.199` | `Gcs` `:228017` + `:534938` | see §3 |
| 4 | The context-overflow `max_tokens` adjustment gets a **monotonic-progress breaker** | `.218` | `max_tokens overflow adjustment made no progress` `:534721` | 1 / **0** |
| 5 | Two **new silent retries** in the query loop: effort-unsupported and refusal-continuation | `.212`-era | `retry:effort-unsupported` `:509943`; `tengu_convolute_arcades_retry` `:338267` | 1/0, 11/0 |

Everything else in this file — the exponential backoff `Z2e`, the `retry-after` honouring, the
`Blp` watchdog-eligibility predicate, the 6-hour cap, the fail-fast status set `{401,407,429,404,403,413}`
(`JU_` `:535065` vs `x5f` `:603330 (193)` — **byte-identical**) — is carryover. Do not write any of it up
as new.

---

## 1. The retry budget: `getMaxRetries` and its semantic rewrite

This is the `.199` bullet *"`CLAUDE_CODE_RETRY_WATCHDOG` now raises the default retry count to 300 and
lifts the cap of 15 on `CLAUDE_CODE_MAX_RETRIES`"*, and it is the single best example in this theme of
why literal-counting fails.

**Both env var names are pure carryover:**

| literal | 220 | 193 |
|---|---|---|
| `CLAUDE_CODE_RETRY_WATCHDOG` | 2 (`:32810`, `:534514`) | **2** (`:43731`, `:602804 (193)`) |
| `CLAUDE_CODE_MAX_RETRIES` | 5 (`:32814`, `:58163`, `:534956-534960`) | **4** (`:43735`, `:603210-603214 (193)`) |

A grep-only pass scores this bullet CARRYOVER and moves on. The change is **entirely in the numbers and
the branch structure**.

```javascript
// ============================================
// getMaxRetries - resolves the per-request retry budget; now watchdog-aware
// Location: cli_inner_pretty.js:534954-534967 (constants :534988-534991)
// ============================================

// ORIGINAL (for source lookup):
function Pqs() {
  let e = WUe();
  if (process.env.CLAUDE_CODE_MAX_RETRIES) {
    let t = Fd(process.env.CLAUDE_CODE_MAX_RETRIES);
    if (Number.isFinite(t) && t >= 0) {
      if (t > X9s && !e) {
        if (!Nlp) ((Nlp = !0), w(`CLAUDE_CODE_MAX_RETRIES=${t} clamped to ${X9s}`, { level: "warn" }));
        return X9s;
      }
      return t;
    }
  }
  return e ? NU_ : $U_;
}
var FUo = () => new xy(), $U_ = 10, NU_ = 300, X9s = 15, Dlp = 3000, ... Flp = 21600000, ... Nlp = !1;

// READABLE (for understanding):
function getMaxRetries() {
  let watchdogOn = isRetryWatchdogEnabled();                                   // CLAUDE_CODE_RETRY_WATCHDOG
  if (process.env.CLAUDE_CODE_MAX_RETRIES) {
    let requested = parseIntSafe(process.env.CLAUDE_CODE_MAX_RETRIES);
    if (Number.isFinite(requested) && requested >= 0) {
      if (requested > MAX_RETRIES_CLAMP && !watchdogOn) {                      // clamp applies ONLY when watchdog off
        if (!clampWarningEmitted) {
          clampWarningEmitted = true;
          debugLog(`CLAUDE_CODE_MAX_RETRIES=${requested} clamped to ${MAX_RETRIES_CLAMP}`, { level: "warn" });
        }
        return MAX_RETRIES_CLAMP;                                              // 15
      }
      return requested;                                                        // watchdog on -> honoured verbatim
    }
  }
  return watchdogOn ? WATCHDOG_DEFAULT_RETRIES : DEFAULT_RETRIES;              // 300 : 10
}
var DEFAULT_RETRIES = 10, WATCHDOG_DEFAULT_RETRIES = 300, MAX_RETRIES_CLAMP = 15,
    FLOOR_OUTPUT_TOKENS = 3000, MAX_RETRY_DELAY_MS = 21600000 /* 6 h */, clampWarningEmitted = false;

// Mapping: Pqs→getMaxRetries, WUe→isRetryWatchdogEnabled, Fd→parseIntSafe, w→debugLog,
//          $U_→DEFAULT_RETRIES, NU_→WATCHDOG_DEFAULT_RETRIES, X9s→MAX_RETRIES_CLAMP,
//          Nlp→clampWarningEmitted, Dlp→FLOOR_OUTPUT_TOKENS, Flp→MAX_RETRY_DELAY_MS
```

The 2.1.193 function it replaces:

```javascript
// ORIGINAL, 2.1.193 (cli_inner_pretty.js:603209-603221 (193); constants :603243-603244 (193)):
function O5f() {
  if (process.env.CLAUDE_CODE_MAX_RETRIES) {
    let e = parseInt(process.env.CLAUDE_CODE_MAX_RETRIES, 10);
    if (Number.isFinite(e) && e >= 0) {
      if (e > Ujo) {
        if (!pZl) ((pZl = !0), T(`CLAUDE_CODE_MAX_RETRIES=${e} clamped to ${Ujo}`, { level: "warn" }));
        return Ujo;
      }
      return e;
    }
  }
  return _5f;
}
var _5f = 10, Ujo = 15;
```

### The three differences, and why each matters

**What it does:** returns the number of retry attempts the request loop is allowed, from the env
override or a default.

**How it works — the diff, line by line:**

1. **`let e = WUe();` is new (`:534955`).** 193's resolver had *no knowledge of the watchdog at all*.
   The watchdog and the retry budget were independent knobs; now the watchdog is an input to the budget.
2. **The clamp gained a conjunct: `if (t > X9s && !e)` (`:534959`)** vs 193's `if (e > Ujo)`
   (`:603213 (193)`). Same constant (15), same warning string, but the clamp is now **conditional**.
   With `CLAUDE_CODE_RETRY_WATCHDOG` set, `CLAUDE_CODE_MAX_RETRIES=500` is honoured verbatim.
3. **The default became a ternary: `return e ? NU_ : $U_` (`:534966`)** vs 193's `return _5f;`
   (`:603220 (193)`). `$U_ = 10` is the same value as 193's `_5f = 10`; `NU_ = 300` is **new**
   (as a *value in this position* — the integer 300 obviously appears elsewhere).

**Why this approach:**

- **Why is 15 the clamp at all?** The clamp exists to stop a user-supplied number from turning a
  transient outage into an unbounded hang for the *interactive* case. With backoff base 500 ms
  doubling to a 32 s ceiling (`Z2e`, `:534820-534828`), 15 attempts is already ≈ 6 minutes of waiting.
  Beyond that, a human at a terminal wants the error, not more patience.
- **Why lift it only under the watchdog?** `CLAUDE_CODE_RETRY_WATCHDOG` is the *unattended* mode. Its
  companion predicate `Blp` (`:534516-534518`, `dSe(e) || (e instanceof hi && e.status === 429)`) is
  narrow on purpose: only **529 overloaded** and **429** get the unbounded treatment
  (`I = WUe() && Blp(b)` at `:534677`, then `if (_ > n && !I) throw` at `:534678`). Those two statuses
  are the *server saying "come back later"*, which is exactly the class where waiting is correct.
  Every other error class still exhausts the budget and throws.
- **Why 300 rather than `Infinity`?** Because the watchdog path already has a *time* bound —
  `Math.min(Z2e(l, H, zU_), Flp)` at `:534734`, capped at `Flp = 21600000` (6 hours, `:535003`) per
  sleep. 300 attempts is a **second, orthogonal** bound that protects against a pathological
  fast-failing error that the watchdog predicate wrongly admits (a 429 that returns instantly). It is a
  belt-and-braces number, not a computed one: it makes the loop terminate *eventually* without
  meaningfully shortening a legitimate multi-hour rate-limit wait.
- **Alternative not taken:** they could have made the clamp a `Math.max(15, …)`-style soft limit or
  read a second env var. Gating on an *existing* env var costs zero new surface, and it correctly
  couples "I am unattended" with "I tolerate long waits" — one intent, one switch.

**Key insight:** the interesting property is that `WUe()` is read **twice per retry decision** — once
here for the budget and once at `:534677` for loop-exit — plus five more times as a *suppressor* of
fail-fast paths (`:534613`, `:534625`, `:534645`, `:534669`, `:534736`). The watchdog is not a "retry
more" flag; it is a **"disable every give-up heuristic"** flag. Enumerated from the 220 source:

| Site | What the watchdog suppresses |
|---|---|
| `:534613` | model-not-found / permission-denied / 5xx → fallback-model switch |
| `:534625` | the usage-limit latch (`MIc(…)`) that parks the session until reset |
| `:534645` | `tengu_api_529_background_dropped` — dropping a 529 in a background session |
| `:534669` | `tengu_api_custom_529_overloaded_error` after `JBo = 3` (`:534993`) consecutive 529s |
| `:534736` | `tengu_api_retry_after_too_long` when the computed delay exceeds `VU_ = 60000` (`:535001`) |

All five `!WUe()` guards exist byte-for-byte in 193 (`:602972` region, `jHe()`); only the *budget*
coupling in §1 is new.

---

## 2. Transient 429s for subscribers — a header-absence predicate

> `.199`: *"Transient 429s (unrelated to your usage limit) are now retried with backoff for subscribers."*

**Verdict: NET_NEW, one function and two call sites.**

```javascript
// ============================================
// isTransientRateLimit - a 429 that carries no unified-rate-limit headers
// Location: cli_inner_pretty.js:534951-534953
// ============================================

// ORIGINAL (for source lookup):
function $lp(e) {
  return e.status === 429 && !uLu(e) && !e.headers?.get?.(tpo);
}

// READABLE (for understanding):
function isTransientRateLimit(err) {
  return err.status === 429 &&
    !hasUnifiedRateLimitHeaders(err) &&                                  // representative-claim / overage-status
    !err.headers?.get?.(HDR_OVERAGE_DISABLED_REASON);                    // overage-disabled-reason
}

// Mapping: $lp→isTransientRateLimit, uLu→hasUnifiedRateLimitHeaders,
//          tpo→HDR_OVERAGE_DISABLED_REASON ("anthropic-ratelimit-unified-overage-disabled-reason", :226595)
```

`uLu` (`:226587-226593`) tests for `anthropic-ratelimit-unified-representative-claim` **or**
`anthropic-ratelimit-unified-overage-status`. Both functions are unchanged in shape from 193 — `uLu`
has a 193 twin — but `$lp` itself is new and is spliced into the master classifier `n4_`
(`:534911-534950`) in exactly two places:

| Line (220) | 2.1.220 | 2.1.193 twin |
|---|---|---|
| `:534931` | `if (t === "true" && (!ii() \|\| zer() \|\| $lp(e))) return !0;` | `:603194 (193)` `if (t === "true" && (!Eo() \|\| pnt())) return !0;` |
| `:534947` | `if (e.status === 429) return !ii() \|\| zer() \|\| $lp(e);` | `:603205 (193)` `if (e.status === 429) return !Eo() \|\| pnt();` |

`ii()` (`:155431-155434`) is *"is this an OAuth subscription session"*; `zer()` (`:155499`) is
`getOrgType() === "enterprise"`. Both have byte-equivalent 193 twins (`Eo` `:136474 (193)`,
`pnt` `:136538 (193)`). So the pre-`.199` rule read: **retry a 429 only if you are NOT a subscriber, or
you are enterprise.**

### Why gate on *absent* headers rather than a status sub-code?

**What it does:** distinguishes "you hit your plan's usage limit" from "the edge is shedding load".
Both are HTTP 429.

**How it works:**

1. The usage-limit 429 is generated by the entitlement layer, which always attaches the unified
   rate-limit header trio (`representative-claim`, `overage-status`, and on refusal
   `overage-disabled-reason`). Those headers are what drives the session's usage-limit UI
   (`MIc(Date.now() + D, U)` at `:534638` parks the session until reset).
2. An infra 429 — a proxy, a gateway, a regional shed — is generated *before* entitlement runs and
   therefore carries none of them.
3. `$lp` therefore says: *429 with no entitlement fingerprint ⇒ nobody decided you were over quota
   ⇒ retry.*

**Why this approach:**

- **The alternative — a positive error-code test — was available and rejected.** The classifier
  already parses `e.error?.error?.details?.error_code === "credits_required"` at `:534915`, so the
  machinery for sniffing the body exists. But that only works for 429s Anthropic's own API produced.
  A 429 injected by a corporate proxy or an inference gateway has an arbitrary body and no error code
  at all — and it is precisely those that the bullet is about. **Absence of a known fingerprint is the
  only test that generalises to third-party intermediaries.**
- **Fail-safe direction.** If the server ever adds a usage-limit 429 *without* the headers, this
  predicate would retry a genuinely-capped request — bounded by the retry budget, and the retry gets
  the same 429, so the cost is a few backoff seconds and no incorrect state. The reverse mistake
  (treating an infra 429 as a usage limit) parks the entire session for hours behind a wrong "limit
  reached" banner. The asymmetry of the two failure modes justifies the asymmetric test.

**Key insight:** the *message* the user sees for this case is **carryover** —
`rey = "Server is temporarily limiting requests (not your usage limit)"` at `:228963` is 220=1 / 193=1.
2.1.193 could already *name* the condition; it just could not *retry* it for a subscriber. Anchoring
this bullet on its user-visible string yields "carryover" and misses the whole fix.

---

## 3. SSL certificate errors now fail fast

> `.199`: *"SSL cert errors now fail immediately with the fix hint instead of burning retries."*

**Verdict: DELTA — the hint is carryover, the fail-fast is new, and the mechanism is a set split.**

The hint text is unchanged: `ask IT to allowlist` 220=1 / 193=1, `NODE_EXTRA_CA_CERTS to your CA bundle
path` 220=1 / 193=1 (`:227914` vs `:237042 (193)`; the only textual edit is `Run /doctor` →
`` Run `claude doctor` ``). What changed is that 2.1.193 **retried through** a cert failure:

```javascript
// 2.1.193, inside the master retry classifier (cli_inner_pretty.js:603199 (193)):
if (e instanceof KI) return !0;        // ANY APIConnectionError -> retryable
```

```javascript
// ============================================
// isRetryableApiError (excerpt) - connection errors are now triaged, not blanket-retried
// Location: cli_inner_pretty.js:534936-534941
// ============================================

// ORIGINAL (for source lookup):
  if (e instanceof IO) {
    let r = HN(e);
    if (r && Gcs.has(r.code)) return !1;
    if (r?.code === "BedrockUnexpectedContentType") return !1;
    return !0;
  }

// READABLE (for understanding):
  if (err instanceof APIConnectionError) {
    let conn = unwrapConnectionDetails(err);                  // walks .cause up to 5 levels
    if (conn && CERT_ERROR_CODES.has(conn.code)) return false;          // deterministic -> never retry
    if (conn?.code === "BedrockUnexpectedContentType") return false;    // gateway misconfig -> never retry
    return true;                                                        // everything else -> retry
  }

// Mapping: IO→APIConnectionError, HN→unwrapConnectionDetails, Gcs→CERT_ERROR_CODES
```

### The set split is the real design change

2.1.193 had **one** SSL set, `d6d` (`:237141-237160 (193)`), 18 codes, used only to stamp
`isSSLError: true` on the connection details for message formatting. 2.1.220 splits it in two
(`:228017-228039`):

```javascript
Gcs = new Set([ 15 CERT_* / UNABLE_TO_* / HOSTNAME_MISMATCH / PATH_LENGTH_EXCEEDED codes ]);   // :228017-228033
UZg = new Set([ ...Gcs, "ERR_TLS_HANDSHAKE_TIMEOUT",
                        "ERR_SSL_WRONG_VERSION_NUMBER",
                        "ERR_SSL_DECRYPTION_FAILED_OR_BAD_RECORD_MAC" ]);                      // :228034-228039
```

`UZg` is the old 18-code set verbatim (it is what `HN` consults for `isSSLError` at `:227897`, and what
the message switch at `:227954-227974` branches on). `Gcs` is the **new 15-code subset**, and it is the
only one wired into the retry decision.

**Why split rather than fail fast on all 18?**

The three codes left out are the three that are **not deterministic**:

| Excluded code | Why it must stay retryable |
|---|---|
| `ERR_TLS_HANDSHAKE_TIMEOUT` | a slow/loaded network path — the next attempt often succeeds |
| `ERR_SSL_WRONG_VERSION_NUMBER` | classically a captive portal / transparent proxy returning plaintext HTTP on a TLS socket; transient at coffee-shop Wi-Fi |
| `ERR_SSL_DECRYPTION_FAILED_OR_BAD_RECORD_MAC` | a corrupted record on the wire — a genuinely transient framing error |

The 15 in `Gcs` are all **verdicts of the certificate validator**: expired, revoked, self-signed,
untrusted, hostname mismatch, chain too long. Re-issuing the identical TLS handshake to the identical
endpoint produces the identical verdict. Retrying them is pure latency — with the default budget of 10
and the 500 ms→32 s backoff, a user behind a TLS-intercepting corporate proxy waited **≈ 2 minutes**
before seeing the `NODE_EXTRA_CA_CERTS` hint that was going to be shown all along.

**Key insight:** this is a *taxonomy* change, not a control-flow change. The `if` at `:534938` is one
line; the engineering is in deciding which 15 of 18 codes are decisions and which 3 are accidents.
Note also the ordering: the `Gcs` check sits **inside** the `instanceof IO` arm and **before** the
`return !0` fallthrough, so an SSL error is classified before any status-code logic — correct, because
a TLS failure has no HTTP status to classify by.

`HN` (`unwrapConnectionDetails`, `:227888-227906`) is worth noting: it walks `.cause` up to
`r = 5` levels looking for a string `code`, because Node/undici/Bun bury the OpenSSL code several
wrappers deep. It also special-cases `jZg = "The socket connection was closed unexpectedly"`
(`:228014`) into a synthetic `ConnectionClosed` code — a Bun-ism with no `code` property. Both are
carryover (`uF` `:237016 (193)`, `p6d` `:237139 (193)`).

---

## 4. The `.218` doomed-retry loop — the sharpest find in this module

> `.218`: *"Fixed a retry loop that re-sent doomed requests after a context overflow when the thinking
> budget was large."*

**Verdict: NET_NEW, and it is a two-part fix to a provable infinite-ish loop in 2.1.193.**

Proof literal: `max_tokens overflow adjustment made no progress` **220=1 (`:534721`) / 193=0**.

### The 2.1.193 bug

When the API returns HTTP 400 `input length and \`max_tokens\` exceed context limit: A + B > C`, the
loop does not give up: it parses the three numbers (`jlp` `:534829-534856`, twin `gZl` `:603...(193)`),
recomputes a smaller `max_tokens`, sets `o.maxTokensOverride`, and `continue`s.

```javascript
// 2.1.193 (cli_inner_pretty.js:602996-603009 (193)):
let { inputTokens: R, contextLimit: P } = k,
  O = 1000,
  D = Math.max(0, P - R - 1000);                                          // availableContext
if (D < jjo) throw (ke(Error(`availableContext ${D} is less than FLOOR_OUTPUT_TOKENS ${jjo}`)), b);
let M = (o.thinkingConfig.type === "enabled" ? o.thinkingConfig.budgetTokens : 0) + 1,
  U = Math.max(jjo, D, M);                                                //  <-- the bug
((o.maxTokensOverride = U),
  V("tengu_max_tokens_context_overflow_adjustment", { inputTokens: R, contextLimit: P, adjustedMaxTokens: U, attempt: g }));
continue;
```

`U = Math.max(FLOOR_OUTPUT_TOKENS, availableContext, thinkingBudget + 1)`. The third term is the
killer. The Anthropic API requires `max_tokens > thinking.budget_tokens`, so 193 floors the adjusted
value at `budgetTokens + 1` to keep the request *well-formed*. But if `budgetTokens` is large — say
`thinking.budget_tokens = 60000` on a near-full context — then `M = 60001` dominates both `jjo = 3000`
and `D`, and `U = 60001` **is not smaller than the `max_tokens` that just failed**. The loop:

1. sends the request → 400 context-limit
2. computes `U = 60001`, identical to last round
3. `continue` → sends a byte-identical doomed request
4. …until the budget (10, or **300** under the watchdog) is exhausted.

That is the changelog's "re-sending doomed requests", and it explains why the bullet names the large
thinking budget specifically: with a small budget, `D` wins the `Math.max` and the loop *does* converge.

### The 2.1.220 fix

```javascript
// ============================================
// contextOverflowMaxTokensAdjustment - shrink max_tokens after a 400 context-limit, with a progress breaker
// Location: cli_inner_pretty.js:534712-534731
// ============================================

// ORIGINAL (for source lookup):
        if (b instanceof hi) {
          let M = jlp(b);
          if (M) {
            let { inputTokens: $, contextLimit: D } = M,
              U = 1000,
              W = Math.max(0, D - $ - 1000);
            if (W < Dlp) throw (xe(Error(`availableContext ${W} is less than FLOOR_OUTPUT_TOKENS ${Dlp}`)), b);
            let q = W;
            if (o.maxTokensOverride !== void 0 && q >= o.maxTokensOverride)
              throw (xe(Error("max_tokens overflow adjustment made no progress")), b);
            ((o.maxTokensOverride = q),
              O("tengu_max_tokens_context_overflow_adjustment", {
                inputTokens: $, contextLimit: D, adjustedMaxTokens: q, attempt: _,
              }));
            continue;
          }
        }

// READABLE (for understanding):
        if (err instanceof APIError) {
          let overflow = parseMaxTokensContextLimitError(err);            // 400 + regex on the message
          if (overflow) {
            let { inputTokens, contextLimit } = overflow,
              availableContext = Math.max(0, contextLimit - inputTokens - 1000);   // 1000-token safety margin
            if (availableContext < FLOOR_OUTPUT_TOKENS)                             // 3000
              throw reportError(Error(`availableContext ${availableContext} is less than FLOOR_OUTPUT_TOKENS ${FLOOR_OUTPUT_TOKENS}`)), err;
            let adjusted = availableContext;                                        // thinking-budget floor REMOVED
            if (requestOpts.maxTokensOverride !== undefined && adjusted >= requestOpts.maxTokensOverride)
              throw reportError(Error("max_tokens overflow adjustment made no progress")), err;   // monotonic breaker
            requestOpts.maxTokensOverride = adjusted;
            emitTelemetry("tengu_max_tokens_context_overflow_adjustment", { … , attempt });
            continue;
          }
        }

// Mapping: jlp→parseMaxTokensContextLimitError, hi→APIError, xe→reportError, Dlp→FLOOR_OUTPUT_TOKENS,
//          W/q→availableContext/adjusted, o→requestOpts
```

**What it does:** shrinks `max_tokens` to whatever the context window actually leaves, and refuses to
loop if that shrink is not strictly a shrink.

**How it works:**

1. `availableContext = max(0, contextLimit − inputTokens − 1000)`. Unchanged from 193, including the
   undead `let U = 1000` / `let O = 1000` binding that is never read in either build — the literal
   `1000` is inlined instead. (Dead code preserved across a rewrite is a good fingerprint that this
   region was hand-edited, not regenerated.)
2. **Floor check first:** if fewer than `Dlp = 3000` (`:534992`) output tokens are left, there is no
   useful response to be had — throw the original error immediately. Ordering matters: this runs
   *before* the progress check so that the user gets the informative `availableContext … is less than
   FLOOR_OUTPUT_TOKENS` diagnostic rather than the generic no-progress one.
3. **The thinking-budget floor is deleted.** `q = W` — nothing but `availableContext`. The API-level
   constraint `max_tokens > budget_tokens` is now the *caller's* problem, enforced upstream where the
   thinking config is built, not patched here in the error path.
4. **Monotonic-progress breaker.** `if (o.maxTokensOverride !== void 0 && q >= o.maxTokensOverride) throw`.
   The `!== void 0` guard makes the *first* adjustment always allowed — the breaker only ever compares
   against a value this same loop set.

**Why this approach:**

- **Why delete the floor instead of taking `Math.min`?** Because `Math.min(availableContext, budget+1)`
  would produce a well-formed but *useless* request (fewer output tokens than the thinking budget
  demands), and `Math.max` produces a doomed one. There is no arithmetic that rescues the case; the
  right answer is to stop and tell the caller, which is what the breaker does.
- **Why a breaker at all, if the floor is gone?** Defence in depth against a *server-side* shape the
  client cannot predict — e.g. an API that returns the same `contextLimit` after the client shrinks
  (a gateway that rewrites the request), or a rounding path where `availableContext` is stable. The
  breaker converts any such non-convergence into one extra round-trip instead of `n` of them. This
  matters much more after §1: under the retry watchdog the budget is **300**, so a non-converging loop
  is 30× more expensive than it was.
- **Why `>=` and not `>`?** Equality is the exact failure mode observed (the 193 loop recomputed the
  identical number). `>` would let it through forever.

**Key insight:** the two halves fix *different* failure modes and both were needed. Removing the
thinking floor fixes the reported bug; the breaker makes the whole adjustment loop **provably
terminating** regardless of what the server sends back. That is the difference between a bug fix and a
correctness fix, and the changelog only describes the first.

---

## 5. `tengu_api_retry_after_too_long` and `tengu_effort_unsupported_retry`

### 5.1 `tengu_api_retry_after_too_long` — CARRYOVER

220=1 (`:534738`) / **193=1** (`:603019 (193)`). Both sites are structurally identical:

```javascript
else if (((L = Z2e(_, H)), !WUe() && L > VU_))                     // 220 :534736,  VU_ = 60000 :535001
  throw (O("tengu_api_retry_after_too_long", { delayMs: L, status: b.status, provider: ZQ() }), …);

else if (((x = AX(g, C)), !jHe() && x > T5f))                      // 193 :603017,  T5f = 60000 :603252
  throw (V("tengu_api_retry_after_too_long", { delayMs: x, status: b.status, provider: T2() }), …);
```

The rule — *if the server's `Retry-After` (or our backoff) exceeds 60 s and we are not in watchdog mode,
give up rather than block the user for a minute* — pre-dates this window. Report it as context, not as
a delta. The one thing worth stating: this is the fail-fast that `CLAUDE_CODE_RETRY_WATCHDOG`
disables, and it is why the watchdog's 6-hour per-sleep cap (`Flp`, `:535003`) is reachable at all.

### 5.2 `tengu_effort_unsupported_retry` — NET_NEW

220=1 (`:509942`) / 193=0. This is a **query-loop** retry, not a request-loop retry: it lives in the
streaming generator's `onRequestError`-style handler table and returns a *retry token string* that the
outer loop interprets.

```javascript
// ============================================
// handleEffortUnsupported - latch off output_config.effort for a model that rejects it, then retry
// Location: cli_inner_pretty.js:509935-509945
// ============================================

// ORIGINAL (for source lookup):
    hd = (Ho) => {
      if (!Apo(Ho)) return null;
      if ((EFn(i.model), u !== i.model)) EFn(u);
      return (
        w(`[effort] model ${i.model} rejected output_config.effort; latching unsupported and retrying without it.`,
          { level: "warn" }),
        O("tengu_effort_unsupported_retry", { model: Bu(i.model) }),
        "retry:effort-unsupported"
      );
    },

// READABLE (for understanding):
    handleEffortUnsupported = (err) => {
      if (!isEffortUnsupportedError(err)) return null;         // not our error -> let another handler try
      latchEffortUnsupported(opts.model);                      // remember for the rest of the session
      if (fallbackModel !== opts.model) latchEffortUnsupported(fallbackModel);
      debugLog(`[effort] model ${opts.model} rejected output_config.effort; latching unsupported and retrying without it.`,
               { level: "warn" });
      emitTelemetry("tengu_effort_unsupported_retry", { model: scrubModelId(opts.model) });
      return "retry:effort-unsupported";                       // token consumed by the query loop
    },

// Mapping: hd→handleEffortUnsupported, Apo→isEffortUnsupportedError, EFn→latchEffortUnsupported,
//          Bu→scrubModelId, w→debugLog, O→emitTelemetry
```

The detector `Apo` (`:228417-228423`) is a **two-shape** message matcher:

```javascript
function Apo(e) {
  if (!(e instanceof hi) || e.status !== 400) return !1;
  if (wpo(e) !== null) return !1;
  let t = e.message.toLowerCase();
  if (t.includes("effort parameter") && t.includes("not support")) return !0;
  return t.includes("output_config") && t.includes("extra inputs are not permitted");
}
```

`extra inputs are not permitted` is **220=1 / 193=0** — the second shape is new, and it is the
*Pydantic* rejection an older API build (or a gateway with a stale schema) emits when it receives an
`output_config` key it has never heard of. The first shape is the API's own polite refusal.

**Why two shapes, and why latch?** Because the two producers are different: shape 1 comes from a
current API that knows about effort and refuses it for this model; shape 2 comes from an endpoint
that does not know the field exists at all. Latching (`EFn`) — for both the primary *and* the fallback
model, `:509938` — makes this a **once-per-session** cost rather than once per turn. The `wpo(e) !== null`
early-out at `:228419` is an ordering guard: if the 400 is *also* something else recognisable, that
other classifier wins, so a single 400 is never handled twice.

---

## 6. `tengu_convolute_arcades_*` — what the unexplained family actually is

**Conclusion: `convolute_arcades` is the feature-flag name for the SILENT REFUSAL-FALLBACK
CONTINUATION RETRY.** It has nothing to do with web search or web fetch, which is where the `.212`
scoping pass placed it. The three events instrument the retry that happens when the API returns
`stop_reason: "refusal"` mid-turn and the client transparently re-runs the turn on a fallback model
instead of showing the "Switch models when a message is flagged" dialog.

**Counts: `convolute_arcades` 220=11 / 193=0** — every site is new.

### The evidence chain

| # | Site | What it proves |
|---|---|---|
| 1 | `:121244` `idg = "convolute_arcades"` | It is a **string key**, declared in a `var` block whose neighbours are `_2c = "x-is-refusal-fallback"`, `b2c = "x-cc-fallback-latched-by"`, `e6i = "x-cc-fallback-from-model"`, `t6i = "x-cc-fallback-category"`, `r6i = "x-cc-fallback-trigger"`, `n6i = "x-cc-original-request-id"` (`:121245-121250`), plus `c2c = "claude-opus-4-8"` / `rdg = "claude-opus-5"` (`:121231-121232`) and the cyber-safeguard support URLs. **This is the refusal-fallback module.** |
| 2 | `:121073-121075` `function hit() { return Jx()?.[idg] === !0; }` | It is read from `Jx()` — the **client-data / flag-settings cache** (`:536953-536962`, reads `clientDataCacheSlots` keyed by account). So it is a **server-pushed org flag**, not a GrowthBook `tengu_*` gate and not an env var. |
| 3 | `:121084-121086` `function S2c() { return Jx()?.convolute_arcades === !0; }` | A **second**, independent reader of the same key that inlines the string instead of using `idg`. Two accessors for one flag in one module is a strong tell that the feature was bolted on in two places at different times. |
| 4 | `:228855` `convolute_arcades: hit()` | The flag is stamped into an error/telemetry payload in the API-error module. |
| 5 | `:510104`, `:510989` `{ convolute_arcades: hit(), armed: bs !== void 0, model_scope: fe(Ade(i.model)) }` | Emitted alongside a `refusal_no_fallback` yield with skip reasons `sync_silent_stood`, `server_chain_exhausted`, `client_chain_exhausted`, `disabled_by_config`, `not_armed` (`:510095-510103`). Confirms it gates a **fallback arming** decision. |
| 6 | `:338267` `O("tengu_convolute_arcades_retry", {…})` | Fires in the `if (Je)` arm — the *silent* branch — of the refusal-fallback handler, carrying `continuation`, `had_partial_text`, `partial_text_chars`, `salvaged_tool_use_count`, `armed_at_trigger: mr.silentArmAtTrigger === !0`. The `else` arm (`:338282`) fires the **pre-existing** `tengu_refusal_fallback_triggered` (220=2 / **193=2**). |
| 7 | `:338460` / `:338518` `tengu_convolute_arcades_retry_outcome` | `outcome: "merged" \| "no_text"` on the clean path, `"error"` in the `catch`. |
| 8 | `:331736` `tengu_convolute_arcades_tools` inside `non(executor, lane, {silent})` | The `if (r?.silent)` arm; the `else` arm emits the pre-existing `tengu_fallback_sweep_tools`. Reports `aborted / completedBeforeEvent / queuedNeverStarted / compensated_removes` — the in-flight **tool calls that had to be discarded** when the turn was restarted. |
| 9 | `:838180` (SDK event schema) | The decisive one. Verbatim: *"@internal Emitted when a silent refusal-continuation retry begins ('begin' with salvage_text to keep visible in the streaming preview) or ends ('end'). From internal QueryEvent 'refusal_continuation'."* |

### What the mechanism does

1. The model's response comes back with `stop_reason: "refusal"` and `stop_details.category`
   (`cyber`, etc.). Partial text and partial tool_use blocks may already have been streamed.
2. `E2c(He)` (`:338217`) computes a **salvage record**: `partialTextChars`, `toolUseCount`,
   `hadEmptyInputToolUse`, `salvageText`, `skipReason`.
3. `Je` — the silent-mode boolean — decides the branch. In the visible branch the user gets a dialog
   and the model switch is announced. In the **silent** branch (`convolute_arcades`), the client:
   - switches `mainLoopModel` to `mr.fallbackModel` (`:338255-338264`) and adjusts fast mode;
   - tombstones every message from the refused attempt (`:338294-338295`);
   - **aborts and compensates in-flight tool calls** via `non(…, "refusal_retry", { silent: Je })`
     (`:338297`), which is where `tengu_convolute_arcades_tools` fires;
   - yields `{ type: "refusal_continuation", phase: "begin", salvageText: po }` (`:338301`) so the UI
     keeps the salvaged prefix on screen while the retry runs;
   - re-issues the turn, then yields `phase: "end"` and records the outcome.
4. `po = Je && oo === void 0 ? ur.salvageText : void 0` (`:338221`) — the continuation text is only
   used when there is **no skip reason**. `oo` is computed at `:338220` as
   `!isMainRepl ? "surface" : sessionLatched ? "session_latch" : salvage.skipReason` — so a
   non-interactive surface never gets a silent continuation, and a session that already latched a
   fallback does not stack another.

### Why the retry is silent — and why the flag is server-side

**Why this approach:** a refusal is a *server policy* event, and the correct client behaviour depends
on policy that changes faster than releases. Making it visible (193's only behaviour) means every
false-positive safety flag interrupts the user with a modal about switching models. Making it silent
means the turn just… continues, on a different model, with the already-produced prefix preserved.
Anthropic clearly wanted to A/B and ramp that, which is exactly why the switch is in `Jx()`
(server-pushed per-account client data) rather than a `tengu_*` GrowthBook gate or a settings key —
`Jx()`'s value is cached per `clientDataCacheSlots` account slot (`:536958-536959`), so it can differ
per user without a client change.

**Why the obfuscated name?** `convolute_arcades` is a two-word codename in the same family as
`tengu_hazel_trellis` (subagent depth) and `tengu_brindle_causeway` (MCP v2) elsewhere in this build.
Codenaming a flag whose literal string ships in a public binary hides the feature's *intent* from
anyone reading `strings` on the bundle, while the surrounding constants (`x-is-refusal-fallback`,
`x-cc-fallback-category`) give it away to anyone reading the code. This is why the changelog has no
bullet for it and why the scoping pass mis-filed it.

**Why three separate events instead of fields on one?** They fire at three different lifetimes and in
three different modules: `_retry` at the decision point in the query loop (`:338267`), `_outcome` at
turn end *and* in the `catch` (`:338460` / `:338518`, so an errored continuation is still counted),
`_tools` inside the tool-executor sweep (`:331736`, a different module entirely). Merging them would
require threading state across module boundaries for no analytical gain.

### The correction this forces on the scoping pass

[`_scope_v211_214.md:134-135`](../00_overview/_scope_v211_214.md) attributes
`tengu_convolute_arcades_retry` / `_outcome` to the two `.212` **web search / web fetch** bullets
(*"returning 'API Error' text as results"* and *"retry 529 and rate-limited requests with bounded
backoff"*), rating the second NET_NEW / RICH on that anchor. That attribution is wrong: the events sit
at `:331736` / `:338267` / `:338460` / `:338518`, all inside the query loop and the streaming tool
executor, and none of the web-tool handling (`web_search_tool_result` at `:326888`, `:403511`,
`:532316`; `web_fetch_tool_result` at `:326889`, `:327606`, `:532321`) is in that call graph. The real
`.212` web-tool anchor is the `KW` prefix widening — see
[`transport_errors.md`](transport_errors.md) §5.

---

## 7. `subscribeRetryWake` — an undocumented addition

**220=9 / 193=0.** The retry sleep is no longer a plain `await sleep(ms)`:

```javascript
// ============================================
// sleepUntilRetryOrWake - interruptible retry sleep; returns true if woken early
// Location: cli_inner_pretty.js:534800-534816
// ============================================

// ORIGINAL (for source lookup):
async function Plp(e, t) {
  if (!t.subscribeRetryWake) return (await vr(e, t.signal, { abortError: FUo }), !1);
  if (t.signal?.aborted) throw FUo();
  let r = !1, n = new AbortController(),
    o = t.subscribeRetryWake(() => { ((r = !0), n.abort()); }),
    i = () => n.abort();
  t.signal?.addEventListener("abort", i, { once: !0 });
  try {
    if ((await vr(e, n.signal), t.signal?.aborted)) throw FUo();
    return r;
  } finally { (o(), t.signal?.removeEventListener("abort", i)); }
}

// READABLE (for understanding):
async function sleepUntilRetryOrWake(delayMs, reqOpts) {
  if (!reqOpts.subscribeRetryWake) { await sleep(delayMs, reqOpts.signal, { abortError: makeAbortError }); return false; }
  if (reqOpts.signal?.aborted) throw makeAbortError();
  let woken = false, wakeController = new AbortController(),
    unsubscribe = reqOpts.subscribeRetryWake(() => { woken = true; wakeController.abort(); }),
    forwardAbort = () => wakeController.abort();
  reqOpts.signal?.addEventListener("abort", forwardAbort, { once: true });
  try {
    await sleep(delayMs, wakeController.signal);
    if (reqOpts.signal?.aborted) throw makeAbortError();
    return woken;
  } finally { unsubscribe(); reqOpts.signal?.removeEventListener("abort", forwardAbort); }
}

// Mapping: Plp→sleepUntilRetryOrWake, vr→sleep, FUo→makeAbortError, t→reqOpts, r→woken, o→unsubscribe
```

Its callers matter: the long-wait loop at `:534757-534775` sleeps in `KU_ = 30000` (`:535004`) slices
and `if (await Plp($, r)) break;` — **a wake cancels the remaining wait immediately**. The subscription
is threaded down from the app state (`:396609` `subscribeRetryWake: re.subscribe`) through the query
options (`:337941`, `:344586`, `:509187`, `:510292`, `:511497`, `:511594`).

**Why it exists:** under the watchdog a 429 can park the loop for up to 6 hours (`Flp`). Without a wake
channel, an event that *invalidates the reason for waiting* — a plan upgrade, a usage-limit reset
arriving early, the user switching models — could not shorten it. The 30 s slicing exists so that even
callers **without** a wake subscription re-render the countdown UI (`onRetryStatus`, `:534762-534769`)
twice a minute. Note the ordering subtlety in the `finally`: `unsubscribe()` runs before the listener
removal, so a wake firing during teardown cannot resurrect an aborted controller.

No changelog bullet mentions this. It is the plumbing that makes §1's 300-retry budget survivable.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_api_reliability.md](../00_overview/symbol_additions_v2_1_220_api_reliability.md).

Key functions in this document:
- `getMaxRetries` (`Pqs`, `:534954`) - watchdog-aware retry budget; 10 / 300 / clamp 15
- `isRetryWatchdogEnabled` (`WUe`, `:534513`) - reads `CLAUDE_CODE_RETRY_WATCHDOG`; 7 call sites
- `isWatchdogRetryableError` (`Blp`, `:534516`) - 529-or-429 predicate that unbounds the loop
- `isRetryableApiError` (`n4_`, `:534911`) - the master retry classifier
- `isTransientRateLimit` (`$lp`, `:534951`) - 429 without unified rate-limit headers
- `hasUnifiedRateLimitHeaders` (`uLu`, `:226587`) - the header-presence test `$lp` negates
- `unwrapConnectionDetails` (`HN`, `:227888`) - 5-level `.cause` walk producing `{code, message, isSSLError}`
- `CERT_ERROR_CODES` (`Gcs`, `:228017`) - 15 fail-fast certificate codes
- `SSL_ERROR_CODES` (`UZg`, `:228034`) - `Gcs` + 3 transient TLS codes; drives `isSSLError`
- `buildSSLCertHint` (`Qlt`, `:227911`) - the `NODE_EXTRA_CA_CERTS` fix hint (carryover text)
- `parseMaxTokensContextLimitError` (`jlp`, `:534829`) - the 400 context-limit regex parser
- `computeRetryDelay` (`Z2e`, `:534820`) - exponential backoff with 25 % jitter and `retry-after` floor
- `sleepUntilRetryOrWake` (`Plp`, `:534800`) - interruptible retry sleep, 30 s slices
- `readRetryAfterHeader` (`Ulp`, `:534817`) - `retry-after` accessor
- `readUnifiedResetHeader` (`c4_`, `:534979`) - `anthropic-ratelimit-unified-reset` → ms, capped at 6 h
- `isEffortUnsupportedError` (`Apo`, `:228417`) - two-shape 400 detector for `output_config.effort`
- `isConvoluteArcadesEnabled` (`hit`, `:121073`) - reads flag key `convolute_arcades` from `Jx()`
- `isConvoluteArcadesEnabledInline` (`S2c`, `:121084`) - the duplicate accessor
- `getClientDataFlags` (`Jx`, `:536953`) - per-account server-pushed flag cache
- `sweepInFlightToolsForFallback` (`non`, `:331733`) - silent/visible tool-abort sweep
- `CONVOLUTE_ARCADES_FLAG_KEY` (`idg`, `:121244`) - `"convolute_arcades"`
- `RETRYABLE_STATUS_CODES` (`JU_`, `:535065`) - `{401,407,429,404,403,413}` (carryover)
