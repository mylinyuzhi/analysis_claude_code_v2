# UI Design Complete V2 - Subagent & Background Agents (Claude Code 2.1.76)

> Complete UI design documentation for subagent and background agent interactions including visual mockups, keyboard shortcuts, status indicators, and notification system.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified.md](../08_subagent/cross_validation_unified.md) - Unified symbol verification

Key functions in this document:
- `U4q` - killAllLocalAgents — `chunks.146.mjs:2029`
- `x66` - triggerAbortSignal — `chunks.146.mjs:2012`
- `w0` - showNotification — Multiple files
- `nl4` - updateTaskProgressWithTelemetry — `chunks.146.mjs:2059`

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
│  │  Model: claude-sonnet-4 │ CWD: /project │ 2 running ● Ctrl+C stop   │    │
│  │                          └──────────────────┘ └──────────────────┘  │    │
│  │                               background count    kill hint          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     TaskListModal (on /tasks)                        │    │
│  │                                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐│    │
│  │  │ Background Tasks                                                 ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  │                                                                       │    │
│  │  ◐ a7x9k2m3  Search codebase for auth...     tools:5  tokens:12k  x│    │
│  │  ◐ b3p8n1q5  Run tests in background         tools:3  tokens:8k   x│    │
│  │  ✓ a2m5k9t3  Analyze performance             tools:8  tokens:45k    │    │
│  │  ✗ a9w2j7l4  Deploy to staging               failed: timeout       │    │
│  │                                                                       │    │
│  │  [x: stop] [f: foreground] [Enter: view] [Esc: close]               │    │
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

## Component 1: Agent Status Component

### Visual Mockup

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

## Component 2: Status Line Integration

### Background Agent Indicator

**What it does:** Shows count of running background agents and kill hint in the footer.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STATUS LINE STATES                                   │
└─────────────────────────────────────────────────────────────────────────────┘

No background agents:
┌─────────────────────────────────────────────────────────────────────────────┐
│ sonnet-4 │ /project │ $                                                      │
└─────────────────────────────────────────────────────────────────────────────┘

1 background agent running:
┌─────────────────────────────────────────────────────────────────────────────┐
│ sonnet-4 │ /project │ 1 running ● Ctrl+C stop │ $                            │
│                        └──────┘   └─────────┘                                │
│                         count      kill hint                                  │
└─────────────────────────────────────────────────────────────────────────────┘

Multiple background agents running:
┌─────────────────────────────────────────────────────────────────────────────┐
│ sonnet-4 │ /project │ 3 running ● Ctrl+C stop │ $                            │
└─────────────────────────────────────────────────────────────────────────────┘

Kill confirmation shown:
┌─────────────────────────────────────────────────────────────────────────────┐
│ sonnet-4 │ /project │ Press Ctrl+F to stop 3 agents │ $                      │
│                         └────────────────────────────┘                       │
│                              confirmation prompt                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementation Details

```javascript
// ============================================
// Status Line Background Agent Indicator
// ============================================

function renderBackgroundAgentIndicator(tasks) {
    let runningAgents = Object.values(tasks).filter(
        task => task.type === "local_agent" && task.status === "running"
    );

    if (runningAgents.length === 0) {
        return null;  // No indicator
    }

    return {
        text: `${runningAgents.length} running`,
        icon: "●",
        hint: "Ctrl+C stop",
        color: "yellow"
    };
}

// Kill confirmation timeout
const KILL_CONFIRMATION_TIMEOUT_MS = 3000;

// State machine for kill confirmation
// idle → ctrl_c_pressed → waiting_confirmation → (timeout|ctrl_f) → (idle|killing)
```

---

## Component 3: Task List Modal

