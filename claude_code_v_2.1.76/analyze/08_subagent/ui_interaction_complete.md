# UI Interaction Complete - Subagent & Background Agents (Claude Code 2.1.76)

> Complete UI interaction documentation for subagent and background agent systems including component hierarchy, keyboard shortcuts, status line integration, task list modal, and notification system.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified_v3.md](../08_subagent/cross_validation_unified_v3.md) - Unified symbol verification

Key functions in this document:
- `U4q` - killAllLocalAgents — `chunks.146.mjs:2029`
- `x66` - triggerAbortSignal — `chunks.146.mjs:2012`
- `d4q` - markTaskKilled — `chunks.146.mjs:2034`
- `$m8` - markTaskCompleted — `chunks.146.mjs:2100`
- `Hm8` - markTaskFailed — `chunks.146.mjs:2117`

---

## UI Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              TUI ROOT (APP)                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        MESSAGE AREA                                  │    │
│  │                                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐│    │
│  │  │ AssistantMessage                                                 ││    │
│  │  │  └─ ToolUseContent (type: "tool_use", name: "Agent")            ││    │
│  │  │      └─ AgentStatusComponent (Vc4)                              ││    │
│  │  │          ├─ TreePrefix ("├─" / "└─")                           ││    │
│  │  │          ├─ AgentTypeBadge (color from agentDefinition)         ││    │
│  │  │          ├─ Description (from AgentTool call)                   ││    │
│  │  │          ├─ Stats (toolUseCount, tokens)                        ││    │
│  │  │          └─ StatusIndicator (running/completed/failed)          ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        STATUS LINE (Footer)                          │    │
│  │                                                                       │    │
│  │  BackgroundAgentIndicator:                                           │    │
│  │  • Running agent count: "2 running"                                  │    │
│  │  • Kill hint: "Ctrl+C to cancel"                                     │    │
│  │  • Interactive: triggers kill confirmation                           │    │
│  │                                                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        TASK LIST MODAL (on /tasks)                   │    │
│  │                                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐│    │
│  │  │ Header: "Background Tasks"                                       ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  │                                                                       │    │
│  │  TaskListRow[]:                                                       │    │
│  │  ├─ StatusIcon (◐ ✓ ✗ ○)                                             │    │
│  │  ├─ Description                                                      │    │
│  │  ├─ Progress summary (if running)                                    │    │
│  │  └─ Actions: [x: stop] [f: foreground]                              │    │
│  │                                                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        NOTIFICATION AREA                             │    │
│  │                                                                       │    │
│  │  Task completion/failure/kill notifications                         │    │
│  │  Mode: "task-notification"                                           │    │
│  │                                                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
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

| Key | Action | Context |
|-----|--------|---------|
| `↑` / `k` | Move selection up | In list |
| `↓` / `j` | Move selection down | In list |
| `x` | Stop selected task | Running task |
| `f` | Bring selected task to foreground | Teammate task |
| `Enter` | View task output | Any task |
| `Esc` | Close modal | Modal open |
| `q` | Close modal | Modal open |
| `Ctrl+F` | Kill all running tasks | Running tasks exist |

### Task Status Icons

| Status | Icon | Animation | Color |
|--------|------|-----------|-------|
| `pending` | ○ | None | Dim |
| `running` | ◐ | Spinner | Yellow |
| `completed` | ✓ | None | Green |
| `failed` | ✗ | None | Red |
| `killed` | ○ | None | Gray |

### Action Availability by Task Type

| Task Type | Kill (`x`) | Foreground (`f`) |
|-----------|------------|------------------|
| `local_agent` | ✓ running | ✗ |
| `local_bash` | ✓ running | ✗ |
| `in_process_teammate` | ✓ running | ✓ running |
| `remote_agent` | ✓ running | ✗ |
| `local_workflow` | ✓ running | ✗ |

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

