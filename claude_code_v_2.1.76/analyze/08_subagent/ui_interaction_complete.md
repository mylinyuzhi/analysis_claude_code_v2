# UI Interaction Complete - Subagent & Background Agents (Claude Code 2.1.76)

> Complete UI interaction documentation for subagent and background agent systems including component hierarchy, interaction flows, keyboard shortcuts, status line integration, task list modal, notification system, and system reminder integration.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `killAllLocalAgents` (U4q) - Kill all running local agents — `chunks.146.mjs:2029`
- `triggerAbortSignal` (x66) - Abort a specific task — `chunks.146.mjs:2012`
- `markTaskKilled` (d4q) - Mark task as killed — `chunks.146.mjs:2034`
- `markTaskCompleted` ($m8) - Mark task as completed — `chunks.146.mjs:2100`
- `markTaskFailed` (Hm8) - Mark task as failed — `chunks.146.mjs:2117`
- `updateTaskProgressWithTelemetry` (nl4) - Update task progress — `chunks.146.mjs:2059`
- `getUnifiedTasksAttachment` (suY) - Build task status attachments — `chunks.147.mjs:1033`
- `showNotification` (w0) - Display notification — `chunks.14.mjs`
- `showTaskNotification` ($z6) - Task-specific notification — `chunks.136.mjs`

---

## UI Architecture Overview

```
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
│  │  │      └─ AgentStatusComponent (Vc4)                              ││    │
│  │  │          ├─ TreePrefix ("├─" / "└─")                           ││    │
│  │  │          ├─ AgentTypeBadge (color from agentDefinition)         ││    │
│  │  │          ├─ Description (from AgentTool call)                   ││    │
│  │  │          ├─ Stats (toolUseCount, tokens)                        ││    │
│  │  │          └─ StatusIndicator (running/completed/failed)          ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  │                                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐│    │
│  │  │ ToolResultContent                                                ││    │
│  │  │  status: "completed"                                             ││    │
│  │  │  agentId: "a7x9k2m3"                                             ││    │
│  │  │  totalToolUseCount: 5                                            ││    │
│  │  │  totalTokens: 12543                                              ││    │
│  │  │  content: "Found 12 authentication patterns..."                  ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        StatusLine (Footer)                           │    │
│  │                                                                       │    │
│  │  Model: claude-sonnet-4 │ CWD: /project │ 2 running ● Ctrl+F stop   │    │
│  │                          └──────────────────┘ └──────────────────┘  │    │
│  │                               background count    kill hint          │    │
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
│  │                     NotificationArea                                 │    │
│  │                                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐│    │
│  │  │ ✓ Background agent "Search codebase" completed                  ││    │
│  │  │   tools: 5 · tokens: 12.5k · duration: 45s                      ││    │
│  │  └─────────────────────────────────────────────────────────────────┘│    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Interaction Flow 1: Spawning a Background Agent

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SPAWN BACKGROUND AGENT FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

User: "Run tests in background"
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ LLM generates tool call:                                                     │
│   Agent({                                                                    │
│     description: "Run tests",                                                │
│     prompt: "Run the test suite...",                                         │
│     run_in_background: true                                                  │
│   })                                                                         │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ AgentTool.call() executes:                                                   │
│   1. Validate parameters                                                     │
│   2. Resolve agent type (default: general-purpose)                          │
│   3. Determine async mode = true                                            │
│   4. createBackgroundAgentTask()                                            │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
        ┌────────────────────────┴────────────────────────┐
        │                                                 │
        ▼                                                 ▼
┌───────────────────────┐                     ┌───────────────────────┐
│ SYNC RESPONSE         │                     │ BACKGROUND THREAD     │
│                       │                     │                       │
│ Return immediately:   │                     │ agentLoopRunner()     │
│ {                     │                     │   - Execute tools     │
│   status: "async_     │                     │   - Stream LLM tokens │
│     launched",        │                     │   - Update progress   │
│   agentId: "a3k9...", │                     │   - Write to output   │
│   outputFile: ".      │                     │     file              │
│     claude/tasks/..." │                     │                       │
│ }                     │                     │ On completion:        │
│                       │                     │   $m8() → completed   │
│ UI shows:             │                     │   $z6() → notify      │
│ ◐ general-purpose     │                     │                       │
│   Run tests           │                     └───────────────────────┘
│   tools: 0            │
└───────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ StatusLine updates:                                                          │
│   Model: sonnet-4 │ /project │ 1 running ● Ctrl+F stop │ $                  │
│                               └───────────────────────┘                     │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Background agent runs...                                                     │
│   tools: 1 · tokens: 2.1k                                                    │
│   tools: 2 · tokens: 4.3k                                                    │
│   tools: 3 · tokens: 8.7k  ...                                               │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Agent completes:                                                             │
│   $m8(result) → status: "completed"                                         │
│   $z6() → show notification                                                 │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
        ┌────────────────────────┴────────────────────────┐
        │                                                 │
        ▼                                                 ▼
┌───────────────────────┐                     ┌───────────────────────┐
│ UI NOTIFICATION       │                     │ SYSTEM REMINDER       │
│                       │                     │                       │
│ ✓ Background agent    │                     │ task_status:          │
│   "Run tests"         │                     │   taskId: a3k9...     │
│   completed           │                     │   status: completed   │
│                       │                     │   description: ...    │
│ tools: 5 · tokens:    │                     │   deltaSummary: ...   │
│   12.5k · 45s         │                     │                       │
└───────────────────────┘                     └───────────────────────┘
                                                        │
                                                        ▼
                                              LLM sees in next turn
```

