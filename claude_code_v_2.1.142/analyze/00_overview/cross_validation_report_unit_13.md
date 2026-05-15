# Cross-Validation Report

- **Unit:** 13
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/.claude/worktrees/agent-a13f89e22d5c30994/claude_code_v_2.1.142/analyze`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` (611353 lines)
- **Per-decl dir:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/unknown`
- **Markdown files scanned:** 9

## C1 — Symbol existence (19 candidates)
- PASS: 18
- WARN: 1 (pattern looked obfuscated but not in bundle — false-positive identifier, rename, or stale claim)

Missing symbols (top 30):
  - `vim_mode` — first cited in `by_version/v2.1.116.md` line 138

## C2 — Line/symbol pairing (0 pairs)
- PASS: 0
- FAIL: 0

## C3 — Line range sanity (138 ranges)
- PASS: 138
- FAIL: 0

## C4 — Per-decl file existence (0 citations)
- PASS: 0
- FAIL: 0

## C5 — Mapping consistency in `00_overview/symbol_additions_v2_1_142_by_version_113_122.md`
- Mappings: 85
- Conflicts: 0

## S1 — Semantic spot-check (5 random samples)

---

## Summary

- C1 Symbol existence: 18 PASS / 1 WARN
- C2 Line/symbol pairing: 0 PASS / 0 FAIL
- C3 Range sanity: 138 PASS / 0 FAIL
- C4 Per-decl files: 0 PASS / 0 FAIL
- C5 Mapping conflicts: 0
- S1 Semantic spot-check: 0 PASS / 0 WARN

**Overall verdict: PASS-WITH-NOTES**
