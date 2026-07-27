# The model registry rewrite: imperative camelCase objects → a declarative snake_case catalogue

> **Type/version:** STRUCTURAL REWRITE, **not announced in any changelog bullet** in the
> `.195`…`.220` window. This is the single largest undocumented change in the window.
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
> (`VERSION 2.1.220`, build `4073f595`). Every `cli_inner_pretty.js:<line>` is a **220** line
> unless tagged **(193)**.

---

## TL;DR

In 2.1.193 every model was a hand-written camelCase JavaScript object literal holding **only provider
ids** (`cli_inner_pretty.js:95560-95724 (193)`), and every other per-model fact — context window,
max output tokens, pricing, capability support, display name — lived in *separate scattered
imperative predicates* elsewhere in the bundle.

In 2.1.220 all of it is one **declarative, zod-validated, snake_case data blob**:
`cli_inner_pretty.js:14008-14496`, 17 model entries plus a pricing-tier table, an alias table, a
`latest_per_family` map, `best`, and an (empty) `alias_migration` map. Its own leading `"//"` key
states the contract:

```
"Hand-maintained baked-in model catalog — the source of truth for per-model provider IDs and
 metadata. On model launch add one entry to `models` below; `bun run generate:model-catalog`
 validates this file against the schema and formats it."      (:14009)
```

Delta proof — every one of these literals is **220>0 / 193=0**:

| Literal | 220 | 193 |
|---|---|---|
| `provider_ids` | 22 | **0** |
| `knowledge_cutoff` | 16 | **0** |
| `advisor_rank` | 12 | **0** |
| `vertex_region_env_var` | 19 | **0** |
| `supports_1m_suffix` | 13 | **0** |
| `native_1m` | 11 | **0** |
| `latest_per_family` | 4 | **0** |
| `alias_migration` | 4 | **0** |
| `per_provider` | 4 | **0** |
| `anthropic_google_cloud` | 20 | **0** |
| `tier_5_25` / `tier_10_50` / `tier_3_15` | 6 / 3 / 7 | **0 / 0 / 0** |
| `opus_5_prompt_bundle` | 2 | **0** |
| `lean_prompt` | 4 | **0** |
| `per_turn_effort` | 4 | **0** |
| `rejects_disabled_thinking` | 2 | **0** |
| `fable_5_mitigations` | 2 | **0** |

The old camelCase shape did **not** disappear: it is now *derived* from the catalogue by an adapter
(`:100171-100198`) so that ~100 pre-existing call sites keep working. That adapter, and the two
`throw` statements guarding it, are the most informative 30 lines in the whole module.

---

## 1. Before: 2.1.193's imperative per-model objects

Each model was its own `var`, assigned inside one giant IIFE. Opus 4.8 (`iMr`) verbatim:

```javascript
// ============================================
// OPUS_4_8_PROVIDER_CONFIG - 2.1.193's hand-written per-model provider object
// Location: cli_inner_pretty.js:95695-95704 (193)
// ============================================

// ORIGINAL (for source lookup):
(iMr = {
  firstParty: "claude-opus-4-8",
  bedrock: "us.anthropic.claude-opus-4-8",
  vertex: "claude-opus-4-8",
  foundry: "claude-opus-4-8",
  anthropicAws: "claude-opus-4-8",
  mantle: "anthropic.claude-opus-4-8",
  gateway: "claude-opus-4-8",
  eagerInputStreaming: { bedrock: !0, vertex: !0 },
}),

// READABLE (for understanding):
const OPUS_4_8_PROVIDER_CONFIG = {
  firstParty: "claude-opus-4-8",
  bedrock: "us.anthropic.claude-opus-4-8",
  vertex: "claude-opus-4-8",
  foundry: "claude-opus-4-8",
  anthropicAws: "claude-opus-4-8",
  mantle: "anthropic.claude-opus-4-8",
  gateway: "claude-opus-4-8",
  eagerInputStreaming: { bedrock: true, vertex: true },
};

// Mapping: iMr→OPUS_4_8_PROVIDER_CONFIG
```

They were then collected into a key→object map, `Kc` at `:95725-95740 (193)`, with **14** entries
(`haiku35 … opus48, fable5`), and three derived structures: `qWs = ["opus48","opus47","opus46","opus45"]`
(`:95741 (193)`), `zWs` (all first-party ids, `:95742 (193)`) and `whn` (first-party id → key,
`:95743 (193)`).

Note what is **absent** from the 193 objects: no window, no max output, no pricing, no capabilities,
no display name, no knowledge cutoff. Those lived in scattered predicates that each re-enumerated
model ids by hand — the pattern that survives in vestigial form in §6.

### 1.1 Two clean before/after pairs: the metadata *was* imperative

The most legible measurement of the rewrite is a pair of functions that each collapsed from a
nine-branch `if/else-if` ladder to a single field read.

**Knowledge cutoff — 193's ladder became one line.**

```javascript
// ============================================
// getKnowledgeCutoff - 193's 9-branch ladder vs 220's single catalogue read
// Location: cli_inner_pretty.js:507907-507909  (was :592952-592964 (193))
// ============================================

// ORIGINAL (2.1.193, for source lookup) — :592952-592964 (193):
function N2o(e) {
  let t = to(e);
  if (t === "claude-fable-5" || t === "claude-mythos-5") return "January 2026";
  if (t === "claude-opus-4-8") return "January 2026";
  else if (t === "claude-opus-4-7") return "January 2026";
  else if (t === "claude-sonnet-4-6") return "August 2025";
  else if (t === "claude-opus-4-6") return "May 2025";
  else if (t === "claude-opus-4-5") return "May 2025";
  else if (t === "claude-haiku-4-5") return "February 2025";
  else if (t === "claude-opus-4-0" || t === "claude-opus-4-1" || t === "claude-sonnet-4-0" || t === "claude-sonnet-4-5")
    return "January 2025";
  return null;
}

// ORIGINAL (2.1.220, for source lookup) — :507907-507909:
function _qs(e) {
  return ww(lo(e))?.knowledge_cutoff ?? null;
}

// READABLE (for understanding):
function getKnowledgeCutoff(model) {
  return lookupById(normaliseToCatalogueId(model))?.knowledge_cutoff ?? null;
}

// Mapping: N2o (193)→_qs (220)→getKnowledgeCutoff, to (193)/lo (220)→normaliseToCatalogueId,
//          ww→lookupById
```

Both feed the `# Environment` system-prompt block (193 `:592949`, 220 `:507904`). Adding Sonnet 5 and
Opus 5 in 193's shape would have meant editing this ladder *and* the provider object *and* the
max-output ladder *and* the pricing table; in 220 it is `knowledge_cutoff: "May 2026"` at `:14368`.

**Max output tokens — the residue is the tell.**

```javascript
// ============================================
// getMaxOutputTokens - the catalogue read plus the pre-catalogue residue
// Location: cli_inner_pretty.js:150296-150310  (was :134799-134827 (193))
// ============================================

// ORIGINAL (2.1.220, for source lookup):
function lst(e) {
  let t,
    r,
    n = lo(e),
    o = ww(n)?.max_output_tokens;
  if (o) ((t = o.default), (r = o.upper));
  else if (n === "claude-3-opus" || n === "claude-3-haiku") ((t = 4096), (r = 4096));
  else if (n === "claude-3-sonnet") ((t = 8192), (r = 8192));
  else ((t = Mxg), (r = Oxg));
  let i = Fxg(n);
  if (i !== null) t = Math.min(i, r);
  let s = dZc(e);
  if (s?.max_tokens && s.max_tokens >= 4096) ((r = s.max_tokens), (t = Math.min(t, r)));
  return { default: t, upperLimit: r };
}

// READABLE (for understanding):
function getMaxOutputTokens(model) {
  let dflt, upper;
  const id = normaliseToCatalogueId(model);
  const fromCatalogue = lookupById(id)?.max_output_tokens;
  if (fromCatalogue) ({ default: dflt, upper } = fromCatalogue);        // 1. catalogue
  else if (id === "claude-3-opus" || id === "claude-3-haiku") (dflt = 4096, upper = 4096);   // 2. residue:
  else if (id === "claude-3-sonnet") (dflt = 8192, upper = 8192);       //    ids NOT in the catalogue
  else (dflt = DEFAULT_MAX_OUTPUT, upper = UPPER_MAX_OUTPUT);           // 3. 32000 / 128000
  const envCap = maxOutputTokensFromEnv(id);                           // CLAUDE_CODE_MAX_OUTPUT_TOKENS
  if (envCap !== null) dflt = Math.min(envCap, upper);
  const serverRow = serverModelRowFor(model);
  if (serverRow?.max_tokens && serverRow.max_tokens >= 4096)            // 4. server-pushed raise
    (upper = serverRow.max_tokens, dflt = Math.min(dflt, upper));
  return { default: dflt, upperLimit: upper };
}

// Mapping: lst→getMaxOutputTokens, lo→normaliseToCatalogueId, ww→lookupById,
//          Mxg→DEFAULT_MAX_OUTPUT (32000, :150316), Oxg→UPPER_MAX_OUTPUT (128000, :150317),
//          Fxg→maxOutputTokensFromEnv, dZc→serverModelRowFor
```

