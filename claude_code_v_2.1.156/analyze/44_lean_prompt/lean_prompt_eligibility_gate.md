# Lean System Prompt Eligibility Gate (X3 / c45 / d45)

> Module 44_lean_prompt — the model-gate predicate that decides whether Claude Code
> sends the **lean** (single compact "Harness" section) or the **full** (six-section)
> system prompt. New in v2.1.154; changelog line 12: *"The lean system prompt is now the
> default for all models except Haiku, Sonnet, and Opus 4.7 and earlier."*

## Related Symbols

> Symbol mappings live in the central index — do not duplicate the tables here:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (System Prompts, Agent Loop, Tools)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Model selection, Prompt building)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key symbols in this document:

- `isLeanSystemPrompt` (`X3`) — memoized top-level predicate, `true` ⇒ lean prompt (cli_inner_pretty.js:143864, 143872-143877).
- `isFullPromptModel` (`c45`) — model-class test, `true` ⇒ keep FULL prompt (cli_inner_pretty.js:143847-143862).
- `isForcedLeanModel` (`d45`) — remote/clientData force-lean override (cli_inner_pretty.js:143839-143845).
- `isEarlyAccessModel` (`gM6`) — `-eap` suffix bypass, forces lean-eligibility (cli_inner_pretty.js:143836-143838).
- `isFirstPartyProvider` (`UA`) — provider class predicate (cli_inner_pretty.js:91891-91893).
- `normalizeModelId` (`O7`) — canonical model id resolver (cli_inner_pretty.js:98770-98778).
- `canonicalizeOpusModelId` (`HD`) — opus/sonnet/haiku id canonicalizer (cli_inner_pretty.js:98751-98768).
- `resolveModelOverrideAlias` (`Gi$`) — model-override reverse lookup used by `O7` (cli_inner_pretty.js:91967-91977).
- `memoize` (`v8`/`cx8`) — lodash memoize used to cache `X3` (cli_inner_pretty.js:1475-1486, 1492).
- `parseBoolTrue` (`xH`) — explicit-true env parser (cli_inner_pretty.js:1795-1799).
- `parseBoolFalse` (`k4`) — explicit-false env parser (cli_inner_pretty.js:1801-1806).
- `currentProvider` (`Zq`) — resolves provider from env (cli_inner_pretty.js:91853-91864).
- `isSimplePromptMode` (`cKq`) — `CLAUDE_CODE_SIMPLE` hard short-circuit (cli_inner_pretty.js:555588-555590).
- `buildSystemPromptSections` (`N0`) — main assembler that consumes `X3` (cli_inner_pretty.js:555614-555658).
- `leanHarnessSection` (`oXz`) — the single lean section (cli_inner_pretty.js:555591-555607).
- `isOpus46OrNewer` (`Wj`) — Fast-Mode opus membership test, **distinct** from lean (cli_inner_pretty.js:98257-98263).

---

## TL;DR

`isLeanSystemPrompt` (`X3`) is the single source of truth for "lean vs full." It is a
lodash-memoized closure created at module-init (cli_inner_pretty.js:143872-143877). Given a
model id it answers `true` ⇒ **send the lean prompt**, `false` ⇒ **send the full prompt**.

The decision is, in plain English:

```
X3(model) = !isFullPromptModel(model)  ||  isForcedLeanModel(model)
```

with two env escape hatches checked **first**:

```
if CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT is explicitly-true   → lean
if CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT is explicitly-false   → full
```

`isFullPromptModel` (`c45`) is the "keep the verbose instructions" allow-list: it returns
`true` (FULL) for `claude-3-*`, anything containing `haiku` or `sonnet`, and the older Opus
ids `opus-4-0/4-1/4-5/4-6/4-7`; it returns `false` (LEAN) for `opus-4-8`; and for any
**other** id it falls through to `!isFirstPartyProvider()`, so an unknown id served from a
first-party/anthropicAws/gateway endpoint goes lean, while the same unknown id on
Bedrock/Vertex/Foundry/Mantle keeps full. The `-eap` early-access suffix short-circuits
`c45` to `false`, making any early-access build immediately lean-eligible.

`X3` is consulted at **21** call sites in the bundle (`grep -c "X3("` ⇒ 21) — the central one
being the prompt assembler `N0` (cli_inner_pretty.js:555622), which swaps a single compact
"Harness" section for six full sections. The rest flip individual sub-sections (anti-verbosity,
action-caution, focus-mode, tool descriptions, todo description, auto-mode classifier, agent
listing) to terser variants. Because of this fan-out — 16+ reads per turn across the prompt
sub-sections — the predicate is memoized.

Confidence: **HIGH**. Every claim below is read directly from the cited lines.

---

## 1. The top-level predicate: `isLeanSystemPrompt` (`X3`)

`X3` is declared as a bare `var` (cli_inner_pretty.js:143864) and assigned inside the module
initializer `Dv` (cli_inner_pretty.js:143865-143877). The assignment wraps the real logic in
`v8(...)` — lodash `memoize` (see §5).

