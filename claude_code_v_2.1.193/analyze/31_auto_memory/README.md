# Module 31 — Auto Memory & Dream — v2.1.183 → v2.1.193 DELTA (EXTEND, thin)

> **This is a thin EXTEND module.** It documents only what changed in the auto-memory / "dream" subsystem between **v2.1.183** and **v2.1.193**. Every `cli_inner_pretty.js:<line>` citation is a line in the **v2.1.193** bundle (`/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`, VERSION `2.1.193`, build `a1938d2a`, 2026-06-25) unless explicitly tagged `(183)` or `(v2.1.88)`.
>
> **Canonical references (read these for everything unchanged):**
> - The 183 delta tree — [`../../../claude_code_v_2.1.183/analyze/31_auto_memory/README.md`](../../../claude_code_v_2.1.183/analyze/31_auto_memory/README.md) — the `CLAUDE_MEMORY_STORES` team-store recall path (2.1.172), the `<memory>`-block render, the status-line change (2.1.181), plus a full readable-source reconstruction under [`reconstructed_source/`](../../../claude_code_v_2.1.183/analyze/31_auto_memory/reconstructed_source/README.md).
> - The 156 baseline (the canonical architecture) — [`../../../claude_code_v_2.1.156/analyze/31_auto_memory/`](../../../claude_code_v_2.1.156/analyze/31_auto_memory/README.md) — the three writers, the three dream surfaces, caps, the `.consolidate-lock` protocol, the extraction subagent, and the tool sandbox.
>
> The obfuscated names below were **re-derived for the 193 bundle**. A 183 obf name (`Zkt`, `$w`, `tie`, `HTe`, `PQa`, `aH`, `Hgi`, …) is **never** reused here; use the anchor list in [§ Related Symbols](#related-symbols) and [`symbol_additions_v2_1_193_auto_memory.md`](../00_overview/symbol_additions_v2_1_193_auto_memory.md) as the canonical 193 map.

---

## TL;DR — the engine is frozen this window; the one real delta is a dead-experiment deletion

The auto-memory writer/recall engine **and** the auto-dream engine are **CARRYOVER** from 2.1.183 — re-mangled but byte-identical in logic. The throttle config, the four+ dream telemetry events, the firing logic, the standard consolidation prompt, the load-time `MEMORY.md` truncation warning, and the `CLAUDE_MEMORY_STORES` mount machinery all reproduce 2.1.183 exactly. The single genuine 183→193 behavioural-surface change is a **removal**:

**The `tengu_billiard_aviary`-gated "immutable memory / `tiny_memory`" experiment was deleted.** This retired the gate, the `tiny_memory` memory-type, the immutable write semantics (delete-and-rewrite, never edit in place; `created:`-stamped frontmatter), the inline `[Good]/[Bad]` memory-rating widget, and the `Hgi` "**Dream: Memory Pruning**" alternate prompt builder. The dream firing code collapsed from a 2-way `aH() ? Hgi : PQa` branch to a **single** `$_l` consolidation builder. Because the gate defaulted **OFF** (`tengu_billiard_aviary`, default `false`), **default-config users see zero behaviour change** on upgrade; only internal-experiment users on the gate-ON path lose immutable mode.

The changelog's "MEMORY.md compact reminder near the size limit" (attributed to **2.1.186**) is a **false delta for this window**: both the over-limit truncation WARNING and the dream Phase-4 "keep it an index" instruction exist **byte-identical in 2.1.183** (and predate it). It is documented here only to correct the attribution.

---

## What changed at a glance

| # | Item | Kind | 193 anchor | 183 before | Confidence |
|---|------|------|-----------|------------|:----------:|
| A | `tengu_billiard_aviary` immutable-memory / `tiny_memory` experiment **deleted** (gate + type + immutable writes + `[Good]/[Bad]` widget + `Hgi` "Dream: Memory Pruning" builder) | **REFINEMENT** (dead-experiment cleanup; behavior-neutral default) | gate/type/builder absent (grep=0); single dream builder `$_l` :463735, firing `$_l(y,b,S,p)` :463907 | gate `aH` :147673; `XXu` selector :147670; `Hgi` :151520; `YXu="tiny_memory"` :147730; 2-way branch :455488 | high |
| B | `MEMORY.md` over-limit truncation WARNING (`v$t`, 200 lines / 25000 bytes) + dream Phase-4 "it's an index" instruction | **CARRYOVER** (predates 183; the "2.1.186" changelog label lags the ship) | `v$t` :152573; consts `UH/RY/Kae` :151952-151954; AutoMem inject :233806; Phase-4 :463782 | `Zkt` :151691; `$w/tie/HTe` :150799-150801; inject :225707; Phase-4 :455358 (all byte-identical) | high |
| C | Auto-dream engine (throttle `tengu_onyx_plover`, telemetry, firing) | **CARRYOVER** | `Daf` :463818; `G_l`/`j_l` :463837/:463839; `tengu_auto_dream_*` events | identical (only re-mangled) | high |
| D | `CLAUDE_MEMORY_STORES` env parse/validate (`qae`) + recall guidance | **CARRYOVER** (10/10 occurrences) | `qae` :151593; builders `m0i` :152389 (private+team) / `g0i` :152460 (team-only/multi-dir/read-only) / `VVr` :152638 (single-dir) | identical parse/validation + same variant split as 183 | high |
| — | `findRelevantMemories` / `findRelevant` | **does not exist** in either bundle (a guessed name) | grep=0 | grep=0 | high |

---

## Index of this module

| Doc | Scope | Kind |
|-----|-------|------|
| [`billiard_aviary_immutable_memory_removal.md`](./billiard_aviary_immutable_memory_removal.md) | The deleted `tengu_billiard_aviary` immutable-memory / `tiny_memory` experiment: 16 `aH()` gate call-sites in 183, the `Hgi` "Dream: Memory Pruning" builder, the `[Good]/[Bad]` rating widget, immutable write semantics — all gone in 193. The only substantive auto-memory delta this window. | **REFINEMENT** (item A) |
| [`memory_reminder_and_dream_carryover.md`](./memory_reminder_and_dream_carryover.md) | Why the "2.1.186 MEMORY.md compact reminder" is carryover (the `v$t` truncation WARNING + dream Phase-4 instruction predate 183); the dream engine unchanged 183→193 (the 2-way builder branch collapsed to the single `$_l`, reverting toward the v2.1.88 `buildConsolidationPrompt`); `CLAUDE_MEMORY_STORES`/recall carryover; `findRelevantMemories` never existed. | **CARRYOVER** (items B/C/D) |

---

## Carryover ledger (the frozen engine — grep-counts identical 183 ↔ 193)

These were re-verified identical (count, logic, and string content) in both bundles and are **not** 193 deltas:

| Symbol / string | 193 | 183 | Status |
|---|:--:|:--:|---|
| `tengu_auto_dream_fired` | 1 | 1 | carryover |
| `tengu_auto_dream_failed` | 1 | 1 | carryover |
| `tengu_auto_dream_skipped` | 2 | 2 | carryover |
| `tengu_auto_dream_completed` | 1 | 1 | carryover |
| `tengu_auto_dream_toggled` | 1 | 1 | carryover |
| `tengu_onyx_plover` (throttle: minHours/minSessions) | 2 | 2 | carryover |
| `CLAUDE_MEMORY_STORES` | 10 | 10 | carryover |
| `Reconcile memories against CLAUDE.md` (dream Phase-3) | 1 | 1 | carryover |
| `# Dream: Memory Consolidation` header | 1 | 1 | carryover |
| `MEMORY.md` truncation WARNING ("Only part of it was loaded…") | 1 | 1 | carryover |

And the removals (item A) drop cleanly to 0:

| String / symbol (the experiment) | 193 | 183 |
|---|:--:|:--:|
| `tengu_billiard_aviary` | **0** | 1 |
| `tiny_memory` | **0** | 4 |
| `Dream: Memory Pruning` | **0** | 1 |
| `Memory files are immutable` | **0** | 1 |
| `memories are immutable, so delete` | **0** | 3 |
| `Tool constraints for this run` (variant count) | **1** | 2 |
| genuine `[Good]/[Bad]` rating handlers (`onRate:`) | **0** | 3 |
| `scopeCounts` (rating payload) | **0** | 2 |
| `# Memory` (system-prompt builder fragments) | 13 | 19 |

---

## Related Symbols

> Symbol mappings live in the central index files, never in this doc:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (**Auto Memory** lives here)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations
> - per-feature additions: [symbol_additions_v2_1_193_auto_memory.md](../00_overview/symbol_additions_v2_1_193_auto_memory.md)

Key functions/constants in this module (list format, per CLAUDE.md):

- `truncateMemoryIndexForPrompt` (obf: `v$t`, `cli_inner_pretty.js:152573`) — caps `MEMORY.md` at 200 lines / 25000 bytes, appends the compact-it WARNING; 183 predecessor `Zkt` (183 `:151691`), byte-identical.
- `MEMORY_INDEX_FILENAME` / `_LINE_LIMIT` / `_BYTE_LIMIT` (obf: `UH`/`RY`/`Kae`, `cli_inner_pretty.js:151952-151954`) — `"MEMORY.md"` / `200` / `25000`; 183 `$w`/`tie`/`HTe` (183 `:150799-150801`).
- `buildConsolidationPrompt` (obf: `$_l`, `cli_inner_pretty.js:463735`) — the single dream prompt builder; body byte-identical to 183 `PQa` (183 `:455311`); v2.1.88 ancestor `buildConsolidationPrompt`.
- `initAutoDream` / `executeAutoDream` (obf: `G_l` / `j_l`, `cli_inner_pretty.js:463837` / `:463839`) — dream firing closure; logic carryover, the `aH()` branch removed.
- `getDreamThrottleConfig` (obf: `Daf`, `cli_inner_pretty.js:463818`) — reads `tengu_onyx_plover` for `minHours`/`minSessions`; carryover.
- `parseMemoryStoresEnv` (obf: `qae`, `cli_inner_pretty.js:151593`) — `CLAUDE_MEMORY_STORES` JSON parse/validate; carryover (10/10).
- 183 before-picture (removed in 193): gate `aH` = `tengu_billiard_aviary` (183 `:147673`); memory-type selector `XXu` (183 `:147670`) → `YXu="tiny_memory"` (183 `:147730`) vs `KXu="memory"` (183 `:147729`); immutable dream builder `Hgi` "Dream: Memory Pruning" (183 `:151520`); `[Good]/[Bad]` rating widget `FOa` (183 `:378926`).
