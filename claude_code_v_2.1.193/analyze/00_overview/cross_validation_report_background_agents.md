# Cross-Validation Report — Module 36_background_agents (v2.1.193 delta)

- **Theme:** background_agents (Background Agents & Subagent Depth, v2.1.183 → v2.1.193)
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.193/analyze/36_background_agents/`
- **Docs audited:** `README.md`, `bg_shell_pressure_reap.md`, `subagent_depth_tracking.md`, `agent_stop_lifecycle.md`, `backgrounding_and_panel_fixes.md`
- **Additions file:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.193/analyze/00_overview/symbol_additions_v2_1_193_background_agents.md`
- **TARGET bundle (193):** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines, build `a1938d2a`)
- **BEFORE-PICTURE (183):** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines)
- **EARLIER BASELINE (156):** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649,979 lines)
- **v2.1.88 named-TS reference:** `/lyz/codespace/3rd/claude-code/src/`

**Sample:** **95** distinct 193 anchors re-read at their exact cited lines in the TARGET bundle · **25** before-picture re-reads (15 decl/region reads in the 183 bundle + 10 zero/count confirmations in the 156 bundle) · **10** grep-count diffs re-run in all three bundles.

**Verdict (one line):** **PASS WITH FIXES.** Every load-bearing mechanism is real and correctly located. All three NET-NEW claims (memory-pressure reaper, subagent depth-cap throw, stop-is-permanent), the CARRYOVER claim (turn-end "working" finalizer), the bg-job metadata-refresh mechanism (`k3i`/`R3i`/`$Kr`), the bounded panel-render mechanism (`dSc`/`Eim`/child-row overflow slice), and the bounded channel-status boundary (`task_updated`/status snapshots/control-socket update replies) are confirmed against live 183+156 evidence — **zero false deltas**. Six anchor-level defects were found and fixed in place: two +1 line drifts (`Mde`, `CXp`), one obf→readable mislabel (`Re` = `tengu_feature_bad` logger, not "logToolEvent"), one identity-passthrough clarification (`Ou`, with `t7l` added as the real path builder), one off-by-a-few citation drift in a parenthetical aside (the `summary` arg, applied at two line numbers), and the stale panel pointer to the `subagentStatusLine` schema replaced with real panel-render anchors. No fabricated anchors, no false NET-NEW/CARRYOVER attributions.

---

## C1 — Anchor PASS/FAIL list (193 TARGET bundle)

Every line below was opened at the exact cited line in the 193 bundle and the declaration/string confirmed.

### bg_shell_pressure_reap.md

| Obf → Readable | Cited line | Verified | Result |
|---|---|---|---|
| `Mgl` → registerBgShellPressureReaper | 454354 | `function Mgl(e, t, n, r, o, s) {` | PASS |
| arm gate `s===void 0 && !Tr() && !…DISABLE…` | 454357 | exact | PASS |
| `task_local_shell_pressure_reap` (Ie call) | 454361 | `(Ie("task_local_shell_pressure_reap"), o8t(...), BSe(...))` | PASS |
| `process.on("memoryPressure", a)` | 454363 | exact | PASS |
| `Ldu` → CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP (getter) | 43175 | `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP: () => Ldu,` | PASS |
| `Ldu = Fe.bool()` (parse) | 43538 | `(Ldu = Fe.bool()),` | PASS |
| `eof` → BG_SHELL_IDLE_REAP_MS = 1800000 | 454610 | `eof = 1800000,` | PASS |
| `VI` → getLastInteractionTime | 2784 | `function VI() { return Nt.lastInteractionTime; }` | PASS |
| `umr` → isMainLoopBusy | 3647 | `function umr() { return Nt.mainLoopBusy ?? !1; }` | PASS |
| `Tr` → isRemoteMode | 3061 | `function Tr() { return !Nt.isInteractive; }` | PASS (see residual R1) |
| `e8e` → hasActiveAgentTasks | 587048 | `function e8e(e){…R4f.has(t.type) && !Gw(t.status)…}` | PASS |
| `R4f` → ACTIVE_AGENT_TASK_TYPES | 587093 | `new Set(["local_agent","remote_agent","in_process_teammate","local_workflow"])` | PASS |
| `Gw` (terminal-status helper behind guard 7) | 587045 | `return e==="completed"\|\|e==="failed"\|\|e==="killed";` | PASS |
| `o8t` → notifyAndFinalizeShellTask | 454302 | `function o8t(e, t, n, r, o, s, i="bash", a){` | PASS |
| `BSe` → killLocalShellTask | 382320 | `function BSe(e, t) {` | PASS |
| `g9e` → registerKeepalive / `h9e` → deregisterKeepalive | 453737 / 453744 | both `function …(e,t,n){` | PASS |
| `xPe` → launchBackgroundLocalBash | 454369 | `async function xPe(e, t) {` | PASS |
| `Kzn` → backgroundRunningShellTask | 454527 | `function Kzn(e, t, n, r, o) {` | PASS |
| arm call-site #1 (xPe) passes agentId | 454388 | `Mgl(u, r, l, s, a, i)` (6th arg = agentId `i`) | PASS |
| arm call-site #2 (Kzn) passes agentId | 454536 | `Mgl(e, n, r, o, void 0, i)` (6th arg = agentId `i`) | PASS |

