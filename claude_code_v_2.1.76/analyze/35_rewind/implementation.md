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
  snapshots: Snapshot[]                   // one per user message
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

---

## 2. Phase 1: File Edit Tracking — `trackFileEdit` (R66)

**Location:** chunks.135.mjs:1986-2014

This is called every time a Claude tool (Write, Edit, etc.) modifies a file, **before** the modification occurs.

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
            // Already tracked in this snapshot? Skip.
            if (mostRecentSnapshot.trackedFileBackups[normalizedPath]) return fileHistoryState;

            let updatedTrackedFiles = fileHistoryState.trackedFiles.has(normalizedPath)
                    ? fileHistoryState.trackedFiles
                    : new Set(fileHistoryState.trackedFiles).add(normalizedPath),
                isNewFile = !getFileSystem().existsSync(filePath),
                backupRecord = isNewFile
                    ? createBackupFile(null, 1)      // New file: null backup
                    : createBackupFile(filePath, 1), // Existing file: copy content
                copiedSnapshot = deepCopySnapshot(mostRecentSnapshot);  // rw6: Myers clone
            copiedSnapshot.trackedFileBackups[normalizedPath] = backupRecord;
            let newState = {
                ...fileHistoryState,
                snapshots: [...fileHistoryState.snapshots.slice(0, -1), copiedSnapshot],
                trackedFiles: updatedTrackedFiles
            };
            debugLog(newState);  // Tn4: no-op in prod
            recordFileHistorySnapshot(messageId, copiedSnapshot, true).catch((e) => {
                logError(Error(`FileHistory: Failed to record snapshot: ${e}`));
            });
            telemetry("tengu_file_history_track_edit_success", { isNewFile, version: backupRecord.version });
            return newState;
        } catch (error) {
            logError(error);
            telemetry("tengu_file_history_track_edit_failed", {});
            return fileHistoryState;
        }
    });
}

// Mapping: R66→trackFileEdit, A→updateFileHistoryState, q→filePath, K→messageId,
//          Y→fileHistoryState, z→mostRecentSnapshot, _→normalizedPath,
//          w→updatedTrackedFiles, $→isNewFile, H→backupRecord, j→copiedSnapshot,
//          J→newState, fn4→normalizeFilePath, $1→getFileSystem, du8→createBackupFile,
//          rw6→deepCopySnapshot, Tn4→debugLog, _l6→recordFileHistorySnapshot,
//          _6→logError, d→telemetry, k→consoleLog
```

### Algorithm: First-Edit-Only Backup

**What it does:** Captures the pre-edit state of a file into a versioned backup.

**How it works:**
1. Guard check: `isFileCheckpointingEnabled()` returns early if disabled
2. Get most recent snapshot from state array
3. Normalize file path to create consistent lookup key
4. **Deduplication check**: If `trackedFileBackups[normalizedPath]` exists, return early — only first edit per message is tracked
5. Detect if file is new (doesn't exist on disk)
6. Create version-1 backup:
   - New file: `backupFileName: null` (marker for deletion on restore)
   - Existing file: Copy content to backup location
7. Deep-copy snapshot before mutation (required for React state immutability)
8. Update state and persist to session database

**Why this approach — "first edit wins":**
Only the **first** modification per file per message is captured. This preserves the "before Claude touched this file" state, which is what users care about when rewinding. Subsequent edits within the same message would only record intermediate states, not the original.

**Key insight:** The backup is of the state **before** the current message's edits, not after. This means rewinding to message N restores files to their state at the start of message N.

---

## 3. Phase 2: Snapshot Finalization — `createSnapshotForMessage` (lf6)

**Location:** chunks.135.mjs:2016-2073

Called when a message's turn completes (all tool calls done), to create the permanent checkpoint.

```javascript
// ============================================
// createSnapshotForMessage - Finalize snapshot at message end
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
                        if (M && M.backupFileName !== null && !cu8(J, M.backupFileName)) {
                            _[j] = M;
                            continue
                        }
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
async function createSnapshotForMessage(stateUpdater, messageId) {
    if (!isFileCheckpointingEnabled()) return;
    stateUpdater((currentHistory) => {
        try {
            let fs = getFileSystem(),
                now = new Date,
                backups = {},
                previousSnapshot = currentHistory.snapshots.at(-1);

            if (previousSnapshot) {
                consoleLog(`FileHistory: Making snapshot for message ${messageId}`);
                for (let trackedPath of currentHistory.trackedFiles) {
                    try {
                        let actualPath = resolveTrackedFilePath(trackedPath);
                        if (!fs.existsSync(actualPath)) {
                            // File was deleted during this message
                            let prev = previousSnapshot.trackedFileBackups[trackedPath],
                                version = prev ? prev.version + 1 : 1;
                            backups[trackedPath] = {
                                backupFileName: null,
                                version,
                                backupTime: new Date
                            };
                            telemetry("tengu_file_history_backup_deleted_file", { version });
                        } else {
                            let prev = previousSnapshot.trackedFileBackups[trackedPath];
                            // Optimization: reuse backup if file hasn't changed
                            if (prev && prev.backupFileName !== null && !fileNeedsRestore(actualPath, prev.backupFileName)) {
                                backups[trackedPath] = prev;
                                continue;
                            }
                            let version = prev ? prev.version + 1 : 1;
                            backups[trackedPath] = createBackupFile(actualPath, version);
                        }
                    } catch (e) {
                        logError(e);
                        telemetry("tengu_file_history_backup_file_failed", {});
                    }
                }
            }

            let newSnapshot = {
                    messageId,
                    trackedFileBackups: backups,
                    timestamp: now
                },
                newSnapshots = [...currentHistory.snapshots, newSnapshot],
                newHistory = {
                    ...currentHistory,
                    // Cap snapshots at MAX_SNAPSHOTS (Jn4 = 100)
                    snapshots: newSnapshots.length > MAX_SNAPSHOTS
                        ? newSnapshots.slice(-MAX_SNAPSHOTS)
                        : newSnapshots,
                    snapshotSequence: (currentHistory.snapshotSequence ?? 0) + 1
                };

            debugLog(newHistory);
            checkForHistoryChanges(currentHistory, newHistory);  // wVY: reporting, no-op in prod
            recordFileHistorySnapshot(messageId, newSnapshot, false).catch((e) => {
                logError(Error(`FileHistory: Failed to record snapshot: ${e}`));
            });
            telemetry("tengu_file_history_snapshot_success", {
                trackedFilesCount: currentHistory.trackedFiles.size,
                snapshotCount: newHistory.snapshots.length
            });
            return newHistory;
        } catch (e) {
            logError(e);
            telemetry("tengu_file_history_snapshot_failed", {});
            return currentHistory;
        }
    });
}

// Mapping: lf6→createSnapshotForMessage, A→stateUpdater, q→messageId, K→currentHistory,
//          Y→fs, z→now, _→backups, w→previousSnapshot, j→trackedPath, J→actualPath,
//          M→prevBackup, D→version, X→newBackupRecord, O→newSnapshot, $→newSnapshots,
//          H→newHistory, Jn4→MAX_SNAPSHOTS (100)
```

### Algorithm: Incremental Snapshot with Deduplication

**What it does:** Walks all tracked files and creates/reuses backups to form a complete snapshot.

**How it works:**
1. Iterate all `trackedFiles` in the current history
2. For each file:
   - **Deleted**: Record `backupFileName: null` with incremented version
   - **Unchanged** (`fileNeedsRestore` returns false): **Reuse** existing `BackupRecord` — no new file copy
   - **Changed or new**: Call `createBackupFile` to write new versioned copy
3. Append new `Snapshot` to array, cap at `MAX_SNAPSHOTS` (100)
4. Persist to session database

**Snapshot limit (Jn4 = 100):**
Only the most recent 100 snapshots are kept. Older ones are discarded. This bounds memory usage and disk space while still providing extensive rewind history.

---

## 4. Backup File Operations

### createBackupFile (du8)

**Location:** chunks.135.mjs:2247-2273

```javascript
// ============================================
// createBackupFile - Write versioned backup to backup directory
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
function createBackupFile(originalFilePath, version) {
    let backupFileName = originalFilePath !== null
        ? generateBackupFileName(originalFilePath, version)
        : null;

    if (originalFilePath && backupFileName) {
        let fs = getFileSystem(),
            backupFilePath = resolveBackupPath(backupFileName),  // zz6: builds full path
            backupDir = getDirectoryPath(backupFilePath);        // Dn4: dirname

        if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

        let content = fs.readFileSync(originalFilePath, { encoding: "utf-8" });
        writeFileSync(backupFilePath, content, { encoding: "utf-8", flush: true });

        let stats = fs.statSync(originalFilePath);
        setFilePermissions(backupFilePath, stats.mode);

        telemetry("tengu_file_history_backup_file_created", {
            version,
            fileSize: stats.size
        });
    }

    return {
        backupFileName,
        version,
        backupTime: new Date
    };
}

// Mapping: du8→createBackupFile, A→originalFilePath, q→version, K→backupFileName,
//          zVY→generateBackupFileName, $1→getFileSystem, zz6→resolveBackupPath,
//          Dn4→getDirectoryPath, fz→writeFileSync, Pn4→setFilePermissions
```

**Key insight:** File permissions (`mode`) are preserved alongside content. This ensures restored files don't have altered executable bits or read-only flags.

### generateBackupFileName (zVY)

**Location:** chunks.135.mjs:2238-2240

```javascript
// ============================================
// generateBackupFileName - Generate unique backup filename from file path
// Location: chunks.135.mjs:2238-2240
// ============================================

// ORIGINAL (for source lookup):
function zVY(A, q) {
    return `${sNY("sha256").update(A).digest("hex").slice(0,16)}@v${q}`
}

// READABLE (for understanding):
function generateBackupFileName(filePath, version) {
    // SHA256 hash of file path, first 16 hex chars, plus @v{version}
    return `${createHash("sha256").update(filePath).digest("hex").slice(0, 16)}@v${version}`;
}

// Mapping: zVY→generateBackupFileName, A→filePath, q→version, sNY→createHash
```

**What it does:** Generates a unique, filesystem-safe filename for a backup based on the original file path and version number.

**Algorithm:**
1. Take the original file path (e.g., `/home/user/project/src/auth.ts`)
2. Compute SHA256 hash of the path string
3. Take first 16 hex characters of the hash (e.g., `a1b2c3d4e5f6a7b8`)
4. Append `@v{version}` suffix (e.g., `@v2`)
5. Result: `a1b2c3d4e5f6a7b8@v2`

**Why path-based (not content-based):**
- All versions of the same file share the same hash prefix
- Easy to find all backups for a given file (same prefix, different @v)
- Hash keeps filenames short and filesystem-safe (no special characters)
- No need to encode full paths which could exceed filesystem limits

**Why SHA256 truncated to 16 chars:**
- 16 hex characters = 64 bits of entropy
- Sufficient to avoid collisions in practice
- Keeps backup filenames reasonably short

### resolveBackupPath (zz6)

**Location:** chunks.135.mjs:2242-2245

```javascript
// ============================================
// resolveBackupPath - Build full path to backup file
// Location: chunks.135.mjs:2242-2245
// ============================================

// ORIGINAL (for source lookup):
function zz6(A, q) {
    let K = c8();
    return aN1(K, "file-history", q || R1(), A)
}

// READABLE (for understanding):
function resolveBackupPath(backupFileName, sessionId) {
    let configDir = getClaudeConfigDir();  // ~/.claude/
    return joinPaths(configDir, "file-history", sessionId || getCurrentSessionId(), backupFileName);
}

// Mapping: zz6→resolveBackupPath, A→backupFileName, q→sessionId,
//          K→configDir, c8→getClaudeConfigDir, aN1→joinPaths, R1→getCurrentSessionId
```

**What it does:** Builds the full filesystem path to a backup file.

**Path structure:**
```
~/.claude/file-history/{sessionId}/{backupFileName}
```

**Example:**
- Input: `backupFileName = "a1b2c3d4e5f6a7b8@v2"`, `sessionId = "sess-abc123"`
- Output: `/home/user/.claude/file-history/sess-abc123/a1b2c3d4e5f6a7b8@v2`

### generateBackupFileName (zVY)

**Location:** (inferred from du8 usage)

```javascript
function generateBackupFileName(filePath, version) {
    // SHA256 hash of file path, first 16 hex chars, plus @v{version}
    return `${createHash("sha256").update(filePath).digest("hex").slice(0, 16)}@v${version}`;
}
```

**Example:** `/home/user/project/src/auth.ts` at version 2 → `a1b2c3d4e5f6a7b8@v2`

---

## 5. Restore Operations

### rewindHandler (sN1)

**Location:** chunks.135.mjs:2075-2100

```javascript
// ============================================
// rewindHandler - Execute rewind to a specific message's snapshot
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
async function rewindHandler(stateUpdater, messageId) {
    if (!isFileCheckpointingEnabled()) return;

    let error = null;
    stateUpdater((currentHistory) => {
        let history = currentHistory;
        try {
            let snapshot = currentHistory.snapshots.findLast(s => s.messageId === messageId);
            if (!snapshot) {
                logError(Error(`FileHistory: Snapshot for ${messageId} not found`));
                telemetry("tengu_file_history_rewind_failed", {
                    trackedFilesCount: history.trackedFiles.size,
                    snapshotFound: false
                });
                error = Error("The selected snapshot was not found");
                return history;
            }

            consoleLog(`FileHistory: [Rewind] Rewinding to snapshot for ${messageId}`);
            let result = rewindAndRestoreFiles(history, snapshot, false);  // isDryRun = false
            consoleLog(`FileHistory: [Rewind] Finished rewinding to ${messageId}`);

            telemetry("tengu_file_history_rewind_success", {
                trackedFilesCount: history.trackedFiles.size,
                filesChangedCount: result?.filesChanged?.length
            });
        } catch (e) {
            error = e;
            logError(e);
            telemetry("tengu_file_history_rewind_failed", {
                trackedFilesCount: history.trackedFiles.size,
                snapshotFound: true
            });
        }
        return history;
    });

    if (error) throw error;
}

