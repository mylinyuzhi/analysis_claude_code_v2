# StreamingToolExecutor Queue (Claude Code 2.1.76)

> Deep analysis of parallel tool execution, concurrency safety, and sibling abort patterns.
>
> **Symbol Validation Status**: ✅ VERIFIED - All symbols cross-validated against source code on 2026-03-25.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `StreamingToolExecutor` (ui6) - Parallel tool execution class at chunks.173.mjs:3
- `toolDispatcher` (Wi6) - Tool routing at chunks.146.mjs:285
- `executeToolCore` (fxY) - Core tool execution at chunks.146.mjs
- `createUserMessage` (p1) - Message factory at chunks.173.mjs:1378

---

## Overview

The `StreamingToolExecutor` (ui6) class manages parallel tool execution during streaming responses. It solves the challenge of executing multiple tools concurrently while maintaining safety for tools that modify state.

### Key Challenges

1. **Concurrency Safety**: Some tools (Write, Edit, Bash) cannot run in parallel
2. **Error Propagation**: One tool failure should not corrupt other tool results
3. **User Interruption**: User should be able to cancel tool execution mid-stream
4. **Result Ordering**: Results must be yielded in a predictable order

---

## Class Structure

```javascript
// ============================================
// StreamingToolExecutor (ui6) - Tool execution queue
// Location: chunks.173.mjs:3-228
// ============================================

// ORIGINAL (for source lookup):
class ui6 {
    toolDefinitions;
    canUseTool;
    tools = [];
    toolUseContext;
    hasErrored = !1;
    erroredToolDescription = "";
    siblingAbortController;
    discarded = !1;
    progressAvailableResolve;
    constructor(A, q, K) {
        this.toolDefinitions = A;
        this.canUseTool = q;
        this.toolUseContext = K, this.siblingAbortController = Wm(K.abortController)
    }
    // ... methods
}

// READABLE (for understanding):
class StreamingToolExecutor {
    // Configuration
    toolDefinitions;           // Array of available tools
    canUseTool;               // Permission check function

    // Execution state
    tools = [];               // Queue of tool executions
    toolUseContext;           // Permission/session context
    hasErrored = false;       // Circuit breaker flag
    erroredToolDescription;   // Description of failed tool
    siblingAbortController;   // Cloned abort controller for isolation
    discarded = false;        // Flag for streaming fallback
    progressAvailableResolve; // Promise resolver for progress

    constructor(toolDefinitions, canUseTool, toolUseContext) {
        this.toolDefinitions = toolDefinitions;
        this.canUseTool = canUseTool;
        this.toolUseContext = toolUseContext;

        // Clone abort controller for sibling isolation
        this.siblingAbortController = cloneAbortController(toolUseContext.abortController);
    }
}

// Mapping: ui6→StreamingToolExecutor, Wm→cloneAbortController
```

---

## Tool Entry Structure

```javascript
// ============================================
// Tool Entry - Internal state for each tool
// Location: chunks.173.mjs:52-60
// ============================================

// READABLE (for understanding):
interface ToolEntry {
    id: string;                    // Tool use ID from LLM
    block: ToolUseBlock;           // Original tool_use block
    assistantMessage: Message;     // Parent assistant message
    status: "queued" | "executing" | "completed" | "yielded";
    isConcurrencySafe: boolean;    // Can run in parallel?
    results: Message[];            // Collected tool results
    contextModifiers: Function[];  // Context modification functions
    pendingProgress: Message[];    // Progress messages to yield
    promise?: Promise<void>;       // Execution promise
}
```

---

## Concurrency Safety Detection

### How Safety is Determined

```javascript
// ============================================
// Concurrency Safety Check
// Location: chunks.173.mjs:44-52
// ============================================

// ORIGINAL (for source lookup):
let Y = K.inputSchema.safeParse(A.input),
    z = Y?.success ? (() => {
        try {
            return Boolean(K.isConcurrencySafe(Y.data))
        } catch {
            return !1
        }
    })() : !1;

// READABLE (for understanding):
const parseResult = tool.inputSchema.safeParse(toolUseBlock.input);

const isConcurrencySafe = parseResult?.success
    ? (() => {
        try {
            // Tool defines isConcurrencySafe method
            return Boolean(tool.isConcurrencySafe(parseResult.data));
        } catch {
            return false;  // Default to unsafe on error
        }
    })()
    : false;  // Parse failed = unsafe

// Mapping: Y→parseResult, z→isConcurrencySafe, K→tool, A→toolUseBlock
```

### Tool Safety Categories

