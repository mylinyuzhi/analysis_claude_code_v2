# Cross-Module Integration Analysis (Claude Code 2.1.76)

> Complete analysis of interactions between Tools (05), MCP (06), Plan Mode (12), Task System (13), and System Reminder (04).

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CROSS-MODULE INTEGRATION                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    System Reminder (04)                        │  │
│  │                                                                 │  │
│  │  ← Tool execution progress                                     │  │
│  │  ← MCP elicitation requests                                    │  │
│  │  ← Plan mode state changes                                     │  │
│  │  ← Task status updates                                         │  │
│  │                                                                 │  │
│  │  → Attachments injected into LLM context                       │  │
│  └───────────────────────────────────────────────────────────────┘  │
│       ▲              ▲              ▲              ▲                 │
│       │              │              │              │                 │
│       │              │              │              │                 │
│  ┌────┴────┐    ┌────┴────┐    ┌────┴────┐    ┌────┴────┐          │
│  │  Tools  │    │   MCP   │    │  Plan   │    │  Task   │          │
│  │  (05)   │    │  (06)   │    │ Mode    │    │ System  │          │
│  │         │    │         │    │  (12)   │    │  (13)   │          │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘          │
│       │              │              │              │                 │
│       └──────────────┴──────────────┴──────────────┘                 │
│                          Tool Execution                              │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Integration 1: Tools ↔ System Reminder

### Attachment Types Generated

| Attachment Type | Trigger | Content |
|-----------------|---------|---------|
| `progress` | Tool progress callback | Streaming updates (Bash output) |
| `hook_additional_context` | PreToolUse hook | Additional context from hooks |
| `hook_blocking_error` | Hook denial | Rejection message |
| `task_status` | Background task change | Task completion/failure |
| `permission_decision` | After canUseTool | User decision record |

### Data Flow

```
Tool Execution (toolDispatcher)
    │
    ├─→ PreToolUse hooks execute
    │       │
    │       └─→ hook_additional_context attachment
    │           (if hook provides context)
    │
    ├─→ Permission check
    │       │
    │       └─→ permission_decision attachment
    │           (recorded in toolDecisions)
    │
    ├─→ Tool.call() executes
    │       │
    │       └─→ progress callbacks
    │           (for streaming tools like Bash)
    │
    └─→ PostToolUse hooks execute
            │
            └─→ task_status attachment
                (if hooks trigger task changes)
```

### Code Location

The attachment generation happens in `toolExecutionPipeline` (fxY):

```javascript
// chunks.146.mjs - Tool execution generates attachments

// Pre-tool hooks can generate additional context
for await (let hookEvent of executePreToolHooks(...)) {
    switch (hookEvent.type) {
        case "additionalContext":
            results.push(hookEvent.message);  // Attachment
            break;
    }
}

// Progress updates during tool execution
progressCallback({
    toolUseID: toolUseId,
    data: {
        type: "mcp_progress",  // Or other progress type
        status: "progress",
        // ...
    }
});
```

---

## Integration 2: MCP ↔ System Reminder

### MCP-Specific Attachments

| Attachment Type | Trigger | Purpose |
|-----------------|---------|---------|
| `mcp_progress` | Tool call lifecycle | Start/progress/complete/fail |
| `mcp_elicitation` | Server requests input | OAuth flows, forms |
| `mcp_resource` | Resource subscription | Resource updates |

### Elicitation Integration

```
MCP Tool Execution
    │
    ├─→ Tool returns UrlElicitationRequired error (-32042)
    │
    ├─→ executeMcpToolCall parses elicitation requests
    │
    ├─→ Check for hook handler
    │       │
    │       ├─→ Hook handles → continue
    │       └─→ No hook → queue UI elicitation
    │
    ├─→ UI shows elicitation dialog
    │       (form fields or URL link)
    │
    └─→ User responds → submit to server → retry tool
```

### Code Flow

```javascript
// chunks.169.mjs:2246 - Elicitation handling

async function executeMcpToolCall({ ... }) {
    for (let attempt = 0; ; attempt++) {
        try {
            return await mcpToolCallCore({ ... });
        } catch (error) {
            // Check for URL elicitation required
            if (error.code === ErrorCode.UrlElicitationRequired) {
                // Queue elicitation in UI state
                setAppState((state) => ({
                    ...state,
                    elicitation: {
                        queue: [...state.elicitation.queue, {
                            serverName,
                            requestId: `error-elicit-${elicitationId}`,
                            params: elicitationRequest,
                            // ...
                        }]
                    }
                }));

                // Wait for user response
                const response = await waitForElicitationResponse();

                // Submit and retry
                await submitElicitationResponse(response);
            }
        }
    }
}
```

---

## Integration 3: Plan Mode ↔ System Reminder

### Plan Mode Attachments

