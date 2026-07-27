# Auto mode: availability, gating, and where the opt-in went

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`.
Baseline lines are tagged `(193)`.

`2.1.207` announced that auto mode "is now available without `CLAUDE_CODE_ENABLE_AUTO_MODE` opt-in on
Bedrock, Vertex AI, and Foundry; disable via `disableAutoMode` in settings". Both halves of that sentence
are traps for a literal-counting reader:

- `disableAutoMode` is **220=7 / 193=7** — the kill switch is **pure carryover**. It is not the delta.
- `CLAUDE_CODE_ENABLE_AUTO_MODE` still appears three times in 2.1.220 — but **two of the three are
  unreachable message strings**, and the one predicate that used to read the env var now returns `true`
  unconditionally.

The real `.207` delta is **one line**, and it is a deletion of an env-var read. This document proves that,
then works through what actually got built around it: two new onboarding surfaces, a settings-source
trust boundary, a repo-visibility lookup, and a `claude auto-mode reset` subcommand.

---

## 1. The one-line delta: `isAutoModeAvailableOnProvider`

**What it does:** answers "may this provider offer auto mode at all?" It is the outermost of four
availability gates and the only one that changed in this window.

### Before and after

```javascript
// ============================================
// isAutoModeAvailableOnProvider - the .207 change, in full
// Location: cli_inner_pretty.js:150416-150419  (2.1.193 counterpart: :135186-135189)
// ============================================

// ORIGINAL 2.1.193 (for source lookup):
function ont(e) {
  if (e === "firstParty" || e === "anthropicAws") return !0;
  return at(process.env.CLAUDE_CODE_ENABLE_AUTO_MODE);
}

// ORIGINAL 2.1.220 (for source lookup):
function Eer(e) {
  if (e === "firstParty" || iW(e)) return !0;
  return !0;
}

// READABLE (for understanding):
function isAutoModeAvailableOnProvider(provider) {
  if (provider === "firstParty" || isAnthropicManagedCloudProvider(provider)) return true;
  return true;                    // 2.1.193: parseBoolean(process.env.CLAUDE_CODE_ENABLE_AUTO_MODE)
}

// Mapping: ont(193)/Eer(220)→isAutoModeAvailableOnProvider, iW→isAnthropicManagedCloudProvider,
//          at→parseBoolean
```

Three separate facts fall out of this five-line diff:

1. **The env opt-in is gone.** For every provider that is not first-party and not Anthropic-managed
   cloud — i.e. Bedrock, Vertex, Foundry, Mantle, gateway — 2.1.193 required
   `CLAUDE_CODE_ENABLE_AUTO_MODE` to be truthy. 2.1.220 returns `true`. That is exactly the changelog
   bullet.
2. **The function is now a tautology and its first branch is dead.** Both branches return `!0`. Whoever
   made the change chose `return !0` over deleting the function, which is why the *shape* of the gate
   survives in `Cae()` (`:529701-529707`) and `Vfn` (`:529650`) — see §2. This is a deliberate
   minimum-diff edit, not an oversight: the call sites still want a named predicate so the change can be
   reverted by restoring one line.
3. **`iW` was widened.** 193 compared against the literal `"anthropicAws"`; 220 calls
   `iW` (`:100346-100348`), which is
   `e === "anthropicAws" || e === "anthropicGoogleCloud"` — the new provider channel that
   [`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md) §7.6 flags as entirely
   undocumented. So `anthropicGoogleCloud` inherits auto mode through the *first* branch, and would still
   have it if the second branch were reverted.

### The two unreachable strings

Because `Eer` can no longer return false for a provider reason, these are dead in 2.1.220:

- `:529606` — `t = "auto mode requires CLAUDE_CODE_ENABLE_AUTO_MODE=1";` (the `"provider"` arm of the
  user-facing reason formatter `ume`)
- `:529652` — `w(\`auto mode disabled: provider ${Hn()} requires the CLAUDE_CODE_ENABLE_AUTO_MODE opt-in\`, { level: "warn" })`

Reachability argument: both are inside `else if (!Eer(Hn()))` (`:529650`) / `case "provider"`
(`:529605`), and the `"provider"` reason can only be produced at `:529650` and `:529704`, both guarded by
`!Eer(...)`. `Eer` cannot return a falsy value.

The third occurrence, `:58030`, is live but inert: it is a membership entry in the settings `env`
allow-list (the alphabetised block at `:58018-58040`), which merely permits the variable to be set from
a settings file. Setting it now has no effect.

### A second, older tautology that `.220` pruned

`.196`'s bullet ("`claude agents --dangerously-skip-permissions` silently falling back to auto mode")
was recorded during scoping as NET_NEW at `:683507`. It is not. The whole guard is byte-identical:

```
220:683500-683510   ==   193:577584-577594
```

with one substitution: `!$3()` → `!KMi()`. And **both** of those are `return !0`:

| | 2.1.193 | 2.1.220 |
|---|---|---|
| symbol / line | `$3` `:58717-58719 (193)` | `KMi` `:63537-63539` |
| body | `return !0;` | `return !0;` |
| call sites | **8** (`:150159`, `:577593`, `:598761`, `:598778`, `:635710`, `:674083`, `:694903` (193)) | **1** (`:683508`) |

So the "user has accepted the auto-mode opt-in" latch was *already* vestigial in 2.1.193; 2.1.220 deleted
six of its seven call sites. That is real cleanup but **not a behaviour change**, and the surviving
message `--bg with auto mode requires opting in first.` (`:683509`, 220=1 / 193=1) is unreachable in both
builds.

**Correction to the scoping pass:** `--bg with bypassPermissions requires accepting the disclaimer` is
**220=1 (`:683507`) / 193=1 (`:577592`)** — carryover, not net-new. `.196` #10 is therefore UNANCHORED as
a permissions bullet; whatever changed is in the argv routing, not in this guard.

---

## 2. The four-gate availability resolver

**What it does:** `Vfn` (`:529614-529687`, `verifyAutoModeGateAccess`) is run per session (and on model
or provider change). It decides two independent booleans and, if they are false, *forcibly evicts* the
session from auto mode.

**How it works:**

1. `r = await P_e("tengu_auto_mode_config", {})` (`:529615`) — fetch the remote config. `h9s`
   (`:529708-529711`) coerces `r.enabled` to `"enabled" | "disabled" | "opt-in"`, defaulting to
   `R2_ = "enabled"` (`:529775`).
2. `o = m9s()` (`:529617`, defined `:529691-529694`) — the settings kill switch:
   `e.disableAutoMode === "disable" || e.permissions?.disableAutoMode === "disable"`. Both spellings, and
   both read from the *merged* settings accessor `us()`, i.e. any scope can disable.
3. `a = oqe(i) && !s` (`:529621`) — model support (`oqe`, `:150427-150443`) AND not the fast-mode
   circuit breaker.
4. `l = n !== "disabled" && !o && a` (`:529622`), then `c = l` (`:529623`).

Step 4 deserves a note, because it *looks* like part of the `.207` change and is not. 2.1.193 read:

```javascript
let l = !1;
if (r !== "disabled" && !o && a) l = r === "enabled" || NMe() || e.mode === "auto" || e.prePlanMode === "auto";
let c = r !== "disabled" && !o && a;                                  // :598667-598669 (193)
```

`NMe()` (`:598759-598762 (193)`) is `getAutoModeFlagCli() || $3()` — and `$3()` is `return !0`. So the
disjunction was already unconditionally true and `l === c` held in 2.1.193 too. **220's `c = l` is
dead-code removal, not a policy change.** Reporting it as the `.207` mechanism would be a false delta;
the mechanism is `Eer` alone.

The model gate `oqe` is worth reading because it is the *only* remaining provider-dependent restriction:

```javascript
// ============================================
// modelSupportsAutoMode - the surviving provider-sensitive availability rule
// Location: cli_inner_pretty.js:150427-150443
// ============================================

// ORIGINAL (for source lookup):
function oqe(e) {
  let t = lo(e),
    r = Hn();
  if (!Eer(r)) return !1;
  if (
    t.includes("claude-3-") || t === "claude-opus-4-0" || t === "claude-opus-4-1" ||
    t === "claude-opus-4-5" || t === "claude-sonnet-4-0" || t === "claude-sonnet-4-5" ||
    t === "claude-haiku-4-5"
  )
    return !1;
  if (r !== "firstParty" && !iW(r) && (t === "claude-opus-4-6" || t === "claude-sonnet-4-6" || t.includes("haiku")))
    return !1;
  return !0;
}

// READABLE (for understanding):
function modelSupportsAutoMode(modelId) {
  let id = normalizeModelId(modelId),
    provider = getCurrentProvider();
  if (!isAutoModeAvailableOnProvider(provider)) return false;      // now always true
  if (LEGACY_MODELS_WITHOUT_AUTO_MODE.has(id)) return false;       // inlined as a disjunction
  if (provider !== "firstParty" && !isAnthropicManagedCloudProvider(provider) &&
      (id === "claude-opus-4-6" || id === "claude-sonnet-4-6" || id.includes("haiku")))
    return false;                                                  // 3P: 4.6 and any haiku excluded
  return true;
}

// Mapping: oqe→modelSupportsAutoMode, lo→normalizeModelId, Hn→getCurrentProvider,
//          Eer→isAutoModeAvailableOnProvider, iW→isAnthropicManagedCloudProvider
```

