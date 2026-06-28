# The `tengu_billiard_aviary` Immutable-Memory Experiment — Removed in v2.1.193

> **Type:** REFINEMENT / dead-experiment cleanup. **Window:** v2.1.183 → v2.1.193. **Behaviour-neutral for default users** (the gate defaulted OFF).
> Every `cli_inner_pretty.js:<line>` is a **193** line unless tagged `(183)` or `(v2.1.88)`.

## TL;DR

In 2.1.183, a server-controlled feature gate `tengu_billiard_aviary` (default `false`) selected an **entire alternate "immutable memory" architecture** behind the auto-memory subsystem: a distinct memory-type name `"tiny_memory"`, immutable file semantics (never edit in place — delete and re-write, with a `created:` frontmatter stamp), an inline `[Good]/[Bad]` memory-rating survey widget, and a separate dream prompt builder titled **"# Dream: Memory Pruning"**. v2.1.193 **deletes the gate and the entire ON-path**: the dream firing code collapses from a 2-way `aH() ? Hgi(...) : PQa(...)` branch to a single `$_l(...)` consolidation builder, and every gated symbol/string drops to a grep-count of **0**. Because the gate defaulted OFF, nobody on a default config experienced the ON path, so this is a clean removal with **no default-user behaviour change** — it returns the dream shape toward the v2.1.88 ancestor `buildConsolidationPrompt`, which has no immutable variant.

---

## 1. The gate and what it selected (the 183 before-picture)

**What it does (183).** `aH()` reads the GrowthBook/experiment flag `tengu_billiard_aviary`, default `false`. A second function `XXu()` uses that boolean to pick which **memory-type name** the whole subsystem writes under: `"tiny_memory"` when ON, `"memory"` when OFF.

```javascript
// ============================================
// billiardAviaryGate / memoryTypeSelector - the experiment gate and the type it switched (183, REMOVED in 193)
// Location (183): cli_inner_pretty.js:147670-147674
// ============================================

// ORIGINAL (for source lookup):  [183]
function XXu() {
  return aH() ? YXu : KXu;
}
function aH() {
  return ct("tengu_billiard_aviary", !1);
}
// with: KXu = "memory", YXu = "tiny_memory", JXu = "MEMORY.md"   (183 :147729-147731)

// READABLE (for understanding):  [183]
function selectMemoryType() {
  return isImmutableMemoryEnabled() ? MEMORY_TYPE_TINY : MEMORY_TYPE_DEFAULT; // "tiny_memory" : "memory"
}
function isImmutableMemoryEnabled() {
  return getExperimentFlag("tengu_billiard_aviary", false); // default OFF — nobody on a default config saw the ON path
}

// Mapping (183): XXu→selectMemoryType, aH→isImmutableMemoryEnabled, ct→getExperimentFlag,
//   YXu→MEMORY_TYPE_TINY ("tiny_memory"), KXu→MEMORY_TYPE_DEFAULT ("memory")
```

**The 11 gate sites in 183.** The single `aH()` boolean fanned out across the whole memory subsystem. Each row is a place the 183 build branched on the gate; all of these were removed (the OFF-path is now the only path) in 193:

| 183 site | What the gate toggled when ON |
|---|---|
| `147670-147672` `XXu()` | the memory-type name: **`"tiny_memory"`** instead of `"memory"` |
| `151881, 151887, 151952` (183) | the memory **write path** — immutable semantics (never edit a memory file in place) |
| `220230` (183) `aH() && LOi(e)` | enabled an immutable-mode predicate on the write/read path |
| `220243` (183) `...(aH() && { created: Itt() })...` | stamped a **`created:` frontmatter** date on each immutable memory record |
| `380775`-region (183, `onRate` widget `:378871/:378881/:378928`) | rendered the inline **`[Good]/[Bad]` rating survey** (`tiny_memory` feedback) |
| `445405` (183) | gated a memory-attachment path |
| `455476, 455488` (183, dream) | the tool-constraint copy **and** which dream builder to call (`Hgi` vs `PQa`) |

