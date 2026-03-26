# Cross-Feature Linkages Complete V3 - Subagent System (Claude Code 2.1.76)

> Complete cross-feature integration documentation for the subagent system including all integration points with other modules, source-level code examples, and data flow diagrams.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key integration points in this document:
- `suY` - getUnifiedTasksAttachment — `chunks.147.mjs:1033`
- `nl4` - updateTaskProgressWithTelemetry — `chunks.146.mjs:2059`
- `wY4` - pollTaskOutputs — `chunks.90.mjs:3058`
- `Fx8` - cloneForkContext — `chunks.133.mjs:1788`
- `r24` - registerAgentHooks — `chunks.95.mjs:1842`

---

## Integration Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     SUBAGENT CROSS-FEATURE INTEGRATION                       │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────────────┐
                    │         08_subagent                 │
                    │  (qh, QW6, XNY, DNY)                │
                    └──────────────┬──────────────────────┘
                                   │
    ┌──────────────────────────────┼──────────────────────────────┐
    │                              │                              │
    ▼                              ▼                              ▼
┌─────────────┐           ┌─────────────┐           ┌─────────────┐
│04_system_   │           │05_tools     │           │07_compact   │
│reminder     │           │             │           │             │
│             │           │             │           │             │
│• task_status│           │• Xk8 filter │           │• DI clone   │
│• task_progress│         │• CW6 blocked│           │• Ed state   │
│• suY attach │           │• eP1 allowed│           │• mf6 compact│
└─────────────┘           └─────────────┘           └─────────────┘
    │                              │                              │
    │                              │                              │
    ▼                              ▼                              ▼
┌─────────────┐           ┌─────────────┐           ┌─────────────┐
│17_hooks     │           │26_background│           │30_agent_    │
│             │           │_agents      │           │teams        │
│             │           │             │           │             │
│• r24 register│          │• Qn4 create │           │• qn4 spawn  │
│• zZ6 dereg   │           │• Un4 fore   │           │• DNY poll   │
│• SubagentStart│         │• x66 abort  │           │• wl mailbox │
└─────────────┘           └─────────────┘           └─────────────┘
```

---

## Integration with 04_system_reminder

### Overview

The subagent system integrates with system reminders to provide status notifications, progress updates, and task context to the parent session.

### Key Integration Points

#### 1. Task Status Attachments (suY)

```javascript
// ============================================
// suY - getUnifiedTasksAttachment - Build task attachments
// Location: chunks.147.mjs:1033-1048
// ============================================

// ORIGINAL (for source lookup):
async function suY(A) {
    let q = A.getAppState(),
        {
            attachments: K,
            updatedTaskOffsets: Y,
            evictedTaskIds: z
        } = await wY4(q);
    return OY4(A.setAppState, Y, z), K.map((_) => ({
        type: "task_status",
        taskId: _.taskId,
        taskType: _.taskType,
        status: _.status,
        description: _.description,
        deltaSummary: _.deltaSummary
    }))
}

// READABLE (for understanding):
async function getUnifiedTasksAttachment(toolUseContext) {
    let appState = toolUseContext.getAppState();

    // Poll all task output files
    let { attachments, updatedTaskOffsets, evictedTaskIds } = await pollTaskOutputs(appState);

    // Update task state (offsets and evictions)
    updateTaskState(toolUseContext.setAppState, updatedTaskOffsets, evictedTaskIds);

    // Map to attachment format for LLM context
    return attachments.map((attachment) => ({
        type: "task_status",
        taskId: attachment.taskId,
        taskType: attachment.taskType,
        status: attachment.status,
        description: attachment.description,
        deltaSummary: attachment.deltaSummary
    }));
}

// Mapping: suY→getUnifiedTasksAttachment, A→toolUseContext, wY4→pollTaskOutputs,
//          OY4→updateTaskState
```

#### 2. Task Progress Attachments (nl4)

```javascript
// ============================================
// nl4 - updateTaskProgressWithTelemetry - Update progress with telemetry
// Location: chunks.146.mjs:2059-2098
// ============================================

