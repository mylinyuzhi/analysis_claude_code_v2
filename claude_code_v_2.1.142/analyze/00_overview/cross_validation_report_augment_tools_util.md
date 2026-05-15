# Cross-Validation Report

- **Unit:** 04
- **Docs base:** `claude_code_v_2.1.142/analyze`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` (611353 lines)
- **Per-decl dir:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/unknown`
- **Markdown files scanned:** 44

## C1 — Symbol existence (303 candidates)
- PASS: 301
- WARN: 2 (pattern looked obfuscated but not in bundle — false-positive identifier, rename, or stale claim)

Missing symbols (top 30):
  - `Mr3` — first cited in `04_tools/registration.md` line 297
  - `Q3H_Tool` — first cited in `04_tools/list_mcp_resources.md` line 4

## C2 — Line/symbol pairing (98 pairs)
- PASS: 98
- FAIL: 0

## C3 — Line range sanity (433 ranges)
- PASS: 433
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

## C5 — Mapping consistency in `00_overview/symbol_additions_v2_1_142_tools_utility.md`
- Mappings: 185
- Conflicts: 0

## S1 — Semantic spot-check (5 random samples)

### Sample — `SH8` at `cli_inner_pretty.js:211845-211847` (cited in `00_overview/symbol_additions_v2_1_142_tools_arch.md`)

```js
}
function SH8() {
  return m$_ + B$_;
}
var x$_,
  u$_,

```

**Verdict:** PASS — symbol present in cited window

### Sample — `Ul7` at `cli_inner_pretty.js:383275-383342` (cited in `00_overview/symbol_additions_v2_1_142_tools_arch.md`)

```js
}
async function Ul7(H, $, q, K) {
  let _ = H.toLowerCase().trim(),
    A = $.find((j) => j.name.toLowerCase() === _) ?? q.find((j) => j.name.toLowerCase() === _);
  if (A) return [A.name];
  if (_.startsWith("mcp__") && _.length > 5) {
    let j = $.filter((J) => J.name.toLowerCase().startsWith(_))
      .slice(0, K)
      .map((J) => J.name);
    if (j.length > 0) return j;
  }
  let z = _.spli...
```

**Verdict:** PASS — symbol present in cited window

### Sample — `EK` at `cli_inner_pretty.js:141574-141574` (cited in `00_overview/symbol_additions_v2_1_142_tools_arch.md`)

```js
var VP = "NotebookEdit";
var EK = "PowerShell";
function wVK() {
  return process.env.CLAUDE_REPL_VARIANT;

```

**Verdict:** PASS — symbol present in cited window

### Sample — `Gz` at `cli_inner_pretty.js:211430-211430` (cited in `04_tools/registration.md`)

```js
var Q3H = "EnterPlanMode";
var Gz = "AskUserQuestion",
  ClK = 12,
  blK =

```

**Verdict:** PASS — symbol present in cited window

### Sample — `kq8` at `cli_inner_pretty.js:388320-388320` (cited in `00_overview/symbol_additions_v2_1_142_tools_arch.md`)

```js
    let a = KH.data && typeof KH.data === "object" ? SH(KH.data) : String(KH.data ?? "");
    kq8(C, a);
    let t = H.mapToolResultToToolResultBlockParam(KH.data, $),
      MH = t.content,

```

**Verdict:** PASS — symbol present in cited window

---

## Summary

- C1 Symbol existence: 301 PASS / 2 WARN
- C2 Line/symbol pairing: 98 PASS / 0 FAIL
- C3 Range sanity: 433 PASS / 0 FAIL
- C4 Per-decl files: 0 PASS / 0 FAIL
- C5 Mapping conflicts: 0
- S1 Semantic spot-check: 5 PASS / 0 WARN

**Overall verdict: PASS-WITH-NOTES**

## C6 — ORIGINAL code-block fidelity (49 blocks)
- PASS: 49
- FAIL: 0