> **Why one boolean fanned out so far.** Immutable memory is not a local tweak — it changes the *contract* of a memory file (append-only single facts vs an editable note), which ripples into the type name, the writer, the frontmatter, the rating UI, and the dream prompt's tool constraints simultaneously. Threading one `aH()` gate through all of them was the cheapest way to keep the experiment switchable as one unit. The cost is exactly what 193 had to pay to retire it: 11 coordinated edits.

---

## 2. The immutable write semantics + the `[Good]/[Bad]` rating widget (183, removed)

**What it did.** When the gate was ON, a "memory" was an **immutable** single-fact file: you never edited it in place; to change a fact you *deleted* the old file and *wrote* a replacement (`Fa is not permitted — memories are immutable, so delete + Kc to replace, never edit in place`, 183 `:455480`). Each record carried a `created:` timestamp (183 `:220243`). The UI surfaced a per-memory **`[Good]/[Bad]`** thumbs survey so the user could rate each extracted `tiny_memory`:

```javascript
// ============================================
// memoryRatingWidget - the inline [Good]/[Bad] tiny_memory survey (183, REMOVED in 193)
// Location (183): cli_inner_pretty.js:378866-378882 (the two rating buttons)
// ============================================

// ORIGINAL (for source lookup):  [183]
qT.default.createElement(FOa, {
  label: "[Good]", color: "success", sentiment: "positive",
  hover: l, rating: a, setHover: c,
  onRate: (T) => i(r, T, "tiny_memory", f),
}),
qT.default.createElement(w, null, " "),
qT.default.createElement(FOa, {
  label: "[Bad]", color: "error", sentiment: "negative",
  hover: l, rating: a, setHover: c,
  onRate: (T) => i(r, T, "tiny_memory", f),
}),

// READABLE (for understanding):  [183]
createElement(RatingButton, {
  label: "[Good]", color: "success", sentiment: "positive",
  hover, rating, setHover,
  onRate: (sentiment) => recordMemoryRating(memoryRef, sentiment, "tiny_memory", scopeCounts),
}),
createElement(Spacer),
createElement(RatingButton, {
  label: "[Bad]", color: "error", sentiment: "negative",
  hover, rating, setHover,
  onRate: (sentiment) => recordMemoryRating(memoryRef, sentiment, "tiny_memory", scopeCounts),
}),

// Mapping (183): FOa→RatingButton, onRate→rating callback, i→recordMemoryRating,
//   "tiny_memory"→the survey's memory-type tag, f→scopeCounts (the rating payload)
```

**193 removal evidence.** The `RatingButton` component `FOa` and its two `[Good]/[Bad]` call-sites are gone; the genuine rating handlers `onRate:` go from **3 → 0** and `scopeCounts` (the rating payload) from **2 → 0**:

| String / symbol | 183 | 193 |
|---|:--:|:--:|
| genuine `onRate:` rating handlers (`:378871/:378881/:378928`) | 3 | **0** |
| `scopeCounts` (rating payload) | 2 | **0** |
| `created:`-stamp gate (`aH() && { created: … }`) | present `:220243` | **0** |

> **Drift note (corrected from the scout dossier).** A raw `grep -c onRate` returns 5 (183) → 2 (193), but **2 of those matches in each bundle are substring false-positives** — `"AnimationRate"` (`:245614`/`:254126`) and `organizationRate…` (`:340869`/`:350529`) — not rating-widget handlers. The *genuine* `[Good]/[Bad]` `onRate:` callbacks are **3 → 0**, i.e. the widget is **fully** removed with no residual handlers. Report the 3→0, not the 5→2.

---

## 3. The dream branch collapse: `aH() ? Hgi : PQa` → single `$_l`

This is the load-bearing code change. In 183, the auto-dream firing path branched on the gate to choose **both** the tool-constraints copy **and** which prompt builder to call — the immutable `Hgi` ("# Dream: Memory **Pruning**") or the standard `PQa` ("# Dream: Memory **Consolidation**"). In 193 the branch is gone: one constraints string, one builder `$_l`.

