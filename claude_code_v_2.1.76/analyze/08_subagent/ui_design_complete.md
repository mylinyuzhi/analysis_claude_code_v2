# Subagent UI Design Complete (Claude Code 2.1.76)

> Complete UI design documentation for subagent interaction including component hierarchy, visual specifications, and user interaction flows.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `Vc4` - Agent status component renderer — `chunks.133.mjs:124`
- `qh` - Agent loop runner — `chunks.133.mjs:1565`
- `U4q` - Kill all local agents — `chunks.146.mjs:2029`
- `d4q` - Mark task as killed — `chunks.146.mjs:2034`
- `suY` - getUnifiedTasksAttachment — `chunks.147.mjs:1033`
- `nl4` - updateTaskProgressWithTelemetry — `chunks.146.mjs:2059`

---

## UI Component Architecture

### High-Level Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              TUI Root (App)                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        MessageArea                                    │    │
│  │                                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐│    │
│  │  │ AssistantMessage                                                 ││    │
│  │  │  └─ ToolUseContent                                              ││    │
│  │  │      └─ AgentStatusComponent (Vc4)                              ││    │
│  │  │          ├─ TreePrefix ("├─" / "└─")                           ││    │
│  │  │          ├─ AgentTypeBadge                                       ││    │
│  │  │          ├─ Description                                          ││    │
│  │  │          ├─ Stats (tool use count, tokens)                      ││    │
│  │  │          └─ StatusIndicator                                      ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        StatusLine                                    │    │
│  │                                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐│    │
│  │  │ BackgroundAgentIndicator                                         ││    │
│  │  │  • Running agent count                                          ││    │
│  │  │  • "Ctrl+C to cancel" hint                                      ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        TaskList (Modal)                              │    │
│  │                                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐│    │
│  │  │ TaskListRow[]                                                   ││    │
│  │  │  ├─ StatusIcon (◐ ✓ ✗ ○)                                        ││    │
│  │  │  ├─ Description                                                 ││    │
│  │  │  └─ ActionHints ([x: stop] [f: foreground])                    ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Agent Status Component (Vc4)

### Source Code

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
    // ... render logic
}

// READABLE (for understanding):
function AgentStatusComponent(props) {
    let {
        agentType,           // "general-purpose", "Explore", "Plan", etc.
        description,         // Short description from AgentTool call
        descriptionColor,    // Optional custom color
        taskDescription,     // Detailed task description
        toolUseCount,        // Number of tool calls made
        tokens,              // Token usage count
        color,               // Agent's custom color from definition
        isLast,              // Whether last in list (affects tree prefix)
        isResolved,          // Whether agent completed
        isAsync,             // Whether running asynchronously
        lastToolInfo,        // Most recent tool info string
        hideType             // Hide agent type badge
    } = props;

    // Tree prefix: "└─" for last sibling, "├─" for others
    let treePrefix = isLast ? "└─" : "├─";

    // Backgrounded means: async AND resolved (mid-run backgrounding)
    let isBackgrounded = isAsync && isResolved;

    // Status text determination
    let statusText = useMemoize(() => {
        if (!isResolved) return lastToolInfo || "Initializing…";
        if (isBackgrounded) return taskDescription ?? "Running in the background";
        return "Done";
    }, [isBackgrounded, isResolved, lastToolInfo, taskDescription]);

    // Render tree node with badge and stats
    // ...
}