```javascript
// ============================================
// isLeanSystemPrompt - Memoized lean-vs-full gate; true => lean prompt
// Location: cli_inner_pretty.js:143864, 143872-143877
// ============================================

// ORIGINAL (for source lookup):
var X3;
var Dv = T(() => {
  Qt(); r8(); s8(); c$(); Rq(); f4();
  X3 = v8((H) => {
    if (!H) return !1;
    if (xH(process.env.CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT)) return !0;
    if (k4(process.env.CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT)) return !1;
    return !c45(H) || d45(H);
  });
});

// READABLE (for understanding):
let isLeanSystemPrompt;                       // set during module init
const initLeanPromptModule = lazyInit(() => {
  // ...sibling-module initializers (Qt, r8, s8, c$, Rq, f4)...
  isLeanSystemPrompt = memoize((model) => {
    if (!model) return false;                 // no model id => default to FULL
    if (parseBoolTrue(process.env.CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT))  return true;  // force lean
    if (parseBoolFalse(process.env.CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT)) return false; // force full
    return !isFullPromptModel(model) || isForcedLeanModel(model);
  });
});

// Mapping: X3→isLeanSystemPrompt, Dv→initLeanPromptModule, v8→memoize, H→model,
//          xH→parseBoolTrue, k4→parseBoolFalse, c45→isFullPromptModel, d45→isForcedLeanModel
```

**How it works (in evaluation order):**

1. **Empty model guard** (`if (!H) return !1`, cli_inner_pretty.js:143873). A missing/empty
   model id resolves to FULL. This is the conservative default: when the caller can't tell us
   the model (e.g. an early-startup section build), keep the verbose, capability-agnostic prompt
   rather than risk under-instructing a weak model.
2. **Explicit env force-lean** (cli_inner_pretty.js:143874). `parseBoolTrue` (`xH`) treats
   `1/true/yes/on` (case-insensitive, trimmed) as true (cli_inner_pretty.js:1795-1799). If the
   user set `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=1`, return lean unconditionally — the model class
   no longer matters.
3. **Explicit env force-full** (cli_inner_pretty.js:143875). `parseBoolFalse` (`k4`) treats
   `0/false/no/off` as true-for-false (cli_inner_pretty.js:1801-1806). Note `xH` and `k4` are
   **not** complements: a string like `"maybe"` is neither explicit-true nor explicit-false, so
   both return false and control falls through to the model logic. This three-state design (set
   / unset-or-garbage / cleared) lets the env var *override in either direction* while leaving
   "unset" to the model heuristic.
4. **Model heuristic** (cli_inner_pretty.js:143876): `!isFullPromptModel(model) || isForcedLeanModel(model)`.
   - `!c45(model)` — if the model is **not** in the full-prompt allow-list, it's lean.
   - `|| d45(model)` — even if `c45` says "full", a remote/clientData force-lean override
     (`isForcedLeanModel`) can still pull it back to lean.

**Why the `||` order:** `c45` (the static allow-list) is checked first because it is cheap and
covers the common case; `d45` (which reads `clientDataCache` and a GrowthBook gate) is the
escape hatch that lets Anthropic flip a specific model to lean **remotely** without shipping a
new build. The `||` means force-lean wins over "this model class normally gets full" — i.e.
`d45` can only *add* models to the lean set, never remove them.

---

## 2. The model-class allow-list: `isFullPromptModel` (`c45`)

```javascript
// ============================================
// isFullPromptModel - Static allow-list: true => model keeps the FULL prompt
// Location: cli_inner_pretty.js:143847-143862
// ============================================

// ORIGINAL (for source lookup):
function c45(H) {
  if (gM6(H)) return !1;
  let $ = O7(H);
  if (
    $.includes("claude-3-") ||
    $.includes("haiku") ||
    $.includes("sonnet") ||
    $ === "claude-opus-4-0" ||
    $ === "claude-opus-4-1" ||
    $ === "claude-opus-4-5" ||
    $ === "claude-opus-4-6" ||
    $ === "claude-opus-4-7"
  )
    return !0;
  if ($ === "claude-opus-4-8") return !1;
  return !UA();
}

// READABLE (for understanding):
function isFullPromptModel(model) {
  if (isEarlyAccessModel(model)) return false;        // -eap builds are lean-eligible
  const id = normalizeModelId(model);                 // canonical "claude-opus-4-8" etc.
  if (
    id.includes("claude-3-") ||                        // all Claude 3.x
    id.includes("haiku") ||                            // any Haiku
    id.includes("sonnet") ||                           // any Sonnet
    id === "claude-opus-4-0" ||
    id === "claude-opus-4-1" ||
    id === "claude-opus-4-5" ||
    id === "claude-opus-4-6" ||
    id === "claude-opus-4-7"                            // Opus 4.7-and-earlier
  )
    return true;                                        // => FULL prompt
  if (id === "claude-opus-4-8") return false;          // Opus 4.8 => LEAN
  return !isFirstPartyProvider();                       // unknown id: 1P/AWS/gateway => lean, others => full
}

// Mapping: c45→isFullPromptModel, gM6→isEarlyAccessModel, O7→normalizeModelId,
//          $→id, UA→isFirstPartyProvider
```

**How it works (step by step):**

1. **`-eap` bypass first** (cli_inner_pretty.js:143848). If `isEarlyAccessModel` matches, return
   `false` immediately — see §3. This is intentionally before normalization so an `-eap` suffix
   on *any* base model forces lean-eligibility.
2. **Normalize** (cli_inner_pretty.js:143849). `normalizeModelId` (`O7`) collapses dated /
   provider-prefixed / inference-profile ids down to a canonical form like `claude-opus-4-8`
   (see §6). All subsequent comparisons run on the canonical id.
3. **Substring class matches** (cli_inner_pretty.js:143851-143853): `claude-3-`, `haiku`, and
   `sonnet` are matched by `includes(...)`, so *every* dated variant and every tier of those
   families is caught (e.g. `claude-3-5-sonnet`, `claude-haiku-4-5`). These are exactly the
   families the changelog says keep the full prompt.
4. **Exact older-Opus matches** (cli_inner_pretty.js:143854-143858): `opus-4-0/4-1/4-5/4-6/4-7`
   are matched by `===` against the canonical id (not `includes`), so they precisely select
   "Opus 4.7 and earlier" without accidentally catching `opus-4-8`.
