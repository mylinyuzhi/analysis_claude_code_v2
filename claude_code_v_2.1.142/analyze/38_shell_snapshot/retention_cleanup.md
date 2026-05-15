# Retention Cleanup Sweep (NEW v2.1.117 → v2.1.142)

> Deep deobfuscation of the `cleanupPeriodDays` retention sweep that, since v2.1.117, also covers `~/.claude/shell-snapshots/`. Together with the graceful-shutdown `registerCleanup` hook, this ensures shell-snapshot files don't accumulate indefinitely from crashed sessions.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_shell_snapshot.md](../00_overview/symbol_additions_v2_1_142_shell_snapshot.md) - Unit 04 mappings

Key functions in this document:
- `cleanupShellSnapshots` (`al5`) — Sweep entry for shell-snapshots/ — cli_inner_pretty.js:555525
- `cleanupTasks` (`nl5`) — Sweep entry for tasks/ — cli_inner_pretty.js:555482
- `cleanupBackups` (`tl5`) — Sweep entry for backups/ — cli_inner_pretty.js:555605
- `cleanupByExtension` (`Rr`) — Shared directory walker that deletes by extension+age — cli_inner_pretty.js:555400
- `cleanupByMtime` (`Xd`) — File-level mtime check + unlink — cli_inner_pretty.js:555297
- `removeIfEmpty` (`c$H`) — `rmdir` if empty — cli_inner_pretty.js:555301
- `runRetentionCleanup` (`aB4`) — Top-level cleanup orchestrator — cli_inner_pretty.js:555633
- `getRetentionCutoff` (`l$H`) — Computes the mtime cutoff date from `cleanupPeriodDays` — cli_inner_pretty.js:555245
- `shouldRunCleanup` (`Bl5`) — Gate on `cleanupPeriodDays` setting validity — cli_inner_pretty.js:555226
- `DEFAULT_CLEANUP_DAYS` (`ml5`) — `30` days — cli_inner_pretty.js:555659
- `getClaudeConfigHomeDir` (`b8`) — Returns `~/.claude`

---

## 1. The Cleanup Chain

The top-level orchestrator `runRetentionCleanup` (`aB4`) calls each sweep in sequence:

```javascript
// ============================================
// runRetentionCleanup - Top-level cleanup orchestrator
// Location: cli_inner_pretty.js:555633-555657
// ============================================

// ORIGINAL (for source lookup):
async function aB4() {
  if ((await Pb4(), !Bl5())) return;
  (await Ul5(),    // error logs + mcp-logs-* dirs
    await Fl5(),   // ~/.claude/projects (.jsonl/.cast transcript files)
    await dl5(),   // ~/.claude/plans (.md files)
    await cl5(),   // ~/.claude/file-history
    await ll5(),   // ~/.claude/session-env
    await nl5(),   // ~/.claude/tasks         <-- v2.1.117 addition
    await il5(),   // ~/.claude/usage-data
    await rl5(),   // /tmp/cc-transcript-*.txt
    await el5(),   // ~/.claude/debug (.txt)
    await Hn5(),   // ~/.claude/feedback-bundles (.zip)
    await ol5(),   // ~/.claude/dump-prompts
    await al5(),   // ~/.claude/shell-snapshots <-- v2.1.117 addition
    await sl5(),   // ~/.claude/jobs + daemon dirs
    await tl5(),   // ~/.claude/backups        <-- v2.1.117 addition
    await gl5(),   // ~/.claude/hfi-auth.json
    await Ql5());  // ~/.claude/mcp-needs-auth-cache.json
  let H = l$H();
  if (H !== null) {
    await VuK(H);
    let $ = await yQ6(H);
    if ($ > 0) d("tengu_worktree_cleanup", { removed: $ });
  }
}

// READABLE (for understanding):
async function runRetentionCleanup() {
  await runPreCleanupHooks();                        // Pb4
  if (!shouldRunCleanup()) return;                    // Bl5 - guard

  // Series of sweeps; each one targets a specific directory pattern.
  await cleanupErrorLogs();                          // Ul5
  await cleanupTranscripts();                        // Fl5
  await cleanupPlans();                              // dl5
  await cleanupFileHistory();                        // cl5
  await cleanupSessionEnv();                         // ll5
  await cleanupTasks();                              // nl5  - NEW v2.1.117
  await cleanupUsageData();                          // il5
  await cleanupTmpTranscripts();                     // rl5
  await cleanupDebug();                              // el5
  await cleanupFeedbackBundles();                    // Hn5
  await cleanupDumpPrompts();                        // ol5
  await cleanupShellSnapshots();                     // al5  - NEW v2.1.117
  await cleanupJobsAndDaemon();                      // sl5
  await cleanupBackups();                            // tl5  - NEW v2.1.117
  await cleanupHfiAuth();                            // gl5
  await cleanupMcpNeedsAuth();                       // Ql5

  // Worktree cleanup is independent — uses the same cutoff
  const cutoff = getRetentionCutoff();
  if (cutoff !== null) {
    await cleanupWorktrees(cutoff);
    const removed = await pruneStaleWorktrees(cutoff);
    if (removed > 0) logEvent("tengu_worktree_cleanup", { removed });
  }
}

// Mapping: aB4→runRetentionCleanup, Pb4→runPreCleanupHooks, Bl5→shouldRunCleanup,
//          Ul5→cleanupErrorLogs, Fl5→cleanupTranscripts, dl5→cleanupPlans,
//          cl5→cleanupFileHistory, ll5→cleanupSessionEnv, nl5→cleanupTasks,
//          il5→cleanupUsageData, rl5→cleanupTmpTranscripts, el5→cleanupDebug,
//          Hn5→cleanupFeedbackBundles, ol5→cleanupDumpPrompts, al5→cleanupShellSnapshots,
//          sl5→cleanupJobsAndDaemon, tl5→cleanupBackups, gl5→cleanupHfiAuth,
//          Ql5→cleanupMcpNeedsAuth, l$H→getRetentionCutoff,
//          VuK→cleanupWorktrees, yQ6→pruneStaleWorktrees, d→logEvent
```

