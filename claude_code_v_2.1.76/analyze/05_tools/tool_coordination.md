# Tool Coordination Patterns (Claude Code 2.1.38)

> Analysis of how tools interact with each other through shared state, caching, and mode-based restrictions.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key symbols in this document:
- `readFileState` - File content cache shared between Read/Edit/Write
- `R_6` - DELEGATE_ALLOWED_TOOLS - Tool whitelist for subagent mode
- `deriveToolUseContext` (vQ1) - Creates subagent context with inherited state

---

## Coordination Patterns Overview

Tools coordinate through several mechanisms:

| Pattern | Tools Involved | Mechanism |
|---------|----------------|-----------|
| Read→Edit/Write Cache | Read, Edit, Write | `readFileState` Map |
| Task Control | Task, TaskOutput, TaskStop | Task registry |
| Mode Restrictions | All tools | Permission context mode |
| Subagent Inheritance | Agent (Task), all tools | `deriveToolUseContext` |
| Background→Foreground | Bash, Task | Task state registry |

---

## Read→Edit/Write Coordination

### The `readFileState` Cache

**What it does:** A shared Map that caches file contents after reading, enabling Edit and Write tools to validate changes against the known file state.

**How it works:**

```javascript
// ============================================
// readFileState - File content cache
// Location: chunks.149.mjs:2603 (context creation)
// ============================================

// Context includes readFileState, inherited from parent or created fresh
return {
    readFileState: yp(q?.readFileState ?? A.readFileState),
    // ... other context fields
};

// Mapping: yp→cloneMap, q→parentContext, A→currentContext
```

**Cache structure:**

```javascript
// Map<filePath, FileState>
readFileState = new Map([
    ["/path/to/file.ts", {
        content: "file contents here",
        timestamp: 1234567890,  // mtime from getMtime()
        offset: undefined,      // For partial reads
        limit: undefined        // For partial reads
    }],
    // ... more files
]);
```

---

### Read Tool Populates Cache

**What it does:** After reading a file, the Read tool stores the content in `readFileState`.

**How it works:**

```javascript
// From chunks.170.mjs:348-352 (Read tool implementation)
// ORIGINAL:
return ft(w, z, $, _), _t(w, O, z), q.readFileState.set(w, {
    content: z,
    timestamp: aW(w),
    offset: void 0,
    limit: void 0
})

// READABLE:
// After writing file to disk and updating git watcher cache
writeFileWithEncoding(filePath, content, encoding, lineEnding);
updateGitWatcherCache(filePath, content, encoding);

// Store in readFileState cache
context.readFileState.set(filePath, {
    content: content,
    timestamp: getMtime(filePath),
    offset: undefined,
    limit: undefined
});
```

**Why this matters:**
- Edit tool checks cache to ensure file was read before editing
- Write tool validates file hasn't changed since last read
- Cache includes timestamp for staleness detection

---

### Edit Tool Validates Cache

**What it does:** Before allowing an edit, the Edit tool checks if the file was read first.

**How it works:**

```javascript
// From chunks.134.mjs:2229-2234 (Edit tool validation)
// ORIGINAL:
let _ = z.readFileState.get(w);
if (!_) return {
    result: !1,
    behavior: "ask",
    message: "File has not been read yet. Read it first before writing to it."
};

// READABLE:
let fileState = context.readFileState.get(filePath);
if (!fileState) {
    return {
        result: false,
        behavior: "ask",
        message: "File has not been read yet. Read it first before writing to it."
    };
}
```

**Why this approach:**
- **Safety**: Prevents editing files without context
- **Consistency**: Ensures LLM knows current file content
- **Error prevention**: Avoids destructive edits on unknown content

**Key insight:** The error message explicitly tells the LLM to "Read it first" - guiding self-correction.

---

