# UI Components Mockups - Subagent & Background Agents (Claude Code 2.1.76)

> Complete UI design documentation including component mockups, keyboard shortcuts, interaction flows, and status indicators for subagent and background agent systems.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified.md](./cross_validation_unified.md) - Unified symbol verification

Key UI-related functions:
- `U4q` - killAllLocalAgents — `chunks.146.mjs:2029`
- `d4q` - markTaskKilled — `chunks.146.mjs:2034`
- `Kb1` - getSortedRunningTeammates — `chunks.193.mjs:2681`
- `Fuq` - TeammateKeyboardHandler — `chunks.193.mjs:2685`
- `w0` - showNotification — `Multiple files`

---

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              TUI Application                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                          MessageArea                                  │    │
│  │                                                                       │    │
│  │  ┌───────────────────────────────────────────────────────────────┐  │    │
│  │  │ AssistantMessage                                               │  │    │
│  │  │                                                                │  │    │
│  │  │  ┌─────────────────────────────────────────────────────────┐  │  │    │
│  │  │  │ ToolUseContent (type: "tool_use", name: "Agent")        │  │  │    │
│  │  │  │                                                          │  │  │    │
│  │  │  │  ┌────────────────────────────────────────────────────┐ │  │  │    │
│  │  │  │  │ AgentStatusComponent (Vc4)                         │ │  │  │    │
│  │  │  │  │                                                     │ │  │  │    │
│  │  │  │  │  ├─ TreePrefix ("├─" / "└─")                       │ │  │  │    │
│  │  │  │  │  ├─ AgentTypeBadge (color from agentDefinition)    │ │  │  │    │
│  │  │  │  │  ├─ Description (from AgentTool call)              │ │  │  │    │
│  │  │  │  │  ├─ Stats (toolUseCount, tokens)                   │ │  │  │    │
│  │  │  │  │  └─ StatusIndicator (running/completed/failed)     │ │  │  │    │
│  │  │  │  └────────────────────────────────────────────────────┘ │  │  │    │
│  │  │  └─────────────────────────────────────────────────────────┘  │  │    │
│  │  └───────────────────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                          StatusLine (Footer)                         │    │
│  │                                                                       │    │
│  │  ┌───────────────────────────────────────────────────────────────┐  │    │
│  │  │ BackgroundAgentIndicator                                      │  │    │
│  │  │                                                                │  │    │
│  │  │  • Running agent count: "2 running"                           │  │    │
│  │  │  • Kill hint: "Ctrl+F to cancel"                              │  │    │
│  │  │  • Interactive: triggers kill confirmation                    │  │    │
│  │  │                                                                │  │    │
│  │  └───────────────────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                       NotificationArea                               │    │
│  │                                                                       │    │
│  │  ┌───────────────────────────────────────────────────────────────┐  │    │
│  │  │ TaskNotification (mode: "task-notification")                  │  │    │
│  │  │                                                                │  │    │
│  │  │  "Background agent 'search-codebase' completed a task:"      │  │    │
│  │  │  • status: completed                                          │  │    │
│  │  │  • result: <task_output>                                      │  │    │
│  │  │                                                                │  │    │
│  │  └───────────────────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component 1: AgentStatusComponent

### Purpose
Displays inline status for each Agent tool use within the message area.

### Mockup

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Tool Use: Agent                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ├─ [search-agent] Search codebase for auth patterns                    │
│  │   ◐ Running... tools: 5, tokens: 12.5k                               │
│  │   └─ Reading src/auth/login.ts...                                    │
│                                                                          │
│  ├─ [general-purpose] Analyze API endpoints                             │
│  │   ✓ Completed in 45.2s, 23 tool uses, 45.2k tokens                   │
│  │   └─ Result: Found 12 endpoints requiring authentication             │
│                                                                          │
│  └─ [test-runner] Run integration tests                                 │
│      ✗ Failed after 12.3s                                               │
│      └─ Error: Connection refused to localhost:5432                     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Status Indicators

| Status | Icon | Color | Description |
|--------|------|-------|-------------|
| running | ◐ | Yellow/Animated | Task in progress |
| completed | ✓ | Green | Successfully finished |
| failed | ✗ | Red | Error occurred |
| killed | ○ | Gray | User cancelled |
| pending | ◷ | Blue | Queued, not started |

### Component Props

