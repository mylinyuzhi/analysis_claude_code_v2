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

## 1. Tool Dispatcher (Wi6)

### What it does
The entry point for all tool_use blocks. Routes incoming tool requests to the correct tool implementation and orchestrates the execution pipeline.

### How it works
1. Lookup tool by name in session tool set
2. Fall back to global alias registry if not found
3. Check abort signal
4. Delegate to toolExecutionOrchestrator (ZxY)

### Source Code

```javascript
// ============================================
// toolDispatcher - Routes tool_use blocks to the correct tool
// Location: chunks.146.mjs:285-379
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
            // ... telemetry fields
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
            // Return cancelled result
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
        // Error handling...
    }
}

// READABLE (for understanding):
async function* toolDispatcher(toolUseBlock, assistantMessage, canUseTool, context) {
    const toolName = toolUseBlock.name;

    // Step 1: Lookup in session tools
    let tool = findTool(context.options.tools, toolName);

    // Step 2: Check global alias registry if not found
    if (!tool) {
        const globalTool = findTool(getDynamicToolSet(), toolName);
        if (globalTool?.aliases?.includes(toolName)) {
            tool = globalTool;
        }
    }

    // Extract context info
    const messageId = assistantMessage.message.id;
    const requestId = assistantMessage.requestId;
    const mcpServerType = getMcpServerType(toolName, context.options.mcpClients);
    const mcpServerBaseUrl = getMcpServerBaseUrl(toolName, context.options.mcpClients);

    // Step 3: Handle unknown tool
    if (!tool) {
        const displayName = sanitizeToolName(toolName);
        debugLog(`Unknown tool ${toolName}: ${toolUseBlock.id}`);
        trackEvent("tengu_tool_use_error", {
            error: `No such tool available: ${displayName}`,
            toolName: displayName,
            toolUseID: toolUseBlock.id,
            isMcp: toolName.startsWith("mcp__"),
            // ... telemetry
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
        // Step 4: Check abort signal
        if (context.abortController.signal.aborted) {
            trackEvent("tengu_tool_use_cancelled", {
                toolName: sanitizeToolName(tool.name),
                toolUseID: toolUseBlock.id,
                isMcp: tool.isMcp ?? false,
                // ... telemetry
            });

            const cancelledResult = createCancelledToolResult(toolUseBlock.id);
            cancelledResult.content = formatCancelledMessage(CANCELLED_MESSAGE);

            yield {
                message: createUserMessage({
                    content: [cancelledResult],
                    toolUseResult: CANCELLED_MESSAGE,
                    sourceToolAssistantUUID: assistantMessage.uuid
                })
            };
            return;
        }

        // Step 5: Delegate to orchestrator
        for await (const result of toolExecutionOrchestrator(
            tool, toolUseBlock.id, input, context,
            canUseTool, assistantMessage, messageId,
            requestId, mcpServerType, mcpServerBaseUrl
        )) {
            yield result;
        }

    } catch (error) {
        reportError(error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        const displayMessage = `Error calling tool${tool ? ` (${tool.name})` : ""}: ${errorMessage}`;

        yield {
            message: createUserMessage({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>${displayMessage}</tool_use_error>`,
                    is_error: true,
                    tool_use_id: toolUseBlock.id
                }],
                toolUseResult: displayMessage,
                sourceToolAssistantUUID: assistantMessage.uuid
            })
        };
    }
}

// Mapping: Wi6→toolDispatcher, A→toolUseBlock, q→assistantMessage, K→canUseTool, Y→context,
//          dK→findTool, ng→getDynamicToolSet, ZxY→toolExecutionOrchestrator,
//          PxY→getMcpServerType, WxY→getMcpServerBaseUrl, p1→createUserMessage,
//          CF8→createCancelledToolResult, QT6→formatCancelledMessage, R96→CANCELLED_MESSAGE,
//          hq→sanitizeToolName, k→debugLog, d→trackEvent, _6→reportError
```

### Why this approach
The dispatcher uses a two-stage lookup (session tools → global aliases) to handle both built-in tools and dynamically registered tools (like MCP tools). The generator pattern allows streaming results for long-running operations.

### Key insight
The `aliases` check enables tool name variants (e.g., "Read" can match "read" or "file-read" aliases).

---

## 2. Tool Execution Pipeline (fxY)

### What it does
The 8-stage pipeline that processes every tool invocation. Handles validation, hooks, permissions, execution, and result formatting.

### How it works
1. **Stage 1**: Schema validation (Zod safeParse)
2. **Stage 2**: Custom validation (validateInput)
3. **Stage 3**: Pre-tool hooks (executePreToolHooks)
4. **Stage 4**: Permission check (canUseTool)
5. **Stage 5**: Tool execution (tool.call)
6. **Stage 6**: Post-tool hooks (executePostToolHooks)
7. **Stage 7**: Post-failure hooks (on error)
8. **Stage 8**: Result assembly

### Source Code

```javascript
// ============================================
// toolExecutionPipeline - 8-stage execution pipeline
// Location: chunks.146.mjs:442-700
// ============================================

