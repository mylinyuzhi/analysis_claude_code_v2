# Communication and Coordination - Subagent System (Claude Code 2.1.76)

## Overview

This document covers the mailbox-based inter-agent communication system used by teammate agents, the priority poll loop, and the in-process agent runner.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `readMailbox` (wl) - Read all messages from mailbox - chunks.132.mjs:3
- `readUnreadMessages` (pY6) - Read only unread messages - chunks.132.mjs:16
- `writeToMailbox` (x3) - Write message to mailbox - chunks.132.mjs:22
- `markMessageAsReadByIndex` (Vc6) - Mark single message as read - chunks.132.mjs:57
- `markMessagesAsRead` (kc6) - Mark all messages as read - chunks.132.mjs:92
- `clearMailbox` ($TY) - Clear all messages from mailbox - chunks.132.mjs:128
- `formatMailboxMessages` (HTY) - Format messages as XML - chunks.132.mjs:141
- `spawnTeammate` (qn4) - Spawn teammate agent - chunks.135.mjs:1116
- `spawnTeammateDispatcher` (pNY) - Route teammate spawn to backend - chunks.135.mjs:1110
- `inProcessAgentRunner` (XNY) - Runner for in-process teammates - chunks.134.mjs:1571
- `pollForNextMessage` (DNY) - Priority poll loop - chunks.134.mjs:1483
- `claimUnclaimedTask` (Ji4) - Claim unclaimed task for teammate - chunks.134.mjs:1464

> **Note:** Previous documentation incorrectly mapped:
> - `Ld` as `readMailbox` (actual: `wl`)
> - `f9` as `writeToMailbox` (actual: `x3`)
> - `JQ1` as `markMessageAsReadByIndex` (actual: `Vc6`)
> - `iVY` as `spawnTeammateDispatcher` (actual: `pNY`; `iVY` is `fs.promises` from Node.js)

---

## Mailbox Architecture

### File-Based Message Queue

Each teammate agent has a mailbox stored as a JSONL file on the filesystem. Messages are appended to the file and read sequentially.

```
~/.claude/sessions/{sessionId}/agents/{agentId}/mailbox.jsonl
```

**Message format:**
```jsonl
{"index": 0, "from": "orchestrator", "content": "...", "timestamp": 1234567890, "readAt": null}
{"index": 1, "from": "teammate-abc", "content": "...", "timestamp": 1234567891, "readAt": 1234567892}
```

### readMailbox (wl)

**What it does:** Reads all messages from the mailbox file, returning unread messages.

**How it works:**
1. Read the mailbox JSONL file
2. Parse each line as a message record
3. Filter to messages where `readAt === null`
4. Return filtered messages sorted by index

```javascript
// ============================================
// readMailbox - Read messages from mailbox
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
    log(`[TeammateMailbox] readMailbox: path=${mailboxPath}`);
    try {
        let content = await fs.readFile(mailboxPath, "utf-8");
        let messages = parseJsonl(content);
        log(`[TeammateMailbox] readMailbox: read ${messages.length} message(s)`);
        return messages;
    } catch (err) {
        if (err.code === "ENOENT") {
            log("[TeammateMailbox] readMailbox: file does not exist");
            return [];
        }
        log(`Failed to read inbox for ${agentName}: ${err}`);
        reportError(err);
        return [];
    }
}

// Mapping: wl→readMailbox, A→agentName, q→teamName, FY6→getMailboxPath,
// xd4→fs.readFile, i1→parseJsonl, k→log, _6→reportError
```

### writeToMailbox (x3)

**What it does:** Appends a message to a target agent's mailbox file with file locking.

**How it works:**
1. Create the mailbox file if it doesn't exist
2. Acquire a file lock to prevent concurrent writes
3. Read existing messages, append new message
4. Write back atomically with lock release

