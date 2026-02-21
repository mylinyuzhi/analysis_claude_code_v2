# Implementation Report - Rewind / Checkpointing (Module 35)

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Rewind module section

Key functions in this document:
- `trackFileEdit` (Xt) - Track a file edit at message time
- `createSnapshotForMessage` (WW1) - Snapshot all tracked files when a message ends
- `rewindHandler` (kP6) - Execute rewind to a given message
- `rewindAndRestoreFiles` (DF4) - Physical file restoration from backup
- `createBackupFile` (TkA) - Create versioned backup copy
- `generateBackupFileName` (TvY) - SHA256-based content-addressed backup filename
- `resolveBackupPath` (Jt) - Resolve backup filename to absolute disk path
- `fileNeedsRestore` (jF4) - Compare current vs backup to avoid unnecessary writes
- `restoreFileFromBackup` (vvY) - Write backup content to original file path
- `calculateFileDiffStats` (OF4) - Compute diff +/- for dry-run preview
- `findBackupInOlderSnapshot` (EvY) - Fallback lookup in older snapshots
- `checkRewindCapability` (mMq) - Dry-run validation entry point
- `recordFileHistorySnapshot` (iQ1) - Persist snapshot to session .jsonl database
- `onRestoreMessage` - Conversation slice-and-restore callback
- `onSummarize` - Targeted summarization callback

---

## 0. Storage Architecture: NOT Git — Custom File Backup System

> **Key fact:** The rewind feature has NO dependency on Git. It does not use commits, branches, stashes, or any Git object. It implements a fully independent versioned file backup system.

### On-Disk Layout

```
~/.claude/                              ← CLAUDE_CONFIG_DIR (default: $HOME/.claude)
├── file-history/
│   └── {sessionId}/
│       ├── a1b2c3d4e5f6a7b8@v1        ← backup of file A before first edit
│       ├── a1b2c3d4e5f6a7b8@v2        ← backup of file A after next change
│       ├── f9e8d7c6b5a49382@v1        ← backup of file B before first edit
│       └── ...
└── projects/
    └── {sessionId}.jsonl              ← snapshot metadata (messageId → backupFileName map)
```

### Backup Filename Generation — `generateBackupFileName` (TvY)

```javascript
// ============================================
// generateBackupFileName - SHA256 content-addressed backup filename
// Location: chunks.134.mjs:137-139
// ============================================

// ORIGINAL (for source lookup):
function TvY(A, q) {
    return `${ZvY("sha256").update(A).digest("hex").slice(0, 16)}@v${q}`
}

// READABLE (for understanding):
function generateBackupFileName(filePath, version) {
    return `${createHash("sha256").update(filePath).digest("hex").slice(0, 16)}@v${version}`
}

// Mapping: TvY→generateBackupFileName, A→filePath, q→version, ZvY→createHash
```

**What it does:** Hashes the **file path** (not content) with SHA256, takes the first 16 hex characters, appends `@v{version}`. Example: `/home/user/project/src/auth.ts` at version 2 → `a1b2c3d4e5f6a7b8@v2`.

**Why path-based (not content-based)?**
Content-addressed storage would allow deduplication across identical files, but the primary goal here is a **per-file timeline**, not a content store. Path-based names make it trivial to find all backups for a given file (same path prefix + incrementing `@v`), and the hash keeps filenames short and filesystem-safe even for deeply nested paths.

### Backup Path Resolution — `resolveBackupPath` (Jt)

```javascript
// ============================================
// resolveBackupPath - Construct absolute path to a backup file
// Location: chunks.134.mjs:141-144
// ============================================

// ORIGINAL (for source lookup):
function Jt(A, q) {
    let K = O8();
    return _F4(K, "file-history", q || U6(), A)
}

// READABLE (for understanding):
function resolveBackupPath(backupFileName, sessionId) {
    let configDir = getClaudeConfigDir();    // ~/.claude by default
    return joinPaths(configDir, "file-history", sessionId || getCurrentSessionId(), backupFileName)
}

// Mapping: Jt→resolveBackupPath, A→backupFileName, q→sessionId, O8→getClaudeConfigDir, U6→getCurrentSessionId, _F4→joinPaths
```

### Snapshot Metadata Persistence — `recordFileHistorySnapshot` (iQ1)

```javascript
// ============================================
// recordFileHistorySnapshot - Persist snapshot to session database
// Location: chunks.173.mjs:1992-1994
// ============================================

// ORIGINAL (for source lookup):
async function iQ1(A, q, K) {
    await YD().insertFileHistorySnapshot(A, q, K)
}

// READABLE (for understanding):
async function recordFileHistorySnapshot(messageId, snapshot, isSnapshotUpdate) {
    await getSessionDatabase().insertFileHistorySnapshot(messageId, snapshot, isSnapshotUpdate)
}

// Mapping: iQ1→recordFileHistorySnapshot, A→messageId, q→snapshot, K→isSnapshotUpdate, YD→getSessionDatabase
```

The snapshot (which maps `normalizedFilePath → BackupRecord`) is written into the session's `.jsonl` file at `~/.claude/projects/{sessionId}.jsonl`. This is the same JSONL file that stores conversation messages and other session state.

**`isSnapshotUpdate = true`** (called from `trackFileEdit`): The record is flagged as an in-progress update, meaning the snapshot for this message is not yet finalized.
**`isSnapshotUpdate = false`** (called from `createSnapshotForMessage`): The snapshot is finalized — this is the canonical checkpoint for this `messageId`.

### Two-Layer Storage Design

| Layer | What | Where | Purpose |
|-------|------|-------|---------|
| **Backup files** | Actual file content copies | `~/.claude/file-history/{sessionId}/` | Physical restore source |
| **Snapshot metadata** | `messageId → {filePath → backupFileName}` map | `~/.claude/projects/{sessionId}.jsonl` | Lookup index for restore |

Restore requires both: the `.jsonl` to find which backup filename corresponds to a given message+file, and the `file-history/` directory to get the actual content.

---

## 1. File History Data Model

The checkpoint system's core data structure is the `fileHistory` state atom:

```
FileHistory {
  trackedFiles: Set<normalizedFilePath>   // all files ever touched this session
  snapshots: Snapshot[]                   // one per user message
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

---

## 2. Phase 1: File Edit Tracking — `trackFileEdit` (Xt)

This is called every time a Claude tool (Write, Edit, etc.) modifies a file, **before** the modification occurs.

```javascript
// ============================================
// trackFileEdit - Record a file edit into current snapshot
// Location: chunks.133.mjs:2760-2793
// ============================================

// ORIGINAL (for source lookup):
async function Xt(A, q, K) {
    if (!z2()) return;
    A((Y) => {
        try {
            let z = Y.snapshots.at(-1);
            if (!z) return K1(Error("FileHistory: Missing most recent snapshot")), c("tengu_file_history_track_edit_failed", {}), Y;
            let w = MF4(q);
            if (z.trackedFileBackups[w]) return Y;
            let H = Y.trackedFiles.has(w) ? Y.trackedFiles : new Set(Y.trackedFiles).add(w),
                O = !b1().existsSync(q),
                _ = O ? TkA(null, 1) : TkA(q, 1),
                J = X61(z);
            J.trackedFileBackups[w] = _;
            let X = { ...Y, snapshots: [...Y.snapshots.slice(0, -1), J], trackedFiles: H };
            return PF4(X), iQ1(K, J, !0).catch((D) => {
                K1(Error(`FileHistory: Failed to record snapshot: ${D}`))
            }), c("tengu_file_history_track_edit_success", { isNewFile: O, version: _.version }), X
        } catch (z) {
            return K1(z), c("tengu_file_history_track_edit_failed", {}), Y
        }
    })
}

// READABLE (for understanding):
async function trackFileEdit(updateFileHistoryState, filePath, messageId) {
    if (!isFileCheckpointingEnabled()) return;
    updateFileHistoryState((fileHistoryState) => {
        try {
            let mostRecentSnapshot = fileHistoryState.snapshots.at(-1);
            if (!mostRecentSnapshot) return logError(Error("FileHistory: Missing most recent snapshot")),
                telemetry("tengu_file_history_track_edit_failed", {}), fileHistoryState;
            let normalizedPath = normalizeFilePath(filePath);
            if (mostRecentSnapshot.trackedFileBackups[normalizedPath]) return fileHistoryState;  // already tracked
            let updatedTrackedFiles = fileHistoryState.trackedFiles.has(normalizedPath)
                    ? fileHistoryState.trackedFiles
                    : new Set(fileHistoryState.trackedFiles).add(normalizedPath),
                isNewFile = !getFileSystem().existsSync(filePath),
                backupRecord = isNewFile ? createBackupFile(null, 1) : createBackupFile(filePath, 1),
                copiedSnapshot = copySnapshot(mostRecentSnapshot);
            copiedSnapshot.trackedFileBackups[normalizedPath] = backupRecord;
            let newState = { ...fileHistoryState,
                snapshots: [...fileHistoryState.snapshots.slice(0, -1), copiedSnapshot],
                trackedFiles: updatedTrackedFiles };
            return persistFileHistoryState(newState), recordFileHistorySnapshot(messageId, copiedSnapshot, true)
                .catch((e) => logError(Error(`FileHistory: Failed to record snapshot: ${e}`))),
                telemetry("tengu_file_history_track_edit_success", { isNewFile, version: backupRecord.version }), newState
        } catch (error) {
            return logError(error), telemetry("tengu_file_history_track_edit_failed", {}), fileHistoryState
        }
    })
}