5. **Opus 4.8 explicit lean** (cli_inner_pretty.js:143861). `claude-opus-4-8` returns `false`
   ⇒ lean. This is the headline case: the current frontier first-party model defaults to lean.
6. **Unknown-id fallthrough** (cli_inner_pretty.js:143862): `return !UA()`. For any id that is
   neither a known family nor a known Opus, the answer depends on the **provider**:
   - first-party / anthropicAws / gateway (`UA()===true`) ⇒ `!true` = `false` ⇒ **lean**.
   - Bedrock / Vertex / Foundry / Mantle (`UA()===false`) ⇒ `!false` = `true` ⇒ **full**.

**Why the unknown-id provider split:** Anthropic ships new first-party models continuously and
wants them lean-by-default (they are presumed to be capable frontier models like Opus 4.8). But
third-party clouds (Bedrock/Vertex/Foundry/Mantle) may host older or customer-pinned model
snapshots whose ids Claude Code doesn't recognise; for those the safe default is the
full instruction set. So the fallthrough is "lean for our own endpoints, full for everyone
else's." See §4 for `isFirstPartyProvider`.

> **Note on return-value polarity:** `c45` returns `true` for *full*. `X3` negates it
> (`!c45(...)`). It is easy to misread `c45`'s name as "is this a lean model" — it is the
> opposite: "is this a model that should keep the **full** prompt."

---

## 3. The early-access bypass: `isEarlyAccessModel` (`gM6`)

```javascript
// ============================================
// isEarlyAccessModel - true if the model id carries an "-eap" early-access suffix
// Location: cli_inner_pretty.js:143836-143838
// ============================================

// ORIGINAL (for source lookup):
function gM6(H) {
  return /-eap($|\[)/i.test(H);
}

// READABLE (for understanding):
function isEarlyAccessModel(model) {
  // matches "...-eap" at end of string, or "...-eap[" (e.g. an "[1m]" context suffix)
  return /-eap($|\[)/i.test(model);
}

// Mapping: gM6→isEarlyAccessModel, H→model
```

**What it does:** Detects an `-eap` (early-access program) suffix on the *raw* model id. The
regex anchors `-eap` either at end-of-string (`$`) or immediately before a `[` — the latter
covers ids that carry a context-window suffix like `[1m]` (e.g. `...-eap[1m]`).

**Why it's checked before `normalizeModelId`:** `gM6` runs on the un-normalized id at the top of
`c45` (cli_inner_pretty.js:143848). Normalization would strip provider/date decoration and could
discard the `-eap` marker, so the check happens first. The effect: any early-access build is
**lean-eligible** regardless of which base family it is derived from. This lets Anthropic dogfood
the lean prompt on pre-release models without touching the static allow-list.

---

## 4. Provider classification: `isFirstPartyProvider` (`UA`) and `currentProvider` (`Zq`)

```javascript
// ============================================
// isFirstPartyProvider - true for Anthropic-operated endpoints (1P / anthropicAws / gateway)
// Location: cli_inner_pretty.js:91891-91893
// ============================================

// ORIGINAL (for source lookup):
function UA(H = Zq()) {
  return H === "firstParty" || H === "anthropicAws" || H === "gateway";
}

// READABLE (for understanding):
function isFirstPartyProvider(provider = currentProvider()) {
  return provider === "firstParty"
      || provider === "anthropicAws"
      || provider === "gateway";
}

// Mapping: UA→isFirstPartyProvider, Zq→currentProvider, H→provider
```

`currentProvider` (`Zq`) resolves the active provider from env, in priority order
(cli_inner_pretty.js:91853-91864): `CLAUDE_CODE_USE_BEDROCK` ⇒ `bedrock`,
`CLAUDE_CODE_USE_FOUNDRY` ⇒ `foundry`, `CLAUDE_CODE_USE_ANTHROPIC_AWS` ⇒ `anthropicAws`,
`CLAUDE_CODE_USE_MANTLE` ⇒ `mantle`, `CLAUDE_CODE_USE_VERTEX` ⇒ `vertex`, else `firstParty`.

So the "first-party set" used by the lean fallthrough is `{firstParty, anthropicAws, gateway}`,
and its complement (the "keep full for unknown ids" set) is `{bedrock, vertex, foundry, mantle}`.

> Contrast with `oR` at cli_inner_pretty.js:91894 (`{firstParty, anthropicAws, foundry, mantle}`)
> — a *different* provider-class predicate used elsewhere. Don't confuse the two; the lean gate
> specifically uses `UA`.

---

## 5. Why memoize: `memoize` (`v8`/`cx8`)

`X3` is wrapped in `v8`, which is lodash's `memoize` re-exported via the lazy module `W7`:

```javascript
// ============================================
// memoize - lodash memoize; caches result keyed by first arg (here: the model id)
// Location: cli_inner_pretty.js:1475-1486, 1492
// ============================================

// ORIGINAL (for source lookup):
function cx8(H, $) {
  if (typeof H != "function" || ($ != null && typeof $ != "function")) throw TypeError(Ey9);
  var q = function () {
    var K = arguments,
      _ = $ ? $.apply(this, K) : K[0],
      z = q.cache;
    if (z.has(_)) return z.get(_);
    var A = H.apply(this, K);
    return ((q.cache = z.set(_, A) || z), A);
  };
  return ((q.cache = new (cx8.Cache || C2H)()), q);
}
// ...
var W7 = T(() => { JI$(); cx8.Cache = C2H; v8 = cx8; });

// READABLE (for understanding):
function memoize(fn, keyResolver) {
  if (typeof fn != "function" || (keyResolver != null && typeof keyResolver != "function"))
    throw TypeError("Expected a function");
  const memoized = function () {
    const args = arguments;
    const key = keyResolver ? keyResolver.apply(this, args) : args[0]; // default key = first arg
    const cache = memoized.cache;
    if (cache.has(key)) return cache.get(key);                          // cache hit
    const result = fn.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;                   // store + return
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache)();
  return memoized;
}
// at module init: memoize = cx8  (v8 = cx8, cli_inner_pretty.js:1492)

// Mapping: cx8→memoize, v8→memoize (alias), H→fn, $→keyResolver, _→key, z→cache, A→result
```

