# Fast mode: eligibility, the Opus 4.7 changelog↔code discrepancy, gating, cooldown, telemetry

> **Type/version:** the feature is **CARRYOVER** from before 2.1.193 — nearly every string, gate,
> settings key and state machine is byte-equivalent across the window. Four narrow deltas belong to
> this window: `.208` (fast mode restoring on model switch-back), `.218` (announcements when fast
> mode changes), `.219` bullet 12 (Remote Control stale state), and `.219` bullet 22
> (**"Removed Opus 4.7 from fast mode" — which is NOT implemented in the 2.1.220 client**).
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
> (`VERSION 2.1.220`, build `4073f595`). Every `cli_inner_pretty.js:<line>` is a **220** line
> unless tagged **(193)**.

---

## TL;DR — read the carryover table before writing anything about fast mode

Every one of these is essentially unchanged, and several counts **shrank**:

| Literal | 220 | 193 | verdict |
|---|---|---|---|
| `Fast mode requires a paid subscription` | 1 | 1 | carryover |
| `Fast mode unavailable during evaluation. Please purchase credits.` | 1 | 1 | carryover |
| `Fast mode has been disabled by your organization` | 1 | **2** | shrank |
| `Fast mode requires usage credits · /usage-credits to turn them on` | 2 | 2 | carryover |
| `Fast mode unavailable due to network connectivity issues` | 1 | 1 | carryover |
| `Fast mode is currently unavailable` | 1 | 1 | carryover |
| `is not in your organization's allowed models` | 1 | 1 | carryover |
| `Checking fast mode availability` | 1 | **2** | shrank |
| `Fast mode cooldown expired, re-enabling fast mode` | 1 | 1 | carryover |
| `tengu_fast_mode_overage_rejected` | 1 | 1 | carryover |
| `tengu_fast_mode_fallback_triggered` | 1 | 1 | carryover |
| `tengu_sunset_penguin_opus47` | 1 | 1 | carryover |
| `Fast mode ON` / `Fast mode OFF` | 5 / 6 | 5 / **7** | carryover |
| `Draws from usage credits` | 5 | **7** | shrank |
| `fastMode` / `fastModePerSessionOptIn` zod fields | 3 | 3 | carryover |
| `CLAUDE_CODE_SKIP_FAST_MODE_ORG_CHECK` | 2 | 2 | carryover |
| `CLAUDE_CODE_SKIP_FAST_MODE_NETWORK_ERRORS` | 2 | 2 | carryover |

Genuinely new in this window:

| Literal | 220 | 193 |
|---|---|---|
| `model_switch_restore` | **1** | 0 |
| `model_switch_downgrade` | **1** | 0 |
| `tengu_fast_mode_toggled` call sites | **4** | 2 |
| `tengu_live_model_switch` | **2** | 0 |
| `claude-opus-5` in the eligibility substring list | yes | no |

---

## 1. The build-level gate: `vl()`

Everything starts here. `vl()` (`:109375-109378`) is the whole-feature kill switch:

```javascript
// ORIGINAL (:109375-109378):
function vl() {
  if (Hn() !== "firstParty") return !1;
  return !Z.CLAUDE_CODE_DISABLE_FAST_MODE;
}
```

**Fast mode is first-party only, full stop.** Bedrock, Vertex, Foundry, Mantle, both Claude Platform
channels and the gateway are all excluded before any model or org check runs. That is why the very
first unavailability reason in `z8()` is `"not_first_party"` → *"Fast mode is only available when
using the Anthropic API directly"* (`:109427`).

`vl()` guards **20 separate call sites** across the module (`:109383`, `:109403`, `:109452`,
`:109456`, `:109468`, `:109500`, `:109506`, `:109566`, `:109597`, `:109609`, `:109714`, `:450668`,
`:450884`, `:451250`, `:451254`, `:565450`, `:715279`, `:715512`, `:738385`, `:754667`, `:823724`).
Placing the provider test *inside* the flag helper rather than at each call site is what keeps that
invariant from drifting.

---

## 2. Eligibility: `mv()` and the `.219` bullet-22 discrepancy

**The bullet:** `.219` — *"Removed Claude Opus 4.7 from fast mode; `/fast` now applies to Claude
Opus 5 and Claude Opus 4.8."*

**The code says Opus 4.7 is still eligible — twice over.**

```javascript
// ============================================
// isFastModeEligibleModel - decides whether /fast can apply to a model
// Location: cli_inner_pretty.js:109467-109474
// ============================================

// ORIGINAL (for source lookup):
function mv(e) {
  if (!vl()) return !1;
  let t = e ?? Z$(),
    r = vi(t);
  if (M$(lo(r), "fast_mode")) return !0;
  let n = r.toLowerCase();
  return n.includes("opus-4-7") || n.includes("opus-4-8") || n.includes("opus-5");
}

// READABLE (for understanding):
function isFastModeEligibleModel(modelOverride) {
  if (!isFastModeBuildEnabled()) return false;                       // 1P + not disabled by env
  const requested = modelOverride ?? getSessionModel();
  const resolved = resolveModelAliasOrId(requested);                 // "opus" -> "claude-opus-5"
  if (modelHasCapability(normaliseToCatalogueId(resolved), "fast_mode")) return true;   // catalogue
  const lower = resolved.toLowerCase();
  return lower.includes("opus-4-7") || lower.includes("opus-4-8") || lower.includes("opus-5");
}

// Mapping: mv→isFastModeEligibleModel, vl→isFastModeBuildEnabled, Z$→getSessionModel,
//          vi→resolveModelAliasOrId, M$→modelHasCapability, lo→normaliseToCatalogueId
```

