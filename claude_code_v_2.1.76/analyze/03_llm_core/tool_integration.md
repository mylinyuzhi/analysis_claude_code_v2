# Tool Integration (Claude Code 2.1.38)

> Complete analysis of how tools are integrated with the LLM API: schema building for requests, dispatch from responses, permission checking, and result feedback loops.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `buildToolSchemas` (nZ6) - Builds API tool definitions from internal tool objects
- `StreamingToolExecutor` (uU1) - Parallel tool execution during streaming
- `executeToolsSequentially` (tZ6) - Sequential tool execution after streaming
- `findTool` (Tv) - Tool lookup by name
- `executePreToolHooksIterator` (B1q) - Pre-tool hook execution
- `executePostToolHooksIterator` (b1q) - Post-tool hook execution

---

## Architecture Overview

Tool integration spans three phases:

```
┌──────────────────────────────────────────────────────────────────────┐
│                     TOOL INTEGRATION PIPELINE                         │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  PHASE 1: SCHEMA BUILDING (LLM Request)                             │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  Tool Objects ────► nZ6 (buildToolSchemas) ────► API Schema   │  │
│  │                                                                │  │
│  │  - Filter by deferred loading                                  │  │
│  │  - Add cache control markers                                   │  │
│  │  - Include MCP tool metadata                                   │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                          ↓                                           │
│  PHASE 2: DISPATCH FROM RESPONSE                                    │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  tool_use blocks ────► bU1 (toolDispatcher) ────► Execution    │  │
│  │                                                                │  │
│  │  - Lookup tool by name                                         │  │
│  │  - Validate input against schema                               │  │
│  │  - Check permissions                                           │  │
│  │  - Execute tool.call()                                         │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                          ↓                                           │
│  PHASE 3: RESULT FEEDBACK                                           │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  tool_result ────► Message History ────► Next LLM Request      │  │
│  │                                                                │  │
│  │  - Normalize result content                                    │  │
│  │  - Track file operations                                       │  │
│  │  - Record telemetry                                            │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Tool Schema Building

### buildToolSchemas - Converts tool objects to API format

**What it does:**
The `buildToolSchemas` (nZ6) function transforms internal tool objects into the JSON Schema format required by the Anthropic Messages API. This includes handling MCP tools, deferred loading, and cache control markers.

**How it works:**

1. **Deferred Loading Check**: If `deferLoading` is true for MCP tools, returns a minimal schema reference instead of the full definition. This reduces token usage when many MCP tools are available.

2. **Input Schema Extraction**: Gets the Zod schema from the tool and converts it to JSON Schema format.

3. **Cache Control Injection**: If `cacheControl` is provided, adds it to the tool definition. This is used for tool-based global caching where a stable tool acts as a cache boundary.

4. **MCP Metadata**: For MCP tools, includes additional properties like `isMcp: true` for internal tracking (stripped before API submission).

```javascript
// ============================================
// buildToolSchemas - Converts tool objects to API schema format
// Location: chunks.169.mjs (referenced at line 784)
// ============================================

// ORIGINAL (for source lookup):
let G = await Promise.all(_.map((z1) => nZ6(z1, {
    getToolPermissionContext: w.getToolPermissionContext,
    tools: Y,
    agents: w.agents,
    allowedAgentTypes: w.allowedAgentTypes,
    model: w.model,
    betas: $,
    deferLoading: O && (BW(z1) || B9z(z1)),
    cacheControl: P && z1 === P ? s91("global") : void 0
})));

// READABLE (for understanding):
let toolSchemas = await Promise.all(filteredTools.map((tool) => buildToolSchemas(tool, {
    getToolPermissionContext: options.getToolPermissionContext,
    tools: allTools,
    agents: options.agents,
    allowedAgentTypes: options.allowedAgentTypes,
    model: options.model,
    betas: betas,
    deferLoading: useDeferredLoading && (isMcpTool(tool) || isLspTool(tool)),
    cacheControl: cacheMarkerTool && tool === cacheMarkerTool ? createCacheControl("global") : undefined
})));

