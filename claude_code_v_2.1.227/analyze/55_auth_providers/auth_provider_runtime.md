# Authentication, Provider, and Transport Architecture in 2.1.227

## Scope

This document re-derives the complete current-build authentication and provider runtime from
`cli_inner_pretty.js`. It does not treat the 2.1.220 report as an unchanged implementation. The
focused Bedrock region-prefix addition remains in
[`bedrock_region_prefix.md`](./bedrock_region_prefix.md); this document covers the surrounding
provider selection, credential precedence, token lifecycle, feature-evaluation identity, managed
login policy, AWS credential plumbing, and authenticated transport.

The most important 2.1.220 to 2.1.227 refactor is the GrowthBook path. In 2.1.220, the memoized
client constructor (`VXi`, `2.1.220:156831-156868`) synchronously captured user attributes before
performing any token refresh. In 2.1.227, `GrowthBookManager.createClient`
(`sRa.createClient`, `:617746-617803`) is asynchronous and refreshes an expiring login before it
reads both auth headers and user attributes. That ordering is the concrete implementation behind
the 2.1.227 changelog fix for Max users being evaluated without their subscription tier after
startup with an expired access token.

The current design has four distinct decisions that should not be conflated:

- Provider routing decides which API protocol and cloud identity system will be used.
- Credential selection decides which token or key is authoritative within that route.
- Credential refresh decides whether the selected identity can be renewed without replacing a
  more authoritative source.
- Transport policy decides which TLS, proxy, and socket state may accompany that identity.

## Runtime architecture

```text
provider environment / model ID
        |
        v
provider route -----------> Bedrock / Vertex / Foundry / gateway / first party
        |
        v
credential precedence ----> OAuth token | auth token | API key | helper | cloud SDK chain
        |
        +----> expiry / 401 recovery ----> lock + reread + refresh + CAS persistence
        |                                      |
        |                                      v
        |                              subscription metadata
        |                                      |
        +------------------------------> feature attributes
        |
        v
managed-policy filtering --> proxy / CA / mTLS / pinned gateway / keep-alive transport
```

## Core algorithms and decisions

### Provider precedence and per-model secondary routing

**What it does:** Chooses the active API provider globally, then optionally selects a compatible
secondary provider for an individual model.

**How it works:**
1. `getApiProvider` (`Wn`, `:97625-97640`) checks gateway predicates first. Gateway routing therefore
   overrides every individual third-party provider environment switch.
2. The remaining fixed precedence is Bedrock, Foundry, Claude Platform on AWS, Claude Platform on
   Google Cloud, Mantle, Vertex, and finally first-party Anthropic.
3. `getSecondaryProvider` (`rUt`, `:97647-97651`) exposes Mantle as a secondary only when Bedrock is
   primary and the Mantle switch is also enabled.
4. `getProviderForModel` (`Ab`, `:97654-97667`) first handles Mantle-native `anthropic.*` model IDs
   that lack a version suffix.
5. Otherwise it reads the model catalog's provider-specific availability. It switches to the
   secondary only when the model is unavailable on the primary and available on the secondary.
6. Capability predicates separately classify first-party-compatible, Claude Platform, and AWS-style
   providers; callers therefore do not repeatedly reconstruct provider sets.

**Why this approach:**
- A single precedence chain makes contradictory environment switches deterministic. Rejecting all
  combinations would be stricter, but would prevent the intentional Bedrock-to-Mantle failover.
- Per-model routing is necessary because provider catalogs are not symmetric. Selecting one provider
  for the entire process would make a model look unavailable even when the configured secondary can
  serve it.
- Capability predicates are more stable than testing provider names throughout request code. The
  trade-off is that adding a provider requires updating both route precedence and capability groups.

**Key insight:** Provider selection is not one global enum lookup. It is a global route followed by a
catalog-aware per-model correction, with only one explicitly supported dual-provider combination.

### Token and API-key precedence are separate decisions

**What it does:** Resolves OAuth/auth-token identity independently from API-key identity, while
preserving the source label needed by policy, diagnostics, and retry behavior.

**How it works:**
1. `getAuthTokenSource` (`tT`, `:615561-615577`) handles bearer-like credentials. Simple mode permits
   only `apiKeyHelper`; normal mode next considers an allowed `ANTHROPIC_AUTH_TOKEN`, an explicit
   `CLAUDE_CODE_OAUTH_TOKEN`, injected Remote Control or file-descriptor tokens, `apiKeyHelper`, an
   Anthropic profile, and finally a stored Claude.ai login.