### subagent_depth_tracking.md

| Obf → Readable | Cited line | Verified | Result |
|---|---|---|---|
| `FBt` → SUBAGENT_DEPTH_LIMIT = 5 | 229871 | `FBt = 5,` | PASS |
| `K3` → getAgentDepth | 103808 | `function K3(e){ if(e.agentType==="main") return 0; return e.depth ?? 0; }` | PASS |
| `Kl` → isLocalAgentTask | 453726 | `function Kl(e){…e.type==="local_agent";}` | PASS |
| `RPe` → SubagentLaunchError | 430357 | `RPe = class RPe extends Error {` | PASS |
| spawn-time throw `if (g >= FBt) throw …` | 430477–430484 | exact block | PASS |
| `Re(...)` depth-cap telemetry call | 430480 | `Re("subagent_launch", "subagent_depth_cap"),` | PASS |
| "Subagent nesting limit reached" string | 430482 | exact | PASS |
| fresh-spawn child depth `X = K3(c.agentContext)+1` | 430685 | exact | PASS |
| resume-restore expr `(Kl(_)?_.spawnDepth:b?.spawnDepth)??K3(i.agentContext)+1` | 441544 | exact | PASS |
| `Re` decl (mislabeled — see D-fix) | 44848 | `function Re(e,t,n){ V("tengu_feature_bad", {…feature_name:$e(e), error_code:t}); }` | FIXED |

### agent_stop_lifecycle.md

| Obf → Readable | Cited line | Verified | Result |
|---|---|---|---|
| `Mde` → markAgentStoppedByUser | ~~431809~~ → **431808** | `function Mde(e, t) {` | FIXED (+1 drift) |
| `CXp` → persistStopMarker | ~~431817~~ → **431816** | `async function CXp(e, t) {` | FIXED (+1 drift) |
| `Hre` → readAgentDiskState | 581895 | `async function Hre(e) {` | PASS |
| `Tde` → writeAgentDiskState | 581867 | `async function Tde(e, t) {` | PASS |
| `t7l` → agentStateMetaPath (real path build) | 581864 | `Mx(e).replace(/\.jsonl$/, ".meta.json")` | PASS (added) |
| `Ou` → agentDiskStatePath | 1792 | `function Ou(e){ return e; }` (identity) | FIXED (clarified) |
| serializer `…(t.stoppedByUser && {stoppedByUser:!0})` | 581883 | exact (spawnDepth at 581884) | PASS |
| `Vht` → AgentStoppedError | 441779 | `Vht = class Vht extends ZF {` | PASS |
| `b` = readAgentDiskState in resume path | 441524 | `[y, b] = await Promise.all([jPe(Ou(e)), Hre(Ou(e))])` | PASS |
| resume guard (a) `if (b?.stoppedByUser)` + clear-on-force | 441527 | exact, incl. AgentStoppedError msg + `{stoppedByUser:re,...ce}` rewrite | PASS |
| resume guard (b) `if (!c && Kl(X) && X.stoppedByUser)` | 441645 | exact | PASS |
| resume guard (c) SendMessage `if (p.stoppedByUser)` + `success:!1` msg | 442238 | exact message text | PASS |
| `Exo` → markReplayNoOp | 464591 | `async function Exo()` — body matches (tempo:"blocked", needs:UG) | PASS |
| `Gaf` → resetStartupJobState / `Waf` → armBgStartupWedge | 464549 / 464561 | `async function Gaf()` / `function Waf(e)` | PASS |
| `UG` → BG_TURN_END_NEEDS_USER | 193813 | `UG = "send a prompt to start",` | PASS |
| call site `else (…markReplayNoOp…, Exo().catch())` | 689757 / 689760 | exact debug + call | PASS |

