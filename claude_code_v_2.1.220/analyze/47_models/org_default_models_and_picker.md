# Org default models, the `/model` picker, entitlement step-down, and model-switch announcements

> **Type/version:** `.196` bullet 1 (org default models) is **NET_NEW**. `.206` bullets 13 and 14 and
> `.219` bullets 9, 10 and 20 are picker fixes with narrower true deltas than the bullets suggest.
> `.199` bullet 13, `.209`'s single bullet, `.212` bullet 45 and `.218` bullet 31 are adjacent
> command-surface fixes.
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
> (`VERSION 2.1.220`, build `4073f595`). Every `cli_inner_pretty.js:<line>` is a **220** line
> unless tagged **(193)**.

---

## TL;DR

`.196` added a **fourth precedence level** to model resolution. Before this window there were three
sources — an enforced allow-list, an entitlement step-down, and the plan tier. `.196` put an
**org-administered default** on top of all of them, delivered as server data
(`orgModelDefaultCache`), carrying its own `override_user_selection` flag, and surfaced in `/model` as
either `· Org default` or `· Set by your organization`.

Delta proof:

| Literal | 220 | 193 |
|---|---|---|
| `orgModelDefaultCache` | **5** | 0 |
| `override_user_selection` | **5** | 0 |
| `data_source` | **2** | 0 |
| `Org default` | **2** | 0 |
| `Role default` | **0** | **0** ← the changelog names a label that does not exist |
| `modelAccessCache` | 5 | 4 |
| `additionalModelOptionsCache` | 5 | 4 |
| `promoListPrice` | **20** | 0 |
| `tengu_agent_view_leader_command_notice` | **1** | 0 |
| `tengu_slash_command_unavailable` / `unavailable_in_agent_view` | **2 / 1** | 0 / 0 |
| `tengu_set_model_unrecognized` | **1** | 0 |
| `tengu_remote_model_picker` | **2** | 0 |
| `tengu_config_model_changed` | 1 | 1 (carryover) |
| `positionAfter` | 0 | 0 (the scoping probe was a dead end) |

**The `Role default` finding:** `.196`'s bullet says the resolved model *"shows as 'Org default' or
'Role default' in `/model`"*. `Role default` is **220=0 / 193=0** — the literal is nowhere in the
bundle. The two strings that do exist are `" · Org default"` (`:120004`, and inline at `:111167`) and
`" · Set by your organization"` (`:111167`, `:120000`). So the second label either never shipped or
ships under a different wording. Record the bullet as **partially implemented**.

---

## 1. The four-level attribution ladder: `iQt()`

**What it does:** resolves *which model this session should use* and, crucially, *why* — returning a
tagged pair `{setting, attribution}` where `attribution ∈ "org" | "enforced" | "entitlement" | "tier"`.
Every user-facing "why is my model this?" string derives from that tag.

```javascript
// ============================================
// resolveModelWithAttribution - the 4-level precedence ladder
// Location: cli_inner_pretty.js:110736-110751
// ============================================

// ORIGINAL (for source lookup):
function iQt() {
  let e = wSi(),
    t;
  if (e === void 0) {
    if (((t = U6e()), t !== null)) l0t(t);
  } else if (e === null) t = null;
  else t = lRc(e);
  if (t !== null) return { setting: t, attribution: "org" };
  let { setting: r, envFamily: n, concreteBaseline: o } = cRc(),
    i = E7n(r, n, o),
    s = i ?? r,
    a = S7n(s);
  if (i !== null) return { setting: a ?? i, attribution: "enforced" };
  if (a !== null) return { setting: a, attribution: "entitlement" };
  return { setting: s, attribution: "tier" };
}

// READABLE (for understanding):
function resolveModelWithAttribution() {
  const memoised = getResolvedOrgDefault();          // process-global, set once per run
  let orgDefault;
  if (memoised === undefined) {                      // never resolved yet -> resolve and cache
    orgDefault = resolveOrgDefaultModel();
    if (orgDefault !== null) setResolvedOrgDefault(orgDefault);
  } else if (memoised === null) {
    orgDefault = null;                               // explicitly "no org default"
  } else {
    orgDefault = validateOrgDefaultName(memoised);   // re-validate the cached name each call
  }
  if (orgDefault !== null) return { setting: orgDefault, attribution: "org" };          // LEVEL 1

  const { setting: tierBaseline, envFamily, concreteBaseline } = resolveTierBaseline();
  const enforced   = resolveEnforcedAvailableModel(tierBaseline, envFamily, concreteBaseline);
  const candidate  = enforced ?? tierBaseline;
  const stepDown   = resolveEntitlementStepDown(candidate);

  if (enforced !== null) return { setting: stepDown ?? enforced, attribution: "enforced" };   // LEVEL 2
  if (stepDown !== null) return { setting: stepDown, attribution: "entitlement" };            // LEVEL 3
  return { setting: candidate, attribution: "tier" };                                        // LEVEL 4
}

// Mapping: iQt→resolveModelWithAttribution, wSi→getResolvedOrgDefault, l0t→setResolvedOrgDefault,
//          U6e→resolveOrgDefaultModel, lRc→validateOrgDefaultName, cRc→resolveTierBaseline,
//          E7n→resolveEnforcedAvailableModel, S7n→resolveEntitlementStepDown
```

**How it works, level by level:**

1. **Org default (new in `.196`).** `wSi()`/`l0t()` (`:3054-3059`) are a getter/setter pair over a
   process-global slot `Ot.resolvedOrgDefault`, with a **three-state** memo: `undefined` = not yet
   resolved, `null` = resolved to "no org default", a string = the org's model name. `U6e()`
   (`:110723-110727`) resolves it fresh; `lRc()` (`:110728-110732`) revalidates a cached name on every
   call.
