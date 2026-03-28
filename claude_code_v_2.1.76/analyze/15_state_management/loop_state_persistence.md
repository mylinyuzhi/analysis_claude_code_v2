# Agent Loop State Persistence Deep Analysis

> Source-level reverse engineering of what intermediate state the agent loop persists during execution, how it persists, and what can be recovered on resume vs lost on crash.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `mainAgentLoop` (ZR) - Agent loop entry point (chunks.149.mjs)
- `persistMainThreadMessages` (_F) - UUID-deduplicated message persistence
- `insertMessageChain` (ITq method) - Core JSONL write method
- `updateFileHistoryState` - File edit backup trigger in session orchestrator
- `buildToolUseContext` (OW) - Context factory that wires persistence callbacks
- `StreamingToolExecutor` (ui6) - Parallel tool execution during streaming
- `enqueueWrite` / `drainWriteQueue` - Batched write pipeline

Cross-module references:
- [03_llm_core/agent_loop.md](../03_llm_core/agent_loop.md) - Agent loop execution flow
- [03_llm_core/stream_processing.md](../03_llm_core/stream_processing.md) - SSE streaming
- [session_persistence.md](./session_persistence.md) - JSONL write batching system
- [resume_flow.md](./resume_flow.md) - What state is restored on resume

---

## Architecture Overview: The Persistence Timeline

The agent loop generates state at multiple points during execution. Not all state is persisted at the same time or through the same mechanism. Understanding the timeline is critical for knowing what survives a crash vs what's lost.

```
User Input
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1: Pre-Query Setup                                        │
│  ─────────────────────────                                       │
│  • Content replacements discovered (persisted immediately)       │
│  • System prompt assembled (not persisted)                       │
│  • User message appended to messages[] (in-memory only)          │
│  • User message written to JSONL via insertMessageChain          │
│                                                        ▲ SAFE    │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 2: LLM Streaming                                         │
│  ───────────────────────                                         │
│  • SSE events arrive: content_block_start/delta/stop             │
│  • contentBlocks[] accumulated in memory                         │
│  • Thinking blocks accumulated (if enabled)                      │
│  • tool_use blocks detected during streaming                     │
│  • NOTHING persisted until message_stop event                    │
│                                                        ▼ UNSAFE  │
│  ⚠ CRASH HERE = assistant response LOST entirely                 │
└──────────────────────────────┬──────────────────────────────────┘
                               │ message_stop event
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 3: Assistant Message Assembly                             │
│  ───────────────────────────────                                 │
│  • contentBlocks[] → assistant message object                    │
│  • Message appended to messages[] (in-memory)                    │
│  • Message written to JSONL via insertMessageChain               │
│  • contentBlocks[] cleared (v2.1.76 memory leak fix)            │
│                                                        ▲ SAFE    │
└──────────────────────────────┬──────────────────────────────────┘
                               │ if tool_use blocks present
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 4: Tool Execution (parallel or sequential)                │
│  ────────────────────────────────────────────                    │
│  For each tool_use block:                                        │
│  • PRE-EDIT: file-history-snapshot created (Write/Edit tools)    │
│  • Tool executes (may modify filesystem)                         │
│  • readFileState updated (Read tool)                             │
│  • Tool result generated                                         │
│  • tool_result message appended to messages[]                    │
│                                                                  │
│  ⚠ CRASH DURING TOOL = partial execution, some files changed    │
│     but assistant message already saved → "interrupted_turn"      │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 5: Post-Tool Persistence                                  │
│  ──────────────────────────────                                  │
│  • All tool_result messages written to JSONL (batch)             │
│  • file-history-snapshot entries written to JSONL                │
│  • attribution-snapshot written (if applicable)                  │
│  • Updated messages[] available for next turn                    │
│                                                        ▲ SAFE    │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 6: Loop Continuation or Exit                              │
│  ──────────────────────────────                                  │
│  • If more tool_use in response → GOTO PHASE 2 (next turn)      │
│  • If no tool_use → exit loop                                    │
│  • onTurnComplete callback fires (not a persistence mechanism)   │
│  • Session metadata re-appended on exit handler                  │
│                                                        ▲ SAFE    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Persistence Point 1: Message Persistence (`_F` / `persistMainThreadMessages`)

### When Messages Are Written

Messages are persisted via `_F` which calls `insertMessageChain` on the `SessionPersistence` singleton. This function uses **UUID-based deduplication** — it maintains a `Set<UUID>` of already-written message UUIDs and only writes new ones.

**Trigger points:**

| Trigger | File:Line | When |
|---------|-----------|------|
| React useEffect on messages change | chunks.187.mjs:2137 | Every time messages[] state updates |
| SDK stream handler | chunks.185.mjs:1883 | After each SDK message batch |
| SDK turn complete | chunks.185.mjs:1997 | At end of each turn |
| SDK error recovery | chunks.185.mjs:2043 | After error handling |

```javascript
// ============================================
// persistMainThreadMessages - UUID-deduplicated message writer
// Location: chunks.174.mjs:1656-1669
// ============================================

