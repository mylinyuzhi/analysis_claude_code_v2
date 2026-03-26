# Key Algorithms Deep Dive V7 (Claude Code 2.1.76)

> Deep analysis of critical algorithms in the subagent and background agent systems including task ID generation, tool filtering, abort signal propagation, mid-run backgrounding, and mailbox communication.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified.md](./cross_validation_unified.md) - Unified symbol verification

---

## Algorithm 1: Task ID Generation

### Task ID Generation Algorithm (oV)

**What it does:** Generates a unique 8-character task ID with a type prefix for collision-free identification.

**How it works:**

```
Step 1: Get task type prefix (e.g., "a" for agent)
Step 2: Generate 8 cryptographically random bytes
Step 3: Map each byte to a character from charset
Step 4: Concatenate prefix + suffix
```

**Source Code:**

```javascript
// ============================================
// oV - generateTaskId - Generate unique task ID
// Location: chunks.41.mjs:2410-2416
// ============================================

// ORIGINAL (for source lookup):
function oV(A) {
    let q = k$3(A),
        K = V$3[q] ?? "x",
        Y = VvY(8);
    return `${K}${Y.map((z) => G97[z % G97.length]).join("")}`
}

// READABLE (for understanding):
function generateTaskId(taskType) {
    // Step 1: Get type prefix
    let typeName = getTaskTypePrefix(taskType);
    let prefix = TASK_TYPE_PREFIXES[typeName] ?? "x";

    // Step 2: Generate 8 random bytes using crypto
    let randomBytes = crypto.getRandomValues(new Uint8Array(8));

    // Step 3: Convert bytes to characters
    // charset = "0123456789abcdefghijklmnopqrstuvwxyz"
    let suffix = randomBytes.map(byte =>
        TASK_ID_CHARSET[byte % TASK_ID_CHARSET.length]
    ).join("");

    // Step 4: Return prefix + suffix (9 chars total)
    return `${prefix}${suffix}`;
}
```

**Why this approach:**

| Design Choice | Rationale |
|---------------|-----------|
| Type prefix | Visual identification of task type |
| 8 random chars | 36^8 = ~2.8 trillion combinations, collision improbable |
| Crypto random | Unpredictable, cannot be guessed |
| Modulo mapping | Efficient charset conversion |

**Key insight:** The type prefix serves as a visual debugging aid - `a7x9k2m3` is immediately recognizable as an agent task, `b8p1n4q5` as a bash task.

---

## Algorithm 2: Tool Filtering for Subagents

### Tool Filtering Algorithm (Xk8)

**What it does:** Determines which tools a subagent can access based on agent type, execution mode, and permission context.

**How it works:**

```
Step 1: Allow all MCP tools (mcp__*)
Step 2: Check ExitPlanMode exception for plan mode
Step 3: Block tools in BACKGROUND_AGENT_EXCLUDED_TOOLS
Step 4: Block built-in excluded tools for non-built-in agents
Step 5: If async mode, only allow ASYNC_AGENT_ALLOWED_TOOLS
Step 6: Exception: Teammates get Agent + TEAM_DELEGATE_TOOLS
```

**Source Code:**

```javascript
// ============================================
// Xk8 - filterToolsForSubagent
// Location: chunks.93.mjs:1568-1588
// ============================================

function filterToolsForSubagent({
    tools,
    isBuiltIn,
    isAsync = false,
    permissionMode
}) {
    return tools.filter((tool) => {
        // Rule 1: MCP tools always allowed
        if (tool.name.startsWith("mcp__")) return true;

        // Rule 2: ExitPlanMode in plan mode
        if (isToolNamed(tool, "ExitPlanMode") && permissionMode === "plan") {
            return true;
        }

        // Rule 3: Never allow these in background
        if (BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)) {
            return false;
        }

        // Rule 4: Block built-in exclusions for custom agents
        if (!isBuiltIn && BUILTIN_EXCLUDED_TOOLS.has(tool.name)) {
            return false;
        }

        // Rule 5: Async mode whitelist
        if (isAsync && !ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name)) {
            // Rule 6: Teammate exception
            if (isAgentTeamsEnabled() && isInProcessTeammate()) {
                if (isToolNamed(tool, "Agent")) return true;
                if (TEAM_DELEGATE_TOOLS.has(tool.name)) return true;
            }
            return false;
        }

        return true;
    });
}
```

