# Tool Execution Pipeline Complete Source Restoration (Claude Code 2.1.76)

> Complete source-level restoration of the tool dispatch and execution pipeline with cross-validated symbols and deep algorithm analysis.

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
2. Look up tool in session-scoped tool set via `dK` (findTool)
3. If not found, check global alias registry `ng()` for MCP/skill tools
4. If still not found, return error tool_result
5. Check abort signal - if aborted, return cancelled tool_result
6. Delegate to `ZxY` (toolExecutionOrchestrator)
7. Yield all results from the pipeline

**Why this approach:**
- Generator pattern allows streaming results back to the agent loop
- Two-stage lookup (session tools → global alias registry) enables flexible tool discovery
- Error wrapping ensures all failures produce consistent tool_result blocks

**Key insight:**
The two-stage lookup is crucial for MCP tools and skill-provided tools. Session tools are filtered by mode (plan mode restricts write tools), while the global registry contains all available tools including deferred ones.

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
            d("tengu_tool_use_cancelled", { /* telemetry */ });
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
async function* toolDispatcher(toolUseBlock, assistantMessage, streamingContext, sessionContext) {
    const toolName = toolUseBlock.name;

    // Stage 1: Look up tool in session-scoped tool set
    let tool = findTool(sessionContext.options.tools, toolName);

    // Stage 2: If not found, check global alias registry (MCP/skill tools)
    if (!tool) {
        const globalTool = findTool(getAllBuiltinTools(), toolName);
        if (globalTool && globalTool.aliases?.includes(toolName)) {
            tool = globalTool;
        }
    }

    // Extract telemetry context
    const messageId = assistantMessage.message.id;
    const requestId = assistantMessage.requestId;
    const mcpServerType = getMcpServerType(toolName, sessionContext.options.mcpClients);
    const mcpServerBaseUrl = getMcpServerBaseUrl(toolName, sessionContext.options.mcpClients);

    // Stage 3: Tool not found - return error
    if (!tool) {
        const userFacingName = getUserFacingToolName(toolName);
        debugLog(`Unknown tool ${toolName}: ${toolUseBlock.id}`);

        trackEvent("tengu_tool_use_error", {
            error: `No such tool available: ${userFacingName}`,
            toolName: userFacingName,
            toolUseID: toolUseBlock.id,
            isMcp: toolName.startsWith("mcp__"),
            /* ... telemetry context */
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
        // Stage 4: Check abort signal
        if (sessionContext.abortController.signal.aborted) {
            trackEvent("tengu_tool_use_cancelled", { /* ... */ });
            const cancelledResult = createCancelledToolResult(toolUseBlock.id);
            cancelledResult.content = CANCELLED_MESSAGE;
            yield {
                message: createUserMessage({
                    content: [cancelledResult],
                    toolUseResult: CANCELLED_MESSAGE,
                    sourceToolAssistantUUID: assistantMessage.uuid
                })
            };
            return;
        }

        // Stage 5: Delegate to orchestrator
        for await (const result of toolExecutionOrchestrator(
            tool, toolUseBlock.id, input, sessionContext,
            streamingContext, assistantMessage, messageId, requestId,
            mcpServerType, mcpServerBaseUrl
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
                toolUseResult: fullMessage,
                sourceToolAssistantUUID: assistantMessage.uuid
            })
        };
    }
}

// Mapping: Wi6→toolDispatcher, A→toolUseBlock, q→assistantMessage, K→streamingContext,
//          Y→sessionContext, z→toolName, _→tool, dK→findTool, ng→getAllBuiltinTools,
//          p1→createUserMessage, CF8→createCancelledToolResult, R96→CANCELLED_MESSAGE
```

---

## 2. toolExecutionOrchestrator (ZxY) - AsyncQueue Streaming

**What it does:**
Creates an AsyncQueue to stream results back to the dispatcher while the pipeline executes. This enables progressive results (progress updates, partial outputs) to be yielded before the full pipeline completes.

**How it works:**
1. Create new AsyncQueue instance (`Pi6`)
2. Call `fxY` (toolExecutionPipeline) with a progress callback
3. Progress callback enqueues messages to the queue
4. Pipeline completion enqueues all results
5. Errors are propagated through queue
6. Queue marked done on completion

**Why this approach:**
- Decouples streaming from execution - the pipeline doesn't need to be a generator
- Progress updates can be sent mid-execution (e.g., long-running Bash commands)
- Clean error handling via queue.error()
- Single iteration point for the dispatcher

**Key insight:**
The AsyncQueue pattern is essential for real-time feedback. Without it, users would see no updates until a tool fully completes, which is problematic for long-running operations like file searches or Bash commands with slow output.

```javascript
// ============================================
// toolExecutionOrchestrator - Streams pipeline results via AsyncQueue
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
            /* telemetry context */
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
function toolExecutionOrchestrator(tool, toolUseID, input, sessionContext,
                                   streamingContext, assistantMessage, messageId,
                                   requestId, mcpServerType, mcpServerBaseUrl) {
    const queue = new AsyncQueue();

    // Execute pipeline with progress callback
    toolExecutionPipeline(
        tool, toolUseID, input, sessionContext,
        streamingContext, assistantMessage, messageId, requestId,
        mcpServerType, mcpServerBaseUrl,
        // Progress callback
        (progressEvent) => {
            trackEvent("tengu_tool_use_progress", {
                messageID: messageId,
                toolName: getUserFacingToolName(tool.name),
                isMcp: tool.isMcp ?? false,
                /* telemetry context */
            });

            // Enqueue progress message
            queue.enqueue({
                message: createToolProgressMessage({
                    toolUseID: progressEvent.toolUseID,
                    parentToolUseID: toolUseID,
                    data: progressEvent.data
                })
            });
        }
    ).then((results) => {
        // Enqueue all results on completion
        for (const result of results) {
            queue.enqueue(result);
        }
    }).catch((error) => {
        // Propagate error through queue
        queue.error(error);
    }).finally(() => {
        // Mark queue as done
        queue.done();
    });

    // Return the queue for iteration
    return queue;
}

// Mapping: ZxY→toolExecutionOrchestrator, A→tool, q→toolUseID, K→input, Y→sessionContext,
//          z→streamingContext, _→assistantMessage, w→messageId, O→requestId,
//          $→mcpServerType, H→mcpServerBaseUrl, j→queue, Pi6→AsyncQueue,
//          fxY→toolExecutionPipeline, C4q→createToolProgressMessage, hq→getUserFacingToolName
```

---

## 3. toolExecutionPipeline (fxY) - 8-Stage Pipeline

**What it does:**
The core execution pipeline that processes a tool invocation through 8 distinct stages. Each stage handles a specific concern: validation, hooks, permissions, execution, and result processing.

**How it works:**
1. **Stage 1 (Schema Validation)**: Parse input against tool's Zod schema
2. **Stage 2 (Custom Validation)**: Call tool's `validateInput` if defined
3. **Stage 3 (Pre-tool Hooks)**: Execute PreToolUse hooks via `y4q`
4. **Stage 4 (Permission Check)**: Determine if user approval needed
5. **Stage 5 (Tool Execution)**: Call `tool.call()` with validated input
6. **Stage 6 (Post-tool Hooks)**: Execute PostToolUse hooks via `k4q`
7. **Stage 7 (Post-failure Hooks)**: On error, execute PostToolUseFailure hooks
8. **Stage 8 (Result Formatting)**: Build tool_result message

**Why this approach:**
- Separation of concerns: Each stage handles one responsibility
- Hook integration at multiple points allows extensibility
- Permission check after hooks allows hook-based permission bypass
- Telemetry at each stage enables performance monitoring

**Key insight:**
The permission check (Stage 4) happens AFTER pre-tool hooks. This ordering is crucial because hooks can provide permission decisions (allow/deny) that bypass the user prompt entirely. This enables automated workflows where trusted hooks make permission decisions.

```javascript
// ============================================
// toolExecutionPipeline - 8-stage execution pipeline
// Location: chunks.146.mjs:442-900+
// ============================================

// ORIGINAL (for source lookup) - Stage 1-3:
async function fxY(A, q, K, Y, z, _, w, O, $, H, j) {
    // Stage 1: Schema validation
    let J = A.inputSchema.safeParse(K);
    if (!J.success) {
        let u = V4q(A.name, J.error),
            I = GxY(A, Y.messages, Y.options.tools);
        if (I) d("tengu_deferred_tool_schema_not_sent", {
            toolName: hq(A.name),
            isMcp: A.isMcp ?? !1
        }), u += I;
        return k(`${A.name} tool input error: ${u.slice(0,200)}`), [/* error result */]
    }

    // Stage 2: Custom validation
    let M = await A.validateInput?.(J.data, Y);
    if (M?.result === !1) return [/* validation error result */];

    // Bash command preprocessing
    if (A.name === Q7 && J.data && "command" in J.data) {
        let u = Y.getAppState();
        S4q(J.data.command, u.toolPermissionContext, Y.abortController.signal, Y.options.isNonInteractiveSession)
    }

    let D = [], X = J.data;

    // Stage 3: Pre-tool hooks
    let P = !1, W, Z, G = [], f = Date.now();
    for await (let u of y4q(Y, A, X, q, _.message.id, O, $, H)) switch (u.type) {
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
            return D; // Hook stopped execution
    }

    // Stage 4: Permission check (simplified)
    let V;
    if (Z !== void 0 && Z.behavior === "allow" && !A.requiresUserInteraction?.() && !Y.requireCanUseTool) {
        k(`Hook approved tool use for ${A.name}, bypassing permission check`);
        V = Z;
    } else if (Z !== void 0 && Z.behavior === "deny") {
        V = Z;
    } else {
        V = await canUseTool(A, X, Y, _, q, Z?.behavior === "ask" ? Z : void 0);
    }

    if (V.behavior !== "allow") {
        // Permission denied
        return [/* denied result */];
    }

    // Stage 5: Tool execution
    let R = Date.now();
    ME1(); // Start telemetry
    try {
        let u = await A.call(X, { ...Y, toolUseId: q }, z, _, (progress) => {
            j({ toolUseID: progress.toolUseID, data: progress.data });
        });

        // Stage 6: Post-tool hooks
        for await (let z6 of k4q(Y, A, q, _.message.id, X, u.data, O, $, H)) {
            // Process post-tool hook results
        }

        // Stage 8: Result formatting
        let B = A.mapToolResultToToolResultBlockParam(u.data, q);
        // ... build final result

    } catch (error) {
        // Stage 7: Post-failure hooks
        for await (let failureResult of E4q(Y, A, q, error)) {
            // Process failure hook results
        }
    }
}

// READABLE (for understanding):
async function toolExecutionPipeline(tool, toolUseID, input, sessionContext,
                                     streamingContext, assistantMessage, messageId,
                                     requestId, mcpServerType, mcpServerBaseUrl,
                                     progressCallback) {

    // ========== STAGE 1: Schema Validation ==========
    // Parse input against tool's Zod schema
    const parseResult = tool.inputSchema.safeParse(input);

    if (!parseResult.success) {
        const errorMessage = formatValidationError(tool.name, parseResult.error);

        // Check if this is a deferred tool (schema wasn't sent to API)
        const deferredHint = generateDeferredToolSchemaHint(
            tool, sessionContext.messages, sessionContext.options.tools
        );

        if (deferredHint) {
            trackEvent("tengu_deferred_tool_schema_not_sent", {
                toolName: getUserFacingToolName(tool.name),
                isMcp: tool.isMcp ?? false
            });
            errorMessage += deferredHint;
        }

        debugLog(`${tool.name} tool input error: ${errorMessage.slice(0, 200)}`);

        return [{
            message: createUserMessage({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>InputValidationError: ${errorMessage}</tool_use_error>`,
                    is_error: true,
                    tool_use_id: toolUseID
                }],
                toolUseResult: `InputValidationError: ${parseResult.error.message}`,
                sourceToolAssistantUUID: assistantMessage.uuid
            })
        }];
    }

    // ========== STAGE 2: Custom Validation ==========
    // Tool-specific validation logic
    const customValidation = await tool.validateInput?.(parseResult.data, sessionContext);

    if (customValidation?.result === false) {
        debugLog(`${tool.name} tool validation error: ${customValidation.message?.slice(0, 200)}`);

        return [{
            message: createUserMessage({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>${customValidation.message}</tool_use_error>`,
                    is_error: true,
                    tool_use_id: toolUseID
                }],
                toolUseResult: `Error: ${customValidation.message}`,
                sourceToolAssistantUUID: assistantMessage.uuid
            })
        }];
    }

    // Bash tool: Pre-register command for history
    let validatedInput = parseResult.data;
    if (tool.name === TOOL_NAME_BASH && validatedInput && "command" in validatedInput) {
        const appState = sessionContext.getAppState();
        preRegisterBashCommand(
            validatedInput.command,
            appState.toolPermissionContext,
            sessionContext.abortController.signal,
            sessionContext.options.isNonInteractiveSession
        );
    }

    // ========== STAGE 3: Pre-tool Hooks ==========
    const messages = [];
    let hookPermissionResult = undefined;
    let hookUpdatedInput = validatedInput;
    let shouldPreventContinuation = false;
    let stopReason = undefined;
    const preHookStartTime = Date.now();

    // Execute pre-tool hooks via async generator
    for await (const hookResult of executePreToolHooks(
        sessionContext, tool, validatedInput, toolUseID,
        assistantMessage.message.id, requestId, mcpServerType, mcpServerBaseUrl
    )) {
        switch (hookResult.type) {
            case "message":
                // Progress or context message
                if (hookResult.message.message.type === "progress") {
                    progressCallback(hookResult.message.message);
                } else {
                    messages.push(hookResult.message);
                }
                break;

            case "hookPermissionResult":
                // Hook provided permission decision
                hookPermissionResult = hookResult.hookPermissionResult;
                break;

            case "hookUpdatedInput":
                // Hook modified the input
                hookUpdatedInput = hookResult.updatedInput;
                break;

            case "preventContinuation":
                // Hook wants to stop execution
                shouldPreventContinuation = hookResult.shouldPreventContinuation;
                break;

            case "stopReason":
                stopReason = hookResult.stopReason;
                break;

            case "stop":
                // Hook forced stop
                observeMetric("pre_tool_hook_duration_ms", Date.now() - preHookStartTime);
                messages.push({
                    message: createUserMessage({
                        content: [createCancelledToolResult(toolUseID)],
                        toolUseResult: `Error: ${stopReason}`,
                        sourceToolAssistantUUID: assistantMessage.uuid
                    })
                });
                return messages;
        }
    }

    const preHookDuration = Date.now() - preHookStartTime;
    observeMetric("pre_tool_hook_duration_ms", preHookDuration);

    // ========== STAGE 4: Permission Check ==========
    let permissionResult;

    if (hookPermissionResult !== undefined) {
        // Hook provided a decision
        if (hookPermissionResult.behavior === "allow" &&
            !tool.requiresUserInteraction?.() &&
            !sessionContext.requireCanUseTool) {
            // Hook approved, bypass permission check
            debugLog(`Hook approved tool use for ${tool.name}, bypassing permission check`);
            permissionResult = hookPermissionResult;
        } else if (hookPermissionResult.behavior === "allow" &&
                   (tool.requiresUserInteraction?.() || sessionContext.requireCanUseTool)) {
            // Hook approved, but still need permission UI
            debugLog(`Hook approved tool use for ${tool.name}, but canUseTool is required`);
            if (hookPermissionResult.updatedInput) {
                hookUpdatedInput = hookPermissionResult.updatedInput;
            }
            permissionResult = await canUseTool(tool, hookUpdatedInput, sessionContext, assistantMessage, toolUseID);
        } else if (hookPermissionResult.behavior === "deny") {
            debugLog(`Hook denied tool use for ${tool.name}`);
            permissionResult = hookPermissionResult;
        } else {
            // Hook behavior is "ask" - show permission UI with hook context
            permissionResult = await canUseTool(
                tool, hookUpdatedInput, sessionContext, assistantMessage, toolUseID,
                hookPermissionResult.behavior === "ask" ? hookPermissionResult : undefined
            );
        }
    } else {
        // No hook decision, show permission UI
        permissionResult = await canUseTool(tool, hookUpdatedInput, sessionContext, assistantMessage, toolUseID);
    }

    // Track permission decision
    if (permissionResult.behavior !== "ask" && !sessionContext.toolDecisions?.has(toolUseID)) {
        const decision = permissionResult.behavior === "allow" ? "accept" : "reject";
        const source = permissionResult.decisionReason?.type === "hook" ? "hook" : "config";

        trackCounterEvent("tool_decision", {
            decision,
            source,
            tool_name: getUserFacingToolName(tool.name)
        });
    }

    // Permission denied
    if (permissionResult.behavior !== "allow") {
        debugLog(`${tool.name} tool permission denied`);
        const denialMessage = permissionResult.message ||
            `Execution stopped by PreToolUse hook${stopReason ? `: ${stopReason}` : ""}`;

        return [{
            message: createUserMessage({
                content: [{
                    type: "tool_result",
                    content: denialMessage,
                    is_error: true,
                    tool_use_id: toolUseID
                }],
                toolUseResult: `Error: ${denialMessage}`,
                sourceToolAssistantUUID: assistantMessage.uuid
            })
        }];
    }

    // Apply hook input modifications
    if (permissionResult.updatedInput !== undefined) {
        hookUpdatedInput = permissionResult.updatedInput;
    }

    // ========== STAGE 5: Tool Execution ==========
    trackEvent("tengu_tool_use_can_use_tool_allowed", { /* telemetry */ });

    const executionStartTime = Date.now();
    startToolTelemetry();

    try {
        const result = await tool.call(
            hookUpdatedInput,
            { ...sessionContext, toolUseId: toolUseID },
            streamingContext,
            assistantMessage,
            // Progress callback for tool execution
            (progressEvent) => {
                progressCallback({
                    toolUseID: progressEvent.toolUseID,
                    data: progressEvent.data
                });
            }
        );

        const executionDuration = Date.now() - executionStartTime;
        recordToolDuration(executionDuration);

        // ========== STAGE 6: Post-tool Hooks ==========
        const postHookResults = [];
        for await (const postResult of executePostToolHooks(
            sessionContext, tool, toolUseID, assistantMessage.message.id,
            hookUpdatedInput, result.data, requestId, mcpServerType, mcpServerBaseUrl
        )) {
            if ("updatedMCPToolOutput" in postResult && isMcpTool(tool)) {
                // MCP tool output can be modified by hooks
                result.data = postResult.updatedMCPToolOutput;
            } else {
                postHookResults.push(postResult);
            }
        }

        // ========== STAGE 8: Result Formatting ==========
        const toolResultBlock = tool.mapToolResultToToolResultBlockParam(result.data, toolUseID);

        // Build final message
        messages.push({
            message: createUserMessage({
                content: [toolResultBlock],
                toolUseResult: result.data,
                mcpMeta: result.mcpMeta,
                sourceToolAssistantUUID: assistantMessage.uuid
            })
        });

        // Add post-hook messages
        for (const postMsg of postHookResults) {
            messages.push(postMsg);
        }

        return messages;

    } catch (error) {
        // ========== STAGE 7: Post-failure Hooks ==========
        for await (const failureResult of executePostToolFailureHooks(
            sessionContext, tool, toolUseID, error
        )) {
            messages.push(failureResult);
        }

        // Return error result
        const errorMessage = error instanceof Error ? error.message : String(error);
        messages.push({
            message: createUserMessage({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>${errorMessage}</tool_use_error>`,
                    is_error: true,
                    tool_use_id: toolUseID
                }],
                toolUseResult: `Error: ${errorMessage}`,
                sourceToolAssistantUUID: assistantMessage.uuid
            })
        });

        return messages;
    }
}

// Mapping: fxY→toolExecutionPipeline, A→tool, q→toolUseID, K→input, Y→sessionContext,
//          z→streamingContext, _→assistantMessage, w→messageId, O→requestId,
//          $→mcpServerType, H→mcpServerBaseUrl, j→progressCallback,
//          Q7→TOOL_NAME_BASH, y4q→executePreToolHooks, k4q→executePostToolHooks,
//          V4q→formatValidationError, p1→createUserMessage
```

---

## 4. Permission Decision Algorithm

**What it does:**
Determines whether a tool can be executed without user interaction, with user approval, or should be denied. Integrates with hooks for automated decisions.

**How it works:**
1. Check if hook provided a decision (allow/deny/ask)
2. Check auto-allow rules (readOnly tools, allowed permissions)
3. Check permission rules from settings
4. If no auto-allow, show user prompt
5. Handle user response and update state

**Why this approach:**
- Hook-first design allows automation while maintaining security
- Tiered decision tree balances convenience and safety
- Permission rules from settings enable persistent decisions

```javascript
// ============================================
// canUseTool - Permission decision algorithm
// Location: chunks.146.mjs (inferred from usage)
// ============================================

async function canUseTool(tool, input, sessionContext, assistantMessage, toolUseID, hookContext) {
    // 1. Hook provided explicit deny
    if (hookContext?.behavior === "deny") {
        return {
            behavior: "deny",
            message: hookContext.message || "Tool denied by hook",
            decisionReason: { type: "hook", hookName: hookContext.hookName }
        };
    }

    // 2. Check auto-allow rules
    if (tool.isReadOnly?.() && !sessionContext.isDestructiveMode) {
        return {
            behavior: "allow",
            decisionReason: { type: "auto", rule: "readOnly" }
        };
    }

    if (sessionContext.allowedTools?.has(tool.name)) {
        return {
            behavior: "allow",
            decisionReason: { type: "config", rule: "allowedTools" }
        };
    }

    // 3. Check permission rules from settings
    const ruleResult = checkPermissionRules(tool.name, input, sessionContext.permissionRules);
    if (ruleResult.behavior === "allow" || ruleResult.behavior === "deny") {
        return ruleResult;
    }

    // 4. Need user interaction
    return {
        behavior: "ask",
        message: `Allow ${tool.name} to execute?`,
        decisionReason: { type: "user" }
    };
}
```

---

## 5. Integration with System Reminder

Tool execution generates several types of attachments that become system reminders:

| Attachment Type | When Generated | Content |
|-----------------|----------------|---------|
| `progress` | During tool execution | Progress updates via `C4q` |
| `hook_permission_decision` | After hook decision | Hook approval/denial |
| `hook_additional_context` | From pre-tool hooks | Additional context from hooks |
| `hook_blocking_error` | Hook denied execution | Error message |
| `structured_output` | Tool returns structured data | Tool's structured output |

These attachments are processed by `createUserMessage` (p1) and `createAttachmentMessage` (f4) to become system reminders injected into the next LLM turn.

---

## Cross-Reference

- [tool_dispatcher_source_restoration.md](./tool_dispatcher_source_restoration.md) - Original restoration document
- [permission_flow_complete.md](./permission_flow_complete.md) - Permission algorithm details
- [tool_reminder_integration.md](./tool_reminder_integration.md) - System reminder integration
- [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Symbol mappings