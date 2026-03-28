# Tool Dispatcher Source Restoration (Claude Code 2.1.76)

> Complete source-level restoration of the tool dispatch and execution pipeline with cross-validated symbols.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)

Key functions in this document:
- `toolDispatcher` (Wi6) - Top-level async generator - chunks.146.mjs:285
- `toolExecutionOrchestrator` (ZxY) - Queued async iterator - chunks.146.mjs:391
- `toolExecutionPipeline` (fxY) - 8-stage execution pipeline - chunks.146.mjs:442
- `executePreToolHooks` (y4q) - Pre-tool hook execution - chunks.146.mjs:74

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TOOL DISPATCH ARCHITECTURE                        │
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

**What it does:**
Takes a tool_use content block from the assistant response, looks up the corresponding tool in the tool registry, and delegates execution to the full pipeline. Handles tool lookup failures, abort signals, and error wrapping.

**How it works:**
1. Extract tool name from tool_use block
2. Look up tool in session-scoped tool set
3. If not found, check global alias registry (for MCP/skill tools)
4. If still not found, return error tool_result
5. Check abort signal - if aborted, return cancelled tool_result
6. Delegate to toolExecutionOrchestrator (ZxY)
7. Yield all results from the pipeline

**Why this approach:**
- Generator pattern allows streaming results back to the agent loop
- Two-stage lookup (session tools → global alias registry) enables flexible tool discovery
- Error wrapping ensures all failures produce consistent tool_result blocks

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
                // ... telemetry fields ...
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
            // ... additional telemetry ...
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
//          CF8→createCancelledToolResult, ZxY→toolExecutionOrchestrator
```

**Key insight:**
The two-stage tool lookup (session tools → global alias registry) enables dynamic tool discovery without modifying the session tool set. MCP tools and skill-provided tools are registered in the global alias registry, allowing them to be discovered on-demand while keeping the session tool set focused on built-in tools.

---

## 2. toolExecutionOrchestrator (ZxY) - Queue-Based Execution

**What it does:**
Creates an AsyncQueue to buffer results from the execution pipeline, allowing streaming results to be yielded back to the agent loop while the pipeline continues executing.

**How it works:**
1. Create new AsyncQueue (Pi6) for result buffering
2. Call toolExecutionPipeline (fxY) with progress callback
3. Progress callback enqueues intermediate results to the queue
4. Pipeline completion enqueues all final results
5. Errors are enqueued as errors
6. Finally marks the queue as done

**Why this approach:**
- AsyncQueue enables streaming progress updates while pipeline runs
- Clean separation between pipeline execution and result delivery
- Error handling is centralized in the queue's error propagation

```javascript
// ============================================
// toolExecutionOrchestrator - Buffers pipeline results via AsyncQueue
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
function toolExecutionOrchestrator(tool, toolUseId, input, context, canUseTool, assistantMessage,
                                    messageId, requestId, mcpServerType, mcpServerBaseUrl) {
    // Create async queue for streaming results
    const resultQueue = new AsyncQueue();

    // Execute the full pipeline
    toolExecutionPipeline(
        tool, toolUseId, input, context, canUseTool, assistantMessage,
        messageId, requestId, mcpServerType, mcpServerBaseUrl,
        // Progress callback - handles streaming updates
        (progressUpdate) => {
            emitTelemetry("tengu_tool_use_progress", {
                messageID: messageId,
                toolName: getDisplayName(tool.name),
                isMcp: tool.isMcp ?? false,
                queryChainId: context.queryTracking?.chainId,
                queryDepth: context.queryTracking?.depth,
                // ... additional telemetry ...
            });

            // Enqueue progress message for yielding
            resultQueue.enqueue({
                message: createProgressMessage({
                    toolUseID: progressUpdate.toolUseID,
                    parentToolUseID: toolUseId,
                    data: progressUpdate.data
                })
            });
        }
    ).then((results) => {
        // Enqueue all final results
        for (const result of results) {
            resultQueue.enqueue(result);
        }
    }).catch((error) => {
        // Propagate error through queue
        resultQueue.error(error);
    }).finally(() => {
        // Signal completion
        resultQueue.done();
    });

    // Return the queue for iteration
    return resultQueue;
}