2. A stored login is accepted only when it has a recognized Claude.ai scope and a non-empty access
   token. Merely having credential-shaped data on disk is insufficient.
3. `getAnthropicApiKeyWithSource` (`vF`, `:615658-615692`) follows a different chain: simple-mode env
   key/helper, host-policy-specific env handling, previously approved custom env keys, `/login`
   managed keys, `apiKeyHelper`, and the remaining persisted/profile source.
4. Callers that must inspect precedence without executing a helper pass
   `skipRetrievingKeyFromApiKeyHelper`; the result still says `apiKeyHelper`, but its key is `null`.
5. `isOAuthMode` (`UE`, `:615520-615543`) combines provider, host, socket, token, and key state rather
   than assuming that a first-party URL automatically means OAuth.
6. Diagnostics retain source names so remediation can say whether to unset an environment variable,
   remove a helper, log out of a profile, or restart a host-managed session.

**Why this approach:**
- OAuth tokens and API keys have different refresh and retry semantics, so collapsing them into one
  credential object would encourage unsafe fallbacks.
- Source labels are security state, not cosmetic metadata. A user-supplied environment token must not
  silently turn into a stored-login token after a 401.
- Deferring helper execution lets status and policy checks inspect configuration without running an
  external command, at the cost of representing “configured but not fetched” separately from absent.

**Key insight:** The resolver returns both value and provenance because credential precedence cannot
be enforced correctly from the secret value alone.

### Trust-gated, stale-tolerant API-key helper cache

**What it does:** Runs `apiKeyHelper` at a controlled cadence, coalesces concurrent requests, and
keeps a previously valid key available during a background refresh failure.

**How it works:**
1. `getApiKeyFromApiKeyHelper` (`BOr`, `:615732-615747`) returns `null` when no helper is configured.
2. The helper TTL defaults to five minutes and can be overridden by
   `CLAUDE_CODE_API_KEY_HELPER_TTL_MS`; invalid negative values are rejected and logged.
3. A fresh cached value is returned immediately. When a cached value is stale, one background refresh
   promise is started while the old value remains usable.
4. With no cached value, the same promise becomes a blocking cold-start fetch. Concurrent callers
   share it instead of launching duplicate helper processes.
5. `executeApiKeyHelper` (`PIS`, `:615778-615813`) refuses a project/local-sourced helper before
   workspace trust, runs with a ten-minute bound, and requires one printable-ASCII token on stdout.
6. A cold-start failure stores the single-space sentinel `" "`; a refresh failure preserves the old
   non-sentinel value and advances its timestamp. The last error is retained for diagnostics and the
   API retry breaker.
7. A generation counter prevents a late result from repopulating a cache that was explicitly cleared.

**Why this approach:**
- Stale-while-refresh avoids pausing every API request when a helper-backed credential reaches its
  TTL. Blocking on every renewal would amplify login-tool latency.
- The sentinel distinguishes “helper failed” from “no helper configured” without exposing error text
  as a credential. The trade-off is a non-obvious internal value that must never escape to a request.
- Trust gating prevents repository-controlled settings from executing a credential command before the
  user approves the workspace.
- Strict output validation rejects prompts, shell noise, and multiline accidental disclosures.

**Key insight:** The cache optimizes availability without erasing failure state: old credentials can
continue briefly, while the retry loop still knows that helper renewal failed.

### Cross-process OAuth refresh with race rechecks

**What it does:** Ensures that many Claude Code processes sharing one credential store do not all
rotate the same refresh token or overwrite a newer sibling result.

**How it works:**
1. `checkAndRefreshOAuthTokenIfNeededWithOutcome` (`nsi`, `:616537-616545`) coalesces ordinary refresh
   checks in-process. Forced/401 refreshes bypass that shared promise because they carry a failed token
   identity that must be rechecked.
2. `refreshOAuthTokenLocked` (`FIa`, `:616547-616647`) checks credential-file mtime, cached expiry,
   refresh-token availability, known-dead tokens, and refreshability before acquiring a lock.
3. It clears caches and rereads credentials before locking, then rereads again after locking. A changed
   access token means another process already won, so the function returns `refreshed` without posting.
