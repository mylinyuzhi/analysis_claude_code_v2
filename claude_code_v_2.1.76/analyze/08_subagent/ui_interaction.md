# Subagent UI Interaction (Claude Code 2.1.76)

> Documentation of user interface components, interactions, and visual feedback for subagent execution.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `agentLoopRunner` (qh) - Core execution generator - chunks.133.mjs:1565
- `AgentTool` (QW6) - Task/Agent tool definition - chunks.136.mjs:1512
- `Vc4` - Agent status component renderer - chunks.133.mjs:124

---

## Overview

Subagents provide visual feedback through multiple UI mechanisms:
1. **Status line indicators** - Real-time subagent progress in the footer
2. **Tree visualization** - Hierarchical display of agent relationships
3. **Progress updates** - Tool use counts and token tracking
4. **Notification badges** - Completion/failure notifications

---

## UI Component Architecture

### Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            TUI Root Component                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     Message List (Main Area)                         │    │
│  │                                                                      │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │ Assistant Message with tool_use                              │   │    │
│  │  │                                                              │   │    │
│  │  │  ├─ AgentTool (Task)                                        │   │    │
│  │  │  │  ├─ AgentStatusComponent (Vc4)                          │   │    │
│  │  │  │  │  ├─ Agent type badge (colored)                       │   │    │
│  │  │  │  │  ├─ Description text                                  │   │    │
│  │  │  │  │  └─ Tool use count / tokens                           │   │    │
│  │  │  │  └─ Progress indicator (when running)                    │   │    │
│  │  │  └──────────────────────────────────────────────────────────┘   │    │
│  │  └──────────────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     Status Line (Footer)                             │    │
│  │                                                                      │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │ BackgroundAgentIndicator                                    │   │    │
│  │  │  • Shows count of running local_agent tasks                 │   │    │
│  │  │  • "X running • Ctrl+C to cancel" hint                      │   │    │
│  │  └──────────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Agent Status Component (Vc4)

The `Vc4` function renders the visual representation of a subagent in the UI.

### What it does

Renders a tree-style visualization of an agent's status with:
- Agent type badge with custom color
- Task description
- Tool use count and token tracking
- Real-time status updates

### How it works

```javascript
// ============================================
// Vc4 - Agent status component renderer
// Location: chunks.133.mjs:124-200
// ============================================

// ORIGINAL (for source lookup):
function Vc4(A) {
    let q = A6(33),
        {
            agentType: K,
            description: Y,
            descriptionColor: z,
            taskDescription: _,
            toolUseCount: w,
            tokens: O,
            color: $,
            isLast: H,
            isResolved: j,
            isAsync: J,
            lastToolInfo: M,
            hideType: D
        } = A,
        X = J === void 0 ? !1 : J,
        P = D === void 0 ? !1 : D,
        W = H ? "└─" : "├─",
        Z = X && j,
        G;
    if (q[0] !== Z || q[1] !== j || q[2] !== M || q[3] !== _) G = () => {
        if (!j) return M || "Initializing…";
        if (Z) return _ ?? "Running in the background";
        return "Done"
    }, q[0] = Z, q[1] = j, q[2] = M, q[3] = _, q[4] = G;
    else G = q[4];
    // ... renders tree node with status indicator
}

// READABLE (for understanding):
function AgentStatusComponent(props) {
    let {
        agentType,           // "general-purpose", "Explore", "Plan", etc.
        description,         // Short description passed to AgentTool
        descriptionColor,    // Optional color for description
        taskDescription,     // Detailed task description
        toolUseCount,        // Number of tool calls made
        tokens,              // Token usage count
        color,               // Agent's custom color
        isLast,              // Whether this is the last sibling
        isResolved,          // Whether agent has completed
        isAsync,             // Whether running asynchronously
        lastToolInfo,        // Most recent tool info string
        hideType             // Hide agent type badge
    } = props;

    let treePrefix = isLast ? "└─" : "├─";
    let isBackgrounded = isAsync && isResolved;

    // Status text based on state
    let statusText = () => {
        if (!isResolved) return lastToolInfo || "Initializing…";
        if (isBackgrounded) return taskDescription ?? "Running in the background";
        return "Done";
    };

    // Render tree node with badge, description, and stats
    // ...
}

// Mapping: Vc4→AgentStatusComponent, K→agentType, Y→description, w→toolUseCount, O→tokens
```

### Visual Output

```
├─ general-purpose (Find API usages) · 15 tool uses · 23451 tokens
│  Running Grep for "createTaskId"...
└─ Done
```

---

## Status Line Integration

### Background Agent Indicator