**The proof, in two independent places:**

1. **The catalogue branch.** `claude-opus-4-7`'s `capabilities` array still contains `"fast_mode"` at
   `:14324`, inside the entry spanning `:14304-14328`. `M$(id, "fast_mode")` therefore returns `!0`
   and `mv()` returns `true` before the substring list is even reached.
2. **The substring branch.** `:109473` reads
   `n.includes("opus-4-7") || n.includes("opus-4-8") || n.includes("opus-5")`.

`fast_mode` as a capability token is present on exactly three entries — Opus 4.7 `:14324`,
Opus 4.8 `:14357`, Opus 5 `:14392`.

**What the *real* window delta is.** 2.1.193's equivalent predicate `Fm` (`:102320-102325 (193)`) had
no catalogue branch at all:

```javascript
// ORIGINAL (:102320-102325 (193)):
function Fm(e) {
  if (!ic()) return !1;
  let t = e ?? aw(),
    r = qo(t).toLowerCase();
  return r.includes("opus-4-6") || r.includes("opus-4-7") || r.includes("opus-4-8");
}
```

So across the window the substring list moved **`opus-4-6` out, `opus-5` in**, and a capability-first
branch was prepended. **`opus-4-7` was not touched.** The bullet describes a *two*-element list
(`opus-5` and `opus-4-8`); the code ships a *three*-element one.

**Where the removal must actually live.** Three candidates, all outside the client's eligibility
predicate:

- **The org/flag layer, `xji()` (`:109461-109466`)** — see §3. This is pure carryover
  (byte-equivalent to 193's `HOr`, `:102314-102319 (193)`) but it is server-driven, so an org policy
  can withdraw fast mode without a client change.
- **The server availability endpoint** `GET /api/claude_code_penguin_mode` (`:109589`), whose
  `{enabled, disabled_reason}` response drives the whole `pB` state machine (§5).
- **The deprecation clock, `LIc()` (`:109491-109497`)**, which is *specifically about Opus 4.7*:

```javascript
// ORIGINAL (:109491-109497):
function LIc() {
  if (lo(Oi()) !== "claude-opus-4-7") return null;
  let e = Ke("tengu_sunset_penguin_opus47", "2026-07-25"),
    t = Date.parse(e);
  if (Number.isNaN(t) || Date.now() >= t) return null;
  return new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}
```

The default sunset date is **`2026-07-25`**, which `Date.parse` reads as `2026-07-25T00:00:00Z` —
**1 h 42 min after this bundle's `build_time` of `2026-07-24T22:17:45Z`**. So the "Opus 4.7 retires
on Jul 25" notice had a live window of under two hours from the moment the build shipped, and for
every user who runs 2.1.220 after that instant `Date.now() >= t` holds and `LIc()` returns `null`.
A shipped-already-expired default is itself the signal: the client's Opus 4.7 deprecation surface is
*done*, and the server is expected to carry any remaining behaviour. Even so, this is a **notice**,
not an eligibility change — `mv()` never consults `LIc()`.

Note what happened to the shape here: 2.1.193 kept a **table** of sunsets,

```javascript
// ORIGINAL (:102522-102525 (193)):
QYu = [
  { canonical: "claude-opus-4-6", label: "Opus 4.6", flag: "tengu_sunset_penguin_opus46", defaultDate: "2026-06-29" },
  { canonical: "claude-opus-4-7", label: "Opus 4.7", flag: "tengu_sunset_penguin_opus47", defaultDate: "2026-07-25" },
];
```

driven by a generic lookup (`WYs`, `:102326-102335 (193)`). 220 collapsed it to a single hard-coded
`claude-opus-4-7` check because the 4.6 row expired. The *generic* mechanism was deleted and replaced
by the *specific* one — an unusual direction of travel, and a hint that Anthropic did not expect
another sunset banner soon.

**Verdict: DELTA-with-discrepancy.** The window delta is `4-6` out / `5` in plus the capability
branch. Do **not** write the Opus 4.7 removal up as implemented. The `/fast` command in 2.1.220 will
happily enable fast mode on Opus 4.7 and bill it at `UIc`'s $30/$150 (see
[`opus5_and_sonnet5.md`](opus5_and_sonnet5.md) §4).

---

## 3. Org + flag gating: `xji()` — pure carryover, but the load-bearing layer

