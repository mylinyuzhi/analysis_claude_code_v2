# Cross-Validation Report — Module 40_system_prompt (v2.1.193 delta)

- **Module:** 40_system_prompt (System-prompt surface delta, v2.1.183 → v2.1.193)
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.193/analyze/40_system_prompt/`
- **Docs audited:** `README.md`, `env_block_agent_proxy_line.md`, `reminder_catalogue_delta_193.md`
- **Additions file:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.193/analyze/00_overview/symbol_additions_v2_1_193_system_prompt.md`
- **TARGET bundle (v2.1.193):** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines; `VERSION:"2.1.193"`, build `a1938d2a`, `BUILD_TIME 2026-06-25T18:18:11Z` — re-confirmed at :162,214)
- **BEFORE-PICTURE bundle (v2.1.183):** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines)
- **EARLIER BASELINE (v2.1.156):** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649,979 lines)
- **v2.1.88 named-TS reference:** `/lyz/codespace/3rd/claude-code/src/`
- **Theme in-scope deltas:** env-block agent-proxy line (new env/identity line) + system-reminder catalogue delta vs 183 (added/removed/reworded reminders)

**Verdict (one line):** **PASS WITH FIXES.** Every load-bearing 193 anchor, every NET-NEW string, and every CARRYOVER survival claim reproduced exactly at the cited lines and grep-counts. The set-diff of the two `05_reminders.json` assets confirms the catalogue moved by **exactly one add and one remove**, matching the doc verbatim. Two genuine **mislabels** were found and fixed in place: (1) the 183 carryover env builder was cited as `D_f` — it is actually `L_f@580976` (`D_f@581006` is the unrelated 3-param sibling = 193 `V3f`); independently confirmed by the extracted asset filename `03_env_template_0_L_f.txt`. (2) `Kwn@152092` was described as "the @152055 save-time guidance" — it is actually the stale-memory drift/trust bullet (carryover of 183 `UQu@151550`). Three minor cite drifts (slot range, model-line line, function-range end) were tightened to the exact lines. No false deltas survived.

**Sample:** 35 distinct v2.1.193 anchors re-read in the live bundle · 11 before-pictures re-read (9 in v2.1.183, plus the 156 baseline for the dedup) · 18 grep-count diffs re-run across BOTH the 183 and 156 bundles, plus an authoritative Python set-diff of the two reminder assets.

---

## C1 — Citation spot-check (v2.1.193 TARGET bundle)

Every line below was opened at the exact cited line in the v2.1.193 bundle and the declaration/string confirmed.

### Delta #1 — env-block agent-proxy line

| Cited line | Doc claim (obf → readable) | Verified at line | Result |
|---|---|---|---|
| 592845 | `W3f` → `computeEnvInfo` (2-param env builder) | `async function W3f(e, t) {` | PASS |
| 592851 | model-info line `You are powered by the model named …` | `? \`You are powered by the model named ${c}. The exact model ID is ${e}.\`` | PASS (README cite was :592852 → fixed to :592851) |
| 592865 | `l = Nwn()` (NEW local) | `    l = Nwn();` | PASS |
| 592873-592878 | `${ l ? \`${l}\n\` : "" }` slot | `${` @592873 … `}</env>` @592878 | PASS (cites said -592879 → tightened to -592878) |
| 592881 | `V3f` 3-param sibling (= 183 `D_f`) | `async function V3f(e, t, n) {` | PASS |
| 151173 | `h$t` → `setAgentProxyEnvLine` | `function h$t(e) { Bki = e; }` | PASS |
| 151176 | `Nwn` → `getAgentProxyEnvLine` | `function Nwn() { return Bki; }` | PASS |
| 151179 | `Bki` → `agentProxyEnvLine` | `var Bki;` | PASS |
| 616578 / 616580 | `C3o` → `buildAgentProxyEnvLine` + line string | `function C3o(e, t) {` + `Outbound HTTPS goes through a pre-configured agent proxy…` | PASS |
| 616459/616461/616464/616468 | enable wiring (`h$t(C3o(c,void 0))` / `writeFile(m, Z8f(…))` / `h$t(C3o(c,m))` / `h$t(C3o(c,void 0))`) | all four verbatim | PASS |
| 616690 | proxy stop `h$t(void 0)` | `…h$t(void 0), x3o?.stop()…` | PASS |
| 616595 / 616598 / 616609 | `Z8f` → `buildAgentProxyReadme` + `# Claude Code agent proxy` header + `curl -sS …/__agentproxy/status` | `function Z8f(e, t) {` / `# Claude Code agent proxy` / `1. Run: curl -sS ${r}/__agentproxy/status` | PASS |
| 615539 | proxy-server status banner | `GET /__agentproxy/status on this proxy port shows proxy state and recent failures.` | PASS |
| 616618 | `## Failure classes and fixes` (README body) | `## Failure classes and fixes` | PASS |
| 46539 / 592965 | `Mt`→`getCwd` / `B2o`→`getShellInfoLine` | `function Mt() {` / `function B2o() {` | PASS |