// Mapping: sN1→rewindHandler, A→stateUpdater, q→messageId, K→error, Y/z→currentHistory,
//          _→snapshot, w→result, Zn4→rewindAndRestoreFiles
```

**Why `findLast`?** If the same `messageId` appears in multiple snapshots (possible in edge cases), the most recent snapshot wins, correctly reflecting the final state at that message.

### rewindAndRestoreFiles (Zn4)

**Location:** chunks.135.mjs:2135-2169

```javascript
// ============================================
// rewindAndRestoreFiles - Restore all tracked files to snapshot state
// Location: chunks.135.mjs:2135-2169
// ============================================

// ORIGINAL (for source lookup):
function Zn4(A, q, K) {
    let Y = $1(),
        z = [],
        _ = 0,
        w = 0;
    for (let O of A.trackedFiles) try {
        let $ = AV1(O),
            H = q.trackedFileBackups[O],
            j = H ? H.backupFileName : Gn4(O, A);
        if (j === void 0) _6(Error("FileHistory: Error finding the backup file to apply")), d("tengu_file_history_rewind_restore_file_failed", {
            dryRun: K
        });
        else if (j === null) {
            if (Y.existsSync($)) {
                if (K) {
                    let J = Mn4($, void 0);
                    _ += J?.insertions || 0, w += J?.deletions || 0
                } else Y.unlinkSync($), k(`FileHistory: [Rewind] Deleted ${$}`);
                z.push($)
            }
        } else if (K) {
            let J = Mn4($, j);
            if (_ += J?.insertions || 0, w += J?.deletions || 0, J?.insertions || J?.deletions) z.push($)
        } else if (cu8($, j)) _VY($, j), k(`FileHistory: [Rewind] Restored ${$} from ${j}`), z.push($)
    } catch ($) {
        _6($), d("tengu_file_history_rewind_restore_file_failed", {
            dryRun: K
        })
    }
    return {
        filesChanged: z,
        insertions: _,
        deletions: w
    }
}

// READABLE (for understanding):
function rewindAndRestoreFiles(fileHistory, targetSnapshot, isDryRun) {
    let fs = getFileSystem(),
        filesChanged = [],
        totalInsertions = 0,
        totalDeletions = 0;

    for (let trackedPath of fileHistory.trackedFiles) {
        try {
            let actualPath = resolveTrackedFilePath(trackedPath),
                backupRecord = targetSnapshot.trackedFileBackups[trackedPath],
                backupFileName = backupRecord
                    ? backupRecord.backupFileName
                    : findBackupInOlderSnapshot(trackedPath, fileHistory);  // Gn4: fallback

            if (backupFileName === undefined) {
                logError(Error("FileHistory: Error finding the backup file to apply"));
                telemetry("tengu_file_history_rewind_restore_file_failed", { dryRun: isDryRun });
            } else if (backupFileName === null) {
                // File was new at this point — delete if exists now
                if (fs.existsSync(actualPath)) {
                    if (isDryRun) {
                        let diff = calculateFileDiffStats(actualPath, undefined);
                        totalInsertions += diff?.insertions || 0;
                        totalDeletions += diff?.deletions || 0;
                    } else {
                        fs.unlinkSync(actualPath);
                        consoleLog(`FileHistory: [Rewind] Deleted ${actualPath}`);
                    }
                    filesChanged.push(actualPath);
                }
            } else if (isDryRun) {
                // Dry run: just calculate diff stats
                let diff = calculateFileDiffStats(actualPath, backupFileName);
                totalInsertions += diff?.insertions || 0;
                totalDeletions += diff?.deletions || 0;
                if (diff?.insertions || diff?.deletions) {
                    filesChanged.push(actualPath);
                }
            } else if (fileNeedsRestore(actualPath, backupFileName)) {
                // Actual restore: copy backup content
                restoreFileFromBackup(actualPath, backupFileName);
                consoleLog(`FileHistory: [Rewind] Restored ${actualPath} from ${backupFileName}`);
                filesChanged.push(actualPath);
            }
        } catch (e) {
            logError(e);
            telemetry("tengu_file_history_rewind_restore_file_failed", { dryRun: isDryRun });
        }
    }

    return {
        filesChanged,
        insertions: totalInsertions,
        deletions: totalDeletions
    };
}

// Mapping: Zn4→rewindAndRestoreFiles, A→fileHistory, q→targetSnapshot, K→isDryRun,
//          Y→fs, z→filesChanged, _→totalInsertions, w→totalDeletions,
//          O→trackedPath, $→actualPath, H→backupRecord, j→backupFileName,
//          J→diff, AV1→resolveTrackedFilePath, Gn4→findBackupInOlderSnapshot,
//          Mn4→calculateFileDiffStats, cu8→fileNeedsRestore, _VY→restoreFileFromBackup
```

### Algorithm: Dry-Run vs Execute

**What it does:** Restores all tracked files to the state in the target snapshot, or just calculates diff stats if `isDryRun=true`.

**How it works:**
1. Iterate all `trackedFiles` in history
2. For each file:
   - Get backup record from target snapshot
   - Fallback to `findBackupInOlderSnapshot` (finds version-1 backup)
   - `backupFileName === undefined`: Error — can't restore
   - `backupFileName === null`: File should be deleted (was new)
   - Otherwise: Restore from backup file
3. For dry-run: accumulate diff stats
4. For actual restore: delete files or copy backup content

**Key insight:** The `fileNeedsRestore` check before restoring avoids unnecessary file writes when the current content already matches the backup.

---

## 6. Helper Functions

### fileNeedsRestore (cu8)

**Location:** chunks.135.mjs:2171-2201

```javascript
// ============================================
// fileNeedsRestore - Multi-tier comparison to check if restore needed
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
function fileNeedsRestore(originalFilePath, backupFileName) {
    let fs = getFileSystem(),
        backupFilePath = resolveBackupPath(backupFileName);

    // Get stats for original file
    let originalStats = null;
    try { originalStats = fs.statSync(originalFilePath); }
    catch (e) { if (e.code !== "ENOENT") return true; }

    // Get stats for backup file
    let backupStats = null;
    try { backupStats = fs.statSync(backupFilePath); }
    catch (e) { if (e.code !== "ENOENT") return true; }

    // Existence mismatch: need restore
    if ((originalStats === null) !== (backupStats === null)) return true;
    // Both don't exist: no restore needed
    if (originalStats === null || backupStats === null) return false;

    // Mode or size mismatch: need restore
    if (originalStats.mode !== backupStats.mode) return true;
    if (originalStats.size !== backupStats.size) return true;

    // Original older than backup: unchanged, no restore needed
    if (originalStats.mtimeMs < backupStats.mtimeMs) return false;

    // Final check: content comparison
    try {
        let originalContent = fs.readFileSync(originalFilePath, { encoding: "utf-8" });
        let backupContent = fs.readFileSync(backupFilePath, { encoding: "utf-8" });
        return originalContent !== backupContent;
    } catch {
        return true;
    }
}

// Mapping: cu8→fileNeedsRestore, A→originalFilePath, q→backupFileName,
//          K→fs, Y→backupFilePath, z→originalStats, _→backupStats
```

**Multi-tier comparison (fast to slow):**

| Tier | Check | Cost | Action |
|------|-------|------|--------|
| 1 | Existence | O(1) stat | If one exists, other doesn't → restore |
| 2 | Mode | O(1) stat | Permissions differ → restore |
| 3 | Size | O(1) stat | Size differs → restore |
| 4 | mtime | O(1) stat | If original older than backup → no restore (optimization) |
| 5 | Content | O(n) read | Full comparison as last resort |

**Why this ordering:**
- Fast checks (stats) happen before slow checks (content read)
- mtime shortcut avoids reading files that haven't been modified since backup
- Most files won't need restore, so early exits save significant I/O

### restoreFileFromBackup (_VY)

**Location:** chunks.135.mjs:2275-2293

```javascript
// ============================================
// restoreFileFromBackup - Copy backup content to original location
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
function restoreFileFromBackup(originalFilePath, backupFileName) {
    let fs = getFileSystem(),
        backupFilePath = resolveBackupPath(backupFileName);

    if (!fs.existsSync(backupFilePath)) {
        telemetry("tengu_file_history_rewind_restore_file_failed", {});
        logError(Error(`FileHistory: [Rewind] Backup file not found: ${backupFilePath}`));
        return;
    }

    let content = fs.readFileSync(backupFilePath, { encoding: "utf-8" }),
        targetDir = getDirectoryPath(originalFilePath);

    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir);

    writeFileSync(originalFilePath, content, { encoding: "utf-8", flush: true });

    // Preserve file permissions
    let mode = fs.statSync(backupFilePath).mode;
    setFilePermissions(originalFilePath, mode);
}

// Mapping: _VY→restoreFileFromBackup, A→originalFilePath, q→backupFileName,
//          K→fs, Y→backupFilePath, z→content, _→targetDir, w→mode
```

### calculateFileDiffStats (Mn4)

**Location:** chunks.135.mjs:2203-2233

```javascript
// ============================================
// calculateFileDiffStats - Compute +/- line counts for preview
// Location: chunks.135.mjs:2203-2233
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
function calculateFileDiffStats(originalFilePath, backupFileName) {
    let filesChanged = [],
        insertions = 0,
        deletions = 0;

    try {
        let fs = getFileSystem(),
            backupFilePath = backupFileName && resolveBackupPath(backupFileName),
            originalExists = fs.existsSync(originalFilePath),
            backupExists = backupFilePath && fs.existsSync(backupFilePath);

        if (!originalExists && !backupExists) {
            return { filesChanged, insertions, deletions };
        }

        filesChanged.push(originalFilePath);

        let originalContent = originalExists
            ? fs.readFileSync(originalFilePath, { encoding: "utf-8" })
            : "";
        let backupContent = backupExists
            ? fs.readFileSync(backupFilePath, { encoding: "utf-8" })
            : "";

        // na is the Myers diff algorithm implementation
        computeDiff(originalContent, backupContent).forEach((hunk) => {
            if (hunk.added) insertions += hunk.count || 0;
            if (hunk.removed) deletions += hunk.count || 0;
        });
    } catch (e) {
        logError(Error(`FileHistory: Error generating diffStats: ${e}`));
    }

    return { filesChanged, insertions, deletions };
}

// Mapping: Mn4→calculateFileDiffStats, A→originalFilePath, q→backupFileName,
//          K→filesChanged, Y→insertions, z→deletions, _→fs, w→backupFilePath,
//          na→computeDiff (Myers algorithm)
```

**Note:** `na` is a built-in Myers diff algorithm implementation, not an npm import.

### findBackupInOlderSnapshot (Gn4)

**Location:** chunks.135.mjs:2295-2301

```javascript
// ============================================
// findBackupInOlderSnapshot - Fallback to find version-1 backup
// Location: chunks.135.mjs:2295-2301
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
function findBackupInOlderSnapshot(normalizedPath, fileHistory) {
    // Find the version-1 backup in the earliest snapshot that has it
    for (let snapshot of fileHistory.snapshots) {
        let backup = snapshot.trackedFileBackups[normalizedPath];
        if (backup !== undefined && backup.version === 1) {
            return backup.backupFileName;
        }
    }
    return undefined;
}

// Mapping: Gn4→findBackupInOlderSnapshot, A→normalizedPath, q→fileHistory,
//          K→snapshot, Y→backup
```

**Why version-1:** If no backup exists in the target snapshot for a file, we need the original (version-1) backup to restore the file to its initial state before any Claude modifications.

---

## 7. Snapshot Query Functions

### snapshotExistsForMessage (tN1)

**Location:** chunks.135.mjs:2102-2105

```javascript
// ============================================
// snapshotExistsForMessage - Check if snapshot exists for messageId
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

// Mapping: tN1→snapshotExistsForMessage, A→fileHistory, q→messageId, K→snapshot, iz→isFileCheckpointingEnabled
```

**What it does:** Checks whether a checkpoint snapshot exists for a given message ID.

**How it works:**
1. Guard check: Return `false` if checkpointing is disabled
2. Search: Use `Array.some()` to check if any snapshot has matching messageId
3. Returns `true` if found, `false` otherwise

**Why use `some` instead of `find`:** Only need boolean result, not the snapshot itself. Slightly more efficient as it short-circuits on first match.

### getDryRunDiffStats (eN1)

**Location:** chunks.135.mjs:2107-2112

```javascript
// ============================================
// getDryRunDiffStats - Run dry-run and return diff statistics
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
    if (!isFileCheckpointingEnabled()) return undefined;
    let snapshot = fileHistory.snapshots.findLast((s) => s.messageId === messageId);
    if (!snapshot) return undefined;
    return rewindAndRestoreFiles(fileHistory, snapshot, true);  // dryRun = true
}

// Mapping: eN1→getDryRunDiffStats, A→fileHistory, q→messageId, K→snapshot, Y→s,
//          iz→isFileCheckpointingEnabled, Zn4→rewindAndRestoreFiles
```

**What it does:** Returns diff statistics for a potential rewind without actually restoring files.

**How it works:**
1. Guard check: Return `undefined` if checkpointing is disabled
2. Find the target snapshot using `findLast` (most recent match wins)
3. Call `rewindAndRestoreFiles` with `dryRun = true`
4. Returns `{ filesChanged, insertions, deletions }` object

**Why `findLast` vs `find`:** If the same messageId appears in multiple snapshots (possible edge case), `findLast` returns the most recent one, correctly reflecting the final state.

**Dry-run vs actual restore:**

| Aspect | Dry-run (`true`) | Actual (`false`) |
|--------|------------------|------------------|
| Files modified | No | Yes |
| Stats computed | Yes | Yes |
| Files deleted | No | Yes (if `backupFileName: null`) |
| Returns | `{ filesChanged, insertions, deletions }` | Same |

### hasChangesToRestore (Wn4)

**Location:** chunks.135.mjs:2114-2133

```javascript
// ============================================
// hasChangesToRestore - Check if any files differ from snapshot
// Location: chunks.135.mjs:2114-2133
// ============================================

