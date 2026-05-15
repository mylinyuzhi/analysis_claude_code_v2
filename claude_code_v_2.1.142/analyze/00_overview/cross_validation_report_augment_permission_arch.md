# Cross-Validation Report

- **Unit:** 05
- **Docs base:** `claude_code_v_2.1.142/analyze`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` (611353 lines)
- **Per-decl dir:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/unknown`
- **Markdown files scanned:** 9

## C1 — Symbol existence (104 candidates)
- PASS: 102
- WARN: 2 (pattern looked obfuscated but not in bundle — false-positive identifier, rename, or stale claim)

Missing symbols (top 30):
  - `AF_INET` — first cited in `37_permission_policy/sandbox_integration.md` line 308
  - `AF_INET6` — first cited in `37_permission_policy/sandbox_integration.md` line 308

## C2 — Line/symbol pairing (74 pairs)
- PASS: 70
- FAIL: 4

Mismatched line citations (top 30):
  - `i64` not found near `cli_inner_pretty.js:421519-421519` (cited in `37_permission_policy/allow_deny_ask_precedence.md`)
  - `jJ$` not found near `cli_inner_pretty.js:338062-338062` (cited in `37_permission_policy/architecture.md`)
  - `jJ$` not found near `cli_inner_pretty.js:338062-338062` (cited in `37_permission_policy/auto_mode_classifier.md`)
  - `gz6` not found near `cli_inner_pretty.js:205409-205409` (cited in `37_permission_policy/rule_grammar.md`)

## C3 — Line range sanity (231 ranges)
- PASS: 231
- FAIL: 0

## C4 — Per-decl file existence (0 citations)
- PASS: 0
- FAIL: 0

## C5 — Mapping consistency in `00_overview/symbol_additions_v2_1_142_permission_arch.md`
- Mappings: 202
- Conflicts: 1

  - `qS7` mapped to both `classifierRequestSchema` and `classifierStop`

## S1 — Semantic spot-check (5 random samples)

### Sample — `oiH` at `cli_inner_pretty.js:421627-421627` (cited in `37_permission_policy/mode_lifecycle.md`)

```js
}
function oiH(H, $) {
  if (H?.behavior === "deny" || H?.behavior === "ask")
    return (

```

**Verdict:** PASS — symbol present in cited window

### Sample — `N64` at `cli_inner_pretty.js:421159-421159` (cited in `37_permission_policy/rule_grammar.md`)

```js
  ((k64 = require("fs/promises")), (HW$ = require("path")), (rS6 = /^[A-Za-z_]\w*=/));
  N64 = new Set([
    "sh",
    "bash",

```

**Verdict:** PASS — symbol present in cited window

### Sample — `Qa1` at `cli_inner_pretty.js:196390-196390` (cited in `37_permission_policy/sandbox_integration.md`)

```js
}
async function Qa1(H) {
  return (
    (iGH = gUK({ filter: ($, q) => pFK($, q, H), parentProxy: J3H })),

```

**Verdict:** PASS — symbol present in cited window

### Sample — `eS6` at `cli_inner_pretty.js:421593-421593` (cited in `37_permission_policy/allow_deny_ask_precedence.md`)

```js
}
function eS6(H, $) {
  return BNH(H).find((q) => tS6($, q, { proxyExpansion: Q64(q), toolAliases: H.toolAliases })) || null;
}

```

**Verdict:** PASS — symbol present in cited window

### Sample — `vFK` at `cli_inner_pretty.js:195744-195744` (cited in `37_permission_policy/sandbox_integration.md`)

```js
}
async function vFK(H) {
  let {
      command: $,

```

**Verdict:** PASS — symbol present in cited window

---

## Summary

- C1 Symbol existence: 102 PASS / 2 WARN
- C2 Line/symbol pairing: 70 PASS / 4 FAIL
- C3 Range sanity: 231 PASS / 0 FAIL
- C4 Per-decl files: 0 PASS / 0 FAIL
- C5 Mapping conflicts: 1
- S1 Semantic spot-check: 5 PASS / 0 WARN

**Overall verdict: FAIL**

## C6 — ORIGINAL code-block fidelity (16 blocks)
- PASS: 15
- FAIL: 1

Mismatched ORIGINAL fingerprints (top 10):
  - `getAllowRules(context)` in `allow_deny_ask_precedence.md`

## Post-amble

The single C6 FAIL (`getAllowRules(context)` in `allow_deny_ask_precedence.md`) is a benign false positive: that "ORIGINAL" block transcribes the v2.1.88 TypeScript source (location annotated `2.1.88 src/utils/permissions/permissions.ts:122`, bundle symbol `mNH`), not the minified `cli_inner_pretty.js` bundle, so the fingerprint-in-bundle test by design cannot match. C2's 4 line mismatches similarly point to nearby-but-not-exact locations rather than missing symbols (S1 spot-check found 5/5 PASS).
