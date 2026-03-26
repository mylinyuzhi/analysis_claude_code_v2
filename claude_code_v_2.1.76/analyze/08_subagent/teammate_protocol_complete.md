# Teammate Protocol Complete Source Restoration (Claude Code 2.1.76)

> Complete source-level analysis of the teammate communication protocol, mailbox system, and coordination mechanisms.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `readMailbox` (wl) - Read messages from mailbox — `chunks.132.mjs:3`
- `readUnreadMessages` (pY6) - Read only unread messages — `chunks.132.mjs:16`
- `writeToMailbox` (x3) - Write message to mailbox — `chunks.132.mjs:22`
- `markMessageAsReadByIndex` (Vc6) - Mark single message as read — `chunks.132.mjs:57`
- `markMessagesAsRead` (kc6) - Mark all messages as read — `chunks.132.mjs:92`
- `clearMailbox` ($TY) - Clear all messages — `chunks.132.mjs:128`
- `formatMailboxMessages` (HTY) - Format messages as XML — `chunks.132.mjs:141`
- `buildIdleNotification` (Ec6) - Build idle notification message — `chunks.132.mjs:153`
- `parseIdleNotification` (yc6) - Parse idle notification — `chunks.132.mjs:166`
- `claimUnclaimedTask` (Ji4) - Claim unclaimed task for teammate — `chunks.134.mjs:1464`
- `pollForNextMessage` (DNY) - Priority poll loop for teammate messages — `chunks.134.mjs:1483`
- `inProcessAgentRunner` (XNY) - Runner for in-process teammates — `chunks.134.mjs:1571`

---

## Overview

The teammate protocol is the communication backbone for multi-agent collaboration in Claude Code. It enables:

1. **Mailbox-based messaging** - File-based message queues for async communication
2. **Task claiming** - Teammates can claim tasks from a shared task list
3. **Priority message handling** - Shutdown requests take precedence over regular messages
4. **Idle notifications** - Teammates notify when ready for new work

---

## Mailbox System

### Directory Layout

```
~/.claude/teams/
└── {teamName}/
    └── inboxes/
        ├── team-lead.json      # Team lead's inbox
        ├── agent-alice.json    # Alice's inbox
        └── agent-bob.json      # Bob's inbox
```

### readMailbox (wl)

**What it does:** Reads all messages from a teammate's mailbox.

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
    let inboxPath = getInboxPath(agentName, teamName);
    logger.debug(`[TeammateMailbox] readMailbox: path=${inboxPath}`);

    try {
        let content = await fs.readFile(inboxPath, "utf-8");
        let messages = JSON.parse(content);
        logger.debug(`[TeammateMailbox] readMailbox: read ${messages.length} message(s)`);
        return messages;
    } catch (error) {
        if (error.code === "ENOENT") {
            logger.debug("[TeammateMailbox] readMailbox: file does not exist");
            return [];
        }
        logger.error(`Failed to read inbox for ${agentName}: ${error}`);
        return [];
    }
}

// Mapping: wl→readMailbox, A→agentName, q→teamName, K→inboxPath,
//          FY6→getInboxPath, xd4→fs.readFile, i1→JSON.parse, k→logger.debug
```

### readUnreadMessages (pY6)

```javascript
// ============================================
// readUnreadMessages - Read only unread messages
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

    logger.debug(`[TeammateMailbox] readUnreadMessages: ${unreadMessages.length} unread of ${allMessages.length} total`);
    return unreadMessages;
}

