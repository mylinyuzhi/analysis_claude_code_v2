# Cross-Validation Report — Module 44_lean_prompt (Lean System Prompt)

- **Module:** `44_lean_prompt` (Lean System Prompt, new in v2.1.154; this tree covers v2.1.143 → v2.1.156)
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/44_lean_prompt/`
- **Additions file:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/00_overview/symbol_additions_v2_1_156_lean_prompt.md`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
- **v2.1.88 xval source:** `/lyz/codespace/3rd/claude-code/src/constants/prompts.ts`
- **Markdown files scanned:** 4 module docs + 1 additions file (`README.md`, `lean_prompt_eligibility_gate.md`, `lean_vs_full_prompt_diff.md`, `lean_prompt_rationale_and_rollout.md`, `symbol_additions_v2_1_156_lean_prompt.md`)
- **Samples verified by direct read:** 27 (see below)

---

## C1 — Symbol existence

Every obfuscated identifier in the additions table was located in the bundle at its cited line by direct read.

- PASS: 27 / 27 sampled symbols present at cited location.
- FAIL: 0

Verified symbols (function/var present at the cited line, body matches claim):
`gM6` 143836, `d45` 143839, `c45` 143847, `X3`/`Dv` 143864/143865-143877, `xH` 1795, `k4` 1801,
`cx8` 1475, `v8` 1492, `Zq` 91853, `UA` 91891, `oR` 91894, `Gi$` 91967, `ki` 98240, `uB` 98243,
`m76` 98249, `Wj` 98257, `HD` 98751, `O7` 98770, `SYH` 3196, `Qm8` 3199, `gm8` 3202, `DE` 271350,
`uv7` 271353, `z44`/`Y0_`/`f0_` 376250/376253/376261, `W47` 206793, `SFK` 145119, `HR_` 412889,
`oXz` 555591, `cKq` 555588, `N0` 555614, `uXz` 555399, `mXz` 555414, `BXz` 555418, `oU` 555439,
`QXz` 555442, `gXz` 555449, `dXz` 555461, `cXz` 555494, `lXz` 555511, `rXz` 555578, `fLz` 555862,
`rKq` 555868, `OLz` 555878, `gKq` 555397, `ALz` 555896, `YLz` 555898, `i6$` 555940, `Q88` 143429.

No symbol was absent from its cited window.

---

## C2 — Line/symbol pairing

For each cited `<symbol> @ cli_inner_pretty.js:<line>` pair sampled, the symbol's declaration sits at
the head of (or inside) the cited range.

- PASS: 27 / 27
- FAIL: 0

Notable cross-doc consistency confirmed:
- `X3 = v8(...)` predicate body at 143872-143877 is identical across all four docs (`!c45(H) || d45(H)`
  with the two env short-circuits first). Polarity note (`c45` returns `true` for **full**) is stated
  consistently in the additions file and both deep-dives.
- `N0` terminal swap `_ ? [oXz(f)] : [QXz(f), gXz(), …, rXz()]` at 555650-555653 is quoted verbatim in
  README, `lean_vs_full_prompt_diff.md` (full), and `lean_prompt_rationale_and_rollout.md` (excerpt) —
  all agree.
- `X3(` call-site count claimed as **21** in three docs (README implies, gate §0/§9 states "21",
  rationale §5 states "21 sites"); `grep -c "X3(" cli_inner_pretty.js` ⇒ **21**. Exact match.

---

## C3 — Line-range sanity

All ranges are well-formed (start ≤ end) and the function/constant fits within the cited span.

- PASS: 24 / 24 ranges checked
- FAIL (pre-fix): 3 incomplete/loose ranges → corrected (see Fixes Applied)
- FAIL (post-fix): 0

Ranges spot-confirmed end-to-end against the bundle:
`c45` 143847-143862 (closes at 143862 `return !UA();` + `}`), `d45` 143839-143845, `X3`/`Dv`
143864-143877, `oXz` 555591-555607 (function closes at 555607), `uXz` 555399-555413, `mXz`
555414-555417, `QXz` 555442-555448, `gXz` 555449-555460, `dXz` 555461-555493, `cXz` 555494-555510,
`lXz` 555511-555534, `rXz` 555578-555587, `fLz` 555862-555866, `rKq` 555868-555877, `OLz`
555878-555881, `N0` 555614-555658, `DE`/`uv7` 271350-271362, `z44` 376250-376251.

---

## C4 — Mapping conflicts (one readable name per obfuscated symbol)

Checked every symbol that appears in more than one doc for a consistent readable name.