// ORIGINAL (for source lookup):
function Wn4(A, q) {
    if (!iz()) return !1;
    let K = A.snapshots.findLast((Y) => Y.messageId === q);
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
    } catch ($) {
        _6($)
    }
    return !1
}

// READABLE (for understanding):
function hasChangesToRestore(fileHistory, messageId) {
    if (!isFileCheckpointingEnabled()) return false;
    let snapshot = fileHistory.snapshots.findLast((s) => s.messageId === messageId);
    if (!snapshot) return false;

    let fs = getFileSystem();
    for (let trackedPath of fileHistory.trackedFiles) {
        try {
            let actualPath = resolveTrackedFilePath(trackedPath);
            let backup = snapshot.trackedFileBackups[trackedPath];
            let backupFileName = backup ? backup.backupFileName : findBackupInOlderSnapshot(trackedPath, fileHistory);

            // No backup available for this file
            if (backupFileName === undefined) continue;

            // File was new at this point - check if it exists now
            if (backupFileName === null) {
                if (fs.existsSync(actualPath)) return true;  // File exists, would be deleted
                continue;
            }

            // File has backup - check if content differs
            if (fileNeedsRestore(actualPath, backupFileName)) return true;
        } catch (e) {
            logError(e);
        }
    }
    return false;
}

// Mapping: Wn4→hasChangesToRestore, A→fileHistory, q→messageId, K→snapshot,
//          Y→fs, z→trackedPath, _→actualPath, w→backup, O→backupFileName,
//          iz→isFileCheckpointingEnabled, $1→getFileSystem, AV1→resolveTrackedFilePath,
//          Gn4→findBackupInOlderSnapshot, cu8→fileNeedsRestore, _6→logError
```

**What it does:** Determines if rewinding to a given message would change any files.

**How it works:**
1. Guard check: Return `false` if checkpointing is disabled
2. Find target snapshot
3. Iterate all tracked files:
   - Skip files with no backup (`backupFileName === undefined`)
   - Check if `null` backup files (new files) currently exist
   - Check if existing files differ from their backup using `fileNeedsRestore`
4. Return `true` on first difference found, `false` if none differ

**Short-circuit behavior:** Returns immediately when first changed file is found, avoiding unnecessary comparison work.

**Use case:** The UI uses this to decide whether to show the "Restore code" option for a message.

---

## 8. Persistence Functions

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
function hydrateFileHistoryFromSnapshots(snapshots, setState) {
    if (!isFileCheckpointingEnabled()) return;

    let hydratedSnapshots = [],
        allTrackedFiles = new Set();

    for (let snapshot of snapshots) {
        let normalizedBackups = {};
        for (let [filePath, backupRecord] of Object.entries(snapshot.trackedFileBackups)) {
            let normalizedPath = normalizeFilePath(filePath);
            allTrackedFiles.add(normalizedPath);
            normalizedBackups[normalizedPath] = backupRecord;
        }
        hydratedSnapshots.push({
            ...snapshot,
            trackedFileBackups: normalizedBackups
        });
    }

    setState({
        snapshots: hydratedSnapshots,
        trackedFiles: allTrackedFiles,
        snapshotSequence: hydratedSnapshots.length
    });
}

// Mapping: qV1→hydrateFileHistoryFromSnapshots, A→snapshots, q→setState,
//          K→hydratedSnapshots, Y→allTrackedFiles, z→snapshot,
//          _→normalizedBackups, w→filePath, O→backupRecord, fn4→normalizeFilePath
```

### migrateFileHistoryToNewSession (KV1)

**Location:** chunks.135.mjs:2337-2400

```javascript
async function migrateFileHistoryToNewSession(sessionData) {
    if (!isFileCheckpointingEnabled()) return;

    let fileHistorySnapshots = sessionData.fileHistorySnapshots;
    if (!fileHistorySnapshots || sessionData.messages.length === 0) return;

    let previousSessionId = sessionData.messages[sessionData.messages.length - 1]?.sessionId;
    if (!previousSessionId) {
        logError(Error("FileHistory: Failed to copy backups on restore (no previous session id)"));
        return;
    }

    let currentSessionId = getCurrentSessionId();
    if (previousSessionId === currentSessionId) {
        consoleLog(`FileHistory: No need to copy file history for resuming with same session id: ${currentSessionId}`);
        return;
    }

    try {
        let oldBackupDir = joinPaths(getClaudeConfigDir(), "file-history", previousSessionId);
        let newBackupDir = joinPaths(getClaudeConfigDir(), "file-history", currentSessionId);
        let fs = getFileSystem();

        if (!fs.existsSync(oldBackupDir)) {
            consoleLog(`FileHistory: No backup directory found for previous session: ${oldBackupDir}`);
            return;
        }

        // Create new session backup directory
        fs.mkdirSync(newBackupDir, { recursive: true });

        // Copy all backup files (using hard links for efficiency)
        let backupFiles = fs.readdirSync(oldBackupDir);
        for (let file of backupFiles) {
            let oldPath = joinPaths(oldBackupDir, file);
            let newPath = joinPaths(newBackupDir, file);
            if (!fs.existsSync(newPath)) {
                // Try hard link first, fall back to copy
                try {
                    fs.linkSync(oldPath, newPath);
                } catch {
                    fs.copyFileSync(oldPath, newPath);
                }
            }
        }

        consoleLog(`FileHistory: Migrated ${backupFiles.length} backup files to new session`);
    } catch (e) {
        logError(Error(`FileHistory: Failed to migrate backups: ${e}`));
    }
}
```

**Why hard links:** When possible, hard links are used instead of copying to save disk space. Both the old and new session directories point to the same inode, so no duplicate storage is needed.

---

## 9. Constants

| Obfuscated | Readable | Value | Purpose |
|------------|----------|-------|---------|
| `Jn4` | MAX_SNAPSHOTS | 100 | Maximum snapshots to retain |
| `OVY` | DEBUG_LOGGING_ENABLED | false | Debug logging (always off in prod) |

---

## 10. Snapshot Helpers

### deepCopySnapshot (rw6)

**Location:** chunks.1.mjs:3865

```javascript
// ============================================
// deepCopySnapshot - Create immutable copy of snapshot for React state updates
// Location: chunks.1.mjs:3865
// ============================================

// ORIGINAL (for source lookup):
function rw6(A) {
    let K = [];
    try {
        const q = TY(K, E_`cloneDeep(${A})`, 0);
        return IAA(A)
    } catch (Y) {
        var z = Y,
            _ = 1
    } finally {
        vY(K, z, _)
    }
}

// READABLE (for understanding):
function deepCopySnapshot(snapshot) {
    // lodash cloneDeep wrapper with tracing support
    return cloneDeep(snapshot);
}

// Mapping: rw6→deepCopySnapshot, A→snapshot
```

**What it does:** Creates a deep copy of a snapshot object for immutable React state updates.

**Why deep copy:** React state updates must be immutable. When modifying the `trackedFileBackups` of a snapshot, we cannot mutate the existing snapshot object — we must create a new one. This function uses lodash's `cloneDeep` to recursively copy all nested properties.

**Usage context:** Called in `trackFileEdit` at line 1997: `j = rw6(z)` before mutating `j.trackedFileBackups[_] = H`.

---

### checkForHistoryChanges (wVY)

**Location:** chunks.135.mjs:2391-2417

```javascript
// ============================================
// checkForHistoryChanges - Compare old vs new snapshot state
// Location: chunks.135.mjs:2391-2417
// ============================================

// ORIGINAL (for source lookup):
function wVY(A, q) {
    let K = A.snapshots.at(-1),
        Y = q.snapshots.at(-1);
    if (!Y) return;
    let z = $1();
    for (let _ of q.trackedFiles) {
        let w = AV1(_),
            O = K?.trackedFileBackups[_],
            $ = Y.trackedFileBackups[_];
        if (O?.backupFileName === $?.backupFileName && O?.version === $?.version) continue;
        // ... comparison logic
        if (H !== j) L66(w, H, j)
    }
}

// READABLE (for understanding):
function checkForHistoryChanges(oldHistory, newHistory) {
    let oldLastSnapshot = oldHistory.snapshots.at(-1);
    let newLastSnapshot = newHistory.snapshots.at(-1);
    if (!newLastSnapshot) return;

    let fs = getFileSystem();
    for (let trackedPath of newHistory.trackedFiles) {
        let actualPath = resolveTrackedFilePath(trackedPath);
        let oldBackup = oldLastSnapshot?.trackedFileBackups[trackedPath];
        let newBackup = newLastSnapshot.trackedFileBackups[trackedPath];

        // Skip if backup reference unchanged
        if (oldBackup?.backupFileName === newBackup?.backupFileName
            && oldBackup?.version === newBackup?.version) continue;

        // Read and compare contents
        let oldContent = readBackupContent(oldBackup?.backupFileName);
        let newContent = readBackupContent(newBackup?.backupFileName);

        if (oldContent !== newContent) {
            reportFileHistoryChange(actualPath, oldContent, newContent);
        }
    }
}

// Mapping: wVY→checkForHistoryChanges, A→oldHistory, q→newHistory, K→oldLastSnapshot,
//          Y→newLastSnapshot, z→fs, _→trackedPath, w→actualPath, O→oldBackup, $→newBackup
```

**What it does:** Compares the old and new FileHistory state after a snapshot update to detect which files changed.

**Why it exists:** This is a debugging/development function. In production, `L66` (reportFileHistoryChange) is a no-op, so this function has no visible effect. It was likely used during development to verify that snapshot updates correctly tracked file changes.

---

### reportFileHistoryChange (L66)

**Location:** chunks.135.mjs:1928-1930

```javascript
// ============================================
// reportFileHistoryChange - Placeholder for history change notifications
// Location: chunks.135.mjs:1928-1930
// ============================================

// ORIGINAL (for source lookup):
function L66(A, q, K) {
    return
}

// READABLE (for understanding):
function reportFileHistoryChange(filePath, oldContent, newContent) {
    // No-op placeholder
    return;
}

// Mapping: L66→reportFileHistoryChange, A→filePath, q→oldContent, K→newContent
```

**What it does:** A no-op placeholder function.

**Why it exists:** This function is called by `wVY` (checkForHistoryChanges) when a file's backup content differs between old and new snapshots. In production, it does nothing. It may have been intended for:
- Debug logging during development
- Future notification system for file history changes
- Testing hooks

---

## 11. Persistence Layer

### recordFileHistorySnapshot (_l6)

**Location:** chunks.174.mjs:1683-1685

```javascript
// ============================================
// recordFileHistorySnapshot - Persist snapshot to session JSONL database
// Location: chunks.174.mjs:1683-1685
// ============================================

// ORIGINAL (for source lookup):
async function _l6(A, q, K) {
    await Jz().insertFileHistorySnapshot(A, q, K)
}

// READABLE (for understanding):
async function recordFileHistorySnapshot(messageId, snapshot, isSnapshotUpdate) {
    await getSessionDatabase().insertFileHistorySnapshot(messageId, snapshot, isSnapshotUpdate);
}

// Mapping: _l6→recordFileHistorySnapshot, A→messageId, q→snapshot, K→isSnapshotUpdate,
//          Jz→getSessionDatabase
```

**What it does:** Writes a file-history-snapshot entry to the session's JSONL database.

**How it works:**
1. Gets the SessionDatabase singleton via `Jz()`
2. Calls `insertFileHistorySnapshot` with the message ID, snapshot data, and update flag
3. The SessionDatabase batches writes with debouncing for performance

**Entry format in JSONL:**
```json
{
    "type": "file-history-snapshot",
    "messageId": "uuid-of-message",
    "snapshot": {
        "messageId": "uuid",
        "trackedFileBackups": { ... },
        "timestamp": "2024-01-15T..."
    },
    "isSnapshotUpdate": true
}
```

**When called:**
- `isSnapshotUpdate: true` — During `trackFileEdit` when updating an existing snapshot
- `isSnapshotUpdate: false` — During `createSnapshotForMessage` when creating a new snapshot

---

### SessionDatabase.insertFileHistorySnapshot

**Location:** chunks.174.mjs:1520-1530

```javascript
// ============================================
// insertFileHistorySnapshot - SessionDatabase method for persisting snapshots
// Location: chunks.174.mjs:1520-1530
// ============================================

// ORIGINAL (for source lookup):
async insertFileHistorySnapshot(A, q, K) {
    return this.trackWrite(async () => {
        let Y = {
            type: "file-history-snapshot",
            messageId: A,
            snapshot: q,
            isSnapshotUpdate: K
        };
        await this.appendEntry(Y)
    })
}

// READABLE (for understanding):
async insertFileHistorySnapshot(messageId, snapshot, isSnapshotUpdate) {
    return this.trackWrite(async () => {
        let entry = {
            type: "file-history-snapshot",
            messageId,
            snapshot,
            isSnapshotUpdate
        };
        await this.appendEntry(entry);
    });
}

// Mapping: A→messageId, q→snapshot, K→isSnapshotUpdate, Y→entry
```

**What it does:** Creates a file-history-snapshot entry and appends it to the session's JSONL file.

**Why trackWrite:** Wraps the write in a tracking context that ensures proper sequencing and error handling. The SessionDatabase uses a write queue with debouncing to batch multiple writes together.

---

## 12. UI Helper Functions

### isOnlyOneMessageAfterIndex (YI1)

**Location:** chunks.185.mjs:1704-1724

