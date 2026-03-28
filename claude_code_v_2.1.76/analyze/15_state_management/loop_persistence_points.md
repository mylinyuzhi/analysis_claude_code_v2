# Agent Loop Persistence Points: Complete Trace

> Every intermediate state that gets persisted DURING agent loop execution, enabling session resume. This traces what happens during the loop, not at resume time.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `SessionPersistence` (ITq) - Singleton class managing all JSONL writes
- `insertMessageChain` (ITq.insertMessageChain) - Writes user/assistant/system messages
- `persistMainThreadMessages` (_F) - Deduplicated message persistence wrapper for main thread
- `persistSidechainMessages` (dg) - Writes sidechain/forked agent messages
- `insertFileHistorySnapshot` (_l6) - Writes file-history-snapshot records
- `insertAttributionSnapshot` (izz) - Writes attribution-snapshot records
- `insertContentReplacement` (pz6) - Writes content-replacement records
- `insertQueueOperation` (kV8) - Writes queue-operation records
- `recordContextCollapseCommit` (nzz) - Writes marble-origami-commit records
- `recordContextCollapseSnapshot` (rzz) - Writes marble-origami-snapshot records
- `trackEditForFileHistory` (R66) - Creates pre-edit file backup in file history
- `createMessageSnapshot` (lf6) - Creates per-message file history snapshot
- `flushSessionPersistence` (jF) - Forces immediate drain of write queues
- `contentReplacementApply` (T34) - Applies content replacement, persisting new rules

---

## Overview: The Persistence Architecture

All persistence during the agent loop flows through a single JSONL file located at `~/.claude/projects/<project-hash>/<sessionId>.jsonl`. The `SessionPersistence` singleton (`Jz()`) manages a **buffered write queue** that batches entries and flushes them to disk every **100ms** (or immediately for remote/CCR v2 modes).

### Write Pipeline

```
Tool/Loop generates state change
    |
    v
Persistence wrapper function (_F, dg, _l6, pz6, etc.)
    |
    v
SessionPersistence.insertXxx() -> trackWrite()
    |
    v
appendEntry() -> type-dispatch -> enqueueWrite(file, record)
    |
    v
scheduleDrain() -> setTimeout(100ms) -> drainWriteQueue()
    |
    v
appendToFile() -> fs.appendFile() to JSONL
```

**Key design decision:** Writes are **non-blocking and batched**. The `enqueueWrite` method adds to an in-memory queue, and `scheduleDrain` ensures a single timer drains all queued writes. The `MAX_CHUNK_BYTES` (100MB) prevents any single append from being too large. Within a drain cycle, entries for the same file are concatenated into a single string and written in one `appendFile` call.

---

## 1. Message Persistence During Agent Loop

### 1.1 Main Thread Message Persistence

**Where:** `chunks.187.mjs:2137` (React `useEffect` hook), `chunks.185.mjs:1883,1997,2043` (SDK agent loop)

**What it does:** Every time the messages array changes, a React effect (or SDK loop iteration) calls `_F()` (`persistMainThreadMessages`) to write new messages to the JSONL.

**How it works (the _F function):**

```javascript
// ============================================
// persistMainThreadMessages - Deduplicates and persists new messages
// Location: chunks.174.mjs:1656-1669
// ============================================

// ORIGINAL (for source lookup):
async function _F(A, q, K) {
    let Y = mTq(A), z = R1(), _ = await mN6(z), w = [], O = K, $ = !1;
    for (let j of Y)
        if (_.has(j.uuid)) { if (!$) O = j.uuid }
        else w.push(j), $ = !0;
    if (w.length > 0) await Jz().insertMessageChain(w, !1, void 0, O, q);
    return w[w.length - 1]?.uuid ?? O ?? null
}

// READABLE (for understanding):
async function persistMainThreadMessages(messages, teamInfo, lastParentUuid) {
    let filtered = filterPersistableMessages(messages);
    let sessionId = getSessionId();
    let alreadyWritten = await getWrittenUuidSet(sessionId);
    let newMessages = [], parentUuid = lastParentUuid, foundNew = false;
    for (let msg of filtered)
        if (alreadyWritten.has(msg.uuid)) { if (!foundNew) parentUuid = msg.uuid }
        else newMessages.push(msg), foundNew = true;
    if (newMessages.length > 0)
        await getSessionPersistence().insertMessageChain(newMessages, false, undefined, parentUuid, teamInfo);
    return newMessages[newMessages.length - 1]?.uuid ?? parentUuid ?? null
}

// Mapping: _F->persistMainThreadMessages, A->messages, q->teamInfo, K->lastParentUuid
// mTq->filterPersistableMessages, mN6->getWrittenUuidSet, Jz->getSessionPersistence
```