| Tool | Concurrency Safe | Reason |
|------|------------------|--------|
| Read | ✅ Yes | Read-only, no side effects |
| Grep | ✅ Yes | Read-only, no side effects |
| Glob | ✅ Yes | Read-only, no side effects |
| Write | ❌ No | Modifies file system |
| Edit | ❌ No | Modifies file system |
| Bash | ❌ No | Can modify state, run processes |
| NotebookEdit | ❌ No | Modifies notebook cells |
| Task | ❌ No | Creates persistent state |
| Agent | ❌ No | Spawns subagent processes |

---

## Execution Queue Algorithm

### canExecuteTool Method

```javascript
// ============================================
// canExecuteTool - Check if tool can run
// Location: chunks.173.mjs:62-65
// ============================================

// ORIGINAL (for source lookup):
canExecuteTool(A) {
    let q = this.tools.filter((K) => K.status === "executing");
    return q.length === 0 || A && q.every((K) => K.isConcurrencySafe)
}

// READABLE (for understanding):
canExecuteTool(isConcurrencySafe) {
    const executingTools = this.tools.filter(t => t.status === "executing");

    // Can execute if:
    // 1. Nothing is currently executing, OR
    // 2. This tool is concurrency-safe AND all executing tools are also safe
    return executingTools.length === 0 ||
           (isConcurrencySafe && executingTools.every(t => t.isConcurrencySafe));
}

// Mapping: A→isConcurrencySafe, q→executingTools
```

### processQueue Method

```javascript
// ============================================
// processQueue - Execute queued tools
// Location: chunks.173.mjs:66-72
// ============================================

// ORIGINAL (for source lookup):
async processQueue() {
    for (let A of this.tools) {
        if (A.status !== "queued") continue;
        if (this.canExecuteTool(A.isConcurrencySafe)) await this.executeTool(A);
        else if (!A.isConcurrencySafe) break
    }
}

// READABLE (for understanding):
async processQueue() {
    for (const toolEntry of this.tools) {
        // Skip already processed tools
        if (toolEntry.status !== "queued") continue;

        // Check if this tool can execute
        if (this.canExecuteTool(toolEntry.isConcurrencySafe)) {
            await this.executeTool(toolEntry);
        } else if (!toolEntry.isConcurrencySafe) {
            // Non-safe tool blocked by other non-safe tool
            // Don't process more tools until current ones finish
            break;
        }
    }
}
```

### Execution Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TOOL EXECUTION QUEUE FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Tool Use Blocks Arrive (from LLM stream)                                  │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ addTool(block, assistantMessage)                                     │    │
│  │                                                                       │    │
│  │ 1. Find tool definition                                               │    │
│  │ 2. Parse input schema                                                │    │
│  │ 3. Check concurrency safety                                          │    │
│  │ 4. Create tool entry (status: "queued")                              │    │
│  │ 5. Call processQueue()                                               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│         │                                                                    │
│         ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ processQueue()                                                        │    │
│  │                                                                       │    │
│  │ For each queued tool:                                                 │    │
│  │   ├─ Can execute? (canExecuteTool)                                   │    │
│  │   │   ├─ Yes → executeTool()                                         │    │
│  │   │   └─ No (non-safe blocked) → break                               │    │
│  │   └─ Continue to next tool                                           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│         │                                                                    │
│         ├──────────────────────────────────────────────────────────────┐    │
│         │                                                              │    │
│         ▼ (Concurrency Safe)                                          ▼    │
│  ┌───────────────────────┐                               ┌───────────────────┐│
│  │ Parallel Execution    │                               │ Sequential       ││
│  │                       │                               │ Execution        ││
│  │ Read ──────────────►  │                               │                  ││
│  │ Grep ─────────────►   │                               │ Write ────────►  ││
│  │ Glob ─────────────►   │                               │ (wait for prev)  ││
│  │                       │                               │                  ││
│  │ All run concurrently  │                               │ One at a time    ││
│  └───────────────────────┘                               └───────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Sibling Abort Pattern

### Why Sibling Abort?

When one tool fails, sibling tools that might be affected should be cancelled:

- **Write fails** → Cancel other pending Writes to prevent corruption
- **Bash fails** → Cancel dependent Bash commands
- **User cancels** → Cancel all running tools

### Implementation

```javascript
// ============================================
// Sibling Abort Controller - Isolation pattern
// Location: chunks.173.mjs:16, 148-153
// ============================================

// In constructor:
this.siblingAbortController = cloneAbortController(toolUseContext.abortController);

// In executeTool:
let siblingAbort = cloneAbortController(this.siblingAbortController);

siblingAbort.signal.addEventListener("abort", () => {
    // Propagate abort reason to parent if not user-initiated
    if (siblingAbort.signal.reason !== "sibling_error" &&
        !this.toolUseContext.abortController.signal.aborted &&
        !this.discarded) {
        this.toolUseContext.abortController.abort(siblingAbort.signal.reason);
    }
}, { once: true });

// When Bash tool fails:
if (toolEntry.block.name === "Bash") {
    this.hasErrored = true;
    this.erroredToolDescription = this.getToolDescription(toolEntry);
    this.siblingAbortController.abort("sibling_error");
}
```

