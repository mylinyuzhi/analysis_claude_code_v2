# Retention Sweep + Cleanup + project purge Surface (v2.1.156)

> Deep deobfuscation of the two paths that keep `~/.claude/shell-snapshots/` from leaking. **(1)** Per-session graceful cleanup: the `registerCleanup` (`$7`) callback baked into `createAndSaveSnapshot` (`js7`) `unlink`s this session's `.sh` file on clean shutdown (`cli_inner_pretty.js:341240-341246`). **(2)** The `cleanupPeriodDays` retention sweep that catches orphaned snapshots from crashed sessions: `Qvz` calls the shared by-extension directory walker `QC(join(getClaudeConfigHomeDir(),"shell-snapshots"),".sh")` (`cli_inner_pretty.js:588102-588104`), gated by `kvz` (`cli_inner_pretty.js:587763-587781`) and bounded by the `cs` cutoff (default 30 days, `cli_inner_pretty.js:587782-587788`, `vvz=30` at `588275`). **(3)** The `claude project purge` UI surface — the ONLY end-user-visible mention of the directory — emits *"shell-snapshots/ are not project-scoped and will not be touched"* from `RBz` (`cli_inner_pretty.js:642571-642572`) and `IBz` (`cli_inner_pretty.js:642598-642599`). Headline 2.1.156 facts: the mechanism is **structurally identical** to the v2.1.142 `al5`/`Rr` flow (the obfuscated names rotated `al5→Qvz`, `Rr→QC`, `Xd→Lm`, `c$H→Xm`, `l$H→cs`, `Bl5→kvz`, `aB4→Iz9`); the purge warning surface is the only thing that is genuinely new relative to the v2.1.142 reference doc's coverage.

---

## 1. Two complementary cleanup paths

A shell snapshot is a per-session, ephemeral artifact: `createAndSaveSnapshot` (`js7`) writes `snapshot-${shellType}-${Date.now()}-${rand6}.sh` into `join(getClaudeConfigHomeDir(),"shell-snapshots")` (`cli_inner_pretty.js:341180-341182`). Each file is 5–50 KB depending on the user's `.zshrc`/`.bashrc`. Two independent mechanisms reclaim them:

| Path | Trigger | Scope | Cost | Catches |
|------|---------|-------|------|---------|
| `registerCleanup` (`$7`) callback in `js7` | Clean process exit (SIGINT, normal exit) | This session's one file | One `unlink` | The 99% graceful-exit case |
| `Qvz` → `QC` retention sweep | Session startup, after `kvz` gate passes | All `.sh` older than cutoff | Full directory walk | Files leaked by `kill -9` / OOM / reboot crashes |

The split exists because a single shutdown hook **cannot** reclaim files from a process that was hard-killed before its hooks ran. The sweep is the backstop; the hook is the fast common path. Neither is sufficient alone, and together they bound directory growth.

---

## 2. Per-session graceful cleanup: the `registerCleanup` callback

When the snapshot `execFile` succeeds and `stat(f).size` confirms a non-empty file (`cli_inner_pretty.js:341234-341238`), `js7` registers an async cleanup callback before resolving the snapshot path:

```javascript
// ============================================
// registerCleanup callback in createAndSaveSnapshot - unlink this session's snapshot on shutdown
// Location: cli_inner_pretty.js:341238-341247
// ============================================

// ORIGINAL (for source lookup):
                  if (D !== void 0)
                    (N(`Shell snapshot created successfully (${D} bytes)`),
                      $7(async () => {
                        try {
                          (await U$().unlink(f), N(`Cleaned up session snapshot: ${f}`));
                        } catch (J) {
                          N(`Error cleaning up session snapshot: ${J}`);
                        }
                      }),
                      q(f));

// READABLE (for understanding):
                  if (snapshotSize !== undefined) {
                    logForDebugging(`Shell snapshot created successfully (${snapshotSize} bytes)`);
                    registerCleanup(async () => {                       // $7
                      try {
                        await getFsImplementation().unlink(snapshotFilePath);   // U$().unlink(f)
                        logForDebugging(`Cleaned up session snapshot: ${snapshotFilePath}`);
                      } catch (err) {
                        logForDebugging(`Error cleaning up session snapshot: ${err}`);
                      }
                    });
                    resolve(snapshotFilePath);                          // q(f)
                  }

// Mapping: $7->registerCleanup, U$->getFsImplementation, f->snapshotFilePath,
//          D->snapshotSize, N->logForDebugging, q->resolve, J->err
```

