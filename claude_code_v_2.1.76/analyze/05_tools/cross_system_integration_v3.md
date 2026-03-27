# Cross-System Integration: Tools ↔ System Reminder (Claude Code 2.1.76)

> Complete analysis of the integration between the Tools module (05) and System Reminder module (04), including attachment generation, progress updates, and hook context flow.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)
> - [04_system_reminder/](../04_system_reminder/) - System Reminder module

Key functions in this document:
- `y4q` (executePreToolHooksIterator) - Hook execution with context generation - chunks.146.mjs:74
- `f4` (createHookMessage) - Hook message wrapper - chunks.146.mjs
- `normalizeAttachmentForAPI` (Ui8) - Attachment normalization - chunks.174.mjs:3

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│               TOOLS ↔ SYSTEM REMINDER INTEGRATION                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Tool Execution Pipeline (fxY)                                       │
│       │                                                               │
│       ├─→ Stage 3: Pre-tool Hooks (y4q)                              │
│       │     ├─→ Hook additionalContext → attachment                  │
│       │     ├─→ Hook blockingError → error attachment                │
│       │     └─→ Hook permissionBehavior → permission override        │
│       │                                                               │
│       ├─→ Stage 4: Permission Check                                  │
│       │     └─→ Permission decision → telemetry                      │
│       │                                                               │
│       ├─→ Stage 5: Tool Execution                                    │
│       │     ├─→ Progress callbacks → progress attachment             │
│       │     └─→ Task status changes → task_status attachment         │
│       │                                                               │
│       ├─→ Stage 6: Post-tool Hooks (k4q)                             │
│       │     └─→ Hook additionalContext → attachment                  │
│       │                                                               │
│       └─→ Result Assembly                                             │
│             └─→ normalizeAttachmentForAPI (Ui8)                      │
│                                                                       │
│  System Reminder Attachment Types (from Tools)                       │
│       │                                                               │
│       ├─→ hook_additional_context - Pre/Post hook context            │
│       ├─→ hook_blocking_error - Hook denial message                  │
│       ├─→ hook_error_during_execution - Hook exception               │
│       ├─→ hook_cancelled - Hook cancelled by user                    │
│       ├─→ progress - Tool execution progress                         │
│       └─→ task_status - Background task state changes                │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Attachment Types from Tool Execution

### 1. Hook Additional Context

**What it does:**
PreToolUse and PostToolUse hooks can inject additional context into the conversation via attachments. This context is shown to the LLM but not to the user.

**Why this approach:**
- Hooks can provide LLM-guidance without user visibility
- Enables CI/CD integration, security scanners, custom validation
- Maintains clean user experience while enriching LLM context

```javascript
// ============================================
// y4q - Hook additionalContext generation
// Location: chunks.146.mjs:147-158
// ============================================

// ORIGINAL (for source lookup):
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

// READABLE (for understanding):
if (hookResult.additionalContexts && hookResult.additionalContexts.length > 0) {
    yield {
        type: "additionalContext",
        message: {
            message: createHookMessage({
                type: "hook_additional_context",
                content: hookResult.additionalContexts,
                hookName: `PreToolUse:${tool.name}`,
                toolUseID: toolUseId,
                hookEvent: "PreToolUse"
            })
        }
    };
}

// Mapping: j→hookResult, q→tool, Y→toolUseId, f4→createHookMessage
```

### 2. Hook Blocking Error

**What it does:**
When a PreToolUse hook denies a tool use, it generates a blocking error attachment that explains the denial to the LLM.

```javascript
// ============================================
// Hook blocking error generation
// Location: chunks.146.mjs:85-98
// ============================================

// ORIGINAL (for source lookup):
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

// READABLE (for understanding):
if (hookResult.blockingError) {
    const errorMessage = formatHookError(`PreToolUse:${tool.name}`, hookResult.blockingError);

    yield {
        type: "hookPermissionResult",
        hookPermissionResult: {
            behavior: "deny",
            message: errorMessage,
            decisionReason: {
                type: "hook",
                hookName: `PreToolUse:${tool.name}`,
                reason: errorMessage
            }
        }
    };
}

// Mapping: j→hookResult, q→tool, J→errorMessage, yF8→formatHookError
```

### 3. Progress Attachments

**What it does:**
Long-running tools (Bash, Agent, etc.) can emit progress updates that become system reminders.