2. **Tier baseline** (`cRc()`, `:110770-110783`) computes the *starting* model from the provider and
   plan: Opus for subscription/first-party-capable configurations, Sonnet otherwise, with an explicit
   Mantle branch (`:110775`) and a Bedrock/Vertex branch (`:110776-110781`) that prefers Sonnet when
   only Sonnet is entitled and no allow-list is being enforced.
3. **Enforced allow-list** (`E7n()`, `:110784-110936`) applies `availableModels` + `enforceAvailableModels`
   + `modelOverrides` from managed settings.
4. **Entitlement step-down** (`S7n()`, `:110752-110769`) walks Opus → Sonnet → Haiku from the family
   of the requested model onward, returning the first permitted one.

```javascript
// ============================================
// resolveEntitlementStepDown - walk down the family ladder to something permitted
// Location: cli_inner_pretty.js:110752-110769
// ============================================

// ORIGINAL (for source lookup):
function S7n(e) {
  let t = dW();
  if (t.size === 0 || !K8(e, t)) return null;
  let r = [
      { family: "opus", model: EE() },
      { family: "sonnet", model: CT() },
      { family: "haiku", model: B6e() },
    ],
    n = lo(vi(e)),
    o = r.findIndex((s) => n.includes(s.family)),
    i = o !== -1 ? o : xT(vi(e)) ? 0 : 1;
  for (let { family: s, model: a } of r.slice(i)) {
    if (Pl(a)) return a;
    let l = f5r(s);
    if (l !== null) return l;
  }
  return null;
}

// READABLE (for understanding):
function resolveEntitlementStepDown(requested) {
  const unentitled = unentitledModelIds();                     // from modelAccessCache
  if (unentitled.size === 0 || !isInSet(requested, unentitled)) return null;   // nothing to do
  const ladder = [
    { family: "opus",   model: getDefaultOpusModel() },
    { family: "sonnet", model: getDefaultSonnetModel() },
    { family: "haiku",  model: getDefaultHaikuModel() },
  ];
  const id = normaliseToCatalogueId(resolveModelAliasOrId(requested));
  const found = ladder.findIndex((row) => id.includes(row.family));
  const startAt = found !== -1 ? found : (isFableModel(resolveModelAliasOrId(requested)) ? 0 : 1);
  for (const { family, model } of ladder.slice(startAt)) {
    if (isModelAllowed(model)) return model;                   // the family default is permitted
    const newest = newestPermittedInFamily(family);            // else the newest permitted sibling
    if (newest !== null) return newest;
  }
  return null;
}

// Mapping: S7n→resolveEntitlementStepDown, dW→unentitledModelIds, K8→isInSet,
//          EE→getDefaultOpusModel, CT→getDefaultSonnetModel, B6e→getDefaultHaikuModel,
//          lo→normaliseToCatalogueId, vi→resolveModelAliasOrId, xT→isFableModel,
//          Pl→isModelAllowed, f5r→newestPermittedInFamily
```

**Why the `startAt` fallback is `0` for Fable and `1` otherwise.** If the requested id names none of
the three families, it is either Fable/Mythos (which sit *above* Opus in capability — hence index 0,
try Opus first) or something unrecognised (start at Sonnet, index 1, the safe middle). Starting an
unknown model at Opus would silently upgrade a user into the most expensive family; starting it at
Haiku would silently downgrade below the plan's normal default. Index 1 is the only choice that
neither over- nor under-serves.

**`f5r()` (`:110162-110169`) walks `Ul`'s keys in reverse** — i.e. newest-first, since `Ul` is built
from `OZh` in launch order — and requires four conditions of a candidate:
`$ji(id, family)` (whole-word family match, `:110170-110178`), `Pl(id)` (allow-listed),
`!QJt(id)` and `!QIc(id)`. The whole-word matcher is not incidental: a naive
`id.includes("opus")` would match `opusplan`, and `includes("sonnet")` would match nothing useful in a
`us.anthropic.…` Bedrock id. `$ji` checks that the character before and after the match is not
alphanumeric.

### Why an attribution *tag* rather than just a model id

**What it does:** the ladder returns not only the answer but the reason, and the reason drives four
different user-facing behaviours.

**Why this approach:**
- **`Z$()` (`:110733-110735`) is `iQt().setting`** — the plain answer, used by ~30 call sites that do
  not care why.
- **`A7n()` (`:111164-111176`) is the `/model` "Default (recommended)" row description**, and it
  branches on the tag:
  ```javascript
  // ORIGINAL (:111164-111176):
  function A7n(e = !1) {
    let { setting: t, attribution: r } = iQt();
    if (r !== "tier")
      return `${mb(Wu(t)) ?? nm(t)}${r === "org" ? " \xB7 Org default" : " \xB7 Set by your organization"}`;
    …
  }
  ```
  So `"org"` → `· Org default` (a *choice* an admin made) and `"enforced"`/`"entitlement"` →
  `· Set by your organization` (a *restriction*). Collapsing these into one string would tell an
  entitlement-limited user that their org "chose" a model it merely permits.
- **`Yji()` (`:111077-111081`)** is a cheap boolean re-derivation ("is anything org-imposed?") used by
  `Aug()` (`:119999-120001`) to decide the suffix without needing the tag.
- **Only the `"tier"` branch shows pricing and marketing copy** (`:111168-111175`,
  *"Best for everyday, complex tasks"* / *"Efficient for routine tasks"*). If the model is imposed,
  there is nothing to choose between and a price is noise.

**Key insight:** the tag is what lets one resolution function serve both "what model do I use?" and
"what do I tell the user?" without a second, drift-prone code path.

---

## 2. Where `orgModelDefaultCache` comes from and how it is validated

The data arrives on the bootstrap/client-data response as `org_model_default` and is persisted with a
subtle merge (`:450437-450441`):