```javascript
// ============================================
// isFastModeAllowedByPolicy - the org/flag consent gate
// Location: cli_inner_pretty.js:109461-109466
// ============================================

// ORIGINAL (for source lookup):
function xji(e) {
  if (e.fastMode !== !0) return !1;
  if (!e.fastModePerSessionOptIn) return !0;
  if (Pr("policySettings")?.fastModePerSessionOptIn === !0) return !1;
  return Pr("flagSettings")?.fastMode === !0;
}

// READABLE (for understanding):
function isFastModeAllowedByPolicy(mergedSettings) {
  if (mergedSettings.fastMode !== true) return false;                     // 1. not enabled at all
  if (!mergedSettings.fastModePerSessionOptIn) return true;               // 2. persists across sessions
  if (readSettings("policySettings")?.fastModePerSessionOptIn === true)
    return false;                                                         // 3. managed: never persist
  return readSettings("flagSettings")?.fastMode === true;                 // 4. only a flag can persist
}

// Mapping: xji→isFastModeAllowedByPolicy, Pr→readSettings
```

**How it works and why the order matters:**
1. `fastMode !== !0` — strict `true`, so a stray `"true"` string or `1` never enables it.
2. If per-session opt-in is *not* requested, a persisted `fastMode: true` is honoured immediately.
   This is the common case and is checked second so the hot path is two comparisons.
3. If `fastModePerSessionOptIn` came from **`policySettings`** (managed/enterprise), the answer is a
   hard `false`: the org has said "each session must start with fast mode off", and no lower-precedence
   source may override that.
4. Otherwise the only thing that can revive it is **`flagSettings.fastMode`** — the server-pushed flag
   layer. So the escalation ladder is: user preference < org policy < server flag.

The two schema fields (`:61190-61193` and `:61194-61197`) are carryover and their describe strings are
the clearest statement of intent in the module:

```javascript
// ORIGINAL (:61190-61197):
fastMode: v.boolean().optional()
  .describe("When true, fast mode is enabled. When absent or false, fast mode is off."),
fastModePerSessionOptIn: v.boolean().optional()
  .describe("When true, fast mode does not persist across sessions. Each session starts with fast mode off."),
```

The composition of the two — `a5r()` (`:109455-109460`) — is the actual "may this session use fast
mode by default?" predicate:

```javascript
// ORIGINAL (:109455-109460):
function a5r(e) {
  if (!vl()) return !1;
  if (!Q$(e)) return !1;              // no unavailability reason
  if (!mv(e)) return !1;              // model is eligible
  return xji(eo());                   // policy/flag consent
}
```

Note the ordering: build flag → availability → model → policy. Cheapest and most-decisive first;
`xji()` is last because it performs two settings-file reads.

---

## 4. The unavailability taxonomy: two enums, two message tables

There are **two distinct reason spaces**, and conflating them is easy.

**Space A — `z8()`'s coarse reasons** (`:109402-109417`), which include client-side conditions:

| reason | source | message (`xig`, `:109424-109444`) |
|---|---|---|
| `not_first_party` | `vl()` failed on provider | *Fast mode is only available when using the Anthropic API directly* `:109427` |
| `disabled_by_env` | `CLAUDE_CODE_DISABLE_FAST_MODE` | *Fast mode is not available* `:109429` |
| `model_not_allowed` | org allow-list rejects `opus` | `` `${uW()} is not in your organization's allowed models` `` `:109431` |
| `sdk_opt_in_required` | Agent SDK without `flagSettings.fastMode` | *Fast mode is not available in the Agent SDK* `:109433` |
| `pending` | availability fetch in flight | *Checking fast mode availability* `:109435` |
| `unknown` | `tengu_penguins_off` gate returned a string | that gate's string, else `HIc("unknown","oauth")` `:109437` |
| `free`, `preference`, `extra_usage_disabled`, `network_error` | forwarded from space B | `HIc(reason, authKind)` `:109442` |

**Space B — the server's `disabled_reason`** (`Hig`, `:109710`), a `Set` of exactly five values used
to sanitise whatever the endpoint sends:

```javascript
// ORIGINAL (:109710 and :109571-109573):
Hig = new Set(["free", "preference", "extra_usage_disabled", "network_error", "unknown"]);
function Iig(e) {
  return e !== null && e !== void 0 && Hig.has(e) ? e : e === null || e === void 0 ? "preference" : "unknown";
}
```

`Iig` is a **three-way** normaliser, not a two-way one: a recognised value passes through, `null`/
`undefined` becomes `"preference"` (the benign "your org turned it off" reading), and anything else
becomes `"unknown"`. Defaulting a *missing* reason to `preference` rather than `unknown` matters
because `preference` renders *"Fast mode has been disabled by your organization"* (`:109393`) —
actionable — whereas `unknown` renders *"Fast mode is currently unavailable"* (`:109399`), which is
not. A server that forgets the field gets the useful message.

**Space C — a *third*, finer overage taxonomy** (`kig`, `:109523-109545`) with nine cases mapped onto
five messages. This one is about usage credits specifically:

```
out_of_credits                                        -> "Fast mode disabled · usage credits exhausted"
org_level_disabled, org_service_level_disabled        -> "… usage credits turned off by your organization"
org_level_disabled_until, org_spend_cap_reached       -> "… usage credit limit reached"
member_level_disabled                                 -> "… usage credits turned off for your account"
seat_tier_level_disabled, seat_tier_zero_credit_limit,
  member_zero_credit_limit                            -> "… usage credits not available for your plan"
overage_not_provisioned, no_limits_configured         -> "Fast mode requires usage credits · /usage-credits to turn them on"
default                                               -> "… usage credits not available"
```