**Default cache key = first argument**, i.e. the model id string. So `X3("claude-opus-4-8")`
runs the full `c45`/`d45` logic the first time and returns a cached boolean on every subsequent
call for the same id.

**Why this matters here:** `c45`/`d45` are not free — `c45` calls `O7` (string normalization +
regex), and `d45` reaches into `clientDataCache` and the `tengu_velvet_cascade` GrowthBook gate.
A single prompt build calls `X3` **many** times: in `N0` alone (§7) it gates `uXz`, `mXz`,
`rKq`, `iXz`, the `:L` section-key suffix, `fLz`, and the top-level section swap. With sub-section
helpers like `uXz` (555400), `mXz` (555415), `fLz` (555866), `rKq` (555874), **ten**
tool-description gates (Read 145357, WebFetch 206794, Glob 212030, Grep 212044, Write 212277,
WebSearch 216219, Todo 376251, Edit 434091, Bash 439086, agent-listing 240594), and per-turn
auto-mode/agent-listing checks (412891, 412988), the count is 16+ evaluations per turn (21
distinct `X3(` sites in the bundle — see §9 for the full inventory). Memoizing collapses all of
those to one real computation per distinct model id for the life of the process.

> **Subtle correctness note:** the cache is keyed only on the model id, but `X3` *also* reads
> `process.env.CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT` and (via `d45`) live caches. The env var is read
> at process start and not expected to change mid-session, so caching on the model id alone is safe
> in practice. If the env override or remote config changed at runtime, the memoized value for an
> already-seen model would be stale — an accepted trade-off given these inputs are effectively
> constant per process.

---

## 6. Model id normalization: `normalizeModelId` (`O7`)

```javascript
// ============================================
// normalizeModelId - resolve a raw/dated/inference-profile id to a canonical model id
// Location: cli_inner_pretty.js:98770-98778
// ============================================

// ORIGINAL (for source lookup):
function O7(H) {
  let $ = Gi$(H);
  if ($ !== H) return HD($);
  if (H.includes("application-inference-profile")) {
    let q = rm8(vP(H));
    if (q) return HD(q);
  }
  return HD($);
}

// READABLE (for understanding):
function normalizeModelId(model) {
  const aliased = resolveModelOverrideAlias(model);     // reverse-map a user modelOverride alias
  if (aliased !== model) return canonicalizeOpusModelId(aliased);
  if (model.includes("application-inference-profile")) {// Bedrock inference-profile ARN
    const resolved = extractProfileModelId(stripContextSuffix(model));
    if (resolved) return canonicalizeOpusModelId(resolved);
  }
  return canonicalizeOpusModelId(aliased);
}

// Mapping: O7→normalizeModelId, Gi$→resolveModelOverrideAlias, HD→canonicalizeOpusModelId,
//          rm8→extractProfileModelId, vP→stripContextSuffix, $→aliased, H→model
```

`O7` first reverse-resolves any user-configured model alias via `resolveModelOverrideAlias`
(`Gi$`, cli_inner_pretty.js:91967-91977 — it scans `settings.modelOverrides` for an entry whose
*value* equals the input and returns its key), then handles Bedrock
`application-inference-profile` ARNs, then funnels everything through `canonicalizeOpusModelId`
(`HD`, cli_inner_pretty.js:98751-98768). `HD` is a waterfall of `includes(...)` checks that maps
dated/decorated ids to canonical ids: `claude-opus-4-8`, `claude-opus-4-7`, ...,
`claude-sonnet-4-6`, `claude-haiku-4-5`, `claude-3-7-sonnet`, etc.; anything unrecognised has a
trailing `-YYYYMMDD` date stripped (`H.replace(/-\d{8}$/, "")`).

This is **why `c45` can use `===` for the Opus ids**: by the time the comparison runs, a dated id
like `claude-opus-4-8-20251101` (or a Bedrock ARN, or a user alias) has already been collapsed to
the bare `claude-opus-4-8`.

---

## 7. The force-lean override: `isForcedLeanModel` (`d45`)

```javascript
// ============================================
// isForcedLeanModel - remote/clientData escape hatch to force a model to lean
// Location: cli_inner_pretty.js:143839-143845
// ============================================

// ORIGINAL (for source lookup):
function d45(H) {
  let $ = O7(H),
    q = b$().clientDataCache?.simple_system_prompt;
  if (typeof q === "object" && q !== null && Object.entries(q).some(([_, z]) => z === !0 && $.includes(_))) return !0;
  let K = V$("tengu_velvet_cascade", null);
  if (typeof K !== "object" || K === null || !("models" in K) || !Array.isArray(K.models)) return !1;
  return K.models.some((_) => typeof _ === "string" && $.includes(_));
}

// READABLE (for understanding):
function isForcedLeanModel(model) {
  const id = normalizeModelId(model);

  // (a) clientData map: { "<modelSubstring>": true, ... }
  const clientMap = getClientConfig().clientDataCache?.simple_system_prompt;
  if (typeof clientMap === "object" && clientMap !== null &&
      Object.entries(clientMap).some(([key, on]) => on === true && id.includes(key)))
    return true;

  // (b) GrowthBook gate "tengu_velvet_cascade": { models: ["<substring>", ...] }
  const cascade = getFeatureGateValue("tengu_velvet_cascade", null);
  if (typeof cascade !== "object" || cascade === null ||
      !("models" in cascade) || !Array.isArray(cascade.models))
    return false;
  return cascade.models.some((m) => typeof m === "string" && id.includes(m));
}

// Mapping: d45→isForcedLeanModel, O7→normalizeModelId, b$→getClientConfig,
//          V$→getFeatureGateValue, $→id, q→clientMap, K→cascade, _/z→key/on
```

