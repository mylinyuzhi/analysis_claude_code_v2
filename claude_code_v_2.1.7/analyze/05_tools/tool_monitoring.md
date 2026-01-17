# Tool Monitoring & Telemetry (Claude Code v2.1.7)

This document describes how Claude Code monitors and tracks tool execution, including telemetry events, logging, and performance tracking.

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

---

## Overview

Claude Code implements comprehensive monitoring for all tool executions. The telemetry system:

1. **Tracks tool usage** - Records which tools are called and how often
2. **Measures performance** - Logs execution duration and result sizes
3. **Monitors permissions** - Tracks permission grants and denials
4. **Captures errors** - Records validation and execution failures
5. **Provides debugging info** - Includes request IDs and chain tracking

---

## Telemetry Event Categories

### Tool Execution Events

All events use the `l("event_name", {...})` logging function (chunks.134.mjs).

#### Success Event

```javascript
// ============================================
// tengu_tool_use_success - Successful tool execution
// Location: chunks.134.mjs:992-1006
// ============================================

l("tengu_tool_use_success", {
  messageID: messageId,           // Parent message ID
  toolName: sanitizeToolName(tool.name),
  isMcp: tool.isMcp ?? false,     // Is MCP tool
  durationMs: executionTime,      // Execution duration
  toolResultSizeBytes: resultSize,// Result size in bytes
  queryChainId: context.queryTracking?.chainId,
  queryDepth: context.queryTracking?.depth,
  mcpServerType?: serverType,     // MCP server type if applicable
  requestId?: requestId           // API request ID if available
});
```

#### Error Events

```javascript
// ============================================
// tengu_tool_use_error - Tool execution errors
// Locations: chunks.134.mjs:668, 776, 804, 1073
// ============================================

// Error type 1: Tool not found (668-691)
l("tengu_tool_use_error", {
  error: `No such tool available: ${toolName}`,
  toolName: sanitizedName,
  toolUseID: toolUseId,
  isMcp: toolName.startsWith("mcp__"),
  queryChainId, queryDepth,
  mcpServerType?, requestId?
});

// Error type 2: Input validation error (776-801)
l("tengu_tool_use_error", {
  error: "InputValidationError",
  errorDetails: errorMessage.slice(0, 2000),
  messageID, toolName,
  isMcp: tool.isMcp ?? false,
  queryChainId, queryDepth,
  mcpServerType?, requestId?
});

// Error type 3: Custom validation error (804-829)
l("tengu_tool_use_error", {
  messageID, toolName,
  error: validationResult.message,
  errorCode: validationResult.errorCode,
  isMcp: tool.isMcp ?? false,
  queryChainId, queryDepth,
  mcpServerType?, requestId?
});

// Error type 4: Post-execution error (1073)
l("tengu_tool_use_error", {
  messageID, toolName,
  error: errorMessage,
  isMcp: tool.isMcp ?? false,
  queryChainId, queryDepth,
  mcpServerType?, requestId?
});
```

#### Cancelled Event

```javascript
// ============================================
// tengu_tool_use_cancelled - Tool execution cancelled
// Location: chunks.134.mjs:698-710
// ============================================

l("tengu_tool_use_cancelled", {
  toolName: sanitizeToolName(tool.name),
  toolUseID: toolUseId,
  isMcp: tool.isMcp ?? false,
  queryChainId: context.queryTracking?.chainId,
  queryDepth: context.queryTracking?.depth,
  mcpServerType?, requestId?
});
```

#### Progress Event

```javascript
// ============================================
// tengu_tool_use_progress - Mid-execution progress
// Location: chunks.134.mjs:744-762
// ============================================

l("tengu_tool_use_progress", {
  messageID: parentMessageId,
  toolName: sanitizeToolName(tool.name),
  isMcp: tool.isMcp ?? false,
  queryChainId: context.queryTracking?.chainId,
  queryDepth: context.queryTracking?.depth,
  mcpServerType?, requestId?
});
```

---

### Permission Events

Located in chunks.152.mjs and chunks.134.mjs.

#### Permission Allowed Events

```javascript
// ============================================
// tengu_tool_use_can_use_tool_allowed - Permission granted
// Location: chunks.134.mjs:916-927
// ============================================

l("tengu_tool_use_can_use_tool_allowed", {
  messageID: messageId,
  toolName: sanitizeToolName(tool.name),
  queryChainId: context.queryTracking?.chainId,
  queryDepth: context.queryTracking?.depth,
  mcpServerType?, requestId?
});

// ============================================
// tengu_tool_use_granted_in_config - Config-based permission
// Location: chunks.152.mjs:3235
// ============================================

l("tengu_tool_use_granted_in_config", {
  toolName: toolName,
  toolUseID: toolUseId,
  ruleSource: rule.source
});

// ============================================
// tengu_tool_use_granted_in_prompt_permanent/temporary
// Location: chunks.152.mjs:3259
// ============================================

l(isPermanent ? "tengu_tool_use_granted_in_prompt_permanent"
              : "tengu_tool_use_granted_in_prompt_temporary", {
  toolName: toolName,
  toolUseID: toolUseId
});

// ============================================
// tengu_tool_use_granted_by_permission_hook
// Location: chunks.152.mjs:3269
// ============================================

l("tengu_tool_use_granted_by_permission_hook", {
  toolName: toolName,
  toolUseID: toolUseId,
  hookName: hookName
});
```