---

## Interaction Flow 2: Ctrl+F Kill All

**What it does:** Two-press Ctrl+F sequence to kill all running local agents, with a 2-second confirmation timeout to prevent accidental kills.

**How it works:**
1. First Ctrl+F press sets `ctrlFPressed = true` and shows confirmation in status line
2. A 2-second timeout starts; if it expires, the confirmation state resets
3. Second Ctrl+F press within 2 seconds triggers `killAllLocalAgents` (U4q)
4. Each running local_agent gets `triggerAbortSignal` (x66) called
5. Notification shows kill summary

**Why this approach:**
- Single-press would risk accidental termination of long-running agents
- 2-second window is short enough to be intentional, long enough to be comfortable
- Only kills `local_agent` type tasks, not `in_process_teammate` or `remote_agent`

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CTRL+F KILL ALL FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

StatusLine shows:
┌─────────────────────────────────────────────────────────────────────────────┐
│ sonnet-4 │ /project │ 3 running ● Ctrl+F stop │ $                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ User presses Ctrl+F
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: First Ctrl+F Press                                                   │
│                                                                              │
│   ctrlFPressed = true                                                        │
│   statusLine.showConfirmation("Press Ctrl+F again to stop 3 agents")        │
│   setTimeout(() => ctrlFPressed = false, 2000)                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                 │
        ┌────────────────────────┴────────────────────────┐
        │                                                 │
        ▼                                                 ▼
