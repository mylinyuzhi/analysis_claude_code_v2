# Subagent System — Feature Interconnections (Claude Code 2.1.76)

> Comprehensive analysis of how the subagent system integrates with other Claude Code systems:
> Tools System, System Reminders, Compact, Hooks, Agent Teams, and Background Agents.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `agentLoopRunner` (qh) - Core async generator for agent execution — `chunks.133.mjs:1565`
- `filterToolsForSubagent` (Xk8) - Filters tools for subagent context — `chunks.93.mjs:1568`
- `cloneForkContext` (Fx8) - Clones context for subagent isolation — `chunks.133.mjs:1788`
- `buildAgentSystemPrompt` (vvY) - Builds subagent system prompt — `chunks.133.mjs:1806`
- `AgentTool` (QW6) - The Agent/Task tool entry point — `chunks.136.mjs:1512`
- `spawnTeammate` (qn4) - Spawns teammate agent — `chunks.135.mjs:1116`
- `readMailbox` (wl) - Reads messages from mailbox — `chunks.132.mjs:3`
- `writeToMailbox` (x3) - Writes message to mailbox — `chunks.132.mjs:22`

---

## Overview

The subagent system is deeply integrated with multiple Claude Code subsystems. This document maps all integration points and analyzes the data flow between systems.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Integration Architecture                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                 │
│   │ 05_tools     │    │ 03_llm_core  │    │ 04_system_   │                 │
│   │ AgentTool    │◀───│ Agent Loop   │◀───│ reminder     │                 │
│   │ BashTool     │    │ LLM API      │    │ Attachments  │                 │
│   └──────┬───────┘    └──────┬───────┘    └──────┬───────┘                 │
│          │                   │                   │                          │
│          ▼                   ▼                   ▼                          │
│   ┌──────────────────────────────────────────────────────────┐             │
│   │                    08_subagent                             │             │
│   │                                                            │             │
│   │  • Agent Loop Runner (qh)                                  │             │
│   │  • Tool Filtering (Xk8)                                    │             │
│   │  • Fork Context Building (Fx8)                             │             │
│   │  • System Prompt Assembly (vvY)                            │             │
│   │  • Three Execution Modes (sync/async/teammate)             │             │
│   └──────────────────────────┬───────────────────────────────┘             │
│                             │                                                │
│          ┌──────────────────┼──────────────────┐                            │
│          ▼                  ▼                  ▼                            │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐                   │
│   │ 26_background│   │ 11_hooks     │   │ 07_compact   │                   │
│   │ _agents      │   │ PreToolUse   │   │ Transcript   │                   │
│   │ Task State   │   │ PostToolUse  │   │ Filtering    │                   │
│   └──────────────┘   └──────────────┘   └──────────────┘                   │
│                                                                              │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐                   │
│   │ 30_agent_    │   │ 13_task_     │   │ MCP          │                   │
│   │ teams        │   │ system       │   │ Tools        │                   │
│   │ Teammates    │   │ Structured   │   │ External     │                   │
│   └──────────────┘   └──────────────┘   └──────────────┘                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Integration 1: Tools System (05_tools)

### AgentTool Entry Point

The AgentTool (`QW6`) is the primary entry point for spawning subagents. It provides three execution modes through its input schema.

```javascript
// ============================================
// AgentTool schema with execution mode parameters
// Location: chunks.136.mjs:1444-1512
// ============================================

// READABLE (for understanding):
const agentInputSchema = z.object({
    // Core parameters
    description: z.string().describe("A short (3-5 word) description"),
    prompt: z.string().describe("The task for the agent"),
    subagent_type: z.enum([
        "general-purpose",
        "Explore",
        "Plan",
        "statusline-setup"
    ]).optional().default("general-purpose"),

    // Execution mode parameters
    run_in_background: z.boolean().optional().describe(
        "Set to true to run in background. Notified on completion."
    ),
    resume: z.string().optional().describe(
        "Resume a previous agent by ID"
    ),

    // Model selection (v2.1.76)
    model: z.enum(["sonnet", "opus", "haiku"]).optional(),

    // Teammate mode parameters
    name: z.string().optional().describe("Teammate agent name"),
    team_name: z.string().optional().describe("Team name for teammate mode"),

    // Worktree isolation (v2.1.76)
    isolation: z.enum(["none", "worktree"]).optional()
});
```

