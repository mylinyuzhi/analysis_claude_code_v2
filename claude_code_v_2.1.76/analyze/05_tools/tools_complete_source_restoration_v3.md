# Tools Module - Complete Source Restoration v3

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-27
> **Status**: ✅ Full source-level restoration with grep-verified symbols

---

## Overview

This document provides complete source-level restoration of all key functions in the Tools module. Each function is presented with:
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
6. Extract MCP server metadata for telemetry
7. Delegate to toolExecutionOrchestrator (ZxY)
8. Yield all results from the pipeline

### Why this approach

- **Generator pattern** allows streaming results back to the agent loop
- **Two-stage lookup** (session tools → global alias registry) enables flexible tool discovery
- **Error wrapping** ensures all failures produce consistent tool_result blocks
- **Telemetry integration** tracks tool usage patterns

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
        debugLog(`Unknown tool ${toolName}: ${toolUseBlock.id}`);
        emitTelemetry("tengu_tool_use_error", {
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
//          ZxY→toolExecutionOrchestrator, p1→createUserMessage, _6→reportError, k→debugLog
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

### Key insight

The AsyncQueue pattern enables real-time progress streaming while maintaining the async generator interface expected by the agent loop.

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
                                   assistantMessage, messageId, requestId, mcpServerType, mcpServerBaseUrl) {
    // Create AsyncQueue for streaming
    const queue = new AsyncQueue();

    // Execute pipeline with progress callback
    toolExecutionPipeline(tool, toolUseId, input, toolUseContext, canUseTool,
        assistantMessage, messageId, requestId, mcpServerType, mcpServerBaseUrl,
        (progressEvent) => {
            // Emit telemetry for progress
            emitTelemetry("tengu_tool_use_progress", {
                messageID: messageId,
                toolName: getToolDisplayName(tool.name),
                isMcp: tool.isMcp ?? false,
                queryChainId: toolUseContext.queryTracking?.chainId,
                queryDepth: toolUseContext.queryTracking?.depth,
                ...(mcpServerType && { mcpServerType }),
                ...(mcpServerBaseUrl && { mcpServerBaseUrl }),
                ...(requestId && { requestId })
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
        // Enqueue all results
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
//          z→canUseTool, _→assistantMessage, w→messageId, O→requestId, $→mcpServerType,
//          H→mcpServerBaseUrl, Pi6→AsyncQueue, fxY→toolExecutionPipeline, C4q→createProgressMessage
```

---

## 3. Pre-Tool Hooks Execution (y4q)

### What it does

Executes PreToolUse hooks with streaming results. Handles permission decisions from hooks, blocking errors, input modifications, and continuation control.

### Hook Result Types

| Type | Description | Action |
|------|-------------|--------|
| `hookPermissionResult` | Hook provided permission decision | Allow/Deny/Ask |
| `hookUpdatedInput` | Hook modified tool input | Update input for execution |
| `preventContinuation` | Hook wants to stop after tool | Set stop flag |
| `stopReason` | Custom stop message | Display to user |
| `additionalContext` | Extra context to inject | Add to conversation |
| `stop` | Immediate stop requested | Abort execution |

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
                }
            }
            if (j.preventContinuation) {
                if (yield { type: "preventContinuation", shouldPreventContinuation: !0 }, j.stopReason)
                    yield { type: "stopReason", stopReason: j.stopReason }
            }
            if (j.permissionBehavior !== void 0) {
                k(`Hook result has permissionBehavior=${j.permissionBehavior}`);
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
                    hookPermissionResult: {
                        behavior: "ask",
                        updatedInput: j.updatedInput,
                        message: j.hookPermissionDecisionReason || `Hook PreToolUse:${q.name} modified this tool`,
                        decisionReason: J
                    }
                };
                else yield {
                    type: "hookPermissionResult",
                    hookPermissionResult: {
                        behavior: j.permissionBehavior,
                        message: j.hookPermissionDecisionReason || `Hook PreToolUse:${q.name} denied this tool`,
                        decisionReason: J
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
                d("tengu_pre_tool_hooks_cancelled", {
                    toolName: hq(q.name),
                    queryChainId: A.queryTracking?.chainId,
                    queryDepth: A.queryTracking?.depth
                }), yield {
                    type: "message",
                    message: {
                        message: f4({
                            type: "hook_cancelled",
                            hookName: `PreToolUse:${q.name}`,
                            toolUseID: Y,
                            hookEvent: "PreToolUse"
                        })
                    }
                }, yield { type: "stop" };
                return
            }
        } catch (J) {
            _6(J);
            let M = Date.now() - $;
            d("tengu_pre_tool_hook_error", {
                messageID: z,
                toolName: hq(q.name),
                isMcp: q.isMcp ?? !1,
                duration: M,
                queryChainId: A.queryTracking?.chainId,
                queryDepth: A.queryTracking?.depth,
                ...w ? { mcpServerType: w } : {},
                ..._ ? { requestId: _ } : {}
            }), yield {
                type: "message",
                message: {
                    message: f4({
                        type: "hook_error_during_execution",
                        content: pT6(J),
                        hookName: `PreToolUse:${q.name}`,
                        toolUseID: Y,
                        hookEvent: "PreToolUse"
                    })
                }
            }, yield { type: "stop" }
        }
    } catch (H) {
        _6(H), yield { type: "stop" };
        return
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
            tool.name, input, toolUseId, toolUseContext,
            appState.toolPermissionContext.mode,
            toolUseContext.abortController.signal,
            undefined,
            toolUseContext.requestPrompt,
            tool.getToolUseSummary?.(toolUseId)
        )) {
            try {
                // Yield message if hook produced one
                if (hookResult.message) {
                    yield { type: "message", message: { message: hookResult.message } };
                }

                // Handle blocking error - hook denied execution
                if (hookResult.blockingError) {
                    const errorMessage = formatBlockingError(`PreToolUse:${tool.name}`, hookResult.blockingError);
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

                // Handle continuation prevention
                if (hookResult.preventContinuation) {
                    yield { type: "preventContinuation", shouldPreventContinuation: true };
                    if (hookResult.stopReason) {
                        yield { type: "stopReason", stopReason: hookResult.stopReason };
                    }
                }

                // Handle permission behavior from hook
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
                                    `Hook PreToolUse:${tool.name} modified this tool`,
                                decisionReason
                            }
                        };
                    } else {
                        yield {
                            type: "hookPermissionResult",
                            hookPermissionResult: {
                                behavior: hookResult.permissionBehavior,
                                message: hookResult.hookPermissionDecisionReason ||
                                    `Hook PreToolUse:${tool.name} denied this tool`,
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

                // Handle abort signal
                if (toolUseContext.abortController.signal.aborted) {
                    emitTelemetry("tengu_pre_tool_hooks_cancelled", {
                        toolName: getToolDisplayName(tool.name),
                        queryChainId: toolUseContext.queryTracking?.chainId,
                        queryDepth: toolUseContext.queryTracking?.depth
                    });
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
            } catch (innerError) {
                reportError(innerError);
                const duration = Date.now() - startTime;
                emitTelemetry("tengu_pre_tool_hook_error", {
                    messageID: messageId,
                    toolName: getToolDisplayName(tool.name),
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
                        message: createAttachmentMessage({
                            type: "hook_error_during_execution",
                            content: formatError(innerError),
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
        return;
    }
}

// Mapping: y4q→executePreToolHooks, A→toolUseContext, q→tool, K→input, Y→toolUseId,
//          z→messageId, _→requestId, w→mcpServerType, O→mcpServerBaseUrl,
//          LF8→executeHooksForTool, f4→createAttachmentMessage, pT6→formatError
```

---

## 4. Post-Tool Failure Hooks Execution (E4q)

### What it does

Executes PostToolUseFailure hooks when a tool throws an error. Allows hooks to handle errors, provide additional context, or modify error messages.

### Attachment Types Generated

| Type | Description |
|------|-------------|
| `hook_cancelled` | Hook execution was cancelled |
| `hook_blocking_error` | Hook produced a blocking error |
| `hook_additional_context` | Hook added extra context |
| `hook_error_during_execution` | Hook itself threw an error |

```javascript
// ============================================
// executePostToolFailureHooks - Run PostToolUseFailure hooks after tool error
// Location: chunks.146.mjs:3-72
// ============================================

// ORIGINAL (for source lookup):
async function* E4q(A, q, K, Y, z, _, w, O, $, H) {
    let j = Date.now();
    try {
        let M = A.getAppState().toolPermissionContext.mode;
        for await (let D of hF8(q.name, K, z, _, A, w, M, A.abortController.signal)) try {
            if (D.message?.type === "attachment" && D.message.attachment.type === "hook_cancelled") {
                d("tengu_post_tool_failure_hooks_cancelled", {
                    toolName: hq(q.name),
                    queryChainId: A.queryTracking?.chainId,
                    queryDepth: A.queryTracking?.depth
                }), yield {
                    message: f4({
                        type: "hook_cancelled",
                        hookName: `PostToolUseFailure:${q.name}`,
                        toolUseID: K,
                        hookEvent: "PostToolUseFailure"
                    })
                };
                continue
            }
            if (D.message && !(D.message.type === "attachment" && D.message.attachment.type === "hook_blocking_error"))
                yield { message: D.message };
            if (D.blockingError) yield {
                message: f4({
                    type: "hook_blocking_error",
                    hookName: `PostToolUseFailure:${q.name}`,
                    toolUseID: K,
                    hookEvent: "PostToolUseFailure",
                    blockingError: D.blockingError
                })
            };
            if (D.additionalContexts && D.additionalContexts.length > 0) yield {
                message: f4({
                    type: "hook_additional_context",
                    content: D.additionalContexts,
                    hookName: `PostToolUseFailure:${q.name}`,
                    toolUseID: K,
                    hookEvent: "PostToolUseFailure"
                })
            }
        } catch (X) {
            let P = Date.now() - j;
            d("tengu_post_tool_failure_hook_error", {
                messageID: Y,
                toolName: hq(q.name),
                isMcp: q.isMcp ?? !1,
                duration: P,
                queryChainId: A.queryTracking?.chainId,
                queryDepth: A.queryTracking?.depth,
                ...$ ? { mcpServerType: $ } : {},
                ...O ? { requestId: O } : {}
            }), yield {
                message: f4({
                    type: "hook_error_during_execution",
                    content: pT6(X),
                    hookName: `PostToolUseFailure:${q.name}`,
                    toolUseID: K,
                    hookEvent: "PostToolUseFailure"
                })
            }
        }
    } catch (J) {
        _6(J)
    }
}

// READABLE (for understanding):
async function* executePostToolFailureHooks(toolUseContext, tool, toolUseId, messageId,
                                             error, assistantMessage, mcpServerType,
                                             mcpServerBaseUrl, requestId, progressCallback) {
    const startTime = Date.now();
    try {
        const mode = toolUseContext.getAppState().toolPermissionContext.mode;

        // Iterate over failure hook results
        for await (const hookResult of executeFailureHooksForTool(
            tool.name, toolUseId, error, assistantMessage, toolUseContext,
            mcpServerType, mode, toolUseContext.abortController.signal
        )) {
            try {
                // Handle cancelled hook
                if (hookResult.message?.type === "attachment" &&
                    hookResult.message.attachment.type === "hook_cancelled") {
                    emitTelemetry("tengu_post_tool_failure_hooks_cancelled", {
                        toolName: getToolDisplayName(tool.name),
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

                // Yield non-blocking-error messages
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

                // Handle additional context
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
            } catch (innerError) {
                const duration = Date.now() - startTime;
                emitTelemetry("tengu_post_tool_failure_hook_error", {
                    messageID: messageId,
                    toolName: getToolDisplayName(tool.name),
                    isMcp: tool.isMcp ?? false,
                    duration,
                    queryChainId: toolUseContext.queryTracking?.chainId,
                    queryDepth: toolUseContext.queryTracking?.depth,
                    ...(mcpServerType && { mcpServerType }),
                    ...(requestId && { requestId })
                });
                yield {
                    message: createAttachmentMessage({
                        type: "hook_error_during_execution",
                        content: formatError(innerError),
                        hookName: `PostToolUseFailure:${tool.name}`,
                        toolUseID: toolUseId,
                        hookEvent: "PostToolUseFailure"
                    })
                };
            }
        }
    } catch (outerError) {
        reportError(outerError);
    }
}

// Mapping: E4q→executePostToolFailureHooks, A→toolUseContext, q→tool, K→toolUseId,
//          Y→messageId, z→error, _→assistantMessage, w→mcpServerType, O→mcpServerBaseUrl,
//          $→requestId, H→progressCallback, hF8→executeFailureHooksForTool, f4→createAttachmentMessage
```

---

## 5. Helper Functions

### getMcpServerType (PxY)

```javascript
// ============================================
// getMcpServerType - Determine MCP transport type
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

// Mapping: PxY→getMcpServerType, A→toolName, q→mcpClients, h4q→getMcpServerFromToolName
```

### getMcpServerBaseUrl (WxY)

```javascript
// ============================================
// getMcpServerBaseUrl - Get MCP server URL
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
    if (client?.type !== "connected") {
        return undefined;
    }
    return getBaseUrlFromConfig(client.config);
}

// Mapping: WxY→getMcpServerBaseUrl, A→toolName, q→mcpClients, h4q→getMcpServerFromToolName, Uj→getBaseUrlFromConfig
```

### applyInputParamAliases (PE1)

```javascript
// ============================================
// applyInputParamAliases - Apply input parameter aliases
// Location: chunks.146.mjs:240-255
// ============================================

// ORIGINAL (for source lookup):
function PE1(A, q) {
    if (!A.inputParamAliases || !w8("tengu_tool_input_aliasing", !1)) return q;
    let K = A.inputParamAliases, Y = {}, z = [];
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
    // Skip if tool has no aliases or feature is disabled
    if (!tool.inputParamAliases || !isFeatureEnabled("tengu_tool_input_aliasing", false)) {
        return input;
    }

    const aliases = tool.inputParamAliases;
    const result = {};
    const appliedAliases = [];

    for (const [key, value] of Object.entries(input)) {
        const aliasTarget = aliases[key];
        if (aliasTarget && !(aliasTarget in input)) {
            // Apply alias
            result[aliasTarget] = value;
            appliedAliases.push(`${key}->${aliasTarget}`);
        } else {
            // Keep original key
            result[key] = value;
        }
    }

    // Log if aliases were applied
    if (appliedAliases.length > 0) {
        emitTelemetry("tengu_tool_input_alias_applied", {
            toolName: getToolDisplayName(tool.name),
            aliases: appliedAliases.join(",")
        });
        return result;
    }
    return input;
}

// Mapping: PE1→applyInputParamAliases, A→tool, q→input, K→aliases, w8→isFeatureEnabled, d→emitTelemetry
```

---

## System Reminder Integration

### Attachment Types Generated by Tools

| Attachment Type | Source Function | Description |
|-----------------|-----------------|-------------|
| `progress` | C4q | Tool execution progress updates |
| `hook_permission_result` | y4q | Hook provided permission decision |
| `hook_blocking_error` | y4q, E4q | Hook denied execution |
| `hook_additional_context` | y4q, E4q | Hook added extra context |
| `hook_cancelled` | y4q, E4q | Hook execution cancelled |
| `hook_error_during_execution` | y4q, E4q | Hook threw an error |
| `hook_permission_decision` | fxY | Permission decision from PermissionRequest hook |

### Integration with 04_system_reminder

Tool execution generates attachments that become system reminders:

```
Tool execution starts
    │
    ├─→ Pre-tool hooks run (y4q)
    │     ├─→ hook_permission_result → Permission bypass/ask/deny
    │     ├─→ hook_additional_context → Extra context injection
    │     └─→ hook_blocking_error → Execution denied
    │
    ├─→ Permission check (canUseTool)
    │     └─→ User dialog if needed
    │
    ├─→ Tool execution (tool.call)
    │     └─→ Progress updates → progress attachment
    │
    └─→ Post-tool hooks run (k4q) or Post-failure hooks (E4q)
          └─→ hook_additional_context → Post-execution context
```

---

## Symbol Validation Summary

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| Wi6 | toolDispatcher | chunks.146.mjs:285 | ✅ Grep verified |
| ZxY | toolExecutionOrchestrator | chunks.146.mjs:391 | ✅ Grep verified |
| fxY | toolExecutionPipeline | chunks.146.mjs:442 | ✅ Grep verified |
| y4q | executePreToolHooks | chunks.146.mjs:74 | ✅ Grep verified |
| E4q | executePostToolFailureHooks | chunks.146.mjs:3 | ✅ Grep verified |
| PxY | getMcpServerType | chunks.146.mjs:273 | ✅ Grep verified |
| WxY | getMcpServerBaseUrl | chunks.146.mjs:279 | ✅ Grep verified |
| PE1 | applyInputParamAliases | chunks.146.mjs:240 | ✅ Grep verified |
| XxY | formatErrorForTelemetry | chunks.146.mjs:229 | ✅ Grep verified |
| R4q | getNextImagePasteId | chunks.146.mjs:257 | ✅ Grep verified |