// Mapping: Xt→trackFileEdit, A→updateFileHistoryState, q→filePath, K→messageId, Y→fileHistoryState,
//          z→mostRecentSnapshot, w→normalizedPath, H→updatedTrackedFiles, O→isNewFile, _→backupRecord,
//          J→copiedSnapshot, X→newState, MF4→normalizeFilePath, X61→copySnapshot, PF4→persistFileHistoryState
```

### Algorithm: First-Edit-Only Backup

**What it does:** Captures the pre-edit state of a file into a versioned backup.

**How it works:**
1. Check `mostRecentSnapshot.trackedFileBackups[normalizedPath]` — if already set, **return early** (no duplicate backup)
2. If the file doesn't exist yet (`isNewFile = true`), create a `BackupRecord` with `backupFileName: null` and `version: 1`
3. Otherwise, call `createBackupFile(filePath, 1)` to copy the file to the backup location
4. **Mutate the most recent snapshot in-place** (via shallow copy), replacing the `snapshots[-1]` in state
5. Persist state and async-sync to remote (for remote session support)

**Why this approach — "first edit wins":**
Only the **first** modification per file per message is captured. This preserves the "before Claude touched this file" state, which is what users care about when rewinding. Subsequent edits within the same message would only record intermediate states, not the original.

**Key insight:** The backup is of the state **before** the current message's edits, not after. This means rewinding to message N restores files to their state at the start of message N.

---

## 3. Phase 2: Snapshot Finalization — `createSnapshotForMessage` (WW1)

Called when a message's turn completes (all tool calls done), to create the permanent checkpoint.

```javascript
// ============================================
// createSnapshotForMessage - Finalize snapshot at message end
// Location: chunks.133.mjs:334285-334350
// ============================================

// ORIGINAL (for source lookup):
async function WW1(A, q) {
    if (!z2()) return;
    A((K) => {
        try {
            let Y = b1(), z = new Date, w = {}, H = K.snapshots.at(-1);
            if (H) {
                for (let _ of K.trackedFiles) try {
                    let J = EkA(_);
                    if (!Y.existsSync(J)) {
                        let X = H.trackedFileBackups[_], D = X ? X.version + 1 : 1;
                        w[_] = { backupFileName: null, version: D, backupTime: new Date },
                            c("tengu_file_history_backup_deleted_file", { version: D })
                    } else {
                        let X = H.trackedFileBackups[_];
                        if (X && X.backupFileName !== null && !jF4(J, X.backupFileName)) {
                            w[_] = X; continue
                        }
                        let D = X ? X.version + 1 : 1, j = TkA(J, D);
                        w[_] = j
                    }
                } catch (J) { K1(J), c("tengu_file_history_backup_file_failed", {}) }
            }
            let $ = { messageId: q, trackedFileBackups: w, timestamp: z },
                O = { ...K, snapshots: [...K.snapshots, $] };
            return PF4(O), kvY(K, O), iQ1(q, $, !1).catch((_) => {
                K1(Error(`FileHistory: Failed to record snapshot: ${_}`))
            }), c("tengu_file_history_snapshot_success", {
                trackedFilesCount: K.trackedFiles.size, snapshotCount: O.snapshots.length
            }), O
        } catch (Y) { return K1(Y), c("tengu_file_history_snapshot_failed", {}), K }
    })
}

// READABLE (for understanding):
async function createSnapshotForMessage(stateUpdater, messageId) {
    if (!isFileHistoryEnabled()) return;
    stateUpdater((currentHistory) => {
        try {
            let fs = getNodeFileSystem(), now = new Date, backups = {},
                previousSnapshot = currentHistory.snapshots.at(-1);
            if (previousSnapshot) {
                for (let trackedPath of currentHistory.trackedFiles) try {
                    let actualPath = resolveTrackedFilePath(trackedPath);
                    if (!fs.existsSync(actualPath)) {
                        // File was deleted during this message
                        let prev = previousSnapshot.trackedFileBackups[trackedPath],
                            version = prev ? prev.version + 1 : 1;
                        backups[trackedPath] = { backupFileName: null, version, backupTime: new Date };
                        telemetry("tengu_file_history_backup_deleted_file", { version });
                    } else {
                        let prev = previousSnapshot.trackedFileBackups[trackedPath];
                        // Optimization: reuse backup if file hasn't changed
                        if (prev && prev.backupFileName !== null && !fileNeedsRestore(actualPath, prev.backupFileName)) {
                            backups[trackedPath] = prev; continue;
                        }
                        let version = prev ? prev.version + 1 : 1;
                        backups[trackedPath] = createBackupFile(actualPath, version);
                    }
                } catch (e) { logError(e); telemetry("tengu_file_history_backup_file_failed", {}); }
            }
            let newSnapshot = { messageId, trackedFileBackups: backups, timestamp: now },
                newHistory = { ...currentHistory, snapshots: [...currentHistory.snapshots, newSnapshot] };
            return persistFileHistory(newHistory), checkForHistoryChanges(currentHistory, newHistory),
                recordRemoteSnapshot(messageId, newSnapshot, false).catch(e => logError(Error(`FileHistory: Failed: ${e}`))),
                telemetry("tengu_file_history_snapshot_success", {
                    trackedFilesCount: currentHistory.trackedFiles.size,
                    snapshotCount: newHistory.snapshots.length
                }), newHistory;
        } catch (e) { return logError(e); telemetry("tengu_file_history_snapshot_failed", {}); return currentHistory; }
    })
}

// Mapping: WW1→createSnapshotForMessage, A→stateUpdater, q→messageId, K→currentHistory,
//          Y→fs, z→now, w→backups, H→previousSnapshot, _→trackedPath, J→actualPath,
//          X→prevBackup, D→version, j→backupRecord, $→newSnapshot, O→newHistory
```

### Algorithm: Incremental Snapshot with Deduplication

**What it does:** Walks all tracked files and creates/reuses backups to form a complete snapshot.

**How it works:**
1. Iterate all `trackedFiles` in the current history
2. For each file:
   - **Deleted**: Record `backupFileName: null` with incremented version
   - **Unchanged** (`fileNeedsRestore` returns false for prev backup): **Reuse** the existing `BackupRecord` — no new file copy needed
   - **Changed or new**: Call `createBackupFile` to write a new versioned copy
3. Append the new `Snapshot` to the snapshots array
4. Persist and optionally sync to remote

**The deduplication optimization:**
`fileNeedsRestore(actualPath, prev.backupFileName)` does a multi-tier comparison:
1. Existence check (one exists, other doesn't → need restore)
2. Mode + size check (fast, no content read)
3. Modification time shortcut (if file is older than backup → unchanged)
4. Content comparison (final, definitive check)

This avoids writing duplicate backup files for unchanged files between messages, which could be the majority of tracked files.

---

## 4. Phase 3: Backup File Creation — `createBackupFile` (TkA)

```javascript
// ============================================
// createBackupFile - Write versioned backup to backup directory
// Location: chunks.134.mjs:146-172
// ============================================

// ORIGINAL (for source lookup):
function TkA(A, q) {
    let K = A !== null ? TvY(A, q) : null;
    if (A && K) {
        let Y = b1(), z = Jt(K), w = vkA(z);
        if (!Y.existsSync(w)) Y.mkdirSync(w);
        let H = Y.readFileSync(A, { encoding: "utf-8" });
        c8(z, H, { encoding: "utf-8", flush: true });
        let $ = Y.statSync(A), O = $.mode;
        XF4(z, O), c("tengu_file_history_backup_file_created", { version: q, fileSize: $.size })
    }
    return { backupFileName: K, version: q, backupTime: new Date }
}

// READABLE (for understanding):
function createBackupFile(originalFilePath, version) {
    let backupFileName = originalFilePath !== null ? generateBackupFileName(originalFilePath, version) : null;
    if (originalFilePath && backupFileName) {
        let fs = getFileSystem(),
            backupFilePath = resolveBackupPath(backupFileName),
            backupDir = getDirectoryPath(backupFilePath);
        if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);
        let content = fs.readFileSync(originalFilePath, { encoding: "utf-8" });
        writeFileSync(backupFilePath, content, { encoding: "utf-8", flush: true });
        let stats = fs.statSync(originalFilePath), mode = stats.mode;
        setFilePermissions(backupFilePath, mode);
        telemetry("tengu_file_history_backup_file_created", { version, fileSize: stats.size });
    }
    return { backupFileName, version, backupTime: new Date }
}

// Mapping: TkA→createBackupFile, A→originalFilePath, q→version, K→backupFileName,
//          TvY→generateBackupFileName, Jt→resolveBackupPath, vkA→getDirectoryPath,
//          c8→writeFileSync, XF4→setFilePermissions
```

**Key insight:** File permissions (`mode`) are preserved alongside content. This ensures restored files don't have altered executable bits or read-only flags.

---

## 5. Phase 4: Restore Execution — `rewindHandler` (kP6) + `rewindAndRestoreFiles` (DF4)

### `rewindHandler` (kP6)

```javascript
// ============================================
// rewindHandler - Execute rewind to a specific message's snapshot
// Location: chunks.134.mjs:334341-334368
// ============================================