and a **transient/permanent split** at `:109546-109548`:

```javascript
// ORIGINAL (:109546-109548):
function l5r(e) {
  return e === "org_level_disabled_until" || e === "org_spend_cap_reached" || e === "out_of_credits";
}
```

`NIc()` (`:109549-109561`) uses it to decide whether to **persist** the refusal:

```javascript
// ============================================
// handleFastModeOverageRejection - persist only permanent refusals
// Location: cli_inner_pretty.js:109549-109561
// ============================================

// ORIGINAL (for source lookup):
function NIc(e) {
  let t = kig(e);
  if (
    (w(`Fast mode overage rejection: ${e ?? "unknown"} — ${t}`),
    O("tengu_fast_mode_overage_rejected", { overage_disabled_reason: e ?? "unknown" }),
    !l5r(e))
  )
    (yi("userSettings", { fastMode: void 0 }),
      hr((r) => (r.penguinModeOrgEnabled === !1 ? r : { ...r, penguinModeOrgEnabled: !1 })),
      (pB = { status: "disabled", reason: "extra_usage_disabled", source: "server" }),
      s7n.emit(!1));
  $Ic.emit(t);
}

// READABLE (for understanding):
function handleFastModeOverageRejection(reason) {
  const message = overageMessageFor(reason);
  log(`Fast mode overage rejection: ${reason ?? "unknown"} — ${message}`);
  emit("tengu_fast_mode_overage_rejected", { overage_disabled_reason: reason ?? "unknown" });
  if (!isTransientOverageReason(reason)) {                 // permanent -> clear the user's preference
    writeSettings("userSettings", { fastMode: undefined });
    updateConfig((c) => c.penguinModeOrgEnabled === false ? c : { ...c, penguinModeOrgEnabled: false });
    fastModeAvailability = { status: "disabled", reason: "extra_usage_disabled", source: "server" };
    availabilityChanged.emit(false);
  }
  overageMessage.emit(message);                            // always surface the message
}

// Mapping: NIc→handleFastModeOverageRejection, kig→overageMessageFor,
//          l5r→isTransientOverageReason, pB→fastModeAvailability, yi→writeSettings,
//          hr→updateConfig, s7n→availabilityChanged, $Ic→overageMessage
```

**Why the transient/permanent split.** `org_spend_cap_reached`, `org_level_disabled_until` and
`out_of_credits` all clear on their own — the next billing period, the `_until` timestamp, a credit
top-up. Wiping `userSettings.fastMode` for those would mean the user has to re-enable fast mode
manually after a cap they never chose. Structural refusals (`member_level_disabled`,
`seat_tier_zero_credit_limit`, `overage_not_provisioned`) will not clear, so persisting the off-state
avoids a per-turn round trip that always fails. Either way the *message* is emitted, so the user
always learns why.

`OIc()` (`:109516-109522`) is the same persist-and-clear pattern for the plain org-disable path, with
a guard worth noting: `if (pB.status === "disabled" && pB.source === "server" && !FIc(pB.reason)) return;`
— i.e. do not overwrite an existing *authoritative* server refusal with a generic one, where
`FIc` (`:109577-109579`) marks `network_error` / `unknown` as the non-authoritative pair.

---

## 5. Availability state machine and the network-failure posture

`pB` (declared `:109685`, initialised `{ status: "pending" }` at `:109711`) is the availability
state: `pending | enabled | {disabled, reason, source}` where `source ∈ "server" | "guess"`.

`JJt()` (`:109607-109675`) is the fetch, and its structure is a checklist of ways not to hurt startup:

1. `Rji()` (`:109596-109606`) sets an **optimistic-from-cache** initial value first, from
   `penguinModeOrgEnabled` in the config, so the UI has something before any network call.
2. `if (!vl()) return;` — never fetch on a third-party provider.
3. `o7n()` = `CLAUDE_CODE_SKIP_FAST_MODE_ORG_CHECK` (`:109379-109381`) short-circuits to
   `{status: "enabled"}` — the test/CI escape hatch.
4. `if (i5r) return …` — an in-flight promise is *returned*, not awaited twice
   (*"Fast mode prefetch in progress, returning in-flight promise"*, `:109614`).
5. **A 30-second throttle**: `Lig = 30000` (`:109688`), `if (r - IIc < Lig) return;` (`:109624`). Fast
   mode availability is checked on every model switch and every `/fast`; without the throttle a user
   flipping models would hammer the endpoint.
6. With no OAuth token and no API key it does not call at all — it guesses from
   `penguinModeOrgEnabled` and marks `source: "guess"` (`:109620`).
7. **One 401/403 retry with a token refresh** (`:109641-109651`), and only for
   `401` or a `403` whose body contains `"OAuth token has been revoked"`. Anything else rethrows.
8. On failure (`:109664-109669`): stand on the cached value if any, else
   `{disabled, reason: "network_error", source: "guess"}`, log *"Failed to fetch org fast mode status,
   standing on …"* and emit `tengu_org_penguin_mode_fetch_failed`.

