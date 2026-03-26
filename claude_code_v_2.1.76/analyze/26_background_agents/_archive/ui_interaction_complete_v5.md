# UI Interaction Complete V5 (Claude Code 2.1.76)

> Complete UI interaction documentation for background agents including status line indicators, task list modal, notifications, and keyboard shortcuts.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_final.md](./cross_validation_final.md) - Background agent symbol verification

Key functions in this document:
- `U4q` - killAllLocalAgents — `chunks.146.mjs:2029`
- `x66` - triggerAbortSignal — `chunks.146.mjs:2012`
- `nl4` - updateTaskProgressWithTelemetry — `chunks.146.mjs:2059`

---

## UI Components Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BACKGROUND AGENT UI COMPONENTS                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. Status Line Indicator                                                     │
│    Shows count of running background agents                                  │
│    "3 running ● Ctrl+C stop"                                                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. Task List Modal (/tasks)                                                  │
│    Full list of running and recent tasks                                     │
│    Keyboard navigation for management                                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. Notification Toasts                                                       │
│    Pop-up notifications for task completion/failure                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. Progress Display                                                          │
│    Inline progress during task execution                                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component 1: Status Line Indicator

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
│ sonnet-4 │ /project │ 1 running ● Ctrl+C stop │ $                            │
└─────────────────────────────────────────────────────────────────────────────┘

Multiple running:
┌─────────────────────────────────────────────────────────────────────────────┐
│ sonnet-4 │ /project │ 3 running ● Ctrl+C stop │ $                            │
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
// Status line update function
function updateStatusLineIndicator(appState) {
    let runningTasks = Object.values(appState.tasks)
        .filter(task => task.type === "local_agent" && task.status === "running");

    let count = runningTasks.length;

    if (count === 0) {
        statusLine.clearBackgroundIndicator();
    } else {
        statusLine.setBackgroundIndicator({
            text: `${count} running ●`,
            hint: "Ctrl+C stop",
            color: "yellow"
        });
    }
}
```

---

## Component 2: Task List Modal

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
| `↑` / `k` | Move selection up |
| `↓` / `j` | Move selection down |
| `x` | Stop selected task |
| `f` | Bring selected task to foreground |
| `Enter` | View task output |
| `Esc` | Close modal |
| `q` | Close modal |
| `Ctrl+F` | Kill all running tasks |

### Task Status Icons

| Status | Icon | Color |
|--------|------|-------|
| `running` | ◐ | Yellow |
| `completed` | ✓ | Green |
| `failed` | ✗ | Red |
| `killed` | ○ | Gray |

---

## Component 3: Notification Toasts

### Types

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NOTIFICATION TYPES                                   │
└─────────────────────────────────────────────────────────────────────────────┘

Task Started:
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ ◐ Background agent started                                               │ │
│ │   "Search codebase for authentication patterns"                          │ │
│ │   Use /tasks to manage                                                   │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘

Task Completed (Success):
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ ✓ Background agent completed                                             │ │
│ │   "Search codebase for authentication patterns"                          │ │
│ │   Duration: 45s  |  Tools: 5  |  Tokens: 12.5k                           │ │
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

### Notification Timing

| Event | Delay | Duration |
|-------|-------|----------|
| Started | 0ms | 3s |
| Completed | 0ms | 5s |
| Failed | 0ms | 7s (longer for errors) |
| Killed | 0ms | 3s |

---

## Component 4: Progress Display

### Inline Progress

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         INLINE PROGRESS                                      │
└─────────────────────────────────────────────────────────────────────────────┘

During Tool Execution:
┌─────────────────────────────────────────────────────────────────────────────┐
│ └─ ◐ general-purpose [background]                                           │
│    "Running tests in background"                                            │
│    ┌─────────────────────────────────────────────────────────────────────┐  │
│    │ PASS src/auth/login.test.ts                                          │  │
│    │ PASS src/auth/register.test.ts                                       │  │
│    │ ◐ Running src/auth/oauth.test.ts...                                  │  │
│    │   tests: 2/5  passed: 2  failed: 0                                   │  │
│    └─────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘

With Progress Summary:
┌─────────────────────────────────────────────────────────────────────────────┐
│ └─ ◐ general-purpose [background]                                           │
│    "Analyzing codebase structure"                                           │
│    tools: 8  tokens: 15.2k                                                  │
│    Summary: Found 45 modules, 1.2k files, 89k lines                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Progress Throttling

Progress is throttled to avoid UI overload:

```javascript
// Progress update interval
const PROGRESS_UPDATE_INTERVAL_MS = 100;  // Minimum 100ms between updates

