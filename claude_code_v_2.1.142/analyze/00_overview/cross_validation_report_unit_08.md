# Cross-Validation Report

- **Unit:** 08
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/.claude/worktrees/agent-a316534377fef3850/claude_code_v_2.1.142/analyze`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` (611353 lines)
- **Per-decl dir:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/unknown`
- **Markdown files scanned:** 14

## C1 — Symbol existence (146 candidates)
- PASS: 145
- WARN: 1 (pattern looked obfuscated but not in bundle — false-positive identifier, rename, or stale claim)

Missing symbols (top 30):
  - `n7Y` — first cited in `30_agent_team/v2_1_142_dispatch_flags.md` line 368

## C2 — Line/symbol pairing (126 pairs)
- PASS: 113
- FAIL: 13

Mismatched line citations (top 30):
  - `argv` not found near `cli_inner_pretty.js:114-122` (cited in `00_overview/symbol_additions_v2_1_142_agents.md`)
  - `existed` not found near `cli_inner_pretty.js:523198-523198` (cited in `00_overview/symbol_additions_v2_1_142_agents.md`)
  - `tKA` not found near `cli_inner_pretty.js:610170-610170` (cited in `00_overview/symbol_additions_v2_1_142_agents.md`)
  - `sKA` not found near `cli_inner_pretty.js:610118-610118` (cited in `00_overview/symbol_additions_v2_1_142_agents.md`)
  - `$VISUAL` not found near `cli_inner_pretty.js:445829-445833` (cited in `00_overview/symbol_additions_v2_1_142_agents.md`)
  - `Go6` not found near `cli_inner_pretty.js:87-89` (cited in `30_agent_team/v2_1_142_dispatch_flags.md`)
  - `wZH` not found near `cli_inner_pretty.js:607805-607805` (cited in `36_background_agents/agent_view.md`)
  - `done` not found near `cli_inner_pretty.js:566146-566152` (cited in `36_background_agents/completed_vs_working.md`)
  - `jN4` not found near `cli_inner_pretty.js:509881-509894` (cited in `36_background_agents/pre_warm_worker.md`)
  - `enojob` not found near `cli_inner_pretty.js:509896-509896` (cited in `36_background_agents/pre_warm_worker.md`)
  - `DE6` not found near `cli_inner_pretty.js:523138-523138` (cited in `36_background_agents/worktree_recognition.md`)
  - `eJ$` not found near `cli_inner_pretty.js:523071-523071` (cited in `36_background_agents/worktree_recognition.md`)
  - `remove` not found near `cli_inner_pretty.js:234443-234443` (cited in `36_background_agents/worktree_recognition.md`)

## C3 — Line range sanity (297 ranges)
- PASS: 297
- FAIL: 0

## C4 — Per-decl file existence (0 citations)
- PASS: 0
- FAIL: 0

## C5 — Mapping consistency in `00_overview/symbol_additions_v2_1_142_agents.md`
- Mappings: 23
- Conflicts: 1

  - `JN4` mapped to both `STORE_OPEN_AGENT_VIEW_FLAG` and `discardPendingSpare`

## S1 — Semantic spot-check (5 random samples)

### Sample — `x6A` at `cli_inner_pretty.js:598402-598402` (cited in `00_overview/symbol_additions_v2_1_142_agents.md`)

```js
  ue4 = 500,
  x6A = 5000,
  Mr6 = null,
  wr6 = 0,

```

**Verdict:** PASS — symbol present in cited window

### Sample — `HT$` at `cli_inner_pretty.js:566146-566149` (cited in `00_overview/symbol_additions_v2_1_142_agents.md`)

```js
}
function HT$(H) {
  let $ = (q) => q?.trim().toLowerCase().startsWith("/loop") ?? !1;
  return $(H.intent) || $(H.initialPrompt);
}
function OG8(H) {
  return H.routine !== void 0 || (H.inFlight?.kinds.includes("session_cron") ?? !1) || HT$(H);

```

**Verdict:** PASS — symbol present in cited window

### Sample — `DE6` at `cli_inner_pretty.js:523138-523138` (cited in `36_background_agents/worktree_recognition.md`)

```js
    sessionId: H,
    enteredExisting: !0,
  };
  return ($JH(O), O);

```

**Verdict:** WARN — symbol absent from cited window

### Sample — `NQ4` at `cli_inner_pretty.js:566153-566158` (cited in `00_overview/symbol_additions_v2_1_142_agents.md`)

```js
}
function NQ4(H, $, q) {
  if ($ && H.tempo !== "active" && q === void 0) return Fq$;
  if (q === "busy" || q === "shell") return null;
  if (HT$(H)) return Po5();
  return Lo5();
}
function vo5() {
  let H = o$H.c(1),

```

**Verdict:** PASS — symbol present in cited window

### Sample — `existed` at `cli_inner_pretty.js:523198-523198` (cited in `00_overview/symbol_additions_v2_1_142_agents.md`)

```js
}
async function eJ$(H, $) {
  if ((SiH(H), tEH())) {
    let Y = await aEH(H);

```

**Verdict:** WARN — symbol absent from cited window

---

## Summary

- C1 Symbol existence: 145 PASS / 1 WARN
- C2 Line/symbol pairing: 113 PASS / 13 FAIL
- C3 Range sanity: 297 PASS / 0 FAIL
- C4 Per-decl files: 0 PASS / 0 FAIL
- C5 Mapping conflicts: 1
- S1 Semantic spot-check: 3 PASS / 2 WARN

**Overall verdict: FAIL**
