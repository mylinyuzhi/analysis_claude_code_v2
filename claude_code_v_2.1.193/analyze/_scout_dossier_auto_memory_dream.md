# Scout Dossier — Auto Memory & Dream (v2.1.183 → v2.1.193)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (VERSION "2.1.193", build a1938d2a, 2026-06-25)
**Before-picture:** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (VERSION "2.1.183", build 9d251ab, 2026-06-18)
**88 ancestor tree:** `/lyz/codespace/3rd/claude-code/src/services/autoDream/` + `services/extractMemories/` + `services/teamMemorySync/`
**Existing module:** `31_auto_memory/` (this EXTENDS it)

---

## TL;DR (depth = THIN, leaning moderate)

The auto-memory engine and the **auto-dream** engine are **CARRYOVER** this window — the throttle config, the four telemetry events, the firing logic, the standard consolidation prompt, the load-time MEMORY.md truncation warning, and the `CLAUDE_MEMORY_STORES` mount machinery are all byte-identical to 2.1.183 (only re-mangled). The three changelog/scope bullets resolve as follows:

1. **"MEMORY.md compact reminder near the size limit" ([2.1.186] in changelog)** → **CARRYOVER, NOT a 193 delta.** Both the load-time truncation WARNING (`v$t`/183 `Zkt`) AND the dream "Phase 4 — Prune and index" instruction exist **byte-identical in 2.1.183**. Thresholds confirmed: **200 lines** (`RY`/183 `tie`) and **25000 bytes** (`Kae`/183 `HTe`). The changelog's "2.1.186" label lags the actual ship version (≤183); the 183 analysis tree already documented this.
2. **Did DREAM change?** → The engine is carryover, BUT there is **one real body change**: the `tengu_billiard_aviary`-gated **"immutable memory / `tiny_memory`" experiment was deleted**. The dream firing code collapsed from a 2-way branch (`Hgi` immutable "Dream: Memory **Pruning**" builder vs `PQa` standard "Dream: Memory **Consolidation**" builder) to a **single** `$_l` builder. The removed variant matched the gate-ON path; default users (gate default-off) see **no behavior change**. This is a dead-experiment cleanup that returns the dream shape closer to the 88 ancestor (`buildConsolidationPrompt`).
3. **CLAUDE_MEMORY_STORES / findRelevantMemories / recall** → `CLAUDE_MEMORY_STORES` is **fully carryover** (10 occurrences both; identical validation/parse). `findRelevantMemories` **does not exist in either bundle** (a guessed name). The memory system-prompt "recall" guidance strings are carryover; the only line-count drop is the removed immutable-mode prompt builder variant.

**Net:** the auto-memory/dream feature surface is effectively frozen this window except for the removal of the `tengu_billiard_aviary` immutable-memory experiment (gate + `tiny_memory` type + immutable write semantics + `Hgi` dream-pruning builder + the inline `[Good]/[Bad]` memory rating widget).

---

## Bullet 1 — MEMORY.md "compact reminder" near the size limit

**Changelog text (CHANGELOG.md:101, dated 2.1.186):** *"Improved memory: the agent is now reminded to compact its `MEMORY.md` index when nearing the size limit."*

There are **two** mechanisms that implement "remind the agent to keep the index small," and **both predate 2.1.183**:

### (a) Load-time truncation WARNING injected with the AutoMem reminder

When `MEMORY.md` is loaded into context as an `AutoMem` system-reminder, it is passed through a size-limit function that truncates and appends a warning.

