# Cross-Feature Linkages Complete (Claude Code 2.1.76)

> Complete documentation of all integration points between the subagent/background agent systems and other Claude Code modules, including system reminders, tools, hooks, compact, telemetry, CLI, plan mode, task system, MCP, skills, and the main agent loop.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `getUnifiedTasksAttachment` (suY) - Task status attachment builder
- `assembleAllAttachments` (_uY) - Collects all attachment producers
- `normalizeAttachmentForAPI` (Ui8) - Converts attachments to API messages
- `AgentTool` (QW6) - Main subagent spawning entry point
- `filterToolsForSubagent` (Xk8) - Tool access control for subagents
- `applyToolFilters` (_c) - Whitelist/blacklist application
- `agentLoopRunner` (qh) - Runs the agent loop
- `mainAgentLoop` (Yh) - Main LLM message loop
- `createBackgroundAgentTask` (Qn4) - Background task creation
- `createForegroundAgentTask` (Un4) - Foreground task creation
- `triggerAbortSignal` (x66) - Abort signal dispatch
- `markTaskCompleted` ($m8) - Task completion handler
- `markTaskFailed` (Hm8) - Task failure handler
- `markTaskKilled` (d4q) - Task kill handler
- `killAllLocalAgents` (U4q) - Kill all running background agents
- `updateTaskProgressWithTelemetry` (nl4) - Progress + telemetry emission
- `spawnTeammateDispatcher` (pNY) - Teammate spawn routing
- `inProcessAgentRunner` (XNY) - In-process teammate execution
- `pollForNextMessage` (DNY) - Teammate message polling
- `readMailbox` (wl) - Read teammate mailbox
- `writeToMailbox` (x3) - Write to teammate mailbox
- `markMessageAsReadByIndex` (Vc6) - Mark mailbox message read
- `connectAgentMcpServers` (fvY) - Per-agent MCP server connections
- `resolveSkillByName` (NvY) - Skill name resolution for agents
- `stopTask` (Qk1) - Kill handler dispatcher
- `executePreToolHooksIterator` (y4q) - Pre-tool hook execution
- `executePostToolHooksIterator` (k4q) - Post-tool hook execution
- `isMessageRecordable` (TvY) - Message filtering for compact
- `countUniqueUris` (TIY) - LSP URI counting (NOT progress throttling; see correction notes)
- `readOutputFileDelta` (Z97) - Reads background task output delta
- `pollTaskOutputs` (wY4) - Polls all task output files
- `updateTaskState` (OY4) - Updates task state from poll results

---

## Integration Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CROSS-FEATURE INTEGRATION ARCHITECTURE                     │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │   Main Agent    │
                              │     Loop (Yh)   │
                              │   (chunks.148)  │
                              └────────┬────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        │                              │                              │
        ▼                              ▼                              ▼
┌─────────────────┐          ┌─────────────────┐          ┌─────────────────┐
│   AgentTool     │          │  System         │          │    Hooks        │
│   QW6           │          │  Reminders      │          │  (chunks.175)   │
│   (chunks.136)  │          │  (chunks.147)   │          │                 │
│                 │◄────────►│                 │◄────────►│  Pre/Post/Stop  │
│   Subagent      │          │  Attachment     │          │                 │
│   Spawning      │          │  Producers      │          └─────────────────┘
└────────┬────────┘          └────────┬────────┘
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

Additional Integrations:
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  CLI (01_cli)   │  │ Plan Mode       │  │  Task System    │  │  Skills         │
│                 │  │ (12_plan_mode)  │  │ (13_task_system)│  │ (09_skills)     │
│  --print        │  │                 │  │                 │  │                 │
│  --verbose      │  │  AgentTool      │  │  TaskCreate     │  │  NvY resolve    │
│  Ctrl+C/F/B     │  │  restrictions   │  │  TaskUpdate     │  │  Prompt inject  │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘
                     ┌─────────────────┐
                     │  MCP (06_mcp)   │
                     │                 │
                     │  fvY per-agent  │
                     │  connections    │
                     └─────────────────┘
