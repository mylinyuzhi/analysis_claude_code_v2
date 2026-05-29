# Auto Memory — Dreaming (`/dream` + Auto-Dream Background Scheduler)

## What it does

**Dreaming is the *second* auto-memory writer in v2.1.142.** Where extraction ([extract_memories_runtime.md](./extract_memories_runtime.md)) writes a memory **per turn** from the conversation that just happened, dreaming runs **periodically across sessions** and *reorganizes* — it reads existing memory files, looks at session logs over the last N hours/days, and consolidates: merging near-duplicates, pruning stale facts, demoting verbose index entries, and converting relative dates ("yesterday") to absolute dates ("2026-05-26"). It is the explicit "reflective pass" that keeps the memory directory tidy.

Two invocation paths:

| Path | Trigger | Frequency | Doc location |
|------|---------|-----------|--------------|
| `/dream` slash command | User typing `/dream` or `/learn` | On demand | This doc § 1 |
| Auto-dream scheduler (`nr7` / `cr7`) | Fire-and-forget from `Co7` after every assistant turn | Throttled by hours-since-last + sessions-since-last + lock | This doc § 2 |

Both paths use the same forked-agent harness and the same dream prompt builder (`SL$` for non-tiny, `SVK` for tiny memory). The only difference is *who decided* to fire it (user vs scheduler) and *what additional context* is passed (the auto path injects "Sessions since last consolidation" inline).

This subsystem is **largely new in v2.1.142** — v2.1.88 has nothing analogous (no dream prompt, no auto-dream scheduler, no `/dream` command).

### ⚠️ Both `/dream` and auto-dream are GATED ROLLOUTS — default OFF

Most users in v2.1.142 will NOT see `/dream` in their slash command list AND will not have auto-dream firing in the background. Both surfaces are behind Growthbook feature flags that default to disabled:

| Surface | Gate function | Feature flag(s) | Default |
|---------|---------------|-----------------|---------|
| `/dream` slash command | `K8A` (cli_inner_pretty.js:588247-588249) | `tengu_kairos_dream` | **false** |
| Auto-dream background scheduler | `k$5` → `hL$` → `OO8` (cli_inner_pretty.js:389500-389504, 388970-388976, 388965-388969) | `tengu_onyx_plover.{enabled, available}` OR `tengu_herring_clock` + team-memory-server has content | **null** (disabled) |

The user CAN explicitly turn the auto-dream toggle on via `/memory` (which writes `autoMemoryEnabled.autoDreamEnabled` to user settings), but the underlying `OO8()` precondition still requires one of the Growthbook flags. So even with the toggle on, the feature is inert without server-side opt-in.

The `/dream` command's `K8A` gate has THREE conditions, ALL of which must pass:

```javascript
function K8A() {
  return !CN() && x9() && xT("tengu_kairos_dream", false, q8A);
}
```

1. `!CN()` — `kairosActive === false`. CN/`kairosActive` is a different memory-subsystem mode; when active, `/dream` is hidden because that mode owns memory operations.
2. `x9()` — auto-memory must be enabled (the master gate, same one extraction uses).
3. `xT("tengu_kairos_dream", false, q8A)` — feature flag, default `false`. `xT(name, default, ttl)` is a thin wrapper over `Z$(name, default)` (the standard Growthbook reader); the third arg `q8A = 300000` appears to be a cache-TTL hint not honored by the current `xT` implementation.

The auto-dream scheduler's `hL$()` gate has a more elaborate fallback chain:

```javascript
function hL$() {
  if (!OO8()) return false;                          // server-side opt-in required
  const explicit = m6().autoDreamEnabled;            // user setting (from /memory toggle)
  if (explicit !== undefined) return explicit;       // honor explicit setting
  if (yr7()?.enabled === true) return true;          // tengu_onyx_plover.enabled = true
  return ii$();                                       // team-memory-server has content + tengu_herring_clock
}

function OO8() {
  const cfg = yr7();                                  // = Z$("tengu_onyx_plover", null)
  if (cfg?.enabled === true || cfg?.available === true) return true;
  return ii$();
}
```

Reading top to bottom:

- `OO8()` is the **precondition** — either the `tengu_onyx_plover` Growthbook config has `enabled: true` or `available: true`, OR the team-memory-server is active with the experimental `tengu_herring_clock` flag.
- If `OO8()` passes, the user's explicit `autoDreamEnabled` setting takes precedence (set via `/memory`'s "Auto-dream: on/off" toggle row).
- If the user hasn't explicitly toggled, fall back to `tengu_onyx_plover.enabled === true` for opt-in cohorts.
- Otherwise fall back to the team-memory-server precondition.

**Net effect on a default user**: `/dream` hidden, auto-dream silent. The user has to be in a Growthbook cohort that opts them in, OR they need to be on a team using the team-memory server.

### How to tell if YOUR session has dream enabled

For `/dream`: type `/` and look for it in the command list. If it doesn't appear, `K8A` returned false (most likely `tengu_kairos_dream` is off for your cohort).