```javascript
// ============================================
// Progress attachment structure
// ============================================

// During tool execution
function reportProgress(progressMessage) {
    return {
        type: "progress",
        content: progressMessage,
        toolUseId: currentToolUseId,
        timestamp: Date.now()
    };
}

// Example progress messages:
// - Bash: "Running npm install..."
// - Agent: "Agent spawned for file analysis..."
// - WebFetch: "Fetching https://example.com..."
```

### 4. Task Status Attachments

**What it does:**
Background task state changes generate attachments that inform the LLM about task progress.

```javascript
// ============================================
// Task status attachment structure
// ============================================

// From task system integration
const taskStatusAttachment = {
    type: "task_status",
    taskId: "1",
    previousStatus: "pending",
    newStatus: "in_progress",
    owner: "agent-name",
    timestamp: Date.now()
};
```

---

## Hook Message Format

### Message Structure

```javascript
// ============================================
// f4 - createHookMessage
// Location: chunks.146.mjs (inferred)
// ============================================

function createHookMessage({
    type,
    content,
    hookName,
    toolUseID,
    hookEvent
}) {
    return {
        role: "user",
        content: [{
            type: "tool_result",
            content: formatHookContent(type, content, hookName),
            tool_use_id: toolUseID,
            is_error: type.includes("error") || type.includes("blocking")
        }],
        // Metadata for system reminder processing
        _metadata: {
            attachmentType: type,
            hookName: hookName,
            hookEvent: hookEvent,
            timestamp: Date.now()
        }
    };
}
```

### Hook Event Types

| Event | Type | Description |
|-------|------|-------------|
| `PreToolUse` | Before tool execution | Can modify input, deny, or add context |
| `PostToolUse` | After successful execution | Can modify output or add context |
| `PostToolUseFailure` | After failed execution | Error handling and recovery |

---

## Attachment Normalization

### normalizeAttachmentForAPI (Ui8)

**What it does:**
Converts internal attachment formats to the structure expected by the Claude API.

```javascript
// ============================================
// Ui8 - normalizeAttachmentForAPI
// Location: chunks.174.mjs:3
// ============================================

// ORIGINAL (for source lookup):
function Ui8(A) {
    if (A.type === "image" && A.source?.type === "base64") {
        return {
            type: "image",
            source: {
                type: "base64",
                media_type: A.source.media_type,
                data: A.source.data
            }
        };
    }
    if (A.type === "tool_result") {
        return {
            type: "tool_result",
            tool_use_id: A.tool_use_id,
            content: A.content,
            is_error: A.is_error
        };
    }
    // ... other type normalizations
    return A;
}

// READABLE (for understanding):
function normalizeAttachmentForAPI(attachment) {
    // Handle image attachments
    if (attachment.type === "image" && attachment.source?.type === "base64") {
        return {
            type: "image",
            source: {
                type: "base64",
                media_type: attachment.source.media_type,
                data: attachment.source.data
            }
        };
    }

    // Handle tool results
    if (attachment.type === "tool_result") {
        return {
            type: "tool_result",
            tool_use_id: attachment.tool_use_id,
            content: attachment.content,
            is_error: attachment.is_error
        };
    }

    // Pass through other types unchanged
    return attachment;
}

// Mapping: Ui8→normalizeAttachmentForAPI, A→attachment
```

---

## Pre-Tool Hook Execution Flow

### Complete Hook Iterator