The status line shows running background agents with a counter and hint.

**Location:** chunks.192.mjs:425

```javascript
// ============================================
// BackgroundAgentIndicator - Status line component
// Location: chunks.192.mjs:475
// ============================================

// ORIGINAL (for source lookup):
let l = Object.values(j).some((O6) => O6.type === "local_agent" && O6.status === "running");

// READABLE (for understanding):
let hasRunningAgents = Object.values(tasks).some(
    (task) => task.type === "local_agent" && task.status === "running"
);
```

### Kill All Interaction (Ctrl+C → Kill Agents)

**Location:** chunks.193.mjs:2605-2644

```javascript
// ============================================
// KillAllAgentsHandler - Ctrl+C kills running agents
// Location: chunks.193.mjs:2605-2644
// ============================================

// ORIGINAL (for source lookup):
let L = M1((e) => Object.values(e.tasks).some((Y6) => Y6.type === "local_agent" && Y6.status === "running"));
let h = Ra6.useCallback(() => {
    // ... handler implementation
    if (L) {
        d("tengu_cancel", {
            source: "kill_agents"
        }), U4q(H6, W), _Y4();
        let J6 = [];
        for (let [K6, s] of Object.entries(H6))
            if (s.type === "local_agent" && s.status === "running") d4q(K6, W), J6.push(s.description);
        if (J6.length > 0) {
            let K6 = J6.length === 1 ? `Background agent "${J6[0]}" was stopped by the user.` : `${J6.length} background agents were stopped by the user: ${J6.map((s)=>`"${s}"`).join(", ")}.`;
            w0({
                value: K6,
                mode: "task-notification"
            });
        }
    }
}, [/* deps */]);

// READABLE (for understanding):
let hasRunningAgents = useAppState((state) =>
    Object.values(state.tasks).some(
        (task) => task.type === "local_agent" && task.status === "running"
    )
);

let handleKillAllAgents = useCallback(() => {
    if (hasRunningAgents) {
        // Send kill signal to all local_agent tasks
        killAllLocalAgents(tasks, setAppState);

        // Collect killed agent descriptions
        let killedDescriptions = [];
        for (let [taskId, task] of Object.entries(tasks)) {
            if (task.type === "local_agent" && task.status === "running") {
                markTaskKilled(taskId, setAppState);
                killedDescriptions.push(task.description);
            }
        }

        // Show notification
        if (killedDescriptions.length > 0) {
            let message = killedDescriptions.length === 1
                ? `Background agent "${killedDescriptions[0]}" was stopped by the user.`
                : `${killedDescriptions.length} background agents were stopped by the user: ${killedDescriptions.map(d => `"${d}"`).join(", ")}.`;
            addNotification({
                value: message,
                mode: "task-notification"
            });
        }
    }
}, [hasRunningAgents, tasks, setAppState]);
```

### Key Insight: Kill Flow

1. User presses **Ctrl+C** when agents are running
2. System checks `hasRunningAgents` flag
3. If true: `U4q` sends abort signal to all `local_agent` tasks
4. Each task's abort handler triggers cleanup
5. `d4q` marks each task as "killed" with notification
6. User sees notification message about stopped agents

---

## Agent Tree Visualization

### Hierarchical Display

Subagents are displayed in a tree structure showing:
- Parent-child relationships
- Status indicators (running ✓, completed ○, failed ✗)
- Nested subagent calls

```
├─ general-purpose (Analyze codebase) · 42 tool uses
│  ├─ Explore (Find usages) · 8 tool uses
│  │  └─ Done
│  ├─ Plan (Design solution) · 12 tool uses
│  │  └─ Done
│  └─ Running: Writing implementation...
└─ Running
```

### Tree Prefix Characters

| Prefix | Meaning |
|--------|---------|
| `├─` | Has more siblings below |
| `└─` | Last sibling in group |
| `│` | Vertical connector |
| ` ` | Indentation for depth |

---

## Progress Tracking UI

### Tool Use Counter

Displayed as `N tool uses` where N is the count of tool invocations made by the subagent.

### Token Counter

Displayed as `X tokens` showing cumulative token usage for the subagent.

### Last Tool Info

Shows the most recent tool being executed:
- `Running Grep for "pattern"...`
- `Reading file: src/main.ts`
- `Writing to: output.json`

---

## Notification System

### Task Completion Notification

When a background agent completes, a notification is added:

```javascript
// Notification structure
{
    value: "Background agent \"Find API usages\" completed.",
    mode: "task-notification"
}
```

### Notification Display Location

Notifications appear in the status line area and are dismissible.

---

## Color Coding

### Agent Type Colors