// Mapping: ZxY→toolExecutionOrchestrator, A→tool, q→toolUseId, K→input, Y→context,
//          z→canUseTool, _→assistantMessage, w→messageId, O→requestId,
//          $→mcpServerType, H→mcpServerBaseUrl, Pi6→AsyncQueue, fxY→toolExecutionPipeline
```

**Key insight:**
The AsyncQueue pattern decouples pipeline execution from result consumption. The pipeline runs to completion, but results are yielded incrementally. This enables the agent loop to process streaming updates (like Bash command output) while the tool continues executing.

---

## 3. toolExecutionPipeline (fxY) - 8-Stage Execution

**What it does:**
Executes the complete tool lifecycle: validation → hooks → permissions → execution → hooks → result formatting.

**How it works:**

### Stage 1: Schema Validation
Parse input against tool's Zod schema. If validation fails, check for deferred tool schema issue and return appropriate error.

### Stage 2: Custom Validation
Call tool's optional `validateInput()` method for tool-specific validation logic.

### Stage 3: Pre-Tool Hooks
Execute PreToolUse hooks via `y4q` generator. Hooks can:
- Return messages (yielded as progress)
- Modify input (`hookUpdatedInput`)
- Provide permission decision (`hookPermissionResult`)
- Prevent continuation (`preventContinuation`)
- Return additional context (`additionalContext`)

### Stage 4: Permission Check
Call `canUseTool` unless hook already approved. Permission decision stored for telemetry.

### Stage 5: Tool Execution
Call `tool.call(input, context, canUseTool, assistantMessage, progressCallback)`.

### Stage 6: Post-Tool Hooks
Execute PostToolUse hooks via `k4q` generator. Hooks can modify tool output.

### Stage 7: Post-Failure Hooks
If execution failed, execute PostToolUseFailure hooks via `E4q`.

### Stage 8: Result Formatting
Convert tool result to tool_result block via `mapToolResultToToolResultBlockParam`.

```javascript
// ============================================
// toolExecutionPipeline - 8-stage execution
// Location: chunks.146.mjs:442-900+
// ============================================

// ORIGINAL (for source lookup) - Key sections:
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
        return [/* error tool_result */];
    }

    // === STAGE 2: Custom Validation ===
    let M = await A.validateInput?.(J.data, Y);
    if (M?.result === !1) {
        return [/* validation error tool_result */];
    }

    // === STAGE 3: Pre-Tool Hooks ===
    let D = [], X = J.data;
    for await (let u of y4q(Y, A, X, q, _.message.id, O, $, H)) {
        switch (u.type) {
            case "message":
                if (u.message.message.type === "progress") j(u.message.message);
                else D.push(u.message);
                break;
            case "hookPermissionResult":
                hookPermissionResult = u.hookPermissionResult;
                break;
            case "hookUpdatedInput":
                X = u.updatedInput;
                break;
            case "preventContinuation":
                shouldPreventContinuation = u.shouldPreventContinuation;
                break;
            case "stopReason":
                stopReason = u.stopReason;
                break;
            case "additionalContext":
                D.push(u.message);
                break;
            case "stop":
                return D; // Hook requested early stop
        }
    }

    // === STAGE 4: Permission Check ===
    let V;
    if (hookPermissionResult !== void 0 && hookPermissionResult.behavior === "allow"
        && !A.requiresUserInteraction?.() && !Y.requireCanUseTool) {
        // Hook approved - bypass permission check
        V = hookPermissionResult;
    } else if (hookPermissionResult?.behavior === "deny") {
        V = hookPermissionResult;
    } else {
        // Call canUseTool
        V = await z(A, X, Y, _, q, hookPermissionResult?.behavior === "ask" ? hookPermissionResult : void 0);
    }

    if (V.behavior !== "allow") {
        // Permission denied - return error result
        return [/* denied tool_result */];
    }

    // === STAGE 5: Tool Execution ===
    let R = Date.now();
    let callResult = await A.call(X, {
        ...Y,
        toolUseId: q,
        userModified: V.userModified ?? !1
    }, z, _, (progress) => {
        j(progress); // Forward progress updates
    });

    // === STAGE 6: Post-Tool Hooks ===
    for await (let hookResult of k4q(Y, A, q, _.message.id, X, callResult.data, O, $, H)) {
        if ("updatedMCPToolOutput" in hookResult) {
            // MCP tool output modified by hook
            callResult.data = hookResult.updatedMCPToolOutput;
        } else {
            D.push(hookResult);
        }
    }

    // === STAGE 8: Result Formatting ===
    await formatAndPushResult(callResult.data, callResult.contextModifier);

    return D;
}