```javascript
// ============================================
// autoDreamFiring - the dream prompt selection collapsed from 2-way to single-path
// Location: cli_inner_pretty.js:463897-463907 (193)  |  183 before: :455474-455488
// ============================================

// ORIGINAL (for source lookup):  [183 — 2-way branch on the gate]
let h = hm(),                  // memory directory
  y = yh(Ar()),                // session transcripts path
  _ = await k2p(h),
  b = aH(),                    // ← tengu_billiard_aviary gate
  S = b
    ? `…plus deleting \`.md\` paths inside the memory directory. ${Fa} is not permitted — memories are immutable, so delete + ${Kc} to replace, never edit in place. …`
    : `…plus deleting \`.md\` paths… Anything else that writes, redirects to a file, or modifies state will be denied. …`,
  T = b ? Hgi(h, S, p) : PQa(h, y, S, p),   // ← immutable "Pruning" builder vs standard "Consolidation" builder

// ORIGINAL (for source lookup):  [193 — single path]
let y = tm(),                  // memory directory
  b = Ph(mr()),                // session transcripts path (NOT a gate — replaced aH())
  _ = await Oaf(y),
  S = `…plus deleting \`.md\` paths inside the memory directory. Anything else that writes, redirects to a file, or modifies state will be denied. …`,
  H = $_l(y, b, S, p),         // ← single "Consolidation" builder (== 183 PQa)

// READABLE (for understanding):  [193]
let memoryDir = getMemoryDir(),                          // tm()
  transcriptsPath = resolveTranscripts(getOriginalCwd()),// Ph(mr())  — the slot that used to hold aH()
  _ = await loadMemorySnapshot(memoryDir),
  toolConstraints = "…read-only shell + delete .md only; anything else denied…",
  prompt = buildConsolidationPrompt(memoryDir, transcriptsPath, toolConstraints, teamMemoryEnabled);

// Mapping: 183 aH→(removed), Hgi→(removed immutable builder), PQa→$_l (standard, kept),
//   193 y→memoryDir (tm), b→transcriptsPath (Ph(mr())), H→prompt, p→teamMemoryEnabled
```

**How it works — the mechanics of the collapse.**
1. **The `b` slot was repurposed.** In 183, `b = aH()` was a boolean. In 193 the *same local name* `b` is `Ph(mr())` — the resolved session-transcripts path, passed as the 2nd positional arg to `$_l`. Note `$_l(e, t, …)` has `e` = memory directory, `t` = transcripts; the call `$_l(y, b, …)` therefore passes `y=tm()` as the memory dir and `b=Ph(mr())` as the transcripts path. So `b` is no longer a gate — it is plain data threaded into the prompt.
2. **The constraints string lost its conditional.** 183 had two `\`Tool constraints for this run:\`` variants (immutable vs standard); 193 keeps the standard one only (grep-count 2 → 1).
3. **The builder is the standard one, verbatim.** `$_l` (193 `:463735`) has a **byte-identical body** to 183 `PQa` (183 `:455311`): same `# Dream: Memory Consolidation` header, same `Memory directory:` / `Session transcripts:` slots, same Phase 1-4 structure, same `Reconcile memories against CLAUDE.md` (1/1) and `team/` subdirectory block (1/1). The immutable builder `Hgi` (183 `:151520`, signature `(e, t, n=!1)` — 3 args, **no memory-dir param**) is deleted.

**Why this approach (deletion, not a feature-flag flip).** The experiment had two states; the OFF state was the production default and the ON state was internal-only. Rather than leave a dormant `aH()` gate and a dead `Hgi` builder shipping in the bundle (dead-weight + an accidental-enable risk if the GrowthBook flag were ever flipped), 193 **removes the entire ON-path** and inlines the OFF-path as the only path. Trade-off: a future "immutable memory" idea would have to be re-introduced from scratch — but that is correct hygiene for a concluded experiment. The result is that the 193 dream shape matches the v2.1.88 ancestor `buildConsolidationPrompt` (`services/autoDream/consolidationPrompt.ts:10`, single-path, no immutable variant): the codebase reverted toward its original, simpler form.

**Key insight.** The whole removal reads, at the firing site, as a *one-line* change — `b = aH()` (a gate) became `b = Ph(mr())` (data), and `T = b ? Hgi(...) : PQa(...)` became `H = $_l(...)`. That tiny diff is the visible tip of an 11-site experiment teardown; the firing branch is where the two architectures met, so collapsing it is what makes the rest of the gated code unreachable and removable.