```javascript
// ============================================
// writeToMailbox - Write message to mailbox with locking
// Location: chunks.132.mjs:22-55
// ============================================

// ORIGINAL (for source lookup):
async function x3(A, q, K) {
    await OTY(K);
    let Y = FY6(A, K),
        z = `${Y}.lock`;
    k(`[TeammateMailbox] writeToMailbox: recipient=${A}, from=${q.from}, path=${Y}`);
    try {
        await Pf6(Y, "[]", { encoding: "utf-8", flag: "wx" }),
            k("[TeammateMailbox] writeToMailbox: created new inbox file")
    } catch (w) {
        if (w.code !== "EEXIST") {
            k(`[TeammateMailbox] writeToMailbox: failed to create inbox file: ${w}`), _6(w);
            return
        }
    }
    let _;
    try {
        _ = await Nc6.lock(Y, { lockfilePath: z, ...iv1 });
        let w = await wl(A, K),
            O = { ...q, read: !1 };
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
    await validateTeamContext(teamName);
    let mailboxPath = getMailboxPath(recipientAgentName, teamName);
    let lockPath = `${mailboxPath}.lock`;
    log(`[TeammateMailbox] writeToMailbox: recipient=${recipientAgentName}, from=${message.from}, path=${mailboxPath}`);

    // Create mailbox file if it doesn't exist
    try {
        await fs.writeFile(mailboxPath, "[]", { encoding: "utf-8", flag: "wx" });
        log("[TeammateMailbox] writeToMailbox: created new inbox file");
    } catch (err) {
        if (err.code !== "EEXIST") {
            log(`[TeammateMailbox] writeToMailbox: failed to create inbox file: ${err}`);
            reportError(err);
            return;
        }
    }

    // Acquire lock and write
    let releaseLock;
    try {
        releaseLock = await properLockfile.lock(mailboxPath, { lockfilePath: lockPath, ...lockOptions });
        let messages = await readMailbox(recipientAgentName, teamName);
        let newMessage = { ...message, read: false };
        messages.push(newMessage);
        await fs.writeFile(mailboxPath, JSON.stringify(messages, null, 2), "utf-8");
        log(`[TeammateMailbox] Wrote message to ${recipientAgentName}'s inbox from ${message.from}`);
    } catch (err) {
        log(`Failed to write to inbox for ${recipientAgentName}: ${err}`);
        reportError(err);
    } finally {
        if (releaseLock) await releaseLock();
    }
}

// Mapping: x3→writeToMailbox, A→recipientAgentName, q→message, K→teamName,
// FY6→getMailboxPath, OTY→validateTeamContext, Pf6→fs.writeFile, B6→JSON.stringify,
// Nc6.lock→properLockfile.lock, wl→readMailbox, iv1→lockOptions
```

### markMessageAsReadByIndex (Vc6)

**What it does:** Updates the `read` flag for a specific message, marking it as processed.

**How it works:**
1. Acquire file lock on mailbox
2. Read current messages
3. Update the specific message's `read` field to `true`
4. Write back atomically

**Why atomic update instead of in-place rewrite:**
- Append-only writes are safer (no risk of truncating the file on crash)
- The read status is stored as an update to the message record
- File locking prevents race conditions between concurrent readers/writers

```javascript
// ============================================
// markMessageAsReadByIndex - Mark message as read with locking
// Location: chunks.132.mjs:57-90
// ============================================

// ORIGINAL (for source lookup):
async function Vc6(A, q, K) {
    let Y = FY6(A, q);
    k(`[TeammateMailbox] markMessageAsReadByIndex called: agentName=${A}, teamName=${q}, index=${K}, path=${Y}`);
    let z = `${Y}.lock`,
        _;
    try {
        k("[TeammateMailbox] markMessageAsReadByIndex: acquiring lock..."),
            _ = await Nc6.lock(Y, { lockfilePath: z, ...iv1 }),
            k("[TeammateMailbox] markMessageAsReadByIndex: lock acquired");
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
        w[K] = { ...O, read: !0 },
            await Pf6(Y, B6(w, null, 2), "utf-8"),
            k(`[TeammateMailbox] markMessageAsReadByIndex: marked message at index ${K} as read`)
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
    log(`[TeammateMailbox] markMessageAsReadByIndex called: agentName=${agentName}, teamName=${teamName}, index=${messageIndex}`);
    let lockPath = `${mailboxPath}.lock`;
    let releaseLock;

    try {
        log("[TeammateMailbox] markMessageAsReadByIndex: acquiring lock...");
        releaseLock = await properLockfile.lock(mailboxPath, { lockfilePath: lockPath, ...lockOptions });
        log("[TeammateMailbox] markMessageAsReadByIndex: lock acquired");

        let messages = await readMailbox(agentName, teamName);
        log(`[TeammateMailbox] markMessageAsReadByIndex: read ${messages.length} messages after lock`);

        // Validate index
        if (messageIndex < 0 || messageIndex >= messages.length) {
            log(`[TeammateMailbox] markMessageAsReadByIndex: index ${messageIndex} out of bounds (${messages.length} messages)`);
            return;
        }

        let message = messages[messageIndex];
        if (!message || message.read) {
            log("[TeammateMailbox] markMessageAsReadByIndex: message already read or missing");
            return;
        }

        // Update message and write back
        messages[messageIndex] = { ...message, read: true };
        await fs.writeFile(mailboxPath, JSON.stringify(messages, null, 2), "utf-8");
        log(`[TeammateMailbox] markMessageAsReadByIndex: marked message at index ${messageIndex} as read`);
    } catch (err) {
        if (err.code === "ENOENT") {
            log(`[TeammateMailbox] markMessageAsReadByIndex: file does not exist at ${mailboxPath}`);
            return;
        }
        log(`[TeammateMailbox] markMessageAsReadByIndex FAILED for ${agentName}: ${err}`);
        reportError(err);
    } finally {
        if (releaseLock) {
            await releaseLock();
            log("[TeammateMailbox] markMessageAsReadByIndex: lock released");
        }
    }
}

// Mapping: Vc6→markMessageAsReadByIndex, A→agentName, q→teamName, K→messageIndex,
// FY6→getMailboxPath, Nc6.lock→properLockfile.lock, wl→readMailbox, Pf6→fs.writeFile
```

### readUnreadMessages (pY6)

**What it does:** Reads all messages from the mailbox and returns only the unread ones.

**How it works:**
1. Call `readMailbox` to get all messages
2. Filter to messages where `read === false`
3. Return filtered list with logging

```javascript
// ============================================
// readUnreadMessages - Get only unread messages
// Location: chunks.132.mjs:16-19
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
    log(`[TeammateMailbox] readUnreadMessages: ${unreadMessages.length} unread of ${allMessages.length} total`);
    return unreadMessages;
}

