# Tool Execution Pipeline (Claude Code 2.1.76)

> Complete tool dispatch lifecycle: lookup, input validation, pre-hook execution, permission check, sandbox integration, tool call, post-hook execution, and result formatting.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `toolDispatcher` (Wi6) - Top-level async generator that dispatches a single tool_use block
- `toolExecutionOrchestrator` (ZxY) - Creates queued async iterator wrapping the full execution pipeline
- `toolExecutionPipeline` (fxY) - Core pipeline: validate, pre-hooks, permission, execute, post-hooks
- `executePreToolHooksIterator` (y4q) - Pre-tool hook execution with permission override support
- `executePostToolHooksIterator` (k4q) - Post-tool hook execution with MCP output modification
- `executePostToolFailureHooksIterator` (E4q) - Post-failure hook execution

---

## Architecture Overview

```
Assistant message with tool_use block
  │
  ▼
Wi6 (toolDispatcher) ─── Tool lookup in registry
  │
  ▼
ZxY (toolExecutionOrchestrator) ─── Queued async iterator
  │
  ▼
fxY (toolExecutionPipeline)
  ├── 1. Input schema validation (Zod safeParse)
  ├── 2. Custom input validation (tool.validateInput)
  ├── 3. Pre-tool hooks (y4q)
  │     ├── Hook can: allow, deny, ask, update input
  │     ├── Hook can: prevent continuation
  │     └── Hook can: provide additional context
  ├── 4. Permission check (canUseTool)
  │     ├── Auto-allowed by rules
  │     ├── User prompted for decision
  │     └── Hook-overridden (skip user prompt)
  ├── 5. Tool execution (tool.call)
  ├── 6. Post-tool hooks (k4q)
  │     ├── Hook can: modify MCP tool output
  │     ├── Hook can: prevent continuation
  │     └── Hook can: provide additional context
  └── 7. Result formatting & telemetry
```

---

## Tool Dispatch Entry Point

### toolDispatcher - Routes a tool_use block to the correct tool

**What it does:** Takes a tool_use content block from the assistant response, looks up the corresponding tool in the tool registry, and delegates execution to the full pipeline.

**How it works:**

1. **Tool lookup**: Searches `Y.options.tools` (the current tool set) for a tool matching the tool_use name. If not found, also checks `ng()` (dynamically loaded tools) for alias matches.

2. **Abort check**: If the abort controller is already signaled, emits a cancelled tool result immediately without executing.

3. **MCP metadata extraction**: For MCP tools (names starting with `mcp__`), extracts the server type and base URL for telemetry.

4. **Delegation**: Calls `ZxY` (toolExecutionOrchestrator) which wraps the full pipeline in a queued async iterator.

5. **Error wrapping**: Any uncaught errors are wrapped in a `<tool_use_error>` content block.

```javascript
// ============================================
// toolDispatcher - Routes tool_use blocks to the correct tool
// Location: chunks.146.mjs:285-389
// ============================================

// ORIGINAL (for source lookup):
async function* Wi6(A, q, K, Y) {
    let z = A.name, _ = dK(Y.options.tools, z);
    if (!_) { let J = dK(ng(), z); if (J && J.aliases?.includes(z)) _ = J }
    if (!_) { yield { message: p1({ content: [{ type: "tool_result", content: `<tool_use_error>Error: No such tool available: ${z}</tool_use_error>`, is_error: !0, tool_use_id: A.id }] }) }; return }
    // ... abort check, then delegate to ZxY ...
    for await (let J of ZxY(_, A.id, j, Y, K, q, w, O, $, H)) yield J
}

// READABLE (for understanding):
async function* toolDispatcher(toolUseBlock, assistantMessage, canUseTool, toolUseContext) {
    let toolName = toolUseBlock.name;
    let tool = findTool(toolUseContext.options.tools, toolName);
    if (!tool) { /* check alias registry via ng() dynamic tools */ }
    if (!tool) { yield errorResult(`No such tool available: ${toolName}`); return; }
    if (toolUseContext.abortController.signal.aborted) { yield cancelledResult(); return; }
    for await (let result of toolExecutionOrchestrator(tool, toolUseBlock.id, toolUseBlock.input, toolUseContext, canUseTool, assistantMessage, ...)) {
        yield result;
    }
}

// Mapping: Wi6→toolDispatcher, A→toolUseBlock, q→assistantMessage, K→canUseTool, Y→toolUseContext, z→toolName, _→tool, ng→getDynamicToolSet, ZxY→toolExecutionOrchestrator
```

**Key insight:** The tool registry lookup supports two paths: direct name match and alias match. Aliases are used when MCP tools or skill-provided tools have alternative names. The alias check happens against `ng()` (a lazy-loaded global tool set) rather than the session-scoped tools, enabling cross-session tool discovery.

---

## Input Validation Pipeline

### Schema Validation + Custom Validation

**What it does:** Validates tool input in two stages before any execution or permission checks.

**How it works:**

1. **Zod schema validation**: Every tool has an `inputSchema` (Zod schema). The input is validated via `safeParse`. If validation fails, a formatted error is returned immediately without executing the tool.

2. **Custom validation**: If the tool defines `validateInput`, it is called with the parsed data and the toolUseContext. This enables runtime checks that cannot be expressed in static schemas (e.g., checking if a file path exists, or if a command is safe to execute).

