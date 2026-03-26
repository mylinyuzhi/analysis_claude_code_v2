# Mailbox Communication System - Complete Analysis (Claude Code 2.1.76)

> Source-level analysis of the file-based inter-agent messaging system used for teammate coordination.
> Cross-validated against source code on 2026-03-26.

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
- `clearMailbox` ($TY) - Clear all messages — `chunks.132.mjs:128`
- `formatMailboxMessages` (HTY) - Format messages as XML — `chunks.132.mjs:141`
- `buildIdleNotification` (Ec6) - Build idle notification — `chunks.132.mjs:153`
- `parseIdleNotification` (yc6) - Parse idle notification — `chunks.132.mjs:166`
- `buildPermissionRequest` (Xx8) - Build permission request — `chunks.132.mjs:174`
- `buildPermissionResponse` (Px8) - Build permission response — `chunks.132.mjs:187`

---

## Architecture Overview

### Why File-Based Messaging?

The mailbox system uses JSONL files for inter-agent communication because:

1. **Process Isolation** - Teammates may run in separate processes (split-pane, tmux)
2. **Persistence** - Messages survive process crashes
3. **Simple Protocol** - No need for IPC sockets or message queues
4. **Human Readable** - Debugging is straightforward

### File Path Structure

```
~/.claude/sessions/{sessionId}/agents/{agentName}/mailbox.jsonl
```

Each agent has its own mailbox file. Messages are appended to the file and marked as read.

---

## Core Functions

### wl - readMailbox

**What it does:** Reads all messages from an agent's mailbox file.

**How it works:**

```javascript
// ============================================
// readMailbox - Read all messages from mailbox
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
    let mailboxPath = getInboxPath(agentName, teamName);
    log(`[TeammateMailbox] readMailbox: path=${mailboxPath}`);

    try {
        let content = await fs.readFile(mailboxPath, "utf-8");
        let messages = parseJsonl(content);
        log(`[TeammateMailbox] readMailbox: read ${messages.length} message(s)`);
        return messages;
    } catch (err) {
        if (err.code === "ENOENT") {
            log("[TeammateMailbox] readMailbox: file does not exist");
            return [];  // Empty mailbox is valid
        }
        log(`Failed to read inbox for ${agentName}: ${err}`);
        reportError(err);
        return [];
    }
}

// Mapping: wl→readMailbox, A→agentName, q→teamName, FY6→getInboxPath,
// xd4→fs.readFile, i1→parseJsonl, k→log, _6→reportError
```

**Key Decision - Graceful ENOENT Handling:**
- An empty mailbox is represented as a non-existent file
- Returns empty array instead of throwing
- This simplifies callers - no need to check file existence

---

### pY6 - readUnreadMessages

**What it does:** Filters mailbox messages to only unread ones.

```javascript
// ============================================
// readUnreadMessages - Get only unread messages
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
    let messages = await readMailbox(agentName, teamName);
    let unread = messages.filter((msg) => !msg.read);
    log(`[TeammateMailbox] readUnreadMessages: ${unread.length} unread of ${messages.length} total`);
    return unread;
}

// Mapping: pY6→readUnreadMessages, A→agentName, q→teamName, wl→readMailbox
```

---

### x3 - writeToMailbox

**What it does:** Appends a message to a target agent's mailbox with file locking.

**How it works:**

```javascript
// ============================================
// writeToMailbox - Write message with file locking
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
        w.push(O), await Pf6(Y, B6(w, null, 2), "utf-8"),
            k(`[TeammateMailbox] Wrote message to ${A}'s inbox from ${q.from}`)
    } catch (w) {
        k(`Failed to write to inbox for ${A}: ${w}`), _6(w)
    } finally {
        if (_) await _()
    }
}