// Token threshold for updates
const TOKEN_UPDATE_THRESHOLD = 100;  // Update every 100 tokens

// Tool count threshold
const TOOL_UPDATE_THRESHOLD = 1;  // Update every tool call
```

---

## Keyboard Shortcuts

### Global Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `Ctrl+C` | Stop current operation | When agent is running |
| `Ctrl+F` | Kill all background agents | When background agents exist |
| `Ctrl+D` | Exit CLI | Idle state |

### Ctrl+F Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CTRL+F FLOW                                          │
└─────────────────────────────────────────────────────────────────────────────┘

User presses Ctrl+F
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Check: Are there running background agents?                                  │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ├─── NO ─────────────────────────────────► Ignore keypress
        │
        └─── YES
             │
             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Show confirmation: "Press Ctrl+F to stop N agents"                          │
└─────────────────────────────────────────────────────────────────────────────┘
             │
             ├─── User presses Ctrl+F again (within 2s)
             │        │
             │        ▼
             │    ┌─────────────────────────────────────────────────────────────┐
             │    │ killAllLocalAgents(U4q)                                     │
             │    │                                                             │
             │    │ For each task:                                              │
             │    │   triggerAbortSignal(x66)                                   │
             │    │     ├── Abort AbortController                               │
             │    │     ├── Unregister cleanup                                  │
             │    │     ├── Set status "killed"                                 │
             │    │     └── Flush output buffer                                 │
             │    └─────────────────────────────────────────────────────────────┘
             │
             └─── Timeout (2s) ──────────────────► Hide confirmation
```

---

## UI State Management

### State Structure

```javascript
// Task record for UI
{
    taskId: "a7x9k2m3",
    type: "local_agent",
    status: "running",  // running | completed | failed | killed
    description: "Search codebase...",
    progress: {
        toolUseCount: 5,
        tokenCount: 12543,
        summary: "Found 12 patterns..."
    },
    startTime: 1711526400000,
    endTime: null,
    isBackgrounded: true,
    notified: false
}
```

### UI Update Triggers

| Trigger | Update |
|---------|--------|
| Task created | Status line +1 |
| Task progress | Inline display |
| Task completed | Status line -1, notification |
| Task failed | Status line -1, notification |
| Task killed | Status line -1, notification |

---

## Output Viewing

### View Output File

When user presses Enter on a task:

```javascript
async function viewTaskOutput(taskId) {
    let outputPath = getOutputFilePath(taskId);
    let content = await fs.readFile(outputPath, "utf-8");

    // Show in pager
    await showInPager(content, {
        title: `Output: ${taskId}`,
        syntax: "markdown"
    });
}
```

### Partial Results

For killed tasks, partial results are preserved:

```javascript
// Output file contains whatever was written before kill
// Can be viewed with Enter key or via file system
```

---

## Key Insight

The UI design follows **progressive disclosure**:

1. **Status line** - Minimal, always visible
2. **Task list** - On-demand overview
3. **Inline progress** - During active execution
4. **Output file** - Full details when needed

This ensures users can quickly understand what's happening without being overwhelmed, while still having access to complete information when required.

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - Full UI interaction documentation