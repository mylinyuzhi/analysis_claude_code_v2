# Dream and Auto-Dream — 2.1.220 current state

**Authoritative implementation:**
`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`, principally
`:332330-333344`, task registration at `:399405-399428`, settings UI at `:714407-714522`, and
background-task UI at `:729895-730211`.

**Cross-validation only:** the 2.1.193 bundle at `:431600-431730 (193)` and
`:462988-464020 (193)`, plus the readable tree supplied as 2.1.88 under
`src/services/autoDream/` and `src/tasks/DreamTask/`.

The 2.1.220 bundle uses “Dream” for an asynchronous **cross-session memory consolidation pass**. It is
not ordinary per-turn extraction: extraction reacts to the latest conversation, while Dream reviews
recent session logs/transcripts and existing memories to merge, prune, de-duplicate, and repair the
index.

---

## 1. Architecture and lifecycle

The current-state lifecycle is:

1. Startup calls `initAutoDream` (`Xld`, `:333176`) and installs a closure-scoped runner.
2. After a completed main-agent turn, `handleStopHooks` calls `executeAutoDream` (`Jld`, `:333336`).
3. Cheap capability checks run before disk work.
4. A lock-file mtime supplies `lastConsolidatedAt`; the runner applies a minimum-hours gate.
5. A ten-minute scan throttle bounds repeated transcript enumeration.
6. Session files touched after the last consolidation are counted, excluding the current session.
7. The lock is acquired by writing the current PID and verifying ownership.
8. A visible `dream` task is registered with an abort controller and the prior lock mtime.
9. A forked agent receives the four-phase consolidation prompt, constrained memory tools, recent
   session IDs, and an on-message progress watcher.
10. Success marks the task complete and surfaces changed memory paths; failure before completion marks
    it failed and rewinds the lock; user cancellation aborts and rewinds through `DreamTask.kill`.

The lock mtime is simultaneously a schedule checkpoint and a lease timestamp. This unifies “when did
Dream last run?” with “is another process probably running it?” without a database.

---

## 2. Availability, preference, and schedule gates

### Auto-Dream availability versus enablement

**What it does:** Separates server/build availability from the user's opt-in preference.

**How it works:**
1. Read the `tengu_onyx_plover` object.
2. Availability is true when either `enabled` or `available` is true.
3. If unavailable, Auto-Dream is false regardless of local settings.
4. If `autoDreamEnabled` is explicitly present, it wins.
5. Otherwise the server object's `enabled` value supplies the default.
6. The settings UI renders the Auto-Dream row only when auto-memory is on and availability was true at
   component initialization.

**Why this approach:**
- `available` lets the product expose a user toggle without enabling the feature by default.
- `enabled` supports server-side default rollout.
- The explicit setting preserves the user's choice across rollout changes.
- A single flag could not distinguish discoverability from default activation.

**Key insight:** `available: true, enabled: false` means “show the control, default off,” not “run
Dream.”

```javascript
// ============================================
// isAutoDreamEnabled - Resolves server availability and explicit user preference
// Location: cli_inner_pretty.js:332330-332342
// ============================================

// ORIGINAL (for source lookup):
function Ald() {
  return Ke("tengu_onyx_plover", null);
}
function Qks() {
  let e = Ald();
  return e?.enabled === !0 || e?.available === !0;
}
function Pwo() {
  if (!Qks()) return !1;
  let e = eo().autoDreamEnabled;
  if (e !== void 0) return e;
  return Ald()?.enabled === !0;
}

// READABLE (for understanding):
function getAutoDreamFeatureConfig() {
  return getFeatureValue("tengu_onyx_plover", null);
}
function isAutoDreamAvailable() {
  const config = getAutoDreamFeatureConfig();
  return config?.enabled === true || config?.available === true;
}
function isAutoDreamEnabled() {
  if (!isAutoDreamAvailable()) return false;
  const setting = getSettings().autoDreamEnabled;
  if (setting !== undefined) return setting;
  return getAutoDreamFeatureConfig()?.enabled === true;
}

// Mapping: Ald→getAutoDreamFeatureConfig, Qks→isAutoDreamAvailable,
//          Pwo→isAutoDreamEnabled, e→config/setting
```

