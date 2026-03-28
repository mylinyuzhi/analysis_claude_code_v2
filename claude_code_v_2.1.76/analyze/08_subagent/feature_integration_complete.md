# Subagent Feature Integration Complete (Claude Code 2.1.76)

> Comprehensive cross-feature integration analysis with source-level code restoration.
> Documents all integration points with detailed data flows, error handling, and test scenarios.
> Cross-validated against source code on 2026-03-26.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `agentLoopRunner` (qh) - Core async generator for agent execution — `chunks.133.mjs:1565`
- `filterToolsForSubagent` (Xk8) - Filters tools for subagent context — `chunks.93.mjs:1568`
- `cloneForkContext` (Fx8) - Clones context for subagent isolation — `chunks.133.mjs:1788`
- `AgentTool` (QW6) - The Agent/Task tool entry point — `chunks.136.mjs:1512`
- `spawnTeammate` (qn4) - Spawns teammate agent — `chunks.135.mjs:1116`
- `triggerAbortSignal` (x66) - Abort signal propagation — `chunks.146.mjs:2012`

---

## Integration Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Subagent Integration Ecosystem                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                          ┌───────────────────┐                              │
│                          │   08_subagent     │                              │
│                          │   (AgentTool)     │                              │
│                          └─────────┬─────────┘                              │
│                                    │                                        │
│     ┌──────────────────────────────┼──────────────────────────────┐        │
│     │                              │                              │        │
│     ▼                              ▼                              ▼        │
│ ┌─────────────┐            ┌─────────────┐              ┌─────────────┐    │
│ │ 05_tools    │            │04_system_   │              │ 07_compact  │    │
│ │ Tool Filter │            │ reminder    │              │ Transcript  │    │
│ │ (Xk8)       │            │ (suY, nl4)  │              │ (hf6, wP6)  │    │
│ └─────────────┘            └─────────────┘              └─────────────┘    │
│                                                                              │
│     ┌──────────────────────────────┼──────────────────────────────┐        │
│     │                              │                              │        │
│     ▼                              ▼                              ▼        │
│ ┌─────────────┐            ┌─────────────┐              ┌─────────────┐    │
│ │ 17_hooks    │            │ 12_plan_mode│              │30_agent_teams│   │
│ │ (r24, zZ6)  │            │ AskUser     │              │ (qn4, pNY)  │    │
│ └─────────────┘            └─────────────┘              └─────────────┘    │
│                                                                              │
│     ┌──────────────────────────────┼──────────────────────────────┐        │
│     │                              │                              │        │
│     ▼                              ▼                              ▼        │
│ ┌─────────────┐            ┌─────────────┐              ┌─────────────┐    │
│ │ 06_mcp      │            │ 15_state    │              │ 26_background│   │
│ │ External    │            │ (Zf, i9)    │              │ (Qn4, Un4)  │    │
│ └─────────────┘            └─────────────┘              └─────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Integration 1: Tools System (05_tools)

### Purpose
The Tools System provides the AgentTool entry point and tool filtering for subagents.

### Integration Points

#### 1.1 AgentTool Entry Point

```javascript
// ============================================
// QW6 - AgentTool - Primary entry point for subagent spawning
// Location: chunks.136.mjs:1512-1580
// ============================================

// ORIGINAL (for source lookup):
const QW6 = {
    name: "Agent",
    inputSchema: agentInputSchema,
    async call(A, q, K, Y, z, _, w) {
        // ... execution mode routing
    }
};

// READABLE (for understanding):
const AgentTool = {
    name: "Agent",

    inputSchema: z.object({
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
    }),

    async call(input, context, sessionState, tools, hooks, progressCallback) {
        // Route to appropriate execution mode
        if (input.run_in_background) {
            return await createBackgroundAgentTask({
                agentId: generateTaskId("local_agent"),
                description: input.description,
                prompt: input.prompt,
                selectedAgent: getAgentDefinition(input.subagent_type),
                setAppState: context.setAppState,
                toolUseId: context.toolUseId
            });
        }

        if (input.name && input.team_name) {
            return await spawnTeammateDispatcher({
                name: input.name,
                teamName: input.team_name,
                prompt: input.prompt,
                description: input.description
            });
        }

        // Default: foreground execution
        return await createForegroundAgentTask({
            agentId: generateTaskId("local_agent"),
            description: input.description,
            prompt: input.prompt,
            selectedAgent: getAgentDefinition(input.subagent_type),
            setAppState: context.setAppState,
            toolUseId: context.toolUseId
        });
    }
};

// Mapping: QW6→AgentTool, A→input, q→context, K→sessionState, Y→tools, z→hooks,
//          _→progressCallback, w→abortSignal
```

#### 1.2 Tool Filtering for Subagent

