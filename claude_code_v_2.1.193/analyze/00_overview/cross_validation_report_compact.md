# Cross-Validation Report — Module 07_compact (v2.1.193 delta)

- **Theme:** compact (Compaction subsystem, v2.1.183 → v2.1.193 window)
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.193/analyze/07_compact/`
- **Markdown audited:** `README.md` (the single module doc — "thin carryover note + one dispatcher refactor")
- **Additions file audited:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.193/analyze/00_overview/symbol_additions_v2_1_193_compact.md`
- **TARGET bundle (193):** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines, build `a1938d2a`)
- **BEFORE-PICTURE (183):** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines, build `9d251abd`)
- **EARLIER BASELINE (156):** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649,979 lines)
- **In-scope 193 deltas:** `Ego`→`Rxo` auto-compact dispatcher return-shape refactor (flat `{wasCompacted}` → discriminated `{kind}` union); `CSl`/`VDn` helper extractions + circuit-breaker emit 2→1; thrash-message constant-fold; full carryover ledger.

**Sample:** 30 distinct v2.1.193 anchors re-read at their exact cited lines + 22 before-pictures re-read (14 v2.1.183 decls/emit-sites + 8 v2.1.156 carryover greps) + 16 grep-count signals re-run (8 across 193↔183, 8 across 193/183/156). The full `Rxo` body (`470250-470348`) and the full caller block (`466397-466460`) were read end-to-end, not just at their head lines.

**Verdict (one line):** **PASS WITH FIXES.** Every load-bearing claim — the discriminated-union refactor, the two new helpers, the consolidated circuit-breaker emit, the constant-folded thrash message, and the entire carryover ledger — is accurate and reproduced byte-for-byte against the live 193 bundle, with the 183 before-picture and 156 baseline confirming each carryover. The only defects were **two ±1 citation drifts** (`wYe` getter, `BIo` callsite), now fixed in place. No false deltas, no mislabeled carryovers, no fabricated ancestors.

---

## C1 — 193 anchor spot-check (TARGET bundle)

Every line opened at the exact cited line in the 193 bundle; declaration/body confirmed against the doc claim.

