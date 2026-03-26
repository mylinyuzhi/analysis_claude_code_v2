# Mailbox System Complete Source V2 (Claude Code 2.1.76)

> Complete source-level restoration of the teammate mailbox system including file-based message queues, locking mechanism, and message formatting.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `wl` - Read mailbox — `chunks.132.mjs:3`
- `pY6` - Read unread messages — `chunks.132.mjs:16`
- `x3` - Write to mailbox — `chunks.132.mjs:22`
- `Vc6` - Mark message as read by index — `chunks.132.mjs:57`
- `kc6` - Mark all messages as read — `chunks.132.mjs:92`
- `$TY` - Clear mailbox — `chunks.132.mjs:128`
- `HTY` - Format mailbox messages — `chunks.132.mjs:141`
- `Ec6` - Build idle notification — `chunks.132.mjs:153`
- `yc6` - Parse idle notification — `chunks.132.mjs:166`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MAILBOX SYSTEM ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────────────────┘

Team Lead Agent                                    Teammate Agent
      │                                                  │
      │   x3 (writeToMailbox)                           │
      │─────────────────────────────────────────────────►│
      │                                                  │
      │   .claude/teams/{teamName}/{agentName}.json     │
      │                                                  │
      │   [                                              │
      │     { "from": "lead", "text": "...", "read": false },
      │     { "from": "lead", "text": "...", "read": true }
      │   ]                                              │
      │                                                  │
      │                              wl (readMailbox) ◄──┤
      │                                                  │
      │                              Vc6 (markAsRead) ───►│
      │                                                  │
      │                              HTY (format) ◄──────┤
      │                                                  │

File Locking (.lock file):
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│   mailbox.json.lock                                                          │
│   - Prevents concurrent writes                                               │
│   - Released after operation completes                                       │
│   - ProperLockfile library (Nc6)                                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Function: readMailbox (wl)

```javascript
// ============================================
// wl - readMailbox - Read all messages from agent's mailbox
// Location: chunks.132.mjs:3-14
// ============================================

// ORIGINAL (for source lookup):
async function wl(A, q) {
    let K = FY6(A, q);
    k(`[TeammateMailbox] readMailbox: path=${K}`);
    try {
        let Y = await xd4(K, "utf-8"),
            z = i1(Y);
        return k(`[TeammateMailbox] readMailbox: read ${z.length} message(s)`), z
    } catch (Y) {
        if (Y.code === "ENOENT") return k("[TeammateMailbox] readMailbox: file does not exist"), [];
        return k(`Failed to read inbox for ${A}: ${Y}`), _6(Y), []
    }
}

// READABLE (for understanding):
async function readMailbox(agentName, teamName) {
    // Step 1: Build mailbox file path
    let mailboxPath = getMailboxPath(agentName, teamName);
    logDebug(`[TeammateMailbox] readMailbox: path=${mailboxPath}`);

    try {
        // Step 2: Read file contents
        let fileContents = await fs.readFile(mailboxPath, "utf-8");

        // Step 3: Parse JSON array
        let messages = JSON.parse(fileContents);

        logDebug(`[TeammateMailbox] readMailbox: read ${messages.length} message(s)`);
        return messages;

    } catch (error) {
        // Handle file not existing (empty mailbox)
        if (error.code === "ENOENT") {
            logDebug("[TeammateMailbox] readMailbox: file does not exist");
            return [];
        }

        // Log other errors and return empty array
        logError(`Failed to read inbox for ${agentName}: ${error}`);
        return [];
    }
}

// Mapping: wl→readMailbox, A→agentName, q→teamName, K→mailboxPath, Y→fileContents/error,
//          z→messages, FY6→getMailboxPath, xd4→fs.readFile, i1→JSON.parse, k→logDebug,
//          _6→logError
```

### Mailbox File Path