**Why these rules:**

| Tool | Blocked For | Reason |
|------|-------------|--------|
| `TaskOutput` | Background | Could create polling loops, waste tokens |
| `ExitPlanMode` | Background | Requires user approval flow |
| `EnterPlanMode` | Background | Requires user approval flow |
| `Agent` | Background | Could spawn nested background agents |
| `AskUserQuestion` | Background | Would block indefinitely |
| `TaskStop` | Background | Background shouldn't manage other tasks |

**Key insight:** The filtering prevents background agents from doing anything that would block or require user interaction, while allowing teammates special delegation capabilities.

---

## Algorithm 3: Abort Signal Propagation

### Abort Signal Propagation (x66)

**What it does:** Gracefully terminates a running task with proper cleanup and partial result preservation.

**How it works:**

```
Step 1: Check if task is running
Step 2: Abort the AbortController (cancels LLM stream)
Step 3: Unregister cleanup handler (prevent double cleanup)
Step 4: Set status to "killed"
Step 5: Keep last message (for debugging)
Step 6: Clear sensitive references
Step 7: Flush output buffer (preserve partial results)
```

**Source Code:**

```javascript
// ============================================
// x66 - triggerAbortSignal
// Location: chunks.146.mjs:2012-2027
// ============================================

function triggerAbortSignal(taskId, setAppState) {
    let wasAborted = false;

    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only abort running tasks
        if (task.status !== "running") return task;

        wasAborted = true;

        // Step 1: Abort the controller
        // This propagates to LLM API and any child operations
        task.abortController?.abort();

        // Step 2: Unregister cleanup handler
        // Prevents cleanup on process exit from double-handling
        task.unregisterCleanup?.();

        // Step 3: Return killed state
        return {
            ...task,
            status: "killed",
            endTime: Date.now(),

            // Keep last message for debugging
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,

            // Clear sensitive references
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Step 4: Flush output buffer if aborted
    // This preserves any partial results written so far
    if (wasAborted) {
        flushOutputBuffer(taskId);
    }

    return wasAborted;
}
```

**Why flush output buffer:**

1. **Partial results preserved**: User can see what was accomplished before kill
2. **Debugging aid**: Helps understand what the agent was doing
3. **Transparency**: No silent loss of work
4. **Resume potential**: Could potentially resume from where it stopped

**Key insight:** The atomic update ensures no race conditions - the status change and cleanup happen together or not at all.

---

## Algorithm 4: Mid-Run Backgrounding

### Mid-Run Backgrounding Mechanism

**What it does:** Allows a foreground task to transition to background execution mid-run using Promise.race.

**How it works:**

```
Step 1: Create background promise + resolver on task creation
Step 2: Store resolver in backgroundSignalMap
Step 3: Execute with Promise.race([execution, backgroundPromise])
Step 4: If user requests background, resolve the promise
Step 5: The race resolves, execution continues in background
```

**Source Code:**

```javascript
// ============================================
// Mid-Run Backgrounding Flow
// ============================================

// In createForegroundAgentTask (Un4):
function createForegroundAgentTask(params) {
    // ... task setup ...

    // Create backgrounding signal
    let backgroundResolver;
    let backgroundPromise = new Promise((resolve) => {
        backgroundResolver = resolve;
    });

    // Store for later access
    backgroundSignalMap.set(agentId, backgroundResolver);

    // Return task with backgrounding capability
    return { task, backgroundPromise, backgroundResolver };
}

// In execution:
async function executeWithBackgrounding(task, backgroundPromise) {
    let result = await Promise.race([
        // Normal execution path
        runAgentLoop(task).then(r => ({ ...r, backgrounded: false })),

        // Backgrounding signal path
        backgroundPromise.then(() => ({ backgrounded: true }))
    ]);

    if (result.backgrounded) {
        // Transition to background
        task.isBackgrounded = true;

        // Continue execution without blocking
        runAgentLoop(task).then(handleCompletion);

        // Return immediately to caller
        return { status: "async_launched", agentId: task.agentId };
    }

    return { status: "completed", result };
}

// When user requests backgrounding:
function backgroundTask(agentId) {
    let resolver = backgroundSignalMap.get(agentId);
    if (resolver) {
        resolver();  // Trigger the race
        backgroundSignalMap.delete(agentId);
    }
}
```

