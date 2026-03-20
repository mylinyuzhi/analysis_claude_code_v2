# Inter-Agent Communication Protocol

## Overview

Agents in a team communicate exclusively through the `SendMessage` tool. This ensures that all interactions are tracked, throttled, and properly delivered to the correct agent's context. Direct text output from a teammate is *not* visible to others unless sent via this tool.

## v2.1.76 Improvements

- **No `activeForm` required**: Task creation and message routing no longer require the `activeForm` field; the schema is more permissive
- **Improved mailbox delivery**: More reliable delivery mechanisms with better error handling for edge cases
- **Cleaner message payloads**: Simplified required fields in message schema

## Message Types

The protocol supports several message types to handle different coordination needs:

| Type | Recipient | Purpose |
|------|-----------|---------|
| `message` | Specific agent | Direct communication / DM. |
| `broadcast` | All agents | Team-wide announcements (expensive, use sparingly). |
| `shutdown_request` | Teammate | Leader requesting an agent to exit. |
| `shutdown_response` | Leader | Agent approving or rejecting shutdown. |
| `plan_approval_response` | Teammate | Leader approving/rejecting an agent's plan. |

## Delivery Mechanism

### Automatic Delivery

Messages are delivered automatically to the target agent's conversation.
- If the agent is **idle**, the message "wakes" them up for a new turn.
- If the agent is **busy**, the message is queued in their `inbox` and delivered after the current turn ends.

### Internal vs. External Communication

- **External agents (tmux/iterm2)**: Use IPC or file-based signals to notify the other process of new messages.
- **In-process agents**: Use the `AppState` and shared memory to deliver messages directly to the task's message queue.

## Key Decisions & Algorithms

### [Decision] Asynchronous Message Queuing

**Why this approach**:
Agents may take several minutes to complete a tool-intensive turn. If messages were delivered synchronously, it would interrupt the agent's internal state machine. By queuing messages and delivering them as new "User" turns, the system maintains a clean request-response loop for each agent.

### [Algorithm] Shutdown Protocol

**How it works**:
1. Leader calls `SendMessage(type: "shutdown_request")`.
2. Teammate receives the request and must respond with `SendMessage(type: "shutdown_response")`.
3. If approved (`approve: true`):
   - For **in-process** agents: The `AbortController` for that agent's task is triggered (`chunks.141.mjs:1188`).
   - For **external** agents: The process exits with code 0 (`nK(0)`).
4. If rejected: Teammate provides a reason, and the leader is notified.

**Key insight**: Teammates have "agency" even in shutdown; they can reject a shutdown if they are in the middle of a critical task.

## Code Snippets

```javascript
// ============================================
// handleShutdownApproval - Processes a teammate's approval to exit
// Location: chunks.141.mjs:1159-1214
// ============================================

// ORIGINAL (for source lookup):
async function tSY(A, q) {
    let K = i3(), Y = ID(), z = g5() || "teammate", w = A.request_id;
    let H, $;
    if (K) {
        let _ = M51(K);
        if (_ && Y) {
            let J = _.members.find((X) => X.agentId === Y);
            if (J) H = J.tmuxPaneId, $ = J.backendType
        }
    }
    // ... logic to deliver message to lead ...
    if ($ === "in-process") {
        if (Y) {
            let _ = await q.getAppState(), J = ps(Y, _.tasks);
            if (J?.abortController) J.abortController.abort();
        }
    } else {
        setImmediate(async () => { await nK(0, "other") })
    }
    return { data: { success: !0, message: `Shutdown approved.`, request_id: w } }
}

// READABLE (for understanding):
async function handleShutdownApproval(input, context) {
    const teamName = getTeamName();
    const agentId = getAgentId();
    const agentName = getAgentName() || "teammate";
    const requestId = input.request_id;

    let backendType;
    if (teamName) {
        const config = getTeamConfig(teamName);
        const member = config?.members.find(m => m.agentId === agentId);
        backendType = member?.backendType;
    }

    // Deliver confirmation message to the lead agent
    deliverMessage(LEAD_AGENT_NAME, { from: agentName, ... });

    if (backendType === "in-process") {
        const state = await context.getAppState();
        const task = findTaskByAgentId(agentId, state.tasks);
        if (task?.abortController) {
            task.abortController.abort();
        }
    } else {
        // External process: exit gracefully
        setImmediate(async () => {
            await exitProcess(0, "other");
        });
    }
    return { data: { success: true, ... } };
}

// Mapping: tSY->handleShutdownApproval, A->input, q->context, K->teamName, Y->agentId, z->agentName, w->requestId, $->backendType, nK->exitProcess
```

