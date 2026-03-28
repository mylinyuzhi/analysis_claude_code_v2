# Cleanup System Deep Analysis

> Source-level reverse engineering of the periodic cleanup orchestrator, per-directory cleanup strategies, and scheduling.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `runCleanup` (ERq) - Master cleanup orchestrator
- `startPeriodicCleanup` (Qa8) - Starts the 10-minute periodic timer
- `getCleanupCutoffDate` (O86) - Calculates cutoff date based on settings
- `deleteIfOlderThan` (rC1) - Helper: deletes file if older than cutoff
- `removeEmptyDir` (mi) - Helper: silently removes empty directory
- `cleanupLogs` (LMz) - Cleans MCP/general logs
- `cleanupSessions` (RMz) - Cleans session .jsonl and .cast files
- `cleanupPlans` (SMz) - Cleans plan .md files
- `cleanupFileHistory` (CMz) - Cleans file-history session directories
- `cleanupSessionEnv` (IMz) - Cleans session-env session directories
- `cleanupDebugLogs` (bMz) - Cleans debug .txt files
- `cleanupTodoFiles` (qT4) - Cleans todo files
- `cleanupOldPastes` (I84) - Cleans paste-cache files
- `cleanupWorktrees` (Fu8) - Cleans stale worktrees

---

## Architecture Overview

The cleanup system runs on a 10-minute periodic timer, with the first run being a full cleanup and subsequent runs performing lighter periodic tasks. The system respects a configurable retention period (default 30 days) and includes activity-based throttling for background agents.

```
Process Start
  │
  ▼
startPeriodicCleanup()
  │
  ├── initAutoExtract()           # Initialize auto-extraction
  ├── initAutoMemories()          # Initialize auto-memory
  ├── memoryModule.initExtractMemories()  # Initialize memory extraction
  └── initAutoTodo()              # Initialize auto-todo
  │
  ▼
setTimeout(tick, 600000)          # 10 minutes
  │
  ▼
tick()
  │
  ├── Activity check (background agents skip if user active in last 60s)
  │
  ├── First run only: runCleanup()
  │   ├── cleanupLogs()
  │   ├── cleanupSessions()
  │   ├── cleanupPlans()
  │   ├── cleanupFileHistory()
  │   ├── cleanupSessionEnv()
  │   ├── cleanupDebugLogs()
  │   ├── cleanupTodoFiles()
  │   ├── cleanupOldPastes()
  │   └── cleanupWorktrees()
  │
  └── Every run: runPeriodicTasks()
      │
      └── setTimeout(tick, 600000)  # Schedule next tick
```

---

## Core Functions

### getCleanupCutoffDate (`O86`)

```javascript
// ============================================
// getCleanupCutoffDate - Calculates the cutoff date for cleanup
// Location: chunks.184.mjs:1066-1069
// ============================================

// ORIGINAL (for source lookup):
function O86() {
    let K = ((PA() || {}).cleanupPeriodDays ?? kMz) * 24 * 60 * 60 * 1000;
    return new Date(Date.now() - K)
}

// READABLE (for understanding):
function getCleanupCutoffDate() {
    let periodMs = ((getSettings() || {}).cleanupPeriodDays ?? DEFAULT_CLEANUP_DAYS) * 24 * 60 * 60 * 1000;
    return new Date(Date.now() - periodMs)
}

// Mapping: O86→getCleanupCutoffDate, PA→getSettings, kMz→DEFAULT_CLEANUP_DAYS (30)
```

**Default cleanup period:** 30 days (`kMz = 30`). User-configurable via `cleanupPeriodDays` in settings.

### Helper Functions

```javascript
// ============================================
// deleteIfOlderThan - Deletes a file if mtime before cutoff
// Location: chunks.184.mjs:1124-1127
// ============================================

// ORIGINAL (for source lookup):
async function rC1(A, q, K) {
    if ((await K.stat(A)).mtime < q) return await K.unlink(A), !0;
    return !1
}

// READABLE (for understanding):
async function deleteIfOlderThan(filePath, cutoffDate, fs) {
    if ((await fs.stat(filePath)).mtime < cutoffDate) {
        await fs.unlink(filePath);
        return true;
    }
    return false;
}

// Mapping: rC1→deleteIfOlderThan, A→filePath, q→cutoffDate, K→fs
```

