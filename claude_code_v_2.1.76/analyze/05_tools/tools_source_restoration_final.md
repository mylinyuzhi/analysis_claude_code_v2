# Tools Module - Complete Source Restoration Final (Claude Code 2.1.76)

> **Complete source-level restoration** of the tool execution system with cross-validated symbols and detailed algorithm analysis.
> **Final Version** - All symbols validated, complete pipeline with hook integration.

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
                queryChainId: Y.queryTracking?.chainId,
                queryDepth: Y.queryTracking?.depth,
                ...$ ? { mcpServerType: $ } : {},
                ...H ? { mcpServerBaseUrl: H } : {},
                ...O ? { requestId: O } : {},
                ...YF() ? (() => {
                    let M = gb(_.name);
                    return M ? { mcpServerName: M.serverName, mcpToolName: M.mcpToolName } : {}
                })() : {}
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

Creates an AsyncQueue for streaming progress updates, invokes the 8-stage pipeline, and yields results as they become available.

### How it works

1. Create new AsyncQueue (Pi6)
2. Define progress callback that enqueues progress messages
3. Call toolExecutionPipeline (fxY) with the callback
4. Handle completion/error/finally to close queue

### Why this approach

- **AsyncQueue pattern** decouples progress generation from consumption
- **Promise-based orchestration** allows the pipeline to run while queue streams results
- **Progress callback** enables real-time UI updates during long-running operations

```javascript
// ============================================
// toolExecutionOrchestrator - Manages async queue for streaming
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

    // Define progress callback
    const progressCallback = (progressData) => {
        // Emit telemetry for progress
        emitTelemetry("tengu_tool_use_progress", {
            messageID: messageId,
            toolName: getDisplayName(tool.name),
            isMcp: tool.isMcp ?? false,
            queryChainId: toolUseContext.queryTracking?.chainId,
            queryDepth: toolUseContext.queryTracking?.depth,
            // ... MCP-specific telemetry
        });

        // Enqueue progress message
        queue.enqueue({
            message: createProgressMessage({
                toolUseID: progressData.toolUseID,
                parentToolUseID: toolUseId,
                data: progressData.data
            })
        });
    };

    // Execute pipeline and handle results
    toolExecutionPipeline(
        tool, toolUseId, input, toolUseContext,
        canUseTool, assistantMessage, messageId,
        requestId, mcpServerType, mcpServerBaseUrl,
        progressCallback
    ).then((results) => {
        // Enqueue all pipeline results
        for (const result of results) {
            queue.enqueue(result);
        }
    }).catch((error) => {
        queue.error(error);
    }).finally(() => {
        queue.done();
    });

    return queue;
}

// Mapping: ZxY→toolExecutionOrchestrator, A→tool, q→toolUseId, K→input, Y→toolUseContext,
//          z→canUseTool, _→assistantMessage, w→messageId, O→requestId,
//          $→mcpServerType, H→mcpServerBaseUrl, j→queue, J→progressData/results,
//          Pi6→AsyncQueue, fxY→toolExecutionPipeline, C4q→createProgressMessage
```

---

## 3. executePreToolHooks (y4q) - Hook Execution

### What it does

Executes PreToolUse hooks for the tool about to be called. Hooks can:
- Block execution with `blockingError`
- Provide permission decision with `permissionBehavior`
- Modify input with `updatedInput`
- Prevent continuation after tool execution
- Inject additional context via attachments

### How it works

1. Get current app state for hook context
2. Iterate over hook execution results via `LF8` (executeHooksForTool)
3. Process each result type:
   - `message` - Yield as message attachment
   - `blockingError` - Return deny permission result
   - `preventContinuation` - Set flag to stop after tool
   - `permissionBehavior` - Hook provided permission decision
   - `updatedInput` - Hook modified the tool input
   - `additionalContexts` - Inject context via attachments
4. Check abort signal - if aborted, yield cancelled message and stop

### Why this approach

- **Generator pattern** allows streaming hook results
- **Multiple result types** support different hook capabilities
- **Error handling** wraps hook errors in attachments

### Key insight