```

---

## Integration Matrix

| Feature | Subagent Integration | Background Agent Integration |
|---------|---------------------|------------------------------|
| 04_system_reminder | Task status attachments, hook context | Output polling, progress telemetry, notification queue |
| 05_tools | AgentTool (QW6), tool filtering (Xk8) | TaskOutput, TaskStop, BashTool background modes |
| 06_mcp | MCP server connections per agent (fvY) | MCP tools in background context |
| 07_compact | Transcript filtering, fork context (Fx8), isMeta preservation | Task state persists, output file retention |
| 08_subagent | Agent spawning, mailbox | Background execution, state |
| 09_skills | Skill loading (NvY), prompt injection | Skills available in background context |
| 12_plan_mode | Plan mode restrictions, ExitPlanMode exception | Agent tool blocked in plan mode |
| 13_task_system | Task tools for delegates (WY4) | Task creation, state updates |
| 17_hooks | SubagentStart, SubagentEnd, hook registration | PreToolUse, PostToolUse in background |
| 26_background_agents | Background spawn, kill handlers | Core functionality |
| 30_agent_teams | Teammate spawning (pNY), 3 spawn paths | In-process teammates, mailbox |
| 01_cli | Ctrl+C, Ctrl+F, Ctrl+B, /tasks | Task list, notifications, status line |
| Telemetry | Agent tool selected event | task_started, task_progress, task_notification |

---

## Integration 1: System Reminder (04_system_reminder)

### How Background Tasks Appear in LLM Context

The system reminder system injects task status into the LLM context on every turn, allowing the LLM to be aware of running background tasks without explicit polling.

**How it works:**
1. Each LLM turn, `assembleAllAttachments` (_uY) collects all attachment producers
2. `getUnifiedTasksAttachment` (suY) polls output files for new content
3. Attachments are normalized via `normalizeAttachmentForAPI` (Ui8) into user messages with `isMeta: true`
4. The LLM receives task status as part of its context, invisible in UI

**Why this approach:**
- Decouples task monitoring from explicit tool calls
- LLM always has current task state without wasting a tool call on polling
- `isMeta: true` flag keeps UI clean while informing the model

```
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
                                 │ Each LLM turn
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ _uY - assembleAllAttachments (chunks.147.mjs:3)                              │
│                                                                              │
│ Collects attachment producers:                                               │
│   - Todo attachment                                                          │
│   - Task status attachment ← suY()                                           │
│   - Task reminder attachment                                                 │
│   - Team context attachment ← AmY()                                          │
│   - Async hook response attachments                                          │
│   - Token usage attachment                                                   │
│   - File context attachment                                                  │
│   - Custom attachments                                                       │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ suY - getUnifiedTasksAttachment (chunks.147.mjs:1033)                        │
│                                                                              │
│ async function getUnifiedTasksAttachment(toolUseContext) {                  │
│   let appState = toolUseContext.getAppState();                              │
│   let { attachments, updatedTaskOffsets, evictedTaskIds } =                 │
│     await pollTaskOutputs(appState);             // wY4                      │
│   updateTaskState(toolUseContext.setAppState,     // OY4                     │
│     updatedTaskOffsets, evictedTaskIds);                                     │
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
└─────────────────────────────────────────────────────────────────────────────┘
```

### Progress Throttling (3-Turn)

**What it does:** Prevents LLM context from being flooded with progress updates by throttling to every 3 turns.

```javascript
// ============================================
// Progress turn-counting algorithm (inline in vIY, NOT TIY)
// TIY is countUniqueUris (LSP URI counting), not progress throttling.
// Location: chunks.142.mjs:2703-2717 (inlined in vIY)
// ============================================

const TURNS_BETWEEN_PROGRESS = 3;

function shouldShowProgressAttachment(state) {
    let turnsSinceLastProgress = countTurnsSinceLastProgressInline(state);  // inline in vIY
    return turnsSinceLastProgress >= TURNS_BETWEEN_PROGRESS;
}
```

**Key insight:** The 3-turn buffer balances keeping the LLM informed about background work without consuming excessive context tokens on every single turn.

### Attachment Types for Tasks

| Type | Trigger | Content |
|------|---------|---------|
| `task_status` | Running task | Status, description, progress summary |
| `task_status` | Completed task | Status, final summary, usage metrics |
| `task_status` | Failed task | Status, error message |
| `task_status` | Killed task | Status, "stopped by user" |
| `task_progress` | On update | Incremental progress |
| `task_reminder` | Every N turns | Periodic reminder of pending tasks |
| `team_context` | Teammate mode | Teammate context for coordination |

---

## Integration 2: Tools System (05_tools)

### AgentTool Pipeline

**What it does:** The AgentTool (QW6) is the single entry point for all subagent/background agent spawning. It routes to three distinct execution paths based on input parameters.

**How it works:**
1. Input validation via `agentInputSchema` (aVY) / `agentOutputSchema` (eVY)
2. Agent definition resolved from `subagent_type`
3. Routing decision: teammate (name + team_name), background (run_in_background), or foreground (default)
4. Task creation via `createBackgroundAgentTask` (Qn4) or `createForegroundAgentTask` (Un4)
5. Tool filtering via `filterToolsForSubagent` (Xk8) + `applyToolFilters` (_c)
6. Execution via `agentLoopRunner` (qh) / `mainAgentLoop` (Yh)

```
AgentTool.call({
    prompt: "...",
    subagent_type: "Explore",
    run_in_background: true,
    description: "Search codebase"
})
    │
    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Tool Input Validation                                                │
│   aVY (agentInputSchema) validates input                            │
│   eVY (agentOutputSchema) validates output                          │
└─────────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Routing Decision                                                     │
│   name + team_name → Teammate path (pNY)                            │
│   run_in_background → Background path (Qn4)                         │
│   default → Foreground path (Un4)                                    │
└─────────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Tool Filtering                                                       │
│   Xk8 (filterToolsForSubagent) applies rules                        │
│   _c (applyToolFilters) applies whitelist/blacklist                  │
└─────────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Execution                                                            │
│   qh (agentLoopRunner) runs agent loop                               │
│   Yh (mainAgentLoop) processes messages                              │
└─────────────────────────────────────────────────────────────────────┘
```

### Tool Filtering for Subagents

**What it does:** Controls which tools are available to subagents based on execution mode (async vs sync), agent type, and permission context.

**Why this approach:** Background agents are restricted to prevent dangerous interactions -- no nested Agent spawning (infinite loops), no user-facing tools (AskUserQuestion would block), no task management tools (polling loops).

```javascript
// ============================================
// filterToolsForSubagent - Tool access control
// Location: chunks.93.mjs:1568 (Xk8)
// ============================================

// ORIGINAL (for source lookup):
// function Xk8({ tools, isBuiltIn, isAsync, permissionMode }) { ... }

// READABLE (for understanding):
function filterToolsForSubagent({ tools, isBuiltIn, isAsync, permissionMode }) {
    return tools.filter((tool) => {
        // MCP tools always allowed
        if (tool.name.startsWith("mcp__")) return true;

        // Background agent restrictions
        if (isAsync) {
            return ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name);
        }

        if (BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)) {
            return false;
        }

        return true;
    });
}