**The interesting policy choice is in `z8()`** (`:109412-109415`):

```javascript
// ORIGINAL (:109412-109415):
if (pB.status === "disabled" && !o7n()) {
  if (FIc(pB.reason) && (Z.CLAUDE_CODE_SKIP_FAST_MODE_NETWORK_ERRORS || t)) return null;
  return pB.reason;
}
```

`FIc(reason)` is true for `network_error` and `unknown`. So a **network failure is fail-closed by
default** (fast mode is treated as unavailable) but can be made **fail-open** by either
`CLAUDE_CODE_SKIP_FAST_MODE_NETWORK_ERRORS` or `flagSettings.fastMode === true` (`t`, computed at
`:109409`). Fail-closed is the right default for a *billing-relevant* capability: guessing "enabled"
when the org may have turned it off would spend credits the org refused. The two overrides exist for
air-gapped/proxied installs where the endpoint is permanently unreachable but the entitlement is known.

`Tji()` (`:109580-109587`) is the setter, and it only fires the subscriber when the *user-visible*
answer changed:

```javascript
// ORIGINAL (:109580-109587):
function Tji(e) {
  let t = pB;
  if (((pB = e), e.status === "pending")) return;
  let r = t.status !== "pending" ? t.status === "enabled" : xt().penguinModeOrgEnabled === !0,
    n = e.status === "enabled",
    o = t.status === "disabled" && e.status === "disabled" && t.reason !== e.reason;
  if (r !== n || o) s7n.emit(n);
}
```

Note the second condition `o`: a disabled→disabled transition **with a different reason** also emits,
because the *message* changed even though the boolean did not. Without it, a user whose refusal moved
from `network_error` to `extra_usage_disabled` would keep seeing the stale explanation.

---

## 6. Cooldown: a self-healing fallback window

```javascript
// ============================================
// triggerFastModeCooldown / readFastModeCooldown - the fallback window
// Location: cli_inner_pretty.js:109498-109515
// ============================================

// ORIGINAL (for source lookup):
function i7n() {
  if (XJt.status === "cooldown" && Date.now() >= XJt.resetAt) {
    if (vl() && !Cji) (w("Fast mode cooldown expired, re-enabling fast mode"), (Cji = !0), PIc.emit());
    XJt = { status: "active" };
  }
  return XJt;
}
function MIc(e, t) {
  if (!vl()) return;
  ((XJt = { status: "cooldown", resetAt: e, reason: t }), (Cji = !1));
  let r = e - Date.now();
  (w(`Fast mode cooldown triggered (${t}), duration ${Math.round(r / 1000)}s`),
    O("tengu_fast_mode_fallback_triggered", { cooldown_duration_ms: r, cooldown_reason: fe(t) }),
    DIc.emit(e, t));
}
function dde() {
  XJt = { status: "active" };
}

// READABLE (for understanding):
function readFastModeCooldown() {                       // lazy expiry — no timer
  if (cooldownState.status === "cooldown" && Date.now() >= cooldownState.resetAt) {
    if (isFastModeBuildEnabled() && !cooldownExpiryAnnounced) {
      log("Fast mode cooldown expired, re-enabling fast mode");
      cooldownExpiryAnnounced = true;                   // one announcement per cooldown
      cooldownExpired.emit();
    }
    cooldownState = { status: "active" };
  }
  return cooldownState;
}

function triggerFastModeCooldown(resetAtMs, reason) {
  if (!isFastModeBuildEnabled()) return;
  cooldownState = { status: "cooldown", resetAt: resetAtMs, reason };
  cooldownExpiryAnnounced = false;                      // arm the announcement
  const durationMs = resetAtMs - Date.now();
  log(`Fast mode cooldown triggered (${reason}), duration ${Math.round(durationMs / 1000)}s`);
  emit("tengu_fast_mode_fallback_triggered", { cooldown_duration_ms: durationMs, cooldown_reason: sanitise(reason) });
  cooldownStarted.emit(resetAtMs, reason);
}

function clearFastModeCooldown() { cooldownState = { status: "active" }; }

// Mapping: i7n→readFastModeCooldown, MIc→triggerFastModeCooldown, dde→clearFastModeCooldown,
//          XJt→cooldownState, Cji→cooldownExpiryAnnounced, PIc→cooldownExpired,
//          DIc→cooldownStarted, vl→isFastModeBuildEnabled
```

**Design notes:**
- **Lazy expiry, not a timer.** `i7n()` checks the clock on read. In a CLI that spends most of its life
  blocked on the user, a `setTimeout` would keep the event loop alive and fire in the middle of
  unrelated work. Every consumer (`WCe()`, `:109562-109564`; `sY()`, `:109565-109570`) goes through
  `i7n()`, so the state is always fresh at the moment it is used.
- **`resetAt` is an absolute timestamp supplied by the caller,** not a duration. The caller is the API
  error path, which knows the server-provided retry window, so the cooldown length is server-decided.
  `MIc` derives the duration only for the log/telemetry.
- **`Cji` is an announce-once latch.** It is cleared when a cooldown starts and set when the expiry is
  announced, so a user in a long cooldown sees exactly one "re-enabling" message, no matter how many
  times `i7n()` is called.