// Mapping: nZ6→buildToolSchemas, z1→tool, Y→allTools, w→options,
//   BW→isMcpTool, B9z→isLspTool, s91→createCacheControl, P→cacheMarkerTool
```

### Deferred Tools Logic

**What it does:**
Deferred tools is an optimization that reduces token usage by only including tool schemas that are likely to be used, based on recent conversation history.

**How it works:**

1. **Tool Search Tool**: When deferred loading is enabled, a special `ToolSearch` tool is included. This tool allows the LLM to search for and discover other tools.

2. **Recent Tool Tracking**: The `tBA` function extracts tool names mentioned in recent messages. These tools are always included.

3. **Filtering Logic**:
```javascript
// ============================================
// Deferred Tools Filtering Logic
// Location: chunks.169.mjs:752-759
// ============================================

// ORIGINAL (for source lookup):
if (O) {
    let z1 = tBA(A);  // Get tools mentioned in recent messages
    _ = Y.filter((Y1) => {
        if (!BW(Y1)) return !0;  // Always include non-MCP tools
        if (Y1.name === dM) return !0;  // Always include ToolSearch
        return z1.has(Y1.name);  // Include MCP tools only if recently mentioned
    })
} else _ = Y.filter((z1) => z1.name !== dM);  // Exclude ToolSearch when not deferred

// READABLE (for understanding):
if (useDeferredLoading) {
    let recentlyUsedTools = extractToolsFromRecentMessages(messages);
    filteredTools = allTools.filter((tool) => {
        if (!isMcpTool(tool)) return true;  // Always include built-in tools
        if (tool.name === TOOL_SEARCH_NAME) return true;  // Always include ToolSearch
        return recentlyUsedTools.has(tool.name);  // Include MCP tools only if recently used
    });
} else {
    filteredTools = allTools.filter((tool) => tool.name !== TOOL_SEARCH_NAME);
}

// Mapping: O→useDeferredLoading, tBA→extractToolsFromRecentMessages, A→messages,
//   Y→allTools, _→filteredTools, BW→isMcpTool, dM→TOOL_SEARCH_NAME
```

**Why this approach:**
- MCP servers can expose hundreds of tools. Including all schemas would consume significant tokens.
- The ToolSearch tool allows discovery without bloating every request.
- Built-in tools are always included because they're core to the agent's capabilities.

---

## Phase 2: Tool Dispatch from LLM Response

### StreamingToolExecutor - Parallel tool execution during streaming

**What it does:**
The `StreamingToolExecutor` (uU1) enables tools to start executing while the LLM stream is still in progress. This reduces perceived latency by overlapping computation with generation.

**How it works:**

1. **Tool Queue**: As `tool_use` blocks arrive in the stream, they're added to an internal queue via `addTool()`.

2. **Parallel Execution**: Each queued tool immediately begins execution in a separate async context.

3. **Result Collection**: `getCompletedResults()` returns finished tool results that can be yielded immediately.

4. **Remaining Drain**: `getRemainingResults()` is called after the stream ends to collect any still-running tools.

```javascript
// ============================================
// StreamingToolExecutor - Parallel tool execution during streaming
// Location: chunks.149.mjs (referenced at line 1835)
// ============================================

// Usage in mainAgentLoop:
let S = i2("tengu_streaming_tool_execution2")
    ? new uU1(w.options.tools, z, w)
    : null;

// During stream processing:
if (S && !w.abortController.signal.aborted) {
    let a = E1.message.content.filter((A1) => A1.type === "tool_use");
    for (let A1 of a) S.addTool(A1, E1);
}

// Collecting completed results:
if (S && !w.abortController.signal.aborted) {
    for (let a of S.getCompletedResults())
        if (a.message) yield a.message, y.push(...WJ([a.message], w.options.tools).filter((A1) => A1.type === "user"));
}

// After stream ends:
for await (let Z1 of S.getRemainingResults()) {
    if (Z1.message) yield Z1.message;
}

// Mapping: uU1→StreamingToolExecutor, S→streamingToolExecutor, i2→isFeatureEnabled,
//   WJ→normalizeMessages, E1→streamEvent
```

**Why this approach:**
- **Reduced latency**: Users see tool results appearing while the LLM is still generating subsequent blocks.
- **Parallel execution**: Multiple independent tools can run simultaneously.
- **Abort handling**: If the user cancels, running tools can be gracefully terminated.

**Key insight:** The streaming tool executor trades complexity for latency. Without it, the user would wait for the entire LLM response before any tool starts. With it, tools start as soon as their `tool_use` block arrives.

---

### Sequential Tool Execution (tZ6)

**What it does:**
When streaming tool execution is disabled or unavailable, the `tZ6` function executes tools sequentially after the stream completes.

**How it works:**

```javascript
// ============================================
// Sequential Tool Execution
// Location: chunks.149.mjs:2035-2045
// ============================================