---

## 4. Evidence note (NET-NEW vs CARRYOVER)

This doc documents a **REMOVAL** (REFINEMENT). The dream *engine* is CARRYOVER (see the sibling [`memory_reminder_and_dream_carryover.md`](./memory_reminder_and_dream_carryover.md)); only the immutable-experiment ON-path was deleted. Grep-diff (183 → 193), all gated symbols/strings to 0:

| String / symbol (the experiment) | 183 | 193 |
|---|:--:|:--:|
| `tengu_billiard_aviary` | 1 | **0** |
| `tiny_memory` | 4 | **0** |
| `Dream: Memory Pruning` | 1 | **0** |
| `Memory files are immutable` | 1 | **0** |
| `never edit them in place` | 1 | **0** |
| `memories are immutable, so delete` | 3 | **0** |
| `Tool constraints for this run` (variant count) | 2 | **1** |
| genuine `[Good]/[Bad]` `onRate:` handlers | 3 | **0** |
| `scopeCounts` (rating payload) | 2 | **0** |
| `# Memory` (system-prompt builder fragments) | 19 | **13** |
| `Dream: Memory Consolidation` (the standard, kept) | 1 | 1 |

The `# Memory` fragment drop (19 → 13) is fully accounted for by the removed immutable-mode system-prompt memory-builder variant (the surviving recall builders `m0i` `:152389`, `g0i` `:152460`, `VVr` `:152638` are carryover) — **not** by any change to recall behaviour.

**Upgrade-behaviour note.** None for default users. Anyone who had `tengu_billiard_aviary` server-enabled (an internal experiment) silently loses immutable-memory mode, the `tiny_memory` rating survey, and the "Dream: Memory Pruning" prompt on upgrade to 193.

---

## 5. Cross-links

- Sibling 193 doc: [`memory_reminder_and_dream_carryover.md`](./memory_reminder_and_dream_carryover.md) — the dream *engine* carryover + the "2.1.186 compact reminder" false-delta correction.
- Module index: [`README.md`](./README.md).
- Canonical 183 auto-memory tree (the engine that is carryover): [`../../../claude_code_v_2.1.183/analyze/31_auto_memory/README.md`](../../../claude_code_v_2.1.183/analyze/31_auto_memory/README.md), and its readable-source reconstruction [`reconstructed_source/`](../../../claude_code_v_2.1.183/analyze/31_auto_memory/reconstructed_source/README.md) (`autoDream` consolidation service).
- v2.1.156 baseline (canonical architecture, three dream surfaces): [`../../../claude_code_v_2.1.156/analyze/31_auto_memory/README.md`](../../../claude_code_v_2.1.156/analyze/31_auto_memory/README.md).

---

## Related Symbols

> Symbol mappings live in the central index files, never in this doc:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (**Auto Memory** lives here)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations
> - per-feature additions: [symbol_additions_v2_1_193_auto_memory.md](../00_overview/symbol_additions_v2_1_193_auto_memory.md)

Key symbols in this document (list format, per CLAUDE.md):

- `buildConsolidationPrompt` (obf: `$_l`, `cli_inner_pretty.js:463735`) — the single surviving dream builder; body == 183 `PQa` (183 `:455311`); the dream firing call `$_l(y, b, S, p)` is at `:463907`.
- 183 before-picture, all **removed** in 193:
  - `isImmutableMemoryEnabled` (gate `aH` = `tengu_billiard_aviary`, default `false`, 183 `:147673`).
  - `selectMemoryType` (`XXu`, 183 `:147670`) → `MEMORY_TYPE_TINY` (`YXu="tiny_memory"`, 183 `:147730`) vs `MEMORY_TYPE_DEFAULT` (`KXu="memory"`, 183 `:147729`).
  - immutable dream builder `Hgi` "Dream: Memory Pruning" (183 `:151520`, 3-arg).
  - `[Good]/[Bad]` rating widget `FOa` (183 `:378928`) + handlers `onRate:` (183 `:378871/:378881`) + payload `scopeCounts`.
  - `created:` frontmatter stamp gate (183 `:220243`, `aH() && { created: Itt() }`).
