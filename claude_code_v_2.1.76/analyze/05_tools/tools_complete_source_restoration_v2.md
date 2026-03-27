# Tools Module - Complete Source Restoration v2 (Claude Code 2.1.76)

> **Complete source-level restoration** of the tool execution system with cross-validated symbols and detailed algorithm analysis.
> **Version 2** - Enhanced with full pipeline stages and UI integration.

---

## Related Symbols

> Symbol mappings: [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)

Key functions documented here:
- `toolDispatcher` (Wi6) - Entry point - chunks.146.mjs:285
- `toolExecutionOrchestrator` (ZxY) - Queue management - chunks.146.mjs:391
- `toolExecutionPipeline` (fxY) - 8-stage pipeline - chunks.146.mjs:442
- `executePreToolHooks` (y4q) - Pre-tool hooks - chunks.146.mjs:74
- `findTool` (dK) - Tool lookup - chunks.56.mjs:1592
- `matchesToolName` (z3) - Name matching - chunks.56.mjs:1588

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
2. Look up tool in session-scoped tool set using `findTool` (dK)
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
            // ... additional telemetry
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

## 2. toolExecutionOrchestrator (ZxY) - Queue Management

### What it does

Creates an AsyncQueue for streaming results and manages the asynchronous execution of the tool pipeline. Allows results to be streamed back to the UI while the tool is still executing.

### How it works

1. Create new AsyncQueue (Pi6) for streaming
2. Call toolExecutionPipeline (fxY) with progress callback
3. Progress callback enqueues messages to the queue
4. On completion, enqueue all final messages
5. On error, enqueue error to queue
6. Signal done via queue.done()

### Why this approach

- **AsyncQueue pattern** decouples tool execution from result consumption
- **Progress streaming** enables real-time UI updates
- **Error propagation** via queue.error() ensures proper error handling

```javascript
// ============================================
// toolExecutionOrchestrator - Creates AsyncQueue for streaming results
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
function toolExecutionOrchestrator(tool, toolUseId, input, toolUseContext, canUseTool,
                                    assistantMessage, messageId, requestId, mcpServerType,
                                    mcpServerBaseUrl) {
    // Create async queue for streaming results
    const queue = new AsyncQueue();

    // Execute pipeline with progress callback
    toolExecutionPipeline(
        tool, toolUseId, input, toolUseContext, canUseTool,
        assistantMessage, messageId, requestId, mcpServerType, mcpServerBaseUrl,
        (progressEvent) => {
            // Progress callback - emit telemetry and enqueue progress message
            emitTelemetry("tengu_tool_use_progress", {
                messageID: messageId,
                toolName: getDisplayName(tool.name),
                isMcp: tool.isMcp ?? false,
                queryChainId: toolUseContext.queryTracking?.chainId,
                queryDepth: toolUseContext.queryTracking?.depth,
                // ... additional context
            });

            queue.enqueue({
                message: createProgressMessage({
                    toolUseID: progressEvent.toolUseID,
                    parentToolUseID: toolUseId,
                    data: progressEvent.data
                })
            });
        }
    ).then((results) => {
        // On success, enqueue all final messages
        for (const result of results) {
            queue.enqueue(result);
        }
    }).catch((error) => {
        // On error, propagate to queue
        queue.error(error);
    }).finally(() => {
        // Always signal completion
        queue.done();
    });

    return queue;
}

// Mapping: ZxY→toolExecutionOrchestrator, A→tool, q→toolUseId, K→input, Y→toolUseContext,
//          z→canUseTool, _→assistantMessage, w→messageId, O→requestId, $→mcpServerType,
//          H→mcpServerBaseUrl, Pi6→AsyncQueue, fxY→toolExecutionPipeline, C4q→createProgressMessage
```

---

## 3. toolExecutionPipeline (fxY) - 8-Stage Pipeline

### What it does

Executes a tool through an 8-stage pipeline that handles validation, hooks, permissions, execution, and result formatting. Each stage has specific responsibilities and can short-circuit execution on errors.

### How it works