### backgrounding_and_panel_fixes.md

| Obf → Readable | Cited line | Verified | Result |
|---|---|---|---|
| `oUo` → countAbandonedBgTasks | 578073 | `function oUo(e,t=fze(e)){ return y_t(e).count - H7t(e,t); }` | PASS |
| `fze` → computeCarryOverMap | 578006 | `function fze(e){ … if(!XKl()) return t; … }` | PASS |
| `fze` adoptable predicate `o = (i) => {…}` | 578019–578052 | exact (`Kl`/`iT`/`Aqt` branches) | PASS |
| `fze` main-session filter | 578022 | `i.agentType !== "main-session" && i.status === "running" && …` | PASS |
| `H7t` → countCarryOverTasks | 578070 | `function H7t(e,t=fze(e)){…}` | PASS |
| `y_t` → countBackgroundTasks | 485964 | `function y_t(e){…}` | PASS |
| interstitial guard `if (FI>0 \|\| (!confirmedInterstitial && Qo>0))` | 689571 | exact | PASS |
| warning string `${Qo} background … would be abandoned` | 689578 | exact | PASS |
| skip-ahead variant `… would be abandoned by skipping ahead` | 690133 | exact | PASS |
| `Lgl` → registerCompletedResumedAgent (+`?? "general-purpose"` / `?? "(resumed agent)"`) | 454100 | `function Lgl(e, t)` + `agentType: e.agentType ?? "general-purpose"`@454112 | PASS |
| adoption loop `(await QKl(ho), Lgl(ho,Ye), zt.add(…), gn.push(ho))` | 688699 | exact | PASS |
| `JKl` → readJobDir / `QKl` → linkAdoptedAgentTranscript | 577927 / 577951 | both `async function …(e)` | PASS |
| `WWn` → getResumePrompt | 371461 | `function WWn(){ return process.env.CLAUDE_CODE_RESUME_PROMPT \|\| "Continue from where you left off."; }` | PASS |
| resume-prompt inject (interrupted_turn) | 371503 | `Kb([Pn({content: WWn(), isMeta:!0})])` under `kind==="interrupted_turn"` | PASS |
| resume-prompt inject (auto-resume deferred tool) | 706889 | `w_({mode:"prompt", … value: WWn(), …})` | PASS |
| `$Kr` → currentBgCwdOverride | 193511 | `function $Kr() { return x3i; }` | PASS |
| `k3i` → refreshBgJobCwdAfterCd | 193514 | bg-only `CLAUDE_JOB_DIR`/`CLAUDE_CODE_SESSION_KIND` guard, writes `cwd`/`originCwd` | PASS |
| `R3i` → refreshBgJobResumePointers | 193529 | bg-only guard, writes `resumeSessionId`, `linkScanPath`, `linkScanOffset: 0` | PASS |
| `/cd` call to `k3i` | 484488 | `if (r) await k3i(Mt());` after successful chdir/transcript move | PASS |
| conversation reset call to `R3i` | 485419 | `if ((await BJ(), await R3i(xt(), jf()), l)) ...` after new session id | PASS |
| classifier consumes cwd override | 465236 / 465238 | `cwd: $Kr() ?? v?.cwd ?? Mt()` and non-worktree `originCwd: ... ($Kr() ?? v?.originCwd)` | PASS |
| 183 reset before-picture | 476579 | `if ((await lX(), l)) await NW(...)` — no bg-job resume pointer refresh between reset and prompt replay | PASS |
| 183 classifier before-picture | 456715 / 456717 | `cwd: T?.cwd ?? Pt()`, `originCwd: T?.originCwd` — no cwd override | PASS |
| `agentType:"main-session"` sentinel | 441096 | exact | PASS |
| main-session exclude filters | 453732 / 453735 | both `Kl(…) && …agentType !== "main-session"` | PASS |
| async_launched body (drops "end your response") | 431253–431261 | exact (both branches lose the stop directive) | PASS |
| remote_launched still says "end your response" | 431248 | `Briefly tell the user what you launched and end your response.` | PASS |
| `summary:'<5-10 word recap>'` arg | ~~431260~~ → **431255** | exact (193) | FIXED (cite drift) |
| `Eim` → measureChildArtifactWidth | 674539 | `function Eim(e)`; 193 returns fallback width for frame-only child lists at `:674548` | PASS (supplemental panel audit) |
| `Him` → computeAgentPanelColumns | 674550 | column calculator consumes `Eim(a.state)` for artifact width | PASS (supplemental panel audit) |
| `ESc` → buildAgentPanelRows | 674574 | headers/jobs/folds row builder for the panel | PASS (supplemental panel audit) |
| `dSc` → mapAgentPanelChildRows | 674897 | maps `kind==="frame"` to a visible child-row object instead of filtering it out | PASS (supplemental panel audit) |
| `FSc` → agentPeekPanel | 675223 | detail/peek component receives `childRows: l` | PASS (supplemental panel audit) |
| detail-panel child-row budget | 675425 / 675427 / 675565 | computes visible row budget, slices `l.slice(0, qe)`, renders `"… N more"` for hidden rows | PASS (supplemental panel audit) |
| `Qim` → agentRosterRow | 675696 | roster-row renderer receives `childRows: d` | PASS (supplemental panel audit) |
| roster passes mapped child rows | 678001 | `childRows: Xl.state.children ? dSc(Xl.state.children, x) : []` | PASS (supplemental panel audit) |
| peek panel passes focused child rows | 678193 | `childRows: Koe` into `FSc` | PASS (supplemental panel audit) |
| 183 child mapper before-picture | 661843–661864 | `JJl` filtered `.filter((n) => n.kind !== "frame")`; 183 artifact width `wBf` returned `0` for frame-only child lists at `:661521` | PASS (before-picture) |
| `task_updated` event schema | 700169 | wire-safe task status patch subset (`status`, `description`, `end_time`, `total_paused_ms`, `error`, `is_backgrounded`) | PASS (supplemental channel audit) |
| `task_updated` output filter | 705474 | streaming/headless output explicitly allows `task_updated` through | PASS (supplemental channel audit) |
| agents-view status snapshots | 677134 / 677136 / 677169 / 677171 | open/attach state carries `loopKicks`, `statuses`, `statusesTs` | PASS (supplemental channel audit) |
| `knownAlive` freshness hint | 678593 | `Date.now() - statusesTs < 1500 && statusForJob(...) !== void 0` before respawn/reattach | PASS (supplemental channel audit) |
| daemon update compatibility replies | 715740 / 715852 | stale client/control-key update rejection + "job is restarting on the updated Claude Code" attach retry | PASS (supplemental channel audit; matching 183 strings at 696483 / 696585) |