// ORIGINAL (for source lookup):
for await (let Z1 of tZ6(l, k, z, w)) {
    if (Z1.message) {
        if (yield Z1.message, Z1.message.type === "attachment" && Z1.message.attachment.type === "hook_stopped_continuation") r = !0;
        y.push(...WJ([Z1.message], w.options.tools).filter((E1) => E1.type === "user"))
    }
    if (Z1.newContext) s = { ...Z1.newContext, queryTracking: P };
}

// READABLE (for understanding):
for await (let result of executeToolsSequentially(toolUseBlocks, assistantMessages, canUseTool, toolUseContext)) {
    if (result.message) {
        yield result.message;
        // Check for hook stop
        if (result.message.type === "attachment" && result.message.attachment.type === "hook_stopped_continuation") {
            shouldStopContinuation = true;
        }
        toolResults.push(...normalizeMessages([result.message], toolUseContext.options.tools)
            .filter(msg => msg.type === "user"));
    }
    if (result.newContext) {
        updatedContext = { ...result.newContext, queryTracking };
    }
}

// Mapping: tZ6→executeToolsSequentially, l→toolUseBlocks, k→assistantMessages,
//   z→canUseTool, w→toolUseContext, Z1→result, r→shouldStopContinuation
```

---

### Tool Lookup and Discovery

**What it does:**
The `findTool` (Tv) function locates a tool by name, handling aliases for backwards compatibility.

**How it works:**

```javascript
// ============================================
// findTool - Tool lookup by name
// Location: chunks.74.mjs:1392 (referenced)
// ============================================

// Usage in toolDispatcher:
let w = Tv(Y.options.tools, z);  // Find tool in session tools
if (!w) {
    let X = Tv(kt(), z);  // Fallback to dynamic tool set
    if (X && X.aliases?.includes(z)) w = X;  // Check aliases
}

// READABLE (for understanding):
function findTool(tools, toolName) {
    // Primary lookup by exact name match
    return tools.find(tool => tool.name === toolName);
}

// Fallback with alias check:
let tool = findTool(toolUseContext.options.tools, toolName);
if (!tool) {
    let dynamicTool = findTool(getDynamicToolSet(), toolName);
    if (dynamicTool?.aliases?.includes(toolName)) {
        tool = dynamicTool;
    }
}

// Mapping: Tv→findTool, Y.options.tools→sessionTools, z→toolName, kt→getDynamicToolSet
```

---

## Permission Check Flow

### Permission Decision Tree

The permission system determines whether a tool can execute without user approval:

```
                    ┌─────────────────┐
                    │ Pre-tool Hook   │
                    │ Results         │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
         "allow"         "ask"         "deny"
              │              │              │
              ▼              │              ▼
    ┌─────────────────┐     │      Return error
    │ Requires user   │     │      immediately
    │ interaction?    │     │
    └────────┬────────┘     │
             │              │
      ┌──────┼──────┐       │
      │      │      │       │
      ▼      ▼      ▼       │
     Yes     No   require   │
      │      │   CanUseTool │
      │      │      │       │
      ▼      ▼      ▼       │
  Call    Skip   Call       │
  canUse  perm   canUse     │
  Tool    check  Tool       │
      │      │      │       │
      └──────┴──────┴───────┘
             │
             ▼
      ┌─────────────┐
      │ Permission  │
      │ Result      │
      └─────────────┘
```

### Permission Check Implementation

```javascript
// ============================================
// Permission Decision Logic
// Location: chunks.149.mjs:616-625
// ============================================

// ORIGINAL (for source lookup):
let Z;
if (G !== void 0 && G.behavior === "allow" && !A.requiresUserInteraction?.() && !Y.requireCanUseTool)
    h(`Hook approved tool use for ${A.name}, bypassing permission check`), Z = G;
else if (G !== void 0 && G.behavior === "allow" && (A.requiresUserInteraction?.() || Y.requireCanUseTool)) {
    if (h(`Hook approved tool use for ${A.name}, but canUseTool is required`), G.updatedInput) M = G.updatedInput;
    Z = await z(A, M, Y, w, q)
} else if (G !== void 0 && G.behavior === "deny") h(`Hook denied tool use for ${A.name}`), Z = G;
else {
    let y = G?.behavior === "ask" ? G : void 0;
    if (G?.behavior === "ask" && G.updatedInput) M = G.updatedInput;
    Z = await z(A, M, Y, w, q, y)
}

