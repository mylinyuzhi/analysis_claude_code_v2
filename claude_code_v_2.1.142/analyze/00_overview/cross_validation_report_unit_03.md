# Cross-Validation Report

- **Unit:** 03
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/.claude/worktrees/agent-a005b362a93f85f8b/claude_code_v_2.1.142/analyze`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` (611353 lines)
- **Per-decl dir:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/unknown`
- **Markdown files scanned:** 14

## C1 — Symbol existence (216 candidates)
- PASS: 195
- WARN: 21 (pattern looked obfuscated but not in bundle — false-positive identifier, rename, or stale claim)

Missing symbols (top 30):
  - `$qz` — first cited in `00_overview/symbol_additions_v2_1_142_auto_memory.md` line 184
  - `BMz` — first cited in `00_overview/symbol_additions_v2_1_142_auto_memory.md` line 134
  - `BtY` — first cited in `00_overview/symbol_additions_v2_1_142_auto_memory.md` line 205
  - `FMz` — first cited in `00_overview/symbol_additions_v2_1_142_auto_memory.md` line 129
  - `FtY` — first cited in `00_overview/symbol_additions_v2_1_142_auto_memory.md` line 206
  - `IVK6` — first cited in `31_auto_memory/README.md` line 172
  - `QMz` — first cited in `00_overview/symbol_additions_v2_1_142_auto_memory.md` line 132
  - `UMz` — first cited in `00_overview/symbol_additions_v2_1_142_auto_memory.md` line 131
  - `a5z` — first cited in `00_overview/symbol_additions_v2_1_142_auto_memory.md` line 118
  - `bMY` — first cited in `00_overview/symbol_additions_v2_1_142_auto_memory.md` line 169
  - `cMz` — first cited in `00_overview/symbol_additions_v2_1_142_auto_memory.md` line 150
  - `dMz` — first cited in `00_overview/symbol_additions_v2_1_142_auto_memory.md` line 126
  - `g8z` — first cited in `00_overview/symbol_additions_v2_1_142_auto_memory.md` line 76
  - `gMz` — first cited in `00_overview/symbol_additions_v2_1_142_auto_memory.md` line 130
  - `iJY` — first cited in `31_auto_memory/cross_validation.md` line 62
  - `iMz` — first cited in `00_overview/symbol_additions_v2_1_142_auto_memory.md` line 149
  - `lMz` — first cited in `00_overview/symbol_additions_v2_1_142_auto_memory.md` line 151
  - `mMz` — first cited in `00_overview/symbol_additions_v2_1_142_auto_memory.md` line 133
  - `nMz` — first cited in `00_overview/symbol_additions_v2_1_142_auto_memory.md` line 147
  - `pMz` — first cited in `00_overview/symbol_additions_v2_1_142_auto_memory.md` line 134
  - `ptY` — first cited in `00_overview/symbol_additions_v2_1_142_auto_memory.md` line 15

## C2 — Line/symbol pairing (321 pairs)
- PASS: 304
- FAIL: 17

Mismatched line citations (top 30):
  - `vZH` not found near `cli_inner_pretty.js:142855-142855` (cited in `00_overview/symbol_additions_v2_1_142_auto_memory.md`)
  - `OS1` not found near `cli_inner_pretty.js:142855-142855` (cited in `00_overview/symbol_additions_v2_1_142_auto_memory.md`)
  - `name` not found near `cli_inner_pretty.js:237088-237088` (cited in `31_auto_memory/frontmatter_parsing.md`)
  - `tO` not found near `cli_inner_pretty.js:141803-141805` (cited in `31_auto_memory/frontmatter_parsing.md`)
  - `oi$` not found near `cli_inner_pretty.js:142688-142698` (cited in `31_auto_memory/memdir_core.md`)
  - `B97` not found near `cli_inner_pretty.js:398235-398235` (cited in `31_auto_memory/memory_age.md`)
  - `ci$` not found near `cli_inner_pretty.js:141915-141916` (cited in `31_auto_memory/memory_types.md`)
  - `TD` not found near `cli_inner_pretty.js:142583-142595` (cited in `31_auto_memory/team_paths.md`)
  - `$qz` not found near `cli_inner_pretty.js:142495-142510` (cited in `31_auto_memory/team_paths.md`)
  - `vp` not found near `cli_inner_pretty.js:142515-142517` (cited in `31_auto_memory/team_paths.md`)
  - `Ye6` not found near `cli_inner_pretty.js:142511-142514` (cited in `31_auto_memory/team_paths.md`)
  - `JW4` not found near `cli_inner_pretty.js:142522-142543` (cited in `31_auto_memory/team_paths.md`)
  - `XW4` not found near `cli_inner_pretty.js:142544-142555` (cited in `31_auto_memory/team_paths.md`)
  - `MW4` not found near `cli_inner_pretty.js:142556-142560` (cited in `31_auto_memory/team_paths.md`)
  - `jqz` not found near `cli_inner_pretty.js:142561-142569` (cited in `31_auto_memory/team_paths.md`)
  - `JR8` not found near `cli_inner_pretty.js:142570-142579` (cited in `31_auto_memory/team_paths.md`)
  - `Ae6` not found near `cli_inner_pretty.js:142580-142582` (cited in `31_auto_memory/team_paths.md`)

## C3 — Line range sanity (441 ranges)
- PASS: 441
- FAIL: 0

## C4 — Per-decl file existence (0 citations)
- PASS: 0
- FAIL: 0

## C5 — Mapping consistency in `00_overview/symbol_additions_v2_1_142_auto_memory.md`
- Mappings: 110
- Conflicts: 0

## S1 — Semantic spot-check (5 random samples)

### Sample — `vZH` at `cli_inner_pretty.js:142855-142855` (cited in `00_overview/symbol_additions_v2_1_142_auto_memory.md`)

```js
}
async function c5$(H) {
  let $ = x9(),
    q = process.env.CLAUDE_COWORK_MEMORY_GUIDELINES;

```

**Verdict:** WARN — symbol absent from cited window

### Sample — `Dl` at `cli_inner_pretty.js:142515-142517` (cited in `31_auto_memory/team_paths.md`)

```js
}
function Dl() {
  return (hE.join(UY(), "team") + hE.sep).normalize("NFC");
}
function ii$() {
  if (!g5$()) return !1;

```

**Verdict:** PASS — symbol present in cited window

### Sample — `nh1` at `cli_inner_pretty.js:139836-139836` (cited in `31_auto_memory/paths.md`)

```js
  ch1 = "tiny_memory",
  nh1 = "MEMORY.md",
  UY;
var Lz = T(() => {

```

**Verdict:** PASS — symbol present in cited window

### Sample — `gM` at `cli_inner_pretty.js:139780-139782` (cited in `00_overview/symbol_additions_v2_1_142_auto_memory.md`)

```js
}
function gM() {
  return Z$("tengu_billiard_aviary", !1);
}
function VTK(H, $) {
  if (!H) return;

```

**Verdict:** PASS — symbol present in cited window

### Sample — `PKH` at `cli_inner_pretty.js:142717-142725` (cited in `31_auto_memory/memdir_core.md`)

```js
}
async function PKH(H) {
  let $ = C$();
  try {
    await $.mkdir(H);
  } catch (q) {
    let K = O8(q);
    N(`ensureMemoryDirExists failed for ${H}: ${K ?? String(q)}`, { level: "debug" });
  }
}
function jl(H, $) {
  C$()

```

**Verdict:** PASS — symbol present in cited window

---

## Summary

- C1 Symbol existence: 195 PASS / 21 WARN
- C2 Line/symbol pairing: 304 PASS / 17 FAIL
- C3 Range sanity: 441 PASS / 0 FAIL
- C4 Per-decl files: 0 PASS / 0 FAIL
- C5 Mapping conflicts: 0
- S1 Semantic spot-check: 4 PASS / 1 WARN

**Overall verdict: FAIL**

## C6 — ORIGINAL fidelity (3 sampled blocks)

### Sample — `31_auto_memory/memdir_core.md` block citing `cli_inner_pretty.js:142678-142716`
- Identifiers in ORIGINAL block: 47
- Present in cited bundle window: 47
- Fidelity: 100.0%
- **Verdict: PASS**

### Sample — `31_auto_memory/messages_integration.md` block citing `cli_inner_pretty.js:398235-398242`
- Identifiers in ORIGINAL block: 6
- Present in cited bundle window: 6
- Fidelity: 100.0%
- **Verdict: PASS**

### Sample — `31_auto_memory/memory_types.md` block citing `cli_inner_pretty.js:141958-141960`
- Identifiers in ORIGINAL block: 4
- Present in cited bundle window: 4
- Fidelity: 100.0%
- **Verdict: PASS**