// ORIGINAL (for source lookup):
function nl4(A, q, K) {
    let Y = null;
    if (i9(A, K, (z) => {
            if (z.status !== "running") return z;
            return Y = {
                tokenCount: z.progress?.tokenCount ?? 0,
                toolUseCount: z.progress?.toolUseCount ?? 0,
                startTime: z.startTime,
                toolUseId: z.toolUseId
            }, {
                ...z,
                progress: {
                    ...z.progress,
                    toolUseCount: z.progress?.toolUseCount ?? 0,
                    tokenCount: z.progress?.tokenCount ?? 0,
                    summary: q
                }
            }
        }), Y && Nn()) {
        let {
            tokenCount: z,
            toolUseCount: _,
            startTime: w,
            toolUseId: O
        } = Y;
        c36({
            type: "system",
            subtype: "task_progress",
            task_id: A,
            tool_use_id: O,
            description: q,
            usage: {
                total_tokens: z,
                tool_uses: _,
                duration_ms: Date.now() - w
            },
            summary: q
        })
    }
}

// READABLE (for understanding):
function updateTaskProgressWithTelemetry(taskId, summary, setAppState) {
    let progressData = null;

    // Atomic update of task progress
    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        // Capture current progress for telemetry
        progressData = {
            tokenCount: task.progress?.tokenCount ?? 0,
            toolUseCount: task.progress?.toolUseCount ?? 0,
            startTime: task.startTime,
            toolUseId: task.toolUseId
        };

        return {
            ...task,
            progress: {
                ...task.progress,
                toolUseCount: task.progress?.toolUseCount ?? 0,
                tokenCount: task.progress?.tokenCount ?? 0,
                summary: summary
            }
        };
    });

    // Send telemetry if enabled
    if (progressData && isTelemetryEnabled()) {
        sendTelemetry({
            type: "system",
            subtype: "task_progress",
            task_id: taskId,
            tool_use_id: progressData.toolUseId,
            description: summary,
            usage: {
                total_tokens: progressData.tokenCount,
                tool_uses: progressData.toolUseCount,
                duration_ms: Date.now() - progressData.startTime
            },
            summary: summary
        });
    }
}

// Mapping: nl4→updateTaskProgressWithTelemetry, A→taskId, q→summary, K→setAppState,
//          i9→atomicUpdateTask, Nn→isTelemetryEnabled, c36→sendTelemetry
```

### Attachment Types Generated

| Attachment Type | Trigger | Content |
|-----------------|---------|---------|
| `task_status` | Task completion/failure/killed | taskId, status, description, deltaSummary |
| `task_progress` | Each subagent turn (throttled) | taskId, message, usage metrics |
| `task_reminder` | Pending tasks exist | List of pending task descriptions |

### Data Flow Diagram

```
Subagent Execution (qh)
        │
        ├── each turn ──────────────────────────────────────────┐
        │                                                        ▼
        │                              updateTaskProgressWithTelemetry (nl4)
        │                              • Update progress.summary
        │                              • Capture tokenCount, toolUseCount
        │                              • Send telemetry event
        │
        └── on completion ───────────────────────────────────────┐
                                                                   ▼
                                    markTaskCompleted ($m8) / markTaskFailed (Hm8)
                                    • Set status: "completed" / "failed"
                                    • Set endTime
                                    • Trigger notification

Parent Session (before each LLM turn)
        │
        ▼
getUnifiedTasksAttachment (suY)
        │
        ├── pollTaskOutputs (wY4) ───────────────────────────────┐
        │     • Read output files                                 │
        │     • Build attachments                                 │
        │     • Track evicted tasks                               │
        │                                                        ▼
        │                              updateTaskState (OY4)
        │                              • Update outputOffsets
        │                              • Remove evicted tasks
        │
        └── Return attachments ───────────────────────────────────┐
                                                                   ▼
                                              System Reminder Injection
                                              • task_status attachments
                                              • task_progress attachments
```

---

## Integration with 05_tools

### Overview

The subagent system integrates with the tools system for tool filtering, permission handling, and tool execution.

### Key Integration Points

#### 1. Tool Filtering for Subagents (Xk8)

```javascript
// ============================================
// Xk8 - filterToolsForSubagent - Filter tools based on agent type
// Location: chunks.93.mjs:1568-1588
// ============================================

// ORIGINAL (for source lookup):
function Xk8(A, q, K) {
    return { resolvedTools: _c(A, q, K) }
}

// READABLE (for understanding):
function filterToolsForSubagent(agentDefinition, availableTools, isAsync) {
    return {
        resolvedTools: applyToolFilters(agentDefinition, availableTools, isAsync)
    };
}

// Mapping: Xk8→filterToolsForSubagent, A→agentDefinition, q→availableTools, K→isAsync
```

#### 2. Background Agent Excluded Tools (CW6)

```javascript
// ============================================
// CW6 - BACKGROUND_AGENT_EXCLUDED_TOOLS
// Location: chunks.91.mjs:269
// ============================================

