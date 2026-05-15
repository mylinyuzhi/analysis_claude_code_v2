# Cross-Validation Report

- **Unit:** 09
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/.claude/worktrees/agent-a9b29dcbc609b7f31/claude_code_v_2.1.142/analyze`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` (611353 lines)
- **Per-decl dir:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/unknown`
- **Markdown files scanned:** 16

## C1 — Symbol existence (132 candidates)
- PASS: 132
- WARN: 0 (pattern looked obfuscated but not in bundle — false-positive identifier, rename, or stale claim)

## C2 — Line/symbol pairing (166 pairs)
- PASS: 156
- FAIL: 10

Mismatched line citations (top 30):
  - `U88` not found near `cli_inner_pretty.js:230211-230213` (cited in `00_overview/symbol_additions_v2_1_142_skills_goal.md`)
  - `U88` not found near `cli_inner_pretty.js:230204-230207` (cited in `00_overview/symbol_additions_v2_1_142_skills_goal.md`)
  - `uFH` not found near `cli_inner_pretty.js:217490-217490` (cited in `00_overview/symbol_additions_v2_1_142_skills_goal.md`)
  - `U88` not found near `cli_inner_pretty.js:230063-230090` (cited in `00_overview/symbol_additions_v2_1_142_skills_goal.md`)
  - `uJ4` not found near `cli_inner_pretty.js:476969-477062` (cited in `00_overview/symbol_additions_v2_1_142_skills_goal.md`)
  - `ec_` not found near `cli_inner_pretty.js:352942-352942` (cited in `10_skill_system/skill_activation_otel.md`)
  - `HG` not found near `cli_inner_pretty.js:513858-513858` (cited in `10_skill_system/subagent_skill_discovery.md`)
  - `U88` not found near `cli_inner_pretty.js:230211-230213` (cited in `10_skill_system/v2_1_142_README.md`)
  - `SkillRow` not found near `cli_inner_pretty.js:477137-477137` (cited in `10_skill_system/v2_1_142_README.md`)
  - `Hx5` not found near `cli_inner_pretty.js:507607-507607` (cited in `39_goal/README.md`)

## C3 — Line range sanity (312 ranges)
- PASS: 310
- FAIL: 2

Suspicious ranges (top 20):
  - `cli_inner_pretty.js:230198-13` in `10_skill_system/v2_1_142_README.md`
  - `cli_inner_pretty.js:406263-69` in `10_skill_system/v2_1_142_README.md`

## C4 — Per-decl file existence (0 citations)
- PASS: 0
- FAIL: 0

## C5 — Mapping consistency in `00_overview/symbol_additions_v2_1_142_skills_goal.md`
- Mappings: 58
- Conflicts: 0

## S1 — Semantic spot-check (5 random samples)

### Sample — `H2` at `cli_inner_pretty.js:218312-218312` (cited in `10_skill_system/v2_1_142_README.md`)

```js
var Yn = "inline",
  H2 = "skills-dir",
  L36,
  Nq_;

```

**Verdict:** PASS — symbol present in cited window

### Sample — `Cr5` at `cli_inner_pretty.js:564153-564153` (cited in `39_goal/README.md`)

```js
}
function Cr5(H, $) {
  let q = Eg4(H),
    K = q !== null ? Xp6() : null;

```

**Verdict:** PASS — symbol present in cited window

### Sample — `uFH` at `cli_inner_pretty.js:217490-217490` (cited in `00_overview/symbol_additions_v2_1_142_skills_goal.md`)

```js
      .sort((O, M) => M.name.length - O.name.length);
  for (let { name: O, i: M } of f) H = H.replace(new RegExp(`\\$${Vx(O)}(?![\\[\\w])`, "g"), () => A(z[M]));
  if (
    ((H = H.replace(/\$ARGUMENTS\[(\d+)\]/g, (O, M) => {

```

**Verdict:** WARN — symbol absent from cited window

### Sample — `rv5` at `cli_inner_pretty.js:486771-486771` (cited in `00_overview/symbol_additions_v2_1_142_skills_goal.md`)

```js
  W6();
  ((rP4 = require("crypto")), (rv5 = new Set(["clear", "stop", "off", "reset", "none", "cancel"])));
});
var tP4 = {};

```

**Verdict:** PASS — symbol present in cited window

### Sample — `kb` at `cli_inner_pretty.js:514268-514268` (cited in `00_overview/symbol_additions_v2_1_142_skills_goal.md`)

```js
    ])),
    (kb = L8(() => new Set(Eg6().flatMap((H) => [H.name, ...(H.aliases ?? [])])))));
  TE4 = L8(async (H) => {
    let $ = performance.now(),

```

**Verdict:** PASS — symbol present in cited window

---

## Summary

- C1 Symbol existence: 132 PASS / 0 WARN
- C2 Line/symbol pairing: 156 PASS / 10 FAIL
- C3 Range sanity: 310 PASS / 2 FAIL
- C4 Per-decl files: 0 PASS / 0 FAIL
- C5 Mapping conflicts: 0
- S1 Semantic spot-check: 4 PASS / 1 WARN

**Overall verdict: FAIL**