```javascript
// ORIGINAL (:450437-450441):
E = n.org_model_default
  ? { ...n.org_model_default, ...(_?.organizationUuid && { orgUuid: _.organizationUuid }) }
  : u
    ? (i.orgModelDefaultCache ?? null)
    : null,
```

The client **stamps the resolved OAuth organisation UUID into the payload** as `orgUuid`. That stamp
is what makes the reader safe:

```javascript
// ============================================
// getOrgModelDefault - shape validation, org binding, control-char stripping
// Location: cli_inner_pretty.js:154491-154507
// ============================================

// ORIGINAL (for source lookup):
function Nji() {
  let e = xt(),
    t = e.orgModelDefaultCache;
  if (
    t == null ||
    typeof t !== "object" ||
    typeof t.name !== "string" ||
    typeof t.updated_at !== "string" ||
    typeof t.data_source !== "string" ||
    typeof t.override_user_selection !== "boolean"
  )
    return null;
  let r = e.oauthAccount?.organizationUuid;
  if (t.orgUuid != null && r != null && t.orgUuid !== r) return null;
  let n = t.name.replace(/[\x00-\x1f\x7f-\x9f]/g, "");
  return n === t.name ? t : { ...t, name: n };
}

// READABLE (for understanding):
function getOrgModelDefault() {
  const config = readConfig();
  const cached = config.orgModelDefaultCache;
  if (cached == null || typeof cached !== "object"
      || typeof cached.name !== "string"
      || typeof cached.updated_at !== "string"
      || typeof cached.data_source !== "string"
      || typeof cached.override_user_selection !== "boolean")
    return null;                                                 // 1. full shape check
  const currentOrg = config.oauthAccount?.organizationUuid;
  if (cached.orgUuid != null && currentOrg != null && cached.orgUuid !== currentOrg)
    return null;                                                 // 2. org binding
  const sanitised = cached.name.replace(/[\x00-\x1f\x7f-\x9f]/g, "");   // 3. strip C0 + C1 controls
  return sanitised === cached.name ? cached : { ...cached, name: sanitised };
}

// Mapping: Nji→getOrgModelDefault, xt→readConfig
```

**Three defences, each earning its place:**

1. **Every one of the four fields is type-checked, including `override_user_selection: boolean`.** The
   value comes from a network response cached to disk in the user's config file, so it is
   attacker-adjacent twice over (a compromised response, or a hand-edited config).
2. **Org binding.** `orgUuid != null && currentOrg != null && orgUuid !== currentOrg → null`. This is
   the fix for a real hazard: one machine, two Anthropic organisations. A cached org default from org A
   must not silently apply after logging into org B. Note both `!= null` guards — if either side is
   unknown the check is skipped rather than failing closed, so an older cache without `orgUuid` keeps
   working.
3. **Control-character stripping** of `/[\x00-\x1f\x7f-\x9f]/g` — C0 **and** C1 ranges, i.e. exactly
   the bytes that could inject ANSI escape sequences into a terminal when the name is printed in the
   `/model` picker. The `n === t.name ? t : {...t, name: n}` pattern avoids allocating a new object in
   the common clean case.

`Jkt()` (`:110158-110161`) gates the whole thing on `Hn() === "firstParty"`: an org default is
meaningless on Bedrock/Vertex, where the org controls model access through cloud IAM instead.

Then `lRc()` (`:110728-110732`) runs the *name* through two more transforms before trusting it:

```javascript
// ORIGINAL (:110728-110732):
function lRc(e) {
  let t = E7n(e, null) ?? e,
    r = S7n(t) ?? t;
  return $6e(r, { ignoreModelOverrides: !0 }) === null ? r : null;
}
```

i.e. the org default is **still subject to the enforced allow-list and the entitlement ladder**, and
is finally dropped entirely if `$6e()` (`:110581-110593`) reports it as server-unavailable. So "org
default" wins the *attribution*, not the *permission* — an admin cannot name a model the account is
not entitled to and have it stick. That ordering (attribution above, permission below) is the
non-obvious part.

`$6e()` itself is the server-availability oracle and returns a structured reason:

```javascript
// ORIGINAL (:110586-110591):
o = n(e),
i = n(r),
s = $1e().find((l) => l.disabled === !0 && typeof l.value === "string" && (n(l.value) === o || n(l.value) === i));
if (s) return { reason: "disabled", description: s.description };
let a = t?.ignoreModelOverrides ? YO(r) : lo(r);
if (!Qkt() && a === "claude-fable-5") return { reason: "absent", displayName: Poe(r) ?? "That model" };
if (!_7n() && rQt(a)) return { reason: "absent", displayName: Poe(r) ?? "That model" };
```

`"disabled"` carries the server's own `description` (so the server writes the explanation);
`"absent"` is synthesised locally for Fable/Mythos when the family is not unlocked. It returns `null`
for "fine", which is why callers test `=== null`.

---

## 3. The server-data trio and its shape filters

Three parallel caches feed the picker, and all three are read through a **defensive row filter** — a
pattern worth naming because it appears three times in seventeen lines (`:154474-154492`):

```javascript
// ORIGINAL (:154474-154492):
function $1e() {
  let e = xt().additionalModelOptionsCache;
  return (Array.isArray(e) ? e : []).filter(
    (t) =>
      t != null &&
      typeof t === "object" &&
      (typeof t.value === "string" || t.value === null) &&
      typeof t.label === "string" &&
      typeof t.description === "string",
  );
}
function ZJt() {
  let e = xt().modelAccessCache;
  return (Array.isArray(e) ? e : []).filter(
    (t) => t != null && typeof t === "object" && typeof t.apiName === "string" && typeof t.entitled === "boolean",
  );
}
```