// ORIGINAL (for source lookup):
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
        return k(`${A.name} tool input error: ${u.slice(0,200)}`), d("tengu_tool_use_error", {
            error: "InputValidationError",
            errorDetails: u.slice(0, 2000),
            messageID: w,
            toolName: hq(A.name),
            isMcp: A.isMcp ?? !1,
            // ... telemetry fields
        }), [{
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
        }]
    }

    // Stage 2: Custom Validation
    let M = await A.validateInput?.(J.data, Y);
    if (M?.result === !1) return k(`${A.name} tool validation error: ${M.message?.slice(0,200)}`), d("tengu_tool_use_error", {
        messageID: w,
        toolName: hq(A.name),
        error: M.message,
        errorCode: M.errorCode,
        isMcp: A.isMcp ?? !1,
        // ... telemetry
    }), [{
        message: p1({
            content: [{
                type: "tool_result",
                content: `<tool_use_error>${M.message}</tool_use_error>`,
                is_error: !0,
                tool_use_id: q
            }],
            toolUseResult: M.message,
            sourceToolAssistantUUID: _.uuid
        })
    }];

    let X = J.data,   // validated input
        P = !1,        // shouldPreventContinuation
        Z;             // hookPermissionResult

    // Stage 3: Pre-tool Hooks
    for await (let u of y4q(Y, A, X, q, _.message.id, O, $, H)) {
        switch (u.type) {
            case "hookPermissionResult": Z = u.hookPermissionResult; break;
            case "hookUpdatedInput": X = u.updatedInput; break;
            case "preventContinuation": P = u.shouldPreventContinuation; break;
            case "stopReason": // capture stop reason
            case "additionalContext": // yield additional context
            case "message": yield u;
        }
    }

    // Stage 4: Permission Check
    let u;
    if (Z !== void 0 && Z.behavior === "allow" && !A.requiresUserInteraction?.()) {
        u = Z;  // Hook approved, skip user prompt
    } else {
        u = await z(A, X, Y, _, q);  // Call canUseTool
    }

    if (u.behavior !== "allow") {
        // Permission denied
        return [{
            message: p1({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>Permission denied: ${u.message || "User rejected"}</tool_use_error>`,
                    is_error: !0,
                    tool_use_id: q
                }],
                toolUseResult: `Permission denied`,
                sourceToolAssistantUUID: _.uuid
            })
        }];
    }

    // Stage 5: Tool Execution
    let I;
    try {
        I = await A.call(X, Y, j);
    } catch (u) {
        // Stage 7: Post-failure Hooks
        for await (let I of E4q(Y, A, q, _.message.id, X, w, O, $, H)) {
            yield I;
        }
        throw u;
    }

    // Stage 6: Post-tool Hooks
    for await (let u of k4q(Y, A, q, _.message.id, X, I, w, O, $, H)) {
        yield u;
    }

    // Stage 8: Result Assembly
    let N = A.mapToolResultToToolResultBlockParam?.(I, q) ?? {
        type: "tool_result",
        content: typeof I.data === "string" ? I.data : JSON.stringify(I.data, null, 2),
        tool_use_id: q
    };

    return [{
        message: p1({
            content: [N],
            toolUseResult: I.data,
            sourceToolAssistantUUID: _.uuid,
            preventContinuation: P || void 0
        })
    }];
}

// READABLE (for understanding):
async function toolExecutionPipeline(
    tool,               // A - Tool object
    toolUseId,          // q - Unique ID for this tool use
    input,              // K - Raw input from LLM
    context,            // Y - Session context
    canUseTool,         // z - Permission checker function
    assistantMessage,   // _ - Parent assistant message
    messageId,          // w - Message ID
    requestId,          // O - Request ID
    mcpServerType,      // $ - MCP server type if applicable
    mcpServerBaseUrl,   // H - MCP server base URL
    progressCallback    // j - Progress callback function
) {
    // ========================================
    // Stage 1: Schema Validation (Zod safeParse)
    // ========================================
    const schemaResult = tool.inputSchema.safeParse(input);

    if (!schemaResult.success) {
        const errorMessage = formatSchemaError(tool.name, schemaResult.error);
        const deferredHint = getDeferredToolSchemaHint(tool, context.messages, context.options.tools);

        if (deferredHint) {
            trackEvent("tengu_deferred_tool_schema_not_sent", {
                toolName: sanitizeToolName(tool.name),
                isMcp: tool.isMcp ?? false
            });
            errorMessage += deferredHint;
        }

        debugLog(`${tool.name} tool input error: ${errorMessage.slice(0, 200)}`);
        trackEvent("tengu_tool_use_error", {
            error: "InputValidationError",
            errorDetails: errorMessage.slice(0, 2000),
            messageID: messageId,
            toolName: sanitizeToolName(tool.name),
            isMcp: tool.isMcp ?? false,
            // ... telemetry
        });

        return [createErrorToolResult(toolUseId, errorMessage, assistantMessage.uuid)];
    }

    // ========================================
    // Stage 2: Custom Validation
    // ========================================
    const customResult = await tool.validateInput?.(schemaResult.data, context);

    if (customResult?.result === false) {
        debugLog(`${tool.name} tool validation error: ${customResult.message?.slice(0, 200)}`);
        trackEvent("tengu_tool_use_error", {
            messageID: messageId,
            toolName: sanitizeToolName(tool.name),
            error: customResult.message,
            errorCode: customResult.errorCode,
            isMcp: tool.isMcp ?? false,
            // ... telemetry
        });

        return [createErrorToolResult(toolUseId, customResult.message, assistantMessage.uuid)];
    }

    let validatedInput = schemaResult.data;
    let shouldPreventContinuation = false;
    let hookPermissionResult;

    // ========================================
    // Stage 3: Pre-tool Hooks
    // ========================================
    for await (const hookEvent of executePreToolHooks(
        context, tool, validatedInput, toolUseId,
        messageId, requestId, mcpServerType, mcpServerBaseUrl
    )) {
        switch (hookEvent.type) {
            case "hookPermissionResult":
                hookPermissionResult = hookEvent.hookPermissionResult;
                break;
            case "hookUpdatedInput":
                validatedInput = hookEvent.updatedInput;
                break;
            case "preventContinuation":
                shouldPreventContinuation = hookEvent.shouldPreventContinuation;
                break;
            case "stopReason":
                // Capture stop reason
                break;
            case "additionalContext":
            case "message":
                yield hookEvent;
                break;
        }
    }

    // ========================================
    // Stage 4: Permission Check
    // ========================================
    let permissionResult;

    // If hook provided permission, use it (unless tool requires user interaction)
    if (hookPermissionResult !== undefined &&
        hookPermissionResult.behavior === "allow" &&
        !tool.requiresUserInteraction?.()) {
        permissionResult = hookPermissionResult;
    } else {
        // Otherwise, call canUseTool to prompt user
        permissionResult = await canUseTool(tool, validatedInput, context, assistantMessage, toolUseId);
    }

    if (permissionResult.behavior !== "allow") {
        // Permission denied - return error result
        const denyMessage = permissionResult.message || "User rejected";
        return [createErrorToolResult(toolUseId, `Permission denied: ${denyMessage}`, assistantMessage.uuid)];
    }

    // ========================================
    // Stage 5: Tool Execution
    // ========================================
    let toolResult;

    try {
        toolResult = await tool.call(validatedInput, context, progressCallback);
    } catch (error) {
        // ========================================
        // Stage 7: Post-failure Hooks (on error only)
        // ========================================
        for await (const failureEvent of executePostToolFailureHooks(
            context, tool, toolUseId, messageId,
            validatedInput, mcpServerType, requestId, mcpServerBaseUrl
        )) {
            yield failureEvent;
        }
        throw error;
    }

    // ========================================
    // Stage 6: Post-tool Hooks
    // ========================================
    for await (const postEvent of executePostToolHooks(
        context, tool, toolUseId, messageId,
        validatedInput, toolResult, mcpServerType, requestId, mcpServerBaseUrl
    )) {
        yield postEvent;
    }

    // ========================================
    // Stage 8: Result Assembly
    // ========================================
    const toolResultBlock = tool.mapToolResultToToolResultBlockParam?.(toolResult, toolUseId) ?? {
        type: "tool_result",
        content: typeof toolResult.data === "string"
            ? toolResult.data
            : JSON.stringify(toolResult.data, null, 2),
        tool_use_id: toolUseId
    };

    return [{
        message: createUserMessage({
            content: [toolResultBlock],
            toolUseResult: toolResult.data,
            sourceToolAssistantUUID: assistantMessage.uuid,
            preventContinuation: shouldPreventContinuation || undefined
        })
    }];
}

// Mapping: fxY→toolExecutionPipeline, A→tool, q→toolUseId, K→input, Y→context,
//          z→canUseTool, _→assistantMessage, w→messageId, O→requestId,
//          $→mcpServerType, H→mcpServerBaseUrl, j→progressCallback,
//          V4q→formatSchemaError, GxY→getDeferredToolSchemaHint, hq→sanitizeToolName,
//          y4q→executePreToolHooks, k4q→executePostToolHooks, E4q→executePostToolFailureHooks,
//          p1→createUserMessage, k→debugLog, d→trackEvent
```

### Why this approach
The 8-stage pipeline provides multiple extension points:
- **Hooks** (Stage 3, 6, 7) allow user code to intercept and modify behavior
- **Permission check** (Stage 4) can be bypassed by hooks for automation
- **Custom validation** (Stage 2) enables tool-specific validation logic

### Key insight
The `preventContinuation` flag from hooks allows stopping the agent after tool execution without stopping the current turn.

---

## 3. Pre-Tool Hook Execution (y4q)

### What it does
Executes PreToolUse hooks and yields events for permission decisions, input modifications, and additional context.

### How it works
1. Get app state for mode context
2. Iterate over hook results
3. Yield events for each hook decision type

### Source Code

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
            // Yield message if present
            if (j.message) yield { type: "message", message: { message: j.message } };

            // Handle blocking error
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

            // Handle prevent continuation
            if (j.preventContinuation) {
                yield { type: "preventContinuation", shouldPreventContinuation: true };
                if (j.stopReason) yield { type: "stopReason", stopReason: j.stopReason };
            }

            // Handle permission behavior from hook
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
                                     `Hook PreToolUse:${q.name} asked for this tool`,
                            decisionReason: J
                        }
                    };
                } else {
                    yield {
                        type: "hookPermissionResult",
                        hookPermissionResult: {
                            behavior: j.permissionBehavior,
                            message: j.hookPermissionDecisionReason ||
                                     `Hook PreToolUse:${q.name} ${formatBehavior(j.permissionBehavior)} this tool`,
                            decisionReason: J
                        }
                    };
                }
            }

            // Handle updated input (without permission behavior)
            if (j.updatedInput && j.permissionBehavior === void 0) {
                yield { type: "hookUpdatedInput", updatedInput: j.updatedInput };
            }

            // Handle additional contexts
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

        } catch (X) {
            // Hook execution error
            let P = Date.now() - $;
            trackEvent("tengu_pre_tool_hook_error", {
                messageID: z,
                toolName: sanitizeToolName(q.name),
                isMcp: q.isMcp ?? false,
                duration: P,
                // ... telemetry
            });
            yield {
                message: createAttachmentMessage({
                    type: "hook_error_during_execution",
                    content: formatHookError(X),
                    hookName: `PreToolUse:${q.name}`,
                    toolUseID: Y,
                    hookEvent: "PreToolUse"
                })
            };
        }
    } catch (J) {
        reportError(J);
    }
}