**What it does:** Queues a teardown closure on the global cleanup registry that `unlink`s exactly this session's snapshot file via the abstracted `getFsImplementation()` (`U$`) layer.

**How it works (step-by-step):**
1. The callback only registers on the success branch — after `stat(f)` returns a defined `size` (`cli_inner_pretty.js:341236-341238`). A snapshot that failed to materialize has nothing to clean up; that branch instead emits `tengu_shell_unknown_error` (`cli_inner_pretty.js:341257`).
2. The closure captures `f` (the absolute snapshot path, `join(claudeHome,"shell-snapshots", snapshot-…sh)`) by lexical scope. There is no path recomputation at exit time — the exact file written is the exact file removed.
3. `getFsImplementation()` (`U$`) is used rather than a bare `fs.unlink` so the operation routes through Claude Code's filesystem abstraction (the same accessor the sweep uses, see §5). This keeps the per-session and retention paths consistent.
4. The `try/catch` swallows errors to `logForDebugging` (`N`) only. A failed unlink at shutdown must never block process exit or surface a stack trace to the user — if the file is already gone (e.g., the retention sweep beat it, or the disk is read-only), that is a no-op, not an error worth escalating.

**Why this approach (rationale + trade-offs):**
- **Registry over `process.on('exit')`:** `registerCleanup` (`$7`) is a centralized async-capable registry. A raw `process.on('exit')` handler cannot `await` async fs calls; the registry runs the cleanup queue during the orderly SIGINT/shutdown sequence where awaiting is allowed. The trade-off: it only fires on *graceful* shutdown — which is precisely why path (2) exists.
- **Per-file vs directory scan:** The hook unlinks one known path — O(1), no `readdir`. It deliberately does **not** sweep the directory, because doing a directory walk at every clean exit would be wasteful and would race with other live sessions' files.

**Key insight:** This callback is *identical in shape* to the v2.1.88 clean TypeScript (`/lyz/codespace/3rd/claude-code/src/utils/bash/ShellSnapshot.ts:534-545`), which also calls `registerCleanup(async () => { await getFsImplementation().unlink(shellSnapshotPath) … })`. The graceful-cleanup mechanism has not changed since v2.1.88; only the obfuscated identifiers rotated.

---

## 3. The retention sweep entry: `Qvz` (shell-snapshots sweep)

The sweep is one entry in a long chain of per-directory housekeeping sweeps. The shell-snapshots entry is a thin wrapper:

```javascript
// ============================================
// Qvz (cleanupShellSnapshots) - sweep stale .sh files from ~/.claude/shell-snapshots
// Location: cli_inner_pretty.js:588102-588104
// ============================================

// ORIGINAL (for source lookup):
function Qvz() {
  return QC(q5.join(l8(), "shell-snapshots"), ".sh");
}

// READABLE (for understanding):
function cleanupShellSnapshots() {                                  // Qvz
  // Delegates to the shared by-extension walker with the snapshots dir + ".sh" filter.
  // q (removeEmptyDir) defaults to true; K (capDays) is omitted -> full configured cutoff.
  return cleanupByExtension(path.join(getClaudeConfigHomeDir(), "shell-snapshots"), ".sh");
}

// Mapping: Qvz->cleanupShellSnapshots, QC->cleanupByExtension, q5->path,
//          l8->getClaudeConfigHomeDir
```

**What it does:** Supplies the snapshots directory and the `.sh` extension to the generic `QC` walker (§5). It is the 2.1.156 successor to v2.1.142's `cleanupShellSnapshots` (`al5`), which was `Rr(XA.join(b8(),"shell-snapshots"),".sh")` — semantically the same call, with `al5→Qvz`, `Rr→QC`, `b8→l8`, `XA→q5`.

**Why a thin wrapper:** The walk-filter-mtime-unlink logic is generic and reused by ~20 sweeps (telemetry `.json` `Uvz` at `588096`, dump-prompts `.jsonl` `Fvz` at `588099`, hfi-auth `hvz` at `587985`, etc.). Each is a one-liner supplying `(dir, extension[, removeEmptyDir, capDays])`. Centralizing the walker means a single, audited deletion path.

**`removeEmptyDir` defaults to `true`:** `Qvz` omits the third argument, so after the sweep, if the directory is empty, `QC` `rmdir`s it (via `Xm`, §5). For shell-snapshots this is safe: an empty directory is recreated by `js7`'s `mkdir(dir,{recursive:true})` (`cli_inner_pretty.js:341183`) on the next session.

