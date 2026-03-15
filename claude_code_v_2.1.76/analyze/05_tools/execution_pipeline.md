# Tools Execution Pipeline

> **See [tool_execution_pipeline.md](tool_execution_pipeline.md) for the complete pipeline analysis with code snippets and deep dive.**

## Overview

Deep analysis of the tool execution pipeline in Claude Code v2.1.76, covering validation, permission checking, execution, and result handling.

---

## 1. Execution Flow

```
┌──────────────────────────────────────────────────┐
│         TOOL EXECUTION PIPELINE                  │
├──────────────────────────────────────────────────┤
│                                                  │
│  LLM Response (tool_use)                         │
│     │                                            │
│     ▼                                            │
│  [1] Parse Tool Use                              │
│     ├─> Extract: name, id, input                │
│     └─> Validate JSON schema                    │
│     │                                            │
│     ▼                                            │
│  [2] Lookup Tool Definition                     │
│     ├─> Built-in tools registry                 │
│     ├─> MCP tools                               │
│     └─> Custom tools                            │
│     │                                            │
│     ▼                                            │
│  [3] Permission Check                           │
│     ├─> Auto-allow (safe tools)                 │
│     ├─> User prompt (risky tools)               │
│     └─> Auto-deny (blocked tools)               │
│     │                                            │
│     ▼                                            │
│  [4] Execute Tool                                │
│     ├─> Call tool handler                       │
│     ├─> Capture stdout/stderr                   │
│     └─> Handle errors                           │
│     │                                            │
│     ▼                                            │
│  [5] Format Result                               │
│     ├─> Success: { data: {...} }                │
│     └─> Error: { error: "..." }                 │
│     │                                            │
│     ▼                                            │
│  Return to LLM (tool_result)                    │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 2. Permission Checking

### 2.1 Permission Modes

1. **Auto-Allow**: Read-only tools (Read, Glob, Grep)
2. **User Prompt**: Destructive tools (Write, Edit, Bash)
3. **Auto-Deny**: Blocked paths (e.g., `/etc`, `~/.ssh`)

### 2.2 Decision Logic

```javascript
function checkToolPermission(toolName, input) {
    // Whitelist check
    if (SAFE_TOOLS.includes(toolName)) {
        return { behavior: "allow" };
    }

    // Blocklist check
    if (input.path && isBlockedPath(input.path)) {
        return { behavior: "deny", reason: "Blocked path" };
    }

    // Default: ask user
    return { behavior: "ask", tool: toolName, input };
}
```

---

## 3. Error Handling

### 3.1 Tool Errors

**Categories**:
1. **Validation Error**: Invalid input schema
2. **Permission Error**: User denied or blocked path
3. **Execution Error**: Tool threw exception
4. **Timeout Error**: Tool exceeded time limit

**Error Format**:
```javascript
{
    error: "Tool execution failed: permission denied",
    metadata: {
        tool: "Bash",
        input: { command: "rm -rf /" },
        reason: "blocked_command"
    }
}
```

---

## 4. Streaming Tools

**Streaming-Capable Tools**:
- `Bash` (stdout streaming)
- `Task` (subagent output streaming)

**Streaming Protocol**:
```javascript
async function* executeBashStreaming(command) {
    const process = spawn("bash", ["-c", command]);

    for await (const chunk of process.stdout) {
        yield { type: "stdout", data: chunk.toString() };
    }

    const exitCode = await process.exit;
    yield { type: "exit", code: exitCode };
}
```

---

## Summary

The tool execution pipeline provides **safe, controlled execution** with:

1. **Schema Validation**: Ensures well-formed inputs
2. **Permission Gating**: Protects user from destructive operations
3. **Error Handling**: Graceful degradation on failures
4. **Streaming Support**: Real-time output for long-running tools

**Key insight**: Permission checking happens AFTER tool lookup but BEFORE execution, allowing context-aware decisions based on both tool type and input parameters.