For auto-dream: open `/memory` — if you see an "Auto-dream: on/off" toggle row, `OO8()` returned true and you can toggle. If you don't see the row, `OO8()` is false and auto-dream is unavailable for your model/cohort regardless of any setting.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│ Path 1: User invokes /dream                                      │
│                                                                  │
│  /dream [nightly|schedule|overnight]                             │
│        │                                                         │
│        v                                                         │
│  z8A() registers a skill (588290) → getPromptForCommand returns: │
│   - "schedule" mode: A8A(...) prompt (sets up cron via ScheduleC)│
│   - "consolidate" mode: SL$(memoryDir, sessionDir, extraCtx,     │
│                              teamMemEnabled) — the dream prompt  │
│        │                                                         │
│        v                                                         │
│  Model receives the prompt, runs as the MAIN agent (not forked); │
│  uses normal tools to read/edit/delete memory files              │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ Path 2: Auto-dream scheduler                                      │
│                                                                  │
│  Co7 (Stop-hook orchestrator), line 391667:                      │
│     if (!agentId) nr7(M, A.appendSystemMessage)                  │
│        │ fire-and-forget                                         │
│        v                                                         │
│  nr7 → cr7 → k$5() gate:                                         │
│     - !CN() (not in CCR-disabled context)                        │
│     - !I6() (not remote workspace)                               │
│     - x9() (auto-memory enabled)                                 │
│     - hL$() (auto-dream feature enabled)                         │
│        │                                                         │
│        v                                                         │
│  Read lastConsolidatedAt mtime via sf8()                         │
│  Compute hoursSinceLast                                          │
│  Skip if hoursSinceLast < tengu_onyx_plover.minHours             │
│  Skip if (Date.now() - lastScanTime) < 10 minutes (V$5)          │
│  Update lastScanTime                                             │
│        │                                                         │
│        v                                                         │
│  Jd7(lastMtime) → list session UUIDs touched since               │
│  Filter out current session ID                                   │
│  Skip if count < tengu_onyx_plover.minSessions                   │
│        │                                                         │
│        v                                                         │
│  jd7() → acquire filesystem lock (atomic mtime check)            │
│  Skip if lock unavailable (another auto-dream is running)        │
│        │                                                         │
│        v                                                         │
│  emit tengu_auto_dream_fired                                     │
│  Build extra context: "Sessions since last consolidation: [...]" │
│        │                                                         │
│        v                                                         │
│  JV() (runForkedAgent):                                          │
│    - canUseTool: DO8(memoryDir) — SAME allow-list as extraction │
│    - forkLabel: "auto_dream"                                     │
│    - skipTranscript: true                                        │
│    - prompt: SL$ (or SVK in tiny mode)                           │
│    - onMessage: E$5(...) — track files-touched in taskRegistry   │
│        │                                                         │
│        v                                                         │
│  On completion:                                                  │
│    - If files were touched:                                      │
│       * appendSystemMessage(memorySavedMessage with verb="Improved")│
│       * setAppState(pendingMemoryUpdates ← {source:"dream",...}) │
│    - Emit tengu_auto_dream_completed (with cache stats)          │
└──────────────────────────────────────────────────────────────────┘
                         │
                         v
┌──────────────────────────────────────────────────────────────────┐
│ Next turn's system-prompt assembly:                              │
│    Eq5(toolUseContext) drains pendingMemoryUpdates →             │
│    [{type:"memory_update", source, summary, paths, inContextPaths}]│
│         │                                                        │
│         v                                                        │
│    "memory_update" attachment renderer at 425292:                │
│    Builds isMeta user message:                                   │
│    "Background memory consolidation updated your memory          │
│     directory: consolidated 3 memory files                       │
│     Files changed: user.md, feedback_testing.md, MEMORY.md       │
│     [optionally] Your loaded copy of X is now stale ...          │
│     This is ambient context — do not narrate it ..."             │
│         │                                                        │
│         v                                                        │
│    Model sees this on its next turn and knows the memory         │
│    directory just changed (without seeing the dream's            │
│    own internal chatter)                                         │
└──────────────────────────────────────────────────────────────────┘
```

---

## How it works

### 1. The `/dream` slash command — `z8A()` at 588290

```javascript
// ============================================
// /dream command definition
// Location: cli_inner_pretty.js:588290-588339
// ============================================

// ORIGINAL (for source lookup, condensed):
function z8A() {
  uf({
    name: "dream",
    aliases: ["learn"],
    description: "Reflective memory consolidation — review recent activity, synthesize learnings into typed memory files, and prune stale entries.",
    whenToUse: 'When the user wants Claude to reflect on and consolidate its memories, organize topic files, prune stale entries, or schedule nightly consolidation. Trigger phrases: "dream", "learn", "dream nightly", "consolidate memories", "learn from your experiences", "organize your memories".',
    argumentHint: "[nightly]",
    userInvocable: !0,
    context: "fork",
    isEnabled: K8A,
    async getPromptForCommand(H) {
      let $ = UY(),                                  // memoryDir
          q = gf($6()),                              // sessionDir under cwd
          K = e$A?.isTeamMemoryEnabled() ?? !1,
          _ = H.trim();
      if (_ === $8A) _ = "";                        // "consolidate" → empty arg
      let A = H8A.exec(_);                          // /^(nightly|schedule|overnight)\b/i
      if (A) {
        // SCHEDULE mode
        let z = _.slice(A[0].length).trim();
        if (!$V())                                  // scheduling unavailable in this env
          return [{ type:"text", text:"Scheduling is not available in this environment. ..." }];
        let Y = _8A(),                              // get cron schedule string ("0 3 * * *" by default)
            [f = "0", O = "0"] = Y.split(" ");
        return (
          d("tengu_dream_invoked", { mode: "schedule", cron_hour: parseInt(O, 10), cron_minute: parseInt(f, 10), team_memory_enabled: K }),
          [{ type:"text", text: A8A($, q, Y, z, K) }]   // schedule-setup prompt
        );
      }
      return (
        d("tengu_dream_invoked", { mode: "consolidate", has_args: _.length > 0, team_memory_enabled: K }),
        Xd7(),                                       // touch lastConsolidatedAt
        [{ type:"text", text: SL$($, q, _, K) }]    // the dream prompt itself
      );
    },
  });
}