// READABLE (for understanding):
async function* executePreToolHooks(
    toolUseContext,     // A - Session context
    tool,               // q - Tool object
    input,              // K - Tool input
    toolUseId,          // Y - Tool use ID
    messageId,          // z - Message ID
    requestId,          // _ - Request ID (not used)
    mcpServerType,      // w - MCP server type
    mcpServerBaseUrl    // O - MCP server base URL
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
            tool.getToolUseSummary?.(input)
        )) {
            try {
                // Yield message if hook produced one
                if (hookResult.message) {
                    yield { type: "message", message: { message: hookResult.message } };
                }

                // Handle blocking error (hook denied execution)
                if (hookResult.blockingError) {
                    const formattedError = formatHookBlockingError(
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

                // Handle prevent continuation (stop after tool)
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

                // Handle permission behavior (allow/ask/deny from hook)
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
                                         `Hook PreToolUse:${tool.name} asked for this tool`,
                                decisionReason
                            }
                        };
                    } else {
                        // deny or other behavior
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

                // Handle updated input (without permission decision)
                if (hookResult.updatedInput && hookResult.permissionBehavior === undefined) {
                    yield {
                        type: "hookUpdatedInput",
                        updatedInput: hookResult.updatedInput
                    };
                }

                // Handle additional contexts (extra context to inject)
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

            } catch (hookError) {
                // Handle individual hook error
                const duration = Date.now() - startTime;
                trackEvent("tengu_pre_tool_hook_error", {
                    messageID: messageId,
                    toolName: sanitizeToolName(tool.name),
                    isMcp: tool.isMcp ?? false,
                    duration,
                    // ... telemetry
                });

                yield {
                    message: createAttachmentMessage({
                        type: "hook_error_during_execution",
                        content: formatHookError(hookError),
                        hookName: `PreToolUse:${tool.name}`,
                        toolUseID: toolUseId,
                        hookEvent: "PreToolUse"
                    })
                };
            }
        }

    } catch (error) {
        reportError(error);
    }
}