2.1.193's `aIe` (`:134799-134827 (193)`) had the same tail (`Jfd`/`Zgi` env-and-server clamps at
`:134822-134825 (193)`) but **nine** hard-coded model branches at `:134803-134820 (193)`. In 220 six
of the nine are gone — replaced by the catalogue read at `:150300` — and exactly three survive:
`claude-3-opus`, `claude-3-sonnet`, `claude-3-haiku`. Those three ids are **not in the catalogue**
(compare `csc`, `:86580-86598`) yet still appear in the `YO` normaliser's substring ladder
(`:111136-111138`) and in a legacy-remap allow-list. So the residue is not laziness: it is exactly
the set of ids the catalogue deliberately omits but the normaliser can still produce.

The ordering here also encodes the precedence the whole module uses: **catalogue → hard-coded residue
→ constant floor → env clamp → server raise**. The env var can only *lower* the default
(`Math.min(envCap, upper)`), while a server row can *raise* the upper limit — and only above 4096, so
a malformed or zero `max_tokens` from the server is ignored rather than clamping output to nothing.

---

## 2. After: the catalogue blob

`Skl`, assigned inside the lazy module initialiser `bkl` at `:14007-14497`, is a plain object with
eight top-level keys:

| Key | Line | Shape |
|---|---|---|
| `"//"` | `:14009` | the hand-maintenance contract string |
| `schema_version` | `:14010` | `1` |
| `pricing_tiers` | `:14011-14025` | 6 named rate tables |
| `models` | `:14026-14460` | 17 entries |
| `aliases` | `:14461-14486` | `opus` / `sonnet` / `haiku` / `fable`, each `{default, per_provider?}` |
| `defaults` | `:14487` | `{}` (empty) |
| `best` | `:14488` | `"fable"` |
| `latest_per_family` | `:14489-14494` | fable/opus/sonnet/haiku → newest id |
| `alias_migration` | `:14495` | `{}` (empty) |

### 2.1 The 17 entries and where they start

```
14028 claude-3-5-haiku    14048 claude-haiku-4-5    14070 claude-3-5-sonnet   14089 claude-3-7-sonnet
14108 claude-sonnet-4-0   14130 claude-sonnet-4-5   14153 claude-sonnet-4-6   14177 claude-sonnet-5
14215 claude-opus-4-0     14236 claude-opus-4-1     14257 claude-opus-4-5     14280 claude-opus-4-6
14304 claude-opus-4-7     14330 claude-opus-4-8     14365 claude-opus-5       14402 claude-fable-5
14439 claude-mythos-5
```

A full entry (Opus 4.8, `:14330-14363`) carries: `id`, `family`, `display_name`, `knowledge_cutoff`,
8 `provider_ids`, `eager_input_streaming`, `vertex_region_env_var`, `fallback_3p`, `context`,
`max_output_tokens`, `pricing`, `capabilities`, `default_effort`, `image_limits`, `advisor_rank`.

### 2.2 The pricing tiers

```javascript
// ORIGINAL (verbatim, :14011-14025):
pricing_tiers: {
  tier_3_15:  { input: 3,   output: 15, cache_write_5m: 3.75,  cache_write_1h: 6,  cache_read: 0.3,  web_search: 0.01 },
  tier_5_25:  { input: 5,   output: 25, cache_write_5m: 6.25,  cache_write_1h: 10, cache_read: 0.5,  web_search: 0.01 },
  tier_15_75: { input: 15,  output: 75, cache_write_5m: 18.75, cache_write_1h: 30, cache_read: 1.5,  web_search: 0.01 },
  tier_10_50: { input: 10,  output: 50, cache_write_5m: 12.5,  cache_write_1h: 20, cache_read: 1,    web_search: 0.01 },
  haiku_35:   { input: 0.8, output: 4,  cache_write_5m: 1,     cache_write_1h: 1.6, cache_read: 0.08, web_search: 0.01 },
  haiku_45:   { input: 1,   output: 5,  cache_write_5m: 1.25,  cache_write_1h: 2,  cache_read: 0.1,  web_search: 0.01 },
}
```

The names encode the input/output dollars-per-Mtok pair, and the derived numbers are consistent:
`cache_write_5m = 1.25 × input`, `cache_write_1h = 2 × input`, `cache_read = 0.1 × input`. Only
`web_search` is a flat $0.01 per request across every tier. Naming the tier rather than inlining six
numbers per entry is what makes the "one entry per model launch" contract at `:14009` actually cheap
to honour — a new model at an existing price point adds one string.

---

## 3. The schema, the parse, and the failure mode

### Catalogue validation and the empty-catalogue fallback

**What it does:** parses the hand-written blob against a zod schema exactly once, memoised, and
**silently substitutes an empty catalogue** if validation fails.

```javascript
// ============================================
// getModelCatalogue - memoised, validated accessor for the whole catalogue
// Location: cli_inner_pretty.js:14644-14657
// ============================================

// ORIGINAL (for source lookup):
(W8m = {
  schema_version: 0,
  pricing_tiers: {},
  models: [],
  aliases: {},
  defaults: {},
  latest_per_family: {},
  alias_migration: {},
}),
(PFr = Vr(() => {
  let e = G8m().safeParse(Skl);
  return e.success ? e.data : W8m;
})),
(yQ = PFr));

// READABLE (for understanding):
const EMPTY_CATALOGUE = {
  schema_version: 0, pricing_tiers: {}, models: [], aliases: {},
  defaults: {}, latest_per_family: {}, alias_migration: {},
};
const getModelCatalogue = memoise(() => {
  const parsed = catalogueSchema().safeParse(BAKED_CATALOGUE);
  return parsed.success ? parsed.data : EMPTY_CATALOGUE;
});

// Mapping: W8m→EMPTY_CATALOGUE, PFr/yQ→getModelCatalogue, G8m→catalogueSchema,
//          Skl→BAKED_CATALOGUE, Vr→memoise
```

**How it works:**
1. `G8m()` (`:14630-14643`) is the top-level schema. Every collection field has a `.default({})` /
   `v.array(...)` so a missing key parses rather than throwing.
2. Every object in the schema is `.loose()` (`:14547`, `:14559`, `:14625`, `:14629`, `:14642`) — i.e.
   unknown keys are **preserved, not stripped**. That is deliberate: a server-pushed or
   newer-than-client catalogue can carry fields this build does not know about without being
   mangled.
3. `safeParse` + fallback means a malformed catalogue does **not** crash the CLI. It degrades to
   `models: []`.
4. `Vr` memoises, so the parse runs once per process.

**Why this approach:**
- **`safeParse` over `parse`.** A `throw` here would be unrecoverable: the catalogue is read during
  module initialisation, before any error UI exists. Degrading to empty keeps the process alive.
- **But the degradation is brutal and silent.** With `models: []`, `ww()` returns `undefined` for
  every id, so *every* capability probe falls through to its optimistic provider default (§5), the
  legacy adapter `NZh()` (§4) throws on its first iteration, and `Oig()` (`:109742`) produces an
  empty cost table. There is no telemetry event on the failure branch. Since the blob is baked into
  the bundle and validated at build time by `bun run generate:model-catalog` (`:14009`), the branch
  is expected to be unreachable in a shipped build — the fallback is insurance against a *future*
  dynamic catalogue source, not against the baked one.
