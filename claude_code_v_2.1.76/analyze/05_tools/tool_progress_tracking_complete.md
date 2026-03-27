# Tool Progress Tracking Complete Analysis (Claude Code 2.1.76)

> Complete source-level analysis of tool progress callbacks, streaming updates, and UI visualization.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)

Key functions in this document:
- `toolExecutionOrchestrator` (ZxY) - Progress queue management - chunks.146.mjs:391
- `AsyncQueue` (Pi6) - Async message queue - chunks.146.mjs
- Progress callback pattern in tool execution

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PROGRESS TRACKING PIPELINE                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ① Tool Execution (A.call)                                           │
│     └─ Tool receives progress callback as parameter                  │
│                                                                       │
│  ② Progress Callback Invocation                                      │
│     ├─ Tool calls: progressCallback({ toolUseID, data })            │
│     └─ Data can be: text, percentage, status message                 │
│                                                                       │
│  ③ Queue Enqueue                                                      │
│     ├─ Progress message wrapped in C4q function                      │
│     └─ Enqueued to AsyncQueue (Pi6)                                  │
│                                                                       │
│  ④ Orchestrator Yield                                                 │
│     ├─ AsyncQueue yields messages to toolDispatcher                 │
│     └─ Agent loop receives progress update                           │
│                                                                       │
│  ⑤ UI Update                                                          │
│     ├─ React state updated with progress data                        │
│     └─ Spinner/status displays current progress                      │
│                                                                       │
│  ⑥ Completion                                                          │
│     ├─ tool.call returns final result                                │
│     ├─ Queue marked as done                                          │
│     └─ Final result yielded                                          │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## AsyncQueue Implementation

### Queue Creation and Management

**What it does:**
Creates an async iterator that allows both pushing and pulling messages. This enables streaming progress updates from tool execution back to the agent loop.

**Key insight:**
The queue decouples the synchronous tool execution from the async generator pattern used in the agent loop.

```javascript
// ============================================
// ZxY - toolExecutionOrchestrator
// Location: chunks.146.mjs:391-430
// ============================================

// ORIGINAL (for source lookup):
function ZxY(A, q, K, Y, z, _, w, O, $, H) {
    let j = new Pi6;
    return fxY(A, q, K, Y, z, _, w, O, $, H, (J) => {
        d("tengu_tool_use_progress", {
            messageID: w,
            toolName: hq(A.name),
            isMcp: A.isMcp ?? !1,
            queryChainId: Y.queryTracking?.chainId,
            queryDepth: Y.queryTracking?.depth,
            ...$ ? { mcpServerType: $ } : {},
            ...H ? { mcpServerBaseUrl: H } : {},
            ...O ? { requestId: O } : {}
        }), j.enqueue({
            message: C4q({
                toolUseID: J.toolUseID,
                parentToolUseID: q,
                data: J.data
            })
        })
    }).then((J) => {
        for (let M of J) j.enqueue(M)
    }).catch((J) => {
        j.error(J)
    }).finally(() => {
        j.done()
    }), j
}

// READABLE (for understanding):
function toolExecutionOrchestrator(tool, toolUseId, input, context, canUseTool, message, messageId, requestId, mcpServerType, mcpServerBaseUrl) {
    // Create async queue for streaming results
    const queue = new AsyncQueue();

    // Execute the full pipeline with progress callback
    toolExecutionPipeline(tool, toolUseId, input, context, canUseTool, message, messageId, requestId, mcpServerType, mcpServerBaseUrl, (progressUpdate) => {
        // Progress callback: emit telemetry and enqueue message
        emitTelemetry("tengu_tool_use_progress", {
            messageID: messageId,
            toolName: getDisplayName(tool.name),
            isMcp: tool.isMcp ?? false,
            queryChainId: context.queryTracking?.chainId,
            queryDepth: context.queryTracking?.depth,
            ...(mcpServerType ? { mcpServerType } : {}),
            ...(mcpServerBaseUrl ? { mcpServerBaseUrl } : {}),
            ...(requestId ? { requestId } : {})
        });

        // Enqueue progress message for streaming
        queue.enqueue({
            message: createProgressMessage({
                toolUseID: progressUpdate.toolUseID,
                parentToolUseID: toolUseId,
                data: progressUpdate.data
            })
        });
    }).then((results) => {
        // Pipeline completed: enqueue all final results
        for (let result of results) {
            queue.enqueue(result);
        }
    }).catch((error) => {
        // Pipeline error: propagate to queue
        queue.error(error);
    }).finally(() => {
        // Always mark queue as done
        queue.done();
    });

    // Return the async iterator
    return queue;
}

// Mapping: ZxY→toolExecutionOrchestrator, A→tool, q→toolUseId, K→input, Y→context,
//          z→canUseTool, _→message, w→messageId, O→requestId, $→mcpServerType,
//          H→mcpServerBaseUrl, j→queue, Pi6→AsyncQueue, fxY→toolExecutionPipeline,
//          d→emitTelemetry, hq→getDisplayName, C4q→createProgressMessage
```

