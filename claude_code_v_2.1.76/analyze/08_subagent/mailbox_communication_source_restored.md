# Mailbox Communication System - Complete Source Restoration (Claude Code 2.1.76)

> Source-level analysis of the file-based message queue system for teammate coordination.
> Includes complete ORIGINAL/READABLE code restoration with cross-validated symbols.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `readMailbox` (wl) - Read all messages from mailbox — `chunks.132.mjs:3`
- `readUnreadMessages` (pY6) - Read only unread messages — `chunks.132.mjs:16`
- `writeToMailbox` (x3) - Write message to mailbox — `chunks.132.mjs:22`
- `markMessageAsReadByIndex` (Vc6) - Mark single message as read — `chunks.132.mjs:57`
- `markMessagesAsRead` (kc6) - Mark all messages as read — `chunks.132.mjs:92`
- `clearMailbox` ($TY) - Clear all messages from mailbox — `chunks.132.mjs:128`
- `formatMailboxMessages` (HTY) - Format messages as XML — `chunks.132.mjs:141`

---

## Overview

The mailbox system provides **file-based inter-process communication** for teammate agents. It enables:
- Asynchronous message passing between agents
- Persistent message storage (survives crashes)
- Lock-based concurrent access safety
- Read/unread message tracking

### Why File-Based Mailboxes?

**What it does:** Uses JSON files stored in the filesystem as message queues.

**Why this approach:**
- **Persistence** - Messages survive process crashes and restarts
- **No dependencies** - No external message queue infrastructure needed
- **Human-readable** - Can inspect/debug via file system
- **Simple API** - Standard file operations with lock protection

---

## Mailbox File Paths

### Location Structure

```
~/.claude/teams/{teamName}/inbox/{agentName}.json
```

**Example paths:**
- `~/.claude/teams/my-team/inbox/worker-1.json` — Worker-1's inbox
- `~/.claude/teams/my-team/inbox/lead.json` — Lead agent's inbox

### Path Generation

The `getMailboxPath` function (FY6) generates the path:

```javascript
// ============================================
// FY6 - getMailboxPath - Generate mailbox file path
// Location: chunks.131.mjs (inferred)
// ============================================

// READABLE (for understanding):
function getMailboxPath(agentName, teamName) {
    return path.join(
        os.homedir(),
        ".claude",
        "teams",
        teamName,
        "inbox",
        `${agentName}.json`
    );
}
```

---

## readMailbox (wl)

### What it does

Reads all messages from an agent's mailbox file. Returns an empty array if the file doesn't exist.

### How it works

1. Construct the mailbox path using `getMailboxPath` (FY6)
2. Try to read the file
3. Parse JSON content
4. Return message array (or empty array on error)

### Source Code

```javascript
// ============================================
// wl - readMailbox - Read all messages from mailbox
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
    let mailboxPath = getMailboxPath(agentName, teamName);
    logDebug(`[TeammateMailbox] readMailbox: path=${mailboxPath}`);

    try {
        let fileContent = await fs.readFile(mailboxPath, "utf-8");
        let messages = JSON.parse(fileContent);
        logDebug(`[TeammateMailbox] readMailbox: read ${messages.length} message(s)`);
        return messages;
    } catch (error) {
        // File doesn't exist - return empty array
        if (error.code === "ENOENT") {
            logDebug("[TeammateMailbox] readMailbox: file does not exist");
            return [];
        }
        // Other errors - log and return empty array
        logDebug(`Failed to read inbox for ${agentName}: ${error}`);
        reportError(error);
        return [];
    }
}

// Mapping: wl→readMailbox, A→agentName, q→teamName, K→mailboxPath,
// FY6→getMailboxPath, xd4→fs.readFile, i1→JSON.parse, k→logDebug, _6→reportError
```

### Key Insight

The function **silently handles errors** by returning an empty array. This makes it safe to call even when the mailbox doesn't exist yet.

---

## readUnreadMessages (pY6)

### What it does

Reads only messages that haven't been marked as read. Used by the poll loop to find new messages.

### Source Code

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
    let allMessages = await readMailbox(agentName, teamName);
    let unreadMessages = allMessages.filter((msg) => !msg.read);
    logDebug(`[TeammateMailbox] readUnreadMessages: ${unreadMessages.length} unread of ${allMessages.length} total`);
    return unreadMessages;
}

