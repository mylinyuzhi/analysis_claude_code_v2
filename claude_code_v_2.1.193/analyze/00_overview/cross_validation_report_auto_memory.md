# Cross-Validation Report — Module 31_auto_memory (v2.1.193 delta)

- **Theme:** auto_memory (Auto Memory & Dream delta, v2.1.183 → v2.1.193)
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.193/analyze/31_auto_memory/`
- **Additions file:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.193/analyze/00_overview/symbol_additions_v2_1_193_auto_memory.md`
- **TARGET bundle (v2.1.193):** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines, build `a1938d2a`)
- **BEFORE-PICTURE bundle (v2.1.183):** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines)
- **EARLIER BASELINE (v2.1.156):** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649,979 lines)
- **v2.1.88 named-TS reference:** `/lyz/codespace/3rd/claude-code/src/`
- **Markdown files audited:** 3 (`README.md`, `billiard_aviary_immutable_memory_removal.md`, `memory_reminder_and_dream_carryover.md`) + 1 additions file.
- **In-scope 193 deltas:** `tengu_billiard_aviary` immutable-memory / `tiny_memory` experiment FULL REMOVAL in 193; the "MEMORY.md compact reminder near size limit" (auto-memory, not compaction); dream telemetry carryover.

**Sample:** 22 distinct **v2.1.193** anchors re-read at their cited lines; 18 **before-picture** declarations re-read in the v2.1.183 bundle (plus 156 grep evidence); 30 grep-count diffs re-run in BOTH 183 and 156 (and 193). One full body-diff of `$_l` (193) vs `PQa` (183), 68 lines each.

**Verdict (one line):** PASS WITH FIXES. The auto-memory delta analysis is accurate on its load-bearing skeleton: every cited 193 declaration, string, and grep-count reproduced exactly; the experiment-removal grep-tables (→ 0) reproduced exactly; and the "2.1.186 MEMORY.md compact reminder" is correctly proven to be CARRYOVER, not a 193 delta. Three real defects were found and fixed in place: a wrong `Hgi` signature description ("no memory-dir param" → it actually lacks the *transcripts* param), an under-counted "11 gate sites" (actual `aH()` call-sites = 16), and a +2 declaration drift on the `FOa` rating-button cite (378928 → 378926).

---

## C1 — v2.1.193 anchor spot-check (TARGET bundle)

Every line below was opened at the exact cited line in the 193 bundle and the declaration/string confirmed.

| Cited 193 line | Obf → Readable | Verified at line | Result |
|---|---|---|---|
| 152573 | `v$t` → `truncateMemoryIndexForPrompt` | `function v$t(e) {` | PASS |
| 151952-151954 | `UH`/`RY`/`Kae` → `"MEMORY.md"`/`200`/`25000` | `var UH = "MEMORY.md", RY = 200, Kae = 25000,` | PASS |
| 463735 | `$_l` → `buildConsolidationPrompt` | `function $_l(e, t, n, r = !1) {` + `# Dream: Memory Consolidation` | PASS |
| 463782 | dream Phase-4 "stays under `${RY}` lines AND under ~25KB" | `Update \`${UH}\` so it stays under ${RY} lines AND under ~25KB...` | PASS |
| 463818 | `Daf` → `getDreamThrottleConfig` (`tengu_onyx_plover`) | `function Daf() { let e = it("tengu_onyx_plover", null);` + `B_l.minHours` | PASS |
| 463837 / 463839 | `G_l` → `initAutoDream` / installs `j_l` → `executeAutoDream` | `function G_l() {` … `j_l = async function (n, r) {` | PASS |
| 463891 | `tengu_auto_dream_fired` telemetry | `V("tengu_auto_dream_fired", { hours_since…, sessions_since…, team_memory_enabled: p })` | PASS |
| 463897-463907 | firing site: `y=tm()`, `b=Ph(mr())`, `H=$_l(y,b,S,p)` | exact match; `H = $_l(y, b, S, p),` at **463907** | PASS |
| 233806 | `AutoMem` inject through `v$t` | `if (n === "AutoMem") d = v$t(c).content;` | PASS |
| 151593 | `qae` → `parseMemoryStoresEnv` | `function qae() { let e = process.env.CLAUDE_MEMORY_STORES;` | PASS |
| 152389 / 152460 / 152638 | `m0i` / `g0i` / `VVr` recall builders | `function m0i(e, t = !1)` / `g0i(e,t,n,r=!1)` / `VVr(e,t,n,r=!1,o=!1)`; m0i body emits memory prompt text | PASS |
| 375261-375264 | drift note: `b5t` = `permission_browser`, NOT memory | `var b5t; … b5t = hy({ kind: "permission_browser",` | PASS |
| 350529 / 254126 | substring false-positives `organizationRateLimitTier` / `"AnimationRate"` | both confirmed (excluded from genuine onRate:) | PASS |

