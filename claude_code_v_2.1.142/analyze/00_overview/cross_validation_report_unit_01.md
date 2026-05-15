# Cross-Validation Report

- **Unit:** 01
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/.claude/worktrees/agent-a57dde6d5aa976063/claude_code_v_2.1.142/analyze`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` (611353 lines)
- **Per-decl dir:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/unknown`
- **Markdown files scanned:** 9

## C1 — Symbol existence (46 candidates)
- PASS: 45
- WARN: 1 (pattern looked obfuscated but not in bundle — false-positive identifier, rename, or stale claim)

Missing symbols (top 30):
  - `__BUN` — first cited in `00_overview/changelog_analysis.md` line 52

## C2 — Line/symbol pairing (3 pairs)
- PASS: 2
- FAIL: 1

Mismatched line citations (top 30):
  - `T6A` not found near `cli_inner_pretty.js:486759-486759` (cited in `00_overview/changelog_to_code_map.md`)

## C3 — Line range sanity (15 ranges)
- PASS: 15
- FAIL: 0

## C4 — Per-decl file existence (0 citations)
- PASS: 0
- FAIL: 0

## S1 — Semantic spot-check (5 random samples)

### Sample — `T6A` at `cli_inner_pretty.js:486759-486759` (cited in `00_overview/changelog_to_code_map.md`)

```js
  FX8 = (H) =>
    `A session-scoped Stop hook is now active with condition: "${H}". Briefly acknowledge the goal, then immediately start (or continue) working toward it \u2014 treat the condition itself as your directive and do not pause to ask the user what to do. The hook will block stopping until the condition holds. It auto-clears once the condition is met \u2014 do not tell the user to run \...
```

**Verdict:** WARN — symbol absent from cited window

### Sample — `ks4` at `cli_inner_pretty.js:593195-593195` (cited in `00_overview/symbol_index_core_features.md`)

```js
var ks4 =
  '# Building LLM-Powered Applications with Claude\n\nThis skill helps you build LLM-powered applications with Claude. Choose the right surface based on your needs, detect the project language, then read the relevant language-specific documentation.\n\n## Before You Start\n\nScan the target file (or, if no target file, the prompt and project) for non-Anthropic provider markers \u2014 `im...
```

**Verdict:** PASS — symbol present in cited window

### Sample — `ks4` at `cli_inner_pretty.js:593195-593195` (cited in `00_overview/file_index.md`)

```js
var ks4 =
  '# Building LLM-Powered Applications with Claude\n\nThis skill helps you build LLM-powered applications with Claude. Choose the right surface based on your needs, detect the project language, then read the relevant language-specific documentation.\n\n## Before You Start\n\nScan the target file (or, if no target file, the prompt and project) for non-Anthropic provider markers \u2014 `im...
```

**Verdict:** PASS — symbol present in cited window

---

## Summary

- C1 Symbol existence: 45 PASS / 1 WARN
- C2 Line/symbol pairing: 2 PASS / 1 FAIL
- C3 Range sanity: 15 PASS / 0 FAIL
- C4 Per-decl files: 0 PASS / 0 FAIL
- C5 Mapping conflicts: 0
- S1 Semantic spot-check: 2 PASS / 1 WARN

**Overall verdict: FAIL**