### Complete Modal Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TASK LIST MODAL                                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Background Tasks                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ ◐ a7x9k2m3  Search codebase for authentication patterns                 │ │
│ │    tools: 5  tokens: 12.3k  duration: 23s                              │ │
│ │    Reading src/auth/...                                                 │ │
│ │                                                              [x: stop]  │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ ◐ b3p8n1q5  Run tests in background                                     │ │
│ │    tools: 3  tokens: 8.1k  duration: 15s                               │ │
│ │    Running test suite...                                                │ │
│ │                                                              [x: stop]  │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ ◐ t5h7j2k9  Process data files (teammate)                              │ │
│ │    tools: 2  tokens: 3.4k  duration: 8s                                │ │
│ │    Processing batch 3/10...                                             │ │
│ │                                                    [x: stop] [f: fg]    │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ ✓ a2m5k9t3  Analyze performance                                         │ │
│ │    tools: 8  tokens: 45.2k  duration: 2m 15s                           │ │
│ │    Completed - found 3 bottlenecks                                      │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ ✗ a9w2j7l4  Deploy to staging                                           │ │
│ │    tools: 4  tokens: 6.7k  duration: 45s                               │ │
│ │    Failed: Connection timeout after 30s                                 │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ [x: stop] [f: foreground] [Enter: view details] [Esc: close]               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Keyboard Navigation

| Key | Action | Context |
|-----|--------|---------|
| `↑` / `k` | Move selection up | In list |
| `↓` / `j` | Move selection down | In list |
| `x` | Kill selected task | Running task |
| `f` | Foreground task | Teammate task |
| `Enter` | View task details | Any task |
| `Esc` | Close modal | Modal open |

### Action Availability Matrix

| Task Type | Status | Kill (`x`) | Foreground (`f`) | View (`Enter`) |
|-----------|--------|------------|------------------|----------------|
| `local_agent` | running | ✓ | ✗ | ✓ |
| `local_agent` | completed | ✗ | ✗ | ✓ |
| `local_agent` | failed | ✗ | ✗ | ✓ |
| `local_bash` | running | ✓ | ✗ | ✓ |
| `in_process_teammate` | running | ✓ | ✓ | ✓ |
| `remote_agent` | running | ✓ | ✗ | ✓ |

---

## Component 4: Notification System

### Notification Types and Display

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NOTIFICATION TYPES                                   │
└─────────────────────────────────────────────────────────────────────────────┘

Single Completion:
┌─────────────────────────────────────────────────────────────────────────────┐
│ Background agent "Search codebase" completed                                 │
│ tools: 5  tokens: 12.5k  duration: 45s                                      │
└─────────────────────────────────────────────────────────────────────────────┘

Multiple Completions (batched):
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2 background agents completed                                                │
└─────────────────────────────────────────────────────────────────────────────┘

Single Kill:
┌─────────────────────────────────────────────────────────────────────────────┐
│ Background agent "Search codebase" was stopped by the user                   │
│ Partial results may be available in output file                             │
└─────────────────────────────────────────────────────────────────────────────┘

Multiple Kills (batched):
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3 background agents were stopped by the user                                 │
└─────────────────────────────────────────────────────────────────────────────┘

Failure:
┌─────────────────────────────────────────────────────────────────────────────┐
│ Background agent "Deploy to staging" failed: Connection timeout              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Notification Structure

```javascript
// ============================================
// Notification Types
// ============================================

interface TaskNotification {
    value: string;           // Display text
    mode: "task-notification" | "error" | "warning";
}

// Task status attachment format (in system reminder)
interface TaskStatusAttachment {
    type: "task_status";
    taskId: string;
    taskType: string;
    status: "completed" | "failed" | "killed";
    description: string;
    deltaSummary?: string;  // Progress update
}

// Notification formatting
function formatTaskNotification(task, status) {
    if (status === "completed") {
        return {
            value: `Background agent "${task.description}" completed`,
            mode: "task-notification"
        };
    } else if (status === "killed") {
        return {
            value: `Background agent "${task.description}" was stopped by the user`,
            mode: "task-notification"
        };
    } else if (status === "failed") {
        return {
            value: `Background agent "${task.description}" failed: ${task.error}`,
            mode: "task-notification"
        };
    }
}
```

---

## Component 5: Kill Flow UI

### Kill Confirmation Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         KILL FLOW DIAGRAM                                    │
└─────────────────────────────────────────────────────────────────────────────┘