`$_l` (193 :463735-463802) was diffed line-for-line against `PQa` (183 :455311-455378), obf tokens normalized: **68/68 lines identical apart from the function name** — confirms the doc's "body == 183 PQa" claim.

## C2 — v2.1.183 before-picture spot-check

| Cited 183 line | Doc claim | Verified declaration | Result |
|---|---|---|---|
| 147670 / 147673 | `XXu` selector / `aH` gate (`tengu_billiard_aviary`, `!1`) | `function XXu() { return aH() ? YXu : KXu; }` / `function aH() { return ct("tengu_billiard_aviary", !1);` | PASS |
| 147729-147731 | `KXu="memory"`, `YXu="tiny_memory"`, `JXu="MEMORY.md"` | exact | PASS |
| 151520 | `Hgi` → "# Dream: Memory Pruning", 3-arg | `function Hgi(e, t, n = !1) { return \`# Dream: Memory Pruning` | PASS (param desc fixed — see Defects) |
| 455311 | `PQa` → "# Dream: Memory Consolidation", 4-arg | `function PQa(e, t, n, r = !1) {` | PASS |
| 151691 | `Zkt` → `truncateMemoryIndexForPrompt` (183) | `function Zkt(e) {` | PASS |
| 150799-150801 | `$w="MEMORY.md"`/`tie=200`/`HTe=25000` | exact | PASS |
| 225707 | 183 `AutoMem` inject through `Zkt` | `if (n === "AutoMem") d = Zkt(c).content;` | PASS |
| 455358 | 183 dream Phase-4 ("stays under `${tie}` lines AND under ~25KB") | `Update \`${$w}\` so it stays under ${tie} lines AND under ~25KB...` | PASS |
| 455476 / 455488 | 183 2-way branch `b=aH()` / `T = b ? Hgi(h,S,p) : PQa(h,y,S,p)` | exact | PASS |
| 378926 / 378928 | `FOa` rating button | decl `function FOa(e) {` at **378926**; `onRate: l` destructuring at 378928 | drift fixed (was cited 378928) |
| 378871 / 378881 | the two `onRate:` call-site handlers `(T) => i(r, T, "tiny_memory", f)` | exact | PASS |
| 220230 / 220243 | `aH() && LOi(e)` / `...(aH() && { created: Itt() })...` | exact | PASS |
| 151881 / 151887 / 151952 | immutable write-path gate sites | `if (t && !aH() && Dg(e))` / `if (t && aH())` / `if (aH()) return !1;` | PASS |
| 445405 | gated memory-attachment path | `!(aH() && PNp(l.attachment.memories))` | PASS |

## C3 — v2.1.88 lineage

- `buildConsolidationPrompt` cited at `services/autoDream/consolidationPrompt.ts:10` → **CONFIRMED**: `/lyz/codespace/3rd/claude-code/src/services/autoDream/consolidationPrompt.ts:10: export function buildConsolidationPrompt(`. The `autoDream/` service dir (`autoDream.ts`, `config.ts`, `consolidationLock.ts`, `consolidationPrompt.ts`) exists as named. Not an invented ancestor.

---

## False-delta hunt (the core check — diffed in BOTH 183 and 156)