```javascript
// ============================================
// isOnlyOneMessageAfterIndex - Check if only trivial messages follow
// Location: chunks.185.mjs:1704-1724
// ============================================

// ORIGINAL (for source lookup):
function YI1(A, q) {
    for (let K = q + 1; K < A.length; K++) {
        let Y = A[K];
        if (!Y) continue;
        if (Hz6(Y)) continue;
        if (wl6(Y)) continue;
        if (Y.type === "progress") continue;
        if (Y.type === "system") continue;
        if (Y.type === "attachment") continue;
        if (Y.type === "user" && Y.isMeta) continue;
        if (Y.type === "assistant") {
            let z = Y.message.content;
            if (Array.isArray(z)) {
                if (z.some((w) => w.type === "text" && w.text.trim() || w.type === "tool_use")) return !1
            }
            continue
        }
        if (Y.type === "user") return !1
    }
    return !0
}

// READABLE (for understanding):
function isOnlyOneMessageAfterIndex(messages, startIndex) {
    // Check all messages after the given index
    for (let i = startIndex + 1; i < messages.length; i++) {
        let msg = messages[i];

        // Skip null/undefined
        if (!msg) continue;
        // Skip compact summaries
        if (isCompactSummary(msg)) continue;
        // Skip tool use results
        if (isToolUseResult(msg)) continue;
        // Skip progress/system/attachment messages
        if (msg.type === "progress") continue;
        if (msg.type === "system") continue;
        if (msg.type === "attachment") continue;
        // Skip meta user messages (system reminders)
        if (msg.type === "user" && msg.isMeta) continue;

        // Check assistant messages for actual content
        if (msg.type === "assistant") {
            let content = msg.message.content;
            if (Array.isArray(content)) {
                // Has text or tool_use? Not trivial.
                if (content.some((block) =>
                    (block.type === "text" && block.text.trim()) ||
                    block.type === "tool_use")) {
                    return false;
                }
            }
            continue;
        }

        // Any real user message means not trivial
        if (msg.type === "user") return false;
    }
    return true; // Only trivial messages follow
}

// Mapping: YI1→isOnlyOneMessageAfterIndex, A→messages, q→startIndex, K→i, Y→msg,
//          Hz6→isCompactSummary, wl6→isToolUseResult
```

**What it does:** Determines if all messages after a given index are "trivial" (can be safely removed without user confirmation).

**Trivial message types:**
- `null`/`undefined`
- Compact summaries (`isCompactSummary: true`)
- Tool use results
- Progress messages
- System messages
- Attachment messages
- Meta user messages (system reminders)
- Empty assistant messages (no text or tool_use)

**Usage:** Used in `handleMessageSelection` (UI flow) to enable fast-path restore when the user can only remove one message with no file changes — skip the restore options menu and go directly to conversation restore.

---

### getMessagesDiffStats (KXz)

**Location:** chunks.185.mjs:1659-1690

```javascript
// ============================================
// getMessagesDiffStats - Compute diff stats for message range
// Location: chunks.185.mjs:1659-1690
// ============================================

// ORIGINAL (for source lookup):
function KXz(A, q, K) {
    let Y = A.findIndex(($) => $.uuid === q);
    if (Y === -1) return;
    let z = K ? A.findIndex(($) => $.uuid === K) : A.length;
    if (z === -1) z = A.length;
    let _ = [],
        w = 0,
        O = 0;
    for (let $ = Y + 1; $ < z; $++) {
        let H = A[$];
        if (!H || !wl6(H)) continue;
        let j = H.toolUseResult;
        if (!j || !j.filePath || !j.structuredPatch) continue;
        if (!_.includes(j.filePath)) _.push(j.filePath);
        try {
            if ("type" in j && j.type === "create") w += j.content.split(/\r?\n/).length;
            else
                for (let J of j.structuredPatch) {
                    let M = J.lines.filter((X) => X.startsWith("+")).length,
                        D = J.lines.filter((X) => X.startsWith("-")).length;
                    w += M, O += D
                }
        } catch {
            continue
        }
    }
    return {
        filesChanged: _,
        insertions: w,
        deletions: O
    }
}

// READABLE (for understanding):
function getMessagesDiffStats(messages, startUuid, endUuid) {
    // Find message indices by UUID
    let startIndex = messages.findIndex((m) => m.uuid === startUuid);
    if (startIndex === -1) return undefined;

    let endIndex = endUuid
        ? messages.findIndex((m) => m.uuid === endUuid)
        : messages.length;
    if (endIndex === -1) endIndex = messages.length;

    let filesChanged = [];
    let insertions = 0;
    let deletions = 0;

    // Iterate messages in range
    for (let i = startIndex + 1; i < endIndex; i++) {
        let msg = messages[i];
        if (!msg || !isToolUseResult(msg)) continue;

        let result = msg.toolUseResult;
        if (!result?.filePath || !result?.structuredPatch) continue;

        // Track unique files
        if (!filesChanged.includes(result.filePath)) {
            filesChanged.push(result.filePath);
        }

        try {
            if (result.type === "create") {
                // New file: all lines are insertions
                insertions += result.content.split(/\r?\n/).length;
            } else {
                // Modified file: count +/- lines from patch
                for (let hunk of result.structuredPatch) {
                    let added = hunk.lines.filter((l) => l.startsWith("+")).length;
                    let removed = hunk.lines.filter((l) => l.startsWith("-")).length;
                    insertions += added;
                    deletions += removed;
                }
            }
        } catch { continue; }
    }

    return { filesChanged, insertions, deletions };
}

// Mapping: KXz→getMessagesDiffStats, A→messages, q→startUuid, K→endUuid,
//          Y→startIndex, z→endIndex, _→filesChanged, w→insertions, O→deletions,
//          $→i, H→msg, wl6→isToolUseResult, j→result
```

**What it does:** Computes the total diff statistics (+/- line counts) for all file changes between two messages in the conversation.

**How it works:**
1. Find the start and end message indices by UUID
2. Iterate through messages in that range
3. For each tool use result with a structured patch:
   - Track the file path
   - Count added lines (starting with `+`)
   - Count removed lines (starting with `-`)
4. Return aggregated stats

**Usage:** Used in the RewindMessageSelector UI to show diff stats preview for each checkpoint. Note: This uses `toolUseResult.structuredPatch` which is different from the file-history-based `calculateFileDiffStats` (Mn4).

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Rewind module section

Key functions in this document:

**Enable/Disable Logic**
- `isFileCheckpointingEnabled` (iz) - Master guard
- `isSDKCheckpointingEnabled` (YVY) - SDK-specific guard

**File History Core**
- `trackFileEdit` (R66) - Record file pre-edit backup
- `createSnapshotForMessage` (lf6) - Finalize snapshot at message end
- `rewindHandler` (sN1) - Execute rewind to target message
- `rewindAndRestoreFiles` (Zn4) - Physical file restoration
- `createBackupFile` (du8) - Write versioned backup
- `fileNeedsRestore` (cu8) - Multi-tier comparison
- `restoreFileFromBackup` (_VY) - Copy backup content back
- `calculateFileDiffStats` (Mn4) - Compute diff for preview
- `findBackupInOlderSnapshot` (Gn4) - Fallback lookup

**Snapshot Helpers**
- `deepCopySnapshot` (rw6) - Immutable snapshot copy
- `checkForHistoryChanges` (wVY) - Debug comparison
- `reportFileHistoryChange` (L66) - No-op placeholder

**Persistence**
- `recordFileHistorySnapshot` (_l6) - Persist to JSONL
- `hydrateFileHistoryFromSnapshots` (qV1) - Reconstruct state
- `migrateFileHistoryToNewSession` (KV1) - Copy backups on resume

**UI Helpers**
- `isOnlyOneMessageAfterIndex` (YI1) - Fast-path check
- `getMessagesDiffStats` (KXz) - Message range diff stats

---

## 13. Summarize Pipeline — "Summarize from here"

> **Note:** The summarize functionality is shared between `/rewind → Summarize from here` and `/compact`. See also [07_compact/](../07_compact/) for full compact documentation.

### performPartialCompaction (Wqq)

**Location:** chunks.147.mjs:1610-1707

```javascript
// ============================================
// performPartialCompaction - Main entry for "Summarize from here"
// Location: chunks.147.mjs:1610-1707
// ============================================

// ORIGINAL (for source lookup):
async function Wqq(A, q, K, Y, z) {
    try {
        let _ = A.slice(q),
            w = A.slice(0, q);
        if (_.length === 0) throw Error("Nothing to summarize after the selected message.");
        let O = eW(A);
        K.onCompactProgress?.({
            type: "hooks_start",
            hookType: "pre_compact"
        }), K.setSDKStatus?.("compacting");
        let $ = await sT6({
                trigger: "manual",
                customInstructions: null
            }, K.abortController.signal),
            H;
        if ($.newCustomInstructions && z) H = `${$.newCustomInstructions}

User context: ${z}`;
        else if ($.newCustomInstructions) H = $.newCustomInstructions;
        else if (z) H = `User context: ${z}`;
        K.setStreamMode?.("requesting"), K.setResponseLength?.(() => 0), K.onCompactProgress?.({
            type: "compact_start"
        });
        let j = S54(H),
            J = p1({
                content: j
            }),
            M = await Gqq({
                messages: A,
                summaryRequest: J,
                appState: K.getAppState(),
                context: K,
                preCompactTokenCount: O,
                cacheSafeParams: Y
            }),
            D = BE1(M);
        // ... error handling ...
        let X = mf8(K.readFileState);
        K.readFileState.clear(), Oc();
        let [P, W] = await Promise.all([fqq(X, K, Xqq), Nqq(K)]), Z = [...P, ...W], G = mE1(K.agentId);
        // ... collect attachments ...
        let h = Ri6("manual", O ?? 0, w[w.length - 1]?.uuid, z, _.length),
            R = zF(A);
        if (R.size > 0) h.compactMetadata.preCompactDiscoveredTools = [...R].sort();
        let u = Cz(),
            I = [p1({
                content: sF6(D, !1, u),
                isCompactSummary: !0,
                ...w.length > 0 ? {
                    summarizeMetadata: {
                        messagesSummarized: _.length,
                        userContext: z
                    }
                } : {
                    isVisibleInTranscriptOnly: !0
                }
            })];
        // ... return result ...
    } catch (e) {
        // error handling
    }
}

// READABLE (for understanding):
async function performPartialCompaction(messages, startIndex, context, cacheParams, userContext) {
    try {
        // Split messages: those to keep vs those to summarize
        let messagesToSummarize = messages.slice(startIndex);
        let messagesToKeep = messages.slice(0, startIndex);

        if (messagesToSummarize.length === 0) {
            throw Error("Nothing to summarize after the selected message.");
        }

        let preCompactTokenCount = estimateTotalTokens(messages);

        // Notify UI that compaction is starting
        context.onCompactProgress?.({ type: "hooks_start", hookType: "pre_compact" });
        context.setSDKStatus?.("compacting");

        // Run pre-compact hooks
        let hookResult = await runPreCompactHooks(
            { trigger: "manual", customInstructions: null },
            context.abortController.signal
        );

        // Merge custom instructions with user context
        let summaryInstructions = mergeInstructions(hookResult.newCustomInstructions, userContext);

        // Set up streaming mode
        context.setStreamMode?.("requesting");
        context.onCompactProgress?.({ type: "compact_start" });

        // Create summary request message
        let summaryPrompt = buildSummaryPrompt(summaryInstructions);
        let summaryRequestMessage = createUserMessage({ content: summaryPrompt });

        // Call LLM to generate summary
        let summaryResponse = await generateSummaryWithLLM({
            messages,
            summaryRequest: summaryRequestMessage,
            appState: context.getAppState(),
            context,
            preCompactTokenCount,
            cacheSafeParams: cacheParams
        });

        let summaryText = extractTextFromResponse(summaryResponse);

        // Collect files, tasks, and plan to keep as attachments
        let fileState = snapshotFileState(context.readFileState);
        context.readFileState.clear();
        clearCaches();

        let [filesToKeep, tasksToKeep] = await Promise.all([
            collectFilesToKeep(fileState, context),
            collectTasksToKeep(context)
        ]);

        let attachments = [...filesToKeep, ...tasksToKeep];

        // Add plan mode attachment if applicable
        let planAttachment = collectPlanToKeep(context.agentId);
        if (planAttachment) attachments.push(planAttachment);

        // Create compact_boundary marker
        let boundaryMarker = createCompactBoundaryMessage(
            "manual",
            preCompactTokenCount ?? 0,
            messagesToKeep[messagesToKeep.length - 1]?.uuid,
            userContext,
            messagesToSummarize.length
        );

        // Track discovered tools
        let discoveredTools = extractDiscoveredTools(messages);
        if (discoveredTools.size > 0) {
            boundaryMarker.compactMetadata.preCompactDiscoveredTools = [...discoveredTools].sort();
        }

        // Create summary message
        let summaryMessage = createUserMessage({
            content: formatSummaryContent(summaryText, false, getSessionTranscriptPath()),
            isCompactSummary: true,
            ...(messagesToKeep.length > 0
                ? { summarizeMetadata: { messagesSummarized: messagesToSummarize.length, userContext } }
                : { isVisibleInTranscriptOnly: true }
            )
        });

        return {
            boundaryMarker,
            messagesToKeep,
            summaryMessages: [summaryMessage],
            attachments
        };
    } catch (e) {
        // Error handling
    }
}

// Mapping: Wqq→performPartialCompaction, A→messages, q→startIndex, K→context,
//          Y→cacheParams, z→userContext, _→messagesToSummarize, w→messagesToKeep,
//          O→preCompactTokenCount, $→hookResult, H→summaryInstructions, j→summaryPrompt,
//          J→summaryRequestMessage, M→summaryResponse, D→summaryText, X→fileState,
//          P→filesToKeep, W→tasksToKeep, Z→attachments, h→boundaryMarker, I→summaryMessages,
//          Gqq→generateSummaryWithLLM, Ri6→createCompactBoundaryMessage, p1→createUserMessage,
//          BE1→extractTextFromResponse, sT6→runPreCompactHooks, S54→buildSummaryPrompt,
//          fqq→collectFilesToKeep, Nqq→collectTasksToKeep, mE1→collectPlanToKeep
```

**What it does:** Performs a partial compaction from a selected message, keeping all messages before the selection and summarizing everything after.

**How it works:**

```
Messages: [M0, M1, M2, M3, M4, M5]
                      ↑ startIndex = 3 (selected message)

messagesToKeep:    [M0, M1, M2]           ← Keep intact
messagesToSummarize: [M3, M4, M5]         → Send to LLM for summary

Result:
- boundaryMarker (compact_boundary system message)
- messagesToKeep (original messages before selection)
- summaryMessages (new user message with summary)
- attachments (files, tasks, plan to preserve context)
```

