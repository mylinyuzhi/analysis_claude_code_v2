# Why Lean: Token Economy, Capability, and Controlled Rollout

> Module 44_lean_prompt — the *"why"* layer behind the lean system prompt. The gate
> predicate (`X3`/`c45`/`d45`) is analyzed in
> [lean_prompt_eligibility_gate.md](./lean_prompt_eligibility_gate.md); the section-by-section
> body diff is in [lean_vs_full_prompt_diff.md](./lean_vs_full_prompt_diff.md). This doc
> covers the **design rationale** (token economy + model capability), the **rollout
> machinery** (the layered override stack that lets Anthropic dark-launch lean per model
> without a client release), and the **relationship to the older `CLAUDE_CODE_SIMPLE`
> path**. New in v2.1.154; changelog line 12: *"The lean system prompt is now the default
> for all models except Haiku, Sonnet, and Opus 4.7 and earlier."*

## Related Symbols

> Symbol mappings live in the central index — do not duplicate the tables here:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (System Prompts, Agent Loop, Tools)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Model selection, Prompt building)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key symbols in this document:

- `isLeanSystemPrompt` (`X3`) — memoized lean-vs-full predicate; the override precedence lives in its body (cli_inner_pretty.js:143864, 143872-143877).
- `isFullPromptModel` (`c45`) — model-class allow-list that keeps the FULL prompt; the capability gate (cli_inner_pretty.js:143847-143862).
- `isForcedLeanModel` (`d45`) — server-pushed / growthbook force-lean override (cli_inner_pretty.js:143839-143845).
- `isFirstPartyProvider` (`UA`) — provider-class predicate; controls the conservative third-party fall-through (cli_inner_pretty.js:91891-91893).
- `normalizeModelId` (`O7`) — canonical model id resolver, used by `c45`/`d45` (cli_inner_pretty.js:98770-98778).
- `isSimplePromptMode` (`cKq`) — `CLAUDE_CODE_SIMPLE` hard short-circuit ("radically simple" path) (cli_inner_pretty.js:555588-555590).
- `buildSystemPromptSections` (`N0`) — main assembler; the simple path and the lean/full branch both live here (cli_inner_pretty.js:555614-555658).
- `leanHarnessSection` (`oXz`) — the single compact lean body (5 bullets) (cli_inner_pretty.js:555591-555607).
- `makeSection` (`DE`) — wraps a section name + compute closure into a cacheable record (cli_inner_pretty.js:271350-271352).
- `computeCachedSections` (`uv7`) — reads/populates the section cache, computing each section at most once (cli_inner_pretty.js:271353-271362).
- `getSystemPromptSectionCache` (`SYH`) — accessor for the per-session section cache Map (cli_inner_pretty.js:2098, 3196-3197).
- `setSystemPromptSectionCacheEntry` (`Qm8`) — writes a computed section into the cache (cli_inner_pretty.js:3199-3201).
- `clearSystemPromptSectionCache` (`gm8`) — clears the section cache (cli_inner_pretty.js:2205, 3202-3204).
- `growthbookFlag` (`V$`) — feature-flag accessor; reads `tengu_velvet_cascade` (cli_inner_pretty.js:141101-141112).
- `clientDataAccessor` (`b$`) — reads `clientDataCache` (server-pushed config), incl. `simple_system_prompt` (cli_inner_pretty.js:142535+, 143841).
- `parseBoolTrue` (`xH`) — explicit-true env parser (cli_inner_pretty.js:1795-1799).
- `parseBoolFalse` (`k4`) — explicit-false env parser (cli_inner_pretty.js:1801-1806).
- `latestModelIds` (`i6$`) — `{opus, sonnet, haiku}` latest-id map (cli_inner_pretty.js:555940).
- `getTodoToolDescription` (`z44`) — lean-aware tool-description picker (lean = terse `Y0_`, full = `f0_`) (cli_inner_pretty.js:376250-376251).

---

## TL;DR

The lean system prompt is a **deliberate token-economy + model-capability trade**:

1. **Token economy.** The full body is six multi-paragraph sections
   (`QXz`+`gXz`+`dXz`+`cXz`+`lXz`+`rXz`, cli_inner_pretty.js:555650-555653). The lean body
   collapses that to one 5-bullet "# Harness" section (`oXz`, cli_inner_pretty.js:555591-555607;
   the five ` - ` bullets are at 555602-555606).
   Because the static sections are memoized in a per-session cache (`systemPromptSectionCache`
   via `SYH`/`uv7`/`DE`, cli_inner_pretty.js:2098, 3196-3204, 271350-271362), the cost is
   re-paid in *cache-read* tokens every turn, so shrinking the body reclaims context budget
   for the actual conversation across long sessions.

2. **Capability gate (`c45`, cli_inner_pretty.js:143847-143862).** Lean is OFF (full prompt
   kept) for `claude-3-*`, `haiku`, `sonnet`, and Opus `4-0/4-1/4-5/4-6/4-7`. Lean is ON for
   `claude-opus-4-8` and for *unknown first-party* model ids. The hypothesis: capable frontier
   models infer the desired behavior from terse guidance, while older/smaller models need the
   explicit scaffolding. Unknown ids on **third-party** providers (Bedrock/Vertex/Foundry)
   default to FULL via `!UA()` (cli_inner_pretty.js:143862) — conservative, because the
   client cannot vouch for an arbitrary endpoint's model strength.

3. **Controlled rollout.** Three override surfaces (env → `clientDataCache` → growthbook,
   cli_inner_pretty.js:143872-143877, 143839-143845) let Anthropic flip additional models to
   lean *server-side, without shipping a new client*.

4. **Relationship to `CLAUDE_CODE_SIMPLE`.** Lean is "still full-featured, just terse." The
   older `CLAUDE_CODE_SIMPLE` (`cKq`, cli_inner_pretty.js:555588-555590) is "near-empty" — its
   `N0` branch (cli_inner_pretty.js:555614-555621) returns just CWD + Date. They are different
   axes, checked in sequence inside `N0`.

5. **NEW post-2.1.88.** v2.1.88 `getSystemPrompt` (src/constants/prompts.ts:444-454) has the
   `CLAUDE_CODE_SIMPLE` short-circuit but **no per-model lean/full branch**. The `X3`/`c45`/
   `d45` gate is net-new in v2.1.154. Confidence **HIGH**.

---

## 1. Token economy — what lean actually reclaims

### What it does

Every assistant turn re-sends the system prompt to the API. The full prompt for an
eligible-but-not-lean model is assembled by `N0` (`buildSystemPromptSections`,
cli_inner_pretty.js:555614-555658) and ends in a six-section body. Lean swaps that body for a
single compact section. The size delta is the whole point.

### Section accounting (read from the bundle)

The terminal return of `N0` (cli_inner_pretty.js:555650-555657) is the swap point:

```javascript
// ============================================
// buildSystemPromptSections (N0) - lean-vs-full body swap (terminal return)
// Location: cli_inner_pretty.js:555650-555657
// ============================================

// ORIGINAL (for source lookup):
return [
  ...(_
    ? [oXz(f)]
    : [QXz(f), gXz(), f === null || f.keepCodingInstructions === !0 ? dXz() : null, cXz($), lXz(M), rXz()]),
  ...(K?.excludeDynamicSections ? [RFK($)] : []),
  ...(WMH() ? [et] : []),
  ...D,
].filter((X) => X !== null);

// READABLE (for understanding):
return [
  ...(isLean
    ? [leanHarnessSection(outputStyle)]                       // ONE section
    : [ buildFullIntro(outputStyle),                          // SIX sections:
        buildFullSystem(),                                    //   # System
        outputStyle === null || outputStyle.keepCodingInstructions === true
          ? buildFullDoingTasks() : null,                     //   # Doing tasks (gated)
        buildFullExecutingActions(model),                     //   # Executing actions with care
        buildFullUsingTools(toolNameSet),                     //   # Using your tools
        buildFullToneAndStyle() ]),                           //   # Tone and style
  ...(opts?.excludeDynamicSections ? [staticEnvInfo(model)] : []),
  ...(isVerifyArmActive() ? [verifyPromptText] : []),
  ...computedDynamicSections,                                 // the DE(...)-wrapped sections
].filter((section) => section !== null);

// Mapping: N0→buildSystemPromptSections, _→isLean, f→outputStyle, oXz→leanHarnessSection,
//          QXz→buildFullIntro, gXz→buildFullSystem, dXz→buildFullDoingTasks,
//          cXz→buildFullExecutingActions, lXz→buildFullUsingTools, rXz→buildFullToneAndStyle,
//          D→computedDynamicSections, K→opts, M→toolNameSet, $→model
```

