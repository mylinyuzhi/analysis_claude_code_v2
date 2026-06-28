# MEMORY.md Compact Reminder & Dream Engine — CARRYOVER (v2.1.183 → v2.1.193)

> **Type:** CARRYOVER (false-delta correction + frozen-engine ledger). **Window:** v2.1.183 → v2.1.193.
> Every `cli_inner_pretty.js:<line>` is a **193** line unless tagged `(183)` or `(v2.1.88)`.

## TL;DR

Two things this window *look* like deltas but are not:

1. The changelog's **"MEMORY.md compact reminder near the size limit" (attributed to 2.1.186)** is **CARRYOVER**, not a 193-window change. Both mechanisms that implement it — the load-time over-limit truncation **WARNING** (`v$t`) and the dream **Phase-4** "keep it an index" instruction — exist **byte-identical in 2.1.183** and predate it. The thresholds (200 lines / 25000 bytes) are unchanged.
2. The **auto-dream engine** (throttle config, telemetry events, firing logic, the standard consolidation prompt, and `CLAUDE_MEMORY_STORES` recall) is **unchanged 183→193**. The *only* dream-path edit was the collapse of the 2-way builder branch to the single `$_l` — and that is the `tengu_billiard_aviary` removal documented in [`billiard_aviary_immutable_memory_removal.md`](./billiard_aviary_immutable_memory_removal.md), not a change to the engine itself.

This doc records the evidence so a future reader does not re-litigate the "2.1.186" attribution.

---

## 1. The MEMORY.md compact reminder is carryover (NOT a 193 delta)

The changelog (CHANGELOG.md, dated 2.1.186) says: *"Improved memory: the agent is now reminded to compact its `MEMORY.md` index when nearing the size limit."* There are **two** code mechanisms that implement "remind the agent to keep the index small," and **both** exist byte-identical in 2.1.183.

### 1a. The load-time truncation WARNING (`v$t`)

**What it does.** When `MEMORY.md` is loaded into context as the `AutoMem` system-reminder, it is passed through a size-limit function that **truncates** the index to 200 lines / 25000 bytes and **appends a warning** telling the agent the index is too large and to keep entries to one line / move detail into topic files.

**How it works.** Line/byte counts are taken; if either exceeds its cap the content is sliced (line-truncate first, then byte-truncate at the last newline ≤ cap so an entry is never cut mid-line), and a `> WARNING:` suffix is appended naming the overage. Edge case: byte-only overage cuts at `lastIndexOf("\n", cap)` (or hard `cap` if no newline) to avoid splitting a UTF-8 sequence mid-character at an arbitrary byte.

```javascript
// ============================================
// truncateMemoryIndexForPrompt - cap MEMORY.md at 200 lines / 25KB, append the compact-it WARNING
// Location: cli_inner_pretty.js:152573-152609 (193)  |  183 byte-identical: Zkt :151691
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
  return { content: a + `\n\n> WARNING: ${UH} is ${l}. Only part of it was loaded. Keep index entries to one line under ~200 chars; move detail into topic files.`,
           lineCount: r, byteCount: o, wasLineTruncated: s, wasByteTruncated: i };
}

// READABLE (for understanding):
function truncateMemoryIndexForPrompt(rawIndexText) {
  const text = rawIndexText.trim();
  const lines = text.split("\n");
  const lineCount = lines.length, byteCount = text.length;
  const lineTruncated = lineCount > MEMORY_INDEX_LINE_LIMIT;   // RY = 200
  const byteTruncated = byteCount > MEMORY_INDEX_BYTE_LIMIT;   // Kae = 25000
  if (!lineTruncated && !byteTruncated)
    return { content: text, lineCount, byteCount, wasLineTruncated: lineTruncated, wasByteTruncated: byteTruncated };
  let out = lineTruncated ? lines.slice(0, MEMORY_INDEX_LINE_LIMIT).join("\n") : text;
  if (out.length > MEMORY_INDEX_BYTE_LIMIT) {                  // byte-cut at the last newline ≤ cap
    const nl = out.lastIndexOf("\n", MEMORY_INDEX_BYTE_LIMIT);
    out = out.slice(0, nl > 0 ? nl : MEMORY_INDEX_BYTE_LIMIT);
  }
  const reason = byteTruncated && !lineTruncated
    ? `${formatBytes(byteCount)} (limit: ${formatBytes(MEMORY_INDEX_BYTE_LIMIT)}) — index entries are too long`
    : lineTruncated && !byteTruncated ? `${lineCount} lines (limit: ${MEMORY_INDEX_LINE_LIMIT})`
    : `${lineCount} lines and ${formatBytes(byteCount)}`;
  return { content: out + `\n\n> WARNING: ${MEMORY_INDEX_FILENAME} is ${reason}. Only part of it was loaded. Keep index entries to one line under ~200 chars; move detail into topic files.`,
           lineCount, byteCount, wasLineTruncated: lineTruncated, wasByteTruncated: byteTruncated };
}

// Mapping: v$t→truncateMemoryIndexForPrompt, RY→MEMORY_INDEX_LINE_LIMIT(200), Kae→MEMORY_INDEX_BYTE_LIMIT(25000),
//   UH→MEMORY_INDEX_FILENAME ("MEMORY.md"), La→formatBytes, e→rawIndexText
```

