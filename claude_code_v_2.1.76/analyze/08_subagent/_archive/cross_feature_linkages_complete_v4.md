# Cross Feature Linkages Complete V4 (Claude Code 2.1.76)

> Complete documentation of subagent integration with all other Claude Code features including tools, system reminders, compact, hooks, MCP, and agent teams.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

---

## Integration Matrix

| Module | Integration Point | Key Symbols | Description |
|--------|-------------------|-------------|-------------|
| 04_system_reminder | Attachment producers | `suY`, `wY4`, `nl4` | Task status/progress injection |
| 05_tools | Tool filtering | `Xk8`, `_c`, `Bc6` | Subagent tool access control |
| 06_mcp | MCP client loading | `fvY`, `K0` | Per-agent MCP configuration |
| 07_compact | Transcript handling | `dg`, `Fx8` | Sidechain transcripts, fork context |
| 09_slash_command | /loop integration | `CronCreate`, `Skill` | Recurring subagent tasks |
| 11_hooks | Hook registration | `r24`, `zZ6` | Agent-specific hooks |
| 17_telemetry | Event tracking | `c36`, `R01` | Agent lineage, progress metrics |
| 26_background_agents | Task lifecycle | `Qn4`, `Un4`, `x66` | Async execution, kill handling |
| 30_agent_teams | Teammate spawning | `pNY`, `qn4`, `wl`, `x3` | Mailbox communication |

---

## Integration with 04_system_reminder

### Attachment Producer Integration

```javascript
// ============================================
// System Reminder Integration Flow
// ============================================

// In assembleAllAttachments (_uY):
// Group 2 includes task attachments
async function assembleAllAttachments(toolUseContext, messages, ...) {
    // ... other attachment producers ...

    // Task attachments (Group 2)
    let taskAttachments = await getUnifiedTasksAttachment(toolUseContext);  // suY

    // ... merge and return ...
}

// suY calls:
// - wY4 (pollTaskOutputs) - Read output deltas
// - OY4 (updateTaskState) - Update offsets and evict
```

### Attachment Types Generated

| Type | When Generated | Content |
|------|----------------|---------|
| `task_status` | Task terminal state | taskId, status, description, deltaSummary |
| `task_progress` | Running tasks (throttled) | taskId, message (progress summary) |

### Throttle Mechanism

```javascript
// Progress is throttled to every 3+ assistant turns
// Status is always sent (not throttled)

const PROGRESS_THROTTLE_TURNS = 3;

// New tasks always get progress (turnsSinceProgress = Infinity)
```

---

## Integration with 05_tools

### Tool Filtering (Xk8, _c)

**What it does:** Filters available tools for subagents based on agent type and execution mode.

```javascript
// ============================================
// Xk8 - filterToolsForSubagent - Filter tools based on agent type
// Location: chunks.93.mjs:1568
// ============================================

// READABLE (for understanding):
function filterToolsForSubagent(agentDefinition, allTools, isAsync) {
    let result = applyToolFilters(agentDefinition, allTools, isAsync);  // _c

    return {
        resolvedTools: result.resolvedTools,
        // May include blocked tools info for warnings
    };
}

// ============================================
// _c - applyToolFilters - Apply whitelist/blacklist filtering
// Location: chunks.93.mjs:1590
// ============================================

// READABLE (for understanding):
function applyToolFilters(agentDefinition, allTools, isAsync) {
    let filteredTools = [...allTools];

    // Step 1: Apply agent's tool whitelist (if specified)
    if (agentDefinition.tools) {
        let whitelist = new Set(agentDefinition.tools);
        filteredTools = filteredTools.filter(tool => whitelist.has(tool.name));
    }

    // Step 2: Remove blocked tools for async agents
    if (isAsync) {
        let blockedTools = BACKGROUND_AGENT_EXCLUDED_TOOLS;  // CW6
        filteredTools = filteredTools.filter(tool => !blockedTools.has(tool.name));
    }

    // Step 3: Verify allowed tools for async context
    if (isAsync) {
        let allowedTools = ASYNC_AGENT_ALLOWED_TOOLS;  // eP1
        // Tools must be in allowed list
    }

    return { resolvedTools: filteredTools };
}
```