Counting the static body sections by what `N0` returns:

| Body | Sections returned | Source |
|------|-------------------|--------|
| FULL | 6: `QXz` intro + `gXz` # System + `dXz` # Doing tasks (gated) + `cXz` # Executing actions + `lXz` # Using your tools + `rXz` # Tone and style | cli_inner_pretty.js:555653 |
| LEAN | 1: `oXz` — a single "# Harness" section, 5 bullets | cli_inner_pretty.js:555591-555607, 555652 |

(That count table describes the *body* fan-out and is not a symbol-mapping table.)

The lean section in full (cli_inner_pretty.js:555591-555607): a one-line role statement, the
shared `gKq` security block, and exactly five "# Harness" bullets (the five ` - ` lines at
cli_inner_pretty.js:555602-555606) — markdown rendering,
permission-mode semantics, `<system-reminder>`/hooks trust, prefer dedicated tools + parallel
calls, and `file_path:line_number` linking. Contrast that with just **two** of the full
sections to feel the scale:

- `dXz` (# Doing tasks, cli_inner_pretty.js:555461-555493) is ~12 multi-sentence bullets,
  including the verbose anti-over-engineering paragraph and a feedback block carrying the build
  metadata.
- `cXz` (# Executing actions with care, cli_inner_pretty.js:555499-555509) is a single
  ~400-word paragraph plus a four-item example list — by itself longer than the entire lean
  body.

So the body shrinks from six sections (several of them multi-paragraph) to one six-bullet
section: roughly an order-of-magnitude reduction in the static instruction text.

### The cache angle: why "reclaim context for long sessions" is the right framing

The dynamic sections that `N0` appends (the `D`/`computedDynamicSections` spread,
cli_inner_pretty.js:555629-555649) are built through `makeSection` (`DE`,
cli_inner_pretty.js:271350-271352) and resolved by `computeCachedSections` (`uv7`,
cli_inner_pretty.js:271353-271362):

```javascript
// ============================================
// makeSection / computeCachedSections (DE / uv7) - per-session section memoization
// Location: cli_inner_pretty.js:271350-271362
// ============================================

// ORIGINAL (for source lookup):
function DE(H, $) {
  return { name: H, compute: $, cacheBreak: !1 };
}
async function uv7(H) {
  let $ = SYH();
  return Promise.all(
    H.map(async (q) => {
      if (!q.cacheBreak && $.has(q.name)) return $.get(q.name) ?? null;
      let K = await q.compute();
      return (Qm8(q.name, K), K);
    }),
  );
}

// READABLE (for understanding):
function makeSection(name, compute) {
  return { name, compute, cacheBreak: false };
}
async function computeCachedSections(sections) {
  let cache = getSystemPromptSectionCache();
  return Promise.all(
    sections.map(async (section) => {
      if (!section.cacheBreak && cache.has(section.name)) return cache.get(section.name) ?? null;
      let value = await section.compute();
      return (setSystemPromptSectionCacheEntry(section.name, value), value);
    }),
  );
}

// Mapping: DE→makeSection, uv7→computeCachedSections, H→sections, $→cache, q→section,
//          SYH→getSystemPromptSectionCache, Qm8→setSystemPromptSectionCacheEntry
```

Two things follow from this design:

1. **The cache de-duplicates *compute*, not *tokens*.** `getSystemPromptSectionCache` (`SYH`,
   cli_inner_pretty.js:3196-3197) returns a Map keyed by section *name*. Each section is
   `compute()`d at most once per session and then served from the Map. This avoids
   re-running every section's builder on every turn (some hit growthbook/clientData/disk), but
   the *resulting text* is still part of the prompt every turn.

2. **Therefore the only lasting per-turn win is shrinking the text itself.** Whether a section
   is cached (compute-once) is orthogonal to how many *tokens* it costs per turn. The lean swap
   targets the static body — the part the cache cannot make cheaper in token terms — which is
   exactly why "lean reclaims context for long sessions" is accurate: a smaller fixed prefix
   leaves more of the model's window for the growing conversation. The cache (`SYH`/`Qm8`/`gm8`,
   cli_inner_pretty.js:3196-3204; `clearSystemPromptSectionCache` exported as `gm8` at 2205)
   handles *latency*; the lean swap handles *tokens*.

### Why this approach (vs. alternatives)

- **Alternative: compress every section uniformly.** Rejected in favor of a hard top-level
  swap because the lean body is not a summarization of the full body — it is a *different,
  capability-targeted* instruction set written for models that don't need the scaffolding.
  Note the lean section even rewrites sub-guidance (e.g. anti-verbosity `uXz` returns a single
  line under lean — "Write code that reads like the surrounding code…", cli_inner_pretty.js:555400
  — vs the multi-paragraph "# Text output" block at 555401-555412).
- **Alternative: drop sections at runtime by token budget.** Rejected: that would make the
  prompt nondeterministic per turn and defeat prompt caching (a changing prefix invalidates the
  cache). The model-keyed swap is computed once and memoized (`X3` is wrapped in `v8`/`cx8`,
  cli_inner_pretty.js:143872), so the prefix is stable for the whole session.

**Key insight:** lean is not "the full prompt, minus words." It is a second, parallel prompt
authored for capable models, selected by a stable model-keyed predicate so prompt caching stays
intact while the per-turn token floor drops by roughly an order of magnitude.

---

## 2. The capability gate — why these models, in plain English

### What it does

`isFullPromptModel` (`c45`, cli_inner_pretty.js:143847-143862) is the allow-list of models that
**keep the full, verbose prompt**. `X3` then negates it (`!c45(model)`), so "not on the full
list" ⇒ lean.

```javascript
// ============================================
// isFullPromptModel (c45) - capability allow-list (true ⇒ keep FULL prompt)
// Location: cli_inner_pretty.js:143847-143862
// ============================================

// ORIGINAL (for source lookup):
function c45(H) {
  if (gM6(H)) return !1;
  let $ = O7(H);
  if (
    $.includes("claude-3-") || $.includes("haiku") || $.includes("sonnet") ||
    $ === "claude-opus-4-0" || $ === "claude-opus-4-1" || $ === "claude-opus-4-5" ||
    $ === "claude-opus-4-6" || $ === "claude-opus-4-7"
  )
    return !0;
  if ($ === "claude-opus-4-8") return !1;
  return !UA();
}

// READABLE (for understanding):
function isFullPromptModel(rawModelId) {
  if (isEarlyAccessModel(rawModelId)) return false;          // -eap ids → not "full" (go lean)
  let modelId = normalizeModelId(rawModelId);
  if (
    modelId.includes("claude-3-") || modelId.includes("haiku") || modelId.includes("sonnet") ||
    modelId === "claude-opus-4-0" || modelId === "claude-opus-4-1" || modelId === "claude-opus-4-5" ||
    modelId === "claude-opus-4-6" || modelId === "claude-opus-4-7"
  )
    return true;                                             // older/smaller → keep FULL prompt
  if (modelId === "claude-opus-4-8") return false;          // frontier → LEAN
  return !isFirstPartyProvider();                           // unknown id: full off 3p, lean on 1p
}

// Mapping: c45→isFullPromptModel, gM6→isEarlyAccessModel, O7→normalizeModelId,
//          UA→isFirstPartyProvider, H→rawModelId, $→modelId
```

### Why keep the FULL prompt for Haiku / Sonnet / Opus ≤ 4.7

The verbose multi-section prompt is *scaffolding*: it spells out the desired behavior
explicitly (the # Doing tasks anti-over-engineering rules `dXz`:555461-555493; the long #
Executing-actions-with-care risk taxonomy `cXz`:555499-555509; the # Using-your-tools
parallel-call discipline `lXz`:555511-555534). Smaller or older models follow behavior more
reliably when it is stated directly and at length. Removing that scaffolding from a weaker model
risks regressions (over-engineering, unsafe destructive actions, missed parallelism), so they
keep the full instruction set. The cost (more tokens per turn) is accepted because these models
need the guidance more than they need the reclaimed context.

### Why go LEAN for Opus 4.8 and unknown first-party models

`claude-opus-4-8` is hard-coded to lean (cli_inner_pretty.js:143861). The bet is that a frontier
model *infers* the same behavior from a terse # Harness section — it already knows how to write
idiomatic code, confirm before risky actions, and parallelize tool calls without being told at
paragraph length. The same logic extends to **unknown first-party ids** (`!UA()` fall-through,
cli_inner_pretty.js:143862, with `UA` at 91891-91893): an id Claude Code has never heard of, but
served from a first-party / `anthropicAws` / `gateway` endpoint, is presumed to be a *new
Anthropic frontier model* (Anthropic only ships strong models forward), so it gets lean by
default — and `latestModelIds` (`i6$`, cli_inner_pretty.js:555940) shows `opus` already pointing
at `claude-opus-4-8`, the lean default.

### Why third-party providers default to FULL via `!UA()`

```javascript
// ============================================
// isFirstPartyProvider (UA) - provider-class gate behind c45's fall-through
// Location: cli_inner_pretty.js:91891-91893
// ============================================

// ORIGINAL (for source lookup):
function UA(H = Zq()) {
  return H === "firstParty" || H === "anthropicAws" || H === "gateway";
}

// READABLE (for understanding):
function isFirstPartyProvider(provider = currentProvider()) {
  return provider === "firstParty" || provider === "anthropicAws" || provider === "gateway";
}

// Mapping: UA→isFirstPartyProvider, Zq→currentProvider, H→provider
```

For an **unknown** model id, `c45` returns `!UA()`. On Bedrock / Vertex / Foundry (anything not
in the first-party set), `UA()` is `false`, so `!UA()` is `true` ⇒ `c45` returns `true` ⇒ **full
prompt**. This is the conservative branch: the client cannot vouch for an arbitrary
customer-hosted endpoint's model strength (a Bedrock deployment could be running an older or
weaker model under a custom id), so it defaults to the safe, fully-scaffolded prompt. Known ids
(haiku/sonnet/opus-4-x) are still classified by name regardless of provider — the `!UA()`
fall-through only governs *ids the client doesn't recognize*.