---

## C2 — False-delta hunt (the highest-value check)

Every NET-NEW / CARRYOVER / count claim re-run with `grep -c` in **193 + 183 + 156**:

| Stable string | 193 | 183 | 156 | Doc claim | Verdict |
|---|---|---|---|---|---|
| `memoryPressure` | 1 | 0 | 0 | NET-NEW (0→1) | **CONFIRMED NET-NEW** |
| `task_local_shell_pressure_reap` | 1 | 0 | 0 | NET-NEW (0→1) | **CONFIRMED NET-NEW** |
| `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP` | 2 | 0 | 0 | NET-NEW (0→2) | **CONFIRMED NET-NEW** |
| `subagent_depth_cap` | 1 | 0 | 0 | NET-NEW (0→1) | **CONFIRMED NET-NEW** |
| `Subagent nesting limit reached` | 1 | 0 | 0 | NET-NEW (0→1) | **CONFIRMED NET-NEW** |
| `stoppedByUser` | 9 | 0 | 0 | NET-NEW (0→9) | **CONFIRMED NET-NEW** |
| `would be abandoned` | 2 | 0 | 0 | ISOLABLE (0→2: :689578 + :690133) | **CONFIRMED net-new in window** |
| `reply-on-resume` | 8 | 4 | 3 | CARRYOVER + 4 added debug logs | **CONFIRMED carryover + logging** |
| `"main-session"` | 10 | 9 | 8 | guard 9→10 in window | **CONFIRMED 9→10** |
| `EventSource` | 4 | 4 | 4 | false-delta caution (feature-gate SDK, unchanged) | **CONFIRMED carryover (4=4)** |