```typescript
interface AgentStatusComponentProps {
    // Agent identification
    agentType: string;           // "search-agent", "general-purpose", etc.
    description: string;         // Task description

    // Status
    status: "running" | "completed" | "failed" | "killed" | "pending";

    // Progress (for running)
    toolUseCount?: number;
    tokenCount?: number;
    currentActivity?: string;    // Current file/operation

    // Result (for completed)
    result?: string;
    duration?: number;           // milliseconds

    // Error (for failed)
    error?: string;

    // Styling
    color?: string;              // Agent color from definition
    isLastInTree: boolean;       // For tree prefix (├─ vs └─)
}
```

---

## Component 2: BackgroundAgentIndicator

### Purpose
Footer status indicator showing running background agents with kill capability.

### Mockup

```
┌─────────────────────────────────────────────────────────────────────────┐
│ StatusLine                                                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [Mode: default] [Model: sonnet] │ 2 running │ Ctrl+F to stop           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼ User presses Ctrl+F
┌─────────────────────────────────────────────────────────────────────────┐
│ StatusLine (Confirmation Mode)                                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ⚠ Press Ctrl+F again within 3s to stop background agents               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Behavior

```javascript
// ============================================
// Background Agent Kill Flow
// Location: chunks.193.mjs:2629-2656
// ============================================

// State machine:
// 1. No agents running → No indicator
// 2. Agents running → "N running | Ctrl+F to stop"
// 3. Ctrl+F pressed → Show confirmation (3s timeout)
// 4. Ctrl+F pressed again → Execute killAllLocalAgents

const KILL_CONFIRM_TIMEOUT = 3000; // ms