**Key insight: UUID-based deduplication.** The function maintains a `Set` of already-written UUIDs (`mN6` cache). It scans through messages to find the first new (unseen) message, then writes only from that point forward. This means:
- Re-running persistence on the same message array is safe (idempotent)
- Only truly new messages get appended to the JSONL
- The `parentUuid` chain is maintained so the transcript tree structure is preserved

### 1.2 When Each Message Type Gets Written

**User messages:** Written when the messages array is updated after `KI1` (processUserInput) adds user messages. In the SDK path (`chunks.185.mjs:1883`), this happens right after `this.mutableMessages.push(...H6)` followed by `await _F(z6)`.

**Assistant messages:** Written incrementally as the agent loop yields them. In the SDK path (`chunks.185.mjs:2043`): `z6.push(k6), L) await _F(z6)` -- each yielded assistant/user message triggers a persistence call.

**Compact boundary messages:** Treated like regular messages. When a compaction produces a `compact_boundary` system message, it is pushed to the array and persisted in the same `_F` call.

**Tool use / tool result messages:** These are embedded within assistant (tool_use) and user (tool_result) messages respectively. They are NOT persisted separately -- they are part of the message content arrays. The assistant message containing `tool_use` blocks is yielded and persisted. The user message containing `tool_result` blocks is yielded from tool execution and persisted in the next `_F` call.

### 1.3 Sidechain/Forked Agent Message Persistence

**Where:** `chunks.148.mjs:2055,2081`, `chunks.133.mjs:1739,1778,1965,1983`

**What it does:** Forked agents and background agents write their messages to the same JSONL but marked as `isSidechain: true` with an `agentId`. These go to a separate file path: `L0(X$(agentId))`.

```javascript
// In forked agent execution (chunks.148.mjs:2081):
if (N && (R.type === "assistant" || R.type === "user" || R.type === "progress"))
    await dg([R], N, V).catch(...)
// Each assistant/user/progress message is written immediately
```

**Key insight:** Sidechain messages bypass the UUID deduplication cache because they use `insertMessageChain(..., isSidechain=true)`. They always get written. The `appendEntry` logic routes them to a separate file based on `agentId`.

### 1.4 insertMessageChain Internals

**Where:** `chunks.174.mjs:1477-1519`

Each message in the chain gets enriched with metadata before writing:

```javascript
let enriched = {
    parentUuid: isCompactBoundary ? null : currentParent,
    logicalParentUuid: isCompactBoundary ? currentParent : undefined,
    isSidechain: isSidechain,
    teamName: teamInfo?.teamName,
    agentName: teamInfo?.agentName,
    promptId: msg.type === "user" ? getPromptId() : undefined,
    agentId: agentId,
    ...msg,                    // original message data
    userType: getUserType(),   // "ant" or other
    cwd: getCwd(),            // current working directory at write time
    sessionId: getSessionId(),
    version: VERSION_STRING,
    gitBranch: gitBranch,     // resolved via async kj()
    slug: projectSlug
};
```

**Important:** The `cwd` and `gitBranch` are captured **at write time**, not at message creation time. This means the persisted transcript records the working directory and git branch as they were when each message was flushed.

After writing the chain, if not a sidechain, the function extracts the last user prompt and stores it as `currentSessionLastPrompt` (truncated to 200 chars) for display in the session picker.

