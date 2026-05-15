# Cross-Validation Report

- **Unit:** 02
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/.claude/worktrees/agent-a3b36c06d35c6be51/claude_code_v_2.1.142/analyze`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` (611353 lines)
- **Per-decl dir:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/unknown`
- **Markdown files scanned:** 12

## C1 — Symbol existence (187 candidates)
- PASS: 174
- WARN: 13 (pattern looked obfuscated but not in bundle — false-positive identifier, rename, or stale claim)

Missing symbols (top 30):
  - `RjY` — first cited in `00_overview/symbol_additions_v2_1_142_plan_mode.md` line 17
  - `SjY` — first cited in `00_overview/symbol_additions_v2_1_142_plan_mode.md` line 18
  - `UJz` — first cited in `00_overview/symbol_additions_v2_1_142_plan_mode.md` line 61
  - `Vs2` — first cited in `00_overview/symbol_additions_v2_1_142_plan_mode.md` line 30
  - `gJz` — first cited in `00_overview/symbol_additions_v2_1_142_plan_mode.md` line 65
  - `i$Y` — first cited in `00_overview/symbol_additions_v2_1_142_plan_mode.md` line 31
  - `iJz` — first cited in `00_overview/symbol_additions_v2_1_142_plan_mode.md` line 57
  - `jMY` — first cited in `00_overview/symbol_additions_v2_1_142_plan_mode.md` line 97
  - `n$Y` — first cited in `00_overview/symbol_additions_v2_1_142_plan_mode.md` line 28
  - `oJz` — first cited in `00_overview/symbol_additions_v2_1_142_plan_mode.md` line 54
  - `rJz` — first cited in `00_overview/symbol_additions_v2_1_142_plan_mode.md` line 53
  - `rQY` — first cited in `00_overview/symbol_additions_v2_1_142_plan_mode.md` line 185
  - `zYA` — first cited in `00_overview/symbol_additions_v2_1_142_plan_mode.md` line 150

## C2 — Line/symbol pairing (314 pairs)
- PASS: 290
- FAIL: 24

Mismatched line citations (top 30):
  - `bf` not found near `cli_inner_pretty.js:383640-383640` (cited in `00_overview/symbol_additions_v2_1_142_plan_mode.md`)
  - `gj4` not found near `cli_inner_pretty.js:475135-475135` (cited in `00_overview/symbol_additions_v2_1_142_plan_mode.md`)
  - `getPlan` not found near `cli_inner_pretty.js:517662-517662` (cited in `12_plan_mode/README.md`)
  - `getPlan` not found near `cli_inner_pretty.js:517662-517662` (cited in `12_plan_mode/approval_flow.md`)
  - `call` not found near `cli_inner_pretty.js:381714-381714` (cited in `12_plan_mode/cross_validation.md`)
  - `call` not found near `cli_inner_pretty.js:381713-381713` (cited in `12_plan_mode/cross_validation.md`)
  - `getPlan` not found near `cli_inner_pretty.js:517662-517670` (cited in `12_plan_mode/cross_validation.md`)
  - `NOUNS` not found near `cli_inner_pretty.js:139002-139002` (cited in `12_plan_mode/cross_validation.md`)
  - `VERBS` not found near `cli_inner_pretty.js:139002-139002` (cited in `12_plan_mode/cross_validation.md`)
  - `gj4` not found near `cli_inner_pretty.js:475135-475176` (cited in `12_plan_mode/cross_validation.md`)
  - `bf` not found near `cli_inner_pretty.js:383640-383640` (cited in `12_plan_mode/enter_plan_mode_tool.md`)
  - `getPlan` not found near `cli_inner_pretty.js:517662-517662` (cited in `12_plan_mode/exit_plan_mode_tool.md`)
  - `tD` not found near `cli_inner_pretty.js:421900-421923` (cited in `12_plan_mode/hooks_integration.md`)
  - `U$` not found near `cli_inner_pretty.js:2270-2274` (cited in `12_plan_mode/implementation.md`)
  - `U$` not found near `cli_inner_pretty.js:2270-2274` (cited in `12_plan_mode/implementation.md`)
  - `hG$` not found near `cli_inner_pretty.js:518295-518301` (cited in `12_plan_mode/implementation.md`)
  - `call` not found near `cli_inner_pretty.js:381773-381773` (cited in `12_plan_mode/permission_mode_persistence.md`)
  - `getPlan` not found near `cli_inner_pretty.js:517662-517670` (cited in `12_plan_mode/plan_file_naming.md`)
  - `NOUNS` not found near `cli_inner_pretty.js:139002-139002` (cited in `12_plan_mode/plan_file_naming.md`)
  - `VERBS` not found near `cli_inner_pretty.js:139002-139002` (cited in `12_plan_mode/plan_file_naming.md`)
  - `Wv5` not found near `cli_inner_pretty.js:483839-483839` (cited in `12_plan_mode/plan_file_naming.md`)
  - `NOUNS` not found near `cli_inner_pretty.js:139002-139002` (cited in `12_plan_mode/plan_file_naming.md`)
  - `getPlan` not found near `cli_inner_pretty.js:517662-517662` (cited in `12_plan_mode/remote_sessions.md`)
  - `gj4` not found near `cli_inner_pretty.js:475135-475176` (cited in `12_plan_mode/ultraplan_integration.md`)

## C3 — Line range sanity (440 ranges)
- PASS: 440
- FAIL: 0

## C4 — Per-decl file existence (0 citations)
- PASS: 0
- FAIL: 0

## C5 — Mapping consistency in `00_overview/symbol_additions_v2_1_142_plan_mode.md`
- Mappings: 108
- Conflicts: 0

## S1 — Semantic spot-check (5 random samples)

### Sample — `Hy4` at `cli_inner_pretty.js:517671-517671` (cited in `00_overview/symbol_additions_v2_1_142_plan_mode.md`)

```js
}
function Hy4(H) {
  return H.messages.find(($) => $.slug)?.slug;
}

