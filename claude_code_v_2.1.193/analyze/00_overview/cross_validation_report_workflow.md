# Cross-Validation Report — 42_workflow (v2.1.193 delta)

- **Theme:** workflow / StructuredOutput call-control (v2.1.183 → v2.1.193)
- **Module dir audited:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.193/analyze/42_workflow/`
  - `README.md`, `structured_output_call_control.md`, `workflows_detail_status_filter.md`
- **Additions file audited:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.193/analyze/00_overview/symbol_additions_v2_1_193_workflow.md`
- **TARGET bundle (193):** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines, build `a1938d2a`)
- **BEFORE-PICTURE (183):** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines)
- **EARLIER BASELINE (156):** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649,979 lines)
- **In-scope deltas:** StructuredOutput post-success re-call lockout + 5-attempt schema-validation abort; follow-up structured-output reliability (`requiresStructuredOutput` inline enforcement replacing the 183 Stop hook); `/workflows` agent-detail `f`-key status filter.

**Sample:** 46 distinct 193 anchors re-read directly from the 193 bundle (every load-bearing `cli_inner_pretty.js:<line>` in the three docs + the additions file); 6 full 183 before-picture declarations re-read (plus 156 cross-checks); 11 grep-count diff claims re-run in **both** 183 and 156 against 193.

**Verdict (one line):** PASS WITH FIXES. Every NET-NEW / CARRYOVER / REFINEMENT claim is source-true — all three in-scope deltas (success-guard + retry-cap on the `wt` runner, the `requiresStructuredOutput` inline-enforcement refactor of the 183 Stop hook, and the `/workflows` `f` filter) reproduce exactly at the cited 193 lines, and every before/after grep diff reproduces the exact counts. Two precision defects were fixed in place: a 4-line drift on the `depth: K3(pe)+1` cross-link cite (was `423707` = `de(Pt);`, actual `423711`), and a "byte-equivalent" mischaracterization of the print-mode carryover (the tokens are re-mangled — `Mjo≠Y0o`, `Cr≠_n`, `Ti≠en` — so it is logic-equivalent, not byte-equivalent). No false delta was found.

---

## C1 — 193 anchor spot-check (TARGET bundle)

Every line below was opened at the exact cited line in the 193 bundle and the declaration / string / field confirmed against the doc claim.

### StructuredOutput core (CARRYOVER anchors for the new logic)

| Cited line | Obf → Readable | Verified content | Result |
|---|---|---|---|
| 229498 | `Ep` → `STRUCTURED_OUTPUT_TOOL` | `Ep = "StructuredOutput",` | PASS |
| 229472 | `qVd` → `schemaToolFactory` | `function qVd(e) {` Ajv `allErrors:!0`, throws `Fi` on mismatch | PASS |
| 229485 | schema throw | `throw new Fi("Output does not match required schema: …", "StructuredOutput schema mismatch: …")` | PASS |
| 229507 | `WVd` → default inputSchema | `WVd = Ce(() => A.object({}).passthrough())` | PASS |
| 229508 | `VVd` → outputSchema | `VVd = Ce(() => A.string().describe("Structured output tool result"))` | PASS |
| 229509-229543 | `$Qr` → `STRUCTURED_OUTPUT_BASE_TOOL` | `isMcp:!1`, `isEnabled→!0`, `isConcurrencySafe→!0`, `isReadOnly→!0`, `isOpenWorld→!1`, `searchHint`, `maxResultSizeChars:1e5`, description/prompt strings, `call()→{data,structured_output,endsTurn:!0}`, `checkPermissions→{behavior:"allow"}` — all verbatim | PASS |
| 229544 | `renderToolUseMessage` | `0 fields→null`, `<=3→key: Le(value)`, `>3→"N fields: ……"` | PASS |
| 9055 | `Fi` → `DualError` | `Fi = class Fi extends Error {` | PASS |
| 229559 | `Rw` → `WORKFLOW_TOOL_NAME` | `var Rw = "Workflow",` | PASS |

### `wt` runner — success guard + retry cap (NET-NEW 2.1.187 + 2.1.186)