// ORIGINAL (for source lookup):
async function kP6(A, q) {
    if (!z2()) return;
    let K = null;
    if (A((Y) => {
        let z = Y;
        try {
            let w = Y.snapshots.findLast(($) => $.messageId === q);
            if (!w) return K1(Error(`FileHistory: Snapshot for ${q} not found`)),
                c("tengu_file_history_rewind_failed", { trackedFilesCount: z.trackedFiles.size, snapshotFound: false }),
                K = Error("The selected snapshot was not found"), z;
            h(`FileHistory: [Rewind] Rewinding to snapshot for ${q}`);
            let H = DF4(z, w, false);
            c("tengu_file_history_rewind_success", { trackedFilesCount: z.trackedFiles.size, filesChangedCount: H?.filesChanged?.length })
        } catch (w) {
            K = w; K1(w); c("tengu_file_history_rewind_failed", { trackedFilesCount: z.trackedFiles.size, snapshotFound: true })
        }
        return z
    }), K) throw K
}

// READABLE (for understanding):
async function rewindHandler(stateUpdater, messageId) {
    if (!isFileHistoryEnabled()) return;
    let error = null;
    stateUpdater((currentHistory) => {
        let history = currentHistory;
        try {
            let snapshot = currentHistory.snapshots.findLast(s => s.messageId === messageId);
            if (!snapshot) {
                logError(Error(`FileHistory: Snapshot for ${messageId} not found`));
                telemetry("tengu_file_history_rewind_failed", { trackedFilesCount: history.trackedFiles.size, snapshotFound: false });
                error = Error("The selected snapshot was not found");
                return history;
            }
            let result = rewindAndRestoreFiles(history, snapshot, false);  // isDryRun = false
            telemetry("tengu_file_history_rewind_success", {
                trackedFilesCount: history.trackedFiles.size, filesChangedCount: result?.filesChanged?.length
            });
        } catch (e) {
            error = e; logError(e);
            telemetry("tengu_file_history_rewind_failed", { trackedFilesCount: history.trackedFiles.size, snapshotFound: true });
        }
        return history;
    });
    if (error) throw error;
}

// Mapping: kP6→rewindHandler, A→stateUpdater, q→messageId, K→error, Y/z→currentHistory, w→snapshot, H→result
```

**Why `findLast`?** If the same `messageId` appears in multiple snapshots (possible in edge cases), the most recent snapshot wins, which correctly reflects the final state at that message.

### `rewindAndRestoreFiles` (DF4)

```javascript
// ============================================
// rewindAndRestoreFiles - Restore all tracked files to snapshot state
// Location: chunks.134.mjs:334380-334415
// ============================================

// ORIGINAL (for source lookup):
function DF4(A, q, K) {
    let Y = b1(), z = [], w = 0, H = 0;
    for (let $ of A.trackedFiles) try {
        let O = EkA($), _ = q.trackedFileBackups[$],
            J = _ ? _.backupFileName : EvY($, A);
        if (J === void 0)
            K1(Error("FileHistory: Error finding the backup file to apply")),
            c("tengu_file_history_rewind_restore_file_failed", { dryRun: K });
        else if (J === null) {
            if (Y.existsSync(O)) {
                if (K) { let X = OF4(O, void 0); w += X?.insertions || 0; H += X?.deletions || 0 }
                else Y.unlinkSync(O), h(`FileHistory: [Rewind] Deleted ${O}`);
                z.push(O)
            }
        } else if (K) {
            let X = OF4(O, J);
            if (w += X?.insertions || 0, H += X?.deletions || 0, X?.insertions || X?.deletions) z.push(O)
        } else if (jF4(O, J)) vvY(O, J), h(`FileHistory: [Rewind] Restored ${O} from ${J}`), z.push(O)
    } catch (O) { K1(O); c("tengu_file_history_rewind_restore_file_failed", { dryRun: K }) }
    return { filesChanged: z, insertions: w, deletions: H }
}

// READABLE (for understanding):
function rewindAndRestoreFiles(fileHistory, snapshot, isDryRun) {
    let fs = getFileSystem(), changedFiles = [], additions = 0, deletions = 0;
    for (let trackedPath of fileHistory.trackedFiles) try {
        let actualPath = resolveTrackedFilePath(trackedPath),
            backupRecord = snapshot.trackedFileBackups[trackedPath],
            // Fallback: if this snapshot doesn't have the file, find it in oldest snapshot
            backupFileName = backupRecord ? backupRecord.backupFileName : findBackupInOlderSnapshot(trackedPath, fileHistory);

        if (backupFileName === undefined) {
            // Cannot find any backup — log error
            logError(Error("FileHistory: Error finding the backup file to apply"));
            telemetry("tengu_file_history_rewind_restore_file_failed", { dryRun: isDryRun });
        } else if (backupFileName === null) {
            // File should be deleted at this snapshot point
            if (fs.existsSync(actualPath)) {
                if (isDryRun) { let s = calculateFileDiffStats(actualPath, undefined); additions += s?.insertions||0; deletions += s?.deletions||0; }
                else fs.unlinkSync(actualPath);
                changedFiles.push(actualPath);
            }
        } else if (isDryRun) {
            // Dry-run: just count diff lines
            let s = calculateFileDiffStats(actualPath, backupFileName);
            if (additions += s?.insertions||0, deletions += s?.deletions||0, s?.insertions||s?.deletions) changedFiles.push(actualPath);
        } else if (fileNeedsRestore(actualPath, backupFileName)) {
            // Apply: only restore if actually different
            restoreFileFromBackup(actualPath, backupFileName);
            changedFiles.push(actualPath);
        }
    } catch (e) { logError(e); telemetry("tengu_file_history_rewind_restore_file_failed", { dryRun: isDryRun }); }
    return { filesChanged: changedFiles, insertions: additions, deletions: deletions }
}

// Mapping: DF4→rewindAndRestoreFiles, A→fileHistory, q→snapshot, K→isDryRun,
//          Y→fs, z→changedFiles, w→additions, H→deletions, $→trackedPath,
//          O→actualPath, _→backupRecord, J→backupFileName, X→diffStats,
//          EkA→resolveTrackedFilePath, EvY→findBackupInOlderSnapshot,
//          OF4→calculateFileDiffStats, jF4→fileNeedsRestore, vvY→restoreFileFromBackup
```

### Algorithm: Three-State File Restoration

For each tracked file, the algorithm handles three states:

| `backupFileName` | Meaning | Dry-Run | Live |
|------------------|---------|---------|------|
| `undefined` | No backup found anywhere | Log error | Log error |
| `null` | File didn't exist at this snapshot | Count current file stats | `unlinkSync` |
| `string` | File existed with this content | Count diff vs backup | Copy backup to path |

**Why iterate `fileHistory.trackedFiles` (not `snapshot.trackedFileBackups`)?**
The `snapshot.trackedFileBackups` only contains files whose state was **first captured** at or before that snapshot. Files that started being tracked in a *later* message won't appear in the snapshot at all. Using `trackedFiles` (the union of all ever-tracked files) ensures completeness, with `findBackupInOlderSnapshot` (`EvY`) providing the fallback.

---

## 6. Conversation Restore — `onRestoreMessage`

```javascript
// ============================================
// onRestoreMessage - Slice conversation and restore session state
// Location: chunks.188.mjs:1389-1439
// ============================================

// ORIGINAL (for source lookup):
onRestoreMessage: async (k6) => {
    let q8 = W4.indexOf(k6), FA = W4.slice(0, q8);
    setImmediate(async () => {
        X6([...FA]), E5(bE6()), A1((k7) => ({
            ...k7,
            todos: { ...k7.todos, [JA]: k6.todos ?? [] },
            toolPermissionContext: k6.permissionMode && k7.toolPermissionContext.mode !== k6.permissionMode
                ? { ...k7.toolPermissionContext, mode: k6.permissionMode }
                : k7.toolPermissionContext,
            promptSuggestion: { text: null, promptId: null, shownAt: 0, acceptedAt: 0, generationRequestId: null }
        })), $K1(k6.todos ?? [], JA);
        let Yq = ZQ1(k6);
        if (Yq !== null) {
            let k7 = C4(Yq, "bash-input"), X4 = C4(Yq, SG);
            if (k7) $8(k7), Rq("bash");
            else if (X4) { let p7 = C4(Yq, "command-args") || ""; $8(`${X4} ${p7}`), Rq("prompt") }
            else $8(Yq), Rq("prompt")
        }
        // Restore pasted images if the message had images
        if (Array.isArray(k6.message.content) && k6.message.content.some((k7) => k7.type === "image")) {
            let k7 = k6.message.content.filter((X4) => X4.type === "image");
            if (k7.length > 0) {
                let X4 = {};
                k7.forEach((p7, V3) => {
                    if (p7.source.type === "base64") {
                        let sq = k6.imagePasteIds?.[V3] ?? V3 + 1;
                        X4[sq] = { id: sq, type: "image", content: p7.source.data, mediaType: p7.source.media_type }
                    }
                }), aw(X4)
            }
        }
    })
}