```javascript
// ============================================
// FY6 - getMailboxPath - Build path to mailbox file
// Location: chunks.132.mjs (inferred)
// ============================================

// READABLE (for understanding):
function getMailboxPath(agentName, teamName) {
    // Path: .claude/teams/{teamName}/{agentName}.json
    return path.join(
        getClaudeDirectory(),
        "teams",
        teamName,
        `${agentName}.json`
    );
}

// Mapping: FY6→getMailboxPath
```

---

## Core Function: readUnreadMessages (pY6)

```javascript
// ============================================
// pY6 - readUnreadMessages - Read only unread messages
// Location: chunks.132.mjs:16-20
// ============================================

// ORIGINAL (for source lookup):
async function pY6(A, q) {
    let K = await wl(A, q),
        Y = K.filter((z) => !z.read);
    return k(`[TeammateMailbox] readUnreadMessages: ${Y.length} unread of ${K.length} total`), Y
}

// READABLE (for understanding):
async function readUnreadMessages(agentName, teamName) {
    // Step 1: Read all messages
    let allMessages = await readMailbox(agentName, teamName);

    // Step 2: Filter to unread only
    let unreadMessages = allMessages.filter((msg) => !msg.read);

    logDebug(`[TeammateMailbox] readUnreadMessages: ${unreadMessages.length} unread of ${allMessages.length} total`);
    return unreadMessages;
}

// Mapping: pY6→readUnreadMessages, A→agentName, q→teamName, K→allMessages, Y→unreadMessages
```

---

## Core Function: writeToMailbox (x3)

```javascript
// ============================================
// x3 - writeToMailbox - Write message to agent's mailbox with locking
// Location: chunks.132.mjs:22-55
// ============================================

// ORIGINAL (for source lookup):
async function x3(A, q, K) {
    await OTY(K);
    let Y = FY6(A, K),
        z = `${Y}.lock`;
    k(`[TeammateMailbox] writeToMailbox: recipient=${A}, from=${q.from}, path=${Y}`);
    try {
        await Pf6(Y, "[]", {
            encoding: "utf-8",
            flag: "wx"
        }), k("[TeammateMailbox] writeToMailbox: created new inbox file")
    } catch (w) {
        if (w.code !== "EEXIST") {
            k(`[TeammateMailbox] writeToMailbox: failed to create inbox file: ${w}`), _6(w);
            return
        }
    }
    let _;
    try {
        _ = await Nc6.lock(Y, {
            lockfilePath: z,
            ...iv1
        });
        let w = await wl(A, K),
            O = {
                ...q,
                read: !1
            };
        w.push(O), await Pf6(Y, B6(w, null, 2), "utf-8"), k(`[TeammateMailbox] Wrote message to ${A}'s inbox from ${q.from}`)
    } catch (w) {
        k(`Failed to write to inbox for ${A}: ${w}`), _6(w)
    } finally {
        if (_) await _()
    }
}

// READABLE (for understanding):
async function writeToMailbox(recipientAgentName, message, teamName) {
    // Step 0: Ensure team directory exists
    await ensureTeamDirectory(teamName);

    // Step 1: Build paths
    let mailboxPath = getMailboxPath(recipientAgentName, teamName);
    let lockPath = `${mailboxPath}.lock`;

    logDebug(`[TeammateMailbox] writeToMailbox: recipient=${recipientAgentName}, from=${message.from}, path=${mailboxPath}`);

    // Step 2: Create mailbox file if it doesn't exist
    try {
        await fs.writeFile(mailboxPath, "[]", {
            encoding: "utf-8",
            flag: "wx"  // Write exclusive - fails if exists
        });
        logDebug("[TeammateMailbox] writeToMailbox: created new inbox file");
    } catch (error) {
        if (error.code !== "EEXIST") {
            logError(`[TeammateMailbox] writeToMailbox: failed to create inbox file: ${error}`);
            return;
        }
        // File exists - this is expected
    }

    // Step 3: Acquire lock and write message
    let releaseLock;
    try {
        // Acquire file lock
        releaseLock = await properLockfile.lock(mailboxPath, {
            lockfilePath: lockPath,
            ...LOCK_OPTIONS
        });

        // Read current messages
        let currentMessages = await readMailbox(recipientAgentName, teamName);

        // Add new message with read: false
        let newMessage = {
            ...message,
            read: false
        };
        currentMessages.push(newMessage);

        // Write updated messages
        await fs.writeFile(mailboxPath, JSON.stringify(currentMessages, null, 2), "utf-8");

        logDebug(`[TeammateMailbox] Wrote message to ${recipientAgentName}'s inbox from ${message.from}`);

    } catch (error) {
        logError(`Failed to write to inbox for ${recipientAgentName}: ${error}`);
    } finally {
        // Step 4: Release lock
        if (releaseLock) {
            await releaseLock();
        }
    }
}

