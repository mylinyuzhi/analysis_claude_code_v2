# System Reminder Integration - Subagent Context Propagation (Claude Code 2.1.38)

> Deep analysis of how system reminders are propagated to subagents and how progress is reported back to parents

---

## Table of Contents

1. [Overview](#overview)
2. [System Reminder Propagation](#system-reminder-propagation)
3. [Fork Context Integration](#fork-context-integration)
4. [Progress Reporting](#progress-reporting)
5. [Integration Points](#integration-points)

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (System Reminder section)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `buildForkContextMessages` (Nn7) - Builds prompt messages with parent context when forkContext is true
- `reportToolProgress` (RjA) - Updates task progress while preserving summary
- `updateTaskProgress` (Yd7) - Updates task progress with new summary text
- `updateTaskInState` (c5) - Generic task state updater
- `agent_progress` (event type) - Progress event broadcast to parent agent

---

## 1. Overview

System reminders are the mechanism by which Claude Code provides dynamic context to the LLM during a session - information about the current state, available tools, recent changes, etc. When subagents are spawned, two key questions arise:

1. **Downward propagation:** How does the parent's context reach the subagent?
2. **Upward reporting:** How does the subagent's progress reach the parent?

This document explains both directions of the system reminder integration.

---

## 2. System Reminder Propagation

### How Parent Context Reaches Subagent

System reminders are **NOT directly propagated** to subagents in their raw form. Instead, the subagent receives:

1. **A fresh system prompt** built from the agent definition
2. **Fork context messages** (if `forkContext: true` in agent definition)
3. **An initial user message** containing the prompt

### Why System Reminders Are Not Shared

**Design rationale:**
- System reminders are specific to the parent's context (files read, recent tool results, etc.)
- They would be misleading in the subagent's context (subagent hasn't read those files)
- The subagent builds its own reminders as it executes tools

### What IS Propagated

| Context Type | Propagation Method | Notes |
|--------------|-------------------|-------|
| Conversation history | `forkContextMessages` | Only if `forkContext: true` in agent definition |
| Permission context | `toolPermissionContext` | Derived with possible mode override |
| Agent definitions | `options.agentDefinitions` | Shared reference to global registry |
| MCP resources | `options.mcpResources` | Shared reference |
| File read state | Cloned Map | Independent tracking per agent |
| Auto memory | Memory directory path | Shared memory if configured |

### System Prompt Construction

```javascript
// ============================================
// Subagent system prompt construction
// Location: chunks.130.mjs:2040-2055
// ============================================

// The subagent receives a new system prompt built from:
// 1. Base system prompt (from agent definition or default)
// 2. Agent-specific instructions (agentDefinition.instructions)
// 3. Subagent-specific notes (NQ1 - buildSubagentSystemPrompt)

// ORIGINAL (for source lookup):
let J = NQ1(A, K, G, {
    append: A.systemPrompt?.append,
    replace: A.systemPrompt?.replace
});

// READABLE (for understanding):
let systemPrompt = buildSubagentSystemPrompt(agentDefinition, toolUseContext, resolvedModel, {
    append: agentDefinition.systemPrompt?.append,
    replace: agentDefinition.systemPrompt?.replace
});

// Mapping: J->systemPrompt, NQ1->buildSubagentSystemPrompt, A->agentDefinition,
//          K->toolUseContext, G->resolvedModel
```

---

## 3. Fork Context Integration

### When Fork Context Activates

Fork context is an opt-in feature defined per agent type:

```javascript
// In agent definition:
{
    agentType: "research",
    forkContext: true,  // <- This enables fork context
    // ... other properties
}
```

### `buildForkContextMessages` (Nn7)

**What it does:** Given the parent's conversation history and the subagent's prompt, constructs a set of messages that give the subagent context continuity.

**How it works:**

```javascript
// ============================================
// buildForkContextMessages - Attach parent context to subagent prompt
// Location: chunks.90.mjs:2529-2537
// ============================================

// ORIGINAL (for source lookup):
function Nn7(A, q) {
    let K = c6({ content: A }),
        Y = q.message.content.find((O) => {
            if (O.type !== "tool_use" || O.name !== fK) return !1;
            let _ = O.input;
            return "prompt" in _ && _.prompt === A
        });
    // ... builds context-aware messages
}

// READABLE (for understanding):
function buildForkContextMessages(prompt, parentAssistantMessage) {
    // Create user message from the prompt
    let userMessage = createUserMessage({ content: prompt });

    // Find the tool_use block that triggered this subagent
    let matchingToolUse = parentAssistantMessage.message.content.find((block) => {
        if (block.type !== "tool_use" || block.name !== "Task") return false;
        let input = block.input;
        return "prompt" in input && input.prompt === prompt;
    });

    // ... construct message sequence for continuity
}

// Mapping: Nn7->buildForkContextMessages, A->prompt, q->parentAssistantMessage,
//          K->userMessage, c6->createUserMessage, Y->matchingToolUse,
//          fK->TOOL_NAME_AGENT ("Task")
```

### Message Sequence Construction

When fork context is enabled, the subagent's initial messages look like:

```
[
    // Parent's conversation history (selected parts)
    { role: "user", content: "..." },
    { role: "assistant", content: "..." },
    // ...

    // The triggering assistant message
    { role: "assistant", content: [{ type: "tool_use", name: "Task", input: { prompt: "..." } }] },

    // The tool result (simulated, containing the actual prompt)
    { role: "user", content: [{ type: "tool_result", tool_use_id: "...", content: "Fork context..." }] },

    // The subagent's actual user message
    { role: "user", content: "Analyze the codebase..." }
]
```

### Benefits of Fork Context

| With Fork Context | Without Fork Context |
|-------------------|---------------------|
| Subagent sees parent conversation | Subagent starts fresh |
| Can reference earlier decisions | No context from parent |
| Higher token cost | Lower token cost |
| Better for analysis/research agents | Better for isolated tasks |

### Cost Trade-off

**Token impact:**
- Fork context includes the entire parent message history
- This can add 10,000+ tokens to the subagent's context
- Only enable for agent types that truly need the context

---

## 4. Progress Reporting

### Two-Way Progress Communication

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Parent Agent                                  │
│                                                                      │
│  AgentTool.call() ─────────────────────────────────────────────────┐│
│       ↓                                                             ││
│  spawnSubagent() ──────────────────────────────────────────────────┤│
│       ↓                                                             ││
│  for await (message of agentLoopRunner()) {                        ││
│       ↓                                                             ││
│       ┌─────────────────────────────────────────────────────────────┤│
│       │ Subagent Execution                                          ││
│       │                                                              ││
│       │  Tool execution → RjA() ──→ Update task state               ││
│       │       ↓                                                      ││
│       │  State change → agent_progress event ──→ Parent receives    ││
│       │       ↓                                                      ││
│       │  UI displays progress                                        ││
│       └─────────────────────────────────────────────────────────────┘│
│  }                                                                   │
│       ↓                                                              │
│  buildAgentResult() ──→ Final result                                 │
└─────────────────────────────────────────────────────────────────────┘
```

### `reportToolProgress` (RjA)

**What it does:** Updates task progress metrics (tool use count, token count) while preserving the existing summary text.

**How it works:**

```javascript
// ============================================
// reportToolProgress - Update tool progress metrics
// Location: chunks.89.mjs:1393-1405
// ============================================

// ORIGINAL (for source lookup):
function RjA(A, q, K) {
    c5(A, K, (Y) => {
        if (Y.status !== "running") return Y;
        let z = Y.progress?.summary;
        return {
            ...Y,
            progress: z ? {
                ...q,
                summary: z
            } : q
        }
    })
}

// READABLE (for understanding):
function reportToolProgress(agentId, progressObject, setAppState) {
    updateTaskInState(agentId, setAppState, (task) => {
        if (task.status !== "running") return task;

        // Preserve existing summary if present
        let existingSummary = task.progress?.summary;
        return {
            ...task,
            progress: existingSummary
                ? {
                    ...progressObject,
                    summary: existingSummary  // PRESERVE
                }
                : progressObject
        };
    });
}

// Mapping: RjA->reportToolProgress, A->agentId, q->progressObject, K->setAppState,
//          c5->updateTaskInState, Y->task, z->existingSummary
```

**Why this approach:**
- Summary text is human-readable ("Reading config files...")
- Metrics are machine-trackable (toolUseCount, tokenCount)
- Calling `reportToolProgress` after each tool execution shouldn't wipe the summary
- The function preserves summary while updating metrics

### `updateTaskProgress` (Yd7)

**What it does:** Replaces summary text while preserving existing metrics.

**How it works:**

```javascript
// ============================================
// updateTaskProgress - Update task state with summary text
// Location: chunks.89.mjs:1407-1420
// ============================================

// ORIGINAL (for source lookup):
function Yd7(A, q, K) {
    c5(A, K, (Y) => {
        if (Y.status !== "running") return Y;
        return {
            ...Y,
            progress: {
                ...Y.progress,
                toolUseCount: Y.progress?.toolUseCount ?? 0,
                tokenCount: Y.progress?.tokenCount ?? 0,
                summary: q
            }
        }
    })
}

// READABLE (for understanding):
function updateTaskProgress(agentId, summaryText, setAppState) {
    updateTaskInState(agentId, setAppState, (task) => {
        if (task.status !== "running") return task;

        return {
            ...task,
            progress: {
                ...task.progress,
                toolUseCount: task.progress?.toolUseCount ?? 0,
                tokenCount: task.progress?.tokenCount ?? 0,
                summary: summaryText  // REPLACE
            }
        };
    });
}

// Mapping: Yd7->updateTaskProgress, A->agentId, q->summaryText, K->setAppState,
//          c5->updateTaskInState, Y->task
```

### When to Use Each Function

| Function | Use Case | Frequency | Effect |
|----------|----------|-----------|--------|
| `reportToolProgress` | After each tool execution | 10-20x per agent run | Preserves summary, updates metrics |
| `updateTaskProgress` | At milestones | 2-5x per agent run | Replaces summary, preserves metrics |

### Progress Reporting Sequence

```
Agent Loop Start
    ↓
updateTaskProgress("Starting analysis...")
    ↓
Tool 1: Read file
    ↓
reportToolProgress({ toolUseCount: 1, tokenCount: 500 })
    ↓
Tool 2: Grep search
    ↓
reportToolProgress({ toolUseCount: 2, tokenCount: 1200 })
    ↓
Milestone: Switching to code analysis
    ↓
updateTaskProgress("Analyzing code patterns...")
    ↓
Tool 3: Read another file
    ↓
reportToolProgress({ toolUseCount: 3, tokenCount: 2000 })
    ↓
Agent Loop End
    ↓
completeTask()
```

### `agent_progress` Event

**What it is:** An event type that propagates progress from subagent to parent.

The `agent_progress` event is yielded from `agentLoopRunner` and contains:

```typescript
interface AgentProgressEvent {
    type: "agent_progress";
    agentId: string;
    progress: {
        summary: string;
        toolUseCount: number;
        tokenCount: number;
    };
    timestamp: number;
}
```

**How it flows:**

1. Subagent executes a tool
2. Tool completion triggers `reportToolProgress`
3. State update triggers state change detection
4. Agent loop yields `agent_progress` event
5. Parent's `for await` loop receives the event
6. Parent's UI updates to show subagent progress

---

## 5. Integration Points

### State Management Integration

```javascript
// ============================================
// updateTaskInState - Generic task state updater
// Location: chunks.142.mjs:1662-1675
// ============================================

// ORIGINAL (for source lookup):
function c5(A, q, K) {
    q((Y) => ({
        ...Y,
        tasks: {
            ...Y.tasks,
            [A]: K(Y.tasks[A])
        }
    }))
}

// READABLE (for understanding):
function updateTaskInState(agentId, setAppState, updater) {
    setAppState((state) => ({
        ...state,
        tasks: {
            ...state.tasks,
            [agentId]: updater(state.tasks[agentId])
        }
    }));
}

// Mapping: c5->updateTaskInState, A->agentId, q->setAppState, K->updater, Y->state
```

### Cross-References

- **[execution_flow_deep_dive.md](./execution_flow_deep_dive.md#5-progress-reporting-pipeline)** - Detailed progress reporting analysis
- **[task_lifecycle_and_state.md](./task_lifecycle_and_state.md)** - Task state machine
- **[../04_system_reminder/](../04_system_reminder/)** - System reminder generation in main session
- **[../15_state_management/](../15_state_management/)** - State management architecture

---

## Summary

The system reminder integration between parent and subagent follows a careful design:

1. **No direct propagation** - Subagents build their own context, preventing misleading inherited state
2. **Fork context** - Optional feature for agents that need conversation continuity
3. **Dual progress functions** - `reportToolProgress` for metrics, `updateTaskProgress` for milestones
4. **Event-based reporting** - `agent_progress` events flow upward to keep parent informed

This design ensures subagents have accurate context while parents maintain visibility into subagent progress.