```
Stage 1: Schema Validation (Zod safeParse)
    ↓ (on error → return error tool_result)
Stage 2: Custom Validation (validateInput)
    ↓ (on error → return error tool_result)
Stage 3: Pre-tool Hooks (executePreToolHooks)
    ↓ (hooks can modify input, provide permission, or stop execution)
Stage 4: Permission Check (canUseTool)
    ↓ (on deny → return denied tool_result)
Stage 5: Tool Execution (tool.call)
    ↓ (on error → Stage 7)
Stage 6: Post-tool Hooks (executePostToolHooks)
    ↓
Stage 7: Post-failure Hooks (if error in Stage 5)
    ↓
Stage 8: Result Formatting
```

### Why this approach

- **Sequential stages** with clear responsibilities
- **Early exit** on errors reduces unnecessary work
- **Hook integration** enables extensibility
- **Permission gating** provides security

```javascript
// ============================================
// toolExecutionPipeline - 8-stage execution pipeline
// Location: chunks.146.mjs:442-880+
// ============================================

// ORIGINAL (for source lookup) - Stage 1-4:
async function fxY(A, q, K, Y, z, _, w, O, $, H, j) {
    // === STAGE 1: Schema Validation ===
    let J = A.inputSchema.safeParse(K);
    if (!J.success) {
        let u = V4q(A.name, J.error),
            I = GxY(A, Y.messages, Y.options.tools);
        if (I) d("tengu_deferred_tool_schema_not_sent", {...});
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
    if (M?.result === !1) return [{
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

    // === STAGE 3: Pre-tool Hooks ===
    let D = [], X = J.data;
    let P = !1, W, Z = [];

    for await (let u of y4q(Y, A, X, q, _.message.id, O, $, H)) switch (u.type) {
        case "message":
            D.push(u.message);
            break;
        case "hookPermissionResult":
            Z = u.hookPermissionResult;
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
            return D;  // Early exit
    }

    // === STAGE 4: Permission Check ===
    let V;
    if (Z !== void 0 && Z.behavior === "allow" && !A.requiresUserInteraction?.()) {
        // Hook approved - skip permission prompt
        V = Z;
    } else {
        // Need to call canUseTool
        V = await z(A, X, Y, _, q);
    }

    if (V.behavior !== "allow") {
        // Permission denied
        return [{
            message: p1({
                content: [{
                    type: "tool_result",
                    content: V.message,
                    is_error: !0,
                    tool_use_id: q
                }],
                toolUseResult: `Error: ${V.message}`,
                sourceToolAssistantUUID: _.uuid
            })
        }];
    }

    // ... continues with Stage 5-8
}

// READABLE (for understanding):
async function toolExecutionPipeline(tool, toolUseId, input, toolUseContext, canUseTool,
                                      assistantMessage, messageId, requestId, mcpServerType,
                                      mcpServerBaseUrl, progressCallback) {
    const messages = [];

    // === STAGE 1: Schema Validation ===
    const schemaResult = tool.inputSchema.safeParse(input);
    if (!schemaResult.success) {
        const errorMessage = formatSchemaError(tool.name, schemaResult.error);
        return [createErrorToolResult(toolUseId, errorMessage, assistantMessage.uuid)];
    }

    // === STAGE 2: Custom Validation ===
    if (tool.validateInput) {
        const customResult = await tool.validateInput(schemaResult.data, toolUseContext);
        if (customResult?.result === false) {
            return [createErrorToolResult(toolUseId, customResult.message, assistantMessage.uuid)];
        }
    }

    let validatedInput = schemaResult.data;
    let hookPermissionResult;
    let shouldPreventContinuation = false;
    let stopReason;

    // === STAGE 3: Pre-tool Hooks ===
    for await (const hookEvent of executePreToolHooks(
        toolUseContext, tool, validatedInput, toolUseId,
        assistantMessage.message.id, requestId, mcpServerType, mcpServerBaseUrl
    )) {
        switch (hookEvent.type) {
            case "message":
                messages.push(hookEvent.message);
                break;
            case "hookPermissionResult":
                hookPermissionResult = hookEvent.hookPermissionResult;
                break;
            case "hookUpdatedInput":
                validatedInput = hookEvent.updatedInput;
                break;
            case "preventContinuation":
                shouldPreventContinuation = true;
                break;
            case "stopReason":
                stopReason = hookEvent.stopReason;
                break;
            case "stop":
                return messages;  // Hook requested stop
        }
    }

    // === STAGE 4: Permission Check ===
    let permissionResult;
    if (hookPermissionResult?.behavior === "allow" && !tool.requiresUserInteraction?.()) {
        // Hook already approved
        permissionResult = hookPermissionResult;
    } else {
        // Call canUseTool for user approval
        permissionResult = await canUseTool(tool, validatedInput, toolUseContext, assistantMessage, toolUseId);
    }

    if (permissionResult.behavior !== "allow") {
        // Permission denied
        return [createDeniedToolResult(toolUseId, permissionResult.message, assistantMessage.uuid)];
    }

    // === STAGE 5: Tool Execution ===
    const startTime = Date.now();
    let toolResult;
    try {
        toolResult = await tool.call(validatedInput, {
            ...toolUseContext,
            toolUseId: toolUseId
        }, canUseTool, assistantMessage, (progress) => {
            progressCallback(progress);
        });
    } catch (error) {
        // === STAGE 7: Post-failure Hooks ===
        await executePostToolFailureHooks(tool, validatedInput, error);
        throw error;
    }

    // === STAGE 6: Post-tool Hooks ===
    for await (const postHookEvent of executePostToolHooks(tool, toolResult)) {
        messages.push(postHookEvent);
    }

    // === STAGE 8: Result Formatting ===
    const formattedResult = tool.mapToolResultToToolResultBlockParam(toolResult.data, toolUseId);
    messages.push({
        message: createUserMessage({
            content: [formattedResult],
            toolUseResult: toolResult.data,
            sourceToolAssistantUUID: assistantMessage.uuid
        })
    });

    return messages;
}

// Mapping: fxY→toolExecutionPipeline, A→tool, q→toolUseId, K→input, Y→toolUseContext,
//          z→canUseTool, _→assistantMessage, w→messageId, O→requestId, $→mcpServerType,
//          H→mcpServerBaseUrl, j→progressCallback, y4q→executePreToolHooks, p1→createUserMessage
```