### Tool Filtering for Subagents

**What it does:** Each subagent receives a filtered tool set based on its execution mode and agent type.

**How it works:**

```javascript
// ============================================
// filterToolsForSubagent - Tool set assembly for subagent context
// Location: chunks.93.mjs:1568-1590
// ============================================

// READABLE (for understanding):
function filterToolsForSubagent({
    allTools,
    agentDefinition,
    isBackground,
    isTeammate
}) {
    let filteredTools = [...allTools];

    // Step 1: Apply agent type restrictions
    if (agentDefinition.excludedTools) {
        filteredTools = filteredTools.filter(
            tool => !agentDefinition.excludedTools.includes(tool.name)
        );
    }

    // Step 2: Apply background mode restrictions
    if (isBackground) {
        filteredTools = filteredTools.filter(tool => {
            // MCP tools always allowed
            if (tool.name.startsWith("mcp__")) return true;
            // Check against blocked set
            if (BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)) return false;
            // Check against allowed set
            return ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name);
        });
    }

    // Step 3: Apply teammate mode additions
    if (isTeammate) {
        filteredTools.push(...TEAM_DELEGATE_TOOLS.map(name =>
            allTools.find(t => t.name === name)
        ).filter(Boolean));
    }

    // Step 4: Apply mode-specific filters via resolveToolFilter
    return resolveToolFilter({
        tools: filteredTools,
        mode: agentDefinition.mode,
        allowedTools: agentDefinition.allowedTools
    });
}
```

**Why this approach:**
- **Layered filtering** - Multiple restriction layers compose safely
- **Agent type flexibility** - Each agent type can define custom restrictions
- **Background safety** - Prevents interactive tools in unattended contexts
- **Teammate empowerment** - Adds team communication tools when needed

### Tool Access Control Matrix

| Tool | Sync Agent | Background Agent | Teammate Agent |
|------|------------|------------------|----------------|
| `Read` | ✓ | ✓ | ✓ |
| `Write` | ✓ | ✓ | ✓ |
| `Edit` | ✓ | ✓ | ✓ |
| `Bash` | ✓ | ✓ | ✓ |
| `Grep`/`Glob` | ✓ | ✓ | ✓ |
| `WebFetch`/`WebSearch` | ✓ | ✓ | ✓ |
| `TodoWrite` | ✓ | ✓ | ✓ |
| `Skill` | ✓ | ✓ | ✓ |
| `Agent` (Task) | ✓ | ✗ | ✗ |
| `TaskOutput` | ✓ | ✗ | ✓ |
| `TaskStop` | ✓ | ✗ | ✓ |
| `AskUserQuestion` | ✓ | ✗ | ✗ |
| `EnterPlanMode` | ✓ | ✗ | ✗ |
| `ExitPlanMode` | ✓ | ✗ | ✓ (plan mode) |
| `SendMessage` | ✗ | ✗ | ✓ |
| `CronCreate/Delete/List` | ✗ | ✗ | ✓ |

---

## Integration 2: System Reminder System (04_system_reminder)

### Context Propagation

Subagents receive context through system reminder attachments from the parent session:

```javascript
// ============================================
// Fork context building for subagent isolation
// Location: chunks.133.mjs:1788-1806
// ============================================

// READABLE (for understanding):
function cloneForkContext(parentContext) {
    return {
        // Clone message history
        messages: parentContext.messages.map(cloneMessage),

        // Inherit permission mode
        permissionMode: parentContext.permissionMode,

        // Inhibit system reminders for subagent
        inhibitSystemReminders: true,

        // New agent identity
        agentId: generateAgentId(),
        parentAgentId: parentContext.agentId,

        // Inherited settings
        cwd: parentContext.cwd,
        modelOverride: parentContext.modelOverride,

        // Telemetry span linking
        parentSpanId: parentContext.currentSpanId
    };
}
```

**Key insight:** Subagents have `inhibitSystemReminders: true` to prevent infinite loops where a subagent could trigger reminders that spawn more subagents.