**Two independent remote sources, OR'd together:**

1. **`clientDataCache.simple_system_prompt`** (cli_inner_pretty.js:143841-143842): a map keyed by
   model substrings; an entry `{ "<sub>": true }` forces lean for any model whose canonical id
   *contains* `<sub>`. Substring `includes` (not `===`) makes this deliberately fuzzy — one entry
   like `"opus-4-9"` would cover all dated variants of a future model.
2. **`tengu_velvet_cascade` GrowthBook gate** (cli_inner_pretty.js:143843-143845): an object with a
   `models: string[]` array; any model whose canonical id contains a listed substring is forced
   lean. The shape is defensively validated (object, non-null, has `models`, is an array) before
   use; otherwise it returns `false`.

**Why two channels:** `clientDataCache` is server-pushed per-account data, while
`tengu_velvet_cascade` is a feature-gate experiment. Either can roll the lean prompt out to an
additional model **without a client release**. Combined with the `||` in `X3`, `d45` is purely
additive: it can move a model from full → lean, never the reverse. (To force full you must use
`CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT=0`, which is checked before `d45` even runs.)

---

## 8. Mapping the changelog phrasing to the code

> Changelog (CHANGELOG.md:12): *"The lean system prompt is now the default for all models
> except Haiku, Sonnet, and Opus 4.7 and earlier."*

The "except" list is exactly the `true`-returning branch of `isFullPromptModel`:

| Changelog phrase | Code (`c45`, cli_inner_pretty.js) |
|---|---|
| *Haiku* | `id.includes("haiku")` (143852) |
| *Sonnet* | `id.includes("sonnet")` (143853) |
| *Opus 4.7 and earlier* | `=== "claude-opus-4-0/4-1/4-5/4-6/4-7"` (143854-143858) + `claude-3-*` (143851) |
| (everything else = lean) | `opus-4-8` → false (143861); unknown 1P id → `!UA()` false (143862) |

> This is a **module doc, not a symbol index** — the table above maps *English changelog text*
> to code locations (allowed), it is **not** an obfuscated→readable symbol-mapping table.

So "all models except {Haiku, Sonnet, Opus 4.7-and-earlier}" is implemented as: full ⇔
`isFullPromptModel`, and the named exceptions are precisely the families/ids that make
`isFullPromptModel` return true. Confidence **HIGH** — direct line correspondence.

---

## 9. What flips when `X3` is true — the assembler `N0`

`X3` is consulted at 21 sites (`grep -c "X3("` ⇒ 21). The central consumer is the section
assembler `buildSystemPromptSections` (`N0`, cli_inner_pretty.js:555614-555658).

```javascript
// ============================================
// buildSystemPromptSections - chooses lean (1 section) vs full (6 sections); gates sub-sections
// Location: cli_inner_pretty.js:555614-555658
// ============================================

// ORIGINAL (for source lookup):
async function N0(H, $, q, K) {
  if (cKq()) return K?.excludeDynamicSections ? [] : [`CWD: ${C$()}\nDate: ${NlH()}`];
  let _ = X3($), z = _ ? ":L" : "", A = C$(), ... ;
  let w = [
    DE(`anti_verbosity${z}`, () => uXz($)),
    DE(`action_caution${z}`, () => mXz($)),
    DE(`investigate_first:${rKq($)}`, () => OLz($)),
    DE(`session_guidance${z}${j ? ":sdk" : ""}`, () => iXz(M, Y, _, j)),
    ...
    DE(`focus_mode${z}`, () => fLz($)),
    ...
  ], D = await uv7(w);
  return [
    ...(_ ? [oXz(f)]
          : [QXz(f), gXz(), (f === null || f.keepCodingInstructions === !0) ? dXz() : null, cXz($), lXz(M), rXz()]),
    ...(K?.excludeDynamicSections ? [RFK($)] : []),
    ...(WMH() ? [et] : []),
    ...D,
  ].filter((X) => X !== null);
}

// READABLE (for understanding):
async function buildSystemPromptSections(tools, model, extraDirs, opts) {
  if (isSimplePromptMode()) return opts?.excludeDynamicSections ? [] : [`CWD: ${cwd()}\nDate: ${sessionDate()}`];
  const lean = isLeanSystemPrompt(model);     // <-- THE gate
  const keySfx = lean ? ":L" : "";            // cache-key suffix distinguishes lean variants
  // ...dynamic sub-sections, several gated by lean via uXz/mXz/rKq/iXz/fLz...
  const dynamic = await resolveSections(sections);
  return [
    ...(lean
        ? [leanHarnessSection(outputStyle)]                                  // ONE compact section
        : [coreIdentitySection(outputStyle), toneSection(),                  // SIX full sections
           keepCoding ? codingInstructionsSection() : null,
           taskMgmtSection(model), toolUsageSection(enabledTools), envPolicySection()]),
    ...,
  ].filter((s) => s !== null);
}

// Mapping: N0→buildSystemPromptSections, cKq→isSimplePromptMode, X3→isLeanSystemPrompt,
//          _→lean, z→keySfx, oXz→leanHarnessSection, QXz/gXz/dXz/cXz/lXz/rXz→full sections
```