// Blocked tools for background agents:
const BACKGROUND_AGENT_EXCLUDED_TOOLS = new Set([
    "TaskOutput",      // Could create polling loops
    "ExitPlanMode",    // Requires user approval
    "EnterPlanMode",   // Requires user approval
    "Agent",           // Could spawn nested agents
    "AskUserQuestion", // Would block indefinitely
    "TaskStop"         // Background shouldn't manage tasks
]);

// Async agent allowed tools:
const ASYNC_AGENT_ALLOWED_TOOLS = new Set([
    "Read", "Write", "Edit", "Bash", "Grep", "Glob",
    "WebFetch", "WebSearch", "TodoWrite", "NotebookEdit",
    "Skill", "StructuredOutput", "ToolSearch"
]);

// Mapping: Xk8->filterToolsForSubagent
```

### TaskOutput / TaskStop Integration

```
TaskOutput.call({ task_id: "a3k7m9p2" })
    │
    └── Reads output file via Z97 (readOutputFileDelta)
    └── Returns current output + status

TaskStop.call({ task_id: "a3k7m9p2" })
    │
    └── Calls x66 (triggerAbortSignal)
    └── Updates task status via d4q (markTaskKilled)
```

### BashTool Background Modes

**What it does:** Three distinct ways a Bash command can become a background task, each with different triggers.

**How it works:**

```javascript
// ============================================
// BashTool Background Modes
// Location: chunks.172.mjs
// ============================================

// 1. Explicit background
if (input.run_in_background) {
    // Always background, returns immediately
}

// 2. Timeout-based background (auto-backgrounding)
if (input.timeout && executionTime > AUTO_BACKGROUND_THRESHOLD) {
    // Assistant-mode auto-backgrounding
    // Default threshold: 120 seconds (m9z = 120000)
}