- **Trade-off accepted:** unreachable-in-practice error handling that would be very hard to debug if
  it ever fired.

### Two derived indexes, one of which can throw

```javascript
// ============================================
// buildProviderIdIndex - reverse index from every provider id to its canonical catalogue id
// Location: cli_inner_pretty.js:14663-14674
// ============================================

// ORIGINAL (for source lookup):
(V8m = Vr(() => {
  let e = new Map();
  for (let t of yQ().models)
    for (let r of Object.values(t.provider_ids)) {
      if (typeof r !== "string") continue;
      let n = r.toLowerCase(),
        o = e.get(n);
      if (o !== void 0 && o !== t.id) throw Error("model catalog: provider id collision across distinct entries");
      e.set(n, t.id);
    }
  return e;
}));

// READABLE (for understanding):
const buildProviderIdIndex = memoise(() => {
  const index = new Map();
  for (const entry of getModelCatalogue().models)
    for (const providerId of Object.values(entry.provider_ids)) {
      if (typeof providerId !== "string") continue;         // skips the `null` provider slots
      const key = providerId.toLowerCase();
      const existing = index.get(key);
      if (existing !== undefined && existing !== entry.id)
        throw Error("model catalog: provider id collision across distinct entries");
      index.set(key, entry.id);
    }
  return index;
});

// Mapping: V8m→buildProviderIdIndex, yQ→getModelCatalogue, Vr→memoise
```

Its sibling `q8m` (`:14658-14662`) is the trivial `id → entry` map. The two are exposed as
`ww(id)` (`:14508-14510`) and `MFr(providerId)` (`:14505-14507`).

**Why a throw here but a fallback there?** A provider-id collision is a *data authoring bug* that
would make routing ambiguous — e.g. two entries both claiming `us.anthropic.claude-opus-5`. Routing
the wrong model is worse than crashing, and unlike the schema failure this one is detectable by the
build-time generator, so a loud failure is the correct signal. Note the guard is `existing !== entry.id`,
not merely `existing !== undefined`: the *same* entry may legitimately repeat an id across provider
slots (Opus 4.6's `vertex`, `foundry`, `anthropic_aws`, `anthropic_google_cloud` and `gateway` are
all the bare `"claude-opus-4-6"`, `:14287-14292`), and that must not trip the collision check.

---

## 4. The compatibility adapter: how ~100 old call sites survived

The rewrite did not touch consumers. Instead, the **old camelCase map is regenerated from the new
catalogue at startup**.

```javascript
// ============================================
// catalogueEntryToLegacyProviderConfig / buildLegacyModelConfigMap / assertNo3pNulls
// Location: cli_inner_pretty.js:100171-100207
// ============================================

// ORIGINAL (for source lookup):
function $Zh(e) {
  let t = e.provider_ids,
    r = {
      firstParty: t.first_party,
      bedrock: t.bedrock ?? null,
      vertex: t.vertex ?? null,
      foundry: t.foundry ?? null,
      anthropicAws: t.anthropic_aws ?? null,
      anthropicGoogleCloud: t.anthropic_google_cloud ?? null,
      mantle: t.mantle ?? null,
      gateway: t.gateway ?? t.first_party,
    };
  if (e.eager_input_streaming) r.eagerInputStreaming = e.eager_input_streaming;
  return r;
}
function NZh() {
  let e = {};
  for (let [t, r] of Object.entries(OZh)) {
    let n = ww(t);
    if (!n)
      throw new Lr(
        `model catalog missing entry for '${t}' (CATALOG_ID_TO_KEY key '${r}')`,
        "model catalog missing entry for CATALOG_ID_TO_KEY id",
      );
    e[r] = $Zh(n);
  }
  return e;
}
function QK(e) {
  for (let t of ["bedrock", "vertex", "foundry", "anthropicAws"])
    if (e[t] === null)
      throw new Lr(
        `named CLAUDE_*_CONFIG export for '${e.firstParty}' has null ${t}`,
        "named model config export has null 3P provider id",
      );
  return e;
}

// READABLE (for understanding):
function catalogueEntryToLegacyProviderConfig(entry) {
  const ids = entry.provider_ids;
  const legacy = {
    firstParty: ids.first_party,
    bedrock: ids.bedrock ?? null,
    vertex: ids.vertex ?? null,
    foundry: ids.foundry ?? null,
    anthropicAws: ids.anthropic_aws ?? null,
    anthropicGoogleCloud: ids.anthropic_google_cloud ?? null,
    mantle: ids.mantle ?? null,
    gateway: ids.gateway ?? ids.first_party,       // <-- gateway defaults to the 1P id
  };
  if (entry.eager_input_streaming) legacy.eagerInputStreaming = entry.eager_input_streaming;
  return legacy;
}

function buildLegacyModelConfigMap() {
  const map = {};
  for (const [catalogueId, shortKey] of Object.entries(CATALOG_ID_TO_KEY)) {
    const entry = lookupById(catalogueId);
    if (!entry)
      throw new TaggedError(
        `model catalog missing entry for '${catalogueId}' (CATALOG_ID_TO_KEY key '${shortKey}')`,
        "model catalog missing entry for CATALOG_ID_TO_KEY id",
      );
    map[shortKey] = catalogueEntryToLegacyProviderConfig(entry);
  }
  return map;
}

function assertNo3pNulls(legacyConfig) {
  for (const provider of ["bedrock", "vertex", "foundry", "anthropicAws"])
    if (legacyConfig[provider] === null)
      throw new TaggedError(
        `named CLAUDE_*_CONFIG export for '${legacyConfig.firstParty}' has null ${provider}`,
        "named model config export has null 3P provider id",
      );
  return legacyConfig;
}

// Mapping: $Zh→catalogueEntryToLegacyProviderConfig, NZh→buildLegacyModelConfigMap,
//          QK→assertNo3pNulls, OZh→CATALOG_ID_TO_KEY, ww→lookupById, Lr→TaggedError
```

`OZh` (`CATALOG_ID_TO_KEY`, `:100218-100235`) is the 16-row bridge table
(`"claude-opus-5": "opus5"` at `:100233`, `"claude-sonnet-5": "sonnet5"` at `:100226`), and
`Ul = NZh()` at `:100236` is the regenerated equivalent of 193's `Kc`. The three derived structures
are regenerated too: `i4i = ["opus5","opus48","opus47","opus46","opus45"]` (`:100264`, was
`qWs` without `opus5`), `_bc` (`:100265`), `f_e` (`:100266`).

### Why regenerate the old shape instead of migrating the consumers?

**How it works:** the snake_case catalogue is the single authoring surface; a 15-line adapter
projects it back into the shape ~100 existing call sites already expect (`Km()[...]`,
`QQ(providerId)`, `pGr(provider)`).

