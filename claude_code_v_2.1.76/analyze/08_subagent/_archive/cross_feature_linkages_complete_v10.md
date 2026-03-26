# Cross Feature Linkages Complete V10 (Claude Code 2.1.76)

> Complete documentation of how subagent and background agent systems integrate with other modules including system reminders, hooks, compact, telemetry, and the main agent loop.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified_v5.md](./cross_validation_unified_v5.md) - Unified symbol verification

---

## Integration Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CROSS-FEATURE INTEGRATION ARCHITECTURE                     │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │   Main Agent    │
                              │     Loop        │
                              │   (chunks.148)  │
                              └────────┬────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        │                              │                              │
        ▼                              ▼                              ▼
┌─────────────────┐          ┌─────────────────┐          ┌─────────────────┐
│   AgentTool     │          │  System         │          │    Hooks        │
│   (chunks.136)  │          │  Reminders      │          │  (chunks.175)   │
│                 │          │  (chunks.147)   │          │                 │
│   Subagent      │◄────────►│                 │◄────────►│  Pre/Post/Stop  │
│   Spawning      │          │  Attachment     │          │                 │
└────────┬────────┘          │  Producers      │          └─────────────────┘
         │                   └────────┬────────┘
         │                            │
         ▼                            ▼
┌─────────────────┐          ┌─────────────────┐
│  Task State     │          │  Compact        │
│  (chunks.90)    │          │  (chunks.133)   │
│                 │          │                 │
│  tasks map      │◄────────►│  Message        │
│  Progress       │          │  Preservation   │
└────────┬────────┘          └─────────────────┘
         │
         ▼
