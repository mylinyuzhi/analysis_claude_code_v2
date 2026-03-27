# Tools Cross-Module Integration - Complete Documentation

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-27
> **Status**: ✅ Complete integration documentation with source-level restoration

---

## Overview

This document provides comprehensive documentation of all cross-module integration points between the Tools system (05) and other modules in Claude Code, including System Reminder (04), MCP (06), Hooks (11), Sandbox (18), Plan Mode (12), and Task System (13).

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)

Key functions in this document:
- `toolDispatcher` (Wi6) - Entry point - chunks.146.mjs:285
- `toolExecutionPipeline` (fxY) - 8-stage pipeline - chunks.146.mjs:442
- `executePreToolHooks` (y4q) - Hook execution - chunks.146.mjs:74
- `createUserMessage` (p1) - Message factory - chunks.173.mjs:1378
- `createAttachmentMessage` (f4) - Attachment wrapper - chunks.*.mjs

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

| Attachment Type | When Generated | Purpose | Source Function |
|-----------------|----------------|---------|-----------------|
| `progress` | During tool execution | Progress updates for long-running tools | `C4q` (createProgressMessage) |
| `hook_additional_context` | PreToolUse hook | Extra context from hooks | `f4` (createAttachmentMessage) |
| `hook_blocking_error` | PreToolUse hook denial | Error message from hook | `f4` |
| `task_status` | Task tool execution | Task state changes | Task tools |
| `permission_decision` | Permission check | Permission flow results | Permission system |
| `hook_stopped_continuation` | Hook stopped execution | Hook stopped after tool | `f4` |
| `structured_output` | Tool returned structured data | Structured data from tools | Tool execution |

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

### Source Code: Attachment Creation

```javascript
// ============================================
// createUserMessage - Message factory for tool results
// Location: chunks.173.mjs:1378-1420
// ============================================

// ORIGINAL (for source lookup):
function p1(A) {
    let q = A.content,
        K = A.toolUseResult,
        Y = A.sourceToolAssistantUUID,
        z = A.isMeta,
        _ = z === void 0 ? !1 : z;
    return {
        role: "user",
        content: q,
        ...(K !== void 0 && {
            toolUseResult: K
        }),
        ...(Y !== void 0 && {
            sourceToolAssistantUUID: Y
        }),
        isMeta: _
    }
}

// READABLE (for understanding):
function createUserMessage(options) {
    const {
        content,
        toolUseResult,
        sourceToolAssistantUUID,
        isMeta = false
    } = options;

    return {
        role: "user",
        content,
        // Optional: Tool result for API
        ...(toolUseResult !== undefined && {
            toolUseResult
        }),
        // Optional: Link to originating assistant message
        ...(sourceToolAssistantUUID !== undefined && {
            sourceToolAssistantUUID
        }),
        // Meta flag for system messages (not shown to LLM in some contexts)
        isMeta
    };
}

// Mapping: p1→createUserMessage, A→options, q→content, K→toolUseResult,
//          Y→sourceToolAssistantUUID, z→isMeta
```

### Source Code: Progress Message Creation

```javascript
// ============================================
// createProgressMessage - Streaming progress updates
// Location: chunks.146.mjs (in ZxY function)
// ============================================

// ORIGINAL (for source lookup):
function C4q(A) {
    let q = A.toolUseID,
        K = A.parentToolUseID,
        Y = A.data;
    return {
        type: "progress",
        toolUseID: q,
        parentToolUseID: K,
        data: Y,
        timestamp: Date.now()
    }
}

// READABLE (for understanding):
function createProgressMessage(options) {
    const {
        toolUseID,        // Current tool use ID
        parentToolUseID,  // Parent tool (for nested calls)
        data              // Progress data (percentage, status text, etc.)
    } = options;

    return {
        type: "progress",
        toolUseID,
        parentToolUseID,
        data,
        timestamp: Date.now()
    };
}

// Mapping: C4q→createProgressMessage, A→options, q→toolUseID,
//          K→parentToolUseID, Y→data
```

### Integration in Tool Pipeline

**Stage 3 (Pre-tool Hooks) → System Reminder:**