### Blocked Tools (CW6)

```javascript
// ============================================
// CW6 - BACKGROUND_AGENT_EXCLUDED_TOOLS
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
```

### Allowed Tools (eP1)

```javascript
// ============================================
// eP1 - ASYNC_AGENT_ALLOWED_TOOLS
// Location: chunks.91.mjs:269
// ============================================

const ASYNC_AGENT_ALLOWED_TOOLS = new Set([
    "Read", "WebSearch", "TodoWrite", "Grep", "WebFetch", "Glob",
    "Bash", "Edit", "Write", "NotebookEdit", "Skill",
    "StructuredOutput", "ToolSearch", "EnterWorktree", "ExitWorktree"
]);
```

### Derive Tool Use Context (Bc6)

**What it does:** Creates isolated context for subagent tool execution.

```javascript
// Key aspects for tool integration:
function deriveToolUseContext(parentContext, overrides) {
    return {
        // Tool decisions tracked separately
        toolDecisions: undefined,  // Fresh for each subagent

        // Permission context
        getAppState: overrides?.getAppState ?? (() => {
            let state = parentContext.getAppState();
            return {
                ...state,
                toolPermissionContext: {
                    ...state.toolPermissionContext,
                    shouldAvoidPermissionPrompts: true  // Key for subagents
                }
            };
        }),

        // Options include tool list
        options: overrides?.options ?? parentContext.options,
    };
}
```

---

## Integration with 06_mcp

### MCP Client Loading for Subagents

```javascript
// ============================================
// fvY - loadAgentMcpClients - Load MCP for agent
// Location: chunks.133.mjs (inferred)
// ============================================

// In agentLoopRunner (qh):
let { clients: mcpClients, tools: mcpTools, cleanup: mcpCleanup } =
    await loadAgentMcpClients(agentDefinition, toolUseContext.options.mcpClients);

// Merge with existing tools
let allTools = mcpTools.length > 0
    ? dedupeByName([...resolvedTools, ...mcpTools], "name")  // K0
    : resolvedTools;

// Cleanup on exit
try {
    // ... agent execution ...
} finally {
    await mcpCleanup();  // Important: cleanup MCP connections
}
```

### MCP Tool Merging

```javascript
// ============================================
// K0 - dedupeByName - Remove duplicate tools by name
// ============================================

function dedupeByName(tools, nameKey = "name") {
    let seen = new Set();
    return tools.filter(tool => {
        let name = tool[nameKey];
        if (seen.has(name)) return false;
        seen.add(name);
        return true;
    });
}
```

---

## Integration with 07_compact

### Sidechain Transcript Recording

```javascript
// ============================================
// dg - recordSidechainTranscript - Record to transcript file
// Location: chunks.133.mjs (called in qh)
// ============================================

// In agentLoopRunner:
await dg(messages, agentId).catch((err) =>
    k(`Failed to record sidechain transcript: ${err}`)
);

// On each recordable message:
if (isMessageRecordable(event)) {
    await dg([event], agentId, lastUuid).catch((err) =>
        k(`Failed to record sidechain transcript: ${err}`)
    );
    lastUuid = event.uuid;
    yield event;
}
```

### Fork Context Cloning

```javascript
// ============================================
// Fx8 - cloneForkContext - Filter orphaned tool uses
// Location: chunks.133.mjs:1788
// ============================================

// When subagent receives parent context:
let messages = [
    ...forkContextMessages ? cloneForkContext(forkContextMessages) : [],
    ...promptMessages
];

// Read file state is also cloned:
let readFileState = forkContextMessages !== undefined
    ? cloneReadFileState(toolUseContext.readFileState)  // DI
    : createEmptyReadFileState();  // yd(Ed)
```

---

## Integration with 09_slash_command

### /loop Command Integration