**Why this approach:**
- **Blast radius.** `Km()` (`= NZh`'s memoised accessor, called 43 times) and `QQ()` reach into
  request construction, telemetry, the picker, cost accounting, and the Bedrock inference-profile
  resolver. Rewriting all of them in one release would risk exactly the class of provider-routing
  regressions this window is full of.
- **`gateway: t.gateway ?? t.first_party`** is a behavioural decision hidden in the adapter: the
  catalogue may leave `gateway` null, and the adapter then serves the first-party id. Every entry in
  this build sets `gateway` explicitly except `claude-mythos-5` (`:14451`, null) — so the fallback is
  live only for Mythos.
- **`Lr` (a tagged error) rather than a silent skip** in `NZh`: if the bridge table names an id the
  catalogue lost, the two structures would drift silently and the CLI would send a wrong model id.
  Fail fast.
- **Trade-off:** two representations of the same data now exist at runtime, and a reader must know
  that `Ul`/`Km()` is *derived*, not authoritative. The 193 tree's names (`Kc`, `zWs`) do not
  transfer — the ids are re-mangled.

**Key insight:** `assertNo3pNulls` (`QK`) is the tell that explains Mythos 5. It is applied to each
*named* export (`:100237-100252`) and throws if any of `bedrock`/`vertex`/`foundry`/`anthropicAws` is
null. `claude-mythos-5`'s catalogue entry sets **all** provider ids to null (`:14443-14452`), so it
could never pass `QK` — which is why it is absent from `OZh` and instead hand-written as a
camelCase literal with **full** provider ids at `:100253-100263`.

---

## 5. `claude-mythos-5`: the model the catalogue disowns

Open question 3 in the ground truth. The answer is a two-sided contradiction inside one build.

| | Catalogue entry `:14439-14459` | Legacy literal `ybc` `:100253-100263` |
|---|---|---|
| `bedrock` | `null` (`:14445`) | `"us.anthropic.claude-mythos-5"` (`:100255`) |
| `vertex` / `foundry` | `null` (`:14446-14447`) | `"claude-mythos-5"` (`:100256-100257`) |
| `anthropic_aws` | `null` (`:14448`) | `"claude-mythos-5"` (`:100258`) |
| `mantle` | `null` (`:14450`) | `"anthropic.claude-mythos-5"` (`:100260`) |
| `gateway` | `null` (`:14451`) | `"claude-mythos-5"` (`:100261`) |
| `capabilities` | `[]` (`:14456`) | n/a |
| in the key→config map? | no (`OZh`, `:100218-100235`) | no (only used at `:109853`) |

**This asymmetry is carryover, not new.** In 2.1.193 the same split existed: `VWs` at `:95715-95724 (193)`
is a full camelCase Mythos config, and it is likewise **excluded** from `Kc` (`:95725-95740 (193)`).
So "Mythos is defined but not registered" predates the rewrite; what the rewrite added is a
*catalogue* entry for it whose provider ids are all null.

Consequently Mythos 5 is special-cased **by name** in seven capability probes, because `capabilities: []`
means the catalogue lookup can never say yes for it:

```
:110519  oQt(e)   e.includes("claude-mythos-5")
:110547  v5r(e)   Qs(lo(e)) === "claude-mythos-5"
:118729  Zcg      M$(t,"lean_prompt")        || t === "claude-mythos-5"
:118785           M$(e,"fable_5_mitigations")|| e === "claude-mythos-5"
:119373           M$(r,"effort")             || r === "claude-mythos-5"
:119391           M$(r,"max_effort")         || r === "claude-mythos-5"
:119411           M$(r,"xhigh_effort")       || r === "claude-mythos-5"
:119729  DQt      M$(r,"adaptive_thinking")  || r === "claude-mythos-5"
:150524  Ser      M$(r,"mid_conv_system")    || r === "claude-mythos-5"
```

Reading `:14453-14458`, its `context` is `{ window: 1e6, native_1m: !0, supports_1m_beta: !0 }`,
`max_output_tokens: { default: 64000, upper: 128000 }`, `pricing: "tier_10_50"`, `advisor_rank: 5` —
i.e. Fable-5-class economics with `family: "mythos"`. It is also gated behind `_7n()` (`:110534-110537`),
which requires first-party + the official base URL **and** a server-provided model row naming it. So
Mythos 5 is a fully plumbed, first-party-only, server-unlockable family with no changelog presence in
this window.

There is even a *fourth* Mythos id that is not in the catalogue at all: `"claude-mythos-preview"`,
which appears in `IP()`'s native-1M check (`:150205`, `t !== "claude-mythos-preview"`) and in two
allow-list pairs `["claude-mythos-preview","claude-opus-4-6"]` (`:17933`, `:18997`). Its count is
**220=12 / 193=12** — pure carryover.

---

## 6. The vestigial imperative style: exclusion-list-then-catalogue-then-optimism

The rewrite did *not* replace the scattered per-model predicates with pure catalogue lookups. It
**prepended** the catalogue lookup to them. Every capability probe in 220 has the same four-stage
shape. Take mid-conversation-system support (`Ser`, `:150505-150526`, memoised):

```javascript
// ============================================
// supportsMidConversationSystem - 4-stage capability probe (the shape shared by ~8 predicates)
// Location: cli_inner_pretty.js:150505-150526
// ============================================

// ORIGINAL (for source lookup):
Ser = Vr((e) => {
  if (iY("hipaa")) return !1;
  if (Z.CLAUDE_CODE_FORCE_MID_CONVERSATION_SYSTEM) return !0;
  let t = Ede(e, "mid_conversation_system");
  if (t !== void 0) return t;
  let r = lo(e);
  if (
    r.includes("claude-3-") || r === "claude-opus-4-0" || r === "claude-opus-4-1" ||
    r === "claude-opus-4-5" || r === "claude-opus-4-6" || r === "claude-opus-4-7" ||
    r === "claude-sonnet-4-0" || r === "claude-sonnet-4-5" || r === "claude-sonnet-4-6" ||
    r === "claude-haiku-4-5"
  )
    return !1;
  if (M$(r, "mid_conv_system") || r === "claude-mythos-5") return !0;
  return dj(ny(e));
});

// READABLE (for understanding):
const supportsMidConversationSystem = memoise((model) => {
  if (isComplianceMode("hipaa")) return false;                          // 0. compliance veto
  if (env.CLAUDE_CODE_FORCE_MID_CONVERSATION_SYSTEM) return true;       //    escape hatch
  const perModelOverride = readModelOverride(model, "mid_conversation_system");
  if (perModelOverride !== undefined) return perModelOverride;          // 1. per-model override
  const id = normaliseToCatalogueId(model);
  if (KNOWN_UNSUPPORTED.has(id)) return false;                          // 2. exclusion list
  if (modelHasCapability(id, "mid_conv_system") || id === "claude-mythos-5") return true;  // 3. catalogue
  return providerHasFirstPartyCapabilities(providerForModel(model));    // 4. optimistic default
});

// Mapping: Ser→supportsMidConversationSystem, Ede→readModelOverride, lo→normaliseToCatalogueId,
//          M$→modelHasCapability, dj→providerHasFirstPartyCapabilities, ny→providerForModel,
//          Vr→memoise, iY→isComplianceMode
```

**How it works (and why the order is what it is):**
1. **Compliance veto first.** `iY("hipaa")` cannot be overridden by anything downstream. A
   capability that changes what gets sent to the API must be refusable by policy before any
   model-specific reasoning.
2. **Env force-on second**, so an operator debugging can still exercise the path.
3. **Per-model override (`Ede`) third.** It returns `undefined` when absent, so `!== void 0` (not
   truthiness) is required to let an explicit `false` through. **Definition located on second pass
   (`:118800-118844`)** — it is not a settings map but a pair of *environment variables per model
   alias*:

   ```javascript
   // ============================================
   // getEnvDeclaredCapability - 3P-only per-model capability declaration via env vars
   // Location: cli_inner_pretty.js:118804-118844
   // ============================================

   // ORIGINAL (for source lookup):
   ((eug = [
     { modelEnvVar: "ANTHROPIC_DEFAULT_FABLE_MODEL",  capabilitiesEnvVar: "ANTHROPIC_DEFAULT_FABLE_MODEL_SUPPORTED_CAPABILITIES" },
     { modelEnvVar: "ANTHROPIC_DEFAULT_OPUS_MODEL",   capabilitiesEnvVar: "ANTHROPIC_DEFAULT_OPUS_MODEL_SUPPORTED_CAPABILITIES" },
     { modelEnvVar: "ANTHROPIC_DEFAULT_SONNET_MODEL", capabilitiesEnvVar: "ANTHROPIC_DEFAULT_SONNET_MODEL_SUPPORTED_CAPABILITIES" },
     { modelEnvVar: "ANTHROPIC_DEFAULT_HAIKU_MODEL",  capabilitiesEnvVar: "ANTHROPIC_DEFAULT_HAIKU_MODEL_SUPPORTED_CAPABILITIES" },
     { modelEnvVar: "ANTHROPIC_CUSTOM_MODEL_OPTION",  capabilitiesEnvVar: "ANTHROPIC_CUSTOM_MODEL_OPTION_SUPPORTED_CAPABILITIES" },
   ]),
   (Ede = Vr(
     (e, t) => {
       if (rm()) return;
       let r = e.toLowerCase();
       for (let n of eug) {
         let o = process.env[n.modelEnvVar]?.trim(), i = process.env[n.capabilitiesEnvVar];
         if (!o || i === void 0) continue;
         if (r !== o.toLowerCase()) continue;
         return i.toLowerCase().split(",").map((s) => s.trim()).includes(t);
       }
       return;
     },
     (e, t) => `${e.toLowerCase()}:${t}`,
   )));

   // READABLE (for understanding):
   const MODEL_CAPABILITY_ENV_PAIRS = [ /* one row per alias, as above */ ];
   const getEnvDeclaredCapability = memoiseKeyed(
     (modelId, capability) => {
       if (usesFirstPartyModelIds()) return undefined;          // inert on 1P / Claude Platform / gateway
       const wanted = modelId.toLowerCase();
       for (const { modelEnvVar, capabilitiesEnvVar } of MODEL_CAPABILITY_ENV_PAIRS) {
         const pinnedModel = process.env[modelEnvVar]?.trim();
         const declared    = process.env[capabilitiesEnvVar];
         if (!pinnedModel || declared === undefined) continue;  // both halves required
         if (wanted !== pinnedModel.toLowerCase()) continue;
         return declared.toLowerCase().split(",").map((s) => s.trim()).includes(capability);
       }
       return undefined;                                        // no declaration -> fall through
     },
     (modelId, capability) => `${modelId.toLowerCase()}:${capability}`,
   );

   // Mapping: Ede->getEnvDeclaredCapability, eug->MODEL_CAPABILITY_ENV_PAIRS,
   //          rm->usesFirstPartyModelIds, Vr->memoiseKeyed
   ```

   `_SUPPORTED_CAPABILITIES` is **220=15 / 193=15** — the five env pairs are pure **carryover**; only the
   *set of capability tokens* they can name grew with the catalogue. Three design points worth stating:
   - **`if (rm()) return;` makes the whole layer inert on first-party**, Claude Platform and gateway
     sessions (`rm()`, `:100343-100345`). You cannot use an env var to claim a capability for a model
     Anthropic itself hosts — the catalogue is authoritative there. The override exists purely so a
     Bedrock/Vertex/Foundry/Mantle operator can describe a custom deployment the client has never heard of.
   - **Both halves must be set.** A `_SUPPORTED_CAPABILITIES` without its `_MODEL` sibling is ignored, so a
     stale capability list cannot leak onto whatever model happens to be selected.
   - **A declaration is exhaustive, not additive.** Once a matching row is found the function *returns* the
     `includes()` result, so naming one capability implicitly denies every other — the comma list is the
     complete truth for that model. That is why the return is a boolean rather than tri-state: an explicit
     `false` here must beat the catalogue and the provider default.
   - Memoisation is keyed `"<lowercased id>:<capability>"`, so the env scan happens once per pair rather
     than on every capability probe in the hot path.
4. **Hard-coded exclusion list fourth — before the catalogue.** This is the crucial ordering choice:
   the exclusion list *outranks* the catalogue's own `capabilities` array. It exists so that a
   mistaken capability token on an old model cannot enable a modern code path, and so that removing
   a token from the catalogue is not load-bearing.
5. **Catalogue lookup fifth.**
6. **Optimistic provider default last.** `dj(ny(e))` returns true for `firstParty`, the two Claude
   Platform channels, `foundry` and `mantle` (`:100352-100354`). Unknown ids — a Bedrock ARN, a
   gateway-served custom model, a next model that shipped server-side before this client — get the
   *modern* answer rather than the conservative one.

**Why optimism at the end?** Because the alternative fails in the worse direction. If an unknown id
defaulted to "unsupported", a server-side model launch would immediately degrade every capability
(no effort control, no adaptive thinking, no 1M context) for users on the new model until they
upgraded the CLI. Defaulting to "supported" means a *newer* model gets the newer behaviour, and the
exclusion list guarantees no *older* model does.

**Key insight:** `M$` is deliberately **tri-state, never `false`**:

```javascript
// ORIGINAL (:14517-14522):
function M$(e, t) {
  let r = e.replace(/\[1m\]/gi, ""),
    n = ww(r);
  if (n !== void 0) return n.capabilities.includes(t) ? !0 : void 0;
  return z8m?.(r, t);
}
```

It returns `true` or `undefined` — an id that is *in* the catalogue but lacks the capability yields
`undefined`, indistinguishable from "not in the catalogue". That is why callers who want a strict
answer write `M$(x, cap) === !0` (`:109354`, `:118702`) while callers who want the fall-through
behaviour write bare `M$(x, cap)` (`:119373`, `:150524`). The `[1m]` strip in the first line means
`"claude-opus-5[1m]"` resolves to the Opus 5 entry.

`z8m` is the second tell. It is **declared** at `:14530` and **never assigned anywhere in the
bundle** (its only other occurrence is the call at `:14521`). It is a dependency-injection seam for
an out-of-catalogue capability resolver — the hook a future server-pushed catalogue overlay would
fill. In 2.1.220 it is always `undefined`, so `M$` on an unknown id returns `undefined` and control
reaches the optimistic default.

The full set of capability tokens the catalogue uses, and how many entries declare each:
`context_management` (12), `effort` / `max_effort` (6 each), `adaptive_thinking` (6),
`xhigh_effort` (5), `mid_conv_system` (4: sonnet-5, opus-4-8, opus-5, fable-5),
`lean_prompt` (3), `fast_mode` (3: opus-4-7 `:14324`, opus-4-8 `:14357`, opus-5 `:14392`),
`refusal_fallback` (2: opus-5 `:14394`, fable-5 `:14432`), `rejects_disabled_thinking` (1: fable-5
`:14427`), `fable_5_mitigations` (1: `:14431`), `opus_5_prompt_bundle` (1: `:14395`).

---

## 7. What the catalogue's non-model keys actually drive

### 7.1 `latest_per_family` → a *system-prompt* string (answers ground-truth question 5's sibling)

`latest_per_family` (`:14489-14494`) has exactly one consumer, `:508104-508111`, and it is not model
selection at all — it is the prose Claude is told about itself:

```javascript
// ============================================
// buildLatestModelIdsGuidance - injects current model ids into the prompt
// Location: cli_inner_pretty.js:508104-508111
// ============================================

// ORIGINAL (for source lookup):
(Xep = Vr(() => {
  let e = yQ().latest_per_family;
  return `The most recent Claude models are the Claude 5 family and Haiku 4.5. Model IDs — ${Object.values(e)
    .map((r) => `${ww(r)?.display_name ?? r}: '${r === "claude-haiku-4-5" ? "claude-haiku-4-5-20251001" : r}'`)
    .join(", ")}. When building AI applications, default to the latest and most capable Claude models.`;
})),

// READABLE (for understanding):
const buildLatestModelIdsGuidance = memoise(() => {
  const latest = getModelCatalogue().latest_per_family;      // {fable, opus, sonnet, haiku}
  const pairs = Object.values(latest).map((id) =>
    `${lookupById(id)?.display_name ?? id}: '${
      id === "claude-haiku-4-5" ? "claude-haiku-4-5-20251001" : id
    }'`);
  return "The most recent Claude models are the Claude 5 family and Haiku 4.5. Model IDs — "
       + pairs.join(", ")
       + ". When building AI applications, default to the latest and most capable Claude models.";
});

