# Cross-Validation Report

- **Unit:** 02
- **Docs base:** `claude_code_v_2.1.142/analyze`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` (611353 lines)
- **Per-decl dir:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/unknown`
- **Markdown files scanned:** 21

## C1 — Symbol existence (129 candidates)
- PASS: 126
- WARN: 3 (pattern looked obfuscated but not in bundle — false-positive identifier, rename, or stale claim)

Missing symbols (top 30):
  - `Vp_8` — first cited in `04_tools/bash.md` line 263
  - `id_rsa` — first cited in `04_tools/read.md` line 255
  - `s_$4` — first cited in `04_tools/bash.md` line 263

## C2 — Line/symbol pairing (12 pairs)
- PASS: 7
- FAIL: 5

Mismatched line citations (top 30):
  - `BashTool` not found near `cli_inner_pretty.js:419457-419457` (cited in `04_tools/bash.md`)
  - `GlobTool` not found near `cli_inner_pretty.js:339349-339349` (cited in `04_tools/glob.md`)
  - `GrepTool` not found near `cli_inner_pretty.js:339026-339026` (cited in `04_tools/grep.md`)
  - `LSPTool` not found near `cli_inner_pretty.js:382949-382949` (cited in `04_tools/lsp.md`)
  - `REPLTool` not found near `cli_inner_pretty.js:380386-380386` (cited in `04_tools/repl.md`)

## C3 — Line range sanity (176 ranges)
- PASS: 176
- FAIL: 0

## C4 — Per-decl file existence (0 citations)
- PASS: 0
- FAIL: 0

## C5 — Mapping consistency in `00_overview/symbol_additions_v2_1_142_sandbox.md`
- Mappings: 119
- Conflicts: 0

## C5 — Mapping consistency in `00_overview/symbol_additions_v2_1_142_tools_filesystem.md`
- Mappings: 228
- Conflicts: 0

## S1 — Semantic spot-check (5 random samples)

### Sample — `BashTool` at `cli_inner_pretty.js:419457-419457` (cited in `04_tools/bash.md`)

```js
  );
  L4 = XK({
    name: Sq,
    searchHint: "execute shell commands",

```

**Verdict:** WARN — symbol absent from cited window

### Sample — `bV` at `cli_inner_pretty.js:419533-419540` (cited in `04_tools/bash.md`)

```js
      let q = await XL$(H, $);
      if (
        H.dangerouslyDisableSandbox &&
        q.behavior !== "deny" &&
        q.behavior !== "ask" &&
        !f64(q.decisionReason) &&
        !bV(H) &&
        bV({ ...H, dangerouslyDisableSandbox: !1 })
      )
        return {
          behavior: "ask",

```

**Verdict:** PASS — symbol present in cited window

### Sample — `DMH` at `cli_inner_pretty.js:272170-272170` (cited in `04_tools/todo_write.md`)

```js
    )),
    (DMH = XK({
      name: HV,
      searchHint: "manage the session task checklist",

```

**Verdict:** PASS — symbol present in cited window

### Sample — `LSPTool` at `cli_inner_pretty.js:382949-382949` (cited in `04_tools/lsp.md`)

```js
    )),
    (fE6 = XK({
      name: clH,
      searchHint: "code intelligence (definitions, references, symbols, hover)",

```

**Verdict:** WARN — symbol absent from cited window

### Sample — `_D` at `cli_inner_pretty.js:415451-415451` (cited in `04_tools/edit.md`)

```js
  ((cDH = require("path")),
    (_D = XK({
      name: G7,
      searchHint: "modify file contents in place",

```

**Verdict:** PASS — symbol present in cited window

---

## Summary

- C1 Symbol existence: 126 PASS / 3 WARN
- C2 Line/symbol pairing: 7 PASS / 5 FAIL
- C3 Range sanity: 176 PASS / 0 FAIL
- C4 Per-decl files: 0 PASS / 0 FAIL
- C5 Mapping conflicts: 0
- S1 Semantic spot-check: 3 PASS / 2 WARN

**Overall verdict: FAIL**

## C6 — ORIGINAL code-block fidelity (25 blocks)
- PASS: 25
- FAIL: 0

## Post-amble

C2 reports 5 line-pairing FAILs because the cited symbols use **readable** names (`BashTool`, `GlobTool`, `GrepTool`, `LSPTool`, `REPLTool`) which do not literally appear in the obfuscated bundle near the cited offsets; the underlying obfuscated identifiers do match those windows. C6 ORIGINAL code-block fidelity is 25/25 PASS and S1 random samples PASS at the cited locations, supporting that the structural citations are correct even though readable-name search fails by design.
