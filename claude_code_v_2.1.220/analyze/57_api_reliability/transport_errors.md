# Transport error classification: four code sets, one sweep, and three message repairs

> TARGET: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js` (872,596 lines).
> BASELINE: `…/2.1.193/extract/cli_inner_pretty.js`, always tagged **(193)**.

Every transport decision in Claude Code — retry / fail-fast / keep-partial / disable-keep-alive /
"you are offline" — bottoms out in a **set membership test on a Node error `code` string**. The sets
are the API surface of the reliability layer, and this window changed all of them in a coordinated way.
This document is organised around the sets, because that is how the code is organised.

---

## 1. The four API-side sets, before and after

All four are declared in one module initializer, `:228010-228060` (193 twin `:237136-237173 (193)`).

| Set (220) | Members | Consumers | Set (193) | Members |
|---|---|---|---|---|
| `Gcs` `:228017` | **15** cert-validation codes | retry fail-fast `:534938` | — | **did not exist** |
| `UZg` `:228034` | `...Gcs` + 3 transient TLS codes = **18** | `isSSLError` stamp `:227897`; message switch `:227954` | `d6d` `:237141 (193)` | the same **18**, flat |
| `Wie` `:228040` | **10** network-down codes | `isNetworkDown` `:227909`; keep-partial `:511176`; cause `:511271` | `wat` `:237161 (193)` | **9** |
| `qie` `:228052` | **7** retryable/stale codes | stale-connection `:511175`, `:534522`; error taxonomy `:227886` | `Sce` `:237172 (193)` | **4** |

Two structural changes and one membership sweep:

**(a) The SSL set was split.** 193 had one 18-code set used only for *labelling*. 220 carves out the
15 codes that represent a *certificate verdict* (`Gcs`) and leaves the 3 transient TLS codes
(`ERR_TLS_HANDSHAKE_TIMEOUT`, `ERR_SSL_WRONG_VERSION_NUMBER`,
`ERR_SSL_DECRYPTION_FAILED_OR_BAD_RECORD_MAC`) out of it, then wires only `Gcs` into the retry
decision. The full rationale — why exactly those three stay retryable — is in
[`retry_policy.md`](retry_policy.md) §3.

**(b) `qie` (the retryable set) nearly doubled.**

```javascript
// 2.1.193 (cli_inner_pretty.js:237172 (193)):
Sce = new Set(["ECONNRESET", "EPIPE", "ConnectionClosed", "StreamSuspended"]);

// 2.1.220 (cli_inner_pretty.js:228052-228060):
qie = new Set(["ECONNRESET", "EPIPE", "ConnectionClosed",
               "ETIMEDOUT", "ECONNABORTED", "ERR_SOCKET_CLOSED",     // <-- three new
               "StreamSuspended"]);
```

**(c) `Wie` (network-down) gained `ERR_PROXY_TUNNEL`** — the code Node/undici raises when a
`CONNECT` to an HTTP proxy fails.

---

## 2. `.214` — "Socket is closed" behind Windows corporate proxies

> `.214`: *"Fixed streaming turns failing with 'Socket is closed' behind corporate proxies on Windows."*

**Verdict: NET_NEW — and it *is* anchorable, contrary to the scoping pass.**

[`_scope_v211_214.md:198`](../00_overview/_scope_v211_214.md) files this UNANCHORED/THIN on the grounds
that `Socket is closed` is 220=0 / 193=0 and "the message comes from the runtime, not the bundle".
The first half is correct; the conclusion is not. `Socket is closed` is the *message*; the client never
matches on messages for transport errors — it matches on `err.code`, and the code for that message is
**`ERR_SOCKET_CLOSED`**, which is **220=4 / 193=0**.

It is not one addition. `ERR_SOCKET_CLOSED` and `ERR_PROXY_TUNNEL` were added **together, to four
independent retryable-code sets in four different subsystems**:

| Site (220) | Set | Subsystem | 193 twin | 193 members → 220 members |
|---|---|---|---|---|
| `:228052-228060` | `qie` | **API transport** | `Sce` `:237172 (193)` | 4 → 7 (+`ETIMEDOUT`, `ECONNABORTED`, `ERR_SOCKET_CLOSED`) |
| `:228040-228051` | `Wie` | API transport (network-down) | `wat` `:237161 (193)` | 9 → 10 (+`ERR_PROXY_TUNNEL`) |
| `:281623-281631` | `Lyy` | **claude.ai MCP connector** | — | 7 members incl. both new codes |
| `:283117-283134` | `vZr` | **MCP client** | `cso` `:281311-281319 (193)` | 8 → 11 (+`ECONNABORTED`, `ERR_SOCKET_CLOSED`, `ERR_PROXY_TUNNEL`) |
| `:547506-547514` | `_W_` | **background/remote bridge** | `hBf` `:570362 (193)` | 5 → 8 (+`ECONNABORTED`, `ERR_SOCKET_CLOSED`, `ERR_PROXY_TUNNEL`) |

```javascript
// ============================================
// Retryable-code sets: the coordinated ERR_SOCKET_CLOSED / ERR_PROXY_TUNNEL sweep
// Location: cli_inner_pretty.js:283117-283135 (MCP) and :547506-547514 (bridge)
// ============================================