// READABLE (for understanding):
async function toolExecutionPipeline(tool, toolUseId, input, context, canUseTool, assistantMessage,
                                      messageId, requestId, mcpServerType, mcpServerBaseUrl, progressCallback) {
    const results = [];

    // === STAGE 1: Schema Validation ===
    const parseResult = tool.inputSchema.safeParse(input);
    if (!parseResult.success) {
        let errorMessage = formatValidationError(tool.name, parseResult.error);

        // Check for deferred tool schema issue
        const schemaHint = checkDeferredToolSchema(tool, context.messages, context.options.tools);
        if (schemaHint) {
            emitTelemetry("tengu_deferred_tool_schema_not_sent", {
                toolName: getDisplayName(tool.name),
                isMcp: tool.isMcp ?? false
            });
            errorMessage += schemaHint;
        }

        return [createErrorToolResult(toolUseId, errorMessage, assistantMessage.uuid)];
    }

    // === STAGE 2: Custom Validation ===
    const validationResult = await tool.validateInput?.(parseResult.data, context);
    if (validationResult?.result === false) {
        return [createErrorToolResult(toolUseId, validationResult.message, assistantMessage.uuid)];
    }

    let validatedInput = parseResult.data;

    // === STAGE 3: Pre-Tool Hooks ===
    let hookPermissionResult;
    let shouldPreventContinuation = false;
    let stopReason;

    for await (const hookEvent of executePreToolHooks(context, tool, validatedInput, toolUseId, messageId, requestId, mcpServerType, mcpServerBaseUrl)) {
        switch (hookEvent.type) {
            case "message":
                // Progress message - forward to orchestrator
                if (hookEvent.message.message.type === "progress") {
                    progressCallback(hookEvent.message.message);
                } else {
                    results.push(hookEvent.message);
                }
                break;

            case "hookPermissionResult":
                // Hook provided permission decision
                hookPermissionResult = hookEvent.hookPermissionResult;
                break;

            case "hookUpdatedInput":
                // Hook modified input
                validatedInput = hookEvent.updatedInput;
                break;

            case "preventContinuation":
                // Hook wants to prevent further execution
                shouldPreventContinuation = hookEvent.shouldPreventContinuation;
                break;

            case "stopReason":
                stopReason = hookEvent.stopReason;
                break;

            case "additionalContext":
                results.push(hookEvent.message);
                break;

            case "stop":
                // Hook requested immediate stop
                results.push(createErrorToolResult(toolUseId, stopReason, assistantMessage.uuid));
                return results;
        }
    }

    // === STAGE 4: Permission Check ===
    let permissionDecision;

    if (hookPermissionResult?.behavior === "allow" && !tool.requiresUserInteraction?.() && !context.requireCanUseTool) {
        // Hook approved - bypass permission check
        console.log(`Hook approved tool use for ${tool.name}, bypassing permission check`);
        permissionDecision = hookPermissionResult;
    } else if (hookPermissionResult?.behavior === "deny") {
        console.log(`Hook denied tool use for ${tool.name}`);
        permissionDecision = hookPermissionResult;
    } else {
        // Need to call canUseTool
        permissionDecision = await canUseTool(tool, validatedInput, context, assistantMessage, toolUseId,
            hookPermissionResult?.behavior === "ask" ? hookPermissionResult : undefined);
    }

    if (permissionDecision.behavior !== "allow") {
        // Permission denied
        emitTelemetry("tengu_tool_use_can_use_tool_rejected", { /* ... */ });
        return [createDeniedToolResult(toolUseId, permissionDecision.message, assistantMessage.uuid)];
    }

    // Update input if permission decision modified it
    if (permissionDecision.updatedInput !== undefined) {
        validatedInput = permissionDecision.updatedInput;
    }

    // === STAGE 5: Tool Execution ===
    const executionStartTime = Date.now();
    const callResult = await tool.call(validatedInput, {
        ...context,
        toolUseId: toolUseId,
        userModified: permissionDecision.userModified ?? false
    }, canUseTool, assistantMessage, (progress) => {
        progressCallback(progress);
    });

    const executionDuration = Date.now() - executionStartTime;
    emitTelemetry("tengu_tool_use_success", { /* ... */ });

    // === STAGE 6: Post-Tool Hooks ===
    let toolOutput = callResult.data;

    for await (const postHookResult of executePostToolHooks(context, tool, toolUseId, messageId, validatedInput, toolOutput, requestId, mcpServerType, mcpServerBaseUrl)) {
        if ("updatedMCPToolOutput" in postHookResult) {
            // MCP tool output was modified
            toolOutput = postHookResult.updatedMCPToolOutput;
        } else {
            results.push(postHookResult);
        }
    }

    // === STAGE 8: Result Formatting ===
    const formattedResult = tool.mapToolResultToToolResultBlockParam(toolOutput, toolUseId);
    results.push(createUserMessage({
        content: [formattedResult],
        toolUseResult: formatResultForDisplay(toolOutput),
        sourceToolAssistantUUID: assistantMessage.uuid
    }));

    return results;
}