// READABLE (for understanding):
let permissionDecision;

if (hookPermissionResult?.behavior === "allow" &&
    !tool.requiresUserInteraction?.() &&
    !toolUseContext.requireCanUseTool) {
    // Hook approved and no additional requirements
    log(`Hook approved tool use for ${tool.name}, bypassing permission check`);
    permissionDecision = hookPermissionResult;
} else if (hookPermissionResult?.behavior === "allow" &&
           (tool.requiresUserInteraction?.() || toolUseContext.requireCanUseTool)) {
    // Hook approved but tool requires user interaction
    log(`Hook approved tool use for ${tool.name}, but canUseTool is required`);
    if (hookPermissionResult.updatedInput) {
        validatedInput = hookPermissionResult.updatedInput;
    }
    permissionDecision = await canUseTool(tool, validatedInput, toolUseContext, assistantMessage, toolUseId);
} else if (hookPermissionResult?.behavior === "deny") {
    // Hook denied
    log(`Hook denied tool use for ${tool.name}`);
    permissionDecision = hookPermissionResult;
} else {
    // No hook result or "ask" behavior
    let askContext = hookPermissionResult?.behavior === "ask" ? hookPermissionResult : undefined;
    if (hookPermissionResult?.behavior === "ask" && hookPermissionResult.updatedInput) {
        validatedInput = hookPermissionResult.updatedInput;
    }
    permissionDecision = await canUseTool(tool, validatedInput, toolUseContext, assistantMessage, toolUseId, askContext);
}

// Mapping: G→hookPermissionResult, A→tool, Y→toolUseContext, Z→permissionDecision,
//   z→canUseTool, w→assistantMessage, q→toolUseId, M→validatedInput
```

**Why this approach:**
- **Hook priority**: Hooks can preemptively approve or deny tools, enabling features like "auto-approve safe tools in sandboxed mode".
- **Tool requirements**: Some tools (like Bash) require user interaction even when hooks approve, for security.
- **Context requirements**: `requireCanUseTool` can be set to force permission prompts regardless of hook results.

---

## Hook Integration

### Pre-Tool Hooks (B1q)

**What it does:**
`executePreToolHooksIterator` runs all registered `PreToolUse` hooks before a tool executes. Hooks can modify the tool call or prevent execution.

**How it works:**

```javascript
// ============================================
// executePreToolHooksIterator - Runs PreToolUse hooks
// Location: chunks.149.mjs:161 (referenced)
// ============================================

// Hook event types:
type PreToolHookEvent =
    | { type: "message", message: Message }        // Yield a message to the stream
    | { type: "hookPermissionResult", hookPermissionResult: PermissionResult }
    | { type: "hookUpdatedInput", updatedInput: any }
    | { type: "preventContinuation", shouldPreventContinuation: boolean }
    | { type: "stopReason", stopReason: string }
    | { type: "additionalContext", message: Message }
    | { type: "stop" }                              // Immediately stop tool execution

// Processing loop:
for await (let hookEvent of executePreToolHooksIterator(toolUseContext, tool, validatedInput, toolUseId, messageId, requestId, mcpServerType, mcpServerUrl)) {
    switch (hookEvent.type) {
        case "message":
            if (hookEvent.message.message.type === "progress") {
                progressCallback(hookEvent.message.message);
            } else {
                messages.push(hookEvent.message);
            }
            break;
        case "hookPermissionResult":
            hookPermissionResult = hookEvent.hookPermissionResult;
            break;
        case "hookUpdatedInput":
            validatedInput = hookEvent.updatedInput;
            break;
        case "preventContinuation":
            preventContinuation = hookEvent.shouldPreventContinuation;
            break;
        case "stopReason":
            stopReason = hookEvent.stopReason;
            break;
        case "stop":
            // Return immediately without executing the tool
            return messages;
    }
}
```

### Post-Tool Hooks (b1q)

**What it does:**
`executePostToolHooksIterator` runs after a tool completes, allowing hooks to process the result or trigger side effects.

**How it works:**

```javascript
// ============================================
// executePostToolHooksIterator - Runs PostToolUse hooks
// Location: chunks.149.mjs:3 (referenced)
// ============================================

// Post-tool hooks receive:
// - Tool name and input
// - Tool result
// - Execution duration
// - Success/failure status