### Ordered scheduling gates

**What it does:** Avoids expensive transcript scans and duplicate consolidations until enough time and
session activity have accumulated.

**How it works:**
1. Validate remote `minHours` and `minSessions` as finite positive numbers; fall back to 24 hours and 5
   sessions independently.
2. Reject Remote Control children, SDK entrypoints, disabled auto-memory, or disabled Auto-Dream.
3. Read the lock mtime; absent means `0`, so a first eligible run is immediately old enough.
4. Reject when elapsed hours are below `minHours`.
5. Reject when the last session scan was less than 600,000 ms ago.
6. List current-project transcripts whose mtime is newer than the lock mtime.
7. Remove the current session because its transcript is necessarily recent.
8. Reject below `minSessions` and emit a structured skip reason.
9. Acquire the cross-process lock; reject and emit `reason: lock` if another live recent holder wins.

**Why this approach:**
- Gates are ordered cheapest-first: cached booleans, one `stat`, an in-memory timestamp, then directory
  enumeration, then lock acquisition.
- Separate time and session thresholds prevent both over-frequent work and low-value consolidation
  after an idle period.
- The scan throttle matters when time passes but session count remains low; without it every completed
  turn would rescan the transcript directory.
- Session mtime measures activity, not creation; a recently continued session should be reviewed.

**Key insight:** The ten-minute throttle is a backoff for the **failed session-count gate**, not the
normal Dream cadence.

```javascript
// ============================================
// getAutoDreamScheduleConfig - Validates independent server thresholds
// Location: cli_inner_pretty.js:333156-333165
// ============================================

// ORIGINAL (for source lookup):
function sOy() {
  let e = Ke("tengu_onyx_plover", null);
  return {
    minHours:
      typeof e?.minHours === "number" && Number.isFinite(e.minHours) && e.minHours > 0 ? e.minHours : Vld.minHours,
    minSessions:
      typeof e?.minSessions === "number" && Number.isFinite(e.minSessions) && e.minSessions > 0
        ? e.minSessions
        : Vld.minSessions,
  };
}

// READABLE (for understanding):
function getAutoDreamScheduleConfig() {
  const raw = getFeatureValue("tengu_onyx_plover", null);
  return {
    minHours: isFinitePositive(raw?.minHours) ? raw.minHours : AUTO_DREAM_DEFAULTS.minHours,
    minSessions: isFinitePositive(raw?.minSessions) ? raw.minSessions : AUTO_DREAM_DEFAULTS.minSessions,
  };
}

// Mapping: sOy→getAutoDreamScheduleConfig, e→raw, Vld→AUTO_DREAM_DEFAULTS
```

The two fields are validated separately. A malformed `minHours` does not discard a valid
`minSessions`, which is important for remotely configured gradual tuning.

---

## 3. The consolidation lock

### PID-plus-mtime lock acquisition

**What it does:** Provides cross-process exclusion, a last-success timestamp, stale-lock recovery, and
a rollback checkpoint using one file: `.consolidate-lock`.

**How it works:**
1. Read `stat` and file content concurrently when the file exists.
2. Interpret mtime as the last checkpoint and content as the holder PID.
3. If the mtime is younger than one hour and the PID is live, reject acquisition.
4. A dead PID, malformed body, absent file, or lock older than one hour is reclaimable.
5. Ensure the memory root exists and write the current PID.
6. Re-read the file. If another contender overwrote it, return `null`.
7. On success, return the **prior** mtime, or `0` when no lock existed.

**Why this approach:**
- The re-read converts a racy last-writer-wins file update into a detectable loser path without native
  advisory locks.
- PID liveness handles crashed processes; the one-hour age guard limits PID-reuse false positives.
- Returning the previous mtime makes failure/cancellation rollback possible.
- An atomic exclusive-create lock would simplify ownership, but would need a second durable timestamp
  or more elaborate stale-file replacement.

**Key insight:** Writing the PID is only a claim; ownership is established by reading it back.

