# Opus 4.8 Model ID Mapping, Labels & Canonical Resolution

> Module: `43_model_opus48` — Claude Code **v2.1.156**.
> Source under analysis: `cli_inner_pretty.js` (every cited line was read directly).
> Cross-validation baseline: `/lyz/codespace/3rd/claude-code/src/utils/model/configs.ts` (v2.1.88).
> **Opus 4.8 is a NEW model with no precursor in 2.1.88.** The 2.1.88 registry stops at `opus46`.

## Related Symbols

> Symbol mappings live ONLY in the symbol index files:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (model selection lives here)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions/constants in this document (list format — no mapping table here):

- `OPUS_48_MODEL_CONFIG` (`Xi$`) — the seven-provider id map for `claude-opus-4-8` (cli_inner_pretty.js:91825-91833)
- `OPUS_47_MODEL_CONFIG` (`Ji$`) — the 4.7 block immediately above it (cli_inner_pretty.js:91815-91824)
- `MODEL_CONFIG_REGISTRY` (`j3`) — the short-key → config object map, with `opus48: Xi$` (cli_inner_pretty.js:91835-91849)
- `CANONICAL_MODEL_IDS` (`d7K`) — `Object.values(j3).map(c => c.firstParty)` (cli_inner_pretty.js:91850)
- `CANONICAL_ID_TO_KEY` (`c7K`) — reverse map firstParty → short key (cli_inner_pretty.js:91851)
- `VERTEX_REGION_TABLE` (`Sh9`) — canonical-id → Vertex region env-var, with the `claude-opus-4-8` row (cli_inner_pretty.js:3623)
- `getDefaultOpusModel` (`TT`) — default Opus selector: `opus48` first-party, `opus47` on 3P/mantle (cli_inner_pretty.js:98720-98725)
- `getDefaultSonnetModel` (`NN`) — default Sonnet selector (cli_inner_pretty.js:98726-98730)
- `getBestModel` (`a3K`) — `"best"` alias resolver, delegates to `TT` (cli_inner_pretty.js:98717-98719)
- `isOpusLaunchTierEligible` (`UA`) — provider gate for new-launch Opus: firstParty/anthropicAws/gateway (cli_inner_pretty.js:91891-91893)
- `normalizeModelIdToCanonical` (`HD`) — substring matcher to a canonical `claude-…` id, with `[1m]` survival (cli_inner_pretty.js:98751-98769)
- `resolveModelCanonicalId` (`O7`) — override-aware + application-inference-profile-aware canonical resolver (cli_inner_pretty.js:98770-98778)
- `getModelDisplayName` (`$w`) — full label, e.g. `Opus 4.8 (1M context)` (cli_inner_pretty.js:98916-98934)
- `getModelShortLabel` (`ZOH`) — short label, e.g. `Opus 4.8` (cli_inner_pretty.js:98828-98860)
- `getModelShortLabelOrId` (`Zj`) — short label with id fallback (cli_inner_pretty.js:98861-98865)
- `getClaudePrefixedLabel` (`Q76`) — `Claude Opus 4.8` form (cli_inner_pretty.js:98866-98870)
- `getFastModeModelLabel` (`uB`) — `ki() ? "Opus 4.6" : "Opus 4.8"` under the deprecated override (cli_inner_pretty.js:98243-98245)
- `getFastModeModelId` (`mUH`) — `"claude-opus-4-6"/"opus"` + optional `[1m]` (cli_inner_pretty.js:98246-98248)
- `isOpus46FastModeOverride` (`ki`) — reads `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` (cli_inner_pretty.js:98240-98242)
- `isOpus4xFamily` (`C0H`) — membership test over the opus-4-x canonical set (cli_inner_pretty.js:98690-98699)
- `isFastModeEligibleModel` (`Wj`) — opus-4-6/4-7/4-8 fast-mode membership (cli_inner_pretty.js:98257-98263)
- `is1MContextAvailable` (`VP`) — 1M tier gate (cli_inner_pretty.js:98806-98810)
- `getMaxOutputTokens` (`LMH`) — 64K/128K table keyed on canonical id (cli_inner_pretty.js:130194-130218)
- `selectFastModePricing` (`S0H`) — picks 4.8 vs legacy fast cost (cli_inner_pretty.js:98451-98457)
- `resolveModelCost` (`mx1`) — overall cost resolver (cli_inner_pretty.js:98467-98480)
- `OPUS_STANDARD_COST` (`BB`), `OPUS_LEGACY_FAST_COST` (`Cx1`), `OPUS_48_FAST_COST` (`bx1`) (cli_inner_pretty.js:98526-98546)
- `modelSupportsEffort` (`A2`) — effort capability gate (cli_inner_pretty.js:184798-184814)
- `modelSupportsMaxEffort` (`ow$`) / `modelSupportsXhighEffort` (`ycH`) (cli_inner_pretty.js:184816-184851)
- `getDefaultEffortForModel` (`q48`) — `high` for 4.8, `xhigh` for 4.7 (cli_inner_pretty.js:184987-184991)
- `isOpusLaunchDefaultActive` (`AkH`) / `unpinOpusLaunchEffortLatch` (`SI`) (cli_inner_pretty.js:184896-184908)
- `resolveAppliedEffort` (`or`) — final effort with clamps (cli_inner_pretty.js:184909-184919)
- `isThinkingSignatureError` (`B87`) / `matchThinkingTypeError` (`p87`) (cli_inner_pretty.js:186575-186590)
- `stripSignedThinkingBlocks` (`cG4`) / `isSignedThinkingBlock` (`gG4`) (cli_inner_pretty.js:446086-446090, 446238-446252)

---

## TL;DR

v2.1.156 registers **`claude-opus-4-8`** as the new default Opus across **all seven**
provider surfaces (firstParty, bedrock, vertex, foundry, anthropicAws, mantle, gateway)
through the `OPUS_48_MODEL_CONFIG` (`Xi$`) object (cli_inner_pretty.js:91825-91833),
keyed `opus48` in the `MODEL_CONFIG_REGISTRY` (`j3`) (cli_inner_pretty.js:91848). It is a
**brand-new model with no 2.1.88 precursor** — the 2.1.88 registry
(`ALL_MODEL_CONFIGS`, configs.ts:87-99) stops at `opus46`, and the 2.1.88 config shape has
only `firstParty/bedrock/vertex/foundry` (configs.ts:72-77). The 2.1.156 shape adds three
new provider keys — `anthropicAws`, `mantle`, `gateway` — plus a per-provider
`eagerInputStreaming` flag.

Opus 4.8 carries:

- A **1M-context tier** (`[1m]` suffix), gated by `is1MContextAvailable` (`VP`) (cli_inner_pretty.js:98806-98810).
- **64K default / 128K upper-limit** output tokens via `getMaxOutputTokens` (`LMH`) (cli_inner_pretty.js:130198).
- A **default effort of `high`** (vs Opus 4.7's `xhigh`) from `getDefaultEffortForModel` (`q48`) (cli_inner_pretty.js:184988).
- **Fast-mode pricing at 2× standard** (input 10 / output 50 vs 5 / 25) via `OPUS_48_FAST_COST` (`bx1`) (cli_inner_pretty.js:98540-98546).
- Dedicated **label**, **canonical-id**, and **membership** functions, all updated to recognize `claude-opus-4-8`.

The headline 2.1.156 hotfix adds `isThinkingSignatureError` (`B87`) (cli_inner_pretty.js:186575-186583),
a 400-error matcher that drives a retry which strips signed thinking blocks via
`stripSignedThinkingBlocks` (`cG4`) — see the sibling doc `thinking_signature_hotfix.md`
(covered briefly here for completeness).

---

## 1. The model-config object: `Xi$` vs `Ji$` vs the 2.1.88 baseline

### What it does

`OPUS_48_MODEL_CONFIG` (`Xi$`) is the single source of truth mapping the **abstract model**
"Opus 4.8" to its **concrete provider-specific id strings**. Every provider Claude Code can
talk to (Anthropic first-party, Amazon Bedrock, Google Vertex, Microsoft Foundry, the
Claude-platform-on-AWS surface, Mantle, and the cloud gateway) names the same model
differently; this object is the lookup that turns "I want Opus 4.8" into the exact id the
selected provider expects.

### The config block, verbatim

```javascript
// ============================================
// OPUS_48_MODEL_CONFIG (Xi$) - seven-provider id map for claude-opus-4-8
// Location: cli_inner_pretty.js:91825-91833
// ============================================

// ORIGINAL (for source lookup):
(Xi$ = {
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
const OPUS_48_MODEL_CONFIG = {
  firstParty:   "claude-opus-4-8",              // Anthropic API
  bedrock:      "us.anthropic.claude-opus-4-8", // AWS Bedrock cross-region id
  vertex:       "claude-opus-4-8",              // Google Vertex AI
  foundry:      "claude-opus-4-8",              // Microsoft Foundry
  anthropicAws: "claude-opus-4-8",              // Claude Platform on AWS
  mantle:       "anthropic.claude-opus-4-8",    // Amazon Bedrock (Mantle)
  gateway:      "claude-opus-4-8",              // Cloud gateway
  eagerInputStreaming: { bedrock: true, vertex: true }, // start streaming before full input acked
};

// Mapping: Xi$→OPUS_48_MODEL_CONFIG, !0→true
```

The **4.7 block immediately above** it (`OPUS_47_MODEL_CONFIG`, `Ji$`) is structurally
identical and is what 4.8 was forked from:

```javascript
// ============================================
// OPUS_47_MODEL_CONFIG (Ji$) - the 4.7 block 4.8 was cloned from
// Location: cli_inner_pretty.js:91815-91824
// ============================================

// ORIGINAL (for source lookup):
(Ji$ = {
  firstParty: "claude-opus-4-7",
  bedrock: "us.anthropic.claude-opus-4-7",
  vertex: "claude-opus-4-7",
  foundry: "claude-opus-4-7",
  anthropicAws: "claude-opus-4-7",
  mantle: "anthropic.claude-opus-4-7",
  gateway: "claude-opus-4-7",
  eagerInputStreaming: { bedrock: !0, vertex: !0 },
}),

// Mapping: Ji$→OPUS_47_MODEL_CONFIG
```

The two are byte-for-byte identical except the version digit (`4-7` → `4-8`). The 4.6
block one level up (`Di$`, cli_inner_pretty.js:91805-91814, not shown) differs slightly:
its `mantle` is `null` and its `eagerInputStreaming` is `{ vertex: !0 }` only — i.e. 4.6
never got a Mantle id and did not eager-stream on Bedrock. 4.7 and 4.8 both eager-stream
on Bedrock **and** Vertex and both carry a Mantle id.

### Contrast with the 2.1.88 baseline (cross-val: HIGH confidence)

The 2.1.88 readable source proves both that 4.8 is new **and** that the config *shape*
grew. In 2.1.88, `CLAUDE_OPUS_4_6_CONFIG` is the newest Opus and has only four keys:

```typescript
// 2.1.88 — src/utils/model/configs.ts:72-77
export const CLAUDE_OPUS_4_6_CONFIG = {
  firstParty: 'claude-opus-4-6',
  bedrock: 'us.anthropic.claude-opus-4-6-v1',
  vertex: 'claude-opus-4-6',
  foundry: 'claude-opus-4-6',
} as const satisfies ModelConfig
```

And the 2.1.88 registry stops at `opus46` (src/utils/model/configs.ts:87-99): there is
**no opus47 and no opus48**. So the deltas, with confidence levels:

| Aspect | 2.1.88 (configs.ts) | 2.1.156 (`Xi$`) | Confidence |
|--------|--------------------|-----------------|-----------|
| Newest Opus | `opus46` | `opus48` | HIGH (both files read) |
| Config keys | firstParty/bedrock/vertex/foundry | + anthropicAws, mantle, gateway | HIGH |
| Per-config streaming flag | (none) | `eagerInputStreaming` | HIGH |
| Bedrock id form | `…-v1` suffix on 4.6 | no `-v1` on 4.7/4.8 | HIGH |

> The single mapping *table* above documents a cross-version structural diff, not a
> symbol-name table; it is allowed under the CLAUDE.md rule which only forbids
> obfuscated→readable mapping tables.

### Why this approach

A flat per-model object keyed by provider name is chosen over, say, a function that
string-rewrites `claude-opus-4-8` into each provider's dialect. The reasons are inferable
from the data itself:

1. **The dialects are not algorithmically derivable.** Bedrock prefixes
   `us.anthropic.` *and* historically appended `-v1` (4.6) but dropped it (4.7/4.8);
   Mantle uses `anthropic.` with no region prefix. There is no clean transform — only a
   table works.
2. **`null` is a first-class "not available here" value.** 4.6's `mantle: null`
   (cli_inner_pretty.js:91811) lets the resolver fall back instead of fabricating an id.
   See `buildProviderModelMap` (`Zi$`) (cli_inner_pretty.js:91924-91933), which iterates
   providers and uses `j3[_][H] ?? (… ?? j3[_].firstParty)` to fill gaps.
3. **`eagerInputStreaming` is co-located with the id** because it is a per-(model,provider)
   capability — 4.6 on Bedrock cannot eager-stream but 4.8 on Bedrock can, so it cannot
   live on a global flag.

**Key insight:** the config object is intentionally "dumb data." All the *logic*
(which provider is active, how to canonicalize, what label to show) lives in the
functions in §2–§4 that *consume* this table. Adding a new model is therefore a
near-mechanical "clone the previous block, bump the digit, register the key" operation —
exactly what we see between `Ji$` and `Xi$`.

---

## 2. Registry wiring & default-Opus selection

### The registry (`j3`) and its derived maps

```javascript
// ============================================
// MODEL_CONFIG_REGISTRY (j3) - short-key → config, plus derived id maps
// Location: cli_inner_pretty.js:91835-91851
// ============================================

// ORIGINAL (for source lookup):
(j3 = {
  haiku35: Mq6, haiku45: jq6, sonnet35: Oq6, sonnet37: fq6, sonnet40: wq6,
  sonnet45: Dq6, sonnet46: Jq6, opus40: Xq6, opus41: Lq6, opus45: Pq6,
  opus46: Di$, opus47: Ji$, opus48: Xi$,
}),
(d7K = Object.values(j3).map((H) => H.firstParty)),
(c7K = Object.fromEntries(Object.entries(j3).map(([H, $]) => [$.firstParty, H])));

// READABLE (for understanding):
const MODEL_CONFIG_REGISTRY = {
  haiku35, haiku45, sonnet35, sonnet37, sonnet40, sonnet45, sonnet46,
  opus40, opus41, opus45,
  opus46: OPUS_46_MODEL_CONFIG,
  opus47: OPUS_47_MODEL_CONFIG,
  opus48: OPUS_48_MODEL_CONFIG,   // ← new key
};
const CANONICAL_MODEL_IDS = Object.values(MODEL_CONFIG_REGISTRY).map(c => c.firstParty);
const CANONICAL_ID_TO_KEY  = Object.fromEntries(
  Object.entries(MODEL_CONFIG_REGISTRY).map(([key, cfg]) => [cfg.firstParty, key]),
);

// Mapping: j3→MODEL_CONFIG_REGISTRY, d7K→CANONICAL_MODEL_IDS, c7K→CANONICAL_ID_TO_KEY
```

These three lines are the **direct descendant of 2.1.88's `ALL_MODEL_CONFIGS` /
`CANONICAL_MODEL_IDS` / `CANONICAL_ID_TO_KEY`** (configs.ts:87-114), with the 2.1.88
`@[MODEL LAUNCH]: Register the new config here.` comment marking the exact spot a new key
goes. Confidence: HIGH — the construction (`Object.values(...).map(c=>c.firstParty)` and
`Object.fromEntries(...)`) is identical.

The model-key list `Wq6 = Object.keys(j3)` is computed from the registry
(cli_inner_pretty.js:92009) — these are the *model short keys* (`haiku35`…`opus48`), not
provider fields. `buildProviderModelMap` (`Zi$`) iterates `for (let _ of Wq6) { j3[_][H] … }`,
where `_` is a model key and `H` is the provider field, so `Wq6` enumerates the rows of the
registry while `H` selects the column. The runtime accessor `getResolvedModelMap` (`Yz`)
(cli_inner_pretty.js:91986-91990) returns the registry **after** applying user
`modelOverrides` via `applyModelOverrides` (`l7K`) (cli_inner_pretty.js:91957-91966).

### The Vertex region table

Vertex requires a *region* per model (set via env var). The table `VERTEX_REGION_TABLE`
(`Sh9`) gets a new `claude-opus-4-8` row:

```javascript
// ============================================
// VERTEX_REGION_TABLE (Sh9) - canonical id → Vertex region env-var name
// Location: cli_inner_pretty.js:3618-3632
// ============================================

// ORIGINAL (for source lookup):
Sh9 = [
  ["claude-haiku-4-5", "VERTEX_REGION_CLAUDE_HAIKU_4_5"],
  …
  ["claude-opus-4-8", "VERTEX_REGION_CLAUDE_4_8_OPUS"],   // ← new row, ordered before 4-7
  ["claude-opus-4-7", "VERTEX_REGION_CLAUDE_4_7_OPUS"],
  ["claude-opus-4-6", "VERTEX_REGION_CLAUDE_4_6_OPUS"],
  …
];

// Mapping: Sh9→VERTEX_REGION_TABLE
```

The list is **ordered newest-first within the Opus family**, which matters because the
lookups in §3 (`HD`) iterate top-down and the *first* substring hit wins; placing 4.8
before 4.7/4.6 keeps the ordering consistent with the canonical matcher.

### Default-Opus selection: `getDefaultOpusModel` (`TT`)

This is the function that decides which concrete id the abstract `"opus"` alias resolves
to — and it is where the **4.8-on-first-party / 4.7-on-third-party** split is encoded.

```javascript
// ============================================
// getDefaultOpusModel (TT) - resolve the default Opus per provider/tier
// Location: cli_inner_pretty.js:98717-98725
// ============================================

// ORIGINAL (for source lookup):
function a3K() { return TT(); }
function TT() {
  if (process.env.ANTHROPIC_DEFAULT_OPUS_MODEL) return process.env.ANTHROPIC_DEFAULT_OPUS_MODEL;
  if (!UA()) return Yz()[Re];
  if (Zq() !== "firstParty") return Yz().opus47;
  return Yz().opus48;
}

// READABLE (for understanding):
function getBestModel() { return getDefaultOpusModel(); }   // "best" alias
function getDefaultOpusModel() {
  // 1. Explicit override always wins.
  if (process.env.ANTHROPIC_DEFAULT_OPUS_MODEL) return process.env.ANTHROPIC_DEFAULT_OPUS_MODEL;
  // 2. If NOT a launch-tier provider (firstParty/anthropicAws/gateway), use the
  //    conservative DEFAULT_3P_OPUS_KEY ("opus46").
  if (!isOpusLaunchTierEligible()) return getResolvedModelMap()["opus46"];
  // 3. Launch-tier but not literally firstParty (i.e. anthropicAws or gateway) → 4.7.
  if (getActiveProvider() !== "firstParty") return getResolvedModelMap().opus47;
  // 4. firstParty → the new flagship, 4.8.
  return getResolvedModelMap().opus48;
}

// Mapping: TT→getDefaultOpusModel, a3K→getBestModel, UA→isOpusLaunchTierEligible,
//          Zq→getActiveProvider, Yz→getResolvedModelMap, Re→DEFAULT_3P_OPUS_KEY ("opus46")
```

The gate `isOpusLaunchTierEligible` (`UA`) is `firstParty || anthropicAws || gateway`
(cli_inner_pretty.js:91891-91893). So the decision tree is:

```
ANTHROPIC_DEFAULT_OPUS_MODEL set? ──yes──► that value
            │ no
            ▼
   UA() (firstParty | anthropicAws | gateway)?
       │ no                              │ yes
       ▼                                 ▼
   opus46  (DEFAULT_3P_OPUS_KEY)   Zq() === "firstParty"?
   = Bedrock/Vertex/Foundry/Mantle    │ no            │ yes
                                       ▼               ▼
                                    opus47          opus48  ← new flagship default
                                  (anthropicAws,
                                   gateway)
```

`getDefaultSonnetModel` (`NN`) (cli_inner_pretty.js:98726-98730) is the parallel function
for Sonnet — it returns `opus46`-equivalent fallback `Yz()[Ie]` (`sonnet45`) when `!UA()`
and `Yz().sonnet46` otherwise. (The constants are `Re="opus46"`, `Ie="sonnet45"`,
`Ce="haiku45"` at cli_inner_pretty.js:98938-98940.)

### Why this staged rollout?

The split — **4.8 only on raw first-party, 4.7 on the AWS/gateway launch surfaces, 4.6 on
true third-party** — is a classic phased model launch. Inferred rationale:

1. **First-party gets the newest model immediately** because Anthropic controls that
   serving path end-to-end and can guarantee 4.8 is deployed there on day one.
2. **anthropicAws / gateway lag one version (4.7)** — these are Anthropic-operated but on
   partner infra; the gate `UA()` admits them to "launch tier" but `TT()` deliberately
   pins them one version back until 4.8 is provisioned there.
3. **Bedrock/Vertex/Foundry/Mantle stay on 4.6** (`!UA()` → `opus46`) because those are
   customer-controlled marketplaces where the model may not even be enabled yet; defaulting
   to a model the customer hasn't subscribed to would produce hard 4xx errors.

**Key insight:** the *config table* already contains 4.8 ids for every provider
(cli_inner_pretty.js:91827-91832), but the *selection function* refuses to default to them
on non-first-party surfaces. Availability of an **id** is decoupled from eligibility as a
**default** — a user on Bedrock can still explicitly pass `claude-opus-4-8` and it will
resolve, they just won't *get* it implicitly. This is the safest possible rollout: the
plumbing is universal, the defaulting is conservative.

> Cross-val: 2.1.88's `getDefaultOpusModel` equivalent did not have a three-way tier split
> because there was only one launch model at a time. This staged split is **NEW** structure
> introduced with the 4.7→4.8 overlap. Confidence: MEDIUM (no direct 2.1.88 analogue to
> diff; inferred from the 4.6-ceiling 2.1.88 registry).

The session-effective model id also threads `[1m]` through here. `getCurrentModelId`
(`wZ`) (cli_inner_pretty.js:98741-98747) calls `TT() + (VP() ? "[1m]" : "")` for the Opus
path, and falls back to `Yz().opus47` when the provider is `mantle`.

---

## 3. Canonical-id resolution: `HD` and `O7`

### `normalizeModelIdToCanonical` (`HD`) — the substring matcher

Given **any** id string (a full first-party id, a Bedrock `us.anthropic.…` id, a Vertex
`@`-dated id, a Mantle `anthropic.…` id, or an id with a `[1m]` suffix) this returns the
**canonical short id** like `claude-opus-4-8`.

```javascript
// ============================================
// normalizeModelIdToCanonical (HD) - reduce any vendor id to its canonical claude-… name
// Location: cli_inner_pretty.js:98751-98769
// ============================================

// ORIGINAL (for source lookup):
function HD(H) {
  if (((H = H.toLowerCase()), H.includes("claude-opus-4-8"))) return "claude-opus-4-8";
  if (H.includes("claude-opus-4-7")) return "claude-opus-4-7";
  if (H.includes("claude-opus-4-6")) return "claude-opus-4-6";
  if (H.includes("claude-opus-4-5")) return "claude-opus-4-5";
  if (H.includes("claude-opus-4-1")) return "claude-opus-4-1";
  if (/claude-opus-4(?!-\d(?!\d))/.test(H)) return "claude-opus-4-0";
  if (H.includes("claude-sonnet-4-6")) return "claude-sonnet-4-6";
  …
  return H.replace(/-\d{8}$/, "");
}

// READABLE (for understanding):
function normalizeModelIdToCanonical(rawId) {
  rawId = rawId.toLowerCase();
  if (rawId.includes("claude-opus-4-8")) return "claude-opus-4-8"; // ← new, checked FIRST
  if (rawId.includes("claude-opus-4-7")) return "claude-opus-4-7";
  if (rawId.includes("claude-opus-4-6")) return "claude-opus-4-6";
  if (rawId.includes("claude-opus-4-5")) return "claude-opus-4-5";
  if (rawId.includes("claude-opus-4-1")) return "claude-opus-4-1";
  // 4.0 has no version digit, so use a negative-lookahead to avoid swallowing 4-1/4-5/…
  if (/claude-opus-4(?!-\d(?!\d))/.test(rawId)) return "claude-opus-4-0";
  … // sonnet / haiku / claude-3 families
  return rawId.replace(/-\d{8}$/, ""); // last resort: strip a trailing YYYYMMDD date
}

// Mapping: HD→normalizeModelIdToCanonical
```

Two subtleties worth flagging:

1. **`[1m]` is NOT stripped here.** `claude-opus-4-8[1m]` still `.includes("claude-opus-4-8")`,
   so it canonicalizes to `claude-opus-4-8`. The `[1m]` suffix is stripped *separately* by
   `stripContextSuffix` (`vP`) — `H.replace(/\[(1|2)m\]/gi, "")` (cli_inner_pretty.js:98935-98937)
   — only by callers that need the bare id for display. The canonical matcher tolerates it.
2. **Ordering is load-bearing.** Because matching is by `.includes`, the more-specific
   `claude-opus-4-8` must be tested before the bare-`claude-opus-4` regex. The 4.0 branch
   uses a negative lookahead `(?!-\d(?!\d))` precisely so a string like
   `claude-opus-4-8` does *not* fall through to the 4.0 branch — though in practice 4.8 is
   already caught first.

### `resolveModelCanonicalId` (`O7`) — override- and ARN-aware wrapper

`O7` is what almost every consumer actually calls. It layers two resolution paths on top
of `HD`:

```javascript
// ============================================
// resolveModelCanonicalId (O7) - canonicalize, honoring modelOverrides and inference-profile ARNs
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
function resolveModelCanonicalId(modelString) {
  // Path 1: user modelOverrides — Gi$ maps an override VALUE back to its short KEY.
  const reverseMapped = reverseLookupOverride(modelString);
  if (reverseMapped !== modelString) return normalizeModelIdToCanonical(reverseMapped);

  // Path 2: Bedrock application-inference-profile ARN → look up the backing model
  //         from the cache populated asynchronously by GetInferenceProfileCommand.
  if (modelString.includes("application-inference-profile")) {
    const backing = getInferenceProfileBackingModel(stripContextSuffix(modelString));
    if (backing) return normalizeModelIdToCanonical(backing);
  }

  // Path 3: plain canonicalization.
  return normalizeModelIdToCanonical(reverseMapped);
}

// Mapping: O7→resolveModelCanonicalId, HD→normalizeModelIdToCanonical,
//          Gi$→reverseLookupOverride, rm8→getInferenceProfileBackingModel,
//          vP→stripContextSuffix
```

- `reverseLookupOverride` (`Gi$`) (cli_inner_pretty.js:91967-91977) scans the user's
  `modelOverrides` and, if the input *equals one of the override values*, returns the short
  key instead — so if a user remapped `opus48` to some custom string, that string still
  canonicalizes correctly.
- `getInferenceProfileBackingModel` (`rm8`) (cli_inner_pretty.js:3258-3260) reads from
  `d$.inferenceProfileBackingModels` — a per-session cache filled by Bedrock's
  `GetInferenceProfileCommand`. This is the **application-inference-profile** handling: an
  opaque ARN like `arn:aws:bedrock:…:application-inference-profile/abc` carries no model
  name, so the canonical id is discovered out-of-band and cached.

> Cross-val: this matches the v2.1.122 `resolveModelCanonicalId`/`k7` precursor documented
> in `../../../claude_code_v_2.1.142/analyze/19_think_level/bedrock_arn_effort_fix.md`. The
> 2.1.156 version is the same three-path structure with the matcher table extended to 4.8.
> Confidence: HIGH.

### Where the `[1m]` strip really lives

The summary asks about a "`[1m]` strip" in `HD`/`O7`. To be precise: neither `HD` nor `O7`
strips `[1m]`. The strip happens in:

- `stripContextSuffix` (`vP`) — global `/\[(1|2)m\]/gi` removal (cli_inner_pretty.js:98935-98937),
  used inside `O7`'s ARN path and by label functions.
- `getModelDisplayName` (`$w`) and `getModelShortLabel` (`ZOH`) *detect* `[1m]` (to append
  the "(1M context)" suffix) but pass the full string to `O7`, which tolerates it via path 3.
- The canonical *family* functions like `getEffortDisplayContext` (`xG`)
  (cli_inner_pretty.js:98779-98786) do `O7($).replace(/\[1m\]$/, "")` when they need the bare id.

**Key insight:** keeping `[1m]` *out* of the canonical id but *in* the session model id is
the whole trick that lets one model (`claude-opus-4-8`) have two context tiers without
doubling the registry. The suffix is a UI/capability flag riding on the id string, peeled
off exactly where (and only where) it would confuse a canonical comparison.

---

## 4. Label functions

There are three label families, each consuming `resolveModelCanonicalId` (`O7`):

### `getModelDisplayName` (`$w`) — the full, user-facing name

```javascript
// ============================================
// getModelDisplayName ($w) - full label incl. "(1M context)" suffix
// Location: cli_inner_pretty.js:98916-98934
// ============================================

// ORIGINAL (for source lookup):
function $w(H) {
  if (Zq() === "foundry") return;
  let $ = H.toLowerCase().includes("[1m]"),
    q = O7(H);
  if (q === "claude-opus-4-8") return $ ? "Opus 4.8 (1M context)" : "Opus 4.8";
  if (q === "claude-opus-4-7") return $ ? "Opus 4.7 (1M context)" : "Opus 4.7";
  if (q === "claude-opus-4-6") return $ ? "Opus 4.6 (1M context)" : "Opus 4.6";
  if (q === "claude-opus-4-5") return "Opus 4.5";
  …
}

// READABLE (for understanding):
function getModelDisplayName(modelId) {
  if (getActiveProvider() === "foundry") return undefined; // Foundry hides display names
  const is1M = modelId.toLowerCase().includes("[1m]");
  const canonical = resolveModelCanonicalId(modelId);
  if (canonical === "claude-opus-4-8") return is1M ? "Opus 4.8 (1M context)" : "Opus 4.8";
  if (canonical === "claude-opus-4-7") return is1M ? "Opus 4.7 (1M context)" : "Opus 4.7";
  if (canonical === "claude-opus-4-6") return is1M ? "Opus 4.6 (1M context)" : "Opus 4.6";
  if (canonical === "claude-opus-4-5") return "Opus 4.5"; // 4.5 and below have no 1M tier
  … // sonnet 4.6/4.5/4.0 also get the (1M context) variant; older models don't
}

// Mapping: $w→getModelDisplayName, Zq→getActiveProvider, O7→resolveModelCanonicalId
```

Note that **only 4.6/4.7/4.8 (and Sonnet 4.0/4.5/4.6) carry the `(1M context)` variant** —
4.5-and-earlier Opus return a bare `"Opus 4.5"` with no 1M branch, which mirrors the
`is1MContextAvailable` (`VP`) eligibility set in §6.

### `getModelShortLabel` (`ZOH`) and friends

```javascript
// ============================================
// getModelShortLabel (ZOH) - compact label, "(1M context)" via $ suffix
// Location: cli_inner_pretty.js:98828-98865
// ============================================

// ORIGINAL (for source lookup):
function ZOH(H) {
  let $ = H.endsWith("[1m]") ? " (1M context)" : "";
  switch (O7(H)) {
    case "claude-opus-4-8": return "Opus 4.8" + $;
    case "claude-opus-4-7": return "Opus 4.7" + $;
    …
    default: return null;
  }
}
function Zj(H) { let $ = ZOH(H); if ($) return $; return H; }
function Q76(H) { let $ = ZOH(H); if ($) return `Claude ${$}`; return `Claude (${H})`; }

// READABLE (for understanding):
function getModelShortLabel(modelId) {
  const ctx = modelId.endsWith("[1m]") ? " (1M context)" : "";
  switch (resolveModelCanonicalId(modelId)) {
    case "claude-opus-4-8": return "Opus 4.8" + ctx;
    case "claude-opus-4-7": return "Opus 4.7" + ctx;
    … // returns null for unknown ids
  }
}
function getModelShortLabelOrId(modelId)  { return getModelShortLabel(modelId) ?? modelId; }
function getClaudePrefixedLabel(modelId)  {
  const s = getModelShortLabel(modelId);
  return s ? `Claude ${s}` : `Claude (${modelId})`;  // e.g. "Claude Opus 4.8"
}

// Mapping: ZOH→getModelShortLabel, Zj→getModelShortLabelOrId, Q76→getClaudePrefixedLabel,
//          O7→resolveModelCanonicalId
```

`getModelShortLabelOrId` returns the raw id if the model is unknown (so unrecognized ids
still print *something*); `getClaudePrefixedLabel` produces the `Claude Opus 4.8` form used
where the brand prefix is wanted.

### `getFastModeModelLabel` (`uB`) — the deprecated 4.6 override

This is the function the summary highlights: under the deprecated
`CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` env var, fast mode is forced back to Opus 4.6;
otherwise it shows Opus 4.8.

```javascript
// ============================================
// getFastModeModelLabel (uB) / id (mUH) - Opus 4.6 vs 4.8 under the deprecated override
// Location: cli_inner_pretty.js:98240-98248
// ============================================

// ORIGINAL (for source lookup):
function ki()  { return xH(process.env.CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE); }
function uB()  { return ki() ? "Opus 4.6" : "Opus 4.8"; }
function mUH() { return (ki() ? "claude-opus-4-6" : "opus") + (VP() ? "[1m]" : ""); }

// READABLE (for understanding):
function isOpus46FastModeOverride() {
  return parseBoolEnv(process.env.CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE);
}
function getFastModeModelLabel() {
  return isOpus46FastModeOverride() ? "Opus 4.6" : "Opus 4.8";
}
function getFastModeModelId() {
  return (isOpus46FastModeOverride() ? "claude-opus-4-6" : "opus")
       + (is1MContextAvailable() ? "[1m]" : "");
}

// Mapping: ki→isOpus46FastModeOverride, uB→getFastModeModelLabel, mUH→getFastModeModelId,
//          xH→parseBoolEnv, VP→is1MContextAvailable
```

The override is **slated for removal 06/01** (per the changelog / scout dossier): it exists
only to let users who relied on Opus 4.6's fast-mode behavior keep it during the 4.6→4.8
fast-mode transition. `isOpus46FastModeOverride` (`ki`) is consulted in three places:
`getFastModeModelLabel` (`uB`), `getFastModeModelId` (`mUH`), and the fast-mode membership
test `isFastModeEligibleModel` (`Wj`) (cli_inner_pretty.js:98257-98263), where if the
override is on, *only* `opus-4-6` is fast-eligible:

```javascript
// ORIGINAL — Wj (cli_inner_pretty.js:98257-98263):
function Wj(H) {
  if (!I9()) return !1;
  let $ = H ?? wZ(), K = e7($).toLowerCase();
  if (ki()) return K.includes("opus-4-6");
  return K.includes("opus-4-6") || K.includes("opus-4-7") || K.includes("opus-4-8");
}
```

> Cross-val: 2.1.88 has no Opus 4.8/4.7 labels and no fast-mode override (fast mode itself
> postdates 2.1.88). The whole `uB`/`ki`/`mUH` cluster is **NEW** post-2.1.88. Confidence:
> HIGH (verified absent in 2.1.88 src by the registry ceiling at opus46 and the
> configs.ts shape).

---

## 5. Membership tests: `isOpus4xFamily` (`C0H`) and `isFastModeEligibleModel` (`Wj`)

`isOpus4xFamily` (`C0H`) answers "is this model any member of the Opus 4.x family?" — used
wherever behavior keys off "this is an Opus 4 generation model" rather than a specific
version.

```javascript
// ============================================
// isOpus4xFamily (C0H) - membership over the opus-4-x canonical set
// Location: cli_inner_pretty.js:98690-98699
// ============================================

// ORIGINAL (for source lookup):
function C0H(H) {
  let $ = O7(H);
  return (
    $ === "claude-opus-4-0" || $ === "claude-opus-4-1" || $ === "claude-opus-4-5" ||
    $ === "claude-opus-4-6" || $ === "claude-opus-4-7" || $ === "claude-opus-4-8"
  );
}

// READABLE (for understanding):
function isOpus4xFamily(modelId) {
  const canonical = resolveModelCanonicalId(modelId);
  return canonical === "claude-opus-4-0" || canonical === "claude-opus-4-1"
      || canonical === "claude-opus-4-5" || canonical === "claude-opus-4-6"
      || canonical === "claude-opus-4-7" || canonical === "claude-opus-4-8";
}

// Mapping: C0H→isOpus4xFamily, O7→resolveModelCanonicalId
```

Note the gap: there is **no `claude-opus-4-2/4-3/4-4`** — those versions never shipped, so
the membership set is the literal list of shipped Opus-4 ids. Adding 4.8 to this set is the
fifth of the per-model touch-points required to onboard a model (config object, registry
key, canonical matcher, labels, membership).

The narrower **fast-mode** membership `isFastModeEligibleModel` (`Wj`) (shown in §4) only
admits 4.6/4.7/4.8 (or just 4.6 under the override) — fast mode is a newer, smaller subset.

---

## 6. The 1M-context gate `is1MContextAvailable` (`VP`) and the 64K/128K output table

### `VP` — when is the 1M tier offered?

```javascript
// ============================================
// is1MContextAvailable (VP) - gate for the [1m] context tier
// Location: cli_inner_pretty.js:98806-98810
// ============================================

// ORIGINAL (for source lookup):
function VP() {
  if (S4H() || R4H() || Zq() !== "firstParty") return !1;
  if (Vq() && _4() === null) return !1;
  return !0;
}

// READABLE (for understanding):
function is1MContextAvailable() {
  // Disabled if: small-fast-model mode, Pro tier, or any non-firstParty provider.
  if (isSmallFastModelActive() || isProTier() || getActiveProvider() !== "firstParty")
    return false;
  // Disabled if OAuthed but no resolved subscription tier yet.
  if (isOAuth() && getSubscriptionTier() === null) return false;
  return true;
}

// Mapping: VP→is1MContextAvailable, S4H→isSmallFastModelActive, R4H→isProTier,
//          Zq→getActiveProvider, Vq→isOAuth, _4→getSubscriptionTier
```

So the 1M tier is **first-party only, non-Pro**. `isProTier` (`R4H`) is
`getSubscriptionTier() === "pro"` (cli_inner_pretty.js:131611-131613); `getSubscriptionTier`
(`_4`) is at cli_inner_pretty.js:131589-131595. This is why `getModelDisplayName` only
appends `(1M context)` for the higher Opus/Sonnet versions *and* why `getCurrentModelId`
(`wZ`) only adds `[1m]` when `VP()` is true.

### `getMaxOutputTokens` (`LMH`) — 64K default / 128K upper limit

```javascript
// ============================================
// getMaxOutputTokens (LMH) - per-model {default, upperLimit} output token caps
// Location: cli_inner_pretty.js:130194-130218
// ============================================

// ORIGINAL (for source lookup):
function LMH(H) {
  let $, q, K = O7(H);
  if (K === "claude-opus-4-8") (($ = 64000), (q = 128000));
  else if (K === "claude-opus-4-7") (($ = 64000), (q = 128000));
  else if (K === "claude-sonnet-4-6") (($ = 32000), (q = 128000));
  else if (K === "claude-opus-4-6") (($ = 64000), (q = 128000));
  else if (K === "claude-opus-4-5" || K === "claude-sonnet-4-0" ||
           K === "claude-sonnet-4-5" || K === "claude-haiku-4-5") (($ = 32000), (q = 64000));
  …
  let _ = gEK(H);
  if (_?.max_tokens && _.max_tokens >= 4096) ((q = _.max_tokens), ($ = Math.min($, q)));
  return { default: $, upperLimit: q };
}

// READABLE (for understanding):
function getMaxOutputTokens(modelId) {
  let def, upper;
  const canonical = resolveModelCanonicalId(modelId);
  if      (canonical === "claude-opus-4-8") { def = 64000; upper = 128000; } // ← new, 64K/128K
  else if (canonical === "claude-opus-4-7") { def = 64000; upper = 128000; }
  else if (canonical === "claude-opus-4-6") { def = 64000; upper = 128000; }
  else if (/* opus-4-5 / sonnet-4-0 / sonnet-4-5 / haiku-4-5 */) { def = 32000; upper = 64000; }
  … // claude-3 families: 4096/8192
  // User override from per-model env config can raise the cap.
  const override = getModelEnvConfig(modelId);
  if (override?.max_tokens && override.max_tokens >= 4096) {
    upper = override.max_tokens;
    def = Math.min(def, upper);
  }
  return { default: def, upperLimit: upper };
}

// Mapping: LMH→getMaxOutputTokens, O7→resolveModelCanonicalId, gEK→getModelEnvConfig
```

Opus 4.8 inherits the **64K default / 128K upper-limit** tier shared by 4.6 and 4.7 — the
modern-Opus output budget — distinct from the 32K/64K tier of 4.5-and-earlier. The
companion `cEK` (cli_inner_pretty.js:130220-130222) returns `upperLimit - 1` for callers
that need a strict-less-than bound.

**Key insight:** the 1M-context *input* tier (`VP`, `[1m]`) and the 128K *output* cap
(`LMH`) are independent axes. A model can be 1M-input but still capped at 128K output —
they're separate constants resolved by separate functions, both keyed off the same
canonical id from `O7`.

---

## 7. Cost & fast mode (Opus 4.8 at 2×)

The pricing constants are plain rate tables (USD per Mtok). The three Opus-relevant ones:

```javascript
// ============================================
// OPUS_STANDARD_COST (BB) / OPUS_LEGACY_FAST_COST (Cx1) / OPUS_48_FAST_COST (bx1)
// Location: cli_inner_pretty.js:98526-98546
// ============================================

// ORIGINAL (for source lookup):
(BB = { inputTokens: 5,  outputTokens: 25,  promptCacheWriteTokens: 6.25, promptCacheReadTokens: 0.5, webSearchRequests: 0.01 }),
(Cx1 = { inputTokens: 30, outputTokens: 150, promptCacheWriteTokens: 37.5, promptCacheReadTokens: 3,   webSearchRequests: 0.01 }),
(bx1 = { inputTokens: 10, outputTokens: 50,  promptCacheWriteTokens: 12.5, promptCacheReadTokens: 1,   webSearchRequests: 0.01 }),

// READABLE (for understanding):
const OPUS_STANDARD_COST    = { inputTokens: 5,  outputTokens: 25,  /* …cache 6.25/0.5 */ }; // baseline 5/25
const OPUS_LEGACY_FAST_COST = { inputTokens: 30, outputTokens: 150, /* …cache 37.5/3  */ }; // old 4.6 fast = 6×
const OPUS_48_FAST_COST     = { inputTokens: 10, outputTokens: 50,  /* …cache 12.5/1  */ }; // 4.8 fast = 2×

// Mapping: BB→OPUS_STANDARD_COST, Cx1→OPUS_LEGACY_FAST_COST, bx1→OPUS_48_FAST_COST
```

Selection happens in `selectFastModePricing` (`S0H`):

```javascript
// ============================================
// selectFastModePricing (S0H) - 4.8 fast cost vs legacy fast cost vs standard
// Location: cli_inner_pretty.js:98451-98457
// ============================================

// ORIGINAL (for source lookup):
function S0H(H, $) {
  if (I9() && H) {
    if (O7($) === "claude-opus-4-8") return bx1;
    return Cx1;
  }
  return BB;
}

// READABLE (for understanding):
function selectFastModePricing(isFast, modelId) {
  if (isFastModeEnabled() && isFast) {
    if (resolveModelCanonicalId(modelId) === "claude-opus-4-8") return OPUS_48_FAST_COST; // 10/50
    return OPUS_LEGACY_FAST_COST;                                                          // 30/150
  }
  return OPUS_STANDARD_COST;                                                               // 5/25
}

// Mapping: S0H→selectFastModePricing, I9→isFastModeEnabled, O7→resolveModelCanonicalId
```

So **fast mode on Opus 4.8 is exactly 2× standard** (10/50 vs 5/25), a dramatic
improvement over the legacy 6× fast rate (30/150). `isFastModeEnabled` (`I9`)
(cli_inner_pretty.js:98189-98192) is `getActiveProvider() === "firstParty" && !disabled`,
and the user-facing unavailability reason is computed by `getFastModeUnavailableReason`
(`Ne`) (cli_inner_pretty.js:98216-98238). The cost resolver `resolveModelCost` (`mx1`)
(cli_inner_pretty.js:98467-98480) calls `selectFastModePricing` for the fast path and falls
back to the static `nr$` rate table otherwise, emitting `tengu_unknown_model_cost` for
unrecognized ids.

---

## 8. Effort levels & the high default for 4.8

### The enum grew: `low/medium/high/xhigh`

The persisted-settings enum is now four values (it was a four-value
`low/medium/high/max` with **no `xhigh`** in the 2.1.88 baseline):

```javascript
// ORIGINAL — settings schema (cli_inner_pretty.js:51690-51694):
effortLevel: y.enum(["low", "medium", "high", "xhigh"]).optional().catch(void 0)
  .describe("Persisted effort level for supported models."),
```

The **runtime** levels list `EFFORT_LEVELS_WITH_MAX` (`dN`) additionally includes `max`
(cli_inner_pretty.js:185009): `["low", "medium", "high", "xhigh", "max"]` — `max` is a
runtime capability not persistable via settings. The session-only `ultracode` boolean
(cli_inner_pretty.js:51695-51703) means "xhigh effort + standing dynamic-workflow
orchestration"; `e$7` (effortValueFromContext) maps `ultracode === true` to `"xhigh"` (cli_inner_pretty.js:185015; function body 185012-185017).

### Default effort: `high` for 4.8, `xhigh` for 4.7

```javascript
// ============================================
// getDefaultEffortForModel (q48) - per-model launch default effort
// Location: cli_inner_pretty.js:184987-184991
// ============================================

// ORIGINAL (for source lookup):
function q48(H) {
  if (O7(H) === "claude-opus-4-8") return "high";
  if (O7(H) === "claude-opus-4-7") return "xhigh";
  return "high";
}

// READABLE (for understanding):
function getDefaultEffortForModel(modelId) {
  if (resolveModelCanonicalId(modelId) === "claude-opus-4-8") return "high";  // ← 4.8 = high
  if (resolveModelCanonicalId(modelId) === "claude-opus-4-7") return "xhigh"; // 4.7 stayed xhigh
  return "high";
}

// Mapping: q48→getDefaultEffortForModel, O7→resolveModelCanonicalId
```

This is the **medium→high default-effort convergence** the module summary calls out: where
2.1.88 used `medium` for subscription tiers, and 2.1.117 bumped Pro/Max to `high`, and 4.7
launched at `xhigh`, **4.8 settles on `high`** (`getDefaultEffortForModel`, `q48`). The
launch default is "pinned" until the
user changes effort, which "unpins" it via `unpinOpusLaunchEffortLatch` (`SI`):

```javascript
// ORIGINAL — AkH / SI (cli_inner_pretty.js:184896-184908):
function AkH(H) {
  let $ = O7(H);
  if ($.includes("opus-4-7")) return !b$().unpinOpus47LaunchEffort;
  if ($.includes("opus-4-8")) return !b$().unpinOpus48LaunchEffort;
  return !1;
}
function SI() {
  O8((H) => H.unpinOpus47LaunchEffort && H.unpinOpus48LaunchEffort
    ? H : { ...H, unpinOpus47LaunchEffort: !0, unpinOpus48LaunchEffort: !0 });
}
```

`isOpusLaunchDefaultActive` (`AkH`) returns true while the per-model launch latch
(`unpinOpus48LaunchEffort`) is still false — i.e. the user has never overridden effort, so
the launch default (`high`) should apply. Once the user sets effort explicitly, `SI` flips
**both** the 4.7 and 4.8 latches, after which user settings take over.

### Final effort resolution: `resolveAppliedEffort` (`or`)

```javascript
// ============================================
// resolveAppliedEffort (or) - merge launch default, env, and settings; clamp to capability
// Location: cli_inner_pretty.js:184909-184919
// ============================================

// ORIGINAL (for source lookup):
function or(H, $) {
  if (!A2(H)) return;
  let q = AkH(H), K = q48(H), _ = zkH();
  if (_ === null) return q ? K : void 0;
  let z = _ ?? (q ? K : void 0) ?? $ ?? K;
  if (z === "max" && !ow$(H)) return "high";
  if (z === "xhigh" && !ycH(H)) return "high";
  return z;
}

// READABLE (for understanding):
function resolveAppliedEffort(modelId, requestedEffort) {
  if (!modelSupportsEffort(modelId)) return undefined;       // model can't do effort at all
  const launchActive = isOpusLaunchDefaultActive(modelId);
  const launchDefault = getDefaultEffortForModel(modelId);
  const envEffort = readEnvEffortLevel();                    // CLAUDE_CODE_EFFORT_LEVEL
  if (envEffort === null) return launchActive ? launchDefault : undefined;
  let chosen = envEffort ?? (launchActive ? launchDefault : undefined) ?? requestedEffort ?? launchDefault;
  if (chosen === "max"   && !modelSupportsMaxEffort(modelId))   return "high"; // clamp down
  if (chosen === "xhigh" && !modelSupportsXhighEffort(modelId)) return "high"; // clamp down
  return chosen;
}

// Mapping: or→resolveAppliedEffort, A2→modelSupportsEffort, AkH→isOpusLaunchDefaultActive,
//          q48→getDefaultEffortForModel, zkH→readEnvEffortLevel,
//          ow$→modelSupportsMaxEffort, ycH→modelSupportsXhighEffort
```

The clamp lines are crucial: even if a user *requests* `xhigh` or `max`, the model must
support it. Per the capability functions, **`xhigh` is supported only by Opus 4.8 and 4.7**
(`modelSupportsXhighEffort`/`ycH` returns true only for those two, cli_inner_pretty.js:184850),
and the constant `_P6 = "Opus 4.8/4.7 only"` (cli_inner_pretty.js:184993) is the label shown
for xhigh. `max` is gated by `modelSupportsMaxEffort` (`ow$`) (cli_inner_pretty.js:184816-184833).

### The effort capability gate `modelSupportsEffort` (`A2`)

```javascript
// ORIGINAL — A2 (cli_inner_pretty.js:184798-184814):
function A2(H) {
  let $ = si(H, "effort");
  if ($ !== void 0) return $;
  let q = O7(H);
  if (q.includes("claude-3-") || q === "claude-opus-4-0" || q === "claude-opus-4-1" ||
      q === "claude-sonnet-4-0" || q === "claude-sonnet-4-5" || q === "claude-haiku-4-5") return !1;
  if (xH(process.env.CLAUDE_CODE_ALWAYS_ENABLE_EFFORT)) return !0;
  if (q === "claude-opus-4-8" || q === "claude-opus-4-7" || q === "claude-opus-4-6" || q === "claude-sonnet-4-6") return !0;
  return oR(ew(H));
}
```

`modelSupportsEffort` is consulted (a) per-model via the env-driven `si` capability reader
(cli_inner_pretty.js:130257-130275), (b) by an explicit allow-list (4.6/4.7/4.8 + sonnet-4.6),
and (c) by the `CLAUDE_CODE_ALWAYS_ENABLE_EFFORT` escape hatch. Critically, **the effort
request param is now gated on `A2()` before injection** to avoid 400 errors on
effort-less models:

```javascript
// ORIGINAL — request builder gate (cli_inner_pretty.js:568321):
...(A2(L) && { effort: { level: Ev(L, w) } }),

// And in the params assembler NLz (cli_inner_pretty.js:556648-556656):
function NLz(H, $, q, K, _) {
  if (!A2(_)) { delete $.effort; return; }   // strip effort entirely if unsupported
  if ("effort" in $) return;
  if (H === void 0) K.push(CUH);
  else if (typeof H === "string") (($.effort = H), K.push(CUH));
}
```

`EFFORT_BETA_HEADER` (`CUH`) is `effort-2025-11-24` (cli_inner_pretty.js:98127); it is only
pushed onto the beta-header list when effort is actually being sent.

### `/effort` slider relabel: Speed/Intelligence → Faster/Smarter

The slider component now renders `Faster` / `Smarter` (was `Speed` / `Intelligence`):

```javascript
// ORIGINAL — effort slider labels (cli_inner_pretty.js:527377-527383):
W
  ? Kq.createElement(kF, { text: `${c}Faster${b}Smarter${r}`, col: -l, row: sYz, ripple: W })
  : Kq.createElement(Kq.Fragment, null,
      Kq.createElement(k, null, "Faster"),
      Kq.createElement(k, null, b),
      Kq.createElement(k, null, "Smarter"));
```

> Cross-val: 2.1.88 had a four-value effort enum without `xhigh` and labeled the slider
> Speed/Intelligence. The `xhigh` level, `ultracode`, the `Faster/Smarter` relabel, and the
> `A2()`-gated injection are all **post-2.1.88**. Confidence: HIGH (enum and gate read
> directly; the Speed/Intelligence prior is from the scout dossier/changelog).

---

## 9. The 2.1.156 thinking-signature hotfix (`B87` → `cG4`)

The flagship 2.1.156 hotfix is a defense against Opus 4.8 returning **modified/invalid
thinking-block signatures** that the API then rejects with a 400 on the next turn.

### `isThinkingSignatureError` (`B87`) — the matcher

```javascript
// ============================================
// isThinkingSignatureError (B87) - 400 matcher for bad thinking-block signatures
// Location: cli_inner_pretty.js:186575-186583
// ============================================

// ORIGINAL (for source lookup):
function B87(H) {
  if (!(H instanceof rq) || H.status !== 400) return !1;
  let $ = H.message.toLowerCase();
  if ($.includes("signature in thinking block")) return !0;
  return (
    ($.includes("thinking block") || $.includes("`thinking`") || $.includes("redacted_thinking")) &&
    ($.includes("cannot be modified") || $.includes("invalid signature"))
  );
}

// READABLE (for understanding):
function isThinkingSignatureError(err) {
  if (!(err instanceof ApiError) || err.status !== 400) return false;
  const msg = err.message.toLowerCase();
  if (msg.includes("signature in thinking block")) return true;
  return (msg.includes("thinking block") || msg.includes("`thinking`") || msg.includes("redacted_thinking"))
      && (msg.includes("cannot be modified") || msg.includes("invalid signature"));
}

// Mapping: B87→isThinkingSignatureError, rq→ApiError
```

A sibling matcher `matchThinkingTypeError` (`p87`) (cli_inner_pretty.js:186584-186590)
handles a different 400 — `thinking.type=enabled/adaptive not supported` — and drives a
*type-flip* retry (cli_inner_pretty.js:557400-557411), separate from signature stripping.

### The retry path (cli_inner_pretty.js:557413-557427)

```javascript
// ORIGINAL — retry dispatch:
if (B87(m8)) {
  let C6 = cG4(b);
  if (C6 !== b)
    return ((b = C6),
      N("[thinking] server rejected a thinking-block signature; stripping signed blocks and retrying.", { level: "warn" }),
      d("tengu_thinking_signature_strip_retry", { query_source: vj(z.querySource) ?? "", model: z.model }),
      "retry:thinking-signature-strip");
}
```

When `isThinkingSignatureError` fires, the message history is rewritten by
`stripSignedThinkingBlocks` (`cG4`); if that changed anything, the request retries with the
sanitized history and emits `tengu_thinking_signature_strip_retry`.

### `stripSignedThinkingBlocks` (`cG4`) + `isSignedThinkingBlock` (`gG4`)

```javascript
// ============================================
// stripSignedThinkingBlocks (cG4) / isSignedThinkingBlock (gG4)
// Location: cli_inner_pretty.js:446086-446090, 446238-446252
// ============================================

// ORIGINAL (for source lookup):
function gG4(H) {
  if (H.type === "redacted_thinking") return !0;
  if (H.type === "thinking" && "signature" in H && H.signature) return !0;
  return !1;
}
function cG4(H) {
  let $ = !1,
    q = H.map((K) => {
      if (K.type !== "assistant" || !Array.isArray(K.message.content)) return K;
      let _ = K.message.content, z = _.filter((Y) => !gG4(Y));
      if (z.length === _.length) return K;
      $ = !0;
      let A = z.filter((Y) => Y.type !== "text" || Boolean(Y.text?.trim()));
      if (A.length === 0 || A.every((Y) => Y.type === "thinking" || Y.type === "redacted_thinking"))
        A.push({ type: "text", text: "[Thinking removed]", citations: [] });
      return { ...K, message: { ...K.message, content: A } };
    });
  return $ ? q : H;
}

// READABLE (for understanding):
function isSignedThinkingBlock(block) {
  if (block.type === "redacted_thinking") return true;            // server-redacted = signed
  if (block.type === "thinking" && block.signature) return true; // signed thinking
  return false;
}
function stripSignedThinkingBlocks(messages) {
  let changed = false;
  const out = messages.map((m) => {
    if (m.type !== "assistant" || !Array.isArray(m.message.content)) return m;
    const kept = m.message.content.filter((b) => !isSignedThinkingBlock(b));
    if (kept.length === m.message.content.length) return m; // nothing signed → untouched
    changed = true;
    let clean = kept.filter((b) => b.type !== "text" || Boolean(b.text?.trim()));
    if (clean.length === 0 || clean.every((b) => b.type === "thinking" || b.type === "redacted_thinking"))
      clean.push({ type: "text", text: "[Thinking removed]", citations: [] }); // never leave empty
    return { ...m, message: { ...m.message, content: clean } };
  });
  return changed ? out : messages;
}

// Mapping: cG4→stripSignedThinkingBlocks, gG4→isSignedThinkingBlock
```

Related sanitizers in the same module: `filterSignedThinkingBlocks` (`HF6`)
(cli_inner_pretty.js:446218-446234) is the predicate-driven generic stripper that `cG4`'s
cross-model cousin `stripCrossModelThinkingBlocks` (`dG4`) (cli_inner_pretty.js:446235-446237)
uses to drop signed blocks authored by a *different* model; and `filterTrailingThinkingBlocks`
(`pQ_`) (cli_inner_pretty.js:446091-446110) trims trailing thinking blocks from the last
assistant turn.

**Key insight:** `cG4` never leaves an assistant message with *only* thinking content or
*empty* content — it injects a `[Thinking removed]` placeholder. An assistant turn with no
non-thinking content would itself be a 400, so the fix is careful not to trade one error
for another.

> Cross-val: thinking-block signing/redaction postdates 2.1.88; `B87`/`cG4`/`gG4` are
> **NEW** in this hotfix line. Confidence: HIGH (matcher string set and retry tag verified).

---

## 10. End-to-end: onboarding Opus 4.8 (the touch-point checklist)

Putting it together, registering a new Opus model in this codebase touches a fixed set of
sites — and 4.8 hits every one:

```
1. Config object        Xi$ (firstParty/…/gateway + eagerInputStreaming)  91825-91833
2. Registry key         j3.opus48 = Xi$                                    91848
3. Vertex region row    Sh9 += [claude-opus-4-8, VERTEX_REGION_…_4_8_OPUS] 3623
4. Canonical matcher    HD: includes("claude-opus-4-8") FIRST             98752
5. Default selector     TT: firstParty → opus48                           98724
6. Labels               $w / ZOH: "Opus 4.8 (1M context)"                 98920, 98831
7. Membership           C0H / Wj: + claude-opus-4-8                       98698, 98262
8. Output tokens        LMH: 64000 / 128000                               130198
9. Effort capability    A2 / ow$ / ycH / q48: high default, xhigh-capable 184812, 184850, 184988
10. Cost / fast mode     S0H / bx1: fast = 2× (10/50)                      98453, 98540
```

The single shared chokepoint is `resolveModelCanonicalId` (`O7`) → `normalizeModelIdToCanonical`
(`HD`): **every** downstream decision (label, cost, effort, output cap, membership) funnels
the raw id through canonicalization first, so each site only ever switches on the clean
`claude-opus-4-8` string. That is the architectural reason a model launch is mechanical:
one matcher entry (`HD`) makes 4.8 *recognizable everywhere*, and the per-site `switch`/`if`
ladders just add their one new case.

---

## Confidence summary

| Claim group | Confidence | Basis |
|-------------|-----------|-------|
| 4.8 is new; config shape grew (anthropicAws/mantle/gateway/eagerInputStreaming) | HIGH | 2.1.88 configs.ts read directly; ceiling at opus46 |
| Registry/canonical/label/membership wiring | HIGH | All lines read in 2.1.156 bundle |
| Canonical resolver ARN path | HIGH | Matches v2.1.122 precursor doc |
| `TT` three-way default split (4.8/4.7/4.6) | MEDIUM | No 2.1.88 analogue; inferred from data |
| Effort `xhigh`/`ultracode`/`Faster/Smarter`/`A2`-gate | HIGH | Enum, gate, slider read directly |
| Thinking-signature hotfix (`B87`/`cG4`) | HIGH | Matcher, retry tag, stripper read directly |
| 06/01 removal of `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` | MEDIUM | Env var present; removal date from changelog/scout |