```javascript
// The /loop command uses CronCreate skill to spawn recurring subagents

// CronCreate triggers:
CronCreate({
    cron: "*/5 * * * *",  // Every 5 minutes
    prompt: "Check deployment status",
    recurring: true
});

// Internally uses:
// - Skill tool to invoke the cron skill
// - Agent tool to spawn the recurring task
```

### Skill Loading in Subagents

```javascript
// In agentLoopRunner (qh):

// Step 1: Register hooks if specified
if (agentDefinition.hooks) {
    registerAgentHooks(setAppState, agentId, agentDefinition.hooks, `agent '${agentDefinition.agentType}'`, true);  // r24
}

// Step 2: Load skills
let skills = agentDefinition.skills ?? [];

if (skills.length > 0) {
    let skillRegistry = await loadSkillRegistry(getSkillDirectory());

    for (let skillName of skills) {
        let resolvedName = resolveSkillByName(skillName, skillRegistry, agentDefinition);  // NvY
        // ... load and inject skill prompt ...
    }
}
```

---

## Integration with 11_hooks

### Hook Registration (r24)

```javascript
// ============================================
// r24 - registerAgentHooks - Register hooks for agent
// Location: chunks.95.mjs:1842
// ============================================

function registerAgentHooks(setAppState, agentId, hooks, label, isActive) {
    // Register each hook type (PreToolUse, PostToolUse, etc.)
    // Hooks are scoped to the agent by agentId
    // isActive flag determines if hooks are enabled
}
```

### Hook Deregistration (zZ6)

```javascript
// ============================================
// zZ6 - deregisterAgentHooks - Deregister hooks for agent
// Location: chunks.95.mjs:1830
// ============================================

function deregisterAgentHooks(setAppState, agentId) {
    // Remove all hooks registered for this agent
    // Called in finally block of agentLoopRunner
}
```

### Hook Flow in Subagent Execution

```
Agent starts (qh)
        │
        ├── r24 (registerAgentHooks)
        │   • Register PreToolUse, PostToolUse hooks
        │   • Scope to agentId
        │
        ├── Main execution loop
        │   └─ Hooks fire on each tool use
        │
        └── Finally:
            └── zZ6 (deregisterAgentHooks)
                • Clean up all registered hooks
```

---

## Integration with 17_telemetry

### Agent Lineage Recording

```javascript
// In agentLoopRunner (qh):

if (isTelemetryEnabled()) {  // qc
    let parentAgentId = toolUseContext.agentId ?? getCurrentAgentId();  // R1
    recordAgentLineage(agentId, agentDefinition.agentType, parentAgentId);  // R01
}
```

### Task Progress Telemetry

```javascript
// ============================================
// nl4 - updateTaskProgressWithTelemetry
// Location: chunks.146.mjs:2059
// ============================================

// After updating progress, send telemetry:
if (progressData && isTelemetryEnabled()) {  // Nn
    sendTelemetry({  // c36
        type: "system",
        subtype: "task_progress",
        task_id: taskId,
        tool_use_id: toolUseId,
        description: summary,
        usage: {
            total_tokens: tokenCount,
            tool_uses: toolUseCount,
            duration_ms: Date.now() - startTime
        }
    });
}
```

### Task Started Telemetry

```javascript
// In registerTask (Zf):

function registerTask(taskRecord, setAppState) {
    // Add to state...

    // Send telemetry
    sendTelemetry({  // c36
        type: "system",
        subtype: "task_started",
        task_id: taskRecord.id,
        tool_use_id: taskRecord.toolUseId,
        description: taskRecord.description,
        task_type: taskRecord.type,
        prompt: "prompt" in taskRecord ? taskRecord.prompt : undefined
    });
}
```

---

## Integration with 26_background_agents

### Task Creation

