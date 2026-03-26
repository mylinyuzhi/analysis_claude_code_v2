# Subagent System Reminder Deep Integration (Claude Code 2.1.76)

> Comprehensive documentation of how subagents integrate with the system reminder infrastructure,
> including context propagation, progress reporting, and attachment generation.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `agentLoopRunner` (qh) - Core async generator - chunks.133.mjs:1565
- `cloneForkContext` (Fx8) - Clone context for subagent - chunks.133.mjs:1788
- `buildAgentSystemPrompt` (vvY) - Build subagent system prompt - chunks.133.mjs:1806
- `nl4` - Update task progress with telemetry - chunks.146.mjs:2059
- `suY` - getTaskStatusAttachments - chunks.147.mjs:1033
- `Nqq` - Get unnotified completed tasks - chunks.147.mjs:1923
- `wY4` - pollTaskOutputs - chunks.90.mjs:3058

---

## Overview

Subagents have a sophisticated integration with the system reminder infrastructure. This integration serves multiple purposes:

1. **Context Propagation** - Parent context flows down to subagents
2. **Progress Reporting** - Subagent activity is visible to parent via attachments
3. **Result Delivery** - Completed subagent results appear in parent context
4. **Throttling** - Progress updates are rate-limited to prevent noise

---

## Context Propagation Architecture

### Fork Context Building

When a subagent is spawned, it receives a **forked context** from the parent session. This context includes:

1. **Message History** - Cloned and filtered for relevance
2. **Permission Mode** - Inherited from parent
3. **Working Directory** - Inherited from parent
4. **Read File State** - File tracking state for compact

### cloneForkContext (Fx8)

**Location:** chunks.133.mjs:1788-1804

**What it does:**
Creates an isolated copy of the parent context for subagent execution. This ensures the subagent has its own message history and state, preventing contamination of the parent session.

**How it works:**

```javascript
// ============================================
// cloneForkContext - Clone context for subagent isolation
// Location: chunks.133.mjs:1788-1804
// ============================================

// ORIGINAL (for source lookup):
function Fx8(A) {
    let q = new Set;
    for (let K of A)
        if (K?.type === "user") {
            let z = K.message.content;
            if (Array.isArray(z)) {
                for (let _ of z)
                    if (_.type === "tool_result" && _.tool_use_id) q.add(_.tool_use_id)
            }
        } return A.filter((K) => {
        if (K?.type === "assistant") {
            let z = K.message.content;
            if (Array.isArray(z)) return !z.some((w) => w.type === "tool_use" && w.id && !q.has(w.id))
        }
        return !0
    })
}

// READABLE (for understanding):
function cloneForkContext(messages) {
    // Step 1: Collect all tool_use_ids that have corresponding tool_results
    let validToolUseIds = new Set();

    for (let message of messages) {
        if (message?.type === "user") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                for (let block of content) {
                    if (block.type === "tool_result" && block.tool_use_id) {
                        validToolUseIds.add(block.tool_use_id);
                    }
                }
            }
        }
    }

    // Step 2: Filter out orphaned tool_uses (assistant messages with tool_use blocks that have no result)
    return messages.filter((message) => {
        if (message?.type === "assistant") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                // Keep message only if ALL tool_uses have corresponding results
                return !content.some((block) =>
                    block.type === "tool_use" &&
                    block.id &&
                    !validToolUseIds.has(block.id)
                );
            }
        }
        return true;  // Keep all non-assistant messages
    });
}

// Mapping: Fx8→cloneForkContext, A→messages, q→validToolUseIds, K→message, z→content
```

### Key Insight: Orphaned Tool Result Filtering

The fork context filtering removes **orphaned tool_uses** - tool calls that were made but never received a result. This is critical because:

1. **API Compatibility** - The Claude API rejects messages with tool_uses that have no corresponding tool_result
2. **Context Hygiene** - Prevents half-completed operations from confusing the subagent
3. **Memory Efficiency** - Removes unnecessary content from the subagent's context

---

## System Prompt Assembly

### buildAgentSystemPrompt (vvY)

**Location:** chunks.133.mjs:1806-1814

**What it does:**
Assembles the complete system prompt for the subagent, combining the agent definition's system prompt with any additional context.