### Carryover claims — CONFIRMED present in 183 (engine is frozen this window)

| String | 193 | 183 | 156 | Doc says | Verdict |
|---|:--:|:--:|:--:|---|---|
| `tengu_auto_dream_fired` | 1 | 1 | 1 | carryover | CONFIRMED |
| `tengu_auto_dream_failed` | 1 | 1 | 1 | carryover | CONFIRMED |
| `tengu_auto_dream_skipped` | 2 | 2 | 2 | carryover | CONFIRMED |
| `tengu_auto_dream_completed` | 1 | 1 | 1 | carryover | CONFIRMED |
| `tengu_auto_dream_toggled` | 1 | 1 | 1 | carryover | CONFIRMED |
| `tengu_onyx_plover` | 2 | 2 | 2 | carryover | CONFIRMED |
| `CLAUDE_MEMORY_STORES` | 10 | 10 | 5 | carryover 10/10 (183↔193) | CONFIRMED (10/10 holds for the window; expanded 156→183, outside scope) |
| `Reconcile memories against CLAUDE.md` | 1 | 1 | 1 | carryover | CONFIRMED |
| `# Dream: Memory Consolidation` | 1 | 1 | 1 | carryover | CONFIRMED |
| `Only part of it was loaded` (WARNING) | 1 | 1 | 1 | carryover | CONFIRMED |
| `Keep index entries to one line` (WARNING) | 1 | 1 | — | carryover | CONFIRMED |
| `will be truncated, so keep` (load guidance) | 3 | 3 | — | carryover | CONFIRMED |
| `index entries are too long` | 1 | 1 | — | carryover | CONFIRMED |

### "2.1.186 MEMORY.md compact reminder" — CORRECTLY labelled FALSE DELTA / carryover

The doc claims this changelog item is **carryover**, not a 193-window change, on two grounds, both verified:
- The load-time truncation WARNING (`v$t`@152573 ≡ 183 `Zkt`@151691) and its full WARNING string are **byte-identical** and present 1/1 in both bundles.
- The dream Phase-4 "keep it an index / under 200 lines / ~25KB" instruction is byte-identical (193 :463782 ≡ 183 :455358).
- **Adversarial absence check:** `nearing` = 0/0, `approaching the limit` = 0/0 in both bundles → no net-new *proactive* "nearing the limit" reminder was added this window. The doc's claim stands.

### `findRelevantMemories` / `findRelevant` "never existed"

`findRelevantMemories` = 0 / 0 and `findRelevant` = 0 / 0 (193 / 183). CONFIRMED — a guessed name, correctly flagged as non-existent.

### Removal claims (item A) — the experiment drops to 0 in 193, present in 183 AND 156