```javascript
// ============================================
// Xk8 - filterToolsForSubagent - Filter tools for subagent context
// Location: chunks.93.mjs:1568-1588
// ============================================

// ORIGINAL (for source lookup):
function Xk8({
    tools: A,
    isBuiltIn: q,
    isAsync: K = !1,
    permissionMode: Y
}) {
    return A.filter((z) => {
        if (z.name.startsWith("mcp__")) return !0;
        if (z3(z, aJ) && Y === "plan") return !0;
        if (CW6.has(z.name)) return !1;
        if (!q && xV8.has(z.name)) return !1;
        if (K && !eP1.has(z.name)) {
            if (E7() && eP()) {
                if (z3(z, r4)) return !0;
                if (WY4.has(z.name)) return !0
            }
            return !1
        }
        return !0
    })
}

// READABLE (for understanding):
function filterToolsForSubagent({
    tools,
    isBuiltIn,
    isAsync = false,
    permissionMode
}) {
    return tools.filter((tool) => {
        // RULE 1: Always allow MCP tools (external integrations)
        if (tool.name.startsWith("mcp__")) {
            return true;
        }

        // RULE 2: Allow AskUserQuestion in plan mode
        if (isToolNamed(tool, "AskUserQuestion") && permissionMode === "plan") {
            return true;
        }

        // RULE 3: Block tools that should never be in subagents
        if (BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)) {
            return false;
        }

        // RULE 4: Block certain tools for non-built-in foreground agents
        if (!isBuiltIn && FOREGROUND_EXCLUDED_TOOLS.has(tool.name)) {
            return false;
        }

        // RULE 5: For async agents, only allow whitelisted tools
        if (isAsync && !ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name)) {
            // Exception: In delegate mode with in-process teammate
            if (isAgentTeamsEnabled() && isInProcessTeammate()) {
                if (isToolNamed(tool, "Agent")) return true;
                if (TEAM_DELEGATE_TOOLS.has(tool.name)) return true;
            }
            return false;
        }

        return true;
    });
}

// Mapping: Xk8→filterToolsForSubagent, A→tools, q→isBuiltIn, K→isAsync, Y→permissionMode,
//          CW6→BACKGROUND_AGENT_EXCLUDED_TOOLS, xV8→FOREGROUND_EXCLUDED_TOOLS,
//          eP1→ASYNC_AGENT_ALLOWED_TOOLS, WY4→TEAM_DELEGATE_TOOLS
```

### Tool Access Control Matrix

| Tool | Sync Agent | Background Agent | Teammate Agent | Reason |
|------|------------|------------------|----------------|--------|
| `Read` | ✓ | ✓ | ✓ | Core file operation |
| `Write` | ✓ | ✓ | ✓ | Core file operation |
| `Edit` | ✓ | ✓ | ✓ | Core file operation |
| `Bash` | ✓ | ✓ | ✓ | Core shell operation |
| `Grep`/`Glob` | ✓ | ✓ | ✓ | Non-blocking search |
| `WebFetch`/`WebSearch` | ✓ | ✓ | ✓ | Async-safe network |
| `TodoWrite` | ✓ | ✓ | ✓ | Task tracking |
| `Skill` | ✓ | ✓ | ✓ | Controlled execution |
| `Agent` (Task) | ✓ | ✗ | ✗ | Prevent nesting |
| `TaskOutput` | ✓ | ✗ | ✓ | Poll loops in background |
| `TaskStop` | ✓ | ✗ | ✓ | Task management |
| `AskUserQuestion` | ✓ | ✗ | ✗ | Would block background |
| `EnterPlanMode` | ✓ | ✗ | ✗ | Requires approval |
| `ExitPlanMode` | ✓ | ✗ | ✓ (plan mode) | Approval flow |
| `SendMessage` | ✗ | ✗ | ✓ | Team communication |
| `CronCreate/Delete/List` | ✗ | ✗ | ✓ | Team scheduling |

### Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Tool Filtering Data Flow                             │
└─────────────────────────────────────────────────────────────────────────────┘

AgentTool.call()
        │
        ├── Extract execution mode parameters
        │   • run_in_background → isAsync = true
        │   • team_name + name → isTeammate = true
        │
        └── filterToolsForSubagent()
                │
                ├── Pass 1: MCP tools
                │   └── Keep all tools with "mcp__" prefix
                │
                ├── Pass 2: Permission mode check
                │   └── Allow AskUserQuestion in plan mode
                │
                ├── Pass 3: Background exclusions
                │   └── Remove: TaskOutput, ExitPlanMode, EnterPlanMode,
                │              Agent, AskUserQuestion, TaskStop
                │
                ├── Pass 4: Async whitelist
                │   └── Keep only: Read, Write, Edit, Bash, Grep, Glob,
                │              WebFetch, WebSearch, TodoWrite, Skill
                │
                └── Pass 5: Teammate additions
                    └── Add: SendMessage, CronCreate, CronDelete, CronList
                                │
                                ▼
                        Filtered tool list
```

### Error Handling

| Error Condition | Handling | Result |
|-----------------|----------|--------|
| Tool not in filtered set | Block silently | Tool unavailable to subagent |
| MCP server unavailable | Allow MCP tool in filter | Error at execution time |
| Unknown tool name | Pass through filter | Error at execution time |

---

## Integration 2: System Reminder System (04_system_reminder)

### Purpose
Subagent progress and status are communicated to the parent session through system reminder attachments.

### Integration Points

#### 2.1 Progress Update with Telemetry

```javascript
// ============================================
// nl4 - updateTaskProgressWithTelemetry - Update progress and send telemetry
// Location: chunks.146.mjs:2059-2085
// ============================================