The v2.1.117 changelog item was: "The `cleanupPeriodDays` retention sweep now also covers `~/.claude/tasks/`, `~/.claude/shell-snapshots/`, and `~/.claude/backups/`". The three additions in the chain are `nl5` (tasks), `al5` (shell-snapshots), and `tl5` (backups).

---

## 2. The Shell-Snapshot Sweep: `cleanupShellSnapshots` (`al5`)

```javascript
// ============================================
// cleanupShellSnapshots - Sweep stale .sh files from ~/.claude/shell-snapshots/
// Location: cli_inner_pretty.js:555525-555527
// ============================================

// ORIGINAL (for source lookup):
function al5() {
  return Rr(XA.join(b8(), "shell-snapshots"), ".sh");
}

// READABLE (for understanding):
function cleanupShellSnapshots() {
  return cleanupByExtension(path.join(getClaudeConfigHomeDir(), "shell-snapshots"), ".sh");
}

// Mapping: al5→cleanupShellSnapshots, Rr→cleanupByExtension, b8→getClaudeConfigHomeDir,
//          XA→path
```

**What it does:** Calls the shared `cleanupByExtension` helper with the snapshots directory and the `.sh` file extension. The helper walks the directory, checks each `.sh` file's mtime against the configured cutoff, and unlinks files older than the cutoff.