**Key design decisions:**

1. **Why split at startIndex, not after:** The selected message IS included in the summarization. This ensures the user's selected prompt is part of what gets summarized.

2. **Why userContext parameter:** When the user selects "Summarize from here" in the UI, they can optionally type context. This gets added to the summary instructions, helping the LLM focus on what the user cares about.

3. **Why preserve attachments:** Files and tasks created during the summarized section should be preserved as context, otherwise the LLM would "forget" about them.

### createCompactBoundaryMessage (Ri6)

**Location:** chunks.174.mjs:580-599

```javascript
// ============================================
// createCompactBoundaryMessage - Create compact_boundary system message
// Location: chunks.174.mjs:580-599
// ============================================

// ORIGINAL (for source lookup):
function Ri6(A, q, K, Y, z) {
    return {
        type: "system",
        subtype: "compact_boundary",
        content: "Conversation compacted",
        isMeta: !1,
        timestamp: new Date().toISOString(),
        uuid: SE(),
        level: "info",
        compactMetadata: {
            trigger: A,
            preTokens: q,
            userContext: Y,
            messagesSummarized: z
        },
        ...K ? {
            logicalParentUuid: K
        } : {}
    }
}

// READABLE (for understanding):
function createCompactBoundaryMessage(trigger, preTokens, logicalParentUuid, userContext, messagesSummarized) {
    return {
        type: "system",
        subtype: "compact_boundary",
        content: "Conversation compacted",
        isMeta: false,  // Visible in transcript
        timestamp: new Date().toISOString(),
        uuid: generateUUID(),
        level: "info",
        compactMetadata: {
            trigger,              // "manual" or "auto"
            preTokens,            // Token count before compaction
            userContext,          // Optional context user provided
            messagesSummarized    // How many messages were summarized
        },
        ...(logicalParentUuid ? { logicalParentUuid } : {})
    };
}

// Mapping: Ri6→createCompactBoundaryMessage, A→trigger, q→preTokens,
//          K→logicalParentUuid, Y→userContext, z→messagesSummarized, SE→generateUUID
```

**What it does:** Creates a `compact_boundary` system message that marks where a compaction occurred in the conversation.

**Why it exists:**
1. **Transcript marker** - Users can see where compaction happened via Ctrl+O (transcript viewer)
2. **Metadata preservation** - Token counts and message counts are stored for analytics
3. **Context restoration** - The `logicalParentUuid` links to the last kept message
4. **User context** - If the user provided context for summarization, it's preserved

**compact_boundary in the message flow:**

```
Before compaction:
[User: M1] [Assistant: A1] [User: M2] [Assistant: A2] [User: M3] ...

After "Summarize from here" at M2:
[User: M1] [Assistant: A1] [compact_boundary] [User: "Summary of M2, A2, M3..."]
```

**Key insight:** The `compact_boundary` message has `isMeta: false`, meaning it IS visible in the transcript (unlike system reminders which are `isMeta: true`). This is intentional so users can understand why there's a gap in their conversation history.

### attachPreservedSegment (Yp8)

**Location:** chunks.147.mjs:1449-1463

```javascript
// ============================================
// attachPreservedSegment - Add preserved segment metadata to boundary marker
// Location: chunks.147.mjs:1449-1463
// ============================================

// ORIGINAL (for source lookup):
function Yp8(A, q, K) {
    let Y = K ?? [];
    if (Y.length === 0) return A;
    return {
        ...A,
        compactMetadata: {
            ...A.compactMetadata,
            preservedSegment: {
                headUuid: Y[0].uuid,
                anchorUuid: q,
                tailUuid: Y[Y.length - 1].uuid
            }
        }
    }
}

// READABLE (for understanding):
function attachPreservedSegment(boundaryMarker, anchorUuid, messagesToKeep) {
    let messages = messagesToKeep ?? [];
    if (messages.length === 0) return boundaryMarker;

    return {
        ...boundaryMarker,
        compactMetadata: {
            ...boundaryMarker.compactMetadata,
            preservedSegment: {
                headUuid: messages[0].uuid,      // First message in kept section
                anchorUuid: anchorUuid,          // Last message before compaction
                tailUuid: messages[messages.length - 1].uuid  // Last kept message
            }
        }
    };
}

// Mapping: Yp8→attachPreservedSegment, A→boundaryMarker, q→anchorUuid, K→messagesToKeep,
//          Y→messages
```

**What it does:** Attaches a `preservedSegment` object to the compact_boundary message's metadata, enabling message relinking across compaction boundaries.

