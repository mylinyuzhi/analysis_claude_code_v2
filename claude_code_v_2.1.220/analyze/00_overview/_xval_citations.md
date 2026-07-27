# Cross-Validation Pass: Citation Accuracy of the 111 Module Documents

> TARGET: `…/2.1.220/extract/cli_inner_pretty.js` — every bare `:<line>` here is a **2.1.220** line I read.
> BASELINE: `…/2.1.193/extract/cli_inner_pretty.js`, always tagged **(193)**.
> Scope: the 111 module docs under `04_tools/` … `57_api_reliability/`. `00_overview/` is excluded
> (its four `symbol_index_*.md` files were sampled separately: 400 rows, 1 error, 0.25%).

**Headline: 289 prose/snippet citations sampled across all 26 theme dirs → 6 defects → 2.08%.
Of those, 2 are "wrong function" errors (0.69%); 4 are ±1–2-line boundary slop.
A separate *exhaustive* mechanical audit of all 2,191 symbol-anchored citations found 6 more
gross mis-anchors that random sampling had missed. Total confirmed defects in this pass: 14
(12 line citations + 2 count claims).**

The prior tree's cross-validation budgeted 2–3%. The measured 2.08% sits at the bottom of that band,
and the *material* rate (0.69%) is only ~2.8× the mechanically-sampled symbol-index rate. Prose
citations are looser than table rows, as predicted — but the looseness is almost entirely
**range-boundary slop**, not wrong content.

---

## 1. Methodology

### 1.1 Citation population

Two distinct citation forms exist in the tree, and they had to be extracted separately:

| Form | Example | Population | Sampled |
|---|---|---|---|
| **Full-form** | `` cli_inner_pretty.js:412983-412989 `` | 694 | 185 (26.7%) |
| **Bare** | `` `:513862` ``, `` `:460212 (193)` `` | 13,296 | 104 (0.8%) |
| **Total** | | 13,990 | **289** |

Bare `:<line>` citations are **95% of the population** and were the higher-risk class going in
(they carry no file name, so an unqualified reader cannot tell 220 from 193 without the doc's
convention header). They were sampled at 4 per theme dir; full-form citations were sampled
proportionally with a floor of 5 per theme dir.

Distribution of the full-form sample matched the population by syntactic context
(`// Location:` headers 492/135, `Related Symbols` list rows 121/28, in-snippet `// Mapping:`
comments 59/15, running prose 22/7), so the sample is not biased toward the easiest class.

### 1.2 Verification procedure

For each sampled citation:

1. Read the cited line(s) in the **correct** bundle — 220 by default, 193 when the citation carries
   a `(193)` tag or sits under a `2.1.193` label.
2. Read ±3 lines of surrounding doc prose to recover the claim the line is attached to.
3. Classify `OK` / `OFF_BY_N` / `WRONG_SITE` / `CLAIM_UNSUPPORTED`.

**Two extraction traps found while building the tooling** (these are *my* tooling bugs, not doc
defects, but they are worth recording because the next auditor will hit them):

- Multi-range citations put the `(193)` tag after the *last* range:
  `cli_inner_pretty.js:436015-436019, 436063-436065 (193)`. A naive regex tags the first range as 220
  and then "discovers" a phantom mismatch. 1 instance.
- Three citations use the form `// ORIGINAL (2.1.193, cli_inner_pretty.js:149557-149571):` with no
  `(193)` suffix at all. All three verified correct against the 193 bundle
  (`45_skills/skill_loading_and_stacking.md:378,431`, `45_skills/skill_context_fork_background.md:360`).

### 1.3 Exhaustive mechanical audit (full population, not a sample)

