# Tools Cross-System Integration - Complete Documentation

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-27
> **Status**: ✅ Complete integration documentation

---

## Overview

This document documents all cross-module integration points between the Tools system and other modules in Claude Code, including System Reminder (04), MCP (06), Hooks (11), Sandbox (18), and Plan Mode (12).

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                   TOOLS CROSS-MODULE INTEGRATION                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│                          ┌─────────────┐                              │
│                          │   TOOLS     │                              │
│                          │   (05)      │                              │
│                          └──────┬──────┘                              │
│                                  │                                    │
│     ┌────────────────────────────┼────────────────────────────┐      │
│     │                            │                            │      │
│     ▼                            ▼                            ▼      │
│ ┌───────────┐            ┌───────────────┐            ┌───────────┐ │
│ │  SYSTEM   │            │     MCP       │            │   HOOKS   │ │
│ │ REMINDER  │◄───────────│    (06)       │───────────►│   (11)    │ │
│ │   (04)    │            │               │            │           │ │
│ └───────────┘            └───────────────┘            └───────────┘ │
│        │                        │                            │       │
│        │                        │                            │       │
│        ▼                        ▼                            ▼       │
│ ┌───────────┐            ┌───────────────┐            ┌───────────┐ │
│ │  SANDBOX  │            │   PLAN MODE   │            │   TASK    │ │
│ │   (18)    │            │     (12)      │            │  SYSTEM   │ │
│ └───────────┘            └───────────────┘            │   (13)    │ │
│                                                         └───────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. Tools ↔ System Reminder (04)

### Integration Points

**Tool execution generates attachments that become system reminders:**

| Attachment Type | When Generated | Purpose |
|-----------------|----------------|---------|
| `progress` | During tool execution | Progress updates for long-running tools |
| `hook_additional_context` | PreToolUse hook | Extra context from hooks |
| `hook_blocking_error` | PreToolUse hook denial | Error message from hook |
| `task_status` | Task tool execution | Task state changes |
| `permission_decision` | Permission check | Permission flow results |
| `hook_stopped_continuation` | Hook stopped execution | Hook stopped after tool |
| `structured_output` | Tool returned structured data | Structured data from tools |

### Message Flow

```
Tool execution starts
    │
    ├─→ Progress callback called
    │     │
    │     └─→ C4q(createProgressMessage) → AsyncQueue → UI
    │
    ├─→ Hook provides additional context
    │     │
    │     └─→ f4(createAttachmentMessage) → p1(createUserMessage, isMeta: true)
    │
    └─→ Tool completes
          │
          └─→ Result wrapped in tool_result → Added to conversation
```

### Key Functions

```javascript
// ============================================
// Attachment creation for system reminders
// ============================================

// Progress message (streaming updates)
function createProgressMessage(options) {
    return {
        type: "progress",
        toolUseID: options.toolUseID,
        parentToolUseID: options.parentToolUseID,
        data: options.data,
        timestamp: Date.now()
    };
}

// Attachment message (hook results, etc.)
function createAttachmentMessage(options) {
    return {
        type: "attachment",
        attachment: {
            type: options.type,
            hookName: options.hookName,
            toolUseID: options.toolUseID,
            hookEvent: options.hookEvent,
            ...(options.content && { content: options.content }),
            ...(options.blockingError && { blockingError: options.blockingError })
        }
    };
}

// User message wrapper
function createUserMessage(options) {
    return {
        role: "user",
        content: options.content,
        ...(options.toolUseResult && { toolUseResult: options.toolUseResult }),
        ...(options.sourceToolAssistantUUID && { sourceToolAssistantUUID: options.sourceToolAssistantUUID }),
        isMeta: options.isMeta ?? false
    };
}
```

### Integration with Tool Pipeline

**Stage 3 (Pre-tool Hooks) → System Reminder:**
```javascript
// In y4q (executePreToolHooks)
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
```

**Stage 5 (Tool Execution) → Progress Streaming:**
```javascript
// In ZxY (toolExecutionOrchestrator)
toolExecutionPipeline(..., (progressEvent) => {
    queue.enqueue({
        message: createProgressMessage({
            toolUseID: progressEvent.toolUseID,
            parentToolUseID: toolUseId,
            data: progressEvent.data
        })
    });
});
```

---

## 2. Tools ↔ MCP (06)

### Integration Points

| Integration Point | Description |
|-------------------|-------------|
| Tool Discovery | MCP tools discovered via `fetchMcpTools` |
| Tool Execution | MCP tools called via `callMcpTool` |
| Session Recovery | Retry on `McpSessionLostError` |
| Progress Tracking | `mcp_progress` events |
| Annotation Mapping | MCP annotations → tool methods |