// ORIGINAL (for source lookup):
async function nl4(A, q, K, Y, z) {
    let _ = Y?.usage;
    _ && await iI4(_);
    i9(A, q, (w) => ({
        ...w,
        progress: {
            toolUseCount: K,
            tokenCount: _?.total_tokens ?? w.progress?.tokenCount ?? 0,
            summary: z
        }
    }))
}

// READABLE (for understanding):
async function updateTaskProgressWithTelemetry(
    taskId,
    setAppState,
    toolUseCount,
    usage,
    summary
) {
    // Step 1: Send telemetry if usage data available
    let tokenUsage = usage?.usage;
    if (tokenUsage) {
        await sendTelemetryEvent(tokenUsage);
    }

    // Step 2: Atomically update task progress
    atomicUpdateTask(taskId, setAppState, (task) => ({
        ...task,
        progress: {
            toolUseCount: toolUseCount,
            tokenCount: tokenUsage?.total_tokens ?? task.progress?.tokenCount ?? 0,
            summary: summary
        }
    }));
}

// Mapping: nl4→updateTaskProgressWithTelemetry, A→taskId, q→setAppState,
//          K→toolUseCount, Y→usage, z→summary, _→tokenUsage, iI4→sendTelemetryEvent
```

#### 2.2 Task Status Attachments

```javascript
// ============================================
// suY - getTaskStatusAttachments - Build task status/progress attachments
// Location: chunks.147.mjs:1033-1090
// ============================================

// ORIGINAL (for source lookup):
async function suY(A, q, K) {
    let Y = Object.values(q.tasks),
        z = countTurnsSinceLastProgressInline(K),  // NOTE: Not TIY; TIY is countUniqueUris (LSP)
        _ = [];
    for (let w of Y) {
        if (w.status === "running") {
            let O = z.get(w.id) ?? 1 / 0;
            if (O >= 3 && w.progress?.summary) {
                _.push(buildProgressAttachment(w));
                i9(w.id, A, (H) => ({
                    ...H,
                    progress: {
                        ...H.progress,
                        lastReportedTurn: K.length
                    }
                }))
            }
        } else if (!w.notified && isTerminalStatus(w.status)) {
            let O = await readOutputFileDelta(w.id, w.outputOffset);
            _.push(buildStatusAttachment(w, O));
            i9(w.id, A, (H) => ({ ...H, notified: !0 }))
        }
    }
    return _
}

// READABLE (for understanding):
async function getTaskStatusAttachments(setAppState, appState, messages) {
    let tasks = Object.values(appState.tasks);
    let turnsSinceProgress = countTurnsSinceLastProgressInline(messages);
    let attachments = [];

    for (let task of tasks) {
        if (task.status === "running") {
            // Running task: check throttle
            let turns = turnsSinceProgress.get(task.id) ?? Infinity;

            if (turns >= 3 && task.progress?.summary) {
                // Throttle passed, show progress
                attachments.push(buildProgressAttachment(task));

                // Update last reported turn
                atomicUpdateTask(task.id, setAppState, (t) => ({
                    ...t,
                    progress: {
                        ...t.progress,
                        lastReportedTurn: messages.length
                    }
                }));
            }
        } else if (!task.notified && isTerminalStatus(task.status)) {
            // Terminal task: read delta output and build notification
            let deltaOutput = await readOutputFileDelta(task.id, task.outputOffset);
            attachments.push(buildStatusAttachment(task, deltaOutput));

            // Mark as notified
            atomicUpdateTask(task.id, setAppState, (t) => ({
                ...t,
                notified: true
            }));
        }
    }

    return attachments;
}

// Mapping: suY→getTaskStatusAttachments, A→setAppState, q→appState, K→messages,
//          Y→tasks, z→turnsSinceProgress, _→attachments
```

### Attachment Types

#### task_progress Attachment

```xml
<task_progress>
  <task_id>a3f4b2</task_id>
  <task_type>local_agent</task_type>
  <message>Running Grep for "pattern"...</message>
</task_progress>
```

**Trigger:** Running task with ≥3 turns since last progress

#### task_status Attachment

```xml
<task_status>
  <task_id>a3f4b2</task_id>
  <task_type>local_agent</task_type>
  <status>completed</status>
  <description>Search codebase</description>
  <delta_summary>Found 15 occurrences in 8 files...</delta_summary>
</task_status>
```

**Trigger:** Terminal task not yet notified

### Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    System Reminder Integration Flow                          │
└─────────────────────────────────────────────────────────────────────────────┘

Subagent Execution
        │
        ├── Each turn ────────────────┐
        │                              ▼
        │                    updateTaskProgressWithTelemetry (nl4)
        │                    • Update progress.summary
        │                    • Send telemetry
        │
        └── Completion ───────────────┐
                                       ▼
                          markTaskCompleted / Failed / Killed
                          • Update status
                          • Set notified: false

Parent Session (before LLM turn)
        │
        ▼
getTaskStatusAttachments (suY)
        │
        ├── Running ──────────────────┐
        │   Check throttle (3 turns)  │
        │   (throttle passed)          ▼
        │                    task_progress attachment
        │                    • taskId, message
        │
        └── Terminal ─────────────────┐
            (not yet notified)         ▼
                          task_status attachment
                          • status, deltaSummary
                          • Mark notified: true
```