```javascript
// ============================================
// Qn4 - createBackgroundAgentTask - Create background task
// Location: chunks.146.mjs:2133
// ============================================

function createBackgroundAgentTask({
    agentId,
    description,
    prompt,
    selectedAgent,
    setAppState,
    parentAbortController,
    toolUseId
}) {
    // Step 1: Initialize output directory
    ensureOutputDirectory(agentId);

    // Step 2: Create abort controller
    let abortController = parentAbortController
        ? createChildAbortController(parentAbortController)  // Wm
        : new AbortController();  // sK

    // Step 3: Build task record
    let task = {
        ...createTaskRecord(agentId, "local_agent", description, toolUseId),  // RG
        type: "local_agent",
        status: "running",
        agentId: agentId,
        prompt: prompt,
        selectedAgent: selectedAgent,
        agentType: selectedAgent.agentType ?? "general-purpose",
        abortController: abortController,
        isBackgrounded: true,  // Key difference from foreground
        pendingMessages: []
    };

    // Step 4: Register cleanup handler
    task.unregisterCleanup = registerCleanupHandler(async () => {
        triggerAbortSignal(agentId, setAppState);  // x66
    });

    // Step 5: Register task
    registerTask(task, setAppState);  // Zf

    return task;
}

// ============================================
// Un4 - createForegroundAgentTask - Create foreground task
// Location: chunks.146.mjs:2165
// ============================================

function createForegroundAgentTask({
    agentId,
    description,
    prompt,
    selectedAgent,
    setAppState,
    autoBackgroundMs,
    toolUseId
}) {
    // Similar to background, but:
    // - isBackgrounded: false
    // - autoBackgroundMs can trigger mid-run backgrounding

    let task = {
        ...createTaskRecord(agentId, "local_agent", description, toolUseId),
        type: "local_agent",
        status: "running",
        agentId: agentId,
        isBackgrounded: false,  // Key difference
        // ...
    };

    // Auto-backgrounding timer
    if (autoBackgroundMs !== undefined && autoBackgroundMs > 0) {
        setTimeout(() => {
            // Transition to background if still running
            // ...
        }, autoBackgroundMs);
    }

    registerTask(task, setAppState);
    return task;
}
```

### Kill Handling Integration

```javascript
// Kill flow:
// User Ctrl+C → Ctrl+F
//   → U4q (killAllLocalAgents)
//   → x66 (triggerAbortSignal) for each task
//   → d4q (markTaskKilled) to set notified flag
//   → VR (removeTask) after notification
```

---

## Integration with 30_agent_teams

### Teammate Spawning

```javascript
// ============================================
// pNY - spawnTeammateDispatcher - Route teammate spawn
// Location: chunks.135.mjs:1110
// ============================================

function spawnTeammateDispatcher(options) {
    // Determine backend:
    // 1. In-process (non-interactive sessions)
    // 2. Split-pane (iTerm2/tmux)
    // 3. Tmux-only (fallback)

    if (isInProcessEnabled()) {  // Rb
        return spawnInProcessTeammate(options);  // FNY
    }

    if (isRunningInIterm2()) {  // j51
        return spawnSplitPaneTeammate(options);  // BNY
    }

    return spawnTmuxTeammate(options);  // gNY
}

// ============================================
// qn4 - spawnTeammate - Main spawn function
// Location: chunks.135.mjs:1116
// ============================================

async function spawnTeammate(options) {
    // Create agent definition
    // Set up mailbox communication
    // Start execution via dispatcher
}
```

### Mailbox Communication

```javascript
// ============================================
// Mailbox functions
// ============================================

// wl - readMailbox (chunks.132.mjs:3)
function readMailbox(inboxPath) {
    // Read all messages from mailbox file
}

// x3 - writeToMailbox (chunks.132.mjs:22)
function writeToMailbox(inboxPath, message) {
    // Append message to mailbox file with locking
}

// Vc6 - markMessageAsReadByIndex (chunks.132.mjs:57)
function markMessageAsReadByIndex(inboxPath, index) {
    // Mark specific message as read
}

// kc6 - markMessagesAsRead (chunks.132.mjs:92)
function markMessagesAsRead(inboxPath) {
    // Mark all messages as read
}

// DNY - pollForNextMessage (chunks.134.mjs:1483)
async function pollForNextMessage(agentId, timeout) {
    // Priority poll loop for teammate messages
}

// XNY - inProcessAgentRunner (chunks.134.mjs:1571)
async function* inProcessAgentRunner(options) {
    // Run teammate agent in same process
    // Uses mailbox for communication
}
```

