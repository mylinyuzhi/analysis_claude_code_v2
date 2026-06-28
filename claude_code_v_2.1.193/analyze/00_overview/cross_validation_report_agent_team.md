# Cross-Validation Report — Module 30_agent_team (v2.1.193 delta)

- **Theme:** agent_team (Agent Team / "swarm" subsystem, v2.1.183 → v2.1.193 delta)
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.193/analyze/30_agent_team/`
- **Docs audited:** `README.md`, `teammate_mode_iterm2.md`, `effort_inheritance.md`, `stop_attribution.md`
- **Additions file:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.193/analyze/00_overview/symbol_additions_v2_1_193_agent_team.md`
- **TARGET bundle (193):** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines, build `a1938d2a`)
- **BEFORE-PICTURE (183):** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines)
- **EARLIER BASELINE (156):** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649,979 lines)
- **v2.1.88 named-TS reference:** `/lyz/codespace/3rd/claude-code/src/`

**Sample:** 33 distinct 193 anchors re-read directly from the 193 bundle (`sed -n`), 14 before-picture / baseline / v2.1.88-lineage decls re-read from the 183 / 156 / 88 trees, and 21 grep-count diffs re-run across the 193 + 183 (+ 156) bundles.

**Verdict (one line):** **PASS WITH FIXES.** The three-delta analysis (iTerm2 pin, `--effort` inheritance, stop attribution) is fundamentally sound — every load-bearing 193 declaration, branch, string, and the 183/156/88 before-pictures reproduce at (or within ±1 line of) the cited locations, and the carryover negatives (implicit-team redesign) are byte-confirmed equal across 183↔193. One genuine **false delta** was caught and fixed (`user_kill_async` telemetry was labeled NET-NEW but pre-dates the window — present in both 183 and 156), one **source-text mismatch** was fixed (`kill_reason:` → `reason:` in a code snippet), one **grep-count** was corrected (`"iterm2"` literal 16 → 20), and two 1-line decl-cite drifts (`$jt`, `Mde`) were snapped to the exact declaration line.

---

## C1 — 193 anchor spot-check (TARGET bundle)

Every line below was opened at the exact cited line in the 193 bundle and the declaration / string confirmed against the doc claim.

### iTerm2 pin (`teammate_mode_iterm2.md`)

| Cited line | Obf → Readable | Verified at line | Result |
|---|---|---|---|
| 54136 | `uhs` → `EXEC_MODE_ENUM` | `(uhs = ["auto", "tmux", "iterm2", "in-process"])` | PASS |
| 56919-56922 | `teammateMode` schema | `teammateMode: A.enum(uhs)...describe("How spawned teammates execute (tmux, iterm2, in-process, auto)")` | PASS |
| 488457 | settings-UI options | `options: ["auto", "tmux", "iterm2", "in-process"]` | PASS |
| 714421 | `--teammate-mode` help | `new _c("--teammate-mode <mode>", 'How to spawn teammates: "tmux", "iterm2", "in-process", or "auto"')` | PASS |
| 714422 | flag `.choices()` | `.choices(["auto", "tmux", "iterm2", "in-process"])` | PASS |
| 714758 | parser normalize | `teammateMode: n === "auto" \|\| n === "tmux" \|\| n === "iterm2" \|\| n === "in-process" ? n : void 0` | PASS |
| 429186 | `kPe` → `detectAndGetBackend` | `async function kPe(e = TJ) {` | PASS |
| 429192-429213 | explicit-iterm2 branch | `if ((T("[BackendRegistry] Starting backend detection..."), zRe() === "iterm2")) {` … two `Error(...)` throws … `let o = svo(e)` … cache+return | PASS |
| 429181 | `svo` → `createITermBackend` | `function svo(e) { if (!e.ITermBackendClass) throw Error(...); return new e.ITermBackendClass(); }` | PASS |
| 429024 | `rvo` → `ITermBackend` class | `class rvo { type = "iterm2"; displayName = "iTerm2"; ... }` | PASS |
| 302915 | `zRe` → `getTeammateModeFromSnapshot` | `function zRe() { ... return qRe ?? $jt; }` | PASS |
| 302920 | `$jt` → `DEFAULT_TEAMMATE_MODE` | `var $jt = "in-process",` | PASS (doc said 302921 — was `qRe = null`; **fixed → 302920**) |
| 363523 | `R8` → `isInsideITerm2` | `function R8() {...e === "iTerm.app" \|\| t \|\| n...}` (TERM_PROGRAM / ITERM_SESSION_ID / Be.terminal) | PASS |
| 363533 | `Rft` → `isIt2CliReachable` | `async function Rft() {...command -v ${xft}...}` | PASS |
| 363571 | `xft` → `IT2_BIN` | `xft = "it2",` | PASS |
| 429964 | `iXp` → `emitPaneFallbackHint` | `function iXp(e) { if (Dil) return; ... R8() ? 'To force iTerm2 panes...' : 'To use terminal panes...' }` | PASS |
| 44845 | `Ie` → telemetry ok | `function Ie(e, t) { V("tengu_feature_ok", {...}) }` | PASS (generic feature-ok recorder; see residuals) |
| 44848 | `Re` → telemetry bad | `function Re(e, t, n) { V("tengu_feature_bad", {... error_code: t}) }` | PASS (generic feature-bad recorder; see residuals) |