### Progress Throttle Logic

```javascript
// ============================================
// Progress turn-counting algorithm (inline in vIY, NOT TIY)
// TIY is countUniqueUris (LSP URI counting), not progress throttling
// Location: chunks.142.mjs:2703-2717
// ============================================

// READABLE (for understanding):
function countTurnsSinceLastProgressInline(messages) {
    let turnsSinceProgress = new Map();  // taskId -> turn count
    let seenTasks = new Set();
    let turnCount = 0;

    // Iterate BACKWARDS from most recent message
    for (let i = messages.length - 1; i >= 0; i--) {
        let message = messages[i];

        // Count assistant turns (skip whitespace-only)
        if (message?.type === "assistant" && !isWhitespaceOnly(message)) {
            turnCount++;
        }
        // Found last progress reminder for a task
        else if (message?.type === "attachment" &&
                 message.attachment.type === "task_progress") {
            let taskId = message.attachment.taskId;
            if (!seenTasks.has(taskId)) {
                turnsSinceProgress.set(taskId, turnCount);
                seenTasks.add(taskId);
            }
        }
    }
    return turnsSinceProgress;
}
```

**Why 3 turns:**
- **Balance** - Enough context between updates
- **Noise reduction** - Prevents flooding LLM context
- **Responsiveness** - Still frequent enough for awareness

---

## Integration 3: Background Agents (26_background_agents)

### Purpose
Background execution mode enables non-blocking subagent operations.

### Integration Points

#### 3.1 Background Task Creation

```javascript
// ============================================
// Qn4 - createBackgroundAgentTask
// Location: chunks.146.mjs:2133-2163
// ============================================

// ORIGINAL (for source lookup):
function Qn4({
    agentId: A,
    description: q,
    prompt: K,
    selectedAgent: Y,
    setAppState: z,
    parentAbortController: _,
    toolUseId: w
}) {
    Co(A, L0(X$(A)));
    let O = _ ? Wm(_) : sK(),
        $ = {
            ...RG(A, "local_agent", q, w),
            type: "local_agent",
            status: "running",
            agentId: A,
            prompt: K,
            selectedAgent: Y,
            agentType: Y.agentType ?? "general-purpose",
            abortController: O,
            retrieved: !1,
            lastReportedToolCount: 0,
            lastReportedTokenCount: 0,
            isBackgrounded: !0,
            pendingMessages: []
        },
        H = E4(async () => {
            x66(A, z)
        });
    return $.unregisterCleanup = H, Zf($, z), $
}

// READABLE (for understanding):
function createBackgroundAgentTask({
    agentId,
    description,
    prompt,
    selectedAgent,
    setAppState,
    parentAbortController,
    toolUseId
}) {
    // Step 1: Initialize output file
    initOutputFile(agentId, getOutputFilePath(agentId));

    // Step 2: Create abort controller (linked to parent if provided)
    let abortController = parentAbortController
        ? createChildAbortController(parentAbortController)
        : new AbortController();

    // Step 3: Build task record
    let taskRecord = {
        ...createTaskEntry(agentId, "local_agent", description, toolUseId),
        type: "local_agent",
        status: "running",
        agentId: agentId,
        prompt: prompt,
        selectedAgent: selectedAgent,
        agentType: selectedAgent.agentType ?? "general-purpose",
        abortController: abortController,
        retrieved: false,
        lastReportedToolCount: 0,
        lastReportedTokenCount: 0,
        isBackgrounded: true,  // KEY: Explicit background
        pendingMessages: []
    };

    // Step 4: Register cleanup handler
    taskRecord.unregisterCleanup = registerCleanupHandler(async () => {
        triggerAbortSignal(agentId, setAppState);
    });

    // Step 5: Register in app state
    registerTask(taskRecord, setAppState);

    return taskRecord;
}

// Mapping: Qn4→createBackgroundAgentTask, A→agentId, q→description, K→prompt,
//          Y→selectedAgent, z→setAppState, _→parentAbortController, w→toolUseId,
//          Co→initOutputFile, L0→getOutputFilePath, X$→resolveOutputPath,
//          Wm→createChildAbortController, sK→newAbortController, RG→createTaskEntry,
//          Zf→registerTask, E4→registerCleanupHandler, x66→triggerAbortSignal
```

#### 3.2 Foreground Task with Auto-Background

```javascript
// ============================================
// Un4 - createForegroundAgentTask (may auto-background)
// Location: chunks.146.mjs:2165-2250
// ============================================

// READABLE (for understanding):
function createForegroundAgentTask({
    agentId,
    description,
    prompt,
    selectedAgent,
    setAppState,
    autoBackgroundMs,
    toolUseId
}) {
    // Step 1: Initialize output file
    initOutputFile(agentId, getOutputFilePath(agentId));

    // Step 2: Create abort controller
    let abortController = new AbortController();

    // Step 3: Build task record
    let taskRecord = {
        ...createTaskEntry(agentId, "local_agent", description, toolUseId),
        type: "local_agent",
        status: "running",
        agentId: agentId,
        prompt: prompt,
        selectedAgent: selectedAgent,
        abortController: abortController,
        unregisterCleanup: registerCleanupHandler(() => triggerAbortSignal(agentId, setAppState)),
        retrieved: false,
        isBackgrounded: false,  // KEY: Foreground initially
        pendingMessages: []
    };

    // Step 4: Set up auto-background timer if specified
    let backgroundResolve;
    let backgroundPromise = new Promise((resolve) => {
        backgroundResolve = resolve;
    });

    if (autoBackgroundMs) {
        setTimeout(() => {
            atomicUpdateTask(agentId, setAppState, (task) => ({
                ...task,
                isBackgrounded: true
            }));
            backgroundResolve({ type: "background" });
        }, autoBackgroundMs);
    }

    // Step 5: Register in app state
    registerTask(taskRecord, setAppState);

    return { taskRecord, backgroundPromise, backgroundResolve };
}

// Mapping: Un4→createForegroundAgentTask
```