```
                       isFullPromptModel(model)  →  FULL (true) / LEAN (false)
                       ─────────────────────────────────────────────────────
  -eap suffix                                     →  LEAN  (early-access ⇒ frontier)
  claude-3-* / *haiku* / *sonnet*                 →  FULL  (smaller models need scaffolding)
  opus-4-0/4-1/4-5/4-6/4-7                         →  FULL  (older opus)
  opus-4-8                                         →  LEAN  (frontier, infers behavior)
  unknown id, first-party / anthropicAws / gateway →  LEAN  (presumed new frontier model)
  unknown id, Bedrock / Vertex / Foundry           →  FULL  (conservative: unknown strength)
```

**Key insight:** the gate encodes a single belief — *capability correlates with id recency and
provenance*. Recent first-party = capable = lean; older/smaller or unknown-third-party =
keep the safety scaffolding. The `!UA()` fall-through is the "when in doubt, scaffold" default.

---

## 3. Controlled rollout — the layered override stack

### What it does

`X3` (`isLeanSystemPrompt`, cli_inner_pretty.js:143872-143877) does **not** start at the model
gate. It first consults a hard env override, and `c45`'s lean answer can be *forced on* by
`d45` regardless of model class. This three-surface stack is the rollout mechanism: it lets
Anthropic dark-launch lean on additional models server-side, then promote it permanently in a
later client release.

