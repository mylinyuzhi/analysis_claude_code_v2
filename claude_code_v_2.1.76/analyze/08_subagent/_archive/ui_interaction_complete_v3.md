# UI Interaction Complete V3 (Claude Code 2.1.76)

> Complete source-level documentation of UI interaction for subagents and background agents including components, keyboard shortcuts, and user flows.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `Vc4` - AgentStatusComponent — `chunks.133.mjs:124`
- `U4q` - killAllLocalAgents — `chunks.146.mjs:2029`
- `x66` - triggerAbortSignal — `chunks.146.mjs:2012`
- `d4q` - markTaskKilled — `chunks.146.mjs:2034`
- `EV8` - getRunningTasks — `chunks.90.mjs:3053`

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

### Complete Source Code

```javascript
// ============================================
// Vc4 - AgentStatusComponent - Render agent status in message
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
    // ... render JSX
}

// READABLE (for understanding):
function AgentStatusComponent(props) {
    // Memoization cache (React-like useMemo pattern)
    let cache = useMemo(33);

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

    // Normalize optional props
    let normalizedIsAsync = isAsync === undefined ? false : isAsync;
    let normalizedHideType = hideType === undefined ? false : hideType;

    // Tree prefix: "└─" for last sibling, "├─" for others
    let treePrefix = isLast ? "└─" : "├─";

    // Backgrounded means: async AND resolved (mid-run backgrounding)
    let isBackgrounded = normalizedIsAsync && isResolved;

    // Status text determination with memoization
    let statusText;
    if (cache[0] !== isBackgrounded || cache[1] !== isResolved || cache[2] !== lastToolInfo || cache[3] !== taskDescription) {
        statusText = () => {
            if (!isResolved) return lastToolInfo || "Initializing…";
            if (isBackgrounded) return taskDescription ?? "Running in the background";
            return "Done";
        };
        cache[0] = isBackgrounded;
        cache[1] = isResolved;
        cache[2] = lastToolInfo;
        cache[3] = taskDescription;
        cache[4] = statusText;
    } else {
        statusText = cache[4];
    }

    // Render tree node with badge and stats
    return (
        <Box flexDirection="column">
            <Box>
                <Text dimColor>{treePrefix} </Text>
                {!normalizedHideType && (
                    <Text backgroundColor={color || "blue"} color="white">
                        {" "}{agentType}{" "}
                    </Text>
                )}
                <Text> ({description})</Text>
                <Text dimColor> · {toolUseCount} tool uses · {tokens} tokens</Text>
            </Box>
            <Box>
                <Text dimColor>│  </Text>
                <Text italic={!isResolved}>{statusText()}</Text>
            </Box>
        </Box>
    );
}

// Mapping: Vc4→AgentStatusComponent, K→agentType, Y→description, z→descriptionColor,
//          _→taskDescription, w→toolUseCount, O→tokens, $→color, H→isLast,
//          j→isResolved, J→isAsync, M→lastToolInfo, D→hideType, A6→useMemo
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

### Display State Logic

| isResolved | isAsync | Status | Display Text |
|------------|---------|--------|--------------|
| `false` | `false` | Running | `lastToolInfo \|\| "Initializing…"` |
| `false` | `true` | Background Running | `lastToolInfo \|\| "Running..."` |
| `true` | `false` | Completed | `"Done"` |
| `true` | `true` | Background Completed | `taskDescription \|\| "Running in background"` |

### Visual Output Example

```
├─ general-purpose (Find API usages) · 15 tool uses · 23451 tokens
│  Running Grep for "createTaskId"...
└─ Explore (Search codebase) · 8 tool uses · 12345 tokens
   Done