// READABLE (for understanding):
function persistMainThreadMessages(messages) {
    let persistence = getSessionPersistence();
    let newMessages = [];

    for (let msg of messages) {
        if (!msg.uuid) continue;
        if (alreadyWrittenUuids.has(msg.uuid)) continue;
        alreadyWrittenUuids.add(msg.uuid);
        newMessages.push(msg);
    }

    if (newMessages.length > 0) {
        persistence.insertMessageChain(newMessages, false, null, getLastWrittenParentUuid());
        lastWrittenParentUuid = newMessages[newMessages.length - 1].uuid;
    }
}

// Mapping: _F→persistMainThreadMessages
```

**Key insight:** Messages are persisted **incrementally** — each time the messages array changes, only new (not-yet-written) messages are appended to the JSONL file. The UUID set prevents double-writes even if the same message appears in multiple persistence triggers.

### The 100ms Write Batching Window

All message writes go through the `SessionPersistence` write queue:

```
insertMessageChain → appendEntry → enqueueWrite → scheduleDrain (100ms) → drainWriteQueue → appendFile
```

This means there is always a **≤100ms window** where messages exist in memory but not on disk. The `CLAUDE_CODE_EAGER_FLUSH` environment variable can force immediate drains to minimize this window.

### What Survives a Crash

| Crash Point | User Message | Assistant Response | Tool Results |
|-------------|-------------|-------------------|-------------|
| During LLM streaming | ✅ Saved | ❌ Lost | N/A |
| After message_stop, before tool exec | ✅ Saved | ✅ Saved | N/A |
| During tool execution | ✅ Saved | ✅ Saved | ❌ Partial (some may be saved) |
| After tool results, within 100ms batch | ✅ Saved | ✅ Saved | ⚠️ May be in write queue |
| After batch drain | ✅ Saved | ✅ Saved | ✅ Saved |

**Resume behavior after crash:**
- If assistant message was saved with pending tool_use blocks, `detectInterruptionState` (MVY) detects `interrupted_turn` and injects "Continue from where you left off" meta message
- Filesystem may be in partial state (some tool edits applied, others not)
- File history snapshots (if saved) enable rewind to pre-edit state

---

## Persistence Point 2: File History Snapshots

### Pre-Edit Backup Creation

File history snapshots are created **BEFORE** file modifications, not after. This ensures that if a crash occurs during the write, the original file content is preserved.

**Trigger points by tool:**

| Tool | File:Line | Trigger |
|------|-----------|---------|
| WriteTool | chunks.139.mjs:180 | Before `writeFile()` call |
| EditTool | chunks.170.mjs:1352 | Before applying edit patch |
| NotebookEditTool | chunks.139.mjs:1360 | Before notebook cell modification |
| SedTool | chunks.171.mjs:2136 | Before sed-like replacement |

```javascript
// ============================================
// Pre-edit file backup (conceptual, from WriteTool)
// Location: chunks.139.mjs:~180
// ============================================

