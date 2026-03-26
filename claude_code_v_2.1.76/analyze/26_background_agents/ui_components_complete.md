# UI Components Complete Guide (Claude Code 2.1.76)

> Source-level analysis of all UI components related to subagent and background agent management.
> Includes status line, task list, kill controls, and keyboard shortcuts.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions and components:
- `killAllLocalAgents` (U4q) - Kill all running agents — `chunks.146.mjs:2029`
- `markTaskKilled` (d4q) - Mark task killed — `chunks.146.mjs:2034`
- `AgentStatusComponent` (Vc4) - Agent status tree renderer — `chunks.162.mjs:836`
- `TaskListRow` - Task list row component — `chunks.162.mjs:839-846`
- `hasRunningAgents` selector — State selector — `chunks.193.mjs:2605`

---

## Component Architecture

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

## Keyboard Shortcuts

### Global Shortcuts

| Shortcut | Action | Context | Implementation |
|----------|--------|---------|----------------|
| `Ctrl+C` | Kill all running agents | When agents running | `U4q` → `x66` |
| `Ctrl+F` | Kill all running agents | When agents running | `U4q` → `x66` |

### Task List Shortcuts

| Key | Action | Availability |
|-----|--------|--------------|
| `j` / `↓` | Move selection down | Task list focused |
| `k` / `↑` | Move selection up | Task list focused |
| `x` | Kill selected task | Running task selected |
| `f` | Foreground teammate | in_process_teammate selected |
| `Enter` | View task details | Any task selected |
| `Escape` | Return to list | Detail view |

---

## Kill All Implementation

### Ctrl+C Handler

**Location:** chunks.193.mjs:2605-2644

```javascript
// ============================================
// handleCtrlC - Kill all running agents on Ctrl+C
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
// Selector: true if any local_agent is running
let hasRunningAgents = useAppState((state) =>
    Object.values(state.tasks).some(
        (task) => task.type === "local_agent" && task.status === "running"
    )
);

let handleCtrlC = useCallback(() => {
    if (hasRunningAgents) {
        // 1. Telemetry: user cancelled via kill agents
        telemetry("tengu_cancel", { source: "kill_agents" });

        // 2. Send abort signal to all local_agent tasks
        killAllLocalAgents(appState.tasks, setAppState);
        clearActiveTaskState();

        // 3. Mark each as killed and collect descriptions
        let killedDescriptions = [];
        for (let [taskId, task] of Object.entries(appState.tasks)) {
            if (task.type === "local_agent" && task.status === "running") {
                markTaskKilled(taskId, setAppState);
                killedDescriptions.push(task.description);
            }
        }

        // 4. Show notification with killed agent names
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

---

## Task List Row Component

### Rendering Logic

**Location:** chunks.162.mjs:836-981

```javascript
// ============================================
// TaskListRow - Individual task row in task list
// Location: chunks.162.mjs:839-846
// ============================================

// ORIGINAL (for source lookup):
if (Q === "x") {
    if (r.type === "local_bash" && r.status === "running") v(r.id);
    else if (r.type === "local_agent" && r.status === "running") N(r.id);
    else if (r.type === "in_process_teammate" && r.status === "running") V(r.id);
    else if (r.type === "local_workflow" && r.status === "running" && CR1) CR1(r.id, w)
}
if (Q === "f") {
    if (r.type === "in_process_teammate" && r.status === "running") g16(r.id, w), A("Viewing teammate", {
        action: "view"
    });
}

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
                if (task.status === "running") killWorkflowTask(task.id, setAppState);
                break;
        }
    }
    if (key === "f") {  // Foreground action (teammates only)
        if (task.type === "in_process_teammate" && task.status === "running") {
            foregroundTeammate(task.id, setAppState);
            dispatch("Viewing teammate", { action: "view" });
        }
    }
}
```

### Action Availability Matrix

| Task Type | `x` (Kill) | `f` (Foreground) |
|-----------|------------|------------------|
| `local_agent` | ✓ (when running) | ✗ |
| `local_bash` | ✓ (when running) | ✗ |
| `in_process_teammate` | ✓ (when running) | ✓ (when running) |
| `local_workflow` | ✓ (when running) | ✗ |
| `remote_agent` | ✓ (when running) | ✗ |

---

## Status Icons

### Visual Representation

| Status | Icon | Color | Description |
|--------|------|-------|-------------|
| `pending` | ○ | dim | Task created, not yet started |
| `running` | ◐ | yellow | Currently executing |
| `completed` | ✓ | green | Successfully finished |
| `failed` | ✗ | red | Execution failed with error |
| `killed` | ○ | dim | User terminated |

### Animated Running Indicator

Running tasks use an animated spinner (◐) to indicate active execution:

```
Status Animation Cycle:
◐ → ◑ → ◒ → ◓ → ◐ (loops)
```

---

## Agent Status Component (Vc4)

### Tree Visualization

The `Vc4` function renders hierarchical agent status:

```
├─ general-purpose (Find API usages) · 15 tool uses · 23451 tokens
│  Running Grep for "createTaskId"...
└─ Done
```

### Component Props

```javascript
// ============================================
// Vc4 - Agent status component renderer
// Location: chunks.162.mjs:836-981
// ============================================

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
```

### Tree Prefix Characters

| Prefix | Meaning |
|--------|---------|
| `├─` | Has more siblings below |
| `└─` | Last sibling in group |
| `│` | Vertical connector |
| ` ` | Indentation for depth |

### Nested Tree Example

```
├─ general-purpose (Analyze codebase) · 42 tool uses
│  ├─ Explore (Find usages) · 8 tool uses
│  │  └─ Done
│  ├─ Plan (Design solution) · 12 tool uses
│  │  └─ Done
│  └─ Running: Writing implementation...
└─ Running
```

---

## Status Line Integration

### Running Agent Count Display

**Location:** chunks.192.mjs:475

```javascript
// ============================================
// hasRunningLocalAgents - State selector
// Location: chunks.192.mjs:475
// ============================================