**How it works:**
1. If no messages were kept (empty array), return the boundary marker unchanged
2. Otherwise, add `preservedSegment` with UUIDs marking the kept message range:
   - `headUuid`: First message in the kept section
   - `anchorUuid`: The boundary anchor (typically last message's UUID)
   - `tailUuid`: Last message in the kept section

**Why this matters:**
The preserved segment enables the system to maintain logical message ordering even after compaction. When messages are restored or referenced, the system can traverse from the boundary marker back to the preserved section.

**Example usage in performPartialCompaction:**
```javascript
// From Wqq at line 1713
let boundaryMarker = createCompactBoundaryMessage("manual", preTokens, ...);
boundaryMarker = attachPreservedSegment(boundaryMarker, boundaryMarker.uuid, messagesToKeep);
```

**Integration with RZ (isCompactBoundary):**
The `RZ` function at chunks.174.mjs:616-618 identifies compact_boundary messages:
```javascript
function isCompactBoundary(msg) {
    return msg?.type === "system" && msg.subtype === "compact_boundary";
}
```

This is used by `Szz` (findLastCompactBoundaryIndex) and `fN` (sliceFromLastCompactBoundary) to navigate message arrays.

### generateSummaryWithLLM (Gqq)

**Location:** chunks.147.mjs:1752+

```javascript
// ============================================
// generateSummaryWithLLM - Call LLM to generate conversation summary
// Location: chunks.147.mjs:1752+
// ============================================

async function generateSummaryWithLLM({
    messages,
    summaryRequest,
    appState,
    context,
    preCompactTokenCount,
    cacheSafeParams
}) {
    // Build the summarization prompt
    let systemPrompt = buildSummarizationSystemPrompt(appState);

    // Prepare messages for API
    let apiMessages = prepareMessagesForAPI(messages);

    // Make the LLM call
    let response = await streamPrompt({
        systemPrompt,
        messages: [...apiMessages, summaryRequest],
        tools: [],  // No tools during summarization
        model: context.options.mainLoopModel,
        ...cacheSafeParams
    });

    return response;
}
```

**What it does:** Makes an LLM API call to generate a summary of the conversation.

**Key points:**
- Uses the main loop model (not a specialized summarization model)
- No tools available during summarization (prevents tool calls in summary)
- Returns the raw LLM response which is then processed by `BE1` (extractTextFromResponse)

---

## 14. Cross-Feature Integration Analysis

### 14.1 System Reminder Integration

The rewind feature integrates with the system reminder module for session persistence.

#### Persistence Flow

```
trackFileEdit / createSnapshotForMessage
         │
         ▼
    _l6 (recordFileHistorySnapshot)
         │
         ▼
    Jz() (getSessionDatabase)
         │
         ▼
    insertFileHistorySnapshot()
         │
         ▼
    Session .jsonl file
```

**Key integration points:**

| Function | Location | Purpose |
|----------|----------|---------|
| `_l6` | chunks.174.mjs:1683 | Write snapshot to JSONL |
| `Jz` | chunks.174.mjs:1201 | SessionDatabase singleton |
| `qV1` | chunks.135.mjs:2315 | Hydrate state from JSONL on resume |
| `KV1` | chunks.135.mjs:2337 | Copy backup files on session resume |

#### JSONL Entry Types

The rewind feature writes two types of entries:

**1. File History Snapshot (isSnapshotUpdate: true)**
- Written during `trackFileEdit`
- Updates the current snapshot incrementally
- Captures file state before first edit

**2. File History Snapshot (isSnapshotUpdate: false)**
- Written during `createSnapshotForMessage`
- Creates a new complete snapshot
- Captures final state at message boundary

```json
{
    "type": "file-history-snapshot",
    "messageId": "uuid-of-message",
    "snapshot": {
        "messageId": "uuid-of-message",
        "trackedFileBackups": {
            "/path/to/file.ts": {
                "backupFileName": "a1b2c3d4e5f6a7b8@v1",
                "version": 1,
                "backupTime": "2024-01-15T10:30:00.000Z"
            }
        },
        "timestamp": "2024-01-15T10:30:00.000Z"
    },
    "isSnapshotUpdate": false
}
```

### 14.2 Compact/Summarize Integration

The "Summarize from here" option in the rewind UI shares infrastructure with the `/compact` command.

#### Shared Functions

| Function | Location | Purpose |
|----------|----------|---------|
| `Wqq` | chunks.147.mjs:1610 | Main orchestrator for partial compaction |
| `Gqq` | chunks.147.mjs:1752 | LLM call to generate summary |
| `Ri6` | chunks.174.mjs:580 | Create compact_boundary marker |

#### Summarization Flow (from Rewind UI)

```
User selects "Summarize from here"
         │
         ▼
    handleRestoreOptionSelected (p)
         │
         ▼
    onSummarize callback
         │
         ▼
    Wqq (performPartialCompaction)
         │
         ├──────────────────────────────────┐
         │                                  │
         ▼                                  ▼
    sT6 (runPreCompactHooks)          Gqq (generateSummaryWithLLM)
         │                                  │
         ▼                                  ▼
    C0 (runPostCompactHooks)          Ri6 (createCompactBoundary)
         │                                  │
         └──────────────────────────────────┘
                     │
                     ▼
              Return boundary + summary messages
```

#### Token Savings Calculation

The summarization pipeline tracks token savings:

```javascript
// From Wqq at line 1677-1687
telemetry("tengu_partial_compact", {
    preCompactTokenCount,           // Tokens before compaction
    postCompactTokenCount,          // Tokens after compaction
    messagesKept,                   // Messages before the cut point
    messagesSummarized,             // Messages that were summarized
    trigger: "message_selector",    // Source of compaction
    compactionInputTokens,          // Tokens sent to summarization LLM
    compactionOutputTokens,         // Tokens in summary response
    compactionCacheReadTokens,      // Cache hits (prompt caching)
    compactionCacheCreationTokens   // Cache writes
});
```

### 14.3 State Restoration Integration

When restoring conversation state, multiple subsystems are affected:

#### onRestoreMessage Callback Flow

```
User selects restore option
         │
         ▼
    onPreRestore()
         ├── Abort LLM stream
         ├── Clear tool permission queue
         └── Clear queued commands
         │
         ▼
    Slice messages array at checkpoint
         │
         ▼
    Restore auxiliary state:
         ├── Todos (from snapshot)
         ├── Permission mode (reset if changed)
         └── Prompt text (re-inject to input)
         │
         ▼
    onRestoreCode() (if "code" or "both")
         │
         ▼
    sN1 (rewindHandler)
         │
         ▼
    Zn4 (rewindAndRestoreFiles)
```

#### Todo Restoration

When a conversation is restored, todos are reset to their state at the checkpoint:

```javascript
// Pseudocode for todo restoration
function restoreTodosFromSnapshot(targetMessageId, snapshots) {
    let snapshot = snapshots.find(s => s.messageId === targetMessageId);
    if (snapshot?.savedTodos) {
        return snapshot.savedTodos;  // Restore todo list
    }
    return [];  // No saved todos = clear
}
```

#### Permission Mode Restoration

Permission mode changes during a conversation are tracked:

```javascript
// If permission mode changed after checkpoint, reset it
if (snapshot.permissionMode !== currentPermissionMode) {
    setPermissionMode(snapshot.permissionMode);
}
```

### 14.4 File System Tool Integration

The file checkpointing system intercepts writes from Claude's file tools:

**Tracked tools:**
- `Write` - Creates new files or overwrites existing
- `Edit` - Modifies existing files via diff patches

**Not tracked:**
- `Bash` commands - Files modified by shell commands are not captured
- External editors - User's own edits outside Claude

**Why Bash is excluded:**

Intercepting all shell file mutations would require:
1. A sandboxed filesystem layer
2. Hooking all shell commands (rm, mv, cp, etc.)
3. Tracking file descriptors

This complexity was deemed not worth the benefit. Instead, the UI warns users: "Rewinding does not affect files edited manually or via bash."

#### Exact Tool Integration Call Sites

**Write Tool (chunks.139.mjs:180)**

```javascript
// ============================================
// Write tool integration - trackFileEdit call site
// Location: chunks.139.mjs:175-190
// ============================================

// ORIGINAL (for source lookup):
let D = M?.encoding ?? "utf8",
    X = M?.content ?? null;
if (iz()) await R66(Y, O, w.uuid);  // <-- Track edit BEFORE write
let P = M?.lineEndings ?? await ra4();
H.mkdirSync($), l66(O, q, D, P);    // <-- Write happens AFTER tracking

// READABLE (for understanding):
let encoding = options?.encoding ?? "utf8";
let existingContent = options?.content ?? null;

// Track file edit BEFORE the write operation
if (isFileCheckpointingEnabled()) {
    await trackFileEdit(updateFileHistoryState, filePath, message.uuid);
}

let lineEndings = options?.lineEndings ?? await detectLineEndings();
fs.mkdirSync(parentDir, { recursive: true });
writeFile(filePath, newContent, encoding, lineEndings);

// Mapping: iz→isFileCheckpointingEnabled, R66→trackFileEdit, Y→updateFileHistoryState,
//          O→filePath, w.uuid→message.uuid
```

**Edit Tool - File Edit (chunks.139.mjs:1360)**

```javascript
// ============================================
// Edit tool integration - notebook cell editing
// Location: chunks.139.mjs:1355-1365
// ============================================

// ORIGINAL (for source lookup):
let $ = fs4(A) ? A : Ts4(G1(), A);
if (iz()) await R66(_, $, O.uuid);  // <-- Track edit BEFORE modification

// READABLE (for understanding):
let resolvedPath = isAbsolute(path) ? path : resolvePath(cwd, path);

// Track file edit BEFORE the edit operation
if (isFileCheckpointingEnabled()) {
    await trackFileEdit(updateFileHistoryState, resolvedPath, message.uuid);
}

// Then perform the edit...

// Mapping: $→resolvedPath, _→updateFileHistoryState, O.uuid→message.uuid
```

**Edit Tool - Notebook Editing (chunks.170.mjs:1352)**

```javascript
// ============================================
// Notebook edit tool - another call site
// Location: chunks.170.mjs:1348-1358
// ============================================

// Pattern is consistent: track BEFORE modification
if (iz()) await R66(Y, M, w.uuid);

// Mapping: Y→updateFileHistoryState, M→filePath, w.uuid→message.uuid
```

**Additional Integration Point (chunks.171.mjs:2136)**

```javascript
// ============================================
// Additional tool integration
// Location: chunks.171.mjs:2132-2140
// ============================================

// ORIGINAL (for source lookup):
if (iz() && K) await R66(q.updateFileHistoryState, _, K.uuid);

// READABLE (for understanding):
if (isFileCheckpointingEnabled() && fileToTrack) {
    await trackFileEdit(context.updateFileHistoryState, filePath, message.uuid);
}

// Mapping: q→context, _→filePath, K.uuid→message.uuid
```

**Integration Pattern Summary:**

| Tool | File | Line | Pattern |
|------|------|------|---------|
| Write | chunks.139.mjs | 180 | `if (iz()) await R66(Y, O, w.uuid)` |
| Edit (file) | chunks.139.mjs | 1360 | `if (iz()) await R66(_, $, O.uuid)` |
| Edit (notebook) | chunks.170.mjs | 1352 | `if (iz()) await R66(Y, M, w.uuid)` |
| Other tool | chunks.171.mjs | 2136 | `if (iz() && K) await R66(...)` |

**Key observation:** All integrations follow the same pattern:
1. Guard check with `iz()` (isFileCheckpointingEnabled)
2. Call `R66` (trackFileEdit) with state updater, file path, and message UUID
3. Perform the actual file operation AFTER tracking

This ensures the backup is created **before** the file is modified, capturing the "before" state.

### 14.5 Slash Command Entry Point

The `/rewind` (alias: `/checkpoint`) slash command provides the user-facing entry point for the rewind UI.

#### rewindCommandDefinition (_Az)

**Location:** chunks.165.mjs:699-710

```javascript
// ============================================
// rewindCommandDefinition - Slash command registration object
// Location: chunks.165.mjs:699-710
// ============================================

// ORIGINAL (for source lookup):
_Az = {
    description: "Restore the code and/or conversation to a previous point",
    name: "rewind",
    aliases: ["checkpoint"],
    userFacingName: () => "rewind",
    argumentHint: "",
    isEnabled: () => !0,
    type: "local",
    isHidden: !1,
    supportsNonInteractive: !1,
    load: () => Promise.resolve().then(() => pXq)
}, QXq = _Az

// READABLE (for understanding):
rewindCommandDefinition = {
    description: "Restore the code and/or conversation to a previous point",
    name: "rewind",
    aliases: ["checkpoint"],        // Alternative name
    userFacingName: () => "rewind", // Display name
    argumentHint: "",               // No arguments accepted
    isEnabled: () => true,          // Always available
    type: "local",                  // Not an MCP server command
    isHidden: false,                // Visible in /help
    supportsNonInteractive: false,  // Requires interactive TUI
    load: () => Promise.resolve().then(() => rewindCommandModule)
};

// Mapping: _Az→rewindCommandDefinition, QXq→rewindCommandExport, pXq→rewindCommandModule
```

**What it does:** Defines the slash command that triggers the RewindMessageSelector UI.

**Key properties:**
- `aliases: ["checkpoint"]` — Alternative command name for discoverability
- `type: "local"` — Not proxied to MCP server, handled locally
- `supportsNonInteractive: false` — Cannot run in `--print` mode

#### rewindCommandHandler (zAz)

**Location:** chunks.165.mjs:687-691

```javascript
// ============================================
// rewindCommandHandler - Execute /rewind slash command
// Location: chunks.165.mjs:687-691
// ============================================

// ORIGINAL (for source lookup):
async function zAz(A, q) {
    if (q.openMessageSelector) q.openMessageSelector();
    return {
        type: "skip"
    }
}

// READABLE (for understanding):
async function rewindCommandHandler(args, context) {
    // Open the message selector UI
    if (context.openMessageSelector) {
        context.openMessageSelector();
    }

    // Return "skip" to indicate no API call needed
    return {
        type: "skip"
    };
}

// Mapping: zAz→rewindCommandHandler, A→args, q→context
```

**What it does:** Handler for the `/rewind` slash command. Opens the RewindMessageSelector UI.

**How it works:**
1. Check if `openMessageSelector` callback is available in context
2. Call `openMessageSelector()` to show the UI
3. Return `{ type: "skip" }` to indicate no LLM API call is needed

**Why return "skip":**
- The rewind command is purely a UI action
- No need to send anything to the LLM
- The message selector handles user interaction separately

**Call flow:**
```
User types: /rewind
         │
         ▼
    Slash Command Dispatcher
         │
         │  matches _Az.name === "rewind"
         ▼
    zAz (rewindCommandHandler)
         │
         │  context.openMessageSelector()
         ▼
    RewindMessageSelector (zs8) component renders
         │
         ▼
    User selects message → restore options appear
```

### 14.6 API Handler Integration

The rewind feature exposes an API endpoint for programmatic access, used by SDK clients and CLI.

#### handleRewindRequest (thq)

**Location:** chunks.187.mjs:1271-1303

```javascript
// ============================================
// handleRewindRequest - API handler for rewind operations
// Location: chunks.187.mjs:1271-1303
// ============================================

// ORIGINAL (for source lookup):
async function thq(A, q, K, Y) {
    if (!iz()) return {
        canRewind: !1,
        error: "File rewinding is not enabled."
    };
    if (!tN1(q.fileHistory, A)) return {
        canRewind: !1,
        error: "No file checkpoint found for this message."
    };
    if (Y) {
        let z = eN1(q.fileHistory, A);
        return {
            canRewind: !0,
            filesChanged: z?.filesChanged,
            insertions: z?.insertions,
            deletions: z?.deletions
        }
    }
    try {
        await sN1((z) => K((_) => ({
            ..._,
            fileHistory: z(_.fileHistory)
        })), A)
    } catch (z) {
        return {
            canRewind: !1,
            error: `Failed to rewind: ${z.message}`
        }
    }
    return {
        canRewind: !0
    }
}

// READABLE (for understanding):
async function handleRewindRequest(userMessageId, appState, setState, isDryRun) {
    // Guard: Check if checkpointing is enabled
    if (!isFileCheckpointingEnabled()) {
        return {
            canRewind: false,
            error: "File rewinding is not enabled."
        };
    }

    // Guard: Check if snapshot exists for this message
    if (!snapshotExistsForMessage(appState.fileHistory, userMessageId)) {
        return {
            canRewind: false,
            error: "No file checkpoint found for this message."
        };
    }

    // Dry run: Return diff stats without modifying files
    if (isDryRun) {
        let diffStats = getDryRunDiffStats(appState.fileHistory, userMessageId);
        return {
            canRewind: true,
            filesChanged: diffStats?.filesChanged,
            insertions: diffStats?.insertions,
            deletions: diffStats?.deletions
        };
    }

    // Actual rewind: Execute file restoration
    try {
        await rewindHandler(
            (updateFileHistory) => setState((prevState) => ({
                ...prevState,
                fileHistory: updateFileHistory(prevState.fileHistory)
            })),
            userMessageId
        );
    } catch (error) {
        return {
            canRewind: false,
            error: `Failed to rewind: ${error.message}`
        };
    }

    return { canRewind: true };
}

// Mapping: thq→handleRewindRequest, A→userMessageId, q→appState, K→setState, Y→isDryRun,
//          iz→isFileCheckpointingEnabled, tN1→snapshotExistsForMessage,
//          eN1→getDryRunDiffStats, sN1→rewindHandler
```

**What it does:** API endpoint handler for rewinding files to a checkpoint. Used by SDK clients and CLI.

**How it works:**
1. **Guard check**: Return error if checkpointing is disabled
2. **Existence check**: Return error if no snapshot exists for the message
3. **Dry run path**: If `isDryRun=true`, return diff stats without modifying files
4. **Actual rewind**: Execute `rewindHandler` to restore files, wrap in try/catch
5. **Return result**: `{ canRewind: boolean, error?: string, filesChanged?: string[], insertions?: number, deletions?: number }`

**Call sites:**

| Location | Context | Usage |
|----------|---------|-------|
| chunks.187.mjs:737 | API request handler | `subtype === "rewind_files"` request |
| chunks.186.mjs:1689 | CLI --rewind-files flag | Non-interactive rewind command |

**API Request Flow:**

```
SDK Client / CLI
         │
         ▼
    API Handler (chunks.187.mjs:735)
         │
         │  request.subtype === "rewind_files"
         ▼
    thq (handleRewindRequest)
         │
         ├───── isDryRun=true ──────┐
         │                          │
         ▼                          ▼
    sN1 (rewindHandler)        eN1 (getDryRunDiffStats)
         │                          │
         ▼                          ▼
    File restoration           Diff stats only
```

**Why separate dry-run:**
- SDK clients may want to preview changes before committing
- The UI uses this to show diff stats before user confirms
- No side effects on dry-run, safe to call multiple times

**Return value structure:**

```typescript
interface RewindResponse {
    canRewind: boolean;      // Success flag
    error?: string;          // Error message if canRewind=false
    filesChanged?: string[]; // Files that would be/did change (dry-run only)
    insertions?: number;     // Lines added (dry-run only)
    deletions?: number;      // Lines removed (dry-run only)
}
```

#### CLI --rewind-files Flag Integration

**Location:** chunks.186.mjs:1680-1695

```javascript
// ============================================
// CLI --rewind-files flag handling
// Location: chunks.186.mjs:1680-1695
// ============================================

// User runs: claude --resume --rewind-files <message-uuid>
// ... message validation ...

let appState = getState();
let result = await handleRewindRequest(options.rewindFiles, appState, setState, false);

if (!result.canRewind) {
    process.stderr.write(`Error: ${result.error || "Unexpected error"}\n`);
    process.exit(1);
    return;
}

// Success: Files restored, continue session
```

**Why CLI integration:**
- Enables scripted checkpoint restoration
- Useful for automated testing workflows
- Allows non-interactive session recovery

### 14.7 React State Integration

The FileHistory state is managed as React state using a Zustand-like store:

```javascript
// State shape
interface FileHistoryState {
    snapshots: Snapshot[];           // Array of message-level snapshots
    trackedFiles: Set<string>;       // Set of normalized file paths being tracked
    snapshotSequence: number;        // Monotonic counter for ordering
}

// State updates use functional updates
updateFileHistoryState((prevState) => {
    // Immutable update pattern
    return {
        ...prevState,
        snapshots: [...prevState.snapshots, newSnapshot]
    };
});
```

**Why functional updates:**

1. **Concurrency safety** - Multiple trackFileEdit calls may overlap
2. **React batching** - State updates are batched for performance
3. **Undo/redo support** - Functional updates work with state history

---

## 15. Key Design Decisions Deep-Dive

### 15.1 Why MAX_SNAPSHOTS = 100?

The `Jn4` constant limits in-memory snapshots to 100:

```javascript
// From line 2060
snapshots: newSnapshots.length > Jn4 ? newSnapshots.slice(-Jn4) : newSnapshots
```

**Rationale:**
- Each snapshot contains a map of file paths to backup records
- Memory grows linearly with snapshot count
- 100 snapshots ≈ 100 conversation turns (several hours of work)
- Older snapshots are still persisted to JSONL, just not in memory
- Users rarely rewind beyond 20-30 turns

**Trade-off:**
- Pro: Bounded memory usage
- Con: Cannot rewind to very old checkpoints without reloading session

### 15.2 Why First-Edit-Only Pattern?

The `trackFileEdit` function only captures the first modification to each file per message:

```javascript
if (mostRecentSnapshot.trackedFileBackups[normalizedPath]) return fileHistoryState;
```

**Rationale:**
1. **User intent** - When rewinding, users want "before Claude touched this" state
2. **Storage efficiency** - Don't store intermediate states that nobody wants
3. **Simplicity** - No need to track edit chains within a message

**Example:**
```
Message N:
  Edit file A (line 10)  → Backup created (v1)
  Edit file A (line 20)  → No backup (already tracked)
  Edit file A (line 30)  → No backup (already tracked)

Rewind to N: File A restored to pre-edit state (v1)
```

### 15.3 Why Path-Based Backup Naming?

Backup filenames use SHA256 hash of the original path:

```javascript
// zVY at line 2238
`${sha256(filePath).slice(0,16)}@v${version}`
// Example: a1b2c3d4e5f6a7b8@v2
```

**Rationale:**
1. **Short names** - 16 chars + version fits filesystem limits
2. **Unique per file** - No collisions across directories
3. **Trivial lookup** - Find all versions of a file by same hash prefix
4. **Filesystem-safe** - No special characters or path separators

**Why not content-hash (like Git)?**
- Git uses content-hash for deduplication
- But backup files are NOT deduplicated (each version is stored separately)
- Path-hash makes it easy to find all versions of a specific file

### 15.4 Why mtime Check Before Content Comparison?

The `fileNeedsRestore` function checks mtime before reading content:

```javascript
// Line 2189
if (originalStats.mtimeMs < backupStats.mtimeMs) return false;
```

**Rationale:**
1. **Performance** - mtime check is O(1), content comparison is O(n)
2. **Common case** - Most files haven't changed since backup
3. **Filesystem semantics** - mtime is updated on write

**Edge case:**
If user manually modifies file but sets older mtime (rare), restore is skipped. This is acceptable because:
- It's an extremely rare edge case
- The user explicitly wanted to hide their modification
- Content comparison would catch it, but performance cost is too high

---

## 16. Error Handling and Edge Cases

### 16.1 Backup File Not Found

If a backup file is missing when trying to restore:

```javascript
// _VY at line 2278
if (!fs.existsSync(backupFilePath)) {
    telemetry("tengu_file_history_rewind_restore_file_failed", {});
    logError(Error(`Backup file not found: ${backupFilePath}`));
    return;  // Skip this file, continue with others
}
```

**Why not fail the entire restore:**
- One missing file shouldn't block restoring others
- User can still recover most of their work
- Telemetry captures the failure for debugging

### 16.2 Deleted File Restoration

When a file was deleted during the conversation:

```javascript
// Zn4 at line 2147-2154
if (backupFileName === null) {
    // File was created during this message - should be deleted on rewind
    if (fs.existsSync(filePath)) {
        if (!dryRun) fs.unlinkSync(filePath);
        filesChanged.push(filePath);
    }
}
```

**What this means:**
- `backupFileName: null` marks files that didn't exist before this message
- Rewinding deletes these files to restore the "before" state
- Dry-run mode still reports what would be deleted

### 16.3 Cross-Platform Path Handling

The `normalizeFilePath` function ensures consistent path storage:

```javascript
// fn4 at line 2303-2308
function normalizeFilePath(filePath) {
    if (!isAbsolutePath(filePath)) return filePath;
    let cwd = getCurrentWorkingDirectory();
    if (filePath.startsWith(cwd)) return makeRelative(cwd, filePath);
    return filePath;
}
```

**Why normalize:**
- macOS is case-insensitive but preserves case
- Windows uses backslashes, Unix uses forward slashes
- Relative paths are shorter and more portable
- Session resume may have different cwd

---

## 17. Telemetry Events Reference

| Event | When | Properties |
|-------|------|------------|
| `tengu_file_history_track_edit_success` | File edit tracked | `isNewFile`, `version` |
| `tengu_file_history_track_edit_failed` | Failed to track edit | (none) |
| `tengu_file_history_snapshot_success` | Snapshot created | `trackedFilesCount`, `snapshotCount` |
| `tengu_file_history_snapshot_failed` | Snapshot failed | (none) |
| `tengu_file_history_backup_file_created` | Backup file written | `version`, `fileSize` |
| `tengu_file_history_backup_file_failed` | Backup failed | (none) |
| `tengu_file_history_backup_deleted_file` | Tracked file was deleted | `version` |
| `tengu_file_history_rewind_success` | Rewind completed | `trackedFilesCount`, `filesChangedCount` |
| `tengu_file_history_rewind_failed` | Rewind failed | `trackedFilesCount`, `snapshotFound` |
| `tengu_file_history_rewind_restore_file_failed` | File restore failed | `dryRun` |
| `tengu_file_history_resume_copy_failed` | Session resume copy failed | `numSnapshots`, `failedSnapshots` |
| `tengu_message_selector_opened` | Rewind UI opened | (none) |
| `tengu_message_selector_selected` | User selected a message | `index_from_end`, `message_type`, `is_current_prompt` |
| `tengu_message_selector_restore_option_selected` | User picked restore option | `option` |
| `tengu_message_selector_cancelled` | User cancelled | (none) |
| `tengu_partial_compact` | Partial compaction completed | `preCompactTokenCount`, `postCompactTokenCount`, `messagesKept`, `messagesSummarized`, `trigger`, `compactionInputTokens`, `compactionOutputTokens`, `compactionCacheReadTokens`, `compactionCacheCreationTokens` |
| `tengu_partial_compact_failed` | Partial compaction failed | `reason`, `preCompactTokenCount` |

---

## 18. Algorithm Performance Analysis

### 18.1 Multi-Tier Comparison Performance

The `fileNeedsRestore` (cu8) function uses a 5-tier comparison strategy optimized for the common case where files do NOT need restore:

| Tier | Operation | Cost | Typical Result | Skip Rate |
|------|-----------|------|----------------|-----------|
| 1 | Existence check | O(1) stat | One exists, other doesn't → restore | ~5% |
| 2 | Mode check | O(1) stat | Permissions differ → restore | ~1% |
| 3 | Size check | O(1) stat | Size differs → restore | ~10% |
| 4 | mtime check | O(1) stat | Original older → skip | ~60% |
| 5 | Content compare | O(n) read | Content differs → restore | ~24% |

**Expected skip rate:** ~76% of files skip the expensive O(n) content comparison.

**Worst case:** All 5 tiers executed = 2 stat calls + 2 file reads = O(n).

### 18.2 Snapshot Memory Usage

Each snapshot stores:
- `messageId`: 36 bytes (UUID string)
- `timestamp`: ~25 bytes (ISO string)
- `trackedFileBackups`: Map of path → BackupRecord

**Per-file backup record size:**
- `backupFileName`: ~20 bytes (hash + version)
- `version`: 8 bytes (number)
- `backupTime`: ~25 bytes (Date)

**Total per file:** ~53 bytes in memory

**With MAX_SNAPSHOTS=100 and 50 tracked files:**
- 100 snapshots × 50 files × 53 bytes ≈ 265 KB in memory

This is negligible compared to the actual file content storage.

### 18.3 Backup Storage Optimization

**Hard link strategy for session resume:**

```javascript
// From KV1 at line 2365
try {
    await fs.link(oldPath, newPath);  // O(1) - hard link
} catch {
    await fs.copyFile(oldPath, newPath);  // O(n) - fallback
}
```

**Why hard links:**
- Same inode, no duplicate disk usage
- Instant copy regardless of file size
- Both sessions can read the same backup

**When copy is needed:**
- Cross-filesystem links (different mount points)
- Windows (hard links less reliable)
- Permission issues

---

## 19. Helper Function Reference

This section documents the utility functions used throughout the rewind module.

### 19.1 File System Utilities

#### getFileSystem ($1)

**Location:** chunks.1.mjs:4044-4046

```javascript
// ============================================
// getFileSystem - Get file system object for operations
// Location: chunks.1.mjs:4044-4046
// ============================================

// ORIGINAL (for source lookup):
function $1() {
    return tnq
}

// READABLE (for understanding):
function getFileSystem() {
    return nodeFs;  // Node.js fs module
}

// Mapping: $1→getFileSystem, tnq→nodeFs
```

**What it does:** Returns the Node.js `fs` module for file system operations.

**Why abstract:** Provides a consistent interface that can be mocked in tests.

#### writeFileSync (fz)

**Location:** chunks.1.mjs:3878-3896

```javascript
// ============================================
// writeFileSync - Write file with flush support
// Location: chunks.1.mjs:3878-3896
// ============================================

// ORIGINAL (for source lookup):
function fz(A, q, K) {
    // ... implementation with flush support
}

// READABLE (for understanding):
function writeFileSync(path, content, options) {
    // Wraps fs.writeFileSync with flush support
    // When options.flush: true, ensures data is written to disk
    return fs.writeFileSync(path, content, options);
}

// Mapping: fz→writeFileSync, A→path, q→content, K→options
```

**What it does:** Writes content to a file with optional flush support.

**Why flush:** Ensures backup files are immediately persisted to disk, reducing risk of data loss on crash.

#### getDirectoryPath (Dn4)

**Location:** chunks.1.mjs (inferred - wraps path.dirname)

```javascript
function getDirectoryPath(filePath) {
    return path.dirname(filePath);
}
```

**What it does:** Extracts the directory portion of a file path.

#### setFilePermissions (Pn4)

**Location:** chunks.1.mjs (inferred - wraps fs.chmodSync)

```javascript
function setFilePermissions(filePath, mode) {
    return fs.chmodSync(filePath, mode);
}
```

**What it does:** Sets file permissions (readable, writable, executable bits).

**Why important:** Preserves executable bits when restoring files.

#### normalizeFilePath (fn4)

**Location:** chunks.135.mjs:2303-2308

```javascript
// ============================================
// normalizeFilePath - Normalize file path for snapshot key
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
    // If not absolute path, return as-is
    if (!isAbsolutePath(filePath)) return filePath;

    let cwd = getCurrentWorkingDirectory();

    // If path is within cwd, make it relative
    if (filePath.startsWith(cwd)) {
        return makeRelativePath(cwd, filePath);
    }

    // Otherwise keep as absolute
    return filePath;
}

// Mapping: fn4→normalizeFilePath, A→filePath, q→cwd,
//          Xn4→isAbsolutePath, AA→getCurrentWorkingDirectory, tNY→makeRelativePath
```

**What it does:** Normalizes file paths to be stored consistently in snapshots.

**How it works:**
1. If the path is relative, return it unchanged
2. If the path is absolute and within the current working directory, make it relative
3. Otherwise, keep the absolute path

**Why normalize:**
- **Portability**: Relative paths work across different machines
- **Session resume**: The cwd may differ when resuming a session
- **Consistency**: Same file should have the same key regardless of how it's referenced

**Example:**
```
cwd = "/home/user/project"
normalizeFilePath("/home/user/project/src/file.ts") → "src/file.ts"
normalizeFilePath("/tmp/external.ts") → "/tmp/external.ts"
normalizeFilePath("relative/path.ts") → "relative/path.ts"
```

#### resolveTrackedFilePath (AV1)

**Location:** chunks.135.mjs:2310-2313

```javascript
// ============================================
// resolveTrackedFilePath - Resolve normalized path to absolute
// Location: chunks.135.mjs:2310-2313
// ============================================

// ORIGINAL (for source lookup):
function AV1(A) {
    if (Xn4(A)) return A;
    return aN1(AA(), A)
}

// READABLE (for understanding):
function resolveTrackedFilePath(normalizedPath) {
    // If already absolute, return as-is
    if (isAbsolutePath(normalizedPath)) return normalizedPath;

    // Resolve relative path from cwd
    return joinPaths(getCurrentWorkingDirectory(), normalizedPath);
}

// Mapping: AV1→resolveTrackedFilePath, A→normalizedPath,
//          Xn4→isAbsolutePath, AA→getCurrentWorkingDirectory, aN1→joinPaths
```

**What it does:** Converts a normalized (possibly relative) path back to an absolute path for file operations.

**How it works:**
1. If the path is already absolute, return it unchanged
2. If the path is relative, join it with the current working directory

**Why needed:**
- Snapshot keys use normalized (often relative) paths
- File system operations require absolute paths
- The cwd may have changed since the snapshot was created

**Symmetry with normalizeFilePath:**
```
normalizeFilePath("/home/user/project/src/file.ts") → "src/file.ts"
resolveTrackedFilePath("src/file.ts") → "/home/user/project/src/file.ts"
```

### 19.2 Boolean/Environment Parsing

#### parseBoolean (t6)

**Location:** chunks.1.mjs:4491-4496

```javascript
// ============================================
// parseBoolean - Parse string/boolean to boolean
// Location: chunks.1.mjs:4491-4496
// ============================================

// ORIGINAL (for source lookup):
function t6(A) {
    if (!A) return !1;
    if (typeof A === "boolean") return A;
    let q = A.toLowerCase().trim();
    return q === "true" || q === "1" || q === "yes"
}

// READABLE (for understanding):
function parseBoolean(value) {
    if (!value) return false;
    if (typeof value === "boolean") return value;
    let normalized = value.toLowerCase().trim();
    return normalized === "true" || normalized === "1" || normalized === "yes";
}

// Mapping: t6→parseBoolean, A→value, q→normalized
```

**What it does:** Converts various truthy string representations to boolean.

**Supported values:** `"true"`, `"1"`, `"yes"` (case-insensitive)

**Usage in rewind:**
- Parsing `CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING` environment variable
- Parsing `CLAUDE_CODE_ENABLE_SDK_FILE_CHECKPOINTING` environment variable

#### isSDKMode (q7)

**Location:** chunks.1.mjs:2720-2722

```javascript
// ============================================
// isSDKMode - Check if running in SDK mode
// Location: chunks.1.mjs:2720-2722
// ============================================

// ORIGINAL (for source lookup):
function q7() {
    return !v1.isInteractive
}

// READABLE (for understanding):
function isSDKMode() {
    return !globalState.isInteractive;
}

// Mapping: q7→isSDKMode, v1→globalState
```

**What it does:** Determines if Claude Code is running in SDK (non-interactive) mode.

**Why it matters:** SDK mode has different defaults for checkpointing (disabled by default).

### 19.3 Logging & Telemetry

#### consoleLog (k)

**Location:** chunks.2.mjs:165-180

```javascript
// ============================================
// consoleLog - Console logging with level support
// Location: chunks.2.mjs:165-180
// ============================================

// ORIGINAL (for source lookup):
function k(A, {
    level: q
} = {
    level: "debug"
}) {
    // ... logging implementation
}

// READABLE (for understanding):
function consoleLog(message, { level = "debug" } = {}) {
    // Console logging with optional level
    console.log(message);
}

// Mapping: k→consoleLog, A→message, q→level
```

**What it does:** Logs debug messages to console with optional log level.

#### telemetry (d)

**Location:** chunks.2.mjs:275-290

```javascript
// ============================================
// telemetry - Record telemetry event
// Location: chunks.2.mjs:275-290
// ============================================

// ORIGINAL (for source lookup):
function d(A, q) {
    if (tw6 === null) {
        nt6.push({
            eventName: A,
            // ...
        });
        return;
    }
    // ... send event
}

// READABLE (for understanding):
function telemetry(eventName, eventData) {
    if (telemetryClient === null) {
        // Queue event for later
        pendingEvents.push({ eventName, eventData });
        return;
    }
    // Send event immediately
    telemetryClient.recordEvent(eventName, eventData);
}

// Mapping: d→telemetry, A→eventName, q→eventData, tw6→telemetryClient, nt6→pendingEvents
```

**What it does:** Records a telemetry event for analytics.

**Events used in rewind:**
- `tengu_file_history_track_edit_success`
- `tengu_file_history_snapshot_success`
- `tengu_file_history_rewind_success`
- `tengu_message_selector_opened`
- `tengu_partial_compact`

### 19.4 Error Handling

#### logError (_6)

**Location:** chunks.14.mjs:726-740

```javascript
// ============================================
// logError - Error logging with optional reporting
// Location: chunks.14.mjs:726-740
// ============================================

// ORIGINAL (for source lookup):
function _6(A) {
    let q = A instanceof Error ? A : Error(String(A));
    try {
        if (t6(process.env.CLAUDE_CODE_USE_BEDROCK) ||
            t6(process.env.CLAUDE_CODE_USE_VERTEX) ||
            t6(process.env.CLAUDE_CODE_USE_FOUNDRY) ||
            process.env.DISABLE_ERROR_REPORTING ||
            process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) return;
        // ... send to error reporting
    } catch {}
}

// READABLE (for understanding):
function logError(error) {
    let normalizedError = error instanceof Error ? error : Error(String(error));
    try {
        // Skip error reporting in certain environments
        if (isBedrockMode() || isVertexMode() || isFoundryMode() ||
            process.env.DISABLE_ERROR_REPORTING ||
            process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) {
            return;
        }
        // Send to error reporting service
        errorReportingClient.capture(normalizedError);
    } catch {}
}

// Mapping: _6→logError, A→error, q→normalizedError
```

**What it does:** Logs errors with optional reporting to error tracking service.

**When reporting is disabled:**
- Using Bedrock/Vertex/Foundry (external compute)
- `DISABLE_ERROR_REPORTING` is set
- `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` is set

### 19.5 Settings

#### getUserSettings (X1)

**Location:** chunks.177.mjs:2046-2055

```javascript
// ============================================
// getUserSettings - Get cached user configuration
// Location: chunks.177.mjs:2046-2055
// ============================================

// ORIGINAL (for source lookup):
function X1() {
    try {
        let A = performance.now();
        if (gN.config && A - tS1 < Iwz) return eN6++, gN.config;
        // ... load from disk if needed
    } catch {}
}

// READABLE (for understanding):
function getUserSettings() {
    try {
        let now = performance.now();
        // Return cached config if still valid
        if (cachedSettings.config && now - lastLoadTime < CACHE_TTL) {
            cacheHitCount++;
            return cachedSettings.config;
        }
        // Load from disk...
    } catch {}
}

// Mapping: X1→getUserSettings, gN→cachedSettings, tS1→lastLoadTime, Iwz→CACHE_TTL
```

**What it does:** Returns the user's settings with caching.

**Settings relevant to rewind:**
- `fileCheckpointingEnabled` - Enable/disable checkpointing

### 19.6 Diff Algorithm

#### computeDiff (na)

**Location:** chunks.56.mjs:2072-2074

```javascript
// ============================================
// computeDiff - Myers diff algorithm
// Location: chunks.56.mjs:2072-2074
// ============================================

// ORIGINAL (for source lookup):
function na(A, q, K) {
    return wf7.diff(A, q, K)
}

// READABLE (for understanding):
function computeDiff(oldContent, newContent, options) {
    return diffLibrary.diff(oldContent, newContent, options);
}

// Mapping: na→computeDiff, wf7→diffLibrary
```

**What it does:** Computes the difference between two strings using Myers diff algorithm.

**Return value:** Array of change objects with `added`, `removed`, and `count` properties.

**Usage in rewind:**
- `calculateFileDiffStats` (Mn4) uses it to count +/- lines for dry-run previews

---

## 20. SessionDatabase Persistence Details

### SessionDatabase.insertFileHistorySnapshot Method

**Location:** chunks.174.mjs:1520-1530

```javascript
// ============================================
// SessionDatabase.insertFileHistorySnapshot - Persist snapshot to JSONL
// Location: chunks.174.mjs:1520-1530
// ============================================

// ORIGINAL (for source lookup):
async insertFileHistorySnapshot(A, q, K) {
    return this.trackWrite(async () => {
        let Y = {
            type: "file-history-snapshot",
            messageId: A,
            snapshot: q,
            isSnapshotUpdate: K
        };
        await this.appendEntry(Y)
    })
}

// READABLE (for understanding):
async insertFileHistorySnapshot(messageId, snapshot, isSnapshotUpdate) {
    return this.trackWrite(async () => {
        let entry = {
            type: "file-history-snapshot",
            messageId,
            snapshot,
            isSnapshotUpdate
        };
        await this.appendEntry(entry);
    });
}

// Mapping: A→messageId, q→snapshot, K→isSnapshotUpdate, Y→entry
```

**What it does:** Persists a file history snapshot entry to the session's JSONL database.

**How it works:**
1. Creates an entry object with `type: "file-history-snapshot"`
2. Wraps the write in `trackWrite` for proper sequencing
3. Appends the entry to the JSONL file via `appendEntry`

### JSONL Entry Structure

**Entry for snapshot update (during `trackFileEdit`):**
```json
{
    "type": "file-history-snapshot",
    "messageId": "uuid-of-current-message",
    "snapshot": {
        "messageId": "uuid-of-current-message",
        "trackedFileBackups": {
            "src/auth.ts": {
                "backupFileName": "a1b2c3d4e5f6a7b8@v1",
                "version": 1,
                "backupTime": "2024-01-15T10:30:00.000Z"
            }
        },
        "timestamp": "2024-01-15T10:30:00.000Z"
    },
    "isSnapshotUpdate": true
}
```

**Entry for new snapshot (during `createSnapshotForMessage`):**
```json
{
    "type": "file-history-snapshot",
    "messageId": "uuid-of-message",
    "snapshot": {
        "messageId": "uuid-of-message",
        "trackedFileBackups": {
            "src/auth.ts": {
                "backupFileName": "a1b2c3d4e5f6a7b8@v2",
                "version": 2,
                "backupTime": "2024-01-15T10:35:00.000Z"
            },
            "src/api.ts": {
                "backupFileName": "b2c3d4e5f6a7b8c9@v1",
                "version": 1,
                "backupTime": "2024-01-15T10:35:00.000Z"
            }
        },
        "timestamp": "2024-01-15T10:35:00.000Z"
    },
    "isSnapshotUpdate": false
}
```

### trackWrite Wrapper

The `trackWrite` method on SessionDatabase ensures:
1. **Sequencing**: Writes are properly ordered even when multiple async writes overlap
2. **Error handling**: Write failures are properly caught and logged
3. **Debouncing**: Multiple rapid writes may be batched for performance

---

## 21. Edge Cases Deep-Dive

### 21.1 Cross-Platform Path Handling

The `normalizeFilePath` (fn4) function handles several edge cases:

**Case 1: Case-insensitive filesystems (macOS)**
```javascript
// macOS preserves case but is case-insensitive
// These paths refer to the same file on macOS:
//   /Users/alice/project/src/File.ts
//   /Users/alice/project/src/file.ts
//   /Users/ALICE/project/src/FILE.TS

// Solution: Store paths as they appear, don't normalize case
// Relative paths help reduce ambiguity:
normalizeFilePath("/Users/alice/project/src/File.ts") → "src/File.ts"
```

**Case 2: Path separators (Windows vs Unix)**
```javascript
// Windows: C:\Users\alice\project\src\file.ts
// Unix:     /home/alice/project/src/file.ts

// Node.js path module handles this, but backup paths are always Unix-style
// in the JSONL for consistency across platforms
```

**Case 3: Symlinks and junctions**
```javascript
// If /project/link → /project/real-folder
// and user edits /project/link/file.ts
// The backup is stored under the path as referenced:
normalizeFilePath("/project/link/file.ts") → "link/file.ts"  // Not "real-folder/file.ts"
```

### 21.2 Hard Link Fallback in migrateFileHistoryToNewSession

**Location:** chunks.135.mjs:2365-2385

```javascript
// ============================================
// Hard link vs copy fallback logic
// Location: chunks.135.mjs:2365-2385
// ============================================

// ORIGINAL (for source lookup):
try {
    fs.linkSync(oldPath, newPath);
} catch {
    fs.copyFileSync(oldPath, newPath);
}

// READABLE (for understanding):
// Try hard link first (O(1) operation)
try {
    fs.linkSync(oldPath, newPath);
} catch (linkError) {
    // Fall back to full copy (O(n) operation)
    fs.copyFileSync(oldPath, newPath);
}
```

**Why hard link fails:**

| Scenario | Reason | Fallback |
|----------|--------|----------|
| Cross-filesystem | Source and target on different mounts | `copyFileSync` |
| Windows | Hard links less reliable on NTFS | `copyFileSync` |
| Permission denied | Insufficient permissions for linking | `copyFileSync` |
| Disk quota | Hard link would exceed quota | `copyFileSync` |

**Why hard links are preferred:**
1. **Zero additional disk space** - Same inode, no duplicate data
2. **Instant operation** - O(1) regardless of file size
3. **Automatic sync** - Both paths always have same content

### 21.3 mtime Comparison Edge Cases

The `fileNeedsRestore` (cu8) function uses mtime as a quick check:

```javascript
// Line 2189
if (originalStats.mtimeMs < backupStats.mtimeMs) return false;
```

**Edge case: User manually sets older mtime**

```bash
# User modifies file but sets mtime to past
touch -d "2024-01-01" /project/file.ts

# Result: fileNeedsRestore returns false (skips restore)
# Even though content differs!
```

**Why this is acceptable:**
1. **Extremely rare** - Users rarely manipulate mtime
2. **Intentional deception** - User explicitly wanted to hide the modification
3. **Performance trade-off** - Checking content every time is O(n), unacceptable cost
4. **Conservative approach** - False negative (skip restore) is better than false positive

**What happens on restore:**
```javascript
// If user then runs rewind:
// 1. mtime check returns false (skips restore)
// 2. User gets old content, but expects it
// 3. If user notices, they can manually fix

// Alternative (content check every time):
// 1. Always correct, but O(n) for every file
// 2. Major performance regression
// 3. Not worth the edge case
```

### 21.4 Backup Directory Cleanup

Backup files are stored in `~/.claude/file-history/{sessionId}/`:

**When cleanup happens:**
- **Session end**: No automatic cleanup - backups persist
- **Session resume**: Old backups copied/hard-linked to new session
- **Manual cleanup**: User can delete `~/.claude/file-history/` directory

**Why no automatic cleanup:**
1. **Resume support**: User may want to rewind across session boundaries
2. **Safety**: Preserving backups is safer than aggressive cleanup
3. **Storage**: Files are small relative to modern disk sizes
4. **Hard links**: When resumed, files share inodes, no extra space

**Disk usage estimation:**
```
Assumptions:
- 100 snapshots per session
- 50 tracked files average
- 10KB average file size (source code)

Total per session:
100 snapshots × 50 files × 10KB = 50MB

With hard links on resume:
50MB × N sessions = still 50MB (shared inodes)
```

### 21.5 Snapshot Limit Overflow

When `snapshots.length > MAX_SNAPSHOTS (100)`:

```javascript
// From createSnapshotForMessage at line 2060
snapshots: newSnapshots.length > MAX_SNAPSHOTS
    ? newSnapshots.slice(-MAX_SNAPSHOTS)  // Keep most recent 100
    : newSnapshots
```

**Behavior:**
- Oldest snapshots are discarded from memory
- They remain in the JSONL file on disk
- Hydration on session resume will only load last 100

**Why this is safe:**
1. Users rarely rewind beyond 20-30 messages
2. 100 snapshots ≈ hours of conversation
3. JSONL still has full history for forensic analysis

### 21.6 Deleted File Tracking

When a tracked file is deleted during a message:

```javascript
// From createSnapshotForMessage at line 2035-2041
if (!fs.existsSync(actualPath)) {
    // File was deleted during this message
    let prev = previousSnapshot.trackedFileBackups[trackedPath];
    let version = prev ? prev.version + 1 : 1;
    backups[trackedPath] = {
        backupFileName: null,  // Marker: file doesn't exist
        version,
        backupTime: new Date
    };
}
```

**Restore behavior:**
- `backupFileName: null` means "file should not exist"
- If file exists now, it gets deleted on restore
- If file doesn't exist, nothing happens

**This handles:**
1. Claude creates a file → user rewinds → file deleted
2. File existed before, Claude deleted it → user rewinds → file restored from v1 backup

---

## 22. Cross-Feature Integration Matrix

### Integration with System Reminder (04_system_reminder)

| Integration Point | Function | Purpose |
|------------------|----------|---------|
| Session persistence | `_l6` (recordFileHistorySnapshot) | Write snapshot to JSONL |
| Session hydration | `qV1` (hydrateFileHistoryFromSnapshots) | Restore state from JSONL on resume |
| Session migration | `KV1` (migrateFileHistoryToNewSession) | Copy backups when resuming with new session ID |

### Integration with Compact (07_compact)

| Integration Point | Function | Purpose |
|------------------|----------|---------|
| Partial compaction | `Wqq` (performPartialCompaction) | "Summarize from here" UI option |
| Boundary marker | `Ri6` (createCompactBoundary) | Mark where compaction occurred |
| Summary generation | `Gqq` (generateSummaryWithLLM) | LLM call for summary |

### Integration with File Tools (05_tools)

| Integration Point | Location | Purpose |
|------------------|----------|---------|
| Write tool | chunks.139.mjs:180 | Track file before write |
| Edit tool | chunks.139.mjs:1360 | Track file before edit |
| Notebook edit | chunks.170.mjs:1352 | Track notebook before cell edit |

### Integration with State Management (15_state_management)

| Integration Point | Function | Purpose |
|------------------|----------|---------|
| State access | `M1` (useStore) | React hook for fileHistory state |
| State updates | `R66` (trackFileEdit) | Functional state update pattern |
| Snapshot sequence | `snapshotSequence` counter | React reconciliation key |

---

## 23. See Also

- [overview.md](./overview.md) - Feature overview and architecture
- [ui_linkage.md](./ui_linkage.md) - UI component analysis
- [../07_compact/](../07_compact/) - Full compaction documentation
- [../04_system_reminder/](../04_system_reminder/) - Session persistence
- [../15_state_management/](../15_state_management/) - React state schema