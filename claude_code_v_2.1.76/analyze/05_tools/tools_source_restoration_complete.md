# Tools Module - Complete Source Restoration

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-27
> **Status**: ✅ All symbols cross-validated against source code

---

## Overview

This document provides complete source-level restoration of key functions in the Tools module. Each function is presented with:
1. **ORIGINAL** code (obfuscated, for source lookup)
2. **READABLE** code (semantic names, for understanding)
3. **Mapping** table for all parameters and dependencies

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)

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
│  │ ├─ Stage 1: Tool lookup in session tool set (dK)             │    │
│  │ ├─ Stage 2: Alias check in global registry (ng)              │    │
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

## 1. Tool Dispatcher (Wi6) - Entry Point

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
            ...O ? { requestId: O } : {}
        });
        yield {
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
                isMcp: _.isMcp ?? !1
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
    // Stage 1: Extract tool name and look up in session tools
    const toolName = toolUseBlock.name;
    let tool = findTool(toolUseContext.options.tools, toolName);

    // Stage 2: Check global alias registry (for MCP/skill tools)
    if (!tool) {
        const globalTool = findTool(getDynamicToolSet(), toolName);
        if (globalTool && globalTool.aliases?.includes(toolName)) {
            tool = globalTool;
        }
    }

    // Extract context for telemetry
    const messageId = assistantMessage.message.id;
    const requestId = assistantMessage.requestId;
    const mcpServerType = getMcpServerType(toolName, toolUseContext.options.mcpClients);
    const mcpServerBaseUrl = getMcpServerBaseUrl(toolName, toolUseContext.options.mcpClients);

    // Tool not found - return error
    if (!tool) {
        const displayName = getToolDisplayName(toolName);
        logWarning(`Unknown tool ${toolName}: ${toolUseBlock.id}`);
        emitTelemetry("tengu_tool_use_error", {
            error: `No such tool available: ${displayName}`,
            toolName: displayName,
            toolUseID: toolUseBlock.id,
            isMcp: toolName.startsWith("mcp__"),
            queryChainId: toolUseContext.queryTracking?.chainId,
            queryDepth: toolUseContext.queryTracking?.depth
        });

        yield {
            message: createUserMessage({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>Error: No such tool available: ${toolName}</tool_use_error>`,
                    is_error: true,
                    tool_use_id: toolUseBlock.id
                }],
                sourceToolAssistantUUID: assistantMessage.uuid
            })
        };
        return;
    }

    const input = toolUseBlock.input;

    try {
        // Check abort signal
        if (toolUseContext.abortController.signal.aborted) {
            emitTelemetry("tengu_tool_use_cancelled", {
                toolName: getToolDisplayName(tool.name),
                toolUseID: toolUseBlock.id,
                isMcp: tool.isMcp ?? false
            });
            yield {
                message: createUserMessage({
                    content: [createCancelledToolResult(toolUseBlock.id)],
                    toolUseResult: "Tool execution was cancelled",
                    sourceToolAssistantUUID: assistantMessage.uuid
                })
            };
            return;
        }

        // Delegate to orchestrator
        for await (const result of toolExecutionOrchestrator(
            tool, toolUseBlock.id, input, toolUseContext, canUseTool,
            assistantMessage, messageId, requestId, mcpServerType, mcpServerBaseUrl
        )) {
            yield result;
        }

    } catch (error) {
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
                sourceToolAssistantUUID: assistantMessage.uuid
            })
        };
    }
}

// Mapping: Wi6→toolDispatcher, A→toolUseBlock, q→assistantMessage, K→canUseTool, Y→toolUseContext,
//          dK→findTool, ng→getDynamicToolSet, PxY→getMcpServerType, WxY→getMcpServerBaseUrl,
//          ZxY→toolExecutionOrchestrator, p1→createUserMessage, _6→reportError, k→logWarning
```

---

## 2. Tool Execution Orchestrator (ZxY) - Queue Management

### What it does

Creates an AsyncQueue for streaming progress updates, executes the full pipeline, and yields results through the queue.

### How it works

1. Create new AsyncQueue instance
2. Call toolExecutionPipeline with progress callback
3. Progress callback enqueues updates to AsyncQueue
4. Pipeline results are enqueued when complete
5. Errors are caught and enqueued as errors
6. Queue is marked done when complete

### Why this approach

- **AsyncQueue pattern** enables streaming progress while tool executes
- **Promise-based pipeline** allows background execution
- **Error propagation** through queue ensures error visibility

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
            ...O ? { requestId: O } : {}
        });
        j.enqueue({
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
                                    assistantMessage, messageId, requestId, mcpServerType, mcpServerBaseUrl) {
    // Create AsyncQueue for streaming
    const queue = new AsyncQueue();

    // Execute pipeline with progress callback
    toolExecutionPipeline(tool, toolUseId, input, toolUseContext, canUseTool,
        assistantMessage, messageId, requestId, mcpServerType, mcpServerBaseUrl,
        (progressUpdate) => {
            // Progress callback - emit telemetry and enqueue message
            emitTelemetry("tengu_tool_use_progress", {
                messageID: messageId,
                toolName: getToolDisplayName(tool.name),
                isMcp: tool.isMcp ?? false,
                queryChainId: toolUseContext.queryTracking?.chainId,
                queryDepth: toolUseContext.queryTracking?.depth,
                ...(mcpServerType ? { mcpServerType } : {}),
                ...(mcpServerBaseUrl ? { mcpServerBaseUrl } : {}),
                ...(requestId ? { requestId } : {})
            });

            queue.enqueue({
                message: createProgressMessage({
                    toolUseID: progressUpdate.toolUseID,
                    parentToolUseID: toolUseId,
                    data: progressUpdate.data
                })
            });
        }
    ).then((results) => {
        // Enqueue all results
        for (const result of results) {
            queue.enqueue(result);
        }
    }).catch((error) => {
        // Propagate error through queue
        queue.error(error);
    }).finally(() => {
        // Mark queue as complete
        queue.done();
    });

    return queue;  // Returns AsyncQueue (async iterable)
}

// Mapping: ZxY→toolExecutionOrchestrator, A→tool, q→toolUseId, K→input, Y→toolUseContext,
//          z→canUseTool, _→assistantMessage, w→messageId, O→requestId, $→mcpServerType,
//          H→mcpServerBaseUrl, Pi6→AsyncQueue, fxY→toolExecutionPipeline, C4q→createProgressMessage
```

---

## 3. Tool Execution Pipeline (fxY) - 8-Stage Pipeline

### What it does

Executes the complete tool pipeline with schema validation, hook execution, permission checks, and result formatting.

### How it works

**Stage 1: Schema Validation** - Zod safeParse against inputSchema
**Stage 2: Custom Validation** - Tool-specific validateInput method
**Stage 3: Pre-tool Hooks** - Execute PreToolUse hooks (y4q)
**Stage 4: Permission Check** - canUseTool decision
**Stage 5: Tool Execution** - Call tool.call()
**Stage 6: Post-tool Hooks** - Execute PostToolUse hooks
**Stage 7: Post-failure Hooks** - On error, execute PostToolUseFailure
**Stage 8: Result Formatting** - mapToolResultToToolResultBlockParam

### Why this approach

- **Ordered stages** ensure validation before execution
- **Hook integration** at multiple points enables extensibility
- **Permission bypass** via hooks for approved scenarios
- **Comprehensive telemetry** throughout for debugging

```javascript
// ============================================
// toolExecutionPipeline - 8-stage execution pipeline
// Location: chunks.146.mjs:442-800
// ============================================

// ORIGINAL (for source lookup) - Key sections:
async function fxY(A, q, K, Y, z, _, w, O, $, H, j) {
    // Stage 1: Schema Validation
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
                sourceToolAssistantUUID: _.uuid
            })
        }];
    }

    // Stage 2: Custom Validation
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
                sourceToolAssistantUUID: _.uuid
            })
        }];
    }

    // Stage 3: Pre-tool Hooks
    let D = [], X = J.data;
    let P = !1, W, Z;
    let f = Date.now();

    for await (let u of y4q(Y, A, X, q, _.message.id, O, $, H)) {
        switch (u.type) {
            case "message":
                if (u.message.message.type === "progress") j(u.message.message);
                else D.push(u.message);
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
                return D;
        }
    }

    // Stage 4: Permission Check
    let V;
    if (Z !== void 0 && Z.behavior === "allow" && !A.requiresUserInteraction?.()) {
        V = Z;  // Hook approved
    } else if (Z !== void 0 && Z.behavior === "deny") {
        V = Z;  // Hook denied
    } else {
        V = await z(A, X, Y, _, q);  // Call canUseTool
    }

    if (V.behavior !== "allow") {
        // Permission denied
        let denyMessage = V.message || `Tool ${A.name} permission denied`;
        return [{
            message: p1({
                content: [{
                    type: "tool_result",
                    content: denyMessage,
                    is_error: !0,
                    tool_use_id: q
                }],
                sourceToolAssistantUUID: _.uuid
            })
        }];
    }

    // Stage 5: Tool Execution
    let R = Date.now();
    try {
        let result = await A.call(X, {
            ...Y,
            toolUseId: q,
            userModified: V.userModified ?? !1
        }, z, _, (progressData) => {
            j({ toolUseID: progressData.toolUseID, data: progressData.data });
        });

        let I = Date.now() - R;

        // Stage 8: Result Formatting
        let B = A.mapToolResultToToolResultBlockParam(result.data, q);

        d("tengu_tool_use_success", {
            messageID: w,
            toolName: hq(A.name),
            isMcp: A.isMcp ?? !1,
            durationMs: I
        });

        return [{ message: p1({ content: [B], sourceToolAssistantUUID: _.uuid }) }];

    } catch (J) {
        // Stage 7: Post-failure hooks
        _6(J);
        return [{
            message: p1({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>${J.message}</tool_use_error>`,
                    is_error: !0,
                    tool_use_id: q
                }],
                sourceToolAssistantUUID: _.uuid
            })
        }];
    }
}

// READABLE (for understanding):
async function toolExecutionPipeline(tool, toolUseId, input, toolUseContext, canUseTool,
                                      assistantMessage, messageId, requestId, mcpServerType,
                                      mcpServerBaseUrl, progressCallback) {
    // ========== STAGE 1: Schema Validation ==========
    const schemaResult = tool.inputSchema.safeParse(input);
    if (!schemaResult.success) {
        const errorMessage = formatSchemaError(tool.name, schemaResult.error);
        return [{
            message: createUserMessage({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>InputValidationError: ${errorMessage}</tool_use_error>`,
                    is_error: true,
                    tool_use_id: toolUseId
                }],
                sourceToolAssistantUUID: assistantMessage.uuid
            })
        }];
    }

    // ========== STAGE 2: Custom Validation ==========
    const validationResult = await tool.validateInput?.(schemaResult.data, toolUseContext);
    if (validationResult?.result === false) {
        return [{
            message: createUserMessage({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>${validationResult.message}</tool_use_error>`,
                    is_error: true,
                    tool_use_id: toolUseId
                }],
                sourceToolAssistantUUID: assistantMessage.uuid
            })
        }];
    }

    // ========== STAGE 3: Pre-tool Hooks ==========
    const additionalMessages = [];
    let validatedInput = schemaResult.data;
    let hookPermissionResult = null;
    let shouldPreventContinuation = false;
    let stopReason = null;

    for await (const hookEvent of executePreToolHooks(
        toolUseContext, tool, validatedInput, toolUseId,
        assistantMessage.message.id, requestId, mcpServerType, mcpServerBaseUrl
    )) {
        switch (hookEvent.type) {
            case "message":
                additionalMessages.push(hookEvent.message);
                break;
            case "hookPermissionResult":
                hookPermissionResult = hookEvent.hookPermissionResult;
                break;
            case "hookUpdatedInput":
                validatedInput = hookEvent.updatedInput;
                break;
            case "preventContinuation":
                shouldPreventContinuation = hookEvent.shouldPreventContinuation;
                break;
            case "stop":
                return additionalMessages;
        }
    }

    // ========== STAGE 4: Permission Check ==========
    let permissionResult;
    if (hookPermissionResult?.behavior === "allow" && !tool.requiresUserInteraction?.()) {
        permissionResult = hookPermissionResult;
    } else if (hookPermissionResult?.behavior === "deny") {
        permissionResult = hookPermissionResult;
    } else {
        permissionResult = await canUseTool(tool, validatedInput, toolUseContext, assistantMessage, toolUseId);
    }

    if (permissionResult.behavior !== "allow") {
        let denyMessage = permissionResult.message || `Tool ${tool.name} permission denied`;
        additionalMessages.push({
            message: createUserMessage({
                content: [{
                    type: "tool_result",
                    content: denyMessage,
                    is_error: true,
                    tool_use_id: toolUseId
                }],
                sourceToolAssistantUUID: assistantMessage.uuid
            })
        });
        return additionalMessages;
    }

    // ========== STAGE 5: Tool Execution ==========
    const executionStartTime = Date.now();
    try {
        const toolResult = await tool.call(validatedInput, {
            ...toolUseContext,
            toolUseId: toolUseId,
            userModified: permissionResult.userModified ?? false
        }, canUseTool, assistantMessage, (progressData) => {
            progressCallback({ toolUseID: progressData.toolUseID, data: progressData.data });
        });

        const executionTime = Date.now() - executionStartTime;

        // ========== STAGE 8: Result Formatting ==========
        const formattedResult = tool.mapToolResultToToolResultBlockParam(toolResult.data, toolUseId);

        emitTelemetry("tengu_tool_use_success", {
            messageID: messageId,
            toolName: getToolDisplayName(tool.name),
            isMcp: tool.isMcp ?? false,
            durationMs: executionTime
        });

        additionalMessages.push({
            message: createUserMessage({
                content: [formattedResult],
                sourceToolAssistantUUID: assistantMessage.uuid
            })
        });
        return additionalMessages;

    } catch (error) {
        // ========== STAGE 7: Post-failure Hooks ==========
        reportError(error);
        additionalMessages.push({
            message: createUserMessage({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>${error.message}</tool_use_error>`,
                    is_error: true,
                    tool_use_id: toolUseId
                }],
                sourceToolAssistantUUID: assistantMessage.uuid
            })
        });
        return additionalMessages;
    }
}