### Execution Mode Comparison

| Aspect | Foreground | Background |
|--------|------------|------------|
| Return | Blocks until done | Returns immediately |
| Output | In conversation | Output file |
| Progress | Real-time | System reminders |
| Tools | Full access | Filtered (eP1) |
| Kill | Ctrl+C cancels | Ctrl+C → Ctrl+F kills |
| isBackgrounded | false | true |

### Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Background Execution Mode Flow                            │
└─────────────────────────────────────────────────────────────────────────────┘

AgentTool.call({ run_in_background: true })
        │
        ▼
createBackgroundAgentTask (Qn4)
        │
        ├── Generate task ID: generateTaskId("local_agent") → "a3f4b2c1"
        │
        ├── Create abort controller
        │
        ├── Initialize output file: ~/.claude/tasks/a3f4b2c1.output
        │
        ├── Build task record
        │   • status: "running"
        │   • isBackgrounded: true
        │   • abortController
        │
        └── Register task: Zf(task, setAppState)
                │
                ▼
        Return immediately:
        { status: "async_launched", agentId: "a3f4b2c1", outputFile: "..." }
                │
                │ (background execution continues)
                ▼
        agentLoopRunner (qh) executes
                │
                ├── Each turn: updateTaskProgressWithTelemetry()
                │
                ├── Each output: appendToOutputFile()
                │
                └── Completion: markTaskCompleted/Failed/Killed()
                                │
                                ▼
                        notifyTaskCompletion()
                        • Sets notified: false
                        • Triggers task_status attachment
```

---

## Integration 4: Agent Teams (30_agent_teams)

### Purpose
Teammate spawning and team collaboration through mailbox communication.

### Integration Points

#### 4.1 Teammate Spawning

```javascript
// ============================================
// qn4 - spawnTeammate - Spawn teammate agent
// Location: chunks.135.mjs:1116-1150
// ============================================

// ORIGINAL (for source lookup):
async function qn4(A, q, K, Y) {
    let z = await initializeTeamAgent(A, q, K),
        _ = createTaskId("in_process_teammate"),
        w = {
            ...RG(_, "in_process_teammate", K.description, Y),
            type: "in_process_teammate",
            status: "running",
            agentId: _,
            teamName: A.teamName,
            agentName: A.name,
            isTeammate: !0,
            hasTeamContext: !0,
            pendingUserMessages: [],
            abortController: sK()
        };
    return Zf(w, q), w
}

// READABLE (for understanding):
async function spawnTeammate(config, setAppState, agentContext, toolUseId) {
    // Step 1: Initialize team agent context
    let teamContext = await initializeTeamAgent(config, setAppState, agentContext);

    // Step 2: Generate teammate task ID (prefix "t")
    let taskId = createTaskId("in_process_teammate");

    // Step 3: Build task record
    let taskRecord = {
        ...createTaskEntry(taskId, "in_process_teammate", config.description, toolUseId),
        type: "in_process_teammate",
        status: "running",
        agentId: taskId,
        teamName: config.teamName,
        agentName: config.name,
        isTeammate: true,
        hasTeamContext: true,
        pendingUserMessages: [],
        abortController: new AbortController()
    };

    // Step 4: Register in state
    registerTask(taskRecord, setAppState);

    return taskRecord;
}

// Mapping: qn4→spawnTeammate, A→config, q→setAppState, K→agentContext, Y→toolUseId,
//          _→taskId, w→taskRecord, sK→newAbortController
```

#### 4.2 Mailbox Communication

```javascript
// ============================================
// wl - readMailbox - Read messages from inbox
// Location: chunks.132.mjs:3-22
// ============================================

// ORIGINAL (for source lookup):
function wl(A, q) {
    let K = path.join(yJ6(), "teams", A, "inbox", q),
        Y = [];
    if (!fs.existsSync(K)) return Y;
    for (let z of fs.readdirSync(K)) {
        if (z.endsWith(".json") && !z.endsWith(".read.json")) {
            let _ = JSON.parse(fs.readFileSync(path.join(K, z), "utf8"));
            Y.push(_)
        }
    }
    return Y.sort((z, _) => z.timestamp - _.timestamp)
}