┌───────────────────────┐                     ┌───────────────────────┐
│ Timeout (2s)          │                     │ Second Ctrl+F         │
│                       │                     │ (within 2s)           │
│ ctrlFPressed = false  │                     │                       │
│ statusLine.clear()    │                     │ clearTimeout()        │
│                       │                     │ ctrlFPressed = false  │
│ No action taken       │                     │                       │
└───────────────────────┘                     └───────────┬───────────┘
                                                          │
                                                          ▼
                              ┌────────────────────────────────────────────────┐
                              │ STEP 2: Execute Kill                           │
                              │                                                │
                              │ let taskDescriptions = []                       │
                              │ for (task of tasks) {                           │
                              │   if (task.type === "local_agent"               │
                              │       && task.status === "running") {           │
                              │     triggerAbortSignal(taskId, setAppState)     │
                              │     taskDescriptions.push(task.description)     │
                              │   }                                             │
                              │ }                                               │
                              └────────────────────────┬───────────────────────┘
                                                       │
                                                       ▼
                              ┌────────────────────────────────────────────────┐
                              │ STEP 3: Each triggerAbortSignal()               │
                              │                                                │
                              │ task.abortController.abort()                    │
                              │   → LLM stream cancelled                        │
                              │   → Tool execution aborted                      │
                              │                                                │
                              │ task.unregisterCleanup()                        │
                              │   → Prevent double cleanup                      │
                              │                                                │
                              │ task.status = "killed"                          │
                              │ task.endTime = Date.now()                       │
                              │                                                │
                              │ flushOutputBuffer(taskId)                       │
                              │   → Preserve partial results                    │
                              └────────────────────────┬───────────────────────┘
                                                       │
                                                       ▼
                              ┌────────────────────────────────────────────────┐
                              │ STEP 4: Show Notification                       │
                              │                                                │
                              │ if (taskDescriptions.length === 1) {            │
                              │   text = `Background agent "${desc}" stopped`   │
                              │ } else {                                        │
                              │   text = `${count} background agents stopped`   │
                              │ }                                               │
                              │                                                │
                              │ w0({                                            │
                              │   value: text,                                  │
                              │   mode: "task-notification"                     │
                              │ })                                              │
                              └────────────────────────────────────────────────┘
                                                       │
                                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ UI shows notification:                                                       │
│                                                                              │
│   ○ 3 background agents were stopped by the user                            │
│     "task-1", "task-2", "task-3"                                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Interaction Flow 3: Task Status in System Reminder

**What it does:** Injects background task status into the LLM context each turn so the model stays aware of running/completed tasks without blocking.

**How it works:**
1. `getUnifiedTasksAttachment` (suY) is called at the start of each LLM turn
2. `pollTaskOutputs` reads output file deltas for each running task
3. Task state offsets are updated; notified terminal tasks are evicted
4. Attachments with type `task_status` are built
5. `normalizeAttachmentForAPI` converts these to `isMeta: true` user messages (visible to LLM, hidden from UI)

**Key insight:** The LLM never blocks waiting for task results. It sees status updates passively through the system reminder injection, and can choose to check details via TaskOutput tool.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TASK STATUS INJECTION FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

Background Agent Running:
┌─────────────────────────────────────────────────────────────────────────────┐
│ Task State:                                                                  │
│   id: "a3k9x2m7"                                                            │
│   type: "local_agent"                                                        │
│   status: "running"                                                          │
│   description: "Search codebase for auth patterns"                          │
│   outputOffset: 1234                                                         │
│   progress: {                                                                │
│     tokenCount: 4250,                                                        │
│     toolUseCount: 3,                                                         │
│     summary: "Found authentication module in src/auth..."                   │
│   }                                                                          │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 │ Next LLM turn begins
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ getUnifiedTasksAttachment() (suY) called:                                    │
│                                                                              │
│   1. pollTaskOutputs(appState)                                               │
│      - Read output file delta                                                │
│      - Return { attachments, updatedTaskOffsets, evictedTaskIds }           │
│                                                                              │
│   2. updateTaskState(setAppState, updatedTaskOffsets, evictedTaskIds)       │
│      - Update outputOffset for running tasks                                 │
│      - Remove notified terminal tasks                                        │
│                                                                              │
│   3. Build attachments:                                                      │
│      [{                                                                       │
│        type: "task_status",                                                  │
│        taskId: "a3k9x2m7",                                                   │
│        taskType: "local_agent",                                              │
│        status: "running",                                                    │
│        description: "Search codebase...",                                    │
│        deltaSummary: "Found authentication module..."                       │
│      }]                                                                      │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ normalizeAttachmentForAPI() converts to LLM message:                         │
│                                                                              │
│   {                                                                          │
│     type: "user",                                                            │
│     content: [                                                               │
│       {                                                                      │
│         type: "text",                                                        │
│         text: "Background agent \"Search codebase\" is running..."           │
│       }                                                                      │
│     ],                                                                       │
│     isMeta: true   // Not shown in UI, visible to LLM                        │
│   }                                                                          │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ LLM receives context:                                                        │
│                                                                              │
│   User: "Search the codebase..."                                             │
│   Assistant: "I'll spawn an agent..." [Agent tool call]                      │
│   Tool Result: { status: "async_launched", agentId: "a3k9..." }             │
│   System: Background agent "Search codebase" is running...                   │
│                                                                              │
│ LLM can now:                                                                 │
│   - Continue other work                                                      │
│   - Check task status with TaskOutput                                        │
│   - Reference running task in response                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component 1: Agent Status Component