```javascript
// ============================================
// removeEmptyDir - Silently attempts to remove empty directory
// Location: chunks.184.mjs:1129-1133
// ============================================

// ORIGINAL (for source lookup):
async function mi(A, q) {
    try { await q.rmdir(A) } catch {}
}

// READABLE (for understanding):
async function removeEmptyDir(dirPath, fs) {
    try { await fs.rmdir(dirPath) } catch {}  // rmdir only succeeds on empty dirs
}

// Mapping: mi→removeEmptyDir
```

**Key insight:** `rmdir` only succeeds on empty directories, so this is used as a safe post-cleanup step to prune directory trees bottom-up without risk of data loss.

---

## Per-Directory Cleanup Functions

### cleanupPlans (`SMz`)

```javascript
// ============================================
// cleanupPlans - Removes old .md plan files
// Location: chunks.184.mjs:1228-1231
// ============================================

// ORIGINAL (for source lookup):
function SMz() {
    let A = nZ(c8(), "plans");
    return hMz(A, ".md")
}

// READABLE (for understanding):
function cleanupPlans() {
    let plansDir = pathJoin(getClaudeHome(), "plans");
    return cleanupFilesInDir(plansDir, ".md");
}

// Mapping: SMz→cleanupPlans, hMz→cleanupFilesInDir
```

Targets: `~/.claude/plans/*.md` files older than cutoff.

### cleanupFileHistory (`CMz`)

```javascript
// ============================================
// cleanupFileHistory - Removes old file-history session directories
// Location: chunks.184.mjs:1233-1263
// ============================================

// ORIGINAL (for source lookup):
async function CMz() {
    let A = O86(), q = { messages: 0, errors: 0 }, K = $1();
    try {
        let Y = c8(), z = nZ(Y, "file-history"), _;
        try { _ = await K.readdir(z) } catch { return q }
        let w = _.filter((O) => O.isDirectory()).map((O) => nZ(z, O.name));
        for (let O of w) try {
            if ((await K.stat(O)).mtime < A) await K.rm(O, { recursive: !0, force: !0 }), q.messages++
        } catch { q.errors++ }
        await mi(z, K)
    } catch (Y) { _6(Y) }
    return q
}

// READABLE (for understanding):
async function cleanupFileHistory() {
    let cutoff = getCleanupCutoffDate(), result = { messages: 0, errors: 0 }, fs = getFs();
    try {
        let historyDir = pathJoin(getClaudeHome(), "file-history");
        let entries;
        try { entries = await fs.readdir(historyDir) } catch { return result }
        let subdirs = entries.filter(e => e.isDirectory()).map(e => pathJoin(historyDir, e.name));
        for (let dir of subdirs) try {
            if ((await fs.stat(dir)).mtime < cutoff) {
                await fs.rm(dir, { recursive: true, force: true });
                result.messages++;
            }
        } catch { result.errors++ }
        await removeEmptyDir(historyDir, fs);  // Prune if empty
    } catch (err) { reportError(err) }
    return result;
}

// Mapping: CMz→cleanupFileHistory, $1→getFs, O86→getCleanupCutoffDate
```

Targets: `~/.claude/file-history/{sessionId}/` directories. Entire session directories are deleted recursively if their mtime is before the cutoff. Parent directory pruned if empty.

### cleanupSessionEnv (`IMz`)

```javascript
// ============================================
// cleanupSessionEnv - Removes old session-env directories
// Location: chunks.184.mjs:1265-1295
// ============================================

// READABLE (for understanding):
async function cleanupSessionEnv() {
    // Identical pattern to cleanupFileHistory but targets:
    // ~/.claude/session-env/{sessionId}/ directories
    let cutoff = getCleanupCutoffDate(), result = { messages: 0, errors: 0 }, fs = getFs();
    let sessionEnvDir = pathJoin(getClaudeHome(), "session-env");
    // ... same logic: readdir → filter dirs → stat → rm if old ...
    await removeEmptyDir(sessionEnvDir, fs);
    return result;
}

// Mapping: IMz→cleanupSessionEnv
```

### cleanupDebugLogs (`bMz`)

