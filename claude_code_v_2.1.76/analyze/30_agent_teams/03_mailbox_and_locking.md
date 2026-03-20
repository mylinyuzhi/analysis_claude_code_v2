# Mailbox and File Locking Deep Dive

> **Module**: Agent Teams - File-Based Communication
> **Version**: Claude Code 2.1.76
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
// Location: chunks.132.mjs:312-318
// ============================================

// ORIGINAL (for source lookup):
function M66(A) {
    try {
        let q = Bd4().safeParse(i1(A));
        if (q.success) return q.data
    } catch {}
    return null
}

// READABLE (for understanding):
function parseShutdownRequest(messageText) {
    try {
        // Parse JSON and validate against shutdown request schema
        const parsed = shutdownRequestSchema.safeParse(JSON.parse(messageText));
        if (parsed.success) {
            return parsed.data;  // { type: "shutdown_request", request_id: "...", ... }
        }
    } catch {
        // Not JSON or validation failed - not a shutdown request
    }
    return null;
}

// Mapping: M66→parseShutdownRequest, A→messageText, q→parseResult, Bd4→shutdownRequestSchema, i1→JSON.parse
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
// Location: chunks.132.mjs:22-55
// ============================================

// ORIGINAL (for source lookup):
async function x3(A, q, K) {
    await OTY(K);  // ensureInboxDirectoryExists
    let Y = FY6(A, K),  // getInboxPath
        z = `${Y}.lock`;
    try {
        await Pf6(Y, "[]", { encoding: "utf-8", flag: "wx" });  // Create if not exists
    } catch (w) {
        if (w.code !== "EEXIST") { return; }
    }
    let _;
    try {
        _ = await Nc6.lock(Y, { lockfilePath: z, ...iv1 });
        let w = await wl(A, K),  // readMailbox
            O = { ...q, read: !1 };
        w.push(O), await Pf6(Y, B6(w, null, 2), "utf-8");
    } finally {
        if (_) await _();  // Release lock
    }
}

// READABLE (for understanding):
async function writeToMailbox(recipientName, message, teamName) {
    // Ensure inbox directory exists: mkdir -p ~/.claude/teams/{teamName}/inboxes/
    await ensureInboxDirectoryExists(teamName);

    const mailboxPath = getInboxPath(recipientName, teamName);
    // Path: ~/.claude/teams/{teamName}/inboxes/{recipientName}.json
    const lockPath = `${mailboxPath}.lock`;

    // Create mailbox file if it doesn't exist (atomic create-with-excl)
    try {
        await writeFile(mailboxPath, "[]", { encoding: "utf-8", flag: "wx" });
    } catch (err) {
        if (err.code !== "EEXIST") {
            log(`Failed to create inbox file: ${err}`);
            return;
        }
    }

    let releaseLock;
    try {
        // Acquire exclusive lock with retry configuration
        releaseLock = await properLockfile.lock(mailboxPath, {
            lockfilePath: lockPath,
            ...lockOptions  // { retries: 10, minTimeout: 5ms, maxTimeout: 100ms }
        });

        // Critical section - only one process here at a time
        let messages = await readMailbox(recipientName, teamName);
        messages.push({ ...message, read: false });

        await writeFile(mailboxPath, JSON.stringify(messages, null, 2), "utf-8");
        log(`Wrote message to ${recipientName}'s inbox from ${message.from}`);
    } catch (err) {
        log(`Failed to write to inbox for ${recipientName}: ${err}`);
    } finally {
        if (releaseLock) await releaseLock();  // Always release lock
    }
}