### 1.5 The appendEntry Type Dispatch

**Where:** `chunks.174.mjs:1551-1597`

The `appendEntry` method dispatches based on record type. The routing logic is crucial:

| Record Type | Routing | Dedup Check | Remote Persist |
|---|---|---|---|
| `user`, `assistant`, `system`, `progress`, `attachment` | Main file (or sidechain file if `isSidechain`) | Yes - UUID set check | Yes - if `Wl()` returns true |
| `summary`, `custom-title`, `ai-title`, `last-prompt`, `tag`, `agent-name`, `agent-color`, `agent-setting`, `pr-link`, `mode` | Main session file | No | No |
| `file-history-snapshot` | Main session file | No | No |
| `attribution-snapshot` | Main session file | No | No |
| `speculation-accept` | Main session file | No | No |
| `content-replacement` | Main session file | No | No |
| `marble-origami-commit`, `marble-origami-snapshot` | Main session file | No | No |
| `queue-operation` | Main session file | No | No |

**Key insight:** Only actual conversation messages (user/assistant/system/progress/attachment) go through UUID deduplication and remote persistence. All other record types are metadata that is written directly to the local JSONL without dedup checks.

---

## 2. File History Snapshots

### 2.1 Pre-Edit Backup (R66 / trackEditForFileHistory)

**Where:** `chunks.135.mjs:1986-2014`

