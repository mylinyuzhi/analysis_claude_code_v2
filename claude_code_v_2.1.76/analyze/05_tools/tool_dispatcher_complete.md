# Tool Dispatcher Complete Analysis (Claude Code 2.1.76)

> Complete source-level restoration of the tool dispatch and execution pipeline.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)

Key functions in this document:
- `toolDispatcher` (Wi6) - Top-level async generator - chunks.146.mjs:285
- `toolExecutionOrchestrator` (ZxY) - Queued async iterator - chunks.146.mjs:391
- `toolExecutionPipeline` (fxY) - 8-stage execution pipeline - chunks.146.mjs:442
- `executePreToolHooksIterator` (y4q) - Pre-tool hook execution - chunks.146.mjs:74

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
│  │ ├─ Tool lookup in session tool set                           │    │
│  │ ├─ Alias check in global registry                            │    │
│  │ ├─ Abort signal check                                        │    │
│  │ └─ Delegate to ZxY                                           │    │
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

## Complete Source Code Restoration

### 1. toolDispatcher (Wi6) - Entry Point

**What it does:**
Takes a tool_use content block from the assistant response, looks up the corresponding tool in the tool registry, and delegates execution to the full pipeline. Handles tool lookup failures, abort signals, and error wrapping.

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
            ...$ ? {
                mcpServerType: $
            } : {},
            ...H ? {
                mcpServerBaseUrl: H
            } : {},
            ...O ? {
                requestId: O
            } : {},
            ...YF() ? (() => {
                let M = gb(z);
                return M ? {
                    mcpServerName: M.serverName,
                    mcpToolName: M.mcpToolName
                } : {}
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
                ...$ ? {
                    mcpServerType: $
                } : {},
                ...H ? {
                    mcpServerBaseUrl: H
                } : {},
                ...O ? {
                    requestId: O
                } : {},
                ...YF() ? (() => {
                    let M = gb(_.name);
                    return M ? {
                        mcpServerName: M.serverName,
                        mcpToolName: M.mcpToolName
                    } : {}
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

    // Extract telemetry metadata for MCP tools
    const messageId = assistantMessage.message.id;
    const requestId = assistantMessage.requestId;
    const mcpServerType = getMcpServerType(toolName, toolUseContext.options.mcpClients);
    const mcpServerBaseUrl = getMcpServerBaseUrl(toolName, toolUseContext.options.mcpClients);

    // === STAGE 2: Handle Unknown Tool ===
    if (!tool) {
        const displayName = sanitizeToolName(toolName);

        log(`Unknown tool ${toolName}: ${toolUseBlock.id}`);
        emitTelemetry("tengu_tool_use_error", {
            error: `No such tool available: ${displayName}`,
            toolName: displayName,
            toolUseID: toolUseBlock.id,
            isMcp: toolName.startsWith("mcp__"),
            queryChainId: toolUseContext.queryTracking?.chainId,
            queryDepth: toolUseContext.queryTracking?.depth,
            ...mcpServerType && { mcpServerType },
            ...mcpServerBaseUrl && { mcpServerBaseUrl },
            ...requestId && { requestId }
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
        // === STAGE 3: Check Abort Signal ===
        if (toolUseContext.abortController.signal.aborted) {
            emitTelemetry("tengu_tool_use_cancelled", {
                toolName: sanitizeToolName(tool.name),
                toolUseID: toolUseBlock.id,
                isMcp: tool.isMcp ?? false,
                // ... telemetry fields
            });

            const cancelledResult = createCancelledToolResult(toolUseBlock.id);
            cancelledResult.content = updateCancelledMessage(CANCELLED_MESSAGE);

            yield {
                message: createUserMessage({
                    content: [cancelledResult],
                    toolUseResult: CANCELLED_MESSAGE,
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
        // === STAGE 5: Error Wrapping ===
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
//          z→toolName, _→tool, dK→findTool, ng→getDynamicToolSet, ZxY→toolExecutionOrchestrator,
//          p1→createUserMessage, d→emitTelemetry, k→log, hq→sanitizeToolName
```

**Key insight:** The two-stage tool lookup enables both session-scoped tools (filtered by mode, permissions) and globally available tools (via alias registry). MCP tools use the `mcp__` prefix pattern for disambiguation.

---

### 2. toolExecutionOrchestrator (ZxY) - Queue-Based Execution

**What it does:**
Wraps the core execution pipeline in an AsyncQueue to enable streaming progress updates during long-running tool executions.

**Why this approach:**
- Queue decouples progress events from the main execution flow
- Enables real-time progress indicators in the UI
- Handles both successful results and errors gracefully

```javascript
// ============================================
// toolExecutionOrchestrator - Queued async iterator for tool execution
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
            ...$ ? {
                mcpServerType: $
            } : {},
            ...H ? {
                mcpServerBaseUrl: H
            } : {},
            ...O ? {
                requestId: O
            } : {},
            ...YF() ? (() => {
                let M = gb(A.name);
                return M ? {
                    mcpServerName: M.serverName,
                    mcpToolName: M.mcpToolName
                } : {}
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
function toolExecutionOrchestrator(tool, toolUseId, input, toolUseContext, canUseTool, assistantMessage, messageId, requestId, mcpServerType, mcpServerBaseUrl) {
    // Create async queue for streaming results
    const queue = new AsyncQueue();

    // Start the execution pipeline
    toolExecutionPipeline(
        tool,
        toolUseId,
        input,
        toolUseContext,
        canUseTool,
        assistantMessage,
        messageId,
        requestId,
        mcpServerType,
        mcpServerBaseUrl,
        // Progress callback - called during long-running operations
        (progressData) => {
            emitTelemetry("tengu_tool_use_progress", {
                messageID: messageId,
                toolName: sanitizeToolName(tool.name),
                isMcp: tool.isMcp ?? false,
                queryChainId: toolUseContext.queryTracking?.chainId,
                queryDepth: toolUseContext.queryTracking?.depth,
                ...mcpServerType && { mcpServerType },
                ...mcpServerBaseUrl && { mcpServerBaseUrl },
                ...requestId && { requestId }
            });

            // Enqueue progress message for streaming to UI
            queue.enqueue({
                message: createToolProgressMessage({
                    toolUseID: progressData.toolUseID,
                    parentToolUseID: toolUseId,
                    data: progressData.data
                })
            });
        }
    ).then((results) => {
        // Enqueue all successful results
        for (const result of results) {
            queue.enqueue(result);
        }
    }).catch((error) => {
        // Propagate error through queue
        queue.error(error);
    }).finally(() => {
        // Signal completion
        queue.done();
    });

    return queue;  // Returns async iterable
}

// Mapping: ZxY→toolExecutionOrchestrator, A→tool, q→toolUseId, K→input, Y→toolUseContext,
//          z→canUseTool, _→assistantMessage, w→messageId, O→requestId, $→mcpServerType,
//          H→mcpServerBaseUrl, j→queue, Pi6→AsyncQueue, fxY→toolExecutionPipeline,
//          C4q→createToolProgressMessage, d→emitTelemetry, hq→sanitizeToolName
```

**Key insight:** The queue pattern enables the pipeline to emit progress updates mid-execution, which is critical for long-running operations like Bash commands. The UI can show elapsed time while the command runs.

---

### 3. toolExecutionPipeline (fxY) - 8-Stage Core Pipeline

**What it does:**
Executes a tool call through all 8 stages: validation, hooks, permissions, execution, and result formatting.

**How it works:**
1. **Stage 1**: Zod schema validation via `safeParse`
2. **Stage 2**: Custom validation via `tool.validateInput`
3. **Stage 3**: Pre-tool hooks (can modify input, deny, or bypass permission)
4. **Stage 4**: Permission check (user prompts or auto-allow)
5. **Stage 5**: Tool execution (`tool.call`)
6. **Stage 6**: Post-tool hooks (can modify MCP output)
7. **Stage 7**: Post-failure hooks (only on error)
8. **Stage 8**: Result formatting and telemetry

```javascript
// ============================================
// toolExecutionPipeline - Complete 8-stage pipeline
// Location: chunks.146.mjs:442-900
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
        return k(`${A.name} tool input error: ${u.slice(0,200)}`), d("tengu_tool_use_error", {
            error: "InputValidationError",
            errorDetails: u.slice(0, 2000),
            // ... telemetry
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
        }];
    }

    // === STAGE 2: Custom Validation ===
    let M = await A.validateInput?.(J.data, Y);
    if (M?.result === !1) {
        return k(`${A.name} tool validation error: ${M.message?.slice(0,200)}`),
               d("tengu_tool_use_error", { error: M.message, errorCode: M.errorCode, ... }),
               [{
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

    // === Bash Pre-flight Check (Special) ===
    if (A.name === Q7 && J.data && "command" in J.data) {
        let u = Y.getAppState();
        bashPreFlightCheck(J.data.command, u.toolPermissionContext, Y.abortController.signal, Y.options.isNonInteractiveSession);
    }

    // === STAGE 3: Pre-tool Hooks ===
    let D = [],        // Hook messages
        X = J.data,    // Potentially modified input
        P = !1,        // preventContinuation flag
        W,             // stopReason
        Z,             // hookPermissionResult
        G = [],        // command durations
        f = Date.now();

    for await (let u of y4q(Y, A, X, q, _.message.id, O, $, H)) {
        switch (u.type) {
            case "message":
                if (u.message.message.type === "progress") j(u.message.message);
                else {
                    D.push(u.message);
                    // Track command durations for telemetry
                }
                break;
            case "hookPermissionResult":
                Z = u.hookPermissionResult;  // Hook override
                break;
            case "hookUpdatedInput":
                X = u.updatedInput;  // Hook modified input
                break;
            case "preventContinuation":
                P = u.shouldPreventContinuation;
                break;
            case "stopReason":
                W = u.stopReason;
                break;
        }
    }

    // === STAGE 4: Permission Check ===
    let V;
    if (Z !== void 0 && Z.behavior === "allow" && !A.requiresUserInteraction?.() && !Y.requireCanUseTool) {
        // Hook approved, bypass user prompt
        k(`Hook approved tool use for ${A.name}, bypassing permission check`);
        V = Z;
    } else if (Z !== void 0 && Z.behavior === "allow" && (A.requiresUserInteraction?.() || Y.requireCanUseTool)) {
        // Hook approved but tool requires interaction
        k(`Hook approved tool use for ${A.name}, but canUseTool is required`);
        if (Z.updatedInput) X = Z.updatedInput;
        V = await z(A, X, Y, _, q);
    } else if (Z !== void 0 && Z.behavior === "deny") {
        // Hook denied
        k(`Hook denied tool use for ${A.name}`);
        V = Z;
    } else {
        // Standard permission flow
        let hookAsk = Z?.behavior === "ask" ? Z : void 0;
        if (Z?.behavior === "ask" && Z.updatedInput) X = Z.updatedInput;
        V = await z(A, X, Y, _, q, hookAsk);
    }

    // Handle permission denied
    if (V.behavior !== "allow") {
        k(`${A.name} tool permission denied`);
        // ... emit telemetry, create error result ...
        return D;
    }

    // Apply permission-modified input
    if (V.updatedInput !== void 0) X = V.updatedInput;

    // === STAGE 5: Tool Execution ===
    let R = Date.now();
    ME1();  // Mark execution start

    try {
        let result = await A.call(X, {
            ...Y,
            toolUseId: q,
            userModified: V.userModified ?? !1
        }, z, _, (progress) => {
            j(progress);  // Progress callback
        });

        let duration = Date.now() - R;
        Pt6(duration);  // Record duration

        // === STAGE 6: Post-tool Hooks ===
        // ... executePostToolHooksIterator ...

        // === STAGE 8: Result Formatting ===
        let toolResultContent = result.data && typeof result.data === "object"
            ? JSON.stringify(result.data)
            : String(result.data ?? "");

        h01(toolResultContent);  // Track result for auto-compact

        emitTelemetry("tengu_tool_use_success", {
            messageID: w,
            toolName: sanitizeToolName(A.name),
            isMcp: A.isMcp ?? false,
            durationMs: duration,
            preToolHookDurationMs: hookDuration,
            toolResultSizeBytes: toolResultContent.length,
            // ... more fields
        });

        D.push({
            message: createUserMessage({
                content: [A.mapToolResultToToolResultBlockParam(result.data, q)],
                toolUseResult: toolResultContent,
                sourceToolAssistantUUID: assistantMessage.uuid
            })
        });

        return D;

    } catch (error) {
        // === STAGE 7: Post-failure Hooks ===
        // ... executePostToolFailureHooksIterator ...

        // Format error result
        let errorMessage = error instanceof Error ? error.message : String(error);
        D.push({
            message: createUserMessage({
                content: [{
                    type: "tool_result",
                    content: `<tool_use_error>${errorMessage}</tool_use_error>`,
                    is_error: true,
                    tool_use_id: q
                }],
                toolUseResult: `Error: ${errorMessage}`,
                sourceToolAssistantUUID: assistantMessage.uuid
            })
        });

        return D;
    }
}

// Mapping: fxY→toolExecutionPipeline, A→tool, q→toolUseId, K→input, Y→toolUseContext,
//          z→canUseTool, _→assistantMessage, w→messageId, O→requestId, $→mcpServerType,
//          H→mcpServerBaseUrl, j→progressCallback, J→parseResult, M→customValidation,
//          D→hookMessages, X→input, Z→hookPermissionResult, V→permissionResult
```

**Key insight:** The pipeline uses an early-return pattern for validation errors, which means they skip hooks entirely. Only Stage 5 errors trigger PostToolFailure hooks. This is a critical distinction for hook authors.

---

## Permission Decision Algorithm

### Decision Tree

```
canUseTool Decision Flow
    │
    ├─→ Check hook result (Z)
    │   ├─→ Z.behavior === "allow" + !requiresUserInteraction()
    │   │   └─→ BYPASS: Use hook approval, skip user prompt
    │   │
    │   ├─→ Z.behavior === "allow" + requiresUserInteraction()
    │   │   └─→ FALL THROUGH: Hook approved but tool requires explicit interaction
    │   │
    │   ├─→ Z.behavior === "deny"
    │   │   └─→ DENY: Return error immediately
    │   │
    │   └─→ Z.behavior === "ask" or undefined
    │       └─→ STANDARD FLOW: Proceed to canUseTool
    │
    ├─→ Check auto-allow rules
    │   ├─→ Tool.isConcurrencySafe() && non-destructive context
    │   ├─→ Tool in allowedTools list from settings
    │   └─→ Read-only tools in trusted contexts
    │
    ├─→ Check permission rules from settings
    │   ├─→ Apply allow/deny patterns
    │   └─→ Return matched rule or continue
    │
    └─→ If no auto-allow or rule match
        └─→ PROMPT USER
            ├─→ "Yes, always" → Add to allowed, return allow
            ├─→ "Yes, this time" → Return allow (one-time)
            ├─→ "No, this time" → Return deny (one-time)
            └─→ "No, always" → Add to denied, return deny
```

### Permission Result Types

```typescript
interface PermissionResult {
  behavior: "allow" | "deny" | "ask";
  message?: string;           // Error message for deny
  updatedInput?: object;      // User-modified input
  userModified?: boolean;     // Whether input was edited
  decisionReason?: {
    type: "hook" | "config" | "user";
    hookName?: string;
    reason?: string;
  };
  contentBlocks?: ContentBlock[];  // Additional content for denial
}
```

---

## Hook Integration Points

### Pre-tool Hook Results (y4q)

| Yield Type | Description | Effect on Pipeline |
|------------|-------------|-------------------|
| `message` | Additional context message | Injected into conversation |
| `hookPermissionResult` | Permission override | Bypasses/forces user prompt |
| `hookUpdatedInput` | Modified tool input | Replaces original input |
| `preventContinuation` | Stop agent loop | Pipeline returns early |
| `stopReason` | Reason for stop | Included in error message |
| `additionalContext` | Extra context | Injected as attachment |

### Post-tool Hook Results (k4q)

| Yield Type | Description | Effect |
|------------|-------------|--------|
| `message` | Additional message | Injected after tool result |
| `blockingError` | Error from hook | Shown to user |
| `preventContinuation` | Stop agent loop | Prevents further turns |
| `updatedMCPToolOutput` | Modified MCP result | Only for MCP tools |

---

## Telemetry Events

| Event | When Fired | Key Data |
|-------|------------|----------|
| `tengu_tool_use_error` | Schema/validation failure | error type, tool name |
| `tengu_tool_use_cancelled` | Abort before execution | tool name |
| `tengu_tool_use_can_use_tool_rejected` | Permission denied | tool name, decision source |
| `tengu_tool_use_can_use_tool_allowed` | Permission granted | tool name |
| `tengu_tool_use_progress` | Progress update | tool name |
| `tengu_tool_use_success` | Execution succeeded | duration, result size |
| `tengu_pre_tool_hook_duration_ms` | Hook timing | duration |
| `tengu_deferred_tool_schema_not_sent` | Deferred tool missing schema | tool name |

---

## Cross-Module Integration

### Tools ↔ System Reminder (04)

Tool execution generates these attachment types:
- `progress` - Via `createToolProgressMessage` (U1q)
- `hook_additional_context` - From pre-tool hooks
- `hook_blocking_error` - When hook denies execution
- `task_status` - Background task state changes

### Tools ↔ MCP (06)

MCP tools are discovered and registered with `mcp__` prefix:
- `fetchMcpTools` (JE) discovers tools via `tools/list`
- MCP execution routes through `callMcpTool` (pC)
- MCP output can be modified by post-tool hooks

### Tools ↔ Hooks (11)

- `executePreToolHooks` (LF8) runs PreToolUse hooks
- `executePostToolHooks` (RF8) runs PostToolUse hooks
- `executePostToolFailureHooks` (hF8) runs on tool.call errors

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Deferred tool schema hinting, structured output support |
| 2.1.72 | Hook permission behavior override |
| 2.1.71 | Loop/Cron tools integration |
| 2.1.32 | Background agent tool filtering |
| 2.1.18 | Tool discovery from message history |