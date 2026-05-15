# Cross-Validation Report

- **Unit:** 03
- **Docs base:** `claude_code_v_2.1.142/analyze`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` (611353 lines)
- **Per-decl dir:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/unknown`
- **Markdown files scanned:** 44

## C1 — Symbol existence (327 candidates)
- PASS: 324
- WARN: 3 (pattern looked obfuscated but not in bundle — false-positive identifier, rename, or stale claim)

Missing symbols (top 30):
  - `Vp_8` — first cited in `04_tools/bash.md` line 263
  - `id_rsa` — first cited in `04_tools/read.md` line 255
  - `s_$4` — first cited in `04_tools/bash.md` line 263

## C2 — Line/symbol pairing (107 pairs)
- PASS: 93
- FAIL: 14

Mismatched line citations (top 30):
  - `iK4` not found near `cli_inner_pretty.js:428134-428134` (cited in `00_overview/symbol_additions_v2_1_142_compact_arch.md`)
  - `CT4` not found near `cli_inner_pretty.js:499879-499879` (cited in `00_overview/symbol_additions_v2_1_142_compact_arch.md`)
  - `Vb` not found near `cli_inner_pretty.js:393125-393125` (cited in `00_overview/symbol_additions_v2_1_142_compact_arch.md`)
  - `uiH` not found near `cli_inner_pretty.js:386697-386697` (cited in `00_overview/symbol_additions_v2_1_142_compact_arch.md`)
  - `BashTool` not found near `cli_inner_pretty.js:419457-419457` (cited in `04_tools/bash.md`)
  - `GlobTool` not found near `cli_inner_pretty.js:339349-339349` (cited in `04_tools/glob.md`)
  - `GrepTool` not found near `cli_inner_pretty.js:339026-339026` (cited in `04_tools/grep.md`)
  - `LSPTool` not found near `cli_inner_pretty.js:382949-382949` (cited in `04_tools/lsp.md`)
  - `REPLTool` not found near `cli_inner_pretty.js:380386-380386` (cited in `04_tools/repl.md`)
  - `Vb` not found near `cli_inner_pretty.js:393125-393125` (cited in `07_compact/fork_interaction.md`)
  - `bq8` not found near `cli_inner_pretty.js:242975-242975` (cited in `07_compact/sensitive_instructions_preservation_internals.md`)
  - `bq8` not found near `cli_inner_pretty.js:242975-242975` (cited in `07_compact/sensitive_instructions_preservation_internals.md`)
  - `m47` not found near `cli_inner_pretty.js:242882-242882` (cited in `07_compact/sensitive_instructions_preservation_internals.md`)
  - `j3_` not found near `cli_inner_pretty.js:243123-243123` (cited in `07_compact/sensitive_instructions_preservation_internals.md`)

## C3 — Line range sanity (486 ranges)
- PASS: 486
- FAIL: 0

## C4 — Per-decl file existence (0 citations)
- PASS: 0
- FAIL: 0

## C5 — Mapping consistency in `00_overview/symbol_additions_v2_1_142_compact_arch.md`
- Mappings: 114
- Conflicts: 0

## C5 — Mapping consistency in `00_overview/symbol_additions_v2_1_142_sandbox.md`
- Mappings: 119
- Conflicts: 0

## C5 — Mapping consistency in `00_overview/symbol_additions_v2_1_142_tools_filesystem.md`
- Mappings: 228
- Conflicts: 0

## C5 — Mapping consistency in `00_overview/symbol_additions_v2_1_142_tools_meta.md`
- Mappings: 247
- Conflicts: 0

## S1 — Semantic spot-check (5 random samples)

### Sample — `jI6` at `cli_inner_pretty.js:408292-408292` (cited in `00_overview/symbol_additions_v2_1_142_compact_arch.md`)

```js
  fH4 = 3000,
  jI6 = 0.2;
var JI6 = () => {};
function LI6(H) {

```

**Verdict:** PASS — symbol present in cited window

### Sample — `m47` at `cli_inner_pretty.js:242856-242948` (cited in `00_overview/symbol_additions_v2_1_142_compact_arch.md`)

```js
}
function m47(H, $ = "from") {
  let K =
    `CRITICAL: Respond with TEXT ONLY. Do NOT call any tools.

- Do NOT use Read, Bash, Grep, Glob, Edit, Write, or ANY other tool.
- You already have all the context you need in the conversation above.
- Tool calls will be REJECTED and will waste your only turn \u2014 you will fail the task.
- Your entire response must be plain text: an <analysis> block f...
```

**Verdict:** PASS — symbol present in cited window

### Sample — `lh5` at `cli_inner_pretty.js:499820-499820` (cited in `00_overview/symbol_additions_v2_1_142_compact_arch.md`)

```js
}
function RT4(H, $, q) {
  let K = lh5(H, $);
  return CT4(K, $, q, () => ih5(H));

```

**Verdict:** PASS — symbol present in cited window

### Sample — `Kl$` at `cli_inner_pretty.js:128612-128621` (cited in `00_overview/symbol_additions_v2_1_142_compact_arch.md`)

```js
}
function Kl$(H) {
  if (MqH()) return null;
  if (aG(H)) return null;
  if (k7(H) !== "claude-sonnet-4-6") return null;
  let $ = h$().clientDataCache?.kelp_forest_sonnet;
  if (typeof $ !== "string") return null;
  let q = parseInt($, 10);
  if (!Number.isFinite(q) || q <= 0) return null;
  return q;
}
function fmH(H, $) {
  if (!H) return { used: null, remaining: null };

```

**Verdict:** PASS — symbol present in cited window

### Sample — `T3_` at `cli_inner_pretty.js:243631-243635` (cited in `00_overview/symbol_additions_v2_1_142_compact_arch.md`)

```js
}
function T3_(H, $) {
  let q = H.findIndex((K) => K.uuid === $);
  if (q === -1) return null;
  return H.slice(q + 1).filter((K) => K.type !== "progress");
}
function r47(H, $, q) {
  (d("tengu_precomputed_compact_discarded", {

```

**Verdict:** PASS — symbol present in cited window

---

## Summary

- C1 Symbol existence: 324 PASS / 3 WARN
- C2 Line/symbol pairing: 93 PASS / 14 FAIL
- C3 Range sanity: 486 PASS / 0 FAIL
- C4 Per-decl files: 0 PASS / 0 FAIL
- C5 Mapping conflicts: 0
- S1 Semantic spot-check: 5 PASS / 0 WARN

**Overall verdict: FAIL**

## C6 — ORIGINAL code-block fidelity (75 blocks)
- PASS: 75
- FAIL: 0

## Post-amble

The 14 C2 FAILs are all outside the tools-meta unit-03 scope (they originate from `compact_arch`, `fork_interaction`, `sensitive_instructions_preservation_internals`, and prior tool docs `bash/glob/grep/lsp/repl`). No FAILs surfaced inside `04_tools/{agent,skill,task_*,enter_plan_mode,exit_plan_mode,enter_worktree,exit_worktree,tool_search,ask_user_question}.md` or `symbol_additions_v2_1_142_tools_meta.md`. The unit-03 augmentation is internally clean — C6 confirms 75/75 ORIGINAL code-block fidelity for `04_tools/*`.