Independently of the random sample, every citation of the shape ``(`SYMBOL`, `:NNNN`)`` — 2,191 of
them — was checked mechanically: does `SYMBOL` literally occur within ±3 lines of the cited line in
the correct bundle? 32 survived the automated check and were triaged by hand; 26 were legitimate
(readable-name-not-obfuscated-name citations, or a citation to a specific *line inside* a named
function). **6 were genuine mis-anchors** — all of them ≥4 lines off, i.e. exactly the class random
sampling at 2% coverage is least likely to catch.

### 1.4 Count claims

916 count claims of the form `` `literal` 220=N / 193=M `` were extracted; 45 were sampled and
re-run with **`grep -cF`** (not `grep -c` — the tree already carries one false carryover from regex
metacharacters in `workflow.run_id`). 4 raw mismatches; 3 of those were extraction artifacts where
my regex grabbed the wrong backticked token (`.218`, `, `, and a prose paraphrase containing `…`).
Those 3 were re-run against the intended literal and all reproduced exactly
(`useAutoModeDuringPlan` 11/11, `keepInPlaceIds` 2/2, `replaceAll("Opus 5"` 1/0). **1 genuine
mismatch out of 42 valid claims (2.4%)** — plus a second found by targeted follow-up on the same
sentence.

---

## 2. Measured error rate

### 2.1 Overall

| Metric | Value |
|---|---|
| Line citations sampled | **289** |
| Defects | **6** |
| **Error rate** | **2.08%** |
| — of which *material* (cited line is in a different function than the claim names) | 2 → **0.69%** |
| — of which *boundary slop* (right symbol, ±1–2 lines, or a range clipped) | 4 → 1.38% |
| Count claims sampled (valid) | 42 |
| Count-claim defects | 1 → **2.4%** |
| Exhaustive symbol-anchor audit | 2,191 checked → 6 gross mis-anchors → **0.27%** |

### 2.2 Per-theme breakdown

Sample = full-form draw + 4 bare draws per theme.

| Theme dir | Sampled | Defects | Rate | Notes |
|---|---|---|---|---|
| 04_tools | 15 | 0 | 0% | |
| **05_plan_mode** | 9 | **1** | **11.1%** | material — `Iif` (193) off by 2 |
| 07_compact | 9 | 0 | 0% | |
| 30_agent_team | 10 | 0 | 0% | |
| 31_auto_memory | 9 | 0 | 0% | |
| 36_background_agents | 10 | 0 | 0% | |
| 38_permissions | 9 | 0 | 0% | |
| **39_mcp** | 34 | **2** | **5.9%** | 1 material (`Ten`), 1 off-by-1 (`Yar`) |
| **40_system_prompt** | 9 | **1** | **11.1%** | range start off by 1 |
| **41_hooks** | 9 | **1** | **11.1%** | range under-reach |
| **42_workflow** | 10 | **1** | **10.0%** | range over-reach +1 |
| 43_slash_commands | 10 | 0 | 0% | |
| 44_telemetry | 14 | 0 | 0% | |
| 45_skills | 13 | 0 | 0% | (2 count defects found separately) |
| 46_todo_tasks | 9 | 0 | 0% | |
| 47_models | 12 | 0 | 0% | |
| 48_accessibility_ui | 10 | 0 | 0% | (1 mis-anchor found by the exhaustive audit) |
| 49_sandbox | 9 | 0 | 0% | |
| 50_performance | 9 | 0 | 0% | |
| 51_headless_sdk | 10 | 0 | 0% | |
| 52_code_review | 9 | 0 | 0% | |
| 53_subagent_limits | 10 | 0 | 0% | |
| 54_remote_control | 9 | 0 | 0% | |
| 55_auth_providers | 9 | 0 | 0% | |
| 56_chrome_ide | 9 | 0 | 0% | |
| 57_api_reliability | 14 | 0 | 0% | (1 mis-anchor found by the exhaustive audit) |
| **Total** | **289** | **6** | **2.08%** | |