### All States Visual Mockup

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AGENT STATUS COMPONENT STATES                        │
└─────────────────────────────────────────────────────────────────────────────┘

INITIALIZING:
┌─────────────────────────────────────────────────────────────────────────────┐
│ └─ ◐ general-purpose                                                        │
│    │  Initializing…                                                          │
└─────────────────────────────────────────────────────────────────────────────┘

RUNNING (with progress):
┌─────────────────────────────────────────────────────────────────────────────┐
│ └─ ◐ general-purpose · 3 tool uses · 4.2k tokens                            │
│    │  Searching codebase for authentication patterns                        │
└─────────────────────────────────────────────────────────────────────────────┘

RUNNING (background):
┌─────────────────────────────────────────────────────────────────────────────┐
│ └─ ◐ general-purpose [background] · 8 tool uses · 15.2k tokens             │
│    │  Running tests in background                                           │
└─────────────────────────────────────────────────────────────────────────────┘

RUNNING (teammate):
┌─────────────────────────────────────────────────────────────────────────────┐
│ └─ ◐ worker-1 [team: alpha-team] · 4 tool uses · 8.7k tokens               │
│    │  Analyzing authentication module · mailbox: 2 unread                   │
└─────────────────────────────────────────────────────────────────────────────┘

COMPLETED:
┌─────────────────────────────────────────────────────────────────────────────┐
│ └─ ✓ general-purpose · 5 tool uses · 12.5k tokens · 45s                     │
│    │  Done                                                                   │
└─────────────────────────────────────────────────────────────────────────────┘

FAILED:
┌─────────────────────────────────────────────────────────────────────────────┐
│ └─ ✗ general-purpose · 2 tool uses · 1.8k tokens                            │
│    │  Search failed: timeout after 60s                                      │
└─────────────────────────────────────────────────────────────────────────────┘

KILLED:
┌─────────────────────────────────────────────────────────────────────────────┐
│ └─ ○ general-purpose · 1 tool use · 0.5k tokens                             │
│    │  Search stopped by user                                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Source Implementation

```javascript
// ============================================
// AgentStatusComponent - Renders agent status in message area
// Location: chunks.136.mjs:328-332
// ============================================

// READABLE (for understanding):
function AgentStatusComponent({
    agentType,
    description,
    descriptionColor,
    taskDescription,
    toolUseCount,
    tokens,
    color,
    isLast,
    isResolved,
    isAsync,
    lastToolInfo,
    hideType
}) {
    // Tree prefix
    let prefix = isLast ? "└─" : "├─";

    // Continuation line
    let contPrefix = isLast ? " " : "│";

    // Status text
    let statusText;
    if (!isResolved) {
        statusText = lastToolInfo || "Initializing…";
    } else if (isAsync && isResolved) {
        statusText = taskDescription ?? "Running in the background";
    } else {
        statusText = "Done";
    }

    // Status icon
    let icon = isResolved
        ? (isAsync ? "✓" : "✓")
        : "◐"; // Spinner

    // Metrics line
    let metrics = !isAsync && isResolved ? "" : ` · ${toolUseCount} tool ${toolUseCount === 1 ? "use" : "uses"}${tokens !== null ? ` · ${formatTokens(tokens)} tokens` : ""}`;

    return (
        <Box flexDirection="column">
            <Box paddingLeft={3}>
                <Text dimColor={!isResolved}>
                    {prefix} {icon} {formatAgentBadge(agentType, description, color, hideType)}{metrics}
                </Text>
            </Box>
            <Box paddingLeft={4}>
                <Text dimColor={!isResolved}>{contPrefix}  {statusText}</Text>
            </Box>
        </Box>
    );
}
```

