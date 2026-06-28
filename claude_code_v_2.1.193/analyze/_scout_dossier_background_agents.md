# Scout Dossier — Background Agents & Subagent Depth/Lifecycle (v2.1.183 → v2.1.193)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines, VERSION "2.1.193", build a1938d2a, 2026-06-25)
**Before-picture:** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines)
**88 ancestor tree:** `/lyz/codespace/3rd/claude-code/src`
**Module this extends:** `36_background_agents/` (already exists in the 183 tree)

> Method note: every obf symbol below was re-derived **by line** in the 193 bundle. 183 grep-counts are quoted to classify net-new vs carryover vs body-change. Obf names are re-mangled between builds — none are assumed to carry across versions.

---

## Verdict matrix

| # | Bullet | 193 anchor(s) | Obf symbol → readable | 183 diff | Class | Confidence |
|---|--------|---------------|------------------------|----------|-------|------------|
| 1 | mem-pressure reaping of idle bg shells | `454354`, `454357`, `43175` | `Mgl`→`registerBgShellPressureReaper` | `memoryPressure`/`PRESSURE_REAP` = **0** in 183 | **NET-NEW** | high |
| 2 | bg launch result drops "end your response" | `431256-431261` | agent tool `mapToolResultToToolResultBlockParam` | 183 `424285-424290` had the wording | **body-change** | high |
| 3 | spurious "N tasks would be abandoned" on `←←` | `689578`, `578073` | `oUo`→`countAbandonedBgTasks` | "would be abandoned"=**0** in 183 | net-new-in-window / refinement | high (mech) / med (attrib) |
| 4 | pinned bg agents re-prompted "Continue…" after auto-update | `371461`, `706889` | `WWn`→`getResumePrompt` | `WWn` is carryover; pinned-guard not isolable | refinement (not isolable) | low |
| 5 | phantom "general-purpose (resumed)" subagent on bg main turn | `688688`, `454100`, `441096` | adoption loop + `Lgl`→`registerCompletedResumedAgent` | `main-session` guard count 9→**10** | fix (partial isolation) | med |
| 6 | agent panel hides siblings / jumps a row | — | — | UI render only | UI-only / not isolable | low |
| 7 | bg agents resurrecting after stop → permanent | `431809`, `431817`, `441527` | `Mde`→`markStoppedByUser` + `CXp`→`persistStopMarker` | `stoppedByUser`=**0** in 183 | **NET-NEW** | high |
| 8 | claude-agents: builtin slash (`/usage`) not sent; image placeholder | — | — | UI composer only | UI-only / not isolable | low |
| 9 | bg jobs stuck "working" w/o structured output | `464549`, `464589`, `464561` | `Gaf`/`Exo`/`Waf` job-state finalizers | machinery carryover (`tempo:"active"`=18 in 183) | refinement (not cleanly isolable) | low-med |
| 10 | channel connections dropping after agents-view / `/bg /tui /update` | — | — | EventSource found = feature-gate SDK, unrelated | not isolable | low |
| 11 | **SUBAGENT DEPTH TRACKING** (resume-restore + fork-counts) | `441544`, `430478-430482`, `229871` | `K3`/`FBt`/depth-cap throw | resume `b?.spawnDepth` **added**; `subagent_depth_cap`=**0** in 183 | **NET-NEW + body-change** | high |
| 12 | leaked locked `.git/worktrees/` registrations auto-cleaned | `592167`, `592270` | `xre`→`removeAgentWorktree`, `k2o`→`cleanupStaleAgentWorktrees` | byte-identical to 183 (`qte`/`Yko`); prune count 4=4 | carryover, NOT a 193 delta | high (that it's carryover) |

---

## Bullet 1 — [NEW 2.1.193] Memory-pressure reaping of idle bg shell commands

### Anchors
- Env registration: `cli_inner_pretty.js:43175` — `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP: () => Ldu`
- Env parse: `cli_inner_pretty.js:43538` — `(Ldu = Fe.bool())` (bool getter, default falsy → reaper **ENABLED by default**)
- Reaper registration: `cli_inner_pretty.js:454354-454369` — `function Mgl(e,t,n,r,o,s)`
- Gate + `memoryPressure` listener: `cli_inner_pretty.js:454357` / `454363`
- Idle threshold const: `cli_inner_pretty.js:454610` — `eof = 1800000` (30 min)
- Caller: `cli_inner_pretty.js:454388` — `xPe` (`launchBackgroundLocalBash`), `let p = a !== "monitor" ? Mgl(u,r,l,s,a,i) : void 0;`

### Symbols (obf → readable gloss)
- `Mgl` → `registerBgShellPressureReaper(taskId, description, taskRegistry, toolUseId, kind, agentId)`
- `Ldu` → getter for `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP`
- `Tr` → `isRemoteMode()`
- `VI` (`cli_inner_pretty.js:2784`) → `getLastInteractionTime()` ⇒ `return Nt.lastInteractionTime`
- `eof` → `BG_SHELL_IDLE_REAP_MS = 1800000`
- `umr` (`cli_inner_pretty.js:3647`) → `isMainLoopBusy()` ⇒ `return Nt.mainLoopBusy ?? !1`
- `e8e` (`cli_inner_pretty.js:587048`) → `hasActiveAgentTasks(allTasks)`
- `R4f` (`cli_inner_pretty.js:587093`) → `ACTIVE_AGENT_TASK_TYPES = new Set(["local_agent","remote_agent","in_process_teammate","local_workflow"])`
- `o8t` (`cli_inner_pretty.js:454302`) → `notifyAndFinalizeShellTask(...,"killed",...)` (sets `notified:true`, emits notification)
- `BSe` (`cli_inner_pretty.js:382320`) → `killLocalShellTask(taskId, registry)` (calls `shellCommand?.kill()/cleanup()`, status→"killed")
- `Ie("task_local_shell_pressure_reap")` → success-telemetry event (the reap signal)

### How it works
```javascript
// ============================================
// registerBgShellPressureReaper - Auto-kill idle backgrounded shell under OS memory pressure
// Location: cli_inner_pretty.js:454354-454369
// ============================================

// ORIGINAL (for source lookup):
function Mgl(e, t, n, r, o, s) {
  g9e(s, `bash:${e}`, n);
  let i;
  if (s === void 0 && !Tr() && !Be.CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP) {
    let a = () => {
      let l = n.get(e);
      if (l?.status !== "running" || l.notified || Date.now() - VI() < eof || umr() || e8e(n.all())) return;
      (Ie("task_local_shell_pressure_reap"), o8t(e, t, "killed", void 0, n, r, o, s), BSe(e, n));
    };
    (process.on("memoryPressure", a), (i = () => process.off("memoryPressure", a)));
  }
  return () => { (i?.(), h9e(s, `bash:${e}`, n)); };
}

// READABLE (for understanding):
function registerBgShellPressureReaper(taskId, description, taskRegistry, toolUseId, kind, agentId) {
  registerKeepalive(agentId, `bash:${taskId}`, taskRegistry);
  let detach;
  // Only top-level (agentId===undefined) shells, not in remote mode, not disabled by env
  if (agentId === undefined && !isRemoteMode() && !env.CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP) {
    let onPressure = () => {
      let task = taskRegistry.get(taskId);
      if (task?.status !== "running"           // already done
        || task.notified                        // user already saw a result
        || Date.now() - getLastInteractionTime() < BG_SHELL_IDLE_REAP_MS  // <30 min since interaction
        || isMainLoopBusy()                      // we're mid-turn
        || hasActiveAgentTasks(taskRegistry.all()) // real agent work is in flight
      ) return;                                  // ...do NOT reap
      logEvent("task_local_shell_pressure_reap");
      notifyAndFinalizeShellTask(taskId, description, "killed", undefined, taskRegistry, toolUseId, kind, agentId);
      killLocalShellTask(taskId, taskRegistry);
    };
    process.on("memoryPressure", onPressure);
    detach = () => process.off("memoryPressure", onPressure);
  }
  return () => { detach?.(); deregisterKeepalive(agentId, `bash:${taskId}`, taskRegistry); };
}
// Mapping: Mgl→registerBgShellPressureReaper, VI→getLastInteractionTime, eof→BG_SHELL_IDLE_REAP_MS,
//          umr→isMainLoopBusy, e8e→hasActiveAgentTasks, o8t→notifyAndFinalizeShellTask, BSe→killLocalShellTask
```

**What "memory pressure" is:** the Node/Bun process-level `process.on("memoryPressure", …)` event (a real runtime signal emitted when the OS/V8 reports heap/RSS pressure). This event listener is **net-new in 193** — `grep -c "memoryPressure"` = **0** in 183, **1** in 193 (`454363`); likewise `task_local_shell_pressure_reap` = 0 in 183.

**What it reaps:** a single backgrounded *local bash* shell task (`type:"local_bash"`), only when **all** guards pass:
1. `agentId === undefined` — only **top-level** shells (a subagent's shells are never reaped here).
2. not in remote mode (`!Tr()`).
3. env `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP` not set.
4. the task is still `running`, not already `notified`.
5. **idle threshold:** `Date.now() - lastInteractionTime >= 1800000` (≥ **30 minutes** since last user interaction).
6. main loop not busy (`!isMainLoopBusy`).
7. **no active agent tasks** (`!hasActiveAgentTasks`) — i.e. no live subagents/remote agents/workflows that might depend on this shell.

When all hold, it emits `task_local_shell_pressure_reap`, marks the task killed/notified (`o8t`), and actually kills the OS process (`BSe`).

### Upgrade-behavior gotcha
`Ldu = Fe.bool()` defaults to false ⇒ **reaping is ON by default after upgrading to 2.1.193.** Long-idle (≥30 min) top-level background shells will be auto-killed the next time the runtime fires `memoryPressure`. Users who rely on detached long-runners surviving idle periods must set `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP=1`.

**Confidence: HIGH** — net-new event listener + net-new telemetry + dedicated disable env, all absent in 183.

---

## Bullet 2 — [2.1.193] BG launch result no longer says "end your response"

### Anchors
- 193 async (background) launch result: `cli_inner_pretty.js:431256-431261` inside the **agent (Task) tool** `mapToolResultToToolResultBlockParam` (object literal starting ~`431190`).
- 183 equivalent: `cli_inner_pretty.js:424283-424290`.

### Diff
**183 (`async_launched`):**
```
canReadOutputFile ? "Do not duplicate this agent's work … Work on non-overlapping tasks, or briefly tell the user what you launched and end your response.\noutput_file: …"
                  : "Briefly tell the user what you launched and end your response. Do not generate any other text — agent results will arrive in a subsequent message."
```
**193 (`async_launched`):**
```
canReadOutputFile ? "Do not duplicate this agent's work … output_file: … (guidance, no 'end your response')"
                  : "Briefly tell the user what you launched. Agent results will arrive in a subsequent message."
```

Both branches drop the **"…and end your response. Do not generate any other text…"** directive, so the model is no longer told to stop after launching a background subagent — it keeps working on other tasks. This is a **body-change** to a verbatim prompt string (the tool-result text that gets injected after a background launch).

### Adversarial note (false-delta guard)
The **Cloud / remote** launch result still says "end your response" in **both** versions:
- 193 `cli_inner_pretty.js:431248`: `…You will be notified automatically when it completes.\nBriefly tell the user what you launched and end your response.`
- 183 `cli_inner_pretty.js:424277` (identical).

So this change is **scoped to async/background (`async_launched`) launches only**, not cloud (`remote_launched`). Do not claim the cloud path changed — it did not.

### Side observation (different changelog line, noted for accuracy)
The `async_launched` agentId hint string also gained a `summary` arg in 193 (`Use SendMessage with to:'…' , summary:'<5-10 word recap>'`) vs 183 (`Use SendMessage with to:'…'`) at `431258` vs `424284`. That is the 2.1.191 SendMessage-summary work, not this bullet.

**Confidence: HIGH** — exact before/after strings located in both bundles.

---

## Bullet 3 — [2.1.193] Spurious "N background tasks would be abandoned" on `←←` when all carry over

### Anchors
- Confirm UI site: `cli_inner_pretty.js:689578` — `[`${Qo} background ${bn(Qo,"task")} would be abandoned`, "Press ←← again to confirm."]`, where `Qo = oUo(Ue.getState().tasks)` (`689568`).
- Skip-ahead variant: `cli_inner_pretty.js:690133` — `… ${Wr} background … would be abandoned by skipping ahead.`
- Abandoned-count fn: `cli_inner_pretty.js:578073` — `function oUo(e, t = fze(e)) { return y_t(e).count - H7t(e, t); }`
- Carry-over map: `cli_inner_pretty.js:578006` — `function fze(e)`
- Carry-over count: `cli_inner_pretty.js:578070` — `function H7t(e, t = fze(e))`
- Total count: `cli_inner_pretty.js:485964` — `function y_t(e)` (returns `{count, …}`)

### Symbols
- `oUo` → `countAbandonedBgTasks(tasks)` = `totalBgTasks − tasksThatCarryOver`
- `fze` → `computeCarryOverMap(tasks)` — builds `Map<taskId, carriesOver:boolean>` by walking the task tree from roots (`parentAgentId === void 0`); a subtree carries over **only if every node in it is adoptable** (predicate `o`: a backgrounded running agent with abortController, or a detachable backgrounded running shell, or a running workflow with scriptPath+workflowRunId).
- `H7t` → `countCarryOverTasks` = `On(tasks, isCarryOver) + On(remoteRoster(), isRemoteCarryOver)`
- `E7t`/`eEt`/`y2f`/`h2f`/`_2f` → per-type `isCarryOver` predicates
- `y_t` → `countBackgroundTasks` (`.count`)

### How the fix works
The abandoned count subtracts the carry-over set:
```javascript
function countAbandonedBgTasks(tasks, carryMap = computeCarryOverMap(tasks)) {
  return countBackgroundTasks(tasks).count - countCarryOverTasks(tasks, carryMap);
}
```
When **all** active tasks are adoptable (they will be carried over into the detached/background job rather than abandoned), `countCarryOverTasks === countBackgroundTasks` ⇒ `countAbandonedBgTasks === 0` ⇒ the `if (FI > 0 || (!confirmedInterstitial && Qo > 0))` guard at `689574` is false ⇒ no spurious "would be abandoned" warning and `←←` proceeds.

### 183 diff
- `grep "would be abandoned"` = **0** in 183, present in 193. `grep "Backgrounding cancelled"` = **1** in 183 (a single generic message; context at the container-restart path, not a per-task count). So the **granular, carry-over-aware** count UI ("N background task would be abandoned" / "N queued command would be lost", with `oUo` subtracting carry-over) is **net-new in the 183→193 window**. The specific "spurious cancel when all carry over" fix is the `- H7t(...)` subtraction inside `oUo`.

**Confidence: HIGH on the mechanism (it is present and isolable in 193), MED on attributing precisely to 2.1.193** vs an earlier point in the window — the whole feature evolved inside 185–193 and 183 is only the window's before-edge.

---

## Bullet 4 — [2.1.193] Pinned bg agents re-prompted "Continue from where you left off" after every auto-update

### Anchors
- Resume prompt: `cli_inner_pretty.js:371461` — `function WWn(){ return process.env.CLAUDE_CODE_RESUME_PROMPT || "Continue from where you left off."; }`
- Injection on interrupted-turn resume: `cli_inner_pretty.js:371503` — `let [g] = Kb([Pn({ content: WWn(), isMeta: !0 })]);` (only when `d.kind === "interrupted_turn"`)
- Injection on auto-resume of a deferred tool (print/headless path, runs after `/update`): `cli_inner_pretty.js:706889` — `w_({ mode:"prompt", agentId: us(), value: WWn(), uuid: …, isMeta:!0 })` guarded by `if (f) { T("[print.ts] Auto-resuming deferred tool: …"); … }`

### Symbols
- `WWn` → `getResumePrompt()` (env `CLAUDE_CODE_RESUME_PROMPT`, default "Continue from where you left off.")

### Assessment
`WWn` and both injection sites are **carryover** (the function exists unchanged; `getResumePrompt` is the long-standing resume-prompt). The bullet describes a *guard* fix: pinned background agents should not receive the resume prompt re-injected on each auto-update cycle. I could **not** isolate a clean `isPinned`/`pin`-keyed guard adjacent to the `WWn` injection in 193 vs 183 (the `pinned` symbol space is dominated by notification-pin and model-pin code, not bg-agent pin). This is most likely a small conditional change in the auto-update/resume orchestration that is not separable by a single net-new symbol.

**Confidence: LOW** — site located, but the actual fix is not isolable as a net-new 193 symbol; flagged honestly rather than inventing an anchor.

---

## Bullet 5 — [2.1.193] Backgrounding the main turn spawns a phantom "general-purpose (resumed)" subagent

### Anchors
- Job-adoption loop (re-registers persisted agents when a session attaches/resumes): `cli_inner_pretty.js:688684-688707`, key line `688699` — `(await QKl(ho), Lgl(ho, Ye), zt.add(ho.agentId), gn.push(ho));`, iterating `ft.agents` from `JKl(CLAUDE_JOB_DIR)` sorted by `spawnDepth`.
- Register-as-completed-resumed: `cli_inner_pretty.js:454100` — `function Lgl(e,t)` builds a `local_agent` with `status:"completed"`, `agentType: e.agentType ?? "general-purpose"`, `description: e.description ?? "(resumed agent)"`.
- main-session sentinel: `cli_inner_pretty.js:441096/441133/441143/441244` (`agentType:"main-session"`), filter at `453732/453735` (`Kl(n) && n.agentType !== "main-session"`) and inside `fze` at `578022`.

### Symbols
- `Lgl` → `registerCompletedResumedAgent(entry, registry)` — the source of the "general-purpose (resumed)" phantom card when `agentType`/`description` are missing.
- `JKl` (`577927`) → `readJobDir(dir)`
- `main-session` → the sentinel `agentType` marking the top-level (main) session so it is **excluded** from subagent treatment.

### 183 diff
- `grep -c "main-session"` = **9** in 183, **10** in 193 — exactly one additional `main-session` guard site was added in the window. The new/extra guard is consistent with the fix: when backgrounding the **main** turn, the main session must be recognized via `agentType:"main-session"` and **not** re-adopted/registered as a `general-purpose` subagent that re-runs the conversation.

### Assessment
The adoption machinery (`688684` loop + `Lgl`) is the locus where a mis-tagged main session would surface as "general-purpose (resumed)". The +1 `main-session` guard is the most plausible isolable patch. I could not byte-diff the exact added line against 183 (re-mangling), so this is corroborating rather than conclusive.

**Confidence: MED** — anchors and the 9→10 guard delta are solid; exact patched line not pinned.

---

## Bullet 6 — [2.1.193 / 2.1.191] Agent panel hides siblings when viewing a subagent; panel jumps a row past overflow cap

UI render fix in the agents-panel React component (custom per-subagent status line described at `cli_inner_pretty.js:56569`: "Custom per-subagent status line shown in the agent panel"). The sibling-visibility and overflow-row-jump behavior live in the panel's row-selection/visible-window computation. **Not isolable** to a single net-new symbol via grep on the pretty-printed bundle, and the change is presentational (which rows render), not a behavioral/data delta.

**Confidence: LOW (UI-only).** No fabricated anchor.

---

## Bullet 7 — [2.1.191] BG agents resurrecting after stop → stop from tasks panel now permanent

### Anchors
- Stop entry from tasks panel: `cli_inner_pretty.js:431809` — `function Mde(e,t){ t.update(e, r => r.stoppedByUser ? r : {...r, stoppedByUser:!0}); … CXp(e, agentType); }`
- Persist stop marker to disk: `cli_inner_pretty.js:431817-431826` — `async function CXp(e,t){ let n = await Hre(Ou(e)); if (n?.stoppedByUser) return; await Tde(Ou(e), {...(n ?? {agentType:t}), stoppedByUser:!0}); … }`
- Resume refuses a stopped agent unless explicitly forced: `cli_inner_pretty.js:441527-441539` — `if (b?.stoppedByUser) { if (!c) throw new Vht("Agent … was stopped by the user and won't be resumed…"); … clear marker only when force-resumed }`
- Second guard (live entry): `cli_inner_pretty.js:441645-441651`.
- Other-agent SendMessage guard: `cli_inner_pretty.js:442238-442242`.
- Persisted into disk state: `cli_inner_pretty.js:581883` — `...(t.stoppedByUser && { stoppedByUser:!0 })`.

### Symbols
- `Mde` → `markAgentStoppedByUser(agentId, registry)`
- `CXp` → `persistStopMarker(agentId, agentType)` (writes `stoppedByUser:true` via `Tde`/`writeAgentDiskState`)
- `Hre` → `readAgentDiskState(path)`; `Tde` → `writeAgentDiskState(path, state)`

### 183 diff
- `grep -c "stoppedByUser"` = **0** in 183, **8** in 193. The entire **persistent stop marker** mechanism is **net-new in the window** — a user stop now writes `stoppedByUser:true` to the agent's on-disk state, and every resume path (`resumeAgentBackground`, SendMessage continuation) checks it and **refuses to resurrect** the agent unless the user explicitly force-resumes. This is exactly "stop from tasks panel now permanent; bg agents no longer resurrect after stop."

**Confidence: HIGH** — clean net-new symbol set + behavior, zero presence in 183.

---

## Bullet 8 — [2.1.191] claude-agents: builtin slash (`/usage`) not sent as prompt; pasted-image placeholder

The `claude agents` table view composer should (a) intercept builtin slash commands (e.g. `/usage`) and execute them locally instead of shipping the literal text as the agent's prompt, and (b) show an `[Image]` placeholder for pasted images. The slash-vs-prompt distinction is governed generally by `skipSlashCommands` (`cli_inner_pretty.js:242203`: `typeof e.value==="string" && e.value.trim().startsWith("/") && !e.skipSlashCommands`) and image placeholders by the `[Image]` render (`cli_inner_pretty.js:270261`, an MCP-result renderer — not the composer). The composer-specific handling in the agents-view UI is not separable into a clean net-new 193 symbol via grep.

**Confidence: LOW (UI composer).** No fabricated anchor.

---

## Bullet 9 — [2.1.187] BG jobs stuck "working" when turn ends without structured output

### Anchors (bg-job state finalizers)
- `cli_inner_pretty.js:464549` — `async function Gaf()`: reads job state; `if (t.state === "working" && t.detail === Ist) Waf(e);` then resets `Cst` states to `running/idle`.
- `cli_inner_pretty.js:464589` — `async function Exo()`: if `state === "working" && tempo === "active"` ⇒ set `tempo:"blocked", needs: UG` (i.e. unstick a turn-end "working" job by flagging it needs the user).
- `cli_inner_pretty.js:464561` — `function Waf(e)`: arms `CLAUDE_BG_STARTUP_WEDGE_MS` (default 45000) timeout → `zaf` (startup-wedge detector).
- `Ist = "starting…"` (`193812`); `Cst = ["starting","resuming","adopted","crashed"]` (`193944`).

### 183 diff
- `CLAUDE_BG_STARTUP_WEDGE_MS` = 2 in **both**; `tempo:"active"`/`tempo === "active"` patterns abundant in 183 (18); `state === "working" && … detail ===` = 1 in **both**; `"StructuredOutput validation"` text = 2 in **both**. So the **bg-job state machine (working/active/blocked, startup-wedge, structured-output-attempt reasons) is largely carryover.** The 2.1.187 "stuck working w/o structured output" fix is a *subtle adjustment* inside this carryover finalizer logic (most plausibly the `Exo` turn-end "working+active → blocked" transition), which I could not isolate as a clean net-new symbol against 183.

**Confidence: LOW-MED** — correct locus identified (`Gaf`/`Exo`/`Waf`), but no clean net-new diff; honestly flagged as not isolable.

---

## Bullet 10 — [2.1.187] Channel connections dropping after agents-view nav + after `/bg /tui /update`

The "channel" here is the live status channel for `claude agents` / remote-agent updates. The agents-view toggle lives at `cli_inner_pretty.js:488186` (`id:"agentsView"`) / `493907` (`ue("AgentsView")`); `/tui` and `/bg` slash handling at `364077` / `529656`. I checked the obvious `EventSource` sites (`34408`, `34672`) — those are the **feature-gate/StatSig streaming SDK** (`/sub/<clientKey>`, `backgroundSync`), **unrelated** to the agents channel, and identical in 183 (`EventSource` count 4=4). The actual agents-channel teardown/reconnect on view navigation could not be isolated to a clean 193-specific patch.

**Confidence: LOW** — not isolable; explicitly not attributing to the feature-gate EventSource (that would be a false delta).

---

## Bullet 11 — [NEW-FIX 2.1.187] SUBAGENT DEPTH TRACKING (resume restores original depth; forks count toward cap)

This is the richest, cleanest delta in the theme. Two distinct mechanisms.

### (a) Resume restores original spawn depth — **body-change**
- 193 `cli_inner_pretty.js:441544` (inside `resumeAgentBackground`):
  ```
  H = (Kl(_) ? _.spawnDepth : b?.spawnDepth) ?? K3(i.agentContext) + 1
  ```
  where `_ = f.get(e)` (live registry entry) and `b = await Hre(Ou(e))` (persisted on-disk state).
- 183 `cli_inner_pretty.js:434085`:
  ```
  y = (od(g) ? g.spawnDepth : void 0) ?? Gz(o.agentContext) + 1
  ```

**Diff:** 183's else-branch was `void 0` — when resuming an agent with **no live registry entry** (e.g. after a restart), depth fell through to `agentContext.depth + 1`, i.e. it was **recomputed from the resumer's context and lost the original depth**. 193 inserts `b?.spawnDepth` — the **persisted disk spawnDepth is restored**, so a resumed subagent keeps the depth it was originally spawned at. The restored `H` flows into both the registry entry (`spawnDepth:H`, `441657`) and the new agentContext (`agentDepth:H`, `441674`).

### (b) Explicit spawn-time depth cap (forks counted) — **NET-NEW**
- 193 `cli_inner_pretty.js:430476-430484`:
  ```
  g = K3(c.agentContext);
  if (g >= FBt) throw (Re("subagent_launch","subagent_depth_cap"),
    new RPe(`Subagent nesting limit reached (depth ${g} of ${FBt}). Complete this task directly using your tools instead of spawning another agent.`));
  ```
- Limit const: `cli_inner_pretty.js:229871` — `FBt = 5` (carryover of 183 `v1i = 5` @ `221800`).
- Depth fn: `cli_inner_pretty.js:103808` — `function K3(e){ if (e.agentType==="main") return 0; return e.depth ?? 0; }` (183 `Gz` @ `103152`).
- Fresh-spawn child depth: `cli_inner_pretty.js:430685` — `X = K3(c.agentContext) + 1` (used for **all** spawns including forks: fork metadata `isFork: th(D)` is recorded at `430865` but the depth path is the same `+1`).

**Diff:** `grep "subagent_depth_cap"` / `"Subagent nesting limit reached"` = **0** in 183, present in 193. In 183, depth only gated *tool availability* (`_So`: `s < v1i` @ `371194`) — there was **no hard throw at spawn time**. 193 adds an explicit `g >= FBt` throw that every spawn path passes through, so **forked subagents (which go through the same `K3(...)+1` path) now count toward and are blocked by the depth cap** rather than slipping past an availability check.

### Carryover guard (false-delta check)
- `FBt = 5` is the same value as 183's `v1i = 5` — the **limit itself is carryover**, do not call the number "5" a 193 change.
- `K3` ≡ 183 `Gz` (main→0 else `depth`) — depth computation is carryover.

### 88 ancestor
This continues the 172/181 nested-subagent depth work; the 88 tree predates the persisted-spawnDepth/disk-resume model, so the resume-restore and on-disk depth are post-88 machinery.

**Confidence: HIGH** — both the added `b?.spawnDepth` restore (body-diffed against 183) and the net-new `subagent_depth_cap` throw (0 in 183) are nailed by line.

---

## Bullet 12 — [2.1.187] Leaked locked `.git/worktrees/` registrations from killed agents auto-cleaned

### Anchors
- `cli_inner_pretty.js:592167` — `async function xre(e,t,n,r,o="unknown")` → `removeAgentWorktree(path, branch, gitRoot, hookBased, source)`; runs `git worktree remove --force` (`592196`) and emits `tengu_worktree_removed`.
- `cli_inner_pretty.js:592258-592283` — `async function k2o(e)` → `cleanupStaleAgentWorktrees(threshold)`: scans `.claude/worktrees/`, for each dir older than `threshold` that is clean+merged (`QXl`), calls `xre(...,"stale_cleanup")`, then `git worktree prune` (`592275`).
- `cli_inner_pretty.js:592005` — `async function gor(e)`: Windows-only reparse-point/symlink unlink before removal.
- Export: `cli_inner_pretty.js:591386` (`cleanupWorktree`), `579619` in 183 (`cleanupStaleAgentWorktrees: () => Yko`).

### 183 diff — CARRYOVER, NOT a 193 delta
- `k2o`/`cleanupStaleAgentWorktrees` is **byte-identical** to 183's `Yko` (compare 193 `592258-592283` with 183 `580380-580407` — same scan → `qte(...,"stale_cleanup")` → `git worktree prune` shape).
- `xre` ≡ 183 `qte` (`580295-580340`): same `worktree remove --force` + `tengu_worktree_removed` + branch `-D`.
- `grep -c '"prune"'` = **4** in both; `stale_cleanup` source string present in both.

The stale-worktree sweep that prunes leaked `.git/worktrees/` registrations **already exists in 183** and is unchanged. The 2.1.187 "locked entries from killed agents" fix is therefore **not a net-new mechanism in the 183→193 window** at this layer — it is either a tiny refinement folded into this carryover code or a change at the agent-kill call-site that does not surface as a distinct net-new symbol. **Do not present the worktree-prune cleanup as a 193 delta.**

**Confidence: HIGH** that the worktree-prune cleanup is carryover; the specific locked-entry refinement is not isolable as net-new.

---

## Proposed module docs (extend `36_background_agents/`)

1. **`36_background_agents/bg_shell_pressure_reap.md`** (NEW) — bullet 1. The `process.on("memoryPressure")` reaper, the 7 guards, the 30-min idle threshold, default-on upgrade gotcha, and `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP`. Rich.
2. **`36_background_agents/backgrounding_carryover.md`** (NEW) — bullet 3 (`oUo`/`fze`/`H7t` carry-over-aware abandoned count) + bullet 2 (launch-result prompt change) + bullet 5 (phantom resumed adoption loop + `main-session` guard). Moderate-rich.
3. **`36_background_agents/agent_stop_lifecycle.md`** (NEW) — bullet 7 persistent `stoppedByUser` markers, resume refusal, force-resume clearing. Rich.
4. **Extend an existing subagent-depth doc** (or `36_background_agents/subagent_depth_tracking.md`) — bullet 11: resume-restore `b?.spawnDepth` + net-new `subagent_depth_cap` throw + `FBt`/`K3` carryover. Rich; this is the strongest standalone delta and continues 172/181 work.
5. **Overview-only note** — bullets 4/6/8/9/10/12: record as "UI/refinement or carryover, not isolable / not a 193 mechanism delta" so future scouts don't chase false deltas (esp. worktree-prune = carryover, feature-gate EventSource ≠ agents channel).

## Symbol-index additions (to `symbol_index_core_features.md`, Background Agents section)
- `Mgl` → `registerBgShellPressureReaper` (`cli_inner_pretty.js:454354`, function)
- `Ldu` → `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP` getter (`43175`, function)
- `eof` → `BG_SHELL_IDLE_REAP_MS` = 1800000 (`454610`, constant)
- `VI` → `getLastInteractionTime` (`2784`, function); `umr` → `isMainLoopBusy` (`3647`, function)
- `e8e` → `hasActiveAgentTasks` (`587048`, function); `R4f` → `ACTIVE_AGENT_TASK_TYPES` (`587093`, constant)
- `o8t` → `notifyAndFinalizeShellTask` (`454302`, function); `BSe` → `killLocalShellTask` (`382320`, function)
- `oUo` → `countAbandonedBgTasks` (`578073`, function); `fze` → `computeCarryOverMap` (`578006`, function); `H7t` → `countCarryOverTasks` (`578070`, function); `y_t` → `countBackgroundTasks` (`485964`, function)
- `WWn` → `getResumePrompt` (`371461`, function)
- `Mde` → `markAgentStoppedByUser` (`431809`, function); `CXp` → `persistStopMarker` (`431817`, function)
- `Lgl` → `registerCompletedResumedAgent` (`454100`, function); `wht` → `registerRunningLocalAgent` (`454060`, function); `zil` → `registerAsyncLocalAgent` (`454124`, function)
- `K3` → `getAgentDepth` (`103808`, function); `FBt` → `SUBAGENT_DEPTH_LIMIT` = 5 (`229871`, constant)
- `xre` → `removeAgentWorktree` (`592167`, function); `k2o` → `cleanupStaleAgentWorktrees` (`592258`, function)
- `Gaf` → `finalizeBgJobState` (`464549`, function); `Exo` → `blockBgJobIfStillWorking` (`464589`, function); `Waf` → `armBgStartupWedge` (`464561`, function)

## Depth assessment
**Theme depth = RICH** for the source-backed bullets (1, 2, 3, 7, 11) — real algorithms, net-new symbols, and clean 183 diffs. **THIN/UI-only** for 4, 6, 8, 9, 10, 12 (presentational, carryover, or non-isolable). Recommend concentrating new module docs on the pressure-reaper, persistent stop markers, and subagent depth tracking; treat the rest as overview-level notes with explicit "not a 193 mechanism delta / carryover" flags to prevent false-delta drift.