// Mapping: fxY→toolExecutionPipeline, A→tool, q→toolUseId, K→input, Y→context,
//          z→canUseTool, _→assistantMessage, w→messageId, O→requestId,
//          y4q→executePreToolHooks, k4q→executePostToolHooks
```

**Key insight:**
The hook system has three powerful capabilities:
1. **Permission bypass**: Hooks can pre-approve tool usage, skipping the user prompt
2. **Input modification**: Hooks can transform input before execution
3. **Early stopping**: Hooks can abort execution entirely with a custom message

This enables use cases like "auto-approve read-only tools" or "validate dangerous commands before execution."

---

## 4. Permission Decision Algorithm

**What it does:**
Determines whether a tool can be used without user confirmation, with confirmation, or is denied.

**How it works:**
```
Permission Decision Flow:
1. Check hook override (hookPermissionResult)
2. If hook says "allow" and tool doesn't require user interaction → bypass
3. If hook says "deny" → return denial
4. Otherwise, call canUseTool with potential hook context
5. canUseTool checks:
   - Auto-allow rules (readOnly tools, allowed tools set)
   - Permission rules from settings
   - Prompts user if needed
```

**Permission Sources (in priority order):**

| Source | Priority | Can Override |
|--------|----------|--------------|
| Hook (deny) | Highest | All |
| Hook (allow) | High | User prompts only if requiresUserInteraction |
| User decision | Medium | Previous decisions |
| Settings rules | Low | None |
| Auto-allow | Lowest | None |

---

## 5. Error Handling Patterns

### Error Types and Handling

| Error Type | Detection | Result Format |
|------------|-----------|---------------|
| Tool not found | `!tool` after lookup | `<tool_use_error>Error: No such tool available: ${name}</tool_use_error>` |
| Aborted | `abortController.signal.aborted` | Cancelled tool_result with message |
| Schema validation | `!safeParseResult.success` | `<tool_use_error>InputValidationError: ${message}</tool_use_error>` |
| Custom validation | `validateInput()?.result === false` | `<tool_use_error>${message}</tool_use_error>` |
| Permission denied | `permissionDecision.behavior !== "allow"` | `<tool_use_error>${message}</tool_use_error>` |
| Execution error | `catch` block | `<tool_use_error>Error calling tool: ${message}</tool_use_error>` |

### Deferred Tool Schema Error

Special error message added when tool schema wasn't sent to the API:

```javascript
// GxY - Check for deferred tool schema issue
function checkDeferredToolSchema(tool, messages, sessionTools) {
    if (!isDeferredToolLoadingEnabled()) return null;
    if (!isToolInDeferredSet(tool, sessionTools)) return null;
    if (!isToolSchemaNotInHistory(tool, messages)) return null;

    return `
This tool's schema was not sent to the API — it was not in the discovered-tool set derived from message history.
Without the schema in your prompt, typed parameters (arrays, numbers, booleans) get emitted as strings and the
client-side parser rejects them. Load the tool first: call ToolSearch with query "select:${tool.name}", then retry this call.`;
}
```

---

## 5. Error Handling and Post-Failure Hooks (Stage 7)

### Post-Failure Hook Execution

**What it does:**
When tool execution fails (throws an exception), PostToolUseFailure hooks are executed via `E4q` to handle the error, potentially modify the error message, or provide recovery suggestions.

**How it works:**
1. Catch block captures the execution error
2. Check if error is a special type (McpSessionLostError, UserAbortedError)
3. Execute PostToolUseFailure hooks via `E4q`
4. Collect hook results and format error message
5. Return error tool_result with hook modifications

**Why this approach:**
- Enables custom error handling per tool
- Allows hooks to transform errors into user-friendly messages
- Supports error recovery workflows (e.g., MCP session recovery)

```javascript
// ============================================
// Post-Failure Hook Handling - E4q execution
// Location: chunks.146.mjs:897-1000
// ============================================