4. `acquireOAuthRefreshLock` (`tRa`, `:616466-616499`) acquires both the current lock path and a legacy
   path. This prevents mixed-version processes from refreshing concurrently.
5. Lock state becomes an abort signal. If lock maintenance reports compromise before the HTTP post,
   the request is not started; compromise during the post aborts the token exchange.
6. Lock contention retries up to five times with one-to-two-second jitter. Invalid-scope errors on the
   expanded default scopes get one fallback attempt with the token's original scopes.
7. `persistRefreshedOAuthTokens` (`iEr`, `:616125-616190`) uses a compare-and-swap mutation keyed by the
   posted refresh token. It retries storage failures three times, but adopts a sibling's newer write
   instead of overwriting it.
8. An invalid grant marks the refresh token dead in memory and clears the matching on-disk token so
   later requests fail fast rather than forming a refresh storm.

**Why this approach:**
- An in-process mutex alone cannot protect the shared keychain/config file. A file lock alone would
  still serialize many already-resolved callers unnecessarily, so both levels are used.
- Rechecking before and after lock acquisition converts races into successful adoption rather than
  errors.
- Supporting the legacy lock path costs an extra lock operation but preserves safety during rolling
  upgrades where old and new CLI processes coexist.
- Compare-and-swap is safer than unconditional persistence because token rotation can invalidate the
  very refresh token a slower process is about to store.

**Key insight:** The lock does not make the initial observation permanently true. Correctness comes
from repeated reads plus compare-and-swap, with the lock only narrowing the race window.

### Refresh exchange preserves subscription metadata

**What it does:** Exchanges a refresh token and returns an access credential augmented with the
account metadata required by feature gates and user-facing plan behavior.

**How it works:**
1. `refreshOAuthToken` (`z0e`, `:614862-614931`) posts the refresh grant with explicit scopes, client
   ID, a 30-second timeout, and the caller's compromise abort signal.
2. It computes access-token and refresh-token expiry, normalizes returned scopes, and retains the old
   refresh token when the server does not rotate it.
3. It inspects both the persisted OAuth account and current tokens. Profile fetching is skipped only
   when account metadata is complete and the current token already has both `subscriptionType` and
   `rateLimitTier`, or when the caller explicitly requests a skip.
4. Otherwise `fetchOAuthProfile` (`WWo`, `:614974-614996`) maps the organization type to subscription
   type and reads rate-limit tier, seat tier, billing type, extra-usage state, onboarding flags, and
   account timestamps.
5. Refreshed profile fields are merged into the persisted account record without dropping fields that
   were absent from the response.
6. The returned token object chooses freshly fetched subscription metadata first and cached token
   metadata second, with `null` as the explicit unknown state.

**Why this approach:**
- Token validity and plan identity are coupled at refresh time because the profile endpoint needs the
  new bearer. Fetching profile independently before refresh would reproduce the expired-token bug.
- Conditional profile fetching avoids an extra network request on every rotation once both account
  and tier metadata are complete.
- Preserving missing fields makes partial server responses non-destructive, but it means cache age must
  be managed elsewhere when plan state can change.

**Key insight:** A refreshed token is not considered fully described by its bearer and expiry. Its
subscription tier is part of the authentication result because downstream feature evaluation depends
on it.

### Source-preserving OAuth 401 recovery

**What it does:** Recovers from a rejected bearer through the source capable of rotating it, without
silently replacing a long-lived caller-supplied token with a different stored identity.

**How it works:**
1. `recoverOAuth401` (`ZIS`, `:616342-616437`) clears caches and reads the latest stored token.
2. When no refresh token exists, an SDK-provided token callback gets first chance to supply a
   different bearer.
3. A local, user-supplied `CLAUDE_CODE_OAUTH_TOKEN` is deliberately retained when the process is not a
   remote child and not using the Unix socket. Stored-login credentials are not adopted in that
   branch; the user is told to mint a new token or return to `/login`.
4. Host-injected, descriptor, and remote-child paths may adopt a newer unexpired token from disk,
   because rotation is owned by the host rather than by the CLI process.
5. Remote/injected tokens can wait for an externally rotated environment token. The default wait is
   60 seconds for remote children and zero for ordinary local sessions.
6. An unrecovered remote child records the first failure. Once the configurable ten-minute failure
   horizon is exceeded, it schedules exit so the runner can recycle the process with fresh credentials.