## File Locking Deep Dive

### The Lost Update Problem

**Race condition scenario** (without locking):

```
Timeline:
T0: team-lead reads backend-dev.json -> sees [msg1, msg2]
T1: frontend-dev reads backend-dev.json -> sees [msg1, msg2]
T2: team-lead appends msg3 -> writes [msg1, msg2, msg3]
T3: frontend-dev appends msg4 -> writes [msg1, msg2, msg4]

Result: backend-dev.json contains [msg1, msg2, msg4]
        msg3 LOST!
```

**Why this happens**: Read-modify-write is not atomic. Between reading the file and writing back, another process can modify it.

### File Locking Solution

**Implementation** (obfuscated: `writeToMailbox` / f9):

```javascript
// ============================================
// writeToMailbox - Atomic message append with file locking
// Location: chunks.132.mjs:22-55
// ============================================

// ORIGINAL (for source lookup):
async function x3(A, q, K) {
    await OTY(K);
    let Y = FY6(A, K), z = `${Y}.lock`;
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
        let w = await wl(A, K), O = { ...q, read: !1 };
        w.push(O), await Pf6(Y, B6(w, null, 2), "utf-8"), k(`[TeammateMailbox] Wrote message to ${A}'s inbox from ${q.from}`)
    } catch (w) {
        k(`Failed to write to inbox for ${A}: ${w}`), _6(w)
    } finally {
        if (_) await _()
    }
}

// READABLE (for understanding):
async function writeToMailbox(recipientName, message, teamName) {
    // Ensure inbox directory exists
    await ensureInboxDirectoryExists(teamName);

    const mailboxPath = getInboxPath(recipientName, teamName);
    const lockPath = `${mailboxPath}.lock`;

    // Log the write operation for debugging
    console.log(`[TeammateMailbox] writeToMailbox: recipient=${recipientName}, from=${message.from}, path=${mailboxPath}`);

    // Create empty mailbox file if it doesn't exist
    try {
        await writeFile(mailboxPath, "[]", { encoding: "utf-8", flag: "wx" }); // wx = exclusive write
        console.log("[TeammateMailbox] writeToMailbox: created new inbox file");
    } catch (error) {
        if (error.code !== "EEXIST") {
            console.error(`[TeammateMailbox] writeToMailbox: failed to create inbox file: ${error}`);
            reportError(error);
            return;
        }
    }

    // Acquire file lock and append message atomically
    let releaseLock;
    try {
        // Lock with retry configuration (from iv1):
        // - retries: 10 attempts
        // - minTimeout: 5ms initial wait
        // - maxTimeout: 100ms max wait per retry
        releaseLock = await properLockfile.lock(mailboxPath, {
            lockfilePath: lockPath,
            retries: { retries: 10, minTimeout: 5, maxTimeout: 100 }
        });

        // Read existing messages
        let messages = await readMailbox(recipientName, teamName);

        // Append new message with read=false flag
        messages.push({ ...message, read: false });

        // Write back atomically
        await writeFile(mailboxPath, JSON.stringify(messages, null, 2), "utf-8");
        console.log(`[TeammateMailbox] Wrote message to ${recipientName}'s inbox from ${message.from}`);
    } catch (error) {
        console.error(`Failed to write to inbox for ${recipientName}: ${error}`);
        reportError(error);
    } finally {
        // Always release lock if acquired
        if (releaseLock) await releaseLock();
    }
}