- Conflicts found (pre-fix): 1 — `z44` was labeled "Read/Todo tool-description picker" in
  `lean_vs_full_prompt_diff.md` but "Todo tool-description picker" everywhere else (and the additions
  file explicitly corrects the scout's "Read tool-result trimming" mislabel). Resolved to the single
  canonical readable `getTodoToolDescription` / "Todo tool-description picker".
- Conflicts found (post-fix): 0

All other symbols carry a single consistent readable name across all four module docs and the
additions file (`X3`=isLeanSystemPrompt, `c45`=isFullPromptModel, `d45`=isForcedLeanModel,
`gM6`=isEarlyAccessModel, `oXz`=leanHarnessSection, `N0`=buildSystemPromptSections, `cKq`=isSimplePromptMode,
`UA`=isFirstPartyProvider, `O7`=normalizeModelId, `Wj`=isOpus46OrNewer, etc.).

No mapping tables were introduced into the module docs; the only tables present are the explicitly-labeled
content/mode/changelog comparison tables (allowed) and the additions-file symbol table (the single source).

---

## S1 — Semantic spot-checks (5 samples)

### Sample 1 — `X3` / `c45` / `d45` gate triad @ 143839-143877 (cited everywhere)

```js
function d45(H) {
  let $ = O7(H), q = b$().clientDataCache?.simple_system_prompt;
  if (typeof q === "object" && q !== null && Object.entries(q).some(([_, z]) => z === !0 && $.includes(_))) return !0;
  let K = V$("tengu_velvet_cascade", null);
  if (typeof K !== "object" || K === null || !("models" in K) || !Array.isArray(K.models)) return !1;
  return K.models.some((_) => typeof _ === "string" && $.includes(_));
}
function c45(H) {
  if (gM6(H)) return !1;
  let $ = O7(H);
  if ($.includes("claude-3-") || $.includes("haiku") || $.includes("sonnet") ||
      $ === "claude-opus-4-0" || $ === "claude-opus-4-1" || $ === "claude-opus-4-5" ||
      $ === "claude-opus-4-6" || $ === "claude-opus-4-7") return !0;
  if ($ === "claude-opus-4-8") return !1;
  return !UA();
}
var X3;
var Dv = T(() => { Qt(); r8(); s8(); c$(); Rq(); f4();
  X3 = v8((H) => {
    if (!H) return !1;
    if (xH(process.env.CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT)) return !0;
    if (k4(process.env.CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT)) return !1;
    return !c45(H) || d45(H);
  });
});
```
**Verdict:** PASS — matches the docs exactly: env-true ⇒ lean, env-false ⇒ full, then `!c45 || d45`;
`c45` full-list = `claude-3-*`/haiku/sonnet/opus-4-0..4-7, opus-4-8 ⇒ lean, unknown ⇒ `!UA()`; `d45`
force-lean via `clientDataCache.simple_system_prompt` OR `tengu_velvet_cascade.models`, additive-only.

### Sample 2 — `oXz` leanHarnessSection @ 555591-555607 (the target-fix symbol)

```js
function oXz(H) {
  let $ = "You are an interactive agent that helps users with software engineering tasks.";
  if (H !== null) $ = 'You are an interactive agent that helps users according to your "Output Style" below, …';
  return `\n${$}\n\n${gKq}\n\n# Harness\n - Text you output outside of tool use is displayed … Github-flavored markdown …\n - Tools run behind a user-selected permission mode; a denied call means the user declined it — adjust, don't retry verbatim.\n - \`<system-reminder>\` tags … injected by the harness … Hooks may intercept …\n - Prefer the dedicated file/search tools over shell … Independent tool calls can run in parallel …\n - Reference code as \`file_path:line_number\` — it's clickable.`;
}
```
**Verdict:** PASS — exactly one `# Harness` section with 6 lines (role line + 5 bullets), function spans
555591-555607 (closing brace at 555607). The task-mandated full range is correct and now cited completely
in every doc.

### Sample 3 — `N0` terminal lean/full swap @ 555650-555653

```js
return [
  ...(_ ? [oXz(f)]
        : [QXz(f), gXz(), f === null || f.keepCodingInstructions === !0 ? dXz() : null, cXz($), lXz(M), rXz()]),
  ...(K?.excludeDynamicSections ? [RFK($)] : []),
  ...(WMH() ? [et] : []),
  ...D,
].filter((X) => X !== null);
```
**Verdict:** PASS — one lean section vs six full builders, with `dXz` gated by `keepCodingInstructions`,
precisely as documented. `cKq()` short-circuit at 555615-555621 (CWD+Date) confirmed above the swap.

### Sample 4 — `uXz` / `mXz` polarity @ 555399-555417