```javascript
// ============================================
// truncateMemoryIndexForPrompt - Enforce line/byte limits on MEMORY.md, append a compact-it warning
// Location: cli_inner_pretty.js:152573-152609 (193)
// ============================================

// ORIGINAL (for source lookup):
function v$t(e) {
  let t = e.trim(), n = t.split("\n"), r = n.length, o = t.length,
    s = r > RY, i = o > Kae;
  if (!s && !i) return { content: t, lineCount: r, byteCount: o, wasLineTruncated: s, wasByteTruncated: i };
  let a = s ? n.slice(0, RY).join("\n") : t;
  if (a.length > Kae) { let c = a.lastIndexOf("\n", Kae); a = a.slice(0, c > 0 ? c : Kae); }
  let l = i && !s ? `${La(o)} (limit: ${La(Kae)}) — index entries are too long`
        : s && !i ? `${r} lines (limit: ${RY})` : `${r} lines and ${La(o)}`;
  return { content: a + `\n\n> WARNING: ${UH} is ${l}. Only part of it was loaded. Keep index entries to one line under ~200 chars; move detail into topic files.`, lineCount: r, byteCount: o, wasLineTruncated: s, wasByteTruncated: i };
}

// READABLE (for understanding):
function truncateMemoryIndexForPrompt(rawIndexText) {
  const text = rawIndexText.trim();
  const lines = text.split("\n");
  const lineCount = lines.length, byteCount = text.length;
  const lineTruncated = lineCount > MEMORY_INDEX_LINE_LIMIT;   // 200
  const byteTruncated = byteCount > MEMORY_INDEX_BYTE_LIMIT;   // 25000
  if (!lineTruncated && !byteTruncated) return { content: text, ... };
  let out = lineTruncated ? lines.slice(0, 200).join("\n") : text;
  if (out.length > 25000) { const nl = out.lastIndexOf("\n", 25000); out = out.slice(0, nl > 0 ? nl : 25000); }
  const reason = byteTruncated && !lineTruncated ? `${fmt(byteCount)} (limit: ${fmt(25000)}) — index entries are too long`
               : lineTruncated && !byteTruncated ? `${lineCount} lines (limit: 200)` : `${lineCount} lines and ${fmt(byteCount)}`;
  return { content: out + `\n\n> WARNING: MEMORY.md is ${reason}. Only part of it was loaded. Keep index entries to one line under ~200 chars; move detail into topic files.`, ... };
}
// Mapping: v$t→truncateMemoryIndexForPrompt, RY→MEMORY_INDEX_LINE_LIMIT(200), Kae→MEMORY_INDEX_BYTE_LIMIT(25000), UH→"MEMORY.md", La→formatBytes
```

**Injection site (the reminder):** `cli_inner_pretty.js:233806` — `if (n === "AutoMem") d = v$t(c).content;` (193) — mirrors 183 `225707` `if (n === "AutoMem") d = Zkt(c).content;`. So when the `MEMORY.md` index is attached as the `AutoMem` system-reminder, the truncated content + WARNING is what the model sees.

**183 diff:** The 183 function `Zkt` (`cli_inner_pretty.js:151691`) is **byte-identical** in logic and string content. Constants `tie = 200` / `HTe = 25000` (183:150800-150801) == `RY = 200` / `Kae = 25000` (193:151953-151954). The WARNING string ("Only part of it was loaded… move detail into topic files") count is **1 in both bundles**.

### (b) Dream "Phase 4 — Prune and index" instruction

The auto-dream consolidation prompt explicitly tells the agent to compact the index:

> `Update \`${UH}\` so it stays under ${RY} lines AND under ~25KB. It's an **index**, not a dump …` (`cli_inner_pretty.js:463782`, 193)

**183 diff:** identical at `cli_inner_pretty.js:455358` (183), same `${tie}`/200, same "~25KB" copy.

### Verdict — Bullet 1: **CARRYOVER (NOT a 193 delta)**

Both reminder mechanisms exist byte-identical in 2.1.183. The 2.1.186 changelog attribution post-dates the actual code (the 183 tree already noted the "MEMORY.md compact reminder"). Confidence: **HIGH** (grep-counts identical in both bundles; functions diffed line-by-line).

> Adversarial check performed: searched 193 for any **proactive** "nearing/approaching the limit" reminder distinct from the over-limit truncation warning (`index file…`, `concise`, `nearing`, `approach`, `getting large`, soft-threshold %). The only matches (152416, 152518, 152663, 152596, 463785) all exist identically in 183. No net-new proactive reminder was added this window.

---

## Bullet 2 — Did DREAM change? (the real delta: `tengu_billiard_aviary` removal)

### Engine = carryover

