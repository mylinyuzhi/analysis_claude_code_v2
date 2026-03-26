# Status Line Integration (Claude Code 2.1.76)

> Deep analysis of how background agents display status in the TUI footer.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `U4q` - Kill all local agents — chunks.146.mjs:2029
- `hasRunningAgents` selector — chunks.193.mjs:2605
- Status line component — chunks.192.mjs

---

## Overview

The status line is the footer bar in Claude Code's TUI. For background agents, it displays:

1. **Running task count** - Number of active background agents
2. **Action hints** - "Ctrl+C to cancel" guidance
3. **State indicators** - Visual feedback for active work

---

## Status Line Architecture

### Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            TUI Root Component                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     Message List (Main Area)                         │    │
│  │                                                                      │    │
│  │  (conversation history and tool results)                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     Status Line (Footer)                             │    │
│  │                                                                      │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │ BackgroundAgentIndicator                                    │   │    │
│  │  │  • Shows count of running local_agent tasks                 │   │    │
│  │  │  • "X running • Ctrl+C to cancel" hint                      │   │    │
│  │  └──────────────────────────────────────────────────────────────┘   │    │
│  │                                                                      │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │ Model Indicator | Mode | Effort | Other Status              │   │    │
│  │  └──────────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Running Agent Detection

### hasRunningAgents Selector

**Location:** chunks.193.mjs:2605

**What it does:** Determines if any local_agent tasks are currently running.

```javascript
// ============================================
// hasRunningAgents - State selector for running agents
// Location: chunks.193.mjs:2605
// ============================================

// ORIGINAL (for source lookup):
let L = M1((e) => Object.values(e.tasks).some((Y6) => Y6.type === "local_agent" && Y6.status === "running"));

// READABLE (for understanding):
let hasRunningAgents = useAppState((state) =>
    Object.values(state.tasks).some(
        (task) => task.type === "local_agent" && task.status === "running"
    )
);

// Mapping: L→hasRunningAgents, M1→useAppState, e→state, Y6→task
```

### Detection Logic

1. **Get all tasks** - `Object.values(state.tasks)`
2. **Filter by type** - `task.type === "local_agent"`
3. **Filter by status** - `task.status === "running"`
4. **Return boolean** - `some()` returns true if any match

### Why Only local_agent?

| Task Type | Shown in Status Line? | Reason |
|-----------|----------------------|--------|
| `local_agent` | ✓ | Primary background task type |
| `local_bash` | ✗ | Shell commands don't count |
| `remote_agent` | ✗ | Remote tasks tracked separately |
| `in_process_teammate` | ✗ | Teammates shown differently |

---

## Status Line Display

### Running Task Count

```javascript
// In status line component
let runningCount = Object.values(appState.tasks)
    .filter(t => t.type === "local_agent" && t.status === "running")
    .length;

let statusText = runningCount > 0
    ? `${runningCount} running`
    : "";
```

### Display Logic

```
┌─────────────────────────────────────────────────────────────┐
│                      Status Line                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  No agents running:                                         │
│  "sonnet │ auto"                                            │
│                                                              │
│  1 agent running:                                           │
│  "1 running • Ctrl+C to cancel │ sonnet │ auto"             │
│                                                              │
│  3 agents running:                                          │
│  "3 running • Ctrl+C to cancel │ sonnet │ auto"             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Hint Text

The hint "Ctrl+C to cancel" appears when agents are running:

```javascript
let hintText = hasRunningAgents
    ? " • Ctrl+C to cancel"
    : "";
```

---

## Kill All Interaction

### Ctrl+C Handler

**Location:** chunks.193.mjs:2605-2644

**What it does:** When Ctrl+C is pressed and agents are running, kills all running agents.

```javascript
// ============================================
// handleKillAllAgents - Ctrl+C handler for agent termination
// Location: chunks.193.mjs:2605-2644
// ============================================