### Delta #2 — Remote "now running as" model-change reminder

| Cited line | Doc claim | Verified at line | Result |
|---|---|---|---|
| 705779 | `le` → `handleModelSwitchReplay` | `function le(jn, ir) {` | PASS |
| 705780 | `let Ht = XQl(jn, C2(ir));` | verbatim | PASS |
| 705781-705789 | `Be.CLAUDE_CODE_REMOTE` Remote branch pushing the reminder | `if ((F.push(...Ht), Be.CLAUDE_CODE_REMOTE)) {` … `})` | PASS |
| 705785 | reminder string `<system-reminder>The model for this session has been changed to ${Sr}. You are now running as ${Sr}.</system-reminder>` | verbatim | PASS |
| 599667 | `XQl` → `buildModelSwitchReminders` | `function XQl(e, t) {` body `[Sre(), Pn({content: dPe("model", e)}), Pn({content: \`${xNo}${t}</${fC}>\`})]` | PASS |
| 599662 | `dPe` → `renderSlashCommandReplay` | `function dPe(e, t) {` | PASS |
| 599604 | `Pn` → `makeMetaMessage` | `function Pn({` | PASS |
| 103713 | `C2` → `resolveModelDisplayName` | `function C2(e) {` | PASS |
| 602556 | `xNo` = `<${fC}>Set model to ` | `xNo = \`<${fC}>Set model to \`;` | PASS |
| 45929 | `fC` = `"local-command-stdout"` | `fC = "local-command-stdout",` | PASS |

### Delta #3 — memory-prompt dedup

