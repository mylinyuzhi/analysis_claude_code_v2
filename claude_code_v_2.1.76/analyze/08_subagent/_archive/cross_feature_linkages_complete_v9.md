# Cross Feature Linkages Complete V9 (Claude Code 2.1.76)

> Complete documentation of how subagent and background agents integrate with other features including system reminders, hooks, compact, MCP, plan mode, and more.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified_v3.md](../08_subagent/cross_validation_unified_v3.md) - Unified symbol verification

---

## Integration Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SUBAGENT INTEGRATION MAP                                  │
└─────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────────────┐
                                    │   Agent Tool    │
                                    │    (QW6)        │
                                    └────────┬────────┘
                                             │
         ┌───────────────────────────────────┼───────────────────────────────────┐
         │                                   │                                   │
         ▼                                   ▼                                   ▼
┌─────────────────┐                ┌─────────────────┐                ┌─────────────────┐
│ System Reminder │                │     Hooks       │                │     Tools       │
│    (04)         │                │    (11)         │                │    (05)         │
│                 │                │                 │                │                 │
│ • suY: task     │                │ • SubagentStart │                │ • Xk8: filter   │
│   status inj.   │                │ • SubagentStop  │                │ • _c: apply     │
│ • f4: attach    │                │ • Hook context  │                │   filters       │
└────────┬────────┘                └────────┬────────┘                └────────┬────────┘
         │                                   │                                   │
         │                                   │                                   │
         └───────────────────────────────────┼───────────────────────────────────┘
                                             │
         ┌───────────────────────────────────┼───────────────────────────────────┐
         │                                   │                                   │
         ▼                                   ▼                                   ▼
┌─────────────────┐                ┌─────────────────┐                ┌─────────────────┐
│    Compact      │                │      MCP        │                │    Plan Mode    │
│    (07)         │                │    (06)         │                │    (12)         │
│                 │                │                 │                │                 │
│ • Token mgmt    │                │ • Tool access   │                │ • Plan approval │
│ • Context       │                │ • Server req.   │                │ • ExitPlanMode  │
│   retention     │                │ • Resource load │                │   exception     │
└────────┬────────┘                └────────┬────────┘                └────────┬────────┘
         │                                   │                                   │
         └───────────────────────────────────┼───────────────────────────────────┘
                                             │
         ┌───────────────────────────────────┼───────────────────────────────────┐
         │                                   │                                   │
         ▼                                   ▼                                   ▼
┌─────────────────┐                ┌─────────────────┐                ┌─────────────────┐
│   Teammates     │                │     Skills      │                │   Telemetry     │
│    (30)         │                │    (09)         │                │    (17)         │
│                 │                │                 │                │                 │
│ • Mailbox comms │                │ • Skill loading │                │ • Progress evt  │
│ • Team context  │                │ • NvY resolve   │                │ • nl4 telemetry │
│ • Delegation    │                │ • Prompt inject │                │ • Task metrics  │
└─────────────────┘                └─────────────────┘                └─────────────────┘
```

---

## Integration 1: System Reminder (04_system_reminder)

### How It Works

When the main agent loop prepares a request to the LLM API, it calls `assembleAllAttachments` which includes task status attachments.

### Flow

```
Agent Loop prepares request
        │
        ▼
assembleAllAttachments (_uY)
        │
        ├─── getUnifiedTasksAttachment (suY)
        │    │
        │    ├─── Poll output files
        │    ├─── Build attachments
        │    └─── Update task state
        │
        ▼
normalizeAttachmentForAPI (Ui8)
        │
        ├─── Convert to user messages
        └─── Add isMeta: true
        │
        ▼
LLM receives task status in context
```

### Attachment Types

| Type | Content | When Used |
|------|---------|-----------|
| `task_status` | Current task status | Every turn |
| `task_progress` | Incremental progress | On update |
| `task_reminder` | Periodic reminder | Every N turns |

### Code Reference

```javascript
// In getUnifiedTasksAttachment (chunks.147.mjs:1033)
return attachments.map((attachment) => ({
    type: "task_status",
    taskId: attachment.taskId,
    taskType: attachment.taskType,
    status: attachment.status,
    description: attachment.description,
    deltaSummary: attachment.deltaSummary
}));
```

### XML Format for LLM

```xml
<task_status>
  <task id="a7x9k2m3" type="local_agent" status="running">
    <description>Search codebase for authentication patterns</description>
    <progress tools="5" tokens="12543" />
    <summary>Found 12 patterns in auth/ directory...</summary>
  </task>