```javascript
// ============================================
// tryAcquireConsolidationLockAt - Claims the lock and verifies last-writer ownership
// Location: cli_inner_pretty.js:333049-333071
// ============================================

// ORIGINAL (for source lookup):
async function tOy(e) {
  let t = nHs(e),
    r,
    n;
  try {
    let [i, s] = await Promise.all([ste.stat(t), ste.readFile(t, "utf8")]);
    r = i.mtimeMs;
    let a = parseInt(s.trim(), 10);
    n = Number.isFinite(a) ? a : void 0;
  } catch {}
  if (r !== void 0 && Date.now() - r < eOy) {
    if (n !== void 0 && HT(n))
      return (w(`[autoDream] lock held by live PID ${n} (mtime ${Math.round((Date.now() - r) / 1000)}s ago)`), null);
  }
  (await ste.mkdir(e, { recursive: !0 }), await ste.writeFile(t, String(process.pid)));
  let o;
  try {
    o = await ste.readFile(t, "utf8");
  } catch {
    return null;
  }
  if (parseInt(o.trim(), 10) !== process.pid) return null;
  return r ?? 0;
}

// READABLE (for understanding):
async function tryAcquireConsolidationLockAt(memoryRoot) {
  const path = getConsolidationLockPath(memoryRoot);
  let priorMtime;
  let holderPid;
  try {
    const [stat, body] = await Promise.all([fs.stat(path), fs.readFile(path, "utf8")]);
    priorMtime = stat.mtimeMs;
    const parsedPid = parseInt(body.trim(), 10);
    holderPid = Number.isFinite(parsedPid) ? parsedPid : undefined;
  } catch {}
  if (priorMtime !== undefined && Date.now() - priorMtime < DREAM_LOCK_STALE_MS) {
    if (holderPid !== undefined && isProcessRunning(holderPid)) return null;
  }
  await fs.mkdir(memoryRoot, { recursive: true });
  await fs.writeFile(path, String(process.pid));
  let verifiedBody;
  try { verifiedBody = await fs.readFile(path, "utf8"); } catch { return null; }
  if (parseInt(verifiedBody.trim(), 10) !== process.pid) return null;
  return priorMtime ?? 0;
}

// Mapping: tOy→tryAcquireConsolidationLockAt, e→memoryRoot, t→path,
//          r→priorMtime, n→holderPid, o→verifiedBody, eOy→DREAM_LOCK_STALE_MS
```

### Rollback semantics

**What it does:** Makes a failed or cancelled Dream eligible to retry without erasing a genuine prior
success checkpoint.

**How it works:**
1. If prior mtime is `0`, unlink the lock to restore the no-file state.
2. Otherwise clear the PID body.
3. Restore both atime and mtime to the saved value.
4. Swallow rollback errors after logging; a failed rollback merely delays the next trigger.

**Why this approach:**
- Leaving the new mtime after failure would falsely record a successful consolidation and defer retry
  for `minHours`.
- Clearing the PID prevents the still-live current process from looking like an active holder.
- Preserving the earlier mtime retains the last successful scheduling point.

**Key insight:** The lock is committed optimistically at acquisition and compensated on failure.

---

## 4. Consolidation prompt and fork

### Four-phase consolidation algorithm

**What it does:** Guides a forked agent from inventory through signal gathering, merge/update work, and
index repair.

**How it works:**
1. **Orient:** inspect the memory root, `MEMORY.md`, topic files, daily logs, and optional session
   directories.
2. **Gather:** prioritize recent session logs, then drifted memories, then narrow transcript grep.
3. **Consolidate:** merge into existing topics, normalize relative dates, and delete contradicted facts.
4. **Prune and index:** keep `MEMORY.md` below 200 lines and ~25 KB, shorten verbose entries, add useful
   pointers, and remove stale ones.
5. Reconcile memory guidance against CLAUDE.md without editing CLAUDE.md during Dream.
6. When team memory is active, inspect it, de-duplicate against it, and prune conservatively.
7. Append recent session IDs and the restricted-tool contract only for the background run.