Hooks can provide permission decisions that bypass the normal permission flow. This enables "allow once" or "deny" decisions from external systems (like CI/CD pipelines) to be respected.

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
                message: {
                    message: j.message
                }
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
                if (yield {
                        type: "preventContinuation",
                        shouldPreventContinuation: !0
                    }, j.stopReason) yield {
                    type: "stopReason",
                    stopReason: j.stopReason
                }
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
                    hookPermissionResult: {
                        behavior: "allow",
                        updatedInput: j.updatedInput,
                        decisionReason: J
                    }
                };
                else if (j.permissionBehavior === "ask") yield {
                    type: "hookPermissionResult",
                    hookPermissionResult: {
                        behavior: "ask",
                        updatedInput: j.updatedInput,
                        message: j.hookPermissionDecisionReason ||
                                 `Hook PreToolUse:${q.name} ${EF8(j.permissionBehavior)} this tool`,
                        decisionReason: J
                    }
                };
                else yield {
                    type: "hookPermissionResult",
                    hookPermissionResult: {
                        behavior: j.permissionBehavior,
                        message: j.hookPermissionDecisionReason ||
                                 `Hook PreToolUse:${q.name} ${EF8(j.permissionBehavior)} this tool`,
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
                }, yield {
                    type: "stop"
                };
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
            }, yield {
                type: "stop"
            }
        }
    } catch (H) {
        _6(H), yield {
            type: "stop"
        };
        return
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
                // Yield message if hook produced one
                if (hookResult.message) {
                    yield {
                        type: "message",
                        message: { message: hookResult.message }
                    };
                }

                // Handle blocking error (hook denied execution)
                if (hookResult.blockingError) {
                    const errorMsg = formatBlockingError(
                        `PreToolUse:${tool.name}`,
                        hookResult.blockingError
                    );
                    yield {
                        type: "hookPermissionResult",
                        hookPermissionResult: {
                            behavior: "deny",
                            message: errorMsg,
                            decisionReason: {
                                type: "hook",
                                hookName: `PreToolUse:${tool.name}`,
                                reason: errorMsg
                            }
                        }
                    };
                }

                // Handle prevent continuation (stop after tool execution)
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

                // Handle permission behavior (hook provided decision)
                if (hookResult.permissionBehavior !== undefined) {
                    console.log(`Hook result has permissionBehavior=${hookResult.permissionBehavior}`);
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
                        yield {
                            type: "hookPermissionResult",
                            hookPermissionResult: {
                                behavior: hookResult.permissionBehavior,
                                message: hookResult.hookPermissionDecisionReason ||
                                         `Hook PreToolUse:${tool.name} ${hookResult.permissionBehavior} this tool`,
                                decisionReason
                            }
                        };
                    }
                }

                // Handle updated input (hook modified parameters)
                if (hookResult.updatedInput && hookResult.permissionBehavior === undefined) {
                    yield {
                        type: "hookUpdatedInput",
                        updatedInput: hookResult.updatedInput
                    };
                }

                // Handle additional context (injected into conversation)
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

                // Check for abort signal
                if (toolUseContext.abortController.signal.aborted) {
                    emitTelemetry("tengu_pre_tool_hooks_cancelled", {
                        toolName: getDisplayName(tool.name),
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
            } catch (error) {
                reportError(error);
                const duration = Date.now() - startTime;
                emitTelemetry("tengu_pre_tool_hook_error", {
                    messageID: messageId,
                    toolName: getDisplayName(tool.name),
                    isMcp: tool.isMcp ?? false,
                    duration,
                    queryChainId: toolUseContext.queryTracking?.chainId,
                    queryDepth: toolUseContext.queryTracking?.depth,
                    ...(mcpServerType ? { mcpServerType } : {}),
                    ...(requestId ? { requestId } : {})
                });
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
        return;
    }
}

// Mapping: y4q→executePreToolHooks, A→toolUseContext, q→tool, K→input, Y→toolUseId,
//          z→messageId, _→requestId, w→mcpServerType, O→mcpServerBaseUrl,
//          LF8→executeHooksForTool, f4→createAttachmentMessage, d→emitTelemetry,
//          yF8→formatBlockingError, EF8→formatPermissionBehavior, pT6→formatError
```

---

## 4. toolExecutionPipeline (fxY) - 8-Stage Pipeline

### What it does

The complete 8-stage execution pipeline that processes tool invocations from validation through execution to result formatting.

### How it works

1. **Stage 1: Schema Validation** - Zod safeParse on inputSchema
2. **Stage 2: Custom Validation** - Tool-specific validateInput
3. **Stage 3: Pre-tool Hooks** - Execute via y4q
4. **Stage 4: Permission Check** - canUseTool or hook override
5. **Stage 5: Tool Execution** - Call tool.call()
6. **Stage 6: Post-tool Hooks** - Execute via k4q
7. **Stage 7: Post-failure Hooks** - Execute via E4q (on error)
8. **Stage 8: Result Formatting** - Map to tool_result block

### Key Algorithm: Permission Decision Flow

```javascript
// Permission decision algorithm from fxY (simplified):

// After pre-tool hooks have run:
let hookPermissionResult;  // From hook execution

// Decision flow:
if (hookPermissionResult?.behavior === "allow" &&
    !tool.requiresUserInteraction?.() &&
    !toolUseContext.requireCanUseTool) {
    // Hook approved, bypass permission check
    permissionResult = hookPermissionResult;
} else if (hookPermissionResult?.behavior === "allow" &&
           (tool.requiresUserInteraction?.() || toolUseContext.requireCanUseTool)) {
    // Hook approved, but canUseTool is required (e.g., for user confirmation)
    permissionResult = await canUseTool(tool, input, toolUseContext, ...);
} else if (hookPermissionResult?.behavior === "deny") {
    // Hook denied
    permissionResult = hookPermissionResult;
} else {
    // No hook decision, ask user
    permissionResult = await canUseTool(tool, input, toolUseContext, ...);
}
```

---

## 5. findTool (dK) and matchesToolName (z3) - Tool Lookup

### What it does

Looks up a tool by name in a tool array, checking both the primary name and any aliases.

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
function matchesToolName(tool, name) {
    return tool.name === name || (tool.aliases?.includes(name) ?? false);
}

// Mapping: z3→matchesToolName, A→tool, q→name

// ============================================
// findTool - Find tool by name in array
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

// Mapping: dK→findTool, A→tools, q→name, K→tool, z3→matchesToolName
```

---

## 6. Permission Flow Deep Dive

### Permission Decision Algorithm

The permission flow integrates multiple sources of permission decisions:

1. **Hook Override** - Pre-tool hooks can provide `permissionBehavior`
2. **Auto-Allow Rules** - Tools with `isConcurrencySafe()` or in allowedTools
3. **Permission Rules** - Settings-based allow/deny patterns
4. **User Prompt** - Interactive dialog when no auto-allow

### Permission Result Types

| Behavior | Meaning |
|----------|---------|
| `allow` | Tool can execute |
| `deny` | Tool execution blocked |
| `ask` | User needs to confirm |

### System Reminder Integration

Permission decisions generate attachments:

```javascript
// Permission decision attachment
createAttachmentMessage({
    type: "hook_permission_decision",
    decision: "allow" | "reject",
    toolUseID: toolUseId,
    hookEvent: "PermissionRequest"
})
```

---

## 7. Cross-Module Integration

### Tools ↔ System Reminder (04)

Attachment types generated:
- `progress` - Tool execution progress updates
- `hook_additional_context` - Pre-hook context injection
- `hook_blocking_error` - Hook denial message
- `hook_cancelled` - Hook execution cancelled
- `hook_error_during_execution` - Hook threw error
- `hook_permission_decision` - Permission decision from hook
- `structured_output` - Tool returned structured data

### Tools ↔ MCP (06)

- MCP tools discovered via `fetchMcpTools` (JE)
- Tool execution routes through standard pipeline
- MCP tool annotations map to tool methods:
  - `readOnlyHint` → `isReadOnly()`
  - `destructiveHint` → `isDestructive()`
  - `openWorldHint` → `isOpenWorld()`

### Tools ↔ Hooks (11)

- `PreToolUse` hooks run before tool execution
- `PostToolUse` hooks run after successful execution
- `PostToolUseFailure` hooks run on error

### Tools ↔ Plan Mode (12)

- Plan mode restricts available tools
- `isReadOnly()` tools always allowed
- `Write`/`Edit` allowed only to plan file path
- `ExitPlanMode` is the only programmatic exit

### Tools ↔ Task System (13)

- `TaskCreate`, `TaskGet`, `TaskList`, `TaskUpdate` tools
- `TodoWrite` tool for simple todo mode
- Task operations use file locking for concurrency

---

## Symbol Validation Status

**Last validated:** 2026-03-27

All symbols in this module have been cross-validated against source code.

### Key Validated Symbols

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| Wi6 | toolDispatcher | chunks.146.mjs:285 | ✅ Correct |
| ZxY | toolExecutionOrchestrator | chunks.146.mjs:391 | ✅ Correct |
| fxY | toolExecutionPipeline | chunks.146.mjs:442 | ✅ Correct |
| y4q | executePreToolHooks | chunks.146.mjs:74 | ✅ Correct |
| dK | findTool | chunks.56.mjs:1592 | ✅ Correct |
| z3 | matchesToolName | chunks.56.mjs:1588 | ✅ Correct |
| p1 | createUserMessage | chunks.173.mjs:1378 | ✅ Correct |
| C4q | createProgressMessage | chunks.172.mjs:2943 | ✅ Correct |
| f4 | createAttachmentMessage | - | ✅ Correct |
| Pi6 | AsyncQueue | - | ✅ Correct |