# Remote Control: enablement gating, blocker attribution, and prompt safety

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). Baseline `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`,
always tagged `(193)`.

Everything in this document sits in one module — the bridge-eligibility module whose export table is at
`:535420-535446`. Comparing that table against 2.1.193's (`:603743-603772 (193)`) is the fastest way to
see the shape of the window's work:

| Export | 2.1.193 | 2.1.220 |
|---|---|---|
| `isBridgeFirstParty` (`DVe`) | **absent** | `:535447` — **new**, and it is the `.196` fix |
| `isCcrV2SessionCrudEnabled` (`DNt`) | **absent** | `:535428` — new |
| `getBridgeGrowthBookDebugLines` | `:603757 (193)` | **removed** |
| everything else (22 exports) | present | present, same names |

Two additions and one removal. The additions are the subject of §1 and the reason the `.196` and `.219`
bullets are both real.

---

## 1. `.196` — Remote Control now requires the base URL to actually be `api.anthropic.com`

> *"Remote Control is now disabled when `ANTHROPIC_BASE_URL` points at a non-Anthropic host, matching
> the existing behavior under `CLAUDE_CODE_USE_BEDROCK`/`_VERTEX`/`_FOUNDRY`."*

**Verdict: NET_NEW — and the delta is one new *composition*, not a new predicate.**

### 1.1 What 2.1.193 checked

The whole eligibility chain hung off `Jl()` (`:95777-95779 (193)`):

```javascript
function Jl() {
  return _r() === "firstParty";
}
```

`_r()` is the provider selector: it reads the `CLAUDE_CODE_USE_BEDROCK` / `_VERTEX` / `_FOUNDRY` /
`_MANTLE` family and returns `"firstParty"` when none of them is set. **It never looks at
`ANTHROPIC_BASE_URL`.** So `ANTHROPIC_BASE_URL=https://llm-proxy.corp.example/` left the provider at
`firstParty`, `Jl()` returned true, `Tqe()` (`:603701-603703 (193)`) returned true, and Remote Control
happily registered a worker against a corporate proxy.

The predicate that would have caught it *already existed* in 2.1.193 —
`isActualFirstPartyAnthropicBaseUrl` (`Chn`, `:95812-95816 (193)`, exported at `:95753 (193)`), with the
host allow-list helper `MZe` (`:95817-95824 (193)`). It was simply not wired into the bridge gate.

### 1.2 What 2.1.220 checks

```javascript
// ============================================
// isBridgeFirstParty - the new Remote Control provider gate
// Location: cli_inner_pretty.js:535447-535450
// ============================================

// ORIGINAL (for source lookup):
function DVe() {
  if (!Dc()) return !1;
  return !!Z.ANTHROPIC_UNIX_SOCKET || dGr();
}

// READABLE (for understanding):
function isBridgeFirstParty() {
  if (!isFirstPartyProvider()) return false;             // same test 2.1.193 used alone
  return !!env.ANTHROPIC_UNIX_SOCKET                     // `claude ssh remote` local proxy — exempt
      || isActualFirstPartyAnthropicBaseUrl();           // else the base URL must really be Anthropic
}

// Mapping: DVe→isBridgeFirstParty, Dc→isFirstPartyProvider, Z→managedEnvProxy,
//          dGr→isActualFirstPartyAnthropicBaseUrl
```

with (`:100362-100373`, carryover logic, re-mangled names):

```javascript
function dGr() {                       // isActualFirstPartyAnthropicBaseUrl
  let e = process.env.ANTHROPIC_BASE_URL;
  if (!e) return !0;                   // unset ⇒ we are on the real endpoint
  return S1e(e);
}
function S1e(e) {                      // hostIsFirstParty
  try { return ["api.anthropic.com"].includes(new URL(e).host); } catch { return !1; }
}
```

`DVe` replaces `Jl` at all four decision points: `hasBridgeEntitlement` `:535452`, `isBridgeEnabledBlocking`
`:535475`, `getBridgeDisabledReason` `:535479`, and the logged-out carve-out `:503356` (§3).

**Why the `ANTHROPIC_UNIX_SOCKET` exemption?** `claude ssh remote` runs the CLI behind a *local* proxy
that terminates on a unix socket and forwards to the real API; `ANTHROPIC_BASE_URL` in that mode points
at the socket shim, not at Anthropic. Without the exemption the `.196` change would have broken
`claude ssh remote` + Remote Control together. Its own blocker sentence at `:535651-535652`
("`ANTHROPIC_UNIX_SOCKET` is set (claude ssh remote), and the local proxy is API-key-authed") shows the
mode is a first-class case elsewhere in the same module.

### 1.3 The escape hatch that deliberately does *not* apply