| String / symbol | 193 | 183 | 156 | Verdict |
|---|:--:|:--:|:--:|---|
| `tengu_billiard_aviary` | 0 | 1 | 1 | CONFIRMED removed (gate predates window; existed in 156+183) |
| `tiny_memory` | 0 | 4 | 4 | CONFIRMED |
| `Dream: Memory Pruning` | 0 | 1 | 1 | CONFIRMED |
| `Memory files are immutable` | 0 | 1 | 1 | CONFIRMED |
| `never edit them in place` | 0 | 1 | 1 | CONFIRMED |
| `memories are immutable, so delete` | 0 | 3 | 3 | CONFIRMED |
| `Tool constraints for this run` (variant count) | 1 | 2 | 2 | CONFIRMED (immutable variant dropped) |
| `scopeCounts` (rating payload) | 0 | 2 | 2 | CONFIRMED |
| `onRate:` (genuine handler form) | 0 | 3 | — | CONFIRMED (grep -c `onRate:` = 3→0; raw `onRate` 5→2 incl. 2 substring false-positives) |
| `# Memory` (grep -c line count) | 13 | 19 | — | CONFIRMED (grep -c gives 13/19 exactly; grep -o gives 14/20 because one line holds two `# Memory` — the doc's grep-count figure is right) |

Note on `onRate`: raw `grep -c onRate` = 5 (183) → 2 (193); the 2 residual substring matches in each bundle are `"AnimationRate"` (183 :245614 / 193 :254126) and `organizationRateLimitTier` (183 :340869 / 193 :350529), confirmed not rating handlers. The genuine `[Good]/[Bad]` widget (`onRate:`) is 3 → 0. The doc reports 3→0, correctly.

---

## Defects fixed in place

1. **`billiard_aviary_immutable_memory_removal.md` §3 ("The dream branch collapse") — wrong signature description (FAIL-level mislabel).** The doc said the deleted builder `Hgi` (183 :151520, `(e, t, n=!1)`) has "**no memory-dir param**." Reading the `Hgi` body shows `e` IS the memory directory (`Memory directory: \`${e}\``; `find ${e} -name '*.md'`); `t` is additional-context, `n` is the team flag. What `Hgi` actually lacks (vs `PQa`/`$_l`'s 4-arg `(e, t=transcripts, n, r)`) is the **session-transcripts param** — a pruning pass only re-reads existing memory files. **Fixed** the sentence to spell out the three params and correct "no memory-dir param" → "no session-transcripts param."

2. **`billiard_aviary_immutable_memory_removal.md` §1 + `README.md` index — under-counted gate sites.** Both docs asserted "**11 gate sites in 183**" / "11 coordinated edits." Re-run `grep -c '\baH()'` in the 183 bundle = **17 matches = 16 call-sites + 1 definition (`:147673`)**. **Fixed** "11 gate sites" → "16 `aH()` call-sites" (with the grep noted) in `billiard…§1`, "11 coordinated edits" → "unwinding all 16 `aH()` call-sites," and the README index row "11 gate sites in 183" → "16 `aH()` gate call-sites in 183." (The §1 table still shows representative rows; reworded to "Each representative row below.")

3. **`symbol_additions_v2_1_193_auto_memory.md` + `README.md` + `billiard…§Related Symbols` — +2 declaration drift on `FOa`.** `FOa` (Type=`function`) was cited at 183 `:378928`; the actual declaration `function FOa(e) {` is at **378926** (378928 is `FOa`'s own `onRate: l` destructuring line, which is also one of the three genuine `onRate:` grep matches). **Fixed** the three `FOa`-as-component cites to `378926` and annotated that the `onRate` prop is read at 378928. The `onRate:` grep-match-site lists (`:378871/:378881/:378928`) in §1's table and §2's evidence were left intact — 378928 is a correct `onRate:` match there.

No forbidden obf→readable mapping tables were introduced; the `## Related Symbols` list-format sections are preserved; the dual-version code-snippet format is untouched. English-only preserved.

---

## Residuals (honest)

- The recall builders `m0i` / `g0i` / `VVr` carry interpretive sub-role labels in the additions file (`_privateAndTeam` / `_teamMultiDir` / `_singleDir`). Their **line anchors and general role** (memory system-prompt builders, carryover) were verified at 152389 / 152460 / 152638; the precise private-vs-team-vs-single-dir distinctions were not independently re-derived (they are CARRYOVER and out of the 193 delta scope, so non-load-bearing for this window).
- The `billiard…§2` code-snippet header range "cli_inner_pretty.js:378866-378882 (the two rating buttons)" is the createElement **call** range; the `[Good]` `createElement(FOa,…)` actually starts at 378864 (±2). Left as-is — it points at the right region and is labelled as the call range, not a declaration.
- `B_l` (`DREAM_THROTTLE_DEFAULTS`) is cited as "463818 (ref)" — it is referenced inside `Daf` at 463818, not declared there; this is honestly tagged "(ref)" in the additions file. No fix needed.

**Final verdict:** PASS WITH FIXES. **Confidence: HIGH** — every load-bearing 193 anchor and grep-count reproduced exactly in the live bundles; the experiment-removal and carryover claims are byte- and count-verified across 183 and 156; the three defects were narrow (one signature wording, one count, one ±2 cite) and are corrected in place.