### Progress Reporting

Subagents report progress back to the parent through the task progress system:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Subagent Progress Flow                                 │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              Subagent Agent Loop (qh)                                    │
│                                                                          │
│  Each turn:                                                              │
│  1. Execute tool call                                                    │
│  2. updateTaskProgress(agentId, { toolUseCount, tokenCount })           │
│  3. appendToOutputFile(taskId, outputContent)                           │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              Parent Session State (appState.tasks)                       │
│                                                                          │
│  Task record updated:                                                    │
│  {                                                                       │
│    id: "a3f4b2",                                                        │
│    status: "running",                                                   │
│    progress: { toolUseCount: 5, tokenCount: 1234 }                     │
│  }                                                                       │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              System Reminder Injection                                   │
│                                                                          │
│  getUnifiedTasksAttachment() generates:                                 │
│  { type: "task_progress", taskId: "a3f4b2", message: "..." }           │
│                                                                          │
│  Injected into parent conversation as system-reminder                   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Integration 3: Background Agents (26_background_agents)

### Shared Infrastructure

Subagents and background agents share the same core infrastructure:

```javascript
// Shared task creation
let taskId = createTaskId("local_agent");  // Same ID generation

// Shared output file system
let outputFile = getOutputFilePath(taskId);  // Same file paths

// Shared notification
notifyTaskCompletion(taskId, description, status, ...);  // Same queue
```

### Execution Mode Differences

| Aspect | Sync Subagent | Background Subagent |
|--------|---------------|---------------------|
| Tool return | Blocks until complete | Returns `{ status: "async_launched" }` immediately |
| Output access | Direct return value | File-based polling |
| Progress visibility | Real-time streaming | System reminder attachments |
| Cancellation | Parent abort signal | Independent abort controller |
| Notification | Direct tool result | Queue injection via `notifyTaskCompletion` |

### Mid-Run Backgrounding

Subagents can transition from sync to background mid-execution:

```javascript
// ============================================
// Mid-run backgrounding via Promise.race
// Location: chunks.133.mjs (agent loop)
// ============================================

// READABLE (for understanding):
async function* agentLoopRunner(context) {
    let backgroundSignal = context.backgroundSignal;

    while (true) {
        // Race next message against background request
        let result = await Promise.race([
            nextMessage(),
            backgroundSignal
        ]);

        if (result.type === "background_request") {
            // Seamless transition to background
            yield {
                type: "async_launched",
                agentId: context.agentId,
                outputFile: context.outputFile
            };
            // Continue execution in background
            context.isBackgrounded = true;
        }

        // Normal message processing
        yield result;
    }
}
```

**Key insight:** The generator-based architecture enables seamless sync→async transitions without restarting the agent.

---

## Integration 4: Hooks System (11_hooks)

### Hook Execution in Subagent Context

Subagents execute hooks within their isolated context:

```javascript
// ============================================
// Subagent hook registration
// Location: chunks.95.mjs:1842
// ============================================

// READABLE (for understanding):
function registerAgentHooks(context) {
    let agentId = context.agentId;

    // Register hooks for this subagent
    let hookContext = {
        agentId,
        isSubagent: true,
        isBackground: context.isBackgrounded,
        parentAgentId: context.parentAgentId
    };

    // PreToolUse: Validate tool access
    onPreToolUse(async (toolName, input) => {
        // Background agents can't use blocked tools
        if (context.isBackgrounded &&
            BACKGROUND_AGENT_EXCLUDED_TOOLS.has(toolName)) {
            return { blocked: true, reason: "Tool not available in background mode" };
        }
        return { continue: true };
    });

    // PostToolUse: Capture output for background agents
    onPostToolUse(async (toolName, input, output) => {
        if (context.isBackgrounded) {
            appendToOutputFile(context.taskId, output);
        }
    });
}
```

### Hook Isolation

Each subagent has isolated hook state:

```
Parent Session Hooks          Subagent Hooks
       │                            │
       │  PreToolUse handlers       │  Isolated handlers
       │  PostToolUse handlers      │  (inherited + subagent-specific)
       │  Stop handlers             │
       │                            │
       └────────────────────────────┘
                  │
                  ▼
         Each subagent gets a fresh hook registry
         to prevent cross-contamination
```