---

## Component 2: Status Line Indicator

### States and Transitions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STATUS LINE STATES                                   │
└─────────────────────────────────────────────────────────────────────────────┘

IDLE:
┌─────────────────────────────────────────────────────────────────────────────┐
│ sonnet-4 │ /project │ $                                                      │
└─────────────────────────────────────────────────────────────────────────────┘

1 RUNNING:
┌─────────────────────────────────────────────────────────────────────────────┐
│ sonnet-4 │ /project │ 1 running ● Ctrl+F stop │ $                            │
│                          └──────────────────┘                                │
│                            yellow text                                        │
└─────────────────────────────────────────────────────────────────────────────┘

MULTIPLE RUNNING:
┌─────────────────────────────────────────────────────────────────────────────┐
│ sonnet-4 │ /project │ 3 running ● Ctrl+F stop │ $                            │
│                          └──────────────────┘                                │
│                            yellow text                                        │
└─────────────────────────────────────────────────────────────────────────────┘

CONFIRMATION (first Ctrl+F):
┌─────────────────────────────────────────────────────────────────────────────┐
│ sonnet-4 │ /project │ Press Ctrl+F again to stop 3 agents │ $               │
│                          └────────────────────────────────────┘              │
│                                    bold text                                  │
└─────────────────────────────────────────────────────────────────────────────┘

KILLING:
┌─────────────────────────────────────────────────────────────────────────────┐
│ sonnet-4 │ /project │ Stopping 3 agents... │ $                               │
│                          └─────────────────┘                                 │
│                              dim text                                         │
└─────────────────────────────────────────────────────────────────────────────┘

STATE TRANSITIONS:
  IDLE → RUNNING (when task starts)
  RUNNING → CONFIRMATION (first Ctrl+F)
  CONFIRMATION → RUNNING (timeout after 2s)
  CONFIRMATION → KILLING (second Ctrl+F)
  KILLING → IDLE (after kill complete)
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
            hint: "Ctrl+F stop",
            color: "yellow"
        });
    }
}
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
| `local_agent` | running | -- |
| `local_bash` | running | -- |
| `in_process_teammate` | running | running |
| `remote_agent` | running | -- |
| `local_workflow` | running | -- |

---

## Component 4: Notification Toasts

### Types

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NOTIFICATION TYPES                                   │
└─────────────────────────────────────────────────────────────────────────────┘

TASK STARTED:
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ ◐ Background agent started                                               │ │
│ │   "Search codebase for authentication patterns"                          │ │
│ │   Use /tasks to manage                                                   │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘

TASK COMPLETED (single):
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ ✓ Background agent "Search codebase" completed                           │ │
│ │   tools: 5 · tokens: 12.5k · duration: 45s                               │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘

TASK FAILED (single):
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ ✗ Background agent "Run tests" failed                                     │ │
│ │   Error: Test suite exited with code 1                                    │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘

TASK KILLED (single):
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ ○ Background agent "Deploy" stopped by user                               │ │
│ │   Partial results available in output file                                │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘

TASK KILLED (multiple):
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ ○ 3 background agents were stopped by the user                            │ │
│ │   "task-1", "task-2", "task-3"                                            │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘

NOTIFICATION COLORS:
  ✓ completed  → green
  ✗ failed     → red
  ○ killed     → dim/gray