- **`dde()` clears the cooldown unconditionally** and is called at the top of every explicit toggle
  (`:450886`, `:451244`, `:451384`, `:499793`, `:715275`, `:738379`, `:754663`) — an explicit user action
  is treated as consent to retry immediately.

`sY()` (`:109565-109570`) is the three-valued status the UI renders:

```javascript
// ORIGINAL (:109565-109570):
function sY(e, t) {
  let r = vl() && Q$() && !!t && mv(e);
  if (r && WCe()) return "cooldown";
  if (r) return "on";
  return "off";
}
```

`"cooldown"` is distinct from `"off"` precisely so the UI can say "temporarily fell back" rather than
"you turned it off" — the state that `.219` bullet 12 (Remote Control keeping a stale fast-mode
status) is about.

---

## 7. `.208` and `.218`: the toggle telemetry and the switch-back fix

### 7.1 `IU()` — the model-switch fast-mode transition emitter (NET_NEW)

```javascript
// ============================================
// reportFastModeModelSwitchTransition - emits only on an actual flip
// Location: cli_inner_pretty.js:109483-109490
// ============================================

// ORIGINAL (for source lookup):
function IU(e, t) {
  if (!!e === t) return;
  O("tengu_fast_mode_toggled", {
    enabled: t,
    source: fe(t ? "model_switch_restore" : "model_switch_downgrade"),
    remote: CS(),
  });
}

// READABLE (for understanding):
function reportFastModeModelSwitchTransition(wasOn, isOn) {
  if (!!wasOn === isOn) return;                                     // no flip -> no event
  emit("tengu_fast_mode_toggled", {
    enabled: isOn,
    source: sanitise(isOn ? "model_switch_restore" : "model_switch_downgrade"),
    remote: isRemoteControlled(),
  });
}

// Mapping: IU→reportFastModeModelSwitchTransition, O→emit, fe→sanitise, CS→isRemoteControlled
```

`model_switch_restore` and `model_switch_downgrade` are both **220=1 / 193=0**, and they exist only
here. `IU` has **eleven** call sites (`:337698`, `:338049`, `:338264`, `:450886`, `:451254`,
`:565461`, `:715289`, `:715518`, `:738391`, `:754671`, `:823738`), each paired with a `HU()` call one
or two lines above.

`HU()` (`:109475-109482`) is the decision half:

```javascript
// ORIGINAL (:109475-109482):
function HU(e, t) {
  if (Bs()) {
    if (e === null) return !!t;
    return !!t && mv(e);
  }
  if (!mv(e)) return !1;
  return !!t || a5r(e);
}
```

**This pair is the `.208` bullet** — *"Fixed fast mode staying off after switching back to a model
that supports it."* The mechanism: on every model change, `HU(newModel, currentFastMode)` recomputes
whether fast mode *should* be on for the new model; if the new model is ineligible it returns `false`
(the **downgrade**), and if the previous state was off but the model is eligible and policy allows
(`a5r(e)`), it returns `true` (the **restore**). `IU(oldState, newState)` then reports the transition
only when it actually flipped. The bug was that only the downgrade half existed; the fix is the
`!!t || a5r(e)` on `:109481` plus a consistent `HU`/`IU` pair at every one of the eleven switch sites.

Note the `Bs()` branch at the top: in that mode (subagent/nested context) policy consent is *not*
re-evaluated — `!!t && mv(e)` — because a subagent must not silently escalate itself into fast mode;
it may only inherit and lose it.

### 7.2 `kmt()` — the announcement builder (the `.218` bullet)

`.218` bullet 31: *"Added an announcement when fast mode changes via `/config model=<x>` or Remote
Control."*

```javascript
// ============================================
// buildFastModeAnnouncement - the " · Fast mode ON/OFF" suffix
// Location: cli_inner_pretty.js:450667-450680
// ============================================

// ORIGINAL (for source lookup):
function kmt(e, t, r, n) {
  let o = vl(),
    i = o && t && (!e || n?.announceKeptOn === !0),
    s = o && !!e && !t;
  return (
    (i ? " \xB7 Fast mode ON" : "") +
    (K2s(r, t, KO()) ? " \xB7 Draws from usage credits" : "") +
    (s ? " \xB7 Fast mode OFF" : "")
  );
}
function uNd(e, t, r) {
  if (!!e === t) return null;
  return t ? `Fast mode ON${K2s(r, !0, KO()) ? " \xB7 Draws from usage credits" : ""}` : "Fast mode OFF";
}

// READABLE (for understanding):
function buildFastModeAnnouncement(wasOn, isOn, model, opts) {
  const enabled = isFastModeBuildEnabled();
  const announceOn  = enabled && isOn && (!wasOn || opts?.announceKeptOn === true);
  const announceOff = enabled && !!wasOn && !isOn;
  return (announceOn ? " · Fast mode ON" : "")
       + (drawsFromUsageCredits(model, isOn, is1mAvailable()) ? " · Draws from usage credits" : "")
       + (announceOff ? " · Fast mode OFF" : "");
}

// Mapping: kmt→buildFastModeAnnouncement, uNd→buildFastModeNotification,
//          vl→isFastModeBuildEnabled, K2s→drawsFromUsageCredits, KO→is1mAvailable
```