// READABLE (for understanding):
onRestoreMessage: async (selectedMessage) => {
    let msgIndex = messageList.indexOf(selectedMessage),
        restoredMessages = messageList.slice(0, msgIndex);
    setImmediate(async () => {
        setMessages([...restoredMessages]);
        refreshMessages();
        updateAppState((state) => ({
            ...state,
            todos: { ...state.todos, [currentSessionId]: selectedMessage.todos ?? [] },
            toolPermissionContext: selectedMessage.permissionMode && state.toolPermissionContext.mode !== selectedMessage.permissionMode
                ? { ...state.toolPermissionContext, mode: selectedMessage.permissionMode }
                : state.toolPermissionContext,
            promptSuggestion: { text: null, promptId: null, shownAt: 0, acceptedAt: 0, generationRequestId: null }
        }));
        syncTodosForSession(selectedMessage.todos ?? [], currentSessionId);

        // Restore the input field content from the message
        let content = extractMessageContent(selectedMessage);
        if (content !== null) {
            let bashInput = extractInlineTag(content, "bash-input"),
                skillCmd = extractInlineTag(content, SKILL_COMMAND_TAG);
            if (bashInput) { insertInputText(bashInput); setInputMode("bash"); }
            else if (skillCmd) { let args = extractInlineTag(content, "command-args") || "";
                insertInputText(`${skillCmd} ${args}`); setInputMode("prompt"); }
            else { insertInputText(content); setInputMode("prompt"); }
        }

        // Restore pasted images if any
        if (Array.isArray(selectedMessage.message.content)
                && selectedMessage.message.content.some(m => m.type === "image")) {
            let images = selectedMessage.message.content.filter(m => m.type === "image");
            if (images.length > 0) {
                let imagePasteMap = {};
                images.forEach((img, idx) => {
                    if (img.source.type === "base64") {
                        let pasteId = selectedMessage.imagePasteIds?.[idx] ?? idx + 1;
                        imagePasteMap[pasteId] = { id: pasteId, type: "image", content: img.source.data, mediaType: img.source.media_type };
                    }
                });
                setPastedImages(imagePasteMap);
            }
        }
    })
}

// Mapping: k6→selectedMessage, q8→msgIndex, FA→restoredMessages, W4→messageList,
//          X6→setMessages, E5→refreshMessages, A1→updateAppState, JA→currentSessionId,
//          $K1→syncTodosForSession, ZQ1→extractMessageContent, C4→extractInlineTag,
//          $8→insertInputText, Rq→setInputMode, aw→setPastedImages
```

### Algorithm: Full Conversation State Restoration

**What it does:** Cuts the message array at the selected point and restores all associated session state.

**How it works:**
1. `slice(0, msgIndex)` — Keep only messages before the selected message
2. `setImmediate` wrapping — Defers execution to next event loop tick, ensuring UI updates complete first
3. Reset `todos` to the snapshot stored in the message itself (`message.todos`)
4. Restore `toolPermissionContext.mode` if it changed (e.g., user was in auto-approve mode)
5. Clear `promptSuggestion` to prevent stale suggestion display
6. Re-inject the original prompt text into the input field — so the user can re-send or edit it
7. **Re-inject pasted images** — if the original message contained base64 images, they're added back to the image paste buffer so the user can re-attach them

**Why `setImmediate`?**
The message list update triggers React re-renders. `setImmediate` ensures the state update batch completes before downstream operations (todo sync, input injection) run, preventing race conditions in the UI.

**Why does the message store its own `todos`?**
Each user message object carries a snapshot of the todo list at the time it was created. This allows conversation restore to correctly recover todo state to exactly the point in time the user wants to return to, without a separate todos-by-messageId index.

---

## 7. Targeted Summarization — Complete Pipeline

"Summarize from here" shares the same engine as `/compact`. The difference is only the split index: `/compact` passes `0` (summarize everything), while "Summarize from here" passes `selectedMessageIndex` (keep earlier messages verbatim). All internal steps are identical.

### 7.0 Pipeline Overview

```
onSummarize(selectedMessage, userContext)
  │
  ├─ 1. Split messages at selectedMessageIndex
  │      messagesToKeep    = messages[0:index]
  │      messagesToSummarize = messages[index:]
  │
  ├─ 2. Run pre_compact hooks   → mW6()  → newCustomInstructions
  │
  ├─ 3. Build summarize request → BL7()  → requestMessage
  │
  ├─ 4. LLM call                → ga4()  → assistantResponse
  │      (uses mainLoopModel, not a dedicated compact model)
  │
  ├─ 5. Format output           → ux1()  → summaryText
  │      (adds header, transcript link via a$())
  │
  ├─ 6. Collect attachments
  │      ├─ Ua4() → file read state (most recently read files, 50K token budget)
  │      ├─ ca4() → completed local agent task statuses
  │      ├─ pa4() → current todo items
  │      ├─ jZ6() → plan file reference (if active plan exists)
  │      └─ da4() → invoked skills list (most recent first)
  │
  ├─ 7. Run session_start hooks → PP("compact", {model}) → hookResults
  │
  ├─ 8. Create boundary marker  → JU1()  → {type:"system", subtype:"compact_boundary"}
  │
  └─ 9. Assemble final messages
         [boundaryMarker, ...messagesToKeep, ...summaryMessages, ...attachments, ...hookResults]
```

### 7.1 Pre-Compact Hooks — `mW6` (chunks.141.mjs:3011-3039)

```javascript
// ============================================
// mW6 - Execute PreCompact hooks and collect custom instructions
// Location: chunks.141.mjs:3011-3039
// ============================================

// ORIGINAL (for source lookup):
async function mW6(A, q, K = MP) {
    let Y = { ...aX(void 0), hook_event_name: "PreCompact", trigger: A.trigger, custom_instructions: A.customInstructions },
        z = await AyA({ hookInput: Y, matchQuery: A.trigger, signal: q, timeoutMs: K });
    if (z.length === 0) return {};
    let w = z.filter(($) => $.succeeded && $.output.trim().length > 0).map(($) => $.output.trim()),
        H = [];
    for (let $ of z)
        if ($.succeeded)
            if ($.output.trim()) H.push(`PreCompact [${$.command}] completed successfully: ${$.output.trim()}`);
            else H.push(`PreCompact [${$.command}] completed successfully`);
        else if ($.output.trim()) H.push(`PreCompact [${$.command}] failed: ${$.output.trim()}`);
        else H.push(`PreCompact [${$.command}] failed`);
    return { newCustomInstructions: w.length > 0 ? w.join(`\n\n`) : void 0,
             userDisplayMessage: H.length > 0 ? H.join(`\n`) : void 0 }
}

// READABLE (for understanding):
async function executePreCompactHooks(hookConfig, abortSignal, timeoutMs = DEFAULT_TIMEOUT) {
    let hookInput = { ...baseHookContext(undefined), hook_event_name: "PreCompact",
                      trigger: hookConfig.trigger, custom_instructions: hookConfig.customInstructions };
    let results = await runMatchingHooks({ hookInput, matchQuery: hookConfig.trigger, signal: abortSignal, timeoutMs });
    if (results.length === 0) return {};
    let customInstructions = results.filter(r => r.succeeded && r.output.trim()).map(r => r.output.trim());
    let userMessages = results.map(r =>
        r.succeeded ? `PreCompact [${r.command}] completed successfully${r.output.trim() ? ': ' + r.output.trim() : ''}`
                    : `PreCompact [${r.command}] failed${r.output.trim() ? ': ' + r.output.trim() : ''}`
    );
    return {
        newCustomInstructions: customInstructions.length > 0 ? customInstructions.join('\n\n') : undefined,
        userDisplayMessage: userMessages.length > 0 ? userMessages.join('\n') : undefined
    };
}

// Mapping: mW6→executePreCompactHooks, A→hookConfig, q→abortSignal, K→timeoutMs,
//          Y→hookInput, z→results, w→customInstructions, H→userMessages, AyA→runMatchingHooks
```

**What pre-compact hooks provide:** Hook stdout is collected as `newCustomInstructions`. In `Fa4`, if both hook instructions and user context exist, they're combined:
```
"{hookInstructions}\n\nUser context: {userContext}"
```
If only one exists, it's used alone. This feeds into `BL7()` as the "Additional Instructions" section of the summarize prompt.

### 7.2 The LLM Summarize Call — `ga4` (chunks.146.mjs:2566-2651)

```javascript
// ============================================
// ga4 - Execute LLM call for conversation summarization
// Location: chunks.146.mjs:2566-2651
// ============================================

// ORIGINAL (for source lookup):
async function ga4({ messages: A, summaryRequest: q, appState: K, context: Y, preCompactTokenCount: z, cacheSafeParams: w }) {
    if (x8("tengu_compact_cache_prefix", !1)) try {
        let _ = await av({ promptMessages: [q], cacheSafeParams: w, canUseTool: vmY(), querySource: "compact", forkLabel: "compact", maxTurns: 1 }),
            J = GN(_.messages);
        if (J && B51(J)) return c("tengu_compact_cache_sharing_success", { ... }), J;
        c("tengu_compact_cache_sharing_fallback", { reason: "no_text_response", preCompactTokenCount: z })
    } catch (_) { c("tengu_compact_cache_sharing_fallback", { reason: "error", preCompactTokenCount: z }) }
    let $ = x8("tengu_compact_streaming_retry", !1), O = $ ? NmY : 1;
    for (let _ = 1; _ <= O; _++) {
        let j = await XU1(Y.options.mainLoopModel, Y.options.tools, ...) ? Sx([i5, IW6, ...K.mcp.tools], "name") : [i5],
            P = UW1({
                messages: WJ(TmY([...EN(A), q])),
                systemPrompt: ["You are a helpful AI assistant tasked with summarizing conversations."],
                maxThinkingTokens: 0,
                tools: j,
                signal: Y.abortController.signal,
                options: { model: Y.options.mainLoopModel, maxOutputTokensOverride: JL6,
                           querySource: "compact", effortValue: K.effortValue, ... }
            })[Symbol.asyncIterator]();
        // ... stream events ...
        let W = await P.next();
        while (!W.done) { /* collect assistant response */ W = await P.next() }
        if (X) return X;
    }
}