---

## Integration 5: Compact System (07_compact)

### Transcript Handling

Subagent transcripts are handled specially during compaction:

```javascript
// ============================================
// Subagent transcript filtering during compact
// Location: chunks.173.mjs
// ============================================

// READABLE (for understanding):
function filterMessagesForCompaction(messages) {
    return messages.filter((message) => {
        // Keep subagent spawn messages
        if (message.role === "user" &&
            message.content?.some(c => c.type === "tool_use" &&
                                 c.name === "Agent")) {
            return true;
        }

        // Keep subagent results
        if (message.role === "assistant" &&
            message.content?.some(c => c.type === "tool_result" &&
                                 c.tool_use_id?.startsWith("agent_"))) {
            return true;
        }

        // Keep task notifications
        if (message.type === "system" &&
            message.subtype === "task_notification") {
            return true;
        }

        // Normal filtering for other messages
        return shouldKeepMessage(message);
    });
}
```

### Subagent-Specific Compaction

Subagents have their own compaction context:

```
Parent Session Compact                  Subagent Compact
       │                                      │
       ▼                                      ▼
Compact parent messages                 Compact subagent messages
       │                                      │
       │  Does NOT include subagent          │  Independent token budget
       │  internal messages                  │  Independent compaction triggers
       │                                      │
       └──────────────────────────────────────┘
                          │
                          ▼
                 Subagent transcripts stored separately:
                 ~/.claude/sessions/agent-{id}/transcript.json
```

**Key insight:** Subagent transcripts are stored in separate session directories, enabling independent compaction without affecting the parent session.

---

## Integration 6: Agent Teams (30_agent_teams)

### Teammate Mode Integration

Teammate subagents use the same spawning infrastructure with additional team context:

```javascript
// ============================================
// Teammate spawning via spawnTeammate
// Location: chunks.135.mjs:1116
// ============================================

// READABLE (for understanding):
async function spawnTeammate(config) {
    // Create task with teammate type
    let taskId = createTaskId("in_process_teammate");  // Prefix "t"

    // Create subagent context with team info
    let context = {
        ...cloneForkContext(parentContext),
        teamName: config.teamName,
        agentName: config.name,
        isTeammate: true,
        hasTeamContext: true,

        // Team-specific tools
        additionalTools: ["SendMessage", "CronCreate", "CronDelete", "CronList"]
    };

    // Register in team task tracking
    registerTeamAgent(taskId, config.teamName, config.name);

    // Start agent loop
    return agentLoopRunner(context);
}
```

### Mailbox Communication

Teammates communicate via file-based mailboxes:

```javascript
// ============================================
// Mailbox communication for teammates
// Location: chunks.132.mjs:3-57
// ============================================

// READABLE (for understanding):

// Read messages from inbox
function readMailbox({ teamName, agentName }) {
    let inboxPath = `~/.claude/teams/${teamName}/inbox/${agentName}/`;
    let messages = [];

    for (let file of fs.readdirSync(inboxPath)) {
        if (file.endsWith(".json")) {
            let content = JSON.parse(fs.readFileSync(path.join(inboxPath, file)));
            messages.push(content);
        }
    }

    return messages.sort((a, b) => a.timestamp - b.timestamp);
}

// Write message to inbox
function writeToMailbox({ teamName, agentName, message }) {
    let inboxPath = `~/.claude/teams/${teamName}/inbox/${agentName}/`;
    let filename = `${Date.now()}-${uuid()}.json`;

    fs.writeFileSync(
        path.join(inboxPath, filename),
        JSON.stringify({ ...message, timestamp: Date.now() })
    );
}

// Mark message as read
function markMessageAsReadByIndex({ teamName, agentName, index }) {
    let inboxPath = `~/.claude/teams/${teamName}/inbox/${agentName}/`;
    let files = fs.readdirSync(inboxPath).filter(f => f.endsWith(".json"));

    if (files[index]) {
        let readPath = path.join(inboxPath, files[index].replace(".json", ".read"));
        fs.writeFileSync(readPath, "");
    }
}
```