// ORIGINAL, MCP client (for source lookup):
    (vZr = new Set([
      "ECONNREFUSED", "ETIMEDOUT", "ECONNRESET", "ECONNABORTED", "ENOTFOUND", "ENETUNREACH",
      "EAI_AGAIN", "ConnectionRefused", "ConnectionClosed", "FailedToOpenSocket",
      "ERR_SOCKET_CLOSED", "ERR_PROXY_TUNNEL",
    ])),
    (pSs = new Set(["500", "502", "503", "504", ...vZr, "23", "CLI_OWNED_BEARER_REJECTED"]));

// ORIGINAL, 2.1.193 twin (cli_inner_pretty.js:281311-281320 (193)):
    (cso = new Set([
      "ECONNREFUSED", "ETIMEDOUT", "ECONNRESET", "ENOTFOUND", "EAI_AGAIN",
      "ConnectionRefused", "ConnectionClosed", "FailedToOpenSocket",
    ])),
    (uso = new Set(["500", "502", "503", "504", ...cso, "23"]));

// ORIGINAL, background/remote bridge (cli_inner_pretty.js:547506-547514):
  _W_ = new Set([
    "ECONNREFUSED", "ECONNRESET", "ETIMEDOUT", "ECONNABORTED",
    "ENETUNREACH", "EHOSTUNREACH", "ERR_SOCKET_CLOSED", "ERR_PROXY_TUNNEL",
  ]);

// ORIGINAL, its 2.1.193 twin (cli_inner_pretty.js:570362 (193)):
  hBf = new Set(["ECONNREFUSED", "ECONNRESET", "ETIMEDOUT", "ENETUNREACH", "EHOSTUNREACH"]);

// Mapping: vZr→MCP_RETRYABLE_CODES, pSs→MCP_RETRYABLE_CODES_AND_STATUSES, _W_→BRIDGE_RETRYABLE_CODES,
//          Lyy→CLAUDEAI_MCP_RETRYABLE_CODES, qie→API_TRANSIENT_CODES, Wie→NETWORK_DOWN_CODES
```

### Why the fix is a set-membership sweep and not a proxy-specific branch

**What it does:** classifies two Node error codes that a proxied Windows client sees and a direct
Unix client does not.

**How it works:**

1. **`ERR_SOCKET_CLOSED`** is raised by Node when a write is attempted on a socket that has already
   been destroyed. Direct TLS to `api.anthropic.com` almost never produces it: the peer sends a TLS
   close_notify or an RST, and you get `ECONNRESET`/`EPIPE`. A **Windows corporate proxy** terminates
   the TLS session itself, and its idle-timeout teardown closes the *local* socket half; the next
   write raises `ERR_SOCKET_CLOSED` with no wire event at all. 2.1.193 had it in none of its sets, so
   it fell to the `default` in every classifier: **non-retryable, kill the turn**.
2. **`ERR_PROXY_TUNNEL`** is undici's code for a failed `CONNECT`. It belongs in `Wie` (network-down)
   rather than `qie` (retryable) because it means the *tunnel* could not be built — the correct
   response is "you appear to be offline / your proxy rejected this", not silent retry. That the two
   codes went into *different* sets is the evidence that this was a considered classification, not a
   blanket "add all unknown codes".
3. `ETIMEDOUT` and `ECONNABORTED` came along in the same sweep. `ETIMEDOUT` in particular was
   inconsistent in 193: the message formatter already special-cased it
   (`if (n === "ETIMEDOUT") return "Request timed out. Check your internet connection and proxy settings";`,
   `:227953`, with a 193 twin) while the retry classifier did not treat it as retryable. 220 closes
   that gap.

**Why touch four sets instead of one shared constant?** Each subsystem has a different *response* to a
retryable code: the API loop backs off exponentially and disables keep-alive (§3); the MCP client
merges its set with HTTP status strings (`pSs`, `:283135`) because MCP transports surface both; the
bridge reconnects a WebSocket. Sharing one set would force the union of four policies. The cost is
that a fifth subsystem could be missed — and the `Lyy` set at `:281623` (claude.ai MCP connectors)
looks like exactly that fifth site, added at the same time to avoid it.

**Key insight:** *the absence of a literal is not the absence of a fix.* This bullet's message string
is produced by Node, so it cannot appear in the bundle by construction. The stable anchor for any
transport bullet is the **`code`**, never the message.

---

## 3. `.214` — keep-alive disabled after a stale connection

> `.214`: *"Keep-alive pooling is disabled after a stale-connection error so retries get a fresh socket."*

**Verdict: BEHAVIOR_CHANGE by gate removal — the same shape as the `.196` watchdog flip
([`streaming_and_watchdog.md`](streaming_and_watchdog.md) §1).**

| literal | 220 | 193 |
|---|---|---|
| `Stale connection` (the log line) | **1** (`:534549`) | **1** (`:602838 (193)`) |
| `tengu_disable_keepalive_on_econnreset` | **0** | **1** (`:602837 (193)`) |

```javascript
// 2.1.193 (cli_inner_pretty.js:602836-602838 (193)):
        let b = C5f(a);
        if (b && it("tengu_disable_keepalive_on_econnreset", !1))
          (T("Stale connection — disabling keep-alive for retry"), RRr());