```javascript
// ============================================
// isLeanSystemPrompt (X3) - override precedence (env → model gate → force-lean)
// Location: cli_inner_pretty.js:143872-143877
// ============================================

// ORIGINAL (for source lookup):
X3 = v8((H) => {
  if (!H) return !1;
  if (xH(process.env.CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT)) return !0;
  if (k4(process.env.CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT)) return !1;
  return !c45(H) || d45(H);
});

// READABLE (for understanding):
isLeanSystemPrompt = memoize((model) => {
  if (!model) return false;                                          // no model ⇒ full
  if (parseBoolTrue(process.env.CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT)) return true;   // hard override: lean
  if (parseBoolFalse(process.env.CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT)) return false; // hard override: full
  return !isFullPromptModel(model) || isForcedLeanModel(model);     // gate, OR server force-lean
});

// Mapping: X3→isLeanSystemPrompt, v8→memoize, H→model, xH→parseBoolTrue, k4→parseBoolFalse,
//          c45→isFullPromptModel, d45→isForcedLeanModel
```

### Surface 1 — hard env override `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT`

Checked first (cli_inner_pretty.js:143874-143875). Explicit-true (`xH`, parses
`1/true/yes/on`) forces lean for *any* model; explicit-false (`k4`, parses `0/false/no/off`)
forces full. This is the developer/operator escape hatch and the per-process kill-switch — it
short-circuits the model gate entirely. It is highest precedence so an operator can always
override whatever the server pushes.