```javascript
// ============================================
// cleanupDebugLogs - Removes old .txt debug logs (preserves "latest")
// Location: chunks.184.mjs:1297-1320
// ============================================

// ORIGINAL (for source lookup):
async function bMz() {
    let A = O86(), q = { messages: 0, errors: 0 }, K = $1(), Y = nZ(c8(), "debug"), z;
    try { z = await K.readdir(Y) } catch { return q }
    for (let _ of z) {
        if (!_.isFile() || !_.name.endsWith(".txt") || _.name === "latest") continue;
        try {
            if (await rC1(nZ(Y, _.name), A, K)) q.messages++
        } catch { q.errors++ }
    }
    return q
}

// READABLE (for understanding):
async function cleanupDebugLogs() {
    let cutoff = getCleanupCutoffDate(), result = { messages: 0, errors: 0 }, fs = getFs();
    let debugDir = pathJoin(getClaudeHome(), "debug");
    let entries;
    try { entries = await fs.readdir(debugDir) } catch { return result }
    for (let entry of entries) {
        // Skip non-files, non-.txt, and the "latest" symlink
        if (!entry.isFile() || !entry.name.endsWith(".txt") || entry.name === "latest") continue;
        try {
            if (await deleteIfOlderThan(pathJoin(debugDir, entry.name), cutoff, fs))
                result.messages++;
        } catch { result.errors++ }
    }
    return result;
}

// Mapping: bMz→cleanupDebugLogs
```

**Key insight:** The `"latest"` file is always preserved -- it's likely a symlink to the current session's debug log.

### cleanupOldPastes (`I84`)

```javascript
// ============================================
// cleanupOldPastes - Removes paste files older than cutoff
// Location: chunks.85.mjs:1346-1362
// ============================================

// READABLE (for understanding):
async function cleanupOldPastes(cutoffDate) {
    let dir = getPasteCacheDir();
    let entries;
    try { entries = await readdir(dir) } catch { return }
    let cutoffMs = cutoffDate.getTime();
    for (let entry of entries) {
        if (!entry.endsWith(".txt")) continue;
        let filePath = pathJoin(dir, entry);
        try {
            if ((await stat(filePath)).mtimeMs < cutoffMs) {
                await unlink(filePath);
                log(`Cleaned up old paste: ${filePath}`);
            }
        } catch {}
    }
}

// Mapping: I84→cleanupOldPastes
```

---

## Master Cleanup Orchestrator (`ERq`)

```javascript
// ============================================
// runCleanup - Runs all cleanup tasks in sequence
// Location: chunks.184.mjs:1322-1335
// ============================================

// ORIGINAL (for source lookup):
async function ERq() {
    let { errors: A } = Kl();
    if (A.length > 0 && Cvq("cleanupPeriodDays")) {
        k("Skipping cleanup: settings have validation errors but cleanupPeriodDays was explicitly set.");
        return
    }
    await LMz(), await RMz(), await SMz(), await CMz(), await IMz(), await bMz(), await qT4(), await I84(O86());
    let q = await Fu8(O86());
    if (q > 0) d("tengu_worktree_cleanup", { removed: q })
}

// READABLE (for understanding):
async function runCleanup() {
    // Safety check: if settings have validation errors AND cleanupPeriodDays
    // was explicitly set, skip cleanup to avoid using bad settings
    let { errors } = validateSettings();
    if (errors.length > 0 && settingWasExplicitlySet("cleanupPeriodDays")) {
        log("Skipping cleanup: settings validation errors with explicit cleanupPeriodDays.");
        return;
    }

    // Sequential cleanup of all managed directories
    await cleanupLogs();                              // LMz - MCP/general logs
    await cleanupSessions();                          // RMz - .jsonl and .cast files
    await cleanupPlans();                             // SMz - plan .md files
    await cleanupFileHistory();                       // CMz - file-history dirs
    await cleanupSessionEnv();                        // IMz - session-env dirs
    await cleanupDebugLogs();                         // bMz - debug .txt files
    await cleanupTodoFiles();                         // qT4 - todo files
    await cleanupOldPastes(getCleanupCutoffDate());   // I84 - paste-cache files
    let removedWorktrees = await cleanupWorktrees(getCleanupCutoffDate());  // Fu8
    if (removedWorktrees > 0) {
        telemetry("tengu_worktree_cleanup", { removed: removedWorktrees });
    }
}

// Mapping: ERq→runCleanup, Kl→validateSettings, Cvq→settingWasExplicitlySet
```

**Execution order and rationale:**

