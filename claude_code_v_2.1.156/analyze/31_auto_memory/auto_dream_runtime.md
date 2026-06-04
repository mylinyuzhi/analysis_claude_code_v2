# Auto-Dream Runtime — Cross-Session Background Memory Consolidation (v2.1.156)

## What it does

**Auto-dream is the *third* auto-memory writer.** Where main-agent inline writes capture an explicit "remember X" and the per-turn extraction subagent (documented in [extract_memories_runtime.md](./extract_memories_runtime.md)) captures *per-turn* signal from the conversation that just happened, **auto-dream runs periodically across sessions and *reorganizes* the whole memory directory.** It is the explicit "reflective pass" — it `ls`-es the memory dir, reads `MEMORY.md`, greps recent session logs and transcripts, then consolidates: merging near-duplicates, deleting contradicted facts, converting relative dates ("yesterday") to absolute, and pruning the `MEMORY.md` index back under its size caps.

The whole thing is **fire-and-forget from the Stop-hook** — there is no cron timer, no daemon. Every time the main agent finishes a turn, the Stop-hook calls `runAutoDreamCheck` (`U04`), which runs a tiered gate cascade (feature-enabled → hours-since → scan-throttle → sessions-since → filesystem lock). Only when every gate passes does it actually fork a sandboxed subagent to do the consolidation. Most turns bail out at the first or second gate in well under a millisecond.

This document is the canonical reference for that scheduler, the filesystem lock protocol it rides on, the dream fork prompt it builds, the task-registry surfacing, and the ambient-context completion loop that tells the *next* turn's main agent "your memory just changed". It also covers the **`/dream` surface change** in this build (the old `tengu_kairos_dream` skill is gone; `/dream` is now a scheduled-task routine scaffold).