// Mapping: pY6→readUnreadMessages, A→agentName, q→teamName, K→allMessages, Y→unreadMessages
```

### writeToMailbox (x3)

**What it does:** Writes a message to a teammate's mailbox with file locking.

**How it works:**
1. Ensure inbox directory exists
2. Create inbox file if it doesn't exist
3. Acquire file lock
4. Read current messages
5. Append new message with `read: false`
6. Write back to file
7. Release lock

```javascript
// ============================================
// writeToMailbox - Write message to mailbox
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
    // Step 1: Ensure inbox directory exists
    await ensureInboxDirectoryExists(teamName);

    let inboxPath = getInboxPath(recipientName, teamName);
    let lockPath = `${inboxPath}.lock`;

    logger.debug(`[TeammateMailbox] writeToMailbox: recipient=${recipientName}, from=${message.from}, path=${inboxPath}`);

    // Step 2: Create inbox file if it doesn't exist (atomic create-with-exclusivity)
    try {
        await fs.writeFile(inboxPath, "[]", {
            encoding: "utf-8",
            flag: "wx"  // Write-exclusive: fails if file exists
        });
        logger.debug("[TeammateMailbox] writeToMailbox: created new inbox file");
    } catch (error) {
        if (error.code !== "EEXIST") {
            logger.error(`[TeammateMailbox] writeToMailbox: failed to create inbox file: ${error}`);
            return;
        }
        // File exists - that's fine, we'll read it
    }

    let releaseLock;
    try {
        // Step 3: Acquire file lock
        releaseLock = await properLockfile.lock(inboxPath, {
            lockfilePath: lockPath,
            retries: 10,
            minTimeout: 5,
            maxTimeout: 100
        });

        // Step 4: Read current messages
        let currentMessages = await readMailbox(recipientName, teamName);

        // Step 5: Append new message with read: false
        let newMessage = {
            ...message,
            read: false
        };
        currentMessages.push(newMessage);

        // Step 6: Write back to file
        await fs.writeFile(inboxPath, JSON.stringify(currentMessages, null, 2), "utf-8");

        logger.debug(`[TeammateMailbox] Wrote message to ${recipientName}'s inbox from ${message.from}`);
    } catch (error) {
        logger.error(`Failed to write to inbox for ${recipientName}: ${error}`);
    } finally {
        // Step 7: Release lock
        if (releaseLock) {
            await releaseLock();
        }
    }
}

// Mapping: x3→writeToMailbox, A→recipientName, q→message, K→teamName,
//          OTY→ensureInboxDirectoryExists, FY6→getInboxPath, Pf6→fs.writeFile,
//          Nc6→properLockfile, iv1→lockOptions, wl→readMailbox, B6→JSON.stringify
```

**Why file locking?**
- Prevents race conditions when multiple agents write simultaneously
- Ensures read-modify-write is atomic
- Uses proper-lockfile library with retry logic

### markMessageAsReadByIndex (Vc6)

**What it does:** Marks a specific message as read by its index.

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
async function markMessageAsReadByIndex(agentName, teamName, messageIndex) {
    let inboxPath = getInboxPath(agentName, teamName);
    let lockPath = `${inboxPath}.lock`;

    let releaseLock;
    try {
        // Acquire lock
        releaseLock = await properLockfile.lock(inboxPath, {
            lockfilePath: lockPath,
            retries: 10,
            minTimeout: 5,
            maxTimeout: 100
        });

        // Read messages
        let messages = await readMailbox(agentName, teamName);

        // Validate index
        if (messageIndex < 0 || messageIndex >= messages.length) {
            return; // Out of bounds
        }

        let message = messages[messageIndex];
        if (!message || message.read) {
            return; // Already read or missing
        }

        // Mark as read
        messages[messageIndex] = {
            ...message,
            read: true
        };

        // Write back
        await fs.writeFile(inboxPath, JSON.stringify(messages, null, 2), "utf-8");
    } catch (error) {
        if (error.code === "ENOENT") {
            return; // File doesn't exist
        }
        logger.error(`[TeammateMailbox] markMessageAsReadByIndex FAILED for ${agentName}: ${error}`);
    } finally {
        if (releaseLock) {
            await releaseLock();
        }
    }
}

// Mapping: Vc6→markMessageAsReadByIndex, A→agentName, q→teamName, K→messageIndex
```

### formatMailboxMessages (HTY)

**What it does:** Formats messages as XML for inclusion in system reminders.

```javascript
// ============================================
// formatMailboxMessages - Format messages as XML
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

// Mapping: HTY→formatMailboxMessages, A→messages, q→msg, K→colorAttr, Y→summaryAttr, fj→TEAMMATE_MESSAGE_TAG
```