```javascript
// ============================================
// Input Validation - Two-stage validation before execution
// Location: chunks.146.mjs:442-570 (fxY)
// ============================================

// ORIGINAL (for source lookup):
let J = A.inputSchema.safeParse(K);
if (!J.success) {
    let y = V4q(A.name, J.error);
    return [{ message: p1({ content: [{ type: "tool_result", content: `<tool_use_error>InputValidationError: ${y}</tool_use_error>`, is_error: !0, tool_use_id: q }] }) }]
}
let D = await A.validateInput?.(J.data, Y);
if (D?.result === !1) return [{ message: p1({ content: [{ type: "tool_result", content: `<tool_use_error>${D.message}</tool_use_error>` }] }) }];

// READABLE (for understanding):
let parseResult = tool.inputSchema.safeParse(input);
if (!parseResult.success) {
    let errorMessage = formatValidationError(tool.name, parseResult.error);
    return [{ message: createUserMessage({ content: [{ type: "tool_result", content: `InputValidationError: ${errorMessage}`, is_error: true }] }) }];
}
let customValidation = await tool.validateInput?.(parseResult.data, toolUseContext);
if (customValidation?.result === false) {
    return [{ message: createUserMessage({ content: [{ type: "tool_result", content: customValidation.message, is_error: true }] }) }];
}

// Mapping: A→tool, K→input, J→parseResult (safeParse), D→customValidation, q→toolUseId, Y→toolUseContext, V4q→formatValidationError
```

**Why this approach:**
- Schema validation catches malformed inputs from the LLM (missing fields, wrong types) before any side effects occur
- Custom validation handles domain-specific rules: the Bash tool validates command safety, the Edit tool checks file existence, etc.
- Validation errors are returned as `is_error: true` tool results, which the LLM sees as "the tool failed" and can adjust its approach

**Key insight:** The Bash tool has an additional special check after validation: `g1q` (bashPreFlightCheck) which marks certain commands as "potentially long-running" via `W74` (markAsLongRunning). This happens between validation and pre-hooks, enabling the UI to show a progress indicator for slow commands.

### Validation Failures and Hook Triggering

**Critical distinction:** Not all tool failures trigger `PostToolUseFailure` hooks. Only Stage 5 (`tool.call()`) failures do.

| Failure point | Returns `is_error: true`? | Triggers PostToolUseFailure hooks? |
|---------------|--------------------------|-------------------------------------|
| Stage 1: Schema validation fails | Yes | **No** — early return before hooks |
| Stage 2: `validateInput` returns false | Yes | **No** — early return before hooks |
| Stage 3-4: Pre-hooks or permission denied | Yes | **No** — execution never reaches tool.call |
| Stage 5: `tool.call()` throws exception | Yes | **Yes** — `E4q` runs via `fxY` error handler |

**Why validation errors skip hooks:** The `fxY` pipeline returns early on validation failure before the hook stages are even reached. `E4q` (executePostToolFailureHooksIterator) is only invoked in the exception handler that wraps `tool.call()`.

**Hooks receive pre-modified input:** When a PreToolUse hook updates the input (`updatedInput`), the modified input is used for execution — but the hook-modified input is **not** re-validated by the schema. Hooks receive already-validated data and are trusted to maintain type correctness.

---

## Pre-Tool Hook Execution

### executePreToolHooksIterator - Pre-execution hook pipeline

**What it does:** Runs all registered `PreToolUse` hooks before tool execution, giving hooks the ability to allow, deny, modify input, or prevent continuation entirely.

**How it works:**

1. Calls `LF8` (executePreToolHooks generator) with the tool name, input, and context
2. Processes each hook result, which can contain:
   - **`blockingError`**: Creates a deny permission result, blocking execution
   - **`preventContinuation`**: Stops the entire tool execution pipeline
   - **`permissionBehavior`**: `"allow"` (bypass user prompt), `"ask"` (force user prompt), or `"deny"` (block execution)
   - **`updatedInput`**: Modified tool input to use instead of the original
   - **`additionalContexts`**: Extra context messages to inject into the conversation
3. If the abort signal fires during hook execution, emits a cancellation message

