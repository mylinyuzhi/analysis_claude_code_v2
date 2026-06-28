# Org-configured model restrictions — entitlement gate across picker / `--model` / `/model` / `ANTHROPIC_MODEL`

> **Type/version:** MIXED — the entitlement gate + `/model`-switch denial + fallback resolver are **NET-NEW (changelog 2.1.187)**; the "Using X instead" warning string is **CARRYOVER (183)**. Confidence HIGH.
> TARGET: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (build `a1938d2a`). `<line>` is **193** unless tagged **(183)**.

---

## TL;DR

183 already *warned and fell back* when a configured model was unavailable (the `rre` "Using X instead" message, used broadly for agent/startup model clamping). 193 adds a **hard entitlement gate**: a model the organization has not entitled is now

- **excluded from the model picker** (`Ia` filter),
- **rejected by `/model <name>`** with a distinct actionable message + `denied_by_entitlement` telemetry (`tzt`),
- **auto-downgraded** to the nearest entitled family (opus→sonnet→haiku) by the effective-model resolver (`u_n`/`aw`), which covers `--model`, `ANTHROPIC_MODEL`, and env.

The restricted set is **only non-empty for first-party / gateway auth** (`Uge`) — i.e. org entitlements; third-party / Bedrock / Vertex deployments are exempt.

---

## 1. The restricted-set builder and the gate — `d7u` / `NFe` / `Uge`

**What it does.** `d7u` builds the set of model names the org has *not* entitled; `NFe` tests whether a given model falls in that set; `Uge` produces the set — but **only** for first-party / gateway auth.

```javascript
// ============================================
// d7u / NFe / Uge - build the org-restricted model set, test membership, and scope it to org auth
// Location: cli_inner_pretty.js:102809-102824
// ============================================

// ORIGINAL (for source lookup):
function d7u(e) {
  let t = new Set();
  for (let n of e ?? []) if (!n.entitled) t.add(u7u(n.apiName));
  return t;
}
function NFe(e, t) {
  if (t.size === 0) return !1;
  let n = Fa(e.trim().toLowerCase()), r = eD(n) ? qo(n) : n;
  return t.has(to(r));
}
function Uge() {
  let e = _r();
  if (e !== "firstParty" && e !== "gateway") return new Set();
  return d7u(kOr());
}

// READABLE (for understanding):
function buildRestrictedModelSet(entitlements) {
  let restricted = new Set();
  for (let ent of entitlements ?? [])
    if (!ent.entitled) restricted.add(normalizeModelName(ent.apiName)); // u7u — add every NON-entitled model
  return restricted;
}
function isModelRestrictedByEntitlements(model, restrictedSet) {
  if (restrictedSet.size === 0) return false;                            // fast path: no restrictions
  let normalized = canonicalize(model.trim().toLowerCase()),             // Fa
    base = isAlias(normalized) ? resolveAlias(normalized) : normalized;  // eD/qo — resolve aliases to a base model
  return restrictedSet.has(normalizeModelName(base));                    // to
}
function getOrgRestrictedModelSet() {
  let authKind = getAuthKind();                                          // _r
  if (authKind !== "firstParty" && authKind !== "gateway") return new Set(); // ← only org auth has entitlements
  return buildRestrictedModelSet(getEntitlements());                     // kOr
}

// Mapping: d7u→buildRestrictedModelSet, NFe→isModelRestrictedByEntitlements, Uge→getOrgRestrictedModelSet,
//          u7u→normalizeModelName, Fa→canonicalize, eD→isAlias, qo→resolveAlias, to→normalizeModelName,
//          _r→getAuthKind, kOr→getEntitlements
```

**Why scope the set to first-party / gateway auth.** Entitlements are an Anthropic org concept; they only exist when the user authenticates through Anthropic (first-party login) or an Anthropic gateway. A user on Bedrock / Vertex / a third-party proxy has no entitlement list, so `Uge` returns an **empty set** for them — and `NFe`'s `if (t.size === 0) return !1` fast-path makes every gate a no-op. This is the crucial safety property: **the restriction can never accidentally fire for a non-org deployment**, because the set is empty by construction there. The alias resolution in `NFe` (`eD`/`qo`) means a restriction on the base model also covers its aliases — you cannot dodge the gate by naming an alias.