**Output Example:**
```xml
<teammate_message teammate_id="alice" color="blue" summary="Task update">
I've completed the file search and found 5 matches.
</teammate_message>

<teammate_message teammate_id="bob" summary="Question">
Should I proceed with the refactoring?
</teammate_message>
```

---

## Idle Notification Protocol

### buildIdleNotification (Ec6)

**What it does:** Creates an idle notification message when a teammate is ready for new work.

```javascript
// ============================================
// buildIdleNotification - Build idle notification message
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
function buildIdleNotification(agentName, details) {
    return {
        type: "idle_notification",
        from: agentName,
        timestamp: new Date().toISOString(),
        idleReason: details?.idleReason,       // "available", "interrupted", "failed"
        summary: details?.summary,              // What was just completed
        completedTaskId: details?.completedTaskId,
        completedStatus: details?.completedStatus,
        failureReason: details?.failureReason
    };
}

// Mapping: Ec6→buildIdleNotification, A→agentName, q→details
```

### parseIdleNotification (yc6)

```javascript
// ============================================
// parseIdleNotification - Parse idle notification
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
    } catch {}
    return null;
}

// Mapping: yc6→parseIdleNotification, A→messageText, q→parsed
```

---

## Permission Request Protocol

### buildPermissionRequest (Xx8)

**What it does:** Creates a permission request message when a teammate needs approval.

```javascript
// ============================================
// buildPermissionRequest - Build permission request message
// Location: chunks.132.mjs:174-185
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

```javascript
// ============================================
// buildPermissionResponse - Build permission response message
// Location: chunks.132.mjs:187-200
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

---

## Task Claiming

### claimUnclaimedTask (Ji4)

**What it does:** Claims an unclaimed task from the task list for a teammate.

**How it works:**
1. Load all tasks from the task system
2. Find the next available (unclaimed) task
3. Claim the task for this agent
4. Update task status to "in_progress"
5. Return the task prompt

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
        // Step 1: Load all tasks
        let tasks = await loadAllTasks(sessionId);

        // Step 2: Find next available task
        let nextTask = findNextAvailableTask(tasks);
        if (!nextTask) return;

        // Step 3: Claim the task
        let claimResult = await claimTask(sessionId, nextTask.id, agentName);
        if (!claimResult.success) {
            logger.debug(`[inProcessRunner] Failed to claim task #${nextTask.id}: ${claimResult.reason}`);
            return;
        }

        // Step 4: Update status to in_progress
        await updateTask(sessionId, nextTask.id, {
            status: "in_progress"
        });

        logger.debug(`[inProcessRunner] Claimed task #${nextTask.id}: ${nextTask.subject}`);

        // Step 5: Return formatted prompt
        return generatePromptFromTask(nextTask);
    } catch (error) {
        logger.debug(`[inProcessRunner] Error checking task list: ${error}`);
        return;
    }
}

