# Cross-Feature Linkages Complete (Claude Code 2.1.76)

> Complete documentation of cross-feature integration between subagents/background agents and all other Claude Code systems.

---

## Integration Matrix

| Module | Subagent Integration | Background Agents Integration |
|--------|---------------------|------------------------------|
| `04_system_reminder` | Task status attachments, progress updates | Notification injection, progress throttling |
| `05_tools` | AgentTool, tool filtering, tool access control | TaskOutput, TaskStop tools |
| `06_mcp` | MCP server connections per agent | MCP tools in background context |
| `07_compact` | Transcript filtering, fork context | Background message filtering |
| `08_subagent` | N/A (self) | Task creation, state management |
| `12_plan_mode` | Plan mode subagent spawning | Plan mode restrictions |
| `13_task_system` | Structured task delegation | Task list sharing |
| `17_hooks` | SubagentStart/SubagentEnd hooks | Background hook execution |
| `26_background_agents` | Task state, output files | N/A (self) |
| `30_agent_teams` | Teammate spawning, mailbox | Team task list |

---

## Integration with 04_system_reminder

### Task Status Attachments

```javascript
// ============================================
// Task status attachment generation
// Location: chunks.147.mjs:1033-1048 (suY)
// ============================================

// Flow: getUnifiedTasksAttachment → pollTaskOutputs → task_status attachments

async function getUnifiedTasksAttachment(toolUseContext) {
    let appState = toolUseContext.getAppState();

    // Poll all running tasks for output updates
    let {
        attachments,           // Task status attachments
        updatedTaskOffsets,    // New read positions
        evictedTaskIds         // Tasks to remove
    } = await pollTaskOutputs(appState);

    // Update state with new offsets and evictions
    updateTaskState(toolUseContext.setAppState, updatedTaskOffsets, evictedTaskIds);

    // Format attachments for LLM context
    return attachments.map((attachment) => ({
        type: "task_status",
        taskId: attachment.taskId,
        taskType: attachment.taskType,
        status: attachment.status,
        description: attachment.description,
        deltaSummary: attachment.deltaSummary
    }));
}
```

### Progress Throttling (3-Turn)

```javascript
// ============================================
// Progress attachment throttling
// Location: chunks.144.mjs:832 (TIY - countTurnsSinceLastProgress)
// ============================================

// Progress updates are throttled to every 3 turns
const TURNS_BETWEEN_PROGRESS = 3;

function shouldShowProgressAttachment(state) {
    let turnsSinceLastProgress = countTurnsSinceLastProgress(state);
    return turnsSinceLastProgress >= TURNS_BETWEEN_PROGRESS;
}

// This prevents LLM context from being flooded with progress updates
```

### Notification Queue Integration

```javascript
// ============================================
// Notification queue for task events
// Location: chunks.90.mjs:2979-2992
// ============================================

// Task events are queued for system reminder injection
function queueTaskEvent(event) {
    if (notificationQueue.length >= MAX_QUEUE_SIZE) {
        notificationQueue.shift();  // Remove oldest
    }
    notificationQueue.push(event);
}

function flushNotificationQueue() {
    if (notificationQueue.length === 0) return [];
    return notificationQueue.splice(0).map((event) => ({
        ...event,
        uuid: generateUuid(),
        session_id: getCurrentSessionId()
    }));
}
```

---

## Integration with 05_tools

### AgentTool (Task Tool)

```javascript
// ============================================
// AgentTool integration with subagent system
// Location: chunks.136.mjs:1512 (QW6)
// ============================================

const AgentTool = {
    name: "Agent",
    aliases: ["Task"],

    async call({
        prompt,
        subagent_type,
        description,
        run_in_background,  // Triggers background agent path
        name,               // Triggers teammate path
        team_name,
        // ...
    }, toolUseContext) {
        // Route to appropriate execution mode:
        // 1. Teammate: name + team_name → spawnTeammate
        // 2. Background: run_in_background → createBackgroundAgentTask
        // 3. Foreground: default → runSynchronously
    }
};
```

### TaskOutput Tool