### Idle Notification Protocol

```javascript
// Teammates notify when idle:

// Ec6 - buildIdleNotification (chunks.132.mjs:153)
function buildIdleNotification(reason) {
    return {
        type: "idle_notification",
        reason: reason,  // "available", "interrupted", "failed"
        agentId: getCurrentAgentId()
    };
}

// yc6 - parseIdleNotification (chunks.132.mjs:166)
function parseIdleNotification(message) {
    // Parse and validate idle notification
}
```

---

## Cross-Feature Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SUBAGENT CROSS-FEATURE INTEGRATION                        │
└─────────────────────────────────────────────────────────────────────────────┘

AgentTool.call()
        │
        ├── 05_tools: Tool filtering (Xk8, _c)
        │   • Apply whitelist/blacklist
        │   • Check async restrictions
        │
        ├── 06_mcp: Load MCP clients (fvY)
        │   • Per-agent MCP configuration
        │   • Merge with tool list
        │
        ├── 11_hooks: Register hooks (r24)
        │   • PreToolUse, PostToolUse
        │   • Scope to agentId
        │
        ├── 17_telemetry: Record lineage (R01)
        │   • Track parent-child relationships
        │   • Monitor agent behavior
        │
        ├── 26_background_agents: Create task (Qn4/Un4)
        │   • Register in state
        │   • Set up abort controller
        │
        ▼
agentLoopRunner (qh)
        │
        ├── 07_compact: Fork context (Fx8)
        │   • Filter orphaned tool uses
        │   • Clone file read state
        │
        ├── 09_slash_command: Load skills (NvY)
        │   • Resolve skill names
        │   • Inject skill prompts
        │
        ├── 04_system_reminder: Progress (nl4)
        │   • Update task progress
        │   • Send telemetry
        │
        ▼
On Completion
        │
        ├── $m8/Hm8: Mark completed/failed
        │
        ├── 04_system_reminder: task_status attachment
        │   • Generated by suY
        │   • Injected into context
        │
        ├── 11_hooks: Deregister hooks (zZ6)
        │
        └── 26_background_agents: Remove task (VR)
            • After notification delivered
```

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `Xk8` | filterToolsForSubagent | chunks.93.mjs:1568 | ✓ Verified |
| `_c` | applyToolFilters | chunks.93.mjs:1590 | ✓ Verified |
| `CW6` | BACKGROUND_AGENT_EXCLUDED_TOOLS | chunks.91.mjs:269 | ✓ Verified |
| `eP1` | ASYNC_AGENT_ALLOWED_TOOLS | chunks.91.mjs:269 | ✓ Verified |
| `r24` | registerAgentHooks | chunks.95.mjs:1842 | ✓ Verified |
| `zZ6` | deregisterAgentHooks | chunks.95.mjs:1830 | ✓ Verified |
| `pNY` | spawnTeammateDispatcher | chunks.135.mjs:1110 | ✓ Verified |
| `qn4` | spawnTeammate | chunks.135.mjs:1116 | ✓ Verified |
| `wl` | readMailbox | chunks.132.mjs:3 | ✓ Verified |
| `x3` | writeToMailbox | chunks.132.mjs:22 | ✓ Verified |
| `DNY` | pollForNextMessage | chunks.134.mjs:1483 | ✓ Verified |
| `XNY` | inProcessAgentRunner | chunks.134.mjs:1571 | ✓ Verified |

---

## Related Documents

- [ui_interaction_complete_v4.md](./ui_interaction_complete_v4.md) - UI interaction
- [key_algorithms_deep_dive_v4.md](./key_algorithms_deep_dive_v4.md) - Algorithm analysis
- [system_reminder_integration_v6.md](./system_reminder_integration_v6.md) - System reminder integration
- [../26_background_agents/README.md](../26_background_agents/README.md) - Background agents