This is the same list as 2.1.193 (`Lhe`, `:150171-…(193)`) with `iW(r)` substituted for
`r === "anthropicAws"`.

**Consequence the changelog does not state:** on Bedrock/Vertex/Foundry, `.207` gave you availability but
the *second* exclusion list still bites. Combined with the alias table
([ground truth §1](../_GROUND_TRUTH_verified_anchors.md#verified-catalogue-entries): `sonnet` resolves to
`claude-sonnet-4-5` on Bedrock/Vertex/Foundry, and to `claude-sonnet-4-6` on `anthropic_aws`/gateway),
a Bedrock user on the `sonnet` alias lands on `claude-sonnet-4-5`, which is in the **first** exclusion
list. So the practical answer to "did `.207` turn auto mode on for Bedrock?" is: **only if you pin a
model outside both lists** (e.g. `claude-opus-4-8`, `claude-opus-5`, `claude-sonnet-5`). Anyone reading
only the bullet would expect it to work on the default alias. It does not.

### Eviction: `kickOutOfAutoIfNeeded`

When `l` is false, `Vfn` returns an `updateContext` transform `m` (`:529655-529681`) rather than a
boolean. Reading it:

- `A = E.mode === "auto"`; `b = E.mode === "plan" && (E.prePlanMode === "auto" || !!E.strippedDangerousRules)`
- if neither, just stamp `isAutoModeAvailable: false` and return (`:529659`)
- if in auto: `$N(!1)`, `c8(!0)`, emit `_be({ from: "auto", to: "default", trigger: "auto_gate_denied" })`
  (`:529664`), and set mode to `default` with both flags false
- if in plan-with-auto-underneath: rewrite `prePlanMode: "auto" → "default"` (`:529676`) so exiting plan
  mode does not silently land back in auto

`strippedDangerousRules` (220=12 / 193=12 — carryover) is the reason the plan branch exists: entering
auto mode *removes* the user's dangerous allow rules and stashes them here (`:529290-529309`), so a
context carrying that stash is "logically in auto" even if `mode === "plan"`. Missing that would leave a
session with its dangerous rules stripped and no auto mode — strictly worse than either state.

**Key insight:** the resolver is written as a *context transformer plus notification*, not as a
predicate. That is what lets a mid-session model switch or provider switch pull the session out of auto
mode atomically and tell the user why (`ume`, `:529596-529613`), with the four reasons
`settings` / `circuit-breaker` / `provider` / `model` — of which `provider` is now dead.

---

## 3. `disableAutoMode`: why the carryover count is 7/7

For completeness, the seven 2.1.220 sites, so nobody re-derives them:

| line | role |
|---|---|
| `:60163` | zod shape inside a nested `permissionsShape()` — `v.enum(["disable"]).optional()` |
| `:61395` | zod field on the top-level settings schema (the un-nested spelling) |
| `:118982` | `n.permissions?.disableAutoMode !== "disable"` in the default-mode resolver |
| `:118983` | `n.disableAutoMode !== "disable"` (same guard, top-level spelling) |
| `:529646` | the `"settings"` reason log inside `Vfn` |
| `:529693` | `m9s()`, the merged-settings predicate |
| `:785812` | the bundled `/doctor` skill text |

Two spellings × (schema, default-mode guard, availability guard) + one doc string = 7 in both builds.
The `.207` bullet mentions `disableAutoMode` only because the *documentation* needed it once the opt-in
disappeared: with no env var to withhold, the settings key became the only off switch. **The bullet
documents a pre-existing key whose importance changed, not a new key.**

---

## 4. Auto mode as the *default* permission mode — and its second switch

Separate from availability is the question of what mode a fresh session starts in. `:118980-118989`:

```javascript
let g = !1;
if (!m) {
  let y = "default";
  if (
    !d &&
    n.permissions?.disableAutoMode !== "disable" &&
    n.disableAutoMode !== "disable" &&
    (Ke("tengu_harbor_willow", !1) || cWi()?.meadow_lantern === !0) &&
    (!t.isNonInteractiveSession || Ke("tengu_moss_anchor", !1))
  )
    ((y = "auto"), (g = !0));
  m = { mode: y, notification: f };
}
```

2.1.193 (`:150090-150096 (193)`) is identical except for the fourth conjunct, which was just
`it("tengu_harbor_willow", !1) &&`.

| anchor | 220 | 193 |
|---|---|---|
| `tengu_harbor_willow` | 1 (`:118984`) | 1 (`:150094`) |
| `tengu_moss_anchor` | 1 (`:118985`) | 1 (`:150095`) |
| `meadow_lantern` | **1** (`:118984`) | **0** |
| `fromAutoFallback` | 3 | 3 |

So the rollout gained a **second, independent kill/enable switch on a different delivery channel**.
`cWi()` (`:536977-536979`) is `fcp(xt(), pcp, Pht)`, and `fcp` (`:536969-536976`) reads
`appState.clientDataCacheSlots[slotKey]` — the server-delivered client-data cache, not GrowthBook.

**Why two channels?** GrowthBook (`Ke`) is evaluated client-side against a cached feature payload and,
per [ground truth §2](../_GROUND_TRUTH_verified_anchors.md), can go stale; `.214` #34 even shipped a fix
for flags going stale after OAuth rotation (`tengu_gb_eval_authed_enable`). The client-data cache is
delivered on the authenticated API path, so it is per-account and refreshes with the session. Having both
means the default-on rollout can be driven per-account (`meadow_lantern`) *or* per-segment
(`tengu_harbor_willow`), and neither can be turned off by the other. `tengu_moss_anchor` remains the
separate switch for whether non-interactive (`-p`/SDK) sessions get the auto default — deliberately
independent, because a headless session that silently gains a model-driven approver is a much larger
behaviour change than an interactive one.

`.210` #13 ("`/doctor` skipping its auto-mode-default proposal on Bedrock, Vertex, and Foundry") is the
documentation half of the same rollout. The skill text at `:785812` now says so explicitly:

> `The provider is NOT a skip reason: auto mode is provider-supported on every provider, 3P
> (Bedrock/Vertex/Foundry) included. Per-model availability (not every model supports auto mode; the CLI
> keeps a per-model list) is enforced by the CLI at startup and when switching providers or modes, not
> here`

That paragraph is a prose restatement of §1 + §2 of this document, written by the same change: `Eer`
became unconditional, so provider is no longer a reason, and `oqe` is where the remaining restriction
lives. `make auto mode the default permission mode` is 220=1 (`:785865`) / 193=0.

---

## 5. Settings-source trust: `autoMode` may no longer come from the repo

> `.207`: *"Changed auto mode to no longer read `autoMode` from `.claude/settings.local.json`
> (repo-resident); use `~/.claude/settings.json` instead."*

**Verdict: NET_NEW.** `tengu_settings_auto_mode_rules_untrusted_source_ignored` 220=1 (`:63563`) / 193=0.

### The scope list shrank

| | 2.1.193 | 2.1.220 |
|---|---|---|
| symbol / line | `Uys` `:58827 (193)` | `H3r` `:63681` |
| value | `["userSettings", "localSettings", "flagSettings", "policySettings"]` | `["userSettings", "flagSettings", "policySettings"]` |
| exported as | — | `AUTO_MODE_TRUSTED_SOURCES` (`:63105`) |

`localSettings` is `.claude/settings.local.json` (`UQ`, `:62364`). Removing it from the aggregation list
is the whole fix; everything else in the aggregator `CCe` (`:63551-63590`, 193 `qve` `:58728-58757`) is
byte-equivalent — the same four rule buckets `allow` / `soft_deny` / `hard_deny` / `environment`, the same
`safeParse`-then-concat loop, the same "return undefined when all four are empty".

### The detector that was added with it

Removing a scope silently would leave a user whose rules stopped applying with no explanation. So
`.207` also added a one-shot detector *in front of* the aggregation:

```javascript
// ============================================
// getAutoModeConfig - the untrusted-source detector prefixed to the rule aggregator
// Location: cli_inner_pretty.js:63551-63564
// ============================================

// ORIGINAL (for source lookup):
function CCe() {
  let e = Dxt();
  if (!k6l)
    for (let s of ["projectSettings", "localSettings"]) {
      if (s === "projectSettings" && ynt()) continue;
      let a = Pr(s)?.autoMode;
      if (a && e.safeParse(a).success)
        ((k6l = !0),
          w(
            `settings autoMode in ${s} ignored — only user/flag/managed settings may set classifier rules (projectSettings and localSettings are repo-controllable)`,
            { level: "warn" },
          ),
          O("tengu_settings_auto_mode_rules_untrusted_source_ignored", { source: fe(s) }));
    }
  ...
}

// READABLE (for understanding):
function getAutoModeConfig() {
  let schema = getAutoModeConfigSchema();
  if (!warnedAboutUntrustedAutoModeSource)
    for (let scope of ["projectSettings", "localSettings"]) {
      if (scope === "projectSettings" && projectSettingsPathEqualsUserSettingsPath()) continue;
      let block = getSettingsForScope(scope)?.autoMode;
      if (block && schema.safeParse(block).success) {              // only warn on a VALID block
        warnedAboutUntrustedAutoModeSource = true;                 // once per process
        logWarn(`settings autoMode in ${scope} ignored — only user/flag/managed settings may set classifier rules (projectSettings and localSettings are repo-controllable)`);
        emitTelemetry("tengu_settings_auto_mode_rules_untrusted_source_ignored", { source: redact(scope) });
      }
    }
  ...
}

// Mapping: CCe→getAutoModeConfig, Dxt→getAutoModeConfigSchema, Pr→getSettingsForScope,
//          k6l→warnedAboutUntrustedAutoModeSource, ynt→projectSettingsPathEqualsUserSettingsPath, fe→redact
```

Four design decisions in fourteen lines:

1. **It checks `projectSettings` too**, even though `projectSettings` was never in the trusted list
   (193's `Uys` did not contain it either). The warning is about *repo-controllable* files as a class, so
   it covers both.
2. **`ynt()` skip (`:63555`).** `ynt` (`:63137-63141`, called at `:63555`) is
   `!!mg("projectSettings") && !!mg("userSettings") && jQ.resolve(a) === jQ.resolve(b)` — if the project
   settings *file path resolves to the same file as* user settings, do not warn. That happens when the
   user runs Claude Code with `~/.claude` as the project directory. Without this, every session started
   in `$HOME` would print a spurious warning.
3. **`safeParse().success` guard.** A malformed `autoMode` block produces no warning, because it would
   have been dropped by the aggregator anyway. Only a *valid* block that is being deliberately ignored
   earns the message. This keeps the signal clean: the warning means "you wrote correct rules in the
   wrong file", never "you have a typo".
4. **One-shot latch `k6l`.** `CCe()` is called on every permission decision; without the latch the
   warning would spam the transcript.

### The other, older trust filter — do not conflate them

There is a **second** untrusted-source filter that is **carryover**, and it is easy to mistake for this
one:

| filter | subject | anchor | 220 | 193 |
|---|---|---|---|---|
| rules filter (NEW in `.207`) | the `autoMode` classifier-rule block | `tengu_settings_auto_mode_rules_untrusted_source_ignored` `:63563` | 1 | **0** |
| mode filter (carryover) | `permissions.defaultMode: "auto"` | `tengu_settings_auto_mode_untrusted_source_ignored` `:118959` | 1 | **1** (`:150063 (193)`) |

The mode filter's message — `settings defaultMode "auto" ignored — only policy/user/flag settings may
grant auto mode (projectSettings and localSettings are repo-controllable)` — is byte-identical in both
builds (1/1). So the trust boundary for *entering* auto mode already excluded the repo in 2.1.193; `.207`
extended the same boundary to the *rules auto mode runs by*. Stating it that way is both accurate and
more useful than "added a trust check".

---

## 6. `claude auto-mode reset`

> `.212`: *"Added `claude auto-mode reset` to restore the default auto-mode configuration, with a
> confirmation prompt (pass `--yes` to skip)."*

**Verdict: NET_NEW.** `auto-mode reset` 220=1 (`:865404`) / 193=0.

Reading the handler (`:865380-865412`; the `auto-mode reset` literal itself is in the write-failure log at `:865404`):

1. It first prints the sections it is about to remove, derived by `OOm` (`:865414-865418`), which turns
   the `autoMode` object into `"<key> (<n> entries)"` labels, and `$Om` (`:865420-865423`) which
   de-duplicates them with counts.
2. `if (!e.yes)` → `await Hvr("Reset auto mode configuration to defaults?")`; declining emits
   `uL("cli_auto_mode_reset", "declined")`.
3. The write is scope-pinned:

```javascript
let { error: c } = await Tm("userSettings", (u) =>
  u !== null && u.autoMode !== void 0 ? { autoMode: void 0 } : null,
);
```

   — a partial update to **`userSettings` only**, and a no-op (`null`) when there is nothing to remove.
4. On success it prints `Auto mode configuration reset to defaults — autoMode section removed from ${t}.` (`:865409`) plus a pointer to `claude auto-mode config`, then calls `LOm()`.
5. `LOm` (`:865434-865443`) is the honest-reporting step:

```javascript
function LOm() {
  for (let e of H3r) {
    if (e === "userSettings") continue;
    if (Pr(e)?.autoMode !== void 0) {
      Js(`Note: auto mode rules from managed or --settings flag sources still apply — reset only changes your user settings file.\n`);
      return;
    }
  }
}
```

**Why this design:** the command iterates `H3r` — the same `AUTO_MODE_TRUSTED_SOURCES` list from §5 —
which means the reset command and the rule loader can never disagree about which scopes matter. Because
managed (`policySettings`) and `--settings` (`flagSettings`) rules are administrator-owned, a user-run
reset must not touch them, and must say so rather than leaving the user believing the reset was total.
That is the same reasoning as §5's warning: when a scope's rules are deliberately not honoured (or not
removable), tell the user which scope.

**Failure mode:** a write error routes through `p2s(c, t, "reset")` (`:865400`) for a code+message pair,
reports `hu("cli_auto_mode_reset", u.code)`, and prints the mapped message — i.e. the command
distinguishes "declined", "nothing to do", "write failed with code X", and "succeeded, but other scopes
remain", four outcomes for what looks like a one-line operation.

---

## 7. The env-onboarding surface (`tengu_auto_mode_env_onboarding_*`)

**Verdict: NET_NEW, and it replaced a deleted surface.** This is the strongest single proof that `.207`
was an opt-in *removal*, because the telemetry family for the old opt-in dialog is gone.

### Gate-family diff

Enumerating `tengu_auto_mode_*` in both bundles:

| gate / event | 220 | 193 |
|---|---|---|
| `tengu_auto_mode_opt_in_dialog_shown` | **0** | 2 |
| `tengu_auto_mode_opt_in_dialog_accept` | **0** | 2 |
| `tengu_auto_mode_opt_in_dialog_accept_default` | **0** | 2 |
| `tengu_auto_mode_opt_in_dialog_decline` | **0** | 3 |
| `tengu_auto_mode_opt_in_dialog_decline_dont_ask` | **0** | 2 |
| `tengu_auto_mode_env_onboarding_shown` | 2 (`:537297`, `:736553`) | **0** |
| `tengu_auto_mode_env_onboarding_accept` | 2 (`:537294`, `:736613`) | **0** |
| `tengu_auto_mode_env_onboarding_later` | 2 (`:537296`, `:736618`) | **0** |
| `tengu_auto_mode_env_onboarding_dismiss` | 2 (`:537295`, `:736622`) | **0** |
| `tengu_auto_mode_setup_wizard_shown` | 1 (`:659921`) | **0** |
| `tengu_auto_mode_setup_wizard_answers` | 2 (`:537299`, `:660036`) | **0** |
| `tengu_auto_mode_setup_wizard_resolved` | 2 (`:537300`, `:659937`) | **0** |
| `tengu_auto_mode_repo_visibility_lookup_failed` | 1 (`:229627`) | **0** |
| `tengu_auto_mode_beta_latch` | 1 (`:444423`) | **0** |
| `tengu_auto_mode_classifier_queue` | 1 (`:442629`) | **0** |
| `tengu_auto_mode_config` | 26 | 14 |
| `tengu_auto_mode_decision` | 7 | 6 |
| `tengu_auto_mode_fallback_to_ask` | 6 | 5 |
| `tengu_auto_mode_sibling_context_error` | 1 | 1 |
| `tengu_auto_mode_state` | 1 | 1 |
| `tengu_auto_mode_subsequent_approval` | 2 | 2 |

Eleven gone/new pairs. **A five-event "should I turn auto mode on?" dialog was replaced by a four-event
"you are in auto mode; want to configure your environment?" prompt.** The verb changed from *permission
to enable* to *invitation to configure*, which is precisely what removing an opt-in looks like in
telemetry.

### The gate on showing it

```javascript
// ============================================
// shouldShowAutoModeEnvOnboarding - six-condition suppression chain
// Location: cli_inner_pretty.js:736558-736569
// ============================================

// ORIGINAL (for source lookup):
function aXa() {
  if (!mDo()) return !1;
  if ((CCe()?.environment?.length ?? 0) > 0) return !1;
  let e = xt();
  if (e.numStartups < GxS) return !1;
  if (WxS()) return !1;
  let t = e.autoModeEnvSetup;
  if (t?.dismissed) return !1;
  if (t?.dismissedAt && Date.now() - t.dismissedAt < jxS) return !1;
  return !0;
}

// READABLE (for understanding):
function shouldShowAutoModeEnvOnboarding() {
  if (!isAutoModeSetupSkillEnabled()) return false;                 // skillOverrides["auto-mode-setup"] !== "off"
  if ((getAutoModeConfig()?.environment?.length ?? 0) > 0) return false;   // already configured
  let state = getAppState();
  if (state.numStartups < MIN_STARTUPS_BEFORE_ONBOARDING) return false;    // 5
  if (alreadyOptedIntoAuto()) return false;
  let record = state.autoModeEnvSetup;
  if (record?.dismissed) return false;                              // "don't ask again"
  if (record?.dismissedAt && Date.now() - record.dismissedAt < ONBOARDING_SNOOZE_MS) return false;  // 7 days
  return true;
}

// Mapping: aXa→shouldShowAutoModeEnvOnboarding, mDo→isAutoModeSetupSkillEnabled, CCe→getAutoModeConfig,
//          xt→getAppState, GxS→MIN_STARTUPS_BEFORE_ONBOARDING, jxS→ONBOARDING_SNOOZE_MS, WxS→alreadyOptedIntoAuto
```

Constants (`:736679-736681`): `jxS = 604800000` (7 days), `GxS = 5` (startups), `F4f = 500` (ms).

`mDo` (`:444855-444857`) is `fDo() && eo().skillOverrides?.["auto-mode-setup"] !== "off"` — the whole
onboarding is routed through the bundled **`auto-mode-setup` skill**, so an administrator can disable it
with a skill override rather than a dedicated setting. `sPy = new Set(["auto-mode-setup"])` (`:326372`)
is the corresponding carve-out set.

The render gate is separate (`B4f`, `:736579-736590`) and adds:
`bnn() === !0 && e.toolPermissionContext.mode === "auto" && !e.showAutoModeEnvOnboarding &&
!e.viewingAgentTaskId && !PI() && !ba() && !Z.CLAUDE_BRIDGE_REATTACH_SESSION && aXa()`.

**Note the second conjunct: the prompt only appears when the session is *already in auto mode*.** It is
not an enablement prompt at all. Combined with the `environment?.length === 0` check, its actual message
is "you are running under a model-driven approver with no environment description; describe your
environment so its judgements are better".

**Why `numStartups >= 5`?** A first-run user has too many onboarding surfaces competing; deferring to the
fifth start means the prompt lands on someone who has decided to keep using the tool. **Why a 7-day
snooze rather than a count?** "Later" is a scheduling answer, not a preference — a time-based snooze
re-asks once the user's situation has plausibly changed, while `dismissed` (a boolean, set by the third
button) is permanent. Three buttons for three genuinely different intents, and `F4f = 500` ms of
input debounce (`:736593-736620`) so a held Enter key cannot skip through the choice.

`hr(VxS)` / `hr(zxS)` / `hr(KxS)` (`:736555-736563`) are the three app-state reducers:
clear the record on accept, stamp `dismissedAt` on later, set `dismissed: true` on dismiss.

---

## 8. The 3-question setup wizard

`tengu_auto_mode_setup_wizard_*` is 220-only. The wizard steps are
`qIb = ["posture", "scope", "depth"]` (`:660223`) and it emits:

- `tengu_auto_mode_setup_wizard_shown` with `has_existing` (`:659921`) — one-shot via
  `e.shownLogged` (`:659920`)
- `tengu_auto_mode_setup_wizard_answers` with `{posture, scope, depth}` on the final answer (`:660036`)
- `tengu_auto_mode_setup_wizard_resolved` with `{choice, step}` on cancel (`:659937`) or
  `{choice: "saved", mode}` on completion (`:659944`)

The state machine is guarded by `p()` (`:659924-659928`): every advance requires
`now - lastAcceptAt >= GIb` where `GIb = 250` (`:660172`) — a 250 ms floor between accepted keystrokes,
and `f(step)` additionally requires `e.step === step && e.resolution === "none"` so a late keypress for
step *N* cannot mutate step *N+1*. `_()` (`:659941`) and `g()` (`:659935`) both check `e.resolution !== "none"` first, so the
wizard resolves exactly once even under concurrent input, and `E()` falls back to `g("error")` when there
is nothing saved (`:659947-659953`).

The wizard's product feeds `Fhr(answers).allProjects` (`:660040`), stored as
`e.gathersFromGitHubOrg` — i.e. the "scope" answer determines whether the generated rules are written for
this project or for every project in the GitHub org.

**Why a wizard rather than a settings file?** The `autoMode` block has four arrays
(`allow`/`soft_deny`/`hard_deny`/`environment`, §5) whose semantics are only meaningful to someone who has
read the classifier rule corpus. Three multiple-choice questions that *generate* the block is the only
approach that scales to non-expert users, and it explains why `.207` also had to lock the block's source
scopes (§5): a wizard that writes rules must write them somewhere the repo cannot forge.

---

## 9. Repo-visibility lookup — entirely undocumented

`tengu_auto_mode_repo_visibility_lookup_failed` (`:229627`) and
`CLAUDE_CODE_AUTO_MODE_REPO_VISIBILITY` are **220=4 / 193=0** and appear in **no changelog bullet**.

- `Ipo()` (`:229601-229605`) resolves the feature: env var first, else
  `Ke("tengu_auto_mode_config", {})?.repoVisibility === !0`.
- `Lpo(host, owner, name)` (`:229618-229625`) memoises per `host/owner/name` in `bDu` and delegates to
  `Tey`.
- `Tey` (`:229628-…`) does an authenticated `GET {apiBase}/repos/{owner}/{name}` with
  `X-GitHub-Api-Version`, `maxRedirects: 0`, and a `_Du` timeout, and reports failures through
  `B7r(reason)` (`:229626-229628`) with two reasons visible at the top: `non_github_host` and
  `essential_traffic_only` (the latter when `ca()` — the "essential traffic only" privacy mode — is on).
- `hus(e)` (`:229609-229612`) is the fallback: when visibility is `"unknown"`, it guesses `"private"` if
  a local heuristic `cus(\`https://${host}/${slug}\`)` says so.

**Reading the design:** every failure path yields `"unknown"`, and `hus` biases `"unknown"` toward
`"private"`. So the feature fails *toward the more restrictive* classification — a public repo
misdetected as private makes the classifier more conservative, which is the safe direction. The
`essential_traffic_only` reason shows the privacy-mode interaction was handled deliberately rather than
by letting the request fail with a network error.

This is a genuine "the changelog under-reports the change" find, in the same class as the model-catalogue
rewrite. It is gated off by default (`repoVisibility === !0` required), which is presumably why it was
not announced.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_permissions.md](../00_overview/symbol_additions_v2_1_220_permissions.md).

Key functions in this document:
- `isAutoModeAvailableOnProvider` (`Eer`, `:150416`) - the `.207` one-line delta; now a tautology
- `isAnthropicManagedCloudProvider` (`iW`, `:100346`) - `anthropicAws || anthropicGoogleCloud`
- `isThirdPartyProviderWithAutoMode` (`gro`, `:150420`) - `!firstParty && !iW && Eer`
- `modelSupportsAutoMode` (`oqe`, `:150427`) - the surviving provider-sensitive exclusion lists
- `verifyAutoModeGateAccess` (`Vfn`, `:529614`) - four-gate resolver + eviction transform
- `formatAutoModeUnavailableReason` (`ume`, `:529596`) - four reasons; `provider` is dead
- `isAutoModeDisabledBySettings` (`m9s`, `:529691`) - the `disableAutoMode` predicate
- `getAutoModeUnavailableReason` (`Cae`, `:529701`) - synchronous reason probe
- `coerceAutoModeEnabledState` (`h9s`, `:529708`) - `enabled|disabled|opt-in`, default `enabled`
- `isAutoModeOptInAccepted` (`KMi`, `:63537`) - vestigial `return !0`, 1 call site (was 8 in 193 as `$3`)
- `getAutoModeConfig` (`CCe`, `:63551`) - rule aggregator + untrusted-source detector
- `AUTO_MODE_TRUSTED_SOURCES` (`H3r`, `:63681`) - `userSettings|flagSettings|policySettings`
- `projectSettingsPathEqualsUserSettingsPath` (`ynt`, `:63137`) - the false-positive skip
- `isClassifyAllShellEnabled` (`XMi`, `:63591`) - reads `autoMode.classifyAllShell` over trusted scopes
- `shouldShowAutoModeEnvOnboarding` (`aXa`, `:736564`) - six-condition suppression chain
- `shouldRenderAutoModeEnvOnboarding` (`B4f`, `:736579`) - render gate; requires `mode === "auto"`
- `markAutoModeEnvOnboardingShown` (`qxS`, `:736552`) - one-shot `_shown` emit
- `isAutoModeSetupSkillEnabled` (`mDo`, `:444855`) - routes onboarding through the `auto-mode-setup` skill
- `ONBOARDING_SNOOZE_MS` (`jxS`, `:736679`) - `604800000` (7 days)
- `MIN_STARTUPS_BEFORE_ONBOARDING` (`GxS`, `:736680`) - `5`
- `AUTO_MODE_WIZARD_STEPS` (`qIb`, `:660223`) - `["posture","scope","depth"]`
- `isRepoVisibilityLookupEnabled` (`Ipo`, `:229601`) - undocumented GitHub visibility probe
- `reportRepoVisibilityLookupFailure` (`B7r`, `:229626`) - `tengu_auto_mode_repo_visibility_lookup_failed`
- `getClientDataCacheSlot` (`fcp`, `:536969`) / `cWi` (`:536977`) - the `meadow_lantern` delivery channel
