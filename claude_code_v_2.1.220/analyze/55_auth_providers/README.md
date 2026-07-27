# 55_auth_providers — Authentication and provider plumbing (v2.1.193 → v2.1.220)

> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
> (`VERSION 2.1.220`, build `4073f595`, `build_time 2026-07-24T22:17:45Z`, 872,596 lines).
> BASELINE: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`.
> Every `cli_inner_pretty.js:<line>` in this directory is a **220** line unless tagged **(193)**.
> Conventions: [`../_CONVENTIONS.md`](../_CONVENTIONS.md).
> Verified anchors this module builds on: [`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md).
> Carryover register: [`../00_overview/_false_delta_ledger.md`](../00_overview/_false_delta_ledger.md).

---

## The window's story for this theme, in one paragraph

The `.206`–`.210` scoping pass called `auth_providers` *"the opposite shape"* to every other theme:
ten bullets, six of them CARRYOVER, zero DELTA, because **every AWS/SSO literal is unchanged between
the two bundles** (`awsCredentialExport` 12/12, `sso_region` 9/9, `credential_process` 7/7,
`awsAuthRefresh` 10/10). That measurement is right and the conclusion drawn from it is wrong. What
actually happened in this window is that Claude Code **inserted a new caching, timeout and
invalidation layer between itself and the AWS SDK** (`getDefaultAwsProviderChain`,
`resolveWithStallGuard`, `CLAUDE_CODE_SKIP_AWS_CRED_CACHE` — all `220>0 / 193=0`), **rewrote the mTLS
module** around content-aware asynchronous reload, **added lock-compromise detection and a
compare-and-swap write to the OAuth refresh path** (`isCompromised` 220=7 / **193=0**), **added a
transport-settings suppression policy for host-managed sessions** and then narrowed it one release
later for Claude Desktop, and **taught the request retry loop three new credential-shaped breakers**
(`api_request_api_key_helper_failed`, `api_request_aws_auth_exhausted`, and the widened
stale-connection set). Two of this theme's bullets describe machinery that shipped before the window
opened (`.198` `awsAuthRefresh`, `.214` keep-alive) and one describes a set-membership change dressed
as a behaviour change. The single most useful artefact discovered is the auth module's **export table
at `:154127-154262`** — 135 readable names in a bundle that has almost none.

---

## Documents

| Doc | Covers |
|---|---|
| [`login_and_credentials.md`](login_and_credentials.md) | The auth export table; the `.203`/`.217` login-expiry warning and the `5 → 3` day constant; the `.208` `apiKeyHelper` chain (the `" "` sentinel, the 3-attempt breaker, the `/status` pointer); the `.211` wake-from-sleep mass-logout fix (lock stale 10 s→60 s, `isCompromised`, an `AbortController` threaded into the token exchange, and a compare-and-swap adoption write); the `.212` `forceLoginMethod` enforcement points; the `.214` GrowthBook auth-rotation re-init; the `.206` gateway `/login` public-endpoint carve-out and the private-network pre-flight around it; the `.202` OSC-8 hyperlink policy flip; and the `OAuthRefreshDeadError` fail-fast that is the real `.206` "misleading model error" fix. |
| [`aws_and_provider_plumbing.md`](aws_and_provider_plumbing.md) | Why the AWS literals are useless as anchors; the `.207` per-request-SSO fix as a per-(profile, region) expiry-aware cache with stale-while-revalidate; three deliberately different eviction paths; the `.208` `sso_region` regression reconstructed from `clientConfig.region ?? ssoRegion` in the vendored SDK; the `.207` 60-second stall guard; proof that `.198`'s `awsAuthRefresh` auto-invocation is **byte-equivalent carryover** and what the real `.198` delta is; the `.205` Cowork `local_agent` entrypoint alias; the credential-side provider inventory; and the `CLAUDE_CODE_USE_GATEWAY` / `CLAUDE_GATEWAY_ALLOW_LOOPBACK` on-ramp. |
| [`transport_settings.md`](transport_settings.md) | The six-variable `HOST_MANAGED_TRANSPORT_VARS` set and the one `if` statement that `.212` added and `.217` narrowed (with the resulting source×session-kind matrix); two more enforcement points (CA-cert config fallback, warm-spare env scrub); the `.202` mTLS module rewrite and the `if (!pointsElsewhere) clearMTLSCache()` line that makes in-place rotation safe; and the `.214` keep-alive bullet shown to be **carryover plus three new error codes**. |