**Why this approach:**
- The sequence reduces duplicate creation: inventory precedes synthesis.
- Logs are higher-signal and cheaper than exhaustive JSONL transcript reading.
- Explicit prune/index phases compensate for the append bias of per-turn extraction.
- CLAUDE.md is treated as the maintained checked-in authority, while newer explicit contradictions are
  surfaced rather than silently rewriting project instructions.
- Team memory uses conservative deletion because another user's dependence is not visible locally.

**Key insight:** Dream is maintenance of a memory graph and its index, not bulk summarization of all
transcripts.

### Fork execution and phase-aware failure

**What it does:** Runs consolidation as a cache-sharing background agent and distinguishes launch
failure from post-completion bookkeeping failure.

**How it works:**
1. Register the task before launching so UI and cancellation can see it.
2. Launch with `querySource/forkLabel: auto_dream`, `skipTranscript`, shared cache-safe parameters,
   restricted tools, abort controller, and a progress callback.
3. Set a local phase variable to `fork`; change it to `completion` immediately before marking the task
   complete.
4. On success, append an “Improved” memory message and a pending memory-update record when files were
   touched.
5. If aborted, return because the kill path already changed task state and rolled back.
6. For a failure in phase `fork`, fail the task and roll back the lock.
7. For a failure in phase `completion`, emit failure telemetry but do not undo a fork that already
   completed and committed changes.

**Why this approach:**
- Rolling back after successful file changes would cause an immediate duplicate Dream.
- The phase variable is a compact transaction boundary: before it, no successful consolidation is
  assumed; after it, memory changes may already be durable.
- User cancellation owns its own compensation to avoid double rollback.

**Key insight:** The lock rollback decision is based on **failure phase**, not merely whether an
exception occurred.

---

## 5. Task state, progress, and cancellation

### Dream progress projection

**What it does:** Projects an otherwise invisible fork into a bounded UI task record.

**How it works:**
1. Register type `dream`, status `running`, phase `starting`, reviewed-session count, abort controller,
   and prior mtime.
2. For every assistant message, concatenate text and count all tool uses.
3. Collect Edit/Write paths and Markdown paths parsed from recognized deletion shell commands.
4. Revalidate every path against the exact memory root.
5. Deduplicate paths across the task.
6. Flip phase to `updating` on the first newly touched path.
7. Retain only the 30 most recent turns.
8. Skip state updates for a completely empty/no-op turn.

**Why this approach:**
- The UI needs useful progress without storing the fork prompt or full tool payloads.
- A fixed 30-turn ring bounds state and rendering cost.
- Path revalidation prevents a model-authored tool payload from becoming trusted UI/accounting data.
- Phase detection is intentionally coarse; parsing the prompt's four conceptual phases from prose
  would be brittle.

**Key insight:** `filesTouched` is an observed lower bound, not a filesystem audit; it includes
recognized tool paths and safe delete paths, not arbitrary side effects.

```javascript
// ============================================
// makeDreamProgressWatcher - Converts assistant blocks into bounded task progress
// Location: cli_inner_pretty.js:333300-333325
// ============================================

// ORIGINAL (for source lookup):
function cOy(e, t, r) {
  return (n) => {
    if (n.type !== "assistant") return;
    let o = "",
      i = 0,
      s = [];
    for (let a of n.message.content)
      if (a.type === "text") o += a.text;
      else if (a.type === "tool_use") {
        if ((i++, a.name === fl || a.name === nu)) {
          let l = a.input;
          if (typeof l.file_path === "string") s.push(l.file_path);
        } else if ($Z.includes(a.name)) {
          let l = a.input;
          if (typeof l.command === "string" && iOy.test(l.command))
            for (let c of l.command.matchAll(/"[^"]*\.md"|'[^']*\.md'|(?:\/|[A-Za-z]:[\\/])\S*\.md\b/g))
              s.push(c[0].replace(/^["']|["']$/g, ""));
        }
      }
    jld(
      e,
      { text: o.trim(), toolUseCount: i },
      s.filter((a) => W1t(a, r)),
      t,
    );
  };
}

// READABLE (for understanding):
function makeDreamProgressWatcher(taskId, taskRegistry, memoryRoot) {
  return message => {
    if (message.type !== "assistant") return;
    let text = "";
    let toolUseCount = 0;
    const candidatePaths = [];
    for (const block of message.message.content) {
      if (block.type === "text") text += block.text;
      else if (block.type === "tool_use") {
        toolUseCount++;
        collectEditWriteOrDeleteMarkdownPaths(block, candidatePaths);
      }
    }
    addDreamTurn(
      taskId,
      { text: text.trim(), toolUseCount },
      candidatePaths.filter(path => isAllowedAutoMemWritePath(path, memoryRoot)),
      taskRegistry,
    );
  };
}

// Mapping: cOy→makeDreamProgressWatcher, e→taskId, t→taskRegistry,
//          r→memoryRoot, n→message, o→text, i→toolUseCount, s→candidatePaths, jld→addDreamTurn
```

