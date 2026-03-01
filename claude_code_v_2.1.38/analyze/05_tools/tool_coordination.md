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