// Mapping: Ji4→claimUnclaimedTask, A→sessionId, q→agentName,
//          DX→loadAllTasks, JNY→findNextAvailableTask, OT8→claimTask,
//          WI→updateTask, MNY→generatePromptFromTask
```

---

## Message Polling

### pollForNextMessage (DNY)

**What it does:** Priority-based poll loop for receiving teammate messages.

**Priority Order:**
1. Pending user messages (injected by lead agent)
2. Shutdown requests (highest priority from mailbox)
3. Team lead messages
4. Other teammate messages
5. Unclaimed tasks from task list

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
        // Check pending user messages first
        let H = Y().tasks[K];
        if (H && H.type === "in_process_teammate" && H.pendingUserMessages.length > 0) {
            let J = H.pendingUserMessages[0];
            return z((M) => {
                // Remove first pending message
                // ...
            }), {
                type: "new_message",
                message: J,
                from: "user"
            }
        }

        if (O > 0) await jNY(500);

        if (O++, q.signal.aborted) return {
            type: "aborted"
        };

        // Check mailbox
        try {
            let J = await wl(A.agentName, A.teamName),
                M = -1,
                D = null;

            // Priority 1: Shutdown requests
            for (let P = 0; P < J.length; P++) {
                let W = J[P];
                if (W && !W.read) {
                    let Z = M66(W.text);  // Parse shutdown request
                    if (Z) {
                        M = P, D = Z;
                        break
                    }
                }
            }
            if (M !== -1) {
                return await Vc6(A.agentName, A.teamName, M), {
                    type: "shutdown_request",
                    request: D,
                    originalMessage: J[M].text
                }
            }

            // Priority 2: Team lead messages
            let X = -1;
            for (let P = 0; P < J.length; P++) {
                let W = J[P];
                if (W && !W.read && W.from === BY) {  // BY = "team-lead"
                    X = P;
                    break
                }
            }

            // Priority 3: Other teammate messages
            if (X === -1) X = J.findIndex((P) => !P.read);

            if (X !== -1) {
                let P = J[X];
                if (P) return await Vc6(A.agentName, A.teamName, X), {
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

        // Priority 4: Unclaimed tasks
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
async function pollForNextMessage(identity, abortController, taskId, getAppState, setAppState, sessionId) {
    let pollCount = 0;

    while (!abortController.signal.aborted) {
        // Check pending user messages first (highest priority)
        let task = getAppState().tasks[taskId];
        if (task?.type === "in_process_teammate" && task.pendingUserMessages.length > 0) {
            let message = task.pendingUserMessages[0];

            // Remove from pending list
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

            return {
                type: "new_message",
                message: message,
                from: "user"
            };
        }

        // Delay between polls (not on first iteration)
        if (pollCount > 0) {
            await sleep(500);
        }

        pollCount++;

        // Check if aborted during sleep
        if (abortController.signal.aborted) {
            return { type: "aborted" };
        }

        // Check mailbox
        try {
            let messages = await readMailbox(identity.agentName, identity.teamName);

            // Priority 1: Shutdown requests
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
                await markMessageAsReadByIndex(identity.agentName, identity.teamName, shutdownIndex);
                return {
                    type: "shutdown_request",
                    request: shutdownRequest,
                    originalMessage: messages[shutdownIndex].text
                };
            }

            // Priority 2: Team lead messages
            let leadIndex = -1;
            for (let i = 0; i < messages.length; i++) {
                let msg = messages[i];
                if (msg && !msg.read && msg.from === TEAM_LEAD_ID) {
                    leadIndex = i;
                    break;
                }
            }

            // Priority 3: Other teammate messages
            if (leadIndex === -1) {
                leadIndex = messages.findIndex((msg) => !msg.read);
            }

            if (leadIndex !== -1) {
                let msg = messages[leadIndex];
                await markMessageAsReadByIndex(identity.agentName, identity.teamName, leadIndex);
                return {
                    type: "new_message",
                    message: msg.text,
                    from: msg.from,
                    color: msg.color,
                    summary: msg.summary
                };
            }
        } catch (error) {
            logger.debug(`[inProcessRunner] ${identity.agentName} poll error: ${error}`);
        }

        // Priority 4: Check for unclaimed tasks
        let taskPrompt = await claimUnclaimedTask(sessionId, identity.agentName);
        if (taskPrompt) {
            return {
                type: "new_message",
                message: taskPrompt,
                from: "task-list"
            };
        }
    }

    return { type: "aborted" };
}

// Mapping: DNY→pollForNextMessage, A→identity, q→abortController, K→taskId,
//          Y→getAppState, z→setAppState, _→sessionId, jNY→sleep, wl→readMailbox,
//          M66→parseShutdownRequest, Vc6→markMessageAsReadByIndex, BY→TEAM_LEAD_ID,
//          Ji4→claimUnclaimedTask
```

---

## In-Process Agent Runner

### inProcessAgentRunner (XNY)

**What it does:** Main execution loop for in-process teammates.

**How it works:**
1. Set up agent context with team information
2. Build system prompt (replace or append mode)
3. Create agent definition for teammate
4. Poll for messages in a loop
5. Execute agent loop for each message
6. Handle compaction when needed
7. Send idle notifications when done