> **Three distinct "dream" surfaces — keep them separate.** This doc is about surface (1).
> 1. **Auto-dream fork prompt** `buildDreamPrompt` (`C04`) — what the background scheduler forks. THIS DOC.
> 2. **Tiny-memory pruning prompt** `buildDreamPromptTiny` (`VFK`) — a delete-only variant the scheduler swaps in when tiny-memory is on. Lives in [memdir_core.md](./memdir_core.md); summarized here.
> 3. **`/dream` scheduled-task routine scaffold** (`As4`, `LOz="/dream"`) — a cron-driven overnight SKILL.md template, NOT invoked by the per-turn scheduler. Covered in the [Delta section](#delta-the-dream-surface-changed).

## Related symbols

> Symbol mappings live ONLY in the overview indexes:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Compact / Hooks / Skills / **Auto Memory**
> - [symbol_additions_v2_1_156_auto_memory.md](../00_overview/symbol_additions_v2_1_156_auto_memory.md) — this version's additions
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Telemetry / Model / Prompt

Key functions in this document (list format — NO mapping table here):

- `getDreamConfig` (`P04`) — reads `tengu_onyx_plover` Growthbook config, default `null` (cli_inner_pretty.js:447997)
- `isAutoDreamServerSideOptIn` (`QT8`) — `onyx.enabled || onyx.available || $68()` precondition (cli_inner_pretty.js:448000)
- `isAutoDreamFeatureToggleable` (`kk$`) — user-setting-overrides-server gate (cli_inner_pretty.js:448005)
- `getDreamThresholds` (`ag_`) — `minHours`/`minSessions` from `onyx`, else defaults (cli_inner_pretty.js:448529)
- `isAutoDreamEnabled` (`sg_`) — `!$b() && !d6() && M1() && kk$()` master gate (cli_inner_pretty.js:448540)
- `isAutoDreamForcedRun` (`tg_`) — kill-switch placeholder, returns `false` (cli_inner_pretty.js:448546)
- `initAutoDream` (`p04`) — closure factory; captures `lastSessionScanAt=0`; assigns `B04` (cli_inner_pretty.js:448549)
- `autoDreamExtractor` (`B04`) — the gate→scan→lock→fork→track loop (cli_inner_pretty.js:448551)
- `runAutoDreamCheck` (`U04`) — public entry; delegates to `B04?.(...)` (cli_inner_pretty.js:448709)
- `buildDreamPrompt` (`C04`) — the 4-phase fork prompt (cli_inner_pretty.js:448446)
- `TEAM_DREAM_PHASE_GUIDANCE` (`ng_`) — team `team/` phase block (cli_inner_pretty.js:448514)
- `RECONCILE_AGAINST_CLAUDEMD` (`ig_`) — reconcile-memories-vs-CLAUDE.md block (cli_inner_pretty.js:448516)
- `trackDreamFilesTouched` (`eg_`) — onMessage callback parsing Edit/Write + `rm`/`Remove-Item` (cli_inner_pretty.js:448678)
- `countDailyLogs` (`Hd_`) — recursive `.md` count under `logs/` (cli_inner_pretty.js:448700)
- `AUTO_DREAM_SCAN_THROTTLE_MS` (`og_`) = 600000 (cli_inner_pretty.js:448715)
- `AUTO_DREAM_THRESHOLD_DEFAULTS` (`x04`) = `{minHours:24, minSessions:5}` (cli_inner_pretty.js:448742)
- `lockPath` (`JQ6`) — `<memoryDir>/.consolidate-lock` (cli_inner_pretty.js:399347)
- `readLastConsolidatedAt` (`_Z8`) — lock-file mtime, 0 if absent (cli_inner_pretty.js:399350)
- `acquireDreamLock` (`_Y4`) — atomic PID+mtime lock with stale/dead-PID reclaim (cli_inner_pretty.js:399357)
- `releaseDreamLock` (`zZ8`) — rollback: unlink or rewind mtime (cli_inner_pretty.js:399381)
- `listSessionsTouchedSince` (`zY4`) — session UUIDs with mtime > threshold (cli_inner_pretty.js:399395)
- `LOCK_FILE_NAME` (`qE_`) = `".consolidate-lock"` (cli_inner_pretty.js:399401)
- `HOLDER_STALE_MS` (`KE_`) = 3600000 (cli_inner_pretty.js:399402)
- `isProcessRunning` (`Av`) — `process.kill(pid,0)` liveness probe (cli_inner_pretty.js:99065)
- `isDreamTaskRecord` (`XQ6`) — task-record type guard (cli_inner_pretty.js:399413)
- `registerDreamTask` (`AY4`) — register a `dream` task in the registry (cli_inner_pretty.js:399416)
- `aggregateDreamProgress` (`YY4`) — fold a turn into the task record (cli_inner_pretty.js:399432)
- `finalizeDreamTask` (`fY4`) — emit `task_dream`, mark completed (cli_inner_pretty.js:399445)
- `rollbackDreamTask` (`OY4`) — emit `task_dream_failed`, mark failed (cli_inner_pretty.js:399450)
- `MAX_DREAM_TURNS` (`_E_`) = 30 (cli_inner_pretty.js:399455)
- `drainPendingMemoryUpdates` (`vw4`) — drains queue into `memory_update` attachments (cli_inner_pretty.js:413803)
- `MEMORY_UPDATE_SOURCE_LABELS` (`BQ_`) = `{dream:"Background memory consolidation"}` (cli_inner_pretty.js:446768)
- `AMBIENT_CONTEXT_FOOTER` (`yT8`) — "This is ambient context — do not narrate it…" (cli_inner_pretty.js:446489)
- `currentSessionId` (`E$`) — `sessionId` accessor (cli_inner_pretty.js:2359)
- `isTeamMemServerActive` (`$68`) — team-mem-server gate `nM$() && S7$()==="has-content"` (cli_inner_pretty.js:144737)
- `dreamScheduledTaskScaffold` (`As4`) — `/dream` scheduled-task SKILL.md template (cli_inner_pretty.js:532705)
- `DREAM_ROUTINE_CMD` (`LOz`) = `"/dream"` (cli_inner_pretty.js:533032)

---

## 1. Two-layer enablement — the gate cascade

Auto-dream is a **gated rollout, default-off**. Enablement is a *two-layer* decision: a server-side opt-in precondition, and a user-toggle layer that can override it. The ordering is subtle and deliberate, so this section walks each function in evaluation order.

### 1.1 The Growthbook config root — `getDreamConfig` (`P04`)

```javascript
// ============================================
// getDreamConfig - Read the tengu_onyx_plover Growthbook config (default null)
// Location: cli_inner_pretty.js:447997-447999
// ============================================

// ORIGINAL (for source lookup):
function P04() {
  return V$("tengu_onyx_plover", null);
}

// READABLE (for understanding):
function getDreamConfig() {
  // V$ = getFeatureValue_CACHED_MAY_BE_STALE (the standard Growthbook reader)
  return getFeatureValue("tengu_onyx_plover", null);
}

// Mapping: P04->getDreamConfig, V$->getFeatureValue (cached Growthbook reader), "tengu_onyx_plover"->dream-config flag
```

`tengu_onyx_plover` is the single Growthbook flag that drives the whole subsystem. Its payload shape is `{enabled?, available?, minHours?, minSessions?}`. Default `null` means *not in the experiment* → disabled for that user. The same flag carries both the on/off bit AND the scheduling knobs (`minHours`/`minSessions`), so a single cohort definition can both enable the feature and tune its cadence.

### 1.2 The server-side opt-in precondition — `isAutoDreamServerSideOptIn` (`QT8`)

```javascript
// ============================================
// isAutoDreamServerSideOptIn - Precondition: server has opted this user in
// Location: cli_inner_pretty.js:448000-448004
// ============================================

// ORIGINAL (for source lookup):
function QT8() {
  let H = P04();
  if (H?.enabled === !0 || H?.available === !0) return !0;
  return $68();
}

// READABLE (for understanding):
function isAutoDreamServerSideOptIn() {
  const cfg = getDreamConfig();
  if (cfg?.enabled === true || cfg?.available === true) return true;
  // Fallback: team-memory server is active AND has content for this repo.
  return isTeamMemServerActive();   // $68: nM$() (tengu_herring_clock) && S7$()==="has-content"
}

// Mapping: QT8->isAutoDreamServerSideOptIn, P04->getDreamConfig, $68->isTeamMemServerActive
```

This is the **"may the user even see/toggle this feature?"** gate. It passes if EITHER the Growthbook config marks the user `enabled` or merely `available` (i.e. "you may turn it on"), OR the team-memory server (`$68`, cli_inner_pretty.js:144737 — gated on the `tengu_herring_clock` team-memory flag plus an actual `"has-content"` server response) is active. The `available` branch is what populates the `/memory` dialog's "Auto-dream" toggle row without forcing it on.

### 1.3 The user-toggle layer — `isAutoDreamFeatureToggleable` (`kk$`)

```javascript
// ============================================
// isAutoDreamFeatureToggleable - User setting overrides server, else server opt-in
// Location: cli_inner_pretty.js:448005-448011
// ============================================

// ORIGINAL (for source lookup):
function kk$() {
  if (!QT8()) return !1;
  let H = i6().autoDreamEnabled;
  if (H !== void 0) return H;
  if (P04()?.enabled === !0) return !0;
  return $68();
}

// READABLE (for understanding):
function isAutoDreamFeatureToggleable() {
  if (!isAutoDreamServerSideOptIn()) return false;     // [A] hard precondition
  const userSetting = getInitialSettings().autoDreamEnabled;
  if (userSetting !== undefined) return userSetting;   // [B] explicit user toggle wins
  if (getDreamConfig()?.enabled === true) return true; // [C] cohort default-on
  return isTeamMemServerActive();                      // [D] team-server default-on
}

// Mapping: kk$->isAutoDreamFeatureToggleable, QT8->isAutoDreamServerSideOptIn,
//          i6->getInitialSettings, P04->getDreamConfig, $68->isTeamMemServerActive
```

**What it does:** Resolves the *effective* enabled state, combining server opt-in with the user's explicit `/memory`-dialog toggle.

**How it works (in evaluation order):**
1. `[A]` If `isAutoDreamServerSideOptIn()` is false, return false immediately. **No user setting can override this.** A user who hand-edits `autoDreamEnabled:true` into `settings.json` still gets `false` unless the server opted them in.
2. `[B]` Read the user setting `autoDreamEnabled`. If it is explicitly `true` or `false` (not `undefined`), **honor it verbatim**. This is what the `/memory` "Auto-dream: on/off" row writes (see §6).
3. `[C]` If the user never toggled, fall to the cohort default: `onyx.enabled === true` → on.
4. `[D]` Otherwise, team-server-active implies on.

**Why the user toggle is checked *last-before-server* (i.e. after the precondition `[A]` but before the cohort/team defaults `[C]/[D]`):**
The precedence is `precondition > user-explicit > server-default`. Putting `[A]` first is a **safety floor** — the feature is heavy (a full forked subagent walking a multi-session corpus), so Anthropic keeps a hard server-side kill rather than letting any client setting force it on prematurely. Putting `[B]` before `[C]/[D]` honors **user agency within the allowed cohort**: once you *can* use the feature, your explicit choice beats the rollout default. If `[B]` came after `[C]`, a user who turned the toggle *off* would have it silently turned back *on* by the cohort default — a clear UX bug. The ordering thus encodes "server decides *availability*, user decides *activation*, cohort decides *the default activation*."

**Key insight:** `available` vs `enabled` in the config is the whole trick. `available:true` (without `enabled:true`) means "show the toggle, default off" — `[A]` passes, `[C]` fails, so a never-toggled user stays off but *can* opt in. `enabled:true` means "default on" — `[C]` passes. This lets Anthropic ship a visible-but-off rollout (collect opt-in telemetry via `tengu_auto_dream_toggled`, §6) before flipping the default.

### 1.4 The master runtime gate — `isAutoDreamEnabled` (`sg_`)

```javascript
// ============================================
// isAutoDreamEnabled - Runtime gate combining env mode + auto-memory + feature toggle
// Location: cli_inner_pretty.js:448540-448545
// ============================================

// ORIGINAL (for source lookup):
function sg_() {
  if ($b()) return !1;
  if (d6()) return !1;
  if (!M1()) return !1;
  return kk$();
}

// READABLE (for understanding):
function isAutoDreamEnabled() {
  if (isKairosActive()) return false;       // $b: KAIROS mode owns its own disk-skill dream
  if (isRemoteWorkspace()) return false;     // d6: remote bridge handles its own consolidation
  if (!isAutoMemoryEnabled()) return false;  // M1: master auto-memory enable (parent of everything)
  return isAutoDreamFeatureToggleable();     // kk$: server opt-in + user toggle
}

// Mapping: sg_->isAutoDreamEnabled, $b->isKairosActive (d$.kairosActive @2781),
//          d6->isRemoteWorkspace (caps.workspace==="remote" @3190),
//          M1->isAutoMemoryEnabled @142111, kk$->isAutoDreamFeatureToggleable
```

This is the gate the scheduler actually calls each turn. The first three checks are *context exclusions*, the last is the *feature decision*:
- `$b()` (`isKairosActive`, cli_inner_pretty.js:2781 — `d$.kairosActive`): when the "KAIROS" assistant mode is active, dreaming is owned by a disk-installed scheduled skill (the `As4` scaffold, §Delta), not the per-turn scheduler — so the per-turn path stands down.
- `d6()` (`isRemoteWorkspace`, cli_inner_pretty.js:3190 — `caps.workspace === "remote"`): a remote workspace bridge runs its own consolidation; the local scheduler would race it.
- `M1()` (`isAutoMemoryEnabled`, cli_inner_pretty.js:142111): the *parent* gate that all three writers share. If auto-memory is off entirely, nothing dreams.
- `kk$()`: the two-layer enablement from §1.3.

### 1.5 The kill-switch placeholder — `isAutoDreamForcedRun` (`tg_`)

```javascript
// ============================================
// isAutoDreamForcedRun - Bypass-all-gates test hook; ships as constant false
// Location: cli_inner_pretty.js:448546-448548
// ============================================

// ORIGINAL (for source lookup):
function tg_() {
  return !1;
}

// READABLE (for understanding):
function isAutoDreamForcedRun() {
  // Ant-build-only test override: bypasses enabled/time/session gates but NOT
  // the lock (so repeated turns don't pile up dreams). Ships as a constant
  // `false` in the public bundle.
  return false;
}

// Mapping: tg_->isAutoDreamForcedRun
```

In the public bundle this is a constant `false`, but it threads through the entire scheduler as the `force`/`isUnconditionalRun` variable (`z` inside `B04`). When forced, it skips the enabled/time/scan/session gates but **deliberately still respects the lock** — under force the scheduler reuses the existing mtime as `priorMtime` so the kill-rollback is a no-op rewind, and concurrent turns can't pile up parallel dreams. The 2.1.88 source comment confirms this is the internal test override (`autoDream.ts` `isForced()`, lines 102-107).

**Cross-validation vs 2.1.88 `config.ts`.** The 2.1.88 *leaf* `config.ts` `isAutoDreamEnabled` is deliberately minimal: `setting ?? gb.enabled` (only steps `[B]` and a simplified `[C]` — no `available`, no team-server fallback). Its file comment explains why: it is a "leaf config module — intentionally minimal imports so UI components can read the auto-dream enabled state without dragging in the forked agent / task registry chain." The *richer* gate (`isGateOpen` in `autoDream.ts`, lines 95-100) layers on `getKairosActive()`, `getIsRemoteMode()`, `isAutoMemoryEnabled()` — which is exactly the 2.1.156 `sg_` cascade. So the 2.1.156 build has **collapsed the two-tier 2.1.88 structure** (`config.isAutoDreamEnabled` + `autoDream.isGateOpen`) into `kk$` (enablement) + `sg_` (gate), and *extended* the enablement with the `available` and `$68` team-server branches that 2.1.88's leaf config lacked. The 2.1.88 split-for-imports concern is gone in the single bundle.

---

## 2. Thresholds and throttle constants

```javascript
// ============================================
// getDreamThresholds - Read minHours/minSessions from onyx, else defaults
// Location: cli_inner_pretty.js:448529-448538
// ============================================

// ORIGINAL (for source lookup):
function ag_() {
  let H = V$("tengu_onyx_plover", null);
  return {
    minHours:
      typeof H?.minHours === "number" && Number.isFinite(H.minHours) && H.minHours > 0 ? H.minHours : x04.minHours,
    minSessions:
      typeof H?.minSessions === "number" && Number.isFinite(H.minSessions) && H.minSessions > 0
        ? H.minSessions
        : x04.minSessions,
  };
}

// READABLE (for understanding):
function getDreamThresholds() {
  const cfg = getFeatureValue("tengu_onyx_plover", null);
  return {
    minHours:
      typeof cfg?.minHours === "number" && Number.isFinite(cfg.minHours) && cfg.minHours > 0
        ? cfg.minHours : AUTO_DREAM_THRESHOLD_DEFAULTS.minHours,    // 24
    minSessions:
      typeof cfg?.minSessions === "number" && Number.isFinite(cfg.minSessions) && cfg.minSessions > 0
        ? cfg.minSessions : AUTO_DREAM_THRESHOLD_DEFAULTS.minSessions, // 5
  };
}

// Mapping: ag_->getDreamThresholds, x04->AUTO_DREAM_THRESHOLD_DEFAULTS, V$->getFeatureValue
```

- `AUTO_DREAM_THRESHOLD_DEFAULTS` (`x04`) = `{minHours: 24, minSessions: 5}` (cli_inner_pretty.js:448742, set in the module-init block alongside `og_`).
- `AUTO_DREAM_SCAN_THROTTLE_MS` (`og_`) = `600000` = 10 minutes (cli_inner_pretty.js:448715).

**Why per-field defensive validation** (`typeof === "number" && Number.isFinite && > 0`)**?** Because Growthbook config is *cached and may be stale or wrong-typed* — the comment in 2.1.88 `autoDream.ts` (lines 71-72) says exactly this: "Defensive per-field validation since GB cache can return stale wrong-type values." A bad server payload (e.g. `minHours: "soon"` or `minHours: 0`) must not crash the per-turn hook or turn it into a runaway (a `0` threshold would fire every turn). Falling back per-field rather than per-object means a config that overrides only `minSessions` still gets the default `minHours`.

The defaults are tuned so that auto-dream fires *roughly once a day* (24h) but only after *5 other sessions* have touched the project — i.e. enough cross-session activity to make consolidation worthwhile. Both numbers match 2.1.88's `DEFAULTS` constant exactly.

---

## 3. The scheduler — `initAutoDream` / `autoDreamExtractor` / `runAutoDreamCheck`

The scheduler is a **closure factory pattern**. `initAutoDream` (`p04`) is called once at startup; it captures a private `lastSessionScanAt = 0` and assigns the real worker to the module-level `B04`. The public entry `runAutoDreamCheck` (`U04`) just forwards to `B04?.(...)` — so before init it is a safe no-op.

```javascript
// ============================================
// runAutoDreamCheck - Public entry called by the Stop-hook (no-op until init)
// Location: cli_inner_pretty.js:448709-448717
// ============================================

// ORIGINAL (for source lookup):
async function U04(H, $) {
  await B04?.(H, $);
}
var u04, m04, rg_, og_ = 600000, x04, B04 = null;

// READABLE (for understanding):
async function runAutoDreamCheck(replHookContext, appendSystemMessage) {
  await autoDreamExtractor?.(replHookContext, appendSystemMessage);
}
let fsPromises, pathMod, teamMem, AUTO_DREAM_SCAN_THROTTLE_MS = 600000, AUTO_DREAM_THRESHOLD_DEFAULTS, autoDreamExtractor = null;

// Mapping: U04->runAutoDreamCheck, B04->autoDreamExtractor, rg_->teamMem,
//          og_->AUTO_DREAM_SCAN_THROTTLE_MS, x04->AUTO_DREAM_THRESHOLD_DEFAULTS
```

**Why closure-scope `lastSessionScanAt` instead of module-level?** The 2.1.88 comment (`autoDream.ts:10-11`) explains: "State is closure-scoped inside `initAutoDream()` rather than module-level (tests call `initAutoDream()` in `beforeEach` for a fresh closure)." Each test gets a clean throttle clock without resetting a global.

### 3.1 `autoDreamExtractor` (`B04`) — the full gate→fork→track loop, step by step

This is the heart of the subsystem. Here is the complete worker, condensed but faithful:

```javascript
// ============================================
// autoDreamExtractor - The per-turn gate cascade + dream fork + completion loop
// Location: cli_inner_pretty.js:448549-448677
// ============================================

// ORIGINAL (for source lookup, condensed — gates only):
function p04() {
  let H = 0;                                            // lastSessionScanAt (closure)
  B04 = async function (q, K) {
    let _ = ag_(), z = tg_();                           // thresholds, force
    if (!z && !sg_()) return;                           // GATE 1: feature
    let A;
    try { A = await _Z8(); } catch (P) { N(`...`); return; }  // lock mtime = lastConsolidatedAt
    let Y = (Date.now() - A) / 3600000;                 // hoursSince
    if (!z && Y < _.minHours) return;                   // GATE 2: time
    let f = Date.now() - H;
    if (!z && f < og_) { N(`[autoDream] scan throttle ...`); return; }  // GATE 3: scan-throttle
    H = Date.now();                                      // advance scan ts
    let O;
    try { O = await zY4(A); } catch (P) { N(`...`); return; }  // sessions touched since
    let M = E$();                                        // current session id
    if (((O = O.filter((P) => P !== M)), !z && O.length < _.minSessions)) {
      d("tengu_auto_dream_skipped", { reason: "sessions", session_count: O.length, min_required: _.minSessions });
      return;                                            // GATE 4: sessions
    }
    let j;
    if (z) j = A;                                        // forced: reuse mtime (rollback no-op)
    else { try { j = await _Y4(); } catch (P) { N(`...`); return; }
           if (j === null) { d("tengu_auto_dream_skipped", { reason: "lock" }); return; } }  // GATE 5: lock
    // ... fire + fork + completion (below) ...
  };
}

// READABLE (for understanding):
function initAutoDream() {
  let lastSessionScanAt = 0;
  autoDreamExtractor = async function (replContext, appendSystemMessage) {
    const thresholds = getDreamThresholds();
    const force = isAutoDreamForcedRun();
    // GATE 1 — feature enabled (cheapest: a few flag reads, no I/O)
    if (!force && !isAutoDreamEnabled()) return;
    // GATE 2 — time since last consolidation (one stat)
    let lastConsolidatedAt;
    try { lastConsolidatedAt = await readLastConsolidatedAt(); }
    catch (e) { debugLog(`[autoDream] readLastConsolidatedAt failed: ${e}`); return; }
    const hoursSince = (Date.now() - lastConsolidatedAt) / 3_600_000;
    if (!force && hoursSince < thresholds.minHours) return;
    // GATE 3 — scan throttle (cheap early-out before the expensive session scan)
    const sinceScan = Date.now() - lastSessionScanAt;
    if (!force && sinceScan < AUTO_DREAM_SCAN_THROTTLE_MS) {
      debugLog(`[autoDream] scan throttle — time-gate passed but last scan was ${Math.round(sinceScan/1000)}s ago`);
      return;
    }
    lastSessionScanAt = Date.now();
    // GATE 4 — enough OTHER sessions touched since last consolidation (a readdir + N stats)
    let sessions;
    try { sessions = await listSessionsTouchedSince(lastConsolidatedAt); }
    catch (e) { debugLog(`[autoDream] listSessionsTouchedSince failed: ${e}`); return; }
    sessions = sessions.filter(id => id !== currentSessionId());   // exclude self
    if (!force && sessions.length < thresholds.minSessions) {
      logEvent("tengu_auto_dream_skipped", { reason: "sessions", session_count: sessions.length, min_required: thresholds.minSessions });
      return;
    }
    // GATE 5 — acquire the filesystem lock (prevents two concurrent dreams)
    let priorMtime;
    if (force) priorMtime = lastConsolidatedAt;
    else {
      try { priorMtime = await acquireDreamLock(); }
      catch (e) { debugLog(`[autoDream] lock acquire failed: ${e}`); return; }
      if (priorMtime === null) { logEvent("tengu_auto_dream_skipped", { reason: "lock" }); return; }
    }
    // ... all gates passed: fire + fork + completion (§3.2) ...
  };
}

// Mapping: p04->initAutoDream, B04->autoDreamExtractor, ag_->getDreamThresholds, tg_->isAutoDreamForcedRun,
//          sg_->isAutoDreamEnabled, _Z8->readLastConsolidatedAt, zY4->listSessionsTouchedSince,
//          E$->currentSessionId, _Y4->acquireDreamLock, og_->AUTO_DREAM_SCAN_THROTTLE_MS, N->debugLog, d->logEvent
```

**Step-by-step:**

1. **GATE 1 — feature enabled** (`!force && !sg_()`). Just a handful of flag reads; no I/O. The vast majority of turns die here because the feature is off-by-default (§1).
2. **GATE 2 — time gate.** `readLastConsolidatedAt()` is *one `stat`* of the lock file; its `mtime` IS `lastConsolidatedAt` (§4). If `hoursSince < minHours`, return. This is the primary "roughly once a day" throttle.
3. **GATE 3 — scan throttle.** If less than `AUTO_DREAM_SCAN_THROTTLE_MS` (10 min) has elapsed since the *last scan attempt*, return.
4. **GATE 4 — session gate.** `listSessionsTouchedSince(lastConsolidatedAt)` does a `readdir` of the transcripts dir plus a `stat` per `.jsonl` file (§4.5). It filters out the **current** session (whose mtime is always recent). If fewer than `minSessions` *other* sessions, emit `tengu_auto_dream_skipped {reason:"sessions"}` and return.
5. **GATE 5 — lock.** `acquireDreamLock()` (§4.3) atomically writes our PID and touches the mtime. `null` means another live process holds it → emit `tengu_auto_dream_skipped {reason:"lock"}` and return. Returns the *prior* mtime for rollback.
6. **Fire + fork + completion** — §3.2.

**Why a 10-minute scan-throttle ON TOP OF the time-gate?** This is the cleverest piece of scheduling logic. Consider the failure mode it fixes: once `hoursSince >= minHours` (say it's been 25 hours), the **time-gate passes on every subsequent turn**. But the lock-file mtime is *only* advanced when a dream actually fires (or by manual `/dream`). If the *session* gate keeps failing (you have only 3 sessions, need 5), the mtime never advances, so the time-gate keeps passing — and you would re-run the **expensive** session scan (`readdir` + N `stat`s) on *every single turn* indefinitely. The 2.1.88 comment names this exactly (`autoDream.ts:54-55`): "when time-gate passes but session-gate doesn't, the lock mtime doesn't advance, so the time-gate keeps passing every turn." The scan-throttle is a cheap clock (in-memory subtraction, no syscalls) that caps the expensive session scan to once per 10 minutes. The gate order — time (1 stat) → scan-throttle (0 syscalls) → session scan (N stats) — is **strictly cheapest-first**, so a hot loop pays at most one `stat` per turn.

**Key insight:** The two throttles are *complementary, not redundant*. The time-gate (`minHours`, persisted in the lock mtime) survives process restarts and coordinates across machines via the shared lock file. The scan-throttle (`lastSessionScanAt`, in-memory) is a per-process backoff that protects against the within-day "time-gate stuck open" hot loop. Neither alone is sufficient.

### 3.2 Fire, fork, and completion

```javascript
// ============================================
// autoDreamExtractor (fork+completion) - Build prompt, run forked subagent, surface results
// Location: cli_inner_pretty.js:448597-448675
// ============================================

// ORIGINAL (for source lookup, condensed):
let w = rg_?.isTeamMemoryEnabled() ?? !1;
d("tengu_auto_dream_fired", { hours_since: Math.round(Y), sessions_since: O.length, team_memory_enabled: w });
let { taskRegistry: D } = q.toolUseContext, J = new AbortController(),
    X = AY4(D, { sessionsReviewing: O.length, priorMtime: j, abortController: J }), L = "fork";
try {
  let P = TA(), Z = kO(f6()), W = await Hd_(P), G = _D(),
      V = G ? `...EditTool not permitted, delete+Write...` : `...read-only shell...\n\nSessions since last consolidation (${O.length}):\n${O.map((B) => `- ${B}`).join("\n")}`,
      v = G ? VFK(P, V, w) : C04(P, Z, V, w),
      h = await xZ({ promptMessages: [T8({ content: v })], cacheSafeParams: sp(q),
                     canUseTool: cT8(P), querySource: "auto_dream", forkLabel: "auto_dream",
                     skipTranscript: !0, overrides: { abortController: J }, onMessage: eg_(X, D), skipCacheWrite: D$$() });
  ((L = "completion"), fY4(X, D));
  let I = q.toolUseContext.taskRegistry.get(X), C = XQ6(I) ? I.filesTouched.length : 0;
  if (XQ6(I) && I.filesTouched.length > 0)
    (K?.({ ...CT8(I.filesTouched), verb: "Improved" }),
     q.toolUseContext.setAppState((B) => ({ ...B, pendingMemoryUpdates: [...B.pendingMemoryUpdates,
        { source: "dream", summary: `consolidated ${I.filesTouched.length} ${N8(I.filesTouched.length, "memory file")}`, paths: I.filesTouched }] })));
  d("tengu_auto_dream_completed", { cache_read: h.totalUsage.cache_read_input_tokens, cache_created: h.totalUsage.cache_creation_input_tokens,
     output: h.totalUsage.output_tokens, sessions_reviewed: O.length, daily_logs_found: W, files_touched_count: C, team_memory_enabled: w });
} catch (P) {
  if (J.signal.aborted) { N("[autoDream] aborted by user"); return; }
  (N(`[autoDream] ${L} failed: ${TH(P)}`), d("tengu_auto_dream_failed", { phase: L, error_class: F6(P).name }),
   L === "fork") && (OY4(X, D), await zZ8(j));
}

// READABLE (for understanding):
const teamEnabled = teamMem?.isTeamMemoryEnabled() ?? false;
logEvent("tengu_auto_dream_fired", { hours_since: Math.round(hoursSince), sessions_since: sessions.length, team_memory_enabled: teamEnabled });
const { taskRegistry } = replContext.toolUseContext;
const abortController = new AbortController();
const taskId = registerDreamTask(taskRegistry, { sessionsReviewing: sessions.length, priorMtime, abortController });
let phase = "fork";
try {
  const memoryDir = getAutoMemPath();
  const transcriptDir = getProjectTranscriptDir(getOriginalCwd());
  const dailyLogCount = await countDailyLogs(memoryDir);
  const isTiny = isTinyMemoryEnabled();
  const extraContext = isTiny
    ? `\n\n**Tool constraints for this run:** Shell access is restricted to read-only commands ... ${EditToolName} is not permitted — memories are immutable, so delete + ${WriteToolName} to replace, never edit in place. ...`
    : `\n\n**Tool constraints for this run:** Shell access is restricted to read-only commands ... Anything else that writes, redirects to a file, or modifies state will be denied. ...\n\nSessions since last consolidation (${sessions.length}):\n${sessions.map(s => `- ${s}`).join("\n")}`;
  const promptText = isTiny
    ? buildDreamPromptTiny(memoryDir, extraContext, teamEnabled)              // VFK
    : buildDreamPrompt(memoryDir, transcriptDir, extraContext, teamEnabled);  // C04
  const result = await runForkedAgent({
    promptMessages: [userMessage({ content: promptText })],
    cacheSafeParams: createCacheSafeParams(replContext),
    canUseTool: createAutoMemCanUseTool(memoryDir),    // cT8 — SAME validator as extraction
    querySource: "auto_dream", forkLabel: "auto_dream", skipTranscript: true,
    overrides: { abortController },
    onMessage: trackDreamFilesTouched(taskId, taskRegistry),   // eg_
    skipCacheWrite: shouldSkipCacheWrite(),
  });
  phase = "completion";
  finalizeDreamTask(taskId, taskRegistry);
  const rec = taskRegistry.get(taskId);
  const filesTouchedCount = isDreamTaskRecord(rec) ? rec.filesTouched.length : 0;
  if (isDreamTaskRecord(rec) && rec.filesTouched.length > 0) {
    appendSystemMessage?.({ ...createMemorySavedMessage(rec.filesTouched), verb: "Improved" });
    replContext.toolUseContext.setAppState(s => ({ ...s, pendingMemoryUpdates: [...s.pendingMemoryUpdates,
      { source: "dream", summary: `consolidated ${rec.filesTouched.length} ${pluralize(rec.filesTouched.length, "memory file")}`, paths: rec.filesTouched }] }));
  }
  logEvent("tengu_auto_dream_completed", { cache_read: result.totalUsage.cache_read_input_tokens, cache_created: result.totalUsage.cache_creation_input_tokens,
     output: result.totalUsage.output_tokens, sessions_reviewed: sessions.length, daily_logs_found: dailyLogCount, files_touched_count: filesTouchedCount, team_memory_enabled: teamEnabled });
} catch (e) {
  if (abortController.signal.aborted) { debugLog("[autoDream] aborted by user"); return; }
  logEvent("tengu_auto_dream_failed", { phase, error_class: getErrorClass(e).name });
  if (phase === "fork") { rollbackDreamTask(taskId, taskRegistry); await releaseDreamLock(priorMtime); }
}

// Mapping: AY4->registerDreamTask, TA->getAutoMemPath, kO(f6())->getProjectTranscriptDir(getOriginalCwd),
//          Hd_->countDailyLogs, _D->isTinyMemoryEnabled, VFK->buildDreamPromptTiny, C04->buildDreamPrompt,
//          xZ->runForkedAgent, sp->createCacheSafeParams, cT8->createAutoMemCanUseTool, eg_->trackDreamFilesTouched,
//          D$$->shouldSkipCacheWrite, fY4->finalizeDreamTask, XQ6->isDreamTaskRecord, CT8->createMemorySavedMessage,
//          N8->pluralize, OY4->rollbackDreamTask, zZ8->releaseDreamLock, F6->getErrorClass
```

**How completion works:**
1. `phase` starts `"fork"` and flips to `"completion"` right after the fork returns. This labels which side of the boundary an error came from — and **only fork-phase failures trigger rollback** (a completion-phase error means the dream already ran, so rewinding the lock would let it re-run pointlessly).
2. `finalizeDreamTask` marks the task completed and emits `task_dream`.
3. Read `filesTouched` off the task record (populated by the `onMessage` watcher, §5). If any files changed:
   - `appendSystemMessage({...createMemorySavedMessage(files), verb:"Improved"})` — the inline transcript pill, using the SAME `memory_saved` system message as extraction but with `verb` swapped from `"Saved"` to `"Improved"`.
   - Push `{source:"dream", summary:"consolidated N memory file(s)", paths}` onto the `pendingMemoryUpdates` app-state queue — drained next turn into an ambient `memory_update` attachment (§7).
4. Emit `tengu_auto_dream_completed` with the full payload: `{cache_read, cache_created, output, sessions_reviewed, daily_logs_found, files_touched_count, team_memory_enabled}` (verified at cli_inner_pretty.js:448654).

**Error path:** If the user killed the dream (`abortController.signal.aborted`), bail silently — `DreamTask.kill` already rolled back the lock. Otherwise emit `tengu_auto_dream_failed {phase, error_class}`; and if it was a *fork-phase* failure, `rollbackDreamTask` (emits `task_dream_failed`) + `releaseDreamLock(priorMtime)` to rewind the mtime so the next turn can retry.

> **Delta vs 2.1.88 `autoDream.ts`:** 2.1.156 adds three things the 2.1.88 source lacks: (a) `daily_logs_found` in the completion event (powered by `countDailyLogs`, §5.2); (b) the `pendingMemoryUpdates` push + ambient `memory_update` loop (2.1.88 only does the inline `appendSystemMessage`); (c) a richer `tengu_auto_dream_failed` payload `{phase, error_class}` vs 2.1.88's empty `{}`. Otherwise the fork wiring (`querySource`/`forkLabel:"auto_dream"`, `skipTranscript:true`, shared `createAutoMemCanUseTool`) is identical.

---

## 4. The filesystem lock protocol — `.consolidate-lock`

The lock is the single most elegant piece of this subsystem. **The lock file's mtime simultaneously serves as `lastConsolidatedAt` (the time-gate timestamp) AND the lock state.** One inode, two jobs.

- `lockPath` (`JQ6`, cli_inner_pretty.js:399347) = `join(getAutoMemPath(), ".consolidate-lock")` — lives *inside* the memory dir so it keys on git-root the same way memory does and is writable even under an env/settings path override.
- `LOCK_FILE_NAME` (`qE_`) = `".consolidate-lock"` (cli_inner_pretty.js:399401).
- `HOLDER_STALE_MS` (`KE_`) = `3600000` = 1 hour (cli_inner_pretty.js:399402).

### 4.1 `readLastConsolidatedAt` (`_Z8`) — mtime IS the timestamp

```javascript
// ============================================
// readLastConsolidatedAt - The lock-file mtime doubles as lastConsolidatedAt
// Location: cli_inner_pretty.js:399350-399356
// ============================================

// ORIGINAL (for source lookup):
async function _Z8() {
  try { return (await kC.stat(JQ6())).mtimeMs; }
  catch { return 0; }
}

// READABLE (for understanding):
async function readLastConsolidatedAt() {
  try { return (await fsPromises.stat(lockPath())).mtimeMs; }
  catch { return 0; }   // ENOENT — never consolidated → epoch → time-gate always passes
}

// Mapping: _Z8->readLastConsolidatedAt, JQ6->lockPath, kC->fsPromises
```

Per-turn cost is exactly one `stat`. No file means "never consolidated", returned as `0` (epoch), so `hoursSince` is enormous and the time-gate passes — the very first eligible session triggers a dream.

### 4.2 The body and the PID-reuse guard

The lock file body is the holder's PID (`String(process.pid)`). The mtime tracks freshness. The `HOLDER_STALE_MS` window guards against PID reuse: even if the recorded PID happens to be alive, after 1 hour the lock is considered stale and reclaimable — because over an hour the OS may have recycled the dead holder's PID onto an unrelated process.

### 4.3 `acquireDreamLock` (`_Y4`) — atomic acquire with reclaim and race re-verify

```javascript
// ============================================
// acquireDreamLock - Atomic lock acquire: stale/dead-PID reclaim + race re-verify
// Location: cli_inner_pretty.js:399357-399380
// ============================================

// ORIGINAL (for source lookup):
async function _Y4() {
  let H = JQ6(), $, q;
  try {
    let [_, z] = await Promise.all([kC.stat(H), kC.readFile(H, "utf8")]);
    $ = _.mtimeMs;
    let A = parseInt(z.trim(), 10);
    q = Number.isFinite(A) ? A : void 0;
  } catch {}
  if ($ !== void 0 && Date.now() - $ < KE_) {
    if (q !== void 0 && Av(q))
      return (N(`[autoDream] lock held by live PID ${q} (mtime ${Math.round((Date.now() - $) / 1000)}s ago)`), null);
  }
  (await kC.mkdir(TA(), { recursive: !0 }), await kC.writeFile(H, String(process.pid)));
  let K;
  try { K = await kC.readFile(H, "utf8"); } catch { return null; }
  if (parseInt(K.trim(), 10) !== process.pid) return null;
  return $ ?? 0;
}

// READABLE (for understanding):
async function acquireDreamLock() {
  const path = lockPath();
  let priorMtime, holderPid;
  try {
    const [stat, raw] = await Promise.all([fsPromises.stat(path), fsPromises.readFile(path, "utf8")]);
    priorMtime = stat.mtimeMs;
    const parsed = parseInt(raw.trim(), 10);
    holderPid = Number.isFinite(parsed) ? parsed : undefined;
  } catch { /* ENOENT — no prior lock */ }
  // Blocked only if fresh (<1h) AND the holder PID is actually alive.
  if (priorMtime !== undefined && Date.now() - priorMtime < HOLDER_STALE_MS) {
    if (holderPid !== undefined && isProcessRunning(holderPid)) {
      debugLog(`[autoDream] lock held by live PID ${holderPid} (mtime ${Math.round((Date.now()-priorMtime)/1000)}s ago)`);
      return null;
    }
    // dead PID or unparseable body → reclaim
  }
  await fsPromises.mkdir(getAutoMemPath(), { recursive: true });
  await fsPromises.writeFile(path, String(process.pid));   // claim: our PID + mtime=now
  // Two reclaimers both wrote → last writer wins the PID; the loser bails here.
  let verify;
  try { verify = await fsPromises.readFile(path, "utf8"); } catch { return null; }
  if (parseInt(verify.trim(), 10) !== process.pid) return null;
  return priorMtime ?? 0;   // prior mtime, for rollback
}

// Mapping: _Y4->acquireDreamLock, JQ6->lockPath, KE_->HOLDER_STALE_MS, Av->isProcessRunning,
//          TA->getAutoMemPath, kC->fsPromises
```

**How it works:**
1. Read both `mtime` and `PID` (in one `Promise.all`). Missing file → no prior lock.
2. **Blocked iff** the lock is fresh (`< HOLDER_STALE_MS`) AND the PID is live (`isProcessRunning` = `process.kill(pid, 0)` returning truthy, cli_inner_pretty.js:99065). Otherwise (stale, dead PID, or garbage body) we proceed to reclaim.
3. `mkdir -p` the memory dir (it may not exist on a fresh project), then `writeFile` our own PID — this bumps the mtime to `now`.
4. **Race re-verify:** read the file back. If two processes both reclaimed at once, the last writer's PID wins; any process that reads back a PID != its own lost the race and returns `null`.
5. Return the *prior* mtime so the caller can rewind it on failure.

**Why the read-back re-verify?** Plain `writeFile` is not atomic against a concurrent `writeFile` — both could "succeed". The re-read makes "last writer wins, everyone else backs off" the resolution rule, with no advisory `flock` (which is unreliable over network filesystems). This is a classic optimistic-concurrency pattern: write-then-verify.

**Cross-validation vs 2.1.88 `consolidationLock.ts`:** `LOCK_FILE='.consolidate-lock'` ✓, `HOLDER_STALE_MS=60*60*1000` ✓ (=3600000), body = `String(process.pid)` ✓, "mtime IS lastConsolidatedAt" ✓, the `isProcessRunning` + 1-hour PID-reuse guard ✓, the write-then-`readFile`-verify race resolution ✓. The 2.1.156 `_Y4` is a **1:1 transliteration** of `tryAcquireConsolidationLock` (lines 46-84), down to the debug-log wording.

### 4.4 `releaseDreamLock` (`zZ8`) — rollback by unlink-or-rewind

```javascript
// ============================================
// releaseDreamLock - Rollback: unlink if no prior lock, else rewind mtime to prior
// Location: cli_inner_pretty.js:399381-399394
// ============================================

// ORIGINAL (for source lookup):
async function zZ8(H) {
  let $ = JQ6();
  try {
    if (H === 0) { await kC.unlink($); return; }
    await kC.writeFile($, "");
    let q = H / 1000;
    await kC.utimes($, q, q);
  } catch (q) { N(`[autoDream] rollback failed: ${TH(q)} — next trigger delayed to minHours`); }
}

// READABLE (for understanding):
async function releaseDreamLock(priorMtime) {
  const path = lockPath();
  try {
    if (priorMtime === 0) { await fsPromises.unlink(path); return; }  // restore "no file" state
    await fsPromises.writeFile(path, "");          // clear the PID body (we're not holding anymore)
    const seconds = priorMtime / 1000;             // utimes wants seconds
    await fsPromises.utimes(path, seconds, seconds);  // rewind mtime to pre-acquire
  } catch (e) {
    debugLog(`[autoDream] rollback failed: ${e} — next trigger delayed to minHours`);
  }
}

// Mapping: zZ8->releaseDreamLock, JQ6->lockPath, kC->fsPromises
```

This is called only on **fork-phase failure** (and by `DreamTask.kill`). It clears the PID body (otherwise our still-running process would keep "holding" the lock and block the next attempt) and rewinds the mtime to its pre-acquire value, so the time-gate passes again on the next turn — the scan-throttle then provides the backoff. If `priorMtime` was `0` (no prior file), it unlinks instead. **If rollback itself fails, it logs and gives up gracefully:** the next trigger is simply delayed by up to `minHours` (the lock now has a `now` mtime), which is acceptable degradation, not a hang.

### 4.5 `listSessionsTouchedSince` (`zY4`)

```javascript
// ============================================
// listSessionsTouchedSince - Session UUIDs whose transcript mtime > threshold
// Location: cli_inner_pretty.js:399395-399398
// ============================================

// ORIGINAL (for source lookup):
async function zY4(H) {
  let $ = kO(f6());
  return (await nSH($, !0)).filter((K) => K.mtime > H).map((K) => K.sessionId);
}

// READABLE (for understanding):
async function listSessionsTouchedSince(sinceMs) {
  const transcriptDir = getProjectTranscriptDir(getOriginalCwd());
  const candidates = await listCandidates(transcriptDir, /*withStat=*/true);
  return candidates.filter(c => c.mtime > sinceMs).map(c => c.sessionId);
}

// Mapping: zY4->listSessionsTouchedSince, kO(f6())->getProjectTranscriptDir(getOriginalCwd), nSH->listCandidates
```

`listCandidates` (`nSH`, cli_inner_pretty.js:399190) reads the per-project transcripts directory, accepts only `*.jsonl` files whose stem parses as a UUID (rejecting `agent-*.jsonl` subagent transcripts), and `stat`s each for its mtime. The scheduler filters to sessions touched after the threshold, excludes the current session, and counts. Using `mtime` ("sessions *touched* since") rather than birthtime is deliberate — the 2.1.88 comment notes birthtime is 0 on ext4, and an undercount here is safe because this is just a skip-gate, not a correctness boundary.

---

## 5. Progress tracking and the task registry

The dream runs as a forked subagent (`skipTranscript:true`), so it is otherwise invisible. The **task registry** surfaces it in the footer pill and the Shift+Down background-tasks dialog, and accumulates the `filesTouched` list that drives the completion notifications.

### 5.1 `trackDreamFilesTouched` (`eg_`) — the onMessage watcher

```javascript
// ============================================
// trackDreamFilesTouched - onMessage callback collecting Edit/Write + rm/.md paths
// Location: cli_inner_pretty.js:448678-448699
// ============================================

// ORIGINAL (for source lookup):
function eg_(H, $) {
  return (q) => {
    if (q.type !== "assistant") return;
    let K = "", _ = 0, z = [];
    for (let A of q.message.content)
      if (A.type === "text") K += A.text;
      else if (A.type === "tool_use") {
        if ((_++, A.name === l7 || A.name === B9)) {
          let Y = A.input;
          if (typeof Y.file_path === "string") z.push(Y.file_path);
        } else if (iT.includes(A.name)) {
          let Y = A.input;
          if (typeof Y.command === "string" && /^\s*(rm|remove-item|ri|del|erase)\b/i.test(Y.command))
            for (let f of Y.command.matchAll(/"[^"]*\.md"|'[^']*\.md'|(?:\/|[A-Za-z]:[\\/])\S*\.md\b/g))
              z.push(f[0].replace(/^["']|["']$/g, ""));
        }
      }
    YY4(H, { text: K.trim(), toolUseCount: _ }, z, $);
  };
}

// READABLE (for understanding):
function trackDreamFilesTouched(taskId, taskRegistry) {
  return (message) => {
    if (message.type !== "assistant") return;
    let text = "", toolUseCount = 0;
    const filesTouched = [];
    for (const block of message.message.content) {
      if (block.type === "text") { text += block.text; }
      else if (block.type === "tool_use") {
        toolUseCount++;
        if (block.name === EditToolName || block.name === WriteToolName) {       // Edit/Write: file_path
          if (typeof block.input.file_path === "string") filesTouched.push(block.input.file_path);
        } else if (SHELL_TOOL_NAMES.includes(block.name)) {                       // Bash/PowerShell: parse rm
          if (typeof block.input.command === "string" && /^\s*(rm|remove-item|ri|del|erase)\b/i.test(block.input.command))
            for (const m of block.input.command.matchAll(/"[^"]*\.md"|'[^']*\.md'|(?:\/|[A-Za-z]:[\\/])\S*\.md\b/g))
              filesTouched.push(m[0].replace(/^["']|["']$/g, ""));
        }
      }
    }
    aggregateDreamProgress(taskId, { text: text.trim(), toolUseCount }, filesTouched, taskRegistry);
  };
}

// Mapping: eg_->trackDreamFilesTouched, l7->EditToolName, B9->WriteToolName, iT->SHELL_TOOL_NAMES ([gq,BK] @216280),
//          YY4->aggregateDreamProgress
```

**Why parse shell `rm` commands at all?** Because the dream agent *deletes* stale memories via `rm`/`Remove-Item`, not Edit/Write — and a delete is a real change the user should see in the "Improved N memories" count. Without the shell parse, deletions would be invisible. The regex matches quoted `"foo.md"`/`'foo.md'` and absolute unquoted `/path/foo.md` or `C:\path\foo.md` ending in `.md`, mirroring the `createAutoMemCanUseTool` validators that only permit absolute `.md` paths inside `memoryDir`.

> **Delta vs 2.1.88:** 2.1.88's `makeDreamProgressWatcher` (`autoDream.ts:281-313`) **only** records Edit/Write `file_path`s — it has *no* `rm`/`Remove-Item` parsing branch. 2.1.156's `eg_` adds the shell-delete parser. The 2.1.88 `DreamTaskState.filesTouched` JSDoc even concedes the limitation ("misses any bash-mediated writes"); 2.1.156 closes that gap for deletes.

### 5.2 `countDailyLogs` (`Hd_`)

```javascript
// ============================================
// countDailyLogs - Recursive count of .md files under <memoryDir>/logs/
// Location: cli_inner_pretty.js:448700-448708
// ============================================

// ORIGINAL (for source lookup):
async function Hd_(H) {
  try {
    let $ = await u04.readdir(m04.join(H, "logs"), { recursive: !0 });
    return H6($, (q) => q.endsWith(".md"));
  } catch ($) {
    if (!q7($)) N(`[autoDream] countDailyLogs: ${TH($)}`);
    return 0;
  }
}

// READABLE (for understanding):
async function countDailyLogs(memoryDir) {
  try {
    const entries = await fsPromises.readdir(pathMod.join(memoryDir, "logs"), { recursive: true });
    return countWhere(entries, name => name.endsWith(".md"));
  } catch (e) {
    if (!isENOENT(e)) debugLog(`[autoDream] countDailyLogs: ${e}`);
    return 0;   // no logs/ dir → 0
  }
}

// Mapping: Hd_->countDailyLogs, u04->fsPromises, m04->pathMod, H6->countWhere, q7->isENOENT
```

This populates the `daily_logs_found` telemetry field on `tengu_auto_dream_completed`. A missing `logs/` directory (`ENOENT`) is silently `0` — non-fatal, since not every project uses the daily-log layout.

### 5.3 Registry helpers — `AY4` / `YY4` / `fY4` / `OY4` / `XQ6`

These match 2.1.88 `DreamTask.ts` 1:1:
- `registerDreamTask` (`AY4`, cli_inner_pretty.js:399416) — creates a `{type:"dream", status:"running", phase:"starting", sessionsReviewing, filesTouched:[], turns:[], abortController, priorMtime}` record.
- `aggregateDreamProgress` (`YY4`, cli_inner_pretty.js:399432) — folds a turn in: dedups new `filesTouched`, flips `phase` to `"updating"` when the first file lands, and keeps only the last `MAX_DREAM_TURNS` (`_E_=30`, cli_inner_pretty.js:399455) turns for display. Skips the update entirely for empty no-op turns.
- `finalizeDreamTask` (`fY4`, cli_inner_pretty.js:399445) — sets `status:"completed"`, `notified:true`; emits `task_dream`. (`notified:true` immediately because dream has no model-facing notification path; the inline `appendSystemMessage` IS the user surface.)
- `rollbackDreamTask` (`OY4`, cli_inner_pretty.js:399450) — sets `status:"failed"`; emits `task_dream_failed`.
- `isDreamTaskRecord` (`XQ6`, cli_inner_pretty.js:399413) — type guard `task?.type === "dream"`.

The `priorMtime` is stashed on the task record specifically so `DreamTask.kill` can rewind the lock via the *same* `releaseDreamLock` path as a fork-failure — killing a dream from the dialog leaves the lock state clean for the next session.

---

## 6. Enablement telemetry and the `/memory` toggle

```javascript
// ============================================
// auto-dream toggle handler - Persist autoDreamEnabled + emit toggle telemetry
// Location: cli_inner_pretty.js:472910-472916
// ============================================

// ORIGINAL (for source lookup):
DH = function () {
  if (!B) return;
  let tH = !Z, _$ = tH && i6().autoDreamEnabled === void 0;
  (p6("userSettings", { autoDreamEnabled: tH }), W(tH),
   d("tengu_auto_dream_toggled", { enabled: tH, is_first_enable: _$ }));
};

// READABLE (for understanding):
const toggleAutoDream = function () {
  if (!isToggleAvailable) return;                        // B: row only present when QT8() passed
  const newValue = !currentValue;
  const isFirstEnable = newValue && getInitialSettings().autoDreamEnabled === undefined;
  saveSetting("userSettings", { autoDreamEnabled: newValue });   // [B] in kk$ now resolves to this
  setLocalState(newValue);
  logEvent("tengu_auto_dream_toggled", { enabled: newValue, is_first_enable: isFirstEnable });
};

// Mapping: i6->getInitialSettings, p6->saveSetting, d->logEvent, tengu_auto_dream_toggled->toggle event
```

The `/memory` dialog renders an "Auto-dream: on/off" row — present only when **both** `isAutoMemoryEnabled` (`M1`) and `isAutoDreamServerSideOptIn` (`QT8`) are true (`B = L && S` at cli_inner_pretty.js:472869, where `L = M1()`, `S = QT8()`). The auto-memory precondition is usually implicit — "if auto-memory is off, nothing dreams" — but it gates the toggle UI too, so a server-opted-in user with auto-memory disabled never sees the row. Toggling writes `userSettings.autoDreamEnabled` (the `[B]` branch of `kk$`, §1.3), so the user's explicit choice now overrides the cohort default. `is_first_enable` (true the very first time a user flips it on from an unset state) lets Anthropic measure organic opt-in. The row also renders the **`· /dream to run`** hint when on (`!R && Z`, cli_inner_pretty.js:472994) — pointing the user at the *manual* `/dream` routine (§Delta) for an on-demand pass without waiting for the scheduler.

---

## 7. Completion → ambient-context loop

When a dream changes files, the *next* main-agent turn must learn that its memory directory shifted under it — without the dream's internal chatter leaking into the transcript. This is the `pendingMemoryUpdates` → `memory_update` attachment loop.

### 7.1 `drainPendingMemoryUpdates` (`vw4`)

```javascript
// ============================================
// drainPendingMemoryUpdates - Drain queue into memory_update attachments with stale-path flags
// Location: cli_inner_pretty.js:413803-413816
// ============================================

// ORIGINAL (for source lookup):
function vw4(H) {
  let $ = H.getAppState().pendingMemoryUpdates;
  if ($.length === 0) return [];
  H.setAppState((_) => (_.pendingMemoryUpdates.length === 0 ? _ : { ..._, pendingMemoryUpdates: [] }));
  let q = M1() && process.env.CLAUDE_COWORK_MEMORY_INDEX_CONTENT !== "" ? h9H() : null,
    K = (_) => _ === q || H.readFileState.has(_) || H.loadedNestedMemoryPaths?.[_] === !0;
  return $.map((_) => ({ type: "memory_update", source: _.source, summary: _.summary, paths: _.paths, inContextPaths: _.paths.filter(K) }));
}

// READABLE (for understanding):
function drainPendingMemoryUpdates(replContext) {
  const pending = replContext.getAppState().pendingMemoryUpdates;
  if (pending.length === 0) return [];
  replContext.setAppState(s => s.pendingMemoryUpdates.length === 0 ? s : { ...s, pendingMemoryUpdates: [] });
  // Which paths has the model already loaded this session? (only those go stale)
  const entrypointPath = isAutoMemoryEnabled() && process.env.CLAUDE_COWORK_MEMORY_INDEX_CONTENT !== "" ? getEntrypointPath() : null;
  const isInContext = p => p === entrypointPath || replContext.readFileState.has(p) || (replContext.loadedNestedMemoryPaths?.[p] === true);
  return pending.map(u => ({ type: "memory_update", source: u.source, summary: u.summary, paths: u.paths, inContextPaths: u.paths.filter(isInContext) }));
}

// Mapping: vw4->drainPendingMemoryUpdates, M1->isAutoMemoryEnabled, h9H->getEntrypointPath
```

It clears the queue (idempotently) and computes `inContextPaths` — the subset of changed paths the model has *already loaded* in this session (the `MEMORY.md` entrypoint when index-content gating is on, anything in `readFileState`, or `@`-imported nested memories). Only those paths are "stale" and worth telling the model to re-read.

### 7.2 The `memory_update` renderer

```javascript
// ============================================
// memory_update renderer - Build the isMeta do-not-narrate next-turn message
// Location: cli_inner_pretty.js:445768-445784
// ============================================

// ORIGINAL (for source lookup):
case "memory_update": {
  let K = [`${BQ_[H.source]} updated your memory directory: ${H.summary}`];
  if (H.paths.length > 0) K.push(`Files changed: ${H.paths.join(", ")}`);
  if (H.inContextPaths.length > 0)
    K.push(`Your loaded copy of ${H.inContextPaths.join(", ")} is now stale relative to disk — Read it again if you need current contents.`);
  return (K.push(yT8), C_([T8({ content: K.join("\n"), isMeta: !0 })]));
}

// READABLE (for understanding):
case "memory_update": {
  const lines = [`${MEMORY_UPDATE_SOURCE_LABELS[u.source]} updated your memory directory: ${u.summary}`];
  if (u.paths.length > 0) lines.push(`Files changed: ${u.paths.join(", ")}`);
  if (u.inContextPaths.length > 0)
    lines.push(`Your loaded copy of ${u.inContextPaths.join(", ")} is now stale relative to disk — Read it again if you need current contents.`);
  lines.push(AMBIENT_CONTEXT_FOOTER);   // "This is ambient context — do not narrate it..."
  return wrap([userMessage({ content: lines.join("\n"), isMeta: true })]);
}

// Mapping: BQ_->MEMORY_UPDATE_SOURCE_LABELS, yT8->AMBIENT_CONTEXT_FOOTER, T8->userMessage, C_->wrap
```

- `MEMORY_UPDATE_SOURCE_LABELS` (`BQ_`) = `{dream: "Background memory consolidation"}` (cli_inner_pretty.js:446768) — a one-entry map, but extensible if a future source modifies memory in the background.
- `AMBIENT_CONTEXT_FOOTER` (`yT8`) = "This is ambient context — do not narrate it to the user unless they ask or it is directly relevant to their request." (cli_inner_pretty.js:446489).
- The message is built with `isMeta: true` — it informs the model but is suppressed from user-facing narration.

The attachment does three jobs: (1) tells the model its memory changed (otherwise it would silently see different content on the next read); (2) names exactly which *in-context* paths went stale so the model can selectively re-read; (3) instructs it to keep quiet, mapping consolidation to a system-internal event the model accommodates but doesn't surface.

---

## 8. The dream FORK prompt — `buildDreamPrompt` (`C04`)

```javascript
// ============================================
// buildDreamPrompt - The 4-phase memory-consolidation prompt for the forked dream agent
// Location: cli_inner_pretty.js:448446-448524
// ============================================

// ORIGINAL (for source lookup, structure):
function C04(H, $, q, K = !1) {
  return `# Dream: Memory Consolidation

You are performing a dream — a reflective pass over your memory files. ...

Memory directory: \`${H}\`
${p9H}

Session transcripts: \`${$}\` (large JSONL files — grep narrowly, don't read whole files)
${K ? `\n${ng_}\n` : ""}---

## Phase 1 — Orient
- \`ls\` the memory directory ...
- Read \`${OX}\` to understand the current index ...
- \`ls -R logs/\` ...

## Phase 2 — Gather recent signal
1. **Session logs** (\`logs/YYYY/MM/DD/<id>-<title>.md\`) ... each line is prefix-coded (\`>\` user, \`<\` assistant, \`.\` tool call)
2. **Existing memories that drifted** ...
3. **Transcript search** — grep ... | tail -50
Don't exhaustively read transcripts. ...
${S04()}
## Phase 3 — Consolidate
- Merging new signal ... rather than creating near-duplicates
- Converting relative dates ... to absolute dates
- Deleting contradicted facts ...

## Phase 4 — Prune and index
Update \`${OX}\` so it stays under ${B9H} lines AND under ~25KB. ... each entry should be one line under ~150 characters ...
${ig_}
${R04()}---

Return a brief summary ...${q ? `\n\n## Additional context\n\n${q}` : ""}`;
}

// READABLE (for understanding):
function buildDreamPrompt(memoryDir, transcriptDir, additionalContext, teamEnabled = false) {
  return [
    "# Dream: Memory Consolidation",
    "You are performing a dream — a reflective pass over your memory files. ...",
    `Memory directory: \`${memoryDir}\``,
    DIR_EXISTS_GUIDANCE,                                          // p9H
    `Session transcripts: \`${transcriptDir}\` (large JSONL files — grep narrowly...)`,
    teamEnabled ? TEAM_DREAM_PHASE_GUIDANCE : "",                 // ng_
    // Phase 1 — Orient:   ls dir, read MEMORY.md (ENTRYPOINT_NAME=OX), ls -R logs/
    // Phase 2 — Gather:   session logs (prefix-coded lines) > drifted memories > narrow transcript grep
    extraPhaseInjection(),                                        // S04() — empty by default (gg_=[])
    // Phase 3 — Consolidate: merge into existing topic files, relative→absolute dates, delete contradicted
    // Phase 4 — Prune+index: MEMORY.md < 200 lines (MAX_ENTRYPOINT_LINES=B9H) AND < ~25KB; one-line entries
    RECONCILE_AGAINST_CLAUDEMD,                                   // ig_
    extraPhaseInjection2(),                                       // R04() — empty by default (lg_=[])
    `Return a brief summary ...${additionalContext ? `\n\n## Additional context\n\n${additionalContext}` : ""}`,
  ].join("\n\n");
}

// Mapping: C04->buildDreamPrompt, p9H->DIR_EXISTS_GUIDANCE, OX->ENTRYPOINT_NAME ("MEMORY.md"),
//          B9H->MAX_ENTRYPOINT_LINES (200), ng_->TEAM_DREAM_PHASE_GUIDANCE, ig_->RECONCILE_AGAINST_CLAUDEMD,
//          S04/R04->extension injection points (both empty in this build)
```

**Full verbatim prompt text** (`C04` rendered, with `${...}` interpolations resolved to readable placeholders; `—` shown as `—`). This is exactly what the forked dream agent receives, modulo the two empty extension hooks and the team/additional-context conditionals:

```text
# Dream: Memory Consolidation

You are performing a dream — a reflective pass over your memory files. Synthesize what you've learned recently into durable, well-organized memories so that future sessions can orient quickly.

Memory directory: `<memoryDir>`
This directory already exists — write to it directly with the Write tool (do not run mkdir or check for its existence).

Session transcripts: `<transcriptDir>` (large JSONL files — grep narrowly, don't read whole files)
‹‹ if teamEnabled: the TEAM MEMORY block (ng_) is injected here — quoted in full below ››
---

## Phase 1 — Orient

- `ls` the memory directory to see what already exists
- Read `MEMORY.md` to understand the current index
- Skim existing topic files so you improve them rather than creating duplicates
- `ls -R logs/` — recent activity logs (one file per session under `YYYY/MM/DD/`). If a `sessions/` subdirectory also exists, review recent entries there too

## Phase 2 — Gather recent signal

Look for new information worth persisting. Sources in rough priority order:

1. **Session logs** (`logs/YYYY/MM/DD/<id>-<title>.md`) — the append-only activity stream, one file per session. Read the most recent 1–3 days of sessions (the filename title tells you what each was about); each line is prefix-coded (`>` user, `<` assistant, `.` tool call)
2. **Existing memories that drifted** — facts that contradict something you see in the codebase now
3. **Transcript search** — if you need specific context (e.g., "what was the error message from yesterday's build failure?"), grep the JSONL transcripts for narrow terms:
   `grep -rn "<narrow term>" <transcriptDir>/ --include="*.jsonl" | tail -50`

Don't exhaustively read transcripts. Look only for things you already suspect matter.
‹‹ S04() injection point — empty in this build (gg_ = []) ››
## Phase 3 — Consolidate

For each thing worth remembering, write or update a memory file at the top level of the memory directory. Use the memory file format and type conventions from your system prompt's auto-memory section — it's the source of truth for what to save, how to structure it, and what NOT to save.

Focus on:
- Merging new signal into existing topic files rather than creating near-duplicates
- Converting relative dates ("yesterday", "last week") to absolute dates so they remain interpretable after time passes
- Deleting contradicted facts — if today's investigation disproves an old memory, fix it at the source

## Phase 4 — Prune and index

Update `MEMORY.md` so it stays under 200 lines AND under ~25KB. It's an **index**, not a dump — each entry should be one line under ~150 characters: `- [Title](file.md) — one-line hook`. Never write memory content directly into it.

- Remove pointers to memories that are now stale, wrong, or superseded
- Demote verbose entries: if an index line is over ~200 chars, it's carrying content that belongs in the topic file — shorten the line, move the detail
- Add pointers to newly important memories
- Resolve contradictions — if two files disagree, fix the wrong one

‹‹ RECONCILE_AGAINST_CLAUDEMD block (ig_) is injected here — ALWAYS present — quoted in full below ››
‹‹ R04() injection point — empty in this build (lg_ = []) ››
---

Return a brief summary of what you consolidated, updated, or pruned. If nothing changed (memories are already tight), say so.
‹‹ if additionalContext (q) is non-empty: "\n\n## Additional context\n\n<additionalContext>" ››
```

**`ig_` — `RECONCILE_AGAINST_CLAUDEMD` (verbatim, always appended after Phase 4, cli_inner_pretty.js:448516):**

```text
### Reconcile memories against CLAUDE.md

Project CLAUDE.md instructions are loaded in your system prompt. For each `feedback` or `project` memory, check whether it contradicts a CLAUDE.md instruction on the same topic:

- **Memory is stale** — CLAUDE.md and the memory describe different procedures for the same task: CLAUDE.md is the maintained, checked-in source. Delete the memory, or rewrite it to agree if it carries context worth keeping (the *why* is still useful but the *how* is wrong).
- **CLAUDE.md may be stale** — the memory is clearly dated after CLAUDE.md and explicitly corrects it: do NOT edit CLAUDE.md during a dream. Annotate the memory with "contradicts CLAUDE.md — verify which is current" and list it in your summary so the user can update CLAUDE.md.
- **Not a conflict** — the memory adds detail CLAUDE.md doesn't cover, or narrows a CLAUDE.md rule with a stated reason. Leave it.

A `feedback` memory's "Why: the user corrected me" framing is not evidence it's newer than CLAUDE.md — CLAUDE.md may have been updated since.
```

**`ng_` — `TEAM_DREAM_PHASE_GUIDANCE` (verbatim, injected after the transcripts line only when `teamEnabled`, cli_inner_pretty.js:448514):**

```text
## Team memory (`team/` subdirectory)

The `team/` subdirectory holds memories shared across everyone working in this repo. Other teammates' Claude sessions write here too — treat it differently from your personal files:

- **Phase 1:** `ls team/` and skim it alongside your personal files. A teammate may have already captured something you'd otherwise duplicate.
- **Phase 3:** Merge near-duplicates *within* `team/` the same way you would personal memories. If a personal memory restates a team memory, delete the personal one.
- **Phase 4 — be conservative pruning `team/`:**
  - DO delete or fix a team memory that is clearly contradicted by the current code, or that a newer team memory marks as superseded.
  - DO NOT delete a team memory just because you don't recognize it or it isn't relevant to *your* recent sessions — a teammate may rely on it.
  - When unsure, leave it. A stale team memory costs little; deleting a teammate's load-bearing note costs a lot.

Do not promote personal memories into `team/` during a dream — that's a deliberate choice the user makes via `/remember`, not something to do reflexively.
```

**The four phases:**

1. **Phase 1 — Orient.** `ls` the dir, read `MEMORY.md` (the index), skim topic files (so it *improves* existing files instead of creating near-duplicates), and `ls -R logs/`. The prompt names the structure so the agent doesn't waste fork turns discovering it.
2. **Phase 2 — Gather recent signal.** Three prioritized sources: (a) session logs `logs/YYYY/MM/DD/<id>-<title>.md` — an append-only stream with **prefix-coded lines** (`>` user, `<` assistant, `.` tool call) so the agent can scan cheaply; (b) existing memories that *drifted* (contradict the current codebase); (c) narrow transcript grep with `tail -50`. The hard rule "Don't exhaustively read transcripts. Look only for things you already suspect matter" is the key budget guardrail — transcripts are huge JSONL and reading them whole would blow the fork's token budget.
3. **Phase 3 — Consolidate.** Write/update topic files at the top level. Three explicit sub-tasks: merge near-duplicates, convert relative→absolute dates ("yesterday" → a real date, so the memory stays interpretable after time passes), and delete contradicted facts "at the source."
4. **Phase 4 — Prune and index.** Keep `MEMORY.md` under `MAX_ENTRYPOINT_LINES` (200) *and* ~25KB — these are the same caps the runtime truncation enforces, restated here as user-facing rules. Each index entry must be one line under ~150 chars (`- [Title](file.md) — one-line hook`), never raw content. Remove stale pointers, demote verbose entries (>200 chars → content belongs in the topic file), add new pointers, resolve contradictions.

**`RECONCILE_AGAINST_CLAUDEMD` (`ig_`, cli_inner_pretty.js:448516) — always appended.** For each `feedback`/`project` memory it tells the agent how to handle a conflict with the project's CLAUDE.md: *memory-stale* → delete or rewrite the memory (CLAUDE.md is the maintained, checked-in source); *CLAUDE.md-may-be-stale* → **do NOT edit CLAUDE.md during a dream**, instead annotate the memory "contradicts CLAUDE.md — verify which is current" and list it in the summary; *not-a-conflict* → leave it. It even pre-empts a subtle reasoning error: a `feedback` memory's "the user corrected me" framing is *not* evidence it postdates CLAUDE.md.

**`TEAM_DREAM_PHASE_GUIDANCE` (`ng_`, cli_inner_pretty.js:448514) — injected only when `teamEnabled`.** It adds `team/`-specific handling: Phase 1 also `ls team/`; Phase 3 merges near-dups within `team/` and deletes a personal memory that restates a team one; Phase 4 is *conservative* about pruning `team/` (DON'T delete a teammate's note you don't recognize — "a stale team memory costs little; deleting a teammate's load-bearing note costs a lot"). It explicitly forbids promoting personal memories into `team/` during a dream (that's a deliberate `/remember` choice).

**`S04()` / `R04()` extension points.** Two injection hooks (cli_inner_pretty.js:448418, 448433) that splice extra prompt blocks after Phase 2 and after the reconcile block. Both back arrays (`gg_`, `lg_`) are **empty in this build** (`S04` is gated on `Qg_()` and `R04` on `cg_()`, the latter hard-coded `false`), so they currently contribute nothing — they exist as forward hooks for assistant-mode/KAIROS extensions.

### 8.1 The tiny-memory variant `buildDreamPromptTiny` (`VFK`)

When tiny-memory is on (`isTinyMemoryEnabled` / `tengu_billiard_aviary`), the scheduler swaps `C04` for `VFK` (cli_inner_pretty.js:144513, documented in [memdir_core.md](./memdir_core.md)). The functional difference is **immutability**: tiny memories may not be edited in place — to change one you `rm` it and `Write` a fresh file. The fork's `extraContext` also changes accordingly: instead of "Anything else that writes … will be denied", the tiny variant says "`Edit` is not permitted — memories are immutable, so delete + `Write` to replace, never edit in place." This pairs with the shared `createAutoMemCanUseTool` validator, which *denies Edit* in tiny mode.

### 8.2 Why reuse the extraction `canUseTool` (`cT8`)

The dream fork uses the **exact same** `createAutoMemCanUseTool(memoryDir)` (`cT8`) validator as the extraction subagent: Read/Grep/Glob unrestricted; Bash/PowerShell read-only OR `rm`/`Remove-Item` of `*.md` inside `memoryDir`; Edit/Write only inside `memoryDir` (Edit denied in tiny mode); everything else denied. **Why share?** Both subagents do structurally identical work — read recent state, decide what to keep, write/delete memory files — so they need the same sandbox. Sharing one validator means a security fix (e.g. tightening the `rm` parser) applies to both at once, and there is no operational reason for them to differ. This is the same rationale that made extraction's `rm` validators absolute-`.md`-inside-memoryDir-only.

---

## Delta — the `/dream` surface changed

This is the single most visible change versus v2.1.142. **Distinguish two completely separate things that both bear the name "dream":**

- **The per-turn auto-dream scheduler** (everything in §1–§8 above) — *unchanged in structure*. Only obfuscated names rotated (v2.1.142 `nr7→U04`, `cr7→B04`, `lr7→p04`, `SL$→C04`; lock helpers `jd7/tf8/sf8→_Y4/zZ8/_Z8`). Gates, thresholds (24h/5 sessions), 10-min scan throttle, `.consolidate-lock`/1-hour-stale, and the 4-phase fork prompt all carry over verbatim.
- **The `/dream` *slash command*** — **fundamentally changed form.**

### The old `/dream` skill is GONE

In v2.1.142 `/dream` was a registered slash-command skill gated on the Growthbook flag `tengu_kairos_dream` (`z8A`/`K8A`), which built the dream prompt directly and could also set up a cron schedule via a `buildDreamSchedulePrompt`. **In 2.1.156 that flag does not exist:** `grep tengu_kairos_dream cli_inner_pretty.js` returns **0 hits**. The whole `z8A`/`K8A`/`A8A`/`H8A` (SCHEDULE_MODE_REGEX) machinery is removed.

### `/dream` is now a scheduled-task ROUTINE scaffold

`/dream` now exists as a **scheduled-task routine** — a `SKILL.md` template (`As4`, cli_inner_pretty.js:532705) written to disk by the routine installer, alongside `/catch-up` (`DOz`, cli_inner_pretty.js:533029) and `/morning-checkin` (`XOz`, cli_inner_pretty.js:533031). Its command form is `LOz = "/dream"` (cli_inner_pretty.js:533032).

```javascript
// ============================================
// dreamScheduledTaskScaffold - The /dream scheduled-task SKILL.md template (cron-driven, overnight)
// Location: cli_inner_pretty.js:532705-532744
// ============================================

// ORIGINAL (for source lookup, frontmatter + phase headers):
var As4 = `---
name: dream
description: Nightly reflection and consolidation. Runs overnight (1–5am local) via the scheduled task scaffold.
context: fork
---
... **Phase 1: Preparation** ... **Phase 2: Topics** ... **Phase 3: Rules & Learnings** ... learnings/<learning-slug>.md ... **Phase 4: Prioritization and Pruning** ... keep \`MEMORY.md\` under 200 lines ...`;

// READABLE (for understanding):
const dreamScheduledTaskScaffold = `---
name: dream
description: Nightly reflection and consolidation. Runs overnight (1–5am local) via the scheduled task scaffold.
context: fork
---
... **Phase 1: Preparation** — review logs/YYYY/MM/YYYY-MM-DD.md, sessions/YYYY/MM/YYYY-MM-DD.md, existing topics
... **Phase 2: Topics** — extract events/lessons/decisions into top-level <topic-slug>.md
... **Phase 3: Rules & Learnings** — record into learnings/<learning-slug>.md   // NEW dir vs C04
... **Phase 4: Prioritization and Pruning** — keep MEMORY.md under 200 lines, demote long entries ...`;

// Mapping: As4->dreamScheduledTaskScaffold, LOz->DREAM_ROUTINE_CMD ("/dream")
```

**Full verbatim scaffold text** (`As4`, cli_inner_pretty.js:532705-532744). The template ends mid-sentence in the source itself — that is faithful, not a transcription cut. Note the path conventions differ from the per-turn `C04`: it uses a `{{MEMORY_ROOT}}` placeholder (substituted by the routine installer), flat `logs/YYYY/MM/YYYY-MM-DD.md` / `sessions/YYYY/MM/YYYY-MM-DD.md` daily files (vs `C04`'s `logs/YYYY/MM/DD/<id>-<title>.md`), and a `learnings/<learning-slug>.md` directory that `C04` has no concept of:

```text
---
name: dream
description: Nightly reflection and consolidation. Runs overnight (1–5am local) via the scheduled task scaffold.
context: fork
---

This is a housekeeping job — you should not need to message the user unless you find something noteworthy.

Your memory files are located in `{{MEMORY_ROOT}}`. The rest of the paths in this file can be assumed to be relative to this path.


**Phase 1: Preparation**
- Review recent memories in `logs/YYYY/MM/YYYY-MM-DD.md`
- Review session transcripts from the day in `sessions/YYYY/MM/YYYY-MM-DD.md`
- Review what topics and lessons already exist to ensure that you are improving existing topics if they are already covered, rather than creating duplicates.


**Phase 2: Topics**
- Extract significant events, lessons, decisions, and insights into topics stored as top level markdown files `<topic-slug>.md` in this directory.
- Make sure to resolve any contradictions


**Phase 3: Rules & Learnings**
- Review for anything that happened during the day that was painful or inefficient.
    - for example, not being able to build a project or get a test to run
- Review for anything that resulted in the user getting frustrated.
- Record the learnings from these experiences into `learnings/<learning-slug>.md`


**Phase 4: Prioritization and Pruning**
- We need to keep `MEMORY.md` under 200 lines. 
- These need to be *the most important* things for you to understand in the future.
- If something is getting too long, consider only mentioning the gist of it and referencing a separate file (like a topic file) with the full explanation.
- Consider if anything needs to be *removed* as it is becoming "stale" and no longer as important as it once was.
- Consider if anything should be *added* that has recently become more important. 

---

*Remember* - all of these memory files are *for you*. This is to help you situate and orient yourself in the future, after session context has been lost. Use these memories to allow for you to be the 
```

Its frontmatter declares `name: dream`, `context: fork`, and the description **"Nightly reflection and consolidation. Runs overnight (1–5am local) via the scheduled task scaffold."** It is a cron-driven routine, not invoked by the per-turn scheduler. Its prompt body has its own **4 phases** (different wording from `C04`):

1. **Phase 1: Preparation** — review recent memories in `logs/YYYY/MM/YYYY-MM-DD.md`, session transcripts in `sessions/YYYY/MM/YYYY-MM-DD.md`, and existing topics/lessons (to improve rather than duplicate).
2. **Phase 2: Topics** — extract significant events/lessons/decisions/insights into top-level `<topic-slug>.md` files; resolve contradictions.
3. **Phase 3: Rules & Learnings** — review for anything painful/inefficient or that frustrated the user; record into `learnings/<learning-slug>.md`. (This `learnings/` slug directory is **new** — the per-turn fork prompt `C04` has no such concept.)
4. **Phase 4: Prioritization and Pruning** — keep `MEMORY.md` under 200 lines; demote long entries to referenced files; remove stale, add newly-important.

It closes with the framing "*Remember* — all of these memory files are *for you* … to help you situate and orient yourself in the future."

The `/memory` toggle row renders **`· /dream to run`** (cli_inner_pretty.js:472994) as the manual escape hatch — but in 2.1.156 that points at this routine scaffold, not the removed `tengu_kairos_dream` skill.

### Delta summary table

| Aspect | v2.1.142 | v2.1.156 |
|--------|----------|----------|
| Per-turn auto-dream scheduler | `nr7`/`cr7`/`lr7` + `SL$` fork prompt | `U04`/`B04`/`p04` + `C04` fork prompt — **structurally identical** |
| Lock protocol | `.consolidate-lock`, 1h stale, mtime=lastConsolidatedAt | identical (`_Y4`/`zZ8`/`_Z8`) |
| Thresholds | 24h / 5 sessions, 10-min scan throttle | identical (`x04`/`og_`) |
| `/dream` slash command | a SKILL gated on `tengu_kairos_dream` (`z8A`/`K8A`), built prompt + cron-setup | **removed**; `tengu_kairos_dream` grep = 0 |
| `/dream` today | — | scheduled-task **routine scaffold** `As4` (`LOz="/dream"`), overnight 1–5am cron, own 4-phase prompt w/ `learnings/<slug>.md` |
| Dream fork prompt phases | Orient/Gather/Consolidate/Prune | same, plus team-guidance + reconcile-CLAUDE.md blocks |
| filesTouched tracker | Edit/Write only | Edit/Write **+ `rm`/`Remove-Item` `.md` parsing** |
| Completion telemetry | `tengu_auto_dream_completed` | same + `daily_logs_found`, `files_touched_count` |
| `tengu_auto_dream_failed` | minimal | `{phase, error_class}` |

---

## 9. All telemetry events

- `tengu_auto_dream_skipped {reason}` — `reason:"sessions" {session_count, min_required}` (cli_inner_pretty.js:448580) or `reason:"lock"` (cli_inner_pretty.js:448593).
- `tengu_auto_dream_fired {hours_since, sessions_since, team_memory_enabled}` (cli_inner_pretty.js:448599).
- `tengu_auto_dream_completed {cache_read, cache_created, output, sessions_reviewed, daily_logs_found, files_touched_count, team_memory_enabled}` (cli_inner_pretty.js:448654).
- `tengu_auto_dream_failed {phase, error_class}` — `phase` ∈ `{"fork","completion"}` (cli_inner_pretty.js:448671).
- `tengu_auto_dream_toggled {enabled, is_first_enable}` — from the `/memory` toggle (cli_inner_pretty.js:472916).
- Task-registry channel events: `task_dream` (finalize, cli_inner_pretty.js:399447), `task_dream`→`task_dream_failed` (rollback, cli_inner_pretty.js:399452).

---

## 10. Where it is wired in — the Stop-hook

```javascript
// ============================================
// Stop-hook auto-memory dispatch - extraction (gated) then auto-dream (gate inside)
// Location: cli_inner_pretty.js:450698-450699
// ============================================

// ORIGINAL (for source lookup):
if (!z.agentId && S88()) Ac_.executeExtractMemories(M, z.appendSystemMessage);
if (!z.agentId) U04(M, z.appendSystemMessage);

// READABLE (for understanding):
if (!hookCtx.agentId && isExtractModeActive()) memoryModule.executeExtractMemories(replCtx, hookCtx.appendSystemMessage);
if (!hookCtx.agentId) runAutoDreamCheck(replCtx, hookCtx.appendSystemMessage);   // all gates live inside B04

// Mapping: U04->runAutoDreamCheck, S88->isExtractModeActive, Ac_->memoryModule (re-export), M->replCtx
```

Both writers fire from the Stop-hook only for the **main agent** (`!agentId`). Extraction is gated up-front by `isExtractModeActive` (`S88`); auto-dream is called **unconditionally** because all of its gates live inside `B04` (the cheapest-first cascade in §3.1 makes the per-turn cost of a no-op essentially one flag read). Piggy-backing on the existing turn-end hook is why auto-dream needs **no scheduling infrastructure** — the user's natural typing cadence drives the check, and if Claude Code isn't running, nothing dreams.

---

## 11. `memory_20250818` is NOT Claude Code auto-memory

For completeness and to prevent a common misidentification: the strings `"memory_20250818"` (cli_inner_pretty.js:606987, 611708) and `client.beta.memory_stores.*` (cli_inner_pretty.js:594173) in the bundle are **documentation strings for the Anthropic Managed-Agents `memory` tool** — a separate, cloud-hosted product that Claude API customers use when building *their own* agents. They have **no call sites** in Claude Code; the CLI bundles the docs only so it can answer "how do I use Anthropic's memory store in my own agent?".

| | Claude Code auto-memory (this doc) | Anthropic Managed-Agents `memory_20250818` |
|--|------------------------------------|--------------------------------------------|
| Storage | local FS `~/.claude/projects/<slug>/memory/` | Anthropic-hosted memory stores |
| Trigger | auto via extraction + auto-dream; manual via `/memory`, `/dream`, `#` | always model-initiated tool calls |
| Code | implemented in `cli_inner_pretty.js` | docs strings only, no call sites |

Treat any `memory_20250818` grep hit as reference material, never as part of the auto-dream code path.

---

## Cross-references

- [extract_memories_runtime.md](./extract_memories_runtime.md) — the per-turn extraction writer; it shares `createAutoMemCanUseTool` (`cT8`) with this doc (that doc is the canonical home for the validator)
- [memdir_core.md](./memdir_core.md) — `buildDreamPromptTiny` (`VFK`), `ENTRYPOINT_NAME`/caps, `isAutoMemoryEnabled` (`M1`)
- [README.md](./README.md) — the three-writer / three-dream-surface overview and v2.1.142→156 delta
- [../../../claude_code_v_2.1.142/analyze/31_auto_memory/auto_dream_runtime.md](../../../claude_code_v_2.1.142/analyze/31_auto_memory/auto_dream_runtime.md) — the prior-version reference (where `/dream` was still the `tengu_kairos_dream` skill)
- [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Auto Memory symbol table
- 2.1.88 ground truth: `services/autoDream/{autoDream,config,consolidationLock,consolidationPrompt}.ts`, `tasks/DreamTask/DreamTask.ts`
```