// Mapping: Vc4→AgentStatusComponent, K→agentType, Y→description, w→toolUseCount, O→tokens,
//          H→isLast, j→isResolved, J→isAsync, M→lastToolInfo, D→hideType
```

### Props Interface

```typescript
interface AgentStatusProps {
    agentType: string;           // Agent type identifier
    description: string;         // Short description (3-5 words)
    descriptionColor?: string;   // Custom color for description text
    taskDescription?: string;    // Detailed task description
    toolUseCount: number;        // Cumulative tool call count
    tokens: number;              // Cumulative token usage
    color?: string;              // Badge color from agent definition
    isLast: boolean;             // Last sibling in tree (affects prefix)
    isResolved: boolean;         // Agent has completed
    isAsync: boolean;            // Running asynchronously
    lastToolInfo?: string;       // Current tool info (e.g., "Running Grep...")
    hideType?: boolean;          // Hide type badge
}
```

### Visual Output Example

```
├─ general-purpose (Find API usages) · 15 tool uses · 23451 tokens
│  Running Grep for "createTaskId"...
└─ Done
```

---

## UI State Machine

### Agent Display States

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Agent Display State Machine                          │
└─────────────────────────────────────────────────────────────────────────────┘

                          ┌─────────────┐
                          │  Created    │
                          │  (pending)  │
                          └──────┬──────┘
                                 │ spawn
                                 ▼
                          ┌─────────────┐
                 ┌────────│  Running    │────────┐
                 │        │  (active)   │        │
                 │        └──────┬──────┘        │
                 │               │               │
        mid-run  │               │ complete      │ background
        bg       │               │               │ (run_in_bg)
                 │               ▼               │
                 │        ┌─────────────┐        │
                 │        │ Completed   │        │
                 │        │ (done)      │        │
                 │        └─────────────┘        │
                 │                               │
                 ▼                               ▼
          ┌─────────────┐                 ┌─────────────┐
          │ Backgrounded│                 │ Background  │
          │ (running)   │                 │ Launched    │
          └──────┬──────┘                 └──────┬──────┘
                 │                               │
                 │ complete                      │ complete
                 ▼                               ▼
          ┌─────────────┐                 ┌─────────────┐
          │ Background  │                 │ Background  │
          │ Completed   │                 │ Completed   │
          └─────────────┘                 └─────────────┘
```

### Display State Logic

| isResolved | isAsync | Status | Display Text |
|------------|---------|--------|--------------|
| `false` | `false` | Running | `lastToolInfo \|\| "Initializing…"` |
| `false` | `true` | Background Running | `lastToolInfo \|\| "Running..."` |
| `true` | `false` | Completed | `"Done"` |
| `true` | `true` | Background Completed | `taskDescription \|\| "Running in background"` |

---

## Visual Specifications

### Color Coding

#### Agent Type Colors (Default)

| Agent Type | Default Color | Hex |
|------------|--------------|-----|
| `general-purpose` | Blue | `#3b82f6` |
| `Explore` | Green | `#22c55e` |
| `Plan` | Purple | `#a855f7` |
| `statusline-setup` | Orange | `#f97316` |
| Custom | As defined | User-specified |

#### Status Colors

| Status | Color | Usage |
|--------|-------|-------|
| Running | Yellow | Active indicator |
| Completed | Green | Success |
| Failed | Red | Error |
| Killed | Dim | User-terminated |

### Tree Prefix Characters

```
├─  Has more siblings below (intermediate)
└─  Last sibling in group (terminal)
│   Vertical connector for child nodes
    Space indentation for depth
```

### Typography

```
Agent Type Badge:  Bold, rounded corners, colored background
Description:       Normal weight, default color (or custom)
Stats:             Dim color, "· N tool uses · N tokens"
Status Text:       Italic for running, normal for done
```

---

## Keyboard Shortcuts

### Global Shortcuts (When Agents Running)

| Shortcut | Action | Context |
|----------|--------|---------|
| `Ctrl+C` | Kill all running local_agent tasks | When any local_agent running |
| `Ctrl+F` | Kill all background agents (confirm) | When any local_agent running |

### Task List Modal Shortcuts

| Key | Action | Context |
|-----|--------|---------|
| `↑` / `k` | Move selection up | Task list open |
| `↓` / `j` | Move selection down | Task list open |
| `Enter` | View task details | Task selected |
| `Escape` | Close task list | Task list open |
| `x` | Kill selected task | Running task selected |
| `f` | Foreground teammate | in_process_teammate selected |

### Kill Handler Routing (by Task Type)

