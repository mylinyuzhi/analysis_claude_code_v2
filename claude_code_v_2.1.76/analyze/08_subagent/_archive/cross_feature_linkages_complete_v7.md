# Cross-Feature Linkages Complete (Claude Code 2.1.76)

> Complete documentation of how subagent and background agent systems integrate with other features: System Reminders, Hooks, Compact, MCP, Tools, Permissions, and more.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified_v2.md](./cross_validation_unified_v2.md) - Unified symbol verification

Key integration functions:
- `suY` - getUnifiedTasksAttachment — `chunks.147.mjs:1033`
- `wY4` - pollTaskOutputs — `chunks.90.mjs:3058`
- `r24` - registerHookHandlers — `chunks.133.mjs:1647`
- `fvY` - connectMcpServers — `chunks.134.mjs:1502`

---

## Feature Integration Matrix

| Feature | Subagent | Background Agent | Teammate | Integration Type |
|---------|----------|------------------|----------|------------------|
| System Reminder | ✓ | ✓ | ✓ | Attachment producer |
| Hooks | ✓ | ✓ | ✓ | Lifecycle events |
| Compact | ✓ | ✓ | ✓ | History management |
| MCP | ✓ | ✓ | ✓ | Per-agent servers |
| Tools | ✓ | ✓ | ✓ | Tool filtering |
| Permissions | ✓ | ✓ | ✓ | Permission context |
| TodoWrite | ✓ | ✓ | ✓ | Task tracking |
| Skills | ✓ | ✓ | ✓ | Agent capabilities |
| Plan Mode | ✓ | - | ✓ | Mode inheritance |
| Telemetry | ✓ | ✓ | ✓ | Usage tracking |

---

## Part 1: System Reminder Integration

### Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SYSTEM REMINDER INTEGRATION                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│  Background Agent    │         │    System Reminder   │
│  Execution           │         │    Producer          │
└──────────┬───────────┘         └──────────┬───────────┘
           │                                │
           │ Progress updates               │ Attachment polling
           ▼                                ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                              Task State                                      │
│                                                                              │
│  tasks: {                                                                    │
│    "a7x9k2m3": {                                                             │
│      status: "running",                                                      │
│      progress: { toolUseCount: 5, tokenCount: 12543, summary: "..." }       │
│    }                                                                         │
│  }                                                                           │
└──────────────────────────────┬───────────────────────────────────────────────┘
                               │
           ┌───────────────────┼───────────────────┐
           │                   │                   │
           ▼                   ▼                   ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ pollTaskOutputs  │  │ Output File      │  │ Telemetry        │
│ (wY4)            │  │ Delta Read       │  │ Events           │
│                  │  │ (Z97)            │  │ (nl4)            │
└────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘
         │                     │                     │
         └─────────────────────┼─────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                    getUnifiedTasksAttachment (suY)                           │
│                                                                              │
│  1. Poll all task output files                                              │
│  2. Build task_status attachments                                           │
│  3. Update task offsets in state                                            │
│  4. Return attachments for system reminder                                   │
└──────────────────────────────┬───────────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         System Reminder Message                              │
│                                                                              │
│  <system-reminder>                                                          │
│    <task_status taskId="a7x9k2m3" status="running">                         │
│      Searching codebase for authentication patterns                         │
│      tools: 5, tokens: 12.5k                                                │
│      Reading src/auth/login.ts...                                           │
│    </task_status>                                                           │
│  </system-reminder>                                                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Source Code

```javascript
// ============================================
// suY - getUnifiedTasksAttachment
// Location: chunks.147.mjs:1033-1048
// ============================================

async function getUnifiedTasksAttachment(toolUseContext) {
    // Step 1: Get current app state
    let appState = toolUseContext.getAppState();

    // Step 2: Poll all task output files and build attachments
    let { attachments, updatedTaskOffsets, evictedTaskIds } = await pollTaskOutputs(appState);

    // Step 3: Update task state with new offsets and evict completed tasks
    updateTaskState(toolUseContext.setAppState, updatedTaskOffsets, evictedTaskIds);

    // Step 4: Transform attachments to system reminder format
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

### Attachment Types

```typescript
interface TaskStatusAttachment {
    type: "task_status";
    taskId: string;
    taskType: "local_agent" | "local_bash" | "in_process_teammate" | "remote_session";
    status: "pending" | "running" | "completed" | "failed" | "killed";
    description: string;
    deltaSummary?: string;  // New output since last poll
    startTime?: number;
    endTime?: number;
    result?: AgentResult;   // For completed tasks
    error?: string;         // For failed tasks
}
```

---

## Part 2: Hooks Integration

### Lifecycle Events

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SUBAGENT LIFECYCLE HOOKS                            │
└─────────────────────────────────────────────────────────────────────────────┘

Task Creation
        │
        ▼
┌───────────────────────────────────────────┐
│ Hook: SubagentStart                       │
│                                           │
│ • Fires when agent begins execution       │
│ • Can inject additional context           │
│ • Can modify system prompt                │
│                                           │
│ Parameters:                               │
│   - agentId                               │
│   - agentType                             │
│   - prompt                                │
│   - toolUseId                             │
└─────────────────────┬─────────────────────┘
                      │
                      ▼
Agent Execution
        │
        ▼
┌───────────────────────────────────────────┐
│ Hook: SubagentStop                        │
│                                           │
│ • Fires when agent completes/fails/killed │
│ • Can access result                       │
│ • Can trigger follow-up actions           │
│                                           │
│ Parameters:                               │
│   - agentId                               │
│   - status: "completed" | "failed" | ...  │
│   - result?                               │
│   - error?                                │
└───────────────────────────────────────────┘
```

