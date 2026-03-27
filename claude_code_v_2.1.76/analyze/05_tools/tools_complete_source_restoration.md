# Tools Module - Complete Source Restoration (Claude Code 2.1.76)

> **Complete source-level restoration** of the tool execution system with cross-validated symbols and detailed algorithm analysis.

---

## Related Symbols

> Symbol mappings: [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)

Key functions documented here:
- `toolDispatcher` (Wi6) - Entry point - chunks.146.mjs:285
- `toolExecutionOrchestrator` (ZxY) - Queue management - chunks.146.mjs:391
- `toolExecutionPipeline` (fxY) - 8-stage pipeline - chunks.146.mjs:442
- `executePreToolHooks` (y4q) - Pre-tool hooks - chunks.146.mjs:74
- `executePostToolFailureHooks` (E4q) - Post-failure hooks - chunks.146.mjs:3

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TOOL EXECUTION ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  assistant message with tool_use block                               │
│       │                                                               │
│       ▼                                                               │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Wi6 (toolDispatcher)                                         │    │
│  │ ├─ Stage 1: Tool lookup in session tool set                  │    │
│  │ ├─ Stage 2: Alias check in global registry                   │    │
│  │ ├─ Stage 3: Abort signal check                               │    │
│  │ └─ Stage 4: Delegate to ZxY                                  │    │
│  └─────────────────────────────────────────────────────────────┘    │
│       │                                                               │
│       ▼                                                               │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ ZxY (toolExecutionOrchestrator)                              │    │
│  │ ├─ Create AsyncQueue (Pi6)                                   │    │
│  │ ├─ Call fxY with progress callback                           │    │
│  │ └─ Yield results via queue                                   │    │
│  └─────────────────────────────────────────────────────────────┘    │
│       │                                                               │
│       ▼                                                               │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ fxY (toolExecutionPipeline) - 8 Stages                       │    │
│  │ ├─ Stage 1: Schema validation (Zod safeParse)                │    │
│  │ ├─ Stage 2: Custom validation (validateInput)                │    │
│  │ ├─ Stage 3: Pre-tool hooks (y4q)                             │    │
│  │ ├─ Stage 4: Permission check (canUseTool)                    │    │
│  │ ├─ Stage 5: Tool execution (tool.call)                       │    │
│  │ ├─ Stage 6: Post-tool hooks (k4q)                            │    │
│  │ ├─ Stage 7: Post-failure hooks (E4q) - on error only         │    │
│  │ └─ Stage 8: Result formatting                                │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. toolDispatcher (Wi6) - Entry Point

### What it does

Takes a `tool_use` content block from the assistant response, looks up the corresponding tool in the tool registry, and delegates execution to the full pipeline. Handles tool lookup failures, abort signals, and error wrapping.

### How it works

1. Extract tool name from tool_use block
2. Look up tool in session-scoped tool set
3. If not found, check global alias registry (for MCP/skill tools)
4. If still not found, return error tool_result
5. Check abort signal - if aborted, return cancelled tool_result
6. Delegate to toolExecutionOrchestrator (ZxY)
7. Yield all results from the pipeline

### Why this approach

- **Generator pattern** allows streaming results back to the agent loop
- **Two-stage lookup** (session tools → global alias registry) enables flexible tool discovery
- **Error wrapping** ensures all failures produce consistent tool_result blocks

### Key insight

The two-stage tool lookup enables dynamic tool discovery without modifying the session tool set. MCP tools and skill-provided tools are registered in the global alias registry, allowing them to be discovered on-demand.