```javascript
// Progress update interval
const PROGRESS_UPDATE_INTERVAL_MS = 100;  // Minimum 100ms between updates

// Token threshold for updates
const TOKEN_UPDATE_THRESHOLD = 100;  // Update every 100 tokens

// Tool count threshold
const TOOL_UPDATE_THRESHOLD = 1;  // Update every tool call
```

---

## Keyboard Shortcuts Complete

### Global Shortcuts

| Shortcut | Action | Context | Source |
|----------|--------|---------|--------|
| `Ctrl+C` (once) | Show kill confirmation | Agents running | Key handler |
| `Ctrl+F` (confirm) | Execute kill all | After Ctrl+C | Key handler |
| `/tasks` | Open task list modal | Always | Slash command |
| `Ctrl+B` | Background running command | During Bash | Key handler |

### Kill Confirmation Flow

```
User presses Ctrl+C with running agents
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ Check: Any local_agent running?                                            │
│   Code: Object.values(tasks).some(t => t.type === "local_agent" &&         │
│                                      t.status === "running")               │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │
                        ┌─────────────┴─────────────┐
                        │                           │
                        ▼ No                        ▼ Yes
            ┌───────────────────┐         ┌─────────────────────────────────────────┐
            │ Cancel stream     │         │ Show confirmation:                      │
            │ (normal Ctrl+C)   │         │ "Press Ctrl+F to stop agents"           │
            └───────────────────┘         └───────────────────┬─────────────────────┘
                                                            │
                                              ┌─────────────┴─────────────┐
                                              │                           │
                                              ▼ Timeout                   ▼ Ctrl+F
                                      ┌───────────────────┐         ┌─────────────────────────┐
                                      │ Revert to         │         │ Execute killAll:        │
                                      │ normal behavior   │         │ 1. U4q(tasks, setState) │
                                      └───────────────────┘         │ 2. For each killed:     │
                                                                    │    d4q(taskId, setState)│
                                                                    │ 3. Show notification    │
                                                                    └─────────────────────────┘
```

---

## Kill Functions Source Code

### triggerAbortSignal (x66)

```javascript
// ============================================
// x66 - triggerAbortSignal - Abort a specific task
// Location: chunks.146.mjs:2012-2027
// ============================================

// ORIGINAL (for source lookup):
function x66(A, q) {
    let K = !1;
    if (i9(A, q, (Y) => {
            if (Y.status !== "running") return Y;
            return K = !0, Y.abortController?.abort(), Y.unregisterCleanup?.(), {
                ...Y,
                status: "killed",
                endTime: Date.now(),
                messages: Y.messages?.length ? [Y.messages[Y.messages.length - 1]] : void 0,
                abortController: void 0,
                unregisterCleanup: void 0,
                selectedAgent: void 0
            }
        }), K) $O(A);
    return K
}

// READABLE (for understanding):
function triggerAbortSignal(taskId, setAppState) {
    let wasAborted = false;

    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only abort running tasks
        if (task.status !== "running") return task;

        wasAborted = true;

        // Step 1: Abort the controller (cancels LLM stream)
        task.abortController?.abort();

        // Step 2: Unregister cleanup handler (prevent double cleanup)
        task.unregisterCleanup?.();

        // Step 3: Return killed state
        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]  // Keep last message
                : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Step 4: Flush output buffer if aborted
    if (wasAborted) {
        flushOutputBuffer(taskId);  // $O
    }

    return wasAborted;
}
```

### killAllLocalAgents (U4q)

```javascript
// ============================================
// U4q - killAllLocalAgents - Kill all running local agents
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
        // Filter conditions:
        // 1. Must be local_agent type (not local_bash, in_process_teammate, etc.)
        // 2. Must be in running state
        if (task.type === "local_agent" && task.status === "running") {
            triggerAbortSignal(taskId, setAppState);  // x66
        }
    }
}
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
**Status**: Complete - Full UI interaction documentation with source code