**Why a thin wrapper:** The sweep logic is generic (walk dir, filter by extension, mtime-compare, unlink). Multiple sweeps reuse the same helper: plans (`.md`), debug (`.txt`), feedback-bundles (`.zip`), shell-snapshots (`.sh`), dump-prompts (`.jsonl`), jobs/* (`.json`). Each is a single-line wrapper that supplies the directory + extension.

The third argument to `Rr` defaults to `true` (means: rmdir the directory after sweep if empty). For shell-snapshots we accept the default — if all snapshots have been cleaned up, removing the empty directory is fine (it'll be recreated on the next session).

---

## 3. The Shared Walker: `cleanupByExtension` (`Rr`)

```javascript
// ============================================
// cleanupByExtension - Walk dir, delete files matching extension older than cutoff
// Location: cli_inner_pretty.js:555400-555421
// ============================================

// ORIGINAL (for source lookup):
async function Rr(H, $, q = !0, K) {
  let _ = l$H(K),
    A = { messages: 0, errors: 0 };
  if (_ === null) return A;
  let z = C$(), Y;
  try {
    Y = await z.readdir(H);
  } catch {
    return A;
  }
  for (let f of Y) {
    if (!f.isFile() || !f.name.endsWith($)) continue;
    try {
      if (await Xd(XA.join(H, f.name), _, z)) A.messages++;
    } catch {
      A.errors++;
    }
  }
  if (q) await c$H(H, z);
  return A;
}

// READABLE (for understanding):
async function cleanupByExtension(dir, extension, removeEmptyDir = true, capDays) {
  const cutoff = getRetentionCutoff(capDays);                     // l$H
  const result = { messages: 0, errors: 0 };
  if (cutoff === null) return result;     // cleanup disabled (cleanupPeriodDays=0)

  const fs = getFsImplementation();                                // C$
  let entries;
  try {
    entries = await fs.readdir(dir);
  } catch {
    return result;                          // dir doesn't exist; nothing to do
  }

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(extension)) continue;
    try {
      if (await cleanupByMtime(path.join(dir, entry.name), cutoff, fs)) {   // Xd
        result.messages++;
      }
    } catch {
      result.errors++;
    }
  }
  if (removeEmptyDir) await removeIfEmpty(dir, fs);                // c$H
  return result;
}

// Mapping: Rr→cleanupByExtension, H→dir, $→extension, q→removeEmptyDir, K→capDays,
//          _→cutoff, A→result, z→fs, Y→entries, f→entry,
//          l$H→getRetentionCutoff, C$→getFsImplementation, Xd→cleanupByMtime,
//          c$H→removeIfEmpty, XA→path
```

**Step-by-step:**

1. **Cutoff computation:** `getRetentionCutoff(capDays)` returns a `Date` representing the mtime cutoff. Files with `mtime < cutoff` are considered stale. Returns `null` if cleanup is disabled.
2. **Initialise counters:** `{ messages: 0, errors: 0 }` — `messages` counts successful deletes, `errors` counts failures.
3. **Directory enumeration:** `readdir` with `withFileTypes` (implied by the `.isFile()` check) returns `Dirent` objects. If the directory doesn't exist, the function returns empty results — first-run installs have no `~/.claude/shell-snapshots/` directory to clean.
4. **Iterate entries:** For each entry, skip non-files and non-matching extensions. Pass the path to `cleanupByMtime`, which does the age check and unlink.
5. **Empty-dir removal:** If `removeEmptyDir` (default `true`), call `removeIfEmpty(dir, fs)` after the loop. This `rmdir`s the directory only if it's empty.
6. **Return counts:** The caller can aggregate counts across sweeps for telemetry.

**Why `withFileTypes` (the `.isFile()` check):** modern Node's `fs.readdir(path, { withFileTypes: true })` returns `Dirent` objects that include `.isFile()` and `.isDirectory()` methods. This avoids a separate `stat` call per entry, making the sweep O(N) reads instead of O(2N).

---

## 4. The File-Level Check: `cleanupByMtime` (`Xd`)

```javascript
// ============================================
// cleanupByMtime - Check file mtime and delete if older than cutoff
// Location: cli_inner_pretty.js:555297-555300
// ============================================

// ORIGINAL (for source lookup):
async function Xd(H, $, q) {
  if ((await q.stat(H)).mtime < $) return (await q.unlink(H), !0);
  return !1;
}

// READABLE (for understanding):
async function cleanupByMtime(filePath, cutoffDate, fs) {
  const { mtime } = await fs.stat(filePath);
  if (mtime < cutoffDate) {
    await fs.unlink(filePath);
    return true;        // deleted
  }
  return false;         // kept
}

// Mapping: Xd→cleanupByMtime, H→filePath, $→cutoffDate, q→fs
```

**Why use `mtime` not `birthtime`?**

- `mtime` (modification time) is reliably set by every filesystem on every write.
- `birthtime` (creation time) is only available on some filesystems (Linux ext4 has it; many tmpfs implementations don't; Windows NTFS does).
- The snapshot file is never modified after creation, so for our use case `mtime == birthtime`. But using `mtime` makes the sweep portable.

**Race-condition safety:** The `stat` → `unlink` window allows two race conditions:
1. File deleted between stat and unlink: unlink throws ENOENT, caught by the calling `try`/`catch` in `cleanupByExtension`, counted as `result.errors++`.
2. File modified (mtime updated) between stat and unlink: unlikely for snapshot files (immutable after creation), but for transcripts and other live files, the rare loss is acceptable.

There's no `flock` / advisory locking. If two `runRetentionCleanup` calls overlap (e.g., from two simultaneous Claude sessions), they both try to unlink the same file; one wins, the other gets ENOENT and increments `errors`. Counts may be slightly inflated but no data loss.

---

## 5. Computing the Cutoff: `getRetentionCutoff` (`l$H`)

```javascript
// ============================================
// getRetentionCutoff - Compute mtime cutoff Date from cleanupPeriodDays
// Location: cli_inner_pretty.js:555245-555251
// ============================================

// ORIGINAL (for source lookup):
function l$H(H) {
  let q = (Oq() || {}).cleanupPeriodDays ?? ml5;
  if (q === 0) return null;
  if (H !== void 0 && H < q) q = H;
  let K = q * 24 * 60 * 60 * 1000;
  return new Date(Date.now() - K);
}

// READABLE (for understanding):
function getRetentionCutoff(capDays) {
  const configuredDays = (getEffectiveConfig() || {}).cleanupPeriodDays ?? DEFAULT_CLEANUP_DAYS;
  if (configuredDays === 0) return null;       // 0 = disabled
  let days = configuredDays;
  if (capDays !== undefined && capDays < days) days = capDays;
  const millis = days * 24 * 60 * 60 * 1000;
  return new Date(Date.now() - millis);
}

// Mapping: l$H→getRetentionCutoff, H→capDays, q→days/configuredDays, K→millis,
//          Oq→getEffectiveConfig, ml5→DEFAULT_CLEANUP_DAYS (30)
```

**The `cleanupPeriodDays` setting:**

| Source | Default | Why |
|--------|---------|-----|
| `~/.claude/settings.json` | `30` | User-configurable globally |
| `policySettings` | overrides | Enterprise/admin can pin a value |
| `--cleanup-period-days <N>` | overrides | CLI flag |
| Per-sweep cap (`H` argument) | `min(configured, cap)` | A specific sweep can request a tighter cutoff |

**Why `configuredDays === 0` → null:**

Setting `cleanupPeriodDays: 0` disables retention entirely. The settings schema (cli_inner_pretty.js:51141) explicitly rejects 0 with the error: "cleanupPeriodDays must be at least 1. To keep transcripts for a long time, set a large number (e.g. 3650 for ~10 years). To disable transcript writes entirely, remove this setting and use the --no-session-persistence CLI flag or the SDK persistSession:false option instead."

So in practice, valid values are `>= 1` (or unset, which defaults to 30). The `=== 0` branch exists for backward-compatibility with old configs that set 0 to mean "disable".

**The per-sweep cap:**

Used by, e.g., `cleanupTmpTranscripts` (`rl5`) which might want a tighter cap. The shell-snapshots sweep doesn't use a cap — it gets the full configured value.

---

## 6. Gating: `shouldRunCleanup` (`Bl5`)

```javascript
// ============================================
// shouldRunCleanup - Decide whether to run any cleanup at all
// Location: cli_inner_pretty.js:555226-555244
// ============================================

// ORIGINAL (for source lookup):
function Bl5() {
  if (!cO("userSettings") && Oq()?.cleanupPeriodDays === void 0)
    return (N("Skipping retention cleanup: userSettings source is disabled (--setting-sources) and no enabled source provides cleanupPeriodDays."), !1);
  if (v8("policySettings")?.cleanupPeriodDays !== void 0) return !0;
  let { errors: H } = HHH();
  if (H.length > 0 && Cm8("cleanupPeriodDays"))
    return (N("Skipping cleanup: settings have validation errors but cleanupPeriodDays was explicitly set. Fix settings errors to enable cleanup."), !1);
  return !0;
}

// READABLE (for understanding):
function shouldRunCleanup() {
  // If userSettings is disabled AND no other source provides cleanupPeriodDays, skip
  if (!isSettingSourceEnabled("userSettings") && getEffectiveConfig()?.cleanupPeriodDays === undefined) {
    debugLog("Skipping retention cleanup: userSettings source is disabled (--setting-sources) and no enabled source provides cleanupPeriodDays.");
    return false;
  }
  // Policy settings explicitly set: run regardless of validation state
  if (getRawSettings("policySettings")?.cleanupPeriodDays !== undefined) return true;
  // If settings have validation errors AND cleanupPeriodDays was explicitly set anywhere, skip
  const { errors } = getSettingsValidationErrors();
  if (errors.length > 0 && isSettingExplicitlySet("cleanupPeriodDays")) {
    debugLog("Skipping cleanup: settings have validation errors but cleanupPeriodDays was explicitly set. Fix settings errors to enable cleanup.");
    return false;
  }
  return true;
}

// Mapping: Bl5→shouldRunCleanup, cO→isSettingSourceEnabled, Oq→getEffectiveConfig,
//          v8→getRawSettings, HHH→getSettingsValidationErrors,
//          Cm8→isSettingExplicitlySet, N→debugLog
```

**Three skip conditions:**

| Condition | Why skip |
|-----------|----------|
| `userSettings` source disabled AND no other source provides `cleanupPeriodDays` | User explicitly opted out of userSettings; we shouldn't act on defaults |
| Policy settings explicitly set | Always run — admin wants this enforced |
| Settings have validation errors AND `cleanupPeriodDays` is explicitly set | Validation broke; user might have typo'd the value to something dangerous — refuse to act |

The validation-error skip is defensive: if `cleanupPeriodDays` is misconfigured (e.g., negative, non-numeric), running cleanup could be destructive. Better to surface the error and let the user fix it.

---

## 7. Cleanup Schedule

When does `runRetentionCleanup` (`aB4`) actually fire? The function is called from session startup (after init, before the first model call), but only after a debounce check — the actual call site is gated to avoid running on every session.

The intended cadence is "once per day per machine". The implementation details (which I haven't drilled into here — the call site for `aB4` lives in init.ts) compare `lastCleanupTimestamp` against `Date.now()` and only run if 24+ hours have passed. If you start 50 sessions in one day, only the first runs the sweep.

---

## 8. Why the v2.1.117 Additions Specifically

Before v2.1.117, the cleanup sweep covered:
- Transcripts (`projects/`)
- Plans (`plans/`)
- File history (`file-history/`)
- Session env (`session-env/`)
- Usage data (`usage-data/`)
- Tmp transcripts (`/tmp/cc-transcript-*`)
- Debug logs (`debug/`)
- Feedback bundles (`feedback-bundles/`)
- Dump prompts (`dump-prompts/`)
- Jobs and daemon (`jobs/`, `daemon/`)
- HFI auth (`hfi-auth.json`)
- MCP cache (`mcp-needs-auth-cache.json`)

The v2.1.117 release added three more directories: `tasks/`, `shell-snapshots/`, and `backups/`. Why these specifically?

| Directory | Why it accumulates | Why v2.1.117 |
|-----------|-------------------|--------------|
| `tasks/` | Background-task state files persist across daemon restarts | Background-agent feature growth in v2.1.11x made this leak material |
| `shell-snapshots/` | Crashed sessions leak their snapshot file (kill -9, OOM, OS reboot) | The graceful-shutdown `registerCleanup` only fires on clean exits; long-running sessions accumulate these |
| `backups/` | `backup/` files from various rewind/checkpoint features | Rewind/checkpoint became more aggressive about creating backups |

For shell-snapshots specifically, the typical leak pattern is:
- User starts a session
- `createAndSaveSnapshot` creates `snapshot-zsh-1234567890-abcdef.sh` (≈ 5-50 KB depending on user's `.zshrc`)
- `registerCleanup` queues the unlink callback
- Something crashes Claude Code before clean shutdown:
  - User hits `kill -9 $(pgrep claude)`
  - System OOM-kills claude
  - OS reboot
  - Node process crashes (rare but possible)
- The unlink callback never fires → file remains in `~/.claude/shell-snapshots/`
- Over months, this could accumulate hundreds of stale files (5-50 KB × hundreds = MBs)

With the v2.1.117 sweep, files older than the configured `cleanupPeriodDays` (default 30) are deleted on the next session startup.

**Why 30 days as the default:** balances "user might want to inspect why a recent session's snapshot was weird" against "we don't want unbounded growth". For users who run claude rarely, 30 days might mean their snapshots disappear between sessions — but that's fine, snapshots are session-scoped and regenerate on each session start.

---

## 9. Interaction with `registerCleanup` Hook

The two mechanisms cooperate:

| Mechanism | Fires when | Targets | Tradeoff |
|-----------|-----------|---------|----------|
| `registerCleanup(CK)` callback | On clean process exit (SIGINT, normal exit, etc.) | The current session's specific snapshot file | Fast (single unlink); only fires on graceful shutdown |
| `cleanupShellSnapshots` (`al5`) sweep | On session startup (once per day, after `shouldRunCleanup` check) | All `.sh` files older than `cleanupPeriodDays` | Slower (walks the whole directory); catches files from crashed sessions |

The two are complementary:
- 99% of sessions exit cleanly → the registerCleanup hook removes their snapshot immediately.
- The 1% of sessions that crash leave their snapshot behind. The next day's first session sweeps them up.
- The user never sees stale snapshots accumulating in their home directory.

---

## 10. Telemetry

The cleanup sweeps return `{ messages: N, errors: M }` per directory. These counts are aggregated by the caller and (sometimes) emitted as telemetry events:

| Event | Trigger |
|-------|---------|
| `tengu_worktree_cleanup` | `pruneStaleWorktrees` deleted some worktrees |
| (no event for shell-snapshots) | Per-sweep counts are not emitted; only the total worktree count |

The lack of per-sweep telemetry is intentional — these are housekeeping operations, not user-visible actions. Aggregate "did cleanup happen" is enough; per-file counts would just create telemetry noise.

---

## 11. Edge Cases

### 11.1 First-run install

The first time Claude Code starts on a system, `~/.claude/shell-snapshots/` doesn't exist. `cleanupByExtension`'s `readdir` throws ENOENT, caught, returns `{ messages: 0, errors: 0 }`. No-op.

### 11.2 Directory full of non-`.sh` files

If something else has populated `~/.claude/shell-snapshots/` with non-`.sh` files (shouldn't happen, but defensively): the `!entry.name.endsWith(".sh")` filter skips them. Only `.sh` files are touched.

### 11.3 Active session's snapshot age

A session that's been running for 31 days (with `cleanupPeriodDays: 30`) has a snapshot file that's 31 days old. The next sweep would consider it stale and delete it.

This is **intentional**: the sweep runs at session startup, before the snapshot is consumed. By the time the sweep deletes the old snapshot, the new session's `createBashShellProvider` has already kicked off a fresh `createAndSaveSnapshot` that's writing a new file. There's a brief window where the old file is gone and the new one isn't ready yet, but it's covered by the per-command `fs.access` fallback to login shell mode (see [bash_tool_integration.md](./bash_tool_integration.md) Section 5).

### 11.4 Permissions error

If Claude Code can't unlink a file (filesystem permissions, antivirus quarantine), `cleanupByMtime` throws, caught by the `try`/`catch` in `cleanupByExtension`, and `result.errors++`. The sweep continues with the next file.

### 11.5 `cleanupPeriodDays` set to a very small value

Setting `cleanupPeriodDays: 1` means snapshots older than 1 day are swept. For a user who runs claude every few days, this could mean every session sweeps the previous session's snapshot. Slightly wasteful but harmless — snapshots regenerate on demand.

The minimum allowed value is 1 (enforced by the settings schema). Setting it to 0 is rejected.

---

## 12. Decision Summary

| Decision | Choice | Why |
|----------|--------|-----|
| Where to put cleanup logic | Shared `cleanupByExtension` helper | Reuse across many sweeps |
| What to delete | Files matching extension + mtime older than cutoff | Simple, predictable, portable |
| What NOT to delete | Subdirectories (only files) | Snapshots are flat; subdirs would be unexpected |
| Empty-dir removal | Yes, by default | Avoids accumulating empty dirs |
| Failure handling | Count errors, continue sweep | One unlink failure shouldn't block others |
| Race-condition handling | None (best effort) | Snapshots are session-scoped; loss is acceptable |
| Telemetry per sweep | None (only aggregate worktree event) | Housekeeping operations don't need user-facing telemetry |
| Default `cleanupPeriodDays` | 30 days | Balance "keep recent for debugging" vs "don't accumulate forever" |
| Mtime vs birthtime | mtime | More portable across filesystems |
| Sweep order | Defined sequence in `runRetentionCleanup` | Deterministic; easier to reason about |

---

## 13. Cross-version diff (v2.1.112 → v2.1.142)

The cleanup sweep itself didn't exist in v2.1.112 (it's the v2.1.117 addition). The v2.1.112 docs noted:

> Side effect: Snapshots from sessions that crashed without firing cleanup hooks (kill -9, OS reboot, OOM) will pile up over time. Claude Code doesn't currently sweep stale entries; users can manually clean them.

v2.1.117 → v2.1.142 introduced `al5` as part of the broader retention cleanup, addressing exactly that side effect.

---

## 14. Cross-reference

- [implementation.md](./implementation.md) Section 5 — the per-session `registerCleanup` hook (graceful shutdown)
- [snapshot_creation.md](./snapshot_creation.md) Section 1 — where `registerCleanup` is wired in
- [bash_tool_integration.md](./bash_tool_integration.md) Section 5 — the fs.access fallback that handles "snapshot was just swept"
