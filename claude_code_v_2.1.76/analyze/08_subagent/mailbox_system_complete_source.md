# Mailbox System Complete Source (Claude Code 2.1.76)

> Complete source-level documentation for the teammate mailbox communication system.
> Cross-validated against source code on 2026-03-27.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `readMailbox` (wl) - Read all messages from mailbox — `chunks.132.mjs:3`
- `readUnreadMessages` (pY6) - Read only unread messages — `chunks.132.mjs:16`
- `writeToMailbox` (x3) - Write message to mailbox — `chunks.132.mjs:22`
- `markMessageAsReadByIndex` (Vc6) - Mark single message as read — `chunks.132.mjs:57`
- `markMessagesAsRead` (kc6) - Mark all messages as read — `chunks.132.mjs:92`
- `clearMailbox` ($TY) - Clear all messages from mailbox — `chunks.132.mjs:128`
- `formatMailboxMessages` (HTY) - Format messages as XML — `chunks.132.mjs:141`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Mailbox System Architecture                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  File Location: ~/.claude/teams/{team_name}/mailboxes/{agent_name}.json     │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         Mailbox File Format                          │    │
│  │                                                                       │    │
│  │  [                                                                    │    │
│  │    {                                                                  │    │
│  │      "from": "team-lead",                                            │    │
│  │      "text": "Search for all uses of createTaskId...",              │    │
│  │      "color": "blue",                                                │    │
│  │      "summary": "Find API usages",                                   │    │
│  │      "read": false                                                   │    │
│  │    },                                                                 │    │
│  │    {                                                                  │    │
│  │      "from": "explorer-agent",                                       │    │
│  │      "text": "Found 15 uses in chunks.41.mjs...",                   │    │
│  │      "color": "green",                                               │    │
│  │      "summary": "Search complete",                                   │    │
│  │      "read": true                                                    │    │
│  │    }                                                                  │    │
│  │  ]                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         Lock File                                    │    │
│  │                                                                       │    │
│  │  Path: {mailbox_path}.lock                                           │    │
│  │  Purpose: Prevent concurrent writes from multiple agents            │    │
│  │  Implementation: proper-lockfile (Nc6.lock)                          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Functions

### readMailbox (wl)

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
    // Build mailbox file path
    let mailboxPath = getMailboxPath(agentName, teamName);
    log(`[TeammateMailbox] readMailbox: path=${mailboxPath}`);

    try {
        // Read file contents
        let fileContents = await fs.readFile(mailboxPath, "utf-8");

        // Parse JSON array
        let messages = JSON.parse(fileContents);

        log(`[TeammateMailbox] readMailbox: read ${messages.length} message(s)`);
        return messages;

    } catch (error) {
        // Handle file not found (return empty array)
        if (error.code === "ENOENT") {
            log("[TeammateMailbox] readMailbox: file does not exist");
            return [];
        }

        // Log other errors and return empty array
        log(`Failed to read inbox for ${agentName}: ${error}`);
        reportError(error);
        return [];
    }
}

// Mapping: wl→readMailbox, A→agentName, q→teamName, K→mailboxPath, Y→error,
//          FY6→getMailboxPath, xd4→fs.readFile, i1→JSON.parse, _6→reportError
```

**Why return empty array on ENOENT?**
- New agents start with empty mailbox
- No need to pre-create mailbox files
- Simplifies caller logic

---

### readUnreadMessages (pY6)

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
    // Read all messages
    let allMessages = await readMailbox(agentName, teamName);

    // Filter to unread only
    let unreadMessages = allMessages.filter((msg) => !msg.read);

    log(`[TeammateMailbox] readUnreadMessages: ${unreadMessages.length} unread of ${allMessages.length} total`);

    return unreadMessages;
}

// Mapping: pY6→readUnreadMessages, A→agentName, q→teamName, K→allMessages, Y→unreadMessages, wl→readMailbox
```

---

### writeToMailbox (x3)

