# Implementation Report - Rewind / Checkpointing (Module 35)

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Rewind module section

Key functions in this document:
- `isFileCheckpointingEnabled` (iz) - Master guard; interactive=opt-out, SDK=opt-in
- `isSDKCheckpointingEnabled` (YVY) - SDK mode checkpointing logic
- `trackFileEdit` (R66) - Track a file edit at message time
- `createSnapshotForMessage` (lf6) - Snapshot all tracked files when a message ends
- `rewindHandler` (sN1) - Execute rewind to a given message
- `rewindAndRestoreFiles` (Zn4) - Physical file restoration from backup
- `createBackupFile` (du8) - Create versioned backup copy
- `fileNeedsRestore` (cu8) - Compare current vs backup to avoid unnecessary writes
- `restoreFileFromBackup` (_VY) - Write backup content to original file path
- `calculateFileDiffStats` (Mn4) - Compute diff +/- for dry-run preview
- `findBackupInOlderSnapshot` (Gn4) - Fallback lookup in older snapshots
- `hydrateFileHistoryFromSnapshots` (qV1) - Reconstruct state from JSONL
- `migrateFileHistoryToNewSession` (KV1) - Copy backups on session resume

---

## Table of Contents

1. [Feature Enable/Disable Logic](#0-feature-enabledisable-logic)
2. [File History Data Model](#1-file-history-data-model)
3. [Phase 1: File Edit Tracking](#2-phase-1-file-edit-tracking--trackfileedit-r66)
4. [Phase 2: Snapshot Creation](#3-phase-2-snapshot-creation--createsnapshotformessage-lf6)
5. [Phase 3: Rewind Execution](#4-phase-3-rewind-execution--rewindhandler-sn1)
6. [File Comparison Algorithm](#5-file-comparison-algorithm--fileneedsrestore-cu8)
7. [Diff Stats Computation](#6-diff-stats-computation--calculatefilediffstats-mn4)
8. [Backup File Management](#7-backup-file-management)
9. [Session Migration](#8-session-migration--migratefilehistorytonewsession-kv1)
10. [Persistence Layer](#9-persistence-layer)

---

## 0. Feature Enable/Disable Logic

### isFileCheckpointingEnabled (iz)

**Location:** chunks.135.mjs:1977-1980

```javascript
// ============================================
// isFileCheckpointingEnabled - Master guard for checkpointing
// Location: chunks.135.mjs:1977-1980
// ============================================

// ORIGINAL (for source lookup):
function iz() {
    if (q7()) return YVY();
    return X1().fileCheckpointingEnabled !== !1 && !t6(process.env.CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING)
}

// READABLE (for understanding):
function isFileCheckpointingEnabled() {
    if (isSDKMode()) return isSDKCheckpointingEnabled();
    return getUserSettings().fileCheckpointingEnabled !== false
        && !parseBoolean(process.env.CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING)
}

// Mapping: iz→isFileCheckpointingEnabled, q7→isSDKMode, YVY→isSDKCheckpointingEnabled,
//          X1→getUserSettings, t6→parseBoolean
```

**What it does:** Determines whether file checkpointing should be active.

**How it works:**
1. **SDK Mode Check**: If running in SDK mode, delegate to `isSDKCheckpointingEnabled`
2. **Interactive Mode**: Check user settings and environment variable
   - Setting `fileCheckpointingEnabled !== false` (default true)
   - Environment `CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING` not set

**Why this approach:**
- SDK mode has different defaults (opt-in) vs interactive (opt-out)
- Allows enterprise users to disable checkpointing entirely
- Simple boolean check with fallback to enabled

**Key insight:** The conditional logic ensures that checkpointing is ON by default for interactive CLI users (opt-out), but OFF by default for SDK/embedded usage (opt-in). This prevents surprise I/O overhead in automated contexts.

### isSDKCheckpointingEnabled (YVY)

**Location:** chunks.135.mjs:1982-1984

```javascript
// ============================================
// isSDKCheckpointingEnabled - SDK-specific checkpointing guard
// Location: chunks.135.mjs:1982-1984
// ============================================

// ORIGINAL (for source lookup):
function YVY() {
    return t6(process.env.CLAUDE_CODE_ENABLE_SDK_FILE_CHECKPOINTING) && !t6(process.env.CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING)
}

// READABLE (for understanding):
function isSDKCheckpointingEnabled() {
    return parseBoolean(process.env.CLAUDE_CODE_ENABLE_SDK_FILE_CHECKPOINTING)
        && !parseBoolean(process.env.CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING)
}

// Mapping: YVY→isSDKCheckpointingEnabled, t6→parseBoolean
```

**What it does:** SDK-specific checkpointing enablement logic.

**Why opt-in for SDK mode:**
- SDK users may have their own version control
- Checkpointing adds I/O overhead
- Less surprising behavior for automated systems

---

## 1. File History Data Model

The checkpoint system's core data structure is the `fileHistory` state atom:

```
FileHistory {
  trackedFiles: Set<normalizedFilePath>   // all files ever touched this session
  snapshots: Snapshot[]                   // one per user message (max 100)
  snapshotSequence: number                // incrementing counter for React reconciliation
}

Snapshot {
  messageId: string                        // UUID of the user message
  timestamp: Date
  trackedFileBackups: {
    [normalizedFilePath]: BackupRecord | null
  }
}

BackupRecord {
  backupFileName: string | null    // null = file was deleted at this point
  version: number                  // monotonically increasing per file
  backupTime: Date
}
```

**Key insight**: `backupFileName: null` does not mean "no backup exists" — it means **the file did not exist at this snapshot point**. Restoration of a `null` backup means deleting the current file.

**Storage Location:**
```
~/.claude/file-history/{sessionId}/{backupFileName}
```

**MAX_SNAPSHOTS Constant (Jn4):**
```javascript
// ============================================
// MAX_SNAPSHOTS - Maximum snapshots retained in memory
// Location: chunks.135.mjs:2423
// ============================================

// ORIGINAL (for source lookup):
Jn4 = 100

// READABLE (for understanding):
const MAX_SNAPSHOTS = 100

// Mapping: Jn4→MAX_SNAPSHOTS
```

When snapshots exceed 100, older ones are pruned: `snapshots.slice(-Jn4)`. This prevents unbounded memory growth in long sessions.

---

## 2. Phase 1: File Edit Tracking — `trackFileEdit` (R66)

**Location:** chunks.135.mjs:1986-2014

This is called every time a Claude tool (Write, Edit, MultiEdit) modifies a file, **before** the modification occurs.

```javascript
// ============================================
// trackFileEdit - Record a file edit into current snapshot
// Location: chunks.135.mjs:1986-2014
// ============================================

// ORIGINAL (for source lookup):
async function R66(A, q, K) {
    if (!iz()) return;
    A((Y) => {
        try {
            let z = Y.snapshots.at(-1);
            if (!z) return _6(Error("FileHistory: Missing most recent snapshot")), d("tengu_file_history_track_edit_failed", {}), Y;
            let _ = fn4(q);
            if (z.trackedFileBackups[_]) return Y;
            let w = Y.trackedFiles.has(_) ? Y.trackedFiles : new Set(Y.trackedFiles).add(_),
                $ = !$1().existsSync(q),
                H = $ ? du8(null, 1) : du8(q, 1),
                j = rw6(z);
            j.trackedFileBackups[_] = H;
            let J = {
                ...Y,
                snapshots: [...Y.snapshots.slice(0, -1), j],
                trackedFiles: w
            };
            return Tn4(J), _l6(K, j, !0).catch((M) => {
                _6(Error(`FileHistory: Failed to record snapshot: ${M}`))
            }), d("tengu_file_history_track_edit_success", {
                isNewFile: $,
                version: H.version
            }), k(`FileHistory: Tracked file modification for ${q}`), J
        } catch (z) {
            return _6(z), d("tengu_file_history_track_edit_failed", {}), Y
        }
    })
}

// READABLE (for understanding):
async function trackFileEdit(updateFileHistoryState, filePath, messageId) {
    if (!isFileCheckpointingEnabled()) return;

    updateFileHistoryState((fileHistoryState) => {
        try {
            let mostRecentSnapshot = fileHistoryState.snapshots.at(-1);
            if (!mostRecentSnapshot) {
                logError(Error("FileHistory: Missing most recent snapshot"));
                telemetry("tengu_file_history_track_edit_failed", {});
                return fileHistoryState;
            }

            let normalizedPath = normalizeFilePath(filePath);

            // Already tracked in this snapshot? Skip (first-edit-only pattern)
            if (mostRecentSnapshot.trackedFileBackups[normalizedPath]) {
                return fileHistoryState;
            }

            let updatedTrackedFiles = fileHistoryState.trackedFiles.has(normalizedPath)
                    ? fileHistoryState.trackedFiles
                    : new Set(fileHistoryState.trackedFiles).add(normalizedPath),
                isNewFile = !getFileSystem().existsSync(filePath),
                backupRecord = isNewFile
                    ? createBackupFile(null, 1)      // New file: null backup (marks creation)
                    : createBackupFile(filePath, 1), // Existing file: copy content
                copiedSnapshot = deepCopySnapshot(mostRecentSnapshot);

            copiedSnapshot.trackedFileBackups[normalizedPath] = backupRecord;

            let newState = {
                ...fileHistoryState,
                snapshots: [...fileHistoryState.snapshots.slice(0, -1), copiedSnapshot],
                trackedFiles: updatedTrackedFiles
            };

            debugLogState(newState);

            // Persist to JSONL (fire-and-forget)
            recordFileHistorySnapshot(messageId, copiedSnapshot, true).catch((err) => {
                logError(Error(`FileHistory: Failed to record snapshot: ${err}`));
            });

            telemetry("tengu_file_history_track_edit_success", {
                isNewFile,
                version: backupRecord.version
            });

            log(`FileHistory: Tracked file modification for ${filePath}`);

            return newState;
        } catch (err) {
            logError(err);
            telemetry("tengu_file_history_track_edit_failed", {});
            return fileHistoryState;
        }
    });
}

// Mapping: R66→trackFileEdit, A→updateFileHistoryState, q→filePath, K→messageId,
//          Y→fileHistoryState, z→mostRecentSnapshot, _→normalizedPath, fn4→normalizeFilePath,
//          $1→getFileSystem, du8→createBackupFile, rw6→deepCopySnapshot, _l6→recordFileHistorySnapshot,
//          Tn4→debugLogState, d→telemetry, _6→logError, k→log
```

**What it does:** Records a file's state **before** Claude modifies it, enabling later restoration.

**How it works:**
1. **Guard check**: Skip if checkpointing disabled
2. **Get latest snapshot**: Files are tracked within the context of the current message's snapshot
3. **Normalize path**: Ensure consistent path format across different working directories
4. **First-edit-only**: If already tracked in this snapshot, skip (important optimization)
5. **Detect new file**: Check if file exists before backup
6. **Create backup**: Copy file content to `~/.claude/file-history/{sessionId}/`
7. **Update state**: Add file to tracked set, update snapshot with backup record
8. **Persist**: Write snapshot to JSONL (async, fire-and-forget)

**Key insight - First-Edit-Only Pattern:**
The critical optimization is `if (z.trackedFileBackups[_]) return Y;`. This means:
- Only the **first** edit to a file in a message triggers a backup
- Subsequent edits to the same file within the same message are ignored
- This captures the file's state **before any Claude modifications**

**Example:**
```
User sends: "Fix the bug in app.ts"
→ Message snapshot created
→ Claude calls Edit(app.ts) → trackFileEdit creates backup v1
→ Claude calls Edit(app.ts) again → trackFileEdit SKIPS (already tracked)
→ Message complete → createSnapshotForMessage creates v2
```

---

## 3. Phase 2: Snapshot Creation — `createSnapshotForMessage` (lf6)

**Location:** chunks.135.mjs:2016-2073

Called when a user message is complete (after all tool calls finish).

```javascript
// ============================================
// createSnapshotForMessage - Finalize snapshot for all tracked files
// Location: chunks.135.mjs:2016-2073
// ============================================

// ORIGINAL (for source lookup):
async function lf6(A, q) {
    if (!iz()) return;
    A((K) => {
        try {
            let Y = $1(),
                z = new Date,
                _ = {},
                w = K.snapshots.at(-1);
            if (w) {
                k(`FileHistory: Making snapshot for message ${q}`);
                for (let j of K.trackedFiles) try {
                    let J = AV1(j);
                    if (!Y.existsSync(J)) {
                        // File was deleted during this message
                        let M = w.trackedFileBackups[j],
                            D = M ? M.version + 1 : 1;
                        _[j] = {
                            backupFileName: null,
                            version: D,
                            backupTime: new Date
                        }, d("tengu_file_history_backup_deleted_file", {
                            version: D
                        }), k(`FileHistory: Missing tracked file: ${j}`)
                    } else {
                        let M = w.trackedFileBackups[j];
                        // Check if file changed from last snapshot
                        if (M && M.backupFileName !== null && !cu8(J, M.backupFileName)) {
                            // File unchanged, reuse existing backup
                            _[j] = M;
                            continue
                        }
                        // File changed (or new), create new backup
                        let D = M ? M.version + 1 : 1,
                            X = du8(J, D);
                        _[j] = X
                    }
                } catch (J) {
                    _6(J), d("tengu_file_history_backup_file_failed", {})
                }
            }
            let O = {
                    messageId: q,
                    trackedFileBackups: _,
                    timestamp: z
                },
                $ = [...K.snapshots, O],
                H = {
                    ...K,
                    snapshots: $.length > Jn4 ? $.slice(-Jn4) : $,
                    snapshotSequence: (K.snapshotSequence ?? 0) + 1
                };
            return Tn4(H), wVY(K, H), _l6(q, O, !1).catch((j) => {
                _6(Error(`FileHistory: Failed to record snapshot: ${j}`))
            }), k(`FileHistory: Added snapshot for ${q}, tracking ${K.trackedFiles.size} files`), d("tengu_file_history_snapshot_success", {
                trackedFilesCount: K.trackedFiles.size,
                snapshotCount: H.snapshots.length
            }), H
        } catch (Y) {
            return _6(Y), d("tengu_file_history_snapshot_failed", {}), K
        }
    })
}

// READABLE (for understanding):
async function createSnapshotForMessage(updateFileHistoryState, messageId) {
    if (!isFileCheckpointingEnabled()) return;

    updateFileHistoryState((fileHistoryState) => {
        try {
            let fs = getFileSystem(),
                timestamp = new Date,
                newBackups = {},
                previousSnapshot = fileHistoryState.snapshots.at(-1);

            if (previousSnapshot) {
                log(`FileHistory: Making snapshot for message ${messageId}`);

                for (let trackedPath of fileHistoryState.trackedFiles) {
                    try {
                        let absolutePath = resolveTrackedFilePath(trackedPath);

                        if (!fs.existsSync(absolutePath)) {
                            // File was deleted during this message
                            let prevBackup = previousSnapshot.trackedFileBackups[trackedPath],
                                newVersion = prevBackup ? prevBackup.version + 1 : 1;

                            newBackups[trackedPath] = {
                                backupFileName: null,  // null = deleted
                                version: newVersion,
                                backupTime: new Date
                            };

                            telemetry("tengu_file_history_backup_deleted_file", { version: newVersion });
                            log(`FileHistory: Missing tracked file: ${trackedPath}`);
                        } else {
                            let prevBackup = previousSnapshot.trackedFileBackups[trackedPath];

                            // Optimization: Check if file changed from last snapshot
                            if (prevBackup && prevBackup.backupFileName !== null
                                && !fileNeedsRestore(absolutePath, prevBackup.backupFileName)) {
                                // File unchanged, reuse existing backup
                                newBackups[trackedPath] = prevBackup;
                                continue;
                            }

                            // File changed (or new), create new backup
                            let newVersion = prevBackup ? prevBackup.version + 1 : 1,
                                newBackupRecord = createBackupFile(absolutePath, newVersion);

                            newBackups[trackedPath] = newBackupRecord;
                        }
                    } catch (err) {
                        logError(err);
                        telemetry("tengu_file_history_backup_file_failed", {});
                    }
                }
            }

            let newSnapshot = {
                    messageId,
                    trackedFileBackups: newBackups,
                    timestamp
                },
                allSnapshots = [...fileHistoryState.snapshots, newSnapshot],
                newState = {
                    ...fileHistoryState,
                    // Enforce MAX_SNAPSHOTS limit
                    snapshots: allSnapshots.length > MAX_SNAPSHOTS
                        ? allSnapshots.slice(-MAX_SNAPSHOTS)
                        : allSnapshots,
                    snapshotSequence: (fileHistoryState.snapshotSequence ?? 0) + 1
                };

            debugLogState(newState);
            detectFileChangesForDiffView(fileHistoryState, newState);

            // Persist to JSONL (fire-and-forget)
            recordFileHistorySnapshot(messageId, newSnapshot, false).catch((err) => {
                logError(Error(`FileHistory: Failed to record snapshot: ${err}`));
            });

            log(`FileHistory: Added snapshot for ${messageId}, tracking ${fileHistoryState.trackedFiles.size} files`);
            telemetry("tengu_file_history_snapshot_success", {
                trackedFilesCount: fileHistoryState.trackedFiles.size,
                snapshotCount: newState.snapshots.length
            });

            return newState;
        } catch (err) {
            logError(err);
            telemetry("tengu_file_history_snapshot_failed", {});
            return fileHistoryState;
        }
    });
}

// Mapping: lf6→createSnapshotForMessage, A→updateFileHistoryState, q→messageId,
//          K→fileHistoryState, Y→fs, z→timestamp, _→newBackups, w→previousSnapshot,
//          AV1→resolveTrackedFilePath, cu8→fileNeedsRestore, du8→createBackupFile,
//          Jn4→MAX_SNAPSHOTS, _l6→recordFileHistorySnapshot, wVY→detectFileChangesForDiffView
```

**What it does:** Creates a new snapshot capturing the state of all tracked files after a message completes.

**Key Algorithm - Change Detection Optimization:**
```javascript
if (prevBackup && prevBackup.backupFileName !== null
    && !fileNeedsRestore(absolutePath, prevBackup.backupFileName)) {
    // File unchanged, reuse existing backup
    newBackups[trackedPath] = prevBackup;
    continue;
}
```

This avoids creating duplicate backups when a file hasn't changed between messages. The `fileNeedsRestore` function performs a multi-tier comparison (existence → mode → size → mtime → content).

**Snapshot Lifecycle:**
```
User sends message 1
  ↓
trackFileEdit(file.ts) → backup v1 created
  ↓
Tool modifies file.ts
  ↓
createSnapshotForMessage(message1) → backup v2 created (if changed)
  ↓
User sends message 2
  ↓
trackFileEdit(file.ts) → SKIPPED (v2 already tracks current state)
  ↓
Tool modifies file.ts
  ↓
createSnapshotForMessage(message2) → backup v3 created (if changed)
```

---

## 4. Phase 3: Rewind Execution — `rewindHandler` (sN1)

**Location:** chunks.135.mjs:2075-2100

```javascript
// ============================================
// rewindHandler - Execute rewind to a given message
// Location: chunks.135.mjs:2075-2100
// ============================================

// ORIGINAL (for source lookup):
async function sN1(A, q) {
    if (!iz()) return;
    let K = null;
    if (A((Y) => {
            let z = Y;
            try {
                let _ = Y.snapshots.findLast((O) => O.messageId === q);
                if (!_) return _6(Error(`FileHistory: Snapshot for ${q} not found`)), d("tengu_file_history_rewind_failed", {
                    trackedFilesCount: z.trackedFiles.size,
                    snapshotFound: !1
                }), K = Error("The selected snapshot was not found"), z;
                k(`FileHistory: [Rewind] Rewinding to snapshot for ${q}`);
                let w = Zn4(z, _, !1);
                k(`FileHistory: [Rewind] Finished rewinding to ${q}`), d("tengu_file_history_rewind_success", {
                    trackedFilesCount: z.trackedFiles.size,
                    filesChangedCount: w?.filesChanged?.length
                })
            } catch (_) {
                K = _, _6(_), d("tengu_file_history_rewind_failed", {
                    trackedFilesCount: z.trackedFiles.size,
                    snapshotFound: !0
                })
            }
            return z
        }), K) throw K
}

// READABLE (for understanding):
async function rewindHandler(updateFileHistoryState, targetMessageId) {
    if (!isFileCheckpointingEnabled()) return;

    let error = null;

    updateFileHistoryState((fileHistoryState) => {
        let state = fileHistoryState;
        try {
            // Find the target snapshot
            let targetSnapshot = fileHistoryState.snapshots.findLast(
                (snapshot) => snapshot.messageId === targetMessageId
            );

            if (!targetSnapshot) {
                logError(Error(`FileHistory: Snapshot for ${targetMessageId} not found`));
                telemetry("tengu_file_history_rewind_failed", {
                    trackedFilesCount: state.trackedFiles.size,
                    snapshotFound: false
                });
                error = Error("The selected snapshot was not found");
                return state;
            }

            log(`FileHistory: [Rewind] Rewinding to snapshot for ${targetMessageId}`);

            // Execute the file restoration
            let result = rewindAndRestoreFiles(state, targetSnapshot, false);

            log(`FileHistory: [Rewind] Finished rewinding to ${targetMessageId}`);
            telemetry("tengu_file_history_rewind_success", {
                trackedFilesCount: state.trackedFiles.size,
                filesChangedCount: result?.filesChanged?.length
            });

        } catch (err) {
            error = err;
            logError(err);
            telemetry("tengu_file_history_rewind_failed", {
                trackedFilesCount: state.trackedFiles.size,
                snapshotFound: true
            });
        }
        return state;
    });

    if (error) throw error;
}

// Mapping: sN1→rewindHandler, A→updateFileHistoryState, q→targetMessageId,
//          Y→fileHistoryState, _→targetSnapshot, Zn4→rewindAndRestoreFiles
```

**What it does:** Executes the rewind operation, restoring files to their state at the target message.

**Why state is not modified:**
The function reads `fileHistoryState` but returns it unchanged. File restoration happens via `rewindAndRestoreFiles` which performs actual file I/O, not state mutation. This is intentional — the snapshot state is preserved for potential future rewinds.

---

## 5. File Comparison Algorithm — `fileNeedsRestore` (cu8)

**Location:** chunks.135.mjs:2171-2201

```javascript
// ============================================
// fileNeedsRestore - Multi-tier file comparison
// Location: chunks.135.mjs:2171-2201
// ============================================

// ORIGINAL (for source lookup):
function cu8(A, q) {
    let K = $1(),
        Y = zz6(q),
        z = null;
    try {
        z = K.statSync(A)
    } catch (w) {
        if (w.code !== "ENOENT") return !0
    }
    let _ = null;
    try {
        _ = K.statSync(Y)
    } catch (w) {
        if (w.code !== "ENOENT") return !0
    }
    if (z === null !== (_ === null)) return !0;
    if (z === null || _ === null) return !1;
    if (z.mode !== _.mode || z.size !== _.size) return !0;
    if (z.mtimeMs < _.mtimeMs) return !1;
    try {
        let w = K.readFileSync(A, {
                encoding: "utf-8"
            }),
            O = K.readFileSync(Y, {
                encoding: "utf-8"
            });
        return w !== O
    } catch {
        return !0
    }
}

// READABLE (for understanding):
function fileNeedsRestore(currentFilePath, backupFileName) {
    let fs = getFileSystem(),
        backupFilePath = resolveBackupPath(backupFileName),
        currentStats = null,
        backupStats = null;

    // Tier 1: Existence check
    try {
        currentStats = fs.statSync(currentFilePath);
    } catch (err) {
        if (err.code !== "ENOENT") return true;  // Unknown error, restore to be safe
    }

    try {
        backupStats = fs.statSync(backupFilePath);
    } catch (err) {
        if (err.code !== "ENOENT") return true;  // Unknown error, restore to be safe
    }

    // Tier 2: XOR existence check
    // If one exists and one doesn't, file needs restore
    if (currentStats === null !== (backupStats === null)) return true;

    // Both don't exist → no restore needed
    if (currentStats === null || backupStats === null) return false;

    // Tier 3: Metadata comparison (fast path)
    if (currentStats.mode !== backupStats.mode) return true;  // Permissions changed
    if (currentStats.size !== backupStats.size) return true;  // Size changed

    // Tier 4: mtime optimization
    // If current file is OLDER than backup, it hasn't been modified since backup
    // (Assumes backup was created before any modifications)
    if (currentStats.mtimeMs < backupStats.mtimeMs) return false;

    // Tier 5: Content comparison (slow path)
    try {
        let currentContent = fs.readFileSync(currentFilePath, { encoding: "utf-8" }),
            backupContent = fs.readFileSync(backupFilePath, { encoding: "utf-8" });
        return currentContent !== backupContent;
    } catch {
        return true;  // Error reading, restore to be safe
    }
}

// Mapping: cu8→fileNeedsRestore, A→currentFilePath, q→backupFileName,
//          K→fs, Y→backupFilePath, zz6→resolveBackupPath, $1→getFileSystem
```

**What it does:** Determines whether a file needs to be restored from backup by comparing current state to backup.

### Multi-Tier Comparison Algorithm

**Why this approach:**

| Tier | Check | Cost | Purpose |
|------|-------|------|---------|
| 1 | Existence | O(1) | Quick eliminate deleted/created files |
| 2 | XOR existence | O(1) | Handle creation/deletion edge cases |
| 3 | Metadata (mode, size) | O(1) | Fast path for changed files |
| 4 | mtime comparison | O(1) | **Key optimization**: skip content read |
| 5 | Content comparison | O(n) | Slow path, only when necessary |

**Key Insight - mtime Optimization:**
```javascript
if (currentStats.mtimeMs < backupStats.mtimeMs) return false;
```

This is the most important optimization. If the current file's modification time is **older** than the backup's mtime, it means:
1. The backup was created after the file was last modified
2. Therefore, the file content matches the backup
3. No need to read and compare content

This avoids expensive I/O for files that haven't changed.

**Trade-offs:**
- **Pro**: Avoids unnecessary file reads in the common case (unchanged files)
- **Con**: Relies on mtime being accurate; filesystem issues could cause false negatives
- **Mitigation**: Still falls back to content comparison if mtime indicates change

---

## 6. Diff Stats Computation — `calculateFileDiffStats` (Mn4)

**Location:** chunks.135.mjs:2203-2236

```javascript
// ============================================
// calculateFileDiffStats - Compute +/- line counts for preview
// Location: chunks.135.mjs:2203-2236
// ============================================

// ORIGINAL (for source lookup):
function Mn4(A, q) {
    let K = [],
        Y = 0,
        z = 0;
    try {
        let _ = $1(),
            w = q && zz6(q),
            O = _.existsSync(A),
            $ = w && _.existsSync(w);
        if (!O && !$) return {
            filesChanged: K,
            insertions: Y,
            deletions: z
        };
        K.push(A);
        let H = O ? _.readFileSync(A, {
                encoding: "utf-8"
            }) : "",
            j = $ ? _.readFileSync(w, {
                encoding: "utf-8"
            }) : "";
        na(H, j).forEach((M) => {
            if (M.added) Y += M.count || 0;
            if (M.removed) z += M.count || 0
        })
    } catch (_) {
        _6(Error(`FileHistory: Error generating diffStats: ${_}`))
    }
    return {
        filesChanged: K,
        insertions: Y,
        deletions: z
    }
}

// READABLE (for understanding):
function calculateFileDiffStats(currentFilePath, backupFileName) {
    let filesChanged = [],
        insertions = 0,
        deletions = 0;

    try {
        let fs = getFileSystem(),
            backupFilePath = backupFileName && resolveBackupPath(backupFileName),
            currentExists = fs.existsSync(currentFilePath),
            backupExists = backupFilePath && fs.existsSync(backupFilePath);

        // Neither exists → no diff
        if (!currentExists && !backupExists) {
            return { filesChanged, insertions, deletions };
        }

        filesChanged.push(currentFilePath);

        let currentContent = currentExists
                ? fs.readFileSync(currentFilePath, { encoding: "utf-8" })
                : "",
            backupContent = backupExists
                ? fs.readFileSync(backupFilePath, { encoding: "utf-8" })
                : "";

        // Use Myers diff algorithm (via 'na' which is the diff library)
        computeDiff(currentContent, backupContent).forEach((change) => {
            if (change.added) insertions += change.count || 0;
            if (change.removed) deletions += change.count || 0;
        });

    } catch (err) {
        logError(Error(`FileHistory: Error generating diffStats: ${err}`));
    }

    return { filesChanged, insertions, deletions };
}

// Mapping: Mn4→calculateFileDiffStats, A→currentFilePath, q→backupFileName,
//          K→filesChanged, Y→insertions, z→deletions, na→computeDiff (Myers diff)
```

**What it does:** Computes line-level diff statistics for the dry-run preview in the rewind UI.

**Algorithm - Myers Diff:**
The `na` function is the Myers diff algorithm from the `diff` npm package. It produces an array of change objects:

```javascript
[
  { value: "unchanged line\n", count: 1 },
  { value: "removed line\n", count: 1, removed: true },
  { value: "added line\n", count: 1, added: true },
  ...
]
```

**Why this approach:**
- Myers diff is O(ND) where N is total lines and D is number of differences
- Efficient for small changes (common in code editing)
- Provides both added and removed counts for UI display

---

## 7. Backup File Management

### generateBackupFileName (zVY)

**Location:** chunks.135.mjs:2238-2240

```javascript
// ============================================
// generateBackupFileName - Create unique backup filename
// Location: chunks.135.mjs:2238-2240
// ============================================

// ORIGINAL (for source lookup):
function zVY(A, q) {
    return `${sNY("sha256").update(A).digest("hex").slice(0,16)}@v${q}`
}

// READABLE (for understanding):
function generateBackupFileName(filePath, version) {
    // SHA256 hash of file path (first 16 hex chars) + version suffix
    return `${crypto.createHash("sha256").update(filePath).digest("hex").slice(0, 16)}@v${version}`;
}

// Mapping: zVY→generateBackupFileName, A→filePath, q→version, sNY→crypto.createHash
```

**What it does:** Generates a unique, deterministic filename for backup files.

**Naming Scheme:**
```
{sha256(path)[:16]}@v{version}

Examples:
- /home/user/project/app.ts → a1b2c3d4e5f6a7b8@v1
- /home/user/project/app.ts (second edit) → a1b2c3d4e5f6a7b8@v2
- /home/user/other/file.ts → 9f8e7d6c5b4a3210@v1
```

**Why SHA256 hash:**
- Deterministic: Same path always produces same hash prefix
- Collision-resistant: 16 hex chars = 64-bit space
- No special characters that could cause filesystem issues
- Version suffix allows multiple backups of the same file

### resolveBackupPath (zz6)

**Location:** chunks.135.mjs:2242-2245

```javascript
// ============================================
// resolveBackupPath - Build full backup file path
// Location: chunks.135.mjs:2242-2245
// ============================================

// ORIGINAL (for source lookup):
function zz6(A, q) {
    let K = c8();
    return aN1(K, "file-history", q || R1(), A)
}

// READABLE (for understanding):
function resolveBackupPath(backupFileName, sessionId) {
    let claudeDir = getClaudeConfigDir();  // ~/.claude
    return path.join(claudeDir, "file-history", sessionId || getSessionId(), backupFileName);
}

// Mapping: zz6→resolveBackupPath, A→backupFileName, q→sessionId,
//          c8→getClaudeConfigDir, aN1→path.join, R1→getSessionId
```

**Storage Structure:**
```
~/.claude/
└── file-history/
    ├── session-uuid-1/
    │   ├── a1b2c3d4e5f6a7b8@v1
    │   ├── a1b2c3d4e5f6a7b8@v2
    │   └── 9f8e7d6c5b4a3210@v1
    └── session-uuid-2/
        └── ...
```

### createBackupFile (du8)

**Location:** chunks.135.mjs:2247-2273

```javascript
// ============================================
// createBackupFile - Write versioned backup copy
// Location: chunks.135.mjs:2247-2273
// ============================================

// ORIGINAL (for source lookup):
function du8(A, q) {
    let K = A !== null ? zVY(A, q) : null;
    if (A && K) {
        let Y = $1(),
            z = zz6(K),
            _ = Dn4(z);
        if (!Y.existsSync(_)) Y.mkdirSync(_);
        let w = Y.readFileSync(A, {
            encoding: "utf-8"
        });
        fz(z, w, {
            encoding: "utf-8",
            flush: !0
        });
        let O = Y.statSync(A),
            $ = O.mode;
        Pn4(z, $), d("tengu_file_history_backup_file_created", {
            version: q,
            fileSize: O.size
        })
    }
    return {
        backupFileName: K,
        version: q,
        backupTime: new Date
    }
}

// READABLE (for understanding):
function createBackupFile(filePath, version) {
    // null filePath = new file being created (no backup content)
    let backupFileName = filePath !== null ? generateBackupFileName(filePath, version) : null;

    if (filePath && backupFileName) {
        let fs = getFileSystem(),
            backupPath = resolveBackupPath(backupFileName),
            backupDir = path.dirname(backupPath);

        // Ensure backup directory exists
        if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

        // Copy file content
        let content = fs.readFileSync(filePath, { encoding: "utf-8" });
        fs.writeFileSync(backupPath, content, { encoding: "utf-8", flush: true });

        // Preserve file permissions
        let originalStats = fs.statSync(filePath);
        fs.chmodSync(backupPath, originalStats.mode);

        telemetry("tengu_file_history_backup_file_created", {
            version,
            fileSize: originalStats.size
        });
    }

    return {
        backupFileName,
        version,
        backupTime: new Date
    };
}

// Mapping: du8→createBackupFile, A→filePath, q→version, zVY→generateBackupFileName,
//          zz6→resolveBackupPath, $1→getFileSystem, fz→fs.writeFileSync, Pn4→fs.chmodSync
```

### restoreFileFromBackup (_VY)

**Location:** chunks.135.mjs:2275-2293

```javascript
// ============================================
// restoreFileFromBackup - Copy backup content to original file
// Location: chunks.135.mjs:2275-2293
// ============================================

// ORIGINAL (for source lookup):
function _VY(A, q) {
    let K = $1(),
        Y = zz6(q);
    if (!K.existsSync(Y)) {
        d("tengu_file_history_rewind_restore_file_failed", {}), _6(Error(`FileHistory: [Rewind] Backup file not found: ${Y}`));
        return
    }
    let z = K.readFileSync(Y, {
            encoding: "utf-8"
        }),
        _ = Dn4(A);
    if (!K.existsSync(_)) K.mkdirSync(_);
    fz(A, z, {
        encoding: "utf-8",
        flush: !0
    });
    let w = K.statSync(Y).mode;
    Pn4(A, w)
}

// READABLE (for understanding):
function restoreFileFromBackup(targetFilePath, backupFileName) {
    let fs = getFileSystem(),
        backupPath = resolveBackupPath(backupFileName);

    if (!fs.existsSync(backupPath)) {
        telemetry("tengu_file_history_rewind_restore_file_failed", {});
        logError(Error(`FileHistory: [Rewind] Backup file not found: ${backupPath}`));
        return;
    }

    // Read backup content
    let backupContent = fs.readFileSync(backupPath, { encoding: "utf-8" });

    // Ensure target directory exists
    let targetDir = path.dirname(targetFilePath);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    // Write to target
    fs.writeFileSync(targetFilePath, backupContent, { encoding: "utf-8", flush: true });

    // Preserve permissions from backup
    fs.chmodSync(targetFilePath, fs.statSync(backupPath).mode);
}

// Mapping: _VY→restoreFileFromBackup, A→targetFilePath, q→backupFileName,
//          K→fs, Y→backupPath, zz6→resolveBackupPath, fz→fs.writeFileSync
```

---

## 8. Session Migration — `migrateFileHistoryToNewSession` (KV1)

**Location:** chunks.135.mjs:2337-2389

When a session is resumed with `--resume`, backup files from the previous session need to be copied to the new session directory.

```javascript
// ============================================
// migrateFileHistoryToNewSession - Copy backups on resume
// Location: chunks.135.mjs:2337-2389
// ============================================

// ORIGINAL (for source lookup):
async function KV1(A) {
    if (!iz()) return;
    let q = A.fileHistorySnapshots;
    if (!q || A.messages.length === 0) return;
    let Y = A.messages[A.messages.length - 1]?.sessionId;
    if (!Y) {
        _6(Error("FileHistory: Failed to copy backups on restore (no previous session id)"));
        return
    }
    let z = R1();
    if (Y === z) {
        k(`FileHistory: No need to copy file history for resuming with same session id: ${z}`);
        return
    }
    try {
        let _ = aN1(c8(), "file-history", z);
        await KVY(_, { recursive: !0 });
        let w = 0;
        if (await Promise.allSettled(q.map(async (O) => {
                let $ = Object.values(O.trackedFileBackups).filter((J) => J.backupFileName !== null);
                if (!(await Promise.allSettled($.map(async ({
                        backupFileName: J
                    }) => {
                        let M = zz6(J, Y),
                            D = aN1(_, J);
                        try {
                            await qVY(M, D)
                        } catch (X) {
                            let P = X.code;
                            if (P === "EEXIST") return;
                            if (P === "ENOENT") throw _6(Error(`FileHistory: Failed to copy backup ${J} on restore (backup file does not exist in ${Y})`)), X;
                            _6(Error("FileHistory: Error hard linking backup file from previous session"));
                            try {
                                await AVY(M, D)
                            } catch (W) {
                                throw _6(Error("FileHistory: Error copying over backup from previous session")), W
                            }
                        }
                        k(`FileHistory: Copied backup ${J} from session ${Y} to ${z}`)
                    }))).some((J) => J.status === "rejected")) _l6(O.messageId, O, !1).catch((J) => {
                    _6(Error("FileHistory: Failed to record copy backup snapshot"))
                });
                else w++
            })), w > 0) d("tengu_file_history_resume_copy_failed", {
            numSnapshots: q.length,
            failedSnapshots: w
        })
    } catch (_) {
        _6(_)
    }
}

// READABLE (for understanding):
async function migrateFileHistoryToNewSession(sessionData) {
    if (!isFileCheckpointingEnabled()) return;

    let snapshots = sessionData.fileHistorySnapshots;
    if (!snapshots || sessionData.messages.length === 0) return;

    // Get previous session ID from last message
    let previousSessionId = sessionData.messages[sessionData.messages.length - 1]?.sessionId;
    if (!previousSessionId) {
        logError(Error("FileHistory: Failed to copy backups on restore (no previous session id)"));
        return;
    }

    let currentSessionId = getSessionId();

    // Same session? No migration needed
    if (previousSessionId === currentSessionId) {
        log(`FileHistory: No need to copy file history for resuming with same session id: ${currentSessionId}`);
        return;
    }

    try {
        let newSessionDir = path.join(getClaudeConfigDir(), "file-history", currentSessionId);

        // Create new session directory
        await fs.promises.mkdir(newSessionDir, { recursive: true });

        let failedCount = 0;

        // Process each snapshot
        await Promise.allSettled(snapshots.map(async (snapshot) => {
            let backupsWithFiles = Object.values(snapshot.trackedFileBackups)
                .filter((backup) => backup.backupFileName !== null);

            let results = await Promise.allSettled(backupsWithFiles.map(async ({ backupFileName }) => {
                let oldPath = resolveBackupPath(backupFileName, previousSessionId);
                let newPath = path.join(newSessionDir, backupFileName);

                try {
                    // Try hard link first (faster, saves space)
                    await fs.promises.link(oldPath, newPath);
                } catch (err) {
                    if (err.code === "EEXIST") return;  // Already exists, skip

                    if (err.code === "ENOENT") {
                        throw Error(`FileHistory: Backup file not found: ${backupFileName}`);
                    }

                    // Hard link failed, try copy
                    logError(Error("FileHistory: Error hard linking backup file"));
                    await fs.promises.copyFile(oldPath, newPath);
                }

                log(`FileHistory: Copied backup ${backupFileName} from session ${previousSessionId} to ${currentSessionId}`);
            }));

            // If any copy failed, record the snapshot to JSONL for recovery
            if (results.some((r) => r.status === "rejected")) {
                recordFileHistorySnapshot(snapshot.messageId, snapshot, false).catch(() => {
                    logError(Error("FileHistory: Failed to record copy backup snapshot"));
                });
            } else {
                failedCount++;
            }
        }));

        if (failedCount > 0) {
            telemetry("tengu_file_history_resume_copy_failed", {
                numSnapshots: snapshots.length,
                failedSnapshots: failedCount
            });
        }
    } catch (err) {
        logError(err);
    }
}

// Mapping: KV1→migrateFileHistoryToNewSession, A→sessionData, q→snapshots,
//          Y→previousSessionId, z→currentSessionId, KVY→fs.promises.mkdir,
//          qVY→fs.promises.link, AVY→fs.promises.copyFile, _l6→recordFileHistorySnapshot
```

**What it does:** Copies backup files from the previous session to the new session directory when resuming.

**Migration Strategy:**
1. **Hard link first**: Try `link()` for space efficiency (same inode, no duplicate storage)
2. **Fallback to copy**: If hard link fails (cross-device, permissions), use `copyFile()`
3. **Error handling**: EEXIST is OK (already copied), ENOENT is critical (backup missing)

---

## 9. Persistence Layer

### hydrateFileHistoryFromSnapshots (qV1)

**Location:** chunks.135.mjs:2315-2335

```javascript
// ============================================
// hydrateFileHistoryFromSnapshots - Reconstruct state from JSONL
// Location: chunks.135.mjs:2315-2335
// ============================================

// ORIGINAL (for source lookup):
function qV1(A, q) {
    if (!iz()) return;
    let K = [],
        Y = new Set;
    for (let z of A) {
        let _ = {};
        for (let [w, O] of Object.entries(z.trackedFileBackups)) {
            let $ = fn4(w);
            Y.add($), _[$] = O
        }
        K.push({
            ...z,
            trackedFileBackups: _
        })
    }
    q({
        snapshots: K,
        trackedFiles: Y,
        snapshotSequence: K.length
    })
}

// READABLE (for understanding):
function hydrateFileHistoryFromSnapshots(savedSnapshots, setState) {
    if (!isFileCheckpointingEnabled()) return;

    let snapshots = [],
        trackedFiles = new Set();

    // Process each saved snapshot
    for (let snapshot of savedSnapshots) {
        let normalizedBackups = {};

        // Normalize paths in backup records
        for (let [filePath, backupRecord] of Object.entries(snapshot.trackedFileBackups)) {
            let normalizedPath = normalizeFilePath(filePath);
            trackedFiles.add(normalizedPath);
            normalizedBackups[normalizedPath] = backupRecord;
        }

        snapshots.push({
            ...snapshot,
            trackedFileBackups: normalizedBackups
        });
    }

    // Initialize React state
    setState({
        snapshots,
        trackedFiles,
        snapshotSequence: snapshots.length
    });
}

// Mapping: qV1→hydrateFileHistoryFromSnapshots, A→savedSnapshots, q→setState,
//          K→snapshots, Y→trackedFiles, fn4→normalizeFilePath
```

**What it does:** Reconstructs the in-memory `fileHistory` state from persisted JSONL snapshots on session resume.

**Why path normalization:**
Sessions may be resumed from different working directories. Normalization ensures paths are stored relative to the project root, making them portable across resumes.

### recordFileHistorySnapshot (_l6)

**Location:** cli.chunks.mjs:7524 (exported reference)

This function writes snapshot records to the session JSONL file. It's called:
1. By `trackFileEdit` when a file is first tracked (isPartialUpdate=true)
2. By `createSnapshotForMessage` when a message completes (isPartialUpdate=false)
3. By `migrateFileHistoryToNewSession` for recovery after failed migration

The actual implementation is in the SessionDatabase module (`Jz` - getSessionDatabase).

---

## Summary: Complete Rewind Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         REWIND FLOW                                  │
└─────────────────────────────────────────────────────────────────────┘

User sends message
        │
        ▼
┌───────────────────────────┐
│ createSnapshotForMessage  │  ← Creates empty snapshot for message
│    (lf6)                  │
└───────────────────────────┘
        │
        ▼
Claude calls Write/Edit tool
        │
        ▼
┌───────────────────────────┐
│    trackFileEdit (R66)    │  ← Creates backup BEFORE modification
│                           │     • First-edit-only pattern
│                           │     • Backup: ~/.claude/file-history/
└───────────────────────────┘
        │
        ▼
Tool modifies file
        │
        ▼
Message complete
        │
        ▼
┌───────────────────────────┐
│ createSnapshotForMessage  │  ← Finalizes snapshot
│    (lf6)                  │     • Creates new backups for changed files
│                           │     • Reuses backups for unchanged files
└───────────────────────────┘
        │
        ▼
User triggers /rewind or Esc+Esc
        │
        ▼
┌───────────────────────────┐
│ RewindMessageSelector     │  ← UI shows message list
│    (zs8)                  │     • Diff stats for each checkpoint
│                           │     • Restore options menu
└───────────────────────────┘
        │
        ▼
User selects message and option
        │
        ├─── "Restore code and conversation" ───┐
        │                                       ▼
        │                   ┌───────────────────────────────┐
        │                   │   rewindHandler (sN1)         │
        │                   │   rewindAndRestoreFiles (Zn4) │
        │                   │                               │
        │                   │   For each tracked file:      │
        │                   │   • fileNeedsRestore (cu8)    │
        │                   │   • restoreFileFromBackup     │
        │                   │     (_VY)                     │
        │                   └───────────────────────────────┘
        │                                       │
        ├─── "Restore conversation" ──────────►│  (file restore skipped)
        │                                       │
        ├─── "Restore code" ─────────────────►┘  (conversation slice skipped)
        │
        ├─── "Summarize from here" ─────────► performPartialCompaction (Wqq)
        │
        └─── "Never mind" ──────────────────► Close UI
```

---

## 10. Helper Functions

### snapshotExistsForMessage (tN1)

**Location:** chunks.135.mjs:2102-2105

```javascript
// ============================================
// snapshotExistsForMessage - Check if snapshot exists for a message
// Location: chunks.135.mjs:2102-2105
// ============================================

// ORIGINAL (for source lookup):
function tN1(A, q) {
    if (!iz()) return !1;
    return A.snapshots.some((K) => K.messageId === q)
}

// READABLE (for understanding):
function snapshotExistsForMessage(fileHistory, messageId) {
    if (!isFileCheckpointingEnabled()) return false;
    return fileHistory.snapshots.some((snapshot) => snapshot.messageId === messageId);
}

// Mapping: tN1→snapshotExistsForMessage, A→fileHistory, q→messageId, iz→isFileCheckpointingEnabled
```

**What it does:** Quick check to determine if a snapshot exists for a given message ID.

**Used by:** `handleRewindRequest` (thq) to validate rewind requests from the API.

### getDryRunDiffStats (eN1)

**Location:** chunks.135.mjs:2107-2112

```javascript
// ============================================
// getDryRunDiffStats - Get diff stats without modifying files
// Location: chunks.135.mjs:2107-2112
// ============================================

// ORIGINAL (for source lookup):
function eN1(A, q) {
    if (!iz()) return;
    let K = A.snapshots.findLast((Y) => Y.messageId === q);
    if (!K) return;
    return Zn4(A, K, !0)
}

// READABLE (for understanding):
function getDryRunDiffStats(fileHistory, messageId) {
    if (!isFileCheckpointingEnabled()) return;

    let targetSnapshot = fileHistory.snapshots.findLast(
        (snapshot) => snapshot.messageId === messageId
    );
    if (!targetSnapshot) return;

    // Call rewindAndRestoreFiles in dry-run mode
    return rewindAndRestoreFiles(fileHistory, targetSnapshot, true);
}

// Mapping: eN1→getDryRunDiffStats, A→fileHistory, q→messageId, Zn4→rewindAndRestoreFiles
```

**What it does:** Returns diff stats for a potential rewind operation without actually modifying files.

**How it works:** Calls `rewindAndRestoreFiles` with `dryRun=true`, which computes insertions/deletions but doesn't write files.

### hasCodeChangesToRewind (Wn4)

**Location:** chunks.135.mjs:2114-2133

```javascript
// ============================================
// hasCodeChangesToRewind - Check if any files need restoration
// Location: chunks.135.mjs:2114-2133
// ============================================

// ORIGINAL (for source lookup):
function Wn4(A, q) {
    if (!iz()) return !1;
    let K = A.snapshots.findLast((z) => z.messageId === q);
    if (!K) return !1;
    let Y = $1();
    for (let z of A.trackedFiles) try {
        let _ = AV1(z),
            w = K.trackedFileBackups[z],
            O = w ? w.backupFileName : Gn4(z, A);
        if (O === void 0) continue;
        if (O === null) {
            if (Y.existsSync(_)) return !0;
            continue
        }
        if (cu8(_, O)) return !0
    } catch (_) {
        _6(_)
    }
    return !1
}

// READABLE (for understanding):
function hasCodeChangesToRewind(fileHistory, messageId) {
    if (!isFileCheckpointingEnabled()) return false;

    let targetSnapshot = fileHistory.snapshots.findLast(
        (snapshot) => snapshot.messageId === messageId
    );
    if (!targetSnapshot) return false;

    let fs = getFileSystem();

    for (let trackedPath of fileHistory.trackedFiles) {
        try {
            let absolutePath = resolveTrackedFilePath(trackedPath);
            let backupRecord = targetSnapshot.trackedFileBackups[trackedPath];
            let backupFileName = backupRecord
                ? backupRecord.backupFileName
                : findBackupInOlderSnapshot(trackedPath, fileHistory);

            if (backupFileName === undefined) continue;  // No backup found

            if (backupFileName === null) {
                // File was deleted at snapshot time
                if (fs.existsSync(absolutePath)) return true;  // File exists now, needs deletion
                continue;
            }

            // Check if current file differs from backup
            if (fileNeedsRestore(absolutePath, backupFileName)) return true;

        } catch (err) {
            logError(err);
        }
    }

    return false;
}

// Mapping: Wn4→hasCodeChangesToRewind, A→fileHistory, q→messageId,
//          AV1→resolveTrackedFilePath, Gn4→findBackupInOlderSnapshot, cu8→fileNeedsRestore
```

**What it does:** Determines whether rewinding to a specific message would change any files.

**Why this is needed:** The UI uses this to determine which restore options to show:
- If no code changes: Only show "Restore conversation"
- If code changes exist: Show full option set

### findBackupInOlderSnapshot (Gn4)

**Location:** chunks.135.mjs:2295-2300

```javascript
// ============================================
// findBackupInOlderSnapshot - Fallback lookup for original backup
// Location: chunks.135.mjs:2295-2300
// ============================================

// ORIGINAL (for source lookup):
function Gn4(A, q) {
    for (let K of q.snapshots) {
        let Y = K.trackedFileBackups[A];
        if (Y !== void 0 && Y.version === 1) return Y.backupFileName
    }
    return
}

// READABLE (for understanding):
function findBackupInOlderSnapshot(filePath, fileHistory) {
    // Search all snapshots for the version 1 backup (original state)
    for (let snapshot of fileHistory.snapshots) {
        let backupRecord = snapshot.trackedFileBackups[filePath];
        if (backupRecord !== undefined && backupRecord.version === 1) {
            return backupRecord.backupFileName;
        }
    }
    return undefined;  // No backup found
}

// Mapping: Gn4→findBackupInOlderSnapshot, A→filePath, q→fileHistory
```

**What it does:** Searches older snapshots for the original backup (version 1) of a file.

**Why version 1 matters:** The version 1 backup represents the file's state **before any Claude modifications**. When a file isn't tracked in the target snapshot, we look for its original state in older snapshots.

### normalizeFilePath (fn4)

**Location:** chunks.135.mjs:2303-2308

```javascript
// ============================================
// normalizeFilePath - Normalize path for consistent tracking
// Location: chunks.135.mjs:2303-2308
// ============================================

// ORIGINAL (for source lookup):
function fn4(A) {
    if (!Xn4(A)) return A;
    let q = AA();
    if (A.startsWith(q)) return tNY(q, A);
    return A
}

// READABLE (for understanding):
function normalizeFilePath(filePath) {
    // If not an absolute path, return as-is
    if (!isAbsolute(filePath)) return filePath;

    let cwd = getCwd();

    // If path starts with cwd, make it relative
    if (filePath.startsWith(cwd)) {
        return path.relative(cwd, filePath);
    }

    return filePath;
}

// Mapping: fn4→normalizeFilePath, A→filePath, Xn4→isAbsolute, AA→getCwd, tNY→path.relative
```

**What it does:** Converts absolute paths to relative paths for consistent tracking across sessions.

**Why normalization matters:**
- Sessions may be resumed from different directories
- Relative paths are portable across working directory changes
- Ensures the same file is tracked consistently

### resolveTrackedFilePath (AV1)

**Location:** chunks.135.mjs:2310-2313

```javascript
// ============================================
// resolveTrackedFilePath - Convert tracked path to absolute
// Location: chunks.135.mjs:2310-2313
// ============================================

// ORIGINAL (for source lookup):
function AV1(A) {
    if (Xn4(A)) return A;
    return aN1(AA(), A)
}

// READABLE (for understanding):
function resolveTrackedFilePath(trackedPath) {
    // If already absolute, return as-is
    if (isAbsolute(trackedPath)) return trackedPath;

    // Otherwise, resolve relative to cwd
    return path.join(getCwd(), trackedPath);
}

// Mapping: AV1→resolveTrackedFilePath, A→trackedPath, Xn4→isAbsolute, aN1→path.join, AA→getCwd
```

**What it does:** Converts a tracked (possibly relative) path back to an absolute path for file operations.

**Complementary to normalizeFilePath:**
- `normalizeFilePath`: absolute → relative (for storage)
- `resolveTrackedFilePath`: relative → absolute (for operations)

---

## 11. Telemetry Events

The rewind system emits several telemetry events for monitoring and debugging:

| Event Name | When Fired | Data |
|------------|------------|------|
| `tengu_message_selector_opened` | Rewind UI opened | `{}` |
| `tengu_message_selector_selected` | User selects a message | `{ index_from_end, message_type, is_current_prompt }` |
| `tengu_message_selector_restore_option_selected` | User picks restore option | `{ option }` |
| `tengu_message_selector_cancelled` | User cancels rewind | `{}` |
| `tengu_file_history_track_edit_success` | File tracked successfully | `{ isNewFile, version }` |
| `tengu_file_history_track_edit_failed` | Tracking failed | `{}` |
| `tengu_file_history_snapshot_success` | Snapshot created | `{ trackedFilesCount, snapshotCount }` |
| `tengu_file_history_snapshot_failed` | Snapshot failed | `{}` |
| `tengu_file_history_backup_file_created` | Backup file written | `{ version, fileSize }` |
| `tengu_file_history_backup_deleted_file` | Tracked file was deleted | `{ version }` |
| `tengu_file_history_rewind_success` | Rewind completed | `{ trackedFilesCount, filesChangedCount }` |
| `tengu_file_history_rewind_failed` | Rewind failed | `{ trackedFilesCount, snapshotFound }` |
| `tengu_file_history_resume_copy_failed` | Session migration had failures | `{ numSnapshots, failedSnapshots }` |

---

## Version History

| Version | Changes |
|---------|---------|
| v2.1.76 | Verified all symbol mappings against source code; Added helper function documentation; Added telemetry events |