| Obf | Readable (doc) | 193 line | Verified at line | Verdict |
|---|---|---|---|---|
| `Rxo` | autoCompactDispatcher (async generator, `{kind}` union) | 470250 | `async function* Rxo(e, t, n, r, o, s, i) {` + `Be.DISABLE_COMPACT` → `{ kind: "not_needed" }` + `>= ISl` → `{ kind: "failure_breaker_open" }` | PASS |
| `CSl` | compactFailedResult (failed factory, emits breaker @`>=ISl`) | 470189 | `function CSl(e, t, n) {` … `if (r >= ISl)` … `V("tengu_auto_compact_circuit_breaker", {…})` … `return { kind: "failed", consecutiveFailures: r, … }` | PASS |
| `u8d` | rapidRefillCount (bare count, window `<3`) | 235127 | `function u8d(e){ return e?.compacted===!0 && e.turnCounter<3 ? (e?.consecutiveRapidRefills??0)+1 : 0; }` | PASS |
| `VDn` | rapidRefillBreaker (`{action,consecutiveRapidRefills}`) | 235130 | `function VDn(e){ let t=u8d(e); return { action: t>=3?"trip":"proceed", consecutiveRapidRefills:t }; }` | PASS |
| `VZr` | makeCompactedState (success-state factory) | 235134 | `function VZr(e,t){ return { compacted:!0, turnId:e, turnCounter:0, consecutiveFailures:0, consecutiveRapidRefills:t }; }` | PASS |
| `VXi` | RAPID_REFILL_WINDOW (`3`, warn-log only) | 235137 | `var VXi = 3,` | PASS |
| `qZr` | THRASH_MESSAGE (static string) | 235138 | `qZr = "Autocompact is thrashing: … within 3 turns … 3 times in a row. …"` | PASS |
| `acf` | prefixOverflowProbe | 470203 | `function acf(e, t, n, r = 0) {` | PASS |
| `Xxo` | isColdCompact (`CLAUDE_CODE_COLD_COMPACT`) | 470235 | `function Xxo(){ return at(process.env.CLAUDE_CODE_COLD_COMPACT); }` | PASS |
| `lcf` | autocompactNeeded (gate) | 470238 | `async function lcf(e, t, n, r, o = 0) {` | PASS |
| `ccf` | autoWindowSpinnerHint | 470349 | `function ccf(e, t){ … return \`Compacting at auto window (${dl(o)} tokens) · /autocompact to configure\`; }` | PASS |
| `ISl` | FAILURE_BREAKER_MAX (`3`) | 470357 | `var ISl = 3;` | PASS |
| `WDn` | resolveThresholdSource (6-source) | 235039 | `function WDn(e, t) {` | PASS |
| `wSl` | streamCompactSummary (fallback-model loop) | 469797 | `async function wSl({` | PASS |
| — | `query_source: Ve("compact")` (summarize) | 469978 | `query_source: Ve("compact"),` | PASS |
| `Lpr` | setLongContext1mCreditsBlocked | 2878 | `function Lpr(e){ Nt.longContext1mCreditsBlocked = e; }` | PASS |
| `pOr` | CONTEXT_HINT_BETA | 102179 | `(pOr = pE("context_hint", "context-hint-2026-04-09")),` | PASS |
| — | caller `let ge = yield* p.autocompact(…)` | 466397 | head of the query-loop autocompact dispatch | PASS |
| — | `autocompactRan` derivation | 466458 | `let _e = ge.kind === "compacted" \|\| ge.kind === "failed";` | PASS |
| — | CSl reactive call site | 470325 | `return CSl(o, !0, f);` | PASS |
| — | CSl proactive call site | 470346 | `return CSl(o, !1, void 0);` | PASS |
| — | `tengu_auto_compact_routed_reactive` | 470278 | `V("tengu_auto_compact_routed_reactive", { thresholdSource: $e(f) }));` | PASS |
| — | `tengu_auto_compact_prefix_overflow` | 470262 | `V("tengu_auto_compact_prefix_overflow", { ...u, wouldHaveBlocked: !0 }));` | PASS |
| — | `compact_auto_prefix_overflow` counter | 470261 | `Ct("compact_auto", "compact_auto_prefix_overflow"),` | PASS |
| `wYe` | getLongContext1mCreditsBlocked | 2876 (cited) | decl `function wYe()` @**2875**; body `return Nt.longContext1mCreditsBlocked` @2876 | **±1 — FIXED** |
| `BIo` | shouldRunPostCompactBookkeeping (callsite) | 466459 (cited) | `BIo({` call token @**466460** (`if(` opens @466459) | **±1 — FIXED** |

**Six-exit-point map (proves the union is a pure shape change).** The full `Rxo` body (`470250-470348`) was read; all six terminal returns confirmed exactly as the doc's table states: `DISABLE_COMPACT`→`{kind:"not_needed"}`; `consecutiveFailures>=ISl`→`{kind:"failure_breaker_open"}`; `!lcf`→`{kind:"not_needed"}`; `VDn(...).action==="trip"`→`{kind:"rapid_refill_breaker_tripped"}`; success→`{kind:"compacted", result, consecutiveRapidRefills, thresholdSource, routedThroughReactive}`; hook-block→`{kind:"hook_blocked", …}`; failure→`CSl(...)` = `{kind:"failed", consecutiveFailures, …}`. The two `CSl` call sites (`470325` reactive `CSl(o,!0,f)`, `470346` proactive `CSl(o,!1,void 0)`) and the conditional spreads inside `CSl` reproduce the doc's claim of two distinct 183 emit shapes.

---

## C2 — 183 before-picture + 156 baseline spot-check

| Obf (183) | Doc role | 183 line | Verified at line | Verdict |
|---|---|---|---|---|
| `Ego` | dispatcher (flat `{wasCompacted}`) | 461531 | `async function* Ego(e, t, n, r, o, s, i) {` | PASS |
| `Igo` | rapidRefillCount (window `< Ggo`) | 461481 | `function Igo(e){ return e?.compacted===!0 && e.turnCounter<Ggo ? (e?.consecutiveRapidRefills??0)+1 : 0; }` | PASS |
| `wgo` | THRASH_MESSAGE template literal | 461687 | `` wgo = `Autocompact is thrashing: … within ${Ggo} turns … ${cWn} times …` `` | PASS |
| `jgo`/`Ggo`/`cWn` | three `3` constants | 461663-461665 | `var jgo = 3,` / `Ggo = 3,` / `cWn = 3,` | PASS |
| `PAo` | post-loop helper callsite | 457823 | `PAo({` | PASS |
| — | 183 reactive circuit-breaker emit | 461612 | `G("tengu_auto_compact_circuit_breaker", { consecutiveFailures: S, routedThroughReactive: !0, thresholdSource: Ne(p) })` | PASS |
| — | 183 proactive circuit-breaker emit | 461651 | `G("tengu_auto_compact_circuit_breaker", { consecutiveFailures: y })` (only field) | PASS |
| `ywn` | 183 ancestor of `WDn` | 226899 | `function ywn(e, t) {` | PASS |
| `del` | 183 ancestor of `wSl` | 461088 | `async function del({` | PASS |
| `Yjp` | 183 ancestor of `acf` | 461484 | `function Yjp(e, t, n, r = 0) {` (sig matches 193 `acf`) | PASS |
| `Xjp` | 183 ancestor of `lcf` | 461519 | `async function Xjp(e, t, n, r, o = 0) {` (sig matches 193 `lcf`) | PASS |
| `Jjp` | 183 ancestor of `ccf` | 461655 | `function Jjp(e, t) {` (sig matches 193 `ccf`) | PASS |