| Accessor | Cache key | Row shape | 220 / 193 |
|---|---|---|---|
| `$1e` `:154474` | `additionalModelOptionsCache` | `{value: string\|null, label, description, disabled?}` | 5 / 4 |
| `ZJt` `:154486` | `modelAccessCache` | `{apiName: string, entitled: boolean}` | 5 / 4 |
| `Nji` `:154491` | `orgModelDefaultCache` | `{name, updated_at, data_source, override_user_selection, orgUuid?}` | **5 / 0** |

`Array.isArray(e) ? e : []` then a per-row `filter` means a malformed cache degrades to *fewer rows*,
never to a crash and never to a half-typed row reaching the renderer. `$1e`'s `value` is deliberately
`string | null` because `null` is the "Default" row's sentinel throughout the picker.

`dW()` (`:110150-110154`) turns `modelAccessCache` into the unentitled set, and gates on provider:

```javascript
// ORIGINAL (:110150-110154):
function dW() {
  let e = Hn();
  if (e !== "firstParty" && e !== "gateway") return new Set();
  return jig(ZJt());
}
```

An empty set means "no entitlement restrictions", which is why `K8()` (`:110144-110149`) short-circuits
on `t.size === 0`. On Bedrock/Vertex/Foundry the set is *always* empty — entitlement is a first-party
and gateway concept only.

---

## 4. `.206` bullet 14: rows misplaced when entitlement drops their anchor

The bullet: *"Fixed server-provided model rows being placed in the wrong position when an entitlement
restriction drops the row they were anchored to."* The scoping pass filed this **UNANCHORED**
(`positionAfter` 0/0, `insertAfter` 6/4, `entitlement` 23/12). **It is anchorable.** The mechanism is
`$Qt()`, and the before/after is decisive.

```javascript
// ============================================
// insertModelRowAfterAnchorFamilies - anchor-aware insertion for Fable rows
// Location: cli_inner_pretty.js:120665-120701   (was yat, :236104-236123 (193))
// ============================================

// ORIGINAL (2.1.193, for source lookup) — :236104-236123 (193):
function yat(e, t) {
  if (!(typeof t.value === "string" && nPn(t.value))) { e.push(t); return; }
  let n = e.findIndex((s) => s.value === null);
  if (n === -1) { e.splice(0, 0, t); return; }
  let r = ieo(oy()),
    o = n + 1;
  while (o < e.length) {
    let s = e[o]?.value;
    if (typeof s !== "string") break;
    if ((r !== null && ieo(s) === r) || nPn(s)) o++;
    else break;
  }
  e.splice(o, 0, t);
}

// ORIGINAL (2.1.220, for source lookup) — :120665-120701:
function $Qt(e, t) {
  if (!(typeof t.value === "string" && NQt(t.value))) { e.push(t); return; }
  let r = e.findIndex((m) => m.value === null);
  if (r === -1) { e.splice(0, 0, t); return; }
  let n = wJn(KA()),
    o = e[r + 1]?.value,
    i = e[r + 1],
    s = typeof o === "string" && i !== void 0 ? e2c(e, i) : null,
    a = (m) => s !== null && lo(Qs(m)) === lo(Qs(s)) && (Qs(m) !== m) === (Qs(s) !== s) && Pl(m),
    l = mj() ?? SK() ?? null,
    c =
      (typeof l === "string" && a(l)) ||
      (us()?.availableModels ?? []).some((m) => a(m.trim())) ||
      u5r().some((m) => typeof m.value === "string" && a(m.value)) ||
      $1e().some((m) => typeof m.value === "string" && a(m.value)),
    u = typeof o === "string" && (ZBc() || Pl(o) || (s !== null && !c)),
    d = typeof o === "string" && lj(Qs(o)) ? wJn(o) : null,
    p = new Set();
  if (d !== null) {
    if ((p.add(d), !u && n !== null)) p.add(n);
  } else if (n !== null) p.add(n);
  let f = r + 1;
  while (f < e.length) {
    let m = e[f]?.value;
    if (typeof m !== "string") break;
    let g = wJn(m);
    if ((g !== null && p.has(g)) || NQt(m)) f++;
    else break;
  }
  e.splice(f, 0, t);
}

// READABLE (for understanding, 220):
function insertModelRowAfterAnchorFamilies(rows, newRow) {
  if (!(typeof newRow.value === "string" && isFableRowValue(newRow.value))) { rows.push(newRow); return; }
  const defaultIdx = rows.findIndex((r) => r.value === null);
  if (defaultIdx === -1) { rows.splice(0, 0, newRow); return; }

  const sessionFamily = familyOf(getSessionResolvedModel());          // e.g. "opus"
  const anchorValue   = rows[defaultIdx + 1]?.value;                  // the row right after "Default"
  const anchorRow     = rows[defaultIdx + 1];
  const steppedAnchor = typeof anchorValue === "string" && anchorRow !== undefined
                      ? entitlementStepDownForRow(rows, anchorRow) : null;

  // does some *other* configured model already occupy the stepped-down anchor slot?
  const occupiesSteppedAnchor = (candidate) =>
    steppedAnchor !== null
    && normaliseToCatalogueId(strip1m(candidate)) === normaliseToCatalogueId(strip1m(steppedAnchor))
    && (strip1m(candidate) !== candidate) === (strip1m(steppedAnchor) !== steppedAnchor)
    && isModelAllowed(candidate);

  const pinned = getPinnedModel() ?? getStartupModel() ?? null;
  const anchorStillRepresented =
       (typeof pinned === "string" && occupiesSteppedAnchor(pinned))
    || (managedSettings()?.availableModels ?? []).some((m) => occupiesSteppedAnchor(m.trim()))
    || gatewayDiscoveredModels().some((m) => typeof m.value === "string" && occupiesSteppedAnchor(m.value))
    || serverModelOptions().some((m) => typeof m.value === "string" && occupiesSteppedAnchor(m.value));

  const anchorIsIntact = typeof anchorValue === "string"
    && (noRestrictionsAtAll() || isModelAllowed(anchorValue)
        || (steppedAnchor !== null && !anchorStillRepresented));

  const anchorFamily = typeof anchorValue === "string" && isBareFamilyAlias(strip1m(anchorValue))
                     ? familyOf(anchorValue) : null;

  const familiesToSkip = new Set();
  if (anchorFamily !== null) {
    familiesToSkip.add(anchorFamily);
    if (!anchorIsIntact && sessionFamily !== null) familiesToSkip.add(sessionFamily);  // <-- THE FIX
  } else if (sessionFamily !== null) familiesToSkip.add(sessionFamily);

  let i = defaultIdx + 1;
  while (i < rows.length) {
    const v = rows[i]?.value;
    if (typeof v !== "string") break;
    const fam = familyOf(v);
    if ((fam !== null && familiesToSkip.has(fam)) || isFableRowValue(v)) i++;
    else break;
  }
  rows.splice(i, 0, newRow);
}

// Mapping: $Qt→insertModelRowAfterAnchorFamilies, yat (193)→same, NQt/nPn→isFableRowValue,
//          wJn/ieo→familyOf, KA/oy→getSessionResolvedModel, e2c→entitlementStepDownForRow,
//          Pl→isModelAllowed, mj→getPinnedModel, SK→getStartupModel, us→managedSettings,
//          u5r→gatewayDiscoveredModels, $1e→serverModelOptions, ZBc→noRestrictionsAtAll,
//          lj→isBareFamilyAlias, Qs→strip1m, lo→normaliseToCatalogueId
```