```javascript
// ============================================
// toolDispatcher - Routes tool_use blocks to the correct tool
// Location: chunks.146.mjs:285-389
// ============================================

// ORIGINAL (for source lookup):
async function* Wi6(A, q, K, Y) {
    let z = A.name,
        _ = dK(Y.options.tools, z);
    if (!_) {
        let J = dK(ng(), z);
        if (J && J.aliases?.includes(z)) _ = J
    }
    let w = q.message.id,
        O = q.requestId,
        $ = PxY(z, Y.options.mcpClients),
        H = WxY(z, Y.options.mcpClients);
    if (!_) {
        let J = hq(z);
        k(`Unknown tool ${z}: ${A.id}`), d("tengu_tool_use_error", {
            error: `No such tool available: ${J}`,
            toolName: J,
            toolUseID: A.id,
            isMcp: z.startsWith("mcp__"),
            queryChainId: Y.queryTracking?.chainId,
            queryDepth: Y.queryTracking?.depth,
            ...$ ? { mcpServerType: $ } : {},
            ...H ? { mcpServerBaseUrl: H } : {},
            ...O ? { requestId: O } : {},
            ...YF() ? (() => {
                let M = gb(z);
                return M ? { mcpServerName: M.serverName, mcpToolName: M.mcpToolName } : {}
            })() : {}
        }), yield {
            message: p1({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>Error: No such tool available: ${z}</tool_use_error>`,
                    is_error: !0,
                    tool_use_id: A.id
                }],
                toolUseResult: `Error: No such tool available: ${z}`,
                sourceToolAssistantUUID: q.uuid
            })
        };
        return
    }
    let j = A.input;
    try {
        if (Y.abortController.signal.aborted) {
            d("tengu_tool_use_cancelled", {
                toolName: hq(_.name),
                toolUseID: A.id,
                isMcp: _.isMcp ?? !1,
                // ... telemetry ...
            });
            let J = CF8(A.id);
            J.content = QT6(R96), yield {
                message: p1({
                    content: [J],
                    toolUseResult: R96,
                    sourceToolAssistantUUID: q.uuid
                })
            };
            return
        }
        for await (let J of ZxY(_, A.id, j, Y, K, q, w, O, $, H)) yield J
    } catch (J) {
        _6(J);
        let M = J instanceof Error ? J.message : String(J),
            X = `Error calling tool${_?` (${_.name})`:""}: ${M}`;
        yield {
            message: p1({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>${X}</tool_use_error>`,
                    is_error: !0,
                    tool_use_id: A.id
                }],
                toolUseResult: X,
                sourceToolAssistantUUID: q.uuid
            })
        }
    }
}

// READABLE (for understanding):
async function* toolDispatcher(toolUseBlock, assistantMessage, canUseTool, toolUseContext) {
    const toolName = toolUseBlock.name;

    // === STAGE 1: Tool Lookup ===
    // First try session-scoped tool set
    let tool = findTool(toolUseContext.options.tools, toolName);

    // If not found, check global alias registry (for MCP tools, skill tools)
    if (!tool) {
        const globalTool = findTool(getDynamicToolSet(), toolName);
        if (globalTool?.aliases?.includes(toolName)) {
            tool = globalTool;
        }
    }

    // Extract context for telemetry
    const messageId = assistantMessage.message.id;
    const requestId = assistantMessage.requestId;
    const mcpServerType = getMcpServerType(toolName, toolUseContext.options.mcpClients);
    const mcpServerBaseUrl = getMcpServerBaseUrl(toolName, toolUseContext.options.mcpClients);

    // === STAGE 2: Handle Unknown Tool ===
    if (!tool) {
        const displayName = getDisplayName(toolName);
        console.warn(`Unknown tool ${toolName}: ${toolUseBlock.id}`);

        // Emit telemetry for unknown tool
        emitTelemetry("tengu_tool_use_error", {
            error: `No such tool available: ${displayName}`,
            toolName: displayName,
            toolUseID: toolUseBlock.id,
            isMcp: toolName.startsWith("mcp__"),
            queryChainId: toolUseContext.queryTracking?.chainId,
            queryDepth: toolUseContext.queryTracking?.depth,
            ...(mcpServerType ? { mcpServerType } : {}),
            ...(mcpServerBaseUrl ? { mcpServerBaseUrl } : {}),
            ...(requestId ? { requestId } : {}),
            // MCP server info if applicable
            ...(shouldIncludeMcpInfo() ? getMcpInfo(toolName) : {})
        });

        // Return error tool_result
        yield {
            message: createUserMessage({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>Error: No such tool available: ${toolName}</tool_use_error>`,
                    is_error: true,
                    tool_use_id: toolUseBlock.id
                }],
                toolUseResult: `Error: No such tool available: ${toolName}`,
                sourceToolAssistantUUID: assistantMessage.uuid
            })
        };
        return;
    }

    const input = toolUseBlock.input;

    try {
        // === STAGE 3: Check Abort Signal ===
        if (toolUseContext.abortController.signal.aborted) {
            emitTelemetry("tengu_tool_use_cancelled", {
                toolName: getDisplayName(tool.name),
                toolUseID: toolUseBlock.id,
                isMcp: tool.isMcp ?? false,
                // ... telemetry ...
            });

            const cancelledResult = createCancelledToolResult(toolUseBlock.id);
            yield {
                message: createUserMessage({
                    content: [cancelledResult],
                    toolUseResult: "Operation cancelled",
                    sourceToolAssistantUUID: assistantMessage.uuid
                })
            };
            return;
        }

        // === STAGE 4: Delegate to Orchestrator ===
        for await (const result of toolExecutionOrchestrator(
            tool,
            toolUseBlock.id,
            input,
            toolUseContext,
            canUseTool,
            assistantMessage,
            messageId,
            requestId,
            mcpServerType,
            mcpServerBaseUrl
        )) {
            yield result;
        }

    } catch (error) {
        // === ERROR HANDLING: Wrap all errors in tool_result ===
        reportError(error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        const fullMessage = `Error calling tool${tool ? ` (${tool.name})` : ""}: ${errorMessage}`;

        yield {
            message: createUserMessage({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>${fullMessage}</tool_use_error>`,
                    is_error: true,
                    tool_use_id: toolUseBlock.id
                }],
                toolUseResult: fullMessage,
                sourceToolAssistantUUID: assistantMessage.uuid
            })
        };
    }
}

// Mapping: Wi6→toolDispatcher, A→toolUseBlock, q→assistantMessage, K→canUseTool, Y→toolUseContext,
//          z→toolName, _→tool, dK→findTool, ng→getDynamicToolSet, p1→createUserMessage,
//          CF8→createCancelledToolResult, ZxY→toolExecutionOrchestrator, hq→getDisplayName,
//          PxY→getMcpServerType, WxY→getMcpServerBaseUrl, d→emitTelemetry, k→console.warn
```

---

## 2. toolExecutionOrchestrator (ZxY) - Queue-Based Execution

### What it does

Creates an `AsyncQueue` to buffer results from the execution pipeline, allowing streaming results to be yielded back to the agent loop while the pipeline continues executing.

### How it works

1. Create new AsyncQueue (Pi6) for result buffering
2. Call toolExecutionPipeline (fxY) with progress callback
3. Progress callback enqueues intermediate results to the queue
4. Pipeline completion enqueues all final results
5. Errors are enqueued as error results
6. Queue is marked done when pipeline completes

### Why this approach

- **AsyncQueue pattern** enables non-blocking streaming
- **Progress callback** allows real-time UI updates during long-running operations
- **Error handling** in the callback ensures errors don't crash the orchestrator

```javascript
// ============================================
// toolExecutionOrchestrator - Queue-based async execution
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
            ...O ? { requestId: O } : {},
            ...YF() ? (() => {
                let M = gb(A.name);
                return M ? { mcpServerName: M.serverName, mcpToolName: M.mcpToolName } : {}
            })() : {}
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
function toolExecutionOrchestrator(tool, toolUseId, input, toolUseContext,
                                    canUseTool, assistantMessage, messageId,
                                    requestId, mcpServerType, mcpServerBaseUrl) {
    // Create async queue for streaming results
    const queue = new AsyncQueue();

    // Execute pipeline with progress callback
    toolExecutionPipeline(
        tool, toolUseId, input, toolUseContext,
        canUseTool, assistantMessage, messageId,
        requestId, mcpServerType, mcpServerBaseUrl,
        // Progress callback
        (progressEvent) => {
            // Emit telemetry for progress
            emitTelemetry("tengu_tool_use_progress", {
                messageID: messageId,
                toolName: getDisplayName(tool.name),
                isMcp: tool.isMcp ?? false,
                queryChainId: toolUseContext.queryTracking?.chainId,
                queryDepth: toolUseContext.queryTracking?.depth,
                ...(mcpServerType ? { mcpServerType } : {}),
                ...(mcpServerBaseUrl ? { mcpServerBaseUrl } : {}),
                ...(requestId ? { requestId } : {}),
            });

            // Enqueue progress message
            queue.enqueue({
                message: createProgressMessage({
                    toolUseID: progressEvent.toolUseID,
                    parentToolUseID: toolUseId,
                    data: progressEvent.data
                })
            });
        }
    ).then((results) => {
        // Enqueue all final results
        for (const result of results) {
            queue.enqueue(result);
        }
    }).catch((error) => {
        // Enqueue error
        queue.error(error);
    }).finally(() => {
        // Mark queue as done
        queue.done();
    });

    // Return the queue (async iterable)
    return queue;
}

// Mapping: ZxY→toolExecutionOrchestrator, A→tool, q→toolUseId, K→input, Y→toolUseContext,
//          z→canUseTool, _→assistantMessage, w→messageId, O→requestId,
//          $→mcpServerType, H→mcpServerBaseUrl, Pi6→AsyncQueue,
//          fxY→toolExecutionPipeline, C4q→createProgressMessage, d→emitTelemetry
```

---

## 3. toolExecutionPipeline (fxY) - 8-Stage Pipeline

### What it does

Executes a tool through an 8-stage pipeline that validates input, runs hooks, checks permissions, executes the tool, and handles post-execution hooks.

### The 8 Stages

1. **Schema Validation** - Zod safeParse on input
2. **Custom Validation** - Tool-specific validateInput()
3. **Pre-tool Hooks** - Execute PreToolUse hooks
4. **Permission Check** - canUseTool with hook override support
5. **Tool Execution** - Call tool.call()
6. **Post-tool Hooks** - Execute PostToolUse hooks
7. **Post-failure Hooks** - Execute PostToolUseFailure hooks (on error)
8. **Result Formatting** - Build final result messages

### Key Algorithm: Permission Decision with Hook Override

```javascript
// ============================================
// Permission Decision Algorithm
// ============================================

// Pre-tool hook can provide permission override:
// - "allow": Skip user prompt, use updated input
// - "deny": Block execution, return error
// - "ask": Still prompt user, but with hook context

let hookPermissionResult;  // From pre-tool hooks

if (hookPermissionResult?.behavior === "allow") {
    // Hook approved - bypass permission check
    if (!tool.requiresUserInteraction?.()) {
        // Direct approval
        permissionResult = hookPermissionResult;
    } else {
        // Still need canUseTool for tools that require interaction
        permissionResult = await canUseTool(tool, updatedInput, ...);
    }
} else if (hookPermissionResult?.behavior === "deny") {
    // Hook denied - block execution
    permissionResult = hookPermissionResult;
} else if (hookPermissionResult?.behavior === "ask") {
    // Hook wants user to decide with context
    permissionResult = await canUseTool(tool, updatedInput, ..., hookPermissionResult);
} else {
    // No hook override - standard permission check
    permissionResult = await canUseTool(tool, input, ...);
}
```

```javascript
// ============================================
// toolExecutionPipeline - 8-stage execution
// Location: chunks.146.mjs:442-700
// ============================================

// ORIGINAL (for source lookup) - Stages 1-4:
async function fxY(A, q, K, Y, z, _, w, O, $, H, j) {
    // === STAGE 1: Schema Validation ===
    let J = A.inputSchema.safeParse(K);
    if (!J.success) {
        let u = V4q(A.name, J.error),
            I = GxY(A, Y.messages, Y.options.tools);
        if (I) d("tengu_deferred_tool_schema_not_sent", {
            toolName: hq(A.name),
            isMcp: A.isMcp ?? !1
        }), u += I;
        return [{
            message: p1({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>InputValidationError: ${u}</tool_use_error>`,
                    is_error: !0,
                    tool_use_id: q
                }],
                toolUseResult: `InputValidationError: ${J.error.message}`,
                sourceToolAssistantUUID: _.uuid
            })
        }];
    }

    // === STAGE 2: Custom Validation ===
    let M = await A.validateInput?.(J.data, Y);
    if (M?.result === !1) {
        return [{
            message: p1({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>${M.message}</tool_use_error>`,
                    is_error: !0,
                    tool_use_id: q
                }],
                toolUseResult: `Error: ${M.message}`,
                sourceToolAssistantUUID: _.uuid
            })
        }];
    }

    // Process input
    let X = J.data;

    // === STAGE 3: Pre-tool Hooks ===
    let P = !1, W, Z = [], G = Date.now();
    for await (let u of y4q(Y, A, X, q, _.message.id, O, $, H)) {
        switch (u.type) {
            case "message":
                if (u.message.message.type === "progress") j(u.message.message);
                else Z.push(u.message);
                break;
            case "hookPermissionResult":
                hookPermResult = u.hookPermissionResult;
                break;
            case "hookUpdatedInput":
                X = u.updatedInput;
                break;
            case "preventContinuation":
                P = u.shouldPreventContinuation;
                break;
            case "stopReason":
                W = u.stopReason;
                break;
            case "stop":
                return Z;  // Hook stopped execution
        }
    }

    // === STAGE 4: Permission Check ===
    let V;
    if (hookPermResult !== void 0 && hookPermResult.behavior === "allow"
        && !A.requiresUserInteraction?.() && !Y.requireCanUseTool) {
        // Hook approved, bypass permission check
        V = hookPermResult;
    } else if (hookPermResult !== void 0 && hookPermResult.behavior === "deny") {
        // Hook denied
        V = hookPermResult;
    } else {
        // Standard permission check
        let u = hookPermResult?.behavior === "ask" ? hookPermResult : void 0;
        if (hookPermResult?.behavior === "ask" && hookPermResult.updatedInput) {
            X = hookPermResult.updatedInput;
        }
        V = await z(A, X, Y, _, q, u);  // canUseTool
    }

    // Handle permission denial
    if (V.behavior !== "allow") {
        // ... return denied tool_result
    }

    // === STAGE 5: Tool Execution ===
    // ... (execute tool.call())

    // === STAGE 6: Post-tool Hooks ===
    // ... (execute k4q)

    // === STAGE 7: Post-failure Hooks (if error) ===
    // ... (execute E4q)

    // === STAGE 8: Result Formatting ===
    // ... (build final result)
}

// READABLE (for understanding):
async function toolExecutionPipeline(
    tool, toolUseId, input, toolUseContext,
    canUseTool, assistantMessage, messageId,
    requestId, mcpServerType, mcpServerBaseUrl,
    progressCallback
) {
    const results = [];

    // === STAGE 1: Schema Validation (Zod) ===
    const schemaResult = tool.inputSchema.safeParse(input);
    if (!schemaResult.success) {
        const errorMessage = formatSchemaError(tool.name, schemaResult.error);

        // Check for deferred tool schema hint
        const deferredHint = getDeferredToolSchemaHint(tool, toolUseContext.messages, toolUseContext.options.tools);
        if (deferredHint) {
            emitTelemetry("tengu_deferred_tool_schema_not_sent", {...});
            errorMessage += deferredHint;
        }

        return [createErrorToolResult(toolUseId, errorMessage, assistantMessage.uuid)];
    }

    // === STAGE 2: Custom Validation ===
    const customResult = await tool.validateInput?.(schemaResult.data, toolUseContext);
    if (customResult?.result === false) {
        return [createErrorToolResult(toolUseId, customResult.message, assistantMessage.uuid)];
    }

    let validatedInput = schemaResult.data;

    // === STAGE 3: Pre-tool Hooks ===
    let hookPermissionResult;
    let updatedInput = validatedInput;
    let shouldPreventContinuation = false;
    let stopReason;
    const preHookResults = [];

    for await (const hookEvent of executePreToolHooks(
        toolUseContext, tool, updatedInput, toolUseId,
        messageId, requestId, mcpServerType, mcpServerBaseUrl
    )) {
        switch (hookEvent.type) {
            case "message":
                if (hookEvent.message.message.type === "progress") {
                    progressCallback(hookEvent.message.message);
                } else {
                    preHookResults.push(hookEvent.message);
                }
                break;

            case "hookPermissionResult":
                hookPermissionResult = hookEvent.hookPermissionResult;
                break;

            case "hookUpdatedInput":
                updatedInput = hookEvent.updatedInput;
                break;

            case "preventContinuation":
                shouldPreventContinuation = hookEvent.shouldPreventContinuation;
                break;

            case "stopReason":
                stopReason = hookEvent.stopReason;
                break;

            case "stop":
                // Hook stopped execution
                return preHookResults;
        }
    }

    // === STAGE 4: Permission Check ===
    let permissionResult;

    if (hookPermissionResult?.behavior === "allow" &&
        !tool.requiresUserInteraction?.() &&
        !toolUseContext.requireCanUseTool) {
        // Hook approved - bypass permission check
        permissionResult = hookPermissionResult;
    } else if (hookPermissionResult?.behavior === "deny") {
        // Hook denied
        permissionResult = hookPermissionResult;
    } else {
        // Need to call canUseTool
        const askContext = hookPermissionResult?.behavior === "ask" ? hookPermissionResult : undefined;
        permissionResult = await canUseTool(
            tool, updatedInput, toolUseContext,
            assistantMessage, toolUseId, askContext
        );
    }

    // Handle permission denial
    if (permissionResult.behavior !== "allow") {
        const denialMessage = permissionResult.message ||
            (shouldPreventContinuation
                ? `Execution stopped by PreToolUse hook${stopReason ? `: ${stopReason}` : ""}`
                : "Permission denied");

        return [
            ...preHookResults,
            createDeniedToolResult(toolUseId, denialMessage, assistantMessage.uuid)
        ];
    }

    // Use updated input if provided
    if (permissionResult.updatedInput !== undefined) {
        updatedInput = permissionResult.updatedInput;
    }

    // === STAGE 5: Tool Execution ===
    let toolResult;
    try {
        toolResult = await tool.call(updatedInput, toolUseContext, progressCallback);
    } catch (error) {
        // === STAGE 7: Post-failure Hooks ===
        for await (const failureEvent of executePostToolFailureHooks(...)) {
            if (failureEvent.message) {
                results.push(failureEvent.message);
            }
        }

        // Re-throw for error handling
        throw error;
    }

    // === STAGE 6: Post-tool Hooks ===
    for await (const postEvent of executePostToolHooks(...)) {
        if (postEvent.message) {
            results.push(postEvent.message);
        }
    }

    // === STAGE 8: Result Formatting ===
    results.push(createToolResultMessage(toolResult, toolUseId, assistantMessage.uuid));

    return results;
}

// Mapping: fxY→toolExecutionPipeline, A→tool, q→toolUseId, K→input, Y→toolUseContext,
//          z→canUseTool, y4q→executePreToolHooks, k4q→executePostToolHooks,
//          E4q→executePostToolFailureHooks, V4q→formatSchemaError, p1→createUserMessage
```

---

## 4. executePreToolHooks (y4q) - Pre-tool Hook Execution

### What it does

Executes all PreToolUse hooks for a tool and yields streaming results including:
- Permission decisions (`hookPermissionResult`)
- Input modifications (`hookUpdatedInput`)
- Additional context (`additionalContext`)
- Blocking errors (`blockingError`)
- Continuation control (`preventContinuation`, `stop`)

### Hook Result Types

| Type | Purpose |
|------|---------|
| `hookPermissionResult` | Hook provided allow/deny/ask decision |
| `hookUpdatedInput` | Hook modified the tool input |
| `additionalContext` | Hook added context for LLM |
| `blockingError` | Hook blocked with error message |
| `preventContinuation` | Hook wants to stop after tool |
| `stopReason` | Custom stop message |
| `stop` | Immediate stop requested |

```javascript
// ============================================
// executePreToolHooks - Pre-tool hook execution
// Location: chunks.146.mjs:74-216
// ============================================

// ORIGINAL (for source lookup):
async function* y4q(A, q, K, Y, z, _, w, O) {
    let $ = Date.now();
    try {
        let H = A.getAppState();
        for await (let j of LF8(q.name, Y, K, A, H.toolPermissionContext.mode,
                               A.abortController.signal, void 0, A.requestPrompt,
                               q.getToolUseSummary?.(K))) {
            try {
                // Yield message if present
                if (j.message) yield { type: "message", message: { message: j.message } };

                // Yield blocking error
                if (j.blockingError) {
                    let J = yF8(`PreToolUse:${q.name}`, j.blockingError);
                    yield {
                        type: "hookPermissionResult",
                        hookPermissionResult: {
                            behavior: "deny",
                            message: J,
                            decisionReason: {
                                type: "hook",
                                hookName: `PreToolUse:${q.name}`,
                                reason: J
                            }
                        }
                    };
                }

                // Yield prevent continuation
                if (j.preventContinuation) {
                    yield { type: "preventContinuation", shouldPreventContinuation: true };
                    if (j.stopReason) yield { type: "stopReason", stopReason: j.stopReason };
                }

                // Yield permission behavior
                if (j.permissionBehavior !== void 0) {
                    let J = {
                        type: "hook",
                        hookName: `PreToolUse:${q.name}`,
                        hookSource: j.hookSource,
                        reason: j.hookPermissionDecisionReason
                    };
                    if (j.permissionBehavior === "allow") {
                        yield {
                            type: "hookPermissionResult",
                            hookPermissionResult: {
                                behavior: "allow",
                                updatedInput: j.updatedInput,
                                decisionReason: J
                            }
                        };
                    } else if (j.permissionBehavior === "ask") {
                        yield {
                            type: "hookPermissionResult",
                            hookPermissionResult: {
                                behavior: "ask",
                                updatedInput: j.updatedInput,
                                message: j.hookPermissionDecisionReason ||
                                    `Hook PreToolUse:${q.name} wants to ask about this tool`,
                                decisionReason: J
                            }
                        };
                    } else {
                        yield {
                            type: "hookPermissionResult",
                            hookPermissionResult: {
                                behavior: j.permissionBehavior,
                                message: j.hookPermissionDecisionReason ||
                                    `Hook PreToolUse:${q.name} ${describeBehavior(j.permissionBehavior)} this tool`,
                                decisionReason: J
                            }
                        };
                    }
                }

                // Yield updated input (without permission behavior)
                if (j.updatedInput && j.permissionBehavior === void 0) {
                    yield { type: "hookUpdatedInput", updatedInput: j.updatedInput };
                }

                // Yield additional context
                if (j.additionalContexts && j.additionalContexts.length > 0) {
                    yield {
                        type: "additionalContext",
                        message: {
                            message: createAttachmentMessage({
                                type: "hook_additional_context",
                                content: j.additionalContexts,
                                hookName: `PreToolUse:${q.name}`,
                                toolUseID: Y,
                                hookEvent: "PreToolUse"
                            })
                        }
                    };
                }

                // Check for abort
                if (A.abortController.signal.aborted) {
                    yield { type: "message", message: { message: createAttachmentMessage({
                        type: "hook_cancelled",
                        hookName: `PreToolUse:${q.name}`,
                        toolUseID: Y,
                        hookEvent: "PreToolUse"
                    })}};
                    yield { type: "stop" };
                    return;
                }
            } catch (J) {
                // Hook execution error
                reportError(J);
                yield {
                    type: "message",
                    message: {
                        message: createAttachmentMessage({
                            type: "hook_error_during_execution",
                            content: formatError(J),
                            hookName: `PreToolUse:${q.name}`,
                            toolUseID: Y,
                            hookEvent: "PreToolUse"
                        })
                    }
                };
                yield { type: "stop" };
            }
        }
    } catch (H) {
        reportError(H);
        yield { type: "stop" };
    }
}

// READABLE (for understanding):
async function* executePreToolHooks(
    toolUseContext, tool, input, toolUseId,
    messageId, requestId, mcpServerType, mcpServerBaseUrl
) {
    const startTime = Date.now();

    try {
        const appState = toolUseContext.getAppState();

        // Iterate over hook execution results
        for await (const hookResult of executeHooksForTool(
            tool.name, input, toolUseId, toolUseContext,
            appState.toolPermissionContext.mode,
            toolUseContext.abortController.signal,
            undefined,
            toolUseContext.requestPrompt,
            tool.getToolUseSummary?.(toolUseId)
        )) {
            try {
                // Yield message if present
                if (hookResult.message) {
                    yield { type: "message", message: { message: hookResult.message } };
                }

                // Yield blocking error as deny
                if (hookResult.blockingError) {
                    const formattedError = formatBlockingError(
                        `PreToolUse:${tool.name}`,
                        hookResult.blockingError
                    );
                    yield {
                        type: "hookPermissionResult",
                        hookPermissionResult: {
                            behavior: "deny",
                            message: formattedError,
                            decisionReason: {
                                type: "hook",
                                hookName: `PreToolUse:${tool.name}`,
                                reason: formattedError
                            }
                        }
                    };
                }

                // Yield prevent continuation
                if (hookResult.preventContinuation) {
                    yield { type: "preventContinuation", shouldPreventContinuation: true };
                    if (hookResult.stopReason) {
                        yield { type: "stopReason", stopReason: hookResult.stopReason };
                    }
                }

                // Yield permission behavior
                if (hookResult.permissionBehavior !== undefined) {
                    const decisionReason = {
                        type: "hook",
                        hookName: `PreToolUse:${tool.name}`,
                        hookSource: hookResult.hookSource,
                        reason: hookResult.hookPermissionDecisionReason
                    };

                    if (hookResult.permissionBehavior === "allow") {
                        yield {
                            type: "hookPermissionResult",
                            hookPermissionResult: {
                                behavior: "allow",
                                updatedInput: hookResult.updatedInput,
                                decisionReason
                            }
                        };
                    } else if (hookResult.permissionBehavior === "ask") {
                        yield {
                            type: "hookPermissionResult",
                            hookPermissionResult: {
                                behavior: "ask",
                                updatedInput: hookResult.updatedInput,
                                message: hookResult.hookPermissionDecisionReason ||
                                    `Hook wants to ask about this tool`,
                                decisionReason
                            }
                        };
                    } else {
                        yield {
                            type: "hookPermissionResult",
                            hookPermissionResult: {
                                behavior: hookResult.permissionBehavior,
                                message: hookResult.hookPermissionDecisionReason,
                                decisionReason
                            }
                        };
                    }
                }

                // Yield updated input (when no permission behavior)
                if (hookResult.updatedInput && hookResult.permissionBehavior === undefined) {
                    yield { type: "hookUpdatedInput", updatedInput: hookResult.updatedInput };
                }

                // Yield additional context
                if (hookResult.additionalContexts?.length > 0) {
                    yield {
                        type: "additionalContext",
                        message: {
                            message: createAttachmentMessage({
                                type: "hook_additional_context",
                                content: hookResult.additionalContexts,
                                hookName: `PreToolUse:${tool.name}`,
                                toolUseID: toolUseId,
                                hookEvent: "PreToolUse"
                            })
                        }
                    };
                }

                // Check for abort
                if (toolUseContext.abortController.signal.aborted) {
                    yield {
                        type: "message",
                        message: {
                            message: createAttachmentMessage({
                                type: "hook_cancelled",
                                hookName: `PreToolUse:${tool.name}`,
                                toolUseID: toolUseId,
                                hookEvent: "PreToolUse"
                            })
                        }
                    };
                    yield { type: "stop" };
                    return;
                }
            } catch (error) {
                reportError(error);
                yield {
                    type: "message",
                    message: {
                        message: createAttachmentMessage({
                            type: "hook_error_during_execution",
                            content: formatError(error),
                            hookName: `PreToolUse:${tool.name}`,
                            toolUseID: toolUseId,
                            hookEvent: "PreToolUse"
                        })
                    }
                };
                yield { type: "stop" };
            }
        }
    } catch (error) {
        reportError(error);
        yield { type: "stop" };
    }
}

// Mapping: y4q→executePreToolHooks, A→toolUseContext, q→tool, K→input, Y→toolUseId,
//          LF8→executeHooksForTool, yF8→formatBlockingError, f4→createAttachmentMessage
```

---

## 5. executePostToolFailureHooks (E4q) - Post-failure Hook Execution

### What it does

Executes PostToolUseFailure hooks when a tool throws an error. Yields error handling results including additional context and blocking errors.

```javascript
// ============================================
// executePostToolFailureHooks - Post-failure hook execution
// Location: chunks.146.mjs:3-72
// ============================================

// ORIGINAL (for source lookup):
async function* E4q(A, q, K, Y, z, _, w, O, $, H) {
    let j = Date.now();
    try {
        let M = A.getAppState().toolPermissionContext.mode;
        for await (let D of hF8(q.name, K, z, _, A, w, M, A.abortController.signal)) {
            try {
                // Handle hook cancelled
                if (D.message?.type === "attachment" && D.message.attachment.type === "hook_cancelled") {
                    yield {
                        message: createAttachmentMessage({
                            type: "hook_cancelled",
                            hookName: `PostToolUseFailure:${q.name}`,
                            toolUseID: K,
                            hookEvent: "PostToolUseFailure"
                        })
                    };
                    continue;
                }

                // Yield message
                if (D.message && !(D.message.type === "attachment" &&
                    D.message.attachment.type === "hook_blocking_error")) {
                    yield { message: D.message };
                }

                // Yield blocking error
                if (D.blockingError) {
                    yield {
                        message: createAttachmentMessage({
                            type: "hook_blocking_error",
                            hookName: `PostToolUseFailure:${q.name}`,
                            toolUseID: K,
                            hookEvent: "PostToolUseFailure",
                            blockingError: D.blockingError
                        })
                    };
                }

                // Yield additional context
                if (D.additionalContexts?.length > 0) {
                    yield {
                        message: createAttachmentMessage({
                            type: "hook_additional_context",
                            content: D.additionalContexts,
                            hookName: `PostToolUseFailure:${q.name}`,
                            toolUseID: K,
                            hookEvent: "PostToolUseFailure"
                        })
                    };
                }
            } catch (X) {
                // Hook error - yield error message
                yield {
                    message: createAttachmentMessage({
                        type: "hook_error_during_execution",
                        content: formatError(X),
                        hookName: `PostToolUseFailure:${q.name}`,
                        toolUseID: K,
                        hookEvent: "PostToolUseFailure"
                    })
                };
            }
        }
    } catch (J) {
        reportError(J);
    }
}

// READABLE (for understanding):
async function* executePostToolFailureHooks(
    toolUseContext, tool, toolUseId, errorMessage,
    error, assistantMessage, messageId, requestId,
    mcpServerType, mcpServerBaseUrl
) {
    const startTime = Date.now();

    try {
        const mode = toolUseContext.getAppState().toolPermissionContext.mode;

        // Execute all PostToolUseFailure hooks
        for await (const hookResult of executeFailureHooks(
            tool.name, toolUseId, error, errorMessage,
            toolUseContext, messageId, mode,
            toolUseContext.abortController.signal
        )) {
            try {
                // Handle hook cancelled
                if (hookResult.message?.type === "attachment" &&
                    hookResult.message.attachment.type === "hook_cancelled") {
                    yield {
                        message: createAttachmentMessage({
                            type: "hook_cancelled",
                            hookName: `PostToolUseFailure:${tool.name}`,
                            toolUseID: toolUseId,
                            hookEvent: "PostToolUseFailure"
                        })
                    };
                    continue;
                }

                // Yield message (unless it's a blocking error attachment)
                if (hookResult.message &&
                    !(hookResult.message.type === "attachment" &&
                      hookResult.message.attachment.type === "hook_blocking_error")) {
                    yield { message: hookResult.message };
                }

                // Yield blocking error
                if (hookResult.blockingError) {
                    yield {
                        message: createAttachmentMessage({
                            type: "hook_blocking_error",
                            hookName: `PostToolUseFailure:${tool.name}`,
                            toolUseID: toolUseId,
                            hookEvent: "PostToolUseFailure",
                            blockingError: hookResult.blockingError
                        })
                    };
                }

                // Yield additional context
                if (hookResult.additionalContexts?.length > 0) {
                    yield {
                        message: createAttachmentMessage({
                            type: "hook_additional_context",
                            content: hookResult.additionalContexts,
                            hookName: `PostToolUseFailure:${tool.name}`,
                            toolUseID: toolUseId,
                            hookEvent: "PostToolUseFailure"
                        })
                    };
                }
            } catch (hookError) {
                // Hook execution failed
                yield {
                    message: createAttachmentMessage({
                        type: "hook_error_during_execution",
                        content: formatError(hookError),
                        hookName: `PostToolUseFailure:${tool.name}`,
                        toolUseID: toolUseId,
                        hookEvent: "PostToolUseFailure"
                    })
                };
            }
        }
    } catch (error) {
        reportError(error);
    }
}

// Mapping: E4q→executePostToolFailureHooks, A→toolUseContext, q→tool, K→toolUseId,
//          Y→errorMessage, z→error, _→assistantMessage, w→messageId,
//          hF8→executeFailureHooks, f4→createAttachmentMessage, _6→reportError
```

---

## Permission Decision Algorithm

### Deep Dive: How Permissions Work with Hooks

```
┌─────────────────────────────────────────────────────────────────────┐
│                 PERMISSION DECISION FLOW                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Pre-tool Hooks executed (y4q)                                       │
│       │                                                               │
│       ▼                                                               │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Check hookPermissionResult                                   │    │
│  │                                                               │    │
│  │ behavior === "allow" && !requiresUserInteraction?            │    │
│  │     └─→ YES: Skip canUseTool, use updatedInput              │    │
│  │     └─→ NO: Check if requiresUserInteraction                 │    │
│  │                                                               │    │
│  │ behavior === "deny"?                                          │    │
│  │     └─→ YES: Return denied result immediately               │    │
│  │                                                               │    │
│  │ behavior === "ask"?                                           │    │
│  │     └─→ Call canUseTool with hook context for dialog        │    │
│  │                                                               │    │
│  │ behavior === undefined?                                       │    │
│  │     └─→ Call canUseTool normally                             │    │
│  └─────────────────────────────────────────────────────────────┘    │
│       │                                                               │
│       ▼                                                               │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ canUseTool (permission check)                                │    │
│  │                                                               │    │
│  │ 1. Check auto-allow rules                                    │    │
│  │    ├─ isReadOnly() tool                                      │    │
│  │    ├─ allowedTools permission                                │    │
│  │    └─ isConcurrencySafe() tool                               │    │
│  │                                                               │    │
│  │ 2. Check permission rules from settings                      │    │
│  │    └─ Apply allow/deny patterns                              │    │
│  │                                                               │    │
│  │ 3. If no auto-allow: Prompt user                             │    │
│  │    ├─ "Yes, always" → Add to allowed                         │    │
│  │    ├─ "Yes, this time" → Allow once                          │    │
│  │    ├─ "No, this time" → Deny once                            │    │
│  │    └─ "No, always" → Add to denied                           │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Trade-offs in Permission Design

**Why hooks can override permissions:**
- Enables automated workflows where trusted scripts pre-approve operations
- Allows CI/CD integration with pre-configured permissions
- Supports "smart" permission systems that learn from context

**Why some tools still require user interaction:**
- Tools like `AskUserQuestion` must show UI to collect input
- Prevents hook bypass for tools that fundamentally need user input
- Safety mechanism for sensitive operations

---

## Cross-Module Integration

### Tools ↔ System Reminder (04)

Tool execution generates these attachment types:
- `progress` - Tool progress updates (streaming)
- `hook_additional_context` - Pre-hook context injection
- `hook_blocking_error` - Hook denial message
- `task_status` - Background task changes
- `permission_decision` - Permission flow results
- `hook_stopped_continuation` - Hook stopped execution
- `structured_output` - Tool returned structured data

### Tools ↔ MCP (06)

- MCP tools discovered via `fetchMcpTools` (JE)
- MCP tool names prefixed with `mcp__serverName__toolName`
- MCP tool execution routes through standard pipeline
- Session recovery retry for `McpSessionLostError`

### Tools ↔ Hooks (11)

- **PreToolUse**: Can block, modify input, bypass permission
- **PostToolUse**: Can modify output, add attachments
- **PostToolUseFailure**: Handles tool execution errors

### Tools ↔ Plan Mode (12)

- Plan mode restricts available tools
- Only `isReadOnly()` tools allowed
- `Write`/`Edit` allowed only to plan file path
- `ExitPlanMode` is the only programmatic exit