**Read the per-theme column with care.** At n≈9–10 per theme, a single defect reads as 10–11%. The
only theme with enough sample depth to say anything is `39_mcp` (n=34, 5.9%) — and its two defects
are adjacent list rows in the *same* `Related Symbols` block, so they are one authoring event, not a
theme-wide quality difference. The honest statement is: **no theme dir is measurably worse than the
others at this sample depth.** The exhaustive symbol audit (§1.3), which has 100% coverage, spreads
its 6 findings across 5 different themes — the same conclusion.

---

## 3. Every defect found

### 3.1 Material — the cited line is in a different function than the claim names

| Doc file:line | Cited | Class | Correct value |
|---|---|---|---|
| `39_mcp/oauth_timeouts_and_reconnect.md:468` | 220:293357 | WRONG_SITE | **293359** — `function Ten(e, t) {`. 293357 (`return n !== void 0 ? Math.min(Math.max(n, CKu), PKu) : CKu;`) is the **last line of `Nvs`**, the function cited on the row immediately above |
| `39_mcp/oauth_timeouts_and_reconnect.md:466` | 220:58768 | WRONG_SITE | **58739** — `dHh = 300000,`. 58768 is `.number()` inside the `yWl` zod schema cited on the row above; the author read 58766 for `yWl` and stepped 2 lines for the constant |
| `57_api_reliability/transport_errors.md:486` | 220:283117 | WRONG_SITE | **283121** — `(vZr = new Set([`. 283117 is `qWe();` (a module-init call). The sibling claim `pSs` `:283135` on the same row is correct |
| `48_accessibility_ui/vim_and_input.md:1076` | 220:454804 | WRONG_SITE | **454833** — `async function* IUs() {`. 454804 is `async function* yPo() {`, a *different* generator. Note the doc's description ("async generator over `history.jsonl`") actually describes `yPo`; `IUs` is a one-line wrapper `for await (let e of yPo()) yield await fPo(e)` |
| `41_hooks/hook_trust_and_origin.md:306` | 220:520497 | WRONG_SITE | `skillRoot` does not occur anywhere near 520497 (`H.hook.type === "http" \|\|`, inside an `if:`-predicate filter). The field lives at **215745**, **215755-215756**, **215781** |
| `05_plan_mode/bash_bypass_and_classifier_212_218.md:62` | 193:460212 | OFF_BY_2 | **460214** — `function Iif(e, t, n) {`. 460212 is `return o;`, the last statement of `Lyl` — the *other* function cited in the same sentence. The sibling `Lyl` `:460180 (193)` is correct |
| `05_plan_mode/README.md:229` | 193:460212 | OFF_BY_2 | **460214** — same error, propagated to a second doc |
| `45_skills/README.md:204` | 220:277771 | OFF_BY_8 | **277763** — `async function Ggy() {`. 277771 is `n = new Set();` inside the body |
| `45_skills/plugin_config_and_security.md:938` | 220:277771 | OFF_BY_8 | **277763** — same error, propagated to a second doc |

### 3.2 Boundary slop — right symbol, wrong edge

| Doc file:line | Cited | Class | Correct value |
|---|---|---|---|
| `39_mcp/errors_and_diagnostics.md:615` | 220:266811 | OFF_BY_1 | **266810** — `function Yar(e) {`. 266811 is the one-line body, which *does* show the blank-URL predicate the row describes; only the declaration-line convention is broken |
| `41_hooks/hook_trust_and_origin.md:103` | 220:342023-342045 | range under-reach | The snippet under this header also prints `OTo`, which starts at **342046**. The range covers `MTo` (342023), `U$y` (342029), `vdd` (342033) and `Edd` (342038) but stops one function short of what is shown |
| `42_workflow/workflow_runtime_and_ui.md:1176` | 220:728557-728581 | range over-reach +1 | `Q9a` ends at **728580**; 728581 is `function qii(e, t) {` |
| `40_system_prompt/reminder_framing_and_human_origin.md:247` | 193:599351-599356 | range start OFF_BY_1 | **599350** — `function DQl(e) {`, which the snippet itself prints. 599351 is the first line of the returned template |