7. If a refresh token exists but the reread access token differs from the rejected bearer, recovery is
   already complete. Otherwise the function enters the forced locked-refresh path.
8. API request retry counters remain independent for OAuth, host auth, Remote Control, AWS auth, and
   `apiKeyHelper`, preventing one credential type from consuming another type's breaker budget.

**Why this approach:**
- The old unsafe alternative was convenient failover: replace an expired environment token with the
  stored login. It can switch account, organization, subscription, and lifetime semantics invisibly.
- Remote workers need an observation window because their parent can rotate credentials out of band;
  local interactive sessions benefit more from immediate, actionable failure.
- Recycling a remote child is a last resort for zombie prevention, not the first response to one 401.

**Key insight:** Recovery authority follows credential provenance. A stored credential is newer data,
but it is not necessarily the same identity the caller explicitly selected.

### Subscription-aware feature-client initialization

**What it does:** Creates the remote feature-evaluation client only after making a bounded attempt to
refresh login state, so plan-sensitive flags receive current subscription attributes.

**How it works:**
1. `GrowthBookManager.getClient` (`sRa.getClient`, `:617742-617745`) memoizes the asynchronous creation
   promise so concurrent feature reads share one initialization.
2. `createGrowthBookClient` (`sRa.createClient`, `:617746-617803`) captures a generation number and
   checks workspace trust before reading any secret-bearing auth state.
3. In a trusted workspace it awaits OAuth refresh through a five-second wrapper. Timeout or refresh
   failure is logged but does not prevent a client from being created.
4. Only after that refresh attempt does it resolve auth headers, then call
   `getGrowthBookUserAttributes` (`aRa`, `:618113-618155`). Those attributes include account UUID,
   organization UUID, `subscriptionType`, and `rateLimitTier` from the refreshed auth state.
5. It records whether the client was authenticated, whether auth resolution failed transiently, the
   bearer used, and the account/organization identity. Generation and disposed checks prevent a late
   initialization from reviving stale state.
6. Authenticated clients initialize remote evaluation with a five-second bound. Unauthenticated
   clients are returned immediately and can be reinitialized after auth becomes usable.
7. Refresh logic compares the current bearer and account identity with the captured values. A bearer
   rotation recreates the client; an account change also resets exposure identity rather than carrying
   experiment state across users.
8. Payload processing rejects malformed, non-object, and value-less feature entries, synchronizes a
   validated value map to disk, and retains exposure metadata separately.

**Why this approach:**
- In 2.1.220, synchronous client construction read user attributes before refresh. An expired token
  could therefore produce valid feature evaluation with missing tier data—the most dangerous kind of
  failure because it looked successful.
- Refresh-before-snapshot establishes a causal order. A single shared initialization promise avoids
  paying that latency for every gate.
- The five-second limit preserves startup availability when auth or network services are degraded.
  The trade-off is a controlled unauthenticated fallback that must later reinitialize.
- A stateful class makes generation, auth identity, refresh loop, disk cache, and exposure lifecycle
  explicit. It is more complex than 2.1.220's module globals, but stale async completions become easier
  to reject coherently.

**Key insight:** The 2.1.227 fix is an ordering invariant: refresh credential, resolve headers, then
snapshot subscription attributes. Merely adding tier fields to the attribute object would not fix the
expired-startup case because those fields already existed in 2.1.220.

### Fail-closed managed login and organization pinning

**What it does:** Enforces administrator-selected login method and organization across CLI login,
stored credentials, environment tokens, and unreadable managed policy.

**How it works:**
1. `authLogin` (`auH`, `:961726-961832`) rejects contradictory `--console` and `--claudeai` flags, then
   applies `forceLoginMethod`. Gateway-enforced machines redirect users to interactive `/login`.
2. A headless refresh-token login requires explicit scopes. Both headless and browser/manual OAuth
   flows persist the result and immediately call the organization validator before declaring success.
3. `validateForcedLoginOrganization` (`ihe`, `:617070-617156`) exempts provider-managed hosts because
   the host owns identity, while recording telemetry if local pins also exist.
4. First-party organization pins reject non-OAuth Anthropic credentials because API keys and generic
   auth tokens cannot prove membership in the pinned Claude.ai organization.