Agent definitions can specify a custom color for visual identification:

```javascript
// Agent definition with color
{
    agentType: "Explore",
    color: "#FF5733",  // Custom color
    // ...
}
```

### Color Application

Colors are applied to:
1. **Agent type badge** - Background color
2. **Status line indicator** - When agent is active
3. **Tree visualization** - Consistent identification

---

## Keyboard Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `Ctrl+C` | Kill all running agents | When agents running |
| `x` (in task list) | Kill selected task | Task list view |
| `f` (in task list) | Foreground teammate | Teammate task selected |

---

## UI State Flags

### isResolved

Indicates whether the agent has completed execution:
- `false` - Agent is still running
- `true` - Agent finished (success, failure, or killed)

### isAsync

Indicates whether the agent is running asynchronously:
- `false` - Synchronous (blocking) execution
- `true` - Background execution

### Combination States

| isResolved | isAsync | Display |
|------------|---------|---------|
| `false` | `false` | Running... (with lastToolInfo) |
| `false` | `true` | Running in background... |
| `true` | `false` | Done |
| `true` | `true` | Running in the background |

---

## Integration with System Reminders

Subagent progress is injected into the conversation via system reminders:

### task_progress Attachment

```xml
<system-reminder>
<task_progress>
  <task_id>a3f4b2</task_id>
  <task_type>local_agent</task_type>
  <message>Running Grep for "createTaskId"...</message>
</task_progress>
</system-reminder>
```

### task_status Attachment

```xml
<system-reminder>
<task_status>
  <task_id>a3f4b2</task_id>
  <task_type>local_agent</task_type>
  <status>completed</status>
  <description>Find API usages</description>
  <delta_summary>Found 15 occurrences in 8 files...</delta_summary>
</task_status>
</system-reminder>
```

See [system_reminder_producers.md](../26_background_agents/system_reminder_producers.md) for details.

---

## Related Documents

- [execution_flow_deep_dive.md](./execution_flow_deep_dive.md) - Core execution algorithms
- [tools_integration.md](./tools_integration.md) - Tool assembly and filtering
- [communication_and_coordination.md](./communication_and_coordination.md) - Teammate communication
- [../26_background_agents/ui_interaction.md](../26_background_agents/ui_interaction.md) - Background agents UI

---

## Source Code Verification

### Verified Symbol Locations

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `Vc4` | AgentStatusComponent | chunks.162.mjs:836 | ✓ Verified |
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs | ✓ Verified |

---

## Complete Kill Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         User Presses Ctrl+C                                  │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Check: hasRunningAgents?                                  │
│                                                                              │
│  hasRunningAgents = tasks.some(t => t.type === "local_agent" &&             │
│                                     t.status === "running")                  │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼ false                       ▼ true
┌─────────────────────────┐    ┌─────────────────────────────────────────────┐
│ Normal Ctrl+C behavior  │    │ Kill All Running Agents                     │
│ (cancel current stream) │    │                                             │
└─────────────────────────┘    │  1. telemetry("tengu_cancel")               │
                               │  2. U4q(tasks, setAppState) // abort all    │
                               │     └── x66(taskId) for each task          │
                               │  3. For each running local_agent:           │
                               │     a. d4q(taskId, setAppState) // killed   │
                               │     b. collect description                  │
                               │  4. Show notification with killed list      │
                               └─────────────────────────────────────────────┘
```

### Kill Flow with AbortController

```javascript
// ============================================
// U4q - Kill all local agents (verified source)
// Location: chunks.146.mjs:2029-2032
// ============================================

// ORIGINAL (for source lookup):
function U4q(A, q) {
    for (let [K, Y] of Object.entries(A))
        if (Y.type === "local_agent" && Y.status === "running") x66(K, q)
}

// READABLE (for understanding):
function killAllLocalAgents(tasks, setAppState) {
    for (let [taskId, task] of Object.entries(tasks)) {
        if (task.type === "local_agent" && task.status === "running") {
            // x66 triggers the abort signal for this task
            triggerAbortSignal(taskId, setAppState);
        }
    }
}

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, x66→triggerAbortSignal
```

```javascript
// ============================================
// d4q - Mark task as killed (verified source)
// Location: chunks.146.mjs:2034-2042
// ============================================

// ORIGINAL (for source lookup):
function d4q(A, q) {
    i9(A, q, (K) => {
        if (K.notified) return K;
        return {
            ...K,
            notified: !0,
            messages: K.messages?.length ? [K.messages[K.messages.length - 1]] : void 0
        }
    })
}