// READABLE (for understanding):
async function writeToMailbox(recipientAgentName, message, teamName) {
    // Ensure team context is valid
    await ensureInboxDirectoryExists(teamName);

    let mailboxPath = getInboxPath(recipientAgentName, teamName);
    let lockPath = `${mailboxPath}.lock`;
    log(`[TeammateMailbox] writeToMailbox: recipient=${recipientAgentName}, from=${message.from}, path=${mailboxPath}`);

    // Step 1: Create mailbox file if it doesn't exist (atomic wx flag)
    try {
        await fs.writeFile(mailboxPath, "[]", {
            encoding: "utf-8",
            flag: "wx"  // Write exclusive - fails if file exists
        });
        log("[TeammateMailbox] writeToMailbox: created new inbox file");
    } catch (err) {
        if (err.code !== "EEXIST") {
            log(`[TeammateMailbox] writeToMailbox: failed to create inbox file: ${err}`);
            reportError(err);
            return;
        }
        // EEXIST is expected - file already exists
    }

    // Step 2: Acquire lock and write message
    let releaseLock;
    try {
        // properLockfile.lock returns a release function
        releaseLock = await properLockfile.lock(mailboxPath, {
            lockfilePath: lockPath,
            retries: 10,
            minTimeout: 5,
            maxTimeout: 100
        });

        // Read current messages under lock
        let messages = await readMailbox(recipientAgentName, teamName);

        // Add new message with read: false
        let newMessage = { ...message, read: false };
        messages.push(newMessage);

        // Write back atomically
        await fs.writeFile(mailboxPath, JSON.stringify(messages, null, 2), "utf-8");
        log(`[TeammateMailbox] Wrote message to ${recipientAgentName}'s inbox from ${message.from}`);

    } catch (err) {
        log(`Failed to write to inbox for ${recipientAgentName}: ${err}`);
        reportError(err);
    } finally {
        // Always release lock
        if (releaseLock) await releaseLock();
    }
}

// Mapping: x3→writeToMailbox, A→recipientAgentName, q→message, K→teamName,
// FY6→getInboxPath, OTY→ensureInboxDirectoryExists, Pf6→fs.writeFile,
// B6→JSON.stringify, Nc6.lock→properLockfile.lock, wl→readMailbox, iv1→lockOptions
```

**Key Algorithm - File Locking:**

The `properLockfile` library provides:
1. **Exclusive access** - Only one writer at a time
2. **Retry logic** - 10 retries with 5-100ms backoff
3. **Lock file** - Separate `.lock` file tracks ownership
4. **Auto-cleanup** - Lock released in `finally` block

**Why lock before read?**
- Read-modify-write is not atomic
- Another process could write between our read and write
- Lock ensures we see consistent state

---

### Vc6 - markMessageAsReadByIndex

**What it does:** Marks a specific message as read by index.

```javascript
// ============================================
// markMessageAsReadByIndex - Mark single message as read
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
async function markMessageAsReadByIndex(agentName, teamName, index) {
    let mailboxPath = getInboxPath(agentName, teamName);
    log(`[TeammateMailbox] markMessageAsReadByIndex called: agentName=${agentName}, teamName=${teamName}, index=${index}, path=${mailboxPath}`);

    let lockPath = `${mailboxPath}.lock`;
    let releaseLock;

    try {
        log("[TeammateMailbox] markMessageAsReadByIndex: acquiring lock...");
        releaseLock = await properLockfile.lock(mailboxPath, {
            lockfilePath: lockPath,
            retries: 10,
            minTimeout: 5,
            maxTimeout: 100
        });
        log("[TeammateMailbox] markMessageAsReadByIndex: lock acquired");

        let messages = await readMailbox(agentName, teamName);
        log(`[TeammateMailbox] markMessageAsReadByIndex: read ${messages.length} messages after lock`);

        // Bounds check
        if (index < 0 || index >= messages.length) {
            log(`[TeammateMailbox] markMessageAsReadByIndex: index ${index} out of bounds (${messages.length} messages)`);
            return;
        }

        let message = messages[index];

        // Skip if already read or missing
        if (!message || message.read) {
            log("[TeammateMailbox] markMessageAsReadByIndex: message already read or missing");
            return;
        }

        // Update message
        messages[index] = { ...message, read: true };

        // Write back
        await fs.writeFile(mailboxPath, JSON.stringify(messages, null, 2), "utf-8");
        log(`[TeammateMailbox] markMessageAsReadByIndex: marked message at index ${index} as read`);

    } catch (err) {
        if (err.code === "ENOENT") {
            log(`[TeammateMailbox] markMessageAsReadByIndex: file does not exist at ${mailboxPath}`);
            return;
        }
        log(`[TeammateMailbox] markMessageAsReadByIndex FAILED for ${agentName}: ${err}`);
        reportError(err);
    } finally {
        if (releaseLock) await releaseLock();
        log("[TeammateMailbox] markMessageAsReadByIndex: lock released");
    }
}