// ORIGINAL (for source lookup):
} catch (u) {
    let I = Date.now() - R;
    if (Pt6(I), Jk8({ success: !1, error: _1(u) }), h01(),
        u instanceof WE1) {
        // MCP session lost - update client state
        Y.setAppState((p) => {
            let Q = u.serverName,
                U = p.mcp.clients.findIndex((Y6) => Y6.name === Q);
            if (U === -1) return p;
            let r = p.mcp.clients[U];
            if (!r || r.type !== "connected") return p;
            let e = [...p.mcp.clients];
            return e[U] = {
                name: Q,
                type: "needs-auth",
                config: r.config
            }, {
                ...p,
                mcp: { ...p.mcp, clients: e }
            }
        });
    }
    if (!(u instanceof oY)) {  // Not UserAbortedError
        let p = _1(u);
        if (k(`${A.name} tool error (${I}ms): ${p.slice(0,200)}`),
            !(u instanceof uS)) _6(u);
        d("tengu_tool_use_error", {
            messageID: w,
            toolName: hq(A.name),
            error: XxY(u),
            isMcp: A.isMcp ?? !1,
            // ... telemetry fields ...
        });
    }
    // ... PostToolUseFailure hooks execution ...
}

// READABLE (for understanding):
} catch (error) {
    const executionDuration = Date.now() - executionStartTime;
    recordToolDuration(executionDuration);
    recordToolOutcome({ success: false, error: serializeError(error) });

    // Special handling for MCP session lost
    if (error instanceof McpSessionLostError) {
        context.setAppState((state) => {
            const serverName = error.serverName;
            const clientIndex = state.mcp.clients.findIndex(c => c.name === serverName);
            if (clientIndex === -1) return state;

            const client = state.mcp.clients[clientIndex];
            if (!client || client.type !== "connected") return state;

            // Mark client as needing re-auth
            const updatedClients = [...state.mcp.clients];
            updatedClients[clientIndex] = {
                name: serverName,
                type: "needs-auth",
                config: client.config
            };
            return { ...state, mcp: { ...state.mcp, clients: updatedClients } };
        });
    }

    // Skip telemetry for UserAbortedError
    if (!(error instanceof UserAbortedError)) {
        const errorMessage = serializeError(error);
        console.warn(`${tool.name} tool error (${executionDuration}ms): ${errorMessage.slice(0, 200)}`);

        // Don't report ToolExecutionError (already wrapped)
        if (!(error instanceof ToolExecutionError)) {
            reportError(error);
        }

        emitTelemetry("tengu_tool_use_error", {
            messageID: messageId,
            toolName: getDisplayName(tool.name),
            error: formatErrorForTelemetry(error),
            isMcp: tool.isMcp ?? false,
            // ... additional telemetry ...
        });
    }

    // Execute PostToolUseFailure hooks
    const errorInfo = extractErrorInfo(error);
    const isUserAborted = error instanceof UserAbortedError;

    for await (const hookResult of executePostToolFailureHooks(
        context, tool, toolUseId, messageId, validatedInput, errorInfo, requestId, mcpServerType, mcpServerBaseUrl
    )) {
        results.push(hookResult);
    }

    // Format error result
    const errorContent = formatErrorResult(error, shouldPreventContinuation, stopReason);
    results.push(createErrorToolResult(toolUseId, errorContent, assistantMessage.uuid));

    return results;
}
```

### Error Types and Handling

| Error Type | Obfuscated | Detection | Result Format |
|------------|------------|-----------|---------------|
| Tool not found | - | `!tool` after lookup | `<tool_use_error>Error: No such tool available: ${name}</tool_use_error>` |
| Aborted | oY | `abortController.signal.aborted` | Cancelled tool_result with message |
| Schema validation | - | `!safeParseResult.success` | `<tool_use_error>InputValidationError: ${message}</tool_use_error>` |
| Custom validation | - | `validateInput()?.result === false` | `<tool_use_error>${message}</tool_use_error>` |
| Permission denied | - | `permissionDecision.behavior !== "allow"` | `<tool_use_error>${message}</tool_use_error>` |
| MCP session lost | WE1 | `error instanceof McpSessionLostError` | Client state updated, session recovery triggered |
| Execution error | - | `catch` block | `<tool_use_error>Error calling tool: ${message}</tool_use_error>` |

### Error Code Extraction

```javascript
// pT6 - Extract error info for PostToolUseFailure hooks
function extractErrorInfo(error) {
    if (error instanceof McpToolExecutionError) {
        return {
            error: error.message,
            isError: true,
            code: error.code
        };
    }
    if (error instanceof Error) {
        return {
            error: error.message,
            isError: true,
            stack: error.stack
        };
    }
    return {
        error: String(error),
        isError: true
    };
}
```

---

## 6. UI Interaction and Progress Tracking

### Progress Callback System

The tool execution pipeline uses a progress callback system to stream updates back to the UI:

```javascript
// Progress callback signature
(progressUpdate) => {
    emitTelemetry("tengu_tool_use_progress", { ... });
    resultQueue.enqueue({
        message: createProgressMessage({
            toolUseID: progressUpdate.toolUseID,
            parentToolUseID: toolUseId,
            data: progressUpdate.data
        })
    });
}
```

### Progress Event Types

| Event Type | Source | Data |
|------------|--------|------|
| `mcp_progress` | MCP tool execution | `{ status: "started"|"completed", serverName, toolName, elapsedTimeMs }` |
| `bash_output` | Bash tool | `{ output: string, isStreaming: boolean }` |
| `tool_progress` | Generic tool | `{ message: string, percentage?: number }` |

### Modal Priority System

Tool permission dialogs follow a priority ordering:

```javascript
// Modal priority (highest → lowest)
function getActiveModal(state) {
    if (state.sandboxPermissionQueue[0]) return "sandbox-permission";
    if (state.pendingToolRequest[0]) return "tool-permission";
    if (state.workerSandboxQueue[0]) return "worker-sandbox-permission";
    if (state.elicitation.queue[0]) return "elicitation";
    return null;
}
```

### UI Components

| Component | Purpose | Trigger |
|-----------|---------|---------|
| `ToolPermissionDialog` | Ask user for tool permission | `canUseTool` returns "ask" |
| `ToolProgressDialog` | Show streaming progress | Progress callback invoked |
| `ToolResultDisplay` | Render tool result | Pipeline completion |
| `ToolErrorDialog` | Display error details | Pipeline error |

---

## Cross-Module Integration

### Tools ↔ System Reminder (04)

The tool execution pipeline generates several attachment types:

| Attachment Type | When Generated | Purpose |
|-----------------|----------------|---------|
| `progress` | During tool execution | Streaming updates (Bash output) |
| `hook_additional_context` | Pre-tool hook execution | Additional context from hooks |
| `hook_blocking_error` | Hook denial | Hook rejection message |
| `task_status` | Background task changes | Task completion/failure |
| `permission_decision` | After canUseTool | Record of user decision |

See: [tool_reminder_integration.md](./tool_reminder_integration.md)

### Tools ↔ Hooks (11)

Hook execution in the pipeline:

| Hook Type | Stage | Can Modify |
|-----------|-------|------------|
| PreToolUse | Stage 3 | Input, permission, continuation |
| PostToolUse | Stage 6 | Output |
| PostToolUseFailure | Stage 7 | Error handling |

See: [05_tools/cross_system_integration_complete.md](./cross_system_integration_complete.md)

### Tools ↔ MCP (06)

MCP tools are discovered via `fetchMcpTools` and registered with `mcp__` prefix. MCP tool execution routes through the same pipeline with additional telemetry for server identification.

See: [06_mcp/tool_discovery_complete.md](../06_mcp/tool_discovery_complete.md)

---

## Verification

To verify this analysis:

1. **Symbol validation**: Check that `Wi6` is at chunks.146.mjs:285
   ```bash
   grep -n "async function\* Wi6" source/chunks.146.mjs
   ```

2. **Pipeline stages**: Trace through fxY and verify hook/permission calls
   ```bash
   grep -n "y4q\|k4q\|E4q" source/chunks.146.mjs
   ```

3. **Error handling**: Check that all error paths return tool_result
   ```bash
   grep -n "tool_use_error" source/chunks.146.mjs
   ```

---

## 5. executePreToolHooksIterator (y4q) - Complete Hook Flow

**What it does:**
Executes all PreToolUse hooks for a tool call, yielding events that control tool execution including permission decisions, input modifications, and early stopping.

**How it works:**
1. Get current app state for mode context
2. Iterate through all PreToolUse hooks via `LF8`
3. For each hook result, yield appropriate event types:
   - `message` - Progress or status messages
   - `hookPermissionResult` - Permission decision (allow/deny/ask)
   - `hookUpdatedInput` - Modified input from hook
   - `preventContinuation` - Stop execution flag
   - `additionalContext` - Context to inject into LLM
   - `stop` - Immediate abort
4. Handle errors gracefully with telemetry
5. Respect abort signal for cancellation

**Why this approach:**
- Generator pattern allows streaming multiple event types
- Sequential processing ensures predictable hook ordering
- Error resilience prevents hook failures from crashing tool execution

```javascript
// ============================================
// executePreToolHooksIterator - Pre-tool hook execution
// Location: chunks.146.mjs:74-216
// ============================================