```javascript
// ============================================
// executePreToolHooksIterator - Pre-tool hook execution
// Location: chunks.146.mjs:74-216
// ============================================

// ORIGINAL (for source lookup):
async function* y4q(A, q, K, Y, z, _, w, O) {
    let $ = Date.now();
    let H = A.getAppState();
    for await (let j of LF8(q.name, Y, K, A, H.toolPermissionContext.mode, A.abortController.signal, void 0, A.requestPrompt, q.getToolUseSummary?.(K))) try {
        if (j.blockingError) { let J = yF8(`PreToolUse:${q.name}`, j.blockingError); yield { type: "hookPermissionResult", hookPermissionResult: { behavior: "deny", message: J, decisionReason: { type: "hook", hookName: `PreToolUse:${q.name}`, reason: J } } } }
        if (j.preventContinuation) { yield { type: "preventContinuation", shouldPreventContinuation: !0 }; if (j.stopReason) yield { type: "stopReason", stopReason: j.stopReason } }
        if (j.permissionBehavior !== void 0) {
            if (j.permissionBehavior === "allow") yield { type: "hookPermissionResult", hookPermissionResult: { behavior: "allow", updatedInput: j.updatedInput } };
        }
        if (j.updatedInput && j.permissionBehavior === void 0) yield { type: "hookUpdatedInput", updatedInput: j.updatedInput };
    } catch (X) { /* log error, yield stop */ }
}

// READABLE (for understanding):
async function* executePreToolHooksIterator(toolUseContext, tool, input, toolUseId, ...) {
    let appState = await toolUseContext.getAppState();
    for await (let hookResult of executePreToolHooks(tool.name, toolUseId, input, toolUseContext, appState.toolPermissionContext.mode, abortSignal)) {
        if (hookResult.blockingError) yield denyPermission(hookResult.blockingError);
        if (hookResult.preventContinuation) yield stopExecution(hookResult.stopReason);
        if (hookResult.permissionBehavior) yield permissionOverride(hookResult.permissionBehavior, hookResult.updatedInput);
        if (hookResult.updatedInput && !hookResult.permissionBehavior) yield inputUpdate(hookResult.updatedInput);
        if (hookResult.additionalContexts?.length > 0) yield additionalContext(hookResult.additionalContexts);
    }
}

// Mapping: y4q→executePreToolHooksIterator, A→toolUseContext, q→tool, K→input, Y→toolUseId, LF8→executePreToolHooks
```

**Why this approach:**
- Hooks run as generators, allowing multiple hooks to contribute results in sequence
- Permission behavior override lets hooks bypass or force user prompts, enabling automated workflows (CI/CD pipelines) and safety gates (security review hooks)
- Input modification before permission check means hooks can sanitize/transform inputs before the user sees them in the permission dialog

**Key insight:** When a hook sets `permissionBehavior: "allow"`, it can bypass the user permission dialog entirely -- but ONLY if the tool does not `requiresUserInteraction()`. If the tool does require interaction (like ExitPlanMode), the hook's allow is downgraded to a regular permission check. This prevents hooks from silently approving destructive operations that the tool author explicitly marked as requiring human oversight.

---

## Permission Check

### canUseTool Decision Flow

**What it does:** After pre-hooks, the permission system determines whether the tool call should proceed. This integrates hook results with the standard permission model.

**How it works:**

The decision tree in `fxY` is:

1. **Hook allowed + no user interaction required**: Tool executes immediately, no user prompt
2. **Hook allowed + user interaction required**: Falls through to `canUseTool` despite hook approval
3. **Hook denied**: Tool is immediately denied, returns error result
4. **Hook "ask"**: Forces user prompt even if auto-allow rules would normally permit it
5. **No hook override**: Standard `canUseTool` flow (auto-allow rules, user prompt, etc.)

After the decision, if denied, telemetry is logged and a `<tool_use_error>` result is returned. The user's decision is tracked in `toolDecisions` map for reporting.

**Key insight:** The permission check can also return `updatedInput`, meaning the user may have modified the tool input during the approval dialog (e.g., editing a command before approving it). This modified input replaces the original for execution.

---

## Tool Execution

### tool.call - The actual tool execution

**What it does:** Invokes the tool's `call` method with the (possibly modified) input and full context.

**How it works:**

1. `tool.call(validatedInput, toolUseContext, canUseTool, assistantMessage, progressCallback)` is awaited
2. Duration is measured for telemetry
3. File-related metadata is extracted for attribution tracking (file paths for Read/Edit/Write, command for Bash)
4. Success telemetry is logged with tool name, duration, result size, file extension, MCP metadata, and query tracking info

The tool itself handles sandboxing internally -- the Bash tool uses its own sandbox wrapper, file tools check permissions through their own mechanisms. The pipeline does not impose a sandbox layer.

---

## Post-Tool Hook Execution

### executePostToolHooksIterator - Post-execution hook pipeline

**What it does:** Runs all registered `PostToolUse` hooks after a tool successfully executes, with the ability to modify MCP tool output.

**How it works:**

1. Calls `RF8` (executePostToolHooks generator) with tool name, tool result, and context
2. Processes each hook result:
   - **`hook_cancelled`**: The hook was cancelled (e.g., by abort signal)
   - **`message`**: Additional messages to inject into conversation
   - **`blockingError`**: Error from the hook itself
   - **`preventContinuation`**: Stops the agent loop after this tool
   - **`additionalContexts`**: Extra context to inject
   - **`updatedMCPToolOutput`**: Modified output for MCP tools only (checked via `rk(tool)`)

3. For MCP tools specifically, hooks can transform the tool output before it reaches the LLM. This enables post-processing of external tool results.

