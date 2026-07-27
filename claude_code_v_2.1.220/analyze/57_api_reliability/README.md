# 57_api_reliability — API, streaming, and retry reliability deltas (v2.1.193 → v2.1.220)

> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
> (`VERSION 2.1.220`, build `4073f595`, `build_time 2026-07-24T22:17:45Z`, 872,596 lines).
> BASELINE: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`.
> Every `cli_inner_pretty.js:<line>` in this directory is a **220** line unless tagged **(193)**.
> Conventions: [`../_CONVENTIONS.md`](../_CONVENTIONS.md).
> Verified anchors this module builds on: [`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md).
> Carryover register: [`../00_overview/_false_delta_ledger.md`](../00_overview/_false_delta_ledger.md).

---

## The window's story for this theme, in one paragraph

Nothing in the reliability layer was rewritten between `2.1.193` and `2.1.220`; the retry loop, the two
stream watchdogs, the error-code sets and the message formatters are all the same machines they were
154,000 lines ago. What changed is **classification**. Almost every bullet in this theme resolves to
one of three shapes: a **set gained members** (the retryable transport codes went 4 → 7, and
`ERR_SOCKET_CLOSED` + `ERR_PROXY_TUNNEL` were swept into *four* independent sets across the API, MCP
and bridge subsystems); a **set was split** (the 18-code SSL set became a 15-code *certificate-verdict*
subset that fails fast plus a 3-code transient remainder that still retries); or **a gate was deleted**
so an experiment became unconditional (the event-level stream watchdog, and the disable-keep-alive-on-
stale-connection behaviour). That last shape is why two of this theme's headline bullets have literal
counts that go **down** — `CLAUDE_ENABLE_STREAM_WATCHDOG` 220=2 / **193=4**,
`tengu_disable_keepalive_on_econnreset` 220=0 / **193=1** — and it is the single most important thing to
understand before reading the `_scope_*` rows for this theme. Three findings are genuinely new
information rather than confirmations: **(1)** the `.218` "doomed retry loop" is a provable
non-terminating loop in 2.1.193, caused by a `Math.max(…, thinkingBudget + 1)` that could not shrink,
now fixed by deleting that term *and* adding a monotonic-progress breaker; **(2)** `.214`'s
"Socket is closed" bullet, filed UNANCHORED by the scoping pass because the message is a runtime
string, is fully anchorable on the Node **error code**; and **(3)** the unexplained
`tengu_convolute_arcades_*` family (220=11 / 193=0) is the **silent refusal-fallback continuation
retry** — a server-flagged behaviour where an API refusal transparently re-runs the turn on a fallback
model while preserving the already-streamed prefix — and it has nothing to do with the web-search
bullets the scoping pass attached it to.

---

## Documents

| Doc | Covers |
|---|---|
| [`retry_policy.md`](retry_policy.md) | The retry budget `Pqs()` and its semantic rewrite (10 / **300** / clamp-15-only-when-the-watchdog-is-off), with the full 2.1.193 comparison; what `CLAUDE_CODE_RETRY_WATCHDOG` actually does (it disables **five** give-up heuristics, not just "retry more"); the transient-429 header-absence predicate `$lp`; the SSL fail-fast set split; the `.218` doomed-retry loop reconstructed from 2.1.193 source; `tengu_api_retry_after_too_long` (carryover) and `tengu_effort_unsupported_retry` (net-new, two-shape detector); the full evidence chain identifying **`tengu_convolute_arcades_*`**; and `subscribeRetryWake`, an undocumented interruptible-sleep mechanism (220=9/193=0). |
| [`streaming_and_watchdog.md`](streaming_and_watchdog.md) | The **two** watchdogs the changelog conflates (byte-level — carryover, default-on since before the window; event-level — the `.196` flip) and the six sites that prove the flip is a *deletion*; what `armEventWatchdog` arms and why the stall indicator is deliberately outside the watchdog gate; the `.214` advisor grace window that fixes the spurious "check your network"; the `.199` mid-stream keep-partial condition and its **two** widenings; `isAbortedMidStream`; the `.208` HTTP/2 GOAWAY survival path in the `uncaughtException` handler with its three-part stack-frame-verified classifier; and the `.208` Bedrock content-type guard that makes "Truncated event message received" unreachable. |
| [`transport_errors.md`](transport_errors.md) | The four API-side error-code sets before and after; the coordinated `ERR_SOCKET_CLOSED` / `ERR_PROXY_TUNNEL` sweep across four subsystems and why the two codes went into *different* sets; the keep-alive gate deletion; the `.212` "Request too large" message rewrite and why it is machine-readable (it is a map key that selects which media kinds to strip); the `.212` `isApiErrorText` prefix widening that stops provider-auth banners being served to the model as web-page content; the provider-aware status-page tail (mostly carryover); and the `.202` installer download taxonomy. |