### Cancellation compensation

**What it does:** Stops a running Dream and restores the pre-acquisition schedule checkpoint.

**How it works:**
1. Update only a task still in `running` state.
2. Abort its controller.
3. Capture `priorMtime` before clearing the controller from state.
4. Mark status `killed`, set end time, and mark notified.
5. Emit the stopped task event.
6. Roll back the lock only when the state transition actually captured a prior mtime.

**Why this approach:**
- The running-state guard makes repeated kill calls idempotent.
- Capturing prior mtime inside the registry update couples compensation to a successful state
  transition.
- Marking `notified` allows terminal task eviction; Dream's user-facing summary is separate.

**Key insight:** Cancellation is a transaction abort: model execution and schedule checkpoint are
reverted together.

```javascript
// ============================================
// DreamTask.kill - Aborts Dream and rolls its lock checkpoint back
// Location: cli_inner_pretty.js:399409-399427
// ============================================

// ORIGINAL (for source lookup):
Vko = {
  name: "DreamTask",
  type: "dream",
  async kill(e, t) {
    let r;
    if (
      (t.update(e, (n) => {
        if (n.status !== "running") return n;
        return (
          n.abortController?.abort(),
          (r = n.priorMtime),
          { ...n, status: "killed", endTime: Date.now(), notified: !0, abortController: void 0 }
        );
      }),
      r !== void 0)
    )
      (Vp(e, "stopped", { skipTranscript: !0 }), await Gwo(r));
  },
};

// READABLE (for understanding):
DreamTask = {
  name: "DreamTask",
  type: "dream",
  async kill(taskId, taskRegistry) {
    let priorMtime;
    taskRegistry.update(taskId, task => {
      if (task.status !== "running") return task;
      task.abortController?.abort();
      priorMtime = task.priorMtime;
      return { ...task, status: "killed", endTime: Date.now(), notified: true, abortController: undefined };
    });
    if (priorMtime !== undefined) {
      emitTaskStopped(taskId, { skipTranscript: true });
      await rollbackConsolidationLock(priorMtime);
    }
  },
};

// Mapping: Vko→DreamTask, e→taskId, t→taskRegistry, r→priorMtime,
//          Vp→emitTaskStopped, Gwo→rollbackConsolidationLock
```

---

## 6. UI and observability

The settings surface at `:714407-714522`:

- derives current enablement from `Pwo`;
- shows “running,” “never,” or the lock mtime as “last ran …”;
- disables the row while auto-memory is off;
- persists `autoDreamEnabled` in user settings;
- emits `tengu_auto_dream_toggled` including `is_first_enable`.

The background-task dialog at `:729895-730211`:

- includes `dream` tasks in selection ordering;
- opens a dedicated detail dialog;
- routes `x` to `DreamTask.kill` only while running;
- exposes Dream alongside shell, agent, workflow, MCP, and scan tasks without classifying it as an
  agent count in the header.

Telemetry distinguishes:

- skipped for insufficient sessions or lock ownership;
- fired with hours, session count, and team-memory state;
- completed with cache usage, output, reviewed sessions, daily logs, touched files, and team state;
- failed with `phase` and sanitized error class;
- task completion/failure counters and stopped/completed task events.

This separation lets operators distinguish “not enough work,” “another process owns it,” “fork could
not run,” and “post-fork completion bookkeeping failed.”

---

## 7. Three-way cross-validation

### 2.1.220 versus 2.1.193

