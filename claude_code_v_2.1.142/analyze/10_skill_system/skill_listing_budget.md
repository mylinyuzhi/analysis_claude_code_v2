# Skill Listing Budget (`l88` / `rM6`)

> Companion to [skill_frontmatter.md](./skill_frontmatter.md), [skill_overrides.md](./skill_overrides.md), [skill_lifecycle.md](./skill_lifecycle.md). This document covers the **listing-time** budget — how many characters of skill `name + description` reach the model on every turn — and the truncation algorithm that keeps that under a configurable cap.
>
> Distinct from the **compaction carry-forward** budget (5000/25000 tokens; see [skill_lifecycle.md#phase-5--carry-forward-through-compaction](./skill_lifecycle.md)). The listing budget is per-turn and small. The carry-forward budget is post-summary and one-shot.

---

## TL;DR

| Knob | Default | Override |
|------|---------|----------|
| Total budget (chars) | **1% of context window** (`G5_ = 0.01`) | `skillListingBudgetFraction` setting (≤1) **or** `SLASH_COMMAND_TOOL_CHAR_BUDGET` env var (absolute char count, wins over setting) |
| Per-skill description cap | **1536 chars** (`V5_ = 1536`) | `skillListingMaxDescChars` setting |
| Bytes per token | **4** (`w67 = 4`) — used to convert token-based context size to chars | (none — hardcoded) |
| Min description threshold | **20 chars** (`nM6 = 20`) — below this, switch to names-only mode | (none — hardcoded) |
| Default context (fallback) | **200000** (`T5_ = 200000`) — when no model is set | (model determines real value) |

The budget allocator `l88` (cli_inner_pretty.js:232282) has **three modes**:

| Mode | Trigger | Behavior |
|------|---------|----------|
| `"fits"` | Full listing fits in budget | All skills get their full description (up to per-skill cap) |
| `"priority"` | A usage-score function is supplied | Drop descriptions of least-used skills first; iterate until under budget |
| `"truncate"` / `"names-only"` | No usage scorer, doesn't fit | Divide remaining budget evenly across non-bundled skills; if per-skill share < 20 chars, fall back to names-only for all of them |

Bundled skills are **always** kept with full descriptions (they're protected from truncation across all modes).

---

## Per-turn flow

```
                ┌────────────────────────────────────────────────────┐
                │  Every model turn that builds the skill listing    │
                └────────────────────────┬───────────────────────────┘
                                         │
                  ┌──────────────────────┴────────────────────────┐
                  │  HO$(ctx, bytesPerToken)                       │
                  │  → returns budget in chars                      │
                  │                                                 │
                  │  1. env SLASH_COMMAND_TOOL_CHAR_BUDGET wins     │
                  │  2. else: contextWindow × 4 (bytes/tok) × 0.01  │
                  └──────────────────────┬─────────────────────────┘
                                         │
                  ┌──────────────────────┴────────────────────────┐
                  │  l88(skills, ctx, getNameOnlyNames, scorer)    │
                  │                                                 │
                  │  ┌───────────────────────────┐                  │
                  │  │  Total fits in budget?     │ yes → "fits"    │
                  │  └───────────┬───────────────┘                  │
                  │              │ no                                │
                  │  ┌───────────┴───────────────┐                  │
                  │  │  Scorer supplied?          │                  │
                  │  └────┬────────────┬─────────┘                  │
                  │       │ yes        │ no                          │
                  │       v            v                              │
                  │  "priority"   "truncate" or "names-only"          │
                  │  (drop LRU)   (even split, or all-names if too    │
                  │               little remains per skill)            │
                  └────────────────────────────────────────────────┘
                                  │
                                  v
                  ┌──────────────────────────────────────────────────┐
                  │  rM6(skills, ctx, scorer, bytesPerToken)         │
                  │  → renders the listing string                     │
                  │                                                   │
                  │  Per row:                                         │
                  │    "- name: description"  (full)                  │
                  │    "- name"               (name-only / truncated) │
                  │  Joined with "\n"                                 │
                  └──────────────────────────────────────────────────┘
```

---

## Budget allocator (`l88`)

```javascript
// ============================================
// computeSkillListingBudget - The three-mode budget allocator
// Location: cli_inner_pretty.js:232282-232356
// ============================================

// ORIGINAL (for source lookup):
function l88(H, $, q, K, _ = w67) {
  let A = HO$($, _),                           // budget in chars
    z = Number(process.env.SLASH_COMMAND_TOOL_CHAR_BUDGET) > 0,
    Y = e3$(),                                  // maxSkillDescriptionChars
    f = [],
    O = Math.max(0, H.length - 1),              // start with join-separator count
    M = H.map((G) => {
      if (q?.has(G.name))                       // skill marked name-only by overrides
        return ((O += G.name.length + 2), { cmd: G, descLen: 0, entryLen: G.name.length + 2 });
      let V = lM6(G),                           // description + " - " + whenToUse
        v = Math.min(V.length, Y);              // cap at per-skill max
      if (V.length > Y) f.push({ name: G.name, rawLen: V.length });
      return ((O += G.name.length + 4 + V.length), { cmd: G, descLen: v, entryLen: G.name.length + 4 + v });
    });
  f.sort((G, V) => V.rawLen - G.rawLen);
  let w = f.map((G) => G.name);                 // names truncated by per-skill cap
  let D = M.reduce((G, V) => G + V.entryLen, 0) + Math.max(0, M.length - 1);

  // ── Mode 1: "fits" ──
  if (D <= A)
    return { cappedSkills: w, budgetMode: "fits", maxDescLen: Y, budgetTruncatedSkills: [],
             totalChars: D, rawTotalChars: O, budget: A, budgetFromEnv: z, bytesPerToken: _ };

  // (compute the "always-keep" group: bundled + name-only overrides)
  let j = (G) => v5_(G.cmd) || q?.has(G.cmd.name),
    J = M.reduce((G, V) => (j(V) ? G + V.entryLen + 1 : G), 0),     // size of always-keeps
    X = M.filter((G) => !j(G));                                      // truncatable rows

  // ── Mode 2: "priority" — scorer supplied (usage score) ──
  if (K) {
    let G = M.reduce((I, h) => I + (j(h) ? h.entryLen : h.cmd.name.length + 2), 0) + Math.max(0, M.length - 1),
      V = A - G,                                                      // remaining budget
      v = X.slice().sort((I, h) => K(h.cmd) - K(I.cmd)),              // ascending score (least used first)
      E = [];
    for (let I of v) {
      let h = I.entryLen - (I.cmd.name.length + 2);                   // size of description+sep
      if (h <= V) V -= h;                                              // keep it (still fits)
      else E.push(I);                                                  // drop description
    }
    return { cappedSkills: w, budgetMode: "priority", maxDescLen: 0,
             budgetTruncatedSkills: E.map((I) => I.cmd.name), ...};
  }

  // ── Mode 3: "truncate" / "names-only" — no scorer ──
  let L = X.reduce((G, V) => G + V.cmd.name.length + 4, 0) + Math.max(0, X.length - 1),
    P = X.length > 0 ? Math.floor((A - J - L) / X.length) : Y,        // even per-skill share
    Z = P < nM6 ? "names-only" : "truncate",                          // 20-char floor
    W = Z === "names-only" ? X.filter((G) => G.descLen > 0) : X.filter((G) => G.descLen > P);
  return { cappedSkills: w, budgetMode: Z, maxDescLen: Math.max(0, P),
           budgetTruncatedSkills: W.map((G) => G.cmd.name), ...};
}

// READABLE (for understanding):
// Modes:
//   "fits"       — everyone gets their full description (up to maxDescLen)
//   "priority"   — scorer-driven: drop descriptions of lowest-score skills first
//   "truncate"   — divide remaining budget evenly; truncate each description
//   "names-only" — per-skill share < 20 chars; render all non-bundled as just "- name"
//
// `j(skill)` = always-keep predicate (bundled OR name-only override).
//   - Bundled skills are protected because they ship with the binary and the model
//     relies on them; truncating their descriptions would degrade the default experience.
//   - name-only overrides are kept compact by definition.
//
// Mapping: l88 -> computeSkillListingBudget, HO$ -> computeListingBudgetChars,
//          e3$ -> getMaxSkillDescriptionChars, lM6 -> combineDescriptionAndWhenToUse,
//          v5_ -> isBundledSkill, q -> nameOnlyOverrideSet,
//          K -> usageScorerFn, _ -> bytesPerToken, w67 -> DEFAULT_BYTES_PER_TOKEN
```

---

## Budget computation (`HO$`)

```javascript
// ============================================
// computeListingBudgetChars - env → setting → default × context × bytes/token
// Location: cli_inner_pretty.js:232270-232275
// ============================================

// ORIGINAL (for source lookup):
function HO$(H, $ = w67) {
  if (Number(process.env.SLASH_COMMAND_TOOL_CHAR_BUDGET))
    return Number(process.env.SLASH_COMMAND_TOOL_CHAR_BUDGET);
  let q = cM6(),                                        // skillListingBudgetFraction
    K = (H ?? T5_) * $ * q;                              // contextTokens × bytesPerToken × fraction
  return Math.max(1, Math.floor(K));
}

// READABLE (for understanding):
function computeListingBudgetChars(modelContextTokens, bytesPerToken = DEFAULT_BYTES_PER_TOKEN) {
  // Env var wins everything (absolute char count, not fraction)
  const envBudget = Number(process.env.SLASH_COMMAND_TOOL_CHAR_BUDGET);
  if (envBudget) return envBudget;
  const fraction = getSkillListingBudgetFraction();       // setting or 0.01 default
  const budget = (modelContextTokens ?? 200000) * bytesPerToken * fraction;
  return Math.max(1, Math.floor(budget));
}

// Mapping: HO$ -> computeListingBudgetChars, cM6 -> getSkillListingBudgetFraction,
//          T5_ -> DEFAULT_CONTEXT_FALLBACK (200000), w67 -> DEFAULT_BYTES_PER_TOKEN (4)
```

### Worked example

A Sonnet 4.6 session with 200k context window and default fraction:

```
budget = 200000 (tokens) × 4 (bytes/tok) × 0.01 (fraction) = 8000 chars
```

8000 chars is ~80 short skills at 100 chars each, or ~5 skills if each description hits the 1536-char per-skill cap. In practice 20-30 skills fit cleanly; beyond that, truncation kicks in.

With a 1M context window (Sonnet 4.6 [1M] beta) and the same fraction:

```
budget = 1000000 × 4 × 0.01 = 40000 chars
```

The user can raise it with `"skillListingBudgetFraction": 0.02` (2%) or pin an absolute count with `SLASH_COMMAND_TOOL_CHAR_BUDGET=20000`. The env var **always wins** — useful for one-off CI runs without editing settings.

---

## The renderer (`rM6`)

```javascript
// ============================================
// formatCommandsWithinBudget - The actual listing string emitter
// Location: cli_inner_pretty.js:232385-232450
// ============================================

// ORIGINAL (for source lookup):
function rM6(H, $, q, K) {
  if (H.length === 0) return "";
  let _ = HO$($, K),                                                  // budget in chars
    A = new Set(),                                                     // name-only-skill indices
    z = H.map((L, P) => {
      if (st(L) === "name-only")
        return (A.add(P), { cmd: L, full: `- ${L.name}` });           // pre-collapsed
      return { cmd: L, full: k5_(L) };                                 // "- name: desc"
    });
  // Mode 1: "fits"
  if (z.reduce((L, P) => L + z8(P.full), 0) + (z.length - 1) <= _)
    return z.map((L) => L.full).join("\n");
  // Build always-keep set (bundled + name-only)
  let f = new Set(A), O = [];
  for (let L = 0; L < H.length; L++) {
    let P = H[L];
    if (P.type === "prompt" && P.source === "bundled") f.add(L);
    else if (!A.has(L)) O.push(P);
  }
  let M = z.reduce((L, P, Z) => (f.has(Z) ? L + z8(P.full) + 1 : L), 0),
    w = _ - M;                                                          // remaining for truncatable
  if (O.length === 0) return z.map((L) => L.full).join("\n");
  // Mode 2: "priority" — scorer-driven
  if (q) {
    let L = H.map((E, I) => I).filter((E) => !f.has(E)),
      P = (E) => z8(H[E].name) + 2,                                     // "- name" size
      Z = (E) => z8(z[E].full),                                          // full row size
      W = H.reduce((E, I, h) => E + (f.has(h) ? Z(h) : P(h)), 0) + (H.length - 1),
      G = _ - W,
      V = new Set(),
      v = L.slice().sort((E, I) => q(H[I]) - q(H[E]));                  // descending score (highest first)
    for (let E of v) {                                                  // walk best-to-worst
      let I = Z(E) - P(E);                                               // size of description
      if (I <= G) (V.add(E), (G -= I));                                  // keep description (still fits)
    }
    return H.map((E, I) => (f.has(I) || V.has(I) ? z[I].full : `- ${E.name}`)).join("\n");
  }
  // Mode 3: "truncate" / "names-only"
  let D = O.reduce((L, P) => L + z8(P.name) + 4, 0) + (O.length - 1),
    j = w - D,
    J = Math.floor(j / O.length);                                       // per-skill share
  if (J < nM6)
    return H.map((L, P) => (f.has(P) ? z[P].full : `- ${L.name}`)).join("\n");  // names-only
  let X = H6(O, (L) => z8(iM6(L)) > J);
  // ... emit each row with iM6(L) truncated to J chars (with "…" ellipsis)
}

// READABLE (for understanding):
// The renderer mirrors the allocator's three modes:
//   "fits"          → ["- name: full description", ...]
//   "priority"      → keep highest-scored descriptions; collapse the rest to "- name"
//   "truncate"      → "- name: truncated…" with the per-skill share
//   "names-only"    → "- name" for everyone non-bundled

// Mapping: rM6 -> formatCommandsWithinBudget, k5_ -> formatSkillRowFull,
//          z8 -> charCount, iM6 -> truncateDescription, H6 -> dropWhile,
//          st -> getSkillOverride, v5_ -> isBundledSkill, nM6 -> MIN_DESC_CHARS (20)
```

### Mode-by-mode characteristics

#### `"fits"` — happy path

Every skill renders as `- name: description` joined by `\n`. The model gets the full picture. Per-skill description is still capped at 1536 chars (`maxSkillDescriptionChars`), but no skill is dropped or truncated below that cap.

#### `"priority"` — usage-aware (the recommended path)

The scorer function (passed in as `q` / `K`) is consulted. The standard scorer is **invocation count this session** — skills used more often are protected. Walk skills **best-to-worst**; keep their description as long as the running tally fits. When the budget runs out, every remaining skill gets `- name` only.

The `/doctor` UI reports which skills lost their descriptions, so operators can see which skills lost detail and either trim their descriptions, raise the budget, or set them to `name-only` explicitly.

#### `"truncate"` / `"names-only"` — no scorer

If no scorer is available (e.g. at session start before any usage), the budget is divided evenly across non-bundled skills. If the per-skill share works out to **< 20 chars** (`nM6`), the renderer gives up trying to truncate and instead emits `- name` for all non-bundled skills. Otherwise each description is sliced to the per-skill share with `…` ellipsis.

### Bundled-skill protection

`v5_(skill)` = `skill.type === "prompt" && skill.source === "bundled"`. Bundled skills are unconditionally in the `f` set across all three modes — their descriptions are never collapsed by the budget allocator. This protects the default `/code-review` / `/debug` / `/run` experience even on tight budgets.

The user can still set a bundled skill to `name-only` via `skillOverrides` — that path uses a different code branch (`st()` check in `z` map) and forces the row to `- name`.

### `name-only` is pre-applied

The first step of `rM6` checks `st(skill) === "name-only"` and pre-collapses those rows. They are then added to the always-keep set, since their `name`-only line is already minimal.

So `name-only` interacts with the budget in a useful way: it converts a description-occupying skill into a no-cost skill, freeing budget for others. This is why the official docs recommend `"name-only"` for low-priority skills when the budget is tight.

---

## What the model sees

A typical listing entry looks like:

```
- my-skill: One-line summary of what the skill does. - Use when the user asks X or wants Y.
- legacy-context
- run: Launch and drive your app to see a change working
- noisy-skill: This skill helps with…
```

Per the renderer:

| Source state | Renders as |
|--------------|-----------|
| Full | `- name: combined-description` (truncated if budget pressure or per-skill cap) |
| `name-only` override | `- name` |
| Dropped by `"priority"` mode | `- name` |
| Bundled skill | `- name: full-description` (always) |
| `off` override | (absent — filtered out before reaching the renderer) |
| `user-invocable-only` override | (absent — filtered out before reaching the renderer) |

The combined description used for matching is `description + " - " + whenToUse` (per `lM6` at cli_inner_pretty.js:232276-232278). The combined string is what gets truncated, and that combined length is what the **1536-char per-skill cap** (`maxSkillDescriptionChars`) measures against.

---

## Diagnosis via `/doctor`

The `/doctor` command surfaces the budget state. Two settings are linked from its UI (cli_inner_pretty.js:444054, 444097):

- `skillListingMaxDescChars` — per-skill cap
- `skillListingBudgetFraction` — total fraction

`/doctor` reports:

- Whether the budget is currently in `"fits"` / `"priority"` / `"truncate"` / `"names-only"` mode
- Which specific skills have lost their descriptions (the `budgetTruncatedSkills` list from `l88`)
- Total budget (in chars) vs raw uncapped total

The operator's playbook when descriptions are getting cut:

1. **Trim the source** — shorten `description` + `when_to_use` in the SKILL.md (the per-skill cap is 1536, but the listing budget needs much less per skill if there are many)
2. **Set low-priority skills to `name-only`** in `skillOverrides` (no description = no budget cost)
3. **Raise the budget** — `"skillListingBudgetFraction": 0.02` or higher
4. **Pin via env** — `SLASH_COMMAND_TOOL_CHAR_BUDGET=20000` for a session

---

## Cross-references

- [skill_frontmatter.md](./skill_frontmatter.md) — the `description` / `when_to_use` fields whose combined length feeds this budget
- [skill_overrides.md](./skill_overrides.md) — `name-only` (compact listing), `off` / `user-invocable-only` (excluded from the listing entirely)
- [skill_lifecycle.md](./skill_lifecycle.md) — the listing budget is per-turn; the compaction carry-forward budget (5000/25000 tokens) is one-shot post-summary
- `skillListingMaxDescChars` setting: cli_inner_pretty.js:50411-50418
- `skillListingBudgetFraction` setting: cli_inner_pretty.js:50419-50426
- `SLASH_COMMAND_TOOL_CHAR_BUDGET` env var override: cli_inner_pretty.js:232271
- `/doctor` integration: cli_inner_pretty.js:444054, 444097