```

### Notification Timing

| Event | Delay | Duration |
|-------|-------|----------|
| Started | 0ms | 3s |
| Completed | 0ms | 5s |
| Failed | 0ms | 7s (longer for errors) |
| Killed | 0ms | 3s |

### Source Implementation

```javascript
// ============================================
// showTaskNotification - Task-specific notification display
// Location: chunks.136.mjs
// ============================================

// READABLE (for understanding):
function showTaskNotification({
    taskId,
    description,
    status,
    setAppState,
    finalMessage,
    error,
    usage,
    toolUseId,
    worktreePath,
    worktreeBranch
}) {
    let icon = getStatusIcon(status);
    let color = getStatusColor(status);

    let text;
    if (status === "completed") {
        text = `${icon} Background agent "${description}" completed\n` +
               `  tools: ${usage.toolUses} · tokens: ${formatTokens(usage.totalTokens)} · duration: ${formatDuration(usage.durationMs)}`;
    } else if (status === "failed") {
        text = `${icon} Background agent "${description}" failed\n` +
               `  Error: ${error}`;
    } else if (status === "killed") {
        text = `${icon} Background agent "${description}" stopped by user\n` +
               `  Partial results available in output file`;
    }

    showNotification({   // w0
        value: text,
        mode: "task-notification"
    });
}