// READABLE (for understanding):
async function writeToolExecute(filePath, content, toolUseContext) {
    // Step 1: BEFORE writing, backup the existing file
    let existingContent = await readFileIfExists(filePath);
    if (existingContent !== null) {
        await saveFileHistoryEntry(filePath, existingContent, toolUseContext);
    }

    // Step 2: Write the new content
    await writeFile(filePath, content);

    // Step 3: Update readFileState with new content
    toolUseContext.readFileState.set(filePath, {
        content: content,
        timestamp: Date.now()
    });
}
```

### File History → JSONL Persistence

The backup file itself is written to `~/.claude/file-history/{sessionId}/{filename}`. Then a `file-history-snapshot` metadata entry is appended to the JSONL transcript linking the message UUID to the backup file.

```javascript
// ============================================
// updateFileHistoryState - Callback in session orchestrator
// Location: chunks.196.mjs:599-607
// ============================================

// READABLE (for understanding):
function updateFileHistoryState(filePath, backupInfo) {
    // Update React state (for UI display)
    setAppState(state => ({
        ...state,
        fileHistory: {
            ...state.fileHistory,
            snapshots: [...state.fileHistory.snapshots, backupInfo],
            trackedFiles: new Set([...state.fileHistory.trackedFiles, filePath])
        }
    }));

    // Also persist to JSONL as metadata entry
    getSessionPersistence().appendEntry({
        type: "file-history-snapshot",
        snapshot: backupInfo
    }, getSessionId());
}
```

**Key insight:** File history has TWO persistence paths:
1. **Backup file** → `~/.claude/file-history/{sessionId}/` (immediate, synchronous)
2. **Snapshot metadata** → session JSONL (batched, 100ms)

The backup file is always created first (synchronous), so even if the JSONL metadata write is lost in a crash, the backup file exists on disk.

---

## Persistence Point 3: Content Replacements

Content replacements mask large tool results (to reduce token usage in subsequent API calls). They are discovered and persisted at the **START** of each LLM query.

```javascript
// ============================================
// Content replacement discovery and persistence
// Location: chunks.148.mjs:~934 (conceptual)
// ============================================

// READABLE (for understanding):
function discoverContentReplacements(messages, existingReplacements) {
    let newReplacements = [];
    for (let msg of messages) {
        if (msg.type === "user" && msg.toolResultContent) {
            let size = estimateTokens(msg.toolResultContent);
            if (size > REPLACEMENT_THRESHOLD) {
                let hash = hashContent(msg.toolResultContent);
                if (!existingReplacements.has(hash)) {
                    newReplacements.push({
                        hash: hash,
                        originalSize: size,
                        replacementToken: `[content-replaced:${hash}]`
                    });
                }
            }
        }
    }

    // Persist new replacements immediately
    if (newReplacements.length > 0) {
        getSessionPersistence().appendEntry({
            type: "content-replacement",
            replacements: newReplacements
        }, getSessionId());
    }

    return [...existingReplacements, ...newReplacements];
}
```

**Timing:** Content replacements are discovered and persisted **before** the LLM API call is made, not after. This ensures that if the LLM response references a replacement token, the mapping is already on disk.

---

## Persistence Point 4: Attribution Snapshots

Attribution snapshots track which code was written by Claude vs the user. They are persisted via hook callbacks.

```javascript
// ============================================
// Attribution snapshot persistence
// Location: chunks.174.mjs:1536-1539
// ============================================

// READABLE:
function insertAttributionSnapshot(snapshot) {
    getSessionPersistence().appendEntry({
        type: "attribution-snapshot",
        snapshot: snapshot
    }, getSessionId());
}
```

**Trigger:** After tool execution completes, if the tool modified files, an attribution snapshot captures what changed and who changed it.

---

## Persistence Point 5: Context Collapse (Marble-Origami)

Context collapse is an optimization that compresses conversation context without full compaction.

```javascript
// ============================================
// Context collapse persistence
// Location: chunks.174.mjs:1704-1722
// ============================================