`_CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL` is the internal override that tells the rest of the CLI to
treat any base URL as first-party. It is honoured by `Yd()` (`:100358-100361`) —

```javascript
function Yd() {
  if (Z._CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL) return !0;
  return dGr();
}
```

— and `Yd` is what `hkt()` (`:100375`, traceparent propagation) and the model/telemetry paths use.
**`DVe` calls `dGr()` directly, skipping `Yd`.** That is not an oversight; the blocker message says so
in as many words (`:535668-535670`):

```
" (_CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL does not apply to Remote Control.)"
```

**Why exempt Remote Control from the override?** Every other consumer of the flag is answering "may I
send this request the way I'd send it to Anthropic?" — a *formatting* question. Remote Control is
answering "may I hand a third party a live control channel into this developer's shell?" — an
*authorisation* question. An internal convenience flag is the wrong instrument for the second, so the
gate reads the raw fact and the UI explains why the flag did nothing. `_CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL`
is **220=8 / 193=4** — the four new sites are `:100359` (the `Yd` wrapper), `:509307`, `:534498`
(a doctor-output filter that strips it from the reported env), and the two message lines above.

---

## 2. `.219` — the blocker sentence now names the setting that caused it

> *"Improved the 'Remote Control is only available via api.anthropic.com' error to name the specific
> setting that caused it."*

**Verdict: NET_NEW.** The base string `Remote Control is only available when using Claude via
api.anthropic.com.` is **220=3 / 193=3** (a classic carryover-literal trap), but in 2.1.193 that string
was the *entire* answer:

```javascript
// 2.1.193, :603729
if (!Jl()) return "Remote Control is only available when using Claude via api.anthropic.com.";
```

2.1.220 hoists it into a constant `mbr` (`:535810`) and makes it the **prefix** of a five-way branch:

```javascript
// ============================================
// buildRemoteControlProviderBlocker - attributes the block to a specific env var / on-ramp
// Location: cli_inner_pretty.js:535656-535673
// ============================================

// ORIGINAL (for source lookup):
function H4_() {
  let e = Hn();
  if (e !== "firstParty") {
    if (e === "gateway")
      return B5e(Cy())
        ? `${mbr} This session is connected through an enterprise cloud gateway (set up via /login), which does not support Remote Control.`
        : `${mbr} CLAUDE_CODE_USE_GATEWAY is set (the gateway on-ramp also requires ANTHROPIC_BASE_URL and ANTHROPIC_AUTH_TOKEN), so this session is routed through a cloud gateway — ${tcp}`;
    if (e === "bedrock" && mkt() === "mantle")
      return `${mbr} ${pJt.bedrock} and ${pJt.mantle} are set, so this session is using ${ZK.bedrock} + ${ZK.mantle} — ${tcp}`;
    return `${mbr} ${pJt[e]} is set, so this session is using ${ZK[e]} — ${ecp}`;
  }
  if (!dGr()) {
    let t = Z._CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL
      ? " (_CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL does not apply to Remote Control.)"
      : "";
    return `${mbr} ANTHROPIC_BASE_URL is set and does not point at api.anthropic.com, so this session is using a custom endpoint — ${ecp}${t}`;
  }
  return mbr;
}

// READABLE (for understanding):
function buildRemoteControlProviderBlocker() {
  let provider = getActiveProvider();
  if (provider !== "firstParty") {
    if (provider === "gateway")
      return isEnterpriseGatewayLogin(getGatewayConfig())
        ? `${RC_FIRST_PARTY_ONLY} This session is connected through an enterprise cloud gateway (set up via /login), which does not support Remote Control.`
        : `${RC_FIRST_PARTY_ONLY} CLAUDE_CODE_USE_GATEWAY is set (…), so this session is routed through a cloud gateway — ${UNSET_THEM_HINT}`;
    if (provider === "bedrock" && getBedrockFlavor() === "mantle")           // two env vars at once
      return `${RC_FIRST_PARTY_ONLY} ${THIRD_PARTY_PROVIDER_ENV_VARS.bedrock} and ${THIRD_PARTY_PROVIDER_ENV_VARS.mantle} are set, so this session is using ${PROVIDER_DISPLAY_NAMES.bedrock} + ${PROVIDER_DISPLAY_NAMES.mantle} — ${UNSET_THEM_HINT}`;
    return `${RC_FIRST_PARTY_ONLY} ${THIRD_PARTY_PROVIDER_ENV_VARS[provider]} is set, so this session is using ${PROVIDER_DISPLAY_NAMES[provider]} — ${UNSET_IT_HINT}`;
  }
  if (!isActualFirstPartyAnthropicBaseUrl()) { … }                           // the .196 case
  return RC_FIRST_PARTY_ONLY;                                                // fell through: bare sentence
}

// Mapping: H4_→buildRemoteControlProviderBlocker, Hn→getActiveProvider, mbr→RC_FIRST_PARTY_ONLY,
//          ecp→UNSET_IT_HINT, tcp→UNSET_THEM_HINT, pJt→THIRD_PARTY_PROVIDER_ENV_VARS,
//          ZK→PROVIDER_DISPLAY_NAMES, mkt→getBedrockFlavor, dGr→isActualFirstPartyAnthropicBaseUrl
```