// 3. User interrupt (Ctrl+B)
if (userPressedCtrlB) {
    // Mid-run backgrounding
}
```

**Key insight:** The timeout-based auto-backgrounding (mode 2) allows long-running shell commands to transparently become background tasks without the LLM explicitly requesting background mode. The 120-second threshold balances responsiveness with avoiding premature backgrounding of commands that are just slightly slow.

---

## Integration 3: Hooks System (17_hooks)

### How Hooks Affect Subagent Tool Execution

**What it does:** Hooks intercept tool execution within subagents at two points: before (PreToolUse) and after (PostToolUse). This enables external control over what subagents can do.

**How it works:**
1. Before tool execution, `executePreToolHooksIterator` (y4q) runs all registered PreToolUse hooks
2. Hooks can return "deny" (block tool), "ask" (prompt user), or allow
3. After tool execution, `executePostToolHooksIterator` (k4q) runs PostToolUse hooks
4. PostToolUse hooks can modify tool results

```
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
│       let userChoice = await promptUser(...);                                │
│       if (userChoice === "deny") throw ...;                                  │
│     }                                                                        │
│   }                                                                          │
│ }                                                                            │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
        ┌────────────────────────┴────────────────────────┐
        ▼                                                 ▼
┌───────────────────────┐                     ┌───────────────────────┐
│ ALLOW                 │                     │ DENY                  │
│ Continue tool exec    │                     │ Return error to LLM:  │
│                       │                     │ "Tool denied by hook" │
└───────────┬───────────┘                     └───────────────────────┘
            │
            ▼
Tool executes → Result
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

### Subagent Hook Events

| Event | When Fired | Can Modify |
|-------|------------|------------|
| `SubagentStart` | When subagent begins execution | Can inject additional context |
| `SubagentEnd` | When subagent completes/fails | Can capture final result |
| `PreToolUse` | Before tool execution (in subagent) | Can deny/ask for tools |
| `PostToolUse` | After tool execution (in subagent) | Can modify result |
| `Stop` | After turn completes | Can add context |
| `PreCompact` | Before compaction | Can affect what's kept |

### Hook Registration and Cleanup in Agent Loop

```javascript
// ============================================
// Hook lifecycle in agentLoopRunner
// Location: chunks.133.mjs:1636-1648
// ============================================

// READABLE (for understanding):
async function* agentLoopRunner({ agentDefinition, ... }) {
    // 1. Dispatch SubagentStart hooks for additional context
    let additionalContexts = [];
    for await (let hookEvent of runAgentHooks(agentId, agentType, abortSignal)) {
        if (hookEvent.additionalContexts?.length > 0) {
            additionalContexts.push(...hookEvent.additionalContexts);
        }
    }

    // 2. Inject hook context as attachment
    if (additionalContexts.length > 0) {
        messages.push(createAttachmentMessage({  // f4
            type: "hook_additional_context",
            content: additionalContexts,
            hookName: "SubagentStart",
            toolUseID: generateToolUseId(),
            hookEvent: "SubagentStart"
        }));
    }

    // 3. Register agent-specific hooks
    if (agentDefinition.hooks) {
        registerAgentHooks(setAppState, agentId, agentDefinition.hooks,
            `agent '${agentDefinition.agentType}'`, true);
    }

    try {
        // ... execution ...
    } finally {
        // 4. Cleanup hooks
        if (agentDefinition.hooks) {
            deregisterAgentHooks(setAppState, agentId);
        }
    }
}
```

---

## Integration 4: Compact System (07_compact)

### How Task Messages Are Preserved During Compaction

**What it does:** During auto-compaction, messages with `isMeta: true` (task status attachments) are preserved, ensuring the LLM retains awareness of background tasks even after context reduction.

**How it works:**
1. Compaction triggers when token count exceeds threshold
2. `isMessageRecordable` (TvY) filters which messages can be kept
3. Messages with `isMeta: true` are always preserved (not summarized)
4. Task state in `appState.tasks` is NOT affected by compaction -- it persists independently
5. Background agent output files persist on disk regardless of compaction

