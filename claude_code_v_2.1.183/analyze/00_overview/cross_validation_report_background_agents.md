# Cross-Validation Report — Module 36_background_agents (v2.1.183 delta tree)

- **Module:** `36_background_agents` — v2.1.156 → v2.1.183 delta (nested-subagent depth limit, `/bg` re-derivation, worker env-isolation, `agents --json` rework, daemon retire/respawn refinements)
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.183/analyze/36_background_agents/`
- **Scout dossier (spec):** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.183/analyze/_scout_dossier_background_agents.md`
- **Additions file:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.183/analyze/00_overview/symbol_additions_v2_1_183_background_agents.md`
- **TARGET bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines)
- **Before-picture bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
- **Markdown files scanned:** 5 (README.md + 4 deep-dives: `nested_subagent_depth_limit.md`, `worker_env_isolation_2181.md`, `agents_json_surface_2169.md`, `bg_command_surface_and_retire_delta.md`)
- **Method:** default-to-FAIL skeptic. Every sampled `cli_inner_pretty.js:<line>` re-opened at the exact line in the cited bundle and matched against the declaration the doc claims. 35+ v2.1.183 anchors + 9 v2.1.156 before-picture citations verified. Full format audit (mapping tables, Related-Symbols, dual-version template, relative links, English-only). Dossier framing traps re-checked.

---

## C1 — Citation spot-check (v2.1.183 TARGET bundle)

A representative sample of **35 cited v2.1.183 anchors** across the four docs was opened at its cited line and confirmed.

- PASS: 30
- FAIL (line-precision drift, claim correct): 5

| Cited anchor | Doc | Verified at cited line | Verdict |
|---|---|---|---|
| `v1i = 5` :221800 | nested | `var LCe,T5r,UPt, v1i = 5, T1i,w5r;` (221800) | PASS |
| `Gz` :103152 | nested | `function Gz(e){ if(e.agentType==="main") return 0; return e.depth ?? 0; }` | PASS |
| `cio` :371188 | nested | `function cio({ tools:e, isBuiltIn:t, isAsync:n=!1, isTeammate:r=!1, permissionMode:o, agentDepth:s=0 })` | PASS |
| depth gate :371194 | nested/README | `if (Rc(i, vs)) return s < v1i;` | PASS |
| `bte` :371230 | nested | `function bte(e,t,n=!1,r=!1,o=!1,s=0)` → `cio({…agentDepth:s})` | PASS |
| subagent runner :387154 | nested | `Ae = y ? f : bte(e, f, o, !1, D, Gz(c?.agentContext ?? n.agentContext)).resolvedTools` | PASS |
| `vs`/`c9` :149939/149940 | nested | `var vs = "Agent",` / `c9 = "Task",` | PASS |
| `Rc` :149965 | nested | `function Rc(e,t){ return e.name===t || (e.aliases?.includes(t) ?? !1); }` | PASS |
| `f3n` Agent tool def :423505 | nested | `(f3n = pi({` | PASS |
| spawn `z=Gz+1` :423722 | nested | `z = Gz(c.agentContext) + 1;` | PASS |
| `agent_depth: z` :423733 | nested | `agent_depth: z,` | PASS |
| `agentDepth: z` :423825 | nested | `agentDepth: z,` | PASS |
| `depth: z` async/sync :423933/423990 | nested | `depth: z,` (both) | PASS |
| resume `y` :434085 | nested | `y = (od(g) ? g.spawnDepth : void 0) ?? Gz(o.agentContext) + 1,` | PASS |
| `depth: y` :434205 | nested | `depth: y,` | PASS |
| fork `d=Gz` :473586 | nested | `d = Gz(t.agentContext),` (no `+1`) | PASS |
| fork `agentDepth:d`/`depth:d` :473606/473612 | nested | `agentDepth: d,` / `depth: d,` | PASS |
| workflow depth :417155 | nested | `depth: Gz(ue) + 1,` (inside `Dt` ctx literal) | PASS |
| `Xut` :446073, `spawnDepth:r` :446095 | nested | `function Xut({…spawnDepth: r…})`; `spawnDepth: r,` @446095 | PASS |
| `od` :445761 | nested | `function od(e){ …e.type === "local_agent"; }` | PASS |
| `jz` :103149 | nested | `function jz(e){ return e.agentType === "main"; }` | PASS |
| `L1i` :222216 | nested | `function L1i(){ if (rwn !== null) return rwn; …}` | PASS |
| `agent_depth: r.agentDepth` :371803 | nested | `agent_depth: r.agentDepth,` | PASS |
| `_Fl` :594705 + scrub passes :594725-594732 | env | `function _Fl(e,t,n,r,o)`; 4 scrub passes (`jLo`/`GLo`/`JLt`/`WLo`) verbatim | PASS |
| `GLo` :595849 | env | `(GLo=[...k3r,...YLt,...C3r,...I3r,"ANTHROPIC_CUSTOM_HEADERS",…])` | PASS |
| `XLt` :191672 | env | `(XLt=["ANTHROPIC_API_KEY","ANTHROPIC_AUTH_TOKEN","CLAUDE_CODE_OAUTH_TOKEN",…])` | PASS |
| `JLt` :191730 | env | `(JLt = ["VERTEX_REGION_CLAUDE_"])` | PASS |
| `WLo` :594777 | env | `function WLo(e){ return !!e.ANTHROPIC_UNIX_SOCKET \|\| st(e.CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST) \|\| !!e.CLAUDE_CODE_HOST_AUTH_ENV_VAR; }` | PASS |
| `st` :163 | env | `function st(e){ … ["1","true","yes","on"].includes(t); }` | PASS |
| `YGf` :695919 (+body) | env | `function YGf(e){…}` body byte-matches doc snippet; spare spawn `env: YGf(...)` `--bg-pty-host`/`--bg-spare` @695868 | PASS |
| `k3r`/`YLt`/`C3r`/`I3r` :192032/191650/191662/191681 | env | all four constituent list declarations present at cited lines | PASS |
| `jLo` :595797 | env | `((jLo=["CLAUDE_CODE_QUESTION_PREVIEW_FORMAT","GITHUB_ACTIONS",…])` | PASS |
| `aGf` :691275; `--all` filter :691294 | agents-json | `async function aGf(e,t)`; `if (!t && !p && f !== "working" && f !== "blocked") continue;` | PASS |
| `lGf` :691342 | agents-json | `function lGf(e,t){ if(t==="busy") return "working"; … }` verbatim | PASS |
| `cGf` :691363; def `--json`/`--all` :695320/695321 | agents-json | `async function cGf(e){…await t(e.cwd, e.all===!0)…}`; both `.option(...)` lines present | PASS |
| `rDt`/`$Ad` :192384 | agents-json | `function rDt(e,t){…}` + `function $Ad(e){…}` verbatim | PASS |
| sources `m4e`/`QK`/`zzn` :360113/192363/564518 | agents-json | `async function m4e()`, `async function QK(e)`, `async function zzn(){ let e = await Mb({proto:vp,op:"list"}) }` | PASS |
| `Bie`/`Gk`/`ph`/`jFe`/`Uwe`/`oDt` :192481/192490/192496/192504 | agents-json | all six predicates present verbatim at/within cited lines | PASS |
| `vcc`/`Tcc` :691333/691339 | agents-json | `function vcc(e){…}` / `function Tcc(e){ return e==="idle"?"idle":e==="waiting"?"waiting":"busy"; }` | PASS |
| `JMl`/`sKn`/`iKn`/`ugf`/`lgf`/`hgf` :566833/566834/566927/566957/567091/567140 | bg_command | export `gt(JMl,{spawnBackgroundFork:()=>sKn,…})`; `async function sKn(...)`; `function iKn(e,t)`; `function ugf(e)`; `lgf = async (e,t,n)=>`; `((hgf = {type:"local-jsx", name:"background",…})` | PASS |
| `aKn` :567155 | bg_command | `async function aKn(e)` | PASS |
| `Gye` :477381 | bg_command | `function Gye(e){ if(!edn()) return; …}` | PASS |
| `respawnIfIdleStale` :594895 | bg_command | `async respawnIfIdleStale(e, t = "sweep")` (new trigger param) | PASS |
| `retireIfSettled` :594936 | bg_command | `async retireIfSettled(e, t, n = e)` | PASS |
| `gFl` :595796 | bg_command | `(gFl = ["local_bash","in_process_teammate","dream"])` | PASS |
| `Wzn` :564348 | bg_command | `function Wzn(){ return ct("tengu_bg_attach_upgrade", !0); }` | PASS |
| prewarm gate `if(!R && Wzn())` | bg_command | found @**697255** (`let W = ct("tengu_bg_prewarm_per_sweep",3)` @697256); doc snippet header cites :697259 | **FAIL (range-start off by 4)** |
| `Zyn` effort gate `...(d && Zyn()? ["--effort",d]:[])` | bg_command | found @**566858**; doc cites :566860 | **FAIL (off by 2)** |
| left_arrow `if(a==="left_arrow"&&…&&!T.alive)` | bg_command | found @**566881**; doc cites :566884 | **FAIL (off by 3)** |
| left_arrow `Tc(...slice(0,8))` / transcript copy | bg_command | `Tc` @**566882**, jsonl/`copyFile` @**566885/566887**; doc cites :566886 / :566889 | **FAIL (off by ~2-4)** |
| left_arrow telemetry `Rt(...,"queued_for_later")` | bg_command | found @**566912**; doc cites :566904 | **FAIL (off by 8)** |
| `Zyn` decl :148956 | bg_command | `function Zyn(){ … Boolean(e.unpinOpus47LaunchEffort && e.unpinOpus48LaunchEffort && e.unpinFable5LaunchEffort); }` | PASS |
| `Qe`/`Ne` :137/140 | bg_command | `function Qe(e){…}` @137, `function Ne(e){…}` @140 (header range :128-148 encloses) | PASS |
| `cgf = 3000` :567109 | bg_command | `cgf = 3000;` | PASS |
| `tengu_background` :566916, `tengu_background_fork` :566994, `tengu_background_declined` :567036 | bg_command | all three telemetry sites present at cited lines | PASS |

**The 5 FAILs are all line-precision drift inside `sKn`/the supervisor tick** — the cited line lands 2-8 lines from the actual declaration, but the declaration text and every analytical claim are correct. The drift is caused by the doc's ORIGINAL snippets compressing multi-line pretty-printed statements (e.g. `let x = …, I = await fa(x)` is one comma-statement spanning two lines in the bundle). No claim is wrong; the anchors are imprecise. Fix = bump the cited line numbers to the verified values.

---

## C2 — Before-picture spot-check (v2.1.156 bundle)

9 v2.1.156 before-picture citations re-opened in the v2.1.156 bundle.

- PASS: 7
- FAIL (line/transcription): 2

| Before-picture citation | Doc | Verified | Verdict |
|---|---|---|---|
| `uE6` filter :278956 (team-only Agent gate) | nested | `function uE6({tools:H,isBuiltIn:$,isAsync:q=!1,permissionMode:K})` + `if(R7()&&mG()){ if(h1(_,sq)) return !0; …}` — matches doc snippet verbatim | PASS |
| `no` builder :278972 (4-arg) | nested | `function no(H, $, q = !1, K = !1)` — 4 params, confirms "no `agentDepth`" | PASS |
| `sq = "Agent"` :185637 | nested | `var sq = "Agent",` | PASS |
| `grep -c agentDepth` = 0 / `grep -c spawnDepth` = 0 | nested | confirmed 0 / 0 in the v2.1.156 bundle | PASS |
| `Eq9` :559877 + `Y7q` :560861 | env | `function Eq9(H,$,q,K)`; `Y7q = ["CLAUDE_CODE_QUESTION_PREVIEW_FORMAT","GITHUB_ACTIONS",…]` (pure terminal/session) | PASS |
| `bBz` :642728 (+body) / `qSH` :373239 (+body) | agents-json | both bodies byte-match the doc's ORIGINAL snippets; `--json` def help = "Print live sessions" @646306, one-arg `A(z.cwd)` | PASS |
| cliVersion-equality CARRYOVER :560035-560047 | bg_command §B.0 | present verbatim with `VERSION:"2.1.156"`, `BUILD_TIME:"2026-05-28…"`, the quoted `GIT_SHA` — confirms the **correction** that this is carryover, not a v2.1.183 delta | PASS |
| `session_cron`/`routine` guards CARRYOVER cited :560113-560114 | bg_command §B.0 | guards ARE carryover (correction is right) BUT actual lines are **:560119-560120**; :560113-560114 is the settled-predicate block | **FAIL (line off by 6; claim correct)** |
| effort before-picture `M ? ["--effort", j]` | bg_command §A.3 | source @542704 is `...(j ? ["--effort", j] : [])` — gate is on **`j`** (effort), not `M` (which gates `--model` one line above). Doc mis-transcribed the guard variable | **FAIL (transcription; substance correct)** |

Both before-picture FAILs leave the **substantive claim intact** (cliVersion-equality and cron/routine guards genuinely are carryover; effort genuinely was unconditional vs `Zyn()`-gated). Only the line number / the variable name in the quoted before-snippet are off.

---

## C3 — Dossier framing traps / corrections honored

The bg_command doc's headline value-add is that it **corrects two over-claims that propagated from the scout dossier and the README** (dossier §3.5 listed the cliVersion-equality stale check and the `session_cron`/`routine` retire guards as v2.1.183 NEW). I independently re-verified the correction against the v2.1.156 bundle:

- **cliVersion-equality stale short-circuit — CARRYOVER (correction CONFIRMED).** v2.1.156 `respawnIfIdleStale(H)` @560029 already contains the exact `!this.record.cliVersion || this.record.cliVersion === {…VERSION:"2.1.156"…}.VERSION` short-circuit (@560035-560047). v2.1.183 differs only by the constant-folded `VERSION:"2.1.183"`. The doc is right; the dossier was wrong; the doc honestly flags this as a dossier/README correction.
- **`session_cron`/`routine` retire guards — CARRYOVER (correction CONFIRMED).** Present in v2.1.156 `retireIfSettled` verbatim (`includes("session_cron") → "session-cron"`; `K.routine → "routine"`) — at :560119-560120 (doc cites :560113-560114, see C2 FAIL). The doc correctly classifies these as carryover and correctly notes the genuine v2.1.183 delta is that `respawnIfIdleStale` *also* now checks `session_cron`.
- **Genuine v2.1.183 deltas confirmed NEW (absence-greps in v2.1.156):** `detritusOnly` grep = 0, `"prewarm"` grep = 0, `tengu_bg_attach_upgrade` grep = 0 — all confirmed absent in v2.1.156, so `gFl`/`detritusOnly`, the prewarm loop, and the `Wzn` gate are correctly framed as NEW.
- **Open questions honored (not overclaimed).** "Working forever" (2.1.178) and `--bg -cn` (2.1.176) are carried as low/medium-low confidence in every doc that touches them (nested §9, env §7, agents-json §7, bg_command §7); the env doc's prewarm-leak attribution (2.1.172/2.1.174) is explicitly **medium-low**; the nested doc's fork-`Gz(parent)`-without-`+1` reading is explicitly **medium confidence, flagged for the verifier**. No overclaim found. (The fork no-`+1` read is verified true at :473586.)

This is a net-positive: the docs are *more* accurate than their own dossier on the retire/respawn deltas.

---

## C4 — Format audit

| Check | Result |
|---|---|
| (a) No obfuscated→readable mapping TABLE in module docs | **PASS.** Grep for `Obfuscated`/`Readable` table headers across the 5 docs = 0 hits. The only obf-bearing table is the `bg_command` TL;DR cross-version table (`Role \| v2.1.156 obf \| v2.1.183 obf \| line`) — the **allowed re-mangle exception**, explicitly labelled as such (line 29: "not an obfuscated→readable mapping table"). All other tables are delta / before-after / JSON-field / verdict tables. |
| (b) Every doc ends with `## Related Symbols` blockquote | **PASS.** All 5 docs have it (README:606, nested:562, env:457, agents-json:532, bg_command:800), each pointing at the four `../00_overview/symbol_index_*.md` + the per-feature additions file, then a list-format key-function index. |
| (c) Dual-version snippets use single-`====` header template | **PASS.** Per-doc bar/ORIGINAL/READABLE counts are balanced (e.g. nested: 22 bars / 11 ORIGINAL / 11 READABLE; env: 14/6/6; agents-json: 10/5/5; bg_command: 20/10/10; README: 20/10/10) — exactly one two-line `====` header block + one ORIGINAL + one READABLE per snippet. No doubled bars around ORIGINAL/READABLE. |
| (d) Relative links resolve | **PARTIAL.** Cross-tree `../../../claude_code_v_2.1.156/analyze/36_background_agents/*.md` (8 distinct targets) all resolve (THREE `../`, correct depth). Sibling `./*.md` and `../30_agent_team/implicit_team_and_agent_tool_spawn.md` and `../00_overview/symbol_additions_v2_1_183_background_agents.md` all resolve. **BUT** the four `../00_overview/symbol_index_*.md` targets in every `## Related Symbols` block **do not exist** in the v2.1.183 tree (only `symbol_additions_*` and `cross_validation_*` files are present). See issue below. |
| (e) English only | **PASS.** Only typographic non-ASCII used (`§ – — … ← → ↔ ⇒ ∈ ∪ ≤ ≥` + box-drawing); zero CJK / non-Latin word characters across all 5 docs. |

**Symbol-index link finding (low severity, tree-wide).** The four `symbol_index_core_execution.md` / `_core_features.md` / `_infra_platform.md` / `_infra_integration.md` files do **not yet exist** under `claude_code_v_2.1.183/analyze/00_overview/` (the dir holds only the per-feature `symbol_additions_*` and `cross_validation_*` files). The v2.1.156 tree *does* have them. The blockquote links are therefore currently broken forward-references. This is **not specific to background_agents** — the agent_team and workflow doc sets link identically, so the four index files are evidently a planned tree-wide consolidation step. The mandated `## Related Symbols` template requires these links, so the docs are template-compliant; they will only resolve once the four index files are created for this tree. Flagged so the fix pass either (a) creates the four index files, or (b) confirms they are an intentional pending consolidation.

---

## Semantic spot-check (verbatim reads)

- **`Gz` depth reader (nested §2, :103152).** `function Gz(e){ if(e.agentType==="main") return 0; return e.depth ?? 0; }` — exact. The doc's "`main` is depth 0, else stored `depth ?? 0`" is faithful. PASS.
- **`cio` depth gate placement (nested §3, :371188-371201).** The Agent line `if (Rc(i, vs)) return s < v1i;` genuinely **precedes** the `if (n && !UPt.has(...))` async block — the doc's core "the gate is hoisted above the async branch, so it is universal (the 2.1.181 fg/bg-shared mechanism)" claim is structurally verified in source. PASS — this is the load-bearing claim of the whole module and it holds.
- **`_Fl` four-pass scrub (env §2, :594705-594748).** Body byte-matches: `for(jLo)…; for(GLo)…; for(Object.keys: JLt.startsWith)…; if(WLo(s)){ for(XLt) delete; …}`. Passes 1-3 carry the `if(!e.env?.[a])` re-pass guard; pass 4 (`XLt`) has **no** re-pass guard — exactly as the doc claims ("host-managed tokens deleted unconditionally"). PASS.
- **`lGf` precedence ladder (agents-json §4, :691342).** `busy→working` first, then terminal-and-settled with the `!(success && jFe)` recurring exception, then `blocked`, else `working` — matches the doc's 5-step ladder and the recurring-job carve-out reasoning verbatim. PASS.
- **`gFl` detritus carve-out (bg_command §B.2, :595796 + :594990-595012/594914-594933).** `gFl = ["local_bash","in_process_teammate","dream"]`; the `detritusOnly = isSettled && kinds.every(∈gFl)` guard and the `tengu_bg_retired{…detritusOnly}` field are present; `detritusOnly` grep=0 in v2.1.156. The doc's carve-out analysis is sound. PASS.

---

## Verdict

**PASS (with fixes).** Every structural and behavioral claim across the five docs is backed by a verified source read. The two headline mechanisms — the universal `depth < 5` Agent-tool gate hoisted above the async branch (`cio`/`bte`/`Gz`/`v1i`, the 2.1.181 fg/bg-shared limit) and the four-pass provider-auth scrub (`_Fl`/`GLo`/`XLt`/`JLt`/`WLo`, the 2.1.181 leak fix) — are exactly as documented, read verbatim in both bundles. The `agents --json` three-source merge and the daemon retire/respawn deltas are likewise confirmed, and the bg_command doc's **correction of the dossier** (cliVersion-equality + cron/routine guards are carryover, not delta) is independently verified TRUE and is the docs' strongest accuracy win.

The defects are all **line-precision / transcription drift, never a wrong claim**:
1. five v2.1.183 anchor citations inside `sKn`/the supervisor tick drift 2-8 lines (`Zyn` :566860→566858; the four left_arrow anchors; the prewarm range-start :697259→697255);
2. two v2.1.156 before-picture cites off (cron/routine :560113-560114→:560119-560120; effort snippet variable `M`→`j`);
3. four broken `symbol_index_*.md` forward-links (tree-wide pending-consolidation, not content).

None affect the analysis. Fix the line numbers, fix the one mis-transcribed before-snippet variable, and resolve the index-link state, and the module is clean.

### Confidence roll-up

| Area | Confidence | Notes |
|---|---|---|
| Citation existence (C1) | **HIGH** | 30/35 exact; 5 drift 2-8 lines, declaration text + claims all correct |
| Before-picture (C2) | **HIGH** | 7/9 exact; 1 line-off (claim correct), 1 snippet-variable mis-transcription (substance correct) |
| Dossier corrections honored (C3) | **HIGH** | both carryover corrections independently re-verified TRUE; open questions not overclaimed |
| Format audit (C4) | **HIGH** (a/b/c/e) / **PARTIAL** (d) | no forbidden tables; all Related-Symbols present; single-header snippets; English-only; index-link targets missing tree-wide |
| Semantic accuracy | **HIGH** | 5/5 load-bearing snippets match verbatim source |

---

## Re-verification pass (skeptical re-read) + FIX-stage outcome

A second, independent skeptical verifier re-read all **42 load-bearing anchors** against the live v2.1.183 bundle. Result: **PASS with minor gaps** — **zero content defects** (no mis-deobfuscations, no wrong delta directions, no fabricated claims), **zero line-number drift** on the 42 re-checked anchors. The three depth-limit / env-isolation / agents-json delta analyses were re-confirmed high-confidence and well-grounded. Three gaps were flagged and have now been addressed by the FIX stage:

1. **Fork-gate vs depth-cap division of labour (was medium-confidence caveat) — CLARIFIED.** Added an explicit blockquote in [`nested_subagent_depth_limit.md`](../36_background_agents/nested_subagent_depth_limit.md) §1 (and matching §9 bullet) plus an upgraded caveat in [`README.md`](../36_background_agents/README.md) §1 and open-question §7.4: the `s < v1i` depth cap is **always enforced** by the `cio` filter with **no `CLAUDE_CODE_FORK_SUBAGENT` guard** on the `bte`→`cio` path (high confidence — the filter body has no env/GrowthBook call), while the gate (`vvd`/`L1i`) governs only the fork-feature *surface*. The cap being unconditional is now stated as settled; only the gate's precise reach remains medium-confidence/open.
2. **2.1.172 prewarm-leak class (provider-auth vs config-path) — DISAMBIGUATED (honestly, not resolved).** Added a residual note to [`worker_env_isolation_2181.md`](../36_background_agents/worker_env_isolation_2181.md) §7: `GLo`/`XLt`/`JLt` cover provider auth+routing but **not** config-path vars (`CLAUDE_CONFIG_DIR` is explicitly re-passed @594723; no project-settings-path scrub). Two readings — (a) provider-auth leak (covered by this rework) vs (b) config-path leak (a different patch) — are spelled out; the 2.1.174 "auth after idle" wording leans toward (a), but neither is decidable by source reading. Carried as the precise residual.
3. **"Working forever" (2.1.178) two-mechanism resolution — STATED EXPLICITLY as unresolved.** [`README.md`](../36_background_agents/README.md) §7.1 now distinguishes the two candidate loci as a **reporting** fix (`lGf`/`rDt` state mapper) vs a **lifecycle** fix (empty-idle-grace worker reap), notes both exist in v2.1.183, and records that deciding between them needs a binary-search runtime reproduction across the 2.1.177→2.1.178 builds — not a source audit. Honest open flag retained.

**Residual-resolution status:** of the four cross-validation residual items — (a) Working forever 2.1.178, (b) `--bg -cn` 2.1.176, (c) 2.1.161 worktree bg-edit, (d) prewarm-leak 2.1.172/2.1.174 — all are correctly carried as unresolved open questions with explicit honesty flags. (c) is a v2.1.156-baseline historical carryover, correctly not re-derived in the v2.1.183 delta tree. None claim false resolution; the FIX stage sharpened the *framing* of (a) and (d) without overclaiming a pin that source reading cannot support.

**FIX-stage verdict:** the three flagged gaps are addressed (one clarified to high-confidence, two sharpened as honest residuals). No content was changed — only honesty/confidence framing strengthened. The module remains PASS, now with the gaps explicitly closed or precisely bounded. Files touched by FIX: `36_background_agents/README.md`, `36_background_agents/nested_subagent_depth_limit.md`, `36_background_agents/worker_env_isolation_2181.md`, and this report.
