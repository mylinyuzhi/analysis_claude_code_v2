# Cross Feature Linkages Complete V8 (Claude Code 2.1.76)

> Complete documentation of how subagent and background agents integrate with other features including system reminders, hooks, compact, MCP, and more.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified_v3.md](./cross_validation_unified_v3.md) - Unified symbol verification

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
    registerHooks(
        setAppState,
        agentId,
        agentDefinition.hooks,
        `agent '${agentDefinition.agentType}'`,
        true  // isSubagent
    );
}
```

---

## Integration 3: Compact (07_compact)

### Context Retention

During auto-compact, subagent messages are handled specially:

1. **isMeta messages** - Task status attachments have special retention rules
2. **Tool results** - Agent tool results may be summarized
3. **Conversation continuity** - Compaction preserves essential context

### Token Accounting

Background agent token usage is tracked separately:

```javascript
// In updateTaskProgressWithTelemetry (chunks.146.mjs:2059)
// Token counts are tracked in task.progress
{
    progress: {
        tokenCount: 12543,
        toolUseCount: 5,
        summary: "..."
    }
}
```

### Compact Integration Point

When compact runs, it can:
- Summarize completed background task results
- Remove old task status attachments
- Keep recent task context

---

## Integration 4: MCP (06_mcp)

### Tool Access

MCP tools are automatically allowed for subagents:

```javascript
// In filterToolsForSubagent (chunks.93.mjs:1575)
if (tool.name.startsWith("mcp__")) return true;
```

### MCP Server Requirements

Agents can specify required MCP servers:

```javascript
// In AgentTool.call (chunks.136.mjs:1633-1652)
let requiredServers = agentDefinition.requiredMcpServers;

if (requiredServers?.length) {
    // Wait for pending servers
    // Validate required servers are available
    // Throw error if missing
}
```

### MCP Resource Loading

If agent has memory configuration, MCP resources are loaded:

```javascript
// In agentLoopRunner (chunks.133.mjs:1691-1695)
if (agentDefinition.memory) {
    sendTelemetry("tengu_agent_memory_loaded", {
        scope: agentDefinition.memory,
        source: "subagent"
    });
}
```

---

## Integration 5: Plan Mode (12_plan_mode)

### Plan Mode Detection

Subagents inherit plan mode from parent:

```javascript
// In agentLoopRunner (chunks.133.mjs:1600-1630)
let effectiveMode = () => {
    let state = toolUseContext.getAppState();
    let permissionContext = state.toolPermissionContext;

    if (permissionMode && state.toolPermissionContext.mode !== "bypassPermissions") {
        permissionContext = { ...permissionContext, mode: permissionMode };
    }

    // ... additional mode handling
};
```

### ExitPlanMode Exception

In plan mode, ExitPlanMode is allowed even for background agents:

```javascript
// In filterToolsForSubagent (chunks.93.mjs:1576-1577)
if (isToolNamed(tool, "ExitPlanMode") && permissionMode === "plan") {
    return true;
}
```

### Plan Approval Flow

When subagent calls ExitPlanMode in plan mode:
1. Plan approval request sent to parent
2. Parent agent reviews plan
3. User approves/rejects
4. Result sent back to subagent

---

## Integration 6: Teammates (30_agent_teams)

### Teammate Detection

```javascript
// In AgentTool.call (chunks.136.mjs:1560-1564)
let isTeammate = checkTeamMode({ team_name }, appState);

if (isTeammateMode() && isTeammate && name) {
    throw Error("Teammates cannot spawn other teammates");
}