```

---

## Keyboard Shortcuts

### Global Shortcuts

| Shortcut | Action | Context | Symbol |
|----------|--------|---------|--------|
| `Ctrl+C` | Kill all running local_agent tasks | When any local_agent running | `U4q` |
| `Ctrl+F` | Kill all background agents (confirm) | When any local_agent running | `U4q` |

### Task List Modal Shortcuts

| Key | Action | Context |
|-----|--------|---------|
| `↑` / `k` | Move selection up | Task list open |
| `↓` / `j` | Move selection down | Task list open |
| `Enter` | View task details | Task selected |
| `Escape` | Close task list | Task list open |
| `x` | Kill selected task | Running task selected |
| `f` | Foreground teammate | in_process_teammate selected |

### Kill Handler Routing

```javascript
// ============================================
// Task action routing by type
// Location: inferred from handler architecture
// ============================================

// READABLE (for understanding):
function handleTaskAction(key, task, context) {
    if (key === "x") {  // Kill action
        switch (task.type) {
            case "local_bash":
                killLocalBashTask(task.id, context.setAppState);  // wQ6
                break;
            case "local_agent":
                triggerAbortSignal(task.id, context.setAppState);  // x66
                break;
            case "in_process_teammate":
                killTeammateTask(task.id, context.setAppState);
                break;
            case "local_workflow":
                killWorkflowTask(task.id, context.setAppState);
                break;
            case "remote_agent":
                killRemoteAgentTask(task.id, context.setAppState);
                break;
        }
    }
    if (key === "f") {  // Foreground action (teammates only)
        if (task.type === "in_process_teammate" && task.status === "running") {
            foregroundTeammate(task.id, context.setAppState);
        }
    }
}
```

---

## Kill All Flow (Ctrl+C / Ctrl+F)

### Two-Stage Kill Confirmation

```javascript
// ============================================
// Kill all confirmation flow
// Location: chunks.193.mjs (inferred from patterns)
// ============================================

// READABLE (for understanding):
function handleKillAllConfirmation(hasRunningAgents, tasks, setAppState) {
    if (hasRunningAgents) {
        // Step 1: Send telemetry
        telemetry("tengu_cancel", { source: "kill_agents" });

        // Step 2: Kill all local agents
        killAllLocalAgents(tasks, setAppState);  // U4q
        clearActiveTaskState();

        // Step 3: Build notification with killed agent descriptions
        let killedDescriptions = [];
        for (let [taskId, task] of Object.entries(tasks)) {
            if (task.type === "local_agent" && task.status === "running") {
                markTaskKilled(taskId, setAppState);  // d4q
                killedDescriptions.push(task.description);
            }
        }

        // Step 4: Show user notification
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
// Location: chunks.192.mjs (inferred)
// ============================================

// READABLE (for understanding):
function selectHasRunningLocalAgents(state) {
    return Object.values(state.tasks).some(
        (task) => task.type === "local_agent" && task.status === "running"
    );
}

// Usage in status line
function renderStatusLine(state) {
    let hasRunningAgents = selectHasRunningLocalAgents(state);
    let runningCount = Object.values(state.tasks).filter(
        (task) => task.type === "local_agent" && task.status === "running"
    ).length;

    if (hasRunningAgents) {
        return `${runningCount} running • Ctrl+C to cancel`;
    }

    // Normal status line content
    return renderNormalStatusLine(state);
}
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

### Notification Injection

```javascript
// ============================================
// Notification injection for task completion
// Location: chunks.89.mjs (inferred)
// ============================================

// READABLE (for understanding):
function injectTaskNotification(message, mode = "task-notification") {
    // Add to notification queue
    notificationQueue.push({
        value: message,
        mode: mode,
        timestamp: Date.now()
    });

    // Trigger UI update
    triggerUIRefresh();
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
getUnifiedTasksAttachment (suY)
        │
        ├── Running tasks ────────────────────┐
        │     (throttled to 3 turns)          ▼
        │                           task_progress attachment
        │                           • taskId, taskType
        │                           • message (progress summary)
        │
        └── Terminal tasks ────────────────────┐
              (not yet notified)               ▼
                              task_status attachment
                              • taskId, taskType, status
                              • description, deltaSummary
```

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

- [ui_design_complete.md](./ui_design_complete.md) - Complete UI design
- [agent_loop_complete_source.md](./agent_loop_complete_source.md) - Agent loop implementation
- [../26_background_agents/ui_design_complete.md](../26_background_agents/ui_design_complete.md) - Background agents UI