### Coordination Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    READ→EDIT COORDINATION                         │
│                                                                  │
│   LLM calls Read tool                                           │
│       │                                                          │
│       ▼                                                          │
│   readFileState.set("/path/file.ts", { content, timestamp })   │
│       │                                                          │
│       ▼                                                          │
│   LLM sees file content, decides to edit                        │
│       │                                                          │
│       ▼                                                          │
│   LLM calls Edit tool with old_string/new_string               │
│       │                                                          │
│       ▼                                                          │
│   Edit checks: readFileState.get("/path/file.ts")              │
│       │                                                          │
│       ├──▶ Found → Validate string exists, apply edit           │
│       │                                                          │
│       └──▶ Not found → Error: "Read it first"                   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Mode-Based Tool Restrictions

### DELEGATE_ALLOWED_TOOLS (R_6)

**What it does:** A whitelist of tools allowed for subagents running in "delegate" mode.

**How it works:**

```javascript
// ============================================
// DELEGATE_ALLOWED_TOOLS - Tool whitelist for delegate mode
// Location: chunks.89.mjs:876
// ============================================

// ORIGINAL:
R_6 = new Set([vh, VK1, iB, Nh, NK1, TK1, DR, fK])

// READABLE:
DELEGATE_ALLOWED_TOOLS = new Set([
    "TeamCreate",     // vh
    "TeamDelete",     // VK1
    "SendMessage",    // iB
    "TaskCreate",     // Nh
    "TaskGet",        // NK1
    "TaskList",       // TK1
    "TaskUpdate",     // DR
    "Task"            // fK - Agent tool (spawn subagents)
]);
```

**Why these tools:**
- **Task management**: Subagents can create and track tasks
- **Team coordination**: Subagents can participate in teams
- **Agent spawning**: Subagents can spawn their own subagents

**Excluded tools (NOT in delegate mode):**
- `Bash` - Security risk
- `Read`/`Write`/`Edit` - File system access
- `Grep`/`Glob` - File system search
- `WebFetch`/`WebSearch` - Network access

---

### Mode-Based Tool Filtering

**What it does:** When a subagent runs in delegate mode, its tool set is filtered.

**How it works:**

```javascript
// From chunks.141.mjs:1481 (assembleSessionToolSet)
// ORIGINAL:
if (A.mode === "delegate") return z.filter((w) => R_6.has(w.name));

// READABLE:
if (permissionContext.mode === "delegate") {
    return allTools.filter((tool) => DELEGATE_ALLOWED_TOOLS.has(tool.name));
}
```

**Flow:**

```
Subagent spawned with mode: "delegate"
    │
    ▼
assembleSessionToolSet(permissionContext, mcpTools)
    │
    ▼
mode === "delegate" → Filter to DELEGATE_ALLOWED_TOOLS only
    │
    ▼
Subagent receives restricted tool set:
    - TeamCreate, TeamDelete, SendMessage
    - TaskCreate, TaskGet, TaskList, TaskUpdate
    - Task (to spawn sub-subagents)
```

---

### Background Agent Tool Restrictions

**What it does:** Background agents have a different tool whitelist.

**How it works:**

```javascript
// From chunks.89.mjs:867 (initialization)
Bj1 = new Set([uj1, bW, N_6, fK, TH, bj1])

// BACKGROUND_AGENT_ALLOWED_TOOLS = new Set([
//     "TaskOutput",      // uj1
//     "ExitPlanMode",    // bW
//     "EnterPlanMode",   // N_6
//     "Task",            // fK
//     "AskUserQuestion", // TH
//     "TaskStop"         // bj1
// ]);
```

**Why this matters:**
- Background agents run autonomously
- Limited tool set prevents runaway behavior
- Can still interact with user via AskUserQuestion
- Can spawn subagents via Task

---

## Subagent Context Inheritance

### deriveToolUseContext (vQ1)

**What it does:** Creates a tool use context for a subagent, inheriting relevant state from the parent.

**How it works:**