```javascript
// ============================================
// executePostToolHooksIterator - Post-tool hook execution
// Location: chunks.145.mjs:3107-3192
// ============================================

// ORIGINAL (for source lookup):
async function* k4q(A, q, K, Y, z, _, w, O, $) {
    let H = Date.now();
    let J = A.getAppState().toolPermissionContext.mode, M = _;
    for await (let D of RF8(q.name, K, M, A, J, A.abortController.signal)) try {
        if (D.message) yield { message: D.message };
        if (D.blockingError) yield { message: f4({ type: "hook_blocking_error", ... }) };
        if (D.preventContinuation) { yield { message: f4({ type: "hook_stopped_continuation", ... }) }; return }
        if (D.updatedMCPToolOutput && rk(q)) M = D.updatedMCPToolOutput, yield { updatedMCPToolOutput: M }
    } catch (X) { /* telemetry + yield error */ }
}

// READABLE (for understanding):
async function* executePostToolHooksIterator(toolUseContext, tool, toolUseId, messageId, toolResult, ...) {
    for await (let hookResult of executePostToolHooks(tool.name, toolUseId, toolResult, toolUseContext, permissionMode, abortSignal)) {
        if (hookResult.preventContinuation) { yield stopMessage; return; }
        if (hookResult.updatedMCPToolOutput && isMcpTool(tool)) {
            toolResult = hookResult.updatedMCPToolOutput;  // MCP output can be transformed
            yield { updatedMCPToolOutput: toolResult };
        }
    }
}

// Mapping: k4q→executePostToolHooksIterator, A→toolUseContext, q→tool, K→toolUseId, M→toolResult, RF8→executePostToolHooks, rk→isMcpTool
```

**Why this approach:**
- Post-hooks cannot modify native tool output (only MCP output), because native tools have well-defined output formats that the UI depends on
- MCP tool output is opaque to the system, so hooks can safely transform it (e.g., filtering sensitive data, adding annotations)
- `preventContinuation` in post-hooks stops the agent loop, useful for hooks that detect dangerous outcomes from tool execution

---

## Post-Failure Hook Execution

### executePostToolFailureHooksIterator - Hooks for failed tool calls

**What it does:** Runs `PostToolUseFailure` hooks when a tool execution fails (permission denied, error thrown, etc.).

**How it works:**

Similar to post-tool hooks but triggered on failure path. Hooks receive the failure reason and can provide additional context about what went wrong. Does NOT support `preventContinuation` (the failure already stopped execution). Does NOT support output modification (there is no successful output).

---

## Result Formatting

After tool execution, the result is formatted as a user message containing a `tool_result` content block:

```
{
  type: "tool_result",
  content: <serialized result data>,
  tool_use_id: <matching tool_use block id>,
  is_error: false  // or true for errors
}
```

Key formatting details:
- Tool results are serialized via `Q1` (JSON.stringify) if they are objects
- Result size is tracked for telemetry (`toolResultSizeBytes`)
- File extension is extracted for attribution tracking
- Bash commands have the first word extracted as `bash_command` for telemetry aggregation

---

## Telemetry Integration

Every stage of the pipeline emits telemetry:

| Event | Stage | Key Data |
|-------|-------|----------|
| `tengu_tool_use_error` | Validation failure | error type, tool name, MCP metadata |
| `tengu_tool_use_cancelled` | Abort before execution | tool name |
| `tengu_tool_use_can_use_tool_rejected` | Permission denied | tool name, decision source |
| `tengu_tool_use_can_use_tool_allowed` | Permission granted | tool name |
| `tengu_tool_use_success` | Execution succeeded | duration, result size, file extension |
| `tengu_pre_tool_hook_error` | Pre-hook failed | tool name, duration |
| `tengu_post_tool_hook_error` | Post-hook failed | tool name, duration |
| `tengu_tool_use_progress` | Progress update | tool name |

Each event includes `queryChainId` and `queryDepth` for tracing tool calls through the agent loop, and MCP-specific fields (`mcpServerType`, `mcpServerBaseUrl`, `mcpServerName`, `mcpToolName`) when applicable.

---

## Complete Execution Flow with Source

### Full Pipeline Source (fxY)

**What it does:** The complete tool execution pipeline with all stages in sequence.

