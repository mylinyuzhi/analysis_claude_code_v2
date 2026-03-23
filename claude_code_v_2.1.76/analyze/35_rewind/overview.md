# Overview - Rewind / Checkpointing (Module 35)

> Official docs: [Checkpointing](https://code.claude.com/docs/checkpointing)

## Purpose

The **Rewind** feature (officially "Checkpointing") provides a session-level undo system that lets users roll back both file changes and/or conversation history to any prior prompt. It is Claude Code's safety net for exploring risky or wide-scope changes — giving users confidence to attempt ambitious tasks knowing any state can be recovered.

Unlike Git, checkpoints are automatic, transparent, and tied to the conversation timeline rather than explicit commit actions.

---

## Table of Contents

- [Purpose](#purpose)
- [Architectural Overview](#architectural-overview)
- [Key Concepts](#key-concepts)
- [Feature Enablement](#feature-enablement)
- [Core Algorithms](#core-algorithms)
- [UI Flow](#ui-flow)
- [Integration Points](#integration-points)
- [Related Symbols](#related-symbols)

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
  (Zn4)               (state update)   (Wqq)
```

### System Components

```
┌─────────────────────────────────────────────────────────────────────┐
│                     FILE HISTORY SYSTEM                              │
│                        (chunks.135.mjs)                              │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    CORE DATA MODEL                           │    │
│  │                                                              │    │
│  │  FileHistory {                                               │    │
│  │    trackedFiles: Set<path>      // All files ever touched    │    │
│  │    snapshots: Snapshot[]        // One per message (max 100) │    │
│  │    snapshotSequence: number     // React reconciliation      │    │
│  │  }                                                          │    │
│  │                                                              │    │
│  │  Snapshot {                                                  │    │
│  │    messageId: string                                         │    │
│  │    timestamp: Date                                           │    │
│  │    trackedFileBackups: { [path]: BackupRecord }             │    │
│  │  }                                                          │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│         ┌────────────────────┼────────────────────┐                 │
│         ▼                    ▼                    ▼                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │
│  │  trackFileEdit  │  │ createSnapshot  │  │ rewindHandler   │     │
│  │     (R66)       │  │ ForMessage (lf6)│  │    (sN1)        │     │
│  │                 │  │                 │  │                 │     │
│  │ Before edit     │  │ After message   │  │ Execute restore │     │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘     │
│                                                                      │
│  Backup Files: ~/.claude/file-history/{sessionId}/{hash}@v{N}       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Key Concepts

### 1. Automatic Checkpointing

Unlike version control, checkpoints happen automatically:
- **Before every file edit** — A backup is created
- **After every message** — A snapshot captures all tracked file states
- **Transparent to user** — No explicit action required

### 2. Message-Bound Snapshots

Each snapshot is tied to a specific user message:
- The snapshot represents file state **before** the user sent that message
- Selecting a message restores files to that pre-message state
- This aligns the conversation timeline with file changes

### 3. First-Edit-Only Pattern

Within a single message, only the **first** edit to a file triggers a backup:
```javascript
// Already tracked in this snapshot? Skip.
if (mostRecentSnapshot.trackedFileBackups[normalizedPath]) {
    return fileHistoryState;
}
```

This captures the file's state before any modifications in that message, avoiding redundant backups.

### 4. Backup File Naming

Backups use deterministic filenames based on content-addressable storage:

```
{sha256(originalPath)[:16]}@v{version}

Example: a1b2c3d4e5f6a7b8@v2
```

This enables:
- Same path always produces same hash prefix
- Version suffix allows multiple backups per file
- No filesystem issues with special characters

### 5. Null Backup Semantics

`backupFileName: null` has special meaning:
- **Does NOT mean** "no backup exists"
- **DOES mean** "file did not exist at this snapshot"
- Restoration of a null backup = delete the current file

---

## Feature Enablement

### Configuration Options

| Mode | Default | Enable | Disable |
|------|---------|--------|---------|
| Interactive CLI | **Enabled** | `fileCheckpointingEnabled: true` | `CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING=1` |
| SDK/Embedded | **Disabled** | `CLAUDE_CODE_ENABLE_SDK_FILE_CHECKPOINTING=1` | Not set |

### Enable Check Function

```javascript
function isFileCheckpointingEnabled() {
    if (isSDKMode()) {
        // SDK mode: opt-in via env var
        return parseBoolean(process.env.CLAUDE_CODE_ENABLE_SDK_FILE_CHECKPOINTING)
            && !parseBoolean(process.env.CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING);
    }
    // Interactive mode: opt-out via settings or env
    return getUserSettings().fileCheckpointingEnabled !== false
        && !parseBoolean(process.env.CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING);
}
```

### Why Different Defaults

**Interactive CLI (opt-out):**
- Users expect safety net by default
- May not have external version control
- Better UX for experimentation

**SDK/Embedded (opt-in):**
- SDK users often have their own VCS
- Checkpointing adds I/O overhead
- Less surprising for automated systems

---

## Core Algorithms

### 1. Multi-Tier File Comparison

When checking if a file needs restoration:

| Tier | Check | Cost | Purpose |
|------|-------|------|---------|
| 1 | Existence | O(1) | Quick eliminate deleted/created |
| 2 | XOR existence | O(1) | Handle creation/deletion edges |
| 3 | Mode (permissions) | O(1) | Fast path for changed perms |
| 4 | Size | O(1) | Fast path for changed size |
| 5 | mtime comparison | O(1) | **Key optimization**: skip content read |
| 6 | Content comparison | O(n) | Slow path, only when necessary |

**mtime Optimization:**
```javascript
if (currentStats.mtimeMs < backupStats.mtimeMs) return false;
```
If current file is older than backup, it hasn't been modified since backup was created → no restore needed.

### 2. Diff Stats Computation

For the UI preview showing "+N -M lines changed":

```javascript
// Uses Myers diff algorithm (O(ND) where N=lines, D=differences)
let diff = computeDiff(currentContent, backupContent);
diff.forEach((change) => {
    if (change.added) insertions += change.count;
    if (change.removed) deletions += change.count;
});
```

### 3. Fast-Path Restore

Skip the options menu when:
- No code changes exist
- Only trivial messages follow the selected message

Trivial messages:
- `progress` (loading indicators)
- `system` (system messages)
- `attachment` (file attachments)
- Meta `user` messages
- Empty `assistant` messages

### 4. Snapshot Limit

Maximum 100 snapshots retained in memory:

```javascript
snapshots: allSnapshots.length > MAX_SNAPSHOTS
    ? allSnapshots.slice(-MAX_SNAPSHOTS)
    : allSnapshots
```

This prevents unbounded memory growth in long sessions. Older snapshots are pruned.

---

## UI Flow

### Entry Points

1. **Keyboard:** `Esc` + `Esc` (double escape)
2. **Slash Command:** `/rewind` or `/checkpoint`

### State Machine

```
┌─────────────────┐
│   CLOSED        │
│                 │
│  (initial)      │
└────────┬────────┘
         │ Esc+Esc or /rewind
         ▼
┌─────────────────┐
│  MESSAGE_LIST   │
│                 │
│  • Show prompts │
│  • Navigate     │
│  • Select one   │
└────────┬────────┘
         │ Enter on message
         ▼
┌─────────────────┐     ┌─────────────────┐
│  Fast-path?     │──No─▶│  OPTIONS_MENU   │
│                 │     │                 │
│  (skip menu)    │     │  • Show options │
└────────┬────────┘     │  • Diff preview │
         │              └────────┬────────┘
         │                       │ Select option
         │                       ▼
         │              ┌─────────────────┐
         │              │    LOADING      │
         │              │                 │
         │              │  • Execute      │
         │              │  • Handle err   │
         │              └────────┬────────┘
         │                       │
         └───────────────────────┤
                                 │
                                 ▼
                        ┌─────────────────┐
                        │    CLOSED       │
                        │                 │
                        │  (complete)     │
                        └─────────────────┘
```

### Restore Options

| Option | Code Changes? | Action |
|--------|---------------|--------|
| "Restore code and conversation" | Required | Restore files + slice messages |
| "Restore conversation" | Any | Slice messages only |
| "Restore code" | Required | Restore files only |
| "Summarize from here" | Any | Compact messages from start to selected |
| "Never mind" | Any | Cancel |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `↑` / `k` / `Ctrl+p` | Move up |
| `↓` / `j` / `Ctrl+n` | Move down |
| `Shift+↑` / `Shift+k` | Jump to first |
| `Shift+↓` / `Shift+j` | Jump to last |
| `Enter` | Select |
| `Esc` | Cancel/Back |

---

## Integration Points

### File Tools Integration

| Tool | Integration Point |
|------|-------------------|
| Write | `trackFileEdit` before file creation |
| Edit | `trackFileEdit` before file modification |
| NotebookEdit | `trackFileEdit` before notebook edit |
| MultiEdit | `trackFileEdit` for each file |

### State Management

- Global Zustand store: `state.fileHistory`
- Initialized from JSONL snapshots on resume
- Updated via `updateFileHistoryState` callback

### Persistence

- Backup files: `~/.claude/file-history/{sessionId}/`
- Snapshot records: Session JSONL transcript
- Migration on resume: Copy backups to new session ID

### Keybindings

- Context: `MessageSelector`
- Actions: `messageSelector:up/down/top/bottom/select`

### API Handler

- Request type: `rewind_files`
- Supports dry-run mode for diff preview
- Returns: `{ canRewind, filesChanged, insertions, deletions, error }`

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Rewind module section

### Core Functions (chunks.135.mjs)

- `isFileCheckpointingEnabled` (iz) - Master guard for checkpointing enablement — chunks.135.mjs:1977-1980
- `isSDKCheckpointingEnabled` (YVY) - SDK mode checkpointing logic — chunks.135.mjs:1982-1984
- `trackFileEdit` (R66) - Record file pre-edit backup — chunks.135.mjs:1986-2014
- `createSnapshotForMessage` (lf6) - Finalize snapshot after message — chunks.135.mjs:2016-2073
- `rewindHandler` (sN1) - Execute rewind to message — chunks.135.mjs:2075-2099
- `snapshotExistsForMessage` (tN1) - Check if snapshot exists — chunks.135.mjs:2102-2105
- `getDryRunDiffStats` (eN1) - Get diff stats without modifying — chunks.135.mjs:2107-2112
- `hasCodeChangesToRewind` (Wn4) - Check if files need restore — chunks.135.mjs:2114-2133
- `rewindAndRestoreFiles` (Zn4) - Physical file restoration — chunks.135.mjs:2135-2168
- `fileNeedsRestore` (cu8) - Multi-tier file comparison — chunks.135.mjs:2171-2200
- `calculateFileDiffStats` (Mn4) - Diff stats computation — chunks.135.mjs:2203-2235
- `createBackupFile` (du8) - Create versioned backup — chunks.135.mjs:2247-2272
- `restoreFileFromBackup` (_VY) - Copy backup to original — chunks.135.mjs:2275-2292
- `findBackupInOlderSnapshot` (Gn4) - Fallback backup lookup — chunks.135.mjs:2295-2300
- `normalizeFilePath` (fn4) - Normalize path for tracking — chunks.135.mjs:2303-2308
- `resolveTrackedFilePath` (AV1) - Get absolute path — chunks.135.mjs:2310-2313
- `hydrateFileHistoryFromSnapshots` (qV1) - Reconstruct state from JSONL — chunks.135.mjs:2315-2335
- `migrateFileHistoryToNewSession` (KV1) - Copy backups on resume — chunks.135.mjs:2337-2389

### UI Components (chunks.185.mjs)

- `RewindMessageSelector` (zs8) - Main React component — chunks.185.mjs:1179-1469
- `generateRestoreOptions` (g) - Build option list (nested in zs8) — chunks.185.mjs:1207-1235
- `handleMessageSelection` (b) - Process message selection (nested) — chunks.185.mjs:1248-1268
- `handleRestoreOptionSelected` (p) - Dispatch restore action (nested) — chunks.185.mjs:1269-1312
- `DiffStatsPreview` (qXz) - Display diff stats for restore — chunks.185.mjs:1471-1518
- `getMessagesDiffStats` (KXz) - Compute diff between messages — chunks.185.mjs:1659-1690
- `isSelectableMessage` (XV6) - Filter for rewindable messages — chunks.185.mjs:1692-1702
- `isOnlyOneMessageAfterIndex` (YI1) - Fast-path check — chunks.185.mjs:1704-1724

### Helper Functions (chunks.173.mjs)

- `isEmptyMessage` (Hz6) - Check if message is empty — chunks.173.mjs:1275-1277
- `isToolUseMessage` (wl6) - Check if message is tool_result — chunks.173.mjs:1587-1589
- `createUserMessage` (p1) - Create user message object — chunks.173.mjs:1378+

### Constants

- `MAX_SNAPSHOTS` (Jn4) = 100 — chunks.135.mjs:2423
- `VISIBLE_MESSAGE_COUNT` (Ys8) = 7 — chunks.185.mjs:1730

### Slash Command (chunks.165.mjs)

- `rewindCommandDefinition` (_Az) - Command registration — chunks.165.mjs:699-710
- `rewindCommandHandler` (zAz) - Command handler — chunks.165.mjs:687-691

### API Handler (chunks.187.mjs)

- `handleRewindRequest` (thq) - SDK/CLI API endpoint — chunks.187.mjs:1271-1303

### Persistence (chunks.174.mjs)

- `recordFileHistorySnapshot` (_l6) - Persist snapshot to JSONL — chunks.174.mjs:1683-1685

### Keybindings (chunks.89.mjs)

- MessageSelector context bindings — chunks.89.mjs:2749-2763

---

## Cross-Module Integration

### System Reminder Integration (Module 04)

The rewind UI uses the system reminder infrastructure for creating placeholder messages:

- `createUserMessage` (p1) - Creates the "current prompt" placeholder message in the selector
- `isMeta` flag - Ensures internal messages are filtered from UI display
- Messages created with `isMeta: true` are visible to the LLM but hidden from the chat UI

**Integration pattern:**
```javascript
// In RewindMessageSelector - creating current prompt placeholder
let selectableMessages = [
    ...messages.filter(isSelectableMessage),
    {
        ...createUserMessage({ content: "" }),  // Uses p1 function
        uuid: currentPromptUuid
    }
];
```

### Compact/Summarization Integration (Module 07)

The "Summarize from here" option integrates with the compact pipeline:

- `performPartialCompaction` (Wqq) - Main entry for summarization
- `attachPreservedSegment` (Yp8) - Creates compact_boundary marker
- Summary messages replace selected messages, preserving context

### State Management Integration (Module 15)

- Global Zustand store: `state.fileHistory`
- State updates via `updateFileHistoryState` callback
- `snapshotSequence` used for React reconciliation

### Keybinding Integration (Module 32)

MessageSelector context bindings (chunks.89.mjs:2749-2763):
- `up/k/ctrl+p` → `messageSelector:up`
- `down/j/ctrl+n` → `messageSelector:down`
- `shift+up/shift+k/ctrl+up/meta+up` → `messageSelector:top`
- `shift+down/shift+j/ctrl+down/meta+down` → `messageSelector:bottom`
- `enter` → `messageSelector:select`

---

## Documentation Links

- [implementation.md](./implementation.md) - Complete code analysis with dual-version format
- [ui_linkage.md](./ui_linkage.md) - UI components, keyboard navigation, state management
- [integration_points.md](./integration_points.md) - Integration with file tools, state, persistence, API

---

## Version History

| Version | Changes |
|---------|---------|
| v2.1.76 | Verified symbol mappings, added cross-module integration documentation |