**How the bug arose.**
193's `yat` skipped exactly one family: the *session model's* (`r = ieo(oy())`). It assumed the rows
after "Default" were the session family's rows, so a Fable row inserted after them landed correctly.
When an entitlement restriction **dropped the anchor row**, the row immediately after "Default"
belonged to a *different* family, the skip loop stopped at the first row, and the Fable row was
inserted at position 1 — above rows it should have followed.

**How 220 fixes it.** It computes the anchor family from the *actual* row after "Default" (`d`), and
adds the session family to the skip set **only when the anchor is not intact** (`!u`). `u`
(`anchorIsIntact`) is true when there are no restrictions at all, or the anchor value is still
allowed, or the anchor stepped down to something no other configured source already occupies. In other
words: *if the anchor survived, trust it alone; if it was dropped, also skip the session family so the
insertion lands where the anchor used to be.*

**Why `anchorStillRepresented` is checked across four sources.** `pinned`/`startup` model, managed
`availableModels`, gateway-discovered models (`u5r()`, `:109868-109873`), and server-provided rows
(`$1e()`). If any of them already contributes a row occupying the stepped-down anchor slot, then the
anchor's *position* is still meaningfully held and the extra skip would push the Fable row too far
down. The `(Qs(m) !== m) === (Qs(s) !== s)` term compares **`[1m]`-ness**: a `[1m]` variant is a
different slot from its base row and must not be treated as the same anchor.

**Why the entire function only applies to Fable rows.** Both versions bail to `rows.push(newRow)`
unless `NQt(value)` — `"fable"`, `"fable[1m]"`, or a Fable-5 provider id (`:120649-120655`, with the
regex at `:120654` accepting dated, versioned and `[1m]`/`[2m]`-suffixed forms). Fable is the only
family whose row position is *contextual* — it belongs adjacent to whatever the top family is — so it
is the only one that needs anchor logic. Everything else appends.

---

## 5. Entitlement step-down as a rendering pass: `dit()` and `e2c()`

```javascript
// ============================================
// applyEntitlementStepDownToRows - drop, step down, and dedupe picker rows
// Location: cli_inner_pretty.js:120590-120603
// ============================================

// ORIGINAL (for source lookup):
function dit(e) {
  if (ZBc()) return e;
  let t = dW(),
    r = new Set();
  return e.flatMap((n) => {
    if (n.value === null || Pl(n.value)) return [n];
    let o = n.value,
      i = e2c(e, n, () => Uug(o, t));
    if (i === null || r.has(i)) return [];
    let s = TJn(i);
    if (s === null) return [];
    return (r.add(i), [s]);
  });
}

// READABLE (for understanding):
function applyEntitlementStepDownToRows(rows) {
  if (noRestrictionsAtAll()) return rows;                    // fast path: nothing to filter
  const unentitled = unentitledModelIds();
  const seen = new Set();
  return rows.flatMap((row) => {
    if (row.value === null || isModelAllowed(row.value)) return [row];      // keep as-is
    const steppedTo = entitlementStepDownForRow(rows, row, () => reportDrop(row.value, unentitled));
    if (steppedTo === null || seen.has(steppedTo)) return [];               // drop, or dedupe
    const rebuilt = buildRowForModel(steppedTo);
    if (rebuilt === null) return [];
    seen.add(steppedTo);
    return [rebuilt];
  });
}

// Mapping: dit→applyEntitlementStepDownToRows, ZBc→noRestrictionsAtAll, dW→unentitledModelIds,
//          Pl→isModelAllowed, e2c→entitlementStepDownForRow, TJn→buildRowForModel, Uug→reportDrop
```

**Design points:**
- **`flatMap` gives one pass three outcomes**: keep (`[row]`), drop (`[]`), replace (`[rebuilt]`).
  A `filter` + `map` would need two passes and could not express "drop" and "replace" together.
