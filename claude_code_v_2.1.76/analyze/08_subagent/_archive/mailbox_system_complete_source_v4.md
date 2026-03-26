# Mailbox System Complete Source V4 (Claude Code 2.1.76)

> Complete source-level documentation for the teammate mailbox communication system. This system enables message passing between teammates in agent teams.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified_v3.md](../08_subagent/cross_validation_unified_v3.md) - Unified symbol verification

Key functions in this document:
- `wl` - readMailbox — `chunks.132.mjs:3`
- `pY6` - readUnreadMessages — `chunks.132.mjs:16`
- `x3` - writeToMailbox — `chunks.132.mjs:22`
- `Vc6` - markMessageAsReadByIndex — `chunks.132.mjs:57`
- `kc6` - markMessagesAsRead — `chunks.132.mjs:92`
- `$TY` - clearMailbox — `chunks.132.mjs:128`
- `HTY` - formatMailboxMessages — `chunks.132.mjs:141`
- `Nc6` - properLockfile — `chunks.132.mjs:437` (npm package)
- `iv1` - lockOptions — `chunks.132.mjs:463`

---

## Overview

The mailbox system provides file-based message queues for teammate coordination. Each teammate has a mailbox file that stores messages from other teammates. The system uses file locking to ensure concurrent access safety.

### Key Features

- **File-based storage** - Messages stored as JSON in `.claude/teams/<team>/mailboxes/<name>.json`
- **Lock-based concurrency** - Uses `proper-lockfile` npm package for safe concurrent access
- **Read tracking** - Each message has a `read` flag for tracking consumption
- **XML formatting** - Messages can be formatted as XML for LLM consumption

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
    // Step 1: Build mailbox file path
    let mailboxPath = getMailboxPath(agentName, teamName);

    log(`[TeammateMailbox] readMailbox: path=${mailboxPath}`);

    try {
        // Step 2: Read file contents
        let content = await fs.readFile(mailboxPath, "utf-8");

        // Step 3: Parse JSON
        let messages = JSON.parse(content);

        log(`[TeammateMailbox] readMailbox: read ${messages.length} message(s)`);

        return messages;
    } catch (error) {
        // File doesn't exist - return empty array
        if (error.code === "ENOENT") {
            log("[TeammateMailbox] readMailbox: file does not exist");
            return [];
        }

        // Other errors - log and return empty
        log(`Failed to read inbox for ${agentName}: ${error}`);
        reportError(error);
        return [];
    }
}

// Mapping: wl→readMailbox, A→agentName, q→teamName, K→mailboxPath, Y→error/content, z→messages, FY6→getMailboxPath, xd4→fs.readFile, i1→JSON.parse, k→log, _6→reportError
```

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
    // Step 1: Read all messages
    let allMessages = await readMailbox(agentName, teamName);

    // Step 2: Filter for unread
    let unreadMessages = allMessages.filter(message => !message.read);

    log(`[TeammateMailbox] readUnreadMessages: ${unreadMessages.length} unread of ${allMessages.length} total`);

    return unreadMessages;
}

// Mapping: pY6→readUnreadMessages, A→agentName, q→teamName, K→allMessages, Y→unreadMessages, z→message, wl→readMailbox
```

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
    // Step 1: Ensure mailbox directory exists
    await ensureMailboxDir(teamName);

    // Step 2: Build paths
    let mailboxPath = getMailboxPath(recipientName, teamName);
    let lockPath = `${mailboxPath}.lock`;

    log(`[TeammateMailbox] writeToMailbox: recipient=${recipientName}, from=${message.from}, path=${mailboxPath}`);

    // Step 3: Create mailbox file if doesn't exist
    try {
        await fs.writeFile(mailboxPath, "[]", {
            encoding: "utf-8",
            flag: "wx"  // Exclusive write - fails if exists
        });
        log("[TeammateMailbox] writeToMailbox: created new inbox file");
    } catch (error) {
        // EEXIST is expected - file already exists
        if (error.code !== "EEXIST") {
            log(`[TeammateMailbox] writeToMailbox: failed to create inbox file: ${error}`);
            reportError(error);
            return;
        }
    }

    // Step 4: Acquire lock and write message
    let releaseLock;
    try {
        // Acquire file lock
        releaseLock = await properLockfile.lock(mailboxPath, {
            lockfilePath: lockPath,
            ...LOCK_OPTIONS
        });

        // Read existing messages
        let messages = await readMailbox(recipientName, teamName);

        // Add new message with read=false
        let newMessage = {
            ...message,
            read: false
        };
        messages.push(newMessage);

        // Write back to file
        await fs.writeFile(mailboxPath, JSON.stringify(messages, null, 2), "utf-8");

        log(`[TeammateMailbox] Wrote message to ${recipientName}'s inbox from ${message.from}`);
    } catch (error) {
        log(`Failed to write to inbox for ${recipientName}: ${error}`);
        reportError(error);
    } finally {
        // Step 5: Release lock
        if (releaseLock) {
            await releaseLock();
        }
    }
}