```javascript
// ============================================
// inProcessAgentRunner - Runner for in-process teammates
// Location: chunks.134.mjs:1571-1659 (excerpt)
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

    let P = {
            agentId: q.agentId,
            parentSessionId: q.parentSessionId,
            agentName: q.agentName,
            teamName: q.teamName,
            agentColor: q.color,
            planModeRequired: q.planModeRequired,
            isTeamLead: !1,
            agentType: "teammate"
        },
        W;

    // Build system prompt
    if (J === "replace" && j) W = j;
    else {
        let L = [...await R0(O.options.tools, O.options.mainLoopModel, void 0, O.options.mcpClients), tx8];
        if (_) {
            let h = _.getSystemPrompt();
            if (h) L.push(`
# Custom Agent Instructions
${h}`);
        }
        if (J === "append" && j) L.push(j);
        W = L.join(`
`)
    }

    // Create agent definition
    let Z = {
            agentType: q.agentName,
            whenToUse: `In-process teammate: ${q.agentName}`,
            getSystemPrompt: () => W,
            tools: _?.tools ? [...new Set([..._.tools, SendMessageTool, ReadTool, TaskListTool, TaskCreateTool, TaskGetTool, TaskUpdateTool])] : ["*"],
            source: "projectSettings",
            permissionMode: "default",
            ..._?.model ? { model: _.model } : {}
        },
        G = [],  // Conversation history
        f = Ku8("team-lead", Y, void 0, z),  // Initial prompt
        v = f,
        N = !1;

    await Ji4(q.parentSessionId, q.agentName);

    try {
        // Add initial message to task
        atomicUpdateTask(K, (state) => ({
            ...state,
            messages: [...state.messages ?? [], createUserMessage({ content: f })]
        }), X);

        while (!$.signal.aborted && !N) {
            // Process current prompt
            // ... execute agent loop ...

            // Poll for next message
            let result = await pollForNextMessage(q, $, K, O.getAppState, X, q.parentSessionId);

            if (result.type === "aborted") {
                N = true;
                break;
            }

            if (result.type === "shutdown_request") {
                // Handle shutdown request
                // ...
            }

            if (result.type === "new_message") {
                v = result.message;
                // Continue loop
            }
        }
    } finally {
        // Cleanup
    }
}

// READABLE (for understanding):
async function inProcessAgentRunner(config) {
    let {
        identity,
        taskId,
        prompt,
        description,
        agentDefinition,
        teammateContext,
        toolUseContext,
        abortController,
        model,
        systemPrompt,
        systemPromptMode,
        allowedTools,
        allowPermissionPrompts
    } = config;

    let { setAppState } = toolUseContext;

    // Step 1: Set up teammate context
    let teammateInfo = {
        agentId: identity.agentId,
        parentSessionId: identity.parentSessionId,
        agentName: identity.agentName,
        teamName: identity.teamName,
        agentColor: identity.color,
        planModeRequired: identity.planModeRequired,
        isTeamLead: false,
        agentType: "teammate"
    };

    // Step 2: Build system prompt
    let finalSystemPrompt;
    if (systemPromptMode === "replace" && systemPrompt) {
        finalSystemPrompt = systemPrompt;
    } else {
        let promptSections = [
            ...await buildDefaultSystemPrompt(toolUseContext.options.tools, toolUseContext.options.mainLoopModel),
            TEAMMATE_SYSTEM_PROMPT
        ];

        if (agentDefinition?.getSystemPrompt()) {
            promptSections.push(`