// ORIGINAL (for source lookup):
let L = M1((e) => Object.values(e.tasks).some((Y6) => Y6.type === "local_agent" && Y6.status === "running"));
let h = Ra6.useCallback(() => {
    // ... earlier code
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

let handleCtrlC = useCallback(() => {
    if (hasRunningAgents) {
        // Telemetry: user cancelled via kill agents
        telemetry("tengu_cancel", { source: "kill_agents" });

        // Send abort signal to all local_agent tasks
        killAllLocalAgents(appState.tasks, setAppState);

        // Clear active task state
        clearActiveTaskState();

        // Collect killed agent descriptions and mark as killed
        let killedDescriptions = [];
        for (let [taskId, task] of Object.entries(appState.tasks)) {
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
}, [hasRunningAgents, appState.tasks, setAppState]);

// Mapping: L→hasRunningAgents, M1→useAppState, U4q→killAllLocalAgents, d4q→markTaskKilled
// d→telemetry, _Y4→clearActiveTaskState, w0→addNotification, H6→appState.tasks, W→setAppState
```

### Kill Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         User Presses Ctrl+C                                  │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Check: hasRunningAgents?                                  │
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
                               │  3. clearActiveTaskState()                  │
                               │  4. For each running local_agent:           │
                               │     a. d4q(taskId, setAppState) // killed   │
                               │     b. collect description                  │
                               │  5. Show notification with killed list      │
                               └─────────────────────────────────────────────┘
```

### Notification Format

**Single agent killed:**
```
Background agent "Search codebase for API usage" was stopped by the user.
```

**Multiple agents killed:**
```
3 background agents were stopped by the user: "Search API", "Analyze code", "Run tests".
```

---

## Visual States

### Idle State

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ sonnet │ auto                                                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

**No background agents running.**

### Active State

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1 running • Ctrl+C to cancel │ sonnet │ auto                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

**One background agent running.**

### Multiple Agents State

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3 running • Ctrl+C to cancel │ sonnet │ auto                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Three background agents running.**

---

## React Integration

### State Subscription

```javascript
// Using React hooks to subscribe to state
const StatusLine = () => {
    const hasRunningAgents = useAppState((state) =>
        Object.values(state.tasks).some(
            (task) => task.type === "local_agent" && task.status === "running"
        )
    );

    const runningCount = useAppState((state) =>
        Object.values(state.tasks).filter(
            (task) => task.type === "local_agent" && task.status === "running"
        ).length
    );

    // Component re-renders when relevant state changes
    // ...
};
```

### useCallback for Kill Handler

```javascript
// Memoized handler prevents unnecessary re-renders
const handleKillAll = useCallback(() => {
    if (hasRunningAgents) {
        killAllLocalAgents(tasks, setAppState);
        // ... notification logic
    }
}, [hasRunningAgents, tasks, setAppState]);
```

---

## Design Rationale

### Why Show Count?

1. **Visibility** - User knows work is happening
2. **Context** - Can anticipate wait time
3. **Control** - Knows what can be cancelled

### Why "Ctrl+C to cancel" Hint?

1. **Discoverability** - Users learn the shortcut
2. **Actionability** - Clear what to do
3. **Consistency** - Same pattern as other CLI tools

### Why Only local_agent Count?

1. **Primary use case** - Most common background task
2. **Simplicity** - Single number is clearer
3. **Avoid confusion** - Mixing types would be confusing

### Why Not Show Task Names?

1. **Space** - Footer is limited width
2. **Simplicity** - Count is sufficient
3. **Task list** - Detailed info available in task list view

---

## Integration with Other Components

### With Task List

- Task list shows detailed info per task
- Status line shows summary count
- Both use same underlying state

### With Notification System

- Kill action generates notification
- Notification appears in message list
- Status line updates to reflect new state

### With Keyboard Handler

- Ctrl+C intercepted by root component
- Routed to kill handler if agents running
- Otherwise triggers normal cancellation