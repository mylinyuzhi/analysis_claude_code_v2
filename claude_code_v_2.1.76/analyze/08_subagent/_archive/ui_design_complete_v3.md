# UI Design Complete V3 - Subagent & Background Agents (Claude Code 2.1.76)

> Complete UI design documentation for subagent and background agent interactions including visual mockups, keyboard shortcuts, status indicators, and notification system.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified_v3.md](../08_subagent/cross_validation_unified_v3.md) - Unified symbol verification

Key functions in this document:
- `U4q` - killAllLocalAgents — `chunks.146.mjs:2029`
- `x66` - triggerAbortSignal — `chunks.146.mjs:2012`
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

After Ctrl+F (killing):
┌─────────────────────────────────────────────────────────────────────────────┐
│ sonnet-4 │ /project │ Stopping 3 agents... │ $                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component 3: Task List Modal

### Triggered by `/tasks` Command

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
| `↑` / `↓` | Navigate between tasks |
| `x` | Stop selected task |
| `f` | Bring selected task to foreground |
| `Enter` | View task output |
| `Esc` | Close modal |
| `Ctrl+F` | Kill all running tasks |

---

## Component 4: Notification System

### Toast Notifications

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NOTIFICATION TYPES                                   │
└─────────────────────────────────────────────────────────────────────────────┘

Task Started:
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ ◐ Background agent started                                               │ │
│ │   "Search codebase for authentication patterns"                          │ │
│ │   View with /tasks                                                       │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘

Task Completed:
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ ✓ Background agent completed                                             │ │
│ │   "Search codebase for authentication patterns"                          │ │
│ │   Duration: 45s  Tools: 5  Tokens: 12.5k                                 │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘

Task Failed:
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ ✗ Background agent failed                                                │ │
│ │   "Deploy to staging"                                                    │ │
│ │   Error: Timeout after 60 seconds                                        │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘

Task Killed:
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ ○ Background agent stopped                                               │ │
│ │   "Run long tests"                                                       │ │
│ │   Partial results available in output file                               │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component 5: Progress Indicators

### Inline Progress

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         INLINE PROGRESS                                      │
└─────────────────────────────────────────────────────────────────────────────┘

During Tool Execution:
┌─────────────────────────────────────────────────────────────────────────────┐
│ └─ ◐ general-purpose                                                        │
│    "Searching codebase for authentication patterns"                         │
│    ┌─────────────────────────────────────────────────────────────────────┐  │
│    │ ◐ Running: Grep "auth" in src/...                                    │  │
│    │   tools: 3  tokens: 4.2k  elapsed: 12s                               │  │
│    └─────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘

Streaming Output:
┌─────────────────────────────────────────────────────────────────────────────┐
│ └─ ◐ general-purpose                                                        │
│    "Running tests in background"                                            │
│    ┌─────────────────────────────────────────────────────────────────────┐  │
│    │ PASS src/auth/login.test.ts                                          │  │
│    │ PASS src/auth/register.test.ts                                       │  │
│    │ ◐ Running src/auth/oauth.test.ts...                                  │  │
│    │   tests: 2/5  passed: 2  failed: 0                                   │  │
│    └─────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component 6: Keyboard Shortcuts

### Global Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `Ctrl+C` | Stop current operation | When agent is running |
| `Ctrl+F` | Kill all background agents | When background agents exist |
| `Ctrl+D` | Exit CLI | Idle state |

### Kill Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         KILL FLOW (Ctrl+F)                                   │
└─────────────────────────────────────────────────────────────────────────────┘

User presses Ctrl+F
        │
        ▼
Check if background agents exist?
        │
        ├─── NO → Ignore
        │
        └─── YES
             │
             ▼
        Show confirmation:
        "Press Ctrl+F to stop 3 agents"
             │
             ├─── User presses Ctrl+F again
             │        │
             │        ▼
             │    Call killAllLocalAgents (U4q)
             │        │
             │        ▼
             │    For each task:
             │        triggerAbortSignal (x66)
             │        │
             │        ├─── Abort AbortController
             │        ├─── Unregister cleanup
             │        ├─── Set status "killed"
             │        └─── Flush output buffer
             │
             └─── Timeout (2s) → Hide confirmation
```

---

## UI State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         UI STATE MACHINE                                     │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────┐
                    │   IDLE      │
                    │ (no tasks)  │
                    └──────┬──────┘
                           │
          Task created     │
          ┌────────────────┘
          │
          ▼
    ┌─────────────┐
    │  RUNNING    │◄─────────────┐
    │ (active)    │              │
    └──────┬──────┘              │
           │                     │
    ┌──────┴──────┐              │
    │             │              │
    ▼             ▼              │
┌───────┐   ┌─────────┐         │
│SUCCESS│   │ STOPPED │         │
│       │   │ (user)  │         │
└───┬───┘   └────┬────┘         │
    │            │              │
    │            └──────────────┘
    │               (if restarted)
    ▼
┌─────────────┐
│  NOTIFIED   │
│ (toast shown)│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  REMOVED    │
│ (from state)│
└─────────────┘
```

---

## Implementation Notes

### Status Line Update

The status line is updated via the `setAppState` callback:

```javascript
// Update status line with running count
function updateStatusLine(appState) {
    let runningCount = Object.values(appState.tasks)
        .filter(t => t.type === "local_agent" && t.status === "running")
        .length;

    if (runningCount > 0) {
        statusLine.setIndicator({
            text: `${runningCount} running ●`,
            hint: "Ctrl+C stop"
        });
    } else {
        statusLine.clearIndicator();
    }
}
```

### Notification Trigger

Notifications are triggered by state transitions:

```javascript
// In markTaskCompleted, markTaskFailed, etc.
function showTaskNotification(task) {
    let notification = {
        type: task.status === "completed" ? "success" :
              task.status === "failed" ? "error" : "info",
        title: `Background agent ${task.status}`,
        message: task.description,
        details: task.result?.summary ?? task.error
    };

    showNotification(notification);
}
```

---

## Key Insight

The UI design follows a **progressive disclosure** pattern:

1. **Status line** - Minimal info, always visible
2. **Inline status** - More detail in conversation
3. **Task list** - Full overview on demand
4. **Output file** - Complete results when needed

This ensures users can quickly see what's happening without being overwhelmed, while still having access to full details when required.

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - Full UI design with mockups and keyboard shortcuts