┌─────────────────┐          ┌─────────────────┐
│  Telemetry      │          │  Output Files   │
│  (chunks.131)   │          │  (chunks.41)    │
│                 │          │                 │
│  Events:        │          │  .claude/tasks/ │
│  task_started   │          │  <id>.output    │
│  task_progress  │          │                 │
│  task_notif     │          └─────────────────┘
└─────────────────┘
```

---

## Integration 1: System Reminder System

### How Background Tasks Appear in LLM Context

The system reminder system injects task status into the LLM context on every turn, allowing the LLM to be aware of running background tasks without explicit polling.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SYSTEM REMINDER INTEGRATION                               │
└─────────────────────────────────────────────────────────────────────────────┘

Background Agent Running
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Task State (appState.tasks):                                                 │
│   {                                                                          │
│     "a7x9k2m3": {                                                            │
│       id: "a7x9k2m3",                                                        │
│       type: "local_agent",                                                   │
│       status: "running",                                                     │
│       description: "Search codebase for auth patterns",                     │
│       outputOffset: 1234,                                                    │
│       progress: {                                                            │
│         tokenCount: 4250,                                                    │
│         toolUseCount: 3,                                                     │
│         summary: "Found auth module in src/auth..."                         │
│       }                                                                      │
│     }                                                                        │
│   }                                                                          │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 │ Each LLM turn
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ _uY - assembleAllAttachments (chunks.147.mjs:3)                              │
│                                                                              │
│ Collects attachment producers:                                               │
│   - Todo attachment                                                          │
│   - Task status attachment ← suY()                                           │
│   - File context attachment                                                  │
│   - Custom attachments                                                       │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ suY - getUnifiedTasksAttachment (chunks.147.mjs:1033)                        │
│                                                                              │
│ async function getUnifiedTasksAttachment(toolUseContext) {                  │
│   // 1. Get current app state                                               │
│   let appState = toolUseContext.getAppState();                              │
│                                                                              │
│   // 2. Poll output files for new content                                   │
│   let { attachments, updatedTaskOffsets, evictedTaskIds } =                 │
│     await pollTaskOutputs(appState);                                         │
│                                                                              │
│   // 3. Update task state                                                   │
│   updateTaskState(toolUseContext.setAppState, updatedTaskOffsets,           │
│     evictedTaskIds);                                                         │
│                                                                              │
│   // 4. Return attachments for LLM                                          │
│   return attachments.map(att => ({                                           │
│     type: "task_status",                                                     │
│     taskId: att.taskId,                                                      │
│     taskType: att.taskType,                                                  │
│     status: att.status,                                                      │
│     description: att.description,                                            │
│     deltaSummary: att.deltaSummary                                           │
│   }));                                                                       │
│ }                                                                            │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Ui8 - normalizeAttachmentForAPI (chunks.174.mjs:330)                         │
│                                                                              │
│ case "task_status": {                                                        │
│   let displayStatus = attachment.status === "killed" ? "stopped"             │
│     : attachment.status;                                                     │
│                                                                              │
│   if (attachment.status === "killed") {                                      │
│     return [createUserMessage({                                              │
│       content: formatText(`Task "${attachment.description}" (${taskId})     │
│         was stopped by the user.`),                                          │
│       isMeta: true                                                           │
│     })];                                                                     │
│   }                                                                          │
│                                                                              │
│   return [createUserMessage({                                                │
│     content: formatText(`Background agent "${attachment.description}"        │
│       (${taskId}) is ${displayStatus}...`),                                  │
│     isMeta: true                                                             │
│   })];                                                                       │
│ }                                                                            │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ LLM receives message with isMeta: true                                       │
│                                                                              │
│ Messages sent to API:                                                        │
│   [                                                                          │
│     { type: "user", content: "Search the codebase..." },                     │
│     { type: "assistant", content: [...], tool_calls: [...] },               │
│     { type: "user", content: [{ type: "tool_result", ... }] },              │
│     {                                                                        │
│       type: "user",                                                          │
│       content: "Background agent 'Search codebase' is running...",          │
│       isMeta: true   ← Not shown in UI, but visible to LLM                   │
│     }                                                                        │
│   ]                                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Attachment Types for Tasks

| Type | Trigger | Content |
|------|---------|---------|
| `task_status` | Running task | Status, description, progress summary |
| `task_status` | Completed task | Status, final summary, usage metrics |
| `task_status` | Failed task | Status, error message |
| `task_status` | Killed task | Status, "stopped by user" |

---

## Integration 2: Hooks System

### How Hooks Affect Subagent Tool Execution

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         HOOKS INTEGRATION                                    │
└─────────────────────────────────────────────────────────────────────────────┘

Subagent calls tool (e.g., Read)
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ y4q - executePreToolHooksIterator (chunks.146.mjs:74)                        │
│                                                                              │
│ for (let hook of hooks) {                                                    │
│   if (hook.event === "PreToolUse") {                                         │
│     let result = await hook.handler({                                        │
│       tool_name: toolName,                                                   │
│       tool_input: toolInput,                                                 │
│       tool_use_id: toolUseId                                                 │
│     });                                                                      │
│                                                                              │
│     if (result === "deny") {                                                 │
│       throw new HookDeniedError("Tool denied by hook");                      │
│     }                                                                        │
│     if (result?.decision === "ask") {                                        │
│       // Prompt user for permission                                          │
│       let userChoice = await promptUser(...);                                │
│       if (userChoice === "deny") throw ...;                                  │
│     }                                                                        │
│   }                                                                          │
│ }                                                                            │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
        ┌────────────────────────┴────────────────────────┐
        │                                                 │
        ▼                                                 ▼
┌───────────────────────┐                     ┌───────────────────────┐
│ ALLOW                 │                     │ DENY                  │
│                       │                     │                       │
│ Continue tool         │                     │ Return error to       │
│ execution             │                     │ LLM:                  │
│                       │                     │ "Tool denied by hook" │
└───────────┬───────────┘                     └───────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Tool executes                                                                │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ k4q - executePostToolHooksIterator (chunks.145.mjs:3107)                     │
│                                                                              │
│ for (let hook of hooks) {                                                    │
│   if (hook.event === "PostToolUse") {                                        │
│     await hook.handler({                                                     │
│       tool_name: toolName,                                                   │
│       tool_input: toolInput,                                                 │
│       tool_result: toolResult,                                               │
│       tool_use_id: toolUseId                                                 │
│     });                                                                      │
│   }                                                                          │
│ }                                                                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Hook Event Types Relevant to Subagents

| Event | When Fired | Can Modify |
|-------|------------|------------|
| `PreToolUse` | Before tool execution | Can deny/ask for tools |
| `PostToolUse` | After tool execution | Can modify result |
| `Stop` | After turn completes | Can add context |
| `PreCompact` | Before compaction | Can affect what's kept |

### Tool Filtering for Background Agents

Background agents have restricted tool access to prevent blocking operations:

```javascript
// ============================================
// Xk8 - filterToolsForSubagent (chunks.93.mjs:1568)
// ============================================

