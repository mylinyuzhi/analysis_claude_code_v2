# `anthropic_google_cloud`: an entire provider channel that no changelog bullet mentions

> **Type/version:** NET_NEW provider channel, **zero changelog bullets** across `.195`…`.220`.
> Ground-truth open question 6. Every literal below is `220>0 / 193=0`.
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
> (`VERSION 2.1.220`, build `4073f595`). Every `cli_inner_pretty.js:<line>` is a **220** line
> unless tagged **(193)**.

---

## TL;DR

2.1.193 had **six** API providers. 2.1.220 has **eight**. One of the two additions (`gateway`) is
discussed in several changelog bullets. The other — **Claude Platform on Google Cloud**,
`anthropicGoogleCloud` / `anthropic_google_cloud` — is **never mentioned**, yet it is wired into every
layer: the model catalogue, the provider enum, the display-name table, the env-var registry, the SDK
client factory, the auth pre-flight, the error-message taxonomy, the `/status` panel, the sandbox
env allow-lists, and the SDK's public `api_provider` schema.

| Literal | 220 | 193 |
|---|---|---|
| `anthropicGoogleCloud` (camelCase runtime id) | **23** | 0 |
| `anthropic_google_cloud` (snake_case catalogue key) | **20** | 0 |
| `ANTHROPIC_GOOGLE_CLOUD` (env-var prefix) | **47** | 0 |
| `CLAUDE_CODE_USE_ANTHROPIC_GOOGLE_CLOUD` | **13** | 0 |
| `Claude Platform on Google Cloud` | **5** | 0 |
| `claude.googleapis.com` | **3** | 0 |
| `AnthropicGoogleCloud` (SDK class) | **3** | 0 |
| `THIRD_PARTY_PROVIDER_ENV_VARS` (the new env-var → provider map) | **1** | 0 |
| `isClaudePlatformProvider` (the new AWS+GCP grouping) | **1** | 0 |
| `Claude Platform on AWS` (its sibling, for contrast) | 19 | **20** |

The last row is the tell: the *AWS* Claude Platform channel is carryover (its count even shrank by
one). `anthropic_google_cloud` is its brand-new twin, and the `.198` bullet that announced
*"Gateway: added Claude Platform on AWS (`anthropicAws`) as an upstream"* is the only nearby bullet —
and it is about **AWS**, not Google Cloud.

---

## 1. The provider enum: six → eight, and the precedence order

```javascript
// ============================================
// getAPIProvider - the provider resolution ladder
// Location: cli_inner_pretty.js:100302-100317   (was :95761-95772 (193))
// ============================================

// ORIGINAL (2.1.193, for source lookup) — :95761-95772 (193):
function _r() {
  return at(process.env.CLAUDE_CODE_USE_BEDROCK)
    ? "bedrock"
    : at(process.env.CLAUDE_CODE_USE_FOUNDRY)
      ? "foundry"
      : at(process.env.CLAUDE_CODE_USE_ANTHROPIC_AWS)
        ? "anthropicAws"
        : at(process.env.CLAUDE_CODE_USE_MANTLE)
          ? "mantle"
          : at(process.env.CLAUDE_CODE_USE_VERTEX)
            ? "vertex"
            : "firstParty";
}

// ORIGINAL (2.1.220, for source lookup) — :100302-100317:
function Hn() {
  if (Cy()) return "gateway";
  return Z.CLAUDE_CODE_USE_BEDROCK
    ? "bedrock"
    : Z.CLAUDE_CODE_USE_FOUNDRY
      ? "foundry"
      : Z.CLAUDE_CODE_USE_ANTHROPIC_AWS
        ? "anthropicAws"
        : Z.CLAUDE_CODE_USE_ANTHROPIC_GOOGLE_CLOUD
          ? "anthropicGoogleCloud"
          : Z.CLAUDE_CODE_USE_MANTLE
            ? "mantle"
            : Z.CLAUDE_CODE_USE_VERTEX
              ? "vertex"
              : "firstParty";
}

// READABLE (for understanding):
function getAPIProvider() {
  if (getGatewayConfig()) return "gateway";                     // an explicit gateway config outranks all env vars
  if (env.CLAUDE_CODE_USE_BEDROCK)               return "bedrock";
  if (env.CLAUDE_CODE_USE_FOUNDRY)               return "foundry";
  if (env.CLAUDE_CODE_USE_ANTHROPIC_AWS)         return "anthropicAws";
  if (env.CLAUDE_CODE_USE_ANTHROPIC_GOOGLE_CLOUD) return "anthropicGoogleCloud";
  if (env.CLAUDE_CODE_USE_MANTLE)                return "mantle";
  if (env.CLAUDE_CODE_USE_VERTEX)                return "vertex";
  return "firstParty";
}

// Mapping: _r (193)→Hn (220)→getAPIProvider, Cy→getGatewayConfig, at (193)/Z.* (220)→parsed env access
```