// Mapping: pY6→readUnreadMessages, A→agentName, q→teamName, wl→readMailbox, k→log
```

### markMessagesAsRead (kc6)

**What it does:** Marks ALL messages in the mailbox as read in a single operation.

**How it works:**
1. Acquire file lock on mailbox
2. Read all current messages
3. Update each message's `read` field to `true`
4. Write back atomically
5. Verify the write succeeded

**Why use this over individual marking:** When the agent has finished processing all messages (e.g., before going idle), marking all at once is more efficient than N individual lock/unlock cycles.

```javascript
// ============================================
// markMessagesAsRead - Mark all messages as read
// Location: chunks.132.mjs:92-125
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
    log(`[TeammateMailbox] markMessagesAsRead called: agentName=${agentName}, teamName=${teamName}`);
    let lockPath = `${mailboxPath}.lock`;
    let releaseLock;

    try {
        log("[TeammateMailbox] markMessagesAsRead: acquiring lock...");
        releaseLock = await properLockfile.lock(mailboxPath, { lockfilePath: lockPath, ...lockOptions });
        log("[TeammateMailbox] markMessagesAsRead: lock acquired");

        let messages = await readMailbox(agentName, teamName);
        log(`[TeammateMailbox] markMessagesAsRead: read ${messages.length} messages after lock`);

        if (messages.length === 0) {
            log("[TeammateMailbox] markMessagesAsRead: no messages to mark");
            return;
        }

        let unreadCount = messages.filter((msg) => !msg.read).length;
        log(`[TeammateMailbox] markMessagesAsRead: ${unreadCount} unread of ${messages.length} total`);

        // Mark all as read
        let updatedMessages = messages.map((msg) => ({ ...msg, read: true }));
        await fs.writeFile(mailboxPath, JSON.stringify(updatedMessages, null, 2), "utf-8");
        log(`[TeammateMailbox] markMessagesAsRead: WROTE ${unreadCount} message(s) as read`);

        // Verify write
        let verifyContent = await fs.readFile(mailboxPath, "utf-8");
        let stillUnread = parseJsonl(verifyContent).filter((msg) => !msg.read).length;
        log(`[TeammateMailbox] markMessagesAsRead: VERIFY - ${stillUnread} still unread after write`);
    } catch (err) {
        if (err.code === "ENOENT") {
            log(`[TeammateMailbox] markMessagesAsRead: file does not exist at ${mailboxPath}`);
            return;
        }
        log(`[TeammateMailbox] markMessagesAsRead FAILED for ${agentName}: ${err}`);
        reportError(err);
    } finally {
        if (releaseLock) {
            await releaseLock();
            log("[TeammateMailbox] markMessagesAsRead: lock released");
        }
    }
}

// Mapping: kc6→markMessagesAsRead, A→agentName, q→teamName, FY6→getMailboxPath,
// wl→readMailbox, Nc6.lock→properLockfile.lock, Pf6→fs.writeFile, B6→JSON.stringify
```

### clearMailbox ($TY)

**What it does:** Clears all messages from the mailbox by writing an empty array.

**How it works:**
1. Get the mailbox path
2. Write `"[]"` to the file (empty JSON array)
3. Log the action

**Why use this:** When an agent is being shut down or reset, clearing the mailbox prevents stale messages from affecting future sessions.

```javascript
// ============================================
// clearMailbox - Clear all messages from mailbox
// Location: chunks.132.mjs:128-138
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
    } catch (err) {
        if (err.code === "ENOENT") return;  // File doesn't exist, nothing to clear
        log(`Failed to clear inbox for ${agentName}: ${err}`);
        reportError(err);
    }
}

