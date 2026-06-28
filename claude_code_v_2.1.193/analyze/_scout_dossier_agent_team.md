# Scout Dossier — Agent Team delta (v2.1.183 → v2.1.193)

**Theme:** Agent team — `teammateMode: "iterm2"` setting, `--effort` inheritance into spawned teammates, STOP-notification attribution ("finished"/"stopped" wording vs old "came to rest").

**Target bundle (prove-here):** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (VERSION "2.1.193", build a1938d2a, 2026-06-25)
**Before-picture:** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`
**88 named-TS ancestor:** `/lyz/codespace/3rd/claude-code/src` (`utils/swarm/**`, `tasks/**`, `tools/AgentTool/**`)

> All line anchors below are in the **193** bundle unless prefixed `[183]` or `[88]`. Obfuscated tokens are re-mangled per build — every symbol was re-derived by line in the 193 bundle.

---

## Executive summary

All three bullets are **confirmed NET-NEW in the 183→193 window** (each headline string/field has grep-count 0 in 183, >0 in 193). The underlying machinery (iTerm2 pane backend, backend-registry detection, the teammate spawn-command builder, the `enqueueAgentNotification` builder) is **carryover that pre-dates 183** (and even pre-dates the 88 ancestor for the swarm subsystem). The 193 changes are *surgical edits inside that carryover machinery*:

| Bullet | Verdict | Net-new evidence (183 grep-count → 193) |
|---|---|---|
| `teammateMode: "iterm2"` setting + it2-CLI warning | **NEW capability** (2.1.186) | enum gains `"iterm2"` (0→1); 2 warning strings (0→1 each); explicit detection branch (0→1) |
| `--effort` inherited by spawned teammates | **NEW capability / REFINEMENT** (2.1.186) | `` push(`--effort ` `` pattern (0→2); `effortValue` passed into spawn builder callers (0→2) |
| STOP notification attribution + wording | **NEW capability + FIX** (2.1.187) | `killedBy` (0→8); "was stopped by Claude/user" (0→1 each); "came to rest" removed (183:4 → 193:0) |
| 178 implicit-team redesign | **UNCHANGED carryover — NOT a 193 delta** | "single implicit team" 183:4 = 193:4 (byte-identical strings/counts) |

---

## Bullet 1 — `teammateMode: "iterm2"` setting + it2-CLI warning [NEW 2.1.186]

### What changed
`teammateMode` gained a fourth, user-settable enum value `"iterm2"` that **forces** the iTerm2 pane backend. Previously iTerm2 was only ever selected *implicitly* by auto-detection; you could not pin it. With the explicit setting, the backend-detection function now short-circuits to an iTerm2-only branch that throws one of two new, actionable error messages when the environment can't satisfy it (not in iTerm2 / `it2` CLI unreachable).

### Evidence — the enum / schema / CLI flag all gained `"iterm2"`

| Site | 193 | [183] before |
|---|---|---|
| exec-mode enum | `54136`: `uhs = ["auto", "tmux", "iterm2", "in-process"]` | `[183] 53727`: `Its = ["auto", "tmux", "in-process"]` (no iterm2) |
| settings schema `teammateMode` | `56919`: `A.enum(uhs)` …`.describe("How spawned teammates execute (tmux, iterm2, in-process, auto)")` | `[183] 56438`: `H.enum(Its)` …`"(tmux, in-process, auto)"` |
| settings-UI options | `488457`: `options: ["auto", "tmux", "iterm2", "in-process"]` | `[183] 479676`: `["auto", "tmux", "in-process"]` |
| `--teammate-mode` flag help | `714421`: `'How to spawn teammates: "tmux", "iterm2", "in-process", or "auto"'` | `[183] 695186`: `'…"tmux", "in-process", or "auto"'` |
| `--teammate-mode` choices | `714422`: `.choices(["auto", "tmux", "iterm2", "in-process"])` | `[183] 695187`: `.choices(["auto", "tmux", "in-process"])` |
| CLI parse normalization | `714758`: `n === "auto" \|\| n === "tmux" \|\| n === "iterm2" \|\| n === "in-process" ? n : void 0` | `[183] 695523`: `…"auto" \|\| …"tmux" \|\| …"in-process"` (no iterm2) |
| [88] enum | n/a | `[88] registry.ts:335`: `getTeammateMode(): 'auto' \| 'tmux' \| 'in-process'` (no iterm2 even at 88) |

The `"iterm2"` enum literal value was therefore **rejected** by the CLI parser and absent from the settings enum in 183 — it is genuinely net-new in this window.

### Evidence — the explicit detection branch + two new warnings

Function `kPe` (readable: `detectAndGetBackend`, [88] `utils/swarm/backends/registry.ts:136`) gained a new branch at the top, right after the cache check:

```javascript
// ============================================
// detectAndGetBackend — explicit teammateMode==="iterm2" branch (NEW)
// Location: cli_inner_pretty.js:429192-429213
// ============================================

// ORIGINAL (for source lookup):
if ((T("[BackendRegistry] Starting backend detection..."), zRe() === "iterm2")) {
  if (!R8())
    throw (Re("swarm_backend_detect", "iterm2_explicit_not_in_iterm2"),
      Error('teammateMode is set to "iterm2" but this session is not running inside iTerm2. Launch Claude from iTerm2, or change teammateMode in settings.'));
  if (!(await Rft()))
    throw (Re("swarm_backend_detect", "iterm2_explicit_no_it2"),
      Error('teammateMode is set to "iterm2" but the it2 CLI is not reachable. Install it with `pip install it2` and enable the Python API in iTerm2 (Preferences > General > Magic > Enable Python API).'));
  T("[BackendRegistry] Selected: iterm2 (explicit teammateMode)");
  let o = svo(e); /* createITermBackend */
  return ((e.cachedBackend = o), (e.cachedDetectionResult = { backend: o, isNative: !0, needsIt2Setup: !1 }), ...);
}