// 2.1.220 (cli_inner_pretty.js:534548-534549):
        let b = YU_(a);
        if (b) (w("Stale connection — disabling keep-alive for retry"), UFi());
```

The behaviour existed in 2.1.193 but was **dark** — the gate defaulted to `false`, so nobody got it
unless Anthropic ramped them. `.214` deleted the gate. Note the direction of the count again: the only
literal that moved went **down**, and a count-only pass scores this "removed feature".

The predicate widened at the same time, and that is the *second* half of the fix.
`YU_` (`:534522-534526`) and its 193 twin `C5f` (`:602812-602816 (193)`) are structurally identical —
`instanceof APIConnectionError` → `unwrapConnectionDetails` → set membership — but they consult
`qie` and `Sce` respectively, so §2's sweep means `ERR_SOCKET_CLOSED`, `ETIMEDOUT` and `ECONNABORTED`
now also trigger the keep-alive drop.

**Why drop keep-alive at all?** A stale-connection error means the pooled socket the agent handed out
was already dead. Retrying on the *same pool* has a good chance of drawing another dead socket from
the same batch — a proxy that idled out one connection has almost certainly idled out its siblings.
`UFi()` forces the next attempt onto a brand-new TCP+TLS handshake. The cost is one extra handshake
(~100 ms) on a path that was already failing; the benefit is not burning three more retries on three
more dead sockets. This is also the exact interaction that makes the `ERR_SOCKET_CLOSED` addition
valuable: on Windows-behind-a-proxy, the *whole pool* goes stale at once.

---

## 4. `.212` — "Request too large" with many images

> `.212`: *"Fixed conversations with many images failing 'Request too large'; the message is better."*

**Verdict: DELTA — the literal `Request too large` is 220=2 / 193=2 (carryover); the new text is
`Accumulated images and attachments`, 220=2 (`:228179-228180`) / 193=0.**

```javascript
// ============================================
// buildRequestTooLargeMessage - 413 message, rewritten for the accumulated-media case
// Location: cli_inner_pretty.js:228176-228181  (193 twin :237279-237282 (193))
// ============================================

// ORIGINAL, 2.1.220 (for source lookup):
function Qcs() {
  let e = `max ${pl(Bls)}`;
  return yn()
    ? `Request too large (${e}). Accumulated images and attachments in the conversation pushed the request over the limit. Remove older images or compact the conversation.`
    : `Request too large (${e}). Accumulated images and attachments in the conversation pushed the request over the limit. Run /compact, or double press esc to go back and remove attachments.`;
}