// READABLE (for understanding):
async function runSummarizeLLM({ messages, summaryRequest, appState, context, preCompactTokenCount, cacheSafeParams }) {
    // Fast path: try prompt-cache sharing (feature flag "tengu_compact_cache_prefix")
    if (isFeatureEnabled("tengu_compact_cache_prefix")) {
        try {
            let cacheResult = await runWithCacheSharing({ promptMessages: [summaryRequest], cacheSafeParams, ... });
            let cachedResponse = getLastAssistantMessage(cacheResult.messages);
            if (cachedResponse && hasTextContent(cachedResponse)) {
                telemetry("tengu_compact_cache_sharing_success", { ... });
                return cachedResponse;
            }
            telemetry("tengu_compact_cache_sharing_fallback", { reason: "no_text_response" });
        } catch (e) { telemetry("tengu_compact_cache_sharing_fallback", { reason: "error" }); }
    }
    // Slow path: full LLM stream
    let shouldRetry = isFeatureEnabled("tengu_compact_streaming_retry");
    let maxAttempts = shouldRetry ? MAX_RETRY_COUNT : 1;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        let tools = await shouldIncludeTools(context.options.mainLoopModel, ...)
            ? filterToolsByName([defaultTool, editTool, ...appState.mcp.tools])
            : [defaultTool];
        let stream = createLLMStream({
            messages: normalizeMessages(stripImages([...messagesAfterBoundary, summaryRequest])),
            systemPrompt: ["You are a helpful AI assistant tasked with summarizing conversations."],
            maxThinkingTokens: 0,  // thinking disabled for summarize
            tools,
            signal: context.abortController.signal,
            options: {
                model: context.options.mainLoopModel,    // ← SAME model as main loop
                maxOutputTokensOverride: JL6,            // summary-specific token limit
                querySource: "compact",
                effortValue: appState.effortValue,       // inherits effort from session
            }
        })[Symbol.asyncIterator]();
        let assistantMsg = null;
        for await (let event of stream) {
            if (event.type === "assistant") assistantMsg = event;
            // setStreamMode("responding") on first text block
            // setResponseLength() on each text delta
        }
        if (assistantMsg) return assistantMsg;
        if (attempt < maxAttempts) telemetry("tengu_compact_streaming_retry", { attempt });
    }
}

// Mapping: ga4→runSummarizeLLM, A→messages, q→summaryRequest, K→appState, Y→context,
//          z→preCompactTokenCount, w→cacheSafeParams, x8→isFeatureEnabled, av→runWithCacheSharing,
//          UW1→createLLMStream, TmY→stripImages, EN→messagesAfterBoundary, WJ→normalizeMessages
```

**Critical insight — same model, not dedicated:**
`ga4` uses `Y.options.mainLoopModel` (e.g., `claude-opus-4-6`). There is no separate "compact model." This means summarization is just as capable as the main conversation loop, but it also means it has the same cost.

**Two feature flags controlling behavior:**
- `tengu_compact_cache_prefix`: Try cache-sharing first (re-use a cached prompt). If successful, the entire LLM call is free. Falls back to full stream on cache miss.
- `tengu_compact_streaming_retry`: If the stream returns no content, retry up to `NmY` times. Handles transient API failures.

**Images stripped:** `TmY([...EN(A), q])` — `TmY` strips image content from all messages before sending to the summarize LLM. Image bytes would bloat the token count without adding value to a text summary.

### 7.3 Session-Start Hooks — `PP` (chunks.142.mjs:248-289)

```javascript
// ============================================
// PP - Execute SessionStart hooks after compaction
// Location: chunks.142.mjs:248-289
// ============================================

// ORIGINAL (for source lookup):
async function PP(A, { sessionId: q, agentType: K, model: Y, forceSyncExecution: z } = {}) {
    let w = [], H = [];
    if (Ap()) h("Skipping plugin hooks - allowManagedHooksOnly is enabled");
    else try { await pa() } catch (O) { /* handle plugin load error with category hints */ }
    let $ = K ?? PN1();
    for await (let O of $yA(A, q, $, Y, void 0, void 0, z)) {
        if (O.message) w.push(O.message);
        if (O.additionalContexts?.length > 0) H.push(...O.additionalContexts)
    }
    if (H.length > 0) {
        let O = kq({ type: "hook_additional_context", content: H, hookName: "SessionStart",
                     toolUseID: "SessionStart", hookEvent: "SessionStart" });
        w.push(O)
    }
    return w
}

// READABLE (for understanding):
async function runSessionStartHooks(hookType, { sessionId, agentType, model, forceSyncExecution } = {}) {
    let hookMessages = [], additionalContexts = [];
    if (!onlyManagedHooksAllowed()) {
        try { await loadPluginHooks(); }
        catch (e) { logWarning(`Failed to load plugin hooks during ${hookType}. Error: ...`); }
    }
    let effectiveAgentType = agentType ?? getDefaultAgentType();
    for await (let result of executeHooksByType(hookType, sessionId, effectiveAgentType, model, undefined, undefined, forceSyncExecution)) {
        if (result.message) hookMessages.push(result.message);
        if (result.additionalContexts?.length > 0) additionalContexts.push(...result.additionalContexts);
    }
    if (additionalContexts.length > 0) {
        hookMessages.push(createAttachment({
            type: "hook_additional_context", content: additionalContexts,
            hookName: "SessionStart", toolUseID: "SessionStart", hookEvent: "SessionStart"
        }));
    }
    return hookMessages;
}

// Mapping: PP→runSessionStartHooks, A→hookType, q→sessionId, K→agentType, Y→model,
//          z→forceSyncExecution, w→hookMessages, H→additionalContexts,
//          pa→loadPluginHooks, $yA→executeHooksByType, kq→createAttachment
```

Called as `PP("compact", { model: context.options.mainLoopModel })`. Returns an array of messages/attachments to append after the summary. These represent fresh session context from hooks (e.g., a `session_start` hook might re-inject environment info or project context).

### 7.4 Attachment Collection

After the LLM summary is generated, `Fa4` collects four types of attachments to re-inject into the post-summary context:

```javascript
// In Fa4, after ga4() returns:
let readFileStateSnapshot = convertMapToObject(context.readFileState);  // wjA()
context.readFileState.clear();                                          // Reset tracking
rd();                                                                   // Reset read file state

let [fileAttachments, taskAttachments] = await Promise.all([
    collectReadFiles(readFileStateSnapshot, context, MAX_FILES_TO_INCLUDE),  // Ua4()
    collectCompletedTasks(context)                                            // ca4()
]);
let allAttachments = [...fileAttachments, ...taskAttachments];

let todoAttachment = collectTodos(context.agentId ?? getCurrentSessionId());  // pa4()
if (todoAttachment) allAttachments.push(todoAttachment);

let planAttachment = collectPlanFile(context.agentId);                        // jZ6()
if (planAttachment) allAttachments.push(planAttachment);

let skillsAttachment = collectInvokedSkills();                                // da4()
if (skillsAttachment) allAttachments.push(skillsAttachment);
```

**`collectReadFiles` (Ua4) — Budget-limited file context:**
```javascript
// ============================================
// Ua4 - Collect recently-read files as post-compact attachments
// Location: chunks.146.mjs:2665-2686
// ============================================

// ORIGINAL (for source lookup):
async function Ua4(A, q, K) {
    let Y = Object.entries(A).map(([H, $]) => ({ filename: H, ...$}))
            .filter((H) => !EmY(H.filename, q.agentId))
            .sort((H, $) => $.timestamp - H.timestamp).slice(0, K),
        z = await Promise.all(Y.map(async (H) => {
            let $ = await TyA(H.filename, { ...q, fileReadingLimits: { maxTokens: VmY } }, ...);
            return $ ? kq($) : null
        })),
        w = 0;
    return z.filter((H) => {
        if (H === null) return !1;
        let $ = A2(Q1(H));
        if (w + $ <= fmY) return w += $, !0;
        return !1
    })
}

// READABLE (for understanding):
async function collectReadFiles(readFileStateMap, context, maxFiles) {
    // Sort by most recently read, exclude special agent/plan files
    let candidates = Object.entries(readFileStateMap)
        .map(([filename, meta]) => ({ filename, ...meta }))
        .filter(f => !isSpecialAgentFile(f.filename, context.agentId))
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, maxFiles);
    // Re-read each file with a per-file token cap (VmY = 5000 tokens)
    let attachments = await Promise.all(candidates.map(async f => {
        let content = await readFileForAttachment(f.filename, { ...context, fileReadingLimits: { maxTokens: 5000 } });
        return content ? createAttachment(content) : null;
    }));
    // Apply cumulative budget (fmY = 50,000 tokens total)
    let usedTokens = 0;
    return attachments.filter(a => {
        if (!a) return false;
        let tokens = countTokens(stringify(a));
        if (usedTokens + tokens <= 50_000) { usedTokens += tokens; return true; }
        return false;
    });
}
// Mapping: Ua4→collectReadFiles, A→readFileStateMap, K→maxFiles, VmY→5000, fmY→50000
```

**Why re-read files after compaction?**
The summarized messages no longer contain the actual file content Claude saw. Re-attaching recently-read files gives the model immediate access to the most relevant code context without needing to read them again.

**`collectCompletedTasks` (ca4) — Task status re-injection:**
```javascript
// ============================================
// ca4 - Collect completed local agent task statuses
// Location: chunks.146.mjs:2724-2740
// ============================================

