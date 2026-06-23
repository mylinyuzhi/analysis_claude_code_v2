# Cross-Validation Report — Module 30_agent_team (v2.1.183 delta tree)

- **Module:** `claude_code_v_2.1.183/analyze/30_agent_team/` — the v2.1.178 implicit-team REDESIGN (TeamCreate/TeamDelete removed, implicit session team at startup, Agent-tool-as-spawner, tmux `send-keys`→`respawn-pane` fix, SendMessage `"main"`/`uds:`/`bridge:` delta, coordinator-mode prompt deltas, background-task survival fix)
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.183/analyze/30_agent_team/` (5 files: `README.md`, `implicit_team_and_agent_tool_spawn.md`, `spawn_backends_and_tmux_fix.md`, `mailbox_lifecycle_and_sendmessage_delta.md`, `coordinator_and_background_survival.md`)
- **Scout dossier (spec):** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.183/analyze/_scout_dossier_agent_team.md`
- **TARGET bundle (v2.1.183):** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines)
- **Before-picture bundle (v2.1.156):** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649,979 lines)
- **v2.1.156 baseline docs (carryover targets):** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/30_agent_team/`
- **Reviewer posture:** default-to-FAIL skeptic. Every line below was read directly via `sed -n '<line>p'` against the cited bundle.

---

## C1 — Symbol existence (v2.1.183 citation spot-checks)

A representative sample of **38 distinct cited anchors** across the five docs was opened at its cited line in the **v2.1.183** bundle and confirmed to be the declaration the docs claim. Where a doc cited a line one or more lines *off* from the declaration (typically pointing at the function-body's first line rather than the `function name(` header), it is recorded as **PASS***  (symbol verified, line off-by-N) and itemized in §C6.

- PASS: 33
- PASS* (symbol correct, line off by 1–4): 4 distinct symbols (`Sl`, `YR`, `G4e`, `oI` in README; `v4e`/`Kyp` in README) — see §C6
- FAIL (wrong symbol at the cited line): 1 (README `f3n` @423515) — see §C6

| Symbol | Cited line (doc) | Verified declaration at that line | Verdict |
|--------|------------------|-----------------------------------|---------|
| `Sl` (isAgentSwarmsEnabled) | 293831 (implicit) / 293832 (README) | `function Sl()` @**293831**; body `if (!st(process.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS) && !yqd())` @293832 | PASS (implicit) / PASS* (README off-by-1) |
| `yqd` (hasAgentTeamsCliFlag) | 293828 | `function yqd()` | PASS |
| `Gbe` (getTeamsDir) | 735 | `function Gbe()` (`return ker.join(tr(), "teams")`) | PASS |
| `$A` (writeToMailbox) | 365950 | `async function $A(e, t, n)` | PASS |
| `v4e` (getInboxPath) | 365916 (mailbox) / 365920 (README) | `function v4e(e, t)` @**365916**; body `s = _Bn.join(Gbe(), r, "inboxes")` @365920 | PASS (mailbox) / PASS* (README off-by-4) |
| `Kyp` (ensureInboxDir) | 365924 (mailbox) / 365927 (README) | `async function Kyp(e)` @**365924** | PASS (mailbox) / PASS* (README off-by-3) |
| `Fhe` (readMailbox) | 365930 (mailbox) | `async function Fhe(e, t)` | PASS |
| `np` (TEAM_LEAD_NAME) | 362636 | `var np = "team-lead"` | PASS |
| `Gke` (PANE_HOLD_COMMAND) | 362642 | `Gke = "cat"` | PASS |
| `B8` (TMUX_COMMAND) | 362640 | `B8 = "tmux"` | PASS |
| `_lt` (TEAMMATE_COMMAND_ENV) | 362643 | `_lt = "CLAUDE_CODE_TEAMMATE_COMMAND"` | PASS |
| `LY` (RESERVED_MAIN_NAME) | 362512 | `var LY = "main"` | PASS |
| `pDa` (AGENT_NAME_RE) | 362645 | `pDa = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/` | PASS |
| `Rdo` (TEAMMATE_SYSTEM_PROMPT_ADDENDUM) | 420705 | `# Agent Teammate Communication` (template literal head) | PASS |
| `eDp` (createTeammateCanUseTool) | 420713 | `function eDp(e, t, n, r)` | PASS |
| `IDp` (buildAgentInputSchema) | 423446 | `(IDp = we(() => {` | PASS |
| `CDp` (baseAgentSchema) | 423431 (decl) / 423432 (cited) | `(CDp = we(() =>` @**423431**; `H.object({` @423432 | PASS* (off-by-1) |
| `zao` (model-facing schema) | 423478 | `(zao = we(() => {` | PASS |
| Agent `team_name` deprecation | 423458 | `team_name: H.string().optional().describe("Deprecated; ignored. The session has a single implicit team.")` | PASS |
| `vs` (Agent tool name) | 149939 | `var vs = "Agent"` | PASS |
| `f3n` (Agent tool def) | 423505 (implicit) / 423515 (README) | `(f3n = pi({` @**423505**; line 423515 is `maxResultSizeChars: 1e5` | PASS (implicit) / **FAIL (README @423515)** |
| Agent.call routing head | 423542–423549 | `let f = Date.now(), m = z9() ? void 0 : r, … _ = Sl() ? A.teamContext : void 0, b = !!c.teammateContext` | PASS |
| Agent.call teammate predicate | 423573 | `if (_ && s && !L) {` | PASS |
| "session team not initialized" | 422659 / 422777 / 422939 | all three: `"Internal error: session team not initialized. This should have happened at startup…"` | PASS |
| `cqa` (spawnTeammate) | 423053 | `async function cqa(e, t)` | PASS |
| `HDp` (handleTeammateSpawn) | 423041 | `async function HDp(e, t)` | PASS |
| `sqa` / `SDp` / `EDp` (leaf spawners) | 422925 / 422644 / 422762 | `async function sqa` / `SDp` / `EDp` | PASS |
| Bootstrap gate | 693472 | `if (Sl() && !xr() && !a.agentId)` | PASS |
| `j3f` (initializeSessionTeam) | 682765 | `async function j3f(e)` | PASS |
| `xic` (sessionTeamName) | 682752 | `function xic(e)` (`` `${B3f}-${e.slice(0,8)}` ``); `B3f="session"` @682817 | PASS |
| `F3f` (readInheritedTeamName) | 682755 (implicit) / 682756 (dossier) | `function F3f()` @**682755**; body `if (ZKt() === void 0)` @682756 | PASS (implicit) |
| `Aqa` (Agent description builder) | 423136 | `async function Aqa(e, t, n)` | PASS |
| `em` / `l1e` (teammate predicates) | 103466 / 103447 | `function em()` / `function l1e()` | PASS |
| `em()` description-hide block | 423264–423268 | `g = UN() ? "…" : em() ? "…teammates cannot spawn teammates." : ""` | PASS |
| `a3n` (sendCommandViaRespawn) | 421874 | `async function a3n(e, t, n)`; body `respawn-pane -k -t … --` @421876 | PASS |
| `Slt` (assertNoControlChars) | 362755 | `function Slt(e)` | PASS |
| TmuxBackend.sendCommandToPane (183) | 421900 | `async sendCommandToPane(e, t, n = !1)` | PASS |
| split-window `-d … -- Gke` (cat) | 422036 | `if (s) i = await kj(["split-window", "-d", "-t", n, "-h", "-l", "70%", … "--", Gke])` | PASS |
| `Ndo` (TmuxBackend) | 421879 | `class Ndo` | PASS |
| `kj`/`rqa` (tmux socket / inject) | 421866 / 422493 | `function kj(e)` / `async function rqa(e, t, n=!1)` | PASS |
| `p$p`/`o$p`/`rza`/`nza` (SendMessage def/schema/prompt/desc) | 434568 / 434558 / 434286 / 434314 | `p$p = pi({` / `(o$p = we(() =>` / `return ` (in `function rza()` @434285) / `var nza = "Send a message to another agent"` | PASS |
| `r$p`/`lza` (msg union / request_id regex) | 434542 / 434539 | `H.discriminatedUnion("type", [` / `lza = /^[^\n\r]{1,200}$/` | PASS |
| SendMessage.call `"main"` leg | 434694–434700 | `async call(e, t, n, r){ let o = t.agentId, s = o ? cza(t, o) : void 0, … if (… e.to === LY)` | PASS |
| `LLa`/`Lhe` (socket parser/gate) | 359974 / 359981 | `function LLa(e)` / `function Lhe(e)` | PASS |
| `iF` (protocol-frame predicate) | 366256 | `function iF(e)` (permission_request/response/…) | PASS |
| `i$p`/`a$p`/`cza`/`Llt` (sendTeammate/shutdown/name/builder) | 434357 / 434391 / 434343 / 366162 | `async function i$p` / `a$p` / `function cza` / `function Llt` | PASS |
| `zh`/`Gtt` (SendMessage/ListAgents name) | 221450 / 221577 | `var zh = "SendMessage"` / `var Gtt = "ListAgents"` | PASS |
| `oI`/`z9` (coordinator gate) | 221871 / 221892 (coord) ; 221870 (README) | `function oI()` @**221871**; `function z9()` @221892; line 221870 is `});` | PASS (coord) / PASS* (README `oI`@221870 off-by-1) |
| `yvd`/`bvd`/`_vd` (coordinator funcs) | 221898 / 221940 / 221916 | `function yvd(e)` / `function bvd()` / `function _vd(e, t)` | PASS |
| `zk`/`VAe`/`DCe` (Workflow/Artifact/gate) | 221550 / 221750 / 221839 | `var zk = "Workflow"` / `var VAe = "Artifact"` / `function DCe()` | PASS |
| `uP`/`edt`/`a3t` (TaskStop name/def/stop) | 220834 / 424867 / 424764 | `var uP = "TaskStop"` / `(edt = pi({` / `async function a3t(e, t)` | PASS |
| `G4e` (enqueueAgentNotification) | 445827 (coord) / 445826 (README) | `function G4e({` @**445827**; line 445826 is `}` | PASS (coord) / PASS* (README off-by-1) |
| `Lye`/`YR`/`tWe`/`Fut`/`ect` (keepalive set) | 445750 / 445753 / 445772 / 445779 / 445794 | `function Lye` / `YR` / `tWe` / `Fut` / `ect` | PASS (note: README cites `YR`@445754; decl is @445753 → PASS* off-by-1) |
| `_f`/`Ls`/`zts`/`wM` (enqueue/main-id/mode-enum) | 234006 / 2664 / 53866 / 53815 | `(_f = ug.enqueuePendingNotification)` / `function Ls()` / `(zts = we(() => cl.enum(wM)))` / `mz=[…];…wM=Wts` | PASS |

The `mode` enum array `wM` at 53815 reads `["acceptEdits","auto","bypassPermissions","default","dontAsk","plan"]` — matches the implicit doc's §2.2 claim verbatim.

---

## C2 — Body-level spot-checks (snippets read in full vs prose)

Eight load-bearing bodies were read end-to-end and matched against the dual-version snippets:

- **`a3n` respawn body @421875–421877** — `set-option -p -t … remain-on-exit failed`, then `respawn-pane -k -t … -- n`, then `if (r.code !== 0) throw new sF(…)`. Byte-for-byte the `spawn_backends_and_tmux_fix.md` §3.2 ORIGINAL. PASS.
- **Agent.call routing head @423542–423549** — exactly the `f/m/A/g/h/y/_/b` locals with `_ = Sl() ? A.teamContext : void 0`. Matches `implicit_team` §2.1. PASS.
- **`oI` body @221871–221877** — `if (!st(env.CLAUDE_CODE_COORDINATOR_MODE)) return !1; if (VI() && !_a() && !st(env.CLAUDE_CODE_REMOTE)) return !1; return !0;`. Matches `coordinator` §1.1, and is structurally identical to v2.1.156 `cI` (see C3). PASS.
- **SendMessage.call `"main"` leg @434694–434700** — `o=t.agentId; s=cza(t,o); i={kind:"peer"…}; a=…lDa(s,e.message); if (…e.to===LY)`. Matches `mailbox_lifecycle` §3.2. PASS.
- **`em()` description-hide @423264–423268** — the `UN()?…:em()?"…teammates cannot spawn teammates.":""` ternary. Matches `implicit_team` §2.6. PASS.
- **`NXr` body @299080** — `let t = WG(e); await mkdir(t)` — a directory create. See §C6 issue: README labels `NXr` "captureTeammateModeSnapshot" (inaccurate); the implicit doc's "ensureInboxesDir" is closer. PARTIAL.
- **`iF` body @366256–366263** — `Gt(e)` parse → `type` ∈ {permission_request, permission_response, …}; confirms the "protocol-frame predicate" framing. PASS.
- **`Dla` body @299006** (`if ($Xr === e) return; $Xr = e; n1t()`) — a current-team register/notify; both docs' readable names ("registerTeam"/"registerTeamForSession") are defensible. PASS.

- PASS: 6 ; PARTIAL: 2 (`NXr`, `oso` readable-name accuracy) ; FAIL: 0

---

## C3 — Before-picture (v2.1.156) spot-checks

Per the task, ≥5 v2.1.156 before-picture citations were opened in the v2.1.156 bundle. **7 checked, 7 PASS:**

| v2.1.156 symbol | Cited line | Verified at that line | Verdict |
|-----------------|-----------|------------------------|---------|
| `sendCommandToPane` (send-keys) | 380566 | `async sendCommandToPane(H,$,q=!1){ let _ = await (q?BE:kS)(["send-keys","-t",H,$,"Enter"]); …}` | PASS |
| `oN_` (resolveTeamName) | 398190 | `function oN_(H,$){ if(!R7()) return; return H.team_name || $.teamContext?.teamName; }` | PASS |
| `Th_` (TeamCreate def) | 406631 | `(Th_ = yK({` | PASS |
| `vh_` (TeamDelete def) | 406775 | `(vh_ = yK({` | PASS |
| `rd`/`Oo` (TeamCreate/Delete name) | 216438 / 216439 | `var rd = "TeamCreate"` / `var Oo = "TeamDelete"` | PASS |
| `hh_` (SendMessage msg union) | 407421 | `y.discriminatedUnion("type", [` | PASS |
| `c5H` (notification builder) | 435474 | `function c5H({` | PASS |
| `cI` (coordinator gate) | 216440 | `function cI(){ if(!xH(env.CLAUDE_CODE_COORDINATOR_MODE)) return !1; if (zT()&&!d6()&&!xH(env.CLAUDE_CODE_REMOTE)) return !1; return !0; }` | PASS |
| `mode: Y` destructure (mode NOT new) | 398370 | `run_in_background: _, name: z, team_name: A, mode: Y, isolation: f,` | PASS |
| cross-session-peer bullet (pre-existed) | 216533 / 216535 | `- **${nT}** - Stop a running worker` / `- **${n18} / ${cf}** (cross-session, …) … \`uds:...\` … \`bridge:...\`` | PASS |
| `iO4` (SendMessage prompt) | 407201 | `return \`` (prompt template head) | PASS |

The **`coordinator_and_background_survival.md` correction of the dossier is itself verified correct**: `grep -c "cross-session-message"` = **2 in v2.1.156** (and 3 in v2.1.183), and the worker-stop + peers bullets exist at v2.1.156 `216533`/`216535`. The dossier's §3.8 "coordinator did not include cross-session peers / worker-stop" claim was wrong; the doc caught it and documents the *real* (smaller) deltas. This is exactly the framing-trap resolution the task asks for, done honestly.

---

## C4 — Grep-based removal / absence claims (re-run)

Every quantitative claim in the docs was re-run against both bundles:

| Claim (doc) | Re-run result | Verdict |
|-------------|---------------|---------|
| `TeamCreate` 0 (183) / 6 (156) | 0 / 6 | PASS |
| `TeamDelete` 0 (183) / 5 (156) | 0 / 5 | PASS |
| `tengu_team_created` 0 / 1 | 0 / 1 | PASS |
| `tengu_team_deleted` 0 / 1 | 0 / 1 | PASS |
| `<note>` "comes to rest with no live background children" 0 (156) / 1 (183) | 0 / 1 | PASS |
| "is not a local socket address" 0 (156) / 1 (183) | 0 / 1 | PASS |
| "quote their exact words" (Real Delta A new) 0 (156) / 1 (183) | 0 / 1 | PASS |
| `cross-session-message` present in 156 (dossier-correction) | 2 (156) / 3 (183) | PASS |

All 8 quantitative claims reproduce exactly. The grep-as-proof methodology (these are string constants / telemetry event names, so absence is meaningful) is sound.

---

## C5 — Format audit

### (a) Forbidden `obfuscated | readable` mapping tables in module docs — NONE

`grep -cE '^\s*\|[-: ]+\|'` per doc: README 1, coordinator 1, implicit 2, mailbox 2, spawn 0. Each table's header row was classified:

| Doc | Table header | Kind | Verdict |
|-----|--------------|------|---------|
| README | `Dimension \| v2.1.156 \| v2.1.183 \| Evidence` | cross-version before/after contrast | **ALLOWED** (the brief explicitly permits a contrast table) |
| coordinator | `New filter (v2.1.183) \| Meaning \| Why` | semantic explanation of two `.filter` lines | ALLOWED |
| implicit | `\| \| v2.1.156 \| v2.1.183 \|` | 3-row cross-version routing comparison | ALLOWED |
| mailbox | `Token \| v2.1.183 count \| v2.1.156 count \| Meaning` | grep-count comparison | ALLOWED |
| mailbox | `\| \`to\` \| \|` | the SendMessage recipient table **inside a ```javascript fence** (quoted prompt content) | ALLOWED (not a markdown mapping table) |

**No `obfuscated → readable` mapping table exists in any module doc.** All symbol references use the required list format (`` `readableName` (obfuscated: `Xy2`, cli_inner_pretty.js:NNN) ``). PASS.

### (b) `## Related Symbols` blockquote ending

All 5 docs end with a `## Related Symbols` section pointing at the four `../00_overview/symbol_index_*.md` files + the per-feature additions file, then a list of key functions. PASS, with one structural oddity: **`mailbox_lifecycle_and_sendmessage_delta.md` has TWO `## Related Symbols` headers** (line 21 *and* line 394). The top one is an early pointer blockquote; the bottom one is the canonical closing section with the key-function list. Duplicate heading — flagged low (see Issues).

### (c) Dual-version snippet header template

`grep -c '^// ===='` per doc: README 2, coordinator 12, implicit 22, mailbox 10, spawn 16 — all **even** (2 bars per header box), so every snippet has exactly one `====`-bounded header and none wrap ORIGINAL/READABLE in their own bars. Spot-checked ~10 snippets across the docs: each carries `ReadableName - desc` + `// Location: cli_inner_pretty.js:line-range` + `// ORIGINAL (for source lookup):` + `// READABLE (for understanding):` + a trailing `// Mapping:` line. Well-formed. PASS.

### (d) Relative-link resolution

All `.md` links were resolved against the filesystem:

- **Cross-tree v2.1.156 baseline links (THREE `../`)** — all 5 resolve: `../../../claude_code_v_2.1.156/analyze/30_agent_team/{execution_modes_and_backend_registry,in_process_mode,cross_process_mode,mailbox_and_lifecycle_tools,cross_validation}.md`. PASS.
- **Sibling links** (`./implicit_team_and_agent_tool_spawn.md`, `README.md`, etc.) — resolve. PASS.
- **`../_asset_anchors.md`** — resolves. PASS.
- **`../00_overview/symbol_index_*.md` (×4) and `../00_overview/symbol_additions_v2_1_183_agent_team.md`** — **MISSING.** The `00_overview/` directory exists but is empty (these five targets do not yet exist). These links appear in the Related Symbols blockquote of **all 5 docs**. See Issues (medium): broken until the overview symbol files are authored.
- **One stylistic link** in `implicit_team` §2.3 uses `../30_agent_team/spawn_backends_and_tmux_fix.md` for a *sibling* (resolves, since `../30_agent_team/` from inside `30_agent_team/` is the same dir, but the convention is `./` or bare). Low.

### (e) English only

CJK / Japanese / Korean scan across all 5 docs: **0 hits**. All prose is English. PASS.

---

## C6 — Citation precision issues (off-by-N / wrong-line)

The docs are factually accurate on *which symbol* each anchor names; the defects below are **line-precision**: a cited line that points at the function-body's first line (or a stale line) instead of the `function name(` / `var name =` declaration. One is a genuine wrong-line (FAIL):

| Doc | Symbol | Cited | Actual decl | Δ | Severity |
|-----|--------|-------|-------------|---|----------|
| README (×3: L235) | `f3n` (Agent tool def) | 423515 | **423505** | +10 (423515 = `maxResultSizeChars: 1e5`, an unrelated property) | **medium (wrong line)** |
| README (L46, L227) | `Sl` | 293832 | 293831 | +1 (body line) | low |
| README (L50) | `v4e` (getInboxPath) | 365920 | 365916 | +4 (body line) | low |
| README (L50) | `Kyp` (ensureInboxDir) | 365927 | 365924 | +3 | low |
| README (L32,161,248) | `G4e` | 445826 | 445827 | −1 (`}` line) | low |
| README (L32,161,248) | `YR` | 445754 | 445753 | +1 (body line) | low |
| README (L161) | `oI` | 221870 | 221871 | −1 (`});` line) | low |
| implicit (L419, L640) | `CDp` base schema | 423432 | 423431 | +1 (`H.object({`) | low |

The deep-dive docs (`implicit_team`, `coordinator`, `mailbox`, `spawn`) cite the **correct** declaration lines for `Sl` (293831), `f3n` (423505), `YR` (445753), `G4e` (445827), `oI` (221871), `v4e` (365916), `Kyp` (365924). The README's contrast-table / index section is where the stale/off-by-one lines cluster (it appears to have inherited a few dossier-anchor-table lines that point at body lines rather than decls). Only the README `f3n` @423515 is a *wrong* line (the symbol is not at 423515 at all); the rest are ±1–4 off.

---

## C7 — Readable-name consistency between README and deep-dives

The README's `initializeSessionTeam` snippet `// Mapping:` line gives different readable names for three side-effect helpers than the `implicit_team` deep-dive does, and the README's names are the less accurate of the two:

| Symbol | README readable | implicit-team readable | Verified body @line | Accurate name |
|--------|-----------------|------------------------|----------------------|---------------|
| `NXr` | `captureTeammateModeSnapshot` | `ensureInboxesDir` | @299080 `let t = WG(e); await mkdir(t)` — a **directory create** | implicit-team's is closer; README's "modeSnapshot" is **wrong** (no snapshot here) |
| `Dla` | `registerTeam` | `registerTeamForSession` | @299006 `if ($Xr===e) return; $Xr=e; n1t()` — register current team | both defensible |
| `oso` | `emitTeamInit` | `recordTeamCreated` | @363019 `QKt().add(e)` — add to a tracking Set | neither verified; "emit"/"record" both loose |

Not a factual error about the delta, but a **cross-doc naming inconsistency** (CLAUDE.md Mistake #1/#3 class). The README and the deep-dive should agree on a single readable name per symbol, and `NXr→captureTeammateModeSnapshot` should be corrected (it is a `mkdir`, not a snapshot — `captureTeammateModeSnapshot` is plausibly a *different* symbol the dossier called `NXr` elsewhere; the actual `j3f`-called `NXr` @299080 makes a directory).

> **RESOLVED in fix pass.** Both deliverable docs now use a single reconciled name per symbol: `NXr → ensureTeamTasksDir` (the `mkdir` of `teamTasksDir(team)` = `<configDir>/tasks/<team>`), `Dla → registerTeamForSession`, `oso → recordTeamCreated`. The inaccurate `captureTeammateModeSnapshot` / `ensureInboxesDir` names no longer appear in any module doc.

---

## C8 — Framing-trap / open-question honesty

The docs honor the dossier's caveats rather than overclaiming — verified:

- **Dossier open-q #2 (`mode` new?)** — `implicit_team` §2.2 reads v2.1.156 `mode: Y` @398370 (re-verified here) and concludes `mode` is **NOT new**. Correct.
- **Dossier open-q #5 (SendMessage union trim?)** — `mailbox_lifecycle` §3.5 reads both `r$p` (183 @434542) and `hh_` (156 @407421) and concludes **no trim** (both are the same 3 members; the only real schema delta is the `lza` `request_id` regex). Correctly resolved *negatively*; not overclaimed as a removal.
- **Dossier §3.8 (coordinator cross-session peers NEW?)** — `coordinator` §2.1 **corrects the dossier**: the peer block / `uds:`/`bridge:` / `<cross-session-message>` / worker-stop bullet all pre-existed in v2.1.156 (verified: `cross-session-message` grep = 2 in 156; bullets @216533/216535). The doc downgrades the claim to the four *real* prompt deltas (approval-passthrough bullet, Concurrency rewrite, extended example, `_vd` worker-tool filter), all individually grep/line-verified. Exemplary skeptic behavior.
- **Dossier §3.5 / open-q #1 (bg-survival exact line) — NOW RESOLVED (high confidence).** `coordinator` §3.6 originally *raised* confidence (it isolated the `G4e` vs `c5H` superset diff and the new `<note>`) but preserved the unverified edge: whether the in-process runner `sDp` turn-end *also* changed vs v2.1.156 `JT_`. A re-verification pass line-diffed the idle path: **v2.1.183 `sDp` @`cli_inner_pretty.js:421263` NOW sets `evictAfter: Date.now() + zGe`** (`{ ...ie, isIdle:!0, evictAfter: Date.now() + zGe, onIdleCallbacks:[] }`), whereas **v2.1.156 `JT_` @`cli_inner_pretty.js:379909`** set only `{ ...fH, isIdle:!0, onIdleCallbacks:[] }` — no `evictAfter` (`zGe=30000` @439188, both bundles). So the turn-end *arms* the +30s eviction timer and the `G4e` notification-routing + `agent:*` keepalive pins *gate* it; both are components of the same survival fix. `coordinator_and_background_survival.md` §3.6 #1 was upgraded from "residual unverified edge" to RESOLVED in the fix pass, with the pinned v2.1.156 line and evidence recorded. Honestly carried, then closed.
- **Dossier open-q #6 (`F3f` env-var setter)** — `implicit_team` §1.2 keeps the **medium** confidence: mechanism (one-shot read+delete) verified, *who sets it* not pinned. Carried, not overclaimed.
- **`EDp` body (open-q #3)** — `implicit_team` §2.3/§4 explicitly states `EDp`'s body was read only at its guard head, not exhaustively diffed against `SDp`. Carried.

No overclaiming detected. The medium/low confidence flags are propagated into the prose at each site.

---

## Confidence roll-up

| Area | Confidence | Notes |
|------|-----------|-------|
| Symbol existence (C1) | **HIGH** | 38 anchors; symbol correct in 38/38; 1 wrong-*line* (README `f3n`@423515), 6 off-by-1–4 *lines* (README/index), all in README contrast/index section |
| Body/semantics (C2) | **HIGH** | 6/8 full bodies match prose verbatim; 2 are readable-name-accuracy nits (`NXr`,`oso`) |
| Before-picture (C3) | **HIGH** | 11/11 v2.1.156 anchors confirmed; dossier-correction independently verified |
| Grep claims (C4) | **HIGH** | 8/8 quantitative claims reproduce exactly |
| Format scan (C5) | **HIGH (content)** | no forbidden tables; snippets well-formed; English only; **MEDIUM (links)** — 5 overview links broken (files not yet authored) |
| Framing/open-questions (C8) | **HIGH** | caveats honored; dossier §3.8 correctly overturned with evidence; bg-survival open-q #1 (`sDp` turn-end) RESOLVED in fix pass (`evictAfter` added @421263 vs v2.1.156 @379909) |

**Aggregate:** of the discrete checks recorded (38 C1 + 8 C2 + 11 C3 + 8 C4 + format scan), the **factual/analytical content is accurate** — every delta claim (TeamCreate/Delete removal, implicit team, routing rewrite, tmux respawn fix, `"main"`/`uds:`/`bridge:`, coordinator prompt deltas, bg-survival fix) is corroborated at the cited bundle lines. The defects are (1) one wrong-line citation in the README (`f3n`@423515), (2) a cluster of ±1–4 off-by-one line citations in the README index/contrast section, (3) five broken `../00_overview/symbol_*` links present in every doc (target files not yet created), (4) a README↔deep-dive readable-name inconsistency for `NXr`/`Dla`/`oso`, and (5) a duplicate `## Related Symbols` header in the mailbox doc.

**Overall verdict: PASS (with fixes).** The analysis is substantively correct and the citations resolve to the claimed symbols; the open issues are line-precision, cross-doc naming consistency, and not-yet-authored overview link targets — all mechanical, none invalidating a delta finding. The single most important reviewer note is that the **deep-dive docs are the authoritative line source** (they cite the declaration lines correctly); the README should be reconciled to them.

---

## Issues for the fix pass

1. **[medium] README `f3n` wrong line.** `README.md:235` cites the Agent tool def `f3n` at `cli_inner_pretty.js:423515`; that line is `maxResultSizeChars: 1e5`. The decl `(f3n = pi({` is at **423505**. Fix: change `@423515` → `@423505` (matches `implicit_team` L639).
2. **[medium] Five broken `../00_overview/symbol_*` links in all 5 docs.** The Related Symbols blockquote in every doc links `../00_overview/symbol_index_{core_execution,core_features,infra_platform,infra_integration}.md` and `../00_overview/symbol_additions_v2_1_183_agent_team.md`, but `00_overview/` is empty. Fix: author the `symbol_additions_v2_1_183_agent_team.md` (and ensure the four index files exist) so the links resolve, OR adjust the links to the correct location of the v2.1.183 index files if they live elsewhere.
3. **[low] README off-by-one/-N line citations** (cluster): `Sl`@293832→**293831**; `v4e`@365920→**365916**; `Kyp`@365927→**365924**; `G4e`@445826→**445827**; `YR`@445754→**445753**; `oI`@221870→**221871**. Fix: reconcile the README index/contrast lines to the declaration lines used by the deep-dives.
4. **[low] `implicit_team` `CDp` off-by-one.** `:423432` → decl is **423431** (`(CDp = we(() =>`). Fix optional (423432 is the schema body's first line `H.object({`).
5. **[low] README↔deep-dive readable-name inconsistency for `NXr`/`Dla`/`oso`.** README `initializeSessionTeam` `// Mapping:` calls `NXr→captureTeammateModeSnapshot` (inaccurate — `NXr`@299080 is a `mkdir` of `WG(e)`), `Dla→registerTeam`, `oso→emitTeamInit`; `implicit_team` calls them `ensureInboxesDir`/`registerTeamForSession`/`recordTeamCreated`. Fix: pick one readable name per symbol across both docs; correct `NXr` away from "modeSnapshot" (use `ensureTeamDir`/`ensureInboxesDir`).
6. **[low] Duplicate `## Related Symbols` heading** in `mailbox_lifecycle_and_sendmessage_delta.md` (lines 21 and 394). Fix: demote the early pointer (line 21) to a non-`##` lead-in (e.g. a plain blockquote without the `## Related Symbols` heading), keeping a single canonical closing section.
7. **[low] Sibling link uses `../30_agent_team/`** in `implicit_team` §2.3 (line 515) for `spawn_backends_and_tmux_fix.md`. Fix: change to `./spawn_backends_and_tmux_fix.md` or bare `spawn_backends_and_tmux_fix.md` for convention consistency.

---

## Re-verification pass (fix-pass update)

A second skeptical pass re-read all 67 sampled load-bearing anchors against the live v2.1.183 bundle. **Verdict: PASS** — no drift, no content defects, no gaps. The one carried open-question was resolved:

- **bg-survival open-q #1 (`sDp` turn-end) — RESOLVED, high confidence.** The in-process turn-end idle path now arms eviction: v2.1.183 `sDp` @`cli_inner_pretty.js:421263` sets `{ ...ie, isIdle:!0, evictAfter: Date.now() + zGe, onIdleCallbacks:[] }`; v2.1.156 `JT_` @`cli_inner_pretty.js:379909` set `{ ...fH, isIdle:!0, onIdleCallbacks:[] }` (no `evictAfter`). `zGe = 30000` @`cli_inner_pretty.js:439188`. The turn-end *arms* the +30s eviction; the `G4e` notification routing + `agent:*` keepalive pins *gate* it. Applied to `coordinator_and_background_survival.md` §3.6 #1 (upgraded to RESOLVED), the doc intro framing, its Related Symbols list (added `sDp`), and `symbol_additions_v2_1_183_agent_team.md` (§5 `sDp` row + Notes & Caveats).

Headline deltas re-confirmed at this pass: TeamCreate/TeamDelete removed (grep=0 vs 6/5 in v2.1.156); implicit session team bootstrap `j3f`@682765 with `session-<id[:8]>` naming `xic`@682752; Agent routing rewrite `if(_ && s && !L)`@423548; tmux `respawn-pane -k` `a3n`@421874 with `cat` placeholder `Gke`@362642 and control-char guard `Slt`@362755; SendMessage `"main"` `LY`@362512 with prompt row @434295-434298 and routing leg @434694-434719; `Lhe` socket gate @359981; bg-survival `G4e`@445827 with owner-alive gate + keepalive routing + new `<note>`@445887. No contradictions. The pre-existing dossier-correction (coordinator cross-session peers pre-dated v2.1.156, @216535) re-confirmed.