```javascript
// ============================================
// buildAgentSystemPrompt - Build subagent system prompt
// Location: chunks.133.mjs:1806-1814
// ============================================

// ORIGINAL (for source lookup):
async function vvY(A, q, K, Y) {
    try {
        let _ = [A.getSystemPrompt({
            toolUseContext: q
        })];
        return await mc6(_, K, Y)
    } catch (z) {
        return await mc6([Al4], K, Y)
    }
}

// READABLE (for understanding):
async function buildAgentSystemPrompt(agentDefinition, toolUseContext, model, additionalWorkingDirs) {
    try {
        // Get the agent's system prompt
        let promptParts = [agentDefinition.getSystemPrompt({
            toolUseContext: toolUseContext
        })];

        // Combine with working directory context
        return await buildCombinedSystemPrompt(promptParts, model, additionalWorkingDirs);
    } catch (error) {
        // Fallback to default prompt on error
        return await buildCombinedSystemPrompt([DEFAULT_AGENT_PROMPT], model, additionalWorkingDirs);
    }
}

// Mapping: vvY→buildAgentSystemPrompt, A→agentDefinition, q→toolUseContext, K→model, Y→additionalWorkingDirs
```

---

## Progress Reporting Flow

### Subagent → Parent Communication

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Subagent Execution Loop                                   │
│  (agentLoopRunner - qh)                                                      │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             │ Each turn:
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              nl4 - updateTaskProgressWithTelemetry                          │
│                                                                              │
│  • Update toolUseCount, tokenCount in task state                            │
│  • Generate progress summary text                                           │
│  • Send telemetry event if enabled (c36)                                    │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             │ State update via i9 (atomicUpdateTask)
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              Parent Session State (appState.tasks[taskId])                  │
│                                                                              │
│  {                                                                          │
│    id: "a3f4b2",                                                            │
│    status: "running",                                                       │
│    progress: {                                                              │
│      toolUseCount: 5,                                                       │
│      tokenCount: 1234,                                                      │
│      summary: "Running Grep for 'createTaskId'..."                         │
│    }                                                                        │
│  }                                                                          │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             │ Before next parent LLM turn:
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              getUnifiedTasksAttachment (suY/Nqq)                            │
│                                                                              │
│  1. Get all tasks from appState.tasks                                       │
│  2. For running tasks: check throttle (TIY - countTurnsSinceLastProgress)  │
│  3. Build task_progress attachment if throttle satisfied                    │
│  4. For completed/failed/killed: build task_status attachment               │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              Attachment Injection into Parent Context                       │
│                                                                              │
│  <system-reminder>                                                          │
│  <task_progress>                                                            │
│    <task_id>a3f4b2</task_id>                                                │
│    <task_type>local_agent</task_type>                                       │
│    <message>Running Grep for 'createTaskId'...</message>                   │
│  </task_progress>                                                           │
│  </system-reminder>                                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### updateTaskProgressWithTelemetry (nl4)

**Location:** chunks.146.mjs:2059-2097

**What it does:**
Updates the task progress state and optionally sends telemetry. This is called after each turn in the subagent loop.