// ORIGINAL (for source lookup):
async function ca4(A) {
    let q = await A.getAppState();
    return Object.values(q.tasks).filter((Y) => Y.type === "local_agent")
        .flatMap((Y) => {
            if (Y.retrieved) return [];
            let { status: z } = Y;
            if (z === "completed" || z === "failed" || z === "killed")
                return [kq({ type: "task_status", taskId: Y.agentId, taskType: "local_agent",
                             description: Y.description, status: z, deltaSummary: Y.error ?? null })];
            return []
        })
}

// READABLE (for understanding):
async function collectCompletedTasks(context) {
    let appState = await context.getAppState();
    return Object.values(appState.tasks)
        .filter(task => task.type === "local_agent")
        .flatMap(task => {
            if (task.retrieved) return [];  // skip already-reported tasks
            let { status } = task;
            if (status === "completed" || status === "failed" || status === "killed")
                return [createAttachment({ type: "task_status", taskId: task.agentId,
                    taskType: "local_agent", description: task.description,
                    status, deltaSummary: task.error ?? null })];
            return [];
        });
}
// Mapping: ca4→collectCompletedTasks, A→context, q→appState, Y→task, z→status
```

**`collectTodos` (pa4), `collectPlanFile` (jZ6), `collectInvokedSkills` (da4):**
```javascript
// pa4 — Current todo list (chunks.146.mjs:2688-2697)
function collectTodos(agentId) {
    let todos = getTodosForAgent(agentId);
    if (todos.length === 0) return null;
    return createAttachment({ type: "todo", content: todos, itemCount: todos.length, context: "post-compact" });
}

// jZ6 — Active plan file (chunks.146.mjs:2699-2707)
function collectPlanFile(agentId) {
    let planContent = getPlanContent(agentId);
    if (!planContent) return null;
    let planFilePath = getPlanFilePath(agentId);
    return createAttachment({ type: "plan_file_reference", planFilePath, planContent });
}

// da4 — Invoked skills, newest first (chunks.146.mjs:2710-2721)
function collectInvokedSkills() {
    let skills = getAllInvokedSkills();
    if (skills.size === 0) return null;
    let skillList = Array.from(skills.values())
        .sort((a, b) => b.invokedAt - a.invokedAt)
        .map(s => ({ name: s.skillName, path: s.skillPath, content: s.content }));
    return createAttachment({ type: "invoked_skills", skills: skillList });
}
// Mappings: pa4→collectTodos, jZ6→collectPlanFile, da4→collectInvokedSkills
```

### 7.5 Boundary Marker — `JU1` (chunks.173.mjs:1215-1233)

```javascript
// ============================================
// JU1 - Create compact boundary marker message
// Location: chunks.173.mjs:1215-1233
// ============================================

// ORIGINAL (for source lookup):
function JU1(A, q, K, Y, z) {
    return { type: "system", subtype: "compact_boundary", content: "Conversation compacted",
             isMeta: !1, timestamp: new Date().toISOString(), uuid: _f(), level: "info",
             compactMetadata: { trigger: A, preTokens: q, userContext: Y, messagesSummarized: z },
             ...K ? { logicalParentUuid: K } : {} }
}

// READABLE (for understanding):
function createBoundaryMarker(trigger, preCompactTokenCount, logicalParentUuid, userContext, messagesSummarized) {
    return {
        type: "system",
        subtype: "compact_boundary",
        content: "Conversation compacted",
        isMeta: false,
        timestamp: new Date().toISOString(),
        uuid: generateUUID(),
        level: "info",
        compactMetadata: {
            trigger,                // "manual" for rewind-triggered summarize
            preTokens: preCompactTokenCount,
            userContext,            // user-typed context or undefined
            messagesSummarized
        },
        ...(logicalParentUuid ? { logicalParentUuid } : {})
    };
}
// Mapping: JU1→createBoundaryMarker, A→trigger, q→preCompactTokenCount, K→logicalParentUuid,
//          Y→userContext, z→messagesSummarized, _f→generateUUID
```

The boundary marker is a `type:"system"` message (filtered from normal display by `isSelectableMessage`) that:
- Marks the compaction point for transcript navigation
- Stores metadata (token count before/after, user context, message count)
- Is placed at the **beginning** of the final message array so it always precedes the summary

### 7.6 Summary Text Formatting — `ux1` + `a$` (chunks.76.mjs:323-336, chunks.173.mjs:1658)

```javascript
// ============================================
// ux1 - Format summary content with header and transcript link
// Location: chunks.76.mjs:323-336
// ============================================

// ORIGINAL (for source lookup):
function ux1(A, q, K, Y) {
    let w = `This session is being continued from a previous conversation that ran out of context. The summary below covers the earlier portion of the conversation.\n\n${O99(A)}`;
    if (K) w += `\n\nIf you need specific details from before compaction (like exact code snippets, error messages, or content you generated), read the full transcript at: ${K}`;
    if (Y) w += `\n\nRecent messages are preserved verbatim.`;
    if (q) return `${w}\nPlease continue the conversation from where we left off without asking the user any further questions. Continue with the last task that you were asked to work on.`;
    return w
}

// READABLE (for understanding):
function formatSummaryText(summaryContent, shouldDirectAgent, transcriptFilePath, hasPreservedMessages) {
    let text = `This session is being continued from a previous conversation that ran out of context. The summary below covers the earlier portion of the conversation.\n\n${extractSummaryTag(summaryContent)}`;
    if (transcriptFilePath)
        text += `\n\nIf you need specific details from before compaction (like exact code snippets, error messages, or content you generated), read the full transcript at: ${transcriptFilePath}`;
    if (hasPreservedMessages)
        text += `\n\nRecent messages are preserved verbatim.`;
    if (shouldDirectAgent)
        return `${text}\nPlease continue the conversation from where we left off without asking the user any further questions. Continue with the last task that you were asked to work on.`;
    return text;
}
// Mapping: ux1→formatSummaryText, A→summaryContent, q→shouldDirectAgent,
//          K→transcriptFilePath, Y→hasPreservedMessages, O99→extractSummaryTag

// a$ - Get transcript file path (chunks.173.mjs:1658-1660)
function a$(agentId) {
    let baseDir = getDataDir(SESSIONS_DIR);
    return joinPath(baseDir, `${agentId}.jsonl`);  // → ~/.claude/projects/{agentId}.jsonl
}
// Mapping: a$→getTranscriptFilePath
```

**Called in `Fa4` as:** `ux1(summaryText, false, transcriptFilePath, messagesToKeep.length > 0)`
- `false` for `shouldDirectAgent` in partial compaction (messages before the point are kept, so no need to direct the agent)
- `transcriptFilePath = a$(currentSessionId())` — points to the session `.jsonl` so the LLM can access full history

### 7.7 Final Assembly — Output Structure

```javascript
// Fa4 return value:
return {
    boundaryMarker,          // JU1() — system/compact_boundary message
    summaryMessages: [       // Array of one message:
        createMessage({
            content: formatSummaryText(llmSummaryText, false, transcriptPath),
            isCompactSummary: true,
            ...(messagesToKeep.length > 0
                ? { summarizeMetadata: { messagesSummarized: count, userContext } }
                : { isVisibleInTranscriptOnly: true })
        })
    ],
    messagesToKeep,           // messages[0:selectedIndex]
    attachments,              // [fileAttachments, taskStatuses, todos, planFile, skills]
    hookResults,              // PP("compact") session-start hook messages
    preCompactTokenCount,
    postCompactTokenCount,
    compactionUsage           // {input_tokens, output_tokens, cache_read/creation_tokens}
}
```

**Post-assembly message order:**
```
[boundaryMarker, ...messagesToKeep, ...summaryMessages, ...attachments, ...hookResults]
```

The model now sees: (1) the compact marker, (2) early conversation verbatim, (3) AI-generated summary of the compressed portion, (4) fresh file/task/todo context, (5) any session-start hook outputs.

### 7.8 Key Insights

**1. Partial vs. full compaction is one parameter:**
`Fa4(messages, index, ...)` — `index=0` compacts everything, `index=N` keeps `N` messages verbatim. "Summarize from here" passes `messages.indexOf(selectedMessage)`.

**2. `readFileState` is cleared after collection:**
`context.readFileState.clear()` runs after `wjA()` converts it to an object. This prevents the same files from being re-attached in a future compaction triggered later in the same session.

**3. The `isVisibleInTranscriptOnly` flag:**
If `messagesToKeep.length === 0` (full compaction), the summary message gets `isVisibleInTranscriptOnly: true` — it's only shown in the transcript view, not in the main conversation. For partial compaction the flag is absent, so the summary is visible in the main thread.

**4. Token accounting:**
- `preCompactTokenCount = countTokens(messages)` — measured before anything changes
- `postCompactTokenCount = countTokens([summaryMessages])` — measured after
- Reported in `tengu_partial_compact` telemetry with `trigger: "message_selector"`

---

## 8. Dry-Run / Capability Check — `checkRewindCapability` (mMq)

```javascript
// ============================================
// checkRewindCapability - Validate rewind and compute diff preview
// Location: chunks.179.mjs:1747-1779
// ============================================