// READABLE (for understanding):
function markTaskKilled(taskId, setAppState) {
    atomicUpdateTask(taskId, setAppState, (task) => {
        // Skip if already notified (prevent double notification)
        if (task.notified) return task;

        return {
            ...task,
            notified: true,
            // Keep only the last message for memory efficiency
            messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined
        };
    });
}

// Mapping: d4q→markTaskKilled, A→taskId, q→setAppState, i9→atomicUpdateTask
```

---

## Task List Component Details

### Task List Row Rendering

**Location:** chunks.162.mjs:836-981

```javascript
// ============================================
// TaskListRow - Individual task row in task list
// Location: chunks.162.mjs:839-846
// ============================================

// READABLE (for understanding):
function TaskListRow({ task, dispatch }) {
    // Status icon based on task state
    const statusIcon = {
        pending: "○",
        running: "◐",  // Animated
        completed: "✓",
        failed: "✗",
        killed: "○"
    }[task.status];

    // Action availability
    const canKill = task.status === "running";
    const canForeground = task.type === "in_process_teammate" && task.status === "running";

    return {
        statusIcon,
        description: task.description,
        status: task.status,
        canKill,
        canForeground
    };
}
```

### Keyboard Actions in Task List

**Location:** chunks.162.mjs:846-860

```javascript
// ============================================
// handleTaskAction - Keyboard handlers for task list
// Location: chunks.162.mjs:846
// ============================================

// READABLE (for understanding):
function handleTaskAction(key, task, dispatch) {
    if (key === "x") {  // Kill action
        switch (task.type) {
            case "local_bash":
                if (task.status === "running") killBashTask(task.id);
                break;
            case "local_agent":
                if (task.status === "running") killAgentTask(task.id);
                break;
            case "in_process_teammate":
                if (task.status === "running") killTeammateTask(task.id);
                break;
            case "local_workflow":
                if (task.status === "running") killWorkflowTask(task.id);
                break;
        }
    }
    if (key === "f") {  // Foreground action (teammates only)
        if (task.type === "in_process_teammate" && task.status === "running") {
            foregroundTeammate(task.id);
            dispatch("Viewing teammate", { action: "view" });
        }
    }
}
```

---

## Advanced UI States

### Task Status Icon Animation

Running tasks use an animated spinner (◐) to indicate active execution:

```
Status Animation Cycle:
◐ → ◑ → ◒ → ◓ → ◐ (loops)
```

### Agent Type Badge Styling

Each agent type has associated visual styling:

| Agent Type | Default Color | Badge Style |
|------------|--------------|-------------|
| `general-purpose` | Blue | Rounded rectangle |
| `Explore` | Green | Rounded rectangle |
| `Plan` | Purple | Rounded rectangle |
| `statusline-setup` | Orange | Rounded rectangle |

---

## System Reminder Integration Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Subagent Execution Loop                                   │
│  (agentLoopRunner - each turn)                                              │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              updateTaskProgress (nl4)                                        │
│                                                                              │
│  • Update toolUseCount, tokenCount                                          │
│  • Generate progress summary                                                 │
│  • Write telemetry if enabled                                               │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              getUnifiedTasksAttachment (vIY)                                 │
│                                                                              │
│  Called before each LLM turn:                                               │
│  1. Get all tasks from appState.tasks                                       │
│  2. Filter by running/completed/failed/killed                               │
│  3. Apply throttle (3 turns for progress)                                   │
│  4. Build attachment objects                                                │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
┌─────────────────────────┐    ┌─────────────────────────┐
│ task_progress Attachment│    │ task_status Attachment  │
│                         │    │                         │
│ • Running tasks only    │    │ • Terminal states only  │
│ • Throttled (3 turns)   │    │ • Includes output delta │
│ • Brief status message  │    │ • Marks as notified     │
└─────────────────────────┘    └─────────────────────────┘
```

---

## Notification Message Formats

### Completion Notification

```
Agent "{description}" completed
```

### Failure Notification

```
Agent "{description}" failed: {errorMessage}
```

### Kill Notification (Single)

```
Background agent "{description}" was stopped by the user.
```

### Kill Notification (Multiple)

```
{count} background agents were stopped by the user: "{desc1}", "{desc2}", ...
```

---

## v2.1.76 UI Changes

### New Features

1. **Ctrl+F Kill All** - New keyboard shortcut to kill all running agents
2. **Partial Results on Kill** - Preserved output when task is killed
3. **Background Field** - New `background: true` field distinguishes explicit vs. converted background tasks

### UI Indicator for Running Agents

```
Status Line: "2 running • Ctrl+C to cancel"
                       └─────────────────────┘
                          Clickable hint when agents running
```