// Mapping: pY6→readUnreadMessages, A→agentName, q→teamName, wl→readMailbox
```

---

## writeToMailbox (x3)

### What it does

Writes a message to an agent's mailbox with lock-based concurrency protection.

### How it works

1. Ensure the team directory exists (`validateTeamContext`)
2. Get the mailbox path
3. Create the file if it doesn't exist (with empty array)
4. Acquire a file lock
5. Read current messages
6. Append new message with `read: false`
7. Write back to file
8. Release lock

### Why Lock-Based?

File-based mailboxes need **atomic read-modify-write** operations. Without locking:
- Two processes could read the same file simultaneously
- Both would append their messages
- The second write would overwrite the first

### Source Code

```javascript
// ============================================
// x3 - writeToMailbox - Write message to mailbox with locking
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
async function writeToMailbox(recipientName, message, teamName) {
    // Step 1: Ensure team directory exists
    await validateTeamContext(teamName);

    let mailboxPath = getMailboxPath(recipientName, teamName);
    let lockPath = `${mailboxPath}.lock`;

    logDebug(`[TeammateMailbox] writeToMailbox: recipient=${recipientName}, from=${message.from}, path=${mailboxPath}`);

    // Step 2: Create file if it doesn't exist (atomic "wx" flag)
    try {
        await fs.writeFile(mailboxPath, "[]", {
            encoding: "utf-8",
            flag: "wx"  // Write exclusive - fails if file exists
        });
        logDebug("[TeammateMailbox] writeToMailbox: created new inbox file");
    } catch (error) {
        // EEXIST is expected - file already exists
        if (error.code !== "EEXIST") {
            logDebug(`[TeammateMailbox] writeToMailbox: failed to create inbox file: ${error}`);
            reportError(error);
            return;
        }
    }

    // Step 3: Acquire lock and perform read-modify-write
    let releaseLock;
    try {
        releaseLock = await fileLock.lock(mailboxPath, {
            lockfilePath: lockPath,
            ...lockOptions
        });

        // Read current messages
        let messages = await readMailbox(recipientName, teamName);

        // Append new message with read=false
        let newMessage = {
            ...message,
            read: false
        };
        messages.push(newMessage);

        // Write back atomically
        await fs.writeFile(mailboxPath, JSON.stringify(messages, null, 2), "utf-8");
        logDebug(`[TeammateMailbox] Wrote message to ${recipientName}'s inbox from ${message.from}`);

    } catch (error) {
        logDebug(`Failed to write to inbox for ${recipientName}: ${error}`);
        reportError(error);
    } finally {
        // Always release the lock
        if (releaseLock) await releaseLock();
    }
}

// Mapping: x3→writeToMailbox, A→recipientName, q→message, K→teamName,
// OTY→validateTeamContext, FY6→getMailboxPath, Pf6→fs.writeFile,
// Nc6.lock→fileLock.lock, wl→readMailbox, B6→JSON.stringify, iv1→lockOptions
```

---

## markMessageAsReadByIndex (Vc6)

### What it does

Marks a specific message as read by its index in the message array. Used after processing a message.

### How it works

1. Acquire file lock
2. Read all messages
3. Update the specific message's `read` field
4. Write back to file
5. Release lock

### Source Code

```javascript
// ============================================
// Vc6 - markMessageAsReadByIndex - Mark single message as read
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
        logDebug("[TeammateMailbox] markMessageAsReadByIndex: acquiring lock...");
        releaseLock = await fileLock.lock(mailboxPath, {
            lockfilePath: lockPath,
            ...lockOptions
        });
        logDebug("[TeammateMailbox] markMessageAsReadByIndex: lock acquired");

        // Read current messages
        let messages = await readMailbox(agentName, teamName);
        logDebug(`[TeammateMailbox] markMessageAsReadByIndex: read ${messages.length} messages after lock`);

        // Validate index
        if (messageIndex < 0 || messageIndex >= messages.length) {
            logDebug(`[TeammateMailbox] markMessageAsReadByIndex: index ${messageIndex} out of bounds (${messages.length} messages)`);
            return;
        }

        let message = messages[messageIndex];

        // Skip if already read or missing
        if (!message || message.read) {
            logDebug("[TeammateMailbox] markMessageAsReadByIndex: message already read or missing");
            return;
        }

        // Update message
        messages[messageIndex] = {
            ...message,
            read: true
        };

        // Write back
        await fs.writeFile(mailboxPath, JSON.stringify(messages, null, 2), "utf-8");
        logDebug(`[TeammateMailbox] markMessageAsReadByIndex: marked message at index ${messageIndex} as read`);

    } catch (error) {
        if (error.code === "ENOENT") {
            logDebug(`[TeammateMailbox] markMessageAsReadByIndex: file does not exist at ${mailboxPath}`);
            return;
        }
        logDebug(`[TeammateMailbox] markMessageAsReadByIndex FAILED for ${agentName}: ${error}`);
        reportError(error);
    } finally {
        if (releaseLock) {
            await releaseLock();
            logDebug("[TeammateMailbox] markMessageAsReadByIndex: lock released");
        }
    }
}