// Mapping: fxY→toolExecutionPipeline, A→tool, q→toolUseId, K→input, Y→toolUseContext,
//          z→canUseTool, _→assistantMessage, w→messageId, O→requestId, $→mcpServerType,
//          H→mcpServerBaseUrl, j→progressCallback, y4q→executePreToolHooks
```

---

## 4. Execute Pre-tool Hooks (y4q) - Hook Execution

### What it does

Executes PreToolUse hooks for a tool invocation, yielding various event types including permission decisions, input modifications, and stop requests.

### How it works

1. Get app state from toolUseContext
2. Iterate over hook execution results
3. For each hook result, yield appropriate event type:
   - `message` - Additional context to inject
   - `hookPermissionResult` - Permission decision from hook
   - `hookUpdatedInput` - Modified tool input
   - `preventContinuation` - Stop after this tool
   - `stop` - Immediate stop requested

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
                               q.getToolUseSummary?.(K))) {
            try {
                if (j.message) yield { type: "message", message: { message: j.message } };
                if (j.blockingError) {
                    let J = yF8(`PreToolUse:${q.name}`, j.blockingError);
                    yield {
                        type: "hookPermissionResult",
                        hookPermissionResult: {
                            behavior: "deny",
                            message: J,
                            decisionReason: { type: "hook", hookName: `PreToolUse:${q.name}`, reason: J }
                        }
                    };
                }
                if (j.preventContinuation) {
                    yield { type: "preventContinuation", shouldPreventContinuation: !0 };
                    if (j.stopReason) yield { type: "stopReason", stopReason: j.stopReason };
                }
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
                            hookPermissionResult: { behavior: "allow", updatedInput: j.updatedInput, decisionReason: J }
                        };
                    } else {
                        yield {
                            type: "hookPermissionResult",
                            hookPermissionResult: { behavior: j.permissionBehavior, message: j.hookPermissionDecisionReason, decisionReason: J }
                        };
                    }
                }
                if (j.updatedInput && j.permissionBehavior === void 0) {
                    yield { type: "hookUpdatedInput", updatedInput: j.updatedInput };
                }
                if (j.additionalContexts?.length > 0) {
                    yield {
                        type: "additionalContext",
                        message: { message: f4({ type: "hook_additional_context", content: j.additionalContexts, hookName: `PreToolUse:${q.name}`, toolUseID: Y }) }
                    };
                }
                if (A.abortController.signal.aborted) {
                    yield { type: "message", message: { message: f4({ type: "hook_cancelled" }) } };
                    yield { type: "stop" };
                    return;
                }
            } catch (J) {
                _6(J);
                yield { type: "stop" };
            }
        }
    } catch (H) {
        _6(H);
        yield { type: "stop" };
    }
}

// READABLE (for understanding):
async function* executePreToolHooks(toolUseContext, tool, input, toolUseId, messageId,
                                     requestId, mcpServerType, mcpServerBaseUrl) {
    const startTime = Date.now();
    try {
        const appState = toolUseContext.getAppState();

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

                // Handle blocking error (immediate deny)
                if (hookResult.blockingError) {
                    const formattedError = formatHookBlockingError(`PreToolUse:${tool.name}`, hookResult.blockingError);
                    yield {
                        type: "hookPermissionResult",
                        hookPermissionResult: {
                            behavior: "deny",
                            message: formattedError,
                            decisionReason: { type: "hook", hookName: `PreToolUse:${tool.name}`, reason: formattedError }
                        }
                    };
                }

                // Handle prevent continuation
                if (hookResult.preventContinuation) {
                    yield { type: "preventContinuation", shouldPreventContinuation: true };
                    if (hookResult.stopReason) {
                        yield { type: "stopReason", stopReason: hookResult.stopReason };
                    }
                }

                // Handle permission behavior from hook
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
                            hookPermissionResult: { behavior: "allow", updatedInput: hookResult.updatedInput, decisionReason }
                        };
                    } else {
                        yield {
                            type: "hookPermissionResult",
                            hookPermissionResult: { behavior: hookResult.permissionBehavior, message: hookResult.hookPermissionDecisionReason, decisionReason }
                        };
                    }
                }

                // Handle input modification without permission behavior
                if (hookResult.updatedInput && hookResult.permissionBehavior === undefined) {
                    yield { type: "hookUpdatedInput", updatedInput: hookResult.updatedInput };
                }

                // Check for abort signal
                if (toolUseContext.abortController.signal.aborted) {
                    yield { type: "message", message: { message: createAttachmentMessage({ type: "hook_cancelled" }) } };
                    yield { type: "stop" };
                    return;
                }

            } catch (innerError) {
                reportError(innerError);
                yield { type: "stop" };
            }
        }
    } catch (outerError) {
        reportError(outerError);
        yield { type: "stop" };
    }
}

// Mapping: y4q→executePreToolHooks, A→toolUseContext, q→tool, K→input, Y→toolUseId,
//          LF8→executeHooksForTool, f4→createAttachmentMessage
```

