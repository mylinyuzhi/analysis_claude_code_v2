# UI Design Complete V5 - Subagent & Background Agents (Claude Code 2.1.76)

> Complete UI design documentation for subagent and background agent interactions including React component architecture, visual mockups, keyboard shortcuts, status indicators, notification system, and system reminder integration.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified_v4.md](./cross_validation_unified_v4.md) - Unified symbol verification

Key functions in this document:
- `U4q` - killAllLocalAgents — `chunks.146.mjs:2029`
- `x66` - triggerAbortSignal — `chunks.146.mjs:2012`
- `nl4` - updateTaskProgressWithTelemetry — `chunks.146.mjs:2059`
- `suY` - getUnifiedTasksAttachment — `chunks.147.mjs:1033`

---

## UI Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TUI ARCHITECTURE                                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              TUI Root (App)                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        MessageArea                                    │    │
│  │                                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐│    │
│  │  │ UserMessage                                                      ││    │
│  │  │  "Search the codebase for authentication patterns"              ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  │                                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐│    │
│  │  │ AssistantMessage                                                 ││    │
│  │  │  ├─ TextContent: "I'll search for..."                           ││    │
│  │  │  └─ ToolUseContent (type: "tool_use", name: "Agent")            ││    │
│  │  │      └─ AgentStatusComponent ◐ general-purpose                  ││    │
│  │  │          "Searching codebase for authentication patterns"        ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  │                                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐│    │
│  │  │ ToolResultContent                                                ││    │
│  │  │  ┌─ status: "completed"                                          ││    │
│  │  │  │  agentId: "a7x9k2m3"                                          ││    │
│  │  │  │  totalToolUseCount: 5                                         ││    │
│  │  │  │  totalTokens: 12543                                           ││    │
│  │  │  │  content: "Found 12 authentication patterns..."              ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        StatusLine (Footer)                           │    │
│  │                                                                       │    │
│  │  Model: claude-sonnet-4 │ CWD: /project │ 2 running ● Ctrl+F stop   │    │
│  │                          └──────────────────┘ └──────────────────┘  │    │
│  │                               background count    kill hint          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     NotificationArea                                 │    │
│  │                                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐│    │
│  │  │ Background agent "Search codebase" completed                     ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component 1: Agent Status Component (Vc4)

### Visual Mockups

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AGENT STATUS COMPONENT                               │
└─────────────────────────────────────────────────────────────────────────────┘

Running State:
┌─────────────────────────────────────────────────────────────────────────────┐
│ └─ ◐ general-purpose                                                        │
│    "Searching codebase for authentication patterns"                         │
│    tools: 3  tokens: 4.2k                                                   │
└─────────────────────────────────────────────────────────────────────────────┘

Completed State:
┌─────────────────────────────────────────────────────────────────────────────┐
│ └─ ✓ general-purpose                                                        │
│    "Search completed - found 12 patterns"                                   │
│    tools: 5  tokens: 12.5k  duration: 45s                                  │
└─────────────────────────────────────────────────────────────────────────────┘

Failed State:
┌─────────────────────────────────────────────────────────────────────────────┐
│ └─ ✗ general-purpose                                                        │
│    "Search failed: timeout after 60s"                                       │
│    tools: 2  tokens: 1.8k                                                   │
└─────────────────────────────────────────────────────────────────────────────┘

Killed State:
┌─────────────────────────────────────────────────────────────────────────────┐
│ └─ ○ general-purpose                                                        │
│    "Search stopped by user"                                                 │
│    tools: 1  tokens: 0.5k  (partial results available)                     │
└─────────────────────────────────────────────────────────────────────────────┘

Background Running:
┌─────────────────────────────────────────────────────────────────────────────┐
│ └─ ◐ general-purpose [background]                                           │
│    "Running tests in background"                                            │
│    tools: 8  tokens: 15.2k  (view output)                                  │
└─────────────────────────────────────────────────────────────────────────────┘

Teammate Running:
┌─────────────────────────────────────────────────────────────────────────────┐
│ └─ ◐ worker-1 [team: alpha-team]                                            │
│    "Analyzing authentication module"                                        │
│    tools: 4  tokens: 8.7k  mailbox: 2 unread                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Source Code