// READABLE (for understanding):
function registerDreamSkill() {
  registerSkill({
    name: "dream",
    aliases: ["learn"],
    description: "Reflective memory consolidation — review recent activity, ...",
    whenToUse: 'When the user wants Claude to reflect on and consolidate ...',
    argumentHint: "[nightly]",
    userInvocable: true,
    context: "fork",                                  // forks an agent for the operation
    isEnabled: isDreamSkillEnabled,                   // K8A — gates on !CN() + x9() + tengu_kairos_dream (default false)
    async getPromptForCommand(rawArgs) {
      const memoryDir = getAutoMemPath();
      const sessionTranscriptDir = getSessionTranscriptDir(getCwd());
      const teamMemEnabled = teamMem?.isTeamMemoryEnabled() ?? false;
      let args = rawArgs.trim();
      if (args === "consolidate") args = "";          // canonical empty
      // SCHEDULE mode — match /^(nightly|schedule|overnight)\b/i
      const scheduleMatch = SCHEDULE_MODE_REGEX.exec(args);
      if (scheduleMatch) {
        const additionalContext = args.slice(scheduleMatch[0].length).trim();
        if (!isSchedulingAvailable()) {
          return [{ type: "text", text: "Scheduling is not available in this environment. Tell the user they can run `/dream` without arguments to consolidate memories now. Do not call any tools." }];
        }
        const cronExpression = getDreamCronSchedule();   // e.g. "0 3 * * *" (3am daily)
        const [minute = "0", hour = "0"] = cronExpression.split(" ");
        recordInternalEvent("tengu_dream_invoked", {
          mode: "schedule",
          cron_hour: parseInt(hour, 10),
          cron_minute: parseInt(minute, 10),
          team_memory_enabled: teamMemEnabled,
        });
        return [{ type: "text", text: buildDreamSchedulePrompt(memoryDir, sessionTranscriptDir, cronExpression, additionalContext, teamMemEnabled) }];
      }
      // CONSOLIDATE mode
      recordInternalEvent("tengu_dream_invoked", {
        mode: "consolidate",
        has_args: args.length > 0,
        team_memory_enabled: teamMemEnabled,
      });
      touchLastConsolidatedAt();    // updates the mtime that auto-dream uses for throttle
      return [{ type: "text", text: buildDreamPrompt(memoryDir, sessionTranscriptDir, args, teamMemEnabled) }];
    },
  });
}

// Mapping:
//   z8A -> registerDreamSkill,           K8A -> isDreamSkillEnabled,
//   $8A -> "consolidate" (literal),      H8A -> SCHEDULE_MODE_REGEX (/^(nightly|schedule|overnight)\b/i),
//   _8A -> getDreamCronSchedule,         A8A -> buildDreamSchedulePrompt,
//   SL$ -> buildDreamPrompt (the actual dream prompt builder, also used by auto-dream),
//   Xd7 -> touchLastConsolidatedAt,      uf -> registerSkill,
//   $V  -> isSchedulingAvailable
```

**Two modes:**

- **`/dream`** (no arg) or **`/dream consolidate`** → runs the dream prompt against the model immediately. The model performs the 4-phase consolidation directly using its normal tool list.
- **`/dream nightly`** / **`/dream schedule`** / **`/dream overnight`** → returns the *schedule-setup* prompt (`A8A`), which tells the model to call the ScheduleCreate tool to create a cron job that runs `/dream` daily.

The `context: "fork"` field means the slash command runs in a forked agent context — the slash command's prompt becomes the user-visible message, and the model's tool calls execute in a fork that doesn't pollute the main transcript. But it's NOT the same fork the auto-dream scheduler uses — `/dream` from the user runs as the main agent's tool list (Edit/Write/Bash unrestricted, since the user explicitly asked).

### 2. The auto-dream scheduler — `nr7` / `cr7` / `lr7`

```javascript
// ============================================
// nr7 — public auto-dream entry, called by Co7
// Location: cli_inner_pretty.js:389669-389671
// ============================================

// ORIGINAL (for source lookup):
async function nr7(H, $) {
  await cr7?.(H, $);
}

// READABLE (for understanding):
async function runAutoDreamCheck(replContext, appendSystemMessage) {
  await autoDreamExtractor?.(replContext, appendSystemMessage);
}

// Mapping: nr7 -> runAutoDreamCheck, cr7 -> autoDreamExtractor (closure-scoped, null until lr7() runs)
```

```javascript
// ============================================
// lr7 — closure factory for the auto-dream extractor
// Location: cli_inner_pretty.js:389509-389637
// ============================================

