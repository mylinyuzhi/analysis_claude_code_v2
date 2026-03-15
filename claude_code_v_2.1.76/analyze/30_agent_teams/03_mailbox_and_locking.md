# Mailbox and File Locking Deep Dive

> **Module**: Agent Teams - File-Based Communication
> **Version**: Claude Code 2.1.38
> **Purpose**: Complete analysis of message delivery, file locking, and race condition handling

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Mailbox File Format](#2-mailbox-file-format)
3. [Race Condition Analysis](#3-race-condition-analysis)
4. [File Locking Implementation](#4-file-locking-implementation)
5. [Message Consumption Patterns](#5-message-consumption-patterns)
6. [Mark-As-Read vs Delete](#6-mark-as-read-vs-delete)
7. [Edge Cases & Recovery](#7-edge-cases--recovery)

---

## 1. Executive Summary

Agent Teams use a **file-based mailbox system** where each agent has a dedicated JSON file for receiving messages:

```
~/.claude/teams/{team-name}/inboxes/{agent-name}.json
```

**Key design decisions**:

1. **One file per recipient**: Avoids cross-agent contention (only sender + recipient lock same file)
2. **Read-modify-write with locking**: Uses `proper-lockfile` library to prevent race conditions
3. **Mark-as-read flag**: Messages persist for debugging, not deleted after consumption
4. **Append-only semantics**: New messages pushed to end of array (FIFO delivery)

**Why filesystem instead of sockets/IPC**:

| Aspect | Filesystem (chosen) | Sockets/IPC |
|--------|-------------------|-------------|
| **Multi-process** | Works across separate processes | Requires setup/teardown |
| **Persistence** | Survives crashes | Lost on disconnect |
| **Debuggability** | `cat mailbox.json` shows state | Need packet capture |
| **Complexity** | Simple read/write | Connection management, protocols |

**Trade-off**: Filesystem I/O is slower (~1-5ms per operation) but provides durability and simplicity. For inter-agent coordination (not high-frequency messaging), this is acceptable.

---

## 2. Mailbox File Format

### 2.1 JSON Schema

**File location**:
```
~/.claude/teams/{team-name}/inboxes/{recipient-agent-name}.json
```

**File structure**:
```json
[
  {
    "from": "team-lead",
    "to": "backend-dev",
    "text": "Please implement the POST /users endpoint",
    "summary": "Implement POST /users",
    "timestamp": "2024-02-14T08:15:30.123Z",
    "color": "#3b82f6",
    "read": false
  },
  {
    "from": "frontend-dev",
    "to": "backend-dev",
    "text": "What's the expected response format for /users?",
    "summary": "Question about /users response",
    "timestamp": "2024-02-14T08:17:45.678Z",
    "color": "#10b981",
    "read": false
  },
  {
    "from": "team-lead",
    "to": "backend-dev",
    "text": "{ \"type\": \"shutdown_request\", \"request_id\": \"uuid-123\" }",
    "summary": "Shutdown request",
    "timestamp": "2024-02-14T08:20:00.000Z",
    "color": "#3b82f6",
    "read": true
  }
]
```

### 2.2 Field Semantics

| Field | Type | Purpose | Source |
|-------|------|---------|--------|
| **from** | string | Sender's agent name | `getAgentName()` or "team-lead" |
| **to** | string | Recipient's agent name | Tool parameter |
| **text** | string | Message content (plain text or JSON) | Tool parameter `content` |
| **summary** | string | 5-10 word preview for UI | Tool parameter (optional) |
| **timestamp** | ISO 8601 | Message creation time | `new Date().toISOString()` |
| **color** | hex color | Sender's visual identifier | Hash of sender's agent ID → color palette |
| **read** | boolean | Consumption status | Initially false, set true by recipient |

**Why separate `text` and `summary`**:

- **text**: Full message content (can be multi-paragraph prompt or JSON control message)
- **summary**: Short description for TUI display (e.g., task list showing "5 unread messages")

Example:
```
text: "Please implement the following API endpoint:\n\nPOST /users\n- Accept name and email\n- Return user ID\n- Validate email format\n..."
summary: "Implement POST /users"  // Shown in UI without full details
```

### 2.3 Special Message Types

**Control messages** (JSON in `text` field):

```json
// Shutdown request
{
  "text": "{\"type\": \"shutdown_request\", \"request_id\": \"uuid-123\"}",
  "from": "team-lead"
}

// Plan approval request
{
  "text": "{\"type\": \"plan_approval_request\", \"plan_content\": \"...\", \"request_id\": \"uuid-456\"}",
  "from": "backend-dev"
}
```

**Parsing strategy**:

```javascript
// ============================================
// parseShutdownRequest - Extract shutdown request from message text
// Location: chunks.129.mjs:1396
// ============================================

// READABLE (for understanding):
function parseShutdownRequest(messageText) {
    try {
        const parsed = JSON.parse(messageText);
        if (parsed.type === "shutdown_request" && parsed.request_id) {
            return {
                requestId: parsed.request_id
            };
        }
    } catch {
        // Not JSON or not a shutdown request
    }
    return null;
}
```

**Why JSON in text field** (instead of separate `type` field):

- **Backward compatibility**: Plain text messages don't need type
- **Simplicity**: Single field for content, type inference via parsing
- **Flexibility**: New message types don't require schema change

**Trade-off**: Requires try-catch parsing. Acceptable overhead (<1ms).

---

## 3. Race Condition Analysis

### 3.1 The Lost Update Problem

**Scenario**: Two agents send messages to same recipient simultaneously without locking.

```
Initial state: backend-dev.json contains [msg1, msg2]

Timeline:
  T0: team-lead reads backend-dev.json → sees [msg1, msg2]
  T1: frontend-dev reads backend-dev.json → sees [msg1, msg2]
  T2: team-lead appends msg3 → writes [msg1, msg2, msg3]
  T3: frontend-dev appends msg4 → writes [msg1, msg2, msg4]

Final state: backend-dev.json contains [msg1, msg2, msg4]

Result: msg3 LOST!
```

**Visualization**:

```
Without Locking (BROKEN):

 team-lead process          backend-dev.json          frontend-dev process
┌─────────────────┐         ┌──────────────┐         ┌──────────────────┐
│ Read mailbox    │────────>│ [msg1, msg2] │<────────│ Read mailbox     │
│ → [msg1, msg2]  │         └──────────────┘         │ → [msg1, msg2]   │
│                 │                                   │                  │
│ Append msg3     │                                   │ Append msg4      │
│ → [..msg2, msg3]│                                   │ → [..msg2, msg4] │
│                 │         ┌──────────────┐         │                  │
│ Write back      │────────>│ [..msg2,msg3]│         │                  │
│                 │         └──────────────┘         │                  │
│                 │         ┌──────────────┐         │                  │
│                 │         │ [..msg2,msg4]│<────────│ Write back       │
│                 │         └──────────────┘         │                  │
└─────────────────┘                                   └──────────────────┘
                             msg3 overwritten!
```

### 3.2 Correct Behavior with Locking

**Same scenario with file locking**:

```
Timeline:
  T0: team-lead acquires lock on backend-dev.json.lock
  T1: frontend-dev attempts lock → BLOCKED (waits)
  T2: team-lead reads [msg1, msg2]
  T3: team-lead appends msg3 → [msg1, msg2, msg3]
  T4: team-lead writes [msg1, msg2, msg3]
  T5: team-lead releases lock
  T6: frontend-dev acquires lock (now available)
  T7: frontend-dev reads [msg1, msg2, msg3]  ← sees msg3!
  T8: frontend-dev appends msg4 → [msg1, msg2, msg3, msg4]
  T9: frontend-dev writes [msg1, msg2, msg3, msg4]
  T10: frontend-dev releases lock

Final state: [msg1, msg2, msg3, msg4]

Result: Both messages preserved!
```

**Visualization**:

```
With Locking (CORRECT):

 team-lead process          Lock File               backend-dev.json          frontend-dev process
┌─────────────────┐       ┌──────────┐            ┌──────────────┐         ┌──────────────────┐
│ Acquire lock    │──────>│ LOCKED by│            │              │         │                  │
│ (success)       │       │ team-lead│            │              │         │ Acquire lock     │
│                 │       └──────────┘            │              │<────────│ (BLOCKED, wait)  │
│                 │                               │              │         │ ...              │
│ Read mailbox    │──────────────────────────────>│ [msg1, msg2] │         │ ...              │
│ Append msg3     │                               │              │         │ ...              │
│ Write back      │──────────────────────────────>│ [..msg2,msg3]│         │ ...              │
│                 │       ┌──────────┐            │              │         │ ...              │
│ Release lock    │──────>│ UNLOCKED │            │              │         │ ...              │
│                 │       └──────────┘            │              │         │ Acquire lock     │
│                 │       ┌──────────┐            │              │         │ (success)        │
│                 │       │ LOCKED by│<───────────────────────────────────│                  │
│                 │       │frontend  │            │              │         │                  │
│                 │       └──────────┘            │              │         │ Read mailbox     │
│                 │                               │ [..msg2,msg3]│────────>│ → [...msg2, msg3]│
│                 │                               │              │         │ Append msg4      │
│                 │                               │ [..msg3,msg4]│<────────│ Write back       │
│                 │       ┌──────────┐            │              │         │                  │
│                 │       │ UNLOCKED │<───────────────────────────────────│ Release lock     │
└─────────────────┘       └──────────┘            └──────────────┘         └──────────────────┘

                          All messages preserved!
```

**Key insight**: Lock must cover the **entire read-modify-write cycle**. Locking only around the write is insufficient (race condition in read phase).

### 3.3 Multi-Agent Contention

**Scenario**: 5 agents all send messages to backend-dev simultaneously.

```
Without locking:
  - All 5 read mailbox concurrently
  - All 5 write back
  - 4 messages lost (last writer wins)

With locking + retry:
  Agent 1: Acquires lock immediately → writes msg1 → releases (5ms total)
  Agent 2: Blocks, retries after 100ms → acquires → writes msg2 → releases
  Agent 3: Blocks, retries → acquires → writes msg3 → releases
  Agent 4: Blocks, retries → acquires → writes msg4 → releases
  Agent 5: Blocks, retries → acquires → writes msg5 → releases

Total time: ~500ms for all 5 messages (serialized)
All messages preserved
```

**Why serialization is acceptable**:

- **Rare contention**: Typical teams have <5 agents, messaging is bursty (not continuous flood)
- **Short critical section**: Lock held for ~1-5ms (read JSON, append one message, write back)
- **Bounded wait**: Max 5 retries × 1s = 5 seconds before failure
- **Messaging not latency-critical**: 500ms delivery delay acceptable for coordination

**Alternative considered**: Lock-free queue using atomic file operations (e.g., create unique `.msg-uuid` files, reader scans directory).

**Trade-off**: Lock-free is more complex (need directory scanning, sorting by timestamp, cleanup). Chosen approach (single file + lock) is simpler for typical team sizes (<10 agents).

---

## 4. File Locking Implementation

### 4.1 Library Choice: proper-lockfile

**Why `proper-lockfile` instead of fs.open with exclusive flag**:

| Feature | `proper-lockfile` | `fs.open(..., 'wx')` |
|---------|------------------|---------------------|
| **Stale lock detection** | Yes (PID + mtime check) | No (orphaned forever) |
| **Retry logic** | Built-in exponential backoff | Manual implementation needed |
| **Cross-platform** | Works on Windows, Linux, macOS | Platform-specific behavior |
| **NFS support** | Best-effort (known limitations) | Often broken on NFS |

**Chosen approach**: Use mature library with battle-tested edge case handling.

### 4.2 Lock Acquisition

**Implementation**:

```javascript
// ============================================
// writeToMailbox - Atomic message append with file locking
// Location: chunks.129.mjs:1107-1150
// ============================================

// ORIGINAL (for source lookup):
async function f9(A, q, K) {
    let Y = as(A, K);  // getInboxPath
    await eZY(K);      // ensureInboxDirectoryExists

    await MZ6.lock(Y + ".lock", {
        retries: {
            retries: 5,
            minTimeout: 100,
            maxTimeout: 1e3
        },
        stale: 6e4  // 60000ms = 60 seconds
    });

    try {
        let w = [];
        if (await BO(Y)) {  // fileExists
            let H = await ZY(Y, "utf-8");  // readFile
            w = JSON.parse(H)
        }
        w.push(q);
        await w4(Y, JSON.stringify(w, null, 2), "utf-8")  // writeFile
    } finally {
        await MZ6.unlock(Y + ".lock")
    }
}

// READABLE (for understanding):
async function writeToMailbox(recipientName, message, teamName) {
    const mailboxPath = getInboxPath(recipientName, teamName);
    // Path: ~/.claude/teams/{teamName}/inboxes/{recipientName}.json

    await ensureInboxDirectoryExists(teamName);
    // mkdir -p ~/.claude/teams/{teamName}/inboxes/

    const lockPath = mailboxPath + ".lock";

    // Acquire exclusive lock with retry
    await lockfile.lock(lockPath, {
        retries: {
            retries: 5,       // Retry up to 5 times
            minTimeout: 100,  // Initial wait: 100ms
            maxTimeout: 1000  // Max wait per retry: 1s
        },
        stale: 60000  // Consider lock stale after 60 seconds
    });

    try {
        // Critical section - only one process here at a time
        let messages = [];

        if (await fileExists(mailboxPath)) {
            const content = await readFile(mailboxPath, "utf-8");
            messages = JSON.parse(content);
        }

        messages.push(message);

        await writeFile(
            mailboxPath,
            JSON.stringify(messages, null, 2),
            "utf-8"
        );
    } finally {
        // Always release lock, even if error
        await lockfile.unlock(lockPath);
    }
}

// Mapping: f9→writeToMailbox, as→getInboxPath, eZY→ensureInboxDirectoryExists,
//          MZ6→lockfile, BO→fileExists, ZY→readFile, w4→writeFile
```

### 4.3 Lock Parameters Explained

**retries: 5**

- **Why 5**: Most contention resolves in 1-2 retries (lock held for ~1-5ms)
- **Exponential backoff**: Wait 100ms, then 200ms, 400ms, 800ms, 1000ms (total ~2.5s)
- **Failure after retries**: If all 5 fail, throw error (surfaced to agent as SendMessage failure)

**minTimeout: 100ms**

- **Why 100ms**: Long enough to avoid busy-wait, short enough for responsive retry
- **Not 10ms**: Too short → CPU spinning if lock held by slow writer
- **Not 1s**: Too long → user perceives lag if lock released after 50ms

**maxTimeout: 1000ms**

- **Why 1s cap**: Prevents unbounded exponential growth (avoid waiting minutes per retry)
- **Balance**: Long enough for slow I/O (NFS, slow disk), not so long that user gives up

**stale: 60000ms (60 seconds)**

- **Why 60s**: Conservative timeout for crash recovery
- **Too short** (e.g., 5s): False positives if process legitimately takes 6s (e.g., JSON parsing huge mailbox)
- **Too long** (e.g., 600s): Orphaned locks block agents for 10 minutes

### 4.4 Stale Lock Detection

**How `proper-lockfile` detects stale locks**:

```javascript
// Pseudo-code from proper-lockfile internals
function isLockStale(lockFilePath, staleTimeout) {
    const lockStat = fs.statSync(lockFilePath);
    const lockAge = Date.now() - lockStat.mtimeMs;

    if (lockAge > staleTimeout) {
        // Lock older than 60s
        const lockData = fs.readFileSync(lockFilePath, "utf-8");
        const lockPid = parsePid(lockData);  // Extract PID from lock file

        if (!isProcessRunning(lockPid)) {
            // Process holding lock is dead → lock is stale
            return true;
        }
    }

    return false;
}

function isProcessRunning(pid) {
    try {
        process.kill(pid, 0);  // Signal 0 = check if process exists
        return true;
    } catch {
        return false;  // Process not found
    }
}
```

**Lock file format**:
```
PID: 12345
Host: my-laptop.local
Timestamp: 2024-02-14T08:15:00.000Z
```

**Edge case**: Process crash at T0, lock file remains. At T0+61s, next lock attempt:

1. Check mtime of `.lock` file → 61 seconds old (> 60s threshold)
2. Read PID from lock file → 12345
3. Check if PID 12345 running → No (process crashed)
4. Remove stale lock file
5. Acquire new lock

**PID reuse risk**: OS might reuse PID 12345 for unrelated process. Mitigation: `proper-lockfile` includes hostname in lock file (cross-host detection).

### 4.5 Lock Failure Modes

**Scenario 1**: Disk full during write

```javascript
try {
    await writeFile(mailboxPath, JSON.stringify(messages));
    // Throws: ENOSPC (no space left on device)
} finally {
    await lockfile.unlock(lockPath);  // ALWAYS runs
}
// Lock released, error propagates to caller
// SendMessage tool returns error to agent
```

**Recovery**: Lock released cleanly. Agent receives error, can retry after user frees disk space.

**Scenario 2**: Process killed (SIGKILL) while holding lock

```
T0: Process acquires lock, begins write
T1: User runs `kill -9 <pid>` (immediate termination)
T2: Lock file orphaned (process didn't release)
T3: Next lock attempt (T2 + 61s) → detects stale lock → removes it
```

**Recovery**: Automatic after 60 seconds. Mailbox may have partial write (incomplete JSON).

**Scenario 3**: 6+ concurrent writers (exceeds retry limit)

```
6 agents all try to write to backend-dev mailbox simultaneously:
  Agent 1: Acquires lock
  Agent 2-6: All wait, retry 5 times over ~2.5 seconds
  Agent 1: Still holding lock (slow write)
  Agent 2-6: All 5 retries exhausted → throw error
```

**Recovery**: None automatic. Agents receive error, users see "Failed to send message: Could not acquire lock". Must manually retry SendMessage.

**Mitigation**: Rare in practice (requires 6+ agents sending to same recipient within same 5ms window).

---

## 5. Message Consumption Patterns

### 5.1 Read and Mark-As-Read

**Implementation**:

```javascript
// ============================================
// markMessageAsReadByIndex - Update read flag for specific message
// Location: chunks.129.mjs:1130-1155
// ============================================

// READABLE (for understanding):
async function markMessageAsReadByIndex(recipientName, teamName, messageIndex) {
    const mailboxPath = getInboxPath(recipientName, teamName);
    const lockPath = mailboxPath + ".lock";

    await lockfile.lock(lockPath, {
        retries: { retries: 5, minTimeout: 100, maxTimeout: 1000 },
        stale: 60000
    });

    try {
        const content = await readFile(mailboxPath, "utf-8");
        const messages = JSON.parse(content);

        if (messageIndex >= 0 && messageIndex < messages.length) {
            messages[messageIndex].read = true;
        } else {
            throw new Error(`Invalid message index: ${messageIndex}`);
        }

        await writeFile(
            mailboxPath,
            JSON.stringify(messages, null, 2),
            "utf-8"
        );
    } finally {
        await lockfile.unlock(lockPath);
    }
}

// Mapping: JQ1→markMessageAsReadByIndex
```

**Why separate function** (instead of marking read during initial read):

1. **Read-only access**: `readMailbox()` doesn't require lock (safe concurrent reads)
2. **Atomic flag update**: Only mark-as-read needs write lock
3. **Failure isolation**: If mark-as-read fails, message was still delivered (agent can retry)

**Consumption flow**:

```
inProcessPollLoop:
  1. Read mailbox (no lock) → get array of messages
  2. Find first unread message → index=5
  3. Extract message content
  4. markMessageAsReadByIndex(recipientName, teamName, 5) → lock → write
  5. Return message content to agent
  6. Agent processes message
```

**Why mark before processing** (instead of after):

- **Exactly-once semantics**: If agent crashes mid-processing, message not re-delivered
- **Trade-off**: Message might be marked read but not fully processed (crash before completion)
- **Acceptable**: Agent coordination is best-effort, not transactional

**Alternative considered**: Two-phase commit (tentative read → process → confirm). Too complex for current requirements.

### 5.2 Full Mailbox Scan (Priority 2)

**Shutdown request detection** (from poll loop):

```javascript
// Scan ALL messages, not just unread, for shutdown requests
const mailbox = await readMailbox(agentName, teamName);

for (let i = 0; i < mailbox.length; i++) {
    const msg = mailbox[i];

    if (!msg.read) {
        const shutdownReq = parseShutdownRequest(msg.text);

        if (shutdownReq) {
            // FOUND - mark as read and return immediately
            await markMessageAsReadByIndex(agentName, teamName, i);

            const skippedCount = mailbox.filter(m => !m.read).length - 1;
            console.log(`Shutdown prioritized over ${skippedCount} unread messages`);

            return {
                type: "shutdown_request",
                requestId: shutdownReq.requestId,
                from: msg.from
            };
        }
    }
}
```

**Why scan ALL instead of stopping at first unread**:

- **Shutdown bypass**: Shutdown request might be message #100, but unread messages start at #1
- **FIFO exception**: Normally FIFO delivery, but shutdown takes absolute priority

**Performance impact**: O(N) scan where N = total messages (read + unread). For typical mailboxes (<100 messages), negligible (<1ms). For huge mailboxes (>10,000), scan becomes expensive.

**Mitigation**: Mailbox archival (move old read messages to archive file). Not implemented yet.

---

## 6. Mark-As-Read vs Delete

### 6.1 Design Decision

**Chosen approach**: Set `read: true` flag, keep message in file.

**Alternative**: Delete message from array after consumption.

| Approach | Pros | Cons |
|----------|------|------|
| **Mark-as-read** (chosen) | • Debugging: inspect full message history<br>• Audit trail: who sent what when<br>• Idempotent: re-reading marked messages safe | • File grows unbounded<br>• Scan performance degrades with size |
| **Delete** | • File stays small<br>• Fast scans (only unread messages) | • Lost history: can't debug after consumption<br>• Non-idempotent: crash after delete loses message |

**Why mark-as-read chosen**:

1. **Debuggability > performance**: Teams are small (2-10 agents), message volume low (<1000 messages per session)
2. **Crash recovery**: If agent crashes after marking message read but before processing, can manually inspect mailbox to see what was delivered
3. **Audit trail**: Team lead can inspect `~/.claude/teams/{name}/inboxes/` to see all communication

**Trade-off**: Mailbox file grows to ~100KB-1MB for active teams. Acceptable on modern systems.

### 6.2 Read Message Compaction (Future Work)

**Proposed approach**: Periodically archive read messages.

```javascript
// Pseudo-code for future implementation
async function compactMailbox(agentName, teamName) {
    const mailboxPath = getInboxPath(agentName, teamName);
    const archivePath = mailboxPath.replace(".json", "-archive.json");

    await lockfile.lock(mailboxPath + ".lock");

    try {
        const messages = JSON.parse(await readFile(mailboxPath));

        const unreadMessages = messages.filter(m => !m.read);
        const readMessages = messages.filter(m => m.read);

        // Keep only unread in active mailbox
        await writeFile(mailboxPath, JSON.stringify(unreadMessages, null, 2));

        // Append read to archive (or rotate if archive too large)
        const existingArchive = await readArchive(archivePath);
        await writeFile(archivePath, JSON.stringify([...existingArchive, ...readMessages], null, 2));

    } finally {
        await lockfile.unlock(mailboxPath + ".lock");
    }
}
```

**Trigger**: After every 1000 messages or when file size > 1MB.

**Not implemented yet**: Current scope doesn't require it (teams typically short-lived, <1000 messages).

---

## 7. Edge Cases & Recovery

### 7.1 Corrupted JSON

**Scenario**: Partial write during crash leaves invalid JSON.

```
Mailbox file content:
[
  {"from": "team-lead", "text": "msg1", "read": false},
  {"from": "frontend-dev", "text": "msg2", "re
```

**Detection**:

```javascript
async function readMailbox(agentName, teamName) {
    const mailboxPath = getInboxPath(agentName, teamName);

    if (!await fileExists(mailboxPath)) {
        return [];  // New mailbox
    }

    try {
        const content = await readFile(mailboxPath, "utf-8");
        return JSON.parse(content);
    } catch (error) {
        console.error(`[readMailbox] Corrupted mailbox for ${agentName}: ${error.message}`);

        // Recovery: Backup corrupted file, return empty array
        const backupPath = mailboxPath + ".corrupted-" + Date.now();
        await copyFile(mailboxPath, backupPath);
        await writeFile(mailboxPath, "[]", "utf-8");

        console.log(`[readMailbox] Created backup: ${backupPath}`);
        return [];
    }
}
```

**Recovery strategy**:

1. Detect corruption via `JSON.parse()` exception
2. Rename corrupted file to `.corrupted-{timestamp}`
3. Create fresh empty mailbox
4. Agent continues with no messages (loses undelivered messages)
5. User can manually inspect backup file

**Data loss**: All unread messages in corrupted mailbox lost.

**Mitigation**: File locking prevents most corruption (incomplete writes). Remaining risk: process killed (SIGKILL) mid-write.

### 7.2 Permission Denied

**Scenario**: Mailbox file or directory not writable.

```javascript
try {
    await writeFile(mailboxPath, JSON.stringify(messages));
} catch (error) {
    if (error.code === "EACCES") {
        throw new Error(
            `Cannot write to mailbox: ${mailboxPath}. ` +
            `Check directory permissions on ~/.claude/teams/${teamName}/inboxes/`
        );
    }
    throw error;  // Re-throw other errors
}
```

**Recovery**: None automatic. Error surfaced to agent, user must fix permissions.

**UX**: Agent sees "Failed to send message: EACCES". User runs `chmod -R u+w ~/.claude/teams/`.

### 7.3 Orphaned Mailboxes

**Scenario**: Teammate crashes, mailbox remains with unread messages.

```
~/.claude/teams/web-app/inboxes/
  team-lead.json       (active)
  backend-dev.json     (teammate crashed, 50 unread messages)
  frontend-dev.json    (active)
```

**Detection**: None automatic. Orphaned mailboxes persist until manual cleanup.

**Cleanup**: `TeamDelete` removes entire `~/.claude/teams/{name}/` directory, including orphaned mailboxes.

**Data loss**: Unread messages lost. Acceptable because crashed teammate couldn't process them anyway.

**Manual recovery**: User can inspect `backend-dev.json` before `TeamDelete` to see what messages were queued.

### 7.4 Lock File Leaks

**Scenario**: Process crashes while holding lock, leaves `.lock` file.

**Automatic recovery**: Stale lock detection (see section 4.4) removes lock after 60 seconds.

**Manual recovery**: User can manually delete `.lock` file if stale detection fails:

```bash
rm ~/.claude/teams/web-app/inboxes/backend-dev.json.lock
```

**Risk**: If process is slow (not crashed), manual deletion causes race condition (two processes think they have lock).

**Mitigation**: Always wait 60+ seconds before manual intervention.

### 7.5 Network Filesystem (NFS)

**Known limitation**: File locking on NFS is unreliable.

**Symptoms**:
- Multiple agents acquire same lock simultaneously
- Race conditions despite locking
- Corrupted mailbox files

**Workaround**: Use local filesystem for `~/.claude/`. If using NFS home directory, set `$CLAUDE_HOME` to local `/tmp/claude-{user}/`.

**Not implemented**: NFS lock detection or automatic fallback.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:

- `writeToMailbox` (f9) - Atomic message append with locking
- `readMailbox` (Ld) - Read all messages from mailbox
- `markMessageAsReadByIndex` (JQ1) - Update read flag
- `getInboxPath` (as) - Construct mailbox file path
- `ensureInboxDirectoryExists` (eZY) - Create inboxes directory
- `parseShutdownRequest` (ss) - Extract shutdown request from message

## Source Locations

- `chunks.129.mjs:1107` - writeToMailbox
- `chunks.129.mjs:1089` - readMailbox
- `chunks.129.mjs:1130` - markMessageAsReadByIndex
- `chunks.129.mjs:1067` - getInboxPath
- `chunks.129.mjs:1080` - ensureInboxDirectoryExists
- `chunks.129.mjs:1396` - parseShutdownRequest

---

**Document Status**: Complete analysis of mailbox file format, file locking, race condition handling, and edge case recovery.