### 3.3 Count claims that do not reproduce

Both sit in the same sentence, `45_skills/plugin_config_and_security.md:592-593`:

| Claim | Doc says | `grep -cF` says | Note |
|---|---|---|---|
| `already handled by` | 220=1 / 193=1 | 220=1 / **193=2** | The second 193 hit is **193:506671** — an English sentence inside a bundled skill prompt ("…already handled by the standard build/test workflow…"), not code. Coincidental prose collision |
| `Failed to initialize LSP server` | 220=1 / 193=1 | **220=4 / 193=3** | 220: `:307227`, `:307228`, `:307560`, `:307561`; 193: `:298359`, `:298699`, `:298700`. **This one matters:** the extra 220 occurrence at `:307227` is a *new* `Jee(I, "Failed to initialize LSP server")` error-report call sitting beside the pre-existing log at `:307228`, whereas 193 has only the log at `:298359`. The section's framing — *"Every string in this function is byte-identical between builds … zero new literals"* — is defensible for *distinct strings* but not for *occurrences*, and a new reporting call site is exactly the kind of thing the sentence claims does not exist |

Everything else reproduced exactly, including large and easily-mistyped counts:
`readFileState` 80/70, `1M context` 42/40, `count_tokens` 32/22, `claude-sonnet-5` 35/0,
`TaskOutput` 28/9, `junction` 16/14, `_SUPPORTED_CAPABILITIES` 15/15, `egrep` 9/8,
`retirementDates` 7/7, `planEditedLocally` 2/5, `model-default` 2/4.

---

## 4. Systematic patterns

This is the actionable part. A rate alone tells you nothing about what to fix.

### 4.1 Pattern A — "the neighbour row" is the dominant failure mode (5 of 9 material defects)

**Every single one of the material defects that is off by a small amount is off *toward an adjacent
symbol that the doc cites correctly on the line before or after*:**

- `Ten` `:293357` → that line is the tail of `Nvs`, cited correctly on the previous row.
- `dHh` `:58768` → 2 lines past `yWl` `:58766`, cited correctly on the previous row.
- `Iif` `:460212 (193)` → the last line of `Lyl` `:460180 (193)`, cited correctly in the same sentence.
- `vZr` `:283117` → 4 lines before the real `vZr`; the sibling `pSs` `:283135` on the same row is right.
- `Yar` `:266811` → 1 line past its own declaration.

**Mechanism (inferable):** these are all `Related Symbols` list rows written in a batch. The author
had a screenful of the bundle open, read the *first* symbol's line number accurately, and then
**estimated** the neighbours' line numbers by counting rather than re-reading. The error is always
small (1–4 lines) and always in the direction of "the thing I just read".

**Consequence for future passes:** the highest-yield check is not random sampling — it is
**verifying every row of every `Related Symbols` block mechanically**, which is exactly what §1.3
does and what caught 6 of the 9 material defects. That check is cheap (one regex + one grep per row)
and should be a pre-commit gate, not an audit.

### 4.2 Pattern B — errors propagate by copy, so defect count over-states independent errors

2 of the 9 material defects are literal duplicates of another (`Iif` `:460212` appears in both
`05_plan_mode/README.md` and `bash_bypass_and_classifier_212_218.md`; `Ggy` `:277771` in both
`45_skills/README.md` and `plugin_config_and_security.md`). The 9 material defects are only
**7 independent authoring errors**. Conversely this means a fix must grep the whole tree, not one file.

### 4.3 Pattern C — ranges are not worse than single lines, but they fail differently

| Citation shape | Sampled | Defects | Rate |
|---|---|---|---|
| Range (`:NNNN-MMMM`) | 168 | 3 | 1.8% |
| Single line (`:NNNN`) | 121 | 3 | 2.5% |

