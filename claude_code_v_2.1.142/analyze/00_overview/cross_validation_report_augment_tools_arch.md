# Cross-Validation Report

- **Unit:** 01
- **Docs base:** `claude_code_v_2.1.142/analyze`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` (611353 lines)
- **Per-decl dir:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/unknown`
- **Markdown files scanned:** 18

## C1 — Symbol existence (184 candidates)
- PASS: 183
- WARN: 1 (pattern looked obfuscated but not in bundle — false-positive identifier, rename, or stale claim)

Missing symbols (top 30):
  - `Mr3` — first cited in `04_tools/registration.md` line 297

## C2 — Line/symbol pairing (96 pairs)
- PASS: 96
- FAIL: 0

## C3 — Line range sanity (246 ranges)
- PASS: 246
- FAIL: 0

## C4 — Per-decl file existence (0 citations)
- PASS: 0
- FAIL: 0

## C5 — Mapping consistency in `00_overview/symbol_additions_v2_1_142_sandbox.md`
- Mappings: 119
- Conflicts: 0

## C5 — Mapping consistency in `00_overview/symbol_additions_v2_1_142_tools_arch.md`
- Mappings: 3
- Conflicts: 0

## S1 — Semantic spot-check (5 random samples)

### Sample — `Q3H` at `cli_inner_pretty.js:211429-211429` (cited in `00_overview/symbol_additions_v2_1_142_tools_arch.md`)

```js
var $n = "TaskOutput";
var Q3H = "EnterPlanMode";
var Gz = "AskUserQuestion",
  ClK = 12,

```

**Verdict:** PASS — symbol present in cited window

### Sample — `wi7` at `cli_inner_pretty.js:385777-385777` (cited in `00_overview/symbol_additions_v2_1_142_tools_arch.md`)

```js
});
var wi7 = {};
J$(wi7, { SendUserFileTool: () => fH5 });
var zH5, YH5, fH5;

```

**Verdict:** PASS — symbol present in cited window

### Sample — `v9` at `cli_inner_pretty.js:141468-141468` (cited in `00_overview/symbol_additions_v2_1_142_tools_arch.md`)

```js
}
var v9 = "Grep";
var iJ = T(() => {
  qk();

```

**Verdict:** PASS — symbol present in cited window

### Sample — `We_` at `cli_inner_pretty.js:383240-383244` (cited in `00_overview/symbol_additions_v2_1_142_tools_arch.md`)

```js
});
function We_(H) {
  return H.map(($) => $.name)
    .sort()
    .join(",");
}
function Bl7(H) {
  let $ = We_(H);

```

**Verdict:** PASS — symbol present in cited window

### Sample — `cY` at `cli_inner_pretty.js:211392-211392` (cited in `00_overview/symbol_additions_v2_1_142_tools_arch.md`)

```js
});
var cY = "ToolSearch";
var W7H = {};
J$(W7H, {

```

**Verdict:** PASS — symbol present in cited window

---

## Summary

- C1 Symbol existence: 183 PASS / 1 WARN
- C2 Line/symbol pairing: 96 PASS / 0 FAIL
- C3 Range sanity: 246 PASS / 0 FAIL
- C4 Per-decl files: 0 PASS / 0 FAIL
- C5 Mapping conflicts: 0
- S1 Semantic spot-check: 5 PASS / 0 WARN

**Overall verdict: PASS-WITH-NOTES**

## C6 — ORIGINAL code-block fidelity (25 blocks)
- PASS: 25
- FAIL: 0