// Mapping: x3→writeToMailbox, A→recipientAgentName, q→message, K→teamName, Y→mailboxPath,
//          z→lockPath, _→releaseLock, w→currentMessages/error, O→newMessage, OTY→ensureTeamDirectory,
//          FY6→getMailboxPath, Pf6→fs.writeFile, Nc6→properLockfile, iv1→LOCK_OPTIONS,
//          wl→readMailbox, B6→JSON.stringify, k→logDebug, _6→logError
```

### Why file locking?

**Purpose:** Prevents race conditions when multiple agents write simultaneously.

**Lock mechanism:**
1. Uses `proper-lockfile` library (Nc6)
2. Creates `.lock` file during operation
3. Other writers wait until lock released
4. Lock released in `finally` block (guaranteed cleanup)

---

## Core Function: markMessageAsReadByIndex (Vc6)

```javascript
// ============================================
// Vc6 - markMessageAsReadByIndex - Mark specific message as read
// Location: chunks.132.mjs:57-90
// ============================================

// ORIGINAL (for source lookup):
async function Vc6(A, q, K) {
    let Y = FY6(A, q);
    k(`[TeammateMailbox] markMessageAsReadByIndex called: agentName=${A}, teamName=${q}, index=${K}, path=${Y}`);
    let z = `${Y}.lock`,
        _;
    try {
        k("[TeammateMailbox] markMessageAsReadByIndex: acquiring lock..."), _ = await Nc6.lock(Y, {
            lockfilePath: z,
            ...iv1
        }), k("[TeammateMailbox] markMessageAsReadByIndex: lock acquired");
        let w = await wl(A, q);
        if (k(`[TeammateMailbox] markMessageAsReadByIndex: read ${w.length} messages after lock`), K < 0 || K >= w.length) {
            k(`[TeammateMailbox] markMessageAsReadByIndex: index ${K} out of bounds (${w.length} messages)`);
            return
        }
        let O = w[K];
        if (!O || O.read) {
            k("[TeammateMailbox] markMessageAsReadByIndex: message already read or missing");
            return
        }
        w[K] = {
            ...O,
            read: !0
        }, await Pf6(Y, B6(w, null, 2), "utf-8"), k(`[TeammateMailbox] markMessageAsReadByIndex: marked message at index ${K} as read`)
    } catch (w) {
        if (w.code === "ENOENT") {
            k(`[TeammateMailbox] markMessageAsReadByIndex: file does not exist at ${Y}`);
            return
        }
        k(`[TeammateMailbox] markMessageAsReadByIndex FAILED for ${A}: ${w}`), _6(w)
    } finally {
        if (_) await _(), k("[TeammateMailbox] markMessageAsReadByIndex: lock released")
    }
}