Statistically indistinguishable. But the *kind* of failure is perfectly segregated:

- **Every range defect is a boundary error** — ±1 line at one end, or a range that stops before the
  last function the snippet prints. Not one range pointed at the wrong region.
- **Every single-line defect is a symbol-pointer error** — the line exists and is nearby, but names
  a different symbol.

So the answer to "are ranges more often wrong" is *no* — ranges are the **safer** form, because a
range that is off by one line still contains the code it claims to. A single-line symbol pointer that
is off by one line contains something else.

### 4.4 Pattern D — (193) citations are ~5× worse, on a small sample

| Bundle | Sampled | Defects | Rate |
|---|---|---|---|
| 220 (target) | 265 | 4 | 1.5% |
| 193 (baseline) | 24 | 2 | 8.3% |

n=24 is far too small to call this significant (the 95% interval spans 1%–27%), but the direction is
what one would expect and the mechanism is legible: 193 line numbers must be re-derived in a second
bundle, usually while the author's attention is on the 220 side, and there is no way to sanity-check
them by adjacency to the surrounding 220 work. Both 193 defects are the same shape (an off-by-1/2
onto the preceding function). **Recommendation: re-verify (193) citations as a class**; there are
1,210 bare + 41 full-form of them, and at 8.3% that would be ~100 defects — worth the sweep even if
the true rate is half that.

### 4.5 Pattern E — deliberately-rounded region spans are a citation form, not an error

Several docs cite a *region* with visibly rounded endpoints, e.g.:

- `39_mcp/dual_mcp_runtime_trees.md:15-16` — `v2 tree :292800–297500` / `v1 tree :298300–302400`
  (the v1 tree's real module boundary is 298307; its export table is 298345-298394).
- `57_api_reliability/retry_policy.md:7` — "the whole retry machine lives in one module,
  `:534500-535070`" (the module actually spans 534472-535067).
- `48_accessibility_ui/vim_and_input.md:23` — composers at `:753700-754400` / `:806800-807100`.
- `51_headless_sdk/subagent_text_forwarding.md:441` — `resolveHeadlessOptions` `:829060-829560`.

These read as citation errors to a mechanical checker (the endpoints land on arbitrary lines) but are
**correct as region markers** — the described content is inside, and the rounding is obviously
intentional. I classified all of them `OK`. Any future automated checker must whitelist ranges whose
endpoints are multiples of 100, or it will drown in false positives.

### 4.6 Pattern F — the docs' own false-anchor tables are accurate

A large fraction of the bare-citation population lives in "false anchors caught in this theme" and
"reads as new / reality / evidence" tables — the most epistemically dangerous content in the tree,
because each row asserts that an obvious-looking anchor is *wrong*. **Every one of these sampled
(≈25 rows across `04_tools`, `05_plan_mode`, `36_background_agents`, `39_mcp`, `41_hooks`,
`47_models`, `52_code_review`, `55_auth_providers`, `56_chrome_ide`) verified exactly**, including
the fiddly ones: `220:160555` byte-identical to `193:11182` for the `#${e.prNumber}` label;
`802689` returning `"session you came from"` / `"current session"`;
`424599` being a *comment line* and therefore not the IDE-selection truncation;
`AIe = 1e4` at `512643` rather than the `10,000 characters` literal at `205495`;
`FBt = 5` at `193:229871`. The negative claims are the best-verified content in the tree.

### 4.7 Non-pattern: no theme dir is measurably worse

Stated explicitly because it is the question the task asked. The three highest per-theme rates
(`05_plan_mode` 11.1%, `40_system_prompt` 11.1%, `41_hooks` 11.1%) are each a single defect on n=9,
and two of those three are ±1-line range slop. The exhaustive audit's 6 findings land in 5 different
themes (`39_mcp`, `41_hooks`, `45_skills` ×2, `48_accessibility_ui`, `57_api_reliability`) with no
concentration. The defect distribution is consistent with a uniform per-citation error probability of
roughly 2%, with the material component around 0.5–0.7%.

---

## 5. Confidence and limits

**Confidence in the 2.08% figure: moderate-high.** 289 citations is enough to bound the true rate at
roughly 1%–4% (95%), and every defect was confirmed by reading the bundle directly. The material rate
(0.69%, n=2) is the weakest number here — the exhaustive audit is the better estimator for that class,
and it says 0.27% for gross mis-anchors specifically.

**What this pass does NOT establish:**

1. **Semantic correctness.** I verified that a cited line *supports* the sentence attached to it. I
   did not re-derive the docs' analytical conclusions (NET_NEW vs CARRYOVER verdicts, mechanism
   explanations, the "why this design" reasoning). A citation can be perfect and the paragraph around
   it still wrong.
