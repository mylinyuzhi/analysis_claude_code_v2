# UI Interaction Complete V6 - Subagent & Background Agents (Claude Code 2.1.76)

> Complete UI interaction documentation for subagent and background agent systems including React component architecture, visual mockups, keyboard shortcuts, interaction flows, status indicators, notification system, and system reminder integration.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified_v5.md](./cross_validation_unified_v5.md) - Unified symbol verification

Key functions in this document:
- `U4q` - killAllLocalAgents — `chunks.146.mjs:2029`
- `x66` - triggerAbortSignal — `chunks.146.mjs:2012`
- `nl4` - updateTaskProgressWithTelemetry — `chunks.146.mjs:2059`
- `suY` - getUnifiedTasksAttachment — `chunks.147.mjs:1033`
- `w0` - showNotification — `chunks.14.mjs`
- `$z6` - showTaskNotification — `chunks.136.mjs`

---

## Complete TUI Architecture

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
│  │  │          tools: 3 · tokens: 4.2k                                 ││    │
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
│ getUnifiedTasksAttachment() called:                                          │
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
// Vc4 - AgentStatusComponent
// Location: chunks.136.mjs:328332
// ============================================

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

---

## Component 3: Notification System

### Notification Types and Formatting

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NOTIFICATION TYPES                                   │
└─────────────────────────────────────────────────────────────────────────────┘

TASK COMPLETED (single):
┌─────────────────────────────────────────────────────────────────────────────┐
│ ✓ Background agent "Search codebase" completed                              │
│   tools: 5 · tokens: 12.5k · duration: 45s                                  │
└─────────────────────────────────────────────────────────────────────────────┘

TASK FAILED (single):
┌─────────────────────────────────────────────────────────────────────────────┐
│ ✗ Background agent "Run tests" failed                                       │
│   Error: Test suite exited with code 1                                      │
└─────────────────────────────────────────────────────────────────────────────┘

TASK KILLED (single):
┌─────────────────────────────────────────────────────────────────────────────┐
│ ○ Background agent "Deploy" stopped by user                                 │
│   Partial results available in output file                                  │
└─────────────────────────────────────────────────────────────────────────────┘

TASK KILLED (multiple):
┌─────────────────────────────────────────────────────────────────────────────┐
│ ○ 3 background agents were stopped by the user                              │
│   "task-1", "task-2", "task-3"                                              │
└─────────────────────────────────────────────────────────────────────────────┘

NOTIFICATION COLORS:
  ✓ completed  → green
  ✗ failed     → red
  ○ killed     → dim/gray
```

### Source Implementation

```javascript
// ============================================
// $z6 - showTaskNotification
// Location: chunks.136.mjs
// ============================================

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

    showNotification({
        value: text,
        mode: "task-notification"
    });
}

function getStatusIcon(status) {
    switch (status) {
        case "completed": return "✓";
        case "failed": return "✗";
        case "killed": return "○";
        default: return "○";
    }
}

function getStatusColor(status) {
    switch (status) {
        case "completed": return "green";
        case "failed": return "red";
        case "killed": return "gray";
        default: return "gray";
    }
}
```

---

## Component 4: Task List Modal (/tasks)

### Layout and Keyboard Navigation

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

KEYBOARD NAVIGATION:
  ↑/k     Move selection up
  ↓/j     Move selection down
  x       Stop selected task (triggerAbortSignal)
  f       Bring task to foreground (if running)
  Enter   View task output (readOutputFileDelta)
  Esc     Close modal
```

---

## Color Scheme Reference

### ANSI Color Codes

| Purpose | Foreground | Background | ANSI Code |
|---------|------------|------------|-----------|
| Error/Failed | Red | - | `\x1b[31m` |
| Success/Completed | Green | - | `\x1b[32m` |
| Warning/Running | Yellow | - | `\x1b[33m` |
| Info/Agent Badge | Blue | - | `\x1b[34m` |
| Planning Agent | Magenta | - | `\x1b[35m` |
| Help Agent | Cyan | - | `\x1b[36m` |
| Dim/Killed | Dim | - | `\x1b[2m` |
| Bold | Bold | - | `\x1b[1m` |
| Reset | Reset | - | `\x1b[0m` |

### Agent Type Colors

```javascript
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

## Key Design Decisions

### Decision 1: Two-Step Ctrl+F Kill

**Why**: Prevent accidental killing of long-running background agents.

**Implementation**:
1. First Ctrl+F: Show confirmation message with 2s timeout
2. Second Ctrl+F within 2s: Execute killAllLocalAgents()
3. After timeout: Reset confirmation state

### Decision 2: Task Status in System Reminders

**Why**: LLM needs visibility into running background tasks without blocking.

**Implementation**:
- Poll output files each turn via `pollTaskOutputs()`
- Build `task_status` attachments
- Convert to `isMeta: true` user messages
- LLM sees tasks in context but UI doesn't show

### Decision 3: Notification Persistence

**Why**: User may not be watching terminal when task completes.

**Implementation**:
- Notifications shown briefly in NotificationArea
- Task `notified` flag prevents re-notification
- Terminal tasks removed from state after notification acknowledged

### Decision 4: Tree-Style Indentation

**Why**: Show hierarchy of nested subagents.

**Implementation**:
- `├─` for intermediate items
- `└─` for last item in group
- `│` for continuation lines
- `dimColor` for resolved/completed items

---

## Related Documents

- [agent_tool_complete_source_v4.md](./agent_tool_complete_source_v4.md) - AgentTool
- [task_lifecycle_complete_source_v7.md](../26_background_agents/task_lifecycle_complete_source_v7.md) - Task lifecycle
- [system_reminder_integration_complete_v10.md](./system_reminder_integration_complete_v10.md) - System reminder integration
- [key_algorithms_deep_dive_v11.md](./key_algorithms_deep_dive_v11.md) - Algorithm analysis

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - All UI interactions documented with visual mockups and source code