```javascript
// ============================================
// toolExecutionPipeline - Complete implementation
// Location: chunks.146.mjs:442-987
// ============================================

// ORIGINAL (for source lookup):
async function fxY(A, q, K, Y, z, _, w, O, $, H, j) {
    let J = A.inputSchema.safeParse(K);
    if (!J.success) {
        let y = V4q(A.name, J.error);
        return k(`${A.name} tool input error: ${y.slice(0,200)}`), d("tengu_tool_use_error", {
            error: "InputValidationError",
            errorDetails: y.slice(0, 2000),
            // ... telemetry fields
        }), [{ message: p1({ content: [{ type: "tool_result", content: `<tool_use_error>InputValidationError: ${y}</tool_use_error>`, is_error: !0, tool_use_id: q }] }) }]
    }
    let D = await A.validateInput?.(J.data, Y);
    if (D?.result === !1) return k(`${A.name} tool validation error: ${D.message?.slice(0,200)}`), d("tengu_tool_use_error", {
        messageID: w, toolName: hq(A.name), error: D.message, errorCode: D.errorCode,
        // ... telemetry fields
    }), [{ message: p1({ content: [{ type: "tool_result", content: `<tool_use_error>${D.message}</tool_use_error>`, is_error: !0, tool_use_id: q }] }) }];
    // ... pre-hooks, permission check, execution, post-hooks
}

// READABLE (for understanding):
async function toolExecutionPipeline(tool, toolUseId, input, toolUseContext, canUseTool, assistantMessage, messageId, requestId, mcpServerType, mcpServerBaseUrl, progressCallback) {
    // === STAGE 1: Schema Validation ===
    let parseResult = tool.inputSchema.safeParse(input);
    if (!parseResult.success) {
        let errorMessage = formatValidationError(tool.name, parseResult.error);
        emitTelemetry("tengu_tool_use_error", { error: "InputValidationError", ... });
        return [createErrorMessage(`InputValidationError: ${errorMessage}`)];
    }

    // === STAGE 2: Custom Validation ===
    let customValidation = await tool.validateInput?.(parseResult.data, toolUseContext);
    if (customValidation?.result === false) {
        emitTelemetry("tengu_tool_use_error", { error: customValidation.message, errorCode: customValidation.errorCode });
        return [createErrorMessage(customValidation.message)];
    }

    // === STAGE 3: Bash Pre-flight Check ===
    if (tool.name === "Bash" && input.command) {
        let appState = await toolUseContext.getAppState();
        if (bashPreFlightCheck(input.command, appState.toolPermissionContext, toolUseContext.abortController.signal)) {
            markAsLongRunning(toolUseId);  // W74 - enables progress indicator
        }
    }

    // === STAGE 4: Pre-tool Hooks ===
    let hookMessages = [];
    let hookPermissionResult;
    let updatedInput = parseResult.data;
    let shouldPreventContinuation = false;

    for await (let hookEvent of executePreToolHooksIterator(toolUseContext, tool, updatedInput, toolUseId, ...)) {
        switch (hookEvent.type) {
            case "message":
                hookMessages.push(hookEvent.message);
                break;
            case "hookPermissionResult":
                hookPermissionResult = hookEvent.hookPermissionResult;
                break;
            case "hookUpdatedInput":
                updatedInput = hookEvent.updatedInput;
                break;
            case "preventContinuation":
                shouldPreventContinuation = true;
                break;
        }
    }

    // === STAGE 5: Permission Check ===
    let permissionResult;
    if (hookPermissionResult?.behavior === "allow" && !tool.requiresUserInteraction?.() && !toolUseContext.requireCanUseTool) {
        // Hook approved, bypass user prompt
        permissionResult = hookPermissionResult;
    } else if (hookPermissionResult?.behavior === "deny") {
        // Hook denied
        permissionResult = hookPermissionResult;
    } else {
        // Standard permission flow
        permissionResult = await canUseTool(tool, updatedInput, toolUseContext, assistantMessage, toolUseId);
    }

    if (permissionResult.behavior !== "allow") {
        emitTelemetry("tengu_tool_use_can_use_tool_rejected", { toolName: tool.name });
        return [createPermissionDeniedMessage(permissionResult)];
    }

    emitTelemetry("tengu_tool_use_can_use_tool_allowed", { toolName: tool.name });

    // Apply any input updates from permission dialog
    if (permissionResult.updatedInput !== undefined) {
        updatedInput = permissionResult.updatedInput;
    }

    // === STAGE 6: Tool Execution ===
    let startTime = Date.now();
    let result = await tool.call(updatedInput, {
        ...toolUseContext,
        userModified: permissionResult.userModified ?? false
    }, canUseTool, assistantMessage, (progress) => {
        progressCallback(progress);
    });
    let duration = Date.now() - startTime;

    // === STAGE 7: Post-tool Hooks ===
    for await (let hookEvent of executePostToolHooksIterator(toolUseContext, tool, toolUseId, messageId, result, ...)) {
        if (hookEvent.message) hookMessages.push(hookEvent.message);
        if (hookEvent.updatedMCPToolOutput && isMcpToolByFlag(tool)) {
            result = hookEvent.updatedMCPToolOutput;  // MCP output can be transformed
        }
    }

    // === STAGE 8: Result Formatting ===
    emitTelemetry("tengu_tool_use_success", {
        toolName: tool.name,
        durationMs: duration,
        toolResultSizeBytes: JSON.stringify(result.data).length
    });

    return [
        { message: createUserMessage({ content: [formatToolResult(result, toolUseId)] }) },
        ...hookMessages
    ];
}

// Mapping: fxY→toolExecutionPipeline, A→tool, q→toolUseId, K→input, Y→toolUseContext,
//          z→canUseTool, _→assistantMessage, w→messageId, O→requestId,
//          $→mcpServerType, H→mcpServerBaseUrl, j→progressCallback,
//          J→parseResult, D→customValidation, V4q→formatValidationError,
//          d→emitTelemetry, p1→createUserMessage, y4q→executePreToolHooksIterator,
//          k4q→executePostToolHooksIterator, rk→isMcpToolByFlag
```

**Why this approach:**
- Single async function handles all stages linearly
- Early returns for validation/permission failures minimize work
- Progress callback enables streaming updates during execution
- Hook messages are collected and appended to result

---

## Progress Streaming

### Tool Progress Updates

**What it does:** Enables tools to emit progress updates during long-running operations.