</task_status>
```

---

## Integration 2: Hooks (11_hooks)

### Hook Events

| Event | Trigger | Data |
|-------|---------|------|
| `SubagentStart` | When subagent begins | agentType, prompt |
| `SubagentStop` | When subagent ends | agentType, result |

### Hook Context Injection

When hooks are registered on an agent, they can inject additional context:

```javascript
// In agentLoopRunner (chunks.133.mjs:1636-1646)
for await (let event of hookEventGenerator(agentId, agentType, abortSignal)) {
    if (event.additionalContexts?.length > 0) {
        let attachment = createTaskStatusAttachment({
            type: "hook_additional_context",
            content: event.additionalContexts,
            hookName: "SubagentStart",
            toolUseID: generateToolUseId(),
            hookEvent: "SubagentStart"
        });
        messages.push(attachment);
    }
}
```

### Hook Registration

```javascript
// In agentLoopRunner (chunks.133.mjs:1647)
if (agentDefinition.hooks) {
    registerHooks(setAppState, agentId, agentDefinition.hooks,
        `agent '${agentDefinition.agentType}'`, true);
}
```

### Hook Cleanup

```javascript
// In agentLoopRunner finally block (chunks.133.mjs:1783)
if (agentDefinition.hooks) {
    unregisterHooks(setAppState, agentId);
}
```

---

## Integration 3: MCP (06_mcp)

### Required MCP Servers

Agents can specify required MCP servers that must be connected:

```javascript
// In AgentTool.call (chunks.136.mjs:1633-1649)
let requiredMcpServers = agentDefinition.requiredMcpServers;

if (requiredMcpServers?.length) {
    // Check if any required servers are pending
    let hasPending = appState.mcp.clients.some(c =>
        c.type === "pending" &&
        requiredMcpServers.some(s => c.name.toLowerCase().includes(s.toLowerCase()))
    );

    // Wait up to 30 seconds for pending servers
    if (hasPending) {
        let deadline = Date.now() + 30000;
        while (Date.now() < deadline) {
            await new Promise(r => setTimeout(r, 500));
            // ... check for connection
        }
    }
}
```

### MCP Tool Access

All MCP tools (starting with `mcp__`) are always allowed for subagents:

```javascript
// In filterToolsForSubagent (chunks.93.mjs:1574-1575)
if (tool.name.startsWith("mcp__")) return true;
```

---

## Integration 4: Plan Mode (12_plan_mode)

### ExitPlanMode Exception

In plan mode, `ExitPlanMode` is allowed even for background agents:

```javascript
// In filterToolsForSubagent (chunks.93.mjs:1576-1577)
if (isToolNamed(tool, "ExitPlanMode") && permissionMode === "plan") {
    return true;
}
```

### Plan Approval Flow

When a subagent with `mode: "plan"` calls `ExitPlanMode`:
1. Subagent yields a plan attachment
2. Main agent receives the plan
3. User must approve the plan
4. If approved, subagent continues executing

### Error Handling

```javascript
// In AgentTool.call (chunks.136.mjs:1575)
if (plan_mode_required) {
    // Subagent must complete planning phase first
}
```

---

## Integration 5: Compact (07_compact)

### Token Management

Subagents have their own token budget and compaction logic:

```javascript
// In agentLoopRunner - subagents inherit compaction settings
// but have independent message history
```

### Context Preservation

When forking, the parent's compacted context is preserved:

```javascript
// Fork context messages are already compacted
let messages = [...forkContextMessages ? filterOrphanedToolResults(forkContextMessages) : [], ...promptMessages];
```

---

## Integration 6: Skills (09_skill_system)

### Skill Loading

```javascript
// In agentLoopRunner (chunks.133.mjs:1648-1660)
let skills = agentDefinition.skills ?? [];

