# Cross-Validation Report

- **Unit:** 14
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/.claude/worktrees/agent-a2b49abd62f5b1143/claude_code_v_2.1.142/analyze`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` (611353 lines)
- **Per-decl dir:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/unknown`
- **Markdown files scanned:** 6

## C1 — Symbol existence (2 candidates)
- PASS: 2
- WARN: 0 (pattern looked obfuscated but not in bundle — false-positive identifier, rename, or stale claim)

## C2 — Line/symbol pairing (1 pairs)
- PASS: 1
- FAIL: 0

## C3 — Line range sanity (126 ranges)
- PASS: 126
- FAIL: 0

## C4 — Per-decl file existence (0 citations)
- PASS: 0
- FAIL: 0

## C5 — Mapping consistency in `00_overview/symbol_additions_v2_1_142_by_version_123_132.md`
- Mappings: 46
- Conflicts: 0

## S1 — Semantic spot-check (5 random samples)

### Sample — `oMK` at `cli_inner_pretty.js:128925-128925` (cited in `by_version/v2.1.123.md`)

```js
    })));
  oMK = new Set([KWH, PxH, EU, _WH, wa, T4$, WxH, V4$]);
});
async function i$6(H, $ = 1e4) {

```

**Verdict:** PASS — symbol present in cited window

---

## Summary

- C1 Symbol existence: 2 PASS / 0 WARN
- C2 Line/symbol pairing: 1 PASS / 0 FAIL
- C3 Range sanity: 126 PASS / 0 FAIL
- C4 Per-decl files: 0 PASS / 0 FAIL
- C5 Mapping conflicts: 0
- S1 Semantic spot-check: 1 PASS / 0 WARN

**Overall verdict: PASS**