// Mapping: Xep→buildLatestModelIdsGuidance, yQ→getModelCatalogue, ww→lookupById, Vr→memoise
```

So this build tells the model: *Fable 5: 'claude-fable-5', Opus 5: 'claude-opus-5', Sonnet 5:
'claude-sonnet-5', Haiku 4.5: 'claude-haiku-4-5-20251001'*. The one hard-coded exception rewrites
`claude-haiku-4-5` to the dated `claude-haiku-4-5-20251001`, because Haiku 4.5's API id *is* dated
(`:14053`) while the Claude 5 family's are not — an asymmetry in the API's own id scheme that this
one ternary papers over. Note the design pressure this key relieves: without it, the "which model
ids exist" prose would have to be hand-edited in the prompt on every model launch, and a stale
sentence there is exactly what causes a model to recommend a retired id.

### 7.2 `best: "fable"` → the `best` pseudo-alias

```javascript
// ORIGINAL (:110496-110513):
function iRc() {
  let e = yQ().best;
  if (e !== void 0 && Object.hasOwn(m7n, e) && m7n[e]?.available()) return e;
  return "opus";
}
function sRc() {
  let e = m7n[iRc()];
  if (e !== void 0) {
    let t = e.defaultModel();
    if (Fji) return t;
    Fji = !0;
    try { if (Pl(t)) return t; } finally { Fji = !1; }
  }
  return EE();
}
```

`m7n` is a one-entry availability registry, `{ fable: { available: Qkt, defaultModel: …, builtinDefault: … } }`
(`:111372`). So `best` resolves to `"fable"` only if the family is registered *and* `Qkt()`
(`:110521-110533`) says Fable is available — which requires first-party + the official base URL and a
server-provided model row for Fable that is not `disabled`. Otherwise `best` silently means `"opus"`.
`sRc()` is what `vi("best")` returns (`:111251-111252`), with `Fji` acting as a **re-entrancy latch**
around the `Pl()` allow-list check (`Pl` can itself resolve aliases, so without the latch `best` →
`Pl` → `vi` → `best` would recurse).

`best` is in the alias allow-list `m1e` (`:86599`) alongside `sonnet`/`opus`/`haiku`/`fable`/
`opusplan` and the three `[1m]` variants, so `--model best` and `/model best` are accepted inputs.

### 7.3 `alias_migration: {}` → shipped plumbing, no data (answers ground-truth question 4)

`alias_migration` is declared in the schema (`:14640`), present in the empty fallback (`:14651`), and
set to `{}` in the baked blob (`:14495`). Its would-be consumer is a startup migration:

```javascript
// ORIGINAL (:833732-833744):
async function rTm(e = qlE) {
  if (Hn() !== "firstParty") return !0;
  let t = Pr("userSettings")?.model;
  if (!t) return !0;
  let r = Qs(t);
  if (!Object.hasOwn(e, r)) return !0;
  let n = e[r];
  if (n === void 0) return !0;
  let o = r !== t,
    { error: i } = await yi("userSettings", { model: o ? `${n}[1m]` : n });
  if (i) return (w(`Failed to apply model alias migration: ${i}`, { level: "error" }), !1);
  return (O("tengu_alias_migration", { from_model: Bu(r), to_model: Bu(n), has_1m: o }), !0);
}
var qlE;
… qlE = {};                                                      // :833753
```

**The catalogue field is not wired to the consumer.** `rTm`'s default argument is `qlE`, a *separate*
local table initialised to `{}` at `:833753`, and it is called with no arguments at `:834073`.
`grep -n 'alias_migration'` returns only the schema, the blob, the fallback and the telemetry
string — never `yQ().alias_migration`. So the `tengu_alias_migration` gate (one of the 326 new gate
names) can **never fire in this build**: both tables are empty *and* they are not the same table.

The mechanism it implements is worth recording anyway, because it explains the intended shape:
first-party only, reads the persisted `userSettings.model`, strips a trailing `[1m]` with `Qs`,
looks the bare id up in the migration map, writes the replacement back *preserving the `[1m]`
suffix*, and reports `{from_model, to_model, has_1m}`. It is the "we retired the id you pinned"
self-heal — pre-built for the next model retirement, dormant today.

### 7.4 `advisor_rank` → the advisor-model eligibility floor

`advisor_rank` is `1` for Haiku 4.5, `2` for Sonnet 4.6, `3` for Sonnet 5 and Opus 4.6, `4` for
Opus 4.7 / 4.8 / 5, `5` for Fable 5 and Mythos 5 — a coarse capability ladder, *not* a recency
ladder (Sonnet 5 sits below Opus 4.7). Two readers:

```javascript
// ORIGINAL (:308413-308423):
function Aws(e) {
  return ww(lo(vi(e)))?.advisor_rank;
}
function wws(e) {
  let t = lo(vi(e));
  if (!yn()) {
    if (F6e(t) && !Qkt()) return;              // Fable, but Fable unavailable -> no rank
    if (oQt(t) && !_7n()) return;              // Mythos, but Mythos unlocked? -> no rank
  }
  return ww(t)?.advisor_rank;
}
```

`QQu(e)` (`:308440-308443`) then gates on `wws(e) !== void 0 && wws(e) >= mxy` — a numeric floor. The
`.210` bullet *"Fable temporarily shows as unavailable in the advisor picker (server-side issue)"*
maps precisely onto the `F6e(t) && !Qkt()` early return: nothing in the client changed, but
`Qkt()` reads the server-provided model rows (`$1e()`, `:154474-154484`), and a `disabled: true`
Fable row from the server makes `wws()` return `undefined`, dropping Fable below any floor. That
bullet is correctly classified **SERVER_SIDE**: the code path that produces the symptom is here,
the data that triggers it is not.

### 7.5 `defaults: {}` — dead

`defaults` (`:14487`) is `{}`, is in the schema (`:14637`) and the fallback (`:14649`), and has no
reader outside those three lines. Recorded as declared-but-unused.

### 7.6 The schema is deliberately ahead of the data — five unused per-model fields

The per-model schema `U8m` (`:14561-14626`) declares five fields that **no entry populates and no
code reads**. Each appears exactly once in the bundle — the schema line itself:

| Field | Schema line | 220 | 193 | populated in any entry? |
|---|---|---|---|---|
| `slogan` | `:14567` | 6 (5 unrelated) | 5 | no |
| `fallback_chain` | `:14606` | **1** | 0 | no |
| `picker: {section, badge, disabled_reason, tiers}` | `:14607-14615` | 10 (9 unrelated) | 3 | no |
| `deprecation: {retirement_dates, remapped_to}` | `:14616-14622` | **1 / 1 / 1** | 1 / 0 / 0 | no |
| `min_cli_version` | `:14623` | **1** | 0 | no |

The `slogan` hits at `:120397-120400` and `:120407` are a *different*, picker-local `slogan` key in
`TJn()`'s row builder, not the catalogue field; `deprecation:`/`picker:` likewise collide with unrelated
object keys. Filtering those out, **all five catalogue fields are schema-only**.

Two of them have live, hand-maintained camelCase equivalents elsewhere — which is exactly the
pre-rewrite pattern the catalogue was supposed to absorb:

```javascript
// ORIGINAL (:110053-110134, elided):
JIc = {
  "claude-opus-4-1": {
    modelName: "Claude Opus 4.1",
    retirementDates: { firstParty: null, bedrock: null, vertex: null, foundry: null,
                       anthropicAws: null, anthropicGoogleCloud: null, mantle: null, gateway: null },
    remappedTo: "the latest Opus",
  },
  "claude-opus-4-0": {
    modelName: "Claude Opus 4",
    retirementDates: { firstParty: "June 15, 2026", bedrock: "May 31, 2026", vertex: "September 14, 2026",
                       foundry: null, anthropicAws: null, anthropicGoogleCloud: null, mantle: null, gateway: null },
    remappedTo: "the latest Opus",
  },
  ...   // claude-sonnet-4-0, claude-3-opus, claude-3-7-sonnet, claude-3-5-haiku
};
```

`retirementDates` is **220=7 / 193=7** and `remappedTo` is **220=5 / 193=8** — pure carryover, with
`remappedTo` actually *shrinking*. Meanwhile the catalogue's `deprecation.retirement_dates` /
`remapped_to` (`:14618-14619`) sit empty. So the retirement table is the **one piece of per-model data
the rewrite did not absorb**, even though a slot was carved out for it.

**Why leave the slots empty?** Two readable reasons:

1. **Retirement data is per-model *and* per-provider**, and the catalogue's `provider_ids` are keyed
   snake_case (`anthropic_google_cloud`) while `JIc.retirementDates` is keyed camelCase
   (`anthropicGoogleCloud`, `:110062`). Migrating it would require either a second bridge through
   `Yig` (`:111373-111382`) or rekeying, and neither is free.
2. **`min_cli_version` and `picker.disabled_reason` only make sense for a catalogue that can be
   *pushed*.** A baked catalogue is always the same age as the CLI, so `min_cli_version` is
   tautologically satisfied and a `disabled_reason` could just as well be hard-coded. Together with the
   unassigned `z8m` capability-override seam (§6) and the `.loose()` schemas that preserve unknown keys
   (§3), these five fields are the strongest evidence that **a server-supplied model catalogue is the
   intended next step** and 2.1.220 ships the client half of it.

Note the retirement table has its own renderer at `:110040-110041`
(`⚠ ${modelName} ${was|will be} retired on ${date}. Consider switching to a newer model.`), keyed on a
past/future `copy.isPast` distinction — i.e. the shipped mechanism is complete; only its data source is
still imperative.

---

## 8. `pricing` tier tokens → real dollar figures

`$Ti(entry)` (`:14511-14516`) resolves the tier token, and `GIc` (`:109723-109738`) reshapes it into
the internal cost record — **throwing** if any of `cache_write_5m` / `cache_read` / `web_search` is
missing (`:109725-109729`, *"model catalog entry '…' has incomplete pricing — baked entries need the
full ModelCosts shape"*). `Oig()` (`:109742-109755`) walks every catalogue model and builds the
whole cost table, and it enforces a **second** cross-check:

```javascript
// ORIGINAL (:109747-109751):
if (!Mig(t.id))
  throw new Lr(
    `model catalog id '${t.id}' missing from CATALOG_MODEL_IDS — regenerate with 'bun run generate:model-catalog'`,
    "model catalog id missing from CATALOG_MODEL_IDS",
  );