---

## 2. The `/model` switch denial — `tzt`

**What it does.** When the user runs `/model <name>` (or the equivalent programmatic switch), `tzt` rejects a restricted model with a distinct, actionable message and emits `denied_by_entitlement` telemetry — *before* the generic availability check.

```javascript
// ============================================
// tzt (switchModel) - reject an entitlement-restricted model with an actionable message
// Location: cli_inner_pretty.js:487243-487256
// ============================================

// ORIGINAL (for source lookup):
async function tzt(e) {
  let t = e === "default" ? null : e;
  if (t && NFe(t, Uge()))
    return (
      Re("model_switch", "denied_by_entitlement"),
      { ok: !1, message: `Model '${t}' is restricted by your organization's settings. Run /model to choose a different model.` }
    );
  if (t && !Ia(t))
    return (Re("model_switch", "not_allowed"), { ok: !1, message: `Model '${t}' is not available. Your organization restricts model selection.` });
  ...
}

// READABLE (for understanding):
async function switchModel(requested) {
  let target = requested === "default" ? null : requested;
  if (target && isModelRestrictedByEntitlements(target, getOrgRestrictedModelSet())) {
    emit("model_switch", "denied_by_entitlement");                       // NET-NEW telemetry
    return { ok: false, message: `Model '${target}' is restricted by your organization's settings. Run /model to choose a different model.` };
  }
  if (target && !isModelAvailable(target))                               // generic availability (carryover)
    return (emit("model_switch", "not_allowed"), { ok: false, message: `Model '${target}' is not available. Your organization restricts model selection.` });
  ...
}

// Mapping: tzt→switchModel, NFe→isModelRestrictedByEntitlements, Uge→getOrgRestrictedModelSet,
//          Ia→isModelAvailable, Re→emit
```

**Why a *distinct* message and a separate telemetry key.** There are two failure modes for "you can't use this model," and 193 separates them:

- **`denied_by_entitlement`** — the org has explicitly *not entitled* this model. The message names the cause ("restricted by your organization's settings") and the remedy ("Run /model to choose a different model"). This is actionable: the user knows it is a policy, not a typo, and how to recover.
- **`not_allowed`** — the model is not in the available list for some other reason. Generic message.

Splitting these lets support and telemetry distinguish "org policy blocked it" from "model unavailable," and gives the user a precise next step. `grep -c denied_by_entitlement` is **183=0, 193=1** — both the telemetry key and the "Run /model to choose a different model" string (`grep -c` 183=**0**) are net-new. The `/model` path reaches `tzt` from callers at `:559212`/`:560675`/`:560710`.

---

## 3. The fallback resolver — `u_n` / `aw` (covers `--model`, `ANTHROPIC_MODEL`, env)

**What it does.** `u_n` takes a model and, if it is restricted, returns the **next entitled family** in the order opus→sonnet→haiku; `aw` is the effective-model resolver that applies `u_n` to the configured/env model so a restricted model is silently downgraded rather than failing at request time.

```javascript
// ============================================
// u_n / aw - resolve a restricted model to the nearest entitled family
// Location: cli_inner_pretty.js:103207-103224
// ============================================

// ORIGINAL (for source lookup):
function aw() {
  let { setting: e, envFamily: t, concreteBaseline: n } = POr(), r = d_n(e, t, n) ?? e;
  return u_n(r) ?? r;
}
function u_n(e) {
  let t = Uge();
  if (t.size === 0 || !NFe(e, t)) return null;
  let n = [
      { family: "opus", model: b_() },
      { family: "sonnet", model: fx() },
      { family: "haiku", model: z3() },
    ],
    r = to(qo(e)),
    o = n.findIndex((i) => r.includes(i.family)),
    s = o !== -1 ? o : RH(qo(e)) ? 0 : 1;
  for (let { model: i } of n.slice(s)) if (Ia(i)) return i;
  return null;
}