The core scheduler, mtime/PID lock, task ring, session threshold, fork, pending update, telemetry, and
kill rollback already exist in 2.1.193. The 193 counterparts are structurally equivalent around
`:431600-431730 (193)` and `:462988-464020 (193)`.

Confirmed 2.1.220 differences include:

- Auto-Dream explicitly rejects SDK entrypoints in `aOy` (`:333169`).
- The fork passes its exact memory root to the progress watcher and path validator.
- POSIX memory deletion is restricted to force-only options.
- The prompt can omit legacy type conventions under the compact memory-prompt variant.
- Team-memory enablement includes discovered mounts, not only the earlier single predicate.
- The prompt/tool contract names protected subdirectories and the stricter delete rule.

Most scheduling behavior is therefore **carryover**, while the security and prompt-selection edges are
the meaningful 220 refinements.

### 2.1.220 versus the readable 2.1.88 reference

The readable `autoDream.ts`, `consolidationLock.ts`, `consolidationPrompt.ts`, and `DreamTask.ts`
strongly validate the recovered semantic names and design rationale:

- cheapest-first gate ordering;
- closure-scoped scan throttle;
- lock mtime as last-consolidated timestamp;
- PID verification and prior-mtime rollback;
- exclusion of the current session;
- four-phase prompt;
- bounded task turns and cancellation compensation.

The readable tree is nevertheless an ancestor/reference, not a substitute. It lacks several 220
details: mounted team-memory detection, force-only deletes, root-parameterized watcher validation,
compact prompt variants, pending-memory-update plumbing, and the exact 220 telemetry payloads.

The readable `consolidationLock.ts` also exposes `recordConsolidation` for manual `/dream`. No matching
function or call site exists in the 2.1.220 bundle's `.consolidate-lock` region: `nHs`, `jwo`, `Fld`,
`tOy`, `Gwo`, `rOy`, and `Bld` are the complete target references. Therefore this report does **not**
attribute manual checkpoint stamping to 2.1.220.

### Confidence

**HIGH** for Auto-Dream scheduling, lock ownership, fork lifecycle, task projection, cancellation, and
UI wiring: the complete 220 bodies and their 193 twins were inspected.

**HIGH** for the negative manual-checkpoint statement within this bundle: the unique lock filename and
all lock helper call sites were exhaustively searched.

**MEDIUM-HIGH** for the readable-source ancestry statement because the readable tree is explicitly a
cross-check and differs at several important branches.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_auto_memory.md](../00_overview/symbol_additions_v2_1_220_auto_memory.md).

Key functions in this document:
- `getAutoDreamFeatureConfig` (`Ald`, `:332330`) - reads `tengu_onyx_plover`
- `isAutoDreamAvailable` (`Qks`, `:332333`) - separates availability from activation
- `isAutoDreamEnabled` (`Pwo`, `:332337`) - explicit-setting/default resolver
- `buildConsolidationPrompt` (`Pld`, `:332757`) - four-phase Dream prompt
- `readLastConsolidatedAt` (`jwo`, `:333039`) - lock-mtime checkpoint read
- `tryAcquireConsolidationLockAt` (`tOy`, `:333049`) - PID claim, stale recovery, and ownership verification
- `rollbackConsolidationLockAt` (`rOy`, `:333076`) - prior-state compensation
- `listSessionsTouchedSince` (`Bld`, `:333090`) - active-session census
- `registerDreamTask` (`Uld`, `:333111`) - visible cancellable task creation
- `addDreamTurn` (`jld`, `:333127`) - bounded progress and touched-path accumulator
- `getAutoDreamScheduleConfig` (`sOy`, `:333156`) - validated remote thresholds
- `isAutoDreamGateOpen` (`aOy`, `:333167`) - runtime capability gate
- `initAutoDream` (`Xld`, `:333176`) - scheduler and fork lifecycle
- `makeDreamProgressWatcher` (`cOy`, `:333300`) - assistant-block task projection
- `executeAutoDream` (`Jld`, `:333336`) - stop-hook entry point
- `DreamTask` (`Vko`, `:399409`) - cancellation and lock rollback