| Cited line | Claim | Verified content | Result |
|---|---|---|---|
| 423705 | `wt` runner decl | `async function wt(tt, nt, Rt, $t) {` | PASS |
| 423775/423778/423779/423781/423782 | local decls | `dt,` / `sr = 0,` / `Mr = 0,` / `Ko = new Set(),` / `kn = Be.MAX_STRUCTURED_OUTPUT_RETRIES ?? NYp,` | PASS |
| 423795 | workflow `requiresStructuredOutput` | `requiresStructuredOutput: ge !== void 0,` (inside `m4({…})` spawn) | PASS |
| 423804 | capture | `dt = Gn.attachment.data;` (structured_output attachment branch) | PASS |
| 423814-423826 | user-branch count + throw | `Ko.delete(so.tool_use_id) && so.is_error) Mr++;` then `if ((Ke(), Mr > 0 && Mr >= kn && dt === void 0)) throw new Fi(…)` | PASS |
| 423823 / 423825 | retry-cap strings | `…StructuredOutput retry cap (${kn}) exceeded…` / `"Workflow agent({schema}) StructuredOutput retry cap exceeded"` | PASS |
| 423840 | success guard | `if ((sr++, (So = so.input), Ko.add(so.id), dt !== void 0 && sr > 2)) {` | PASS |
| 423841 | abort | `wr.abort("stalled");` | PASS |
| 423852-423875 | catch / clean-success | `catch (Gn) { let Mo = … zy(wr.signal.reason)…; if (Mo === "stalled" && dt !== void 0) { return (…{ structured: dt, …, stalled: !1, …, structuredOutputAttempts: sr, lastStructuredOutputInput: So })` | PASS |
| 424020 | stall-retry loop | `for (let Pt = 1; tt.stalled && !Rt && Pt <= kol; Pt++) {` | PASS |
| 424073 | wording (REFINEMENT) | `"agent({schema}): subagent completed without calling StructuredOutput (after in-conversation nudge)",` | PASS |
| 424306 / 424307 | the two `5`s | `kol = 5,` / `NYp = 5;` | PASS |
| 423711 | `depth: K3(pe)+1` cross-link | `depth: K3(pe) + 1,` (was cited `423707` = `de(Pt);` — **FIXED**) | FIXED |

### `requiresStructuredOutput` inline enforcement (NET-NEW 2.1.187)

| Cited line | Obf → Readable | Verified content | Result |
|---|---|---|---|
| 398565 | `m4` → `subagentQueryGenerator` | `async function* m4({` | PASS |
| 398601 | param | `requiresStructuredOutput: W,` | PASS |
| 398758 | forward to child options | `requiresStructuredOutput: W,` | PASS |
| 465479 | `Abl` → `findLastUserIndex` | `function Abl(e) { return e.findLastIndex((t) => t.type === "user" && !t.isMeta && !zde(t)); }` | PASS |
| 465576 | `vbl` → `messagePrepGenerator` | `async function* vbl(e, t, n, r, o, s, i, a, l, c) {` | PASS |
| 465638 | enforcement gate | `if (s.options.requiresStructuredOutput && YP(i) !== "auxiliary")` | PASS |
| 465651 | inline nudge string | `content: \`${Hbl} You MUST call the ${Ep} tool to complete this request. Call this tool now.\`,` | PASS |
| 465901 | `Hbl` → `ENFORCE_SENTINEL` | `Hbl = "[structured-output-enforce]";` | PASS |
| 601998-602021 | `Ibl` → `structuredOutputSucceeded` | walks back to latest SO `tool_use` id, returns `s.is_error !== !0` for its `tool_result` | PASS |
| 587869 / 689033 / 703037 / 703275 | other 4 `requiresStructuredOutput` sites | `!0` / `ho.some((Yo)=>lc(Yo,Ep))` / `v !== void 0 && pe` (×2) | PASS |

### `/workflows` detail `f` status filter (NET-NEW 2.1.186)

