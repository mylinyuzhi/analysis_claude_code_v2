# Cross-Validation Report — Module 36_background_agents

- **Module:** 36_background_agents (Background Agents — `bg --exec` / `! <command>` + 2.1.143–156 fixes)
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/36_background_agents`
- **Additions file:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/00_overview/symbol_additions_v2_1_156_background_agents.md`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
- **v2.1.88 xval source:** `/lyz/codespace/3rd/claude-code/src`
- **Markdown files scanned:** 7 (README.md + 6 deep-dives) + 1 additions file

---

## C1 — Symbol existence

A representative sample of 28 obfuscated symbols cited across the docs was opened at its cited line in the
2.1.156 bundle and confirmed to be the declaration claimed.

- PASS: 28
- FAIL: 0

| Symbol | Cited line | Verified declaration |
|--------|-----------|----------------------|
| `hwz` | 541956 | `async function hwz(H)` — `--exec` CLI handler ✓ |
| `ol` | 541769 | `async function ol(H, $, q = "shell", K, _, z, A)` ✓ |
| `ywz` | 541789 | `async function ywz(H, $, q, K, _, z)` ✓ |
| `Bwz` | 542514 | `function Bwz(H)` — dispatch gate (perm-mode parse) ✓ |
| `gy$` | 541028 | `function gy$() { return !0; }` — shell-exec gate ✓ |
| `Ewz` | 541727 | `function Ewz(H)` — SHELL/COMSPEC/-c launch ✓ |
| `qKH` / `Xwz` | 541290 / 541292 | `qKH = Ce4(IV6)` / `Xwz = { name: "exec", description: "" }` ✓ |
| `q5q` | 614290 | `function q5q(H, $, q = {}, K = [])` — bang parser ✓ |
| `pe4` | 541031 | `async function pe4(H, $, q)` — fleet exec dispatch ✓ |
| `ny$` | 542079 | `function ny$(H, $, q)` — bg hint banner ✓ |
| `SF` | 559938 | `class SF` — worker handle ✓ |
| `respawnIfIdleStale` | 560029 | `async respawnIfIdleStale(H)`; exec short-circuit on 560030 ✓ |
| `retireIfSettled` | 560062 | `async retireIfSettled(H, $, q = H)`; pinned guard on 560066 ✓ |
| `evH` / `Nv` / `_J` / `ujH` | 184274 / 184280 / 184283 / 184286 | all four predicates verified verbatim ✓ |
| `esH` | 346660 | `function esH(H, $)` — worktree isolation guard ✓ |
| `Eu6` | 346655 | `function Eu6()` — env-then-settings isolation ✓ |
| `jPz` | 559067 | `async function jPz(H)` — pty-host; `a69()` call on 559069 ✓ |
| `EF` | 540124 | `async function EF(H = {})` — ensureDaemonRunning ✓ |
| `Owz` | 540220 | `function Owz(H)` — staleness comparator ✓ |
| `Mwz` | 540233 | `async function Mwz(H, $)` — binary takeover ✓ |
| `Ywz` | 540086 | `async function Ywz(H)` — nudge loop ✓ |
| `zh8` | 542680 | `async function zh8(H, $, q, K, _, z, A, Y, f, O)` ✓ |
| `nS$` | 623957 | `class nS$` — session-state tracker ✓ |
| `i04` / `JT4` / `r04` / `IV6` | 449166 / 450335 / 449361 / 236184 | classifier fast-path / dispatcher / reader prompt / writer agent ✓ |
| `nJ` | 9546 | `function nJ(H, $)` — exit-cause marker writer ✓ |
| `SH`/`uH`/`t$`/`mn8`/`Bn8`/`pn8` | 41590–41607 | the six telemetry helpers verified verbatim ✓ |
| `n1H` | 216098 | `var n1H = "EnterWorktree"` ✓ |
| grace consts `mpz`/`Vzq`/`vzq`/`Bpz` | 648199–648202 | `3600000` / `60000` / `60000` / `Bpz` ✓ |