// READABLE (for understanding):
if ((log("[BackendRegistry] Starting backend detection..."), getTeammateModeFromSnapshot() === "iterm2")) {
  if (!isInsideITerm2())
    throw error("teammateMode is set to \"iterm2\" but this session is not running inside iTerm2. ...");
  if (!(await isIt2CliReachable()))
    throw error("teammateMode is set to \"iterm2\" but the it2 CLI is not reachable. Install it with `pip install it2` ...");
  // force ITermBackend regardless of auto-detect heuristics
  let backend = createITermBackend(registry);
  return cacheAndReturn(backend, { isNative: true, needsIt2Setup: false });
}

// Mapping: kPe→detectAndGetBackend, zRe→getTeammateModeFromSnapshot, R8→isInsideITerm2,
//          Rft→isIt2CliReachable, svo→createITermBackend, Re→telemetryStart(swarm_backend_detect)
```

Supporting symbols (all in 193):
- `zRe` (`302915`, readable `getTeammateModeFromSnapshot`, [88] `teammateModeSnapshot.ts:75`) — reads the captured teammate mode; default `$jt = "in-process"`.
- `R8` (`363523`, readable `isInsideITerm2`) — `TERM_PROGRAM==="iTerm.app" || !!ITERM_SESSION_ID || terminal==="iTerm.app"`.
- `Rft` (`363533`, readable `isIt2CliReachable`) — `command -v it2` in the login shell then `it2 session list`; returns false (with a Python-API-disabled hint) if the API isn't enabled. The binary name constant: `xft = "it2"` (`363571`).
- `svo` (`429000`, readable `createITermBackend`); the iTerm2 backend class `rvo` (`429023`, `type = "iterm2"`, `displayName = "iTerm2"`).
- New fallback hint (auto-mode, pane open failed → in-process) at `429968`: `'To force iTerm2 panes, set teammateMode: "iterm2" in settings and enable the iTerm2 Python API (Preferences > General > Magic).'` — emitted by `iXp` (`429446` region) when `R8()` is true.

### 183 diff (grep counts, headline strings)
- `'teammateMode is set to "iterm2"'` → **183: 0**, 193: 2 (two distinct messages).
- `'it2 CLI is not reachable'` → **183: 0**, 193: 1.
- `'To force iTerm2 panes'` → **183: 0**, 193: 1.
- `'\["auto", "tmux", "iterm2", "in-process"\]'` → **183: 0**, 193: present (enum + choices + options).
- `"iterm2"` literal → 183: 9, 193: 16.

### Carryover that is NOT new (be precise)
- The whole iTerm2 backend + BackendRegistry subsystem is carryover: `ITermBackend` 183:23 / 193:24; `BackendRegistry` 183:22 / 193:23; `createTeammatePaneInSwarmView` 183:5 / 193:5. Present even in [88] (`utils/swarm/backends/ITermBackend.ts`, `registry.ts`).
- The **auto-detection** error `"iTerm2 detected but it2 CLI not installed. Install it2 with: pip install it2"` exists byte-identical in both (183:1, 193:1) — **carryover**, do not attribute to 186. The 183 detection fn `eLe` ([183] `422316`) is the same shape as 193 `kPe` *minus* the new explicit branch.

### 88 ancestor note
[88] `registry.ts:335` `getTeammateMode()` returns only `'auto' | 'tmux' | 'in-process'`. So even at the 88 baseline, iTerm2 was never an explicit teammateMode value — the new value + explicit branch + warnings are genuinely new in the 183→193 (2.1.186) window.

**Confidence: HIGH.** Enum, schema, CLI flag, parser, and the two warning strings all flip 0→present from 183 to 193, and the new explicit branch is localized in `kPe`.

---

## Bullet 2 — spawned teammates inherit the leader's `--effort` [2.1.186]

### What changed
The teammate **spawn-command builder** now appends `--effort <level>` to the command line of each tmux/iTerm2-pane teammate, threading the *leader's* current effort (read from app state) into the child process. In 183 the builder did not know about effort at all.

### Evidence — the builder gained `effortValue` + the `--effort` push

There are two pane-spawn command builders; both got the same insertion:
- `pil` (`428485`, the leader/pane variant; [88]/[183] readable `buildInheritedCliFlags`, [88] `utils/swarm/spawnUtils.ts:38`).
- `Mil` (`429446`, the subagent-pane variant).

```javascript
// ============================================
// buildInheritedCliFlags — thread leader --effort into teammate cmd (NEW)
// Location: cli_inner_pretty.js:428485-428500 (pil); mirrored at 429446-429456 (Mil)
// ============================================