```javascript
// ============================================
// TaskOutput tool for retrieving background task output
// Location: chunks.139.mjs (TaskOutputTool)
// ============================================

const TaskOutputTool = {
    name: "TaskOutput",

    async call({ task_id, block, timeout }, context) {
        let task = context.getAppState().tasks[task_id];
        if (!task) {
            throw Error(`Task not found: ${task_id}`);
        }

        // Read output file
        let output = await readFullOutput(task_id);

        if (block && task.status === "running") {
            // Wait for completion
            await waitForTaskCompletion(task_id, timeout);
            output = await readFullOutput(task_id);
        }

        return {
            output: output,
            status: task.status
        };
    }
};
```

### TaskStop Tool

```javascript
// ============================================
// TaskStop tool for killing background tasks
// Location: chunks.139.mjs (TaskStopTool)
// ============================================

const TaskStopTool = {
    name: "TaskStop",

    async call({ task_id }, context) {
        let task = context.getAppState().tasks[task_id];
        if (!task) {
            throw Error(`Task not found: ${task_id}`);
        }

        if (task.status !== "running") {
            return { status: "already_stopped" };
        }

        // Get appropriate kill handler
        let handler = getKillHandlerForType(task.type);

        // Execute kill
        await handler.kill(task_id, context);

        return { status: "stopped" };
    }
};
```

### Tool Filtering for Subagents

```javascript
// ============================================
// Tool filtering for subagent context
// Location: chunks.93.mjs:1568 (Xk8)
// ============================================

// Background agent excluded tools
const BACKGROUND_AGENT_EXCLUDED_TOOLS = new Set([
    "TaskOutput",      // Could create polling loops
    "ExitPlanMode",    // Requires user approval
    "EnterPlanMode",   // Requires user approval
    "Agent",           // Could spawn nested agents
    "AskUserQuestion", // Would block indefinitely
    "TaskStop"         // Background shouldn't manage tasks
]);

// Async agent allowed tools
const ASYNC_AGENT_ALLOWED_TOOLS = new Set([
    "Read", "Write", "Edit", "Bash", "Grep", "Glob",
    "WebFetch", "WebSearch", "TodoWrite", "NotebookEdit",
    "Skill", "StructuredOutput", "ToolSearch"
]);

function filterToolsForSubagent(agentDefinition, availableTools, isAsync) {
    let filteredTools = [...availableTools];

    if (isAsync) {
        // Remove excluded tools
        filteredTools = filteredTools.filter(
            tool => !BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)
        );

        // Or use allowlist if specified
        if (agentDefinition.tools?.includes("*")) {
            // All allowed
        } else {
            filteredTools = filteredTools.filter(
                tool => ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name) ||
                        agentDefinition.tools?.includes(tool.name)
            );
        }
    }

    return { resolvedTools: filteredTools };
}
```

---

## Integration with 06_mcp

### MCP Server Connection per Agent

```javascript
// ============================================
// MCP server connection for subagents
// Location: chunks.133.mjs:1502-1559 (fvY)
// ============================================

async function connectAgentMcpServers(agentDefinition, parentClients) {
    if (!agentDefinition.mcpServers?.length) {
        return { clients: parentClients, tools: [], cleanup: async () => {} };
    }

    let newClients = [];
    let dynamicClients = [];
    let newTools = [];

    for (let serverSpec of agentDefinition.mcpServers) {
        // Resolve server configuration
        let serverName, serverConfig, isDynamic;

        if (typeof serverSpec === "string") {
            serverName = serverSpec;
            serverConfig = resolveMcpServer(serverName);
        } else {
            // Object form: { serverName: config }
            [serverName, serverConfig] = Object.entries(serverSpec)[0];
            serverConfig.scope = "dynamic";
            isDynamic = true;
        }

        // Connect to server
        let client = await connectMcpServer(serverName, serverConfig);
        newClients.push(client);

        if (isDynamic) {
            dynamicClients.push(client);
        }

        if (client.type === "connected") {
            let tools = await getMcpTools(client);
            newTools.push(...tools);
        }
    }

    // Cleanup function for dynamic servers
    let cleanup = async () => {
        for (let client of dynamicClients) {
            if (client.type === "connected") {
                await client.cleanup();
            }
        }
    };

    return {
        clients: [...parentClients, ...newClients],
        tools: newTools,
        cleanup: cleanup
    };
}
```