**The `announceKeptOn` flag is the whole design.** Without it, the announcement is emitted only on a
*transition* (`!wasOn && isOn`). Two of the four call sites pass `{announceKeptOn: !0}` —
`:450888` (the `/model` set path) and `:715295` — because after an explicit model switch the user
benefits from being reminded that fast mode is *still* on and still billing, even though nothing
changed. The other two (`:451255`, the `/config model=<x>` handler, and `:754675`) pass nothing and
therefore stay quiet unless the state flipped.

The call sites in the two surfaces the bullet names:

- **`/model` set** — `Pcn()` at `:450878-450889`:
  ```javascript
  // ORIGINAL (:450884-450888):
  a = vl() ? HU(e, i) : !!i;
  if (vl()) {
    if ((dde(), a !== !!i)) (r((l) => ({ ...l, fastMode: a })), IU(i, a));
  }
  return ((s += kmt(i, a, e, { announceKeptOn: !0 })), (s += X2s(e)), s);
  ```
- **`/config model=<x>`** — `:451241-451256`, which emits `tengu_config_model_changed` first, then
  runs the same `HU` → `IU` → `kmt` sequence with **no** `announceKeptOn`.

`uNd()` (`:450677-450680`) is the *notification* variant (a standalone line rather than a suffix) and
is transition-only by construction (`if (!!e === t) return null;`).

### 7.3 `.219` bullet 12: Remote Control stale fast-mode state

`tengu_live_model_switch` is **220=2 / 193=0** (`:337608`, `:537315`). The Remote Control fix is a
*third* new `tengu_fast_mode_toggled` source at `:757329`:

```javascript
// ORIGINAL (:757319-757330):
let it = we.fast_mode_state !== "off",
  ft = !1;
if (
  (q((cr) => {
    if (!!cr.fastMode === it) return cr;
    return ((ft = !0), { ...cr, fastMode: it });
  }),
  ft)
)
  O("tengu_fast_mode_toggled", { enabled: it, source: Ee("remote_wire_adopt"), remote: !0 });
```

The trigger is `(we.type === "system" && we.subtype === "init") || we.type === "result"` **and**
`we.fast_mode_state !== void 0` (`:337312-337315`-analogous guard at `:757311-757314`). So the client
now **adopts** the fast-mode state carried on the wire on every init *and* every result frame, rather
than only on connect — which is exactly what "keeping a stale fast-mode status after switching
models or reconnecting" describes. `fast_mode_state` is 220=21 / 193=18, so the wire field
pre-existed and the delta is the three new adoption points.

Note `it = we.fast_mode_state !== "off"` — a **three-valued** wire field (`"off"`, `"on"`,
`"cooldown"`, per `sY()` §6) collapsed to a boolean here. A remote client in cooldown is reported as
fast-mode-on, which is arguably right for the toggle indicator but loses the cooldown nuance.

### 7.4 `/fast` itself

```javascript
// ORIGINAL (:499810-499824):
async function eBo(e, t, r, n, o, i = !0) {
  let s = ude();
  if (s) return `Fast mode unavailable: ${s}`;
  let { mainLoopModel: a } = t();
  if ((d_r(e, r, i), O("tengu_fast_mode_toggled", { enabled: e, source: fe(n), remote: CS() }), e)) {
    let l = FUe(!0),
      c = !mv(a) ? ` \xB7 model set to ${uW()}` : "",
      u = Oi(),
      d = mv(u) ? lo(u) : "claude-opus-5",
      p = M6e(zkt(d)),
      f = ZFo();
    if (f) o?.({ type: "notification", notification: f });
    return `${l} Fast mode ON${c} \xB7 ${p}${i ? "" : " (this session only)"}`;
  } else return `Fast mode OFF${i ? "" : " (this session only)"}`;
}
```

Two window-relevant details:
- **`uW()` is hard-coded to `"Opus 5"`** (`:109445-109447`) and `Vkt()` returns `"opus"` (+`"[1m]"`
  when 1M is available, `:109448-109450`). So `/fast` on an ineligible model force-switches the
  session to the `opus` alias and says *"· model set to Opus 5"*. `.219` moved this string from
  Opus 4.8 to Opus 5, and it is a **literal**, not a catalogue read — one of the places the rewrite
  did not reach.
- **The fallback id when the session model is ineligible is the literal `"claude-opus-5"`**
  (`:499818`), used only to look up the price for the ON message. Same hard-coding.
- The `remote: CS()` field on the event is new relative to 193's `:547966 (193)`
  (`V("tengu_fast_mode_toggled", { enabled: e, source: $e(r) })` — no `remote`).

`d_r()` (`:499792-499809`) is the state writer, and it shows the Remote Control split clearly: when
remote, it sends a `apply_flag_settings` control request `{ fastMode: e ? !0 : null, ...(e && { model: Vkt() }) }`
(`:499798`) instead of writing `userSettings` — so the *server* owns the state for remote
sessions. Locally it writes `userSettings.fastMode` (or, with `r === false`, only the session-scoped
flag settings). The final block re-pins `mainLoopModel` to `Vkt()` when the current model is
ineligible (`:499803-499808`), including the subtlety `i = vi(o) === vi(Z$())` (`:499806`) → set
`mainLoopModel: null` (inherit the default) rather than pinning a redundant explicit value.

