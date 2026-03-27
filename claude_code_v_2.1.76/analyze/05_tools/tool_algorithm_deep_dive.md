# Tool Algorithm Deep Dive - Complete Documentation

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-27
> **Status**: ✅ Source-level documentation with ORIGINAL/READABLE code

---

## Overview

This document provides in-depth analysis of the key algorithms in the Tools module, including step-by-step execution traces, edge case handling, and design rationale.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)

Key functions analyzed here:
- `toolDispatcher` (Wi6) - Entry point - chunks.146.mjs:285
- `toolExecutionPipeline` (fxY) - 8-stage pipeline - chunks.146.mjs:442
- `executePreToolHooks` (y4q) - Hook execution - chunks.146.mjs:74
- `executePostToolFailureHooks` (E4q) - Error handling - chunks.146.mjs:3
- `findTool` (dK) - Tool lookup - chunks.56.mjs:1592

---

## 1. Tool Dispatch Algorithm (Wi6)

### What it does

The tool dispatcher is the entry point for all tool invocations. It receives a `tool_use` content block from the assistant response, looks up the corresponding tool, and delegates execution to the pipeline.

### How it works

```
Step 1: Extract tool name from tool_use block
    │
    ├─→ Step 2: Lookup in session-scoped tool set (findTool)
    │     │
    │     └─→ If found, proceed to Step 4
    │
    ├─→ Step 3: If not found, check global alias registry
    │     │
    │     ├─→ Found with matching alias → Use that tool
    │     └─→ Not found → Return error tool_result
    │
    ├─→ Step 4: Check abort signal
    │     │
    │     └─→ If aborted → Return cancelled tool_result
    │
    ├─→ Step 5: Extract MCP server metadata (if MCP tool)
    │     ├─→ mcpServerType (stdio, http, sse, etc.)
    │     └─→ mcpServerBaseUrl
    │
    └─→ Step 6: Delegate to toolExecutionOrchestrator (ZxY)
          └─→ Yield all results from pipeline
```

### Why this approach

**Two-stage lookup:**
1. **Session tools** - Tools explicitly available for this conversation
2. **Global alias registry** - MCP and skill-provided tools registered dynamically

This enables flexible tool discovery without modifying the session tool set. MCP tools and skill-provided tools are registered in the global alias registry and discovered on-demand.

**Error wrapping:**
All failures produce consistent `tool_result` blocks with `is_error: true`, ensuring the LLM receives structured error information.

### Key insight