// Mapping: y4q→executePreToolHooks, A→toolUseContext, q→tool, K→input, Y→toolUseId,
//          z→messageId, _→requestId, w→mcpServerType, O→mcpServerBaseUrl,
//          LF8→executeHooksForTool, yF8→formatHookBlockingError, EF8→formatBehavior,
//          f4→createAttachmentMessage, hq→sanitizeToolName, k→debugLog, d→trackEvent
```

### Why this approach
Using a generator pattern allows:
1. **Streaming results** - Hook messages can be displayed as they arrive
2. **Early termination** - If a hook denies, we can stop immediately
3. **Multiple yield types** - Different event types for different outcomes

### Key insight
The hook can provide `permissionBehavior` which bypasses the normal permission prompt. This enables automation scenarios where hooks pre-approve certain tools.

---

## 4. Find Tool (dK) and Matches Tool Name (z3)

### What it does
Looks up a tool by name in a tool array, checking both the primary name and aliases.

### Source Code

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

// ============================================
// findTool - Find tool by name in tool array
// Location: chunks.56.mjs:1592-1594
// ============================================

// ORIGINAL (for source lookup):
function dK(A, q) {
    return A.find((K) => z3(K, q))
}

// READABLE (for understanding):
function findTool(tools, name) {
    return tools.find((tool) => matchesToolName(tool, name));
}

// Mapping: dK→findTool, A→tools, q→name, z3→matchesToolName
```