**Why Promise.race:**

| Approach | Pros | Cons |
|----------|------|------|
| Promise.race | Clean, non-blocking, instant transition | Requires careful state management |
| setTimeout | Simple | Could delay transition |
| Event emitter | Flexible | More complex, harder to track |
| Shared flag | Simple | Requires polling |

**Key insight:** Promise.race provides instant, non-blocking transition - as soon as the user requests backgrounding, the main thread is freed while execution continues in the background.

---

## Algorithm 5: Mailbox Communication

### Mailbox Read/Write Protocol

**What it does:** Provides file-based message passing between teammates with proper locking to prevent race conditions.

**How it works:**

```
Read:
Step 1: Get inbox path
Step 2: Read JSON file
Step 3: Parse messages
Step 4: Return array

Write:
Step 1: Get inbox path
Step 2: Create file if not exists
Step 3: Acquire lock
Step 4: Read current messages
Step 5: Append new message
Step 6: Write back
Step 7: Release lock
```

**Source Code:**

```javascript
// ============================================
// wl - readMailbox
// Location: chunks.132.mjs:3-14
// ============================================

async function readMailbox(agentName, teamName) {
    let inboxPath = getInboxPath(agentName, teamName);

    try {
        let content = await fs.readFile(inboxPath, "utf-8");
        let messages = JSON.parse(content);
        return messages;
    } catch (error) {
        if (error.code === "ENOENT") {
            return [];  // No inbox yet
        }
        logError(error);
        return [];
    }
}

// ============================================
// x3 - writeToMailbox
// Location: chunks.132.mjs:22-55
// ============================================

async function writeToMailbox(recipient, message, teamName) {
    await ensureInboxDirectoryExists(teamName);

    let inboxPath = getInboxPath(recipient, teamName);
    let lockPath = `${inboxPath}.lock`;

    // Create inbox file if doesn't exist
    try {
        await fs.writeFile(inboxPath, "[]", { flag: "wx" });
    } catch (error) {
        if (error.code !== "EEXIST") {
            logError(error);
            return;
        }
    }

    // Acquire lock and write
    let releaseLock;
    try {
        releaseLock = await properLockfile.lock(inboxPath, {
            lockfilePath: lockPath,
            retries: 10,
            minTimeout: 5,
            maxTimeout: 100
        });

        // Read current messages
        let messages = await readMailbox(recipient, teamName);

        // Append new message with read flag
        messages.push({
            ...message,
            read: false
        });

        // Write back
        await fs.writeFile(inboxPath, JSON.stringify(messages, null, 2), "utf-8");

    } catch (error) {
        logError(error);
    } finally {
        if (releaseLock) await releaseLock();
    }
}
```

**Why file locking:**

| Without Locking | With Locking |
|-----------------|--------------|
| Race conditions | Sequential access |
| Lost messages | All messages preserved |
| Corrupted JSON | Valid JSON always |
| Unpredictable | Deterministic |

**Key insight:** The lock configuration (retries: 10, minTimeout: 5ms, maxTimeout: 100ms) balances responsiveness with reliability - quick for normal cases, patient for contention.

---

## Algorithm 6: Output Buffer Management

### OutputBuffer Class (Y91)

**What it does:** Manages buffered writes to task output files with async, non-blocking operation.

**How it works:**

```
Append:
Step 1: Add content to pending chunks
Step 2: Start flush cycle if not running

Flush Cycle:
Step 1: Open file (lazy)
Step 2: Write all pending chunks
Step 3: Close file
Step 4: Check for new chunks
Step 5: Repeat if needed
Step 6: Resolve flush promise
```

**Source Code:**

