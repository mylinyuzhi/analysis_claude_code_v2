# Hooks Integration - Subagent Hook Execution (Claude Code 2.1.38)

> Deep analysis of how hooks are executed within subagent context

---

## Table of Contents

1. [Overview](#overview)
2. [SubagentStart Hook](#subagentstart-hook)
3. [Hook Cleanup in Subagent Context](#hook-cleanup-in-subagent-context)
4. [Pre/Post Tool Hooks Within Subagent](#prepost-tool-hooks-within-subagent)
5. [Hook Context Isolation](#hook-context-isolation)
6. [Cross-References](#cross-references)

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Hooks section)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `executeHooks` (NI) - Main hook execution generator
- `executeHookCleanup` - Cleanup function for hook resources
- `resolveHooksForEvent` (oRA) - Resolves which hooks to run for an event
- `runWithAgentIdentity` (p01) - AsyncLocalStorage context binding for hooks
- `SubagentStart` - Hook event type for subagent initialization

---

## 1. Overview

Hooks in Claude Code are event-driven extension points that allow user-defined scripts to run at specific lifecycle moments. When subagents are involved, the hook system must handle:

1. **SubagentStart** - Hooks that fire when a subagent begins execution
2. **Hook cleanup** - Proper resource cleanup when subagent exits
3. **Tool hooks** - PreTool and PostTool hooks within the subagent's execution
4. **Context isolation** - Ensuring hooks run in the correct agent context

---

## 2. SubagentStart Hook

### When It Fires

The `SubagentStart` hook event fires at the beginning of subagent execution, after:
1. Agent definition is resolved
2. Permission mode is configured
3. Tool set is assembled
4. System prompt is built
...but before:
5. The first LLM call is made

### Execution Location

```javascript
// ============================================
// SubagentStart hook execution in agentLoopRunner
// Location: chunks.130.mjs:2056-2062
// ============================================

// ORIGINAL (for source lookup):
// Within agentLoopRunner initialization phase:

// READABLE (for understanding):
async function* agentLoopRunner(config) {
    // ... initialization phases 1-7 ...

    // Phase 8: Hook Execution - SubagentStart
    if (agentDefinition.hooks) {
        await executeHooks(
            toolUseContext.setAppState,
            agentId,
            agentDefinition.hooks,
            "SubagentStart",
            true  // wait for completion
        );
    }

    // ... phases 9-11, main execution loop ...
}
```

### What Context is Available

At the time `SubagentStart` fires, the hook receives:

```javascript
// Hook input context for SubagentStart
{
    agentId: "generated-agent-id",
    agentType: "code",  // or "research", etc.
    prompt: "The task prompt given to the subagent",
    permissionMode: "acceptEdits",
    model: "claude-sonnet-4-6",
    parentSessionId: "parent-session-id",
    // From toolUseContext:
    tools: [...],  // Available tools for this subagent
    messages: [...],  // Initial messages (including fork context if applicable)
    // Custom hook input if provided
}
```

### Hook Types Available for SubagentStart

| Hook Type | Behavior | Use Case |
|-----------|----------|----------|
| `command` | Execute shell script | Logging, setup scripts |
| `prompt` | Send LLM prompt | Dynamic context injection |
| `agent` | Run sub-agent | Verification, preprocessing |
| `callback` | In-process callback | Plugin integration |

### Example: Command Hook for SubagentStart

```yaml
# In .claude/settings.json
hooks:
  SubagentStart:
    - type: command
      command: "echo 'Subagent {{agentType}} started with ID {{agentId}}' >> /tmp/agent_log.txt"
```

### Example: Prompt Hook for SubagentStart

```yaml
hooks:
  SubagentStart:
    - type: prompt
      prompt: |
        A {{agentType}} agent is starting with this task:
        {{prompt}}

        Provide any additional context or guidance for this task.
```

---

## 3. Hook Cleanup in Subagent Context

### When Cleanup Executes

Hook cleanup runs when the subagent exits, regardless of success or failure:

```javascript
// ============================================
// Hook cleanup in agentLoopRunner finally block
// Location: chunks.130.mjs:2120-2130
// ============================================

// ORIGINAL (for source lookup):
} finally {
    await cleanup();
    if (agentDefinition.hooks) {
        executeHookCleanup(toolUseContext.setAppState, agentId);
    }
}

// READABLE (for understanding):
} finally {
    // MCP client cleanup
    await mcpCleanup();

    // Hook cleanup (if agent had hooks)
    if (agentDefinition.hooks) {
        executeHookCleanup(toolUseContext.setAppState, agentId);
    }
}
```

### What Cleanup Does

The `executeHookCleanup` function:

1. **Removes registered cleanup handlers** - Any cleanup callbacks registered during hook execution
2. **Releases resources** - File handles, network connections created by hooks
3. **Clears hook state** - Removes per-hook tracking data
4. **Logs completion** - Telemetry for hook lifecycle

### Resource Cleanup Patterns

```javascript
// ============================================
// Hook cleanup registration during execution
// ============================================

// Hooks can register cleanup callbacks:
function registerCleanup(agentId, callback) {
    hookCleanupRegistry.get(agentId)?.push(callback);
}

// During cleanup:
function executeHookCleanup(setAppState, agentId) {
    let cleanups = hookCleanupRegistry.get(agentId) || [];
    for (let cleanup of cleanups) {
        try {
            cleanup();
        } catch (err) {
            logError(err);
        }
    }
    hookCleanupRegistry.delete(agentId);
}
```

### Cleanup Guarantees

The `finally` block ensures cleanup runs even when:
- Subagent completes successfully
- Subagent encounters an error
- Subagent is aborted via AbortController
- Parent process signals shutdown

---

## 4. Pre/Post Tool Hooks Within Subagent

### Tool Hook Flow in Subagent

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Subagent Execution                               │
│                                                                      │
│  for await (message of agentLoopRunner()) {                         │
│      ↓                                                               │
│  LLM returns tool_use block                                          │
│      ↓                                                               │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ PreTool Hook Execution                                          ││
│  │   - Input: { tool: "Read", input: { path: "..." } }            ││
│  │   - Can: block, modify input, inject context                    ││
│  └─────────────────────────────────────────────────────────────────┘│
│      ↓                                                               │
│  Tool Execution                                                      │
│      ↓                                                               │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ PostTool Hook Execution                                         ││
│  │   - Input: { tool: "Read", result: "file contents..." }        ││
│  │   - Can: modify result, inject follow-up context               ││
│  └─────────────────────────────────────────────────────────────────┘│
│      ↓                                                               │
│  Result returned to LLM                                              │
│  }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

### PreTool Hook Execution

```javascript
// ============================================
// PreTool hook execution in tool pipeline
// Location: chunks.149.mjs:161-200
// ============================================

// ORIGINAL (for source lookup):
async function* B1q(A, q, K, Y, z) {
    // ... hook execution logic
}

// READABLE (for understanding):
async function* executePreToolHooksIterator(toolName, toolInput, toolUseContext, assistantMessage, toolUseId) {
    // 1. Resolve hooks for PreTool event
    let hooks = resolveHooksForEvent("PreTool", toolUseContext);

    // 2. Execute each matching hook
    for (let hook of hooks) {
        let result = await executeHook(hook, {
            tool: toolName,
            input: toolInput,
            agentId: toolUseContext.agentId
        });

        // 3. Process hook result
        if (result.block) {
            // Block the tool call
            yield { type: "blocked", reason: result.reason };
            return;
        }
        if (result.modifiedInput) {
            // Use modified input
            toolInput = result.modifiedInput;
        }
        if (result.context) {
            // Inject context for LLM
            yield { type: "context", content: result.context };
        }
    }

    // 4. Allow tool execution to proceed
    yield { type: "proceed", input: toolInput };
}

// Mapping: B1q->executePreToolHooksIterator
```

### PostTool Hook Execution

```javascript
// ============================================
// PostTool hook execution in tool pipeline
// Location: chunks.149.mjs:3-90
// ============================================

// ORIGINAL (for source lookup):
async function* b1q(A, q, K, Y, z, w) {
    // ... hook execution logic
}

// READABLE (for understanding):
async function* executePostToolHooksIterator(toolName, toolInput, toolResult, toolUseContext, assistantMessage, toolUseId) {
    // 1. Resolve hooks for PostTool event
    let hooks = resolveHooksForEvent("PostTool", toolUseContext);

    // 2. Execute each matching hook
    for (let hook of hooks) {
        let result = await executeHook(hook, {
            tool: toolName,
            input: toolInput,
            result: toolResult,
            agentId: toolUseContext.agentId
        });

        // 3. Process hook result
        if (result.modifiedResult) {
            toolResult = result.modifiedResult;
        }
        if (result.context) {
            yield { type: "context", content: result.context };
        }
    }

    // 4. Return (possibly modified) result
    yield { type: "result", result: toolResult };
}

// Mapping: b1q->executePostToolHooksIterator
```

### Hook Execution Within AsyncLocalStorage

Tool hooks within a subagent run within the subagent's agent identity context:

```javascript
// ============================================
// Tool hook execution with agent identity
// Location: chunks.130.mjs (agentLoopRunner context)
// ============================================

// Hooks execute within the AsyncLocalStorage context set by:
await runWithAgentIdentity(
    {
        agentId: "subagent-123",
        parentSessionId: "session-456",
        agentType: "code",
        subagentName: "Code Agent",
        isBuiltIn: true
    },
    async () => {
        // Tool hooks here can access this identity via:
        let identity = getCurrentAgentIdentity();
        // identity.agentId === "subagent-123"
    }
);
```

---

## 5. Hook Context Isolation

### Isolation Between Parent and Subagent

Hooks maintain isolation between parent and subagent contexts:

| Aspect | Parent Session | Subagent |
|--------|---------------|----------|
| Hook registry | Full access | Full access (shared) |
| Hook execution context | Parent's identity | Subagent's identity |
| Cleanup handlers | Tracked separately per agentId | Tracked separately per agentId |
| Hook state | Independent | Independent |
| Hook output | Goes to parent's UI | Routed through subagent's yield |

### AsyncLocalStorage Propagation

```javascript
// ============================================
// Agent identity propagation through hooks
// ============================================

// When a hook executes in a subagent:
// 1. The agent identity is set via AsyncLocalStorage
// 2. Hook code can access identity via getCurrentAgentIdentity()
// 3. This works for all hook types: command, prompt, agent, callback

// Example hook using agent identity:
// .claude/settings.json
{
    "hooks": {
        "PreTool": [{
            "type": "callback",
            "callback": async (context) => {
                const identity = getCurrentAgentIdentity();
                console.log(`Hook running in agent: ${identity.agentId}`);
                console.log(`Agent type: ${identity.agentType}`);
                // Only block tools in certain agent types
                if (identity.agentType === "research" && context.tool === "Edit") {
                    return { block: true, reason: "Research agents should not edit files" };
                }
                return {};
            }
        }]
    }
}
```

### Concurrent Subagent Hook Handling

When multiple subagents run concurrently, hook execution is properly isolated:

```
Parent Session
├── Subagent A (agentId: "agent-a")
│   ├── PreTool hook → runs with identity "agent-a"
│   ├── Tool execution
│   └── PostTool hook → runs with identity "agent-a"
│
└── Subagent B (agentId: "agent-b")
    ├── PreTool hook → runs with identity "agent-b"
    ├── Tool execution
    └── PostTool hook → runs with identity "agent-b"
```

Each hook execution sees only its own agent's context, preventing cross-contamination.

### Hook Configuration Sources

Hooks can be defined at multiple levels, and subagents inherit appropriately:

| Source | Priority | Availability to Subagent |
|--------|----------|--------------------------|
| Policy hooks | Highest | Yes, always applied |
| Plugin hooks | High | Yes, if plugin is loaded |
| User settings | Medium | Yes, inherited from session |
| Project settings | Medium | Yes, inherited from session |
| Agent definition hooks | Low | Only for that specific agent type |

---

## 6. Cross-References

### Related Documentation

- **[../11_hooks/implementation.md](../11_hooks/implementation.md)** - Complete hook system implementation
- **[../11_hooks/hook_events_catalog.md](../11_hooks/hook_events_catalog.md)** - All available hook events
- **[execution_flow_deep_dive.md](./execution_flow_deep_dive.md)** - Agent loop execution including hooks
- **[agent_tool.md](./agent_tool.md)** - How AgentTool spawns subagents with hook configuration

### Hook Events Relevant to Subagents

| Event | When | Available in Subagent |
|-------|------|----------------------|
| `SubagentStart` | Subagent begins | Yes (triggered by subagent) |
| `SubagentStop` | Subagent ends | Yes (triggered by subagent) |
| `PreTool` | Before tool execution | Yes |
| `PostTool` | After tool execution | Yes |
| `PrePrompt` | Before LLM call | Yes |
| `PostPrompt` | After LLM response | Yes |
| `Notification` | User notification | Yes |
| `PreCompact` | Before compaction | Yes |
| `PostCompact` | After compaction | Yes |

---

## Summary

The hook integration with subagents follows a carefully designed isolation model:

1. **SubagentStart hook** - Fires at subagent initialization with full context
2. **Hook cleanup** - Guaranteed execution via `finally` block regardless of outcome
3. **Tool hooks** - PreTool and PostTool execute within subagent's identity context
4. **Context isolation** - AsyncLocalStorage ensures hooks see correct agent identity
5. **Concurrent safety** - Multiple subagents can run hooks simultaneously without interference

This design enables powerful extension capabilities while maintaining proper isolation between parent and subagent execution contexts.