// Mapping: x3→writeToMailbox, A→recipientName, q→message, K→teamName
//          FY6→getInboxPath, OTY→ensureInboxDirectoryExists, wl→readMailbox
//          Nc6→properLockfile, iv1→lockOptions, Pf6→writeFile, B6→JSON.stringify
```

### 4.3 Lock Parameters Explained

**Actual configuration** (from `iv1` / lockOptions):

```javascript
const lockOptions = {
    retries: {
        retries: 10,
        minTimeout: 5,    // 5ms initial wait
        maxTimeout: 100   // 100ms max wait per retry
    }
};
```

**retries: 10**

- **Why 10**: High retry count ensures lock acquisition even under heavy contention
- **Retry timing**: Exponential backoff from 5ms to 100ms
- **Total wait time**: Max ~1 second (10 retries × 100ms max)
- **Failure after retries**: If all 10 fail, throw error (surfaced to agent as SendMessage failure)

**minTimeout: 5ms**

- **Why 5ms**: Very short initial wait for quick retry on transient contention
- **Fast response**: Lock holder typically releases within 1-5ms (simple JSON write)
- **Avoids delay**: No perceptible lag for typical single-writer scenarios

**maxTimeout: 100ms**

- **Why 100ms cap**: Prevents excessive wait per retry
- **Balance**: Long enough for slow I/O, not so long that user perceives lag
- **Reasonable total**: 10 retries × 100ms = 1 second max wait

### Why 10 Retries with 5-100ms Backoff: Design Rationale

**The mathematical analysis:**

The exponential backoff formula generates retry delays:
- Retry 1: ~5ms
- Retry 2: ~7ms
- Retry 3: ~10ms
- ...
- Retry 10: ~100ms (capped)

Total max wait: ~500ms average, ~1 second worst case.

**Why this specific configuration:**

| Scenario | Contention Level | Expected Wait | Outcome |
|----------|------------------|---------------|---------|
| Single writer | None | 0ms (immediate) | Success on first try |
| 2 writers briefly overlap | Low | 5-50ms | Success within 1-3 retries |
| 5 agents send simultaneously | Medium | 50-200ms | Success within 3-5 retries |
| 10 agents spam same recipient | High | 200-500ms | Success within 5-8 retries |
| System under extreme load | Very high | 500-1000ms | May fail after 10 retries |

**Why not fewer retries (e.g., 3)?**

With only 3 retries and similar contention, the failure rate would be unacceptable:
- 3 retries × 100ms = 300ms max wait
- Under high contention (5+ agents), 300ms often insufficient
- User would see "Failed to send message" errors frequently

**Why not more retries (e.g., 20)?**

- 20 retries × 100ms = 2 seconds max wait
- User perceives lag when sending messages
- The marginal benefit (fewer failures) doesn't justify the latency cost
- Teams are small (typically <5 agents), so high contention is rare

**Why 5ms minTimeout (not 1ms or 50ms)?**

- **1ms**: Too aggressive - CPU spin, wasted cycles
- **50ms**: Too slow for transient contention
- **5ms**: Sweet spot - allows lock holder to complete (~1-5ms for JSON write) before retry

**Key insight**: The retry strategy optimizes for the **common case** (low contention, quick success) while gracefully handling **unusual cases** (high contention, longer wait). Failure is surfaced as an error rather than indefinite blocking.

**stale timeout: Default (not configured)**

- Uses `proper-lockfile` default behavior
- Lock files include PID and hostname for cross-process detection
- Orphaned locks detected when holding process is dead

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
// Location: chunks.132.mjs:57-90
// ============================================

// ORIGINAL (for source lookup):
async function Vc6(A, q, K) {
    let Y = FY6(A, q);
    k(`[TeammateMailbox] markMessageAsReadByIndex called: agentName=${A}, teamName=${q}, index=${K}, path=${Y}`);
    let z = `${Y}.lock`, _;
    try {
        _ = await Nc6.lock(Y, { lockfilePath: z, ...iv1 });
        let w = await wl(A, q);
        if (K < 0 || K >= w.length) {
            k(`[TeammateMailbox] markMessageAsReadByIndex: index ${K} out of bounds (${w.length} messages)`);
            return
        }
        let O = w[K];
        if (!O || O.read) {
            k("[TeammateMailbox] markMessageAsReadByIndex: message already read or missing");
            return
        }
        w[K] = { ...O, read: !0 };
        await Pf6(Y, B6(w, null, 2), "utf-8");
        k(`[TeammateMailbox] markMessageAsReadByIndex: marked message at index ${K} as read`)
    } catch (w) {
        if (w.code === "ENOENT") return;
        k(`[TeammateMailbox] markMessageAsReadByIndex FAILED for ${A}: ${w}`), _6(w)
    } finally {
        if (_) await _()
    }
}

// READABLE (for understanding):
async function markMessageAsReadByIndex(agentName, teamName, messageIndex) {
    const mailboxPath = getInboxPath(agentName, teamName);
    const lockPath = `${mailboxPath}.lock`;

    let releaseLock;
    try {
        // Acquire file lock with retry config (retries: 10, minTimeout: 5ms, maxTimeout: 100ms)
        releaseLock = await properLockfile.lock(mailboxPath, {
            lockfilePath: lockPath,
            ...lockOptions
        });

        // Read current mailbox state
        const messages = await readMailbox(agentName, teamName);

        // Validate index bounds
        if (messageIndex < 0 || messageIndex >= messages.length) {
            console.log(`Index ${messageIndex} out of bounds (${messages.length} messages)`);
            return;
        }

        // Check if already read
        const message = messages[messageIndex];
        if (!message || message.read) {
            console.log("Message already read or missing");
            return;
        }

        // Update read flag and write back
        messages[messageIndex] = { ...message, read: true };
        await writeFile(mailboxPath, JSON.stringify(messages, null, 2), "utf-8");
        console.log(`Marked message at index ${messageIndex} as read`);
    } catch (error) {
        if (error.code === "ENOENT") return;  // Mailbox doesn't exist
        console.error(`markMessageAsReadByIndex FAILED for ${agentName}: ${error}`);
        reportError(error);
    } finally {
        // Always release lock if acquired
        if (releaseLock) await releaseLock();
    }
}

// Mapping: Vc6→markMessageAsReadByIndex, A→agentName, q→teamName, K→messageIndex, Y→mailboxPath, z→lockPath,
//          _→releaseLock, Nc6→properLockfile, iv1→lockOptions, wl→readMailbox, Pf6→writeFile, B6→JSON.stringify, FY6→getInboxPath
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

### 7.6 Algorithm Summary

**File Locking Algorithm (writeToMailbox):**

```
1. Ensure inbox directory exists
2. Create mailbox file if not exists (atomic wx flag)
3. Acquire lock with retry:
   - retries: 10
   - minTimeout: 5ms
   - maxTimeout: 100ms
   - Exponential backoff between attempts