// ORIGINAL (for source lookup):
function pil(e) {
  let t = [], { planModeRequired: n, permissionMode: r, skipModel: o, effortValue: s } = e || {};
  ...
  if (typeof s === "string" && PIe()) t.push(`--effort ${s}`);
  ...
  let l = zRe(); t.push(`--teammate-mode ${l}`);
}

// READABLE (for understanding):
function buildInheritedCliFlags(opts) {
  let flags = [], { planModeRequired, permissionMode, skipModel, effortValue } = opts || {};
  ...
  if (typeof effortValue === "string" && isLaunchEffortUnpinned()) flags.push(`--effort ${effortValue}`);
  ...
  flags.push(`--teammate-mode ${getTeammateModeFromSnapshot()}`);
}

// Mapping: pil/Mil→buildInheritedCliFlags, s→effortValue, PIe→isLaunchEffortUnpinned, zRe→getTeammateModeFromSnapshot
```

The `effortValue` is supplied by the spawn callers from the leader's live app state:
- `428614`: `c = pil({ planModeRequired: …, permissionMode: Nr(this.context).mode, effortValue: this.context.getAppState().effortValue, skipModel: !!e.model })`
- `429593`: `x = Mil({ planModeRequired: l, permissionMode: u.toolPermissionContext.mode, effortValue: u.effortValue, skipModel: !!c })`

Gate `PIe` (`149794`, readable `isLaunchEffortUnpinned`):
```javascript
function PIe() {
  let e = Lt(); // config snapshot
  return Boolean(e.unpinOpus47LaunchEffort && e.unpinOpus48LaunchEffort && e.unpinFable5LaunchEffort);
}
```
i.e. effort is only forwarded when all three "unpin launch effort" local config flags are enabled (the same gate that governs whether effort is a live, model-selectable dial at all).

### 183 diff
- `` `--effort ${ `` pushed in a spawn builder → **183: 0**, 193: 2 (lines 428500, 429456). The grep `push(`--effort` returns 0 in 183.
- The 183 builder `F5a` ([183] `421627`) destructures only `{ planModeRequired, permissionMode, skipModel }` — **no `effortValue`, no `--effort`**. Its caller [183] `421753` passes `{ planModeRequired, permissionMode, skipModel }` with no effort.
- `effortValue` as a concept is NOT new (183: 55 occurrences, app-state field) — only its *threading into the teammate command* is new. Do not over-claim "effort is new".

### 88 ancestor note
[88] `buildInheritedCliFlags` (spawnUtils.ts:38) takes only `{ planModeRequired, permissionMode }` (not even `skipModel`/`effortValue`). `skipModel` was added pre-183; `effortValue` is added in this window. So the effort-threading is net-new vs both 88 and 183.

**Confidence: HIGH.** Builder signatures and call sites diff cleanly; the `--effort` push string is 0 in 183.

> **Upgrade-behavior gotcha:** On upgrade, a leader running at an elevated effort (e.g. xhigh/ultracode) will now silently launch tmux/iTerm2 teammates at that same effort — only when the three `unpin*LaunchEffort` config flags are on. In-process teammates take a different path (the `--effort` flag is a child-process concern), so behavior can diverge between `teammateMode: in-process` and the pane backends.

---

## Bullet 3 — STOP notification attributes who stopped the agent; "finished"/"stopped" wording [2.1.187]

### What changed
The agent-stop notification builder gained a new `killedBy` field (values `"user"` | `"parent"` | `"system"`) and rewrote its message text. The old anthropomorphic "came to rest" wording is gone; completed agents now read "finished", and stops are attributed: **"was stopped by Claude"** (parent agent issued the stop via the TaskStop tool) vs **"was stopped by user"** (human pressed stop) vs a bare **"was stopped"** fallback.

### Evidence — `enqueueAgentNotification` (`Eqe`) rewrite

```javascript
// ============================================
// enqueueAgentNotification — stop attribution + new wording (NEW killedBy param)
// Location: cli_inner_pretty.js:453792-453834
// ============================================

// ORIGINAL (for source lookup):
function Eqe({ taskId: e, description: t, status: n, killedBy: r, error: o, taskRegistry: s, ... }) {
  ...
  let b =
    n === "completed" ? `Agent "${t}" finished`
    : n === "failed" ? `Agent "${t}" failed: ${o || "Unknown error"}`
    : r === "parent" ? `Agent "${t}" was stopped by Claude`
    : r === "user" ? `Agent "${t}" was stopped by user`
    : `Agent "${t}" was stopped`;
}

// READABLE (for understanding):
function enqueueAgentNotification({ taskId, description, status, killedBy, error, taskRegistry, ... }) {
  let headline =
    status === "completed" ? `Agent "${description}" finished`
    : status === "failed" ? `Agent "${description}" failed: ${error || "Unknown error"}`
    : killedBy === "parent" ? `Agent "${description}" was stopped by Claude`
    : killedBy === "user"   ? `Agent "${description}" was stopped by user`
    : `Agent "${description}" was stopped`;
}

// Mapping: Eqe→enqueueAgentNotification, r→killedBy, n→status, o→error, t→description
```

### Where `killedBy` originates (the attribution plumbing — all net-new)

- `kht` (`431758`, readable `stopTask`, [88] `tasks/stopTask.ts:38`) destructures `killedBy: s = "user"` — **defaults to "user"** (human-initiated stop). It forwards `s` into `taskImpl.kill(...)` and cascades it to child tasks.
- The **TaskStop tool's** `call` (`431944`) invokes `kht(s, { …, killedBy: "parent" })` — i.e. when *Claude/the leader* stops a task programmatically, attribution is `"parent"`.
- `GSe` (`453871`, readable `killAndNotifyTask`, signature `GSe(e, t, n = "user")`) propagates `killedBy: n` into both `Eqe` and the task state (`status: "killed", killedBy: n`).
- Async completion path `384631-384664` reads `killedBy: Kl(te) ? te.killedBy : void 0` from the task registry and forwards to `Eqe`; telemetry `tengu_agent_tool_terminated` (`384655`) maps `te === "parent" → parent_kill_async`, `"system" → system_kill_async`, else `user_kill_async` — confirming the third value `"system"`.

### 183 diff
- `killedBy` → **183: 0**, 193: 8. Fully net-new field across stopTask / TaskStop tool / killAndNotify / async-completion / notification builder.
- `"was stopped by Claude"` / `"was stopped by user"` → **183: 0** each, 193: 1 each.
- `'Agent "${t}" finished'` → **183: 0**, 193: 1.
- `"came to rest"` → **183: 4**, **193: 0** (REMOVED). The 183 wording lived at:
  - [183] `445861-445864` `enqueueAgentNotification`: `` `Agent "${t}" came to rest` `` / `came to rest with an error` / `came to rest (stopped by user)`.
  - [183] `379344` teammate idle banner `Hao`: `idleReason … "came to rest"`.
- The **idle banner** component (`Hao`→`LEo`, 193 `390965`) is a body-string change: `[183] 379344` `… : "came to rest"` → `193 390969` `… : "finished"` (failed/"was interrupted" branches unchanged). Carryover component, wording edit only.

### 88 ancestor note
[88] `enqueueAgentNotification` (`tasks/LocalAgentTask/LocalAgentTask.tsx:197`) wording was `Agent "…" completed` / `failed: …` / `was stopped` — **no "came to rest", no killedBy**. [88] `stopTask` (`tasks/stopTask.ts:38`) had no `killedBy` param. So: 88 said "completed/was stopped" → a 88→183 change introduced "came to rest" → 187 replaced it with "finished" + per-actor attribution. The 187 change partially *reverts* the anthropomorphism and *adds* attribution that never existed before.

**Confidence: HIGH.** `killedBy` is 0→8, both attribution strings are 0→1, and "came to rest" drops 4→0, all within the window.

---

## 178 implicit-team redesign — confirmed UNCHANGED carryover (NOT a 193 delta)

The "single implicit team" redesign (the `team_name`/`teamName` parameter deprecated & ignored because a session now has exactly one implicit team) is **byte-identical** between 183 and 193:

| String | 183 | 193 |
|---|---|---|
| `single implicit team` | 4 | 4 |
| `Deprecated; ignored. The session has a single implicit team` | 1 | 1 |
| `@deprecated Sessions have a single implicit team` | 3 | 3 |
| `teamName`/`team_name` total | 136 | 137 (+1 unrelated) |

193 sites: schema `430391` `team_name: …describe("Deprecated; ignored. The session has a single implicit team.")`; `698751/698767/698783` `@deprecated Sessions have a single implicit team…`. These match 183 exactly. **Do not attribute the implicit-team redesign to the 193 window — it is 178-era carryover.**

---

## Anchor table (consolidated)

| Bullet | 193 anchor | Obf symbol | Readable | 183 diff | Confidence |
|---|---|---|---|---|---|
| 1 iterm2 enum | `54136` | `uhs` | exec-mode enum (adds "iterm2") | [183]`53727` `Its` lacks iterm2 — net-new | high |
| 1 schema | `56919` | `A.enum(uhs)` `teammateMode` | settings schema | [183]`56438` describe lacks iterm2 | high |
| 1 detect branch | `429192-429213` | `kPe` | `detectAndGetBackend` (explicit iterm2 branch) | branch absent in [183]`422316` `eLe` — net-new | high |
| 1 warning A | `429197` | error string | "…not running inside iTerm2…" | 183:0 — net-new | high |
| 1 warning B | `429204` | error string | "…it2 CLI is not reachable…" | 183:0 — net-new | high |
| 1 fallback hint | `429968` | `iXp` string | 'To force iTerm2 panes…' | 183:0 — net-new | high |
| 1 it2 detect | `363533` / `363571` | `Rft` / `xft="it2"` | `isIt2CliReachable` / it2 bin name | carryover (auto-detect existed) | high |
| 1 CLI flag | `714421-714422` | `_c("--teammate-mode")` | flag help + choices add iterm2 | [183]`695186-187` lacks iterm2 | high |
| 1 parse | `714758` | inline ternary | accept "iterm2" value | [183]`695523` rejects it | high |
| 2 spawn builder | `428485-428500` | `pil` | `buildInheritedCliFlags` (+ `--effort`) | [183]`421627` `F5a` no effort | high |
| 2 spawn builder 2 | `429446-429456` | `Mil` | subagent pane builder (+ `--effort`) | 183:0 push | high |
| 2 caller A | `428614` | `pil({…effortValue:getAppState().effortValue})` | leader effort → child | [183]`421753` no effortValue | high |
| 2 caller B | `429593` | `Mil({…effortValue:u.effortValue})` | leader effort → child | 183:0 | high |
| 2 gate | `149794` | `PIe` | `isLaunchEffortUnpinned` | carryover gate, new use | med |
| 3 notify builder | `453792-453834` | `Eqe` | `enqueueAgentNotification` (+killedBy, wording) | [183]`445830` "came to rest" | high |
| 3 stop handler | `431758` | `kht` | `stopTask` (`killedBy="user"` default) | [183] no killedBy | high |
| 3 parent attrib | `431944` | TaskStop tool `call` | `killedBy:"parent"` | 183:0 | high |
| 3 kill+notify | `453871` | `GSe` | `killAndNotifyTask` (propagate killedBy) | 183:0 | high |
| 3 async path | `384631-384664` | inline | reads `te.killedBy` + telemetry | 183:0 | high |
| 3 idle banner | `390965-390969` | `LEo` | teammate idle banner "finished" | [183]`379341` "came to rest" | high |
| carryover | `430391`,`698751+` | schema/jsdoc | implicit-team deprecation | identical 183=193 | high |

---

## Proposed module docs

Extend the existing **`30_agent_team/`** module (present in the 183 tree). Suggested new/updated files:

1. `30_agent_team/teammate_mode_iterm2.md` — the new explicit `teammateMode: "iterm2"` value end-to-end: enum (`uhs`) → schema/UI → `--teammate-mode` flag/choices/parser → `detectAndGetBackend` (`kPe`) explicit branch → `isIt2CliReachable` (`Rft`)/`isInsideITerm2` (`R8`) gating → the two warning strings + the auto-mode fallback hint (`iXp`). Include the carryover-vs-new boundary (auto-detect existed; explicit pin is new).
2. `30_agent_team/effort_inheritance.md` — `buildInheritedCliFlags` (`pil`/`Mil`) threading `--effort` from `getAppState().effortValue`, gated by `isLaunchEffortUnpinned` (`PIe`); contrast in-process vs pane backends; the upgrade-behavior gotcha.
3. `30_agent_team/stop_attribution.md` — `killedBy` plumbing (`stopTask`→TaskStop tool `"parent"` vs default `"user"` vs telemetry `"system"`), `enqueueAgentNotification` (`Eqe`) wording table ("finished"/"failed"/"was stopped by Claude|user"), idle-banner (`LEo`) "came to rest"→"finished", and the 88→183→193 wording history.

Symbol-index updates (per repo convention, tables go ONLY in symbol_index files): add the above obf→readable rows to **`symbol_index_core_features.md`** (Agent team / Background section): `kPe`/`Rft`/`R8`/`zRe`/`svo`/`rvo`/`pil`/`Mil`/`PIe`/`Eqe`/`kht`/`GSe`/`LEo`/`iXp` plus const `uhs`, `xft`.

---

## Depth assessment

**MODERATE–RICH.** Each bullet is source-level isolable with clean before/after diffs in both bundles plus an 88 ancestor that recovers original readable names (`detectAndGetBackend`, `buildInheritedCliFlags`, `getTeammateModeFromSnapshot`, `stopTask`, `enqueueAgentNotification`). Bullets 1 and 3 are rich (multi-site, new enum/field/strings, clear control-flow branch). Bullet 2 is moderate (two localized 1-line insertions + caller wiring, behind an existing config gate). No bullet is UI-only or non-isolable. The 178 implicit-team claim is verified as carryover by identical string counts — adversarially negative-confirmed, not invented.