### Surface 2 — server-pushed `clientDataCache.simple_system_prompt` (per-model map)

Inside `isForcedLeanModel` (`d45`, cli_inner_pretty.js:143839-143845):

```javascript
// ============================================
// isForcedLeanModel (d45) - server-pushed + growthbook force-lean overrides
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
function isForcedLeanModel(rawModelId) {
  let modelId = normalizeModelId(rawModelId);
  let perModelMap = clientDataAccessor().clientDataCache?.simple_system_prompt;        // server push
  if (typeof perModelMap === "object" && perModelMap !== null &&
      Object.entries(perModelMap).some(([key, on]) => on === true && modelId.includes(key)))
    return true;
  let velvetCascade = growthbookFlag("tengu_velvet_cascade", null);                    // growthbook
  if (typeof velvetCascade !== "object" || velvetCascade === null ||
      !("models" in velvetCascade) || !Array.isArray(velvetCascade.models)) return false;
  return velvetCascade.models.some((m) => typeof m === "string" && modelId.includes(m));
}

// Mapping: d45→isForcedLeanModel, O7→normalizeModelId, b$→clientDataAccessor,
//          V$→growthbookFlag, H→rawModelId, $→modelId, q→perModelMap, K→velvetCascade
```

`clientDataCache.simple_system_prompt` (cli_inner_pretty.js:143841) is a server-pushed object —
a per-model map of `{ "<modelId-fragment>": true }`. `clientDataAccessor` (`b$`,
cli_inner_pretty.js:142535+) reads the on-disk config blob refreshed from the server. Any model
whose normalized id *contains* a key marked `true` is forced lean. This is the operationally
fastest surface: it ships with the next config refresh, no growthbook experiment required.
Note the matching is `includes()` substring, not exact equality — so a key like `"opus-4-9"`
would catch any future id containing that fragment.

### Surface 3 — `tengu_velvet_cascade` growthbook flag

Also in `d45` (cli_inner_pretty.js:143843-143845). `growthbookFlag` (`V$`,
cli_inner_pretty.js:141101-141112) reads the `tengu_velvet_cascade` experiment, expects a
`{ models: string[] }` shape, and forces lean for any model whose id contains a listed string.
This is the staged-rollout surface: growthbook can target a percentage of users / specific
cohorts and ramp the model list over time. It is the mechanism behind "dark-launch lean on
additional models without a client release."

### Precedence diagram