// ORIGINAL, 2.1.193 (cli_inner_pretty.js:237279-237282 (193)):
  return _()
    ? `Request too large (${e}). Try with a smaller file.`
    : `Request too large (${e}). Double press esc to go back and try with a smaller file.`;

// READABLE (2.1.220, for understanding):
function buildRequestTooLargeMessage() {
  let cap = `max ${formatBytes(MAX_REQUEST_BYTES)}`;                 // 33554432 = 32 MiB (:222501)
  return isNonInteractive()
    ? `Request too large (${cap}). Accumulated images and attachments in the conversation pushed the request over the limit. Remove older images or compact the conversation.`
    : `Request too large (${cap}). Accumulated images and attachments in the conversation pushed the request over the limit. Run /compact, or double press esc to go back and remove attachments.`;
}

// Mapping: Qcs→buildRequestTooLargeMessage, pl→formatBytes, Bls→MAX_REQUEST_BYTES, yn→isNonInteractive
```

**Why this is a real fix and not a cosmetic edit.** 193's message names the wrong cause. `Bls` is
**33,554,432 bytes = 32 MiB**, a *whole-request* cap, not a per-file cap — the per-PDF cap is a
different constant (`t7r = 20971520` = 20 MiB, `:222502`, used by `Ycs()` at `:228155`). A user who hit
the 32 MiB request cap after pasting twenty screenshots over an hour was told *"Try with a smaller
file"*, which is unactionable: no single file is the problem, and the last one may have been tiny.
220 names the accumulation, and — crucially — names the *remedy that actually works*, `/compact`,
because compaction drops historical media from the transcript.

The message is also **machine-readable**. `nU_()` (`:531341-531350`) builds a message → media-kind map:

```javascript
function nU_() {
  return {
    [Ycs()]: new Set(["document"]),        // PDF too large
    [Xcs()]: new Set(["document"]),        // PDF password protected
    [Jcs()]: new Set(["document"]),        // PDF invalid
    [fpo()]: new Set(["image"]),           // image too large
    [Qcs()]: new Set(["document", "image"]),   // <-- request too large: strip BOTH kinds
    [fir("image")]: new Set(["image"]),
    [fir("document")]: new Set(["document"]),
  };
}
```

So the message is the *key* that tells the transcript-repair pass which content blocks to strip on the
next attempt (`:531335-531339` rewrites the message content in place). Editing the string therefore
required editing the map key too — which is why both must change together and why the count is 2, not 1.

The 413 handler that produces it (`:228538-228542`) has a discriminator worth noting:

```javascript
  if (e instanceof hi && e.status === 413) {
    if (e.message.toLowerCase().includes("context window"))
      return _u({ content: zW, error: "invalid_request", errorDetails: e.message });          // "Prompt is too long"
    return _u({ content: Qcs(), error: "invalid_request", errorDetails: `request_too_large: ${e.message}` });
  }
```

A 413 is *either* "too many tokens" or "too many bytes", and they have opposite remedies (compact vs
remove attachments). The `context window` substring is the only signal that separates them, and the
`errorDetails` prefix `request_too_large:` is what `mlp` (`:531352-531356`) / `jLu` (`:228107-228112`)
later parse to pick the media kinds.

---

## 5. `.212` — web search / fetch returning "API Error" as content

> `.212`: *"Fixed web search/fetch returning 'API Error' text as results or page content."*

**Verdict: DELTA — `API Error` is 220=6 / 193=6 (carryover); the delta is the *detector*, which gained
four prefixes.**

```javascript
// ============================================
// isApiErrorText - decides whether a text blob is one of our own error banners
// Location: cli_inner_pretty.js:228062-228071  (193 twin :237174-237176 (193))
// ============================================

// ORIGINAL, 2.1.220 (for source lookup):
function KW(e) {
  return (
    e.startsWith(RE) ||
    e.startsWith(`Please run /login \xB7 ${RE}`) ||
    e.startsWith($Lu) ||
    e.startsWith(NLu) ||
    e.startsWith(FLu) ||
    e.startsWith(BLu)
  );
}

// ORIGINAL, 2.1.193 (cli_inner_pretty.js:237174-237176 (193)):
function g1(e) {
  return e.startsWith(tb) || e.startsWith(`Please run /login \xB7 ${tb}`);
}