```javascript
// ============================================
// y4q - executePreToolHooksIterator
// Location: chunks.146.mjs:74-199
// ============================================

async function* executePreToolHooksIterator(
    toolUseContext,
    tool,
    input,
    toolUseId,
    messageId,
    requestId,
    mcpServerType,
    mcpServerBaseUrl
) {
    const startTime = Date.now();

    try {
        const appState = toolUseContext.getAppState();

        // Iterate through all PreToolUse hooks for this tool
        for await (const hookResult of runPreToolUseHooks(
            tool.name,
            toolUseId,
            input,
            toolUseContext,
            appState.toolPermissionContext.mode,
            toolUseContext.abortController.signal,
            undefined,  // hookId
            toolUseContext.requestPrompt,
            tool.getToolUseSummary?.(toolUseId)
        )) {
            try {
                // 1. Yield message if hook produced one
                if (hookResult.message) {
                    yield {
                        type: "message",
                        message: { message: hookResult.message }
                    };
                }

                // 2. Handle blocking error (hook denial)
                if (hookResult.blockingError) {
                    const errorMessage = formatHookError(
                        `PreToolUse:${tool.name}`,
                        hookResult.blockingError
                    );
                    yield {
                        type: "hookPermissionResult",
                        hookPermissionResult: {
                            behavior: "deny",
                            message: errorMessage,
                            decisionReason: {
                                type: "hook",
                                hookName: `PreToolUse:${tool.name}`,
                                reason: errorMessage
                            }
                        }
                    };
                }

                // 3. Handle prevent continuation (stop tool use)
                if (hookResult.preventContinuation) {
                    yield { type: "preventContinuation", shouldPreventContinuation: true };
                    if (hookResult.stopReason) {
                        yield { type: "stopReason", stopReason: hookResult.stopReason };
                    }
                }

                // 4. Handle permission behavior override
                if (hookResult.permissionBehavior !== undefined) {
                    log(`Hook result has permissionBehavior=${hookResult.permissionBehavior}`);

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
                                decisionReason: decisionReason
                            }
                        };
                    } else if (hookResult.permissionBehavior === "ask") {
                        yield {
                            type: "hookPermissionResult",
                            hookPermissionResult: {
                                behavior: "ask",
                                updatedInput: hookResult.updatedInput,
                                message: hookResult.hookPermissionDecisionReason ||
                                    `Hook PreToolUse:${tool.name} asked for user input`,
                                decisionReason: decisionReason
                            }
                        };
                    } else {
                        yield {
                            type: "hookPermissionResult",
                            hookPermissionResult: {
                                behavior: hookResult.permissionBehavior,
                                message: hookResult.hookPermissionDecisionReason ||
                                    `Hook PreToolUse:${tool.name} ${formatBehavior(hookResult.permissionBehavior)} this tool`,
                                decisionReason: decisionReason
                            }
                        };
                    }
                }

                // 5. Handle updated input (without permission behavior)
                if (hookResult.updatedInput && hookResult.permissionBehavior === undefined) {
                    yield {
                        type: "hookUpdatedInput",
                        updatedInput: hookResult.updatedInput
                    };
                }

                // 6. Handle additional context (becomes system reminder)
                if (hookResult.additionalContexts && hookResult.additionalContexts.length > 0) {
                    yield {
                        type: "additionalContext",
                        message: {
                            message: createHookMessage({
                                type: "hook_additional_context",
                                content: hookResult.additionalContexts,
                                hookName: `PreToolUse:${tool.name}`,
                                toolUseID: toolUseId,
                                hookEvent: "PreToolUse"
                            })
                        }
                    };
                }

                // 7. Handle abort
                if (toolUseContext.abortController.signal.aborted) {
                    emitTelemetry("tengu_pre_tool_hooks_cancelled", {
                        toolName: sanitizeToolName(tool.name),
                        queryChainId: toolUseContext.queryTracking?.chainId,
                        queryDepth: toolUseContext.queryTracking?.depth
                    });

                    yield {
                        type: "message",
                        message: {
                            message: createHookMessage({
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

            } catch (innerError) {
                reportError(innerError);
                // Continue processing other hooks despite error
            }
        }

    } catch (error) {
        reportError(error);

        const duration = Date.now() - startTime;
        emitTelemetry("tengu_pre_tool_hook_error", {
            messageID: messageId,
            toolName: sanitizeToolName(tool.name),
            isMcp: tool.isMcp ?? false,
            duration: duration,
            queryChainId: toolUseContext.queryTracking?.chainId,
            queryDepth: toolUseContext.queryTracking?.depth,
            ...mcpServerType && { mcpServerType },
            ...requestId && { requestId }
        });

        yield {
            type: "message",
            message: {
                message: createHookMessage({
                    type: "hook_error_during_execution",
                    content: formatError(error),
                    hookName: `PreToolUse:${tool.name}`,
                    toolUseID: toolUseId,
                    hookEvent: "PreToolUse"
                })
            }
        };
    }
}

// Mapping: y4q→executePreToolHooksIterator, A→toolUseContext, q→tool, K→input,
//          Y→toolUseId, z→messageId, _→requestId, w→mcpServerType, O→mcpServerBaseUrl
```

---

## Post-Tool Hook Execution

### PostToolUse Integration