// ORIGINAL (for source lookup):
let l = Object.values(j).some((O6) => O6.type === "local_agent" && O6.status === "running");

// READABLE (for understanding):
let hasRunningLocalAgents = Object.values(tasks).some(
    (task) => task.type === "local_agent" && task.status === "running"
);
```

### Status Line Display

When agents are running, the status line shows:

```
┌──────────────────────────────────────────────────────────────────┐
│ 2 running • Ctrl+C to cancel                                      │
└──────────────────────────────────────────────────────────────────┘
```

**Components:**
1. **Running count** - Number of `local_agent` tasks with `status === "running"`
2. **Kill hint** - "Ctrl+C to cancel" shows available action

---

## Notification System

### Task Notification Types

| Mode | Display | Usage |
|------|---------|-------|
| `task-notification` | Inline message | Kill confirmations, completion notices |
| `error` | Error banner | Task failures |
| `warning` | Warning message | Resource warnings |

### Notification Structure

```javascript
{
    value: "Background agent \"Search codebase\" completed.",
    mode: "task-notification"
}
```

### Notification Message Formats

**Completion Notification:**
```
Agent "{description}" completed
```

**Failure Notification:**
```
Agent "{description}" failed: {errorMessage}
```

**Kill Notification (Single):**
```
Background agent "{description}" was stopped by the user.
```

**Kill Notification (Multiple):**
```
{count} background agents were stopped by the user: "{desc1}", "{desc2}", ...
```

---

## Color Coding

### Agent Type Colors

| Agent Type | Default Color | Badge Style |
|------------|--------------|-------------|
| `general-purpose` | Blue | Rounded rectangle |
| `Explore` | Green | Rounded rectangle |
| `Plan` | Purple | Rounded rectangle |
| `statusline-setup` | Orange | Rounded rectangle |

### Color Application

Colors are applied to:
1. **Agent type badge** - Background color
2. **Status line indicator** - When agent is active
3. **Tree visualization** - Consistent identification

---

## System Reminder Integration

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

---

## v2.1.76 UI Changes

### New Features

1. **Ctrl+F Kill All** - New keyboard shortcut to kill all running agents at once
2. **Partial Results on Kill** - Preserved output when task is killed
3. **Background Field** - New `background: true` field distinguishes explicit vs. converted background tasks

### Kill All Flow with Partial Results

```
User presses Ctrl+F or Ctrl+C with running agents
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  1. For each running local_agent:                                           │
│     a. readOutputFileDelta(taskId, offset) // Capture partial output       │
│     b. x66(taskId) // Trigger abort signal                                  │
│     c. d4q(taskId, setAppState) // Mark as killed                          │
│                                                                              │
│  2. Build notification with partial results included                        │
│                                                                              │
│  3. Show user notification: "N background agents were stopped..."           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Status Line Enhancements

```
v2.1.76 Status Line:
┌──────────────────────────────────────────────────────────────────┐
│ 2 running • Ctrl+C to cancel                                      │
│              └─────────────────────┘                              │
│                 Interactive hint - click or press                 │
└──────────────────────────────────────────────────────────────────┘
```

---

## Integration Flow

### Progress Update to UI Display

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

## Related Documents

- [task_state_machine_complete.md](./task_state_machine_complete.md) - State machine details
- [system_reminder_producers.md](./system_reminder_producers.md) - Attachment generation
- [../08_subagent/ui_interaction.md](../08_subagent/ui_interaction.md) - Subagent UI