| Attachment Type | Trigger | Content |
|-----------------|---------|---------|
| `plan_mode` | Enter plan mode | 5-phase workflow instructions |
| `plan_mode_exit` | Exit plan mode | Transition context |

### Attachment Generation

```javascript
// Plan mode attachment producer
function getPlanModeAttachment(context) {
    if (context.toolPermissionContext.mode !== "plan") return null;

    // Count previous plan reminders for sparse/full decision
    const previousReminders = countPreviousPlanReminders(context);

    return {
        type: "plan_mode",
        reminderType: previousReminders > 0 ? "sparse" : "full",
        planFilePath: getPlanFilePath(context.agentId),
        isSubAgent: !!context.agentId,
        iterativeMode: isIterativeModeEnabled()
    };
}
```

### Variant Dispatching

```javascript
// Plan mode reminder variants
function planModeReminderDispatcher(attachment) {
    if (attachment.isSubAgent) {
        return formatSubagentPlanReminder(attachment);  // Brief
    }
    if (attachment.reminderType === "sparse") {
        return formatSparsePlanReminder(attachment);    // Short
    }
    if (attachment.iterativeMode) {
        return formatIterativePlanReminder(attachment); // Pair-planning
    }
    return formatFullPlanReminder(attachment);          // 5-phase workflow
}
```

### Mode Transition Hook

```javascript
// chunks.1.mjs:2946 - Mode transition triggers attachment flag

function handlePlanModeTransition(fromMode, toMode) {
    // Entering plan mode: reset exit attachment
    if (toMode === "plan" && fromMode !== "plan") {
        globalSessionState.needsPlanModeExitAttachment = false;
    }

    // Leaving plan mode: request exit attachment
    if (fromMode === "plan" && toMode !== "plan") {
        globalSessionState.needsPlanModeExitAttachment = true;
    }
}
```

---

## Integration 4: Task System ↔ System Reminder

### Task Attachments

| Attachment Type | Trigger | Content |
|-----------------|---------|---------|
| `task_status` | Task created/updated/completed | Task summary |
| `task_assignment` | Task claimed by agent | Assignment info |
| `task_blocking` | Dependency blocks execution | Blocking task IDs |

### Task State Changes

```javascript
// Task state changes trigger attachments

async function updateTask(taskManager, taskId, updates) {
    const task = await loadTask(taskManager, taskId);

    // Update task
    const updatedTask = { ...task, ...updates, id: taskId };
    await writeFile(getTaskFilePath(taskManager, taskId), JSON.stringify(updatedTask));

    // Status change → generate attachment
    if (updates.status && updates.status !== task.status) {
        enqueueAttachment({
            type: "task_status",
            taskId,
            oldStatus: task.status,
            newStatus: updates.status,
            subject: updatedTask.subject
        });
    }

    return updatedTask;
}
```

### Dependency Resolution

```javascript
// Claim validation checks dependencies and generates blocking attachment

async function claimTask(taskManager, taskId, agentId) {
    const task = await loadTask(taskManager, taskId);

    // Check blocking tasks
    const allTasks = await loadAllTasks(taskManager);
    const incompleteTasks = allTasks.filter(t => t.status !== "completed");
    const blockingIncomplete = task.blockedBy.filter(id =>
        incompleteTasks.some(t => t.id === id)
    );

    if (blockingIncomplete.length > 0) {
        // Generate blocking attachment
        enqueueAttachment({
            type: "task_blocking",
            taskId,
            blockedBy: blockingIncomplete,
            message: `Task ${taskId} is blocked by incomplete tasks: ${blockingIncomplete.join(", ")}`
        });

        return { success: false, reason: "blocked", blockedByTasks: blockingIncomplete };
    }

    // Claim successful
    return { success: true, task: await updateTask(taskManager, taskId, { owner: agentId }) };
}
```

---

## Integration 5: Tools ↔ MCP ↔ Plan Mode

### Tool Filtering in Plan Mode

```javascript
// Tool filtering considers MCP tools

function filterToolsForPlanMode(tools, planFilePath) {
    return tools.filter(tool => {
        // Read-only tools always allowed
        if (tool.isReadOnly?.()) return true;

        // Plan mode exit/entry tools
        if (tool.name === "ExitPlanMode" || tool.name === "EnterPlanMode") return true;

        // AskUserQuestion for gathering requirements
        if (tool.name === "AskUserQuestion") return true;

        // Write/Edit only to plan file
        if (tool.name === "Write" || tool.name === "Edit") {
            // Checked at execution time
            return true;
        }

        // MCP tools: check if read-only
        if (tool.isMcp && tool.isReadOnly?.()) return true;

        return false;
    });
}
```

### MCP Tool Execution in Plan Mode

MCP tools that are `readOnlyHint: true` are allowed in plan mode:
- Code indexing tools (search, list)
- Documentation tools
- Read-only database queries