### Tool Discovery Flow

```
MCP Server connects
    │
    ├─→ Check capabilities.tools
    │
    ├─→ fetchMcpTools (JE) sends tools/list
    │
    ├─→ For each tool:
    │     ├─→ Build prefixed name: mcp__<server>__<tool>
    │     ├─→ Extract annotations:
    │     │     ├─→ readOnlyHint → isReadOnly()
    │     │     ├─→ destructiveHint → isDestructive()
    │     │     └─→ openWorldHint → isOpenWorld()
    │     └─→ Create tool object with call() method
    │
    └─→ Register in session tool set
```

### Tool Execution with Retry

```javascript
// ============================================
// MCP tool call with session recovery retry
// Location: chunks.170.mjs (in fetchMcpTools)
// ============================================

// In tool.call() for MCP tools:
for (let attempt = 0; ; attempt++) {
    try {
        // Get connected client (may reconnect)
        const client = await getMcpClientConnection(clientConnection);

        // Execute tool call
        const result = await executeMcpToolCall({
            client,
            clientConnection,
            tool: tool.name,
            args: input,
            signal: toolUseContext.abortController.signal
        });

        return { data: result.content, ... };

    } catch (error) {
        // Retry on session loss
        if (error instanceof McpSessionLostError && attempt < maxRetries) {
            logInfo(clientConnection.name,
                `Retrying tool '${tool.name}' after session recovery`);
            continue;
        }
        throw error;
    }
}
```

### MCP Tool Name Parsing

```javascript
// ============================================
// MCP tool name parsing utilities
// ============================================

// Get MCP server from tool name
function getMcpServerFromToolName(toolName, mcpClients) {
    if (!toolName.startsWith("mcp__")) return;

    const parsed = parseMcpToolName(toolName);
    if (!parsed) return;

    return mcpClients.find((client) =>
        normalizeServerName(client.name) === parsed.serverName
    );
}

// Get MCP server type (stdio, http, sse, etc.)
function getMcpServerType(toolName, mcpClients) {
    const client = getMcpServerFromToolName(toolName, mcpClients);
    if (client?.type === "connected") {
        return client.config.type ?? "stdio";
    }
}

// Get MCP server base URL (for HTTP/SSE)
function getMcpServerBaseUrl(toolName, mcpClients) {
    const client = getMcpServerFromToolName(toolName, mcpClients);
    if (client?.type !== "connected") return;
    return getUrlFromConfig(client.config);
}
```

### Annotation Mapping

| MCP Annotation | Tool Method | Purpose |
|----------------|-------------|---------|
| `readOnlyHint` | `isReadOnly()` | Tool doesn't modify state |
| `readOnlyHint` | `isConcurrencySafe()` | Safe for concurrent execution |
| `destructiveHint` | `isDestructive()` | May cause irreversible changes |
| `openWorldHint` | `isOpenWorld()` | Interacts with external systems |

---

## 3. Tools ↔ Hooks (11)

### Integration Points

| Hook Type | When Called | Can Modify |
|-----------|-------------|------------|
| PreToolUse | Before tool execution | Input, Permission, Continuation |
| PostToolUse | After successful tool | Output, Attachments |
| PostToolUseFailure | After tool error | Error handling, Context |

### PreToolUse Hook Effects

```javascript
// ============================================
// PreToolUse hook result types
// ============================================

interface PreToolUseHookResult {
    // Optional: Message to display
    message?: string;

    // Optional: Block execution with error
    blockingError?: string;

    // Optional: Provide permission decision
    permissionBehavior?: "allow" | "deny" | "ask";
    hookPermissionDecisionReason?: string;

    // Optional: Modify tool input
    updatedInput?: object;

    // Optional: Stop execution after tool
    preventContinuation?: boolean;
    stopReason?: string;

    // Optional: Inject additional context
    additionalContexts?: ContextBlock[];
}
```

### Hook Execution in Pipeline

**Stage 3: Pre-tool Hooks (y4q)**

```javascript
// Hook can provide these effects:

// 1. Permission bypass
if (hookResult.permissionBehavior === "allow") {
    // Skip canUseTool call
    permissionResult = hookPermissionResult;
}

// 2. Input modification
if (hookResult.updatedInput) {
    input = hookResult.updatedInput;
}

// 3. Execution blocking
if (hookResult.blockingError) {
    // Return error immediately
    return createDeniedToolResult(toolUseId, hookResult.blockingError);
}

// 4. Stop after tool
if (hookResult.preventContinuation) {
    // Set flag to stop after this tool
    shouldStopAfterTool = true;
}
```

### PostToolUse Hook Integration