// ORIGINAL (for source lookup):
async function* y4q(A, q, K, Y, z, _, w, O) {
    let $ = Date.now();
    try {
        let H = A.getAppState();
        for await (let j of LF8(q.name, Y, K, A, H.toolPermissionContext.mode, A.abortController.signal, void 0, A.requestPrompt, q.getToolUseSummary?.(K))) try {
            // Yield message if present
            if (j.message) yield {
                type: "message",
                message: { message: j.message }
            };

            // Handle blocking error (hook denial)
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

            // Handle prevent continuation
            if (j.preventContinuation) {
                yield { type: "preventContinuation", shouldPreventContinuation: !0 };
                if (j.stopReason) yield { type: "stopReason", stopReason: j.stopReason }
            }

            // Handle permission behavior
            if (j.permissionBehavior !== void 0) {
                let J = {
                    type: "hook",
                    hookName: `PreToolUse:${q.name}`,
                    hookSource: j.hookSource,
                    reason: j.hookPermissionDecisionReason
                };
                if (j.permissionBehavior === "allow") yield {
                    type: "hookPermissionResult",
                    hookPermissionResult: { behavior: "allow", updatedInput: j.updatedInput, decisionReason: J }
                };
                else if (j.permissionBehavior === "ask") yield {
                    type: "hookPermissionResult",
                    hookPermissionResult: { behavior: "ask", updatedInput: j.updatedInput, message: j.hookPermissionDecisionReason, decisionReason: J }
                };
                else yield {
                    type: "hookPermissionResult",
                    hookPermissionResult: { behavior: j.permissionBehavior, message: j.hookPermissionDecisionReason, decisionReason: J }
                }
            }

            // Handle updated input
            if (j.updatedInput && j.permissionBehavior === void 0) yield {
                type: "hookUpdatedInput",
                updatedInput: j.updatedInput
            };

            // Handle additional context (becomes system reminder)
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

            // Handle abort
            if (A.abortController.signal.aborted) {
                yield { type: "message", message: { message: f4({ type: "hook_cancelled", hookName: `PreToolUse:${q.name}`, toolUseID: Y, hookEvent: "PreToolUse" }) } };
                yield { type: "stop" };
                return
            }
        } catch (J) {
            // Hook error - yield error message and continue
            yield { type: "message", message: { message: f4({ type: "hook_error_during_execution", content: pT6(J), hookName: `PreToolUse:${q.name}`, toolUseID: Y, hookEvent: "PreToolUse" }) } };
            yield { type: "stop" }
        }
    } catch (H) {
        yield { type: "stop" }
    }
}

