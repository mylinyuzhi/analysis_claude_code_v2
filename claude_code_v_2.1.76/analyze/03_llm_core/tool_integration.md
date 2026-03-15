# Tool Integration (Claude Code 2.1.76)

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
PHASE 1: SCHEMA BUILDING (LLM Request)
Tool Objects ────► buildToolSchemas ────► API Schema
  - Filter by deferred loading
  - Add cache control markers
  - Include MCP tool metadata

PHASE 2: DISPATCH FROM RESPONSE
tool_use blocks ────► toolDispatcher ────► Execution
  - Lookup tool by name
  - Validate input against schema
  - Check permissions
  - Execute tool.call()

PHASE 3: RESULT FEEDBACK
tool_result ────► Message History ────► Next LLM Request
  - Normalize result content
  - Track file operations
  - Record telemetry
```

---

## Phase 1: Tool Schema Building

### buildToolSchemas - Converts tool objects to API format

**What it does:**
The `buildToolSchemas` (nZ6) function transforms internal tool objects into the JSON Schema format required by the Anthropic Messages API.

**How it works:**

1. **Deferred Loading Check**: If `deferLoading` is true for MCP tools, returns a minimal schema reference instead of the full definition.
2. **Input Schema Extraction**: Gets the Zod schema from the tool and converts it to JSON Schema format.
3. **Cache Control Injection**: If `cacheControl` is provided, adds it to the tool definition.
4. **MCP Metadata**: For MCP tools, includes additional properties like `isMcp: true`.

### Deferred Tools Logic

**What it does:**
Deferred tools is an optimization that reduces token usage by only including tool schemas that are likely to be used.

**How it works:**

1. **Tool Search Tool**: When deferred loading is enabled, a special `ToolSearch` tool is included
2. **Recent Tool Tracking**: The `tBA` function extracts tool names mentioned in recent messages
3. **Filtering Logic**:
   - Always include non-MCP tools
   - Always include ToolSearch
   - Include MCP tools only if recently mentioned

**Why this approach:**
- MCP servers can expose hundreds of tools, consuming significant tokens
- ToolSearch allows discovery without bloating every request
- Built-in tools are always included because they're core to the agent's capabilities

---

## Phase 2: Tool Dispatch from LLM Response

### StreamingToolExecutor - Parallel tool execution during streaming

**What it does:**
The `StreamingToolExecutor` (uU1) enables tools to start executing while the LLM stream is still in progress, reducing perceived latency.

**How it works:**

1. **Tool Queue**: As `tool_use` blocks arrive in the stream, they're added to an internal queue via `addTool()`
2. **Parallel Execution**: Each queued tool immediately begins execution in a separate async context
3. **Result Collection**: `getCompletedResults()` returns finished tool results that can be yielded immediately
4. **Remaining Drain**: `getRemainingResults()` is called after the stream ends to collect any still-running tools

**Why this approach:**
- **Reduced latency**: Users see tool results appearing while the LLM is still generating
- **Parallel execution**: Multiple independent tools can run simultaneously
- **Abort handling**: If the user cancels, running tools can be gracefully terminated

**Key insight:** The streaming tool executor trades complexity for latency. Without it, the user would wait for the entire LLM response before any tool starts.

### Sequential Tool Execution (tZ6)

**What it does:**
When streaming tool execution is disabled, the `tZ6` function executes tools sequentially after the stream completes.

---

## Permission Check Flow

### Permission Decision Tree

The permission system determines whether a tool can execute without user approval:

```
PreToolUse Hook Results
       ├── "allow"
       │    ├── Requires user interaction?
       │    │   ├── Yes → Call canUseTool
       │    │   └── No → Bypass permission check
       │
       ├── "deny" → Return error immediately
       │
       └── "ask" → Call canUseTool with context
```

### Hook Integration

**Pre-Tool Hooks (B1q):**
- Run before tool execution
- Can modify input (`hookUpdatedInput`)
- Can approve/deny (`hookPermissionResult`)
- Can stop execution (`stop`)

**Post-Tool Hooks (b1q):**
- Run after tool completes
- Receive tool name, input, and result
- Enable post-execution processing

---

## Result Feedback Loop

### Tool Result Construction

After tool execution, the result is wrapped in a `tool_result` message:

```javascript
{
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
}
```

### File Operation Tracking

Tools that modify files trigger tracking:
- Read tool: tracks `file_path`
- Edit/Write tools: tracks `file_path`
- Bash tool: tracks `full_command` (sanitized)

### Telemetry Recording

Every tool execution records:
```javascript
logEvent("tengu_tool_use_success", {
    messageID: messageId,
    toolName: sanitizeToolName(tool.name),
    isMcp: tool.isMcp ?? false,
    durationMs: executionDuration,
    toolResultSizeBytes: resultSizeBytes,
    queryChainId: toolUseContext.queryTracking?.chainId,
    queryDepth: toolUseContext.queryTracking?.depth,
    mcpServerType: mcpServerType,
    mcpServerUrl: mcpServerUrl
});
```

---

## Parallel vs Sequential Execution

### When to Use Each

| Mode | When Used | Characteristics |
|------|-----------|-----------------|
| Streaming Parallel | `tengu_streaming_tool_execution2` flag enabled | Lower latency, tools run during stream |
| Sequential | Flag disabled, post-stream, or fallback | Simpler, guaranteed ordering |

### Execution Flows

**Streaming:**
```
Stream Event: tool_use
    ├──► Immediately start toolDispatcher()
    │
    └─ Stream continues meanwhile
        Stream Event: tool_use (parallel)
        └──► Runs in parallel with first tool
Stream completes
    └──► getRemainingResults() drains pending
```

**Sequential:**
```
Stream completes with all tool_use blocks
    ├──► executeToolsSequentially()
    │    ├── toolDispatcher(tool_use_1) → Execute → Yield result
    │    ├── toolDispatcher(tool_use_2) → Execute → Yield result
    │    └── (etc.)
```

---

## MCP Tool Handling

### MCP Tool Name Parsing

MCP tool names follow format: `mcp__<server_name>__<tool_name>`

### MCP Server Type Detection

Detects connection type:
- "stdio": Standard input/output
- "sse": Server-sent events
- "streamable-http": HTTP streaming

---

## Error Handling

**Tool Not Found**: Returns error message "No such tool available"

**Input Validation Error**: Returns `InputValidationError` with details

**Permission Denied**: Returns error with denial reason

**Execution Error**: Wraps error in tool_result with `is_error: true`

---

## Summary

Tool integration in Claude Code 2.1.76:

1. **Optimizes token usage** through deferred tool loading
2. **Reduces latency** via streaming parallel tool execution
3. **Provides security** through the permission system with hook integration
4. **Maintains observability** with comprehensive telemetry
5. **Handles errors gracefully** with informative error messages returned to the LLM

The separation of concerns between schema building, dispatch, execution, and result handling allows each phase to be optimized independently.