// ORIGINAL (for source lookup):
async function mMq(A, q, K, Y) {
    if (!z2()) return { canRewind: false, error: "File rewinding is not enabled." };
    if (!LP6(q.fileHistory, A)) return { canRewind: false, error: "No file checkpoint found for this message." };
    if (Y) {
        let z = RP6(q.fileHistory, A);
        return { canRewind: true, filesChanged: z?.filesChanged, insertions: z?.insertions, deletions: z?.deletions }
    }
    try {
        await kP6((z) => K((w) => ({ ...w, fileHistory: z(w.fileHistory) })), A)
    } catch (z) { return { canRewind: false, error: `Failed to rewind: ${z.message}` } }
    return { canRewind: true }
}

// READABLE (for understanding):
async function checkRewindCapability(messageId, appState, updateState, isDryRun) {
    if (!isFileHistoryEnabled())
        return { canRewind: false, error: "File rewinding is not enabled." };
    if (!snapshotExistsForMessage(appState.fileHistory, messageId))
        return { canRewind: false, error: "No file checkpoint found for this message." };
    if (isDryRun) {
        let stats = getDryRunDiffStats(appState.fileHistory, messageId);
        return { canRewind: true, filesChanged: stats?.filesChanged, insertions: stats?.insertions, deletions: stats?.deletions };
    }
    try {
        await rewindHandler((updatedFn) => updateState((s) => ({ ...s, fileHistory: updatedFn(s.fileHistory) })), messageId);
    } catch (e) { return { canRewind: false, error: `Failed to rewind: ${e.message}` }; }
    return { canRewind: true };
}

// Mapping: mMq→checkRewindCapability, A→messageId, q→appState, K→updateState, Y→isDryRun,
//          z2→isFileHistoryEnabled, LP6→snapshotExistsForMessage, RP6→getDryRunDiffStats, kP6→rewindHandler
```

**Two modes:**
- `isDryRun=true` → Calls `getDryRunDiffStats` (`RP6`) which calls `DF4` with `isDryRun=true`. Returns `{ canRewind, filesChanged, insertions, deletions }` — used by the UI to show diff stats before the user commits.
- `isDryRun=false` → Calls `rewindHandler` (`kP6`) and actually restores files. Returns `{ canRewind: true }` on success.

---

## 9. Session Lifecycle — Initialization, Seeding, Cleanup

### Initial State

The `fileHistory` field is part of the main app state atom and starts completely empty:

```javascript
// Initial fileHistory state (chunks.189.mjs:1633-1635, chunks.151.mjs:443-445)
fileHistory: {
    snapshots: [],          // no snapshots yet
    trackedFiles: new Set() // no files being tracked
}
```

### First Snapshot Seed — The Bootstrap Problem

`createSnapshotForMessage` (WW1) only creates backups when `previousSnapshot` (the last entry in `snapshots`) exists. With an empty array, `snapshots.at(-1)` returns `undefined`, so the backup loop is skipped and only the snapshot record itself is appended.

This means **the very first snapshot is always empty** (`trackedFileBackups: {}`). It acts as the seed anchor — giving WW1 a "previous snapshot" to reference on the second message. From the second message onward, the normal deduplication logic applies.

The timeline for a fresh session:

```
Session start
  snapshots = []
  trackedFiles = {}

Message 1 arrives:
  WW1 called → previousSnapshot = undefined
  → backups loop is skipped (nothing to backup yet)
  → append snapshot { messageId: "msg1", trackedFileBackups: {}, timestamp }
  → snapshots = [{ msg1, {} }]

Claude edits file A during msg1:
  Xt called → lastSnapshot = { msg1, {} }
  → A not in lastSnapshot.trackedFileBackups → backup A@v1
  → mutate snapshot in-place: { msg1, { A: backupRecord@v1 } }

Message 2 arrives:
  WW1 called → previousSnapshot = { msg1, { A: @v1 } }
  → A has changed? → yes → create A@v2 backup
  → append snapshot { messageId: "msg2", trackedFileBackups: { A: @v2 } }
```

**Key insight:** The first snapshot is intentionally empty. It's not a bug — it's the bootstrap point that allows `WW1`'s deduplication logic to compare against "no previous state."

### Session Resume: Re-Seeding

When a session is resumed (already has messages), the file history state is loaded from the `.jsonl` session file. The persisted `snapshots` array and `trackedFiles` set are restored, so the bootstrap problem only applies to truly new sessions.

From `chunks.188.mjs:664-669` — at session load, `WW1` is called for the last loaded message to ensure a valid "current" snapshot exists:

```javascript
// On session load, seed the snapshot for the last message
if (isFileHistoryEnabled()) WW1(
    (updatedFn) => updateAppState((s) => ({ ...s, fileHistory: updatedFn(s.fileHistory) })),
    lastLoadedMessage.message.uuid
);
```

### Session Cleanup — 30-Day Expiry

Old backup files are removed based on `cleanupPeriodDays` (default 30 days). The cutoff is computed as:

```javascript
// chunks.178.mjs:311-314
function computeCleanupCutoff() {
    let periodMs = (getCleanupSettings()?.cleanupPeriodDays ?? DEFAULT_CLEANUP_DAYS) * 24 * 60 * 60 * 1000;
    return new Date(Date.now() - periodMs)
}
```

The cleanup function (`cjq`, chunks.178.mjs:328-346) scans the session backup directory and deletes files whose embedded date is before the cutoff:

```javascript
// ============================================
// cleanupOldBackups - Delete backup files older than cleanupPeriodDays
// Location: chunks.178.mjs:328-346
// ============================================

// ORIGINAL (for source lookup):
async function cjq(A, q, K) {
    let Y = { messages: 0, errors: 0 };
    try {
        let z = await b1().readdir(A);
        for (let w of z) try {
            if (b_z(w.name) < q)
                if (await b1().unlink(Df(A, w.name)), K) Y.messages++;
                else Y.errors++
        } catch (H) { K1(H) }
    } catch (z) { if (z instanceof Error && "code" in z && z.code !== "ENOENT") K1(z) }
    return Y
}

// READABLE (for understanding):
async function cleanupOldBackups(backupDirectory, cutoffDate, isVerbose) {
    let stats = { deleted: 0, errors: 0 };
    try {
        let entries = await getFileSystem().readdir(backupDirectory);
        for (let entry of entries) try {
            if (parseDateFromFilename(entry.name) < cutoffDate)
                if (await getFileSystem().unlink(joinPaths(backupDirectory, entry.name)), isVerbose)
                    stats.deleted++;
                else stats.errors++;
        } catch (e) { logError(e); }
    } catch (e) {
        if (e instanceof Error && "code" in e && e.code !== "ENOENT") logError(e);
    }
    return stats
}

// Mapping: cjq→cleanupOldBackups, A→backupDirectory, q→cutoffDate, K→isVerbose,
//          b_z→parseDateFromFilename, Df→joinPaths
```

---

## 10. Tool Integration — Which Tools Call `trackFileEdit`

`trackFileEdit` (Xt) is called by Claude's file-editing tools **before** each modification:

| Tool | When Called | Location |
|------|-------------|----------|
| Write tool | Before writing new file content | chunks.146.mjs:~552 |
| Edit tool | Before applying edit to existing file | chunks.134.mjs:~2344 |
| MultiEdit tool | Before each edit in a batch | chunks.134.mjs:~2766 |
| Read tool (write path) | Before reading file for subsequent write | chunks.170.mjs:~346 |

The call signature is always:
```javascript
await trackFileEdit(
    (updaterFn) => updateAppState(s => ({ ...s, fileHistory: updaterFn(s.fileHistory) })),
    filePath,       // absolute path to the file being modified
    messageUuid     // UUID of the current user message
)
```

This pattern — passing a state updater function rather than the state directly — ensures `trackFileEdit` works with React's immutable state model without needing direct access to the state atom.

---

## 11. Path Resolution — `resolveTrackedFilePath` (EkA)

```javascript
// ============================================
// resolveTrackedFilePath - Resolve relative tracked path to absolute
// Location: chunks.134.mjs:209-212
// ============================================

// ORIGINAL (for source lookup):
function EkA(A) {
    if (JF4(A)) return A;
    return _F4(y8(), A)
}

// READABLE (for understanding):
function resolveTrackedFilePath(normalizedPath) {
    if (isAbsolutePath(normalizedPath)) return normalizedPath;
    return joinPaths(getCurrentWorkingDirectory(), normalizedPath)
}