```javascript
// ============================================
// Progress Streaming - Tool progress updates
// Location: chunks.146.mjs:391-429 (ZxY orchestrator)
// ============================================

// ORIGINAL (for source lookup):
function ZxY(A, q, K, Y, z, _, w, O, $, H) {
    let j = new Pi6;  // Queue for async iteration
    return fxY(A, q, K, Y, z, _, w, O, $, H, (J) => {
        d("tengu_tool_use_progress", { messageID: w, toolName: hq(A.name), ... });
        j.enqueue({ message: C4q({ toolUseID: J.toolUseID, parentToolUseID: q, data: J.data }) })
    }).then((J) => { for (let M of J) j.enqueue(M) }).catch((J) => { j.error(J) }).finally(() => { j.done() }), j
}

// READABLE (for understanding):
function toolExecutionOrchestrator(tool, toolUseId, input, toolUseContext, canUseTool, assistantMessage, messageId, requestId, mcpServerType, mcpServerBaseUrl) {
    let queue = new AsyncQueue();

    // Start pipeline execution
    toolExecutionPipeline(tool, toolUseId, input, toolUseContext, canUseTool, assistantMessage, messageId, requestId, mcpServerType, mcpServerBaseUrl, (progress) => {
        // Progress callback - called during execution
        emitTelemetry("tengu_tool_use_progress", {
            messageID: messageId,
            toolName: tool.name,
            queryChainId: toolUseContext.queryTracking?.chainId
        });
        queue.enqueue({
            message: createToolProgressMessage({
                toolUseID: progress.toolUseID,
                parentToolUseID: toolUseId,
                data: progress.data
            })
        });
    }).then((results) => {
        // Pipeline completed - enqueue all results
        for (let result of results) {
            queue.enqueue(result);
        }
    }).catch((error) => {
        queue.error(error);
    }).finally(() => {
        queue.done();  // Signal completion
    });

    return queue;  // Async iterable
}

// Mapping: ZxY→toolExecutionOrchestrator, Pi6→AsyncQueue, fxY→toolExecutionPipeline,
//          C4q→createToolProgressMessage, j→queue, J→progress/results
```

**Key insight:** The orchestrator returns an async queue (iterable), allowing the caller to receive progress updates **before** the tool completes. This enables the UI to show real-time progress for long-running tools like Bash.

---

## Hook Execution Generators - Deep Analysis

### Overview

Hook execution in Claude Code uses async generators (`function*`) to allow multiple hooks to contribute results incrementally. Three core generators handle the three tool-use hook events:

| Generator | Event | Purpose |
|-----------|-------|---------|
| `LF8` | PreToolUse | Run before tool execution; can allow/deny/modify input |
| `RF8` | PostToolUse | Run after successful execution; can modify MCP output |
| `hF8` | PostToolUseFailure | Run after failed execution; error recovery |

---

### executePreToolHooks (LF8) - Pre-execution hook generator

**What it does:** Runs all registered `PreToolUse` hooks for a tool before execution begins. Hooks can block execution, override permissions, or modify the tool input.

**How it works:**

```javascript
// ============================================
// executePreToolHooks - Pre-tool hook execution generator
// Location: chunks.175.mjs:2462-2484
// ============================================

// ORIGINAL (for source lookup):
async function* LF8(A, q, K, Y, z, _, w = T$, O, $) {
    let H = Y.getAppState(),
        j = Y.agentId ?? R1();
    if (!NS1("PreToolUse", H, j)) return;
    k(`executePreToolHooks called for tool: ${A}`);
    let J = {
        ...$w(z, void 0, Y),
        hook_event_name: "PreToolUse",
        tool_name: A,
        tool_input: K,
        tool_use_id: q
    };
    yield* Ax({
        hookInput: J,
        toolUseID: q,
        matchQuery: A,
        signal: _,
        timeoutMs: w,
        toolUseContext: Y,
        requestPrompt: O,
        toolInputSummary: $
    })
}

// READABLE (for understanding):
async function* executePreToolHooks(toolName, toolUseId, toolInput, toolUseContext, permissionMode, abortSignal, timeoutMs = DEFAULT_HOOK_TIMEOUT, requestPrompt, toolInputSummary) {
    let appState = toolUseContext.getAppState(),
        agentId = toolUseContext.agentId ?? getDefaultAgentId();
    if (!hasHooksForEvent("PreToolUse", appState, agentId)) return;
    logHookExecution(`executePreToolHooks called for tool: ${toolName}`);

    // Build hook input payload with base context
    let hookInput = {
        ...buildContextPayload(permissionMode, undefined, toolUseContext),
        hook_event_name: "PreToolUse",
        tool_name: toolName,
        tool_input: toolInput,
        tool_use_id: toolUseId
    };

    // Delegate to the central hook executor
    yield* executeHooksIterator({
        hookInput: hookInput,
        toolUseID: toolUseId,
        matchQuery: toolName,
        signal: abortSignal,
        timeoutMs: timeoutMs,
        toolUseContext: toolUseContext,
        requestPrompt: requestPrompt,
        toolInputSummary: toolInputSummary
    });
}

// Mapping: LF8→executePreToolHooks, A→toolName, q→toolUseId, K→toolInput,
//          Y→toolUseContext, z→permissionMode, _→abortSignal, w→timeoutMs,
//          $w→buildContextPayload, Ax→executeHooksIterator, T$→DEFAULT_HOOK_TIMEOUT,
//          NS1→hasHooksForEvent, O→requestPrompt, $→toolInputSummary
```

**Hook output fields for PreToolUse:**

| Field | Type | Effect |
|-------|------|--------|
| `permissionBehavior` | `"allow"` \| `"deny"` \| `"ask"` | Override permission decision |
| `updatedInput` | object | Replace tool input with modified version |
| `blockingError` | string | Block execution with error message |
| `preventContinuation` | boolean | Stop the agent loop after this tool |
| `stopReason` | string | Reason for stopping continuation |
| `additionalContexts` | string[] | Inject extra context into conversation |

