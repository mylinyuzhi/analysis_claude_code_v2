# Cross-Validation Report

- **Module:** 04_tools (Tools subsystem delta, v2.1.143 → v2.1.156)
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/04_tools`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649979 lines)
- **v2.1.88 xval source:** `/lyz/codespace/3rd/claude-code/src`
- **Markdown files scanned:** 5 module docs (`README.md`, `workflow_tool_registration.md`,
  `ask_user_question_reservation.md`, `disallowed_tools_frontmatter.md`,
  `read_partial_view_and_streaming_exec.md`) + 1 additions file
  (`00_overview/symbol_additions_v2_1_156_tools.md`)
- **Samples verified directly in the bundle:** 55 (well above the ≥15 floor)

## C1 — Symbol existence (55 cited symbols/lines sampled)

Every sampled obfuscated identifier was located at its cited `cli_inner_pretty.js:<line>`
by reading the line directly. Coverage spans all four deltas:

- Workflow registration: `ra` (409313), `n0_` (378217), `ep6`+`X$` (378079-378080),
  `yK` (143482), `_H$` (409408), `k0` block (409491-409503), workflow spread (409350-409351),
  `iUK` (143455), `Xg6` (409308), `zl` (409374), `HqH` (409371), `m57`/`mx` (216289-216291),
  `NZ` (184757), `H48` (184750), `r$7` (184770), `KP6`/`SL5`/`$48` (184776-184789).
- AskUserQuestion reservation: `ez`/`BUK`/`pUK`/`FUK` (143388-143396), `YtH` (348809),
  `X3` (143864, 143872-143877, core boolean 143876), `c45` (143847-143862, opus-4-8 at 143861),
  `d45` (143839), `gM6` (143836), `wC$` (2829), `v8` (1488, assigned 1492), `O7` (98770),
  `UA` (91891), `V$` (141101).
- `disallowed-tools` frontmatter: schema 184489-184497, `BjH` (184468), `oL6` (184465),
  `GL5` (184480), `aL6` (184517), `TL5` (184556), agent `disallowedTools` (184566),
  `cd6` (421555, field read 421574), plugin parse site (414132), `IS` (442850, CLI use 442892),
  `fc` (443196), `tZ4` (443179), `aq` (40716), `c28` (395738, union call 396622),
  `fV8`/`YV8` (452892-452902), `tT4` (452903), `D0$` (452910), `T6` (453162), `hV$` (453193),
  `yA4` (396582), `hN_` (396573), `NN_` (396016), `mL_` region (350443), `qkH` (184453),
  `fI8` (590814, clear at 590839).
- Read partial-view + streaming: `FJ4` (422314), `O95`/`mFK`/`$j$` (145389-145392),
  `w68` (145353), truncation block (422438), persist block (422485), edit guard (434434),
  write guard (348094), dedup gate (422852), `w08` (555969), `Ji$`/`Xi$` (91815-91834),
  `j3` (91835, in `T()` thunk), `jLz` (555942), `Zq` (91853), `Rz` (91897), `OVH` (130417),
  `qyK` (130649).

- **PASS: 55**
- **FAIL: 0**

No cited symbol was missing from its cited window. The additions file's own line-number
corrections (e.g. `X$` definition at 55 vs. call site at 378080; `$48` bare declaration at
184789; `j3` assigned inside the `T()` thunk at 91835) were re-confirmed and are accurate.

## C2 — Line/symbol pairing (55 pairs)

For each sample the obfuscated identifier present at the cited line matched the readable name
and role asserted in the doc/additions row. Notable precise matches:

- `NZ` four-layer gate body verbatim (`if (H48()) return !1; if (!r$7()) return !1; … return hL5() ?? $;`).
- `c45` model allow-list ends with `if ($ === "claude-opus-4-8") return !1; return !UA();` —
  matching the "Opus 4.8 → lean, unknown id defaults by provider" claim.
- `X3 = v8((H) => { … return !c45(H) || d45(H); })` at 143872-143876.
- `c28(q, $, "replace"|"union")` identity bail-out (395742) and `fI8` clear-on-next-message
  call `c28(z.setToolPermissionContext, G.disallowedTools ?? [])` at 590839 (default replace).
- `w08` four-way eager-streaming gate and the `"L:"`/`"F:"` cache-key tags at 555971/555990-555996.

- **PASS: 55**
- **FAIL: 0**

## C3 — Line range sanity (sampled ranges)

All cited ranges fall inside `[1, 649979]` and are monotonic (start ≤ end). Multi-line ranges
(e.g. `184757-184763`, `422438-422483`, `555969-556009`, `409491-409504`) bracket exactly the
construct claimed. No range crossed a function boundary incorrectly.

- **PASS: 18 ranges sampled**
- **FAIL: 0**

## C4 — v2.1.88 precursor cross-check (12 claims)

Every "precursor"/"NEW" assertion was checked against `/lyz/codespace/3rd/claude-code/src`:

| Claim | v2.1.88 evidence | Verdict |
|-------|------------------|---------|
| Workflow registration plumbing has a `src/tools.ts` precursor | `tools.ts:129-134` IIFE `feature('WORKFLOW_SCRIPTS') ? (() => { initBundledWorkflows(); return …WorkflowTool })() : null` | PASS (precursor) |
| Static `feature('WORKFLOW_SCRIPTS')` flag is GONE in 2.1.156 | flag present at `tools.ts:129`; absent in bundle `k0` (unconditional assign) | PASS (NEW gate) |
| `getToolsForDefaultPreset` is a verbatim port | `tools.ts:179-183` identical mask-then-filter | PASS |
| `assembleToolPool` contiguous-prefix sort | `tools.ts:345-367` same `uniqBy([...builtIns].sort().concat(mcp.sort()))` + cache comment | PASS |
| array order MUST stay cache-synced | `tools.ts:191` NOTE comment about statsig global system caching | PASS |
| AskUserQuestion `prompt()` took no model arg in 2.1.88 | `prompt.ts` `async prompt()` (no args), base = "Use this tool when you need to ask" | PASS (NEW) |
| No reservation paragraph / `cinder_plover` / `X3` gate in 2.1.88 | grep of `AskUserQuestionTool/` empty for all three | PASS (NEW) |
| `disallowed-tools` on skill/command frontmatter is NEW | `loadSkillsDir.ts:242-243` parses only `allowed-tools`; `loadPluginCommands.ts` only `allowed-tools` | PASS (NEW) |
| agent `disallowedTools` field pre-exists | `coreSchemas.ts:1122` `disallowedTools: z.array(z.string())` | PASS (precursor) |
| `permissionLayers`/`contextLayers` abstraction is NEW | grep of `src/` returns zero matches | PASS (NEW) |
| `isPartialView` consumer mesh pre-exists | `fileStateCache.ts:14` field, `FileReadTool.ts:549` / `FileWriteTool.ts:199` guards | PASS (precursor) |
| firstParty `eager_input_streaming` branch byte-identical; per-model `eagerInputStreaming` NEW | `api.ts:198-205` firstParty-only + 400 comment; `eagerInputStreaming` absent from `src/` | PASS (precursor + NEW) |

- **PASS: 12**
- **FAIL: 0**

## C5 — Mapping conflicts (readable-name single-source-of-truth)

Cross-doc scan found **three** obfuscated symbols carrying divergent readable names across the
module docs + additions file. Per CLAUDE.md (one symbol = one readable name), all were
reconciled to the name used by the central index / per-module additions single source of truth:

1. `xH` — `parseBoolEnv` (additions + workflow doc) vs `parseBoolTrue` (ask_user_question +
   read_partial). Central index `symbol_index_infra_platform.md:248` uses `parseBoolTrue`.
   **Fixed → `parseBoolTrue`** (additions row + 2 sites in workflow doc).
2. `k4` — `parseFalseEnv` vs `parseBoolFalse`. Central index `:245` uses `parseBoolFalse`.
   **Fixed → `parseBoolFalse`** (additions row + 2 sites in workflow doc).
3. `V$` — `getFeatureGate` (additions + ask_user_question) vs `getFeatureValue` (read_partial)
   vs `checkGate` (workflow). Additions row is `getFeatureGate`.
   **Fixed → `getFeatureGate`** (3 sites in read_partial, 3 sites in workflow).
4. `yK` — `createTool` (additions + workflow) vs `wrapTool` (ask_user_question, 2 sites).
   Central index `core_execution` and additions use `createTool`. **Fixed → `createTool`.**

- **Conflicts found: 4 symbols**
- **Conflicts remaining after fix: 0**

(The apparent `yK → getToolSchemaCache` hit in scanning was a substring false-positive of
`qyK → getToolSchemaCache`, which is correct and was left intact.)

## S1 — Semantic spot-checks (5 samples)

### Sample 1 — `NZ` (`isWorkflowsEnabled`) at `cli_inner_pretty.js:184757-184763`

```js
function NZ() {
  if (H48()) return !1;
  if (!r$7()) return !1;
  let { available: H, defaultOn: $ } = KP6();
  if (!H) return !1;
  return hL5() ?? $;
}
```
**Verdict:** PASS — matches the doc's four-layer veto chain (`H48` → `r$7` → `KP6/SL5` →
`hL5() ?? defaultOn`) byte for byte.

### Sample 2 — `FUK` (`ASK_USER_QUESTION_RESERVATION_PROMPT`) at `cli_inner_pretty.js:143394-143396`

```js
  FUK = `
Reserve this for decisions where the user's answer changes what you do next — not for choices with a conventional default or facts you can verify in the codebase yourself. In those cases pick the obvious option, mention it in your response, and proceed.
`;
```
**Verdict:** PASS — the reservation paragraph quoted in `ask_user_question_reservation.md` is exact;
the `prompt({ model: H })` injection at 348816-348824 gates it behind `X3(H)` and the
`tengu_cinder_plover` override as documented.

### Sample 3 — `c28` (`appendOrReplaceCommandDenyRules`) at `cli_inner_pretty.js:395738-395745`

```js
function c28(H, $, q = "replace") {
  H((K) => {
    let _ = K.alwaysDenyRules.command,
      z = q === "union" ? aq([...(_ ?? []), ...$]) : [...$];
    if ((_?.length ?? 0) === z.length && (_ ?? []).every((Y, f) => Y === z[f])) return K;
    return { ...K, alwaysDenyRules: { ...K.alwaysDenyRules, command: z.length > 0 ? z : void 0 } };
  });
}
```
**Verdict:** PASS — the union/replace mode, the dedup via `aq`, and the referential-equality
bail-out (395742) all match `disallowed_tools_frontmatter.md` Section 3 exactly. The
clear-on-next-message call `c28(z.setToolPermissionContext, G.disallowedTools ?? [])` at 590839
(default replace mode) is verified.

### Sample 4 — eager-streaming gate inside `w08` at `cli_inner_pretty.js:555990-555996`

```js
    let J = process.env.CLAUDE_CODE_ENABLE_FINE_GRAINED_TOOL_STREAMING;
    if (
      !k4(J) &&
      ((q === "firstParty" && Rz() && V$("tengu_fgts", !1)) ||
        (q === "vertex" && !process.env.ANTHROPIC_VERTEX_BASE_URL && K?.eagerInputStreaming?.vertex) ||
        (q === "bedrock" && !process.env.ANTHROPIC_BEDROCK_BASE_URL && K?.eagerInputStreaming?.bedrock) ||
        xH(J))
    )
      O.eager_input_streaming = !0;