// Mapping: Vc6→markMessageAsReadByIndex, A→agentName, q→teamName, K→messageIndex
```

---

## markMessagesAsRead (kc6)

### What it does

Marks all messages in the mailbox as read. Used when an agent wants to clear unread status.

### Source Code

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
        logDebug("[TeammateMailbox] markMessagesAsRead: acquiring lock...");
        releaseLock = await fileLock.lock(mailboxPath, {
            lockfilePath: lockPath,
            ...lockOptions
        });
        logDebug("[TeammateMailbox] markMessagesAsRead: lock acquired");

        let messages = await readMailbox(agentName, teamName);
        logDebug(`[TeammateMailbox] markMessagesAsRead: read ${messages.length} messages after lock`);

        if (messages.length === 0) {
            logDebug("[TeammateMailbox] markMessagesAsRead: no messages to mark");
            return;
        }

        let unreadCount = messages.filter((msg) => !msg.read).length;
        logDebug(`[TeammateMailbox] markMessagesAsRead: ${unreadCount} unread of ${messages.length} total`);

        // Mark all as read
        let updatedMessages = messages.map((msg) => ({
            ...msg,
            read: true
        }));

        await fs.writeFile(mailboxPath, JSON.stringify(updatedMessages, null, 2), "utf-8");
        logDebug(`[TeammateMailbox] markMessagesAsRead: WROTE ${unreadCount} message(s) as read to ${mailboxPath}`);

        // Verify write
        let verifyContent = await fs.readFile(mailboxPath, "utf-8");
        let stillUnread = JSON.parse(verifyContent).filter((msg) => !msg.read).length;
        logDebug(`[TeammateMailbox] markMessagesAsRead: VERIFY - ${stillUnread} still unread after write`);

    } catch (error) {
        if (error.code === "ENOENT") {
            logDebug(`[TeammateMailbox] markMessagesAsRead: file does not exist at ${mailboxPath}`);
            return;
        }
        logDebug(`[TeammateMailbox] markMessagesAsRead FAILED for ${agentName}: ${error}`);
        reportError(error);
    } finally {
        if (releaseLock) {
            await releaseLock();
            logDebug("[TeammateMailbox] markMessagesAsRead: lock released");
        }
    }
}

// Mapping: kc6→markMessagesAsRead, A→agentName, q→teamName
```

---

## formatMailboxMessages (HTY)

### What it does

Formats messages as XML for inclusion in the system prompt. Used when a teammate checks their mailbox.

### Source Code

```javascript
// ============================================
// HTY - formatMailboxMessages - Format messages as XML
// Location: chunks.132.mjs:141-150
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
        let colorAttr = msg.color ? ` color="${msg.color}"` : "";
        let summaryAttr = msg.summary ? ` summary="${msg.summary}"` : "";

        return `<teammate_message teammate_id="${msg.from}"${colorAttr}${summaryAttr}>
${msg.text}
</teammate_message>`;
    }).join("\n\n");
}

// Mapping: HTY→formatMailboxMessages, A→messages, fj→"teammate_message"
```

### Output Format

```xml
<teammate_message teammate_id="lead" color="#4A90D9" summary="Task update">
Please check the API implementation for edge cases.
</teammate_message>

<teammate_message teammate_id="worker-2">
I found the issue - the timeout was too short.
</teammate_message>
```

---

## Message Structure

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `from` | string | Sender's agent name |
| `text` | string | Message content |
| `read` | boolean | Whether message has been read |
| `color` | string? | Optional color for UI display |
| `summary` | string? | Optional short summary |
| `timestamp` | number? | Optional Unix timestamp |

### Example Message

```json
{
    "from": "lead",
    "text": "Please review the authentication module before proceeding.",
    "read": false,
    "color": "#4A90D9",
    "summary": "Review request",
    "timestamp": 1711459200000
}
```