**The hard precedence:** `cKq()` (`CLAUDE_CODE_SIMPLE`, cli_inner_pretty.js:555588-555590,
returns `xH(process.env.CLAUDE_CODE_SIMPLE)`) is checked **before** `X3` at the very top of `N0`
(555615). `CLAUDE_CODE_SIMPLE` is the *radical* trim — it returns just a CWD/Date stub and skips
the whole builder. `X3`/lean is a milder trim that still emits a full "Harness" section plus
gated dynamic sections. Two distinct knobs:

```
CLAUDE_CODE_SIMPLE=1            → cKq() true   → CWD+Date only (drops all behavioral prompt)
CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT / model gate → X3 true → 1 "Harness" section + lean sub-sections
neither                        → X3 by model  → full or lean per model class
```

**Top-level swap** (cli_inner_pretty.js:555650-555657): lean ⇒ `[oXz(outputStyle)]` — the single
`leanHarnessSection` (cli_inner_pretty.js:555591-555607) opening `"You are an interactive agent that
helps users with software engineering tasks."`. Full ⇒ six sections
`QXz + gXz + (dXz?) + cXz + lXz + rXz`.

**`:L` cache-key suffix** (cli_inner_pretty.js:555623, used at 555630/555631/555633/555645): when
lean, section cache keys get a `:L` suffix so lean and full renders of the same section never
collide in the section cache.

**Sub-section flips driven by `X3`** (all verified):

- `uXz` anti-verbosity (cli_inner_pretty.js:555399-555400): lean returns the one-liner *"Write
  code that reads like the surrounding code..."*; full returns the long "# Text output" block.
- `mXz` action-caution (cli_inner_pretty.js:555414-555416): emitted **only** when lean
  (`if (!X3(H)) return null`).
- `fLz` focus-mode (cli_inner_pretty.js:555862-555866): lean ⇒ `YLz` (terser focus-mode text),
  full ⇒ `ALz` (longer focus-mode text), cli_inner_pretty.js:555896-555899.
- `rKq` investigate-first (cli_inner_pretty.js:555868-555876): for `claude-opus-4-7`, if `X3` is
  true the mode is forced `"off"` (555874) — lean models skip the investigate-first guidance.
- `z44` Todo tool description (cli_inner_pretty.js:376250-376251): lean ⇒ terse `Y0_` description,
  full ⇒ `f0_`.
- `W47` WebFetch tool description (cli_inner_pretty.js:206793-206796): lean ⇒ short description,
  full ⇒ long "IMPORTANT: WebFetch WILL FAIL..." description.
- `SFK` memory-section gate (cli_inner_pretty.js:145119-145124): `if (X3(H)) return !1` — a memory
  sub-behavior is suppressed for lean.
- `HR_` auto-mode classifier (cli_inner_pretty.js:412889-412893): lean models return `[]` (no
  `auto_mode` reminder injected).
- agent-listing delta (cli_inner_pretty.js:412988): `let j = X3(H.options.mainLoopModel)` —
  agent-listing reminder text varies by lean.
- memory-load prompt branch (cli_inner_pretty.js:145062): `if ($ && !_D() && X3(H)) {...}`.

The common thread: lean trims every sub-section to its tersest form and skips several entirely.

### Complete inventory of all 21 `X3(` call sites

The list above is a *representative* subset. For verifiability, here is the **full** mapping of
every one of the 21 `grep -c "X3("` hits to its category (each line was read directly; line
numbers are exact `X3(` call lines):

**(a) The central body swap + its cache key — in `N0`:**
- the section swap `_ = X3($)` (cli_inner_pretty.js:555622)
- *(the `:L` cache suffix at 555623 is derived from this single `_`, not a separate `X3(` call)*

**(b) System-prompt sub-sections (all driven by `X3`):**
- `uXz` anti-verbosity (cli_inner_pretty.js:555400)
- `mXz` action-caution, lean-only (cli_inner_pretty.js:555415)
- `fLz` focus-mode selector (cli_inner_pretty.js:555866)
- `rKq` investigate-first forced "off" (cli_inner_pretty.js:555874)
- `SFK` memory sub-behavior gate (cli_inner_pretty.js:145123)
- memory-load prompt branch `if ($ && !_D() && X3(H))` (cli_inner_pretty.js:145062)

**(c) Per-turn reminders / message attachments:**
- `HR_` auto-mode classifier returns `[]` under lean (cli_inner_pretty.js:412891)
- agent-listing reminder delta `let j = X3(H.options.mainLoopModel)` (cli_inner_pretty.js:412988)

**(d) Tool descriptions (ten total — full analysis in
[lean_vs_full_prompt_diff.md §4f](./lean_vs_full_prompt_diff.md)):**
- `z44` Todo (cli_inner_pretty.js:376251)
- `W47` WebFetch (cli_inner_pretty.js:206794)
- `gFK` Read (cli_inner_pretty.js:145357)
- `g97` Glob (cli_inner_pretty.js:212030)
- `OZ6` Grep (cli_inner_pretty.js:212044)
- `o97` Write (cli_inner_pretty.js:212277)
- `u57` WebSearch (cli_inner_pretty.js:216219)
- `gB_` Edit (cli_inner_pretty.js:434091)
- `d24` Bash (cli_inner_pretty.js:439086, returning the terse `IU_` body)
- `Uv6` Task/agent-listing tool description fed by `j = X3($)` (cli_inner_pretty.js:240594)