// Mapping: Vc6→markMessageAsReadByIndex, A→agentName, q→teamName, K→index,
// FY6→getInboxPath, Nc6.lock→properLockfile.lock, wl→readMailbox, Pf6→fs.writeFile
```

---

### kc6 - markMessagesAsRead

**What it does:** Marks all messages in a mailbox as read.

```javascript
// ============================================
// markMessagesAsRead - Mark all messages as read
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
    let mailboxPath = getInboxPath(agentName, teamName);
    log(`[TeammateMailbox] markMessagesAsRead called: agentName=${agentName}, teamName=${teamName}, path=${mailboxPath}`);

    let lockPath = `${mailboxPath}.lock`;
    let releaseLock;

    try {
        log("[TeammateMailbox] markMessagesAsRead: acquiring lock...");
        releaseLock = await properLockfile.lock(mailboxPath, {
            lockfilePath: lockPath,
            retries: 10,
            minTimeout: 5,
            maxTimeout: 100
        });
        log("[TeammateMailbox] markMessagesAsRead: lock acquired");

        let messages = await readMailbox(agentName, teamName);
        log(`[TeammateMailbox] markMessagesAsRead: read ${messages.length} messages after lock`);

        if (messages.length === 0) {
            log("[TeammateMailbox] markMessagesAsRead: no messages to mark");
            return;
        }

        let unreadCount = messages.filter((m) => !m.read).length;
        log(`[TeammateMailbox] markMessagesAsRead: ${unreadCount} unread of ${messages.length} total`);

        // Mark all as read
        let allRead = messages.map((m) => ({ ...m, read: true }));
        await fs.writeFile(mailboxPath, JSON.stringify(allRead, null, 2), "utf-8");
        log(`[TeammateMailbox] markMessagesAsRead: WROTE ${unreadCount} message(s) as read to ${mailboxPath}`);

        // Verify write
        let verify = await fs.readFile(mailboxPath, "utf-8");
        let stillUnread = parseJsonl(verify).filter((m) => !m.read).length;
        log(`[TeammateMailbox] markMessagesAsRead: VERIFY - ${stillUnread} still unread after write`);

    } catch (err) {
        if (err.code === "ENOENT") {
            log(`[TeammateMailbox] markMessagesAsRead: file does not exist at ${mailboxPath}`);
            return;
        }
        log(`[TeammateMailbox] markMessagesAsRead FAILED for ${agentName}: ${err}`);
        reportError(err);
    } finally {
        if (releaseLock) await releaseLock();
        log("[TeammateMailbox] markMessagesAsRead: lock released");
    }
}

// Mapping: kc6→markMessagesAsRead, A→agentName, q→teamName
```

---

### $TY - clearMailbox

**What it does:** Clears all messages from a mailbox.

```javascript
// ============================================
// clearMailbox - Remove all messages
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
    let mailboxPath = getInboxPath(agentName, teamName);
    try {
        await fs.writeFile(mailboxPath, "[]", {
            encoding: "utf-8",
            flag: "r+"  // Read+write, file must exist
        });
        log(`[TeammateMailbox] Cleared inbox for ${agentName}`);
    } catch (err) {
        if (err.code === "ENOENT") return;  // Already empty
        log(`Failed to clear inbox for ${agentName}: ${err}`);
        reportError(err);
    }
}

// Mapping: $TY→clearMailbox, A→agentName, q→teamName, FY6→getInboxPath, Pf6→fs.writeFile
```

**Note:** No lock needed because we're writing an empty array atomically.

---

### HTY - formatMailboxMessages

**What it does:** Formats mailbox messages as XML for system reminder injection.

```javascript
// ============================================
// formatMailboxMessages - Format as XML
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
        let colorAttr = msg.color ? ` color="${msg.color}"` : "";
        let summaryAttr = msg.summary ? ` summary="${msg.summary}"` : "";

        return `<teammate_message teammate_id="${msg.from}"${colorAttr}${summaryAttr}>
${msg.text}
</teammate_message>`;
    }).join("\n\n");
}

