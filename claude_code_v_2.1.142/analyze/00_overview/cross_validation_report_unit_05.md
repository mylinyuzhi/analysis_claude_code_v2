# Cross-Validation Report

- **Unit:** 05
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/.claude/worktrees/agent-a0a10bea4dfc2472d/claude_code_v_2.1.142/analyze`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` (611353 lines)
- **Per-decl dir:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/unknown`
- **Markdown files scanned:** 12

## C1 — Symbol existence (78 candidates)
- PASS: 77
- WARN: 1 (pattern looked obfuscated but not in bundle — false-positive identifier, rename, or stale claim)

Missing symbols (top 30):
  - `BEL_BYTE` — first cited in `00_overview/symbol_additions_v2_1_142_hooks.md` line 104

## C2 — Line/symbol pairing (96 pairs)
- PASS: 74
- FAIL: 22

Mismatched line citations (top 30):
  - `FL$` not found near `cli_inner_pretty.js:520215-520221` (cited in `00_overview/symbol_additions_v2_1_142_hooks.md`)
  - `kL$` not found near `cli_inner_pretty.js:520224-520224` (cited in `00_overview/symbol_additions_v2_1_142_hooks.md`)
  - `PQ6` not found near `cli_inner_pretty.js:521151-521304` (cited in `00_overview/symbol_additions_v2_1_142_hooks.md`)
  - `zh4` not found near `cli_inner_pretty.js:521128-521134` (cited in `00_overview/symbol_additions_v2_1_142_hooks.md`)
  - `pu5` not found near `cli_inner_pretty.js:521392-521392` (cited in `00_overview/symbol_additions_v2_1_142_hooks.md`)
  - `VW8` not found near `cli_inner_pretty.js:520582-520600` (cited in `00_overview/symbol_additions_v2_1_142_hooks.md`)
  - `_h4` not found near `cli_inner_pretty.js:520602-520618` (cited in `00_overview/symbol_additions_v2_1_142_hooks.md`)
  - `CG$` not found near `cli_inner_pretty.js:520557-520580` (cited in `00_overview/symbol_additions_v2_1_142_hooks.md`)
  - `JQ6` not found near `cli_inner_pretty.js:521517-521517` (cited in `00_overview/symbol_additions_v2_1_142_hooks.md`)
  - `Bu5` not found near `cli_inner_pretty.js:521440-521440` (cited in `00_overview/symbol_additions_v2_1_142_hooks.md`)
  - `mu5` not found near `cli_inner_pretty.js:521470-521470` (cited in `00_overview/symbol_additions_v2_1_142_hooks.md`)
  - `aP` not found near `cli_inner_pretty.js:522029-522029` (cited in `00_overview/symbol_additions_v2_1_142_hooks.md`)
  - `aP` not found near `cli_inner_pretty.js:522030-522030` (cited in `00_overview/symbol_additions_v2_1_142_hooks.md`)
  - `aP` not found near `cli_inner_pretty.js:522080-522110` (cited in `00_overview/symbol_additions_v2_1_142_hooks.md`)
  - `jW8` not found near `cli_inner_pretty.js:519573-519573` (cited in `00_overview/symbol_additions_v2_1_142_hooks.md`)
  - `PQ6` not found near `cli_inner_pretty.js:521251-521260` (cited in `11_hooks/args_exec_form.md`)
  - `G38` not found near `cli_inner_pretty.js:378993-379008` (cited in `11_hooks/continue_on_block.md`)
  - `Ey4` not found near `cli_inner_pretty.js:519157-519157` (cited in `11_hooks/continue_on_block.md`)
  - `TW8` not found near `cli_inner_pretty.js:520641-520648` (cited in `11_hooks/terminal_sequence.md`)
  - `YW` not found near `cli_inner_pretty.js:522255-522283` (cited in `11_hooks/terminal_sequence.md`)
  - `aP` not found near `cli_inner_pretty.js:522055-522058` (cited in `11_hooks/updated_tool_output_all_tools.md`)
  - `TW8` not found near `cli_inner_pretty.js:520617-520795` (cited in `11_hooks/v2_1_142_README.md`)

## C3 — Line range sanity (143 ranges)
- PASS: 143
- FAIL: 0

## C4 — Per-decl file existence (0 citations)
- PASS: 0
- FAIL: 0

## C5 — Mapping consistency in `00_overview/symbol_additions_v2_1_142_hooks.md`
- Mappings: 31
- Conflicts: 0

## S1 — Semantic spot-check (5 random samples)

### Sample — `catch` at `cli_inner_pretty.js:521997-522024` (cited in `11_hooks/prompt_type_validation.md`)

```js
            hook: g,
          });
        return;
      } catch (e) {
        qH?.();
        let o = e instanceof Error ? e.message : String(e);
        (gP({
          hookId: a,
          hookName: w,
          hookEvent: M,
          output: `Failed to run: ${o}`,
          stdout: "",
          stderr: `Failed to run: ${o}`,
          exitCode: 1,
          outcome: "error",
        }),
    ...
```

**Verdict:** PASS — symbol present in cited window

### Sample — `pu5` at `cli_inner_pretty.js:521392-521392` (cited in `00_overview/symbol_additions_v2_1_142_hooks.md`)

```js
  });
  let W = V47(M, Z, J.length, P);
  for (let { hook: g } of J)
    yield {

```

**Verdict:** WARN — symbol absent from cited window

### Sample — `dv$` at `cli_inner_pretty.js:3087-3091` (cited in `11_hooks/v2_1_142_README.md`)

```js
}
function dv$(H) {
  let $ = jv();
  if ($) $.mainThreadAgentHooks = H;
  else U$.mainThreadAgentHooks = H;
}
function Np() {
  return U$.sessionSkillAllowlist;

```

**Verdict:** PASS — symbol present in cited window

### Sample — `mu5` at `cli_inner_pretty.js:521470-521470` (cited in `00_overview/symbol_additions_v2_1_142_hooks.md`)

```js
              hookEvent: M,
              content: `Failed to prepare hook input: ${ZH(e.error)}`,
              command: MH,
              durationMs: Date.now() - t,

```

**Verdict:** WARN — symbol absent from cited window

### Sample — `TW8` at `cli_inner_pretty.js:520617-520795` (cited in `11_hooks/v2_1_142_README.md`)

```js
  hookEvent: _,
  expectedHookEvent: A,
  stdout: z,
  stderr: Y,
  exitCode: f,
  durationMs: O,
}) {
  let M = {},
    w = H;
  if (w.continue === !1) {
    if (((M.preventContinuation = !0), w.stopReason)) M.stopReason = w.stopReason;
  }
  if (H.decision)
    switch (H.decision) {
      case "approve":
        M.permissionBehavior = "allow";
        break;
      case "block":
        ((M.permi...
```

**Verdict:** WARN — symbol absent from cited window

---

## Summary

- C1 Symbol existence: 77 PASS / 1 WARN
- C2 Line/symbol pairing: 74 PASS / 22 FAIL
- C3 Range sanity: 143 PASS / 0 FAIL
- C4 Per-decl files: 0 PASS / 0 FAIL
- C5 Mapping conflicts: 0
- S1 Semantic spot-check: 2 PASS / 3 WARN

**Overall verdict: FAIL**