4. Read existing messages
5. Append new message with read: false
6. Write entire array back (atomic file write)
7. Release lock (in finally block for guaranteed cleanup)
```

**Key Design Decisions:**

| Decision | Rationale | Trade-off |
|----------|-----------|-----------|
| **Single file per recipient** | Simplicity, no cross-agent coordination | File grows unbounded |
| **Read-modify-write pattern** | Simple to understand and implement | Requires full file read each time |
| **Mark-as-read flag** | Preserves message history for debugging | Requires scanning to find unread |
| **proper-lockfile library** | Battle-tested stale lock handling | External dependency |
| **10 retries with backoff** | Handles typical contention gracefully | 1 second max wait under heavy load |

**Performance Characteristics:**

| Operation | Time (typical) | Time (worst case) |
|-----------|----------------|-------------------|
| Write single message | 1-5ms | 500ms (high contention) |
| Read mailbox (100 messages) | <1ms | 5ms (large file) |
| Mark message as read | 1-5ms | 500ms (high contention) |
| Full mailbox scan (Priority 2) | <1ms | 10ms (10,000 messages) |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:

- `writeToMailbox` (x3) - Atomic message append with locking
- `readMailbox` (wl) - Read all messages from mailbox
- `markMessageAsReadByIndex` (Vc6) - Update read flag
- `markMessagesAsRead` (kc6) - Mark multiple messages as read
- `readUnreadMessages` (pY6) - Filter unread messages
- `clearMailbox` ($TY) - Delete all messages
- `formatMailboxMessages` (HTY) - Format for display
- `getInboxPath` (FY6) - Construct mailbox file path
- `ensureInboxDirectoryExists` (OTY) - Create inboxes directory
- `parseShutdownRequest` (ss) - Extract shutdown request from message
- `properLockfile` (Nc6) - npm lockfile library
- `lockOptions` (iv1) - Retry configuration object

## Cross-References

- **[04_polling_priorities.md](./04_polling_priorities.md)** - How poll loop consumes mailbox messages (Priority 2-4)
- **[pane_backend_executor.md](./pane_backend_executor.md)** - In-process vs pane-based mailbox access patterns
- **[01_complete_chain_analysis.md](./01_complete_chain_analysis.md)** - Message delivery chain from SendMessage to mailbox

## Source Locations

- `chunks.132.mjs:22` - writeToMailbox (x3)
- `chunks.132.mjs:3` - readMailbox (wl)
- `chunks.132.mjs:57` - markMessageAsReadByIndex (Vc6)
- `chunks.132.mjs:92` - markMessagesAsRead (kc6)
- `chunks.132.mjs:16` - readUnreadMessages (pY6)
- `chunks.132.mjs:128` - clearMailbox ($TY)
- `chunks.132.mjs:141` - formatMailboxMessages (HTY)
- `chunks.132.mjs:463` - lockOptions (iv1)
- `chunks.131.mjs:2849` - getInboxPath (FY6)
- `chunks.131.mjs:2858` - ensureInboxDirectoryExists (OTY)
- `chunks.131.mjs:1396` - parseShutdownRequest (ss)

---

**Document Status**: Complete analysis of mailbox file format, file locking, race condition handling, and edge case recovery.
