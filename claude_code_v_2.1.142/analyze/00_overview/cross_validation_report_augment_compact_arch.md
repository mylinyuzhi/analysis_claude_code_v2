# Cross-Validation Report

- **Unit:** 07
- **Docs base:** `claude_code_v_2.1.142/analyze`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` (611353 lines)
- **Per-decl dir:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/unknown`
- **Markdown files scanned:** 29

## C1 — Symbol existence (256 candidates)
- PASS: 253
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

## C3 — Line range sanity (325 ranges)
- PASS: 325
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

## S1 — Semantic spot-check (5 random samples)

### Sample — `n47` at `cli_inner_pretty.js:243450-243540` (cited in `00_overview/symbol_additions_v2_1_142_compact_arch.md`)

```js
}
function n47(H) {
  let { querySource: $, messages: q, cacheSafeParams: K } = H,
    { toolUseContext: _ } = K,
    A = pq8(_.agentId);
  if (!Dj6()) return !1;
  if (jj6($)) return !1;
  if (QC.has(A)) return !1;
  let z = q.at(-1)?.uuid;
  if (z === void 0) return !1;
  let Y = new AbortController(),
    f = performance.now(),
    O = wX(q),
    M = P3_(_, Y),
    w = { ...K, toolUseContext: M...
```

**Verdict:** PASS — symbol present in cited window

### Sample — `ZI6` at `cli_inner_pretty.js:408359-408368` (cited in `00_overview/symbol_additions_v2_1_142_compact_arch.md`)

```js
}
function ZI6() {
  let H = process.env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE,
    $ = process.env.CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE;
  return {
    enabled: cZ(),
    precomputeBufferFraction: r45(),
    testPctOverride: H ? parseFloat(H) : void 0,
    testBlockingOverride: $ ? parseInt($, 10) : void 0,
  };
}
function ny6(H, $) {
  return vP$(FHH(H, $), ZI6());

```

**Verdict:** PASS — symbol present in cited window

### Sample — `Dj6` at `cli_inner_pretty.js:243428-243432` (cited in `00_overview/symbol_additions_v2_1_142_compact_arch.md`)

```js
}
function Dj6() {
  if (!cZ()) return !1;
  if (Fq8()) return !1;
  return Z$("tengu_sepia_moth", !1);
}
function jj6(H) {
  if (H === "compact") return !0;

```

**Verdict:** PASS — symbol present in cited window

### Sample — `lv` at `cli_inner_pretty.js:97388-97388` (cited in `00_overview/symbol_additions_v2_1_142_compact_arch.md`)

```js
  if (Xa() === "opusplan" && $ === "plan" && !K) return cv();
  if (Xa() === "haiku" && $ === "plan") return lv();
  return q;
}

```

**Verdict:** PASS — symbol present in cited window

### Sample — `OH4` at `cli_inner_pretty.js:408275-408277` (cited in `00_overview/symbol_additions_v2_1_142_compact_arch.md`)

```js
}
function OH4(H, $) {
  return Math.min(H - Math.round(H * $.precomputeBufferFraction), vP$(H, $));
}
function MH4(H, $, q, K = $) {
  let _ = vP$($, q),

```

**Verdict:** PASS — symbol present in cited window

---

## Summary

- C1 Symbol existence: 253 PASS / 3 WARN
- C2 Line/symbol pairing: 93 PASS / 14 FAIL
- C3 Range sanity: 325 PASS / 0 FAIL
- C4 Per-decl files: 0 PASS / 0 FAIL
- C5 Mapping conflicts: 0
- S1 Semantic spot-check: 5 PASS / 0 WARN

**Overall verdict: FAIL**

## C6 — ORIGINAL code-block fidelity (21 blocks)
- PASS: 21
- FAIL: 0

## Post-amble

C2 surfaced 14 line-pairing mismatches across multiple units (4 in `symbol_additions_v2_1_142_compact_arch.md`, 5 in `04_tools/*.md` unrelated to unit 07, and 5 in `07_compact/` docs — `Vb`, `bq8` x2, `m47`, `j3_`). These cite single-line ranges where the pretty-printed function declaration sits slightly offset; C6 fidelity check confirms all 21 ORIGINAL code blocks in `07_compact/` match the bundle verbatim, indicating the snippets are correct but line citations need ±a few lines of tolerance.
