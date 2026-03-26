# Mailbox System Complete Source V3 (Claude Code 2.1.76)

> Complete source-level restoration of the teammate mailbox system including message read/write, locking, and priority polling.

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
- `Ec6` - Create idle notification — `chunks.132.mjs:153`
- `yc6` - Parse idle notification — `chunks.132.mjs:166`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MAILBOX ARCHITECTURE                                 │
└─────────────────────────────────────────────────────────────────────────────┘

File Location:
.claude/teams/{team_name}/{agent_name}/inbox.json

Message Format:
{
    "from": "agent_name" | "team-lead",
    "text": "message content",
    "read": false,
    "color": "#FF5500",
    "summary": "Progress summary"
}

Operations:
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  writeToMailbox(x3) ────► Acquire lock ────► Append message ────► Release   │
│                                                                              │
│  readMailbox(wl) ───────► Read file ────► Parse JSON ────► Return array     │
│                                                                              │
│  markMessageAsReadByIndex(Vc6) ─► Lock ─► Update ─► Write ─► Unlock         │
│                                                                              │
│  clearMailbox($TY) ──────► Write empty array []                             │
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
    let mailboxPath = getMailboxPath(agentName, teamName);  // FY6
    log(`[TeammateMailbox] readMailbox: path=${mailboxPath}`);

    try {
        let content = await fs.readFile(mailboxPath, "utf-8");
        let messages = JSON.parse(content);  // i1
        log(`[TeammateMailbox] readMailbox: read ${messages.length} message(s)`);
        return messages;
    } catch (error) {
        if (error.code === "ENOENT") {
            log("[TeammateMailbox] readMailbox: file does not exist");
            return [];
        }
        log(`Failed to read inbox for ${agentName}: ${error}`);
        reportError(error);
        return [];
    }
}

// Mapping: wl→readMailbox, A→agentName, q→teamName, K→mailboxPath,
//          FY6→getMailboxPath, xd4→fs.readFile, i1→JSON.parse, k→log, _6→reportError
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
    let messages = await readMailbox(agentName, teamName);  // wl
    let unread = messages.filter((msg) => !msg.read);
    log(`[TeammateMailbox] readUnreadMessages: ${unread.length} unread of ${messages.length} total`);
    return unread;
}

// Mapping: pY6→readUnreadMessages, A→agentName, q→teamName, K→messages, Y→unread, wl→readMailbox
```

### writeToMailbox (x3)

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
async function writeToMailbox(recipientAgentName, message, teamName) {
    // Step 1: Ensure team directory exists
    await ensureTeamDirectory(teamName);

    // Step 2: Get mailbox path
    let mailboxPath = getMailboxPath(recipientAgentName, teamName);
    let lockPath = `${mailboxPath}.lock`;

    log(`[TeammateMailbox] writeToMailbox: recipient=${recipientAgentName}, from=${message.from}, path=${mailboxPath}`);

    // Step 3: Create inbox file if it doesn't exist
    try {
        await fs.writeFile(mailboxPath, "[]", {
            encoding: "utf-8",
            flag: "wx"  // Exclusive create
        });
        log("[TeammateMailbox] writeToMailbox: created new inbox file");
    } catch (error) {
        if (error.code !== "EEXIST") {
            log(`[TeammateMailbox] writeToMailbox: failed to create inbox file: ${error}`);
            reportError(error);
            return;
        }
        // File exists, continue
    }

    // Step 4: Acquire lock and write
    let releaseLock;
    try {
        releaseLock = await fileLock.lock(mailboxPath, {
            lockfilePath: lockPath,
            ...lockOptions  // iv1
        });

        // Read existing messages
        let messages = await readMailbox(recipientAgentName, teamName);

        // Add new message
        let newMessage = {
            ...message,
            read: false
        };
        messages.push(newMessage);

        // Write back
        await fs.writeFile(mailboxPath, JSON.stringify(messages, null, 2), "utf-8");
        log(`[TeammateMailbox] Wrote message to ${recipientAgentName}'s inbox from ${message.from}`);

    } catch (error) {
        log(`Failed to write to inbox for ${recipientAgentName}: ${error}`);
        reportError(error);
    } finally {
        if (releaseLock) {
            await releaseLock();
        }
    }
}