```javascript
// ============================================
// deriveToolUseContext - Subagent context creation
// Location: chunks.149.mjs:2589-2620
// ============================================

// ORIGINAL (partial):
function vQ1(A, q, K, Y, z, w) {
    // ... create child abort controller ...
    return {
        readFileState: yp(q?.readFileState ?? A.readFileState),
        nestedMemoryAttachmentTriggers: new Set,
        dynamicSkillDirTriggers: new Set,
        toolDecisions: void 0,
        abortController: K,
        getAppState: Y,
        setAppState: O,
        // ... more fields
        options: {
            ...A.options,
            tools: w,  // Filtered tool set
            toolDefinitions: z,
            agentDefinitions: {
                ...A.options.agentDefinitions,
                activeAgents: new Map(A.options.agentDefinitions.activeAgents)
            }
        }
    };
}

// READABLE:
function deriveToolUseContext(parentContext, childReadFileState, childAbortController, getAppState, toolDefinitions, filteredToolSet) {
    return {
        // Inherit file cache (or use parent's)
        readFileState: cloneMap(childReadFileState ?? parentContext.readFileState),

        // Fresh sets for subagent-specific triggers
        nestedMemoryAttachmentTriggers: new Set(),
        dynamicSkillDirTriggers: new Set(),

        // No inherited tool decisions
        toolDecisions: undefined,

        // New abort controller for cancellation
        abortController: childAbortController,

        // Shared app state access
        getAppState: getAppState,

        // Filtered tool set for this subagent
        options: {
            ...parentContext.options,
            tools: filteredToolSet,
            toolDefinitions: toolDefinitions
        }
    };
}
```

**Key insight:** The `readFileState` is either:
1. Cloned from parent if subagent has its own cache
2. Inherited directly if subagent shares parent's cache

