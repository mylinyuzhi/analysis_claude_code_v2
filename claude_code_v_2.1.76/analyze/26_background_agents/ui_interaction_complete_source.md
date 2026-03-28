# UI Interaction - Complete Source Restoration (Claude Code 2.1.76)

> Source-level analysis of UI components, keyboard interactions, and visual feedback
> for subagent and background agent management.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `killAllLocalAgents` (U4q) - Kill all running agents — `chunks.146.mjs:2029`
- `markTaskKilled` (d4q) - Mark task killed — `chunks.146.mjs:2034`
- `AgentStatusComponent` (Vc4) - Agent status renderer — `chunks.133.mjs:124`

---

## Component Architecture

### High-Level Structure

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
| `Ctrl+C` | Kill all running agents | When agents running | `U4q` → `d4q` |
| `Ctrl+F` | Kill all running agents | When agents running | `U4q` → `d4q` |

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

## Ctrl+C Kill All Handler

### What it does

When the user presses Ctrl+C while background agents are running, this handler kills all running agents and shows a notification.

### Source Code

```javascript
// ============================================
// handleCtrlCWithAgents - Kill all running agents on Ctrl+C
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

// Mapping: L→hasRunningAgents, h→handleCtrlC, d→telemetry, U4q→killAllLocalAgents,
// d4q→markTaskKilled, w0→addNotification, H6→appState.tasks, W→setAppState
```

### Flow Diagram

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

## Agent Status Component (Vc4)

### What it does

Renders the visual representation of a subagent in the message list. Shows agent type, description, progress, and status.

### Source Code

```javascript
// ============================================
// Vc4 - AgentStatusComponent - Render agent status tree node
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
    // ... render tree node
}

// READABLE (for understanding):
function AgentStatusComponent(props) {
    // State cache for memoization
    let cache = useStateCache(33);

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

    let isBackgrounded = isAsync && isResolved;

    // Tree prefix
    let treePrefix = isLast ? "└─" : "├─";

    // Memoized status text
    let statusText = useMemo(() => {
        if (!isResolved) return lastToolInfo || "Initializing…";
        if (isBackgrounded) return taskDescription ?? "Running in the background";
        return "Done";
    }, [isResolved, isBackgrounded, lastToolInfo, taskDescription]);

    // Render tree node with badge, description, and stats
    return (
        <Box flexDirection="row">
            <Text color="dim">{treePrefix}</Text>
            {!hideType && (
                <Badge color={color || "blue"}>{agentType}</Badge>
            )}
            <Text>({description})</Text>
            {toolUseCount > 0 && (
                <Text dimColor> · {toolUseCount} tool uses</Text>
            )}
            {tokens > 0 && (
                <Text dimColor> · {tokens} tokens</Text>
            )}
            <Text>{statusText}</Text>
        </Box>
    );
}

// Mapping: Vc4→AgentStatusComponent, K→agentType, Y→description, w→toolUseCount,
// O→tokens, H→isLast, j→isResolved, J→isAsync, M→lastToolInfo
```

### Visual Output

```
├─ general-purpose (Find API usages) · 15 tool uses · 23451 tokens
│  Running Grep for "createTaskId"...
└─ Done
```

---

## Task List Row Component

### Action Handling

```javascript
// ============================================
// handleTaskAction - Keyboard handlers for task list
// Location: chunks.162.mjs:846-860
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

## Status Line States

### Five Visual States

```
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

---

## Status Line Integration

### Running Agent Count Display

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

## Task List Modal

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

---

## Notification Toasts

### Four Notification Types

```
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

## Progress Display

### Inline Progress Examples

```
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

### Progress Throttling Constants

Progress is throttled to avoid UI overload:

```javascript
const PROGRESS_UPDATE_INTERVAL_MS = 100;  // Minimum 100ms between updates
const TOKEN_UPDATE_THRESHOLD = 100;       // Update every 100 tokens
const TOOL_UPDATE_THRESHOLD = 1;          // Update every tool call
```

---

## Ctrl+F Kill All Flow

### Flow with 2-Second Confirmation Timeout

```
User presses Ctrl+F
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Check: Are there running background agents?                                  │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ├─── NO ─────────────────────────────► Ignore keypress
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

## Output Viewing

### viewTaskOutput Pseudocode

When user presses Enter on a task in the task list:

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

For killed tasks, partial results are preserved -- the output file contains whatever was written before the kill signal, and can be viewed with Enter or via the file system.

---

## Key Design Insight: Progressive Disclosure

The UI design follows **progressive disclosure** -- layering information so users get the right amount of detail at each level:

1. **Status line** - Minimal, always visible (count + hint)
2. **Task list** - On-demand overview via `/tasks`
3. **Inline progress** - During active execution in the message stream
4. **Output file** - Full details when needed via Enter key

This ensures users can quickly understand what is happening without being overwhelmed, while still having access to complete information when required.

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

---

## Cross-Validation Summary

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| `Vc4` | AgentStatusComponent | chunks.133.mjs:124 | ✓ Verified |
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs | ✓ Verified |

---

## Related Documents

- [task_state_machine_source_restored.md](./task_state_machine_source_restored.md) - State machine details
- [mailbox_communication_source_restored.md](../08_subagent/mailbox_communication_source_restored.md) - Mailbox system
- [../08_subagent/ui_interaction.md](../08_subagent/ui_interaction.md) - Subagent UI