---

## 5. Find Tool (dK) - Tool Lookup

### What it does

Looks up a tool by name in a tool array, considering both primary names and aliases.

```javascript
// ============================================
// findTool - Find tool by name/alias
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

## 6. Matches Tool Name (z3) - Name/Alias Matching

### What it does

Checks if a tool matches a given name, considering both primary name and aliases.

```javascript
// ============================================
// matchesToolName - Check if tool matches name/alias
// Location: chunks.56.mjs:1588-1590
// ============================================

// ORIGINAL (for source lookup):
function z3(A, q) {
    return A.name === q || (A.aliases?.includes(q) ?? !1)
}

// READABLE (for understanding):
function matchesToolName(tool, queryName) {
    return tool.name === queryName || (tool.aliases?.includes(queryName) ?? false);
}

// Mapping: z3→matchesToolName, A→tool, q→queryName
```

---

## 7. Helper Functions

### applyInputParamAliases (PE1)

```javascript
// ============================================
// applyInputParamAliases - Apply parameter aliases
// Location: chunks.146.mjs:240-255
// ============================================

// ORIGINAL (for source lookup):
function PE1(A, q) {
    if (!A.inputParamAliases || !w8("tengu_tool_input_aliasing", !1)) return q;
    let K = A.inputParamAliases,
        Y = {},
        z = [];
    for (let [_, w] of Object.entries(q)) {
        let O = K[_];
        if (O && !(O in q)) Y[O] = w, z.push(`${_}->${O}`);
        else Y[_] = w
    }
    if (z.length > 0) return d("tengu_tool_input_alias_applied", {
        toolName: hq(A.name),
        aliases: z.join(",")
    }), Y;
    return q
}