#### Permission Rejected Events

```javascript
// ============================================
// tengu_tool_use_can_use_tool_rejected - Permission denied
// Location: chunks.134.mjs:889-900
// ============================================

l("tengu_tool_use_can_use_tool_rejected", {
  messageID: messageId,
  toolName: sanitizeToolName(tool.name),
  queryChainId: context.queryTracking?.chainId,
  queryDepth: context.queryTracking?.depth,
  mcpServerType?, requestId?
});

// ============================================
// tengu_tool_use_rejected_in_prompt - User rejected in prompt
// Location: chunks.152.mjs:3292-3303
// ============================================

l("tengu_tool_use_rejected_in_prompt", {
  toolName: toolName,
  toolUseID: toolUseId
});

// ============================================
// tengu_tool_use_denied_in_config - Config-based denial
// Location: chunks.152.mjs:3363
// ============================================

l("tengu_tool_use_denied_in_config", {
  toolName: toolName,
  toolUseID: toolUseId,
  ruleSource: rule.source
});
```

---

### MCP Tool Events

Located in chunks.149.mjs.

```javascript
// ============================================
// MCP Tool Success
// Location: chunks.149.mjs:1537
// ============================================

if (command === "call") {
  l("tengu_tool_use_success", {
    toolName: toolName,
    durationMs: executionTime,
    isMcp: true,
    mcpServerType: serverType
  });
}

// ============================================
// MCP Tool Error
// Location: chunks.149.mjs:1552
// ============================================

if (command === "call") {
  l("tengu_tool_use_error", {
    toolName: toolName,
    error: errorMessage,
    isMcp: true,
    mcpServerType: serverType
  });
}

// ============================================
// MCP Permission Request Shown
// Location: chunks.149.mjs:2959
// ============================================

l("tengu_tool_use_show_permission_request", {
  toolName: toolName,
  toolUseID: toolUseId,
  isMcp: true
});
```

---

### Shell/Bash Events

Located in chunks.85.mjs and chunks.121.mjs.

```javascript
// ============================================
// tengu_shell_set_cwd - Working directory change
// Location: chunks.85.mjs:2563
// ============================================

l("tengu_shell_set_cwd", {
  newCwd: newDirectory,
  previousCwd: previousDirectory
});

// ============================================
// tengu_bash_tool_reset_to_original_dir - Directory reset
// Location: chunks.85.mjs:2670
// ============================================

l("tengu_bash_tool_reset_to_original_dir", {
  originalDir: originalDirectory,
  currentDir: currentDirectory
});

// ============================================
// tengu_bash_security_check_triggered - Security pattern matched
// Location: chunks.121.mjs (multiple locations)
// ============================================

l("tengu_bash_security_check_triggered", {
  pattern: matchedPattern,
  command: sanitizedCommand,
  category: securityCategory
});
```

---

## Telemetry Event Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      Tool Execution Telemetry Flow                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Tool Call Received                                                     │
│         │                                                               │
│         ▼                                                               │
│  ┌────────────────────────┐                                             │
│  │ Schema Validation      │──Error──▶ tengu_tool_use_error              │
│  │ (inputSchema.safeParse)│          (InputValidationError)             │
│  └──────────┬─────────────┘                                             │
│             │ Success                                                   │
│             ▼                                                           │
│  ┌────────────────────────┐                                             │
│  │ Custom Validation      │──Error──▶ tengu_tool_use_error              │
│  │ (tool.validateInput)   │          (errorCode from tool)              │
│  └──────────┬─────────────┘                                             │
│             │ Success                                                   │
│             ▼                                                           │
│  ┌────────────────────────┐                                             │
│  │ Permission Check       │──Denied──▶ tengu_tool_use_can_use_tool_rejected
│  │ (checkPermissions)     │           tengu_tool_use_denied_in_config   │
│  └──────────┬─────────────┘           tengu_tool_use_rejected_in_prompt │
│             │ Allowed                                                   │
│             ▼                                                           │
│  ┌────────────────────────┐                                             │
│  │ tengu_tool_use_can_use_│  Logged on permission grant                 │
│  │ tool_allowed           │  + tengu_tool_use_granted_in_*              │
│  └──────────┬─────────────┘                                             │
│             │                                                           │
│             ▼                                                           │
│  ┌────────────────────────┐                                             │
│  │ Tool Execution         │──Progress──▶ tengu_tool_use_progress        │
│  │ (tool.call)            │                                             │
│  └──────────┬─────────────┘                                             │
│             │                                                           │
│    ┌────────┴────────┐                                                  │
│    │                 │                                                  │
│    ▼                 ▼                                                  │
│ [Success]         [Error]                                               │
│    │                 │                                                  │
│    ▼                 ▼                                                  │
│ tengu_tool_use_  tengu_tool_use_error                                   │
│ success          (execution error)                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Performance Tracking

