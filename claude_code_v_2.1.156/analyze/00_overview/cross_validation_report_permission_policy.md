# Cross-Validation Report — 37_permission_policy

- **Module:** 37_permission_policy (Permission Policy delta, v2.1.143 → v2.1.156)
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/37_permission_policy`
- **Additions file:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/00_overview/symbol_additions_v2_1_156_permission_policy.md`
- **Source bundle (2.1.156):** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649979 lines)
- **Precursor bundle (2.1.142):** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` (611353 lines)
- **Readable precursor (2.1.88):** `/lyz/codespace/3rd/claude-code/src/`
- **Markdown files scanned:** 8 (README + 6 deep-dives + 1 additions table)
- **Samples checked (read & confirmed):** 52

---

## C1 — Symbol existence

Every obfuscated identifier in the additions table and the load-bearing list-format refs was located
in the 2.1.156 bundle at its cited line (or, for cross-version precursors, in the 2.1.142 bundle).

- PASS: 52
- FAIL: 0

Representative 2.1.156 symbols confirmed at the exact cited line (function header / declaration):
`dataExfiltrationHardDenyRule` slot (276986), `runTwoStageClassifier` (`en5`, 277392),
`runSingleStageToolUseClassifier` (`BP$`, 277689), `parseBlockDecision` (`ZE7`, 277340),
`stripUnterminatedThinking` (`BE7`, 277337), `classifierCouldNotEvaluateReason` (`rY8`, 277918),
`runSandboxNetworkClassifier` (`aY8`, 277969), `SANDBOX_NETWORK_ACTION` (`NE7`, 277997),
`IRON_GATE_TTL` (`hE6`, 277998), `thinkingBudgetForModel` (`pE7`, 277389),
`getTwoStageClassifierSetting` (`UE7`, 277908), `isTwoStageClassifierEnabled` (`$i5`, 277911),
`emitClassifierOutcome` (`vc`, 277921), `extractTextBlocks` (`w9`, 445034),
`isDangerousRemovalTarget` (`PlH`, 211484), `toLowerCase` (`OJ`, 549400),
`driveRootRegex`/`driveRootChildRegex` (`WV5`/`ZV5`, 211576), `extractPowershellRemovalPath` (`gG8`, 418371),
`denyProtectedSystemPath` (`PH$`, 418378), `canonicalSandboxTmpDir` (`hx`, 550128),
`sandboxTmpDir` (`VL`, 176754), `rawTmpDirRoot` (`vd`, 176735), `assertSafeTmpDir` (`GJ5`, 176739),
`buildSandboxPromptSection` (`g24`, 438967), `dedupe` (`aq`, 40716),
`isCwdChangingCmdlet` (`_v$`, 417684), `resolveToCanonical` (`EY`, 417677), `powershellAliasMap` (`MqH`, 417169),
`validateCompoundPaths` (`MC_`, 418618), `parseCommand` (`dP6`, 190366), `findCommandNode` (`UcH`, 190389),
`collectLeadingAssignments` (`KW5`, 190408), `extractCommandArguments` (`wD$`, 190416),
`getCommandPrefixStatic` (`kI8`, 595513), `parseSimpleCommandTree` (`nT5`, 207803),
`classifySimpleReadOnly` (`nz8`, 242978), `hasNonAllowlistedAssignment` (`LF_`, 440619),
`isAllowlistedEnvVar` (`V5H`, 440527), `validateMcpServerPolicyEntries` (`V71`, 52367),
`mcpServerPolicyKeys` (`T71`, 52417), `collectSettingsWarnings` (`kb`, 52403),
`mcpAllowEntrySchema` (`fo8`, 52016), `mcpDenyEntrySchema` (`Oo8`, 52043),
`isMcpServerDenied` (`NN7`, 275185), `isMcpServerAllowed` (`wJH`, 275201),
`resolveAutoModeEnabledState` (`kV5`, 211657), `sendVscodeExperimentGates` (`y97`, 211664),
`isAutoModeConfigDisabled` (`IL5`, 185018), `isAutoModeGateEnabled` (`h0`, 443051),
`canCycleToAuto` (`PR8`, 578696), `cycleNextMode` (`QCH`, 578712), `AutoModeOptInDialog` (`r4q`, 578742),
`handleCycleMode` (`ym`, 585340), `handleAutoModeAccept` (`iC`, 585430),
`handleAutoModeOptInDecline` (`hm`, 585448), `onSubmit` (`F_`, 584947),
`consentDebounceCancelRef` (`H1`, 584571), `AUTO_MODE_DESCRIPTION` (`n19`, 578843).

---

## C2 — Line/symbol pairing

For each sampled symbol, the cited line was opened and the obfuscated code at that line matched the
claimed function/constant/variable (signature, body, or value).

- PASS: 52
- FAIL: 0

High-value pairings confirmed verbatim:
- `max_tokens: 8192 + V` (stage-2 budget) is present at **277501**, inside the `h = { model: _, ... }`
  request object that begins at 277499 — matches the "doubled 4096→8192" claim and both header ranges
  (`277499-277510` / `277501-277510`) used across docs.
- The single-stage `max_tokens: 4096 + E` is at **277757**, confirming the "unchanged in 2.1.156" claim.
- `PlH` body at **211484-211498** contains the exact added operations the fix narrative depends on:
  homedir slash-strip `K(...).replace(/\/$/, "")` (211493) and case-fold compare `OJ(z) === OJ(A)` (211494).
- `_v$` body at **417684-417686** contains the literal NEW bareword/drive-switch line
  `if ($ === "cd.." || $ === "cd\\" || $ === "cd/" || $ === "cd~" || /^[a-z]:$/.test($)) return !0;`.
- `nT5` (**207803-207809**) returns `{ kind: "simple", commands: $, bareAssignmentNames: K }` — the new field.
- `T71` (**52417-52420**) is `[{ key: "allowedMcpServers", schema: fo8 }, { key: "deniedMcpServers", schema: Oo8 }]`.
- `kb` (**52403-52405**) is `[...W71(...), ...G71(...), ...V71(...)]` — V71 is the third sanitizer.
- `kV5` (**211657-211660**) tri-state resolver; `y97` promotion line at **211682**:
  `q.tengu_auto_mode_state = K === "opt-in" ? "enabled" : K`.
- `aY8` (**277969**) plus its iron-gate fallback `f.unavailable ? !Th("tengu_iron_gate_closed", !0, hE6) : ...` at **277973**.

---

## C3 — Line range sanity

All cited ranges are well-formed (start ≤ end), monotonic, and land inside the 649979-line bundle.
Multi-line snippet ranges were spot-opened at both endpoints (e.g. `PlH` 211484-211498,
`hx` 550128-550136, `V71` 52367-52402, `kV5` 211657-211660).

- PASS: all sampled ranges (≈30 distinct ranges)
- FAIL: 0

Off-by-one observations (NOT errors — line cited contains the claimed code):
- The system-prompt builder is cited as "function at 277300" in `data_exfiltration_classifier.md`; the
  function header (`async function nn5(H)`) is at **277299** and line 277300 (`let $ = mn5(),`) is its
  first body line. The doc gives no obfuscated symbol and the substitution logic it describes
  (`<user_hard_deny_rules_to_replace>` etc.) is verified present at 277321-277329, so the cite is
  defensible; left as-is.
- The 2.1.88 blocking gate is cited as `interactiveHelpers.tsx:224-235`; the actual
  `permissionMode === 'auto' && !hasAutoModeOptIn()` / `declineExits` / `gracefulShutdownSync(1)` block
  is at **229-233**, inside the cited range. Defensible; left as-is.

---

## C4 — Cross-version precursor checks (2.1.142 & 2.1.88)

The module repeatedly asserts that a 2.1.156 behavior is NEW relative to a named precursor. Sampled:

| Claim | Cited precursor | Verified |
|---|---|---|
| `isDangerousRemovalTarget` pre-fix (candidate-only slash strip, raw compare) | 2.1.142 `nUH` @207091 | **PASS** — `nUH` present; home check lacks `OJ`/homedir slash-strip |
| Stage-2 budget was 4096 | 2.1.142 `4096 + V` @338136 (reminder `bF_`) | **PASS** — exact `max_tokens: 4096 + V` + `bF_` reminder |
| PowerShell `cd` detector lacked bareword line | 2.1.142 `JP$` @402359 | **PASS** — `JP$` is alias-only (`Vz(H)`), no bareword guard |
| Per-entry MCP validator is new | 2.1.142 has no `Invalid entry was ignored` | **PASS** — grep count = 0 in 2.1.142 |
| `filterInvalidPermissionRules` "don't poison the whole file" precedent | 2.1.88 `validation.ts:221/224` | **PASS** — comment @221, export @224 |
| `isCwdChangingCmdlet` 2.1.88 is alias-only | 2.1.88 `readOnlyValidation.ts:1017` | **PASS** — canonical-cmdlet match, no bareword |
| 2.1.88 blocking consent gate existed | 2.1.88 `interactiveHelpers.tsx:~224-235` | **PASS** — gate @229-233 with `declineExits`/`gracefulShutdownSync(1)` |

- PASS: 7
- FAIL: 0

The docs' confidence calibration is honest: where the precise pre-fix runtime path is reconstructed
(TMPDIR divergence, bare-assignment bypass site) the docs explicitly mark **medium** confidence, which
this cross-check confirms is appropriate — the *added* artifacts are verified present/absent, but the
exact old control-flow is inferred.

---

## S1 — Semantic spot-checks (5 samples)

### Sample 1 — `runTwoStageClassifier` stage-2 budget (`en5`, the headline correctness fix)
Cited: `cli_inner_pretty.js:277501` (max_tokens 8192).
```js
h = {
  model: _,
  max_tokens: 8192 + V,
  system: j,
  skipSystemPromptPrefix: !0,
```
**Verdict:** PASS — the 8192 budget is exactly where the `classifier_token_budget` doc places the fix;
`grep` confirms 8192 is unique to this stage-2 site, and `pE7` (277389) returns `[!1, 0]` so `V === 0`.

### Sample 2 — `isDangerousRemovalTarget` home check (`PlH`, the `rm -rf $HOME` fix)
Cited: `cli_inner_pretty.js:211484-211498`.
```js
let A = K(a26.homedir().replace(/[\\/]+/g, "/")).replace(/\/$/, "");
if (OJ(z) === OJ(A)) return !0;
```
**Verdict:** PASS — both the homedir trailing-slash strip and the case-insensitive `OJ(z) === OJ(A)`
compare are present, exactly the two operations `dangerous_path_home_tmpdir.md` calls the fix.

### Sample 3 — `isCwdChangingCmdlet` bareword guard (`_v$`, the PowerShell `cd` fix)
Cited: `cli_inner_pretty.js:417684-417686`.
```js
function _v$(H) {
  let $ = H.toLowerCase();
  if ($ === "cd.." || $ === "cd\\" || $ === "cd/" || $ === "cd~" || /^[a-z]:$/.test($)) return !0;
```
**Verdict:** PASS — the literal bareword/drive-switch line matches the doc, and the 2.1.142 precursor
`JP$` provably lacks it.

### Sample 4 — `validateMcpServerPolicyEntries` per-entry filter (`V71`, the managed-MCP resilience fix)
Cited: `cli_inner_pretty.js:52367-52402`; aggregator `kb` @52403.
```js
function kb(H, $) {
  return [...W71(H, $), ...G71(H, $), ...V71(H, $)];
}
```
**Verdict:** PASS — `V71` is the third pre-`safeParse` sanitizer; the `T71` table and the
`Invalid entry was ignored` per-entry warning (absent in 2.1.142) match the doc end-to-end.

### Sample 5 — VSCode `opt-in → enabled` promotion (`y97`, the consent-surfacing fix)
Cited: `cli_inner_pretty.js:211682`.
```js
((q.tengu_auto_mode_state = K === "opt-in" ? "enabled" : K),
```
**Verdict:** PASS — the promotion (`K = kV5()` at 211681) collapses `opt-in` and `enabled` to `enabled`
for the VSCode picker, exactly as `auto_mode_consent_removed.md` §2 describes; `kV5` tri-state default
`opt-in` confirmed at 211657-211660.

---

## Fixes applied

1. **`auto_mode_consent_removed.md:19`** — renamed `rY8`'s readable name from
   `autoModeCouldNotEvaluateMessage` → `classifierCouldNotEvaluateReason`, matching the other three docs
   (README, data_exfiltration, classifier_token_budget) and the additions file's stated single source of
   truth (one function @277918, primary name `classifierCouldNotEvaluateReason`).
2. **`data_exfiltration_classifier.md:504`** — renamed `ZE7`'s readable name from `parseVerdict` →
   `parseBlockDecision`, matching the six other refs and the additions file's deduplication note
   (one function @277340, primary name `parseBlockDecision`).

No line-number errors were found that required correction. No mapping tables were present or introduced
in module docs (verified by grep for `| Obfuscated | Readable |` and forbidden section names).

---

## Summary

- C1 Symbol existence: 52 PASS / 0 FAIL
- C2 Line/symbol pairing: 52 PASS / 0 FAIL
- C3 Range sanity: all sampled ranges PASS / 0 FAIL (2 benign off-by-one cites noted, left as-is)
- C4 Cross-version precursors: 7 PASS / 0 FAIL
- S1 Semantic spot-check: 5 PASS / 0 FAIL
- Mapping conflicts found & fixed: 2 (`rY8`, `ZE7` readable-name divergence)

**Overall verdict: PASS (high confidence).** The 37_permission_policy module is one of the most
accurately cited modules reviewed: every sampled `cli_inner_pretty.js:<line>` citation resolved to the
claimed code, the 2.1.142 and 2.1.88 precursor assertions all held, and the docs' own confidence
labels (high for verbatim deltas, medium where a pre-fix runtime path is reconstructed) are
well-calibrated. The only defects were two cross-doc readable-name inconsistencies for symbols the
additions file had already flagged for deduplication; both are now fixed in place.