// Keyboard handler
function handleKillAgents() {
    if (lastPressTime && Date.now() - lastPressTime <= KILL_CONFIRM_TIMEOUT) {
        // Second press - execute kill
        killAllLocalAgents(tasks, setAppState);

        // Mark each as killed
        for (let [taskId, task] of Object.entries(tasks)) {
            if (task.type === "local_agent" && task.status === "running") {
                markTaskKilled(taskId, setAppState);
            }
        }

        // Show notification
        showNotification({
            value: `${killedCount} background agents were stopped by the user`,
            mode: "task-notification"
        });
    } else {
        // First press - show confirmation
        lastPressTime = Date.now();
        addNotification({
            key: "kill-agents-confirm",
            text: "Press ctrl+f again to stop background agents",
            priority: "immediate",
            timeoutMs: KILL_CONFIRM_TIMEOUT
        });
    }
}
```

---

## Component 3: TaskNotification

### Purpose
Display task completion/failure/killed notifications in the notification area.

### Mockup - Completed

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Task Completed                                                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  A background agent completed a task:                                    │
│                                                                          │
│  Task: "Search codebase for auth patterns"                               │
│  Type: search-agent                                                      │
│  Status: completed                                                       │
│                                                                          │
│  Result:                                                                 │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ Found authentication patterns in:                                │    │
│  │ - src/auth/login.ts (OAuth2 implementation)                     │    │
│  │ - src/middleware/auth.ts (JWT validation)                       │    │
│  │ - src/api/routes/protected.ts (Bearer token check)              │    │
│  │                                                                  │    │
│  │ Recommendation: Consolidate auth logic into single module       │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  Stats: 15 tools, 23.4k tokens, 32.1s duration                          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Mockup - Failed

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Task Failed                                                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  A background agent failed:                                              │
│                                                                          │
│  Task: "Run integration tests"                                           │
│  Type: test-runner                                                       │
│  Status: failed                                                          │
│                                                                          │
│  Error:                                                                  │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ Error: Connection refused                                        │    │
│  │ at TCPConnectWrap.afterConnect (net.js:1141:16)                 │    │
│  │                                                                  │    │
│  │ Could not connect to database at localhost:5432                 │    │
│  │ Ensure PostgreSQL is running before executing tests.            │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  Partial output saved to: .claude/tasks/b3h5j8n1.output                 │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Mockup - Killed

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Task Killed                                                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Background agent "analyze-api" was stopped by the user.                │
│                                                                          │
│  Task: "Analyze API endpoints"                                           │
│  Type: general-purpose                                                   │
│  Status: killed                                                          │
│                                                                          │
│  Partial results:                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ Processed 8 of 15 endpoints before cancellation:                │    │
│  │ - GET /api/users (authenticated)                                │    │
│  │ - POST /api/users (admin only)                                  │    │
│  │ - GET /api/posts (public)                                       │    │
│  │ ...                                                              │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  Output saved to: .claude/tasks/a7x9k2m3.output                         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Component 4: TeammatePane (In-Process Teammates)

### Purpose
Split-pane view for in-process teammates with mailbox communication.

### Mockup - Split Pane View

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Main Conversation                     │ Teammate: code-reviewer          │
│                                       │                                  │
│  User: Review the auth module         │  [◐ Running] Reviewing...        │
│                                       │                                  │
│  Assistant: I'll spawn a teammate     │  Current file: src/auth/login.ts │
│  to review the auth module...         │                                  │
│                                       │  Progress:                        │
│                                       │  ├─ ✓ Check OAuth implementation │
│  ┌───────────────────────────────┐   │  ├─ ✓ Review JWT handling        │
│  │ Mailbox (from: architect)     │   │  ◐ Check token refresh          │
│  │                               │   │  ○ Review error handling        │
│  │ "Focus on security            │   │                                  │
│  │  vulnerabilities in the       │   │  ┌────────────────────────────┐ │
│  │  token validation logic"      │   │  │ Mailbox                    │ │
│  └───────────────────────────────┘   │  │ From: architect            │ │
│                                       │  │ "Check for timing attacks  │ │
│                                       │  │ in the token comparison"   │ │
│                                       │  └────────────────────────────┘ │
│                                       │                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Keyboard Navigation

| Key | Action | Context |
|-----|--------|---------|
| `Shift+↑` | Enter teammate selection mode | Agents running |
| `Shift+↓` | Navigate down in teammate list | Selection mode |
| `f` | Foreground selected teammate | Selection mode |
| `Enter` | View selected teammate details | Selection mode |
| `Esc` | Exit selection mode | Selection mode |

---

## Keyboard Shortcuts Complete

### Global Shortcuts

| Shortcut | Action | Context | Source |
|----------|--------|---------|--------|
| `Ctrl+C` (once) | Show kill confirmation | Agents running | Key handler |
| `Ctrl+F` (confirm) | Execute kill all | After Ctrl+C | Key handler |
| `/tasks` | Open task list modal | Always | Slash command |
| `Ctrl+B` | Background running command | During Bash | Key handler |

### Task List Modal Shortcuts

| Key | Action | Context |
|-----|--------|---------|
| `↑` / `k` | Move up | In list |
| `↓` / `j` | Move down | In list |
| `x` | Kill selected | Running task |
| `f` | Foreground | Teammate task |
| `Enter` | View details | Any task |
| `Esc` | Close modal | Modal open |

### Teammate Navigation

| Key | Action | Context |
|-----|--------|---------|
| `Shift+↑` | Enter teammate mode / Move up | Running teammates |
| `Shift+↓` | Move down in teammate list | Teammate mode |
| `f` | Foreground selected teammate | Selection mode |
| `Esc` | Cancel teammate action | Selection mode |

---

## Interaction Flow Diagrams

### Flow 1: Background Agent Kill

```
User presses Ctrl+F
        │
        ▼
┌───────────────────────────────────────────┐
│ Check: Any local_agent running?           │
│   Object.values(tasks).some(              │
│     t => t.type === "local_agent" &&      │
│          t.status === "running"           │
│   )                                       │
└─────────────────────┬──────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼ No                        ▼ Yes
┌─────────────────┐         ┌─────────────────────────────────────┐
│ No action       │         │ First press: Show confirmation      │
│ (no agents)     │         │ "Press Ctrl+F again to stop agents" │
└─────────────────┘         │ timeout: 3000ms                      │
                            └──────────────────┬──────────────────┘
                                               │
                                 ┌─────────────┴─────────────┐
                                 │                           │
                                 ▼ Timeout                   ▼ Ctrl+F (within 3s)
                         ┌─────────────────┐         ┌─────────────────────────────┐
                         │ Hide            │         │ Execute killAllLocalAgents  │
                         │ confirmation    │         │                             │
                         └─────────────────┘         │ For each killed task:       │
                                                     │   1. triggerAbortSignal     │
                                                     │   2. markTaskKilled         │
                                                     │   3. flushOutputBuffer      │
                                                     │                             │
                                                     │ Show notification:          │
                                                     │ "N background agents were   │
                                                     │  stopped by the user"       │
                                                     └─────────────────────────────┘
```

### Flow 2: Task Creation (Background)

```
AgentTool.call({ run_in_background: true })
        │
        ▼