// These tools are BLOCKED for background/async agents:
const BACKGROUND_AGENT_EXCLUDED_TOOLS = new Set([
    "TaskOutput",      // Could create polling loops
    "ExitPlanMode",    // Requires user approval flow
    "EnterPlanMode",   // Requires user approval flow
    "Agent",           // Could spawn nested background agents
    "AskUserQuestion", // Would block indefinitely
    "TaskStop"         // Background agents shouldn't manage tasks
]);
```

#### 3. Async Agent Allowed Tools (eP1)

```javascript
// ============================================
// eP1 - ASYNC_AGENT_ALLOWED_TOOLS
// Location: chunks.91.mjs:269
// ============================================

// These tools are ALLOWED for async/background agents:
const ASYNC_AGENT_ALLOWED_TOOLS = new Set([
    "Read", "WebSearch", "TodoWrite", "Grep", "WebFetch", "Glob",
    "Bash", "Edit", "Write", "NotebookEdit", "Skill",
    "StructuredOutput", "ToolSearch", "EnterWorktree", "ExitWorktree"
]);
```

### Tool Filtering Algorithm

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TOOL FILTERING ALGORITHM                             │
└─────────────────────────────────────────────────────────────────────────────┘

Input: agentDefinition, availableTools, isAsync
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Step 1: Check Agent Definition Tools                                         │
│   if agentDefinition.tools includes "*" → allow all (with exclusions)      │
│   else → use explicit tool list                                              │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Step 2: Apply Async Restrictions (if isAsync)                                │
│                                                                              │
│   BLOCKED: TaskOutput, ExitPlanMode, EnterPlanMode,                         │
│            Agent, AskUserQuestion, TaskStop                                  │
│                                                                              │
│   ALLOWED: Read, Write, Edit, Bash, Grep, Glob,                             │
│            WebFetch, WebSearch, TodoWrite, NotebookEdit,                    │
│            Skill, StructuredOutput, ToolSearch                               │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Step 3: Apply Agent-Specific Whitelist                                       │
│   if agentDefinition.tools is defined:                                       │
│     intersect with available tools                                           │
│   else:                                                                      │
│     use all available tools (subject to async restrictions)                 │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
Output: { resolvedTools: filteredToolArray }
```

---

## Integration with 07_compact

### Overview

The subagent system integrates with the compact system for context management and memory efficiency.

### Key Integration Points

#### 1. Fork Context Cloning (Fx8)

```javascript
// ============================================
// Fx8 - cloneForkContext - Filter orphaned tool results
// Location: chunks.133.mjs:1788-1804
// ============================================

// ORIGINAL (for source lookup):
function Fx8(A) {
    let q = new Set;
    for (let K of A)
        if (K?.type === "user") {
            let z = K.message.content;
            if (Array.isArray(z)) {
                for (let _ of z)
                    if (_.type === "tool_result" && _.tool_use_id) q.add(_.tool_use_id)
            }
        } return A.filter((K) => {
        if (K?.type === "assistant") {
            let z = K.message.content;
            if (Array.isArray(z)) return !z.some((w) => w.type === "tool_use" && w.id && !q.has(w.id))
        }
        return !0
    })
}

// READABLE (for understanding):
function cloneForkContext(messages) {
    // Step 1: Collect all valid tool_use_ids (those with corresponding tool_results)
    let validToolUseIds = new Set();

    for (let message of messages) {
        if (message?.type === "user") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                for (let block of content) {
                    if (block.type === "tool_result" && block.tool_use_id) {
                        validToolUseIds.add(block.tool_use_id);
                    }
                }
            }
        }
    }

    // Step 2: Filter out orphaned tool_uses (tool_use without corresponding tool_result)
    return messages.filter((message) => {
        if (message?.type === "assistant") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                // Keep message only if ALL tool_uses have corresponding results
                return !content.some((block) =>
                    block.type === "tool_use" &&
                    block.id &&
                    !validToolUseIds.has(block.id)
                );
            }
        }
        return true; // Keep all non-assistant messages
    });
}

// Mapping: Fx8→cloneForkContext, A→messages, q→validToolUseIds
```

### Why Orphan Filtering?

1. **API Compatibility** - Claude API rejects messages with tool_uses lacking tool_results
2. **Context Hygiene** - Prevents confusing half-completed operations in subagent context
3. **Memory Efficiency** - Removes unnecessary content from context window

---

## Integration with 17_hooks

### Overview

The subagent system integrates with hooks for custom behavior injection at agent lifecycle events.

### Key Integration Points

#### 1. Register Agent Hooks (r24)