```
isLeanSystemPrompt(model)              [memoized once per model id]
│
├─ model is falsy? ────────────────────────────────────────────► FULL (false)
│
├─ ENV  CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT explicit-true? ────────► LEAN  (true)   ┐
├─ ENV  CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT explicit-false? ───────► FULL  (false)  │ hard override
│                                                                                ┘
└─ return  !isFullPromptModel(model)  OR  isForcedLeanModel(model)
            │ capability gate (§2)         │ server / growthbook force-lean
            │                              │
            │                              ├─ clientDataCache.simple_system_prompt[idFrag]==true ─► LEAN
            │                              └─ tengu_velvet_cascade.models includes idFrag ────────► LEAN
            │
            └─ default by model class (haiku/sonnet/opus≤4.7 ► FULL; opus-4-8/unknown-1p ► LEAN)
```

Precedence summary (highest → lowest):
1. `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT` env (true ⇒ lean, false ⇒ full) — overrides everything.
2. `clientDataCache.simple_system_prompt` per-model map — forces lean (cannot force full).
3. `tengu_velvet_cascade` growthbook models list — forces lean (cannot force full).
4. The `c45` capability gate — the default when no override fires.

**Why this approach:** the two server surfaces (2 and 3) can only *add* models to lean
(`X3 = !c45 || d45`), never remove them. That asymmetry is intentional: Anthropic uses the
server to *expand* the lean rollout incrementally and reversibly (drop a model from the
growthbook list to roll back), while the *permanent* baseline lives in `c45` and ships with the
client. The env var sits above both so an operator always has the final say. This is exactly a
dark-launch ladder: experiment via `tengu_velvet_cascade` → confirm via the broader
`simple_system_prompt` push → bake into `c45` in a future release.

**Key insight:** the gate is structured as `permanent-baseline OR server-additions`, so the
control plane can only widen lean adoption, never silently narrow it — making rollout monotone
and safely reversible from the server without a client deploy.

---

## 4. Lean vs Simple — two different axes

Lean ("terse but full-featured") and `CLAUDE_CODE_SIMPLE` ("radically simple, near-empty") are
distinct, and `N0` checks Simple *first* (cli_inner_pretty.js:555615-555621), before the
lean/full branch ever runs:

```javascript
// ============================================
// isSimplePromptMode + N0 simple short-circuit (cKq) - "radically simple" path
// Location: cli_inner_pretty.js:555588-555590, 555614-555621
// ============================================

// ORIGINAL (for source lookup):
function cKq() {
  return xH(process.env.CLAUDE_CODE_SIMPLE);
}
async function N0(H, $, q, K) {
  if (cKq())
    return K?.excludeDynamicSections
      ? []
      : [`CWD: ${C$()}
Date: ${NlH()}`];
  let _ = X3($), ... }

// READABLE (for understanding):
function isSimplePromptMode() {
  return parseBoolTrue(process.env.CLAUDE_CODE_SIMPLE);
}
async function buildSystemPromptSections(tools, model, extra, opts) {
  if (isSimplePromptMode())
    return opts?.excludeDynamicSections
      ? []
      : [`CWD: ${getCwd()}\nDate: ${getSessionStartDate()}`];   // near-empty: just CWD + Date
  let isLean = isLeanSystemPrompt(model); ... }

// Mapping: cKq→isSimplePromptMode, N0→buildSystemPromptSections, xH→parseBoolTrue,
//          C$→getCwd, NlH→getSessionStartDate, _→isLean, $→model, K→opts
```

The contrast:

| Axis | Trigger | Body | Selected by |
|------|---------|------|-------------|
| **Simple** | `CLAUDE_CODE_SIMPLE` env only | Near-empty: just `CWD` + `Date` (or `[]` when dynamic sections excluded) | `cKq()` short-circuit at top of `N0` (cli_inner_pretty.js:555615-555621) |
| **Lean** | model gate + env/server/growthbook overrides | One full "# Harness" section + all dynamic sections | `X3` inside `N0` (cli_inner_pretty.js:555622, 555650-555653) |
| **Full** | default for haiku/sonnet/opus≤4.7 + unknown-3p | Six sections + all dynamic sections | `X3` ⇒ false |

(This compares the three prompt modes and their triggers — it is not a symbol-mapping table.)