---

## 8. Where fast mode shows up in the picker

`_5r()` (`:111181-111187`) builds the price suffix and is the only user of the `↯` glyph:

```javascript
// ORIGINAL (:111181-111187):
function _5r(e, t) {
  if (!uGr()) return "";
  let r = YO(t),
    n = e ? M6e(zkt(r)) : jIc(r);
  if (n === void 0) return "";
  return ` \xB7${e ? ` (${ECe})` : ""} ${n}`;
}
```

with `ECe = "↯"` (`↯`, `:58411`). `if (!uGr()) return ""` suppresses all pricing off first-party
— the `.206` fix. When `e` (fast mode) is true it uses `zkt()`'s fast table and prefixes ` (↯)`;
otherwise `jIc()`'s catalogue-derived base rate. This is the single junction where the catalogue
rewrite and the imperative fast-mode tables meet in one expression.

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
- `isFastModeBuildEnabled` (`vl`, `:109375-109378`) - first-party + `CLAUDE_CODE_DISABLE_FAST_MODE`
- `skipFastModeOrgCheck` (`o7n`, `:109379-109381`) - `CLAUDE_CODE_SKIP_FAST_MODE_ORG_CHECK`
- `isFastModeAvailable` (`Q$`, `:109382-109385`)
- `fastModeUnavailabilityReason` (`z8`, `:109402-109417`) - the 7-reason coarse taxonomy
- `logAndFormatUnavailability` (`ude`, `:109418-109423`)
- `unavailabilityMessageFor` (`xig`, `:109424-109444`) / `serverReasonMessageFor` (`HIc`, `:109386-109401`)
- `FAST_MODE_PROMOTED_MODEL_NAME` (`uW`, `:109445-109447`) - hard-coded `"Opus 5"`
- `fastModeTargetAlias` (`Vkt`, `:109448-109450`) - `"opus"` / `"opus[1m]"`
- `isFastModeAllowedByPolicy` (`xji`, `:109461-109466`) - carryover org/flag ladder
- `isFastModeEligibleModel` (`mv`, `:109467-109474`) - capability-then-substring; **still admits Opus 4.7**
- `sessionFastModeDefault` (`a5r`, `:109455-109460`)
- `resolveFastModeForModel` (`HU`, `:109475-109482`) - the `.208` restore/downgrade decision
- `reportFastModeModelSwitchTransition` (`IU`, `:109483-109490`) - `model_switch_restore` / `model_switch_downgrade`
- `opus47SunsetNoticeDate` (`LIc`, `:109491-109497`) - `tengu_sunset_penguin_opus47`, default `2026-07-25`
- `readFastModeCooldown` (`i7n`, `:109498-109504`) / `triggerFastModeCooldown` (`MIc`, `:109505-109512`) / `clearFastModeCooldown` (`dde`, `:109513-109515`)
- `disableFastModeByOrgPreference` (`OIc`, `:109516-109522`)
- `overageMessageFor` (`kig`, `:109523-109545`) - the 9-case credit taxonomy
- `isTransientOverageReason` (`l5r`, `:109546-109548`)
- `handleFastModeOverageRejection` (`NIc`, `:109549-109561`) - `tengu_fast_mode_overage_rejected`
- `isInFastModeCooldown` (`WCe`, `:109562-109564`) / `fastModeUiStatus` (`sY`, `:109565-109570`)
- `normaliseServerDisabledReason` (`Iig`, `:109571-109573`) / `SERVER_DISABLED_REASONS` (`Hig`, `:109710`)
- `isServerAuthoritativeDisable` (`s5r`, `:109574-109576`) / `isNonAuthoritativeReason` (`FIc`, `:109577-109579`)
- `setFastModeAvailability` (`Tji`, `:109580-109587`) - emits on reason change too
- `fetchPenguinModeStatus` (`Rig`, `:109588-109595`) - `GET /api/claude_code_penguin_mode`
- `seedFastModeAvailabilityFromCache` (`Rji`, `:109596-109606`) / `prefetchFastModeAvailability` (`JJt`, `:109607-109675`)
- `cooldownState` (`XJt`, `:109676`, init `:109708`) / `fastModeAvailability` (`pB`, `:109685`, init `:109711`)
- `FAST_MODE_PREFETCH_THROTTLE_MS` (`Lig` = 30000, `:109688`)
- `buildFastModeAnnouncement` (`kmt`, `:450667-450676`) / `buildFastModeNotification` (`uNd`, `:450677-450680`)
- `applyModelSwitch` (`Pcn`, `:450878-450889`) - `/model` set path with `announceKeptOn`
- `writeFastModeState` (`d_r`, `:499792-499809`) - local vs Remote Control split
- `fastCommandHandler` (`eBo`, `:499810-499824`) - `/fast`
- `buildRatePricingSuffix` (`_5r`, `:111181-111187`) / `FAST_MODE_GLYPH` (`ECe` = `↯`, `:58411`)