**Turn-end "working" finalizer — CARRYOVER proof re-verified.** 183 `pgo`@456114 is byte-equivalent to 193 `Exo`@464591 (identical guard `if (!t || t.state !== "working" || t.tempo !== "active") return;` and identical `tempo:"blocked", needs:<sentinel>` write — `Y4`@183 → `UG`@193 is just the re-mangled `needs` sentinel). 183 call site `} else pgo().catch(() => {});`@675899 pre-exists, matching 193's `} else (…, Exo().catch(() => {}));`@689760. The only window change at this surface is the two added `[reply-on-resume]` debug strings (the 4→8 count). **The doc's "CARRYOVER, not a 183→193 delta" honesty flag is correct.**

**Subagent depth before-picture re-verified.** 183 `:434085` reads `y = (od(g) ? g.spawnDepth : void 0) ?? Gz(o.agentContext) + 1,` — the else-branch is literally `void 0`, exactly as the doc claims; 193 `:441544` replaces it with `b?.spawnDepth`. The depth value `5` is carryover (`v1i=5`@183 / `FBt=5`@193); only *which spawns are counted* changed (the new `>= FBt` throw). No false delta.

**async_launched "end your response" drop re-verified.** 183 `:424287`/`:424290` both end the async_launched branches with "…and end your response.…"; 193 `:431258`/`:431261` drop it. The Cloud/`remote_launched` path keeps "end your response" in **both** versions (193 `:431248`) — the doc's "scoped to async only, do not claim cloud changed" caution is correct.

**Result: 0 false deltas.** Every NET-NEW is genuinely absent in both 183 and 156; every CARRYOVER is genuinely present in 183; every grep-count diff reproduced exactly.

---

## C3 — Lineage (v2.1.88) spot-check

The docs make only a *negative* 88 claim (subagent_depth_tracking.md §Evidence): "the v2.1.88 named-TS tree predates the persisted-`spawnDepth` / disk-resume model entirely." This is a non-existence assertion (no ancestor to map), so there is nothing to falsify in `/lyz/codespace/3rd/claude-code/src`; it is consistent with the post-88 on-disk agent-state store (`Hre`/`Tde`/`t7l`) that has no 88 analogue. No invented ancestors anywhere in the theme.

---

## C4 — Defects fixed in place