# Custom Agent Instructions
${agentDefinition.getSystemPrompt()}`);
        }

        if (systemPromptMode === "append" && systemPrompt) {
            promptSections.push(systemPrompt);
        }

        finalSystemPrompt = promptSections.join("\n");
    }

    // Step 3: Create agent definition
    let teammateAgentDefinition = {
        agentType: identity.agentName,
        whenToUse: `In-process teammate: ${identity.agentName}`,
        getSystemPrompt: () => finalSystemPrompt,
        tools: agentDefinition?.tools
            ? [...new Set([...agentDefinition.tools, SendMessageTool, ReadTool, TaskListTool, TaskCreateTool, TaskGetTool, TaskUpdateTool])]
            : ["*"],
        source: "projectSettings",
        permissionMode: "default",
        ...(agentDefinition?.model && { model: agentDefinition.model })
    };

    // Step 4: Initialize conversation
    let conversationHistory = [];
    let currentPrompt = buildUserPrompt("team-lead", prompt, undefined, description);

    // Step 5: Try to claim an unclaimed task
    await claimUnclaimedTask(identity.parentSessionId, identity.agentName);

    try {
        // Add initial message to task
        atomicUpdateTask(taskId, (state) => ({
            ...state,
            messages: [...(state.messages ?? []), createUserMessage({ content: currentPrompt })]
        }), setAppState);

        // Step 6: Main execution loop
        while (!abortController.signal.aborted) {
            // Execute agent loop for current prompt
            // ... (agent loop execution) ...

            // Step 7: Poll for next message
            let result = await pollForNextMessage(
                identity,
                abortController,
                taskId,
                toolUseContext.getAppState,
                setAppState,
                identity.parentSessionId
            );

            if (result.type === "aborted") {
                break;
            }

            if (result.type === "shutdown_request") {
                // Handle shutdown request
                // ...
                break;
            }

            if (result.type === "new_message") {
                currentPrompt = result.message;
                // Continue loop with new message
            }
        }
    } finally {
        // Step 8: Send idle notification
        await writeToMailbox(
            TEAM_LEAD_ID,
            buildIdleNotification(identity.agentName, {
                idleReason: "available",
                summary: "Completed task"
            }),
            identity.teamName
        );
    }
}

// Mapping: XNY→inProcessAgentRunner, q→identity, K→taskId, Y→prompt, z→description,
//          _→agentDefinition, w→teammateContext, O→toolUseContext, $→abortController,
//          H→model, j→systemPrompt, J→systemPromptMode, M→allowedTools, D→allowPermissionPrompts
```

---

## Message Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Teammate Message Flow                                 │
└─────────────────────────────────────────────────────────────────────────────┘

  Team Lead                         Mailbox                        Teammate
  ─────────                         ────────                       ─────────

       ┌──────────────────┐
       │ Spawn Teammate   │
       │ (pNY/qn4)        │
       └────────┬─────────┘
                │
                ▼
       ┌──────────────────┐         ┌──────────────┐
       │ Initialize       │────────►│ Create inbox │
       │ inProcessRunner  │         │ file         │
       └──────────────────┘         └──────────────┘

                                        ┌──────────────┐
       ┌──────────────────┐            │              │
       │ Send task        │───────────►│  Inbox:      │
       │ (writeToMailbox) │            │  - msg1      │◄───┐
       └──────────────────┘            │  - msg2      │    │
                                       │              │    │
                                        └──────────────┘    │
                                                            │
                                        ┌──────────────┐    │
       ┌──────────────────┐            │              │    │
       │ Poll for         │◄───────────│  Read unread │    │
       │ messages (DNY)   │            │  messages    │────┘
       └────────┬─────────┘            └──────────────┘
                │
                ▼
       ┌──────────────────┐
       │ Process message  │
       │ (agentLoopRunner)│
       └────────┬─────────┘
                │
                ▼
       ┌──────────────────┐         ┌──────────────┐
       │ Send idle        │────────►│ Write to     │
       │ notification     │         │ lead's inbox │
       │ (Ec6/x3)         │         │              │
       └──────────────────┘         └──────────────┘
```

---

## Cross-Feature Integration

### System Reminder Integration
- Mailbox messages formatted as XML attachments
- Idle notifications appear as system reminders
- Task status updates trigger attachments

### Tools Integration
- `SendMessageTool` uses writeToMailbox
- Task tools (TaskCreate, TaskUpdate) available to teammates
- Read tool for file access

### Hooks Integration
- Teammate context propagated through AsyncLocalStorage
- Hooks can access team information

### Compact Integration
- Conversation history compacted when token limit reached
- Teammate context preserved during compaction