```javascript
// ============================================
// x3 - writeToMailbox - Write message to mailbox
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
    // Ensure mailboxes directory exists
    await ensureMailboxesDirectory(teamName);

    let mailboxPath = getMailboxPath(recipientName, teamName);
    let lockPath = `${mailboxPath}.lock`;

    log(`[TeammateMailbox] writeToMailbox: recipient=${recipientName}, from=${message.from}, path=${mailboxPath}`);

    // Try to create new mailbox file if it doesn't exist
    try {
        await fs.writeFile(mailboxPath, "[]", {
            encoding: "utf-8",
            flag: "wx"  // Exclusive create - fails if file exists
        });
        log("[TeammateMailbox] writeToMailbox: created new inbox file");
    } catch (error) {
        // EEXIST is expected if file already exists
        if (error.code !== "EEXIST") {
            log(`[TeammateMailbox] writeToMailbox: failed to create inbox file: ${error}`);
            reportError(error);
            return;
        }
    }

    // Acquire lock and write message
    let releaseLock;
    try {
        // Acquire file lock
        releaseLock = await properLockfile.lock(mailboxPath, {
            lockfilePath: lockPath,
            ...LOCK_OPTIONS  // stale, retries, etc.
        });

        // Read current messages
        let currentMessages = await readMailbox(recipientName, teamName);

        // Add new message with read=false
        let newMessage = {
            ...message,
            read: false
        };
        currentMessages.push(newMessage);

        // Write back to file
        await fs.writeFile(mailboxPath, JSON.stringify(currentMessages, null, 2), "utf-8");

        log(`[TeammateMailbox] Wrote message to ${recipientName}'s inbox from ${message.from}`);

    } catch (error) {
        log(`Failed to write to inbox for ${recipientName}: ${error}`);
        reportError(error);
    } finally {
        // Release lock
        if (releaseLock) {
            await releaseLock();
        }
    }
}

// Mapping: x3→writeToMailbox, A→recipientName, q→message, K→teamName, Y→mailboxPath, z→lockPath,
//          OTY→ensureMailboxesDirectory, Pf6→fs.writeFile, wl→readMailbox, B6→JSON.stringify,
//          Nc6.lock→properLockfile.lock, iv1→LOCK_OPTIONS
```

**Why file locking?**
- Multiple agents may write simultaneously
- Prevents message loss from race conditions
- Uses proper-lockfile for cross-platform support

**Why "wx" flag for creation?**
- Atomic create-if-not-exists
- Prevents race condition between check and create
- EEXIST error is expected for existing mailboxes

---

### markMessageAsReadByIndex (Vc6)

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

    log(`[TeammateMailbox] markMessageAsReadByIndex called: agentName=${agentName}, teamName=${teamName}, index=${messageIndex}, path=${mailboxPath}`);

    let lockPath = `${mailboxPath}.lock`;
    let releaseLock;

    try {
        // Acquire lock
        log("[TeammateMailbox] markMessageAsReadByIndex: acquiring lock...");
        releaseLock = await properLockfile.lock(mailboxPath, {
            lockfilePath: lockPath,
            ...LOCK_OPTIONS
        });
        log("[TeammateMailbox] markMessageAsReadByIndex: lock acquired");

        // Read current messages
        let messages = await readMailbox(agentName, teamName);
        log(`[TeammateMailbox] markMessageAsReadByIndex: read ${messages.length} messages after lock`);

        // Validate index
        if (messageIndex < 0 || messageIndex >= messages.length) {
            log(`[TeammateMailbox] markMessageAsReadByIndex: index ${messageIndex} out of bounds (${messages.length} messages)`);
            return;
        }

        // Check if already read
        let message = messages[messageIndex];
        if (!message || message.read) {
            log("[TeammateMailbox] markMessageAsReadByIndex: message already read or missing");
            return;
        }

        // Mark as read
        messages[messageIndex] = {
            ...message,
            read: true
        };

        // Write back
        await fs.writeFile(mailboxPath, JSON.stringify(messages, null, 2), "utf-8");

        log(`[TeammateMailbox] markMessageAsReadByIndex: marked message at index ${messageIndex} as read`);

    } catch (error) {
        // Handle file not found
        if (error.code === "ENOENT") {
            log(`[TeammateMailbox] markMessageAsReadByIndex: file does not exist at ${mailboxPath}`);
            return;
        }

        log(`[TeammateMailbox] markMessageAsReadByIndex FAILED for ${agentName}: ${error}`);
        reportError(error);

    } finally {
        // Release lock
        if (releaseLock) {
            await releaseLock();
            log("[TeammateMailbox] markMessageAsReadByIndex: lock released");
        }
    }
}

// Mapping: Vc6→markMessageAsReadByIndex, A→agentName, q→teamName, K→messageIndex, Y→mailboxPath,
//          z→lockPath, w→messages, O→message, wl→readMailbox, Pf6→fs.writeFile, B6→JSON.stringify
```

**Why index-based marking?**
- Caller already has message position from iteration
- Avoids searching for message by content
- More efficient than content-based matching

---