for await (let hookEvent of executePostToolHooksIterator(toolUseContext, tool, validatedInput, toolResult)) {
    if (hookEvent.type === "message") {
        yield hookEvent.message;
    }
}
```

---

## Result Feedback Loop

### Tool Result Construction

After tool execution, the result is wrapped in a `tool_result` message:

```javascript
// ============================================
// Tool Result Message Construction
// Location: chunks.149.mjs:763-791
// ============================================

// Result object from tool.call():
let result = await tool.call(validatedInput, context, progressCallback);

// Result structure:
{
    data: any,                    // The actual result (string, object, etc.)
    structured_output?: any,      // Optional structured output for special tools
    display?: ReactElement        // Optional custom display component
}

// Message construction:
messages.push({
    message: createUserMessage({
        content: [{
            type: "tool_result",
            content: result.data,
            tool_use_id: toolUseId,
            ...(result.isError ? { is_error: true } : {})
        }],
        toolUseResult: typeof result.data === "string" ? result.data : JSON.stringify(result.data),
        sourceToolAssistantUUID: assistantMessage.uuid
    })
});
```

### File Operation Tracking

Tools that modify files trigger tracking for the attachment system:

```javascript
// ============================================
// File Operation Tracking
// Location: chunks.149.mjs:606-613
// ============================================

// Track file paths for Read/Write/Edit tools:
let trackingMetadata = {};
if (M && typeof M === "object") {
    if (tool.name === TOOL_NAME_READ && "file_path" in M) {
        trackingMetadata.file_path = String(M.file_path);
    } else if ((tool.name === TOOL_NAME_EDIT || tool.name === TOOL_NAME_WRITE) && "file_path" in M) {
        trackingMetadata.file_path = String(M.file_path);
    } else if (tool.name === TOOL_NAME_BASH && "command" in M) {
        trackingMetadata.full_command = M.command;
    }
}
recordToolOperation(tool.name, trackingMetadata);
```

### Telemetry Recording

Every tool execution records detailed telemetry:

```javascript
// ============================================
// Tool Telemetry
// Location: chunks.149.mjs:789-813
// ============================================

logEvent("tengu_tool_use_success", {
    messageID: messageId,
    toolName: sanitizeToolName(tool.name),
    isMcp: tool.isMcp ?? false,
    durationMs: executionDuration,
    toolResultSizeBytes: resultSizeBytes,
    ...(fileExtension && { fileExtension }),
    queryChainId: toolUseContext.queryTracking?.chainId,
    queryDepth: toolUseContext.queryTracking?.depth,
    ...(mcpServerType && { mcpServerType }),
    ...(mcpServerUrl && { mcpServerUrl }),
    ...(requestId && { requestId }),
    ...(shouldIncludeMcpMetadata() && {
        mcpServerName: parsedMcpName?.serverName,
        mcpToolName: parsedMcpName?.mcpToolName
    })
});
```

---

## Parallel vs Sequential Execution

### When to Use Each

| Mode | When Used | Characteristics |
|------|-----------|-----------------|
| Streaming Parallel | `tengu_streaming_tool_execution2` flag enabled, stream active | Lower latency, tools run during stream |
| Sequential | Flag disabled, post-stream, or fallback | Simpler, guaranteed ordering |

### Streaming Execution Flow

```
Stream Event: tool_use (id: "abc", name: "Bash")
    │
    ▼
StreamingToolExecutor.addTool()
    │
    ├──► Immediately start toolDispatcher()
    │         │
    │         ├── Validate input
    │         ├── Check permissions
    │         └── Execute tool.call()
    │
    ▼ (meanwhile)
Stream continues with next block...
    │
    ▼
Stream Event: tool_use (id: "def", name: "Read")
    │
    ├──► StreamingToolExecutor.addTool()
    │         │
    │         └── Runs in parallel with Bash tool
    │
    ▼
Stream completes
    │
    ▼
getRemainingResults() drains pending tools
    │
    ▼
All tool results collected
```

### Sequential Execution Flow

```
Stream completes with all tool_use blocks
    │
    ▼
executeToolsSequentially()
    │
    ├──► toolDispatcher(tool_use_1)
    │         │
    │         └── Complete execution, yield result
    │
    ├──► toolDispatcher(tool_use_2)
    │         │
    │         └── Complete execution, yield result
    │
    └──► (etc.)
    │
    ▼
All tool results collected
```

---

## MCP Tool Handling

### MCP Tool Name Parsing

MCP tool names follow the format `mcp__<server_name>__<tool_name>`:

```javascript
// ============================================
// MCP Tool Name Parsing
// Location: chunks.149.mjs (VD, Jh functions)
// ============================================