5. If managed policy is expected but its file is unreadable, validation fails closed with the source
   error. An empty organization allowlist is also rejected as administrator misconfiguration.
6. The current bearer is validated remotely. Network/revocation failure does not silently accept an
   unverifiable organization.
7. A mismatched explicit OAuth environment token receives source-specific remediation; a mismatched
   stored login is directed back through login.
8. `validateForceLoginMethod` (`ekt`, `:617173-617194`) independently verifies the effective current
   login kind at non-login enforcement points.

**Why this approach:**
- Enforcement after token persistence ensures the exact issued identity is checked, including SSO
  redirects that may select an unexpected organization.
- Failing open on unreadable policy would turn a local file-permission problem into a policy bypass.
- Provider-managed sessions are exempt because duplicating host policy in the child process could
  reject a credential that the child cannot inspect or change.
- Remote validation introduces a network dependency, but local account labels are not strong enough
  evidence for an enterprise organization pin.

**Key insight:** The policy validates identity evidence, not merely login UI choice. Selecting the
Claude.ai flow is insufficient until the resulting bearer proves membership in an allowed organization.

### Expiry-aware AWS provider-chain reuse and helper orchestration

**What it does:** Avoids resolving AWS SSO/default-chain credentials on every API request while still
refreshing near expiry and invoking configured auth helpers only when needed.

**How it works:**
1. `resolveAwsHelpers` (`Tie`, `:617392-617402`) runs the AWS identity probe and then
   `awsAuthRefresh` only when existing credentials are unusable. It separately runs
   `awsCredentialExport` and caches the result according to credential expiry.
2. Both helpers are trust-gated when sourced from project/local settings. `awsAuthRefresh` is
   single-flight and has a 30-second cooldown after completion; its subprocess has a three-minute
   bound.
3. `getAwsCredentialsFromExportHelper` (`UIS`, `:615873-615920`) validates the exported JSON as an AWS
   STS credential structure and parses optional expiration rather than accepting arbitrary stdout.
4. `getDefaultAwsProviderChain` (`wV`, `:617403-617428`) creates one memoized provider per
   `(AWS_PROFILE, region)` key. The AWS SDK chain receives the Bedrock region only in
   `parentClientConfig`, leaving SSO's own region resolution intact.
5. Credential resolution uses a proxy-aware STS request handler and
   `resolveAwsCredentialsWithTimeout` (`XIa`, `:615934-615958`) with a default 60-second stall bound.
6. Credentials more than 30 seconds from expiry are fresh. When refresh began before the freshness
   boundary and the old credentials have not actually expired, the old value can remain usable while
   renewal completes.
7. Debounced invalidation (`HMr`, `:615961-615969`) clears one profile/region chain at most once per ten
   seconds; full cache reset clears helpers, provider chains, SSO caches, and invalidation timestamps.
8. Provider client factories pass this resolver unless explicit credentials, host-pinned credentials,
   or `CLAUDE_CODE_SKIP_AWS_CRED_CACHE` choose another path.

**Why this approach:**
- SSO resolution can perform filesystem, process, and network work. Per-request resolution multiplies
  latency and can repeatedly prompt Identity Center.
- Expiry-aware stale reuse avoids a cliff exactly at the refresh margin while refusing credentials
  after true expiration.
- Keying by profile and region prevents one AWS route from leaking credentials or STS configuration
  into another.
- The cache kill switch aids compatibility and diagnosis, but sacrifices the main latency and prompt
  suppression benefit.

**Key insight:** The cached value is a provider closure, not one immortal credential. It preserves the
AWS chain's refresh semantics while bounding how often Claude Code reconstructs and resolves it.

### Host-managed environment filtering and content-aware mTLS rotation

**What it does:** Prevents lower-trust settings from redirecting a host-owned credential, while safely
rebuilding TLS material when certificate files change in place.

**How it works:**
1. `filterHostManagedProviderEnvironment` (`Wdd`, `:242050-242079`) receives the settings source and a
   context distinguishing provider-managed auth, desktop host, and host-orchestrated sessions.
2. Provider-routing/auth variables are removed when the host owns routing. Custom Anthropic headers
   are also removed because they can change authentication semantics.
3. Under the explicit provider-managed flag, proxy/TLS/OAuth-scope variables are removed according to
   source and desktop context. Repository settings receive a specific warning that such channels must
   be configured at user or managed scope.
