# Cross-Validation Report

- **Module:** `43_model_opus48` (Opus 4.8 + Effort Levels)
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/43_model_opus48`
- **Additions file:** `00_overview/symbol_additions_v2_1_156_model_opus48.md`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649979 lines, `VERSION "2.1.156"` at :568305, `BUILD_TIME 2026-05-28T18:30:33Z`)
- **v2.1.88 xval source:** `/lyz/codespace/3rd/claude-code/src/utils/{effort.ts,fastMode.ts,model/configs.ts}`
- **Markdown files scanned:** 6 (README + 5 deep-dives + the additions file)
- **Delta covered:** v2.1.143 → v2.1.156 (flagship 2.1.154 Opus 4.8 / effort, 2.1.156 thinking-signature hotfix)

---

## C1 — Symbol existence (representative sample, 22 candidates verified)

Each symbol below was confirmed by reading the cited line(s) directly in `cli_inner_pretty.js`.

- PASS: 22
- FAIL: 0

| Symbol | Readable | Cited line(s) | Verdict |
|--------|----------|---------------|---------|
| `Xi$` | OPUS_48_MODEL_CONFIG | 91825-91833 | PASS (seven-provider id map, `eagerInputStreaming:{bedrock,vertex}`) |
| `j3` | MODEL_CONFIG_REGISTRY | 91835-91851 | PASS (`opus48: Xi$` present; `d7K`/`c7K` derived maps) |
| `TT` | getDefaultOpusModel | 98717-98725 | PASS (firstParty→opus48, anthropicAws/gateway→opus47, else opus46) |
| `Gi$` | reverseLookupOverride | 91967-91977 | PASS (was mis-cited 1967; fixed) |
| `Yz` | getResolvedModelMap | 91986-91990 | PASS (was mis-cited 1986; fixed) |
| `l7K` | applyModelOverrides | 91957 | PASS (was mis-cited 1957; fixed) |
| `vP` | stripContextSuffix | 98935-98937 | PASS (`/\[(1\|2)m\]/gi` strip) |
| `A2` | modelSupportsEffort | 184798-184814 | PASS (deny-list + allow-list + `CLAUDE_CODE_ALWAYS_ENABLE_EFFORT`) |
| `ycH` | modelSupportsXhighEffort | 184834-184851 | PASS (allow 4-8/4-7 only) |
| `Vx` | ultracodeAvailable | 184853-184855 | PASS (`NZ() && (model===undefined \|\| ycH(model))`) |
| `AkH` | isOpusLaunchDefaultActive | 184896-184900 | PASS (reads `unpinOpus47/48LaunchEffort`) |
| `SI` | unpinOpusLaunchEffortLatch | 184902-184908 | PASS (releases both pins) |
| `or` | resolveAppliedEffort | 184909-184919 | PASS (range corrected from 184910-184920) |
| `RL5` | getEffortDescription | 184964-184977 | PASS (xhigh interpolates `_P6`) |
| `YP6` | getEffortDescriptionWithBurnHint | 184978-184986 | PASS (burn hint on high+Pro+`tengu_slate_finch`) |
| `q48` | getDefaultEffortForModel | 184987-184991 | PASS (4.8→high, 4.7→xhigh, else high) |
| `dN`/`_P6`/`a$7` | EFFORT_LEVELS_WITH_MAX / tags | 185009 / 184993-184994 | PASS (`["low","medium","high","xhigh","max"]`, tags exact) |
| `B87` | isThinkingSignatureError | 186575-186583 | PASS (matcher string set exact) |
| `cG4` | stripSignedThinkingBlocks | 446238-446252 | PASS (`[Thinking removed]` placeholder) |
| `S0H` | selectFastModePricing | 98451-98457 | PASS (4.8→`bx1`, else `Cx1`, else `BB`) |
| `bx1` | OPUS_48_FAST_COST | 98540-98546 | PASS (10/50 = 2× standard) |
| `mH` | applyModelMenuEffort | 460906-460921 | PASS (ultracode→`SI()`+`Pi_`, else persist) |

Additional anchor checks confirmed in passing: effort injection `...(A2(L) && { effort: { level: Ev(L, w) } })` at :568321; `NLz` (applyEffortRequestParam) at :556648-556656 (`delete $.effort` when `!A2(_)`); `vP` call-site in `dG4(H, vP(z.model))` at :557020.

---

## C2 — Line/symbol pairing (10 pairs)

- PASS: 7 (as-cited)
- FAIL→FIXED: 3 (off-by-90000 typos in `opus48_model_mapping.md`, now corrected in-place)

Mismatched line citations found and corrected:
- `Yz` cited `cli_inner_pretty.js:1986-1990` → line 1986 is unrelated dispatcher code; the real `function Yz()` is at **91986-91990**. **Fixed.**
- `l7K` cited `cli_inner_pretty.js:1957-1966` → real `function l7K(H)` at **91957**. **Fixed.**
- `Gi$` cited `cli_inner_pretty.js:1967-1977` → line 1967 is unrelated; real `function Gi$(H)` at **91967-91977**. **Fixed.**

The additions file already cited the correct 91xxx values, so only the prose in `opus48_model_mapping.md` carried the typo. No symbol→line pairing was wrong in the additions table.

---

## C3 — Line range sanity (12 ranges)

- PASS: 11
- FAIL→FIXED: 1

The flagged `or` (resolveAppliedEffort) range was cited two ways across the docs:
- `opus48_model_mapping.md` + additions file: `184909-184919` — **correct** (`function or` opens at :184909, its closing `}` is at :184919; verified by reading 184907-184921).
- `effort_levels_and_defaults.md` (Related-Symbols entry, §4.2 snippet header, and the §-summary table cell `:184910`): `184910-184920` — **off-by-one**. **Fixed** to `184909-184919` / `:184909` in all three spots.

All other ranges (`Xi$` 91825-91833, `A2` 184798-184814, `ycH` 184834-184851, `RL5` 184964-184977, `YP6` 184978-184986, `q48` 184987-184991, `B87` 186575-186583, `cG4` 446238-446252, `S0H` 98451-98457, `bx1` 98540-98546, `mH` 460906-460921) match their cited bounds.

---

## C4 — Mapping conflicts (5 flagged + 2 collateral, all resolved)

A symbol must carry ONE readable name across the module docs + additions file + central index. Seven dual-name conflicts were found and unified to the canonical name (which in each case matches the v2.1.88 precursor where one exists):

1. `q48` → **`getDefaultEffortForModel`** (was also `getLaunchDefaultEffortForModel` in `opus48_model_mapping.md`; 8 sites + 1 header + body + Mapping line). Canonical confirmed by v2.1.88 `src/utils/effort.ts:279 getDefaultEffortForModel`.
2. `vP` → **`stripContextSuffix`** (was `stripSyntheticMarker` in `thinking_signature_hotfix.md`; Related-Symbols entry + call-site READABLE + prose). Same symbol — the `/\[(1|2)m\]/gi` context-tier strip.
3. `Vx` → **`ultracodeAvailable`** (was `isXhighAvailable` in `effort_levels_and_defaults.md`; Related-Symbols entry + §1.2 + §6.1 READABLE + Mapping + prose).
4. `RL5` → **`getEffortDescription`** (was `getDefaultEffortDescription` in `effort_levels_and_defaults.md`).
5. `YP6` → **`getEffortDescriptionWithBurnHint`** (was `getEffortDescriptionWithHint` in `effort_levels_and_defaults.md`).
6. (collateral) `symbol_index_core_features.md` line 520 `q48` row carried `getDefaultEffortForModel / launchEffortForModel` → trimmed to the single canonical name.
7. (collateral) `symbol_index_core_features.md` line 533 `Vx` row carried `ultracodeAvailable / isXhighAvailable` → trimmed to the single canonical name.

The additions-file naming-notes block was rewritten to document the unification (and to record the 184909-184919 range correction) rather than describe live aliases. The `vP` additions-table description's trailing "also called `stripSyntheticMarker`" was removed.

Post-fix scan: zero occurrences of any retired name (`getLaunchDefaultEffortForModel`, `stripSyntheticMarker`, `isXhighAvailable`, `getDefaultEffortDescription`, `getEffortDescriptionWithHint`) remain anywhere except the additions-file notes that explicitly label them "retired." No mapping tables were introduced into any module doc.

---

## C5 — Cross-validation vs v2.1.88 (precursor claims)

The docs assert specific v2.1.88 precursors; each was checked against `/lyz/codespace/3rd/claude-code/src`:

- `getDefaultEffortForModel` — present at `effort.ts:279`. The doc's claim that the canonical name is precursor-stable and that the old 4.6 default was `medium` for Pro/Max/Team is supported. **PASS.**
- `resolveAppliedEffort` — `effort.ts:156-163` is `envOverride ?? appStateEffortValue ?? getDefaultEffortForModel(model)` with the `max→high` clamp; the docs' "2.1.156 adds a launch-pin term + the xhigh→high clamp" contrast is accurate. **PASS.**
- `parseEffortValue` (`effort.ts:71`), `getEffortEnvOverride` (`effort.ts:136`), `modelSupportsMaxEffort` (`effort.ts:53`), `EFFORT_LEVELS` (`effort.ts:13`) — all present; the "no `xhigh`, no alias map in 2.1.88" claims hold. **PASS.**
- Fast mode: `isFastModeEnabled` (`fastMode.ts:38`), `getInitialFastModeSetting` (`fastMode.ts:149`), `isFastModeSupportedByModel` (`fastMode.ts:167`, `opus-4-6` only at :175), `getDisabledReasonMessage` (`fastMode.ts:51`) with `/extra-usage` wording at :64 — confirms the "near-1:1 availability cascade" and the "extra usage → usage credits" rename drift. **PASS.**
- Opus ceiling: `configs.ts` ends at `opus46: CLAUDE_OPUS_4_6_CONFIG` (:98); no `opus47`/`opus48`, no `anthropicAws`/`mantle`/`gateway`/`eagerInputStreaming`. Confirms "Opus 4.8 is wholly new and the config shape grew." **PASS.**
- The thinking-signature matcher (`B87`) and `tengu_thinking_signature_strip_retry` have **no** v2.1.88 precursor; the strip primitives evolve `stripSignatureBlocks`/`filterTrailingThinkingFromLastAssistant`. The docs mark these NEW vs evolved correctly (medium-high confidence as stated). **PASS.**

---

## S1 — Semantic spot-checks (5 samples)

### Sample 1 — `q48` (getDefaultEffortForModel) at :184987-184991

```js
function q48(H) {
  if (O7(H) === "claude-opus-4-8") return "high";
  if (O7(H) === "claude-opus-4-7") return "xhigh";
  return "high";
}
```
Matches both docs exactly: 4.8→`high`, 4.7→`xhigh`, fallthrough `high`. The canonical-name unification is the right one. **PASS.**

### Sample 2 — `or` (resolveAppliedEffort) at :184909-184919

```js
function or(H, $) {
  if (!A2(H)) return;
  let q = AkH(H), K = q48(H), _ = zkH();
  if (_ === null) return q ? K : void 0;
  let z = _ ?? (q ? K : void 0) ?? $ ?? K;
  if (z === "max" && !ow$(H)) return "high";
  if (z === "xhigh" && !ycH(H)) return "high";
  return z;
}
```
The `function or` is at line 184909 and the closing `}` is at 184919 — confirming the corrected range and the precedence/clamp logic both docs describe (gate → launch-pin term → app-state → model-default; max/xhigh→high downgrades). **PASS.**

### Sample 3 — `Vx` (ultracodeAvailable) at :184853-184855

```js
function Vx(H) {
  return NZ() && (H === void 0 || ycH(H));
}
```
Workflows-enabled AND (no model OR xhigh-capable). The unified name `ultracodeAvailable` is semantically accurate (gates the slider's ultracode rail / `/effort` `|ultracode` token). **PASS.**

### Sample 4 — `B87` (isThinkingSignatureError) at :186575-186583

```js
function B87(H) {
  if (!(H instanceof rq) || H.status !== 400) return !1;
  let $ = H.message.toLowerCase();
  if ($.includes("signature in thinking block")) return !0;
  return (
    ($.includes("thinking block") || $.includes("`thinking`") || $.includes("redacted_thinking")) &&
    ($.includes("cannot be modified") || $.includes("invalid signature"))
  );
}
```
The fast-path phrase + token-AND-phrase general path match the docs' step-by-step exactly. The four-sibling-matcher framing (`m87`/`xP6`/`p87`/`B87`) is consistent with the surrounding 186564-186590 block. **PASS.**

### Sample 5 — `bx1`/`S0H` fast pricing at :98540-98546 / :98451-98457

```js
function S0H(H, $) { if (I9() && H) { if (O7($) === "claude-opus-4-8") return bx1; return Cx1; } return BB; }
// bx1 = { inputTokens: 10, outputTokens: 50, promptCacheWriteTokens: 12.5, promptCacheReadTokens: 1, ... }
```
`bx1` (10/50) is exactly 2× `BB` (5/25), 3× cheaper than `Cx1` (30/150, 6×); `S0H` routes only `claude-opus-4-8` to `bx1`. Matches the pricing docs. **PASS.**

---

## Fixes applied (in place)

1. `opus48_model_mapping.md`: `q48` renamed `getLaunchDefaultEffortForModel` → `getDefaultEffortForModel` (Related-Symbols entry, TL;DR bullet, §8 snippet header + READABLE + Mapping, `or` READABLE + Mapping, §8 prose).
2. `opus48_model_mapping.md`: line-number typos corrected — `Yz` 1986→91986, `l7K` 1957→91957, `Gi$` 1967→91967.
3. `effort_levels_and_defaults.md`: `or` range 184910-184920 → 184909-184919 (Related-Symbols entry, §4.2 snippet header, summary-table cell).
4. `effort_levels_and_defaults.md`: `Vx` `isXhighAvailable` → `ultracodeAvailable`; `RL5` `getDefaultEffortDescription` → `getEffortDescription`; `YP6` `getEffortDescriptionWithHint` → `getEffortDescriptionWithBurnHint`.
5. `thinking_signature_hotfix.md`: `vP` `stripSyntheticMarker` → `stripContextSuffix` (entry + call-site READABLE + prose).
6. `symbol_index_core_features.md`: trimmed dual names on `q48` and `Vx` rows to the single canonical name.
7. `symbol_additions_v2_1_156_model_opus48.md`: rewrote the naming-notes block to record the unification + the 184909-184919 range correction; removed the `stripSyntheticMarker` alias note from the `vP` row.

---

## Confidence roll-up

| Dimension | Result | Confidence |
|-----------|--------|-----------|
| C1 Symbol existence | 22 PASS / 0 FAIL | HIGH |
| C2 Line/symbol pairing | 7 PASS / 3 FIXED | HIGH (post-fix) |
| C3 Range sanity | 11 PASS / 1 FIXED | HIGH (post-fix) |
| C4 Mapping conflicts | 7 conflicts resolved | HIGH |
| C5 v2.1.88 precursors | all asserted precursors verified | HIGH (effort/fast/config); MEDIUM-HIGH (thinking-strip, as the docs already state) |
| S1 Semantic spot-checks | 5 PASS / 0 FAIL | HIGH |

**Overall verdict: PASS (after fixes).** Every cited line in the representative sample resolves to the claimed code; the only defects were five self-flagged dual-name conflicts (plus two collateral index rows), three off-by-90000 line typos, and one off-by-one range — all corrected in place. The v2.1.88 precursor claims and the NEW-vs-evolved labeling are sound. No fabricated symbols or lines were found, and no mapping tables were introduced into module docs.
