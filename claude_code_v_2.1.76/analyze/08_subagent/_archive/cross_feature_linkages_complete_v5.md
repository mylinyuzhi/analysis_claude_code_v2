# Cross-Feature Linkages Complete V5 (Claude Code 2.1.76)

> Comprehensive documentation of all integration points between the subagent/background agents systems and other Claude Code modules, with source-level code restoration.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

---

## Integration Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CROSS-FEATURE INTEGRATION MATRIX                          │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────────┐
                    │     08_subagent / 26_background │
                    │           Agents Core           │
                    └────────────────┬────────────────┘
                                     │
    ┌────────────────┬───────────────┼───────────────┬────────────────┐
    │                │               │               │                │
    ▼                ▼               ▼               ▼                ▼
┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐
│  04    │     │  05    │     │  07    │     │  17    │     │  30    │
│System  │     │ Tools  │     │Compact │     │ Hooks  │     │ Agent  │
│Reminder│     │        │     │        │     │        │     │ Teams  │
└────────┘     └────────┘     └────────┘     └────────┘     └────────┘
     │              │              │              │              │
     │              │              │              │              │
     ▼              ▼              ▼              ▼              ▼
 Attachments   Tool Filtering  Transcript     SubagentStart  Mailbox
               Execution       Handling       PostToolUse    Teammate
               Access Control                 Cleanup        Spawning
```

---

## Integration 1: 04_system_reminder

### Attachment Types

| Type | Producer | Purpose |
|------|----------|---------|
| `task_status` | suY | Background task status in conversation context |
| `task_progress` | nl4 | Progress updates with telemetry |
| `task_reminder` | getTaskReminderAttachment | Reminder of pending tasks |
| `team_context` | AmY | Teammate context for coordination |

### Integration Flow

```javascript
// ============================================
// System Reminder Integration
// Location: chunks.147.mjs:1033-1048
// ============================================

// Called before each LLM turn
async function assembleAllAttachments(toolUseContext) {
    let attachments = [];

    // 1. Task status attachments
    let taskAttachments = await getUnifiedTasksAttachment(toolUseContext);  // suY
    attachments.push(...taskAttachments);

    // 2. Task reminder (for pending tasks)
    let reminders = await getTaskReminderAttachment(toolUseContext);
    attachments.push(...reminders);

    // 3. Async hook responses
    let hookResponses = await getAsyncHookResponseAttachments();
    attachments.push(...hookResponses);

    // 4. Team context (for teammates)
    let teamContext = getTeamContextAttachment(messages);
    attachments.push(...teamContext);

    // 5. Token usage (optional)
    let tokenUsage = getTokenUsageAttachment(messages, toolUseContext);
    attachments.push(...tokenUsage);

    return attachments;
}
```

### Task Status Attachment Format

```typescript
interface TaskStatusAttachment {
    type: "task_status";
    taskId: string;
    taskType: "local_agent" | "local_bash" | "in_process_teammate" | "remote_agent";
    status: "pending" | "running" | "completed" | "failed" | "killed";
    description: string;
    deltaSummary?: string;  // Progress summary for running tasks
}
```

### When Attachments Are Added

1. **Before LLM turn**: All task attachments added to context
2. **On task completion**: Notification injected via `w0`
3. **On task failure**: Error message in notification
4. **On kill**: Cancellation notification

---

## Integration 2: 05_tools

### AgentTool Integration

```javascript
// ============================================
// AgentTool (QW6) - Main entry point for subagent spawning
// Location: chunks.136.mjs:1512
// ============================================