### markMessagesAsRead (kc6)

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

    log(`[TeammateMailbox] markMessagesAsRead called: agentName=${agentName}, teamName=${teamName}, path=${mailboxPath}`);

    let lockPath = `${mailboxPath}.lock`;
    let releaseLock;

    try {
        // Acquire lock
        log("[TeammateMailbox] markMessagesAsRead: acquiring lock...");
        releaseLock = await properLockfile.lock(mailboxPath, {
            lockfilePath: lockPath,
            ...LOCK_OPTIONS
        });
        log("[TeammateMailbox] markMessagesAsRead: lock acquired");

        // Read current messages
        let messages = await readMailbox(agentName, teamName);
        log(`[TeammateMailbox] markMessagesAsRead: read ${messages.length} messages after lock`);

        if (messages.length === 0) {
            log("[TeammateMailbox] markMessagesAsRead: no messages to mark");
            return;
        }

        // Count unread before
        let unreadCount = messages.filter((msg) => !msg.read).length;
        log(`[TeammateMailbox] markMessagesAsRead: ${unreadCount} unread of ${messages.length} total`);

        // Mark all as read
        let updatedMessages = messages.map((msg) => ({
            ...msg,
            read: true
        }));

        // Write back
        await fs.writeFile(mailboxPath, JSON.stringify(updatedMessages, null, 2), "utf-8");
        log(`[TeammateMailbox] markMessagesAsRead: WROTE ${unreadCount} message(s) as read to ${mailboxPath}`);

        // Verify write
        let verifyContent = await fs.readFile(mailboxPath, "utf-8");
        let stillUnread = JSON.parse(verifyContent).filter((msg) => !msg.read).length;
        log(`[TeammateMailbox] markMessagesAsRead: VERIFY - ${stillUnread} still unread after write`);

    } catch (error) {
        if (error.code === "ENOENT") {
            log(`[TeammateMailbox] markMessagesAsRead: file does not exist at ${mailboxPath}`);
            return;
        }

        log(`[TeammateMailbox] markMessagesAsRead FAILED for ${agentName}: ${error}`);
        reportError(error);

    } finally {
        if (releaseLock) {
            await releaseLock();
            log("[TeammateMailbox] markMessagesAsRead: lock released");
        }
    }
}

// Mapping: kc6→markMessagesAsRead, A→agentName, q→teamName, K→mailboxPath, Y→lockPath,
//          z→releaseLock, _→messages, w→unreadCount, O→updatedMessages, wl→readMailbox
```

**Why verify after write?**
- Defensive programming for concurrent access
- Catches potential race conditions
- Provides confidence in write success

---

### clearMailbox ($TY)

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
        // Overwrite with empty array
        await fs.writeFile(mailboxPath, "[]", {
            encoding: "utf-8",
            flag: "r+"  // Open for reading and writing, file must exist
        });

        log(`[TeammateMailbox] Cleared inbox for ${agentName}`);

    } catch (error) {
        // Silently ignore if file doesn't exist
        if (error.code === "ENOENT") {
            return;
        }

        log(`Failed to clear inbox for ${agentName}: ${error}`);
        reportError(error);
    }
}

// Mapping: $TY→clearMailbox, A→agentName, q→teamName, K→mailboxPath, Y→error, Pf6→fs.writeFile
```

---

### formatMailboxMessages (HTY)

```javascript
// ============================================
// HTY - formatMailboxMessages - Format messages as XML
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

        // Format as XML
        return `<teammate_message teammate_id="${msg.from}"${colorAttr}${summaryAttr}>
${msg.text}
</teammate_message>`;
    }).join(`

`);  // Join with blank lines
}

// Mapping: HTY→formatMailboxMessages, A→messages, q→msg, K→colorAttr, Y→summaryAttr, fj→TEMMATE_MESSAGE_TAG
```

**Why XML format?**
- Clear structure for LLM consumption
- Attributes provide metadata (color, summary)
- Easier for LLM to parse than JSON

---

## Idle Notification Functions

### buildIdleNotification (Ec6)

```javascript
// ============================================
// Ec6 - buildIdleNotification - Build idle notification message
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
        idleReason: options?.idleReason,         // "available" | "interrupted" | "completed"
        summary: options?.summary,               // Brief summary of completed work
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
// yc6 - parseIdleNotification - Parse idle notification from string
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
function parseIdleNotification(messageText) {
    try {
        let parsed = JSON.parse(messageText);
        if (parsed && parsed.type === "idle_notification") {
            return parsed;
        }
    } catch {
        // Not valid JSON or wrong type
    }
    return null;
}

// Mapping: yc6→parseIdleNotification, A→messageText, q→parsed, i1→JSON.parse
```

---