4. A pre-settings environment snapshot protects host-spawned variables: settings cannot overwrite keys
   claimed by the host process.
5. Applying new settings compares previous CA, cert, and key paths, clears proxy/CA/mTLS caches, then
   asynchronously reloads certificates before rebuilding global agents.
6. `loadMTLSClientMaterial` (`apr`, `:62539-62551`) reads certificate and key concurrently and compares
   both path and content. Same-path content rotation therefore invalidates the cached agent.
7. `getMTLSAgent` (`Qts`, `:62495-62507`) keys the HTTPS agent by the resolved mTLS config and CA
   object, and enables keep-alive only on the newly constructed matching agent.
8. During settings reapplication, the old material is not cleared prematurely when the environment
   still points at it; the async load decides whether content actually changed.

**Why this approach:**
- Credentials and transport routing form one trust boundary: a lower-trust proxy, CA, or custom header
  can redirect or reinterpret a perfectly valid host credential.
- Blanket suppression for every desktop setting would break legitimate user/administrator enterprise
  TLS configuration, so the filter considers both source and session kind.
- Comparing file content rather than only paths supports certificate rotation mechanisms that replace
  bytes in place.
- Loading cert and key together minimizes inconsistent windows, although one failed half intentionally
  yields no complete mTLS pair until configuration is corrected.

**Key insight:** Host-managed auth is protected before settings mutate `process.env`, and mTLS cache
identity includes file content—not just the filenames that often remain stable during rotation.

### Stale-connection retirement and gateway certificate pinning

**What it does:** Prevents retries from reusing a poisoned pooled socket and gives gateway sessions an
optional identity check stronger than ordinary CA validation.

**How it works:**
1. The API retry loop classifies low-level stale-connection codes including `ECONNRESET`, `EPIPE`,
   `ETIMEDOUT`, `ECONNABORTED`, `ERR_SOCKET_CLOSED`, and related undici/socket failures
   (`NETWORK_TRANSIENT_CODES`, obfuscated `Lse`, `:202642-202651`).
2. On the next attempt after such an error, it calls `disableKeepAlive` (`Lss`, `:83654-83656`) before
   rebuilding request options. The retry therefore opens a fresh connection rather than borrowing the
   same broken pool.
3. This state is process-wide and monotonic until test/reset code clears it; reliability is preferred
   over regaining pooling efficiency later in the same process.
4. Gateway trust stores a SHA-256 certificate fingerprint per endpoint. `createPinnedGatewayAgent`
   (`msp`, `:412252-412265`) first runs Node's normal hostname/chain validation.
5. Only after normal validation succeeds does it normalize and compare `fingerprint256` against the
   stored value. A mismatch returns a dedicated pin error.
6. The pinned agent also includes the current custom CA and mTLS configuration, so pinning does not
   bypass enterprise trust material.
7. Gateway enrollment can deliberately record an unpinned mode, but restore-time verification and
   warnings keep that reduced guarantee observable.

**Why this approach:**
- Retrying through the same keep-alive pool can make a transient socket defect deterministic. Disabling
  pooling is a coarse but robust recovery action.
- Re-enabling pooling after a timer would improve throughput but risks reusing an agent whose internal
  socket state is still suspect; the current design accepts a session-long performance cost.
- Certificate pinning supplements rather than replaces PKI validation. Pin-only validation would be
  brittle and could accept a certificate with the right fingerprint for the wrong hostname context.

**Key insight:** Authentication reliability extends below tokens: retry state can retire a transport
pool, and gateway identity is checked by both PKI rules and a persisted endpoint-specific fingerprint.

## Critical branch summary

- Multiple provider switches -> deterministic precedence; only Bedrock plus Mantle has per-model
  secondary routing.
- Helper configured before workspace trust -> do not execute a repository-controlled command.
- Access token fresh -> no OAuth refresh; expired/near-expiry token -> locked refresh.
- Access token changed during refresh setup -> adopt the sibling result without another HTTP post.
- Lock compromised -> abort or reject persistence rather than assume exclusive ownership.
- Local user-supplied OAuth env token receives 401 -> preserve the source; do not adopt stored login.
- Remote injected token receives 401 -> allow disk/env rotation and eventually recycle a zombie child.
- GrowthBook starts with an expired login -> refresh first, then snapshot subscription attributes.
- Managed org policy unreadable -> fail closed.
- AWS credential is near expiry but still usable while renewal runs -> temporary stale reuse; never use
  it after actual expiry.