// READABLE (for understanding):
async function* executePreToolHooksIterator(toolUseContext, tool, input, toolUseId, messageId, requestId, mcpServerType, mcpServerBaseUrl) {
    const startTime = Date.now();

    try {
        const appState = toolUseContext.getAppState();

        // Iterate through all PreToolUse hooks
        for await (const hookResult of runPreToolUseHooks(
            tool.name,
            toolUseId,
            input,
            toolUseContext,
            appState.toolPermissionContext.mode,
            toolUseContext.abortController.signal,
            undefined,  // hookId
            toolUseContext.requestPrompt,
            tool.getToolUseSummary?.(toolUseId)
        )) {
            try {
                // 1. Message (progress/status)
                if (hookResult.message) {
                    yield {
                        type: "message",
                        message: { message: hookResult.message }
                    };
                }

                // 2. Blocking Error - Hook denies execution
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

                // 3. Prevent Continuation - Stop tool use
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

                // 4. Permission Behavior - Allow/Deny/Ask
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
                                message: hookResult.hookPermissionDecisionReason,
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

                // 5. Updated Input - Hook modified the input
                if (hookResult.updatedInput && hookResult.permissionBehavior === undefined) {
                    yield {
                        type: "hookUpdatedInput",
                        updatedInput: hookResult.updatedInput
                    };
                }

                // 6. Additional Context - Becomes system reminder
                if (hookResult.additionalContexts?.length > 0) {
                    yield {
                        type: "additionalContext",
                        message: {
                            message: createHookMessage({
                                type: "hook_additional_context",
                                content: hookResult.additionalContexts,
                                hookName: `PreToolUse:${tool.name}`,
                                toolUseID: toolUseId,
                                hookEvent: "PreToolUse"
                            })
                        }
                    };
                }

                // 7. Abort Check
                if (toolUseContext.abortController.signal.aborted) {
                    emitTelemetry("tengu_pre_tool_hooks_cancelled", {
                        toolName: sanitizeToolName(tool.name),
                        queryChainId: toolUseContext.queryTracking?.chainId,
                        queryDepth: toolUseContext.queryTracking?.depth
                    });

                    yield {
                        type: "message",
                        message: {
                            message: createHookMessage({
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

            } catch (hookError) {
                reportError(hookError);

                // Emit error telemetry
                const duration = Date.now() - startTime;
                emitTelemetry("tengu_pre_tool_hook_error", {
                    messageID: messageId,
                    toolName: sanitizeToolName(tool.name),
                    isMcp: tool.isMcp ?? false,
                    duration,
                    queryChainId: toolUseContext.queryTracking?.chainId,
                    queryDepth: toolUseContext.queryTracking?.depth,
                    ...(mcpServerType && { mcpServerType }),
                    ...(requestId && { requestId })
                });

                yield {
                    type: "message",
                    message: {
                        message: createHookMessage({
                            type: "hook_error_during_execution",
                            content: formatError(hookError),
                            hookName: `PreToolUse:${tool.name}`,
                            toolUseID: toolUseId,
                            hookEvent: "PreToolUse"
                        })
                    }
                };
                yield { type: "stop" };
            }
        }

    } catch (outerError) {
        reportError(outerError);
        yield { type: "stop" };
    }
}

// Mapping: y4q→executePreToolHooksIterator, A→toolUseContext, q→tool, K→input, Y→toolUseId,
//          z→messageId, _→requestId, w→mcpServerType, O→mcpServerBaseUrl,
//          LF8→runPreToolUseHooks, f4→createHookMessage, yF8→formatHookError
```

**Key insight:**
The pre-tool hook iterator uses a sophisticated yield-based protocol to communicate multiple types of outcomes:
- `hookPermissionResult.behavior = "allow"` bypasses the permission check entirely
- `hookPermissionResult.behavior = "deny"` immediately rejects the tool call
- `hookPermissionResult.behavior = "ask"` passes hook context to the permission prompt
- `hookUpdatedInput` allows hooks to transform parameters before execution
- `additionalContext` injects LLM-visible context without user visibility

---

## 6. Hook Event Types and Effects

| Event Type | Effect | Consumer Handling |
|------------|--------|-------------------|
| `message` | Progress/status update | Forwarded to result queue |
| `hookPermissionResult` | Permission decision | Stored for Stage 4 |
| `hookUpdatedInput` | Modified tool input | Replaces validated input |
| `preventContinuation` | Stop flag | Prevents further execution |
| `stopReason` | Custom stop message | Used in error result |
| `additionalContext` | LLM context | Becomes system reminder |
| `stop` | Immediate abort | Returns early from pipeline |

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Enhanced hook context flow, MCP output modification |
| 2.1.72 | Permission behavior from hooks |
| 2.1.32 | Additional context for hooks |
| 2.1.18 | Initial hook-to-reminder integration |