| Step | Function | Target | Why This Order |
|------|----------|--------|---------------|
| 1 | `cleanupLogs` | MCP/general logs | Logs are least critical, freed first |
| 2 | `cleanupSessions` | `.jsonl`, `.cast` files | Session transcripts are largest files |
| 3 | `cleanupPlans` | Plan `.md` files | Small files, quick cleanup |
| 4 | `cleanupFileHistory` | Per-session dirs | Recursive delete, moderate cost |
| 5 | `cleanupSessionEnv` | Per-session dirs | Recursive delete, moderate cost |
| 6 | `cleanupDebugLogs` | Debug `.txt` files | Small files, preserves "latest" |
| 7 | `cleanupTodoFiles` | Todo files | Small files |
| 8 | `cleanupOldPastes` | Paste-cache `.txt` | Content-addressed files |
| 9 | `cleanupWorktrees` | Git worktrees | Most expensive (git operations), last |

**Safety check:** If settings have validation errors AND `cleanupPeriodDays` was explicitly set by the user, cleanup is skipped entirely. This prevents a misconfigured cleanup period from accidentally deleting data.

---

## Periodic Scheduler (`Qa8`)

```javascript
// ============================================
// startPeriodicCleanup - Starts the 10-minute periodic timer
// Location: chunks.184.mjs:1361-1377
// ============================================

// ORIGINAL (for source lookup):
function Qa8() {
    G3q(), vRq(), xMz.initExtractMemories(), Twq();
    let A = !0;
    async function q() {
        if (DW() && yx() > Date.now() - 60000) { setTimeout(q, pa8).unref(); return }
        if (A) A = !1, await ERq();
        if (DW() && yx() > Date.now() - 60000) { setTimeout(q, pa8).unref(); return }
        await Ac6()
    }
    setTimeout(q, pa8).unref()
}

// READABLE (for understanding):
function startPeriodicCleanup() {
    // Initialize auto-extraction systems
    initAutoExtract();        // G3q
    initAutoMemories();       // vRq
    memoryModule.initExtractMemories();  // xMz.initExtractMemories
    initAutoTodo();           // Twq

    let isFirstRun = true;

    async function tick() {
        // Throttle: skip if user was active in last 60s (background agents only)
        if (isBackgroundAgent() && getLastActivityTime() > Date.now() - 60000) {
            setTimeout(tick, CLEANUP_INTERVAL).unref();
            return;
        }

        // First run: full cleanup
        if (isFirstRun) {
            isFirstRun = false;
            await runCleanup();
        }

        // Re-check activity after cleanup
        if (isBackgroundAgent() && getLastActivityTime() > Date.now() - 60000) {
            setTimeout(tick, CLEANUP_INTERVAL).unref();
            return;
        }

        // Every run: periodic tasks (lighter-weight)
        await runPeriodicTasks();
    }

    setTimeout(tick, CLEANUP_INTERVAL).unref();  // CLEANUP_INTERVAL = 600000 (10 minutes)
}

// Mapping: Qa8→startPeriodicCleanup, pa8→CLEANUP_INTERVAL (600000), ERq→runCleanup
// DW→isBackgroundAgent, yx→getLastActivityTime, Ac6→runPeriodicTasks
```

**Key design decisions:**

1. **10-minute interval** (`pa8 = 600000`): Balances cleanup frequency against I/O cost
2. **Activity-based throttling**: Background agents skip cleanup if user was active in last 60 seconds, avoiding I/O contention during active use
3. **First-run-only full cleanup**: `runCleanup()` runs once on the first tick; subsequent ticks only run `runPeriodicTasks()` (lighter-weight operations)
4. **`.unref()` on timers**: Cleanup timers don't keep the Node.js process alive -- if all other work is done, the process exits without waiting for cleanup
5. **Double activity check**: Activity is checked both before and after cleanup, ensuring that a long cleanup operation doesn't block user-visible work

---

## Cross-Module Integration

### Cleanup <-> Settings (16_settings)

The `cleanupPeriodDays` setting controls all cleanup retention periods. The safety check in `runCleanup()` prevents cleanup from running if settings have validation errors and this setting was explicitly modified.

### Cleanup <-> Worktrees (26_background_agents)

Worktree cleanup is the most expensive operation (requires git operations). The `cleanupWorktrees()` function (`Fu8`) removes stale worktrees and reports the count via telemetry.

### Cleanup <-> Auto-Memory (87_auto_memory)

The periodic scheduler initializes auto-memory systems alongside cleanup. These share the same timer but serve different purposes -- cleanup removes old data while auto-memory extracts and preserves useful information.

### Cleanup <-> Shell Snapshots (separate lifecycle)

Shell snapshots are NOT managed by the periodic cleanup system. They use a per-session exit handler for immediate cleanup when the session ends. This is because snapshots must be available for the entire session duration but have no value afterward.