**(e) Two other lean-aware sites (not system-prompt, not tool-description):**
- `w08` eager-input-streaming cache key, prefix `"L:"` (cli_inner_pretty.js:555972)
- `tengu_cinder_plover` prompt-gate fragment in a command's `prompt({model})` builder
  (cli_inner_pretty.js:348818)

Count: (a) 1 + (b) 6 + (c) 2 + (d) 10 + (e) 2 = **21** — matching `grep -c "X3("`. So the
single memoized predicate fans out to exactly these 21 reads, and §9's earlier subset is the
illustrative slice, not the exhaustive list.

---

## 10. Distinct cousin: `isOpus46OrNewer` (`Wj`) — Fast Mode, not lean

It is tempting to conflate the lean gate with the opus-version membership test `Wj`
(cli_inner_pretty.js:98257-98263), because both special-case Opus 4.8. They are **unrelated**.

```javascript
// ============================================
// isOpus46OrNewer - Fast-Mode opus membership test (NOT the lean-prompt gate)
// Location: cli_inner_pretty.js:98257-98263
// ============================================

// ORIGINAL (for source lookup):
function Wj(H) {
  if (!I9()) return !1;
  let $ = H ?? wZ(), K = e7($).toLowerCase();
  if (ki()) return K.includes("opus-4-6");
  return K.includes("opus-4-6") || K.includes("opus-4-7") || K.includes("opus-4-8");
}

// READABLE (for understanding):
function isOpus46OrNewer(model) {
  if (!isFastModeAvailable()) return false;
  const id = (model ?? currentModelId()).toLowerCase().replace(/\[1m\]$/, "");
  if (isOpus46Override()) return id.includes("opus-4-6");
  return id.includes("opus-4-6") || id.includes("opus-4-7") || id.includes("opus-4-8");
}

// Mapping: Wj→isOpus46OrNewer, I9→isFastModeAvailable, wZ→currentModelId,
//          e7→parseUserSpecifiedModel, ki→isOpus46Override
```

Differences that matter:

- **Purpose:** `Wj` gates **Fast Mode** (it's called from `m76`, the per-session fast-mode
  predicate at cli_inner_pretty.js:98249-98255). `X3` gates the **lean system prompt**.
- **Polarity & set:** `Wj` is *opus-only* and includes 4.6/4.7/4.8; the lean gate *excludes*
  4.6/4.7 (they keep full) and includes only 4.8 plus unknown first-party ids.
- **Availability guard:** `Wj` returns false unless `isFastModeAvailable()` (`I9`); `X3` has no
  such guard.

Do not reuse one for the other. They merely share the Opus 4.x naming neighbourhood.

---

## 11. Cross-validation against v2.1.88 — this is NEW

The 2.1.88 readable source has `getSystemPrompt` (src/constants/prompts.ts:444-...). It contains
the **`CLAUDE_CODE_SIMPLE` short-circuit** (prompts.ts:450-454 — the precursor of `cKq()`):

```ts
// src/constants/prompts.ts:450-454 (v2.1.88)
if (isEnvTruthy(process.env.CLAUDE_CODE_SIMPLE)) {
  return [`You are Claude Code, ... \n\nCWD: ${getCwd()}\nDate: ${getSessionStartDate()}`]
}
```

But there is **no per-model lean/full branch** in 2.1.88: `getSystemPrompt` builds the same
`dynamicSections` + full identity sections for every model. A grep of the entire 2.1.88 `src/` for
`isLeanSystemPrompt`, `isFullPromptModel`, `isForcedLeanModel`, `isEarlyAccessModel`,
`velvet_cascade`, `simple_system_prompt`, and `SIMPLE_SYSTEM_PROMPT` returns **no matches** (the
only `-eap` hit is an unrelated API beta comment in services/api/claude.ts:472).

**Conclusion:** `X3`/`c45`/`d45`/`gM6` and the `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT` env override are
**NEW post-2.1.88** (introduced in the 2.1.154 window). Only the `CLAUDE_CODE_SIMPLE` hard
short-circuit (`cKq`) has a 2.1.88 precursor. Confidence **HIGH**.

---

## 12. ASCII truth table — model → lean/full → reason

Assumes `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT` is unset and `CLAUDE_CODE_SIMPLE` is unset
(otherwise those short-circuit first; see §1 and §9). "Lean" = `X3(model)` true.

```
 canonical model id          | provider class        | X3   | reason (cli_inner_pretty.js)
 ----------------------------+-----------------------+------+--------------------------------------------
 claude-3-5-sonnet           | any                   | FULL | id.includes("claude-3-") / "sonnet"  143851/853
 claude-3-5-haiku            | any                   | FULL | id.includes("claude-3-") / "haiku"   143851/852
 claude-haiku-4-5            | any                   | FULL | id.includes("haiku")                 143852
 claude-sonnet-4-6           | any                   | FULL | id.includes("sonnet")                143853
 claude-opus-4-0/4-1/4-5     | any                   | FULL | exact === older-opus                 143854-856
 claude-opus-4-6             | any                   | FULL | === "claude-opus-4-6"                143857
 claude-opus-4-7             | any                   | FULL | === "claude-opus-4-7"                143858
 claude-opus-4-8             | any                   | LEAN | === "claude-opus-4-8" → false        143861
 <anything>-eap[...]         | any                   | LEAN | isEarlyAccessModel bypass            143848/836
 <unknown id>                | firstParty            | LEAN | !UA() == !true == false             143862
 <unknown id>                | anthropicAws          | LEAN | !UA() == false                      143862
 <unknown id>                | gateway               | LEAN | !UA() == false                      143862
 <unknown id>                | bedrock               | FULL | !UA() == !false == true             143862
 <unknown id>                | vertex                | FULL | !UA() == true                       143862
 <unknown id>                | foundry               | FULL | !UA() == true                       143862
 <unknown id>                | mantle                | FULL | !UA() == true                       143862
 <any model in              )| any                   | LEAN | isForcedLeanModel via clientData    143842
  clientData.simple_system_  |                       |      |  or tengu_velvet_cascade            143845
  prompt OR velvet_cascade) -+-----------------------+------+--------------------------------------------
 (empty / no model)          | n/a                   | FULL | if (!H) return false                 143873
```