| Cited line | Obf → Readable | Verified content | Result |
|---|---|---|---|
| 541975 | `D$e` → `agentStatus` | `function D$e(e, t) {` (CARRYOVER) | PASS |
| 542947 | `[P,O]` filter state | `[P, O] = sP.useState("all"),` | PASS |
| 542951-542954 | `F` → `filteredModel` | `F = sP.useMemo(() => { if (!M || P === "all" || S === "phases") return M; return { ...M, agents: M.agents.filter((Ke) => D$e(Ke, U) === P) }; }, [M, P, S, U])` | PASS |
| 543007-543021 | `pe` → `cycleStatusFilter` | `function pe() { if (!M || v) return; … eYt … if (dt === "all" || Ke.has(dt)) break; … _(0), te()) }` | PASS |
| 543081 | `f` key binding | `else if (Ke.key === "f" && S === "agents") (Ke.preventDefault(), pe());` | PASS |
| 543117 | active filter label | `let rt = P !== "all" && S !== "phases" ? XOo[P].toLowerCase() : void 0,` | PASS |
| 543128 | footer hint | `if (S === "agents" && nt) _t.push(rt ? \`f filter: ${rt}\` : "f filter");` | PASS |
| 543272 | `eYt` → `FILTER_ORDER` | `eYt = ["all", "running", "queued", "failed", "done", "skipped", "interrupted"];` | PASS |
| 543273-543280 | `XOo` → `STATUS_LABELS` | `{ queued:"Queued", running:"Running", done:"Completed", failed:"Failed", skipped:"Skipped", interrupted:"Stopped" }` | PASS |

---

## C2 — Before-picture spot-check (183 TARGET, 156 baseline)

| Cited line (183) | Doc claim | Verified content | Result |
|---|---|---|---|
| 575795-575804 | `zKn` Stop-hook registers the SO nudge | `function zKn(e, t) { Pct(e, t, "Stop", "", (n) => Ojn(n, Em), \`You MUST call the ${Em} tool…\`, { timeout: 5000 }); }` | PASS |
| 575802 | 183 nudge text lives inside the Stop hook | `\`You MUST call the ${Em} tool to complete this request. Call this tool now.\`,` | PASS |
| 417279-417280 | 183 runner counted attempts only | `if ((Ho++, Te.add(wr.id), …, wr.name === Em)) (An++, (sr = wr.input));` — no `dt`/`abort` guard | PASS |
| 417266-417272 | 183 user-handler had no `is_error` accounting | `for (let wr of Ho) if (… "tool_result") Te.delete(wr.tool_use_id);` (no failure counter) | PASS |
| 417509 | 183 wording (plural) | `"…StructuredOutput (after 2 in-conversation nudges)",` | PASS |
| 685293-685310 | print-mode cap before-picture | `_n = Y0o(this.mutableMessages, Em) + _e - sr`, `en = parseInt(…MAX_STRUCTURED_OUTPUT_RETRIES || "5",10)`, `if (_n >= en && Yt.length === 0)` → `error_max_structured_output_retries` | PASS |

---

## C3 — False-delta hunt (grep diffs re-run in 193 AND 183 AND 156)

Each NET-NEW / CARRYOVER / REFINEMENT claim was re-confirmed by `grep -c` of a stable string across all three bundles.

