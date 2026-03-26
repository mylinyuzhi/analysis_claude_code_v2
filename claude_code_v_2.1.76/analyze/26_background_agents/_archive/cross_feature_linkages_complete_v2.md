# Background Agents Cross Feature Linkages Complete V2 (Claude Code 2.1.76)

> Complete documentation of background agent integration with all other Claude Code features including tools, system reminders, compact, hooks, and subagent system.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

---

## Integration Matrix

| Module | Integration Point | Key Symbols | Description |
|--------|-------------------|-------------|-------------|
| 04_system_reminder | Task attachments | `suY`, `wY4`, `nl4` | task_status, task_progress injection |
| 05_tools | Tool blocking | `CW6`, `eP1` | Blocked/allowed tools for background |
| 07_compact | Transcript handling | `dg`, `VR` | Task persistence, state cleanup |
| 08_subagent | Task creation | `Qn4`, `Un4`, `x66` | Spawn, kill, state management |
| 17_telemetry | Event tracking | `c36`, `Zf` | Task started, progress, completed |
| 32_keybindings | Kill shortcuts | `U4q` | Ctrl+C/Ctrl+F handlers |

---

## Integration with 04_system_reminder

### Task Attachment Producers

```javascript
// In assembleAllAttachments (_uY):
async function assembleAllAttachments(toolUseContext, messages, ...) {
    // Group 2: Task attachments
    let taskAttachments = await getUnifiedTasksAttachment(toolUseContext);  // suY

    return [...otherAttachments, ...taskAttachments];
}
```

### Attachment Timing

| Event | Attachment Type | Throttle |
|-------|-----------------|----------|
| Task running | task_progress | Every 3+ turns |
| Task completed | task_status | Always (once) |
| Task failed | task_status | Always (once) |
| Task killed | task_status | Always (once) |

### Progress vs Status

```javascript
// task_progress: For running tasks (throttled)
{
    type: "task_progress",
    taskId: "ab3k7m9p2",
    taskType: "local_agent",
    message: "Running Grep for 'createTaskId' in 5 files..."
}

// task_status: For terminal states (always sent)
{
    type: "task_status",
    taskId: "ab3k7m9p2",
    taskType: "local_agent",
    status: "completed",
    description: "Search codebase for createTaskId",
    deltaSummary: "Found 15 files with references"
}
```

---

## Integration with 05_tools

### Blocked Tools for Background Agents

```javascript
// ============================================
// CW6 - BACKGROUND_AGENT_EXCLUDED_TOOLS
// Location: chunks.91.mjs:269
// ============================================

const BACKGROUND_AGENT_EXCLUDED_TOOLS = new Set([
    "TaskOutput",      // Could create polling loops
    "ExitPlanMode",    // Requires user approval
    "EnterPlanMode",   // Requires user approval
    "Agent",           // Could spawn nested agents
    "AskUserQuestion", // Would block indefinitely
    "TaskStop"         // Background shouldn't manage tasks
]);
```

### Allowed Tools for Background Agents

```javascript
// ============================================
// eP1 - ASYNC_AGENT_ALLOWED_TOOLS
// Location: chunks.91.mjs:269
// ============================================

const ASYNC_AGENT_ALLOWED_TOOLS = new Set([
    "Read", "WebSearch", "TodoWrite", "Grep", "WebFetch", "Glob",
    "Bash", "Edit", "Write", "NotebookEdit", "Skill",
    "StructuredOutput", "ToolSearch", "EnterWorktree", "ExitWorktree"
]);
```

### Tool Filtering Implementation

```javascript
// In applyToolFilters (_c):
function applyToolFilters(agentDefinition, allTools, isAsync) {
    let filteredTools = [...allTools];

    // For background agents, remove blocked tools
    if (isAsync) {
        filteredTools = filteredTools.filter(
            tool => !BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)
        );

        // Optionally verify against allowed list
        filteredTools = filteredTools.filter(
            tool => ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name)
        );
    }

    return { resolvedTools: filteredTools };
}
```

**Why these restrictions:**
- **User interaction tools**: Would hang waiting for input
- **Plan mode tools**: Require approval flow not available in background
- **Task management tools**: Could create conflicts or loops

---

## Integration with 07_compact

### Task State Preservation

```javascript
// Tasks are NOT compacted - they persist across compactions
// The task record includes minimal message references

// In markTaskCompleted ($m8):
return {
    ...task,
    status: "completed",
    // Keep only last message, not full transcript
    messages: task.messages?.length
        ? [task.messages[task.messages.length - 1]]
        : undefined
};
```

### Transcript Recording

```javascript
// Sidechain transcript is recorded separately
// dg (recordSidechainTranscript) writes to .claude/sidechains/<agentId>.jsonl

// This transcript is not affected by main session compaction
```

### Eviction After Notification

```javascript
// In removeTask (VR):
function removeTask(taskId, setAppState) {
    setAppState((state) => {
        let task = state.tasks?.[taskId];
        if (!task) return state;

        // Must be terminal
        if (!isTerminalTaskStatus(task.status)) return state;

        // Must be notified
        if (!task.notified) return state;

        // Remove from state
        let { [taskId]: removed, ...remainingTasks } = state.tasks;
        return { ...state, tasks: remainingTasks };
    });
}
```

---

## Integration with 08_subagent

### Task Creation Flow