// READABLE (for understanding):
function initAutoDream() {
  let lastScanTime = 0;
  autoDreamExtractor = async function (replContext, appendSystemMessage) {
    const thresholds = getDreamThresholds();        // v$5 → reads tengu_onyx_plover
    const isUnconditionalRun = isAutoDreamForcedRun();  // N$5 → returns false in v2.1.142 (kill switch)
    // Gate 1: feature-enabled check
    if (!isUnconditionalRun && !isAutoDreamEnabled()) return;
    // Gate 2: read last consolidated-at mtime
    let lastConsolidatedAt;
    try { lastConsolidatedAt = await readLastConsolidatedAt(); }
    catch (err) { debugLog(`[autoDream] readLastConsolidatedAt failed: ${err}`); return; }
    // Gate 3: enough hours since last consolidation?
    const hoursSince = (Date.now() - lastConsolidatedAt) / 3_600_000;
    if (!isUnconditionalRun && hoursSince < thresholds.minHours) return;
    // Gate 4: enough time since LAST scan attempt? (10 minute scan-throttle)
    const millisSinceLastScan = Date.now() - lastScanTime;
    if (!isUnconditionalRun && millisSinceLastScan < AUTO_DREAM_SCAN_THROTTLE_MS) {
      debugLog(`[autoDream] scan throttle — time-gate passed but last scan was ${Math.round(millisSinceLastScan/1000)}s ago`);
      return;
    }
    lastScanTime = Date.now();
    // Gate 5: enough sessions touched since last consolidation?
    let sessions;
    try { sessions = await listSessionsTouchedSince(lastConsolidatedAt); }
    catch (err) { debugLog(`[autoDream] listSessionsTouchedSince failed: ${err}`); return; }
    const currentSession = currentSessionId();
    sessions = sessions.filter(s => s !== currentSession);
    if (!isUnconditionalRun && sessions.length < thresholds.minSessions) {
      debugLog(`[autoDream] skip — ${sessions.length} sessions since last consolidation, need ${thresholds.minSessions}`);
      recordInternalEvent("tengu_auto_dream_skipped", { reason: "sessions", session_count: sessions.length, min_required: thresholds.minSessions });
      return;
    }
    // Gate 6: acquire filesystem lock (atomic mtime touch — prevents two concurrent runs)
    let priorMtime;
    if (isUnconditionalRun) priorMtime = lastConsolidatedAt;
    else {
      try { priorMtime = await acquireDreamLock(); }
      catch (err) { debugLog(`[autoDream] lock acquire failed: ${err}`); return; }
      if (priorMtime === null) {
        recordInternalEvent("tengu_auto_dream_skipped", { reason: "lock" });
        return;
      }
    }
    // All gates passed — fire the dream
    const teamMemEnabled = teamMem?.isTeamMemoryEnabled() ?? false;
    debugLog(`[autoDream] firing — ${hoursSince.toFixed(1)}h since last, ${sessions.length} sessions to review`);
    recordInternalEvent("tengu_auto_dream_fired", {
      hours_since: Math.round(hoursSince),
      sessions_since: sessions.length,
      team_memory_enabled: teamMemEnabled,
    });
    const { taskRegistry } = replContext.toolUseContext;
    const abortController = new AbortController();
    const dreamTaskId = registerDreamTask(taskRegistry, { sessionsReviewing: sessions.length, priorMtime, abortController });
    let phase = "fork";
    try {
      const memoryDir = getAutoMemPath();
      const sessionTranscriptDir = getSessionTranscriptDir(getCwd());
      const dailyLogCount = await countDailyLogs(memoryDir);
      const isTiny = isTinyMemoryEnabled();
      const extraContext = isTiny
        ? `\n\n**Tool constraints for this run:** Shell access is restricted to read-only commands ... plus deleting .md paths inside the memory directory. ${EditToolName} is not permitted — memories are immutable, so delete + ${WriteToolName} to replace, never edit in place. Plan your exploration with this in mind — no need to probe.`
        : `\n\n**Tool constraints for this run:** Shell access is restricted to read-only commands ... plus deleting .md paths inside the memory directory. Anything else that writes, redirects to a file, or modifies state will be denied. Plan your exploration with this in mind — no need to probe.\n\nSessions since last consolidation (${sessions.length}):\n${sessions.map(u => `- ${u}`).join("\n")}`;
      const dreamPromptText = isTiny
        ? buildDreamPromptTiny(memoryDir, extraContext, teamMemEnabled)        // SVK
        : buildDreamPrompt(memoryDir, sessionTranscriptDir, extraContext, teamMemEnabled);  // SL$
      const result = await runForkedAgent({
        promptMessages: [userMessage({ content: dreamPromptText })],
        cacheSafeParams: createCacheSafeParams(replContext),
        canUseTool: createAutoMemCanUseTool(memoryDir),    // DO8 — SAME as extraction
        querySource: "auto_dream",
        forkLabel: "auto_dream",
        skipTranscript: true,
        overrides: { abortController },
        onMessage: trackDreamFilesTouched(dreamTaskId, taskRegistry),       // E$5
        skipCacheWrite: shouldSkipCacheWrite(),
      });
      phase = "completion";
      finalizeDreamTask(dreamTaskId, taskRegistry);
      const taskRecord = replContext.toolUseContext.taskRegistry.get(dreamTaskId);
      const filesTouchedCount = isDreamTaskRecord(taskRecord) ? taskRecord.filesTouched.length : 0;
      // If files were touched, surface to UI via TWO channels:
      //   1. The MemoryUpdateNotification (verb="Improved") in the transcript
      //   2. pendingMemoryUpdates queue → next turn's system prompt
      if (isDreamTaskRecord(taskRecord) && taskRecord.filesTouched.length > 0) {
        appendSystemMessage?.({
          ...createMemorySavedMessage(taskRecord.filesTouched),
          verb: "Improved",                          // distinct verb from extraction's "Saved"
        });
        replContext.toolUseContext.setAppState(s => ({
          ...s,
          pendingMemoryUpdates: [
            ...s.pendingMemoryUpdates,
            {
              source: "dream",
              summary: `consolidated ${taskRecord.filesTouched.length} ${pluralize(taskRecord.filesTouched.length, "memory file")}`,
              paths: taskRecord.filesTouched,
            },
          ],
        }));
      }
      debugLog(`[autoDream] completed — cache: read=${result.totalUsage.cache_read_input_tokens} created=${result.totalUsage.cache_creation_input_tokens}`);
      recordInternalEvent("tengu_auto_dream_completed", {
        cache_read: result.totalUsage.cache_read_input_tokens,
        cache_created: result.totalUsage.cache_creation_input_tokens,
        output: result.totalUsage.output_tokens,
        sessions_reviewed: sessions.length,
        daily_logs_found: dailyLogCount,
        files_touched_count: filesTouchedCount,
        team_memory_enabled: teamMemEnabled,
      });
    } catch (err) {
      if (abortController.signal.aborted) {
        debugLog("[autoDream] aborted by user");
        return;
      }
      debugLog(`[autoDream] ${phase} failed: ${err}`);
      recordInternalEvent("tengu_auto_dream_failed", { phase, error_class: getErrorClass(err).name });
      if (phase === "fork") {
        rollbackDreamTask(dreamTaskId, taskRegistry);
        await releaseDreamLock(priorMtime);
      }
    }
  };
}