// Mapping: x3→writeToMailbox, A→recipientName, q→message, K→teamName, Y→mailboxPath, z→lockPath, _→releaseLock, w→error/messages, O→newMessage, Nc6→properLockfile, iv1→LOCK_OPTIONS, Pf6→fs.writeFile, B6→JSON.stringify, wl→readMailbox, OTY→ensureMailboxDir
```

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
        // Step 1: Acquire lock
        log("[TeammateMailbox] markMessageAsReadByIndex: acquiring lock...");
        releaseLock = await properLockfile.lock(mailboxPath, {
            lockfilePath: lockPath,
            ...LOCK_OPTIONS
        });
        log("[TeammateMailbox] markMessageAsReadByIndex: lock acquired");

        // Step 2: Read messages
        let messages = await readMailbox(agentName, teamName);
        log(`[TeammateMailbox] markMessageAsReadByIndex: read ${messages.length} messages after lock`);

        // Step 3: Validate index
        if (messageIndex < 0 || messageIndex >= messages.length) {
            log(`[TeammateMailbox] markMessageAsReadByIndex: index ${messageIndex} out of bounds (${messages.length} messages)`);
            return;
        }

        // Step 4: Check message
        let message = messages[messageIndex];
        if (!message || message.read) {
            log("[TeammateMailbox] markMessageAsReadByIndex: message already read or missing");
            return;
        }

        // Step 5: Mark as read
        messages[messageIndex] = {
            ...message,
            read: true
        };

        // Step 6: Write back
        await fs.writeFile(mailboxPath, JSON.stringify(messages, null, 2), "utf-8");

        log(`[TeammateMailbox] markMessageAsReadByIndex: marked message at index ${messageIndex} as read`);
    } catch (error) {
        if (error.code === "ENOENT") {
            log(`[TeammateMailbox] markMessageAsReadByIndex: file does not exist at ${mailboxPath}`);
            return;
        }
        log(`[TeammateMailbox] markMessageAsReadByIndex FAILED for ${agentName}: ${error}`);
        reportError(error);
    } finally {
        // Step 7: Release lock
        if (releaseLock) {
            await releaseLock();
            log("[TeammateMailbox] markMessageAsReadByIndex: lock released");
        }
    }
}

// Mapping: Vc6→markMessageAsReadByIndex, A→agentName, q→teamName, K→messageIndex, Y→mailboxPath, z→lockPath, _→releaseLock, w→error/messages, O→message
```

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
        // Step 1: Acquire lock
        log("[TeammateMailbox] markMessagesAsRead: acquiring lock...");
        releaseLock = await properLockfile.lock(mailboxPath, {
            lockfilePath: lockPath,
            ...LOCK_OPTIONS
        });
        log("[TeammateMailbox] markMessagesAsRead: lock acquired");

        // Step 2: Read messages
        let messages = await readMailbox(agentName, teamName);
        log(`[TeammateMailbox] markMessagesAsRead: read ${messages.length} messages after lock`);

        if (messages.length === 0) {
            log("[TeammateMailbox] markMessagesAsRead: no messages to mark");
            return;
        }

        // Step 3: Count unread
        let unreadCount = messages.filter(m => !m.read).length;
        log(`[TeammateMailbox] markMessagesAsRead: ${unreadCount} unread of ${messages.length} total`);

        // Step 4: Mark all as read
        let updatedMessages = messages.map(message => ({
            ...message,
            read: true
        }));

        // Step 5: Write back
        await fs.writeFile(mailboxPath, JSON.stringify(updatedMessages, null, 2), "utf-8");
        log(`[TeammateMailbox] markMessagesAsRead: WROTE ${unreadCount} message(s) as read to ${mailboxPath}`);

        // Step 6: Verify write
        let verifyContent = await fs.readFile(mailboxPath, "utf-8");
        let verifyMessages = JSON.parse(verifyContent);
        let stillUnread = verifyMessages.filter(m => !m.read).length;
        log(`[TeammateMailbox] markMessagesAsRead: VERIFY - ${stillUnread} still unread after write`);
    } catch (error) {
        if (error.code === "ENOENT") {
            log(`[TeammateMailbox] markMessagesAsRead: file does not exist at ${mailboxPath}`);
            return;
        }
        log(`[TeammateMailbox] markMessagesAsRead FAILED for ${agentName}: ${error}`);
        reportError(error);
    } finally {
        // Step 7: Release lock
        if (releaseLock) {
            await releaseLock();
            log("[TeammateMailbox] markMessagesAsRead: lock released");
        }
    }
}