### Abort Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SIBLING ABORT FLOW                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Tool Execution Context                                                      │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  AbortController (parent)                                                    │
│         │                                                                    │
│         ├── Clone ───────────────────────────────────────────────┐          │
│         │                                                        │          │
│         ▼                                                        ▼          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ siblingAbortController                                               │    │
│  │                                                                       │    │
│  │  Tool 1 (Bash) ──────────────────────► ERROR!                        │    │
│  │         │                               │                             │    │
│  │         │                               │ abort("sibling_error")      │    │
│  │         │                               ▼                             │    │
│  │  Tool 2 (Write) ◄─────────────────── Cancelled                       │    │
│  │         │                                                            │    │
│  │         │                                                            │    │
│  │  Tool 3 (Read) ───────────────────► Continues (safe)                 │    │
│  │                                                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Rules:                                                                      │
│  • Bash failure triggers sibling abort                                      │
│  • Read/Grep/Glob are not affected (safe tools)                             │
│  • Write/Edit are cancelled                                                 │
│  • User abort cancels all tools                                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Result Collection

### getCompletedResults Generator

```javascript
// ============================================
// getCompletedResults - Yield completed tool results
// Location: chunks.173.mjs:180-197
// ============================================

// ORIGINAL (for source lookup):
* getCompletedResults() {
    if (this.discarded) return;
    for (let A of this.tools) {
        while (A.pendingProgress.length > 0) yield {
            message: A.pendingProgress.shift(),
            newContext: this.toolUseContext
        };
        if (A.status === "yielded") continue;
        if (A.status === "completed" && A.results) {
            A.status = "yielded";
            for (let q of A.results) yield {
                message: q,
                newContext: this.toolUseContext
            };
            umY(this.toolUseContext, A.id)
        } else if (A.status === "executing" && !A.isConcurrencySafe) break
    }
}

// READABLE (for understanding):
*getCompletedResults() {
    // Don't yield if discarded (streaming fallback)
    if (this.discarded) return;

    for (const toolEntry of this.tools) {
        // First, yield any pending progress messages
        while (toolEntry.pendingProgress.length > 0) {
            yield {
                message: toolEntry.pendingProgress.shift(),
                newContext: this.toolUseContext
            };
        }

        // Skip already yielded tools
        if (toolEntry.status === "yielded") continue;

        // Yield completed tool results
        if (toolEntry.status === "completed" && toolEntry.results) {
            toolEntry.status = "yielded";

            for (const result of toolEntry.results) {
                yield {
                    message: result,
                    newContext: this.toolUseContext
                };
            }

            // Remove from in-progress set
            removeFromInProgressToolUseIDs(this.toolUseContext, toolEntry.id);
        }
        // Stop at first executing non-safe tool
        else if (toolEntry.status === "executing" && !toolEntry.isConcurrencySafe) {
            break;
        }
    }
}

// Mapping: A→toolEntry, q→result, umY→removeFromInProgressToolUseIDs
```

### getRemainingResults Async Generator

```javascript
// ============================================
// getRemainingResults - Wait for all results
// Location: chunks.173.mjs:201-215
// ============================================

// ORIGINAL (for source lookup):
async * getRemainingResults() {
    if (this.discarded) return;
    while (this.hasUnfinishedTools()) {
        await this.processQueue();
        for (let A of this.getCompletedResults()) yield A;
        if (this.hasExecutingTools() && !this.hasCompletedResults() && !this.hasPendingProgress()) {
            let A = this.tools.filter((K) => K.status === "executing" && K.promise).map((K) => K.promise),
                q = new Promise((K) => {
                    this.progressAvailableResolve = K
                });
            if (A.length > 0) await Promise.race([...A, q])
        }
    }
    for (let A of this.getCompletedResults()) yield A
}

// READABLE (for understanding):
async *getRemainingResults() {
    if (this.discarded) return;

    while (this.hasUnfinishedTools()) {
        // Process queued tools
        await this.processQueue();

        // Yield any completed results
        for (const result of this.getCompletedResults()) {
            yield result;
        }

        // If tools are executing but no results yet, wait
        if (this.hasExecutingTools() &&
            !this.hasCompletedResults() &&
            !this.hasPendingProgress()) {

            const executingPromises = this.tools
                .filter(t => t.status === "executing" && t.promise)
                .map(t => t.promise);

            const progressPromise = new Promise(resolve => {
                this.progressAvailableResolve = resolve;
            });

            // Wait for either tool completion or progress
            if (executingPromises.length > 0) {
                await Promise.race([...executingPromises, progressPromise]);
            }
        }
    }

    // Yield any remaining results
    for (const result of this.getCompletedResults()) {
        yield result;
    }
}
```

