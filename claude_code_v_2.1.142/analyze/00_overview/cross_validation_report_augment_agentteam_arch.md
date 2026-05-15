# Cross-Validation Report

- **Unit:** 06
- **Docs base:** `claude_code_v_2.1.142/analyze`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` (611353 lines)
- **Per-decl dir:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/unknown`
- **Markdown files scanned:** 8

## C1 — Symbol existence (160 candidates)
- PASS: 154
- WARN: 6 (pattern looked obfuscated but not in bundle — false-positive identifier, rename, or stale claim)

Missing symbols (top 30):
  - `HSk5` — first cited in `30_agent_team/team_mailbox_v_personal.md` line 30
  - `bXY` — first cited in `30_agent_team/mailbox_protocol.md` line 273
  - `c7Y` — first cited in `00_overview/symbol_additions_v2_1_142_agent_team_arch.md` line 240
  - `l7Y` — first cited in `00_overview/symbol_additions_v2_1_142_agent_team_arch.md` line 240
  - `n7Y` — first cited in `00_overview/symbol_additions_v2_1_142_agent_team_arch.md` line 240
  - `yXY` — first cited in `30_agent_team/mailbox_protocol.md` line 273

## C2 — Line/symbol pairing (73 pairs)
- PASS: 63
- FAIL: 10

Mismatched line citations (top 30):
  - `FTH` not found near `cli_inner_pretty.js:239141-239145` (cited in `00_overview/symbol_additions_v2_1_142_agent_team_arch.md`)
  - `mO$` not found near `cli_inner_pretty.js:239197-239197` (cited in `00_overview/symbol_additions_v2_1_142_agent_team_arch.md`)
  - `FkH` not found near `cli_inner_pretty.js:523146-523158` (cited in `00_overview/symbol_additions_v2_1_142_agent_team_arch.md`)
  - `CiH` not found near `cli_inner_pretty.js:523159-523200` (cited in `00_overview/symbol_additions_v2_1_142_agent_team_arch.md`)
  - `qn7` not found near `cli_inner_pretty.js:384003-384062` (cited in `00_overview/symbol_additions_v2_1_142_agent_team_arch.md`)
  - `lu5` not found near `cli_inner_pretty.js:523295-523295` (cited in `00_overview/symbol_additions_v2_1_142_agent_team_arch.md`)
  - `op` not found near `cli_inner_pretty.js:239067-239067` (cited in `00_overview/symbol_additions_v2_1_142_agent_team_arch.md`)
  - `O89` not found near `cli_inner_pretty.js:609938-609938` (cited in `30_agent_team/coordinator_process_model.md`)
  - `eJ$` not found near `cli_inner_pretty.js:523392-523392` (cited in `30_agent_team/worktree_isolation.md`)
  - `qn7` not found near `cli_inner_pretty.js:384003-384062` (cited in `30_agent_team/worktree_isolation.md`)

## C3 — Line range sanity (139 ranges)
- PASS: 139
- FAIL: 0

## C4 — Per-decl file existence (0 citations)
- PASS: 0
- FAIL: 0

## C5 — Mapping consistency in `00_overview/symbol_additions_v2_1_142_agent_team_arch.md`
- Mappings: 26
- Conflicts: 0

## S1 — Semantic spot-check (5 random samples)

### Sample — `vD6` at `cli_inner_pretty.js:239491-239510` (cited in `00_overview/symbol_additions_v2_1_142_agent_team_arch.md`)

```js
}
async function vD6(H, $, q) {
  let K = UTH(H, q),
    _ = `${K}.lock`,
    A;
  try {
    A = await Ff(K, { lockfilePath: _, ...uO$ });
    let z = await o7H(H, q);
    if (z.length === 0) return;
    let Y = z.map((f) => (!f.read && $(f) ? { ...f, read: !0 } : f));
    await Sn.writeFile(K, SH(Y, null, 2), "utf-8");
  } catch (z) {
    if (O8(z) === "ENOENT") return;
    EH(z);
  } finally {
 ...
```

**Verdict:** PASS — symbol present in cited window

### Sample — `CD6` at `cli_inner_pretty.js:240330-240334` (cited in `30_agent_team/permission_inheritance.md`)

```js
});
function CD6(H, $) {
  if ($) return "plan";
  if (H === "plan" || H === "dontAsk") return "default";
  return H;
}
async function t68(H, $) {
  let { name: q, teamName: K, prompt: _, color: A, planModeRequired: z, model: Y } = H,

```

**Verdict:** PASS — symbol present in cited window

### Sample — `agK` at `cli_inner_pretty.js:199052-199063` (cited in `00_overview/symbol_additions_v2_1_142_agent_team_arch.md`)

```js
}
function agK(H) {
  let { cli: $, env: q, settings: K, agentFrontmatter: _ } = H,
    A = $.model === "default" ? gJ() : $.model,
    z = _?.model;
  if (!A && z && z !== "inherit") A = n7(z);
  let Y = A;
  if (Y === void 0) Y = q.ANTHROPIC_MODEL || K.model || void 0;
  if (Y && !hU(Y)) Y = void 0;
  let f = Y || null,
    O = n7(f ?? gJ());
  return { effectiveModel: A, initialMainLoopModel: f...
```

**Verdict:** PASS — symbol present in cited window

### Sample — `BB5` at `cli_inner_pretty.js:528605-528605` (cited in `00_overview/symbol_additions_v2_1_142_agent_team_arch.md`)

```js
  mB5 = 120000,
  BB5 = 120000,
  pB5 = 300000,
  BI4 = 4096,

```

**Verdict:** PASS — symbol present in cited window

### Sample — `f89` at `cli_inner_pretty.js:609938-609946` (cited in `00_overview/symbol_additions_v2_1_142_agent_team_arch.md`)

```js
});
async function f89(H) {
  try {
    let $ = await g08.realpath(H),
      q = await g08.stat($);
    return { target: $, mtimeMs: q.mtimeMs };
  } catch ($) {
    if (f8($)) return null;
    throw $;
  }
}
function tKA(H, $) {

```

**Verdict:** PASS — symbol present in cited window

---

## Summary

- C1 Symbol existence: 154 PASS / 6 WARN
- C2 Line/symbol pairing: 63 PASS / 10 FAIL
- C3 Range sanity: 139 PASS / 0 FAIL
- C4 Per-decl files: 0 PASS / 0 FAIL
- C5 Mapping conflicts: 0
- S1 Semantic spot-check: 5 PASS / 0 WARN

**Overall verdict: FAIL**

## C6 — ORIGINAL code-block fidelity (20 blocks)
- PASS: 19
- FAIL: 1

Mismatched ORIGINAL fingerprints (top 10):
  - `ZSk5(H, $)` in `team_mailbox_v_personal.md`

## Post-amble

C2 surfaced 10 line-pair mismatches and C1 surfaced 6 missing symbol candidates (mostly in `symbol_additions_v2_1_142_agent_team_arch.md` and `mailbox_protocol.md`). C6 flagged one ORIGINAL-block fingerprint mismatch (`ZSk5(H, $)` in `team_mailbox_v_personal.md`). These point to drift between cited line numbers/symbols and the v2.1.142 bundle; authoritative re-grep recommended before merging the augmentation.