// READABLE (for understanding):
function readMailbox(teamName, agentName) {
    let inboxPath = path.join(
        getClaudeDir(),
        "teams",
        teamName,
        "inbox",
        agentName
    );

    let messages = [];

    if (!fs.existsSync(inboxPath)) {
        return messages;
    }

    for (let file of fs.readdirSync(inboxPath)) {
        // Only read unread messages (.json, not .read.json)
        if (file.endsWith(".json") && !file.endsWith(".read.json")) {
            let content = JSON.parse(
                fs.readFileSync(path.join(inboxPath, file), "utf8")
            );
            messages.push(content);
        }
    }

    // Sort by timestamp (oldest first)
    return messages.sort((a, b) => a.timestamp - b.timestamp);
}

// Mapping: wl→readMailbox, A→teamName, q→agentName, K→inboxPath, Y→messages

// ============================================
// x3 - writeToMailbox - Write message to inbox
// Location: chunks.132.mjs:22-40
// ============================================

// ORIGINAL (for source lookup):
function x3(A, q, K) {
    let Y = path.join(yJ6(), "teams", A, "inbox", q);
    fs.mkdirSync(Y, { recursive: !0 });
    let z = `${Date.now()}-${N$3(4).join("")}.json`;
    fs.writeFileSync(
        path.join(Y, z),
        JSON.stringify({ ...K, timestamp: Date.now() })
    )
}

// READABLE (for understanding):
function writeToMailbox(teamName, agentName, message) {
    let inboxPath = path.join(
        getClaudeDir(),
        "teams",
        teamName,
        "inbox",
        agentName
    );

    // Ensure directory exists
    fs.mkdirSync(inboxPath, { recursive: true });

    // Generate unique filename
    let filename = `${Date.now()}-${randomString(4)}.json`;

    // Write message with timestamp
    fs.writeFileSync(
        path.join(inboxPath, filename),
        JSON.stringify({
            ...message,
            timestamp: Date.now()
        })
    );
}

// Mapping: x3→writeToMailbox, A→teamName, q→agentName, K→message, Y→inboxPath,
//          z→filename, N$3→randomBytes
```

### Mailbox File Structure

```
~/.claude/
└── teams/
    └── my-team/
        ├── inbox/
        │   ├── worker-1/
        │   │   ├── 1711459200000-a1b2.json     ← Unread message
        │   │   ├── 1711459200000-a1b2.read     ← Read marker
        │   │   └── 1711459260000-c3d4.json
        │   └── worker-2/
        │       └── ...
        └── config.json
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Teammate Mailbox Communication                            │
└─────────────────────────────────────────────────────────────────────────────┘

Team Leader                           Teammate Agent
       │                                    │
       │  writeToMailbox({                  │
       │    teamName: "my-team",            │
       │    agentName: "worker-1",          │
       │    message: {                      │
       │      type: "task_assignment",      │
       │      task: "..."                   │
       │    }                               │
       │  })                                │
       │────────────────────────────────────▶│
       │                                    │
       │                                    │ pollForNextMessage() loop
       │                                    │ • Check pendingUserMessages
       │                                    │ • Check mailbox files
       │                                    │
       │                                    │ Process message
       │                                    │
       │  readMailbox()                     │
       │◀────────────────────────────────────│
       │  { type: "status_update",          │
       │    status: "completed",            │
       │    result: "..." }                 │
       │                                    │
       │  Continue execution                │
```

---

## Integration 5: Hooks System (17_hooks)

### Purpose
Hook execution in subagent context with isolation and safety.

### Integration Points

#### 5.1 Hook Registration for Subagent

```javascript
// ============================================
// r24 - registerAgentHooks - Register hooks for subagent context
// Location: chunks.95.mjs:1842-1890
// ============================================