**Two changes, both structural:**

1. **`gateway` short-circuits before every env var** (`:100303`). It is not env-driven at all — `Cy()`
   returns a config object, so a gateway configuration is a *first-class* mode, not an env override.
2. **`anthropicGoogleCloud` is inserted between `anthropicAws` and `mantle`** (`:100310-100311`).

**Why *that* position?** The order is a deliberate precedence, not alphabetical. Reading it as a
priority list: an explicit gateway config, then the three "customer's own cloud account" channels
(`bedrock`, `foundry`, `anthropicAws`), then the new GCP twin, then the two "special routing"
channels (`mantle`, `vertex`), then first party. The new channel sits **immediately after its AWS
sibling**, which is exactly where the reader would look for it — and crucially **before `vertex`**.
That matters because a Google Cloud user may well have `CLAUDE_CODE_USE_VERTEX` set from a prior
configuration; putting the Claude Platform channel first means the newer, purpose-built path wins over
the older Vertex path when both are set, rather than silently falling back to Vertex.

Also note the 193→220 change from `at(process.env.X)` to `Z.X`: `Z` is the typed/parsed env accessor
registry (see §3), so the provider ladder no longer re-parses booleans at every call. `Yt(...)` (the
old `at`) still appears at other sites (`:24963`, `:828950-828958`), which is why the raw env name and
the accessor coexist.

### The grouping predicate: `isClaudePlatformProvider`

```javascript
// ORIGINAL (:100346-100348):
function iW(e = Hn()) {
  return e === "anthropicAws" || e === "anthropicGoogleCloud";
}
```

**220=1 / 193=0** for the exported name `isClaudePlatformProvider` (`:100278`). This single predicate
is what makes the addition cheap: everywhere the client needs "is this one of Anthropic's own
managed-cloud offerings?", it calls `iW()` rather than enumerating. Its consumers are the ones that
matter:

- `rm()` (`usesFirstPartyModelIds`, `:100343-100345`): `firstParty || iW() || gateway` — so **Claude
  Platform channels use first-party (undated, bare) model ids**, not provider-mangled ones. Check the
  catalogue: `anthropic_google_cloud: "claude-opus-5"` (`:14375`), identical to
  `first_party: "claude-opus-5"` (`:14370`), whereas `bedrock` is `"us.anthropic.claude-opus-5"`
  (`:14371`).
- `dj()` (`hasFirstPartyCapabilities`, `:100352-100354`): `firstParty || iW() || foundry || mantle` —
  the optimistic default for every capability probe (see
  [`model_catalogue_rewrite.md`](model_catalogue_rewrite.md) §6). A GCP Claude Platform session gets
  modern-model behaviour for unknown ids.
- `IP()` (`isNative1mModel`, `:150201-150209`): `iW(n)` returns `true` unconditionally at `:150206`,
  so **the Claude Platform channels get native 1M context without a per-channel opt-in** — unlike
  Bedrock/Vertex/Foundry, which need `native_1m_3p` (see
  [`opus5_and_sonnet5.md`](opus5_and_sonnet5.md) §3).
- `$6e()`/`Qkt()`/`_7n()`/`vl()` all test `Hn() !== "firstParty"` rather than `iW()`, so Fable/Mythos
  availability and **fast mode are still first-party-only** and are *not* extended to Claude Platform.

**Key insight:** `iW()` draws a line the changelog never names — a tier of providers that are
"Anthropic's stack, hosted in your cloud account", entitled to first-party ids, first-party
capabilities and native 1M, but not to first-party *account* features (fast mode, Fable, usage
credits). One predicate, five consumers, and the whole policy is legible in three lines.

---

## 2. Provider ids, display names, and the two bridges

Every one of the 17 catalogue entries carries an `anthropic_google_cloud` slot. Its value is set for
the modern models and `null` for everything older:

| Model | `anthropic_google_cloud` | Line |
|---|---|---|
| `claude-3-5-haiku` | `null` | `:14037` |
| `claude-haiku-4-5` | `"claude-haiku-4-5-20251001"` | `:14058` |
| `claude-3-5-sonnet` / `claude-3-7-sonnet` / `claude-sonnet-4-0` | `null` | `:14079`, `:14098`, `:14118` |
| `claude-sonnet-4-5` | `"claude-sonnet-4-5-20250929"` | `:14140` |
| `claude-sonnet-4-6` | `"claude-sonnet-4-6"` | `:14163` |
| `claude-sonnet-5` | `"claude-sonnet-5"` | `:14187` |
| `claude-opus-4-0` / `claude-opus-4-1` | `null` | `:14225`, `:14246` |
| `claude-opus-4-5` | `"claude-opus-4-5-20251101"` | `:14267` |
| `claude-opus-4-6` / `4-7` / `4-8` | bare ids | `:14290`, `:14314`, `:14340` |
| `claude-opus-5` | `"claude-opus-5"` | `:14375` |
| `claude-fable-5` | `"claude-fable-5"` | `:14412` |
| `claude-mythos-5` | `null` | `:14449` |

So the channel serves **Haiku 4.5, Sonnet 4.5/4.6/5, Opus 4.5/4.6/4.7/4.8/5 and Fable 5** — i.e. the
current generation only, with no Claude 3.x and no Mythos. Note the ids are **first-party-shaped**
(dated where the API id is dated, bare where it is not), consistent with `rm()` above.

The channel needs **two** name bridges, because the rewrite left the runtime in camelCase and the
catalogue in snake_case:

```javascript
// ORIGINAL (:100179, inside $Zh):
anthropicGoogleCloud: t.anthropic_google_cloud ?? null,

// ORIGINAL (:111379, inside Yig):
anthropicGoogleCloud: "anthropic_google_cloud",
```