// READABLE (2.1.220, for understanding):
function isApiErrorText(text) {
  return text.startsWith(API_ERROR_PREFIX)                                   // "API Error"
      || text.startsWith(`Please run /login · ${API_ERROR_PREFIX}`)
      || text.startsWith(AWS_CREDS_EXPIRED)                                  // "AWS credentials expired or invalid"
      || text.startsWith(AWS_AUTH_FAILED)                                    // "AWS authentication failed"
      || text.startsWith(GCLOUD_CREDS_EXPIRED)                               // "Google Cloud credentials expired or invalid"
      || text.startsWith(GCLOUD_AUTH_FAILED);                                // "Google Cloud authentication failed"
}

// Mapping: KW/g1→isApiErrorText, RE/tb→API_ERROR_PREFIX (:228930 / :237967 (193)),
//          $Lu→AWS_CREDS_EXPIRED (:228931), NLu→AWS_AUTH_FAILED (:228932),
//          FLu→GCLOUD_CREDS_EXPIRED (:228933), BLu→GCLOUD_AUTH_FAILED (:228934)
```

Counts for the four new prefixes: `AWS credentials expired or invalid` **220=1 / 193=0**;
`Google Cloud authentication failed` **220=1 / 193=0** (same for the other two).

**Why this fixes the bullet.** `KW` is the *"is this text actually one of our error banners
masquerading as content"* test, and it has **ten call sites** (`:328110`, `:329107`, `:400514`,
`:440303`, `:440510`, `:441052`, `:512199`, `:639225`, `:662216`, plus its own decl). Two of them —
`:400514` `if (p.isApiErrorMessage || KW(f)) throw Error(f);` and `:512199`
`if (KW(f)) return (O(s, { success: !1, error: Ee("API error"), durationMs: p }), null);` — sit on
**tool-result** paths. When a web search or web fetch turn failed for an *auth* reason on Bedrock or
Google Cloud, the failure text did not begin with `"API Error"` — it began with
`"AWS credentials expired or invalid"` — so `g1` returned `false`, the blob was accepted as a legitimate
search result or page body, and it was handed to the model as content. Adding the four provider-auth
prefixes closes that hole.

**Why prefixes rather than a structured error type?** Because the value arriving at these call sites is
already a `string` — the banner was rendered upstream for display and the structure is gone. A prefix
test is the only thing available. It is fragile (a page whose body genuinely begins "AWS
authentication failed" is misclassified), and the ordering `RE` first is a small hedge: the most
common case short-circuits before four more `startsWith` calls run on every tool result.

The related bullet *"web search/fetch retry 529 and rate-limited requests with bounded backoff"* is
**not** anchored by `tengu_convolute_arcades_retry`, despite
[`_scope_v211_214.md:135`](../00_overview/_scope_v211_214.md) saying so — see
[`retry_policy.md`](retry_policy.md) §6 for the proof that that family is the silent refusal-fallback
retry. Web tool 529 retries ride the ordinary request loop (`dSe` at `:534653`,
`JBo = 3` at `:534658`), which is carryover; I found no web-tool-specific backoff in 2.1.220 and record
that half of the bullet as **UNANCHORED**.

---

## 6. Provider-aware error tails and the status-page link

> `.198`: *"API retry UX: the error reason is shown after the 2nd attempt; a status-page link replaces
> the spinner tip."*

**Verdict: mostly CARRYOVER; one genuinely new line.**

```javascript
// ============================================
// buildProviderStatusHint - the " If it persists, check …" tail on a transport error
// Location: cli_inner_pretty.js:228144-228154  (193 twin :237247-237256 (193))
// ============================================

// ORIGINAL, 2.1.220 (for source lookup):
function ppo() {
  let e = Hn();
  if (e === "firstParty") {
    if (Yd()) return ` If it persists, check ${Wcs}.`;
    let t = process.env.ANTHROPIC_BASE_URL ?? "";
    return ` If it persists, check your inference gateway (${URL.parse(t)?.host || t}).`;
  }
  if (e === "anthropicAws") return ` If it persists, check ${Wcs}.`;
  if (e === "anthropicGoogleCloud") return ` If it persists, check ${Wcs} and Google Cloud's status page.`;
  return ` If it persists, check your ${ZK[e]} service status.`;
}