// Mapping:
//   lr7 -> initAutoDream,                cr7 -> autoDreamExtractor (closure-scoped),
//   v$5 -> getDreamThresholds,           k$5 -> isAutoDreamEnabled,
//   N$5 -> isAutoDreamForcedRun,         sf8 -> readLastConsolidatedAt,
//   Jd7 -> listSessionsTouchedSince,     jd7 -> acquireDreamLock,
//   tf8 -> releaseDreamLock,             Ld7 -> registerDreamTask,
//   Wd7 -> finalizeDreamTask,            Zd7 -> rollbackDreamTask,
//   kN6 -> isDreamTaskRecord,            Pd7 -> trackDreamFilesTouchedInner,
//   E$5 -> trackDreamFilesTouched,       y$5 -> countDailyLogs,
//   gr7 -> AUTO_DREAM_THRESHOLD_DEFAULTS,V$5 -> AUTO_DREAM_SCAN_THROTTLE_MS (600000 = 10min),
//   T$5 -> teamMem namespace,            JV -> runForkedAgent
```

**The auto-dream gate `k$5()` at 389500-389504:**

```javascript
function k$5() {
  if (CN()) return !1;        // CCR sentinel: model-restricted env disables dreaming
  if (I6()) return !1;        // remote workspace bridge handles its own consolidation
  if (!x9()) return !1;       // auto-memory must be enabled
  return hL$();               // and auto-dream feature toggle is on
}
```

**The dream thresholds (`v$5` reading `tengu_onyx_plover` Growthbook flag):**

```javascript
function v$5() {
  let H = Z$("tengu_onyx_plover", null);
  return {
    minHours: typeof H?.minHours === "number" && Number.isFinite(H.minHours) && H.minHours > 0 ? H.minHours : gr7.minHours,
    minSessions: typeof H?.minSessions === "number" && Number.isFinite(H.minSessions) && H.minSessions > 0 ? H.minSessions : gr7.minSessions,
  };
}
```

`gr7` holds the compile-time defaults; the Growthbook flag `tengu_onyx_plover` can override per-cohort. Typical defaults are tuned to fire roughly once a day after 5+ sessions of activity, but the exact numbers depend on the rollout.

**The 10-minute scan throttle (`V$5 = 600_000`)** is independent of the hours-since gate. Even if the hours-since gate passes (e.g., it's been 25 hours), the scheduler won't re-scan within 10 minutes of the previous scan attempt — this prevents rapid re-checks if the user fires many turns in quick succession after the threshold is crossed.

**Lock acquisition (`jd7` defined at cli_inner_pretty.js:377680; called from lr7 at 389547)** is critical because multiple concurrent Claude Code sessions on the same machine could otherwise both try to dream simultaneously. The lock uses the consolidatedAt file's mtime as the lock state — atomic-touch wins, others see the new mtime and back off. Lock release on fork-phase failure is `tf8(priorMtime)` (defined at cli_inner_pretty.js:377704; called from lr7 at 389634), which restores the prior mtime so a future attempt can retry instead of waiting for the next time threshold.

### 3. The dream prompt builder — `SL$` and `SVK`

```javascript
// ============================================
// SL$ — buildDreamPrompt (the 4-phase consolidation prompt)
// Location: cli_inner_pretty.js:389406-389472
// ============================================

// CONDENSED — the actual prompt is ~70 lines of text. Structure:
function buildDreamPrompt(memoryDir, sessionTranscriptDir, additionalContext, teamMemEnabled) {
  return `# Dream: Memory Consolidation

You are performing a dream — a reflective pass over your memory files. Synthesize what you've learned recently into durable, well-organized memories so that future sessions can orient quickly.

Memory directory: \`${memoryDir}\`
${JKH}                                            ← The standard auto-memory section reference

Session transcripts: \`${sessionTranscriptDir}\` (large JSONL files — grep narrowly, don't read whole files)
${teamMemEnabled ? Z$5 : ""}                       ← Team-memory phase guidance

---

## Phase 1 — Orient

- \`ls\` the memory directory to see what already exists
- Read \`MEMORY.md\` to understand the current index
- Skim existing topic files so you improve them rather than creating duplicates
- \`ls -R logs/\` — recent activity logs ...

## Phase 2 — Gather recent signal

Look for new information worth persisting. Sources in rough priority order:
1. Session logs (logs/YYYY/MM/DD/<id>-<title>.md)
2. Existing memories that drifted
3. Transcript search (narrow grep, don't read whole files)

Don't exhaustively read transcripts. Look only for things you already suspect matter.

## Phase 3 — Consolidate

For each thing worth remembering, write or update a memory file at the top level of the memory directory.
...
- Merging new signal into existing topic files rather than creating near-duplicates
- Converting relative dates ("yesterday") to absolute dates
- Deleting contradicted facts

## Phase 4 — Prune and index

Update \`MEMORY.md\` so it stays under 200 lines AND under ~25KB. It's an **index**, not a dump ...

${G$5}                                            ← Reconcile-against-CLAUDE.md guidance

---

Return a brief summary of what you consolidated, updated, or pruned. If nothing changed (memories are already tight), say so.${additionalContext ? `\n\n## Additional context\n\n${additionalContext}` : ""}`;
}
```

**Four phases:** Orient → Gather → Consolidate → Prune.

- **Phase 1 (Orient)** establishes the lay of the land. Read MEMORY.md, skim topic files, list daily-log directory. The agent doesn't waste turns "discovering" the structure since the prompt names it.
- **Phase 2 (Gather)** is the actual signal extraction. Sources are ordered by priority: session logs first (cheap, structured), then existing memories that may have drifted (compare against current code), then transcript JSONL grep (expensive — use narrow terms). The "don't exhaustively read transcripts" instruction is a hard guardrail against burning the turn budget on exploration.
- **Phase 3 (Consolidate)** is the actual writing. Three sub-instructions: merge into existing files (no near-duplicates), convert relative→absolute dates, delete contradicted facts. Each is a separate sentence in the prompt; the model treats them as separate sub-tasks.
- **Phase 4 (Prune and index)** maintains MEMORY.md's hygiene. The 200-line / 25KB caps are stated explicitly (the same caps as the runtime truncation in `oi$`, but here as user-facing rules). The "demote verbose entries: if an index line is over ~200 chars" is a soft guideline preserving the index/detail-file split.

**Team-memory phase guidance** (`Z$5` constant, only injected when team memory is enabled) adds:
- Phase 1: also list `team/`
- Phase 3: merge near-duplicates within `team/`, also if a personal memory restates a team memory, delete the personal one
- Phase 4: be conservative pruning team/ (don't delete memories you don't recognize — a teammate may rely on it)

**Reconcile-against-CLAUDE.md** (`G$5` constant) is always appended. It tells the agent how to handle conflicts between a memory and the project's CLAUDE.md: memory-stale → delete or rewrite; CLAUDE.md-stale → annotate the memory ("contradicts CLAUDE.md") but don't edit CLAUDE.md during a dream; not-a-conflict → leave it.

**The tiny variant `SVK`** (referenced in [memdir_core.md](./memdir_core.md)) follows the same 4-phase structure but emphasizes the immutability rules (no Edit; delete-and-recreate). It's used when `gM()`/`tengu_billiard_aviary` is on.

### 4. The dream's tool-allow-list — same `DO8` as extraction

The dream subagent uses the exact same `createAutoMemCanUseTool` validator as the extraction subagent ([extract_memories_runtime.md § 8](./extract_memories_runtime.md#8-the-tool-restriction-validator--do8)). This means dream is sandboxed to: Read/Grep/Glob unrestricted, Bash/Powershell read-only commands OR `rm`/`Remove-Item` for `*.md` inside memoryDir, Edit/Write only for paths inside memoryDir. Edit is denied in tiny mode (memories are immutable).

The reason for re-use is straightforward: both subagents do the same kind of work (read recent state, decide what to save, write memory files) so they need the same powers. There's no operational difference in what they're allowed to touch.

### 5. The files-touched tracker — `E$5` / `Pd7`

```javascript
// ============================================
// E$5 — onMessage callback that aggregates tool calls into a task record
// Location: cli_inner_pretty.js:389638-389659
// ============================================