```
Context exceeds token limit
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Compaction preserves:                                                        │
│                                                                              │
│   User messages (last N)                                                     │
│   Tool results (with summaries)                                              │
│   Messages with isMeta: true ← Task status attachments                      │
│   System messages                                                            │
│   Background agent tool_use calls (run_in_background flag)                   │
│   Background agent tool_result (async_launched status)                       │
│                                                                              │
│ Compaction summarizes:                                                       │
│                                                                              │
│   → Old assistant messages (summarized to key points)                       │
│   → Old tool calls (summarized by tool name)                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

### isMeta Flag Handling

**Key insight:** The `isMeta: true` flag serves dual purpose: it hides task status from the UI (not shown to user) while ensuring it survives compaction (always kept, never summarized). This is how the LLM maintains awareness of background work across compaction boundaries.

```javascript
// Messages with isMeta: true are preserved during compaction
let message = {
    type: "user",
    content: "Background agent 'Search codebase' is running...",
    isMeta: true   // Hidden from UI + survives compaction
};
```

### isMessageRecordable Filter

```javascript
// ============================================
// isMessageRecordable - Message filtering for compact
// Location: chunks.133.mjs:1561 (TvY)
// ============================================

function isMessageRecordable(message) {
    return message.type === "assistant" ||
           message.type === "user" ||
           message.type === "progress" ||
           (message.type === "system" && message.subtype === "compact_boundary");
}

// Mapping: TvY->isMessageRecordable
```

### Fork Context Building

When a subagent is spawned as a "fork" of the current conversation, the context is cloned with only complete tool_use/tool_result pairs:

```javascript
// ============================================
// cloneForkContext - Fork context for subagents
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

    // Filter to only complete tool use/result pairs
    return messages.filter((message) => {
        if (message?.type === "assistant") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                return content.some((block) =>
                    block.type === "tool_use" && toolUseIdsToKeep.has(block.id)
                );
            }
        }
        return true;
    });
}

// Mapping: Fx8->cloneForkContext
```

---

## Integration 5: Telemetry System

### Telemetry Events for Tasks

**What it does:** Tracks the full lifecycle of background tasks through telemetry events, enabling analytics on task success rates, durations, and resource usage.

```
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

## Integration 6: Main Agent Loop

### How Subagent Events Are Processed

**What it does:** The main agent loop (Yh) is where subagent spawning is triggered -- when the LLM emits a tool_use for "Agent", the loop handles creating and managing the subagent lifecycle.

**How it works:**
1. Main loop assembles attachments (including task_status from background agents)
2. Normalizes messages for API call
3. Streams LLM response
4. When tool_use for "Agent" is detected, spawns subagent via AgentTool
5. Background agents run independently; foreground agents block the loop

```
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
                │       └── getUnifiedTasksAttachment() (suY)
                │               │
                │               └── Polls output files (wY4)
                │               └── Returns task_status
                │
                └── LLM sees background task status
```

---

## Integration 7: Kill Handlers

### Task-Type-Specific Kill Handlers

**What it does:** Different task types have different kill mechanisms. The `stopTask` (Qk1) dispatcher routes kill requests to the appropriate handler based on task type.

**Why this approach:** Local bash tasks need process.kill(), local agent tasks need abort signals, remote agents need bridge communication. A registry pattern keeps kill logic clean and extensible.

```
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
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
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
const KILL_HANDLERS = {
    local_bash: LocalBashTask,         // Lf6 - chunks.133.mjs:2542
    local_agent: LocalAgentTask,       // Fk1 - chunks.146.mjs:2292
    remote_agent: RemoteAgentTask,     // Fn4 - chunks.136.mjs:1175
    in_process_teammate: InProcessTeammateTask
};

function getKillHandlerForType(taskType) {
    return KILL_HANDLERS[taskType] || DefaultKillHandler;
}
```

---

## Integration 8: CLI (01_cli)

### Keyboard Shortcuts

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              CLI → SUBAGENT/BACKGROUND INTEGRATION                           │
└─────────────────────────────────────────────────────────────────────────────┘

Ctrl+C Handler
    │
    ├── If foreground task running:
    │   └── x66 (triggerAbortSignal)
    │   └── d4q (markTaskKilled)
    │
    └── Else: Exit session

Ctrl+F Handler (v2.1.76)
    │
    └── U4q (killAllLocalAgents)
        └── Kills ALL running background agents

Ctrl+B Handler
    │
    └── backgroundCurrentTask()
        └── Mid-run backgrounding of current command

/tasks Command
    │
    └── Opens TaskListModal
        └── Shows all tasks from appState.tasks