// Mapping: HTY→formatMailboxMessages, A→messages, fj→TEAMMATE_MESSAGE_TAG
```

**Output Example:**

```xml
<teammate_message teammate_id="research-agent" color="#FF5733" summary="API analysis complete">
I found 15 endpoints in the codebase. The main ones are...
</teammate_message>

<teammate_message teammate_id="team-lead">
Great work! Now investigate the authentication flow.
</teammate_message>
```

---

## Poll Loop Integration

### DNY - pollForNextMessage

**What it does:** Priority-based poll loop for teammate message handling.

**Location:** chunks.134.mjs:1483-1569

**Priority Order:**
1. **Pending user messages** - Direct messages from user (highest priority)
2. **Shutdown requests** - Protocol-encoded shutdown messages
3. **Team-lead messages** - Messages from `team-lead` ID
4. **Other teammate messages** - General teammate communication
5. **Unclaimed tasks** - Auto-claim from task list

**Key Algorithm:**

```javascript
// ============================================
// pollForNextMessage - Priority poll loop
// Location: chunks.134.mjs:1483-1569
// ============================================

// READABLE (for understanding):
async function pollForNextMessage(
    agentIdentity,
    abortController,
    taskId,
    getAppState,
    setAppState,
    parentSessionId
) {
    log(`[inProcessRunner] ${agentIdentity.agentName} starting poll loop (abort=${abortController.signal.aborted})`);

    let pollCount = 0;

    while (!abortController.signal.aborted) {
        // Priority 1: Check for pending user messages
        let task = getAppState().tasks[taskId];
        if (task?.type === "in_process_teammate" && task.pendingUserMessages.length > 0) {
            let message = task.pendingUserMessages[0];

            // Remove from queue
            setAppState((state) => {
                let t = state.tasks[taskId];
                if (!t || t.type !== "in_process_teammate") return state;
                return {
                    ...state,
                    tasks: {
                        ...state.tasks,
                        [taskId]: {
                            ...t,
                            pendingUserMessages: t.pendingUserMessages.slice(1)
                        }
                    }
                };
            });

            log(`[inProcessRunner] ${agentIdentity.agentName} found pending user message (poll #${pollCount})`);
            return { type: "new_message", message, from: "user" };
        }

        // Throttle polling
        if (pollCount > 0) await sleep(500);

        pollCount++;
        if (abortController.signal.aborted) {
            log(`[inProcessRunner] ${agentIdentity.agentName} aborted while waiting (poll #${pollCount})`);
            return { type: "aborted" };
        }

        log(`[inProcessRunner] ${agentIdentity.agentName} poll #${pollCount}: checking mailbox`);

        try {
            let messages = await readMailbox(agentIdentity.agentName, agentIdentity.teamName);

            // Priority 2: Check for shutdown requests
            let shutdownIndex = -1;
            let shutdownRequest = null;

            for (let i = 0; i < messages.length; i++) {
                let msg = messages[i];
                if (msg && !msg.read) {
                    let parsed = tryParseShutdownRequest(msg.text);
                    if (parsed) {
                        shutdownIndex = i;
                        shutdownRequest = parsed;
                        break;
                    }
                }
            }

            if (shutdownIndex !== -1) {
                let originalMessage = messages[shutdownIndex];
                let priorUnread = messages.slice(0, shutdownIndex).filter((m) => !m.read).length;
                log(`[inProcessRunner] ${agentIdentity.agentName} received shutdown request from ${shutdownRequest?.from} (prioritized over ${priorUnread} unread messages)`);

                await markMessageAsReadByIndex(agentIdentity.agentName, agentIdentity.teamName, shutdownIndex);
                return {
                    type: "shutdown_request",
                    request: shutdownRequest,
                    originalMessage: originalMessage.text
                };
            }

            // Priority 3: Team-lead messages
            let teamLeadIndex = -1;
            for (let i = 0; i < messages.length; i++) {
                let msg = messages[i];
                if (msg && !msg.read && msg.from === TEAM_LEAD_ID) {
                    teamLeadIndex = i;
                    break;
                }
            }

            // Priority 4: Any unread message
            if (teamLeadIndex === -1) {
                teamLeadIndex = messages.findIndex((m) => !m.read);
            }

            if (teamLeadIndex !== -1) {
                let msg = messages[teamLeadIndex];
                if (msg) {
                    log(`[inProcessRunner] ${agentIdentity.agentName} received new message from ${msg.from} (index ${teamLeadIndex})`);
                    await markMessageAsReadByIndex(agentIdentity.agentName, agentIdentity.teamName, teamLeadIndex);
                    return {
                        type: "new_message",
                        message: msg.text,
                        from: msg.from,
                        color: msg.color,
                        summary: msg.summary
                    };
                }
            }
        } catch (err) {
            log(`[inProcessRunner] ${agentIdentity.agentName} poll error: ${err}`);
        }

        // Priority 5: Check for unclaimed tasks
        let unclaimedPrompt = await claimUnclaimedTask(parentSessionId, agentIdentity.agentName);
        if (unclaimedPrompt) {
            return { type: "new_message", message: unclaimedPrompt, from: "task-list" };
        }
    }

    log(`[inProcessRunner] ${agentIdentity.agentName} exiting poll loop (abort=${abortController.signal.aborted}, polls=${pollCount})`);
    return { type: "aborted" };
}
```

---

## Lock Configuration

```javascript
// ============================================
// iv1 - Lock options for mailbox operations
// Location: chunks.132.mjs:463
// ============================================