// Mapping: EkA→resolveTrackedFilePath, JF4→isAbsolutePath, y8→getCurrentWorkingDirectory, _F4→joinPaths
```

Tracked file paths are stored **normalized** (via `MF4` / `normalizeFilePath`). When restoring, they're resolved back to absolute paths via `EkA`. This allows the snapshot to remain valid even if the working directory changes between sessions.

---

## 12. Helper Implementations: LP6, RP6, `lo`

### `snapshotExistsForMessage` (LP6)

```javascript
// chunks.134.mjs:30-33
function LP6(fileHistory, messageId) {
    if (!isFileHistoryEnabled()) return false;
    return fileHistory.snapshots.some(s => s.messageId === messageId)
}
```

Simple `Array.some` scan. No indexing — O(n) per check. In practice, the number of snapshots is bounded by the number of messages in the session (typically < 1000).

### `getDryRunDiffStats` (RP6)

```javascript
// chunks.134.mjs:35-40
function RP6(fileHistory, messageId) {
    if (!isFileHistoryEnabled()) return;
    let snapshot = fileHistory.snapshots.findLast(s => s.messageId === messageId);
    if (!snapshot) return;
    return rewindAndRestoreFiles(fileHistory, snapshot, true)  // isDryRun=true
}
```

Delegates directly to `DF4` with `isDryRun=true`. No special caching — called once per user interaction.

### `computeDiff` (lo) — Myers Diff Algorithm

```javascript
// chunks.75.mjs:2676-2678
function lo(textA, textB, options) {
    return GL7.diff(textA, textB, options)
}
```

`GL7` is an instance of a `WL7` class (chunks.75.mjs:2305-2376) that extends `n0` — an internal Myers diff implementation. This is **not an external npm package** — it's a bundled implementation of the Myers diff algorithm. Features:
- Line-based tokenization
- Edit distance matrix (standard Myers)
- Returns `[{ added, removed, count, value }]` format

Used in `calculateFileDiffStats` (OF4) to count how many lines differ between current file and its backup.

---

## 13. Snapshot Copy Semantics — Deep Copy via `copySnapshot` (X61)

```javascript
// chunks.1.mjs:3762-3765
function X61(snapshot) {
    let desc = describeValue(snapshot);
    return measurePerformance(`cloneDeep(${desc})`, () => deepClone(snapshot))
}
```

`deepClone` uses `xn1` with flags `1 | 4` (deep copy + circular reference protection). This is important because `trackedFileBackups` is a plain object with file paths as keys — a shallow copy would let mutation of the `trackedFileBackups` dict in the copy corrupt the original snapshot in the `snapshots` array.

**Why deep copy is needed:** In `trackFileEdit` (Xt), after `copySnapshot`, the code mutates `copiedSnapshot.trackedFileBackups[normalizedPath] = backupRecord` directly. Without a deep copy, this would mutate the backing object of the original snapshot stored in `fileHistory.snapshots[-1]`.

---

## 14. Session Persistence Schema — JSONL Entry Format

The `.jsonl` session file (`~/.claude/projects/{sessionId}.jsonl`) stores all session data. A file history entry looks like:

```json
{
  "type": "file-history-snapshot",
  "messageId": "550e8400-e29b-41d4-a716-446655440000",
  "snapshot": {
    "messageId": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2025-06-15T10:23:45.123Z",
    "trackedFileBackups": {
      "/home/user/project/src/auth.ts": {
        "backupFileName": "a1b2c3d4e5f6a7b8@v1",
        "version": 1,
        "backupTime": "2025-06-15T10:22:30.456Z"
      },
      "/home/user/project/src/db.ts": {
        "backupFileName": "f9e8d7c6b5a49382@v2",
        "version": 2,
        "backupTime": "2025-06-15T10:23:01.789Z"
      }
    }
  },
  "isSnapshotUpdate": false
}
```

**`isSnapshotUpdate` flag:**
- `true` → written by `trackFileEdit` (Xt) — snapshot is in-progress (tool call executing)
- `false` → written by `createSnapshotForMessage` (WW1) — snapshot is finalized (message complete)

On session resume, the loader reads the `.jsonl` and reconstructs `fileHistory` state by replaying all `file-history-snapshot` entries. The last entry for each `messageId` wins (later `isSnapshotUpdate=false` finalizes it).

The `insertFileHistorySnapshot` function (`iQ1`) queues the write via the `NJq` write queue:

```javascript
// chunks.173.mjs:1873-1882
async insertFileHistorySnapshot(messageId, snapshot, isSnapshotUpdate) {
    return this.trackWrite(async () => {
        let entry = {
            type: "file-history-snapshot",
            messageId,
            snapshot,
            isSnapshotUpdate
        };
        await this.appendEntry(entry)
    })
}
```

---

## 15. Concurrency Model — NJq Write Queue

The session database (`NJq` class, chunks.173.mjs) handles concurrent writes safely within a single process:

```
Architecture:
  Multiple callers → enqueueWrite(filePath, entry)
                         ↓
                    writeQueues: Map<filePath, [{entry, resolve}]>
                         ↓
                    scheduleDrain() → sets 100ms timer
                         ↓
                    drainWriteQueue()
                      → batch entries for each file
                      → split at 100MB chunks
                      → appendToFile() (sequential I/O)
                      → resolve() each write promise
```

**Key properties:**
- **Batching**: Multiple writes within a 100ms window are merged into one `appendToFile` call
- **Ordering**: FIFO per file (write queue is spliced in order)
- **Serial drain**: Only one `drainWriteQueue()` runs at a time (`activeDrain` guard)
- **Backpressure**: `pendingWriteCount` lets callers `await flush()` for all pending writes

**Cross-process limitation:** There is **no file lock** (no `flock`, no `.lock` file, no mutex). If two Claude Code instances write to the same session `.jsonl`, their writes could interleave at the OS level. In practice, each session ID is unique per invocation, so this is not a concern for normal use. Remote sessions add a second write path (`iQ1` remote sync) but use the same session ID, so only one instance writes locally.

---

## 16. `checkForHistoryChanges` (kvY) — Diagnostic Comparison

```javascript
// ============================================
// checkForHistoryChanges - Detect and log backup changes between snapshots
// Location: chunks.134.mjs:288-314
// ============================================

// ORIGINAL (for source lookup):
function kvY(A, q) {
    let K = A.snapshots.at(-1), Y = q.snapshots.at(-1);
    if (!Y) return;
    let z = b1();
    for (let w of q.trackedFiles) {
        let H = EkA(w), $ = K?.trackedFileBackups[w], O = Y.trackedFileBackups[w];
        if ($?.backupFileName === O?.backupFileName && $?.version === O?.version) continue;
        let _ = null;
        if ($?.backupFileName) try {
            let X = Jt($.backupFileName);
            if (z.existsSync(X)) _ = z.readFileSync(X, { encoding: "utf-8" })
        } catch {}
        let J = null;
        if (O?.backupFileName) try {
            let X = Jt(O.backupFileName);
            if (z.existsSync(X)) J = z.readFileSync(X, { encoding: "utf-8" })
        } catch {} else if (O?.backupFileName === null) J = null;
        if (_ !== J) _t(H, _, J)
    }
}

// READABLE (for understanding):
function checkForHistoryChanges(oldHistory, newHistory) {
    let oldSnapshot = oldHistory.snapshots.at(-1),
        newSnapshot = newHistory.snapshots.at(-1);
    if (!newSnapshot) return;
    let fs = getFileSystem();
    for (let normalizedPath of newHistory.trackedFiles) {
        let absolutePath = resolveTrackedFilePath(normalizedPath);
        let oldBackup = oldSnapshot?.trackedFileBackups[normalizedPath];
        let newBackup = newSnapshot.trackedFileBackups[normalizedPath];
        // Skip unchanged entries
        if (oldBackup?.backupFileName === newBackup?.backupFileName &&
            oldBackup?.version === newBackup?.version) continue;
        // Read both backup contents for comparison
        let oldContent = null, newContent = null;
        if (oldBackup?.backupFileName) try {
            let p = resolveBackupPath(oldBackup.backupFileName);
            if (fs.existsSync(p)) oldContent = fs.readFileSync(p, { encoding: "utf-8" });
        } catch {}
        if (newBackup?.backupFileName) try {
            let p = resolveBackupPath(newBackup.backupFileName);
            if (fs.existsSync(p)) newContent = fs.readFileSync(p, { encoding: "utf-8" });
        } catch {} else if (newBackup?.backupFileName === null) newContent = null;
        // Report if content actually changed
        if (oldContent !== newContent) reportDifference(absolutePath, oldContent, newContent)
    }
}

// Mapping: kvY→checkForHistoryChanges, _t→reportDifference, A→oldHistory, q→newHistory
```

**Purpose:** This is a **diagnostic/debug function**, not part of the restore logic. It's called immediately after `createSnapshotForMessage` creates the new history state, and reports any files whose backup content actually changed between the old and new snapshots. The `_t` / `reportDifference` likely emits debug logs or internal telemetry (not user-visible).

---

## 18. Error Cases and Limitations

| Scenario | Behavior |
|----------|----------|
| `fileCheckpointingEnabled = false` | `checkRewindCapability` returns `{ canRewind: false, error: "File rewinding is not enabled." }` |
| No snapshot for selected message | Returns `{ canRewind: false, error: "No file checkpoint found for this message." }` |
| Backup file not found during restore | Telemetry + log error, continue with other files |
| File modified by bash / manually | Not tracked, not restored — UI shows warning text |
| Summarize with no messages to summarize | `Fa4` throws `"Nothing to summarize after the selected message."` |
| LLM summary generation failure | `Fa4` throws with `tengu_partial_compact_failed` telemetry |

---

## 19. Telemetry Events

| Event | Trigger |
|-------|---------|
| `tengu_message_selector_opened` | User opens the rewind UI |
| `tengu_message_selector_selected` | User selects a message |
| `tengu_message_selector_restore_option_selected` | User selects a restore action |
| `tengu_message_selector_cancelled` | User exits without action |
| `tengu_file_history_track_edit_success` | File edit tracked successfully |
| `tengu_file_history_track_edit_failed` | Failed to track file edit |
| `tengu_file_history_backup_file_created` | Backup file written |
| `tengu_file_history_backup_file_failed` | Failed to create backup |
| `tengu_file_history_backup_deleted_file` | Deletion tracked as null backup |
| `tengu_file_history_snapshot_success` | Message snapshot created |
| `tengu_file_history_snapshot_failed` | Snapshot creation failed |
| `tengu_file_history_rewind_success` | Files rewound successfully |
| `tengu_file_history_rewind_failed` | Rewind failed |
| `tengu_file_history_rewind_restore_file_failed` | Single file restore failed |
| `tengu_partial_compact` | Summarize succeeded |
| `tengu_partial_compact_failed` | Summarize failed |