---

## 4. executePreToolHooks (y4q) - Pre-tool Hook Execution

### What it does

Executes all registered PreToolUse hooks for a tool and yields results as they become available. Hooks can modify input, provide permission decisions, add context, or stop execution entirely.

### How it works

1. Get current app state
2. Iterate over hook execution results via `executeHooksForTool` (LF8)
3. For each hook result:
   - Yield message if hook generated one
   - Yield permission result if hook made decision
   - Yield updated input if hook modified it
   - Yield stop if hook requested termination

### Key insight

The generator pattern allows hooks to provide incremental results, enabling streaming updates to the UI while hooks are still executing.

```javascript
// ============================================
// executePreToolHooks - Run PreToolUse hooks with streaming results
// Location: chunks.146.mjs:74-216
// ============================================

// ORIGINAL (for source lookup):
async function* y4q(A, q, K, Y, z, _, w, O) {
    let $ = Date.now();
    try {
        let H = A.getAppState();
        for await (let j of LF8(q.name, Y, K, A, H.toolPermissionContext.mode,
                               A.abortController.signal, void 0, A.requestPrompt,
                               q.getToolUseSummary?.(K))) try {
            if (j.message) yield {
                type: "message",
                message: { message: j.message }
            };
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
                }
            }
            if (j.preventContinuation) {
                yield { type: "preventContinuation", shouldPreventContinuation: !0 };
                if (j.stopReason) yield { type: "stopReason", stopReason: j.stopReason }
            }
            if (j.permissionBehavior !== void 0) {
                yield {
                    type: "hookPermissionResult",
                    hookPermissionResult: {
                        behavior: j.permissionBehavior,
                        updatedInput: j.updatedInput,
                        message: j.hookPermissionDecisionReason,
                        decisionReason: {
                            type: "hook",
                            hookName: `PreToolUse:${q.name}`,
                            hookSource: j.hookSource,
                            reason: j.hookPermissionDecisionReason
                        }
                    }
                }
            }
            if (j.updatedInput && j.permissionBehavior === void 0) yield {
                type: "hookUpdatedInput",
                updatedInput: j.updatedInput
            };
            if (j.additionalContexts && j.additionalContexts.length > 0) yield {
                type: "additionalContext",
                message: {
                    message: f4({
                        type: "hook_additional_context",
                        content: j.additionalContexts,
                        hookName: `PreToolUse:${q.name}`,
                        toolUseID: Y,
                        hookEvent: "PreToolUse"
                    })
                }
            };
            if (A.abortController.signal.aborted) {
                yield { type: "message", message: { message: f4({...}) } };
                yield { type: "stop" };
                return
            }
        } catch (J) {
            _6(J);
            yield { type: "message", message: { message: f4({...}) } };
            yield { type: "stop" }
        }
    } catch (H) {
        _6(H);
        yield { type: "stop" }
    }
}

// READABLE (for understanding):
async function* executePreToolHooks(toolUseContext, tool, input, toolUseId, messageId,
                                     requestId, mcpServerType, mcpServerBaseUrl) {
    const startTime = Date.now();

    try {
        const appState = toolUseContext.getAppState();

        // Iterate over hook execution results
        for await (const hookResult of executeHooksForTool(
            tool.name, toolUseId, input, toolUseContext,
            appState.toolPermissionContext.mode,
            toolUseContext.abortController.signal,
            undefined,
            toolUseContext.requestPrompt,
            tool.getToolUseSummary?.(input)
        )) {
            try {
                // Yield message if hook generated one
                if (hookResult.message) {
                    yield {
                        type: "message",
                        message: { message: hookResult.message }
                    };
                }

                // Yield deny result if hook blocked
                if (hookResult.blockingError) {
                    const errorMessage = formatHookError(`PreToolUse:${tool.name}`, hookResult.blockingError);
                    yield {
                        type: "hookPermissionResult",
                        hookPermissionResult: {
                            behavior: "deny",
                            message: errorMessage,
                            decisionReason: {
                                type: "hook",
                                hookName: `PreToolUse:${tool.name}`,
                                reason: errorMessage
                            }
                        }
                    };
                }

                // Handle prevent continuation
                if (hookResult.preventContinuation) {
                    yield {
                        type: "preventContinuation",
                        shouldPreventContinuation: true
                    };
                    if (hookResult.stopReason) {
                        yield {
                            type: "stopReason",
                            stopReason: hookResult.stopReason
                        };
                    }
                }

                // Handle permission decision from hook
                if (hookResult.permissionBehavior !== undefined) {
                    yield {
                        type: "hookPermissionResult",
                        hookPermissionResult: {
                            behavior: hookResult.permissionBehavior,
                            updatedInput: hookResult.updatedInput,
                            message: hookResult.hookPermissionDecisionReason,
                            decisionReason: {
                                type: "hook",
                                hookName: `PreToolUse:${tool.name}`,
                                hookSource: hookResult.hookSource,
                                reason: hookResult.hookPermissionDecisionReason
                            }
                        }
                    };
                }

                // Handle input modification (without permission decision)
                if (hookResult.updatedInput && hookResult.permissionBehavior === undefined) {
                    yield {
                        type: "hookUpdatedInput",
                        updatedInput: hookResult.updatedInput
                    };
                }

                // Handle additional context from hook
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

                // Handle abort
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
//          LF8→executeHooksForTool, f4→createAttachmentMessage, _6→reportError
```