```

### CLI Flags Affecting Subagent Behavior

```
--print flag:
    - Subagent results are printed to stdout
    - Output formatted for piping/automation
    - Background tasks auto-foregrounded after completion
    - Exit code reflects task status

--verbose flag:
    - Additional logging for subagent spawning
    - Output file path displayed on creation
    - Progress updates more frequent
    - Telemetry events logged to console

--no-background flag:
    - run_in_background parameter ignored
    - All agents run synchronously
    - Bash timeout-to-background disabled
```

### Status Line Integration

```
Status Line Display
    │
    ├── Running agent count
    │   └── Count of local_agent with status "running"
    │
    └── Kill hint
        └── "Ctrl+F stop" (interactive)
```

---

## Integration 9: Plan Mode (12_plan_mode)

### Plan Mode Restrictions on Subagents

**What it does:** In plan mode, the Agent tool is blocked entirely, preventing subagent spawning. Subagents that are already running inherit plan mode restrictions.

**Why this approach:** Plan mode is a safety mechanism requiring explicit user approval before taking actions. Spawning subagents would bypass this control since subagents could take actions independently.

```
AgentTool restrictions in plan mode:
┌─────────────────────────────────────────────────────────────────────────────┐
│ In plan mode (permissionMode === "plan"):                                    │
│                                                                              │
│   Agent tool blocked for spawning new subagents                              │
│   ExitPlanMode tool available                                                │
│   EnterPlanMode tool blocked (already in plan mode)                          │
│   Read, Grep, Glob allowed for research                                      │
│   Write, Edit blocked (requires approval)                                    │
│                                                                              │
│ Subagent behavior:                                                           │
│   - Subagents inherit plan mode restrictions                                │
│   - ExitPlanMode available to subagent                                       │
│   - Subagent can exit plan mode with user approval                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Plan Mode Tool Filtering

```javascript
// In filterToolsForSubagent (chunks.93.mjs:1576-1577)
// ExitPlanMode exception: allowed even for background agents in plan mode
if (isToolNamed(tool, "ExitPlanMode") && permissionMode === "plan") {
    return true;
}
```

---

## Integration 10: Task System (13_task_system)

### Teammate Task Tools

**What it does:** When team mode is enabled, teammates get access to structured task management tools for coordinating work.

```
Teammate has access to task tools:
    │
    ├── TaskCreate - Create structured task
    ├── TaskGet - Get task by ID
    ├── TaskList - List all tasks
    ├── TaskUpdate - Update task
    ├── SendMessage - Send message to teammate mailbox
    ├── CronCreate - Schedule recurring task
    ├── CronDelete - Remove scheduled task
    └── CronList - List scheduled tasks

Available when:
    └── isTeamMode() && isInProcessTeammate()
    └── Tools in WY4 (TEAM_DELEGATE_TOOLS)
```

---

## Integration 11: Agent Teams (30_agent_teams)

### Three Spawn Paths

**What it does:** Teammate spawning routes through `spawnTeammateDispatcher` (pNY) which selects one of three execution backends based on environment capabilities.

**How it works:**
1. In-process (Rb() check) -- `FNY` (spawnInProcessTeammate): non-interactive sessions
2. Split-pane (use_splitpane) -- `BNY` (spawnSplitPaneTeammate): iTerm2/tmux available
3. Tmux-only (fallback) -- `gNY` (spawnTmuxTeammate)

```
AgentTool.call({
    name: "worker1",
    team_name: "my_team",
    mode: "spawn"
})
    │
    ▼
pNY (spawnTeammateDispatcher)
    │
    ├── Check Rb() - In-process mode?
    │   └── Yes: FNY (in-process spawn)
    │
    ├── Check use_splitpane
    │   └── Yes: BNY (split-pane spawn)
    │
    └── Else: gNY (tmux spawn)
    │
    ▼
XNY (inProcessAgentRunner) - for in-process teammates
    │
    └── DNY (pollForNextMessage) - Message polling
    └── Mailbox: wl (readMailbox), x3 (writeToMailbox)
```

### Mailbox Communication

```
SendMessage.call({ to: "worker1", text: "..." })
    │
    └── x3 (writeToMailbox)
        └── Writes to .claude/teams/{team}/{agent}.json
        └── File-level locking for concurrent access

Teammate polls mailbox
    │
    └── wl (readMailbox)
    └── DNY (pollForNextMessage)
        └── Returns new messages
        └── Vc6 (markMessageAsReadByIndex)
```