**Trigger points:**
- `chunks.139.mjs:180` - **WriteTool** calls `R66(Y, O, w.uuid)` BEFORE writing the file
- `chunks.170.mjs:1352` - **EditTool** calls `R66(Y, M, w.uuid)` BEFORE applying the edit
- `chunks.139.mjs:1360` - **NotebookEditTool** calls `R66(_, $, O.uuid)` BEFORE editing
- `chunks.171.mjs:2136` - **SedTool** (within BashTool's sed handling) calls `R66(q.updateFileHistoryState, _, K.uuid)` BEFORE sed operation

**How it works:**

```javascript
// ============================================
// trackEditForFileHistory - Creates pre-edit backup of file being modified
// Location: chunks.135.mjs:1986-2014
// ============================================

// READABLE (for understanding):
async function trackEditForFileHistory(updateState, filePath, messageUuid) {
    if (!isFileHistoryEnabled()) return;
    updateState((state) => {
        let lastSnapshot = state.snapshots.at(-1);
        if (!lastSnapshot) return state;  // error: no snapshot exists
        let normalizedPath = normalizePath(filePath);
        if (lastSnapshot.trackedFileBackups[normalizedPath]) return state;  // already tracked

        let trackedFiles = state.trackedFiles.has(normalizedPath)
            ? state.trackedFiles
            : new Set(state.trackedFiles).add(normalizedPath);
        let isNewFile = !fs.existsSync(filePath);
        let backup = isNewFile ? createBackup(null, 1) : createBackup(filePath, 1);
        let updatedSnapshot = cloneSnapshot(lastSnapshot);
        updatedSnapshot.trackedFileBackups[normalizedPath] = backup;

        let newState = { ...state, snapshots: [...state.snapshots.slice(0, -1), updatedSnapshot], trackedFiles };
        debugLog(newState);
        // ASYNC: Write snapshot to JSONL (fire-and-forget with error logging)
        insertFileHistorySnapshot(messageUuid, updatedSnapshot, true).catch(...);
        return newState;
    });
}

// Mapping: R66->trackEditForFileHistory, A->updateState, q->filePath, K->messageUuid
// _l6->insertFileHistorySnapshot
```

**Key insight:** The file backup is created **BEFORE** the edit is applied. This is critical -- it captures the file's state prior to modification so it can be restored during undo. The `createBackup` (`du8`) function reads the file content and stores it. The JSONL write is **fire-and-forget** (`.catch(...)`) -- the edit proceeds even if persistence fails.

**Timing relative to edit:**
1. File history snapshot update (in-memory state + async JSONL write)
2. Actual file write (synchronous `l66` call)
3. LSP notification
4. ReadFileState cache update

### 2.2 Per-Message Snapshot (lf6 / createMessageSnapshot)

**Where:** `chunks.135.mjs:2016-2068`

**Trigger:** `chunks.185.mjs:2018-2024` -- called for each selectable user message after the first turn in the SDK agent loop. Also called in the UI path.

```javascript
// In SDK agent loop (chunks.185.mjs:2018-2024):
if (isFileHistoryEnabled() && isPersistenceEnabled) {
    userMessages.filter(selectableUserMessagesFilter).forEach((msg) => {
        createMessageSnapshot((stateUpdater) => {
            setAppState((appState) => ({
                ...appState,
                fileHistory: stateUpdater(appState.fileHistory)
            }))
        }, msg.uuid)
    })
}
```

**How it works:** For each user message, it creates a complete snapshot of all tracked files at that point in time. It reads each tracked file, creates a backup copy, and writes a `file-history-snapshot` record to the JSONL with `isSnapshotUpdate: false`.

**Key insight:** This creates the "checkpoint" that the user can revert to. Each user message gets a snapshot so the user can undo to any turn boundary. The snapshot includes backups of ALL tracked files, not just those modified in the current turn. The function also calls `wVY` which compares old vs new snapshots and triggers `L66` (diff notifications) for files that changed.

---

## 3. Content Replacement Persistence

**Where:** `chunks.174.mjs:1541-1549`, triggered from `chunks.148.mjs:934`

**Trigger:** During the query function (`omY`), before sending messages to the LLM:

```javascript
// chunks.148.mjs:934
messages = await T34(messages, toolUseContext.contentReplacementState, querySource,
    (newReplacements) => void pz6(newReplacements).catch(logError));
```

**How it works:**

1. `T34` (`contentReplacementApply`) scans messages for tool results that should be masked (e.g., large file contents)
2. When new replacements are discovered (content exceeding threshold), they are applied to the messages
3. The callback fires `pz6` (`insertContentReplacement`) which writes a `content-replacement` record to the JSONL
4. The record contains: `{ type: "content-replacement", sessionId, replacements: [...] }`

**When it fires:** At the START of each LLM query, before the API call. Content replacement is applied to messages to reduce token count by replacing large tool results with references.

**Key insight:** This is a **lossy transformation** that only persists the replacement rules, not the original content. On resume, the replacement rules are re-applied to reconstruct the same masked state. The callback is fire-and-forget (`.catch(logError)`).

### Content Replacement State During Resume

**Where:** `chunks.196.mjs:360,657`

During resume, the content replacement state (`Pj.current`) is reconstructed:
```javascript
// chunks.196.mjs:360
if (contentReplacementState && resumeType !== "fork")
    contentReplacementState = QN8(messages, sessionData.contentReplacements ?? []);
```

The `QN8` function rebuilds the replacement state by scanning message tool_use IDs and applying stored replacement rules.

---

## 4. Attribution Snapshots

**Where:** `chunks.174.mjs:1536-1539`, `chunks.185.mjs:1850-1854`

**Trigger:** Attribution state updates flow through `updateAttributionState` callbacks in the tool use context. The `updateAttributionState` callback is provided to hook callbacks (`chunks.176.mjs:72`) and tool executions.

**How it works:** Attribution snapshots are written as `attribution-snapshot` records keyed by `messageId`. They track which LLM/agent was responsible for code changes.

**Important:** In the current codebase, `izz()` (the JSONL write wrapper) is defined but the direct callers appear to be wired through the hook system and internal callback chains rather than explicit call sites in the main loop. The `insertAttributionSnapshot` method on `SessionPersistence` handles the actual write.

**Persistence:** Written via `enqueueWrite` (same batched path as other metadata records). No deduplication -- each snapshot overwrites by `messageId` on read (the parser uses `D.set(R.messageId, R)`).

---

## 5. Tool Result Persistence: Batched, Not Individual

**How tool_use and tool_result messages flow:**

1. **LLM streams assistant message** containing `tool_use` blocks
2. The complete assistant message is yielded from the streaming loop
3. `_F` is called, which writes the assistant message (containing tool_use) to JSONL
4. **Tool execution** happens (potentially parallel for concurrency-safe tools)
5. Tool results are assembled into a user message with `tool_result` content blocks
6. This user message is yielded from tool execution
7. The next `_F` call (triggered by message array update) writes the user message (containing tool_result)

**Key insight:** Tool use and tool result are NOT persisted as separate records. They are embedded within the standard assistant/user message flow. The persistence granularity is **per-message**, not per-tool-call.

**Batching behavior:** When multiple concurrent tools complete, their results may be in a single user message with multiple `tool_result` blocks. This single message is persisted in one `_F` call.

---

## 6. Streaming Partial State: NOTHING Persisted

**Critical finding:** During LLM streaming, **no partial state is saved to the JSONL**.

The streaming loop in `omY` (`chunks.148.mjs:1061-1114`) yields messages as they are fully received from the API:

```javascript
for await (let chunk of streamLLMResponse({...})) {
    // chunk is a complete message (assistant type)
    // Only complete messages are yielded
    if (!shouldWithhold) yield chunk;
    if (chunk.type === "assistant") {
        orphanedMessages.push(chunk);  // in-memory only
        // tool_use blocks are collected for parallel execution
    }
}
```

**What happens on crash mid-stream:**
- The partially received assistant message is **lost** -- it was never written to JSONL
- The last persisted state is the most recent complete message written by the previous `_F` call
- On resume, the conversation picks up from the last fully persisted message
- Any tool executions that were in-flight (parallel tool execution via `ui6`) are also lost

**Why this design:** Persisting partial streaming state would create invalid messages in the transcript (incomplete content blocks, partial tool_use structures). By only persisting complete messages, the transcript is always in a valid state for resume.

**The eager flush exception:** When `CLAUDE_CODE_EAGER_FLUSH` or `CLAUDE_CODE_IS_COWORK` is set, `jF()` (flush) is called after each `_F` call to ensure writes hit disk immediately rather than waiting for the 100ms timer. This reduces data loss window but still only flushes complete messages.

---

## 7. Context Collapse (Marble-Origami)

**Where:** `chunks.174.mjs:1704-1722`

**Record types:**
- `marble-origami-commit` -- Records a context collapse operation (like a git commit for context)
- `marble-origami-snapshot` -- Records the current collapsed state

**Persistence functions:**

```javascript
// ============================================
// recordContextCollapseCommit - Persists a context collapse commit
// Location: chunks.174.mjs:1704-1712
// ============================================

// READABLE:
async function recordContextCollapseCommit(commitData) {
    let sessionId = getSessionId();
    if (!sessionId) return;
    await getSessionPersistence().appendEntry({
        type: "marble-origami-commit",
        sessionId: sessionId,
        ...commitData
    });
}
```

**When it fires:** These functions are exported (`recordContextCollapseCommit`, `recordContextCollapseSnapshot`) but their call sites appear to be wired dynamically -- likely triggered during compaction or context window management operations.

**On read (resume):** The parser (`chunks.174.mjs:2458-2459`) accumulates commits into an array and keeps only the latest snapshot:
```javascript
else if (R.type === "marble-origami-commit") P.push(R);
else if (R.type === "marble-origami-snapshot") W = R;  // latest wins
```

After a `compact_boundary` message, the commits array is reset (`P.length = 0`) and snapshot cleared (`W = undefined`), meaning context collapse state is scoped to the current compaction epoch.

---

## 8. Queue Operations

**Where:** `chunks.90.mjs:2775-2787`, persisted via `chunks.174.mjs:1531-1534`

**What it does:** The message queue (where user messages wait to be processed) persists its operations so that queued messages survive a restart.

```javascript
// ============================================
// persistQueueOperation - Records a queue state change
// Location: chunks.90.mjs:2775-2787
// ============================================

// READABLE:
function persistQueueOperation(operation, content) {
    let sessionId = getSessionId();
    let record = {
        type: "queue-operation",
        operation: operation,  // "enqueue", "dequeue", "remove", "popAll"
        timestamp: new Date().toISOString(),
        sessionId: sessionId,
        ...content !== undefined && { content: content }
    };
    insertQueueOperation(record);  // fire-and-forget (no await)
}
```

**Operations persisted:**
- `"enqueue"` -- When a new message is added to the queue (with optional content)
- `"dequeue"` -- When the next message is consumed from the queue
- `"remove"` -- When a specific message is removed
- `"popAll"` -- When all messages are drained from the queue

**Key insight:** Queue operations are persisted **synchronously** (fire-and-forget, no `await`). The `kV8` wrapper goes through `enqueueWrite` which is non-blocking. This means the queue mutation happens immediately in memory, and the JSONL record is written asynchronously.

---

## 9. Speculation Acceptance

**Where:** `chunks.146.mjs:1748-1758`

**What it does:** When speculative execution results are accepted (the LLM's predicted next action was correct), a `speculation-accept` record is written to track time savings.

```javascript
// ============================================
// speculationAccept - Persists speculation acceptance with timing
// Location: chunks.146.mjs:1748-1758
// ============================================

// READABLE:
let record = {
    type: "speculation-accept",
    timestamp: new Date().toISOString(),
    timeSavedMs: timeSaved
};
// DIRECT file append (bypasses SessionPersistence queue!)
appendFileSync(getSessionTranscriptPath(), JSON.stringify(record) + "\n", { mode: 384 })
    .catch(() => { log("[Speculation] Failed to write speculation-accept to transcript") });
```

**Critical insight:** Speculation-accept records use `hxY` (a direct `appendFile` call) to the session file, **bypassing the SessionPersistence write queue entirely**. This is a fire-and-forget async write. The motivation is likely to avoid any ordering issues with the batched write queue -- speculation timing data should be written immediately.

**On read:** The parser (`chunks.174.mjs:1581`) routes `speculation-accept` through the normal `enqueueWrite` path for re-serialization, but on initial write during execution it's a raw file append.

---

## 10. File History Update Flow (Session Orchestrator)

**Where:** `chunks.196.mjs:599-607`

**How the `updateFileHistoryState` callback connects to persistence:**

```javascript
// ============================================
// updateFileHistoryState - Callback wired into tool use context
// Location: chunks.196.mjs:599-607
// ============================================

// READABLE:
updateFileHistoryState(stateUpdater) {
    setAppState((currentState) => {
        let newFileHistory = stateUpdater(currentState.fileHistory);
        if (newFileHistory === currentState.fileHistory) return currentState;  // no change
        return { ...currentState, fileHistory: newFileHistory };
    });
}
```

**The full chain:**
1. Tool (EditTool, WriteTool, etc.) calls `context.updateFileHistoryState(updater)`
2. This calls the callback above, which updates the Zustand/React state
3. Inside the updater function (within `R66` or `lf6`), `_l6()` is called to persist the snapshot to JSONL
4. The JSONL write goes through `SessionPersistence.insertFileHistorySnapshot()` -> `appendEntry()` -> `enqueueWrite()`

**Important:** The state update and the JSONL write happen in the SAME updater function call, but the JSONL write is async (fire-and-forget). The in-memory state is updated synchronously; the disk write is eventually consistent.

---

## 11. Turn Completion Callback

**Where:** `chunks.198.mjs:855-857`, `chunks.196.mjs:2645,2766`

**What `onTurnComplete` does:**

```javascript
// chunks.198.mjs:855-857
onTurnComplete: (result) => {
    loadedPromise.then((handler) => handler?.(result))
}
```

**Analysis:** `onTurnComplete` is an **optional callback** passed from the CLI entry point. It is NOT a persistence mechanism itself. It receives the turn result (success/failure/abort information) and forwards it to a lazily-loaded handler. The handler is loaded via a dynamic import promise (`a8`).

**What it does NOT do:** It does not write to the JSONL. It does not trigger any additional persistence. It is used for external integrations (e.g., task status updates, external reporting).

---

## 12. Stream Event Handling in Session Orchestrator

**Where:** `chunks.196.mjs`

**Finding:** There is NO `handleStreamedEvent` function in `chunks.196.mjs`. The session orchestrator does not intercept streaming events for persistence purposes. All persistence during streaming is handled by the agent loop itself (via `_F` calls after complete messages are yielded).

The orchestrator's role is setting up the `toolUseContext` with callbacks (`updateFileHistoryState`, `updateAttributionState`, `contentReplacementState`, etc.) that tools call during execution. The orchestrator does not directly participate in the streaming loop.

---

## Complete Record Type Inventory

All record types written to the JSONL during agent loop execution:

| Record Type | Writer Function | Trigger Point | Batched? | Deduped? |
|---|---|---|---|---|
| `user` | `_F` / `insertMessageChain` | After user input processing, after tool results | Yes (100ms) | Yes (UUID) |
| `assistant` | `_F` / `insertMessageChain` | After LLM streaming completes each message | Yes (100ms) | Yes (UUID) |
| `system` (compact_boundary) | `_F` / `insertMessageChain` | After auto-compaction | Yes (100ms) | Yes (UUID) |
| `progress` | `_F` / `insertMessageChain` | During long-running operations | Yes (100ms) | Yes (UUID) |
| `attachment` | `_F` / `insertMessageChain` | When files/context attached | Yes (100ms) | Yes (UUID) |
| `file-history-snapshot` | `_l6` / `insertFileHistorySnapshot` | Before each file edit, at each user message | Yes (100ms) | No |
| `content-replacement` | `pz6` / `insertContentReplacement` | At start of each LLM query (during `T34`) | Yes (100ms) | No |
| `attribution-snapshot` | `izz` / `insertAttributionSnapshot` | Via hook callbacks | Yes (100ms) | No |
| `queue-operation` | `kV8` / `insertQueueOperation` | On queue enqueue/dequeue/remove/popAll | Yes (100ms) | No |
| `speculation-accept` | Direct `appendFile` | When speculation result is accepted | **No** (immediate) | No |
| `marble-origami-commit` | `nzz` / direct appendEntry | During context collapse | Yes (100ms) | No |
| `marble-origami-snapshot` | `rzz` / direct appendEntry | During context collapse | Yes (100ms) | No |
| `summary` | `enqueueWrite` | After compaction generates summary | Yes (100ms) | No |
| `custom-title` | `enqueueWrite` | When user sets title | Yes (100ms) | No |
| `ai-title` | `enqueueWrite` | When AI generates title | Yes (100ms) | No |
| `last-prompt` | `enqueueWrite` | Updated on each user message chain | Yes (100ms) | No |
| `mode` | `enqueueWrite` | When mode changes (plan/code) | Yes (100ms) | No |

---

## Crash Recovery Analysis

### What survives a crash:

1. **All messages written by previous `_F`/`drainWriteQueue` cycles** -- anything that made it through the 100ms flush window
2. **File history snapshots** from previous tool executions (async but usually fast)
3. **Content replacement rules** from previous query starts
4. **Queue operations** from previous enqueue/dequeue calls

### What is lost on crash:

1. **The currently streaming LLM response** -- partial messages are never persisted
2. **In-flight tool executions** -- results not yet assembled into a user message
3. **The current write queue** -- entries queued but not yet drained (up to 100ms window)
4. **In-memory state updates** that haven't triggered a JSONL write yet

### The 100ms vulnerability window:

Between `enqueueWrite` and `drainWriteQueue`, there is a maximum 100ms window where data exists only in memory. For the eager flush path (`CLAUDE_CODE_EAGER_FLUSH`), `jF()` is called after each `_F`, which drains immediately, reducing this window to near-zero.

### Remote persistence adds durability:

For messages that pass the `Wl()` check (user/assistant/system/progress/attachment), if remote persistence is enabled, `persistToRemote` is called which sends the message to a remote ingress URL or internal event writer. This provides an additional durability layer beyond the local JSONL file.