The doc's claim that `CSl` "consolidates 183's two inline sites (`461606`/`461645`)" is exact: the reactive-fail block is `461606-461617`, the proactive-fail block is `461645-461652`, with emits at `461612`/`461651` respectively — read in full and matching the two distinct payload shapes the doc and `CSl`'s conditional spreads reproduce.

---

## C3 — False-delta hunt (the high-value check)

### In-window REFINEMENT signals (193 vs 183) — all reproduced exactly

| Signal | doc 193 | doc 183 | re-run 193 | re-run 183 | Verdict |
|---|:---:|:---:|:---:|:---:|---|
| `wasCompacted` (string) | 0 | 10 | **0** | **10** | CONFIRMED — flat shape removed in-window |
| `rapid_refill_breaker_tripped` | 2 | 0 | **2** | **0** | CONFIRMED — union tag net-new in-window |
| `tengu_auto_compact_circuit_breaker` | 1 | 2 | **1** | **2** | CONFIRMED — 2 emit sites consolidated into `CSl` |
| `"failure_breaker_open"` | 1 | — | **1** | **0** | CONFIRMED — net-new tag (183=0) |
| `"hook_blocked"` | 2 | — | **2** | **0** | CONFIRMED — net-new tag (183=0) |
| `"not_needed"` | 5 | — | **5** | **3** | CONFIRMED — +2 (`kind:"not_needed"` grep = 2, the two dispatcher returns); 183=3 are unrelated generic uses, doc honestly marks 183 "—" |
| `compactedMessageCount` | 1 | 1 | **1** | **1** | CONFIRMED — telemetry payload carryover |
| `tengu_auto_compact_succeeded` | 1 | 1 | **1** | **1** | CONFIRMED — telemetry carryover |

The two diagnostic signatures the doc rests its REFINEMENT verdict on (`wasCompacted` 10→0; `rapid_refill_breaker_tripped` 0→2) are exactly reproduced, as is the emit-consolidation (`tengu_auto_compact_circuit_breaker` 2→1). The new union tags `failure_breaker_open` (0→1) and `hook_blocked` (0→2) are genuinely net-new vs 183. **The refactor is in-window and behavior-preserving — verdict upheld.**

### CARRYOVER claims — every stable string present in 183 (and mostly 156), so NONE is a 193 delta