**Why this approach:**
- `permissionBehavior: "allow"` lets hooks bypass user permission prompts, enabling CI/CD automation
- `permissionBehavior: "deny"` lets security hooks block dangerous operations
- `updatedInput` enables input sanitization before the user sees it in permission dialogs

**Key insight:** When a hook sets `permissionBehavior: "allow"`, the pipeline checks if the tool requires user interaction via `tool.requiresUserInteraction?.()`. If true, the hook's allow is downgraded to a normal permission check. This prevents hooks from silently approving destructive operations that tool authors marked as requiring human oversight.

---

### executePostToolHooks (RF8) - Post-execution hook generator

**What it does:** Runs all registered `PostToolUse` hooks after a tool successfully executes. Hooks can modify MCP tool output, inject context, or stop continuation.

**How it works:**

```javascript
// ============================================
// executePostToolHooks - Post-tool hook execution generator
// Location: chunks.175.mjs:2486-2503
// ============================================

// ORIGINAL (for source lookup):
async function* RF8(A, q, K, Y, z, _, w, O = T$) {
    let $ = {
        ...$w(_, void 0, z),
        hook_event_name: "PostToolUse",
        tool_name: A,
        tool_input: K,
        tool_response: Y,
        tool_use_id: q
    };
    yield* Ax({
        hookInput: $,
        toolUseID: q,
        matchQuery: A,
        signal: w,
        timeoutMs: O,
        toolUseContext: z
    })
}

// READABLE (for understanding):
async function* executePostToolHooks(toolName, toolUseId, toolInput, toolResponse, toolUseContext, permissionMode, abortSignal, timeoutMs = DEFAULT_HOOK_TIMEOUT) {
    // Build hook input payload including tool response
    let hookInput = {
        ...buildContextPayload(permissionMode, undefined, toolUseContext),
        hook_event_name: "PostToolUse",
        tool_name: toolName,
        tool_input: toolInput,
        tool_response: toolResponse,  // v2.1.76: uses tool_response instead of tool_result
        tool_use_id: toolUseId
    };

    // Delegate to central hook executor
    yield* executeHooksIterator({
        hookInput: hookInput,
        toolUseID: toolUseId,
        matchQuery: toolName,
        signal: abortSignal,
        timeoutMs: timeoutMs,
        toolUseContext: toolUseContext
    });
}

// Mapping: RF8→executePostToolHooks, A→toolName, q→toolUseId, K→toolInput,
//          Y→toolResponse, z→toolUseContext, _→permissionMode, w→abortSignal,
//          O→timeoutMs, $w→buildContextPayload, Ax→executeHooksIterator
```

**Hook output fields for PostToolUse:**

| Field | Type | Effect |
|-------|------|--------|
| `updatedMCPToolOutput` | object | Replace MCP tool output (MCP tools only) |
| `preventContinuation` | boolean | Stop the agent loop after this tool |
| `stopReason` | string | Reason for stopping |
| `additionalContexts` | string[] | Inject extra context |
| `message` | object | Add message to conversation |

**MCP output modification:**

```javascript
// From k4q (executePostToolHooksIterator) in chunks.145.mjs:3107
if (D.updatedMCPToolOutput && rk(q)) {
    M = D.updatedMCPToolOutput;  // Replace output
    yield { updatedMCPToolOutput: M };
}
```

**Why MCP-only:**
- Native tools have well-defined output formats that the UI depends on
- MCP tool output is opaque JSON, safe to transform
- Enables post-processing: filtering sensitive data, adding annotations, reformatting

**Key insight:** The `tool_result_is_error: false` flag distinguishes this from the failure path. Hooks that want to handle both success and failure should register for both `PostToolUse` and `PostToolUseFailure` events.

---

### executePostToolFailureHooks (hF8) - Failure hook generator

**What it does:** Runs `PostToolUseFailure` hooks when a tool execution fails (permission denied, validation error, runtime error). Hooks can provide recovery context but cannot modify output.

**How it works:**

```javascript
// ============================================
// executePostToolFailureHooks - Post-failure hook execution generator
// Location: chunks.175.mjs:2505-2526
// ============================================

// ORIGINAL (for source lookup):
async function* hF8(A, q, K, Y, z, _, w, O, $ = T$) {
    let H = z.getAppState(),
        j = z.agentId ?? R1();
    if (!NS1("PostToolUseFailure", H, j)) return;
    let J = {
        ...$w(w, void 0, z),
        hook_event_name: "PostToolUseFailure",
        tool_name: A,
        tool_input: K,
        tool_use_id: q,
        error: Y,
        is_interrupt: _
    };
    yield* Ax({
        hookInput: J,
        toolUseID: q,
        matchQuery: A,
        signal: O,
        timeoutMs: $,
        toolUseContext: z
    })
}

// READABLE (for understanding):
async function* executePostToolFailureHooks(toolName, toolUseId, toolInput, errorMessage, isInterrupt, toolUseContext, permissionMode, abortSignal, timeoutMs = DEFAULT_HOOK_TIMEOUT) {
    let appState = toolUseContext.getAppState(),
        agentId = toolUseContext.agentId ?? getDefaultAgentId();
    if (!hasHooksForEvent("PostToolUseFailure", appState, agentId)) return;
    // Build hook input with error information
    // v2.1.76: uses error + is_interrupt instead of tool_result/error_message/tool_error_code
    let hookInput = {
        ...buildContextPayload(permissionMode, undefined, toolUseContext),
        hook_event_name: "PostToolUseFailure",
        tool_name: toolName,
        tool_input: toolInput,
        tool_use_id: toolUseId,
        error: errorMessage,
        is_interrupt: isInterrupt
    };

    // Delegate to central hook executor
    yield* executeHooksIterator({
        hookInput: hookInput,
        toolUseID: toolUseId,
        matchQuery: toolName,
        signal: abortSignal,
        timeoutMs: timeoutMs,
        toolUseContext: toolUseContext
    });
}

// Mapping: hF8→executePostToolFailureHooks, A→toolName, q→toolUseId, K→toolInput,
//          Y→errorMessage, _→isInterrupt, z→toolUseContext, w→permissionMode,
//          $w→buildContextPayload, Ax→executeHooksIterator, NS1→hasHooksForEvent
```