The constants are plain module vars (`cli_inner_pretty.js:151952-151954`):
```javascript
var UH = "MEMORY.md", RY = 200, Kae = 25000;   // 193 :151952-151954
```

**The injection site.** The truncated content + WARNING is what the model actually sees, because the `AutoMem` reminder branch passes the raw index through `v$t` (`cli_inner_pretty.js:233806`):
```javascript
if (n === "AutoMem") d = v$t(c).content;       // 193 :233806
```

**183 diff — byte-identical.** The 183 function is `Zkt` (183 `:151691`); identical logic and identical WARNING string. Constants `$w="MEMORY.md"` / `tie=200` / `HTe=25000` (183 `:150799-150801`) equal `UH`/`RY`/`Kae`. The injection site is 183 `:225707` (`if (n === "AutoMem") d = Zkt(c).content;`). The `"Only part of it was loaded… move detail into topic files"` WARNING string count is **1 in both bundles**.

### 1b. The dream "Phase 4 — Prune and index" instruction

The auto-dream consolidation prompt explicitly tells the agent to compact the index every dream pass (193 `:463782`):

> `Update \`${UH}\` so it stays under ${RY} lines AND under ~25KB. It's an **index**, not a dump — each entry should be one line under ~150 characters: \`- [Title](file.md) — one-line hook\`. Never write memory content directly into it.`

**183 diff — byte-identical** at 183 `:455358` (same `${$w}`/`${tie}`, same "~25KB" copy).

### Verdict — Bullet 1: CARRYOVER

Both reminder mechanisms exist byte-identical in 2.1.183. The "2.1.186" changelog attribution post-dates the actual code (the 183 analysis tree already documented the truncation WARNING + Phase-4 instruction). **Confidence: HIGH** — grep-counts identical in both bundles; `v$t`/`Zkt` diffed line-by-line.

> **Adversarial check.** Searched 193 for any *proactive* "nearing/approaching the limit" reminder distinct from the over-limit truncation WARNING (`nearing`, `approach`, `getting large`, a soft-threshold percentage). The only matches (`:152416`, `:152518`, `:152596`, `:152663`, `:463785`) all exist identically in 183. **No net-new proactive reminder was added this window.**

---

## 2. The dream engine is unchanged (only the builder branch collapsed)

**What it does.** Auto-dream is a per-turn-scheduled, throttled background consolidation pass that forks a restricted subagent to synthesize recent session transcripts into the memory directory. The throttle, the telemetry, and the firing closure are all carryover.

**The throttle config (`Daf`).** Reads the experiment `tengu_onyx_plover` for `minHours`/`minSessions`, falling back to defaults — byte-identical to 183:

```javascript
// ============================================
// getDreamThrottleConfig - dream cadence from tengu_onyx_plover (carryover, == 183)
// Location: cli_inner_pretty.js:463818-463827 (193)
// ============================================

// ORIGINAL (for source lookup):
function Daf() {
  let e = it("tengu_onyx_plover", null);
  return {
    minHours: typeof e?.minHours === "number" && Number.isFinite(e.minHours) && e.minHours > 0 ? e.minHours : B_l.minHours,
    minSessions: typeof e?.minSessions === "number" && Number.isFinite(e.minSessions) && e.minSessions > 0 ? e.minSessions : B_l.minSessions,
  };
}

// READABLE (for understanding):
function getDreamThrottleConfig() {
  const cfg = getExperimentConfig("tengu_onyx_plover", null);
  return {
    minHours:    isPositiveFiniteNumber(cfg?.minHours)    ? cfg.minHours    : DREAM_THROTTLE_DEFAULTS.minHours,
    minSessions: isPositiveFiniteNumber(cfg?.minSessions) ? cfg.minSessions : DREAM_THROTTLE_DEFAULTS.minSessions,
  };
}

// Mapping: Daf→getDreamThrottleConfig, it→getExperimentConfig, B_l→DREAM_THROTTLE_DEFAULTS
```

**The firing closure (`G_l` installs `j_l`).** `initAutoDream` (`G_l`, `:463837`) assigns the `executeAutoDream` closure (`j_l`, `:463839`), which reads the throttle, decides whether to fire, emits telemetry, and forks the restricted dream subagent. Logic is carryover; the only edit inside it is the `aH()`-branch removal (now `b = Ph(mr())`, single `$_l` builder) — see [`billiard_aviary_immutable_memory_removal.md`](./billiard_aviary_immutable_memory_removal.md) §3.

**Telemetry — all carryover (grep-count identical):**

| Event | 193 | 183 |
|---|:--:|:--:|
| `tengu_auto_dream_fired` (`:463891`) | 1 | 1 |
| `tengu_auto_dream_failed` | 1 | 1 |
| `tengu_auto_dream_skipped` | 2 | 2 |
| `tengu_auto_dream_completed` | 1 | 1 |
| `tengu_auto_dream_toggled` | 1 | 1 |

**The standard prompt builder is unchanged.** `$_l` (193 `:463735`) has a byte-identical body to 183 `PQa` (183 `:455311`) — same `# Dream: Memory Consolidation` header, same Phase 1-4 structure, same `Reconcile memories against CLAUDE.md` (1/1) and `team/` subdirectory block (1/1). With the immutable `Hgi` builder deleted, 193's single-path dream shape now matches the **v2.1.88 ancestor** `buildConsolidationPrompt` (`services/autoDream/consolidationPrompt.ts:10`), which never had an immutable variant.

> **Why the collapse is a *revert*, not a new feature.** The 2-way branch was added *for* the `tengu_billiard_aviary` experiment; removing the experiment naturally returns the dream to its pre-experiment, single-builder form. The engine did not gain anything — it lost a dead alternative. Calling this a "dream change" would be a false delta; the honest description is "the dream firing site lost its experiment branch."

---

## 3. `CLAUDE_MEMORY_STORES` and recall are carryover; `findRelevantMemories` never existed

**`CLAUDE_MEMORY_STORES`** is fully carryover (10 occurrences in both bundles; identical parse + validation). The parser is `qae` (`cli_inner_pretty.js:151593`) — it reads `process.env.CLAUDE_MEMORY_STORES`, JSON-parses it, and validates (`"is not valid JSON"`, `"failed validation"`, `"duplicate mount"`, `"more than one scope:user"`), all identical to 183.

> **Drift note (corrected from the scout dossier).** The dossier labelled the parser the "`b5t`-region." That is wrong: in 193, `b5t` is the **`permission_browser`** dialog (`var b5t; … b5t = hy({ kind: "permission_browser" …})`, `cli_inner_pretty.js:375261-375264`), unrelated to memory. The `CLAUDE_MEMORY_STORES` parser is the function `qae` at `:151593`.