### `--effort` inheritance (`effort_inheritance.md`)

| Cited line | Obf → Readable | Verified at line | Result |
|---|---|---|---|
| 428485 | `pil` → `buildInheritedCliFlags` | `function pil(e) {...{ ...effortValue: s } = e \|\| {}}` | PASS |
| 428500 | `--effort` push (pil) | `if (typeof s === "string" && PIe()) t.push(\`--effort ${s}\`);` | PASS |
| 429445 | `Mil` → `buildInheritedSubagentCliFlags` | `function Mil(e) {...{ ...effortValue: s } = e \|\| {}}` | PASS |
| 429456 | `--effort` push (Mil) | `if (typeof s === "string" && PIe()) t.push(\`--effort ${s}\`);` | PASS |
| 149794 | `PIe` → `isLaunchEffortUnpinned` | `function PIe() { let e = Lt(); return Boolean(e.unpinOpus47LaunchEffort && e.unpinOpus48LaunchEffort && e.unpinFable5LaunchEffort); }` | PASS |
| 428615 | pil caller | `effortValue: this.context.getAppState().effortValue,` | PASS |
| 429595 | Mil caller #1 | `effortValue: u.effortValue,` (call opens `x = Mil({` @429592) | PASS |
| 429710 | Mil caller #2 | `C = Mil({ ... effortValue: u.effortValue` (the `effortValue:` arg is @429713) | PASS (call-opening cite; see residuals) |

### Stop attribution (`stop_attribution.md`)

| Cited line | Obf → Readable | Verified at line | Result |
|---|---|---|---|
| 453792 | `Eqe` → `enqueueAgentNotification` | `function Eqe({ taskId: e, description: t, ... })` | PASS |
| 453826-453834 | wording ternary | `n === "completed" ? \`Agent "${t}" finished\` : n === "failed" ? \`...failed: ${o...}\` : r === "parent" ? \`...was stopped by Claude\` : r === "user" ? \`...was stopped by user\` : \`...was stopped\`` | PASS |
| 431759 | `kht` → `stopTask` | `async function kht(e, t) { let { ..., killedBy: s = "user" } = t, ...}` | PASS |
| 431944 | TaskStop tool call | `let i = await kht(s, { ..., callerAgentId: F8n(n), killedBy: "parent" });` | PASS |
| 431808 | `Mde` → `markAgentStoppedByUser` | `function Mde(e, t) {` | PASS (doc said 431809 = body line; **fixed → 431808**) |
| 453871 | `GSe` → `killAndNotifyTask` | `function GSe(e, t, n = "user") { ... Eqe({..., status: "killed", killedBy: n,...}) }` | PASS |
| 453900 | GSe state write | `t.update(e, (s) => {... return {...s, status: "killed", killedBy: n,...}})` | PASS |
| 453726 | `Kl` → `isLocalAgentTask` | `function Kl(e) { return ... e.type === "local_agent"; }` | PASS |
| 384633 | async read of killedBy | `killedBy: Kl(te) ? te.killedBy : void 0,` | PASS |
| 384650-384658 | termination telemetry | `V("tengu_agent_tool_terminated", {... reason: te === "parent" ? Ve("parent_kill_async") : te === "system" ? Ve("system_kill_async") : Ve("user_kill_async") })` | PASS (field is `reason:`, not `kill_reason:` — **doc snippet fixed**) |
| 390965 | `LEo` → `teammateIdleBanner` | `function LEo(e) {...}` | PASS |
| 390969 | success-arm wording | `i = o === "failed" ? "failed" : o === "interrupted" ? "was interrupted" : "finished",` | PASS |
| 430391 | `team_name` deprecation (carryover) | `team_name: A.string().optional().describe("Deprecated; ignored. The session has a single implicit team.")` | PASS |

**Anchor result:** 33 sampled, 31 clean pass, 2 (`$jt`, `Mde`) had a 1-line decl drift (cite landed on the adjacent comma-chained / body line) — both snapped to the exact decl line.