```javascript
// ============================================
// PostToolUse hook result types
// ============================================

interface PostToolUseHookResult {
    // Optional: Message to display
    message?: string;

    // Optional: Modified output
    modifiedOutput?: ToolResult;

    // Optional: Prevent continuation
    preventContinuation?: boolean;
    stopReason?: string;

    // Optional: Additional context
    additionalContexts?: ContextBlock[];
}
```

---

## 4. Tools ↔ Sandbox (18)

### Integration Points

| Integration Point | Description |
|-------------------|-------------|
| Bash Command Sandboxing | All Bash commands checked for sandbox compliance |
| Path Restrictions | File operations validated against allowed paths |
| Command Exclusion | Certain commands exempt from sandboxing |
| Network Permissions | Domain-based network access control |

### Bash Tool Sandbox Integration

```javascript
// ============================================
// Bash tool sandbox check
// Location: chunks.172.mjs
// ============================================

// Check if command should be sandboxed
function checkBashPermissionWithSandbox(command, permissionContext, toolUseContext) {
    // Check exclusion patterns
    if (isCommandInExcludedList(command)) {
        return { shouldSandbox: false };
    }

    // Check if sandboxing is enabled
    if (!isSandboxingEnabled()) {
        return { shouldSandbox: false };
    }

    // Get sandbox configuration
    const sandboxConfig = getSandboxConfig();

    return {
        shouldSandbox: true,
        config: sandboxConfig
    };
}

// Check if command is in exclusion list
function isCommandInExcludedList(command) {
    const patterns = getExcludedCommands();
    for (const pattern of patterns) {
        if (matchesExclusionPattern(command, pattern)) {
            return true;
        }
    }
    return false;
}
```

### Sandbox Permission Sync (Swarm)

For multi-agent scenarios, sandbox permissions must be synced between teammates:

```javascript
// ============================================
// Sandbox permission request/response flow
// ============================================

// Teammate needs sandbox permission
async function sendSandboxPermissionRequest(request) {
    const requestId = generateSandboxRequestId();
    const requestMessage = {
        type: "sandbox_permission_request",
        requestId,
        command: request.command,
        from: getAgentName()
    };

    // Send to team-lead inbox
    await writeToMailbox("team-lead", {
        from: getAgentName(),
        text: JSON.stringify(requestMessage),
        timestamp: new Date().toISOString()
    });

    // Wait for response
    return new Promise((resolve, reject) => {
        sandboxPermissionCallbacks.set(requestId, { resolve, reject });
    });
}

// Team-lead responds
async function sendSandboxPermissionResponse(requestId, approved) {
    await writeToMailbox(teammateName, {
        from: "team-lead",
        text: JSON.stringify({
            type: "sandbox_permission_response",
            requestId,
            approved
        }),
        timestamp: new Date().toISOString()
    });
}
```

---

## 5. Tools ↔ Plan Mode (12)

### Integration Points

| Integration Point | Description |
|-------------------|-------------|
| Tool Filtering | Plan mode restricts available tools |
| Path Restriction | Write/Edit only to plan file |
| Mode Exit | ExitPlanMode is only programmatic exit |
| Question Tool | AskUserQuestion allowed for clarification |

### Tool Filtering Algorithm

```javascript
// ============================================
// Tool filtering for plan mode
// ============================================

function filterToolsForPlanMode(tools, planFilePath) {
    return tools.filter((tool) => {
        // Always allow read-only tools
        if (tool.isReadOnly?.()) return true;

        // Allow ExitPlanMode
        if (tool.name === "ExitPlanMode") return true;

        // Allow EnterPlanMode (for re-entry)
        if (tool.name === "EnterPlanMode") return true;

        // Allow AskUserQuestion
        if (tool.name === "AskUserQuestion") return true;

        // Allow Write/Edit (path checked at execution time)
        if (tool.name === "Write" || tool.name === "Edit") return true;

        // Block all other tools
        return false;
    });
}
```

### Write/Edit Path Restriction

```javascript
// ============================================
// Plan mode file path validation
// ============================================

async function validatePlanModePath(toolName, filePath, planFilePath) {
    if (toolName !== "Write" && toolName !== "Edit") {
        return { valid: true };
    }

    // Normalize paths for comparison
    const normalizedPath = normalizePath(filePath);
    const normalizedPlanPath = normalizePath(planFilePath);

    if (normalizedPath !== normalizedPlanPath) {
        return {
            valid: false,
            message: `In plan mode, you can only write to the plan file: ${planFilePath}`
        };
    }

    return { valid: true };
}
```

### Plan Mode Tool Execution