The three suffix constants (`:535810-535812`) are the mechanism:

```
mbr = "Remote Control is only available when using Claude via api.anthropic.com."
ecp = "unset it (or run in a shell without it) to use Remote Control."       // singular
tcp = "unset them (or run in a shell without them) to use Remote Control."   // plural
```

**Why singular *and* plural?** Because two of the five branches implicate more than one variable —
`bedrock + mantle`, and the gateway on-ramp (`CLAUDE_CODE_USE_GATEWAY` + `ANTHROPIC_BASE_URL` +
`ANTHROPIC_AUTH_TOKEN`). A single grammatically-wrong sentence would have been cheaper; splitting the
suffix is a small tell that this message is expected to be read and acted on by users who are not
Anthropic engineers.

**The two lookup tables it names** are `PROVIDER_DISPLAY_NAMES` (`ZK`, `:100384-100392`) and
`THIRD_PARTY_PROVIDER_ENV_VARS` (`pJt`, `:100393-100400`):

```
bedrock              CLAUDE_CODE_USE_BEDROCK               "Amazon Bedrock"
vertex               CLAUDE_CODE_USE_VERTEX                "Google Vertex AI"
foundry              CLAUDE_CODE_USE_FOUNDRY               "Microsoft Foundry"
anthropicAws         CLAUDE_CODE_USE_ANTHROPIC_AWS         "Claude Platform on AWS"
anthropicGoogleCloud CLAUDE_CODE_USE_ANTHROPIC_GOOGLE_CLOUD "Claude Platform on Google Cloud"
mantle               CLAUDE_CODE_USE_MANTLE                "Amazon Bedrock (Mantle)"
gateway              (—, gateway has its own branch)        "Cloud gateway"
```