1. **`Mde` line drift (+1).** README (§at-a-glance + headline), `agent_stop_lifecycle.md` (prose, snippet header range, evidence table, Related Symbols), and `symbol_additions` cited `markAgentStoppedByUser` at `:431809`; the `function Mde(e, t) {` declaration is at **431808** (431809 is its first body line). Fixed every occurrence to 431808.
2. **`CXp` line drift (+1).** Same files cited `persistStopMarker` at `:431817`; `async function CXp(e, t) {` is at **431816**. Fixed every occurrence to 431816.
3. **`Re` obf→readable mislabel.** `subagent_depth_tracking.md` (snippet READABLE + Mapping) and `symbol_additions` labeled `Re` as `logToolEvent` and cited the call line `:430480` for a "function". `Re`@**44848** is `function Re(e,t,n){ V("tengu_feature_bad", {…feature_name:$e(e), error_code:t}); }` — a feature-**error** telemetry emitter (confirmed across 10+ `Re("subagent_launch","…")` error-code call sites). Relabeled to `logFeatureError`, noted it emits `tengu_feature_bad`, and moved the `function` cite to the decl line 44848 (call at 430480 noted).
4. **`Ou` identity-passthrough clarification + `t7l` added.** `Ou`@1792 is `function Ou(e){ return e; }` (identity), not a path builder; the real `<agentId>.meta.json` join lives in `t7l`@581864 (`Mx(e).replace(/\.jsonl$/, ".meta.json")`), called inside `Hre`/`Tde`. Annotated the `Ou` rows in `symbol_additions` and `agent_stop_lifecycle.md` Related Symbols, and added a `t7l` → `agentStateMetaPath` row to `symbol_additions` so the actual path builder is indexed.
5. **`summary` arg citation drift.** `backgrounding_and_panel_fixes.md` parenthetical cited the `summary:'<5-10 word recap>'` arg at `:431260` (193) / `:424286` (183); the actual lines are **431255** (193) / **424284** (183). Fixed.
6. **Panel schema-anchor replacement.** The panel sibling-hiding note cited the `subagentStatusLine` settings schema. Replaced it with the verified panel-render region: `dSc@674897` maps frame children into visible rows, `Eim@674539` reserves frame-only artifact width, and the detail panel slices child rows at `:675425-675428` with the hidden-tail row at `:675565-675568`.

(6 distinct defects across 9 Edit operations. No content was churned where the docs were already correct.)

---

## C5 — Residuals (honest)

- **R1 — `Tr` → isRemoteMode is a soft abstraction.** `Tr`@3061 is literally `function Tr(){ return !Nt.isInteractive; }` (i.e. `isNonInteractive`). The reaper arms only when `!Tr()` ⇒ interactive sessions. Naming it `isRemoteMode` is defensible (remote/headless runs are non-interactive) and the behavioral description ("arm only for top-level interactive shells, not remote") is correct, so I left it — but a strict reader should note the literal predicate is `!isInteractive`.
- **R2 — `Ie` → logEvent.** `Ie`@44845 is `V("tengu_feature_ok", …)` (sibling of `Re`'s `tengu_feature_bad`). The doc's generic `logEvent` rendering for the reap-signal telemetry is acceptable; the underlying event is `tengu_feature_ok` with `feature_name:"task_local_shell_pressure_reap"`. Not changed (generic name is not wrong).
- **R3 — UI/channel items (panel-fixes §5–6).** The direct pin-specific UI guard remains correctly bounded as inferred / LOW confidence; the `EventSource` false-delta caution is verified (4=4 across all three bundles). The panel sibling-hiding/row-jump item is now bounded to the render mechanism (`dSc` maps frame children; `Eim` reserves frame-only artifact width; detail panel slices child rows), and the channel-drop item is bounded to `task_updated` delivery, status snapshots, and daemon update compatibility replies, but both exact changelog patch lines remain unisolated. The formerly low-confidence pinned-reprompt locus has a source-backed mechanism: 193 adds bg-job cwd/resume metadata refresh (`$Kr`/`k3i`/`R3i` plus calls `:484488`/`:485419`), while `WWn` itself remains carryover.

---

## Final verdict

**PASS WITH FIXES — confidence HIGH.** The background_agents theme docs are substantively accurate: all 95 sampled 193 anchors resolve to the claimed declarations/strings, all three headline NET-NEW mechanisms plus the bg-job metadata refresh are genuinely absent in the checked 183 windows, the one CARRYOVER (turn-end finalizer) is byte-equivalent to a pre-existing 183 function with a pre-existing call site, and there are **zero false deltas**. The six fixed defects were all low-severity (two +1 line drifts, one telemetry mislabel, one identity-function clarification, one parenthetical citation drift applied at two line numbers, and one stale schema anchor for the panel UI) and are corrected in place. Residuals R1–R3 are honest, non-blocking naming/UI nuances.