| Symbol/string | 193 | 183 | Status |
|---|---|---|---|
| `tengu_auto_dream_fired` | 1 | 1 | carryover |
| `tengu_auto_dream_failed` | 1 | 1 | carryover |
| `tengu_auto_dream_skipped` | 2 | 2 | carryover |
| `tengu_auto_dream_completed` | 1 | 1 | carryover |
| `tengu_auto_dream_toggled` | 1 | 1 | carryover |
| `tengu_onyx_plover` (throttle cfg: minHours/minSessions) | 2 | 2 | carryover |
| `autoDreamEnabled` setting describe string | 1 | 1 | carryover |
| `.consolidate-lock` | 1 | 1 | carryover |
| `querySource:"auto_dream"` / `forkLabel:"auto_dream"` | 1/1 | 1/1 | carryover |
| `pendingMemoryUpdates` | 6 | 6 | carryover |
| `tengu_memdir_loaded` | 2 | 2 | carryover |

Dream firing logic lives in `executeAutoDream` (193: `j_l`, assigned inside `G_l` at `cli_inner_pretty.js:463837-463839`; throttle config `Daf` reads `tengu_onyx_plover` at `463818-463827`; fired event at `463889-463891`; failed at `463958`). 88 ancestor names: `initAutoDream` / `executeAutoDream` (`services/autoDream/autoDream.ts:122,319`).

### The body change: immutable-memory experiment deleted

In **183** the dream firing code branched on `aH()` (= feature gate `tengu_billiard_aviary`, default `false`, `cli_inner_pretty.js:147673`). The gate toggled an **entire alternate "immutable memory" architecture** — 11 call sites in 183:

| 183 site | What the gate did |
|---|---|
| `147670-147672` `XXu(): aH() ? YXu : KXu` | selected memory type name **`"tiny_memory"`** (gate on) vs **`"memory"`** (gate off) |
| `151881,151887,151952` | memory write path — immutable semantics (never edit in place) when gate on |
| `220230,220243` | stamped `created:` frontmatter date when gate on |
| `380775` | enabled the inline **`[Good]/[Bad]` memory rating widget** (`tiny_memory` survey) when gate on |
| `445405` | gated a memory-attachment path |
| `455478,455481` (dream) | tool-constraint string + which dream builder to call |

The dream branch specifically (183 `cli_inner_pretty.js:455478-455484`):

```javascript
// 183 — gate decides which dream prompt + tool-constraints copy
let b = aH();                                    // tengu_billiard_aviary
S = b
  ? `…plus deleting \`.md\` paths inside the memory directory. ${Fa} is not permitted — memories are immutable, so delete + ${Kc} to replace, never edit in place. …`
  : `…plus deleting \`.md\` paths… Anything else that writes, redirects to a file, or modifies state will be denied. …`;
…
T = b ? Hgi(h, S, p)     // "# Dream: Memory PRUNING"  (immutable, line 151520)
      : PQa(h, y, S, p); // "# Dream: Memory CONSOLIDATION"  (standard, line 455311)
```

In **193** the branch is **gone** — single path (`cli_inner_pretty.js:463896-463907`):

```javascript
let b = Ph(mr());   // now just the transcript directory path, NOT a gate
S = `…plus deleting \`.md\` paths… Anything else that writes, redirects to a file, or modifies state will be denied. …`;
…
H = $_l(y, b, S, p); // single "# Dream: Memory Consolidation" builder (463735)
```

**Confirmed removals (grep-count 183 → 193, all to 0):**

| String / symbol | 183 | 193 |
|---|---|---|
| `tengu_billiard_aviary` | 1 | **0** |
| `tiny_memory` | 4 | **0** |
| `"Dream: Memory Pruning"` (the `Hgi` immutable builder) | 1 | **0** |
| `"Memory files are immutable"` | 1 | **0** |
| `"never edit them in place"` | 1 | **0** |
| `"memories are immutable, so delete"` | 3 | **0** |
| `"Tool constraints for this run"` (variant count) | 2 | **1** |
| `onRate` (rating widget handlers) | 5 | **2** |
| `scopeCounts` (rating payload) | 2 | **0** |

The standard dream prompt builder is otherwise unchanged: `$_l` (193:463735) == `PQa` (183:455311) — same `# Dream: Memory Consolidation` header, same Phase 1-4 structure, same `Raf` ("Reconcile memories against CLAUDE.md", 1/1) and `kaf` (`team/` subdirectory block, 1/1).