---

## Integration with 07_compact

### Transcript Filtering

```javascript
// ============================================
// Transcript handling for subagents
// Location: chunks.173.mjs (inferred)
// ============================================

// When compacting, subagent messages may be filtered
// Background agent messages are preserved differently

function filterMessagesForCompact(messages, context) {
    return messages.filter((message) => {
        // Keep all subagent-related messages
        if (message.type === "assistant" && isSubagentMessage(message)) {
            return true;
        }

        // Background task tool results are preserved
        if (message.type === "user" && isBackgroundTaskResult(message)) {
            return true;
        }

        // Apply normal filtering
        return shouldKeepForCompact(message);
    });
}
```

### Fork Context Building

```javascript
// ============================================
// Fork context building for subagents
// Location: chunks.133.mjs:1788 (Fx8)
// ============================================

function cloneForkContext(messages) {
    let toolUseIdsToKeep = new Set();

    // Find tool_use_ids that have corresponding tool_results
    for (let message of messages) {
        if (message?.type === "user") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                for (let block of content) {
                    if (block.type === "tool_result" && block.tool_use_id) {
                        toolUseIdsToKeep.add(block.tool_use_id);
                    }
                }
            }
        }
    }

    // Filter messages to only include complete tool use/result pairs
    return messages.filter((message) => {
        if (message?.type === "assistant") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                // Check if any tool_use has a corresponding result
                return content.some((block) =>
                    block.type === "tool_use" && toolUseIdsToKeep.has(block.id)
                );
            }
        }
        return true;
    });
}
```

---

## Integration with 12_plan_mode

### Plan Mode Subagent Restrictions

```javascript
// ============================================
// Plan mode restrictions for subagents
// Location: chunks.136.mjs:1564
// ============================================

// In plan mode, certain subagent operations are restricted

if (planModeRequired && !isPlanModeActive) {
    throw Error("This agent requires plan mode to be active");
}

// Teammates in plan mode
if (mode === "plan") {
    plan_mode_required: true;  // Subagent will require plan approval
}
```

---

## Integration with 17_hooks

### SubagentStart and SubagentEnd Hooks

```javascript
// ============================================
// Hook integration with subagents
// Location: chunks.133.mjs:1647-1648
// ============================================

// In agentLoopRunner:

// Register hooks at start
if (agentDefinition.hooks) {
    registerAgentHooks(setAppState, agentId, agentDefinition.hooks, `agent '${agentDefinition.agentType}'`, true);
}

// Deregister hooks at end
finally {
    if (agentDefinition.hooks) {
        deregisterAgentHooks(setAppState, agentId);
    }
}

// Hook events:
// - SubagentStart: Fired when subagent begins execution
// - SubagentEnd: Fired when subagent completes
// - PreToolUse: Before each tool call within subagent
// - PostToolUse: After each tool call within subagent
```

### Hook Additional Context Injection

```javascript
// ============================================
// Hook additional context injection
// Location: chunks.133.mjs:1636-1646
// ============================================

// Process SubagentStart hooks for additional context
let additionalContexts = [];
for await (let hookEvent of runAgentHooks(agentId, agentDefinition.agentType, abortController.signal)) {
    if (hookEvent.additionalContexts && hookEvent.additionalContexts.length > 0) {
        additionalContexts.push(...hookEvent.additionalContexts);
    }
}

// Inject as attachment message
if (additionalContexts.length > 0) {
    let attachmentMessage = createAttachmentMessage({
        type: "hook_additional_context",
        content: additionalContexts,
        hookName: "SubagentStart",
        toolUseID: generateToolUseId(),
        hookEvent: "SubagentStart"
    });
    messages.push(attachmentMessage);
}
```

---

## Integration with 30_agent_teams

### Teammate Spawning