function filterToolsForSubagent({
    tools,
    isBuiltIn,
    isAsync,
    permissionMode
}) {
    return tools.filter((tool) => {
        // MCP tools always allowed
        if (tool.name.startsWith("mcp__")) return true;

        // ExitPlanMode allowed in plan mode
        if (matchesTool(tool, "ExitPlanMode") && permissionMode === "plan") {
            return true;
        }

        // Block background-agent-excluded tools
        if (BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)) {
            return false;
        }

        // Non-builtin can't use certain tools
        if (!isBuiltIn && ASYNC_AGENT_EXCLUDED_TOOLS.has(tool.name)) {
            return false;
        }

        // Async agents only use whitelisted tools
        if (isAsync && !ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name)) {
            // Exception for team mode
            if (isTeamModeEnabled() && isTaskSystemEnabled()) {
                if (matchesTool(tool, "Agent")) return true;
                if (TEAM_DELEGATE_TOOLS.has(tool.name)) return true;
            }
            return false;
        }

        return true;
    });
}
```

---

## Integration 3: Compact System

### How Task Messages Are Preserved During Compaction

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPACT INTEGRATION                                  │
└─────────────────────────────────────────────────────────────────────────────┘

Context exceeds token limit
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ sqq - autoCompact (chunks.147.mjs:2633)                                       │
│                                                                              │
│ async function autoCompact(messages, context) {                              │
│   let compactor = new Compactor(messages, {                                  │
│     keepRecentCount: KEEP_RECENT_COUNT,                                      │
│     preserveIsMeta: true,   // ← Task status attachments preserved!         │
│     ...                                                                      │
│   });                                                                        │
│   return compactor.compact();                                                │
│ }                                                                            │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Compaction preserves:                                                        │
│                                                                              │
│   ✓ User messages (last N)                                                   │
│   ✓ Tool results (with summaries)                                            │
│   ✓ Messages with isMeta: true ← Task status attachments                    │
│   ✓ System messages                                                          │
│                                                                              │
│ Compaction summarizes:                                                       │
│                                                                              │
│   → Old assistant messages (summarized to key points)                       │
│   → Old tool calls (summarized by tool name)                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

### isMeta Flag Handling

```javascript
// Messages with isMeta: true are preserved during compaction
let message = {
    type: "user",
    content: "Background agent 'Search codebase' is running...",
    isMeta: true   // This flag prevents compaction
};

// In compaction logic:
if (message.isMeta) {
    // Always keep, don't summarize
    keepMessage(message);
}
```

---

## Integration 4: Telemetry System

### Telemetry Events for Tasks

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TELEMETRY EVENTS                                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Task Started                                                                 │
│                                                                              │
│ c36({                                                                        │
│   type: "system",                                                            │
│   subtype: "task_started",                                                   │
│   task_id: "a7x9k2m3",                                                       │
│   tool_use_id: "toolu_123",                                                  │
│   description: "Search codebase",                                            │
│   task_type: "local_agent",                                                  │
│   prompt: "..."                                                              │
│ })                                                                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Task Progress                                                                │
│                                                                              │
│ c36({                                                                        │
│   type: "system",                                                            │
│   subtype: "task_progress",                                                  │
│   task_id: "a7x9k2m3",                                                       │
│   tool_use_id: "toolu_123",                                                  │
│   description: "Search codebase",                                            │
│   usage: {                                                                   │
│     total_tokens: 4250,                                                      │
│     tool_uses: 3,                                                            │
│     duration_ms: 45000                                                       │
│   },                                                                         │
│   summary: "Found auth module..."                                            │
│ })                                                                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Task Notification (Completion/Failure/Kill)                                  │
│                                                                              │
│ c36({                                                                        │
│   type: "system",                                                            │
│   subtype: "task_notification",                                              │
│   task_id: "a7x9k2m3",                                                       │
│   tool_use_id: "toolu_123",                                                  │
│   status: "completed" | "failed" | "stopped",                                │
│   usage: {                                                                   │
│     total_tokens: 12543,                                                     │
│     tool_uses: 5,                                                            │
│     duration_ms: 45000                                                       │
│   }                                                                          │
│ })                                                                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Agent Tool Selected                                                          │
│                                                                              │
│ d("tengu_agent_tool_selected", {                                             │
│   agent_type: "general-purpose",                                             │
│   model: "claude-sonnet-4",                                                  │
│   source: "builtin",                                                         │
│   color: null,                                                               │
│   is_built_in_agent: true,                                                   │
│   is_resume: false,                                                          │
│   is_async: true,                                                            │
│   is_fork: false                                                             │
│ })                                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Integration 5: Main Agent Loop

### How Subagent Events Are Processed

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MAIN AGENT LOOP INTEGRATION                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Yh - mainAgentLoop (chunks.148.mjs:875)                                       │
│                                                                              │
│ async function* mainAgentLoop(params) {                                      │
│   while (true) {                                                             │
│     // 1. Get attachments (including task_status)                           │
│     let attachments = await assembleAllAttachments(context);                 │
│                                                                              │
│     // 2. Build API messages                                                 │
│     let apiMessages = normalizeMessages(messages, attachments);              │
│                                                                              │
│     // 3. Call LLM API                                                       │
│     for await (let event of callModel(apiMessages)) {                        │
│       yield event;                                                           │
│                                                                              │
│       // 4. Handle tool calls                                                │
│       if (event.type === "tool_use") {                                       │
│         if (event.tool_name === "Agent") {                                   │
│           // Spawn subagent                                                  │
│           let result = await AgentTool.call(...);                            │
│           yield { type: "tool_result", ...result };                          │
│         }                                                                    │
│       }                                                                      │
│     }                                                                        │
│   }                                                                          │
│ }                                                                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Async Event Flow

```
Main Loop (running)
        │
        ├── Spawns background agent
        │       │
        │       └── Runs independently
        │               │
        │               ├── Updates progress → nl4()
        │               ├── Writes to output file
        │               └── Completes → $m8()
        │
        ├── Continues processing user messages
        │
        └── Next turn:
                │
                ├── assembleAllAttachments()
                │       │
                │       └── getUnifiedTasksAttachment()
                │               │
                │               └── Polls output files
                │               └── Returns task_status
                │
                └── LLM sees background task status