// READABLE (for understanding):
function registerAgentHooks(context) {
    let agentId = context.agentId;

    // Create isolated hook context
    let hookContext = {
        agentId,
        isSubagent: true,
        isBackground: context.isBackgrounded,
        parentAgentId: context.parentAgentId
    };

    // PreToolUse: Validate tool access for background agents
    onPreToolUse(async (toolName, input) => {
        if (context.isBackgrounded &&
            BACKGROUND_AGENT_EXCLUDED_TOOLS.has(toolName)) {
            return {
                blocked: true,
                reason: `Tool ${toolName} not available in background mode`
            };
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

// Mapping: r24→registerAgentHooks
```

#### 5.2 Hook Deregistration

```javascript
// ============================================
// zZ6 - deregisterAgentHooks - Clean up subagent hooks
// Location: chunks.95.mjs:1830-1842
// ============================================

// READABLE (for understanding):
function deregisterAgentHooks(context) {
    // Remove all registered handlers for this subagent
    clearHookHandlers(context.agentId);

    // Clear hook context
    context.hookContext = null;
}

// Mapping: zZ6→deregisterAgentHooks
```

### Hook Isolation Diagram

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

## Integration 6: Compact System (07_compact)

### Purpose
Transcript handling and message filtering for subagent resume and parent compaction.

### Integration Points

#### 6.1 Transcript Loading for Resume

```javascript
// ============================================
// hf6 - loadTranscript - Load transcript for subagent resume
// Location: chunks.174.mjs:2705-2750
// ============================================

// READABLE (for understanding):
async function loadTranscript(sessionId) {
    let transcriptPath = path.join(
        getSessionDir(sessionId),
        "transcript.json"
    );

    if (!fs.existsSync(transcriptPath)) {
        return [];
    }

    let rawMessages = JSON.parse(
        fs.readFileSync(transcriptPath, "utf8")
    );

    return rawMessages;
}

// Mapping: hf6→loadTranscript
```

#### 6.2 Message Filtering for Fork

```javascript
// ============================================
// wP6 - stripOrphanedToolResults - Remove orphaned tool results
// Location: chunks.173.mjs:344-380
// ============================================

// READABLE (for understanding):
function stripOrphanedToolResults(messages) {
    let toolUseIds = new Set();

    // First pass: collect all tool_use IDs
    for (let message of messages) {
        if (message.role === "assistant") {
            for (let block of message.content ?? []) {
                if (block.type === "tool_use") {
                    toolUseIds.add(block.id);
                }
            }
        }
    }

    // Second pass: filter orphaned results
    return messages.map((message) => {
        if (message.role === "user") {
            let filteredContent = (message.content ?? []).filter((block) => {
                if (block.type === "tool_result") {
                    return toolUseIds.has(block.tool_use_id);
                }
                return true;
            });

            return { ...message, content: filteredContent };
        }
        return message;
    });
}

// Mapping: wP6→stripOrphanedToolResults
```

### Filtering Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Message Filtering for Subagent Fork                       │
└─────────────────────────────────────────────────────────────────────────────┘

Original Transcript
        │
        ▼
stripOrphanedToolResults (wP6)
• Remove tool_results without corresponding tool_use
        │
        ▼
filterWhitespaceAssistant (BQ1)
• Remove empty assistant messages
        │
        ▼
filterThinkingOnlyAssistant (mQ1)
• Remove thinking-only messages
        │
        ▼
Filtered Transcript
(Used as initial messages for resumed agent)
```

---

## Integration 7: State Management (15_state_management)

### Purpose
Task registration, state updates, and cleanup.

### Integration Points

#### 7.1 Task Registration

```javascript
// ============================================
// Zf - registerTask - Register task in app state
// Location: chunks.90.mjs:3019-3025
// ============================================

// ORIGINAL (for source lookup):
function Zf(A, q) {
    q((K) => ({
        ...K,
        tasks: {
            ...K.tasks,
            [A.id]: A
        }
    }))
}

// READABLE (for understanding):
function registerTask(taskRecord, setAppState) {
    setAppState((state) => ({
        ...state,
        tasks: {
            ...state.tasks,
            [taskRecord.id]: taskRecord
        }
    }));
}

// Mapping: Zf→registerTask, A→taskRecord, q→setAppState
```

#### 7.2 Atomic Task Update

```javascript
// ============================================
// i9 - atomicUpdateTask - Generic task state updater
// Location: chunks.90.mjs:3003-3018
// ============================================

// ORIGINAL (for source lookup):
function i9(A, q, K) {
    q((Y) => {
        let z = Y.tasks[A];
        if (!z) return Y;
        let _ = K(z);
        return _ === z ? Y : {
            ...Y,
            tasks: {
                ...Y.tasks,
                [A]: _
            }
        }
    })
}

// READABLE (for understanding):
function atomicUpdateTask(taskId, setAppState, updater) {
    setAppState((state) => {
        let task = state.tasks[taskId];
        if (!task) return state;

        let updatedTask = updater(task);

        // If updater returned same object, no change needed
        if (updatedTask === task) return state;

        return {
            ...state,
            tasks: {
                ...state.tasks,
                [taskId]: updatedTask
            }
        };
    });
}

// Mapping: i9→atomicUpdateTask, A→taskId, q→setAppState, K→updater
```

#### 7.3 Task Removal

```javascript
// ============================================
// VR - removeTask - Remove task from app state
// Location: chunks.90.mjs:3037-3045
// ============================================

// READABLE (for understanding):
function removeTask(taskId, setAppState) {
    setAppState((state) => {
        let { [taskId]: removed, ...remainingTasks } = state.tasks;
        return {
            ...state,
            tasks: remainingTasks
        };
    });
}

// Mapping: VR→removeTask
```

---

## Integration 8: Abort Signal Propagation

### Purpose
Graceful termination of running subagents.

### Integration Points

#### 8.1 Trigger Abort Signal

```javascript
// ============================================
// x66 - triggerAbortSignal - Trigger abort for a task
// Location: chunks.146.mjs:2012-2027
// ============================================

// ORIGINAL (for source lookup):
function x66(A, q) {
    let K = !1;
    if (i9(A, q, (Y) => {
            if (Y.status !== "running") return Y;
            return K = !0, Y.abortController?.abort(), Y.unregisterCleanup?.(), {
                ...Y,
                status: "killed",
                endTime: Date.now(),
                messages: Y.messages?.length ? [Y.messages[Y.messages.length - 1]] : void 0,
                abortController: void 0,
                unregisterCleanup: void 0,
                selectedAgent: void 0
            }
        }), K) $O(A);
    return K
}

// READABLE (for understanding):
function triggerAbortSignal(taskId, setAppState) {
    let wasKilled = false;

    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only abort running tasks
        if (task.status !== "running") return task;

        wasKilled = true;

        // TRIGGER ABORT - Signals agent loop to stop
        task.abortController?.abort();

        // RUN CLEANUP - Remove process handlers
        task.unregisterCleanup?.();

        // UPDATE STATE - Mark as killed
        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            // Keep only last message for memory efficiency
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            // Clear control objects
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Remove from active tracking
    if (wasKilled) {
        removeActiveAgent(taskId);
    }

    return wasKilled;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, K→wasKilled,
//          i9→atomicUpdateTask, Y→task, $O→removeActiveAgent
```

#### 8.2 Kill All Local Agents

```javascript
// ============================================
// U4q - killAllLocalAgents - Kill all running local agents
// Location: chunks.146.mjs:2029-2050
// ============================================

// READABLE (for understanding):
function killAllLocalAgents(setAppState, getAppState) {
    let state = getAppState();
    let killedIds = [];

    for (let [taskId, task] of Object.entries(state.tasks)) {
        if (task.type === "local_agent" && task.status === "running") {
            let killed = triggerAbortSignal(taskId, setAppState);
            if (killed) {
                killedIds.push(taskId);
            }
        }
    }

    return killedIds;
}

// Mapping: U4q→killAllLocalAgents
```

### Abort Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Abort Signal Propagation                             │
└─────────────────────────────────────────────────────────────────────────────┘

User triggers kill (Ctrl+F or TaskStop)
        │
        ▼
┌───────────────────┐
│ triggerAbortSignal│
│ (x66)             │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐     No      ┌─────────────────────────────┐
│ Task running?     │────────────►│ Return false (no-op)        │
└─────────┬─────────┘             └─────────────────────────────┘
          │ Yes
          ▼
┌───────────────────┐
│ abortController   │
│ .abort()          │ ──► Agent loop receives signal between turns
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ unregisterCleanup │ ──► Remove process exit handlers
│ .call()           │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Update state:     │
│ status = "killed" │ ──► UI shows "killed" immediately
│ endTime = now     │
│ Clear references  │
│ notified = false  │ ──► Will trigger notification on next poll
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ removeActiveAgent │ ──► Remove from active tracking set
└───────────────────┘
```

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

## Design Decisions Summary

| Integration | Key Decision | Rationale |
|-------------|--------------|-----------|
| Tools | Layered filtering | Multiple restriction layers compose safely |
| System Reminders | Two attachment types | Status needs immediate notification; progress can be throttled |
| Background | Shared infrastructure | Same task/output/notification system |
| Agent Teams | File-based mailboxes | Persistence, no dependencies, human-readable |
| Hooks | Isolated per-subagent | Prevents cross-contamination |
| Compact | Separate transcripts | Independent token budgets |
| State Management | Atomic updates | Consistent state transitions |
| Abort | Cooperative cancellation | Graceful tool completion before termination |

---

## Integration Test Checklist

### System Reminder Integration
- [ ] Progress attachment appears after 3 turns
- [ ] Status attachment appears on completion
- [ ] Notification shown in UI on completion
- [ ] Throttle prevents flooding

### Tool Filtering
- [ ] Background agents cannot use AskUserQuestion
- [ ] Background agents cannot use TaskOutput
- [ ] MCP tools always available
- [ ] Teammate agents get SendMessage

### Compact Integration
- [ ] Resume loads transcript correctly
- [ ] Orphaned tool results filtered
- [ ] Thinking-only messages filtered

### Hooks Integration
- [ ] PreToolUse hook called in subagent
- [ ] PostToolUse captures output
- [ ] Hooks deregistered on completion

### Background Agents
- [ ] Background task returns immediately
- [ ] Output file created and updated
- [ ] Kill signal propagates correctly

### Agent Teams
- [ ] Teammate spawns in correct backend
- [ ] Mailbox messages received
- [ ] Teammate cannot spawn teammate

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `qh` | agentLoopRunner | chunks.133.mjs:1565 | ✓ Verified |
| `Xk8` | filterToolsForSubagent | chunks.93.mjs:1568 | ✓ Verified |
| `QW6` | AgentTool | chunks.136.mjs:1512 | ✓ Verified |
| `qn4` | spawnTeammate | chunks.135.mjs:1116 | ✓ Verified |
| `wl` | readMailbox | chunks.132.mjs:3 | ✓ Verified |
| `x3` | writeToMailbox | chunks.132.mjs:22 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | ✓ Verified |
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | ✓ Verified |
| `suY` | getTaskStatusAttachments | chunks.147.mjs:1033 | ✓ Verified |
| `Zf` | registerTask | chunks.90.mjs:3019 | ✓ Verified |
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | ✓ Verified |
| `r24` | registerAgentHooks | chunks.95.mjs:1842 | ✓ Verified |
| `zZ6` | deregisterAgentHooks | chunks.95.mjs:1830 | ✓ Verified |

---

## Related Documents

- [feature_integration_matrix.md](./feature_integration_matrix.md) - Summary matrix
- [key_algorithms_deep_dive.md](./key_algorithms_deep_dive.md) - Algorithm details
- [system_reminder_deep_integration.md](./system_reminder_deep_integration.md) - Reminder system
- [mailbox_communication_source_restored.md](./mailbox_communication_source_restored.md) - Mailbox system
- [../26_background_agents/feature_integration_complete.md](../26_background_agents/feature_integration_complete.md) - Background agents