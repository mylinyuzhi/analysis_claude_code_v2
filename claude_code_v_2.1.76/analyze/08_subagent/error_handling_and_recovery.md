# Error Handling and Recovery - Deep Technical Analysis

> Comprehensive analysis of error categories, recovery strategies, and cleanup mechanisms in Claude Code 2.1.38

---

## Table of Contents

1. [Error Categories](#error-categories)
2. [Recovery Strategies](#recovery-strategies)
3. [Error Propagation](#error-propagation)
4. [Cleanup Mechanisms](#cleanup-mechanisms)
5. [Error Handling Flow](#error-handling-flow)

---

## 1. Error Categories

### Tool Execution Errors

**Examples:**
- File not found (Read tool)
- Permission denied (Bash tool)
- Invalid input (schema validation)
- Command timeout (Bash tool)

**Handling:**
```javascript
try {
    let result = await executeTool(tool, input);
} catch (error) {
    if (error.code === "ENOENT") {
        return createToolErrorResult({
            error: `File not found: ${input.file_path}`,
            is_error: true
        });
    }
    throw error;  // Propagate unexpected errors
}
```

**Recovery:** Return error result to LLM, continue agent loop

### LLM API Errors

**Examples:**
- Rate limiting (429)
- Invalid request (400)
- Authentication failure (401)
- Model overload (529)

**Handling with Retry:**
```javascript
async function withApiRetry(apiCall, maxRetries = 3) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await apiCall();
        } catch (error) {
            if (error.status === 429 || error.status === 529) {
                // Rate limit or overload - exponential backoff
                let delayMs = Math.pow(2, attempt) * 1000;
                await sleep(delayMs);
                continue;
            }

            if (error.status === 400) {
                // Bad request - don't retry
                throw new Error(`Invalid request: ${error.message}`);
            }

            // Other errors - retry
            if (attempt === maxRetries - 1) throw error;
        }
    }
}
```

**Recovery:** Exponential backoff for transient errors, fail fast for permanent errors

### State Corruption Errors

**Examples:**
- Invalid task state (status inconsistency)
- Missing required fields
- Circular references
- Race conditions

**Detection:**
```javascript
function validateTaskState(task) {
    if (!task.agentId) {
        throw new Error("Task missing agentId");
    }

    if (!["running", "completed", "failed", "killed"].includes(task.status)) {
        throw new Error(`Invalid task status: ${task.status}`);
    }

    if (task.status === "completed" && !task.completedAt) {
        logWarning("Completed task missing completedAt - auto-fixing");
        task.completedAt = Date.now();
    }

    return task;
}
```

**Recovery:** Auto-fix when possible, fail task if unrecoverable

### Communication Errors

**Examples:**
- Mailbox file locked (timeout)
- Mailbox corrupted (invalid JSON)
- Message delivery failure
- Network errors (MCP)

**Handling:**
```javascript
async function readMailboxWithRetry(agentId, maxRetries = 3) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return readMailbox(agentId);
        } catch (error) {
            if (error.code === "ELOCK") {
                // File locked - retry
                await sleep(100);
                continue;
            }

            if (error instanceof SyntaxError) {
                // Corrupted JSON - backup and recreate
                backupCorruptedMailbox(agentId);
                return [];  // Lose messages (graceful degradation)
            }

            throw error;
        }
    }

    logError(`Failed to read mailbox after ${maxRetries} retries`);
    return [];  // Graceful degradation
}
```

**Recovery:** Retry with backoff, graceful degradation on corruption

### Timeout Errors

**Examples:**
- Agent loop timeout (max turns reached)
- Tool execution timeout
- File operation timeout
- Mailbox lock timeout

**Handling:**
```javascript
async function withTimeout(promise, timeoutMs, label) {
    let timeoutHandle;
    let timeoutPromise = new Promise((_, reject) => {
        timeoutHandle = setTimeout(() => {
            reject(new Error(`Timeout after ${timeoutMs}ms: ${label}`));
        }, timeoutMs);
    });

    try {
        return await Promise.race([promise, timeoutPromise]);
    } finally {
        clearTimeout(timeoutHandle);
    }
}

// Usage
try {
    let result = await withTimeout(
        executeTool(tool, input),
        120000,  // 2 minutes
        `Tool execution: ${tool.name}`
    );
} catch (error) {
    if (error.message.includes("Timeout")) {
        // Handle timeout specifically
        failTask(agentId, setAppState, error);
        return createTimeoutError(error);
    }
    throw error;
}
```

**Recovery:** Fail task gracefully, notify user, cleanup resources

---

## 2. Recovery Strategies

### Graceful Degradation

**Strategy:** When error occurs, degrade to simpler functionality rather than failing completely.

**Examples:**
- Mailbox corrupted → Return empty messages (lose data but continue)
- Tool execution fails → Return error result to LLM (LLM can retry or adjust)
- Progress update fails → Log error but don't fail task

```javascript
function updateTaskProgressSafe(agentId, summary, setAppState) {
    try {
        updateTaskProgress(agentId, summary, setAppState);
    } catch (error) {
        // Don't fail task if progress update fails
        logError("Failed to update task progress", error);
        // Task continues without progress update
    }
}
```

### Partial Transcript Preservation

**Strategy:** Save what we can, even if full transcript is corrupted.

```javascript
async function loadTranscriptWithRecovery(agentId) {
    let messages = [];
    let corruptedLines = [];

    try {
        let content = await fs.readFile(getTranscriptPath(agentId), "utf-8");
        let lines = content.split("\n").filter(line => line.trim());

        for (let i = 0; i < lines.length; i++) {
            try {
                let message = JSON.parse(lines[i]);
                messages.push(message);
            } catch (error) {
                // Skip corrupted line, continue with rest
                corruptedLines.push({ line: i + 1, content: lines[i] });
                logWarning(`Skipping corrupted transcript line ${i + 1}`);
            }
        }

        if (corruptedLines.length > 0) {
            logWarning(`Recovered ${messages.length} messages, skipped ${corruptedLines.length} corrupted`);
        }

        return messages;
    } catch (error) {
        logError("Failed to load transcript", error);
        return [];  // Empty transcript if file unreadable
    }
}
```

### Task State Cleanup

**Strategy:** Ensure task state is cleaned up even on error.

```javascript
async function executeAgentWithCleanup(agentId, agentFn) {
    try {
        let result = await agentFn();
        completeTask(agentId, setAppState);
        return result;
    } catch (error) {
        failTask(agentId, setAppState, error);
        throw error;
    } finally {
        // Always cleanup, even if failTask throws
        removeTask(agentId, setAppState);
    }
}
```

### Resource Deallocation

**Strategy:** Release resources (file handles, MCP clients, etc.) on error.

```javascript
async function agentLoopWithResourceCleanup({...}) {
    let mcpClients = [];

    try {
        // Initialize MCP clients
        mcpClients = await initializeMcpClients(agentDefinition);

        // Execute agent loop
        for await (let message of llmLoop({...})) {
            yield message;
        }
    } catch (error) {
        logError("Agent loop failed", error);
        throw error;
    } finally {
        // ALWAYS cleanup MCP clients
        for (let client of mcpClients) {
            try {
                await client.close();
            } catch (closeError) {
                logError("Failed to close MCP client", closeError);
            }
        }
    }
}
```

---

## 3. Error Propagation

### Try-Catch Boundaries

**Pattern:** Catch errors at appropriate boundaries, log + handle or propagate.

```javascript
// Boundary 1: Tool execution (catch and return error result)
async function executeToolSafe(tool, input) {
    try {
        return await tool.execute(input);
    } catch (error) {
        logError(`Tool ${tool.name} failed`, error);
        return { is_error: true, error: error.message };
    }
}

// Boundary 2: Agent loop (catch and fail task)
async function agentLoopRunner({...}) {
    try {
        for await (let message of llmLoop({...})) {
            yield message;
        }
    } catch (error) {
        logError("Agent loop failed", error);
        failTask(agentId, setAppState, error);
        throw error;  // Propagate to parent
    }
}

// Boundary 3: Top-level (catch and display to user)
async function handleUserRequest(request) {
    try {
        let result = await processRequest(request);
        displayResult(result);
    } catch (error) {
        displayError(`Request failed: ${error.message}`);
        telemetry.recordError(error);
    }
}
```

### Error Logging (K1)

```javascript
// K1 - Error logging function
function K1(message, error) {
    console.error(`[ERROR] ${message}`, {
        error: error?.message,
        stack: error?.stack,
        timestamp: new Date().toISOString()
    });

    // Also log to file
    fs.appendFileSync(
        getLogFilePath(),
        `${new Date().toISOString()} ERROR: ${message}\n${error?.stack}\n\n`
    );
}
```

### Telemetry Events

```javascript
// c - Telemetry function
function c(eventName, metadata) {
    telemetryClient.recordEvent({
        name: eventName,
        timestamp: Date.now(),
        metadata: {
            ...metadata,
            session_id: getSessionId(),
            agent_id: getCurrentAgentId()
        }
    });
}

// Usage
try {
    let result = await executeTool(tool, input);
    c("tool_execution_success", { tool: tool.name });
} catch (error) {
    c("tool_execution_error", {
        tool: tool.name,
        error: error.message
    });
    throw error;
}
```

### User-Facing Error Messages

**Pattern:** Convert technical errors to user-friendly messages.

```javascript
function formatErrorForUser(error) {
    // Map technical errors to user-friendly messages
    const errorMessages = {
        "ENOENT": "File not found. Please check the path and try again.",
        "EACCES": "Permission denied. You don't have access to this file.",
        "ETIMEDOUT": "Operation timed out. Please try again.",
        "ECONNREFUSED": "Connection refused. Check network and MCP server.",
        "RATE_LIMIT": "API rate limit exceeded. Please wait a moment."
    };

    let userMessage = errorMessages[error.code] || error.message;

    return {
        type: "error",
        message: userMessage,
        details: process.env.DEBUG ? error.stack : undefined
    };
}
```

---

## 4. Cleanup Mechanisms

### Three-Layer Cleanup (Detailed)

**Layer 1: Global Cleanup Set (vR6)**
```javascript
// Registration
function registerGlobalCleanup(cleanupFn) {
    vR6.add(cleanupFn);
    return () => vR6.delete(cleanupFn);
}

// Execution (session end)
async function cleanupSession() {
    for (let cleanupFn of vR6) {
        try {
            await cleanupFn();
        } catch (error) {
            logError("Cleanup function failed", error);
            // Continue with other cleanups
        }
    }
    vR6.clear();
}
```

**Layer 2: Task-Level Cleanup**
```javascript
// Stored in task.cleanup array or task.unregisterCleanup
function completeTask(agentId, setAppState) {
    updateTaskInState(agentId, setAppState, (task) => {
        // Execute all cleanup callbacks
        task.cleanup?.forEach(fn => {
            try {
                fn();
            } catch (error) {
                logError("Task cleanup failed", error);
            }
        });

        return {
            ...task,
            status: "completed",
            cleanup: []  // Clear after execution
        };
    });
}
```

**Layer 3: Map-Level Cleanup**
```javascript
// Background signal resolver cleanup
function backgroundTask(taskId, getAppState, setAppState) {
    // ... background logic ...

    // Delete resolver from map
    let resolver = backgroundTaskSignalMap.get(taskId);
    if (resolver) {
        resolver();
        backgroundTaskSignalMap.delete(taskId);  // Prevent memory leak
    }
}
```

### Timeout-Based Cleanup

```javascript
// Cleanup after timeout if task stalled
function scheduleTimeoutCleanup(agentId, timeoutMs) {
    let timeoutHandle = setTimeout(() => {
        let task = getAppState().tasks[agentId];

        if (task && task.status === "running") {
            logWarning(`Task ${agentId} timeout - forcing cleanup`);
            killTask(agentId, setAppState);
            removeTask(agentId, setAppState);
        }
    }, timeoutMs);

    // Cancel timeout if task completes normally
    return () => clearTimeout(timeoutHandle);
}
```

### AbortController Cascading

```javascript
// Parent abort cascades to all children
function createChildAbortController(parentController) {
    let childController = new AbortController();

    // Link child to parent
    if (parentController.signal.aborted) {
        childController.abort();  // Already aborted
    } else {
        parentController.signal.addEventListener("abort", () => {
            childController.abort();  // Cascade abort
        });
    }

    return childController;
}
```

### File Lock Release

```javascript
// Guaranteed lock release via try/finally
function withFileLock(filePath, operation) {
    let lock = fileLockSync.lockSync(filePath);

    try {
        return operation();
    } finally {
        lock.unlock();  // ALWAYS unlocks
    }
}
```

---

## 5. Error Handling Flow

### Complete Error Handling Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ Error Thrown During Agent Execution                         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Catch Boundary                                              │
│  ├─ Tool execution → Return error result to LLM            │
│  ├─ Agent loop → Fail task and propagate                   │
│  └─ Top-level → Display to user                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Logging & Telemetry                                         │
│  ├─ K1(message, error) → Log to console + file             │
│  └─ c(eventName, metadata) → Record telemetry event        │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Update Task State                                           │
│  ├─ failTask(agentId, setAppState, error)                  │
│  │   ├─ Set status = "failed"                               │
│  │   ├─ Record error message                                │
│  │   └─ Set completedAt timestamp                           │
│  └─ OR killTask(agentId, setAppState) if user abort        │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Execute Cleanup Callbacks                                   │
│  ├─ Layer 1: Global cleanup (vR6 set)                      │
│  ├─ Layer 2: Task cleanup (task.cleanup array)             │
│  └─ Layer 3: Map cleanup (backgroundTaskSignalMap)         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Notify Parent/User                                          │
│  ├─ Parent agent receives error result                      │
│  ├─ User sees error message in UI                           │
│  └─ Telemetry recorded for debugging                        │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Return Error Result or Propagate                            │
│  ├─ Tool error → LLM can retry or adjust                   │
│  ├─ Agent error → Parent decides recovery                   │
│  └─ Top-level error → User notified, session may continue   │
└─────────────────────────────────────────────────────────────┘
```

### Example Error Scenarios

**Scenario 1: File Read Fails**
```
User: "Read /nonexistent.txt"
  → Tool execution: Read tool
    → throws ENOENT error
      → Catch boundary: executeToolSafe()
        → Return error result to LLM
          → LLM: "The file doesn't exist. Would you like me to create it?"
            → Graceful recovery, agent continues
```

**Scenario 2: LLM API Rate Limited**
```
Agent loop iteration
  → LLM API call
    → 429 Rate Limit error
      → withApiRetry() catches
        → Wait 1 second (exponential backoff)
          → Retry LLM API call
            → Success
              → Agent continues normally
```

**Scenario 3: Agent Timeout**
```
Long-running agent (15 minutes)
  → Max turns reached (J turns)
    → Throw MaxTurnsError
      → Agent loop catch boundary
        → failTask(agentId, error)
          → Cleanup callbacks execute
            → User notified: "Agent reached maximum turns"
              → Task marked failed, resources released
```

**Scenario 4: Mailbox Corruption**
```
Teammate poll loop
  → readMailbox(teammateId)
    → JSON.parse() throws SyntaxError
      → Catch: mailbox corrupted
        → backupCorruptedMailbox()
          → Return empty messages []
            → Log warning, continue polling
              → Graceful degradation: lost messages but system continues
```

---

## Summary

Error handling in Claude Code 2.1.38 follows a comprehensive strategy:

1. **Error Categories** - Tool, LLM API, state, communication, timeout errors
2. **Recovery Strategies** - Graceful degradation, partial preservation, cleanup guarantees
3. **Error Propagation** - Try-catch boundaries, logging (K1), telemetry (c), user messages
4. **Cleanup Mechanisms** - Three-layer cleanup, timeout-based, AbortController cascading
5. **Error Handling Flow** - Catch → Log → Update State → Cleanup → Notify → Return/Propagate

**Design principles:**
- **Fail gracefully:** Degrade functionality rather than crash
- **Cleanup always:** try/finally ensures resource release
- **User-friendly:** Convert technical errors to actionable messages
- **Observability:** Log + telemetry for debugging

**Key patterns:**
- **Retry with backoff:** Transient errors (rate limits, network)
- **Fail fast:** Permanent errors (bad input, auth failure)
- **Partial recovery:** Save what we can (corrupted transcripts)
- **Layered cleanup:** Multiple safety nets prevent resource leaks

**Next steps:** See [architecture_summary.md](./architecture_summary.md) for overall system architecture and design patterns.