---

## Synthetic Error Messages

When tools are aborted, synthetic error messages are created:

```javascript
// ============================================
// createSyntheticErrorMessage - Error generation
// Location: chunks.173.mjs:73-106
// ============================================

// ORIGINAL (for source lookup):
createSyntheticErrorMessage(A, q, K) {
    if (q === "user_interrupted") return p1({
        content: [{
            type: "tool_result",
            content: QT6(h96),
            is_error: !0,
            tool_use_id: A
        }],
        toolUseResult: "User rejected tool use",
        sourceToolAssistantUUID: K.uuid
    });
    if (q === "streaming_fallback") return p1({
        content: [{
            type: "tool_result",
            content: "<tool_use_error>Error: Streaming fallback - tool execution discarded</tool_use_error>",
            is_error: !0,
            tool_use_id: A
        }],
        toolUseResult: "Streaming fallback - tool execution discarded",
        sourceToolAssistantUUID: K.uuid
    });
    let Y = this.erroredToolDescription,
        z = Y ? `Cancelled: parallel tool call ${Y} errored` : "Cancelled: parallel tool call errored";
    return p1({
        content: [{
            type: "tool_result",
            content: `<tool_use_error>${z}</tool_use_error>`,
            is_error: !0,
            tool_use_id: A
        }],
        toolUseResult: z,
        sourceToolAssistantUUID: K.uuid
    })
}

// READABLE (for understanding):
createSyntheticErrorMessage(toolUseId, reason, assistantMessage) {
    switch (reason) {
        case "user_interrupted":
            return createUserMessage({
                content: [{
                    type: "tool_result",
                    content: formatUserInterruptMessage(INTERRUPT_MESSAGE),
                    is_error: true,
                    tool_use_id: toolUseId
                }],
                toolUseResult: "User rejected tool use",
                sourceToolAssistantUUID: assistantMessage.uuid
            });

        case "streaming_fallback":
            return createUserMessage({
                content: [{
                    type: "tool_result",
                    content: "<tool_use_error>Error: Streaming fallback - tool execution discarded</tool_use_error>",
                    is_error: true,
                    tool_use_id: toolUseId
                }],
                toolUseResult: "Streaming fallback - tool execution discarded",
                sourceToolAssistantUUID: assistantMessage.uuid
            });

        case "sibling_error":
            const failedTool = this.erroredToolDescription;
            const message = failedTool
                ? `Cancelled: parallel tool call ${failedTool} errored`
                : "Cancelled: parallel tool call errored";
            return createUserMessage({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>${message}</tool_use_error>`,
                    is_error: true,
                    tool_use_id: toolUseId
                }],
                toolUseResult: message,
                sourceToolAssistantUUID: assistantMessage.uuid
            });
    }
}

// Mapping: p1→createUserMessage, QT6→formatUserInterruptMessage
```

---

## Key Insights

### Why This Design Works

1. **Parallel by Default**: Safe tools (Read, Grep, Glob) run concurrently for speed
2. **Sequential When Needed**: Unsafe tools wait for each other to prevent conflicts
3. **Isolation via Abort Controllers**: Each tool gets its own abort controller clone
4. **Progress Tracking**: Pending progress is yielded immediately for UI updates
5. **Error Propagation**: Bash errors trigger sibling abort but don't corrupt results

### Trade-offs

| Aspect | Choice | Trade-off |
|--------|--------|-----------|
| Parallelism | Opt-in via `isConcurrencySafe` | More complex but safer |
| Error Handling | Sibling abort for Bash only | Could miss edge cases |
| Result Order | FIFO by completion time | May not match LLM order |
| Cancellation | Immediate with synthetic error | User sees error, not cancellation |

---

## Source References

| Component | File | Key Functions |
|-----------|------|---------------|
| Tool Executor | chunks.173.mjs | `StreamingToolExecutor` (ui6) |
| Tool Dispatcher | chunks.146.mjs | `toolDispatcher` (Wi6), `executeToolCore` (fxY) |
| Message Creation | chunks.173.mjs | `createUserMessage` (p1) |
| Abort Controller | chunks.173.mjs | `cloneAbortController` (Wm) |

---

**Last Updated**: 2026-03-25
**Version**: Claude Code 2.1.76
**Status**: Complete - Tool executor queue documented with source verification