// READABLE (for understanding):
function getEffectiveModel() {
  let { setting, envFamily, concreteBaseline } = resolveModelInputs();   // POr — covers ANTHROPIC_MODEL/env/setting
  let resolved = pickConcreteModel(setting, envFamily, concreteBaseline) ?? setting; // d_n
  return resolveRestrictedModelFallback(resolved) ?? resolved;           // downgrade if restricted
}
function resolveRestrictedModelFallback(model) {
  let restricted = getOrgRestrictedModelSet();
  if (restricted.size === 0 || !isModelRestrictedByEntitlements(model, restricted)) return null; // not restricted → no change
  let families = [
    { family: "opus", model: defaultOpus() },     // b_
    { family: "sonnet", model: defaultSonnet() }, // fx
    { family: "haiku", model: defaultHaiku() },   // z3
  ];
  let base = normalizeModelName(resolveAlias(model)),
    idx = families.findIndex((f) => base.includes(f.family)),
    start = idx !== -1 ? idx : (isOpusLike(resolveAlias(model)) ? 0 : 1); // RH — where to start the downgrade walk
  for (let { model: candidate } of families.slice(start))                // walk down opus→sonnet→haiku
    if (isModelAvailable(candidate)) return candidate;                   // first ENTITLED family wins
  return null;
}

// Mapping: aw→getEffectiveModel, u_n→resolveRestrictedModelFallback, POr→resolveModelInputs, d_n→pickConcreteModel,
//          Uge→getOrgRestrictedModelSet, NFe→isModelRestrictedByEntitlements, Ia→isModelAvailable,
//          b_→defaultOpus, fx→defaultSonnet, z3→defaultHaiku, RH→isOpusLike, to→normalizeModelName, qo→resolveAlias
```

**Why downgrade to the *next* family rather than reject.** A model configured via `ANTHROPIC_MODEL` or `--model` is set *before* a request runs; failing hard there would break the session at startup. Instead `u_n` finds the requested model's family position and walks **down** the capability ladder (opus→sonnet→haiku) to the first *entitled, available* family, so a restricted `opus` request becomes the org's allowed `sonnet` (or `haiku`) transparently. Walking *down* (not up) preserves the user's intent of "as capable as allowed" without ever escalating to a model they pay more for than they asked. Returning `null` when nothing matches lets the caller (`aw`) fall back to the original resolved model (`u_n(r) ?? r`), so the resolver never returns a worse-than-nothing answer.

**Coverage of all four entry points.**

- **`--model` / `ANTHROPIC_MODEL` / env** → resolve through `aw()` → `u_n()` → `NFe` (`:103207`).
- **interactive picker / default selection** → filter via `Ia()` → `NFe` (`:102880`) and the default-model filters at `:103166`/`:103185` (`(dB(a) ?? Ia(a)) && !NFe(a, Uge())`).
- **`/model` command** → `tzt()` (`:487243`) with the "Run /model" denial.

---

## 4. The picker filter — `Ia` gains an `NFe` clause

The model-availability predicate `Ia` (`isModelAvailable`) gains a restriction clause so restricted models vanish from the picker:

```javascript
// ============================================
// Ia (isModelAvailable) - exclude entitlement-restricted models from the picker
// Location: cli_inner_pretty.js:102880
// ============================================

// ORIGINAL (for source lookup):
if (NFe(e, Uge())) return !1;

// READABLE (for understanding):
if (isModelRestrictedByEntitlements(model, getOrgRestrictedModelSet())) return false; // hide restricted models