// READABLE (for understanding):
function buildProviderStatusHint() {
  let provider = getActiveProvider();
  if (provider === "firstParty") {
    if (isOfficialEndpoint()) return ` If it persists, check ${STATUS_PAGE_URL}.`;
    let baseUrl = process.env.ANTHROPIC_BASE_URL ?? "";
    return ` If it persists, check your inference gateway (${URL.parse(baseUrl)?.host || baseUrl}).`;
  }
  if (provider === "anthropicAws") return ` If it persists, check ${STATUS_PAGE_URL}.`;
  if (provider === "anthropicGoogleCloud")                                          // <-- NEW arm
    return ` If it persists, check ${STATUS_PAGE_URL} and Google Cloud's status page.`;
  return ` If it persists, check your ${PROVIDER_DISPLAY_NAMES[provider]} service status.`;
}

// Mapping: ppo→buildProviderStatusHint, Hn→getActiveProvider, Yd→isOfficialEndpoint,
//          Wcs→STATUS_PAGE_URL ("https://status.claude.com", :228959), ZK→PROVIDER_DISPLAY_NAMES
```

`If it persists, check ` is **220=5 / 193=4**; `status.claude.com` is **220=1 / 193=1**; `status page`
is **220=1 / 193=0** — and that single new hit is `:228152`, the `anthropicGoogleCloud` arm. So:

- The **status-page link itself is carryover** (`uQi` at `:237250 (193)` is the same URL constant). The
  `.198` bullet's headline is pre-existing behaviour.
- The **one new line** belongs to the undocumented `anthropicGoogleCloud` provider channel
  (see [`47_models/anthropic_google_cloud_channel.md`](../47_models/anthropic_google_cloud_channel.md)),
  not to the `.198` retry-UX bullet.
- The *"error reason after the 2nd attempt"* half is the `onRetryStatus?.({ kind: "retrying", error: D, attempt: P, … })`
  callback at `:534762-534769` / `:534781-534788`, which is **byte-equivalent** to
  `:603038-…(193)`. Not a delta.

Record `.198` #30 as **CARRYOVER**.

The rich part of this region is not the hint but `lir` (`formatApiErrorForDisplay`,
`:227947-227987`) — an eight-way SSL-code switch, an HTML-title extractor (`jcs`, `:227916-227923`,
for gateways that return a branded error page instead of JSON), and a nested-JSON error extractor
(`ILu`, `:227932-227946`). All carryover (twins at `:237075-…(193)`), all worth knowing about, none a
delta.

---

## 7. `.202` — installer downloads failing "aborted"

> `.202`: *"Installer/updater downloads that failed with 'aborted' now retry transient drops."*

**Verdict: NET_NEW.** `ERR_STREAM_PREMATURE_CLOSE` **220=1 (`:540251`) / 193=0**.

```javascript
// ORIGINAL (cli_inner_pretty.js:540246-540260):
      let _ = l.signal.aborted ? l.signal.reason : void 0,
        E = _ === "deadline",
        A = !E && (_ === "stall" || hU(y));
      if (E) throw Object.assign(new Lr("Download timed out: exceeded the total deadline"), { attempt: a });
      let b = y instanceof Error && y.message.includes("Checksum mismatch"),
        T = !c && (kup(y) || HN(y)?.code === "ERR_STREAM_PREMATURE_CLOSE"),
        C = A ? new F2t() : _n(y);
      if (((o = C), (A || b || T) && a < Dbr)) {
        if (b) i = !0;
        else if (T) s = !0;
        (w(`Download ${b ? "checksum mismatch" : A ? "stalled" : "connection dropped"} on attempt ${a}/${Dbr}, retrying...`),
          await vr(1000));
        continue;
      }