```javascript
// ============================================
// Task action routing by type
// Location: chunks.162.mjs (inferred)
// ============================================

// READABLE (for understanding):
function handleTaskAction(key, task, dispatch) {
    if (key === "x") {  // Kill action
        switch (task.type) {
            case "local_bash":
                killBashTask(task.id);        // wQ6
                break;
            case "local_agent":
                killAgentTask(task.id);       // via x66
                break;
            case "in_process_teammate":
                killTeammateTask(task.id);    // bZ1
                break;
            case "local_workflow":
                killWorkflowTask(task.id);
                break;
            case "remote_agent":
                killRemoteAgentTask(task.id);
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

---

## Kill All Flow (Ctrl+C / Ctrl+F)

### Source Code

```javascript
// ============================================
// U4q - Kill all local agents
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
            // x66 triggers abort signal for this task
            triggerAbortSignal(taskId, setAppState);
        }
    }
}

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, x66→triggerAbortSignal
```

### Kill Confirmation Flow

```javascript
// ============================================
// Ctrl+C / Ctrl+F handler
// Location: chunks.193.mjs:2605-2656
// ============================================

// ORIGINAL (for source lookup):
// First Ctrl+C shows confirmation
v.current = e, G({
    key: "kill-agents-confirm",
    text: "Press ctrl+f again to stop background agents",
    priority: "immediate",
    timeoutMs: Buq  // Confirmation timeout
})

// READABLE (for understanding):
// Two-stage kill for safety:
// 1. First Ctrl+C: Show confirmation message
// 2. Second Ctrl+F within timeout: Execute kill

function handleKillAllConfirmation(hasRunningAgents) {
    if (hasRunningAgents) {
        // Send telemetry
        telemetry("tengu_cancel", { source: "kill_agents" });

        // Kill all local agents
        killAllLocalAgents(tasks, setAppState);
        clearActiveTaskState();

        // Build notification
        let killedDescriptions = [];
        for (let [taskId, task] of Object.entries(tasks)) {
            if (task.type === "local_agent" && task.status === "running") {
                markTaskKilled(taskId, setAppState);
                killedDescriptions.push(task.description);
            }
        }

        // Show user notification
        if (killedDescriptions.length > 0) {
            let message = killedDescriptions.length === 1
                ? `Background agent "${killedDescriptions[0]}" was stopped by the user.`
                : `${killedDescriptions.length} background agents were stopped.`;
            addNotification({ value: message, mode: "task-notification" });
        }
    }
}
```

### Kill Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    User Presses Ctrl+C with Running Agents                   │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Show Confirmation Message                               │
│                                                                              │
│  "Press ctrl+f again to stop background agents"                            │
│  (with timeout - if timeout expires, normal Ctrl+C behavior)               │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      User Presses Ctrl+F                                     │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Execute Kill All                                        │
│                                                                              │
│  1. telemetry("tengu_cancel", { source: "kill_agents" })                   │
│  2. U4q(tasks, setAppState)  // Trigger abort for all local_agent         │
│  3. For each killed agent:                                                   │
│     a. d4q(taskId, setAppState)  // Mark as killed with notification       │
│     b. Collect description for notification                                 │
│  4. Show notification with killed agent names                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Status Line Integration

### Background Agent Indicator

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

### Status Line Display Format

```
When agents running:
┌──────────────────────────────────────────────────────────────────┐
│ 2 running • Ctrl+C to cancel                                      │
└──────────────────────────────────────────────────────────────────┘