// Mapping: Ia→isModelAvailable, NFe→isModelRestrictedByEntitlements, Uge→getOrgRestrictedModelSet
```

This single clause is what removes restricted models from the picker list and from default-model selection (since both consult `Ia`). The `NFe` clause is net-new (the `Ia` predicate body otherwise carries over).

---

## 5. Contrast with the CARRYOVER `rre` "Using X instead" warning

183 already had `rre` (`formatModelRestrictedWarning`, **(183)** `:362631`; in 193 `:374023`) — a *warning* string used when a configured model is clamped to another:

```javascript
// (193) cli_inner_pretty.js:374023 — carryover function (same shape in 183)
function rre(e, t) {
  return `Model "${Qft(e)}" is restricted by your organization's settings. Using ${Qft(t)} instead.`;
}
```

**Drift caution (verified):** the *phrase* "restricted by your organization's settings" is **not** unique to 193 — it already existed in 183 inside `rre`. `grep -c "restricted by your organization's settings"` is **183=1, 193=2**. The 183 occurrence is the `rre` carryover; the *net-new* 193 string is specifically the `/model` denial ending `…Run /model to choose a different model.` (`grep -c "Run /model to choose a different model"` 183=**0**, 193=**1**). So the distinguishing net-new surface is the **`/model` hard denial + `denied_by_entitlement` telemetry + the `u_n` downgrade + the `Ia`/`NFe` picker exclusion** — *not* the warning phrase, which is carryover.

**Key insight.** 183's model-restriction story was *advisory*: warn and clamp (`rre`). 193 makes it *enforced*: a non-entitled model is invisible in the picker, rejected by `/model` with an actionable distinct message + telemetry, and auto-downgraded to the nearest entitled family for `--model`/env — and all of it is inert (`NFe` size-0 fast-path) for any deployment that is not first-party / gateway org auth.

---

## Evidence note (NET-NEW vs CARRYOVER)

| Item | 193 anchor | 183 status | grep diff |
|------|-----------|------------|-----------|
| Restricted-set builder `d7u` | `:102809` | absent | `grep -c "if (!n.entitled)"` 183=**0** |
| Gate `NFe` | `:102814` | absent | net-new |
| Org-scoped set `Uge` | `:102820` | absent | net-new |
| `/model` denial `tzt` | `:487243` | absent | net-new |
| "Run /model…" string | `:487250` | absent | `grep -c` 183=**0**, 193=**1** |
| `denied_by_entitlement` telemetry | `:487247` | absent | `grep -c` 183=**0**, 193=**1** |
| Picker filter `Ia` `NFe` clause | `:102880` | clause absent | net-new clause |
| Default-model filters | `:103166`,`:103185` | clause absent | net-new |
| Fallback resolver `u_n` | `:103212` | absent | net-new |
| Effective-model resolver `aw` | `:103207` | uses new `u_n` | refined |
| **"Using X instead" warning `rre`** | `:374023` | present **(183)** `:362631` | **CARRYOVER** |

---

## Cross-links

- Sibling 193 docs: [README.md](./README.md). This is the model-gate facet of the permissions module; it shares no code with the shell/sandbox facets but is grouped here because it is an *entitlement-driven permission* surface.
- The model selection / picker subsystem (`Ia`, `aw`, the family defaults `b_`/`fx`/`z3`) is the broader host the `NFe` gate threads into.

---

## Related Symbols

> Symbol mappings live in the symbol index files, never in this doc:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Model (home for the entitlement gate)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md)
> - per-feature additions: [symbol_additions_v2_1_193_permissions.md](../00_overview/symbol_additions_v2_1_193_permissions.md)

Key functions in this document:

- `buildRestrictedModelSet` (obf: `d7u`, `:102809`) — `if (!entitled) add(apiName)`.
- `isModelRestrictedByEntitlements` (obf: `NFe`, `:102814`) — membership test w/ alias resolution; size-0 fast-path.
- `getOrgRestrictedModelSet` (obf: `Uge`, `:102820`) — empty unless `firstParty`/`gateway` auth.
- `switchModel` (obf: `tzt`, `:487243`) — `/model` denial + `denied_by_entitlement`.
- `resolveRestrictedModelFallback` (obf: `u_n`, `:103212`) — downgrade opus→sonnet→haiku.
- `getEffectiveModel` (obf: `aw`, `:103207`) — `u_n(r) ?? r`; covers `ANTHROPIC_MODEL`/env.
- `isModelAvailable` (obf: `Ia`, `:102880`) — picker filter; net-new `NFe` clause.
- `formatModelRestrictedWarning` (obf: `rre`, `:374023`) — **carryover** "Using X instead" warning (183 `:362631`).