---

## 4. The orchestrator and the gate: `Iz9` + `kvz`

`Qvz` is invoked from the top-level retention orchestrator `Iz9`, but only after the `kvz` gate passes:

```javascript
// ============================================
// Iz9 (runRetentionCleanup) - top-level cleanup orchestrator; Qvz is the shell-snapshots sweep
// Location: cli_inner_pretty.js:588243-588273
// ============================================

// ORIGINAL (for source lookup):
async function Iz9() {
  if ((await d19(), !kvz())) return;
  (await Evz(),
    await yvz(),
    ...
    await Fvz(),
    await Qvz(),            // <-- shell-snapshots sweep
    await gvz(),
    ...
    await ivz());
  let H = cs();
  if (H !== null) {
    await reK(H);
    let $ = await QKq(H);
    if ($ > 0) d("tengu_worktree_cleanup", { removed: $ });
  }
}

// READABLE (for understanding):
async function runRetentionCleanup() {                              // Iz9
  await runPreCleanupHooks();                                       // d19
  if (!shouldRunCleanup()) return;                                  // kvz - the gate

  // Sequential per-directory sweeps (each targets one dir + extension).
  await cleanupErrorLogs();                                         // Evz
  await cleanupProjects();                                          // yvz
  // ... (telemetry, dump-prompts, etc.) ...
  await cleanupDumpPrompts();                                       // Fvz
  await cleanupShellSnapshots();                                    // Qvz  <-- this doc
  await cleanupJobsAndDaemon();                                     // gvz
  // ...
  await cleanupMcpNeedsAuth();                                      // ivz

  // Worktree cleanup shares the same cutoff.
  const cutoff = getRetentionCutoff();                             // cs
  if (cutoff !== null) {
    await cleanupWorktrees(cutoff);                                // reK
    const removed = await pruneStaleWorktrees(cutoff);            // QKq
    if (removed > 0) logEvent("tengu_worktree_cleanup", { removed });   // d
  }
}

// Mapping: Iz9->runRetentionCleanup, d19->runPreCleanupHooks, kvz->shouldRunCleanup,
//          Qvz->cleanupShellSnapshots, cs->getRetentionCutoff, reK->cleanupWorktrees,
//          QKq->pruneStaleWorktrees, d->logEvent
```

This is the structural twin of v2.1.142's `runRetentionCleanup` (`aB4`): the same gate-then-sweep-chain-then-worktree shape, with `aB4→Iz9`, `Bl5→kvz`, `al5→Qvz`, `l$H→cs`. The shell-snapshots sweep sits at the same logical position in the chain.

### 4.1 The gate: `kvz` (shouldRunCleanup)

```javascript
// ============================================
// kvz (shouldRunCleanup) - decide whether any retention sweep runs at all
// Location: cli_inner_pretty.js:587763-587781
// ============================================

// ORIGINAL (for source lookup):
function kvz() {
  if (!wO("userSettings") && Xq()?.cleanupPeriodDays === void 0)
    return (
      N("Skipping retention cleanup: userSettings source is disabled (--setting-sources) and no enabled source provides cleanupPeriodDays."),
      !1
    );
  if (S8("policySettings")?.cleanupPeriodDays !== void 0) return !0;
  let { errors: H } = W6H();
  if (H.length > 0 && Fo8("cleanupPeriodDays"))
    return (
      N("Skipping cleanup: settings have validation errors but cleanupPeriodDays was explicitly set. Fix settings errors to enable cleanup."),
      !1
    );
  return !0;
}

// READABLE (for understanding):
function shouldRunCleanup() {                                       // kvz
  // (1) userSettings source disabled AND no enabled source provides cleanupPeriodDays -> skip
  if (!isSettingSourceEnabled("userSettings") && getEffectiveConfig()?.cleanupPeriodDays === undefined) {
    debugLog("Skipping retention cleanup: userSettings source is disabled (--setting-sources) and no enabled source provides cleanupPeriodDays.");
    return false;
  }
  // (2) policySettings explicitly set cleanupPeriodDays -> always run (admin enforced)
  if (getRawSettings("policySettings")?.cleanupPeriodDays !== undefined) return true;
  // (3) settings have validation errors AND cleanupPeriodDays explicitly set anywhere -> skip (defensive)
  const { errors } = getSettingsValidationErrors();
  if (errors.length > 0 && isSettingExplicitlySet("cleanupPeriodDays")) {
    debugLog("Skipping cleanup: settings have validation errors but cleanupPeriodDays was explicitly set. Fix settings errors to enable cleanup.");
    return false;
  }
  return true;
}

// Mapping: kvz->shouldRunCleanup, wO->isSettingSourceEnabled, Xq->getEffectiveConfig,
//          S8->getRawSettings, W6H->getSettingsValidationErrors,
//          Fo8->isSettingExplicitlySet, N->debugLog
```