---

## C2 — False-delta hunt (183 + 156 grep evidence)

For every NET-NEW / REFINEMENT / CARRYOVER claim, a stable string was grepped in BOTH the 183 and 156 bundles.

### iTerm2 pin — NET-NEW claims hold

| Stable string | 193 | 183 | 156 | Doc claim | Verdict |
|---|---:|---:|---:|---|---|
| `teammateMode is set to "iterm2"` | 2 | 0 | 0 | NET-NEW (two distinct messages) | CONFIRMED |
| `it2 CLI is not reachable` | 1 | 0 | 0 | NET-NEW | CONFIRMED |
| `To force iTerm2 panes` | 1 | 0 | 0 | NET-NEW (iterm2 arm of fallback hint) | CONFIRMED |
| `"auto", "tmux", "iterm2", "in-process"` (enum literal) | 3 | 0 | 0 | NET-NEW (schema/UI/choices) | CONFIRMED |
| `iTerm2 detected but it2 CLI not installed` (auto-detect err) | 1 | 1 | 1 | CARRYOVER | CONFIRMED |
| `"iterm2"` literal (whole bundle) | **20** | 9 | 10 | widened | CONFIRMED (doc said 193=16 → **fixed to 20**) |

183 before-picture: `Its`@53727 = `["auto", "tmux", "in-process"]` (no iterm2) ✓; 183 parser@695523 = `n === "auto" \|\| n === "tmux" \|\| n === "in-process"` (rejects iterm2) ✓. 88 lineage: `getTeammateMode(): 'auto' \| 'tmux' \| 'in-process'` at `registry.ts:335` (no iterm2) ✓.

### `--effort` inheritance — NET-NEW claims hold