// Parse MCP tool name:
function parseMcpToolName(fullName) {
    // Format: mcp__serverName__toolName
    if (!fullName.startsWith("mcp__")) return null;
    return parseMcpToolNameVariant(fullName);
}

// Usage for telemetry:
if (shouldIncludeMcpMetadata()) {
    let parsed = parseMcpToolName(tool.name);
    if (parsed) {
        telemetryData.mcpServerName = parsed.serverName;
        telemetryData.mcpToolName = parsed.mcpToolName;
    }
}
```

### MCP Server Type Detection

```javascript
// ============================================
// MCP Server Type Detection
// Location: chunks.149.mjs:331-335
// ============================================

function getMcpServerType(toolName, mcpClients) {
    let client = findMcpClientByToolName(toolName, mcpClients);
    if (client?.type === "connected") {
        return client.config.type ?? "stdio";
    }
    return undefined;
}

// Types: "stdio", "sse", "streamable-http"
```

---

## Tool Result Aggregation

### Multiple Tool Results

When a single assistant message contains multiple tool_use blocks, all results are collected before the next LLM request:

```javascript
// Collection in mainAgentLoop:
let toolResults = [];  // 'y' in original code

// During streaming execution:
for (let result of streamingToolExecutor.getCompletedResults()) {
    if (result.message) {
        yield result.message;
        toolResults.push(...normalizeMessages([result.message], toolUseContext.options.tools)
            .filter(msg => msg.type === "user"));
    }
}

// After all tools complete:
// toolResults = [
//   { type: "user", message: { content: [{ type: "tool_result", tool_use_id: "abc", ... }] } },
//   { type: "user", message: { content: [{ type: "tool_result", tool_use_id: "def", ... }] } },
//   ...
// ]

// Passed to next turn:
messages = [...previousMessages, ...assistantMessages, ...toolResults];
```

---

## Error Handling

### Tool Not Found

```javascript
if (!tool) {
    yield {
        message: createUserMessage({
            content: [{
                type: "tool_result",
                content: `<tool_use_error>Error: No such tool available: ${toolName}</tool_use_error>`,
                is_error: true,
                tool_use_id: toolUseId
            }],
            toolUseResult: `Error: No such tool available: ${toolName}`,
            sourceToolAssistantUUID: assistantMessage.uuid
        })
    };
    return;
}
```

### Input Validation Error

```javascript
if (!parseResult.success) {
    let errorMessage = formatValidationError(tool.name, parseResult.error);
    return [{
        message: createUserMessage({
            content: [{
                type: "tool_result",
                content: `<tool_use_error>InputValidationError: ${errorMessage}</tool_use_error>`,
                is_error: true,
                tool_use_id: toolUseId
            }],
            toolUseResult: `InputValidationError: ${parseResult.error.message}`,
            sourceToolAssistantUUID: assistantMessage.uuid
        })
    }];
}
```

### Permission Denied

```javascript
if (permissionDecision.behavior !== "allow") {
    return [{
        message: createUserMessage({
            content: [{
                type: "tool_result",
                content: permissionDecision.message ?? "Tool execution denied",
                is_error: true,
                tool_use_id: toolUseId
            }],
            toolUseResult: `Error: ${permissionDecision.message}`,
            sourceToolAssistantUUID: assistantMessage.uuid
        })
    }];
}
```

### Execution Error

```javascript
try {
    let result = await tool.call(validatedInput, context);
    // ... success handling
} catch (error) {
    yield {
        message: createUserMessage({
            content: [{
                type: "tool_result",
                content: `<tool_use_error>Error calling tool (${tool.name}): ${error.message}</tool_use_error>`,
                is_error: true,
                tool_use_id: toolUseId
            }],
            toolUseResult: `Error calling tool (${tool.name}): ${error.message}`,
            sourceToolAssistantUUID: assistantMessage.uuid
        })
    };
}
```

---

## Summary

Tool integration in Claude Code 2.1.38 is a sophisticated pipeline that:

1. **Optimizes token usage** through deferred tool loading
2. **Reduces latency** via streaming parallel tool execution
3. **Provides security** through the permission system with hook integration
4. **Maintains observability** with comprehensive telemetry
5. **Handles errors gracefully** with informative error messages returned to the LLM

The separation of concerns between schema building, dispatch, execution, and result handling allows each phase to be optimized independently while maintaining a clean interface between them.