// READABLE (for understanding):
async function markMessageAsReadByIndex(agentName, teamName, messageIndex) {
    let mailboxPath = getMailboxPath(agentName, teamName);
    logDebug(`[TeammateMailbox] markMessageAsReadByIndex called: agentName=${agentName}, teamName=${teamName}, index=${messageIndex}, path=${mailboxPath}`);

    let lockPath = `${mailboxPath}.lock`;
    let releaseLock;

    try {
        // Step 1: Acquire lock
        logDebug("[TeammateMailbox] markMessageAsReadByIndex: acquiring lock...");
        releaseLock = await properLockfile.lock(mailboxPath, {
            lockfilePath: lockPath,
            ...LOCK_OPTIONS
        });
        logDebug("[TeammateMailbox] markMessageAsReadByIndex: lock acquired");

        // Step 2: Read current messages
        let messages = await readMailbox(agentName, teamName);
        logDebug(`[TeammateMailbox] markMessageAsReadByIndex: read ${messages.length} messages after lock`);

        // Step 3: Validate index
        if (messageIndex < 0 || messageIndex >= messages.length) {
            logDebug(`[TeammateMailbox] markMessageAsReadByIndex: index ${messageIndex} out of bounds (${messages.length} messages)`);
            return;
        }

        // Step 4: Check message exists and not already read
        let message = messages[messageIndex];
        if (!message || message.read) {
            logDebug("[TeammateMailbox] markMessageAsReadByIndex: message already read or missing");
            return;
        }

        // Step 5: Update message
        messages[messageIndex] = {
            ...message,
            read: true
        };

        // Step 6: Write back
        await fs.writeFile(mailboxPath, JSON.stringify(messages, null, 2), "utf-8");
        logDebug(`[TeammateMailbox] markMessageAsReadByIndex: marked message at index ${messageIndex} as read`);

    } catch (error) {
        if (error.code === "ENOENT") {
            logDebug(`[TeammateMailbox] markMessageAsReadByIndex: file does not exist at ${mailboxPath}`);
            return;
        }
        logError(`[TeammateMailbox] markMessageAsReadByIndex FAILED for ${agentName}: ${error}`);
    } finally {
        // Step 7: Release lock
        if (releaseLock) {
            await releaseLock();
            logDebug("[TeammateMailbox] markMessageAsReadByIndex: lock released");
        }
    }
}

// Mapping: Vc6→markMessageAsReadByIndex, A→agentName, q→teamName, K→messageIndex,
//          Y→mailboxPath, z→lockPath, _→releaseLock, w→messages/error, O→message
```

---

## Core Function: markMessagesAsRead (kc6)

```javascript
// ============================================
// kc6 - markMessagesAsRead - Mark all messages as read
// Location: chunks.132.mjs:92-126
// ============================================

// ORIGINAL (for source lookup):
async function kc6(A, q) {
    let K = FY6(A, q);
    k(`[TeammateMailbox] markMessagesAsRead called: agentName=${A}, teamName=${q}, path=${K}`);
    let Y = `${K}.lock`,
        z;
    try {
        k("[TeammateMailbox] markMessagesAsRead: acquiring lock..."), z = await Nc6.lock(K, {
            lockfilePath: Y,
            ...iv1
        }), k("[TeammateMailbox] markMessagesAsRead: lock acquired");
        let _ = await wl(A, q);
        if (k(`[TeammateMailbox] markMessagesAsRead: read ${_.length} messages after lock`), _.length === 0) {
            k("[TeammateMailbox] markMessagesAsRead: no messages to mark");
            return
        }
        let w = _.filter((J) => !J.read).length;
        k(`[TeammateMailbox] markMessagesAsRead: ${w} unread of ${_.length} total`);
        let O = _.map((J) => ({
            ...J,
            read: !0
        }));
        await Pf6(K, B6(O, null, 2), "utf-8"), k(`[TeammateMailbox] markMessagesAsRead: WROTE ${w} message(s) as read to ${K}`);
        let $ = await xd4(K, "utf-8"),
            j = i1($).filter((J) => !J.read).length;
        k(`[TeammateMailbox] markMessagesAsRead: VERIFY - ${j} still unread after write`)
    } catch (_) {
        if (_.code === "ENOENT") {
            k(`[TeammateMailbox] markMessagesAsRead: file does not exist at ${K}`);
            return
        }
        k(`[TeammateMailbox] markMessagesAsRead FAILED for ${A}: ${_}`), _6(_)
    } finally {
        if (z) await z(), k("[TeammateMailbox] markMessagesAsRead: lock released")
    }
}