```javascript
// ============================================
// nl4 - Update task progress with telemetry
// Location: chunks.146.mjs:2059-2097
// ============================================

// ORIGINAL (for source lookup):
function nl4(A, q, K) {
    let Y = null;
    if (i9(A, K, (z) => {
            if (z.status !== "running") return z;
            return Y = {
                tokenCount: z.progress?.tokenCount ?? 0,
                toolUseCount: z.progress?.toolUseCount ?? 0,
                startTime: z.startTime,
                toolUseId: z.toolUseId
            }, {
                ...z,
                progress: {
                    ...z.progress,
                    toolUseCount: z.progress?.toolUseCount ?? 0,
                    tokenCount: z.progress?.tokenCount ?? 0,
                    summary: q
                }
            }
        }), Y && Nn()) {
        let {
            tokenCount: z,
            toolUseCount: _,
            startTime: w,
            toolUseId: O
        } = Y;
        c36({
            type: "system",
            subtype: "task_progress",
            task_id: A,
            tool_use_id: O,
            description: q,
            usage: {
                total_tokens: z,
                tool_uses: _,
                duration_ms: Date.now() - w
            },
            summary: q
        })
    }
}

// READABLE (for understanding):
function updateTaskProgressWithTelemetry(taskId, summaryText, setAppState) {
    let previousProgress = null;

    // Update task state atomically
    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        // Capture previous values for telemetry
        previousProgress = {
            tokenCount: task.progress?.tokenCount ?? 0,
            toolUseCount: task.progress?.toolUseCount ?? 0,
            startTime: task.startTime,
            toolUseId: task.toolUseId
        };

        return {
            ...task,
            progress: {
                ...task.progress,
                toolUseCount: task.progress?.toolUseCount ?? 0,
                tokenCount: task.progress?.tokenCount ?? 0,
                summary: summaryText
            }
        };
    });

    // Send telemetry if enabled
    if (previousProgress && isTelemetryEnabled()) {
        let { tokenCount, toolUseCount, startTime, toolUseId } = previousProgress;
        sendTelemetryEvent({
            type: "system",
            subtype: "task_progress",
            task_id: taskId,
            tool_use_id: toolUseId,
            description: summaryText,
            usage: {
                total_tokens: tokenCount,
                tool_uses: toolUseCount,
                duration_ms: Date.now() - startTime
            },
            summary: summaryText
        });
    }
}

// Mapping: nl4→updateTaskProgressWithTelemetry, A→taskId, q→summaryText, K→setAppState,
// i9→atomicUpdateTask, Nn→isTelemetryEnabled, c36→sendTelemetryEvent
```

---

## Progress Throttling Mechanism

### Why Throttle?

Without throttling, every parent LLM turn would include progress for all running subagents, creating:
- **Context noise** - Too much redundant information
- **Token waste** - Progress updates consuming budget
- **UI clutter** - Repeated similar messages

### Throttle Algorithm: countTurnsSinceLastProgress (TIY)

**Location:** chunks.144.mjs:832-835

**What it does:**
Counts how many assistant turns have passed since the last progress update for each task. Progress is only shown if ≥3 turns have passed.

```javascript
// ============================================
// TIY - Count turns since last progress (throttle helper)
// Location: chunks.144.mjs:832-835
// ============================================

// ORIGINAL (for source lookup):
function TIY(A) {
    let q = A.map((K) => K.uri).filter((K) => K);
    return new Set(q).size
}

// Note: This is a helper for file counting. The actual throttle logic is more complex
// and involves counting assistant turns in the message history.

// READABLE (for understanding):
// The throttle mechanism works by:
// 1. Iterating BACKWARDS through message history
// 2. Counting assistant turns (non-whitespace messages)
// 3. Stopping when a task_progress attachment for the task is found
// 4. Returning the turn count (or Infinity for new tasks)

function countTurnsSinceLastProgress(messages, taskId) {
    let turnsSinceProgress = new Map();
    let seenTasks = new Set();
    let turnCount = 0;

    // Iterate backwards from most recent
    for (let i = messages.length - 1; i >= 0; i--) {
        let message = messages[i];

        // Count assistant turns
        if (message?.type === "assistant" && !isWhitespaceOnly(message)) {
            turnCount++;
        }
        // Found last progress for a task
        else if (message?.type === "attachment" &&
                 message.attachment.type === "task_progress") {
            let tid = message.attachment.taskId;
            if (!seenTasks.has(tid)) {
                turnsSinceProgress.set(tid, turnCount);
                seenTasks.add(tid);
            }
        }
    }

    // New tasks get Infinity, ensuring first progress always shows
    return turnsSinceProgress;
}
```

### Throttle Decision

```javascript
// Throttle decision logic (pseudocode)
const PROGRESS_THROTTLE_TURNS = 3;

function shouldShowProgress(taskId, turnsSinceProgress) {
    let turns = turnsSinceProgress.get(taskId);

    // New task (not found) - always show first progress
    if (turns === undefined) return true;

    // Enough turns passed - show progress
    if (turns >= PROGRESS_THROTTLE_TURNS) return true;

    // Throttled - skip progress
    return false;
}
```

---

## Task Status Attachments

### Completion/Failure/Kill Events