// Mapping: $TY→clearMailbox, A→agentName, q→teamName, FY6→getMailboxPath,
// Pf6→fs.writeFile, k→log, _6→reportError
```

### formatMailboxMessages (HTY)

**What it does:** Formats an array of mailbox messages into XML-style tags for inclusion in the conversation.

**How it works:**
1. For each message, create an XML tag with attributes for `teammate_id`, `color`, `summary`
2. Include the message text inside the tag
3. Join all tags with newlines

**Why XML format:** The XML format is easily parseable by the LLM and provides clear delimiters between messages from different teammates.

```javascript
// ============================================
// formatMailboxMessages - Format messages as XML
// Location: chunks.132.mjs:141-149
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

---

## Priority Poll Loop (DNY)

### pollForNextMessage (DNY)

**What it does:** The teammate's main wait loop, checking message sources in priority order.

**Why priority ordering:**
- User interrupts must be processed immediately, regardless of pending mailbox messages
- Processing a mailbox message while a user interrupt is pending would add latency to the interrupt

**5-Level Priority:**

```
Priority 1: AbortSignal fired (user killed task)
    → Stop immediately, no further processing

Priority 2: User interrupt message in mailbox
    → Process immediately

Priority 3: Orchestrator message in mailbox
    → Process next orchestrator instruction

Priority 4: Own completion (agent loop finished)
    → Send completion message to orchestrator

Priority 5: Idle
    → Wait with exponential backoff
```

```javascript
// ============================================
// pollForNextMessage - Priority poll loop for teammate messages
// Location: chunks.134.mjs:1483-1569
// ============================================

// ORIGINAL (for source lookup):
async function DNY(A, q, K, Y, z, _) {
    k(`[inProcessRunner] ${A.agentName} starting poll loop (abort=${q.signal.aborted})`);
    let O = 0;
    while (!q.signal.aborted) {
        let H = Y().tasks[K];
        if (H && H.type === "in_process_teammate" && H.pendingUserMessages.length > 0) {
            let J = H.pendingUserMessages[0];
            return z((M) => ({
                ...M,
                tasks: {
                    ...M.tasks,
                    [K]: {
                        ...M.tasks[K],
                        pendingUserMessages: M.tasks[K].pendingUserMessages.slice(1)
                    }
                }
            })), {
                type: "new_message",
                message: J,
                from: "user"
            }
        }
        if (O > 0) await jNY(500);
        if (O++, q.signal.aborted) return {
            type: "aborted"
        };
        k(`[inProcessRunner] ${A.agentName} poll #${O}: checking mailbox`);
        try {
            let J = await wl(A.agentName, A.teamName),
                M = -1,
                D = null;
            for (let P = 0; P < J.length; P++) {
                let W = J[P];
                if (W && !W.read) {
                    let Z = M66(W.text);
                    if (Z) {
                        M = P, D = Z;
                        break
                    }
                }
            }
            if (M !== -1) {
                let P = J[M],
                    W = J.slice(0, M).filter((Z) => !Z.read).length;
                return k(`[inProcessRunner] ${A.agentName} received shutdown request from ${D?.from} (prioritized over ${W} unread messages)`), await Vc6(A.agentName, A.teamName, M), {
                    type: "shutdown_request",
                    request: D,
                    originalMessage: P.text
                }
            }
            let X = -1;
            for (let P = 0; P < J.length; P++) {
                let W = J[P];
                if (W && !W.read && W.from === BY) {
                    X = P;
                    break
                }
            }
            if (X === -1) X = J.findIndex((P) => !P.read);
            if (X !== -1) {
                let P = J[X];
                if (P) return k(`[inProcessRunner] ${A.agentName} received new message from ${P.from} (index ${X})`), await Vc6(A.agentName, A.teamName, X), {
                    type: "new_message",
                    message: P.text,
                    from: P.from,
                    color: P.color,
                    summary: P.summary
                }
            }
        } catch (J) {
            k(`[inProcessRunner] ${A.agentName} poll error: ${J}`)
        }
        let j = await Ji4(_, A.agentName);
        if (j) return {
            type: "new_message",
            message: j,
            from: "task-list"
        }
    }
    return {
        type: "aborted"
    }
}