**Hook output fields for PostToolUseFailure:**

| Field | Type | Effect |
|-------|------|--------|
| `additionalContexts` | string[] | Provide recovery suggestions |
| `message` | object | Add context about the failure |

**What is NOT supported:**
- ❌ `updatedMCPToolOutput` - No output to modify (execution failed)
- ❌ `preventContinuation` - Execution already stopped due to failure
- ❌ `permissionBehavior` - Permission decision already made

**Why this approach:**
- Failure hooks are for observability and recovery suggestions, not control flow
- The `tool_error_code` enables hooks to respond differently to validation errors vs runtime errors
- Additional contexts can guide the LLM toward alternative approaches

**Key insight:** Failure hooks receive the error message and error code, allowing them to provide intelligent recovery suggestions. For example, a hook might detect a "file not found" error and suggest alternative file paths.

---

### Iterator Wrapper Pattern

The `y4q`, `k4q`, and `E4q` functions wrap the core generators with additional processing:

```javascript
// ============================================
// executePreToolHooksIterator - Iterator wrapper with result processing
// Location: chunks.146.mjs:74-216
// ============================================

// ORIGINAL (partial):
async function* y4q(A, q, K, Y, z, _, w, O) {
    let $ = Date.now();
    try {
        let H = A.getAppState();
        for await (let j of LF8(q.name, Y, K, A, H.toolPermissionContext.mode, A.abortController.signal)) {
            if (J.message) yield { type: "message", message: { message: J.message } };
            if (J.blockingError) yield { type: "hookPermissionResult", hookPermissionResult: { behavior: "deny", message: formatBlockError(...) } };
            if (J.preventContinuation) yield { type: "preventContinuation", shouldPreventContinuation: true };
            if (J.permissionBehavior !== void 0) {
                if (J.permissionBehavior === "allow") yield { type: "hookPermissionResult", hookPermissionResult: { behavior: "allow", updatedInput: J.updatedInput } };
            }
            if (J.updatedInput && J.permissionBehavior === void 0) yield { type: "hookUpdatedInput", updatedInput: J.updatedInput };
        }
    } catch (X) { /* error handling */ }
}
```

**Why the wrapper pattern:**
1. **Type transformation** - Converts raw hook outputs to typed pipeline events
2. **Error isolation** - Catches and logs hook errors without crashing the pipeline
3. **State access** - Retrieves app state and permission mode before iterating
4. **Telemetry** - Tracks hook execution duration

---

## Abort Handling

### Cancellation During Execution

**What it does:** Handles tool execution cancellation when the user or system aborts.

```javascript
// ============================================
// Abort Handling - Cancellation flow
// Location: chunks.146.mjs:285-389 (Wi6 toolDispatcher)
// ============================================

// ORIGINAL (for source lookup):
async function* Wi6(A, q, K, Y) {
    // ... tool lookup ...
    if (Y.abortController.signal.aborted) {
        d("tengu_tool_use_cancelled", {
            toolName: hq(_.name),
            toolUseID: A.id,
            isMcp: _.isMcp ?? !1,
            // ... telemetry fields
        });
        let J = CF8(A.id);  // Cancelled tool result
        yield {
            message: p1({
                content: [J],
                toolUseResult: R96,  // "cancelled" message
                sourceToolAssistantUUID: q.uuid
            })
        };
        return;
    }
    // ... proceed with execution ...
}

// READABLE (for understanding):
async function* toolDispatcher(toolUseBlock, assistantMessage, canUseTool, toolUseContext) {
    // Check for abort before starting
    if (toolUseContext.abortController.signal.aborted) {
        emitTelemetry("tengu_tool_use_cancelled", {
            toolName: tool.name,
            toolUseID: toolUseBlock.id
        });
        yield {
            message: createUserMessage({
                content: [createCancelledToolResult(toolUseBlock.id)],
                toolUseResult: "cancelled"
            })
        };
        return;  // Don't execute
    }

    // ... execute tool ...
}

// Mapping: Wi6→toolDispatcher, Y.abortController.signal→abortSignal, CF8→createCancelledToolResult,
//          R96→CANCELLED_MESSAGE, p1→createUserMessage
```

**Key insight:** The abort check happens at the dispatcher level, before execution starts. Once execution begins, the tool itself must handle abort signals (e.g., Bash terminates the subprocess).