```javascript
// In y4q (executePreToolHooks) - chunks.146.mjs:74

// ORIGINAL (for source lookup):
if (j.additionalContexts && j.additionalContexts.length > 0) {
    yield {
        type: "additionalContext",
        message: {
            message: {
                type: "attachment",
                attachment: {
                    type: "hook_additional_context",
                    content: j.additionalContexts,
                    hookName: `PreToolUse:${q.name}`,
                    toolUseID: Y,
                    hookEvent: "PreToolUse"
                }
            }
        }
    };
}

// READABLE (for understanding):
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
// In ZxY (toolExecutionOrchestrator) - chunks.146.mjs:391

// ORIGINAL (for source lookup):
function ZxY(A, q, K, Y, z, _, w, O, $, H) {
    let j = new Pi6;
    return fxY(A, q, K, Y, z, _, w, O, $, H, (J) => {
        d("tengu_tool_use_progress", {...});
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
function toolExecutionOrchestrator(tool, toolUseId, input, toolUseContext,
                                   canUseTool, assistantMessage, messageId,
                                   requestId, mcpServerType, mcpServerBaseUrl) {
    const progressQueue = new AsyncQueue();

    // Execute pipeline with progress callback
    toolExecutionPipeline(tool, toolUseId, input, toolUseContext, canUseTool,
        assistantMessage, messageId, requestId, mcpServerType, mcpServerBaseUrl,
        (progressEvent) => {
            // Track progress event
            trackEvent("tengu_tool_use_progress", {...});

            // Enqueue progress message
            progressQueue.enqueue({
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
            progressQueue.enqueue(result);
        }
    }).catch((error) => {
        progressQueue.error(error);
    }).finally(() => {
        progressQueue.done();
    });

    return progressQueue;
}

// Mapping: ZxY→toolExecutionOrchestrator, A→tool, q→toolUseId, K→input,
//          Y→toolUseContext, z→canUseTool, _→assistantMessage, w→messageId,
//          O→requestId, $→mcpServerType, H→mcpServerBaseUrl, Pi6→AsyncQueue
```

---

## 2. Tools ↔ MCP (06)

### Integration Points

| Integration Point | Description | Key Functions |
|-------------------|-------------|---------------|
| Tool Discovery | MCP tools discovered via `fetchMcpTools` | `JE` (fetchMcpTools) |
| Tool Execution | MCP tools called via `callMcpTool` | `pC` (callMcpTool) |
| Session Recovery | Retry on `McpSessionLostError` | `qn8` (McpSessionLostError) |
| Progress Tracking | `mcp_progress` events | Progress callback |
| Annotation Mapping | MCP annotations → tool methods | Tool object creation |

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
// Location: chunks.170.mjs:533-678 (in fetchMcpTools)
// ============================================

// ORIGINAL (for source lookup):
async call(w, O, $, H, j) {
    let P = j?.signal ?? sK().signal,
        X = $y1(P, {
            timeoutMs: MGq
        }),
        W = O?.requestPrompt;
    for (let G = 0;; G++) try {
        let f = await yT6(A),
            v = await F3z({
                client: f,
                clientConnection: A,
                tool: z.name,
                args: w,
                signal: X.signal,
                requestPrompt: W,
                toolCallId: $
            });
        return {
            data: v.content,
            structuredContent: v.structuredContent,
            rawData: v.rawData
        }
    } catch (G) {
        if (G instanceof qn8 && G.attempts < X) {
            n1(A.name, `Retrying tool '${z.name}' after session recovery`);
            continue
        }
        throw G
    }
}

// READABLE (for understanding):
async function mcpToolCall(input, sessionContext, toolCallId, assistantMessage, extras) {
    const signal = extras?.signal ?? getAbortController().signal;
    const abortSignal = createTimeoutSignal(signal, { timeoutMs: HTTP_TIMEOUT_MS });
    const requestPrompt = sessionContext?.requestPrompt;

    // Retry loop for session recovery
    for (let attempt = 0; ; attempt++) {
        try {
            // Get or reconnect MCP client
            const client = await getMcpClientConnection(clientConnection);

            // Execute tool
            const result = await executeMcpToolCall({
                client,
                clientConnection,
                tool: toolName,
                args: input,
                signal: abortSignal.signal,
                requestPrompt,
                toolCallId
            });

            return {
                data: result.content,
                structuredContent: result.structuredContent,
                rawData: result.rawData
            };

        } catch (error) {
            // Retry on session loss
            if (error instanceof McpSessionLostError && error.attempts < maxRetries) {
                logInfo(clientConnection.name,
                    `Retrying tool '${toolName}' after session recovery`);
                continue;
            }
            throw error;
        }
    }
}