### Teammate Restrictions

```javascript
// In AgentTool.call (chunks.136.mjs:1560-1564)
// Teammates cannot spawn other teammates
if (isTeammateMode() && isTeammate && name) {
    throw Error("Teammates cannot spawn other teammates");
}

// In-process teammates cannot spawn background agents
if (isInProcessTeammate() && isTeammate && runInBackground) {
    throw Error("In-process teammates cannot spawn background agents");
}
```

---

## Integration 12: MCP (06_mcp)

### MCP Server Connection Per Agent

**What it does:** Each agent can specify required MCP servers in its definition. The `connectAgentMcpServers` (fvY) function connects to these servers and makes their tools available to the agent.

**How it works:**
1. Agent definition specifies `mcpServers` (string names or object configs)
2. String-form servers are resolved from global MCP config
3. Object-form servers are treated as "dynamic" with `scope: "dynamic"`
4. Connected servers provide tools to the agent
5. Dynamic servers are cleaned up when the agent exits

**Why this approach:** Agents may need specialized external tools (e.g., a database MCP server for data analysis agents). Per-agent connections ensure cleanup and isolation -- dynamic servers don't leak between agents.

```javascript
// ============================================
// connectAgentMcpServers - Per-agent MCP connections
// Location: chunks.133.mjs:1502-1559 (fvY)
// ============================================

// READABLE (for understanding):
async function connectAgentMcpServers(agentDefinition, parentClients) {
    if (!agentDefinition.mcpServers?.length) {
        return { clients: parentClients, tools: [], cleanup: async () => {} };
    }

    let newClients = [];
    let dynamicClients = [];
    let newTools = [];

    for (let serverSpec of agentDefinition.mcpServers) {
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

        let client = await connectMcpServer(serverName, serverConfig);
        newClients.push(client);

        if (isDynamic) dynamicClients.push(client);

        if (client.type === "connected") {
            let tools = await getMcpTools(client);
            newTools.push(...tools);
        }
    }

    // Cleanup function for dynamic servers
    let cleanup = async () => {
        for (let client of dynamicClients) {
            if (client.type === "connected") await client.cleanup();
        }
    };

    return {
        clients: [...parentClients, ...newClients],
        tools: newTools,
        cleanup
    };
}

// Mapping: fvY->connectAgentMcpServers
```

### MCP Tool Access in Subagents

```javascript
// In filterToolsForSubagent (chunks.93.mjs:1575)
// MCP tools are always allowed for subagents
if (tool.name.startsWith("mcp__")) return true;
```

---

## Integration 13: Skills (09_skills)

### Skill Loading for Agents

**What it does:** Agents can specify skills in their frontmatter definition. When the agent starts, skills are loaded and their content is injected as prompt messages, giving the agent specialized knowledge.

**How it works:**
1. Agent definition contains `skills: ["skillName1", "skillName2"]`
2. `loadSkillIndex()` retrieves available skills
3. Each skill name is resolved via `resolveSkillByName` (NvY) which tries:
   - Exact match
   - Agent-prefixed name (e.g., `agentType:skillName`)
   - Suffix match (`:skillName`)
4. Resolved skills have their content injected as user messages

```javascript
// ============================================
// resolveSkillByName - Skill resolution for agents
// Location: chunks.133.mjs:1817-1828 (NvY)
// ============================================

// READABLE (for understanding):
function resolveSkillByName(skillName, skillIndex, agentDefinition) {
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

// Mapping: NvY->resolveSkillByName
```

**Key insight:** The three-stage resolution (exact, prefixed, suffix) allows skill names to be short in agent definitions while still being unambiguous. An agent of type "code-review" specifying skill "lint" would first try "lint", then "code-review:lint", then any skill ending in ":lint".

---

## Data Flow Summary

### Cross-Feature Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CROSS-FEATURE DATA FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────┘

User Input (01_cli)
    │
    ▼