### Verdict — Bullet 2: **REFINEMENT / dead-experiment CLEANUP** (not a new dream feature)

The dream engine itself is carryover; the only change is the **deletion** of the `tengu_billiard_aviary` immutable-memory experiment, which also retired the `tiny_memory` type, the `Hgi` "Dream: Memory Pruning" builder, the immutable write semantics, and the inline `[Good]/[Bad]` memory-rating widget. Because the gate defaulted to OFF, **default-config users see zero behavior change** on upgrade. The 88 ancestor `buildConsolidationPrompt` (`services/autoDream/consolidationPrompt.ts:10`) is single-path with no immutable variant, so 193 reverts toward the 88 shape. Confidence: **HIGH** (gate + every gated string drops to 0; firing branch diffed line-by-line).

> Upgrade-behavior note: none for default users. Anyone who had `tengu_billiard_aviary` server-enabled (an internal experiment) loses immutable-memory + `tiny_memory` rating + "Dream: Memory Pruning" mode silently on upgrade to 193.

---

## Bullet 3 — CLAUDE_MEMORY_STORES / findRelevantMemories / recall

| Symbol / string | 193 | 183 | Status |
|---|---|---|---|
| `CLAUDE_MEMORY_STORES` | 10 | 10 | **carryover** (identical parse/validation: `parseMemoryStoresEnv` at 193:151594-151612; "is not valid JSON", "failed validation", "duplicate mount", "more than one scope:user") |
| `parseMemoryStoresEnv` | 1 | 1 | carryover |
| `MemoryStores` (SDK resource) | 4 | 4 | carryover |
| `memory-prompt-index` / `promptIndexMaxBytes` | 3/3 | 3/3 | carryover (byteCap = `Kae` 25000, lineCap = `RY` 200 at 193:455274-455281) |
| `tengu_herring_clock` (memory-stores gate) | 2 | 2 | carryover |
| `findRelevantMemories` / `findRelevant` | **0** | **0** | does not exist in either bundle — guessed name, no such function |

The memory **recall** guidance strings ("You MUST access memory when the user explicitly asks you to check, recall, or remember"; "Recalled memories appearing inside `<system-reminder>` blocks are background context…"; "Memory records can become stale over time…") are all present in 193 and were present in 183.

The only measurable drop is **builder count**, not recall logic:
- `"# Memory"` section starts: 19 (183) → 13 (193); `"# Memory",` array-builder element: 3 → 2.
- `"When to access memories"` / `"You MUST access memory…"`: 4 → 3.

This drop is fully accounted for by the **removed immutable-mode system-prompt memory builder variant** (the same `tengu_billiard_aviary` cleanup), not by any change to recall behavior. The surviving builders (`m0i` private+team at 193:152393; `g0i` team-only/multi-dir at 152460; `VVr` single-dir at 152633) are carryover.

### Verdict — Bullet 3: **CARRYOVER.** `CLAUDE_MEMORY_STORES` and recall machinery unchanged; `findRelevantMemories` never existed. Confidence: **HIGH**.

---

## Anchor table (193 bundle)

| Bullet | 193 anchor | Obf symbol | Readable gloss | 183 diff | Confidence |
|---|---|---|---|---|---|
| 1 | `152573-152609` | `v$t` | `truncateMemoryIndexForPrompt` — caps index at 200 lines / 25KB, appends compact-it WARNING | == 183 `Zkt`@151691 (byte-identical) | high |
| 1 | `151952-151954` | `UH`/`RY`/`Kae` | `"MEMORY.md"` / line limit 200 / byte limit 25000 | == 183 `$w`/`tie`/`HTe`@150799-150801 | high |
| 1 | `233806` | `v$t(c).content` in `AutoMem` branch | reminder injection site (truncated index + WARNING) | == 183 @225707 | high |
| 1 | `463782` | dream Phase 4 string | "Update MEMORY.md so it stays under 200 lines AND under ~25KB" | == 183 @455358 | high |
| 2 | `463735-463808` | `$_l` | `buildConsolidationPrompt` — single dream prompt builder | == 183 `PQa`@455311 (standard path kept) | high |
| 2 | `463837-463960` | `G_l`/`j_l` | `initAutoDream`/`executeAutoDream` — firing + throttle + telemetry | logic carryover; branch on `aH()` removed | high |
| 2 | `463818-463827` | `Daf`, `tengu_onyx_plover` | `getDreamThrottleConfig` (minHours/minSessions) | == 183 | high |
| 2 | (removed) | 183 `aH`@147673 = `tengu_billiard_aviary` | immutable-memory experiment gate | 183=1 → 193=**0** | high |
| 2 | (removed) | 183 `Hgi`@151520 | "Dream: Memory Pruning" immutable builder | 183=1 → 193=**0** | high |
| 2 | (removed) | 183 `YXu`="tiny_memory" | immutable memory type + `[Good]/[Bad]` rating | 183=4 → 193=**0** | high |
| 3 | `151594-151612` | `parseMemoryStoresEnv` | `CLAUDE_MEMORY_STORES` env parse/validate | == 183 (10/10) | high |
| 3 | n/a | `findRelevantMemories` | (guessed name) | absent in both | high |