---

## C2 — Line/symbol pairing

Every symbol in the C1 sample resolved to its claimed declaration at the cited line (not merely "present
somewhere in the file"). Spot-checks of the regex blocks were also paired:

- Marker regexes `Dd_`/`Jd_`/`Xd_`/`Ld_` at 449563–449566 — paired verbatim (the `[:—–-]` separator
  class, the `(.{3,200}?)` capture, the `(?=\n|$)` look-ahead) ✓.
- Tail-shape regexes `Wd_`…`hd_` at 449567–449584 — the additions file cites the whole block collectively
  (per project note); confirmed `Wd_`=`RX_FORWARD_INTENT`, `Zd_`=`RX_PASSIVE_WAIT`, and the eight single-purpose
  regexes are all present in that range ✓.

- PASS: 28
- FAIL: 0

---

## C3 — Line range sanity

Cited ranges were checked against the actual function/object boundaries in the bundle.

- PASS: 16
- FAIL (corrected): 1

| Range | Verdict |
|-------|---------|
| `hwz` 541956–**542018** (README, additions, daemon doc) | **WRONG → corrected to 541956-542006.** `hwz` closes at line 542006; `$H9` begins at 542007. |
| `hwz` 541956–542007 (shell doc, two sites) | off-by-one (closing `}` is 542006) → **corrected to 541956-542006** |
| `ol` 541769–541788 | OK (ends 541788, `ywz` begins 541789) ✓ |
| `ywz` 541789–541955 | OK ✓ |
| `Bwz` 542514–542529 | OK (`return null; }` at 542528–542529, `Uwz` begins 542530) ✓ |
| `pe4` 541031–541059 | OK (ends 541059, `Dqq` begins 541060) ✓ |
| `Ewz` 541727–541736 | OK ✓ |
| `q5q` 614290–614318 (additions/README) | OK (closing `}` at 614318, `K5q` begins 614319) ✓ |
| `retireIfSettled` 560062–560135 | OK ✓ |
| `respawnIfIdleStale` 560029–560061 | OK ✓ |
| `evH/Nv/_J/ujH` 184274–184288 | OK ✓ |
| `esH` 346660–346684 | OK ✓ |
| `EF` 540124–540208 | OK ✓ |
| `Owz` 540220–540232 | OK ✓ |
| `Mwz` 540233–540291 | OK ✓ |
| grace consts 648199–648202 | OK ✓ |
| `nJ` 9546–9551 | OK ✓ |

The one substantive range error (`hwz` end = 542018) appeared in three places and was corrected to 542006 in all
of them (plus the two off-by-one `542007` sites in the shell doc). See "Fixes applied".

---

## C4 — Mapping conflicts (one symbol → one readable name)

This was the largest class of issues. Several symbols carried different readable names in
`unified_dispatcher_ol.md` and `daemon_binary_takeover_and_bg_handoff.md` than the canonical names declared in the
additions file. The additions file's "Naming notes" section explicitly sanctions the `ol`/`ywz`/`Ewz`/`Xwz`
alias pairs (`unifiedBgDispatch`/`dispatchBgSession`, `dispatchWorker`/`seedBgSessionState`,
`resolveShellLaunch`≡`shellLaunchSpec`, `EXEC_TEMPLATE`≡`execTemplate`) — those were left intact as documented
aliases. The **unsanctioned** contradictions below were fixed:

| Symbol | Canonical (additions) | Contradicting name(s) found | Resolution |
|--------|----------------------|------------------------------|------------|
| `hwz` | `bgFlagExecHandler` | `execHandlerCli` (unified doc), `handleBgFlag`/`execHandler` (daemon doc) | unified to `bgFlagExecHandler` |
| `pe4` | `fleetDispatchExec` | `fleetExecDispatch` (unified doc) | unified to `fleetDispatchExec` |
| `q5q` | `parseFleetDispatchInput` | `parseDispatchInput` (unified doc) | unified to `parseFleetDispatchInput` |
| `_J` | `isSettledState` | `isSettledTempo` (unified doc symbol list) | unified to `isSettledState` (verified `_J(H){ return Nv(H.state) && H.tempo!=="active" }`) |
| `Nv` | `isTerminalState` | `isSettledState` (unified doc lumped `Nv`/`evH` together) | split: `Nv`=`isTerminalState`, `evH`=`terminalStateToOutcome` (matches `evH` body + worker doc) |
| `ol` | `unifiedBgDispatch` | `unifiedBgDispatcher` (daemon doc, 3 sites) | unified to `unifiedBgDispatch` |

After fixes, a residual grep for `execHandlerCli|handleBgFlag|fleetExecDispatch|parseDispatchInput|isSettledTempo|unifiedBgDispatcher`
across the module returns **nothing**. The `_J`/`Nv`/`evH` split was confirmed against the verbatim source
(184274–184285): `evH` maps a state string to an outcome, `Nv` is `evH(state)!==null` (terminal-state), `_J` is
`Nv(state) && tempo!=="active"` (settled-record).

- Conflicts found: 6 (distinct symbols)
- Conflicts resolved: 6
- Sanctioned aliases left intact: 4 pairs (`ol`/`ywz`/`Ewz`/`Xwz`)

---

## S1 — Semantic spot-check (5 samples read verbatim in the bundle)

### Sample 1 — `gy$` shell-exec gate (`shell_exec_sessions.md` §3.2, cli_inner_pretty.js:541028-541030)

```js
function gy$() {
  return !0;
}
```
The doc claims it is a hardcoded `true` kill-switch (the feature shipped 2.1.154, fully launched by 2.1.156).
**Verdict: PASS** — body is exactly `return !0`.

### Sample 2 — `retireIfSettled` pinned guard (`worker_retire_respawn_2156.md` §2a, cli_inner_pretty.js:560062-560066)

```js
async retireIfSettled(H, $, q = H) {
  if (this.isTransitioning) return { retired: !1, reason: "in-progress" };
  if (this.record.outcome) return { retired: !1, reason: "no-state" };
  if (this.attachers.size > 0) return { retired: !1, reason: "attached" };
  if ($?.has(this.dispatch.short)) return { retired: !1, reason: "pinned" };
```
The doc claims the new 3-arg signature `(graceMs, pinnedSet, bridgedGraceMs=graceMs)` and a pinned refusal placed
fourth in the ladder before any disk read. **Verdict: PASS** — signature and the `$?.has(this.dispatch.short)`
pinned guard at 560066 match exactly.

### Sample 3 — the settled/terminal predicates (`unified_dispatcher_ol.md` + `worker_retire_respawn_2156.md`, cli_inner_pretty.js:184274-184288)

```js
function evH(H){ if (H==="done") return "success"; if (H==="failed") return "failure"; if (H==="stopped") return "stopped"; return null; }
function Nv(H){ return evH(H) !== null; }
function _J(H){ return Nv(H.state) && H.tempo !== "active"; }
function ujH(H){ return H.template === "exec" && H.respawnFlags.length === 0; }
```
This is the sample that exposed the C4 mapping conflict: `_J` is the *settled job-record* predicate (so
`isSettledState`), `Nv` is the *terminal state-string* predicate (so `isTerminalState`), `evH` is the outcome
mapper. **Verdict: PASS** (after correcting the unified doc's labels).

### Sample 4 — `esH` worktree-isolation subagent branch (`worktree_isolation_and_pty_orphan.md` §"the 2.1.156 fix", cli_inner_pretty.js:346675, 346682-346683)

```js
let K = $.agentId ? f6() : C$();
if (!H.startsWith(K + tsH.sep)) return null;
...
if ($.agentId)
  return `This subagent's parent bg session hasn't isolated yet, so writes to the shared checkout are blocked. Re-spawn this agent with \`isolation: "worktree"\`, ...`;
```
The doc claims the fix is the one-token `$.agentId ? f6() : C$()` base selection plus a subagent-specific block
message. **Verdict: PASS** — the `agentId` ternary and the dedicated subagent message are both present verbatim.

### Sample 5 — `Owz` staleness comparator (`daemon_binary_takeover_and_bg_handoff.md` §"the comparator", cli_inner_pretty.js:540220-540232)

```js
function Owz(H) {
  if (H.daemonOrigin !== "transient") return !1;
  if (H.daemonVersion === H.clientVersion) return !1;
  if (H.daemonTarget === H.clientTarget) return !1;
  if (!H.daemonTarget) return (uy$.valid(H.clientVersion)!==null && uy$.valid(H.daemonVersion)!==null && uy$.gt(H.clientVersion, H.daemonVersion));
  if (H.clientMtimeMs === null || H.daemonMtimeMs === null) return !1;
  return H.clientMtimeMs > H.daemonMtimeMs;
}
```
The doc claims a transient-origin guard, then a version-OR-mtime cascade biased toward "do not kill".
**Verdict: PASS** — every branch defaults to `!1` (false) and the semver-vs-mtime fork matches the prose.

---

## Cross-validation against v2.1.88 (`/lyz/codespace/3rd/claude-code/src`)

The docs' "NEW post-2.1.88" assertions were checked against the readable tree:

- **`nS$` precursor (classifier doc §8):** `src/utils/sessionState.ts` exists with
  `SessionState = 'idle'|'running'|'requires_action'` and `notifySessionStateChanged` — confirms the
  "promoted to a class, goal-snapshot is the only new field" claim. **PASS.**
- **`CLAUDE_CODE_SESSION_KIND` precursor (worktree doc):** `src/utils/concurrentSessions.ts:33` reads
  `process.env.CLAUDE_CODE_SESSION_KIND`. The doc cited "31-37"; the actual reference is line 33 (within the
  cited range). **PASS (range citation).**
- **REPL-bridge precursor (worker/daemon docs):** `src/bridge/replBridge.ts` exists — confirms `bridgeSessionId`
  has a partial 2.1.88 precursor while the bridge-grace retire logic is new. **PASS.**
- **Ctrl+B backgrounding precursor (daemon doc):** `src/hooks/useSessionBackgrounding.ts` exists — confirms the
  "in-process toggle, not a daemon-worker fork" framing. **PASS.**
- **`utils/background/` (shell + unified docs):** contains only `remote/` — confirms "session backgrounding only,
  no shell-exec, no `--exec`". **PASS.**
- **Absence grep:** `resolveShellLaunch|bgIsolation|retireIfSettled|respawnIfIdleStale|BgWorkerHandle|pins.json|bg-pty-host|setdisclaim`
  return **zero** matches in `src/` — confirms every "NEW post-2.1.88" claim for the dispatcher, worker handle,
  worktree guard, and pty-host. **PASS.**

---

## Fixes applied (in place)

1. **`hwz` end-line corrected `542018`→`542006`** in `README.md`, the additions file, and
   `daemon_binary_takeover_and_bg_handoff.md` (2 sites), plus the off-by-one `542007`→`542006` in
   `shell_exec_sessions.md` (2 sites). `hwz` closes at 542006; `$H9` begins at 542007.
2. **`hwz` readable name unified to `bgFlagExecHandler`** — replaced `execHandlerCli` (unified doc symbol list +
   ASCII diagram, 2 sites) and `handleBgFlag`/`execHandler` (daemon doc symbol list, prose, validation table).
3. **`pe4` unified to `fleetDispatchExec`** — replaced `fleetExecDispatch` in `unified_dispatcher_ol.md`
   (symbol list, diagram, §"exec template" prose).
4. **`q5q` unified to `parseFleetDispatchInput`** — replaced `parseDispatchInput` in `unified_dispatcher_ol.md`
   (symbol list, diagram, §"exec template" prose).
5. **`_J` corrected to `isSettledState`** (was `isSettledTempo`) and **`Nv`/`evH` split** into
   `isTerminalState`/`terminalStateToOutcome` (was lumped as `isSettledState`) in `unified_dispatcher_ol.md`,
   matching the verbatim 184274-184288 source and the worker doc.
6. **`ol` unified to `unifiedBgDispatch`** — replaced `unifiedBgDispatcher` in `daemon_binary_takeover_and_bg_handoff.md`
   (symbol list, readable code block, mapping line).

No mapping tables were introduced into module docs; all edits kept list/prose format. The classifier tail-shape
regex block (449567-449584) was left cited collectively per the project note — it is correct as-is.

---

## Confidence roll-up

| Area | Confidence | Notes |
|------|-----------|-------|
| Symbol existence (C1) | **HIGH** | 28/28 declarations confirmed at cited lines |
| Line/symbol pairing (C2) | **HIGH** | all paired to the claimed declaration, not just presence |
| Range sanity (C3) | **HIGH** (after fix) | 1 substantive range error (`hwz` end) corrected in 5 sites |
| Mapping uniqueness (C4) | **HIGH** (after fix) | 6 symbol conflicts resolved; residual grep clean; 4 sanctioned aliases retained |
| Semantic accuracy (S1) | **HIGH** | 5/5 spot-checks match verbatim source |
| v2.1.88 cross-validation | **HIGH** | all precursor paths exist; all "NEW" symbols absent from `src/` |

**Overall verdict: PASS** (after applying the six fix classes above). The module's prose and algorithm analysis
are accurate; the only defects were a propagated `hwz` end-line error and readable-name drift between the two
later-written deep-dives (`unified_dispatcher_ol.md`, `daemon_binary_takeover_and_bg_handoff.md`) and the
canonical additions file. Both are now reconciled.

The two `(unverified)` items the module itself flags — the exact cron-goal-loss patch site (classifier doc §6.3)
and the 2.1.154 `/logout` / `←←` UI-routing gate sites (daemon doc §"2.1.154 UI-Routing") — were left as honestly
labeled gaps; they are not factual errors and are correctly scoped to other modules.

---

## Round 8 (2026-06-04) — `background_slash_command.md` cross-validation

The 7th deep-dive in this module — [`background_slash_command.md`](../36_background_agents/background_slash_command.md), the full `/background` (`/bg`) slash-command surface — was added after this report's first pass and is cross-validated here on its own.

- **Method:** an independent adversarial Workflow, **8 read-only validators, default-to-FAIL**: 7 partitioned the doc by section (1–105 overview, 106–433 def+call+guards, 434–635 seed, 636–860 confirm-UI, 861–1076 fork, 1077–1229 siblings+telemetry, 1230–1316 cross-ref+Related-Symbols) and re-opened **every** cited `cli_inner_pretty.js:<line>` in the 2.1.156 bundle; 1 re-ran the §8 greps against the 2.1.88 reconstructed tree (`/lyz/codespace/3rd/claude-code/src`). The doc carries **220 unique line citations + ~80 symbol→line mappings**.
- **Result: 306 PASS / 1 PARTIAL / 1 FAIL.** Both flagged items were documentation wording, **not** code-analysis errors; the orchestrator re-confirmed both against source before acting.

| Validator batch | PASS | PARTIAL | FAIL |
|-----------------|------|---------|------|
| overview (1–105) | 18 | 1 | 1 |
| def-and-call (106–433) | 25 | 0 | 0 |
| seed (434–635) | 18 | 0 | 0 |
| confirm-ui (636–860) | 45 | 0 | 0 |
| fork (861–1076) | 47 | 0 | 0 |
| siblings-telemetry (1077–1229) | 19 | 0 | 0 |
| xref-and-symbols (1230–1316) | 80 | 0 | 0 |
| 2.1.88 cross-validation | 54 | 0 | 0 |

### The two findings (both resolved)

1. **PARTIAL — empty-seed message abbreviated in the flow diagram.** The "End-to-end flow" ASCII box (line ~80) rendered the third-guard message as `"Nothing to background yet — send a message…"`. Source `cli_inner_pretty.js:542904` is `"Nothing to background yet — send a message first."` (re-read verbatim). The §2 prose/snippet (lines 288/316/422/617) already had the exact text; only the diagram abbreviated it. **Fix:** diagram updated to the exact string.

2. **FAIL (re-classified to a precision note) — `Sqq` → `initBackgroundImplDeps` is a *coined* name.** The validator failed this because `grep initBackgroundImplDeps` → 0 hits. Confirmed: it is not a bundler-preserved name. **But that is true of nearly every readable name in this project** — e.g. the same validator pass-listed `backgroundCall` (`Fwz`, also 0 hits). Coining readable names is the mandated deobfuscation methodology (CLAUDE.md). The genuine kernel: this doc emphasizes `OH9`'s three *ground-truth* export keys (`spawnBackgroundFork`/`deriveBackgroundSeed`/`call` — `grep spawnBackgroundFork` → 1 hit), so a reader could mistake a coined name for a recovered one. **Fix:** added a "ground-truth vs coined" note to §"Where it lives" that explicitly labels `MH9`/`OH9`/`Sqq`/`jH9`/`Fwz` as coined and only the three `OH9` exports as recovered. No faithful name was removed.

### v2.1.88 cross-validation (re-run independently)

All §8 claims re-confirmed against the reconstructed tree: `ls commands/` has **no** `background`/`bg`/`fork` command dir; the absence greps (`Send this session to the background`, `free the terminal`, `spawnBackgroundFork`/`deriveBackgroundSeed`/`BackgroundForkPrompt`, `tengu_background*`, `reply-on-resume|replyOnResume`) all return empty; and the pre-existing primitives are present verbatim — `--fork-session` (`main.tsx:988`) and `--bg`/`handleBgFlag` under `feature('BG_SESSIONS')` (`cli.tsx:185-206`). **Conclusion fully supported:** the `/background` (`/bg`) in-REPL handoff is NEW post-2.1.88, layered on the pre-existing `--resume`/`--fork-session` fork primitive and the `--bg` CLI flag, plus a new `--reply-on-resume` flag and the new `tengu_background*` telemetry family. *(Caveat carried in the doc: this is proven against a reconstruction, not the original obfuscated 2.1.88 bundle, which is not present locally.)*

### Confidence roll-up (Round 8)

| Area | Confidence | Notes |
|------|-----------|-------|
| Symbol existence + line pairing | **HIGH** | 306/308 exact on first pass; the 2 misses were wording, not symbol/line errors |
| Verbatim ORIGINAL snippets (`Ah8`, `gwz`, `zh8`, `Fwz`) | **HIGH** | re-read bytewise against the bundle |
| Telemetry events + fields | **HIGH** | all 6 events + fields confirmed at exact lines; "no `source:self`" upheld |
| Param-flow (`zh8` call args, `ol` slot-shift) | **HIGH** | model-internal-via-`ik()`, effort=3rd, mode=4th, opts=`ol` param #5 all confirmed |
| v2.1.88 cross-validation | **HIGH** | absence greps empty; precursors present verbatim |

**Overall verdict: PASS.** After the two wording fixes, every structural, behavioral, and comparative claim in `background_slash_command.md` is backed by a re-read 2.1.156 citation, and the "NEW post-2.1.88" conclusion is independently reproduced.