```
**Verdict:** PASS — the four-way short-circuit OR (kill-switch `!k4(J)`, firstParty branch,
NEW vertex/bedrock per-model branches, force `xH(J)`) matches `read_partial_view_and_streaming_exec.md`
Part 2 exactly. The firstParty branch is byte-identical to `src/utils/api.ts:200-205`.

### Sample 5 — `T6` (`computeEffectivePermissionContext`) disallowed_tools case at `cli_inner_pretty.js:453162-...`

```js
function T6(H) {
  let $ = H.getAppState().toolPermissionContext,
    q = H.permissionLayers;
  if (!q) return $;
  for (let K of q)
    switch (K.kind) {
      case "allowed_tools":   $ = YV8($, [...K.allowedTools]); break;
      case "disallowed_tools": $ = fV8($, [...K.disallowedTools]); break;
      ...
```
**Verdict:** PASS — the fork-path `{kind:"disallowed_tools"}` layer folds into the effective
context via `fV8` (`appendCommandDenyRules`) exactly as `disallowed_tools_frontmatter.md`
Section 5 describes.

---

## Summary

- C1 Symbol existence: 55 PASS / 0 FAIL
- C2 Line/symbol pairing: 55 PASS / 0 FAIL
- C3 Range sanity: 18 PASS / 0 FAIL
- C4 v2.1.88 precursor cross-check: 12 PASS / 0 FAIL
- C5 Mapping conflicts: 4 found → 4 fixed → 0 remaining
- S1 Semantic spot-check: 5 PASS / 0 FAIL

**Fixes applied (in place):**
1. `symbol_additions_v2_1_156_tools.md`: `xH` row `parseBoolEnv`→`parseBoolTrue`; `k4` row
   `parseFalseEnv`→`parseBoolFalse`; home-index note line updated to match.
2. `workflow_tool_registration.md`: `xH` `parseBoolEnv`→`parseBoolTrue` (list + 1 code + 1 mapping);
   `k4` `parseFalseEnv`→`parseBoolFalse` (list + 1 code + 1 mapping); `V$` `checkGate`→`getFeatureGate`
   (2 code + 1 mapping).
3. `read_partial_view_and_streaming_exec.md`: `V$` `getFeatureValue`→`getFeatureGate` (2 code + 1 mapping).
4. `ask_user_question_reservation.md`: `yK` `wrapTool`→`createTool` (1 code + 1 mapping).

**Overall verdict: PASS (high confidence).** The 04_tools delta docs are exceptionally accurate:
every sampled `cli_inner_pretty.js:<line>` citation resolved correctly, every NEW-vs-precursor
claim is supported by the v2.1.88 tree, and the only defects were four readable-name
inconsistencies for cross-cutting platform helpers (`xH`/`k4`/`V$`/`yK`), now reconciled to the
single-source-of-truth names. No line-number errors were found.