### Hook Registration

```javascript
// ============================================
// Hook Registration in agentLoopRunner
// Location: chunks.133.mjs:1647
// ============================================

// In agentLoopRunner (qh):
if (agentDefinition.hooks) {
    registerHookHandlers(
        setAppState,
        agentId,
        agentDefinition.hooks,
        `agent '${agentDefinition.agentType}'`,
        true  // isSubagent
    );
}
```

### Hook Types for Subagents

| Hook Event | When Fired | Available Data |
|------------|------------|----------------|
| `SubagentStart` | Agent begins | agentId, agentType, prompt, toolUseId |
| `SubagentStop` | Agent ends | agentId, status, result?, error? |
| `ToolUse` | Tool executed | toolName, input, output |
| `Message` | LLM response | content, role |

---

## Part 3: Compact Integration

### History Compaction for Subagents

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPACT INTEGRATION                                  │
└─────────────────────────────────────────────────────────────────────────────┘

Agent Loop Running
        │
        ▼
┌───────────────────────────────────────────┐
│ Check Token Count                          │
│                                           │
│ if (currentTokens > threshold * 0.8) {    │
│   triggerCompaction();                    │
│ }                                         │
└─────────────────────┬─────────────────────┘
                      │
                      ▼ Threshold exceeded
┌───────────────────────────────────────────┐
│ Compact History                            │
│                                           │
│ mf6(history, toolUseContext, options)     │
│                                           │
│ • Summarize old messages                  │
│ • Keep recent context                     │
│ • Preserve tool results if needed         │
│ • Return compacted messages               │
└─────────────────────┬─────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────┐
│ Update State                               │
│                                           │
│ kb(taskId, (task) => ({                   │
│   ...task,                                │
│   messages: [...compactedHistory, ...]    │
│ }), setAppState);                         │
└───────────────────────────────────────────┘
```

### Teammate Compaction

```javascript
// ============================================
// Teammate History Compaction
// Location: chunks.134.mjs:1655-1673
// ============================================

// In inProcessAgentRunner (XNY):
let historyTokens = countTokens(history);
let maxTokens = getModelTokenLimit(toolUseContext.options.mainLoopModel);

if (historyTokens > maxTokens) {
    log(`[inProcessRunner] ${agentId} compacting history (${historyTokens} tokens)`);

    let compactContext = {
        ...toolUseContext,
        readFileState: cloneReadFileState(toolUseContext.readFileState),
        onCompactProgress: undefined,
        setStreamMode: undefined
    };

    let compactedMessages = await compactHistory(history, compactContext, {
        systemPrompt: unrollPrompt([]),
        userContext: {},
        systemContext: {},
        toolUseContext: compactContext,
        forkContextMessages: []
    }, true, undefined, true);

    history = compactedMessages;
    resetCompactState();
}
```

---

## Part 4: MCP Integration

### Per-Agent MCP Servers

```javascript
// ============================================
// MCP Server Connection for Agents
// Location: chunks.134.mjs:1502-1558
// ============================================