┌───────────────────────────────────────────┐
│ createBackgroundAgentTask (Qn4)           │
├───────────────────────────────────────────┤
│                                           │
│  1. Generate task ID (oV)                 │
│     → "a7x9k2m3"                          │
│                                           │
│  2. Initialize output file (Co)           │
│     → .claude/tasks/a7x9k2m3.output       │
│                                           │
│  3. Create abort controller               │
│     → Linked to parent if provided        │
│                                           │
│  4. Build task record                     │
│     → { status: "running", ... }          │
│                                           │
│  5. Register cleanup handler (E4)         │
│     → Cleanup on process exit             │
│                                           │
│  6. Register in state (Zf)                │
│     → appState.tasks[taskId] = task       │
│                                           │
│  7. Send telemetry (c36)                  │
│     → { subtype: "task_started", ... }    │
│                                           │
└─────────────────────┬─────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────┐
│ Return to caller                          │
├───────────────────────────────────────────┤
│                                           │
│  {                                        │
│    status: "async_launched",              │
│    agentId: "a7x9k2m3",                   │
│    outputFile: ".claude/tasks/...",       │
│    description: "Search codebase..."      │
│  }                                        │
│                                           │
└───────────────────────────────────────────┘
```

### Flow 3: Task Completion

```
Agent finishes execution
        │
        ▼
┌───────────────────────────────────────────┐
│ markTaskCompleted ($m8)                   │
├───────────────────────────────────────────┤
│                                           │
│  Input: result object                     │
│    {                                      │
│      agentId: "a7x9k2m3",                 │
│      content: [...],                      │
│      totalTokens: 23456,                  │
│      totalToolUseCount: 15                │
│    }                                      │
│                                           │
│  1. atomicUpdateTask (i9)                 │
│     → Set status: "completed"             │
│     → Set result                          │
│     → Set endTime                         │
│     → Clear abortController               │
│                                           │
│  2. Unregister cleanup handler            │
│                                           │
│  3. flushOutputBuffer ($O)                │
│     → Ensure all output written           │
│                                           │
└─────────────────────┬─────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────┐
│ System Reminder Injection                 │
├───────────────────────────────────────────┤
│                                           │
│  On next LLM turn:                        │
│                                           │
│  getUnifiedTasksAttachment (suY)          │
│    → pollTaskOutputs (wY4)                │
│    → Read output deltas                   │
│    → Build task_status attachment         │
│                                           │
│  Inject into system-reminder:             │
│                                           │
│  <task_status                             │
│    taskId="a7x9k2m3"                      │
│    status="completed"                     │
│    description="Search codebase..."       │
│  >                                        │
│    Result content...                      │
│  </task_status>                           │
│                                           │
└─────────────────────┬─────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────┐
│ UI Notification                           │
├───────────────────────────────────────────┤
│                                           │
│  showNotification (w0)                    │
│    → mode: "task-notification"            │
│    → value: "Background agent completed"  │
│                                           │
└───────────────────────────────────────────┘
```

---

## CSS/Styling Reference

### Status Colors

```css
/* Status indicator colors */
.status-running { color: #FFC107; }    /* Yellow/Amber */
.status-completed { color: #4CAF50; }  /* Green */
.status-failed { color: #F44336; }     /* Red */
.status-killed { color: #9E9E9E; }     /* Gray */
.status-pending { color: #2196F3; }    /* Blue */

/* Agent type badges */
.badge-search-agent { background: #E3F2FD; color: #1565C0; }
.badge-general-purpose { background: #F3E5F5; color: #7B1FA2; }
.badge-test-runner { background: #FFF3E0; color: #E65100; }
```

### Animation

```css
/* Running indicator animation */
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.status-running {
    animation: pulse 1.5s ease-in-out infinite;
}
```

---

## Notification Priority

| Priority | Use Case | Timeout |
|----------|----------|---------|
| `immediate` | Kill confirmation | 3000ms |
| `normal` | Task completion | Auto-dismiss |
| `low` | Progress updates | Replaced |

---

## Related Documents

- [ui_interaction_complete.md](./ui_interaction_complete.md) - UI interaction details
- [keyboard_shortcuts_complete.md](./keyboard_shortcuts_complete.md) - Keyboard shortcuts
- [notification_system_complete.md](./notification_system_complete.md) - Notification system

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - UI mockups and flows documented