if (isInProcessTeammate() && isTeammate && runInBackground) {
    throw Error("In-process teammates cannot spawn background agents");
}
```

### Teammate-Specific Tools

Teammates get additional delegation tools:

```javascript
// In filterToolsForSubagent (chunks.93.mjs:1580-1584)
if (isAgentTeamsEnabled() && isInProcessTeammate()) {
    if (isToolNamed(tool, "Agent")) return true;
    if (TEAM_DELEGATE_TOOLS.has(tool.name)) return true;
}
```

### Mailbox Communication

Teammates communicate via file-based mailbox:

```javascript
// In mailbox functions (chunks.132.mjs)
// wl: readMailbox - Read messages from inbox
// x3: writeToMailbox - Write message to recipient's inbox
// Vc6: markMessageAsReadByIndex - Mark single message as read
// kc6: markMessagesAsRead - Mark all messages as read
```

---

## Integration 7: Skills (09_skill_system)

### Skill Loading

When an agent specifies skills in its frontmatter:

```javascript
// In agentLoopRunner (chunks.133.mjs:1648-1697)
let agentSkills = agentDefinition.skills ?? [];

if (agentSkills.length > 0) {
    let skillIndex = await loadSkillIndex();

    for (let skillName of agentSkills) {
        let resolvedName = resolveSkillName(skillName, skillIndex, agentDefinition);

        if (!resolvedName) {
            logWarning(`Skill '${skillName}' not found`);
            continue;
        }

        let skill = loadSkill(resolvedName, skillIndex);

        // Inject skill prompt into messages
        messages.push(createUserMessage({
            content: skill.content
        }));
    }
}
```

### Skill Resolution

```javascript
// In NvY (chunks.133.mjs:1817-1828)
function resolveSkillName(skillName, skillIndex, agentDefinition) {
    // Try exact match
    if (skillExists(skillName, skillIndex)) return skillName;

    // Try agent-prefixed name
    let agentPrefix = agentDefinition.agentType.split(":")[0];
    if (agentPrefix) {
        let prefixed = `${agentPrefix}:${skillName}`;
        if (skillExists(prefixed, skillIndex)) return prefixed;
    }

    // Try suffix match
    let suffix = `:${skillName}`;
    let match = skillIndex.find(s => s.name.endsWith(suffix));
    if (match) return match.name;

    return null;
}
```

---

## Integration 8: Telemetry (17_telemetry)

### Progress Telemetry

```javascript
// In updateTaskProgressWithTelemetry (chunks.146.mjs:2084-2096)
if (previousProgress && isTelemetryEnabled()) {
    sendTelemetryEvent({
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

### Agent Tool Telemetry

```javascript
// In AgentTool.call (chunks.136.mjs:1656-1665)
sendTelemetry("tengu_agent_tool_selected", {
    agent_type: agentDefinition.agentType,
    model: resolvedModel,
    source: agentDefinition.source,
    color: agentDefinition.color,
    is_built_in_agent: isBuiltIn(agentDefinition),
    is_resume: !!resumeId,
    is_async: runInBackground === true || agentDefinition.background === true,
    is_fork: isFork
});
```

---

## Cross-Feature State Sharing

### State Propagation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STATE PROPAGATION                                    │
└─────────────────────────────────────────────────────────────────────────────┘

App State (appState)
    │
    ├─── tasks: { [taskId]: TaskRecord }
    │    └─── Used by: System Reminders, UI, Kill handlers
    │
    ├─── toolPermissionContext
    │    └─── Used by: Tool Filtering, Plan Mode, Permissions
    │
    ├─── mcp
    │    └─── Used by: MCP tools, Agent MCP requirements
    │
    ├─── hooks
    │    └─── Used by: Hook execution, Context injection
    │
    └─── agentDefinitions
         └─── Used by: Agent Tool, Skill resolution
```

---

## Key Insight

The subagent system is designed as a **hub** that connects to all major features:

1. **System Reminders** - Task status becomes LLM context
2. **Hooks** - Enable extensibility and custom behavior
3. **Compact** - Proper token management
4. **MCP** - External tool integration
5. **Plan Mode** - Structured approval flows
6. **Teammates** - Multi-agent collaboration
7. **Skills** - Reusable prompt modules
8. **Telemetry** - Performance tracking

Each integration is **optional** and **non-blocking** - a subagent can run without MCP, without hooks, without skills, etc. This ensures robustness and flexibility.

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - All cross-feature integrations documented