async function connectMcpServersForAgent(agentDefinition, existingClients) {
    // Skip if no MCP servers defined
    if (!agentDefinition.mcpServers?.length) {
        return {
            clients: existingClients,
            tools: [],
            cleanup: async () => {}
        };
    }

    let newClients = [];
    let newTools = [];
    let dynamicClients = [];

    for (let serverSpec of agentDefinition.mcpServers) {
        let serverName = null;
        let serverConfig = null;
        let isDynamic = false;

        // Parse server spec (string or object)
        if (typeof serverSpec === "string") {
            serverName = serverSpec;
            serverConfig = getMcpServerConfig(serverName);

            if (!serverConfig) {
                log(`[Agent: ${agentDefinition.agentType}] MCP server not found: ${serverName}`, {
                    level: "warn"
                });
                continue;
            }
        } else {
            // Object form: { serverName: { config } }
            let entries = Object.entries(serverSpec);
            if (entries.length !== 1) {
                log(`[Agent: ${agentDefinition.agentType}] Invalid MCP server spec`, {
                    level: "warn"
                });
                continue;
            }
            [serverName, serverConfig] = entries[0];
            serverConfig = { ...serverConfig, scope: "dynamic" };
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
            log(`[Agent: ${agentDefinition.agentType}] Connected to MCP server '${serverName}' with ${tools.length} tools`);
        } else {
            log(`[Agent: ${agentDefinition.agentType}] Failed to connect to MCP server '${serverName}': ${client.type}`, {
                level: "warn"
            });
        }
    }

    // Cleanup function for dynamic clients
    let cleanup = async () => {
        for (let client of dynamicClients) {
            if (client.type === "connected") {
                try {
                    await client.cleanup();
                } catch (error) {
                    log(`[Agent: ${agentDefinition.agentType}] Error cleaning up MCP server '${client.name}': ${error}`, {
                        level: "warn"
                    });
                }
            }
        }
    };

    return {
        clients: [...existingClients, ...newClients],
        tools: newTools,
        cleanup
    };
}
```

### Required MCP Server Validation

```javascript
// ============================================
// Required MCP Server Check (in AgentTool.call)
// Location: chunks.136.mjs:1633-1653
// ============================================

// Check if agent requires specific MCP servers
let requiredMcpServers = selectedAgent.requiredMcpServers;
if (requiredMcpServers?.length) {
    // Wait for pending MCP connections
    let hasPending = appState.mcp.clients.some(
        c => c.type === "pending" &&
             requiredMcpServers.some(
                 req => c.name.toLowerCase().includes(req.toLowerCase())
             )
    );

    if (hasPending) {
        let deadline = Date.now() + 30000;  // 30s timeout
        while (Date.now() < deadline) {
            await sleep(500);
            appState = toolUseContext.getAppState();

            // Check if any required server failed
            let hasFailed = appState.mcp.clients.some(
                c => c.type === "failed" &&
                     requiredMcpServers.some(
                         req => c.name.toLowerCase().includes(req.toLowerCase())
                     )
            );
            if (hasFailed) break;

            // Check if all pending are now resolved
            let stillPending = appState.mcp.clients.some(
                c => c.type === "pending" &&
                     requiredMcpServers.some(
                         req => c.name.toLowerCase().includes(req.toLowerCase())
                     )
            );
            if (!stillPending) break;
        }
    }

    // Validate required servers are available
    let availableServers = [];
    for (let tool of appState.mcp.tools) {
        if (tool.name?.startsWith("mcp__")) {
            let serverName = tool.name.split("__")[1];
            if (serverName && !availableServers.includes(serverName)) {
                availableServers.push(serverName);
            }
        }
    }

    if (!hasRequiredServers(selectedAgent, availableServers)) {
        let missing = requiredMcpServers.filter(
            req => !availableServers.some(
                avail => avail.toLowerCase().includes(req.toLowerCase())
            )
        );
        throw new Error(
            `Agent '${selectedAgent.agentType}' requires MCP servers matching: ${missing.join(", ")}. ` +
            `MCP servers with tools: ${availableServers.length > 0 ? availableServers.join(", ") : "none"}. ` +
            `Use /mcp to configure and authenticate the required MCP servers.`
        );
    }
}
```

---

## Part 5: Tool Filtering

### Tool Access Control

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          TOOL FILTERING                                      │
└─────────────────────────────────────────────────────────────────────────────┘

Parent Agent Tools
        │
        ▼
┌───────────────────────────────────────────┐
│ filterToolsForSubagent (Xk8)              │
│                                           │
│ Input: parentTools, agentType, mode       │
│ Output: filteredTools                     │
└─────────────────────┬─────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Background  │ │ Foreground  │ │ Teammate    │
│ Agent       │ │ Subagent    │ │             │
└──────┬──────┘ └──────┬──────┘ └──────┬──────┘
       │               │               │
       ▼               ▼               ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ EXCLUDED:   │ │ All parent  │ │ Subset +    │
│ TaskOutput  │ │ tools       │ │ team tools  │
│ Agent       │ │             │ │             │
│ AskUser     │ │             │ │             │
│ TaskStop    │ │             │ │             │
└─────────────┘ └─────────────┘ └─────────────┘
```

