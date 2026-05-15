# Cross-Validation Report

- **Unit:** 15
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/.claude/worktrees/agent-ae25513cdc972a1d2/claude_code_v_2.1.142/analyze`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` (611353 lines)
- **Per-decl dir:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/unknown`
- **Markdown files scanned:** 7

## C1 — Symbol existence (59 candidates)
- PASS: 59
- WARN: 0 (pattern looked obfuscated but not in bundle — false-positive identifier, rename, or stale claim)

## C2 — Line/symbol pairing (48 pairs)
- PASS: 48
- FAIL: 0

## C3 — Line range sanity (162 ranges)
- PASS: 162
- FAIL: 0

## C4 — Per-decl file existence (0 citations)
- PASS: 0
- FAIL: 0

## C5 — Mapping consistency in `00_overview/symbol_additions_v2_1_142_by_version_133_142.md`
- Mappings: 52
- Conflicts: 0

## S1 — Semantic spot-check (5 random samples)

### Sample — `aT` at `cli_inner_pretty.js:399003-399003` (cited in `00_overview/symbol_additions_v2_1_142_by_version_133_142.md`)

```js
          ((g = g.replace(/\$\{CLAUDE_SESSION_ID\}/g, v$())),
          (g = g.replaceAll("${CLAUDE_EFFORT}", aT(E ?? F.options.mainLoopModel, h ?? F.getEffortValue()))),
          KM8())
        )

```

**Verdict:** PASS — symbol present in cited window

### Sample — `Cc` at `cli_inner_pretty.js:96905-96905` (cited in `00_overview/symbol_additions_v2_1_142_by_version_133_142.md`)

```js
}
function Cc() {
  return bH(process.env.CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE);
}

```

**Verdict:** PASS — symbol present in cited window

### Sample — `B$4` at `cli_inner_pretty.js:413223-413223` (cited in `00_overview/symbol_additions_v2_1_142_by_version_133_142.md`)

```js
  let H = parseInt(process.env.MCP_TOOL_TIMEOUT || "", 10);
  return H > 0 ? Math.min(H, B$4) : i15;
}
function Nw8() {

```

**Verdict:** PASS — symbol present in cited window

### Sample — `kw8` at `cli_inner_pretty.js:413226-413226` (cited in `00_overview/symbol_additions_v2_1_142_by_version_133_142.md`)

```js
function Nw8() {
  return kw8.join(b8(), "mcp-needs-auth-cache.json");
}
function wS6() {

```

**Verdict:** PASS — symbol present in cited window

### Sample — `VxH` at `cli_inner_pretty.js:96911-96911` (cited in `00_overview/symbol_additions_v2_1_142_by_version_133_142.md`)

```js
}
function VxH() {
  return (Cc() ? "claude-opus-4-6" : "opus") + (wL() ? "[1m]" : "");
}

```

**Verdict:** PASS — symbol present in cited window

---

## Summary

- C1 Symbol existence: 59 PASS / 0 WARN
- C2 Line/symbol pairing: 48 PASS / 0 FAIL
- C3 Range sanity: 162 PASS / 0 FAIL
- C4 Per-decl files: 0 PASS / 0 FAIL
- C5 Mapping conflicts: 0
- S1 Semantic spot-check: 5 PASS / 0 WARN

**Overall verdict: PASS**