```javascript
// ============================================
// Vc4 - AgentStatusComponent
// Location: chunks.136.mjs:328332-328411
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
    // ... render logic
}

// READABLE (for understanding):
function AgentStatusComponent({
    agentType,
    description,
    descriptionColor,
    taskDescription,
    toolUseCount,
    tokens,
    color,
    isLast,
    isResolved,
    isAsync,
    lastToolInfo,
    hideType
}) {
    // Determine tree prefix
    let prefix = isLast ? "└─" : "├─";
    let isBackgroundDone = isAsync && isResolved;

    // Status text
    let statusText;
    if (!isResolved) {
        statusText = lastToolInfo || "Initializing…";
    } else if (isBackgroundDone) {
        statusText = taskDescription ?? "Running in the background";
    } else {
        statusText = "Done";
    }

    // Agent type badge
    let agentBadge = hideType
        ? <Text bold>{description || agentType}</Text>
        : (
            <>
                <Text bold backgroundColor={color} color={color ? "inverseText" : undefined}>
                    {agentType}
                </Text>
                {description && (
                    <>
                        " ("
                        <Text backgroundColor={descriptionColor} color={descriptionColor ? "inverseText" : undefined}>
                            {description}
                        </Text>
                        ")"
                    </>
                )}
            </>
        );

    // Metrics
    let metrics = !isBackgroundDone && (
        <>
            " · " {toolUseCount} " tool " {toolUseCount === 1 ? "use" : "uses"}
            {tokens !== null && (
                <>
                    " · " {formatTokens(tokens)} " tokens"
                </>
            )}
        </>
    );

    return (
        <Box flexDirection="column">
            <Box paddingLeft={3}>
                <Text dimColor={!isResolved}>
                    {prefix} {agentBadge} {metrics}
                </Text>
            </Box>
            <Box paddingLeft={3} flexDirection="row">
                <Text dimColor={!isResolved}>{isLast ? " " : "│"}</Text>
                <Text dimColor>{statusText}</Text>
            </Box>
        </Box>
    );
}

// Mapping: Vc4→AgentStatusComponent, K→agentType, Y→description, w→toolUseCount, O→tokens, $→color, j→isResolved, J→isAsync
```

### Status Icons and Colors

| Status | Icon | Animation | Color | ANSI Code |
|--------|------|-----------|-------|-----------|
| `pending` | ○ | None | Dim/Gray | `\x1b[2m` |
| `running` | ◐ | Spinner | Yellow | `\x1b[33m` |
| `completed` | ✓ | None | Green | `\x1b[32m` |
| `failed` | ✗ | None | Red | `\x1b[31m` |
| `killed` | ○ | None | Dim/Gray | `\x1b[2m` |

### Agent Type Badges