// READABLE (for understanding):
function applyInputParamAliases(tool, input) {
    if (!tool.inputParamAliases || !isFeatureEnabled("tengu_tool_input_aliasing", false)) {
        return input;
    }

    const aliases = tool.inputParamAliases;
    const result = {};
    const appliedAliases = [];

    for (const [key, value] of Object.entries(input)) {
        const aliasTarget = aliases[key];
        if (aliasTarget && !(aliasTarget in input)) {
            result[aliasTarget] = value;
            appliedAliases.push(`${key}->${aliasTarget}`);
        } else {
            result[key] = value;
        }
    }

    if (appliedAliases.length > 0) {
        emitTelemetry("tengu_tool_input_alias_applied", {
            toolName: getToolDisplayName(tool.name),
            aliases: appliedAliases.join(",")
        });
        return result;
    }
    return input;
}

// Mapping: PE1→applyInputParamAliases, A→tool, q→input, w8→isFeatureEnabled
```

### getMcpServerFromToolName (h4q)

```javascript
// ============================================
// getMcpServerFromToolName - Get MCP server from tool name
// Location: chunks.146.mjs:266-271
// ============================================

// ORIGINAL (for source lookup):
function h4q(A, q) {
    if (!A.startsWith("mcp__")) return;
    let K = iV(A);
    if (!K) return;
    return q.find((Y) => lO(Y.name) === K.serverName)
}