// READABLE (for understanding):
function trackDreamFilesTouched(taskId, taskRegistry) {
  return (message) => {
    if (message.type !== "assistant") return;
    let textChunks = "";
    let toolUseCount = 0;
    const filesTouched = [];
    for (const block of message.message.content) {
      if (block.type === "text") {
        textChunks += block.text;
      } else if (block.type === "tool_use") {
        toolUseCount++;
        // Edit/Write — record the file_path directly
        if (block.name === EditToolName || block.name === WriteToolName) {
          if (typeof block.input.file_path === "string") {
            filesTouched.push(block.input.file_path);
          }
        // Bash/Powershell — parse rm/Remove-Item commands for .md paths
        } else if (SHELL_TOOL_NAMES.includes(block.name)) {
          if (typeof block.input.command === "string" && /^\s*(rm|remove-item|ri|del|erase)\b/i.test(block.input.command)) {
            // Extract each *.md path argument
            for (const match of block.input.command.matchAll(/"[^"]*\.md"|'[^']*\.md'|(?:\/|[A-Za-z]:[\\/])\S*\.md\b/g)) {
              filesTouched.push(match[0].replace(/^["']|["']$/g, ""));
            }
          }
        }
      }
    }
    aggregateDreamProgress(taskId, { text: textChunks.trim(), toolUseCount }, filesTouched, taskRegistry);
  };
}

// Mapping: E$5 -> trackDreamFilesTouched, Pd7 -> aggregateDreamProgress
```

This watches the forked agent's stream and accumulates the list of files it touched (Edit/Write file_paths + parsed rm/Remove-Item paths). The aggregated list is stored on the task registry under the dream's taskId, and at completion the post-dream code reads it to build the "Improved N files" notification and the `pendingMemoryUpdates` queue entry.

The shell-command parsing is necessary because deletes happen via `rm`/`Remove-Item`, not Edit/Write. Without the parser, deletes wouldn't show up in the "files touched" count. The regex matches:
- `"foo.md"` or `'foo.md'` (quoted)
- `/absolute/path/foo.md` or `C:\path\foo.md` (absolute, unquoted)

This is consistent with the `f$5`/`Y$5` allow-list validators that only accept absolute `.md` paths inside `memoryDir`.

### 6. The `pendingMemoryUpdates` queue + `memory_update` attachment

```javascript
// ============================================
// Eq5 — drain pendingMemoryUpdates and emit memory_update attachments
// Location: cli_inner_pretty.js:398623-398636
// ============================================

// READABLE (for understanding):
function drainPendingMemoryUpdates(replContext) {
  const pending = replContext.getAppState().pendingMemoryUpdates;
  if (pending.length === 0) return [];
  // Clear the queue (idempotent — only writes if non-empty)
  replContext.setAppState(s => s.pendingMemoryUpdates.length === 0 ? s : { ...s, pendingMemoryUpdates: [] });
  // Compute which paths the model has already loaded in this context
  // (so we can tell it "your loaded copy is stale" only for those).
  // Three inclusion sources:
  //   1. The MEMORY.md entrypoint (when index-content gating is on)
  //   2. readFileState — any file the model has read in this session
  //   3. loadedNestedMemoryPaths — @-imported nested memories
  const entrypointPath = isAutoMemoryEnabled() && process.env.CLAUDE_COWORK_MEMORY_INDEX_CONTENT !== "" ? getEntrypointPath() : null;
  const isInContext = path => path === entrypointPath || replContext.readFileState.has(path) || (replContext.loadedNestedMemoryPaths?.has(path) ?? false);
  return pending.map(update => ({
    type: "memory_update",
    source: update.source,                            // "dream" (only producer in v2.1.142)
    summary: update.summary,                          // e.g. "consolidated 3 memory files"
    paths: update.paths,                              // all changed paths
    inContextPaths: update.paths.filter(isInContext), // subset already in model's context
  }));
}
```

```javascript
// ============================================
// memory_update attachment renderer at 425292-425311
// (The system-prompt builder reads this and produces the model-facing isMeta message)
// ============================================

case "memory_update": {
  const lines = [`${Cz5[H.source]} updated your memory directory: ${H.summary}`];
  if (H.paths.length > 0) lines.push(`Files changed: ${H.paths.join(", ")}`);
  if (H.inContextPaths.length > 0) {
    lines.push(`Your loaded copy of ${H.inContextPaths.join(", ")} is now stale relative to disk — Read it again if you need current contents.`);
  }
  lines.push("This is ambient context — do not narrate it to the user unless they ask or it is directly relevant to their request.");
  return [userMessage({ content: lines.join("\n"), isMeta: true })];
}

// Cz5 = { dream: "Background memory consolidation" }
```

**Three things this attachment does:**

1. **Tells the model that memories changed.** Without this, the model has no idea its memory directory was reorganized in the background — it would see different content on the next file read with no explanation.
2. **Warns about stale in-context copies.** If the model had loaded `user.md` earlier in this session and dream modified it, the model's cached version is now wrong. The attachment names exactly which paths are stale so the model can re-read selectively.
3. **Instructs the model to keep quiet about it.** Without the "ambient context" instruction, the model might say "I just noticed my memory was reorganized" — which would be confusing UX. The instruction maps consolidation to a *system-internal* event that the model accommodates but doesn't surface.

The `Cz5` map only has one entry (`dream`) in v2.1.142, but the structure is extensible — if a future feature adds another memory-modifying background process, it would get its own source label.

### 7. The UI for dream completion

When dream completes successfully, two UI surfaces show updates:

**Inline transcript notification** — produced by `appendSystemMessage` with `verb: "Improved"`:
```
· Improved 3 memories
  · user.md
  · feedback_testing.md
  · MEMORY.md
```

This uses the same `Oc_` renderer as extraction's "Saved N memories", just with the verb swapped via the `verb` field on the system message. The `JO8(filesTouched)` factory builds the standard `memory_saved` system message; the auto-dream completion code overrides `verb` to `"Improved"` to distinguish the source visually. See [memory_ui.md § MemoryUpdateNotification](./memory_ui.md#3-the-memoryupdatenotification--oc_) for the renderer details.

**Next-turn ambient context** — via the `memory_update` attachment described above. This isn't user-visible — it's a model-only system reminder that the memory directory was changed.

### 8. The `/dream nightly` schedule path — `A8A`

```javascript
// ============================================
// A8A — buildDreamSchedulePrompt (the "set up nightly /dream" prompt)
// Location: cli_inner_pretty.js:588254
// ============================================

// READABLE (heavy paraphrasing; the actual content is a model-facing prompt that
// instructs the model to call the ScheduleCreate tool):
function buildDreamSchedulePrompt(memoryDir, sessionDir, cronExpression, additionalContext, teamMemEnabled) {
  return `The user wants to set up a recurring nightly memory consolidation job.
...
**Step 4 — Run an immediate consolidation**
${buildDreamPrompt(memoryDir, sessionDir, additionalContext, teamMemEnabled)}`;
}
```

The schedule prompt has multiple steps that culminate in calling the `Schedule` tool to create a cron job that runs `/dream` daily. The final step embeds the regular dream prompt so the model also runs a consolidation immediately after setting up the schedule.

This means `/dream nightly` does **two** things: (a) sets up a recurring nightly cron job, and (b) runs an immediate consolidation pass. So the user doesn't have to wait until tonight to see the first dream.

---

## A note on `memory_20250818` — NOT Claude Code's auto-memory

References to `memory_20250818` (cli_inner_pretty.js:592878 and 597192) and `client.beta.memory_stores.*` (cli_inner_pretty.js:594173) are **NOT part of Claude Code's local auto-memory subsystem**. They are documentation embedded in the CLI binary that describes the Anthropic Managed Agents API's memory tool — a *separate, cloud-hosted product* that Claude API customers can use when building their own agents on the Anthropic platform.

**The two systems are entirely independent:**

| Aspect | Claude Code auto-memory (this analysis) | Anthropic Managed Agents memory_20250818 |
|--------|----------------------------------------|------------------------------------------|
| Storage | Local filesystem (`~/.claude/projects/<slug>/memory/`) | Anthropic-hosted memory stores (`memstore_...`) |
| Tool | Read/Edit/Write the model can call directly | A dedicated `memory` tool with managed `create`/`update`/`delete`/`list` operations |
| Triggering | Auto via `executeExtractMemories` + auto-dream; manual via `/memory`, `/dream`, `# direct-save` | Always model-initiated; the agent calls the `memory` tool itself |
| Format | Markdown files with frontmatter | Memory store memories (path-addressed text documents) |
| Persistence boundary | Local machine | Workspace scope (cloud) |
| Versioning | None (filesystem state) | Immutable `memver_...` per mutation, with API-level redaction |
| Cost | Free (just compute for extraction agent) | Billable Anthropic API feature |
| Code location | Codified in `cli_inner_pretty.js` (this analysis covers it) | Just documented in the CLI bundle as reference material (lines 592878–597192) |

The reason the bundled documentation exists in `cli_inner_pretty.js` is so Claude Code can answer questions like *"how do I use Anthropic's memory store in my own agent?"* by reading the bundled docs and explaining the API to the user. The CLI itself doesn't call the `memory_stores.*` API — only customer applications built against the Claude API would.

If you grep `cli_inner_pretty.js` for "memory" and see `memory_20250818` references, treat them as **API documentation strings**, not implementation. The Claude Code auto-memory code paths are the ones cataloged in [README.md § Related Symbols](./README.md#related-symbols) and the docs in this unit.

---

## Cross-references between extraction and dreaming

| Concern | Extraction (`b85`) | Dreaming (`nr7` / `cr7`) |
|---------|-------------------|--------------------------|
| Trigger | Every turn (post-assistant) | Every turn check, but only fires when minHours + minSessions thresholds pass + lock acquired |
| Master gate | `Wi$` (`tengu_passport_quail`) | `k$5()` (`!CN`, `!I6`, `x9`, `hL$`) |
| Threshold flags | `tengu_bramble_lintel` (per-turn throttle) | `tengu_onyx_plover.{minHours, minSessions}` |
| Prompt | `hr7` — "extract recent N messages" | `SL$` (or `SVK`) — "reflective pass over existing memories" |
| Scope of input | The last N model-visible messages since cursor | Existing memory files + session logs (across sessions) |
| Tool allow-list | `DO8(memoryDir)` | `DO8(memoryDir)` — IDENTICAL |
| Notification verb | "Saved" | "Improved" |
| Post-completion side-effect | `appendSystemMessage(memorySaved)` only | `appendSystemMessage(memorySaved)` AND `pendingMemoryUpdates.push({source:"dream",...})` (drains as `memory_update` attachment next turn) |
| Mutual exclusion | Skips if main agent wrote to memory paths this turn | Filters out current session from `sessionsTouched`; lock prevents two concurrent auto-dreams |
| Throttle period | Per-turn (default 1 = every turn) | Hours-since (default ~daily) + 10min scan throttle + lock |
| User intervention | `/toggle-memory` disables writes | `/memory` selector toggles "Auto-dream: on/off" |
| Documented in | [extract_memories_runtime.md](./extract_memories_runtime.md) | This doc |

**The split is purposeful:**

- *Extraction* captures **fresh signal** at high resolution. It runs every turn because the model just produced new information that's about to be lost.
- *Dreaming* maintains **long-term hygiene** at low resolution. It runs roughly daily because reorganization should not race with active extraction, and consolidation only makes sense across enough sessions to reveal patterns.

Together they implement the classic "write path" + "compaction path" split familiar from log-structured storage systems. Extraction is the WAL; dreaming is the compactor.

---

## Why this approach

**Why a separate "dream" pass rather than letting extraction do everything?** Because the two have different optimal timing horizons. Extraction needs *recent* context to make per-turn decisions; dreaming needs *broad* context to make cross-session decisions. Running extraction on the broad context would be wasteful (re-paying for the same history every turn). Running dreaming on every turn would prevent the model from accumulating enough signal to reorganize meaningfully.

**Why the same `DO8` allow-list for both?** Because both subagents perform the same kind of work (read/edit/write memory files, delete stale ones) and should have the same sandbox. Sharing the validator means a security change applies to both at once.

**Why does auto-dream use a filesystem lock?** Because multiple Claude Code processes (separate terminals, separate projects, but same memory dir if `CLAUDE_CODE_AUTO_MEMORY_DIRECTORY` is set globally) could try to dream simultaneously. The lock is an atomic mtime touch on `lastConsolidatedAt` — losers see a newer mtime than they tried to write and back off. Without it, you could have two forks both editing MEMORY.md and overwriting each other.

**Why does `/dream nightly` immediately run a consolidation in addition to setting up the schedule?** Because the user probably has things to consolidate *right now* (they wouldn't be setting up a schedule otherwise). Making them wait until tonight to see the first dream would be a poor UX. The immediate run amortizes the schedule-creation moment.

**Why `verb: "Improved"` for dream vs `"Saved"` for extraction?** Because they convey different things. "Saved" implies "you just told me X and I captured it". "Improved" implies "I cleaned up your memory directory". Both use the same notification component, but the verb tells the user which path produced the change.

**Why does the `memory_update` attachment include `inContextPaths`?** Because the model's stale-cache problem is path-specific. If dream changed `user.md` but the model never read `user.md` this session, there's nothing to invalidate — it'll just read the new version when it next needs it. But if the model already loaded `user.md` earlier this session, the in-memory copy is now wrong. Naming the specific stale paths lets the model selectively re-read only the affected files.

**Why is dream gated separately on `hL$()` rather than just inheriting from `x9()`?** Because dreaming is heavier (a full subagent on a multi-session corpus) and a user might want auto-memory writes but not auto-consolidation. The `hL$()` gate reads `m6().autoDreamEnabled` (a separate user setting) — if undefined, falls back to the slash-command registered status or the `ii$()` feature-flag default. This split lets users opt into the cheap extraction-only mode.

**Why is the auto-dream invocation from `Co7` and not from a separate timer/cron?** Because piggy-backing on the existing turn-end hook means no extra scheduling infrastructure. The user's natural typing cadence drives the gate check; if they're not using Claude Code, no dreams fire. This is the same fire-and-forget pattern as extraction.

---

## Key insight

Auto-memory in v2.1.142 has **three writer paths** (only two were documented before this addition):

1. **Main-agent inline writes** — the user asks "remember X", the main agent writes to a memory file directly.
2. **Extraction subagent** (per turn) — captures *just the new signal* from the recent conversation.
3. **Dream subagent** (per ~day) — *reorganizes* what's already been captured.

All three converge on the same on-disk structure (`~/.claude/projects/<slug>/memory/`) and the same allow-list (`DO8`). The differences are timing (per-turn vs daily), scope (this turn vs cross-session), and intent (capture vs consolidate).

The user experiences this as a single seamless "Claude remembers me", but underneath it's a three-tier write hierarchy with explicit handoffs: extraction skips when the main agent already wrote; dream runs only when extraction hasn't fired in N hours and M+ sessions have happened. The handoffs are encoded in the gate functions, not in any orchestrator — each writer independently decides whether to act.

This decoupling makes each writer independently testable and feature-flaggable. Extraction can be turned off via `tengu_passport_quail` without touching dream; dream can be turned off via `hL$()` without touching extraction; both can be turned off via `x9()` (the master auto-memory enable). And the user can selectively suppress writes (not reads) via `/toggle-memory` — without changing any of the writer's decision logic.

---

## Cross-references

- [extract_memories_runtime.md](./extract_memories_runtime.md) — the per-turn writer; shares `DO8` with this doc
- [memdir_core.md](./memdir_core.md) — `SVK` (tiny-variant dream prompt) and `SL$` builders live here in the prompt-construction layer
- [memory_ui.md](./memory_ui.md) — MemoryFileSelector's "Auto-dream: on/off" toggle row + status hints
- [paths.md](./paths.md) — `x9()` / `isAutoMemoryEnabled` gate (parent of `k$5()`)
- The Stop-hook chain (`Co7` at cli_inner_pretty.js:391667) — [`../39_goal/goal_stop_hook_consumer.md`](../39_goal/goal_stop_hook_consumer.md) covers the same orchestrator from a different feature's angle
- The skill registration framework (`uf` / `registerSkill`) used by `/dream` — `10_skill_system`
- The Schedule tool that `/dream nightly` calls — `28_cli_commands` or the routines/scheduler subsystem
- Anthropic Managed Agents memory_stores API — *not part of this analysis* — see code.claude.com docs