// READABLE (for understanding):
async function pollForNextMessage(agentConfig, abortController, taskId, getAppState, setAppState, sessionId) {
    log(`[inProcessRunner] ${agentConfig.agentName} starting poll loop (abort=${abortController.signal.aborted})`);
    let pollCount = 0;

    while (!abortController.signal.aborted) {
        // Priority 1: Check for pending user messages (highest priority)
        let taskState = getAppState().tasks[taskId];
        if (taskState?.type === "in_process_teammate" && taskState.pendingUserMessages.length > 0) {
            let message = taskState.pendingUserMessages[0];
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

        // Delay between polls
        if (pollCount > 0) await sleep(500);
        pollCount++;

        // Priority 2: Check abort signal
        if (abortController.signal.aborted) {
            return { type: "aborted" };
        }

        log(`[inProcessRunner] ${agentConfig.agentName} poll #${pollCount}: checking mailbox`);

        // Priority 3: Check mailbox for messages
        try {
            let messages = await readMailbox(agentConfig.agentName, agentConfig.teamName);

            // Check for shutdown request first (highest mailbox priority)
            let shutdownIndex = -1;
            let shutdownRequest = null;
            for (let i = 0; i < messages.length; i++) {
                let msg = messages[i];
                if (msg && !msg.read) {
                    let parsed = parseShutdownRequest(msg.text);
                    if (parsed) {
                        shutdownIndex = i;
                        shutdownRequest = parsed;
                        break;
                    }
                }
            }

            if (shutdownIndex !== -1) {
                let msg = messages[shutdownIndex];
                let unreadCount = messages.slice(0, shutdownIndex).filter((m) => !m.read).length;
                log(`[inProcessRunner] ${agentConfig.agentName} received shutdown request from ${shutdownRequest?.from} (prioritized over ${unreadCount} unread messages)`);
                await markMessageAsReadByIndex(agentConfig.agentName, agentConfig.teamName, shutdownIndex);
                return { type: "shutdown_request", request: shutdownRequest, originalMessage: msg.text };
            }

            // Check for orchestrator messages (from "orchestrator" sender)
            let orchestratorIndex = -1;
            for (let i = 0; i < messages.length; i++) {
                let msg = messages[i];
                if (msg && !msg.read && msg.from === ORCHESTRATOR_SENDER) {
                    orchestratorIndex = i;
                    break;
                }
            }

            // Fall back to any unread message
            if (orchestratorIndex === -1) {
                orchestratorIndex = messages.findIndex((m) => !m.read);
            }

            if (orchestratorIndex !== -1) {
                let msg = messages[orchestratorIndex];
                if (msg) {
                    log(`[inProcessRunner] ${agentConfig.agentName} received new message from ${msg.from} (index ${orchestratorIndex})`);
                    await markMessageAsReadByIndex(agentConfig.agentName, agentConfig.teamName, orchestratorIndex);
                    return { type: "new_message", message: msg.text, from: msg.from, color: msg.color, summary: msg.summary };
                }
            }
        } catch (err) {
            log(`[inProcessRunner] ${agentConfig.agentName} poll error: ${err}`);
        }

        // Priority 4: Check for unclaimed tasks
        let taskPrompt = await claimUnclaimedTask(sessionId, agentConfig.agentName);
        if (taskPrompt) {
            return { type: "new_message", message: taskPrompt, from: "task-list" };
        }
    }

    return { type: "aborted" };
}

// Mapping: DNY→pollForNextMessage, A→agentConfig, q→abortController, K→taskId,
// Y→getAppState, z→setAppState, _→sessionId, wl→readMailbox, Vc6→markMessageAsReadByIndex,
// Ji4→claimUnclaimedTask, jNY→sleep, M66→parseShutdownRequest, BY→ORCHESTRATOR_SENDER
```

---

## In-Process Agent Runner (XNY)

### inProcessAgentRunner (XNY)

**What it does:** Runs a teammate agent in-process (within the same Node.js process) rather than in a separate terminal pane.

**When used:**
- Non-interactive sessions (API calls, SDK usage)
- Sessions without iTerm2 or tmux available

**How it works:**
1. Start the agent loop as a generator
2. In parallel, run the poll loop for incoming messages
3. When a message arrives, inject it into the agent loop as a user message
4. When the agent produces output, write it to the parent's mailbox
5. On completion, send completion message

```javascript
// ============================================
// inProcessAgentRunner - In-process teammate execution
// Location: chunks.134.mjs:1571-1850
// ============================================

// ORIGINAL (for source lookup):
async function XNY(A) {
    let {
        identity: q,
        taskId: K,
        prompt: Y,
        description: z,
        agentDefinition: _,
        teammateContext: w,
        toolUseContext: O,
        abortController: $,
        model: H,
        systemPrompt: j,
        systemPromptMode: J,
        allowedTools: M,
        allowPermissionPrompts: D
    } = A, {
        setAppState: X
    } = O;
    k(`[inProcessRunner] Starting agent loop for ${q.agentId}`);
    // ... agent setup, poll loop, and message handling ...
}

// READABLE (for understanding):
async function inProcessAgentRunner(config) {
    let {
        identity,          // Agent identity (agentId, parentSessionId, agentName, teamName)
        taskId,            // Unique task identifier
        prompt,            // Initial prompt for the agent
        description,       // Human-readable task description
        agentDefinition,   // Agent type configuration
        teammateContext,   // Team-specific context
        toolUseContext,    // Tool permissions and context
        abortController,   // Abort signal for cancellation
        model,             // Model override
        systemPrompt,      // Custom system prompt
        systemPromptMode,  // "replace" or "append"
        allowedTools,      // Tool whitelist
        allowPermissionPrompts  // Whether to allow permission prompts
    } = config;

    let { setAppState } = toolUseContext;
    log(`[inProcessRunner] Starting agent loop for ${identity.agentId}`);

    // Build agent configuration
    let agentConfig = {
        agentId: identity.agentId,
        parentSessionId: identity.parentSessionId,
        agentName: identity.agentName,
        teamName: identity.teamName,
        agentColor: identity.color,
        planModeRequired: identity.planModeRequired,
        isTeamLead: false,
        agentType: "teammate"
    };

    // Build system prompt based on mode
    let resolvedSystemPrompt;
    if (systemPromptMode === "replace" && systemPrompt) {
        resolvedSystemPrompt = systemPrompt;
    } else {
        // Build default system prompt with custom instructions
        let promptParts = [...await buildDefaultSystemPrompt(toolUseContext)];
        if (agentDefinition?.getSystemPrompt()) {
            promptParts.push(`# Custom Agent Instructions\n${agentDefinition.getSystemPrompt()}`);
        }
        resolvedSystemPrompt = promptParts.join("\n");
    }

    // Create merged agent definition
    let mergedAgentDef = {
        agentType: identity.agentName,
        whenToUse: `In-process teammate: ${identity.agentName}`,
        getSystemPrompt: () => resolvedSystemPrompt,
        tools: agentDefinition?.tools ?? ["*"],
        source: "projectSettings",
        permissionMode: "default"
    };

    // Main execution loop
    while (!abortController.signal.aborted && !isComplete) {
        log(`[inProcessRunner] ${identity.agentId} processing prompt...`);

        // Create abort controller for current work
        let workAbortController = createAbortController();
        updateTask(taskId, { currentWorkAbortController: workAbortController }, setAppState);

        // Run agent loop
        for await (let event of agentLoopRunner({ agentDefinition: mergedAgentDef, ... })) {
            if (event.type === "assistant") {
                // Forward progress to parent mailbox
                await writeToMailbox(parentAgentId, { type: "progress", content: event.message });
            }
        }

        // Poll for next message
        let pollResult = await pollForNextMessage(identity, abortController, taskId, getAppState, setAppState, identity.parentSessionId);
        if (pollResult.type === "new_message") {
            currentPrompt = pollResult.message;
        } else if (pollResult.type === "shutdown_request" || pollResult.type === "aborted") {
            break;
        }
    }

    // Send idle notification on completion
    await sendIdleNotification(identity.agentName, identity.teamName);
}

// Mapping: XNY→inProcessAgentRunner, A→config, q→identity, K→taskId, Y→prompt, z→description,
// _→agentDefinition, w→teammateContext, O→toolUseContext, $→abortController, H→model, j→systemPrompt
```

### Shared appState Optimization

For in-process teammates, the parent and teammate share the same `appState` object. This avoids serialization overhead for reading shared state.

**What is shared:** `getAppState`, `setAppState` - both agents operate on the same global state object.

**What is NOT shared:** `readFileState` - each agent tracks its own file reads independently. This is cloned via `new Map(parentContext.readFileState)`.

---

## Task Claiming System (Ji4)

### claimUnclaimedTask (Ji4)

**What it does:** Allows in-process teammates to claim unclaimed tasks from the shared task list, enabling work distribution among team members.

**How it works:**
1. Load the task list for the session
2. Find the first task with `status: "pending"` and no owner
3. Atomically claim the task by setting owner to this agent
4. Update task status to `in_progress`
5. Return the task prompt for processing

```javascript
// ============================================
// claimUnclaimedTask - Claim unclaimed task for teammate
// Location: chunks.134.mjs:1464-1481
// ============================================

// ORIGINAL (for source lookup):
async function Ji4(A, q) {
    try {
        let K = await DX(A),
            Y = JNY(K);
        if (!Y) return;
        let z = await OT8(A, Y.id, q);
        if (!z.success) {
            k(`[inProcessRunner] Failed to claim task #${Y.id}: ${z.reason}`);
            return
        }
        return await WI(A, Y.id, {
            status: "in_progress"
        }), k(`[inProcessRunner] Claimed task #${Y.id}: ${Y.subject}`), MNY(Y)
    } catch (K) {
        k(`[inProcessRunner] Error checking task list: ${K}`);
        return
    }
}

// READABLE (for understanding):
async function claimUnclaimedTask(sessionId, agentName) {
    try {
        // Load task list for session
        let taskList = await loadTaskList(sessionId);

        // Find first unclaimed task
        let unclaimedTask = findFirstUnclaimedTask(taskList);
        if (!unclaimedTask) return null;

        // Atomically claim the task
        let claimResult = await claimTask(sessionId, unclaimedTask.id, agentName);
        if (!claimResult.success) {
            log(`[inProcessRunner] Failed to claim task #${unclaimedTask.id}: ${claimResult.reason}`);
            return null;
        }

        // Update task status to in_progress
        await updateTaskStatus(sessionId, unclaimedTask.id, { status: "in_progress" });
        log(`[inProcessRunner] Claimed task #${unclaimedTask.id}: ${unclaimedTask.subject}`);

        // Return formatted task prompt
        return formatTaskPrompt(unclaimedTask);
    } catch (err) {
        log(`[inProcessRunner] Error checking task list: ${err}`);
        return null;
    }
}

// Mapping: Ji4→claimUnclaimedTask, A→sessionId, q→agentName,
// DX→loadTaskList, JNY→findFirstUnclaimedTask, OT8→claimTask, WI→updateTaskStatus, MNY→formatTaskPrompt
```

**Why atomic claiming:** Multiple teammates may poll for tasks simultaneously. Without atomic claiming, two agents could claim the same task. The `claimTask` operation uses optimistic locking to ensure only one agent succeeds.

**Key insight:** The task claiming system enables work distribution among teammates without explicit assignment. Teammates naturally pick up available work, creating a self-organizing work pool pattern.

---

## Teammate Spawn Dispatcher (iVY)

### spawnTeammateDispatcher (iVY)

**What it does:** Routes teammate spawn requests to the appropriate backend based on session capabilities.

**Backend selection priority:**
1. **In-process** - Non-interactive sessions, SDK usage
2. **Split-pane** - iTerm2 or tmux available
3. **Tmux-only** - Fallback for headless sessions

```javascript
// ============================================
// spawnTeammateDispatcher - Route teammate spawn to backend
// Location: chunks.129.mjs:2550
// ============================================

// READABLE (for understanding):
async function spawnTeammateDispatcher(agentDefinition, context, teamConfig) {
    // Check session type to determine backend
    if (isNonInteractiveSession()) {
        // Use in-process runner for SDK/API sessions
        return inProcessAgentRunner(agentDefinition, context, teamConfig);
    }

    if (hasITerm2() && isInteractiveSession()) {
        // Use split-pane for visual collaboration
        return spawnSplitPaneTeammate(agentDefinition, context, teamConfig);
    }

    if (hasTmux()) {
        // Fallback to tmux for headless sessions
        return spawnTmuxTeammate(agentDefinition, context, teamConfig);
    }

    // Final fallback to in-process
    return inProcessAgentRunner(agentDefinition, context, teamConfig);
}

// Mapping: iVY→spawnTeammateDispatcher
```

---

## Error Handling

### Lock Timeout

If acquiring the mailbox file lock takes longer than the timeout:
1. Log a warning
2. Retry with exponential backoff (up to 3 retries)
3. On final failure, raise `MailboxLockTimeoutError`

### Mailbox Corruption

If a mailbox JSONL line fails to parse:
1. Log the corrupted line with its index
2. Skip the corrupted record
3. Continue processing remaining records

**Why not fail on corruption:** A single corrupted message should not halt the entire agent. The corruption may affect only one message; subsequent messages may be valid.

---

## Idle Notification Protocol

### buildIdleNotification (Ec6)

**What it does:** Constructs an idle notification message that a teammate sends to the orchestrator when it completes its work and is waiting for more tasks.

**How it works:**
1. Create a message object with type "idle_notification"
2. Include timestamp, agent name, and completion details
3. Include optional summary, failure reason, and task ID

```javascript
// ============================================
// buildIdleNotification - Construct idle notification message
// Location: chunks.132.mjs:153-163
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

**Why this design:** The idle notification allows the orchestrator to know when teammates have finished their work and can be assigned new tasks. This is essential for work distribution in agent teams.

### parseIdleNotification (yc6)

**What it does:** Parses a raw message string to extract an idle notification if present.

**How it works:**
1. Parse the input string as JSON
2. Check if it has type "idle_notification"
3. Return the parsed object or null if not a valid notification

```javascript
// ============================================
// parseIdleNotification - Parse idle notification from raw message
// Location: chunks.132.mjs:166-171
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
function parseIdleNotification(rawMessage) {
    try {
        let parsed = parseJson(rawMessage);
        if (parsed && parsed.type === "idle_notification") {
            return parsed;
        }
    } catch {
        // Not valid JSON or not an idle notification
    }
    return null;
}

// Mapping: yc6→parseIdleNotification, A→rawMessage, i1→parseJson
```

---

## Permission Request Protocol

### buildPermissionRequest (Xx8)

**What it does:** Constructs a permission request message that a teammate sends to the orchestrator when it needs user approval for an action.

**How it works:**
1. Create a message object with type "permission_request"
2. Include request_id for correlation
3. Include tool details (name, use_id, description, input)
4. Include permission suggestions for the user

```javascript
// ============================================
// buildPermissionRequest - Construct permission request message
// Location: chunks.132.mjs:174-184
// ============================================

// ORIGINAL (for source lookup):
function Xx8(A) {
    return {
        type: "permission_request",
        request_id: A.request_id,
        agent_id: A.agent_id,
        tool_name: A.tool_name,
        tool_use_id: A.tool_use_id,
        description: A.description,
        input: A.input,
        permission_suggestions: A.permission_suggestions || []
    }
}

// READABLE (for understanding):
function buildPermissionRequest(request) {
    return {
        type: "permission_request",
        request_id: request.request_id,
        agent_id: request.agent_id,
        tool_name: request.tool_name,
        tool_use_id: request.tool_use_id,
        description: request.description,
        input: request.input,
        permission_suggestions: request.permission_suggestions || []
    };
}

// Mapping: Xx8→buildPermissionRequest, A→request
```

### buildPermissionResponse (Px8)

**What it does:** Constructs a permission response message that the orchestrator sends back to the teammate after the user approves or denies the request.

**How it works:**
1. Check if the response is an error
2. Create appropriate response object with subtype
3. Include updated_input and permission_updates on success

```javascript
// ============================================
// buildPermissionResponse - Construct permission response message
// Location: chunks.132.mjs:187-203
// ============================================

// ORIGINAL (for source lookup):
function Px8(A) {
    if (A.subtype === "error") return {
        type: "permission_response",
        request_id: A.request_id,
        subtype: "error",
        error: A.error || "Permission denied"
    };
    return {
        type: "permission_response",
        request_id: A.request_id,
        subtype: "success",
        response: {
            updated_input: A.updated_input,
            permission_updates: A.permission_updates
        }
    }
}

// READABLE (for understanding):
function buildPermissionResponse(response) {
    if (response.subtype === "error") {
        return {
            type: "permission_response",
            request_id: response.request_id,
            subtype: "error",
            error: response.error || "Permission denied"
        };
    }
    return {
        type: "permission_response",
        request_id: response.request_id,
        subtype: "success",
        response: {
            updated_input: response.updated_input,
            permission_updates: response.permission_updates
        }
    };
}

// Mapping: Px8→buildPermissionResponse, A→response
```

**Why this design:** The permission protocol allows teammates to request user approval without blocking the main session. The request/response correlation via `request_id` ensures responses are matched to the correct requests.

---

## Message Protocol Summary

The teammate communication system uses several message types:

| Message Type | Direction | Purpose |
|--------------|-----------|---------|
| `teammate_message` | Any → Any | General communication |
| `idle_notification` | Teammate → Orchestrator | Signal completion/availability |
| `permission_request` | Teammate → Orchestrator | Request user approval |
| `permission_response` | Orchestrator → Teammate | Return approval/denial |
| `shutdown_request` | Orchestrator → Teammate | Request graceful termination |

---

## Design Rationale

### Why File-Based Mailboxes?

**Alternatives considered:**
1. **In-memory queues** - Fast but not persistent across crashes
2. **Database** - Durable but adds a dependency
3. **Unix sockets** - Low latency but complex setup

**The chosen approach** (JSONL files) provides:
- **Durability** - Messages survive process crashes
- **Debuggability** - Admins can inspect mailbox files directly
- **No dependencies** - Only requires filesystem access

### Why JSONL Over JSON?

JSON files require reading and rewriting the entire file on each update. JSONL files support append-only writes, which is both faster and safer (no risk of truncation on crash).

### Why Exponential Backoff in Poll Loop?

When idle, polling at a fixed interval wastes CPU. Exponential backoff reduces polling frequency during long waits while still responding quickly to new messages. The cap at 5 seconds ensures messages are not delayed too long during truly idle periods.