**Why file-based mailboxes:**
- **Persistence** - Messages survive crashes/restarts
- **No dependencies** - No external message queue needed
- **Simple API** - Standard file operations
- **Human-readable** - Can inspect/debug via file system

### Plan Approval Flow

Teammates can request plan approval from the team leader:

```
Background Teammate                    Team Leader
       │                                    │
       │  writeToMailbox({                  │
       │    message: {                      │
       │      type: "plan_approval_request",│
       │      plan: "..."                   │
       │    }                               │
       │  })                                │
       │────────────────────────────────────▶│
       │                                    │
       │                                    │ Review plan
       │                                    │ User approves/rejects
       │                                    │
       │  readMailbox()                     │
       │◀────────────────────────────────────│
       │  { type: "plan_approval_response", │
       │    approved: true }                │
       │                                    │
       │  Continue execution                │
```

---

## Integration 7: Task System (13_task_system)

### Relationship Between Systems

| Aspect | Structured Tasks | Subagent Tasks |
|--------|-----------------|----------------|
| Purpose | Project planning & tracking | Task delegation |
| Storage | `.claude/tasks/` JSON files | `appState.tasks` in memory |
| Lifecycle | Manual create/update/delete | Automatic spawn/complete |
| Visibility | TaskList tool | TaskOutput tool |
| Persistence | Survives sessions | Session-only (except output files) |

### Task Claiming by Teammates

Teammates can claim structured tasks:

```javascript
// ============================================
// Task claiming by teammate agents
// Location: chunks.134.mjs:1464
// ============================================

// READABLE (for understanding):
async function claimUnclaimedTask(agentName) {
    let tasks = await loadAllTasks();

    // Find next available unclaimed task
    let unclaimedTask = tasks.find(t =>
        t.status === "pending" && !t.assignedAgent
    );

    if (unclaimedTask) {
        // Claim the task
        await updateTask(unclaimedTask.id, {
            status: "in_progress",
            assignedAgent: agentName,
            claimedAt: Date.now()
        });

        return unclaimedTask;
    }

    return null;
}
```

---

## Integration 8: MCP Tools

### MCP Tool Access for Subagents

Subagents can use MCP tools with inherited server access:

```javascript
// ============================================
// MCP tool filtering for subagents
// ============================================

// READABLE (for understanding):
function filterMcpToolsForSubagent({ mcpTools, isBackground }) {
    // MCP tools always allowed (regardless of background mode)
    return mcpTools.filter(tool => {
        // But check for dangerous patterns
        if (tool.name.includes("interactive") ||
            tool.name.includes("prompt")) {
            // Only allowed in sync mode
            return !isBackground;
        }
        return true;
    });
}
```

**Key insight:** MCP tools are treated specially - they bypass the background agent tool blocklist, allowing subagents to use external tools even in unattended contexts.

---

## Integration 9: Worktree Isolation (v2.1.76)

### Worktree-Based Isolation

Subagents can declare `isolation: worktree` for filesystem isolation:

```javascript
// ============================================
// Worktree isolation for subagents
// Location: chunks.133.mjs (agent spawn)
// ============================================

// READABLE (for understanding):
async function setupWorktreeIsolation(context) {
    if (context.isolation !== "worktree") {
        return context.cwd;  // No isolation
    }

    // Create new worktree
    let worktreePath = `.claude/worktrees/${context.agentId}`;
    await execGit(["worktree", "add", worktreePath, "--detach"]);

    // Return isolated working directory
    return worktreePath;
}

async function cleanupWorktree(context) {
    if (context.isolation === "worktree") {
        await execGit(["worktree", "remove", "--force", context.worktreePath]);
    }
}
```

**Why worktree isolation:**
- **True filesystem isolation** - No file conflicts between parallel agents
- **Git integration** - Each worktree has its own index
- **Automatic cleanup** - Worktrees removed when agent completes

---

## Design Decisions Summary