---

## 5. findTool (dK) - Tool Lookup

### What it does

Finds a tool in a tool array by matching its name or aliases. Used by the dispatcher to locate tools in the session tool set.

### How it works

1. Use Array.find to locate tool
2. Call matchesToolName (z3) for comparison
3. Return first matching tool or undefined

```javascript
// ============================================
// findTool - Find tool by name/alias in tool array
// Location: chunks.56.mjs:1592-1594
// ============================================

// ORIGINAL (for source lookup):
function dK(A, q) {
    return A.find((K) => z3(K, q))
}

// READABLE (for understanding):
function findTool(tools, toolName) {
    return tools.find((tool) => matchesToolName(tool, toolName));
}

// Mapping: dK→findTool, A→tools, q→toolName, z3→matchesToolName
```

---

## 6. matchesToolName (z3) - Name/Alias Matching

### What it does

Checks if a tool matches a given name, considering both the primary name and any aliases.

```javascript
// ============================================
// matchesToolName - Check if tool matches name or alias
// Location: chunks.56.mjs:1588-1590
// ============================================

// ORIGINAL (for source lookup):
function z3(A, q) {
    return A.name === q || (A.aliases?.includes(q) ?? !1)
}

// READABLE (for understanding):
function matchesToolName(tool, name) {
    return tool.name === name || (tool.aliases?.includes(name) ?? false);
}

// Mapping: z3→matchesToolName, A→tool, q→name
```