// ORIGINAL (for source lookup):
iv1 = { retries: 10, minTimeout: 5, maxTimeout: 100 }

// READABLE (for understanding):
const lockOptions = {
    retries: 10,       // Try up to 10 times
    minTimeout: 5,     // Minimum 5ms between retries
    maxTimeout: 100    // Maximum 100ms between retries
};
```

**Why these values?**
- **10 retries** - Balances reliability with responsiveness
- **5-100ms backoff** - Quick enough for UI, slow enough to resolve contention
- **Exponential backoff** - Library handles this internally

---

## Message Types

### Standard Message

```javascript
{
    from: "team-lead",
    text: "Please investigate the authentication module",
    timestamp: "2026-03-26T10:00:00Z",
    read: false,
    color: "#FF5733",      // Optional display color
    summary: "Task assignment"  // Optional summary
}
```

### Idle Notification

```javascript
{
    type: "idle_notification",
    from: "research-agent",
    timestamp: "2026-03-26T10:05:00Z",
    idleReason: "available",
    summary: "Completed API analysis",
    completedTaskId: "task-123",
    completedStatus: "completed"
}
```

### Shutdown Request

```javascript
{
    type: "shutdown_request",
    request_id: "req-456",
    agent_id: "research-agent",
    reason: "User requested shutdown"
}
```

### Permission Request

```javascript
{
    type: "permission_request",
    request_id: "perm-789",
    agent_id: "research-agent",
    tool_name: "Write",
    tool_use_id: "tool-use-abc",
    permission_type: "edit"
}
```

---

## System Reminder Integration

Mailbox messages are converted to system reminders:

```javascript
// In message assembly
let unreadMessages = await readUnreadMessages(agentName, teamName);
if (unreadMessages.length > 0) {
    let formatted = formatMailboxMessages(unreadMessages);
    let attachment = {
        type: "attachment",
        attachment: {
            type: "teammate_messages",
            content: formatted
        }
    };
    messages.push(attachment);
}
```

---

## Error Handling

| Error Code | Handling | Result |
|------------|----------|--------|
| `ENOENT` | Return empty array | Empty mailbox |
| Lock timeout | Log and retry | Eventually succeeds or throws |
| JSON parse error | Return empty array | Corrupted mailbox ignored |
| Write failure | Log and return | Message not delivered |

---

## Performance Considerations

### Poll Throttling

The poll loop uses 500ms sleep between iterations:

```javascript
if (pollCount > 0) await sleep(500);
```

**Why 500ms?**
- Fast enough for responsive communication
- Slow enough to avoid excessive CPU usage
- Balance between latency and efficiency

### File Size Management

Messages accumulate in the mailbox file. Consider:
- Periodic cleanup of read messages
- Archival for long-running sessions
- Size limits for very large conversations