```

**Verdict:** PASS — symbol present in cited window

### Sample — `Cv8` at `cli_inner_pretty.js:2955-2955` (cited in `00_overview/symbol_additions_v2_1_142_plan_mode.md`)

```js
}
function Cv8() {
  return U$.needsPlanModeExitAttachment;
}

```

**Verdict:** PASS — symbol present in cited window

### Sample — `gh1` at `cli_inner_pretty.js:139002-139002` (cited in `00_overview/symbol_additions_v2_1_142_plan_mode.md`)

```js
}
var WTK, ZTK, GTK, gh1;
var imH = T(() => {
  ((WTK = require("crypto")),

```

**Verdict:** PASS — symbol present in cited window

### Sample — `ZTK` at `cli_inner_pretty.js:139005-139005` (cited in `12_plan_mode/cross_validation.md`)

```js
  ((WTK = require("crypto")),
    (ZTK = [
      "abundant",
      "ancient",

```

**Verdict:** PASS — symbol present in cited window

### Sample — `a05` at `cli_inner_pretty.js:475237-475237` (cited in `00_overview/symbol_additions_v2_1_142_plan_mode.md`)

```js
}
function a05(H) {
  let $ = dj4(H),
    q = `${o05}

```

**Verdict:** PASS — symbol present in cited window

---

## Summary

- C1 Symbol existence: 174 PASS / 13 WARN
- C2 Line/symbol pairing: 290 PASS / 24 FAIL
- C3 Range sanity: 440 PASS / 0 FAIL
- C4 Per-decl files: 0 PASS / 0 FAIL
- C5 Mapping conflicts: 0
- S1 Semantic spot-check: 5 PASS / 0 WARN

**Overall verdict: FAIL**

## C6 — ORIGINAL fidelity (3 sampled blocks)

### Sample — `12_plan_mode/enter_plan_mode_tool.md` block citing `cli_inner_pretty.js:422720-422735`
- Identifiers in ORIGINAL block: 21
- Present in cited bundle window: 21
- Fidelity: 100.0%
- **Verdict: PASS**

### Sample — `12_plan_mode/exit_plan_mode_tool.md` block citing `cli_inner_pretty.js:381649-381708`
- Identifiers in ORIGINAL block: 85
- Present in cited bundle window: 84
- Fidelity: 98.8%
- **Verdict: PASS**

### Sample — `12_plan_mode/plan_file_naming.md` block citing `cli_inner_pretty.js:138987-138996`
- Identifiers in ORIGINAL block: 12
- Present in cited bundle window: 12
- Fidelity: 100.0%
- **Verdict: PASS**