```

---

## Integration 6: Kill Handlers

### Task-Type-Specific Kill Handlers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         KILL HANDLER ARCHITECTURE                            │
└─────────────────────────────────────────────────────────────────────────────┘

User triggers kill (Ctrl+F or TaskStop)
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Qk1 - stopTask (chunks.143.mjs:1580)                                         │
│                                                                              │
│ function stopTask(taskId, setAppState) {                                      │
│   let task = getTask(taskId);                                                │
│   let handler = getKillHandlerForType(task.type);                            │
│   return handler.kill(taskId, { setAppState });                              │
│ }                                                                            │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────────┐
        │                        │                            │
        ▼                        ▼                            ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Lf6             │     │ Fk1             │     │ Fn4             │
│ LocalBashTask   │     │ LocalAgentTask  │     │ RemoteAgentTask │
│                 │     │                 │     │                 │
│ kill:           │     │ kill:           │     │ kill:           │
│   x66(taskId)   │     │   x66(taskId)   │     │   Bridge.kill() │
│   process.kill  │     │                 │     │   (remote)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Kill Handler Registry

```javascript
// ============================================
// Kill handler registry
// ============================================

const KILL_HANDLERS = {
    local_bash: LocalBashTask,      // chunks.133.mjs:2542
    local_agent: LocalAgentTask,    // chunks.146.mjs:2292
    remote_agent: RemoteAgentTask,  // chunks.136.mjs:1175
    in_process_teammate: InProcessTeammateTask
};

function getKillHandlerForType(taskType) {
    return KILL_HANDLERS[taskType] || DefaultKillHandler;
}
```

---

## Cross-Feature Integration Matrix

| Feature | Integration Point | Data Flow |
|---------|-------------------|-----------|
| System Reminders | `suY` | Task state → Attachment → LLM context |
| Hooks | `y4q`, `k4q` | Tool execution ↔ Hook handlers |
| Compact | `sqq` | isMeta messages preserved |
| Telemetry | `c36`, `d` | Events → Analytics |
| Main Loop | `Yh` | Tool calls → Subagent spawning |
| Kill Handlers | `Qk1` | Kill signal → Task-type handler |

---

## Related Documents

- [key_algorithms_deep_dive_v11.md](./key_algorithms_deep_dive_v11.md) - Algorithm analysis
- [ui_interaction_complete_v6.md](./ui_interaction_complete_v6.md) - UI interactions
- [system_reminder_integration_complete_v10.md](./system_reminder_integration_complete_v10.md) - System reminder details

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - All cross-feature integrations documented