// Mapping: $z6→showTaskNotification, w0→showNotification
```

---

## Component 5: Progress Display

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

## Component 6: Worktree Indicators

### Visual Indicators for Worktree Isolation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         WORKTREE INDICATORS                                  │
└─────────────────────────────────────────────────────────────────────────────┘

TASK WITH WORKTREE (in message area):
┌─────────────────────────────────────────────────────────────────────────────┐
│ └─ ◐ general-purpose [worktree: feature-branch]                             │
│    │  Running tests in isolated worktree                                    │
│    │  Path: .claude/worktrees/wt_a7x9k2m3                                   │
└─────────────────────────────────────────────────────────────────────────────┘

TASK WITH WORKTREE (in task list):
┌─────────────────────────────────────────────────────────────────────────────┐
│ ◐ a7x9k2m3  Run tests [worktree]  tools:5  tokens:12k    [x]               │
│             └─ Branch: feature-branch                                       │
└─────────────────────────────────────────────────────────────────────────────┘

WORKTREE STATUS LINE:
┌─────────────────────────────────────────────────────────────────────────────┐
│ sonnet-4 │ /project │ 1 running ● 1 worktree │ $                            │
│                          └──────────────────┘                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Keyboard Shortcuts Complete

### Global Shortcuts

| Shortcut | Action | Context | Source |
|----------|--------|---------|--------|
| `Ctrl+F` (first) | Show kill confirmation | Agents running | Key handler |
| `Ctrl+F` (second, within 2s) | Execute kill all | After first Ctrl+F | Key handler |
| `/tasks` | Open task list modal | Always | Slash command |
| `Ctrl+B` | Background running command | During Bash | Key handler |

### Task List Shortcuts

| Shortcut | Context | Action |
|----------|---------|--------|
| `↑/k` | Task list modal | Move selection up |
| `↓/j` | Task list modal | Move selection down |
| `x` | Task list modal | Stop selected task |
| `f` | Task list modal | Bring task to foreground |
| `Enter` | Task list modal | View task output |
| `Esc` | Task list modal | Close modal |

---

## Kill Functions Source Code

### triggerAbortSignal (x66)

```javascript
// ============================================
// triggerAbortSignal - Abort a specific task
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

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, K→wasAborted, i9→atomicUpdateTask, $O→flushOutputBuffer
```

### killAllLocalAgents (U4q)

```javascript
// ============================================
// killAllLocalAgents - Kill all running local agents
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

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, K→taskId, Y→task, x66→triggerAbortSignal
```

---

## Color Scheme Reference

### ANSI Color Codes

| Purpose | Foreground | ANSI Code |
|---------|------------|-----------|
| Error/Failed | Red | `\x1b[31m` |
| Success/Completed | Green | `\x1b[32m` |
| Warning/Running | Yellow | `\x1b[33m` |
| Info/Agent Badge | Blue | `\x1b[34m` |
| Planning Agent | Magenta | `\x1b[35m` |
| Help Agent | Cyan | `\x1b[36m` |
| Dim/Killed | Dim | `\x1b[2m` |
| Bold | Bold | `\x1b[1m` |
| Reset | Reset | `\x1b[0m` |

### Agent Type Colors

```javascript
// ============================================
// formatAgentBadge - Render agent type with color
// Location: chunks.136.mjs
// ============================================

// READABLE (for understanding):
const AGENT_COLORS = {
    "general-purpose": null,      // Default (no color)
    "explore": "blue",            // Code exploration
    "plan": "magenta",            // Planning agent
    "statusline-setup": "orange", // Status line config
    "claude-code-guide": "cyan"   // Help/docs agent
};

function formatAgentBadge(agentType, description, color, hideType) {
    if (hideType) {
        return <Text bold>{description || agentType}</Text>;
    }

    return (
        <>
            {color ? (
                <Text bold backgroundColor={color} color="inverseText">
                    {agentType}
                </Text>
            ) : (
                <Text bold>{agentType}</Text>
            )}
            {description && (
                <>
                    " ("
                    <Text backgroundColor={descriptionColor} color="inverseText">
                        {description}
                    </Text>
                    ")"
                </>
            )}
        </>
    );
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

## Key Design Decisions

### Decision 1: Two-Step Ctrl+F Kill

**Why**: Prevent accidental killing of long-running background agents.

**Implementation**:
1. First Ctrl+F: Show confirmation message with 2s timeout
2. Second Ctrl+F within 2s: Execute `killAllLocalAgents` (U4q)
3. After timeout: Reset confirmation state

**Trade-off**: Adds friction to the kill flow, but prevents costly accidental termination of agents that may have been running for minutes.

### Decision 2: Task Status in System Reminders

**Why**: LLM needs visibility into running background tasks without blocking.

**Implementation**:
- Poll output files each turn via `pollTaskOutputs()`
- Build `task_status` attachments via `getUnifiedTasksAttachment` (suY)
- Convert to `isMeta: true` user messages via `normalizeAttachmentForAPI`
- LLM sees tasks in context but UI does not show these meta messages

**Key insight**: The `isMeta: true` flag is what separates LLM-visible context from user-visible UI. This allows the system to inject rich task status without cluttering the conversation display.

### Decision 3: Notification Persistence

**Why**: User may not be watching terminal when task completes.

**Implementation**:
- Notifications shown briefly in NotificationArea (3-7s depending on type)
- Task `notified` flag prevents re-notification
- Terminal tasks removed from state after notification acknowledged

### Decision 4: Tree-Style Indentation

**Why**: Show hierarchy of nested subagents clearly.

**Implementation**:
- `├─` for intermediate items, `└─` for last item in group
- `│` for continuation lines
- `dimColor` for resolved/completed items
- Consistent with standard tree rendering (like `tree` command output)

---

## Key Insight

The UI design follows **progressive disclosure**:

1. **Status line** - Minimal, always visible (count + kill hint)
2. **Inline progress** - During active execution (tool counts, summaries)
3. **Task list** - On-demand overview via `/tasks`
4. **Output file** - Full details when needed
5. **System reminder** - LLM-only context via `isMeta: true` injection

This ensures users can quickly understand what is happening without being overwhelmed, while still having access to complete information when required. The LLM gets its own separate channel of task awareness through the system reminder integration.

---

**Last Updated**: 2026-03-28
**Version**: Claude Code 2.1.76
**Status**: Complete - Full UI interaction documentation with interaction flows, visual mockups, keyboard shortcuts, and source code
