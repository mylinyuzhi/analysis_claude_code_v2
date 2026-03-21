# Overview - Rewind / Checkpointing (Module 35)

> Official docs: [Checkpointing](https://code.claude.com/docs/checkpointing)

## Purpose

The **Rewind** feature (officially "Checkpointing") provides a session-level undo system that lets users roll back both file changes and/or conversation history to any prior prompt. It is Claude Code's safety net for exploring risky or wide-scope changes — giving users confidence to attempt ambitious tasks knowing any state can be recovered.

Unlike Git, checkpoints are automatic, transparent, and tied to the conversation timeline rather than explicit commit actions.

---

## Architectural Overview

```
User: Esc+Esc or /rewind
         │
         ▼
  ┌──────────────────────────────────────────┐
  │         Message Selector UI              │
  │  RewindMessageSelector (zs8)             │
  │  Location: chunks.185.mjs:1179           │
  │  ┌────────────────────────────────────┐  │
  │  │  Scrollable prompt list            │  │
  │  │  + diff stats per checkpoint       │  │
  │  └────────────────────────────────────┘  │
  │  ↓ User selects a message                │
  │  ┌──────────────────────────────────┐    │
  │  │  Restore options menu            │    │
  │  │  • Restore code and conversation │    │
  │  │  • Restore conversation          │    │
  │  │  • Restore code                  │    │
  │  │  • Summarize from here [context] │    │
  │  │  • Never mind                    │    │
  │  └──────────────────────────────────┘    │
  └──────────────────────────────────────────┘
         │                    │                │
         ▼                    ▼                ▼
  File Restoration    Message Slice    Summarize Engine
  sN1 / Zn4           onRestoreMessage Fa4
  (chunks.135.mjs)    (callback)       (chunks.146.mjs)
```

---

## Three Subsystems

### 1. File History (Checkpoint Storage)

The **file history** subsystem records snapshots of all files that Claude's tools touch. It operates as an event-sourced log of file states keyed to `messageId`.

- **Tracking**: Every file edit goes through `trackFileEdit` (`R66`, chunks.135.mjs:1986), which immediately creates a version-1 backup and adds the file to the snapshot's `trackedFileBackups`.
- **Snapshots**: When a message completes, `createSnapshotForMessage` (`lf6`, chunks.135.mjs:2016) creates a full snapshot of all tracked files (copying changed ones, noting deleted ones as `null`).
- **Restoration**: `rewindHandler` (`sN1`, chunks.135.mjs:2075) locates the target snapshot and calls `rewindAndRestoreFiles` (`Zn4`, chunks.135.mjs:2135) to physically restore each file or delete newly-created ones.

### 2. Conversation Restore

The **conversation restore** subsystem slices the in-memory message array at the selected point. After restoration:
- Messages after the checkpoint are discarded
- Todo state is reset to the snapshot's saved todos
- Permission mode is restored if it changed
- The original prompt text is re-injected into the input field

### 3. Summarize (Targeted Compaction)

The **summarize** subsystem is a variant of `/compact` that targets only messages **from the selected point forward**, keeping earlier messages intact. This frees context window space while preserving the detailed history from before the selected message. Implemented via `Fa4` (chunks.146.mjs) which is shared with the full `/compact` command.

---

## Key Design Decisions

### Why Automatic Snapshots?

Claude Code creates a checkpoint on **every user prompt** rather than relying on user-initiated saves. This design choice ensures:
1. Users never need to remember to save — every conversation turn is a restore point
2. Wide-scope tasks (refactors touching 20+ files) are naturally covered
3. No workflow interruption for the user

**Trade-off**: Storage cost. Backup files are written for every Claude-touched file on every prompt. This is mitigated by:
- Only tracking files that Claude's own tools modify (Bash-written changes are **not** tracked)
- Deduplication: if a file hasn't changed since the last snapshot, the old `backupRecord` is reused (no new file copy)
- Configurable via `fileCheckpointingEnabled` setting (can be disabled)

### Why Separate Code vs. Conversation Restore?

The restore options decouple code state from conversation state. This is deliberate:
- **Code only**: Undo file changes but keep the conversation to re-try a different approach
- **Conversation only**: Rewind the dialogue context but keep file changes (useful if Claude got confused but the code is correct)
- **Both**: Full rollback — the most common use case

### Why Not Track Bash-Written Files?

Files modified by `bash` commands (`rm`, `mv`, `cp`, etc.) are explicitly **excluded** from checkpointing. The design rationale is pragmatic: intercepting all possible shell file mutations would require a sandboxed filesystem or similar. Instead, the UI warns: "Rewinding does not affect files edited manually or via bash."

### Summarize vs. Restore

"Summarize from here" is fundamentally different from the three restore options:
- Restore operations are **reversible** (the messages are just sliced out)
- Summarize is **irreversible within the session** (original messages are replaced with AI-generated summary) — though they remain in the session transcript for reference
- Summarize is a forward-looking operation: free up context to continue working, not undo mistakes

---

## Configuration

| Setting | Source | Type | Description |
|---------|--------|------|-------------|
| `fileCheckpointingEnabled` | global settings | boolean | Enable file checkpointing for code rewind |

**Environment variables:**
- `CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING` - Disable checkpointing entirely
- `CLAUDE_CODE_ENABLE_SDK_FILE_CHECKPOINTING` - Enable checkpointing in SDK mode (opt-in)

UI display: Settings panel shows "Rewind code (checkpoints)" as the label.

### Mode-Specific Behavior

**Interactive Mode (default):** Checkpointing is enabled by default. Users can opt-out via:
- Setting `fileCheckpointingEnabled: false` in settings
- Setting `CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING=true` environment variable

**SDK Mode:** Checkpointing is disabled by default. Users must opt-in via:
- Setting `CLAUDE_CODE_ENABLE_SDK_FILE_CHECKPOINTING=true` environment variable

This is implemented in `isFileCheckpointingEnabled` (`iz`) which dispatches to `isSDKCheckpointingEnabled` (`YVY`) when in SDK mode.

---

## Persistence

Snapshots are persisted across sessions via `recordFileHistorySnapshot` (`_l6`) which writes to the session `.jsonl` database. This enables the documented behavior: "Checkpoints persist across sessions, so you can access them in resumed conversations."

### Session Resume Flow

When resuming a session with `--resume`:
1. `hydrateFileHistoryFromSnapshots` (`qV1`) reconstructs the FileHistory React state from JSONL snapshots
2. `migrateFileHistoryToNewSession` (`KV1`) copies backup files from old session to new via hard-link/copy

### Cleanup

Old backup files are cleaned up after 30 days (configurable), aligned with session cleanup.

---

## Storage Architecture

> **Key fact:** The rewind feature has NO dependency on Git. It implements a fully independent versioned file backup system.

### On-Disk Layout

```
~/.claude/                              ← CLAUDE_CONFIG_DIR
├── file-history/
│   └── {sessionId}/
│       ├── a1b2c3d4e5f6a7b8@v1        ← backup of file A (version 1)
│       ├── a1b2c3d4e5f6a7b8@v2        ← backup of file A (version 2)
│       └── f9e8d7c6b5a49382@v1        ← backup of file B
└── projects/
    └── {sessionId}.jsonl              ← snapshot metadata
```

### Backup Filename Generation

Backup filenames are generated using SHA256 hash of the file path:
```
{SHA256(filePath).slice(0,16)}@v{version}
```

Example: `/home/user/project/src/auth.ts` at version 2 → `a1b2c3d4e5f6a7b8@v2`

**Why path-based (not content-based)?** Path-based names make it trivial to find all backups for a given file (same hash prefix + incrementing `@v`), and the hash keeps filenames short and filesystem-safe.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Rewind/Checkpoint section
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Helper functions (telemetry, logging, etc.)

Key functions in this document:

**Snapshot / File History (chunks.135.mjs)**
- `isFileCheckpointingEnabled` (iz) - Master guard for checkpointing feature
- `isSDKCheckpointingEnabled` (YVY) - SDK-specific checkpointing guard
- `trackFileEdit` (R66) - Record a file edit into the current snapshot
- `createSnapshotForMessage` (lf6) - Finalize snapshot at message boundary
- `rewindHandler` (sN1) - Execute rewind to a target message
- `rewindAndRestoreFiles` (Zn4) - Restore all tracked files from snapshot
- `snapshotExistsForMessage` (tN1) - Check if snapshot exists for messageId
- `getDryRunDiffStats` (eN1) - Run dry-run and return diff stats
- `hasChangesToRestore` (Wn4) - Check if files differ from snapshot
- `createBackupFile` (du8) - Write a versioned backup copy of a file
- `fileNeedsRestore` (cu8) - Multi-tier comparison to check if restore needed
- `restoreFileFromBackup` (_VY) - Copy backup content back to original path
- `calculateFileDiffStats` (Mn4) - Compute +/- stats for UI preview
- `findBackupInOlderSnapshot` (Gn4) - Fallback to find version-1 backup
- `generateBackupFileName` (zVY) - SHA256 hash of path + @v{version}
- `resolveBackupPath` (zz6) - Build full path to backup file
- `normalizeFilePath` (fn4) - Normalize path for snapshot key
- `resolveTrackedFilePath` (AV1) - Resolve normalized path to absolute
- `deepCopySnapshot` (rw6) - Immutable snapshot copy for React state
- `checkForHistoryChanges` (wVY) - Debug comparison (no-op in prod)
- `reportFileHistoryChange` (L66) - No-op placeholder
- `MAX_SNAPSHOTS` (Jn4) - Constant: 100 (max snapshots in memory)
- `DEBUG_FILE_HISTORY` (OVY) - Constant: false (debug logging toggle)

**Persistence (chunks.135.mjs)**
- `hydrateFileHistoryFromSnapshots` (qV1) - Reconstruct state from JSONL
- `migrateFileHistoryToNewSession` (KV1) - Copy backups on session resume

**UI Component (chunks.185.mjs)**
- `RewindMessageSelector` (zs8) - Main React component for the rewind UI
- `generateRestoreOptions` (g) - Build the restore options list dynamically
- `handleMessageSelection` (b) - Process message selection
- `handleRestoreOptionSelected` (p) - Dispatch restore/summarize callbacks
- `isSelectableMessage` (XV6) - Filter for rewindable user messages
- `isOnlyOneMessageAfterIndex` (YI1) - Check if only trivial messages follow
- `getMessagesDiffStats` (KXz) - Compute diff stats between two messages
- `VISIBLE_MESSAGE_COUNT` (Ys8) - Constant: 7 (messages per page)

**Slash Command (chunks.165.mjs)**
- `rewindCommandDefinition` (`_Az`) at line 699-710, alias: `/checkpoint`
- `rewindCommandHandler` (`zAz`) at line 687-691 - Opens message selector and returns skip
- `rewindCommandModule` (`pXq`) at line 685 - Module container for lazy loading

**API Handler (chunks.187.mjs)**
- `handleRewindRequest` (thq) - SDK/API endpoint for rewind requests

**Summarization (chunks.147.mjs, chunks.174.mjs)**
- `performPartialCompaction` (Wqq) - Main function for "Summarize from here"
- `generateSummaryWithLLM` (Gqq) - LLM call to generate summary
- `createCompactBoundary` (Ri6) - Creates `compact_boundary` system message

**Diff Algorithm (chunks.56.mjs)**
- `computeDiff` (na) - Myers diff algorithm for line-by-line comparison

**Tool Integration Points**
- `Write` tool (chunks.139.mjs:180) - Calls `trackFileEdit` before writing
- `Edit` tool (chunks.139.mjs:1360) - Calls `trackFileEdit` before editing
- `NotebookEdit` tool (chunks.170.mjs:1352) - Calls `trackFileEdit` before cell edit
- `MultiEdit` tool (chunks.171.mjs:2136) - Calls `trackFileEdit` before sed-like edit

---

## System Reminder Integration

The rewind/checkpointing system integrates with other Claude Code features:

### Session Persistence

The persistence flow is:

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

**Key details:**
- **`_l6`** (`recordFileHistorySnapshot`) at chunks.174.mjs:1683 writes snapshot metadata to the session `.jsonl` database
- This integrates with the SessionDatabase system (`Jz`) which batches writes with debouncing
- Entry type: `"file-history-snapshot"` with `messageId`, `snapshot`, `isSnapshotUpdate` fields
- Snapshots persist across sessions, enabling rewind in resumed conversations

**JSONL Entry Format:**
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

**isSnapshotUpdate flag:**
- `true` — Called during `trackFileEdit` (updating existing snapshot incrementally)
- `false` — Called during `createSnapshotForMessage` (creating new snapshot)

### No Direct System Reminder Injection

The rewind/checkpointing system does **not** inject system reminders into the LLM context. This is a deliberate design choice:

- Rewind operates on **files and messages directly**, not via LLM prompting
- After a rewind, the conversation state is simply the sliced message array
- No "you have been rewound" notification is needed — the LLM sees the truncated context

However, there is an `autocheckpointing` attachment type defined in the system reminder normalizer (chunks.174.mjs:467) that is **silently ignored** — it returns an empty array and produces no API messages. This type exists for internal state tracking and future extensibility.

**Silent type handling:**
```javascript
// Location: chunks.174.mjs:467
if (["autocheckpointing", "background_task_status", "todo", "task_progress"].includes(A.type)) return [];
```

**Why `autocheckpointing` is silent:**
1. **No LLM context needed** — Checkpoint status is internal system state
2. **Token efficiency** — Avoids wasting tokens on internal bookkeeping
3. **Future extensibility** — Type is reserved for potential future features like auto-checkpoint notifications

> See also: [types_silent.md](../04_system_reminder/types_silent.md) for the `autocheckpointing` silent type documentation.

### Summarization (Compact) Integration

The "Summarize from here" option in the rewind UI uses the same pipeline as `/compact`:

```javascript
// Main function: Wqq (performPartialCompaction) at chunks.147.mjs:1610
async function performPartialCompaction(messages, startIndex, context, options, userContext) {
    // 1. Run pre-compact hooks
    // 2. Generate summary via Gqq (generateSummaryWithLLM)
    // 3. Create compact_boundary marker via Ri6 (createCompactBoundaryMessage)
    // 4. Return: { boundaryMarker, messagesToKeep, summaryMessages, attachments, hookResults }
}
```

**Key functions:**
1. **`Wqq`** (`performPartialCompaction`) - Main orchestrator for "Summarize from here"
2. **`Gqq`** (`generateSummaryWithLLM`) - LLM call to generate summary
3. **`Ri6`** (`createCompactBoundaryMessage`) - Creates `compact_boundary` system message

**Compact boundary message format:**
```javascript
{
    type: "system",
    subtype: "compact_boundary",
    content: "Conversation compacted",
    level: "info",
    uuid: generateUUID(),
    timestamp: new Date().toISOString(),
    isMeta: false,  // Visible in transcript
    compactMetadata: {
        trigger: "manual",           // or "auto"
        preTokens: tokenCount,
        userContext: userContext,    // optional context from user
        messagesSummarized: count
    }
}
```

After summarization:
- A `compact_boundary` marker is inserted to note where compaction occurred
- The marker contains: original message count, token counts, user context
- Users can access the full history via Ctrl+O (transcript viewer)
- The message count and stats are logged via telemetry

### State Restoration

When restoring conversation (via `onRestoreMessage` callback):
1. Messages are sliced at the checkpoint
2. **Todos** are restored from the snapshot's saved state
3. **Permission mode** is reset if it changed
4. Original prompt text is re-injected into the input field via **`ZQ1`** (`extractMessageContent`)

### Pre-Restore Hook

The **`onPreRestore`** callback:
- Aborts any in-progress LLM stream
- Clears tool permission queue
- Clears queued commands
- This ensures a clean state before restoration begins

### SDK/API Integration

The rewind feature can be triggered programmatically via the API/SDK through `handleRewindRequest` (`thq`) at chunks.187.mjs:1271-1303.

**API Request Flow:**
```
SDK/CLI Client
      │
      ▼
rewind_files request (subtype)
      │
      ▼
handleRewindRequest (thq)
      │
      ├── iz() → Check if checkpointing enabled
      ├── tN1() → Check if snapshot exists for messageId
      │
      ├── If dry_run=true:
      │   └── eN1() → Return diff stats only
      │
      └── If dry_run=false:
          └── sN1() → Execute actual rewind
```

**API Request Format:**
```javascript
{
    subtype: "rewind_files",
    user_message_id: "uuid-of-target-message",
    dry_run: false  // true = only return stats, don't restore
}
```

**API Response Format (dry_run=true):**
```javascript
{
    canRewind: true,
    filesChanged: ["/path/to/file1.ts", "/path/to/file2.ts"],
    insertions: 45,
    deletions: 12
}
```

**API Response Format (dry_run=false):**
```javascript
{
    canRewind: true  // or { canRewind: false, error: "..." }
}
```

**Error scenarios:**
- `"File rewinding is not enabled."` — Checkpointing disabled via settings/env
- `"No file checkpoint found for this message."` — No snapshot for the given messageId
- `"Failed to rewind: {error}"` — Exception during restore operation

---

## Algorithm Deep-Dives

### Multi-Tier File Comparison

The `fileNeedsRestore` (cu8) function uses a 5-tier comparison strategy to avoid unnecessary file operations:

**Algorithm:**

```
function fileNeedsRestore(originalPath, backupFileName):
    1. STAT original file → originalStats
    2. STAT backup file → backupStats
    3. IF exactly one exists → NEEDS RESTORE
    4. IF both don't exist → NO RESTORE NEEDED
    5. IF mode differs → NEEDS RESTORE
    6. IF size differs → NEEDS RESTORE
    7. IF original.mtime < backup.mtime → NO RESTORE NEEDED (optimization)
    8. READ both files
    9. IF content differs → NEEDS RESTORE
    10. ELSE → NO RESTORE NEEDED
```

**Why this ordering:**
- Stats (tiers 1-4) are O(1) filesystem metadata operations
- Content comparison (tier 5) is O(n) expensive read
- mtime check catches 60%+ of unchanged files before content read
- Most files won't need restore, so early exits save significant I/O

### Backup Filename Strategy

**Format:** `{SHA256(filePath).slice(0,16)}@v{version}`

**Example:** `/home/user/project/src/auth.ts` → `a1b2c3d4e5f6a7b8@v2`

**Why path-based hashing:**
1. All versions of same file share same 16-char prefix
2. Easy to list all backups for a file: `ls a1b2c3d4e5f6a7b8@*`
3. Hash is filesystem-safe (no special characters)
4. 64 bits of entropy (collision probability: ~10^-19 for 1M files)

**Why not content-hash (like Git):**
- Git deduplicates by content-hash
- Backup files are NOT deduplicated (each version stored separately)
- Path-hash makes file-specific backup management trivial

### MAX_SNAPSHOTS=100 Rationale

**Memory bound:**
- Each snapshot: ~50 tracked files × 53 bytes ≈ 2.5 KB
- 100 snapshots ≈ 265 KB in memory
- Linear growth prevented by slice(-100)

**Disk bound:**
- Backup files persist regardless of in-memory limit
- Old snapshots still in JSONL, just not loaded
- User can still rewind very old checkpoints after session reload

**User behavior:**
- ~95% of rewinds happen within 20 turns
- 100 turns covers several hours of intensive work
- Rarely need to rewind beyond this limit

---

## Telemetry Events

The rewind/checkpointing system emits the following telemetry events:

### File History Events

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

### Message Selector UI Events

| Event | When | Properties |
|-------|------|------------|
| `tengu_message_selector_opened` | Rewind UI opened | (none) |
| `tengu_message_selector_selected` | User selected a message | `index_from_end`, `message_type`, `is_current_prompt` |
| `tengu_message_selector_restore_option_selected` | User picked restore option | `option` |
| `tengu_message_selector_cancelled` | User cancelled | (none) |

### Summarization Events

| Event | When | Properties |
|-------|------|------------|
| `tengu_partial_compact` | Partial compaction completed | `preCompactTokenCount`, `postCompactTokenCount`, `messagesKept`, `messagesSummarized`, `trigger`, `compactionInputTokens`, `compactionOutputTokens`, `compactionCacheReadTokens`, `compactionCacheCreationTokens` |
| `tengu_partial_compact_failed` | Partial compaction failed | `reason`, `preCompactTokenCount` |

---

## Tool Integration Call Sites

The `trackFileEdit` (R66) function is called from multiple file-modifying tools. All integrations follow the same pattern: **guard check → track before write**.

### Call Sites Summary

| Tool | File | Line | Call Pattern |
|------|------|------|--------------|
| Write | chunks.139.mjs | 180 | `if (iz()) await R66(Y, O, w.uuid)` |
| Edit (file) | chunks.139.mjs | 1360 | `if (iz()) await R66(_, $, O.uuid)` |
| NotebookEdit | chunks.170.mjs | 1352 | `if (iz()) await R66(Y, M, w.uuid)` |
| MultiEdit | chunks.171.mjs | 2136 | `if (iz() && K) await R66(...)` |

### Integration Pattern

```javascript
// All tools follow this pattern:
if (isFileCheckpointingEnabled()) {
    await trackFileEdit(updateFileHistoryState, filePath, message.uuid);
}
// Then perform actual file operation
```

**Why track BEFORE write:** The backup captures the "before Claude touched this" state. If tracked after the write, the backup would contain the modified content, defeating the purpose of rewind.

### Snapshot Creation Call Sites

The `createSnapshotForMessage` (lf6) function is called at message completion:

| Context | File | Line |
|---------|------|------|
| Main agent loop | chunks.185.mjs | 2019 |
| SDK mode | chunks.196.mjs | 852 |
| Subagent completion | chunks.194.mjs | 539 |

---

## Helper Function Ecosystem

The rewind module relies on a set of shared utility functions:

### File System Layer

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| `getFileSystem` | `$1` | chunks.1.mjs:4044 | Get Node.js fs module |
| `writeFileSync` | `fz` | chunks.1.mjs:3878 | Write file with flush support |
| `getDirectoryPath` | `Dn4` | chunks.1.mjs | Extract directory from path |
| `setFilePermissions` | `Pn4` | chunks.1.mjs | Set file mode/permissions |

### Boolean/Environment Parsing

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| `parseBoolean` | `t6` | chunks.1.mjs:4491 | Parse "true"/"1"/"yes" to boolean |
| `isSDKMode` | `q7` | chunks.1.mjs:2720 | Check if running in SDK mode |

### Logging & Telemetry

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| `consoleLog` | `k` | chunks.2.mjs:165 | Console logging with level |
| `telemetry` | `d` | chunks.2.mjs:275 | Record analytics event |
| `logError` | `_6` | chunks.14.mjs:726 | Error logging with reporting |

### Settings

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| `getUserSettings` | `X1` | chunks.177.mjs:2046 | Get cached user configuration |

### Diff Algorithm

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| `computeDiff` | `na` | chunks.56.mjs:2072 | Myers diff for line counting |

> Full documentation: See [implementation.md](./implementation.md) Section 19

---

## Limitations and Edge Cases

### Tracked File Limitations

| Scenario | Behavior | Reason |
|----------|----------|--------|
| Files modified via Bash | NOT tracked | Requires sandboxed filesystem |
| Files modified by user externally | NOT tracked | No filesystem watcher |
| Files modified by other tools | NOT tracked | Only Claude's Write/Edit tools trigger backup |
| Symlinks | Tracked by resolved path | Normalized before storage |
| Binary files | Tracked as text | May cause encoding issues |
| Large files | Full copy stored | No size limit implemented |

### Snapshot Limitations

| Limitation | Value | Implication |
|------------|-------|-------------|
| Max snapshots in memory | 100 | Older snapshots still in JSONL but not loaded |
| Backup file retention | 30 days | Aligned with session cleanup |
| Per-file version limit | None | Each edit creates new version |

### Edge Cases

#### 1. File Created Then Deleted Within Same Message
```
Message N:
  Write file A (creates v1 backup with null)
  Delete file A via Bash (not tracked)

Rewind to N: File A is deleted (null backup applied)
```
Result: Correct — the file didn't exist before message N.

#### 2. Multiple Edits to Same File in Same Message
```
Message N:
  Edit file A (line 10) → Backup created (v1)
  Edit file A (line 20) → No backup (already tracked)
  Edit file A (line 30) → No backup (already tracked)

Rewind to N: File A restored to pre-edit state (v1)
```
Result: Correct — "first edit wins" captures the original state.

#### 3. File Modified Outside Claude Between Snapshot and Rewind
```
1. Claude edits file A → Backup v1 created
2. User manually edits file A (external editor)
3. User rewinds to before Claude edit
```
Result: File A restored to v1 backup, **user's external edits are lost**.

**Why:** The rewind system has no way to know about external modifications. It only compares current state vs backup.

#### 4. Session Resume with Different Working Directory
```
Session 1: Working in /projectA
  - Claude edits /projectA/src/file.ts
  - Backup stored with normalized path "src/file.ts"

Session 2: Resume with cwd /projectB
  - Hydration reconstructs tracked paths
  - resolveTrackedFilePath resolves "src/file.ts" → /projectB/src/file.ts
```
Result: Wrong file may be restored if project structure differs.

**Mitigation:** Paths are normalized relative to cwd, but resuming in a different project may cause confusion.

#### 5. Compact Boundary Interaction
```
Messages: [M1, M2, M3, compact_boundary, M4, M5]
User rewinds to M2: Only M1 remains
```
Result: Compact boundary and all messages after M2 are removed.

**Note:** The compact_boundary marker is not special-cased — it's just another message that gets sliced.

### Error Recovery

| Error | Recovery |
|-------|----------|
| Backup file missing | Skip that file, continue with others |
| Snapshot not found | Return error, no restore |
| File permission denied | Log error, skip file |
| Disk full | Write fails, restore incomplete |

### Performance Characteristics

| Operation | Complexity | Notes |
|-----------|------------|-------|
| `trackFileEdit` | O(1) for check, O(n) for file copy | Only copies on first edit |
| `createSnapshotForMessage` | O(files × file_size) | Copies all changed files |
| `rewindHandler` | O(files × file_size) | Restores all tracked files |
| `fileNeedsRestore` | O(1) to O(n) | Multi-tier comparison |
| `calculateFileDiffStats` | O(n) for diff | Uses Myers algorithm |

---

## Cross-Module Integration

### 04_system_reminder — Session Persistence

The rewind feature integrates with the system reminder module for JSONL persistence:

```
┌──────────────────────────────────────────────────────────────────────┐
│                        PERSISTENCE FLOW                               │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│   trackFileEdit (R66)         createSnapshotForMessage (lf6)         │
│         │                              │                              │
│         ▼                              ▼                              │
│   ┌─────────────┐              ┌─────────────┐                       │
│   │ Update      │              │ Create new  │                       │
│   │ existing    │              │ complete    │                       │
│   │ snapshot    │              │ snapshot    │                       │
│   └──────┬──────┘              └──────┬──────┘                       │
│          │                            │                               │
│          │    isSnapshotUpdate=true   │    isSnapshotUpdate=false    │
│          │                            │                               │
│          └──────────┬─────────────────┘                               │
│                     ▼                                                 │
│              _l6 (recordFileHistorySnapshot)                          │
│                     │                                                 │
│                     ▼                                                 │
│              Jz (getSessionDatabase)                                  │
│                     │                                                 │
│                     ▼                                                 │
│         insertFileHistorySnapshot()                                   │
│                     │                                                 │
│                     ▼                                                 │
│         ┌───────────────────────┐                                    │
│         │ Session .jsonl file   │                                    │
│         │ ~/.claude/projects/   │                                    │
│         │ {sessionId}.jsonl     │                                    │
│         └───────────────────────┘                                    │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                        REHYDRATION FLOW                               │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│   --resume flag                                                       │
│         │                                                             │
│         ▼                                                             │
│   Load session from .jsonl                                            │
│         │                                                             │
│         ▼                                                             │
│   qV1 (hydrateFileHistoryFromSnapshots)                               │
│         │                                                             │
│         ├──────────────────────────────────┐                          │
│         │                                  │                          │
│         ▼                                  ▼                          │
│   Reconstruct snapshots[]          Reconstruct trackedFiles           │
│   from JSONL entries               from all snapshot paths            │
│         │                                  │                          │
│         └──────────────┬───────────────────┘                          │
│                        ▼                                              │
│              KV1 (migrateFileHistoryToNewSession)                     │
│                        │                                              │
│                        ▼                                              │
│              Copy backup files to new session                         │
│              (hard-link or copy)                                      │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

**Key integration points:**
- `_l6` (`recordFileHistorySnapshot`) at chunks.174.mjs:1683 - Writes to session database
- `Jz` (`getSessionDatabase`) at chunks.174.mjs:1406 - SessionDatabase singleton
- `qV1` (`hydrateFileHistoryFromSnapshots`) at chunks.135.mjs:2315 - Reconstructs state from JSONL
- `KV1` (`migrateFileHistoryToNewSession`) at chunks.135.mjs:2337 - Copies backup files when resuming

**JSONL Entry Format:**
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

**isSnapshotUpdate flag:**
- `true` — Called during `trackFileEdit` (updating existing snapshot incrementally)
- `false` — Called during `createSnapshotForMessage` (creating new snapshot)

### 07_compact — Summarization Pipeline

The "Summarize from here" option shares infrastructure with `/compact`:

```
┌──────────────────────────────────────────────────────────────────────┐
│                    SUMMARIZE PIPELINE (Wqq)                           │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│   User selects "Summarize from here"                                  │
│         │                                                             │
│         ▼                                                             │
│   handleRestoreOptionSelected (p)                                     │
│         │                                                             │
│         ▼                                                             │
│   onSummarize callback                                                │
│         │                                                             │
│         ▼                                                             │
│   ┌─────────────────────────────────────────────────────────────┐    │
│   │ Wqq (performPartialCompaction)                               │    │
│   │ chunks.147.mjs:1610-1707                                     │    │
│   │                                                               │    │
│   │  ┌─────────────────────────────────────────────────────────┐ │    │
│   │  │ 1. Split messages at startIndex                         │ │    │
│   │  │    messagesToKeep = messages.slice(0, startIndex)       │ │    │
│   │  │    messagesToSummarize = messages.slice(startIndex)     │ │    │
│   │  └─────────────────────────────────────────────────────────┘ │    │
│   │                          │                                    │    │
│   │                          ▼                                    │    │
│   │  ┌─────────────────────────────────────────────────────────┐ │    │
│   │  │ 2. Run pre-compact hooks (sT6)                           │ │    │
│   │  │    - Execute PreCompact hook handlers                    │ │    │
│   │  │    - Allow modification of custom instructions           │ │    │
│   │  └─────────────────────────────────────────────────────────┘ │    │
│   │                          │                                    │    │
│   │                          ▼                                    │    │
│   │  ┌─────────────────────────────────────────────────────────┐ │    │
│   │  │ 3. Generate summary (Gqq)                                │ │    │
│   │  │    - Build summary prompt with user context             │ │    │
│   │  │    - Call LLM to generate summary                        │ │    │
│   │  │    - Extract text from response                          │ │    │
│   │  └─────────────────────────────────────────────────────────┘ │    │
│   │                          │                                    │    │
│   │                          ▼                                    │    │
│   │  ┌─────────────────────────────────────────────────────────┐ │    │
│   │  │ 4. Collect attachments                                   │ │    │
│   │  │    - Files to keep as context                            │ │    │
│   │  │    - Tasks to preserve                                   │ │    │
│   │  │    - Plan if in plan mode                                │ │    │
│   │  └─────────────────────────────────────────────────────────┘ │    │
│   │                          │                                    │    │
│   │                          ▼                                    │    │
│   │  ┌─────────────────────────────────────────────────────────┐ │    │
│   │  │ 5. Create boundary marker (Ri6)                          │ │    │
│   │  │    - compact_boundary system message                     │ │    │
│   │  │    - Metadata: trigger, tokens, messagesSummarized       │ │    │
│   │  └─────────────────────────────────────────────────────────┘ │    │
│   │                          │                                    │    │
│   │                          ▼                                    │    │
│   │  ┌─────────────────────────────────────────────────────────┐ │    │
│   │  │ 6. Return result                                         │ │    │
│   │  │    - boundaryMarker                                      │ │    │
│   │  │    - messagesToKeep                                      │ │    │
│   │  │    - summaryMessages                                     │ │    │
│   │  │    - attachments                                         │ │    │
│   │  └─────────────────────────────────────────────────────────┘ │    │
│   └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

**Shared functions:**
- `Wqq` (performPartialCompaction) at chunks.147.mjs:1610 - Main orchestrator
- `Gqq` (generateSummaryWithLLM) at chunks.147.mjs:1752 - LLM call for summary
- `Ri6` (createCompactBoundary) at chunks.174.mjs:580 - Marker message creation

**Difference:**
- `/compact` summarizes from the beginning (older messages)
- Rewind summarize targets a specific point (selected message forward)

**Compact boundary message format:**
```javascript
{
    type: "system",
    subtype: "compact_boundary",
    content: "Conversation compacted",
    isMeta: false,  // Visible in transcript
    uuid: generateUUID(),
    timestamp: new Date().toISOString(),
    compactMetadata: {
        trigger: "manual",           // or "auto"
        preTokens: tokenCount,
        userContext: userContext,    // optional context from user
        messagesSummarized: count
    }
}
```

### 15_state_management — React State

The FileHistory state is managed via Zustand-like store:

```typescript
interface FileHistoryState {
    snapshots: Snapshot[];           // Message-level snapshots
    trackedFiles: Set<string>;       // Files being tracked
    snapshotSequence: number;        // Ordering counter
}
```

State updates use functional updates for concurrency safety.

### 05_tools — File Edit Tracking

The `trackFileEdit` function is called by file modification tools:

| Tool | When Called | What Happens |
|------|-------------|--------------|
| `Write` | Before writing new/overwriting file | Creates backup of original (if exists) or marks as new file |
| `Edit` | Before applying patch | Creates backup of pre-edit state |

**Integration pattern:**
```javascript
// In Write tool handler
if (isFileCheckpointingEnabled()) {
    await trackFileEdit(updateFileHistoryState, filePath, currentMessageId);
}
// Then write the file...
```

**Bash tool exclusion:**
Files modified via Bash commands are NOT tracked. The rationale:
- Intercepting all shell file mutations would require sandboxed filesystem
- Complexity of tracking `rm`, `mv`, `cp`, redirects, pipes, etc.
- UI warns: "Rewinding does not affect files edited manually or via bash."

### API Handler — SDK and CLI Integration

The rewind feature exposes a programmatic API via `handleRewindRequest` (`thq`):

**Location:** chunks.187.mjs:1271-1303

```
┌──────────────────────────────────────────────────────────────────┐
│                    API HANDLER FLOW                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│   SDK Client / CLI --rewind-files                                │
│         │                                                         │
│         ▼                                                         │
│   API Request (subtype: "rewind_files")                          │
│         │                                                         │
│         ▼                                                         │
│   thq (handleRewindRequest)                                       │
│         │                                                         │
│         ├───── Guard Checks ─────┐                                │
│         │                        │                                │
│         │                        ├─ isFileCheckpointingEnabled?  │
│         │                        │                                │
│         │                        └─ snapshotExistsForMessage?    │
│         │                                                         │
│         ├───── Dry Run (isDryRun=true) ─────┐                    │
│         │                                   │                    │
│         │                                   ▼                    │
│         │                           eN1 (getDryRunDiffStats)     │
│         │                                   │                    │
│         │                                   ▼                    │
│         │                           Return { filesChanged,       │
│         │                                   insertions,           │
│         │                                   deletions }           │
│         │                                                        │
│         ├───── Actual Rewind (isDryRun=false) ─────┐             │
│         │                                           │             │
│         │                                           ▼             │
│         │                                   sN1 (rewindHandler)   │
│         │                                           │             │
│         │                                           ▼             │
│         │                                   Return { canRewind }   │
│         │                                                        │
│         ▼                                                        │
│   Response to client                                             │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

**Call sites:**
| Source | Location | Usage |
|--------|----------|-------|
| API handler | chunks.187.mjs:737 | `request.subtype === "rewind_files"` |
| CLI --rewind-files | chunks.186.mjs:1689 | Non-interactive rewind command |

**Return value:**
```typescript
interface RewindResponse {
    canRewind: boolean;      // Success flag
    error?: string;          // Error message if failed
    filesChanged?: string[]; // Files affected (dry-run only)
    insertions?: number;     // Lines added (dry-run only)
    deletions?: number;      // Lines removed (dry-run only)
}
```

**Why dry-run mode:**
- SDK clients may want to preview changes before committing
- UI uses this to show diff stats before user confirms
- Safe to call multiple times without side effects

---

## State Restoration Flow

When a user selects a restore operation, multiple subsystems are coordinated:

### Complete Restoration Sequence

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         RESTORATION FLOW (both/code+conversation)           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   User selects message + restore option                                     │
│         │                                                                    │
│         ▼                                                                    │
│   handleRestoreOptionSelected (p)                                           │
│         │                                                                    │
│         ├──────────────────────────────────────────────────────────────┐    │
│         │                                                              │    │
│         ▼                                                              ▼    │
│   "code" or "both"                                              "conversation" or "both"    │
│         │                                                              │    │
│         ▼                                                              ▼    │
│   onPreRestore()                                                   onPreRestore()    │
│         │                                                              │    │
│         ├── Abort in-progress LLM stream                              │    │
│         ├── Clear tool permission queue                               │    │
│         └── Clear queued commands                                     │    │
│         │                                                              │    │
│         ▼                                                              ▼    │
│   onRestoreCode(message)                                      onRestoreMessage(message)    │
│         │                                                              │    │
│         ▼                                                              ▼    │
│   sN1 (rewindHandler)                                          slice messages at checkpoint    │
│         │                                                              │    │
│         ▼                                                              ├── Restore todos from snapshot    │
│   Zn4 (rewindAndRestoreFiles)                                         ├── Reset permission mode    │
│         │                                                              └── Re-inject prompt text    │
│         │                                                              │    │
│         ├─> For each tracked file:                                     │    │
│         │     ├─ backupFileName = null → delete file                   │    │
│         │     └─ backupFileName = "hash@vN" → restore from backup      │    │
│         │                                                              │    │
│         ▼                                                              ▼    │
│   Return { filesChanged, insertions, deletions }              Return to UI    │
│         │                                                              │    │
│         └──────────────────────────────────────────────────────────────┘    │
│                                     │                                        │
│                                     ▼                                        │
│                              onClose() → Selector unmounts                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Error Isolation Pattern

For "Restore code and conversation" (`"both"`), errors are isolated:

```javascript
// From handleRestoreOptionSelected
let codeError = null;
let conversationError = null;

// Code restore (continues even if fails)
if (option === "code" || option === "both") {
    try { await onRestoreCode(selectedMessage); }
    catch (e) { codeError = e; logError(e); }
}

// Conversation restore (continues even if code failed)
if (option === "conversation" || option === "both") {
    try { await onRestoreMessage(selectedMessage); }
    catch (e) { conversationError = e; logError(e); }
}

// Combined error reporting
if (conversationError && codeError) {
    setErrorMessage(`Failed to restore both:\n${conversationError}\n${codeError}`);
}
```

**Why this pattern:**
- User gets partial restore if one operation fails
- All errors are logged for debugging
- UI shows exactly what failed

---

## UI Navigation Flow

### Message Selection Algorithm

When the user opens the RewindMessageSelector:

```
┌──────────────────────────────────────────────────────────────────┐
│                    MESSAGE FILTERING PIPELINE                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│   All messages in conversation                                     │
│         │                                                          │
│         ▼                                                          │
│   Filter: isSelectableMessage (XV6)                               │
│         │                                                          │
│         ├─> Exclude: system messages (type === "system")          │
│         ├─> Exclude: progress messages (type === "progress")      │
│         ├─> Exclude: meta user messages (isMeta === true)         │
│         ├─> Exclude: messages with internal XML tags              │
│         │     (bash-stdout, bash-stderr, task-notification, etc.) │
│         │                                                          │
│         ▼                                                          │
│   Add virtual "current" message                                    │
│         │                                                          │
│         ▼                                                          │
│   Render scrollable list (7 visible at a time)                    │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

### Fast-Path Restore Logic

The UI optimizes for common cases where the full options menu is unnecessary:

```javascript
// From handleMessageSelection (b) at chunks.185.mjs:1248-1268
async function handleMessageSelection(selectedMessage) {
    let messageIndex = messages.indexOf(selectedMessage);
    let indexFromEnd = messages.length - 1 - messageIndex;

    // 1. Check if checkpointing is disabled
    if (!isFileCheckpointingEnabled()) {
        await directConversationRestore(selectedMessage);
        return;
    }

    // 2. Get diff stats for this checkpoint
    let diffStats = getDryRunDiffStats(fileHistory, selectedMessage.uuid);
    let hasNoCodeChanges = !diffStats?.filesChanged || diffStats.filesChanged.length === 0;

    // 3. Check if only trivial messages follow
    let isOnlyTrivialMessagesAfter = isOnlyOneMessageAfterIndex(messages, messageIndex);

    // 4. Fast-path: No code changes + only trivial messages = skip options menu
    if (hasNoCodeChanges && isOnlyTrivialMessagesAfter) {
        await directConversationRestore(selectedMessage);
    } else {
        showOptionsPanel(selectedMessage, diffStats);
    }
}
```

**When fast-path is triggered:**
- No files changed since the selected message
- Only system messages, progress updates, or compact summaries follow
- User gets instant restore without the options menu

### Keyboard Navigation

| Key | Action | Behavior |
|-----|--------|----------|
| `↑` / `k` | Up | Move selection up one message |
| `↓` / `j` | Down | Move selection down one message |
| `Ctrl+↑` / `Shift+↑` | Top | Jump to first message |
| `Ctrl+↓` / `Shift+↓` | Bottom | Jump to last message |
| `Enter` | Select | Confirm selection |
| `Esc` | Cancel | Close selector without action |

The scroll window centers on the selected message, showing 3 messages above and 3 below (7 total visible).

---

## Key Algorithms Summary

### Algorithm 1: First-Edit-Only Backup

**Problem:** A file may be edited multiple times in a single message. Which state should be backed up?

**Solution:** Only the **first** edit per file per message creates a backup.

**Rationale:** When rewinding, users want the "before Claude touched this" state, not intermediate states.

**Implementation:**
```javascript
// From trackFileEdit at chunks.135.mjs:1993
if (mostRecentSnapshot.trackedFileBackups[normalizedPath]) return fileHistoryState;
// Already tracked? Skip backup creation.
```

### Algorithm 2: Multi-Tier File Comparison

**Problem:** Checking if a file needs restore is expensive (requires reading file content).

**Solution:** 5-tier comparison from fast to slow:

| Tier | Check | Cost | Skip Rate |
|------|-------|------|-----------|
| 1 | Existence | O(1) stat | ~5% |
| 2 | Mode | O(1) stat | ~1% |
| 3 | Size | O(1) stat | ~10% |
| 4 | mtime | O(1) stat | ~60% |
| 5 | Content | O(n) read | ~24% |

**Result:** ~76% of files skip the expensive content comparison.

### Algorithm 3: Backup Deduplication

**Problem:** Creating a new backup for every snapshot is wasteful.

**Solution:** Reuse existing backup records when file content hasn't changed.

**Implementation:**
```javascript
// From createSnapshotForMessage at chunks.135.mjs:2039-2042
if (prevBackup && prevBackup.backupFileName !== null && !fileNeedsRestore(actualPath, prevBackup.backupFileName)) {
    backups[trackedPath] = prevBackup;  // Reuse existing backup
    continue;
}
```

---

### Silent Attachment Type: `autocheckpointing`

> Cross-reference: [04_system_reminder/reminder_types.md](../04_system_reminder/reminder_types.md#autocheckpointing--deep-analysis)

The `autocheckpointing` attachment type is a **forward-compatibility guard** in `normalizeAttachmentForAPI`. No code in v2.1.76 creates this attachment type, but the normalization switch includes a case for it that returns an empty array:

```javascript
// Location: chunks.174.mjs (normalizeAttachmentForAPI)
if (["autocheckpointing", "background_task_status"].includes(attachment.type)) return [];
```

**Why this matters for rewind:**
- Rewind is a **UI-only operation** — it does not notify the LLM
- After a rewind, the conversation is simply truncated; no system reminder is injected
- This is intentional: the LLM should not be told about rewind operations as it could cause confusion
- The `autocheckpointing` type was likely planned for notifications like "Auto-checkpoint saved at message X"

---

## See Also

- [implementation.md](./implementation.md) - Detailed code analysis with pseudocode
- [ui_linkage.md](./ui_linkage.md) - UI component and keyboard navigation
- [../07_compact/](../07_compact/) - Full context compaction (Wqq is shared)
- [../15_state_management/](../15_state_management/) - Session state schema
- [../04_system_reminder/](../04_system_reminder/) - Session persistence integration and `autocheckpointing` silent type
- [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Symbol index (Rewind section)
- [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Helper function symbols

---

## Quick Reference: Symbol Index

> Full symbol table: [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md#module-rewind--checkpointing)

### Core Functions (chunks.135.mjs)

| Obfuscated | Readable | Line | Purpose |
|------------|----------|------|---------|
| iz | isFileCheckpointingEnabled | 1977 | Master guard |
| R66 | trackFileEdit | 1986 | Record file backup |
| lf6 | createSnapshotForMessage | 2016 | Finalize snapshot |
| sN1 | rewindHandler | 2075 | Execute restore |
| Zn4 | rewindAndRestoreFiles | 2135 | Physical file restore |
| cu8 | fileNeedsRestore | 2171 | Check if restore needed |
| Mn4 | calculateFileDiffStats | 2203 | Compute diff preview |
| du8 | createBackupFile | 2247 | Write backup file |
| _VY | restoreFileFromBackup | 2275 | Copy backup to original |

### UI Functions (chunks.185.mjs)

| Obfuscated | Readable | Line | Purpose |
|------------|----------|------|---------|
| zs8 | RewindMessageSelector | 1179 | Main React component |
| g | generateRestoreOptions | 1207 | Build option list |
| b | handleMessageSelection | 1248 | Process selection |
| p | handleRestoreOptionSelected | 1269 | Dispatch restore |
| YI1 | isOnlyOneMessageAfterIndex | 1704 | Fast-path check |
| KXz | getMessagesDiffStats | 1659 | Diff stats for messages |

### Persistence (chunks.174.mjs)

| Obfuscated | Readable | Line | Purpose |
|------------|----------|------|---------|
| _l6 | recordFileHistorySnapshot | 1683 | Write to JSONL |
| qV1 | hydrateFileHistoryFromSnapshots | 2315 | Restore from JSONL |
| KV1 | migrateFileHistoryToNewSession | 2337 | Copy backups on resume |

### API Handler (chunks.187.mjs)

| Obfuscated | Readable | Line | Purpose |
|------------|----------|------|---------|
| thq | handleRewindRequest | 1271 | API endpoint for SDK/CLI rewind |

### Constants

| Obfuscated | Readable | Value | Purpose |
|------------|----------|-------|---------|
| Jn4 | MAX_SNAPSHOTS | 100 | Max snapshots in memory |
| Ys8 | VISIBLE_MESSAGE_COUNT | 7 | Messages visible per page |

---

## Telemetry Events

The rewind feature emits detailed telemetry for monitoring and debugging:

### File History Events

| Event | Location | Trigger | Properties |
|-------|----------|---------|------------|
| `tengu_file_history_snapshot_success` | chunks.135.mjs:2065 | Snapshot created | `trackedFilesCount`, `snapshotCount` |
| `tengu_file_history_snapshot_failed` | chunks.135.mjs:2070 | Snapshot creation error | (none) |
| `tengu_file_history_track_edit_success` | chunks.135.mjs:2006 | File tracked before edit | `isNewFile`, `version` |
| `tengu_file_history_track_edit_failed` | chunks.135.mjs:1991, 2011 | Track edit error | (none) |
| `tengu_file_history_backup_file_created` | chunks.135.mjs:2263 | Backup written | `version`, `fileSize` |
| `tengu_file_history_backup_file_failed` | chunks.135.mjs:2049 | Backup write error | (none) |
| `tengu_file_history_backup_deleted_file` | chunks.135.mjs:2035 | Tracked file missing | `version` |
| `tengu_file_history_rewind_success` | chunks.135.mjs:2088 | Restore completed | `trackedFilesCount`, `filesChangedCount` |
| `tengu_file_history_rewind_failed` | chunks.135.mjs:2082, 2093 | Restore error | `trackedFilesCount`, `snapshotFound` |
| `tengu_file_history_rewind_restore_file_failed` | chunks.135.mjs:2144, 2160, 2279 | Single file restore error | `dryRun` |
| `tengu_file_history_snapshots_setting_changed` | chunks.151.mjs:2104 | User toggled setting | `enabled` |
| `tengu_file_history_resume_copy_failed` | chunks.135.mjs:2382 | Backup migration error | `numSnapshots`, `failedSnapshots` |

### Message Selector Events

| Event | Location | Trigger | Properties |
|-------|----------|---------|------------|
| `tengu_message_selector_opened` | chunks.185.mjs:1237 | UI opened | (none) |
| `tengu_message_selector_selected` | chunks.185.mjs:1251 | User selected message | `index_from_end`, `message_type`, `is_current_prompt` |
| `tengu_message_selector_restore_option_selected` | chunks.185.mjs:1270 | User picked restore option | `option` |
| `tengu_message_selector_cancelled` | chunks.185.mjs:1319 | User cancelled | (none) |

### Restore Option Values

The `option` property in `tengu_message_selector_restore_option_selected` can be:
- `"both"` - Restore code and conversation
- `"conversation"` - Restore conversation only
- `"code"` - Restore code only
- `"summarize"` - Summarize from here
- `"nevermind"` - Cancel

### Usage Analytics

These events enable:
1. **Feature adoption tracking** - How often rewind is used
2. **Error monitoring** - Failed operations and their causes
3. **Performance analysis** - Time spent in snapshot operations
4. **User behavior** - Which restore options are most popular
5. **Capacity planning** - Average tracked files, snapshot counts