// Mapping: x3→writeToMailbox, A→recipientAgentName, q→message, K→teamName,
//          FY6→getMailboxPath, OTY→ensureTeamDirectory, Pf6→fs.writeFile,
//          Nc6.lock→fileLock.lock, wl→readMailbox, B6→JSON.stringify, iv1→lockOptions
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
    log(`[TeammateMailbox] markMessageAsReadByIndex: agentName=${agentName}, index=${messageIndex}`);

    let lockPath = `${mailboxPath}.lock`;
    let releaseLock;

    try {
        // Acquire lock
        log("[TeammateMailbox] markMessageAsReadByIndex: acquiring lock...");
        releaseLock = await fileLock.lock(mailboxPath, {
            lockfilePath: lockPath,
            ...lockOptions
        });
        log("[TeammateMailbox] markMessageAsReadByIndex: lock acquired");

        // Read messages
        let messages = await readMailbox(agentName, teamName);
        log(`[TeammateMailbox] markMessageAsReadByIndex: read ${messages.length} messages after lock`);

        // Validate index
        if (messageIndex < 0 || messageIndex >= messages.length) {
            log(`[TeammateMailbox] markMessageAsReadByIndex: index ${messageIndex} out of bounds`);
            return;
        }

        // Check if already read
        let message = messages[messageIndex];
        if (!message || message.read) {
            log("[TeammateMailbox] markMessageAsReadByIndex: message already read or missing");
            return;
        }

        // Mark as read
        messages[messageIndex] = { ...message, read: true };

        // Write back
        await fs.writeFile(mailboxPath, JSON.stringify(messages, null, 2), "utf-8");
        log(`[TeammateMailbox] markMessageAsReadByIndex: marked message at index ${messageIndex} as read`);

    } catch (error) {
        if (error.code === "ENOENT") {
            log(`[TeammateMailbox] markMessageAsReadByIndex: file does not exist`);
            return;
        }
        log(`[TeammateMailbox] markMessageAsReadByIndex FAILED: ${error}`);
        reportError(error);
    } finally {
        if (releaseLock) {
            await releaseLock();
            log("[TeammateMailbox] markMessageAsReadByIndex: lock released");
        }
    }
}

// Mapping: Vc6→markMessageAsReadByIndex, A→agentName, q→teamName, K→messageIndex,
//          Y→mailboxPath, z→lockPath, _→releaseLock, w→messages, O→message
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
        await Pf6(K, B6(O, null, 2), "utf-8"), k(`[TeammateMailbox] markMessagesAsRead: WROTE ${w} message(s) as read`);
        // ... verification code
    } catch (_) {
        // ... error handling
    } finally {
        if (z) await z(), k("[TeammateMailbox] markMessagesAsRead: lock released")
    }
}

// READABLE (for understanding):
async function markMessagesAsRead(agentName, teamName) {
    let mailboxPath = getMailboxPath(agentName, teamName);
    log(`[TeammateMailbox] markMessagesAsRead: agentName=${agentName}`);

    let lockPath = `${mailboxPath}.lock`;
    let releaseLock;

    try {
        // Acquire lock
        releaseLock = await fileLock.lock(mailboxPath, {
            lockfilePath: lockPath,
            ...lockOptions
        });

        // Read messages
        let messages = await readMailbox(agentName, teamName);
        if (messages.length === 0) {
            log("[TeammateMailbox] markMessagesAsRead: no messages to mark");
            return;
        }

        // Count unread
        let unreadCount = messages.filter((msg) => !msg.read).length;
        log(`[TeammateMailbox] markMessagesAsRead: ${unreadCount} unread of ${messages.length} total`);

        // Mark all as read
        let allRead = messages.map((msg) => ({ ...msg, read: true }));

        // Write back
        await fs.writeFile(mailboxPath, JSON.stringify(allRead, null, 2), "utf-8");
        log(`[TeammateMailbox] markMessagesAsRead: WROTE ${unreadCount} message(s) as read`);

    } catch (error) {
        // ... error handling
    } finally {
        if (releaseLock) {
            await releaseLock();
        }
    }
}