2. **Completeness.** Nothing here detects a *missing* citation or an unanchored claim.
3. **The 193 rate.** n=24. §4.4's recommendation stands on mechanism, not on statistics.
4. **Count claims at scale.** 42 of 916 verified (4.6%). The one genuine failure found was a
   *systematic-looking* one (an entire three-claim sentence, two of whose claims are wrong), which
   suggests count claims cluster by sentence rather than failing independently — a targeted re-run of
   all 916 with `grep -cF` is cheap and would settle it.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](symbol_index_infra_integration.md) - Integrations

Symbols whose citations this pass **corrected**:

- `withRequestTimeout` (`Ten`) - `:293359`, not `:293357` — non-GET-only MCP abort wrapper
- `MAX_FOLDED_TIMEOUT_MS` (`dHh`) - `:58739`, not `:58768` — `300000`
- `MCP_RETRYABLE_CODES` (`vZr`) - `:283121`, not `:283117` — 11-code retryable set
- `openHistoryStream` (`IUs`) - `:454833`, not `:454804` — wrapper over `yPo` (`:454804`), the real `history.jsonl` generator
- `syncInstalledPluginsFromSettings` (`Ggy`) - `:277763`, not `:277771`
- `isUnconfiguredServer` (`Yar`) - `:266810` (declaration), body at `:266811`
- `sandboxedBashPrefixAutoAllow` (`Iif`, 193 twin of `Wqy`) - `:460214 (193)`, not `:460212 (193)`; `Lyl` `:460180 (193)` is correct
- `hookSkillRoot` (`skillRoot` field) - `:215745` / `:215755-215756` / `:215781`, not `:520497`
- `buildSystemNotificationMessage` (`DQl`, 193) - `:599350-599356 (193)`, not `:599351-599356 (193)`
- `layoutAgentRowSegments` (`Q9a`) - `:728557-728580`, not `-728581` (`qii` starts at `:728581`)
- `logSkippedFrontmatterHooks` (`OTo`) - `:342046`, outside the `:342023-342045` range its snippet is filed under

Symbols confirmed correct at high value (spot-check anchors for any future pass):

- `isAutoModeAvailableOnProvider` (`Eer` 220 / `ont` 193) - `:150416-150419` / `:135186-135189 (193)`
- `filterToolsForAgent` (`MNy`) - `:345484-345499`
- `classifyTurnApiFailure` (`BMs`) - `:530513-530523`; `getTurnFailureReason` (`olp`) `:530510`
- `getMcpSdkGeneration` (`o9`) - `:262846-262864`; memo `Cgo` `:262865`
- `SUBAGENT_SPAWN_DEPTH_DEFAULT` (`ZDu = 3`) `:230906` / gate `sty` `:230907` / 193's `FBt = 5` `:229871 (193)`
- `MCP_ERROR_CLASS_NAMES` (`gEy`) - `:288840-288847`, exactly six names
- `HOST_SURFACE_SERVERS` (`AEy`) - `:289043`, exactly four names via `...K9u`