```javascript
// ============================================
// r24 - registerAgentHooks - Register hooks for agent lifecycle
// Location: chunks.95.mjs:1842-1870
// ============================================

// READABLE (for understanding):
function registerAgentHooks(setAppState, agentId, hooks, source, isSubagent) {
    // Register each hook for this agent
    for (let hook of hooks) {
        registerHook({
            hookId: generateHookId(),
            agentId: agentId,
            event: hook.event,
            handler: hook.handler,
            source: source,
            isSubagent: isSubagent
        });
    }
}

// Mapping: r24→registerAgentHooks
```

#### 2. Deregister Agent Hooks (zZ6)

```javascript
// ============================================
// zZ6 - deregisterAgentHooks - Cleanup hooks on agent exit
// Location: chunks.95.mjs:1830-1840
// ============================================

// READABLE (for understanding):
function deregisterAgentHooks(setAppState, agentId) {
    // Remove all hooks registered for this agent
    let hooks = getHooksForAgent(agentId);
    for (let hook of hooks) {
        unregisterHook(hook.hookId);
    }
}

// Mapping: zZ6→deregisterAgentHooks
```

### Hook Events for Subagents

| Event | Trigger | Description |
|-------|---------|-------------|
| `SubagentStart` | Agent spawn | Additional context injection |
| `PreToolUse` | Before tool call | Tool validation/logging |
| `PostToolUse` | After tool call | Result processing |
| `SubagentEnd` | Agent completion | Cleanup/finalization |

### Hook Additional Context Injection

```javascript
// From agentLoopRunner (qh) - chunks.133.mjs:1636-1646

// Process SubagentStart hooks for additional context
let additionalContexts = [];
for await (let hookEvent of runAgentHooks(agentId, agentDefinition.agentType, abortController.signal)) {
    if (hookEvent.additionalContexts && hookEvent.additionalContexts.length > 0) {
        additionalContexts.push(...hookEvent.additionalContexts);
    }
}

// Inject hook additional contexts as attachment message
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

## Integration with 26_background_agents

### Overview

The subagent system shares significant infrastructure with background agents for task creation, state management, and kill handling.

### Shared Functions

| Function | Symbol | Shared Use |
|----------|--------|------------|
| `generateTaskId` | oV | Task ID generation |
| `createTaskRecord` | RG | Task record creation |
| `createBackgroundAgentTask` | Qn4 | Background task creation |
| `createForegroundAgentTask` | Un4 | Foreground task creation |
| `triggerAbortSignal` | x66 | Abort propagation |
| `killAllLocalAgents` | U4q | Kill all agents |
| `markTaskKilled` | d4q | Mark as killed |
| `markTaskCompleted` | $m8 | Mark as completed |
| `markTaskFailed` | Hm8 | Mark as failed |
| `atomicUpdateTask` | i9 | State updates |
| `pollTaskOutputs` | wY4 | Output polling |

### Task Creation Flow

```javascript
// From AgentTool (QW6) - chunks.136.mjs:1568-1584

if (isTeamMode && name) {
    // Teammate mode
    let result = await spawnTeammate({
        name: name,
        prompt: prompt,
        description: description,
        team_name: teamName,
        use_splitpane: true,
        plan_mode_required: mode === "plan",
        model: modelOverride,
        agent_type: subagentType
    }, toolUseContext);

    return {
        data: {
            status: "teammate_spawned",
            prompt: prompt,
            ...result.data
        }
    };
}

// Background or foreground agent
if (runInBackground || selectedAgent.background) {
    // Create background agent task
    let task = createBackgroundAgentTask({
        agentId: agentId,
        description: description,
        prompt: prompt,
        selectedAgent: selectedAgent,
        setAppState: setAppState,
        parentAbortController: parentAbortController,
        toolUseId: toolUseId
    });
} else {
    // Create foreground agent task
    let task = createForegroundAgentTask({
        agentId: agentId,
        description: description,
        prompt: prompt,
        selectedAgent: selectedAgent,
        setAppState: setAppState,
        autoBackgroundMs: autoBackgroundMs,
        toolUseId: toolUseId
    });
}
```

---

## Integration with 30_agent_teams

### Overview

The subagent system provides the execution engine for agent teams through the in-process teammate runner and mailbox communication.

### Key Integration Points

#### 1. Teammate Spawning (qn4)

```javascript
// ============================================
// qn4 - spawnTeammate - Spawn teammate agent
// Location: chunks.135.mjs:1116-1130
// ============================================