// Mapping: kc6→markMessagesAsRead, A→agentName, q→teamName, K→mailboxPath, Y→lockPath, z→releaseLock, _→error/messages, w→unreadCount, O→updatedMessages, J→message
```

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
        // Write empty array
        await fs.writeFile(mailboxPath, "[]", {
            encoding: "utf-8",
            flag: "r+"  // Read/write, file must exist
        });
        log(`[TeammateMailbox] Cleared inbox for ${agentName}`);
    } catch (error) {
        // File doesn't exist - nothing to clear
        if (error.code === "ENOENT") return;
        log(`Failed to clear inbox for ${agentName}: ${error}`);
        reportError(error);
    }
}

// Mapping: $TY→clearMailbox, A→agentName, q→teamName, K→mailboxPath, Y→error, Pf6→fs.writeFile
```

### formatMailboxMessages (HTY)

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
    return messages.map(message => {
        // Build optional attributes
        let colorAttr = message.color ? ` color="${message.color}"` : "";
        let summaryAttr = message.summary ? ` summary="${message.summary}"` : "";

        // Format as XML
        return `<teammate_message teammate_id="${message.from}"${colorAttr}${summaryAttr}>
${message.text}
</teammate_message>`;
    }).join("\n\n");  // Double newline between messages
}

// Example output:
// <teammate_message teammate_id="worker-1" color="blue" summary="Task completed">
// I finished analyzing the codebase.
// </teammate_message>
//
// <teammate_message teammate_id="worker-2" color="green">
// Tests are passing on my branch.
// </teammate_message>

// Mapping: HTY→formatMailboxMessages, A→messages, q→message, K→colorAttr, Y→summaryAttr, fj→MESSAGE_TAG
```

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

---

## Message Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MAILBOX MESSAGE FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

Teammate A wants to send message to Teammate B
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ writeToMailbox("teammate-b", message, teamName)                             │
│                                                                              │
│   1. Ensure mailbox directory exists                                         │
│   2. Create mailbox file if needed                                           │
│   3. Acquire file lock                                                       │
│   4. Read existing messages                                                  │
│   5. Append new message with read: false                                     │
│   6. Write back to file                                                      │
│   7. Release lock                                                            │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Mailbox file: .claude/teams/<team>/mailboxes/teammate-b.json                │
│                                                                              │
│ [                                                                            │
│   { "from": "teammate-a", "text": "...", "read": false },                   │
│   { "from": "lead", "text": "...", "read": true }                           │
│ ]                                                                            │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
┌───────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ readMailbox   │      │ readUnread      │      │ markMessages    │
│ (all messages)│      │ Messages        │      │ AsRead          │
└───────────────┘      └─────────────────┘      └─────────────────┘
```

---

## Key Insights

### Insight 1: Lock-Based Concurrency

All write operations use `proper-lockfile` to ensure:
1. **No lost updates** - Concurrent writes serialized
2. **No partial reads** - Reads blocked during writes
3. **Deadlock prevention** - Stale lock timeout (5s)

### Insight 2: Lazy Mailbox Creation

Mailbox files are created on first write, not on agent spawn:
- Reduces file system clutter
- Only creates mailboxes for agents that receive messages

### Insight 3: Read Tracking

The `read` flag enables:
- `readUnreadMessages` - Get only new messages
- `markMessagesAsRead` - Mark all as consumed
- LLM can track what it has processed

---

## Related Documents

- [agent_tool_complete_source_v4.md](./agent_tool_complete_source_v4.md) - AgentTool
- [teammate_execution_complete_source_v2.md](./teammate_execution_complete_source_v2.md) - Teammate spawning
- [cross_feature_linkages_complete_v9.md](./cross_feature_linkages_complete_v9.md) - Cross-feature integration

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - All mailbox functions documented with source-level restoration