```javascript
// ============================================
// Y91 - OutputBuffer
// Location: chunks.41.mjs:2252-2308
// ============================================

class OutputBuffer {
    #filePath;
    #fileHandle = null;
    #pendingChunks = [];
    #flushPromise = null;
    #resolveFlush = null;

    constructor(taskId) {
        this.#filePath = getOutputFilePath(taskId);
    }

    // Non-blocking append
    append(content) {
        this.#pendingChunks.push(content);

        // Start flush cycle if not already running
        if (!this.#flushPromise) {
            this.#flushPromise = new Promise((resolve) => {
                this.#resolveFlush = resolve;
            });
            this.#startFlushCycle();
        }
    }

    // Wait for all writes
    flush() {
        return this.#flushPromise ?? Promise.resolve();
    }

    // Cancel pending writes
    cancel() {
        this.#pendingChunks.length = 0;
    }

    // Internal write cycle
    async #writeCycle() {
        while (true) {
            try {
                // Lazy file open
                if (!this.#fileHandle) {
                    await ensureTasksDirExists();
                    this.#fileHandle = await fs.open(
                        this.#filePath,
                        process.platform === "win32"
                            ? "a"
                            : O_WRONLY | O_APPEND | O_CREAT | O_NOFOLLOW
                    );
                }

                // Write all pending chunks
                while (true) {
                    await this.#writeChunk();
                    if (this.#pendingChunks.length === 0) break;
                }

            } finally {
                // Close file
                if (this.#fileHandle) {
                    let handle = this.#fileHandle;
                    this.#fileHandle = null;
                    await handle.close();
                }
            }

            // Check for new chunks after close
            if (this.#pendingChunks.length) continue;
            break;
        }
    }

    // Build buffer from chunks (efficient single write)
    #buildBuffer() {
        let chunks = this.#pendingChunks.splice(0, this.#pendingChunks.length);
        let totalSize = 0;

        for (let chunk of chunks) {
            totalSize += Buffer.byteLength(chunk, "utf8");
        }

        let buffer = Buffer.allocUnsafe(totalSize);
        let offset = 0;

        for (let chunk of chunks) {
            offset += buffer.write(chunk, offset, "utf8");
        }

        return buffer;
    }
}
```

**Why buffer coalescing:**

| Without Coalescing | With Coalescing |
|--------------------|-----------------|
| Multiple small writes | Single large write |
| More syscalls | Fewer syscalls |
| Slower | Faster |
| More disk seeks | Sequential write |

**Key insight:** The O_NOFOLLOW flag on Unix prevents symlink attacks - if the output file is a symlink, the open will fail rather than follow the symlink.

---

## Algorithm Comparison Table

| Algorithm | Time Complexity | Space Complexity | Key Trade-off |
|-----------|-----------------|------------------|---------------|
| Task ID Generation | O(1) | O(1) | Predictability vs Uniqueness |
| Tool Filtering | O(n*m) | O(1) | Flexibility vs Simplicity |
| Abort Signal | O(1) | O(1) | Speed vs State Complexity |
| Mid-Run Backgrounding | O(1) | O(1) | Latency vs Code Complexity |
| Mailbox Write | O(n) | O(n) | Safety vs Latency |
| Output Buffer | O(1) amortized | O(k) | Memory vs I/O |

---

## Performance Considerations

### Task ID Generation
- **Speed**: ~1 microsecond (crypto.getRandomValues is fast)
- **Collision**: 36^8 ≈ 2.8 trillion combinations

### Tool Filtering
- **Speed**: Linear in number of tools
- **Cache**: Results not cached (re-evaluated per call)

### Abort Signal
- **Speed**: Instant (single state update)
- **Cleanup**: Async, non-blocking

### Mailbox
- **Latency**: 5-100ms for lock acquisition
- **Throughput**: Limited by file I/O

### Output Buffer
- **Throughput**: Limited by disk speed
- **Memory**: Linear in chunk size

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `oV` | generateTaskId | chunks.41.mjs:2410 | ✓ Verified |
| `Xk8` | filterToolsForSubagent | chunks.93.mjs:1568 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | ✓ Verified |
| `wl` | readMailbox | chunks.132.mjs:3 | ✓ Verified |
| `x3` | writeToMailbox | chunks.132.mjs:22 | ✓ Verified |
| `Y91` | OutputBuffer | chunks.41.mjs:2252 | ✓ Verified |

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - Key algorithms documented with deep analysis