```javascript
// ============================================
// Teammate spawning via AgentTool
// Location: chunks.136.mjs:1565-1584
// ============================================

// In AgentTool.call:
if (team_name && name) {
    // Teammate spawn path
    let agentDef = subagent_type
        ? toolUseContext.options.agentDefinitions.activeAgents.find(a => a.agentType === subagent_type)
        : undefined;

    if (agentDef?.color) {
        setAgentColor(subagent_type, agentDef.color);
    }

    let result = await spawnTeammate({
        name: name,
        prompt: prompt,
        description: description,
        team_name: team_name,
        use_splitpane: true,
        plan_mode_required: mode === "plan",
        model: modelOverride ?? agentDef?.model,
        agent_type: subagent_type
    }, toolUseContext);

    return {
        data: {
            status: "teammate_spawned",
            prompt: prompt,
            ...result.data
        }
    };
}
```

### Mailbox Communication

```javascript
// ============================================
// Mailbox communication for teammates
// Location: chunks.132.mjs
// ============================================

// Read messages from mailbox
async function readMailbox(agentName, teamName) {
    let path = getMailboxPath(agentName, teamName);
    try {
        let content = await readFile(path, "utf-8");
        let messages = parseJson(content);
        return messages;
    } catch (error) {
        if (error.code === "ENOENT") return [];
        logError(error);
        return [];
    }
}

// Write message to mailbox
async function writeToMailbox(recipientName, message, teamName) {
    let path = getMailboxPath(recipientName, teamName);
    let lockPath = `${path}.lock`;

    // Acquire lock
    let release = await acquireLock(path, { lockfilePath: lockPath });

    try {
        let messages = await readMailbox(recipientName, teamName);
        messages.push({ ...message, read: false });
        await writeFile(path, JSON.stringify(messages, null, 2), "utf-8");
    } finally {
        await release();
    }
}

// Mark message as read
async function markMessageAsReadByIndex(agentName, teamName, index) {
    let path = getMailboxPath(agentName, teamName);
    let lockPath = `${path}.lock`;

    let release = await acquireLock(path, { lockfilePath: lockPath });

    try {
        let messages = await readMailbox(agentName, teamName);
        if (index >= 0 && index < messages.length) {
            messages[index] = { ...messages[index], read: true };
            await writeFile(path, JSON.stringify(messages, null, 2), "utf-8");
        }
    } finally {
        await release();
    }
}
```

---

## Cross-Feature Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CROSS-FEATURE DATA FLOW                              │
└─────────────────────────────────────────────────────────────────────────────┘

                          ┌─────────────────┐
                          │   User Input    │
                          └────────┬────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │   CLI (01_cli)  │
                          └────────┬────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
          ▼                        ▼                        ▼
   ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
   │ AgentTool   │          │ Hooks       │          │ System      │
   │ (05_tools)  │          │ (17_hooks)  │          │ Reminders   │
   └──────┬──────┘          └──────┬──────┘          │ (04)        │
          │                        │                 └──────┬──────┘
          │                        │                        │
          ▼                        │                        │
   ┌─────────────┐                 │                        │
   │ Subagent    │◄────────────────┘                        │
   │ Execution   │                                          │
   │ (08_subagent)│                                         │
   └──────┬──────┘                                          │
          │                                                 │
          ├─────────────────────────────────────────────────┤
          │                                                 │
          ▼                                                 ▼
   ┌─────────────┐                                   ┌─────────────┐
   │ Background  │                                   │ Task        │
   │ Agents      │                                   │ Attachments │
   │ (26)        │                                   │             │
   └──────┬──────┘                                   └──────┬──────┘
          │                                                 │
          │                        ┌────────────────────────┘
          │                        │
          ▼                        ▼
   ┌─────────────┐          ┌─────────────┐
   │ Task State  │          │ LLM Context │
   │ (appState)  │          │             │
   └─────────────┘          └─────────────┘
          │
          ├──────────────────────────────────────────────────┐
          │                                                  │
          ▼                                                  ▼
   ┌─────────────┐                                   ┌─────────────┐
   │ MCP (06)    │                                   │ Compact     │
   │             │                                   │ (07)        │
   └─────────────┘                                   └─────────────┘
```

---

## Related Documents

- [README.md](./README.md) - Module overview
- [feature_integration_matrix.md](./feature_integration_matrix.md) - Feature integration matrix
- [../08_subagent/subagent_execution_complete_source.md](../08_subagent/subagent_execution_complete_source.md) - Subagent execution
- [../26_background_agents/task_lifecycle_complete_v2.md](../26_background_agents/task_lifecycle_complete_v2.md) - Task lifecycle