| Cited line | Doc claim | Verified at line | Result |
|---|---|---|---|
| 152255 | `p0i` → `whenToAccessMemories` (`## When to access memories` array) | `(p0i = [ "## When to access memories", …4 bullets…, Kwn, ])` | PASS |
| 152262 / 152263 | `A$t` → `beforeRecommendingFromMemory`; string @152263 | `(A$t = [` @152262, `"## Before recommending from memory"` @152263 | PASS |
| 152092 | `Kwn` (5th element of `p0i`) | `Kwn = "- Memory records can become stale over time… verify that the memory is still correct…"` | PASS (description mislabel — see Defect #2) |
| 152055 | save-time guidance survives | `…Recalled memories appearing inside \`<system-reminder>\` blocks are background context…` | PASS |

**C1 result:** 35/35 cited v2.1.193 anchors verified at their exact lines. Zero citation-line FAILs. (Two *mapping-description* defects and three ±1 cite drifts logged below — the lines were correct, the label/range was not.)

---

## C2 — Before-picture spot-check (v2.1.183 + v2.1.156)

| Cited line | Doc claim | Verified | Result |
|---|---|---|---|
| 183:580976 | the 2-param env builder (carryover of 193 `W3f`) | `async function L_f(e, t) {` — **`L_f`, not `D_f`** | PASS (doc said `D_f` → fixed) |
| 183:580996-581004 | 183 env body ends `OS Version:` → `</env>` (no `${l}`) | `OS Version: ${r}` @581002 then `</env>` @581003, no slot | PASS |
| 183:581006 | `D_f` is the **3-param** `(e,t,n)` sibling | `async function D_f(e, t, n) {` | PASS |
| 183:151561 / 151568 / 151573 | `ygi` / `_gi` / `NNr` memory arrays | `(ygi = […])` / `(_gi = ["## Recalled memories in tool results", …])` / `(NNr = ["## Types of memory", …])` | PASS |
| 183:151568-151571 | removed `_gi` subsection body | `"Tool results may include additional \`<system-reminder>\` blocks…drift and trust rules above…"` | PASS |
| 183:151550 | 183 `UQu` (= 193 `Kwn` carryover, the stale-memory bullet) | `UQu = "- Memory records can become stale over time… verify that the memory is still correct…"` | PASS |
| 183:151068 | `## Before recommending from memory` survives | `"## Before recommending from memory",` | PASS |
| 183:151514 | save-time guidance survives (byte-identical to 193) | `…Recalled memories appearing inside \`<system-reminder>\` blocks are background context…` | PASS |

**Asset before/after (both builds extracted under `…/extract/assets/system_prompts/`):**
- `01_identity.json` 352 / 352 — values byte-identical; keys `gNr/OAi/NAi/@0x1233411` (183) → `AVr/Dki/Pki/@0x125348c` (193). PASS.
- builders `02_builder` ×3: 183 `$vp`(1292)/`w_f`(1082)/`y_f`(935) → 193 `zqp`(1292)/`B3f`(1082)/`R3f`(935). Sizes identical. PASS.
- env template `03_env_template`: 183 `…_L_f.txt` **198 B** → 193 `…_W3f.txt` **203 B** (+5). PASS — **the filename independently proves the 183 builder is `L_f`, not `D_f`.**
- sub-agents `04_subagent` 0–4: identical sizes both builds. PASS.
- reminders `05_reminders.json`: 183 **15925 B** → 193 **15703 B** (−222); 25 entries both. PASS.

**C2 result:** 9/9 183 before-picture decls + all asset before/after sizes reproduced. PASS (with the `D_f`→`L_f` correction).

---

## C3 — False-delta hunt (grep both 183 AND 156)

Highest-value check. Every NET-NEW / REMOVED / CARRYOVER string was grepped in BOTH before bundles.

### Delta #1 (env agent-proxy line) — NET-NEW confirmed

| String | 193 | 183 | 156 | Verdict |
|---|---|---|---|---|
| `Outbound HTTPS goes through a pre-configured agent proxy` | 1 | **0** | **0** | NET-NEW ✓ |
| `__agentproxy/status` | 3 | **0** | **0** | NET-NEW ✓ |
| `# Claude Code agent proxy` (README) | 1 | **0** | **0** | NET-NEW ✓ |
| `Failure classes and fixes` | 1 | **0** | **0** | NET-NEW ✓ |
| bare token `agent-proxy` | 69 | 29 | **0** | base machinery is a 156→183 carryover; the env-line/README/endpoint are the 193 delta ✓ (matches README "29 → 69") |

### Delta #2 (Remote model-change reminder) — NET-NEW confirmed

| String | 193 | 183 | 156 | Verdict |
|---|---|---|---|---|
| `You are now running as` | 1 | **0** | **0** | NET-NEW ✓ |
| `The model for this session has been changed to` | 1 | **0** | **0** | NET-NEW ✓ |
| `Set model to ` (generic `/model`-replay, `XQl`) | 4 | 5 | 4 | CARRYOVER ✓ (mechanism present in both — count fluctuation 4→5→4 is in the generic replay, not the new reminder) |

### Delta #3 (memory dedup) — REMOVED + CARRYOVER confirmed

| String | 193 | 183 | 156 | Verdict |
|---|---|---|---|---|
| `Recalled memories in tool results` | **0** | 1 | 1 | REMOVED ✓ (existed in 156 & 183) |
| `drift and trust rules` | **0** | 1 | 1 | REMOVED ✓ |
| `context automatically recalled from your persistent memory` | **0** | 1 | 1 | REMOVED ✓ |
| `Recalled memories appearing inside` (save-time) | 1 | 1 | 1 | CARRYOVER ✓ (survives) |
| `## Before recommending from memory` | 1 | 1 | 1 | CARRYOVER ✓ (survives) |
| `## When to access memories` (block count) | 3 | 4 | 3 | one fewer fragment ✓ (doc says 4→3) |

### Catalogue integrity cross-checks

- `<system-reminder>` literal token: **40 in both** 193 and 183 — consistent with +1/−1 (the removed paragraph mentioned it once; the added reminder wraps once). ✓
- `05_reminders.json` entries: **25 in both**. ✓
- **Authoritative Python set-diff** of the two reminder assets: ONLY-in-193 = exactly `<system-reminder>The model for this session has been changed to ${Sr}. You are now running as ${Sr}.</system-reminder>`; ONLY-in-183 = exactly the "Tool results may include additional `<system-reminder>` blocks…" paragraph. **Exactly one add, one remove — matches the doc verbatim.** ✓

**C3 result:** PASS. Every NET-NEW string is genuinely 0 in BOTH 183 and 156; every REMOVED string was present in BOTH and is gone in 193; every CARRYOVER string is present in all three builds. No false delta survived the dual-bundle grep. The set-diff is the strongest evidence and reproduces the doc's claim exactly.

---

## C4 — Lineage (v2.1.88 named-TS)

- `computeEnvInfo` @ `constants/prompts.ts:606`: the docs cite this as the named ancestor of `W3f`. The v2.1.88 env builder exists and ends the `<env>` block directly at `OS Version:` (no proxy slot) — consistent with the doc's "the `${l}` slot is the only structural change since 88". `grep -rEc 'agentproxy|Outbound HTTPS'` over `/3rd/claude-code/src` = 0 (no ancestor for delta #1), matching the doc. PASS (lineage claims framed honestly; not re-deep-read line-by-line as it is out of the 193-delta critical path).

---

## Defects fixed in place

### Defect #1 — [HIGH] 183 carryover env builder mislabeled `D_f` (it is `L_f`)

Three docs cited the 183 builder that `W3f` is a carryover of as **`D_f@580996`**. The function whose `<env>` body ends at `OS Version:` @580996-581004 is actually **`L_f`** (decl 183:580976, 2-param `(e,t)`). `D_f@581006` is a *different* function — the **3-param `(e,t,n)`** sibling, which maps to 193 `V3f@592881`, not `W3f`. This is independently proven by the extraction tool's own filename: 183 ships `03_env_template_0_L_f.txt`, 193 ships `03_env_template_0_W3f.txt`. **Fixes applied:**
- `symbol_additions_v2_1_193_system_prompt.md:20` — `carryover of 183 D_f@580996` → `carryover of 183 L_f@580976 … not 183 D_f@581006, which is the 3-param sibling = 193 V3f@592881`.
- `README.md:32` — `env D_f ends at OS Version:` → `env builder L_f@580976 ends at OS Version: … D_f@581006 is the unrelated 3-param sibling`.
- `env_block_agent_proxy_line.md:95` — `The v2.1.183 builder (D_f, 183:580996-581004)` → `The v2.1.183 builder (L_f, decl 183:580976; env body 580996-581004 — not D_f@581006 … confirmed by the extracted asset filename 03_env_template_0_L_f.txt)`.

### Defect #2 — [MEDIUM] `Kwn@152092` mis-described as the "@152055 save-time guidance"

`symbol_additions:47` named `Kwn` = `recalledMemoriesGuidanceRef` and described it as "consolidated save-time drift/trust guidance; survives @152055". `Kwn@152092` is in fact the stale-memory bullet — `"- Memory records can become stale over time… verify that the memory is still correct…"` — the **final element of the `## When to access memories` array** (`p0i`), reused @152260/152448/152554, and the carryover of 183 `UQu@151550`. The @152055 save-time text (`"Recalled memories appearing inside <system-reminder> blocks…"`) is a *separate* literal, not `Kwn`. **Fixes applied:**
- `symbol_additions_v2_1_193_system_prompt.md:47` — renamed to `memoryStalenessGuidance` with the accurate description (final `## When to access memories` element; carryover of 183 `UQu@151550`; reused @152260/152448/152554; explicitly **not** the @152055 literal).
- `reminder_catalogue_delta_193.md:211` (READABLE pseudocode) and `:215` (Mapping line) — `recalledMemoriesGuidanceRef` → `memoryStalenessGuidance`, with the corrected gloss inline.

### Defect #3 — [LOW] three ±1 cite drifts tightened

- slot range `:592873-592879` → `:592873-592878` (the `}</env>` close is at 592878; 592879 is the `${o}${a}` line). Normalized across `README.md` and `env_block_agent_proxy_line.md` (5 occurrences).
- env-builder code-snippet header function range `592845-592881` → `592845-592880` (closing `}` of `W3f` is at 592880; 592881 is `V3f`).
- README model-info-line cite `:592852` → `:592851` (the `You are powered by the model named` literal is at 592851; 592852 is the bare fallback).

No forbidden obf→readable mapping tables were introduced; the cross-version re-mangle tables in `symbol_additions` and the identity/builder table in the README are the allowed lineage exception. All three docs retain their `## Related Symbols` list-format sections.

---

## Verdict

**PASS WITH FIXES.** Confidence: **HIGH.**

The 40_system_prompt delta analysis is well-grounded: all 35 sampled v2.1.193 anchors verified verbatim at the cited lines (`W3f` env slot + getter/setter/var, `C3o`/`Z8f` agent-proxy line+README, the proxy enable/stop wiring, the `le` Remote reminder branch and the `XQl` generic replay, and the `p0i`/`A$t`/`Kwn` memory fragments); all NET-NEW strings confirmed 0 in BOTH 183 and 156; all REMOVED strings confirmed present in both before bundles and gone in 193; the reminder-asset set-diff reproduces the doc's "one add, one remove" exactly; and the env-template asset bytes (198→203) and reminder asset bytes (15925→15703) match. The two real mislabels (`D_f`→`L_f` env-builder token; `Kwn` save-time→staleness description) and the three ±1 cite drifts are fixed in place.

**Residuals (honest):**
- Delta #4 ("background launch-result no longer says 'end your response'") is a cross-link owned by `36_background_agents`; it was only sanity-checked here (`end your response` 193=2 vs 183=4; `async_launched` branch @431253 present) and is not deep-audited in this theme.
- The v2.1.88 `computeEnvInfo @ constants/prompts.ts:606` lineage cite was confirmed for shape/absence-of-proxy-slot but not line-by-line deobfuscated (out of the 193-delta critical path).
- The README sub-agent asset sizes are quoted as `2656/2497/2059/1288/549` (the extraction's char-length convention from the filenames) vs `wc -c` byte counts `2664/.../553` (UTF-8 multibyte `—` em-dashes). The load-bearing claim — 183 and 193 sub-agent assets are **identical to each other** — holds on both measures; not a defect, noted for transparency.