- mTLS files keep the same path but contents change -> invalidate and rebuild the HTTPS agent.
- Retry follows a stale-socket error -> permanently disable keep-alive for the remaining process.

## 2.1.220 to 2.1.227 optimization and refactor findings

- Feature evaluation moved from a collection of module globals and memoized functions to
  `GrowthBookManager`, with explicit generation, disposal, auth identity, initialization promise,
  periodic-refresh controller, payload maps, and exposure lifecycle.
- GrowthBook creation became asynchronous specifically so token refresh can precede attribute capture.
  This is a behavioral correctness fix, not only code organization.
- OAuth 401 recovery now has an explicit branch that preserves a user-supplied
  `CLAUDE_CODE_OAUTH_TOKEN`, closing the 2.1.225 identity/lifetime regression.
- OAuth refresh continues the mixed-version dual-lock and compare-and-swap architecture from 2.1.220,
  but current code additionally distinguishes remote rotation waits and zombie-worker recycling.
- AWS credential reuse remains layered by helper, profile, and region, with proxy-aware STS access and
  a hard stall guard. The implementation continues to favor cache invalidation over hidden retries.
- Bedrock model selection gained an explicit preferred cross-region prefix and discovery-aware
  fallback; see the focused document for the full algorithm.
- Settings filtering now describes host ownership as provider-routing protection and retains
  source-sensitive TLS/proxy exceptions instead of treating every host session identically.

## Operational boundaries

- Feature refresh failure remains availability-biased: the client may temporarily evaluate cached or
  unauthenticated flags after the five-second bound. Security restriction gates use a stricter cached
  path and do not simply trust arbitrary fallback values.
- `ANTHROPIC_BEDROCK_REGION_PREFIX` is a preference, not a residency policy. It changes model IDs, not
  AWS client region or account permissions.
- `CLAUDE_CODE_SKIP_AWS_CRED_CACHE` is an escape hatch. Enabling it can reintroduce repeated SSO
  resolution and should be diagnostic rather than a default configuration.
- A gateway fingerprint cannot prevent compromise of the initial enrollment decision. It protects
  subsequent connections against unexpected certificate changes.
- Host-managed credential exemptions intentionally transfer responsibility to the host. The child CLI
  cannot independently prove or rotate secrets it never owns.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `getApiProvider` (`Wn`) - global provider precedence.
- `getProviderForModel` (`Ab`) - per-model secondary-provider resolution.
- `getAuthTokenSource` (`tT`) - bearer credential precedence and provenance.
- `getAnthropicApiKeyWithSource` (`vF`) - API-key precedence and provenance.
- `getApiKeyFromApiKeyHelper` (`BOr`) - stale-tolerant helper cache.
- `executeApiKeyHelper` (`PIS`) - trusted execution and output validation.
- `refreshOAuthToken` (`z0e`) - token exchange plus subscription metadata.
- `recoverOAuth401` (`ZIS`) - provenance-aware 401 recovery.
- `acquireOAuthRefreshLock` (`tRa`) - dual-path cross-process lock.
- `refreshOAuthTokenLocked` (`FIa`) - race-rechecked refresh orchestration.
- `persistRefreshedOAuthTokens` (`iEr`) - compare-and-swap token persistence.
- `GrowthBookManager` (`sRa`) - feature client and auth-identity lifecycle.
- `createGrowthBookClient` (`sRa.createClient`) - refresh-before-attributes initialization.
- `getGrowthBookUserAttributes` (`aRa`) - subscription-aware evaluation identity.
- `validateForcedLoginOrganization` (`ihe`) - fail-closed organization pinning.
- `authLogin` (`auH`) - policy-aware headless and interactive login.
- `getDefaultAwsProviderChain` (`wV`) - profile/region-scoped AWS resolver cache.
- `resolveAwsCredentialsWithTimeout` (`XIa`) - AWS chain stall guard.
- `filterHostManagedProviderEnvironment` (`Wdd`) - settings trust-boundary filter.
- `loadMTLSClientMaterial` (`apr`) - content-aware certificate reload.
- `disableKeepAlive` (`Lss`) - stale-pool retirement latch.
- `createPinnedGatewayAgent` (`msp`) - PKI plus fingerprint verification.