The dispatcher is a generator function (`async function*`) that yields results incrementally. This allows streaming progress updates back to the agent loop without waiting for full completion.

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
        k(`Unknown tool ${z}: ${A.id}`);
        d("tengu_tool_use_error", {
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
            J.content = QT6(R96);
            yield {
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
    // Step 1: Extract tool name
    const toolName = toolUseBlock.name;

    // Step 2: Lookup in session tools
    let tool = findTool(toolUseContext.options.tools, toolName);

    // Step 3: Check global alias registry if not found
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

    // Step 4: Handle tool not found
    if (!tool) {
        const displayName = getDisplayName(toolName);
        debugLog(`Unknown tool ${toolName}: ${toolUseBlock.id}`);

        trackEvent("tengu_tool_use_error", {
            error: `No such tool available: ${displayName}`,
            toolName: displayName,
            toolUseID: toolUseBlock.id,
            isMcp: toolName.startsWith("mcp__"),
            queryChainId: toolUseContext.queryTracking?.chainId,
            queryDepth: toolUseContext.queryTracking?.depth,
            ...(mcpServerType && { mcpServerType }),
            ...(mcpServerBaseUrl && { mcpServerBaseUrl }),
            ...(requestId && { requestId })
        });

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
        // Step 5: Check abort signal
        if (toolUseContext.abortController.signal.aborted) {
            trackEvent("tengu_tool_use_cancelled", {
                toolName: getDisplayName(tool.name),
                toolUseID: toolUseBlock.id,
                isMcp: tool.isMcp ?? false
            });

            const cancelledResult = createCancelledToolResult(toolUseBlock.id);
            yield {
                message: createUserMessage({
                    content: [cancelledResult],
                    toolUseResult: CANCELLED_MESSAGE,
                    sourceToolAssistantUUID: assistantMessage.uuid
                })
            };
            return;
        }

        // Step 6: Delegate to orchestrator
        for await (const result of toolExecutionOrchestrator(
            tool, toolUseBlock.id, input, toolUseContext,
            canUseTool, assistantMessage, messageId, requestId,
            mcpServerType, mcpServerBaseUrl
        )) {
            yield result;
        }

    } catch (error) {
        // Unexpected error - wrap in tool_result
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

// Mapping: Wi6→toolDispatcher, A→toolUseBlock, q→assistantMessage,
//          K→canUseTool, Y→toolUseContext, dK→findTool, ng→getDynamicToolSet,
//          PxY→getMcpServerType, WxY→getMcpServerBaseUrl, ZxY→toolExecutionOrchestrator,
//          p1→createUserMessage, _6→reportError, k→debugLog, d→trackEvent
```

---

## 2. Tool Execution Pipeline Algorithm (fxY)

### What it does

The 8-stage execution pipeline handles the complete lifecycle of tool execution, from input validation to result formatting.

### How it works

```
Stage 1: Schema Validation
    │     └─→ Zod safeParse on inputSchema
    │           └─→ Invalid → Return error tool_result
    │
    ├─→ Stage 2: Custom Validation
    │     └─→ tool.validateInput(input, context)
    │           └─→ result: false → Return error tool_result
    │
    ├─→ Stage 3: Pre-tool Hooks
    │     └─→ executePreToolHooks (y4q)
    │           ├─→ Hook can provide permission decision
    │           ├─→ Hook can modify input
    │           ├─→ Hook can block execution
    │           └─→ Hook can stop entire turn
    │
    ├─→ Stage 4: Permission Check
    │     └─→ canUseTool(tool, input, context, ...)
    │           ├─→ Check hook override first
    │           ├─→ Check auto-allow rules
    │           └─→ Prompt user if needed
    │
    ├─→ Stage 5: Tool Execution
    │     └─→ tool.call(input, context)
    │           └─→ Progress callbacks stream via AsyncQueue
    │
    ├─→ Stage 6: Post-tool Hooks
    │     └─→ executePostToolHooks (k4q)
    │           ├─→ Can modify output
    │           └─→ Can add attachments
    │
    ├─→ Stage 7: Post-failure Hooks (on error only)
    │     └─→ executePostToolFailureHooks (E4q)
    │           └─→ Handle errors, provide context
    │
    └─→ Stage 8: Result Formatting
          └─→ Create final message with tool_result
```

### Why this approach

**Separation of concerns:**
Each stage has a single responsibility, making the pipeline easier to understand, test, and extend.

**Hook integration:**
Hooks are deeply integrated into the pipeline, allowing external code to intercept and modify behavior at key points.

**Streaming support:**
Progress callbacks allow long-running tools (like file reads) to report progress incrementally.

### Key insight

The permission check (Stage 4) has a special bypass: if a PreToolUse hook provided a permission decision (`behavior: "allow"`), and the tool doesn't require user interaction, the permission check is skipped entirely.

```javascript
// ============================================
// toolExecutionPipeline - 8-stage execution pipeline
// Location: chunks.146.mjs:442-700
// ============================================

// ORIGINAL (for source lookup) - Key stages:
async function fxY(A, q, K, Y, z, _, w, O, $, H, j) {
    // Stage 1: Schema Validation
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
                toolUseResult: `Error: ${M.message}`,
                sourceToolAssistantUUID: _.uuid
            })
        }];
    }

    // Stage 3: Pre-tool Hooks
    let D = [], X = J.data;
    let P = !1, W, Z, G = [];
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
                return D;  // Hook requested stop
        }
    }

    // Stage 4: Permission Check
    let V;
    if (Z !== void 0 && Z.behavior === "allow" && !A.requiresUserInteraction?.() && !Y.requireCanUseTool) {
        k(`Hook approved tool use for ${A.name}, bypassing permission check`);
        V = Z;
    } else if (Z !== void 0 && Z.behavior === "deny") {
        k(`Hook denied tool use for ${A.name}`);
        V = Z;
    } else {
        V = await z(A, X, Y, _, q);
    }

    if (V.behavior !== "allow") {
        return [{
            message: p1({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>${V.message || "Permission denied"}</tool_use_error>`,
                    is_error: !0,
                    tool_use_id: q
                }],
                toolUseResult: `Permission denied: ${V.message}`,
                sourceToolAssistantUUID: _.uuid
            })
        }];
    }

    // Stage 5: Tool Execution
    // ... tool.call() with progress callback

    // Stage 6: Post-tool Hooks
    // ... k4q()

    // Stage 7: Post-failure Hooks (if error)
    // ... E4q()

    // Stage 8: Result Formatting
    // ... create final message
}

// READABLE (for understanding):
async function toolExecutionPipeline(tool, toolUseId, input, toolUseContext,
                                      canUseTool, assistantMessage, messageId,
                                      requestId, mcpServerType, mcpServerBaseUrl,
                                      progressCallback) {

    // ========================================
    // Stage 1: Schema Validation (Zod)
    // ========================================
    const schemaResult = tool.inputSchema.safeParse(input);
    if (!schemaResult.success) {
        const errorMessage = formatSchemaError(tool.name, schemaResult.error);

        // Check if this is a deferred tool (schema not sent to LLM)
        const deferredHint = getDeferredToolSchemaHint(tool, toolUseContext.messages, toolUseContext.options.tools);
        if (deferredHint) {
            trackEvent("tengu_deferred_tool_schema_not_sent", {
                toolName: getDisplayName(tool.name),
                isMcp: tool.isMcp ?? false
            });
            errorMessage += deferredHint;
        }

        debugLog(`${tool.name} tool input error: ${errorMessage.slice(0, 200)}`);

        return [createErrorToolResult(toolUseId, errorMessage, assistantMessage.uuid)];
    }

    // ========================================
    // Stage 2: Custom Validation
    // ========================================
    const customResult = await tool.validateInput?.(schemaResult.data, toolUseContext);
    if (customResult?.result === false) {
        debugLog(`${tool.name} tool validation error: ${customResult.message?.slice(0, 200)}`);
        return [createErrorToolResult(toolUseId, customResult.message, assistantMessage.uuid)];
    }

    // Apply input parameter aliases if configured
    let validatedInput = applyInputParamAliases(tool, schemaResult.data);

    // ========================================
    // Stage 3: Pre-tool Hooks
    // ========================================
    const preHookMessages = [];
    let hookPermissionResult;
    let preventContinuation = false;
    let stopReason;
    const hookStartTime = Date.now();

    for await (const hookEvent of executePreToolHooks(
        toolUseContext, tool, validatedInput, toolUseId,
        assistantMessage.message.id, requestId, mcpServerType, mcpServerBaseUrl
    )) {
        switch (hookEvent.type) {
            case "message":
                if (hookEvent.message.message.type === "progress") {
                    progressCallback(hookEvent.message.message);
                } else {
                    preHookMessages.push(hookEvent.message);
                }
                break;

            case "hookPermissionResult":
                // Hook provided a permission decision
                hookPermissionResult = hookEvent.hookPermissionResult;
                break;

            case "hookUpdatedInput":
                // Hook modified the input
                validatedInput = hookEvent.updatedInput;
                break;

            case "preventContinuation":
                // Hook wants to stop after this tool
                preventContinuation = hookEvent.shouldPreventContinuation;
                break;

            case "stopReason":
                stopReason = hookEvent.stopReason;
                break;

            case "stop":
                // Hook requested immediate stop
                return [createCancelledToolResult(toolUseId, stopReason)];
        }
    }

    // Track pre-hook duration
    const hookDuration = Date.now() - hookStartTime;
    getMetricsCollector()?.observe("pre_tool_hook_duration_ms", hookDuration);

    // ========================================
    // Stage 4: Permission Check
    // ========================================
    let permissionResult;

    // Check if hook already decided
    if (hookPermissionResult !== undefined) {
        if (hookPermissionResult.behavior === "allow" &&
            !tool.requiresUserInteraction?.() &&
            !toolUseContext.requireCanUseTool) {
            // Hook approved - bypass permission check
            debugLog(`Hook approved tool use for ${tool.name}, bypassing permission check`);
            permissionResult = hookPermissionResult;
        } else if (hookPermissionResult.behavior === "deny") {
            // Hook denied
            debugLog(`Hook denied tool use for ${tool.name}`);
            permissionResult = hookPermissionResult;
        } else {
            // Hook said "ask" or tool requires interaction - call canUseTool
            if (hookPermissionResult.updatedInput) {
                validatedInput = hookPermissionResult.updatedInput;
            }
            permissionResult = await canUseTool(tool, validatedInput, toolUseContext, assistantMessage, toolUseId);
        }
    } else {
        // No hook decision - call canUseTool
        permissionResult = await canUseTool(tool, validatedInput, toolUseContext, assistantMessage, toolUseId);
    }

    // Handle denial
    if (permissionResult.behavior !== "allow") {
        return [createDeniedToolResult(toolUseId, permissionResult.message, assistantMessage.uuid)];
    }

    // ========================================
    // Stage 5: Tool Execution
    // ========================================
    let toolResult;
    try {
        toolResult = await tool.call(validatedInput, toolUseContext, progressCallback);
    } catch (error) {
        // ========================================
        // Stage 7: Post-failure Hooks
        // ========================================
        for await (const failureEvent of executePostToolFailureHooks(...)) {
            // Handle failure hook results
        }

        return [createErrorToolResult(toolUseId, error.message, assistantMessage.uuid)];
    }

    // ========================================
    // Stage 6: Post-tool Hooks
    // ========================================
    for await (const postEvent of executePostToolHooks(...)) {
        // Handle post hook results
    }

    // ========================================
    // Stage 8: Result Formatting
    // ========================================
    return [createSuccessToolResult(toolUseId, toolResult, assistantMessage.uuid)];
}

// Mapping: fxY→toolExecutionPipeline, A→tool, q→toolUseId, K→input,
//          Y→toolUseContext, z→canUseTool, _→assistantMessage, w→messageId,
//          O→requestId, $→mcpServerType, H→mcpServerBaseUrl, j→progressCallback,
//          J→schemaResult, M→customResult, Z→hookPermissionResult,
//          y4q→executePreToolHooks, k→debugLog, d→trackEvent
```

---

## 3. Pre-tool Hook Execution Algorithm (y4q)

### What it does

Executes all registered PreToolUse hooks for a tool invocation, yielding hook results as they become available.

### How it works

```
For each registered PreToolUse hook:
    │
    ├─→ Execute hook with tool context
    │     │
    │     ├─→ Hook returns message → yield message
    │     │
    │     ├─→ Hook returns blockingError → yield denial
    │     │
    │     ├─→ Hook returns preventContinuation → yield stop flag
    │     │
    │     ├─→ Hook returns permissionBehavior → yield permission decision
    │     │     ├─→ "allow" → Tool can proceed without user prompt
    │     │     ├─→ "ask" → Prompt user but allow modification
    │     │     └─→ "deny" → Block tool execution
    │     │
    │     ├─→ Hook returns updatedInput → yield modified input
    │     │
    │     └─→ Hook returns additionalContexts → yield context injection
    │
    └─→ If abort signal: yield cancellation and stop
```

### Why this approach

**Streaming results:**
Using a generator allows hooks to produce multiple result types (messages, permission decisions, context) without collecting everything first.

**Abort support:**
Hooks check the abort signal and can be cancelled mid-execution.

```javascript
// ============================================
// executePreToolHooks - PreToolUse hook execution
// Location: chunks.146.mjs:74-216
// ============================================

// ORIGINAL (for source lookup):
async function* y4q(A, q, K, Y, z, _, w, O) {
    let $ = Date.now();
    try {
        let H = A.getAppState();
        for await (let j of LF8(q.name, Y, K, A, H.toolPermissionContext.mode,
                               A.abortController.signal, void 0, A.requestPrompt,
                               q.getToolUseSummary?.(Y))) {
            try {
                if (j.message) yield { type: "message", message: { message: j.message } };

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

                if (j.preventContinuation) {
                    yield { type: "preventContinuation", shouldPreventContinuation: !0 };
                    if (j.stopReason) yield { type: "stopReason", stopReason: j.stopReason };
                }

                if (j.permissionBehavior !== void 0) {
                    k(`Hook result has permissionBehavior=${j.permissionBehavior}`);
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
                                message: j.hookPermissionDecisionReason || `Hook PreToolUse:${q.name} asks for user input`,
                                decisionReason: J
                            }
                        };
                    } else {
                        yield {
                            type: "hookPermissionResult",
                            hookPermissionResult: {
                                behavior: j.permissionBehavior,
                                message: j.hookPermissionDecisionReason || `Hook PreToolUse:${q.name} ${formatBehavior(j.permissionBehavior)} this tool`,
                                decisionReason: J
                            }
                        };
                    }
                }

                if (j.updatedInput && j.permissionBehavior === void 0) {
                    yield { type: "hookUpdatedInput", updatedInput: j.updatedInput };
                }

                if (j.additionalContexts && j.additionalContexts.length > 0) {
                    yield {
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
                }

                if (A.abortController.signal.aborted) {
                    d("tengu_pre_tool_hooks_cancelled", {...});
                    yield { type: "message", message: { message: f4({
                        type: "hook_cancelled",
                        hookName: `PreToolUse:${q.name}`,
                        toolUseID: Y,
                        hookEvent: "PreToolUse"
                    })}};
                    yield { type: "stop" };
                    return;
                }
            } catch (J) {
                _6(J);
                yield { type: "message", message: { message: f4({
                    type: "hook_error_during_execution",
                    content: formatError(J),
                    hookName: `PreToolUse:${q.name}`,
                    toolUseID: Y,
                    hookEvent: "PreToolUse"
                })}};
                yield { type: "stop" };
            }
        }
    } catch (H) {
        _6(H);
        yield { type: "stop" };
    }
}

// READABLE (for understanding):
async function* executePreToolHooks(toolUseContext, tool, input, toolUseId,
                                     messageId, requestId, mcpServerType, mcpServerBaseUrl) {
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
                // Yield hook message if present
                if (hookResult.message) {
                    yield { type: "message", message: { message: hookResult.message } };
                }

                // Handle blocking error - convert to denial
                if (hookResult.blockingError) {
                    const formattedError = formatBlockingError(`PreToolUse:${tool.name}`, hookResult.blockingError);
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

                // Handle continuation prevention
                if (hookResult.preventContinuation) {
                    yield { type: "preventContinuation", shouldPreventContinuation: true };
                    if (hookResult.stopReason) {
                        yield { type: "stopReason", stopReason: hookResult.stopReason };
                    }
                }

                // Handle permission behavior
                if (hookResult.permissionBehavior !== undefined) {
                    debugLog(`Hook result has permissionBehavior=${hookResult.permissionBehavior}`);

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
                                    `Hook PreToolUse:${tool.name} asks for user input`,
                                decisionReason
                            }
                        };
                    } else {
                        // "deny" or other behavior
                        yield {
                            type: "hookPermissionResult",
                            hookPermissionResult: {
                                behavior: hookResult.permissionBehavior,
                                message: hookResult.hookPermissionDecisionReason ||
                                    `Hook PreToolUse:${tool.name} ${formatBehavior(hookResult.permissionBehavior)} this tool`,
                                decisionReason
                            }
                        };
                    }
                }

                // Handle input modification (without permission decision)
                if (hookResult.updatedInput && hookResult.permissionBehavior === undefined) {
                    yield { type: "hookUpdatedInput", updatedInput: hookResult.updatedInput };
                }

                // Handle additional context injection
                if (hookResult.additionalContexts && hookResult.additionalContexts.length > 0) {
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
                    trackEvent("tengu_pre_tool_hooks_cancelled", {...});
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

// Mapping: y4q→executePreToolHooks, A→toolUseContext, q→tool, K→input,
//          Y→toolUseId, z→messageId, _→requestId, w→mcpServerType, O→mcpServerBaseUrl,
//          LF8→executeHooksForTool, yF8→formatBlockingError, f4→createAttachmentMessage,
//          k→debugLog, d→trackEvent, _6→reportError
```

---

## 4. Permission Decision Algorithm

### What it does

Determines whether a tool invocation should be allowed, prompting the user if necessary.

### How it works

```
Permission check requested
    │
    ├─→ Check hook-provided decision
    │     ├─→ "allow" + no requiresUserInteraction → Skip user prompt
    │     └─→ "deny" → Return denial immediately
    │
    ├─→ Check auto-allow rules:
    │     ├─→ Tool has allowedTools permission
    │     ├─→ Tool is read-only and in non-destructive context
    │     ├─→ Tool is concurrency-safe
    │     └─→ Sandboxed Bash command
    │
    ├─→ Check permission rules from settings
    │     ├─→ Allow patterns
    │     └─→ Deny patterns
    │
    └─→ If no auto-allow: Prompt user
          ├─→ "Yes, always" → Add to allowedTools
          ├─→ "Yes, this time" → Allow once
          ├─→ "No, this time" → Deny once
          └─→ "No, always" → Add to deniedTools
```

### Edge Cases

1. **Tool requires user interaction:**
   - Even if hook approves, user must be prompted
   - Example: AskUserQuestion tool

2. **requireCanUseTool flag:**
   - Forces permission check even if hook approved
   - Used in certain security contexts

3. **Hook says "ask":**
   - User is prompted with hook's message
   - Hook can modify input before prompt

---

## 5. Error Recovery Patterns

### 5.1 Tool Not Found

```javascript
// Response: Error tool_result with helpful message
{
    type: "tool_result",
    content: "<tool_use_error>Error: No such tool available: UnknownTool</tool_use_error>",
    is_error: true,
    tool_use_id: "..."
}
```

### 5.2 Schema Validation Error

```javascript
// Response: Detailed error with field information
{
    type: "tool_result",
    content: "<tool_use_error>InputValidationError: file_path is required</tool_use_error>",
    is_error: true,
    tool_use_id: "..."
}
```

### 5.3 Permission Denied

```javascript
// Response: User-friendly denial message
{
    type: "tool_result",
    content: "<tool_use_error>Permission denied: Bash command 'rm -rf /' not allowed</tool_use_error>",
    is_error: true,
    tool_use_id: "..."
}
```

### 5.4 Tool Execution Error

```javascript
// Response: Error message with context
{
    type: "tool_result",
    content: "<tool_use_error>Error calling tool (Read): File not found: /path/to/file</tool_use_error>",
    is_error: true,
    tool_use_id: "..."
}
```

### 5.5 Cancelled

```javascript
// Response: Non-error cancellation
{
    type: "tool_result",
    content: "Tool execution cancelled",
    is_error: false,  // Not an error - user action
    tool_use_id: "..."
}
```

---

## Validation Summary

| Algorithm | Status | Key Functions Verified |
|-----------|--------|------------------------|
| Tool Dispatch | ✅ Verified | Wi6 @ chunks.146.mjs:285 |
| 8-Stage Pipeline | ✅ Verified | fxY @ chunks.146.mjs:442 |
| Pre-tool Hooks | ✅ Verified | y4q @ chunks.146.mjs:74 |
| Post-failure Hooks | ✅ Verified | E4q @ chunks.146.mjs:3 |
| Permission Decision | ✅ Verified | canUseTool flow |

---

## Quick Reference

### Pipeline Stages

| Stage | Function | Purpose |
|-------|----------|---------|
| 1 | Schema Validation | Zod safeParse |
| 2 | Custom Validation | tool.validateInput |
| 3 | Pre-tool Hooks | y4q |
| 4 | Permission Check | canUseTool |
| 5 | Tool Execution | tool.call |
| 6 | Post-tool Hooks | k4q |
| 7 | Post-failure Hooks | E4q (on error) |
| 8 | Result Formatting | createUserMessage |

### Hook Result Types

| Type | Effect |
|------|--------|
| `hookPermissionResult` | Permission decision |
| `hookUpdatedInput` | Modified input |
| `preventContinuation` | Stop after tool |
| `additionalContext` | Context injection |
| `stop` | Immediate stop |
| `message` | General message |