`$Zh` (`:100171-100185`) converts catalogue → legacy on the way in; `Yig` (`:111373-111382`) converts
runtime → catalogue on the way out (for `vkl`'s alias lookup, `:110607`). A third mapping is the
user-facing label:

```javascript
// ORIGINAL (:100384-100392):
((ZK = {
  bedrock: "Amazon Bedrock",
  vertex: "Google Vertex AI",
  foundry: "Microsoft Foundry",
  anthropicAws: "Claude Platform on AWS",
  anthropicGoogleCloud: "Claude Platform on Google Cloud",
  mantle: "Amazon Bedrock (Mantle)",
  gateway: "Cloud gateway",
}),
```

with a **near-duplicate** at `:593285-593293` that differs in two entries
(`vertex: "Vertex AI"` and `gateway: "an API gateway"`) — a second label table for prose contexts where
the sentence reads *"…served by an API gateway"*. Both got the Google Cloud row.

**The `anthropic_aws` slot for contrast:** in 2.1.193 the per-model objects had exactly seven keys
(`firstParty, bedrock, vertex, foundry, anthropicAws, mantle, gateway` — `:95695-95703 (193)`).
`anthropicGoogleCloud` is the eighth, added in this window, and its zod slot is
`anthropic_google_cloud: v.string().nullish()` at `:14543`.

---

## 3. The env-var surface: 5 new vars in 6 allow-lists

Five new `ANTHROPIC_GOOGLE_CLOUD_*` / `CLAUDE_CODE_*` names, all registered in the typed env accessor
table:

| Env var | Accessor line | Purpose |
|---|---|---|
| `CLAUDE_CODE_USE_ANTHROPIC_GOOGLE_CLOUD` | `:32931` | select the channel |
| `CLAUDE_CODE_SKIP_ANTHROPIC_GOOGLE_CLOUD_AUTH` | `:24179` | bring-your-own bearer token |
| `ANTHROPIC_GOOGLE_CLOUD_BASE_URL` | `:32964` | override `https://claude.googleapis.com` |
| `ANTHROPIC_GOOGLE_CLOUD_LOCATION` | `:32963` | GCP location (defaults to `"global"`) |
| `ANTHROPIC_GOOGLE_CLOUD_PROJECT` | `:32962` | GCP project |
| `ANTHROPIC_GOOGLE_CLOUD_WORKSPACE_ID` | `:32961` | Anthropic workspace |

**Trap noted while measuring:** `grep -o 'ANTHROPIC_GOOGLE_CLOUD_[A-Z_]*'` appears to report a sixth
name, `ANTHROPIC_GOOGLE_CLOUD_AUTH`. It does not exist — the match is the *suffix* of
`CLAUDE_CODE_SKIP_ANTHROPIC_GOOGLE_CLOUD_AUTH` (`:24179`). A whole-word grep
(`grep -n '\bANTHROPIC_GOOGLE_CLOUD_AUTH\b'`) returns **zero** hits. Five vars, not six.

The interesting part is **how many allow-lists a new provider has to be added to**. Each one is a
separate hand-maintained list, and missing any of them is a silent bug:

| Site | List purpose | GCP line |
|---|---|---|
| `:24958-24966` | suppress crash reporting on third-party providers | `:24963` |
| `:57854-57866` (`zye`) | provider-selecting env vars for config diagnostics | `:57858` |
| `:58040-58054` | env-var settings allow-list | `:58047` |
| `:100393-100400` (`pJt`) | `THIRD_PARTY_PROVIDER_ENV_VARS`: provider → its env var | `:100397` |
| `:154320-154331` | "is this an authenticated first-party session?" negative test | `:154328` |
| `:397061-397101` (`R8y`) | env vars to forward into a child/sandboxed process | `:397066`, `:397072-397077` |
| `:692418-692425` | proxy-detection bail-out | `:692422` |
| `:828950-828958` | startup auth pre-flight dispatch | `:828958` |

`pJt` (`THIRD_PARTY_PROVIDER_ENV_VARS`, **220=1 / 193=0**) is the one genuinely new *structure* here —
193's export table at `:95746-95759 (193)` has `THIRD_PARTY_PROVIDER_LABELS` but no env-var map. It
was added so that error messages can name the env var that put the session on a given provider (see
§5). The other seven lists are pre-existing arrays that simply gained a row — which is precisely the
kind of change a `provider → {envVar, label}` record would have made unnecessary, and the reason `pJt`
now exists.

Note `R8y` also carries **`GOOGLE_CLOUD_PROJECT`** (`:397073`) alongside `ANTHROPIC_GOOGLE_CLOUD_PROJECT` —
the standard Google SDK variable, forwarded because Application Default Credentials read it.

---

## 4. Client construction and the auth pre-flight

```javascript
// ============================================
// buildAnthropicGoogleCloudClient - the GCP branch of the SDK client factory
// Location: cli_inner_pretty.js:149628-149650
// ============================================

// ORIGINAL (for source lookup):
if (_ === "anthropicGoogleCloud") {
  (git("ANTHROPIC_GOOGLE_CLOUD_PROJECT", Z.ANTHROPIC_GOOGLE_CLOUD_PROJECT),
    git("ANTHROPIC_GOOGLE_CLOUD_LOCATION", Z.ANTHROPIC_GOOGLE_CLOUD_LOCATION),
    git("ANTHROPIC_GOOGLE_CLOUD_WORKSPACE_ID", Z.ANTHROPIC_GOOGLE_CLOUD_WORKSPACE_ID),
    git("GCLOUD_PROJECT", Z.GCLOUD_PROJECT),
    git("GOOGLE_CLOUD_PROJECT", Z.GOOGLE_CLOUD_PROJECT),
    git("gcloud_project", Z.gcloud_project),
    git("google_cloud_project", Z.google_cloud_project));
  let C = Z.CLAUDE_CODE_SKIP_ANTHROPIC_GOOGLE_CLOUD_AUTH,
    I = Yv();
  if (!C && !I) await ist();
  let { AnthropicGoogleCloud: R } = await Promise.resolve().then(() => (GQc(), jQc)),
    H = Uqe(A.defaultHeaders),
    L = C ? H.value : void 0,
    P = {
      ...A,
      defaultHeaders: { ...H.rest, ...JQc() },
      ...(C && { skipAuth: !0 }),
      ...(L && { defaultHeaders: { ...H.rest, Authorization: L } }),
      ...(M5() && { logger: Bqe() }),
    };
  return new R(P);
}

// READABLE (for understanding):
if (provider === "anthropicGoogleCloud") {
  // 1. mirror seven possible project/location vars into the real process env for the Google SDK
  exportToProcessEnv("ANTHROPIC_GOOGLE_CLOUD_PROJECT",      env.ANTHROPIC_GOOGLE_CLOUD_PROJECT);
  exportToProcessEnv("ANTHROPIC_GOOGLE_CLOUD_LOCATION",     env.ANTHROPIC_GOOGLE_CLOUD_LOCATION);
  exportToProcessEnv("ANTHROPIC_GOOGLE_CLOUD_WORKSPACE_ID", env.ANTHROPIC_GOOGLE_CLOUD_WORKSPACE_ID);
  exportToProcessEnv("GCLOUD_PROJECT",        env.GCLOUD_PROJECT);
  exportToProcessEnv("GOOGLE_CLOUD_PROJECT",  env.GOOGLE_CLOUD_PROJECT);
  exportToProcessEnv("gcloud_project",        env.gcloud_project);          // lower-case variants too
  exportToProcessEnv("google_cloud_project",  env.google_cloud_project);

  const skipAuth   = env.CLAUDE_CODE_SKIP_ANTHROPIC_GOOGLE_CLOUD_AUTH;
  const hostManaged = hostProvidesCredentials();
  if (!skipAuth && !hostManaged) await ensureGoogleAdcAvailable();           // 2. pre-flight ADC

  const { AnthropicGoogleCloud } = await import(googleCloudSdkModule);       // 3. lazy SDK import
  const headers = splitAuthorizationHeader(options.defaultHeaders);
  const explicitAuth = skipAuth ? headers.value : undefined;
  return new AnthropicGoogleCloud({
    ...options,
    defaultHeaders: { ...headers.rest, ...googleCloudExtraHeaders() },
    ...(skipAuth && { skipAuth: true }),
    ...(explicitAuth && { defaultHeaders: { ...headers.rest, Authorization: explicitAuth } }),
    ...(isDebugLogging() && { logger: sdkLogger() }),
  });
}

// Mapping: git→exportToProcessEnv, Yv→hostProvidesCredentials, ist→ensureGoogleAdcAvailable,
//          jQc/GQc→the lazily-imported AnthropicGoogleCloud SDK module, Uqe→splitAuthorizationHeader,
//          JQc→googleCloudExtraHeaders, M5→isDebugLogging, Bqe→sdkLogger
```

**Design points worth naming:**

1. **Seven env mirrors for one concept.** `git(...)` copies the client's *parsed* env into
   `process.env` so the Google auth library — which reads `process.env` directly and knows nothing about
   Claude Code's typed accessor — can find the project. Four spellings of "project"
   (`GCLOUD_PROJECT`, `GOOGLE_CLOUD_PROJECT`, and both lower-cased) are mirrored because different
   generations of Google tooling read different ones. This is defensive interop, not redundancy.
2. **Auth is *not* skipped when the host manages credentials.** `if (!C && !I) await ist();` — the
   pre-flight runs only when the user has neither opted out (`CLAUDE_CODE_SKIP_..._AUTH`) nor delegated
   to a host (`Yv()`). This mirrors the Vertex branch exactly, which is why `:828958` reads
   `if (Z.CLAUDE_CODE_USE_ANTHROPIC_GOOGLE_CLOUD && !Z.CLAUDE_CODE_SKIP_ANTHROPIC_GOOGLE_CLOUD_AUTH) Eno();`
   — the same `Eno()` used for Vertex at `:828957`. **Google Cloud auth is Vertex's auth mechanism
   (Application Default Credentials) pointed at a different host.**
3. **The `skipAuth` + `Authorization` dance.** When `skipAuth` is set, `Uqe()` splits the caller's
   `Authorization` header out of `defaultHeaders`; if there is one, it is re-attached and `skipAuth`
   tells the SDK not to fetch a Google token. That is the bring-your-own-gateway-token path, and the
   SDK enforces the constraint loudly (`:149175`):
   *"The `${p}` option is not supported by AnthropicGoogleCloud; authentication uses a Google bearer
   token (`bearerTokenProvider`, `googleAuth`/`authClient`, or Application Default Credentials)."*
4. **Lazy import.** `await Promise.resolve().then(() => (GQc(), jQc))` defers loading the whole Google
   auth stack until a session actually uses the channel — the same pattern as the Bedrock/Mantle
   branches (`:149652`). Startup cost for the other 99% of users is zero.
5. **The base URL** (`:149736-149737`):
   `Z.ANTHROPIC_GOOGLE_CLOUD_BASE_URL || "https://claude.googleapis.com"`. A **`googleapis.com`
   host**, not an Anthropic one — i.e. this is a GCP-native surface, the direct counterpart of
   `anthropicAws`'s `https://aws-external-anthropic.${region}.api.aws` (`:149735`).

`claude.googleapis.com` is **220=3 / 193=0**.

---

## 5. Error messages, diagnostics, and the SDK schema

The channel is threaded through every user-facing surface, and each site is worth a line because
together they show what "adding a provider" actually costs.

**Auth-failure remediation** (`:228637-228652`) — a four-way branch on how credentials are supplied:

```javascript
// ORIGINAL (:228638-228648, elided):
let l = !Z.CLAUDE_CODE_SKIP_ANTHROPIC_GOOGLE_CLOUD_AUTH && !Yv(),
  c = l && (!Z8r() || Txe()) ? qer() : void 0,
  u = l ? (c ?? "gcloud auth application-default login") : void 0,
  d = e.status === 401,
  p = d ? FLu : BLu,
  f = u
    ? ` \xB7 run \`${u}\` and retry`
    : Z.CLAUDE_CODE_SKIP_ANTHROPIC_GOOGLE_CLOUD_AUTH
      ? " \xB7 refresh the gateway token provided via ANTHROPIC_AUTH_TOKEN/ANTHROPIC_CUSTOM_HEADERS and retry"
      : " \xB7 credentials are managed by this environment — retry, or contact your administrator";
```

Three distinct remediations for three distinct setups: *run `gcloud auth application-default login`*
(local ADC), *refresh the gateway token* (skip-auth mode), *contact your administrator*
(host-managed). The `401` vs non-`401` split picks a different prefix (`FLu`/`BLu`), and a non-401
appends *" · if credentials are current, check GCP IAM permissions and workspace access"*
(`:228650`) — the failure mode that a 403 actually indicates.

**Transient-error hint** (`:228152`):

```javascript
if (e === "anthropicGoogleCloud") return ` If it persists, check ${Wcs} and Google Cloud's status page.`;
```

Compare the AWS sibling one line up (`:228151`): `` ` If it persists, check ${Wcs}.` `` — AWS Claude
Platform points only at Anthropic's status page, GCP points at **both**. A small correctness detail:
the GCP surface is served through Google's own front door (`claude.googleapis.com`), so a Google
outage can break it independently of Anthropic.

**Token-refresh classifier** (`:534893`):

```javascript
if (Yt(process.env.CLAUDE_CODE_USE_VERTEX) || Z.CLAUDE_CODE_USE_ANTHROPIC_GOOGLE_CLOUD) { … }
```

Google-credential errors and 401s are treated as refreshable for **both** Vertex and Google Cloud —
again confirming the shared ADC mechanism.

**Retry-safety switch** (`:509315-509334`): the `anthropicGoogleCloud` arm is
`case "anthropicGoogleCloud": return !1;` (`:509330-509331`). Reading the whole switch, the answer is
`true` for `foundry` unconditionally (`:509326-509327`), conditional on an unset base-URL override for
`bedrock` (`:509322-509323`), `mantle` (`:509324-509325`) and `vertex` (`:509332-509333`), delegated for
`anthropicAws` (`ver(r)`, `:509328-509329`), and hard `false` for `gateway` (`:509316-509317`) and
Google Cloud. So the new channel is grouped with `gateway` — the two providers whose upstream the
client cannot reason about — rather than with its AWS sibling. A conservative default for a channel
with no production history.

**`/status` diagnostics panel** (`:666180-666191`): five rows — base URL (when overridden), Workspace
ID, GCP project (`ANTHROPIC_GOOGLE_CLOUD_PROJECT || GOOGLE_CLOUD_PROJECT`), GCP location (defaulting to
the literal `"global"`, `:666188`), and an *"Claude Platform on Google Cloud auth skipped"* note when
the skip flag is set. Structurally identical to the AWS block immediately above it
(`:666173-666179`), which is why the addition was cheap.

**The SDK's public schema** (`:835305`, `:836303`): the `api_provider` field's describe string now
enumerates all eight —

```
"API provider that served this model ('firstParty', 'bedrock', 'vertex', 'foundry', 'anthropicAws',
 'anthropicGoogleCloud', 'mantle', 'gateway')."