```

`Mig` tests membership of `csc` (`CATALOG_MODEL_IDS`, `:86580-86598`) — a **separately maintained,
alphabetically sorted list of the same 17 ids**, including `claude-mythos-5`. Two hand-maintained
lists of the same thing, kept honest by a startup throw and a codegen script. That is the price of
the "one entry per launch" contract: the generator has to touch both.

See [`opus5_and_sonnet5.md`](opus5_and_sonnet5.md) §4 for how `tier_5_25` reconciles with the
changelog's "$10/$50 per Mtok" claim for Opus 5 fast mode.

---

## 9. Alias resolution is provider-dependent — and the changelog never says so

```javascript
// ============================================
// resolveAliasForProvider - the alias table lookup, provider-aware
// Location: cli_inner_pretty.js:14523-14529
// ============================================

// ORIGINAL (for source lookup):
function vkl(e, t) {
  let r = yQ().aliases,
    n = Object.hasOwn(r, e) ? r[e] : void 0;
  if (!n) return;
  let o = n.per_provider;
  return (o && Object.hasOwn(o, t) ? o[t] : void 0) ?? n.default;
}

// READABLE (for understanding):
function resolveAliasForProvider(alias, snakeCaseProvider) {
  const aliases = getModelCatalogue().aliases;
  const row = Object.hasOwn(aliases, alias) ? aliases[alias] : undefined;
  if (!row) return undefined;
  const perProvider = row.per_provider;
  return (perProvider && Object.hasOwn(perProvider, snakeCaseProvider)
            ? perProvider[snakeCaseProvider]
            : undefined) ?? row.default;
}