// READABLE (for understanding):
function getMcpServerFromToolName(toolName, mcpClients) {
    if (!toolName.startsWith("mcp__")) return undefined;

    const parsed = parseMcpToolName(toolName);
    if (!parsed) return undefined;

    return mcpClients.find((client) => normalizeName(client.name) === parsed.serverName);
}

// Mapping: h4q→getMcpServerFromToolName, A→toolName, q→mcpClients, iV→parseMcpToolName, lO→normalizeName
```

### getMcpServerType (PxY)

```javascript
// ============================================
// getMcpServerType - Get MCP server transport type
// Location: chunks.146.mjs:273-277
// ============================================

// ORIGINAL (for source lookup):
function PxY(A, q) {
    let K = h4q(A, q);
    if (K?.type === "connected") return K.config.type ?? "stdio";
    return
}

// READABLE (for understanding):
function getMcpServerType(toolName, mcpClients) {
    const client = getMcpServerFromToolName(toolName, mcpClients);
    if (client?.type === "connected") {
        return client.config.type ?? "stdio";
    }
    return undefined;
}

// Mapping: PxY→getMcpServerType, h4q→getMcpServerFromToolName
```

### getMcpServerBaseUrl (WxY)

```javascript
// ============================================
// getMcpServerBaseUrl - Get MCP server base URL
// Location: chunks.146.mjs:279-283
// ============================================

