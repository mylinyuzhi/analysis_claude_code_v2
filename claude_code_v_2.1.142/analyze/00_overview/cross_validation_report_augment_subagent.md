# Cross-Validation Report

- **Unit:** 08
- **Docs base:** `claude_code_v_2.1.142/analyze`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` (611353 lines)
- **Per-decl dir:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/unknown`
- **Markdown files scanned:** 12

## C1 — Symbol existence (87 candidates)
- PASS: 87
- WARN: 0 (pattern looked obfuscated but not in bundle — false-positive identifier, rename, or stale claim)

## C2 — Line/symbol pairing (67 pairs)
- PASS: 62
- FAIL: 5

Mismatched line citations (top 30):
  - `slH` not found near `cli_inner_pretty.js:386626-386713` (cited in `00_overview/symbol_additions_v2_1_142_subagent.md`)
  - `tJ$` not found near `cli_inner_pretty.js:514425-514425` (cited in `00_overview/symbol_additions_v2_1_142_subagent.md`)
  - `nlK` not found near `cli_inner_pretty.js:211796-211796` (cited in `00_overview/symbol_additions_v2_1_142_subagent.md`)
  - `Agent` not found near `cli_inner_pretty.js:211750-211752` (cited in `34_subagent/README.md`)
  - `runAgent` not found near `cli_inner_pretty.js:393187-393187` (cited in `34_subagent/result_passing.md`)

## C3 — Line range sanity (139 ranges)
- PASS: 139
- FAIL: 0

## C4 — Per-decl file existence (0 citations)
- PASS: 0
- FAIL: 0

## C5 — Mapping consistency in `00_overview/symbol_additions_v2_1_142_subagent.md`
- Mappings: 2
- Conflicts: 0

## S1 — Semantic spot-check (5 random samples)

### Sample — `tO` at `cli_inner_pretty.js:141788-141809` (cited in `34_subagent/definition_schema.md`)

```js
}
function tO(H, $, q) {
  let K = H.match(XKH);
  if (!K) return { frontmatter: {}, content: H };
  let _ = K[1] || "",
    A = H.slice(K[0].length),
    z = (f) => {
      return f;
    },
    Y = {};
  try {
    Y = z(PVK(iYH(_)));
  } catch {
    try {
      let f = aI1(_);
      Y = z(PVK(iYH(f)));
    } catch (f) {
      let O = $ ? ` in ${$}` : "";
      N(`Failed to parse YAML frontmatter$...
```

**Verdict:** PASS — symbol present in cited window

### Sample — `dv$` at `cli_inner_pretty.js:3087-3090` (cited in `34_subagent/hook_inheritance.md`)

```js
}
function dv$(H) {
  let $ = jv();
  if ($) $.mainThreadAgentHooks = H;
  else U$.mainThreadAgentHooks = H;
}
function Np() {

```

**Verdict:** PASS — symbol present in cited window

### Sample — `kp` at `cli_inner_pretty.js:3083-3085` (cited in `34_subagent/hook_inheritance.md`)

```js
}
function kp() {
  let H = jv();
  return H ? H.mainThreadAgentHooks : U$.mainThreadAgentHooks;
}
function dv$(H) {

```

**Verdict:** PASS — symbol present in cited window

### Sample — `Plan` at `cli_inner_pretty.js:231700-231700` (cited in `00_overview/symbol_additions_v2_1_142_subagent.md`)

```js
  i3$();
  d88 = {
    agentType: "Plan",
    whenToUse:

```

**Verdict:** PASS — symbol present in cited window

### Sample — `agent_id` at `cli_inner_pretty.js:237697-237703` (cited in `34_subagent/README.md`)

```js
          .describe(
            "Subagent identifier. Present only when the hook fires from within a subagent (e.g., a tool called by an AgentTool worker). Absent for the main thread, even in --agent sessions. Use this field (not agent_type) to distinguish subagent calls from main-thread calls.",
          ),
        agent_type: y
          .string()
          .optional()
          .describe(
   ...
```

**Verdict:** PASS — symbol present in cited window

---

## Summary

- C1 Symbol existence: 87 PASS / 0 WARN
- C2 Line/symbol pairing: 62 PASS / 5 FAIL
- C3 Range sanity: 139 PASS / 0 FAIL
- C4 Per-decl files: 0 PASS / 0 FAIL
- C5 Mapping conflicts: 0
- S1 Semantic spot-check: 5 PASS / 0 WARN

**Overall verdict: FAIL**

## C6 — ORIGINAL code-block fidelity (10 blocks)
- PASS: 10
- FAIL: 0

## Post-amble

C2 produced 5 line/symbol pairing FAILs: 3 obfuscated-symbol citations in `symbol_additions_v2_1_142_subagent.md` (`slH`, `tJ$`, `nlK`) and 2 readable-name citations in module docs (`Agent` in README.md, `runAgent` in result_passing.md). The readable-name FAILs are expected (validator searches the obfuscated source for capitalized readable identifiers). The 3 obfuscated FAILs may indicate stale or off-by-one line citations and warrant a manual spot-check. C6 ORIGINAL-block fidelity is 10/10 PASS, so transcribed source snippets are accurate.