// Mapping: vkl→resolveAliasForProvider, yQ→getModelCatalogue
```

The table it reads (`:14461-14486`, verbatim):

| alias | `default` | `per_provider` overrides |
|---|---|---|
| `opus` | `claude-opus-5` (`:14463`) | bedrock `claude-opus-5` (`:14465`), vertex `claude-opus-5` (`:14466`), **foundry `claude-opus-4-6`** (`:14467`), mantle `claude-opus-5` (`:14468`), anthropic_aws `claude-opus-5` (`:14469`), **gateway `claude-opus-4-7`** (`:14470`) |
| `sonnet` | `claude-sonnet-5` (`:14474`) | **bedrock/vertex/foundry/mantle `claude-sonnet-4-5`** (`:14476-14479`), **anthropic_aws/gateway `claude-sonnet-4-6`** (`:14480-14481`) |
| `haiku` | `claude-haiku-4-5` (`:14484`) | — |
| `fable` | `claude-fable-5` (`:14485`) | — |

Two things fall out of this that no changelog bullet states:

1. **`.219`'s "Claude Opus 5 … is now the default Opus model" is provider-conditional.** It is true
   for first-party, Bedrock, Vertex, Mantle and Claude Platform on AWS. It is **false** on Microsoft
   Foundry (still Opus 4.6) and on the cloud gateway (still Opus 4.7).
2. **`.197`'s "Sonnet 5 … is now the default model" is first-party-only.** On Bedrock, Vertex,
   Foundry and Mantle, `sonnet` still means Sonnet 4.5; on Claude Platform on AWS and the gateway it
   means Sonnet 4.6. Sonnet 5 *has* provider ids for all eight channels (`:14182-14189`) — the
   restriction is a deliberate alias-table decision, not missing plumbing.
3. **`.207`'s "Bedrock / Vertex / Claude Platform on AWS now default to Claude Opus 4.8" has been
   superseded inside this same window.** The `per_provider` rows for those three channels read
   `claude-opus-5` in 2.1.220 (`:14465`, `:14466`, `:14469`) — `.219` moved them past 4.8 and the
   `.207` state is no longer observable.

Notice the `??` on the last line: a provider key that is present but `undefined` still falls back to
`default`, and `Object.hasOwn` is used rather than `in` so a prototype-polluted key cannot
masquerade as a provider override.

### The three-hop alias → provider-id path

```javascript
// ============================================
// resolveAliasToProviderModelId - alias -> catalogue id -> short key -> provider-specific id
// Location: cli_inner_pretty.js:110606-110612
// ============================================

// ORIGINAL (for source lookup):
function b7n(e, t, r = Hn()) {
  let n = vkl(e, Yig[r]);
  if (n === void 0) return;
  let o = ww(n)?.provider_ids.first_party,
    i = o !== void 0 ? f_e[o] : void 0;
  return i !== void 0 ? t[i] : void 0;
}

// READABLE (for understanding):
function resolveAliasToProviderModelId(alias, providerIdTable, provider = getAPIProvider()) {
  const catalogueId = resolveAliasForProvider(alias, CAMEL_TO_SNAKE_PROVIDER[provider]);
  if (catalogueId === undefined) return undefined;
  const firstPartyId = lookupById(catalogueId)?.provider_ids.first_party;
  const shortKey = firstPartyId !== undefined ? FIRST_PARTY_ID_TO_SHORT_KEY[firstPartyId] : undefined;
  return shortKey !== undefined ? providerIdTable[shortKey] : undefined;
}

// Mapping: b7n→resolveAliasToProviderModelId, vkl→resolveAliasForProvider,
//          Yig→CAMEL_TO_SNAKE_PROVIDER, ww→lookupById, f_e→FIRST_PARTY_ID_TO_SHORT_KEY,
//          Hn→getAPIProvider
```

`Yig` (`:111373-111382`) is the camelCase→snake_case provider-key bridge — the second adapter the
rewrite needed, because the *runtime* provider identifier stayed camelCase (`anthropicGoogleCloud`)
while the *catalogue* key is snake_case (`anthropic_google_cloud`).

The three consumers are the family defaults:

```javascript
// :110621-110638
function EE()  { let e = Z.ANTHROPIC_DEFAULT_OPUS_MODEL;   if (e !== void 0) return yL(e); return N6e(); }
function N6e(e = Km()) { return b7n("opus", e) ?? e.opus5; }
function CT()  { let e = Z.ANTHROPIC_DEFAULT_SONNET_MODEL; if (e !== void 0) return yL(e); return h7n(); }
function h7n(e = Km()) { return b7n("sonnet", e) ?? e.sonnet46; }
```

Note the **hard-coded last-resort fallbacks differ from the alias defaults**: `opus` falls back to
`opus5` but `sonnet` falls back to **`sonnet46`**, not `sonnet5`. That path is only reachable if the
catalogue's `sonnet` alias row vanished, and the more conservative choice there means a broken
catalogue degrades Sonnet users to the previous generation rather than to a model the alias table
was supposed to gate per-provider.

---

## 10. The id normaliser: why the substring ladder is ordered newest-first

Every capability probe starts by calling `lo(e)` → `YO(e)`. `YO` (`:111109-111140`) is the
canonicaliser, and it has three tiers:

```javascript
// ============================================
// normaliseToCatalogueId - any provider/regional/dated id -> canonical catalogue id
// Location: cli_inner_pretty.js:111109-111140
// ============================================