```javascript
// Agent type color mapping
const AGENT_COLORS = {
    "general-purpose": null,      // Default (no color)
    "explore": "blue",            // Code exploration
    "plan": "magenta",            // Planning agent
    "statusline-setup": "orange", // Status line config
    "claude-code-guide": "cyan"   // Help/docs agent
};

// Badge format: [agentType] or just text if default
function formatAgentType(agentType, color) {
    if (color) {
        return `\x1b[${colorToAnsi(color)}m[${agentType}]\x1b[0m`;
    }
    return agentType;
}
```

---

## Component 2: Status Line Indicator

### States

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STATUS LINE STATES                                   │
└─────────────────────────────────────────────────────────────────────────────┘

Idle (no tasks):
┌─────────────────────────────────────────────────────────────────────────────┐
│ sonnet-4 │ /project │ $                                                      │
└─────────────────────────────────────────────────────────────────────────────┘

1 running:
┌─────────────────────────────────────────────────────────────────────────────┐
│ sonnet-4 │ /project │ 1 running ● Ctrl+F stop │ $                            │
└─────────────────────────────────────────────────────────────────────────────┘

Multiple running:
┌─────────────────────────────────────────────────────────────────────────────┐
│ sonnet-4 │ /project │ 3 running ● Ctrl+F stop │ $                            │
└─────────────────────────────────────────────────────────────────────────────┘

Ctrl+F confirmation:
┌─────────────────────────────────────────────────────────────────────────────┐
│ sonnet-4 │ /project │ Press Ctrl+F to stop 3 agents │ $                      │
└─────────────────────────────────────────────────────────────────────────────┘

Killing:
┌─────────────────────────────────────────────────────────────────────────────┐
│ sonnet-4 │ /project │ Stopping 3 agents... │ $                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementation

```javascript
// ============================================
// Status line update function
// ============================================

function updateStatusLineIndicator(appState) {
    // Get all running local_agent tasks
    let runningTasks = Object.values(appState.tasks)
        .filter(task => task.type === "local_agent" && task.status === "running");

    let count = runningTasks.length;

    if (count === 0) {
        statusLine.clearBackgroundIndicator();
    } else {
        statusLine.setBackgroundIndicator({
            text: `${count} running ●`,
            hint: "Ctrl+F stop",
            color: "yellow"
        });
    }
}
```

---

## Component 3: Notification System

### Notification Types

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NOTIFICATION TYPES                                   │
└─────────────────────────────────────────────────────────────────────────────┘

Task Completed:
┌─────────────────────────────────────────────────────────────────────────────┐
│ ✓ Background agent "Search codebase" completed                              │
│   tools: 5  tokens: 12.5k  duration: 45s                                   │
└─────────────────────────────────────────────────────────────────────────────┘

Task Failed:
┌─────────────────────────────────────────────────────────────────────────────┐
│ ✗ Background agent "Run tests" failed                                       │
│   Error: Test suite exited with code 1                                     │
└─────────────────────────────────────────────────────────────────────────────┘

Task Killed:
┌─────────────────────────────────────────────────────────────────────────────┐
│ ○ Background agent "Deploy" stopped by user                                 │
│   Partial results available in output file                                  │
└─────────────────────────────────────────────────────────────────────────────┘

Multiple Killed:
┌─────────────────────────────────────────────────────────────────────────────┐
│ ○ 3 background agents were stopped by the user                              │
│   "task-1", "task-2", "task-3"                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Notification Injection

```javascript
// ============================================
// Notification injection into system reminder
// Location: chunks.146.mjs (conceptual)
// ============================================

function createTaskNotification(task) {
    let icon = getStatusIcon(task.status);
    let color = getStatusColor(task.status);

    return {
        type: "notification",
        subtype: "task_status",
        taskId: task.id,
        status: task.status,
        description: task.description,
        color: color,
        icon: icon,
        metrics: {
            tools: task.progress?.toolUseCount ?? 0,
            tokens: task.progress?.tokenCount ?? 0,
            duration: task.endTime ? task.endTime - task.startTime : 0
        }
    };
}

function getStatusIcon(status) {
    switch (status) {
        case "completed": return "✓";
        case "failed": return "✗";
        case "killed": return "○";
        case "running": return "◐";
        default: return "○";
    }
}

function getStatusColor(status) {
    switch (status) {
        case "completed": return "green";
        case "failed": return "red";
        case "killed": return "gray";
        case "running": return "yellow";
        default: return "gray";
    }
}
```

---

## Component 4: Keyboard Shortcuts

### Ctrl+F Kill All

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CTRL+F KILL ALL FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

User presses Ctrl+F
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Check: Are there running background agents?                                  │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
┌───────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ No agents     │      │ First press     │      │ Second press    │
│ running       │      │ (confirmation)  │      │ (execute kill)  │
└───────┬───────┘      └────────┬────────┘      └────────┬────────┘
        │                       │                        │
        ▼                       ▼                        ▼
┌───────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ No action     │      │ Show "Press     │      │ killAllLocal    │
│               │      │ Ctrl+F again"   │      │ Agents(U4q)     │
└───────────────┘      └─────────────────┘      └────────┬────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │ Show "3 agents  │
                                                │ stopped"        │
                                                └─────────────────┘
```

### Implementation

```javascript
// ============================================
// Ctrl+F handler for killing all background agents
// ============================================

let ctrlFPressed = false;
let ctrlFTimer = null;

function handleCtrlF(appState, setAppState) {
    let runningTasks = Object.values(appState.tasks)
        .filter(t => t.type === "local_agent" && t.status === "running");

    if (runningTasks.length === 0) {
        // No agents running, ignore
        return;
    }

    if (!ctrlFPressed) {
        // First press - show confirmation
        ctrlFPressed = true;
        statusLine.showConfirmation("Press Ctrl+F again to stop agents");

        // Reset after 2 seconds
        ctrlFTimer = setTimeout(() => {
            ctrlFPressed = false;
            statusLine.clearConfirmation();
        }, 2000);
    } else {
        // Second press - kill all
        clearTimeout(ctrlFTimer);
        ctrlFPressed = false;

        killAllLocalAgents(appState.tasks, setAppState);
        showNotification(`${runningTasks.length} background agents stopped`);
    }
}

// ============================================
// U4q - killAllLocalAgents
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
        // Only kill running local_agent tasks
        if (task.type === "local_agent" && task.status === "running") {
            triggerAbortSignal(taskId, setAppState);
        }
    }
}

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, K→taskId, Y→task, x66→triggerAbortSignal
```

---

## Component 5: Task List Modal (/tasks)

### Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TASK LIST MODAL                                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ Background Tasks                                              [x close] ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  Running Tasks:                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ ◐ a7x9k2m3  Search codebase for auth...   tools:5  tokens:12k    [x]   ││
│  │ ◐ b3p8n1q5  Run tests in background        tools:3  tokens:8k     [x]   ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  Recently Completed:                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ ✓ a2m5k9t3  Analyze performance            tools:8  tokens:45k          ││
│  │ ✗ a9w2j7l4  Deploy to staging              failed: timeout             ││
│  │ ○ a6k1n8p3  Generate documentation         stopped by user             ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ [x: stop selected] [f: foreground] [Enter: view output] [Esc: close]    ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `↑` / `k` | Move selection up |
| `↓` / `j` | Move selection down |
| `x` | Stop selected task |
| `f` | Bring task to foreground (if running) |
| `Enter` | View task output |
| `Esc` | Close modal |

---

## System Reminder Integration

### Task Status Attachment

```javascript
// ============================================
// Task status attachment in system reminder
// Location: chunks.147.mjs:1033
// ============================================