**How it works (three skip conditions):**

1. **`userSettings` disabled and no source supplies the value** (`cli_inner_pretty.js:587764-587770`): if the user ran with `--setting-sources` that excludes `userSettings`, and no other enabled source defines `cleanupPeriodDays`, the gate refuses to act on the default. Acting on a default the user explicitly opted out of would be surprising file deletion.
2. **`policySettings` explicitly set** (`cli_inner_pretty.js:587771`): an enterprise/admin pin short-circuits to `return true` — cleanup runs regardless of any user-side validation state. The admin's intent wins.
3. **Validation errors + explicit setting** (`cli_inner_pretty.js:587772-587779`): if settings have validation errors AND `cleanupPeriodDays` was explicitly set somewhere, skip. The rationale is defensive: a misconfigured value (negative, non-numeric, typo) could turn cleanup destructive. Better to surface the error and demand a fix than to delete files based on a broken config.

**Why this matters for shell-snapshots:** Because `Qvz` is downstream of this single gate, all three policy/validation guards apply uniformly. There is no snapshot-specific gating — the snapshots directory inherits the same global cleanup discipline as transcripts, plans, and tasks.

### 4.2 The cutoff: `cs` (getRetentionCutoff)

```javascript
// ============================================
// cs (getRetentionCutoff) - compute the mtime cutoff Date from cleanupPeriodDays
// Location: cli_inner_pretty.js:587782-587788  (default vvz=30 at 588275)
// ============================================

// ORIGINAL (for source lookup):
function cs(H) {
  let q = (Xq() || {}).cleanupPeriodDays ?? vvz;
  if (q === 0) return null;
  if (H !== void 0 && H < q) q = H;
  let K = q * 24 * 60 * 60 * 1000;
  return new Date(Date.now() - K);
}

// READABLE (for understanding):
function getRetentionCutoff(capDays) {                              // cs
  const configuredDays = (getEffectiveConfig() || {}).cleanupPeriodDays ?? DEFAULT_CLEANUP_DAYS; // vvz = 30
  if (configuredDays === 0) return null;          // 0 => retention disabled entirely
  let days = configuredDays;
  if (capDays !== undefined && capDays < days) days = capDays;     // per-sweep tighter cap
  const millis = days * 24 * 60 * 60 * 1000;
  return new Date(Date.now() - millis);           // files with mtime < this are stale
}

// Mapping: cs->getRetentionCutoff, H->capDays, q->days/configuredDays, K->millis,
//          Xq->getEffectiveConfig, vvz->DEFAULT_CLEANUP_DAYS (30)
```

**What it does:** Resolves the effective `cleanupPeriodDays` (config value, else the `vvz=30` default at `cli_inner_pretty.js:588275`) into a `Date` cutoff. Files older than this Date are deleted.