- **The row is *rebuilt*, not patched.** `TJn(steppedTo)` regenerates label, description and pricing
  from the model that will actually be used. Patching only `value` is precisely the bug `.206`
  bullet 13 describes — *"the `/model` picker printed a price belonging to a different model than the
  row named"*. Since `TJn` routes through `Goe()` (see [`opus5_and_sonnet5.md`](opus5_and_sonnet5.md)
  §6), the price and the name can no longer disagree.
- **`seen` dedupes by *destination*.** Two unentitled rows can step down to the same permitted model;
  without the set the picker would show it twice.
- **`e2c()` (`:120570-120589`) refuses to step down into a slot already held.** Its guard at
  `:120581-120586` scans the other rows for one with the same normalised id, the same `[1m]`-ness, and
  `Pl(value)` true — and returns `null` (drop) rather than producing a duplicate.

`nqe()` (`:120604-120632`) is the last stage: it projects each row into the capability-annotated shape
used by the Remote Control / SDK picker, attaching `supportsEffort` (with the per-level filter for
`max` and `xhigh`), `supportsAdaptiveThinking`, `supportsFastMode` (via `mv()`), `supportsAutoMode`,
and `promoListPrice`. Every one of those flags is a **catalogue capability read**, so the remote picker
inherits the catalogue's answers rather than duplicating a model list — the clearest payoff of the
rewrite outside the CLI itself. `tengu_remote_model_picker` (**220=2 / 193=0**, `:715357`, `:715363`)
instruments it with `{outcome: "opened"|"timeout"|"fallback", model_count}`.

---

## 6. Custom-model rows from `ANTHROPIC_DEFAULT_*_MODEL`

Four near-identical builders let an operator replace a family row wholesale:

```javascript
// ============================================
// buildCustomSonnetRow - the ANTHROPIC_DEFAULT_SONNET_MODEL override row
// Location: cli_inner_pretty.js:120031-120042
// ============================================

// ORIGINAL (for source lookup):
function OBc() {
  let e = Z.ANTHROPIC_DEFAULT_SONNET_MODEL;
  if (xJn() && e) {
    let t = Wb(e);
    return {
      value: "sonnet",
      label: Z.ANTHROPIC_DEFAULT_SONNET_MODEL_NAME ?? e,
      description: Z.ANTHROPIC_DEFAULT_SONNET_MODEL_DESCRIPTION ?? `Custom Sonnet model${t ? " (1M context)" : ""}`,
      descriptionForModel: `${Z.ANTHROPIC_DEFAULT_SONNET_MODEL_DESCRIPTION ?? `Custom Sonnet model${t ? " with 1M context" : ""}`} (${e})`,
    };
  }
}

// READABLE (for understanding):
function buildCustomSonnetRow() {
  const custom = env.ANTHROPIC_DEFAULT_SONNET_MODEL;
  if (!thirdPartyOrProxiedSetup() || !custom) return undefined;
  const has1m = has1mSuffix(custom);
  return {
    value: "sonnet",                                     // keeps the alias as the row value
    label: env.ANTHROPIC_DEFAULT_SONNET_MODEL_NAME ?? custom,
    description: env.ANTHROPIC_DEFAULT_SONNET_MODEL_DESCRIPTION
              ?? `Custom Sonnet model${has1m ? " (1M context)" : ""}`,
    descriptionForModel: `${env.ANTHROPIC_DEFAULT_SONNET_MODEL_DESCRIPTION
              ?? `Custom Sonnet model${has1m ? " with 1M context" : ""}`} (${custom})`,
  };
}

// Mapping: OBc→buildCustomSonnetRow, xJn→thirdPartyOrProxiedSetup, Wb→has1mSuffix
```

The four builders are `OBc` (sonnet, `:120031-120042`), `FBc` (opus, `:120103-120114`),
`NBc` (fable, `:120074-120083`) and `jBc` (haiku, `:120211-120220`), plus the free-form
`ANTHROPIC_CUSTOM_MODEL_OPTION` row appended in `jug()` at `:120497-120502`.

**The shared gate `xJn()` (`:120019-120021`) is the interesting part:**

```javascript
// ORIGINAL (:120019-120021):
function xJn() {
  return !rm() || iW() || !Yd();
}
```

*"not using first-party model ids, **or** on a Claude Platform channel, **or** not on the official
base URL."* Custom family rows are offered exactly when the client cannot be sure the baked catalogue
ids are the right ones to send — a proxy, a self-hosted gateway, or a Claude Platform deployment. On a
plain first-party session with the official base URL the env vars are ignored, because a
"Custom Sonnet model" row there would let a user shadow the real Sonnet with an arbitrary string and
get an opaque API error.

Note also `descriptionForModel` on every row: a *second* description written for Claude rather than
the human, and it always appends the concrete id in parentheses. This is what lets the model reason
about "which model am I being asked to switch to" when a skill or command sets the model — see
`R5r()` (`:111260-111276`), which rejects a skill-supplied model that is not in the allow-list with
*"Skill/command model \"…\" is not in the availableModels allowlist; keeping the session model"*
(`:111264`).

Two of the four families additionally get a **3P-probe guard**. `jji()` (`:110561-110573`) refuses to
treat `ANTHROPIC_DEFAULT_SONNET_MODEL` as authoritative when it equals
`CLAUDE_CODE_3P_PROBE_WROTE_SONNET_DEFAULT` (`:110565`) — i.e. when the value was written by the
client's own third-party capability probe rather than by the operator. Distinguishing
"the operator set this" from "we set this ourselves earlier" is exactly the kind of state confusion
that produces the `.211` *"Vertex/Bedrock attempting the default Opus model at startup"* class of bug.

---

## 7. Adjacent command-surface fixes

### 7.1 `.199` bullet 13 — `/model` and `/fast` while viewing a subagent

`tengu_agent_view_leader_command_notice` is **220=1 / 193=0**, emitted at `:753903`. The notice text
is built by `qWf()`:

```javascript
// ORIGINAL (:748982-748998):
function qWf(e, { isTeammate: t }) {
  let r = t ? "the team lead" : "the main conversation",
    n = t ? "teammate" : "agent",
    o = e.name,
    i;
  switch (o) {
    case "model":
      i = "model";
      break;
    case "fast":
      i = "fast mode";
      break;
    default:
      return;
  }
  return `/${o} changes ${r}'s ${i}, not this ${n}'s`;
}
```

So the message is *"/model changes the team lead's model, not this teammate's"* or
*"/fast changes the main conversation's fast mode, not this agent's"*. The `default: return;`
arm is the design: `qWf` returns `undefined` for every other command, and the caller
(`:753901-753912`) only shows a notice when it returns a string — so the notice is opt-in per command
rather than a blanket "this may not do what you expect". `priority: "immediate"`, `timeoutMs: 8000`
(`:753909`), keyed `"agent-view-command-notice"` so repeats replace rather than stack.

### 7.2 `.209` — `/model` unblocked in `claude agents` background sessions

`.209` was a single-bullet release, and it is a **revert**: the previous behaviour blocked dialogs
outright. In 220 the block survives only for commands that genuinely cannot run, with telemetry:

```javascript
// ORIGINAL (:806776-806782):
(O("tengu_slash_command_unavailable", {
  command_name: ic,
  ...np,
  surface: as.current === "remote" ? Ee("fleet-cloud") : Ee("fleet-local"),
  reason: Ee("unavailable_in_agent_view"),
}),
  _O(`/${Tl.name} isn't available in agent view — attach to a session to run it`));
```

`tengu_slash_command_unavailable` is **220=2 / 193=0** and `unavailable_in_agent_view` is
**220=1 / 193=0**. The `surface` dimension distinguishes `fleet-cloud` from `fleet-local`, and the
payload carries a command-classification spread (`np`: `canonicalName`, `isMcp`, `isBuiltIn`,
`isBundled`, `isOfficial`, `:806770-806775`) — enough to tell later whether the remaining blocks are
hitting commands users actually want. Instrumenting the refusal *before* narrowing it is what made the
`.209` revert safe.

### 7.3 `.212` bullet 45 — headless `set_model` applied mid-turn

`tengu_live_model_switch` is **220=2 / 193=0**. The mid-turn application is at `:337601-337614`: the
loop calls `cud(q, Oi())`, and on a non-`undefined` result rebinds **five** things at once —
the local model var, the loop's copy, two cached derived values set to `void 0`, and
`V.options.mainLoopModel` — then emits the event with `{from_model, to_model, query_source,
entrypoint: "cli", queryChainId, queryDepth}`. Invalidating the two derived caches in the same
statement is the correctness-critical part: a mid-turn switch that left a stale derived value would
send one model's id with another model's parameters.

The validation half is `:847590-847612`, and it is a three-way outcome:

```javascript
// ORIGINAL (:847590-847596):
let Hr = dt.request.model ?? "default",
  Cr = Hr.trim().toLowerCase() === "default",
  jn = Cr ? KA() : Hr,
  Ao = Cr ? { recognized: !0 } : pxm(jn),
  Zo = !Cr && !FC(jn) && !(RU(jn) ?? Pl(jn)),
  Yn = Zo ? X8(jn) : null;