```
Tool called in plan mode
    │
    ├─→ Check if tool is allowed
    │     └─→ Not in allowed set → Return error
    │
    ├─→ If Write/Edit:
    │     ├─→ Check path against planFilePath
    │     └─→ Path mismatch → Return error
    │
    └─→ Execute tool normally
```

---

## 6. Tools ↔ Task System (13)

### Integration Points

| Integration Point | Description |
|-------------------|-------------|
| Task Tools | TaskCreate, TaskGet, TaskList, TaskUpdate |
| TodoWrite Tool | Simple todo mode (when task system disabled) |
| Task Claiming | Lock-based task claiming for agents |
| Hook Integration | TaskCompleted hooks for validation |

### Task Tool Definitions

```javascript
// ============================================
// Task tool name constants
// ============================================

const TOOL_NAME_TASK_CREATE = "TaskCreate";  // TR
const TOOL_NAME_TASK_UPDATE = "TaskUpdate";  // ck
const TOOL_NAME_TASK_GET = "TaskGet";        // lt
const TOOL_NAME_TASK_LIST = "TaskList";      // it
const TOOL_NAME_TODO_WRITE = "TodoWrite";    // MB
```

### Task System Enable Check

```javascript
// ============================================
// Task system enable check
// ============================================

function isTaskSystemEnabled() {
    // Check environment variable
    if (parseBoolean(process.env.CLAUDE_CODE_ENABLE_TASKS)) {
        return true;
    }

    // Check if in swarm/team mode
    return !isFirstParty();
}
```

### Task Tool vs TodoWrite Selection

```javascript
// ============================================
// Tool selection based on task system state
// ============================================

function getTaskTools() {
    if (isTaskSystemEnabled()) {
        return [
            TaskCreateTool,
            TaskGetTool,
            TaskListTool,
            TaskUpdateTool
        ];
    } else {
        return [TodoWriteTool];
    }
}
```

### TaskCompleted Hook Integration

```javascript
// ============================================
// TaskCompleted hooks run before marking complete
// ============================================

async function* executeTaskCompletedHooks(task) {
    const hooks = getHooksForEvent("TaskCompleted");

    for (const hook of hooks) {
        try {
            const result = await hook.execute({ task });

            if (result.blockingError) {
                // Prevent completion
                yield {
                    type: "blockingError",
                    message: result.blockingError
                };
            }
        } catch (error) {
            yield {
                type: "error",
                message: `Hook error: ${error.message}`
            };
        }
    }
}
```

---

## 7. Tools ↔ Agent Teams (30)

### Integration Points

| Integration Point | Description |
|-------------------|-------------|
| Agent Tool | Spawn teammates with various modes |
| Message Tool | Team communication via SendMessage |
| Plan Approval | Swarm teammate plan approval workflow |
| Permission Sync | Cross-agent permission requests |

### Agent Tool Isolation

```javascript
// ============================================
// Agent tool worktree isolation
// ============================================

const AgentTool = {
    name: "Agent",

    async call(input, context) {
        // Check if worktree isolation requested
        if (input.isolation === "worktree") {
            // Create isolated git worktree
            const worktree = await createWorktree();
            // Run agent in worktree
            // Cleanup on exit
        }

        // Spawn agent
        if (input.mode === "background") {
            return spawnBackgroundAgent(input, context);
        } else if (input.mode === "foreground") {
            return spawnForegroundAgent(input, context);
        }
    }
};
```

---

## Validation Summary

| Integration | Status | Key Functions |
|-------------|--------|---------------|
| Tools ↔ System Reminder | ✅ Verified | p1, f4, C4q |
| Tools ↔ MCP | ✅ Verified | JE, pC, yT6 |
| Tools ↔ Hooks | ✅ Verified | y4q, k4q, E4q |
| Tools ↔ Sandbox | ✅ Verified | Ti, yYz, Ezz |
| Tools ↔ Plan Mode | ✅ Verified | filterToolsForPlanMode |
| Tools ↔ Task System | ✅ Verified | TR, ck, lt, it, MB |

---

## Quick Reference

### Attachment Types

| Type | Source | Purpose |
|------|--------|---------|
| `progress` | Tool execution | Streaming updates |
| `hook_additional_context` | PreToolUse hook | Extra context |
| `hook_blocking_error` | PreToolUse hook | Denial message |
| `hook_cancelled` | Hook abort | Cancellation notice |
| `task_status` | Task tools | Task state changes |

### Tool Filtering by Mode

| Mode | Allowed Tools |
|------|---------------|
| default | All tools |
| plan | ReadOnly + ExitPlanMode + AskUserQuestion + Write/Edit (plan file only) |
| bypassPermissions | All tools (skip permission prompts) |
| dontAsk | All tools (minimize prompts) |