---

## Per-bullet ledger

**Legend.** `NET_NEW` = 220>0 / 193=0 with a read site. `DELTA` = the literal or mechanism pre-existed;
the true change is narrower and is named. `CARRYOVER` = no isolable client-side change.
`NOT ISOLABLE` = the change happened *entirely inside* the `.194`–`.219` window, so a 193↔220 diff
shows only the end state. `UNANCHORED` = probed, not found. `OTHER MODULE` = counted here, owned elsewhere.

### Bullets where `auth_providers` is the primary theme (28)

| # | Bullet (abridged) | Ver | Verdict | Anchor (220 unless tagged) | Doc section |
|---|---|---|---|---|---|
| 1 | Gateway: added Claude Platform on AWS (`anthropicAws`) upstream; model-not-found advances failover | `.198` | **CARRYOVER** — `anthropicAws` 35 / **193=46** (count *fell*; the catalogue renamed it `anthropic_aws`) | display names + ids at `:95585-95838 (193)`; enum `:100302-100317` | aws §7 |
| 2 | Claude Platform on AWS + Mantle dead-ending "Please run /login" on STS expiry; `awsAuthRefresh` auto-runs | `.198` | **CARRYOVER (proven).** `yHg` `:154687-154722` is byte-equivalent to `ymd` `:135842-135877 (193)` — probe-then-refresh, single-flight latch, 30 s cooldown, all pre-existing. **Real delta:** `J9s` + `api_request_aws_auth_exhausted` (220=1/**193=0**) | `:154687-154722` vs `:135842-135877 (193)`; `:534872-534876`; `:534683-534686` | aws §5 |
| 3 | Transient mTLS handshake failures during in-place client-cert rotation | `.202` | **NET_NEW** — the mTLS module was rewritten; `loadMTLSClientMaterial` 2/**0**, `getMTLSConfig`/`getMTLSAgent`/`clearMTLSCache` all 0 in 193 | `:65114-65215`; `:267867-267887` (the `if (!s) BWn()` line at `:267879`) | transport §2 |
| 4 | Sign-in URL from `claude auth login` / `claude mcp login --no-browser` now one hyperlink | `.202` | **DELTA (larger than the bullet)** — `assumeSupport` 13/**3**, and both 193 uses pass `!1` | `:556647-556663`; `:864399`, `:585456`, `:556755`; `:259584-259590` | login §7 |
| 5 | Warning when your login is about to expire | `.203` | **NET_NEW** — `refreshTokenExpiresAt` 8/**0** (the field was not even persisted in 193) | `:687497-687512`; `:688292-688318`; `:815777-815792` | login §1 |
| 6 | Cowork VM-mode local-agent sessions failing "Not logged in · Please run /login" on CLI 2.1.203+ | `.205` | **DELTA — newly anchored** (scoping had this UNANCHORED on `Not logged in` 4/4). The fix is an entrypoint alias `local_agent → local-agent` | `:46449`, `:46497-46498`; consumers `:156085`, `:162107`, `:166689` | aws §6 |
| 7 | Gateway: `/login` supports Anthropic-operated public gateway endpoints | `.206` | **NET_NEW** — `palantirfedstart` 1/**0**, `is not on a private network` 1/**0**, the whole private-network pre-flight is 220-only | `:153961` (carve-out), `:154113` (`aHg`), `:153957-154012` (`Leu`) | login §6 |
| 8 | Expired login failing every model with a misleading "There's an issue with the selected model" | `.206` | **DELTA — newly anchored.** The message is 1/1 **and** the 401-before-404 ordering already existed in 193 (`:237671`/`:237689 (193)`). Real fix: `OAuthRefreshDeadError` thrown in the client factory; `Login expired` 1/**0** | `:121405-121410`, `:149714`, `:228601-228605`, `:228953` | login §8 |
| 9 | Bedrock multi-minute startup hang with an `awsCredentialExport` helper on restricted egress | `.206` | **NOT ISOLABLE.** I can *rule out* a helper timeout: `bHg` `:154756-154793` is byte-equivalent to `bmd` `:135911-135950 (193)` and **neither has one**. The new bounds are on the fallback default chain | `:154773` vs `:135928 (193)`; `:154922-154930`; `:155999`; `:154799-154820` | aws §3 |
| 10 | Bedrock re-requesting AWS SSO credentials from IAM Identity Center on every API request | `.207` | **DELTA — newly anchored (the headline AWS finding).** All 15 of 193's `providerChainResolver` hits are inside the vendored SDK; 220 supplies one at 8 application sites, backed by a memoised expiry-aware cache | `:156097-156121`; `:107927-107947 (193)`; `:100044`, `:100074`, `:149567`, `:149623`, `:149672`, `:455968`, `:456363`, `:861699` | aws §1 |
| 11 | Windows: indefinite hang when AWS credential resolution stalls; the 60-second stall guard now fires | `.207` | **NET_NEW** — `resolveWithStallGuard` 1/**0**, `CLAUDE_CODE_AWS_CHAIN_RESOLVE_TIMEOUT_MS` 2/**0**, `AWS default-chain credential resolve timed out` 1/**0**. (The task brief attributed this to `.214`; it is `CHANGELOG.md:395`, inside `.207`.) | `:154799-154820`; sole call site `:156110` | aws §4 |
| 12 | `apiKeyHelper` failures hidden behind a generic 401 after ~10 silent retries → shown within 3 attempts | `.208` | **NET_NEW.** Both changelog numbers derive from the bundle: `WU_ = 2` gives exactly 3 attempts; `$U_ = 10` is the old default retry budget | `:534687-534690`, `:534999`, `:534989`; `:154676-154679`; `:228589-228591`, `:228958` | login §2 |
| 13 | Bedrock "Truncated event message received" now names the content-type | `.208` | **CARRYOVER** — 2/2 (`:97362`, `:124031`); only an appended detail changed, no new literal | — | not covered |
| 14 | `/upgrade` showing a login flow instead of the upgrade URL when the browser fails to open | `.208` | **UNANCHORED** — 0/0 on both `/upgrade` and the browser-open failure strings | — | not covered |
| 15 | Bedrock auth failing "Session token not found or invalid" for SSO profiles whose `sso_region` differs (`.207` regression) | `.208` | **NOT ISOLABLE (reconstructed).** The error is vendored and byte-identical (`:82272-82275` vs `:77776-77779 (193)`). The fixed shape is legible: `region` is in `parentClientConfig` and **deliberately absent from `clientConfig`**, and `:83898` reads `region: s?.region ?? n` | `:156105-156109`; `:83893-83901` | aws §2 |
| 16 | Parallel sessions all logging out after wake-from-sleep when many share one credential store | `.211` | **NET_NEW (richest fix in the theme).** `isCompromised` 7/**0**; five compromise gates 1/**0** each | `:155205-155215`, `:155216-155245`, `:155297-155430`; 193 before-picture `:136305-136332 (193)`, `:136448-136462 (193)` | login §3 |
| 17 | Hosted (host-managed) sessions failing at startup on repo-configured mTLS certs / CA bundles / OAuth scopes | `.212` | **NET_NEW** — `host-managed` 6/**0**, `NODE_TLS_REJECT_UNAUTHORIZED` 2/**0**, both warning strings 1/**0** | `:57972-57979`, `:267720-267745`, `:267710-267719`, `:825528-825531` | transport §1 |
| 18 | Enterprise `forceLoginMethod` enforced for VS Code, SDK, `setup-token`, `install-github-app` | `.212` | **DELTA** — setting 18/**13** (carryover); `force_login_method_refused` 2/**0**; four new enforcement sites, one shared validator | `:155947-155974`; `:585189`, `:699972`, `:848455`, `:864331`; 193 had none at `:707726 (193)` | login §4 |
| 19 | Auth status panel title "Cloud authentication" → "Authentication" | `.212` | **NET_NEW (trivial)** — `title: "Authentication"` 220=1/**193=0** at `:576994`; the `Cloud authentication` 1/1 hit is an unrelated GCP error string | `:576994` | not covered in depth |
| 20 | Keep-alive connection pooling disables after a stale-connection error so retries open a fresh socket | `.214` | **⚠ CARRYOVER mechanism.** `Stale connection` 1/**1**, `disableKeepAlive` 3/**3**, `keepalive: !1` 1/**1** (`:81932 (193)`). **Real delta:** three codes added to the classifier set — `ETIMEDOUT`, `ECONNABORTED`, `ERR_SOCKET_CLOSED` (the last is 4/**0**) — **plus a GATE REMOVAL the carryover framing hides: `tengu_disable_keepalive_on_econnreset` is 220=**0** / 193=**1** (`:602837 (193)`), so 193 gated the branch and 220 runs it unconditionally** | `:228052-228060` vs `:237172 (193)`; `:534522-534526`, `:534548-534557`, `:86281-86286`, `:86471` | transport §3 |
| 21 | Feature flags going stale in long-running sessions after the OAuth token rotates | `.214` | **NET_NEW** — `installEvalAuthedOverride` 1/**0**, `tengu_gb_eval_authed_enable` 1/**0**, `eval-authed` 3/**0**; 193's `awn` `:147414-147426 (193)` has none of the block | `:156733-156758`, `:156695-156708`, `:156372-156399`, `:156841` | login §5 |
| 22 | Spend limit adjustment prompt shows the server's reason for rejection | `.216` | **DELTA, not pinned** — `spend limit` 25/**15**; the +10 is spread across the credits UI. I did not isolate the reason-rendering site | — | not covered |
| 23 | Corporate mTLS, TLS-verify, OAuth scope, and proxy settings ignored in Claude Desktop sessions | `.217` | **NET_NEW (a narrowing of #17)** — the `(!SHe.desktopHost \|\| Q5u.has(t))` conjunct plus the Desktop-specific warning text; `desktopHost` 6/**4** | `:267738-267741`, `:267715`, `:267931` | transport §1.2 |
| 24 | Login-expiry warning appears 3 days before expiry instead of 5 | `.217` | **NET_NEW** — one multiplier, `tff = 3 * rff` | `:687512` (+ `:687502` the `expiresAt` sanity guard) | login §1 |
| 25 | Gateway spend metering prices Bedrock `application-inference-profile` ARNs at configured rates | `.218` | **CARRYOVER** — `application-inference-profile` 6/6; ARN detection at `:111144` has a 193 twin. Rate-table lookup changed with no new literal | — | not covered (telemetry) |
| 26 | Bedrock setup wizard failing assume-role profiles in partitioned AWS regions / proxy-only networks | `.218` | **CARRYOVER at the literal level** — `aws-us-gov` 9/9, `assume-role` **0/0 in both**. The wizard *did* gain `invalidateAuth` hooks (6/**0**, `:861706`, `:861749`) and `RXt`-based proxy handlers (`:580981-580983`), which is the proxy-only half | `:861699-861749`, `:580981-580983` | aws §1.2 (mechanism only) |
| 27 | Server-managed settings: benign feature/cost toggles no longer trigger the approval prompt | `.218` | **UNANCHORED** — `tengu_advisor_settings_sync` 1/0 but not read; `settings-approval` 0/0 | — | not covered |
| 28 | Fixed SSL certificate errors (TLS-inspecting proxies, missing `NODE_EXTRA_CA_CERTS`, expired certs) burning retries before showing actionable guidance | `.199` | **DELTA, partially anchored.** The main TLS-error sets `Gcs`/`UZg` (`:228017-228039`) are carryover (each member 1/1 or 2/2), but a **second, login-flow-local 6-code trust-failure set** exists only in 220: `Knb` at `:582524-582530` (`SELF_SIGNED_CERT_IN_CHAIN` 3/**2**, `UNABLE_TO_VERIFY_LEAF_SIGNATURE` 3/**2** — the extra hit is `:582529`). I located it but did not trace its consumer | `:582524-582530`; `:228017-228039` | not covered in depth |

### Bullets counted against this theme but owned by another module (10)

| # | Bullet (abridged) | Ver | Verdict | Owner |
|---|---|---|---|---|
| 29 | Bg/agent-view sessions dropping a shell-exported `ANTHROPIC_BASE_URL` | `.203` | **UNANCHORED** — `ANTHROPIC_BASE_URL` 47/40 is far too common to carry the bullet | `36_background_agents` |
| 30 | Remote managed settings recorded as consented from `claude -p` / SDK | `.207` | **NET_NEW** — `deferred_non_interactive` `:455663` (3/**0**) | `38_permissions` |
| 31 | `/usage-credits` rejects malformed amounts; >$1,000 needs typed confirmation | `.207` | **NET_NEW** — `tengu_usage_credits_admin_request_confirm_shown` `:692741` (1/**0**) | `43_slash_commands` |
| 32 | Vertex/Bedrock attempting the default Opus model at startup + spurious fallback notice | `.211` | **UNANCHORED** — `Falling back to` 11/10; partial mechanism `jji` `:110561-110573` | `47_models` |
| 33 | Background jobs on gateway auth returning "Not logged in" after daemon respawn | `.211` | **NET_NEW** — `tengu_bg_adopt_token_lost_respawn` `:553850` (3/**0**) | `36_background_agents` |
| 34 | `/usage-credits` asks for confirmation before messaging org admins | `.211` | **NET_NEW** — same anchor as #31 | `43_slash_commands` |
| 35 | Auto mode denying commands with "HTTP 401" classifier errors after token rotation | `.216` | **DELTA** — `HTTP 401` 3/**0**, `tengu_auto_mode_classifier_queue` `:442629` | `38_permissions` |
| 36 | Claude-in-Chrome 403-looping on reconnect when the OAuth token lacks a scope | `.216` | **NET_NEW** — `tengu_oauth_refresh_invalid_scope_fallback` `:155363` (1/**0**); **the mechanism lives in this theme's refresh function** and is described in login §3 | `56_chrome_ide` |
| 37 | MCP re-authenticate revoking working credentials before the new sign-in succeeds | `.216` | **NET_NEW** — `tengu_mcp_proxy_needs_approval_retry` `:293996` | `39_mcp` |
| 38 | "Remote Control is only available via api.anthropic.com" now names the causing setting | `.219` | **DELTA** — base string 3/3; five-way provider-naming branch `:535665`, `:535662` (the `CLAUDE_CODE_USE_GATEWAY` arm is quoted in aws §8) | `54_remote_control` |

---

## Undocumented deltas this module surfaces (no changelog bullet at all)

| Finding | Evidence |
|---|---|
| **The AWS credential path gained a whole caching/timeout layer.** No bullet mentions a cache, a kill switch, or an eviction policy | `CLAUDE_CODE_SKIP_AWS_CRED_CACHE` 10/**0** at 8 guard sites; `getDefaultAwsProviderChain` / `invalidateDefaultAwsProviderChainDebounced` / `clearAwsHelperCredentialsCache` / `AWS_CHAIN_RESOLVE_REQUEST_TIMEOUT_MS` all 1/**0**; `providerChainResolver` 28/15 |
| **The mTLS module went from two memoised getters to an 8-export module with async content-aware reload.** No bullet mentions the rewrite (only its rotation symptom) | export table `:65115-65124` — 6 of the 8 names are 220-only; 193's whole module is `:59421-59475 (193)` |
| **`isHostManagedProviderAuth` (`Yv`) became a first-class predicate**, and `CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST` usage went 14 → 34 | `:154266-154268`; the env-var count more than doubled |
| **`api_request_aws_auth_exhausted` — a second credential breaker in the retry loop**, sibling to the documented `apiKeyHelper` one, with no bullet of its own | `:534683-534686`, `GU_ = 2` `:534998` |
| **`Weu` — background agents/teammates are explicitly unsupported on host-managed credentials**, with a written remediation. No bullet | `:155980-155981` (220-only), thrown at `:154286` |
| **Gateway TLS-fingerprint pinning** (`gatewayTrust` 3/**1**, `gateway TLS certificate does not match the pinned fingerprint` 1/**0**) and the `unpinned: !0` env on-ramp that deliberately opts out of it | `:154090-154091`, `:154100`, `:154353`, `:154378-154392` |
| **`CLAUDE_GATEWAY_ALLOW_LOOPBACK` gained its first consumer**, and the address classifier hard-blocks the EC2 IPv6 IMDS endpoint `fd00:ec2::254` regardless | `:860522-860524`, `:860525-…` |
| **`NODE_TLS_REJECT_UNAUTHORIZED` appears in the bundle for the first time** — only as something a repo may not set | 220=2 / **193=0**, `:57977`, `:58274` |

---

## False deltas caught (things that read as new but are not)

Each measured in **both** bundles. These are the rows a bullet-first reading gets wrong.

| Reads as new | Reality | Evidence |
|---|---|---|
| `.198` "`awsAuthRefresh` now runs automatically on STS expiry" | **Byte-equivalent carryover.** `_GROUND_TRUTH` left this open ("only the auto-invocation point can be a delta, and I could not isolate it") — the auto-invocation point *is* the probe-then-refresh block, and it is identical | `:154687-154722` vs `:135842-135877 (193)`, including the log strings, the single-flight latch, the 30 s cooldown and the generation counter |
| `.214` "Changed keep-alive connection pooling to disable after a stale-connection error" | **The whole mechanism shipped in 2.1.193.** Only the trigger set widened | `Stale connection — disabling keep-alive for retry` 1/**1**; `keepalive: !1` builder `:86471` vs `:81932 (193)`; set `:228052-228060` vs `:237172 (193)` |
| `.206` "misleading model error … instead of prompting to run `/login`" looks like a branch-ordering bug | **The 401 branch was already before the 404 branch in 193.** Do not write up an ordering swap | 220 `:228620` / `:228668`; 193 `:237671` / `:237689 (193)` |
| `.208` "`sso_region` differs from Bedrock region" anchored on `sso_region` | **9/9, and all nine hits are vendored `@aws-sdk`.** The Claude Code side has no such literal | `:82265`, `:83941-83981`, `:86012` vs `:77769`, `:79449-79489`, `:81510 (193)` |
| `.206` "multi-minute hang using an `awsCredentialExport` helper" anchored on a helper timeout | **There is no timeout on the helper in either build.** `awsAuthRefresh` has one (3 min) and `apiKeyHelper` has one (10 min); `awsCredentialExport` has none, then and now | `:154773` vs `:135928 (193)`; contrast `:154729` and `:154668` |
| `.212` "hosted sessions … mTLS certs" anchored on `clientCertificate` | **24/24, and every hit is vendored** (MSAL, node-forge TLS). The Claude Code names are `CLAUDE_CODE_CLIENT_CERT` / `_KEY` | `:134392-140510`, `:186793-187791` are all library code |
| `.217` "Claude Desktop" anchored on `mtls` (3/**1**) | **The two extra hits are MSAL's `mtls_endpoint_aliases`** (`:856012`, `:857122`) — vendor noise, not the fix | whole-word check |
| `.212` "Cloud authentication → Authentication" anchored on `Cloud authentication` (1/1) | **The single 220 hit is an unrelated GCP error string.** The real anchor is `title: "Authentication"` 1/**0** | `:576994` |
| `CLAUDE_CODE_USE_GATEWAY` at 193=2 looks like carryover | **Both 193 hits are allow-list membership only** — no accessor, no consumer. The variable was reserved, not implemented | `:192886`, `:193027 (193)` vs `:32928`, `:154342-154359`, `:535662` |
| `configureGlobalMTLS` 3/**2** looks like a new call site | **The extra hit is the export-table entry** (`:65122`). There is still exactly one call site (`:827784`) | `:827783-827786` vs `:617128-617131 (193)` |
| `isOAuthRefreshKnownDead` 1/1 suggests the dead-token fail-fast is carryover | **The predicate is carryover; the throw site, the error class and the message are not** | `Login expired` 1/**0**, `OAuth session expired and could not be refreshed` 1/**0**, throw at `:149714` |
| `prefetchAwsCredentialsAndBedRockInfoIfSafe` looks like a new startup optimisation | **1/1**, and it already fire-and-forgot `JQ()` in 193 | `:154922-154930` |
| `Not logged in` (4/4) as the anchor for `.205` Cowork | **Carryover message.** The fix is an entrypoint-string alias four modules away | `:228940` vs `:237973 (193)`; fix at `:46449` |

---

## Corrections to upstream scoping / brief

1. **`.207` #21, not `.214`.** The task brief lists the Windows 60-second AWS stall guard under `.214`.
   It is `CHANGELOG.md:395`, inside the `2.1.207` section (lines 373-399). The `.206`-`.210` scoping
   file has it correctly as `.207` #21.
2. **`.217`, not `.203`/`.219`, for the 5→3 day change.** The brief pairs the login-expiry threshold
   with `.203`/`.219`. `.203` introduced the warning (`CHANGELOG.md:462`); the `5 → 3` change is
   `CHANGELOG.md:90`, in the `2.1.217` section. `.219` has no login-expiry bullet.
3. **`.214`, not `.211`, for the stale feature flags.** The brief lists it under `.211`; the bullet is
   `CHANGELOG.md:178`, inside `2.1.214`.
4. **`_GROUND_TRUTH` §2's open question on `awsAuthRefresh` is now closed** — see the false-delta table.
5. The `.206`-`.210` scoping's summary line *"`auth_providers` … 6 CARRYOVER, 0 DELTA"* should read
   **2 CARRYOVER, 2 DELTA-newly-anchored, 2 NOT-ISOLABLE** on the evidence in
   [`aws_and_provider_plumbing.md`](aws_and_provider_plumbing.md).

---

## Not covered

Honest list of what this module does **not** answer, and why.

1. **`.216` #34 (spend-limit rejection reason).** `spend limit` is 25/15 and the growth is spread over
   the usage-credits UI; I did not isolate the site that renders the server's reason. The scoping's
   suggested anchor `:227252` was not read by me, so I cite nothing.
2. **`.218` #32 (server-managed settings approval prompt).** Unanchored in scoping and I found no
   better probe. `tengu_advisor_settings_sync` exists but I did not read it.
3. **`.208` #14 (`/upgrade` showing a login flow).** 0/0 on every probe; no literal exists in either
   bundle for the upgrade-URL path.
4. **`.199` #28 (SSL errors fail fast).** Partially anchored: I found the 220-only login-flow trust
   set `Knb` (`:582524-582530`) but did not trace its consumer or confirm it implements "fail
   immediately with the fix hint" rather than being an unrelated wizard check.
5. **`.208` #13 (`Truncated event message received`).** Recorded CARRYOVER on the 2/2 count from the
   ledger; I did not read `:97362` / `:124031`.
6. **`.203` #29 (`ANTHROPIC_BASE_URL` in background sessions)** and the other nine
   "owned elsewhere" rows: verdicts and anchors are reproduced from the scoping files, but except for
   `.216` #36 (whose mechanism I read at `:155363`) I did not read those sites in the 2.1.220 bundle
   and cite no line for them.
7. **The `.206`/`.207`/`.208` AWS trio cannot be split.** Sections 2 and 3 of the AWS doc say so
   explicitly and give reconstructions rather than claims. Splitting them requires the 2.1.206 and
   2.1.207 bundles, which are not in this tree.
8. **`Km()`** (the "BedRockInfo" half of the startup prefetch) and the Bedrock setup wizard's
   partitioned-region logic are named but not dissected.
9. **The GCP/Vertex credential path** is covered only where it shares code with AWS or with the
   provider inventory. `refreshGcpAuth` (`etu`), `checkGcpCredentialsValid` (`Zeu`) and the WIF /
   Anthropic-profile path (`shouldUseWIFAuth`, `isWIFDispatchAuth`, `ANTHROPIC_PROFILE`) are visible in
   the export table but not analysed — no bullet in this window targets them.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> All symbols discovered by this module are staged for merge in
> [symbol_additions_v2_1_220_auth_providers.md](../00_overview/symbol_additions_v2_1_220_auth_providers.md)
> (routing: **Auth**, **Model Selection** and **Telemetry** groups → `symbol_index_infra_platform.md`;
> **UI Components** group → `symbol_index_infra_integration.md`).

The five highest-value entry points for a reader:
- the auth module export table (`kY`, `:154127-154262`) - 135 readable names, the key to this whole theme
- `refreshOAuthTokenLocked` (`yXi`, `:155297-155430`) - lock compromise, abort signal, compare-and-swap
- `getDefaultAwsProviderChain` (`oW`, `:156097-156121`) - the credential cache that fixes per-request SSO
- `filterEnvForSettingsSource` (`eWu`, `:267720-267745`) - the host-managed transport policy in one loop
- `loadMTLSClientMaterial` (`P7t`, `:65187-65197`) + `reapplySettingsDerivedEnv` (`l9`, `:267867-267887`) - safe in-place cert rotation