// Mapping: x3→writeToMailbox, A→recipientName, q→message, K→teamName, Y→mailboxPath, z→lockPath,
//          Nc6→properLockfile, iv1→lockOptions, wl→readMailbox, Pf6→writeFile, B6→JSON.stringify,
//          OTY→ensureInboxDirectoryExists, FY6→getInboxPath
```

**With locking** (correct behavior):

```
Timeline:
T0: team-lead acquires lock on backend-dev.json.lock
T1: frontend-dev attempts lock -> BLOCKS (waits for team-lead to release)
T2: team-lead reads [msg1, msg2]
T3: team-lead appends msg3, writes [msg1, msg2, msg3]
T4: team-lead releases lock
T5: frontend-dev acquires lock (now available)
T6: frontend-dev reads [msg1, msg2, msg3]  <- sees msg3!
T7: frontend-dev appends msg4, writes [msg1, msg2, msg3, msg4]
T8: frontend-dev releases lock

Result: [msg1, msg2, msg3, msg4] - both messages preserved!
```

### Stale Lock Detection

**Problem**: Process crashes while holding lock, leaving `.lock` file orphaned.

**Solution**: `proper-lockfile` library detects stale locks via:

1. **Age check**: Lock file older than 60 seconds (stale timeout)
2. **PID check**: Read PID from lock file, check if process still running
3. **Auto-removal**: If process dead, remove stale lock file

**Lock file format**:
```
PID: 12345
Host: my-laptop.local
Timestamp: 2024-02-14T08:15:00.000Z
```

**Stale lock recovery**:
```
T0: Process with PID 12345 crashes while holding lock
T0+61s: Next writer attempts lock
  -> Lock file age = 61s (> 60s threshold)
  -> Check if PID 12345 running: No (process crashed)
  -> Remove stale lock file
  -> Acquire new lock
  -> Write proceeds normally
```

### Lock Contention Scenarios

**Scenario 1**: 2 agents write simultaneously

```
Agent A: Acquire lock -> write -> release (5ms total)
Agent B: Attempt lock -> blocks 5ms -> acquire -> write -> release
Total delay: 5ms (negligible)
```

**Scenario 2**: 6 agents write simultaneously (exceeds retry limit)

```
Agent A: Acquires lock
Agent B-F: All block, retry 5 times over ~2.5 seconds
Agent A: Still writing (slow disk)
Agent B-F: All 5 retries exhausted -> throw error "Could not acquire lock"

Recovery: Agents receive error, can retry SendMessage
```

**Why 5 retries**: Most contention resolves in 1-2 retries (lock held <5ms). After 5 retries (~2.5s total wait), likely indicates genuine deadlock or slow disk.

### Message Priority Handling

**In-process teammates** use dual-path delivery:

**Fast path** (Priority 1):
```javascript
// Direct injection to AppState (bypasses filesystem)
await context.updateAppState(state => {
    const task = state.tasks.find(t => t.agentName === recipientName);
    task.pendingUserMessages.push({
        from: senderName,
        content: messageContent
    });
});
// Delivery latency: 0-1ms (synchronous memory access)
```

**Slow path** (Priority 2-5):
```javascript
// Write to mailbox file
await writeToMailbox(recipientName, message, teamName);
// Delivery latency: 0-500ms (polling interval)
```

**Why dual-write**: Fast path provides instant delivery for in-process teammates. Slow path (mailbox) serves as:
1. **Persistence layer**: Survives process restart
2. **Fallback**: Works if in-process teammate offline
3. **Audit trail**: Debugging and inspection

For complete race condition analysis and edge cases, see [03_mailbox_and_locking.md](./03_mailbox_and_locking.md).

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:

- `SendMessageTool` (YhY) - Main tool implementation
- `writeToMailbox` (f9) - Low-level delivery with locking
- `readMailbox` (Ld) - Read all messages from mailbox
- `markMessageAsReadByIndex` (JQ1) - Update read flag
- `handleShutdownApproval` (tSY) - Shutdown logic

## Location References

- `chunks.141.mjs:843` - SendMessageTool prompt and documentation
- `chunks.141.mjs:1429` - Tool call dispatcher
- `chunks.141.mjs:1432` - handleDirectMessage (type: "message")
- `chunks.141.mjs:1434` - handleBroadcast (type: "broadcast")
- `chunks.141.mjs:1160` - handleShutdownApproval (type: "shutdown_response")
- `chunks.129.mjs:1107` - writeToMailbox (with file locking)
- `chunks.129.mjs:1089` - readMailbox
- `chunks.129.mjs:1130` - markMessageAsReadByIndex