---

## Per-bullet ledger

**Legend.** `NET_NEW` = 220>0 / 193=0 with a read site. `DELTA` = the headline literal pre-existed; the
true change is narrower and is named. `CARRYOVER` = no isolable client-side change.
`GATE_REMOVAL` = the behaviour existed but was dark; the delta is the *deletion* of its gate, so counts
fall. `UNANCHORED` = probed, not found. `OTHER MODULE` = counted here, owned elsewhere.

### Bullets where `api_reliability` is the primary theme (16)

| # | Bullet (abridged) | Ver | Verdict | Anchor (220 unless tagged) | Doc |
|---|---|---|---|---|---|
| 1 | Streaming idle watchdog on by default for all providers; `CLAUDE_ENABLE_STREAM_WATCHDOG=0` disables | `.196` | **GATE_REMOVAL** — `CLAUDE_ENABLE_STREAM_WATCHDOG` 2 / **193=4**; `tengu_event_watchdog_default_on` 0 / **193=1**. Both counts fall. | `:510479` (`?? !0`) vs `:595164 (193)` (`?? it(gate, !1)`); deleted forced-on at `:606918 (193)` / `:715178 (193)`, absent from `:553391-553407` | streaming §1 |
| 2 | Brief network drops mid-response aborting the turn; `ECONNRESET` now retries with backoff | `.198` | **CARRYOVER for `ECONNRESET`** (member of `Sce` at `:237172 (193)` already). The real widening is `ETIMEDOUT` / `ECONNABORTED` / `ERR_SOCKET_CLOSED` joining `qie` | `qie` `:228052-228060` vs `Sce` `:237172 (193)` (4 → 7) | transport §1-2 |
| 3 | API retry UX: error reason after the 2nd attempt; status-page link replaces the spinner tip | `.198` | **CARRYOVER.** `status.claude.com` 1/**1** (`:228959` vs `:237250 (193)` region); the `onRetryStatus({kind:"retrying", error, attempt})` payload at `:534762-534769` is byte-equivalent to 193 | — | transport §6 |
| 4 | SSL cert errors fail immediately with the fix hint instead of burning retries | `.199` | **DELTA.** Hint text carryover (`ask IT to allowlist` 1/**1**). New: the `Gcs` cert subset and its use in the retry classifier | `Gcs` `:228017-228033`; `:534936-534941` vs `:603199 (193)` (`if (e instanceof KI) return !0;`) | retry §3 |
| 5 | Streaming partial kept on a mid-stream overloaded/server error after partial output | `.199` | **NET_NEW.** `Mid-stream server error after` 1/**0**; `Server error mid-response.…` 1/**0**; causes 4 vs **2** | `:511194` (the new `Yn` disjunct); `:511256`; `:511267-511273` | streaming §4 |
| 6 | Transient 429s (unrelated to your usage limit) retried with backoff for subscribers | `.199` | **NET_NEW predicate.** Message `Server is temporarily limiting requests…` is 1/**1** — do not anchor on it | `$lp` `:534951-534953`; spliced at `:534931` and `:534947` vs `:603194 (193)` / `:603205 (193)` | retry §2 |
| 7 | `CLAUDE_CODE_RETRY_WATCHDOG` raises the default retry count to 300 and lifts the cap of 15 | `.199` | **DELTA — semantic only.** Env literals carryover (2/**2**, 5/**4**). Delta is `if (t > X9s && !e)` + `return e ? NU_ : $U_` | `Pqs` `:534954-534967`; `$U_=10 NU_=300 X9s=15` `:534989-534991` vs `O5f` `:603209-603221 (193)`, `_5f=10 Ujo=15` `:603243-603244 (193)` | retry §1 |
| 8 | Installer/updater downloads failing "aborted" now retry transient drops | `.202` | **NET_NEW** — `ERR_STREAM_PREMATURE_CLOSE` 1/**0** | `:540251`; taxonomy `:540246-540260`; `Dbr = 3` `:540392` | transport §7 |
| 9 | Supervised/background sessions crashing on an HTTP/2 GOAWAY in flight | `.208` | **NET_NEW** — `ERR_HTTP2_GOAWAY_SESSION` 1/**0**; `Recovered HTTP/2 stream-teardown uncaught exception` 1/**0** | classifier `aau` `:165073-165086`; recovery arm `:522517-522534`; `Lip = 10` `:522396` | streaming §6 |
| 10 | Bedrock "Truncated event message received" now names the content-type | `.208` | **NET_NEW guard + CARRYOVER message.** ⚠ **corrects the ledger's flat CARRYOVER.** The old message (2/**2**) is unchanged and now usually unreachable; a new pre-emptive guard throws first | guard `:149991-149999`; `BedrockUnexpectedContentTypeError` `:150097-150109`; `CLAUDE_CODE_DISABLE_BEDROCK_CONTENT_TYPE_GUARD` 3/**0** | streaming §7 |
| 11 | Prompt-caching regression on Bedrock/Vertex/Mantle/Foundry billing the trailing system block | `.211` | **OTHER MODULE** ([`40_system_prompt/`](../40_system_prompt/)). `tengu_lapis_anchor*` 4/**1**; the schema doc comment at `:61361` is the only readable description in the bundle | `:226383`, `:226391`, `:226399`, `:61361` | transport §8 |
| 12 | Conversations with many images failing "Request too large"; better message | `.212` | **DELTA.** `Request too large` 2/**2** (carryover); `Accumulated images and attachments` 2/**0** | `Qcs` `:228176-228181` vs `:237279-237282 (193)`; map key `:531347`; 413 split `:228538-228542` | transport §4 |
| 13 | Web search/fetch returning "API Error" text as results or page content | `.212` | **DELTA.** `API Error` 6/**6**; the detector `KW` went 2 → 6 prefixes (four provider-auth banners, each 1/**0**) | `KW` `:228062-228071` vs `g1` `:237174-237176 (193)`; prefixes `:228931-228934`; tool-result call sites `:400514`, `:512199` | transport §5 |
| 14 | Web search/fetch retry 529 and rate-limited requests with bounded backoff | `.212` | **UNANCHORED.** ⚠ The scoping pass anchored this on `tengu_convolute_arcades_retry`; that family is the refusal-fallback retry (proof in retry §6). No web-tool-specific backoff found; 529 handling rides the ordinary loop (`dSe` `:534653`, `JBo = 3` `:534658`, carryover) | — | retry §6, transport §5 |
| 15 | Mid-conversation system block now works behind gateways/custom base URLs | `.212` | **NET_NEW retry handler** (system-block *content* is [`40_system_prompt/`](../40_system_prompt/)). `retry:api-system-cache-demote` 1/**0**; `api_midconv_cache_proxy` 2/**0** | `:509920-509926`; latch `:509929-509931`; cf. `tengu_mid_conv_system_fallback_retry` `:509912` (1/**1**) | streaming §8 |
| 16 | Streaming turns failing "Socket is closed" behind corporate proxies on Windows | `.214` | **NET_NEW.** ⚠ **corrects the scoping pass's UNANCHORED.** `Socket is closed` is the runtime *message*; `ERR_SOCKET_CLOSED` is the **code**, 4/**0**, added to four sets in four subsystems | `:228058`, `:281629`, `:283132`, `:547513`; also `ERR_PROXY_TUNNEL` 4/**0** | transport §2 |
| 17 | Spurious "check your network" warning while the advisor was thinking | `.214` | **DELTA.** `check your network` 3/**3** (UI site `:580201`, carryover). Fix is a grace window inside the stall-indicator arming | `if (tr && Lc < ui)` `:510143`; `ui` `:510483`; `c1_=90000` `:512026`, `xqs=20000` `:512025`; `tr` cleared `:510684` | streaming §3 |
| 18 | Keep-alive pooling disabled after a stale-connection error so retries get a fresh socket | `.214` | **GATE_REMOVAL.** `tengu_disable_keepalive_on_econnreset` 0 / **193=1**; log line 1/**1** | `:534548-534549` vs `:602836-602838 (193)`; predicate `YU_` `:534522-534526` now reads the widened `qie` | transport §3 |
| 19 | Retry loop re-sending doomed requests after context overflow with a large thinking budget | `.218` | **NET_NEW.** `max_tokens overflow adjustment made no progress` 1/**0**. Two-part fix: the `thinkingBudget+1` floor is deleted **and** a monotonic breaker added | `:534712-534731` vs `:602993-603010 (193)` (`U = Math.max(jjo, D, M)` at `:603001 (193)`) | retry §4 |

*(19 rows for 16 scoped bullets: the `.196` row covers one bullet, and rows 11/14/15 are split or
cross-owned. Two `_scope` rows counted under this theme — `.205` "auto-update downloads stream to disk"
and `.219` "`claude -p` text output dropping the answer" — are listed below as other-module.)*

### Bullets where `api_reliability` is the secondary theme (7)

| Bullet | Ver | Primary owner | Verdict here |
|---|---|---|---|
| Auto-update downloads stream to disk (~400 MB less peak memory), `highWaterMark: 4194304` | `.205` | [`50_performance/`](../50_performance/) | The same downloader as row 8; the retry taxonomy is documented in transport §7 |
| Cloud sessions dropping the in-flight message when the container restarts mid-turn | `.216` | [`36_background_agents/`](../36_background_agents/) | `tengu_resume_interrupted_turn` 2/**0**; not re-derived here |
| Spurious `[Request interrupted by user]` + unpaired `tool_use` left in transcript | `.218` | [`04_tools/`](../04_tools/) | Related to the partial-finalization stop-reason synthesis (streaming §4) but the transcript repair is not in this module |
| Remote sessions sending heartbeats after their worker was replaced | `.218` | [`54_remote_control/`](../54_remote_control/) | The bridge retryable set `_W_` `:547506-547514` is documented in transport §2 |
| `claude -p` text output dropping the answer when a turn dies mid-stream | `.219` | [`51_headless_sdk/`](../51_headless_sdk/) | `isAbortedMidStream` 5/**0** (`:510503`) is the client-side field that makes this detectable — streaming §5 |
| Prompt caching behind gateways / custom base URLs | `.212` | [`55_auth_providers/`](../55_auth_providers/) | `CLAUDE_CODE_USE_GATEWAY` 8/**2**; the retry-side handler is streaming §8 |
| Ctrl+B background caps after context overflow | `.218` | [`36_background_agents/`](../36_background_agents/) | Shares a `_scope` row with the doomed-retry bullet (row 19); only the retry half is mine |

---

## False deltas caught in this module

Five, in decreasing order of how badly a literal-count pass would mis-score them.

| Bullet | Naive anchor | 220 / 193 | Why it misleads | Real delta |
|---|---|---|---|---|
| `.196` watchdog default-on | `CLAUDE_ENABLE_STREAM_WATCHDOG` | **2 / 4** | Count **falls**. A default-on flip deletes a gate read *and* the hand-placed forced-on overrides | `?? it("tengu_event_watchdog_default_on", !1)` → `?? !0` at `:510479`, plus two deleted env injections |
| `.214` keep-alive | `Stale connection` | **1 / 1** | Message unchanged; the gate that suppressed the behaviour is what disappeared | `tengu_disable_keepalive_on_econnreset` 0 / **193=1** (`:602837 (193)`) |
| `.199` retry count | `CLAUDE_CODE_RETRY_WATCHDOG`, `CLAUDE_CODE_MAX_RETRIES` | **2 / 2**, **5 / 4** | Both env names are carryover; the change is in three integers and one added conjunct | `$U_=10 / NU_=300 / X9s=15` at `:534989-534991` and `if (t > X9s && !e)` at `:534959` |
| `.199` SSL fail-fast | `NODE_EXTRA_CA_CERTS to your CA bundle path` | **1 / 1** | The *hint* is carryover; the *fail-fast* is new and lives in a set that 193 did not have | `Gcs` `:228017` (15-code subset carved out of the 18-code `d6d` `:237141 (193)`) |
| `.199` transient 429 | `Server is temporarily limiting requests (not your usage limit)` | **1 / 1** | 2.1.193 could already *name* the condition; it just could not retry it for a subscriber | `$lp` `:534951-534953` |

And two **corrections to the foundation-pass verdicts**, both argued from source in the topic docs:

1. **`_false_delta_ledger` register 1, `.208` "Truncated event message received":** filed CARRYOVER on
   a 2/2 message count. Correct about the message; the fix is a *new error thrown earlier*
   (`BedrockUnexpectedContentTypeError`, 1/**0** — the class-name string at `:150108`, inside the decl
   at `:150097-150109`; the guard's env kill switch `CLAUDE_CODE_DISABLE_BEDROCK_CONTENT_TYPE_GUARD`
   is the 3/**0** literal). Verdict should be
   **NET_NEW guard + CARRYOVER message**.
2. **`_scope_v211_214.md:198`, `.214` "Socket is closed":** filed UNANCHORED because the string is
   0/0 in both bundles. True but irrelevant — the client classifies on `err.code`, and
   `ERR_SOCKET_CLOSED` is 4/**0** across four sets. Verdict should be **NET_NEW**.

Plus one **mis-attribution**: `_scope_v211_214.md:134-135` anchors two `.212` web-search bullets on
`tengu_convolute_arcades_retry{,_outcome}`. Those events are in the query loop's refusal-fallback
handler (`:338267`, `:338460`, `:338518`) and the streaming tool executor (`:331736`); no web-tool code
path reaches them. See [`retry_policy.md`](retry_policy.md) §6.

---

## The headline undocumented finding: `convolute_arcades`

`tengu_convolute_arcades_retry`, `_retry_outcome` and `_tools` appear in
[`_raw_asset_diff_193_to_220.md`](../00_overview/_raw_asset_diff_193_to_220.md) as three of the 326 new
gates, with no changelog bullet. They are **220=11 / 193=0** in total and they instrument the
**silent refusal-fallback continuation retry**: when the API returns `stop_reason: "refusal"`
mid-turn, a server-pushed per-account flag (`Jx()?.convolute_arcades`, `:121085`) makes the client
switch to the fallback model, abort and compensate in-flight tool calls, and re-run the turn *without
a dialog*, keeping the already-streamed text visible as a `refusal_continuation` `phase: "begin"`
event carrying `salvageText`. The decisive corroboration is the SDK event schema's own comment at
`:838180`. Full derivation, all eleven sites, and the design rationale for why the flag is
server-pushed rather than a `tengu_*` gate: [`retry_policy.md`](retry_policy.md) §6.

Two smaller undocumented additions found alongside it:

- **`subscribeRetryWake`** (220=9 / 193=0) — an interruptible retry sleep sliced into 30 s chunks
  (`KU_`, `:535004`) with a wake channel threaded from app state. It is what makes the new 300-retry /
  6-hour budget survivable. [`retry_policy.md`](retry_policy.md) §7.
- **`tengu_watchdog_skip_nonstreaming_fallback`** (220=1 / 193=0, `:511183`, default `!0`) — after a
  watchdog abort the client no longer falls back to the non-streaming endpoint, because a stream that
  went idle is not evidence that streaming is unsupported.

---

## Where this theme lives in the bundle

| Region | What |
|---|---|
| `:149792-150110` | stream idle-timeout resolvers, byte-watchdog attach + `fetch` wrapper, `StreamSuspendedError`, `BedrockUnexpectedContentTypeError` |
| `:165073-165101` | HTTP/2 teardown classifier (`aau`, `sau`, `NGHTTP2_*` regex) |
| `:226587-226596` | unified rate-limit header constants |
| `:227868-228061` | error triage: `isOverloaded529`, `unwrapConnectionDetails`, SSL hint, display formatter, **the four code sets** |
| `:228062-228190` | API-error text detector, context-overflow message builders, media-size messages, provider status hint |
| `:228930-228975` | the error-banner string table (`API Error`, `Prompt is too long`, `status.claude.com`, …) |
| `:331733-331760` | fallback tool sweep (`tengu_convolute_arcades_tools` / `tengu_fallback_sweep_tools`) |
| `:338180-338530` | refusal-fallback + silent-continuation handling in the query loop |
| `:509900-511650` | the streaming generator: retry-token handlers, watchdog arming, partial finalization |
| `:522185-522545` | `uncaughtException` handler with the GOAWAY recovery arm |
| `:534500-535070` | **the request retry loop** and every constant it uses |
| `:540200-540400` | installer/updater download retry taxonomy |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this module are staged in
> [symbol_additions_v2_1_220_api_reliability.md](../00_overview/symbol_additions_v2_1_220_api_reliability.md).

Key entry points for this module:
- `getMaxRetries` (`Pqs`, `:534954`) - the retry budget; watchdog-aware since `.199`
- `isRetryableApiError` (`n4_`, `:534911`) - the master classifier every retry decision passes through
- `isRetryWatchdogEnabled` (`WUe`, `:534513`) - disables five separate give-up heuristics
- `armEventWatchdog` (`As`, `:510152`) - event-level idle warn + abort timers
- `armStallIndicator` (`vs`, `:510132`) - the user-visible countdown, outside the watchdog gate
- `unwrapConnectionDetails` (`HN`, `:227888`) - the `.cause` walk that produces every transport `code`
- `API_TRANSIENT_CODES` (`qie`, `:228052`) / `NETWORK_DOWN_CODES` (`Wie`, `:228040`) - the two runtime sets
- `CERT_ERROR_CODES` (`Gcs`, `:228017`) / `SSL_ERROR_CODES` (`UZg`, `:228034`) - the split SSL sets
- `isApiErrorText` (`KW`, `:228062`) - six-prefix banner detector
- `isRecoverableHttp2TeardownError` (`aau`, `:165073`) - GOAWAY survival classifier
- `isConvoluteArcadesEnabled` (`hit`, `:121073`) - the silent-refusal-fallback flag
- `sleepUntilRetryOrWake` (`Plp`, `:534800`) - interruptible retry sleep