| Integration | Key Decision | Rationale |
|-------------|--------------|-----------|
| Tools | Layered filtering | Multiple restriction layers compose safely |
| System Reminders | Inhibit for subagents | Prevents infinite reminder loops |
| Background | Shared infrastructure | Same task/output/notification system |
| Hooks | Isolated per-subagent | Prevents cross-contamination |
| Compact | Separate transcripts | Independent token budgets |
| Agent Teams | File-based mailboxes | Persistence, no dependencies |
| Task System | Complementary systems | Different lifecycles and purposes |
| MCP Tools | Bypass blocklist | External tools should work in background |
| Worktree | Git-based isolation | True filesystem isolation for parallel agents |

---

## Cross-System Event Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Complete Event Flow                                  │
└─────────────────────────────────────────────────────────────────────────────┘

User: "Search the codebase and fix the bug"
        │
        ▼
┌─────────────────────┐
│ LLM generates:       │
│ AgentTool.call({     │
│   prompt: "...",     │
│   subagent_type:     │
│     "general-purpose"│
│ })                   │
└────────┬────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ AgentTool validates and dispatches                                          │
│ └── createTaskId("local_agent") → "a3f9c2"                                 │
│ └── cloneForkContext() for isolation                                       │
│ └── filterToolsForSubagent() for tool set                                  │
│ └── buildAgentSystemPrompt() for instructions                              │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ agentLoopRunner (qh) executes subagent loop                                 │
│ └── Yields progress updates via updateTaskProgress()                       │
│ └── Executes tools via toolDispatcher                                       │
│ └── Writes output via appendToOutputFile()                                 │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         │ (each turn)
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ System Reminder Integration                                                 │
│ └── getUnifiedTasksAttachment() generates task_progress                    │
│ └── Injected into parent conversation                                      │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         │ (completion)
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Completion Handling                                                         │
│ └── markTaskCompleted() or markTaskFailed()                                │
│ └── notifyTaskCompletion() injects into queue                              │
│ └── Parent receives task_notification with results                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Summary

The subagent system forms a central hub connecting multiple Claude Code subsystems:

1. **Tools System** - AgentTool entry point and tool filtering
2. **System Reminders** - Context propagation and progress reporting
3. **Background Agents** - Shared task infrastructure
4. **Hooks** - Isolated hook execution per subagent
5. **Compact** - Separate transcript handling
6. **Agent Teams** - Teammate mode and mailbox communication
7. **Task System** - Complementary task claiming
8. **MCP Tools** - External tool access
9. **Worktree Isolation** - Filesystem isolation for parallel agents

This deep integration enables powerful delegation patterns while maintaining safety through tool access control and context isolation.

---

## Source Code Verification

### Verified Symbol Locations (2026-03-26)

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `qh` | agentLoopRunner | chunks.133.mjs:1565 | ✓ Verified |
| `Xk8` | filterToolsForSubagent | chunks.93.mjs:1568 | ✓ Verified |
| `_c` | resolveToolFilter | chunks.93.mjs:1590 | ✓ Verified |
| `Fx8` | cloneForkContext | chunks.133.mjs:1788 | ✓ Verified |
| `vvY` | buildAgentSystemPrompt | chunks.133.mjs:1806 | ✓ Verified |
| `QW6` | AgentTool | chunks.136.mjs:1512 | ✓ Verified |
| `qn4` | spawnTeammate | chunks.135.mjs:1116 | ✓ Verified |
| `wl` | readMailbox | chunks.132.mjs:3 | ✓ Verified |
| `x3` | writeToMailbox | chunks.132.mjs:22 | ✓ Verified |
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✓ Verified |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100 | ✓ Verified |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117 | ✓ Verified |

### Key Integration Symbol Summary

| Integration | Key Symbols |
|-------------|-------------|
| Tools System | `QW6`, `Xk8`, `_c`, `CW6`, `eP1`, `WY4` |
| System Reminders | `Fx8`, `vvY`, `vIY`, `di4` |
| Background Agents | `U4q`, `d4q`, `$m8`, `Hm8`, `i9` |
| Hooks | `r24`, `zZ6`, `Ux8` |
| Agent Teams | `qn4`, `wl`, `x3`, `Vc6`, `Ji4` |
| Task System | `oV`, `RG`, `Zf`, `i9` |