// READABLE (for understanding):
async function spawnTeammate(config, toolUseContext) {
    let {
        name,
        prompt,
        description,
        team_name,
        use_splitpane,
        plan_mode_required,
        model,
        agent_type
    } = config;

    // Route to appropriate backend
    return spawnTeammateDispatcher({
        name: name,
        prompt: prompt,
        description: description,
        team_name: team_name,
        use_splitpane: use_splitpane,
        plan_mode_required: plan_mode_required,
        model: model,
        agent_type: agent_type
    }, toolUseContext);
}

// Mapping: qn4→spawnTeammate
```

#### 2. Teammate Dispatcher (pNY)

```javascript
// ============================================
// pNY - spawnTeammateDispatcher - Route to backend
// Location: chunks.135.mjs:1110-1115
// ============================================

// READABLE (for understanding):
async function spawnTeammateDispatcher(config, toolUseContext) {
    // Check session type
    if (isInProcessSession()) {
        // In-process teammate (non-interactive)
        return spawnInProcessTeammate(config, toolUseContext);
    } else if (hasITerm2() && config.use_splitpane) {
        // Split-pane teammate (iTerm2)
        return spawnSplitPaneTeammate(config, toolUseContext);
    } else if (hasTmux()) {
        // Tmux teammate
        return spawnTmuxTeammate(config, toolUseContext);
    } else {
        throw new Error("No supported backend for teammate");
    }
}

// Mapping: pNY→spawnTeammateDispatcher
```

### Mailbox Communication

Teammates communicate via file-based mailbox:

```
.claude/teams/{teamName}/mailboxes/{agentName}.jsonl

Message Format:
{
    "from": "sender_agent_name",
    "text": "message content",
    "color": "#hexcolor",
    "summary": "brief summary",
    "read": false,
    "timestamp": 1234567890
}
```

---

## Complete Integration Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPLETE INTEGRATION FLOW                            │
└─────────────────────────────────────────────────────────────────────────────┘

User Request
      │
      ▼
AgentTool (QW6)
      │
      ├─── Check mode: sync / background / teammate
      │
      ├─── Background: createBackgroundAgentTask (Qn4)
      │         │
      │         └─── Register task in state (Zf)
      │         └─── Create AbortController (Wm)
      │         └─── Initialize output file
      │
      ├─── Teammate: spawnTeammate (qn4)
      │         │
      │         └─── spawnTeammateDispatcher (pNY)
      │               ├── In-Process → XNY
      │               ├── Split-Pane → BNY
      │               └── Tmux → gNY
      │
      └─── Sync: Direct agentLoopRunner (qh)
                │
                ▼
         agentLoopRunner (qh)
                │
                ├─── Build messages (cloneForkContext - Fx8)
                ├─── Filter tools (Xk8, _c)
                ├─── Build system prompt (vvY)
                ├─── Register hooks (r24)
                ├─── Load skills (NvY)
                ├─── Connect MCP (fvY)
                │
                ▼
         llmMessageLoop (Yh)
                │
                ├─── Each turn:
                │     ├─── updateTaskProgressWithTelemetry (nl4)
                │     └─── Yield to UI
                │
                └─── On completion:
                      ├─── markTaskCompleted ($m8)
                      ├─── Deregister hooks (zZ6)
                      └─── Kill bash tasks (t24)

Parent Session (each LLM turn):
      │
      ▼
getUnifiedTasksAttachment (suY)
      │
      ├─── pollTaskOutputs (wY4)
      │     ├── Read output files
      │     └── Build attachments
      │
      ├─── updateTaskState (OY4)
      │     ├── Update offsets
      │     └── Evict completed tasks
      │
      └─── Return task_status attachments
            │
            ▼
      System Reminder Injection
      (LLM receives task context)
```

---

## Verification Status

All integration points have been verified against source code:

| Integration | Key Symbols | Status |
|-------------|-------------|--------|
| 04_system_reminder | suY, nl4, wY4 | ✓ Verified |
| 05_tools | Xk8, CW6, eP1 | ✓ Verified |
| 07_compact | Fx8, DI, mf6 | ✓ Verified |
| 17_hooks | r24, zZ6 | ✓ Verified |
| 26_background_agents | Qn4, Un4, x66, $m8, Hm8 | ✓ Verified |
| 30_agent_teams | qn4, pNY, DNY, wl, x3 | ✓ Verified |

---

## Related Documents

- [README.md](./README.md) - Module overview
- [teammate_execution_complete.md](./teammate_execution_complete.md) - Teammate execution
- [agent_loop_complete_source.md](./agent_loop_complete_source.md) - Agent loop source
- [../26_background_agents/README.md](../26_background_agents/README.md) - Background agents