```js
function uXz(H) { if (X3(H)) return "Write code that reads like the surrounding code: …"; return `# Text output …`; }
function mXz(H) { if (!X3(H)) return null; return "For actions that are hard to reverse or outward-facing, confirm first …"; }
```
**Verdict:** PASS — `uXz` returns the lean one-liner when `X3` true (full `# Text output` block otherwise);
`mXz` is the inverse polarity (text only under lean, `null` under full), exactly as the diff doc states.

### Sample 5 — v2.1.88 precursor / new-symbol absence

`src/constants/prompts.ts:450` — `if (isEnvTruthy(process.env.CLAUDE_CODE_SIMPLE)) { return [ …CWD…Date… ] }`
(the `cKq` precursor). `getSimpleIntroSection`@175, `getSimpleSystemSection`@186,
`getSimpleDoingTasksSection`@199, `getSimpleToneAndStyleSection`@430; `getSystemPrompt`@444 emits the full
6-section body at 560-576 with `keepCodingInstructions` gating Doing-tasks. A repo-wide grep for
`isLeanSystemPrompt`, `isFullPromptModel`, `isForcedLeanModel`, `velvet_cascade`, `simple_system_prompt`,
`SIMPLE_SYSTEM_PROMPT`, and `# Harness` returns **zero** matches.
**Verdict:** PASS — confirms "the per-model lean/full gate is NEW post-2.1.88; only `CLAUDE_CODE_SIMPLE`
(`cKq`) has a precursor; the full section builders carry forward from 2.1.88." HIGH confidence is justified.

---

## Fixes Applied

1. `lean_prompt_eligibility_gate.md:32` — `oXz` range `555591+` → `555591-555607` (full function; task-mandated).
2. `lean_prompt_eligibility_gate.md:567` — `oXz` range `555591-...` → `555591-555607` (full function; task-mandated).
3. `lean_vs_full_prompt_diff.md:40` — `z44` symbol ref `376250-376261` → `376250-376251` (function range;
   noted `Y0_`/`f0_` bodies at 376253-376261) and relabeled "Read/Todo" → "Todo" picker (single readable name).
4. `lean_vs_full_prompt_diff.md:603` — `z44` code-snippet Location `376250-376261` → `376250-376251`
   (picker; bodies at 376253-376261).
5. `lean_prompt_rationale_and_rollout.md:41` — `z44` range `376250-376257` → `376250-376251`.
6. `lean_prompt_rationale_and_rollout.md:548` — `z44` range `376250-376257` → `376250-376251`.

---

## Confidence Roll-Up

| Dimension | Result | Confidence |
|-----------|--------|------------|
| C1 Symbol existence | 27 / 27 PASS | HIGH |
| C2 Line/symbol pairing | 27 / 27 PASS | HIGH |
| C3 Range sanity | 24 / 24 PASS (3 loose ranges fixed) | HIGH |
| C4 Mapping conflicts | 0 (1 fixed) | HIGH |
| S1 Semantic spot-checks | 5 / 5 PASS | HIGH |
| v2.1.88 lineage claims | all confirmed (precursor present; gate symbols absent) | HIGH |

**Overall verdict: PASS (HIGH confidence).**

The module's core thesis is fully substantiated by the bundle: the lean/full split is a single memoized
predicate `X3` (`isLeanSystemPrompt`) = `!c45 || d45` with two env short-circuits, consumed at 21 sites,
centrally swapping the six full section builders for one `oXz` `# Harness` section. The `CLAUDE_CODE_SIMPLE`
(`cKq`) path is a genuine v2.1.88 precursor; the per-model lean gate, `-eap` bypass, force-lean
clientData/`tengu_velvet_cascade` channels, and `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT` env override are net-new
in the v2.1.154 window. The only defects were three loose/over-broad line ranges and one cross-doc readable
mislabel, all corrected in place. No symbol-mapping tables exist in the module docs.

### Residual minor notes (non-blocking, not changed)

- `Q88` (systemPromptBasePrefix) is cited as `143429-143444` in one symbol-ref bullet
  (`lean_vs_full_prompt_diff.md:43`) and `143429-143436` in its code snippet. The function body is
  143429-143436; 143437-143444 are its three string constants + the `g88` init. `Q88` is not a lean-gate
  symbol (explicitly "unaffected by X3") and is absent from the additions table, so this is a benign
  function-plus-constants span, not a contradiction. Left as-is.
- The `iXz` (session_guidance) and `RFK` helpers appear inside the `N0` snippet with descriptive readable
  names (`buildSessionGuidance`, `buildExcludedSectionsAttachment`/`staticEnvInfo`) but are not lean-specific
  and not in the additions table; out of module scope.