const AgentTool = {
    name: "Agent",  // r4
    inputSchema: agentInputSchema,  // aVY

    async call(input, context) {
        let {
            prompt,
            subagent_type,
            description,
            run_in_background,
            model,
            isolation,
            resume  // For teammate mode
        } = input;

        // Resolve agent definition
        let selectedAgent = resolveAgentDefinition(subagent_type);

        // Generate task ID
        let agentId = generateTaskId("local_agent");  // oV

        if (run_in_background) {
            // Background execution
            let task = createBackgroundAgentTask({  // Qn4
                agentId,
                description,
                prompt,
                selectedAgent,
                setAppState: context.setAppState,
                parentAbortController: context.abortController,
                toolUseId: context.toolUseId
            });

            // Spawn execution
            spawnBackgroundAgent(task, context);

            return {
                status: "async_launched",
                agentId,
                outputFile: task.outputFile
            };
        } else {
            // Foreground execution
            let task = createForegroundAgentTask({  // Un4
                agentId,
                description,
                prompt,
                selectedAgent,
                setAppState: context.setAppState,
                toolUseId: context.toolUseId
            });

            // Execute synchronously
            return await executeForegroundAgent(task, context);
        }
    }
};
```

### BashTool Background Modes

```javascript
// ============================================
// BashTool Background Modes
// Location: chunks.172.mjs
// ============================================

// Three ways to background a Bash command:

// 1. Explicit background
if (input.run_in_background) {
    // Always background, returns immediately
}

// 2. Timeout-based background
if (input.timeout && executionTime > AUTO_BACKGROUND_THRESHOLD) {
    // Assistant-mode auto-backgrounding
    // Default threshold: 120 seconds (m9z = 120000)
}

// 3. User interrupt (Ctrl+B)
if (userPressedCtrlB) {
    // Mid-run backgrounding
}
```

### TaskOutputTool

```javascript
// ============================================
// TaskOutputTool (kW6) - Poll background task output
// Location: chunks.143.mjs
// ============================================

const TaskOutputTool = {
    name: "TaskOutput",
    inputSchema: {
        task_id: "string",
        block: "boolean (default: true)",
        timeout: "number (milliseconds)"
    },

    async call(input, context) {
        let { task_id, block, timeout } = input;

        // Get task from state
        let task = context.getAppState().tasks[task_id];
        if (!task) throw new Error(`Task ${task_id} not found`);

        if (block) {
            // Wait for completion
            await waitForTaskCompletion(task_id, timeout);
        }

        // Read output file
        let output = await readFullOutput(task_id);  // z38

        return {
            output,
            status: task.status,
            ...task.result
        };
    }
};
```

### TaskStopTool

```javascript
// ============================================
// TaskStopTool (vW6) - Kill running task
// Location: chunks.143.mjs
// ============================================

const TaskStopTool = {
    name: "TaskStop",
    inputSchema: {
        task_id: "string"
    },

    async call(input, context) {
        let { task_id } = input;

        // Trigger abort
        let killed = triggerAbortSignal(task_id, context.setAppState);  // x66

        if (killed) {
            // Mark as notified
            markTaskKilled(task_id, context.setAppState);  // d4q

            return { status: "killed", task_id };
        }

        return { status: "not_running", task_id };
    }
};
```

### Tool Filtering Integration

```javascript
// ============================================
// Tool Access Control for Subagents
// Location: chunks.93.mjs:1568
// ============================================

function filterToolsForSubagent({ tools, isBuiltIn, isAsync, permissionMode }) {
    return tools.filter((tool) => {
        // MCP tools always allowed
        if (tool.name.startsWith("mcp__")) return true;

        // Background agent restrictions
        if (isAsync) {
            // Strict whitelist
            return ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name);
        }

        // Foreground agent restrictions
        if (BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)) {
            return false;
        }

        return true;
    });
}

// Blocked tools for background agents:
const BLOCKED_TOOLS = [
    "TaskOutput",      // Could create polling loops
    "ExitPlanMode",    // Requires user approval
    "EnterPlanMode",   // Requires user approval
    "Agent",           // Could spawn nested agents
    "AskUserQuestion", // Would block indefinitely
    "TaskStop"         // Background shouldn't manage tasks
];
```

---

## Integration 3: 07_compact

### Transcript Handling for Background Tasks

```javascript
// ============================================
// Compact Integration
// ============================================

// During compaction, background task messages are preserved specially:

function filterMessagesForCompact(messages) {
    return messages.filter((msg) => {
        // Keep tool_use for background agents
        if (msg.type === "tool_use" && msg.name === "Agent") {
            // Check if background
            if (msg.input?.run_in_background) {
                return true;  // Keep for task tracking
            }
        }

        // Keep tool_result for background agents
        if (msg.type === "tool_result") {
            // Check if async_launched status
            if (msg.content?.status === "async_launched") {
                return true;
            }
        }

        // Normal filtering...
        return isMessageRecordable(msg);
    });
}