// READABLE (for understanding):
async function markMessagesAsRead(agentName, teamName) {
    let mailboxPath = getMailboxPath(agentName, teamName);
    logDebug(`[TeammateMailbox] markMessagesAsRead called: agentName=${agentName}, teamName=${teamName}, path=${mailboxPath}`);

    let lockPath = `${mailboxPath}.lock`;
    let releaseLock;

    try {
        // Step 1: Acquire lock
        logDebug("[TeammateMailbox] markMessagesAsRead: acquiring lock...");
        releaseLock = await properLockfile.lock(mailboxPath, {
            lockfilePath: lockPath,
            ...LOCK_OPTIONS
        });
        logDebug("[TeammateMailbox] markMessagesAsRead: lock acquired");

        // Step 2: Read current messages
        let messages = await readMailbox(agentName, teamName);
        logDebug(`[TeammateMailbox] markMessagesAsRead: read ${messages.length} messages after lock`);

        if (messages.length === 0) {
            logDebug("[TeammateMailbox] markMessagesAsRead: no messages to mark");
            return;
        }

        // Step 3: Count unread
        let unreadCount = messages.filter((msg) => !msg.read).length;
        logDebug(`[TeammateMailbox] markMessagesAsRead: ${unreadCount} unread of ${messages.length} total`);

        // Step 4: Mark all as read
        let updatedMessages = messages.map((msg) => ({
            ...msg,
            read: true
        }));

        // Step 5: Write back
        await fs.writeFile(mailboxPath, JSON.stringify(updatedMessages, null, 2), "utf-8");
        logDebug(`[TeammateMailbox] markMessagesAsRead: WROTE ${unreadCount} message(s) as read to ${mailboxPath}`);

        // Step 6: Verify write
        let verifyContents = await fs.readFile(mailboxPath, "utf-8");
        let stillUnread = JSON.parse(verifyContents).filter((msg) => !msg.read).length;
        logDebug(`[TeammateMailbox] markMessagesAsRead: VERIFY - ${stillUnread} still unread after write`);

    } catch (error) {
        if (error.code === "ENOENT") {
            logDebug(`[TeammateMailbox] markMessagesAsRead: file does not exist at ${mailboxPath}`);
            return;
        }
        logError(`[TeammateMailbox] markMessagesAsRead FAILED for ${agentName}: ${error}`);
    } finally {
        // Step 7: Release lock
        if (releaseLock) {
            await releaseLock();
            logDebug("[TeammateMailbox] markMessagesAsRead: lock released");
        }
    }
}

// Mapping: kc6→markMessagesAsRead, A→agentName, q→teamName, K→mailboxPath,
//          Y→lockPath, z→releaseLock, _→messages/error, w→unreadCount, O→updatedMessages,
//          j→stillUnread
```

---

## Core Function: clearMailbox ($TY)

```javascript
// ============================================
// $TY - clearMailbox - Clear all messages from mailbox
// Location: chunks.132.mjs:128-139
// ============================================

// ORIGINAL (for source lookup):
async function $TY(A, q) {
    let K = FY6(A, q);
    try {
        await Pf6(K, "[]", {
            encoding: "utf-8",
            flag: "r+"
        }), k(`[TeammateMailbox] Cleared inbox for ${A}`)
    } catch (Y) {
        if (Y.code === "ENOENT") return;
        k(`Failed to clear inbox for ${A}: ${Y}`), _6(Y)
    }
}