Tool Call (05_tools) ─────────────────────┐
    │                                      │
    ├── AgentTool → Subagent (08_subagent) │
    │       │                              │
    │       ├── MCP Connection (fvY)       │
    │       ├── Skill Loading (NvY)        │
    │       ├── Tool Filtering (Xk8)       │
    │       ├── Task Creation (Qn4/Un4)    │
    │       └── Agent Execution (qh)       │
    │                                      │
    └── TaskOutput/TaskStop                │
            │                              │
            └── Background (26_background) │
                    │                      │
                    ├── Output Polling ────┤
                    ├── State Updates      │
                    └── Kill Handling      │
                                           │
Hooks (17_hooks) ◄─────────────────────────┤
    │                                      │
    ├── SubagentStart                      │
    ├── PreToolUse / PostToolUse           │
    └── SubagentEnd                        │
                                           │
System Reminders (04_system_reminder) ◄────┘
    │
    ├── Task Status Attachments (suY)
    ├── Progress Updates (nl4)
    ├── Notifications ($m8, Hm8, d4q)
    └── Team Context (AmY)
                │
                ▼
Telemetry ─── task_started / task_progress / task_notification
```

---

## Cross-Feature State Sharing

### State Propagation

```
App State (appState)
    │
    ├─── tasks: { [taskId]: TaskRecord }
    │    └─── Used by: System Reminders (suY), UI, Kill handlers (Qk1)
    │
    ├─── toolPermissionContext
    │    └─── Used by: Tool Filtering (Xk8), Plan Mode, Permissions
    │
    ├─── mcp
    │    └─── Used by: MCP tools, Agent MCP requirements (fvY)
    │
    ├─── hooks
    │    └─── Used by: Hook execution (y4q, k4q), Context injection (f4)
    │
    └─── agentDefinitions
         └─── Used by: Agent Tool (QW6), Skill resolution (NvY)
```

---

## Key Integration Patterns

### Pattern 1: Event-Driven Integration

```
Event: Task completion
    │
    ├── Trigger: $m8 (markTaskCompleted)
    │
    └── Side Effects:
        ├── State update (appState.tasks)
        ├── Notification creation
        ├── Telemetry emission (c36)
        └── System reminder attachment on next turn
```

### Pattern 2: Polling-Based Integration

```
Poll: Agent turn
    │
    ├── Trigger: Each LLM call
    │
    └── Actions:
        ├── wY4 (pollTaskOutputs)
        ├── suY (getUnifiedTasksAttachment)
        └── OY4 (updateTaskState)
```

### Pattern 3: Hook-Based Integration

```
Hook: SubagentStart
    │
    ├── Trigger: Subagent begins
    │
    └── Actions:
        ├── Hook execution
        ├── Context injection (f4)
        └── Logging
```

### Pattern 4: File-Based Communication

```
Communication: Teammate mailbox
    │
    ├── Writer: x3 (writeToMailbox)
    │   └── File: .claude/teams/{team}/{agent}.json
    │   └── Locking: lockfile for concurrent access
    │
    └── Reader: wl (readMailbox)
        └── Polling: DNY (pollForNextMessage)
        └── Acknowledgement: Vc6 (markMessageAsReadByIndex)
```

---

## Summary

The cross-feature linkages demonstrate:

1. **Deep integration** - Subagents/background agents touch 13+ modules
2. **Event-driven design** - Changes propagate through state updates and telemetry events
3. **Loose coupling** - Features communicate through well-defined interfaces (attachments, hooks, state)
4. **Shared state** - `appState.tasks` is the single source of truth for task lifecycle
5. **File-based communication** - Output files and mailboxes for persistence and cross-process coordination
6. **Safety by default** - Background agents have restricted tool access; plan mode blocks spawning
7. **Optional integrations** - MCP, hooks, skills are all opt-in per agent definition
8. **Lifecycle management** - Kill handlers, hook cleanup, MCP cleanup ensure proper teardown

---

## Related Documents

- [key_algorithms_deep_dive.md](./key_algorithms_deep_dive.md) - Algorithm analysis
- [ui_interaction_complete.md](./ui_interaction_complete.md) - UI interactions
- [system_reminder_integration_complete.md](./system_reminder_integration_complete.md) - System reminder details
- [../04_system_reminder/types_task_management.md](../04_system_reminder/types_task_management.md) - Task management types
- [../30_agent_teams/README.md](../30_agent_teams/README.md) - Agent teams documentation

---

**Last Updated**: 2026-03-28
**Version**: Claude Code 2.1.76
**Status**: Complete - All cross-feature integrations merged from v2/v5/v8/v11/current into single comprehensive document with 13 integration points