// Task state is NOT compacted - persists across compactions
```

### Message Filtering

```javascript
// ============================================
// isMessageRecordable (TvY)
// Location: chunks.133.mjs:1561
// ============================================

function isMessageRecordable(message) {
    return message.type === "assistant" ||
           message.type === "user" ||
           message.type === "progress" ||
           (message.type === "system" && message.subtype === "compact_boundary");
}
```

---

## Integration 4: 17_hooks

### SubagentStart Hook

```javascript
// ============================================
// SubagentStart Hook Integration
// Location: chunks.133.mjs (agent loop)
// ============================================

async function* agentLoopRunner({ agentDefinition, ... }) {
    // ...

    // Dispatch SubagentStart hook
    let hookAdditionalContexts = [];
    for await (let event of dispatchSubagentStartHook(agentId, agentDefinition.agentType, abortController.signal)) {
        if (event.additionalContexts?.length > 0) {
            hookAdditionalContexts.push(...event.additionalContexts);
        }
    }

    // Add hook contexts as attachment
    if (hookAdditionalContexts.length > 0) {
        messages.push(createAttachment({
            type: "hook_additional_context",
            content: hookAdditionalContexts,
            hookName: "SubagentStart",
            toolUseID: generateToolUseId(),
            hookEvent: "SubagentStart"
        }));
    }

    // Register hooks if specified in agent definition
    if (agentDefinition.hooks) {
        registerAgentHooks(setAppState, agentId, agentDefinition.hooks, `agent '${agentDefinition.agentType}'`, true);
    }

    // ... execution ...

    // Cleanup hooks in finally block
    finally {
        if (agentDefinition.hooks) {
            deregisterAgentHooks(setAppState, agentId);
        }
    }
}
```

### PostToolUse Hook

```javascript
// ============================================
// PostToolUse Hook for Background Tasks
// ============================================

// Hooks fire after each tool use in background agent
// Can be used for:
// - Output capture
// - Progress tracking
// - Validation
```

---

## Integration 5: 30_agent_teams

### Teammate Spawning

```javascript
// ============================================
// spawnTeammateDispatcher (pNY)
// Location: chunks.135.mjs:1110
// ============================================

async function spawnTeammateDispatcher(options, context) {
    let backend = getBackend(context);

    switch (backend.type) {
        case "in-process":
            return spawnInProcessTeammate(options, context);  // FNY
        case "split-pane":
            return spawnSplitPaneTeammate(options, context);  // BNY
        case "tmux":
            return spawnTmuxTeammate(options, context);       // gNY
    }
}

// Backend selection priority:
// 1. In-process (if non-interactive session)
// 2. Split-pane (if iTerm2/tmux available)
// 3. Tmux-only (fallback)
```

### Mailbox Communication

```javascript
// ============================================
// Mailbox System
// Location: chunks.132.mjs
// ============================================

// Read messages from mailbox
async function readMailbox(agentName, teamName) {  // wl
    let inboxPath = getInboxPath(agentName, teamName);
    try {
        let content = await fs.readFile(inboxPath, "utf-8");
        return JSON.parse(content);
    } catch (error) {
        if (error.code === "ENOENT") return [];
        throw error;
    }
}

// Write message to mailbox
async function writeToMailbox(recipientName, message, teamName) {  // x3
    let inboxPath = getInboxPath(recipientName, teamName);
    let lockPath = `${inboxPath}.lock`;

    // Acquire lock
    let release = await lockfile.lock(inboxPath, {
        lockfilePath: lockPath,
        retries: 10,
        minTimeout: 5,
        maxTimeout: 100
    });

    try {
        // Read existing messages
        let messages = await readMailbox(recipientName, teamName);

        // Add new message
        messages.push({ ...message, read: false });

        // Write back
        await fs.writeFile(inboxPath, JSON.stringify(messages, null, 2), "utf-8");
    } finally {
        await release();
    }
}