**How it works:**
- `cleanupPeriodDays === 0` → returns `null`, which every sweep treats as "do nothing" (see `QC`'s early return, §5). This is the explicit disable path.
- The optional `capDays` (`H`) argument lets an individual sweep request a *tighter* cutoff (`min(configured, cap)`). `Qvz` does **not** pass a cap — shell-snapshots get the full configured retention. (Contrast dump-prompts `Fvz` at `588100`, which passes `Tz9` as a cap.)
- `vvz=30` is the default: 30 days balances "a user might want to inspect a recent session's snapshot for debugging" against "don't accumulate forever". Snapshots regenerate per session, so even aggressive sweeping is harmless to functionality.

This is byte-for-byte the same logic as v2.1.142's `getRetentionCutoff` (`l$H`), with `l$H→cs`, `Oq→Xq`, `ml5→vvz`. The default remained 30.

---

## 5. The shared walker: `QC` → `Lm` → `Xm`

`Qvz` delegates to the generic by-extension walker `QC`, which is the same shared directory walker that handles every extension-filtered sweep:

```javascript
// ============================================
// QC (cleanupByExtension) - walk dir, unlink files matching extension older than cutoff
// Location: cli_inner_pretty.js:587963-587984
// ============================================

// ORIGINAL (for source lookup):
async function QC(H, $, q = !0, K) {
  let _ = cs(K),
    z = { messages: 0, errors: 0 };
  if (_ === null) return z;
  let A = U$(),
    Y;
  try {
    Y = await A.readdir(H);
  } catch {
    return z;
  }
  for (let f of Y) {
    if (!f.isFile() || !f.name.endsWith($)) continue;
    try {
      if (await Lm(q5.join(H, f.name), _, A)) z.messages++;
    } catch {
      z.errors++;
    }
  }
  if (q) await Xm(H, A);
  return z;
}

// READABLE (for understanding):
async function cleanupByExtension(dir, extension, removeEmptyDir = true, capDays) {  // QC
  const cutoff = getRetentionCutoff(capDays);                       // cs
  const result = { messages: 0, errors: 0 };
  if (cutoff === null) return result;             // retention disabled -> no-op

  const fs = getFsImplementation();                                // U$
  let entries;
  try {
    entries = await fs.readdir(dir);              // withFileTypes implied by .isFile()
  } catch {
    return result;                                 // dir doesn't exist (first run) -> no-op
  }

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(extension)) continue;   // .sh filter
    try {
      if (await cleanupByMtime(path.join(dir, entry.name), cutoff, fs)) result.messages++; // Lm
    } catch {
      result.errors++;
    }
  }
  if (removeEmptyDir) await removeIfEmpty(dir, fs);                // Xm
  return result;
}

// Mapping: QC->cleanupByExtension, H->dir, $->extension, q->removeEmptyDir, K->capDays,
//          _->cutoff, z->result, A->fs, Y->entries, f->entry,
//          cs->getRetentionCutoff, U$->getFsImplementation, Lm->cleanupByMtime,
//          Xm->removeIfEmpty, q5->path
```

**Step-by-step (the directory walk):**
1. **Cutoff first** (`cli_inner_pretty.js:587964-587966`): compute the cutoff via `cs(capDays)`. If `null` (retention disabled), return `{messages:0,errors:0}` immediately — the walk never touches the filesystem.
2. **`readdir` with file types** (`cli_inner_pretty.js:587967-587973`): `U$().readdir(dir)` returns `Dirent` objects; the `.isFile()` check downstream proves `withFileTypes:true`. If the directory does not exist (`ENOENT` on a first-run install with no `~/.claude/shell-snapshots/`), the `catch` returns empty results — a clean no-op.
3. **Per-entry filter** (`cli_inner_pretty.js:587974-587975`): skip anything that is not a regular file, and anything whose name does not end with the `.sh` extension. Subdirectories and stray non-`.sh` files are left untouched. This is why a corrupted or unexpected file in the snapshots dir is never deleted.
4. **Age check + unlink** (`cli_inner_pretty.js:587976-587980`): delegate each candidate to `Lm` (mtime check + unlink). A successful delete increments `messages`; any thrown error (e.g., a concurrent unlink racing) increments `errors` and the loop continues.
5. **Empty-dir removal** (`cli_inner_pretty.js:587982`): if `removeEmptyDir` (default `true`, which `Qvz` accepts), call `Xm` to `rmdir` the directory if it is now empty.

**Why `withFileTypes` (the `.isFile()` design):** `fs.readdir(path,{withFileTypes:true})` returns `Dirent` objects whose `.isFile()`/`.isDirectory()` come from the directory entry itself, avoiding a per-file `stat`. The walk is O(N) reads, not O(2N). (The age check still needs one `stat` per matching file in `Lm`, but non-matching files are skipped without any `stat`.)

### 5.1 File-level check: `Lm` (cleanupByMtime)

```javascript
// ============================================
// Lm (cleanupByMtime) - stat the file, unlink if mtime older than cutoff
// Location: cli_inner_pretty.js:587834-587837
// ============================================

// ORIGINAL (for source lookup):
async function Lm(H, $, q) {
  if ((await q.stat(H)).mtime < $) return (await q.unlink(H), !0);
  return !1;
}

// READABLE (for understanding):
async function cleanupByMtime(filePath, cutoffDate, fs) {          // Lm
  if ((await fs.stat(filePath)).mtime < cutoffDate) {
    await fs.unlink(filePath);
    return true;   // deleted
  }
  return false;    // kept (still within retention window)
}

// Mapping: Lm->cleanupByMtime, H->filePath, $->cutoffDate, q->fs
```

**Why `mtime`, not `birthtime`:** `mtime` is set reliably by every filesystem on every write; `birthtime` is unavailable on many tmpfs/older filesystems. Snapshot files are never modified after creation, so `mtime == birthtime` for this use case, but `mtime` keeps the walker portable across all directories it serves.

**Race safety:** the `stat`→`unlink` window can throw `ENOENT` if another process (the per-session hook, or a concurrent sweep from a second session) removed the file first. That throw is caught one level up in `QC`'s `try/catch` and counted as `errors++` — no data loss, just a slightly inflated error count. There is no advisory locking; snapshots are session-scoped and idempotently regenerated, so best-effort deletion is acceptable.

### 5.2 Empty-dir removal: `Xm` (removeIfEmpty)

```javascript
// ============================================
// Xm (removeIfEmpty) - rmdir the directory, swallow error if non-empty
// Location: cli_inner_pretty.js:587838-587842
// ============================================

// ORIGINAL (for source lookup):
async function Xm(H, $) {
  try {
    await $.rmdir(H);
  } catch {}
}

// READABLE (for understanding):
async function removeIfEmpty(dir, fs) {                            // Xm
  try {
    await fs.rmdir(dir);   // rmdir only succeeds on an empty directory; otherwise ENOTEMPTY -> swallowed
  } catch {}
}

// Mapping: Xm->removeIfEmpty, H->dir, $->fs
```

`rmdir` on a POSIX/Node filesystem fails with `ENOTEMPTY` if any file remains, so this is a safe "remove only if fully swept" operation — the `catch{}` discards the `ENOTEMPTY` (and any permissions error). For shell-snapshots, the dir is recreated lazily by `js7`'s `mkdir(...,{recursive:true})`.

**Cross-version note:** This trio is structurally identical to v2.1.142's `Rr`/`Xd`/`c$H`. The renames are `Rr→QC`, `Xd→Lm`, `c$H→Xm`. The v2.1.142 doc named `Xd` `cleanupByMtime` and `c$H` `removeIfEmpty`; the bodies match line-for-line. **The shared directory walker is the same mechanism in 2.1.156 — the sweep was not rewritten, only re-minified.**

---

## 6. The `claude project purge` UI surface — the only user-visible mention

`~/.claude/shell-snapshots/` is otherwise invisible to end users: snapshots are created, sourced, and swept silently. The **single** place the directory name surfaces to a human is the `claude project purge` planner, which emits a *warning* (not a deletion plan) noting the directory is intentionally out of scope.

There are two planner functions:
- `RBz` (`cli_inner_pretty.js:642525`) — **project-scoped** purge: takes a project path, builds the list of items to delete for one project, plus `warnings` (`Y`).
- `IBz` (`cli_inner_pretty.js:642580`) — **global / all-projects** purge: builds the list across every project, plus `warnings` (`q`).

Both check the directory's existence and, if present, push the same warning string:

```javascript
// ============================================
// RBz / IBz - project purge planners: warn that shell-snapshots/ is NOT project-scoped
// Location: cli_inner_pretty.js:642571-642572 (RBz) and 642598-642599 (IBz)
// ============================================

// ORIGINAL (for source lookup):
// --- RBz (project-scoped, $ = the project's config dir) ---
  if (await nAH(pk.join($, "shell-snapshots")))
    Y.push("shell-snapshots/ are not project-scoped and will not be touched");

// --- IBz (global, H = getClaudeConfigHomeDir) ---
  if (await nAH(pk.join(H, "shell-snapshots")))
    q.push("shell-snapshots/ are not project-scoped and will not be touched");

// READABLE (for understanding):
// RBz (project purge): warnings array is `Y`
  if (await directoryExists(path.join(projectConfigDir, "shell-snapshots")))   // nAH
    warnings.push("shell-snapshots/ are not project-scoped and will not be touched");

// IBz (purge-all): warnings array is `q`
  if (await directoryExists(path.join(getClaudeConfigHomeDir(), "shell-snapshots")))  // nAH
    warnings.push("shell-snapshots/ are not project-scoped and will not be touched");

// Mapping: nAH->directoryExists, pk->path, $/H->dir base, Y/q->warnings array
```

The existence probe `nAH` is a trivial stat-based "does this directory exist" helper:

```javascript
// ============================================
// nAH (directoryExists) - stat-probe used by the purge planner before warning
// Location: cli_inner_pretty.js:642397-642403
// ============================================

// ORIGINAL (for source lookup):
async function nAH(H) {
  try {
    return (await iAH.stat(H), !0);
  } catch {
    return !1;
  }
}

// READABLE (for understanding):
async function directoryExists(targetPath) {                       // nAH
  try {
    await fsPromises.stat(targetPath);   // iAH = fs/promises binding
    return true;
  } catch {
    return false;   // ENOENT -> not present -> no warning emitted
  }
}

// Mapping: nAH->directoryExists, H->targetPath, iAH->fsPromises
```

### 6.1 Why purge deliberately refuses to touch the directory

**What it does:** `claude project purge` removes everything tied to a *project*: that project's transcripts (`projects/`, `.jsonl` + `memory/`), its `~/.claude.json` config key (trust, history, MCP servers), its `history.jsonl` prompt lines, its `tasks/`, `debug/<session>.txt`, and `file-history/<session>` entries (`cli_inner_pretty.js:642553-642561` for `RBz`; `642584-642596` for `IBz`). The `shell-snapshots/` directory is explicitly **excluded** and the user is told so.

**Why this approach (the key design decision):**
- **Snapshots are per-session/global, not per-project.** A snapshot's filename is `snapshot-${shellType}-${timestamp}-${rand}.sh` (`cli_inner_pretty.js:341182`) — it encodes the shell type and a timestamp, but carries **no project identity**. There is no way to attribute a given `.sh` file to a particular project (the same `.zshrc` snapshot is reused across whatever project a session happens to run in). Purging "this project's" snapshots is therefore an ill-defined operation.
- **The retention sweep already owns this directory's lifecycle.** Deleting snapshots is the job of `Qvz`/`QC` (and the per-session hook), keyed on *age*, not project. Letting purge also delete here would create two owners of the same directory with conflicting keys (project-identity vs age), risking deletion of a snapshot an active session is about to source.
- **Honesty over silence.** Rather than silently leaving the directory (which a user purging "everything" might find surprising — "why is `shell-snapshots/` still here?"), the planner emits an explicit warning. This pre-empts a confused bug report and documents the intentional boundary at the exact moment the user is auditing their `~/.claude/` footprint.

**Alternative considered (inferable):** purge *could* have deleted the whole `shell-snapshots/` directory under the global `IBz` path (since global purge is not project-scoped). It deliberately does not, because even global purge runs while a live session may hold an in-use snapshot, and the age-based sweep is the single, race-aware owner. The warning makes the non-action a feature, not an omission.

**Key insight:** This warning is the **only** end-user-visible string referencing `shell-snapshots/` in the entire bundle (`grep "shell-snapshots"` returns exactly the creation path at `341180`, the sweep at `588103`, and these two warning sites at `642571-642572`/`642598-642599`). The directory is an implementation detail everywhere else.

---

## 7. Cross-version validation summary

| Aspect | v2.1.88 clean TS (`ShellSnapshot.ts`) | v2.1.142 doc (`al5`/`Rr` flow) | v2.1.156 (this doc) | Verdict |
|--------|----------------------------------------|--------------------------------|---------------------|---------|
| Per-session `registerCleanup` unlink | Present (`:534-545`) | Present | Present `js7` (`341240-341246`) | **Unchanged** since v2.1.88 |
| Retention sweep for snapshots | **Absent** (clean TS has no sweep) | Present (`al5`, v2.1.117 addition) | Present `Qvz` (`588102-588104`) | Same mechanism as v2.1.142 |
| Shared by-extension walker | n/a | `Rr` (`555400`) | `QC` (`587963-587984`) | Same walker, renamed `Rr→QC` |
| File-level mtime check | n/a | `Xd` | `Lm` (`587834-587837`) | Same, renamed `Xd→Lm` |
| Empty-dir removal | n/a | `c$H` | `Xm` (`587838-587842`) | Same, renamed `c$H→Xm` |
| Cutoff / default 30 | n/a | `l$H` / `ml5=30` | `cs` (`587782`) / `vvz=30` (`588275`) | Same, renamed; default still 30 |
| Cleanup gate | n/a | `Bl5` | `kvz` (`587763-587781`) | Same three skip conditions |
| Orchestrator | n/a | `aB4` | `Iz9` (`588243-588273`) | Same gate→chain→worktree shape |
| **`project purge` warning surface** | **Absent** | **Not covered in v2.1.142 doc** | `RBz`/`IBz` (`642571-642572`, `642598-642599`) | **NEW coverage in 2.1.156 doc** |

**What is genuinely NEW vs CHANGED in 2.1.156:**
- The **retention-sweep + per-session-cleanup machinery is unchanged in behavior** from v2.1.142. Only identifiers rotated (`al5→Qvz`, `Rr→QC`, `Xd→Lm`, `c$H→Xm`, `l$H→cs`, `Bl5→kvz`, `aB4→Iz9`, `ml5→vvz`). Confirmed by reading both the 2.1.156 bodies and the v2.1.142 reference doc.
- The **`claude project purge` warning surface** (`RBz`/`IBz` emitting *"shell-snapshots/ are not project-scoped and will not be touched"*) is **absent from the v2.1.88 clean TypeScript** (`ShellSnapshot.ts` has no purge logic at all) and was **not documented in the v2.1.142 `retention_cleanup.md`**. It is the one part of the retention/cleanup story this 2.1.156 doc adds.

---

## 8. Edge cases

| Case | Behavior | Evidence |
|------|----------|----------|
| First-run install (no dir) | `QC`'s `readdir` throws `ENOENT`, caught, returns `{0,0}`; no-op | `cli_inner_pretty.js:587969-587973` |
| `cleanupPeriodDays: 0` | `cs` returns `null`; `QC` returns immediately without touching fs | `cli_inner_pretty.js:587784`, `587966` |
| Non-`.sh` file in dir | `!endsWith(".sh")` skips it; only `.sh` is unlinked | `cli_inner_pretty.js:587975` |
| Subdirectory in snapshots dir | `!isFile()` skips it; `QC` deletes files only | `cli_inner_pretty.js:587975` |
| Active 31-day session (cutoff 30) | Old snapshot is swept at next startup; new session's `js7` is already writing a fresh file; per-command fs fallback covers the gap | sweep order in `Iz9`; `mkdir` at `341183` |
| Concurrent sweep / hook race | Loser gets `ENOENT`, counted as `errors++`, loop continues; no data loss | `cli_inner_pretty.js:587976-587980` |
| Purge run while dir present | `nAH` true → warning pushed; directory left intact | `cli_inner_pretty.js:642571-642572`, `642598-642599` |
| Purge run with no snapshots dir | `nAH` false → no warning emitted | `cli_inner_pretty.js:642397-642403` |

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_156_shell_snapshot.md](../00_overview/symbol_additions_v2_1_156_shell_snapshot.md) — this module's symbol additions