The recall guidance strings (`"You MUST access memory when the user explicitly asks you to check, recall, or remember"`, `"Recalled memories appearing inside <system-reminder> blocks are background context…"`, `"Memory records can become stale over time…"`) are present in 193 and were present in 183. The surviving recall/system-prompt builders `m0i` (`:152389`, private+team), `g0i` (`:152460`, team-only/multi-dir), and `VVr` (`:152638`, single-dir) are carryover.

**`findRelevantMemories` / `findRelevant` does not exist** in either bundle (grep-count 0/0) — it was a guessed name, not a real symbol.

The only measurable recall-side drop is the `# Memory` system-prompt fragment count (19 → 13), which is **fully accounted for by the removed immutable-mode memory-builder variant** (the `tengu_billiard_aviary` cleanup) — not by any change to recall behaviour.

### Verdict — Bullet 3: CARRYOVER. **Confidence: HIGH.**

---

## 4. Cross-links

- Sibling 193 doc (the one real delta): [`billiard_aviary_immutable_memory_removal.md`](./billiard_aviary_immutable_memory_removal.md).
- Module index: [`README.md`](./README.md).
- Canonical 183 auto-memory tree (engine carryover, `CLAUDE_MEMORY_STORES` recall path): [`../../../claude_code_v_2.1.183/analyze/31_auto_memory/README.md`](../../../claude_code_v_2.1.183/analyze/31_auto_memory/README.md) (see its TL;DR: `$w/tie/HTe` caps, `.consolidate-lock`, `tengu_onyx_plover` throttle — all the same values cited here). Readable-source: [`reconstructed_source/`](../../../claude_code_v_2.1.183/analyze/31_auto_memory/reconstructed_source/README.md).
- v2.1.156 baseline (three dream surfaces, the engine architecture): [`../../../claude_code_v_2.1.156/analyze/31_auto_memory/README.md`](../../../claude_code_v_2.1.156/analyze/31_auto_memory/README.md).

---

## Related Symbols

> Symbol mappings live in the central index files, never in this doc:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (**Auto Memory** lives here)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations
> - per-feature additions: [symbol_additions_v2_1_193_auto_memory.md](../00_overview/symbol_additions_v2_1_193_auto_memory.md)

Key symbols in this document (list format, per CLAUDE.md):

- `truncateMemoryIndexForPrompt` (obf: `v$t`, `cli_inner_pretty.js:152573`) — caps `MEMORY.md` at 200 lines / 25000 bytes, appends the compact-it WARNING; byte-identical to 183 `Zkt` (183 `:151691`). Injected at the `AutoMem` reminder branch `:233806` (183 `:225707`).
- `MEMORY_INDEX_FILENAME` / `_LINE_LIMIT` / `_BYTE_LIMIT` (obf: `UH`/`RY`/`Kae`, `cli_inner_pretty.js:151952-151954`) — `"MEMORY.md"` / `200` / `25000`; 183 `$w`/`tie`/`HTe` (183 `:150799-150801`).
- `formatBytes` (obf: `La`) — byte-count humanizer used in the WARNING reason string.
- `getDreamThrottleConfig` (obf: `Daf`, `cli_inner_pretty.js:463818`) — dream cadence from `tengu_onyx_plover` (`minHours`/`minSessions`); carryover.
- `initAutoDream` / `executeAutoDream` (obf: `G_l` / `j_l`, `cli_inner_pretty.js:463837` / `:463839`) — firing closure; carryover (only the `aH()` branch removed).
- `buildConsolidationPrompt` (obf: `$_l`, `cli_inner_pretty.js:463735`) — single dream builder; body == 183 `PQa` (183 `:455311`); the dream Phase-4 "stays under 200 lines / ~25KB" line is at `:463782`.
- `parseMemoryStoresEnv` (obf: `qae`, `cli_inner_pretty.js:151593`) — `CLAUDE_MEMORY_STORES` JSON parse/validate; carryover (10/10). Not to be confused with `b5t` = `permission_browser` dialog (`:375261`).
- Recall/system-prompt memory builders (carryover): `m0i` (`:152389`), `g0i` (`:152460`), `VVr` (`:152638`).