| Lane | Stable string | 193 | 183 | 156 | Verdict |
|---|---|:---:|:---:|:---:|---|
| Micro-compact beta | `context-hint-2026-04-09` | 1 | **1** | **1** | CARRYOVER (predates window, back to 156) — not a 193 delta |
| Summary prompt | `Your task is to create a detailed summary` | 3 | **3** | **3** | CARRYOVER (count stable across all three) |
| MEMORY.md (auto-memory, not compaction) | `MEMORY.md` | 4 | **4** | **4** | CARRYOVER — doc's "4=4" correction confirmed (live = 4/4/4) |
| Cold-compact env | `CLAUDE_CODE_COLD_COMPACT` | 2 | **2** | 1 | CARRYOVER vs 183 |
| 1M-credits clamp | `longContext1mCreditsBlocked` | 3 | **3** | 0 | CARRYOVER vs 183 (landed 156→183, i.e. the 2.1.172 delta; 156=0 consistent) — not a 193 delta |
| Auto-compact window env | `CLAUDE_CODE_AUTO_COMPACT_WINDOW` | 7 | **7** | 6 | CARRYOVER vs 183 |
| Pct-override env | `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | 2 | **2** | 1 | CARRYOVER vs 183 |
| After-last-compact env | `CLAUDE_AFTER_LAST_COMPACT` | 2 | **2** | 1 | CARRYOVER vs 183 |

Every carryover stable string is present in 183 → none is mislabeled. The clamp/cold-compact/env strings that show 156 < 183 are the *earlier* (2.1.157→2.1.183) deltas the doc explicitly attributes to those versions, **not** to the 193 window — attribution correct.

### Disambiguation claim (§4) — confirmed

The doc's claim that the "2.1.186 MEMORY.md reminder" is auto-memory, not compaction, holds: `MEMORY.md` is a flat 4/4/4 carryover, and there is no compaction×MEMORY.md co-mention binding it to the `Rxo`/`tengu_auto_compact_*` pipeline. The doc's self-correction of the dossier's "10=10" to the live "4=4" is accurate (live = 4 in both 193 and 183).

---

## C4 — Lineage check

All ancestor claims in this theme are **v2.1.183** ancestors (not v2.1.88), and every one was located and signature-matched in the 183 bundle (`Ego`@461531, `Igo`@461481, `wgo`@461687, `jgo/Ggo/cWn`@461663-461665, `PAo`@457823, `ywn`@226899, `del`@461088, `Yjp`@461484, `Xjp`@461519, `Jjp`@461655). No fabricated ancestors. (No v2.1.88 named-TS ancestor is cited in this theme, so the `/lyz/codespace/3rd/claude-code/src` reference set was not load-bearing here.)

---

## C5 — Defects fixed in place

1. **`wYe` getter ±1 citation** — `symbol_additions_v2_1_193_compact.md` row and `README.md` (§3 carryover ledger + §Related Symbols) cited the getter at `cli_inner_pretty.js:2876`. That line is the getter *body* (`return Nt.longContext1mCreditsBlocked`); the declaration `function wYe()` is at **2875**. The companion setter `Lpr` was already cited at its decl line (2878), so the getter was inconsistent. **Fix:** changed the decl cite to `2875` and explicitly labeled `2876` as the field-read line (kept for cross-reference), so the decl pair (2875/2878) and the field read/write pair (2876/2879) are both precise.

2. **`BIo` callsite ±1 citation** — `symbol_additions_v2_1_193_compact.md` cited the post-loop helper callsite at `466459`. Line `466459` is the wrapping `if (`; the `BIo({` call token is at **466460** (and the pre-derived `autocompactRan` is `466458`). **Fix:** changed the callsite cite to `466460` and annotated the `if(`@466459 / `autocompactRan`@466458 neighbors.

Both were genuine ±1 drifts that already pointed at the correct function/region; the fixes make the citations exact. No content/mapping errors, no false deltas, and no forbidden mapping tables were introduced (the cross-version rows in the doc are 183-vs-193 re-mangle evidence, which is allowed).

---

## C6 — Verdict, confidence, residuals

- **Verdict: PASS WITH FIXES.**
- **Confidence: HIGH.** Every 193 anchor resolves to the claimed symbol; the six-exit-point union map, the `CSl` consolidation (with both 183 emit shapes reproduced), the `VDn`/`u8d` struct-wrap (byte-identical to 183 `Igo` modulo `Ggo`→`3`), and the constant-folded thrash text (render-identical) are all confirmed against the live bundles. Every carryover stable string is present in 183 (and mostly 156), so no lane is a mislabeled delta; the two diagnostic grep signatures (`wasCompacted` 10→0, `rapid_refill_breaker_tripped` 0→2) and the emit-consolidation (2→1) reproduce exactly.
- **Residuals (honest):**
  - The §1.5 evidence table marks 183 as "—" for `"not_needed"`/`"failure_breaker_open"`/`"hook_blocked"`. Live 183 counts are 3/0/0 — the doc's em-dash is honest (it never claims 0); the meaningful figure (`kind:"not_needed"` grep = 2 in 193) confirms the two new dispatcher returns. No change needed.
  - **LOW** confidence on the exact sub-version of the refactor (.185/.186/.187/.190/.191) stands — no intermediate bundles exist to diff, only the .183 and .193 endpoints. The doc already flags this. The `VZr` extraction and `autocompactRan` pre-derivation are plausibly part of the same commit as the union but are not separable without intermediate bundles; behavior-preserving regardless.