// READABLE:
function persistContextCollapseCommit(commit) {
    getSessionPersistence().appendEntry({
        type: "marble-origami-commit",
        commit: commit
    }, getSessionId());
}

function persistContextCollapseSnapshot(snapshot) {
    getSessionPersistence().appendEntry({
        type: "marble-origami-snapshot",
        snapshot: snapshot
    }, getSessionId());
}
```

**Timing:** Context collapse commits are written during compaction. The commit array resets after each `compact_boundary`. The snapshot captures the full collapsed state.

---

## Persistence Point 6: Speculation Acceptance

**This is the ONLY record type that bypasses the write queue.**

```javascript
// ============================================
// Speculation acceptance - Direct appendFile bypass
// Location: chunks.146.mjs:1748-1758
// ============================================

// READABLE:
function acceptSpeculation(specId) {
    let sessionFile = getSessionPersistence().sessionFile;
    if (!sessionFile) return;

    // DIRECT appendFile — bypasses 100ms write queue
    appendFileSync(sessionFile, JSON.stringify({
        type: "speculation-accept",
        specId: specId,
        timestamp: Date.now()
    }) + "\n");
}
```

**Why bypass the queue?** Speculation acceptance must be atomically recorded before the next LLM request uses the speculated result. The 100ms batch delay could cause the LLM to re-compute work that was already speculatively accepted.

---

## Persistence Point 7: Queue Operations

Message queue operations (enqueue, dequeue) are fire-and-forget writes:

```javascript
// ============================================
// Queue operation persistence
// Location: chunks.90.mjs:2775-2787
// ============================================

// READABLE:
function persistQueueOperation(operation, value) {
    getSessionPersistence().appendEntry({
        type: "queue-operation",
        operation: operation,  // "enqueue", "dequeue", "remove", "popAll"
        value: typeof value === "string" ? value : undefined,
        timestamp: Date.now()
    }, getSessionId());
}
```

**Purpose:** Enables resume to reconstruct the message queue state. If a user submitted messages while Claude was processing, those queued messages are preserved.

---

## What Is NOT Persisted (In-Memory Only)

| State | Why Not Persisted | Impact on Resume |
|-------|-------------------|------------------|
| `contentBlocks[]` during streaming | Transient — only exists during SSE processing | ❌ Partial response lost on crash |
| `readFileState` (file content cache) | Files can change on disk between sessions | ✅ Rebuilt by scanning messages on resume |
| `streamingToolUses` | Transient — tool execution tracking | ❌ Lost but detected as interrupted_turn |
| `abortController` | Process-specific | ✅ New one created on resume |
| `toolPermissionContext.decisions` | Security — stale grants should not carry over | ✅ Reset to defaults on resume |
| `queryGuard` (non-reentrant lock) | Process-specific | ✅ New one created on resume |
| `promptCache` | Session-specific optimization | ✅ Rebuilt on first query |
| InternalState metrics (cost, tokens) | Session-scoped cumulative counters | ❌ Lost (reported in telemetry before exit) |

---

## The readFileState Lifecycle

`readFileState` is a critical piece of in-memory state that bridges multiple tools but is NOT persisted to disk:

```
Session Start
  │
  ▼
readFileState = new Map()                        // Empty
  │
  ▼ (Read tool execution)
readFileState.set(filePath, { content, timestamp, offset, limit })  // Populated
  │
  ▼ (Edit tool validation)
if (!readFileState.has(filePath)) → ERROR: "Must read file before editing"
  │
  ▼ (Write tool post-write)
readFileState.set(filePath, { content: newContent, timestamp: now })  // Updated
  │
  ▼ (Compaction)
readFileState = new Map()                        // CLEARED (intentional)
// Why: files may have changed on disk, stale cache = wrong edits
  │
  ▼ (Session resume)