if (skills.length > 0) {
    let skillRegistry = await loadSkillRegistry();

    for (let skillName of skills) {
        let resolvedName = resolveSkillName(skillName, skillRegistry, agentDefinition);

        if (!resolvedName) {
            log(`[Agent: ${agentDefinition.agentType}] Warning: Skill '${skillName}' not found`);
            continue;
        }

        loadedSkills.push(resolvedName);
    }

    toolUseContext.loadedSkills = loadedSkills;
}
```

### Skill Name Resolution

The `NvY` function resolves skill names using three strategies:
1. Exact match
2. Namespace prefix (agentType:skillName)
3. Suffix match (:skillName)

---

## Integration 7: Telemetry (17_telemetry)

### Progress Telemetry

```javascript
// In updateTaskProgressWithTelemetry (chunks.146.mjs:2077-2096)
if (telemetryData && isTelemetryEnabled()) {
    sendTelemetry({
        type: "system",
        subtype: "task_progress",
        task_id: taskId,
        tool_use_id: toolUseId,
        description: summary,
        usage: {
            total_tokens: tokenCount,
            tool_uses: toolUseCount,
            duration_ms: Date.now() - startTime
        },
        summary: summary
    });
}
```

### Task Started Telemetry

```javascript
// In registerTask (chunks.90.mjs:3026-3034)
sendTelemetry({
    type: "system",
    subtype: "task_started",
    task_id: taskRecord.id,
    tool_use_id: taskRecord.toolUseId,
    description: taskRecord.description,
    task_type: taskRecord.type,
    prompt: "prompt" in taskRecord ? taskRecord.prompt : undefined
});
```

---

## Integration 8: Teammates (30_agent_teams)

### Teammate Spawning

When spawning a teammate with `name` and `team_name`:

```javascript
// In AgentTool.call (chunks.136.mjs:1565-1584)
if (resolvedTeamName && name) {
    let spawnResult = await spawnTeammate({
        name,
        prompt,
        description,
        team_name: resolvedTeamName,
        use_splitpane: true,
        plan_mode_required: mode === "plan",
        model: effectiveModel ?? agentDefinition?.model,
        agent_type: subagent_type
    }, toolUseContext);

    return {
        data: {
            status: "teammate_spawned",
            prompt,
            ...spawnResult.data
        }
    };
}
```

### Mailbox Communication

Teammates communicate via mailbox files:

```javascript
// Send message to teammate
await writeToMailbox(recipientName, message, teamName);

// Read own mailbox
let messages = await readMailbox(myName, teamName);

// Mark as read
await markMessagesAsRead(myName, teamName);
```

---

## Integration 9: Background Agents (26_background_agents)

### Background Task Creation

```javascript
// In AgentTool.call when run_in_background: true
let taskRecord = createBackgroundAgentTask({
    agentId,
    description,
    prompt,
    selectedAgent,
    setAppState,
    parentAbortController,
    toolUseId
});

return {
    data: {
        status: "async_launched",
        agentId,
        description,
        prompt,
        outputFile: taskRecord.outputFile,
        canReadOutputFile: hasReadOrBashTool
    }
};
```

### Kill Handling

```javascript
// Ctrl+F triggers killAllLocalAgents
killAllLocalAgents(appState.tasks, setAppState);

// Individual kill via TaskStop
triggerAbortSignal(taskId, setAppState);
```

---

## Summary Table

| Integration | Entry Point | Key Functions | Purpose |
|-------------|-------------|---------------|---------|
| System Reminder | Every LLM turn | `suY` | Task status injection |
| Hooks | Agent start/stop | `registerHooks` | Lifecycle events |
| MCP | Tool access | `filterToolsForSubagent` | Server requirements |
| Plan Mode | Tool filtering | `ExitPlanMode` exception | Plan approval |
| Compact | Message history | Fork context | Token management |
| Skills | Agent definition | `NvY` | Skill loading |
| Telemetry | Progress updates | `nl4` | Monitoring |
| Teammates | AgentTool.spawn | `qn4` | Parallel execution |
| Background | run_in_background | `Qn4` | Async execution |

---

## Related Documents

- [agent_tool_complete_source_v4.md](./agent_tool_complete_source_v4.md) - AgentTool
- [task_lifecycle_complete_source_v7.md](../26_background_agents/task_lifecycle_complete_source_v7.md) - Task lifecycle
- [system_reminder_integration_complete_v10.md](./system_reminder_integration_complete_v10.md) - System reminder

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - All cross-feature integrations documented