## Message Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Message Flow Between Agents                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────┐                              ┌────────────────┐        │
│  │  Team Lead     │                              │  Teammate      │        │
│  │                │                              │                │        │
│  └───────┬────────┘                              └───────┬────────┘        │
│          │                                               │                  │
│          │  1. writeToMailbox(teammate, message)        │                  │
│          │─────────────────────────────────────────────>│                  │
│          │                                               │                  │
│          │                                               │ 2. poll loop    │
│          │                                               │    readMailbox()│
│          │                                               │                  │
│          │                                               │ 3. Process      │
│          │                                               │    message      │
│          │                                               │                  │
│          │  4. writeToMailbox(lead, response)           │                  │
│          │<─────────────────────────────────────────────│                  │
│          │                                               │                  │
│          │  5. markMessageAsReadByIndex()               │                  │
│          │─────────────────────────────────────────────>│                  │
│          │                                               │                  │
│          │                                               │                  │
│          │  6. Work complete, sendIdleNotification()    │                  │
│          │<─────────────────────────────────────────────│                  │
│          │                                               │                  │
│          │  7. Teammate marked isIdle=true              │                  │
│          │                                               │                  │
│          │  8. Next task assigned via writeToMailbox()  │                  │
│          │─────────────────────────────────────────────>│                  │
│          │                                               │                  │
│          │  ... repeat ...                               │                  │
│          │                                               │                  │
│  ┌───────┴────────┐                              ┌───────┴────────┐        │
│  │  Team Lead     │                              │  Teammate      │        │
│  │  loops in      │                              │  loops in      │        │
│  │  pollForNext   │                              │  pollForNext   │        │
│  │  Message       │                              │  Message       │        │
│  └────────────────┘                              └────────────────┘        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## File Path Algorithm

### getMailboxPath (FY6)

```javascript
// READABLE (for understanding):
function getMailboxPath(agentName, teamName) {
    // Base directory: ~/.claude/teams/{team_name}/mailboxes/
    let teamsDir = getClaudeTeamsDir();  // ~/.claude/teams
    return path.join(teamsDir, teamName, "mailboxes", `${agentName}.json`);
}

// Example paths:
// ~/.claude/teams/my-team/mailboxes/explorer-agent.json
// ~/.claude/teams/my-team/mailboxes/writer-agent.json
```

---

## Error Handling Patterns

| Error Code | Handling | Reason |
|------------|----------|--------|
| `ENOENT` | Return `[]` / silent | New mailbox starts empty |
| `EEXIST` | Continue | File already exists (expected) |
| Lock failure | Log + report | Concurrent access issue |
| Parse error | Log + return empty | Corrupted JSON |

---

## Verification Status

| Symbol | Location | Verification |
|--------|----------|--------------|
| `wl` | chunks.132.mjs:3 | ✓ Direct source match |
| `pY6` | chunks.132.mjs:16 | ✓ Direct source match |
| `x3` | chunks.132.mjs:22 | ✓ Direct source match |
| `Vc6` | chunks.132.mjs:57 | ✓ Direct source match |
| `kc6` | chunks.132.mjs:92 | ✓ Direct source match |
| `$TY` | chunks.132.mjs:128 | ✓ Direct source match |
| `HTY` | chunks.132.mjs:141 | ✓ Direct source match |
| `Ec6` | chunks.132.mjs:153 | ✓ Direct source match |
| `yc6` | chunks.132.mjs:166 | ✓ Direct source match |

---

## Lock Configuration

### lockOptions (iv1)

```javascript
// ============================================
// iv1 - lockOptions - Configuration for proper-lockfile
// Location: chunks.132.mjs:463
// ============================================

// ORIGINAL (for source lookup):
iv1 = {
    retries: {
        retries: 10,
        minTimeout: 50,
        maxTimeout: 200
    },
    stale: 5000
}

// READABLE (for understanding):
LOCK_OPTIONS = {
    retries: {
        retries: 10,        // Try 10 times
        minTimeout: 50,     // Min 50ms between retries
        maxTimeout: 200     // Max 200ms between retries
    },
    stale: 5000             // Lock considered stale after 5 seconds
};

// Mapping: iv1→LOCK_OPTIONS
```

**How it works:**
1. When acquiring a lock, the system retries up to 10 times with exponential backoff (50-200ms)
2. If a lock file is older than 5 seconds, it is considered stale and can be overridden
3. This prevents deadlocks from crashed agents that never released their locks

---

## Key Insights

### Insight 1: Lock-Based Concurrency

All write operations use `proper-lockfile` to ensure:
1. **No lost updates** - Concurrent writes are serialized through file locks
2. **No partial reads** - Reads blocked during writes
3. **Deadlock prevention** - Stale lock timeout (5s) ensures recovery from crashed agents

### Insight 2: Lazy Mailbox Creation

Mailbox files are created on first write, not on agent spawn:
- Uses `wx` flag (exclusive create) for atomic create-if-not-exists
- Reduces file system clutter for agents that never receive messages
- ENOENT on read simply returns empty array (no pre-creation needed)

### Insight 3: Read Tracking

The `read` flag on each message enables:
- `readUnreadMessages` - Get only new messages efficiently
- `markMessagesAsRead` - Batch mark all as consumed
- `markMessageAsReadByIndex` - Granular per-message tracking
- LLM can track what it has already processed without re-reading

---

## Related Documents

- [teammate_execution_complete_source.md](./teammate_execution_complete_source.md) - Teammate execution
- [communication_and_coordination.md](./communication_and_coordination.md) - Communication overview