| Stable string | 193 | 183 | 156 | Doc claim | Verdict |
|---|---:|---:|---:|---|---|
| ``push(`--effort `` (in a spawn builder) | 2 | 0 | 0 | NET-NEW (pil@428500, Mil@429456) | CONFIRMED |
| `effortValue:` threaded into pane-spawn builder call | 3 calls (428615/429595/429713) | 0 in region | 0 in region | NET-NEW | CONFIRMED |
| `effortValue` (grep -c lines, whole bundle) | — | 55 | 55 | "183 has 55 occurrences" / CARRYOVER concept | CONFIRMED (grep -c line count = 55) |

183 before-picture: `F5a`@421627 destructures only `{ planModeRequired, permissionMode, skipModel }` — **no `effortValue`, no `--effort`** ✓. 88 lineage: `buildInheritedCliFlags` at `spawnUtils.ts:38` takes only `{ planModeRequired?, permissionMode? }` (not even `skipModel`) ✓ — so effort-threading is genuinely net-new vs both 88 and 183.

### Stop attribution — one FALSE DELTA caught, rest hold

| Stable string | 193 | 183 | 156 | Doc claim | Verdict |
|---|---:|---:|---:|---|---|
| `killedBy` (grep -c lines) | 8 | 0 | 0 | NET-NEW field (8) | CONFIRMED (grep -c=8 lines; grep -o=9 matches — line 384633 carries it twice) |
| `was stopped by Claude` | 1 | 0 | 0 | NET-NEW | CONFIRMED |
| `was stopped by user` | 1 | 0 | 0 | NET-NEW | CONFIRMED |
| `Agent "…" finished` | 1 | 0 | 0 | NET-NEW wording | CONFIRMED |
| `parent_kill_async` | 1 | 0 | 0 | NET-NEW telemetry | CONFIRMED |
| `system_kill_async` | 1 | 0 | 0 | NET-NEW telemetry | CONFIRMED |
| `user_kill_async` | 1 | **1** | **1** | doc said NET-NEW (183=0) | **FALSE DELTA** — pre-exists at 183 `:371804` and 156 `:279437` → relabeled CARRYOVER |
| `came to rest` | 0 | 4 | 0 | FIX (removed) | CONFIRMED — 183 sites: banner@379344 + `Eqe`@445861/445863/445864 |

88→183→193 wording history (verified in 88 named TS): `enqueueAgentNotification` at `LocalAgentTask.tsx:197`, body @246 = `Agent "…" completed` / `failed: …` / `was stopped` (no "came to rest", no killedBy) ✓; `stopTask` at `stopTask.ts:38` (no `killedBy`) ✓. "came to rest" is absent in 156 (count 0) and present in 183 (count 4), confirming it was introduced *after* 156 and removed in the 183→193 window — consistent with the doc's revert narrative.

### Carryover (implicit-team redesign) — confirmed byte-equal

| Stable string | 193 | 183 | Verdict |
|---|---:|---:|---|
| `single implicit team` | 4 | 4 | CARRYOVER (equal) |
| `Deprecated; ignored. The session has a single implicit team` | 1 | 1 | CARRYOVER (equal) |
| `@deprecated Sessions have a single implicit team` | 3 | 3 | CARRYOVER (equal) |

`team_name`@430391 schema reproduces exactly. The 178-era implicit-team redesign is correctly excluded from the 193 delta set.

---

## C3 — Defects fixed in place

1. **`stop_attribution.md` §2(d) — source-text mismatch.** The code snippet labeled the termination-telemetry field `kill_reason:` in BOTH the ORIGINAL and READABLE blocks. The actual 193 source (line 384657) is `reason:`. Fixed both occurrences `kill_reason:` → `reason:`.

2. **`stop_attribution.md` §4 table — FALSE DELTA.** The row `parent_kill_async / system_kill_async / user_kill_async | 0 | 1 each | NET-NEW telemetry` wrongly claimed all three reasons are new (183=0). `user_kill_async` already exists in 183 (`:371804`) and 156 (`:279437`). Split the row: `parent_kill_async / system_kill_async` = NET-NEW (0→1 each); `user_kill_async` = CARRYOVER (1→1), noting the new `killedBy` plumbing now also feeds `parent`/`system` into the same pre-existing enum.

3. **`teammate_mode_iterm2.md` §4 table — wrong grep count.** `"iterm2"` literal (whole bundle) listed as `193=16`. Re-counted: `grep -o '"iterm2"' | wc -l` = **20** in 193 (9 in 183). Fixed 16 → 20.

4. **`$jt` decl-line drift (1 line).** `$jt = "in-process"` is at line **302920**; the cite `:302921` pointed at the next comma-chained var (`qRe = null`). Fixed in `teammate_mode_iterm2.md` (×3 occurrences: §2 step-1, §4 re-verified list, Related Symbols) and `symbol_additions_v2_1_193_agent_team.md` (×1).

5. **`Mde` decl-line drift (1 line).** `function Mde(e, t) {` is at line **431808**; the cite `:431809` pointed at the first body statement. Fixed in `stop_attribution.md` (Related Symbols) and `symbol_additions_v2_1_193_agent_team.md`.

---

## C4 — Residuals (honest, not fixed)

- **Sub-version pinning (2.1.186 / 2.1.187) is not bundle-verifiable here.** Only the 193 / 183 / 156 bundles are available; the doc's attribution of specific deltas to .186 vs .187 comes from the changelog scoping. The bundle evidence confirms only "new in the 183→193 window" (every headline string flips 0→present from 183 to 193). Confidence in *that* is HIGH; the exact intermediate version is taken on trust.
- **`Re` / `Ie` readable names are usage-scoped.** They are deobfuscated as `recordSwarmOpFailure` / `recordSwarmOpSuccess`, but the underlying functions are generic telemetry helpers (`tengu_feature_bad` / `tengu_feature_ok`) used across the bundle. The decl, line, and signature all match, and the additions file parenthetically shows the swarm-specific call (`Re("swarm_backend_detect", …)`), so this is acceptable contextual naming, not a mislabel — left as-is.
- **`Mil` prose simplification.** §1 calls `Mil` "structurally the same flag list without the `--teammate-mode` push." `Mil` *also* lacks the `CLAUDE_CODE_SUBAGENT_MODEL` env-override branch that `pil` has (it reads `$y()` directly). Minor prose imprecision; the load-bearing `--effort` claim is exact. Left as-is.
- **Effort caller anchor reference points are slightly inconsistent.** The doc cites the first `Mil` caller at the `effortValue:` arg line (429595) and the second at the `Mil({` opening line (429710, arg @429713). Both land squarely inside the correct call; not corrected.
- **183 obf token `od` (the `Kl`/`isLocalAgentTask` predecessor) not independently verified** — it is a traceability note only; the 193 `Kl`@453726 itself is confirmed.

---

## Verdict

**PASS WITH FIXES — confidence HIGH.** The agent_team 193-delta tree is accurate on its three headline claims (iTerm2 explicit pin, `--effort` pane inheritance, stop attribution), with all NET-NEW strings confirmed 0→present vs 183 and the implicit-team carryover confirmed byte-equal. One real false delta (`user_kill_async`), one source-text snippet mismatch (`kill_reason`→`reason`), one wrong grep count (`"iterm2"` 16→20), and two 1-line decl-cite drifts (`$jt`, `Mde`) were caught and fixed in place. No fabricated anchors, no invented 88 ancestors, no forbidden mapping tables introduced.