// Mapping: w→input, O→sessionContext, $→toolCallId, H→assistantMessage, j→extras,
//          yT6→getMcpClientConnection, F3z→executeMcpToolCall, qn8→McpSessionLostError
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

| Hook Type | When Called | Can Do |
|-----------|-------------|--------|
| PreToolUse | Before tool execution | Block, modify input, bypass permission, stop execution |
| PostToolUse | After successful execution | Modify output, add attachments |
| PostToolUseFailure | After failed execution | Handle errors, provide recovery |

### Hook Event Types

| Event Type | Description | Source |
|------------|-------------|--------|
| `hookPermissionResult` | Hook provided permission decision | PreToolUse |
| `hookUpdatedInput` | Hook modified tool input | PreToolUse |
| `preventContinuation` | Hook wants to stop after tool | PreToolUse |
| `stopReason` | Custom stop message | PreToolUse |
| `additionalContext` | Extra context to inject | PreToolUse |
| `stop` | Immediate stop requested | PreToolUse |

### Hook Execution in Pipeline

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
                               q.getToolUseSummary?.(Y))) {
            // Permission behavior from hook
            if (j.permissionBehavior !== void 0) {
                yield {
                    type: "hookPermissionResult",
                    hookPermissionResult: {
                        behavior: j.permissionBehavior,
                        updatedInput: j.updatedInput,
                        decisionReason: {
                            type: "hook",
                            hookName: `PreToolUse:${q.name}`,
                            reason: j.hookPermissionDecisionReason
                        }
                    }
                };
            }

            // Blocking error
            if (j.blockingError) {
                yield {
                    type: "hookPermissionResult",
                    hookPermissionResult: {
                        behavior: "deny",
                        message: j.blockingError
                    }
                };
            }

            // Updated input
            if (j.updatedInput) {
                yield {
                    type: "hookUpdatedInput",
                    updatedInput: j.updatedInput
                };
            }

            // Additional context
            if (j.additionalContexts && j.additionalContexts.length > 0) {
                yield {
                    type: "additionalContext",
                    message: {
                        message: {
                            type: "attachment",
                            attachment: {
                                type: "hook_additional_context",
                                content: j.additionalContexts,
                                hookName: `PreToolUse:${q.name}`,
                                toolUseID: Y,
                                hookEvent: "PreToolUse"
                            }
                        }
                    }
                };
            }

            // Prevent continuation
            if (j.preventContinuation) {
                yield {
                    type: "preventContinuation",
                    shouldPreventContinuation: j.preventContinuation
                };
            }

            // Stop reason
            if (j.stopReason) {
                yield {
                    type: "stopReason",
                    stopReason: j.stopReason
                };
            }

            // Immediate stop
            if (j.stop) {
                yield {
                    type: "stop"
                };
                return;
            }
        }
    } finally {
        // Track duration
        bw6()?.observe("pre_tool_hook_duration_ms", Date.now() - $);
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
            // Yield permission result if hook made decision
            if (hookResult.permissionBehavior !== undefined) {
                yield {
                    type: "hookPermissionResult",
                    hookPermissionResult: {
                        behavior: hookResult.permissionBehavior,
                        updatedInput: hookResult.updatedInput,
                        decisionReason: {
                            type: "hook",
                            hookName: `PreToolUse:${tool.name}`,
                            reason: hookResult.hookPermissionDecisionReason
                        }
                    }
                };
            }

            // Yield blocking error
            if (hookResult.blockingError) {
                yield {
                    type: "hookPermissionResult",
                    hookPermissionResult: {
                        behavior: "deny",
                        message: hookResult.blockingError
                    }
                };
            }

            // Yield updated input
            if (hookResult.updatedInput) {
                yield {
                    type: "hookUpdatedInput",
                    updatedInput: hookResult.updatedInput
                };
            }

            // Yield additional context as attachment
            if (hookResult.additionalContexts?.length > 0) {
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

            // Yield prevent continuation
            if (hookResult.preventContinuation) {
                yield {
                    type: "preventContinuation",
                    shouldPreventContinuation: hookResult.preventContinuation
                };
            }

            // Yield stop reason
            if (hookResult.stopReason) {
                yield {
                    type: "stopReason",
                    stopReason: hookResult.stopReason
                };
            }

            // Immediate stop
            if (hookResult.stop) {
                yield { type: "stop" };
                return;
            }
        }
    } finally {
        // Track duration for metrics
        getMetricsObserver()?.observe("pre_tool_hook_duration_ms", Date.now() - startTime);
    }
}