### Tool Sets

```javascript
// ============================================
// Background Agent Excluded Tools (CW6)
// Location: chunks.91.mjs:269
// ============================================

const BACKGROUND_AGENT_EXCLUDED_TOOLS = new Set([
    "TaskOutput",      // Could create polling loops
    "ExitPlanMode",    // Requires user approval flow
    "EnterPlanMode",   // Requires user approval flow
    "Agent",           // Could spawn nested background agents
    "AskUserQuestion", // Would block indefinitely
    "TaskStop"         // Background agents shouldn't manage other tasks
]);

// ============================================
// Async Agent Allowed Tools (eP1)
// Location: chunks.91.mjs:269
// ============================================

const ASYNC_AGENT_ALLOWED_TOOLS = new Set([
    "Read", "WebSearch", "TodoWrite", "Grep", "WebFetch", "Glob",
    "Bash", "Edit", "Write", "NotebookEdit", "Skill",
    "StructuredOutput", "ToolSearch", "EnterWorktree", "ExitWorktree"
]);

// ============================================
// Team Delegate Tools (WY4)
// ============================================

const TEAM_DELEGATE_TOOLS = new Set([
    "TaskCreate", "TaskGet", "TaskList", "TaskUpdate",
    "SendMessage", "CronCreate", "CronDelete", "CronList"
]);
```

### Why These Restrictions?

| Tool | Reason for Exclusion |
|------|----------------------|
| `TaskOutput` | Background agent could poll itself or create loops |
| `Agent` | Prevents uncontrolled spawning (fork bomb protection) |
| `AskUserQuestion` | No user present to answer - would block forever |
| `ExitPlanMode` | Requires user approval - user may be away |
| `EnterPlanMode` | Same as above |
| `TaskStop` | Background agent shouldn't manage other agents' lifecycles |

---

## Part 6: Permission Context Inheritance

### Permission Mode Derivation

```javascript
// ============================================
// Permission Context Derivation
// Location: chunks.133.mjs:1600-1630
// ============================================

function derivePermissionContext(parentContext, agentDefinition, isAsync) {
    let mode = agentDefinition.permissionMode;

    // Build permission context for subagent
    let derivedContext = { ...parentContext };

    // Apply agent's permission mode if specified
    if (mode && !["bypassPermissions", "acceptEdits", "auto"].includes(parentContext.mode)) {
        derivedContext.mode = mode;
    }

    // Determine if permission prompts should be avoided
    let shouldAvoidPrompts = agentDefinition.canShowPermissionPrompts !== undefined
        ? !agentDefinition.canShowPermissionPrompts
        : mode === "bubble"
            ? false
            : isAsync;

    if (shouldAvoidPrompts) {
        derivedContext.shouldAvoidPermissionPrompts = true;
    }

    // For async agents, await automated checks before showing dialogs
    if (isAsync && !shouldAvoidPrompts) {
        derivedContext.awaitAutomatedChecksBeforeDialog = true;
    }

    // Apply allowed tools if specified
    if (agentDefinition.allowedTools !== undefined) {
        derivedContext.alwaysAllowRules = {
            cliArg: parentContext.alwaysAllowRules.cliArg,
            session: [...agentDefinition.allowedTools]
        };
    }

    return derivedContext;
}
```

### Permission Mode Options

| Mode | Behavior | Use Case |
|------|----------|----------|
| `default` | Inherit from parent | Normal subagent |
| `plan` | Require plan approval | Planned execution |
| `auto` | Auto-approve safe operations | Background agents |
| `bubble` | Bubble prompts to parent | Interactive teammates |
| `bypassPermissions` | Skip all checks | Trusted operations |

---

## Part 7: Telemetry Integration

### Telemetry Events

```javascript
// ============================================
// Telemetry Events for Subagents
// ============================================

// Agent tool selected
sendTelemetry("tengu_agent_tool_selected", {
    agent_type: agentDefinition.agentType,
    model: derivedModel,
    source: agentDefinition.source,
    color: agentDefinition.color,
    is_built_in_agent: isBuiltIn(agentDefinition),
    is_resume: !!resumeId,
    is_async: runInBackground,
    is_fork: isFork
});

// Task started (in registerTask)
sendTelemetry({
    type: "system",
    subtype: "task_started",
    task_id: taskRecord.id,
    tool_use_id: taskRecord.toolUseId,
    description: taskRecord.description,
    task_type: taskRecord.type,
    prompt: taskRecord.prompt
});

// Task progress
sendTelemetry({
    type: "system",
    subtype: "task_progress",
    task_id: taskId,
    tool_use_id: toolUseId,
    description: summary,
    usage: {
        total_tokens: tokenCount,
        tool_uses: toolUseCount,
        duration_ms: duration
    }
});

// Agent killed
sendTelemetry("tengu_cancel", {
    source: "kill_agents"
});
```