Key functions in this document:
- `createAndSaveSnapshot` (`js7`) — snapshot orchestrator; hosts the `registerCleanup` unlink callback — `cli_inner_pretty.js:341168`, callback `341240-341246`
- `registerCleanup` (`$7`) — shutdown cleanup registry; queues per-session snapshot unlink — `cli_inner_pretty.js:341240`
- `getFsImplementation` (`U$`) — fs abstraction used for `unlink`/`readdir`/`stat`/`rmdir` — used at `341242`, `587967`
- `cleanupShellSnapshots` (`Qvz`) — shell-snapshots retention sweep entry — `cli_inner_pretty.js:588102-588104`
- `cleanupByExtension` (`QC`) — shared by-extension directory walker — `cli_inner_pretty.js:587963-587984`
- `cleanupByMtime` (`Lm`) — file-level mtime check + unlink — `cli_inner_pretty.js:587834-587837`
- `removeIfEmpty` (`Xm`) — `rmdir` if directory empty — `cli_inner_pretty.js:587838-587842`
- `getRetentionCutoff` (`cs`) — computes mtime cutoff from `cleanupPeriodDays`; default 30 — `cli_inner_pretty.js:587782-587788`
- `DEFAULT_CLEANUP_DAYS` (`vvz`) — `30` — `cli_inner_pretty.js:588275`
- `shouldRunCleanup` (`kvz`) — three-condition cleanup gate — `cli_inner_pretty.js:587763-587781`
- `runRetentionCleanup` (`Iz9`) — top-level cleanup orchestrator; calls `Qvz` — `cli_inner_pretty.js:588243-588273`
- `purgeProjectPlan` (`RBz`) — project-scoped purge planner; emits the not-project-scoped warning — `cli_inner_pretty.js:642525`, warning `642571-642572`
- `purgeAllPlan` (`IBz`) — global purge planner; emits the not-project-scoped warning — `cli_inner_pretty.js:642580`, warning `642598-642599`
- `directoryExists` (`nAH`) — stat-based existence probe used by purge — `cli_inner_pretty.js:642397-642403`
- `getClaudeConfigHomeDir` (`l8`) — returns `~/.claude` — used at `588103`, `642581`