async function getUnifiedTasksAttachment(toolUseContext) {
    let appState = toolUseContext.getAppState();

    // Poll output files for delta content
    let {
        attachments,
        updatedTaskOffsets,
        evictedTaskIds
    } = await pollTaskOutputs(appState);

    // Update task state
    updateTaskState(toolUseContext.setAppState, updatedTaskOffsets, evictedTaskIds);

    // Build attachments for LLM
    return attachments.map(attachment => ({
        type: "task_status",
        taskId: attachment.taskId,
        taskType: attachment.taskType,
        status: attachment.status,
        description: attachment.description,
        deltaSummary: attachment.deltaSummary
    }));
}
```

### Attachment Format for LLM

```xml
<task_status>
  <task id="a7x9k2m3" type="local_agent" status="running">
    <description>Search codebase for authentication patterns</description>
    <progress tools="5" tokens="12543" />
    <summary>Found 12 authentication patterns in auth/ directory...</summary>
  </task>
</task_status>
```

---

## Key Design Decisions

### Decision 1: Two-Step Ctrl+F Kill

**Why**: Prevent accidental killing of background agents.

**Implementation**:
1. First Ctrl+F shows confirmation message
2. Second Ctrl+F within 2 seconds executes kill
3. Timeout resets confirmation state

### Decision 2: Task Status in System Reminders

**Why**: LLM needs to know about running background tasks without blocking.

**Implementation**:
- Poll output files each turn
- Inject task status as attachment
- LLM sees running tasks in context

### Decision 3: Notification Persistence

**Why**: User may not be watching terminal when task completes.

**Implementation**:
- Notifications shown briefly in notification area
- Task status persists in state until user notified
- Task removed from state after notification acknowledged

### Decision 4: Tree-Style Indentation

**Why**: Show hierarchy of nested subagents.

**Implementation**:
- Use `├─` for intermediate items
- Use `└─` for last item
- Use `│` for continuation lines
- DimColor for resolved items

---

## Color Scheme

### ANSI Color Codes

| Color | Foreground | Background |
|-------|------------|------------|
| Red | `\x1b[31m` | `\x1b[41m` |
| Green | `\x1b[32m` | `\x1b[42m` |
| Yellow | `\x1b[33m` | `\x1b[43m` |
| Blue | `\x1b[34m` | `\x1b[44m` |
| Magenta | `\x1b[35m` | `\x1b[45m` |
| Cyan | `\x1b[36m` | `\x1b[46m` |
| White | `\x1b[37m` | `\x1b[47m` |
| Dim | `\x1b[2m` | - |
| Bold | `\x1b[1m` | - |
| Reset | `\x1b[0m` | - |

---

## Related Documents

- [agent_tool_complete_source_v4.md](./agent_tool_complete_source_v4.md) - AgentTool
- [task_lifecycle_complete_source_v7.md](../26_background_agents/task_lifecycle_complete_source_v7.md) - Task lifecycle
- [system_reminder_integration_complete_v10.md](./system_reminder_integration_complete_v10.md) - System reminder integration
- [key_algorithms_deep_dive_v10.md](./key_algorithms_deep_dive_v10.md) - Algorithm analysis

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - All UI components documented with visual mockups and source code