---

## Part 8: Skills Integration

### Skill Loading for Agents

```javascript
// ============================================
// Skill Loading in agentLoopRunner
// Location: chunks.133.mjs:1648-1697
// ============================================

let agentSkills = agentDefinition.skills ?? [];
if (agentSkills.length > 0) {
    let skillRegistry = await loadSkillRegistry();

    let loadedSkills = [];
    for (let skillName of agentSkills) {
        let skill = loadSkill(skillName, skillRegistry, agentDefinition);

        if (!skill) {
            log(`[Agent: ${agentDefinition.agentType}] Warning: Skill '${skillName}' not found`, {
                level: "warn"
            });
            continue;
        }

        let skillDef = getSkillDefinition(skill, skillRegistry);
        if (skillDef.type !== "prompt") {
            log(`[Agent: ${agentDefinition.agentType}] Warning: Skill '${skillName}' is not prompt-based`, {
                level: "warn"
            });
            continue;
        }

        loadedSkills.push({
            skillName,
            skill: skillDef
        });
    }

    // Preload skill prompts
    let skillPrompts = await Promise.all(
        loadedSkills.map(async ({ skillName, skill }) => ({
            skillName,
            skill,
            content: await skill.getPromptForCommand("", toolUseContext)
        }))
    );

    // Add skill prompts to messages
    for (let { skillName, skill, content } of skillPrompts) {
        log(`[Agent: ${agentDefinition.agentType}] Preloaded skill '${skillName}'`);
        let metadata = formatSkillLoadingMetadata(skillName, skill.progressMessage);
        messages.push(createUserMessage({
            content: [
                { type: "text", text: metadata },
                ...content
            ]
        }));
    }
}
```

---

## Part 9: TodoWrite Integration

### Task Tracking in Subagents

```javascript
// ============================================
// TodoWrite in Background Agents
// ============================================

// Background agents CAN use TodoWrite because:
// 1. It's in ASYNC_AGENT_ALLOWED_TOOLS
// 2. It helps track progress on long-running tasks
// 3. Progress can be visible in system reminders

// Example usage in background agent:
await TodoWrite({
    todos: [
        { content: "Search for auth patterns", status: "completed", activeForm: "Searching..." },
        { content: "Analyze OAuth implementation", status: "in_progress", activeForm: "Analyzing..." },
        { content: "Document findings", status: "pending", activeForm: "Documenting..." }
    ]
});
```

---

## Cross-Feature Linkage Summary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CROSS-FEATURE INTEGRATION MAP                            │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────────────┐
                    │           AGENT TOOL                │
                    │              (QW6)                  │
                    └──────────────────┬──────────────────┘
                                       │
         ┌─────────────┬───────────────┼───────────────┬─────────────┐
         │             │               │               │             │
         ▼             ▼               ▼               ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  SYSTEM     │ │   HOOKS     │ │    MCP      │ │   TOOLS     │ │PERMISSIONS  │
│  REMINDER   │ │   (r24)     │ │   (fvY)     │ │   (_c)      │ │  Context    │
│   (suY)     │ │             │ │             │ │             │ │             │
└──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
       │               │               │               │               │
       │               │               │               │               │
       └───────────────┴───────────────┴───────────────┴───────────────┘
                                       │
                                       ▼
                    ┌─────────────────────────────────────┐
                    │        AGENT LOOP RUNNER            │
                    │              (qh)                   │
                    └──────────────────┬──────────────────┘
                                       │
         ┌─────────────┬───────────────┼───────────────┬─────────────┐
         │             │               │               │             │
         ▼             ▼               ▼               ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   COMPACT   │ │  TELEMETRY  │ │   SKILLS    │ │  TODO/TASK  │ │  LLM API    │
│   (mf6)     │ │   (c36)     │ │  (NvY)      │ │ MANAGEMENT  │ │   (Yh)      │
│             │ │             │ │             │ │             │ │             │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

---

## Related Documents

- [system_reminder_integration_complete_v8.md](./system_reminder_integration_complete_v8.md) - System reminder details
- [hooks_integration.md](./hooks_integration.md) - Hooks integration
- [compact_integration.md](./compact_integration.md) - Compact integration
- [tools_integration.md](./tools_integration.md) - Tools integration

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - All cross-feature linkages documented