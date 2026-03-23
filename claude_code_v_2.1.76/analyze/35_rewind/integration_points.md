# Integration Points - Rewind / Checkpointing (Module 35)

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Rewind module section
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Persistence

Key integration functions in this document:
- `trackFileEdit` (R66) - Called by file tools before modification
- `recordFileHistorySnapshot` (_l6) - Persist to JSONL
- `migrateFileHistoryToNewSession` (KV1) - Copy backups on resume
- `hydrateFileHistoryFromSnapshots` (qV1) - Reconstruct state on load

---

## Table of Contents

1. [Overview](#1-overview)
2. [File Tools Integration](#2-file-tools-integration)
3. [State Management Integration](#3-state-management-integration)
4. [Persistence Layer](#4-persistence-layer)
5. [Session Resumption](#5-session-resumption)
6. [System Reminder Integration](#6-system-reminder-integration)
7. [Keybinding Integration](#7-keybinding-integration)
8. [API Handler Integration](#8-api-handler-integration)
9. [Summarization Pipeline Integration](#9-summarization-pipeline-integration)

---

## 1. Overview

The rewind/checkpoint feature integrates with multiple Claude Code subsystems:

```
                    ┌─────────────────────────────────────┐
                    │         Rewind / Checkpoint          │
                    └─────────────────────────────────────┘
                                     │
          ┌──────────────────────────┼──────────────────────────┐
          │                          │                          │
          ▼                          ▼                          ▼
   ┌─────────────┐           ┌─────────────┐           ┌─────────────┐
   │ File Tools  │           │   State     │           │ Persistence │
   │ (Write/Edit)│           │ Management  │           │   (JSONL)   │
   └─────────────┘           └─────────────┘           └─────────────┘
          │                          │                          │
          │                          │                          │
          ▼                          ▼                          ▼
   trackFileEdit()           updateFileHistoryState()   recordFileHistorySnapshot()
   (R66)                     (callback)                 (_l6)
```

---

## 2. File Tools Integration

The `trackFileEdit` (R66) function is called by file modification tools **before** they write to disk. This ensures the original content is captured for potential restoration.

### Write Tool Integration

**Location:** chunks.139.mjs:175-180

```javascript
// ============================================
// Write tool - trackFileEdit integration
// Location: chunks.139.mjs:175-180
// ============================================

// In Write tool's call function:
async call({
    file_path: A,
    content: q
}, {
    readFileState: K,
    updateFileHistoryState: Y,  // <-- Passed in context
    dynamicSkillDirTriggers: z
}, _, w) {
    // ... validation logic ...

    // Checkpoint the file BEFORE writing
    if (iz()) await R66(Y, O, w.uuid);

    // Now write the file
    let P = M?.lineEndings ?? await ra4();
    H.mkdirSync($), l66(O, q, D, P);

    // ... rest of write logic ...
}
```

### Edit Tool Integration

**Location:** chunks.170.mjs:1347-1352

```javascript
// ============================================
// Edit tool - trackFileEdit integration
// Location: chunks.170.mjs:1347-1352
// ============================================

// In Edit tool's call function:
async call({
    file_path: A,
    old_string: q,
    new_string: K,
    replace_all: Y
}, {
    readFileState: z,
    updateFileHistoryState: _,  // <-- Passed in context
    readFileCache: w
}, O, $) {
    // ... validation and content loading ...

    // Checkpoint the file BEFORE editing
    if (iz()) await R66(_, M, w.uuid);

    // Now apply the edit
    let G = sq6(X, $) || $,
        f = hD6($, G, H),
        { patch: v, updatedFile: N } = ...;

    // ... rest of edit logic ...
}
```

### NotebookEdit Tool Integration

**Location:** chunks.139.mjs:1355-1360

```javascript
// ============================================
// NotebookEdit tool - trackFileEdit integration
// Location: chunks.139.mjs:1355-1360
// ============================================

async call({
    notebook_path: A,
    new_source: q,
    cell_id: K,
    cell_type: Y,
    edit_mode: z
}, {
    updateFileHistoryState: _  // <-- Passed in context
}, w, O) {
    let $ = fs4(A) ? A : Ts4(G1(), A);

    // Checkpoint the notebook BEFORE editing
    if (iz()) await R66(_, $, O.uuid);

    // ... rest of notebook edit logic ...
}
```

### MultiEdit Tool Integration

**Location:** chunks.171.mjs:2131-2136

```javascript
// ============================================
// MultiEdit tool - trackFileEdit integration
// Location: chunks.171.mjs:2131-2136
// ============================================

// In MultiEdit, trackFileEdit is called with optional message context
if (iz() && K) await R66(q.updateFileHistoryState, _, K.uuid);
```

### Context Parameter

The `updateFileHistoryState` function is passed to tools via the context object:

```javascript
// In REPL component (chunks.196.mjs:599-608)
{
    // ... other context properties ...
    updateFileHistoryState(v7) {
        i((N7) => {
            let cA = v7(N7.fileHistory);
            if (cA === N7.fileHistory) return N7;  // No change, skip update
            return {
                ...N7,
                fileHistory: cA
            };
        });
    },
    // ... other context properties ...
}
```

---

## 3. State Management Integration

### Global State Structure

The `fileHistory` state is part of the global Zustand store:

```javascript
// Initial state (chunks.150.mjs:1251-1255)
{
    fileHistory: {
        snapshots: [],
        trackedFiles: new Set(),
        snapshotSequence: 0
    },
    // ... other state ...
}
```

### State Initialization from Snapshots

**Location:** chunks.196.mjs:328-331

```javascript
// ============================================
// JBq - Initialize fileHistory from snapshots
// Location: chunks.196.mjs:328-331
// ============================================

// Called during REPL initialization
JBq(initialFileHistorySnapshots, setState, (snapshot) => setState((state) => ({
    ...state,
    fileHistory: snapshot
})));
```

The `JBq` function (name from cli.chunks.mjs exports) initializes fileHistory by:
1. Calling `qV1` (hydrateFileHistoryFromSnapshots) with saved snapshots
2. Setting up the state subscription

### State Update Pattern

```javascript
// Standard update pattern
updateFileHistoryState((currentState) => {
    // Return new state (immutable update)
    return {
        ...currentState,
        snapshots: [...currentState.snapshots, newSnapshot],
        trackedFiles: new Set([...currentState.trackedFiles, newPath])
    };
});
```

### State Access in Components

```javascript
// Using Zustand selector in RewindMessageSelector
let fileHistory = useSelector((state) => state.fileHistory);
```

---

## 4. Persistence Layer

### JSONL Storage Format

Snapshots are persisted to the session's JSONL transcript file:

```
~/.claude/projects/{project-hash}/{session-id}.jsonl
```

Each snapshot is recorded as a JSONL line:

```json
{"type":"file-history-snapshot","data":{"messageId":"uuid-here","trackedFileBackups":{...},"timestamp":"2024-..."}}
```

### recordFileHistorySnapshot (_l6)

**Location:** Referenced in cli.chunks.mjs:7524

```javascript
// ============================================
// recordFileHistorySnapshot - Persist snapshot to JSONL
// Location: cli.chunks.mjs:7524 (export reference)
// ============================================

// Called in two scenarios:
// 1. trackFileEdit - with isPartialUpdate=true
// 2. createSnapshotForMessage - with isPartialUpdate=false

await recordFileHistorySnapshot(messageId, snapshot, isPartialUpdate);
```

**Implementation flow:**
1. Get SessionDatabase singleton via `Jz` (getSessionDatabase)
2. Append snapshot record to JSONL
3. Fire-and-forget (errors logged but don't fail operations)

### SessionDatabase Integration

The SessionDatabase (`Jz`) handles:
- JSONL file management
- Append-only writes
- Recovery after crashes

---

## 5. Session Resumption

### Resume Flow

When a session is resumed with `--resume`:

```
1. Load session JSONL
       │
       ▼
2. Parse messages and snapshots
       │
       ▼
3. co6() - hydrate fileHistory from snapshots
       │
       ▼
4. KV1() - migrate backups to new session ID
       │
       ▼
5. Continue session
```

### hydrateFileHistoryFromSnapshots (qV1)

**Location:** chunks.135.mjs:2315-2335

```javascript
// ============================================
// hydrateFileHistoryFromSnapshots - Reconstruct state from JSONL
// Location: chunks.135.mjs:2315-2335
// ============================================

// Called during session restore
function qV1(savedSnapshots, setState) {
    if (!iz()) return;

    let snapshots = [];
    let trackedFiles = new Set();

    for (let snapshot of savedSnapshots) {
        let normalizedBackups = {};

        // Normalize paths (may have changed working directory)
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

    setState({
        snapshots,
        trackedFiles,
        snapshotSequence: snapshots.length
    });
}
```

### migrateFileHistoryToNewSession (KV1)

**Location:** chunks.135.mjs:2337-2389

```javascript
// ============================================
// migrateFileHistoryToNewSession - Copy backups to new session
// Location: chunks.135.mjs:2337-2389
// ============================================

// Called after loading session on resume
async function KV1(sessionData) {
    if (!iz()) return;

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

        // Process each snapshot - copy backup files
        await Promise.allSettled(snapshots.map(async (snapshot) => {
            let backupsWithFiles = Object.values(snapshot.trackedFileBackups)
                .filter((backup) => backup.backupFileName !== null);

            await Promise.allSettled(backupsWithFiles.map(async ({ backupFileName }) => {
                let oldPath = resolveBackupPath(backupFileName, previousSessionId);
                let newPath = path.join(newSessionDir, backupFileName);

                try {
                    // Try hard link first (faster, saves space)
                    await fs.promises.link(oldPath, newPath);
                } catch (err) {
                    if (err.code === "EEXIST") return;  // Already exists

                    if (err.code === "ENOENT") {
                        throw Error(`Backup file not found: ${backupFileName}`);
                    }

                    // Hard link failed, try copy
                    await fs.promises.copyFile(oldPath, newPath);
                }

                log(`FileHistory: Copied backup ${backupFileName} from session ${previousSessionId}`);
            }));
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
```

**Why session migration is needed:**
- Each session has its own backup directory: `~/.claude/file-history/{sessionId}/`
- When resuming, a new sessionId is generated
- Old backups must be copied/linked to the new session directory
- This ensures rewind can still access the original file states

---

## 6. System Reminder Integration

### Message Creation for Rewind UI

The rewind UI uses `p1` (createUserMessage) to create a virtual "current prompt" placeholder:

```javascript
// In RewindMessageSelector (chunks.185.mjs:1191-1196)
let selectableMessages = useMemo(() => [
    ...messages.filter(isSelectableMessage),
    {
        ...p1({ content: "" }),  // Create user message object
        uuid: currentPromptUuid
    }
], [messages, currentPromptUuid]);
```

### p1 - createUserMessage

**Location:** chunks.173.mjs:1378-1412

```javascript
// ============================================
// createUserMessage - Create user message object
// Location: chunks.173.mjs:1378-1412
// ============================================

function p1({
    content,
    isMeta = false,
    isCompactSummary = false,
    isVisibleInTranscriptOnly = false
}) {
    return {
        type: "user",
        message: {
            role: "user",
            content: content
        },
        uuid: SE(),  // generateUUID
        timestamp: new Date().toISOString(),
        isMeta,
        isCompactSummary,
        isVisibleInTranscriptOnly
    };
}
```

### Summarization Boundary Marker

When "Summarize from here" is selected, a boundary marker is created:

```javascript
// In performPartialCompaction (chunks.147.mjs)
return {
    boundaryMarker: Yp8(targetMessage, summaryMessage.uuid, messagesToKeep),
    summaryMessages: [summaryMessage],
    attachments: [...],
    // ...
};
```

The `Yp8` (attachPreservedSegment) function creates a `compact_boundary` system message that links the summarized segment to the original messages.

---

## 7. Keybinding Integration

### Keybinding Context

The rewind UI registers its own keybinding context:

```javascript
// In RewindMessageSelector (chunks.185.mjs:1329-1341)
tA({
    "messageSelector:up": moveUp,
    "messageSelector:down": moveDown,
    "messageSelector:top": jumpToTop,
    "messageSelector:bottom": jumpToBottom,
    "messageSelector:select": selectHighlighted
}, {
    context: "MessageSelector",
    isActive: !isLoading && !error && !selectedMessage && canRewind
});
```

### Keybinding Definitions

**Location:** chunks.89.mjs:2744-2763

```javascript
// Keybinding definitions for MessageSelector context
{
    context: "MessageSelector",
    bindings: {
        up: "messageSelector:up",
        down: "messageSelector:down",
        k: "messageSelector:up",        // Vim-style
        j: "messageSelector:down",      // Vim-style
        "ctrl+p": "messageSelector:up", // Emacs-style
        "ctrl+n": "messageSelector:down",
        "ctrl+up": "messageSelector:top",
        "shift+up": "messageSelector:top",
        "meta+up": "messageSelector:top",
        "shift+k": "messageSelector:top",
        "ctrl+down": "messageSelector:bottom",
        "shift+down": "messageSelector:bottom",
        "meta+down": "messageSelector:bottom",
        "shift+j": "messageSelector:bottom",
        enter: "messageSelector:select"
    }
}
```

### Cancel Handler

The `confirm:no` action (Esc key) is registered to close the UI:

```javascript
D8("confirm:no", handleCancel, {
    context: "Confirmation",
    isActive: !selectedMessage
});
```

---

## 8. API Handler Integration

### handleRewindRequest (thq)

**Location:** chunks.187.mjs:1271-1303

```javascript
// ============================================
// handleRewindRequest - API endpoint for SDK/CLI rewind requests
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
async function handleRewindRequest(userMessageId, appState, setState, dryRun) {
    // Check if checkpointing is enabled
    if (!isFileCheckpointingEnabled()) {
        return {
            canRewind: false,
            error: "File rewinding is not enabled."
        };
    }

    // Check if snapshot exists for this message
    if (!snapshotExistsForMessage(appState.fileHistory, userMessageId)) {
        return {
            canRewind: false,
            error: "No file checkpoint found for this message."
        };
    }

    // Dry run mode: return diff stats without modifying files
    if (dryRun) {
        let diffStats = getDryRunDiffStats(appState.fileHistory, userMessageId);
        return {
            canRewind: true,
            filesChanged: diffStats?.filesChanged,
            insertions: diffStats?.insertions,
            deletions: diffStats?.deletions
        };
    }

    // Execute rewind
    try {
        await rewindHandler((updater) => setState((state) => ({
            ...state,
            fileHistory: updater(state.fileHistory)
        })), userMessageId);
    } catch (err) {
        return {
            canRewind: false,
            error: `Failed to rewind: ${err.message}`
        };
    }

    return { canRewind: true };
}

// Mapping: thq→handleRewindRequest, A→userMessageId, q→appState,
//          K→setState, Y→dryRun, iz→isFileCheckpointingEnabled,
//          tN1→snapshotExistsForMessage, eN1→getDryRunDiffStats, sN1→rewindHandler
```

### API Message Type

The API handler is triggered by `rewind_files` subtype:

```javascript
// In API request handler (chunks.187.mjs:735-739)
else if (request.request.subtype === "rewind_files") {
    let result = await handleRewindRequest(
        request.request.user_message_id,
        getAppState(),
        setState,
        request.request.dry_run ?? false
    );
    if (result.canRewind || request.request.dry_run) {
        sendSuccess(request, result);
    } else {
        sendError(request, result.error ?? "Unexpected error");
    }
}
```

---

## 9. Summarization Pipeline Integration

The "Summarize from here" option in the rewind UI integrates with the compact/summarization pipeline.

### performPartialCompaction (Wqq)

**Location:** chunks.147.mjs:1610-1707

When "Summarize from here" is selected:

```javascript
// In handleRestoreOptionSelected (chunks.185.mjs:1280-1289)
if (option === "summarize") {
    onPreRestore();
    setIsLoading(true);
    setOperationType("summarize");
    setError(undefined);

    try {
        let context = summarizeContext.trim() || undefined;
        await onSummarize(selectedMessage, context);
        // ...
    } catch (err) {
        // ...
    }
}
```

The `onSummarize` callback is implemented in the REPL component:

```javascript
// In REPL (chunks.196.mjs:1721-1750)
onSummarize: async (message, context) => {
    let messageIndex = messages.indexOf(message);
    if (messageIndex === -1) return;

    let abortController = new AbortController();
    let tempState = createTempState(messages, [], abortController, model);

    let result = await performPartialCompaction(
        tempState.options.tools,
        tempState.options.mainLoopModel,
        // ... other params
    );

    // Apply the compaction result
    // - Insert summary message
    // - Remove summarized messages
    // - Add boundary marker
}
```

### Shared Functions with /compact

The summarization pipeline is shared between:
- `/rewind → Summarize from here`
- `/compact` command

Key shared functions:
- `Wqq` (performPartialCompaction) - Main entry point
- `Gqq` (generateSummaryWithLLM) - LLM call for summarization
- `Yp8` (attachPreservedSegment) - Create boundary marker
- `sT6` (runPreCompactHooks) - Execute hooks before
- `FE1` (runPostCompactHooks) - Execute hooks after

---

## 10. System Reminder Integration (Module 04)

The rewind system integrates with the system reminder infrastructure for creating placeholder messages.

### createUserMessage (p1) Integration

**Location:** chunks.173.mjs:1378+

The rewind UI uses `createUserMessage` to create the "current prompt" placeholder that appears at the bottom of the message selector:

```javascript
// ============================================
// createUserMessage - Create placeholder message for rewind UI
// Location: chunks.185.mjs:1191-1196 (usage)
// ============================================

// In RewindMessageSelector:
let selectableMessages = useMemo(() => [
    ...messages.filter(isSelectableMessage),
    {
        ...p1({ content: "" }),  // Create empty user message
        uuid: currentPromptUuid   // Override with stable UUID
    }
], [messages, currentPromptUuid]);
```

**What it does:** Creates a synthetic user message object that represents "the current prompt" position in the rewind selector.

### isMeta Flag Integration

The `isMeta` flag from the system reminder system is used throughout the rewind UI:

1. **Filtering in `isSelectableMessage`**:
   ```javascript
   if (A.isMeta) return false;  // Exclude meta messages from selector
   ```

2. **Filtering in `isOnlyOneMessageAfterIndex`**:
   ```javascript
   if (Y.type === "user" && Y.isMeta) continue;  // Skip meta user messages
   ```

**Why this matters:**
- Meta messages are internal system reminders (hooks output, system notifications)
- They should not be selectable for rewind (they're not user prompts)
- The isMeta flag ensures they're filtered from both the UI and the fast-path check

### Message Structure Integration

The rewind UI relies on the standard message structure from the system reminder module:

```typescript
interface TenguMessage {
    type: "user" | "assistant" | "system" | "progress" | "attachment";
    message: {
        role: "user" | "assistant";
        content: string | ContentBlock[];
    };
    uuid: string;
    timestamp: string;
    isMeta?: boolean;              // From system reminder module
    isCompactSummary?: boolean;    // From compact module
    toolUseResult?: ToolResult;    // From tool execution
    // ... other optional fields
}
```

### Cross-Module Dependency

```
┌─────────────────┐
│  System         │
│  Reminder       │───────► p1 (createUserMessage)
│  (Module 04)    │───────► isMeta flag pattern
│                 │───────► Message structure
└─────────────────┘
         │
         │ used by
         ▼
┌─────────────────┐
│  Rewind UI      │
│  (Module 35)    │
│                 │
│  • RewindMessageSelector
│  • isSelectableMessage
│  • isOnlyOneMessageAfterIndex
└─────────────────┘
```

---

## Summary: Integration Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         REWIND INTEGRATION ARCHITECTURE                      │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │   User Input    │
                              │ /rewind or Esc+Esc│
                              └────────┬────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         │                             │                             │
         ▼                             ▼                             ▼
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Slash Command │         │   Keybinding    │         │    API/SDK      │
│   (chunks.165)  │         │   (chunks.89)   │         │   (chunks.187)  │
│                 │         │                 │         │                 │
│   zAz handler   │         │ MessageSelector │         │ thq handler     │
│   calls         │         │ context         │         │ handles         │
│   openMessage-  │         │                 │         │ rewind_files    │
│   Selector()    │         │                 │         │ subtype         │
└────────┬────────┘         └────────┬────────┘         └────────┬────────┘
         │                             │                             │
         └─────────────────────────────┼─────────────────────────────┘
                                       │
                                       ▼
                         ┌─────────────────────────┐
                         │   RewindMessageSelector │
                         │      (chunks.185)       │
                         │                         │
                         │  • Message list         │
                         │  • Restore options      │
                         │  • Diff stats preview   │
                         └────────────┬────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              │                       │                       │
              ▼                       ▼                       ▼
   ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
   │  Restore Code    │    │ Restore Conv.    │    │   Summarize      │
   │                  │    │                  │    │                  │
   │  sN1 → Zn4       │    │  Slice messages  │    │  Wqq (compact)   │
   │  (file restore)  │    │  in state        │    │  pipeline        │
   └────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘
            │                       │                       │
            │                       │                       │
            ▼                       ▼                       ▼
   ┌─────────────────────────────────────────────────────────────────┐
   │                        FILE HISTORY SYSTEM                       │
   │                        (chunks.135)                              │
   │                                                                  │
   │   ┌──────────────────────────────────────────────────────────┐  │
   │   │  trackFileEdit (R66)                                      │  │
   │   │  • Called by Write, Edit, NotebookEdit tools             │  │
   │   │  • Creates backup before modification                     │  │
   │   └──────────────────────────────────────────────────────────┘  │
   │                              │                                   │
   │                              ▼                                   │
   │   ┌──────────────────────────────────────────────────────────┐  │
   │   │  createSnapshotForMessage (lf6)                          │  │
   │   │  • Called when message completes                         │  │
   │   │  • Creates snapshot for all tracked files                │  │
   │   └──────────────────────────────────────────────────────────┘  │
   │                              │                                   │
   │                              ▼                                   │
   │   ┌──────────────────────────────────────────────────────────┐  │
   │   │  rewindHandler (sN1) → rewindAndRestoreFiles (Zn4)       │  │
   │   │  • Restore files from backup                             │  │
   │   │  • Uses fileNeedsRestore (cu8) for comparison            │  │
   │   └──────────────────────────────────────────────────────────┘  │
   │                                                                  │
   └──────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
   ┌──────────────────────────────────────────────────────────────────┐
   │                      PERSISTENCE LAYER                           │
   │                                                                  │
   │   ~/.claude/                                                     │
   │   ├── file-history/{sessionId}/                                 │
   │   │   ├── a1b2c3d4e5f6a7b8@v1   (backup file)                  │
   │   │   └── ...                                                    │
   │   └── projects/{hash}/{sessionId}.jsonl                         │
   │       └── file-history-snapshot entries                         │
   │                                                                  │
   │   Functions: _l6 (record), qV1 (hydrate), KV1 (migrate)         │
   └──────────────────────────────────────────────────────────────────┘
```

---

## Version History

| Version | Changes |
|---------|---------|
| v2.1.76 | Added System Reminder integration section; Verified all symbol mappings; Updated diagram |