---

## Proposed module docs

Extend **`31_auto_memory/`**:

1. **`31_auto_memory/billiard_aviary_immutable_memory_removal.md`** (NEW) — document the deleted `tengu_billiard_aviary` "immutable memory / `tiny_memory`" experiment: what it was (immutable single-fact files, never edit in place; `created:`-stamped frontmatter; `[Good]/[Bad]` inline rating; "Dream: Memory **Pruning**" alternate builder `Hgi`), its 11 gate call sites in 183, and its complete removal in 193 (gate default-off → behavior-neutral for default users). This is the only substantive auto-memory delta this window.
2. **Update `31_auto_memory/` MEMORY.md-size-limit doc** — add an explicit "CARRYOVER, not 2.1.186-window" note: the `v$t`/`Zkt` truncation WARNING and dream Phase-4 compact instruction both predate 183; thresholds 200 lines / 25000 bytes; AutoMem injection at 193:233806. Correct any prior note that treats it as a fresh 2.1.186 addition.
3. **Dream carryover note** — record that the dream engine (throttle `tengu_onyx_plover`, 4 telemetry events, firing logic, standard `$_l`/`PQa` prompt) is unchanged 183→193; only the 2-way builder branch collapsed to single-path (toward 88 `buildConsolidationPrompt`).

No new `symbol_index_*` module dir needed; add the symbols below to `symbol_index_core_features.md` (Auto Memory / Dream sections).

### New symbols for `symbol_index_core_features.md`
- `v$t` — `truncateMemoryIndexForPrompt` — cli_inner_pretty.js:152573 — function
- `UH` — `MEMORY_INDEX_FILENAME` ("MEMORY.md") — cli_inner_pretty.js:151952 — constant
- `RY` — `MEMORY_INDEX_LINE_LIMIT` (200) — cli_inner_pretty.js:151953 — constant
- `Kae` — `MEMORY_INDEX_BYTE_LIMIT` (25000) — cli_inner_pretty.js:151954 — constant
- `$_l` — `buildConsolidationPrompt` (dream prompt) — cli_inner_pretty.js:463735 — function
- `G_l`/`j_l` — `initAutoDream`/`executeAutoDream` — cli_inner_pretty.js:463837/463839 — function
- `Daf` — `getDreamThrottleConfig` (tengu_onyx_plover) — cli_inner_pretty.js:463818 — function
- `parseMemoryStoresEnv` (`b5t`-region) — CLAUDE_MEMORY_STORES parser — cli_inner_pretty.js:151594 — function

---

## Depth assessment

**THIN (leaning moderate).** The auto-memory and dream engines are frozen this window — every telemetry event, throttle gate, prompt phase, size threshold, and `CLAUDE_MEMORY_STORES` validation is byte-identical to 2.1.183. The only genuine 183→193 delta in this theme is the **removal of the `tengu_billiard_aviary` immutable-memory / `tiny_memory` experiment** (gate + type + immutable write semantics + `Hgi` "Dream: Memory Pruning" builder + the `[Good]/[Bad]` rating widget), which is a dead-experiment cleanup with **no default-user behavior change**. The changelog's "compact MEMORY.md index" (2.1.186) is a **false delta for this window** — carryover from ≤183. Worth ~1 short module doc (the experiment removal) plus a correction note on the existing size-limit doc.