// READABLE (for understanding):
async function clearMailbox(agentName, teamName) {
    let mailboxPath = getMailboxPath(agentName, teamName);

    try {
        // Write empty array (clear all messages)
        await fs.writeFile(mailboxPath, "[]", {
            encoding: "utf-8",
            flag: "r+"  // Read/write, file must exist
        });
        logDebug(`[TeammateMailbox] Cleared inbox for ${agentName}`);

    } catch (error) {
        // Ignore if file doesn't exist
        if (error.code === "ENOENT") {
            return;
        }
        logError(`Failed to clear inbox for ${agentName}: ${error}`);
    }
}

// Mapping: $TY→clearMailbox, A→agentName, q→teamName, K→mailboxPath, Y→error
```

---

## Core Function: formatMailboxMessages (HTY)

```javascript
// ============================================
// HTY - formatMailboxMessages - Format messages as XML for LLM context
// Location: chunks.132.mjs:141-151
// ============================================

// ORIGINAL (for source lookup):
function HTY(A) {
    return A.map((q) => {
        let K = q.color ? ` color="${q.color}"` : "",
            Y = q.summary ? ` summary="${q.summary}"` : "";
        return `<${fj} teammate_id="${q.from}"${K}${Y}>
${q.text}
</${fj}>`
    }).join(`

`)
}

// READABLE (for understanding):
function formatMailboxMessages(messages) {
    return messages.map((msg) => {
        // Build optional attributes
        let colorAttr = msg.color ? ` color="${msg.color}"` : "";
        let summaryAttr = msg.summary ? ` summary="${msg.summary}"` : "";

        // Build XML element
        return `<teammate_message teammate_id="${msg.from}"${colorAttr}${summaryAttr}>
${msg.text}
</teammate_message>`;

    }).join("\n\n");  // Double newline between messages
}

// Mapping: HTY→formatMailboxMessages, A→messages, q→msg, K→colorAttr, Y→summaryAttr,
//          fj→"teammate_message"
```

### Output Format

```xml
<teammate_message teammate_id="lead" color="blue" summary="Task update">
Please focus on the API implementation first.
</teammate_message>

<teammate_message teammate_id="researcher" summary="Found relevant docs">
I found documentation about the API at /docs/api.md
</teammate_message>
```

---

## Helper Functions

### buildIdleNotification (Ec6)

```javascript
// ============================================
// Ec6 - buildIdleNotification - Create idle notification message
// Location: chunks.132.mjs:153-164
// ============================================

// ORIGINAL (for source lookup):
function Ec6(A, q) {
    return {
        type: "idle_notification",
        from: A,
        timestamp: new Date().toISOString(),
        idleReason: q?.idleReason,
        summary: q?.summary,
        completedTaskId: q?.completedTaskId,
        completedStatus: q?.completedStatus,
        failureReason: q?.failureReason
    }
}

// READABLE (for understanding):
function buildIdleNotification(agentName, options) {
    return {
        type: "idle_notification",
        from: agentName,
        timestamp: new Date().toISOString(),
        idleReason: options?.idleReason,
        summary: options?.summary,
        completedTaskId: options?.completedTaskId,
        completedStatus: options?.completedStatus,
        failureReason: options?.failureReason
    };
}

// Mapping: Ec6→buildIdleNotification, A→agentName, q→options
```

### parseIdleNotification (yc6)

```javascript
// ============================================
// yc6 - parseIdleNotification - Parse idle notification from JSON
// Location: chunks.132.mjs:166-172
// ============================================

// ORIGINAL (for source lookup):
function yc6(A) {
    try {
        let q = i1(A);
        if (q && q.type === "idle_notification") return q
    } catch {}
    return null
}

// READABLE (for understanding):
function parseIdleNotification(jsonString) {
    try {
        let parsed = JSON.parse(jsonString);
        if (parsed && parsed.type === "idle_notification") {
            return parsed;
        }
    } catch {
        // Invalid JSON or not an idle notification
    }
    return null;
}