This enables both **isolation** (subagent has separate file state) and **sharing** (subagent sees parent's read files).

---

## Task Control Coordination

### Task→TaskOutput/TaskStop

**What it does:** The Task tool registers tasks that TaskOutput and TaskStop can later reference.

**Coordination flow:**

```
┌──────────────────────────────────────────────────────────────────┐
│                    TASK CONTROL COORDINATION                      │
│                                                                  │
│   Task tool spawns agent/bash                                    │
│       │                                                          │
│       ▼                                                          │
│   registerTask(taskId, taskRecord)                              │
│       │                                                          │
│       │   taskRecord = {                                         │
│       │       taskId: "xxx",                                     │
│       │       type: "local_agent" | "local_bash",               │
│       │       status: "running",                                 │
│       │       abortController: AbortController                   │
│       │   }                                                      │
│       │                                                          │
│       ▼                                                          │
│   Task completes OR user wants to check/stop                    │
│       │                                                          │
│       ├──────────────────┬─────────────────────┐                │
│       ▼                  ▼                     ▼                 │
│   TaskOutput         TaskStop              Background           │
│   (get output)       (kill task)           notification         │
│       │                  │                     │                 │
│       ▼                  ▼                     ▼                 │
│   buildTaskSnapshot  getKillHandlerForType  notifyTaskCompletion│
│       │                  │                                       │
│       ▼                  ▼                                       │
│   Returns output     Kills process/aborts                       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

### Task Registry

**What it does:** A global registry tracking all active tasks.

**How it works:**

```javascript
// Task types and their handlers
const TASK_HANDLERS = {
    "local_bash": {
        kill: killBashTask,      // hjA - terminates shell process
        getOutput: readFullOutput // M_6 - reads output file
    },
    "local_agent": {
        kill: killAgentTask,     // na - aborts agent controller
        getOutput: readFullOutput
    },
    "remote_agent": {
        kill: remoteKillHandler, // Qi4 - status update only
        getOutput: readFullOutput
    }
};

// Get handler by task type
function getKillHandlerForType(taskType) {
    return TASK_HANDLERS[taskType];
}
```

---

## Background→Foreground Coordination

### Bash Background Task Detection

**What it does:** Bash tool detects if a command should run in background based on duration.

**How it works:**

```javascript
// From chunks.170.mjs
// If bash command runs longer than threshold, automatically
// convert to background task

const BASH_BACKGROUND_TIMEOUT_MS = 2000; // q_q

// If command is still running after 2 seconds:
// 1. Return immediately with background status
// 2. User can continue working
// 3. TaskOutput to retrieve results later
```

**Coordination:**

```
Bash command starts
    │
    ▼
Timer: 2000ms timeout
    │
    ├──▶ Completes within 2s → Return output directly
    │
    └──▶ Still running after 2s
            │
            ▼
        Convert to background task
            │
            ▼
        Return { status: "async_launched", outputFile: "..." }
            │
            ▼
        User can call TaskOutput to get results
```

---

## Cross-Tool State Sharing

### State Shared Across Tools

| State | Owner | Consumers | Purpose |
|-------|-------|-----------|---------|
| `readFileState` | Read | Edit, Write | File content cache |
| `backgroundTasks` | Task/ Bash | TaskOutput, TaskStop | Task registry |
| `toolPermissionContext` | Session | All tools | Mode/permission checks |
| `abortController` | Session | All tools | Cancellation |
| `messages` | Session | Agent, Task | Conversation history |

---

## Coordination Anti-Patterns

### What NOT to Do

1. **Direct tool calls**: Tools don't call other tools directly
   - ❌ Edit calling Read internally
   - ✅ Edit checking shared `readFileState`

2. **Synchronous coordination**: Tools coordinate via shared state, not return values
   - ❌ Bash returning output to Task
   - ✅ Bash writing to file, TaskOutput reading file

3. **Circular dependencies**: Tool coordination is acyclic
   - Read → Edit (Read populates cache, Edit consumes)
   - Task → TaskOutput (Task registers, TaskOutput queries)

---

## Related Documents

- [tool_execution_pipeline.md](./tool_execution_pipeline.md) - How tools are executed
- [task_management_tools.md](./task_management_tools.md) - Task control tools
- [agent_tool.md](./agent_tool.md) - Subagent spawning

---

## Additional Coordination Patterns

### Task→TaskOutput/TaskStop Detailed Flow

**What it does:** Complete coordination flow between Task, TaskOutput, and TaskStop tools.

```javascript
// ============================================
// Task Registry Implementation
// Location: chunks.139.mjs, chunks.141.mjs
// ============================================

// Task registration (when Task tool spawns agent/bash)
function registerTask(taskId, taskRecord, setAppState) {
    setAppState((state) => ({
        ...state,
        backgroundTasks: new Map(state.backgroundTasks).set(taskId, taskRecord)
    }));
}

// TaskOutput retrieval (gets output from completed task)
async function TaskOutput_call({ task_id, block, timeout }, context) {
    let appState = await context.getAppState();
    let task = appState.backgroundTasks.get(task_id);

    if (!task) {
        throw Error(`Task ${task_id} not found`);
    }

    // If blocking and task still running, wait for completion
    if (block && task.status === "running") {
        await waitForTaskCompletion(task_id, timeout);
        task = (await context.getAppState()).backgroundTasks.get(task_id);
    }

    // Build snapshot for response
    return {
        data: {
            status: task.status,
            output: await readTaskOutput(task.outputFile),
            exitCode: task.exitCode,
            error: task.error
        }
    };
}

// TaskStop termination
async function TaskStop_call({ task_id }, context) {
    let appState = await context.getAppState();
    let task = appState.backgroundTasks.get(task_id);

    if (!task) {
        return { data: { success: false, message: `Task ${task_id} not found` } };
    }

    // Get kill handler for task type
    let killHandler = getKillHandlerForType(task.type);
    await killHandler.kill(task);

    // Update task status
    context.setAppState((state) => {
        let tasks = new Map(state.backgroundTasks);
        tasks.set(task_id, { ...tasks.get(task_id), status: "cancelled" });
        return { ...state, backgroundTasks: tasks };
    });

    return { data: { success: true, message: `Task ${task_id} cancelled` } };
}

// Mapping: TaskOutput_call→TaskOutputHandler, TaskStop_call→TaskStopHandler
```

**Task Record Structure:**

```javascript
interface TaskRecord {
    taskId: string;
    type: "local_agent" | "local_bash" | "remote_agent";
    status: "running" | "completed" | "failed" | "cancelled";

    // For local tasks
    abortController?: AbortController;
    process?: ChildProcess;  // For bash tasks
    agentPromise?: Promise;  // For agent tasks

    // Output storage
    outputFile: string;      // File path for output

    // Completion data
    exitCode?: number;
    error?: string;

    // Timestamps
    startedAt: number;
    completedAt?: number;
}
```

---

### Todo→Task Coordination

**What it does:** Tasks can be linked to Todo items for progress tracking.

```javascript
// ============================================
// Todo-Task Coordination
// Location: chunks.141.mjs (TodoWrite tool)
// ============================================

// TodoWrite can reference active tasks
interface TodoItem {
    id: string;
    subject: string;
    status: "pending" | "in_progress" | "completed";
    activeForm?: string;  // Spinner text when in_progress

    // Task linkage
    metadata?: {
        taskId?: string;  // Links todo to background task
        source?: string;  // Who created this todo
    };
}

// When task completes, related todos can be updated
function onTaskCompletion(taskId, result, setAppState) {
    setAppState((state) => {
        let todos = state.todos.map((todo) => {
            if (todo.metadata?.taskId === taskId) {
                return {
                    ...todo,
                    status: result.success ? "completed" : "in_progress"
                    // Keep in_progress if failed so agent can retry
                };
            }
            return todo;
        });
        return { ...state, todos };
    });
}
```

---

### File Write→Read Cache Invalidation

**What it does:** When Write or Edit modifies a file, the readFileState cache must be updated.

```javascript
// ============================================
// Cache Update After Write/Edit
// Location: chunks.134.mjs (Edit tool), chunks.146.mjs (Write tool)
// ============================================

// After Edit tool applies change:
function updateReadFileStateAfterEdit(filePath, newContent, context) {
    context.readFileState.set(filePath, {
        content: newContent,
        timestamp: Date.now(),  // Current mtime
        offset: undefined,
        limit: undefined
    });
}

// After Write tool creates/overwrites file:
function updateReadFileStateAfterWrite(filePath, content, context) {
    context.readFileState.set(filePath, {
        content: content,
        timestamp: getFileMtime(filePath),
        offset: undefined,
        limit: undefined
    });
}

// Key insight: The cache is UPDATED, not invalidated
// This allows subsequent edits without re-reading
```

---

### Agent→Subagent Tool Restriction

**What it does:** When Agent tool spawns a subagent, tool availability is restricted based on agent type.

```javascript
// ============================================
// Subagent Tool Restriction Matrix
// Location: chunks.132.mjs (Agent tool), chunks.141.mjs (tool assembly)
// ============================================

const AGENT_TYPE_TOOL_RESTRICTIONS = {
    // General-purpose agent: all tools available
    "general-purpose": {
        filter: (tools) => tools  // No filtering
    },

    // Explore agent: read-only tools
    "Explore": {
        filter: (tools) => tools.filter(t =>
            ["Read", "Grep", "Glob", "TaskOutput", "TaskList"].includes(t.name)
        )
    },

    // Plan agent: planning tools only
    "Plan": {
        filter: (tools) => tools.filter(t =>
            ["Read", "EnterPlanMode", "ExitPlanMode", "AskUserQuestion"].includes(t.name)
        )
    }
};

// When spawning subagent:
let filteredTools = AGENT_TYPE_TOOL_RESTRICTIONS[agentType]
    ? AGENT_TYPE_TOOL_RESTRICTIONS[agentType].filter(allTools)
    : allTools;

// Create derived context with filtered tools
let subagentContext = deriveToolUseContext(
    parentContext,
    null,  // New readFileState
    childAbortController,
    getAppState,
    toolDefinitions,
    filteredTools
);
```

---

### Concurrent Tool Execution Coordination

**What it does:** When multiple tools execute concurrently (isConcurrencySafe=true), coordination ensures no conflicts.

```javascript
// ============================================
// Concurrent Execution Queue
// Location: chunks.149.mjs (tool execution orchestrator)
// ============================================

// Tools with isConcurrencySafe()=true can run in parallel
// Tools with isConcurrencySafe()=false are serialized

class ToolExecutionQueue {
    constructor() {
        this.runningUnsafeTools = new Set();  // Track unsafe tools
        this.pendingQueue = [];                // Waiting executions
    }

    async execute(tool, input, context) {
        // Safe tools can run immediately
        if (tool.isConcurrencySafe(input)) {
            return this.runTool(tool, input, context);
        }

        // Unsafe tools must wait for other unsafe tools to complete
        while (this.runningUnsafeTools.size > 0) {
            await this.waitForUnsafeToolCompletion();
        }

        this.runningUnsafeTools.add(tool.name);
        try {
            return await this.runTool(tool, input, context);
        } finally {
            this.runningUnsafeTools.delete(tool.name);
            // Notify waiting tools
            this.notifyCompletion();
        }
    }
}

// This ensures:
// - Read, Grep, Glob can all run in parallel with each other
// - Write, Edit, Bash run sequentially (one at a time)
// - Safe tools can run during unsafe tool execution
```

---

### Bash→Edit Integration (Simulated Sed)

**What it does:** Bash can trigger Edit-like behavior through simulated sed commands.

```javascript
// ============================================
// Simulated Sed Integration
// Location: chunks.150.mjs (Bash tool)
// ============================================

// Bash tool detects sed-like commands and tracks file modifications
function detectSimulatedSed(command) {
    // Pattern: sed -i 's/old/new/g' file.txt
    let sedMatch = command.match(/sed\s+(-i|--in-place).*?\s+(\S+)$/);
    if (sedMatch) {
        return {
            isSimulatedSed: true,
            filePath: sedMatch[2]
        };
    }
    return null;
}

// If detected, update readFileState after command completes
async function bashCall(input, context, ...) {
    let sedInfo = detectSimulatedSed(input.command);

    // Execute command...

    if (sedInfo && result.exitCode === 0) {
        // File was modified - invalidate cache for this file
        context.readFileState.delete(sedInfo.filePath);

        // Emit telemetry for file modification tracking
        emitTelemetry("bash_file_modified", {
            filePath: sedInfo.filePath,
            command: input.command
        });
    }
}

// This enables:
// - Proper cache invalidation for sed commands
// - Attribution tracking for file changes via Bash
// - Warnings if subsequent Edit tries to modify same file
```

---

### Plan Mode Tool Restrictions

**What it does:** Plan mode has specific tool restrictions to prevent unintended modifications.

```javascript
// ============================================
// Plan Mode Tool Access
// ============================================

// In plan mode, only these tools are available:
const PLAN_MODE_TOOLS = new Set([
    "Read",           // Read files to understand context
    "Grep",           // Search for patterns
    "Glob",           // Find files
    "EnterPlanMode",  // Already in plan mode, but can confirm
    "ExitPlanMode",   // Exit plan mode
    "AskUserQuestion" // Ask for clarification
]);

// Tools BLOCKED in plan mode:
// - Write, Edit, NotebookEdit (file modifications)
// - Bash (command execution)
// - Task (agent spawning)
// - TeamCreate, TeamDelete (team operations)

// This ensures plan mode is truly "plan-only" - no side effects
```

---

### Git State Coordination

**What it does:** Tools that modify files coordinate with git state tracking.

```javascript
// ============================================
// Git State Coordination
// Location: chunks.146.mjs (file operations)
// ============================================

// After Write/Edit, git state must be updated
async function writeFileWithGitUpdate(filePath, content, context) {
    // Write file
    await fs.writeFile(filePath, content);

    // Update git index if in git repo
    if (await isGitRepo()) {
        // Stage change (implicit)
        // Git watcher will detect and update state
    }

    // Notify git watcher cache
    if (context.gitWatcher) {
        context.gitWatcher.invalidateCache(filePath);
    }
}

// Git state is used by:
// - Bash (for commit commands)
// - UI (for showing uncommitted changes)
// - Prompt (for showing current branch/changes)
```