```

The downloader now has a **three-way** retryable taxonomy — stall (`A`), checksum mismatch (`b`),
connection drop (`T`) — against `Dbr = 3` (`:540392`) attempts with a flat 1 s pause, and a hard
`"deadline"` abort that is never retried. `ERR_STREAM_PREMATURE_CLOSE` is Node's code for *"the
readable ended before `Content-Length` bytes arrived"* — precisely a truncated download that reports
itself as `aborted`. Retrieving it via `HN(y)?.code` (the same 5-level `.cause` walk the API layer
uses, `:227888`) rather than a message match is what makes it reliable through the stream-to-disk
pipeline that `.205` introduced (`highWaterMark: 4194304` at `:540228`, owned by
[`50_performance/`](../50_performance/)).

The flags `i` (checksum) and `s` (premature close) are sticky across attempts, so the final thrown
error can say *which* transient class exhausted the budget rather than reporting the last raw error.
Note the ordering: the deadline check throws **before** any retry classification, so a slow-but-alive
download cannot be resurrected by a lucky drop classification.

---

## 8. Two bullets that belong to other modules

- **`.211` #37, prompt-caching regression on Bedrock/Vertex/Mantle/Foundry billing the trailing system
  block.** The `tengu_lapis_anchor*` family is **220=4 / 193=1**: `tengu_lapis_anchor` `:226383`
  (a 3-value mode string via `Ke(…, "off")`), `tengu_lapis_anchor_budget` `:226391`,
  `tengu_lapis_anchor_user_turn` `:226399`, plus the settings-schema doc comment at `:61361` which is
  the only readable description of the mechanism in the bundle:
  *"emit the `totalTokensReminder` block after each regular user prompt and (for 'padded-countdown')
  re-anchor the task budget to the full configured value at the start of each user turn … Env var
  `CLAUDE_CODE_TOTAL_TOKENS_REMINDER_AFTER_USER_TURN` overrides; server-controlled via GrowthBook
  `tengu_lapis_anchor_user_turn`."* This is about **what goes in the trailing system block**, which is
  [`40_system_prompt/`](../40_system_prompt/)'s territory. What belongs here is only the consequence:
  a trailing system block that changes every turn invalidates the cache prefix, which is why the
  billing regression looked like a reliability problem. The `.212` gateway half — the
  `retry:api-system-cache-demote` handler — is in
  [`streaming_and_watchdog.md`](streaming_and_watchdog.md) §8.
- **`.212` prompt caching behind gateways.** `CLAUDE_CODE_USE_GATEWAY` is **220=8 / 193=2** — the
  gateway on-ramp grew six sites in this window. [`55_auth_providers/aws_and_provider_plumbing.md`](../55_auth_providers/aws_and_provider_plumbing.md)
  owns that plumbing; the retry-side consequence is documented above.

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
- `API_TRANSIENT_CODES` (`qie`, `:228052`) - 7 retryable transport codes (was 4)
- `NETWORK_DOWN_CODES` (`Wie`, `:228040`) - 10 offline-shaped codes (was 9)
- `MCP_RETRYABLE_CODES` (`vZr`, `:283117`) - 11 codes; merged with statuses into `pSs` `:283135`
- `CLAUDEAI_MCP_RETRYABLE_CODES` (`Lyy`, `:281623`) - 7 codes, connector path
- `BRIDGE_RETRYABLE_CODES` (`_W_`, `:547506`) - 8 codes, background/remote bridge
- `isStaleConnectionError` (`YU_`, `:534522`) - `qie` membership; drives the keep-alive drop
- `isNetworkDownError` (`GZg`, `:227907`) - `Wie` membership
- `classifyConnectionErrorCode` (`dpo`, `:227885`) - code → telemetry token
- `disableKeepAlivePool` (`UFi`, called `:534549`) - forces a fresh socket on the next attempt
- `isApiErrorText` (`KW`, `:228062`) - six-prefix banner detector (was two)
- `buildRequestTooLargeMessage` (`Qcs`, `:228176`) - the accumulated-media 413 text
- `buildMediaStripMessageMap` (`nU_`, `:531341`) - message → media-kind map keyed by those strings
- `parseMediaKindsFromErrorDetails` (`mlp`, `:531352`) - `errorDetails` → kinds to strip
- `mediaKindsForRequestTooLarge` (`jLu`, `:228107`) - `request_too_large` / `too much media` classifier
- `locateOversizeMediaBlock` (`zcs`, `:228113`) - `messages[i].content[j].(image|document|pdf)` regex
- `buildProviderStatusHint` (`ppo`, `:228144`) - the `If it persists, check …` tail
- `formatApiErrorForDisplay` (`lir`, `:227947`) - 8-way SSL switch + HTML-title + nested-JSON extraction
- `extractHtmlTitle` (`jcs`, `:227916`) - gateway error-page title extractor
- `MAX_REQUEST_BYTES` (`Bls`, `:222501`) - `33554432` (32 MiB)
- `MAX_PDF_BYTES` (`t7r`, `:222502`) - `20971520`; `MAX_PDF_PAGES` (`hIu`, `:222503`) - `100`
- `STATUS_PAGE_URL` (`Wcs`, `:228959`) - `https://status.claude.com`
- `MAX_DOWNLOAD_ATTEMPTS` (`Dbr`, `:540392`) - `3`