User presses Ctrl+C with running agents
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ Check: Any local_agent running?                                            │
│   Object.values(tasks).some(t => t.type === "local_agent" &&               │
│                                 t.status === "running")                    │
└─────────────────────────────┬─────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼ No                        ▼ Yes
    ┌───────────────────┐         ┌─────────────────────────────────────────┐
    │ Cancel stream     │         │ Show confirmation in status line:       │
    │ (normal Ctrl+C)   │         │ "Press Ctrl+F to stop 2 agents"         │
    └───────────────────┘         └───────────────────┬─────────────────────┘
                                                        │
                                          ┌─────────────┴─────────────┐
                                          │                           │
                                          ▼ Timeout (3s)             ▼ Ctrl+F
                                  ┌───────────────────┐         ┌─────────────────────────┐
                                  │ Revert to         │         │ Execute killAll:        │
                                  │ normal behavior   │         │ U4q(tasks, setAppState) │
                                  └───────────────────┘         │                         │
                                                                │ For each killed task:   │
                                                                │   d4q(id, setAppState)  │
                                                                │                          │
                                                                │ Show notification:       │
                                                                │   "2 agents stopped"     │
                                                                └─────────────────────────┘
```

### Kill Implementation

```javascript
// ============================================
// U4q - killAllLocalAgents - Kill all running agents
// Location: chunks.146.mjs:2029-2032
// ============================================

// ORIGINAL (for source lookup):
function U4q(A, q) {
    for (let [K, Y] of Object.entries(A))
        if (Y.type === "local_agent" && Y.status === "running") x66(K, q)
}

// READABLE (for understanding):
function killAllLocalAgents(tasks, setAppState) {
    // Iterate all tasks - Object.entries creates snapshot
    for (let [taskId, task] of Object.entries(tasks)) {
        // Filter: only local_agent type, only running
        if (task.type === "local_agent" && task.status === "running") {
            triggerAbortSignal(taskId, setAppState);
        }
    }
}
```

---

## Keyboard Shortcut Reference

### Global Shortcuts

| Shortcut | Action | Context | Implementation |
|----------|--------|---------|----------------|
| `Ctrl+C` (once) | Show kill confirmation | Agents running | Key handler |
| `Ctrl+C` (twice) | Normal stream cancel | No agents | Key handler |
| `Ctrl+F` (confirm) | Execute kill all | After Ctrl+C | Key handler |
| `/tasks` | Open task list modal | Always | Slash command |
| `Ctrl+B` | Background running command | During Bash | Key handler |

### Modal Shortcuts

| Key | Action | Context |
|-----|--------|---------|
| `↑` | Move up | In list |
| `k` | Move up (vim) | In list |
| `↓` | Move down | In list |
| `j` | Move down (vim) | In list |
| `x` | Kill selected | Running task |
| `f` | Foreground | Teammate |
| `Enter` | View details | Any task |
| `Esc` | Close modal | Modal open |

---

## Progress Display

### Progress Metrics

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PROGRESS DISPLAY                                     │
└─────────────────────────────────────────────────────────────────────────────┘

Running task with progress:
┌─────────────────────────────────────────────────────────────────────────────┐
│ ◐ a7x9k2m3  Search codebase for authentication patterns                     │
│    tools: 5  tokens: 12.3k  duration: 23s                                   │
│    Reading src/auth/login.ts...                                             │
└─────────────────────────────────────────────────────────────────────────────┘
           │         │           │               │
           │         │           │               └─ Latest action
           │         │           └─ Elapsed time
           │         └─ Token count
           └─ Tool use count

Progress update via nl4 (updateTaskProgressWithTelemetry):
┌─────────────────────────────────────────────────────────────────────────────┐
│ Task progress in system reminder:                                           │
│ <task_status taskId="a7x9k2m3" status="running">                            │
│   Searching codebase for authentication patterns                            │
│   tools: 5, tokens: 12.3k                                                   │
│   Reading src/auth/login.ts...                                              │
│ </task_status>                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | ✓ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✓ Verified |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100 | ✓ Verified |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117 | ✓ Verified |
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | ✓ Verified |
| `w0` | showNotification | Multiple | ✓ Verified |

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - UI design documented