```

— and `:836303` adds `"anthropicGoogleCloud"` to the corresponding enum. So the channel is part of the
**public headless/SDK contract**, which is the strongest single argument that it is a shipped feature
and not a dark launch: an SDK consumer can already receive `api_provider: "anthropicGoogleCloud"` and
is documented to expect it.

---

## 6. Why this is under-reported, and what it means for the window

**The evidence that it is real and complete:**
- eight of eight layers wired (catalogue, enum, labels ×2, env accessors, client factory, auth
  pre-flight, error taxonomy, `/status`, sandbox forwarding, SDK schema);
- ten `provider_ids` slots populated with first-party-shaped ids;
- a dedicated grouping predicate (`iW`) with five consumers;
- membership in the **public SDK enum**.

**The evidence that it is not yet generally announced:**
- **zero changelog bullets** across all 579 in `.195`…`.220`;
- `mantle`, the other "quiet" channel, has the same treatment and is likewise barely mentioned — a
  precedent for how Anthropic ships partner-cloud channels;
- the retry-safety switch returns `!1` (`:509330`), i.e. it is excluded from the failover set;
- fast mode, Fable and Mythos are *not* extended to it (`vl()`, `Qkt()`, `_7n()` all require strict
  `firstParty`).

**Conclusion.** `anthropic_google_cloud` is a **fully implemented, publicly-typed provider channel
delivered without a changelog bullet** — the mirror image of `.219`'s Opus-4.7-fast-mode bullet, which
is a changelog claim with no implementation. Together the two are the sharpest illustration in this
tree of why the changelog cannot be the unit of analysis: it both over-claims and under-reports, and
only the bundle settles which.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this module are staged in
> [symbol_additions_v2_1_220_models.md](../00_overview/symbol_additions_v2_1_220_models.md).

Key functions and data in this document:
- `getAPIProvider` (`Hn`, `:100302-100317`) - eight-way ladder, gateway short-circuit first
- `isClaudePlatformProvider` (`iW`, `:100346-100348`) - `anthropicAws || anthropicGoogleCloud`
- `usesFirstPartyModelIds` (`rm`, `:100343-100345`) / `hasFirstPartyCapabilities` (`dj`, `:100352-100354`)
- `providerSignsWithAwsCredentials` (`FZh`, `:100288-100301`) - GCP is in the `false` arm (`:100297`)
- `getProviderForModel` (`ny`, `:100331-100342`) / `getSecondaryProvider` (`mkt`, `:100324-100327`)
- `THIRD_PARTY_PROVIDER_LABELS` (`ZK`, `:100384-100392`) - `"Claude Platform on Google Cloud"` at `:100389`
- `THIRD_PARTY_PROVIDER_ENV_VARS` (`pJt`, `:100393-100400`) - net-new provider→env-var map, GCP at `:100397`
- prose label table (`Dlb`, `:593285-593293`) - second label set, GCP at `:593290`
- `CAMEL_TO_SNAKE_PROVIDER` (`Yig`, `:111373-111382`) - `anthropicGoogleCloud → anthropic_google_cloud` at `:111379`
- `catalogueEntryToLegacyProviderConfig` (`$Zh`, `:100171-100185`) - GCP slot at `:100179`
- provider-ids zod slot `anthropic_google_cloud` (`:14543`)
- `buildAnthropicGoogleCloudClient` (inline, `:149628-149650`)
- `providerBaseUrl` GCP arm (`:149736-149737`) - `https://claude.googleapis.com`
- `AnthropicGoogleCloud` SDK export (`:149278`) and its unsupported-option error (`:149175`)
- auth-failure remediation branch (`:228637-228652`)
- transient-error hint (`:228152`) - names Google Cloud's status page
- Google-credential refresh classifier (`qlp`, `:534892-534898`)
- retry-safety switch GCP arm (`:509330-509331`) - returns `!1`, grouped with `gateway`
- `/status` GCP rows (`:666180-666191`)
- startup auth pre-flight (`:828958`) - shares Vertex's `Eno()`
- sandbox/child env forward list (`R8y`, `:397061-397101`) - GCP vars at `:397066`, `:397072-397077`
- SDK `api_provider` describe string (`:835305`) and enum member (`:836303`)