So `CLAUDE_CODE_SIMPLE` strips the prompt down to environment facts (used for benchmarking /
fully-autonomous harnesses), whereas lean keeps the real instruction set — security block, the
five "# Harness" behavior bullets, and *every* dynamic section (memory, env info, language,
output style, focus mode, etc., cli_inner_pretty.js:555629-555649) — just in compressed form.
**Lean trims wording; Simple removes the prompt.** They sit on different axes and are checked in
sequence: Simple wins if set (it returns before `X3` is even consulted), then lean/full is
decided by the gate.

The same lean flag also flips *individual tool descriptions* to terser variants — e.g.
`getTodoToolDescription` (`z44`, cli_inner_pretty.js:376250-376251) returns the compact
list-style description `Y0_` under lean and the verbose `f0_` otherwise — confirming lean is a
codebase-wide "terse mode" keyed on `X3` (21 call sites across the bundle), not a single body
swap.

---

## 5. NEW post-2.1.88 — the grep trail and confidence

**Confidence: HIGH.** The per-model lean/full branch did not exist in v2.1.88.

### Precursor in v2.1.88 (the *only* short-circuit that existed)

`getSystemPrompt` in v2.1.88 (src/constants/prompts.ts:444-454) has the `CLAUDE_CODE_SIMPLE`
path and nothing model-conditional:

```typescript
// v2.1.88 — src/constants/prompts.ts:444-454 (readable upstream source)
export async function getSystemPrompt(tools, model, additionalWorkingDirectories?, mcpClients?) {
  if (isEnvTruthy(process.env.CLAUDE_CODE_SIMPLE)) {
    return [
      `You are Claude Code, Anthropic's official CLI for Claude.\n\nCWD: ${getCwd()}\nDate: ${getSessionStartDate()}`,
    ]
  }
  ...
}
```

This maps 1:1 to `cKq()` + the `N0` simple branch in 2.1.156 (cli_inner_pretty.js:555588-555590,
555615-555621). There is **no** `X3`-equivalent, no `c45` model-class allow-list, and no
`d45`-style clientData/growthbook force-lean anywhere in the v2.1.88 assembler. The model
parameter exists but is used only for env-info computation, never to branch the body.

### The grep trail (how the NEW gate was traced)

1. **Changelog phrase** → `CHANGELOG.md:12`: *"The lean system prompt is now the default for
   all models except Haiku, Sonnet, and Opus 4.7 and earlier."* (verified in
   claude_code_v_2.1.156/CHANGELOG.md). The "except Haiku/Sonnet/Opus 4.7" wording is the
   literal shape of `c45`'s allow-list.
2. **`c45` definition** → cli_inner_pretty.js:143847-143862: the exact model-class list named in
   the changelog (`haiku`, `sonnet`, `opus-4-0…4-7`).
3. **`X3` predicate** → cli_inner_pretty.js:143864, 143872-143877: the memoized
   `!c45(model) || d45(model)` wrapper with the env override on top.
4. **`d45` force-lean** → cli_inner_pretty.js:143839-143845: the `simple_system_prompt` +
   `tengu_velvet_cascade` rollout surfaces.
5. **Consumption** → `X3(...)` appears at 21 sites (grep count), centrally in `N0`
   (cli_inner_pretty.js:555622, 555650-555653).

Because `c45`/`d45`/`X3` have no analogue in the v2.1.88 readable source and the changelog
explicitly introduces the behavior in v2.1.154, this is confidently a net-new gate added in the
2.1.154 window. Only the `CLAUDE_CODE_SIMPLE`/`cKq` path is a genuine precursor.

---

## Cross-references

- Gate predicate internals (`X3`/`c45`/`d45`, normalization, memoization):
  [lean_prompt_eligibility_gate.md](./lean_prompt_eligibility_gate.md).
- Section-by-section body diff (what each lean section drops vs full):
  [lean_vs_full_prompt_diff.md](./lean_vs_full_prompt_diff.md).
- Opus 4.8 model id map and effort defaults (the model that triggers lean):
  [../43_model_opus48/](../43_model_opus48/).
