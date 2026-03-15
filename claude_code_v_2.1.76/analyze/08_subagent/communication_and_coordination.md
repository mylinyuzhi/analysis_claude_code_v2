# Communication and Coordination - Subagent System (Claude Code 2.1.76)

## Overview

This document covers the mailbox-based inter-agent communication system used by teammate agents, the priority poll loop, and the in-process agent runner.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `readMailbox` (Ld) - Read messages from mailbox - chunks.129.mjs:1089
- `writeToMailbox` (f9) - Write message to mailbox - chunks.129.mjs:1107
- `markMessageAsReadByIndex` (JQ1) - Mark message as read - chunks.129.mjs:1130
- `inProcessAgentRunner` (GVY) - Runner for in-process teammates - chunks.131.mjs:348
- `pollForNextMessage` (WVY) - Priority poll loop - chunks.131.mjs:260

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

### readMailbox (Ld)

**What it does:** Reads all messages from the mailbox file, returning unread messages.

**How it works:**
1. Read the mailbox JSONL file
2. Parse each line as a message record
3. Filter to messages where `readAt === null`
4. Return filtered messages sorted by index

```javascript
// ============================================
// readMailbox - Read messages from mailbox
// Location: chunks.129.mjs:1089
// ============================================

// READABLE (for understanding):
async function readMailbox(agentId) {
    let mailboxPath = getMailboxPath(agentId);
    try {
        let content = await fs.readFile(mailboxPath, "utf8");
        let messages = content.trim().split("\n")
            .filter(Boolean)
            .map(line => JSON.parse(line));
        return messages.filter(msg => msg.readAt === null);
    } catch (err) {
        if (err.code === "ENOENT") return [];
        throw err;
    }
}

// Mapping: Ld→readMailbox
```

### writeToMailbox (f9)

**What it does:** Appends a message to a target agent's mailbox file.

```javascript
// ============================================
// writeToMailbox - Write message to mailbox
// Location: chunks.129.mjs:1107
// ============================================

// READABLE (for understanding):
async function writeToMailbox(targetAgentId, message) {
    let mailboxPath = getMailboxPath(targetAgentId);
    let record = {
        index: await getNextMessageIndex(mailboxPath),
        from: getCurrentAgentId(),
        content: message,
        timestamp: Date.now(),
        readAt: null
    };
    await fs.appendFile(mailboxPath, JSON.stringify(record) + "\n");
}

// Mapping: f9→writeToMailbox
```

### markMessageAsReadByIndex (JQ1)

**What it does:** Updates the `readAt` timestamp for a specific message, marking it as processed.

**Why atomic update instead of in-place rewrite:**
- Append-only writes are safer (no risk of truncating the file on crash)
- The read status is stored as a separate update record appended to the file
- The reader merges records by index to determine final read status

---

## Priority Poll Loop (WVY)

### pollForNextMessage (WVY)

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
// pollForNextMessage - Priority poll loop
// Location: chunks.131.mjs:260
// ============================================

// READABLE (for understanding):
async function pollForNextMessage(agentId, mailbox, abortSignal) {
    let pollInterval = 100;  // Start at 100ms

    while (!abortSignal.aborted) {
        // Priority 1: Check abort
        if (abortSignal.aborted) break;

        // Priority 2: Check for user interrupt
        let messages = await readMailbox(agentId);
        let interrupt = messages.find(m => m.type === "interrupt");
        if (interrupt) {
            await markMessageAsReadByIndex(agentId, interrupt.index);
            return { type: "interrupt", message: interrupt };
        }

        // Priority 3: Check for orchestrator messages
        let orchestratorMessage = messages.find(m => m.from === "orchestrator");
        if (orchestratorMessage) {
            await markMessageAsReadByIndex(agentId, orchestratorMessage.index);
            return { type: "message", message: orchestratorMessage };
        }

        // Priority 4: Check own completion
        // (handled by caller)

        // Priority 5: Idle - exponential backoff
        await sleep(pollInterval);
        pollInterval = Math.min(pollInterval * 1.5, 5000);  // Cap at 5 seconds
    }
}

// Mapping: WVY→pollForNextMessage, Ld→readMailbox, JQ1→markMessageAsReadByIndex
```

---

## In-Process Agent Runner (GVY)

### inProcessAgentRunner (GVY)

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
// Location: chunks.131.mjs:348
// ============================================

// READABLE (for understanding):
async function inProcessAgentRunner(agentDefinition, toolUseContext, parentAgentId, teamName) {
    let agentId = generateAgentId();
    let mailbox = createMailbox(agentId);

    // Run agent loop and message polling concurrently
    let agentLoopPromise = (async () => {
        for await (let event of agentLoopRunner({ agentDefinition, toolUseContext, ... })) {
            // Forward progress to parent mailbox
            if (event.type === "assistant" && event.message) {
                await writeToMailbox(parentAgentId, {
                    type: "progress",
                    content: extractTextContent(event.message)
                });
            }
        }
    })();

    let messagePollingPromise = pollForNextMessage(agentId, mailbox, toolUseContext.abortSignal);

    // Wait for first to complete
    await Promise.race([agentLoopPromise, messagePollingPromise]);

    await writeToMailbox(parentAgentId, { type: "completed", agentId });
}

// Mapping: GVY→inProcessAgentRunner
```

### Shared appState Optimization

For in-process teammates, the parent and teammate share the same `appState` object. This avoids serialization overhead for reading shared state.

**What is shared:** `getAppState`, `setAppState` - both agents operate on the same global state object.

**What is NOT shared:** `readFileState` - each agent tracks its own file reads independently. This is cloned via `new Map(parentContext.readFileState)`.

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