// Mapping: y4q→executePreToolHooks, A→toolUseContext, q→tool, K→input,
//          Y→toolUseId, z→messageId, _→requestId, w→mcpServerType,
//          O→mcpServerBaseUrl, LF8→executeHooksForTool
```

---

## 4. Tools ↔ Sandbox (18)

### Integration Points

| Integration Point | Description |
|-------------------|-------------|
| Path restrictions | Bash tool checks allowed paths |
| Command validation | `isCommandSandboxed` validates commands |
| Exclusion patterns | `isCommandInExcludedList` matches patterns |
| Network permission | `checkNetworkPermission` controls network access |

### Key Functions

```javascript
// Key sandbox integration functions
const sandboxFunctions = {
    generateSeatbeltProfile: 'xb3',   // macOS Seatbelt profile generation
    isCommandSandboxed: 'Ti',          // Check if command is sandboxed
    isCommandInExcludedList: 'yYz',    // Check exclusion patterns
    checkNetworkPermission: 'nZ7'      // Network permission check
};
```

### Bash Tool Security

```javascript
// In Bash tool execution
// Check if command requires sandbox
if (!dangerouslyDisableSandbox) {
    const sandboxProfile = generateSeatbeltProfile(allowedPaths);
    // Execute with sandbox restrictions
}
```

---

## 5. Tools ↔ Plan Mode (12)

### Integration Points

| Integration Point | Description |
|-------------------|-------------|
| Tool filtering | Only `isReadOnly()` tools allowed in plan mode |
| Write/Edit restriction | Only allowed to plan file path |
| ExitPlanMode | Only programmatic exit from plan mode |
| AskUserQuestion | Allowed for clarification |

### Tool Filtering Algorithm

```javascript
// ============================================
// filterToolsForPlanMode - Filter tools for plan mode
// Location: chunks.93.mjs (filterToolsByMode)
// ============================================

// READABLE (for understanding):
function filterToolsForPlanMode(tools, planFilePath) {
    return tools.filter(tool => {
        // Always allow read-only tools
        if (tool.isReadOnly?.()) return true;

        // Allow ExitPlanMode
        if (tool.name === "ExitPlanMode") return true;

        // Allow EnterPlanMode (for re-entry)
        if (tool.name === "EnterPlanMode") return true;

        // Allow AskUserQuestion
        if (tool.name === "AskUserQuestion") return true;

        // Allow Write/Edit only to plan file
        if (tool.name === "Write" || tool.name === "Edit") {
            // Path is checked at execution time against planFilePath
            return true;
        }

        // Block all other tools
        return false;
    });
}
```

---

## 6. Tools ↔ Task System (13)

### Integration Points

| Integration Point | Description |
|-------------------|-------------|
| Task tools | TaskCreate, TaskGet, TaskList, TaskUpdate |
| TodoWrite | Simple todo mode when structured tasks disabled |
| File locking | Task operations use proper locking |
| Permission checks | Tasks go through `canUseTool` |

### Task Tool Constants

```javascript
// Tool name constants
const TASK_TOOL_NAMES = {
    TaskCreate: 'TR',
    TaskUpdate: 'ck',
    TaskGet: 'lt',
    TaskList: 'it',
    TodoWrite: 'MB'
};
```

---

## UI Interaction

### Modal Priority System

```
Modal Priority (highest → lowest):
1. sandbox-permission
2. tool-permission
3. worker-sandbox-permission
4. elicitation (LOWEST)
```

### Tool Message Rendering

| Component | Purpose |
|-----------|---------|
| `renderToolUseMessage` | In-progress header with tool name and status |
| `renderToolResultMessage` | Result display with success/error status |
| `renderToolUseRejectedMessage` | Rejection preview with reason |
| `renderToolUseErrorMessage` | Error details with stack trace |

---

## Summary

The Tools module is the central hub for all action execution in Claude Code. It integrates deeply with:

1. **System Reminder (04)** - Progress updates, hook results, attachments
2. **MCP (06)** - Tool discovery, execution, session recovery
3. **Hooks (11)** - Pre/post execution interception
4. **Sandbox (18)** - Security validation for Bash commands
5. **Plan Mode (12)** - Tool filtering based on mode
6. **Task System (13)** - Task management tools

All integration points use the 8-stage execution pipeline (`fxY`) which provides consistent handling of schema validation, custom validation, pre-hooks, permissions, execution, post-hooks, error handling, and result formatting.