// Mapping: yc6→parseIdleNotification, A→jsonString, q→parsed, i1→JSON.parse
```

---

## Message Types

### Mailbox Message Structure

```typescript
interface MailboxMessage {
    from: string;          // Sender agent name
    text: string;          // Message content
    read: boolean;         // Read status
    color?: string;        // Optional color for display
    summary?: string;      // Optional summary for context
}

interface IdleNotification {
    type: "idle_notification";
    from: string;
    timestamp: string;
    idleReason?: string;
    summary?: string;
    completedTaskId?: string;
    completedStatus?: string;
    failureReason?: string;
}
```

---

## File Locking Deep Dive

### Lock Options (iv1)

```javascript
// READABLE (for understanding):
const LOCK_OPTIONS = {
    stale: 10000,      // Lock is stale after 10 seconds
    retries: 3,        // Retry 3 times to acquire lock
    retryWait: 100     // Wait 100ms between retries
};
```

### Lock Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FILE LOCKING FLOW                                    │
└─────────────────────────────────────────────────────────────────────────────┘

Writer A                            Writer B
    │                                   │
    │ Nc6.lock()                        │
    │───────────────────────────────►   │
    │                                   │
    │ [mailbox.json.lock created]       │ Nc6.lock()
    │                                   │──────────────────────►
    │                                   │
    │ write operation                   │ [Waits for lock...]
    │                                   │
    │ releaseLock()                     │
    │───────────────────────────────►   │
    │                                   │
    │ [mailbox.json.lock deleted]       │ [Lock acquired]
    │                                   │
    │                                   │ write operation
    │                                   │
    │                                   │ releaseLock()
    │                                   │
```

---

## Key Design Decisions

### 1. File-Based Messaging

**Why files instead of memory?**
- **Persistence:** Messages survive process restarts
- **Isolation:** Each agent has independent mailbox file
- **Debugging:** Can inspect messages on disk
- **Simplicity:** No need for message broker

### 2. JSON Array Format

**Why JSON array?**
- **Simple:** Append is just array.push()
- **Readable:** Human-readable for debugging
- **Atomic:** Single file write is atomic

### 3. File Locking

**Why explicit locking?**
- **Concurrency:** Multiple agents may write simultaneously
- **Safety:** Prevents race conditions and data corruption
- **Reliability:** Uses proven `proper-lockfile` library

### 4. Read Tracking

**Why `read` boolean instead of separate tracking?**
- **Simplicity:** Single source of truth in message
- **Persistence:** Read state survives restart
- **Atomicity:** Update is single file write

---

## Source File References

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `wl` | readMailbox | chunks.132.mjs:3 | ✓ Verified |
| `pY6` | readUnreadMessages | chunks.132.mjs:16 | ✓ Verified |
| `x3` | writeToMailbox | chunks.132.mjs:22 | ✓ Verified |
| `Vc6` | markMessageAsReadByIndex | chunks.132.mjs:57 | ✓ Verified |
| `kc6` | markMessagesAsRead | chunks.132.mjs:92 | ✓ Verified |
| `$TY` | clearMailbox | chunks.132.mjs:128 | ✓ Verified |
| `HTY` | formatMailboxMessages | chunks.132.mjs:141 | ✓ Verified |
| `Ec6` | buildIdleNotification | chunks.132.mjs:153 | ✓ Verified |
| `yc6` | parseIdleNotification | chunks.132.mjs:166 | ✓ Verified |

---

## Related Documents

- [teammate_execution_complete_source_v2.md](./teammate_execution_complete_source_v2.md) - Teammate execution
- [agent_loop_complete_source_v3.md](./agent_loop_complete_source_v3.md) - Agent loop
- [../30_agent_teams/](../30_agent_teams/) - Agent teams module