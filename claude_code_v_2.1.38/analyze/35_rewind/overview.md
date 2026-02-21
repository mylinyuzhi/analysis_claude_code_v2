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
  │  RewindMessageSelector (fMq)             │
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
  kP6 / DF4           onRestoreMessage   Fa4
  (chunks.134.mjs)    (chunks.188.mjs)   (chunks.146.mjs)
```

---

## Three Subsystems

### 1. File History (Checkpoint Storage)

The **file history** subsystem records snapshots of all files that Claude's tools touch. It operates as an event-sourced log of file states keyed to `messageId`.

- **Tracking**: Every file edit goes through `trackFileEdit` (`Xt`, chunks.133.mjs), which immediately creates a version-1 backup and adds the file to the snapshot's `trackedFileBackups`.
- **Snapshots**: When a message completes, `createSnapshotForMessage` (`WW1`, chunks.133.mjs) creates a full snapshot of all tracked files (copying changed ones, noting deleted ones as `null`).
- **Restoration**: `rewindHandler` (`kP6`, chunks.134.mjs) locates the target snapshot and calls `rewindAndRestoreFiles` (`DF4`) to physically restore each file or delete newly-created ones.

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
| `fileCheckpointingEnabled` | global | boolean | Enable file checkpointing for code rewind |

UI display: Settings panel shows "Rewind code (checkpoints)" as the label.

---

## Persistence

Snapshots are persisted across sessions via `persistFileHistoryState` (`PF4`) and optionally synced to remote sessions via `recordFileHistorySnapshot` (`iQ1`). This enables the documented behavior: "Checkpoints persist across sessions, so you can access them in resumed conversations."

Cleanup happens after 30 days (configurable), aligned with session cleanup.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Rewind/Checkpoint section
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI rendering

Key functions in this document:

**Snapshot / File History (chunks.133.mjs, chunks.134.mjs)**
- `trackFileEdit` (Xt) - Record a file edit into the current snapshot
- `createSnapshotForMessage` (WW1) - Finalize snapshot at message boundary
- `rewindHandler` (kP6) - Execute rewind to a target message
- `rewindAndRestoreFiles` (DF4) - Restore all tracked files from snapshot
- `createBackupFile` (TkA) - Write a versioned backup copy of a file
- `fileNeedsRestore` (jF4) - Smart diff check before unnecessary restore
- `restoreFileFromBackup` (vvY) - Copy backup content back to original path
- `calculateFileDiffStats` (OF4) - Compute +/- stats for UI preview
- `findBackupInOlderSnapshot` (EvY) - Fallback to find version-1 backup

**UI (chunks.178.mjs)**
- `RewindMessageSelector` (fMq) - Main React component for the rewind UI
- `calculateFileDiffBetweenMessages` (TJz) - Compute diff stats from message patch data
- `generateRestoreOptions` (g) - Build the restore options list dynamically

**Capability Check (chunks.179.mjs)**
- `checkRewindCapability` (mMq) - Validate and optionally dry-run a rewind

**Callbacks (chunks.188.mjs)**
- `onRestoreCode` - Wires state updater into `rewindHandler`
- `onRestoreMessage` - Slices messages and restores session state
- `onSummarize` - Invokes `Fa4` for targeted summarization

**Slash Command (chunks.165.mjs)**
- `defineRewindCommand` (twq) - Registers `/rewind` (alias: `/checkpoint`)
- `handleRewindCommand` (cqz) - Opens the message selector

**Compaction (chunks.146.mjs)**
- `summarizationEngineFunction` (Fa4) - Shared with `/compact`, does the LLM summarize call

---

## See Also

- [07_compact/](../07_compact/) - Full context compaction (Fa4 is shared)
- [15_state_management/](../15_state_management/) - Session state schema
- [02_ui/](../02_ui/) - Terminal UI rendering pipeline