```
AgentTool.call({ run_in_background: true })
        │
        ▼
┌───────────────────────────────────────────┐
│ Qn4 (createBackgroundAgentTask)           │
│                                           │
│ 1. ensureOutputDirectory(agentId)         │
│ 2. Create AbortController                 │
│ 3. Build task record                      │
│ 4. Register cleanup handler               │
│ 5. Zf (registerTask) - sends telemetry    │
└───────────────────┬───────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────┐
│ qh (agentLoopRunner)                       │
│                                           │
│ • Run agent with filtered tools            │
│ • Stream to output file                    │
│ • Update progress via nl4                  │
└───────────────────┬───────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────┐
│ $m8 (markTaskCompleted) / Hm8 (failed)    │
│                                           │
│ • Set terminal status                      │
│ • Flush output                             │
│ • Trigger notification                     │
└───────────────────────────────────────────┘
```

### Kill Flow Integration

```
User Ctrl+C → Ctrl+F
        │
        ▼
U4q (killAllLocalAgents)
        │
        ├── For each local_agent running:
        │   └── x66 (triggerAbortSignal)
        │       • abortController.abort()
        │       • Set status: "killed"
        │       • flushOutputBuffer()
        │
        └── For each killed:
            └── d4q (markTaskKilled)
                • Set notified: true
```

---

## Integration with 17_telemetry

### Telemetry Events

| Event | When | Data |
|-------|------|------|
| task_started | Task registered | taskId, taskType, description, prompt |
| task_progress | Progress update | taskId, tokenCount, toolUseCount, duration |
| task_completed | Task finished | taskId, duration, result |
| task_failed | Task error | taskId, error |

### Event Sending

```javascript
// In registerTask (Zf):
sendTelemetry({
    type: "system",
    subtype: "task_started",
    task_id: task.id,
    tool_use_id: task.toolUseId,
    description: task.description,
    task_type: task.type,
    prompt: task.prompt
});

// In nl4 (updateTaskProgressWithTelemetry):
sendTelemetry({
    type: "system",
    subtype: "task_progress",
    task_id: taskId,
    tool_use_id: toolUseId,
    description: summary,
    usage: {
        total_tokens: tokenCount,
        tool_uses: toolUseCount,
        duration_ms: duration
    }
});
```

---

## Integration with 32_keybindings

### Kill Shortcut Handler

```javascript
// Ctrl+C → Ctrl+F flow

// In key handler:
function handleCtrlC(state) {
    let hasRunningAgents = Object.values(state.tasks).some(
        t => t.type === "local_agent" && t.status === "running"
    );

    if (!hasRunningAgents) {
        // Normal Ctrl+C - cancel stream
        cancelCurrentStream();
        return;
    }

    // Show confirmation
    showConfirmation({
        text: "Press Ctrl+F to stop background agents",
        timeout: CONFIRMATION_TIMEOUT
    });
}

function handleCtrlF(state) {
    // Execute kill all
    killAllLocalAgents(state.tasks, setAppState);  // U4q

    // Show notification
    let killedTasks = Object.values(state.tasks).filter(
        t => t.status === "killed"
    );

    notifyKilled(killedTasks);
}
```

---

## Cross-Feature Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BACKGROUND AGENTS INTEGRATION FLOW                        │
└─────────────────────────────────────────────────────────────────────────────┘

Tool Call (run_in_background: true)
        │
        ├── 05_tools: Check tool permissions
        │   • Verify not in blocked list
        │   • Verify in allowed list
        │
        ├── 08_subagent: Create task (Qn4)
        │   • Initialize state
        │   • Set up abort controller
        │
        ├── 17_telemetry: Send task_started
        │
        ▼
Background Execution
        │
        ├── Each turn: nl4 (progress + telemetry)
        │   • 04_system_reminder: task_progress (throttled)
        │   • 17_telemetry: task_progress event
        │
        ▼
Completion
        │
        ├── $m8/Hm8: Mark completed/failed
        │
        ├── 04_system_reminder: task_status attachment
        │   • Generated by suY
        │   • Injected into LLM context
        │
        ├── 07_compact: Evict after notification
        │   • VR (removeTask)
        │
        └── 17_telemetry: task_completed event

Kill Flow (Ctrl+C → Ctrl+F)
        │
        ├── 32_keybindings: Handle shortcut
        │
        ├── U4q: killAllLocalAgents
        │
        ├── x66: triggerAbortSignal (each task)
        │
        └── d4q: markTaskKilled
```

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `suY` | getUnifiedTasksAttachment | chunks.147.mjs:1033 | ✓ Verified |
| `wY4` | pollTaskOutputs | chunks.90.mjs:3058 | ✓ Verified |
| `Qn4` | createBackgroundAgentTask | chunks.146.mjs:2133 | ✓ Verified |
| `Un4` | createForegroundAgentTask | chunks.146.mjs:2165 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | ✓ Verified |
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |
| `CW6` | BACKGROUND_AGENT_EXCLUDED_TOOLS | chunks.91.mjs:269 | ✓ Verified |
| `eP1` | ASYNC_AGENT_ALLOWED_TOOLS | chunks.91.mjs:269 | ✓ Verified |

---

## Related Documents

- [ui_interaction_complete_v3.md](./ui_interaction_complete_v3.md) - UI interaction
- [key_algorithms_deep_dive_v2.md](./key_algorithms_deep_dive_v2.md) - Algorithm analysis
- [system_reminder_integration_v4.md](./system_reminder_integration_v4.md) - System reminder integration
- [../08_subagent/cross_feature_linkages_complete_v4.md](../08_subagent/cross_feature_linkages_complete_v4.md) - Subagent linkages