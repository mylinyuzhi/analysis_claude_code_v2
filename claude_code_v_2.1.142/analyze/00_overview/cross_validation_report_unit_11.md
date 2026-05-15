# Cross-Validation Report

- **Unit:** 11
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/.claude/worktrees/agent-a2bb0b12b91d0c2d8/claude_code_v_2.1.142/analyze`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` (611353 lines)
- **Per-decl dir:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/unknown`
- **Markdown files scanned:** 16

## C1 — Symbol existence (154 candidates)
- PASS: 154
- WARN: 0 (pattern looked obfuscated but not in bundle — false-positive identifier, rename, or stale claim)

## C2 — Line/symbol pairing (197 pairs)
- PASS: 194
- FAIL: 3

Mismatched line citations (top 30):
  - `_H4` not found near `cli_inner_pretty.js:407921-407922` (cited in `07_compact/compaction_esc_no_error.md`)
  - `gC` not found near `cli_inner_pretty.js:525267-525268` (cited in `07_compact/compaction_resume_long_context.md`)
  - `D$` not found near `cli_inner_pretty.js:525301-525301` (cited in `23_prompt_cache/bedrock_vertex_400.md`)

## C3 — Line range sanity (236 ranges)
- PASS: 236
- FAIL: 0

## C4 — Per-decl file existence (0 citations)
- PASS: 0
- FAIL: 0

## C5 — Mapping consistency in `00_overview/symbol_additions_v2_1_142_compact_cache.md`
- Mappings: 150
- Conflicts: 0

## S1 — Semantic spot-check (5 random samples)

### Sample — `T35` at `cli_inner_pretty.js:431845-431876` (cited in `07_compact/compaction_resume_long_context.md`)

```js
}
var T35 = async (H, $) => {
  let { abortController: q } = $,
    { messages: K } = $;
  if (((K = X3(K)), K.length === 0)) throw Error("No messages to compact");
  let _ = H.trim();
  try {
    let A = $.options.mainLoopModel;
    if (H4H(A)) return await V35(K, $, _);
    let Y = (await Ct(K, $)).messages,
      f = await qrH(Y, $, await I44($, Y), !1, _, !1, void 0, WI6());
    return (
     ...
```

**Verdict:** PASS — symbol present in cited window

### Sample — `_H4` at `cli_inner_pretty.js:407768-407934` (cited in `07_compact/summarize_up_to_here.md`)

```js
}
async function _H4(H, $, q, K, _, A = "from") {
  let z,
    Y,
    f,
    O = performance.now();
  try {
    let M = A === "up_to" ? H.slice(0, $) : H.slice($),
      w =
        A === "up_to"
          ? H.slice($).filter((t) => t.type !== "progress" && !xL(t) && !(t.type === "user" && t.isCompactSummary))
          : H.slice(0, $).filter((t) => t.type !== "progress");
    if (M.length === 0)
...
```

**Verdict:** PASS — symbol present in cited window

### Sample — `D$` at `cli_inner_pretty.js:525267-525268` (cited in `07_compact/compaction_resume_long_context.md`)

```js
      let s = [...M];
      if (!s.includes(EU) && Kl$(tH.model) !== null) s.push(EU);
      let VH = vj(tH.model) === "bedrock" ? [...n$6(tH.model), ...(P ? [P] : [])] : [],
        IH = s4H(VH),
        pH = { ...(IH.output_config ?? {}) };

```

**Verdict:** WARN — symbol absent from cited window

### Sample — `B47` at `cli_inner_pretty.js:243242-243248` (cited in `07_compact/reactive_seeding.md`)

```js
}
function B47(H, $, q) {
  let K = 0,
    _ = 0;
  for (let A = $ - 1; A >= 0; A--) if (((K += H[A]), _++, K >= q)) break;
  if (_ >= $ - 1) return Math.max(1, Math.floor($ / 2));
  return _;
}
function L3_(H, $, q) {
  if (H === void 0) return { mode: "gap_unparseable", step: 1 };

```

**Verdict:** PASS — symbol present in cited window

### Sample — `bq8` at `cli_inner_pretty.js:242949-243062` (cited in `07_compact/v2_1_142_README.md`)

```js
}
function bq8(H) {
  let $ =
    `CRITICAL: Respond with TEXT ONLY. Do NOT call any tools.

- Do NOT use Read, Bash, Grep, Glob, Edit, Write, or ANY other tool.
- You already have all the context you need in the conversation above.
- Tool calls will be REJECTED and will waste your only turn \u2014 you will fail the task.
- Your entire response must be plain text: an <analysis> block followed by a...
```

**Verdict:** PASS — symbol present in cited window

---

## Summary

- C1 Symbol existence: 154 PASS / 0 WARN
- C2 Line/symbol pairing: 194 PASS / 3 FAIL
- C3 Range sanity: 236 PASS / 0 FAIL
- C4 Per-decl files: 0 PASS / 0 FAIL
- C5 Mapping conflicts: 0
- S1 Semantic spot-check: 4 PASS / 1 WARN

**Overall verdict: FAIL**