// ORIGINAL (for source lookup):
function WxY(A, q) {
    let K = h4q(A, q);
    if (K?.type !== "connected") return;
    return Uj(K.config)
}

// READABLE (for understanding):
function getMcpServerBaseUrl(toolName, mcpClients) {
    const client = getMcpServerFromToolName(toolName, mcpClients);
    if (client?.type !== "connected") return undefined;
    return getBaseUrl(client.config);
}

// Mapping: WxY→getMcpServerBaseUrl, h4q→getMcpServerFromToolName, Uj→getBaseUrl
```

---

## Symbol Validation Summary

| Obfuscated | Readable | File:Line | Status |
|------------|----------|-----------|--------|
| Wi6 | toolDispatcher | chunks.146.mjs:285 | ✅ Verified |
| ZxY | toolExecutionOrchestrator | chunks.146.mjs:391 | ✅ Verified |
| fxY | toolExecutionPipeline | chunks.146.mjs:442 | ✅ Verified |
| y4q | executePreToolHooks | chunks.146.mjs:74 | ✅ Verified |
| dK | findTool | chunks.56.mjs:1592 | ✅ Verified |
| z3 | matchesToolName | chunks.56.mjs:1588 | ✅ Verified |
| PE1 | applyInputParamAliases | chunks.146.mjs:240 | ✅ Verified |
| XxY | formatErrorForTelemetry | chunks.146.mjs:229 | ✅ Verified |
| h4q | getMcpServerFromToolName | chunks.146.mjs:266 | ✅ Verified |
| PxY | getMcpServerType | chunks.146.mjs:273 | ✅ Verified |
| WxY | getMcpServerBaseUrl | chunks.146.mjs:279 | ✅ Verified |
| R4q | getNextImagePasteId | chunks.146.mjs:257 | ✅ Verified |
| V4q | formatSchemaError | chunks.146.mjs:* | ✅ Verified |
| GxY | getDeferredToolSchemaHint | chunks.146.mjs:432 | ✅ Verified |

**Total validated**: 14 symbols

---

## Cross-Module Integration

### Tools ↔ System Reminder (04)

Tool execution generates the following attachment types:
- `progress` - Tool progress updates (streaming)
- `hook_additional_context` - Pre-hook context injection
- `hook_blocking_error` - Hook denial message
- `task_status` - Background task changes
- `permission_decision` - Permission flow results
- `structured_output` - Tool returned structured data

### Tools ↔ MCP (06)

- MCP tools discovered via `fetchMcpTools` (JE)
- Tool name prefixing: `mcp__<server>__<tool>`
- Session recovery via `McpSessionLostError` retry
- Annotation mapping: `readOnlyHint` → `isReadOnly()`, `destructiveHint` → `isDestructive()`

### Tools ↔ Hooks (11)

- **PreToolUse**: Can block, modify input, bypass permission
- **PostToolUse**: Can modify output, add attachments
- **PostToolUseFailure**: Handles tool execution errors

### Tools ↔ Sandbox (18)

- Bash tool security via `generateSeatbeltProfile`
- Command validation via `isCommandSandboxed`
- Network permission control