readFileState = new Map()                        // Empty
// Then: updateReadFileState(messages, cwd) scans all messages to rebuild
//       Extracts file content from Read tool results in the transcript
```

**Key algorithm: readFileState reconstruction on resume** (chunks.196.mjs:375-381)

```javascript
// ============================================
// updateReadFileState - Rebuilds file cache from message history
// Location: chunks.196.mjs:375-381
// ============================================

// READABLE:
function updateReadFileState(messages, projectPath) {
    let fileReads = extractFileReadsFromMessages(messages, projectPath);
    readFileStateRef.current = mergeFileReads(readFileStateRef.current, fileReads);
}
```

This scans all messages for Read tool results and populates the cache. The `mergeFileReads` function keeps only the most recent read for each file path.

**Trade-off:** This rebuild is approximate — if a file was read, then written, then read again, only the final read's content is in the cache. Intermediate states are lost. This is acceptable because the Edit tool will re-read the file to validate its `old_string` match.

---

## Crash Recovery Scenarios

### Scenario 1: Crash During LLM Streaming

```
State on disk: User message saved, no assistant message
Resume sees: Last message is user → normal state, Claude re-processes
```

### Scenario 2: Crash After Assistant Message, Before Tool Execution

```
State on disk: User + Assistant messages saved, tool_use blocks present
Resume sees: detectInterruptionState → "interrupted_turn"
             Injects "Continue from where you left off" meta message
             Claude re-executes the tool_use blocks
```

### Scenario 3: Crash During Tool Execution (Partial)

```
State on disk: User + Assistant messages saved
               Some tool results may be saved (depends on timing)
               File-history backups exist for completed edits
               Filesystem in partial state (some edits applied)
Resume sees: If all tool_results saved → normal continuation
             If some missing → "interrupted_turn" for missing results
Risk: Filesystem inconsistency (some files edited, others not)
Mitigation: --rewind-files can restore to pre-edit state
```

### Scenario 4: Crash Within 100ms Write Batch Window

```
State on disk: Messages from previous drain cycle saved
               Current batch (up to 100ms of messages) lost
Resume sees: Depends on what's in the lost batch
             If only tool_results lost → "interrupted_turn"
             If nothing critical lost → normal continuation
Mitigation: CLAUDE_CODE_EAGER_FLUSH=1 forces immediate drains
```

### Scenario 5: Crash During Compaction

```
State on disk: Pre-compaction messages still in file
               Summary entry may or may not be written
               Post-compaction state anchors may not be written
Resume sees: parseTranscriptFile handles incomplete compaction gracefully
             Falls back to pre-compaction messages if summary is missing
```

---

## Integration with Other Modules

### Agent Loop (03_llm_core) → This Document

The agent loop (`mainAgentLoop` / ZR in chunks.149.mjs) does NOT directly call persistence functions. Instead, it:
1. Mutates the `messages` array (in-memory)
2. Calls `toolUseContext.setMessages()` which triggers React state updates
3. React useEffect on messages change triggers `persistMainThreadMessages`

**This is a pull-based persistence model** — the agent loop pushes to memory, and a separate observer pulls changes to disk.

### System Reminders (04_system_reminder) → This Document

System reminders use persisted session metadata (title, tag) to generate context-aware prompts. The `reAppendSessionMetadata` call on exit ensures this data is always at the end of the JSONL file for fast extraction.

### Compaction (07_compact) → This Document

Compaction creates a persistence boundary:
1. Pre-compaction: all messages are in the JSONL file
2. Post-compaction: summary entry + state anchors written
3. Future reads skip pre-compaction messages (optimization)

State anchors persist: files, tasks, todos, plans, skills — everything the LLM needs to continue working after context reduction.

### Background Agents (26_background_agents) → This Document

Background agents write to separate subagent JSONL files (`agent-{id}.jsonl`). Their persistence uses the same `SessionPersistence` write queue but different file paths. On resume, only the main thread transcript is loaded — subagent results are available through integrated messages in the main transcript.