// Mark message as read
async function markMessageAsReadByIndex(agentName, teamName, index) {  // Vc6
    let inboxPath = getInboxPath(agentName, teamName);
    let lockPath = `${inboxPath}.lock`;

    let release = await lockfile.lock(inboxPath, { lockfilePath: lockPath, ...lockOptions });

    try {
        let messages = await readMailbox(agentName, teamName);
        if (index >= 0 && index < messages.length) {
            messages[index] = { ...messages[index], read: true };
            await fs.writeFile(inboxPath, JSON.stringify(messages, null, 2), "utf-8");
        }
    } finally {
        await release();
    }
}
```

### In-Process Teammate Runner

```javascript
// ============================================
// inProcessAgentRunner (XNY)
// Location: chunks.134.mjs:1571
// ============================================

async function inProcessAgentRunner(options) {
    let {
        identity,
        taskId,
        prompt,
        agentDefinition,
        teammateContext,
        toolUseContext,
        abortController,
        model,
        systemPrompt,
        systemPromptMode,
        allowedTools,
        allowPermissionPrompts
    } = options;

    // Build agent context
    let agentContext = {
        agentId: identity.agentId,
        parentSessionId: identity.parentSessionId,
        agentName: identity.agentName,
        teamName: identity.teamName,
        agentColor: identity.color,
        planModeRequired: identity.planModeRequired,
        isTeamLead: false,
        agentType: "teammate"
    };

    // Start agent loop
    for await (let event of agentLoopRunner({
        agentDefinition,
        promptMessages: [{ type: "user", content: prompt }],
        toolUseContext: derivedContext,
        // ...
    })) {
        // Handle events
        if (event.type === "attachment") {
            // Process attachment
        }
        if (isMessageRecordable(event)) {
            // Record message
        }
    }
}
```

---

## Integration 6: Other Systems

### 13_task_system Integration

```javascript
// Task system provides structured task management
// Background agents can claim tasks from shared task list

async function claimUnclaimedTask(taskManager, agentName) {  // Ji4
    // Find next available unclaimed task
    let task = findNextAvailableTask();  // JNY

    if (task) {
        // Claim it
        await claimTask(task.id);  // OT8
        return generatePromptFromTask(task);  // PVY
    }

    return null;
}
```

### 06_mcp Integration

```javascript
// MCP clients are loaded for subagents
async function loadAgentMcpClients(agentDefinition, parentMcpClients) {  // fvY
    // Merge agent-specific MCP config with parent
    // Return { clients, tools, cleanup }
}
```

### 32_keybindings Integration

```javascript
// Ctrl+C → Ctrl+F kill sequence
// Ctrl+B background current command
// /tasks open task list modal

// Key handlers call:
// - U4q (killAllLocalAgents) for Ctrl+F
// - backgroundCurrentTask() for Ctrl+B
```

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `suY` | getUnifiedTasksAttachment | chunks.147.mjs:1033 | ✓ Verified |
| `pNY` | spawnTeammateDispatcher | chunks.135.mjs:1110 | ✓ Verified |
| `qn4` | spawnTeammate | chunks.135.mjs:1116 | ✓ Verified |
| `XNY` | inProcessAgentRunner | chunks.134.mjs:1571 | ✓ Verified |
| `DNY` | pollForNextMessage | chunks.134.mjs:1483 | ✓ Verified |
| `wl` | readMailbox | chunks.132.mjs:3 | ✓ Verified |
| `x3` | writeToMailbox | chunks.132.mjs:22 | ✓ Verified |
| `Vc6` | markMessageAsReadByIndex | chunks.132.mjs:57 | ✓ Verified |
| `Qn4` | createBackgroundAgentTask | chunks.146.mjs:2133 | ✓ Verified |
| `Un4` | createForegroundAgentTask | chunks.146.mjs:2165 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | ✓ Verified |
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |

---

## Related Documents

- [key_algorithms_deep_dive_v6.md](./key_algorithms_deep_dive_v6.md) - Algorithm analysis
- [ui_interaction_complete_v5.md](./ui_interaction_complete_v5.md) - UI components
- [cross_validation_report_v2.md](./cross_validation_report_v2.md) - Symbol verification
- [../04_system_reminder/types_task_management.md](../04_system_reminder/types_task_management.md) - Task reminder types
- [../30_agent_teams/README.md](../30_agent_teams/README.md) - Agent teams documentation