# System Reminder Types: Todo & Task Management

> **Module**: System Reminders - Todo/Task Types
> **Version**: Claude Code 2.1.76
> **Source**: `chunks.173.mjs:801-869`, `chunks.142.mjs:2624-2756`

---

## Table of Contents

- [Overview](#overview)
- [v2.1.76 Changes](#v2176-changes)
- [todo](#todo)
- [todo_reminder](#todo_reminder)
- [task_reminder](#task_reminder)
- [task_status](#task_status)
- [task_progress](#task_progress)
- [Frequency Throttling Logic](#frequency-throttling-logic)
- [Configuration](#configuration)

---

## Overview

Todo and task management types help the LLM track and manage work:

1. **todo** - Todo list state changes (from file watch or direct tool use)
2. **todo_reminder** - Periodic reminder to use TodoWrite
3. **task_reminder** - Periodic reminder to use Task tools (new system)
4. **task_status** - Background task status changes
5. **task_progress** - Progress messages from background tasks

These types use frequency throttling to avoid spamming the conversation.

---

## v2.1.76 Changes

### Task Tools No Longer Require activeForm

In v2.1.38, the task tools (`TaskCreate`, `TaskUpdate`, `TaskGet`, `TaskList`) were only available when an `activeForm` was present in the session context. The `getTaskReminderAttachment` producer and the `task_reminder` normalization both checked for an active form before producing any task-related output.

In v2.1.76, this restriction has been removed. The task tools are now always available when the task system is enabled (`jH()` / `isTaskSystemEnabled()` returns true), regardless of whether a form is active. The `getTaskReminderAttachment` producer no longer checks for `activeForm`, and the `task_reminder` normalizer no longer gates on `activeForm`.

**v2.1.38 producer (excerpt):**
```javascript
// Old: required activeForm check
if (!sessionContext.activeForm) return [];
if (!isTaskSystemEnabled()) return [];
```

**v2.1.76 producer (excerpt):**
```javascript
// New: no activeForm check
if (!isTaskSystemEnabled()) return [];
```

**Impact:** Task tool reminders now appear in any session where the task system is enabled, not just when a task creation form was previously opened. This makes the task tracking feature more accessible for casual use.

---

## Trigger Source Summary

Each reminder type has a specific producer function that determines when it triggers:

| Type | Producer Function | Location | Key Trigger Logic |
|------|-------------------|----------|-------------------|
| `todo` | `wIY` (getChangedFilesAttachment) | chunks.142.mjs:2285-2335 | File watch detects modification of todo file |
| `todo_reminder` | `fIY` (getTodoReminderAttachment) | chunks.142.mjs:2645-2661 | `turnsSinceLastTodoWrite >= 10 && turnsSinceLastReminder >= 10` |
| `task_reminder` | `NIY` (getTaskReminderAttachment) | chunks.142.mjs:2684-2701 | Same thresholds + `jH()` (isTaskSystemEnabled); no activeForm required (v2.1.76) |
| `task_status` | `vIY` (getUnifiedTasksAttachment) | chunks.142.mjs:2719-2756 | State change in `di4(appState)` |
| `task_progress` | `vIY` (getUnifiedTasksAttachment) | chunks.142.mjs:2719-2756 | Progress message + `turnsSinceProgress >= 3` |

### Timing Constants

```javascript
// ============================================
// Task reminder timing constants
// Location: chunks.142.mjs:2918-2928
// ============================================

// Todo/Task reminder throttle thresholds
eW6 = {
    TURNS_SINCE_WRITE: 10,       // Turns since last TodoWrite/TaskUpdate
    TURNS_BETWEEN_REMINDERS: 10  // Turns since last reminder sent
}

// Task progress delivery threshold
ghY = 3  // TASK_PROGRESS_TURNS_THRESHOLD (chunks.142.mjs:2863)

// Unused constant (for future)
UhY = {
    TURNS_BETWEEN_REMINDERS: 10
}
```

---

## todo

### What It Does

Provides the current todo list state. Triggered either by:
1. Todo file modification (via file watch)
2. Direct TodoWrite tool invocation

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| File watch | Todo file modified externally |
| TodoWrite tool | Tool was just used |
| Tool available | TodoWrite tool is in available tools list |

### Source Code

#### Producer (from file watch)

```javascript
// ============================================
// getChangedFilesAttachment - Todo file handling
// Location: chunks.142.mjs:2300-2310
// ============================================

// ORIGINAL (for source lookup):
if (w === Lp(_)) {
    if (!A.options.tools.some((X) => X.name === cg)) return null;
    let J = UB(_);
    return {
        type: "todo",
        content: J,
        itemCount: J.length,
        context: "file-watch"
    }
}

// READABLE (for understanding):
if (absolutePath === getTodoFilePath(agentId)) {
    if (!sessionContext.options.tools.some(t => t.name === TodoWriteTool.name)) {
        return null;
    }

    let todoContent = loadTodoFile(agentId);

    return {
        type: "todo",
        content: todoContent,
        itemCount: todoContent.length,
        context: "file-watch"
    };
}

// Mapping: w→absolutePath, Lp→getTodoFilePath, _→agentId, A→sessionContext, cg→TodoWriteTool, UB→loadTodoFile, J→todoContent
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - todo case
// Note: The 'todo' type appears to be handled directly, not via a case statement
// Location: chunks.174.mjs (implied from file watch integration)
// ============================================

// The todo attachment is created from file watch changes and delivered
// through the changed_files mechanism, not as a standalone normalization case.
```

### Output Format (Empty List)

```markdown
<system-reminder>
This is a reminder that your todo list is currently empty. DO NOT mention this to the user explicitly because they are already aware. If you are working on tasks that would benefit from a todo list please use the TodoWrite tool to create one. If not, please feel free to ignore. Again do not mention this message to the user.
</system-reminder>
```

### Output Format (With Items)

```markdown
<system-reminder>
Your todo list has changed. DO NOT mention this explicitly to the user. Here are the latest contents of your todo list:

1. [pending] Implement feature X
2. [in_progress] Fix bug in module Y
3. [completed] Write tests for Z. Continue on with the tasks at hand if applicable.
</system-reminder>
```

---

## todo_reminder

### What It Does

Periodically reminds the LLM to use TodoWrite for tracking progress when it hasn't been used recently.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Turns since write | >= `TURNS_SINCE_WRITE` (10) |
| Turns since reminder | >= `TURNS_BETWEEN_REMINDERS` (10) |
| Tool available | TodoWrite in available tools |
| Has messages | Message history exists |

### Source Code

#### History Analysis

```javascript
// ============================================
// analyzeToDoUsageHistory - Analyze todo tool usage
// Location: chunks.142.mjs:2624-2643
// ============================================

// ORIGINAL (for source lookup):
function ZIY(A) {
    let q = -1,
        K = -1,
        Y = 0,
        z = 0;
    for (let w = A.length - 1; w >= 0; w--) {
        let H = A[w];
        if (H?.type === "assistant") {
            if (bg1(H)) continue;
            if (q === -1 && "message" in H && Array.isArray(H.message?.content) && H.message.content.some(($) => $.type === "tool_use" && $.name === cg)) q = w;
            if (q === -1) Y++;
            if (K === -1) z++
        } else if (K === -1 && H?.type === "attachment" && H.attachment.type === "todo_reminder") K = w;
        if (q !== -1 && K !== -1) break
    }
    return {
        turnsSinceLastTodoWrite: Y,
        turnsSinceLastReminder: z
    }
}

// READABLE (for understanding):
function analyzeToDoUsageHistory(messages) {
    let lastTodoWriteIndex = -1;
    let lastReminderIndex = -1;
    let turnsSinceLastTodoWrite = 0;
    let turnsSinceLastReminder = 0;

    for (let i = messages.length - 1; i >= 0; i--) {
        let msg = messages[i];

        if (msg?.type === "assistant") {
            if (isEmptyAssistantMessage(msg)) continue;

            if (lastTodoWriteIndex === -1 &&
                "message" in msg &&
                Array.isArray(msg.message?.content) &&
                msg.message.content.some(block =>
                    block.type === "tool_use" && block.name === TodoWriteTool.name
                )) {
                lastTodoWriteIndex = i;
            }

            if (lastTodoWriteIndex === -1) turnsSinceLastTodoWrite++;
            if (lastReminderIndex === -1) turnsSinceLastReminder++;

        } else if (lastReminderIndex === -1 &&
                   msg?.type === "attachment" &&
                   msg.attachment.type === "todo_reminder") {
            lastReminderIndex = i;
        }

        if (lastTodoWriteIndex !== -1 && lastReminderIndex !== -1) break;
    }

    return {
        turnsSinceLastTodoWrite,
        turnsSinceLastReminder
    };
}

// Mapping: ZIY→analyzeToDoUsageHistory, A→messages, q→lastTodoWriteIndex, K→lastReminderIndex, Y→turnsSinceLastTodoWrite, z→turnsSinceLastReminder, w→i, H→msg, bg1→isEmptyAssistantMessage, cg→TodoWriteTool
```

#### Producer Function

```javascript
// ============================================
// getTodoReminderAttachment - Produce todo reminder
// Location: chunks.142.mjs:2645-2661
// ============================================

// ORIGINAL (for source lookup):
async function fIY(A, q) {
    if (!q.options.tools.some((z) => z.name === cg)) return [];
    if (!A || A.length === 0) return [];
    let {
        turnsSinceLastTodoWrite: K,
        turnsSinceLastReminder: Y
    } = ZIY(A);
    if (K >= eW6.TURNS_SINCE_WRITE && Y >= eW6.TURNS_BETWEEN_REMINDERS) {
        let z = UB(q.agentId ?? U6());
        return [{
            type: "todo_reminder",
            content: z,
            itemCount: z.length
        }]
    }
    return []
}

// READABLE (for understanding):
async function getTodoReminderAttachment(messages, sessionContext) {
    if (!sessionContext.options.tools.some(t => t.name === TodoWriteTool.name)) {
        return [];
    }

    if (!messages || messages.length === 0) return [];

    let { turnsSinceLastTodoWrite, turnsSinceLastReminder } =
        analyzeToDoUsageHistory(messages);

    if (turnsSinceLastTodoWrite >= TODO_REMINDER_CONSTANTS.TURNS_SINCE_WRITE &&
        turnsSinceLastReminder >= TODO_REMINDER_CONSTANTS.TURNS_BETWEEN_REMINDERS) {

        let todoContent = loadTodoFile(sessionContext.agentId ?? getSessionId());

        return [{
            type: "todo_reminder",
            content: todoContent,
            itemCount: todoContent.length
        }];
    }

    return [];
}

// Mapping: fIY→getTodoReminderAttachment, A→messages, q→sessionContext, K→turnsSinceLastTodoWrite, Y→turnsSinceLastReminder, ZIY→analyzeToDoUsageHistory, eW6→TODO_REMINDER_CONSTANTS, UB→loadTodoFile, cg→TodoWriteTool
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - todo_reminder case
// Location: chunks.174.mjs:134-147
// ============================================

// ORIGINAL (for source lookup):
case "todo_reminder": {
    let K = A.content.map((z, w) => `${w+1}. [${z.status}] ${z.content}`).join(`
`),
        Y = `The TodoWrite tool hasn't been used recently. If you're working on tasks that would benefit from tracking progress, consider consider using the TodoWrite tool to track progress, organize complex tasks, and demonstrate thoroughness to the user.
...`;
    return b5([p1({
        content: Y,
        isMeta: !0
    })])
}
```

### Output Format

```markdown
<system-reminder>
The TodoWrite tool hasn't been used recently. If you're working on tasks that would benefit from tracking progress, consider using the TodoWrite tool to track progress, organize complex tasks, and demonstrate thoroughness to the user.

It also helps the user understand the progress of the task and overall progress of their requests.

**Use this tool proactively in these scenarios:**

- Complex multi-step tasks - When a task requires 3 or more distinct steps or actions
- Non-trivial and complex tasks - Tasks that require careful planning or multiple operations
- Plan mode - When using plan mode, create a task list to track the work
- User explicitly requests todo list - When users directly ask you to use the todo list
- User provides multiple tasks - When users provide a list of things to be done (numbered or comma-separated)

When you start working on a task, mark it as in_progress BEFORE beginning work. When you complete a task, mark it as completed and add any new follow-up tasks discovered during implementation.

If you decide a task is no longer needed, you can delete it by setting status to 'deleted'.

NOTE: Don't use this tool for conversational or informational tasks where no actual work is being done.


Here are the existing contents of your todo list:

[1. [pending] Implement feature X
2. [in_progress] Fix bug in module Y]
</system-reminder>
```

---

## task_reminder

### What It Does

Periodically reminds the LLM to use the Task tools (TaskCreate, TaskGet, TaskUpdate, TaskList) for tracking progress when using the new task system.

**v2.1.76 change:** The `activeForm` guard has been removed. The reminder now fires whenever the task system is enabled and the turn/reminder thresholds are met, regardless of whether a task form was previously opened.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Tasks enabled | `jH()` returns true (new task system) |
| Turns since management | >= `TURNS_SINCE_WRITE` (10) |
| Turns since reminder | >= `TURNS_BETWEEN_REMINDERS` (10) |
| Tool available | TaskUpdate tool in available tools |
| (v2.1.76) No activeForm required | Previously required `activeForm` check removed |

### Source Code

#### History Analysis

```javascript
// ============================================
// analyzeTaskUsageHistory - Analyze task tool usage
// Location: chunks.142.mjs:2663-2682
// ============================================

// ORIGINAL (for source lookup):
function VIY(A) {
    let q = -1,
        K = -1,
        Y = 0,
        z = 0;
    for (let w = A.length - 1; w >= 0; w--) {
        let H = A[w];
        if (H?.type === "assistant") {
            if (bg1(H)) continue;
            if (q === -1 && "message" in H && Array.isArray(H.message?.content) && H.message.content.some(($) => $.type === "tool_use" && ($.name === Nh || $.name === DR))) q = w;
            if (q === -1) Y++;
            if (K === -1) z++
        } else if (K === -1 && H?.type === "attachment" && H.attachment.type === "task_reminder") K = w;
        if (q !== -1 && K !== -1) break
    }
    return {
        turnsSinceLastTaskManagement: Y,
        turnsSinceLastReminder: z
    }
}

// READABLE (for understanding):
function analyzeTaskUsageHistory(messages) {
    let lastTaskManagementIndex = -1;
    let lastReminderIndex = -1;
    let turnsSinceLastTaskManagement = 0;
    let turnsSinceLastReminder = 0;

    for (let i = messages.length - 1; i >= 0; i--) {
        let msg = messages[i];

        if (msg?.type === "assistant") {
            if (isEmptyAssistantMessage(msg)) continue;

            if (lastTaskManagementIndex === -1 &&
                "message" in msg &&
                Array.isArray(msg.message?.content) &&
                msg.message.content.some(block =>
                    block.type === "tool_use" &&
                    (block.name === TaskCreate.name || block.name === TaskUpdate.name)
                )) {
                lastTaskManagementIndex = i;
            }

            if (lastTaskManagementIndex === -1) turnsSinceLastTaskManagement++;
            if (lastReminderIndex === -1) turnsSinceLastReminder++;

        } else if (lastReminderIndex === -1 &&
                   msg?.type === "attachment" &&
                   msg.attachment.type === "task_reminder") {
            lastReminderIndex = i;
        }

        if (lastTaskManagementIndex !== -1 && lastReminderIndex !== -1) break;
    }

    return {
        turnsSinceLastTaskManagement,
        turnsSinceLastReminder
    };
}

// Mapping: VIY→analyzeTaskUsageHistory, A→messages, q→lastTaskManagementIndex, K→lastReminderIndex, Y→turnsSinceLastTaskManagement, z→turnsSinceLastReminder, Nh→TaskCreate, DR→TaskUpdate
```

#### Producer Function (v2.1.76)

```javascript
// ============================================
// getTaskReminderAttachment - Produce task reminder
// Location: chunks.142.mjs:2684-2701
// ============================================

// ORIGINAL (for source lookup):
async function NIY(A, q) {
    if (!jH()) return [];
    if (!q.options.tools.some((z) => z.name === DR)) return [];
    if (!A || A.length === 0) return [];
    let {
        turnsSinceLastTaskManagement: K,
        turnsSinceLastReminder: Y
    } = VIY(A);
    if (K >= eW6.TURNS_SINCE_WRITE && Y >= eW6.TURNS_BETWEEN_REMINDERS) {
        let z = WX(WM());
        return [{
            type: "task_reminder",
            content: z,
            itemCount: z.length
        }]
    }
    return []
}

// READABLE (for understanding):
// v2.1.76: No longer checks for activeForm before proceeding
async function getTaskReminderAttachment(messages, sessionContext) {
    // Check if new task system is enabled
    if (!isTaskSystemEnabled()) return [];

    // Check if TaskUpdate tool is available
    if (!sessionContext.options.tools.some(t => t.name === TaskUpdate.name)) {
        return [];
    }

    if (!messages || messages.length === 0) return [];

    let { turnsSinceLastTaskManagement, turnsSinceLastReminder } =
        analyzeTaskUsageHistory(messages);

    if (turnsSinceLastTaskManagement >= TODO_REMINDER_CONSTANTS.TURNS_SINCE_WRITE &&
        turnsSinceLastReminder >= TODO_REMINDER_CONSTANTS.TURNS_BETWEEN_REMINDERS) {

        let tasks = formatTasksForReminder(getAllTasks());

        return [{
            type: "task_reminder",
            content: tasks,
            itemCount: tasks.length
        }];
    }

    return [];
}

// Mapping: NIY→getTaskReminderAttachment, A→messages, q→sessionContext, K→turnsSinceLastTaskManagement, Y→turnsSinceLastReminder, VIY→analyzeTaskUsageHistory, jH→isTaskSystemEnabled, DR→TaskUpdate, WX→formatTasksForReminder, WM→getAllTasks
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - task_reminder case
// Location: chunks.174.mjs:149-163
// ============================================

// ORIGINAL (for source lookup):
case "task_reminder": {
    if (!jH()) return [];
    let K = A.content.map((z) => `#${z.id}. [${z.status}] ${z.subject}`).join(`
`),
        Y = `The task tools haven't been used recently. If you're working on tasks that would benefit from tracking progress, consider on these with ${Nh} to add new tasks and ${DR} to update task status (set to in_progress when starting, completed when done). Also consider cleaning up the task list if it has become stale. Only use these if relevant to the current work. This is just a sample of the task list, for the full task list use ${TaskList.name}.

IMPORTANT: Only use Task tools for tasks that match the tool descriptions - don't use them for general planning or tracking outside of that scope. This is just a sample of the task list, for the full task list use ${TaskList.name}.
`;
    if (K.length > 0) Y += `

Here are the existing tasks:

${K}`;
    return b5([p1({
        content: Y,
        isMeta: !0
    })])
}

// Mapping: A→attachment, K→formattedTasks, Y→reminderContent, _9→wrapWithSystemReminderTags, c6→createUserMessage, jH→isTaskSystemEnabled, Nh→TaskCreate, DR→TaskUpdate
```

---

## task_status

### What It Does

Notifies the LLM about background task status changes (started, completed, stopped, etc.).

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Background task | Task is running in background |
| Status change | Task status has changed |

### Source Code

#### Producer (from unified tasks)

```javascript
// ============================================
// getUnifiedTasksAttachment - Task status extraction
// Location: chunks.142.mjs:2719-2756
// ============================================

// ORIGINAL (for source lookup):
async function vIY(A, q) {
    let K = await A.getAppState(),
        {
            attachments: Y,
            progressAttachments: z,
            updatedTasks: w
        } = di4(K),
        H = TIY(q),
        $ = z.filter((J) => {
            return (H.get(J.taskId) ?? 1 / 0) >= ghY
        });
    // ... progress handling ...
    let O = Y.map((J) => ({
            type: "task_status",
            taskId: J.taskId,
            taskType: J.taskType,
            status: J.status,
            description: J.description,
            deltaSummary: J.deltaSummary
        })),
        // ...
    return [...O, ..._]
}
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - task_status case
// Location: chunks.174.mjs:330-341
// ============================================

// ORIGINAL (for source lookup):
case "task_status": {
    let K = A.status === "killed" ? "stopped" : A.status;
    if (A.status === "killed") return [p1({
        content: af(`Task "${A.description}" (${A.taskId}) was stopped by the user.`),
        isMeta: !0
    })];
    let Y = [`Task ${A.taskId}`, `(type: ${A.taskType})`, `(status: ${K})`, `(description: ${A.description})`];
    if (A.deltaSummary) Y.push(`Delta: ${A.deltaSummary}`);
    return Y.push("You can check its output using the TaskOutput tool."), [c6({
        content: af(Y.join(" ")),
        isMeta: !0
    })]
}

// READABLE (for understanding):
case "task_status": {
    let displayStatus = attachment.status === "killed"
        ? "stopped"
        : attachment.status;

    if (attachment.status === "killed") {
        return [createUserMessage({
            content: wrapInXmlTag(`Task "${attachment.description}" (${attachment.taskId}) was stopped by the user.`),
            isMeta: true
        })];
    }

    let parts = [
        `Task ${attachment.taskId}`,
        `(type: ${attachment.taskType})`,
        `(status: ${displayStatus})`,
        `(description: ${attachment.description})`
    ];

    if (attachment.deltaSummary) {
        parts.push(`Delta: ${attachment.deltaSummary}`);
    }

    parts.push("You can check its output using the TaskOutput tool.");

    return [createUserMessage({
        content: wrapInXmlTag(parts.join(" ")),
        isMeta: true
    })];
}

// Mapping: A→attachment, K→displayStatus, Y→parts, tI→wrapInXmlTag, c6→createUserMessage
```

### Output Format

```markdown
<system-reminder>
Task task-123 (type: background-agent) (status: running) (description: Searching codebase for patterns) Delta: Found 5 matches. You can check its output using the TaskOutput tool.
</system-reminder>
```

### Output Format (Killed)

```markdown
<system-reminder>
Task "Analyzing logs" (task-456) was stopped by the user.
</system-reminder>
```

---

## task_progress

### What It Does

Delivers progress messages from background tasks to keep the LLM informed of ongoing work.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Background task | Task is producing progress messages |
| Turn threshold | >= `TASK_PROGRESS_TURNS_THRESHOLD` (3) turns since last progress |

### Source Code

#### Turn Threshold Check

```javascript
// ============================================
// getTaskProgressHistory - Get turns since last progress per task
// Location: chunks.142.mjs:2703-2717
// ============================================

// ORIGINAL (for source lookup):
function TIY(A) {
    let q = new Map;
    if (!A || A.length === 0) return q;
    let K = new Set,
        Y = 0;
    for (let z = A.length - 1; z >= 0; z--) {
        let w = A[z];
        if (w?.type === "assistant" && !bg1(w)) Y++;
        else if (w?.type === "attachment" && w.attachment.type === "task_progress") {
            let H = w.attachment.taskId;
            if (!K.has(H)) q.set(H, Y), K.add(H)
        }
    }
    return q
}

// READABLE (for understanding):
function getTaskProgressHistory(messages) {
    let turnsSinceProgress = new Map();
    if (!messages || messages.length === 0) return turnsSinceProgress;

    let seenTasks = new Set();
    let turnCount = 0;

    for (let i = messages.length - 1; i >= 0; i--) {
        let msg = messages[i];

        if (msg?.type === "assistant" && !isEmptyAssistantMessage(msg)) {
            turnCount++;
        } else if (msg?.type === "attachment" &&
                   msg.attachment.type === "task_progress") {
            let taskId = msg.attachment.taskId;
            if (!seenTasks.has(taskId)) {
                turnsSinceProgress.set(taskId, turnCount);
                seenTasks.add(taskId);
            }
        }
    }

    return turnsSinceProgress;
}

// Mapping: TIY→getTaskProgressHistory, A→messages, q→turnsSinceProgress, K→seenTasks, Y→turnCount, z→i, w→msg, H→taskId
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - task_progress case
// Location: chunks.173.mjs:1053-1057
// ============================================

// ORIGINAL (for source lookup):
case "task_progress":
    return [p1({
        content: af(A.message),
        isMeta: !0
    })];

// READABLE (for understanding):
case "task_progress":
    return [createUserMessage({
        content: wrapInXmlTag(attachment.message),
        isMeta: true
    })];

// Mapping: A→attachment, af→wrapInXmlTag, p1→createUserMessage
```

### Output Format

```markdown
<system-reminder>
Background task progress: Analyzed 50/100 files...
</system-reminder>
```

---

## unified_tasks

### What It Does

Produces status updates for background/async tasks. This is the primary producer for `task_status` attachments, extracting task state changes from the application state and converting them to attachments for the LLM.

### How It Works

The `suY` function:
1. Gets the current app state
2. Calls `wY4` to extract task state changes and progress updates
3. Maps task changes to `task_status` attachments
4. Handles task offsets and evictions for state management

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Task state change | Background task status has changed |
| App state available | Session has accessible app state |

### Source Code

#### Producer Function

```javascript
// ============================================
// getUnifiedTasksAttachment - Produce unified task status
// Location: chunks.147.mjs:1033-1047
// ============================================

// ORIGINAL (for source lookup):
async function suY(A) {
    let q = A.getAppState(),
        {
            attachments: K,
            updatedTaskOffsets: Y,
            evictedTaskIds: z
        } = await wY4(q);
    return OY4(A.setAppState, Y, z), K.map((_) => ({
        type: "task_status",
        taskId: _.taskId,
        taskType: _.taskType,
        status: _.status,
        description: _.description,
        deltaSummary: _.deltaSummary
    }))
}

// READABLE (for understanding):
async function getUnifiedTasksAttachment(sessionContext) {
    let appState = await sessionContext.getAppState();

    // Extract task state changes from app state
    let {
        attachments,           // Task status changes to inject
        updatedTaskOffsets,    // Updated task offsets for state
        evictedTaskIds         // Tasks that were evicted from state
    } = await extractTaskStateChanges(appState);

    // Update app state with new offsets and handle evictions
    updateAppStateWithTaskChanges(
        sessionContext.setAppState,
        updatedTaskOffsets,
        evictedTaskIds
    );

    // Map internal task state to attachments
    return attachments.map(task => ({
        type: "task_status",
        taskId: task.taskId,
        taskType: task.taskType,
        status: task.status,
        description: task.description,
        deltaSummary: task.deltaSummary
    }));
}

// Mapping: suY→getUnifiedTasksAttachment, A→sessionContext, q→appState, K→attachments, Y→updatedTaskOffsets, z→evictedTaskIds, _→task, wY4→extractTaskStateChanges, OY4→updateAppStateWithTaskChanges
```

### Key Insights

1. **State extraction**: The `wY4` function handles the complex logic of comparing previous and current task states to detect changes.

2. **Offset management**: Task offsets track position in the state, enabling incremental updates rather than full state transfers.

3. **Eviction handling**: When tasks are removed from state, their IDs are tracked and cleaned up to prevent memory leaks.

4. **Type mapping**: Internal task representations are mapped to the simpler `task_status` attachment format for LLM consumption.

---

## Frequency Throttling Logic

### Overview

Both `todo_reminder` and `task_reminder` use frequency throttling to avoid spam:

```
┌───────────────────────────────────────────────────────────────────┐
│                    Reminder Throttling Logic                       │
└───────────────────────────────────────────────────────────────────┘

Step 1: Analyze message history backward
    │
    ├── Count turns since last tool use (TodoWrite / TaskUpdate)
    │
    └── Count turns since last reminder attachment

Step 2: Check thresholds
    │
    ├── turnsSinceLastToolUse >= TURNS_SINCE_WRITE (10)
    │
    └── turnsSinceLastReminder >= TURNS_BETWEEN_REMINDERS (10)

Step 3: If both conditions met
    │
    └── Produce reminder attachment
```

### Why Two Thresholds?

| Threshold | Purpose |
|-----------|---------|
| `TURNS_SINCE_WRITE` | Ensures tool hasn't been used recently |
| `TURNS_BETWEEN_REMINDERS` | Prevents reminder spam |

Both must be satisfied to produce a reminder. This means:
- If the tool was just used, no reminder
- If a reminder was just sent, no reminder
- Only send when both conditions are stale

---

## Configuration

### Constants

```javascript
// ============================================
// Task reminder constants
// Location: chunks.142.mjs:2918-2928
// ============================================

// Todo reminder constants
eW6 = {
    TURNS_SINCE_WRITE: 10,
    TURNS_BETWEEN_REMINDERS: 10
}

// Task reminder constants
UhY = {
    TURNS_BETWEEN_REMINDERS: 10
}

// Task progress threshold
ghY = 3  // TASK_PROGRESS_TURNS_THRESHOLD
```

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `CLAUDE_CODE_DISABLE_ATTACHMENTS` | Disables all attachment production |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure

Key functions in this document:

- `getTodoReminderAttachment` (fIY) - Todo reminder producer, `chunks.142.mjs:2645-2661`
- `getTaskReminderAttachment` (NIY) - Task reminder producer, `chunks.142.mjs:2684-2701`
- `getUnifiedTasksAttachment` (vIY) - Unified task producer, `chunks.142.mjs:2719-2756`
- `analyzeToDoUsageHistory` (ZIY) - Todo usage analyzer, `chunks.142.mjs:2624-2643`
- `analyzeTaskUsageHistory` (VIY) - Task usage analyzer, `chunks.142.mjs:2663-2682`
- `getTaskProgressHistory` (TIY) - Task progress turn counter, `chunks.142.mjs:2703-2717`
- `loadTodoFile` (UB) - Load todo file contents
- `getTodoFilePath` (Lp) - Get todo file path
- `TodoWriteTool` (cg) - TodoWrite tool reference
- `TaskCreate` (Nh) - TaskCreate tool reference
- `TaskUpdate` (DR) - TaskUpdate tool reference
- `TODO_REMINDER_CONSTANTS` (eW6) - Throttle constants
- `TASK_PROGRESS_TURNS_THRESHOLD` (ghY) - Progress threshold

---

## Related Documents

- [README.md](./README.md) - Documentation index
- [implementation_details.md](./implementation_details.md) - Core implementation
- [types_status_budget.md](./types_status_budget.md) - Status notifications