---

## Progress Callback Pattern

### Tool Call Signature

**What it does:**
Tools receive a progress callback as the 4th parameter to their `call` method, allowing them to report progress during long-running operations.

```javascript
// ============================================
// Tool Call with Progress Callback
// Location: chunks.146.mjs:725-734
// ============================================

// ORIGINAL (for source lookup):
let u = await A.call(X, {
    ...Y,
    toolUseId: q,
    userModified: V.userModified ?? !1
}, z, _, (z6) => {
    j({
        toolUseID: z6.toolUseID,
        data: z6.data
    })
})

// READABLE (for understanding):
const result = await tool.call(input, {
    ...context,
    toolUseId: toolUseId,
    userModified: permissionResult.userModified ?? false
}, canUseTool, message, (progressData) => {
    // Progress callback - invoked by tool during execution
    progressCallback({
        toolUseID: progressData.toolUseID,
        data: progressData.data
    });
});

// Mapping: A→tool, X→input, Y→context, q→toolUseId, V→permissionResult,
//          z→canUseTool, _→message, j→progressCallback, u→result
```

---

## Progress Message Types

### Progress Data Structure

```typescript
interface ProgressData {
    toolUseID: string;
    data: {
        type: "text" | "percentage" | "status" | "file";
        content: string;
        percentage?: number;        // 0-100 for progress bars
        filePath?: string;          // For file operations
        bytesProcessed?: number;    // For streaming
        totalBytes?: number;        // For progress calculation
    };
}
```

### Common Progress Patterns

| Tool | Progress Type | Example Data |
|------|---------------|--------------|
| Bash | text | Command output lines |
| Read | percentage | "Reading file X (50%)" |
| Write | file | "Writing to /path/to/file" |
| Agent | status | "Agent analyzing codebase..." |
| WebFetch | percentage | "Fetching URL (30%)" |

---

## Progress Message Creation

### createProgressMessage Function (C4q)

**What it does:**
Creates a properly formatted progress message that can be added to the message stream.

```javascript
// ============================================
// C4q - createProgressMessage (inferred)
// Location: chunks.146.mjs (referenced at line 417)
// ============================================

// READABLE (for understanding):
function createProgressMessage(params: {
    toolUseID: string;
    parentToolUseID: string;
    data: ProgressData;
}): Message {
    return {
        type: "progress",
        toolUseID: params.toolUseID,
        parentToolUseID: params.parentToolUseID,
        data: params.data,
        timestamp: Date.now()
    };
}

// Mapping: C4q→createProgressMessage
```

---

## Progress Handling in Pipeline

### Progress Message Processing

**What it does:**
During pre-tool hooks execution, progress messages are either passed through or converted to attachments.

```javascript
// ============================================
// Progress Message Processing in fxY
// Location: chunks.146.mjs:542-552
// ============================================

// ORIGINAL (for source lookup):
for await (let u of y4q(Y, A, X, q, _.message.id, O, $, H)) switch (u.type) {
    case "message":
        if (u.message.message.type === "progress") j(u.message.message);
        else {
            D.push(u.message);
            let I = u.message.message.attachment;
            if (I && "command" in I && I.command !== void 0 && "durationMs" in I && I.durationMs !== void 0)
                G.push({
                    command: I.command,
                    durationMs: I.durationMs
                })
        }
        break;
    // ... other cases
}

// READABLE (for understanding):
for await (let hookResult of executePreToolHooks(context, tool, input, toolUseId, messageId, requestId, mcpServerType, mcpServerBaseUrl)) {
    switch (hookResult.type) {
        case "message":
            // Check if this is a progress message
            if (hookResult.message.message.type === "progress") {
                // Pass progress directly to callback
                progressCallback(hookResult.message.message);
            } else {
                // Regular message - add to results
                results.push(hookResult.message);

                // Track command execution times if present
                const attachment = hookResult.message.message.attachment;
                if (attachment && "command" in attachment && "durationMs" in attachment) {
                    commandExecutions.push({
                        command: attachment.command,
                        durationMs: attachment.durationMs
                    });
                }
            }
            break;
        // ... handle other hook result types
    }
}

// Mapping: u→hookResult, y4q→executePreToolHooks, A→tool, X→input, q→toolUseId,
//          Y→context, _→message, D→results, j→progressCallback, G→commandExecutions
```