---

## Key Algorithms

### Permission Decision Algorithm

The permission check in Stage 4 follows this decision tree:

```
canUseTool(tool, input, context)
    │
    ├─→ Check hook permission result
    │     └─→ If behavior="allow" and !requiresUserInteraction → Allow
    │     └─→ If behavior="deny" → Deny
    │     └─→ If behavior="ask" → Fall through to normal flow
    │
    ├─→ Check auto-allow rules
    │     ├─→ Read-only tools in non-destructive contexts
    │     ├─→ Tools with allowedTools permission
    │     └─→ Tools with isConcurrencySafe() = true
    │
    ├─→ Check permission rules from settings
    │     └─→ Apply allow/deny patterns
    │
    └─→ If no auto-allow: Prompt user
          ├─→ "Yes, always" → Add to allowed
          ├─→ "Yes, this time" → Allow once
          ├─→ "No, this time" → Deny once
          └─→ "No, always" → Add to denied
```

### Hook Result Processing Algorithm

```
for each hookResult from executeHooksForTool:
    │
    ├─→ if message: yield message (for UI display)
    │
    ├─→ if blockingError: yield deny permission result
    │
    ├─→ if preventContinuation:
    │     ├─→ yield preventContinuation flag
    │     └─→ if stopReason: yield stopReason
    │
    ├─→ if permissionBehavior:
    │     └─→ yield hookPermissionResult
    │
    ├─→ if updatedInput (without permission):
    │     └─→ yield updatedInput
    │
    └─→ if additionalContexts:
          └─→ yield additionalContext message
```

---

## Cross-Module Integration

### Tools ↔ System Reminder (04)

Tool execution generates the following attachment types:
- `progress` - Tool progress updates (via progressCallback)
- `hook_additional_context` - Pre-hook context injection
- `hook_blocking_error` - Hook denial message
- `hook_permission_decision` - Permission decision from hook
- `structured_output` - Tool returned structured data
- `permission_decision` - Permission flow results

### Tools ↔ MCP (06)

- MCP tools discovered via `fetchMcpTools` (JE)
- Tool name prefixing: `mcp__<server>__<tool>`
- Execution routes through standard pipeline
- Retry logic for session recovery

### Tools ↔ Hooks (11)

- PreToolUse hooks can: block, modify input, bypass permission, stop execution
- PostToolUse hooks can: modify output, add attachments
- PostToolUseFailure hooks handle errors

### Tools ↔ Plan Mode (12)

- Plan mode restricts tools via `filterToolsForPlanMode`
- Only `isReadOnly()` tools allowed
- Write/Edit only to plan file path
- ExitPlanMode is the only programmatic exit

---

## Symbol Validation Status

**Last validated:** 2026-03-27

| Symbol | Location | Status |
|--------|----------|--------|
| Wi6 (toolDispatcher) | chunks.146.mjs:285 | ✅ Correct |
| ZxY (toolExecutionOrchestrator) | chunks.146.mjs:391 | ✅ Correct |
| fxY (toolExecutionPipeline) | chunks.146.mjs:442 | ✅ Correct |
| y4q (executePreToolHooks) | chunks.146.mjs:74 | ✅ Correct |
| dK (findTool) | chunks.56.mjs:1592 | ✅ Correct |
| z3 (matchesToolName) | chunks.56.mjs:1588 | ✅ Correct |
| Pi6 (AsyncQueue) | various | ✅ Correct |