// Mapping: kc6→markMessagesAsRead, A→agentName, q→teamName, K→mailboxPath
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
        await fs.writeFile(mailboxPath, "[]", {
            encoding: "utf-8",
            flag: "r+"  // Open for reading and writing, file must exist
        });
        log(`[TeammateMailbox] Cleared inbox for ${agentName}`);
    } catch (error) {
        if (error.code === "ENOENT") return;  // File doesn't exist, nothing to clear
        log(`Failed to clear inbox for ${agentName}: ${error}`);
        reportError(error);
    }
}

// Mapping: $TY→clearMailbox, A→agentName, q→teamName, K→mailboxPath
```

### formatMailboxMessages (HTY)

```javascript
// ============================================
// HTY - formatMailboxMessages - Format messages as XML tags
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

        return `<teammate-message teammate_id="${msg.from}"${colorAttr}${summaryAttr}>
${msg.text}
</teammate-message>`;
    }).join("\n\n");
}

// Mapping: HTY→formatMailboxMessages, A→messages, q→msg, fj→TAG_NAME ("teammate-message")
```

**Output Example:**
```xml
<teammate-message teammate_id="worker-1" color="#FF5500" summary="Analysis complete">
Found 15 instances of the pattern...
</teammate-message>

<teammate-message teammate_id="team-lead">
Please continue with the next task.
</teammate-message>
```

---

## Idle Notification

### createIdleNotification (Ec6)

```javascript
// ============================================
// Ec6 - createIdleNotification - Create idle notification object
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
function createIdleNotification(agentName, options) {
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

// Mapping: Ec6→createIdleNotification, A→agentName, q→options
```

### parseIdleNotification (yc6)

```javascript
// ============================================
// yc6 - parseIdleNotification - Parse idle notification from text
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
function parseIdleNotification(text) {
    try {
        let parsed = JSON.parse(text);  // i1
        if (parsed && parsed.type === "idle_notification") {
            return parsed;
        }
    } catch {
        // Not valid JSON or not an idle notification
    }
    return null;
}

// Mapping: yc6→parseIdleNotification, A→text, i1→JSON.parse
```

---

## Polling Priority

The mailbox polling in `pollForNextMessage` (DNY) uses this priority order:

1. **Pending user messages** (fastest path) - Direct UI input
2. **Shutdown requests** - Coordinated termination
3. **Team-lead messages** - Priority over other teammates
4. **Any unread message** - General communication
5. **Unclaimed tasks** - Auto-claim from shared task list

---

## File Locking Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FILE LOCKING STRATEGY                                │
└─────────────────────────────────────────────────────────────────────────────┘

Write Operation:
1. Create inbox.json if not exists (flag: "wx")
2. Acquire lock on inbox.json
3. Read existing messages
4. Append new message
5. Write back to file
6. Release lock

Read Operation:
1. Read file (no lock needed for read-only)
2. Parse JSON
3. Return messages

Mark-as-Read Operation:
1. Acquire lock on inbox.json
2. Read messages
3. Update read flag
4. Write back
5. Release lock

Lock Options (iv1):
- Stale threshold: 5000ms (locks older than this are considered stale)
- Retry interval: 100ms
- Max retries: 50
```

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `wl` | readMailbox | chunks.132.mjs:3 | ✓ Verified |
| `pY6` | readUnreadMessages | chunks.132.mjs:16 | ✓ Verified |
| `x3` | writeToMailbox | chunks.132.mjs:22 | ✓ Verified |
| `Vc6` | markMessageAsReadByIndex | chunks.132.mjs:57 | ✓ Verified |
| `kc6` | markMessagesAsRead | chunks.132.mjs:92 | ✓ Verified |
| `$TY` | clearMailbox | chunks.132.mjs:128 | ✓ Verified |
| `HTY` | formatMailboxMessages | chunks.132.mjs:141 | ✓ Verified |
| `Ec6` | createIdleNotification | chunks.132.mjs:153 | ✓ Verified |
| `yc6` | parseIdleNotification | chunks.132.mjs:166 | ✓ Verified |

---

## Related Documents

- [teammate_execution_complete_source_v3.md](./teammate_execution_complete_source_v3.md) - Teammate execution
- [agent_loop_complete_source_v4.md](./agent_loop_complete_source_v4.md) - Agent loop
- [cross_validation_report_v3.md](./cross_validation_report_v3.md) - Symbol verification