// ORIGINAL (for source lookup, elided in the middle):
function YO(e) {
  e = e.toLowerCase();
  let t = MFr(e);
  if (t !== void 0) return t;
  for (let r of LXt)
    if (r !== "us" && e.startsWith(`${r}.anthropic.`)) {
      let n = MFr(`us${e.slice(r.length)}`);
      if (n !== void 0) return n;
      break;
    }
  if (e.includes("claude-fable-5")) return "claude-fable-5";
  if (e.includes("claude-mythos-5")) return "claude-mythos-5";
  if (e.includes("claude-opus-5")) return "claude-opus-5";
  if (e.includes("claude-opus-4-8")) return "claude-opus-4-8";
  ...
  if (/claude-opus-4(?!-\d(?!\d))/.test(e)) return "claude-opus-4-0";
  ...
  return e.replace(/-\d{8}$/, "");
}

// READABLE (for understanding):
function normaliseToCatalogueId(rawId) {
  const id = rawId.toLowerCase();
  const exact = lookupByProviderId(id);                 // tier 1: the reverse provider-id index
  if (exact !== undefined) return exact;
  for (const region of BEDROCK_REGION_PREFIXES)         // tier 2: cross-region -> us.* rewrite
    if (region !== "us" && id.startsWith(`${region}.anthropic.`)) {
      const usEquivalent = lookupByProviderId(`us${id.slice(region.length)}`);
      if (usEquivalent !== undefined) return usEquivalent;
      break;                                            // only one region prefix can match
    }
  // tier 3: substring ladder, newest family first
  if (id.includes("claude-fable-5"))  return "claude-fable-5";
  ...
  return id.replace(/-\d{8}$/, "");                     // tier 4: strip a trailing YYYYMMDD
}

// Mapping: YO→normaliseToCatalogueId, MFr→lookupByProviderId, LXt→BEDROCK_REGION_PREFIXES
```

`LXt = ["us","eu","apac","jp","au","us-gov","global"]` (`:86619`).

**Why tier 2 exists:** the catalogue only lists `us.anthropic.…` Bedrock ids (`:14336`, `:14371`,
etc.), but Bedrock cross-region inference profiles are prefixed per region. Rather than storing 7
Bedrock ids per model, the normaliser rewrites `eu.anthropic.claude-opus-5` → `us.anthropic.claude-opus-5`
and re-queries the index. The `break` after the first matching prefix is important: without it, a
model id containing a second region-looking token could be rewritten twice.

**Why the ladder is newest-first:** the tests are `includes`, so they must be ordered from most to
least specific *within a family*. `claude-opus-4-8` must be tested before the
`/claude-opus-4(?!-\d(?!\d))/` regex that maps bare `claude-opus-4` to `claude-opus-4-0`; that
negative-lookahead pair exists exactly to stop `claude-opus-4-8` falling into the 4.0 bucket. Across
families the order is fable → mythos → opus-5 → opus-4-8 → … , which is also the order in which a
*new* id is most likely to arrive, so the hot path is short.

**Failure mode:** an unrecognised id falls out of tier 4 as itself-minus-a-date. `ww()` then returns
`undefined`, `M$` returns `undefined`, and every capability probe reaches its optimistic provider
default. There is one telemetry event for the analogous cost-table miss —
`tengu_unknown_model_cost` with `{model, shortName}` (`:109786`) — but none for a capability miss.

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
- `BAKED_CATALOGUE` (`Skl`, `:14008-14496`) - the hand-maintained declarative model catalogue
- `getModelCatalogue` (`yQ` / `PFr`, `:14653-14657`) - memoised `safeParse` with an empty-catalogue fallback
- `catalogueSchema` (`G8m`, `:14630-14643`) - the top-level zod schema (all `.loose()`)
- `modelEntrySchema` (`U8m`, `:14561-14626`) - per-model schema, incl. the unused `picker` / `deprecation` / `min_cli_version` fields
- `EMPTY_CATALOGUE` (`W8m`, `:14644-14652`) - the degraded fallback value
- `lookupById` (`ww`, `:14508-14510`) - canonical id → entry
- `lookupByProviderId` (`MFr`, `:14505-14507`) - any provider id (lowercased) → canonical id
- `buildProviderIdIndex` (`V8m`, `:14663-14674`) - reverse index, throws on cross-entry collision
- `resolvePricingTier` (`$Ti`, `:14511-14516`) - tier token → rate object
- `modelHasCapability` (`M$`, `:14517-14522`) - tri-state capability probe with the unassigned `z8m` override seam
- `resolveAliasForProvider` (`vkl`, `:14523-14529`) - alias + snake_case provider → catalogue id
- `stripTrailingZeroMinor` (`W2n`, `:14502-14504`) - `claude-sonnet-4-0` → `claude-sonnet-4`
- `catalogueEntryToLegacyProviderConfig` (`$Zh`, `:100171-100185`) - snake_case → camelCase adapter
- `buildLegacyModelConfigMap` (`NZh`, `:100186-100198`) - regenerates 193's `Kc` shape; throws on a missing entry
- `assertNo3pNulls` (`QK`, `:100199-100207`) - guards the named `CLAUDE_*_CONFIG` exports
- `lookupLegacyConfigByAnyProviderId` (`QQ`, `:100208-100213`) - reverse lookup over the legacy map
- `CATALOG_ID_TO_KEY` (`OZh`, `:100218-100235`) - the 16-row bridge table
- `LEGACY_MODEL_CONFIGS` (`Ul`, `:100236`) - `NZh()`'s result
- `MYTHOS_5_LEGACY_CONFIG` (`ybc`, `:100253-100263`) - hand-written camelCase Mythos config with full provider ids
- `OPUS_SHORT_KEYS_NEWEST_FIRST` (`i4i`, `:100264`) - `["opus5","opus48","opus47","opus46","opus45"]`
- `FIRST_PARTY_ID_TO_SHORT_KEY` (`f_e`, `:100266`)
- `CATALOG_MODEL_IDS` (`csc`, `:86580-86598`) - the parallel 17-id list, cross-checked at `:109747`
- `MODEL_ALIASES` (`m1e`, `:86599`) - `["sonnet","opus","haiku","fable","best","sonnet[1m]","opus[1m]","fable[1m]","opusplan"]`
- `BEDROCK_REGION_PREFIXES` (`LXt`, `:86619`)
- `buildAllModelCosts` (`Oig`, `:109742-109755`) - catalogue → cost table, throws on `CATALOG_MODEL_IDS` drift
- `catalogueCostsToModelCosts` (`GIc`, `:109723-109738`) - throws on incomplete pricing
- `normaliseToCatalogueId` (`YO`, `:111109-111140`) - the 4-tier id canonicaliser
- `normaliseWithOverrides` (`lo`, `:111141-111149`) - `YO` plus settings overrides and inference-profile resolution
- `CAMEL_TO_SNAKE_PROVIDER` (`Yig`, `:111373-111382`)
- `resolveAliasToProviderModelId` (`b7n`, `:110606-110612`) - the three-hop alias path
- `getDefaultOpusModel` (`EE`, `:110621-110625`) / `getDefaultSonnetModel` (`CT`, `:110632-110636`)
- `getBestFamilyKey` (`iRc`, `:110496-110500`) / `resolveBestAlias` (`sRc`, `:110501-110514`)
- `isFableAvailable` (`Qkt`, `:110521-110533`) / `isMythosUnlocked` (`_7n`, `:110534-110537`)
- `buildLatestModelIdsGuidance` (`Xep`, `:508104-508111`) - `latest_per_family` → system-prompt prose
- `applyModelAliasMigration` (`rTm`, `:833732-833744`) - dormant; reads the empty local `qlE` (`:833753`)
- `supportsMidConversationSystem` (`Ser`, `:150505-150526`) - the 4-stage capability-probe shape
- `getAdvisorRank` (`Aws`, `:308413-308415`) / `getAdvisorRankIfAvailable` (`wws`, `:308416-308423`)