if (!Ao.recognized) { … }
```

1. **Unrecognised** → `tengu_set_model_unrecognized` with `{shape, had_suggestion, surface: "print"}`
   (`:847598-847602`) and a rejection message carrying a spelling suggestion (`fxm(Mze(Hr), Ao.suggestion)`,
   `:847607`). `shape` classifies *how* the value was malformed — which is the fix for `.208`'s
   *"`control_request` with a non-string `set_model` hanging headless sessions"*: a non-string now
   produces a classified rejection instead of falling through.
2. **Recognised but not permitted, with no fallback** (`Zo && Yn === null`, `:847608`) → `not_allowed`.
3. Otherwise applied.

### 7.4 `.218` bullet 31 — announcements on `/config model=<x>`

`tengu_config_model_changed` is **1 / 1 — carryover**, so the *event* is not the delta. The delta is
the fast-mode announcement plumbing wired into the `/config key=value` handler at `:451241-451256`:
`tengu_config_model_changed` → `aOe()` + `dde()` → `HU()` → `IU()` → `kmt()`. See
[`fast_mode.md`](fast_mode.md) §7.2 for `kmt` and the `announceKeptOn` distinction.

---

## 8. Fable row disabling, and `.208` bullet 5

`Gug()` (`:120656-120664`) is the credits-required disable pass, and its five-term entry guard is the
most conditional line in the picker:

```javascript
// ORIGINAL (:120656-120664):
function Gug(e) {
  if (!ABc() || aZ() || TT() || !wBc() || !(rqe() || Y1e())) return e;
  return e.map((t) => {
    if (t.disabled === !0 || typeof t.value !== "string" || !NQt(t.value)) return t;
    let r = K1e() ? "" : " — requires usage credits";
    if (vde !== null) vde.disabledReasons.add("credits_required");
    return { ...t, disabled: !0, label: "Fable (disabled)", description: `${t.description}${r}` };
  });
}
```

Term by term:
- `ABc()` (`:119840-119842`) — the gate `tengu_saffron_picker_dim`. The whole behaviour is behind a
  remote flag, so it can be withdrawn without a release.
- `aZ()` (`:119819-119821`) — bail unless first-party, on a subscription, not `G6e()`, and not the
  `default_claude_zero` tier.
- `wBc()` (`:119855-119858`) — the cached extra-usage reason is specifically `org_level_disabled` or
  `overage_not_provisioned`. Not *any* refusal: only the two that mean "your org has not turned
  credits on", which is actionable.
- `rqe() || Y1e()` (`:119811-119813`, `:119834-119839`) — either consent is required
  (`overageConsentRequired` or the plan-limits end date has passed, `K1e()`, `:119814-119818`) or the
  account is on a credits-only tier, where `Y1e()` reads the gate-supplied tier list
  `tengu_saffron_credits_only_tiers` (`yug()`, `:119822-119830`) with enterprise force-true at
  `:119831-119832`.

`vde.disabledReasons` accumulates a reason set (`"credits_required"` here, `"error_override"` at
`:120482`, `"server_disabled"` at `:120511`) — a diagnostic channel that records *why* the picker
looks the way it does. Note `yug()` and `SJn()` (`:119843-119853`) both `safeParse` their gate payload
and log *"unparseable value, using default"* / *"unparseable value or no recognized keys, ignoring"*
on failure: the same fail-soft posture as the model catalogue itself.

**`.208` bullet 5** (*"Fable 5 usage-credits consent prompt starts on the decline option"*) remains
**UNANCHORED**. `declineFirst` / `defaultOption` / `initialIndex` are all 3/3 carryover and no
Fable-specific consent-dialog index appears in 2.1.220. The disable/consent machinery above is where
it would live, but the specific initial-selection change is not isolable.

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
- `resolveModelWithAttribution` (`iQt`, `:110736-110751`) - the 4-level ladder returning `{setting, attribution}`
- `getSessionModel` (`Z$`, `:110733-110735`) - `iQt().setting`
- `getResolvedOrgDefault` (`wSi`, `:3054-3056`) / `setResolvedOrgDefault` (`l0t`, `:3057-3059`)
- `resolveOrgDefaultModel` (`U6e`, `:110723-110727`) / `validateOrgDefaultName` (`lRc`, `:110728-110732`)
- `getOrgModelDefault` (`Nji`, `:154491-154507`) - shape check, org binding, C0/C1 strip
- `orgModelDefaultIfFirstParty` (`Jkt`, `:110158-110161`)
- `resolveTierBaseline` (`cRc`, `:110770-110783`) / `resolveEnforcedAvailableModel` (`E7n`, `:110784-110936`)
- `resolveEntitlementStepDown` (`S7n`, `:110752-110769`) - the Opus→Sonnet→Haiku ladder
- `newestPermittedInFamily` (`f5r`, `:110162-110169`) / `wholeWordFamilyMatch` (`$ji`, `:110170-110178`)
- `isModelAllowed` (`Pl`, `:110218-110269`) / `isInSet` (`K8`, `:110144-110149`) / `unentitledModelIds` (`dW`, `:110150-110154`)
- `serverModelUnavailability` (`$6e`, `:110581-110593`) - `{reason: "disabled"|"absent", …}`
- `isAnythingOrgImposed` (`Yji`, `:111077-111081`)
- `defaultRowDescription` (`A7n`, `:111164-111176`) - the `· Org default` vs `· Set by your organization` branch
- `orgSuffix` (`Aug`, `:119999-120001`) / `ORG_DEFAULT_SUFFIX` (`KBc`, `:120003-120005`)
- `serverModelOptions` (`$1e`, `:154474-154484`) / `modelAccessRows` (`ZJt`, `:154486-154490`)
- `gatewayDiscoveredModels` (`u5r`, `:109868-109873`) / `fetchGatewayModels` (`XIc`, `:109874-109929`)
- `insertModelRowAfterAnchorFamilies` (`$Qt`, `:120665-120701`) - the `.206` anchor fix
- `familyOf` (`wJn`, `:120702-120709`) / `isFableRowValue` (`NQt`, `:120649-120651`) / `isFableIdPattern` (`VBc`, `:120652-120655`)
- `rowsMatchSameModel` (`OQt`, `:120641-120648`)
- `applyEntitlementStepDownToRows` (`dit`, `:120590-120603`) / `entitlementStepDownForRow` (`e2c`, `:120570-120589`)
- `buildRowForModel` (`TJn`, `:120392-120408`)
- `projectRowsWithCapabilities` (`nqe`, `:120604-120632`) - the Remote Control picker payload
- `assembleModelPickerRows` (`jug`, `:120494-120560`) / `buildBaseModelRows` (`Fug`, `:120321-120386`)
- `thirdPartyOrProxiedSetup` (`xJn`, `:120019-120021`) - gate for custom family rows
- `buildCustomSonnetRow` (`OBc`, `:120031-120042`) / `buildCustomOpusRow` (`FBc`, `:120103-120114`) / `buildCustomFableRow` (`NBc`, `:120074-120083`) / `buildCustomHaikuRow` (`jBc`, `:120211-120220`)
- `sonnetDefaultRespecting3pProbe` (`jji`, `:110561-110573`) - `CLAUDE_CODE_3P_PROBE_WROTE_SONNET_DEFAULT`
- `resolveSkillModel` (`R5r`, `:111260-111276`)
- `disableFableRowsWithoutCredits` (`Gug`, `:120656-120664`)
- `isPickerDimGateOn` (`ABc`, `:119840-119842`) / `creditsPickerBailout` (`aZ`, `:119819-119821`) / `extraUsageOrgBlocked` (`wBc`, `:119855-119858`) / `overageConsentRequired` (`K1e`, `:119814-119818`) / `isCreditsOnlyTier` (`Y1e`, `:119834-119839`) / `creditsOnlyTierList` (`yug`, `:119822-119830`)
- `leaderCommandNotice` (`qWf`, `:748982-748998`) - `.199` bullet 13
- `applyModelSwitchMidTurn` (`:337601-337614`) - `tengu_live_model_switch`
- `validateSetModelControlRequest` (`:847590-847612`) - `tengu_set_model_unrecognized`