When a subagent reaches a terminal state, a `task_status` attachment is generated:

```xml
<system-reminder>
<task_status>
  <task_id>a3f4b2</task_id>
  <task_type>local_agent</task_type>
  <status>completed</status>
  <description>Find API usages in codebase</description>
  <delta_summary>
    Found 15 occurrences in 8 files:
    - src/api.ts: createTaskId used 5 times
    - src/utils.ts: createTaskId imported and called 3 times
    ...
  </delta_summary>
</task_status>
</system-reminder>
```

### Attachment Generation Timing

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Subagent Completion                                      │
│                                                                              │
│  1. Agent loop finishes normally → $m8 (markTaskCompleted)                 │
│  2. Agent loop throws error → Hm8 (markTaskFailed)                         │
│  3. Agent killed → d4q (markTaskKilled)                                     │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              Task State Update                                              │
│                                                                              │
│  • status: "completed" | "failed" | "killed"                               │
│  • endTime: Date.now()                                                      │
│  • result: { agentId, status, content, tokens } (for completed)            │
│  • error: errorMessage (for failed)                                         │
│  • notified: true (prevents duplicate notifications)                       │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             │ Before next parent LLM turn:
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              Nqq - getUnnotifiedCompletedTasks                              │
│                                                                              │
│  1. Filter appState.tasks for local_agent type                             │
│  2. Filter for terminal status (completed/failed/killed)                   │
│  3. Filter for !retrieved (not yet retrieved via TaskOutput)               │
│  4. Build task_status attachments                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## inhibitSystemReminders Flag

### Why Subagents Inhibit Reminders

Subagents have `inhibitSystemReminders: true` in their derived tool use context. This prevents:

1. **Recursive Subagent Spawning** - A subagent triggering a reminder that spawns another subagent
2. **Permission Loop Spam** - Permission prompts appearing in subagent context
3. **Context Budget Waste** - System reminders consuming subagent's token budget

### Implementation

```javascript
// In Bc6 (deriveToolUseContext) for subagents:
let subagentContext = {
    ...parentContext,
    inhibitSystemReminders: true,  // Block system reminder production
    // ... other subagent-specific settings
};
```

### Exceptions

Some system reminders still flow to subagents:
- **Critical reminders** - Fatal errors, abort signals
- **Budget warnings** - Token limit approaching
- **Permission prompts** - When `canShowPermissionPrompts` is true

---

## Integration with Other Features

### With 04_system_reminder

- Subagent progress/status appears as attachments in parent context
- Attachments are wrapped in `<system-reminder>` tags
- Throttle mechanism prevents noise

### With 05_tools

- AgentTool triggers subagent creation
- TaskOutputTool retrieves subagent results
- TaskStopTool kills running subagents

### With 07_compact

- Subagent transcripts are filtered during parent compaction
- Task state persists across compactions
- Output files are not compacted

### With 26_background_agents

- Shared task management infrastructure
- Same output file system
- Same kill/abort mechanisms

---

## Debugging Tips

### Check Task State

```javascript
// Inspect subagent task state
let tasks = toolUseContext.getAppState().tasks;
for (let [id, task] of Object.entries(tasks)) {
    if (task.type === "local_agent") {
        console.log(`Subagent ${id}:`, {
            status: task.status,
            progress: task.progress,
            notified: task.notified,
            retrieved: task.retrieved
        });
    }
}
```

### Check Progress Throttle

```javascript
// Check if progress should show
let turnsMap = countTurnsSinceLastProgress(messages);
for (let [taskId, turns] of turnsMap) {
    console.log(`Task ${taskId}: ${turns} turns since last progress`);
    if (turns >= 3 || turns === Infinity) {
        console.log("  → Progress will be shown");
    } else {
        console.log("  → Progress throttled");
    }
}
```

---

## Related Documents

- [execution_flow_deep_dive.md](./execution_flow_deep_dive.md) - Agent loop execution
- [communication_and_coordination.md](./communication_and_coordination.md) - Teammate messaging
- [../26_background_agents/system_reminder_producers.md](../26_background_agents/system_reminder_producers.md) - Attachment production
- [../04_system_reminder/integration_flow.md](../04_system_reminder/integration_flow.md) - System reminder infrastructure