```javascript
// ============================================
// k4q - executePostToolHooksIterator
// Location: chunks.145.mjs:3107
// ============================================

async function* executePostToolHooksIterator(
    toolUseContext,
    tool,
    input,
    messageId,
    output,
    toolUseId,
    requestId,
    mcpServerType,
    mcpServerBaseUrl
) {
    // Similar structure to PreToolUse but with output parameter
    // Yields:
    // - additionalContext from hooks
    // - updatedMCPToolOutput for MCP tools
    // - modified tool results

    for await (const hookResult of runPostToolUseHooks(
        tool.name,
        toolUseId,
        input,
        output,
        toolUseContext
    )) {
        // Handle additional context
        if (hookResult.additionalContexts?.length > 0) {
            yield {
                type: "additionalContext",
                message: {
                    message: createHookMessage({
                        type: "hook_additional_context",
                        content: hookResult.additionalContexts,
                        hookName: `PostToolUse:${tool.name}`,
                        toolUseID: toolUseId,
                        hookEvent: "PostToolUse"
                    })
                }
            };
        }

        // Handle MCP tool output modification
        if ("updatedMCPToolOutput" in hookResult) {
            yield {
                updatedMCPToolOutput: hookResult.updatedMCPToolOutput
            };
        }
    }
}
```

---

## Integration with System Reminder Types

### Reminder Type Mapping

| Attachment Type | System Reminder Category | Purpose |
|-----------------|--------------------------|---------|
| `hook_additional_context` | Context | Hook-provided context for LLM |
| `hook_blocking_error` | Error | Hook denial reason |
| `hook_error_during_execution` | Error | Hook execution failure |
| `hook_cancelled` | Status | User cancelled hook |
| `progress` | Status | Tool execution progress |
| `task_status` | Task | Background task updates |

### Attachment to System Reminder Conversion

```javascript
// ============================================
// wrapWithSystemReminderTags (b5)
// Location: chunks.173.mjs:2496
// ============================================

function wrapWithSystemReminderTags(content) {
    return `<system-reminder>
${content}
</system-reminder>`;
}

// When hook additionalContext is processed:
// 1. Content is formatted
// 2. Wrapped in system-reminder tags
// 3. Injected into the conversation for LLM
```

---

## Cross-Module Data Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    DATA FLOW DIAGRAM                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Tool Execution                                                   │
│       │                                                            │
│       ▼                                                            │
│  PreToolUse Hook ────► additionalContext ────► System Reminder   │
│       │                                            │               │
│       ▼                                            ▼               │
│  Permission Check ◄────────────────────── LLM Context             │
│       │                                                            │
│       ▼                                                            │
│  Tool.call() ──────────► progress ──────────► System Reminder     │
│       │                                            │               │
│       ▼                                            ▼               │
│  PostToolUse Hook ────► additionalContext ───► System Reminder    │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

---

## Key Insights

### Design Decisions

1. **Hook Priority**: Pre-tool hooks run before permission checks, allowing them to modify input or deny before user interaction

2. **Context Isolation**: Hook additional context is only visible to LLM, not users, maintaining clean UX

3. **Error Resilience**: Hook errors don't crash tool execution; they're reported as error attachments

4. **Abort Handling**: Hooks respect abort signals, cleaning up properly on cancellation

5. **MCP Integration**: Post-tool hooks can modify MCP tool output for external tools

### Performance Considerations

- Hooks run sequentially, not in parallel
- Additional context is lazy-evaluated
- Progress updates are throttled
- Attachment normalization happens once per message

---

## Quick Reference

### Attachment Types

| Type | Source | Visibility |
|------|--------|------------|
| `hook_additional_context` | Pre/Post hooks | LLM only |
| `hook_blocking_error` | Pre hook denial | LLM only |
| `hook_error_during_execution` | Hook exception | LLM only |
| `hook_cancelled` | User abort | LLM only |
| `progress` | Tool execution | User + LLM |
| `task_status` | Task system | User + LLM |

### Key Functions

| Obfuscated | Readable | Purpose |
|------------|----------|---------|
| y4q | executePreToolHooksIterator | Pre-tool hook execution |
| k4q | executePostToolHooksIterator | Post-tool hook execution |
| f4 | createHookMessage | Hook message wrapper |
| Ui8 | normalizeAttachmentForAPI | API format conversion |
| b5 | wrapWithSystemReminderTags | System reminder wrapper |

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Enhanced hook context flow, MCP output modification |
| 2.1.72 | Permission behavior from hooks |
| 2.1.32 | Additional context for hooks |
| 2.1.18 | Initial hook-to-reminder integration |