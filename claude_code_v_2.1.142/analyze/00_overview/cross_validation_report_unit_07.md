# Cross-Validation Report

- **Unit:** 07
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/.claude/worktrees/agent-a1630be5c55e1c4d6/claude_code_v_2.1.142/analyze`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` (611353 lines)
- **Per-decl dir:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/unknown`
- **Markdown files scanned:** 14

## C1 — Symbol existence (212 candidates)
- PASS: 210
- WARN: 2 (pattern looked obfuscated but not in bundle — false-positive identifier, rename, or stale claim)

Missing symbols (top 30):
  - `BASH_ENV` — first cited in `37_permission_policy/auto_allow_shell_expansion.md` line 289
  - `LD_AUDIT` — first cited in `37_permission_policy/auto_allow_shell_expansion.md` line 294

## C2 — Line/symbol pairing (162 pairs)
- PASS: 162
- FAIL: 0

## C3 — Line range sanity (186 ranges)
- PASS: 186
- FAIL: 0

## C4 — Per-decl file existence (0 citations)
- PASS: 0
- FAIL: 0

## C5 — Mapping consistency in `00_overview/symbol_additions_v2_1_142_permission.md`
- Mappings: 204
- Conflicts: 0

## S1 — Semantic spot-check (5 random samples)

### Sample — `N5` at `cli_inner_pretty.js:421519-421564` (cited in `00_overview/symbol_additions_v2_1_142_permission.md`)

```js
}
function N5(H, $) {
  if ($) {
    if ($.type === "classifier")
      return `Classifier '${$.classifier}' requires approval for this ${H} command: ${$.reason}`;
    switch ($.type) {
      case "hook":
        return $.reason
          ? `Hook '${$.hookName}' blocked this action: ${$.reason}`
          : `Hook '${$.hookName}' requires approval for this ${H} command`;
      case "rule": {
      ...
```

**Verdict:** PASS — symbol present in cited window

### Sample — `wy4` at `cli_inner_pretty.js:518128-518140` (cited in `00_overview/symbol_additions_v2_1_142_permission.md`)

```js
}
function wy4(H, $, q) {
  let K = null;
  for (let _ of H) {
    let A = yL(_, $, q, "allow");
    if (!A) {
      let z = My4(_);
      if (z !== _) A = yL(z, $, q, "allow");
    }
    if (!A) return null;
    K ??= A;
  }
  return K;
}
function CwH(H, $, q) {
  if (typeof H.getPath !== "function")

```

**Verdict:** PASS — symbol present in cited window

### Sample — `nUH` at `cli_inner_pretty.js:207091-207105` (cited in `00_overview/symbol_additions_v2_1_142_permission.md`)

```js
}
function nUH(H) {
  let $ = H.replace(/[\\/]+/g, "/");
  if ($ === "*" || $.endsWith("/*")) return !0;
  let q = c$() === "macos",
    K = (f) => (q ? f.replace(/^\/private\/(etc|var|tmp|home)(\/|$)/i, "/$1$2") : f),
    _ = K($),
    A = _ === "/" ? _ : _.replace(/\/$/, "");
  if (A === "/") return !0;
  if (ce1.test(A)) return !0;
  let z = K(oz6.homedir().replace(/[\\/]+/g, "/"));
  if (A ===...
```

**Verdict:** PASS — symbol present in cited window

### Sample — `R08` at `cli_inner_pretty.js:605075-605107` (cited in `00_overview/symbol_additions_v2_1_142_permission.md`)

```js
}
function R08(H, $, q) {
  let K = $.filter((Y) => Y !== llH);
  if (K.length === 0) return "";
  let _ = $.length !== K.length,
    A = K.map((Y) => "- " + Y).join(`
`),
    z = q.map((Y) => "- " + Y).join(`
`);
  return (
    "## " +
    H +
    (_
      ? ` (custom rules added alongside the defaults)
`
      : ` (custom rules replacing defaults)
`) +
    `Custom:
` +
    A +
    `

` +
    (_
...
```

**Verdict:** PASS — symbol present in cited window

### Sample — `CF_` at `cli_inner_pretty.js:338623-338623` (cited in `00_overview/symbol_additions_v2_1_142_permission.md`)

```js
Err on the side of blocking. <block> immediately.`,
  CF_ = `
Err on the side of blocking. Stage 1 does NOT apply user intent or ALLOW exceptions \u2014 stage 2 will handle those. Block if ANY rule could apply. <block> immediately.`,
  bF_ = `

```

**Verdict:** PASS — symbol present in cited window

---

## Summary

- C1 Symbol existence: 210 PASS / 2 WARN
- C2 Line/symbol pairing: 162 PASS / 0 FAIL
- C3 Range sanity: 186 PASS / 0 FAIL
- C4 Per-decl files: 0 PASS / 0 FAIL
- C5 Mapping conflicts: 0
- S1 Semantic spot-check: 5 PASS / 0 WARN

**Overall verdict: PASS-WITH-NOTES**