Env overrides (checked before the table):

```
 CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT = 1/true/yes/on   → LEAN  (xH, 143874)
 CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT = 0/false/no/off  → FULL  (k4, 143875)
 CLAUDE_CODE_SIMPLE              = 1/true/yes/on     → CWD+Date only, builder skipped (cKq, 555588/555615)
```

---

## 13. End-to-end flow diagram

```
  buildSystemPromptSections(N0)              other 20 X3 call sites (full list: §9)
  (cli_inner_pretty.js:555614)               (uXz 555400, mXz 555415, fLz 555866, rKq 555874,
        |                                     SFK 145123, memory 145062; HR_ 412891, agent 412988;
        |                                     tool descs: gFK 145357, W47 206794, g97 212030,
        | cKq()? --yes--> [CWD+Date] (stop)   OZ6 212044, o97 212277, u57 216219, Uv6 240594,
        |                                     z44 376251, gB_ 434091, d24 439086;
        |                                     w08 555972, cinder_plover 348818)
        | no                                          |
        v                                             v
  +----------------------------- X3(model) = isLeanSystemPrompt -----------------------------+
  |                                                                                          |
  |  if !model                       -> FULL                              (143873)           |
  |  if env SIMPLE_SYSTEM_PROMPT==T  -> LEAN                              (143874, xH)        |
  |  if env SIMPLE_SYSTEM_PROMPT==F  -> FULL                              (143875, k4)        |
  |  return !c45(model) || d45(model)                                    (143876)            |
  |              |               \                                                            |
  |              |                \__ d45: clientData.simple_system_prompt (143842)           |
  |              |                     OR tengu_velvet_cascade.models     (143845) -> +LEAN   |
  |              v                                                                            |
  |   c45(model) = isFullPromptModel                                     (143847)            |
  |     gM6(model)? -eap          -> false (=> lean)                     (143848, 143836)     |
  |     O7(model) -> canonical id  (normalizeModelId)                    (143849, 98770)      |
  |       claude-3-* / haiku / sonnet / opus-4-0..4-7  -> true (=> FULL) (143851-858)         |
  |       opus-4-8                                     -> false(=> lean) (143861)             |
  |       else                                         -> !UA()         (143862, 91891)      |
  |               firstParty/anthropicAws/gateway -> lean ; others -> full                    |
  +------------------------------------------------------------------------------------------+
        |                                              memoized by model id (v8/cx8, 1475)
        v
   lean? [oXz Harness]   :   [QXz gXz dXz? cXz lXz rXz]   (555650-555657)
```

---

## 14. Why this design (decision analysis)

**What it does:** Picks a system prompt size class per model with three layers of control —
static allow-list, remote force-lean, and env override — all behind one memoized predicate.

**Why a single predicate consumed at 21 sites instead of branching once:** Centralising the
decision in `X3` means the lean/full choice is *consistent* across the top-level section swap
**and** every sub-section and tool-description variant. If each call site re-derived "is this
lean?" independently, they could drift (e.g. lean Harness section but a full WebFetch description).
A single memoized function guarantees one coherent answer per model per process.

**Why an allow-list of full models (`c45`) rather than a lean allow-list:** The set of models that
*need* the verbose prompt is small and stable (older/less-capable families: Haiku, Sonnet, Opus
≤4.7, Claude 3.x). The set of models that *should* be lean is open-ended and grows over time
(every new frontier first-party model). Encoding "full = this finite list, lean = everything else
first-party" means new models are lean **by default** with no code change — exactly what the
unknown-id fallthrough `!UA()` achieves.

**Why the remote `d45` channel:** Even with the allow-list, Anthropic wants to flip individual
models to lean mid-flight (A/B rollout, capability re-assessment). `clientDataCache` and the
`tengu_velvet_cascade` gate provide that without a client release, and the `||` placement keeps it
additive-only so a bad config can never accidentally *remove* the full prompt from a weak model.

**Why memoize:** Pure trade-off of memory for CPU. The inputs are effectively constant per process
(model id, env, server-pushed config), the function is called 16+ times per turn, and each call
otherwise runs string normalization + regex + cache/gate lookups. One Map entry per model id is
negligible; the saved recomputation across a long session is not.

**Trade-off accepted:** memoization keys on the model id only, so a mid-session change to the env
override or remote config would not invalidate an already-cached answer. Given those inputs don't
change at runtime in practice, this is the right simplicity/correctness balance.

**Key insight:** `X3` is *not* "is this a weak model." It is "should we trust this model to behave
well from terse guidance." Opus 4.8 and unknown first-party (frontier) models are trusted ⇒ lean
to save tokens/context; older or third-party-hosted-unknown models are not ⇒ keep the full
instruction set. The lean prompt is a **token-economy bet on model capability**, gated by a list
that is intentionally easy to *add* lean models to (default-lean fallthrough + remote override) and
deliberately conservative about *removing* the full prompt (empty model, unknown third-party, and
explicit `=0` all keep full).