---

## Integration 6: Plan Mode ↔ Task System

### Plan to Task Conversion

After plan approval, structured steps can be converted to tasks:

```javascript
// ExitPlanMode returns task tool availability

async function exitPlanMode(input, context) {
    // ... approval logic ...

    // Check if Task tools are available
    const hasTaskTool = context.options.tools.some(t => matchesTool(t, "Agent"));

    return {
        data: {
            plan: planContent,
            hasTaskTool,  // Enables task suggestions
            // ...
        }
    };
}

// In result formatting:
if (hasTaskTool) {
    return {
        type: "tool_result",
        content: `User approved the plan.

You can now implement. Consider using TaskCreate to track your progress:
1. Create tasks for each major step
2. Set dependencies between tasks
3. Update task status as you progress

${planContent}`,
        tool_use_id: toolUseId
    };
}
```

---

## Integration 7: MCP ↔ Tools (Tool Discovery)

### MCP Tool Registration

```javascript
// MCP tools are discovered and registered dynamically

async function initializeMcpClients(config) {
    for (const [serverName, serverConfig] of Object.entries(config)) {
        const client = await connectToMcpServer(serverName, serverConfig);

        // Discover tools
        const tools = await fetchMcpTools(client);

        // Tools are added to session tool set
        // with mcp__serverName__toolName naming
    }
}

// Tool lookup finds MCP tools
function findTool(tools, toolName) {
    // First check session tools
    const sessionTool = tools.find(t => t.name === toolName);

    // Then check MCP alias registry
    if (!sessionTool) {
        const mcpTool = findTool(getMcpToolRegistry(), toolName);
        if (mcpTool?.aliases?.includes(toolName)) return mcpTool;
    }

    return sessionTool;
}
```

---

## Attachment Pipeline Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ATTACHMENT PIPELINE                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  1. Event Occurs (tool call, plan mode change, task update)         │
│                                                                       │
│  2. Attachment Producer Called                                       │
│     ├─ assembleAttachments() collects all pending                   │
│     └─ Each module contributes its attachments                       │
│                                                                       │
│  3. Normalization                                                    │
│     ├─ normalizeAttachmentForAPI() converts to message format       │
│     └─ wrapWithSystemReminderTags() wraps in XML tags               │
│                                                                       │
│  4. Injection                                                        │
│     ├─ buildContextMessages() inserts into message array            │
│     └─ Positioned before user message in API call                    │
│                                                                       │
│  5. LLM Processing                                                   │
│     └─ LLM receives meta-messages alongside conversation            │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Key Integration Patterns

### Pattern 1: State-Based Attachment Generation

Modules generate attachments based on session state, not direct calls:

```javascript
// Each turn, attachment producers poll state
function assembleAttachments(context) {
    const attachments = [];

    // Tools: check tool execution state
    if (context.pendingToolProgress) {
        attachments.push(...generateToolProgressAttachments(context));
    }

    // Plan mode: check mode state
    if (context.toolPermissionContext.mode === "plan") {
        attachments.push(generatePlanModeAttachment(context));
    }

    // Tasks: check task changes
    if (context.taskChanges?.length) {
        attachments.push(...generateTaskAttachments(context));
    }

    return attachments;
}
```

### Pattern 2: Event-Driven UI Updates

UI state updates trigger re-renders without blocking:

```javascript
// Modal priority determination
function determineActiveModal() {
    // Tools permission
    if (toolPermissionQueue[0]) return "tool-permission";

    // MCP elicitation
    if (elicitation.queue[0]) return "elicitation";

    // Task status (lower priority)
    if (taskStatusQueue[0]) return "task-status";

    return undefined;
}
```

### Pattern 3: Cross-Module Validation

Modules validate each other's state:

```javascript
// ExitPlanMode validates plan mode state
async function validateInput(input, { getAppState }) {
    const state = getAppState();
    if (state.toolPermissionContext.mode !== "plan") {
        return {
            result: false,
            message: "You are not in plan mode."
        };
    }
    return { result: true };
}

// Task claiming validates dependencies
async function claimTask(taskManager, taskId) {
    const task = await loadTask(taskManager, taskId);
    const blockers = await checkDependencies(task);
    if (blockers.length > 0) {
        return { success: false, reason: "blocked", blockedByTasks: blockers };
    }
    // ...
}
```

---

## Verification

1. **Check attachment types in system reminder**:
   ```bash
   grep -n "type:" /path/to/04_system_reminder/reminder_types.md
   ```

2. **Validate plan mode attachment producer**:
   ```bash
   grep -n "plan_mode" source/chunks.*.mjs
   ```

3. **Check elicitation queue in UI state**:
   ```bash
   grep -n "elicitation.queue" source/chunks.*.mjs
   ```