| Token / string | 193 | 183 | 156 | Doc claim | Verdict |
|---|---:|---:|---:|---|---|
| `requiresStructuredOutput` | 8 | 0 | 0 | NET-NEW (2.1.187), 8 in 193 / 0 in 183 | CONFIRMED NET-NEW |
| `[structured-output-enforce]` (`Hbl`) | 1 | 0 | 0 | NET-NEW sentinel, 0 in 183 | CONFIRMED NET-NEW |
| `StructuredOutput retry cap` | 2 | 0 | 0 | NET-NEW (2.1.186), 2 in 193 / 0 in 183 | CONFIRMED NET-NEW |
| `error_max_structured_output_retries` | 5 | 5 | 4 | print-mode cap CARRYOVER, "5× in both" (183/193) | CONFIRMED CARRYOVER |
| `in-conversation nudge` (SO-complete error) | 1 (singular, 424073) | 1 (plural "2 …", 417509) | — | REFINEMENT: "2 nudges" → "nudge" | CONFIRMED REFINEMENT |
| `tool to complete this request. Call this tool now.` | 1 (inline `vbl` 465651) | 1 (Stop hook `zKn` 575802) | — | text moved hook→inline; Stop variant gone in 193 | CONFIRMED |
| cycle array `"queued", "failed", "done", "skipped", "interrupted"` | 1 | 0 | 0 | NET-NEW filter order | CONFIRMED NET-NEW |
| `f filter` (footer hint) | 1 | 0 | 0 | NET-NEW footer hint | CONFIRMED NET-NEW |
| `key === "f" && S === "agents"` | 1 | 0 | — | NET-NEW key handler | CONFIRMED NET-NEW |
| `useState("all")` | 2 | 1 | — | +1 (new filter state) | CONFIRMED +1 |
| `agents.filter` | 4 | 3 | — | +1 (new filtered `useMemo`) | CONFIRMED +1 |

**No false delta found.** Every "NET-NEW" string is genuinely absent from 183 **and** 156 (not merely new-vs-88); every CARRYOVER string (`error_max_structured_output_retries`, the `Ep`/`$Qr`/`qVd`/`Fi` core) is present in 183. The 156 column independently rules out the "new vs 88 but actually a 156/183 carryover" trap for all three deltas.

---

## C4 — Defects fixed in place

1. **`depth: K3(pe)+1` cross-link cited the wrong line (4-line drift).** Both `README.md` (Related sibling 193 deltas line) and `structured_output_call_control.md` (Cross-links list) cited `@423707`, but line 423707 in 193 is `de(Pt);`. The `depth: K3(pe) + 1,` field is at **423711**. Fixed both cites to `423711`.
2. **"byte-equivalent" mischaracterized the print-mode carryover.** The print-mode `--json-schema` cap is genuine CARRYOVER, but it is NOT byte-equivalent: the obfuscated tokens are re-mangled (`Mjo`≠`Y0o`, `Cr`≠`_n`, `Ti`≠`en`, `wr`≠`Yt`, `Ep`≠`Em`), as the doc's own re-mangle mapping shows. Replaced "byte-equivalent / byte-equiv" with "logic-equivalent (re-mangle only)" in all 5 occurrences: `README.md` table row B2′; `structured_output_call_control.md` TL;DR caveat, the §2 adversarial-nuance sentence, the `printModeRetryCap` snippet header comment, and the Evidence-note table row.

Total: 7 Edit operations across 2 files, resolving 2 logical defects. The `workflows_detail_status_filter.md` doc and the `symbol_additions_v2_1_193_workflow.md` file required **no** edits (every anchor and count verified).

---

## C5 — Residuals (honest)

- **Local-variable anchors cite a representative usage, not the `let`-head.** `symbol_additions` cites `dt`@423804 (the `= Gn.attachment.data` assignment), `sr`@423840 (`sr++`), `Mr`@423819 (`Mr++`), `Ko`@423819 (`Ko.delete`); the actual `let`-block declarations are 423775/423778/423779/423781. These are explicitly labelled "(local …)" and each cited line is a real, meaning-carrying use of that token, so they are not misleading — left as-is.
- **`Ke.key` → `key.name` rename.** The `f`-key handler READABLE renders `Ke.key === "f"` as `key.name === "f"`; the ORIGINAL correctly shows `Ke.key`, and the `// Mapping` line documents the `Ke.key→key.name` rename, so the source claim is accurate. Left as-is.
- **CLAUDE.md compliance:** no obf→readable mapping tables were introduced into module docs; the cross-version Role/183-obf/193-obf re-mangle tables that already exist are the allowed kind; every doc retains its list-format `## Related Symbols` section.

**Verdict:** PASS WITH FIXES. **Confidence:** HIGH — all three in-scope deltas verified at the byte level in the live 193 bundle, all before-pictures verified in 183, and all NET-NEW/CARRYOVER attributions cross-checked against both 183 and 156.