### Execution Duration

```javascript
// ============================================
// Duration tracking in b77
// Location: chunks.134.mjs:947-1006
// ============================================

const startTime = Date.now();
const result = await tool.call(input, context, ...);
const durationMs = Date.now() - startTime;

// Record duration
aU1(durationMs);  // Internal duration tracker

// Log in success event
l("tengu_tool_use_success", {
  durationMs: durationMs,
  toolResultSizeBytes: resultSize,
  ...
});

// Log in structured metrics
LF("tool_result", {
  tool_name: toolName,
  success: "true",
  duration_ms: String(durationMs),
  tool_result_size_bytes: String(resultSize),
  ...
});
```

### Result Size Tracking

```javascript
// ============================================
// Result size calculation
// Location: chunks.134.mjs:984-991
// ============================================

let resultSize = 0;
try {
  resultSize = JSON.stringify(result.data).length;
} catch (error) {
  // Log error but don't fail
  logError(error);
}
```

---

## Query Chain Tracking

All tool events include query chain information for debugging multi-turn interactions:

```typescript
interface QueryTracking {
  chainId: string;   // Unique ID for the query chain
  depth: number;     // Depth in the agent loop (0 = main, 1+ = subagent)
}

// Usage in events:
l("tengu_tool_use_success", {
  queryChainId: context.queryTracking?.chainId,
  queryDepth: context.queryTracking?.depth,
  ...
});
```

---

## Tool Decision Tracking

Tracks how permission decisions were made:

```javascript
// ============================================
// Decision tracking functions
// Location: chunks.134.mjs:869, 946
// ============================================

// Track decision before execution
J82(tool.name, {
  file_path: input.file_path,  // For file tools
  full_command: input.command   // For bash tool
});

// Track decision after permission check
pI0(decision.decision || "unknown", decision.source || "unknown");

// Track metrics
LF("tool_result", {
  decision_source: decision.source,
  decision_type: decision.decision,
  ...
});
```

---

## Debug Output Tracking

Tool inputs and outputs are tracked for debugging:

```javascript
// ============================================
// Tool output tracking
// Location: chunks.134.mjs:960-973
// ============================================

if (result.data && typeof result.data === "object") {
  const outputData = {};

  // Read tool: track file path and content
  if (tool.name === READ_TOOL_NAME && "content" in result.data) {
    outputData.file_path = String(input.file_path);
    outputData.content = String(result.data.content);
  }

  // Edit/Write tool: track file path and diff
  if ((tool.name === EDIT_TOOL_NAME || tool.name === WRITE_TOOL_NAME)) {
    outputData.file_path = String(input.file_path);
    if ("diff" in result.data) outputData.diff = String(result.data.diff);
  }

  // Bash tool: track command and output
  if (tool.name === BASH_TOOL_NAME) {
    outputData.bash_command = input.command;
    if ("output" in result.data) outputData.output = String(result.data.output);
  }

  if (Object.keys(outputData).length > 0) {
    D82("tool.output", outputData);  // Log to debug system
  }
}
```

---

## Key Functions Reference

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `l` | logTelemetryEvent | chunks.134.mjs | Main telemetry logging function |
| `LF` | logStructuredMetric | chunks.134.mjs:1008-1023 | Structured metrics logging |
| `k9` | sanitizeToolName | chunks.134.mjs:668 | Sanitize tool name for logging |
| `aU1` | recordDuration | chunks.134.mjs:958 | Record execution duration |
| `sZ1` | recordToolResult | chunks.134.mjs:985 | Record tool result |
| `J82` | trackToolInput | chunks.134.mjs:869 | Track tool input for debugging |
| `X82` | clearToolInput | chunks.134.mjs:869 | Clear tracked input |
| `D82` | logDebugOutput | chunks.134.mjs:973 | Log debug output |
| `pI0` | trackPermissionDecision | chunks.134.mjs:889 | Track permission decision |

---

## Summary

The tool monitoring system in Claude Code v2.1.7:

1. **Comprehensive Event Logging** - Every tool action generates telemetry
2. **Performance Metrics** - Duration and size tracked for all executions
3. **Permission Audit Trail** - Full tracking of permission decisions
4. **Query Chain Context** - Links tool calls to parent queries
5. **Debug Information** - Input/output tracking for troubleshooting
6. **MCP Integration** - Special handling for MCP tool events
7. **Security Monitoring** - Bash security pattern detection logged