`THIRD_PARTY_PROVIDER_ENV_VARS` as an exported name is **220=1 / 193=0**, and
`Claude Platform on Google Cloud` is **220=5 / 193=0** — the new provider channel that
[`_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md) §7 flags as undocumented
shows up here as a first-class blocker reason. The table is reused at `:535524` to build the
`/doctor` auth-state dump.

**Key insight:** the `.219` change is *not* better prose. It converts a boolean gate's output from
"you cannot" into "you cannot, because `$VAR` is set, and here is the one action that clears it". The
same module already had a precedent for this — `describeAuthPrecedenceBlocker` (`Qdo`,
`:535639-535655`) does exactly this for the *auth* half (API key vs helper vs auth token vs enterprise
SSO), and it is **carryover**. `.219` is the provider half catching up to a pattern the auth half had.

### 2.1 Where the blocker sits in the full ladder

`getBridgeDisabledReason` (`VUo`, `:535477-535518`) is a 13-rung ladder and the order is deliberate —
each rung is cheaper and more *local* than the next:

```
1  qUo()                      hard override → never blocked            :535478
2  !DVe()                     provider / base URL  →  H4_()            :535479   ← §1, §2
3  qW()                       already inside a cloud session           :535480
4  YBt()                      managed setting `disableRemoteControl`   :535481
5  !zUo()                     no claude.ai inference scope             :535483
6  !gbr()                     not a claude.ai subscriber → Qdo(...)    :535485
7  !KUo()                     token is inference-only (setup-token)    :535487
8  !uzs()?.organizationUuid   org unknown                              :535489
9  await ncp(); cmn()         org policy: unavailable / denied         :535491-535499
10 !sie()                     feature-flag evaluation disabled         :535501-535507
11 !(await AW(...))           not in the tengu_ccr_bridge rollout      :535509-535515
```

Rungs 1–8 are **local and synchronous**; rung 9 is the first that awaits a network-backed policy load
(`ncp()`, `:535706-535725`, with a cold-await timeout `POLICY_LIMITS_COLD_AWAIT_MS`), and rungs 10–11
touch the feature-flag service. Putting the provider check at rung 2 means a Bedrock user never pays
for an org-policy fetch to be told something the environment could answer instantly. It also means the
message they get is the *most actionable* one available: telling a Bedrock user "not yet enabled for
your account" would send them to the wrong place entirely.

Rung 11's self-heal is worth noting (`:535510-535513`): if the gate says no *and* the flag cache was
never populated, it forces a refresh (`vxe()`) and re-checks once, distinguishing "flag service was
unreachable" from "you are genuinely not in the rollout". `tengu_ccr_bridge` itself is **220=6 / 193=6**.

---

## 3. `.206` — `/remote-control` when logged out

> *"Fixed `/remote-control` showing 'Unknown command' when logged out — it now explains how to sign in."*

**Verdict: NET_NEW, and it is one of the cleanest bullet→code chains in the window.**

The `Unknown command` literal is **220=3 / 193=3** and all three sites are structurally identical
(`:343373`, `:343462`, `:343955` vs `:397887`, `:397977`, `:398321 (193)`), so the message is not the
delta. The delta is the command descriptor's `isEnabled`:

| | 2.1.193 (`:563246-563265 (193)`) | 2.1.220 (`:503373-503388`) |
|---|---|---|
| `name` / `aliases` | `remote-control` / `["rc"]` | identical |
| `isEnabled` | **`Jw`** — i.e. `isBridgeEnabled()` | **`oP_`** — a five-condition fallback |
| `isHidden` getter | `!Jw()` | `!bk()` (same meaning) |
| `load` | present | absent (moved to the lazy map at `:735775`) |

```javascript
// ============================================
// isRemoteControlCommandEnabled - keeps /remote-control dispatchable while logged out
// Location: cli_inner_pretty.js:503352-503366
// ============================================

// ORIGINAL (for source lookup):
function oP_() {
  if (bk()) return !0;
  try {
    return (
      DVe() &&
      !qW() &&
      !YBt() &&
      D0().source === "none" &&
      AZ({ skipRetrievingKeyFromApiKeyHelper: !0 }).source === "none" &&
      !m6s.isC4EUpsellCommandEnabled()
    );
  } catch {
    return !1;
  }
}

// READABLE (for understanding):
function isRemoteControlCommandEnabled() {
  if (isBridgeEnabled()) return true;                       // normal path
  try {
    return (
      isBridgeFirstParty() &&                               // 1P provider + real api.anthropic.com
      !isRunningInRemoteEnvironment() &&                    // not already a cloud session
      !isRemoteControlHardDisabled() &&                     // no managed `disableRemoteControl`
      getEnterpriseAuthSource().source === "none" &&        // 2 …and no enterprise auth
      getApiKeySource({ skipRetrievingKeyFromApiKeyHelper: true }).source === "none" &&  // 3 …and no API key
      !claudeForEnterprise.isC4EUpsellCommandEnabled()      // 4 …and no competing upsell command
    );
  } catch {
    return false;                                           // fail closed
  }
}

// Mapping: oP_→isRemoteControlCommandEnabled, bk→isBridgeEnabled, DVe→isBridgeFirstParty,
//          qW→isRunningInRemoteEnvironment, YBt→isRemoteControlHardDisabled,
//          D0→getEnterpriseAuthSource, AZ→getApiKeySource
```

**How it fixes the bullet, step by step:**

1. The slash-command dispatcher resolves a typed `/x` against the command list. A descriptor whose
   `isEnabled` is false is not resolvable, so `/remote-control` fell through to the unknown-command
   branch at `:343341-343388` and produced `Unknown command: /remote-control` — or worse, a
   "Did you mean …?" suggestion from `bpt` (`:343359-343365`) pointing at an unrelated command.
2. Logged out means `bk()` (`isBridgeEnabled` = `!qW() && NDt()`, `:535467-535471`) is false, because
   `NDt()` requires `gbr()` (claude.ai subscriber).
3. `oP_` therefore has to answer a *different* question: **"is this user someone for whom Remote
   Control would be the right answer if they signed in?"** Conditions 1–4 are exactly the set of facts
   that are knowable without a login and that would *permanently* disqualify them — a Bedrock user, a
   cloud session, an org kill-switch, an API-key or enterprise-SSO session, or a Claude-for-Enterprise
   tenant that has its own upsell command. Everyone else gets the command, hidden from the menu
   (`isHidden` still `!bk()`) but dispatchable, and it renders the login instruction
   `BRIDGE_LOGIN_INSTRUCTION` (`NBt`, `:498067`).
4. `try/catch → false` is the fail-closed default: any of the four probes throwing (config not yet
   loaded, keychain unavailable) means the command stays hidden and unresolvable rather than showing a
   login prompt to someone who cannot use the feature.

**Why the auth checks are `=== "none"` rather than negations.** Conditions 2 and 3 do not test "is the
user logged in" — they test that there is *no other credential in play*. A session with
`ANTHROPIC_API_KEY` set is not "logged out", it is authenticated the wrong way, and for that user the
correct message is the auth-precedence blocker (§2's `Qdo`), reached through the ordinary path, not
"sign in with claude.ai". Note also `skipRetrievingKeyFromApiKeyHelper: true` on the API-key probe:
resolving the key would mean **executing the user's `apiKeyHelper` command** just to decide whether to
show a slash command. Suppressing that is both a latency and a side-effect decision.

The related literals: `BRIDGE_LOGIN_INSTRUCTION` (`:498067`), `BRIDGE_LOGIN_ERROR` (`i_r`, `:498069`,
used by the `claude rc` entrypoint at `:546778`), `REMOTE_CONTROL_DISCONNECTED_MSG` (`xve`, `:498070`),
`BRIDGE_LOGIN_HINT` (`FBt = "/login"`, `:498071`). All four are **carryover strings** exported from a
module table at `:498060-498065`; the delta is only who can now reach them.

---

## 4. Prompts, dialogs, and viewers that joined late

### 4.1 `.214` — the "session ready" push fired for sessions that never opted in

> *"Fixed the Remote Control 'session ready' push notification firing for sessions where Remote
> Control was not explicitly enabled."*

**Verdict: NET_NEW.** `tengu_kairos_ready_nudge` **220=1 / 193=0**; `remoteControlReadyPushKey`
**220=3 / 193=0**; `remoteControlReadyPushCount` **220=2 / 193=0**.

The config resolver `TLf` (`:720544-720554`) is the usual three-shape gate reader (`true` ⇒ defaults
`{probability: 1, maxImpressions: 5}`; an object ⇒ per-field clamped; anything else ⇒ `null` = off).
The *fix* is the eligibility predicate beside it:

```javascript
// ============================================
// canShowRemoteControlReadyPush - the explicit-enable guard added in .214
// Location: cli_inner_pretty.js:720555-720565
// ============================================

// ORIGINAL (for source lookup):
function CLf(e, t, r) {
  if (!t || r) return !1;
  if (rs() || gB() != null) return !1;
  if (e.maxImpressions === 0) return !1;
  if (e.maxImpressions < 0) return !0;
  let n = xt();
  return (
    ((n.remoteControlReadyPushKey ?? "") === e.impressionKey ? (n.remoteControlReadyPushCount ?? 0) : 0) <
    e.maxImpressions
  );
}

// READABLE (for understanding):
function canShowRemoteControlReadyPush(config, replBridgeExplicit, isReattachedSession) {
  if (!replBridgeExplicit || isReattachedSession) return false;   // THE FIX
  if (isHeadlessOrMirrorSurface() || getActiveCloudSession() != null) return false;
  if (config.maxImpressions === 0) return false;                  // gate says never
  if (config.maxImpressions < 0) return true;                     // gate says unlimited
  let cfg = getGlobalConfig();
  let seen = (cfg.remoteControlReadyPushKey ?? "") === config.impressionKey
    ? (cfg.remoteControlReadyPushCount ?? 0)
    : 0;                                                          // key change resets the counter
  return seen < config.maxImpressions;
}

// Mapping: CLf→canShowRemoteControlReadyPush, e→config, t→replBridgeExplicit, r→isReattachedSession,
//          xt→getGlobalConfig
```

The two arguments come from the single call site, `:738267-738271`, inside the bridge state machine's
`case "connected":` arm:

```javascript
let Te = F.getState().replBridgeExplicit,   // :738041
    ve = C.current;                          // :737952 — ZE.useRef(Z.CLAUDE_BRIDGE_REATTACH_SESSION !== void 0)
…
let mt = TLf();
if (mt && CLf(mt, Te, ve)) {
  if (((T.current = !0), mt.probability >= 1 || Math.random() < mt.probability))
    (Pt.writeSdkMessages([Ekd(yLf, kt())]), xLf(mt));
}
```

**Why `replBridgeExplicit` is the right field.** The app-state store distinguishes *how* the bridge got
turned on. `replBridgeExplicit` is set true only on the user-driven paths — the `/remote-control`
command (`:824771`, `{ replBridgeEnabled: !0, replBridgeExplicit: !0, replBridgeOutboundOnly: !1 }`) and
the CLI entry at `:868136` (`replBridgeExplicit: K || (Boolean(Rt) && !At && !et)`). Every *default*
path initialises it to `!1` (`:565621`, `:692583`, `:720661`, `:732547`, `:867235`, `:868418`). Remote
Control also auto-enables from an org/GrowthBook default — see the `remote_control_auto_enable` /
`remote_control_auto_on_by_default` wire fields at `:838496-838507`, whose own schema text spells out
the distinction:

> `True when remote_control_auto_enable is true because of the org/GB default rather than an explicit
> remoteControlAtStartup setting`

So the bug was: a session that auto-enabled RC (org default) reached `case "connected"` and pushed
"your session is ready, open it on your phone" to a user who had never asked for RC in the first place.
`replBridgeExplicit` is **220=12 / 193=12** — the field is carryover; **only the guard reading it is new**.

The second argument, `isReattachedSession`, suppresses the push on `CLAUDE_BRIDGE_REATTACH_SESSION`
reconnects. Without it, every network blip would re-push "session ready" for the same session — a
different flavour of the same complaint.

The impression accounting is per-*key*: changing `impressionKey` server-side resets everyone's counter
without touching their config. `xLf` (`:720566-…`) writes the count back only when
`maxImpressions >= 0`, so an unlimited campaign does not churn the config file on every connect.

### 4.2 `.217` — pending permission prompts now replay to viewers that joined late

> *"Fixed Remote Control sessions not showing a pending permission prompt or dialog to viewers that
> connected after it appeared."*

**Verdict: NET_NEW.** `pending_permission_requests` and `pending_user_dialog_requests` are each
**220=12 / 193=9**, and the three new sites per field are all one change: the **repl-bridge**
`initialize` handler now answers with them.

```javascript
// ============================================
// bridge control_request "initialize" arm - now replays in-flight prompts
// Location: cli_inner_pretty.js:414758-414787
// ============================================

// ORIGINAL (for source lookup):
    case "initialize": {
      try { let P = p8e(e.request.supportedDialogKinds); if (P.length > 0) l?.(P); }
      catch (P) { w(`[bridge:repl] dialog-kind capture failed; acking initialize anyway: ${le(P)}`); }
      let R = s?.() ?? [],
        H = R.filter((P) => P.request.subtype === "can_use_tool"),
        L = R.filter((P) => P.request.subtype === "request_user_dialog");
      C = { type: "control_response",
            response: { subtype: "success", request_id: e.request_id,
              response: { commands: [], agents: [], output_style: "normal",
                          available_output_styles: ["normal"], models: [], account: {},
                          pid: process.pid, ...i?.() },
              ...(H.length > 0 && { pending_permission_requests: H }),
              ...(L.length > 0 && { pending_user_dialog_requests: L }) } };
      break;
    }

// READABLE (for understanding):
    case "initialize": {
      try { let kinds = parseSupportedDialogKinds(req.request.supportedDialogKinds);
            if (kinds.length > 0) onDialogKindsDeclared?.(kinds); }
      catch (err) { logDebug(`[bridge:repl] dialog-kind capture failed; acking initialize anyway: ${fmt(err)}`); }
      let pending = getPendingPrompts?.() ?? [],                       // NEW callback
        permissionPrompts = pending.filter((p) => p.request.subtype === "can_use_tool"),
        dialogPrompts    = pending.filter((p) => p.request.subtype === "request_user_dialog");
      reply = { type: "control_response",
                response: { subtype: "success", request_id: req.request_id,
                  response: { …staticInitFields, pid: process.pid, ...getInitializeState?.() },
                  ...(permissionPrompts.length > 0 && { pending_permission_requests: permissionPrompts }),
                  ...(dialogPrompts.length    > 0 && { pending_user_dialog_requests: dialogPrompts }) } };
      break;
    }

// Mapping: bkd→respondToBridgeControlRequest, s→getPendingPrompts, i→getInitializeState,
//          l→onDialogKindsDeclared, p8e→parseSupportedDialogKinds
```

2.1.193's arm (`:558482-558507 (193)`) is byte-for-byte the same **minus** the three statements: no
`s?.()`, no partition, no spread. The handler's destructured options object gained one member,
`getPendingPrompts` (**220=2 / 193=0**, `:414729`, second consumer `:417304`), and every other callback shifted one letter.

**Why partition on the client side of the boundary rather than sending one list?** Because the two
kinds have different *rendering contracts* — a `can_use_tool` request draws an allow/deny prompt, a
`request_user_dialog` draws an arbitrary dialog whose kind the client had to declare support for in
this very same `initialize` (the `supportedDialogKinds` capture two lines above). Merging them would
force the client to re-discriminate, and a client that does not support a dialog kind must be able to
ignore that list wholesale.

The contract for the receiving side is documented at `:839684` (a `.describe()` on the schema):

> `request_user_dialog requests still awaiting a response. Sent on the initialize response (sibling of
> pending_permission_requests) so a client joining an already-initialized session can re-arm in-flight
> dialogs. Receivers must tolerate the same request_id also arriving as a live or replayed
> control_request frame and render it once.`

That last sentence is the whole design: replay is **not** de-duplicated on the sending side. The same
`request_id` can legitimately arrive twice (once in the initialize response, once as a live frame that
was already in flight), and idempotence is pushed onto the renderer. The SDK client cooperates from the
other end — `awaitControlResponse` (`:548621-548649`) now *strips* the two fields off any response it
resolves and logs `[Query] Ignoring prompt-redelivery fields on awaitControlResponse response`
(`:548631`), so a replay attached to some unrelated control response can never be mistaken for that
response's payload. `:548739-548743` is the pre-existing consumer that actually re-arms them (its
193 twin is `:564460-564464 (193)`).

The dedup index at `:841141` builds
`new Set([...e.getPendingPermissionRequests(), ...e.getPendingUserDialogRequests()].map((s) => s.request_id))`
— the receiving side's own idempotence key.

### 4.3 `.214`'s prompt-ordering bullet stays UNANCHORED, and its recorded anchor is an upsell

> *"Fixed permission prompts on remote sessions that could proceed before the local confirmation
> dialog."*

`tengu_rc_permission_nudge` is **220=2 / 193=0**, which is why the scoping pass picked it. Reading both
sites confirms [`../38_permissions/security_hardening_214.md`](../38_permissions/security_hardening_214.md)
§9: it is a **growth impression counter**, not an ordering guard.

- `f5a` (`:720478-720494`) resolves `{afterPromptCount, probability, maxImpressions}` from the env var
  `CLAUDE_CODE_RC_PERMISSION_NUDGE` (JSON, **220=1 / 193=0**) then the gate `tengu_rc_permission_nudge`
  (`:720487`), flooring `afterPromptCount` at 1.
- `:816818` emits `tengu_rc_permission_nudge_shown` with `permission_mode` and `prompt_count` after the
  banner *"Approve tool calls from your phone"* is queued.
- The eligibility check `y5a` (`:720536-720539`) is `bk() && rcPermissionNudgeSeenCount < max`, and the
  writer `_5a` (`:720540-720543`) bumps `rcPermissionNudgeSeenCount` (**220=2 / 193=0**) and emits
  `tips_rc_permission_nudge_show` (**220=1 / 193=0**).

Its sibling family in the same file — `tengu_rc_long_turn_nudge` (`:720452`, config `_Lf`
`:720442-720468`, forced by `CLAUDE_CODE_FORCE_RC_LONG_TURN_NUDGE`, **220=1 / 193=0**) — is the same
shape with a **90-second threshold clamped to 5…3600 s** and a **07:00–21:00 local-hours window**
(`bLf`, `:720469-720473`). A time-of-day window on a nudge is a strong tell that this whole cluster is
marketing surface, not correctness surface. None of it is the `.214` fix.

**I could not anchor `.214`'s ordering bullet.** The honest statement: the pending-request replay of
§4.2 explains `.217` cleanly and does *not* explain "proceeded before the local dialog"; the local
dialog is the TUI's own `requestDialog`, and the bridge path around `:337621-337647` (which races a
bridge dialog against a local one with an abort-linked timeout) is **carryover** in both builds. It
stays unanchored rather than being attached to the nearest new gate.

---

## 5. `.202` — the permission mode a remote client displays

> *"Fixed `/remote-control` sessions showing the wrong permission mode in the mobile and web apps."*

**Verdict: DELTA.** `current_permission_mode` is **220=3 / 193=2** and both 193 sites survive:

| Site | 220 | 193 | What it is |
|---|---|---|---|
| `getInitializeState()` in the TUI bridge hook | `:738326` | `:623416 (193)` | connect-time answer to `initialize` |
| the `initialize` response schema | `:838483` | `:700807 (193)` | wire contract |
| `getInitializeState()` in the **SDK/headless** bridge host | `:848858` | **absent** | second host path |

So `.202`'s repair has two halves, and only the second is a new *site*:

1. **A second host learned to answer.** `:848858` is inside `initReplBridge({...})` on the headless /
   `claude rc` path (`:848850-848860`). 2.1.193 only supplied `getInitializeState` from the TUI hook;
   a bridge started from the SDK host answered `initialize` without a permission mode, so the phone
   fell back to its own default and displayed it.
2. **The mode became part of the periodic `system/init` frame, not just the connect handshake.** The
   builder `te()` (`:737994-738025`, gated on `tengu_bridge_system_init`, **220=1 / 193=1**) now
   includes `permissionMode: AP(ve.toolPermissionContext.mode)` (`:738009`) alongside
   `fastModeState` (`:738017`) and `fastModeDisabledReason` (`:738018`). The consumer is `:757315`:
   `if (we.type === "system" && "permissionMode" in we && we.permissionMode) I.current(we.permissionMode);`
   — a mode carried on *any* system frame updates the client.

The connect-time-only design is the bug: a mode changed after connect (`/permissions`, a plan-mode
exit, an `--permission-mode` respawn) never reached a client that was already attached. The wire
contract's own words for the sibling field make the intent explicit (`:838486`):
*"The CLI's active permission mode at connect time, for the same connect-time sync as current_model."*
Connect-time sync fixes the join; the `system/init` re-broadcast fixes the drift.

Both halves are also why `.202` sits in this document rather than `38_permissions`: nothing about the
permission *decision* changed, only who is told about it.

---

## 6. `.214` — `claude rc` in the home directory

> *"Improved the `claude rc` workspace-trust error in the home directory to say trust there is never
> saved and to suggest running from a project directory."*

**Verdict: NET_NEW.** `home-directory trust is never saved` **220=1 / 193=0**; `claude rc` as a literal
**220=1 / 193=0**. Both are in one branch at `:546764-546772`:

```javascript
if ((I(A), R(A), !T())) {                       // T = checkHasTrustDialogAccepted
  let Lt = Qbr.homedir() === Ht();              // is cwd the home directory?
  (console.error(
    Lt
      ? `Error: Workspace not trusted. ${A} is your home directory, and for security home-directory trust is never saved, so running \`claude\` here first won't help. Run \`claude rc\` from a project directory instead (run \`claude\` there once to accept the trust dialog).`
      : `Error: Workspace not trusted. Please run \`claude\` in ${A} first to review and accept the workspace trust dialog.`,
  ), process.exit(1));
}
```

The generic branch is the carryover message. **Why the special case is necessary rather than merely
nice:** the generic advice ("run `claude` here first") is *actively wrong* in `$HOME`, because the trust
store deliberately refuses to persist a grant for the home directory — a home-directory trust would
cover every project the user will ever create. So the old message sent the user into an infinite loop:
run `claude`, accept the dialog, run `claude rc`, get the same error. The new branch names the reason
and redirects to a directory where the grant *can* stick.

`claude rc` is a non-interactive entrypoint (registered hidden at `:867747`), which is why it prints to
`stderr` and exits rather than showing the trust dialog itself — it has no TUI to show it in. The same
function immediately after checks `if (!P()) (console.error(i_r), process.exit(1))` (`:546777`), reusing
the `BRIDGE_LOGIN_ERROR` constant from §3.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_remote_control.md](../00_overview/symbol_additions_v2_1_220_remote_control.md).

Key functions in this document:
- `isBridgeFirstParty` (`DVe`, `:535447`) - the `.196` provider + base-URL gate
- `isActualFirstPartyAnthropicBaseUrl` (`dGr`, `:100362`) - host allow-list, carryover predicate
- `assumeFirstPartyBaseUrl` (`Yd`, `:100358`) - the override wrapper Remote Control deliberately bypasses
- `buildRemoteControlProviderBlocker` (`H4_`, `:535656`) - the `.219` five-way attribution
- `describeAuthPrecedenceBlocker` (`Qdo`, `:535639`) - the carryover auth-half precedent
- `getBridgeDisabledReason` (`VUo`, `:535477`) - the 13-rung eligibility ladder
- `isBridgeEnabled` (`bk`, `:535467`) / `hasBridgeEntitlement` (`NDt`, `:535451`)
- `isRemoteControlHardDisabled` (`YBt`, `:535464`) - managed `disableRemoteControl`
- `getRemoteControlPolicyVerdict` (`cmn`, `:535726`) - `allow_remote_control` org policy
- `isRemoteControlCommandEnabled` (`oP_`, `:503352`) - the `.206` logged-out carve-out
- `resolveRemoteControlReadyPushConfig` (`TLf`, `:720544`) - `tengu_kairos_ready_nudge` reader
- `canShowRemoteControlReadyPush` (`CLf`, `:720555`) - the `.214` explicit-enable guard
- `resolveRemoteControlPermissionNudgeConfig` (`f5a`, `:720478`) - upsell, NOT an ordering fix
- `resolveRemoteControlLongTurnNudgeConfig` (`_Lf`, `:720442`) - upsell sibling with a 07:00–21:00 window
- `respondToBridgeControlRequest` (`bkd`, `:414724`) - the bridge control-request responder
- `PROVIDER_DISPLAY_NAMES` (`ZK`, `:100384`) / `THIRD_PARTY_PROVIDER_ENV_VARS` (`pJt`, `:100393`)
- `RC_FIRST_PARTY_ONLY` (`mbr`, `:535810`), `UNSET_IT_HINT` (`ecp`, `:535811`), `UNSET_THEM_HINT` (`tcp`, `:535812`)