When no agents running:
┌──────────────────────────────────────────────────────────────────┐
│ (normal status line content)                                      │
└──────────────────────────────────────────────────────────────────┘
```

---

## Task List Component

### Task Status Icons

| Status | Icon | Animation | Color |
|--------|------|-----------|-------|
| `pending` | ○ | None | Dim |
| `running` | ◐ | Animated spinner | Yellow |
| `completed` | ✓ | None | Green |
| `failed` | ✗ | None | Red |
| `killed` | ○ | None | Dim |

### Action Availability Matrix

| Task Type | `x` (Kill) | `f` (Foreground) |
|-----------|------------|------------------|
| `local_agent` | ✓ (when running) | ✗ |
| `local_bash` | ✓ (when running) | ✗ |
| `in_process_teammate` | ✓ (when running) | ✓ (when running) |
| `local_workflow` | ✓ (when running) | ✗ |
| `remote_agent` | ✓ (when running) | ✗ |

---

## Notification System

### Notification Types

```typescript
interface TaskNotification {
    value: string;           // Message text
    mode: "task-notification" | "error" | "warning";
}
```

### Notification Message Formats

| Event | Message Format |
|-------|---------------|
| Single Kill | `Background agent "{description}" was stopped by the user.` |
| Multiple Kill | `{count} background agents were stopped by the user.` |
| Completion | `Agent "{description}" completed` |
| Failure | `Agent "{description}" failed: {error}` |

### Notification Visual Mockups

```
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
```

---

## Integration with System Reminders

### Attachment Generation Points

```
Subagent Execution Loop (qh)
        │
        ├── each turn ────────────────────────┐
        │                                      ▼
        │                           updateTaskProgressWithTelemetry (nl4)
        │                           • Update toolUseCount, tokenCount
        │                           • Set progress.summary
        │                           • Send telemetry event
        │
        └── on completion ────────────────────┐
                                              ▼
                              markTaskCompleted ($m8) / markTaskFailed (Hm8)
                              • Set status: "completed" / "failed"
                              • Set endTime
                              • Trigger notification

Parent Session (before each LLM turn)
        │
        ▼
getUnifiedTasksAttachment (vIY)
        │
        ├── Running tasks ────────────────────┐
        │     (throttled to 3 turns)          ▼
        │                           task_progress attachment
        │                           • taskId, taskType
        │                           • message (progress summary)
        │
        └── Terminal tasks ───────────────────┐
              (not yet notified)               ▼
                              task_status attachment
                              • taskId, taskType, status
                              • description, deltaSummary
```

### getUnifiedTasksAttachment (suY)

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

The task status is injected into the system reminder as XML that the LLM can parse:

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

## Design Rationale

### Why Tree Visualization?

1. **Hierarchical clarity** - Shows parent-child agent relationships
2. **Space efficient** - Compact representation of nested execution
3. **Familiar pattern** - Tree view is universally understood

### Why Two-Stage Kill?

1. **Prevent accidents** - User might intend normal Ctrl+C (cancel stream)
2. **Clear intent** - Second keypress confirms kill intent
3. **Timeout safety** - Confirmation expires, reverts to normal behavior

### Why Status Line Indicator?

1. **Visibility** - Background agents run silently, need visibility
2. **Discoverability** - Hints at Ctrl+C action availability
3. **Quick reference** - Running count at a glance

### Why Task Status in System Reminders?

1. **LLM awareness** - The LLM needs to know about running background tasks without blocking
2. **Polling-based** - Output files are polled each turn, injected as task_status attachments
3. **Delta summaries** - Only new progress since last poll is sent, keeping context efficient

---

## ANSI Color Codes Reference

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

## v2.1.76 UI Changes

### New Features

1. **Ctrl+F Kill All** - Explicit shortcut for killing all background agents
2. **Partial Results on Kill** - Output preserved when task is killed
3. **Background Field** - `background: true` distinguishes explicit vs converted background tasks
4. **Mid-Run Backgrounding** - Seamless sync→async transition

### UI Indicator Enhancements

```
v2.1.76 Status Line:
┌──────────────────────────────────────────────────────────────────┐
│ 2 running • Ctrl+C to cancel                                      │
│              └─────────────────────┘                              │
│                 Interactive hint - click or press                 │
└──────────────────────────────────────────────────────────────────┘
```

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `Vc4` | AgentStatusComponent | chunks.133.mjs:124 | ✓ Verified |
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | ✓ Verified |
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | ✓ Verified |

---

## Related Documents

- [ui_interaction.md](./ui_interaction.md) - UI interaction details
- [agent_tool_complete.md](./agent_tool_complete.md) - AgentTool implementation
- [execution_flow_deep_dive.md](./execution_flow_deep_dive.md) - Execution flow
- [../26_background_agents/ui_design_complete.md](../26_background_agents/ui_design_complete.md) - Background agents UI