---

## Telemetry for Progress

### Progress Telemetry Event

**What it does:**
Emits telemetry for each progress update, enabling performance analysis and debugging.

```javascript
// ============================================
// Progress Telemetry
// Location: chunks.146.mjs:394-415
// ============================================

// ORIGINAL (for source lookup):
d("tengu_tool_use_progress", {
    messageID: w,
    toolName: hq(A.name),
    isMcp: A.isMcp ?? !1,
    queryChainId: Y.queryTracking?.chainId,
    queryDepth: Y.queryTracking?.depth,
    ...$ ? { mcpServerType: $ } : {},
    ...H ? { mcpServerBaseUrl: H } : {},
    ...O ? { requestId: O } : {},
    ...YF() ? (() => {
        let M = gb(A.name);
        return M ? { mcpServerName: M.serverName, mcpToolName: M.mcpToolName } : {}
    })() : {}
})

// READABLE (for understanding):
emitTelemetry("tengu_tool_use_progress", {
    messageID: messageId,
    toolName: getDisplayName(tool.name),
    isMcp: tool.isMcp ?? false,
    queryChainId: context.queryTracking?.chainId,
    queryDepth: context.queryTracking?.depth,

    // MCP-specific fields (conditional)
    ...(mcpServerType ? { mcpServerType } : {}),
    ...(mcpServerBaseUrl ? { mcpServerBaseUrl } : {}),
    ...(requestId ? { requestId } : {}),

    // Debug mode: include MCP tool details
    ...(isDebugEnabled() ? (() => {
        const mcpDetails = parseMcpToolName(tool.name);
        return mcpDetails ? {
            mcpServerName: mcpDetails.serverName,
            mcpToolName: mcpDetails.mcpToolName
        } : {};
    })() : {})
});

// Mapping: d→emitTelemetry, w→messageId, A→tool, hq→getDisplayName,
//          Y→context, $→mcpServerType, H→mcpServerBaseUrl, O→requestId
```

---

## UI Integration

### Progress Display in React

**What it does:**
Progress messages are rendered in the UI as spinner updates or progress indicators.

**Key insight:**
The `activeForm` field in task tools and progress messages enables the spinner to show meaningful status text.

```javascript
// ============================================
// Progress State in React (conceptual)
// ============================================

// Progress state slice
interface ProgressState {
    currentToolName: string;
    progressPercentage: number | null;
    progressText: string;
    startTime: number;
}

// Progress update handler
function handleProgressUpdate(progress: ProgressData) {
    if (progress.data.type === "percentage") {
        setProgressState({
            progressPercentage: progress.data.percentage,
            progressText: progress.data.content
        });
    } else if (progress.data.type === "text") {
        setProgressState({
            progressText: progress.data.content
        });
    }
}

// Spinner display
function SpinnerDisplay({ progress }: { progress: ProgressState }) {
    return (
        <div className="spinner">
            <span className="spinner-icon">⏳</span>
            <span className="spinner-text">
                {progress.progressText || `Running ${progress.currentToolName}...`}
            </span>
            {progress.progressPercentage !== null && (
                <span className="spinner-percentage">
                    ({progress.progressPercentage}%)
                </span>
            )}
        </div>
    );
}
```

---

## Cross-Module Integration

### Progress ↔ System Reminder (04)

- Progress messages can be converted to `progress` attachment type
- Attachments injected into conversation for LLM context

### Progress ↔ UI (02)

- Spinner component subscribes to progress state
- Modal system checks `shouldContinueAnimation` flag
- Progress updates don't block user interaction

### Progress ↔ Telemetry (17)

- All progress events emit `tengu_tool_use_progress`
- Duration tracking for performance analysis

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Progress streaming with AsyncQueue |
| 2.1.72 | MCP tool progress support |
| 2.1.32 | Background agent progress tracking |

---

## Symbol Validation Status

**Last validated:** 2026-03-27

| Symbol | Validated Location | Status |
|--------|-------------------|--------|
| ZxY (toolExecutionOrchestrator) | chunks.146.mjs:391 | ✅ Correct |
| Pi6 (AsyncQueue) | chunks.146.mjs | ✅ Correct |
| C4q (createProgressMessage) | chunks.146.mjs:417 | ✅ Correct |
| y4q (executePreToolHooks) | chunks.146.mjs:74 | ✅ Correct |