---

## Integration with pollForNextMessage (DNY)

The mailbox functions are called from the poll loop in `pollForNextMessage`:

```javascript
// ============================================
// DNY - pollForNextMessage - Poll loop for teammate messages
// Location: chunks.134.mjs:1483-1569
// ============================================

// READABLE (for understanding):
async function pollForNextMessage(identity, abortController, taskId, getAppState, setAppState, taskList) {
    logDebug(`[inProcessRunner] ${identity.agentName} starting poll loop (abort=${abortController.signal.aborted})`);

    let pollCount = 0;

    while (!abortController.signal.aborted) {
        // Check for pending user messages first (higher priority)
        let task = getAppState().tasks[taskId];
        if (task?.type === "in_process_teammate" && task.pendingUserMessages.length > 0) {
            let message = task.pendingUserMessages[0];
            // Remove from pending list
            setAppState((state) => ({
                ...state,
                tasks: {
                    ...state.tasks,
                    [taskId]: {
                        ...state.tasks[taskId],
                        pendingUserMessages: state.tasks[taskId].pendingUserMessages.slice(1)
                    }
                }
            }));
            return { type: "new_message", message, from: "user" };
        }

        // Poll mailbox for new messages
        try {
            let messages = await readMailbox(identity.agentName, identity.teamName);

            // Find first unread message
            let unreadIndex = messages.findIndex((msg) => !msg.read);

            if (unreadIndex !== -1) {
                let message = messages[unreadIndex];
                logDebug(`[inProcessRunner] ${identity.agentName} received new message from ${message.from} (index ${unreadIndex})`);

                // Mark as read
                await markMessageAsReadByIndex(identity.agentName, identity.teamName, unreadIndex);

                return {
                    type: "new_message",
                    message: message.text,
                    from: message.from,
                    color: message.color,
                    summary: message.summary
                };
            }
        } catch (error) {
            logDebug(`[inProcessRunner] ${identity.agentName} poll error: ${error}`);
        }

        // Check for unclaimed tasks
        let claimedTask = await claimUnclaimedTask(taskList, identity.agentName);
        if (claimedTask) {
            return { type: "new_message", message: claimedTask, from: "task-list" };
        }

        // Wait before next poll
        if (pollCount > 0) await sleep(500);
        pollCount++;
    }

    return { type: "aborted" };
}
```

---

## Algorithm: Lock-Based Concurrent Access

### Problem

Multiple agents may write to the same mailbox concurrently, causing race conditions.

### Solution

Use file-based locking with the following pattern:

```
1. Create lock file: {mailbox}.lock
2. Perform read-modify-write operation
3. Remove lock file
```

### Key Insight

The lock is **cooperative** - all code must use the same locking mechanism. The `lockfilePath` parameter ensures atomic lock acquisition.

---

## Error Handling

### ENOENT (File Not Found)

- `readMailbox`: Returns empty array
- `writeToMailbox`: Creates new file
- `markMessageAsReadByIndex`: Silently returns

### Lock Acquisition Failure

- Logged as error
- Operation aborted gracefully

### JSON Parse Errors

- Logged and empty array returned
- Prevents crash on corrupt file

---

## Cross-Validation Summary

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| `wl` | readMailbox | chunks.132.mjs:3 | ✓ Verified |
| `pY6` | readUnreadMessages | chunks.132.mjs:16 | ✓ Verified |
| `x3` | writeToMailbox | chunks.132.mjs:22 | ✓ Verified |
| `Vc6` | markMessageAsReadByIndex | chunks.132.mjs:57 | ✓ Verified |
| `kc6` | markMessagesAsRead | chunks.132.mjs:92 | ✓ Verified |
| `$TY` | clearMailbox | chunks.132.mjs:128 | ✓ Verified |
| `HTY` | formatMailboxMessages | chunks.132.mjs:141 | ✓ Verified |
| `DNY` | pollForNextMessage | chunks.134.mjs:1483 | ✓ Verified |
| `Ji4` | claimUnclaimedTask | chunks.134.mjs:1464 | ✓ Verified |

---

## Related Documents

- [pollForNextMessage Deep Dive](./communication_and_coordination.md) - Poll loop details
- [spawnTeammate](./teammate_spawning.md) - Teammate spawning
- [Agent Teams](../30_agent_teams/) - Multi-agent coordination