### Key insight
The nullish coalescing (`?? false`) ensures that tools without an `aliases` property are handled correctly.

---

## 5. Post-Tool Failure Hook Execution (E4q)

### What it does
Executes PostToolUseFailure hooks when a tool throws an error during execution.

### Source Code

```javascript
// ============================================
// executePostToolFailureHooks - Run hooks after tool execution failure
// Location: chunks.146.mjs:3-72
// ============================================

// ORIGINAL (for source lookup):
async function* E4q(A, q, K, Y, z, _, w, O, $, H) {
    let j = Date.now();
    try {
        let M = A.getAppState().toolPermissionContext.mode;
        for await (let D of hF8(q.name, z, _, A, w, M, A.abortController.signal)) try {
            // Handle hook cancelled
            if (D.message?.type === "attachment" && D.message.attachment.type === "hook_cancelled") {
                d("tengu_post_tool_failure_hooks_cancelled", {
                    toolName: hq(q.name),
                    queryChainId: A.queryTracking?.chainId,
                    queryDepth: A.queryTracking?.depth
                });
                yield {
                    message: f4({
                        type: "hook_cancelled",
                        hookName: `PostToolUseFailure:${q.name}`,
                        toolUseID: K,
                        hookEvent: "PostToolUseFailure"
                    })
                };
                continue;
            }

            // Yield message if present
            if (D.message && !(D.message.type === "attachment" &&
                               D.message.attachment.type === "hook_blocking_error")) {
                yield { message: D.message };
            }

            // Handle blocking error
            if (D.blockingError) {
                yield {
                    message: f4({
                        type: "hook_blocking_error",
                        hookName: `PostToolUseFailure:${q.name}`,
                        toolUseID: K,
                        hookEvent: "PostToolUseFailure",
                        blockingError: D.blockingError
                    })
                };
            }

            // Handle additional contexts
            if (D.additionalContexts && D.additionalContexts.length > 0) {
                yield {
                    message: f4({
                        type: "hook_additional_context",
                        content: D.additionalContexts,
                        hookName: `PostToolUseFailure:${q.name}`,
                        toolUseID: K,
                        hookEvent: "PostToolUseFailure"
                    })
                };
            }

        } catch (X) {
            // Hook execution error
            let P = Date.now() - j;
            d("tengu_post_tool_failure_hook_error", {
                messageID: Y,
                toolName: hq(q.name),
                isMcp: q.isMcp ?? !1,
                duration: P,
                // ... telemetry
            });
            yield {
                message: f4({
                    type: "hook_error_during_execution",
                    content: pT6(X),
                    hookName: `PostToolUseFailure:${q.name}`,
                    toolUseID: K,
                    hookEvent: "PostToolUseFailure"
                })
            };
        }
    } catch (J) {
        _6(J);
    }
}

// READABLE (for understanding):
async function* executePostToolFailureHooks(
    toolUseContext,     // A - Session context
    tool,               // q - Tool object
    toolUseId,          // K - Tool use ID
    messageId,          // Y - Message ID
    input,              // z - Tool input that failed
    mcpServerType,      // _ - MCP server type (not used)
    requestId,          // w - Request ID
    mcpServerBaseUrl,   // O - MCP server base URL (not used)
    progressCallback    // $ - Progress callback (not used)
) {
    const startTime = Date.now();

    try {
        const mode = toolUseContext.getAppState().toolPermissionContext.mode;

        for await (const hookResult of executePostToolFailureHooksCore(
            tool.name, input, requestId, toolUseContext, mode,
            toolUseContext.abortController.signal
        )) {
            try {
                // Handle hook cancelled
                if (hookResult.message?.type === "attachment" &&
                    hookResult.message.attachment.type === "hook_cancelled") {

                    trackEvent("tengu_post_tool_failure_hooks_cancelled", {
                        toolName: sanitizeToolName(tool.name),
                        queryChainId: toolUseContext.queryTracking?.chainId,
                        queryDepth: toolUseContext.queryTracking?.depth
                    });

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

                // Yield message (skip blocking error attachments)
                if (hookResult.message &&
                    !(hookResult.message.type === "attachment" &&
                      hookResult.message.attachment.type === "hook_blocking_error")) {
                    yield { message: hookResult.message };
                }

                // Handle blocking error
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

                // Handle additional contexts
                if (hookResult.additionalContexts && hookResult.additionalContexts.length > 0) {
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
                const duration = Date.now() - startTime;
                trackEvent("tengu_post_tool_failure_hook_error", {
                    messageID: messageId,
                    toolName: sanitizeToolName(tool.name),
                    isMcp: tool.isMcp ?? false,
                    duration,
                    // ... telemetry
                });

                yield {
                    message: createAttachmentMessage({
                        type: "hook_error_during_execution",
                        content: formatHookError(hookError),
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
//          Y→messageId, z→input, _→mcpServerType, w→requestId, O→mcpServerBaseUrl,
//          hF8→executePostToolFailureHooksCore, f4→createAttachmentMessage,
//          pT6→formatHookError, hq→sanitizeToolName, d→trackEvent, _6→reportError
```

### Key insight
PostToolUseFailure hooks run even when the tool throws an error, allowing cleanup, logging, or alternative action handling.

---

## Summary

### Validated Symbols

| Obfuscated | Readable | Location | Status |
|------------|----------|----------|--------|
| Wi6 | toolDispatcher | chunks.146.mjs:285 | ✅ Verified |
| fxY | toolExecutionPipeline | chunks.146.mjs:442 | ✅ Verified |
| y4q | executePreToolHooks | chunks.146.mjs:74 | ✅ Verified |
| E4q | executePostToolFailureHooks | chunks.146.mjs:3 | ✅ Verified |
| dK | findTool | chunks.56.mjs:1592 | ✅ Verified |
| z3 | matchesToolName | chunks.56.mjs:1588 | ✅ Verified |

### Key Dependencies

| Symbol | Purpose |
|--------|---------|
| p1 | createUserMessage |
| f4 | createAttachmentMessage |
| V4q | formatSchemaError |
| GxY | getDeferredToolSchemaHint |
| hq | sanitizeToolName |
| k | debugLog |
| d | trackEvent |
| _6 | reportError |
| LF8 | executeHooksForTool |
| hF8 | executePostToolFailureHooksCore |